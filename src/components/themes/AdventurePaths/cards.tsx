import type { ReactNode } from 'react'
import type { ProjectSlot } from '@/components/cv/ProjectList'
import type { BandSlot } from '@/components/cv/BandList'
import type { CVData, Job } from '@/lib/cv/content'
import { jobYears } from '@/components/cv/sectionText'
import { JOURNAL_SERIF } from './palette'

// Adventure Paths' entries: a job is a dated page of the field journal with the route line down its left
// edge, a project or a band is a find laid out on parchment, a venture is a camp marked on the map, and
// the tech stack is the explorer's pack, one pouch per category.

const FOCUS = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ap-gold)]'

const CHIP = 'rounded-sm bg-[color:var(--ap-forest)] px-2 py-0.5 text-sm text-[color:var(--ap-parchment)]'

const FIND = 'h-full rounded-sm border-2 border-[color:var(--ap-edge)] bg-[color:var(--ap-parchment)] p-4 text-[color:var(--ap-ink)]'

export const LINK_BUTTON = `inline-flex min-h-[44px] items-center rounded-sm bg-[color:var(--ap-route)] px-3 text-sm font-bold text-white transition-transform hover:-translate-y-0.5 motion-reduce:transition-none ${FOCUS}`

function Chips({ items, label }: { items: string[]; label: string }) {
  if (items.length === 0) return null

  return (
    <ul className="mt-2 flex flex-wrap gap-1.5" aria-label={label}>
      {items.map((item) => (
        <li key={item} className={CHIP}>
          {item}
        </li>
      ))}
    </ul>
  )
}

export function JourneyEntry({ entry }: { entry: Job }) {
  const { start, end } = jobYears(entry, 'Present')

  return (
    <article className="rounded-sm border-l-4 border-[color:var(--ap-route)] bg-[color:var(--ap-page)] p-4 text-[color:var(--ap-ink)]">
      <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className={`text-base font-bold ${JOURNAL_SERIF}`}>{entry.title}</h3>
          <p className="text-sm font-semibold text-[color:var(--ap-route)]">{entry.company}</p>
        </div>
        <span className="rounded-sm bg-[color:var(--ap-ink)] px-2 py-1 text-sm text-[color:var(--ap-parchment)]">
          {start} to {end}
        </span>
      </div>
      {entry.description && <p className="text-sm text-[color:var(--ap-ink-soft)]">{entry.description}</p>}
      {entry.highlights.length > 0 && (
        <ul className="mt-2 space-y-1" aria-label="Key achievements">
          {entry.highlights.map((highlight) => (
            <li key={highlight} className="flex items-start gap-2 text-sm">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-[color:var(--ap-route)]" aria-hidden="true" />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

export function ProjectFind({ project, years, links }: ProjectSlot) {
  return (
    <article className={FIND}>
      <div className="mb-1 flex items-start justify-between gap-2">
        <h3 className={`text-base font-bold ${JOURNAL_SERIF}`}>{project.name}</h3>
        {years && <span className="whitespace-nowrap text-sm text-[color:var(--ap-ink-soft)]">{years}</span>}
      </div>
      <p className="text-sm font-semibold text-[color:var(--ap-route)]">{project.role}</p>
      <p className="mt-1 text-sm text-[color:var(--ap-ink-soft)]">{project.tagline}</p>
      {project.impact && <p className="mt-2 text-sm font-semibold text-[color:var(--ap-forest)]">{project.impact}</p>}
      <Chips items={project.techStack.slice(0, 4)} label="Technologies used" />
      {links.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {links.map(({ kind, label, linkProps }) => (
            <a key={kind} {...linkProps} className={LINK_BUTTON}>
              {label}
            </a>
          ))}
        </div>
      )}
    </article>
  )
}

export function BandFind({ band, years, linkProps }: BandSlot) {
  const card: ReactNode = (
    <article className={FIND}>
      <h3 className={`text-base font-bold ${JOURNAL_SERIF}`}>{band.name}</h3>
      <p className="mt-1 text-sm text-[color:var(--ap-ink-soft)]">
        {band.role}
        {years && <span> · {years}</span>}
      </p>
      {band.release && (
        <p className="mt-2 text-sm">
          Released <cite>&ldquo;{band.release}&rdquo;</cite>
        </p>
      )}
    </article>
  )

  if (!linkProps) return card

  return (
    <a {...linkProps} className={`block h-full transition-transform hover:-translate-y-0.5 motion-reduce:transition-none ${FOCUS}`}>
      {card}
    </a>
  )
}

export function CampCard({ company }: { company: CVData['companies'][number] }) {
  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${company.name}: ${company.tagline} (opens in a new tab)`}
      className={`block h-full transition-transform hover:-translate-y-0.5 motion-reduce:transition-none ${FOCUS}`}
    >
      <article className={FIND}>
        <h3 className={`text-base font-bold ${JOURNAL_SERIF}`}>{company.name}</h3>
        <p className="text-sm font-semibold text-[color:var(--ap-route)]">{company.tagline}</p>
        <p className="mt-2 text-sm text-[color:var(--ap-ink-soft)]">{company.description}</p>
      </article>
    </a>
  )
}

export function ExplorerPack({ categories }: { categories: CVData['techStack'] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {categories.map((category) => (
        <div key={category.id}>
          <h3 className={`text-base font-bold ${JOURNAL_SERIF}`}>{category.name}</h3>
          <Chips items={category.items} label={`${category.name} technologies`} />
        </div>
      ))}
    </div>
  )
}
