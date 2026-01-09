import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    cacheDir: "node_modules/.vite",
    server: {
      proxy: {
        "/consultants": {
          target: `${env.VITE_BACKEND_HOST}:${env.VITE_BACKEND_PORT}`,
          changeOrigin: true,
        },
        "/skill": {
          target: `${env.VITE_BACKEND_HOST}:${env.VITE_BACKEND_PORT}`,
          changeOrigin: true,
        },
      },
    },
  };
});
