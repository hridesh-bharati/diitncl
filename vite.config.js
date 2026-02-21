import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Drishtee Computer Center",
        short_name: "Drishtee",
        theme_color: "#00268f",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
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
          }
        ]
      }
    })
  ],
  server: {
    host: true,
    port: 5173 
  }
});