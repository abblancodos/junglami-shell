<script lang="ts">
  import DropdownMenu from './DropdownMenu.svelte'
  import Icon from './Icon.svelte'
  import { systemState } from '$lib/stores/system.svelte.js'
  import type { StatusConfig, WithIconPath, MenuItem } from '$lib/types.js'

  interface Props {
    config: StatusConfig
  }

  const { config }: Props = $props()

  let menuOpen = $state(false)
  let menuX = $state(0)
  let menuY = $state(0)

  const currentIcon = $derived((): WithIconPath => {
    if (config.type === 'volume') {
      if (systemState.muted || systemState.volume === 0) return config.icon_muted
      if (systemState.volume < 40) return config.icon_low
      if (systemState.volume < 70) return config.icon_mid
      return config.icon_high
    }
    if (config.type === 'bluetooth') {
      return systemState.bluetooth.powered ? config.icon_on : config.icon_off
    }
    return systemState.wifi.connected ? config.icon_on : config.icon_off
  })

  const badge = $derived((): string | null => {
    if (config.type === 'volume' && config.show_badge) return `${systemState.volume}%`
    if (config.type === 'bluetooth' && systemState.bluetooth.sink_active) return 'sink'
    return null
  })

  const menuItems = $derived((): MenuItem[] => config.menu ?? [])

  function openMenu(e: MouseEvent) {
    e.preventDefault()
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    menuX = rect.right
    menuY = rect.bottom + 4
    menuOpen = true
  }
</script>

<div class="utility-icon">
  <button
    class="icon-btn"
    class:active={menuOpen}
    onclick={openMenu}
    oncontextmenu={openMenu}
    title={config.type}
  >
    <Icon
      path={currentIcon().icon_path}
      size={16}
      color="rgba(255,255,255,0.9)"
    />
    {#if badge()}<span class="badge">{badge()}</span>{/if}
  </button>
</div>

{#if menuOpen}
  <DropdownMenu
    items={menuItems()}
    x={menuX}
    y={menuY}
    anchor="bottom-right"
    onclose={() => menuOpen = false}
  />
{/if}

<style>
  .utility-icon { position: relative; display: flex; align-items: center; }
  .icon-btn {
    display: flex; align-items: center; gap: 5px;
    padding: 4px 7px; background: none; border: none;
    border-radius: 6px; cursor: pointer; transition: background 0.15s;
  }
  .icon-btn:hover, .icon-btn.active { background: rgba(255,255,255,0.1); }
  .badge { font-size: 10px; color: #3bb085; font-weight: 500; }
</style>