import type { CVData } from '@/lib/cv/content'
import { contentLastModified } from '@/lib/cv-data'
import { jsonLdHtml, profilePageJsonLd, type IndexedPath } from '@/lib/seo'

/** The schema.org ProfilePage of the page, in the server render where crawlers read it. */
export async function ProfilePageJsonLd({ cv, path }: Readonly<{ cv: CVData; path: IndexedPath }>) {
  const jsonLd = profilePageJsonLd(cv, path, await contentLastModified())
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml(jsonLd) }} />
}
