import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { McpConnectDocs } from "@/components/dashboard/McpConnectDocs";
import { SectionHeading } from "@/components/SectionHeading";
import { mcpAuthOptions, productionResource } from "@/lib/mcp";

export const metadata: Metadata = {
  title: "MCP | Starboard",
  robots: { index: false, follow: false },
};

export default async function DashboardMcpPage() {
  await auth.protect();

  const productionEndpointUrl = productionResource;
  const localEndpointUrl =
    ["localhost", "127.0.0.1", "[::1]"].includes(new URL(mcpAuthOptions.resourceUrl).hostname)
      ? mcpAuthOptions.resourceUrl
      : undefined;

  return (
    <>
      <SectionHeading
        id="mcp-title"
        title="MCP"
        description="Connect AI assistants to your Starboard bookmarks, collections, and trash over OAuth."
      />
      <McpConnectDocs
        endpointUrl={productionEndpointUrl}
        localEndpointUrl={localEndpointUrl}
        isConfigured={Boolean(mcpAuthOptions)}
      />
    </>
  );
}
