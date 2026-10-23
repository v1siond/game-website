import type { MetadataRoute } from 'next'
import { contentLastModified } from '@/lib/cv-data'
import { INDEXED_PATHS, absoluteUrl } from '@/lib/seo'

// Every page renders the content files, so each one last changed when the content did.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = await contentLastModified()
  return INDEXED_PATHS.map((path) => ({ url: absoluteUrl(path), lastModified }))
}
