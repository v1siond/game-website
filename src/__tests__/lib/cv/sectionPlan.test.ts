import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { CV_CONTENT_FILES, cvDataFrom, worldCV, type CVContentFiles } from '@/lib/cv/content'
import { viewFor, yearOf, type SectionsOf } from '@/lib/cv/cvView'
import { everySection, sectionPlan } from '@/lib/cv/sectionPlan'

// Which sections a profession shows and in which order, decided once for every world: the engineer's six
// in a fixed order, each left out when it has nothing to show; one section for the drummer and the fighter.

const cv = worldCV(
  cvDataFrom(
    Object.fromEntries(
      CV_CONTENT_FILES.map((name) => [name, JSON.parse(readFileSync(join(process.cwd(), 'content', 'cv', `${name}.json`), 'utf8'))]),
    ) as CVContentFiles,
    'en',
  ),
)

const NOW = yearOf(new Date('2026-11-22T12:00:00Z'))
const bio = cv.professionalSummary.bio
const sectionsOf = (profession: string) => viewFor(cv, profession, 'world', NOW).sections
const engineer = sectionsOf('engineer') as SectionsOf<'engineer'>

const ids = (sections: Parameters<typeof sectionPlan>[0], text = bio) => sectionPlan(sections, text).map((slot) => slot.id)

describe('sectionPlan', () => {
  it('gives the engineer the six sections in order, each with its entries', () => {
    const plan = sectionPlan(engineer, bio)
    expect(plan.map((slot) => slot.id)).toEqual(['about', 'work', 'tech', 'services', 'projects', 'ventures'])
    expect(plan).toEqual([
      { id: 'about', titleKey: 'about', bio },
      { id: 'work', titleKey: 'workExperience', jobs: engineer.jobs },
      { id: 'tech', titleKey: 'techStack', categories: engineer.techStack },
      { id: 'services', titleKey: 'services', services: engineer.services },
      { id: 'projects', titleKey: 'projects', projects: engineer.projects },
      { id: 'ventures', titleKey: 'ventures', companies: engineer.companies },
    ])
  })

  it.each([
    ['jobs', 'work'],
    ['techStack', 'tech'],
    ['services', 'services'],
    ['projects', 'projects'],
    ['companies', 'ventures'],
  ] as const)('drops the section of an empty %s list and keeps the rest in order', (list, id) => {
    const full = ['about', 'work', 'tech', 'services', 'projects', 'ventures']
    expect(ids({ ...engineer, [list]: [] })).toEqual(full.filter((kept) => kept !== id))
  })

  it('drops About when the bio is empty', () => {
    expect(ids(engineer, '')).toEqual(['work', 'tech', 'services', 'projects', 'ventures'])
  })

  it('gives the drummer the bands, with the musician block', () => {
    const drummer = sectionsOf('drummer') as SectionsOf<'drummer'>
    expect(sectionPlan(drummer, bio)).toEqual([{ id: 'bands', titleKey: 'bands', musician: drummer.musician, bands: drummer.bands }])
  })

  it('gives the fighter the Muay Thai record', () => {
    const fighter = sectionsOf('fighter') as SectionsOf<'fighter'>
    expect(sectionPlan(fighter, bio)).toEqual([{ id: 'muayThai', titleKey: 'muayThai', martialArts: fighter.martialArts }])
  })
})

describe('everySection', () => {
  it('lays every profession on one page: the engineer six, then the bands, then the Muay Thai record', () => {
    const plan = everySection(cv, NOW)
    expect(plan.map((slot) => slot.id)).toEqual(['about', 'work', 'tech', 'services', 'projects', 'ventures', 'bands', 'muayThai'])
    expect(plan.slice(0, 6)).toEqual(sectionPlan(engineer, bio))
    expect(plan[6]).toEqual(sectionPlan(sectionsOf('drummer'), bio)[0])
    expect(plan[7]).toEqual(sectionPlan(sectionsOf('fighter'), bio)[0])
  })

  it('cuts the work to the world view of the year it is given, as one profession would', () => {
    const work = everySection(cv, NOW).find((slot) => slot.id === 'work')
    expect(work).toEqual({ id: 'work', titleKey: 'workExperience', jobs: engineer.jobs })
  })
})
