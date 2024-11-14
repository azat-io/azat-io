<script lang="ts">
  let reference: HTMLElement | null
  $: reference && document.body.append(reference)
</script>

<div bind:this={reference}>
  <slot />
</div>
