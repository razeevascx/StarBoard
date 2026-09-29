<div align="center">

# STARBOARD

_A calmer new-tab dashboard for the links, bookmarks, and time you use every day._

![Last Commit](https://img.shields.io/github/last-commit/razeevascx/bookmark-manager?style=for-the-badge&logo=git&logoColor=D9E0EE&labelColor=1E202B&color=8ad7eb)


**Built with:**

![Bun](https://img.shields.io/badge/Bun-1E202B?style=for-the-badge&logo=bun&logoColor=FBF0DF)
![React](https://img.shields.io/badge/React-1E202B?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-1E202B?style=for-the-badge&logo=typescript&logoColor=3178C6)
![Next.js](https://img.shields.io/badge/Next.js-1E202B?style=for-the-badge&logo=nextdotjs&logoColor=FFFFFF)
![Vite](https://img.shields.io/badge/Vite-1E202B?style=for-the-badge&logo=vite&logoColor=646CFF)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-1E202B?style=for-the-badge&logo=tailwindcss&logoColor=06B6D4)

</div>

## Overview

Starboard is a focused browser start page that brings your clock, greeting, search, quick links, and bookmarks into one quiet dashboard. The Chrome extension replaces the new-tab page, while the companion Next.js app provides an authenticated bookmark library with collections and trash management.

It is built for people who want their most-used links close at hand without turning every new tab into a noisy feed. Local settings keep the start page fast, and optional Clerk and Neon integration makes bookmark sync available when you need it.

## Features

- **Calm new-tab experience** — Start each browsing session with a live clock, greeting, search bar, and a customizable background.
- **Fast access to favorite sites** — Create editable quick links with favicon-based cards for the places you visit most.
- **Optional browser bookmarks** — Grant bookmark permission only when you want browser folders and saved links surfaced in Starboard.
- **Cross-app bookmark library** — Sync extension bookmarks to an authenticated web dashboard, where folders become collections.
- **Safe bookmark management** — Create, edit, delete, restore, and preview saved bookmarks from the web app.
- **Flexible search** — Switch between Google, DuckDuckGo, and Bing without leaving the start page.

## Apps

| App              | Purpose                                             | Local URL               |
| ---------------- | --------------------------------------------------- | ----------------------- |
| `apps/startpage` | Vite-powered Chrome extension and popup             | `chrome://extensions`   |
| `apps/web`       | Next.js dashboard, authentication, and bookmark API | `http://localhost:3000` |

The extension uses local browser storage for settings and can access real bookmarks through the optional Chrome bookmarks permission. The web app uses Neon Postgres for synced bookmark data and Clerk for authentication.

## Tech Stack

- **Extension:** React 19, TypeScript, Vite, Chrome Extension Manifest V3
- **Web app:** Next.js, React, Clerk, Tailwind CSS
- **Data:** Neon Postgres, Drizzle ORM, SQL migrations with row-level security
- **Workspace:** Bun, Turborepo, shared TypeScript and ESLint configurations

## Getting Started

### Prerequisites

- Bun 1.x
- Node.js 18 or newer
- Google Chrome or another Chromium-based browser
- A Clerk application for authentication
- A Neon Postgres database for the web app

### Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/razeevascx/bookmark-manager.git
   ```

2. **Navigate to the project directory**

   ```bash
   cd bookmark-manager
   ```

3. **Install dependencies**

   ```bash
   bun install
   ```

4. **Configure web environment variables**

   Create `apps/web/.env.local` with your Clerk and Neon values. `DATABASE_URL` must be a Neon Postgres connection string. Set `SITE_URL` only when you want canonical URLs, robots metadata, and a public sitemap for a deployment.

   ```dotenv
   DATABASE_URL=your-neon-postgres-connection-string
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
   CLERK_SECRET_KEY=your-clerk-secret-key
   SITE_URL=http://localhost:3000
   ```

5. **Apply database migrations**

   Run the SQL files in `apps/web/db/migrations` in numeric order against the new database before using bookmark sync.

6. **Start both apps**

   ```bash
   bun run dev
   ```

7. **Open the web dashboard**

   Visit [http://localhost:3000](http://localhost:3000) and sign in through Clerk.

### Load the extension locally

1. **Build the extension**

   ```bash
   bun --cwd apps/startpage run build
   ```

2. **Open Chrome extensions**

   Navigate to `chrome://extensions` and enable **Developer mode**.

3. **Load the unpacked build**

   Choose **Load unpacked** and select `apps/startpage/dist`.

4. **Open a new tab**

   Starboard should now replace Chrome's default new-tab page. Configure account sync in Settings when the extension's Clerk key and allowed origin are set.

## Bookmark Sync

The extension and web app use the same Clerk instance. After sign-in, the extension requests bookmark access and uploads browser bookmarks to the web app in batches. Browser folders become collections using the folder name, and repeated uploads update imported bookmarks instead of creating duplicates.

For local development, the extension reads `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` from `apps/web/.env.local` and targets `http://localhost:3000`. For a deployed extension, configure these values in `apps/startpage/.env.example` or the build environment:

```dotenv
VITE_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
VITE_WEB_URL=https://your-web-app.example
VITE_EXTENSION_PUBLIC_KEY=your-stable-chrome-extension-public-key
```

Configure the resulting extension ID as an allowed origin in Clerk and enable Clerk's Native API for the extension. On the web server, set `BOOKMARK_SYNC_ALLOWED_ORIGINS` to one or more extension origins separated by commas, for example:

```dotenv
BOOKMARK_SYNC_ALLOWED_ORIGINS=chrome-extension://your-extension-id
```

After updating an existing extension, use **Sync now** in Settings → Account to assign previously imported bookmarks to collections.
