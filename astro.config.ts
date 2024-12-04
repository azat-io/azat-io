import { sharpImageService, defineConfig } from 'astro/config'
import rehypeExternalLinks from 'rehype-external-links'
import { browserslistToTargets } from 'lightningcss'
import svelteSvg from '@poppanator/sveltekit-svg'
import remarkSectionize from 'remark-sectionize'
import compress from '@playform/compress'
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
import { homepage } from './package.json'

export default defineConfig({
  markdown: {
    shikiConfig: {
      transformers: [
        {
          pre: node => {
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
  vite: {
    build: {
      rollupOptions: {
        onwarn: (warning, warn) => {
          if (
            warning.plugin === 'vite:reporter' &&
            warning.message.includes('Icon.astro')
          ) {
            return
          }
          warn(warning)
        },
      },
    },
    css: {
      lightningcss: {
        targets: browserslistToTargets(
          browserslist(null, {
            config: path.join(import.meta.dirname, './.browserslistrc'),
          }),
        ),
      },
      transformer: 'lightningcss',
    },
    plugins: [svelteSvg()],
  },
  integrations: [
    compress({
      JavaScript: true,
      Image: false,
      HTML: true,
      CSS: false,
      SVG: true,
    }),
    sitemap({
      filter: page => !new RegExp(`^${homepage}/?$`).test(page),
    }),
    svelte(),
    mdx(),
  ],
  experimental: {
    svg: {
      mode: 'inline',
    },
    responsiveImages: true,
    clientPrerender: true,
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
    service: sharpImageService(),
  },
  server: {
    port: 8080,
    host: true,
  },
  srcDir: import.meta.dirname,
  compressHTML: true,
  site: homepage,
})
