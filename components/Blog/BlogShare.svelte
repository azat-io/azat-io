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
    display: flex;
    gap: var(--space-xs);
    align-items: center;
    color: var(--color-content-link);
    background: transparent;
    border: none;
    border-block-end: none;
    border-radius: var(--border-radius);
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
    inline-size: 100vi;
    max-inline-size: 100%;
    block-size: 100vb;
    max-block-size: 100%;
    padding: 0;
    margin: 0;
    background: transparent;
    border: none;
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
    inset-block-start: 50%;
    inset-inline-start: 50%;
    display: flex;
    flex-direction: column;
    gap: var(--space-m);
    align-items: center;
    justify-content: center;
    min-inline-size: 280px;
    padding: var(--space-l) var(--space-xl);
    margin-inline-end: -50%;
    background: var(--color-background-secondary);
    border: 1px solid var(--color-border-primary);
    border-radius: var(--border-radius);
    opacity: 0%;
    transform: scale(0.8) translate(-50%, 800px) translateZ(0);
    transform-origin: 0 0;
    animation: scale-up 300ms cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
    will-change: opacity, transform;
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
    font: var(--font-l);
    font-weight: 700;
    color: var(--color-content-primary);
  }

  .links {
    display: flex;
    gap: var(--space-2xs);
    padding-inline-start: 0;
    margin-block: 0;
    list-style: none;
  }

  .link {
    display: flex;
    padding: var(--space-xs);
    color: var(--color-content-primary);
    border-block-end: none;
    border-radius: var(--border-radius);
  }

  .close:hover,
  .link:hover {
    color: var(--color-content-brand);
    background: var(--color-background-primary-hover);
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
      opacity: 0%;
    }

    100% {
      opacity: 100%;
    }
  }

  @keyframes scale-up {
    0% {
      opacity: 0%;
      transform: scale(0.8) translate(-50%, 800px) translateZ(0);
    }

    50% {
      opacity: 0%;
    }

    100% {
      opacity: 100%;
      transform: scale(1) translate(-50%, -75%) translateZ(0);
    }
  }
</style>
