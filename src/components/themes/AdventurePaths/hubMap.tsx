import type { ReactNode } from 'react'
import { PROFESSION_ORDER, type Profession } from '@/lib/cv/professions'
import { CompassRose } from './icons'
import { Cloud, cssVars, Hill, LevelTile, TrailBed, TrailDots, Trees, Waves } from './art'
import { TRAIL } from './palette'
import { buildTrail, dotsAlong, type Point, type Trail } from './trail'
import map from './map.module.css'

// The hub map he arrives on: an island drawn in ink and washed in watercolour, the harbour where he lands
// at the south shore, a crossroads in the middle, and one landmark per profession at the end of its own
// trail: the observatory on the cliff plateau (System Engineer), the stone amphitheatre with the great
// drum (Musician), the temple terrace with the fighting ring (Martial Artist). The geometry is map units
// in a 1000 by 600 box; the hero lays HTML buttons over the landmarks at the same shares.

export const HUB = { width: 1000, height: 600 } as const

const HARBOUR: Point = [500, 538]
const CROSSROADS: Point = [500, 408]

/** The stretch from the harbour to the crossroads, walked once on arrival. */
export const ARRIVAL = buildTrail([HARBOUR, [462, 478], CROSSROADS])

/** Each profession's trail, from the crossroads out to its landmark's tile. */
export const BRANCHES: Record<Profession, Trail> = {
  engineer: buildTrail([CROSSROADS, [408, 396], [318, 344], [222, 304]]),
  drummer: buildTrail([CROSSROADS, [552, 342], [468, 266], [500, 196]]),
  fighter: buildTrail([CROSSROADS, [604, 400], [704, 356], [790, 318]]),
}

/** The landmark tile at the end of a profession's trail. */
export const landmarkPoint = (profession: Profession): Point => BRANCHES[profession].samples[BRANCHES[profession].samples.length - 1]

const DOT_STEP = 34

const ARRIVAL_DOTS = dotsAlong(ARRIVAL, DOT_STEP)
const BRANCH_DOTS = PROFESSION_ORDER.map((profession) => ({ profession, dots: dotsAlong(BRANCHES[profession], DOT_STEP) }))

const ISLAND =
  'M120 300 C108 196 214 120 330 128 C424 88 560 70 662 108 C772 98 902 168 900 272 C928 362 862 448 760 470 C700 520 600 560 520 572 C440 582 330 562 258 500 C168 470 110 402 120 300 Z'

const PLATEAU = 'M118 292 C114 238 190 214 252 226 C316 236 336 282 302 312 C262 340 150 338 118 292 Z'

const RIVER = 'M566 232 C600 262 640 270 664 300 C690 334 742 344 792 352 C836 360 868 384 902 380'

const WAVES = [
  [40, 70],
  [130, 40],
  [880, 60],
  [950, 120],
  [30, 420],
  [70, 520],
  [930, 470],
  [880, 560],
  [250, 580],
  [690, 585],
  [960, 300],
  [40, 230],
] as const

// ---- the three landmarks, each drawn with its foot at (0, 0) ----

function Observatory() {
  return (
    <g>
      <rect x={-22} y={-62} width={44} height={60} fill="url(#ap-stone)" stroke={TRAIL.INK} strokeWidth={2} />
      <path d="M-22 -40 H22 M-22 -20 H22 M-8 -62 V-40 M10 -40 V-20 M-12 -20 V-2" stroke={TRAIL.STONE_DARK} strokeWidth={1.2} />
      <path d="M-26 -62 Q-26 -92 0 -94 Q26 -92 26 -62 Z" fill={TRAIL.SEA_DEEP} stroke={TRAIL.INK} strokeWidth={2} />
      <path d="M-14 -70 Q-12 -86 2 -88" stroke={TRAIL.SEA} strokeWidth={3} fill="none" strokeLinecap="round" />
      <rect x={-3} y={-94} width={6} height={30} fill={TRAIL.INK} />
      <path d="M2 -82 L30 -100 L33 -95 L6 -76 Z" fill={TRAIL.WOOD} stroke={TRAIL.INK} strokeWidth={1.4} />
      <rect x={-8} y={-50} width={16} height={12} rx={2} fill={TRAIL.RUNE} stroke={TRAIL.INK} strokeWidth={1.4} />
      <path d="M-5 -46 H1 M-5 -42 H5" stroke={TRAIL.NIGHT} strokeWidth={1.4} />
      <rect x={-10} y={-18} width={20} height={16} rx={8} fill={TRAIL.BARK} stroke={TRAIL.INK} strokeWidth={1.6} />
    </g>
  )
}

