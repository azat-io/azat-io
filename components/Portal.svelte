<script lang="ts">
  let ref: HTMLElement
  $: ref && document.body.appendChild(ref)
</script>

<div bind:this={ref}>
  <slot />
</div>
