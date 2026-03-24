<script lang="ts">
  import DropdownMenu from './DropdownMenu.svelte'
  import type { ResolvedConfig, MenuItem } from '$lib/types.js'

  interface Props {
    config: ResolvedConfig
  }

  const { config }: Props = $props()

  let menuOpen = $state(false)
  let menuX = $state(0)
  let menuY = $state(0)

  const menuItems = $derived((): MenuItem[] => [
    ...config.apps.map((app): MenuItem => ({
      label: app.name,
      icon_path: app.icon_path,
      action: 'launch',
      value: app.exec,
    })),
    { divider: true },
    ...config.power,
  ])

  function openMenu(e: MouseEvent) {
    e.preventDefault()
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    menuX = rect.left
    menuY = rect.bottom + 4
    menuOpen = true
  }
</script>

<div class="junglami-logo">
  <button
    class="logo-btn"
    class:active={menuOpen}
    onclick={openMenu}
    oncontextmenu={openMenu}
    title="Junglami OS"
  >
    <svg viewBox="0 0 37.596153 35.425449" width="22" height="22" aria-hidden="true">
      <path
        fill="white"
        transform="translate(-2.646867,-2.2076173)"
        d="m 11.610661,2.2076172 c 1.509515,0.618663 3.142336,1.3064867 4.678267,2.4959717 2.061387,1.596418 3.066049,5.4076711 -0.04082,2.545581 C 13.80493,4.9984909 9.3229139,3.4676629 5.6683919,2.6117269 3.8880129,3.3755139 2.6468709,5.1414518 2.6468709,7.2078288 v 1.5482259 c 0.882301,0.398113 3.5213464,1.5983623 4.5268554,2.1605913 1.215646,0.679728 0.9298585,2.837802 -0.3079915,2.815332 -1.08533,-0.0197 -1.4624289,-1.622461 -4.2188639,-2.616377 V 28.837 C 3.600517,27.930633 7.3644251,21.740125 8.884729,22.980509 9.958091,24.168968 4.514388,33.054404 4.742863,35.439181 c 0.228473,2.384776 4.9506022,2.190047 4.9506022,2.190047 l 10.9326658,-0.0041 c 0.130107,-0.382944 0.28639,-0.729991 0.472323,-0.975135 1.453021,-1.915738 -1.885382,-9.952815 -3.001884,-12.185819 -0.628033,-1.256065 -0.505621,-1.743198 -0.04754,-1.765267 0.356281,-0.01716 0.915643,0.246955 1.483113,0.648539 4.752938,3.363532 3.660123,9.817539 8.481653,14.277682 h 7.229016 c 2.77,0 5.000212,-2.230212 5.000212,-5.000212 v -1.114144 c -1.60646,-4.611061 -4.462816,-10.77838 -10.184908,-14.862659 -3.821626,-2.727775 -5.555495,-5.635327 -4.244703,-5.705078 0.187257,-0.01 0.436541,0.03778 0.750859,0.152446 12.317876,4.4938 11.608492,13.925579 13.678752,14.446146 V 13.961938 c -1.25407,-1.17535 -2.545395,-2.276769 -3.709335,-2.927986 -2.58433,-1.4459012 -2.021809,-2.8027935 -0.629419,-2.7553875 0.19892,0.00677 0.414748,0.042148 0.640788,0.1100708 1.48772,0.447045 2.704916,0.8850491 3.697966,1.2955281 V 7.2078288 c 0,-2.77 -2.230212,-5.0002116 -5.000212,-5.0002116 H 29.136723 C 32.05319,5.2022082 30.9745,7.1886728 28.862321,5.1247518 27.773346,4.0606558 26.036744,3.0847372 24.317896,2.2076172 Z M 22.152653,16.956071 c 0.326152,0.0032 0.801411,0.14072 1.386995,0.455269 0.674394,0.362254 2.750119,0.90744 3.335197,2.569869 0.585076,1.662429 1.330952,3.203209 0.730705,4.078821 -0.600247,0.875609 -2.250532,-1.748986 -4.210596,-4.559928 0,0 -0.708507,-0.768717 -1.451074,-1.638143 -0.464104,-0.543391 -0.334814,-0.911253 0.208773,-0.905888 z"
      />
    </svg>
  </button>
</div>

{#if menuOpen}
  <DropdownMenu
    items={menuItems()}
    x={menuX}
    y={menuY}
    anchor="bottom-left"
    onclose={() => menuOpen = false}
  />
{/if}

<style>
  .junglami-logo { display: flex; align-items: center; }
  .logo-btn {
    display: flex; align-items: center; justify-content: center;
    width: 32px; height: 32px;
    background: #3bb085; border: none; border-radius: 8px;
    cursor: pointer; transition: background 0.15s, transform 0.1s;
  }
  .logo-btn:hover { background: #4dc99a; transform: scale(1.05); }
  .logo-btn:active, .logo-btn.active { background: #2d9068; transform: scale(0.96); }
</style>