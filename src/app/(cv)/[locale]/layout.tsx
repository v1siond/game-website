import RootShell from '@/components/layouts/RootShell'
import { defaultLocale, isLocale, locales } from '@/i18n/config'
import type { TranslatedLocale } from '../cvPage'

export { viewport } from '@/components/layouts/RootShell'

// The translated CVs, /es/cv and /it/cv, each rendered at build time; English stays on /cv.
export function generateStaticParams(): { locale: TranslatedLocale }[] {
  return locales.filter((locale): locale is TranslatedLocale => locale !== defaultLocale).map((locale) => ({ locale }))
}

// The document language is the one in the address, so screen readers read the CV in the language it is
// shown in. An address naming no language (/fr/cv) renders the page's 404 (./not-found) in English.
export default async function TranslatedCVLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale } = await params
  return <RootShell lang={isLocale(locale) ? locale : defaultLocale}>{children}</RootShell>
}
