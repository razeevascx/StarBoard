import { defineConfig, loadEnv } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from "@tailwindcss/vite";
import { resolve } from 'node:path'
import { readFileSync, writeFileSync } from 'node:fs'


// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, import.meta.dirname, 'VITE_')
  const webEnv = loadEnv(mode, resolve(import.meta.dirname, '../web'), 'NEXT_PUBLIC_')
  const vercelHost = process.env.VERCEL_ENV === 'production'
    ? process.env.VERCEL_PROJECT_PRODUCTION_URL
    : process.env.VERCEL_URL
  const webUrl = process.env.VITE_WEB_URL || env.VITE_WEB_URL || (vercelHost ? `https://${vercelHost}` : 'http://localhost:3000')
  const hosts = new Set([`${new URL(webUrl).origin}/*`])
  const key = process.env.VITE_CLERK_PUBLISHABLE_KEY || env.VITE_CLERK_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || webEnv.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  if (key) {
    const encoded = key.replace(/^pk_(test|live)_/, '')
    const frontendHost = Buffer.from(encoded, 'base64').toString('utf8').replace(/\$$/, '')
    hosts.add(`${new URL(`https://${frontendHost}`).origin}/*`)
  }

  return ({
  base: "./",
  define: {
    'import.meta.env.VITE_CLERK_PUBLISHABLE_KEY': JSON.stringify(key || ''),
    'import.meta.env.VITE_WEB_URL': JSON.stringify(webUrl),
  },
  plugins: [
    react(),
    tailwindcss(),
    babel({ presets: [reactCompilerPreset()] }),
    {
      name: 'starboard-extension-manifest',
      apply: 'build',
      writeBundle() {
        const source = resolve(import.meta.dirname, 'public/manifest.json')
        const target = resolve(import.meta.dirname, 'dist/manifest.json')
        const manifest = JSON.parse(readFileSync(source, 'utf8'))
        manifest.host_permissions = [...hosts]
        const extensionKey = process.env.VITE_EXTENSION_PUBLIC_KEY || env.VITE_EXTENSION_PUBLIC_KEY
        if (extensionKey) manifest.key = extensionKey
        writeFileSync(target, JSON.stringify(manifest, null, 2) + '\n')
      },
    },
  ],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        popup: resolve(import.meta.dirname, 'popup.html'),
      },
    },
  },
  })
});
