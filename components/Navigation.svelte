<script lang="ts">
  import { onMount } from 'svelte'

  import { getLocaleFromUrl } from '~/utils/get-locale-from-url'
  import { useTranslations } from '~/utils/use-translations'
  import TranslateIcon from '~/icons/translate.svg?raw'
  import CrossIcon from '~/icons/cross.svg?raw'
  import MoonIcon from '~/icons/moon.svg?raw'
  import MenuIcon from '~/icons/menu.svg?raw'
  import GridIcon from '~/icons/grid.svg?raw'
  import BulbIcon from '~/icons/bulb.svg?raw'
  import UserIcon from '~/icons/user.svg?raw'
  import SunIcon from '~/icons/sun.svg?raw'
  import RssIcon from '~/icons/rss.svg?raw'
  import { locales } from '~/locales'

  type Theme = 'dark' | 'light'

  let clickOutside = (
    node: HTMLElement,
    handler: () => void,
  ): { destroy: () => void } => {
    let onClick = (event: MouseEvent) => {
      event.stopPropagation()
      if (
        node &&
        !node.contains(event.target as HTMLElement) &&
        !event.defaultPrevented
      ) {
        handler()
      }
    }

    document.addEventListener('click', onClick, true)

    return {
      destroy() {
        document.removeEventListener('click', onClick, true)
      },
    }
  }

  let menuOpen = false
  let languageSelectOpen = false
  let url: undefined | URL
  let theme: Theme = 'dark'
  $: locale = getLocaleFromUrl(url)
  $: t = useTranslations(locale, 'navigation')

  let closeNavigation = () => {
    menuOpen = false
    document.body.style.overflow = 'auto'
  }

  let openNavigation = () => {
    menuOpen = true
    document.body.style.overflow = 'hidden'
  }

  let toggleNavigationOpen = () => {
    if (menuOpen) {
      closeNavigation()
    } else {
      openNavigation()
    }
  }

  let onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && menuOpen) {
      closeNavigation()
    }
  }

  let setTheme = (theme: Theme) => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }

  let handleThemeChange = () => {
    if (theme === 'dark') {
      theme = 'light'
    } else {
      theme = 'dark'
    }
    setTheme(theme)
    closeNavigation()
  }

  let openLanguageSelect = () => {
    languageSelectOpen = true
  }

  let closeLanguageSelect = () => {
    languageSelectOpen = false
  }

  onMount(() => (url = new URL(window.location.href)))

  onMount(() => {
    let savedTheme = localStorage.getItem('theme') as Theme | null
    if (savedTheme === 'light') {
      theme = 'light'
    }
    setTheme(savedTheme ?? theme)
  })
</script>

<button
  class="clean-button icon-wrapper mobile-menu-button"
  on:click={toggleNavigationOpen}
  aria-label={t('open-menu')}
>
  {@html MenuIcon}
