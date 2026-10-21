import { TRAIL } from './palette'

// Adventure Paths' small marks: the compass rose of the explorer's map and the waypoint flag that marks
// a stop on the route.

export function CompassRose({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true" focusable="false">
      <circle cx={20} cy={20} r={18} fill={TRAIL.PARCHMENT} stroke={TRAIL.EDGE} strokeWidth={2} />
      <circle cx={20} cy={20} r={13} fill="none" stroke={TRAIL.INK_SOFT} strokeWidth={0.8} />
      <path d="M20 4 L23 20 L20 36 L17 20 Z" fill={TRAIL.INK} />
      <path d="M20 4 L23 20 L17 20 Z" fill={TRAIL.ROUTE} />
      <path d="M4 20 L20 17 L36 20 L20 23 Z" fill={TRAIL.INK_SOFT} />
      <circle cx={20} cy={20} r={2} fill={TRAIL.GOLD} />
    </svg>
  )
}

// `pennantClassName` lets a scene raise the pennant up its pole.
export function WaypointFlag({ className = '', pennantClassName = '' }: { className?: string; pennantClassName?: string }) {
  return (
    <svg viewBox="0 0 20 28" className={className} aria-hidden="true" focusable="false">
      <rect x={4} y={2} width={2} height={24} fill={TRAIL.BARK} />
      <path d="M6 3 L18 7 L6 11 Z" fill={TRAIL.ROUTE} className={pennantClassName} />
      <ellipse cx={5} cy={26} rx={5} ry={2} fill={TRAIL.STONE_DARK} />
    </svg>
  )
}
