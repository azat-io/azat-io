import type { Config } from 'stylelint'

export default {
  overrides: [
    {
      files: ['**/*.svelte', '**/*.astro'],
      customSyntax: 'postcss-html',
    },
  ],
  extends: '@azat-io/stylelint-config',
  ignoreFiles: ['dist/**/*'],
} satisfies Config
