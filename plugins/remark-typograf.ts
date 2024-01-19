import type { Transformer, Plugin } from 'unified'
import type { Literal, Parent, Node } from 'unist'
import type { Root } from 'mdast'

import { visit } from 'unist-util-visit'
import Typograf from 'typograf'

export let remarkTypograf: Plugin<[], Root> =
  (): Transformer<Root> => (tree: Node, file) => {
    visit(tree, (node: Node, index: undefined | number, parent: Parent) => {
      let [fileName] = file.history
      let locale = fileName
        ?.replace(/\.mdx?$/, '')
        .split('/')
        .pop()
      if (
        locale &&
        ['en', 'ru'].includes(locale) &&
        node.type === 'text' &&
        typeof index === 'number'
      ) {
        let localeValue = locale === 'en' ? ['en-US'] : ['ru', 'en-US']
        let typograf = new Typograf({
          locale: localeValue,
        })

        let text = (node as Literal).value
        if (typeof text === 'string') {
          ;(parent.children[index] as Literal).value = typograf.execute(text, {
            ruleFilter: rule =>
              !(
                rule.name === 'common/space/trimRight' ||
                rule.name === 'common/space/trimLeft'
              ),
          })
        }
      }
    })
  }
