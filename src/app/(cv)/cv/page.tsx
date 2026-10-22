import type { Metadata } from 'next'
import { getAllCVData } from '@/lib/cv-data'
import { requestLocale } from '@/i18n/requestLocale'
import { pageMetadata } from '@/lib/seo'
import { CVDataProvider } from '@/components/cv/CVDataProvider'
import { CVContent } from './CVContent'

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(await getAllCVData(await requestLocale()), '/cv')
}

// The CV of the request's locale, its facts and its labels from content/cv, read like the worlds read it.
export default async function CVPage() {
  const cv = await getAllCVData(await requestLocale())

  return (
    <CVDataProvider cv={cv}>
      <CVContent />
    </CVDataProvider>
  )
}
