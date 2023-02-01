import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "vite";

import react from "@vitejs/plugin-react";
import { presetUno, transformerDirectives } from "unocss";
import UnoCSS from "unocss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    https: existsSync(".ssl")
      ? {
          key: readFileSync(".ssl/localhost.direct.key"),
          cert: readFileSync(".ssl/localhost.direct.crt"),
        }
      : undefined,
  },
  plugins: [
    VitePWA({
      devOptions: { enabled: true },
      registerType: "autoUpdate",
      manifest: {
        name: "Frontend Experimental",
        icons: [
          { src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
        ],
        file_handlers: [
          {
            action: "/open-text",
            accept: {
              "text/plain": [".txt"],
            },
          },
        ],
      },
    }),
    UnoCSS({
      presets: [presetUno()],
      transformers: [transformerDirectives()],
      rules: [
        [
          // https://web.dev/viewport-units/
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
