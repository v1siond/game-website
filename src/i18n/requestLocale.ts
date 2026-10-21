import { cookies, headers } from 'next/headers'
import { localeFrom, type Locale } from './config'

/** The locale of the request being rendered (server only): reads the cookie and Accept-Language. */
export async function requestLocale(): Promise<Locale> {
  const [cookieStore, headerList] = await Promise.all([cookies(), headers()])
  return localeFrom(cookieStore.get('locale')?.value, headerList.get('accept-language'))
}
