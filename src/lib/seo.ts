import type { Metadata } from 'next'
import type { CVData } from './cv/content'
import { CV_PATHS, locales, type CVPath } from '@/i18n/config'

// What search engines, link previews and the web manifest say about the site, built from the Decap
// content so a CV edit changes them too. Plain functions of the CV, no Next runtime.

/** The one address the site is served on; canonicals, the sitemap and the JSON-LD are built from it. */
export const SITE_URL = 'https://alexanderpulido.dev'

/** The pages crawlers are pointed at, by path: the home page and the CV in every language. */
export type IndexedPath = '/' | CVPath
export const INDEXED_PATHS: readonly IndexedPath[] = ['/', ...locales.map((locale) => CV_PATHS[locale])]

// The CV's language versions, named on each of them so search engines show the visitor's own; a
// visitor whose language is none of them gets the English one.
const CV_LANGUAGES = { ...CV_PATHS, 'x-default': CV_PATHS.en }

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

// Each indexed page's own title; the home page carries the site title, every CV page the CV's.
const pageTitle = (cv: SeoFacts, path: IndexedPath): string =>
  path === '/' ? siteTitle(cv) : `${cv.labels.actions.cv} | ${cv.fullName}`

// The home page is English only; a CV page also names its other languages.
const alternatesFor = (path: IndexedPath): Metadata['alternates'] =>
  path === '/' ? { canonical: path } : { canonical: path, languages: CV_LANGUAGES }

/** The head of one indexed page: title, description, canonical, Open Graph, Twitter and keywords. */
export function pageMetadata(cv: SeoFacts, path: IndexedPath): Metadata {
  const title = pageTitle(cv, path)
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
    alternates: alternatesFor(path),
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

/** The schema.org ProfilePage of one indexed page: its address, when its content last changed, and him
 *  as its main entity, for the application/ld+json script. */
export function profilePageJsonLd(cv: SeoFacts, path: IndexedPath, dateModified: Date) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    url: absoluteUrl(path),
    dateModified: dateModified.toISOString(),
    mainEntity: {
      '@type': 'Person',
      name: cv.fullName,
      jobTitle: shortRole(cv.professionalSummary.headline),
      description: siteDescription(cv),
      url: SITE_URL,
      image: absoluteUrl(PREVIEW_IMAGE.url),
      email: `mailto:${cv.contact.email}`,
      sameAs: [cv.contact.linkedin],
      knowsAbout: techKeywords(cv),
    },
  }
}
