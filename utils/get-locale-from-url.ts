import { defaultLocale, translations } from '~/locales'

export let getLocaleFromUrl = (url?: URL, anyLang = false) => {
  if (!url) {
    return defaultLocale
  }

  let [, lang] = url.pathname.replace(/\.html$/, '').split('/')

  if (anyLang) {
    return lang as keyof typeof translations
  }

  if (lang && lang in translations) {
    return lang as keyof typeof translations
  }

  return defaultLocale
}
