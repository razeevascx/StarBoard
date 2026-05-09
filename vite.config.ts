import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from "@tailwindcss/vite";
import path from 'path/win32';


// https://vite.dev/config/
export default defineConfig({
  base: "/startpage/",
  plugins: [
    react(),
    tailwindcss(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
  resolve: {
    alias: {
      // Maps @/components to your root components folder
      '@': path.resolve(__dirname, './'),
      '@components': path.resolve(__dirname, './components'),
      '@lib': path.resolve(__dirname, './lib'),
      '@src': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
      },
      input: {
        main: "index.html",
      },
    },
  },
});
