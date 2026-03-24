<script lang="ts">
  import JunglamiMenu from './JunglamiMenu.svelte'
  import AppIcon from './AppIcon.svelte'
  import UtilityIcon from './UtilityIcon.svelte'
  import { formattedTime, formattedDate } from '$lib/stores/system.svelte.js'
  import type { ResolvedConfig } from '$lib/types.js'

  interface Props {
    config: ResolvedConfig
  }

  const { config }: Props = $props()

  const theme = $derived(config.shell.theme ?? {})
  const bar   = $derived(config.shell.bar ?? {})
</script>

<div
  class="bar"
  style="
    height: {theme.bar_height ?? 40}px;
    --accent: {theme.accent ?? '#3bb085'};
    font-size: {theme.font_size ?? 13}px;
  "
>
  <div class="left">
    <JunglamiMenu {config} />
    <div class="divider"></div>
    {#each config.apps as app}
      <AppIcon {app} />
    {/each}
  </div>

  <div class="center">
    <span class="datetime">
      {#if bar.show_date ?? true}
        <span class="date">{formattedDate()}</span>
        <span class="sep">·</span>
      {/if}
      <span class="time">{formattedTime()}</span>
    </span>
  </div>

  <div class="right">
    {#each config.status as statusCfg}
      <UtilityIcon config={statusCfg} />
    {/each}
  </div>
</div>

<style>
  .bar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 10px;
    background: rgba(18, 18, 18, 0.92);
    border-bottom: 1px solid rgba(255,255,255,0.07);
    user-select: none; position: relative; z-index: 100;
  }
  .left, .right { display: flex; align-items: center; gap: 6px; flex: 1; }
  .right { justify-content: flex-end; }
  .center { display: flex; align-items: center; justify-content: center; flex: 1; }
  .datetime { display: flex; align-items: center; gap: 6px; color: rgba(255,255,255,0.9); }
  .date { color: rgba(255,255,255,0.55); font-size: 0.92em; }
  .time { font-weight: 500; }
  .sep { color: rgba(255,255,255,0.25); }
  .divider { width: 1px; height: 20px; background: rgba(255,255,255,0.1); margin: 0 2px; }
</style>