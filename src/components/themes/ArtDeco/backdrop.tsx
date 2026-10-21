import type { CSSProperties } from 'react'
import { DECO_COLORS as C } from './palette'
import look from './world.module.css'

// The fixed backdrop of the city under the sea behind every section: the SVG patterns, the deco
// pattern, the light rays through the dome, the caustic light and a few rising bubbles.
// Ambient loops stop under reduced motion (world.module.css).

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
    <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden" aria-hidden="true">
      {RAY_ANGLES.map((angle, i) => (
        <div key={angle} className={`absolute top-0 h-full w-44 origin-top ${RAY_LEFT[i]} ${angle} ${look.rays}`} />
      ))}
    </div>
  )
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
