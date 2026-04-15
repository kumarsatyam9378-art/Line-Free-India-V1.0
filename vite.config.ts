diff --git a/vite.config.ts b/vite.config.ts
index 627ea00a295cfb139c6ed53446d8a1a9930cd3b8..0c581ca3bf692dfc942f494082306a44543315a0 100644
--- a/vite.config.ts
+++ b/vite.config.ts
@@ -13,59 +13,43 @@ export default defineConfig({
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
-    rollupOptions: {
-      output: {
-        manualChunks(id) {
-          if (id.includes('node_modules')) {
-            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
-              return 'react-vendor';
-            }
-            if (id.includes('firebase')) {
-              return 'firebase';
-            }
-            if (id.includes('framer-motion') || id.includes('recharts') || id.includes('leaflet')) {
-              return 'ui';
-            }
-            return 'vendor';
-          }
-        }
-      }
-    },
+    // Keep Vite/Rollup default chunking to avoid circular chunk initialisation
+    // bugs that can crash the app at startup in production.
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
