import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "vite";

import react from "@vitejs/plugin-react";
import { presetUno, transformerDirectives } from "unocss";
import UnoCSS from "unocss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    UnoCSS({
      presets: [presetUno()],
      transformers: [transformerDirectives()],
      rules: [
        [
          /^(min-|max-)?([wh])-screen$/,
          ([, prefix, wh]) => [
            {
              [`${prefix ? `${prefix}` : ""}${
                wh === "w" ? "width" : "height"
              }`]: `100v${wh}`,
            },
            {
              [`${prefix ? `${prefix}` : ""}${
                wh === "w" ? "width" : "height"
              }`]: `100dv${wh}`,
            },
          ],
        ],
      ],
    }),
    react(),
  ],
  resolve: {
    alias: {
      "@": join(fileURLToPath(import.meta.url), "../src"),
    },
  },
});
