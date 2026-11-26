import type { McpAuthOptions } from "@clerk/mcp-tools/next";
import { getSiteUrl } from "@/lib/site-url";

const configuredResourceUrl = process.env.MCP_RESOURCE_URL?.trim();
const resourceUrl = configuredResourceUrl
  ? configuredResourceUrl
  : new URL("/mcp", getSiteUrl()).href;

export const mcpAuthOptions = {
  resourceUrl,
  requiredScopes: ["profile"],
  discoverable: false,
} satisfies McpAuthOptions;
