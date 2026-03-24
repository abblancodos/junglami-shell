<script lang="ts">
  import { onMount } from 'svelte'
  import QuarterCircleDock from '$lib/components/QuarterCircleDock.svelte'
  import { configState, initConfig } from '$lib/stores/config.svelte.js'
  import { connectRadxactl } from '$lib/stores/system.svelte.js'

  onMount(async () => {
    await initConfig()
    connectRadxactl()
  })
</script>

<div class="dock-root">
  {#if configState.resolved}
    <QuarterCircleDock config={configState.resolved} visible={true} />
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

  .dock-root {
    width: 100%;
    height: 100%;
    background: transparent;
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
  }
</style>