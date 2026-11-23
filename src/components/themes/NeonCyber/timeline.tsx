'use client'

import { useCallback, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react'
import type { Job } from '@/lib/cv/content'
import { useLabels } from '@/components/cv/CVDataProvider'
import { TagList } from '@/components/cv/TagList'
import { MarkedLines, type MarkedLinesLook } from '@/components/cv/MarkedLines'
import { SlashBreaks } from '@/components/cv/SlashBreaks'
import { jobCard } from '@/lib/cv/cvView'
import { DATA_CHIPS } from './hud'
import world from './world.module.css'

// Work experience as a timeline: the years run along a track and each job is a clip on it, striped, stacked
// in lanes where jobs overlap. The visitor drags the playhead, clicks the track, or moves it with the arrow
// keys (a slider, one year a step); the job under the playhead is lit in the cards below, the others dim. In
// the scene behind, he takes down a guard from cover as each job's card is read (scenes.tsx).
// The playhead writes --head on the track each frame; React state changes only when the lit jobs or
// the year under the playhead change.

// A job's highlights, each behind the data prompt.
const DATA_LINES: MarkedLinesLook = {
  list: 'mb-2 space-y-1',
  line: 'flex gap-2 text-sm text-[color:var(--neon-ice)]',
  marker: (
    <span className="text-[color:var(--neon-data)]" aria-hidden="true">
      {'>'}
    </span>
  ),
}

const yearOf = (date: Date): number => date.getUTCFullYear() + date.getUTCMonth() / 12

interface Clip {
  job: Job
  start: number
  length: number
  lane: number
}

interface Edit {
  clips: Clip[]
  lanes: number
  first: number
  last: number
}

/** The jobs as clips on a 0 to 1 timeline, each in the first lane free at its start. */
function cutEdit(jobs: Job[], now: Date): Edit {
  const spans = jobs
    .map((job) => ({ job, from: yearOf(job.startDate), to: yearOf(job.endDate ?? now) }))
    .sort((a, b) => a.from - b.from)
  const first = Math.floor(Math.min(...spans.map((span) => span.from)))
  const last = yearOf(now)
  const width = Math.max(last - first, 1)
  const laneEnds: number[] = []

  const clips = spans.map(({ job, from, to }) => {
    const free = laneEnds.findIndex((end) => end <= from)
    const lane = free === -1 ? laneEnds.length : free
    laneEnds[lane] = to
    const start = (from - first) / width
    const length = Math.max((to - from) / width, 0.01)
    return { job, start, length, lane }
  })
  return { clips, lanes: Math.max(laneEnds.length, 1), first, last }
}

// The year each key moves the playhead to, from the year under it.
const KEY_STEPS: Record<string, (year: number, edit: Edit) => number> = {
  ArrowLeft: (year) => year - 1,
  ArrowDown: (year) => year - 1,
  ArrowRight: (year) => year + 1,
  ArrowUp: (year) => year + 1,
  PageDown: (year) => year - 5,
  PageUp: (year) => year + 5,
  Home: (_, edit) => edit.first,
  End: (_, edit) => edit.last,
}

const litAt = (clips: Clip[], head: number): string[] =>
  clips.filter(({ start, length }) => head >= start && head <= start + length + 0.001).map(({ job }) => job.id)

interface HeadState {
  year: number
  lit: string[]
}

const sameHead = (a: HeadState, b: HeadState): boolean => a.year === b.year && a.lit.join() === b.lit.join()

export function JobTimeline({ jobs }: { jobs: Job[] }) {
  const labels = useLabels()
  const { cyber, years } = labels
  const edit = useMemo(() => cutEdit(jobs, new Date()), [jobs])
  const trackRef = useRef<HTMLDivElement>(null)
  const [scrubbed, setScrubbed] = useState(false)
  const [head, setHead] = useState<HeadState>(() => ({ year: Math.floor(edit.last), lit: litAt(edit.clips, 1) }))
  const span = Math.max(edit.last - edit.first, 1)

  const moveHead = useCallback(
    (to: number) => {
      const at = Math.min(1, Math.max(0, to))
      trackRef.current?.style.setProperty('--head', at.toFixed(4))
      const next = { year: Math.floor(edit.first + at * span), lit: litAt(edit.clips, at) }
      setHead((current) => (sameHead(current, next) ? current : next))
    },
    [edit, span],
  )

  const scrubTo = (event: PointerEvent<HTMLDivElement>) => {
    const box = event.currentTarget.getBoundingClientRect()
    moveHead((event.clientX - box.left) / box.width)
  }

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    setScrubbed(true)
    scrubTo(event)
  }

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) scrubTo(event)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = KEY_STEPS[event.key]
    if (!step) return
    event.preventDefault()
    setScrubbed(true)
    moveHead((step(head.year, edit) + 0.5 - edit.first) / span)
  }

  const litTitles = edit.clips.filter(({ job }) => head.lit.includes(job.id)).map(({ job }) => `${job.title}, ${job.company}`)
  const yearMarks = Array.from({ length: Math.floor(span) + 1 }, (_, i) => edit.first + i).filter((year) => (year - edit.first) % 2 === 0)

  return (
    <div className={world.jobs} data-scrubbed={scrubbed}>
      <div className={`${world.panel} mb-5 p-4 sm:p-5`}>
          <div
            ref={trackRef}
            className={`${world.track} relative cursor-ew-resize border-y border-[color-mix(in_srgb,var(--neon-chrome-red)_50%,transparent)] bg-[color:var(--neon-ink)]`}
            style={{ '--lanes': edit.lanes } as CSSProperties}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
          >
            {edit.clips.map(({ job, start, length, lane }) => (
              <span
                key={job.id}
                className={`${world.clip} absolute h-3`}
                data-lit={head.lit.includes(job.id)}
                style={{ '--start': start, '--length': length, '--lane': lane } as CSSProperties}
              aria-hidden="true"
            />
          ))}
          <div className={`pointer-events-none absolute inset-0 ${world.headRail}`}>
            <div
              role="slider"
              tabIndex={0}
              aria-label={cyber.timeline}
              aria-valuemin={edit.first}
              aria-valuemax={Math.floor(edit.last)}
              aria-valuenow={head.year}
              aria-valuetext={[String(head.year), ...litTitles].join(': ')}
              onKeyDown={onKeyDown}
              className="pointer-events-auto absolute -bottom-3 -top-3 left-0 w-11 -translate-x-1/2 cursor-ew-resize"
            >
              <span className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-[color:var(--neon-hud)]" aria-hidden="true" />
              <span className="absolute -top-1 left-1/2 block h-3 w-3 -translate-x-1/2 rotate-45 bg-[color:var(--neon-hud)]" aria-hidden="true" />
            </div>
          </div>
        </div>
        <div className="relative mt-2 h-5" aria-hidden="true">
          {yearMarks.map((year) => (
            <span
              key={year}
              className={`${world.yearMark} absolute -translate-x-1/2 text-sm text-[color:var(--neon-ash)] first:translate-x-0 last:-translate-x-full`}
              style={{ '--at': (year - edit.first) / span } as CSSProperties}
            >
              {year}
            </span>
          ))}
        </div>
    </div>

    <div data-stage-items="">
      <ul className="grid gap-4">
        {edit.clips
          .slice()
          .reverse()
          .map(({ job: entry }) => {
            const job = jobCard(entry, years)
            return (
              <li key={job.id}>
                <article
                  className={`${world.lens} border border-[color-mix(in_srgb,var(--neon-ice)_15%,transparent)] bg-[color:var(--neon-glass)] p-4`}
                  data-lit={head.lit.includes(job.id)}
                >
                    <header className="mb-2">
                      <h3 className="text-base text-[color:var(--neon-ice)]">{job.title}</h3>
                      <p className="text-sm text-[color:var(--neon-hud)]">
                        <SlashBreaks text={job.company} />
                      </p>
                      <p className="text-sm text-[color:var(--neon-ash)]">{job.years}</p>
                      {job.location && <p className="text-sm text-[color:var(--neon-ash)]">{job.location}</p>}
                    </header>
                    {job.description && <p className="mb-2 text-sm text-[color:var(--neon-ice)]">{job.description}</p>}
                    <MarkedLines items={job.highlights} label={labels.cards.keyAchievements} look={DATA_LINES} />
                    <TagList items={job.skills} label={labels.cards.skillsUsed} look={DATA_CHIPS} />
                  </article>
                </li>
              )
            })}
        </ul>
      </div>
    </div>
  )
}
