import { isClerkAuthInfo, withClerkMcpAuth } from "@clerk/mcp-tools/next";
import { clerkClient } from "@clerk/nextjs/server";
import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import {
  createBookmark, deleteBookmark, ensureProfile, listBookmarks, listCollections,
  listTrash, restoreBookmark, updateBookmark,
} from "@/lib/library";
import type { CallToolResult, ServerContext } from "@modelcontextprotocol/server";
import { mcpAuthOptions } from "@/lib/mcp";
import {
  MCP_APP_MIME_TYPE,
  STARBOARD_ICON_DATA_URI,
  STARBOARD_LIBRARY_UI_URI,
  renderStarboardLibraryHtml,
} from "@/lib/mcp-ui";

const bookmarkInput = z.object({
  title: z.string().trim().min(1).max(500),
  url: z.string().url().max(4096).refine((value) => {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) && !url.username && !url.password;
  }, "URL must be a credential-free HTTP or HTTPS URL"),
  description: z.string().trim().max(2000).nullable().default(null),
  collectionId: z.string().uuid().nullable().default(null),
});
const idSchema = z.string().uuid();

const libraryUiMeta = {
  ui: { resourceUri: STARBOARD_LIBRARY_UI_URI },
  "ui/resourceUri": STARBOARD_LIBRARY_UI_URI,
};

const starboardIcons = [{ src: STARBOARD_ICON_DATA_URI, mimeType: "image/svg+xml" }];

function textResult(text: string): CallToolResult {
  return { content: [{ type: "text", text }] };
}

const handler = createMcpHandler((server) => {
  const userId = (ctx: ServerContext) => {
    const info = ctx.http?.authInfo;
    if (!isClerkAuthInfo(info)) throw new Error("Clerk OAuth authentication required.");
    return info.extra.userId;
  };

  server.registerResource(
    "starboard_library_ui",
    STARBOARD_LIBRARY_UI_URI,
    {
      title: "Starboard Library",
      description: "Interactive bookmark, collection, and trash manager for Starboard.",
      mimeType: MCP_APP_MIME_TYPE,
      icons: starboardIcons,
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: MCP_APP_MIME_TYPE,
          text: renderStarboardLibraryHtml(),
          _meta: {
            ui: {
              prefersBorder: true,
              csp: { connectDomains: [], resourceDomains: [] },
            },
          },
        },
      ],
    }),
  );

  server.registerTool(
    "list_bookmarks",
    {
      description: "List active bookmarks belonging to the authenticated user.",
      icons: starboardIcons,
      _meta: libraryUiMeta,
    },
    async (ctx) => {
      const bookmarks = await listBookmarks(userId(ctx));
      return {
        content: [{ type: "text", text: JSON.stringify(bookmarks) }],
        structuredContent: { view: "bookmarks", bookmarks },
      };
    },
  );
  server.registerTool(
    "list_collections",
    {
      description: "List bookmark collections belonging to the authenticated user.",
      icons: starboardIcons,
      _meta: libraryUiMeta,
    },
    async (ctx) => {
      const collections = await listCollections(userId(ctx));
      return {
        content: [{ type: "text", text: JSON.stringify(collections) }],
        structuredContent: { view: "collections", collections },
      };
    },
  );
  server.registerTool(
    "list_trash",
    {
      description: "List deleted bookmarks belonging to the authenticated user.",
      icons: starboardIcons,
      _meta: libraryUiMeta,
    },
    async (ctx) => {
      const trash = await listTrash(userId(ctx));
      return {
        content: [{ type: "text", text: JSON.stringify(trash) }],
        structuredContent: { view: "trash", trash },
      };
    },
  );
  server.registerTool("create_bookmark", { description: "Save a bookmark for the authenticated user.", icons: starboardIcons, inputSchema: bookmarkInput }, async (input, ctx) => {
    const id = userId(ctx);
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(id);
    await ensureProfile({
      clerkUserId: id,
      email: user.primaryEmailAddress?.emailAddress ?? null,
      displayName: user.fullName ?? user.username ?? null,
    });
    await createBookmark(id, input);
    return textResult("Bookmark created.");
  });
  server.registerTool("edit_bookmark", { description: "Update a bookmark owned by the authenticated user.", icons: starboardIcons, inputSchema: z.object({ id: idSchema, ...bookmarkInput.shape }) }, async ({ id, ...input }, ctx) => {
    await updateBookmark(userId(ctx), id, input);
    return textResult("Bookmark updated.");
  });
  server.registerTool("move_bookmark_to_trash", { description: "Move an owned bookmark to trash.", icons: starboardIcons, inputSchema: z.object({ id: idSchema }) }, async ({ id }, ctx) => {
    await deleteBookmark(userId(ctx), id);
    return textResult("Bookmark moved to trash.");
  });
  server.registerTool("restore_bookmark", { description: "Restore an owned bookmark from trash.", icons: starboardIcons, inputSchema: z.object({ id: idSchema }) }, async ({ id }, ctx) => {
    await restoreBookmark(userId(ctx), id);
    return textResult("Bookmark restored.");
  });
}, {
  serverInfo: { name: "Starboard", version: "1.0.0" },
});

const authHandler = mcpAuthOptions
  ? withClerkMcpAuth(handler, mcpAuthOptions)
  : () => new Response(null, { status: 404 });

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Authorization, Content-Type, Mcp-Protocol-Version, Mcp-Method, Mcp-Name",
  "Access-Control-Expose-Headers": "WWW-Authenticate",
};

async function corsAuthHandler(req: Request) {
  const response = await authHandler(req);
  const headers = new Headers(response.headers);
  for (const [name, value] of Object.entries(corsHeaders)) headers.set(name, value);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function preflight() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export {
  corsAuthHandler as GET,
  corsAuthHandler as POST,
  corsAuthHandler as DELETE,
  preflight as OPTIONS,
};
