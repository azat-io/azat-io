import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'
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
    base: path.join(import.meta.dirname, 'content', 'blog'),
    pattern: '**/*.mdx',
  }),
})

let projects = defineCollection({
  schema: z.object({
    links: z.object({
      website: z.string().optional(),
      github: z.string().optional(),
      vscode: z.string().optional(),
      npm: z.string().optional(),
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
    base: path.join(import.meta.dirname, 'content', 'projects'),
    pattern: '**/*.mdx',
  }),
})

let travelMap = defineCollection({
  loader: glob({
    base: path.join(import.meta.dirname, 'content', 'travel-map'),
    pattern: '**/*.json',
  }),
  schema: z.object({
    originName: z.string(),
    originLang: z.string(),
    code: z.string(),
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
        z.literal('sports'),
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
    base: path.join(import.meta.dirname, 'content', 'anime'),
    pattern: '**/*.json',
  }),
})

export let collections = {
  'travel-map': travelMap,
  projects,
  anime,
  blog,
}
