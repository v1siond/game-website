import type { CVData } from '@/lib/cv/content'
import { personJsonLd, type IndexedPath } from '@/lib/seo'

// "<" is escaped so no content string can close the script tag early.
const scriptJson = (value: unknown): string => JSON.stringify(value).replace(/</g, '\\u003c')

/** The schema.org Person of the page, in the server render where crawlers read it. */
export function PersonJsonLd({ cv, path }: Readonly<{ cv: CVData; path: IndexedPath }>) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: scriptJson(personJsonLd(cv, path)) }} />
}
