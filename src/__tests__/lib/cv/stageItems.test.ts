import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { CV_CONTENT_FILES, cvDataFrom, worldCV, type CVContentFiles } from '@/lib/cv/content'
import { viewFor, yearOf } from '@/lib/cv/cvView'
import { labelsFor, type LabelsFile } from '@/lib/cv/labels'
import { sectionPlan, type SectionSlot } from '@/lib/cv/sectionPlan'
import { muayThaiFacts } from '@/lib/cv/sectionText'
import { stageItems } from '@/lib/cv/stageItems'

// How many cards a section's theatre counts (what its frame marks with data-stage-items), read off its
// slot: the cards before the props (the Muay Thai record's facts) apart from the props themselves.

const read = (name: string) => JSON.parse(readFileSync(join(process.cwd(), 'content', 'cv', `${name}.json`), 'utf8'))
const cv = worldCV(cvDataFrom(Object.fromEntries(CV_CONTENT_FILES.map((name) => [name, read(name)])) as CVContentFiles, 'en'))
const labels = labelsFor(read('labels') as LabelsFile, 'en')
const NOW = yearOf(new Date('2026-11-22T12:00:00Z'))
const slotsOf = (profession: string): SectionSlot[] => sectionPlan(viewFor(cv, profession, 'world', NOW).sections, cv.professionalSummary.bio)
const slot = <Id extends SectionSlot['id']>(profession: string, id: Id) => slotsOf(profession).find((s) => s.id === id) as Extract<SectionSlot, { id: Id }>

describe('stageItems', () => {
  it('counts the About items the world marks, none before them', () => {
    expect(stageItems(slot('engineer', 'about'), labels, 5)).toEqual({ lead: 0, count: 5 })
  })

  it.each([
    ['work', (s: SectionSlot) => (s.id === 'work' ? s.jobs.length : -1)],
    ['tech', (s: SectionSlot) => (s.id === 'tech' ? s.categories.length : -1)],
    ['services', (s: SectionSlot) => (s.id === 'services' ? s.services.length : -1)],
    ['projects', (s: SectionSlot) => (s.id === 'projects' ? s.projects.length : -1)],
    ['ventures', (s: SectionSlot) => (s.id === 'ventures' ? s.companies.length : -1)],
  ] as const)('counts one card per entry of the engineer %s', (id, entries) => {
    const s = slot('engineer', id)
    expect(entries(s)).toBeGreaterThan(0)
    expect(stageItems(s, labels, 0)).toEqual({ lead: 0, count: entries(s) })
  })

  it('counts one card per band', () => {
    const s = slot('drummer', 'bands')
    expect(stageItems(s, labels, 0)).toEqual({ lead: 0, count: s.bands.length })
  })

  it('puts the Muay Thai record facts before the achievements', () => {
    const s = slot('fighter', 'muayThai')
    const facts = muayThaiFacts(s.martialArts, labels).length
    expect(facts).toBeGreaterThan(0)
    expect(stageItems(s, labels, 0)).toEqual({ lead: facts, count: s.martialArts.primary.achievements.length })
  })
})
