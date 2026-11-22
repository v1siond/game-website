import type { ReactNode } from 'react'
import type { BandSlot } from '@/components/cv/BandList'
import type { ProjectSlot } from '@/components/cv/ProjectList'
import type { CVData, Job, Service } from '@/lib/cv/content'
import { HitSpark } from './badges'
import { ACCENT, type Accent } from './frames'
import { BLUE_OUTLINE } from './actions'
import look from './world.module.css'
import { useLabels } from '@/components/cv/CVDataProvider'
import { newTabName } from '@/lib/cv/sectionText'
import { jobCard, projectCard, ventureCard } from '@/lib/cv/cvView'
import { fillLabel } from '@/lib/cv/labels'
import { SlashBreaks } from '@/components/cv/SlashBreaks'

// The fight cards every list entry sits on: a flat dark box ruled in its accent, ringed in black, with
// the cut corner of a move list panel; highlights are marked with a hit spark. A running job is ruled
// health green, a highlighted project life bar yellow.

const TITLE = `text-lg uppercase leading-tight text-white [text-shadow:2px_2px_0_var(--fs-navy)] ${look.display}`
const BODY = 'text-sm leading-relaxed text-[color:var(--fs-chrome)]'
const TAG = `px-3 py-1 text-sm ${look.tag}`
const FOCUS = 'focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--fs-gold)]'

function FightCard({ accent, children }: { accent: Accent; children: ReactNode }) {
  return (
    <article className={`relative h-full ${look.card} ${look.cutCorner} ${ACCENT[accent]}`}>
      <div className="relative p-5">{children}</div>
      <span className={`absolute bottom-0 right-0 h-6 w-6 ${look.cornerTab}`} aria-hidden="true" />
    </article>
  )
}

function Tags({ items, label }: { items: string[]; label: string }) {
  if (items.length === 0) return null
  return (
    <ul className="flex flex-wrap gap-2" aria-label={label}>
      {items.map((item) => (
        <li key={item} className={TAG}>
          {item}
        </li>
      ))}
    </ul>
  )
}

