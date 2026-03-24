import { readFile } from 'fs/promises'
import { join, normalize } from 'path'
import type { RequestHandler } from './$types'

const ICONS_CACHE = join('/tmp', 'junglami-shell', 'icons')

export const GET: RequestHandler = async ({ params }) => {
  const safe = normalize(params.path).replace(/^(\.\.[/\\])+/, '')
  if (!safe.endsWith('.svg')) return new Response('only svg', { status: 400 })

  try {
    const content = await readFile(join(ICONS_CACHE, safe), 'utf-8')
    return new Response(content, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600'
      }
    })
  } catch {
    return new Response('not found', { status: 404 })
  }
}