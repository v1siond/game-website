import type { Metadata } from 'next'
import { getAllCVData } from '@/lib/cv-data'
import { pageMetadata } from '@/lib/seo'
import { ProfilePageJsonLd } from '@/components/seo/ProfilePageJsonLd'
import { CVDataProvider } from '@/components/cv/CVDataProvider'
import { WORLD_PENDING_SCRIPT } from '@/themes/worldPending'
import { WorldRenderer } from './WorldRenderer'

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(await getAllCVData('en'), '/')
}

// The worlds are written in English only (see the site layout), so the site loads the English CV once
// and every world reads it from the provider. The server renders the default world in full, so its CV
// text is in the HTML crawlers read; the inline script hides it only for a visitor who picked another one.
export default async function Home() {
  const cv = await getAllCVData('en')

  return (
    <CVDataProvider cv={cv}>
      <ProfilePageJsonLd cv={cv} path={'/'} />
      <script dangerouslySetInnerHTML={{ __html: WORLD_PENDING_SCRIPT }} />
      <WorldRenderer />
    </CVDataProvider>
  )
}
