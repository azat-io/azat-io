<script lang="ts">
  import { on } from 'svelte/events'
  import { onMount } from 'svelte'

  import type { Locale } from '~/locales'

  import {
    SOCIAL_MASTODON,
    SOCIAL_BLUESKY,
    SOCIAL_X_EN,
    SOCIAL_X_RU,
  } from '~/constants'
  import YcombinatorIcon from '~/icons/ycombinator.svg?component'
  import { useTranslations } from '~/utils/use-translations'
  import FacebookIcon from '~/icons/facebook.svg?component'
  import LinkedinIcon from '~/icons/linkedin.svg?component'
  import TelegramIcon from '~/icons/telegram.svg?component'
  import MastodonIcon from '~/icons/mastodon.svg?component'
  import BlueskyIcon from '~/icons/bluesky.svg?component'
  import RedditIcon from '~/icons/reddit.svg?component'
  import CrossIcon from '~/icons/cross.svg?component'
  import ShareIcon from '~/icons/share.svg?component'
  import Portal from '~/components/Portal.svelte'
  import XIcon from '~/icons/x.svg?component'

  export let description: string
  export let locale: Locale
  export let title: string
  export let url: URL

  $: t = useTranslations(locale, 'blog') as (key: string) => string

  $: formattedTitle = encodeURIComponent(title)
  $: formattedXDescription = encodeURIComponent(
    `${t('quote-start')}${description}${t('quote-end')} ${t('by')} @${locale === 'ru' ? SOCIAL_X_RU : SOCIAL_X_EN}`,
  )
  $: formattedBlueskyDescription = encodeURIComponent(
    `${t('quote-start')}${description}${t('quote-end')} ${t('by')} @${SOCIAL_BLUESKY}`,
  )
  $: formattedMastodonDescription = encodeURIComponent(
    `${t('quote-start')}${description}${t('quote-end')} ${t('by')} @${SOCIAL_MASTODON}`,
  )

  let dialog: HTMLDialogElement

  $: cleanUrl = url.toString().replace(/\.html$/u, '')

  $: links = [
    {
      link: `https://x.com/intent/tweet?text=${formattedTitle}%0A%0A${formattedXDescription}%0A%0A&url=${cleanUrl}`,
      label: 'share-on-x',
      icon: XIcon,
      name: 'X',
    },
    {
      link: `https://bsky.app/intent/compose?text=${formattedTitle}%0A%0A${formattedBlueskyDescription}%0A%0A${cleanUrl}`,
      label: 'share-on-bluesky',
      icon: BlueskyIcon,
      name: 'Bluesky',
    },
    {
      link: `https://s2f.kytta.dev/?text=${formattedTitle}%0A%0A${formattedMastodonDescription}%0A%0A${cleanUrl}`,
      label: 'share-on-mastodon',
      icon: MastodonIcon,
      name: 'Mastodon',
    },
    {
      link: `https://linkedin.com/sharing/share-offsite/?url=${cleanUrl}`,
      label: 'share-on-linkedin',
      icon: LinkedinIcon,
      name: 'LinkedIn',
    },
    {
      link: `https://news.ycombinator.com/submitlink?u=${cleanUrl}&t=${formattedTitle}`,
      label: 'share-on-hacker-news',
      icon: YcombinatorIcon,
      name: 'Hacker News',
    },
    {
      link: `https://facebook.com/sharer/sharer.php?u=${cleanUrl}`,
      label: 'share-on-facebook',
      icon: FacebookIcon,
      name: 'Facebook',
    },
    {
      link: `https://reddit.com/submit?url=${cleanUrl}&title=${formattedTitle}`,
      label: 'share-on-reddit',
      icon: RedditIcon,
      name: 'Reddit',
    },
    {
      link: `https://t.me/share/url?url=${cleanUrl}&text=${formattedTitle}`,
      label: 'share-on-telegram',
      icon: TelegramIcon,
      name: 'Telegram',
    },
  ] as const

  function clickOutside(event: MouseEvent): void {
    if (event.target === dialog) {
      closeDialog()
    }
  }

  async function share(): Promise<void> {
    if (
      !/android|ipad|iphone|ipod/iu.test(navigator.userAgent) ||
      // eslint-disable-next-line typescript/no-unnecessary-condition
      !navigator.share
    ) {
      dialog.showModal()
      on(document, 'click', clickOutside)
    } else {
      await navigator.share({
        text: description,
        url: cleanUrl,
        title,
      })
    }
  }

  function closeDialog(): void {
    dialog.close()
    document.removeEventListener('click', clickOutside)
  }

  onMount(() => {
    document.querySelector('#share-fallback')?.remove()
  })
