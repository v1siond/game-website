import { test, expect } from '@playwright/test'
import { ENGINE_URL } from '../src/lib/engineLink'

test('the home page opens a world and links to the CV', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('a[href="/cv"]').first()).toBeVisible()
})

test('an unknown address shows the site not-found screen with a 404', async ({ page }) => {
  const response = await page.goto('/no-such-page')
  expect(response?.status()).toBe(404)
  await expect(page.getByRole('heading', { name: 'This page is not on the map' })).toBeVisible()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
})

// The engine is no longer framed here: an old shared engine link goes to nebulith with the rest of its path.
test('an old game engine link sends the visitor to nebulith with the rest of its path', async ({ request }) => {
  for (const [path, rest] of [
    ['/personal-projects/game-engine', ''],
    ['/personal-projects/game-engine/play/forest', '/play/forest'],
  ]) {
    const response = await request.get(path, { maxRedirects: 0 })
    expect(response.status(), path).toBe(308)
    expect(response.headers().location, path).toBe(`${ENGINE_URL}${rest}`)
  }
})
