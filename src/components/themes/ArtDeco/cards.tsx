import type { ReactNode } from 'react'
import type { BandSlot } from '@/components/cv/BandList'
import type { ProjectSlot } from '@/components/cv/ProjectList'
import type { CVData, Job } from '@/lib/cv/content'
import { jobYears, newTabName } from '@/components/cv/sectionText'
import { useLabels } from '@/components/cv/CVDataProvider'
import { fillLabel } from '@/lib/cv/labels'
import { GOLD_OUTLINE } from './actions'
import look from './world.module.css'

// The brass cards every list entry sits on, and the tech stack's tag cloud.

// A small brass tag: a skill, a technology, the years.
const TAG = 'border border-[#D4AF37]/40 bg-[#D4AF37]/15 px-2 py-1 text-sm text-[#D4AF37]'
const BODY = 'text-sm text-[#d0c8b8]'
const TEXT = 'text-sm text-[#e8e0d0]'

export const CARD_TITLE = `font-['Playfair_Display',serif] text-[#D4AF37] ${look.cardTitle}`

function Bullet() {
  return (
    <span className="text-[#D4AF37]" aria-hidden="true">
      {'>'}
    </span>
  )
}

// The card: still caustic light, the deco top rule with its corner brackets, and a gleam on hover.
export function BrassCard({ children }: { children: ReactNode }) {
  return (
    <article className={`group relative h-full overflow-hidden border border-[#D4AF37]/40 p-5 ${look.card}`}>
      <div className={`pointer-events-none absolute inset-0 opacity-[0.12] ${look.cardLight}`} aria-hidden="true" />

      <div className="absolute left-0 right-0 top-0 flex items-center" aria-hidden="true">
        <div className="h-4 w-4 border-l-2 border-t-2 border-[#D4AF37]" />
        <div className="h-px flex-1 bg-gradient-to-r from-[#D4AF37] via-[#D4AF37]/25 to-[#D4AF37]" />
        <div className="h-4 w-4 border-r-2 border-t-2 border-[#D4AF37]" />
      </div>

      <div className="relative z-10 pt-3">{children}</div>

      <div
        className={`pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 motion-safe:transition-opacity ${look.cardGleam}`}
        aria-hidden="true"
      />
    </article>
  )
}

export function ExperienceCard({ entry }: { entry: Job }) {
  const { years, cards } = useLabels()
  const { start, end } = jobYears(entry, years.present)

  return (
    <BrassCard>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className={`text-lg ${CARD_TITLE}`}>{entry.title}</h3>
          <p className={`mt-1 ${TEXT}`}>{entry.company}</p>
        </div>
        <span className={TAG}>
          {start} - {end}
        </span>
      </div>

      {entry.description && <p className={`mb-4 ${BODY}`}>{entry.description}</p>}

      {entry.highlights.length > 0 && (
        <ul className="mb-4 space-y-1.5" aria-label={cards.keyAchievements}>
          {entry.highlights.map((highlight) => (
            <li key={highlight} className={`flex items-start gap-2 ${TEXT}`}>
              <Bullet />
              {highlight}
            </li>
          ))}
        </ul>
      )}

      {entry.skills.length > 0 && (
        <ul className="flex flex-wrap gap-2" aria-label={cards.skillsUsed}>
          {entry.skills.slice(0, 4).map((skill) => (
            <li key={skill} className={TAG}>
              {skill}
            </li>
          ))}
        </ul>
      )}
    </BrassCard>
  )
}

export function TechCloud({ categories }: { categories: CVData['techStack'] }) {
  const { cards } = useLabels()
  return (
    <div className="space-y-5">
      {categories.map((category) => (
        <div key={category.id}>
          <h3 className={`mb-3 flex items-center gap-2 text-sm uppercase tracking-[0.2em] ${look.neon}`}>
            <span aria-hidden="true">{category.icon}</span>
            {category.name}
          </h3>
          <ul className="flex flex-wrap gap-2" aria-label={fillLabel(cards.categoryTechnologies, { name: category.name })}>
            {category.items.map((tech) => (
              <li key={tech} className="border border-[#D4AF37]/45 bg-[#D4AF37]/10 px-3 py-1.5 text-sm text-[#e8e0d0]">
                {tech}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

// A project as a poster of the city: his role, the result line and the links.
export function ProjectCard({ project, years, links }: ProjectSlot) {
  const labels = useLabels()
  return (
    <BrassCard>
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className={`text-lg ${CARD_TITLE}`}>{project.name}</h3>
        {years && <span className="whitespace-nowrap text-sm text-[#D4AF37]">{years}</span>}
      </div>
      <p className="mb-2 text-sm tracking-wider text-[#F0C850]">{project.role}</p>
      <p className={`mb-3 ${BODY}`}>{project.tagline}</p>
      {project.impact && (
        <p className={`mb-3 flex items-start gap-2 ${TEXT}`}>
          <Bullet />
          <span className="italic">{project.impact}</span>
        </p>
      )}
      {project.techStack.length > 0 && (
        <ul className="flex flex-wrap gap-2" aria-label={labels.cards.technologiesUsed}>
          {project.techStack.slice(0, 4).map((tech) => (
            <li key={tech} className={TAG}>
              {tech}
            </li>
          ))}
        </ul>
      )}
      {links.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-3">
          {links.map(({ kind, label, linkProps }) => (
            <a key={kind} {...linkProps} className={GOLD_OUTLINE}>
              {label}
            </a>
          ))}
        </div>
      ) : (
        <p className={`mt-4 ${BODY}`}>{labels.links.noPublicLink}</p>
      )}
    </BrassCard>
  )
}

export function CompanyCard({ company }: { company: CVData['companies'][number] }) {
  const { links } = useLabels()
  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={newTabName(links, `${company.name}: ${company.tagline}`)}
      className="block h-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F0C850]"
    >
      <BrassCard>
        <div className="mb-3 flex items-center gap-3">
          <span className="text-3xl" aria-hidden="true">
            {company.icon}
          </span>
          <div>
            <h3 className={`text-base ${CARD_TITLE}`}>{company.name}</h3>
            <p className={BODY}>{company.tagline}</p>
          </div>
        </div>
        <p className={TEXT}>{company.description}</p>
      </BrassCard>
    </a>
  )
}

export function BandCard({ band, years, linkProps }: BandSlot) {
  const { links } = useLabels()
  const content = (
    <BrassCard>
      <h3 className={`text-base ${CARD_TITLE}`}>{band.name}</h3>
      <p className={`mt-1 ${BODY}`}>
        {band.role}
        {years && <span aria-hidden="true"> - </span>}
        {years && <span>{years}</span>}
      </p>
      {band.release && (
        <p className={`mt-2 ${TEXT}`}>
          {links.released} <cite>&ldquo;{band.release}&rdquo;</cite>
        </p>
      )}
    </BrassCard>
  )

  if (!linkProps) return content
  return (
    <a {...linkProps} className="block h-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F0C850]">
      {content}
    </a>
  )
}
