import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { McpConnectDocs } from "@/components/dashboard/McpConnectDocs";
import { SectionHeading } from "@/components/SectionHeading";
import { mcpAuthOptions } from "@/lib/mcp";
import { getSiteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "MCP | Starboard",
  robots: { index: false, follow: false },
};

export default async function DashboardMcpPage() {
  await auth.protect();

  const productionEndpointUrl = new URL("/mcp", getSiteUrl()).href;
  const localEndpointUrl =
    mcpAuthOptions.resourceUrl !== productionEndpointUrl ? mcpAuthOptions.resourceUrl : undefined;

  return (
    <>
      <SectionHeading
        id="mcp-title"
        eyebrow="Model Context Protocol"
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
