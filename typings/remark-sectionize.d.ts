declare module 'remark-sectionize' {
  import type { Plugin } from 'unified'
  import type { Root } from 'mdast'

  let plugin: Plugin<object, Root>
  export default plugin
}
