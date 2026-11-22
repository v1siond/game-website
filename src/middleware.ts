import { NextResponse, type NextRequest } from 'next/server'
import { LOCALE_COOKIE, cvRedirectPath } from '@/i18n/config'

// /cv is the English CV. A visitor who picked another language (the `locale` cookie the switcher writes)
// or whose browser asks for one goes to that language's address; /es/cv and /it/cv never redirect, so a
// shared link always opens in its own language. Done here so the CV pages read no request and stay static.
export function middleware(request: NextRequest) {
  const target = cvRedirectPath(request.cookies.get(LOCALE_COOKIE)?.value, request.headers.get('accept-language'))
  if (!target) return NextResponse.next()
  return NextResponse.redirect(new URL(target, request.url))
}

export const config = { matcher: '/cv' }
