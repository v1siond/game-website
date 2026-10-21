import type { Profession } from '@/lib/cv/professions'
import type { CVData, Job } from '@/lib/cv/content'
import type { ProfessionOption } from '@/components/cv/ProfessionSwitch'
import type { ProjectSlot } from '@/components/cv/ProjectList'
import type { BandSlot } from '@/components/cv/BandList'
import { jobYears, newTabName } from '@/components/cv/sectionText'
import { useLabels } from '@/components/cv/CVDataProvider'
import { fillLabel } from '@/lib/cv/labels'
import { Crate, Gem, Mango, type GemColor } from './icons'
import world from './world.module.css'

// Tropical Platformer's cards for jobs, projects, ventures and bands, the tech stack as crate chips,
// and the warp zone gem that is one option of the shared profession switch. Text is parchment or white
// on dark wood and jungle shade, 4.5:1 or more.

const CARD = `rounded-lg border-2 p-4 ${world.card}`
const TAG_LIST = 'mt-3 flex flex-wrap gap-1.5'
const TAG = 'rounded border border-[var(--tp-leaf-light)] bg-[var(--tp-canopy)] px-2 py-1 text-sm text-[var(--tp-lime)]'

export function TechCrates({ categories }: { categories: CVData['techStack'] }) {
  const { cards } = useLabels()
  return (
    <div className="space-y-6">
      {categories.map((category) => (
        <div key={category.id}>
          <h3 className={`mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-[var(--tp-sun)] ${world.display}`}>
            <Mango size={18} />
            {category.name}
          </h3>
          <ul className="flex flex-wrap gap-2" aria-label={fillLabel(cards.categoryTechnologies, { name: category.name })}>
            {category.items.map((tech) => (
              <li
                key={tech}
                className={`rounded border-2 border-[var(--tp-wood-light)] px-3 py-2 text-sm font-bold text-white ${world.chip} ${world.outlined}`}
              >
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
    <article className={`${CARD} border-[var(--tp-sun)]`}>
      <div className="mb-3 flex flex-col items-start justify-between gap-2 sm:flex-row">
        <div>
          <h3 className="text-lg font-bold text-white">{entry.title}</h3>
          <p className="text-sm font-semibold text-[var(--tp-sun)]">{entry.company}</p>
        </div>
        <span className="whitespace-nowrap rounded bg-[var(--tp-night)] px-3 py-1 text-sm font-bold text-[var(--tp-sea-light)]">
          {start} - {end}
        </span>
      </div>
      {entry.description && <p className="mb-3 text-sm text-[var(--tp-parchment)]">{entry.description}</p>}
      {entry.highlights.length > 0 && (
        <ul className="space-y-2" aria-label={cards.keyAchievements}>
          {entry.highlights.map((highlight) => (
            <li key={highlight} className="flex items-start gap-2 text-sm text-white">
              <Mango size={14} className="mt-0.5 flex-shrink-0" />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      )}
      {entry.skills.length > 0 && (
        <ul className={TAG_LIST} aria-label={cards.skillsUsed}>
          {entry.skills.map((skill) => (
            <li key={skill} className={TAG}>
              {skill}
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

const LINK_BUTTON = `inline-flex min-h-[44px] items-center rounded-md border-[3px] border-[var(--tp-sun)] px-4 text-sm font-black tracking-widest text-white transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[var(--tp-sun)] ${world.buttonFruit} ${world.display} ${world.outlined}`

export function ProjectCard({ project, years, links }: ProjectSlot) {
  const labels = useLabels()
  return (
    <article className={`${CARD} h-full ${project.highlight ? 'border-[var(--tp-gem-blue)]' : 'border-[var(--tp-wood-light)]'}`}>
      <div className="flex items-start justify-between gap-2">
        <h3 className="flex items-center gap-2 text-lg font-bold text-white">
          {project.highlight && <Gem size={16} color="blue" />}
          {project.name}
        </h3>
        {years && <span className="whitespace-nowrap text-sm font-bold text-[var(--tp-sea-light)]">{years}</span>}
      </div>
      <p className="mt-1 text-sm font-semibold text-[var(--tp-sun)]">{project.role}</p>
      <p className="mt-2 text-sm text-[var(--tp-parchment)]">{project.tagline}</p>
      {project.impact && (
        <p className="mt-2 flex items-start gap-2 text-sm font-bold text-white">
          <Mango size={16} className="mt-0.5 flex-shrink-0" />
          {project.impact}
        </p>
      )}
      {project.techStack.length > 0 && (
        <ul className={TAG_LIST} aria-label={labels.cards.technologiesUsed}>
          {project.techStack.map((tech) => (
            <li key={tech} className={TAG}>
              {tech}
            </li>
          ))}
        </ul>
      )}
      {links.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-3">
          {links.map(({ kind, label, linkProps }) => (
            <a key={kind} {...linkProps} className={LINK_BUTTON}>
              {label}
            </a>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm italic text-[var(--tp-parchment)]">{labels.links.noPublicLink}</p>
      )}
    </article>
  )
}

export function VentureCard({ company }: { company: CVData['companies'][number] }) {
  const { links } = useLabels()
  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${CARD} block h-full border-[var(--tp-wood-light)] transition-transform hover:scale-[1.02] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[var(--tp-sun)]`}
      aria-label={newTabName(links, `${company.name}: ${company.tagline}`)}
    >
      <div className="mb-2 flex items-center gap-3">
        <Crate size={36} variant="flag" />
        <div>
          <h3 className="text-base font-bold text-white">{company.name}</h3>
          <p className="text-sm font-semibold text-[var(--tp-sun)]">{company.tagline}</p>
        </div>
      </div>
      <p className="text-sm text-[var(--tp-parchment)]">{company.description}</p>
    </a>
  )
}

export function BandCard({ band, years, linkProps }: BandSlot) {
  const { links } = useLabels()
  const content = (
    <article className={`h-full rounded-lg border-2 border-[var(--tp-gem-purple)] p-4 ${world.bandCard}`}>
      <h3 className="text-base font-bold text-white">{band.name}</h3>
      <p className="mt-1 text-sm font-semibold text-[var(--tp-sun)]">
        {band.role}
        {years && <span aria-hidden="true"> | </span>}
        {years && <span>{years}</span>}
      </p>
      {band.release && (
        <p className="mt-2 text-sm text-[var(--tp-parchment)]">
          {links.released} <cite>&ldquo;{band.release}&rdquo;</cite>
        </p>
      )}
    </article>
  )

  return linkProps ? (
    <a
      {...linkProps}
      className="block h-full rounded-lg focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[var(--tp-sun)]"
    >
      {content}
    </a>
  ) : (
    content
  )
}

// One warp zone per profession: its gem, its colour (a --halo the glow and the picked border read).
const WARP_ZONES: Record<Profession, { gem: GemColor; tone: string }> = {
  engineer: { gem: 'blue', tone: '[--halo:var(--tp-gem-blue)]' },
  drummer: { gem: 'purple', tone: '[--halo:var(--tp-gem-purple)]' },
  fighter: { gem: 'red', tone: '[--halo:var(--tp-gem-red)]' },
}

export function WarpZone({ id, label, selected, optionProps }: ProfessionOption) {
  const zone = WARP_ZONES[id]

  return (
    <button
      type="button"
      {...optionProps}
      className={`group relative rounded-xl focus:outline-none focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[var(--tp-sun)] ${zone.tone}`}
    >
      <div
        className={`absolute -inset-6 rounded-full transition-opacity duration-300 ${world.halo} ${selected ? 'opacity-70' : 'opacity-0 group-hover:opacity-40'}`}
        aria-hidden="true"
      />
      <div
        className={`relative flex h-28 w-24 flex-col items-center justify-center rounded-xl border-4 px-1 transition-transform duration-300 sm:h-32 sm:w-32 bg-[linear-gradient(135deg,var(--tp-night),var(--tp-wood-dark))] ${
          selected ? 'scale-110 border-[var(--halo)]' : 'border-[var(--tp-wood-light)] group-hover:scale-105'
        }`}
      >
        <Gem size={40} color={zone.gem} className={selected ? world.bob : ''} />
        <span
          className={`mt-2 text-center text-sm font-black uppercase leading-tight tracking-wide ${world.display} ${world.outlined} ${
            selected ? 'text-white' : 'text-[var(--tp-sand)]'
          }`}
        >
          {label}
        </span>
      </div>
    </button>
  )
}
