import { join } from 'node:path'
import manifest from '../helpers/react-loadable-manifest.json'
import { readWorldPreloads, worldPreloadScript, worldPreloads, type LoadableManifest } from '@/lib/worlds/preload'
import { WORLD_IDS } from '@/lib/worlds/registry'
import { DEFAULT_THEME_ID, THEME_STORAGE_KEY } from '@/themes/themes'

// The manifest a `next build` wrote at 91be23e9 (the jspdf entries, keyed on node_modules paths, left out).
const BUILT: LoadableManifest = manifest
const HELPERS = join(process.cwd(), 'src', '__tests__', 'helpers')

const href = (file: string): string => `/_next/${file}`

// Runs the inline script on a fresh document with a stored world and a query string, and lists the
// preloads it added to the head as "as href".
const preloadsFor = (stored: string | null, search = ''): string[] => {
  const doc = document.implementation.createHTMLDocument()
  const storage = { getItem: (key: string) => (key === THEME_STORAGE_KEY ? stored : null) }
  new Function('localStorage', 'location', 'document', worldPreloadScript(worldPreloads(BUILT)))(storage, { search }, doc)
  return Array.from(doc.head.querySelectorAll('link[rel="preload"]')).map((link) => `${link.getAttribute('as')} ${link.getAttribute('href')}`)
}

describe('worldPreloads', () => {
  it('gives every world but the default the files of its chunk, as the paths the page loads them from', () => {
    const preloads = worldPreloads(BUILT)
    expect(Object.keys(preloads).sort()).toEqual(WORLD_IDS.filter((id) => id !== DEFAULT_THEME_ID).sort())
    expect(preloads['bold-noir']).toEqual([href('static/css/a0fb27463ec27918.css'), href('static/chunks/742.e31f35f7d52276bf.js')])
  })

  it('gives the default world nothing, since the page already ships it', () => {
    expect(worldPreloads(BUILT)[DEFAULT_THEME_ID]).toBeUndefined()
  })

  it('joins both imports of Medieval Fantasy, each file once', () => {
    expect(worldPreloads(BUILT)['medieval-fantasy']).toEqual([
      href('static/css/06abe549ad147692.css'),
      href('static/chunks/7975.0f4dd6dce0a55165.js'),
      href('static/css/c3d96717fbb8083c.css'),
      href('static/chunks/8928.5f2b4c1cd8a58960.js'),
      href('static/chunks/4448.94740a5bc5bc8fac.js'),
    ])
  })

  it('stops the build naming the import the manifest lacks', () => {
    const mythic = 'themes/worlds.ts -> @/components/themes/MythicTheme'
    const rest = Object.fromEntries(Object.entries(BUILT).filter(([key]) => key !== mythic))
    expect(() => worldPreloads(rest)).toThrow(mythic)
  })
})

describe('readWorldPreloads', () => {
  it('reads the manifest the production build wrote', async () => {
    const preloads = await readWorldPreloads('production', HELPERS)
    expect(preloads['mythic']).toEqual([href('static/css/9c6b28ce564aa8d1.css'), href('static/chunks/9240.53fab133e06c23a2.js')])
    expect(preloads).toEqual(worldPreloads(BUILT))
  })

  it('preloads nothing outside a production build, where no manifest of this build exists', async () => {
    expect(await readWorldPreloads('development', join(HELPERS, 'missing'))).toEqual({})
  })
})

describe('world preload script', () => {
  it('starts fetching a returning visitor\'s stored world, its script and its styles', () => {
    expect(preloadsFor('bold-noir')).toEqual([
      `style ${href('static/css/a0fb27463ec27918.css')}`,
      `script ${href('static/chunks/742.e31f35f7d52276bf.js')}`,
    ])
  })

  it('preloads nothing for a first time visitor', () => {
    expect(preloadsFor(null)).toEqual([])
  })

  it('preloads nothing when the stored world is the default the page already ships', () => {
    expect(preloadsFor(DEFAULT_THEME_ID)).toEqual([])
  })

  it('preloads nothing for a stored value that is no world, an inherited key included', () => {
    expect(preloadsFor('no-such-world')).toEqual([])
    expect(preloadsFor('__proto__')).toEqual([])
  })

  it('preloads the capture link\'s world over the stored one', () => {
    expect(preloadsFor('bold-noir', '?capture=mythic')).toEqual([
      `style ${href('static/css/9c6b28ce564aa8d1.css')}`,
      `script ${href('static/chunks/9240.53fab133e06c23a2.js')}`,
    ])
  })

  it('preloads nothing and throws nothing when storage is blocked', () => {
    const doc = document.implementation.createHTMLDocument()
    const storage = { getItem: () => { throw new Error('blocked') } }
    const run = new Function('localStorage', 'location', 'document', worldPreloadScript(worldPreloads(BUILT)))
    expect(() => run(storage, { search: '' }, doc)).not.toThrow()
    expect(doc.head.querySelectorAll('link').length).toBe(0)
  })
})
