import { CEL } from './palette'
import cel from './cel.module.css'

// The world's drawing kit, the marks its comic art is made of: the hatch pattern its shadow sides are
// filled with (diagonal hatching, ink on transparent) and the jagged starburst behind an impact. Every drawing in the world strokes its shapes in ink
// through `cel.inked`; a shape marked data-bare (a hatch fill, a glow) keeps no outline.

export const HATCH = 'url(#cel-hatch)'

/** The hatch pattern, defined once on the page; a zero size SVG, never display none, so the
 *  pattern resolves in every drawing. */
export function HatchDefs() {
  return (
    <svg className="absolute h-0 w-0" aria-hidden="true" focusable="false">
      <defs>
        <pattern id="cel-hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="1.3" height="5" fill={CEL.ink} />
        </pattern>
      </defs>
    </svg>
  )
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
