# Starboard

Starboard is a calm, customizable browser start page with a live clock, greeting, quick links, and optional bookmarks. The Chrome extension and web app share the same dashboard and settings.

## Apps

- `apps/startpage` builds the Chrome extension.
- `apps/web` runs the dashboard as a regular website. It uses local browser storage and sample bookmarks because websites cannot access extension permissions.

## Development

Install dependencies with `bun install`, then run `bun run dev`. To build all apps, run `bun run build`.
