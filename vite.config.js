import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { readFileSync } from "fs";

const pkg = JSON.parse(readFileSync("./package.json", "utf-8"));

export default defineConfig(({ command }) => {
  const isDev = command === "serve";

  return {
    define: {
      '__APP_VERSION__': JSON.stringify(pkg.version),
    },
    plugins: [
      react({ fastRefresh: isDev }),

      VitePWA({
        registerType: "autoUpdate",
        injectRegister: "auto",
        includeAssets: [
          "robots.txt", "sitemap.xml", "favicon.ico",
          "images/icon/icon-192.png", "images/icon/icon-512.png",
          "images/icon/apple-touch-icon.png"
        ],
        manifest: {
          name: "Drishtee Computer Center",
          short_name: "Drishtee",
          version: pkg.version,
          description: "Govt Registered IT Training Institute in Nichlaul | CCC, ADCA, Python, Web Development",
          start_url: "/",
          display: "standalone",
          display_override: ["standalone", "window-controls-overlay"],
          theme_color: "#00378a",
          background_color: "#ffffff",
          orientation: "portrait",
          scope: "/",
          icons: [
            { src: "images/icon/icon-192.png", sizes: "192x192", type: "image/png" },
            { src: "images/icon/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" }
          ]
        },

        workbox: {
          // 🔥 Fix 1: Cache limit ko 5MB tak badhao taaki bade chunks cache ho sakein
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, 
          globPatterns: ["**/*.{js,css,html,png,svg,ico}"]
        }
      })
    ],

    server: {
      host: '0.0.0.0',
      port: 5173,
      open: true
    },

    build: {
      target: "es2020",
      minify: "esbuild",
      sourcemap: "hidden",
      chunkSizeWarningLimit: 1500, // Warning limit ko 1.5MB tak badhao
      rollupOptions: {
        output: {
          // 🔥 Fix 2: Smart Chunking - Vendor bundles ko todna
          manualChunks(id) {
            if (id.includes("node_modules")) {
              // Firebase ko alag bundle
              if (id.includes("firebase")) return "vendor-firebase";
              // PDF Renderer aur Charts heavy hote hain, inko alag bundle
              if (id.includes("@react-pdf") || id.includes("chart.js") || id.includes("html2pdf.js")) {
                return "vendor-heavy-libs";
              }
              // Icons ko alag bundle
              if (id.includes("bootstrap-icons")) return "vendor-icons";
              // Baaki core libraries (React, etc.)
              return "vendor-core";
            }
          }
        }
      }
    },

    resolve: {
      alias: {
        "@": "/src",
        "@components": "/src/components",
        "@pages": "/src/pages",
        "@assets": "/src/assets"
      }
    },

    esbuild: {
      drop: isDev ? [] : ["console", "debugger"],
      legalComments: "none"
    }
  };
});