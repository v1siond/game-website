/**
 * Bake every ENTITY / person-variant / typed-enemy glyph the game's frontend catalog uses into a
 * pre-rendered Noto PNG, so a person or a monster draws as an IMAGE (identical on every OS) instead of
 * a live-rasterised glyph (Segoe on Windows, Noto on Linux…). Same pipeline as bake-emoji-tiles.mjs —
 * "render whatever emoji with whatever font, screenshot it, cut it" — but these tiles live in the
 * frontend catalog (src/game/data/entityTiles.json), NOT the DB tileset, so this writes only PNGs and
 * never rewrites emoji.json.
 *
 * The single source of what to bake is `entityTiles.json.tiles` (slug → glyph); artStyle.ts reads the
 * SAME file to point each catalog tile's `image` at `<dir>/<slug>.png`, so the bake set and the wired
 * images can never drift.
 *
 * Run (node 20 + playwright):
 *   node scripts/bake-entity-tiles.mjs
 */
import { fileURLToPath } from 'url'
import fs from 'fs'
import path from 'path'
import { bakeGlyph, openBakePage } from './lib/emoji-bake.mjs'

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DATA_JSON = process.env.ENTITY_TILES_JSON || path.join(REPO_ROOT, 'src/game/data/entityTiles.json')
const data = JSON.parse(fs.readFileSync(DATA_JSON, 'utf8'))
// The public dir the images live under (`data.dir` is the public URL prefix; strip the leading slash).
const OUT_DIR = process.env.OUT_DIR || path.join(REPO_ROOT, 'public', data.dir.replace(/^\//, ''))

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true })
  const { browser, page } = await openBakePage()

  const baked = []
  const skipped = []
  for (const [slug, char] of Object.entries(data.tiles)) {
    const res = await bakeGlyph(page, char)
    if (!res) {
      skipped.push(slug)
      console.warn(`  skip  ${slug} (${char}) — nothing inked`)
      continue
    }
    fs.writeFileSync(path.join(OUT_DIR, `${slug}.png`), Buffer.from(res.url.split(',')[1], 'base64'))
    baked.push(slug)
    const flat = res.colored / res.inked < 0.05 ? ' [monochrome — verify]' : ''
    console.log(`  bake  ${slug.padEnd(12)} ${char}  bbox ${res.bbox.join('x')}${flat}`)
  }

  await browser.close()
  console.log(`\nbaked ${baked.length} entity tiles → ${OUT_DIR}`)
  if (skipped.length) console.log(`skipped (no ink): ${skipped.join(', ')}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
