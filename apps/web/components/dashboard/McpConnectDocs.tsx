"use client";

import { useState } from "react";
import type { ComponentType, SVGProps } from "react";
import {
  ClaudeAI,
  ClaudeCode,
  CursorDark,
  GoogleAntigravity,
  ModelContextProtocolDark,
  VisualStudioCode,
} from "@ridemountainpig/svgl-react";
import { Badge } from "@/components/hangry-ui/components/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/hangry-ui/components/card";
import { CodeBlock } from "@/components/hangry-ui/components/code-block";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/hangry-ui/components/tabs";

type McpConnectDocsProps = {
  endpointUrl: string;
  localEndpointUrl?: string;
  isConfigured: boolean;
};

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

type ClientGuide = {
  id: string;
  label: string;
  Icon: IconComponent;
  language: string;
  filename: string;
  instructions: string;
  snippet: (endpointUrl: string) => string;
};

const CLIENT_GUIDES: ClientGuide[] = [
  {
    id: "antigravity",
    label: "Antigravity",
    Icon: GoogleAntigravity,
    language: "json",
    filename: "mcp.json",
    instructions: "Add this server entry to your Antigravity MCP configuration:",
    snippet: (endpointUrl) =>
      JSON.stringify(
        {
          mcpServers: {
            starboard: {
              command: "npx",
              args: ["-y", "mcp-remote", endpointUrl],
            },
          },
        },
        null,
        2,
      ),
  },
  {
    id: "claude-desktop",
    label: "Claude Desktop",
    Icon: ClaudeAI,
    language: "json",
    filename: "claude_desktop_config.json",
    instructions: "Add this server entry to your claude_desktop_config.json file:",
    snippet: (endpointUrl) =>
      JSON.stringify(
        {
          mcpServers: {
            starboard: {
              command: "npx",
              args: ["-y", "mcp-remote", endpointUrl],
            },
          },
        },
        null,
        2,
      ),
  },
  {
    id: "cursor",
    label: "Cursor",
    Icon: CursorDark,
    language: "json",
    filename: ".cursor/mcp.json",
    instructions: "Add this to .cursor/mcp.json (or your global Cursor MCP settings):",
    snippet: (endpointUrl) =>
      JSON.stringify(
        {
          mcpServers: {
            starboard: {
              url: endpointUrl,
            },
          },
        },
        null,
        2,
      ),
  },
  {
    id: "claude-code",
    label: "Claude Code",
    Icon: ClaudeCode,
    language: "bash",
    filename: "",
    instructions: "Run this command in your terminal to register Starboard via HTTP transport:",
    snippet: (endpointUrl) => `claude mcp add --transport http starboard ${endpointUrl}`,
  },
  {
    id: "vscode",
    label: "VS Code",
    Icon: VisualStudioCode,
    language: "json",
    filename: ".vscode/mcp.json",
    instructions: "Add this server block to your workspace .vscode/mcp.json file:",
    snippet: (endpointUrl) =>
      JSON.stringify(
        {
          servers: {
            starboard: {
              type: "http",
              url: endpointUrl,
              oauth: {
                clientId: "TdtNnsU34oU9ZcMB",
              },
            },
          },
        },
        null,
        2,
      ),
  },
];



function StarboardMark({ className = "size-5" }: Readonly<{ className?: string }>) {
  return (
    <svg aria-hidden="true" viewBox="0 0 64 64" className={className}>
      <rect width="64" height="64" rx="16" fill="#1e1e2e" />
      <path
        d="M32 11c1.9 12.6 8.4 19.1 21 21-12.6 1.9-19.1 8.4-21 21-1.9-12.6-8.4-19.1-21-21 12.6-1.9 19.1-8.4 21-21Z"
        fill="#cba6f7"
      />
    </svg>
  );
}

export function McpConnectDocs({
  endpointUrl,
  localEndpointUrl,
  isConfigured,
}: McpConnectDocsProps) {
  const [selectedClient, setSelectedClient] = useState<string>(CLIENT_GUIDES[0]!.id);
  const [envTarget, setEnvTarget] = useState<"production" | "local">("production");
  const activeEndpointUrl =
    envTarget === "local" && localEndpointUrl ? localEndpointUrl : endpointUrl;

  return (
    <div className="mt-8 space-y-6">
      <Card className="max-w-none">
        <CardHeader>
          <div className="flex items-start gap-3.5">
            <div className="flex shrink-0 items-center gap-1.5" aria-hidden="true">
              <span className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-background">
                <StarboardMark className="size-6" />
              </span>
              <span className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-background">
                <ModelContextProtocolDark width={18} height={18} className="size-4.5" />
              </span>
            </div>
            <div>
              <CardTitle>MCP Endpoint</CardTitle>
              <CardDescription className="mt-1 text-sm leading-6">
                Remote Streamable HTTP endpoint protected with Clerk OAuth 2.1 (dynamic client
                registration, <code className="font-mono text-xs text-foreground">profile</code>{" "}
                scope).
              </CardDescription>
            </div>
          </div>
          <CardAction className="flex flex-wrap items-center gap-2">
            {localEndpointUrl && (
              <Tabs
                value={envTarget}
                onValueChange={(value) =>
                  setEnvTarget(value === "local" ? "local" : "production")
                }
                className="w-auto"
              >
                <TabsList aria-label="Endpoint environment">
                  <TabsTrigger value="production" className="text-xs">
                    Production
                  </TabsTrigger>
                  <TabsTrigger value="local" className="text-xs">
                    Local
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            )}
            <Badge variant={isConfigured ? "purple" : "error"}>
              {isConfigured ? "Active" : "Set MCP_RESOURCE_URL"}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent>
          <CodeBlock language="text" code={activeEndpointUrl} />
        </CardContent>
      </Card>

      <Card className="max-w-none">
        <CardHeader>
          <CardTitle>Connect a Client</CardTitle>
          <CardDescription className="text-sm leading-6">
            Pick your AI client below, paste the configuration, and sign in with Starboard when
            prompted.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs value={selectedClient} onValueChange={setSelectedClient}>
            <TabsList
              variant="line"
              aria-label="MCP client setup guides"
              className="w-full justify-start overflow-x-auto border-b border-border pb-1"
            >
              {CLIENT_GUIDES.map((client) => {
                const ClientLogo = client.Icon;
                return (
                  <TabsTrigger key={client.id} value={client.id} className="flex-none">
                    <ClientLogo width={16} height={16} aria-hidden="true" />
                    <span>{client.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {CLIENT_GUIDES.map((client) => (
              <TabsContent key={client.id} value={client.id} className="pt-3">
                <p className="mb-4 text-sm text-muted-foreground">{client.instructions}</p>
                <CodeBlock
                  language={client.language}
                  filename={client.filename}
                  code={client.snippet(activeEndpointUrl)}
                />
              </TabsContent>
            ))}
          </Tabs>

        </CardContent>
      </Card>
    </div>
  );
}
