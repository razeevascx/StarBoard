import type { McpAuthOptions } from "@clerk/mcp-tools/next";
import { getSiteUrl } from "@/lib/site-url";

const resourceUrl = process.env.MCP_RESOURCE_URL?.trim() || new URL("/mcp", getSiteUrl()).href;

export const mcpAuthOptions = {
  resourceUrl,
  requiredScopes: ["profile"],
} satisfies McpAuthOptions;
