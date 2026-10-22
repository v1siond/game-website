'use client'

import type { CSSProperties } from 'react'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { useLabels } from '@/components/cv/CVDataProvider'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { useScrollScene } from '@/hooks/useScrollScene'
import { NameWords } from '@/components/cv/NameWords'
import { CVLink, HeroAction, PortfolioLink } from './actions'
import { DECO_COLORS as C } from './palette'
import descent from './descent.module.css'

// The recruiter first screen as the ride down: a brass porthole on the bathysphere. The deco shutter
// over the glass rises on the lighthouse on its rock; then the visitor's scroll IS the descent: the view
// sinks past the surface, the rails and the light shafts, a whale glides across the glass halfway down,
// and the lit towers of the city rise into the glass, the depth gauge swinging with every metre. His
// name buzzes on as a neon sign, letter by letter, and the headline and actions rise beside it.
//
// Pattern: the shutter and the sign are CSS delays off one trigger (data-on from useSectionTrigger:
// shutter 0.15 to 1.25 s, letters from 0.9 s 60 ms apart, text and actions from 1.4 s). The sink, the
// whale, the needle and the windows read --scene-progress, which the shared scroll engine writes on the
// porthole over the first 70 percent of a screen of scroll, so React never renders per frame and the
// ride, once at the bottom, stays there. The far towers, the near towers and the glare shift apart with
// the pointer (--mx, --my from the root). Reduced motion starts the scene done: the city and the lit sign.

const BOLTS = Array.from({ length: 8 }, (_, i) => (i * Math.PI) / 4)
const GAUGE_TICKS = Array.from({ length: 9 }, (_, i) => -120 + i * 30)
const SHUTTER_RAYS = Array.from({ length: 9 }, (_, i) => -80 + i * 20)

// A stepped tower with a spire, standing on y = 600, in the shaft's 200 by 600 box.
const tower = (x: number, width: number, height: number) => {
  const top = 600 - height
  const step = width * 0.16
  return `M${x} 600 V${top + 24} H${x + step} V${top + 12} H${x + step * 2} V${top} H${x + width - step * 2} V${top + 12} H${x + width - step} V${top + 24} H${x + width} V600 Z`
}

const FAR_TOWERS = [
  { x: -6, width: 34, height: 70 },
  { x: 40, width: 30, height: 96 },
  { x: 128, width: 36, height: 82 },
  { x: 172, width: 34, height: 64 },
]

const NEAR_TOWERS = [
  { x: 6, width: 44, height: 118 },
  { x: 74, width: 52, height: 160 },
  { x: 150, width: 44, height: 128 },
]

const windowsOf = ({ x, width, height }: (typeof NEAR_TOWERS)[number]) =>
  Array.from({ length: Math.floor((height - 40) / 14) }, (_, row) =>
    [0.3, 0.55, 0.8].map((column) => ({ x: x + width * column - 2, y: 600 - height + 34 + row * 14 })),
  ).flat()

const WINDOWS = NEAR_TOWERS.flatMap(windowsOf).filter((_, i) => i % 3 !== 1)

// The shaft seen through the porthole, top to bottom: night sky and the lighthouse (0 to 170), the
// surface, the descent with its rails and light shafts (170 to 420), the city floor (420 to 600).
function Shaft() {
  return (
    <svg viewBox="0 0 200 600" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="deco-shaft-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0b1626" />
          <stop offset="0.27" stopColor={C.surface} />
          <stop offset="0.3" stopColor={C.tealDark} />
          <stop offset="0.6" stopColor={C.deepSea} />
          <stop offset="1" stopColor={C.abyss} />
        </linearGradient>
        <linearGradient id="deco-shaft-ray" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.waterGlow} stopOpacity="0.35" />
          <stop offset="1" stopColor={C.waterGlow} stopOpacity="0" />
        </linearGradient>
        <radialGradient id="deco-shaft-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={C.goldBright} stopOpacity="0.55" />
          <stop offset="1" stopColor={C.goldBright} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="200" height="600" fill="url(#deco-shaft-water)" />

      {/* the lighthouse on its rock, its lamp lit, the beam cutting the storm */}
      <path d="M0 150 Q40 120 70 138 L130 132 Q170 120 200 146 V170 H0 Z" fill="#0d1a24" />
      <path d="M86 132 L92 60 H108 L114 132 Z" fill={C.cream} opacity="0.85" />
      <path d="M88 112 H112 M90 90 H110" stroke={C.blood} strokeWidth="6" />
      <rect x="88" y="48" width="24" height="12" fill={C.brassDark} />
      <path d="M86 48 L100 36 L114 48 Z" fill={C.brassDark} />
      <circle cx="100" cy="54" r="5" fill={C.goldBright} />
      <circle cx="100" cy="54" r="22" fill="url(#deco-shaft-glow)" />
      <path d="M104 52 L200 30 L200 44 Z" fill={C.goldBright} opacity="0.18" />

      {/* the surface, and the lighthouse's footing going down to the station */}
      <path d="M0 168 Q25 162 50 168 T100 168 T150 168 T200 168" fill="none" stroke={C.waterGlow} strokeWidth="2" opacity="0.6" />
      <rect x="84" y="170" width="32" height="130" fill="#0b2a36" />
      <path d="M84 300 L70 330 H130 L116 300 Z" fill="#0b2a36" />

      {/* the rails the sphere rides down, and the light shafts from above */}
      <path d="M58 176 V600 M142 176 V600" stroke={C.brassDark} strokeWidth="1.5" opacity="0.7" />
      {[200, 240, 280, 320, 360, 400].map((y) => (
        <path key={y} d={`M58 ${y} H142`} stroke={C.brassDark} strokeWidth="0.8" opacity="0.35" />
      ))}
      <path d="M20 170 L50 170 L90 420 L40 420 Z" fill="url(#deco-shaft-ray)" />
      <path d="M140 170 L165 170 L190 380 L150 380 Z" fill="url(#deco-shaft-ray)" />

      {/* a school of fish crossing the descent */}
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={`M${30 + i * 9} ${262 + (i % 2) * 6} l6 -2 l-6 -2 l2 2 Z`} fill={C.waterGlow} opacity="0.55" />
      ))}

      {/* a whale crossing the descent, far off in the green, its own layer so the scroll can carry it */}
      <g className={descent.whale}>
        <path d="M60 300 Q80 286 112 290 Q130 292 140 298 L152 290 L150 302 L156 312 L141 306 Q128 314 106 314 Q76 314 60 300 Z" fill="#0e3a44" />
        <path d="M76 308 Q96 318 120 312" fill="none" stroke="#1d5560" strokeWidth="1.5" />
        <circle cx="72" cy="299" r="1.2" fill={C.waterGlow} opacity="0.7" />
        <path d="M96 312 L90 324 L104 314 Z" fill="#0e3a44" />
      </g>

      {/* the far skyline of the city */}
      {FAR_TOWERS.map(({ x, width, height }) => (
        <path key={x} d={tower(x, width, height)} fill="#0a2236" />
      ))}
    </svg>
  )
}

