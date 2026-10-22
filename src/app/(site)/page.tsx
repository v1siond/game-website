import type { Metadata } from 'next'
import { getAllCVData } from '@/lib/cv-data'
import { pageMetadata } from '@/lib/seo'
import { CVDataProvider } from '@/components/cv/CVDataProvider'
import { WorldRenderer } from './WorldRenderer'

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(await getAllCVData('en'), '/')
}

// The worlds are written in English only (see the site layout), so the site loads the English CV once
// and every world reads it from the provider.
export default async function Home() {
  const cv = await getAllCVData('en')

  return (
    <CVDataProvider cv={cv}>
      <WorldRenderer />
    </CVDataProvider>
  )
}
