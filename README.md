<div align="center">

# NEW TAB

*A minimalist Chrome start page that turns every new tab into a calm, customizable command center.*

![Last Commit](https://img.shields.io/github/last-commit/razeevascx/startpage?style=for-the-badge&logo=git&logoColor=D9E0EE&labelColor=1E202B&color=8ad7eb)
![Languages](https://img.shields.io/github/languages/top/razeevascx/startpage?style=for-the-badge&logo=github&logoColor=D9E0EE&labelColor=1E202B&color=86dbd7)
![Build Status](https://img.shields.io/github/actions/workflow/status/razeevascx/startpage/build.yml?style=for-the-badge&logo=githubactions&logoColor=D9E0EE&labelColor=1E202B&color=86dbce)
![Package Status](https://img.shields.io/github/actions/workflow/status/razeevascx/startpage/package.yml?label=release&style=for-the-badge&logo=githubactions&logoColor=D9E0EE&labelColor=1E202B&color=86dbc0)

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

New Tab replaces the default Chrome new-tab page with a focused dashboard built for fast access and low distraction. It is designed for people who want a cleaner start page that still surfaces the essentials: search, time, bookmarks, quick links, and a personalized background.

The app stores preferences locally and lets you opt into browser permissions only when you want bookmarks exposed. That keeps the experience lightweight while still supporting a more integrated start page when needed.

## Features

- **Focused daily view** — Keep the page useful at a glance with an optional greeting, live clock, and monthly calendar.
- **Fast search switching** — Search through Google, DuckDuckGo, or Bing from the same command bar.
- **Editable quick links** — Add, update, and remove shortcuts for the sites you use most, with favicon-based cards.
- **Browser-integrated access** — Surface bookmark folders after granting permissions in Settings.
- **Personalized appearance** — Switch between gradient, solid color, or image backgrounds and keep the choice saved locally.
- **Permission-aware behavior** — Enable only the browser capabilities you need, then revoke them later from the settings panel.

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS 4, Catppuccin palette utilities, Lucide icons
- **Browser Platform:** Chrome Extension Manifest V3, Chrome bookmarks/storage APIs
- **Tooling:** Bun, ESLint, React Compiler plugin, Babel

## Scripts

- **`bun run dev`** — Start the Vite dev server for local iteration.
- **`bun run build`** — Type-check the project and build the extension into `dist/`.
- **`bun run package`** — Build the extension and create `new-tab-extension.zip`.
- **`bun run preview`** — Preview the built app locally with Vite.
- **`bun run lint`** — Run ESLint across the codebase.

## Getting Started

### Prerequisites

- Bun 1.x
- Google Chrome or another Chromium-based browser

### Setup

1. **Clone the repository**
	```bash
	git clone https://github.com/razeevascx/startpage.git
	```

2. **Navigate to the project directory**
	```bash
	cd startpage
	```

3. **Install dependencies**
	```bash
	bun install
	```

4. **Build the extension**
	```bash
	bun run build
	```

5. **Load the unpacked extension**
	```bash
	chrome://extensions -> Developer mode -> Load unpacked -> dist/
	```

6. **Open a new tab**
	```bash
	The New Tab page should now replace Chrome's default new-tab screen.
	```

### Development

If you want to iterate locally before packaging the extension, run:

```bash
bun run dev
```

To create the distributable zip file, run:

```bash
bun run package
```
