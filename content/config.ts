import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'
import path from 'node:path'

let blog = defineCollection({
  schema: z.object({
    date: z
      .string()
      .or(z.date())
      .transform(value => new Date(value)),
    keywords: z.string().array().optional(),
    description: z.string(),
    title: z.string(),
  }),
  loader: glob({
    base: path.join(import.meta.dirname, 'blog'),
    pattern: '**/*.mdx',
  }),
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
  loader: glob({
    base: path.join(import.meta.dirname, 'projects'),
    pattern: '**/*.mdx',
  }),
})

let travelMap = defineCollection({
  schema: z.object({
    originName: z.string(),
    originLang: z.string(),
    code: z.string(),
  }),
  loader: glob({
    base: path.join(import.meta.dirname, 'travel-map'),
    pattern: '**/*.json',
  }),
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
  loader: glob({
    base: path.join(import.meta.dirname, 'anime'),
    pattern: '**/*.json',
  }),
})

export let collections = {
  'travel-map': travelMap,
  projects,
  anime,
  blog,
}
