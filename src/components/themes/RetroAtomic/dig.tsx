'use client'

import { useMemo, type ReactNode } from 'react'
import { useTimedSteps } from '@/hooks/useTimedSteps'
import { STORY_MS, stepWithin } from '@/lib/motion/stepWithin'
import { useZoneStageContext } from '@/hooks/useZoneStage'
import { DogSprite, type DogMotion } from './dog'
import { DUST, DUST_DARK, POSTER_INK } from './palette'
import j from './journey.module.css'
import { cssVars } from '@/lib/cssVars'

// Ventures dug up by the dog. When the stage turns on the shepherd trots along the dirt strip to the spot
// over the first cassette's column, pitches nose down and digs with the clods flying off his paws; the
// spot leaves its mound and that holotape rises out of the ground. Then the next spot, and the next; after
// the last tape he trots past its mound and sits beside it, tail on the ground, looking up. The steps run
// as the shared timed steps from the tape count (TROT_MS per move, DIG_MS per dig, both quickened alike by
// stepWithin when enough tapes would run the dig past 5 s); `children` gets the dug count. Under reduced motion all the tapes are up and he sits at the end.

const TROT_MS = 700
const DIG_MS = 1000
const CLODS = 4

interface Step {
  spot: number
  motion: DogMotion
  ms: number
}

// Where he sits at the end: past the last mound, beside its tape.
const SIT_PAST = 0.4

/** Trot to each spot, dig it, then sit just past the last one. */
function digSteps(tapes: number): Step[] {
  const tape = TROT_MS + DIG_MS
  const pace = stepWithin({ step: tape, count: tapes, fixed: TROT_MS, budget: STORY_MS }) / tape
  const perTape = Array.from({ length: tapes }, (_, spot) => [
    { spot, motion: 'trot' as const, ms: Math.floor(TROT_MS * pace) },
    { spot, motion: 'dig' as const, ms: Math.floor(DIG_MS * pace) },
  ]).flat()
  const end = Math.max(0, tapes - 1) + SIT_PAST
  return [...perTape, { spot: end, motion: 'trot', ms: TROT_MS }, { spot: end, motion: 'sit', ms: 0 }]
}

/** Where a spot sits along the strip, 0 to 1: the middle of that tape's share of the width. */
const spotAt = (spot: number, tapes: number) => (spot + 0.5) / Math.max(1, tapes)

export function Dig({ tapes, on, children }: { tapes: number; on: boolean; children: (dug: number) => ReactNode }) {
  const { reduced } = useZoneStageContext()
  const steps = useMemo(() => digSteps(tapes), [tapes])
  const durations = useMemo(() => steps.map(({ ms }) => ms), [steps])
  const step = useTimedSteps(durations, { on, reduced, firstMs: 0 })

  const current = steps[step] ?? { spot: 0, motion: 'sit' as const, ms: 0 }
  // A tape is up once the dig step at its spot has finished, that is from the step after it.
  const dug = steps.slice(0, Math.max(0, step)).filter((past) => past.motion === 'dig').length
  const at = step < 0 ? 0 : spotAt(current.spot, tapes)

  return (
    <>
      <div className="relative mb-6 h-20 overflow-hidden" aria-hidden="true">
        <span className="absolute inset-x-0 bottom-0 h-4 rounded-t-full bg-atomic-dust-dark" />
        {Array.from({ length: tapes }, (_, spot) => (
          <span
            key={spot}
            className={`absolute bottom-3 block h-5 w-16 rounded-t-full border-2 border-atomic-poster-ink bg-atomic-dust ${j.mound}`}
            style={cssVars({ '--spot': spotAt(spot, tapes) })}
            data-dug={spot < dug || undefined}
          />
        ))}
        <span className={`absolute inset-0 block ${j.digTrack}`} data-digging={current.motion === 'dig' || undefined} style={cssVars({ '--at': at })}>
          <span className="absolute bottom-2 left-0 block h-14 w-20">
            <DogSprite motion={current.motion} className="h-full w-full" />
            {Array.from({ length: CLODS }, (_, clod) => (
              <svg key={clod} viewBox="0 0 10 8" className={`absolute bottom-1 left-12 h-2 w-3 ${j.clod}`} style={cssVars({ '--c': clod })} focusable="false">
                <ellipse cx={5} cy={4} rx={4.5} ry={3.5} fill={clod % 2 ? DUST : DUST_DARK} stroke={POSTER_INK} strokeWidth={1} />
              </svg>
            ))}
          </span>
        </span>
      </div>
      {children(dug)}
    </>
  )
}
