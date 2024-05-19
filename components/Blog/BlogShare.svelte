<script lang="ts">
  import { onMount } from 'svelte'

  import type { Locale } from '~/locales'

  import YcombinatorIcon from '~/icons/ycombinator.svg?component'
  import { useTranslations } from '~/utils/use-translations'
  import FacebookIcon from '~/icons/facebook.svg?component'
  import LinkedinIcon from '~/icons/linkedin.svg?component'
  import TelegramIcon from '~/icons/telegram.svg?component'
  import MastodonIcon from '~/icons/mastodon.svg?component'
  import WhatsappIcon from '~/icons/whatsapp.svg?component'
  import RedditIcon from '~/icons/reddit.svg?component'
  import CrossIcon from '~/icons/cross.svg?component'
  import ShareIcon from '~/icons/share.svg?component'
  import Portal from '~/components/Portal.svelte'
  import XIcon from '~/icons/x.svg?component'

  export let description: string
  export let locale: Locale
  export let title: string
  export let url: URL

  $: t = useTranslations(locale, 'blog')
  $: xUsername = locale === 'ru' ? 'azat_io' : 'azat_io_en'

  $: formattedTitle = encodeURIComponent(title)
  $: formattedXDescription = encodeURIComponent(
    `${t('quote-start')}${description}${t('quote-end')} ${t('by')} @${xUsername}`,
  )
  $: formattedMastodonDescription = encodeURIComponent(
    `${t('quote-start')}${description}${t('quote-end')} ${t('by')} @azat_io@mastodon.social`,
  )

  let dialog: HTMLDialogElement

  $: cleanUrl = url?.toString().replace(/\.html$/, '')

  $: links = [
    {
      icon: XIcon,
      link: `https://x.com/intent/tweet?text=${formattedTitle}%0A%0A${formattedXDescription}%0A%0A&url=${cleanUrl}`,
      label: 'share-on-x',
      name: 'X',
    },
    {
      icon: MastodonIcon,
      link: `https://s2f.kytta.dev/?text=${formattedTitle}%0A%0A${formattedMastodonDescription}%0A%0A${cleanUrl}`,
      label: 'share-on-mastodon',
      name: 'Mastodon',
    },
    {
      icon: LinkedinIcon,
      link: `https://linkedin.com/sharing/share-offsite/?url=${cleanUrl}`,
      label: 'share-on-linkedin',
      name: 'LinkedIn',
    },
    {
      icon: YcombinatorIcon,
      link: `https://news.ycombinator.com/submitlink?u=${cleanUrl}&t=${formattedTitle}`,
      label: 'share-on-hacker-news',
      name: 'Hacker News',
    },
    {
      icon: RedditIcon,
      link: `https://reddit.com/submit?url=${cleanUrl}&title=${formattedTitle}`,
      label: 'share-on-reddit',
      name: 'Reddit',
    },
    {
      icon: FacebookIcon,
      link: `https://facebook.com/sharer/sharer.php?u=${cleanUrl}`,
      label: 'share-on-facebook',
      name: 'Facebook',
    },
    {
      icon: WhatsappIcon,
      link: `https://wa.me/?text=${formattedTitle}%0A%0A${cleanUrl}`,
      label: 'share-on-whatsapp',
      name: 'WhatsApp',
    },
    {
      icon: TelegramIcon,
      link: `https://t.me/share/url?url=${cleanUrl}&text=${formattedTitle}`,
      label: 'share-on-telegram',
      name: 'Telegram',
    },
  ] as const

  let clickOutside = (event: MouseEvent) => {
    if (event.target === dialog) {
      closeDialog()
    }
  }

  let share = () => {
    if (
      !/android|iphone|ipad|ipod/i.test(navigator.userAgent) ||
      navigator.share === undefined
    ) {
      dialog.showModal()
      document.addEventListener('click', clickOutside)
    } else {
      navigator.share({
        text: description,
        url: cleanUrl!,
        title,
      })
    }
  }

  let closeDialog = () => {
    dialog.close()
    document.removeEventListener('click', clickOutside)
  }

  onMount(() => {
    document.getElementById('share-fallback')?.remove()
  })
</script>

<div class={`share-wrapper ${$$props.class}`.trim()}>
  <button data-umami-event="Share" class="share" on:click={share} type="button">
    <svelte:component this={ShareIcon} />
    <span>{t('share')}</span>
  </button>
</div>
<Portal>
  <dialog bind:this={dialog} class="dialog">
    <button class="close" on:click={closeDialog} type="button">
      <svelte:component this={CrossIcon} />
    </button>
    <h3 class="title">{t('share')}</h3>
    <ul class="links">
      {#each links as { label, link, icon, name }}
        <li class="link-wrapper">
          <a
            data-umami-event="Share on social media"
            aria-label={t(label).toString()}
            data-umami-event-name={name}
            rel="noopener noreferrer"
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
    background: transparent;
    border: none;
    border-radius: var(--border-radius);
    outline: none;
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
  }

  .share :global(svg) {
    display: flex;
    inline-size: var(--size-icon-s);
    block-size: var(--size-icon-s);
  }

  :global(html):has(.dialog:modal[open]) {
    overflow: hidden;
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
    background: transparent;
    border: none;
    border-radius: var(--border-radius);
    outline: none;
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
    font-weight: 700;
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
  }

  .link :global(svg) {
    inline-size: var(--size-icon-l);
    block-size: var(--size-icon-l);
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
