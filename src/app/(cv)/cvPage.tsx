import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllCVData } from '@/lib/cv-data'
import { cvPath, defaultLocale, isLocale, type Locale } from '@/i18n/config'
import { pageMetadata } from '@/lib/seo'
import { ProfilePageJsonLd } from '@/components/seo/ProfilePageJsonLd'
import { CVDataProvider } from '@/components/cv/CVDataProvider'
import { yearOf } from '@/lib/cv/cvView'
import { worldCV } from '@/lib/cv/content'
import { CVContent } from './cv/CVContent'

// The CV page of one language, shared by /cv (English) and /es/cv, /it/cv. The language comes from the
// address, never from the request, so every one of them renders once at build time.

export type TranslatedLocale = Exclude<Locale, typeof defaultLocale>

/** The translated locale the first segment of a CV address names, or the 404 page. */
export function translatedLocale(segment: string): TranslatedLocale {
  if (!isLocale(segment) || segment === defaultLocale) notFound()
  return segment
}

export async function cvMetadata(locale: Locale): Promise<Metadata> {
  return pageMetadata(await getAllCVData(locale), cvPath(locale))
}

// The CV of one locale, its facts and its labels from content/cv, read like the worlds read it.
export async function CVPage({ locale }: Readonly<{ locale: Locale }>) {
  const cv = await getAllCVData(locale)

  return (
    <CVDataProvider cv={worldCV(cv)} year={yearOf(new Date())}>
      <ProfilePageJsonLd cv={cv} path={cvPath(locale)} />
      <CVContent cv={cv} locale={locale} />
    </CVDataProvider>
  )
}
