import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  assetsInclude: ["**/*.gltf"],
  plugins: [react()],
  publicDir: resolve(__dirname, "public"), // zapewnia skopiowanie do dist/
});
