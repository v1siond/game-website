import { NextResponse, type NextRequest } from 'next/server'
import {
  GITHUB_AUTHORIZE_URL,
  STATE_COOKIE,
  STATE_MAX_AGE_SECONDS,
  callbackUrl,
  newState,
  oauthConfig,
  scopeFrom,
} from './oauth'

export const dynamic = 'force-dynamic'

/** Starts the GitHub sign in Decap opens in its popup: a fresh state in a cookie, then GitHub. */
export function GET(request: NextRequest) {
  const config = oauthConfig(request)
  if (!config) return new NextResponse('GitHub sign in is not set up on this host', { status: 503 })

  const state = newState()
  const authorize = new URL(GITHUB_AUTHORIZE_URL)
  authorize.search = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: callbackUrl(config.siteOrigin),
    scope: scopeFrom(request.nextUrl.searchParams.get('scope')),
    state,
  }).toString()

  const response = NextResponse.redirect(authorize)
  response.cookies.set(STATE_COOKIE, state, {
    httpOnly: true,
    secure: config.siteOrigin.startsWith('https://'),
    sameSite: 'lax',
    path: '/api/decap-auth',
    maxAge: STATE_MAX_AGE_SECONDS,
  })
  return response
}
