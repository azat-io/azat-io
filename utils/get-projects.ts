import { getCollection } from 'astro:content'

export let getProjects = async (locale?: string) => {
  let collection = await getCollection('projects')

  return collection
    .filter(page => {
      if (!locale) {
        return true
      }
      let [lang] = page.slug.split('/')
      return lang === locale
    })
    .map(page => {
      let [_lang, ...slug] = page.slug.split('/')
      return {
        ...page,
        slug: slug.join('/'),
      }
    })
}
