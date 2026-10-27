#!/usr/bin/env node
// Captures every world's hero from a running site (the `?capture=<id>` override in ThemeContext) with the
// project's Playwright and writes, per world, into public/world-previews/:
//   <id>.webp            the picker card, 1280 by 800 resized to 720 wide (WorldCard)
//   <id>-1440.webp       the lens still at 1440 by 900 (WorldLens on a wide screen)
//   <id>-390.webp        the lens still at 390 by 844 (WorldLens on a phone)
//   portraits/<id>.webp  his figure, the box of the [data-worlds-figure] element (the launcher's face)
// and focus.json, the centre of that figure in each still when it is drawn on screen there, where the lens looks;
// a figure further down is scrolled to for the portrait only. The launcher is hidden in every shot. Once every
// world's shots are written it writes stamp.json, each world's hero hash (writeStamp in
// scripts/check-world-previews.mjs); a run that exits 1 leaves it as it was. Run it again after changing a hero
// and commit stamp.json with the previews; scripts/check-world-previews.mjs fails the build until then.
// One headless browser on the box at a time: it refuses to start while another one runs, and closes its own.
// Usage: node scripts/capture-world-previews.mjs [base]   (default http://localhost:4100)
import { execFileSync } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from '@playwright/test'
import { readWorlds, writeStamp } from './check-world-previews.mjs'

const BASE = process.argv[2] ?? 'http://localhost:4100'
const OUT = fileURLToPath(new URL('../public/world-previews/', import.meta.url))
const PORTRAITS = join(OUT, 'portraits')

// The heroes run their entrance reveals in their first seconds; the shot waits for them to end.
const SETTLE_MS = 4500

