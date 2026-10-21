'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { MASONRY_ITEM, MASONRY_LIST } from '@/components/cv/masonry'
import { jobYears } from '@/components/cv/sectionText'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { usePreview } from '@/themes/PreviewContext'
import { fillLabel } from '@/lib/cv/labels'
import type { Job } from '@/lib/cv/content'
import type { Profession } from '@/lib/cv/professions'
import { cssVars, Hill, LevelTile, Pennant, TrailBed, TrailDots, Trees } from './art'
import { MapBanner, MapFrame, PAPER_CARD, Region } from './region'
import { JOURNAL_SERIF, TRAIL } from './palette'
import { buildTrail, dotsAlong, shareOf, type Point } from './trail'
import { useTrailWalker } from './walk'
import { TrailWalker } from './walker'
import map from './map.module.css'
import { SlashBreaks } from '@/components/cv/SlashBreaks'

// Work Experience as a region of the map he crosses, the overworld's long scrolling stretch: a trail
// from the signpost on the left through one tile per job, oldest first, to the castle of the job he holds
// now at the far end. On arrival the trail dots itself in, then he walks it end to end while the camera
// follows him. Pointing at or focusing a job card sends him walking to that job's tile and the banner
// names it; the tiles are buttons that walk him there and bring the card into view.
//
// The map is wider than the screen; the camera is one translate on the pan layer, written by the walker's
// follow and clamped to the map's ends. Under reduced motion the trail is drawn and he stands at the castle.

const HEIGHT = 300
const SPACING = 270
const MARGIN = 170
const START: Point = [50, 236]
const DOT_STEP = 46
const TRAIL_MS = 1500
const SPEED = 340
const CHEER_MS = 1100

const stopPoint = (index: number): Point => [MARGIN + SPACING * index, index % 2 === 0 ? 196 : 112]

/** The jobs in trail order: oldest first, so the trail reads left to right through time. */
const byStart = (jobs: readonly Job[]): Job[] => [...jobs].sort((a, b) => a.startDate.getTime() - b.startDate.getTime())

function useRegion(count: number) {
  const width = MARGIN * 2 + SPACING * Math.max(count - 1, 0)
  const trail = useMemo(() => buildTrail([START, ...Array.from({ length: count }, (_, index) => stopPoint(index))]), [count])
  const dots = useMemo(() => dotsAlong(trail, DOT_STEP), [trail])
  return { width, trail, dots }
}

