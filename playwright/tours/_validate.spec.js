// AUTONOMOUS end-to-end validation on the real game (:3000), EMOJI style, ONE isolated house so nothing
// occludes it. Checks: (1) does the building sit ON the ground (seating fix)? (2) does clicking a front
// wall block select THAT block and land the yellow selector on it? Screens + video I inspect myself.
const { test } = require('@playwright/test')
const DIR = '/home/visiond/.claude/jobs/fce8d7fd/tmp'
const wait = (p, ms) => p.waitForTimeout(ms)

test.use({ viewport: { width: 1440, height: 900 }, video: 'on' })

test('nebulith emoji house — seating + selector', async ({ page }) => {
  page.on('console', m => console.log('PAGE:', m.text()))
  page.on('pageerror', e => console.log('PAGEERROR:', e.message))
  await page.goto('/personal-projects/game-engine/templates?new=1')
  await wait(page, 4000)
  await page.evaluate(() => window.__setArtStyle && window.__setArtStyle('emoji'))
  await wait(page, 900)

  // place ONE house in open ground
  const b = await page.evaluate(() => {
    window.__placeBuilding && window.__placeBuilding('house', 15, 15)
    const bs = window.__buildings ? window.__buildings() : []
    return bs[bs.length - 1] || null
  })
  console.log('HOUSE:', JSON.stringify(b))
  await wait(page, 700)
  await page.evaluate(c => window.__centerOn && window.__centerOn(c.col, c.row), { col: b.col, row: b.row })
  await wait(page, 1100)
  await page.screenshot({ path: `${DIR}/emoji-house.png` })

  // Click the FRONT wall block just above the door (door cell, level 1) — front-facing, unoccluded.
  const scr = await page.evaluate(({ col, row }) => (window.__isoBlockScreen ? window.__isoBlockScreen(col, row, 1) : null), b.door)
  console.log('DOOR CELL', JSON.stringify(b.door), '→ wall-above-door(L1) screen:', JSON.stringify(scr))
  if (scr) {
    await page.mouse.move(scr.x, scr.y)
    await wait(page, 300)
    await page.mouse.click(scr.x, scr.y)
    await wait(page, 700)
    const sel = await page.evaluate(() => (window.__cellSel ? window.__cellSel() : null))
    console.log('CLICKED door-wall L1 → SELECTED:', JSON.stringify(sel), '(expected', `${b.door.col},${b.door.row},1)`)
    await page.screenshot({ path: `${DIR}/emoji-selector.png` })
  }
})
