<script lang="ts">
  import { onMount } from 'svelte'

  import type { Locale } from '~/locales'

  import NavigationElement from '~/components/NavigationElement.svelte'
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

  export let locale: Locale
  export let url: URL

  $: innerWidth = 0
  $: isMobile = innerWidth < 1000

  let menuOpen = false
  let languageSelectOpen = false
  let theme: Theme = 'dark'
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

  onMount(() => {
    let savedTheme = localStorage.getItem('theme') as Theme | null
    if (savedTheme === 'light') {
      theme = 'light'
    }
    setTheme(savedTheme ?? theme)
  })
</script>

<NavigationElement
  on:click={toggleNavigationOpen}
  label={t('open-menu')}
  icon={MenuIcon}
  mobileOnly
/>
<nav class="nav" class:nav-open={menuOpen}>
  <NavigationElement
    on:click={toggleNavigationOpen}
    label={t('close-menu')}
    icon={CrossIcon}
    mobileOnly
  />
  <NavigationElement
    href={`/${locale}/blog`}
    label={t('blog')}
    icon={GridIcon}
  />
  <NavigationElement
    href={`/${locale}/projects`}
    label={t('projects')}
    icon={BulbIcon}
  />
  <NavigationElement
    href={`/${locale}/about`}
    label={t('about')}
    icon={UserIcon}
  />
  <NavigationElement
    href={isMobile
      ? url.pathname.replace(/^\/\w{2}/, `/${locale === 'en' ? 'ru' : 'en'}`)
      : undefined}
    on:click={isMobile ? undefined : openLanguageSelect}
    label={t('change-language')}
    icon={TranslateIcon}
    view="icon"
  >
    {#if languageSelectOpen}
      <div class="locale-select">
        {#each locales as { originName, code, icon }}
          <a href={url.pathname.replace(/^\/\w{2}/, `/${code}`)} class="locale">
            <div class="flag">{@html icon}</div>
            <div class="name-container">
              <span class="name">{t(code)}</span>
              <span class="origin-name">{originName}</span>
            </div>
          </a>
        {/each}
      </div>
    {/if}
  </NavigationElement>
  <NavigationElement
    label={theme === 'dark' ? t('light-theme') : t('dark-theme')}
    icon={theme === 'dark' ? SunIcon : MoonIcon}
    on:click={handleThemeChange}
    ariaLabel={t('change-theme')}
    view="icon"
  />
  <NavigationElement
    href={`/${locale}/rss.xml`}
    umamiEvent="View RSS"
    label={t('rss')}
    target="_blank"
    icon={RssIcon}
    view="icon"
  />
</nav>

<svelte:window bind:innerWidth />

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
    align-items: start;
    justify-content: center;
  }

  .name {
    font: var(--font-s);
    color: var(--color-content-brand);
  }

  .origin-name {
    font: var(--font-2xs);
    color: var(--color-content-primary);
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
