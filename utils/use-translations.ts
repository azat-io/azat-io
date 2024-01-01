import { defaultLocale, translations } from '~/locales'

export let useTranslations =
  <T extends keyof (typeof translations)[typeof defaultLocale]>(
    locale: keyof typeof translations,
    path: T,
  ) =>
  (key: keyof (typeof translations)[typeof defaultLocale][typeof path]) =>
    translations[locale][path][key] || translations[defaultLocale][path][key]
