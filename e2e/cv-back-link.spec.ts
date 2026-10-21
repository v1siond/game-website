import { test, expect, type BrowserContext, type Locator, type Page } from '@playwright/test'

const backLink = (page: Page) => page.getByRole('link', { name: 'Back to the site' })
const professionOption = (page: Page, name: RegExp) =>
  page.getByRole('radiogroup', { name: /profession/i }).first().getByRole('radio', { name })
// Only the Medieval world has a mailto "Send Message" button.
const medievalOnly = (page: Page) => page.getByRole('link', { name: 'Send Message' })

// The picker renders English on the server and only then reads the stored locale in an effect, so a
// retrying assertion would pass on the server render. Wait for React to own the node, then for the
// effects of that commit to flush, and read the value once.
async function settledAfterHydration(locator: Locator) {
  await locator.evaluate(
    (node) =>
      new Promise<void>((resolve) => {
        const hydrated = () => Object.keys(node).some((key) => key.startsWith('__reactFiber'))
        const settle = () => requestAnimationFrame(() => setTimeout(resolve, 0))
        const wait = () => (hydrated() ? settle() : requestAnimationFrame(wait))
        wait()
      }),
  )
}

const setLocaleCookie = (context: BrowserContext, baseURL: string | undefined, value: string) =>
  context.addCookies([{ name: 'locale', value, url: baseURL! }])

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

test('from the Medieval world to the CV and back, still in the Medieval world', async ({ page }) => {
  await page.goto('/')
  await expect(medievalOnly(page)).toHaveCount(0)
  await page.evaluate(() => localStorage.setItem('portfolio-theme', 'medieval-fantasy'))
  await page.reload()
  await expect(medievalOnly(page)).toBeVisible()

  await page.locator('a[href="/cv"]').first().click()
  await expect(page).toHaveURL(/\/cv$/)
  await expect(page.locator('#cv-content')).toBeVisible()

  await backLink(page).click()
  await expect(page).toHaveURL(/\/$/)
  await expect(medievalOnly(page)).toBeVisible()
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

test('the CV language follows the locale cookie', async ({ page, context, baseURL }) => {
  await setLocaleCookie(context, baseURL, 'es')
  await page.goto('/cv')
  await expect(page.locator('html')).toHaveAttribute('lang', 'es')
  await expect(page.getByRole('link', { name: 'Volver al sitio' })).toBeVisible()
})

test('the home page stays English under a Spanish cookie and a Spanish browser', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ locale: 'es-ES' })
  await setLocaleCookie(context, baseURL, 'es')
  const page = await context.newPage()
  await page.goto('/')
  await expect(page.locator('a[href="/cv"]').first()).toBeVisible()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await context.close()
})

test('the CV language picker shows the language the page is in, never a stale local pick', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('locale', 'es'))
  await page.goto('/cv')
  await expect(backLink(page)).toBeVisible()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  const picker = page.getByRole('combobox')
  await settledAfterHydration(picker)
  expect(await picker.inputValue()).toBe('en')
})
