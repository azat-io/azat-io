import type { Locale } from '~/locales'

import { defaultLocale, translations } from '~/locales'

export function getLocaleFromUrl(url?: URL, anyLang = false): Locale {
  if (!url) {
    return defaultLocale
  }

  let [, lang] = url.pathname.replace(/\.html$/u, '').split('/', 2)

  if (anyLang) {
    return lang as keyof typeof translations
  }

  if (lang && Object.hasOwn(translations, lang)) {
    return lang as keyof typeof translations
  }

  return defaultLocale
}
