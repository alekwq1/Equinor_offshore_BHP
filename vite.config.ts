<<<<<<< HEAD
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  assetsInclude: ['**/*.gltf'],
  plugins: [react()],
=======
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
>>>>>>> cb345c273dd4cc4c642b917bd7cbf1badae87918
});
