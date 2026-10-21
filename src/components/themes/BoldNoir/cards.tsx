import type { ProfessionOption } from '@/components/cv/ProfessionSwitch'
import type { ProjectSlot } from '@/components/cv/ProjectList'
import type { BandSlot } from '@/components/cv/BandList'
import type { CVData, Job } from '@/lib/cv/content'
import { jobYears } from '@/components/cv/sectionText'
import { HeroCharacter } from './character'
import world from './world.module.css'

// The profession switch card and the cards each section lists: black prints, paper borders and typed
// captions, with the red accent on what the eye must land on.

const SELECT_LOOK = {
  on: 'border-[#ff0033] -translate-y-1',
  off: 'border-[#5c5c5c] hover:border-[#f2efe6]',
}

// One card of the shared profession switch, a lineup: him in that profession's costume against the
// height lines, his placard under him; the picked one steps forward with the red border.
export function ProfessionCard({ id, label, selected, optionProps }: ProfessionOption) {
  return (
    <button
      type="button"
      {...optionProps}
      className={`relative w-full border-4 px-2 pb-3 pt-3 transition-transform motion-reduce:transition-none sm:w-44 ${world.lineup} ${SELECT_LOOK[selected ? 'on' : 'off']}`}
    >
      <HeroCharacter profession={id} className="relative mx-auto block h-24 w-16 sm:h-32 sm:w-20" />
      <span className={`relative mt-2 block px-1 py-1 text-sm font-bold uppercase leading-tight tracking-wider sm:text-base ${world.typed} ${world.caption}`}>
        {label}
      </span>
    </button>
  )
}

const BODY = `text-sm text-[#d6d3cb] ${world.copy}`
const CHIP = `border border-[#5c5c5c] px-2 py-0.5 text-sm text-[#f2efe6] ${world.copy}`

export function TechStackBoard({ categories }: { categories: CVData['techStack'] }) {
  return (
    <div className="space-y-6">
      {categories.map((category) => (
        <div key={category.id}>
          <h3 className="mb-2 flex items-center gap-3 text-xl uppercase tracking-widest">
            <span className="block h-3 w-3 bg-[#ff0033]" aria-hidden="true" />
            {category.name}
          </h3>
          <ul className="flex flex-wrap gap-2" aria-label={`${category.name} technologies`}>
            {category.items.map((tech) => (
              <li key={tech} className={CHIP}>
                {tech}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export function ExperienceCard({ entry }: { entry: Job }) {
  const { start, end } = jobYears(entry, 'Present')

  return (
    <article className={`p-4 ${world.card}`}>
      <div className="mb-2 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-2xl tracking-wide">{entry.title}</h3>
          <p className={`font-bold ${BODY}`}>{entry.company}</p>
        </div>
        <p className={`whitespace-nowrap bg-[#ff0033] px-2 py-0.5 text-sm font-bold text-[#0a0a0a] ${world.typed}`}>
          {start} - {end}
        </p>
      </div>
      {entry.description && <p className={`mb-2 ${BODY}`}>{entry.description}</p>}
      {entry.highlights.length > 0 && (
        <ul className="mt-3 space-y-1.5" aria-label="Key achievements">
          {entry.highlights.map((highlight) => (
            <li key={highlight} className={`flex items-start gap-2 ${BODY}`}>
              <span className="mt-1.5 block h-2 w-2 flex-shrink-0 bg-[#ff0033]" aria-hidden="true" />
              {highlight}
            </li>
          ))}
        </ul>
      )}
      {entry.skills.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-1" aria-label="Skills used">
          {entry.skills.slice(0, 4).map((skill) => (
            <li key={skill} className={CHIP}>
              {skill}
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

const LINK_BUTTON = `inline-flex min-h-[44px] items-center border-2 border-[#f2efe6] px-3 text-base uppercase tracking-wider text-[#f2efe6] transition-colors hover:bg-[#f2efe6] hover:text-[#0a0a0a] motion-reduce:transition-none`

export function ProjectCard({ project, years, links }: ProjectSlot) {
  const titleId = `noir-project-${project.id}`

  return (
    <article className={`h-full p-4 ${world.photo}`} aria-labelledby={titleId}>
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <h3 id={titleId} className="text-2xl tracking-wide">
          {project.name}
        </h3>
        {years && <span className={`whitespace-nowrap text-sm font-bold text-[#a3a3a3] ${world.typed}`}>{years}</span>}
      </div>
      <p className={`mb-1 font-bold ${BODY}`}>{project.role}</p>
      <p className={`mb-3 ${BODY}`}>{project.tagline}</p>
      {project.impact && <p className={`mb-3 px-3 py-2 text-sm font-bold ${world.typed} ${world.caption}`}>{project.impact}</p>}
      <ul className="flex flex-wrap gap-1" aria-label={`${project.name} technologies`}>
        {project.techStack.slice(0, 4).map((tech) => (
          <li key={tech} className={CHIP}>
            {tech}
          </li>
        ))}
      </ul>
      {links.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {links.map(({ kind, label, linkProps }) => (
            <a key={kind} {...linkProps} className={LINK_BUTTON}>
              {label}
            </a>
          ))}
        </div>
      ) : (
        <p className={`mt-4 italic ${BODY}`}>No public link</p>
      )}
    </article>
  )
}

export function CompanyCard({ company }: { company: CVData['companies'][number] }) {
  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${company.name}: ${company.tagline} (opens in a new tab)`}
      className={`block h-full p-4 transition-colors hover:border-[#f2efe6] motion-reduce:transition-none ${world.card}`}
    >
      <div className="mb-2 flex items-center gap-3">
        <span className="text-3xl" aria-hidden="true">
          {company.icon}
        </span>
        <div>
          <h3 className="text-xl tracking-wide">{company.name}</h3>
          <p className={`font-bold ${BODY}`}>{company.tagline}</p>
        </div>
      </div>
      <p className={BODY}>{company.description}</p>
    </a>
  )
}

export function BandCard({ band, years, linkProps }: BandSlot) {
  const card = (
    <article className={`h-full p-4 ${world.photo}`}>
      <h3 className="text-2xl tracking-wide">{band.name}</h3>
      <p className={`mt-1 font-bold ${BODY}`}>
        {band.role}
        {years && <span aria-hidden="true"> | </span>}
        {years}
      </p>
      {band.release && (
        <p className={`mt-2 ${BODY}`}>
          Released <cite>&ldquo;{band.release}&rdquo;</cite>
        </p>
      )}
    </article>
  )

  if (!linkProps) return card
  return (
    <a {...linkProps} className="block h-full">
      {card}
    </a>
  )
}
