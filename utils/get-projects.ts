import type { CollectionEntry } from 'astro:content'

import { getCollection } from 'astro:content'

export let getProjects = async (
  locale?: string,
): Promise<
  (Omit<CollectionEntry<'projects'>, 'slug'> & {
    slug: string
  })[]
> => {
  let collection = await getCollection('projects')

  return collection
    .filter(page => {
      if (!locale) {
        return true
      }
      let [_, localeValue] = page.id.split('/')
      return localeValue === locale
    })
    .map(page => {
      let [slug] = page.id.split('/')
      return {
        ...page,
        slug: slug!,
      }
    })
}
