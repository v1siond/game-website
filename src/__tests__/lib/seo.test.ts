import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { CV_CONTENT_FILES, cvDataFrom, type CVContentFiles } from '@/lib/cv/content'
import { HERO_IDENTITY } from '@/components/cv/heroIdentity'
import { siteMarkSvg } from '@/lib/siteMark'
import { INDEXED_PATHS, SITE_URL, pageMetadata, profilePageJsonLd, shortRole, siteDescription, siteTitle, techKeywords } from '@/lib/seo'

// The real Decap files, so the head and the JSON-LD are checked against what the pages read.
const readFiles = (): CVContentFiles =>
  Object.fromEntries(
    CV_CONTENT_FILES.map((name) => [
      name,
      JSON.parse(readFileSync(join(process.cwd(), 'content', 'cv', `${name}.json`), 'utf8')),
    ]),
  ) as CVContentFiles

const cv = cvDataFrom(readFiles(), 'en')

describe('shortRole', () => {
  it('keeps the role part of the headline', () => {
    expect(shortRole('Senior Engineer with 10+ years of proven success')).toBe('Senior Engineer')
  })

  it('keeps a headline without a "with" whole', () => {
    expect(shortRole('Senior Engineer')).toBe('Senior Engineer')
  })
})

describe('siteDescription', () => {
  it('joins the headline and the tagline from the summary', () => {
    const short = { ...cv, professionalSummary: { ...cv.professionalSummary, tagline: 'Built PMX' } }
    expect(siteDescription(short)).toBe(`${cv.professionalSummary.headline}. Built PMX.`)
  })

  it('cuts a long summary at a whole word within 160 characters', () => {
    const long = { ...cv, professionalSummary: { ...cv.professionalSummary, headline: 'word '.repeat(60).trim() } }
    const description = siteDescription(long)

    expect(description.length).toBeLessThanOrEqual(160)
    expect(description).toMatch(/word…$/)
  })
})

describe('pageMetadata', () => {
  it('titles the home page with his name and role and points its canonical at /', () => {
    const metadata = pageMetadata(cv, '/')

    expect(metadata.title).toBe(`${cv.fullName} | ${shortRole(cv.professionalSummary.headline)}`)
    expect(metadata.title).toBe(siteTitle(cv))
    expect(metadata.alternates?.canonical).toBe('/')
    expect(metadata.metadataBase?.toString()).toBe(`${SITE_URL}/`)
    expect(metadata.authors).toEqual([{ name: cv.fullName, url: SITE_URL }])
  })

  it('gives /cv its own title and canonical', () => {
    const metadata = pageMetadata(cv, '/cv')

    expect(metadata.title).toBe(`${cv.labels.actions.cv} | ${cv.fullName}`)
    expect(metadata.alternates?.canonical).toBe('/cv')
    expect(metadata.openGraph).toMatchObject({ url: '/cv', type: 'profile', siteName: cv.fullName })
  })

  it('gives each CV language its own canonical and names all three plus x-default', () => {
    const languages = { en: '/cv', es: '/es/cv', it: '/it/cv', 'x-default': '/cv' }

    for (const path of ['/cv', '/es/cv', '/it/cv'] as const) {
      const metadata = pageMetadata(cv, path)
      expect(metadata.alternates).toEqual({ canonical: path, languages })
      expect(metadata.openGraph).toMatchObject({ url: path })
    }
  })

  it('points crawlers at the home page and the CV in every language', () => {
    expect(INDEXED_PATHS).toEqual(['/', '/cv', '/es/cv', '/it/cv'])
  })

  it('names the 1200x630 preview card for open graph and twitter', () => {
    const metadata = pageMetadata(cv, '/cv')
    const card = [{ url: '/opengraph-image', width: 1200, height: 630, alt: siteTitle(cv) }]

    expect(metadata.openGraph?.images).toEqual(card)
    expect(metadata.twitter?.images).toEqual(card)
  })

  it('takes its keywords only from his name and the tech stack', () => {
    const allowed = new Set([cv.fullName, ...cv.techStack.flatMap((category) => category.items)])
    expect((pageMetadata(cv, '/').keywords as string[]).every((keyword) => allowed.has(keyword))).toBe(true)
  })
})

describe('profilePageJsonLd', () => {
  const modified = new Date('2026-10-20T12:00:00Z')
  const page = profilePageJsonLd(cv, '/es/cv', modified)

  it('describes the page as a schema.org ProfilePage of its address, dated by the content', () => {
    expect(page).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      url: `${SITE_URL}/es/cv`,
      dateModified: '2026-10-20T12:00:00.000Z',
    })
  })

  it('names him as its main entity, a Person from the content with the preview image', () => {
    expect(page.mainEntity).toMatchObject({
      '@type': 'Person',
      name: cv.fullName,
      jobTitle: shortRole(cv.professionalSummary.headline),
      url: SITE_URL,
      image: `${SITE_URL}/opengraph-image`,
      email: `mailto:${cv.contact.email}`,
      sameAs: [cv.contact.linkedin],
    })
    expect(page.mainEntity.knowsAbout).toEqual(techKeywords(cv))
    expect(new Set(page.mainEntity.knowsAbout).size).toBe(page.mainEntity.knowsAbout.length)
  })
})

describe('siteMarkSvg', () => {
  it('draws the mark on a 16 pixel grid in his sprite colours', () => {
    const svg = siteMarkSvg()

    expect(svg).toContain('viewBox="0 0 16 16"')
    expect(svg).toContain(`fill="${HERO_IDENTITY.skin}"`)
    expect(svg).toContain(`fill="${HERO_IDENTITY.beard}"`)
  })
})
