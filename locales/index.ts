import type { ComponentType } from 'svelte'

import enFlag from '~/assets/flags/flag-us.svg?component'
import ruFlag from '~/assets/flags/flag-ru.svg?component'
import en from '~/locales/en'
import ru from '~/locales/ru'

export type Locale = keyof typeof translations

export let translations = {
  en,
  ru,
}

export let locales: {
  icon: ComponentType
  originName: string
  code: Locale
}[] = [
  {
    originName: 'English',
    icon: enFlag,
    code: 'en',
  },
  {
    /* spell-checker:disable-next-line */
    originName: 'Русский',
    icon: ruFlag,
    code: 'ru',
  },
]

export let defaultLocale: Locale = 'en'
