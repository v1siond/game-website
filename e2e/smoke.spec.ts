import { test, expect } from '@playwright/test'

test('the home page opens a world and links to the CV', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('a[href="/cv"]').first()).toBeVisible()
})
