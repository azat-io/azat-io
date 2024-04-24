import { squooshImageService, defineConfig } from 'astro/config'
import rehypeExternalLinks from 'rehype-external-links'
import { browserslistToTargets } from 'lightningcss'
import remarkSectionize from 'remark-sectionize'
import compress from '@playform/compress'
import { fileURLToPath } from 'node:url'
import browserslist from 'browserslist'
import sitemap from '@astrojs/sitemap'
import remarkMath from 'remark-math'
import svelte from '@astrojs/svelte'
import mdx from '@astrojs/mdx'
import path from 'node:path'
import JSON5 from 'json5'

import { remarkCopyCode } from './plugins/remark-copy-code'
import gruvboxLight from './themes/gruvbox-light.json?raw'
import { remarkHeadings } from './plugins/remark-headings'
import { remarkTypograf } from './plugins/remark-typograf'
import gruvboxDark from './themes/gruvbox-dark.json?raw'
import { remarkKatex } from './plugins/remark-katex'

let dirname = fileURLToPath(path.dirname(import.meta.url))

export default defineConfig({
  markdown: {
    shikiConfig: {
      transformers: [
        {
          pre: node => {
            delete node.properties.tabindex
            delete node.properties.style
          },
        },
      ],
      themes: {
        light: JSON5.parse(gruvboxLight),
        dark: JSON5.parse(gruvboxDark),
      },
    },
    rehypePlugins: [
      [
        rehypeExternalLinks,
        {
          rel: ['noopener', 'noreferrer'],
          target: '_blank',
        },
      ],
    ],
    remarkPlugins: [
      remarkSectionize,
      remarkCopyCode,
      remarkHeadings,
      remarkTypograf,
      remarkKatex,
      remarkMath,
    ],
  },
  integrations: [
    compress({
      Exclude: [
        (file: string) => file.endsWith('.png') && !file.includes('hero.'),
      ],
      JavaScript: true,
      Image: true,
      HTML: true,
      SVG: true,
    }),
    sitemap(),
    svelte({
      compilerOptions: {
        cssHash: ({ hash, css }) => `s-${hash(css)}`,
        discloseVersion: false,
      },
    }),
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
  srcDir: dirname,
})
