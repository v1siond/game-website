import type { CVData, Job } from '@/lib/cv/content'
import type { ProjectSlot } from '@/components/cv/ProjectList'
import type { BandSlot } from '@/components/cv/BandList'
import { jobYears, newTabName } from '@/components/cv/sectionText'
import { fillLabel } from '@/lib/cv/labels'
import { InkBlot } from './art'
import { HOSE } from './palette'
import world from './world.module.css'
import styles from './scenes.module.css'
import { useLabels } from '@/components/cv/CVDataProvider'
import { MASONRY_ITEM, MASONRY_LIST } from '@/components/cv/masonry'

// Rubber Hose's cards, sepia posters and title cards under one ink line: the tech bubbles, a job's title
// card, a project's show poster, a venture's advertisement and a band's record label. A poster throws an
// ink blot in its corner when the pointer lands on it.

const BODY = `text-sm ${world.ink}`
const CHIP = `rounded-full px-2 py-0.5 text-sm ${world.chip}`

// The four corner ticks of a poster's frame.
const TICK_CORNERS = ['left-1 top-1 border-l-2 border-t-2', 'right-1 top-1 border-r-2 border-t-2', 'bottom-1 left-1 border-b-2 border-l-2', 'bottom-1 right-1 border-b-2 border-r-2']

function CornerTicks() {
  return (
    <>
      {TICK_CORNERS.map((corner) => (
        <span key={corner} className={`absolute h-3 w-3 ${corner} ${world.tick}`} aria-hidden="true" />
      ))}
    </>
  )
}

function Chips({ items, label }: { items: string[]; label: string }) {
  if (items.length === 0) return null

  return (
    <ul className="mt-3 flex flex-wrap gap-1" aria-label={label}>
      {items.slice(0, 4).map((item) => (
        <li key={item} className={CHIP}>
          {item}
        </li>
      ))}
    </ul>
  )
}

