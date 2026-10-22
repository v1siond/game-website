import type { CSSProperties, ReactNode } from 'react'
import { useZoneStage } from '@/hooks/useZoneStage'
import { DECO_COLORS as C } from './palette'
import look from './world.module.css'

// The fixed backdrop of the city under the sea behind every section: the SVG patterns, the deco
// pattern, the light rays through the dome, the drowned skyline, the caustic light and a few rising
// bubbles. Ambient loops stop under reduced motion (world.module.css).
//
// The backdrop follows the depth the visitor is at, through the shared ZoneStageProvider on the page:
// at the surface (the hero) the light rays come down from above; in the chambers the rays thin and the
// far towers stand in the sea fog with their thin neon; at the revival chamber the light is gone. The
// page keeps the zone and sets it as data-zone on its root; the layers fade by opacity
// (world.module.css).

export type DecoZone = 'surface' | 'city' | 'abyss'

/** Hands its zone to the page while it is in view; mark a small element (a hero, a plaque, the contact). */
export function DepthZone({ zone, children, className }: { zone: DecoZone; children: ReactNode; className?: string }) {
  const { ref } = useZoneStage(zone)
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

export function DecoSVGDefs() {
  return (
    <svg className="absolute h-0 w-0" aria-hidden="true" focusable="false">
      <defs>


        <pattern id="deco-diamonds" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
          <path d="M40 0 L80 40 L40 80 L0 40 Z" fill="none" stroke={C.gold} strokeWidth="0.5" opacity="0.1" />
          <circle cx="40" cy="40" r="12" fill="none" stroke={C.gold} strokeWidth="0.3" opacity="0.08" />
          <path d="M40 20 L40 28 M40 52 L40 60 M20 40 L28 40 M52 40 L60 40" stroke={C.gold} strokeWidth="0.3" opacity="0.06" />
        </pattern>

        <pattern id="deco-sunburst" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
          <circle cx="60" cy="60" r="20" fill="none" stroke={C.gold} strokeWidth="0.3" opacity="0.05" />
          <circle cx="60" cy="60" r="35" fill="none" stroke={C.gold} strokeWidth="0.2" opacity="0.04" />
          {[0, 30, 60, 90, 120, 150].map((angle) => (
            <line
              key={angle}
              x1="60"
              y1="60"
              x2={60 + Math.cos((angle * Math.PI) / 180) * 55}
              y2={60 + Math.sin((angle * Math.PI) / 180) * 55}
              stroke={C.gold}
              strokeWidth="0.2"
              opacity="0.04"
            />
          ))}
        </pattern>

        <pattern id="pressure-cracks" x="0" y="0" width="300" height="300" patternUnits="userSpaceOnUse">
          <path d="M0,50 Q30,45 50,55 T100,48" fill="none" stroke={C.waterGlow} strokeWidth="0.3" opacity="0.06" />
          <path d="M200,100 Q220,105 250,95 T290,102" fill="none" stroke={C.tealLight} strokeWidth="0.2" opacity="0.05" />
          <path d="M50,250 Q80,248 110,255" fill="none" stroke={C.waterGlow} strokeWidth="0.3" opacity="0.04" />
        </pattern>
      </defs>
    </svg>
  )
}

export function DecoPatternBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <svg className="h-full w-full" preserveAspectRatio="none" focusable="false">
        <rect width="100%" height="100%" fill="url(#deco-diamonds)" />
        <rect width="100%" height="100%" fill="url(#deco-sunburst)" />
        <rect width="100%" height="100%" fill="url(#pressure-cracks)" />
      </svg>
    </div>
  )
}

// Six still shafts of light through the dome, fanned from the top.
const RAY_ANGLES = ['-rotate-[20deg]', '-rotate-[13deg]', '-rotate-[6deg]', 'rotate-[1deg]', 'rotate-[8deg]', 'rotate-[15deg]']
const RAY_LEFT = ['left-[5%]', 'left-[23%]', 'left-[41%]', 'left-[59%]', 'left-[77%]', 'left-[95%]']

