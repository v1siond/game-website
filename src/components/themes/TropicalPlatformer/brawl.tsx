'use client'

import { useEffect, useRef, useState } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { prefersReducedMotion } from '@/hooks/useReducedMotion'
import { fillLabel } from '@/lib/cv/labels'
import type { MartialArts } from '@/lib/cv/content'
import { HeroCharacter } from './character'
import { COLORS as C } from './palette'
import look from './jungle.module.css'
import ring from './brawl.module.css'

// The Muay Thai record as a jungle bout: the facts on wooden signboards, and beside the achievements a
// clearing where the source's walking crocodile foes come at him one at a time. He waits in his guard,
// throwing jabs; a foe walks in from the right with the source's swaggering upright walk, takes the
// strike and is knocked spinning out of the clearing, and the next achievement is marked won. The first
// bout plays when the section scrolls in; Next challenger brings the next; once every achievement is
// won, the button starts the round again.
//
// Pattern: a phase chain. Each phase is a data-phase on the clearing that CSS animates; one timer per
// phase moves to the next. Reduced motion marks the achievement at once.

type Phase = 'ready' | 'walk' | 'hit'

const PHASE_MS: Record<Exclude<Phase, 'ready'>, number> = { walk: 1000, hit: 700 }
const NEXT: Record<Exclude<Phase, 'ready'>, Phase> = { walk: 'hit', hit: 'ready' }