</button>
<nav class="nav" class:nav-open={menuOpen}>
  <button
    class="clean-button icon-wrapper mobile-menu-button mobile-menu-close"
    on:click={toggleNavigationOpen}
    aria-label={t('close-menu')}
  >
    {@html CrossIcon}
  </button>
  {#if url}
    <a
      href={`/${locale}/blog`}
      class="link item icon-wrapper icon-wrapper-mobile-only"
    >
      {@html GridIcon}
      <span class="text-menu">
        {t('blog')}
      </span>
    </a>
    <a
      href={`/${locale}/projects`}
      class="link item icon-wrapper icon-wrapper-mobile-only"
    >
      {@html BulbIcon}
      <span class="text-menu">
        {t('projects')}
      </span>
    </a>
    <a
      href={`/${locale}/about`}
      class="link item icon-wrapper icon-wrapper-mobile-only"
    >
      {@html UserIcon}
      <span class="text-menu">
        {t('about')}
      </span>
    </a>
    <a
      href={url.pathname.replace(
        /^\/\w{2}/,
        `/${locale === 'en' ? 'ru' : 'en'}`,
      )}
      class="link item icon-wrapper icon-wrapper-mobile-only mobile-only"
    >
      {@html TranslateIcon}
      <span class="text-menu">
        {t('change-language')}
      </span>
    </a>
  {/if}
  <div class="relative-wrapper desktop-only">
    <button
      class="clean-button icon-wrapper"
      aria-label={t('change-language')}
      on:click={openLanguageSelect}
    >
      {@html TranslateIcon}
      <span class="text-menu mobile-only">{t('change-language')}</span>
    </button>
    {#if languageSelectOpen}
      <div class="locale-select" use:clickOutside={closeLanguageSelect}>
        {#each locales as { originName, code, icon }}
          <a
            href={window.location.pathname.replace(/^\/\w{2}/, `/${code}`)}
            class="locale"
          >
            <div class="flag">{@html icon}</div>
            <div class="name-container">
              <span class="name">{t(code)}</span>
              <span class="origin-name">{originName}</span>
            </div>
          </a>
        {/each}
      </div>
    {/if}
  </div>
  <button
    class="clean-button icon-wrapper"
    aria-label={t('change-theme')}
    on:click={handleThemeChange}
  >
    {#if theme === 'dark'}
      {@html SunIcon}
    {:else if theme === 'light'}
      {@html MoonIcon}
    {/if}
    <span class="text-menu mobile-only">
      {#if theme === 'dark'}
        {t('light-theme')}
      {:else if theme === 'light'}
        {t('dark-theme')}
      {/if}
    </span>
  </button>
  <a
    class="clean-button icon-wrapper"
    href={`/${locale}/rss.xml`}
    aria-label={t('rss')}
    target="_blank"
  >
    {@html RssIcon}
    <span class="text-menu mobile-only">{t('rss')}</span>
  </a>
</nav>

<svelte:window on:keydown={onKeyDown} />

<style>
  .nav {
    display: none;
  }

  .nav-open {
    position: fixed;
    inset: 0;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: var(--space-m);
    padding: var(--space-s) var(--space-m);
    background: var(--color-background-secondary);
  }

  .link {
    padding: var(--space-xs) var(--space-s);
    color: var(--color-content-primary);
    border-block-end: none;
    border-radius: var(--border-radius);
    transition: all 250ms;
    will-change: box-shadow, background, color;
  }

  .item {
    line-height: 1.2;
    color: inherit;
  }

  .clean-button {
    display: flex;
    padding: 0;
    padding: var(--space-xs) var(--space-s);
    color: var(--color-content-primary);
    background: transparent;
    border: none;
    border-radius: var(--border-radius);
    outline: none;
    transition: all 250ms;
    will-change: box-shadow, background, color;
  }

  .link:hover,
  .clean-button:hover {
    color: var(--color-content-brand);
    background: var(--color-background-primary-hover);
  }

  .link:focus-visible,
  .clean-button:focus-visible {
    background: var(--color-overlay-brand);
    box-shadow: 0 0 0 2px var(--color-border-brand);
    transition-property: box-shadow;
  }

  .icon-wrapper {
    display: flex;
    gap: var(--space-s);
    align-items: center;
    inline-size: 100%;
  }

  .icon-wrapper :global(svg) {
    inline-size: 24px;
    block-size: 24px;
  }

  .mobile-menu-button {
    display: flex;
    inline-size: fit-content;
  }

  .mobile-menu-close {
    align-self: end;
    justify-content: end;
  }

  .relative-wrapper {
    position: relative;
  }

  .locale-select {
    position: absolute;
    inset-block-start: calc(100% + var(--space-xs));
    inset-inline-end: 0;
    display: flex;
    flex-direction: column;
    padding: 16px;
    background: var(--color-background-primary);
    border: 1px solid var(--color-border-primary);
    border-radius: 0 0 var(--border-radius) var(--border-radius);
    transform-origin: top center;
    animation: grow-down 250ms ease-in-out forwards;
  }

  .locale {
    display: flex;
    gap: var(--space-s);
    align-items: center;
    min-inline-size: 160px;
    padding: 12px;
    color: inherit;
    text-decoration: none;
    border-block-end: none;
    border-radius: var(--border-radius);
  }

  .locale:hover {
    background: var(--color-background-primary-hover);
  }

  .flag {
    display: flex;
    justify-content: center;
  }

  .flag :global(svg) {
    inline-size: 48px;
    block-size: 48px;
  }

  .name-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .desktop-only {
    display: none;
  }

  .name {
    font: var(--font-s);
    color: var(--color-content-brand);
  }

  .origin-name {
    font: var(--font-2xs);
  }

  .text-menu {
    white-space: nowrap;
  }

  @keyframes grow-down {
    0% {
      transform: scaleY(0);
    }

    80% {
      transform: scaleY(1.1);
    }

    100% {
      transform: scaleY(1);
    }
  }

  @media (width >= 768px) {
    .nav,
    .nav-open {
      position: static;
      display: flex;
      flex-direction: row;
      gap: var(--space-2xs);
      align-items: center;
      padding: 0;
      background: transparent;
      animation: fade-in 250ms ease-out forwards;
    }

    .link {
      padding: var(--space-s);
    }

    .clean-button {
      padding: var(--space-xs);
    }

    .mobile-menu-button {
      display: none;
    }

    .icon-wrapper :global(svg) {
      inline-size: 28px;
      block-size: 28px;
    }

    .mobile-only,
    .icon-wrapper-mobile-only :global(svg) {
      display: none;
    }

    .desktop-only {
      display: flex;
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
</style>
