'use client'

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react'
import type { Job } from '@/lib/cv/content'
import type { Labels } from '@/lib/cv/labels'
import { fillLabel } from '@/lib/cv/labels'
import { useLabels } from '@/components/cv/CVDataProvider'
import { SlashBreaks } from '@/components/cv/SlashBreaks'
import { jobYears } from '@/components/cv/sectionText'
import { MASONRY_ITEM, MASONRY_LIST } from '@/components/cv/masonry'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { DataChip, HudPanel } from './hud'
import { MercSprite } from './merc'
import { Scannable } from './scanner'
import world from './world.module.css'

// Work experience as a braindance edit: the years run along a timeline and each job is a clip on it,
// striped the way the editor marks a clue, stacked in lanes where jobs overlap. The playhead runs the
// timeline once when the section comes into view and lights each job as it passes; then the visitor
// drags it, clicks the track, or moves it with the arrow keys (a slider, one year a step). The job under
// the playhead is lit in the masonry below, the others dim. The layer switch repaints the edit: visual
// (data cyan), audio (the sources in green), thermal (each job from cold to hot by how recent it is).
// The playhead writes --head on the track each frame; React state changes only when the lit jobs or
// the year under the playhead change.

type Layer = 'visual' | 'audio' | 'thermal'

const LAYERS: Layer[] = ['visual', 'audio', 'thermal']

const LAYER_LABEL: Record<Layer, (cyber: Labels['cyber']) => string> = {
  visual: (cyber) => cyber.layerVisual,
  audio: (cyber) => cyber.layerAudio,
  thermal: (cyber) => cyber.layerThermal,
}

const PLAY_TIME = 4200

const yearOf = (date: Date): number => date.getUTCFullYear() + date.getUTCMonth() / 12

interface Clip {
  job: Job
  start: number
  length: number
  lane: number
  heat: number
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
    return { job, start, length, lane, heat: start + length / 2 }
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

export function Braindance({ jobs }: { jobs: Job[] }) {
  const labels = useLabels()
  const { cyber, sections, years } = labels
  const reducedMotion = useReducedMotion()
  const { ref: sectionRef, triggered } = useSectionTrigger()
  const edit = useMemo(() => cutEdit(jobs, new Date()), [jobs])
  const trackRef = useRef<HTMLDivElement>(null)
  const frame = useRef(0)
  const [layer, setLayer] = useState<Layer>('visual')
  const [scrubbed, setScrubbed] = useState(false)
  const [riding, setRiding] = useState(false)
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

  const play = useCallback(() => {
    window.cancelAnimationFrame(frame.current)
    setScrubbed(true)
    setRiding(true)
    const began = performance.now()
    const step = (now: number) => {
      const progress = Math.min(1, (now - began) / PLAY_TIME)
      moveHead(progress)
      if (progress < 1) frame.current = window.requestAnimationFrame(step)
      else setRiding(false)
    }
    frame.current = window.requestAnimationFrame(step)
  }, [moveHead])

  useEffect(() => {
    if (!triggered || reducedMotion) return
    play()
    return () => window.cancelAnimationFrame(frame.current)
  }, [triggered, reducedMotion, play])

  const scrubTo = (event: PointerEvent<HTMLDivElement>) => {
    const box = event.currentTarget.getBoundingClientRect()
    moveHead((event.clientX - box.left) / box.width)
  }

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    window.cancelAnimationFrame(frame.current)
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
    window.cancelAnimationFrame(frame.current)
    setScrubbed(true)
    moveHead((step(head.year, edit) + 0.5 - edit.first) / span)
  }

  const litTitles = edit.clips.filter(({ job }) => head.lit.includes(job.id)).map(({ job }) => `${job.title}, ${job.company}`)
  const yearMarks = Array.from({ length: Math.floor(span) + 1 }, (_, i) => edit.first + i).filter((year) => (year - edit.first) % 2 === 0)

  const layerSwitch = (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex" role="group" aria-label={cyber.layer}>
        {LAYERS.map((id) => (
          <button
            key={id}
            type="button"
            aria-pressed={layer === id}
            onClick={() => setLayer(id)}
            className={`min-h-[44px] border border-[color-mix(in_srgb,var(--neon-data)_50%,transparent)] px-3 text-sm uppercase tracking-wider ${
              layer === id ? 'bg-[color:var(--neon-data)] text-[color:var(--neon-ink)]' : 'text-[color:var(--neon-data)] hover:bg-[color-mix(in_srgb,var(--neon-data)_12%,transparent)]'
            }`}
          >
            {LAYER_LABEL[id](cyber)}
          </button>
        ))}
      </div>
      {!reducedMotion && (
        <button
          type="button"
          onClick={play}
          className={`${world.cut} min-h-[44px] border border-[color:var(--neon-hud)] px-3 text-sm uppercase tracking-wider text-[color:var(--neon-hud)] hover:bg-[color-mix(in_srgb,var(--neon-hud)_12%,transparent)]`}
        >
          {cyber.replay}
        </button>
      )}
    </div>
  )

