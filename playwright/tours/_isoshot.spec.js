// Image-analysis harness: generate a settlement, switch to a chosen VIEW, optionally turn on the
// collision/debug overlay, hide the editor UI, and screenshot the canvas.
// Run: BASE_URL=http://localhost:3001 SHOT=/abs/path.png VIEW=ISO|2D|Top DEBUG=1 \
//      ZONE=summer VARIANT=village npx playwright test playwright/tours/_isoshot.spec.js --project=chromium
import { test } from '@playwright/test'

const ZONE = process.env.ZONE || 'summer'
const VARIANT = process.env.VARIANT || 'village'
const VIEW = process.env.VIEW || 'ISO' // ISO | 2D | Top
const DEBUG = process.env.DEBUG === '1'
const SHOT = process.env.SHOT || '/tmp/isoshot.png'

test('generate + screenshot a view', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto('/personal-projects/game-engine/templates?new=1')
  await page.locator('canvas').first().waitFor({ state: 'visible' })
  const btn = (name) => page.getByRole('button', { name, exact: true })
  await btn(ZONE).click().catch(() => {})
  await btn(VARIANT).click()
  await page.waitForTimeout(1000)
  if (DEBUG) await page.getByRole('button', { name: /Debug overlay/ }).click().catch(() => {})
  await btn(VIEW).click().catch(() => {}) // ISO / 2D / Top
  await page.waitForTimeout(600)
  await page.getByRole('button', { name: /Preview/ }).click().catch(() => {}) // hide editor panels
  await page.waitForTimeout(1000)
  await page.locator('canvas').first().screenshot({ path: SHOT })
})
