import cel from './cel.module.css'

// The world's drawing kit, the marks its comic art is made of: the hatch patterns its shadow sides are
// filled with (diagonal hatching and cross hatching, ink on transparent), the jagged starburst behind an
// impact and the speed rays behind a freeze frame. Every drawing in the world strokes its shapes in ink
// through `cel.inked`; a shape marked data-bare (a hatch fill, a glow) keeps no outline.

export const HATCH = 'url(#cel-hatch)'
export const CROSS_HATCH = 'url(#cel-cross)'

/** The hatch patterns, defined once on the page; a zero size SVG, never display none, so the
 *  patterns resolve in every drawing. */
export function HatchDefs() {
  return (
    <svg className="absolute h-0 w-0" aria-hidden="true" focusable="false">
      <defs>
        <pattern id="cel-hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="1.3" height="5" fill="#141414" />
        </pattern>
        <pattern id="cel-cross" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="1.2" height="5" fill="#141414" />
          <rect width="5" height="1.2" fill="#141414" />
        </pattern>
      </defs>
    </svg>
  )
}

// The points of a jagged starburst: sixteen spikes, every other one short, each long one a little off.
const BURST_POINTS = Array.from({ length: 32 }, (_, i) => {
  const angle = (i * Math.PI) / 16
  const radius = i % 2 ? 30 : 50 - (i % 6) * 2.5
  return `${(50 + Math.sin(angle) * radius).toFixed(2)},${(50 - Math.cos(angle) * radius).toFixed(2)}`
}).join(' ')

export function Starburst({ fill, className = 'h-full w-full' }: { fill: string; className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={`${cel.inked} ${className}`} aria-hidden="true" focusable="false">
      <polygon points={BURST_POINTS} fill={fill} />
    </svg>
  )
}

// The speed rays: thin wedges from the centre out past the frame, alternating ink and the light colour.
const RAYS = Array.from({ length: 18 }, (_, i) => {
  const from = (i * 2 * Math.PI) / 18
  const to = from + Math.PI / 30
  const point = (angle: number) => `${(100 + Math.cos(angle) * 150).toFixed(1)},${(100 + Math.sin(angle) * 150).toFixed(1)}`
  return `M100,100 L${point(from)} L${point(to)} Z`
})

export function SpeedRays({ color, className }: { color: string; className: string }) {
  return (
    <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true" focusable="false">
      {RAYS.map((d) => (
        <path key={d} d={d} fill={color} />
      ))}
    </svg>
  )
}