// The near towers with their sunburst crowns and the glass tunnel; a layer of its own so the pointer
// can move it against the far skyline.
function NearCity() {
  return (
    <svg viewBox="0 0 200 600" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true" focusable="false">
      <path d="M-10 560 Q100 500 210 560" fill="none" stroke={C.waterGlow} strokeWidth="6" opacity="0.25" />
      {NEAR_TOWERS.map(({ x, width, height }) => (
        <g key={x}>
          <path d={tower(x, width, height)} fill="#0e2c44" stroke={C.brassDark} strokeWidth="0.8" />
          <path d={`M${x + width / 2} ${600 - height} V${600 - height - 22}`} stroke={C.gold} strokeWidth="1.2" />
          <path
            d={`M${x + width * 0.25} ${600 - height} A${width * 0.25} ${width * 0.25} 0 0 1 ${x + width * 0.75} ${600 - height}`}
            fill="none"
            stroke={C.gold}
            strokeWidth="1"
          />
        </g>
      ))}
    </svg>
  )
}

// The lit windows and the neon of the near towers, one layer that comes on as the sphere arrives.
function CityLights() {
  return (
    <svg viewBox="0 0 200 600" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true" focusable="false">
      {WINDOWS.map(({ x, y }) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="4" height="6" fill={C.goldBright} />
      ))}
      <path d="M78 470 H122" stroke={C.neonPink} strokeWidth="2" />
      <path d="M12 520 H44 M156 506 H188" stroke={C.waterGlow} strokeWidth="1.5" />
    </svg>
  )
}

// The deco shutter over the glass: a sunburst over two brass leaves, the screen the ride raises.
function Shutter() {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true" focusable="false">
      <rect width="200" height="200" fill={C.brassDark} />
      <rect y="100" width="200" height="100" fill="#6b5818" />
      {SHUTTER_RAYS.map((angle) => (
        <path
          key={angle}
          d={`M100 150 L${100 + Math.sin((angle * Math.PI) / 180) * 140} ${150 - Math.cos((angle * Math.PI) / 180) * 140}`}
          stroke={C.goldBright}
          strokeWidth="2"
          opacity="0.55"
        />
      ))}
      <circle cx="100" cy="150" r="22" fill={C.gold} />
      <path d="M0 100 H200" stroke={C.abyss} strokeWidth="2" />
      {[30, 60, 140, 170].map((x) => (
        <path key={x} d={`M${x} 170 L${x + 8} 182 L${x} 194 L${x - 8} 182 Z`} fill={C.gold} opacity="0.7" />
      ))}
    </svg>
  )
}

