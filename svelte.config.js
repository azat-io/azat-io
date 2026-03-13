import { vitePreprocess } from '@astrojs/svelte'

export default {
  compilerOptions: {
    discloseVersion: false,
  },
  preprocess: [vitePreprocess()],
}
