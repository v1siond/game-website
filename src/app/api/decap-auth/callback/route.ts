import { NextResponse, type NextRequest } from 'next/server'
import {
  STATE_COOKIE,
  exchangeCode,
  handshakeResponse,
  oauthConfig,
  stateMatches,
  type OAuthConfig,
  type TokenResult,
} from '../oauth'

export const dynamic = 'force-dynamic'

async function tokenFor(request: NextRequest, config: OAuthConfig): Promise<TokenResult> {
  const params = request.nextUrl.searchParams
  if (!stateMatches(params.get('state'), request.cookies.get(STATE_COOKIE)?.value)) {
    return { ok: false, error: 'Sign in expired or was not started here, try again' }
  }

  const code = params.get('code')
  if (!code) return { ok: false, error: params.get('error_description') ?? 'GitHub sent no code' }

  return exchangeCode(config, code)
}

/** GitHub sends the browser back here: check the state, trade the code, hand the token to Decap. */
export async function GET(request: NextRequest) {
  const config = oauthConfig(request)
  if (!config) return new NextResponse('GitHub sign in is not set up on this host', { status: 503 })

  const result = await tokenFor(request, config)
  const response = handshakeResponse(config.siteOrigin, result)
  // The state is single use: cleared whatever the outcome.
  response.headers.append(
    'Set-Cookie',
    `${STATE_COOKIE}=; Path=/api/decap-auth; Max-Age=0; HttpOnly; SameSite=Lax`,
  )
  return response
}
