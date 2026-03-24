<script lang="ts">
  import JunglamiMenu from './JunglamiMenu.svelte'
  import AppIcon from './AppIcon.svelte'
  import UtilityIcon from './UtilityIcon.svelte'
  import { formattedTime, formattedDate } from '$lib/stores/system.svelte.js'
  import { fly } from 'svelte/transition'
  import type { ResolvedConfig } from '$lib/types.js'

  interface Props {
    config: ResolvedConfig
    visible: boolean
  }

  const { config, visible }: Props = $props()
</script>

{#if visible}
  <div class="dock" transition:fly={{ x: 60, y: 60, duration: 180 }}>
    <div class="status-row">
      {#each config.status as statusCfg}
        <UtilityIcon config={statusCfg} />
      {/each}
    </div>

    <div class="app-row">
      {#each config.apps as app}
        <AppIcon {app} />
      {/each}
    </div>

    <div class="bottom-row">
      <JunglamiMenu {config} />
      <div class="time-block">
        <span class="time">{formattedTime()}</span>
        <span class="date">{formattedDate()}</span>
      </div>
    </div>
  </div>
{/if}

<style>
  .dock {
    position: fixed; bottom: 16px; right: 16px; z-index: 200;
    display: flex; flex-direction: column; align-items: flex-end; gap: 8px;
    background: rgba(18, 18, 18, 0.93);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px; padding: 12px 14px;
    box-shadow: 0 8px 40px rgba(0,0,0,0.6);
    min-width: 160px;
  }
  .status-row, .app-row, .bottom-row {
    display: flex; align-items: center; justify-content: flex-end; gap: 6px; width: 100%;
  }
  .bottom-row {
    border-top: 1px solid rgba(255,255,255,0.07);
    padding-top: 8px; margin-top: 2px; justify-content: space-between;
  }
  .time-block { display: flex; flex-direction: column; align-items: flex-end; gap: 1px; }
  .time { color: rgba(255,255,255,0.9); font-size: 13px; font-weight: 500; }
  .date { color: rgba(255,255,255,0.4); font-size: 10px; }
</style>