function Amphitheatre() {
  return (
    <g>
      <path d="M-70 -6 Q-70 -58 0 -60 Q70 -58 70 -6 Z" fill="url(#ap-stone)" stroke={TRAIL.INK} strokeWidth={2} />
      <path d="M-56 -8 Q-56 -46 0 -48 Q56 -46 56 -8" fill="none" stroke={TRAIL.STONE_DARK} strokeWidth={2} />
      <path d="M-42 -8 Q-42 -34 0 -36 Q42 -34 42 -8" fill="none" stroke={TRAIL.STONE_DARK} strokeWidth={2} />
      <ellipse cx={0} cy={-6} rx={34} ry={8} fill={TRAIL.SAND} stroke={TRAIL.INK} strokeWidth={1.6} />
      <rect x={-15} y={-34} width={30} height={22} fill={TRAIL.ROUTE} stroke={TRAIL.INK} strokeWidth={1.8} />
      <ellipse cx={0} cy={-34} rx={15} ry={5} fill={TRAIL.PAGE} stroke={TRAIL.INK} strokeWidth={1.8} />
      <path d="M-15 -30 L-5 -14 L5 -30 L15 -14" stroke={TRAIL.GOLD} strokeWidth={1.6} fill="none" />
      {[-62, 62].map((x, i) => (
        <g key={x}>
          <rect x={x - 2} y={-36} width={4} height={30} fill={TRAIL.BARK} />
          <path className={map.flame} style={cssVars({ '--i': i })} d={`M${x} -52 Q${x + 7} -42 ${x + 3} -36 H${x - 3} Q${x - 7} -42 ${x} -52 Z`} fill={TRAIL.GOLD} stroke={TRAIL.ROUTE} strokeWidth={1.2} />
        </g>
      ))}
    </g>
  )
}

function TempleTerrace() {
  return (
    <g>
      <path d="M-62 -2 H62 L54 -18 H-54 Z" fill="url(#ap-stone)" stroke={TRAIL.INK} strokeWidth={2} />
      <path d="M-50 -18 H50 L42 -34 H-42 Z" fill="url(#ap-stone)" stroke={TRAIL.INK} strokeWidth={2} />
      <path d="M-38 -34 H38 L32 -46 H-32 Z" fill={TRAIL.SAND} stroke={TRAIL.INK} strokeWidth={2} />
      {[-30, -10, 10, 30].map((x) => (
        <rect key={x} x={x - 2} y={-74} width={4} height={30} fill={TRAIL.WOOD} stroke={TRAIL.INK} strokeWidth={1} />
      ))}
      {[-68, -60, -52].map((y) => (
        <path key={y} d={`M-30 ${y} H30`} stroke={TRAIL.ROUTE} strokeWidth={2.2} />
      ))}
      <path d="M-56 -18 V-58 L-44 -52 L-56 -46" fill={TRAIL.ROUTE} stroke={TRAIL.INK} strokeWidth={1.2} />
      <path d="M56 -18 V-58 L44 -52 L56 -46" fill={TRAIL.ROUTE} stroke={TRAIL.INK} strokeWidth={1.2} />
      <path d="M-24 -10 H24" stroke={TRAIL.STONE_DARK} strokeWidth={1.4} />
    </g>
  )
}

const LANDMARKS: Record<Profession, { art: ReactNode; lift: number }> = {
  engineer: { art: <Observatory />, lift: 16 },
  drummer: { art: <Amphitheatre />, lift: 14 },
  fighter: { art: <TempleTerrace />, lift: 14 },
}

/** The island, its scenery, the landmarks, the trails and the tiles, with the fall washes laid over the
 *  summer ones (hidden until the map turns, see .fall). */
