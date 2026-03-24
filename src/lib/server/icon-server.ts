import { mkdir, writeFile, access } from 'fs/promises'
import { join } from 'path'
import { homedir } from 'os'

const ICONS_CACHE = join('/tmp', 'junglami-shell', 'icons')
const SHELL_ICONS  = join(homedir(), '.shell', 'icons')
const STATIC_ICONS = join(process.cwd(), 'static', 'icons')

const log  = (msg: string) => console.log(`[icons] ${msg}`)
const warn = (msg: string) => console.warn(`[icons] ⚠ ${msg}`)

async function ensureDirs() {
  await mkdir(join(ICONS_CACHE, 'si'), { recursive: true })
  await mkdir(join(ICONS_CACHE, 'lu'), { recursive: true })
}

// Lucide exports icons as [tagName, attrs, children?][]
// e.g. [["path",{"d":"..."}], ["circle",{"cx":12,"cy":12,"r":10}]]
type LucideNode = [string, Record<string, string | number>]

function renderLucideNode(node: LucideNode): string {
  const [tag, attrs] = node
  const attrStr = Object.entries(attrs)
    .map(([k, v]) => `${k}="${v}"`)
    .join(' ')
  // All lucide elements are self-closing
  return `<${tag} ${attrStr}/>`
}

function lucideToSvg(nodes: LucideNode[]): string {
  const inner = nodes.map(renderLucideNode).join('\n  ')
  return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
  ${inner}
</svg>`
}

async function resolveLucide(name: string): Promise<string | null> {
  const dest = join(ICONS_CACHE, 'lu', `${name}.svg`)
  try { await access(dest); return `/icons/lu/${name}.svg` } catch { /* not cached */ }

  try {
    const lucide = await import('lucide') as Record<string, unknown>
    const icon = lucide[name] as LucideNode[] | undefined
    if (!icon || !Array.isArray(icon)) {
      warn(`lucide: '${name}' not found`)
      return null
    }
    const svg = lucideToSvg(icon)
    await writeFile(dest, svg)
    log(`✓ lu/${name}.svg`)
    return `/icons/lu/${name}.svg`
  } catch (e) {
    warn(`lucide error for '${name}': ${e}`)
    return null
  }
}

async function resolveSimple(slug: string): Promise<string | null> {
  const dest = join(ICONS_CACHE, 'si', `${slug}.svg`)
  try { await access(dest); return `/icons/si/${slug}.svg` } catch { /* not cached */ }

  try {
    const si = await import('simple-icons')
    const key = `si${slug.charAt(0).toUpperCase()}${slug.slice(1).replace(/-([a-z])/g, (_: string, c: string) => c.toUpperCase())}`
    const icon = (si as Record<string, { svg: string } | undefined>)[key]
    if (!icon) { warn(`simple-icons: '${slug}' not found`); return null }
    await writeFile(dest, icon.svg)
    log(`✓ si/${slug}.svg`)
    return `/icons/si/${slug}.svg`
  } catch (e) {
    warn(`simple-icons error for '${slug}': ${e}`)
    return null
  }
}

async function resolveCustomSvg(filename: string): Promise<string | null> {
  for (const base of [SHELL_ICONS, STATIC_ICONS]) {
    try {
      await access(join(base, filename))
      return `/api/icon?name=${encodeURIComponent(filename)}`
    } catch { /* try next */ }
  }
  warn(`custom svg '${filename}' not found`)
  return null
}

export interface IconDef {
  icon_svg?:    string
  icon_simple?: string
  icon_lucide?: string
}

export async function resolveIcon(def: IconDef): Promise<string | null> {
  if (def.icon_svg)    return resolveCustomSvg(def.icon_svg)
  if (def.icon_simple) return resolveSimple(def.icon_simple)
  if (def.icon_lucide) return resolveLucide(def.icon_lucide)
  return null
}

export async function resolveAllIcons<T extends object>(obj: T): Promise<T> {
  await ensureDirs()
  return resolveIconsInObject(obj) as Promise<T>
}

async function resolveIconsInObject(val: unknown): Promise<unknown> {
  if (Array.isArray(val)) {
    return Promise.all(val.map(resolveIconsInObject))
  }
  if (typeof val === 'object' && val !== null) {
    const obj = val as Record<string, unknown>
    const hasIcon = 'icon_svg' in obj || 'icon_simple' in obj || 'icon_lucide' in obj

    let iconPath: string | null = null
    if (hasIcon) {
      iconPath = await resolveIcon({
        icon_svg:    obj.icon_svg    as string | undefined,
        icon_simple: obj.icon_simple as string | undefined,
        icon_lucide: obj.icon_lucide as string | undefined,
      })
    }

    const resolved: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(obj)) {
      if (k === 'icon_svg' || k === 'icon_simple' || k === 'icon_lucide') continue
      resolved[k] = await resolveIconsInObject(v)
    }

    if (iconPath) resolved.icon_path = iconPath
    return resolved
  }
  return val
}