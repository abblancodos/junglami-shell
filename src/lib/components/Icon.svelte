<script lang="ts">
  interface Props {
    path?:  string   // URL resuelta por el servidor e.g. /icons/si/retroarch.svg
    size?:  number
    color?: string
    class?: string
  }

  const { path, size = 18, color = 'currentColor', class: cls = '' }: Props = $props()

  let svgContent = $state<string | null>(null)
  let loading = $state(false)

  $effect(() => {
    if (!path) { svgContent = null; return }
    loading = true
    fetch(path)
      .then(r => r.ok ? r.text() : null)
      .then(text => { svgContent = text; loading = false })
      .catch(() => { svgContent = null; loading = false })
  })
</script>

<span
  class="icon-wrap {cls}"
  style="width:{size}px; height:{size}px; color:{color}; opacity:{loading ? 0.2 : 1}"
  aria-hidden="true"
>
  {#if svgContent}
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
    >
      {@html svgContent}
    </svg>
  {:else if !loading && path}
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} stroke-width="1.5" opacity="0.25">
      <circle cx="12" cy="12" r="5"/>
    </svg>
  {/if}
</span>

<style>
  .icon-wrap {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: opacity 0.15s;
  }
  .icon-wrap :global(svg) {
    width: 100%;
    height: 100%;
  }
</style>