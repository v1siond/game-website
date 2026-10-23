// The security headers next.config.ts sends. Plain functions of the mode, so the policies are tested
// without a server.
//
// The pages allow inline scripts ('unsafe-inline'): Next writes its flight data as inline scripts that
// change on every page and every build, so hashes cannot list them, and nonces would make every page
// render per request instead of once at build time. What keeps that safe is that nothing a visitor
// sends is ever rendered, plus the directives below (no plugins, no <base>, no framing).

type Mode = 'development' | 'production'

type Directives = Record<string, readonly string[]>

interface HeaderRule {
  source: string
  headers: { key: string; value: string }[]
}

const policy = (directives: Directives): string =>
  Object.entries(directives)
    .map(([name, sources]) => [name, ...sources].join(' '))
    .join('; ')

// Next's dev server evaluates its module code and hot reloads over a websocket; a build needs neither.
const DEV_SCRIPT = ["'unsafe-eval'"]
const DEV_CONNECT = ['ws:']
const onlyIn = (mode: Mode, sources: readonly string[]): readonly string[] => (mode === 'development' ? sources : [])

// Sent over https only in production, where every request already is; on the http dev server it would
// upgrade the page's own files to an https port that does not answer.
const UPGRADE: Directives = { 'upgrade-insecure-requests': [] }

/** The policy of every page. Each source and why:
 *  - default-src 'self': fonts (next/font serves them), the music in public/music, the manifest.
 *  - script-src 'self' 'unsafe-inline': the Next chunks and its inline flight scripts, the home page's
 *    world pending script, the JSON-LD; Netlify's badge script is served from the site's own origin.
 *  - style-src 'self' 'unsafe-inline': the CSS files, React style props and styled-jsx (the CV print
 *    styles), the badge's srcdoc frame.
 *  - img-src 'self' data: blob:: the world previews and sprites, inline SVG data URLs, and the canvas the
 *    CV PDF export draws.
 *  - connect-src 'self': client navigation fetches the pages' RSC payloads from the site. */
export function siteCsp(mode: Mode): string {
  return policy({
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'", ...onlyIn(mode, DEV_SCRIPT)],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", 'data:', 'blob:'],
    'font-src': ["'self'"],
    'connect-src': ["'self'", ...onlyIn(mode, DEV_CONNECT)],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'frame-ancestors': ["'none'"],
    ...(mode === 'production' ? UPGRADE : {}),
  })
}

// The two inline scripts of public/admin/index.html, by hash (the test recomputes them from the file).
const ADMIN_INLINE_SCRIPTS = [
  "'sha256-5YjSrDzfFbTU+6s6qQZAL1KK1CjZ5kiwK0o0DUav6Pc='",
  "'sha256-nfeQR493MaMZe126lUkDzBObGGoM4fB4K0HC4HLw584='",
]

/** The policy of the Decap admin, a static page: its own two inline scripts by hash, the pinned bundle
 *  from unpkg, the GitHub API it reads and commits the content through, GitHub's avatar and file hosts
 *  for the pictures it shows, and in development the local decap-server it writes to instead. */
export function adminCsp(mode: Mode): string {
  return policy({
    'default-src': ["'self'"],
    'script-src': ["'self'", 'https://unpkg.com', ...ADMIN_INLINE_SCRIPTS, ...onlyIn(mode, DEV_SCRIPT)],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", 'data:', 'blob:', 'https://avatars.githubusercontent.com', 'https://raw.githubusercontent.com'],
    'font-src': ["'self'", 'data:'],
    'connect-src': ["'self'", 'https://api.github.com', ...onlyIn(mode, ['http://localhost:8081'])],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'frame-ancestors': ["'none'"],
    ...(mode === 'production' ? UPGRADE : {}),
  })
}

const csp = (value: string) => [{ key: 'Content-Security-Policy', value }]

/** Every header rule, in order (a later rule's header of the same name wins). The API routes keep the
 *  policy they send themselves (the OAuth callback's nonce policy). */
export function securityHeaders(mode: Mode): HeaderRule[] {
  return [
    {
      source: '/:path*',
      headers: [
        { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
      ],
    },
    { source: '/((?!admin|api/).*)', headers: csp(siteCsp(mode)) },
    { source: '/admin', headers: csp(adminCsp(mode)) },
    { source: '/admin/:path*', headers: csp(adminCsp(mode)) },
  ]
}
