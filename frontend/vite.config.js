import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    exclude: ["@react-pdf/renderer"],
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5082",
        changeOrigin: true,
        secure: false, // accepts self-signed cert
      },
    },
  },
});
