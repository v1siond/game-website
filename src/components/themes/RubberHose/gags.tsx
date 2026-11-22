'use client'

import type { ReactNode } from 'react'
import { SectionCameo } from '../shared/SectionCameo'
import { HeroCharacter, type HeroPose } from './cup'
import { HOSE } from './palette'
import g from './gags.module.css'

// Two sections he knocks into the show, each a move of the 1930s run and gun:
// - Finger gun (services): he runs in and fires from his finger; the posters pop into place on the
//   first hit, a rubbery overshoot, and jump again on the next.
// - Parry (featured work): he runs in and jumps at the board's corner; the slap lands on a pink star,
//   the board squashes and springs back and the star bursts.
//
// Pattern: the shared SectionCameo plays run, the act (shoot or the jump) and leave once the section is in
// view; every beat ends on the figure wrapper's own animationend. The section's reaction is one CSS
// keyframe from the act on that ends at the section's own place and look (gags.module.css), in the
// cartoon's bouncy ease. Timing: run 500 ms, shoot 820 ms (two shots, the posters pop 150 to 600 ms in) or
// the jump 600 ms (the slap lands 300 ms in, the board settles 450 ms after), leave 520 ms. Reduced
// motion: no figure and no star, the section rests in place.

type Beat = 'run' | 'act' | 'leave'

const BEATS: readonly Beat[] = ['run', 'act', 'leave']

type Act = Extract<HeroPose, 'shoot' | 'cheer'>

// He fires from the floor and jumps at the board's corner from its top.
const PLACE: Record<Act, string> = { shoot: 'bottom-0', cheer: 'top-0' }

interface GagProps {
  children: ReactNode
  act: Act
  /** The section's reaction, a class of gags.module.css. */
  reaction: string
  prop?: ReactNode
}

function Gag({ children, act, reaction, prop }: GagProps) {
  const hero = (beat: Beat) => <HeroCharacter profession="engineer" pose={beat === 'act' ? act : 'run'} className="h-full w-full" />

  return (
    <SectionCameo
      beats={BEATS}
      threshold={0.2}
      stage={g.stage}
      mark={{ 'data-act': act }}
      reaction={reaction}
      place={`left-0 h-36 w-24 ${PLACE[act]} ${g.figure}`}
      figure={hero}
      prop={prop}
    >
      {children}
    </SectionCameo>
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
