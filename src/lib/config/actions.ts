import { sendCommand, systemState } from '$lib/stores/system.svelte.js'
import type { MenuItemAction } from '$lib/types.js'

export function handleAction(item: MenuItemAction): void {
  const { action, value } = item

  switch (action) {
    case 'launch':
      sendCommand({ cmd: 'Launch', exec: value as string })
      break
    case 'kill':
      sendCommand({ cmd: 'Kill', exec: value as string })
      break
    case 'volume_set':
      sendCommand({ cmd: 'AudioSetVolume', val: value as number })
      break
    case 'volume_mute':
      sendCommand({ cmd: 'AudioMute' })
      break
    case 'bluetooth_toggle':
      sendCommand({ cmd: systemState.bluetooth.powered ? 'BluetoothDisable' : 'BluetoothEnable' })
      break
    case 'bluetooth_scan':
      sendCommand({ cmd: 'BluetoothScan' })
      break
    case 'bluetooth_sink_toggle':
      sendCommand({ cmd: 'BluetoothSetSinkMode', val: !systemState.bluetooth.sink_active })
      break
    case 'wifi_scan':
      sendCommand({ cmd: 'WifiScan' })
      break
    case 'wifi_forget':
      sendCommand({ cmd: 'WifiForget', val: systemState.wifi.ssid })
      break
    case 'suspend':
      sendCommand({ cmd: 'Suspend' })
      break
    case 'reboot':
      sendCommand({ cmd: 'Reboot' })
      break
    case 'shutdown':
      sendCommand({ cmd: 'Shutdown' })
      break
    default:
      console.warn('[action] unknown action:', action)
  }
}