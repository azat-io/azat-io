<script lang="ts">
  export let passed: boolean = false
  export let healthy: boolean = false
</script>

<li
  class={`cell ${$$restProps.class || ''}`.trim()}
  class:passed
  class:healthy
/>

<style>
  .cell {
    position: relative;
    border-radius: 0.5px;
    padding: 0;
    aspect-ratio: 1 / 1;
    inline-size: 100%;
    border: 1px solid var(--color-border-inverse);
    background: var(--color-background-inverse-hover);
    list-style: none;
  }

  .healthy {
    background: var(--color-background-inverse);
  }

  .passed {
    background: var(--color-background-brand);
    border-color: var(--color-border-brand);
  }

  @media (width >= 768px) {
    .cell {
      border-radius: 2px;
    }
  }
</style>
