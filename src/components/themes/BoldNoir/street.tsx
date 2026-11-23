import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { fx, transformTo } from '../shared/stageNodes'
import { Detective, DETECTIVE_VIEW } from './detective'
import { NOIR } from './palette'

// The drawing kit of the heist night behind the page, cut the way the world cuts everything: flat ink,
// paper and one red, no gradient, depth from stacked flat layers. Every scene is a stack of SVG layers on
// one 1600 by 1000 canvas anchored to its bottom centre (xMidYMax slice), so a phone, which sees about x
// 570 to 1030, and a desktop crop the same art: the night with the red slab cut across it and the scene's
// own light, the jagged towers beyond, the brick wall of the street with its lamps, the pavement he walks,
// and the glass shards and rain in front. He is the detective (detective.tsx) drawn into the canvas and
// posed by the scene's writer (pose.ts).

export const W = 1600
export const H = 1000
/** The top of the pavement: his soles and every prop stand on it. */
export const FLOOR = 880

/** His drawn height on the canvas, about a third of the street. */
export const FIGURE_H = 300
const FIGURE_W = (FIGURE_H * DETECTIVE_VIEW.width) / DETECTIVE_VIEW.height

export function Canvas({ children }: { children: ReactNode }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
      {children}
    </svg>
  )
}

/** The night: the ink sky, the red slab cut across it from the top, a flat pool of the scene's light and
 *  the halftone dots over the slab's corner. */
export function Night({ id, light }: { id: string; light: string }) {
  return (
    <Canvas>
      <defs>
        <pattern id={`${id}-dots`} width="18" height="18" patternUnits="userSpaceOnUse">
          <circle cx="9" cy="9" r="2.4" fill={NOIR.paper} opacity="0.08" />
        </pattern>
      </defs>
      <rect x={-200} width={W + 400} height={H} fill={NOIR.ink} />
      <polygon points="-200,0 900,0 380,1000 -200,1000" fill={NOIR.redDeep} opacity="0.55" />
      <polygon points="900,0 960,0 440,1000 380,1000" fill={NOIR.red} opacity="0.6" />
      <circle cx={1150} cy={300} r={360} fill={light} opacity="0.12" />
      <circle cx={1150} cy={300} r={200} fill={light} opacity="0.1" />
      <rect x={-200} width={W + 400} height={H} fill={`url(#${id}-dots)`} />
    </Canvas>
  )
}

// The jagged towers, each top cut on a slant, a lit red window in some.
const TOWERS = [
  { x: -120, w: 150, h: 360, cut: 30 },
  { x: 50, w: 110, h: 520, cut: -40 },
  { x: 180, w: 190, h: 300, cut: 24 },
  { x: 390, w: 120, h: 580, cut: 50 },
  { x: 530, w: 170, h: 420, cut: -30 },
  { x: 720, w: 100, h: 540, cut: 36 },
  { x: 840, w: 190, h: 360, cut: -24 },
  { x: 1050, w: 120, h: 600, cut: -46 },
  { x: 1190, w: 180, h: 400, cut: 30 },
  { x: 1390, w: 130, h: 520, cut: -36 },
  { x: 1540, w: 180, h: 340, cut: 26 },
]

const BASE = 800

/** The jagged towers of the city beyond the street, in coal on the night. */
export function Skyline() {
  return (
    <Canvas>
      {TOWERS.map(({ x, w, h, cut }) => {
        const top = BASE - h
        const left = cut > 0 ? top : top - cut
        const right = cut > 0 ? top + cut : top
        return (
          <g key={x}>
            <polygon points={`${x},${BASE} ${x},${left} ${x + w},${right} ${x + w},${BASE}`} fill={NOIR.coal} />
            <rect x={x + w * 0.3} y={Math.max(left, right) + 40} width={14} height={20} fill={NOIR.red} opacity="0.8" />
            <rect x={x + w * 0.62} y={Math.max(left, right) + 120} width={14} height={20} fill={NOIR.paperDim} opacity="0.35" />
          </g>
        )
      })}
    </Canvas>
  )
}

// A street lamp: the post, the arm and the paper lamp with its flat cone of light.
function Lamp({ x }: { x: number }) {
  return (
    <g>
      <polygon points={`${x + 40},300 ${x - 60},${FLOOR} ${x + 140},${FLOOR}`} fill={NOIR.paper} opacity="0.05" />
      <rect x={x - 6} y={280} width={12} height={FLOOR - 280} fill={NOIR.ink} />
      <path d={`M${x} 290 H${x + 46}`} stroke={NOIR.ink} strokeWidth="10" />
      <polygon points={`${x + 26},290 ${x + 66},290 ${x + 58},314 ${x + 34},314`} fill={NOIR.paperDim} />
    </g>
  )
}

