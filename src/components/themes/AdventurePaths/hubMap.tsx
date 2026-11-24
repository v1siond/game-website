import { memo, type ReactNode } from 'react'
import { PROFESSION_ORDER, type Profession } from '@/lib/cv/professions'
import { CompassRose } from './icons'
import { Cloud, LevelTile, TrailBed } from './art'
import { TRAIL } from './palette'
import { buildTrail, type Point, type Trail } from './trail'
import map from './map.module.css'

// The world map he starts on, the overhead screen of the 16 bit platformer: an island in a flat blue sea
// with its cliffs under a flat green meadow, every shape edged in black, sand paths, round bushes, his
// house at the south shore where the path starts, a crossroads in the middle, and one place per profession
// at the end of its own path: the castle on the cliff plateau (System Engineer), the note block bonus
// (Musician), the fortress past the river (Martial Artist). The geometry is map units in a 1000 by 600
// box; the hero lays HTML buttons over the places at the same shares.

export const HUB = { width: 1000, height: 600 } as const

const HARBOUR: Point = [500, 538]
const CROSSROADS: Point = [500, 408]

/** The stretch from the harbour to the crossroads, walked once on arrival. */
const ARRIVAL = buildTrail([HARBOUR, [462, 478], CROSSROADS])

/** Each profession's trail, from the crossroads out to its landmark's tile. */
export const BRANCHES: Record<Profession, Trail> = {
  engineer: buildTrail([CROSSROADS, [408, 396], [318, 344], [222, 304]]),
  drummer: buildTrail([CROSSROADS, [552, 342], [468, 266], [500, 196]]),
  fighter: buildTrail([CROSSROADS, [604, 400], [704, 356], [790, 318]]),
}

/** The landmark tile at the end of a profession's trail. */
export const landmarkPoint = (profession: Profession): Point => BRANCHES[profession].samples[BRANCHES[profession].samples.length - 1]

const ISLAND =
  'M120 300 C108 196 214 120 330 128 C424 88 560 70 662 108 C772 98 902 168 900 272 C928 362 862 448 760 470 C700 520 600 560 520 572 C440 582 330 562 258 500 C168 470 110 402 120 300 Z'

const PLATEAU = 'M118 292 C114 238 190 214 252 226 C316 236 336 282 302 312 C262 340 150 338 118 292 Z'

const RIVER = 'M566 232 C600 262 640 270 664 300 C690 334 742 344 792 352 C836 360 868 384 902 380'

// The sea's wave dashes, as the 16 bit map draws them.
const WAVES: ReadonlyArray<readonly [number, number]> = [
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
]

// The round bushes on the meadow, each a pill edged in black.
const BUSHES: ReadonlyArray<readonly [number, number, number]> = [
  [380, 170, 1],
  [660, 170, 0.9],
  [320, 470, 1.1],
  [700, 470, 1],
  [860, 250, 0.8],
  [160, 410, 0.9],
]

const EDGE = { stroke: TRAIL.HUD, strokeWidth: 3 }

function Bush({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-22} y={-30} width={20} height={30} rx={10} fill={TRAIL.MEADOW_DARK} {...EDGE} />
      <rect x={-4} y={-38} width={22} height={38} rx={11} fill={TRAIL.MEADOW_DARK} {...EDGE} />
      <rect x={12} y={-26} width={18} height={26} rx={9} fill={TRAIL.MEADOW_DARK} {...EDGE} />
    </g>
  )
}

// ---- the places, each drawn with its foot at (0, 0) ----

function Castle() {
  return (
    <g>
      {[-26, 0, 26].map((dx) => (
        <g key={dx}>
          <rect x={dx - 11} y={dx === 0 ? -78 : -60} width={22} height={dx === 0 ? 78 : 60} fill={TRAIL.STONE} {...EDGE} />
          <path d={`M${dx - 11} ${dx === 0 ? -78 : -60} v-8 h7 v8 h8 v-8 h7 v8`} fill={TRAIL.STONE} {...EDGE} />
        </g>
      ))}
      <rect x={-7} y={-22} width={14} height={22} rx={7} fill={TRAIL.HUD} />
    </g>
  )
}

function NoteBlock() {
  return (
    <g>
      <rect x={-22} y={-46} width={44} height={44} rx={4} fill={TRAIL.BLOCK} {...EDGE} />
      <path d="M-18 -42 H18 V-38 H-14 V-6 H-18 Z" fill={TRAIL.PAGE} opacity={0.55} />
      <path d="M-4 -36 H8 V-30 H2 V-14 A5 4 0 1 1 -2 -18 V-36 Z" fill={TRAIL.HUD} />
    </g>
  )
}

