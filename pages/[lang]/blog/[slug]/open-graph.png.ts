import type { CollectionEntry } from 'astro:content'

import { getCollection } from 'astro:content'
import { ImageResponse } from '@vercel/og'
import fs from 'node:fs/promises'
import path from 'node:path'

import { getLocaleFromUrl } from '~/utils/get-locale-from-url'
import { homepage } from '~/package.json'

interface Props {
  props: { post: CollectionEntry<'blog'> }
  params: { slug: string }
}

export async function GET({ props }: Props): Promise<ImageResponse> {
  let { post } = props

  let CoText = await fs.readFile(
    path.resolve('./public/fonts/co-text-bold.ttf'),
  )
  let CoTextFont = Buffer.from(new Uint8Array(CoText.buffer))

  function parseUrl(currentUrl: string): {
    locale: string
    slug: string
  } {
    let [slugValue, localeValue] = currentUrl.replace(/\.mdx?$/u, '').split('/')
    return { locale: localeValue!, slug: slugValue! }
  }

  let id = parseUrl(post.id).slug

  let postCover = await fs.readFile(
    path.resolve(`./content/blog/${id}/assets/hero.png`),
  )

  let html = {
    props: {
      children: [
        {
          props: {
            src: postCover.buffer,
          },
          type: 'img',
        },
        {
          props: {
            children: [
              {
                props: {
                  children: [
                    {
                      props: {
                        d: 'M33.6952 25.9138L24.3441 10.351L0.999993 24.3776L5.67552 32.159L21.2383 22.8079L25.9138 30.5893L10.351 39.9404L15.4737 47.3999L22.8079 43.0462L30.5893 38.3707L39.9404 53.9334L63.2845 39.9069L58.609 32.1255L43.0462 41.4766C43.0462 41.4766 40.1966 36.734 38.3707 33.6952C36.5448 30.6564 33.6952 25.9138 33.6952 25.9138Z',
                        fill: '#f6bd40',
                      },
                      type: 'path',
                    },
                  ],
                  style: {
                    height: 64,
                    width: 64,
                  },
                  viewBox: '0 0 64 64',
                  fill: 'none',
                },
                type: 'svg',
              },
              {
                props: {
                  style: {
                    fontFamily: 'Co Text',
                    fontWeight: 'bold',
                    fontSize: '52px',
                    color: '#f6bd40',
                    display: 'flex',
                    margin: 0,
                  },
                  children: post.data.title,
                },
                type: 'h1',
              },
            ],
            style: {
              alignItems: 'flex-end',
              background: '#1b1b1b',
              position: 'absolute',
              padding: '28px 32px',
              maxWidth: '1096px',
              borderRadius: 16,
              display: 'flex',
              bottom: 52,
              left: 52,
              gap: 24,
            },
          },
          type: 'div',
        },
      ],
      style: {
        background: '#181818',
        display: 'flex',
        height: '100%',
        width: '100%',
      },
    },
    type: 'div',
  }

  return new ImageResponse(html, {
    fonts: [
      {
        data: CoTextFont,
        name: 'Co Text',
        style: 'normal',
      },
    ],
    width: 1200,
    height: 630,
  })
}

export async function getStaticPaths() {
  let posts = await getCollection('blog')
  return posts.map(post => {
    let [slug, locale] = post.id.split('/')
    return {
      params: {
        lang: getLocaleFromUrl(new URL(locale!, homepage), true),
        slug,
      },
      props: { post },
    }
  })
}
