// Regenerate the tileset SEEDS from the frontend's canonical data, so the DB is the SINGLE source the app
// (map + sidebar) reads — "nothing art-related on the frontend" (user directive) / "one source generates the
// rest" (TILE-VOCABULARY-CONTRACT). Emits BOTH:
//   • nebulith/priv/repo/tilesets/{emoji,ascii}.json  → seeded into the :4000 DB (what the app loads)
//   • src/game/data/tilesetSeed.json                  → the DB-EQUIVALENT snapshot jest loads (tests run
//                                                        against the same tileset the runtime does)
// It AUGMENTS art verbatim; it only ADDS the `category`+`title` the sidebar needs, the emoji CATALOG, and
// the ENTITY reskin tiles. `category` present == browseable in the sidebar; entities carry none (resolvable
// by visualForTileId for reskins, but never shown in the palette).
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const NEB = join(ROOT, '..', 'nebulith', 'priv', 'repo', 'tilesets')
const readJson = p => JSON.parse(readFileSync(p, 'utf8'))
const hasPng = img => existsSync(join(ROOT, 'public' + img))

// ── the canonical per-kind seed metadata (category / display label / ascii glyph) — ONE data file. ──
const kinds = readJson(join(ROOT, 'src', 'game', 'data', 'tileKinds.json'))
const CATEGORY_OF = {}, KIND_LABEL = {}, ASCII_GLYPH = {}
for (const [k, m] of Object.entries(kinds)) {
  CATEGORY_OF[k] = m.category; KIND_LABEL[k] = m.label
  if (m.ascii !== undefined) ASCII_GLYPH[k] = m.ascii
}

const catalog = readJson(join(ROOT, 'src', 'game', 'data', 'emojiCatalog.json'))
const bakedCat = new Set(catalog.baked || [])
const entities = readJson(join(ROOT, 'src', 'game', 'data', 'entityTiles.json'))

// ── EMOJI seed: base art verbatim + category/title; then the catalog; then the entity reskin tiles. ──
const emoji = readJson(join(NEB, 'emoji.json'))
// Base kinds present in the frontend default (emojiTileset.ts) but not yet in the DB seed — kept here so the
// seed stays a superset of the bundled default. `road` = the dark-gray town street (no baked PNG → its glyph).
const EXTRA_BASE = { road: { char: '⬛', color: '#3d3d44' } }
for (const [k, v] of Object.entries(EXTRA_BASE)) if (!emoji[k]) emoji[k] = { ...v }
let addedCat = 0, labelledBase = 0, addedEnt = 0
for (const kind of Object.keys(emoji)) {
  if (CATEGORY_OF[kind]) { emoji[kind].category = CATEGORY_OF[kind]; emoji[kind].title = KIND_LABEL[kind] ?? kind; labelledBase++ }
}
for (const [slug, t] of Object.entries(catalog.tiles)) {
  if (emoji[slug]) continue
  emoji[slug] = { char: t.char, color: t.color, category: t.category, title: t.label,
    ...(bakedCat.has(slug) ? { image: `${catalog.dir}/${slug}.png` } : {}),
    ...(t.height ? { height: t.height } : {}) }
  addedCat++
}
for (const [slug, glyph] of Object.entries(entities.tiles)) {
  if (emoji[slug]) continue // a browseable tile already owns this id — keep the canonical (categorised) one
  const img = `${entities.dir}/${slug}.png`
  // NO category → resolvable, not browseable. `color` is the geometry backing tint (every tile carries one).
  emoji[slug] = { char: glyph, color: '#d9a066', ...(hasPng(img) ? { image: img } : {}) }
  addedEnt++
}
// POSE tiles for the player animation seed (walk/run) — baked (scripts/bake-pose-tiles.mjs), NOT browseable:
// referenced by tileId from the animation frames (emoji:walk / emoji:run), never shown in the sidebar.
const POSES = { walk: '🚶', run: '🏃' }
let addedPose = 0
for (const [slug, glyph] of Object.entries(POSES)) {
  if (emoji[slug]) continue
  const img = `/tiles/emoji/baked/${slug}.png`
  emoji[slug] = { char: glyph, color: '#d9a066', ...(hasPng(img) ? { image: img } : {}) } // person tone backing tint
  addedPose++
}

