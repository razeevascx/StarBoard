import Link from "next/link";
import {
  ClaudeAI,
  ClaudeCode,
  CursorDark,
  GoogleAntigravity,
  ModelContextProtocolDark,
  VisualStudioCode,
} from "@ridemountainpig/svgl-react";
import { ArrowRight, Check } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { CodeBlock } from "@/components/hangry-ui/components/code-block";
import { siteOrigin } from "@/lib/site";

const clients = [
  { label: "Antigravity", Icon: GoogleAntigravity },
  { label: "Claude", Icon: ClaudeAI },
  { label: "Cursor", Icon: CursorDark },
  { label: "Claude Code", Icon: ClaudeCode },
  { label: "VS Code", Icon: VisualStudioCode },
  { label: "MCP", Icon: ModelContextProtocolDark },
] as const;

const capabilities = [
  "Clerk OAuth with the profile scope",
  "7 tools for bookmarks, collections, and trash",
  "Interactive MCP Apps library widget",
] as const;

const mcpSnippet = JSON.stringify(
  {
    mcpServers: {
      starboard: {
        url: `${siteOrigin}/mcp`,
      },
    },
  },
  null,
  2,
);

export function McpShowcaseSection() {
  return (
    <section
      id="mcp"
      aria-labelledby="mcp-showcase-title"
      className="mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-24"
    >
      <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1.15fr]">
        <div>
          <SectionHeading
            id="mcp-showcase-title"
            title="Your bookmarks, ready for your AI."
            description="Connect Starboard to your favorite AI assistant over OAuth 2.1. Search, save, organize, and restore bookmarks without leaving your chat or editor."
          />

          <div className="mt-6 flex flex-wrap gap-2">
            {clients.map(({ label, Icon }) => (
              <span
                key={label}
                className="inline-flex items-center gap-2 rounded-md border border-ctp-surface1/60 bg-ctp-mantle/80 px-3 py-1.5 text-xs font-medium text-ctp-subtext1"
              >
                <Icon width={14} height={14} className="size-3.5 shrink-0" aria-hidden="true" />
                <span>{label}</span>
              </span>
            ))}
          </div>

          <ul className="mt-6 space-y-2.5 text-sm text-ctp-subtext1">
            {capabilities.map((item) => (
              <li key={item} className="flex items-center gap-2.5">
                <Check className="size-4 shrink-0 text-ctp-mauve" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <Link
              href="/dashboard/mcp"
              className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-ctp-mauve px-5 py-3 text-sm font-semibold text-ctp-base transition-colors hover:bg-ctp-lavender"
            >
              <span>Set up MCP</span>
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="min-w-0">
          <CodeBlock language="json" filename="mcp.json" code={mcpSnippet} />
        </div>
      </div>
    </section>
  );
}
