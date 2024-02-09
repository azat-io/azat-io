/// <reference path=".astro/types.d.ts" />
/// <reference types="astro/client" />

declare module '*?raw' {
  let content: string
  export default content
}

declare module 'remark-sectionize' {
  import type { Plugin } from 'unified'
  import type { Root } from 'mdast'
  let plugin: Plugin<{}, Root>
  export default plugin
}
