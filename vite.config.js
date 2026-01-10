import {fileURLToPath, URL} from "node:url";

import {defineConfig} from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import tailwindcss from "@tailwindcss/vite";
import {VitePWA} from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      includeAssets: ["favicon.svg", "robots.txt", "apple-touch-icon.png"],
      manifest: {
        name: "Pocket Story",
        short_name: "PocketStory",
        description: "story writer by @sht0rmx",
        theme_color: "#242933",
        background_color: "#242933",
        icons: [
          {
            src: "pwa/pwa-192-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa/pwa-512-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,json}"],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,

        navigateFallback: "index.html",

        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365}
            }
          }
        ]
      },
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
