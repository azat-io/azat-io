/// <reference path=".astro/types.d.ts" />

import 'astro/astro-jsx'

declare global {
  namespace JSX {
    type IntrinsicElements = astroHTML.JSX.IntrinsicElements
    type Element = HTMLElement
  }
}
