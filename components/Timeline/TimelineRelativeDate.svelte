<script lang="ts">
  import { onMount } from 'svelte'

  import { getLocaleFromUrl } from '~/utils/get-locale-from-url'
  import { useTranslations } from '~/utils/use-translations'

  export let date: Date
  export let dateOfBirth: Date

  let url: undefined | URL
  $: locale = getLocaleFromUrl(url)
  $: t = useTranslations(locale, 'timeline')

  type Unit = 'years' | 'months' | 'days' | 'hours' | 'minutes' | 'seconds'

  $: years = date.getFullYear() - dateOfBirth.getFullYear()
  $: months = date.getMonth() - dateOfBirth.getMonth()
  $: days = date.getDate() - dateOfBirth.getDate()
  $: hours = date.getHours() - dateOfBirth.getHours()
  $: minutes = date.getMinutes() - dateOfBirth.getMinutes()
  $: seconds = date.getSeconds() - dateOfBirth.getSeconds()

  $: if (months < 0) {
    years--
    months += 12
  }

  $: if (days < 0) {
    months--
    const previousMonth = new Date(date.getFullYear(), date.getMonth(), 0)
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

  $: format = (value: number, unit: Unit) =>
    `${value} ${
      (
        t(unit) as {
          [key in Intl.LDMLPluralRule]: string
        }
      )[new Intl.PluralRules(locale).select(value)]
    }`

  onMount(() => (url = new URL(window.location.href)))
</script>

<span>
  {format(years, 'years')}
  {format(months, 'months')}
  {format(days, 'days')}
  {format(hours, 'hours')}
  {format(minutes, 'minutes')}
  {format(seconds, 'seconds')}
</span>
