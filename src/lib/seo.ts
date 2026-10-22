import type { Metadata } from 'next'
import type { CVData } from './cv/content'

// What search engines, link previews and the web manifest say about the site, built from the Decap
// content so a CV edit changes them too. Plain functions of the CV, no Next runtime.

/** The one address the site is served on; canonicals, the sitemap and the JSON-LD are built from it. */
export const SITE_URL = 'https://alexanderpulido.dev'

/** The pages crawlers are pointed at, by path. */
export const INDEXED_PATHS = ['/', '/cv'] as const
export type IndexedPath = (typeof INDEXED_PATHS)[number]

const DESCRIPTION_LIMIT = 160

/** The link preview card, rendered by src/app/opengraph-image.tsx at this path and size. */
export const PREVIEW_IMAGE = { url: '/opengraph-image', width: 1200, height: 630 } as const

type SeoFacts = Pick<CVData, 'fullName' | 'professionalSummary' | 'contact' | 'techStack' | 'labels'>

/** The role part of the headline: "X Engineer with 10+ years of proven success" gives "X Engineer". */
export function shortRole(headline: string): string {
  return headline.split(/\s+with\s+/i)[0].trim()
}

const sentence = (text: string): string => (/[.!?]$/.test(text) ? text : `${text}.`)

// Cut at the last whole word that fits, so a long headline never ends mid word.
const clip = (text: string, limit: number): string => {
  if (text.length <= limit) return text
  const cut = text.slice(0, limit - 1)
  return `${cut.slice(0, cut.lastIndexOf(' '))}…`
}

/** The headline and the tagline, about one search result snippet long. */
export function siteDescription({ professionalSummary }: SeoFacts): string {
  const { headline, tagline } = professionalSummary
  return clip(`${sentence(headline)} ${sentence(tagline)}`, DESCRIPTION_LIMIT)
}

/** Every tool of the tech stack once, in the order the CV lists them. */
export function techKeywords({ techStack }: Pick<CVData, 'techStack'>): string[] {
  return [...new Set(techStack.flatMap((category) => category.items))]
}

export const absoluteUrl = (path: string): string => new URL(path, SITE_URL).toString()

/** "Alexander Pulido | <role>", the title of the home page and of the site as a whole. */
export function siteTitle(cv: SeoFacts): string {
  return `${cv.fullName} | ${shortRole(cv.professionalSummary.headline)}`
}

// Each indexed page's own title; the home page carries the site title.
const PAGE_TITLES: Record<IndexedPath, (cv: SeoFacts) => string> = {
  '/': siteTitle,
  '/cv': (cv) => `${cv.labels.actions.cv} | ${cv.fullName}`,
}

/** The head of one indexed page: title, description, canonical, Open Graph, Twitter and keywords. */
export function pageMetadata(cv: SeoFacts, path: IndexedPath): Metadata {
  const title = PAGE_TITLES[path](cv)
  const description = siteDescription(cv)
  // A page's openGraph replaces the parent's whole, so the card the root image file provides is named here.
  const images = [{ ...PREVIEW_IMAGE, alt: siteTitle(cv) }]

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    applicationName: cv.fullName,
    keywords: [cv.fullName, ...techKeywords(cv)],
    authors: [{ name: cv.fullName, url: SITE_URL }],
    creator: cv.fullName,
    publisher: cv.fullName,
    alternates: { canonical: path },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } },
    openGraph: {
      type: 'profile',
      url: path,
      siteName: cv.fullName,
      title,
      description,
      images,
    },
    twitter: { card: 'summary_large_image', title, description, images },
  }
}

/** The schema.org Person the page describes, for the application/ld+json script. */
export function personJsonLd(cv: SeoFacts, path: IndexedPath) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: cv.fullName,
    jobTitle: shortRole(cv.professionalSummary.headline),
    description: siteDescription(cv),
    url: SITE_URL,
    mainEntityOfPage: absoluteUrl(path),
    email: `mailto:${cv.contact.email}`,
    sameAs: [cv.contact.linkedin],
    knowsAbout: techKeywords(cv),
  }
}
