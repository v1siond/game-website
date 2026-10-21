import type { ReactNode } from 'react'
import type { ProjectSlot } from '@/components/cv/ProjectList'
import type { BandSlot } from '@/components/cv/BandList'
import type { CVData, Job } from '@/lib/cv/content'
import { jobYears } from '@/components/cv/sectionText'
import { useLabels } from '@/components/cv/CVDataProvider'
import { TYPEWRITER } from './palette'
import world from './world.module.css'

// Silhouette's panels and cards: near black slabs with a hard black offset shadow, the way a silhouette
// game frames its few words, and the entries that sit in them (a job, a project, a venture, a band).

const LINK_FOCUS = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--sh-glow)]'
const CARD_LINK = `group block transition-transform hover:translate-x-0.5 hover:translate-y-0.5 motion-reduce:transition-none ${LINK_FOCUS}`
const CARD_TITLE = 'text-sm font-bold uppercase tracking-wider text-[color:var(--sh-text)]'
const CARD_META = 'text-sm tracking-wider text-[color:var(--sh-dim)]'
const CARD_BODY = 'text-sm leading-relaxed text-[color:var(--sh-muted)]'

export function Panel({ children }: { children: ReactNode }) {
  return (
    <div className={`relative border-l-4 border-[color:var(--sh-black)] ${world.panel}`}>
      <div className="absolute left-0 top-0 h-3 w-3 border-l-2 border-t-2 border-[color:var(--sh-edge)]" aria-hidden="true" />
      <div className="absolute bottom-0 right-0 h-3 w-3 border-b-2 border-r-2 border-[color:var(--sh-edge)]" aria-hidden="true" />
      <div className="relative p-5">{children}</div>
    </div>
  )
}

function Card({ children }: { children: ReactNode }) {
  return <div className={`relative h-full border-2 border-[color:var(--sh-black)] p-4 ${world.card}`}>{children}</div>
}

export function SectionHeader({ title }: { title: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <div className="h-px flex-1 bg-[color:var(--sh-fog)]" aria-hidden="true" />
      <h2 className={`text-sm uppercase tracking-[0.4em] text-[color:var(--sh-muted)] ${TYPEWRITER}`}>{title}</h2>
      <div className="h-px flex-1 bg-[color:var(--sh-fog)]" aria-hidden="true" />
    </div>
  )
}

export function TechCloud({ categories }: { categories: CVData['techStack'] }) {
  const { cards } = useLabels()
  return (
    <div className="space-y-4" role="list" aria-label={cards.techByCategory}>
      {categories.map((category) => (
        <div key={category.id} role="listitem">
          <h3 className="mb-2 flex items-center gap-2 text-sm uppercase tracking-[0.25em] text-[color:var(--sh-dim)]">
            <span className="grayscale" aria-hidden="true">
              {category.icon}
            </span>
            {category.name}
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {category.items.map((tech) => (
              <span
                key={tech}
                className="inline-block border border-[color:var(--sh-fog)] px-2 py-1 text-sm uppercase tracking-wider text-[color:var(--sh-muted)]"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// Dates are date only strings (UTC midnight), so the year is read in UTC: a January start keeps its
// own year west of UTC.
export function ExperienceCard({ entry }: { entry: Job }) {
  const { years } = useLabels()
  const { start, end } = jobYears(entry, years.present)

  return (
    <article className={`border-l-4 border-[color:var(--sh-black)] p-4 ${world.card}`}>
      <div className="mb-1 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className={CARD_TITLE}>{entry.title}</h3>
          <p className={`mt-0.5 ${CARD_META}`}>{entry.company}</p>
        </div>
        <span className={`whitespace-nowrap uppercase ${CARD_META}`}>
          {start} - {end}
        </span>
      </div>
      {entry.description && <p className={`mt-2 ${CARD_BODY}`}>{entry.description}</p>}
      {entry.highlights.length > 0 && (
        <ul className="mt-2 space-y-1">
          {entry.highlights.map((highlight) => (
            <li key={highlight} className={`flex items-start gap-1.5 ${CARD_BODY}`}>
              <span className="text-[color:var(--sh-dim)]" aria-hidden="true">
                -
              </span>
              {highlight}
            </li>
          ))}
        </ul>
      )}
      {entry.skills.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {entry.skills.slice(0, 5).map((skill) => (
            <span key={skill} className="border border-[color:var(--sh-edge)] px-1.5 py-0.5 text-sm uppercase text-[color:var(--sh-dim)]">
              {skill}
            </span>
          ))}
        </div>
      )}
    </article>
  )
}

export function ProjectCard({ project, years, links }: ProjectSlot) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-2">
        <h3 className={CARD_TITLE}>{project.name}</h3>
        {years && <span className={`whitespace-nowrap ${CARD_META}`}>{years}</span>}
      </div>
      <p className="mt-0.5 text-sm text-[color:var(--sh-text)]">{project.role}</p>
      <p className={`mt-0.5 ${CARD_META}`}>{project.tagline}</p>
      {project.impact && (
        <p className={`mt-1.5 italic ${CARD_BODY}`}>
          <span aria-hidden="true">{'-> '}</span>
          {project.impact}
        </p>
      )}
      <div className="mt-2 flex flex-wrap gap-1.5">
        {project.techStack.slice(0, 4).map((tech) => (
          <span key={tech} className="bg-[color:var(--sh-black)] px-1.5 py-0.5 text-sm uppercase tracking-wider text-[color:var(--sh-muted)]">
            {tech}
          </span>
        ))}
      </div>
      {links.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {links.map(({ kind, label, linkProps }) => (
            <a
              key={kind}
              {...linkProps}
              className={`inline-flex min-h-[44px] items-center border-2 border-[color:var(--sh-text)] px-3 text-sm uppercase tracking-[0.2em] text-[color:var(--sh-text)] transition-colors hover:bg-[color:var(--sh-glow)] hover:text-[color:var(--sh-black)] ${LINK_FOCUS}`}
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </Card>
  )
}

export function CompanyCard({ company }: { company: CVData['companies'][number] }) {
  const content = (
    <Card>
      <div className="mb-1 flex items-start gap-2">
        <span className="grayscale" aria-hidden="true">
          {company.icon}
        </span>
        <div>
          <h3 className={`${CARD_TITLE} group-hover:underline`}>{company.name}</h3>
          <p className={CARD_META}>{company.tagline}</p>
        </div>
      </div>
      <p className={CARD_BODY}>{company.description}</p>
    </Card>
  )

  if (!company.url) return content
  return (
    <a href={company.url} target="_blank" rel="noopener noreferrer" className={CARD_LINK}>
      {content}
    </a>
  )
}

export function BandCard({ band, years, linkProps }: BandSlot) {
  const { links } = useLabels()
  const content = (
    <Card>
      <h3 className={`${CARD_TITLE} group-hover:underline`}>{band.name}</h3>
      <p className={`mt-0.5 ${CARD_META}`}>
        {band.role}
        {years && <span aria-hidden="true"> | </span>}
        {years}
      </p>
      {band.release && (
        <p className={`mt-1.5 ${CARD_BODY}`}>
          {links.released} <cite>&ldquo;{band.release}&rdquo;</cite>
        </p>
      )}
    </Card>
  )

  if (!linkProps) return content
  return (
    <a {...linkProps} className={CARD_LINK}>
      {content}
    </a>
  )
}
