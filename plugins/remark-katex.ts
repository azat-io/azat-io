import type { Transformer, Plugin } from 'unified'
import type { Literal, Parent, Node } from 'unist'
import type { Root } from 'mdast'

import { visit } from 'unist-util-visit'
import katex from 'katex'

export let remarkKatex: Plugin<[], Root> =
  (): Transformer<Root> => (tree: Node) => {
    let hasMath = false
    visit(tree, (node: Node, index: undefined | number, parent: Parent) => {
      if (
        (node.type === 'inlineMath' || node.type === 'math') &&
        typeof index === 'number'
      ) {
        hasMath = true
        let html = katex.renderToString((node as Literal).value as string)
        let newNode = {
          type: 'html',
          value: html,
        }

        parent.children[index] = newNode
      }
    })

    let treeChildren = (tree as Parent).children

    if (hasMath as boolean) {
      ;(treeChildren as Literal[]).unshift({
        value: `<link
          integrity="sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"
          crossorigin="anonymous"
          rel="stylesheet"
        />`,
        type: 'html',
      })
      ;(treeChildren as Literal[]).unshift({
        value: `<script
          integrity="sha384-XjKyOOlGwcjNTAIQHIpgOno0Hl1YQqzUOEleOLALmuqehneUG+vnGctmUb0ZY0l8"
          src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"
          crossorigin="anonymous"
          defer
        ></script>`,
        type: 'html',
      })
    }
  }
