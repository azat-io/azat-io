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

  let details: HTMLDetailsElement
  let detailsClose = false

  $: innerWidth = 0
  $: isMobile = innerWidth < 768

  let menuOpen = false
  let theme: Theme = 'dark'
  $: t = useTranslations(locale, 'navigation')

  let closeNavigation = () => {
    menuOpen = false
    document.body.style.overflow = 'auto'
  }

  let openNavigation = () => {
    menuOpen = true
    document.body.style.overflow = 'clip'
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

  onMount(() => {
    let savedTheme = localStorage.getItem('theme') as Theme | null
    if (savedTheme === 'light') {
      theme = 'light'
    }
    setTheme(savedTheme ?? theme)
  })

  onMount(() => {
    details.addEventListener('toggle', () => {
      let handleClick = (event: MouseEvent) => {
        if (event.target && !details.contains(event.target as Node)) {
          document.removeEventListener('click', handleClick)
          detailsClose = true
        }
      }
      if (details.open) {
        document.addEventListener('click', handleClick)
      } else if (detailsClose) {
        details.open = true
      }
    })

    details.addEventListener('click', () => {
      if (details.hasAttribute('open')) {
        detailsClose = true
      }
    })

    details.addEventListener('animationend', e => {
      if (e.animationName.endsWith('close')) {
        details.open = false
        detailsClose = false
      }
    })
  })
</script>

<NavigationElement
  click={toggleNavigationOpen}
  label={t('open-menu')}
  icon={MenuIcon}
  mobileOnly
/>
<nav class="nav" class:nav-open={menuOpen}>
  <NavigationElement
    click={toggleNavigationOpen}
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
  <details
    class:details-close={detailsClose}
    class="details"
    bind:this={details}
  >
    <summary class="summary">
      <NavigationElement
        href={isMobile
          ? url.pathname.replace(
              /^\/\w{2}/,
              `/${locale === 'en' ? 'ru' : 'en'}`,
            )
          : undefined}
        label={t('change-language')}
        icon={TranslateIcon}
        view="icon"
      />
    </summary>
    <div class="locale-select">
      {#each locales as { originName, code, icon }}
        <a
          href={url.pathname
            .replace(/^\/\w{2}/, `/${code}`)
            .replace(/\.html$/, '')}
          aria-label={t(code)}
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
  </details>
  <NavigationElement
    label={theme === 'dark' ? t('light-theme') : t('dark-theme')}
    icon={theme === 'dark' ? SunIcon : MoonIcon}
    ariaLabel={t('change-theme')}
    click={handleThemeChange}
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

  .details {
    position: relative;
  }

  .summary {
    cursor: pointer;
    border-radius: var(--border-radius);
    outline: none;
    transition: all 250ms;
    will-change: box-shadow, background, color;

    &::marker {
      content: '';
    }

    &::-webkit-details-marker {
      display: none;
    }

    &:hover {
      color: var(--color-content-brand);
    }

    &:focus-visible {
      background: var(--color-overlay-brand);
      box-shadow: 0 0 0 2px var(--color-border-brand);
      transition-property: box-shadow;
    }

    &:hover:not(:focus-visible) {
      background: var(--color-background-primary-hover);
    }
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
  }

  .details[open] .locale-select {
    transform-origin: top center;
    animation: grow-down 250ms ease-in-out forwards;
  }

  .details-close[open] .locale-select {
    animation: close 250ms ease-in-out forwards;
  }

  .locale {
    display: flex;
    gap: var(--space-s);
    place-items: center;
    min-inline-size: 160px;
    padding: 12px;
    color: inherit;
    text-decoration: none;
    border-block-end: none;
    border-radius: var(--border-radius);

    &:hover {
      background: var(--color-background-primary-hover);
    }
  }

  .flag {
    display: flex;
    place-items: center;

    :global(svg) {
      inline-size: 48px;
      block-size: 48px;
    }
  }

  .name-container {
    display: flex;
    flex-direction: column;
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

  @keyframes close {
    0% {
      transform: scaleY(1);
    }

    20% {
      transform: scaleY(1.1);
    }

    100% {
      transform: scaleY(0);
    }
  }

  @media (width >= 768px) {
    .nav,
    .nav-open {
      position: static;
      display: flex;
      flex-direction: row;
      gap: var(--space-2xs);
      place-items: center;
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