</script>

<div class={`share-wrapper ${$$props['class']}`.trim()}>
  <button data-umami-event="Share" class="share" on:click={share} type="button">
    <svelte:component this={ShareIcon} />
    <span>{t('share')}</span>
  </button>
</div>
<Portal>
  <dialog bind:this={dialog} class="dialog">
    <button
      aria-label={t('close-dialog')}
      on:click={closeDialog}
      class="close"
      type="button"
    >
      <svelte:component this={CrossIcon} />
    </button>
    <h3 class="title">{t('share')}</h3>
    <ul class="links">
      {#each links as { label, link, icon, name } (name)}
        <li class="link-wrapper">
          <a
            data-umami-event="Share on social media"
            data-umami-event-name={name}
            rel="noopener noreferrer"
            aria-label={t(label)}
            target="_blank"
            class="link"
            href={link}
          >
            <svelte:component this={icon} />
          </a>
        </li>
      {/each}
    </ul>
  </dialog>
</Portal>

<style>
  .share-wrapper {
    display: flex;
    place-items: start;
  }

  .share {
    display: flex;
    gap: var(--space-s);
    place-items: center;
    padding-inline: 0;
    color: var(--color-content-link);
    text-decoration: none;
    outline: none;
    background: transparent;
    border: none;
    border-radius: var(--border-radius);
    transition: box-shadow 200ms;

    @media (hover: hover) {
      &:hover {
        color: var(--color-content-link-hover);
      }
    }

    &:focus-visible {
      background: var(--color-overlay-brand);
      box-shadow: 0 0 0 2px var(--color-border-brand);
    }

    & :global(svg) {
      display: flex;
      inline-size: var(--size-icon-s);
      block-size: var(--size-icon-s);
    }
  }

  .dialog {
    min-inline-size: 280px;
    padding: var(--space-l) var(--space-xl);
    background: var(--color-background-secondary);
    border: 1px solid var(--color-border-primary);
    border-radius: var(--border-radius);
    opacity: 0%;
    animation: scale-up 300ms cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
    will-change: opacity, transform;

    &::backdrop {
      background: var(--color-overlay-primary);
      backdrop-filter: blur(4px);
    }

    @media (prefers-reduced-motion: reduce) {
      opacity: 100%;
      transform: scale(1) translate(-50%, -75%) translateZ(0);
      animation: none;
    }
  }

  .close {
    position: absolute;
    inset-block-start: var(--space-s);
    inset-inline-end: var(--space-s);
    display: flex;
    padding: var(--space-xs);
    color: var(--color-content-primary);
    outline: none;
    background: transparent;
    border: none;
    border-radius: var(--border-radius);
    transition: all 250ms;

    &:focus-visible {
      background: var(--color-overlay-brand);
      box-shadow: 0 0 0 2px var(--color-border-brand);
      transition-property: box-shadow;
    }
  }

  :global(.close svg) {
    inline-size: var(--size-icon-m);
    block-size: var(--size-icon-m);
  }

  .title {
    margin-block: 0 var(--space-m);
    font: var(--font-zl);
    font-weight: bold;
    color: var(--color-content-primary);
    text-align: center;
  }

  .link-wrapper {
    margin-block: 0;
  }

  .links {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--space-2xs);
    padding-inline-start: 0;
    margin-block: 0;
    list-style: none;
  }

  .link {
    display: flex;
    padding: var(--space-xs);
    color: var(--color-content-primary);
    text-decoration: none;
    border-radius: var(--border-radius);

    & :global(svg) {
      inline-size: var(--size-icon-l);
      block-size: var(--size-icon-l);
    }
  }

  @media (hover: hover) {
    :is(.close, .link):hover {
      color: var(--color-content-brand);
      background: var(--color-background-primary-hover);
    }
  }

  @keyframes fade-in {
    0% {
      opacity: 0%;
    }

    100% {
      opacity: 100%;
    }
  }

  @keyframes scale-up {
    0% {
      opacity: 0%;
      transform: scale(0.8) translate(0, 800px);
    }

    50% {
      opacity: 0%;
    }

    100% {
      opacity: 100%;
      transform: scale(1) translate(0, 0);
    }
  }
</style>
