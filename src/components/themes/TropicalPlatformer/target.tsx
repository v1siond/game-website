'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { prefersReducedMotion } from '@/hooks/useReducedMotion'
import { fillLabel } from '@/lib/cv/labels'
import type { MartialArts } from '@/lib/cv/content'
import { BarrelArt } from './barrel'
import { HeroCharacter } from './character'
import { COLORS as C } from './palette'
import look from './jungle.module.css'
import rig from './target.module.css'

// The Muay Thai record as the end of a level: the facts on wooden signboards, and beside the
// achievements the source's end target, a red and white target pad at the foot of a pole with the prize
// window on top. Jump fires him from the high barrel; he drops onto the pad rolled into a ball, the
// marker climbs the pole, the prize window rolls through the achievements and stops on the next one,
// which is marked won in the list. The first jump plays when the section scrolls in; once every prize is
// won, the button starts the round again.
//
// Pattern: a phase chain. Each phase is a data-phase on the rig that CSS animates; one timer per phase
// moves to the next. Reduced motion skips straight to the prize.

type Phase = 'ready' | 'fall' | 'climb' | 'roll'

const PHASE_MS: Record<Exclude<Phase, 'ready'>, number> = { fall: 600, climb: 800, roll: 1200 }
const NEXT: Record<Exclude<Phase, 'ready'>, Phase> = { fall: 'climb', climb: 'roll', roll: 'ready' }

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

function TargetRig({ achievements, won, phase }: { achievements: string[]; won: number; phase: Phase }) {
  const shown = Math.min(won, achievements.length - 1)
  return (
    <div data-phase={phase} className={`relative mx-auto h-96 w-64 ${rig.rig}`} aria-hidden="true">
      <div className={`absolute left-1/2 top-0 w-56 -translate-x-1/2 overflow-hidden rounded-2xl ${look.plank}`}>
        <div className="h-20 overflow-hidden px-3 py-2">
          <div key={`${won}-${phase === 'roll'}`} className={rig.reel} style={{ '--prize': shown, '--count': achievements.length } as CSSProperties}>
            {[...achievements, ...achievements].map((achievement, index) => (
              <p key={index} className={`flex h-16 items-center justify-center text-center text-sm font-bold leading-tight text-[color:var(--tp-bark-dark)] ${rig.prize}`}>
                {achievement}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className={`absolute bottom-10 left-1/2 top-24 w-3 -translate-x-1/2 rounded ${rig.pole}`} />
      <div className={`absolute bottom-10 left-1/2 -ml-4 w-8 ${rig.marker}`}>
        <BarrelArt mark="plain" className="block h-auto w-full" />
      </div>

      <svg viewBox="0 0 120 30" className="absolute bottom-2 left-1/2 w-40 -translate-x-1/2" focusable="false">
        <ellipse cx="60" cy="18" rx="58" ry="11" fill={C.barkDark} />
        <ellipse cx="60" cy="15" rx="56" ry="11" fill={C.target} />
        <ellipse cx="60" cy="15" rx="40" ry="8" fill={C.burst} />
        <ellipse cx="60" cy="15" rx="24" ry="5" fill={C.target} />
        <ellipse cx="60" cy="15" rx="9" ry="2.2" fill={C.burst} />
      </svg>

      <div className={`absolute -left-6 top-24 w-12 ${rig.cannon}`}>
        <BarrelArt mark="burst" className="block h-auto w-full" />
      </div>

      <div className={`absolute bottom-6 left-[56%] h-24 w-16 ${rig.jumperX}`}>
        <div className={`h-full w-full ${rig.jumperY}`}>
          <HeroCharacter profession="fighter" pose={phase === 'fall' ? 'roll' : 'act'} className="h-full w-full" />
        </div>
      </div>
    </div>
  )
}

/** The record with the end target: each jump wins the next achievement. */
export function TargetRecord({ martialArts }: { martialArts: MartialArts }) {
  const { jungle } = useLabels()
  const { achievements } = martialArts.primary
  const { ref, triggered } = useSectionTrigger({ threshold: 0.25 })
  const [won, setWon] = useState(0)
  const [phase, setPhase] = useState<Phase>('ready')
  const started = useRef(false)
  const all = won >= achievements.length
  const status = won === 0 ? '' : all ? jungle.allPrizes : fillLabel(jungle.prizeWon, { achievement: achievements[won - 1] })

  // One jump: the chain of phases, or straight to the prize under reduced motion. After the last prize
  // the round starts again.
  const jump = () => {
    if (phase !== 'ready' || achievements.length === 0) return
    if (all) setWon(0)
    if (prefersReducedMotion()) setWon((count) => count + 1)
    else setPhase('fall')
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

  // The first jump plays once, when the section arrives.
  useEffect(() => {
    if (!triggered || started.current || achievements.length === 0) return
    started.current = true
    if (prefersReducedMotion()) setWon(1)
    else setPhase('fall')
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
      <div className="flex flex-col items-center gap-4">
        <TargetRig achievements={achievements} won={won} phase={phase} />
        <p className={`text-center text-base text-[color:var(--tp-parchment)] ${look.caption}`}>{jungle.jumpHint}</p>
        <button type="button" onClick={jump} className={`min-h-[44px] rounded-xl px-6 text-base ${look.button} ${look.buttonGold} ${look.focus}`}>
          {all ? jungle.jumpAgain : jungle.jump}
        </button>
        <p role="status" className={`min-h-[1.5rem] text-center text-base text-[color:var(--tp-sun-gold)] ${look.caption}`}>
          {status}
        </p>
      </div>
    </div>
  )
}
