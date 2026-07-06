/**
 * Bake every emoji CATALOG tile (the Library's terrain/nature/buildings/units glyphs) into a Noto PNG,
 * so every placeable tile draws as an IMAGE (tintable/resizable, identical on every OS) instead of a
 * live glyph. Same pipeline as bake-emoji-tiles.mjs / bake-entity-tiles.mjs.
 *
 * Single source: `src/game/data/emojiCatalog.json` (slug → {category,label,char,color}) drives BOTH this
 * bake and artStyle.ts's image wiring (via bakedCatalogImage), so the bake set and the wired images can
 * never drift. Adding a tile = add it to emojiCatalog.json + rerun this.
 *
 * Run (node 20 + playwright):
 *   node scripts/bake-catalog-tiles.mjs
 */
import { fileURLToPath } from 'url'
import fs from 'fs'
import path from 'path'
import { bakeGlyph, openBakePage } from './lib/emoji-bake.mjs'

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DATA_JSON = process.env.CATALOG_JSON || path.join(REPO_ROOT, 'src/game/data/emojiCatalog.json')
const data = JSON.parse(fs.readFileSync(DATA_JSON, 'utf8'))
const OUT_DIR = process.env.OUT_DIR || path.join(REPO_ROOT, 'public', data.dir.replace(/^\//, ''))

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true })
  const { browser, page } = await openBakePage()

  const baked = []
  const skipped = []
  for (const [slug, tile] of Object.entries(data.tiles)) {
    const res = await bakeGlyph(page, tile.char)
    if (!res) {
      skipped.push(slug)
      console.warn(`  skip  ${slug} (${tile.char}) — nothing inked`)
      continue
    }
    fs.writeFileSync(path.join(OUT_DIR, `${slug}.png`), Buffer.from(res.url.split(',')[1], 'base64'))
    baked.push(slug)
    const flat = res.colored / res.inked < 0.05 ? ' [monochrome — verify]' : ''
    console.log(`  bake  ${slug.padEnd(16)} ${tile.char}  bbox ${res.bbox.join('x')}${flat}`)
  }

  await browser.close()
  // Record which slugs actually baked so artStyle's bakedCatalogImage never points at a missing PNG
  // (a few newer emoji the installed Noto can't ink get skipped and stay glyphs).
  data.baked = baked.sort()
  fs.writeFileSync(DATA_JSON, JSON.stringify(data, null, 2) + '\n')
  console.log(`\nbaked ${baked.length} catalog tiles → ${OUT_DIR}`)
  if (skipped.length) console.log(`skipped (no ink): ${skipped.join(', ')}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
