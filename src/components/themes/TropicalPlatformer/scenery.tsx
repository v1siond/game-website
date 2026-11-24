import { memo, type ReactNode } from 'react'
import { TONE_VARS, type Tone } from './palette'
import { PropShading } from './props'
import paint from './scenery.module.css'

// The jungle's scenery: fan palms whose fronds split into fingers and droop, lit from above with a dark
// underside; ferns and round leaves in front; red blooms; a far treeline painted in flat bands.
//
// Every shape is drawn once in SceneryDefs (the world's root renders it) and placed with <use>; it
// paints from the tone of the scene round it (scenery.module.css), so the same palm is green by day,
// black against the sunset and teal at night. The stages (zones.tsx) place them.

// ---- the shapes ----

// A palm frond pointing right from its base at 0,0: the lit top edge, a darker underside split into
// hanging fingers, the rib and the cuts between the fingers.
const FROND = 'M0 0 C24 -20 64 -22 96 10 L88 14 L90 26 L76 20 L76 34 L62 24 L60 38 L48 26 L44 38 L34 24 L28 32 L20 18 L10 20 Z'
const FROND_UNDER = 'M2 6 C30 2 66 0 92 12 L88 14 L90 26 L76 20 L76 34 L62 24 L60 38 L48 26 L44 38 L34 24 L28 32 L20 18 L10 20 Z'
const FROND_RIB = 'M0 0 C28 -8 64 -6 94 11 M14 3 L20 18 M30 0 L34 24 M46 -1 L48 26 M62 0 L62 24 M76 4 L76 20'
const FROND_RIM = 'M4 -3 C28 -19 62 -20 92 6'

// The palm stands on 0,0 and its crown is 178 up; the trunk is ringed.
const CROWN = -178
const TRUNK_RINGS = Array.from({ length: 14 }, (_, i) => {
  const y = -168 + i * 12
  const half = 3 + ((y - CROWN) / -CROWN) * 5.5
  return `M${-half} ${y} Q0 ${y + 4} ${half} ${y}`
}).join(' ')

// The palm's fronds: the back pair first, darker, then the front ones drooping further down.
const BACK_FRONDS = [-76, -40]
const FRONT_FRONDS = [-12, 18, 46]

function Fronds({ angles }: { angles: number[] }) {
  return angles.flatMap((angle) => [
    <use key={`r${angle}`} href="#tp-frond" transform={`translate(0 ${CROWN}) rotate(${angle})`} />,
    <use key={`l${angle}`} href="#tp-frond" transform={`translate(0 ${CROWN}) scale(-1 1) rotate(${angle})`} />,
  ])
}

// A fern blade: leaflets in pairs up a stem, narrowing to the tip, 66 long.
const FERN_BLADE = (() => {
  const pairs = Array.from({ length: 9 }, (_, i) => ({ y: 6 + i * 6.5, w: 10 * (1 - i / 10) }))
  const right = pairs.map(({ y, w }) => `L${w.toFixed(1)} ${-(y + 2)} L1 ${-(y + 5)}`).join(' ')
  const left = [...pairs].reverse().map(({ y, w }) => `L-1 ${-(y + 5)} L${(-w).toFixed(1)} ${-(y + 2)}`).join(' ')
  return `M1 0 ${right} L0 -66 ${left} L-1 0 Z`
})()
const FERN_BLADES = [-58, -34, -12, 10, 32, 56]

const PETALS = [-48, -24, 0, 22, 46]


