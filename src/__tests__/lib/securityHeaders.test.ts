import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { adminCsp, securityHeaders, siteCsp } from '@/lib/securityHeaders'

// Each directive of a policy by name, so a test reads one directive's sources.
const directives = (policy: string): Map<string, string[]> =>
  new Map(policy.split(';').map((part) => part.trim().split(/\s+/)).map(([name, ...sources]) => [name, sources]))

const headerValue = (mode: 'development' | 'production', source: string, key: string): string | undefined =>
  securityHeaders(mode)
    .filter((rule) => rule.source === source)
    .flatMap((rule) => rule.headers)
    .findLast((header) => header.key === key)?.value

describe('siteCsp', () => {
  const production = directives(siteCsp('production'))

  it('allows only same origin and inline scripts, no plugins, no base change, no framing', () => {
    expect(production.get('script-src')).toEqual(["'self'", "'unsafe-inline'"])
    expect(production.get('object-src')).toEqual(["'none'"])
    expect(production.get('base-uri')).toEqual(["'self'"])
    expect(production.get('frame-ancestors')).toEqual(["'none'"])
    expect(production.get('default-src')).toEqual(["'self'"])
  })

  it('adds eval and the hot reload socket only in development', () => {
    const development = directives(siteCsp('development'))

    expect(development.get('script-src')).toContain("'unsafe-eval'")
    expect(development.get('connect-src')).toContain('ws:')
    expect(production.get('script-src')).not.toContain("'unsafe-eval'")
    expect(production.get('connect-src')).toEqual(["'self'"])
  })
})

describe('adminCsp', () => {
  const admin = directives(adminCsp('production'))

  it('lets the admin load the pinned Decap bundle and talk to the GitHub API', () => {
    expect(admin.get('script-src')).toContain('https://unpkg.com')
    expect(admin.get('connect-src')).toContain('https://api.github.com')
    expect(admin.get('frame-ancestors')).toEqual(["'none'"])
    expect(admin.get('object-src')).toEqual(["'none'"])
  })

  it('allows exactly the inline scripts public/admin/index.html holds, by hash', () => {
    const html = readFileSync(join(process.cwd(), 'public', 'admin', 'index.html'), 'utf8')
    const hashes = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(
      ([, body]) => `'sha256-${createHash('sha256').update(body).digest('base64')}'`,
    )

    expect(hashes).toHaveLength(2)
    expect(admin.get('script-src')?.filter((source) => source.startsWith("'sha256-"))).toEqual(hashes)
    expect(admin.get('script-src')).not.toContain("'unsafe-inline'")
  })
})

describe('securityHeaders', () => {
  it('sends the hardening headers on every path', () => {
    expect(headerValue('production', '/:path*', 'Strict-Transport-Security')).toBe('max-age=63072000; includeSubDomains')
    expect(headerValue('production', '/:path*', 'Referrer-Policy')).toBe('strict-origin-when-cross-origin')
    expect(headerValue('production', '/:path*', 'Permissions-Policy')).toBe('camera=(), microphone=(), geolocation=()')
    expect(headerValue('production', '/:path*', 'X-Content-Type-Options')).toBe('nosniff')
  })

  it('gives the pages the site policy, the admin its own, and leaves the API routes their own', () => {
    const rules = securityHeaders('production').filter((rule) => rule.headers.some((header) => header.key === 'Content-Security-Policy'))

    expect(rules.map((rule) => rule.source)).toEqual(['/((?!admin|api/).*)', '/admin', '/admin/:path*'])
    expect(headerValue('production', '/admin', 'Content-Security-Policy')).toBe(adminCsp('production'))
  })
})
