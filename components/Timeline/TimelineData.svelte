<script lang="ts">
  import { onMount } from 'svelte'

  import TimelineRelativeDate from '~/components/Timeline/TimelineRelativeDate.svelte'
  import TimelineCell from '~/components/Timeline/TimelineCell.svelte'
  import TimelineDemo from '~/components/Timeline/TimelineDemo.svelte'
  import { getLocaleFromUrl } from '~/utils/get-locale-from-url'
  import { useTranslations } from '~/utils/use-translations'

  let url: undefined | URL
  $: locale = getLocaleFromUrl(url)
  $: t = useTranslations(locale, 'timeline')

  let today = new Date()
  let dateOfBirth = new Date(1992, 1, 16)
  let healthyLifeExpectancy = 60.7
  let lifeExpectancyAtBirth = 68.2
  let weeksInYear = 52

  let totalWeeks = Math.floor(weeksInYear * lifeExpectancyAtBirth)

  function getDaysBetweenDates(date1: Date, date2: Date): number {
    return Math.floor((Number(date1) - Number(date2)) / (1000 * 60 * 60 * 24))
  }

  $: passedFullYears = Math.ceil(
    Math.abs(
      new Date(today.getTime() - dateOfBirth.getTime()).getFullYear() - 1970,
    ),
  )

  $: lastBirthday = new Date(
    new Date(
      today.getFullYear(),
      dateOfBirth.getMonth(),
      dateOfBirth.getDate(),
    ) > today
      ? today.getFullYear() - 1
      : today.getFullYear(),
    dateOfBirth.getMonth(),
    dateOfBirth.getDate(),
  )

  $: nextBirthday = new Date(
    today >
    new Date(today.getFullYear(), dateOfBirth.getMonth(), dateOfBirth.getDate())
      ? today.getFullYear() + 1
      : today.getFullYear(),
    dateOfBirth.getMonth(),
    dateOfBirth.getDate(),
  )
  $: daysInLastYear = getDaysBetweenDates(nextBirthday, lastBirthday)

  $: passedWeeksInLastYear = Math.floor(
    (getDaysBetweenDates(today, lastBirthday) / daysInLastYear) * weeksInYear,
  )

  onMount(() => (url = new URL(globalThis.location.href)))

  onMount(() => {
    let interval = setInterval(() => {
      today = new Date()
    }, 1000) as unknown as number

    return () => {
      clearInterval(interval)
    }
  })
</script>

{#if url}
  <TimelineDemo />
  <p>{t('time-since-i-was-born')}</p>
  <p><TimelineRelativeDate date={today} {dateOfBirth} /></p>
  <ul class="timeline">
    {#each Array.from({ length: totalWeeks }) as _, index (index)}
      <TimelineCell
        class={[
          'timeline-cell',
          (index + 1) % (weeksInYear * 4) === 0 ? 'counter' : '',
        ]
          .join(' ')
          .trim()}
        passed={index + 1 <=
          passedFullYears * weeksInYear + passedWeeksInLastYear}
        healthy={index + 1 <= healthyLifeExpectancy * weeksInYear}
      />
    {/each}
  </ul>
{/if}

<style>
  .timeline {
    display: grid;
    grid-template-columns: repeat(52, 1fr);
    gap: 2px;
    inline-size: 100%;
    padding-inline-start: 0;
    margin-block: 0;
    margin-inline: auto;
    list-style: none;

    @media (width >= 768px) {
      gap: 3px;
    }

    & :global(.timeline-cell:nth-child(52n)) {
      counter-increment: year;
    }
  }

  :global(.timeline-cell::before) {
    display: block;
    inline-size: 100%;
    padding-block-end: 100%;
    content: '';
  }

  @media (width >= 768px) {
    :global(.counter::after) {
      position: absolute;
      inset-block-start: calc(50% + 2px);
      inset-inline-start: calc(100% + var(--space-xs));
      font: var(--font-xs);
      content: counter(year);
      transform: translateY(-50%);
    }
  }
</style>
