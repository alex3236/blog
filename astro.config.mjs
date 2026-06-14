import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import { typst } from "astro-typst";
import { rehypeShiki } from "./src/plugins/rehypeShiki";

const BASE = process.env.BASE_PATH || "";

export default defineConfig({
  site: "https://space.alex3236.moe",
  base: BASE,
  integrations: [
    react(),
    tailwind(),
    sitemap(),
    typst({
      options: {
        remPx: 16,
      },
      target: (id) => {
        return "html";
      },
    }),
  ],
  output: "static",
  markdown: {
    rehypePlugins: [rehypeShiki],
  },
  build: {
    assets: "assets",
  },
  server: {
    host: "0.0.0.0",
  },
  vite: {
    ssr: {
      noExternal: ["react-icons"],
    },
  },
});
