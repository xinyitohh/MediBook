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
        target: "https://localhost:44355",
        changeOrigin: true,
        secure: false, // accepts self-signed cert
      },
    },
  },
});