/** The castle of the job he holds now: two towers, a gate and the pennant on the keep. */
function Castle({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y - 14})`}>
      <path d="M-34 0 V-44 H-22 V-38 H-14 V-44 H-2 V0 Z" fill="url(#ap-stone)" stroke={TRAIL.INK} strokeWidth={2} />
      <path d="M2 0 V-44 H14 V-38 H22 V-44 H34 V0 Z" fill="url(#ap-stone)" stroke={TRAIL.INK} strokeWidth={2} />
      <path d="M-16 0 V-62 H-8 V-56 H0 V-62 H8 V-56 H16 V-62 V0 Z" fill="url(#ap-stone)" stroke={TRAIL.INK} strokeWidth={2} />
      <path d="M-8 0 V-14 Q0 -24 8 -14 V0 Z" fill={TRAIL.BARK} stroke={TRAIL.INK} strokeWidth={1.6} />
      <rect x={-27} y={-32} width={5} height={8} fill={TRAIL.INK} />
      <rect x={22} y={-32} width={5} height={8} fill={TRAIL.INK} />
      <rect x={-2.5} y={-46} width={5} height={9} fill={TRAIL.LANTERN} stroke={TRAIL.INK} strokeWidth={1} />
      <Pennant x={0} y={-62} />
    </g>
  )
}

/** The signpost at the start of the region. */
function Signpost({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-2} y={-40} width={4} height={40} fill="url(#ap-wood)" stroke={TRAIL.INK} strokeWidth={1.2} />
      <path d="M-4 -38 H22 L28 -32 L22 -26 H-4 Z" fill="url(#ap-wood)" stroke={TRAIL.INK} strokeWidth={1.4} />
    </g>
  )
}

function RegionArt({ width, region, current }: { width: number; region: ReturnType<typeof useRegion>; current: boolean }) {
  const stops = region.trail.stops.length - 1
  return (
    <svg viewBox={`0 0 ${width} ${HEIGHT}`} className="block h-full w-full" aria-hidden="true" focusable="false">
      <rect width={width} height={HEIGHT} fill="url(#ap-paper)" />
      {/* the plateau across the region and its cliff edge, the sea along the bottom */}
      <rect y={HEIGHT - 44} width={width} height={44} fill="url(#ap-sea)" />
      <path d={`M0 ${HEIGHT - 40} H${width} V${HEIGHT - 28} H0 Z`} fill="url(#ap-cliff)" stroke={TRAIL.INK} strokeWidth={2} />
      <path d={`M0 30 Q${width / 4} 12 ${width / 2} 28 T${width} 24 V${HEIGHT - 40} H0 Z`} fill="url(#ap-meadow)" stroke={TRAIL.INK} strokeWidth={2.4} />
      <path d={`M0 30 Q${width / 4} 12 ${width / 2} 28 T${width} 24 V${HEIGHT - 40} H0 Z`} fill="url(#ap-hatch)" />

      {Array.from({ length: stops }, (_, index) => {
        const [x] = stopPoint(index)
        const hillY = index % 2 === 0 ? 92 : 262
        return (
          <g key={x}>
            {index < 3 && <Hill x={x + SPACING / 2} y={hillY} w={60} h={40} i={index} />}
            <Trees x={x + SPACING / 2 - 60} y={index % 2 === 0 ? 250 : 70} s={0.8} />
          </g>
        )
      })}

      <Signpost x={START[0] - 10} y={START[1] + 6} />
      <TrailBed trail={region.trail} width={12} />
      <TrailDots dots={region.dots} r={3.6} />
      {region.trail.stops.slice(1).map((_, index) => {
        const [x, y] = stopPoint(index)
        const last = index === stops - 1
        return (
          <g key={x}>
            {last && current && <Castle x={x} y={y} />}
            <LevelTile x={x} y={y} r={last && current ? 11 : 14} kind="exit" className={map.tileLit} />
          </g>
        )
      })}
    </svg>
  )
}

/** The camera: keeps him in the middle of the window over the map, never past either end. */
function useCamera(width: number) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const panRef = useRef<HTMLDivElement>(null)

  const follow = useCallback(
    ([x]: Point) => {
      const viewport = viewportRef.current
      const pan = panRef.current
      if (!viewport || !pan) return
      const shown = viewport.clientWidth
      const full = pan.clientWidth
      const offset = full <= shown ? (shown - full) / 2 : Math.min(0, Math.max(shown - full, shown / 2 - (x / width) * full))
      pan.style.transform = `translate3d(${offset.toFixed(1)}px, 0, 0)`
    },
    [width],
  )

  return { viewportRef, panRef, follow }
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
        className={`absolute -left-3 -top-3 flex h-9 w-9 items-center justify-center rounded-full border-2 border-[color:var(--ap-ink)] bg-[color:var(--ap-gold)] text-base font-bold text-[color:var(--ap-ink)] ${JOURNAL_SERIF}`}
        aria-hidden="true"
      >
        {stop}
      </span>
      <div className="mb-2 flex flex-wrap items-start justify-between gap-2 pl-4">
        <div className="min-w-0">
          <h3 className={`text-lg font-bold ${JOURNAL_SERIF}`}>{job.title}</h3>
          <p className="text-sm font-semibold text-[color:var(--ap-route)]"><SlashBreaks text={job.company} /></p>
        </div>
        <span className="rounded-sm bg-[color:var(--ap-ink)] px-2 py-1 text-sm text-[color:var(--ap-parchment)]">{fillLabel(years.range, { start, end })}</span>
      </div>
      {job.description && <p className="text-sm text-[color:var(--ap-ink-soft)]">{job.description}</p>}
      {job.highlights.length > 0 && (
        <ul className="mt-3 space-y-1.5" aria-label={cards.keyAchievements}>
          {job.highlights.map((highlight) => (
            <li key={highlight} className="flex items-start gap-2 text-sm">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full border border-[color:var(--ap-ink)] bg-[color:var(--ap-route)]" aria-hidden="true" />
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

export function JourneyRegion({ jobs, profession }: { jobs: Job[]; profession: Profession }) {
  const { sections, trail: labels } = useLabels()
  const route = useMemo(() => byStart(jobs), [jobs])
  const region = useRegion(route.length)
  const camera = useCamera(region.width)
  const walker = useTrailWalker({ width: region.width, height: HEIGHT, speed: SPEED, follow: camera.follow })
  const { place, walk } = walker
  const { ref, triggered } = useSectionTrigger({ threshold: 0.25 })
  const reduced = useReducedMotion()
  const preview = usePreview()
  const [trailed, setTrailed] = useState(false)
  const [standing, setStanding] = useState<number | null>(null)
  const at = useRef(0)
  const walking = useRef(false)
  const pending = useRef<number | null>(null)
  const ready = useRef(false)
  const current = route.at(-1)?.current ?? false
  const [cheer, setCheer] = useState(false)
  const cheerTimer = useRef(0)

  // The victory pose on each tile he reaches.
  const cheerFor = useCallback((ms: number) => {
    setCheer(true)
    window.clearTimeout(cheerTimer.current)
    cheerTimer.current = window.setTimeout(() => setCheer(false), ms)
  }, [])

  const goTo = useCallback(
    function go(index: number) {
      if (walking.current) {
        pending.current = index
        return
      }
      const target = region.trail.stops[index + 1]
      walking.current = true
      walk([{ trail: region.trail, from: at.current, to: target }], () => {
        walking.current = false
        at.current = target
        setStanding(index)
        cheerFor(CHEER_MS)
        const next = pending.current
        pending.current = null
        if (next !== null && next !== index) go(next)
      })
    },
    [region.trail, walk, cheerFor],
  )

  // He waits on the signpost; the camera starts there.
  useEffect(() => {
    place(START)
  }, [place])

  useEffect(() => () => window.clearTimeout(cheerTimer.current), [])

  useEffect(() => {
    if (!triggered && !reduced && !preview) return
    setTrailed(true)
    const timer = window.setTimeout(
      () => {
        ready.current = true
        goTo(route.length - 1)
      },
      reduced || preview ? 0 : TRAIL_MS,
    )
    return () => window.clearTimeout(timer)
  }, [triggered, reduced, preview, goTo, route.length])

  const point = (index: number) => {
    if (ready.current) goTo(index)
  }

  const show = (job: Job, index: number) => {
    point(index)
    document.getElementById(`trail-job-${job.id}`)?.focus({ preventScroll: false })
  }

  const standingJob = standing === null ? null : route[standing]

  return (
    <Region title={sections.workExperience} hint={labels.jobHint}>
      <div ref={ref} data-trailed={trailed} style={cssVars({ '--trail-ms': `${TRAIL_MS}ms` })}>
        <MapFrame>
          <MapBanner>
            {standingJob ? fillLabel(labels.stopOf, { n: (standing ?? 0) + 1, place: `${standingJob.title}, ${standingJob.company}` }) : sections.workExperience}
          </MapBanner>
          <div ref={camera.viewportRef} className="relative h-64 overflow-hidden sm:h-72">
            <div
              ref={camera.panRef}
              className="absolute inset-y-0 left-0 aspect-[var(--ratio)] transition-transform duration-75 motion-reduce:transition-none"
              style={cssVars({ '--ratio': `${region.width} / ${HEIGHT}` })}
            >
              <RegionArt width={region.width} region={region} current={current} />
              {route.map((job, index) => {
                const [x, y] = shareOf(stopPoint(index), region.width, HEIGHT)
                const { start } = jobYears(job, '')
                return (
                  <button
                    key={job.id}
                    type="button"
                    onClick={() => show(job, index)}
                    aria-label={fillLabel(labels.walkTo, { place: fillLabel(labels.stopOf, { n: index + 1, place: job.company }) })}
                    className={`absolute left-[var(--x)] top-[var(--y)] flex h-14 w-14 flex-col items-center justify-end rounded-full ${map.landmark}`}
                    style={cssVars({ '--x': `${x}%`, '--y': `${y}%` })}
                  >
                    <span className={`pointer-events-none absolute inset-1 rounded-full border-4 border-dashed border-[color:var(--ap-gold)] ${map.ring}`} aria-hidden="true" />
                    <span className="translate-y-6 rounded-sm border-2 border-[color:var(--ap-ink)] bg-[color:var(--ap-page)] px-1.5 text-sm font-bold text-[color:var(--ap-ink)]">
                      {start}
                    </span>
                  </button>
                )
              })}
              <div ref={walker.markerRef} className={`pointer-events-none absolute inset-0 ${map.marker}`} data-cheer={cheer} aria-hidden="true">
                <div className="absolute left-0 top-0 h-[22%] -translate-x-1/2 -translate-y-[92%]">
                  <div className={`h-full ${map.figure}`}>
                    <TrailWalker profession={profession} className="h-full w-auto" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </MapFrame>

        <ol className={`mt-10 ${MASONRY_LIST}`}>
          {jobs.map((job) => {
            const index = route.indexOf(job)
            return (
              <li key={job.id} className={MASONRY_ITEM}>
                <JobCard job={job} stop={index + 1} onPoint={() => point(index)} />
              </li>
            )
          })}
        </ol>
      </div>
    </Region>
  )
}
