import type { ReactNode } from 'react'
import { NOIR } from './palette'
import world from './world.module.css'

// Bold Noir's static art: the city skyline, the rain streaks the levels pour, the page's night behind
// everything (blind light, rain, the skyline at the foot of the screen) and the breaks between
// sections. Only the page rain loops (world.module.css); the scroll scenes own every other motion.

// The towers of the skyline in its 690 by 100 box, each with the few windows still lit this late.
const TOWERS = [
  { x: 0, width: 48, height: 52, lit: [0.3] },
  { x: 54, width: 34, height: 78, lit: [0.6] },
  { x: 94, width: 62, height: 40, lit: [] },
  { x: 162, width: 38, height: 88, lit: [0.25, 0.7] },
  { x: 206, width: 54, height: 58, lit: [0.5] },
  { x: 266, width: 30, height: 70, lit: [] },
  { x: 302, width: 66, height: 46, lit: [0.2] },
  { x: 374, width: 40, height: 82, lit: [0.65] },
  { x: 420, width: 56, height: 54, lit: [] },
  { x: 482, width: 36, height: 74, lit: [0.4] },
  { x: 524, width: 60, height: 44, lit: [0.75] },
  { x: 590, width: 42, height: 66, lit: [0.3] },
  { x: 638, width: 52, height: 50, lit: [] },
]

export function Skyline({ className, fill = NOIR.ink }: { className: string; fill?: string }) {
  return (
    <svg viewBox="0 0 690 100" preserveAspectRatio="none" className={className} aria-hidden="true" focusable="false">
      {TOWERS.map(({ x, width, height, lit }) => (
        <g key={x}>
          <rect x={x} y={100 - height} width={width} height={height} fill={fill} />
          {lit.map((place) => (
            <rect key={place} x={x + width * place} y={100 - height + 10} width={5} height={4} fill={NOIR.paper} />
          ))}
        </g>
      ))}
    </svg>
  )
}

// Short slanted streaks of rain over a 600 by 100 box; a level stretches it wider and pours it.
const STREAKS = Array.from({ length: 36 }, (_, i) => ({ x: (i * 97) % 600, y: (i * 37) % 100 }))

export function RainStreaks({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 600 100" preserveAspectRatio="none" className={className} aria-hidden="true" focusable="false">
      {STREAKS.map(({ x, y }) => (
        <line key={`${x}-${y}`} x1={x} y1={y} x2={x - 4} y2={y + 14} stroke={NOIR.paper} strokeOpacity={0.35} strokeWidth={1} />
      ))}
    </svg>
  )
}

// The night behind the page: the blind light falling across it, two layers of rain, the skyline at
// the foot of the screen and the shadowed edges.
export function NoirBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className={`absolute inset-0 ${world.blinds}`} />
      <div className={world.rainFar} />
      <Skyline className="absolute inset-x-0 bottom-0 h-40 w-full opacity-80" fill={NOIR.coal} />
      <div className={world.rain} />
      <div className={`absolute inset-0 ${world.vignette}`} />
    </div>
  )
}

export type BreakKind = 'blinds' | 'lamp'

// The slats of a venetian blind with a red slash cut across them.
function BlindsBreak() {
  return (
    <svg viewBox="0 0 600 60" preserveAspectRatio="none" className="h-14 w-full" aria-hidden="true" focusable="false">
      {[6, 18, 30, 42].map((y) => (
        <rect key={y} x={0} y={y} width={600} height={7} fill={NOIR.smoke} />
      ))}
      <polygon points="250,58 262,58 352,2 340,2" fill={NOIR.red} />
    </svg>
  )
}

// A street lamp at the kerb, its cone of light falling through the rain onto a wet pavement.
function LampBreak() {
  return (
    <svg viewBox="0 0 600 90" preserveAspectRatio="xMidYMid meet" className="h-20 w-full" aria-hidden="true" focusable="false">
      <polygon points="292,22 308,22 360,84 240,84" fill={NOIR.paper} fillOpacity={0.12} />
      <rect x={298} y={6} width={4} height={80} fill={NOIR.ash} />
      <path d="M288 22 Q300 8 312 22 Z" fill={NOIR.fog} />
      <rect x={60} y={84} width={480} height={3} fill={NOIR.smoke} />
      <ellipse cx={300} cy={86} rx={70} ry={2} fill={NOIR.paper} fillOpacity={0.18} />
      {[250, 276, 322, 348].map((x) => (
        <line key={x} x1={x} y1={34} x2={x - 3} y2={52} stroke={NOIR.paper} strokeOpacity={0.4} />
      ))}
    </svg>
  )
}

const BREAKS: Record<BreakKind, () => ReactNode> = {
  blinds: BlindsBreak,
  lamp: LampBreak,
}

export function SectionBreak({ kind }: { kind: BreakKind }) {
  const Break = BREAKS[kind]

  return (
    <div className="relative z-20 my-10" aria-hidden="true">
      <Break />
    </div>
  )
}
