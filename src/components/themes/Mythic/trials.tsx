'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { jobYears } from '@/components/cv/sectionText'
import { MASONRY_ITEM } from '@/components/cv/masonry'
import { SlashBreaks } from '@/components/cv/SlashBreaks'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { usePoseSequence } from '@/hooks/usePoseSequence'
import { useZoneStageContext } from '@/hooks/useZoneStage'
import { fillLabel } from '@/lib/cv/labels'
import type { Job } from '@/lib/cv/content'
import { SpartanSprite, type SpriteMotion } from './sprite'
import { FOE, type FoeName } from './foes'
import { MOVES } from './rig'
import { useTrack } from './track'
import { Laurel } from './stage'
import { MYTH } from './palette'
import u from './underworld.module.css'

// Work Experience as a fight on a ship's deck in a storm, the serpent rising out of the sea behind. The
// arena stays in view beside the jobs (above them on a phone). Each job that scrolls into view sends
// him a foe in turn (the legionnaire, the harpy, the gorgon): it drops onto the deck, he grabs it, lifts
// it over his head and slams it down, and its red orbs burst out and fly into the orb medallion; the
// counter under it fills one cell per role and says its count in words, and the job's own seal lights.
// The fights queue one after another, so jobs that scroll in together are fought in order.

const SCENE = { width: 320, height: 220, floor: 199 }
const HIM = { x: 10, y: 20, height: 190 }
// The foe stands on the deck at x 190 in its 60 by 80 box, scaled a little up.
const FOE_AT = { x: 190, y: 112, scale: 1.08 }
const FOE_CENTRE = '223px 155px'
const MEDALLION = { x: 26, y: 22 }
const SLAM = { x: 150, y: 190 }

const FOE_ORDER: readonly FoeName[] = ['legionnaire', 'harpy', 'gorgon']

const FIGHT_MS = MOVES.finish.ms
const FIGHT_GAP_MS = FIGHT_MS + 500

// The foe keeps to his hands through the finisher (the hand positions of rig.ts's keys, in scene units):
// it lands, is grabbed at 0.18, held upside down overhead at 0.4, slammed in front of him at 0.58, then
// breaks up into its orbs.
const at = (offset: number, transform: string, opacity = 1): Keyframe => ({ offset, opacity, transform, transformOrigin: FOE_CENTRE })
const FOE_TRACK: Keyframe[] = [
  at(0, 'translate(60px, -40px) rotate(0deg)', 0),
  at(0.1, 'translate(0px, 0px) rotate(0deg)'),
  at(0.18, 'translate(-55px, -29px) rotate(-10deg)'),
  at(0.4, 'translate(-146px, -132px) rotate(180deg)'),
  at(0.58, 'translate(-70px, 36px) rotate(270deg)'),
  at(0.66, 'translate(-70px, 36px) rotate(270deg)'),
  at(0.74, 'translate(-70px, 32px) rotate(270deg) scale(0.6)', 0),
  at(1, 'translate(-70px, 32px) rotate(270deg) scale(0.6)', 0),
]

// Six orbs burst from where the foe hit the deck, scatter, then fly into the medallion.
const ORB_SCATTER = [
  [-24, -30],
  [-6, -44],
  [16, -36],
  [30, -14],
  [-34, -8],
  [6, -20],
] as const
const orbTrack = ([dx, dy]: readonly [number, number], index: number): Keyframe[] => {
  const home = `translate(${MEDALLION.x - SLAM.x}px, ${MEDALLION.y - SLAM.y}px) scale(0.5)`
  return [
    { offset: 0, opacity: 0, transform: 'translate(0px, 0px)' },
    { offset: 0.6, opacity: 0, transform: 'translate(0px, 0px)' },
    { offset: 0.62, opacity: 1, transform: 'translate(0px, 0px)' },
    { offset: 0.7 + index * 0.01, opacity: 1, transform: `translate(${dx}px, ${dy}px)`, easing: 'ease-in' },
    { offset: 0.9, opacity: 1, transform: home },
    { offset: 0.93, opacity: 0, transform: home },
    { offset: 1, opacity: 0, transform: home },
  ]
}
const ORB_TRACKS = ORB_SCATTER.map(orbTrack)
const MEDALLION_TRACK: Keyframe[] = [0, 0.88, 0.93, 1].map((offset) => ({
  offset,
  transform: `scale(${offset === 0.93 ? 1.35 : 1})`,
  transformOrigin: `${MEDALLION.x}px ${MEDALLION.y}px`,
}))

