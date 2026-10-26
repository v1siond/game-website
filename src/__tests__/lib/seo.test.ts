import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { CV_CONTENT_FILES, cvDataFrom, type CVContentFiles } from '@/lib/cv/content'
import { HERO_IDENTITY } from '@/components/cv/heroIdentity'
import { siteMarkSvg } from '@/lib/siteMark'
import {
  INDEXED_PATHS,
  PREVIEW_IMAGE,
  SITE_URL,
  blogMetadata,
  blogPostingJsonLd,
  jsonLdHtml,
  pageMetadata,
  profilePageJsonLd,
  shortRole,
  siteDescription,
  siteTitle,
  techKeywords,
} from '@/lib/seo'
import type { PostMeta } from '@/lib/blog/post'

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

  it.each(['en', 'es', 'it'] as const)('ends the %s summary at its last whole sentence within 160 characters', (locale) => {
    const summary = cvDataFrom(readFiles(), locale).professionalSummary
    const description = siteDescription({ ...cv, professionalSummary: summary })

    expect(description.length).toBeLessThanOrEqual(160)
    expect(description).toMatch(/\.$/)
    expect(description.startsWith(`${summary.headline}. `)).toBe(true)
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

// A post as the loader reads it from content/blog.
const post: PostMeta = {
  title: 'CSS page transition: four portals between my 17 CV worlds',
  slug: 'css-page-transition-portals',
  date: '2026-10-26',
  description: 'How I swapped a theme dropdown for world cards and four CSS portal effects.',
  keyword: 'css page transition',
  cover: '/blog/css-page-transition-portals/cover-swap-reveal.png',
  coverAlt: 'Timeline of the transition',
  tags: ['css page transition', 'portal transition'],
  draft: false,
}
const uncovered: PostMeta = { ...post, cover: undefined, coverAlt: undefined }

describe('blogMetadata', () => {
  it('heads the post list with the posts title, the site description and its canonical', () => {
    const metadata = blogMetadata(cv)
    expect(metadata.title).toBe(`${cv.labels.sections.posts} | ${cv.fullName}`)
    expect(metadata.description).toBe(siteDescription(cv))
    expect(metadata.alternates).toEqual({ canonical: '/blog' })
    expect(metadata.openGraph).toMatchObject({ type: 'website', url: '/blog', images: [{ ...PREVIEW_IMAGE, alt: siteTitle(cv) }] })
  })

  it('heads a post with its title, its description, its canonical and its cover as the preview image', () => {
    const metadata = blogMetadata(cv, post)
    expect(metadata.title).toBe(`${post.title} | ${cv.fullName}`)
    expect(metadata.description).toBe(post.description)
    expect(metadata.keywords).toEqual(['css page transition', 'portal transition'])
    expect(metadata.alternates).toEqual({ canonical: '/blog/css-page-transition-portals' })
    expect(metadata.openGraph).toMatchObject({
      type: 'article',
      url: '/blog/css-page-transition-portals',
      publishedTime: '2026-10-26',
      images: [{ url: post.cover, alt: post.coverAlt }],
    })
    expect(metadata.twitter).toMatchObject({ card: 'summary_large_image', images: [{ url: post.cover, alt: post.coverAlt }] })
  })

  it('heads a post with no cover with the site preview card', () => {
    expect(blogMetadata(cv, uncovered).openGraph).toMatchObject({ images: [{ ...PREVIEW_IMAGE, alt: siteTitle(cv) }] })
  })
})

describe('blogPostingJsonLd', () => {
  it('describes a post as a schema.org BlogPosting by him, at its address', () => {
    expect(blogPostingJsonLd(cv, post)).toEqual({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.description,
      datePublished: '2026-10-26',
      url: `${SITE_URL}/blog/css-page-transition-portals`,
      mainEntityOfPage: `${SITE_URL}/blog/css-page-transition-portals`,
      image: `${SITE_URL}/blog/css-page-transition-portals/cover-swap-reveal.png`,
      keywords: ['css page transition', 'portal transition'],
      inLanguage: 'en',
      author: { '@type': 'Person', name: cv.fullName, url: SITE_URL },
    })
  })

  it('points a post with no cover at the site preview card', () => {
    expect(blogPostingJsonLd(cv, uncovered).image).toBe(`${SITE_URL}${PREVIEW_IMAGE.url}`)
  })
})

describe('jsonLdHtml', () => {
  it('escapes "<" so no text can close the script tag', () => {
    expect(jsonLdHtml({ headline: '</script><b>' })).toBe('{"headline":"\\u003c/script>\\u003cb>"}')
  })
})
