import type { PhrasingContent, Paragraph, Root, Code } from 'mdast'
import type { Properties, Result } from 'hastscript'
import type { Transformer, Plugin } from 'unified'
import type { Parent, Node } from 'unist'

import { visit } from 'unist-util-visit'
import { h as _h } from 'hastscript'

let h = (
  el: string,
  attrs: Properties = {},
  children: unknown[] = [],
): Paragraph => {
  let { properties, tagName } = _h(el, attrs)
  return {
    data: { hProperties: properties, hName: tagName },
    children: children as PhrasingContent[],
    type: 'paragraph',
  }
}

let getLanguageName = (lang: string): string => {
  let languages: {
    [key: string]: undefined | string
  } = {
    tsx: 'TypeScript',
    jsx: 'JavaScript',
    js: 'JavaScript',
    ts: 'TypeScript',
    svelte: 'Svelte',
    md: 'Markdown',
    html: 'HTML',
    bash: 'Bash',
    json: 'JSON',
    css: 'CSS',
    sh: 'Bash',
    vue: 'Vue',
  }

  return languages[lang] ?? lang
}

export let remarkCopyCode: Plugin<[], Root> =
  (): Transformer<Root> => (tree: Node) => {
    visit(tree, 'code', (node: Code, index: number, parent: Parent) => {
      let { lang } = node

      let html = h(
        'div',
        {
          class: 'copy-code-wrapper',
        },
        [
          h('button', {
            'aria-label': 'Copy code to clipboard',
            class: 'copy-code-button',
            'data-lang': lang,
          }),
          typeof lang === 'string' &&
            h(
              'span',
              {
                class: 'copy-code-label',
              },
              [
                {
                  value: getLanguageName(lang),
                  type: 'text',
                },
              ],
            ),
          node as unknown as Result,
        ],
      )

      parent.children[index] = html
    })
  }
