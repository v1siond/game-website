import { PORTAL } from './palette'

// The pickups and rewards of the time travel platformer (Warped, named in code only), drawn in its
// chunky, lit-from-the-top look: the two lobed fruit with its leaf, the cut gem, the long crystal, the
// stepped time relic in its three metals, the time trial stopwatch and the small floating mask for the
// score bar. Their gradients live once in PickupDefs, set on the world's root.

interface ArtProps {
  className?: string
}

export type GemTone = 'clear' | 'blue' | 'green' | 'violet' | 'gold' | 'red'
export type RelicTone = 'sapphire' | 'gold' | 'platinum'

const GEM_STOPS: Record<GemTone, readonly [string, string, string]> = {
  clear: [PORTAL.WHITE, PORTAL.GEM, '#5aa9c9'],
  blue: ['#bfe3ff', PORTAL.BLUE, PORTAL.BLUE_DEEP],
  green: ['#d6ffd2', PORTAL.GREEN, PORTAL.LEAF_DARK],
  violet: ['#f1ddff', PORTAL.VIOLET, '#5b2a9e'],
  gold: ['#fff4c4', PORTAL.GOLD, PORTAL.BRASS_DARK],
  red: ['#ffd1c4', PORTAL.FRUIT_RED, PORTAL.FRUIT_DEEP],
}

const RELIC_STOPS: Record<RelicTone, readonly [string, string, string]> = {
  sapphire: ['#c9d8ff', PORTAL.SAPPHIRE, '#16267a'],
  gold: ['#fff1b8', PORTAL.GOLD, PORTAL.BRASS_DARK],
  platinum: [PORTAL.WHITE, PORTAL.PLATINUM, '#7d8796'],
}

function Ramp({ id, stops, vertical = true }: { id: string; stops: readonly [string, string, string]; vertical?: boolean }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2={vertical ? 0 : 1} y2={vertical ? 1 : 1}>
      <stop offset="0" stopColor={stops[0]} />
      <stop offset="0.45" stopColor={stops[1]} />
      <stop offset="1" stopColor={stops[2]} />
    </linearGradient>
  )
}

/** The gradients every pickup (and the level pad of pad.tsx) reads, set once on the world's root. */
export function PickupDefs() {
  return (
    <svg className="absolute h-0 w-0" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="npw-fruit" cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor={PORTAL.GOLD} />
          <stop offset="0.35" stopColor={PORTAL.ORANGE} />
          <stop offset="0.75" stopColor={PORTAL.FRUIT_RED} />
          <stop offset="1" stopColor={PORTAL.FRUIT_DEEP} />
        </radialGradient>
        <linearGradient id="npw-leaf" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={PORTAL.GREEN} />
          <stop offset="1" stopColor={PORTAL.LEAF_DARK} />
        </linearGradient>
        {Object.entries(GEM_STOPS).map(([tone, stops]) => (
          <Ramp key={tone} id={`npw-gem-${tone}`} stops={stops} vertical={false} />
        ))}
        {Object.entries(RELIC_STOPS).map(([tone, stops]) => (
          <Ramp key={tone} id={`npw-relic-${tone}`} stops={stops} />
        ))}
        <linearGradient id="npw-crystal" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffc2f0" />
          <stop offset="0.5" stopColor={PORTAL.CRYSTAL} />
          <stop offset="1" stopColor={PORTAL.CRYSTAL_DEEP} />
        </linearGradient>
        <linearGradient id="npw-mask" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={PORTAL.MASK_LIT} />
          <stop offset="0.6" stopColor={PORTAL.MASK_WOOD} />
          <stop offset="1" stopColor={PORTAL.MASK_DARK} />
        </linearGradient>
        <radialGradient id="npw-clock" cx="0.4" cy="0.35" r="0.7">
          <stop offset="0" stopColor={PORTAL.WHITE} />
          <stop offset="0.7" stopColor="#fff1b8" />
          <stop offset="1" stopColor={PORTAL.GOLD} />
        </radialGradient>
        <radialGradient id="npw-pad" cx="0.38" cy="0.3" r="0.75">
          <stop offset="0" stopColor={PORTAL.PAD_LIT} />
          <stop offset="0.45" stopColor={PORTAL.PAD} />
          <stop offset="1" stopColor={PORTAL.PAD_DARK} />
        </radialGradient>
      </defs>
    </svg>
  )
}

