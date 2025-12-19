import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/github-app-manifest-playground/",
  build: {
    outDir: "dist",
  },
});