function Orb({ index, take }: { index: number; take: number }) {
  const ref = useRef<SVGGElement>(null)
  useTrack(ref, ORB_TRACKS[index], FIGHT_MS, take)
  return (
    <g ref={ref} opacity={0} className={u.sceneProp}>
      <circle cx={SLAM.x} cy={SLAM.y} r={4.4} fill={MYTH.orb} stroke={MYTH.inkLine} strokeWidth={1} />
      <circle cx={SLAM.x - 1} cy={SLAM.y - 1} r={1.8} fill={MYTH.orbCore} />
    </g>
  )
}

/** The storm behind the deck: the sky, the rain, the serpent's neck out of the sea, the waves, the planks. */
function Storm() {
  return (
    <>
      <defs>
        <linearGradient id="mythStormSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={MYTH.stormHigh} />
          <stop offset="1" stopColor={MYTH.storm} />
        </linearGradient>
      </defs>
      <rect width={SCENE.width} height={SCENE.height} fill="url(#mythStormSky)" />
      <g className={u.serpent}>
        <path d="M268 160 Q250 100 276 60 Q292 38 312 44 Q318 56 304 60 Q290 64 288 84 Q284 120 300 160 Z" fill={MYTH.hydraShade} stroke={MYTH.inkLine} strokeWidth={2} />
        <path d="M276 60 Q262 54 256 62 L270 66 Z" fill={MYTH.hydraShade} stroke={MYTH.inkLine} strokeWidth={1.6} />
        <circle cx={286} cy={52} r={2.4} fill={MYTH.hydraEye} />
      </g>
      <path d="M0 150 Q40 140 80 152 T160 150 T240 152 T320 148 L320 176 L0 176 Z" fill={MYTH.aegean} opacity={0.8} />
      <g className={u.rain} stroke={MYTH.rain} strokeWidth={1} opacity={0.35}>
        {[20, 70, 120, 170, 220, 270, 310].map((x) => (
          <path key={x} d={`M${x} 0 l-14 40 M${x - 30} 70 l-14 40 M${x + 10} 120 l-14 40`} />
        ))}
      </g>
      <rect y={176} width={SCENE.width} height={8} fill={MYTH.leather} stroke={MYTH.inkLine} strokeWidth={2} />
      <rect y={SCENE.floor} width={SCENE.width} height={SCENE.height - SCENE.floor} fill={MYTH.deck} />
      <path d={`M0 ${SCENE.floor} H${SCENE.width} M0 208 H${SCENE.width} M60 199 V220 M150 208 V220 M240 199 V220`} stroke={MYTH.inkLine} strokeWidth={2} />
    </>
  )
}

function Arena({ take, cleared, total }: { take: number; cleared: number; total: number }) {
  const { myth } = useLabels()
  const { reduced } = useZoneStageContext()
  const foeRef = useRef<SVGGElement>(null)
  const medallionRef = useRef<SVGGElement>(null)
  const { pose, take: moveTake, play, settle } = usePoseSequence<SpriteMotion>({ entrance: [], rest: 'idle', still: 'still', policy: 'always' })
  const Foe = FOE[FOE_ORDER[Math.max(0, take - 1) % FOE_ORDER.length]]

  useEffect(() => {
    if (take > 0) play('finish')
  }, [take, play])
  useTrack(foeRef, FOE_TRACK, FIGHT_MS, take)
  useTrack(medallionRef, MEDALLION_TRACK, FIGHT_MS, take)

  return (
    <div className={`overflow-hidden ${u.panel}`}>
      <svg viewBox={`0 0 ${SCENE.width} ${SCENE.height}`} preserveAspectRatio="xMidYMax slice" className="block aspect-[16/8] w-full lg:aspect-[16/11]" aria-hidden="true">
        <Storm />
        <g ref={foeRef} opacity={reduced || take > 0 ? 0 : 1} className={u.sceneProp}>
          <g transform={`translate(${FOE_AT.x} ${FOE_AT.y}) scale(${FOE_AT.scale})`}>
            <Foe />
          </g>
        </g>
        <SpartanSprite key={moveTake} profession="engineer" motion={pose} place={HIM} onDone={settle} />
        {ORB_SCATTER.map((_, index) => (
          <Orb key={index} index={index} take={take} />
        ))}
        {/* the orb medallion the orbs fly into */}
        <g ref={medallionRef} className={u.sceneProp}>
          <circle cx={MEDALLION.x} cy={MEDALLION.y} r={14} fill={MYTH.panel} stroke={MYTH.bronze} strokeWidth={3} />
          <circle cx={MEDALLION.x} cy={MEDALLION.y} r={7} fill={MYTH.orb} stroke={MYTH.inkLine} strokeWidth={1.4} />
          <circle cx={MEDALLION.x - 2} cy={MEDALLION.y - 2} r={2.6} fill={MYTH.orbCore} />
        </g>
      </svg>
      <div className="flex flex-wrap items-center gap-3 border-t-2 border-[var(--myth-gold-deep)] px-4 py-3">
        <div className="flex min-w-[6rem] flex-1 gap-1" aria-hidden="true">
          {Array.from({ length: total }, (_, index) => (
            <span key={index} className={`relative h-3 flex-1 overflow-hidden ${u.counterCell}`}>
              <span data-on={index < cleared || undefined} className={`absolute inset-0 ${u.counterFill}`} />
            </span>
          ))}
        </div>
        <span className={`text-base text-[var(--myth-gold-pale)] ${u.display}`} role="status">
          {fillLabel(myth.rolesCleared, { count: cleared, total })}
        </span>
      </div>
    </div>
  )
}