function Burst({ solid }: { solid: boolean }) {
  return (
    <svg viewBox="0 0 20 20" className="mt-0.5 h-5 w-5 flex-shrink-0" aria-hidden="true" focusable="false">
      <path
        d="M10 1 L12 7 L18 5 L14 10 L19 14 L13 13 L12 19 L10 14 L7 19 L7 13 L1 14 L6 10 L2 5 L8 7 Z"
        fill={solid ? C.sunGold : 'none'}
        stroke={solid ? C.barkDark : C.plank}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// The walking crocodile, side on and facing left at him: upright on two legs, a long snout with teeth,
// a tan belly, a heavy tail, small arms, a dark back.
export function Croc() {
  return (
    <svg viewBox="0 0 70 100" className="block h-auto w-full" aria-hidden="true" focusable="false">
      <ellipse cx="38" cy="97" rx="22" ry="3" fill={C.shadow} opacity="0.35" />
      <path d="M46 70 Q64 78 68 96 Q58 86 44 82 Z" fill={C.crocDark} />
      <g className={ring.stride}>
        <rect x="26" y="74" width="9" height="22" rx="4" fill={C.crocDark} />
      </g>
      <g className={ring.strideBack}>
        <rect x="38" y="74" width="9" height="22" rx="4" fill={C.croc} />
      </g>
      <path d="M22 40 C22 28 30 24 40 24 C52 24 56 34 54 52 C53 66 50 80 38 80 C26 80 22 66 22 40 Z" fill={C.croc} />
      <path d="M26 46 C26 38 32 34 38 36 C40 50 40 66 36 76 C30 74 26 62 26 46 Z" fill={C.crocBelly} />
      <path d="M30 44 H38 M29 52 H39 M29 60 H39 M30 68 H38" stroke={C.crocDark} strokeWidth="1" opacity="0.5" />
      <path d="M44 24 C46 18 52 22 52 30" fill={C.crocDark} />
      <path d="M34 10 C40 6 48 8 50 16 C52 24 46 28 40 28 H8 C4 28 2 24 4 21 C6 18 14 18 22 17 Z" fill={C.croc} />
      <path d="M8 24 H30" stroke={C.crocDark} strokeWidth="1.5" />
      <path d="M10 24 l2 3 l2 -3 l2 3 l2 -3 l2 3 l2 -3" fill="none" stroke={C.burst} strokeWidth="1.2" />
      <circle cx="38" cy="13" r="3.4" fill={C.burst} />
      <circle cx="37" cy="13" r="1.6" fill={C.shadow} />
      <path d="M33 9 L42 8" stroke={C.crocDark} strokeWidth="2" strokeLinecap="round" />
      <path d="M26 40 Q16 44 14 52" fill="none" stroke={C.croc} strokeWidth="6" strokeLinecap="round" />
    </svg>
  )
}

function Clearing({ phase, round }: { phase: Phase; round: number }) {
  return (
    <div data-phase={phase} className={`relative mx-auto h-48 w-full max-w-xs overflow-hidden rounded-3xl ${ring.clearing}`} aria-hidden="true">
      <span className={`absolute inset-x-0 bottom-0 h-8 ${ring.ground}`} />
      <div className="absolute bottom-4 left-[8%] h-32 w-24">
        <HeroCharacter profession="fighter" pose="act" className="h-full w-full" />
      </div>
      {phase !== 'ready' && (
        <div key={round} className={`absolute bottom-4 right-[10%] w-20 ${ring.foe}`}>
          <div className={ring.walker}>
            <Croc />
          </div>
        </div>
      )}
      {phase === 'hit' && <span className={`absolute bottom-24 left-[46%] block h-10 w-10 ${ring.spark}`} />}
    </div>
  )
}

/** The record as a bout: each foe he knocks out wins the next achievement. */
export function BrawlRecord({ martialArts }: { martialArts: MartialArts }) {
  const { jungle } = useLabels()
  const { achievements } = martialArts.primary
  const { ref, triggered } = useSectionTrigger({ threshold: 0.25 })
  const [won, setWon] = useState(0)
  const [phase, setPhase] = useState<Phase>('ready')
  const started = useRef(false)
  const all = won >= achievements.length
  const status = won === 0 ? '' : all ? jungle.allBeaten : fillLabel(jungle.beaten, { achievement: achievements[won - 1] })

  // One bout: the chain of phases, or straight to the win under reduced motion. After the last foe the
  // round starts again.
  const fight = () => {
    if (phase !== 'ready' || achievements.length === 0) return
    if (all) setWon(0)
    if (prefersReducedMotion()) setWon((count) => count + 1)
    else setPhase('walk')
  }

  useEffect(() => {
    if (phase === 'ready') return
    const timer = window.setTimeout(() => {
      const next = NEXT[phase]
      setPhase(next)
      if (next === 'ready') setWon((count) => count + 1)
    }, PHASE_MS[phase])
    return () => window.clearTimeout(timer)
  }, [phase])

  // The first bout plays once, when the section arrives.
  useEffect(() => {
    if (!triggered || started.current || achievements.length === 0) return
    started.current = true
    if (prefersReducedMotion()) setWon(1)
    else setPhase('walk')
  }, [triggered, achievements.length])

  return (
    <div ref={ref} className="grid gap-8 md:grid-cols-[minmax(0,1fr)_auto]">
      <MuayThaiRecord
        martialArts={martialArts}
        classNames={{
          facts: 'grid gap-4 sm:grid-cols-2 md:col-span-2',
          fact: `rounded-2xl p-4 ${look.board}`,
          term: `text-sm uppercase text-[color:var(--tp-sun-gold)] ${look.display}`,
          value: 'mt-1 text-base text-[color:var(--tp-parchment)]',
          achievements: `space-y-3 self-center rounded-3xl p-6 ${look.board}`,
          achievement: 'flex items-start gap-3 text-base text-[color:var(--tp-parchment)]',
        }}
        renderAchievement={(achievement) => {
          const isWon = achievements.indexOf(achievement) < won
          return (
            <>
              <Burst solid={isWon} />
              <span className="min-w-0 flex-1">{achievement}</span>
              {isWon && <span className={`rounded-md px-2 text-sm ${look.tag}`}>{jungle.won}</span>}
            </>
          )
        }}
      />
      <div className="flex w-full flex-col items-center gap-4 md:w-80">
        <Clearing phase={phase} round={won} />
        <p className={`text-center text-base text-[color:var(--tp-parchment)] ${look.caption}`}>{jungle.fightHint}</p>
        <button type="button" onClick={fight} className={`min-h-[44px] rounded-xl px-6 text-base ${look.button} ${look.buttonGold} ${look.focus}`}>
          {all ? jungle.fightAgain : jungle.fight}
        </button>
        <p role="status" className={`min-h-[1.5rem] text-center text-base text-[color:var(--tp-sun-gold)] ${look.caption}`}>
          {status}
        </p>
      </div>
    </div>
  )
}
