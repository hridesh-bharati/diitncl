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
      registerType: "autoUpdate",
      injectRegister: "auto",
      includeAssets: [
        "robots.txt",
        "sitemap.xml",
        "favicon.ico",
        "images/icon/icon-192.png",
        "images/icon/icon-512.png"
      ],
      manifest: {
        name: "Drishtee Computer Center",
        short_name: "Drishtee",
        description: "Best IT Training Institute in Nichlaul",
        start_url: "/",
        display: "standalone",
        theme_color: "#00378a",
        background_color: "#ffffff",
        icons: [
          {
            src: "images/icon/icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "images/icon/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable"
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