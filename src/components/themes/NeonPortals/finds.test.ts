import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { CV_CONTENT_FILES, cvDataFrom, worldCV, type CVContentFiles } from '@/lib/cv/content'
import { viewFor } from '@/lib/cv/cvView'
import { sectionPlan, type SectionSlot } from '@/lib/cv/sectionPlan'
import { findId, findTotal } from './finds'

// The tally's total: one find per thing he opens on the run, counted from the sections the active
// profession shows, so the count he sees at the save monitor is the count he could have reached.

const cv = worldCV(
  cvDataFrom(
    Object.fromEntries(
      CV_CONTENT_FILES.map((name) => [name, JSON.parse(readFileSync(join(process.cwd(), 'content', 'cv', `${name}.json`), 'utf8'))]),
    ) as CVContentFiles,
    'en',
  ),
)

const planOf = (profession: string): SectionSlot[] => sectionPlan(viewFor(cv, profession, 'world', 2026).sections, cv.professionalSummary.bio)

describe('findTotal', () => {
  it('counts the engineer run: the count box, one box per category, the iron box and one gem per venture', () => {
    const expected = 1 + cv.techStack.length + 1 + cv.companies.length
    expect(findTotal(planOf('engineer'))).toBe(expected)
  })

  it('counts nothing for the jobs and the projects, which he passes and points at', () => {
    const plan = planOf('engineer').filter((slot) => slot.id === 'work' || slot.id === 'projects')
    expect(plan).toHaveLength(2)
    expect(findTotal(plan)).toBe(0)
  })

  it('counts one box lid per band for the drummer', () => {
    expect(findTotal(planOf('drummer'))).toBe(cv.bands.length)
  })

  it('counts one mask step per achievement for the fighter, at most three', () => {
    expect(findTotal(planOf('fighter'))).toBe(Math.min(3, cv.martialArts.primary.achievements.length))
    const record = { ...cv.martialArts, primary: { ...cv.martialArts.primary, achievements: ['a', 'b', 'c', 'd', 'e'] } }
    expect(findTotal([{ id: 'muayThai', titleKey: 'muayThai', martialArts: record }])).toBe(3)
  })

  it('leaves out a section the plan leaves out, so an empty list adds nothing', () => {
    const empty = { ...cv, techStack: [], services: [], companies: [] }
    const plan = sectionPlan(viewFor(empty, 'engineer', 'world', 2026).sections, cv.professionalSummary.bio)
    expect(findTotal(plan)).toBe(1)
  })
})

describe('findId', () => {
  it('names a find by its section and its item, so two sections never share an id', () => {
    expect(findId('tech', 'languages')).toBe('tech:languages')
    expect(findId('muayThai', 2)).toBe('muayThai:2')
    expect(findId('bands', 'x')).not.toBe(findId('ventures', 'x'))
  })
})
