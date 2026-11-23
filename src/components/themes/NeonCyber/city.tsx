import type { ComponentType } from 'react'
import { NEON } from './palette'

// The city in three depths, as the layers of a scene's stage (stage.tsx): far, the dark towers with their lit
// window grids in the dusk haze; mid, the towers hung with sign boxes in yellow, cyan and magenta and a flying
// car the scroll carries across; near, the alley walls, a fire escape, sagging cables, an LED strip bolted on
// and the street. Between far and mid sits the scene's district: the concrete overpass in a brown dusk, the
// lantern street's towers hung with tall cyan and yellow ad screens and red lanterns, a housing slab in a pink
// fog canyon, and the outskirts' amber sky with palms and the highway out. Every layer is drawn on the
// stage's 1600 by 900 canvas; `uid` keeps each stage's gradient and pattern ids its own.

export const VIEW = '0 0 1600 900'

const FAR_TOWERS = [
  { x: 40, w: 130, h: 520 },
  { x: 210, w: 90, h: 640 },
  { x: 330, w: 160, h: 460 },
  { x: 900, w: 120, h: 580 },
  { x: 1060, w: 180, h: 700 },
  { x: 1290, w: 110, h: 520 },
  { x: 1430, w: 150, h: 600 },
]

// The sign towers and the sign boxes on them: colour, place, size.
const MID_TOWERS = [
  { x: 120, w: 170, h: 380 },
  { x: 520, w: 140, h: 470 },
  { x: 700, w: 200, h: 360 },
  { x: 1180, w: 160, h: 420 },
]

const SIGNS = [
  { x: 150, y: 560, w: 26, h: 120, color: NEON.hud },
  { x: 545, y: 470, w: 90, h: 34, color: NEON.data },
  { x: 735, y: 590, w: 30, h: 96, color: NEON.magenta },
  { x: 1210, y: 520, w: 100, h: 30, color: NEON.hotPink },
]

