#!/usr/bin/env node
// Fails when a world's previews were not taken from its hero as it stands. The capture writes
// public/world-previews/stamp.json, per world a sha256 of its hero sources at that moment: everything under
// src/components/themes/<World>/, its <World>Theme.tsx and any <World>Theme*.module.css beside it, and
// src/styles/themes/<id>.css when it exists. This check hashes the same files again and names each world whose
// stamp is missing or differs, and each world with no 1440 lens still. It compares content only, so any clone
// or copy of the site (Netlify) reads the same, and a capture that writes the same bytes again still passes.
// It reads files only and never launches a browser; it runs as prebuild (npm run check:previews).
// Usage: node scripts/check-world-previews.mjs   (exit 0 all current, 1 names the stale worlds)
import { createHash } from 'node:crypto'
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const THEMES_DIR = 'src/components/themes'
const REGISTRY = 'src/themes/worlds.ts'
const STAMP = 'public/world-previews/stamp.json'

/** The still the check requires for a world: the 1440 px lens still. */
const stillOf = (id) => `public/world-previews/${id}-1440.webp`

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

/** Every file under a folder, as paths from the site root with forward slashes. */
const filesUnder = (dir) =>
  readdirSync(join(ROOT, dir), { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => join(entry.parentPath, entry.name).slice(ROOT.length).split('\\').join('/'))

/** The hero sources of a world that exist in the tree, as paths from the site root. */
function heroSources({ id, name }) {
  const folder = `${THEMES_DIR}/${name}`
  const modules = readdirSync(join(ROOT, THEMES_DIR))
    .filter((file) => file.startsWith(`${name}Theme`) && file.endsWith('.module.css'))
    .map((file) => `${THEMES_DIR}/${file}`)
  const files = [`${THEMES_DIR}/${name}Theme.tsx`, `src/styles/themes/${id}.css`].filter((path) => existsSync(join(ROOT, path)))
  const nested = existsSync(join(ROOT, folder)) ? filesUnder(folder) : []
  return [...nested, ...files, ...modules]
}

/**
 * The sha256 of a world's hero sources, lowercase hex: each file, in sorted path order, fed as its path, a
 * NUL, its bytes and a NUL, so a renamed or moved file changes it as much as an edited one.
 */
export function heroHash(world) {
  const hash = createHash('sha256')
  for (const path of heroSources(world).sort()) {
    hash.update(path)
    hash.update('\0')
    hash.update(readFileSync(join(ROOT, path)))
    hash.update('\0')
  }
  return hash.digest('hex')
}

/** Writes stamp.json with every world's hero hash, in registry order; the capture calls it once all shots are written. */
export function writeStamp() {
  const stamp = Object.fromEntries(readWorlds().map((world) => [world.id, heroHash(world)]))
  writeFileSync(join(ROOT, STAMP), `${JSON.stringify(stamp, null, 2)}\n`)
}

// No stamp yet reads as an empty one, so every world is named rather than the check throwing.
const readStamp = () => (existsSync(join(ROOT, STAMP)) ? JSON.parse(readFileSync(join(ROOT, STAMP), 'utf8')) : {})

/** Why a world's previews are stale, or null when they are current. */
function staleness(world, stamp) {
  if (!existsSync(join(ROOT, stillOf(world.id)))) return 'no still'
  if (stamp[world.id] !== heroHash(world)) return 'hero changed since its capture'
  return null
}

function main() {
  const stamp = readStamp()
  const stale = readWorlds()
    .map((world) => ({ id: world.id, why: staleness(world, stamp) }))
    .filter(({ why }) => why !== null)
  if (stale.length === 0) {
    console.log('world previews: every lens still is current')
    return 0
  }
  console.error('world previews are stale, run node scripts/capture-world-previews.mjs:')
  stale.forEach(({ id, why }) => console.error(`${id} (${why})`))
  return 1
}

// Run as a script, not when the capture imports readWorlds and writeStamp.
const isEntry = process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href
if (isEntry) process.exit(main())
