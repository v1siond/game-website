import type { ProjectSlot } from '@/components/cv/ProjectList'
import type { BandSlot } from '@/components/cv/BandList'
import type { CVData, Job } from '@/lib/cv/content'
import { jobYears } from '@/components/cv/sectionText'
import { RoomGlyph } from './art'
import { SOUL } from './palette'
import world from './world.module.css'

// The cards each section lists, drawn as the rooms and finds of the cavern map: a job is a room with its
// years on the wall, a project or a band a find with its links as doors out.

const BODY = 'text-sm leading-relaxed text-[var(--soul-text-soft)]'
const NAME = `text-lg uppercase text-[var(--soul-text)] ${world.lettering}`
const DOOR = `inline-flex min-h-[44px] items-center px-3 text-sm uppercase tracking-wider transition-colors motion-reduce:transition-none ${world.stone}`

// A bullet: a small lit room.
export function Marker({ color = 'bg-[var(--soul-glow)]' }: { color?: string }) {
  return <span className={`mt-1.5 block h-2 w-2.5 flex-shrink-0 ${color}`} aria-hidden="true" />
}

export function TechStack({ categories }: { categories: CVData['techStack'] }) {
  return (
    <div className="space-y-5">
      {categories.map((category) => (
        <div key={category.id}>
          <h3 className={`mb-2 text-base uppercase text-[var(--soul-lantern)] ${world.lettering}`}>{category.name}</h3>
          <ul className="flex flex-wrap gap-2" aria-label={`${category.name} technologies`}>
            {category.items.map((tech) => (
              <li key={tech} className={`px-2.5 py-1 text-sm ${world.chip}`}>
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
    <article className={`p-4 sm:p-5 ${world.card}`}>
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className={NAME}>{entry.title}</h3>
        <p className="text-sm tracking-wider text-[var(--soul-lantern)]">
          {start} - {end}
        </p>
      </div>
      <p className="mb-2 text-base text-[var(--soul-glow)]">{entry.company}</p>
      {entry.description && <p className={`mb-2 ${BODY}`}>{entry.description}</p>}
      {entry.highlights.length > 0 && (
        <ul className="mt-3 space-y-1.5" aria-label="Key accomplishments">
          {entry.highlights.map((highlight) => (
            <li key={highlight} className={`flex items-start gap-2 ${BODY}`}>
              <Marker />
              {highlight}
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

export function ProjectCard({ project, years, links }: ProjectSlot) {
  return (
    <article className={`h-full p-4 ${world.card}`} aria-labelledby={`soul-project-${project.id}`}>
      <div className="mb-1 flex items-start gap-2">
        <span className="mt-1.5">
          <RoomGlyph color={project.featured ? SOUL.lantern : SOUL.glow} />
        </span>
        <h3 id={`soul-project-${project.id}`} className={NAME}>
          {project.name}
        </h3>
      </div>
      <p className="mb-2 text-sm text-[var(--soul-glow)]">
        {project.role}
        {years && <span aria-hidden="true"> | </span>}
        {years}
      </p>
      <p className={`mb-2 ${BODY}`}>{project.tagline}</p>
      {project.impact && <p className="mb-3 border-l-2 border-[var(--soul-lantern)] pl-2 text-sm text-[var(--soul-text)]">{project.impact}</p>}
      <ul className="mb-3 flex flex-wrap gap-1.5" aria-label={`${project.name} technologies`}>
        {project.techStack.map((tech) => (
          <li key={tech} className={`px-2 py-0.5 text-sm ${world.chip}`}>
            {tech}
          </li>
        ))}
      </ul>
      {links.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {links.map(({ kind, label, linkProps }) => (
            <a key={kind} {...linkProps} className={DOOR}>
              {label}
            </a>
          ))}
        </div>
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
      aria-label={`${company.name}, ${company.tagline} (opens in a new tab)`}
      className={`block h-full p-4 transition-colors hover:bg-[var(--soul-rock)] motion-reduce:transition-none ${world.card}`}
    >
      <h3 className={NAME}>{company.name}</h3>
      <p className="mb-2 text-sm text-[var(--soul-glow)]">{company.tagline}</p>
      <p className={BODY}>{company.description}</p>
    </a>
  )
}

export function BandCard({ band, years, linkProps }: BandSlot) {
  const card = (
    <article className={`h-full p-4 ${world.card}`}>
      <h3 className={NAME}>{band.name}</h3>
      <p className="mt-1 text-sm text-[var(--soul-rose)]">
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
