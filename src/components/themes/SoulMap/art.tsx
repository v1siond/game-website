import { SOUL } from './palette'

// Soul Map's own drawings, used across the page and the scenes: the rest point where he stops (a carved
// stone seat under a hanging lantern), a crystal cluster from the cavern walls, the map room glyph that
// marks a heading, and the glowing path that breaks one section from the next.

// The rest point: a stone seat with a lantern on its post. `lit` is the lantern's light, a class so a
// scene can bring it up with progress; a static place passes a plain opacity class.
export function RestPoint({ className = '', lit = 'opacity-100' }: { className?: string; lit?: string }) {
  return (
    <svg viewBox="0 0 60 60" className={className} aria-hidden="true" focusable="false">
      <circle cx={42} cy={20} r={16} fill={SOUL.lantern} opacity={0.18} className={lit} />
      <rect x={40} y={10} width={3} height={46} fill={SOUL.rockLight} />
      <path d="M36 14 H48 L46 28 H38 Z" fill={SOUL.rock} stroke={SOUL.ridge} strokeWidth={1} />
      <rect x={39} y={17} width={6} height={8} rx={1} fill={SOUL.lantern} className={lit} />
      <path d="M4 44 Q4 38 10 38 H32 Q36 38 36 44 V48 H4 Z" fill={SOUL.rockLight} />
      <rect x={6} y={48} width={6} height={10} fill={SOUL.rock} />
      <rect x={28} y={48} width={6} height={10} fill={SOUL.rock} />
      <rect x={0} y={57} width={60} height={3} fill={SOUL.ridge} />
    </svg>
  )
}

// A crystal cluster, three shards from one root.
export function Crystal({ className = '', color = SOUL.glow }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 30 40" className={className} aria-hidden="true" focusable="false">
      <path d="M15 2 L21 26 L15 38 L9 26 Z" fill={color} />
      <path d="M15 2 L15 38 L9 26 Z" fill={SOUL.glowDeep} opacity={0.6} />
      <path d="M5 16 L10 30 L6 38 L1 30 Z" fill={color} opacity={0.75} />
      <path d="M25 20 L29 32 L25 38 L21 32 Z" fill={color} opacity={0.75} />
    </svg>
  )
}

// A heading's mark: a lit map room with its two doors.
export function RoomGlyph({ color = SOUL.glow }: { color?: string }) {
  return (
    <svg viewBox="0 0 24 16" className="h-4 w-6 flex-shrink-0" aria-hidden="true" focusable="false">
      <rect x={5} y={2} width={14} height={12} fill="none" stroke={color} strokeWidth={1.5} />
      <rect x={8} y={5} width={8} height={6} fill={color} opacity={0.5} />
      <path d="M0 8 H5 M19 8 H24" stroke={color} strokeWidth={1.5} />
    </svg>
  )
}

// The path between two sections: a glowing trail across the cavern floor, a rest point in the middle,
// unexplored rooms dimming at both ends.
export function PathBreak() {
  return (
    <div className="relative mx-auto my-10 h-16 max-w-3xl" aria-hidden="true">
      <svg viewBox="0 0 400 60" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" focusable="false">
        <rect x={6} y={22} width={34} height={22} fill="none" stroke={SOUL.rock} strokeWidth={1.5} strokeDasharray="3 3" />
        <rect x={360} y={22} width={34} height={22} fill="none" stroke={SOUL.rock} strokeWidth={1.5} strokeDasharray="3 3" />
        <path d="M40 33 H360" stroke={SOUL.glowDeep} strokeWidth={4} opacity={0.35} />
        <path d="M40 33 H360" stroke={SOUL.glow} strokeWidth={1.5} />
      </svg>
      <RestPoint className="absolute left-1/2 top-0 h-14 w-14 -translate-x-1/2" />
    </div>
  )
}