export function TechBubbleCloud({ categories }: { categories: CVData['techStack'] }) {
  const { cards } = useLabels()

  return (
    <ul className={MASONRY_LIST} aria-label={cards.techByCategory}>
      {categories.map((category) => (
        <li key={category.id} className={MASONRY_ITEM}>
          <h3 className={`mb-3 flex items-center gap-2 text-sm uppercase tracking-widest ${world.red}`}>
            <span className="text-lg" aria-hidden="true">
              {category.icon}
            </span>
            {category.name}
          </h3>
          <ul className="flex flex-wrap gap-2" aria-label={fillLabel(cards.categoryTechnologies, { name: category.name })}>
            {category.items.map((tech) => (
              <li key={tech} className={`px-3 py-1 ${CHIP} transition-transform hover:scale-110 motion-reduce:transition-none`}>
                {tech}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  )
}

// A job on a title card, the dates on an ink tab above it. Dates are date only strings, read in UTC.
export function ExperienceCard({ entry }: { entry: Job }) {
  const { cards, years } = useLabels()
  const { start, end } = jobYears(entry, years.present)

  return (
    <article className={`relative p-5 pt-7 ${world.titleCard}`}>
      <p className={`absolute -top-4 left-4 -rotate-2 px-3 py-1 text-sm ${world.chip}`}>
        {start} - {end}
      </p>
      <h3 className={`text-lg ${world.lettering}`}>{entry.title}</h3>
      <p className={`mb-2 text-sm ${world.red}`}>{entry.company}</p>
      {entry.description && <p className={`mb-2 ${BODY}`}>{entry.description}</p>}
      {entry.highlights.length > 0 && (
        <ul className="space-y-1" aria-label={cards.keyAchievements}>
          {entry.highlights.map((highlight) => (
            <li key={highlight} className={`flex items-start gap-2 ${BODY}`}>
              <span className={world.red} aria-hidden="true">
                ★
              </span>
              {highlight}
            </li>
          ))}
        </ul>
      )}
      <Chips items={entry.skills} label={cards.skillsUsed} />
    </article>
  )
}

const LINK_BUTTON = `inline-flex min-h-[44px] items-center px-4 text-sm tracking-wider transition-transform hover:scale-105 motion-reduce:transition-none ${world.button} ${world.buttonRed}`

// A project on a show poster: the name, the years, his role, the result line and the links.
export function VintagePoster({ project, years, links }: ProjectSlot) {
  const labels = useLabels()
  return (
    <article className={`group relative h-full p-4 ${world.poster}`}>
      <CornerTicks />
      <InkBlot />
      <div className="mt-1 flex items-start justify-between gap-2">
        <h3 className={`text-base uppercase ${world.red} ${world.lettering}`}>{project.name}</h3>
        {years && <span className={`whitespace-nowrap ${BODY}`}>{years}</span>}
      </div>
      <p className={`mb-1 font-bold ${BODY}`}>{project.role}</p>
      <p className={`mb-2 ${BODY}`}>{project.tagline}</p>
      {project.impact && (
        <p className={`mb-2 rounded px-2 py-1 italic ${BODY} ${world.impact}`}>
          <span aria-hidden="true">→ </span>
          {project.impact}
        </p>
      )}
      <Chips items={project.techStack} label={labels.cards.technologiesUsed} />
      {links.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-3">
          {links.map(({ kind, label, linkProps }) => (
            <a key={kind} {...linkProps} className={LINK_BUTTON}>
              {label}
            </a>
          ))}
        </div>
      ) : (
        <p className={`mt-4 italic ${BODY}`}>{labels.links.noPublicLink}</p>
      )}
    </article>
  )
}

// A venture as a vintage advertisement, the whole poster its link.
export function CompanyPoster({ company }: { company: CVData['companies'][number] }) {
  const { links } = useLabels()

  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative block h-full p-4 transition-transform hover:scale-[1.02] motion-reduce:transition-none ${world.poster}`}
      aria-label={newTabName(links, `${company.name}: ${company.tagline}`)}
    >
      <CornerTicks />
      <InkBlot />
      <div className="mb-2 flex items-center gap-3">
        <span className="text-3xl" aria-hidden="true">
          {company.icon}
        </span>
        <div>
          <h3 className={`text-base font-bold ${world.ink}`}>{company.name}</h3>
          <p className={`text-sm ${world.red}`}>{company.tagline}</p>
        </div>
      </div>
      <p className={BODY}>{company.description}</p>
    </a>
  )
}

// A band on a record label on the shop shelf: the disc in the corner spins up when the pointer lands
// on the record, his role, the years and the release.
export function BandRecord({ band, years, linkProps }: BandSlot) {
  const labels = useLabels()
  const content = (
    <article className={`group relative h-full p-4 ${world.poster} ${styles.record}`} tabIndex={linkProps ? undefined : -1}>
      <svg viewBox="0 0 48 48" className={`absolute -right-3 -top-3 h-14 w-14 ${styles.disc}`} aria-hidden="true" focusable="false">
        <defs>
          <radialGradient id="hose-disc-sheen" cx="0.35" cy="0.3" r="0.8">
            <stop offset="0" stopColor={HOSE.inkSoft} />
            <stop offset="1" stopColor={HOSE.ink} />
          </radialGradient>
        </defs>
        <circle cx={24} cy={24} r={23} fill="url(#hose-disc-sheen)" />
        <path d="M10 14 Q16 8 24 7" fill="none" stroke={HOSE.shadow} strokeWidth={1.4} strokeLinecap="round" />
        <circle cx={24} cy={24} r={16} fill="none" stroke={HOSE.inkSoft} strokeWidth={1} />
        <circle cx={24} cy={24} r={8} fill={HOSE.redDark} />
        <circle cx={24} cy={24} r={1.5} fill={HOSE.paper} />
      </svg>
      <h3 className={`pr-8 text-base font-bold ${world.ink}`}>{band.name}</h3>
      <p className={`mt-1 text-sm ${world.red}`}>
        {band.role}
        {years && <span aria-hidden="true"> • </span>}
        {years && <span>{years}</span>}
      </p>
      {band.release && (
        <p className={`mt-2 ${BODY}`}>
          {labels.links.released} <cite>&ldquo;{band.release}&rdquo;</cite>
        </p>
      )}
    </article>
  )

  if (!linkProps) return content

  return (
    <a {...linkProps} className={`block h-full ${styles.record}`}>
      {content}
    </a>
  )
}
