import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'
import { typst } from 'astro-typst'

const BASE = process.env.BASE_PATH || ''

export default defineConfig({
  site: 'https://space.alex3236.moe',
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
        return 'html'
      },
    }),
  ],
  output: 'static',
  build: {
    assets: 'assets',
  },
  server: {
    host: '0.0.0.0',
  },
  vite: {
    ssr: {
      noExternal: ['react-icons'],
    },
  },
})