export function HubMapArt() {
  return (
    <svg viewBox={`0 0 ${HUB.width} ${HUB.height}`} className="block h-auto w-full" aria-hidden="true" focusable="false">
      <rect width={HUB.width} height={HUB.height} fill="url(#ap-paper)" />
      <rect width={HUB.width} height={HUB.height} fill="url(#ap-sea)" />
      <rect width={HUB.width} height={HUB.height} fill={TRAIL.TEAL} opacity={0.35} className={map.fall} />
      <Waves points={WAVES} />

      {/* the coast echoed outward in ink, the old map makers' way of drawing shallow water */}
      <g fill="none" stroke={TRAIL.SEA_DEEP} strokeWidth={1.4} opacity={0.6}>
        <path d={ISLAND} transform="translate(500 330) scale(1.05) translate(-500 -330)" />
        <path d={ISLAND} transform="translate(500 330) scale(1.1) translate(-500 -330)" strokeDasharray="6 8" />
      </g>

      <g className={map.inked} style={cssVars({ '--i': 0 })}>
        <path d={ISLAND} fill={TRAIL.SAND} stroke={TRAIL.INK} strokeWidth={3} />
        <path d={ISLAND} fill="url(#ap-meadow)" transform="translate(500 320) scale(0.94) translate(-500 -320)" />
        <path d={ISLAND} fill="url(#ap-fall)" transform="translate(500 320) scale(0.94) translate(-500 -320)" className={map.fall} />
        <path d={ISLAND} fill="url(#ap-hatch)" transform="translate(500 320) scale(0.94) translate(-500 -320)" />
        <path d={RIVER} fill="none" stroke={TRAIL.SEA_DEEP} strokeWidth={12} strokeLinecap="round" />
        <path d={RIVER} fill="none" stroke={TRAIL.SEA} strokeWidth={7} strokeLinecap="round" />
        <g transform="translate(0 28)">
          <path d={PLATEAU} fill="url(#ap-cliff)" stroke={TRAIL.INK} strokeWidth={2.4} />
          <path d="M140 300 V326 M176 316 V344 M214 320 V346 M252 316 V342 M290 304 V328" stroke={TRAIL.CLIFF_DARK} strokeWidth={2} />
        </g>
        <path d={PLATEAU} fill="url(#ap-meadow)" stroke={TRAIL.INK} strokeWidth={2.4} />
        <path d={PLATEAU} fill="url(#ap-fall)" stroke={TRAIL.INK} strokeWidth={2.4} className={map.fall} />
      </g>

      <g className={map.inked} style={cssVars({ '--i': 1 })}>
        <Trees x={380} y={170} />
        <Trees x={660} y={170} s={0.9} />
        <Trees x={320} y={470} s={1.1} />
        <Trees x={700} y={470} />
        <Trees x={860} y={250} s={0.8} />
        <Trees x={160} y={410} s={0.9} />
        {/* the plank bridge where the fighter's trail crosses the river */}
        <g transform="translate(688 336) rotate(-22)">
          <rect x={-16} y={-9} width={32} height={18} fill="url(#ap-wood)" stroke={TRAIL.INK} strokeWidth={1.6} />
          <path d="M-8 -9 V9 M0 -9 V9 M8 -9 V9" stroke={TRAIL.BARK} strokeWidth={1.2} />
        </g>
      </g>

      <g className={map.inked} style={cssVars({ '--i': 2 })}>
        <Hill x={420} y={300} w={64} h={46} i={0} />
        <Hill x={612} y={250} w={58} h={40} i={1} />
        <Hill x={250} y={420} w={70} h={50} i={2} />
        <Hill x={770} y={430} w={62} h={44} i={3} />
      </g>

      {/* the harbour: a jetty into the sea and the ship that brought him, rocking at anchor */}
      <g className={map.inked} style={cssVars({ '--i': 3 })}>
        <rect x={488} y={540} width={24} height={44} fill="url(#ap-wood)" stroke={TRAIL.INK} strokeWidth={1.6} />
        <g className={map.ship}>
          <path d="M556 566 H612 L600 584 H566 Z" fill="url(#ap-wood)" stroke={TRAIL.INK} strokeWidth={1.8} />
          <rect x={582} y={522} width={3} height={44} fill={TRAIL.BARK} />
          <path d="M586 526 L610 556 H586 Z" fill={TRAIL.PAGE} stroke={TRAIL.INK} strokeWidth={1.4} />
          <path d="M582 526 L566 552 H582 Z" fill={TRAIL.PARCHMENT} stroke={TRAIL.INK} strokeWidth={1.2} />
        </g>
      </g>

      <g>
        <TrailBed trail={ARRIVAL} />
        {PROFESSION_ORDER.map((profession) => (
          <TrailBed key={profession} trail={BRANCHES[profession]} />
        ))}
        <TrailDots dots={ARRIVAL_DOTS} />
        {BRANCH_DOTS.map(({ profession, dots }) => (
          <TrailDots key={profession} dots={dots} leg={1} />
        ))}
      </g>

      {PROFESSION_ORDER.map((profession, index) => {
        const [x, y] = landmarkPoint(profession)
        return (
          <g key={profession} className={map.inked} style={cssVars({ '--i': 4 + index })}>
            <g transform={`translate(${x} ${y - LANDMARKS[profession].lift})`}>{LANDMARKS[profession].art}</g>
          </g>
        )
      })}

      <LevelTile x={HARBOUR[0]} y={HARBOUR[1]} kind="exit" className={map.tileLit} />
      <LevelTile x={CROSSROADS[0]} y={CROSSROADS[1]} r={9} kind="stop" className={map.tileLit} />
      {PROFESSION_ORDER.map((profession) => {
        const [x, y] = landmarkPoint(profession)
        return <LevelTile key={profession} x={x} y={y} r={15} kind="exit" className={map.tileLit} />
      })}

      <Cloud x={230} y={110} s={1} i={0} depth="18px" />
      <Cloud x={800} y={150} s={0.8} i={1} depth="10px" />
    </svg>
  )
}

export function HubCompass() {
  return <CompassRose className="h-12 w-12 sm:h-16 sm:w-16" />
}
