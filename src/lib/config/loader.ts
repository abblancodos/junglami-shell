import type { ResolvedConfig } from '$lib/types.js'

export async function loadConfig(): Promise<ResolvedConfig> {
  const res = await fetch('/api/config')
  if (!res.ok) throw new Error(`[config] failed to load: ${res.status}`)
  return await res.json() as ResolvedConfig
}