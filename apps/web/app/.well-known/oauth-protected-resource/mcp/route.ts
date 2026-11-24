import { metadataCorsHandler, protectedResourceMetadataHandler } from "@clerk/mcp-tools/next";
import { mcpAuthOptions } from "@/lib/mcp";

export const GET = mcpAuthOptions
  ? protectedResourceMetadataHandler(mcpAuthOptions)
  : () => new Response(null, { status: 404 });
export const OPTIONS = metadataCorsHandler();
