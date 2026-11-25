import { CEL } from './palette'
import cel from './cel.module.css'

// The world's drawing kit, the marks its comic art is made of: the diagonal hatching its shadow sides are
// filled with, the cross hatching of the deepest shade, the grit scratched over ground and metal, the steel
// diamond plate behind a boss card, and the jagged starburst behind an impact. Every drawing in the world
// strokes its shapes in ink through `cel.inked`, the scene's cast in the heavier line of `cel.heavy`; a shape
// marked data-bare (a hatch fill, a glow, a detail line) keeps no outline.

export const HATCH = 'url(#cel-hatch)'
export const CROSS = 'url(#cel-cross)'
export const GRIT = 'url(#cel-grit)'
export const PLATE = 'url(#cel-plate)'

/** The patterns, defined once on the page; a zero size SVG, never display none, so they resolve in every
 *  drawing. */
export function HatchDefs() {
  return (
    <svg className="absolute h-0 w-0" aria-hidden="true" focusable="false">
      <defs>
        <pattern id="cel-hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="1.3" height="5" fill={CEL.ink} />
        </pattern>
        <pattern id="cel-cross" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
          <rect width="1.6" height="7" fill={CEL.ink} />
          <rect width="7" height="1.6" fill={CEL.ink} />
        </pattern>
        <pattern id="cel-grit" width="60" height="44" patternUnits="userSpaceOnUse">
          <path d="M4 6 l9 -2 M30 14 l6 3 M48 4 l-7 4 M14 30 l10 1 M40 34 l8 -3 M54 24 l3 6 M22 40 l-6 -3" stroke={CEL.ink} strokeWidth="1.6" strokeLinecap="round" />
        </pattern>
        <pattern id="cel-plate" width="26" height="26" patternUnits="userSpaceOnUse" patternTransform="rotate(-20)">
          <path d="M4 9 Q9 3 14 3 Q9 9 4 9 Z M17 22 Q22 16 27 16 Q22 22 17 22 Z" fill={CEL.paper} opacity="0.55" />
        </pattern>
      </defs>
    </svg>
  )
}

/** A shadow side: its darker tone, then the hatching over it, `cross` for the deepest. */
export function Shade({ d, fill, cross = false, opacity = 0.45 }: { d: string; fill?: string; cross?: boolean; opacity?: number }) {
  return (
    <>
      {fill && <path d={d} fill={fill} data-bare />}
      <path d={d} fill={cross ? CROSS : HATCH} opacity={opacity} data-bare />
    </>
  )
}

/** Ink detail lines drawn over a shape: seams, cracks, rivets' rows, with no outline of their own. */
export function Lines({ d, width = 3 }: { d: string; width?: number }) {
  return <path d={d} fill="none" stroke={CEL.ink} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" data-bare />
}

// The points of a jagged starburst round (x, y): sixteen spikes, every other one short, each long one a
// little off.
const burstPoints = (x: number, y: number, r: number): string =>
  Array.from({ length: 32 }, (_, i) => {
    const angle = (i * Math.PI) / 16
    const radius = i % 2 ? r * 0.6 : r * (1 - (i % 6) * 0.05)
    return `${(x + Math.sin(angle) * radius).toFixed(2)},${(y - Math.cos(angle) * radius).toFixed(2)}`
  }).join(' ')

const BURST_POINTS = burstPoints(50, 50, 50)

/** The starburst as a shape inside a larger drawing, round (x, y). */
export function Burst({ x, y, r, fill }: { x: number; y: number; r: number; fill: string }) {
  return <polygon points={burstPoints(x, y, r)} fill={fill} />
}

export function Starburst({ fill, className = 'h-full w-full' }: { fill: string; className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={`${cel.inked} ${className}`} aria-hidden="true" focusable="false">
      <polygon points={BURST_POINTS} fill={fill} />
    </svg>
  )
}
