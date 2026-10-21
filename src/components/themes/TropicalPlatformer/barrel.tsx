import type { ReactNode } from 'react'
import { COLORS as C } from './palette'

// The jungle's barrel, drawn once and used by every machine of the world: the tree house cannon in the
// hero, the partner barrel of the profession switch, the job cannons and the target barrel of the Muay
// Thai record. Rounded staves lit from the upper left and two steel hoops, the shaded, rendered look of
// the source's pre rendered sprites. The mouth is at the top of the 60 by 72 box, so a cannon aims by
// rotating the drawing around its centre.
//
// JungleDefs holds the gradients every jungle drawing fills from; the world's root draws it once.

export function JungleDefs() {
  return (
    <svg className="absolute h-0 w-0" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="tp-wood" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={C.barkDark} />
          <stop offset="0.22" stopColor={C.plank} />
          <stop offset="0.45" stopColor={C.plankLight} />
          <stop offset="0.75" stopColor={C.bark} />
          <stop offset="1" stopColor={C.barkDark} />
        </linearGradient>
        <linearGradient id="tp-hoop" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={C.hoop} />
          <stop offset="0.4" stopColor={C.hoopLight} />
          <stop offset="1" stopColor={C.hoop} />
        </linearGradient>
        <radialGradient id="tp-sun" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={C.sunCore} />
          <stop offset="0.35" stopColor={C.sunGold} />
          <stop offset="1" stopColor={C.sunsetOrange} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="tp-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.dusk} />
          <stop offset="0.35" stopColor={C.sunsetRed} />
          <stop offset="0.65" stopColor={C.sunsetOrange} />
          <stop offset="0.9" stopColor={C.sunGold} />
        </linearGradient>
        <linearGradient id="tp-leaf" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.fern} />
          <stop offset="1" stopColor={C.moss} />
        </linearGradient>
      </defs>
    </svg>
  )
}

export type BarrelMark = 'burst' | 'plain'

// The white outline of a burst, the blast barrel's mark.
const BURST =
  'M30 25 L33 32 L40 29 L36 36 L43 39 L36 41 L39 48 L32 44 L30 51 L28 44 L21 48 L24 41 L17 39 L24 36 L20 29 L27 32 Z'

const MARKS: Record<BarrelMark, ReactNode> = {
  burst: <path d={BURST} fill="none" stroke={C.burst} strokeWidth="2" strokeLinejoin="round" />,
  plain: null,
}

interface BarrelArtProps {
  mark?: BarrelMark
  className?: string
  // What sits in the mouth (him peeking out of a cannon), drawn under the rim.
  inside?: ReactNode
}

export function BarrelArt({ mark = 'burst', className = '', inside = null }: BarrelArtProps) {
  return (
    <svg viewBox="0 0 60 72" className={className} aria-hidden="true" focusable="false">
      <ellipse cx="30" cy="10" rx="22" ry="6.5" fill={C.shadow} />
      {inside}
      <path d="M8 10 Q2 36 8 62 Q30 70 52 62 Q58 36 52 10 Q30 16 8 10 Z" fill="url(#tp-wood)" />
      <path d="M18 13 Q13 38 18 66 M30 14 V69 M42 13 Q47 38 42 66" fill="none" stroke={C.barkDark} strokeWidth="1.2" opacity="0.5" />
      <path d="M11 16 Q8 36 11 56" fill="none" stroke={C.plankLight} strokeWidth="2.5" opacity="0.45" strokeLinecap="round" />
      <path d="M5.5 22 Q30 30 54.5 22" fill="none" stroke="url(#tp-hoop)" strokeWidth="4.5" />
      <path d="M5.5 52 Q30 60 54.5 52" fill="none" stroke="url(#tp-hoop)" strokeWidth="4.5" />
      {MARKS[mark]}
      <ellipse cx="30" cy="10" rx="22" ry="6.5" fill="none" stroke={C.bark} strokeWidth="3" />
      <ellipse cx="30" cy="10" rx="22" ry="6.5" fill="none" stroke="url(#tp-hoop)" strokeWidth="1.5" />
    </svg>
  )
}

/** The white flash a cannon fires with, a star of rays drawn around the mouth. */
export function MuzzleBurst({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true" focusable="false">
      <path d="M20 0 L24 14 L38 8 L28 20 L40 26 L25 26 L26 40 L20 29 L12 40 L14 26 L0 26 L12 19 L4 6 L17 14 Z" fill={C.burst} />
      <circle cx="20" cy="22" r="6" fill={C.sunGold} />
    </svg>
  )
}
