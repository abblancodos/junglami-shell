<script lang="ts">
  import { onMount } from 'svelte'
  import DesktopBar from '$lib/components/DesktopBar.svelte'
  import { configState, initConfig } from '$lib/stores/config.svelte.js'
  import { connectRadxactl } from '$lib/stores/system.svelte.js'

  onMount(async () => {
    await initConfig()
    connectRadxactl()
  })
</script>

<div class="bar-root">
  {#if configState.resolved}
    <DesktopBar config={configState.resolved} />
  {/if}
</div>

<style>
  :global(*, *::before, *::after) { box-sizing: border-box; margin: 0; padding: 0; }
  :global(html, body) {
    background: transparent;
    overflow: hidden;
    height: 100%;
    width: 100%;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }

  .bar-root {
    width: 100vw;
    height: 40px;
    background: transparent;
  }
</style>