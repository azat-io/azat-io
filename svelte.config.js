import { vitePreprocess } from '@astrojs/svelte'

export default {
  compilerOptions: {
    cssHash: ({ hash, css }) => `s-${hash(css)}`,
    discloseVersion: false,
  },
  preprocess: [vitePreprocess()],
}
