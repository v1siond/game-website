import type { Locale } from '@/i18n/config'

// The shape of the Decap content in content/cv. Each file holds one block per locale (i18n
// single_file); English is the complete block every other locale falls back to.

export interface ProfessionalSummary {
  headline: string
  tagline: string
  bio: string
  highlights: string[]
}

export interface Contact {
  email: string
  linkedin: string
  line: string
}

export interface JobEntry {
  id: string
  title: string
  company: string
  employment: string
  location: string
  description: string
  startDate: string
  endDate: string
  current: boolean
  highlight: boolean
  highlights: string[]
  skills: string[]
}

export interface ProjectLinks {
  site: string
  app: string
  store: string
  story: string
}

export interface Project {
  id: string
  slug: string
  name: string
  role: string
  tagline: string
  description: string
  impact: string
  details: string[]
  techStack: string[]
  status: string
  startYear: number | null
  endYear: number | null
  current: boolean
  featured: boolean
  highlight: boolean
  position: number
  links: ProjectLinks
}

export interface Musician {
  yearsPlaying: number
  since: number
  line: string
}

export interface Band {
  id: string
  slug: string
  name: string
  role: string
  years: number | null
  startYear: number | null
  endYear: number | null
  current: boolean
  release: string
  url: string
}

export interface MartialArts {
  primary: {
    discipline: string
    title: string
    dojo: string
    place: string
    founder: string
    rank: string
    yearsTraining: number
    yearsTeaching: number
    current: boolean
    achievements: string[]
    now: string
  }
  training: Array<{ discipline: string; academy: string; instructor: string; current: boolean }>
  background: string
}

export interface TechCategory {
  name: string
  icon: string
  items: string[]
}

export interface Company {
  id: string
  name: string
  tagline: string
  description: string
  url: string
  services: string[]
  icon: string
}

export interface Role {
  id: string
  title: string
  company: string
  type: string
  current: boolean
  description: string
}

/** What each content file holds inside one locale block. */
export interface CVContentSections {
  summary: { fullName: string; professionalSummary: ProfessionalSummary }
  contact: { contact: Contact }
  experience: { workExperience: JobEntry[] }
  projects: { projects: Project[] }
  bands: { musician: Musician; bands: Band[] }
  'martial-arts': { martialArts: MartialArts }
  'tech-stack': { techStack: TechCategory[] }
  companies: { companies: Company[] }
  roles: { currentRoles: Role[] }
}

export type CVContentFile = keyof CVContentSections

export const CV_CONTENT_FILES: readonly CVContentFile[] = [
  'summary',
  'contact',
  'experience',
  'projects',
  'bands',
  'martial-arts',
  'tech-stack',
  'companies',
  'roles',
]

/** One file as stored: the English block always, the others possibly missing or partial. */
export type LocalisedFile<Section> = { en: Section } & Partial<Record<Exclude<Locale, 'en'>, Partial<Section>>>

export type CVContentFiles = { [File in CVContentFile]: LocalisedFile<CVContentSections[File]> }

// Every file's sections side by side: the content of one locale.
type CVContent = CVContentSections['summary'] &
  CVContentSections['contact'] &
  CVContentSections['experience'] &
  CVContentSections['projects'] &
  CVContentSections['bands'] &
  CVContentSections['martial-arts'] &
  CVContentSections['tech-stack'] &
  CVContentSections['companies'] &
  CVContentSections['roles']

export type Job = Omit<JobEntry, 'startDate' | 'endDate'> & { startDate: Date; endDate: Date | null }

/** The CV the pages render: the content of one locale, with dates parsed and the keys the views join on. */
export type CVData = Omit<CVContent, 'workExperience' | 'currentRoles' | 'companies' | 'techStack'> & {
  workExperience: Job[]
  currentRoles: Array<Role & { slug: string }>
  companies: Array<Company & { slug: string }>
  techStack: Array<TechCategory & { id: string }>
  featuredProjects: Project[]
}

// A key missing from the locale block keeps its English value, so a half translated file still renders.
const sectionFor = <Section extends object>(file: LocalisedFile<Section>, locale: Locale): Section => {
  const translated: Partial<Section> = file[locale] ?? {}
  return { ...file.en, ...translated }
}

// Decap stores an open ended job's end date as an empty string.
const toJob = ({ startDate, endDate, ...job }: JobEntry): Job => ({
  ...job,
  startDate: new Date(startDate),
  endDate: endDate ? new Date(endDate) : null,
})

const withSlug = <Entry extends { id: string }>(entry: Entry): Entry & { slug: string } => ({ ...entry, slug: entry.id })

/** Picks one locale out of the parsed content files and shapes it for the pages. */
export function cvDataFrom(files: CVContentFiles, locale: Locale): CVData {
  const content = CV_CONTENT_FILES.reduce(
    (merged, name) => ({ ...merged, ...sectionFor<object>(files[name], locale) }),
    {},
  ) as CVContent

  return {
    ...content,
    workExperience: content.workExperience.map(toJob),
    currentRoles: content.currentRoles.map(withSlug),
    companies: content.companies.map(withSlug),
    techStack: content.techStack.map((category) => ({ ...category, id: category.name })),
    featuredProjects: content.projects.filter((project) => project.featured),
  }
}
