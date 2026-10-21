'use client'

import { useMemo, useRef, useState, type AnimationEvent } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { MASONRY_ITEM, MASONRY_LIST } from '@/components/cv/masonry'
import { jobYears } from '@/components/cv/sectionText'
import { SlashBreaks } from '@/components/cv/SlashBreaks'
import { useZoneStage } from '@/hooks/useZoneStage'
import { fillLabel } from '@/lib/cv/labels'
import type { Job } from '@/lib/cv/content'
import type { Profession } from '@/lib/cv/professions'
import { Actor } from './actor'
import { cssVars } from './art'
import { hopToward, type Hop, type Motion, type Spot } from './course'
import { JOURNAL_SERIF, TRAIL } from './palette'
import { Banner, PAPER_CARD, Playfield, Region } from './region'
import type { Zone } from './world'
import side from './side.module.css'

// Work Experience as a sky level of floating ledges (research images 06, 16, 30): one ledge per job,
// oldest on the left, rising in two staggered rows to the job he holds now. On arrival he runs in and
// jumps ledge to ledge, one at a time, up to the latest job. Pointing at or focusing a job card, or
// pressing a ledge, sends him hopping across the ledges in between to that job's, and the HUD line names
// it. Under reduced motion he stands on the ledge at once.

const LEDGE_HEIGHT = 44
const ENTRY: Spot = { x: 0, lift: 0 }
const RUN_IN: Motion = { pose: 'run', frame: 'run', path: 'line', from: { x: -20, lift: 0 }, to: ENTRY, ms: 520 }
const HOP_MS = 280

/** The jobs in course order: oldest first, so the ledges climb through time. */
const byStart = (jobs: readonly Job[]): Job[] => [...jobs].sort((a, b) => a.startDate.getTime() - b.startDate.getTime())

/** A ledge's place: x in %, y its height over the ground in px, in two rows that climb to the right. */
function ledgeOf(index: number, count: number) {
  const x = count === 1 ? 40 : 6 + (index * 74) / (count - 1)
  const y = (index % 2 === 0 ? 16 : 76) + index * 10
  return { x, y }
}

/** Where he stands on a ledge, or on the ground before the first one. */
function spotOf(index: number, count: number): Spot {
  if (index < 0) return ENTRY
  const { x, y } = ledgeOf(index, count)
  return { x, lift: y + LEDGE_HEIGHT }
}

/** The leg on screen for a hop state: running in, jumping from one ledge to the next, or standing. */
function motionOf(hop: Hop, count: number): Motion {
  if (hop.at < 0) return RUN_IN
  const to = spotOf(hop.at, count)
  if (hop.from === hop.at) return { pose: `stand-${hop.at}`, frame: 'stand', path: 'still', from: to, to, ms: 0 }
  return { pose: `hop-${hop.from}-${hop.at}`, frame: 'jump', path: 'arc', from: spotOf(hop.from, count), to, ms: HOP_MS, peak: 30 }
}

function Ledge() {
  return (
    <svg viewBox="0 0 28 8" className={`block h-4 w-full ${side.ledge}`} shapeRendering="crispEdges" aria-hidden="true" focusable="false">
      <rect x={0.5} y={0.5} width={27} height={7} rx={1} fill={TRAIL.BRICK} stroke={TRAIL.HUD} strokeWidth={1} />
      <path d="M1 3.5 H27 M7 1 V3.5 M14 3.5 V7 M21 1 V3.5" stroke={TRAIL.BRICK_DARK} strokeWidth={1} />
    </svg>
  )
}

