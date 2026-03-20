import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ command }) => {
  const isDev = command === "serve";

  return {
    plugins: [
      react({ fastRefresh: isDev }),

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
          description:
            "Govt Registered IT Training Institute in Nichlaul | CCC, ADCA, Python, Web Development",
          start_url: "/",
          display: "standalone",
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
          globPatterns: ["**/*.{js,css,html,png,svg,ico}"]
        }
      })
    ],

    server: {
      host: true,
      port: 5173,
      open: true
    },

    build: {
      target: "es2020",
      minify: "esbuild"
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