import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { test, expect, type Locator, type Page } from '@playwright/test'
import { cvDataFrom, type CVContentFiles, CV_CONTENT_FILES } from '../src/lib/cv/content'
import { viewFor } from '../src/lib/cv/cvView'

// The lane b worlds against the content files, the same checks as neon-cyber-cv.spec.ts: what each
// world shows is what content/cv holds, read through the same view a world reads.

const WORLDS = [
  'dark-fantasy',
  'medieval-fantasy',
  'mythic',
  'neon-portals',
  'soul-map',
  'survival-horror',
  'silhouette',
  'cell-shaded',
] as const

const contentFiles = Object.fromEntries(
  CV_CONTENT_FILES.map((name) => [
    name,
    JSON.parse(readFileSync(join(__dirname, '..', 'content', 'cv', `${name}.json`), 'utf8')),
  ]),
) as CVContentFiles
const cv = cvDataFrom(contentFiles, 'en')
const viewOf = (profession: string) => viewFor(cv, profession, 'world')

const hero = viewOf('engineer').hero
const engineerSections = viewOf('engineer').sections
const drummerSections = viewOf('drummer').sections
const fighterSections = viewOf('fighter').sections
if (engineerSections.profession !== 'engineer') throw new Error('engineer view expected')
if (drummerSections.profession !== 'drummer') throw new Error('drummer view expected')
if (fighterSections.profession !== 'fighter') throw new Error('fighter view expected')

const LINK_KINDS = ['site', 'app', 'store', 'story'] as const
const expectedProjectLinks = engineerSections.projects.flatMap((project) =>
  LINK_KINDS.map((kind) => project.links[kind]).filter(Boolean),
)

const professionSwitch = (page: Page) => page.getByRole('radiogroup', { name: /profession/i }).first()
const professionOption = (page: Page, name: RegExp) => professionSwitch(page).getByRole('radio', { name })
const projectsRegion = (page: Page) => page.getByRole('region', { name: /projects/i })
const bandsRegion = (page: Page) => page.getByRole('region', { name: /bands/i })
const muayThaiRegion = (page: Page) => page.getByRole('region', { name: /muay thai/i })

async function openWorld(page: Page, id: string) {
  await page.addInitScript((world) => localStorage.setItem('portfolio-theme', world), id)
  await page.goto('/')
}

async function expectInFirstScreen(page: Page, locator: Locator) {
  await expect(locator).toBeVisible()
  const box = await locator.boundingBox()
  const viewport = page.viewportSize()!
  expect(box, 'element has a box').not.toBeNull()
  expect(box!.x).toBeGreaterThanOrEqual(0)
  expect(box!.x + box!.width).toBeLessThanOrEqual(viewport.width)
  expect(box!.y + box!.height).toBeLessThanOrEqual(viewport.height)
}

for (const world of WORLDS) {
  test.describe(world, () => {
    for (const viewport of [
      { width: 1440, height: 900 },
      { width: 375, height: 812 },
    ]) {
      test(`at ${viewport.width} wide the first screen shows his name, headline, tagline and both actions, on System Engineer`, async ({
        page,
      }) => {
        await page.setViewportSize(viewport)
        await openWorld(page, world)

        const options = professionSwitch(page).getByRole('radio')
        await expect(options).toHaveCount(3)
        await expect(options.nth(0)).toHaveAccessibleName(/musician/i)
        await expect(options.nth(1)).toHaveAccessibleName(/system engineer/i)
        await expect(options.nth(2)).toHaveAccessibleName(/martial artist/i)
        await expect(options.nth(1)).toHaveAttribute('aria-checked', 'true')

        await expectInFirstScreen(page, page.getByRole('heading', { level: 1, name: hero.name }))
        await expectInFirstScreen(page, page.getByText(hero.headline, { exact: true }).first())
        await expectInFirstScreen(page, page.getByText(hero.tagline, { exact: true }).first())
        await expectInFirstScreen(page, page.locator(`a[href="${hero.actions.email.href}"]`).first())
        await expectInFirstScreen(page, page.locator(`a[href="${hero.actions.linkedin.href}"]`).first())
      })
    }

    test('the projects list carries every project link the content holds for a world, each opening a new tab', async ({
      page,
    }) => {
      await openWorld(page, world)
      const region = projectsRegion(page)
      await expect(region.getByRole('listitem').filter({ has: page.getByRole('heading') })).toHaveCount(
        engineerSections.projects.length,
      )
      const links = region.getByRole('link')
      await expect(links).toHaveCount(expectedProjectLinks.length)
      const hrefs = await links.evaluateAll((anchors) => anchors.map((a) => a.getAttribute('href')))
      expect(hrefs).toEqual(expectedProjectLinks)
      for (const target of await links.evaluateAll((anchors) => anchors.map((a) => a.getAttribute('target')))) {
        expect(target).toBe('_blank')
      }
    })

    test('Musician shows the bands and the local bands line, and no projects', async ({ page }) => {
      await openWorld(page, world)
      await professionOption(page, /musician/i).click()
      const region = bandsRegion(page)
      for (const band of drummerSections.bands) {
        await expect(region.getByRole('heading', { name: band.name, exact: true })).toBeVisible()
      }
      await expect(region.getByText(drummerSections.musician.line)).toBeVisible()
      await expect(projectsRegion(page)).toHaveCount(0)
    })

    test('Martial Artist shows the Muay Thai record, and no bands, projects or BJJ', async ({ page }) => {
      await openWorld(page, world)
      await professionOption(page, /martial artist/i).click()
      const region = muayThaiRegion(page)
      const { primary } = fighterSections.martialArts
      await expect(region.getByRole('heading', { name: primary.title })).toBeVisible()
      await expect(region.getByText(primary.rank)).toBeVisible()
      await expect(region.getByText(primary.dojo, { exact: false }).first()).toBeVisible()
      for (const achievement of primary.achievements) {
        await expect(region.getByText(achievement)).toBeVisible()
      }
      await expect(bandsRegion(page)).toHaveCount(0)
      await expect(projectsRegion(page)).toHaveCount(0)
      await expect(page.locator('body')).not.toContainText(/BJJ|blue belt|purple belt/i)
    })
  })
}
