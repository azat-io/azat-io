<script lang="ts">
  export let click: (() => void) | undefined = undefined
  export let umamiEvent: string | undefined = undefined
  export let ariaLabel: string | undefined = undefined
  export let target: string | undefined = undefined
  export let href: string | undefined = undefined
  export let view: 'text' | 'icon' = 'text'
  export let mobileOnly: boolean = false
  export let label: string
  export let icon: string

  $: tag = 'span'

  $: if (typeof href === 'string') {
    tag = 'a'
  } else if (typeof click === 'function') {
    tag = 'button'
  } else {
    tag = 'span'
  }

  $: props = { href } as Record<string, unknown>

  $: if (typeof umamiEvent === 'string') {
    props = {
      ...props,
      'data-umami-event': umamiEvent,
    }
  }

  $: if (typeof href === 'string' && typeof target === 'string') {
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
  on:click={click}
  {...props}
>
  {@html icon}
  <span>{label}</span>
  <slot />
</svelte:element>

<style>
  .item {
    position: relative;
    display: flex;
    gap: var(--space-s);
    place-items: center;
    inline-size: 100%;
    padding: var(--space-xs) var(--space-s);
    line-height: 1.2;
    color: var(--color-content-primary);
    white-space: nowrap;
    border-radius: var(--border-radius);
    transition: all 250ms;
    will-change: box-shadow, background, color;

    &:is(a) {
      text-decoration: none;
    }

    &:is(button) {
      background: transparent;
      border: none;
      outline: none;
    }

    &:is(a, button) {
      @media (hover: hover) {
        &:hover {
          color: var(--color-content-brand);
          background: var(--color-background-primary-hover);
        }
      }

      &:focus-visible {
        background: var(--color-overlay-brand);
        box-shadow: 0 0 0 2px var(--color-border-brand);
        transition-property: box-shadow;
      }
    }

    :global(svg) {
      inline-size: var(--size-icon-m);
      block-size: var(--size-icon-m);
    }
  }

  .mobile-only {
    display: flex;
    align-self: end;
    inline-size: fit-content;

    span {
      display: none;
    }

    @media (width >= 768px) {
      display: none;
    }
  }

  @media (width >= 768px) {
    .text :global(svg) {
      display: none;
    }

    .icon {
      padding: var(--space-xs);

      span {
        display: none;
      }
    }
  }
</style>
