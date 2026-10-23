import type { CVData } from '@/lib/cv/content'
import { contentLastModified } from '@/lib/cv-data'
import { profilePageJsonLd, type IndexedPath } from '@/lib/seo'

// "<" is escaped so no content string can close the script tag early.
const scriptJson = (value: unknown): string => JSON.stringify(value).replace(/</g, '\\u003c')

/** The schema.org ProfilePage of the page, in the server render where crawlers read it. */
export async function ProfilePageJsonLd({ cv, path }: Readonly<{ cv: CVData; path: IndexedPath }>) {
  const jsonLd = profilePageJsonLd(cv, path, await contentLastModified())
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: scriptJson(jsonLd) }} />
}
