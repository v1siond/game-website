import { drop, hop } from '@/lib/motion/arc'
import { mix } from '@/lib/motion/rigPose'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, lerp, transformTo } from '../../shared/stageNodes'
import { FIGURE_H } from '../forest'
import { SHADE, type Light } from '../palette'
import { AT, type Frame, type Place } from '../place'
import { CROUCH, HANG, TUCK, rest, run } from '../pose'

// Work at the chasm: a rope hangs over a gap in the path from a beam with a bell. He runs, leaps and takes
// the rope; then he swings out over the gap, lets go at the top of the swing and lands crouched on the far
// side as the bell rings out in light, the rope swinging back behind him.

const LENGTH = 560
// The rope swings out this far, in degrees, and he lets go at the top.
const OUT = 32
const GAP = { from: -40, to: 260 }
// Where he lands past the gap, from his place.
const LANDED = AT + GAP.to + 60
// His run up to the rope, its steps.
const STEP = 70

const rad = (deg: number): number => (deg * Math.PI) / 180

/** The rope's swing at t: still until he takes it, out to the top, then back behind him once he lets go. */
const angleAt = (t: number): number => OUT * ramp(t, 0.4, 0.72) * (1 - ramp(t, 0.72, 1))

/** The rope's end, from his place: where his hands are while he hangs on it. */
const ropeEnd = (deg: number): { x: number; lift: number } => ({
  x: AT + LENGTH * Math.sin(rad(deg)),
  lift: 300 + LENGTH - LENGTH * Math.cos(rad(deg)) - FIGURE_H * 0.95,
})

function move(profession: Parameters<typeof rest>[0], t: number): Frame {
  if (t < 0.25) return { pose: run(profession, (60 * ramp(t, 0, 0.25)) / STEP), ahead: 60 * ramp(t, 0, 0.25), lift: 0, over: 0 }
  const caught = ropeEnd(0)
  if (t < 0.4) {
    const leap = ramp(t, 0.25, 0.4)
    return { pose: mix(rest(profession), TUCK, leap), ahead: lerp(60, caught.x, leap), lift: caught.lift * leap + hop(leap, 30), over: 0 }
  }
  const end = ropeEnd(angleAt(Math.min(t, 0.72)))
  if (t < 0.72) return { pose: HANG, ahead: end.x, lift: end.lift, over: 0 }
  const fall = ramp(t, 0.72, 0.9)
  return { pose: mix(TUCK, CROUCH, ramp(t, 0.86, 0.96)), ahead: lerp(end.x, LANDED, fall), lift: end.lift - drop(fall, end.lift), over: 0 }
}

function Gap({ light }: { light: Light }) {
  return <rect x={GAP.from} y={-2} width={GAP.to - GAP.from} height={700} fill={light.mid} />
}

export const work: Place = {
  script: [1600, 2000],
  ends: [0.4, 1],
  obstacle: ({ light }) => (
    <>
      <Gap light={light} />
      <g transform={`translate(0 ${-300 - LENGTH})`}>
        <rect x={-70} y={-20} width={140} height={20} fill={SHADE.black} />
        <path d="M-26 0 Q-26 50 -34 60 H34 Q26 50 26 0 Z" fill={SHADE.black} />
        <g data-fx="bell" opacity="0">
          <circle cx={0} cy={40} r={90} fill={light.rim} opacity={0.2} />
          <path d="M-20 10 Q-20 46 -26 54 H26 Q20 46 20 10 Z" fill={light.rim} />
        </g>
        <g data-fx="rope">
          <line x1={0} y1={0} x2={0} y2={LENGTH} stroke={SHADE.black} strokeWidth={7} />
          <circle cx={0} cy={LENGTH + 6} r={10} fill={SHADE.black} />
        </g>
      </g>
    </>
  ),
  move,
  reply: (stage) => {
    const rope = fx(stage, 'rope')
    const bell = fx(stage, 'bell')
    return (t) => {
      transformTo(rope, `rotate(${(-angleAt(t)).toFixed(1)} 0 0)`)
      fadeTo(bell, ramp(t, 0.86, 0.96))
    }
  },
}
