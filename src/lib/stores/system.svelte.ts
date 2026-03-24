import type { SystemState, RadxactlCommand } from '$lib/types.js'

export const systemState = $state<SystemState>({
  volume: 75,
  muted: false,
  bluetooth: { powered: true, connected: false, sink_active: false },
  wifi: { connected: true, ssid: 'JunglamiNet', strength: 80 },
  time: new Date(),
})

let ws: WebSocket | null = null
let reconnectTimer: ReturnType<typeof setTimeout> | null = null

export function connectRadxactl(): void {
  try {
    ws = new WebSocket('ws://localhost:7777')

    ws.onopen = () => {
      console.log('[radxactl] connected')
      if (reconnectTimer) clearTimeout(reconnectTimer)
    }

    ws.onmessage = (e: MessageEvent) => {
      try {
        const msg = JSON.parse(e.data as string) as Record<string, unknown>
        if (msg.type === 'WifiStateChanged') {
          systemState.wifi.connected = msg.state === 'connected'
          if (typeof msg.ssid === 'string') systemState.wifi.ssid = msg.ssid
        }
        if (msg.type === 'BluetoothStateChanged') {
          if (typeof msg.powered   === 'boolean') systemState.bluetooth.powered   = msg.powered
          if (typeof msg.connected === 'boolean') systemState.bluetooth.connected = msg.connected
        }
        if (msg.type === 'AudioVolumeChanged' && typeof msg.value === 'number') {
          systemState.volume = msg.value
        }
      } catch { /* ignore malformed messages */ }
    }

    ws.onclose = () => {
      console.warn('[radxactl] disconnected, retrying in 3s')
      reconnectTimer = setTimeout(connectRadxactl, 3000)
    }

    ws.onerror = () => ws?.close()

  } catch (e) {
    console.warn('[radxactl] ws unavailable, using mock state', e)
  }
}

export function sendCommand(cmd: RadxactlCommand): void {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(cmd))
  } else {
    console.warn('[radxactl] not connected, command dropped:', cmd)
  }
}

// clock tick
setInterval(() => { systemState.time = new Date() }, 1000)

export function formattedTime(): string {
  return systemState.time.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', hour12: true
  })
}

export function formattedDate(): string {
  return systemState.time.toLocaleDateString('en-US', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
  })
}