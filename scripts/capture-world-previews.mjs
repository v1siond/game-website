#!/usr/bin/env node
// Captures every world's hero from a running site (the `?capture=<id>` override in ThemeContext) with the
// project's Playwright and writes, per world, into public/world-previews/:
//   <id>.webp            the picker card, 1280 by 800 resized to 720 wide (WorldCard)
//   <id>-1440.webp       the lens still at 1440 by 900 (WorldLens on a wide screen)
//   <id>-390.webp        the lens still at 390 by 844 (WorldLens on a phone)
//   portraits/<id>.webp  his figure, the box of the [data-worlds-figure] element (the launcher's face)
// and focus.json, the centre of that figure in each still, where the lens looks. Every still shows him drawn
// (readyStill): at first paint, or where the scroll first draws him; a world whose figure is laid out but never
// drawn exits 1, named. The launcher and the hint are hidden in every shot. Once every world's shots are
// written it writes stamp.json, each world's hero hash (writeStamp in scripts/check-world-previews.mjs); a run
// that exits 1 leaves it as it was. Run it again after changing a hero and commit stamp.json with the
// previews; scripts/check-world-previews.mjs fails the build until then.
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
// The launcher, the worlds hint (a still scrolled to him can open it) and, on a dev server, the Next.js dev
// indicator stay out of every shot.
const HIDE_CHROME = '[data-worlds-lens-group], [data-worlds-hint], nextjs-portal { visibility: hidden !important; }'

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
// scrolls in, Medieval Fantasy's frost figure fades in from opacity 0 as the page scrolls and sits behind the
// content panels on a phone. The search scrolls half a screen at a time until he is drawn, at most this many
// steps (Medieval Fantasy at 390 shows only near the page's end, about 33 half screens down).
const REVEAL_STEPS = 60
const STEP_WAIT_MS = 600
// Drawn means his opacity is settled and above 0 and at least this share of his own pixels shows in the shot
// (DECISION C38-13): a figure fading in, or painted under a panel, is not drawn.
const SHOWN_SHARE_MIN = 0.3
// A pixel is his when drawn alone its alpha is above this, and it shows when hiding him changes its red, green
// and blue by more than this in all.
const PIXEL_DELTA = 24

/**
 * The first [data-worlds-figure] element with a box of its own, as { index, box, onScreen, visible, opacity,
 * animating }: opacity multiplied through it and every element around it, animating while an animation or a
 * transition runs on any of them. Null when none is laid out.
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
    let animating = false
    for (let node = element; node; node = node.parentElement) {
      opacity *= Number(getComputedStyle(node).opacity)
      animating ||= node.getAnimations().some((animation) => animation.playState === 'running')
    }
    const onScreen = rect.bottom > 0 && rect.top < window.innerHeight && rect.right > 0 && rect.left < window.innerWidth
    const visible = element.checkVisibility({ visibilityProperty: true })
    return { index, box: { x: rect.x, y: rect.y, width: rect.width, height: rect.height }, onScreen, visible, opacity, animating }
  }, FIGURE)

// A figure that idles (Silhouette's) is never still, so the crop and the shown share are a clip of the page at that moment rather
// than an element screenshot, which waits for the element to stop moving. The clip keeps to the screen.
const clipOn = (box, { width, height }) => {
  const x = Math.max(0, box.x)
  const y = Math.max(0, box.y)
  return { x, y, width: Math.min(width, box.x + box.width) - x, height: Math.min(height, box.y + box.height) - y }
}

// Only the element marked with `attribute` drawn, on a transparent ground: his portrait, and his own pixels
// for the shown share.
const drawnAlone = (attribute) =>
  `html, body { background: transparent !important; } body * { visibility: hidden !important; } [${attribute}], [${attribute}] * { visibility: visible !important; }`

/**
 * The share of his own pixels that the shot shows: of the pixels he paints when drawn alone, the share that
 * change when he alone is hidden on the page, scaled by the share of his box that is on the screen. A panel
 * painted over him keeps them from changing; a figure half past the screen's edge shows half of him at most.
 */
