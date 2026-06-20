import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Frontend dev server proxies /api to the FastAPI backend so the browser sees
// a single origin (no CORS friction during development).
export default defineConfig({
  plugins: [react()],
  server: {
    // Honor the port assigned by the preview tool (PORT env), else default.
    port: Number(process.env.PORT) || 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
});
