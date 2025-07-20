import type { PhrasingContent, Paragraph, Root, Code } from 'mdast'
import type { Properties, Result } from 'hastscript'
import type { Transformer, Plugin } from 'unified'
import type { Parent, Node } from 'unist'

import { visit } from 'unist-util-visit'
import { h as _h } from 'hastscript'

function getLanguageName(lang: string): string {
  let languages: Record<string, string> = {
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

function hast(
  element: string,
  attrs: Properties = {},
  children: unknown[] = [],
): Paragraph {
  let { properties, tagName } = _h(element, attrs)
  return {
    data: { hProperties: properties, hName: tagName },
    children: children as PhrasingContent[],
    type: 'paragraph',
  }
}

export let remarkCopyCode: Plugin<[], Root> =
  (): Transformer<Root> => (tree: Node) => {
    visit(tree, 'code', (node: Code, index: number, parent: Parent) => {
      let { lang } = node

      let html = hast(
        'div',
        {
          class: 'copy-code-wrapper',
        },
        [
          hast('button', {
            'aria-label': 'Copy code to clipboard',
            class: 'copy-code-button',
            'data-lang': lang,
            type: 'button',
          }),
          typeof lang === 'string' &&
            hast(
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
