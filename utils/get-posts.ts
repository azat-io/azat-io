import { getCollection } from 'astro:content'

export let getPosts = async (locale?: string) => {
  let collection = await getCollection('blog')
  return collection
    .filter(page => {
      if (!locale) {
        return true
      }
      let [lang] = page.slug.split('/')
      return lang === locale
    })
    .toSorted((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
    .map(page => {
      let [_lang, ...slug] = page.slug.split('/')
      return {
        ...page,
        slug: slug.join('/'),
      }
    })
}
