import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { fx, transformTo } from '../shared/stageNodes'
import { DECO_COLORS as C } from './palette'
import { SOLE_DROP, SurvivorSprite } from './sprite'

// The drawing kit of the city under the sea behind the page. Every scene is a stack of SVG layers on one
// 1600 by 1000 canvas anchored to its bottom centre (xMidYMax slice), so a phone, which sees about x 570
// to 1030, and a desktop crop the same art: the water lit in the scene's own light, the drowned towers in
// the fog beyond the great window, the hall's brass frame (its stepped crown, the sunburst and the two
// columns), the marble floor he runs, and the bubbles and kelp in front. He is the survivor (sprite.tsx)
// drawn into the canvas and posed by the scene's writer (pose.ts).

export const W = 1600
export const H = 1000
/** The top of the marble floor: his soles and every prop stand on it. */
export const FLOOR = 880

/** His drawn height on the canvas, about a third of the hall. */
export const FIGURE_H = 300
const FIGURE_W = (FIGURE_H * 120) / 180

export function Canvas({ children }: { children: ReactNode }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
      {children}
    </svg>
  )
}

/** The water behind the hall: deep sea to abyss, a pool of the scene's light from above and its rays. */
export function Water({ id, light }: { id: string; light: string }) {
  return (
    <Canvas>
      <defs>
        <linearGradient id={`${id}-sea`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.seaMid} />
          <stop offset="0.55" stopColor={C.deepSea} />
          <stop offset="1" stopColor={C.abyss} />
        </linearGradient>
        <radialGradient id={`${id}-pool`} cx="0.62" cy="0.1" r="0.6">
          <stop offset="0" stopColor={light} stopOpacity="0.32" />
          <stop offset="1" stopColor={light} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-ray`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={light} stopOpacity="0.2" />
          <stop offset="1" stopColor={light} stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x={-200} width={W + 400} height={H} fill={`url(#${id}-sea)`} />
      <rect x={-200} width={W + 400} height={H} fill={`url(#${id}-pool)`} />
      {[620, 900, 1180].map((x) => (
        <path key={x} d={`M${x} 0 L${x + 90} 0 L${x + 240} 760 L${x + 60} 760 Z`} fill={`url(#${id}-ray)`} />
      ))}
    </Canvas>
  )
}

// A stepped tower with a spire on `base`, its crown `height` above it.
const tower = (x: number, width: number, height: number, base: number): string => {
  const top = base - height
  const step = width * 0.16
  return `M${x} ${base} V${top + 36} H${x + step} V${top + 18} H${x + step * 2} V${top} H${x + width - step * 2} V${top + 18} H${x + width - step} V${top + 36} H${x + width} V${base} Z`
}

const FAR_TOWERS = [
  { x: 120, width: 120, height: 360 },
  { x: 300, width: 90, height: 260 },
  { x: 470, width: 140, height: 440 },
  { x: 700, width: 100, height: 300 },
  { x: 860, width: 160, height: 500 },
  { x: 1080, width: 110, height: 330 },
  { x: 1250, width: 150, height: 420 },
  { x: 1440, width: 100, height: 280 },
]

const windowsOf = ({ x, width, height }: (typeof FAR_TOWERS)[number]) =>
  Array.from({ length: Math.floor((height - 80) / 46) }, (_, row) => [0.3, 0.62].map((column) => ({ x: x + width * column, y: 820 - height + 70 + row * 46 }))).flat()

const FAR_WINDOWS = FAR_TOWERS.flatMap(windowsOf).filter((_, i) => i % 3 === 0)

/** The drowned towers beyond the great window, in the sea fog, a few windows still lit. */
export function Skyline() {
  return (
    <Canvas>
      {FAR_TOWERS.map(({ x, width, height }) => (
        <g key={x}>
          <path d={tower(x, width, height, 820)} fill={C.skylineFar} />
          <path d={`M${x + width / 2} ${820 - height} V${820 - height - 50}`} stroke={C.farCity} strokeWidth="4" />
        </g>
      ))}
      {FAR_WINDOWS.map(({ x, y }) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="9" height="13" fill={C.goldBright} opacity="0.45" />
      ))}
      <path d="M480 640 H600 M1270 600 H1380" stroke={C.neonPink} strokeWidth="4" opacity="0.5" />
      <path d="M880 560 H1000" stroke={C.waterGlow} strokeWidth="4" opacity="0.45" />
    </Canvas>
  )
}

const SUN_RAYS = Array.from({ length: 13 }, (_, i) => -72 + i * 12)

// One brass column with its stepped capital and its gold fluting, from the crown down to the floor.
function Column({ x }: { x: number }) {
  return (
    <g>
      <rect x={x} y={150} width={110} height={FLOOR - 150} fill={C.cabinetTop} stroke={C.brassMid} strokeWidth="4" />
      {[22, 44, 66, 88].map((dx) => (
        <path key={dx} d={`M${x + dx} 190 V${FLOOR - 30}`} stroke={C.brassDark} strokeWidth="3" />
      ))}
      <path d={`M${x - 20} 150 H${x + 130} V176 H${x - 20} Z M${x - 8} 176 H${x + 118} V196 H${x - 8} Z`} fill={C.brassMid} stroke={C.gold} strokeWidth="2" />
      <path d={`M${x - 20} ${FLOOR} V${FLOOR - 30} H${x + 130} V${FLOOR} Z`} fill={C.brassDark} />
    </g>
  )
}