async function shownShare(page, figure) {
  const clip = clipOn(figure.box, page.viewportSize())
  if (clip.width < 1 || clip.height < 1) return 0
  const shot = async (options = {}) => (await page.screenshot({ clip, ...options })).toString('base64')
  const mark = (state) =>
    page.evaluate(([selector, index, state, alone]) => {
      const element = document.querySelectorAll(selector)[index]
      element.style.removeProperty('visibility')
      element.removeAttribute('data-worlds-share')
      document.getElementById('capture-alone')?.remove()
      if (state === 'hidden') element.style.setProperty('visibility', 'hidden', 'important')
      if (state !== 'alone') return
      element.setAttribute('data-worlds-share', '')
      const style = document.createElement('style')
      style.id = 'capture-alone'
      style.textContent = alone
      document.head.append(style)
    }, [FIGURE, figure.index, state, drawnAlone('data-worlds-share')])
  const shown = await shot()
  await mark('hidden')
  const hidden = await shot()
  await mark('alone')
  const alone = await shot({ omitBackground: true })
  await mark('shown')
  const onScreen = (clip.width * clip.height) / (figure.box.width * figure.box.height)
  const ofWhatIsOnScreen = await page.evaluate(
    async ([shown, hidden, alone, delta]) => {
      const pixels = async (data) => {
        const image = new Image()
        image.src = `data:image/png;base64,${data}`
        await image.decode()
        const canvas = new OffscreenCanvas(image.naturalWidth, image.naturalHeight)
        const context = canvas.getContext('2d')
        context.drawImage(image, 0, 0)
        return context.getImageData(0, 0, canvas.width, canvas.height).data
      }
      const [a, b, own] = await Promise.all([pixels(shown), pixels(hidden), pixels(alone)])
      let his = 0
      let showing = 0
      for (let i = 0; i < a.length; i += 4) {
        if (own[i + 3] <= delta) continue
        his += 1
        if (Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) + Math.abs(a[i + 2] - b[i + 2]) > delta) showing += 1
      }
      return his === 0 ? 0 : showing / his
    },
    [shown, hidden, alone, PIXEL_DELTA],
  )
  return ofWhatIsOnScreen * onScreen
}

/**
 * The figure as figureNow reads it, plus `settled` (the same opacity on two reads STEP_WAIT_MS apart, above 0,
 * nothing running on him or around him), `share` (shownShare) and `drawn` (settled with SHOWN_SHARE_MIN or
 * more shown). Null when no figure is laid out.
 */
async function drawnNow(page) {
  const first = await figureNow(page)
  if (!first?.onScreen) return first && { ...first, settled: false, share: 0, drawn: false }
  await page.waitForTimeout(STEP_WAIT_MS)
  const figure = await figureNow(page)
  if (!figure?.onScreen) return figure && { ...figure, settled: false, share: 0, drawn: false }
  const settled = figure.visible && !figure.animating && figure.opacity > 0 && figure.opacity === first.opacity
  const share = settled ? await shownShare(page, figure) : 0
  return { ...figure, settled, share, drawn: settled && share >= SHOWN_SHARE_MIN }
}

/**
 * Scrolls until a figure is drawn (drawnNow) and returns it. When he never is, returns the last figure laid
 * out (drawn false), or null when no figure was laid out anywhere on the page at this width.
 */
async function revealFigure(page) {
  let laidOut = null
  for (let step = 0; step < REVEAL_STEPS; step += 1) {
    const figure = await drawnNow(page)
    if (figure?.drawn) return figure
    laidOut = figure ?? laidOut
    // On screen and still arriving (an entrance fade or slide running): read him again rather than scroll him
    // off the screen mid entrance (Art Deco's figure at 390 was carried half past the top that way).
    if (figure?.onScreen && !figure.settled && figure.opacity > 0) continue
    if (figure && !figure.onScreen) {
      await page.evaluate(([selector, index]) => document.querySelectorAll(selector)[index].scrollIntoView({ block: 'center' }), [FIGURE, figure.index])
      await page.waitForTimeout(STEP_WAIT_MS)
      continue
    }
    await page.mouse.wheel(0, Math.round(page.viewportSize().height / 2))
    await page.waitForTimeout(STEP_WAIT_MS)
  }
  return laidOut
}

/**
 * From a figure just found drawn below opacity 1, scrolls on half a screen at a time while his settled opacity
 * keeps rising (Medieval Fantasy's frost figure brightens with the scroll), then returns to the scroll where it
 * was highest and still drawn (the shown share holds there). One whose opacity does not rise with the scroll
 * (Dark Fantasy's knight rests at 0.7) stays where he was found. Ends at REVEAL_STEPS like revealFigure.
 */
