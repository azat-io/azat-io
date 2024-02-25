import enFlag from '~/assets/flags/flag-us.svg?raw'
import ruFlag from '~/assets/flags/flag-ru.svg?raw'
import en from '~/locales/en'
import ru from '~/locales/ru'

export type Locale = keyof typeof translations

export let translations = {
  en,
  ru,
}

export let locales: {
  originName: string
  code: Locale
  icon: string
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
