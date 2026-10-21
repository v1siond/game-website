import type { ReactNode } from 'react'
import { NEON } from './palette'
import world from './world.module.css'

// The city behind the page, in the three eras its art direction stacks: far, the neomilitary
// megatowers with their lit window grids in the dusk haze; mid, the kitsch towers hung with sign boxes
// in yellow, cyan and magenta, one of them flickering, and a flying car crossing about once a minute;
// near, the entropism walls, a fire escape, sagging cables and an LED strip bolted on. The three
// layers lean apart under the pointer (--mx, --my, see .depth). Rain falls in two sheets. Four loops
// in all: two rain sheets, the car, the flicker.

const VIEW = '0 0 1600 900'

function Depth({ depth, children }: { depth: 'far' | 'mid' | 'near'; children: ReactNode }) {
  return (
    <div className={`absolute -inset-10 ${world.depth} ${world[depth]}`}>
      <svg viewBox={VIEW} preserveAspectRatio="xMidYMax slice" className="h-full w-full" aria-hidden="true" focusable="false">
        {children}
      </svg>
    </div>
  )
}

const FAR_TOWERS = [
  { x: 40, w: 130, h: 520 },
  { x: 210, w: 90, h: 640 },
  { x: 330, w: 160, h: 460 },
  { x: 900, w: 120, h: 580 },
  { x: 1060, w: 180, h: 700 },
  { x: 1290, w: 110, h: 520 },
  { x: 1430, w: 150, h: 600 },
]

// The kitsch towers and the sign boxes on them: colour, place, size.
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

function Far() {
  return (
    <Depth depth="far">
      <defs>
        <linearGradient id="nc-dusk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={NEON.ink} />
          <stop offset="0.55" stopColor={NEON.dusk} />
          <stop offset="1" stopColor={NEON.tower} />
        </linearGradient>
        <pattern id="nc-windows" width="14" height="18" patternUnits="userSpaceOnUse">
          <rect x="3" y="4" width="5" height="7" fill={NEON.gold} fillOpacity={0.35} />
        </pattern>
      </defs>
      <rect width={1600} height={900} fill="url(#nc-dusk)" />
      {/* the megatower, its spire and the red aircraft light */}
      <polygon points="610,900 640,140 700,80 760,140 790,900" fill={NEON.alley} />
      <rect x={694} y={20} width={12} height={70} fill={NEON.alley} />
      <circle cx={700} cy={22} r={4} fill={NEON.chromeRed} />
      <rect x={652} y={200} width={96} height={700} fill="url(#nc-windows)" />
      {FAR_TOWERS.map(({ x, w, h }) => (
        <g key={x}>
          <rect x={x} y={900 - h} width={w} height={h} fill={NEON.street} />
          <rect x={x + 8} y={920 - h} width={w - 16} height={h - 40} fill="url(#nc-windows)" opacity={0.6} />
        </g>
      ))}
      <rect y={620} width={1600} height={280} fill={NEON.magenta} fillOpacity={0.06} />
    </Depth>
  )
}

function Mid() {
  return (
    <Depth depth="mid">
      {MID_TOWERS.map(({ x, w, h }) => (
        <rect key={x} x={x} y={900 - h} width={w} height={h} fill={NEON.panel} />
      ))}
      {SIGNS.map(({ x, y, w, h, color }, i) => (
        <g key={x} className={i === 2 ? world.flicker : undefined}>
          <rect x={x} y={y} width={w} height={h} fill={NEON.ink} stroke={color} strokeWidth={3} />
          <rect x={x + 6} y={y + 6} width={w - 12} height={h - 12} fill={color} fillOpacity={0.35} />
        </g>
      ))}
      {/* the flying car: the hull, the cabin glow, the tail lights */}
      <g className={world.car}>
        <path d="M0 300 L18 290 H70 L92 300 L70 308 H18 Z" fill={NEON.steel} />
        <rect x={30} y={286} width={30} height={6} fill={NEON.data} fillOpacity={0.6} />
        <rect x={0} y={298} width={6} height={4} fill={NEON.chromeRed} />
      </g>
    </Depth>
  )
}

function Near() {
  return (
    <Depth depth="near">
      <rect x={-40} y={420} width={260} height={480} fill={NEON.ink} />
      <rect x={1380} y={380} width={260} height={520} fill={NEON.ink} />
      {/* the fire escape on the left wall */}
      <path d="M220 520 H330 M220 640 H330 M220 760 H330 M240 520 L310 640 M240 640 L310 760" stroke={NEON.steel} strokeWidth={4} fill="none" />
      {/* the LED strip bolted onto the right wall, and the cables sagging between the walls */}
      <rect x={1384} y={470} width={8} height={300} fill={NEON.hud} fillOpacity={0.7} />
      <path d="M220 450 Q800 560 1380 430 M220 480 Q820 620 1380 470" stroke={NEON.ink} strokeWidth={3} fill="none" />
      <rect y={860} width={1600} height={40} fill={NEON.ink} />
    </Depth>
  )
}

export function CityBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <Far />
      <Mid />
      <Near />
      <div className={`absolute inset-x-0 top-0 h-[200%] ${world.rain} ${world.rainSlow}`} />
      <div className={`absolute inset-x-0 top-0 h-[200%] ${world.rain}`} />
      {/* scanlines and the optics vignette: static */}
      <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent_0_2px,rgba(0,0,0,0.25)_2px_3px)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,transparent_45%,rgba(7,6,12,0.85)_100%)]" />
    </div>
  )
}
