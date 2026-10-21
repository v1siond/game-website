import { test, expect } from '@playwright/test'

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

test('the game engine route is still the framed engine page', async ({ page }) => {
  const response = await page.goto('/personal-projects/game-engine')
  expect(response?.status()).toBe(200)
  await expect(page.locator('iframe')).toBeAttached()
})
