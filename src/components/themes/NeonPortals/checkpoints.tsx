'use client'

import { useMemo } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { SlashBreaks } from '@/components/cv/SlashBreaks'
import { usePoseSequence } from '@/hooks/usePoseSequence'
import { useScrollScene } from '@/hooks/useScrollScene'
import { useZoneStage } from '@/hooks/useZoneStage'
import { cssVars } from '@/lib/cssVars'
import type { Job } from '@/lib/cv/content'
import { jobCard, type JobCard } from '@/lib/cv/cvView'
import { MASONRY_ITEM, MASONRY_LIST } from '@/lib/cv/masonry'
import { SceneButton } from './actions'
import { MarkedLines } from '@/components/cv/MarkedLines'
import { TagList } from '@/components/cv/TagList'
import { BODY, CARD_LINE, CARD_TITLE, PANEL, POINTS, TAGS } from './cards'
import { PATH, RUN_MS, postAt, postX, type Motion } from './choreography'
import { ERA, PORTAL, type Era } from './palette'
import { Region, Rig, Strip } from './stage'
import css from './checkpoints.module.css'

// Work Experience as a road through the medieval hills (research part 2 [9]): one checkpoint post per job
// along a path he runs left to right, the current job first, as the view orders them. Scroll scrubs his
// place along the path and his stride with it (useScrollScene: the shared scheduler writes
// --scene-progress, no render a frame, and character.module.css reads it under data-scrub). Post i lights
// halfway through its share of the path, as he passes it, stays whole and stays lit, and at the same
// moment that job's card lights the lantern hung on its corner. "Run" plays the whole path in 3 s, then
// scroll takes over again. On a phone the strip is lower and each card carries its own small post.
//
// Animated: him, the lanterns of the posts and of the cards (one class, staggered by --t).
// Reduced motion: the path run, him at its end, every post's and card's lantern lit.

type RunMove = 'stand' | 'run'

const NO_ENTRANCE: readonly RunMove[] = []

const PATH_VARS = cssVars({ '--path-from': PATH.from, '--path-to': PATH.to, '--run-ms': RUN_MS })

const AT_START = { x: PATH.from, lift: 0 }

/** The checkpoint's lantern: its roof, its dark glass and the light that comes on as he passes. */
function Lantern() {
  return (
    <>
      <path d="M4 14 H20 L18 26 H6 Z" fill={PORTAL.WOOD_DARK} stroke={PORTAL.INK} strokeWidth={2} strokeLinejoin="round" />
      <circle cx={12} cy={19} r={4} fill={PORTAL.BOARD} />
      <g className={css.lit}>
        <circle cx={12} cy={19} r={11} fill={PORTAL.GOLD} opacity={0.35} />
        <circle cx={12} cy={19} r={4} fill={PORTAL.LAMP} />
      </g>
      <path d="M6 10 L12 4 L18 10 Z" fill={ERA.medieval.cone} stroke={PORTAL.INK} strokeWidth={2} strokeLinejoin="round" />
    </>
  )
}

/** A checkpoint post: a wooden post with its lantern on top. */
function PostArt({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 60" className={`overflow-visible ${className}`} aria-hidden="true" focusable="false">
      <rect x={9} y={22} width={6} height={38} fill={PORTAL.WOOD} stroke={PORTAL.INK} strokeWidth={2} />
      <Lantern />
    </svg>
  )
}

function Road() {
  return (
    <svg viewBox="0 0 600 200" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true" focusable="false">
      <path d="M0 150 Q150 120 300 140 T600 130 V200 H0 Z" fill={ERA.medieval.hillFar} />
      <path d="M0 172 Q150 160 300 170 T600 166 V200 H0 Z" fill={ERA.medieval.hill} />
      <path d="M0 184 Q300 176 600 182" fill="none" stroke={ERA.medieval.wall} strokeWidth={6} strokeDasharray="18 12" />
    </svg>
  )
}

function JobPlate({ card }: { card: JobCard }) {
  const { cards } = useLabels()
  return (
    <article className={`${PANEL} ${BODY} flex gap-3`}>
      <svg viewBox="0 2 24 26" className="absolute -top-5 right-3 hidden h-10 w-9 overflow-visible md:block" aria-hidden="true" focusable="false">
        <Lantern />
      </svg>
      <PostArt className="h-14 w-6 shrink-0 md:hidden" />
      <div className="min-w-0">
        <h3 className={CARD_TITLE}>{card.title}</h3>
        <p className={CARD_LINE}>
          <SlashBreaks text={card.company} />
        </p>
        <p className="mt-1 flex flex-wrap gap-x-3 text-sm text-[color:var(--np-ink-soft)]">
          <span>{card.years}</span>
          <span>{card.location}</span>
        </p>
        <p className="mt-2 text-sm leading-relaxed">{card.description}</p>
        <MarkedLines items={card.highlights} label={cards.keyAchievements} look={POINTS} />
        <TagList items={card.skills} label={cards.skillsUsed} look={TAGS} />
      </div>
    </article>
  )
}

export function CheckpointLevel({ jobs }: { jobs: Job[] }) {
  const { sections, actions, years } = useLabels()
  const { ref, on, reduced } = useZoneStage<Era>('medieval')
  const scroll = useScrollScene<HTMLDivElement>({ start: 0.95, end: 0.3 })
  const run = usePoseSequence<RunMove>({ entrance: NO_ENTRANCE, rest: 'stand', moveMs: RUN_MS })
  const running = run.move === 'run'
  const plates = useMemo(() => jobs.map((job) => jobCard(job, years)), [jobs, years])
  const count = plates.length
  const motion: Motion = { pose: running || scroll.phase === 'playing' ? 'run' : 'idle', from: AT_START, to: AT_START, ms: 0 }

  return (
    <Region title={sections.workExperience} stageRef={ref} on={on}>
      <div ref={scroll.ref} className={css.path} data-running={running} data-scrub={!running} style={PATH_VARS}>
        <Strip size="h-40 md:h-auto md:aspect-[3/1]">
          <Road />
          {plates.map((card, index) => (
            <div key={card.id} className={css.post} style={cssVars({ '--x': postX(index, count), '--t': postAt(index, count) })}>
              <PostArt className="h-full w-full" />
            </div>
          ))}
          <Rig motion={motion} step={0} run size="strip" track={css.runner} />
        </Strip>
        {!reduced && <SceneButton label={actions.run} onPress={() => run.play('run')} disabled={running} className="-mt-2 mb-6" />}
        <ol className={MASONRY_LIST}>
          {plates.map((card, index) => (
            <li key={card.id} className={MASONRY_ITEM} style={cssVars({ '--t': postAt(index, count) })}>
              <JobPlate card={card} />
            </li>
          ))}
        </ol>
      </div>
    </Region>
  )
}
