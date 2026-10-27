#!/usr/bin/env node
// Fails when a world's lens still is older than its hero. For each world it compares the last commit time
// (git log -1 --format=%ct) of the hero sources, everything under src/components/themes/<World>/, its
// <World>Theme.tsx and any <World>Theme*.module.css beside it, and src/styles/themes/<id>.css when it exists,
// with that of public/world-previews/<id>-1440.webp. A still that git does not track yet or lists as changed
// counts as newer than every committed source, so a fresh capture passes; a hero source listed as changed
// while its still is not counts as stale, and so does one changed in the tree after a changed still was
// written (file times, only for files both in the tree and not committed). Commit times otherwise, so a
// fresh clone (Netlify) reads the same. It only reads git and never launches a browser; it runs as prebuild (npm run check:previews).
// Usage: node scripts/check-world-previews.mjs   (exit 0 all current, 1 names the stale worlds)
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const THEMES_DIR = 'src/components/themes'
const REGISTRY = 'src/themes/worlds.ts'

/** The still the check reads for a world: the 1440 px lens still, the last one the capture writes. */
export const stillOf = (id) => `public/world-previews/${id}-1440.webp`

// One `'<id>': <Name>Theme,` line per world in COMPONENT_BY_ID, the registry every world is mounted from.
const ENTRY = /^\s*'([a-z-]+)':\s*([A-Za-z]+)Theme,\s*$/gm

/** Every world as { id, name }, name being the folder and file stem of its hero (RetroRPG for retro-rpg). */
export function readWorlds() {
  const source = readFileSync(join(ROOT, REGISTRY), 'utf8')
  const block = source.slice(source.indexOf('COMPONENT_BY_ID'))
  const worlds = [...block.slice(0, block.indexOf('}')).matchAll(ENTRY)].map(([, id, name]) => ({ id, name }))
  if (worlds.length === 0) throw new Error(`${REGISTRY}: no worlds found in COMPONENT_BY_ID`)
  return worlds
}

const git = (args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim()

/** The hero sources of a world that exist in the tree, as paths from the site root. */
function heroSources({ id, name }) {
  const modules = readdirSync(join(ROOT, THEMES_DIR))
    .filter((file) => file.startsWith(`${name}Theme`) && file.endsWith('.module.css'))
    .map((file) => `${THEMES_DIR}/${file}`)
  const candidates = [`${THEMES_DIR}/${name}/`, `${THEMES_DIR}/${name}Theme.tsx`, `src/styles/themes/${id}.css`]
  return [...candidates.filter((path) => existsSync(join(ROOT, path))), ...modules]
}

// git status prints paths from the repository root; the site may sit below it.
function changedPaths() {
  const prefix = git(['rev-parse', '--show-prefix'])
  const lines = git(['status', '--porcelain', '--untracked-files=all', '--', '.']).split('\n').filter(Boolean)
  return lines
    .map((line) => line.slice(3).split(' -> ').pop().replace(/^"|"$/g, ''))
    .filter((path) => path.startsWith(prefix))
    .map((path) => path.slice(prefix.length))
}

const covers = (path, file) => file === path || (path.endsWith('/') && file.startsWith(path))

const isChanged = (changed, path) => changed.some((file) => covers(path, file))

// A file deleted in the tree has no time; it counts as changed now.
const modifiedAt = (path) => (existsSync(join(ROOT, path)) ? statSync(join(ROOT, path)).mtimeMs : Infinity)

const commitTime = (paths) => Number(git(['log', '-1', '--format=%ct', '--', ...paths]) || 0)

/** Why a world's still is stale, or null when it is current. */
function staleness(world, changed) {
  const still = stillOf(world.id)
  if (!existsSync(join(ROOT, still))) return 'no still'
  const sources = heroSources(world)
  const changedSources = changed.filter((file) => sources.some((path) => covers(path, file)))
  const stillChanged = isChanged(changed, still)
  if (!stillChanged && changedSources.length > 0) return 'hero changed, still not'
  if (stillChanged && changedSources.some((file) => modifiedAt(file) > modifiedAt(still))) return 'hero changed after its still'
  if (stillChanged) return null
  if (commitTime(sources) > commitTime([still])) return 'hero committed after its still'
  return null
}

function main() {
  const changed = changedPaths()
  const stale = readWorlds()
    .map((world) => ({ id: world.id, why: staleness(world, changed) }))
    .filter(({ why }) => why !== null)
  if (stale.length === 0) {
    console.log('world previews: every lens still is current')
    return 0
  }
  console.error('world previews are stale, run node scripts/capture-world-previews.mjs:')
  stale.forEach(({ id, why }) => console.error(`${id} (${why})`))
  return 1
}

// Run as a script, not when the capture imports readWorlds and stillOf.
const isEntry = process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href
if (isEntry) process.exit(main())
