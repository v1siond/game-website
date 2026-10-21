import { randomBytes, timingSafeEqual } from 'node:crypto'
import type { NextRequest } from 'next/server'

// GitHub OAuth for Decap's GitHub backend (production editing at /admin). Decap opens
// /api/decap-auth in a popup; the callback hands the token back to the admin window through the
// postMessage handshake Decap expects ("authorizing:github", then "authorization:github:<status>:<json>").

export const STATE_COOKIE = 'decap_oauth_state'
export const STATE_MAX_AGE_SECONDS = 600
export const GITHUB_AUTHORIZE_URL = 'https://github.com/login/oauth/authorize'
export const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token'

// Decap asks for `repo`; `public_repo` is enough when the repo is public. Anything else is refused.
const ALLOWED_SCOPES = new Set(['repo', 'public_repo'])
const DEFAULT_SCOPE = 'repo'

export interface OAuthConfig {
  clientId: string
  clientSecret: string
  siteOrigin: string
}

/** The OAuth app settings from env, or null when the app is not set up on this host. */
export function oauthConfig(request: NextRequest): OAuthConfig | null {
  const clientId = process.env.DECAP_GITHUB_CLIENT_ID
  const clientSecret = process.env.DECAP_GITHUB_CLIENT_SECRET
  if (!clientId || !clientSecret) return null

  return { clientId, clientSecret, siteOrigin: (process.env.DECAP_SITE_ORIGIN ?? request.nextUrl.origin).replace(/\/$/, '') }
}

export const callbackUrl = (siteOrigin: string) => `${siteOrigin}/api/decap-auth/callback`

export const scopeFrom = (requested: string | null) =>
  requested && ALLOWED_SCOPES.has(requested) ? requested : DEFAULT_SCOPE

export const newState = () => randomBytes(32).toString('hex')

/** True only when the state GitHub sent back is the one this browser was given. */
export function stateMatches(returned: string | null, expected: string | undefined): boolean {
  if (!returned || !expected) return false
  const a = Buffer.from(returned)
  const b = Buffer.from(expected)
  return a.length === b.length && timingSafeEqual(a, b)
}

export type TokenResult = { ok: true; token: string } | { ok: false; error: string }

/** Trades the one time code for an access token. The token is only ever returned, never logged. */
export async function exchangeCode(config: OAuthConfig, code: string): Promise<TokenResult> {
  const response = await fetch(GITHUB_TOKEN_URL, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code,
      redirect_uri: callbackUrl(config.siteOrigin),
    }),
    cache: 'no-store',
  }).catch(() => null)
  if (!response) return { ok: false, error: 'GitHub could not be reached' }
  if (!response.ok) return { ok: false, error: `GitHub answered ${response.status}` }

  const body = (await response.json()) as { access_token?: string; error?: string }
  if (!body.access_token) return { ok: false, error: body.error ?? 'GitHub returned no token' }
  return { ok: true, token: body.access_token }
}

// JSON inside a <script> must not be able to close the tag or open a comment.
const scriptSafeJson = (value: unknown) =>
  JSON.stringify(value).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026')

/**
 * The popup page that finishes the handshake. It answers only the admin window on the pinned
 * origin, and only after that window replied to "authorizing:github", so no other page can read the token.
 */
export function handshakeResponse(siteOrigin: string, result: TokenResult): Response {
  const nonce = randomBytes(16).toString('base64')
  const message = result.ok
    ? `authorization:github:success:${JSON.stringify({ token: result.token, provider: 'github' })}`
    : `authorization:github:error:${JSON.stringify({ message: result.error })}`

  const html = `<!doctype html><html><head><meta charset="utf-8"><title>Signing in</title></head><body>
<script nonce="${nonce}">
(function () {
  var origin = ${scriptSafeJson(siteOrigin)};
  var message = ${scriptSafeJson(message)};
  if (!window.opener) return;
  window.addEventListener('message', function (event) {
    if (event.origin !== origin || event.data !== 'authorizing:github') return;
    window.opener.postMessage(message, origin);
  });
  window.opener.postMessage('authorizing:github', origin);
})();
</script></body></html>`

  return new Response(html, {
    status: result.ok ? 200 : 400,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'Referrer-Policy': 'no-referrer',
      'Content-Security-Policy': `default-src 'none'; script-src 'nonce-${nonce}'; frame-ancestors 'none'`,
    },
  })
}