async function brightest(page, found) {
  const scrollOf = () => page.evaluate(() => window.scrollY)
  let best = found
  let bestScroll = await scrollOf()
  let scroll = true
  for (let step = 0; step < REVEAL_STEPS && best.opacity < 1; step += 1) {
    if (scroll) {
      await page.mouse.wheel(0, Math.round(page.viewportSize().height / 2))
      await page.waitForTimeout(STEP_WAIT_MS)
    }
    const next = await drawnNow(page)
    // Still changing after the scroll: read him again before judging the rise.
    scroll = !(next?.onScreen && !next.settled && next.opacity > 0)
    if (!scroll) continue
    if (!next?.drawn || next.opacity <= best.opacity) break
    best = next
    bestScroll = await scrollOf()
  }
  if ((await scrollOf()) === bestScroll) return best
  await page.evaluate((y) => window.scrollTo(0, y), bestScroll)
  for (let step = 0; step < REVEAL_STEPS; step += 1) {
    const back = await drawnNow(page)
    if (back?.settled) return back.drawn ? back : best
  }
  return best
}

/**
 * Readies a lens still by one rule for every world (DECISIONS C38-12 and C38-13): at first paint when he is
 * drawn there, else where revealFigure first finds him drawn (Dark Fantasy's knight shows only while Work
 * Experience is in view, Medieval Fantasy's frost figure fades in as the page scrolls, Survival Horror's
 * panel covers him on the first screen), then as far on as he keeps brightening (brightest). A width that
 * lays out no figure anywhere (Rubber Hose's figure is wide screen only) is shot at the top with no focus
 * point. Returns { where, figure }, or null when a figure is laid out but never drawn: then the world gets no
 * still and the run exits 1, naming it.
 */
async function readyStill(page) {
  const atTop = await drawnNow(page)
  if (atTop?.drawn) return { where: 'at first paint', figure: await brightest(page, atTop) }
  const found = await revealFigure(page)
  if (found?.drawn) return { where: 'scrolled to him', figure: await brightest(page, found) }
  if (found) return null
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(SETTLE_MS)
  return { where: 'at the top, no figure laid out at this width', figure: null }
}

// For the crop only his figure is drawn (drawnAlone; the face sets him on the launcher's fill), so no text or
// scene art that lies over or beside him (Survival Horror's panels pass in front of him) ends up in his portrait.

/** Writes his portrait from the 1440 page, cropped to his figure's box; false when no figure ever showed. */
async function capturePortrait(page, encoder, id) {
  const found = await revealFigure(page)
  if (!found?.drawn) return false
  await page.evaluate(([selector, index]) => document.querySelectorAll(selector)[index].setAttribute('data-worlds-portrait', ''), [FIGURE, found.index])
  await page.addStyleTag({ content: drawnAlone('data-worlds-portrait') })
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
  const noStill = []
  let portrait = false
  for (const { width, context: options } of STILLS) {
    const { context, page } = await openHero(browser, id, options)
    const still = await readyStill(page)
    if (!still) {
      console.log(`  ${id} ${width}: his figure never drawn, no still`)
      noStill.push(width)
      await context.close()
      continue
    }
    writeFileSync(join(OUT, `${id}-${width}.webp`), await toWebp(encoder, await page.screenshot(), { maxWidth: width, quality: STILL_QUALITY }))
    const { where, figure } = still
    const read = figure ? `opacity ${figure.opacity.toFixed(3)}, shows ${figure.share.toFixed(3)}` : 'no figure'
    console.log(`  ${id} ${width}: still ${where}, scroll ${Math.round(await page.evaluate(() => window.scrollY))}, ${read}`)
    if (figure) focus[width] = centreIn(figure.box, options.viewport)
    if (width === 1440) portrait = await capturePortrait(page, encoder, id)
    await context.close()
  }
  return { focus, portrait, noStill }
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
    const stillless = []
    for (const { id } of readWorlds()) {
      console.log(`capturing ${id}`)
      const result = await captureWorld(browser, encoder, id)
      if (Object.keys(result.focus).length > 0) focus[id] = result.focus
      if (!result.portrait) missing.push(id)
      if (result.noStill.length > 0) stillless.push(`${id} (${result.noStill.join(' and ')})`)
    }
    writeFileSync(join(OUT, 'focus.json'), `${JSON.stringify(focus, null, 2)}\n`)
    if (missing.length === 0 && stillless.length === 0) {
      writeStamp()
      console.log(`done: ${OUT}`)
      return 0
    }
    if (missing.length > 0) console.error(`no ${FIGURE} element, so no portrait, for: ${missing.join(', ')}`)
    if (stillless.length > 0) console.error(`his figure never drawn, so no lens still, for: ${stillless.join(', ')}`)
    return 1
  } finally {
    await browser.close()
  }
}

process.exit(await main())
