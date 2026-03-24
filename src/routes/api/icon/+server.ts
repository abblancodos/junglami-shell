import { readFile } from 'fs/promises'
import { join, normalize, basename } from 'path'
import { homedir } from 'os'
import type { RequestHandler } from './$types'

const SHELL_ICONS  = join(homedir(), '.shell', 'icons')
const STATIC_ICONS = join(process.cwd(), 'static', 'icons')

export const GET: RequestHandler = async ({ url }) => {
  const name = url.searchParams.get('name')
  if (!name) return new Response('missing name', { status: 400 })

  const safe = basename(normalize(name))
  if (!safe.endsWith('.svg')) return new Response('only svg allowed', { status: 400 })

  for (const base of [SHELL_ICONS, STATIC_ICONS]) {
    try {
      const content = await readFile(join(base, safe), 'utf-8')
      return new Response(content, {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=3600'
        }
      })
    } catch { /* try next */ }
  }

  return new Response('not found', { status: 404 })
}