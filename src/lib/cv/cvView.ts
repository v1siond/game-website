import type { Band, CVData, Job, MartialArts, Musician, ProfessionalSummary, Project, TechCategory, WorldCV } from './content'
import type { Labels } from './labels'
import { jobSpan, projectLinks, yearSpan, type ProjectLink } from './sectionText'
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
  | {
      profession: 'engineer'
      jobs: Job[]
      projects: Project[]
      techStack: Array<TechCategory & { id: string }>
      services: WorldCV['services']
      companies: CVData['companies']
    }
  | { profession: 'drummer'; musician: Musician; bands: Band[] }
  | { profession: 'fighter'; martialArts: MartialArts }

/** One profession's slice of ProfessionSections, for a world's per profession section component. */
export type SectionsOf<Id extends Profession> = Extract<ProfessionSections, { profession: Id }>

export interface CVView {
  profession: Profession
  hero: RecruiterHero
  sections: ProfessionSections
}

// A world shows work from the last five calendar years: with the clock in 2026, anything that ended in
// 2021 or later. Older entries stay on /cv, and a highlight is shown whatever its age.
export const RECENT_WORK_YEARS = 5

/** The calendar year a clock reads in UTC: the one year the server render, useYearNow and the cut share. */
export const yearOf = (now: Date): number => now.getUTCFullYear()

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

const KEEP_FOR_MODE: Record<CVViewMode, (year: number) => Keep> = {
  full: () => keepAll,
  world: (year) => keepRecent(year - RECENT_WORK_YEARS),
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

const jobsFor = (cv: WorldCV, keep: Keep): Job[] =>
  cv.workExperience
    .filter((job) => keep(job, job.endDate ? job.endDate.getUTCFullYear() : null))
    .sort(byRecency(jobEnd, (job) => job.startDate.getTime()))

// Projects keep the order he sets in Decap (position), the order the Contract fixes for them.
const projectsFor = (cv: WorldCV, keep: Keep): Project[] =>
  cv.projects.filter((project) => keep(project, project.endYear)).sort((a, b) => a.position - b.position)

/**
 * The ventures in the order every world and /cv shows them: his own products (featured) first, then the
 * rest, each group in the order of companies.json.
 */
export const venturesFor = (companies: CVData['companies']): CVData['companies'] => [
  ...companies.filter((company) => company.featured),
  ...companies.filter((company) => !company.featured),
]

const bandsFor = (cv: WorldCV): Band[] => [...cv.bands].sort(byRecency(bandEnd, (band) => band.startYear ?? UNDATED))

// The services, bands and the Muay Thai record are listed whole: the spec names every band and every martial arts
// fact, and neither carries the highlight toggle the cut relies on.
const SECTIONS_FOR: Record<Profession, (cv: WorldCV, keep: Keep) => ProfessionSections> = {
  engineer: (cv, keep) => ({
    profession: 'engineer',
    jobs: jobsFor(cv, keep),
    projects: projectsFor(cv, keep),
    techStack: cv.techStack,
    services: cv.services,
    companies: venturesFor(cv.companies),
  }),
  drummer: (cv) => ({ profession: 'drummer', musician: cv.musician, bands: bandsFor(cv) }),
  fighter: (cv) => ({ profession: 'fighter', martialArts: cv.martialArts }),
}

const heroFor = ({ fullName, professionalSummary, contact }: WorldCV): RecruiterHero => ({
  name: fullName,
  headline: professionalSummary.headline,
  tagline: professionalSummary.tagline,
  line: `${contact.availability} ${contact.line}`,
  actions: {
    email: { href: `mailto:${contact.email}`, value: contact.email },
    linkedin: { href: contact.linkedin, value: contact.linkedin },
  },
})

/**
 * The view one world (or /cv) renders for a profession. An unknown profession id opens the default one,
 * so a stale `?profession=` or stored value still renders a page. `year` is the year the five year cut
 * counts back from (yearOf), passed in so the server render and the hydrating client cut the same entries.
 */
export function viewFor(cv: WorldCV, profession: string, mode: CVViewMode, year: number): CVView {
  const picked = isProfession(profession) ? profession : DEFAULT_PROFESSION
  return {
    profession: picked,
    hero: heroFor(cv),
    sections: SECTIONS_FOR[picked](cv, KEEP_FOR_MODE[mode](year)),
  }
}

// The card view models (his 11-10 rule: "We should have the same content across all worlds, only the
// template changes"). Each carries every field of its entry whole, the lists uncut, and every formatted
// string from sectionText, so a world renders the fields of its card in its own look and never slices,
// picks or formats one itself.

export interface JobCard {
  id: string
  title: string
  company: string
  /** "2019 to 2022", "2023 to Present" (years.range). */
  years: string
  location: string
  description: string
  highlights: string[]
  skills: string[]
}

export interface ProjectCard {
  id: string
  name: string
  role: string
  /** "Since 2018", "2016 to 2018", "" (yearSpan). */
  years: string
  tagline: string
  description: string
  impact: string
  details: string[]
  techStack: string[]
  links: ProjectLink[]
}

export interface VentureCard {
  id: string
  name: string
  tagline: string
  description: string
  url: string
  icon: string
  services: string[]
  featured: boolean
}

export interface AboutBlock {
  bio: string
  education: string
  languages: string
  highlights: string[]
}

export const jobCard = (job: Job, years: Labels['years']): JobCard => ({
  id: job.id,
  title: job.title,
  company: job.company,
  years: jobSpan(job, years),
  location: job.location,
  description: job.description,
  highlights: job.highlights,
  skills: job.skills,
})

export const projectCard = (project: Project, labels: Pick<Labels, 'years' | 'links'>): ProjectCard => ({
  id: project.id,
  name: project.name,
  role: project.role,
  years: yearSpan(project, labels.years),
  tagline: project.tagline,
  description: project.description,
  impact: project.impact,
  details: project.details,
  techStack: project.techStack,
  links: projectLinks(project, labels.links),
})

export const ventureCard = (company: CVData['companies'][number]): VentureCard => ({
  id: company.id,
  name: company.name,
  tagline: company.tagline,
  description: company.description,
  url: company.url,
  icon: company.icon,
  services: company.services,
  featured: Boolean(company.featured),
})

export const aboutBlock = ({ bio, education, languages, highlights }: ProfessionalSummary): AboutBlock => ({
  bio,
  education,
  languages,
  highlights,
})