function Fortress() {
  return (
    <g>
      <rect x={-30} y={-50} width={60} height={50} fill={TRAIL.FORT_GOLD} {...EDGE} />
      <path d="M-30 -50 v-10 h12 v10 h12 v-10 h12 v10 h12 v-10 h12 v10" fill={TRAIL.FORT_GOLD} {...EDGE} />
      <rect x={-8} y={-24} width={16} height={24} fill={TRAIL.HUD} />
    </g>
  )
}

function House() {
  return (
    <g>
      <rect x={-20} y={-28} width={40} height={28} fill={TRAIL.PAGE} {...EDGE} />
      <path d="M-28 -26 L0 -50 L28 -26 Z" fill={TRAIL.ROUTE} {...EDGE} strokeLinejoin="round" />
      <rect x={-6} y={-16} width={12} height={16} fill={TRAIL.WOOD} />
    </g>
  )
}

const LANDMARKS: Record<Profession, { art: ReactNode; lift: number }> = {
  engineer: { art: <Castle />, lift: 16 },
  drummer: { art: <NoteBlock />, lift: 14 },
  fighter: { art: <Fortress />, lift: 14 },
}

/** The island, its scenery, the places, the paths and the tiles, with the fall colours laid over the
 *  summer ones (hidden until the map turns, see .fall). It takes no props, so memo keeps the whole map
 *  out of the hub's renders (his walk, the dive, the name box). */
export const HubMapArt = memo(function HubMapArt() {
  return (
    <svg viewBox={`0 0 ${HUB.width} ${HUB.height}`} className="block h-auto w-full" aria-hidden="true" focusable="false">
      <rect width={HUB.width} height={HUB.height} fill={TRAIL.SEA} />
      <rect width={HUB.width} height={HUB.height} fill={TRAIL.TEAL} opacity={0.5} className={map.fall} />
      {WAVES.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={26} height={5} fill={TRAIL.SEA_DEEP} />
      ))}

      <g>
        <path d={ISLAND} transform="translate(0 18)" fill={TRAIL.CLIFF_DARK} {...EDGE} />
        <path d={ISLAND} fill={TRAIL.MEADOW} {...EDGE} />
        <path d={ISLAND} fill={TRAIL.FALL} {...EDGE} className={map.fall} />
        <path d={RIVER} fill="none" stroke={TRAIL.HUD} strokeWidth={14} strokeLinecap="round" />
        <path d={RIVER} fill="none" stroke={TRAIL.SEA} strokeWidth={9} strokeLinecap="round" />
        <path d={PLATEAU} transform="translate(0 24)" fill={TRAIL.CLIFF} {...EDGE} />
        <path d={PLATEAU} fill={TRAIL.MEADOW} {...EDGE} />
        <path d={PLATEAU} fill={TRAIL.FALL} {...EDGE} className={map.fall} />
      </g>

      {BUSHES.map(([x, y, s]) => (
        <Bush key={x} x={x} y={y} s={s} />
      ))}

      {/* the plank bridge where the fighter's path crosses the river */}
      <g transform="translate(688 336) rotate(-22)">
        <rect x={-16} y={-9} width={32} height={18} fill={TRAIL.WOOD} {...EDGE} />
        <path d="M-8 -9 V9 M0 -9 V9 M8 -9 V9" stroke={TRAIL.BARK} strokeWidth={2} />
      </g>

      <g>
        <TrailBed trail={ARRIVAL} />
        {PROFESSION_ORDER.map((profession) => (
          <TrailBed key={profession} trail={BRANCHES[profession]} />
        ))}
      </g>

      <g transform={`translate(${HARBOUR[0] + 46} ${HARBOUR[1] + 6})`}>
        <House />
      </g>
      {PROFESSION_ORDER.map((profession) => {
        const [x, y] = landmarkPoint(profession)
        return (
          <g key={profession} transform={`translate(${x} ${y - LANDMARKS[profession].lift})`}>
            {LANDMARKS[profession].art}
          </g>
        )
      })}

      <LevelTile x={HARBOUR[0]} y={HARBOUR[1]} kind="exit" />
      <LevelTile x={CROSSROADS[0]} y={CROSSROADS[1]} r={9} kind="stop" />
      {PROFESSION_ORDER.map((profession) => {
        const [x, y] = landmarkPoint(profession)
        return <LevelTile key={profession} x={x} y={y} r={15} kind="exit" />
      })}

      <Cloud x={230} y={110} s={1} i={0} depth="18px" />
      <Cloud x={800} y={150} s={0.8} i={1} depth="10px" />
    </svg>
  )
})

export function HubCompass() {
  return <CompassRose className="h-12 w-12 sm:h-16 sm:w-16" />
}
