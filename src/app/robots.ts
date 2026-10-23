import type { MetadataRoute } from 'next'
import { absoluteUrl } from '@/lib/seo'

// Every page is open to crawlers except the Decap admin and the API routes behind it. No Host line:
// only Yandex ever read it, and the canonical links already name the one address.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api'] },
    sitemap: absoluteUrl('/sitemap.xml'),
  }
}
