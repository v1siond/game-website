import type { SVGProps } from 'react'
import { PORTAL } from './palette'

// The world's drawn objects, each lit from above with the gradients in WarpDefs (rendered once on the
// root, so a hundred crates share one set of gradient ids): the fruit, the wooden crate and the shards it
// breaks into, the gem, the crystal, the warp swirl and the stone arch round it.

type ArtProps = { className?: string }

const svgProps = (className = ''): SVGProps<SVGSVGElement> => ({ className, 'aria-hidden': true, focusable: false })

/** Every gradient the art uses, once per page. */
export function WarpDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="np-fruit" cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#ffd28a" />
          <stop offset="0.35" stopColor={PORTAL.ORANGE} />
          <stop offset="1" stopColor={PORTAL.FRUIT_RED} />
        </radialGradient>
        <linearGradient id="np-plank" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f2c27e" />
          <stop offset="0.5" stopColor={PORTAL.PLANK} />
          <stop offset="1" stopColor={PORTAL.PLANK_DARK} />
        </linearGradient>
        <linearGradient id="np-gem" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.45" stopColor={PORTAL.GEM} />
          <stop offset="1" stopColor="#3aa7c9" />
        </linearGradient>
        <linearGradient id="np-crystal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffd6f4" />
          <stop offset="0.5" stopColor={PORTAL.CRYSTAL} />
          <stop offset="1" stopColor="#8a1f73" />
        </linearGradient>
        <linearGradient id="np-stone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={PORTAL.STONE_LIT} />
          <stop offset="0.6" stopColor={PORTAL.STONE} />
          <stop offset="1" stopColor={PORTAL.STONE_DARK} />
        </linearGradient>
        <radialGradient id="np-pad" cx="0.5" cy="0.4" r="0.6">
          <stop offset="0" stopColor={PORTAL.STONE_LIT} />
          <stop offset="1" stopColor={PORTAL.STONE_DARK} />
        </radialGradient>
        {(['BLUE', 'VIOLET', 'GREEN', 'ORANGE'] as const).map((tone) => (
          <radialGradient key={tone} id={`np-swirl-${tone}`} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="0.3" stopColor={PORTAL[tone]} />
            <stop offset="1" stopColor={PORTAL.VOID} />
          </radialGradient>
        ))}
      </defs>
    </svg>
  )
}

/** The round fruit with its leaf tuft, the thing a level is full of. */
export function Fruit({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 32 32" {...svgProps(className)}>
      <ellipse cx="16" cy="18" rx="11" ry="10" fill="url(#np-fruit)" stroke="#7a2306" strokeWidth="1.2" />
      <path d="M16 9 Q13 3 8 4 Q11 8 16 9 Q19 3 24 3 Q21 8 16 9" fill={PORTAL.LEAF} stroke="#1f5a14" strokeWidth="0.8" />
      <ellipse cx="12" cy="14" rx="3" ry="2" fill="#fff4d6" opacity="0.7" />
    </svg>
  )
}

/** A fruit already taken: the dashed outline it leaves behind. */
export function FruitGhost({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 32 32" {...svgProps(className)}>
      <ellipse cx="16" cy="18" rx="10" ry="9" fill="none" stroke={PORTAL.MUTED} strokeWidth="1.4" strokeDasharray="3 3" />
    </svg>
  )
}

/** The wooden crate: two lit planks a face, dark corner bands and the cross brace. */
export function Crate({ className, mark = false }: ArtProps & { mark?: boolean }) {
  return (
    <svg viewBox="0 0 64 64" {...svgProps(className)}>
      <rect x="2" y="2" width="60" height="60" rx="3" fill="url(#np-plank)" stroke={PORTAL.BAND} strokeWidth="2.5" />
      <path d="M4 22 H60 M4 42 H60" stroke={PORTAL.PLANK_DARK} strokeWidth="1.5" />
      <path d="M10 10 L54 54 M54 10 L10 54" stroke={PORTAL.BAND} strokeWidth="4" strokeLinecap="round" opacity={mark ? 0 : 0.9} />
      {mark && (
        <>
          <path d="M23 24 Q23 13 32 13 Q41 13 41 21 Q41 27 35 30 Q32 32 32 37" fill="none" stroke={PORTAL.BAND} strokeWidth="6" strokeLinecap="round" />
          <circle cx="32" cy="47" r="4" fill={PORTAL.BAND} />
        </>
      )}
      {[
        [2, 2],
        [50, 2],
        [2, 50],
        [50, 50],
      ].map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="12" height="12" rx="2" fill={PORTAL.BAND} />
      ))}
      <rect x="2" y="2" width="60" height="5" rx="2" fill="#ffffff" opacity="0.18" />
    </svg>
  )
}

// The pieces a crate breaks into, each a splinter of plank in a 40 by 16 box.
export const SHARD_SHAPES = [
  'M0 4 L34 0 L40 8 L30 16 L2 13 Z',
  'M0 2 L26 0 L38 6 L36 14 L4 16 Z',
  'M2 0 L40 3 L36 12 L18 16 L0 10 Z',
  'M0 6 L14 0 L40 2 L34 14 L8 16 Z',
  'M0 0 L36 4 L40 14 L12 16 L4 10 Z',
  'M4 2 L30 0 L40 10 L26 16 L0 12 Z',
] as const

