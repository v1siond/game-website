import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { cvDataFrom, CV_CONTENT_FILES, type CVContentFiles } from '@/lib/cv/content'
import { fillLabel, labelsFor, type Labels, type LabelsFile } from '@/lib/cv/labels'
import { localeFrom, locales } from '@/i18n/config'

// The real Decap files, read the way src/lib/cv-data.ts reads them.
const readFiles = (): CVContentFiles =>
  Object.fromEntries(
    CV_CONTENT_FILES.map((name) => [
      name,
      JSON.parse(readFileSync(join(process.cwd(), 'content', 'cv', `${name}.json`), 'utf8')),
    ]),
  ) as CVContentFiles

const keysOf = (labels: Labels): string[] =>
  Object.entries(labels).flatMap(([group, entries]) => Object.keys(entries).map((key) => `${group}.${key}`))

describe('labels.json', () => {
  const file = readFiles().labels
  const englishKeys = keysOf(file.en.labels)

  it.each(locales.filter((locale) => locale !== 'en'))('translates every English key in %s', (locale) => {
    const translated = file[locale]?.labels as Labels
    expect(keysOf(translated).sort()).toEqual([...englishKeys].sort())
  })

  it('has no empty label in any locale', () => {
    locales.forEach((locale) => {
      const values = Object.values(labelsFor(file, locale)).flatMap((group) => Object.values(group))
      expect(values.every((value) => typeof value === 'string' && value.trim() !== '')).toBe(true)
    })
  })

  it('keeps the same {slots} in every translation of a label', () => {
    const slots = (text: string) => (text.match(/\{\w+\}/g) ?? []).sort()
    locales.forEach((locale) => {
      const labels = labelsFor(file, locale)
      Object.entries(file.en.labels).forEach(([group, entries]) => {
        Object.entries(entries).forEach(([key, english]) => {
          const translated = (labels[group as keyof Labels] as Record<string, string>)[key]
          expect([`${group}.${key}`, slots(translated)]).toEqual([`${group}.${key}`, slots(english as string)])
        })
      })
    })
  })
})

describe('labelsFor', () => {
  const file = readFiles().labels

  it('picks the labels of the asked locale', () => {
    expect(labelsFor(file, 'es').sections.workExperience).toBe(file.es?.labels?.sections?.workExperience)
    expect(labelsFor(file, 'es').sections.workExperience).not.toBe(file.en.labels.sections.workExperience)
  })

  it('falls back to English for a key the locale lacks, keeping the rest of its group', () => {
    const { workExperience: _dropped, ...rest } = file.es!.labels!.sections!
    const partial: LabelsFile = { en: file.en, es: { labels: { ...file.es!.labels, sections: rest } } }
    const labels = labelsFor(partial, 'es')

    expect(labels.sections.workExperience).toBe(file.en.labels.sections.workExperience)
    expect(labels.sections.about).toBe(file.es?.labels?.sections?.about)
  })

  it('falls back to English for a missing group and a missing locale', () => {
    const { cvPage: _dropped, ...rest } = file.it!.labels!
    expect(labelsFor({ en: file.en, it: { labels: rest } }, 'it').cvPage).toEqual(file.en.labels.cvPage)
    expect(labelsFor({ en: file.en }, 'it')).toEqual(file.en.labels)
  })

  it('reaches the pages through the CV loader', () => {
    expect(cvDataFrom(readFiles(), 'it').labels).toEqual(labelsFor(file, 'it'))
  })
})

describe('fillLabel', () => {
  it('puts the values into the slots', () => {
    expect(fillLabel('{start} to {end}', { start: 2016, end: 2018 })).toBe('2016 to 2018')
  })

  it('leaves a slot with no value as written', () => {
    expect(fillLabel('Since {year}', {})).toBe('Since {year}')
  })
})

describe('localeFrom', () => {
  it('takes the cookie first, then the first known Accept-Language, then English', () => {
    expect(localeFrom('it', 'es-PE,es;q=0.9')).toBe('it')
    expect(localeFrom(undefined, 'fr-FR,es;q=0.9,en;q=0.8')).toBe('es')
    expect(localeFrom('xx', null)).toBe('en')
  })
})
