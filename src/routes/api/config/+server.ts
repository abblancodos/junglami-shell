import { readFile, readdir } from 'fs/promises'
import { join, extname } from 'path'
import { homedir } from 'os'
import { load } from 'js-yaml'
import { resolveAllIcons } from '$lib/server/icon-server.js'
import type { RequestHandler } from './$types'
import type { AppConfig, StatusConfig, PowerItemConfig, ShellConfig } from '$lib/types.js'

const SHELL_DIR  = join(homedir(), '.shell', 'config')
const STATIC_DIR = join(process.cwd(), 'static', 'config')

const log  = (msg: string) => console.log(`[config] ${msg}`)
const warn = (msg: string) => console.warn(`[config] ⚠ ${msg}`)

async function readYaml<T>(relPath: string): Promise<{ data: T; source: string } | null> {
  for (const base of [SHELL_DIR, STATIC_DIR]) {
    const full = join(base, relPath)
    try {
      const text = await readFile(full, 'utf-8')
      return { data: load(text) as T, source: full }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e)
      if (!msg.includes('ENOENT')) warn(`failed to read ${full}: ${msg}`)
    }
  }
  return null
}

async function readDir(relPath: string): Promise<string[]> {
  for (const base of [SHELL_DIR, STATIC_DIR]) {
    const full = join(base, relPath)
    try {
      const entries = await readdir(full)
      const yamls = entries.filter(f => extname(f) === '.yaml')
      log(`scanned ${full} → [${yamls.join(', ')}]`)
      return yamls
    } catch { /* try next */ }
  }
  warn(`directory not found: ${relPath}`)
  return []
}

function validateApp(raw: unknown, source: string): AppConfig | null {
  if (typeof raw !== 'object' || raw === null) return null
  const r = raw as Record<string, unknown>
  if (typeof r.name !== 'string') { warn(`${source}: missing 'name'`); return null }
  if (typeof r.exec !== 'string') { warn(`${source}: missing 'exec'`); return null }
  return raw as AppConfig
}

function validateStatus(raw: unknown, source: string): StatusConfig | null {
  if (typeof raw !== 'object' || raw === null) return null
  const r = raw as Record<string, unknown>
  if (!['volume', 'bluetooth', 'wifi'].includes(r.type as string)) {
    warn(`${source}: invalid type '${r.type}'`)
    return null
  }
  return raw as StatusConfig
}

function validatePower(raw: unknown): PowerItemConfig[] {
  if (!Array.isArray(raw)) return []
  return raw.filter((item): item is PowerItemConfig =>
    typeof item === 'object' && item !== null &&
    typeof (item as Record<string, unknown>).label === 'string' &&
    typeof (item as Record<string, unknown>).action === 'string'
  )
}

export const GET: RequestHandler = async () => {
  log('--- loading config ---')

  const shell = (await readYaml<ShellConfig>('shell.yaml'))?.data ?? {}

  const appFiles = await readDir('apps')
  const apps: AppConfig[] = []
  for (const f of appFiles) {
    const result = await readYaml<unknown>(`apps/${f}`)
    if (result) {
      const v = validateApp(result.data, result.source)
      if (v) apps.push(v)
    }
  }
  apps.sort((a, b) => (a.order ?? 99) - (b.order ?? 99))

  const statusFiles = await readDir('status')
  const status: StatusConfig[] = []
  for (const f of statusFiles) {
    const result = await readYaml<unknown>(`status/${f}`)
    if (result) {
      const v = validateStatus(result.data, result.source)
      if (v) status.push(v)
    }
  }
  status.sort((a, b) => (a.order ?? 99) - (b.order ?? 99))

  const powerResult = await readYaml<unknown>('power.yaml')
  const power = validatePower(powerResult?.data)

  // Resolver todos los íconos — sustituye icon_svg/icon_simple/icon_lucide por icon_path
  const resolved = await resolveAllIcons({ shell, apps, status, power })

  log(`done: ${apps.length} apps, ${status.length} status, ${power.length} power items`)

  return new Response(JSON.stringify(resolved), {
    headers: { 'Content-Type': 'application/json' }
  })
}