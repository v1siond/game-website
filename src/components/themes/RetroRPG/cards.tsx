'use client'

import type { ProjectSlot } from '@/components/cv/ProjectList'
import type { BandSlot } from '@/components/cv/BandList'
import type { VentureSlot } from '@/components/cv/VentureList'
import type { CVData, Job } from '@/lib/cv/content'
import { jobCard, projectCard } from '@/lib/cv/cvView'
import { newTabHint } from '@/lib/cv/sectionText'
import { SlashBreaks } from '@/components/cv/SlashBreaks'
import { TechList } from '@/components/cv/TechList'
import { MarkedLines, type MarkedLinesLook } from '@/components/cv/MarkedLines'
import { MONO, PIXEL } from './palette'
import { Command } from './actions'
import { BODY, Mark } from './panels'
import { Cursor } from './cursor'
import world from './world.module.css'
import { useLabels } from '@/components/cv/CVDataProvider'
import { TagList, type TagListLook } from '@/components/cv/TagList'
import { ImpactLabel } from '@/components/cv/ImpactLabel'
import { MASONRY_TILES } from '@/lib/cv/masonry'
import { PORTRAIT_OPEN, PORTRAIT_SHUT } from './npcs'
import { RPG } from './palette'
import { PixelArt } from './walker'

// Retro RPG's entries, each a window of the genre's menus:
// - a job is a dialogue window with the villager's portrait, its mouth moving under the pointer;
// - a project is a window the cursor arrow steps in beside under the pointer or the keyboard;
// - a band is a name in the party roster, turning yellow with the cursor arrow beside it;
// - a venture is a shop window, the tech stack is the item menu.

const TITLE = `text-sm uppercase tracking-[0.12em] text-[color:var(--rpg-text)] sm:text-base ${PIXEL}`
const META = `text-sm text-[color:var(--rpg-gold)] ${MONO}`
const TAG = `border-2 border-[color:var(--rpg-border-shade)] px-2 py-0.5 text-sm text-[color:var(--rpg-sky)] ${MONO}`

const TAGS: TagListLook = { list: 'mt-4 flex flex-wrap gap-2', tag: TAG }

/** Lines a window lists, each behind its square bullet: a job's highlights, a project's details, the About highlights. */
export const SAID_LINES: MarkedLinesLook = {
  list: 'space-y-2',
  line: `flex items-start gap-2 ${BODY}`,
  marker: <Mark />,
}

/** The villager in a job window: a portrait whose mouth moves under the pointer or the keyboard. */
function Portrait() {
  return (
    <svg viewBox="0 0 16 14" className="h-14 w-16 shrink-0 sm:h-[70px] sm:w-20" shapeRendering="crispEdges" aria-hidden="true" focusable="false">
      <PixelArt sprite={PORTRAIT_SHUT} />
      <rect x="5" y="9" width="6" height="4" fill={RPG.void} className={world.mouthOpen} />
      <PixelArt sprite={PORTRAIT_OPEN} className={world.mouthOpen} />
    </svg>
  )
}

// A job's box: every field of its card, the years in the label ("2019 to 2022").
export function ExperienceCard({ entry }: { entry: Job }) {
  const { cards, years } = useLabels()
  const job = jobCard(entry, years)

  return (
    <article className={`p-4 sm:p-5 ${world.box} ${world.talks}`}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <Portrait />
        <div className="min-w-0 flex-1">
          <h3 className={TITLE}>
            {job.title}
          </h3>
          <p className={`mt-1 ${META}`}><SlashBreaks text={job.company} /></p>
          {job.location && <p className={`mt-1 ${BODY}`}>{job.location}</p>}
        </div>
        <span className={`whitespace-nowrap text-sm tabular-nums text-[color:var(--rpg-sky)] ${MONO}`}>
          {job.years}
        </span>
      </div>
      {job.description && <p className={`mb-3 ${BODY}`}>{job.description}</p>}
      <MarkedLines
        items={job.highlights}
        label={cards.keyAchievements}
        look={SAID_LINES}
      />
      <TagList items={job.skills} label={cards.skillsUsed} look={TAGS} />
    </article>
  )
}

