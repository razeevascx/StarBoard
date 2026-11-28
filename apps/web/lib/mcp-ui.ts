export const STARBOARD_LIBRARY_UI_URI = "ui://starboard/library.html";
export const MCP_APP_MIME_TYPE = "text/html;profile=mcp-app";
export const STARBOARD_ICON_DATA_URI =
  "data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20viewBox%3D%270%200%2064%2064%27%3E%3Crect%20width%3D%2764%27%20height%3D%2764%27%20rx%3D%2716%27%20fill%3D%27%231e1e2e%27%2F%3E%3Cpath%20d%3D%27M32%2011c1.9%2012.6%208.4%2019.1%2021%2021-12.6%201.9-19.1%208.4-21%2021-1.9-12.6-8.4-19.1-21-21%2012.6-1.9%2019.1-8.4%2021-21Z%27%20fill%3D%27%23cba6f7%27%2F%3E%3C%2Fsvg%3E";

export function renderStarboardLibraryHtml(): string {
  return String.raw`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light dark" />
  <title>StartBoard Library</title>
  <style>
    :root {
      /* Catppuccin Latte (light) */
      --ctp-base-light: #eff1f5;
      --ctp-mantle-light: #e6e9ef;
      --ctp-surface0-light: #ccd0da;
      --ctp-surface1-light: #bcc0cc;
      --ctp-text-light: #4c4f69;
      --ctp-subtext0-light: #6c6f85;
      --ctp-subtext1-light: #5c5f77;
      --ctp-mauve-light: #8839ef;
      --ctp-blue-light: #1e66f5;
      --ctp-red-light: #d20f39;
      --ctp-green-light: #40a02b;
      --ctp-peach-light: #fe640b;

      /* Catppuccin Mocha (dark) — matches app/globals.css */
      --ctp-base-dark: #1e1e2e;
      --ctp-mantle-dark: #181825;
      --ctp-surface0-dark: #313244;
      --ctp-surface1-dark: #45475a;
      --ctp-text-dark: #cdd6f4;
      --ctp-subtext0-dark: #a6adc8;
      --ctp-subtext1-dark: #bac2de;
      --ctp-mauve-dark: #cba6f7;
      --ctp-blue-dark: #89b4fa;
      --ctp-red-dark: #f38ba8;
      --ctp-green-dark: #a6e3a1;
      --ctp-peach-dark: #fab387;

      /* Light defaults */
      --bg: var(--ctp-base-light);
      --surface: var(--ctp-mantle-light);
      --surface-raised: var(--ctp-surface0-light);
      --border: var(--ctp-surface1-light);
      --text: var(--ctp-text-light);
      --subtext: var(--ctp-subtext0-light);
      --subtext-strong: var(--ctp-subtext1-light);
      --accent: var(--ctp-mauve-light);
      --accent-fg: #ffffff;
      --blue: var(--ctp-blue-light);
      --danger: var(--ctp-red-light);
      --success: var(--ctp-green-light);
      --scrollbar-track: var(--ctp-mantle-light);
      --scrollbar-thumb: var(--ctp-surface1-light);

      color-scheme: light dark;
      scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track);
    }

    @media (prefers-color-scheme: dark) {
      :root {
        --bg: var(--ctp-base-dark);
        --surface: var(--ctp-mantle-dark);
        --surface-raised: var(--ctp-surface0-dark);
        --border: var(--ctp-surface1-dark);
        --text: var(--ctp-text-dark);
        --subtext: var(--ctp-subtext0-dark);
        --subtext-strong: var(--ctp-subtext1-dark);
        --accent: var(--ctp-mauve-dark);
        --accent-fg: #1e1e2e;
        --blue: var(--ctp-blue-dark);
        --danger: var(--ctp-red-dark);
        --success: var(--ctp-green-dark);
        --scrollbar-track: var(--ctp-mantle-dark);
        --scrollbar-thumb: var(--ctp-surface1-dark);
      }
    }

    @supports (color: light-dark(white, black)) {
      :root {
        --bg: light-dark(var(--ctp-base-light), var(--ctp-base-dark));
        --surface: light-dark(var(--ctp-mantle-light), var(--ctp-mantle-dark));
        --surface-raised: light-dark(var(--ctp-surface0-light), var(--ctp-surface0-dark));
        --border: light-dark(var(--ctp-surface1-light), var(--ctp-surface1-dark));
        --text: light-dark(var(--ctp-text-light), var(--ctp-text-dark));
        --subtext: light-dark(var(--ctp-subtext0-light), var(--ctp-subtext0-dark));
        --subtext-strong: light-dark(var(--ctp-subtext1-light), var(--ctp-subtext1-dark));
        --accent: light-dark(var(--ctp-mauve-light), var(--ctp-mauve-dark));
        --accent-fg: light-dark(#ffffff, #1e1e2e);
        --blue: light-dark(var(--ctp-blue-light), var(--ctp-blue-dark));
        --danger: light-dark(var(--ctp-red-light), var(--ctp-red-dark));
        --success: light-dark(var(--ctp-green-light), var(--ctp-green-dark));
        --scrollbar-track: light-dark(var(--ctp-mantle-light), var(--ctp-mantle-dark));
        --scrollbar-thumb: light-dark(var(--ctp-surface1-light), var(--ctp-surface1-dark));
      }
    }

    html[data-theme="light"] {
      color-scheme: light;
      --bg: var(--ctp-base-light);
      --surface: var(--ctp-mantle-light);
      --surface-raised: var(--ctp-surface0-light);
      --border: var(--ctp-surface1-light);
      --text: var(--ctp-text-light);
      --subtext: var(--ctp-subtext0-light);
      --subtext-strong: var(--ctp-subtext1-light);
      --accent: var(--ctp-mauve-light);
      --accent-fg: #ffffff;
      --blue: var(--ctp-blue-light);
      --danger: var(--ctp-red-light);
      --success: var(--ctp-green-light);
      --scrollbar-track: var(--ctp-mantle-light);
      --scrollbar-thumb: var(--ctp-surface1-light);
    }

    html[data-theme="dark"] {
      color-scheme: dark;
      --bg: var(--ctp-base-dark);
      --surface: var(--ctp-mantle-dark);
      --surface-raised: var(--ctp-surface0-dark);
      --border: var(--ctp-surface1-dark);
      --text: var(--ctp-text-dark);
      --subtext: var(--ctp-subtext0-dark);
      --subtext-strong: var(--ctp-subtext1-dark);
      --accent: var(--ctp-mauve-dark);
      --accent-fg: #1e1e2e;
      --blue: var(--ctp-blue-dark);
      --danger: var(--ctp-red-dark);
      --success: var(--ctp-green-dark);
      --scrollbar-track: var(--ctp-mantle-dark);
      --scrollbar-thumb: var(--ctp-surface1-dark);
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      padding: 16px;
      background: var(--bg);
      color: var(--text);
      font-family: var(--font-sans, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif);
      font-size: 14px;
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
    }

    :focus-visible {
      outline: 2px solid var(--accent);
      outline-offset: 2px;
    }

    .shell {
      max-width: 880px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .header {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding-bottom: 12px;
      border-bottom: 1px solid color-mix(in srgb, var(--border) 60%, transparent);
    }

    .brand {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      font-size: 15px;
      letter-spacing: -0.01em;
    }

    .brand-mark {
      color: var(--accent);
    }

    .tabs {
      display: inline-flex;
      flex-wrap: wrap;
      gap: 4px;
      background: var(--surface);
      padding: 4px;
      border-radius: 10px;
      border: 1px solid color-mix(in srgb, var(--border) 60%, transparent);
    }

    .tab-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      border: 0;
      background: transparent;
      color: var(--subtext);
      font: inherit;
      font-size: 13px;
      font-weight: 500;
      padding: 6px 10px;
      border-radius: 7px;
      cursor: pointer;
    }

    .tab-btn:hover {
      color: var(--text);
    }

    .tab-btn[aria-selected="true"] {
      background: var(--surface-raised);
      color: var(--text);
    }

    .count-pill {
      font-size: 11px;
      font-variant-numeric: tabular-nums;
      padding: 1px 6px;
      border-radius: 999px;
      background: color-mix(in srgb, var(--border) 50%, transparent);
      color: var(--subtext-strong);
    }

    .header-actions {
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      min-height: 34px;
      padding: 0 12px;
      border-radius: 8px;
      border: 1px solid var(--border);
      background: var(--surface);
      color: var(--text);
      font: inherit;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      white-space: nowrap;
    }

    .btn:hover:not(:disabled) {
      background: var(--surface-raised);
    }

    .btn:disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }

    .btn-primary {
      background: var(--accent);
      border-color: transparent;
      color: var(--accent-fg);
      font-weight: 600;
    }

    .btn-primary:hover:not(:disabled) {
      filter: brightness(1.06);
      background: var(--accent);
    }

    .btn-ghost {
      border-color: transparent;
      background: transparent;
      color: var(--subtext);
      min-height: 30px;
      padding: 0 8px;
      font-size: 12px;
    }

    .btn-ghost:hover:not(:disabled) {
      background: var(--surface-raised);
      color: var(--text);
    }

    .btn-danger:hover:not(:disabled) {
      color: var(--danger);
      background: color-mix(in srgb, var(--danger) 14%, transparent);
    }

    .toolbar {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .search-input {
      width: 100%;
      min-height: 38px;
      padding: 8px 12px;
      border-radius: 9px;
      border: 1px solid var(--border);
      background: var(--surface);
      color: var(--text);
      font: inherit;
      font-size: 13px;
    }

    .search-input::placeholder {
      color: var(--subtext);
    }

    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: 999px;
      border: 1px solid color-mix(in srgb, var(--border) 70%, transparent);
      background: var(--surface);
      color: var(--subtext-strong);
      font: inherit;
      font-size: 12px;
      cursor: pointer;
    }

    .chip[aria-pressed="true"] {
      border-color: var(--accent);
      background: color-mix(in srgb, var(--accent) 16%, transparent);
      color: var(--text);
    }

    .dot {
      width: 8px;
      height: 8px;
      border-radius: 999px;
      flex-shrink: 0;
    }

    .status {
      min-height: 20px;
      font-size: 12px;
      color: var(--subtext);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }

    .status[data-tone="error"] {
      color: var(--danger);
    }

    .status[data-tone="success"] {
      color: var(--success);
    }

    .list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .card {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
      padding: 12px 14px;
      border-radius: 10px;
      border: 1px solid color-mix(in srgb, var(--border) 65%, transparent);
      background: var(--surface);
    }

    .card:hover {
      border-color: var(--border);
    }

    .card-main {
      min-width: 0;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .card-title-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
      min-width: 0;
    }

    .link-btn {
      border: 0;
      padding: 0;
      background: transparent;
      color: var(--text);
      font: inherit;
      font-weight: 600;
      text-align: left;
      cursor: pointer;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .link-btn:hover {
      color: var(--accent);
      text-decoration: underline;
    }

    .host-badge {
      font-size: 11px;
      color: var(--subtext);
      background: var(--surface-raised);
      padding: 1px 7px;
      border-radius: 6px;
      max-width: 220px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .pill {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      font-size: 11px;
      color: var(--subtext-strong);
      padding: 1px 8px;
      border-radius: 999px;
      border: 1px solid color-mix(in srgb, var(--border) 70%, transparent);
      background: color-mix(in srgb, var(--surface-raised) 55%, transparent);
    }

    .desc {
      margin: 0;
      font-size: 12px;
      color: var(--subtext);
      overflow-wrap: anywhere;
    }

    .card-actions {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      flex-shrink: 0;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
      gap: 10px;
    }

    .folder-card {
      text-align: left;
      border: 1px solid color-mix(in srgb, var(--border) 65%, transparent);
      background: var(--surface);
      color: var(--text);
      border-radius: 10px;
      padding: 14px;
      font: inherit;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .folder-card:hover {
      border-color: var(--accent);
      background: color-mix(in srgb, var(--surface-raised) 50%, var(--surface));
    }

    .folder-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }

    .folder-name {
      font-weight: 600;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .empty {
      padding: 28px 16px;
      text-align: center;
      border-radius: 10px;
      border: 1px dashed color-mix(in srgb, var(--border) 80%, transparent);
      color: var(--subtext);
      font-size: 13px;
    }

    /* Native modal dialog — scoped to dialog[open] per dialog guidance */
    dialog {
      border: 1px solid var(--border);
      border-radius: 12px;
      background: var(--surface);
      color: var(--text);
      padding: 0;
      width: min(460px, calc(100vw - 24px));
      max-height: calc(100dvh - 24px);
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.45);
    }

    dialog[open] {
      display: flex;
      flex-direction: column;
    }

    dialog:modal {
      overscroll-behavior: contain;
    }

    dialog::backdrop {
      background: rgba(10, 10, 18, 0.65);
      backdrop-filter: blur(2px);
      overflow: hidden;
      overscroll-behavior: contain;
    }

    .dialog-form {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 18px;
      overflow-y: auto;
    }

    .dialog-title {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .field label {
      font-size: 12px;
      font-weight: 500;
      color: var(--subtext-strong);
    }

    .field input,
    .field textarea,
    .field select {
      width: 100%;
      padding: 8px 10px;
      border-radius: 8px;
      border: 1px solid var(--border);
      background: var(--bg);
      color: var(--text);
      font: inherit;
      font-size: 13px;
    }

    .field textarea {
      min-height: 70px;
      resize: vertical;
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 4px;
    }
  </style>
</head>
<body>
  <div class="shell">
    <header class="header">
      <div class="brand">
        <svg aria-hidden="true" viewBox="0 0 64 64" width="22" height="22">
          <rect width="64" height="64" rx="16" fill="#1e1e2e" />
          <path d="M32 11c1.9 12.6 8.4 19.1 21 21-12.6 1.9-19.1 8.4-21 21-1.9-12.6-8.4-19.1-21-21 12.6-1.9 19.1-8.4 21-21Z" fill="#cba6f7" />
        </svg>
        <span>StartBoard</span>
      </div>
      <div class="tabs" role="tablist" aria-label="Library sections">
        <button type="button" class="tab-btn" role="tab" id="tab-bookmarks" aria-selected="true" data-view="bookmarks">
          Bookmarks <span class="count-pill" id="count-bookmarks">0</span>
        </button>
        <button type="button" class="tab-btn" role="tab" id="tab-collections" aria-selected="false" data-view="collections">
          Collections <span class="count-pill" id="count-collections">0</span>
        </button>
        <button type="button" class="tab-btn" role="tab" id="tab-trash" aria-selected="false" data-view="trash">
          Trash <span class="count-pill" id="count-trash">0</span>
        </button>
      </div>
      <div class="header-actions">
        <button type="button" class="btn" id="refresh-btn">Refresh</button>
        <button type="button" class="btn btn-primary" id="add-btn">+ Add</button>
      </div>
    </header>

    <div class="toolbar">
      <input type="search" id="search-input" class="search-input" aria-label="Filter items" placeholder="Search bookmarks, URLs, or collections…" />
      <div class="chips" id="collection-chips" aria-label="Filter by collection"></div>
    </div>

    <div class="status" id="status-bar" aria-live="polite">
      <span id="status-text">Connecting to MCP host…</span>
    </div>

    <main id="content" aria-live="off"></main>
  </div>

  <dialog id="bookmark-dialog" closedby="any" aria-labelledby="dialog-title">
    <form class="dialog-form" id="bookmark-form" method="dialog">
      <h1 class="dialog-title" id="dialog-title">Add bookmark</h1>
      <div class="field">
        <label for="field-title">Title</label>
        <input id="field-title" name="title" type="text" required maxlength="500" autofocus placeholder="Bookmark title" />
      </div>
      <div class="field">
        <label for="field-url">URL</label>
        <input id="field-url" name="url" type="url" required maxlength="4096" placeholder="https://example.com" />
      </div>
      <div class="field">
        <label for="field-description">Description</label>
        <textarea id="field-description" name="description" maxlength="2000" placeholder="Optional notes"></textarea>
      </div>
      <div class="field">
        <label for="field-collection">Collection</label>
        <select id="field-collection" name="collectionId">
          <option value="">No collection</option>
        </select>
      </div>
      <div class="dialog-actions">
        <button type="button" class="btn" id="dialog-cancel">Cancel</button>
        <button type="submit" class="btn btn-primary" id="dialog-save">Save</button>
      </div>
    </form>
  </dialog>

  <script>
    (function () {
      const PALETTE = ["#cba6f7", "#89b4fa", "#a6e3a1", "#fab387"];
      const state = {
        view: "bookmarks",
        query: "",
        collectionFilter: null,
        bookmarks: [],
        collections: [],
        trash: [],
        loaded: { bookmarks: false, collections: false, trash: false },
        busy: false,
        editingId: null,
        connected: false,
      };

      const contentEl = document.getElementById("content");
      const searchEl = document.getElementById("search-input");
      const chipsEl = document.getElementById("collection-chips");
      const statusBarEl = document.getElementById("status-bar");
      const statusTextEl = document.getElementById("status-text");
      const refreshBtn = document.getElementById("refresh-btn");
      const addBtn = document.getElementById("add-btn");
      const dialogEl = document.getElementById("bookmark-dialog");
      const formEl = document.getElementById("bookmark-form");
      const dialogTitleEl = document.getElementById("dialog-title");
      const titleInput = document.getElementById("field-title");
      const urlInput = document.getElementById("field-url");
      const descInput = document.getElementById("field-description");
      const collectionSelect = document.getElementById("field-collection");
      const cancelBtn = document.getElementById("dialog-cancel");
      const saveBtn = document.getElementById("dialog-save");

      let nextId = 1;
      const pending = new Map();

      function setStatus(message, tone) {
        statusTextEl.textContent = message;
        if (tone) {
          statusBarEl.dataset.tone = tone;
        } else {
          delete statusBarEl.dataset.tone;
        }
      }

      function setBusy(busy) {
        state.busy = busy;
        refreshBtn.disabled = busy;
        addBtn.disabled = busy;
        saveBtn.disabled = busy;
      }

      function safeColor(id, saved) {
        if (typeof saved === "string" && /^#[0-9a-f]{6}$/i.test(saved)) return saved;
        let hash = 0;
        const src = String(id || "");
        for (let i = 0; i < src.length; i += 1) {
          hash = (hash * 31 + src.charCodeAt(i)) | 0;
        }
        return PALETTE[Math.abs(hash) % PALETTE.length];
      }

      function safeUrl(raw) {
        try {
          const parsed = new URL(String(raw));
          if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
          if (parsed.username || parsed.password) return null;
          return parsed;
        } catch {
          return null;
        }
      }

      function applyHostContext(ctx) {
        if (!ctx || typeof ctx !== "object") return;
        if (ctx.theme === "light" || ctx.theme === "dark") {
          document.documentElement.setAttribute("data-theme", ctx.theme);
        }
        const vars = ctx.styles && ctx.styles.variables;
        if (vars && typeof vars === "object") {
          for (const key in vars) {
            if (Object.prototype.hasOwnProperty.call(vars, key) && typeof vars[key] === "string" && key.startsWith("--")) {
              document.documentElement.style.setProperty(key, vars[key]);
            }
          }
        }
      }

      function postToHost(payload) {
        if (window.parent && window.parent !== window) {
          window.parent.postMessage(payload, "*");
        }
      }

      function sendRequest(method, params) {
        const id = nextId++;
        return new Promise((resolve, reject) => {
          if (!window.parent || window.parent === window) {
            reject(new Error("No MCP host connected."));
            return;
          }
          const timer = setTimeout(() => {
            if (pending.delete(id)) {
              reject(new Error("Host request timed out: " + method));
            }
          }, 15000);
          pending.set(id, {
            resolve: (val) => {
              clearTimeout(timer);
              resolve(val);
            },
            reject: (err) => {
              clearTimeout(timer);
              reject(err);
            },
          });
          postToHost({ jsonrpc: "2.0", id, method, params });
        });
      }

      async function callTool(name, args) {
        const res = await sendRequest("tools/call", { name, arguments: args || {} });
        if (res && res.isError) {
          const msg = Array.isArray(res.content) && res.content[0] && res.content[0].text
            ? res.content[0].text
            : "Tool call failed.";
          throw new Error(msg);
        }
        return res;
      }

      function openLink(rawUrl) {
        const parsed = safeUrl(rawUrl);
        if (!parsed) {
          setStatus("Blocked unsafe URL.", "error");
          return;
        }
        if (window.parent && window.parent !== window) {
          sendRequest("ui/open-link", { url: parsed.href }).catch(() => {
            window.open(parsed.href, "_blank", "noopener,noreferrer");
          });
        } else {
          window.open(parsed.href, "_blank", "noopener,noreferrer");
        }
      }

      function extractPayload(result) {
        if (!result || typeof result !== "object") return null;
        if (result.structuredContent && typeof result.structuredContent === "object") {
          return result.structuredContent;
        }
        if (Array.isArray(result.content) && result.content[0] && typeof result.content[0].text === "string") {
          try {
            return JSON.parse(result.content[0].text);
          } catch {
            return null;
          }
        }
        return null;
      }

      function applyToolResult(result, switchTab) {
        const data = extractPayload(result);
        if (!data) return;
        if (Array.isArray(data)) {
          if (data.length > 0 && Object.prototype.hasOwnProperty.call(data[0], "bookmarkCount")) {
            state.collections = data;
            state.loaded.collections = true;
            if (switchTab) state.view = "collections";
          } else if (data.length > 0 && Object.prototype.hasOwnProperty.call(data[0], "collectionId")) {
            state.bookmarks = data;
            state.loaded.bookmarks = true;
            if (switchTab) state.view = "bookmarks";
          } else if (data.length > 0) {
            state.trash = data;
            state.loaded.trash = true;
            if (switchTab) state.view = "trash";
          }
        } else if (data.view === "bookmarks" && Array.isArray(data.bookmarks)) {
          state.bookmarks = data.bookmarks;
          state.loaded.bookmarks = true;
          if (switchTab) state.view = "bookmarks";
          if (!state.loaded.collections && state.connected) {
            callTool("list_collections", {}).then((res) => applyToolResult(res, false)).catch(() => {});
          }
        } else if (data.view === "collections" && Array.isArray(data.collections)) {
          state.collections = data.collections;
          state.loaded.collections = true;
          if (switchTab) state.view = "collections";
        } else if (data.view === "trash" && Array.isArray(data.trash)) {
          state.trash = data.trash;
          state.loaded.trash = true;
          if (switchTab) state.view = "trash";
        }
        render();
      }

      async function loadView(view, force) {
        if (!state.connected) return;
        if (!force && state.loaded[view]) {
          render();
          return;
        }
        const toolName = view === "collections" ? "list_collections" : view === "trash" ? "list_trash" : "list_bookmarks";
        setBusy(true);
        setStatus("Loading " + view + "…");
        try {
          const res = await callTool(toolName, {});
          applyToolResult(res, false);
          setStatus("Ready");
        } catch (err) {
          setStatus(err && err.message ? err.message : "Failed to load " + view + ".", "error");
        } finally {
          setBusy(false);
        }
      }

      function renderCounts() {
        document.getElementById("count-bookmarks").textContent = String(state.bookmarks.length);
        document.getElementById("count-collections").textContent = String(state.collections.length);
        document.getElementById("count-trash").textContent = String(state.trash.length);
        for (const tab of document.querySelectorAll(".tab-btn")) {
          tab.setAttribute("aria-selected", tab.dataset.view === state.view ? "true" : "false");
        }
      }

      function renderChips() {
        chipsEl.replaceChildren();
        if (state.view !== "bookmarks" || state.collections.length === 0) {
          chipsEl.hidden = true;
          return;
        }
        chipsEl.hidden = false;
        const allChip = document.createElement("button");
        allChip.type = "button";
        allChip.className = "chip";
        allChip.setAttribute("aria-pressed", state.collectionFilter === null ? "true" : "false");
        allChip.textContent = "All";
        allChip.addEventListener("click", () => {
          state.collectionFilter = null;
          render();
        });
        chipsEl.appendChild(allChip);

        for (const col of state.collections) {
          const chip = document.createElement("button");
          chip.type = "button";
          chip.className = "chip";
          chip.setAttribute("aria-pressed", state.collectionFilter === col.id ? "true" : "false");
          const dot = document.createElement("span");
          dot.className = "dot";
          dot.style.backgroundColor = safeColor(col.id, col.color);
          chip.appendChild(dot);
          chip.appendChild(document.createTextNode(col.name));
          chip.addEventListener("click", () => {
            state.collectionFilter = state.collectionFilter === col.id ? null : col.id;
            render();
          });
          chipsEl.appendChild(chip);
        }
      }

      function renderEmpty(message) {
        const box = document.createElement("div");
        box.className = "empty";
        box.textContent = message;
        contentEl.replaceChildren(box);
      }

      function renderBookmarks() {
        const q = state.query.trim().toLowerCase();
        const filtered = state.bookmarks.filter((item) => {
          if (state.collectionFilter && item.collectionId !== state.collectionFilter) return false;
          if (!q) return true;
          return (
            String(item.title || "").toLowerCase().includes(q) ||
            String(item.url || "").toLowerCase().includes(q) ||
            String(item.description || "").toLowerCase().includes(q) ||
            String(item.collectionName || "").toLowerCase().includes(q)
          );
        });

        if (filtered.length === 0) {
          renderEmpty(state.loaded.bookmarks ? "No matching bookmarks." : "Waiting for bookmark data…");
          return;
        }

        const list = document.createElement("div");
        list.className = "list";
        for (const item of filtered) {
          const card = document.createElement("article");
          card.className = "card";

          const main = document.createElement("div");
          main.className = "card-main";

          const titleRow = document.createElement("div");
          titleRow.className = "card-title-row";

          const linkBtn = document.createElement("button");
          linkBtn.type = "button";
          linkBtn.className = "link-btn";
          linkBtn.textContent = item.title || item.url;
          linkBtn.addEventListener("click", () => openLink(item.url));
          titleRow.appendChild(linkBtn);

          const parsed = safeUrl(item.url);
          if (parsed) {
            const host = document.createElement("span");
            host.className = "host-badge";
            host.textContent = parsed.hostname.replace(/^www\./, "");
            titleRow.appendChild(host);
          }

          if (item.collectionName) {
            const pill = document.createElement("span");
            pill.className = "pill";
            const dot = document.createElement("span");
            dot.className = "dot";
            dot.style.backgroundColor = safeColor(item.collectionId, item.collectionColor);
            pill.appendChild(dot);
            pill.appendChild(document.createTextNode(item.collectionName));
            titleRow.appendChild(pill);
          }

          main.appendChild(titleRow);

          if (item.description) {
            const desc = document.createElement("p");
            desc.className = "desc";
            desc.textContent = item.description;
            main.appendChild(desc);
          }

          const actions = document.createElement("div");
          actions.className = "card-actions";

          const editBtn = document.createElement("button");
          editBtn.type = "button";
          editBtn.className = "btn btn-ghost";
          editBtn.textContent = "Edit";
          editBtn.addEventListener("click", () => openDialog(item));

          const trashBtn = document.createElement("button");
          trashBtn.type = "button";
          trashBtn.className = "btn btn-ghost btn-danger";
          trashBtn.textContent = "Trash";
          trashBtn.addEventListener("click", () => trashBookmark(item));

          actions.append(editBtn, trashBtn);
          card.append(main, actions);
          list.appendChild(card);
        }
        contentEl.replaceChildren(list);
      }

      function renderCollections() {
        const q = state.query.trim().toLowerCase();
        const filtered = state.collections.filter((col) => {
          if (!q) return true;
          return (
            String(col.name || "").toLowerCase().includes(q) ||
            String(col.description || "").toLowerCase().includes(q)
          );
        });

        if (filtered.length === 0) {
          renderEmpty(state.loaded.collections ? "No matching collections." : "No collections loaded yet.");
          return;
        }

        const grid = document.createElement("div");
        grid.className = "grid";
        for (const col of filtered) {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "folder-card";
          btn.addEventListener("click", () => {
            state.collectionFilter = col.id;
            state.view = "bookmarks";
            loadView("bookmarks", !state.loaded.bookmarks);
            render();
          });

          const top = document.createElement("div");
          top.className = "folder-top";

          const left = document.createElement("span");
          left.className = "card-title-row";
          const dot = document.createElement("span");
          dot.className = "dot";
          dot.style.backgroundColor = safeColor(col.id, col.color);
          const name = document.createElement("span");
          name.className = "folder-name";
          name.textContent = col.name;
          left.append(dot, name);

          const count = document.createElement("span");
          count.className = "count-pill";
          count.textContent = String(col.bookmarkCount || 0);

          top.append(left, count);
          btn.appendChild(top);

          if (col.description) {
            const desc = document.createElement("p");
            desc.className = "desc";
            desc.textContent = col.description;
            btn.appendChild(desc);
          }
          grid.appendChild(btn);
        }
        contentEl.replaceChildren(grid);
      }

      function renderTrash() {
        const q = state.query.trim().toLowerCase();
        const filtered = state.trash.filter((item) => {
          if (!q) return true;
          return (
            String(item.title || "").toLowerCase().includes(q) ||
            String(item.url || "").toLowerCase().includes(q)
          );
        });

        if (filtered.length === 0) {
          renderEmpty(state.loaded.trash ? "Trash is empty." : "No trashed bookmarks loaded yet.");
          return;
        }

        const list = document.createElement("div");
        list.className = "list";
        for (const item of filtered) {
          const card = document.createElement("article");
          card.className = "card";

          const main = document.createElement("div");
          main.className = "card-main";

          const row = document.createElement("div");
          row.className = "card-title-row";

          const title = document.createElement("span");
          title.className = "folder-name";
          title.textContent = item.title || item.url;
          row.appendChild(title);

          const parsed = safeUrl(item.url);
          if (parsed) {
            const host = document.createElement("span");
            host.className = "host-badge";
            host.textContent = parsed.hostname.replace(/^www\./, "");
            row.appendChild(host);
          }
          main.appendChild(row);

          const actions = document.createElement("div");
          actions.className = "card-actions";
          const restoreBtn = document.createElement("button");
          restoreBtn.type = "button";
          restoreBtn.className = "btn";
          restoreBtn.textContent = "Restore";
          restoreBtn.addEventListener("click", () => restoreBookmark(item));
          actions.appendChild(restoreBtn);

          card.append(main, actions);
          list.appendChild(card);
        }
        contentEl.replaceChildren(list);
      }

      function render() {
        renderCounts();
        renderChips();
        if (state.view === "collections") {
          renderCollections();
        } else if (state.view === "trash") {
          renderTrash();
        } else {
          renderBookmarks();
        }
      }

      function populateCollectionSelect(selectedId) {
        collectionSelect.replaceChildren();
        const none = document.createElement("option");
        none.value = "";
        none.textContent = "No collection";
        collectionSelect.appendChild(none);
        for (const col of state.collections) {
          const opt = document.createElement("option");
          opt.value = col.id;
          opt.textContent = col.name;
          collectionSelect.appendChild(opt);
        }
        collectionSelect.value = selectedId || "";
      }

      async function openDialog(bookmark) {
        if (!state.loaded.collections && state.connected) {
          await callTool("list_collections", {}).then((res) => applyToolResult(res, false)).catch(() => {});
        }
        state.editingId = bookmark ? bookmark.id : null;
        dialogTitleEl.textContent = bookmark ? "Edit bookmark" : "Add bookmark";
        titleInput.value = bookmark ? bookmark.title || "" : "";
        urlInput.value = bookmark ? bookmark.url || "" : "";
        descInput.value = bookmark && bookmark.description ? bookmark.description : "";
        populateCollectionSelect(bookmark ? bookmark.collectionId : state.collectionFilter);
        dialogEl.showModal();
      }

      async function trashBookmark(item) {
        setBusy(true);
        setStatus("Moving bookmark to trash…");
        try {
          await callTool("move_bookmark_to_trash", { id: item.id });
          state.loaded.trash = false;
          await loadView("bookmarks", true);
          setStatus("Moved to trash.", "success");
        } catch (err) {
          setStatus(err && err.message ? err.message : "Unable to trash bookmark.", "error");
        } finally {
          setBusy(false);
        }
      }

      async function restoreBookmark(item) {
        setBusy(true);
        setStatus("Restoring bookmark…");
        try {
          await callTool("restore_bookmark", { id: item.id });
          state.loaded.bookmarks = false;
          await loadView("trash", true);
          setStatus("Bookmark restored.", "success");
        } catch (err) {
          setStatus(err && err.message ? err.message : "Unable to restore bookmark.", "error");
        } finally {
          setBusy(false);
        }
      }

      formEl.addEventListener("submit", async (event) => {
        event.preventDefault();
        const title = titleInput.value.trim();
        const rawUrl = urlInput.value.trim();
        const parsed = safeUrl(rawUrl);
        if (!title || !parsed) {
          setStatus("Enter a title and a valid HTTP/HTTPS URL.", "error");
          return;
        }
        const payload = {
          title,
          url: parsed.href,
          description: descInput.value.trim() || null,
          collectionId: collectionSelect.value || null,
        };
        setBusy(true);
        setStatus(state.editingId ? "Saving changes…" : "Creating bookmark…");
        try {
          if (state.editingId) {
            await callTool("edit_bookmark", { id: state.editingId, ...payload });
          } else {
            await callTool("create_bookmark", payload);
          }
          dialogEl.close("saved");
          state.view = "bookmarks";
          await loadView("bookmarks", true);
          setStatus(state.editingId ? "Bookmark updated." : "Bookmark saved.", "success");
        } catch (err) {
          setStatus(err && err.message ? err.message : "Save failed.", "error");
        } finally {
          setBusy(false);
        }
      });

      cancelBtn.addEventListener("click", () => {
        dialogEl.close("cancel");
      });

      dialogEl.addEventListener("close", () => {
        dialogEl.returnValue = "";
      });

      if (!("closedBy" in HTMLDialogElement.prototype)) {
        const outside = (e, dialog) => {
          const r = dialog.getBoundingClientRect();
          return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
        };
        let pressedOutside = false;
        dialogEl.addEventListener("pointerdown", (e) => {
          pressedOutside = outside(e, dialogEl);
        });
        dialogEl.addEventListener("pointerup", (e) => {
          if (pressedOutside && outside(e, dialogEl)) dialogEl.close();
        });
      }

      for (const tab of document.querySelectorAll(".tab-btn")) {
        tab.addEventListener("click", () => {
          const target = tab.dataset.view;
          if (!target) return;
          state.view = target;
          render();
          loadView(target, false);
        });
      }

      searchEl.addEventListener("input", () => {
        state.query = searchEl.value;
        render();
      });

      refreshBtn.addEventListener("click", () => loadView(state.view, true));
      addBtn.addEventListener("click", () => openDialog(null));

      window.addEventListener("message", (event) => {
        const msg = event.data;
        if (!msg || typeof msg !== "object" || msg.jsonrpc !== "2.0") return;

        if (msg.id !== undefined && pending.has(msg.id)) {
          const entry = pending.get(msg.id);
          pending.delete(msg.id);
          if (msg.error) {
            entry.reject(new Error(msg.error.message || "JSON-RPC error"));
          } else {
            entry.resolve(msg.result);
          }
          return;
        }

        if (msg.method === "ui/notifications/tool-result") {
          setBusy(false);
          setStatus("Ready");
          applyToolResult(msg.params, true);
        } else if (msg.method === "ui/notifications/host-context-changed") {
          applyHostContext(msg.params);
        } else if (msg.method === "ui/notifications/tool-cancelled") {
          setBusy(false);
          setStatus("Tool call cancelled.");
        }
      });

      let resizeRaf = 0;
      if (typeof ResizeObserver !== "undefined") {
        const ro = new ResizeObserver(() => {
          if (!state.connected || resizeRaf) return;
          resizeRaf = requestAnimationFrame(() => {
            resizeRaf = 0;
            const rect = document.documentElement.getBoundingClientRect();
            postToHost({
              jsonrpc: "2.0",
              method: "ui/notifications/size-changed",
              params: {
                width: Math.ceil(rect.width),
                height: Math.ceil(document.documentElement.scrollHeight),
              },
            });
          });
        });
        ro.observe(document.documentElement);
      }

      async function boot() {
        render();
        if (!window.parent || window.parent === window) {
          setStatus("Standalone preview — open inside an MCP Apps host to manage bookmarks.");
          return;
        }
        try {
          const initResult = await Promise.race([
            sendRequest("ui/initialize", {
              protocolVersion: "2026-01-26",
              appInfo: { name: "StartBoard Library", version: "1.0.0" },
              appCapabilities: {},
            }),
            new Promise((_, reject) => setTimeout(() => reject(new Error("Host handshake timed out.")), 1500)),
          ]);
          state.connected = true;
          applyHostContext(initResult && initResult.hostContext);
          postToHost({ jsonrpc: "2.0", method: "ui/notifications/initialized" });
          setStatus("Ready");
        } catch {
          setStatus("Waiting for MCP host data…");
        }
      }

      boot();
    })();
  </script>
</body>
</html>`;
}
