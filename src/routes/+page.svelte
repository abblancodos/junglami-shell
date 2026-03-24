<script lang="ts">
  import { onMount } from 'svelte'
  import DesktopBar from '$lib/components/DesktopBar.svelte'
  import QuarterCircleDock from '$lib/components/QuarterCircleDock.svelte'
  import { configState, initConfig } from '$lib/stores/config.svelte.js'
  import { connectRadxactl } from '$lib/stores/system.svelte.js'

  let fullscreen = $state(false)
  let dockVisible = $state(false)

  onMount(async () => {
    await initConfig()
    connectRadxactl()

    document.addEventListener('fullscreenchange', () => {
      fullscreen = !!document.fullscreenElement
      dockVisible = fullscreen
    })
  })

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }
</script>

<svelte:window onkeydown={(e) => e.key === 'F11' && toggleFullscreen()} />

<div class="shell">
  {#if !configState.resolved}
    <div class="loading">loading...</div>
  {:else if !fullscreen}
    <DesktopBar config={configState.resolved} />
    <div class="desktop-hint">
      <p>Presioná <kbd>F11</kbd> para simular pantalla completa</p>
      <button onclick={toggleFullscreen}>Simular fullscreen</button>
    </div>
  {:else}
    <div class="fullscreen-content">
      <p>App content aquí</p>
    </div>
  {/if}

  {#if configState.resolved}
    <QuarterCircleDock config={configState.resolved} visible={dockVisible} />
  {/if}

  {#if fullscreen}
    <div
      class="dock-trigger"
      role="button"
      tabindex="-1"
      aria-label="Show dock"
      onmouseenter={() => dockVisible = true}
      onmouseleave={() => dockVisible = false}
      onkeydown={() => {}}
    ></div>
  {/if}
</div>

<style>
  :global(*, *::before, *::after) { box-sizing: border-box; margin: 0; padding: 0; }
  :global(body) {
    background: #1a1a1a;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    overflow: hidden; height: 100vh;
  }
  .shell { display: flex; flex-direction: column; height: 100vh; width: 100vw; }
  .loading {
    flex: 1; display: flex; align-items: center; justify-content: center;
    color: rgba(255,255,255,0.2); font-size: 13px;
  }
  .desktop-hint {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 16px;
    color: rgba(255,255,255,0.3); font-size: 14px;
  }
  kbd {
    background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);
    border-radius: 4px; padding: 2px 6px; font-family: monospace;
  }
  button {
    padding: 8px 20px; background: #3bb085; color: white;
    border: none; border-radius: 8px; cursor: pointer; font-size: 13px;
  }
  .fullscreen-content {
    flex: 1; display: flex; align-items: center; justify-content: center;
    background: #111; color: rgba(255,255,255,0.2);
  }
  .dock-trigger {
    position: fixed; bottom: 0; right: 0; width: 80px; height: 80px; z-index: 150;
  }
</style>