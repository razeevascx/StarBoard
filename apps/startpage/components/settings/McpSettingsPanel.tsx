import { ArrowUpRight } from 'lucide-react';

const webUrl = (import.meta.env.VITE_WEB_URL || 'https://starboard.razeev.com').replace(/\/$/, '');

export default function McpSettingsPanel() {
  return (
    <section aria-label="MCP settings" className="space-y-5">
      <div className="space-y-2">
        <h3 className="text-base font-bold text-ctp-text">Connect your AI assistant</h3>
        <p className="text-sm text-ctp-subtext0">Use Starboard MCP to search and manage your bookmarks from a connected AI assistant.</p>
      </div>
      <label className="block space-y-2 text-xs font-bold text-ctp-text">
        <span>MCP server URL</span>
        <input
          readOnly
          value={`${webUrl}/mcp`}
          onFocus={(event) => event.currentTarget.select()}
          className="w-full rounded-md border border-ctp-surface1 bg-ctp-base px-4 py-3 font-mono text-sm font-normal focus-visible:outline-2 focus-visible:outline-ctp-mauve"
        />
      </label>
      <a
        href={`${webUrl}/dashboard/mcp`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-11 items-center gap-2 rounded-md bg-ctp-mauve px-4 text-xs font-bold text-ctp-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ctp-mauve"
      >
        Set up MCP <ArrowUpRight className="size-4" aria-hidden="true" />
      </a>
    </section>
  );
}
