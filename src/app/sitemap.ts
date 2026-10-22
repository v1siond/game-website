import type { MetadataRoute } from 'next'
import { INDEXED_PATHS, absoluteUrl } from '@/lib/seo'

// Both pages render the content files, so they change whenever a deploy ships; the build time is
// their last modification.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  return INDEXED_PATHS.map((path) => ({ url: absoluteUrl(path), lastModified }))
}
