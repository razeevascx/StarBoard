import { defineConfig, loadEnv } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";
import { readFileSync, writeFileSync } from "node:fs";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const browserTarget =
    mode === "firefox" || mode === "safari" ? mode : "chrome";
  const outDir = browserTarget === "chrome" ? "dist" : `dist-${browserTarget}`;
  const env = loadEnv(browserTarget === "chrome" ? mode : "production", import.meta.dirname, "VITE_");
  const webEnv = loadEnv(
    mode,
    resolve(import.meta.dirname, "../web"),
    "NEXT_PUBLIC_",
  );
  const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const webUrl =
    process.env.VITE_WEB_URL ||
    env.VITE_WEB_URL ||
    (mode === "development"
      ? "http://localhost:3000"
      : vercelHost ? `https://${vercelHost}` : "https://starboard.razeev.com");
  const hosts = new Set([`${new URL(webUrl).origin}/*`]);
  const key =
    process.env.VITE_CLERK_PUBLISHABLE_KEY ||
    env.VITE_CLERK_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
    webEnv.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  let clerkSyncHost = process.env.VITE_CLERK_SYNC_HOST || env.VITE_CLERK_SYNC_HOST || "";
  if (key) {
    const encoded = key.replace(/^pk_(test|live)_/, "");
    const frontendHost = Buffer.from(encoded, "base64")
      .toString("utf8")
      .replace(/\$$/, "");
    clerkSyncHost = new URL(`https://${frontendHost}`).origin;
    hosts.add(`${clerkSyncHost}/*`);
  }

  return {
    base: "./",
    define: {
      "import.meta.env.VITE_CLERK_PUBLISHABLE_KEY": JSON.stringify(key || ""),
      "import.meta.env.VITE_CLERK_SYNC_HOST": JSON.stringify(clerkSyncHost),
      "import.meta.env.VITE_WEB_URL": JSON.stringify(webUrl),
    },
    plugins: [
      react(),
      tailwindcss(),
      babel({ presets: [reactCompilerPreset()] }),
      {
        name: "starboard-extension-manifest",
        apply: "build",
        writeBundle() {
          const source = resolve(import.meta.dirname, "public/manifest.json");
          const target = resolve(import.meta.dirname, outDir, "manifest.json");
          const manifest = JSON.parse(readFileSync(source, "utf8"));
          manifest.host_permissions = [...hosts];
          const extensionKey =
            process.env.VITE_EXTENSION_PUBLIC_KEY ||
            env.VITE_EXTENSION_PUBLIC_KEY;
          if (browserTarget === "chrome" && extensionKey)
            manifest.key = extensionKey;
          if (browserTarget === "firefox") {
            manifest.background = { scripts: ['background.js'], type: 'module' };
            manifest.browser_specific_settings = {
              gecko: {
                id: "starboard@razeev.com",
                strict_min_version: "140.0",
                data_collection_permissions: {
                  required: [
                    "authenticationInfo",
                    "personallyIdentifyingInfo",
                    "bookmarksInfo",
                    "browsingActivity",
                    "searchTerms",
                  ],
                },
              },
            };
          }
          if (browserTarget === "safari") {
            delete manifest.background;
            // Safari does not expose the WebExtensions bookmarks API.
            delete manifest.optional_permissions;
            manifest.browser_specific_settings = {
              safari: { strict_min_version: "16.4" },
            };
          }
          writeFileSync(target, JSON.stringify(manifest, null, 2) + "\n");
        },
      },
    ],
    build: {
      outDir,
      emptyOutDir: true,
      sourcemap: true,
      rollupOptions: {
        input: {
          main: resolve(import.meta.dirname, "index.html"),
          popup: resolve(import.meta.dirname, "popup.html"),
          background: resolve(import.meta.dirname, "src/background.ts"),
        },
        output: {
          entryFileNames: (chunk) => chunk.name === 'background' ? 'background.js' : 'assets/[name]-[hash].js',
        },
      },
    },
  };
});
