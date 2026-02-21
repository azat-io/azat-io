<script lang="ts">
  import { onMount } from 'svelte'

  import TimelineCell from '~/components/Timeline/TimelineCell.svelte'
  import { getLocaleFromUrl } from '~/utils/get-locale-from-url'
  import { useTranslations } from '~/utils/use-translations'

  let url: undefined | URL
  $: locale = getLocaleFromUrl(url)
  $: t = useTranslations(locale, 'timeline')

  onMount(() => (url = new URL(globalThis.location.href)))
</script>

<div class="demo">
  <div class="demo-value">
    <TimelineCell class="timeline-demo-cell" passed={true} tag="div" />
    <span>—</span>
    <span>{t('past-week')}</span>
  </div>
  <div class="demo-value">
    <TimelineCell class="timeline-demo-cell" healthy={true} tag="div" />
    <span>—</span>
    <span>{t('healthy-life-expectancy')}</span>
  </div>
  <div class="demo-value">
    <TimelineCell class="timeline-demo-cell" tag="div" />
    <span>—</span>
    <span>{t('life-expectancy-at-birth')}</span>
  </div>
</div>

<style>
  .demo {
    display: flex;
    flex-direction: column;
    gap: var(--space-m);
  }

  :global(.demo .timeline-demo-cell) {
    inline-size: 20px;
    block-size: 20px;
  }

  .demo-value {
    display: flex;
    flex-wrap: nowrap;
    gap: var(--space-xs);
    place-items: center;
  }
</style>
