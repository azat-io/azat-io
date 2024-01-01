/// <reference path=".astro/types.d.ts" />
/// <reference types="astro/client" />

declare module '*?raw' {
  let content: string
  export default content
}