// The brass rim with its eight bolts, drawn over the glass.
function Rim() {
  return (
    <svg viewBox="0 0 240 240" className="pointer-events-none absolute -inset-[10%] h-[120%] w-[120%]" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="deco-rim" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={C.goldBright} />
          <stop offset="0.45" stopColor={C.brassMid} />
          <stop offset="1" stopColor="#4a3a0c" />
        </linearGradient>
      </defs>
      <circle cx="120" cy="120" r="110" fill="none" stroke="url(#deco-rim)" strokeWidth="20" />
      <circle cx="120" cy="120" r="100" fill="none" stroke="#3a2c08" strokeWidth="2" />
      <circle cx="120" cy="120" r="119" fill="none" stroke="#3a2c08" strokeWidth="1.5" />
      {BOLTS.map((angle) => (
        <g key={angle}>
          <circle cx={120 + Math.cos(angle) * 110} cy={120 + Math.sin(angle) * 110} r="5.5" fill="#5a4610" />
          <circle cx={120 + Math.cos(angle) * 110 - 1.2} cy={120 + Math.sin(angle) * 110 - 1.2} r="3" fill={C.goldBright} />
        </g>
      ))}
    </svg>
  )
}

// The depth gauge bolted beside the glass; its needle swings round as the sphere sinks.
function DepthGauge() {
  return (
    <svg viewBox="0 0 80 80" className="absolute -bottom-2 -right-2 h-20 w-20 sm:h-24 sm:w-24" aria-hidden="true" focusable="false">
      <circle cx="40" cy="40" r="37" fill={C.cream} stroke={C.brassMid} strokeWidth="5" />
      {GAUGE_TICKS.map((angle) => (
        <path key={angle} d="M40 10 V17" stroke={C.sepia} strokeWidth={angle % 60 === 0 ? 2.5 : 1.2} transform={`rotate(${angle} 40 40)`} />
      ))}
      <path d="M22 58 A24 24 0 0 0 58 58" fill="none" stroke={C.blood} strokeWidth="3" />
      <g className={descent.needle}>
        <path d="M40 40 L40 14" stroke={C.blood} strokeWidth="2.5" strokeLinecap="round" />
      </g>
      <circle cx="40" cy="40" r="4" fill={C.brassDark} />
    </svg>
  )
}

const BUBBLE_PLACES = ['left-[28%]', 'left-[52%]', 'left-[70%]']

// The ride runs over the first 70 percent of a screen of scroll from where the page opens.
const DESCENT_LINES = { start: 0.12, end: -0.58 }

function Porthole() {
  const { ref } = useScrollScene<HTMLDivElement>(DESCENT_LINES)

  return (
    <div ref={ref} className={`relative mx-auto aspect-square w-60 sm:w-72 lg:w-80 ${descent.follow}`}>
      <div className="absolute inset-0 overflow-hidden rounded-full bg-[color:var(--deco-abyss)]">
        <div className={`absolute inset-x-0 top-0 h-[300%] ${descent.shaft}`}>
          <div className={`absolute inset-0 ${descent.far}`}>
            <Shaft />
          </div>
          <div className={`absolute inset-0 ${descent.near}`}>
            <NearCity />
            <div className={`absolute inset-0 ${descent.lights}`}>
              <CityLights />
            </div>
          </div>
        </div>
        {BUBBLE_PLACES.map((place, i) => (
          <span key={place} className={`absolute bottom-0 h-2.5 w-2.5 rounded-full ${place} ${descent.bubble}`} style={{ '--i': i } as CSSProperties} />
        ))}
        <div className={`absolute inset-0 ${descent.glare}`} />
        <div className={`absolute inset-0 ${descent.shutter}`}>
          <Shutter />
        </div>
      </div>
      <Rim />
      <DepthGauge />
    </div>
  )
}

/** His name as a neon sign whose letters buzz on one after another; read whole by screen readers. */
function NeonName({ name }: { name: string }) {
  return (
    <>
      <span className="sr-only">{name}</span>
      <span aria-hidden="true">
        <NameWords
          name={name}
          letter={(letter, i) => (
            <span className={descent.letter} style={{ '--i': i } as CSSProperties}>
              {letter}
            </span>
          )}
        />
      </span>
    </>
  )
}

export function BathysphereHero() {
  const { ref, triggered } = useSectionTrigger({ threshold: 0.1, rootMargin: '0px' })
  const { navigation } = useLabels()

  return (
    <RecruiterHero
      render={({ name, headline, tagline, line, actions }) => (
        <div
          ref={ref}
          data-on={triggered || undefined}
          className={`mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[auto_minmax(0,1fr)] md:gap-14 ${descent.hero}`}
          style={{ '--n': name.length } as CSSProperties}
        >
          <Porthole />

          <div className="text-center md:text-left">
            <h1 className={`text-[clamp(1.75rem,8vw,3rem)] uppercase ${descent.sign}`}>
              <NeonName name={name} />
            </h1>
            <div className={descent.after}>
              <p className="mt-5 text-lg tracking-wide text-[color:var(--deco-cream)]">{headline}</p>
              <p className="mt-2 text-base italic text-[color:var(--deco-gold)]">{tagline}</p>
              <p className="mt-2 text-base text-[color:var(--deco-mist)]">{line}</p>
              <nav className="mt-7 flex flex-wrap items-center justify-center gap-3 md:justify-start" aria-label={navigation.contactAndCv}>
                {actions.map((action) => (
                  <HeroAction key={action.id} action={action} />
                ))}
                <CVLink />
                <PortfolioLink />
              </nav>
            </div>
          </div>
        </div>
      )}
    />
  )
}
