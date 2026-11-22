import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { CV_PATHS, locales } from '@/i18n/config'
import { ENGINE_LINK } from '@/lib/engineLink'
import { fillLabel, labelsFor, type LabelsFile } from '@/lib/cv/labels'
import { siteLinks, type EngineWord } from '@/lib/cv/siteLinks'

// The CV link and the engine link every world draws: one address for the CV, the engine always in a new
// tab, and an accessible name that holds the word the button shows (WCAG 2.5.3, label in name).

const file = JSON.parse(readFileSync(join(process.cwd(), 'content', 'cv', 'labels.json'), 'utf8')) as LabelsFile

const WORDS: EngineWord[] = ['engine', 'engineShort', 'portfolio', 'play', 'enter']

const cases = locales.flatMap((locale) => WORDS.map((word) => [locale, word] as const))

describe('siteLinks', () => {
  const english = labelsFor(file, 'en')

  it('sends the CV link to the one /cv address, in the same tab, named by its visible label', () => {
    expect(siteLinks(english, 'engine').cv).toEqual({ id: 'cv', label: english.actions.cv, linkProps: { href: CV_PATHS.en } })
  })

  it.each(cases)('in %s, the %s word labels the engine link and opens the engine in a new tab', (locale, word) => {
    const labels = labelsFor(file, locale)
    const { engine } = siteLinks(labels, word)
    const newTabSuffix = fillLabel(labels.links.newTab, { name: '' })

    expect(engine.id).toBe('engine')
    expect(engine.label).toBe(labels.actions[word])
    expect(engine.linkProps).toMatchObject(ENGINE_LINK)
    expect(engine.linkProps['aria-label']?.toLowerCase()).toContain(labels.actions[word].toLowerCase())
    expect(engine.linkProps['aria-label']?.endsWith(newTabSuffix)).toBe(true)
  })

  it('names the Nebulith and Game buttons by the project they open', () => {
    expect(siteLinks(english, 'engineShort').engine.linkProps['aria-label']).toBe('View Nebulith game engine project (opens in a new tab)')
    expect(siteLinks(english, 'play').engine.linkProps['aria-label']).toBe('Play (opens in a new tab)')
  })
})
