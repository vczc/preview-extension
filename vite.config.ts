import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "build/dist",
    emptyOutDir: true,
    assetsInlineLimit: 0,
    rollupOptions: {
      external: ["vscode"],
    },
  },
  server: {
    host: "0.0.0.0",
  },
});
