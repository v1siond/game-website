'use client'

import { useRef, useState } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import type { Labels } from '@/lib/cv/labels'
import type { MartialArts } from '@/lib/cv/content'
import { SpartanSprite, type SpriteMotion } from './sprite'
import { FOE } from './foes'
import { MOVES } from './rig'
import { useTrack } from './track'
import { MYTH } from './palette'
import { nextStrike, type Strike } from './fates'
import { usePoseSequence } from '@/hooks/usePoseSequence'
import { SlabButton } from './buttons'
import u from './underworld.module.css'

// Muay Thai in the arena of the green fields: he stands in his shorts, wraps and mongkhon facing the
// one eyed giant with the bronze shield, and Strike throws his next move (knee, elbow, kick, then the
// rage roar, and round again), the move's name called over the arena as it lands. Each strike staggers
// the giant back behind his shield as it lands; the roar makes his eye flare and him cower. Beside him the record is the stone tablet of facts and his achievements are
// the prophecies on the list, each stamped fulfilled in turn when the stage first shows.

const STRIKE_NAME: Record<Strike, (labels: Labels['myth']) => string> = {
  knee: (myth) => myth.strikeKnee,
  elbow: (myth) => myth.strikeElbow,
  kick: (myth) => myth.strikeKick,
  roar: (myth) => myth.strikeRoar,
}

const SCENE = { width: 252, height: 200 }
const HIM = { x: 0, y: 8, height: 188 }
const GIANT = { x: 100, y: 36, scale: 2 }

// The giant's answer to each strike, over the strike's own length: the blow lands about halfway.
const stagger = (lean: number, push: number): Keyframe[] => [
  { offset: 0, transform: 'none' },
  { offset: 0.42, transform: 'none' },
  { offset: 0.55, transform: `translate(${push}px, -2px) rotate(${lean}deg)` },
  { offset: 0.8, transform: `translate(${push / 3}px, 0) rotate(${lean / 3}deg)` },
  { offset: 1, transform: 'none' },
]

const GIANT_TRACK: Record<Strike, Keyframe[]> = {
  knee: stagger(8, 12),
  elbow: stagger(5, 9),
  kick: stagger(10, 16),
  roar: [
    { offset: 0, transform: 'none' },
    { offset: 0.3, transform: 'translate(10px, 4px) scale(0.96)' },
    { offset: 0.8, transform: 'translate(10px, 4px) scale(0.96)' },
    { offset: 1, transform: 'none' },
  ],
}

const EYE_TRACK: Record<Strike, Keyframe[]> = {
  knee: [{ opacity: 0 }, { opacity: 0 }],
  elbow: [{ opacity: 0 }, { opacity: 0 }],
  kick: [{ opacity: 0 }, { opacity: 0 }],
  roar: [
    { offset: 0, opacity: 0 },
    { offset: 0.3, opacity: 1 },
    { offset: 0.8, opacity: 1 },
    { offset: 1, opacity: 0 },
  ],
}

const Giant = FOE.cyclops

function Ring({ strike, take }: { strike: Strike; take: number }) {
  const giantRef = useRef<SVGGElement>(null)
  const eyeRef = useRef<SVGCircleElement>(null)
  useTrack(giantRef, GIANT_TRACK[strike], MOVES[strike].ms, take)
  useTrack(eyeRef, EYE_TRACK[strike], MOVES[strike].ms, take)

  return (
    <g ref={giantRef} className={`${u.sceneProp} ${u.giant}`}>
      <g transform={`translate(${GIANT.x} ${GIANT.y}) scale(${GIANT.scale})`}>
        <Giant />
        <circle ref={eyeRef} cx={30} cy={13} r={6} fill={MYTH.giantEye} opacity={0} className={u.sceneProp} />
      </g>
    </g>
  )
}

function Arena() {
  const { myth } = useLabels()
  const { pose, take, play, settle } = usePoseSequence<SpriteMotion>({ entrance: [], rest: 'idle', still: 'still', policy: 'always' })
  const [last, setLast] = useState<Strike | null>(null)

  const strike = () => {
    const next = nextStrike(last)
    setLast(next)
    play(next)
  }

  return (
    <div className={`relative flex flex-col items-center p-5 ${u.arena}`}>
      <p className="h-10 text-center" role="status">
        {last && (
          <span key={take} className={`inline-block text-2xl text-[var(--myth-gold-pale)] ${u.display} ${u.strikeName}`}>
            {STRIKE_NAME[last](myth)}
          </span>
        )}
      </p>
      <svg viewBox={`0 0 ${SCENE.width} ${SCENE.height}`} className="h-64 w-full max-w-[19rem]" aria-hidden="true">
        <path d={`M0 ${SCENE.height - 6} L${SCENE.width} ${SCENE.height - 6}`} stroke={MYTH.goldDeep} strokeWidth={3} />
        <Ring strike={last ?? 'knee'} take={last ? take : 0} />
        <SpartanSprite key={take} profession="fighter" motion={pose} place={HIM} onDone={settle} />
      </svg>
      <SlabButton tone="blood" className="mt-4" onClick={strike}>
        {myth.strike}
      </SlabButton>
      <p className={`mt-4 ${u.hint}`}>{myth.strikeHint}</p>
    </div>
  )
}

export function Prophecies({ martialArts }: { martialArts: MartialArts }) {
  const { myth } = useLabels()
  const { achievements } = martialArts.primary

  return (
    <div className="grid gap-8 lg:grid-cols-[20rem_minmax(0,1fr)]">
      <Arena />
      <div className="min-w-0">
        <h3 className={`mb-4 text-xl text-[var(--myth-gold)] ${u.display}`}>{martialArts.primary.title}</h3>
        <div className="grid gap-6">
          <MuayThaiRecord
            martialArts={martialArts}
            classNames={{
              facts: `grid gap-3 p-5 sm:grid-cols-2 ${u.parchment}`,
              fact: 'min-w-0',
              term: `text-sm text-[var(--myth-ink-soft)] ${u.display}`,
              value: 'text-base',
              achievements: `space-y-3 p-5 ${u.panel}`,
              achievement: 'flex items-start justify-between gap-4 border-b border-[var(--myth-gold-deep)] pb-3 last:border-b-0 last:pb-0',
            }}
            renderAchievement={(achievement) => (
              <>
                <span className="text-base">{achievement}</span>
                <span className={`shrink-0 border-2 border-[var(--myth-ink)] bg-[var(--myth-blood)] px-2 py-0.5 text-sm text-[var(--myth-bone)] ${u.display} ${u.fulfilled}`} style={{ ['--i' as string]: achievements.indexOf(achievement) }}>
                  {myth.fulfilled}
                </span>
              </>
            )}
          />
        </div>
      </div>
    </div>
  )
}