export function UnderwaterRays() {
  return (
    <div className={`pointer-events-none fixed inset-0 z-[1] overflow-hidden ${look.zoneRays}`} aria-hidden="true">
      {RAY_ANGLES.map((angle, i) => (
        <div key={angle} className={`absolute top-0 h-full w-44 origin-top ${RAY_LEFT[i]} ${angle} ${look.rays}`} />
      ))}
    </div>
  )
}

// The far city in the fog, low in the window: stepped towers, lit windows and thin neon lines, the way
// the city shows through the glass (research 02 and 24: neon is lines, never filled boxes).
const FAR_TOWERS =
  'M0 400 V250 H40 V210 H60 V150 H70 V110 H76 V150 H90 V230 H130 V190 H150 V120 H160 V60 H166 V120 H176 V200 H210 V260 H250 V170 H270 V130 H290 V170 H310 V240 H350 V200 H380 V140 H392 V90 H398 V140 H410 V220 H450 V270 H490 V180 H510 V150 H530 V180 H550 V250 H600 V400 Z'
const NEON_LINES = [
  { d: 'M66 160 V200', color: C.neonPink },
  { d: 'M156 140 V180', color: C.waterGlow },
  { d: 'M276 150 H300', color: C.goldBright },
  { d: 'M396 150 V196', color: C.vita },
  { d: 'M514 170 H534', color: C.neonPink },
]
const WINDOWS = [
  [48, 270], [96, 250], [140, 220], [168, 150], [222, 290], [262, 200],
  [320, 280], [362, 230], [404, 250], [460, 300], [500, 210], [560, 290],
] as const

export function DrownedSkyline() {
  return (
    <div className={`pointer-events-none fixed inset-x-0 bottom-0 z-[1] h-[55vh] ${look.zoneCity}`} aria-hidden="true">
      <svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMax slice" className="h-full w-full" focusable="false">
        <path d={FAR_TOWERS} fill={C.farCity} opacity="0.85" />
        {WINDOWS.map(([x, y]) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="4" height="5" fill={C.goldBright} opacity="0.55" />
        ))}
        {NEON_LINES.map(({ d, color }) => (
          <path key={d} d={d} stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.7" />
        ))}
      </svg>
    </div>
  )
}

// The dark of the bottom of the city, over everything behind the contact.
export function AbyssVeil() {
  return <div className={`pointer-events-none fixed inset-0 z-[4] ${look.zoneAbyss}`} aria-hidden="true" />
}

export function WaterCaustics() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[2] overflow-hidden" aria-hidden="true">
      <div className={`absolute inset-0 ${look.causticsNear}`} />
      <div className={`absolute inset-0 ${look.causticsFar}`} />
    </div>
  )
}

// Six bubbles, fixed so every render draws the same water: their place, size, rise time, start and
// drift, and where each rests under reduced motion.
const BUBBLES = [
  { x: '8%', size: '0.5rem', rise: '16s', delay: '0s', drift: '1.5rem', rest: 0.3 },
  { x: '22%', size: '0.875rem', rise: '20s', delay: '-6s', drift: '2.5rem', rest: 0.62 },
  { x: '41%', size: '0.375rem', rise: '13s', delay: '-3s', drift: '1rem', rest: 0.45 },
  { x: '63%', size: '0.75rem', rise: '18s', delay: '-11s', drift: '2rem', rest: 0.78 },
  { x: '79%', size: '0.5rem', rise: '15s', delay: '-8s', drift: '1.25rem', rest: 0.2 },
  { x: '93%', size: '1rem', rise: '22s', delay: '-15s', drift: '2.75rem', rest: 0.55 },
]

export function UnderwaterBubbles() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[3] overflow-hidden" aria-hidden="true">
      {BUBBLES.map(({ x, size, rise, delay, drift, rest }) => (
        <div
          key={x}
          className={`absolute rounded-full ${look.bubble}`}
          style={{ '--x': x, '--size': size, '--rise': rise, '--delay': delay, '--drift': drift, '--rest': rest } as CSSProperties}
        />
      ))}
    </div>
  )
}
