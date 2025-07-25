import { defaultLocale, translations } from '~/locales'

export function useTranslations<
  T extends keyof (typeof translations)[typeof defaultLocale],
>(locale: keyof typeof translations, path: T) {
  return (
    key: keyof (typeof translations)[typeof defaultLocale][typeof path],
  ): (typeof translations)[typeof defaultLocale][typeof path][keyof (typeof translations)[typeof defaultLocale][typeof path]] =>
    translations[locale][path][key] || translations[defaultLocale][path][key]
}
