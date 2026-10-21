import { test, expect, type Page } from '@playwright/test'

const backLink = (page: Page) => page.getByRole('link', { name: 'Back to the site' })
const professionOption = (page: Page, name: RegExp) =>
  page.getByRole('radiogroup', { name: /profession/i }).first().getByRole('radio', { name })

test('from the home page to the CV and back, in the same world and profession', async ({ page }) => {
  await page.goto('/')
  await professionOption(page, /musician/i).click()
  await expect(professionOption(page, /musician/i)).toHaveAttribute('aria-checked', 'true')

  await page.locator('a[href="/cv"]').first().click()
  await expect(page).toHaveURL(/\/cv$/)
  await expect(page.locator('#cv-content')).toBeVisible()

  await backLink(page).click()
  await expect(page).toHaveURL(/\/$/)
  await expect(professionOption(page, /musician/i)).toHaveAttribute('aria-checked', 'true')
})

test('the back link sits at the left of the CV toolbar and is hidden in print', async ({ page }) => {
  await page.goto('/cv')
  const link = backLink(page)
  await expect(link).toBeVisible()
  const download = page.getByRole('button', { name: /download pdf/i })
  const [linkBox, downloadBox] = [await link.boundingBox(), await download.boundingBox()]
  expect(linkBox!.x).toBeLessThan(downloadBox!.x)

  await page.emulateMedia({ media: 'print' })
  await expect(link).toBeHidden()
})

test('the page language follows the locale cookie', async ({ page, context }) => {
  await context.addCookies([{ name: 'locale', value: 'es', url: 'http://localhost:4100' }])
  await page.goto('/cv')
  await expect(page.locator('html')).toHaveAttribute('lang', 'es')
  await expect(page.getByRole('link', { name: 'Volver al sitio' })).toBeVisible()
})
