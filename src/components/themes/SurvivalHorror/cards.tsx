import type { ReactNode } from 'react'
import type { ProjectSlot } from '@/components/cv/ProjectList'
import type { BandSlot } from '@/components/cv/BandList'
import type { CVData, Job } from '@/lib/cv/content'
import { jobYears, NO_PUBLIC_LINK, RELEASED } from '@/components/cv/sectionText'
import { CARD_BUTTON } from './actions'
import look from './world.module.css'

// The cards each section lists, as the papers and items found in the house: a job is a typed document,
// a project a case file that opens to read its description and result, a band or a venture a filed card.

const TITLE = 'text-base text-[color:var(--sh-ivory)]'
const SUB = 'text-sm text-[color:var(--sh-brass)]'
const BODY = 'text-sm leading-relaxed text-[color:var(--sh-fog)]'
const STAMP = `whitespace-nowrap border border-[color:var(--sh-rust)] px-2 py-1 text-sm text-[color:var(--sh-flame)] ${look.typed}`

export function Mark() {
  return <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-[color:var(--sh-brass)]" aria-hidden="true" />
}

function MarkedLine({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start gap-2 text-sm text-[color:var(--sh-cream)]">
      <Mark />
      <span>{children}</span>
    </li>
  )
}

export function ExperienceCard({ entry }: { entry: Job }) {
  const { start, end } = jobYears(entry, 'Present')

  return (
    <article className={`p-4 ${look.file}`}>
      <div className="mb-2 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className={TITLE}>{entry.title}</h3>
          <p className={SUB}>{entry.company}</p>
        </div>
        <span className={STAMP}>
          {start} - {end}
        </span>
      </div>
      {entry.description && <p className={`mb-2 ${BODY}`}>{entry.description}</p>}
      {entry.highlights.length > 0 && (
        <ul className="space-y-1" aria-label="Key accomplishments">
          {entry.highlights.map((highlight) => (
            <MarkedLine key={highlight}>{highlight}</MarkedLine>
          ))}
        </ul>
      )}
    </article>
  )
}

const LINK_PLATE = `${CARD_BUTTON} border-[color:var(--sh-brass)] bg-[color:var(--sh-shadow)] text-[color:var(--sh-flame)] hover:border-[color:var(--sh-flame)]`
const TOGGLE_PLATE = `${CARD_BUTTON} border-transparent text-[color:var(--sh-cream)] hover:border-[color:var(--sh-wood)]`

function Chevron({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 10 10" className={`h-2.5 w-2.5 motion-safe:transition-transform ${open ? 'rotate-90' : ''}`} aria-hidden="true" focusable="false">
      <path d="M2 1 L8 5 L2 9 Z" fill="currentColor" />
    </svg>
  )
}

// The name, his role, the years and the links are always on the file; opening it reads the
// description and the result line.
export function ProjectFile({ slot: { project, years, links }, isOpen, onToggle }: { slot: ProjectSlot; isOpen: boolean; onToggle: () => void }) {
  const bodyId = `survival-horror-file-${project.id}`

  return (
    <article className={look.file}>
      <div className="px-4 py-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h3 className={`min-w-0 ${TITLE}`}>{project.name}</h3>
          {years && <span className={STAMP}>{years}</span>}
        </div>
        <p className={`mt-1 ${SUB}`}>{project.role}</p>
        <p className={`mt-1 ${BODY}`}>{project.tagline}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {links.map(({ kind, label, linkProps }) => (
            <a key={kind} {...linkProps} className={LINK_PLATE}>
              {label}
            </a>
          ))}
          {links.length === 0 && <span className={`italic ${BODY}`}>{NO_PUBLIC_LINK}</span>}
          <button type="button" onClick={onToggle} aria-expanded={isOpen} aria-controls={bodyId} className={TOGGLE_PLATE}>
            <Chevron open={isOpen} />
            {isOpen ? 'Close file' : 'Read file'}
          </button>
        </div>
      </div>
      {isOpen && (
        <div id={bodyId} className="border-t border-[color:var(--sh-wood)] bg-[color:var(--sh-shadow)] px-4 py-3">
          <p className={BODY}>{project.description}</p>
          {project.impact && <p className="mt-2 text-sm italic text-[color:var(--sh-cream)]">{project.impact}</p>}
        </div>
      )}
    </article>
  )
}

export function TechCloud({ categories }: { categories: CVData['techStack'] }) {
  return (
    <div className="space-y-6">
      {categories.map((category) => (
        <div key={category.id}>
          <h3 className={`mb-3 text-sm uppercase text-[color:var(--sh-brass)] ${look.typed}`}>{category.name}</h3>
          <ul className="flex flex-wrap gap-2" aria-label={`${category.name} technologies`}>
            {category.items.map((tech) => (
              <li key={tech} className="border border-[color:var(--sh-wood)] bg-[color:var(--sh-shadow)] px-2 py-1 text-sm text-[color:var(--sh-cream)]">
                {tech}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export function CompanyCard({ company }: { company: CVData['companies'][number] }) {
  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${company.name} (opens in a new tab)`}
      className={`block h-full p-4 hover:border-[color:var(--sh-brass)] ${look.file} ${look.focus}`}
    >
      <h3 className={TITLE}>{company.name}</h3>
      <p className={`mb-2 ${SUB}`}>{company.tagline}</p>
      <p className={BODY}>{company.description}</p>
    </a>
  )
}

export function BandCard({ band, years, linkProps }: BandSlot) {
  const content = (
    <div className={`h-full p-4 ${look.file}`}>
      <h3 className={TITLE}>{band.name}</h3>
      <p className={`mt-1 ${SUB}`}>
        {band.role}
        {years && <span aria-hidden="true"> | </span>}
        {years}
      </p>
      {band.release && (
        <p className={`mt-2 ${BODY}`}>
          {RELEASED} <cite>&ldquo;{band.release}&rdquo;</cite>
        </p>
      )}
    </div>
  )

  if (!linkProps) return content
  return (
    <a {...linkProps} className={`block h-full ${look.focus}`}>
      {content}
    </a>
  )
}
