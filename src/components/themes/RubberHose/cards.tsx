import { useId } from 'react'
import type { CVData, Job } from '@/lib/cv/content'
import type { ProjectSlot } from '@/components/cv/ProjectList'
import type { BandSlot } from '@/components/cv/BandList'
import type { VentureSlot } from '@/components/cv/VentureList'
import { jobCard, projectCard, ventureCard } from '@/lib/cv/cvView'
import { newTabHint } from '@/lib/cv/sectionText'
import { InkBlot } from './art'
import { HOSE } from './palette'
import world from './world.module.css'
import styles from './scenes.module.css'
import { useLabels } from '@/components/cv/CVDataProvider'
import { TagList, type TagListLook } from '@/components/cv/TagList'
import { ImpactLabel } from '@/components/cv/ImpactLabel'
import { SlashBreaks } from '@/components/cv/SlashBreaks'
import { TechList } from '@/components/cv/TechList'
import { MarkedLines, type MarkedLinesLook } from '@/components/cv/MarkedLines'

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

const CHIPS: TagListLook = { list: 'mt-3 flex flex-wrap gap-1', tag: CHIP }

export function TechBubbleCloud({ categories }: { categories: CVData['techStack'] }) {
  return (
    <TechList
      categories={categories}
      headingClassName={`mb-3 flex items-center gap-2 text-sm uppercase tracking-widest ${world.red}`}
      iconClassName="text-lg"
      itemsClassName="flex flex-wrap gap-2"
      itemClassName={`px-3 py-1 ${CHIP} transition-transform hover:scale-110 motion-reduce:transition-none`}
      renderItem={(tech) => tech}
    />
  )
}

/** Rows behind the red star the title cards mark a highlight or a detail with. */
export const STAR_LINES: MarkedLinesLook = {
  list: 'mt-2 space-y-1',
  line: `flex items-start gap-2 ${BODY}`,
  marker: (
    <span className={world.red} aria-hidden="true">
      ★
    </span>
  ),
}

// A job on a title card, the years ("2019 to 2022") on an ink tab above it.
export function ExperienceCard({ entry }: { entry: Job }) {
  const { cards, years } = useLabels()
  const job = jobCard(entry, years)

  return (
    <article className={`relative p-5 pt-7 ${world.titleCard}`}>
      <p className={`absolute -top-4 left-4 -rotate-2 px-3 py-1 text-sm ${world.chip}`}>
        {job.years}
      </p>
      <h3 className={`text-lg ${world.lettering}`}>{job.title}</h3>
      <p className={`text-sm ${world.red}`}>
        <SlashBreaks text={job.company} />
      </p>
      {job.location && <p className={`italic ${BODY}`}>{job.location}</p>}
      {job.description && <p className={`mb-2 mt-2 ${BODY}`}>{job.description}</p>}
      <MarkedLines items={job.highlights} label={cards.keyAchievements} look={STAR_LINES} />
      <TagList items={job.skills} label={cards.skillsUsed} look={CHIPS} />
    </article>
  )
}

const LINK_BUTTON = `inline-flex min-h-[44px] items-center px-4 text-sm tracking-wider transition-transform hover:scale-105 motion-reduce:transition-none ${world.button} ${world.buttonRed}`

// A project on a show poster: every field of its card, then the links.
export function VintagePoster({ project: entry, links, noLink }: ProjectSlot) {
  const labels = useLabels()
  const project = projectCard(entry, labels)
  return (
    <article className={`group relative h-full p-4 ${world.poster}`}>
      <CornerTicks />
      <InkBlot />
      <div className="mt-1 flex items-start justify-between gap-2">
        <h3 className={`min-w-0 text-base uppercase ${world.red} ${world.lettering}`}>
          <SlashBreaks text={project.name} />
        </h3>
        {project.years && <span className={`whitespace-nowrap ${BODY}`}>{project.years}</span>}
      </div>
      <p className={`mb-1 font-bold ${BODY}`}>{project.role}</p>
      <p className={`mb-2 ${BODY}`}>{project.tagline}</p>
      {project.description && <p className={`mb-2 ${BODY}`}>{project.description}</p>}
      <MarkedLines items={project.details} label={labels.cards.details} look={{ ...STAR_LINES, list: 'mb-2 space-y-1' }} />
      {project.impact && (
        <p className={`mb-2 rounded px-2 py-1 italic ${BODY} ${world.impact}`}>
          <span aria-hidden="true">→ </span>
          <ImpactLabel />
          {project.impact}
        </p>
      )}
      <TagList items={project.techStack} label={labels.cards.technologiesUsed} look={CHIPS} />
      {links.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-3">
          {links.map(({ kind, label, linkProps }) => (
            <a key={kind} {...linkProps} className={LINK_BUTTON}>
              {label}
            </a>
          ))}
        </div>
      )}
      {noLink && <p className={`mt-4 italic ${BODY}`}>{noLink}</p>}
    </article>
  )
}

// A venture as a vintage advertisement, the whole poster its link. One of his own products (featured)
// is a wider poster with an inked roundel over the name, the way a 1930s bill shouts its headliner.
// The link drops the slot's short name and is named by everything the poster shows, its services
// included, plus the new tab note a screen reader alone hears.
export function CompanyPoster({ venture, linkProps }: VentureSlot) {
  const { cards, sections, links } = useLabels()
  const company = ventureCard(venture)

  return (
    <a {...linkProps} aria-label={undefined} className={`group relative block h-full p-4 transition-transform hover:scale-[1.02] motion-reduce:transition-none ${world.poster}`}>
      <CornerTicks />
      <InkBlot />
      {company.featured && (
        <p className="relative mb-3 inline-block -rotate-3 rounded-full bg-[color:var(--hose-ink)] px-3 py-0.5 text-sm font-bold uppercase tracking-wider text-[color:var(--hose-paper)]">
          {cards.ownProduct}
        </p>
      )}
      <div className="mb-2 flex items-center gap-3">
        <span className="text-3xl" aria-hidden="true">
          {company.icon}
        </span>
        <div className="min-w-0">
          <h3 className={`font-bold ${company.featured ? 'text-xl' : 'text-base'} ${world.ink}`}>
            <SlashBreaks text={company.name} />
          </h3>
          <p className={`text-sm ${world.red}`}>{company.tagline}</p>
        </div>
      </div>
      <p className={BODY}>{company.description}</p>
      <TagList items={company.services} label={sections.services} look={CHIPS} />
      {linkProps && <span className="sr-only"> {newTabHint(links)}</span>}
    </a>
  )
}

// A band on a record label on the shop shelf: the disc in the corner spins up when the pointer lands
// on the record, his role, the years and the release.
export function BandRecord({ band, years, linkProps, release }: BandSlot) {
  // The disc's sheen, one id per record so no two cards share it.
  const sheen = useId()
  const content = (
    <article className={`group relative h-full p-4 ${world.poster} ${styles.record}`}>
      <svg viewBox="0 0 48 48" className={`absolute -right-3 -top-3 h-14 w-14 ${styles.disc}`} aria-hidden="true" focusable="false">
        <defs>
          <radialGradient id={sheen} cx="0.35" cy="0.3" r="0.8">
            <stop offset="0" stopColor={HOSE.inkSoft} />
            <stop offset="1" stopColor={HOSE.ink} />
          </radialGradient>
        </defs>
        <circle cx={24} cy={24} r={23} fill={`url(#${sheen})`} />
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
      {release && (
        <p className={`mt-2 ${BODY}`}>
          {release.label} <cite>&ldquo;{release.title}&rdquo;</cite>
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
