import type { ReactNode } from 'react'
import { MYTH } from './palette'

// Mythic's static art, drawn in the palette: the Greek key band, the fluted marble column, the brazier,
// the amphora, the islands on the horizon, and the breaks between sections. None of it moves by
// itself; the scroll scenes and the page's clouds own every motion.

// The meander, one hooked spiral per 16 unit tile between a top and a bottom rule.
const keyTile = (x: number) => `M${x + 1} 13 H${x + 13} V3 H${x + 3} V10 H${x + 10} V6 H${x + 6}`

const KEY_TILES = 60
const KEY_PATH = Array.from({ length: KEY_TILES }, (_, i) => keyTile(i * 16)).join(' ')

// The Greek key as a band; it crops at the edge instead of stretching, so every tile stays square.
export function GreekKey({ className, color = MYTH.ink }: { className: string; color?: string }) {
  return (
    <svg viewBox={`0 0 ${KEY_TILES * 16} 16`} preserveAspectRatio="xMinYMid slice" className={className} aria-hidden="true" focusable="false">
      <path d={`M0 0.75 H${KEY_TILES * 16} M0 15.25 H${KEY_TILES * 16}`} stroke={color} strokeWidth={1.5} />
      <path d={KEY_PATH} fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="square" />
    </svg>
  )
}

const FLUTES = [-0.5, -0.17, 0.17, 0.5]

// A Doric column standing at x on the ground line `base`, `top` high: the capital, the fluted shaft,
// the plinth. Drawn inside a parent SVG.
export function Column({ x, top, base, width = 14 }: { x: number; top: number; base: number; width?: number }) {
  const half = width / 2

  return (
    <g>
      <rect x={x - half - 3} y={top} width={width + 6} height={3} fill={MYTH.marble} />
      <rect x={x - half - 1.5} y={top + 3} width={width + 3} height={2.5} fill={MYTH.marbleShade} />
      <rect x={x - half} y={top + 5.5} width={width} height={base - top - 8.5} fill={MYTH.marble} />
      {FLUTES.map((offset) => (
        <rect key={offset} x={x + offset * (width - 4) - 0.4} y={top + 7} width={0.8} height={base - top - 12} fill={MYTH.marbleShade} />
      ))}
      <rect x={x - half - 2.5} y={base - 3} width={width + 5} height={3} fill={MYTH.marbleShade} />
    </g>
  )
}

// A bronze brazier on its tripod at x standing on `base`; `flame` is drawn in the bowl, so a scene can
// give it its own motion class.
export function Brazier({ x, base, flame }: { x: number; base: number; flame: ReactNode }) {
  return (
    <g>
      <path d={`M${x - 6} ${base} L${x - 1.5} ${base - 14} M${x + 6} ${base} L${x + 1.5} ${base - 14} M${x} ${base} V${base - 14}`} stroke={MYTH.goldDeep} strokeWidth={1.4} />
      <path d={`M${x - 8} ${base - 18} H${x + 8} L${x + 5} ${base - 13} H${x - 5} Z`} fill={MYTH.gold} />
      {flame}
    </g>
  )
}

// The flame that sits in a brazier's bowl at x, its base on the bowl's rim.
export function BrazierFlame({ x, rim, className = '' }: { x: number; rim: number; className?: string }) {
  return (
    <g className={className}>
      <path d={`M${x - 6} ${rim} Q${x - 7} ${rim - 9} ${x} ${rim - 16} Q${x + 7} ${rim - 9} ${x + 6} ${rim} Z`} fill={MYTH.flame} />
      <path d={`M${x - 3} ${rim} Q${x - 3} ${rim - 6} ${x} ${rim - 10} Q${x + 3} ${rim - 6} ${x + 3} ${rim} Z`} fill={MYTH.flameCore} />
    </g>
  )
}

// An amphora in its 40 by 60 box: black figure body, clay shoulder band with a key line, two handles.
export function Amphora({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 40 60" className={className} aria-hidden="true" focusable="false">
      <path d="M14 2 H26 V8 Q36 14 34 32 Q32 50 22 58 H18 Q8 50 6 32 Q4 14 14 8 Z" fill={MYTH.ink} />
      <path d="M8 22 H32 V30 H8 Z" fill={MYTH.terracotta} />
      <path d="M10 26 H14 V24 H18 V28 H22 V24 H26 V28 H30" fill="none" stroke={MYTH.ink} strokeWidth={1} />
      <path d="M14 8 Q4 8 7 20 M26 8 Q36 8 33 20" fill="none" stroke={MYTH.ink} strokeWidth={2} />
    </svg>
  )
}

// The islands on the horizon in their 690 by 40 box, the far ones paler.
export function Islands({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 690 40" preserveAspectRatio="none" className={className} aria-hidden="true" focusable="false">
      <path d="M0 40 Q40 18 90 26 Q130 12 180 30 L200 40 Z M320 40 Q370 8 430 24 Q470 16 520 34 L540 40 Z" fill={MYTH.island} />
      <path d="M150 40 Q200 22 250 32 Q280 24 300 40 Z M560 40 Q600 20 650 28 Q675 26 690 36 V40 Z" fill={MYTH.stone} />
    </svg>
  )
}

// The running wave band of a vase's foot, in its 960 by 16 box.
const WAVE_PATH = Array.from({ length: 30 }, (_, i) => {
  const x = i * 32
  return `M${x} 14 Q${x + 4} 2 ${x + 14} 4 Q${x + 22} 6 ${x + 18} 11 Q${x + 14} 13 ${x + 13} 9 Q${x + 20} 14 ${x + 32} 14`
}).join(' ')

export type BreakKind = 'key' | 'wave'

// A break between two sections: a Greek key band on either side of an amphora, or the running wave of
// a vase's foot painted black on a terracotta band.
function KeyBreak() {
  return (
    <div className="flex items-center gap-4">
      <GreekKey className="h-3 flex-1" color={MYTH.ink} />
      <Amphora className="h-12 w-8 flex-shrink-0" />
      <GreekKey className="h-3 flex-1" color={MYTH.ink} />
    </div>
  )
}

function WaveBreak() {
  return (
    <svg viewBox="0 0 960 16" preserveAspectRatio="xMidYMid slice" className="h-4 w-full" aria-hidden="true" focusable="false">
      <rect x={0} y={0} width={960} height={16} fill={MYTH.terracotta} />
      <path d={WAVE_PATH} fill="none" stroke={MYTH.ink} strokeWidth={1.6} />
    </svg>
  )
}

const BREAKS: Record<BreakKind, () => ReactNode> = {
  key: KeyBreak,
  wave: WaveBreak,
}

export function SectionBreak({ kind }: { kind: BreakKind }) {
  const Break = BREAKS[kind]

  return (
    <div className="relative z-20 mx-auto my-10 max-w-3xl px-4" aria-hidden="true">
      <Break />
    </div>
  )
}
