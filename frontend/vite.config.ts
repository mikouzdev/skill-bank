import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  cacheDir: "node_modules/.vite",
  server: {
    proxy: {
      "/consultants": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      "/skill": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
