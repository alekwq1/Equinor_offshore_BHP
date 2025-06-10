import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { viteStaticCopy } from "vite-plugin-static-copy";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  assetsInclude: ["**/*.gltf"],
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: resolve(__dirname, "public/_headers"),
          dest: ".", // skopiuje do dist/_headers
        },
      ],
    }),
  ],
  publicDir: resolve(__dirname, "public"),
});
