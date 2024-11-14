<script lang="ts">
  import type { ComponentType } from 'svelte'

  interface Props {
    click?: (() => void) | null
    icon?: ComponentType | null
    umamiEvent?: string | null
    target?: string | null
    view?: 'text' | 'icon'
    href?: string | null
    label: string | null
    mobileOnly?: boolean
    rel?: string | null
  }

  export let mobileOnly: Props['mobileOnly'] = false
  export let umamiEvent: Props['umamiEvent'] = null
  export let view: Props['view'] = 'text'
  export let target: Props['target'] = null
  export let click: Props['click'] = null
  export let label: Props['label'] = null
  export let href: Props['href'] = null
  export let icon: Props['icon'] = null
  export let rel: Props['rel'] = null

  let tag = 'span'
  $: props = {
    href,
  } as Record<string, unknown>

  $: if (typeof href === 'string') {
    tag = 'a'
  } else if (typeof click === 'function') {
    tag = 'button'
    props = {
      type: 'button',
    }
  } else {
    tag = 'span'
  }

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
      rel,
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
  on:click={click}
  {...props}
>
  <svelte:component this={icon} />
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
  }

  .item :global(svg) {
    flex-shrink: 0;
    inline-size: var(--size-icon-m);
    block-size: var(--size-icon-m);
  }

  .mobile-only {
    display: flex;
    align-self: end;
    inline-size: fit-content;

    @media (width >= 768px) {
      display: none;
    }
  }

  .mobile-only span {
    position: absolute;
    inset-inline-start: -100vi;
    transform: translateX(-100%);
  }

  @media (width >= 768px) {
    .text :global(svg) {
      display: none;
    }

    .icon {
      padding: var(--space-xs);
    }

    .icon span {
      position: absolute;
      inset-inline-start: -100vi;
      transform: translateX(-100%);
    }
  }
</style>
