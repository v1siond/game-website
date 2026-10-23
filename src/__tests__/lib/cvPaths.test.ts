import { CV_PATHS, cvPath, cvRedirectPath } from '@/i18n/config'

describe('cvPath', () => {
  it('keeps English on /cv and puts every other language in front of it', () => {
    expect(cvPath('en')).toBe('/cv')
    expect(cvPath('es')).toBe('/es/cv')
    expect(cvPath('it')).toBe('/it/cv')
  })

  it('lists one CV address per language', () => {
    expect(CV_PATHS).toEqual({ en: '/cv', es: '/es/cv', it: '/it/cv' })
  })
})

describe('cvRedirectPath', () => {
  it('sends /cv to the language the cookie names', () => {
    expect(cvRedirectPath('it', 'es-PE,es;q=0.9')).toBe('/it/cv')
  })

  it('falls back to the first Accept-Language the CV has', () => {
    expect(cvRedirectPath(undefined, 'fr-FR,es;q=0.9,en;q=0.8')).toBe('/es/cv')
  })

  it('stays on /cv for English, from the cookie, the header or neither', () => {
    expect(cvRedirectPath('en', 'es-PE,es;q=0.9')).toBeNull()
    expect(cvRedirectPath(undefined, 'en-US,en;q=0.9')).toBeNull()
    expect(cvRedirectPath(undefined, null)).toBeNull()
  })
})
