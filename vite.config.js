import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import purgeCss from "vite-plugin-purgecss";
import compression from "vite-plugin-compression";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig(({ command, mode }) => {
  const isDev = command === "serve";
  const isAnalyze = mode === "analyze";

  return {
    plugins: [
      // React with production optimizations
      react({
        fastRefresh: isDev,
        babel: {
          plugins: isDev ? [] : [["transform-remove-console", { exclude: ["error", "warn"] }]]
        }
      }),

      // Enhanced PWA configuration
      VitePWA({
        registerType: "autoUpdate",
        injectRegister: "auto",
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
          description: "Govt Registered IT Training Institute in Nichlaul | CCC, ADCA, Python, Web Development",
          start_url: "/",
          display: "standalone",
          theme_color: "#00378a",
          background_color: "#ffffff",
          orientation: "portrait",
          scope: "/",
          categories: ["education", "business"],
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
        },
        workbox: {
          globPatterns: ["**/*.{js,css,html,png,svg,jpg,jpeg,webp,woff2,avif}"],
          globIgnores: ["**/stats.html", "**/node_modules/**/*"],
          cleanupOutdatedCaches: true,
          skipWaiting: true,
          clientsClaim: true,
          runtimeCaching: [
            {
              // Firebase Auth Iframe (30m TTL Fix)
              urlPattern: /https:\/\/diit-5bff0\.firebaseapp\.com\/.*auth\/iframe\.js/i,
              handler: "CacheFirst",
              options: {
                cacheName: "firebase-auth-cache",
                expiration: { maxEntries: 1, maxAgeSeconds: 60 * 60 * 24 * 30 },
                cacheableResponse: { statuses: [0, 200] }
              }
            },
            {
              // GitHub Avatars (5m TTL Fix)
              urlPattern: /^https:\/\/avatars\.githubusercontent\.com\/.*/i,
              handler: "StaleWhileRevalidate",
              options: {
                cacheName: "github-avatars",
                expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 7 }
              }
            },
            {
              // Google Fonts
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: "CacheFirst",
              options: {
                cacheName: "google-fonts",
                expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 }
              }
            },
            {
              // Static Images & Cloudinary
              urlPattern: /\.(?:png|jpg|jpeg|svg|webp|avif)$/i,
              handler: "CacheFirst",
              options: {
                cacheName: "images-cache",
                expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 }
              }
            }
          ]
        }
      }),

      // Enhanced PurgeCSS
      !isDev && purgeCss({
        content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
        safelist: {
          standard: [/^bi-/, /^modal/, /^show/, /^fade/, /^collapse/, /^navbar/, /^dropdown/, /^btn/, /^alert/, /^active/, /^spinner-/, /^tab-/],
          deep: [/^dropdown-menu$/, /^nav-link$/, /^modal-content$/, /^alert-.*$/]
        }
      }),

      // Compression Plugins
      !isDev && compression({ algorithm: "brotliCompress", ext: ".br", threshold: 1024 }),
      !isDev && compression({ algorithm: "gzip", ext: ".gz", threshold: 1024 }),

      // Bundle Analyzer
      (isAnalyze || process.env.ANALYZE) && visualizer({ open: true, filename: "dist/stats.html", gzipSize: true, brotliSize: true }),

      // Build info
      {
        name: "build-info",
        buildStart() {
          console.log(`\n🚀 Building Drishtee Pro v2.1\n🕒 ${new Date().toLocaleString()}\n`);
        }
      }
    ].filter(Boolean),

    build: {
      target: ["es2020", "edge88", "firefox78", "chrome87", "safari14"],
      minify: "esbuild",
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (id.includes("react") || id.includes("react-dom") || id.includes("scheduler")) return "vendor-react-core";
              if (id.includes("react-router")) return "vendor-router";

              // Granular Firebase Splitting
              if (id.includes("firebase")) {
                if (id.includes("auth")) return "vendor-firebase-auth";
                if (id.includes("firestore")) return "vendor-firebase-db";
                return "vendor-firebase-core";
              }

              if (id.includes("bootstrap") || id.includes("react-bootstrap")) return "vendor-ui";
              if (id.includes("react-icons") || id.includes("bootstrap-icons")) return "vendor-icons";
              return "vendor-others";
            }
          },
          entryFileNames: "assets/[name].[hash].js",
          chunkFileNames: "assets/[name].[hash].js",
          assetFileNames: "assets/[name].[hash].[ext]",
          compact: !isDev
        }
      },
      chunkSizeWarningLimit: 600,
      emptyOutDir: true,
      assetsInlineLimit: 2048,
      reportCompressedSize: true
    },

    resolve: {
      alias: {
        "@": "/src",
        "@components": "/src/components",
        "@pages": "/src/pages",
        "@assets": "/src/assets"
      },
      extensions: ['.js', '.jsx', '.json']
    },

    esbuild: {
      drop: isDev ? [] : ['console', 'debugger'],
      legalComments: 'none'
    }
  };
});