/** The fruit: two lobes and a crease, lit from the top left, a leaf on its stalk. */
export function Fruit({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true" focusable="false">
      <path d="M20 9 C9 6 3 15 5 24 C7 33 15 37 20 34 C25 37 33 33 35 24 C37 15 31 6 20 9 Z" fill="url(#npw-fruit)" stroke={PORTAL.FRUIT_DEEP} strokeWidth="1.6" />
      <path d="M20 10 C18 18 18 27 20 34" fill="none" stroke={PORTAL.FRUIT_DEEP} strokeWidth="1.4" opacity="0.7" />
      <ellipse cx="12.5" cy="16" rx="3.6" ry="2.4" fill={PORTAL.WHITE} opacity="0.7" transform="rotate(-30 12.5 16)" />
      <path d="M20 10 L21 4" stroke={PORTAL.BAND} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M21 5 C25 1 31 2 32 5 C28 8 24 8 21 5 Z" fill="url(#npw-leaf)" stroke={PORTAL.LEAF_DARK} strokeWidth="0.8" />
    </svg>
  )
}

/** A cut gem: a flat table, the crown facets, a long point below. */
export function Gem({ className, tone = 'clear' }: ArtProps & { tone?: GemTone }) {
  return (
    <svg viewBox="0 0 40 48" className={className} aria-hidden="true" focusable="false">
      <path d="M10 6 H30 L38 17 L20 46 L2 17 Z" fill={`url(#npw-gem-${tone})`} stroke={PORTAL.VOID} strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M2 17 H38 M10 6 L15 17 L20 6 L25 17 L30 6 M15 17 L20 46 L25 17" fill="none" stroke={PORTAL.VOID} strokeWidth="0.9" opacity="0.55" />
      <path d="M11 8 L14 15 L7 15 Z" fill={PORTAL.WHITE} opacity="0.75" />
    </svg>
  )
}

/** The crystal: long and thin, six faces, pointed at both ends. */
export function Crystal({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 30 64" className={className} aria-hidden="true" focusable="false">
      <path d="M15 1 L27 16 L27 46 L15 63 L3 46 L3 16 Z" fill="url(#npw-crystal)" stroke={PORTAL.CRYSTAL_DEEP} strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M15 1 L15 63 M3 16 L15 22 L27 16 M3 46 L15 42 L27 46" fill="none" stroke={PORTAL.CRYSTAL_DEEP} strokeWidth="0.8" opacity="0.6" />
      <path d="M6 18 L12 21 L12 40 L6 43 Z" fill={PORTAL.WHITE} opacity="0.45" />
    </svg>
  )
}

/** The time relic: an ankh holding a red hex gem in its loop, on a round base, in sapphire, gold or platinum. */
export function Relic({ className, tone = 'gold' }: ArtProps & { tone?: RelicTone }) {
  const fill = `url(#npw-relic-${tone})`
  return (
    <svg viewBox="0 0 44 48" className={className} aria-hidden="true" focusable="false">
      <ellipse cx="22" cy="43" rx="16" ry="4.5" fill={fill} stroke={PORTAL.VOID} strokeWidth="1.4" />
      <path d="M17.6 25 L15.4 41 H28.6 L26.4 25 Z" fill={fill} stroke={PORTAL.VOID} strokeWidth="1.4" strokeLinejoin="round" />
      <rect x="5" y="20" width="34" height="6.4" rx="2.4" fill={fill} stroke={PORTAL.VOID} strokeWidth="1.4" />
      <path
        d="M12 12 A10 12 0 1 1 32 12 A10 12 0 1 1 12 12 Z M16.4 12 A5.6 7.6 0 1 0 27.6 12 A5.6 7.6 0 1 0 16.4 12 Z"
        fill={fill}
        fillRule="evenodd"
        stroke={PORTAL.VOID}
        strokeWidth="1.4"
      />
      <path d="M22 6.6 L26.6 9.3 V14.7 L22 17.4 L17.4 14.7 V9.3 Z" fill={PORTAL.FRUIT_RED} stroke={PORTAL.FRUIT_DEEP} strokeWidth="1" strokeLinejoin="round" />
      <path d="M22 6.6 L26.6 9.3 L22 12 L17.4 9.3 Z" fill={PORTAL.WHITE} opacity="0.35" />
      <path d="M14 7 Q16 2.4 21 1.6 M8 22 H16" stroke={PORTAL.WHITE} strokeWidth="1.2" strokeLinecap="round" opacity="0.6" fill="none" />
    </svg>
  )
}

/** The time trial stopwatch: a yellow octagon round a light face, the crown and the two hands. */
export function Stopwatch({ className, hand = '' }: ArtProps & { hand?: string }) {
  return (
    <svg viewBox="0 0 40 46" className={className} aria-hidden="true" focusable="false">
      <rect x="16" y="1" width="8" height="5" rx="1.5" fill={PORTAL.BRASS} stroke={PORTAL.VOID} strokeWidth="1.2" />
      <path d="M30 8 L34 4" stroke={PORTAL.VOID} strokeWidth="3" strokeLinecap="round" />
      <path d="M26.9 9.4 L36.6 19.1 V32.9 L26.9 42.6 H13.1 L3.4 32.9 V19.1 L13.1 9.4 Z" fill={PORTAL.CLOCK} stroke={PORTAL.VOID} strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="20" cy="26" r="14.5" fill="url(#npw-clock)" />
      {[0, 90, 180, 270].map((turn) => (
        <rect key={turn} x="19" y="12.5" width="2" height="3.5" fill={PORTAL.VOID} transform={`rotate(${turn} 20 26)`} />
      ))}
      <g className={hand}>
        <path d="M20 26 L20 14.5" stroke={PORTAL.TNT} strokeWidth="2" strokeLinecap="round" />
      </g>
      <path d="M20 26 L27 30" stroke={PORTAL.VOID} strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="20" cy="26" r="2" fill={PORTAL.VOID} />
    </svg>
  )
}

const FEATHER_TONES = [PORTAL.BLUE, PORTAL.GOLD, PORTAL.ORANGE, PORTAL.CRYSTAL] as const

// Feathers fanned over the brow, leftmost first, as [base x, tip x, tip y].
const FEATHERS = [
  [12, 5, 4],
  [17, 14, -1],
  [23, 26, -1],
  [28, 35, 4],
] as const

/**
 * The floating mask: a long carved wooden face with a heavy brow, round orange eyes rimmed in lime, a wide lipped
 * grin and four feathers (blue, yellow, orange, magenta). `feathers` sets how many show (the mask grows them as he takes
 * more masks).
 */
export function MaskFace({ className, feathers = 5, gold = false }: ArtProps & { feathers?: number; gold?: boolean }) {
  const wood = gold ? `url(#npw-gem-gold)` : 'url(#npw-mask)'
  return (
    <svg viewBox="-2 -4 44 64" className={className} aria-hidden="true" focusable="false">
      {FEATHERS.slice(0, feathers).map(([base, tipX, tipY], i) => (
        <path
          key={base}
          d={`M${base} 14 Q${(base + tipX) / 2 - 3} ${(14 + tipY) / 2} ${tipX} ${tipY} Q${(base + tipX) / 2 + 3} ${(14 + tipY) / 2 + 2} ${base + 2} 14 Z`}
          fill={FEATHER_TONES[i]}
          stroke={PORTAL.VOID}
          strokeWidth="0.8"
        />
      ))}
      <path d="M8 12 Q20 6 32 12 L34 30 Q33 46 26 56 Q20 59 14 56 Q7 46 6 30 Z" fill={wood} stroke={PORTAL.VOID} strokeWidth="1.6" />
      <path d="M8 18 Q20 13 32 18 L32 21 Q20 17 8 21 Z" fill={PORTAL.MASK_DARK} />
      <path d="M10 13 Q14 11 16 12" stroke={PORTAL.MASK_LIT} strokeWidth="1.2" fill="none" />
      <ellipse cx="14" cy="27" rx="4.6" ry="5.4" fill={PORTAL.ORANGE} stroke={PORTAL.GREEN} strokeWidth="1.4" />
      <ellipse cx="26" cy="27" rx="4.6" ry="5.4" fill={PORTAL.ORANGE} stroke={PORTAL.GREEN} strokeWidth="1.4" />
      <circle cx="15" cy="28" r="2.2" fill={PORTAL.VOID} />
      <circle cx="25" cy="28" r="2.2" fill={PORTAL.VOID} />
      <path d="M19 30 L18 37 Q20 39 22 37 L21 30" fill={PORTAL.MASK_DARK} />
      <path d="M10 41 Q20 49 30 41 Q28 52 20 52 Q12 52 10 41 Z" fill={PORTAL.MASK_LIP} stroke={PORTAL.VOID} strokeWidth="1.2" />
      <path d="M13 43 Q20 48 27 43 L26 46 Q20 50 14 46 Z" fill={PORTAL.TOOTH} />
      <path d="M7 32 L10 34 M33 32 L30 34 M9 37 L12 38 M31 37 L28 38" stroke={PORTAL.GREEN} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}
