import { test, expect } from '@playwright/test'

// A keyboard user changes the CV language from the picker. The refresh the change starts is held at the
// network, so the picker's waiting state can be read before the page comes back in the new language.
test('a keyboard user changes the CV language, and the picker waits while the page reloads', async ({ page }) => {
  await page.goto('/cv')
  const picker = page.getByRole('combobox')
  await expect(picker).toHaveValue('en')
  // A key pressed before React owns the select would change the native value without the handler.
  await picker.evaluate(
    (node) =>
      new Promise<void>((resolve) => {
        const wait = () =>
          Object.keys(node).some((key) => key.startsWith('__reactFiber')) ? resolve() : requestAnimationFrame(wait)
        wait()
      }),
  )

  let release = () => {}
  const held = new Promise<void>((resolve) => (release = resolve))
  await page.route('**/cv*', async (route) => {
    if (route.request().headers()['rsc'] === '1') await held
    await route.continue()
  })

  await picker.focus()
  await page.keyboard.press('ArrowDown')

  await expect(picker).toHaveValue('es')
  await expect(picker).toBeDisabled()
  await expect(page.getByText('Loading...')).toBeVisible()

  release()
  await expect(page.getByRole('link', { name: 'Volver al sitio' })).toBeVisible()
  await expect(page.locator('html')).toHaveAttribute('lang', 'es')
  await expect(picker).toBeEnabled()
  await expect(page.getByText('Loading...')).toHaveCount(0)
})
