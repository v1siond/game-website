'use client'

import { useRef, type MouseEvent } from 'react'
import { prefersReducedMotion } from '@/hooks/useReducedMotion'
import { cssVars } from '@/lib/cssVars'
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
import { BODY, Mark, SHOW_AFTER, Typed } from './panels'
import { usePlay } from './play'
import { Soul } from './soul'
import world from './world.module.css'
import { useLabels } from '@/components/cv/CVDataProvider'
import { TagList, type TagListLook } from '@/components/cv/TagList'
import { ImpactLabel } from '@/components/cv/ImpactLabel'
import { MASONRY_TILES } from '@/lib/cv/masonry'
import { ITEM, SentryPortrait, TALKS } from './rooms'

// Retro RPG's entries, each a box of the encounter screen:
// - a job is a dialogue: the box opens (a line, then full height), the title types, the rest of the
//   text appears line by line, the way the game's dialogue box speaks;
// - a project is the target of an attack: under the pointer or the keyboard its attack meter rises with
//   the line crossing it; a click strikes, the red slash cuts across and the box shakes; a strike with
//   the line near the centre mark is critical (a gold slash, a harder shake, its impact line jumps);
// - a band is a name in the spare menu, turning yellow under the heart;
// - a venture is a shop box, the tech stack is the item menu.

const TITLE = `text-sm uppercase tracking-[0.12em] text-[color:var(--rpg-text)] sm:text-base ${PIXEL}`
const META = `text-sm text-[color:var(--rpg-gold)] ${MONO}`
const TAG = `border-2 border-[color:var(--rpg-border-shade)] px-2 py-0.5 text-sm text-[color:var(--rpg-sky)] ${MONO}`

const TAGS: TagListLook = { list: 'mt-4 flex flex-wrap gap-2', tag: TAG }

/** Lines the box speaks, each behind the asterisk: a job's highlights, a project's details, the About highlights. */
export const SAID_LINES: MarkedLinesLook = {
  list: 'space-y-2',
  line: `flex items-start gap-2 ${BODY}`,
  marker: <Mark />,
}

// Each achievement line shows a beat after the one before it, the way the box speaks line by line.
const LINE_START_MS = 1400
const LINE_GAP_MS = 300
const lineDelay = (index: number) => cssVars({ '--show-delay': `${LINE_START_MS + index * LINE_GAP_MS}ms` })

// A job's box: every field of its card, the years in the label ("2019 to 2022").
export function ExperienceCard({ entry }: { entry: Job }) {
  const { cards, years } = useLabels()
  const job = jobCard(entry, years)
  const { ref, play } = usePlay(LINE_START_MS + job.highlights.length * LINE_GAP_MS + 600)

  return (
    // The play scope wraps the box: the box is scaled to a dot while idle, and a dot in the middle of a tall
    // job on a phone sits below the screen, so the observer would not see the job until long after it shows.
    <div ref={ref} data-play={play}>
      <article className={`p-4 sm:p-5 ${world.box} ${world.opens} ${TALKS}`}>
        <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
          <SentryPortrait />
          <div className="min-w-0 flex-1">
            <h3 className={TITLE}>
              <Typed delay="open">{job.title}</Typed>
            </h3>
            <p className={`mt-1 ${META} ${SHOW_AFTER.second}`}><SlashBreaks text={job.company} /></p>
            {job.location && <p className={`mt-1 ${BODY} ${SHOW_AFTER.second}`}>{job.location}</p>}
          </div>
          <span className={`whitespace-nowrap text-sm tabular-nums text-[color:var(--rpg-sky)] ${MONO} ${SHOW_AFTER.second}`}>
            {job.years}
          </span>
        </div>
        {job.description && <p className={`mb-3 ${BODY} ${SHOW_AFTER.third}`}>{job.description}</p>}
        <MarkedLines
          items={job.highlights}
          label={cards.keyAchievements}
          look={SAID_LINES}
          lineProps={(index) => ({ className: world.after, style: lineDelay(index) })}
        />
        <div className={SHOW_AFTER.last}>
          <TagList items={job.skills} label={cards.skillsUsed} look={TAGS} />
        </div>
      </article>
    </div>
  )
}

// The attack: the meter's line crosses in METER_MS (world.module.css .meterLine runs the same length), and
// a strike within CRITICAL of the centre mark is critical. The strike plays through the Web Animations
// API, so each click replays it without a re-render.
const METER_MS = 1200
const CRITICAL = 0.1

