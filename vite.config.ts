import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      manifest: {
        name: 'Line Free India',
        short_name: 'LFIndia',
        description: 'Skip the queue, save your time',
        theme_color: '#1e1b4b',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024 // 6MB limit for large bundles
      }
    })
  ],

  build: {
    // Keep Vite/Rollup default chunking to avoid circular chunk initialisation
    // bugs that can crash the app at startup in production.
    chunkSizeWarningLimit: 1000,
    sourcemap: false
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },

  // 🔥 IMPORTANT (ngrok fix)
  server: {
    host: true,
    allowedHosts: 'all'
  }
});
