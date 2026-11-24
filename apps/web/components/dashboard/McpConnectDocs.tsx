"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { ComponentType, SVGProps } from "react";
import {
  ClaudeAI,
  ClaudeCode,
  CursorDark,
  GoogleAntigravity,
  ModelContextProtocolDark,
  VisualStudioCode,
} from "@ridemountainpig/svgl-react";
import {

  Check,
  Copy,
} from "lucide-react";

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
  instructions: string;
  snippet: (endpointUrl: string) => string;
};

const CLIENT_GUIDES: ClientGuide[] = [
  {
    id: "antigravity",
    label: "Antigravity",
    Icon: GoogleAntigravity,
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
    instructions: "Run this command in your terminal to register Starboard via HTTP transport:",
    snippet: (endpointUrl) => `claude mcp add --transport http starboard ${endpointUrl}`,
  },
  {
    id: "vscode",
    label: "VS Code",
    Icon: VisualStudioCode,
    instructions: "Add this server block to your workspace .vscode/mcp.json file:",
    snippet: (endpointUrl) =>
      JSON.stringify(
        {
          servers: {
            starboard: {
              type: "http",
              url: endpointUrl,
            },
          },
        },
        null,
        2,
      ),
  },
];


function StarboardMark({ className = "size-5" }: { className?: string }) {
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

function CopyButton({ targetId, label }: { targetId: string; label: string }) {
  return (
    <span className="relative inline-flex items-center">
      <button
        type="button"
        {...({ command: "--copy", commandfor: targetId } as Record<string, string>)}
        aria-label={label}
        className="group peer inline-flex min-h-8 min-w-8 items-center justify-center rounded-md border border-ctp-surface1 bg-ctp-base px-2 text-ctp-subtext1 transition-colors hover:bg-ctp-surface0 hover:text-ctp-text data-[copied]:border-ctp-mauve data-[copied]:text-ctp-mauve data-[failed]:border-ctp-red data-[failed]:text-ctp-red"
      >
        <Copy aria-hidden="true" className="size-3.5 group-data-[copied]:hidden" />
        <Check aria-hidden="true" className="hidden size-3.5 group-data-[copied]:block" />
      </button>
      <span
        role="status"
        className="pointer-events-none absolute right-full mr-2 whitespace-nowrap rounded bg-ctp-surface0 px-2 py-0.5 text-xs text-ctp-text opacity-0 transition-opacity peer-data-[copied]:opacity-100 peer-data-[failed]:opacity-100 motion-reduce:transition-none"
      />
    </span>
  );
}

export function McpConnectDocs({
  endpointUrl,
  localEndpointUrl,
  isConfigured,
}: McpConnectDocsProps) {
  const baseId = useId();
  const [selectedClient, setSelectedClient] = useState<string>(CLIENT_GUIDES[0]!.id);
  const [envTarget, setEnvTarget] = useState<"production" | "local">("production");
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const activeEndpointUrl = envTarget === "local" && localEndpointUrl ? localEndpointUrl : endpointUrl;

  useEffect(() => {
    const timers = new WeakMap<HTMLButtonElement, ReturnType<typeof setTimeout>>();
    let lastMessage = "";

    function report(button: HTMLButtonElement, ok: boolean) {
      const tip = button.nextElementSibling;
      const previous = timers.get(button);
      if (previous) clearTimeout(previous);
      button.removeAttribute("data-copied");
      button.removeAttribute("data-failed");

      let message = ok ? "Copied" : "Copy failed";
      if (message === lastMessage) message += "\u00A0";
      lastMessage = message;

      if (tip instanceof HTMLElement) tip.textContent = "";
      void button.offsetWidth;
      button.setAttribute(ok ? "data-copied" : "data-failed", "");
      requestAnimationFrame(() => {
        if (tip instanceof HTMLElement) tip.textContent = message;
      });

      timers.set(
        button,
        setTimeout(() => {
          button.removeAttribute("data-copied");
          button.removeAttribute("data-failed");
          if (tip instanceof HTMLElement) tip.textContent = "";
        }, 2000),
      );
    }

    async function copy(button: HTMLButtonElement, target: HTMLElement) {
      const text =
        target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement
          ? target.value
          : target.innerText.trim();
      if (!text) return;
      try {
        await navigator.clipboard.writeText(text);
        report(button, true);
      } catch {
        report(button, false);
      }
    }

    if ("CommandEvent" in window) {
      const onCommand = (event: Event) => {
        const ce = event as Event & { command?: string; source?: Element | null };
        if (ce.command !== "--copy") return;
        if (ce.source instanceof HTMLButtonElement && ce.target instanceof HTMLElement) {
          void copy(ce.source, ce.target);
        }
      };
      document.addEventListener("command", onCommand, true);
      return () => document.removeEventListener("command", onCommand, true);
    }

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      const el = event.target instanceof Element ? event.target : null;
      const button = el?.closest('button[command="--copy"]');
      if (!(button instanceof HTMLButtonElement)) return;
      const targetId = button.getAttribute("commandfor");
      if (!targetId) return;
      const target = document.getElementById(targetId);
      if (target) void copy(button, target);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  function selectTab(id: string) {
    setSelectedClient(id);
    const btn = tabRefs.current[id];
    if (btn) {
      btn.focus();
      btn.scrollIntoView({ block: "nearest", inline: "nearest" });
    }
  }

  function handleTabKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex: number | null = null;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % CLIENT_GUIDES.length;
    else if (event.key === "ArrowLeft") nextIndex = (index - 1 + CLIENT_GUIDES.length) % CLIENT_GUIDES.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = CLIENT_GUIDES.length - 1;

    if (nextIndex !== null) {
      event.preventDefault();
      selectTab(CLIENT_GUIDES[nextIndex]!.id);
    }
  }

  const endpointId = `${baseId}-endpoint`;

  return (
    <div className="mt-8 space-y-6">
      <section className="rounded-md border border-ctp-surface1/60 bg-ctp-mantle p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-start gap-3.5">
            <div className="flex shrink-0 items-center gap-1.5" aria-hidden="true">
              <span className="inline-flex size-9 items-center justify-center rounded-lg border border-ctp-surface1/70 bg-ctp-base">
                <StarboardMark className="size-6" />
              </span>
              <span className="inline-flex size-9 items-center justify-center rounded-lg border border-ctp-surface1/70 bg-ctp-base">
                <ModelContextProtocolDark width={18} height={18} className="size-4.5" />
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold tracking-tight">MCP Endpoint</h3>
              <p className="mt-1 text-sm text-ctp-subtext1">
                Remote Streamable HTTP endpoint protected with Clerk OAuth 2.1 (dynamic client registration, <code className="font-mono text-xs text-ctp-text">profile</code> scope).
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">

            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                isConfigured
                  ? "border-ctp-mauve/40 bg-ctp-mauve/10 text-ctp-mauve"
                  : "border-ctp-red/40 bg-ctp-red/10 text-ctp-red"
              }`}
            >
              <span className={`size-1.5 rounded-full ${isConfigured ? "bg-ctp-mauve" : "bg-ctp-red"}`} />
              {isConfigured ? "Active" : "Set MCP_RESOURCE_URL"}
            </span>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between gap-3 rounded-md border border-ctp-surface1/60 bg-ctp-base px-4 py-3">
          <code id={endpointId} className="min-w-0 truncate font-mono text-sm text-ctp-text">
            {activeEndpointUrl}
          </code>
          <CopyButton targetId={endpointId} label="Copy MCP endpoint URL" />
        </div>
      </section>

      <section className="rounded-md border border-ctp-surface1/60 bg-ctp-mantle p-6">
        <h3 className="text-lg font-semibold tracking-tight">Connect a Client</h3>
        <p className="mt-1 text-sm text-ctp-subtext1">
          Pick your AI client below, paste the configuration, and sign in with Starboard when prompted.
        </p>

        <div className="mt-5">
          <div
            role="tablist"
            aria-label="MCP client setup guides"
            className="flex overflow-x-auto border-b border-ctp-surface1/60"
          >
            {CLIENT_GUIDES.map((client, index) => {
              const isSelected = selectedClient === client.id;
              const tabId = `${baseId}-tab-${client.id}`;
              const ClientLogo = client.Icon;
              return (
                <button
                  key={client.id}
                  ref={(el) => {
                    tabRefs.current[client.id] = el;
                  }}
                  type="button"
                  role="tab"
                  id={tabId}
                  aria-selected={isSelected}
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => selectTab(client.id)}
                  onKeyDown={(e) => handleTabKeyDown(e, index)}
                  className="relative inline-flex flex-none items-center gap-2 whitespace-nowrap px-4 py-2.5 text-sm font-medium text-ctp-subtext1 transition-colors hover:text-ctp-text aria-selected:text-ctp-mauve aria-selected:after:absolute aria-selected:after:inset-x-0 aria-selected:after:bottom-0 aria-selected:after:border-b-2 aria-selected:after:border-ctp-mauve"
                >
                  <ClientLogo width={16} height={16} className="size-4 shrink-0" aria-hidden="true" />
                  <span>{client.label}</span>
                </button>
              );
            })}
          </div>

          {CLIENT_GUIDES.map((client) => {
            const isSelected = selectedClient === client.id;
            const tabId = `${baseId}-tab-${client.id}`;
            const codeId = `${baseId}-code-${client.id}`;
            return (
              <div key={client.id} role="tabpanel" aria-labelledby={tabId} hidden={!isSelected}>
                <div className="pt-4">
                  <p className="mb-3 text-sm text-ctp-subtext1">{client.instructions}</p>
                  <div className="relative rounded-md border border-ctp-surface1/60 bg-ctp-base p-4 pr-14">
                    <pre tabIndex={0} className="overflow-x-auto font-mono text-xs leading-6 text-ctp-text">
                      <code id={codeId}>{client.snippet(activeEndpointUrl)}</code>
                    </pre>
                    <div className="absolute right-3 top-3">
                      <CopyButton targetId={codeId} label={`Copy ${client.label} configuration`} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <ol className="mt-6 grid gap-3 sm:grid-cols-3">
          <li className="rounded-md border border-ctp-surface1/40 bg-ctp-base/60 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-ctp-mauve">Step 1</p>
            <p className="mt-1 text-sm font-medium text-ctp-text">Add config &amp; reload</p>
            <p className="mt-1 text-xs leading-5 text-ctp-subtext0">
              Save the configuration in your MCP client and reload or restart it so it discovers Starboard.
            </p>
          </li>
          <li className="rounded-md border border-ctp-surface1/40 bg-ctp-base/60 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-ctp-mauve">Step 2</p>
            <p className="mt-1 text-sm font-medium text-ctp-text">Approve Clerk OAuth</p>
            <p className="mt-1 text-xs leading-5 text-ctp-subtext0">
              Your browser opens Starboard&apos;s sign-in and OAuth consent screen to grant access to your library.
            </p>
          </li>
          <li className="rounded-md border border-ctp-surface1/40 bg-ctp-base/60 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-ctp-mauve">Step 3</p>
            <p className="mt-1 text-sm font-medium text-ctp-text">Ask your assistant</p>
            <p className="mt-1 text-xs leading-5 text-ctp-subtext0">
              Search, save, edit, or organize bookmarks. MCP Apps–enabled clients also render the interactive library widget.
            </p>
          </li>
        </ol>
      </section>

    </div>
  );
}
