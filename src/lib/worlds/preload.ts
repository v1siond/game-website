import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { DEFAULT_THEME_ID, THEME_STORAGE_KEY } from '@/themes/themes'
import { WORLD_IDS } from './registry'

// A returning visitor's stored world is its own chunk (src/themes/worlds.ts), which the page would only
// request after hydration, once ThemeProvider has read the stored id. The home page is built once, so
// the server cannot know that id; instead it writes every world's chunk files into an inline script,
// which preloads the stored world's files while the HTML is still being parsed.
//
// The file names come from the react-loadable-manifest.json that `next build` writes before it renders
// the pages: Next keys each dynamic() import there as "<importing file under src> -> <specifier>".

export type LoadableManifest = Record<string, { files: readonly string[] }>

/** World id -> the URLs of its chunk's scripts and styles. */
export type WorldPreloads = Record<string, string[]>

const IMPORTER = 'themes/worlds.ts'

// The import() specifiers of each world's dynamic() in src/themes/worlds.ts. A renamed specifier leaves
// its manifest key missing and worldPreloads stops the build; a world added without its entry here
// stops it too.
const WORLD_IMPORTS: Record<string, readonly string[]> = {
  'dark-fantasy': ['@/components/themes/DarkFantasyTheme'],
  'survival-horror': ['@/components/themes/SurvivalHorrorTheme'],
  'neon-portals': ['@/components/themes/NeonPortalsTheme'],
  'soul-map': ['@/components/themes/SoulMapTheme'],
  'adventure-paths': ['@/components/themes/AdventurePathsTheme'],
  'rubber-hose': ['@/components/themes/RubberHoseTheme'],
  'retro-rpg': ['@/components/themes/RetroRPGTheme'],
  'bold-noir': ['@/components/themes/BoldNoirTheme'],
  'fighter-select': ['@/components/themes/FighterSelectTheme'],
  'art-deco': ['@/components/themes/ArtDecoTheme'],
  'retro-atomic': ['@/components/themes/RetroAtomicTheme'],
  'neon-cyber': ['@/components/themes/NeonCyberTheme'],
  'cell-shaded': ['@/components/themes/CellShadedTheme'],
  'silhouette': ['@/components/themes/SilhouetteTheme'],
  'tropical-platformer': ['@/components/themes/TropicalPlatformerTheme'],
  'medieval-fantasy': ['@/components/themes/MedievalFantasyTheme', '@/components/themes/shared/professionStage'],
}

// Where the page loads a build file from, the way Next's own PreloadChunks writes it (no assetPrefix is set).
const urlOf = (file: string): string => `/_next/${file.split('/').map(encodeURIComponent).join('/')}`

const filesOf = (manifest: LoadableManifest, specifier: string): readonly string[] => {
  const key = `${IMPORTER} -> ${specifier}`
  const entry = manifest[key]
  if (!entry) throw new Error(`preload.ts: react-loadable-manifest.json has no "${key}"`)
  return entry.files
}

const importsOf = (id: string): readonly string[] => {
  const specifiers = WORLD_IMPORTS[id]
  if (!specifiers) throw new Error(`preload.ts: no import registered for world "${id}"`)
  return specifiers
}

/** Every world but the default (the page ships it) with the URLs of its chunk files, each file once. */
export function worldPreloads(manifest: LoadableManifest): WorldPreloads {
  const ids = WORLD_IDS.filter((id) => id !== DEFAULT_THEME_ID)
  return Object.fromEntries(
    ids.map((id) => [id, [...new Set(importsOf(id).flatMap((specifier) => filesOf(manifest, specifier)))].map(urlOf)]),
  )
}

const MANIFEST = 'react-loadable-manifest.json'
const BUILD_DIR = join(process.cwd(), '.next')

/** The preloads of this build. Only `next build` writes a manifest of the chunks it serves, so any other
 *  environment (the dev server) preloads nothing. */
export async function readWorldPreloads(env: string | undefined, buildDir: string = BUILD_DIR): Promise<WorldPreloads> {
  if (env !== 'production') return {}
  return worldPreloads(JSON.parse(await readFile(join(buildDir, MANIFEST), 'utf8')))
}

// Runs inline before the world markup is parsed, like worldPending.ts. It picks the world the way
// ThemeProvider does (a `?capture=` id first, then the stored id) and adds a preload per file, so the
// chunk is fetched while the page loads and ThemeProvider finds it ready. A first time visitor has
// nothing stored and gets no preload.
export const worldPreloadScript = (preloads: WorldPreloads): string =>
  `try{var p=${JSON.stringify(preloads)};var w=new URLSearchParams(location.search).get('capture')||localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});var f=Object.prototype.hasOwnProperty.call(p,w)?p[w]:[];for(var i=0;i<f.length;i++){var l=document.createElement('link');l.rel='preload';l.setAttribute('as',/\\.css$/.test(f[i])?'style':'script');l.href=f[i];document.head.appendChild(l)}}catch(e){}`