// ── ASCII seed: per-kind browseable glyphs (category + title) into `tiles`; never clobber the swap-key `label`. ──
const ascii = readJson(join(NEB, 'ascii.json'))
ascii.tiles = ascii.tiles || {}
let addedAscii = 0, labelledAscii = 0
for (const [kind, glyph] of Object.entries(ASCII_GLYPH)) {
  const cat = CATEGORY_OF[kind]; if (!cat) continue
  if (ascii.tiles[kind]) { ascii.tiles[kind].category = cat; ascii.tiles[kind].title = KIND_LABEL[kind] ?? kind; labelledAscii++ }
  else { ascii.tiles[kind] = { label: kind, glyph, category: cat, title: KIND_LABEL[kind] ?? kind, position: 'single', walkable: true }; addedAscii++ }
}

// ── COMPOSITION tiles + templates (rich multi-cell ascii art: tree, house, fountain…) — the data-driven
// replacement for the hardcoded composeBuilding / make* factories. Seeded into the ascii tileset. ──
const comp = readJson(join(ROOT, 'src', 'game', 'data', 'compositions.json'))
// A composition is style-agnostic STRUCTURE; each part paints with the ACTIVE style's tile. So every part tile
// is seeded into BOTH tilesets under the SAME label — ascii renders its glyph, emoji renders its emoji.
const EMOJI_ROLE_COLOR = { canopy: '#5fae4f', trunk: '#7a5a3a' }
let addedCompTiles = 0
for (const [label, t] of Object.entries(comp.tiles)) {
  ascii.tiles[label] = { label, glyph: t.glyph, colorRole: t.colorRole, position: 'single', walkable: !!t.walkable }
  if (t.emoji) emoji[label] = { char: t.emoji, color: EMOJI_ROLE_COLOR[t.colorRole] ?? '#cccccc', colorRole: t.colorRole }
  addedCompTiles++
}
ascii.compositions = {}
for (const [kind, c] of Object.entries(comp.compositions)) {
  // Propagate each tile's `walkable` onto its composition CELL, so the runtime stamp (stampComposition) reads
  // collision per cell without re-looking-up the tile: a walkable canopy tile → a walkable cell, a blocking
  // trunk tile → a blocking cell.
  const cells = c.cells.map(cell => ({ ...cell, walkable: !!(comp.tiles[cell.label] && comp.tiles[cell.label].walkable) }))
  ascii.compositions[kind] = { footprint: c.footprint, cells }
}

writeFileSync(join(NEB, 'emoji.json'), JSON.stringify(emoji, null, 2) + '\n')
writeFileSync(join(NEB, 'ascii.json'), JSON.stringify(ascii, null, 2) + '\n')
writeFileSync(join(ROOT, 'src', 'game', 'data', 'tilesetSeed.json'), JSON.stringify({ emoji, ascii }, null, 2) + '\n')

console.log('EMOJI seed: base labelled', labelledBase, '| catalog +', addedCat, '| entities +', addedEnt, '| total', Object.keys(emoji).length)
console.log('ASCII seed: kind-glyphs +', addedAscii, '| overlaps labelled', labelledAscii, '| total tiles', Object.keys(ascii.tiles).length)
console.log('browseable (category) → emoji', Object.values(emoji).filter(t => t.category).length, '| ascii', Object.values(ascii.tiles).filter(t => t.category).length)
console.log('wrote: nebulith/priv/repo/tilesets/{emoji,ascii}.json + src/game/data/tilesetSeed.json')
