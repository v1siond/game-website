'use client'

import type { ReactNode } from 'react'
import { ScrollScene } from '@/components/scroll/ScrollScene'
import look from './world.module.css'
import fight from './fight.module.css'

// The match HUD pieces the fight scenes share, and the cue that plays them.
// - Cue: the shared ScrollScene with its reveal off. Its data-scene-phase leaves idle once the scene is
//   armed in view, and fight.module.css plays everything under it once from there (reduced motion and
//   World Select previews start done, so the final frame shows at once).
// - LifeBar: player one's bar on the left draining toward the centre, player two's on the right; gold
//   for what is left over the red of what is lost, the name or number under it on the outer edge.
// - RoundPip: the gold diamond in the middle of the HUD carrying the round number.

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
      <div className="h-4 overflow-hidden border-2 border-[color:var(--fs-chrome)] bg-[color:var(--fs-p2)]" aria-hidden="true">
        {!empty && <div className={`h-full bg-[color:var(--fs-gold)] ${fill} ${delay}`} />}
      </div>
      <p className={`mt-1 truncate text-sm uppercase text-white ${look.display} ${align}`}>{label}</p>
    </div>
  )
}

export function RoundPip({ children }: { children: ReactNode }) {
  return (
    <span className="relative grid h-10 w-10 shrink-0 place-items-center">
      <span className="absolute inset-1 rotate-45 border-2 border-[color:var(--fs-ink)] bg-[color:var(--fs-gold)]" aria-hidden="true" />
      <span className={`relative text-base text-[color:var(--fs-ink)] ${look.display}`}>{children}</span>
    </span>
  )
}
