import type { CollectionEntry } from 'astro:content'

import { getCollection } from 'astro:content'

export async function getPosts(locale?: string): Promise<
  (Omit<CollectionEntry<'blog'>, 'slug'> & {
    slug: string
  })[]
> {
  let collection = await getCollection('blog')

  return collection
    .filter(page => {
      if (!locale) {
        return true
      }
      let [_, localeValue] = page.id.split('/')
      return localeValue === locale
    })
    .toSorted((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
    .map(page => {
      let [slug] = page.id.split('/')
      return {
        ...page,
        slug: slug!,
      }
    })
}
