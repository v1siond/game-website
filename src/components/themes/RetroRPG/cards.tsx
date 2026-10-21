import type { ReactNode } from 'react'
import type { ProjectSlot } from '@/components/cv/ProjectList'
import type { BandSlot } from '@/components/cv/BandList'
import type { CVData, Job } from '@/lib/cv/content'
import { jobYears, NO_PUBLIC_LINK, RELEASED } from '@/components/cv/sectionText'
import { PIXEL } from './palette'
import { Command, FOCUS } from './actions'
import world from './world.module.css'

// Retro RPG's entries, each in its own dialogue window: a job as a quest log page, a project or a band as
// a menu entry with its commands, a venture as a shop sign, the tech stack as the item bag.

const TITLE = `text-sm uppercase tracking-wide text-[color:var(--rpg-text)] ${PIXEL}`
const META = 'text-sm text-[color:var(--rpg-gold)]'
const BODY = 'text-sm leading-relaxed text-[color:var(--rpg-muted)]'
const TAG = 'border border-[color:var(--rpg-border-shade)] px-2 py-1 text-sm text-[color:var(--rpg-sky)]'

function Card({ children }: { children: ReactNode }) {
  return <article className={`h-full p-4 ${world.window}`}>{children}</article>
}

function Tags({ items, label }: { items: string[]; label: string }) {
  if (items.length === 0) return null
  return (
    <ul className="mt-3 flex flex-wrap gap-1.5" aria-label={label}>
      {items.map((item) => (
        <li key={item} className={TAG}>
          {item}
        </li>
      ))}
    </ul>
  )
}

// Dates are date only strings (UTC midnight), so the year is read in UTC.
export function ExperienceCard({ entry }: { entry: Job }) {
  const { start, end } = jobYears(entry, 'Present')

  return (
    <Card>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className={TITLE}>{entry.title}</h3>
          <p className={`mt-1 ${META}`}>{entry.company}</p>
        </div>
        <span className="whitespace-nowrap text-sm tabular-nums text-[color:var(--rpg-sky)]">
          {start} - {end}
        </span>
      </div>
      {entry.description && <p className={`mb-3 ${BODY}`}>{entry.description}</p>}
      {entry.highlights.length > 0 && (
        <ul className="space-y-2" aria-label="Key achievements">
          {entry.highlights.map((highlight) => (
            <li key={highlight} className="flex items-start gap-2 text-sm text-[color:var(--rpg-green)]">
              <span className="text-[color:var(--rpg-gold)]" aria-hidden="true">
                ▸
              </span>
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      )}
      <Tags items={entry.skills.slice(0, 5)} label="Skills used" />
    </Card>
  )
}

export function ProjectCard({ project, years, links }: ProjectSlot) {
  return (
    <Card>
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className={TITLE}>{project.name}</h3>
        {years && <span className="whitespace-nowrap text-sm text-[color:var(--rpg-sky)]">{years}</span>}
      </div>
      <p className={`mb-2 ${META}`}>{project.role}</p>
      <p className={`mb-2 ${BODY}`}>{project.tagline}</p>
      {project.impact && (
        <p className="mb-1 flex items-start gap-2 text-sm text-[color:var(--rpg-green)]">
          <span className="text-[color:var(--rpg-gold)]" aria-hidden="true">
            ★
          </span>
          {project.impact}
        </p>
      )}
      <Tags items={project.techStack.slice(0, 4)} label="Technologies used" />
      {links.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {links.map(({ kind, label, linkProps }) => (
            <Command key={kind} {...linkProps}>
              {label}
            </Command>
          ))}
        </div>
      ) : (
        <p className={`mt-3 ${BODY}`}>{NO_PUBLIC_LINK}</p>
      )}
    </Card>
  )
}

export function CompanyCard({ company }: { company: CVData['companies'][number] }) {
  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`block h-full p-4 transition-transform hover:-translate-y-0.5 motion-reduce:transition-none ${world.window} ${FOCUS}`}
      aria-label={`${company.name}: ${company.tagline} (opens in a new tab)`}
    >
      <div className="mb-2 flex items-start gap-3">
        <span className="text-xl" aria-hidden="true">
          {company.icon}
        </span>
        <div>
          <h3 className={TITLE}>{company.name}</h3>
          <p className={`mt-1 ${META}`}>{company.tagline}</p>
        </div>
      </div>
      <p className={`mb-3 ${BODY}`}>{company.description}</p>
      <div className="flex flex-wrap gap-1.5">
        {company.services.slice(0, 2).map((service) => (
          <span key={service} className={TAG}>
            {service}
          </span>
        ))}
      </div>
    </a>
  )
}

export function BandCard({ band, years, linkProps }: BandSlot) {
  const content = (
    <Card>
      <h3 className={TITLE}>{band.name}</h3>
      <p className={`mt-2 ${META}`}>
        {band.role}
        {years && <span aria-hidden="true"> | </span>}
        {years && <span>{years}</span>}
      </p>
      {band.release && (
        <p className={`mt-2 ${BODY}`}>
          {RELEASED} <cite>&ldquo;{band.release}&rdquo;</cite>
        </p>
      )}
    </Card>
  )

  if (!linkProps) return content
  return (
    <a {...linkProps} className={`block h-full transition-transform hover:-translate-y-0.5 motion-reduce:transition-none ${FOCUS}`}>
      {content}
    </a>
  )
}

// The tech stack as the item bag: one pocket per category, each item a slot.
export function ItemBag({ categories }: { categories: CVData['techStack'] }) {
  return (
    <div className="space-y-5">
      {categories.map((category) => (
        <div key={category.id}>
          <h3 className="mb-2 flex items-center gap-2 text-sm uppercase tracking-widest text-[color:var(--rpg-gold)]">
            <span aria-hidden="true">{category.icon}</span>
            {category.name}
          </h3>
          <ul className="flex flex-wrap gap-1.5" aria-label={`${category.name} technologies`}>
            {category.items.map((tech) => (
              <li key={tech} className="border border-[color:var(--rpg-border-shade)] bg-[color:var(--rpg-window-low)] px-2 py-1 text-sm text-[color:var(--rpg-text)]">
                {tech}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
