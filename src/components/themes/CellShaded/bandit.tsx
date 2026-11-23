import { hop } from '@/lib/motion/arc'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, transformTo } from '../shared/stageNodes'
import { FLOOR, muzzleAt } from './desert'
import { HOLD_X } from './place'
import { Burst } from './ink'
import { CEL } from './palette'

// The other side of the desert fight, drawn the way the world draws everything (flat fills under the ink
// line the scene's canvas gives every shape): the bandit, a masked raider in a sack hood with a pipe club,
// and the scout drone that hovers over the sand. Each is drawn round its feet (the drone round its belly)
// facing him, and is one group the scene's writer moves as a whole: knocked down, flung, shot out of the air.
// The shot that downs one is a tracer from his muzzle and the crit starburst on the hit, with no numbers.

/** A bandit at its feet, its body in `data-fx="{name}"`. */
export function Bandit({ name }: { name: string }) {
  return (
    <g data-fx={name}>
      <path d="M-34 0 L-28 -110 L-6 -110 L-10 0 Z M10 0 L6 -110 L28 -110 L34 0 Z" fill={CEL.denimShade} />
      <path d="M-44 -104 L-38 -200 Q0 -214 38 -200 L44 -104 Z" fill={CEL.rock} />
      <path d="M-44 -150 L44 -150 L44 -136 L-44 -136 Z" fill={CEL.plankShade} />
      <path d="M-38 -198 L-72 -132 L-58 -124 L-30 -170 Z" fill={CEL.rock} />
      <path d="M38 -198 L60 -136 L46 -130 L30 -170 Z" fill={CEL.rock} />
      <path d="M-66 -126 L-96 -230" stroke={CEL.steelDark} strokeWidth="10" strokeLinecap="round" />
      <path d="M-30 -204 Q-32 -262 0 -264 Q32 -262 30 -204 Z" fill={CEL.paperShade} />
      <path d="M-18 -238 L-6 -232 M18 -238 L6 -232" stroke={CEL.ink} strokeWidth="6" strokeLinecap="round" />
      <path d="M-30 -214 L30 -214" stroke={CEL.red} strokeWidth="6" />
    </g>
  )
}

/** A drone round its belly, its body in `data-fx="{name}"`. */
export function Drone({ name }: { name: string }) {
  return (
    <g data-fx={name}>
      <path d="M-70 -44 H70" stroke={CEL.ink} strokeWidth="6" />
      <ellipse cx={-70} cy={-48} rx={30} ry={6} fill={CEL.steel} />
      <ellipse cx={70} cy={-48} rx={30} ry={6} fill={CEL.steel} />
      <path d="M-46 -30 Q0 -64 46 -30 L36 0 L-36 0 Z" fill={CEL.steelDark} />
      <circle cx={-14} cy={-14} r={11} fill={CEL.crit} />
    </g>
  )
}

/** The canvas point his rifle's muzzle is at, relative to the stop he is acting at, `lift` above the sand. */
export const muzzleFromStop = (lift = 0): { x: number; y: number } => {
  const { x, y } = muzzleAt(HOLD_X, lift)
  return { x: x - HOLD_X, y: y - FLOOR }
}

/** The tracer of a shot from `from` to `to` and the crit starburst where it hits, both hidden until fired. */
export function Shot({ name, from, to }: { name: string; from: { x: number; y: number }; to: { x: number; y: number } }) {
  return (
    <>
      <path data-fx={`${name}-tracer`} d={`M${from.x} ${from.y} L${to.x} ${to.y}`} stroke={CEL.sun} strokeWidth="6" opacity="0" data-bare />
      <g data-fx={`${name}-crit`} opacity="0">
        <Burst x={to.x} y={to.y} r={46} fill={CEL.crit} />
        <Burst x={to.x} y={to.y} r={22} fill={CEL.sun} />
      </g>
    </>
  )
}

/** A shot's writer over the move's `t`: the tracer lit through the burst (`window`, 0.4 to 0.7 of the move
 *  by default), the crit popping on the hit and held, and the target knocked over from its feet as the
 *  burst ends. */
export function shotOf(stage: ParentNode, name: string, target: string) {
  const tracer = fx(stage, `${name}-tracer`)
  const crit = fx(stage, `${name}-crit`)
  const body = fx(stage, target)
  return (t: number, window: [number, number] = [0.4, 0.7]) => {
    const [from, to] = window
    const firing = t > from && t < to ? 1 : 0
    fadeTo(tracer, firing * 0.9)
    fadeTo(crit, ramp(t, from + 0.05, from + 0.12))
    transformTo(body, `rotate(${(85 * ramp(t, to - 0.1, to + 0.12)).toFixed(1)})`)
  }
}

/** A target flung away from him over `t`: up on an arc of `height`, `distance` back, turned over as it goes. */
export const flung = (t: number, distance: number, height: number): string =>
  `translate(${(distance * t).toFixed(1)} ${(-hop(t, height)).toFixed(1)}) rotate(${(95 * t).toFixed(1)})`
