'use client'

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { useProfession } from '@/contexts/ProfessionContext'
import { ProfessionSwitch, type ProfessionOption } from '@/components/cv/ProfessionSwitch'
import { useLabels } from '@/components/cv/CVDataProvider'
import type { Profession } from '@/lib/cv/professions'
import { prefersReducedMotion } from '@/hooks/useReducedMotion'
import type { SpritePose } from './character'
import { gearPath } from './depth'
import { Place } from './places'
import { SHADE, TYPEWRITER } from './palette'
import shade from './shade.module.css'

// The profession switch as the rotating room of the machine levels: his place is seen through a round
// hatch set in a cog, and three levers stand beside it. A pull leans him into the lever, the handle
// throws over, the room turns away a third of a circle and the next place turns in from the other side
// with the cog ring turning with it. The arrow keys change the profession straight away
// (ProfessionSwitch), so a change that did not come from a pull still turns the new place in.
//
// Animated: the place's props and his parts (./places), the turning room, the cog ring, the handles.

const PULL_MS = 320
const TURN_OUT_MS = 420
const PLACE_IN_MS = 900

type Turn = 'still' | 'out' | 'in'

const ROOM: Record<Turn, string> = {
  still: '',
  out: shade.roomOut,
  in: shade.roomIn,
}

const COG = gearPath(100, 100, 86, 24)

function Lever({ option, pulling, onPull }: { option: ProfessionOption; pulling: boolean; onPull: () => void }) {
  const thrown = option.selected || pulling
  return (
    <button
      type="button"
      {...option.optionProps}
      onClick={onPull}
      className="group flex min-h-[44px] items-center gap-3 px-2 py-1 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--sh-glow)]"
    >
      <svg viewBox="0 0 48 64" className="h-14 w-10 shrink-0" aria-hidden="true" focusable="false">
        <g className={`${shade.leverHandle} ${thrown ? shade.leverPulled : ''}`}>
          <line x1={24} y1={46} x2={24} y2={12} stroke="var(--sh-dim)" strokeWidth={3} strokeLinecap="round" />
          <circle cx={24} cy={10} r={5} fill={option.selected ? 'var(--sh-rim)' : 'var(--sh-dim)'} />
        </g>
        <path d="M10 64 L14 46 H34 L38 64 Z" fill="var(--sh-black)" stroke="var(--sh-dim)" strokeWidth={1.5} />
      </svg>
      <span
        className={`text-sm uppercase tracking-[0.2em] ${option.selected ? 'text-[color:var(--sh-heading)] underline decoration-[color:var(--sh-rim)] underline-offset-4' : 'text-[color:var(--sh-muted)] group-hover:text-[color:var(--sh-text)]'} ${TYPEWRITER}`}
      >
        {option.label}
      </span>
    </button>
  )
}

function Hatch({ profession, pose, turn, turns }: { profession: Profession; pose: SpritePose; turn: Turn; turns: number }) {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[22rem]" aria-hidden="true">
      <svg viewBox="0 0 200 200" className={`absolute inset-0 h-full w-full ${shade.cogRing}`} style={{ '--turns': turns } as CSSProperties} focusable="false">
        <path d={COG} fill={SHADE.black} fillRule="evenodd" stroke={SHADE.edge} strokeWidth={1} />
      </svg>
      <div className="absolute inset-[11%] overflow-hidden rounded-full border-4 border-[color:var(--sh-black)]">
        <div key={profession} className={`absolute inset-0 ${ROOM[turn]}`}>
          <Place profession={profession} pose={pose} />
        </div>
      </div>
    </div>
  )
}

export function LeverSwitch() {
  const { active } = useProfession()
  const { navigation, shade: words } = useLabels()
  const [pose, setPose] = useState<SpritePose>('act')
  const [pulling, setPulling] = useState<Profession | null>(null)
  const [turn, setTurn] = useState<Turn>('still')
  const [turns, setTurns] = useState(0)
  const shown = useRef(active)
  const timers = useRef<number[]>([])

  useEffect(() => () => timers.current.forEach((timer) => window.clearTimeout(timer)), [])

  const later = (run: () => void, ms: number) => {
    timers.current.push(window.setTimeout(run, ms))
  }

  // A new profession, from a pull or a key: the cog turns a third and the new place turns in.
  useLayoutEffect(() => {
    if (shown.current === active) return
    shown.current = active
    setTurns((count) => count + 1)
    setPose('act')
    if (prefersReducedMotion()) return
    setTurn('in')
    later(() => setTurn('still'), PLACE_IN_MS)
  }, [active])

  const pull = (option: ProfessionOption) => {
    if (option.selected || pulling) return
    const change = () => {
      setPulling(null)
      option.optionProps.onClick()
    }
    if (prefersReducedMotion()) {
      change()
      return
    }
    setPulling(option.id)
    setPose('push')
    later(() => setTurn('out'), PULL_MS)
    later(change, PULL_MS + TURN_OUT_MS)
  }

  return (
    <section className="relative z-20 mx-auto max-w-5xl px-4 sm:px-6" aria-label={navigation.professionSelection}>
      <div className="grid items-center gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Hatch profession={active} pose={pose} turn={turn} turns={turns} />
        <div className="flex flex-col items-center gap-4 md:items-start">
          <ProfessionSwitch
            className="flex flex-wrap justify-center gap-x-6 gap-y-3 md:flex-col md:gap-y-4"
            label={navigation.profession}
            renderOption={(option) => <Lever option={option} pulling={pulling === option.id} onPull={() => pull(option)} />}
          />
          <p className="text-center text-sm italic tracking-wider text-[color:var(--sh-muted)] md:text-left">{words.leverHint}</p>
        </div>
      </div>
    </section>
  )
}
