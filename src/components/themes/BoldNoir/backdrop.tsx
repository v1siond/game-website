import type { CSSProperties, ReactNode } from 'react'
import { NOIR } from './palette'
import world from './world.module.css'

// Bold Noir's static art, all flat fills: the star burst, the ransom note lettering, the glass star of the
// finish splash, and the night behind the page (a red slab cut across the dark, halftone dots, the burst
// turning slowly behind it, stickers and glass shards, a skyline of jagged towers at the foot). The back
// layers lean against the pointer through --mx and --my.

const RAYS = 18

/** A star burst of alternating ink and red rays, drawn in a 200 by 200 box round its centre. */
export function StarBurst({ className, light = NOIR.red, dark = NOIR.ink }: { className: string; light?: string; dark?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true" focusable="false">
      {Array.from({ length: RAYS }, (_, i) => {
        const from = (i / RAYS) * Math.PI * 2
        const to = ((i + 0.5) / RAYS) * Math.PI * 2
        const point = (angle: number) => `${100 + Math.cos(angle) * 140},${100 + Math.sin(angle) * 140}`
        return <polygon key={i} points={`100,100 ${point(from)} ${point(to)}`} fill={i % 2 ? dark : light} />
      })}
    </svg>
  )
}

/** A jagged star, the hit spark behind an achievement or a pick. */
export function HitStar({ className, fill = NOIR.red, edge = NOIR.paper }: { className: string; fill?: string; edge?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" focusable="false">
      <path
        d="M50 2 L60 32 L92 14 L72 44 L98 54 L68 62 L84 92 L54 72 L44 98 L38 68 L8 84 L26 56 L2 42 L32 38 L18 8 L44 30 Z"
        fill={fill}
        stroke={edge}
        strokeWidth={3}
        strokeLinejoin="miter"
      />
    </svg>
  )
}

// The cut of each letter by its place in the word: most are boxed in their own print, some are left bare
// so the word stays uneven; each sits at its own tilt, baseline and size.
const LETTER_LOOKS = [world.letterInk, world.letterPaper, world.letterRed, world.letterBare, world.letterPaper, world.letterInk, world.letterBare]
const LETTER_TILTS = [-6, 4, -3, 7, -8, 2, 5, -4, 3, -7, 6, -2]
const LETTER_DROPS = ['0em', '0.08em', '-0.06em', '0.12em', '-0.1em', '0.04em', '0.1em', '-0.04em']
const LETTER_SIZES = ['text-[1em]', 'text-[0.86em]', 'text-[1.12em]', 'text-[0.94em]', 'text-[1.06em]']

/** The star that fills a word gap in ransom lettering. */
function GapStar() {
  return (
    <svg viewBox="0 0 20 20" className="h-[0.45em] w-[0.45em] self-center" aria-hidden="true" focusable="false">
      <path d="M10 0 L12.6 7.4 L20 10 L12.6 12.6 L10 20 L7.4 12.6 L0 10 L7.4 7.4 Z" fill={NOIR.red} />
    </svg>
  )
}

/**
 * A word in ransom note lettering: letters cut from different prints, some boxed, some bare, a star in
 * each gap. The letters are hidden from screen readers; the word is read whole. Each letter carries --i
 * so a reveal can drop them in turn.
 */
export function RansomWord({ text, className = '', letterClassName = '' }: { text: string; className?: string; letterClassName?: string }) {
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="inline-flex flex-wrap items-end gap-x-1 gap-y-2">
        {text.split('').map((char, i) =>
          char === ' ' ? (
            <GapStar key={i} />
          ) : (
            <span
              key={i}
              className={`${world.letter} ${LETTER_LOOKS[i % LETTER_LOOKS.length]} ${LETTER_SIZES[i % LETTER_SIZES.length]} px-1.5 leading-none ${letterClassName}`}
              style={
                {
                  '--r': `${LETTER_TILTS[i % LETTER_TILTS.length]}deg`,
                  '--y': LETTER_DROPS[i % LETTER_DROPS.length],
                  '--i': i,
                } as CSSProperties
              }
            >
              {char}
            </span>
          ),
        )}
      </span>
    </span>
  )
}

/** A star burst with shattered glass across it, the splash behind the finish card. */
export function GlassStar({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true" focusable="false">
      <path
        d="M100 4 L122 70 L194 60 L136 104 L176 168 L108 132 L72 196 L70 124 L6 112 L64 82 L34 20 L92 58 Z"
        fill={NOIR.ink}
        stroke={NOIR.paper}
        strokeWidth={4}
        strokeLinejoin="miter"
      />
      <path d="M100 100 L122 70 M100 100 L136 104 M100 100 L108 132 M100 100 L70 124 M100 100 L64 82 M100 100 L92 58 M84 90 L76 72 M112 116 L130 126" stroke={NOIR.paper} strokeWidth={2} />
    </svg>
  )
}