export function Far({ uid }: { uid: string }) {
  return (
    <>
      <defs>
        <linearGradient id={`nc-dusk-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={NEON.ink} />
          <stop offset="0.55" stopColor={NEON.dusk} />
          <stop offset="1" stopColor={NEON.tower} />
        </linearGradient>
        <pattern id={`nc-windows-${uid}`} width="14" height="18" patternUnits="userSpaceOnUse">
          <rect x="3" y="4" width="5" height="7" fill={NEON.gold} fillOpacity={0.35} />
        </pattern>
      </defs>
      <rect width={1600} height={900} fill={`url(#nc-dusk-${uid})`} />
      {/* the tallest tower, its spire and the red aircraft light */}
      <polygon points="610,900 640,140 700,80 760,140 790,900" fill={NEON.alley} />
      <rect x={694} y={20} width={12} height={70} fill={NEON.alley} />
      <circle cx={700} cy={22} r={4} fill={NEON.chromeRed} />
      <rect x={652} y={200} width={96} height={700} fill={`url(#nc-windows-${uid})`} />
      {FAR_TOWERS.map(({ x, w, h }) => (
        <g key={x}>
          <rect x={x} y={900 - h} width={w} height={h} fill={NEON.street} />
          <rect x={x + 8} y={920 - h} width={w - 16} height={h - 40} fill={`url(#nc-windows-${uid})`} opacity={0.6} />
        </g>
      ))}
      <rect y={620} width={1600} height={280} fill={NEON.magenta} fillOpacity={0.06} />
    </>
  )
}

export function Mid() {
  return (
    <>
      {MID_TOWERS.map(({ x, w, h }) => (
        <rect key={x} x={x} y={900 - h} width={w} height={h} fill={NEON.panel} />
      ))}
      {SIGNS.map(({ x, y, w, h, color }, i) => (
        <g key={x} data-fx={i === 2 ? 'flicker' : undefined}>
          <rect x={x} y={y} width={w} height={h} fill={NEON.ink} stroke={color} strokeWidth={3} />
          <rect x={x + 6} y={y + 6} width={w - 12} height={h - 12} fill={color} fillOpacity={0.35} />
        </g>
      ))}
      {/* the flying car: the hull, the cabin glow, the tail lights */}
      <g data-fx="car">
        <path d="M0 300 L18 290 H70 L92 300 L70 308 H18 Z" fill={NEON.steel} />
        <rect x={30} y={286} width={30} height={6} fill={NEON.data} fillOpacity={0.6} />
        <rect x={0} y={298} width={6} height={4} fill={NEON.chromeRed} />
      </g>
    </>
  )
}

export function Near() {
  return (
    <>
      <rect x={-40} y={420} width={260} height={480} fill={NEON.ink} />
      <rect x={1380} y={380} width={260} height={520} fill={NEON.ink} />
      {/* the fire escape on the left wall */}
      <path d="M220 520 H330 M220 640 H330 M220 760 H330 M240 520 L310 640 M240 640 L310 760" stroke={NEON.steel} strokeWidth={4} fill="none" />
      {/* the LED strip bolted onto the right wall, and the cables sagging between the walls */}
      <rect x={1384} y={470} width={8} height={300} fill={NEON.hud} fillOpacity={0.7} />
      <path d="M220 450 Q800 560 1380 430 M220 480 Q820 620 1380 470" stroke={NEON.ink} strokeWidth={3} fill="none" />
      <rect y={860} width={1600} height={40} fill={NEON.ink} />
    </>
  )
}

// The overpass: the brown dusk over the street, the concrete overpass on its pillars, a kiosk sign under it.
function Overpass() {
  return (
    <>
      <rect width={1600} height={900} fill={NEON.overpassDusk} fillOpacity={0.35} />
      <path d="M0 610 L1600 560 L1600 600 L0 650 Z" fill={NEON.concrete} />
      <path d="M0 650 L1600 600" stroke={NEON.data} strokeOpacity={0.5} strokeWidth={3} />
      {[180, 620, 1060, 1460].map((x) => (
        <rect key={x} x={x} y={620 - x * 0.03} width={40} height={300} fill={NEON.concrete} />
      ))}
      <rect x={760} y={700} width={220} height={60} fill={NEON.ink} stroke={NEON.hud} strokeWidth={4} />
      <rect x={772} y={712} width={196} height={36} fill={NEON.hud} fillOpacity={0.3} />
    </>
  )
}

const LANTERN_ADS = [
  { x: 90, y: 180, w: 60, h: 300, color: NEON.data },
  { x: 430, y: 120, w: 70, h: 360, color: NEON.hud },
  { x: 1000, y: 160, w: 60, h: 320, color: NEON.data },
  { x: 1340, y: 220, w: 80, h: 260, color: NEON.hud },
]

// The lantern street: the night towers with tall ad screens and a row of red lanterns strung across the street.
function Lanterns() {
  return (
    <>
      <rect width={1600} height={900} fill={NEON.ink} fillOpacity={0.3} />
      {LANTERN_ADS.map(({ x, y, w, h, color }) => (
        <g key={x}>
          <rect x={x} y={y} width={w} height={h} fill={NEON.ink} stroke={color} strokeWidth={3} />
          <rect x={x + 8} y={y + 10} width={w - 16} height={h - 20} fill={color} fillOpacity={0.22} />
          <path d={`M${x + 14} ${y + 40} h${w - 28} M${x + 14} ${y + 80} h${w - 34} M${x + 14} ${y + 120} h${w - 28}`} stroke={color} strokeWidth={6} strokeOpacity={0.6} />
        </g>
      ))}
      <path d="M0 420 Q800 500 1600 410" stroke={NEON.ink} strokeWidth={3} fill="none" />
      {[120, 300, 480, 660, 840, 1020, 1200, 1380].map((x) => (
        <ellipse key={x} cx={x} cy={420 + 80 * Math.sin((x / 1600) * Math.PI) - 10} rx={14} ry={20} fill={NEON.chromeRed} fillOpacity={0.8} />
      ))}
    </>
  )
}

// The slab: the stacked housing block of thousands, its lit window bands, the pink fog in the canyon and one
// pink tube sign hanging down its face.
function Slab() {
  return (
    <>
      <rect x={560} y={60} width={480} height={840} fill={NEON.alley} />
      <rect x={600} y={20} width={180} height={60} fill={NEON.alley} />
      <rect x={820} y={0} width={140} height={80} fill={NEON.alley} />
      {[140, 260, 380, 500, 620, 740].map((y) => (
        <rect key={y} x={580} y={y} width={440} height={14} fill={NEON.gold} fillOpacity={0.28} />
      ))}
      <path d="M980 160 V420" stroke={NEON.pinkTube} strokeWidth={10} strokeLinecap="round" />
      <rect y={480} width={1600} height={420} fill={NEON.pinkTube} fillOpacity={0.12} />
      <rect y={640} width={1600} height={260} fill={NEON.pinkTube} fillOpacity={0.1} />
    </>
  )
}

const PALMS = [140, 380, 1240, 1480]

// The outskirts: the amber sky low on the horizon, the sun disc, palms in silhouette, the highway out.
function Outskirts({ uid }: { uid: string }) {
  return (
    <>
      <defs>
        <linearGradient id={`nc-sunset-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.3" stopColor={NEON.dusk} stopOpacity={0} />
          <stop offset="0.75" stopColor={NEON.sunset} stopOpacity={0.55} />
          <stop offset="1" stopColor={NEON.sunsetGlow} stopOpacity={0.6} />
        </linearGradient>
      </defs>
      <rect width={1600} height={900} fill={`url(#nc-sunset-${uid})`} />
      <circle cx={800} cy={760} r={110} fill={NEON.sunsetGlow} fillOpacity={0.55} />
      <path d="M0 800 H1600 V900 H0 Z" fill={NEON.ink} />
      <path d="M700 900 L790 800 H810 L900 900" fill={NEON.street} />
      {PALMS.map((x) => (
        <g key={x} fill={NEON.ink}>
          <path d={`M${x} 800 Q${x + 10} 680 ${x + 4} 600 L${x + 12} 600 Q${x + 20} 690 ${x + 10} 800 Z`} />
          <path d={`M${x + 8} 600 Q${x - 50} 580 ${x - 80} 620 Q${x - 40} 590 ${x + 8} 604 Q${x + 60} 585 ${x + 96} 625 Q${x + 50} 580 ${x + 8} 600 Q${x - 20} 560 ${x - 30} 540 Q${x + 10} 565 ${x + 8} 600 Z`} />
        </g>
      ))}
    </>
  )
}

export type District = 'overpass' | 'lanterns' | 'slab' | 'outskirts'

/** Each district's picture, drawn between the far towers and the sign towers. */
export const DISTRICT_ART: Record<District, ComponentType<{ uid: string }>> = { overpass: Overpass, lanterns: Lanterns, slab: Slab, outskirts: Outskirts }

// The rain as slanted streaks in the foreground layer, still; the scroll's push in moves them.
const RAIN = Array.from({ length: 46 }, (_, i) => ({ x: (i * 137) % 1640, y: (i * 211) % 860, long: 40 + ((i * 53) % 50) }))

export function Rain() {
  return (
    <g stroke={NEON.data} strokeOpacity={0.22} strokeWidth={2}>
      {RAIN.map(({ x, y, long }) => (
        <path key={`${x}-${y}`} d={`M${x} ${y} l-${long * 0.25} ${long}`} />
      ))}
    </g>
  )
}
