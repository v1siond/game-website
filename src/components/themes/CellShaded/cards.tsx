import type { ProfessionOption } from '@/components/cv/ProfessionSwitch'
import type { ProjectSlot } from '@/components/cv/ProjectList'
import type { BandSlot } from '@/components/cv/BandList'
import type { CVData, Job } from '@/lib/cv/content'
import { jobYears, NO_PUBLIC_LINK, RELEASED } from '@/components/cv/sectionText'
import { HeroCharacter } from './character'
import { ImpactBurst } from './backdrop'
import { ACCENT_FILL, type Accent } from './panels'
import world from './world.module.css'

// The character select card and the cards each section lists, all flat fills under one ink line.

// Cards take their accent in turn, so a list reads as a run of different coloured panels.
const ACCENT_ORDER: Accent[] = ['sun', 'sky', 'magenta', 'orange', 'green']
export const accentAt = (index: number): Accent => ACCENT_ORDER[index % ACCENT_ORDER.length]

const SELECT_LOOK = {
  on: { card: '-rotate-2 scale-105 bg-[#ffd23f]', burst: 'opacity-100' },
  off: { card: 'bg-white hover:scale-105', burst: 'opacity-0' },
}

// One card of the shared profession switch, a fighting game's character select: his portrait in that
// profession's costume, the picked one tilted forward on a starburst.
export function ProfessionCard({ id, label, selected, optionProps }: ProfessionOption) {
  const look = SELECT_LOOK[selected ? 'on' : 'off']

  return (
    <button
      type="button"
      {...optionProps}
      className={`relative w-full border-[5px] border-[#141414] px-2 pb-3 pt-2 transition-transform motion-reduce:transition-none sm:w-44 ${world.drop} ${look.card}`}
    >
      <span className={`pointer-events-none absolute inset-x-0 top-0 mx-auto block h-24 w-24 sm:h-32 sm:w-32 ${look.burst}`} aria-hidden="true">
        <ImpactBurst fill="#ff7a1a" />
      </span>
      <HeroCharacter profession={id} className="relative mx-auto block h-24 w-16 sm:h-32 sm:w-20" />
      <span className="relative mt-2 block text-sm uppercase leading-tight tracking-wider sm:text-lg">{label}</span>
    </button>
  )
}

