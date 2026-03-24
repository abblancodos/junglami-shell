import { loadConfig } from '$lib/config/loader.js'
import type { ResolvedConfig } from '$lib/types.js'

export const configState = $state<{ resolved: ResolvedConfig | null }>({ resolved: null })

export async function initConfig(): Promise<void> {
  configState.resolved = await loadConfig()
}