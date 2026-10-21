import type { Band, CVData, Job, MartialArts, Musician, Project, TechCategory } from './content'
import { DEFAULT_PROFESSION, isProfession, type Profession } from './professions'

// What one world draws for one profession: the recruiter first screen and only that profession's entries.
// Every string is taken from the content; the worlds add their own look and labels.

/** 'world' is a themed page (recent work and highlights only); 'full' is the /cv page (everything). */
export type CVViewMode = 'world' | 'full'

export interface HeroAction {
  href: string
  value: string
}

export interface RecruiterHero {
  name: string
  headline: string
  tagline: string
  line: string
  actions: { email: HeroAction; linkedin: HeroAction }
}

export type ProfessionSections =
  | { profession: 'engineer'; jobs: Job[]; projects: Project[]; techStack: Array<TechCategory & { id: string }> }
  | { profession: 'drummer'; musician: Musician; bands: Band[] }
  | { profession: 'fighter'; martialArts: MartialArts }

export interface CVView {
  profession: Profession
  hero: RecruiterHero
  sections: ProfessionSections
}

// A world shows work from the last five calendar years: with the clock in 2026, anything that ended in
// 2021 or later. Older entries stay on /cv, and a highlight is shown whatever its age.
export const RECENT_WORK_YEARS = 5

const recentSince = (now: Date): number => now.getFullYear() - RECENT_WORK_YEARS

// Whether an entry belongs in the view: everything on /cv; in a world, current, recent or a highlight.
type Keep = (entry: { current: boolean; highlight: boolean }, endYear: number | null) => boolean

const keepAll: Keep = () => true

const keepRecent =
  (since: number): Keep =>
  (entry, endYear) => {
    if (entry.current || entry.highlight) return true
    // A project with no years recorded has no age to judge it by, so it is not cut.
    if (endYear === null) return true
    return endYear >= since
  }

const KEEP_FOR_MODE: Record<CVViewMode, (now: Date) => Keep> = {
  full: () => keepAll,
  world: (now) => keepRecent(recentSince(now)),
}

// Newest first. A current entry has no end, so it sorts after every dated one; an undated one sorts last.
// Finite sentinels keep the subtraction a number, so ties fall through and keep the stored order.
const ONGOING = Number.MAX_SAFE_INTEGER
const UNDATED = Number.MIN_SAFE_INTEGER

const byRecency =
  <Entry>(end: (entry: Entry) => number, start: (entry: Entry) => number) =>
  (a: Entry, b: Entry): number =>
    end(b) - end(a) || start(b) - start(a)

const jobEnd = (job: Job): number => (job.endDate ? job.endDate.getTime() : ONGOING)

const bandEnd = (band: Band): number => {
  if (band.current) return ONGOING
  return band.endYear ?? UNDATED
}

const jobsFor = (cv: CVData, keep: Keep): Job[] =>
  cv.workExperience
    .filter((job) => keep(job, job.endDate ? job.endDate.getFullYear() : null))
    .sort(byRecency(jobEnd, (job) => job.startDate.getTime()))

// Projects keep the order he sets in Decap (position), the order the Contract fixes for them.
const projectsFor = (cv: CVData, keep: Keep): Project[] =>
  cv.projects.filter((project) => keep(project, project.endYear)).sort((a, b) => a.position - b.position)

const bandsFor = (cv: CVData): Band[] => [...cv.bands].sort(byRecency(bandEnd, (band) => band.startYear ?? UNDATED))

// The bands and the Muay Thai record are listed whole: the spec names every band and every martial arts
// fact, and neither carries the highlight toggle the cut relies on.
const SECTIONS_FOR: Record<Profession, (cv: CVData, keep: Keep) => ProfessionSections> = {
  engineer: (cv, keep) => ({
    profession: 'engineer',
    jobs: jobsFor(cv, keep),
    projects: projectsFor(cv, keep),
    techStack: cv.techStack,
  }),
  drummer: (cv) => ({ profession: 'drummer', musician: cv.musician, bands: bandsFor(cv) }),
  fighter: (cv) => ({ profession: 'fighter', martialArts: cv.martialArts }),
}

const heroFor = ({ fullName, professionalSummary, contact }: CVData): RecruiterHero => ({
  name: fullName,
  headline: professionalSummary.headline,
  tagline: professionalSummary.tagline,
  line: contact.line,
  actions: {
    email: { href: `mailto:${contact.email}`, value: contact.email },
    linkedin: { href: contact.linkedin, value: contact.linkedin },
  },
})

/**
 * The view one world (or /cv) renders for a profession. An unknown profession id opens the default one,
 * so a stale `?profession=` or stored value still renders a page. `now` is the clock the five year cut
 * reads, injectable for tests.
 */
export function viewFor(cv: CVData, profession: string, mode: CVViewMode, now: Date = new Date()): CVView {
  const picked = isProfession(profession) ? profession : DEFAULT_PROFESSION
  return {
    profession: picked,
    hero: heroFor(cv),
    sections: SECTIONS_FOR[picked](cv, KEEP_FOR_MODE[mode](now)),
  }
}
