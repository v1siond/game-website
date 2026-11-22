import { defaultLocale, isLocale, locales, type Locale } from '@/i18n/config'
import type { CVContentFiles } from './content'
import { labelsFor, type Labels } from './labels'

// The error pages' words in every language at once: a 404 or a 500 renders before any page has told it
// the visitor's language, so the screen picks its block from the address it is shown at.

export type ErrorText = Labels['errors']

export interface ErrorPage {
  fullName: string
  text: ErrorText
}

export type ErrorPages = Record<Locale, ErrorPage>

/** Each locale's error text (English filling a key it lacks) and his name, from labels.json and summary.json. */
export function errorPagesFrom({ labels, summary }: Pick<CVContentFiles, 'labels' | 'summary'>): ErrorPages {
  return Object.fromEntries(
    locales.map((locale) => [locale, { fullName: { ...summary.en, ...summary[locale] }.fullName, text: labelsFor(labels, locale).errors }]),
  ) as ErrorPages
}

/** The language an address is in: its first segment when that names one (/es/old-link), else English. */
export function localeOfPath(path: string | null | undefined): Locale {
  const segment = path?.split('/')[1]
  return isLocale(segment) ? segment : defaultLocale
}

/** An error page's tab title: the failure, then his name. */
export const errorTitle = (title: string, fullName: string): string => `${title} | ${fullName}`
