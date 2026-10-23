import type { Metadata } from 'next'
import { CVPage, cvMetadata, translatedLocale } from '../../cvPage'
import { isLocale } from '@/i18n/config'

type Props = Readonly<{ params: Promise<{ locale: string }> }>

// An address naming no language gets no CV head; the page below renders the 404 for it.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return isLocale(locale) ? cvMetadata(locale) : {}
}

// The CV in Spanish or Italian, at /es/cv and /it/cv.
export default async function TranslatedCVPage({ params }: Props) {
  return <CVPage locale={translatedLocale((await params).locale)} />
}