/** Lines marked with a hit spark: a job's highlights, a project's details, the About highlights. */
export function SparkLines({ items, label }: { items: string[]; label: string }) {
  if (items.length === 0) return null
  return (
    <ul className="mb-4 space-y-2" aria-label={label}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-sm text-white">
          <HitSpark />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

// The job's years stand on the round's life bars above the card (./rounds), not on the card.
export function ExperienceCard({ entry }: { entry: Job }) {
  const running = !entry.endDate
  const { cards, years } = useLabels()
  const job = jobCard(entry, years)

  return (
    <FightCard accent={running ? 'health' : 'cyan'}>
      <div className="mb-4">
        <h3 className={TITLE}>{job.title}</h3>
        <p className="text-sm text-[color:var(--accent)]">
          <SlashBreaks text={job.company} />
        </p>
        {job.location && <p className={BODY}>{job.location}</p>}
      </div>

      {job.description && <p className={`mb-4 ${BODY}`}>{job.description}</p>}

      <SparkLines items={job.highlights} label={cards.keyAchievements} />

      <Tags items={job.skills} label={cards.skillsUsed} />
    </FightCard>
  )
}

export function ProjectCard({ project: entry, links, noLink }: ProjectSlot) {
  const labels = useLabels()
  const project = projectCard(entry, labels)
  return (
    <FightCard accent={entry.highlight ? 'gold' : 'cyan'}>
      <div className="mb-2 flex flex-wrap items-start justify-between gap-x-2 gap-y-1">
        <h3 className={`min-w-0 ${TITLE}`}>
          <SlashBreaks text={project.name} />
        </h3>
        {project.years && <span className={`whitespace-nowrap text-sm text-[color:var(--accent)] ${look.display}`}>{project.years}</span>}
      </div>
      <p className="mb-2 text-sm font-bold text-white">{project.role}</p>
      <p className={`mb-3 ${BODY}`}>{project.tagline}</p>
      {project.description && <p className={`mb-4 ${BODY}`}>{project.description}</p>}

      {project.impact && (
        <p className={`mb-4 flex items-start gap-2 px-4 py-2.5 text-sm text-[color:var(--accent)] ${look.impact}`}>
          <HitSpark />
          <span>
            <span className="sr-only">{labels.cards.impact}: </span>
            {project.impact}
          </span>
        </p>
      )}

      <SparkLines items={project.details} label={labels.cards.details} />

      <Tags items={project.techStack} label={labels.cards.technologiesUsed} />

      {links.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-3">
          {links.map(({ kind, label, linkProps }) => (
            <a key={kind} {...linkProps} className={BLUE_OUTLINE}>
              {label}
            </a>
          ))}
        </div>
      )}
      {noLink && <p className={`mt-4 ${BODY}`}>{noLink}</p>}
    </FightCard>
  )
}

export function BandCard({ band, years, linkProps, release }: BandSlot) {
  const content = (
    <FightCard accent="p2">
      <h3 className={TITLE}>{band.name}</h3>
      <p className="mt-2 text-sm text-[color:var(--accent)]">
        {band.role}
        {years && <span aria-hidden="true"> - </span>}
        {years && <span>{years}</span>}
      </p>
      {release && (
        <p className={`mt-3 ${BODY}`}>
          {release.label} <cite>&ldquo;{release.title}&rdquo;</cite>
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

// A venture as a fight card; one of his own products (featured) is a wider gold card with a gold
// player tag over the name, the way the select screen marks the pick.
export function VentureCard({ company: entry }: { company: CVData['companies'][number] }) {
  const { links, cards, sections } = useLabels()
  const company = ventureCard(entry)

  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={newTabName(links, `${company.featured ? `${cards.ownProduct}, ` : ''}${company.name}: ${company.tagline}`)}
      className={`block h-full motion-safe:transition-transform motion-safe:hover:scale-[1.02] ${FOCUS}`}
    >
      <FightCard accent={company.featured ? 'gold' : 'cyan'}>
        {company.featured && (
          <p className={`mb-3 inline-block bg-[color:var(--accent)] px-2 py-0.5 text-sm uppercase tracking-widest text-black ${look.display}`}>
            {cards.ownProduct}
          </p>
        )}
        <div className="flex items-center gap-4">
          <span className="text-4xl" aria-hidden="true">
            {company.icon}
          </span>
          <div className="min-w-0">
            <h3 className={TITLE}>
              <SlashBreaks text={company.name} />
            </h3>
            <p className="text-sm text-[color:var(--accent)]">{company.tagline}</p>
          </div>
        </div>
        <p className={`mt-4 ${BODY}`}>{company.description}</p>
        {company.services.length > 0 && (
          <div className="mt-4">
            <Tags items={company.services} label={sections.services} />
          </div>
        )}
      </FightCard>
    </a>
  )
}

// One tech stack category as a move list card: its technologies a grid of command slots.
export function MoveCard({ category }: { category: CVData['techStack'][number] }) {
  const { cards } = useLabels()

  return (
    <FightCard accent="cyan">
      <h3 className={`mb-4 flex items-center gap-3 ${TITLE}`}>
        <span aria-hidden="true">{category.icon}</span>
        {category.name}
      </h3>
      <ul
        className="grid grid-cols-1 gap-2 min-[360px]:grid-cols-2"
        aria-label={fillLabel(cards.categoryTechnologies, {
          name: category.name,
        })}
      >
        {category.items.map((tech) => (
          <li key={tech} className="min-w-0 break-words border border-[color:var(--fs-steel)] bg-black px-3 py-2 text-sm text-white">
            <SlashBreaks text={tech} />
          </li>
        ))}
      </ul>
    </FightCard>
  )
}

// A service as a plain fight card: its title and one line.
export function ServiceCard({ service }: { service: Service }) {
  return (
    <FightCard accent="p1">
      <h3 className={`mb-3 ${TITLE}`}>{service.title}</h3>
      <p className="text-base leading-relaxed text-white">{service.line}</p>
    </FightCard>
  )
}
