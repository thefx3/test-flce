import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from "path";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/videos": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      "shared-ui": path.resolve(path.dirname(new URL(import.meta.url).pathname), "../shared-ui")
    },
  },
});