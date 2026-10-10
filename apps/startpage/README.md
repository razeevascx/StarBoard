<div align="center">

# Starboard

*A minimalist start page for Chrome, Firefox, and Safari that turns every new tab into a calm, customizable command center.*

![Last Commit](https://img.shields.io/github/last-commit/razeevascx/StarBoard?style=for-the-badge&logo=git&logoColor=D9E0EE&labelColor=1E202B&color=8ad7eb)
![Languages](https://img.shields.io/github/languages/top/razeevascx/StarBoard?style=for-the-badge&logo=github&logoColor=D9E0EE&labelColor=1E202B&color=86dbd7)
![Build Status](https://img.shields.io/github/actions/workflow/status/razeevascx/StarBoard/build.yml?style=for-the-badge&logo=githubactions&logoColor=D9E0EE&labelColor=1E202B&color=86dbce)
![Package Status](https://img.shields.io/github/actions/workflow/status/razeevascx/StarBoard/package.yml?label=release&style=for-the-badge&logo=githubactions&logoColor=D9E0EE&labelColor=1E202B&color=86dbc0)

**Built with:**

<div align="center">
  <img src="https://img.shields.io/badge/React-1E202B?style=for-the-badge&logo=react&logoColor=61DAFB" height="35" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-1E202B?style=for-the-badge&logo=typescript&logoColor=3178C6" height="35" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-1E202B?style=for-the-badge&logo=vite&logoColor=646CFF" height="35" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-1E202B?style=for-the-badge&logo=tailwindcss&logoColor=06B6D4" height="35" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/ESLint-1E202B?style=for-the-badge&logo=eslint&logoColor=4B32C3" height="35" alt="ESLint" />
  <img src="https://img.shields.io/badge/GitHub_Actions-1E202B?style=for-the-badge&logo=githubactions&logoColor=2088FF" height="35" alt="GitHub Actions" />
</div>

</div>

## Overview

Starboard replaces your browser’s new-tab page with a focused dashboard built for fast access and low distraction. It surfaces the essentials: time, bookmarks, quick links, and a personalized background.

The app stores preferences locally and lets you opt into browser permissions only when you want bookmarks exposed. That keeps the experience lightweight while still supporting a more integrated start page when needed.

## Features

- **Focused daily view** — Keep the page useful at a glance with an optional greeting and live clock.
- **Fast search switching** — Search through Google, DuckDuckGo, or Bing from the same command bar.
- **Editable quick links** — Add, update, and remove shortcuts for the sites you use most, with favicon-based cards.
- **Browser-integrated access** — Surface bookmark folders after granting permissions in Settings.
- **Personalized appearance** — Switch between gradient, solid color, or image backgrounds and keep the choice saved locally.
- **Permission-aware behavior** — Enable only the browser capabilities you need, then revoke them later from the settings panel.

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS 4, Catppuccin palette utilities, Lucide icons
- **Browser Platform:** Manifest V3 WebExtensions for Chrome, Firefox, and Safari
- **Tooling:** Bun, ESLint, React Compiler plugin, Babel

## Scripts

- **`bun run dev`** — Start the Vite dev server for local iteration.
- **`bun run build`** — Type-check the project and build the extension into `dist/`.
- **`bun run build:firefox`** — Build into `dist-firefox/`.
- **`bun run build:safari`** — Build Safari resources into `dist-safari/`.
- **`bun run build:all`** — Build all three browser targets.
- **`bun run package:firefox`** — Build and zip the Firefox extension.
- **`bun run safari:convert`** — Generate a macOS Xcode project in `safari/` (requires full Xcode).
- **`bun run package`** — Build the extension and create `starboard-extension.zip`.
- **`bun run preview`** — Preview the built app locally with Vite.
- **`bun run lint`** — Run ESLint across the codebase.

## Getting Started

### Prerequisites

- Bun 1.x
- Chrome or another Chromium-based browser, Firefox 140+, or Safari 16.4+
- Full Xcode for packaging the Safari extension as a macOS app

### Setup

1. **Clone the repository**
	```bash
	git clone https://github.com/razeevascx/StarBoard.git
	```

2. **Navigate to the project directory**
	```bash
	cd StarBoard
	```

3. **Install dependencies**
	```bash
	bun install
	```

4. **Build the extension**
	```bash
	bun run --filter starboard-extension build
	```

5. **Load the unpacked extension**
	```bash
	chrome://extensions -> Developer mode -> Load unpacked -> apps/startpage/dist/
	```

6. **Open a new tab**
	```bash
	The New Tab page should now replace Chrome's default new-tab screen.
	```

### Development

If you want to iterate locally before packaging the extension, run:

```bash
bun run --filter starboard-extension dev
```

To create the distributable zip file, run:

```bash
bun run --filter starboard-extension package
```


## Firefox

From the repository root, run:

```bash
bun run --filter starboard-extension build:firefox
```

Open `about:debugging#/runtime/this-firefox`, choose **Load Temporary Add-on**, and select `apps/startpage/dist-firefox/manifest.json`. Open a new tab to use Starboard. Temporary add-ons are removed when Firefox restarts; permanent installation requires signing through Mozilla Add-ons.

The Firefox manifest uses the stable add-on ID `starboard@razeev.com`. Bookmark access is optional. Starboard recognizes Firefox’s toolbar, menu, unfiled, and mobile bookmark folders. The manifest declares data used by account sign-in, bookmark sync, external favicon requests, and search navigation using Firefox’s built-in data consent system.

## Safari on macOS

From the repository root, run:

```bash
bun run --filter starboard-extension safari:convert
```

This generates an Xcode project from the Safari build. Open the generated project in `apps/startpage/safari/`, choose your Apple development team for signing, and build and run the containing app. Enable Starboard in **Safari → Settings → Extensions**, then choose Starboard for **New tabs open with** in **Settings → General**.

If Xcode isn’t available, `build:safari` still produces the web-extension resources; the converter requires the full Xcode installation rather than only Command Line Tools. App Store distribution requires Apple Developer signing and submission. Generated Xcode files are local build artifacts and are ignored by Git.

Safari does not expose the WebExtensions bookmarks API, so browser bookmark access and upload are unavailable there. The clock, greeting, search, backgrounds, quick links, popup, and account UI remain available. Use the web dashboard to manage saved bookmarks. This target packages a macOS extension; iOS packaging is not included.

## Account sign-in and sync across browsers

All targets use the same Clerk instance and `VITE_WEB_URL`. Configure your extension origin in Clerk’s allowed origins and enable its Native API before using extension sign-in. Add the exact origin to the web server’s comma-separated `BOOKMARK_SYNC_ALLOWED_ORIGINS`:

- Chrome: `chrome-extension://<extension-id>`; `VITE_EXTENSION_PUBLIC_KEY` stabilizes this ID.
- Firefox: `moz-extension://<installation-uuid>`; this is an installation-specific UUID, not the manifest’s add-on ID.
- Safari: `safari-web-extension://<installation-uuid>`.

In the extension page’s developer console, `location.protocol + "//" + location.host` shows the origin to configure. Redirects use the browser’s own extension scheme. Production sync accepts only explicitly configured origins; development accepts Chrome IDs and Firefox/Safari UUID origins. Safari account sign-in opens the dashboard but cannot upload Safari’s native bookmarks.