/** The street's wall: a low ink wall under the towers, its brick courses cut in smoke, and two lamps. */
export function Wall() {
  return (
    <Canvas>
      <rect x={-200} y={640} width={W + 400} height={FLOOR - 640} fill={NOIR.ink} />
      {[680, 720, 760, 800, 840].map((y, row) => (
        <g key={y}>
          <path d={`M-200 ${y} H1800`} stroke={NOIR.smoke} strokeWidth="2" />
          {Array.from({ length: 24 }, (_, i) => -200 + i * 90 + (row % 2) * 45).map((x) => (
            <path key={x} d={`M${x} ${y - 40} V${y}`} stroke={NOIR.smoke} strokeWidth="2" />
          ))}
        </g>
      ))}
      <path d="M-200 640 H1800" stroke={NOIR.paper} strokeWidth="4" />
      <Lamp x={160} />
      <Lamp x={1480} />
    </Canvas>
  )
}

/** The pavement he walks: coal flags with their joints, the paper kerb line at its edge. */
export function Street() {
  return (
    <Canvas>
      <rect x={-200} y={FLOOR} width={W + 400} height={H - FLOOR} fill={NOIR.coal} />
      {Array.from({ length: 12 }, (_, i) => -200 + i * 180).map((x) => (
        <path key={x} d={`M${x} ${FLOOR} L${x - 60} ${H}`} stroke={NOIR.smoke} strokeWidth="3" />
      ))}
      <path d={`M-200 ${FLOOR} H1800`} stroke={NOIR.paper} strokeWidth="5" />
      <path d={`M-200 ${FLOOR + 50} H1800`} stroke={NOIR.smoke} strokeWidth="3" />
    </Canvas>
  )
}

const SHARDS = [
  [60, 180, 40, -20],
  [1500, 260, 54, 24],
  [1380, 120, 26, 60],
  [120, 620, 34, 40],
  [1540, 700, 30, -30],
] as const

/** In front: glass shards at the edges and the slant of the rain; the scene's writer drops the rain. */
export function Front() {
  return (
    <Canvas>
      {SHARDS.map(([x, y, size, turn]) => (
        <polygon
          key={`${x}-${y}`}
          points={`${-size},${-size * 0.4} ${size * 0.6},${-size} ${size},${size * 0.7} ${-size * 0.2},${size * 0.4}`}
          transform={`translate(${x} ${y}) rotate(${turn})`}
          fill="none"
          stroke={NOIR.paper}
          strokeWidth="3"
          opacity="0.3"
        />
      ))}
      <g data-fx="rain" opacity="0.18">
        {Array.from({ length: 16 }, (_, i) => ({ x: -100 + i * 115, y: (i * 233) % 700 })).map(({ x, y }) => (
          <path key={x} d={`M${x} ${y} l-30 90`} stroke={NOIR.paper} strokeWidth="3" />
        ))}
      </g>
    </Canvas>
  )
}

/** The rain falls this far over a scene. */
const RAIN_FALL = 220

/** Drops the rain with the scene's progress. */
export function rainWriter(stage: ParentNode): (progress: number) => void {
  const rain = fx(stage, 'rain')
  return (progress) => transformTo(rain, `translate(${(-progress * RAIN_FALL * 0.33).toFixed(1)} ${(progress * RAIN_FALL).toFixed(1)})`)
}

const figureAt = (x: number, lift = 0): string =>
  `translate(${(x - FIGURE_W / 2).toFixed(1)} ${(FLOOR - lift - FIGURE_H * (DETECTIVE_VIEW.soles / DETECTIVE_VIEW.height)).toFixed(1)})`

/** Him on the pavement at `x` (his centre), in a profession's kit; the scene's writer moves and poses him. */
export function Sleuth({ x, profession }: { x: number; profession: Profession }) {
  return (
    <g data-fx="detective" transform={figureAt(x)}>
      <Detective profession={profession} box={{ width: FIGURE_W, height: FIGURE_H }} />
    </g>
  )
}

/** Moves him to `x` on the pavement, `lift` above it. */
export const placeSleuth = (node: Element | null, x: number, lift = 0): void => transformTo(node, figureAt(x, lift))
