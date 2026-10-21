import type { ProfessionOption } from '@/components/cv/ProfessionSwitch'
import type { ProjectSlot } from '@/components/cv/ProjectList'
import type { BandSlot } from '@/components/cv/BandList'
import type { CVData, Job } from '@/lib/cv/content'
import { jobYears, newTabName } from '@/components/cv/sectionText'
import { useLabels } from '@/components/cv/CVDataProvider'
import { fillLabel } from '@/lib/cv/labels'
import { HeroCharacter } from './character'
import { MYTH } from './palette'
import world from './world.module.css'

// The profession switch's shrines and the cards each section lists: marble blocks with a terracotta
// edge, a name painted on a band of fired clay, and the text in black and dark stone.

// One shrine of the shared profession switch: him in that profession's costume under a pediment, his
// name plate under him; the picked shrine steps up with the terracotta border.
export function ProfessionShrine({ id, label, selected, optionProps }: ProfessionOption) {
  return (
    <button
      type="button"
      {...optionProps}
      className={`relative w-full px-2 pb-3 transition-transform motion-reduce:transition-none sm:w-44 ${world.shrine} ${selected ? world.shrineOn : ''}`}
    >
      <svg viewBox="0 0 100 16" preserveAspectRatio="none" className="mx-[-0.5rem] block h-5 w-[calc(100%_+_1rem)]" aria-hidden="true" focusable="false">
        <path d="M0 16 L50 1 L100 16 Z" fill={selected ? MYTH.terracottaDeep : MYTH.stone} />
        <path d="M14 13 L50 4.5 L86 13 Z" fill={MYTH.marble} />
      </svg>
      <HeroCharacter profession={id} className="mx-auto mt-2 block h-24 w-16 sm:h-32 sm:w-20" />
      <span className={`mt-2 block px-1 py-1 text-sm leading-tight sm:text-base ${world.carved} ${world.plaque}`}>{label}</span>
    </button>
  )
}

const BODY = 'text-sm text-[color:var(--myth-ink-soft)]'
const CHIP = 'border border-[color:var(--myth-stone)] bg-[var(--myth-marble)] px-2 py-0.5 text-sm text-[color:var(--myth-ink)]'
const NAME = `text-lg sm:text-xl ${world.carved}`

export function TechStackBoard({ categories }: { categories: CVData['techStack'] }) {
  const { cards } = useLabels()
  return (
    <div className="space-y-6">
      {categories.map((category) => (
        <div key={category.id}>
          <h3 className={`mb-2 flex items-center gap-3 text-base ${world.carved}`}>
            <span className="block h-3 w-3 rotate-45 bg-[var(--myth-terracotta)]" aria-hidden="true" />
            {category.name}
          </h3>
          <ul className="flex flex-wrap gap-2" aria-label={fillLabel(cards.categoryTechnologies, { name: category.name })}>
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
  const { cards, years } = useLabels()
  const { start, end } = jobYears(entry, years.present)

  return (
    <article className={`p-4 ${world.block}`}>
      <div className="mb-2 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className={NAME}>{entry.title}</h3>
          <p className="text-sm font-bold text-[color:var(--myth-aegean)]">{entry.company}</p>
        </div>
        <p className={`whitespace-nowrap px-2 py-0.5 text-sm ${world.plaque}`}>
          {start} - {end}
        </p>
      </div>
      {entry.description && <p className={`mb-2 ${BODY}`}>{entry.description}</p>}
      {entry.highlights.length > 0 && (
        <ul className="mt-3 space-y-1.5" aria-label={cards.keyAchievements}>
          {entry.highlights.map((highlight) => (
            <li key={highlight} className={`flex items-start gap-2 ${BODY}`}>
              <span className="mt-1.5 block h-2 w-2 flex-shrink-0 rotate-45 bg-[var(--myth-terracotta)]" aria-hidden="true" />
              {highlight}
            </li>
          ))}
        </ul>
      )}
      {entry.skills.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-1" aria-label={cards.skillsUsed}>
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

const LINK_BUTTON =
  'inline-flex min-h-[44px] items-center border-2 border-[color:var(--myth-ink)] bg-[var(--myth-marble)] px-3 text-sm font-bold text-[color:var(--myth-ink)] transition-transform hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:transform-none'

export function ProjectCard({ project, years, links }: ProjectSlot) {
  const titleId = `mythic-project-${project.id}`
  const { cards } = useLabels()

  return (
    <article className={`h-full ${world.block}`} aria-labelledby={titleId}>
      <div className={`flex items-baseline justify-between gap-2 px-4 py-2 ${world.clay}`}>
        <h3 id={titleId} className={NAME}>
          {project.name}
        </h3>
        {years && <span className="whitespace-nowrap text-sm font-bold">{years}</span>}
      </div>
      <div className="p-4">
        <p className="mb-1 text-sm font-bold text-[color:var(--myth-aegean)]">{project.role}</p>
        <p className={`mb-3 ${BODY}`}>{project.tagline}</p>
        {project.impact && <p className={`mb-3 px-3 py-2 text-sm italic ${world.plaque}`}>{project.impact}</p>}
        <ul className="flex flex-wrap gap-1" aria-label={fillLabel(cards.categoryTechnologies, { name: project.name })}>
          {project.techStack.slice(0, 4).map((tech) => (
            <li key={tech} className={CHIP}>
              {tech}
            </li>
          ))}
        </ul>
        {links.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {links.map(({ kind, label, linkProps }) => (
              <a key={kind} {...linkProps} className={LINK_BUTTON}>
                {label}
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
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
      className={`block h-full p-4 transition-transform hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:transform-none ${world.block}`}
    >
      <div className="mb-2 flex items-center gap-3">
        <span className="text-3xl" aria-hidden="true">
          {company.icon}
        </span>
        <div>
          <h3 className={NAME}>{company.name}</h3>
          <p className="text-sm font-bold text-[color:var(--myth-aegean)]">{company.tagline}</p>
        </div>
      </div>
      <p className={BODY}>{company.description}</p>
    </a>
  )
}

export function BandCard({ band, years, linkProps }: BandSlot) {
  const { links } = useLabels()
  const card = (
    <article className={`h-full ${world.block}`}>
      <h3 className={`px-4 py-2 ${NAME} ${world.clay}`}>{band.name}</h3>
      <div className="p-4">
        <p className="text-sm font-bold text-[color:var(--myth-aegean)]">
          {band.role}
          {years && <span aria-hidden="true"> | </span>}
          {years}
        </p>
        {band.release && (
          <p className={`mt-2 ${BODY}`}>
            {links.released} <cite>&ldquo;{band.release}&rdquo;</cite>
          </p>
        )}
      </div>
    </article>
  )

  if (!linkProps) return card
  return (
    <a {...linkProps} className="block h-full">
      {card}
    </a>
  )
}
