import type { Band, Job, MartialArts, Musician, Project, ProjectLinks } from '@/lib/cv/content'
import { fillLabel, type Labels } from '@/lib/cv/labels'

// The phrases every world prints around the CV facts: link labels, year spans, the Muay Thai record
// lines. The words are the labels (content/cv/labels.json, read through useLabels); these functions only
// put the facts into them, so the 17 worlds say the same thing and only draw it differently.

export type ProjectLinkKind = keyof ProjectLinks

export interface ProjectLink {
  kind: ProjectLinkKind
  label: string
  href: string
}

// Listing order on a card, each kind with its label; `store` is a marketplace page (Shopify App Store,
// Google Cloud Marketplace).
const PROJECT_LINK_LABELS: ReadonlyArray<readonly [ProjectLinkKind, keyof Labels['links']]> = [
  ['site', 'website'],
  ['app', 'app'],
  ['store', 'marketplace'],
  ['story', 'story'],
]

/** The links a project card shows, in a fixed order; an empty one (Decap stores it as "") is left out. */
export function projectLinks(project: Pick<Project, 'links'>, links: Labels['links']): ProjectLink[] {
  return PROJECT_LINK_LABELS.filter(([kind]) => project.links[kind]).map(([kind, label]) => ({
    kind,
    label: links[label],
    href: project.links[kind],
  }))
}

/** The accessible name of a link that opens a new tab: "Lumi (opens in a new tab)". */
export const newTabName = (links: Labels['links'], name: string): string => fillLabel(links.newTab, { name })

/** "1 year", "4 years". */
const yearCount = (count: number, labels: Labels['years']): string =>
  fillLabel(count === 1 ? labels.yearOne : labels.yearMany, { count })

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
export function yearSpan({ startYear, endYear, current, years = null }: Span, labels: Labels['years']): string {
  if (current && startYear !== null) return fillLabel(labels.since, { year: startYear })
  if (startYear !== null && endYear !== null) {
    return startYear === endYear ? `${startYear}` : fillLabel(labels.range, { start: startYear, end: endYear })
  }
  if (years !== null) return yearCount(years, labels)
  return ''
}

export const bandSpan = (band: Band, labels: Labels['years']): string => yearSpan(band, labels)

/** The line over the bands: "Drums since 2005, 19 years". */
export const drumsSince = ({ since, yearsPlaying }: Pick<Musician, 'since' | 'yearsPlaying'>, labels: Labels['years']): string =>
  fillLabel(labels.drumsSince, { since, years: yearsPlaying })

export interface JobYears {
  start: number
  end: number | string
}

/** A job's start and end year; a running job ends in the label for now the world passes (years.present).
 *  Dates are date only strings (UTC midnight), so the year is read in UTC. */
export function jobYears(job: Pick<Job, 'startDate' | 'endDate'>, openLabel: string): JobYears {
  return { start: job.startDate.getUTCFullYear(), end: job.endDate ? job.endDate.getUTCFullYear() : openLabel }
}

export interface RecordFact {
  label: string
  value: string
}

/** The Muay Thai record as label and value lines, in reading order. */
export function muayThaiFacts({ primary, training, background }: MartialArts, labels: Pick<Labels, 'record' | 'years'>): RecordFact[] {
  const { record, years } = labels
  const alsoTraining = training.map(({ current, ...place }) => fillLabel(current ? record.trainingNow : record.training, place))
  return [
    { label: record.dojo, value: fillLabel(record.dojoLine, { dojo: primary.dojo, place: primary.place, founder: primary.founder }) },
    { label: record.rank, value: primary.rank },
    {
      label: primary.discipline,
      value: fillLabel(record.practice, {
        training: yearCount(primary.yearsTraining, years),
        teaching: yearCount(primary.yearsTeaching, years),
      }),
    },
    { label: record.now, value: primary.now },
    ...alsoTraining.map((value) => ({ label: record.alsoTraining, value })),
    { label: record.background, value: background },
  ].filter((fact) => fact.value)
}

/** The id a section heading carries so its region can name it: `section-tech-stack`. */
export const headingId = (prefix: string, title: string): string => `${prefix}-${title.toLowerCase().replace(/\s+/g, '-')}`
