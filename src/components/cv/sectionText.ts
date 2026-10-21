import type { Band, Job, MartialArts, Project, ProjectLinks } from '@/lib/cv/content'

// The words every world prints around the CV facts: link labels, year spans, the Muay Thai record
// lines. One place, so the 17 worlds say the same thing and only draw it differently.

export type ProjectLinkKind = keyof ProjectLinks

export interface ProjectLink {
  kind: ProjectLinkKind
  label: string
  href: string
}

// Listing order on a card; `store` is a marketplace page (Shopify App Store, Google Cloud Marketplace).
const PROJECT_LINK_LABELS: ReadonlyArray<readonly [ProjectLinkKind, string]> = [
  ['site', 'Website'],
  ['app', 'App'],
  ['store', 'Marketplace'],
  ['story', 'Story'],
]

/** The links a project card shows, in a fixed order; an empty one (Decap stores it as "") is left out. */
export function projectLinks(project: Pick<Project, 'links'>): ProjectLink[] {
  return PROJECT_LINK_LABELS.filter(([kind]) => project.links[kind]).map(([kind, label]) => ({
    kind,
    label,
    href: project.links[kind],
  }))
}

interface Span {
  startYear: number | null
  endYear: number | null
  current: boolean
  years?: number | null
}

/**
 * "Since 2018" while it runs, "2016 to 2018" or "2023" once it ended, "2 years" when only a length is
 * known, "" when nothing is.
 */
export function yearSpan({ startYear, endYear, current, years = null }: Span): string {
  if (current && startYear !== null) return `Since ${startYear}`
  if (startYear !== null && endYear !== null) return startYear === endYear ? `${startYear}` : `${startYear} to ${endYear}`
  if (years !== null) return `${years} years`
  return ''
}

export const bandSpan = (band: Band): string => yearSpan(band)

export interface JobYears {
  start: number
  end: number | string
}

/** A job's start and end year; a running job ends in the world's own word for now ("Present", "NOW").
 *  Dates are date only strings (UTC midnight), so the year is read in UTC. */
export function jobYears(job: Pick<Job, 'startDate' | 'endDate'>, openLabel: string): JobYears {
  return { start: job.startDate.getUTCFullYear(), end: job.endDate ? job.endDate.getUTCFullYear() : openLabel }
}

export interface RecordFact {
  label: string
  value: string
}

const plural = (count: number, noun: string): string => `${count} ${noun}${count === 1 ? '' : 's'}`

/** The Muay Thai record as label and value lines, in reading order. */
export function muayThaiFacts({ primary, training, background }: MartialArts): RecordFact[] {
  const alsoTraining = training.map(
    ({ discipline, academy, instructor, current }) =>
      `${discipline} at ${academy}, under ${instructor}${current ? ', now' : ''}`,
  )
  return [
    { label: 'Dojo', value: `${primary.dojo}, ${primary.place}, founded by ${primary.founder}` },
    { label: 'Rank', value: primary.rank },
    {
      label: primary.discipline,
      value: `${plural(primary.yearsTraining, 'year')} training, ${plural(primary.yearsTeaching, 'year')} teaching`,
    },
    { label: 'Now', value: primary.now },
    ...alsoTraining.map((value) => ({ label: 'Also training', value })),
    { label: 'Background', value: background },
  ].filter((fact) => fact.value)
}

/** The id a section heading carries so its region can name it: `section-tech-stack`. */
export const headingId = (prefix: string, title: string): string => `${prefix}-${title.toLowerCase().replace(/\s+/g, '-')}`
