import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { test, expect } from '@playwright/test'

// The jobs as Decap stores them, so the page is checked against the files and not a copy.
const jobs = (locale: 'en' | 'es') =>
  JSON.parse(readFileSync(join(process.cwd(), 'content', 'cv', 'experience.json'), 'utf8'))[locale]
    .workExperience as Array<{ id: string; title: string; company: string; highlights: string[] }>

test('the CV page renders his name and the Daring Bit Assembly jobs from the content files', async ({
  page,
  context,
  baseURL,
}) => {
  const staff = jobs('en').find((job) => job.id === 'dba-staff')!
  expect(staff.company).toContain('Daring Bit Assembly')

  await page.goto('/cv')
  await expect(page.getByRole('heading', { level: 1, name: 'Alexander Pulido' })).toBeVisible()
  await expect(page.getByText(staff.company, { exact: true }).first()).toBeVisible()
  await expect(page.getByText(staff.highlights[0]).first()).toBeVisible()

  const staffEs = jobs('es').find((job) => job.id === 'dba-staff')!
  await context.addCookies([{ name: 'locale', value: 'es', url: baseURL! }])
  await page.goto('/cv')
  await expect(page.getByText(staffEs.highlights[0]).first()).toBeVisible()
})