const SHAKE: Keyframe[] = [{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(5px)' }, { transform: 'translateX(-3px)' }, { transform: 'translateX(0)' }]
const HARD_SHAKE: Keyframe[] = [{ transform: 'translate(0, 0)' }, { transform: 'translate(-10px, 3px)' }, { transform: 'translate(9px, -3px)' }, { transform: 'translate(-6px, 2px)' }, { transform: 'translate(0, 0)' }]
const CUT: Keyframe[] = [
  { transform: 'rotate(-12deg) scaleX(0)', opacity: 1 },
  { transform: 'rotate(-12deg) scaleX(1)', opacity: 1, offset: 0.4 },
  { transform: 'rotate(-12deg) scaleX(1)', opacity: 0 },
]
const JUMP: Keyframe[] = [{ transform: 'translateY(0)' }, { transform: 'translateY(-8px)' }, { transform: 'translateY(0)' }]

const stepped = (duration: number, frames: number, delay = 0): KeyframeAnimationOptions => ({ duration, delay, easing: `steps(${frames}, end)` })

export function ProjectCard({ project: entry, links, noLink }: ProjectSlot) {
  const labels = useLabels()
  const project = projectCard(entry, labels)
  const aimedAt = useRef(0)
  const body = useRef<HTMLDivElement>(null)
  const slash = useRef<HTMLSpanElement>(null)
  const impact = useRef<HTMLParagraphElement>(null)

  const aim = () => {
    aimedAt.current = performance.now()
  }

  const strike = (event: MouseEvent<HTMLElement>) => {
    if ((event.target as HTMLElement).closest('a') || prefersReducedMotion()) return
    const line = ((performance.now() - aimedAt.current) % METER_MS) / METER_MS
    const critical = Math.abs(line - 0.5) < CRITICAL
    slash.current?.setAttribute('data-critical', String(critical))
    slash.current?.animate(CUT, stepped(360, 4))
    body.current?.animate(critical ? HARD_SHAKE : SHAKE, stepped(critical ? 320 : 240, 4, 120))
    if (critical) impact.current?.animate(JUMP, stepped(300, 3, 200))
  }

  return (
    <article className={`relative overflow-hidden ${world.target}`} onPointerEnter={aim} onClick={strike}>
      <div ref={body} className={`p-4 sm:p-5 ${world.box}`}>
        <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
          <h3 className={`flex min-w-0 items-start gap-2 ${TITLE}`}>
            <Soul className={`mt-0.5 h-3.5 w-4 shrink-0 ${world.targetCursor}`} />
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
          <p ref={impact} className={`flex items-start gap-2 text-sm text-[color:var(--rpg-green)] ${MONO}`}>
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
        <div className={`relative mt-4 h-6 border-2 border-[color:var(--rpg-text)] ${world.meter}`} aria-hidden="true">
          <span className="absolute inset-y-0 left-1/2 w-1 -translate-x-1/2 bg-[color:var(--rpg-gold)]" />
          <span className={`absolute inset-0 ${world.meterLine}`}>
            <span className="absolute inset-y-0 left-0 w-1.5 bg-[color:var(--rpg-text)]" />
          </span>
        </div>
      </div>
      <span ref={slash} className={`pointer-events-none absolute left-[-5%] top-1/2 h-1 w-[110%] ${world.slash}`} aria-hidden="true" />
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
      aria-label={undefined}
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
        <Soul className={`mt-0.5 h-3.5 w-4 shrink-0 ${world.cursor}`} />
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

// The tech stack as the item menu: one pocket per category, each item a line the heart can sit on.
export function ItemBag({ categories }: { categories: CVData['techStack'] }) {
  return (
    <TechList
      categories={categories}
      headingClassName={`mb-3 flex items-center gap-2 text-sm uppercase tracking-[0.15em] text-[color:var(--rpg-gold)] ${PIXEL}`}
      itemsClassName={`${MASONRY_TILES} gap-x-4 gap-y-1`}
      itemClassName={`flex items-center gap-2 text-sm text-[color:var(--rpg-text)] hover:text-[color:var(--rpg-gold)] ${MONO} ${world.pick} ${ITEM}`}
      renderItem={(tech) => (
        <>
          <Soul className={`h-3 w-3.5 shrink-0 ${world.cursor}`} />
          {tech}
        </>
      )}
    />
  )
}
