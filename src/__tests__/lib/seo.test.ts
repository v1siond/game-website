import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { CV_CONTENT_FILES, cvDataFrom, type CVContentFiles } from '@/lib/cv/content'
import { HERO_IDENTITY } from '@/components/cv/heroIdentity'
import { siteMarkSvg } from '@/lib/siteMark'
import { SITE_URL, pageMetadata, personJsonLd, shortRole, siteDescription, siteTitle, techKeywords } from '@/lib/seo'

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
    const { headline, tagline } = cv.professionalSummary
    expect(siteDescription(cv)).toBe(`${headline}. ${tagline}.`)
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

  it('takes its keywords only from his name and the tech stack', () => {
    const allowed = new Set([cv.fullName, ...cv.techStack.flatMap((category) => category.items)])
    expect((pageMetadata(cv, '/').keywords as string[]).every((keyword) => allowed.has(keyword))).toBe(true)
  })
})

describe('personJsonLd', () => {
  it('describes him as a schema.org Person from the content', () => {
    const person = personJsonLd(cv, '/cv')

    expect(person).toMatchObject({
      '@type': 'Person',
      name: cv.fullName,
      jobTitle: shortRole(cv.professionalSummary.headline),
      url: SITE_URL,
      mainEntityOfPage: `${SITE_URL}/cv`,
      email: `mailto:${cv.contact.email}`,
      sameAs: [cv.contact.linkedin],
    })
    expect(person.knowsAbout).toEqual(techKeywords(cv))
    expect(new Set(person.knowsAbout).size).toBe(person.knowsAbout.length)
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
