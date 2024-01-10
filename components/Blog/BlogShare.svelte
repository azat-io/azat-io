<script lang="ts">
  import { onMount } from 'svelte'

  import { getLocaleFromUrl } from '~/utils/get-locale-from-url'
  import { useTranslations } from '~/utils/use-translations'
  import LinkedinIcon from '~/icons/linkedin.svg?raw'
  import Portal from '~/components/Portal.svelte'
  import CrossIcon from '~/icons/cross.svg?raw'
  import ShareIcon from '~/icons/share.svg?raw'
  import XIcon from '~/icons/x.svg?raw'

  export let description: string
  export let title: string

  let url: undefined | URL
  $: locale = getLocaleFromUrl(url)
  $: t = useTranslations(locale, 'blog')

  let e = encodeURI
  let dialog: HTMLDialogElement

  $: cleanUrl = url?.toString().replace(/\.html$/, '')
  $: xUsername = locale === 'ru' ? 'azat_io' : 'azat_io_en'

  $: links = [
    {
      icon: XIcon,
      link: `https://twitter.com/intent/tweet?text=${e(
        `${title}\n\n${t('quote-start')}${description}${t('quote-end')} ${t(
          'by',
        )} @${xUsername}\n\n`,
      )}&url=${cleanUrl}`,
      label: 'share-on-x',
    },
    {
      icon: LinkedinIcon,
      link: `https://linkedin.com/sharing/share-offsite/?url=${cleanUrl}`,
      label: 'share-on-linkedin',
    },
  ] as const

  let share = () => {
    dialog.showModal()
  }

  let closeDialog = () => {
    dialog.close()
  }

  onMount(() => (url = new URL(window.location.href)))
</script>

<div class="wrapper">
  <button class="share" on:click={share}>
    {@html ShareIcon}
    <span>{t('share')}</span>
  </button>
</div>

<Portal>
  <dialog class="dialog" bind:this={dialog} tabindex="-1">
    <button class="paranja" on:click={closeDialog} tabindex="-1" />
    <div class="popup">
      <button class="close" on:click={closeDialog}>
        {@html CrossIcon}
      </button>
      <h3 class="title">{t('share')}</h3>
      <ul class="links">
        {#each links as { label, link, icon }}
          <li>
            <a
              aria-label={t(label).toString()}
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
    </div>
  </dialog>
</Portal>

<style>
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: start;
  }

  .share {
    color: var(--color-content-link);
    gap: var(--space-xs);
    border-radius: var(--border-radius);
    border-block-end: none;
    align-items: center;
    display: flex;
    background: transparent;
    border: none;
    outline: none;
    transition: box-shadow 200ms;
  }

  .share:hover {
    color: var(--color-content-link-hover);
  }

  .share:focus-visible {
    background: var(--color-overlay-brand);
    box-shadow: 0 0 0 2px var(--color-border-brand);
  }

  .share :global(svg) {
    display: flex;
    inline-size: 18px;
    block-size: 18px;
  }

  .dialog {
    position: fixed;
    inset: 0;
    inline-size: 100vw;
    block-size: 100vh;
    padding: 0;
    margin: 0;
    border: none;
    background: transparent;
    max-inline-size: 100%;
    max-block-size: 100%;
  }

  .paranja {
    position: absolute;
    inset: 0;
    inline-size: 100%;
    block-size: 100%;
    background: var(--color-overlay-primary);
    border: none;
    outline: none;
    animation: fade-in 500ms cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
  }

  .popup {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-right: -50%;
    min-inline-size: 280px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: var(--space-m);
    padding: var(--space-l) var(--space-xl);
    background: var(--color-background-secondary);
    border: 1px solid var(--color-border-primary);
    border-radius: var(--border-radius);
    animation: scale-up 300ms cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
    opacity: 0%;
    transform: scale(0.8) translate(-50%, 800px) translateZ(0);
    transform-origin: 0 0;
    will-change: opacity, transform;
  }

  .close {
    display: flex;
    position: absolute;
    inset-inline-end: var(--space-s);
    inset-block-start: var(--space-s);
    padding: var(--space-xs);
    background: transparent;
    border: none;
    outline: none;
    transition: all 250ms;
    border-radius: var(--border-radius);
  }

  .close:focus-visible {
    background: var(--color-overlay-brand);
    box-shadow: 0 0 0 2px var(--color-border-brand);
    transition-property: box-shadow;
  }

  .close :global(svg) {
    inline-size: 24px;
    block-size: 24px;
  }

  .title {
    margin-block: 0;
    color: var(--color-content-primary);
    font: var(--font-l);
    font-weight: 700;
  }

  .links {
    display: flex;
    gap: var(--space-2xs);
    list-style: none;
    margin-block: 0;
    padding-inline-start: 0;
  }

  .link {
    display: flex;
    padding: var(--space-xs);
    border-bottom: none;
    color: var(--color-content-primary);
    border-radius: var(--border-radius);
  }

  .close:hover,
  .link:hover {
    background: var(--color-background-primary-hover);
    color: var(--color-content-brand);
  }

  .link :global(svg) {
    inline-size: 28px;
    block-size: 28px;
  }

  @media (width >= 768px) {
    .wrapper {
      justify-content: end;
    }

    .share {
      flex-direction: row-reverse;
    }
  }

  @keyframes fade-in {
    0% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }

  @keyframes scale-up {
    0% {
      opacity: 0;
      transform: scale(0.8) translate(-50%, 800px) translateZ(0);
    }

    50% {
      opacity: 0;
    }

    100% {
      opacity: 1;
      transform: scale(1) translate(-50%, -75%) translateZ(0);
    }
  }
</style>
