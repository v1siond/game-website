import type { ReactNode } from 'react'
import type { BandSlot } from '@/components/cv/BandList'
import type { ProjectSlot } from '@/components/cv/ProjectList'
import type { CVData, Job } from '@/lib/cv/content'
import { jobYears } from '@/components/cv/sectionText'
import { HitSpark } from './badges'
import { ACCENT, type Accent } from './frames'
import { BLUE_OUTLINE } from './actions'
import look from './world.module.css'

// The fight cards every list entry sits on: cabinet metal with the cut corner of a move list panel,
// the accent border, highlights marked with a hit spark. A running job glows health green, a highlighted
// project gold.

const TITLE = `text-base uppercase text-white ${look.display}`
const BODY = 'text-sm leading-relaxed text-[color:var(--fs-chrome)]'
const TAG = `px-3 py-1 text-sm ${look.tag}`
const FOCUS = 'focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--fs-gold)]'

function FightCard({ accent, children }: { accent: Accent; children: ReactNode }) {
  return (
    <article className={`relative h-full ${look.metal} ${look.card} ${look.cutCorner} ${ACCENT[accent]}`}>
      <div className="relative p-5">{children}</div>
      <span className={`absolute bottom-0 right-0 h-6 w-6 ${look.cornerTab}`} aria-hidden="true" />
    </article>
  )
}

function Tags({ items, label }: { items: string[]; label: string }) {
  if (items.length === 0) return null
  return (
    <ul className="flex flex-wrap gap-2" aria-label={label}>
      {items.slice(0, 5).map((item) => (
        <li key={item} className={TAG}>
          {item}
        </li>
      ))}
    </ul>
  )
}

export function ExperienceCard({ entry }: { entry: Job }) {
  const { start, end } = jobYears(entry, 'Now')
  const running = !entry.endDate

  return (
    <FightCard accent={running ? 'health' : 'cyan'}>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className={TITLE}>{entry.title}</h3>
          <p className="text-sm text-[color:var(--accent)]">{entry.company}</p>
        </div>
        <span className={`px-3 py-1 text-sm ${look.display} ${look.tag}`}>
          {start} - {end}
        </span>
      </div>

      {entry.description && <p className={`mb-4 ${BODY}`}>{entry.description}</p>}

      {entry.highlights.length > 0 && (
        <ul className="mb-4 space-y-2" aria-label="Key achievements">
          {entry.highlights.map((highlight) => (
            <li key={highlight} className="flex items-start gap-3 text-sm text-white">
              <HitSpark />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      )}

      <Tags items={entry.skills} label="Skills used" />
    </FightCard>
  )
}

export function ProjectCard({ project, years, links }: ProjectSlot) {
  return (
    <FightCard accent={project.highlight ? 'gold' : 'cyan'}>
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className={TITLE}>{project.name}</h3>
        {years && <span className={`whitespace-nowrap text-sm text-[color:var(--accent)] ${look.display}`}>{years}</span>}
      </div>
      <p className="mb-2 text-sm font-bold text-white">{project.role}</p>
      <p className={`mb-3 ${BODY}`}>{project.tagline}</p>

      {project.impact && (
        <p className={`mb-4 flex items-start gap-2 px-4 py-2.5 text-sm text-[color:var(--accent)] ${look.impact}`}>
          <HitSpark />
          <span>{project.impact}</span>
        </p>
      )}

      <Tags items={project.techStack} label="Technologies used" />

      {links.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-3">
          {links.map(({ kind, label, linkProps }) => (
            <a key={kind} {...linkProps} className={BLUE_OUTLINE}>
              {label}
            </a>
          ))}
        </div>
      ) : (
        <p className={`mt-4 ${BODY}`}>No public link</p>
      )}
    </FightCard>
  )
}

export function BandCard({ band, years, linkProps }: BandSlot) {
  const content = (
    <FightCard accent="p2">
      <h3 className={TITLE}>{band.name}</h3>
      <p className="mt-2 text-sm text-[color:var(--accent)]">
        {band.role}
        {years && <span aria-hidden="true"> - </span>}
        {years && <span>{years}</span>}
      </p>
      {band.release && (
        <p className={`mt-3 ${BODY}`}>
          Released <cite>&ldquo;{band.release}&rdquo;</cite>
        </p>
      )}
    </FightCard>
  )

  if (!linkProps) return content
  return (
    <a {...linkProps} className={`block h-full ${FOCUS}`}>
      {content}
    </a>
  )
}

export function VentureCard({ company }: { company: CVData['companies'][number] }) {
  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${company.name}: ${company.tagline} (opens in a new tab)`}
      className={`block h-full motion-safe:transition-transform motion-safe:hover:scale-[1.02] ${FOCUS}`}
    >
      <FightCard accent="cyan">
        <div className="flex items-center gap-4">
          <span className="text-4xl" aria-hidden="true">
            {company.icon}
          </span>
          <div>
            <h3 className={TITLE}>{company.name}</h3>
            <p className="text-sm text-[color:var(--accent)]">{company.tagline}</p>
          </div>
        </div>
        <p className={`mt-4 ${BODY}`}>{company.description}</p>
      </FightCard>
    </a>
  )
}

// The tech stack as a move list: each category a heading, its technologies a grid of command slots.
export function MoveList({ categories }: { categories: CVData['techStack'] }) {
  return (
    <div className="space-y-8">
      {categories.map((category) => (
        <div key={category.id}>
          <h3 className={`mb-4 flex items-center gap-3 ${TITLE}`}>
            <span aria-hidden="true">{category.icon}</span>
            {category.name}
          </h3>
          <ul className="grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-6" aria-label={`${category.name} technologies`}>
            {category.items.map((tech) => (
              <li key={tech} className="border border-[color:var(--fs-steel)] bg-[color:var(--fs-panel)] px-3 py-2 text-sm">
                {tech}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
