import type { MetadataRoute } from 'next'
import { getAllCVData } from '@/lib/cv-data'
import { siteDescription, siteTitle } from '@/lib/seo'
import { MARK_BACKGROUND } from '@/lib/siteMark'

// The installable site's name and icons; the icons are the mark files next to this one in src/app.
export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const cv = await getAllCVData('en')

  return {
    name: siteTitle(cv),
    short_name: cv.fullName,
    description: siteDescription(cv),
    start_url: '/',
    display: 'standalone',
    background_color: MARK_BACKGROUND,
    theme_color: MARK_BACKGROUND,
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
      { src: '/favicon.ico', sizes: '16x16 32x32 48x48', type: 'image/x-icon' },
    ],
  }
}
