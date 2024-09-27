import { defineCollection, z } from 'astro:content'

let blog = defineCollection({
  schema: z.object({
    date: z
      .string()
      .or(z.date())
      .transform(val => new Date(val)),
    keywords: z.string().array().optional(),
    description: z.string(),
    title: z.string(),
  }),
  type: 'content',
})

let projects = defineCollection({
  schema: z.object({
    links: z.object({
      website: z.ostring(),
      github: z.ostring(),
      vscode: z.ostring(),
      npm: z.string(),
    }),
    badges: z
      .object({
        name: z.string(),
        url: z.string(),
      })
      .array(),
    keywords: z.string().array().optional(),
    description: z.string(),
    title: z.string(),
    type: z.string(),
    id: z.string(),
  }),
  type: 'content',
})

let travelMap = defineCollection({
  schema: z.object({
    originName: z.string(),
    originLang: z.string(),
    code: z.string(),
  }),
  type: 'data',
})

let anime = defineCollection({
  schema: z.object({
    genres: z
      .union([
        z.literal('psychological'),
        z.literal('slice-of-life'),
        z.literal('supernatural'),
        z.literal('adventure'),
        z.literal('thriller'),
        z.literal('fantasy'),
        z.literal('mystery'),
        z.literal('romance'),
        z.literal('comedy'),
        z.literal('action'),
        z.literal('sci-fi'),
        z.literal('horror'),
        z.literal('drama'),
        z.literal('mecha'),
        z.literal('music'),
        z.literal('ecchi'),
      ])
      .array(),
    originName: z.string(),
    duration: z.number(),
    episodes: z.number(),
    score: z.number(),
    year: z.number(),
    id: z.string(),
  }),
  type: 'data',
})

export let collections = {
  'travel-map': travelMap,
  projects,
  anime,
  blog,
}
