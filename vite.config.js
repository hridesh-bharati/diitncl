// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import purgeCss from "vite-plugin-purgecss";

export default defineConfig({
  plugins: [
    react(),

    // ✅ PWA Configuration with Auto Update
    VitePWA({
      registerType: "autoUpdate",  // Auto update service worker
      injectRegister: "auto",
      includeAssets: ["robots.txt", "sitemap.xml", "favicon.ico"],

      manifest: {
        id: "/",
        name: "Drishtee Computer Center",
        short_name: "Drishtee",
        description: "Best IT Training Institute in Nichlaul Maharajganj offering CCC, ADCA, Web Development and Python courses.",
        theme_color: "#00268f",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait-primary",
        start_url: "/",
        scope: "/",
        lang: "en-IN",
        icons: [
          { src: "/images/icon/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/images/icon/icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "/images/icon/icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
        ]
      },

      workbox: {
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        navigateFallback: "/offline.html",

        runtimeCaching: [
          {
            urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "cdn-cache",
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 30 }
            }
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|webp|avif|gif)$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "image-cache",
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 30 }
            }
          },
          {
            urlPattern: /\.(?:js|css)$/i,
            handler: "StaleWhileRevalidate",
            options: { cacheName: "static-resources" }
          }
        ]
      }
    }),

    // ✅ Purge unused CSS
    purgeCss({
      content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
      safelist: { standard: [/^bi-/, /^bi$/] }
    })
  ],

  build: {
    target: "es2020",
    minify: "esbuild",
    cssCodeSplit: true
  },

  // ✅ App version available as __APP_VERSION__ in your code
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || "2.0")
  },

  server: {
    host: true,
    port: 5173
  }
});