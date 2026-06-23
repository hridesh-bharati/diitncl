import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { readFileSync } from "fs"; 

// package.json से बेस वर्जन पढ़ें (जैसे: "1.0.0")
const pkg = JSON.parse(readFileSync("./package.json", "utf-8"));

// अगर GitHub Actions से बिल्ड नंबर मिल रहा है तो उसे जोड़ें, वरना लोकल बेस वर्जन रखें
const appVersion = process.env.VITE_BUILD_VERSION 
  ? `${pkg.version}-build.${process.env.VITE_BUILD_VERSION}` 
  : `${pkg.version}-local`;

export default defineConfig(({ command }) => {
  return {
    define: {
      // अब पूरे ऐप में __APP_VERSION__ से नया डायनामिक वर्जन मिलेगा
      '__APP_VERSION__': JSON.stringify(appVersion),
    },
    plugins: [
      react(), 

      VitePWA({
        registerType: "autoUpdate",
        injectRegister: "inline",  
        includeAssets: [
          "robots.txt",
          "sitemap.xml",
          "favicon.ico",
          "images/icon/icon-192.png",
          "images/icon/icon-512.png",
          "images/icon/apple-touch-icon.png"
        ],
        manifest: {
          name: "Drishtee Computer Center",
          short_name: "Drishtee",
          version: appVersion, // PWA Manifest को भी नया डायनामिक वर्जन मिलेगा
          description: "Govt Registered IT Training Institute in Nichlaul | CCC, ADCA, Python, Web Development",
          start_url: "/",
          display: "standalone",
          display_override: ["standalone", "window-controls-overlay"],
          theme_color: "#00378a",
          background_color: "#ffffff",
          orientation: "portrait",
          scope: "/",
          icons: [
            {
              src: "images/icon/icon-192.png",
              sizes: "192x192",
              type: "image/png"
            },
            {
              src: "images/icon/icon-512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any maskable"
            }
          ]
        },
        workbox: {
          globPatterns: ["**/*.{js,css,html,ico}"],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/res\.cloudinary\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'cloudinary-images-cache',
                expiration: {
                  maxEntries: 40,
                  maxAgeSeconds: 60 * 60 * 24 * 30 
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            }
          ]
        }
      })
    ],

    server: {
      host: '0.0.0.0',
      port: 5173,
      open: true
    },

    build: {
      target: "es2022",
      minify: "terser",
      cssCodeSplitting: true, 
      sourcemap: false,
      chunkSizeWarningLimit: 800,
      
      terserOptions: {
        compress: {
          drop_console: true, 
          drop_debugger: true,
          pure_funcs: ['console.info', 'console.error', 'console.warn']
        },
        format: {
          comments: false
        }
      },

      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (id.includes("firebase")) {
                return "vendor-firebase";
              }
              if (
                id.includes("node_modules/react/") || 
                id.includes("node_modules/react-dom/") || 
                id.includes("node_modules/react-router") ||
                id.includes("node_modules/@remix-run")  
              ) {
                return "vendor-react-core";
              }
              return "vendor-libs";
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
    }
  };
});