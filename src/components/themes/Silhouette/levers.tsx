'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useProfession } from '@/contexts/ProfessionContext'
import { ProfessionSwitch, type ProfessionOption } from '@/components/cv/ProfessionSwitch'
import { useLabels } from '@/components/cv/CVDataProvider'
import type { Profession } from '@/lib/cv/professions'
import { prefersReducedMotion } from '@/hooks/useReducedMotion'
import type { SpritePose } from './character'
import { Place } from './places'
import { useCut } from './cut'
import { TYPEWRITER } from './palette'
import shade from './shade.module.css'

// The profession switch as three levers in the ground under his place, the way a silhouette puzzle
// platformer hands the player a lever: he leans into it, the handle throws over, the screen cuts to
// black and he respawns in the new place, getting up from the ground before he goes back to work.
// The arrow keys change the profession straight away (ProfessionSwitch), so a change that did not
// come from a pull still gets the cut and the respawn, before the new place paints.
//
// Animated: the place's props and his parts (./places), the three handles.

const PULL_MS = 320
const RISE_MS = 1300

function Lever({ option, pulling, onPull }: { option: ProfessionOption; pulling: boolean; onPull: () => void }) {
  const thrown = option.selected || pulling
  return (
    <button
      type="button"
      {...option.optionProps}
      onClick={onPull}
      className="group flex min-h-[44px] flex-col items-center gap-1 px-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--sh-glow)]"
    >
      <svg viewBox="0 0 48 64" className="-mt-10 h-16 w-12" aria-hidden="true" focusable="false">
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

export function LeverSwitch() {
  const { active } = useProfession()
  const { navigation, shade: words } = useLabels()
  const cut = useCut()
  const [pose, setPose] = useState<SpritePose>('act')
  const [pulling, setPulling] = useState<Profession | null>(null)
  const shown = useRef(active)
  const pulled = useRef(false)
  const timers = useRef<number[]>([])

  useEffect(() => () => timers.current.forEach((timer) => window.clearTimeout(timer)), [])

  const later = (run: () => void, ms: number) => {
    timers.current.push(window.setTimeout(run, ms))
  }

  // A new profession: he respawns in its place. A pull already cut to black; a key press cuts here.
  useLayoutEffect(() => {
    if (shown.current === active) return
    shown.current = active
    if (!pulled.current) cut()
    pulled.current = false
    setPose('rise')
    later(() => setPose('act'), RISE_MS)
  }, [active, cut])

  const pull = (option: ProfessionOption) => {
    if (option.selected || pulling) return
    const change = () => {
      pulled.current = true
      setPulling(null)
      option.optionProps.onClick()
    }
    if (prefersReducedMotion()) {
      change()
      return
    }
    setPulling(option.id)
    setPose('push')
    later(() => cut(change), PULL_MS)
  }

  return (
    <section className="relative z-20 mx-auto max-w-6xl" aria-label={navigation.professionSelection}>
      <div className="relative h-[36vh] min-h-[240px] max-h-[420px] overflow-hidden" aria-hidden="true">
        <Place profession={active} pose={pose} />
      </div>
      <div className="bg-[color:var(--sh-black)] px-4 pb-6">
        <ProfessionSwitch
          className="flex flex-wrap justify-center gap-x-8 gap-y-4 sm:gap-x-16"
          label={navigation.profession}
          renderOption={(option) => <Lever option={option} pulling={pulling === option.id} onPull={() => pull(option)} />}
        />
        <p className="mt-4 text-center text-sm italic tracking-wider text-[color:var(--sh-muted)]">{words.leverHint}</p>
      </div>
    </section>
  )
}
