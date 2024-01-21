<script lang="ts">
  import { onMount } from 'svelte'

  import TimelineCell from '~/components/Timeline/TimelineCell.svelte'
  import { getLocaleFromUrl } from '~/utils/get-locale-from-url'
  import { useTranslations } from '~/utils/use-translations'

  let url: undefined | URL
  $: locale = getLocaleFromUrl(url)
  $: t = useTranslations(locale, 'timeline')

  onMount(() => (url = new URL(window.location.href)))
</script>

<div class="demo">
  <div class="demo-value">
    <TimelineCell class="timeline-demo-cell" passed={true} />
    <span class="text">—</span>
    <span class="text">{t('past-week')}</span>
  </div>
  <div class="demo-value">
    <TimelineCell class="timeline-demo-cell" healthy={true} />
    <span class="text">—</span>
    <span class="text">{t('healthy-life-expectancy')}</span>
  </div>
  <div class="demo-value">
    <TimelineCell class="timeline-demo-cell" />
    <span class="text">—</span>
    <span class="text">{t('life-expectancy-at-birth')}</span>
  </div>
</div>

<style>
  .demo {
    display: flex;
    flex-direction: column;
    gap: var(--space-m);

    :global(.timeline-demo-cell) {
      inline-size: 20px;
      block-size: 20px;
    }
  }

  .demo-value {
    display: flex;
    gap: var(--space-xs);
    align-items: center;
  }
</style>
