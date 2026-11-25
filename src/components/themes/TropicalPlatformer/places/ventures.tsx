import { useId } from 'react'
import { ramp } from '@/lib/scroll/stage'
import { bell, fadeTo, fx, lerp, r1, transformTo } from '../../shared/stageNodes'
import { CROUCH, REACH, STAND, THROW, blend, ease, flight, still, stride, type Frame } from '../moves'
import type { PartnerFrame } from '../partner'
import type { SceneDef } from '../place'
import { Bat, BatEyes, LanternBeetle } from '../cast'
import { COLORS as C } from '../palette'
import { Crate, Pit, boardAt } from '../props'
import { COVER } from './kit'

// Ventures: the dark cave in the glacier, where the dark is the whole scene and a friend carries the light.
// He cracks a small crate and the lantern beetle, our own, lights up and flies behind them; the pair walk in
// its circle of light over narrow ledges between the pits; the light flickers and they stand still until it
// comes back and shows the bat hanging over the way, its eyes all that showed of it in the dark, then pass
// under it. The pair end at the cave mouth, the beetle's light behind them.

const CRATE_X = 110
const PITS = [
  [150, 215],
  [272, 325],
] as const
const MOUTH = { from: 540, to: 760 }
const BAT = { x: 450, y: -430 }
const END = 480
const LIGHT = 330
const DARK = '#02040a'

// His way over the ledges, each [from, to, start, end] of the move: walks, and two hops over the pits.
type Leg = readonly [number, number, number, number]
const WALKS: readonly Leg[] = [
  [0, 120, 0.25, 0.37],
  [250, 256, 0.45, 0.49],
  [385, 400, 0.57, 0.62],
  [400, END, 0.86, 0.97],
]
const HOPS: readonly Leg[] = [
  [120, 250, 0.37, 0.45],
  [256, 385, 0.49, 0.57],
]
const LEGS = [...WALKS, ...HOPS]
// The partner keeps to his way a moment behind him, and never nearer than a step.
const LAG = 0.06
const STEP = 60

const move = (t: number): Frame => {
  if (t < 0.25) {
    if (t < 0.06) return still(blend(STAND, CROUCH, t, 0, 0.06))
    return still(t < 0.16 ? blend(CROUCH, THROW, t, 0.06, 0.12) : blend(THROW, STAND, t, 0.16, 0.24))
  }
  for (const [from, to, a, b] of HOPS) {
    if (t >= a && t < b) {
      const [ahead, lift] = flight(ramp(t, a, b), [from, 0], [to, 0], 90)
      return { pose: blend(CROUCH, REACH, t, a, a + 0.02), ahead, lift }
    }
  }
  for (const [from, to, a, b] of WALKS) {
    if (t >= a && t < b) return still(stride((4 * (to - from) * ramp(t, a, b)) / 60), lerp(from, to, ramp(t, a, b)))
  }
  // between legs he stands where the last one ended
  return still(STAND, LEGS.reduce((at, [, to, , b]) => (b <= t && to > at ? to : at), 0))
}

/** The lantern beetle: out of the crate, then over and a little ahead of him, bobbing; once the light is back
 *  it rises to the bat, then comes back over the pair at the mouth and lights them. */
const LAMP_UP = [470, -340] as const
const LAMP_LAST = [450, -290] as const
const lampAt = (t: number): [number, number] => {
  const bob = 10 * Math.sin(t * 50)
  if (t < 0.14) return [CRATE_X, -30]
  if (t < 0.25) return [lerp(CRATE_X, 90, ease(ramp(t, 0.14, 0.25))), lerp(-30, -250, ease(ramp(t, 0.14, 0.25)))]
  const over = move(t).ahead + 90
  if (t < 0.78) return [over, -250 + bob]
  if (t < 0.86) return [lerp(over, LAMP_UP[0], ease(ramp(t, 0.78, 0.84))), lerp(-250, LAMP_UP[1], ease(ramp(t, 0.78, 0.84))) + bob]
  const back = ease(ramp(t, 0.86, 0.98))
  return [lerp(LAMP_UP[0], LAMP_LAST[0], back), lerp(LAMP_UP[1], LAMP_LAST[1], back) + bob]
}

/** How far the light reaches: lit as the crate breaks, the flicker, then steady. */
const lightAt = (t: number): number => {
  const lit = ease(ramp(t, 0.14, 0.24))
  const flicker = 1 - 0.85 * bell(t, 0.64, 0.8) * (0.6 + 0.4 * Math.abs(Math.sin(t * 160)))
  return lit * flicker
}

