<script lang="ts">
  import DropdownMenu from './DropdownMenu.svelte'
  import Icon from './Icon.svelte'
  import { handleAction } from '$lib/config/actions.js'
  import type { AppConfig, MenuItem } from '$lib/types.js'

  interface Props {
    app: AppConfig
    active?: boolean
  }

  const { app, active = false }: Props = $props()

  let menuOpen = $state(false)
  let menuX = $state(0)
  let menuY = $state(0)
  let menuItems = $state<MenuItem[]>([])

  function openMenu(e: MouseEvent, type: 'left' | 'right') {
    e.preventDefault()
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    menuX = rect.left
    menuY = rect.bottom + 4

    const rawItems = type === 'left' ? app.left_click : app.right_click

    if (!rawItems?.length) {
      if (type === 'left') {
        handleAction({ label: app.name, action: 'launch', value: app.exec })
      }
      return
    }

    menuItems = rawItems.map(item => {
      if (item.divider) return item
      if ('action' in item && (item.action === 'launch' || item.action === 'kill')) {
        return { ...item, value: app.exec }
      }
      return item
    })

    menuOpen = true
  }
</script>

<div class="app-icon" class:active>
  <button
    class="icon-btn"
    title={app.name}
    onclick={(e) => openMenu(e, 'left')}
    oncontextmenu={(e) => openMenu(e, 'right')}
  >
    <Icon path={app.icon_path} size={18} color="rgba(255,255,255,0.9)" />
    {#if active}<span class="dot"></span>{/if}
  </button>
</div>

{#if menuOpen}
  <DropdownMenu
    items={menuItems}
    x={menuX}
    y={menuY}
    anchor="bottom-left"
    onclose={() => menuOpen = false}
  />
{/if}

<style>
  .app-icon { position: relative; display: flex; flex-direction: column; align-items: center; }
  .icon-btn {
    display: flex; align-items: center; justify-content: center;
    width: 32px; height: 32px;
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 8px; cursor: pointer;
    transition: background 0.15s, transform 0.1s; position: relative;
  }
  .icon-btn:hover { background: rgba(255,255,255,0.15); transform: scale(1.05); }
  .icon-btn:active { transform: scale(0.95); }
  .active .icon-btn { background: rgba(59,176,133,0.2); border-color: rgba(59,176,133,0.4); }
  .dot {
    position: absolute; bottom: -5px; left: 50%; transform: translateX(-50%);
    width: 4px; height: 4px; background: #3bb085; border-radius: 50%;
  }
</style>