/** The shapes every scene places; drawn once by the world's root, never shown on their own. */
export const SceneryDefs = memo(function SceneryDefs() {
  return (
    <svg className="absolute h-0 w-0" aria-hidden="true" focusable="false">
      <defs>
        <g id="tp-frond">
          <path d={FROND} className={paint.leafLit} />
          <path d={FROND_UNDER} className={paint.leaf} />
          <path d={FROND_RIB} className={paint.rib} strokeWidth="1.4" />
          <path d={FROND_RIM} className={paint.rim} strokeWidth="2.2" opacity="0.7" />
        </g>

        <g id="tp-palm">
          <path d={`M-8 0 C-6 -60 -4 -120 -3 ${CROWN + 2} L3 ${CROWN + 2} C4 -120 6 -60 9 0 Z`} className={paint.trunk} />
          <path d={TRUNK_RINGS} className={paint.rib} strokeWidth="1.6" />
          <path d={`M3 ${CROWN + 4} C4 -120 6 -60 8.5 -2`} className={paint.rim} strokeWidth="1.6" opacity="0.6" />
          <g className={paint.back}>
            <Fronds angles={BACK_FRONDS} />
          </g>
          <circle cx="0" cy={CROWN + 2} r="8" className={paint.leafShade} />
          <ellipse cx="-6" cy={CROWN + 10} rx="4" ry="6" className={paint.leaf} />
          <ellipse cx="5" cy={CROWN + 11} rx="4" ry="6" className={paint.leaf} />
          <ellipse cx="0" cy={CROWN + 16} rx="4" ry="6" className={paint.leafShade} />
          <Fronds angles={FRONT_FRONDS} />
        </g>

        <g id="tp-fern">
          {FERN_BLADES.map((angle, i) => (
            <g key={angle} transform={`rotate(${angle}) scale(${i % 2 ? 1 : 0.82})`}>
              <path d={FERN_BLADE} className={i % 2 ? paint.leafLit : paint.leaf} />
              <path d="M0 0 L0 -64" className={paint.rib} strokeWidth="1.2" />
            </g>
          ))}
        </g>

        <g id="tp-broad">
          <path d="M0 -2 C10 -10 30 -14 34 4 C38 22 16 30 0 28 C-16 30 -38 22 -34 4 C-30 -14 -10 -10 0 -2 Z" className={paint.leafLit} />
          <path d="M-34 6 C-30 22 -12 30 0 28 C14 30 34 22 34 6 C20 14 -20 14 -34 6 Z" className={paint.leaf} />
          <path d="M0 -2 V26 M0 6 L-22 -2 M0 12 L-26 10 M0 6 L22 -2 M0 12 L26 10 M0 18 L-18 22 M0 18 L18 22" className={paint.rib} strokeWidth="1.3" />
          <path d="M-30 -4 C-24 -12 -10 -10 -2 -3 M2 -3 C10 -10 26 -12 32 0" className={paint.rim} strokeWidth="1.6" opacity="0.8" />
        </g>

        <g id="tp-bloom">
          {PETALS.map((angle) => (
            <g key={angle} transform={`rotate(${angle})`}>
              <path d="M0 0 C-9 -14 -7 -30 0 -42 C7 -30 9 -14 0 0 Z" className={paint.bloom} />
              <path d="M0 0 C6 -14 5 -28 0 -42 C7 -30 9 -14 0 0 Z" className={paint.fold} />
            </g>
          ))}
        </g>

        {/* The far treeline, 400 wide, in flat bands of distance. */}
        <g id="tp-treeline">
          <path d="M0 30 Q20 10 40 26 Q60 6 84 24 Q104 8 126 26 Q150 4 172 24 Q196 10 218 26 Q240 6 262 24 Q286 10 306 26 Q330 4 352 24 Q376 10 400 30 V100 H0 Z" className={paint.farLit} />
          <path d="M0 50 Q24 34 46 48 Q70 30 94 46 Q116 34 140 48 Q164 30 188 46 Q212 34 236 48 Q258 30 282 46 Q306 34 330 48 Q352 30 376 46 Q390 38 400 48 V100 H0 Z" className={paint.far} />
          {[60, 70, 80, 90].map((y) => (
            <rect key={y} x="0" y={y} width="400" height="3" className={paint.farLit} opacity="0.3" />
          ))}
        </g>
        <PropShading />
      </defs>
    </svg>
  )
})

/** A scope that gives the shapes inside it a tone. */
export function ToneScope({ tone, className = '', children }: { tone: Tone; className?: string; children: ReactNode }) {
  return (
    <div style={TONE_VARS[tone]} className={`${paint.scene} ${className}`}>
      {children}
    </div>
  )
}
