import { test, expect, type Page } from '@playwright/test'

const professionSwitch = (page: Page) => page.getByRole('radiogroup', { name: /profession/i }).first()

async function expectEngineerInTheCentre(page: Page) {
  const options = professionSwitch(page).getByRole('radio')
  await expect(options).toHaveCount(3)
  await expect(options.nth(0)).toHaveAccessibleName(/musician/i)
  await expect(options.nth(1)).toHaveAccessibleName(/system engineer/i)
  await expect(options.nth(2)).toHaveAccessibleName(/martial artist/i)
  await expect(options.nth(1)).toHaveAttribute('aria-checked', 'true')
}

test('a fresh visitor lands on System Engineer, in the centre of the selector', async ({ page }) => {
  await page.goto('/')
  await expectEngineerInTheCentre(page)
})

test('a returning visitor who last picked Martial Artist still lands on System Engineer', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('portfolio-profession', 'fighter'))
  await page.goto('/')
  await expectEngineerInTheCentre(page)
})

test('?profession= still forces a profession', async ({ page }) => {
  await page.goto('/?profession=fighter')
  const options = professionSwitch(page).getByRole('radio')
  await expect(options.nth(2)).toHaveAttribute('aria-checked', 'true')
  await expect(options.nth(1)).toHaveAttribute('aria-checked', 'false')
})

test('arrow keys move the pick along the selector', async ({ page }) => {
  await page.goto('/')
  const options = professionSwitch(page).getByRole('radio')
  await options.nth(1).focus()
  await page.keyboard.press('ArrowLeft')
  await expect(options.nth(0)).toHaveAttribute('aria-checked', 'true')
  await expect(options.nth(0)).toBeFocused()
  await page.keyboard.press('ArrowLeft')
  await expect(options.nth(2)).toHaveAttribute('aria-checked', 'true')
})
