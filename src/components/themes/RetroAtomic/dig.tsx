'use client'

import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react'
import { useZoneStageContext } from '@/hooks/useZoneStage'
import { DogSprite, type DogMotion } from './dog'
import { DUST, DUST_DARK, POSTER_INK } from './palette'
import j from './journey.module.css'

// Ventures dug up by the dog. When the stage turns on the shepherd trots along the dirt strip to the spot
// over the first cassette's column, pitches nose down and digs with the clods flying off his paws; the
// spot leaves its mound and that holotape rises out of the ground. Then the next spot, and the next; after
// the last tape he trots past its mound and sits beside it, tail on the ground, looking up. The steps run
// in setTimeout phases from the tape count (TROT_MS per move, DIG_MS per dig); `children` gets the dug
// count. Under reduced motion all the tapes are up and he sits at the end.

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
  const perTape = Array.from({ length: tapes }, (_, spot) => [
    { spot, motion: 'trot' as const, ms: TROT_MS },
    { spot, motion: 'dig' as const, ms: DIG_MS },
  ]).flat()
  const end = Math.max(0, tapes - 1) + SIT_PAST
  return [...perTape, { spot: end, motion: 'trot', ms: TROT_MS }, { spot: end, motion: 'sit', ms: 0 }]
}

/** Where a spot sits along the strip, 0 to 1: the middle of that tape's share of the width. */
const spotAt = (spot: number, tapes: number) => (spot + 0.5) / Math.max(1, tapes)

export function Dig({ tapes, on, children }: { tapes: number; on: boolean; children: (dug: number) => ReactNode }) {
  const { reduced } = useZoneStageContext()
  const steps = useMemo(() => digSteps(tapes), [tapes])
  const [step, setStep] = useState(-1)

  useEffect(() => {
    if (reduced || !on || step >= steps.length - 1) return
    const timer = window.setTimeout(() => setStep((at) => at + 1), step < 0 ? 0 : steps[step].ms)
    return () => window.clearTimeout(timer)
  }, [on, step, steps, reduced])

  const last = steps.length - 1
  const current = reduced ? steps[last] : steps[step] ?? { spot: 0, motion: 'sit' as const, ms: 0 }
  const shown = reduced ? last : step
  // A tape is up once the dig step at its spot has finished, that is from the step after it.
  const dug = steps.slice(0, Math.max(0, shown)).filter((past) => past.motion === 'dig').length
  const at = step < 0 && !reduced ? 0 : spotAt(current.spot, tapes)

  return (
    <>
      <div className="relative mb-6 h-20 overflow-hidden" aria-hidden="true">
        <span className="absolute inset-x-0 bottom-0 h-4 rounded-t-full bg-atomic-dust-dark" />
        {Array.from({ length: tapes }, (_, spot) => (
          <span
            key={spot}
            className={`absolute bottom-3 block h-5 w-16 rounded-t-full border-2 border-atomic-poster-ink bg-atomic-dust ${j.mound}`}
            style={{ left: `${spotAt(spot, tapes) * 100}%` }}
            data-dug={spot < dug || undefined}
          />
        ))}
        <span className={`absolute inset-0 block ${j.digTrack}`} data-digging={current.motion === 'dig' || undefined} style={{ '--at': at } as CSSProperties}>
          <span className="absolute bottom-2 left-0 block h-14 w-20">
            <DogSprite motion={current.motion} className="h-full w-full" />
            {Array.from({ length: CLODS }, (_, clod) => (
              <svg key={clod} viewBox="0 0 10 8" className={`absolute bottom-1 left-12 h-2 w-3 ${j.clod}`} style={{ '--c': clod } as CSSProperties} focusable="false">
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
