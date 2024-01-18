import { squooshImageService, defineConfig } from 'astro/config'
import rehypeExternalLinks from 'rehype-external-links'
import { browserslistToTargets } from 'lightningcss'
import { fileURLToPath } from 'node:url'
import browserslist from 'browserslist'
import sitemap from '@astrojs/sitemap'
import compress from 'astro-compress'
import remarkMath from 'remark-math'
import svelte from '@astrojs/svelte'
import mdx from '@astrojs/mdx'
import path from 'node:path'
import JSON5 from 'json5'

import { remarkCopyCode } from './plugins/remark-copy-code'
import gruvboxLight from './themes/gruvbox-light.json?raw'
import { remarkHeadings } from './plugins/remark-headings'
import gruvboxDark from './themes/gruvbox-dark.json?raw'
import { remarkKatex } from './plugins/remark-katex'

let dirname = fileURLToPath(path.dirname(import.meta.url))

export default defineConfig({
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
        light: JSON5.parse(gruvboxLight),
        dark: JSON5.parse(gruvboxDark),
      },
    },
    remarkPlugins: [remarkCopyCode, remarkHeadings, remarkMath, remarkKatex],
  },
  integrations: [
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
    sitemap(),
    svelte(),
    mdx(),
  ],
  vite: {
    css: {
      lightningcss: {
        targets: browserslistToTargets(
          browserslist(null, {
            config: path.join(dirname, './.browserslistrc'),
          }),
        ),
      },
      transformer: 'lightningcss',
    },
  },
  prefetch: {
    defaultStrategy: 'viewport',
    prefetchAll: true,
  },
  build: {
    inlineStylesheets: 'always',
    format: 'file',
  },
  image: {
    service: squooshImageService(),
  },
  experimental: {
    clientPrerender: true,
  },
  server: {
    port: 8080,
    host: true,
  },
  site: 'https://azat.io',
  compressHTML: true,
  srcDir: '.',
})
