<script lang="ts">
  import { fly } from 'svelte/transition'
  import Icon from './Icon.svelte'
  import { handleAction } from '$lib/config/actions.js'
  import { systemState } from '$lib/stores/system.svelte.js'
  import type { MenuItem, MenuItemAction, MenuItemSlider } from '$lib/types.js'

  interface Props {
    items: MenuItem[]
    x: number
    y: number
    anchor?: 'bottom-left' | 'bottom-right'
    onclose: () => void
  }

  const { items, x, y, anchor = 'bottom-left', onclose }: Props = $props()

  let sliderVals = $state<Record<string, number>>({})

  $effect(() => {
    for (const item of items) {
      if (!item.divider && (item as MenuItemSlider).slider) {
        const s = item as MenuItemSlider
        if (!(s.label in sliderVals)) {
          sliderVals[s.label] = s.get_value === 'volume' ? systemState.volume : (s.min ?? 0)
        }
      }
    }
  })

  function isAction(item: MenuItem): item is MenuItemAction {
    return !item.divider && !(item as MenuItemSlider).slider
  }

  function isSlider(item: MenuItem): item is MenuItemSlider {
    return !item.divider && !!(item as MenuItemSlider).slider
  }

  function clickItem(item: MenuItemAction) {
    handleAction(item)
    onclose()
  }

  function handleKey(e: KeyboardEvent) {
    if (e.key === 'Escape') onclose()
  }

  function handleClickOutside(e: MouseEvent) {
    const el = document.getElementById('jm-dropdown')
    if (el && !el.contains(e.target as Node)) onclose()
  }

  $effect(() => {
    window.addEventListener('keydown', handleKey)
    const t = setTimeout(() => window.addEventListener('click', handleClickOutside), 10)
    return () => {
      window.removeEventListener('keydown', handleKey)
      window.removeEventListener('click', handleClickOutside)
      clearTimeout(t)
    }
  })

  const style = $derived(
    anchor === 'bottom-left'
      ? `top:${y}px; left:${x}px`
      : `top:${y}px; right:${window.innerWidth - x}px`
  )
</script>

<div
  id="jm-dropdown"
  class="dropdown"
  style={style}
  transition:fly={{ y: -6, duration: 120 }}
>
  {#each items as item}
    {#if item.divider}
      <div class="divider"></div>

    {:else if isSlider(item)}
      <div class="slider-item">
        <div class="slider-header">
          <span class="slider-label">{item.label}</span>
          <span class="slider-value">{sliderVals[item.label] ?? 0}%</span>
        </div>
        <input
          type="range"
          min={item.min ?? 0}
          max={item.max ?? 100}
          step={item.step ?? 1}
          value={sliderVals[item.label] ?? 0}
          oninput={(e) => {
            const n = Number((e.target as HTMLInputElement).value)
            sliderVals[item.label] = n
            handleAction({ label: item.label, action: item.action, value: n })
          }}
          onclick={(e) => e.stopPropagation()}
        />
      </div>

    {:else if isAction(item)}
      <button
        class="item"
        class:danger={item.danger}
        onclick={() => clickItem(item)}
      >
        <span class="icon-wrap">
          <Icon
            path={item.icon_path}
            size={14}
            color={item.danger ? '#ff6b6b' : 'rgba(255,255,255,0.65)'}
          />
        </span>
        <span class="label">{item.label}</span>
        {#if item.badge_when_active}
          <span class="badge">{item.badge_when_active}</span>
        {/if}
      </button>
    {/if}
  {/each}
</div>

<style>
  .dropdown {
    position: fixed; z-index: 1000;
    background: rgba(22, 22, 22, 0.97);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px; padding: 4px; min-width: 210px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.6);
  }
  .item {
    display: flex; align-items: center; gap: 10px;
    width: 100%; padding: 8px 12px;
    background: none; border: none; border-radius: 6px;
    color: rgba(255,255,255,0.9); font-size: 13px;
    cursor: pointer; text-align: left; transition: background 0.1s;
  }
  .item:hover { background: rgba(255,255,255,0.1); }
  .item.danger { color: #ff6b6b; }
  .item.danger:hover { background: rgba(255,107,107,0.12); }
  .icon-wrap { width: 16px; display: flex; align-items: center; justify-content: center; }
  .label { flex: 1; }
  .badge { font-size: 10px; padding: 2px 6px; background: rgba(59,176,133,0.25); color: #3bb085; border-radius: 4px; }
  .slider-item { padding: 8px 12px 10px; display: flex; flex-direction: column; gap: 6px; }
  .slider-header { display: flex; justify-content: space-between; align-items: center; }
  .slider-label { color: rgba(255,255,255,0.65); font-size: 12px; }
  .slider-value { color: #3bb085; font-size: 12px; font-weight: 500; min-width: 32px; text-align: right; }
  input[type=range] {
    width: 100%; height: 4px;
    -webkit-appearance: none; appearance: none;
    background: rgba(255,255,255,0.15); border-radius: 2px; outline: none; cursor: pointer;
  }
  input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none; appearance: none;
    width: 14px; height: 14px; border-radius: 50%;
    background: #3bb085; cursor: pointer;
    box-shadow: 0 0 0 3px rgba(59,176,133,0.2);
  }
  input[type=range]::-moz-range-thumb {
    width: 14px; height: 14px; border-radius: 50%;
    background: #3bb085; cursor: pointer; border: none;
  }
  .divider { height: 1px; background: rgba(255,255,255,0.08); margin: 4px 8px; }
</style>