// The stickers and glass shards pasted over the night (the branch motifs: stars, glass, cut-outs), placed
// in the 100 by 100 box of the backdrop.
const STICKERS = [
  { x: 8, y: 22, size: 7, rotate: -18, kind: 'star' },
  { x: 86, y: 58, size: 9, rotate: 14, kind: 'star' },
  { x: 72, y: 12, size: 5, rotate: 32, kind: 'shard' },
  { x: 14, y: 70, size: 6, rotate: -40, kind: 'shard' },
  { x: 48, y: 88, size: 4, rotate: 8, kind: 'star' },
  { x: 92, y: 32, size: 5, rotate: -12, kind: 'shard' },
] as const

const STICKER_DRAW: Record<(typeof STICKERS)[number]['kind'], (size: number) => ReactNode> = {
  star: (size) => (
    <path
      d={`M0 ${-size} L${size * 0.3} ${-size * 0.3} L${size} 0 L${size * 0.3} ${size * 0.3} L0 ${size} L${-size * 0.3} ${size * 0.3} L${-size} 0 L${-size * 0.3} ${-size * 0.3} Z`}
      fill={NOIR.paper}
      fillOpacity={0.16}
      stroke={NOIR.red}
      strokeOpacity={0.5}
      strokeWidth={0.4}
    />
  ),
  shard: (size) => (
    <polygon points={`${-size},${-size * 0.4} ${size * 0.6},${-size} ${size},${size * 0.7} ${-size * 0.2},${size * 0.4}`} fill="none" stroke={NOIR.paper} strokeOpacity={0.22} strokeWidth={0.35} />
  ),
}

function Stickers({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={className} aria-hidden="true" focusable="false">
      {STICKERS.map(({ x, y, size, rotate, kind }) => (
        <g key={`${x}-${y}`} transform={`translate(${x} ${y}) rotate(${rotate})`}>
          {STICKER_DRAW[kind](size)}
        </g>
      ))}
    </svg>
  )
}

// The jagged towers at the foot of the page, each top cut on a slant, in a 600 by 100 box.
const TOWERS = [
  { x: 0, w: 46, h: 48, cut: 10 },
  { x: 50, w: 34, h: 82, cut: -14 },
  { x: 88, w: 60, h: 40, cut: 8 },
  { x: 152, w: 38, h: 92, cut: 18 },
  { x: 194, w: 52, h: 60, cut: -10 },
  { x: 250, w: 30, h: 74, cut: 12 },
  { x: 284, w: 64, h: 46, cut: -8 },
  { x: 352, w: 40, h: 86, cut: -16 },
  { x: 396, w: 56, h: 54, cut: 10 },
  { x: 456, w: 36, h: 70, cut: -12 },
  { x: 496, w: 58, h: 44, cut: 14 },
  { x: 558, w: 42, h: 66, cut: -10 },
]

function JaggedSkyline({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 600 100" preserveAspectRatio="none" className={className} aria-hidden="true" focusable="false">
      {TOWERS.map(({ x, w, h, cut }) => {
        const top = 100 - h
        const left = cut > 0 ? top : top - cut
        const right = cut > 0 ? top + cut : top
        return (
          <g key={x}>
            <polygon points={`${x},100 ${x},${left} ${x + w},${right} ${x + w},100`} fill={NOIR.ink} />
            <rect x={x + w * 0.3} y={Math.max(left, right) + 8} width={4} height={6} fill={NOIR.red} />
          </g>
        )
      })}
    </svg>
  )
}

export function NoirBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className={`absolute -right-[30vmax] -top-[30vmax] h-[90vmax] w-[90vmax] opacity-25 ${world.follow}`}>
        <StarBurst className={`h-full w-full ${world.spin}`} light={NOIR.redDeep} dark={NOIR.ink} />
      </div>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={`absolute inset-0 h-full w-full ${world.followSoft}`}>
        <polygon points="0,0 58,0 18,100 0,100" fill={NOIR.redDeep} fillOpacity={0.55} />
        <polygon points="58,0 63,0 23,100 18,100" fill={NOIR.red} fillOpacity={0.6} />
      </svg>
      <div className={`absolute inset-0 ${world.halftone}`} />
      <Stickers className={`absolute inset-0 h-full w-full ${world.follow}`} />
      <JaggedSkyline className="absolute inset-x-0 bottom-0 h-32 w-full opacity-90" />
    </div>
  )
}
