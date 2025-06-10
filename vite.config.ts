import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  assetsInclude: ["**/*.gltf"],
  plugins: [react()],
  server: {
    headers: {
      "Content-Security-Policy": "script-src 'self' 'unsafe-eval';",
    },
  },
});
