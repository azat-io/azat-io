import { squooshImageService, defineConfig } from 'astro/config'
import rehypeExternalLinks from 'rehype-external-links'
import { fileURLToPath } from 'node:url'
import sitemap from '@astrojs/sitemap'
import compress from 'astro-compress'
import svelte from '@astrojs/svelte'
import { loadTheme } from 'shiki'
import path from 'node:path'

let dirname = fileURLToPath(path.dirname(import.meta.url))

let [gruvboxLight, gruvboxDark] = await Promise.all([
  loadTheme(path.join(dirname, './themes/gruvbox-light.json')),
  loadTheme(path.join(dirname, './themes/gruvbox-dark.json')),
])

export default defineConfig({
  integrations: [
    svelte(),
    sitemap(),
    compress({
      Image: {
        sharp: {
          heif: false,
          jpeg: false,
          tiff: false,
          webp: false,
          avif: true,
          gif: false,
          png: false,
        },
      },
      JavaScript: true,
      HTML: true,
      SVG: true,
    }),
  ],
  markdown: {
    rehypePlugins: [
      [
        rehypeExternalLinks,
        {
          rel: ['noopener', 'noreferrer'],
          target: '_blank',
        },
      ],
    ],
    shikiConfig: {
      experimentalThemes: {
        light: gruvboxLight,
        dark: gruvboxDark,
      },
    },
  },
  prefetch: {
    defaultStrategy: 'viewport',
    prefetchAll: true,
  },
  vite: {
    css: {
      transformer: 'lightningcss',
    },
  },
  image: {
    service: squooshImageService(),
  },
  server: {
    port: 8080,
    host: true,
  },
  build: {
    format: 'file',
  },
  site: 'https://azat.io',
  compressHTML: true,
  srcDir: '.',
})