function JobCard({ job, stop, onPoint }: { job: Job; stop: number; onPoint: () => void }) {
  const { cards, years } = useLabels()
  const { start, end } = jobYears(job, years.present)
  return (
    <article
      id={`trail-job-${job.id}`}
      tabIndex={-1}
      onPointerEnter={onPoint}
      onFocus={onPoint}
      className={`relative ${PAPER_CARD} transition-transform duration-150 hover:-translate-y-1 motion-reduce:transition-none`}
    >
      <span
        className={`absolute -left-3 -top-3 flex h-9 w-9 items-center justify-center rounded-md border-[3px] border-[color:var(--ap-hud)] bg-[color:var(--ap-block)] text-base font-bold text-[color:var(--ap-ink)] ${JOURNAL_SERIF}`}
        aria-hidden="true"
      >
        {stop}
      </span>
      <div className="mb-2 flex flex-wrap items-start justify-between gap-2 pl-4">
        <div className="min-w-0">
          <h3 className={`text-lg font-bold ${JOURNAL_SERIF}`}>{job.title}</h3>
          <p className="text-sm font-semibold text-[color:var(--ap-route)]">
            <SlashBreaks text={job.company} />
          </p>
        </div>
        <span className="rounded-sm bg-[color:var(--ap-hud)] px-2 py-1 text-sm text-white">{fillLabel(years.range, { start, end })}</span>
      </div>
      {job.description && <p className="text-sm text-[color:var(--ap-ink-soft)]">{job.description}</p>}
      {job.highlights.length > 0 && (
        <ul className="mt-3 space-y-1.5" aria-label={cards.keyAchievements}>
          {job.highlights.map((highlight) => (
            <li key={highlight} className="flex items-start gap-2 text-sm">
              <span className="mt-1 h-2.5 w-2 shrink-0 rounded-sm border border-[color:var(--ap-hud)] bg-[color:var(--ap-coin)]" aria-hidden="true" />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      )}
      {job.skills.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-1.5" aria-label={cards.skillsUsed}>
          {job.skills.map((skill) => (
            <li key={skill} className="rounded-sm border border-dashed border-[color:var(--ap-ink-soft)] px-2 py-0.5 text-sm">
              {skill}
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

export function LedgeLevel({ jobs, profession }: { jobs: Job[]; profession: Profession }) {
  const { sections, trail: labels } = useLabels()
  const { ref, on, reduced } = useZoneStage<Zone>('sky')
  const route = useMemo(() => byStart(jobs), [jobs])
  const count = route.length
  const latest = count - 1
  const [target, setTarget] = useState(latest)
  const targetRef = useRef(latest)
  // He starts off the left edge; the run in ends at the entry spot (-1), then he hops up the ledges.
  const [hop, setHop] = useState<Hop>({ from: -2, at: -1 })
  const shown: Hop = reduced ? { from: target, at: target } : hop
  const settled = shown.at >= 0 && shown.from === shown.at

  const step = (event: AnimationEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return
    setHop((now) => hopToward(now, targetRef.current))
  }

  const point = (index: number) => {
    targetRef.current = index
    setTarget(index)
    setHop((now) => (now.at >= 0 && now.from === now.at ? hopToward(now, index) : now))
  }

  const show = (job: Job, index: number) => {
    point(index)
    document.getElementById(`trail-job-${job.id}`)?.focus()
  }

  const standing = settled ? route[shown.at] : null

  return (
    <Region title={sections.workExperience} hint={labels.jobHint} stageRef={ref} on={on}>
      <Banner>{standing ? fillLabel(labels.stopOf, { n: shown.at + 1, place: `${standing.title}, ${standing.company}` }) : sections.workExperience}</Banner>
      <Playfield height="h-[22rem]">
        {route.map((job, index) => {
          const { x, y } = ledgeOf(index, count)
          const { start } = jobYears(job, '')
          return (
            <button
              key={job.id}
              type="button"
              onClick={() => show(job, index)}
              aria-label={fillLabel(labels.jumpTo, { place: fillLabel(labels.stopOf, { n: index + 1, place: job.company }) })}
              aria-current={standing === job}
              className={`${side.platform} flex flex-col items-stretch rounded-sm`}
              style={cssVars({ '--x': x, '--y': y })}
            >
              <Ledge />
              <span className="mx-auto mt-1 rounded-sm bg-[color:var(--ap-hud)] px-1 text-sm font-bold leading-5 text-white">{start}</span>
            </button>
          )
        })}
        {on && <Actor motion={motionOf(shown, count)} profession={profession} onAnimationEnd={step} />}
      </Playfield>

      <ol className={MASONRY_LIST}>
        {jobs.map((job) => {
          const index = route.indexOf(job)
          return (
            <li key={job.id} className={MASONRY_ITEM}>
              <JobCard job={job} stop={index + 1} onPoint={() => point(index)} />
            </li>
          )
        })}
      </ol>
    </Region>
  )
}
