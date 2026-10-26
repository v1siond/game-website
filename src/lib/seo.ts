import type { Metadata } from 'next'
import type { CVData } from './cv/content'
import { CV_PATHS, locales, type CVPath } from '@/i18n/config'
import type { PostMeta } from './blog/post'
import { BLOG_PATH, postPath } from './blog/links'

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

const sentencesOf = (text: string): string[] => text.split(/(?<=[.!?])\s+/).filter(Boolean).map(sentence)

// Add the next sentence while it fits and stop at the first that does not, so the snippet never ends mid
// sentence and never skips one.
const fitSentences = (lead: string, [next, ...rest]: string[], limit: number): string => {
  if (next === undefined) return lead
  const longer = `${lead} ${next}`
  if (longer.length > limit) return lead
  return fitSentences(longer, rest, limit)
}

/** The headline and the tagline's whole sentences that fit, about one search result snippet long. */
export function siteDescription({ professionalSummary }: SeoFacts): string {
  const { headline, tagline } = professionalSummary
  const lead = sentence(headline)
  if (lead.length > DESCRIPTION_LIMIT) return clip(lead, DESCRIPTION_LIMIT)
  return fitSentences(lead, sentencesOf(tagline), DESCRIPTION_LIMIT)
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

// "<" is escaped so no content string can close the script tag early.
/** A JSON-LD object as the text of its application/ld+json script. */
export const jsonLdHtml = (value: unknown): string => JSON.stringify(value).replace(/</g, '\\u003c')

type PreviewImage = { url: string; alt: string; width?: number; height?: number }

// A post's cover is its link preview; a post without one, and the list, show the site's card.
const previewImageOf = (cv: SeoFacts, post?: PostMeta): PreviewImage => {
  if (!post?.cover) return { ...PREVIEW_IMAGE, alt: siteTitle(cv) }
  return { url: post.cover, alt: post.coverAlt ?? post.title }
}

type BlogHead = {
  path: string
  title: string
  description: string
  image: PreviewImage
  openGraph: Record<string, unknown>
  keywords?: string[]
}

const blogHead = (cv: SeoFacts, { path, title, description, image, openGraph, keywords }: BlogHead): Metadata => ({
  metadataBase: new URL(SITE_URL),
  title,
  description,
  keywords,
  authors: [{ name: cv.fullName, url: SITE_URL }],
  creator: cv.fullName,
  alternates: { canonical: path },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } },
  openGraph: { url: path, siteName: cv.fullName, title, description, images: [image], ...openGraph },
  twitter: { card: 'summary_large_image', title, description, images: [image] },
})

const postKeywords = ({ keyword, tags }: PostMeta): string[] => [...new Set([keyword, ...tags])]

/** The head of /blog (no post given) or of one post: title, description, canonical, Open Graph with the
 *  post's cover, Twitter and keywords. */
export function blogMetadata(cv: SeoFacts, post?: PostMeta): Metadata {
  if (!post) {
    return blogHead(cv, {
      path: BLOG_PATH,
      title: `${cv.labels.sections.posts} | ${cv.fullName}`,
      description: siteDescription(cv),
      image: previewImageOf(cv),
      openGraph: { type: 'website' },
    })
  }
  return blogHead(cv, {
    path: postPath(post.slug),
    title: `${post.title} | ${cv.fullName}`,
    description: post.description,
    image: previewImageOf(cv, post),
    keywords: postKeywords(post),
    openGraph: { type: 'article', publishedTime: post.date, authors: [cv.fullName], tags: post.tags },
  })
}

/** The schema.org BlogPosting of one post: what it is, when he published it, its cover and him as its
 *  author, for the application/ld+json script of the post page. */
export function blogPostingJsonLd(cv: SeoFacts, post: PostMeta) {
  const url = absoluteUrl(postPath(post.slug))
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    url,
    mainEntityOfPage: url,
    image: absoluteUrl(previewImageOf(cv, post).url),
    keywords: postKeywords(post),
    inLanguage: 'en',
    author: { '@type': 'Person', name: cv.fullName, url: SITE_URL },
  }
}
