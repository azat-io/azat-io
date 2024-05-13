<script lang="ts">
  import { writable } from 'svelte/store'
  import { onMount } from 'svelte'

  import PartyPopperIcon from '~/icons/party-popper.svg?component'
  import { getLocaleFromUrl } from '~/utils/get-locale-from-url'
  import { useTranslations } from '~/utils/use-translations'

  let url: undefined | URL
  $: locale = getLocaleFromUrl(url)
  $: translationLocale = getLocaleFromUrl(url, true)
  $: t = useTranslations(locale, 'blog')

  /* spell-checker: disable */
  let desiredLocales: Record<string, string> = {
    fr: 'Bonjour, je suis heureux de vous voir !',
    tr: 'Merhaba! Seni gördüğüme sevindim!',
    de: 'Hallo! Schön, dich zu sehen!',
    el: 'Γεια σας! Χαίρομαι που σας βλέπω!',
    es: '¡Hola! ¡Me alegro de verte!',
    it: 'Ciao, è un piacere vederti!',
    uk: 'Привіт! Радий тебе бачити!',
    lv: 'Sveiki! Prieks jūs redzēt!',
    lt: 'Sveiki! Malonu jus matyti!',
    pl: 'Cześć! Miło cię widzieć!',
    nl: 'Hallo! Blij je te zien!',
    pt: 'Olá! Que bom ver você!',
    et: 'Tere! Tore sind näha!',
    fa: 'سلام! از دیدن شما خوشحالم!',
    he: 'שלום! אני שמח לראות אותך!',
    da: 'Hej! Godt at se dig!',
    hi: 'नमस्ते! मैं तुम्हें देख कर खुश हूँ!',
    ar: 'مرحبًا! أنا سعيد لرؤيتك!',
    cs: 'Ahoj! Rád tě vidím!',
    ko: '안녕하세요! 반갑습니다!',
    zh: '嗨！很高兴见到你！',
    ja: '会えて嬉しいよ！',
  }
  /* spell-checker: enable */

  export let translations: {
    locale: string
  }[]

  let userLanguage = writable<string | undefined>(undefined)

  $: shouldRender =
    $userLanguage &&
    $userLanguage !== translationLocale &&
    !translations.some(({ locale: tLocale }) => tLocale === $userLanguage) &&
    !!desiredLocales[$userLanguage]

  onMount(() => (url = new URL(window.location.href)))

  onMount(() => {
    userLanguage.set(window.navigator.language.substring(0, 2))
  })
</script>

{#if shouldRender && $userLanguage}
  <div class="translation">
    <svelte:component this={PartyPopperIcon} />
    <span>{desiredLocales[$userLanguage]}</span>
    <p>
      {`${t('translate-1')}`.replace(
        '{language}',
        // @ts-ignore
        t(`locale-${$userLanguage}`),
      )}
    </p>
    <p>
      {@html `${t('translate-2')}`.replace(
        '{contributing}',
        `<a
          href="https://github.com/azat-io/azat-io/blob/main/contributing.md#content-translation"
          data-umami-event-name="${$userLanguage.toUpperCase()}"
          data-umami-event="View translation instructions"
          rel="noreferrer noopener"
          target="_blank"
        >
          contributing.md
        </a>`,
      )}
    </p>
  </div>
{/if}

<style>
  .translation {
    position: relative;
    padding: var(--space-m);
    margin-block: var(--space-m);
    background: var(--color-background-secondary);
    border: 1px solid var(--color-border-primary);
    border-radius: var(--border-radius);
  }

  .translation :global(svg) {
    position: absolute;
    inset-block-start: var(--space-m);
    inset-inline-end: var(--space-m);
    inline-size: var(--size-icon-m);
    block-size: var(--size-icon-m);
    color: var(--color-content-secondary);
  }
</style>
