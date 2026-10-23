'use client'

import type { ReactNode } from 'react'
import { usePoseSequence } from '@/hooks/usePoseSequence'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { HeroCharacter, type HeroPose } from './cup'
import { HOSE } from './palette'
import g from './gags.module.css'

// Two sections he knocks into the show, each a move of the 1930s run and gun:
// - Finger gun (services): he runs in and fires from his finger; the posters pop into place on the
//   first hit, a rubbery overshoot, and jump again on the next.
// - Parry (featured work): he runs in and jumps at the board's corner; the slap lands on a pink star,
//   the board squashes and springs back and the star bursts.
//
// Pattern: the shared usePoseSequence plays run, the act (shoot or the jump) and leave once the section
// is in view (useSectionTrigger, so it plays once); every beat ends on the figure wrapper's own
// animationend. The section's reaction is one CSS keyframe from the act on that ends at the section's own
// place and look (gags.module.css), in the cartoon's bouncy ease. Timing: run 500 ms, shoot 820 ms (two
// shots, the posters pop 150 to 600 ms in) or the jump 600 ms (the slap lands 300 ms in, the board settles
// 450 ms after), leave 520 ms. Reduced motion: no figure and no star, the section rests in place.

type Beat = 'run' | 'act' | 'leave' | 'gone' | 'still'

const ENTRANCE: readonly Beat[] = ['run', 'act', 'leave']

interface GagProps {
  children: ReactNode
  act: Extract<HeroPose, 'shoot' | 'cheer'>
  /** The section's reaction, a class of gags.module.css. */
  reaction: string
  prop?: ReactNode
}

function Gag({ children, act, reaction, prop }: GagProps) {
  const { ref, triggered } = useSectionTrigger({ threshold: 0.2 })
  const { pose, onOwnAnimationEnd } = usePoseSequence<Beat>({ entrance: ENTRANCE, rest: 'gone', still: 'still' })
  const shown = pose === 'run' || pose === 'act' || pose === 'leave'
  const heroPose: HeroPose = pose === 'act' ? act : 'run'

  return (
    <div ref={ref} className={`relative ${g.stage}`} data-on={triggered || undefined} data-beat={pose} data-act={act}>
      <div className={`relative ${reaction}`}>
        {children}
        {prop}
      </div>
      {triggered && shown && (
        <div className={`pointer-events-none absolute left-0 z-30 h-36 w-24 ${act === 'cheer' ? 'top-0' : 'bottom-0'} ${g.figure}`} onAnimationEnd={onOwnAnimationEnd} aria-hidden="true">
          <HeroCharacter profession="engineer" pose={heroPose} className="h-full w-full" />
        </div>
      )}
    </div>
  )
}

/** Services: popped into place by the finger gun. */
export function FingerGunPop({ children }: { children: ReactNode }) {
  return (
    <Gag act="shoot" reaction={g.popped}>
      {children}
    </Gag>
  )
}

// The pink parry star on the board's corner, burst by the slap and gone after.
const PARRY_STAR = (
  <svg viewBox="0 0 30 30" className={`pointer-events-none absolute -top-4 left-16 h-12 w-12 ${g.star}`} aria-hidden="true" focusable="false">
    <path d="M15 1 L19 10 L29 11 L21 18 L24 28 L15 22 L6 28 L9 18 L1 11 L11 10 Z" fill={HOSE.parry} stroke={HOSE.ink} strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
)

/** Featured Work: the board bounced by his parry slap. */
export function ParrySlap({ children }: { children: ReactNode }) {
  return (
    <Gag act="cheer" reaction={g.parried} prop={PARRY_STAR}>
      {children}
    </Gag>
  )
}
