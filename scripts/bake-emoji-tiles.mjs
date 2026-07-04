/**
 * Bake every emoji tile in the DB tileset into a pre-rendered PNG, so a tile draws as an IMAGE
 * (identical on every OS) instead of a live-rasterised glyph (Segoe on Windows, Noto on Linux…).
 *
 * The pipeline is exactly the user's ask: "render whatever emoji with whatever font, screenshot it,
 * cut it". For each entry in emoji.json whose `char` is an emoji, we rasterise the glyph with the
 * installed Noto Color Emoji font in headless Chromium, trim to the inked bounding box, and fit it
 * centred into a transparent 256×256 square. 256 is the single accepted baseline — it downscales
 * crisply and the renderers already scale a tile image to whatever the view needs.
 *
 * We then point each baked entry's `image` at `/tiles/emoji/baked/<key>.png` so the renderer's
 * already-wired image path (resolveVisual → resolveDraw → drawStyledImage) takes over from fillText.
 * Keeping that path convention here (one place) is why the generator owns the emoji.json write.
 *
 * Run (node 20 + playwright):
 *   NODE_PATH=/home/visiond/projects/game-engine/game-website/node_modules \
 *     node scripts/bake-emoji-tiles.mjs
 *
 * Config via env: TILESET_JSON (source+target tileset), OUT_DIR (png output), FONT (css family),
 * WRITE_JSON=0 to bake without rewriting the tileset.
 */
import { createRequire } from 'module'
import { fileURLToPath } from 'url'
import fs from 'fs'
import path from 'path'

const require = createRequire(import.meta.url)
const { chromium } = require('playwright')

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

// The DB tileset the nebulith backend seeds from — the source of the tiles AND the file we point
// at the baked PNGs. Overridable for a different checkout.
const TILESET_JSON =
  process.env.TILESET_JSON ||
  '/home/visiond/projects/game-engine/nebulith/priv/repo/tilesets/emoji.json'
const OUT_DIR = process.env.OUT_DIR || path.join(REPO_ROOT, 'public/tiles/emoji/baked')
// The public URL the tileset entry points at (OUT_DIR served from /public).
const PUBLIC_PREFIX = process.env.PUBLIC_PREFIX || '/tiles/emoji/baked'
// Force Noto so the bake is the SAME art on every machine (never the host's default emoji font).
const FONT = process.env.FONT || '"Noto Color Emoji"'
const WRITE_JSON = process.env.WRITE_JSON !== '0'

const RENDER = 512 // rasterise big, then trim + downscale → a smooth 256 tile
const OUT = 256 // the baked tile size (the accepted baseline)
const PAD = 6 // a hair of transparent margin so a glyph never clips the tile edge

// The same classifier the renderer uses to decide "this is an emoji" (shared.ts isWeaponEmoji).
const isEmoji = (char) => typeof char === 'string' && /\p{Extended_Pictographic}/u.test(char)

/**
 * Rasterise one glyph, trim to its inked bbox, and fit it centred into a transparent OUT×OUT canvas.
 * Runs in the page so it can use the real canvas text + image APIs. Returns a PNG data URL, or null
 * when nothing inked (a glyph the font can't draw) so the caller can flag it instead of writing a blank.
 */
async function bakeGlyph(page, char) {
  return page.evaluate(
    async ({ char, FONT, RENDER, OUT, PAD }) => {
      await document.fonts.ready
      const src = document.createElement('canvas')
      src.width = src.height = RENDER
      const sctx = src.getContext('2d')
      sctx.clearRect(0, 0, RENDER, RENDER)
      sctx.textAlign = 'center'
      sctx.textBaseline = 'middle'
      sctx.font = `${Math.round(RENDER * 0.8)}px ${FONT}`
      sctx.fillText(char, RENDER / 2, RENDER / 2)

      // Inked bounding box from the alpha channel — trims the em-box whitespace so the glyph is centred
      // by its own pixels (fillText centres the em box, which is not the glyph's visual centre).
      const data = sctx.getImageData(0, 0, RENDER, RENDER).data
      let minX = RENDER, minY = RENDER, maxX = -1, maxY = -1, inked = 0, colored = 0
      for (let y = 0; y < RENDER; y++) {
        for (let x = 0; x < RENDER; x++) {
          const i = (y * RENDER + x) * 4
          if (data[i + 3] <= 8) continue
          inked++
          if (x < minX) minX = x
          if (x > maxX) maxX = x
          if (y < minY) minY = y
          if (y > maxY) maxY = y
          const r = data[i], g = data[i + 1], b = data[i + 2]
          if (Math.max(r, g, b) - Math.min(r, g, b) > 30) colored++
        }
      }
      if (maxX < 0) return null // nothing rendered

      const bw = maxX - minX + 1
      const bh = maxY - minY + 1
      const out = document.createElement('canvas')
      out.width = out.height = OUT
      const octx = out.getContext('2d')
      octx.imageSmoothingEnabled = true
      octx.imageSmoothingQuality = 'high'
      const avail = OUT - PAD * 2
      const scale = Math.min(avail / bw, avail / bh)
      const dw = bw * scale, dh = bh * scale
      octx.drawImage(src, minX, minY, bw, bh, (OUT - dw) / 2, (OUT - dh) / 2, dw, dh)
      return { url: out.toDataURL('image/png'), bbox: [bw, bh], inked, colored }
    },
    { char, FONT, RENDER, OUT, PAD },
  )
}

async function main() {
  const tileset = JSON.parse(fs.readFileSync(TILESET_JSON, 'utf8'))
  const targets = Object.entries(tileset).filter(([, tile]) => isEmoji(tile?.char))
  fs.mkdirSync(OUT_DIR, { recursive: true })

  const browser = await chromium.launch({ args: ['--no-sandbox'] })
  const page = await browser.newPage()

  const baked = []
  const skipped = []
  for (const [key, tile] of targets) {
    const res = await bakeGlyph(page, tile.char)
    if (!res) {
      skipped.push(key)
      console.warn(`  skip  ${key} (${tile.char}) — nothing inked`)
      continue
    }
    const file = path.join(OUT_DIR, `${key}.png`)
    fs.writeFileSync(file, Buffer.from(res.url.split(',')[1], 'base64'))
    if (WRITE_JSON) tile.image = `${PUBLIC_PREFIX}/${key}.png`
    baked.push(key)
    const flat = res.colored / res.inked < 0.05 ? ' [monochrome — verify]' : ''
    console.log(`  bake  ${key.padEnd(10)} ${tile.char}  bbox ${res.bbox.join('x')}${flat}`)
  }

  await browser.close()

  const nonEmoji = Object.keys(tileset).filter((k) => !isEmoji(tileset[k]?.char))
  if (WRITE_JSON) fs.writeFileSync(TILESET_JSON, JSON.stringify(tileset))

  console.log(`\nbaked ${baked.length} tiles → ${OUT_DIR}`)
  if (skipped.length) console.log(`skipped (no ink): ${skipped.join(', ')}`)
  if (nonEmoji.length) console.log(`non-emoji entries (untouched): ${nonEmoji.join(', ') || 'none'}`)
  console.log(WRITE_JSON ? `wrote image refs → ${TILESET_JSON}` : 'WRITE_JSON=0 — tileset unchanged')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