export function Shard({ d, className }: ArtProps & { d: string }) {
  return (
    <svg viewBox="0 0 40 16" {...svgProps(className)}>
      <path d={d} fill="url(#np-plank)" stroke={PORTAL.BAND} strokeWidth="1.5" />
    </svg>
  )
}

/** The cut gem: a crown of facets over a point, lit from the top left. */
export function Gem({ className, tone = 'url(#np-gem)' }: ArtProps & { tone?: string }) {
  return (
    <svg viewBox="0 0 40 48" {...svgProps(className)}>
      <path d="M8 4 H32 L40 16 L20 46 L0 16 Z" fill={tone} stroke="#0f3b4a" strokeWidth="1.4" />
      <path d="M0 16 H40 M8 4 L14 16 L20 46 L26 16 L32 4 M14 16 L20 4 L26 16" stroke="#ffffff" strokeWidth="1" fill="none" opacity="0.6" />
      <path d="M10 6 L14 14 L5 15 Z" fill="#ffffff" opacity="0.7" />
    </svg>
  )
}

/** The level's crystal: a long double point, the prize at the end of the page. */
export function Crystal({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 40 80" {...svgProps(className)}>
      <path d="M20 0 L36 26 L30 64 L20 80 L10 64 L4 26 Z" fill="url(#np-crystal)" stroke="#5a0f4a" strokeWidth="1.5" />
      <path d="M20 0 L20 80 M4 26 L20 34 L36 26 M10 64 L20 56 L30 64" stroke="#ffffff" strokeWidth="1" fill="none" opacity="0.55" />
      <path d="M12 20 L18 8 L18 30 Z" fill="#ffffff" opacity="0.6" />
    </svg>
  )
}

export type SwirlTone = 'BLUE' | 'VIOLET' | 'GREEN' | 'ORANGE'

/** The warp swirl: a lit core and four spiral arms. The arms turn as one group (the `arms` class). */
export function Swirl({ tone, className, arms = '' }: ArtProps & { tone: SwirlTone; arms?: string }) {
  return (
    <svg viewBox="0 0 100 100" {...svgProps(className)}>
      <circle cx="50" cy="50" r="50" fill={`url(#np-swirl-${tone})`} />
      <g className={arms}>
        {[0, 90, 180, 270].map((turn) => (
          <path
            key={turn}
            d="M50 50 Q62 30 50 12 Q40 0 24 6"
            transform={`rotate(${turn} 50 50)`}
            fill="none"
            stroke="#ffffff"
            strokeWidth="5"
            strokeLinecap="round"
            opacity="0.55"
          />
        ))}
        {[45, 135, 225, 315].map((turn) => (
          <path key={turn} d="M50 50 Q58 38 52 26" transform={`rotate(${turn} 50 50)`} fill="none" stroke={PORTAL[tone]} strokeWidth="4" strokeLinecap="round" />
        ))}
      </g>
    </svg>
  )
}

/** The carved stone arch round a warp swirl, with a keystone and two torches' worth of lit edge. */
export function StoneArch({ className, glow }: ArtProps & { glow: string }) {
  return (
    <svg viewBox="0 0 120 150" {...svgProps(className)}>
      <path d="M8 150 V58 A52 52 0 0 1 112 58 V150 H94 V60 A34 34 0 0 0 26 60 V150 Z" fill="url(#np-stone)" stroke={PORTAL.STONE_DARK} strokeWidth="2" />
      {[24, 48, 72, 96, 120].map((y) => (
        <g key={y}>
          <path d={`M8 ${y + 20} H26 M94 ${y + 20} H112`} stroke={PORTAL.STONE_DARK} strokeWidth="1.5" />
        </g>
      ))}
      <path d="M50 4 H70 L66 22 H54 Z" fill={PORTAL.STONE_LIT} stroke={PORTAL.STONE_DARK} strokeWidth="1.5" />
      <path d="M27 60 A33 33 0 0 1 93 60" fill="none" stroke={glow} strokeWidth="3" opacity="0.9" />
      <path d="M12 58 A48 48 0 0 1 60 10" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.25" />
    </svg>
  )
}

/** The round stone pad a portal stands on, seen from above at an angle. */
export function StonePad({ className, glow }: ArtProps & { glow: string }) {
  return (
    <svg viewBox="0 0 160 40" {...svgProps(className)}>
      <ellipse cx="80" cy="24" rx="78" ry="15" fill={PORTAL.STONE_DARK} />
      <ellipse cx="80" cy="18" rx="76" ry="14" fill="url(#np-pad)" stroke={PORTAL.STONE_DARK} strokeWidth="1.5" />
      <ellipse cx="80" cy="18" rx="52" ry="8" fill="none" stroke={glow} strokeWidth="2" opacity="0.8" />
      <path d="M30 14 L44 22 M116 22 L130 14 M80 5 V10" stroke={PORTAL.STONE_DARK} strokeWidth="1.2" />
    </svg>
  )
}
