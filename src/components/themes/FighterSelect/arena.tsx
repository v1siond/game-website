'use client'

import type { CSSProperties } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { Fighter } from './fighter'
import { useMoves } from './moves'
import type { FighterPose } from './poses'

// His fighter on a stage the visitor can play with: the stage is split in three, and the pointer entering
// the left third walks him back a step, the right third walks him forward a step (he keeps facing the
// opponent, as fighters do), and the middle (or a tap) throws his next special in turn: the ki blast, the
// rising uppercut, the spinning kick. Steps slide him along the floor while the walk frames play.

const STEP = '[transform:translateX(calc(var(--step)*14%))]'

interface ArenaFighterProps {
  profession: Profession
  rest: FighterPose
  intro?: FighterPose
  // Places him on the stage (absolute position and enter animation classes).
  className?: string
  spriteClass: string
}

export function ArenaFighter({ profession, rest, intro, className = '', spriteClass }: ArenaFighterProps) {
  const { pose, step, special, walk, end } = useMoves(rest, intro ?? null)

  return (
    <>
      <div className="absolute inset-0 z-10 grid grid-cols-3" aria-hidden="true">
        <div onPointerEnter={() => walk(-1)} />
        <div onPointerEnter={special} onPointerDown={special} />
        <div onPointerEnter={() => walk(1)} />
      </div>
      <div className={className}>
        <div className={`${STEP} transition-transform duration-[600ms] ease-linear motion-reduce:transition-none`} style={{ '--step': step } as CSSProperties}>
          <Fighter profession={profession} pose={pose} className={spriteClass} onMoveEnd={end} />
        </div>
      </div>
    </>
  )
}
