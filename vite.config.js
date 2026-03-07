import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import purgeCss from "vite-plugin-purgecss";
import { version } from "./package.json";
import { execSync } from "child_process";

// Get current git commit hash (short)
let gitHash = "dev";
try {
  gitHash = execSync("git rev-parse --short HEAD").toString().trim();
} catch (e) {
  console.warn("Git hash not found, using default 'dev'");
}

// Final version with optional commit hash
const fullVersion = `${version}+${gitHash}`;

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      includeAssets: ["robots.txt", "sitemap.xml", "favicon.ico", "apple-touch-icon.png"],
      manifest: {
        id: "/",
        name: "Drishtee Computer Center",
        short_name: "Drishtee",
        description: "Best IT Training Institute in Nichlaul, Maharajganj offering CCC, ADCA, Web Development and NIELIT courses.",
        theme_color: "#00268f",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait-primary",
        start_url: "/",
        scope: "/",
        lang: "en-IN",
        version: fullVersion,
        icons: [
          { src: "/images/icon/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/images/icon/icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "/images/icon/icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
        ]
      },
      // यह नया ऑप्शन जोड़ें - service worker का नाम बदलने के लिए
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,svg,webp,ico,woff,woff2}"],
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        // यह line जोड़ें - हर बिल्ड में नया नाम
        swDest: `sw-${fullVersion.replace(/\./g, '-')}.js`,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/.*$/,
            handler: "CacheFirst",
            options: {
              cacheName: "external-assets",
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 30 }
            }
          }
        ]
      }
    }),
    purgeCss({
      content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
      safelist: {
        standard: [/^bi-/, /^bi$/],
        deep: [/^bi-/],
        greedy: [/Toastify/, /swiper/, /aos/, /recharts/, /^bi-/, /^bi$/]
      }
    })
  ],
  build: {
    minify: "esbuild",
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
  server: {
    host: true,
    port: 5173
  },
  preview: {
    port: 4173,
    host: true
  }
});