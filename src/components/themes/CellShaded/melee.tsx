'use client'

import type { ReactNode } from 'react'
import { SectionCameo } from '../shared/SectionCameo'
import { VaultSprite, type SpriteMotion } from './sprite'
import { CEL } from './palette'
import m from './melee.module.css'

// Two sections he hits into place, the looter shooter's own way:
// - Slam (about): he runs in, leaps and comes down on the paper's corner in a ground slam; the paper
//   shows squashed under him, springs back with a two beat shake and a white impact burst at his feet.
// - Loot chest (services): he runs in to a red ammo chest and kicks it; the lid flips open and the
//   services spring up out of it like a loot drop and settle.
//
// Pattern: the shared SectionCameo plays run, the strike (leap or kick) and leave once the section is in
// view; every beat ends on the figure wrapper's own animationend. The section's reaction is one CSS
// keyframe that ends at the section's own place and look (melee.module.css). Timing: run 450 ms, leap
// 500 ms (the paper lands as it ends) or kick 480 ms (the lid opens 240 ms in, the services spring out
// over the next 520 ms), leave 520 ms. Reduced motion: no figure and no chest, the section rests in place
// from the start.

type Beat = 'run' | 'strike' | 'leave'

const BEATS: readonly Beat[] = ['run', 'strike', 'leave']

interface MeleeProps {
  children: ReactNode
  strike: Extract<SpriteMotion, 'leap' | 'kick'>
  /** The section's reaction, a class of melee.module.css. */
  reaction: string
  /** Beside him on the stage while he is there (the chest he kicks). */
  aside?: ReactNode
}

function Melee({ children, strike, reaction, aside }: MeleeProps) {
  const fighter = (beat: Beat) => (
    <>
      <VaultSprite profession="engineer" motion={beat === 'strike' ? strike : 'run'} className="h-full w-full" />
      <span className={`absolute -bottom-2 left-1/2 h-6 w-28 -translate-x-1/2 ${m.burst}`} />
    </>
  )

  return (
    <SectionCameo
      beats={BEATS}
      threshold={0.3}
      stage={m.stage}
      mark={{ 'data-strike': strike }}
      reaction={reaction}
      place={`bottom-0 left-0 h-32 w-20 ${m.figure}`}
      figure={fighter}
      aside={aside}
    >
      {children}
    </SectionCameo>
  )
}

/** About: the paper slammed into place. */
export function SlamLanding({ children }: { children: ReactNode }) {
  return (
    <Melee strike="leap" reaction={m.slammed}>
      {children}
    </Melee>
  )
}

// The red ammo chest the services jump out of, inked like everything else; its lid hinges at the back.
const CHEST = (
  <svg viewBox="0 0 80 50" className={`pointer-events-none absolute bottom-0 left-16 z-20 h-14 w-24 ${m.chest}`} aria-hidden="true" focusable="false">
    <rect x="6" y="22" width="68" height="26" fill={CEL.red} stroke={CEL.ink} strokeWidth="3" />
    <rect x="34" y="26" width="12" height="10" fill={CEL.sun} stroke={CEL.ink} strokeWidth="2" />
    <g className={m.lid}>
      <path d="M4 22 L4 12 Q40 2 76 12 L76 22 Z" fill={CEL.red} stroke={CEL.ink} strokeWidth="3" />
      <path d="M20 9 L20 22 M60 9 L60 22" stroke={CEL.ink} strokeWidth="2" />
    </g>
  </svg>
)

/** Services: kicked out of the loot chest. */
export function LootChest({ children }: { children: ReactNode }) {
  return (
    <Melee strike="kick" reaction={m.looted} aside={CHEST}>
      {children}
    </Melee>
  )
}
