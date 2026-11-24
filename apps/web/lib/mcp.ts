import type { McpAuthOptions } from "@clerk/mcp-tools/next";

const resourceUrl = process.env.MCP_RESOURCE_URL?.trim();
if (!resourceUrl) throw new Error("MCP_RESOURCE_URL is not set");

export const mcpAuthOptions = {
  resourceUrl,
  requiredScopes: ["profile"],
  discoverable: false,
} satisfies McpAuthOptions;