  return (
    <div ref={sectionRef} className={world.bd} data-layer={layer} data-scrubbed={scrubbed}>
      <HudPanel title={sections.workExperience} tools={layerSwitch}>
        <div className="mb-8 pt-16">
          <div
            ref={trackRef}
            className={`${world.track} relative cursor-ew-resize border-y border-[color-mix(in_srgb,var(--neon-chrome-red)_50%,transparent)] bg-[color:var(--neon-ink)]`}
            style={{ '--lanes': edit.lanes } as CSSProperties}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
          >
            {edit.clips.map(({ job, start, length, lane, heat }) => (
              <span
                key={job.id}
                className={`${world.clip} absolute h-3`}
                data-lit={head.lit.includes(job.id)}
                style={{ '--start': start, '--length': length, '--heat': heat, '--lane': lane } as CSSProperties}
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
                className="pointer-events-auto absolute -bottom-3 -top-3 left-0 w-6 -translate-x-1/2 cursor-ew-resize"
              >
                <span className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-[color:var(--neon-hud)]" aria-hidden="true" />
                <span className="absolute -top-1 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-[color:var(--neon-hud)]" aria-hidden="true" />
                {/* him riding the playhead through the years: walking while it plays, at rest when it stops */}
                <span className="absolute bottom-full left-1/2 mb-2 block w-10 -translate-x-1/2" aria-hidden="true">
                  <MercSprite profession="engineer" motion={reducedMotion ? 'still' : riding ? 'walk' : 'idle'} className="h-auto w-full" />
                </span>
              </div>
            </div>
          </div>
          <div className="relative mt-2 h-5" aria-hidden="true">
            {yearMarks.map((year) => (
              <span
                key={year}
                className={`${world.yearMark} absolute -translate-x-1/2 text-sm text-[color:var(--neon-ash)] first:translate-x-0`}
                style={{ '--at': (year - edit.first) / span } as CSSProperties}
              >
                {year}
              </span>
            ))}
          </div>
        </div>

        <ul className={MASONRY_LIST}>
          {edit.clips
            .slice()
            .reverse()
            .map(({ job, heat }) => {
              const { start, end } = jobYears(job, years.present)
              const period = fillLabel(years.range, { start, end })
              return (
                <li key={job.id} className={MASONRY_ITEM}>
                  <Scannable kind="job" title={sections.workExperience} fact={period}>
                    <article
                      className={`${world.lens} border border-[color-mix(in_srgb,var(--neon-ice)_15%,transparent)] bg-[color:var(--neon-glass)] p-4`}
                      data-lit={head.lit.includes(job.id)}
                      style={{ '--heat': heat } as CSSProperties}
                    >
                      <header className="mb-2">
                        <h3 className="text-base text-[color:var(--neon-ice)]">{job.title}</h3>
                        <p className="text-sm text-[color:var(--neon-hud)]">
                          <SlashBreaks text={job.company} />
                        </p>
                        <p className="text-sm text-[color:var(--neon-ash)]">{period}</p>
                      </header>
                      {job.description && <p className="mb-2 text-sm text-[color:var(--neon-ice)]">{job.description}</p>}
                      {job.highlights.length > 0 && (
                        <ul className="mb-2 space-y-1" aria-label={labels.cards.keyAchievements}>
                          {job.highlights.map((highlight) => (
                            <li key={highlight} className="flex gap-2 text-sm text-[color:var(--neon-ice)]">
                              <span className={`${world.mark} text-[color:var(--neon-data)]`} aria-hidden="true">
                                {'>'}
                              </span>
                              {highlight}
                            </li>
                          ))}
                        </ul>
                      )}
                      {job.skills.length > 0 && (
                        <ul className="flex flex-wrap gap-1" aria-label={labels.cards.skillsUsed}>
                          {job.skills.slice(0, 6).map((skill) => (
                            <DataChip key={skill}>{skill}</DataChip>
                          ))}
                        </ul>
                      )}
                    </article>
                  </Scannable>
                </li>
              )
            })}
        </ul>
      </HudPanel>
    </div>
  )
}
