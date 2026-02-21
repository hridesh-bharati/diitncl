import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",

      includeAssets: [
        "robots.txt",
        "sitemap.xml",
        "favicon.ico"
      ],

      manifest: {
        id: "/",
        name: "Drishtee Computer Center",
        short_name: "Drishtee",
        description:
          "Best IT Training Institute in Nichlaul, Maharajganj offering CCC, ADCA, Web Development and NIELIT courses.",
        theme_color: "#00268f",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait-primary",
        start_url: "/",
        scope: "/",
        lang: "en-IN",

        icons: [
          {
            src: "/images/icon/icon-192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/images/icon/icon-512.png",
            sizes: "512x512",
            type: "image/png"
          },
          {
            src: "/images/icon/icon-512-maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          }
        ]
      },

      workbox: {
        globPatterns: ["**/*.{js,css,html,png,svg,webp,ico}"],
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true
      },

      devOptions: {
        enabled: false
      }
    })
  ],

  build: {
    minify: "esbuild",
    sourcemap: false,
    target: "es2020",
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000,

    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"]
        }
      }
    }
  },

  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom"]
  },

  server: {
    host: true,
    port: 5173
  },

  preview: {
    port: 4173,
    host: true
  }
});