export function TechStackCloud({ categories }: { categories: CVData['techStack'] }) {
  return (
    <div className="space-y-5">
      {categories.map((category, index) => (
        <div key={category.id}>
          <h3 className="mb-2 flex items-center gap-2 text-base uppercase tracking-widest">
            <span aria-hidden="true">{category.icon}</span>
            {category.name}
          </h3>
          <ul className={`flex flex-wrap gap-2 ${world.copy}`} aria-label={`${category.name} technologies`}>
            {category.items.map((tech) => (
              <li key={tech} className={`border-2 border-[#141414] px-2 py-0.5 text-sm font-bold ${world.drop} ${ACCENT_FILL[accentAt(index)]}`}>
                {tech}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

const BODY = `text-sm text-[#141414] ${world.copy}`

export function ExperienceCard({ entry, index }: { entry: Job; index: number }) {
  const { start, end } = jobYears(entry, 'Present')

  return (
    <article className={`relative p-4 pt-6 ${world.card}`}>
      <p className={`absolute -left-2 -top-4 -rotate-3 border-[3px] border-[#141414] px-3 py-0.5 text-sm tracking-wider ${world.drop} ${ACCENT_FILL[accentAt(index)]}`}>
        {start} - {end}
      </p>
      <h3 className="mt-1 text-xl tracking-wide">{entry.title}</h3>
      <p className={`mb-2 font-bold ${BODY}`}>{entry.company}</p>
      {entry.description && <p className={`mb-2 ${BODY}`}>{entry.description}</p>}
      {entry.highlights.length > 0 && (
        <ul className="mt-3 space-y-1.5" aria-label="Key accomplishments">
          {entry.highlights.map((highlight) => (
            <li key={highlight} className={`flex items-start gap-2 ${BODY}`}>
              <span className="mt-1.5 block h-2 w-2 flex-shrink-0 rotate-45 bg-[#141414]" aria-hidden="true" />
              {highlight}
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

const LINK_BUTTON = `inline-flex min-h-[44px] items-center border-[3px] border-[#141414] bg-white px-3 text-sm uppercase tracking-wider transition-transform hover:-rotate-2 motion-reduce:transition-none ${world.drop}`

export function ProjectCard({ project, years, links, index }: ProjectSlot & { index: number }) {
  return (
    <article className={`relative h-full p-4 ${world.card}`} aria-labelledby={`cel-project-${project.id}`}>
      <div className={`-mx-4 -mt-4 mb-3 flex items-baseline justify-between gap-2 border-b-4 border-[#141414] px-4 py-2 ${ACCENT_FILL[accentAt(index)]}`}>
        <h3 id={`cel-project-${project.id}`} className="text-lg tracking-wide">
          {project.name}
        </h3>
        {years && <span className={`whitespace-nowrap text-sm font-bold ${world.copy}`}>{years}</span>}
      </div>
      <p className={`mb-1 font-bold ${BODY}`}>{project.role}</p>
      <p className={`mb-2 ${BODY}`}>{project.tagline}</p>
      {project.impact && <p className={`mb-3 border-l-4 border-[#141414] bg-[#fbf3df] px-2 py-1 font-bold ${BODY}`}>{project.impact}</p>}
      <ul className={`flex flex-wrap gap-1 ${world.copy}`} aria-label={`${project.name} technologies`}>
        {project.techStack.slice(0, 4).map((tech) => (
          <li key={tech} className="bg-[#141414] px-2 py-0.5 text-sm font-bold text-[#fbf3df]">
            {tech}
          </li>
        ))}
      </ul>
      {links.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {links.map(({ kind, label, linkProps }) => (
            <a key={kind} {...linkProps} className={LINK_BUTTON}>
              {label}
            </a>
          ))}
        </div>
      ) : (
        <p className={`mt-3 italic ${BODY}`}>{NO_PUBLIC_LINK}</p>
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
      aria-label={`Visit ${company.name} - ${company.tagline} (opens in a new tab)`}
      className={`block h-full p-4 transition-transform hover:-rotate-1 hover:scale-[1.02] motion-reduce:transition-none ${world.card}`}
    >
      <div className="mb-2 flex items-center gap-3">
        <span className="text-3xl" aria-hidden="true">
          {company.icon}
        </span>
        <div>
          <h3 className="text-lg tracking-wide">{company.name}</h3>
          <p className={`font-bold ${BODY}`}>{company.tagline}</p>
        </div>
      </div>
      <p className={BODY}>{company.description}</p>
      <ul className="mt-3 space-y-1">
        {company.services.slice(0, 2).map((service) => (
          <li key={service} className={`flex items-center gap-2 font-bold ${BODY}`}>
            <span className="block h-2 w-2 rotate-45 bg-[#ff7a1a]" aria-hidden="true" />
            {service}
          </li>
        ))}
      </ul>
    </a>
  )
}

export function BandCard({ band, years, linkProps }: BandSlot) {
  const card = (
    <article className={`relative h-full p-4 ${world.darkCard}`}>
      <h3 className="text-lg tracking-wide text-[#ffd23f]">{band.name}</h3>
      <p className={`mt-1 text-sm font-bold text-[#fbf3df] ${world.copy}`}>
        {band.role}
        {years && <span aria-hidden="true"> | </span>}
        {years}
      </p>
      {band.release && (
        <p className={`mt-2 text-sm text-[#eadcb8] ${world.copy}`}>
          {RELEASED} <cite>&ldquo;{band.release}&rdquo;</cite>
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
