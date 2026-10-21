export const locales = ['en', 'es', 'it'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'

export function isLocale(value: string | null | undefined): value is Locale {
  return !!value && (locales as readonly string[]).includes(value)
}

// "es-PE,es;q=0.9,en;q=0.8" lists es, es, en: the language part of each tag, in the order sent.
const acceptedLanguages = (acceptLanguage: string): string[] =>
  acceptLanguage.split(',').map((tag) => tag.split(';')[0].trim().split('-')[0])

/** The locale a request is rendered in: the `locale` cookie the switcher writes, then the first
 *  Accept-Language the CV has, then English. */
export function localeFrom(cookieLocale: string | undefined, acceptLanguage: string | null): Locale {
  if (isLocale(cookieLocale)) return cookieLocale
  return acceptedLanguages(acceptLanguage ?? '').find(isLocale) ?? defaultLocale
}
