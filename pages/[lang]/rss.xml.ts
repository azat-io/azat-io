import type { APIRoute } from 'astro'

import rss from '@astrojs/rss'

import { getLocaleFromUrl } from '~/utils/get-locale-from-url'
import { useTranslations } from '~/utils/use-translations'
import { getPosts } from '~/utils/get-posts'
import { locales } from '~/locales'

export function getStaticPaths() {
  return locales.map(({ code }) => ({ params: { lang: code } }))
}

export let GET: APIRoute = async ({ site, url }) => {
  let locale = getLocaleFromUrl(url)
  let t = useTranslations(locale, 'rss')

  let posts = await getPosts(locale)

  let items = posts.map(({ data: { description, title, date }, slug }) => ({
    link: `${site}${locale}/blog/${slug}`,
    pubDate: new Date(date),
    description,
    title,
  }))

  return rss({
    customData: `<language>${locale}</language>`,
    description: t('description'),
    title: t('title'),
    site: site!,
    items,
  })
}