function TrialCard({ job, cleared, onEnter }: { job: Job; cleared: boolean; onEnter: (id: string) => void }) {
  const { years, cards, myth } = useLabels()
  const { ref, triggered } = useSectionTrigger({ threshold: 0.35 })
  const { start, end } = jobYears(job, years.present)

  useEffect(() => {
    if (triggered) onEnter(job.id)
  }, [triggered, job.id, onEnter])

  return (
    <article ref={ref} data-on={cleared || undefined} className={`relative p-5 ${u.panel} ${u.trial}`}>
      <p className={`absolute right-3 top-3 flex items-center gap-1 text-sm ${u.display} ${u.seal}`}>
        <Laurel />
        {myth.roleCleared}
      </p>
      <h3 className={`pr-24 text-xl leading-tight text-[var(--myth-gold)] ${u.display}`}><SlashBreaks text={job.company} /></h3>
      <p className="mt-1 text-base font-bold">{job.title}</p>
      <p className="text-sm text-[var(--myth-bone-shade)]">
        {fillLabel(years.range, { start, end })}
        {job.location && ` · ${job.location}`}
      </p>
      <p className="mt-3 text-base leading-relaxed">{job.description}</p>
      {job.highlights.length > 0 && (
        <>
          <h4 className={`mt-4 text-sm text-[var(--myth-gold)] ${u.display}`}>{cards.keyAchievements}</h4>
          <ul className="mt-2 space-y-1.5">
            {job.highlights.map((line) => (
              <li key={line} className="flex gap-2 text-base">
                <span className="mt-2 h-2 w-2 shrink-0 rotate-45 bg-[var(--myth-blood)]" aria-hidden="true" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </>
      )}
      {job.skills.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2" aria-label={cards.skillsUsed}>
          {job.skills.map((skill) => (
            <li key={skill} className="border border-[var(--myth-gold-deep)] bg-[var(--myth-ink)] px-2 py-0.5 text-sm">
              {skill}
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

// One fight at a time, in job order, the next a fight's length after the last.
function useFightQueue(jobs: Job[]) {
  const { reduced } = useZoneStageContext()
  const [entered, setEntered] = useState<ReadonlySet<string>>(new Set())
  const [cleared, setCleared] = useState<readonly string[]>([])
  const lastFight = useRef(0)
  const next = jobs.find((job) => entered.has(job.id) && !cleared.includes(job.id))

  const enter = useCallback((id: string) => {
    setEntered((current) => (current.has(id) ? current : new Set(current).add(id)))
  }, [])

  useEffect(() => {
    if (!next || reduced) return
    const wait = Math.max(0, lastFight.current + FIGHT_GAP_MS - Date.now())
    const timer = window.setTimeout(() => {
      lastFight.current = Date.now()
      setCleared((current) => [...current, next.id])
    }, wait)
    return () => window.clearTimeout(timer)
  }, [next, reduced])

  const isCleared = (id: string) => reduced || cleared.includes(id)
  return { enter, isCleared, take: cleared.length, count: reduced ? jobs.length : cleared.length }
}

export function Trials({ jobs }: { jobs: Job[] }) {
  const { myth } = useLabels()
  const { enter, isCleared, take, count } = useFightQueue(jobs)

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
      <div className="sticky top-16 z-10 self-start lg:top-8">
        <Arena take={take} cleared={count} total={jobs.length} />
        <p className={`mt-3 hidden lg:block ${u.hint}`}>{myth.arenaHint}</p>
      </div>
      <ul className="columns-1 gap-6 xl:columns-2">
        {jobs.map((job) => (
          <li key={job.id} className={MASONRY_ITEM}>
            <TrialCard job={job} cleared={isCleared(job.id)} onEnter={enter} />
          </li>
        ))}
      </ul>
    </div>
  )
}
