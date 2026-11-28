import type { McpAuthOptions } from "@clerk/mcp-tools/next";
import { generateProtectedResourceMetadata } from "@clerk/mcp-tools/server";

export const productionResource = "https://starboard.razeev.com/mcp";
const resourceUrl = process.env.MCP_RESOURCE_URL?.trim() || productionResource;
if (resourceUrl === productionResource) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!publishableKey || generateProtectedResourceMetadata({ resourceUrl, publishableKey })
    .authorization_servers[0] !== "https://clerk.starboard.razeev.com") {
    throw new Error("The hosted MCP resource requires the production StartBoard Clerk instance.");
  }
}

export const mcpAuthOptions = {
  resourceUrl,
  requiredScopes: ["profile"],
  discoverable: false,
} satisfies McpAuthOptions;
