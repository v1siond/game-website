import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { fx, transformTo } from '../shared/stageNodes'
import { GumshoeSprite, SOLE_DROP } from './gumshoe'
import { NOIR } from './palette'

// The drawing kit of the 1947 city behind the page, in the black and white mode of the detective game the
// world is drawn from: flat ink, smoke, fog and paper, one red kept for what is lit, no gradient, depth from
// stacked flat layers. Every scene is a stack of SVG layers on one 1600 by 1000 canvas anchored to its bottom
// centre (xMidYMax slice), so a phone, which sees about x 570 to 1030, and a desktop crop the same art: the
// night with its haze and searchlights, the skyline of deco blocks and palms under the City Hall tower, the
// brick wall of the street with its lamps, the pavement, and the rain in front. He is the detective side on
// (gumshoe.tsx) drawn into the canvas and posed by the scene's writer (pose.ts).

export const W = 1600
export const H = 1000
/** The top of the pavement: his soles and every prop stand on it. */
export const FLOOR = 880

/** His drawn height on the canvas, about a third of the street. */
export const FIGURE_H = 300
const FIGURE_W = (FIGURE_H * 120) / 180

export function Canvas({ children }: { children: ReactNode }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
      {children}
    </svg>
  )
}

/** The night in the game's black and white mode: the ink sky, a pale haze of the scene's light low over the
 *  roofs and the searchlight beams of the city crossing it. */
export function Night({ light }: { light: string }) {
  return (
    <Canvas>
      <rect x={-200} width={W + 400} height={H} fill={NOIR.ink} />
      <ellipse cx={800} cy={700} rx={1100} ry={260} fill={NOIR.smoke} opacity="0.7" />
      <circle cx={1150} cy={320} r={360} fill={light} opacity="0.1" />
      <circle cx={1150} cy={320} r={190} fill={light} opacity="0.08" />
      <polygon points="300,800 330,800 -100,0 -10,0" fill={NOIR.paper} opacity="0.05" />
      <polygon points="1350,800 1380,800 1700,0 1560,0" fill={NOIR.paper} opacity="0.05" />
    </Canvas>
  )
}

// The low deco blocks of the 1947 city, each with its lit windows, at x and up to its height.
const BLOCKS = [
  { x: -160, w: 210, h: 230 },
  { x: 60, w: 150, h: 330 },
  { x: 220, w: 240, h: 260 },
  { x: 470, w: 130, h: 380 },
  { x: 610, w: 220, h: 290 },
  { x: 1310, w: 180, h: 340 },
  { x: 1500, w: 220, h: 250 },
]

// The palms over the roofs: the trunk's foot, its height and its lean.
const PALMS = [
  { x: 170, h: 420, lean: -30 },
  { x: 900, h: 470, lean: 24 },
  { x: 1440, h: 400, lean: -18 },
]

const BASE = 800

// The stepped tower of City Hall, the tallest thing on the 1947 skyline: its tiers narrowing up to the
// stepped pyramid and the beacon at its tip.
const TOWER = { x: 1110, w: 150 }
const TIERS = [
  { w: 1, top: 470 },
  { w: 0.74, top: 300 },
  { w: 0.56, top: 230 },
  { w: 0.42, top: 190 },
]

function Palm({ x, h, lean }: { x: number; h: number; lean: number }) {
  const top = { x: x + lean, y: BASE - h }
  return (
    <g fill={NOIR.ink}>
      <path d={`M${x - 6} ${BASE} Q${x + lean * 0.3} ${BASE - h * 0.5} ${top.x - 3} ${top.y} L${top.x + 3} ${top.y} Q${x + lean * 0.3 + 8} ${BASE - h * 0.5} ${x + 6} ${BASE} Z`} />
      {[-150, -110, -60, -20, 20, 60].map((angle) => (
        <path key={angle} d={`M${top.x} ${top.y} q${(Math.cos((angle * Math.PI) / 180) * 50).toFixed(0)} ${(Math.sin((angle * Math.PI) / 180) * 50 - 10).toFixed(0)} ${(Math.cos((angle * Math.PI) / 180) * 90).toFixed(0)} ${(Math.sin((angle * Math.PI) / 180) * 70 + 30).toFixed(0)}`} stroke={NOIR.ink} strokeWidth="9" fill="none" strokeLinecap="round" />
      ))}
    </g>
  )
}

/** The 1947 skyline beyond the street: the City Hall tower, the deco blocks, the palms, in coal and ink. */
export function Skyline() {
  return (
    <Canvas>
      {BLOCKS.map(({ x, w, h }) => (
        <g key={x}>
          <rect x={x} y={BASE - h} width={w} height={h} fill={NOIR.coal} />
          <rect x={x + 10} y={BASE - h - 14} width={w - 20} height={14} fill={NOIR.coal} />
          {[0.25, 0.55].map((across) =>
            [60, 140].map((dy) => <rect key={`${across}-${dy}`} x={x + w * across} y={BASE - h + dy} width={14} height={20} fill={NOIR.paperDim} opacity="0.3" />),
          )}
        </g>
      ))}
      {TIERS.map(({ w, top }) => (
        <rect key={top} x={TOWER.x + (TOWER.w * (1 - w)) / 2} y={top} width={TOWER.w * w} height={BASE - top} fill={NOIR.coal} />
      ))}
      <polygon points={`${TOWER.x + 44},190 ${TOWER.x + 75},120 ${TOWER.x + 106},190`} fill={NOIR.coal} />
      <circle cx={TOWER.x + 75} cy={112} r={7} fill={NOIR.red} />
      {[520, 580, 640, 700].map((y) => (
        <path key={y} d={`M${TOWER.x + 30} ${y} V${y + 30} M${TOWER.x + 75} ${y} V${y + 30} M${TOWER.x + 120} ${y} V${y + 30}`} stroke={NOIR.paperDim} strokeWidth="5" opacity="0.3" />
      ))}
      {PALMS.map((palm) => (
        <Palm key={palm.x} {...palm} />
      ))}
      <path d="M-200 560 Q400 590 800 560 T1800 560" stroke={NOIR.smoke} strokeWidth="2" fill="none" />
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

/** In front: the slant of the rain; the scene's writer drops it. */
export function Front() {
  return (
    <Canvas>
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
  `translate(${(x - FIGURE_W / 2).toFixed(1)} ${(FLOOR - lift - FIGURE_H * (1 - SOLE_DROP)).toFixed(1)})`

/** Him on the pavement at `x` (his centre), in a profession's kit; the scene's writer moves and poses him. */
export function Sleuth({ x, profession }: { x: number; profession: Profession }) {
  return (
    <g data-fx="detective" transform={figureAt(x)}>
      <GumshoeSprite profession={profession} box={{ width: FIGURE_W, height: FIGURE_H }} />
    </g>
  )
}

/** Moves him to `x` on the pavement, `lift` above it. */
export const placeSleuth = (node: Element | null, x: number, lift = 0): void => transformTo(node, figureAt(x, lift))
