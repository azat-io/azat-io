<script lang="ts">
  import type { Locale } from '~/locales'

  import { useTranslations } from '~/utils/use-translations'
  import YcombinatorIcon from '~/icons/ycombinator.svg?raw'
  import LinkedinIcon from '~/icons/linkedin.svg?raw'
  import TelegramIcon from '~/icons/telegram.svg?raw'
  import Portal from '~/components/Portal.svelte'
  import RedditIcon from '~/icons/reddit.svg?raw'
  import CrossIcon from '~/icons/cross.svg?raw'
  import ShareIcon from '~/icons/share.svg?raw'
  import XIcon from '~/icons/x.svg?raw'

  export let description: string
  export let className: string
  export let locale: Locale
  export let title: string
  export let url: URL

  $: t = useTranslations(locale, 'blog')
  $: xUsername = locale === 'ru' ? 'azat_io' : 'azat_io_en'

  $: formattedTitle = encodeURIComponent(title)
  $: formattedXDescription = encodeURIComponent(
    `${t('quote-start')}${description}${t('quote-end')} ${t('by')} @${xUsername}`,
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
      link: `https://www.reddit.com/submit?url=${cleanUrl}&title=${formattedTitle}`,
      label: 'share-on-reddit',
      name: 'Reddit',
    },
    {
      icon: TelegramIcon,
      link: `https://t.me/share/url?url=${cleanUrl}&text=${formattedTitle}`,
      label: 'share-on-telegram',
      name: 'Telegram',
    },
  ] as const

  let share = () => {
    if (
      !/android|iphone|ipad|ipod/i.test(navigator.userAgent) ||
      navigator.share === undefined
    ) {
      dialog.showModal()
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
  }
</script>

<div class={`share-wrapper ${className}`.trim()}>
  <button data-umami-event="Share" class="share" on:click={share}>
    {@html ShareIcon}
    <span>{t('share')}</span>
  </button>
</div>
<Portal>
  <dialog
    on:mousedown={event => event.target == dialog && dialog.close()}
    bind:this={dialog}
    class="dialog"
    tabindex="-1"
  >
    <button class="close" on:click={closeDialog}>
      {@html CrossIcon}
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
            {@html icon}
          </a>
        </li>
      {/each}
    </ul>
  </dialog>
</Portal>

<style>
  .share-wrapper {
    display: flex;
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

    :global(svg) {
      display: flex;
      inline-size: var(--size-icon-s);
      block-size: var(--size-icon-s);
    }

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

    :global(svg) {
      inline-size: var(--size-icon-m);
      block-size: var(--size-icon-m);
    }

    &:focus-visible {
      background: var(--color-overlay-brand);
      box-shadow: 0 0 0 2px var(--color-border-brand);
      transition-property: box-shadow;
    }
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
    display: inline-flex;
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

    :global(svg) {
      inline-size: var(--size-icon-l);
      block-size: var(--size-icon-l);
    }
  }

  @media (hover: hover) {
    .close:hover,
    .link:hover {
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
