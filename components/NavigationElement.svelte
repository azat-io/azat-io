<script lang="ts">
  export let umamiEvent: string | undefined = undefined
  export let ariaLabel: string | undefined = undefined
  export let target: string | undefined = undefined
  export let href: string | undefined = undefined
  export let view: 'text' | 'icon' = 'text'
  export let mobileOnly: boolean = false
  export let label: string
  export let icon: string

  $: tag = typeof href === 'string' ? 'a' : 'button'

  $: props = {
    href,
  } as Record<string, unknown>

  if (typeof umamiEvent === 'string') {
    props = {
      ...props,
      'data-umami-event': umamiEvent,
    }
  }

  if (typeof target === 'string') {
    props = {
      ...props,
      target,
    }
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<svelte:element
  this={tag}
  class="item"
  class:text={view === 'text'}
  class:icon={view === 'icon'}
  class:mobile-only={mobileOnly}
  aria-label={ariaLabel ?? label}
  on:click
  {...props}
>
  {@html icon}
  <span>{label}</span>
  <slot />
</svelte:element>

<style>
  a.item {
    border-block-end: none;
  }

  button.item {
    background: transparent;
    border: none;
    outline: none;
  }

  .item {
    position: relative;
    display: flex;
    gap: var(--space-s);
    align-items: center;
    inline-size: 100%;
    padding: var(--space-xs) var(--space-s);
    line-height: 1.2;
    color: var(--color-content-primary);
    white-space: nowrap;
    border-radius: var(--border-radius);
    transition: all 250ms;
    will-change: box-shadow, background, color;
  }

  .item:hover {
    color: var(--color-content-brand);
    background: var(--color-background-primary-hover);
  }

  .item:focus-visible {
    background: var(--color-overlay-brand);
    box-shadow: 0 0 0 2px var(--color-border-brand);
    transition-property: box-shadow;
  }

  .item :global(svg) {
    inline-size: 24px;
    block-size: 24px;
  }

  .mobile-only {
    display: flex;
    align-self: end;
    inline-size: fit-content;
  }

  .mobile-only span {
    display: none;
  }

  @media (width >= 768px) {
    .text :global(svg) {
      display: none;
    }

    .icon span {
      display: none;
    }

    .icon {
      padding: var(--space-xs);
    }

    .item :global(svg) {
      inline-size: 28px;
      block-size: 28px;
    }

    .mobile-only {
      display: none;
    }
  }
</style>