/** The dark over the whole cave, the beetle's light and the cave mouth cut out of it. */
function Dark() {
  const id = useId()
  const [x, y] = lampAt(0)
  return (
    <g>
      <defs>
        <radialGradient id={`${id}-lamp`}>
          <stop offset="0.5" stopColor="#000" />
          <stop offset="1" stopColor="#fff" />
        </radialGradient>
        <linearGradient id={`${id}-mouth`} x1="0" x2="1">
          <stop offset="0" stopColor="#fff" />
          <stop offset="0.5" stopColor="#000" />
        </linearGradient>
        <mask id={`${id}-dark`} maskUnits="userSpaceOnUse" x={COVER.x} y={COVER.y} width={COVER.width} height={COVER.height}>
          <rect {...COVER} fill="#fff" />
          <rect x={MOUTH.from - 60} y={-340} width={MOUTH.to - MOUTH.from + 60} height={400} fill={`url(#${id}-mouth)`} />
          <circle data-fx="lamp-light" r={LIGHT} fill={`url(#${id}-lamp)`} transform={`translate(${x} ${y}) scale(0.01)`} />
        </mask>
      </defs>
      <rect {...COVER} fill={DARK} opacity="0.93" mask={`url(#${id}-dark)`} />
    </g>
  )
}

export const ventures: SceneDef = {
  zone: 'cave',
  kit: 'engineer',
  script: [1300, 1900, 1800],
  shift: { wide: -120, phone: -80 },
  ends: [0.25, 0.64, 1],
  back: () => (
    <g>
      {PITS.map(([from, to]) => (
        <Pit key={from} from={from} to={to} />
      ))}
      {/* the cave mouth, the cold day beyond it */}
      <path d={`M${MOUTH.from} 0 V-220 Q${MOUTH.from + 60} -330 ${MOUTH.to} -300 V0 Z`} fill="#bfe0f0" stroke={C.shadow} strokeWidth={3} />
      <path d={`M${MOUTH.from + 30} -4 H${MOUTH.to}`} stroke="#ffffff" strokeWidth={8} />
      <g transform={`translate(${BAT.x} ${BAT.y})`}>
        <path d="M-120 -40 Q0 20 120 -40 V-500 H-120 Z" fill="#16222e" />
        <Bat />
      </g>
      <g data-fx="crate" transform={`translate(${CRATE_X} 0) scale(0.55)`}>
        <Crate />
      </g>
    </g>
  ),
  // The dark lies over everything, him too; the beetle's light and the bat's eyes show through it.
  front: () => (
    <g>
      <Dark />
      <g transform={`translate(${BAT.x} ${BAT.y})`} data-fx="bat-eyes">
        <BatEyes />
      </g>
      <g data-fx="lamp" transform={`translate(${CRATE_X} -30)`} opacity="0">
        <LanternBeetle />
      </g>
    </g>
  ),
  move: (_kit, t) => move(t),
  partner: (t): PartnerFrame => {
    const lagged = move(Math.max(0, t - LAG))
    const ahead = Math.min(lagged.ahead, move(t).ahead - STEP)
    const moving = move(Math.max(0, t - LAG) + 0.01).ahead - lagged.ahead > 0.5
    return { ahead, lift: lagged.lift ?? 0, air: (lagged.lift ?? 0) > 4 ? 1 : 0, phase: moving ? ahead / 25 : 0 }
  },
  reply: (stage) => {
    const light = fx(stage, 'lamp-light')
    const lamp = fx(stage, 'lamp')
    const wings = fx(stage, 'lantern-wings')
    const crate = fx(stage, 'crate')
    const boards = [0, 1, 2, 3].map((i) => fx(stage, `crate-board-${i}`))
    const eyes = fx(stage, 'bat-eyes')
    return (t) => {
      const [x, y] = lampAt(t)
      const reach = lightAt(t)
      transformTo(light, `translate(${r1(x)} ${r1(y)}) scale(${Math.max(0.01, reach).toFixed(3)})`)
      transformTo(lamp, `translate(${r1(x)} ${r1(y)})`)
      fadeTo(lamp, ramp(t, 0.12, 0.16) * (0.5 + 0.5 * reach))
      transformTo(wings, `rotate(${r1(30 * Math.sin(t * 400))} 4 -16)`)
      const burst = ramp(t, 0.11, 0.2)
      boards.forEach((board, i) => transformTo(board, boardAt(i, burst)))
      fadeTo(crate, 1 - ramp(t, 0.18, 0.24))
      // the bat's eyes show while it hangs in the dark, and go once the light reaches it
      const toBat = Math.hypot(x - BAT.x, y - (BAT.y + 40))
      fadeTo(eyes, 1 - ramp(LIGHT * 0.6 * reach - toBat, -40, 40))
    }
  },
}