const CARD = { viewport: { width: 1280, height: 800 }, outWidth: 720, quality: 0.78 }
const STILLS = [
  { width: 1440, context: { viewport: { width: 1440, height: 900 } } },
  { width: 390, context: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
]
const STILL_QUALITY = 0.8
// The face shows the portrait at 40 px; 160 px keeps it sharp on a 4x screen and near 15 KB.
const PORTRAIT_BOX = 160
const PORTRAIT_QUALITY = 0.82

const FIGURE = '[data-worlds-figure]'
// The launcher and, on a dev server, the Next.js dev indicator stay out of every shot.
const HIDE_CHROME = '[data-worlds-lens-group], nextjs-portal { visibility: hidden !important; }'

/** True while a headless Chromium of any process runs. */
function browserRunning() {
  const found = (name) => {
    try {
      return execFileSync('pgrep', ['-x', name], { encoding: 'utf8' }).trim() !== ''
    } catch {
      return false
    }
  }
  return found('chrome-headless-shell') || found('chromium')
}

/**
 * Encodes a PNG as webp in the browser itself (canvas.toBlob), scaled to fit `maxWidth` by `maxHeight`, so
 * the capture needs nothing beyond Playwright.
 */
async function toWebp(encoder, png, { maxWidth, maxHeight = Infinity, quality }) {
  const base64 = await encoder.evaluate(
    async ({ data, maxWidth, maxHeight, quality }) => {
      const image = new Image()
      image.src = `data:image/png;base64,${data}`
      await image.decode()
      const scale = Math.min(1, maxWidth / image.naturalWidth, maxHeight / image.naturalHeight)
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(image.naturalWidth * scale)
      canvas.height = Math.round(image.naturalHeight * scale)
      const context = canvas.getContext('2d')
      context.imageSmoothingQuality = 'high'
      context.drawImage(image, 0, 0, canvas.width, canvas.height)
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', quality))
      const bytes = new Uint8Array(await blob.arrayBuffer())
      let binary = ''
      bytes.forEach((byte) => {
        binary += String.fromCharCode(byte)
      })
      return btoa(binary)
    },
    { data: png.toString('base64'), maxWidth, maxHeight, quality },
  )
  return Buffer.from(base64, 'base64')
}

/** Opens a world's hero in a fresh context (no stored world, no hint, no face) and waits for it to settle. */
async function openHero(browser, id, contextOptions) {
  const context = await browser.newContext({ ...contextOptions, deviceScaleFactor: 1 })
  const page = await context.newPage()
  await page.goto(`${BASE}/?capture=${id}`, { waitUntil: 'load' })
  await page.addStyleTag({ content: HIDE_CHROME })
  await page.waitForFunction(() => !document.documentElement.hasAttribute('data-world-pending'))
  await page.waitForTimeout(SETTLE_MS)
  return { context, page }
}

// The figure's centre in the still, kept inside it so the lens never looks past the shot's edge.
const centreIn = (box, { width, height }) => [
  Math.round(Math.min(width, Math.max(0, box.x + box.width / 2))),
  Math.round(Math.min(height, Math.max(0, box.y + box.height / 2))),
]

// Some figures appear only further down the page: Dark Fantasy's knights render once Work Experience
// scrolls in, Medieval Fantasy's frost figure fades in from opacity 0 as the page scrolls. The portrait
// scrolls down until a figure is laid out, on screen and fully drawn, at most this many steps.
const REVEAL_STEPS = 40
const STEP_WAIT_MS = 600
// After a figure is found drawn, its own entrance (a slash, a fade) gets this long to end before the crop.
const FIGURE_SETTLE_MS = 1200

/**
 * The first [data-worlds-figure] element with a box of its own, as { index, box, onScreen, drawn }: drawn
 * when it, and every element around it, is fully opaque and visible. Null when none is laid out.
 */
const figureNow = (page) =>
  page.evaluate((selector) => {
    const figures = [...document.querySelectorAll(selector)]
    const index = figures.findIndex((element) => {
      const { width, height } = element.getBoundingClientRect()
      return width >= 8 && height >= 8
    })
    if (index === -1) return null
    const element = figures[index]
    const rect = element.getBoundingClientRect()
    let opacity = 1
    for (let node = element; node; node = node.parentElement) opacity *= Number(getComputedStyle(node).opacity)
    const onScreen = rect.bottom > 0 && rect.top < window.innerHeight && rect.right > 0 && rect.left < window.innerWidth
    const drawn = opacity > 0.95 && element.checkVisibility({ visibilityProperty: true })
    return { index, box: { x: rect.x, y: rect.y, width: rect.width, height: rect.height }, onScreen, drawn }
  }, FIGURE)

/** Scrolls until a figure is on screen and fully drawn, then returns it, or null at the page's end. */
async function revealFigure(page) {
  for (let step = 0; step < REVEAL_STEPS; step += 1) {
    const figure = await figureNow(page)
    if (figure?.onScreen && figure.drawn) {
      await page.waitForTimeout(FIGURE_SETTLE_MS)
      return figureNow(page)
    }
    if (figure && !figure.onScreen) {
      await page.evaluate(([selector, index]) => document.querySelectorAll(selector)[index].scrollIntoView({ block: 'center' }), [FIGURE, figure.index])
      await page.waitForTimeout(STEP_WAIT_MS)
      continue
    }
    await page.mouse.wheel(0, Math.round(page.viewportSize().height / 2))
    await page.waitForTimeout(STEP_WAIT_MS)
  }
  return null
}

/** Writes his portrait from the 1440 page, cropped to his figure's box; false when no figure ever showed. */
// A figure that idles (Silhouette's) is never still, so the crop is a clip of the page at that moment rather
// than an element screenshot, which waits for the element to stop moving. The clip keeps to the screen.
const clipOn = (box, { width, height }) => {
  const x = Math.max(0, box.x)
  const y = Math.max(0, box.y)
  return { x, y, width: Math.min(width, box.x + box.width) - x, height: Math.min(height, box.y + box.height) - y }
}

// For the crop only his figure is drawn, on a transparent ground (the face sets him on the launcher's fill),
// so no text or scene art that lies over or beside him (Survival Horror's panels pass in front of him) ends
// up in his portrait.
const ISOLATE = 'html, body { background: transparent !important; } body * { visibility: hidden !important; } [data-worlds-portrait], [data-worlds-portrait] * { visibility: visible !important; }'

async function capturePortrait(page, encoder, id) {
  const found = await revealFigure(page)
  if (!found) return false
  await page.evaluate(([selector, index]) => document.querySelectorAll(selector)[index].setAttribute('data-worlds-portrait', ''), [FIGURE, found.index])
  await page.addStyleTag({ content: ISOLATE })
  const figure = await figureNow(page)
  const png = await page.screenshot({ clip: clipOn(figure.box, page.viewportSize()), omitBackground: true })
  writeFileSync(join(PORTRAITS, `${id}.webp`), await toWebp(encoder, png, { maxWidth: PORTRAIT_BOX, maxHeight: PORTRAIT_BOX, quality: PORTRAIT_QUALITY }))
  return true
}

async function captureWorld(browser, encoder, id) {
  const card = await openHero(browser, id, { viewport: CARD.viewport })
  writeFileSync(join(OUT, `${id}.webp`), await toWebp(encoder, await card.page.screenshot(), { maxWidth: CARD.outWidth, quality: CARD.quality }))
  await card.context.close()

  const focus = {}
  let portrait = false
  for (const { width, context: options } of STILLS) {
    const { context, page } = await openHero(browser, id, options)
    writeFileSync(join(OUT, `${id}-${width}.webp`), await toWebp(encoder, await page.screenshot(), { maxWidth: width, quality: STILL_QUALITY }))
    const figure = await figureNow(page)
    if (figure?.onScreen && figure.drawn) focus[width] = centreIn(figure.box, options.viewport)
    if (width === 1440) portrait = await capturePortrait(page, encoder, id)
    await context.close()
  }
  return { focus, portrait }
}

async function main() {
  if (browserRunning()) {
    console.error('A headless browser is already running on this box; wait for it to end, then run the capture again.')
    return 1
  }
  mkdirSync(PORTRAITS, { recursive: true })
  const browser = await chromium.launch()
  try {
    const encoder = await browser.newPage()
    const focus = {}
    const missing = []
    for (const { id } of readWorlds()) {
      console.log(`capturing ${id}`)
      const result = await captureWorld(browser, encoder, id)
      if (Object.keys(result.focus).length > 0) focus[id] = result.focus
      if (!result.portrait) missing.push(id)
    }
    writeFileSync(join(OUT, 'focus.json'), `${JSON.stringify(focus, null, 2)}\n`)
    if (missing.length === 0) {
      writeStamp()
      console.log(`done: ${OUT}`)
      return 0
    }
    console.error(`no ${FIGURE} element, so no portrait, for: ${missing.join(', ')}`)
    return 1
  } finally {
    await browser.close()
  }
}

process.exit(await main())
