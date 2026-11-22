export const locales = ['en', 'es', 'it'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale = 'en' satisfies Locale

/** The cookie that keeps a visitor's language pick: the switcher writes it, the middleware reads it. */
export const LOCALE_COOKIE = 'locale'

export function isLocale(value: string | null | undefined): value is Locale {
  return !!value && (locales as readonly string[]).includes(value)
}

// "es-PE,es;q=0.9,en;q=0.8" lists es, es, en: the language part of each tag, in the order sent.
const acceptedLanguages = (acceptLanguage: string): string[] =>
  acceptLanguage.split(',').map((tag) => tag.split(';')[0].trim().split('-')[0])

/** The locale a visitor reads the CV in: the `locale` cookie the switcher writes, then the first
 *  Accept-Language the CV has, then English. */
export function localeFrom(cookieLocale: string | undefined, acceptLanguage: string | null): Locale {
  if (isLocale(cookieLocale)) return cookieLocale
  return acceptedLanguages(acceptLanguage ?? '').find(isLocale) ?? defaultLocale
}

/** Where the CV of one language is served: English on /cv, every other language in front of it. */
export type CVPath = '/cv' | `/${Exclude<Locale, 'en'>}/cv`

export function cvPath(locale: Locale): CVPath {
  return locale === defaultLocale ? '/cv' : `/${locale}/cv`
}

/** The CV address of every language, by locale. */
export const CV_PATHS = Object.fromEntries(locales.map((locale) => [locale, cvPath(locale)])) as Record<Locale, CVPath>

/** Where a visitor asking for /cv goes (src/middleware.ts): the CV of their locale, or null to stay on
 *  the English /cv. */
export function cvRedirectPath(cookieLocale: string | undefined, acceptLanguage: string | null): CVPath | null {
  const locale = localeFrom(cookieLocale, acceptLanguage)
  return locale === defaultLocale ? null : cvPath(locale)
}
