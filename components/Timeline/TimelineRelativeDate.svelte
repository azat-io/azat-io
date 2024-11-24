<script lang="ts">
  import { onMount } from 'svelte'

  import { getLocaleFromUrl } from '~/utils/get-locale-from-url'
  import { useTranslations } from '~/utils/use-translations'

  export let date: Date
  export let dateOfBirth: Date

  let url: undefined | URL
  $: locale = getLocaleFromUrl(url)
  $: t = useTranslations(locale, 'timeline')

  type Unit = 'minutes' | 'seconds' | 'months' | 'years' | 'hours' | 'days'

  $: years = date.getFullYear() - dateOfBirth.getFullYear()
  $: months = date.getMonth() - dateOfBirth.getMonth()
  $: days = date.getDate() - dateOfBirth.getDate()
  $: hours = date.getHours() - dateOfBirth.getHours()
  $: minutes = date.getMinutes() - dateOfBirth.getMinutes()
  $: seconds = date.getSeconds() - dateOfBirth.getSeconds()

  $: if (months <= 0 && date.getDate() - dateOfBirth.getDate() < 0) {
    years--
    months += 12
  }

  $: if (days < 0) {
    months--
    let previousMonth = new Date(date.getFullYear(), date.getMonth(), 0)
    days += previousMonth.getDate()
  }

  $: if (seconds < 0) {
    minutes--
    seconds += 60
  }

  $: if (minutes < 0) {
    hours--
    minutes += 60
  }

  $: if (hours < 0) {
    days--
    hours += 24
  }

  let format = (
    translateFunction: typeof t,
    value: number,
    unit: Unit,
  ): string =>
    `${value} ${
      (translateFunction(unit) as Record<Intl.LDMLPluralRule, string>)[
        new Intl.PluralRules(locale).select(value)
      ]
    }`

  $: formattedYears = format(t, years, 'years')
  $: formattedMonths = format(t, months, 'months')
  $: formattedDays = format(t, days, 'days')
  $: formattedHours = format(t, hours, 'hours')
  $: formattedMinutes = format(t, minutes, 'minutes')
  $: formattedSeconds = format(t, seconds, 'seconds')

  onMount(() => (url = new URL(globalThis.location.href)))
</script>

<span role="timer">
  {formattedYears}
  {formattedMonths}
  {formattedDays}
  {formattedHours}
  {formattedMinutes}
  {formattedSeconds}
</span>
