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
    inline-size: 100%;
    aspect-ratio: 1 / 1;
    padding: 0;
    margin-block: 0;
    list-style: none;
    background: var(--color-background-inverse-hover);
    border: 1px solid var(--color-border-inverse);
    border-radius: 0.5px;

    @media (width >= 768px) {
      border-radius: 2px;
    }
  }

  .healthy {
    background: var(--color-background-inverse);
  }

  .passed {
    background: var(--color-background-brand);
    border-color: var(--color-border-brand);
  }
</style>
