// ─── Icon ─────────────────────────────────────────────────────────────────────
// En los YAMLs se define con icon_svg/icon_simple/icon_lucide
// El servidor los resuelve a icon_path antes de enviar al cliente

export interface IconDef {
  icon_svg?:    string
  icon_simple?: string
  icon_lucide?: string
}

// Lo que el cliente recibe — solo un path resuelto
export interface WithIconPath {
  icon_path?: string
}

// ─── Dropdown menu items ──────────────────────────────────────────────────────

export interface MenuItemDivider {
  divider: true
}

export interface MenuItemAction extends WithIconPath {
  divider?: false
  slider?: false
  label: string
  action: string
  value?: number | string | boolean
  danger?: boolean
  badge_when_active?: string
}

export interface MenuItemSlider {
  divider?: false
  slider: true
  label: string
  action: string
  min?: number
  max?: number
  step?: number
  get_value?: string
}

export type MenuItem = MenuItemDivider | MenuItemAction | MenuItemSlider

// ─── App config ───────────────────────────────────────────────────────────────

export interface AppConfig extends WithIconPath {
  name: string
  exec: string
  order?: number
  left_click?: MenuItem[]
  right_click?: MenuItem[]
}

// ─── Status config ────────────────────────────────────────────────────────────

export interface VolumeStatusConfig {
  type: 'volume'
  order?: number
  show_badge?: boolean
  icon_muted: WithIconPath
  icon_low:   WithIconPath
  icon_mid:   WithIconPath
  icon_high:  WithIconPath
  menu?: MenuItem[]
}

export interface BluetoothStatusConfig {
  type: 'bluetooth'
  order?: number
  icon_on:  WithIconPath
  icon_off: WithIconPath
  menu?: MenuItem[]
}

export interface WifiStatusConfig {
  type: 'wifi'
  order?: number
  icon_on:  WithIconPath
  icon_off: WithIconPath
  menu?: MenuItem[]
}

export type StatusConfig =
  | VolumeStatusConfig
  | BluetoothStatusConfig
  | WifiStatusConfig

// ─── Power ────────────────────────────────────────────────────────────────────

export interface PowerItemConfig extends WithIconPath {
  label: string
  action: string
  danger?: boolean
}

// ─── Shell global config ──────────────────────────────────────────────────────

export interface ThemeConfig {
  mode?: 'dark' | 'light'
  accent?: string
  bar_opacity?: number
  bar_height?: number
  dock_size?: number
  font_size?: number
}

export interface BarConfig {
  show_seconds?: boolean
  show_date?: boolean
}

export interface ShellConfig {
  theme?: ThemeConfig
  bar?: BarConfig
}

// ─── Resolved config (lo que devuelve /api/config) ───────────────────────────

export interface ResolvedConfig {
  shell: ShellConfig
  apps: AppConfig[]
  status: StatusConfig[]
  power: PowerItemConfig[]
}

// ─── System state ─────────────────────────────────────────────────────────────

export interface BluetoothState {
  powered: boolean
  connected: boolean
  sink_active: boolean
}

export interface WifiState {
  connected: boolean
  ssid: string
  strength: number
}

export interface SystemState {
  volume: number
  muted: boolean
  bluetooth: BluetoothState
  wifi: WifiState
  time: Date
}

// ─── radxactl commands ────────────────────────────────────────────────────────

export type RadxactlCommand =
  | { cmd: 'AudioSetVolume';        val: number }
  | { cmd: 'AudioMute' }
  | { cmd: 'BluetoothEnable' }
  | { cmd: 'BluetoothDisable' }
  | { cmd: 'BluetoothScan' }
  | { cmd: 'BluetoothSetSinkMode';  val: boolean }
  | { cmd: 'WifiScan' }
  | { cmd: 'WifiForget';            val: string }
  | { cmd: 'Suspend' }
  | { cmd: 'Reboot' }
  | { cmd: 'Shutdown' }
  | { cmd: 'Launch';                exec: string }
  | { cmd: 'Kill';                  exec: string }