export function ProjectCard({ project: entry, links, noLink }: ProjectSlot) {
  const labels = useLabels()
  const project = projectCard(entry, labels)

  return (
    <article className={`relative ${world.target}`}>
      <div className={`p-4 sm:p-5 ${world.box}`}>
        <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
          <h3 className={`flex min-w-0 items-start gap-2 ${TITLE}`}>
            <Cursor className={`mt-0.5 h-3.5 w-2 shrink-0 ${world.targetCursor}`} />
            <span className="min-w-0">
              <SlashBreaks text={project.name} />
            </span>
          </h3>
          {project.years && <span className={`whitespace-nowrap text-sm text-[color:var(--rpg-sky)] ${MONO}`}>{project.years}</span>}
        </div>
        <p className={`mb-2 ${META}`}>{project.role}</p>
        <p className={`mb-3 ${BODY}`}>{project.tagline}</p>
        {project.description && <p className={`mb-3 ${BODY}`}>{project.description}</p>}
        <MarkedLines items={project.details} label={labels.cards.details} look={{ ...SAID_LINES, list: 'mb-3 space-y-2' }} />
        {project.impact && (
          <p className={`flex items-start gap-2 text-sm text-[color:var(--rpg-green)] ${MONO}`}>
            <Mark />
            <span>
              <ImpactLabel />
              {project.impact}
            </span>
          </p>
        )}
        <TagList items={project.techStack} label={labels.cards.technologiesUsed} look={TAGS} />
        {links.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {links.map(({ kind, label, linkProps }) => (
              <Command key={kind} {...linkProps}>
                {label}
              </Command>
            ))}
          </div>
        )}
        {noLink && <p className={`mt-4 ${BODY}`}>{noLink}</p>}
      </div>
    </article>
  )
}

// A venture as a dialogue box; one of his own products (featured) is a wider box ruled in gold with a
// gold pixel tag over the name. The link drops the slot's short name and is named by everything the box
// shows, its services included, plus the new tab note a screen reader alone hears.
export function CompanyCard({ venture: company, linkProps }: VentureSlot) {
  const { cards, links, sections } = useLabels()

  return (
    <a
      {...linkProps}
      className={`group block h-full p-4 sm:p-5 hover:border-[color:var(--rpg-gold)] ${company.featured ? '!border-[color:var(--rpg-gold)]' : ''} ${world.box} ${world.pick}`}
    >
      {company.featured && (
        <p className={`mb-3 inline-block bg-[color:var(--rpg-gold)] px-2 py-1 text-sm uppercase tracking-[0.12em] text-[color:var(--rpg-void)] ${PIXEL}`}>
          {cards.ownProduct}
        </p>
      )}
      <div className="mb-2 flex items-start gap-3">
        <span className="text-xl" aria-hidden="true">
          {company.icon}
        </span>
        <div className="min-w-0">
          <h3 className={`${TITLE} group-hover:text-[color:var(--rpg-gold)] group-focus-visible:text-[color:var(--rpg-gold)]`}>
            <SlashBreaks text={company.name} />
          </h3>
          <p className={`mt-1 ${META}`}>{company.tagline}</p>
        </div>
      </div>
      <p className={`mb-3 ${BODY}`}>{company.description}</p>
      <TagList items={company.services} label={sections.services} look={{ ...TAGS, list: 'flex flex-wrap gap-2' }} />
      {linkProps && <span className="sr-only"> {newTabHint(links)}</span>}
    </a>
  )
}

export function BandCard({ band, years, linkProps, release }: BandSlot) {
  const content = (
    <div className={`p-4 sm:p-5 ${world.box}`}>
      <h3 className={`flex items-start gap-2 ${TITLE} group-hover:text-[color:var(--rpg-gold)] group-focus-visible:text-[color:var(--rpg-gold)]`}>
        <Cursor className={`mt-0.5 h-3.5 w-2 shrink-0 ${world.cursor}`} />
        {band.name}
      </h3>
      <p className={`mt-2 ${META}`}>
        {band.role}
        {years && <span aria-hidden="true"> | </span>}
        {years && <span>{years}</span>}
      </p>
      {release && (
        <p className={`mt-2 ${BODY}`}>
          {release.label} <cite>&ldquo;{release.title}&rdquo;</cite>
        </p>
      )}
    </div>
  )

  if (!linkProps) return <div className={`group ${world.pick}`}>{content}</div>
  return (
    <a {...linkProps} className={`group block ${world.pick}`}>
      {content}
    </a>
  )
}

// The tech stack as the item menu: one pocket per category, each item a line the cursor arrow can sit beside.
export function ItemBag({ categories }: { categories: CVData['techStack'] }) {
  return (
    <TechList
      categories={categories}
      headingClassName={`mb-3 flex items-center gap-2 text-sm uppercase tracking-[0.15em] text-[color:var(--rpg-gold)] ${PIXEL}`}
      itemsClassName={`${MASONRY_TILES} gap-x-4 gap-y-1`}
      itemClassName={`flex items-center gap-2 text-sm text-[color:var(--rpg-text)] hover:text-[color:var(--rpg-gold)] ${MONO} ${world.pick}`}
      renderItem={(tech) => (
        <>
          <Cursor className={`h-3 w-2 shrink-0 ${world.cursor}`} />
          {tech}
        </>
      )}
    />
  )
}
