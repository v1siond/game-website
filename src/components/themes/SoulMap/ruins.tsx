import { createContext, useContext, type ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { handAt, type RigPose } from '@/lib/motion/rigPose'
import { turnAbout, type Point } from '@/lib/motion/turnAbout'
import { KNIGHT_VIEW, Knight } from './knight'
import { SOUL } from './palette'

// The drawing kit of the ruined kingdom behind the page, at dusk under ash: every scene is a stack of SVG
// layers on one 1600 by 1000 canvas anchored to its bottom centre (xMidYMax slice); a phone (PhoneView)
// frames it from higher up and right of the middle (PHONE_VIEW, x 680 to 1440), so the floor sits about
// half way down its screen with him and what he faces in view. The art is the same at every width: the dusk sky with its haze, the far ruins pale in
// it, the fog band, the broken columns nearer and darker, the flagstone floor he walks, and rubble in
// front. The fire is the one warm light. He is the knight (knight.tsx) drawn into the canvas and posed by
// the scene's writer (pose.ts).

export const W = 1600
export const H = 1000
/** The top of the flagstones: his soles and every prop stand on it. */
export const FLOOR = 880

/** His drawn height on the canvas, about a third of the view. */
export const FIGURE_H = 300
const FIGURE_W = (FIGURE_H * KNIGHT_VIEW.width) / KNIGHT_VIEW.height

/** Whether the canvas is drawn for a phone's narrow, tall screen. */
export const PhoneView = createContext(false)

// The phone's view of the canvas: 760 wide, so he and the demon of the arena both stay in view at the
// scene's full push in, and its top at y 120 so the floor (880) sits about half way down a phone's screen.
const PHONE_VIEW = '680 120 760 1640'

export function Canvas({ children }: { children: ReactNode }) {
  const phone = useContext(PhoneView)
  return (
    <svg viewBox={phone ? PHONE_VIEW : `0 0 ${W} ${H}`} preserveAspectRatio={phone ? 'xMidYMin slice' : 'xMidYMax slice'} aria-hidden="true" focusable="false">
      {children}
    </svg>
  )
}

/** The dusk sky, high to the horizon haze, and the low sun's glow behind the ruins. */
export function Sky() {
  return (
    <Canvas>
      <defs>
        <linearGradient id="soul-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={SOUL.skyTop} />
          <stop offset="0.5" stopColor={SOUL.skyMid} />
          <stop offset="0.85" stopColor={SOUL.skyLow} />
        </linearGradient>
        <radialGradient id="soul-glow">
          <stop offset="0" stopColor={SOUL.haze} stopOpacity="0.7" />
          <stop offset="1" stopColor={SOUL.haze} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill="url(#soul-sky)" />
      <ellipse cx={1100} cy={700} rx={560} ry={260} fill="url(#soul-glow)" />
    </Canvas>
  )
}

/** The far ruins pale in the haze: a broken keep, a bridge of arches and a spire. */
export function FarRuins() {
  return (
    <Canvas>
      <path
        fill={SOUL.ash}
        opacity={0.75}
        d="M0 860 V560 L60 540 V430 H90 V400 H120 V430 H150 V560 L220 580 V860 Z M300 860 V700 Q340 640 380 700 V860 H420 V700 Q460 640 500 700 V860 H540 V700 Q580 640 620 700 V860 Z M1180 860 V420 L1210 260 L1240 420 V500 L1300 470 V560 H1360 V500 H1400 V860 Z M1440 860 V640 L1480 600 L1520 640 L1560 580 L1600 610 V860 Z"
      />
    </Canvas>
  )
}

/** The fog band low over the floor. */
export function Fog() {
  return (
    <Canvas>
      <rect y={700} width={W} height={220} fill={SOUL.fog} opacity={0.12} />
      <rect y={790} width={W} height={110} fill={SOUL.fog} opacity={0.1} />
    </Canvas>
  )
}

const COLUMNS = [[70, 520], [330, 380], [1260, 460], [1500, 600]] as const

/** Broken columns nearer and darker, each snapped off at its own height, a capital on the tallest. */
export function Columns() {
  return (
    <Canvas>
      <g fill={SOUL.rock}>
        {COLUMNS.map(([x, h]) => (
          <path key={x} d={`M${x} ${FLOOR} V${FLOOR - h} L${x + 20} ${FLOOR - h - 24} L${x + 44} ${FLOOR - h + 6} L${x + 70} ${FLOOR - h - 10} V${FLOOR} Z`} />
        ))}
        <rect x={1488} y={FLOOR - 640} width={94} height={30} />
      </g>
    </Canvas>
  )
}

/** The flagstone floor he walks, its joints scored in the stone. */
export function Floor() {
  return (
    <Canvas>
      <rect y={FLOOR} width={W} height={H - FLOOR + 800} fill={SOUL.cavern} />
      <path d={`M0 ${FLOOR} H${W}`} stroke={SOUL.ridge} strokeWidth={4} />
      <path d={`M0 ${FLOOR + 50} H${W} M120 ${FLOOR} V${FLOOR + 50} M420 ${FLOOR} V${FLOOR + 50} M760 ${FLOOR} V${FLOOR + 50} M1080 ${FLOOR} V${FLOOR + 50} M1400 ${FLOOR} V${FLOOR + 50} M260 ${FLOOR + 50} V${H} M600 ${FLOOR + 50} V${H} M920 ${FLOOR + 50} V${H} M1240 ${FLOOR + 50} V${H}`} stroke={SOUL.deep} strokeWidth={4} />
    </Canvas>
  )
}

/** Rubble and fallen stone in front, dark against the floor. */
export function Front() {
  return (
    <Canvas>
      <g fill={SOUL.ink} opacity={0.9}>
        <path d="M0 1000 V900 L60 870 L130 900 L170 880 L230 930 L260 1000 Z" />
        <path d="M1600 1000 V880 L1540 860 L1490 900 L1430 890 L1390 940 L1370 1000 Z" />
        <path d="M0 0 H260 L200 40 L120 30 L60 70 L0 60 Z" />
      </g>
    </Canvas>
  )
}

// His box on the canvas: knight units (KNIGHT_VIEW) to canvas units.
const UNIT = FIGURE_H / KNIGHT_VIEW.height
// The point a roll turns him about, in knight units: the middle of him tucked into a ball.
const BALL: Point = [31, 76]
// His body turns about his soles (knight.module.css .whole).
const SOLES: Point = [31, KNIGHT_VIEW.soles]

/** His group's transform: his centre at `x`, his soles `lift` above the floor, and `roll` degrees turned
 *  round the middle of him, the dodge roll (a full turn is 360). */
export const figureAt = (x: number, lift = 0, roll = 0): string => {
  const left = x - FIGURE_W / 2
  const top = FLOOR - lift - FIGURE_H * (KNIGHT_VIEW.soles / KNIGHT_VIEW.height)
  const turn = roll ? ` rotate(${roll.toFixed(1)} ${BALL[0] * UNIT} ${BALL[1] * UNIT})` : ''
  return `translate(${left.toFixed(1)} ${top.toFixed(1)})${turn}`
}

/** Him on the floor at `x` (his centre), in a profession's gear; the scene's writer moves and poses him. */
export function Figure({ x, profession }: { x: number; profession: Profession }) {
  return (
    <g data-fx="figure" transform={figureAt(x)}>
      <Knight profession={profession} box={{ width: FIGURE_W, height: FIGURE_H }} />
    </g>
  )
}

// The joints of his arms as drawn (knight.tsx), in knight units: near is the shield arm, far the weapon's.
const NEAR_ARM = { shoulder: [33, 32] as Point, elbow: [33.5, 43] as Point, hand: [33.6, 53.5] as Point }
const FAR_ARM = { shoulder: [27, 32] as Point, elbow: [27.5, 43] as Point, hand: [27.6, 53.5] as Point }

/** Where his near (`'near'`) or far hand is on the canvas, posed `pose` with his centre at `x` and his soles
 *  `lift` above the floor: the arm's turns, then his body's lean about his soles and its rise. */
export function handOnCanvas(side: 'near' | 'far', pose: RigPose, x: number, lift = 0): Point {
  const arm = side === 'near' ? NEAR_ARM : FAR_ARM
  const hand = side === 'near' ? handAt(arm, pose.armRight, pose.foreRight) : handAt(arm, pose.armLeft, pose.foreLeft)
  const [bx, by] = turnAbout(hand, pose.lean, SOLES)
  const top = FLOOR - lift - FIGURE_H * (KNIGHT_VIEW.soles / KNIGHT_VIEW.height)
  return [x - FIGURE_W / 2 + bx * UNIT, top + (by + pose.rise) * UNIT]
}
