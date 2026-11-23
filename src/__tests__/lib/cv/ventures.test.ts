import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { CV_CONTENT_FILES, cvDataFrom, type CVContentFiles, type CVData } from '@/lib/cv/content'
import { venturesFor } from '@/lib/cv/cvView'
import type { Locale } from '@/i18n/config'

type Company = CVData['companies'][number]

const read = (name: string) => JSON.parse(readFileSync(join(process.cwd(), 'content', 'cv', `${name}.json`), 'utf8'))
const files = Object.fromEntries(CV_CONTENT_FILES.map((name) => [name, read(name)])) as CVContentFiles
const loadCV = (locale: Locale): CVData => cvDataFrom(files, locale)

const company = (id: string, flags: Partial<Company> = {}): Company => ({
  id,
  slug: id,
  name: id,
  tagline: '',
  description: '',
  url: '',
  services: [],
  icon: '',
  ...flags,
})

describe('venturesFor', () => {
  it('lists only the companies marked as ventures, his own products first, each group in file order', () => {
    const companies = [
      company('client'),
      company('agency', { venture: true }),
      company('second-product', { venture: true, featured: true }),
      company('first-product', { venture: true, featured: true }),
      company('product-off', { featured: true }),
    ]
    expect(venturesFor(companies).map(({ id }) => id)).toEqual(['second-product', 'first-product', 'agency'])
  })

  it.each(['en', 'es', 'it'] as const)('shows Sillabo, Nebulith and InsurAdmin in %s, in that order', (locale) => {
    expect(venturesFor(loadCV(locale).companies).map(({ id }) => id)).toEqual(['sillabo', 'nebulith', 'insuradmin'])
  })

  it('keeps every company for the current roles that link one', () => {
    expect(loadCV('en').companies.map(({ id }) => id)).toEqual(expect.arrayContaining(['dba', 'pmx', 'grctechme', 'insuradmin']))
  })
})
