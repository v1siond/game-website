import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { errorPagesFrom, errorTitle, localeOfPath } from '@/lib/cv/errorPages'
import type { CVContentFiles } from '@/lib/cv/content'

// The real Decap files, read the way src/lib/cv-data.ts reads them.
const read = <Name extends 'labels' | 'summary'>(name: Name): CVContentFiles[Name] =>
  JSON.parse(readFileSync(join(process.cwd(), 'content', 'cv', `${name}.json`), 'utf8'))

const files = { labels: read('labels'), summary: read('summary') }

describe('localeOfPath', () => {
  it.each([
    ['/es/missing', 'es'],
    ['/it', 'it'],
    ['/it/cv/old', 'it'],
    ['/en/anything', 'en'],
  ])('reads %s as %s from its first segment', (path, locale) => {
    expect(localeOfPath(path)).toBe(locale)
  })

  it.each([['/cv'], ['/espresso'], ['/fr/cv'], ['/'], [null]])('reads %s as English', (path) => {
    expect(localeOfPath(path)).toBe('en')
  })
})

describe('errorPagesFrom', () => {
  it('gives each locale its own error text and his name from the summary', () => {
    const pages = errorPagesFrom(files)
    expect(pages.es.text.notFoundHeadline).not.toBe(pages.en.text.notFoundHeadline)
    expect(pages.it.text.goHome).not.toBe(pages.en.text.goHome)
    expect(pages.es.fullName).toBe(files.summary.en.fullName)
  })

  it('keeps the English text for a key a locale lacks', () => {
    const { notFoundDetail: _dropped, ...italian } = files.labels.it!.labels!.errors!
    const labels = { ...files.labels, it: { labels: { ...files.labels.it!.labels, errors: italian } } }
    const pages = errorPagesFrom({ ...files, labels })
    expect(pages.it.text.notFoundDetail).toBe(pages.en.text.notFoundDetail)
  })
})

describe('errorTitle', () => {
  it('names the failure, then him', () => {
    expect(errorTitle('Server error', files.summary.en.fullName)).toBe(`Server error | ${files.summary.en.fullName}`)
  })
})