/** The hall's brass frame round the great window: the stepped crown and its sunburst, the two columns and
 *  the window's thin mullions. */
export function Hall() {
  return (
    <Canvas>
      {[400, 800, 1200].map((x) => (
        <path key={x} d={`M${x} 150 V${FLOOR - 60}`} stroke={C.brassLine} strokeWidth="6" opacity="0.8" />
      ))}
      <path d={`M150 ${FLOOR - 60} H1450`} stroke={C.brassLine} strokeWidth="8" />
      <path d="M-200 0 H1800 V150 H-200 Z" fill={C.cabinetMid} />
      <path d="M-200 150 H1800 M-200 132 H1800" stroke={C.brassMid} strokeWidth="4" />
      <path d="M520 150 V110 H600 V80 H680 V50 H920 V80 H1000 V110 H1080 V150 Z" fill={C.cabinetTop} stroke={C.gold} strokeWidth="3" />
      {SUN_RAYS.map((angle) => (
        <path key={angle} d="M800 150 L800 66" stroke={C.goldBright} strokeWidth="3" opacity="0.7" transform={`rotate(${angle} 800 150)`} />
      ))}
      <circle cx={800} cy={150} r={26} fill={C.gold} />
      <Column x={-30} />
      <Column x={1520} />
    </Canvas>
  )
}

/** The marble floor in brass inlaid diamonds, its edge a gold rail. */
export function Floor() {
  return (
    <Canvas>
      <rect x={-200} y={FLOOR} width={W + 400} height={H - FLOOR} fill={C.cabinetFoot} />
      {Array.from({ length: 22 }, (_, i) => -200 + i * 100).map((x) => (
        <path key={x} d={`M${x} ${FLOOR + 60} L${x + 50} ${FLOOR + 20} L${x + 100} ${FLOOR + 60} L${x + 50} ${FLOOR + 100} Z`} fill="none" stroke={C.brassDark} strokeWidth="2" opacity="0.7" />
      ))}
      <path d={`M-200 ${FLOOR} H1800`} stroke={C.gold} strokeWidth="5" />
    </Canvas>
  )
}

const BUBBLES = [
  [90, 760, 10],
  [240, 520, 6],
  [560, 880, 8],
  [1060, 640, 12],
  [1330, 820, 7],
  [1500, 460, 9],
  [760, 340, 5],
] as const

/** In front: the kelp swaying up at both edges and the bubbles; the scene's writer lifts the bubbles. */
export function Front() {
  return (
    <Canvas>
      <path d="M-40 1000 Q20 860 -10 720 Q40 820 30 1000 Z M40 1000 Q90 880 70 780 Q120 900 90 1000 Z" fill={C.kelp} />
      <path d="M1640 1000 Q1580 860 1610 700 Q1550 820 1560 1000 Z M1560 1000 Q1520 900 1530 800 Q1480 900 1500 1000 Z" fill={C.kelp} />
      <g data-fx="bubbles">
        {BUBBLES.map(([x, y, r]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill="none" stroke={C.waterGlow} strokeWidth="2" opacity="0.5" />
        ))}
      </g>
    </Canvas>
  )
}

/** The bubbles rise this far over a scene. */
const BUBBLE_RISE = 140

/** Lifts the bubbles with the scene's progress. */
export function bubblesWriter(stage: ParentNode): (progress: number) => void {
  const bubbles = fx(stage, 'bubbles')
  return (progress) => transformTo(bubbles, `translate(0 ${(-progress * BUBBLE_RISE).toFixed(1)})`)
}

const figureAt = (x: number, lift = 0): string => `translate(${(x - FIGURE_W / 2).toFixed(1)} ${(FLOOR - lift - FIGURE_H * (1 - SOLE_DROP)).toFixed(1)})`

/** Him on the floor at `x` (his centre), in a profession's kit; the scene's writer moves and poses him. */
export function Survivor({ x, profession }: { x: number; profession: Profession }) {
  return (
    <g data-fx="survivor" transform={figureAt(x)}>
      <SurvivorSprite profession={profession} box={{ width: FIGURE_W, height: FIGURE_H }} />
    </g>
  )
}

/** Moves him to `x` on the floor, `lift` above it. */
export const placeSurvivor = (node: Element | null, x: number, lift = 0): void => transformTo(node, figureAt(x, lift))

/** Where his charged hand is, from his place on the floor, when he thrusts it out level: his front shoulder
 *  (73, 53 in the sprite's 120 by 180 units) plus the arm held out ahead of it. */
export const HAND = { x: -FIGURE_W / 2 + 119 * (FIGURE_H / 180), y: -FIGURE_H * (1 - SOLE_DROP) + 53 * (FIGURE_H / 180) }
