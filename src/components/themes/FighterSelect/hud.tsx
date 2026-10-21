'use client'

import type { ReactNode } from 'react'
import { ScrollScene } from '@/components/scroll/ScrollScene'
import { KoBadge } from './badges'
import look from './world.module.css'
import fight from './fight.module.css'

// The match HUD pieces the fight scenes share, and the cue that plays them.
// - Cue: the shared ScrollScene with its reveal off. Its data-scene-phase leaves idle once the scene is
//   armed in view, and fight.module.css plays everything under it once from there (reduced motion and
//   World Select previews start done, so the final frame shows at once).
// - LifeBar: player one's bar on the left draining toward the centre, player two's on the right; the
//   flat yellow of what is left over the red of what is lost, in a thin black and white rule, the name
//   or number under it on the outer edge in the HUD's condensed capitals.
// - RoundPip: the red KO badge shape in the middle of the HUD carrying the round number.
// - HudCentre: the KO badge with whatever stands under it (the clock), the centre of the fight HUD.

export function Cue({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <ScrollScene reveal={false} className={`${fight.cue} ${className}`}>
      {children}
    </ScrollScene>
  )
}

// The --i variable a staggered piece reads for its delay, as literal classes for the build.
const STAGGER = ['[--i:0]', '[--i:1]', '[--i:2]', '[--i:3]', '[--i:4]', '[--i:5]', '[--i:6]', '[--i:7]']
export const staggerAt = (index: number) => STAGGER[Math.min(index, STAGGER.length - 1)]

export type Side = 'p1' | 'p2'

const SIDE_LOOK: Record<Side, { fill: string; label: string }> = {
  p1: { fill: fight.barFill, label: 'text-left' },
  p2: { fill: fight.barFillRight, label: 'text-right' },
}

interface LifeBarProps {
  side: Side
  label: ReactNode
  // An empty bar is a slot nobody holds yet: only the red track shows.
  empty?: boolean
  delay?: string
}

export function LifeBar({ side, label, empty = false, delay = '' }: LifeBarProps) {
  const { fill, label: align } = SIDE_LOOK[side]

  return (
    <div className="min-w-0 flex-1">
      <div className="h-4 overflow-hidden border-2 border-black bg-[color:var(--fs-hud-red)] shadow-[0_0_0_1px_#fff] sm:h-5" aria-hidden="true">
        {!empty && <div className={`h-full border-b-4 border-[color:var(--fs-call-bottom)] bg-[color:var(--fs-hud-yellow)] ${fill} ${delay}`} />}
      </div>
      <p className={`mt-1.5 truncate text-sm uppercase text-white [text-shadow:2px_2px_0_var(--fs-navy)] ${look.display} ${align}`}>{label}</p>
    </div>
  )
}

export function RoundPip({ children }: { children: ReactNode }) {
  return (
    <span className={`grid h-8 min-w-11 shrink-0 place-items-center border-2 border-white bg-[color:var(--fs-ko)] px-1 text-lg leading-none text-white shadow-[0_0_0_2px_#000] ${look.display}`}>
      {children}
    </span>
  )
}

export function HudCentre({ children }: { children?: ReactNode }) {
  return (
    <span className="-mt-1 flex shrink-0 flex-col items-center gap-1" aria-hidden="true">
      <KoBadge />
      {children}
    </span>
  )
}
