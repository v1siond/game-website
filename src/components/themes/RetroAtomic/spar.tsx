'use client'

import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { useZoneStageContext } from '@/hooks/useZoneStage'
import { DwellerSprite, type DwellerMotion } from './dweller'
import { MutantSprite, type MutantMotion } from './mutant'
import { POSTER_INK, SHELTER_YELLOW, WARNING_RED } from './palette'
import j from './journey.module.css'

// The Muay Thai record as a spar in the ring printed on the perk chart. He and the green mutant square up;
// once the stage is on and the ring itself is in view, for each achievement he steps in and throws a
// clinch knee or a roundhouse (they alternate), the mutant doubles over the knee or rocks back from the
// kick at the moment it lands, a comic burst pops at the contact point and that achievement's perk card
// flips in. After the last one the mutant drops to one knee and he gives the thumbs up. The beats run in
// setTimeout phases from the achievement count; `children` gets the shown count and the ring, which the
// perk chart prints just above its cards. Under reduced motion every card is shown, the mutant is down
// and he stands still.

const CONTACT_MS = 380
const REACT_MS = 800
const GUARD_MS = 500

interface Beat {
  him: DwellerMotion
  foe: MutantMotion
  shown: number
  ms: number
}

const HITS: { him: DwellerMotion; foe: MutantMotion }[] = [
  { him: 'knee', foe: 'kneed' },
  { him: 'kick', foe: 'kicked' },
]

/** Wind up, land and reset per achievement, then the mutant goes down. */
function sparBeats(count: number): Beat[] {
  const rounds = Array.from({ length: count }, (_, round) => {
    const hit = HITS[round % HITS.length]
    return [
      { him: hit.him, foe: 'guard' as const, shown: round, ms: CONTACT_MS },
      { him: hit.him, foe: hit.foe, shown: round + 1, ms: REACT_MS },
      { him: 'idle' as const, foe: 'guard' as const, shown: round + 1, ms: GUARD_MS },
    ]
  }).flat()
  return [...rounds, { him: 'thumbsUp', foe: 'down', shown: count, ms: 0 }]
}

const READY: Beat = { him: 'idle', foe: 'guard', shown: 0, ms: 0 }
const settled = (count: number): Beat => ({ him: 'still', foe: 'down', shown: count, ms: 0 })

// The three ring ropes behind the fighters.
const ROPES = ['top-[18%]', 'top-[34%]', 'top-[50%]']

/** The comic impact star, its own pop at each landed strike. */
function Burst() {
  return (
    <svg viewBox="0 0 60 60" className={`absolute -left-4 top-[48%] h-14 w-14 ${j.sparBurst}`} focusable="false">
      <path d="M30 2 L36 20 L56 12 L44 28 L58 40 L38 40 L36 58 L28 42 L12 54 L18 36 L2 28 L20 24 L14 6 Z" fill={SHELTER_YELLOW} stroke={POSTER_INK} strokeWidth={3} strokeLinejoin="round" />
      <path d="M30 18 L34 27 L43 28 L36 34 L38 43 L30 38 L22 43 L24 34 L17 28 L26 27 Z" fill={WARNING_RED} />
    </svg>
  )
}

function Ring({ beat, step, ringRef }: { beat: Beat; step: number; ringRef: (node: HTMLElement | null) => void }) {
  const landed = beat.foe === 'kneed' || beat.foe === 'kicked'
  const striking = beat.him === 'knee' || beat.him === 'kick'

  return (
    <div ref={ringRef} className="relative mb-8 h-48 overflow-hidden border-4 border-atomic-poster-ink bg-atomic-cream-shade sm:h-64" aria-hidden="true">
      {ROPES.map((top) => (
        <span key={top} className={`absolute inset-x-0 h-1.5 border-y-2 border-atomic-poster-ink bg-atomic-red ${top}`} />
      ))}
      <span className="absolute inset-y-0 left-2 w-3 border-2 border-atomic-poster-ink bg-atomic-poster-blue" />
      <span className="absolute inset-y-0 right-2 w-3 border-2 border-atomic-poster-ink bg-atomic-red" />
      <span className="absolute inset-x-0 bottom-0 h-6 border-t-4 border-atomic-poster-ink bg-atomic-poster-blue" />
      <div className="absolute inset-x-0 bottom-2 flex items-end justify-center">
        <div className={`h-32 w-[5.3rem] sm:h-44 sm:w-[7.3rem] ${j.sparHim}`} data-striking={striking || undefined}>
          <DwellerSprite profession="fighter" motion={beat.him} className="h-full w-full" />
        </div>
        <div className="relative -ml-1 h-40 w-32 sm:h-56 sm:w-[11.2rem]">
          <MutantSprite motion={beat.foe} className="h-full w-full" />
          {landed && <Burst key={step} />}
        </div>
      </div>
    </div>
  )
}

interface SparProps {
  count: number
  on: boolean
  children: (spar: { shown: number; ring: ReactNode }) => ReactNode
}

export function Spar({ count, on, children }: SparProps) {
  const { reduced } = useZoneStageContext()
  const beats = useMemo(() => sparBeats(count), [count])
  const [step, setStep] = useState(-1)
  // The bell rings once the ring itself is mostly in view: on a phone the record's facts come first.
  const { ref, triggered } = useSectionTrigger({ threshold: 0.6 })
  const fighting = on && triggered

  useEffect(() => {
    if (reduced || !fighting || step >= beats.length - 1) return
    const timer = window.setTimeout(() => setStep((at) => at + 1), step < 0 ? GUARD_MS : beats[step].ms)
    return () => window.clearTimeout(timer)
  }, [fighting, step, beats, reduced])

  const beat = reduced ? settled(count) : beats[step] ?? READY

  return <>{children({ shown: beat.shown, ring: <Ring beat={beat} step={step} ringRef={ref} /> })}</>
}
