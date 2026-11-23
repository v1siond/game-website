import { mix } from '@/lib/motion/rigPose'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, transformTo } from '../../shared/stageNodes'
import { FIGURE_H, FLOOR, H } from '../forest'
import { SHADE, type Light } from '../palette'
import { AT, type Frame, type Place } from '../place'
import { HANG, rest } from '../pose'

// Work at the chasm: for each job a rope hangs over a gap in the path from a beam with a bell. He leaps,
// takes the rope and swings out over the gap; the frame holds him at the far top of the swing as the bell
// rings out in light.

const LENGTH = 560
// The rope swings from this far back to this far forward, in degrees.
const BACK = -14
const OUT = 32
const GAP = { from: -40, to: 260 }

const angleAt = (t: number): number => BACK + (OUT - BACK) * ramp(t, 0.2, 1)
const rad = (deg: number): number => (deg * Math.PI) / 180

/** His frame hanging off the rope's end at `deg`: his hands at the end, his body under them. */
function onRope(profession: Parameters<typeof rest>[0], t: number): Frame {
  const deg = angleAt(t)
  const grab = ramp(t, 0, 0.2)
  const endX = AT + LENGTH * Math.sin(rad(deg))
  const endY = FLOOR - 300 - LENGTH + LENGTH * Math.cos(rad(deg))
  return { pose: mix(rest(profession), HANG, grab), ahead: endX * grab, lift: (FLOOR - endY - FIGURE_H * 0.95) * grab, over: 0 }
}

function Gap({ light }: { light: Light }) {
  return <rect x={GAP.from} y={-2} width={GAP.to - GAP.from} height={H - FLOOR + 2} fill={light.mid} />
}

function Rope() {
  return (
    <>
      <line x1={0} y1={0} x2={0} y2={LENGTH} stroke={SHADE.black} strokeWidth={7} />
      <circle cx={0} cy={LENGTH + 6} r={10} fill={SHADE.black} />
    </>
  )
}

export const work: Place = {
  obstacle: (i, { light }) => (
    <>
      <Gap light={light} />
      <g transform={`translate(0 ${-300 - LENGTH})`}>
        <rect x={-70} y={-20} width={140} height={20} fill={SHADE.black} />
        <path d="M-26 0 Q-26 50 -34 60 H34 Q26 50 26 0 Z" fill={SHADE.black} />
        <g data-fx={`bell-${i}`} opacity="0">
          <circle cx={0} cy={40} r={90} fill={light.rim} opacity={0.2} />
          <path d="M-20 10 Q-20 46 -26 54 H26 Q20 46 20 10 Z" fill={light.rim} />
        </g>
        <g data-fx={`rope-${i}`}>
          <Rope />
        </g>
      </g>
    </>
  ),
  move: onRope,
  reply: (stage, { count }) => {
    const ropes = Array.from({ length: count }, (_, i) => fx(stage, `rope-${i}`))
    const bells = Array.from({ length: count }, (_, i) => fx(stage, `bell-${i}`))
    return (played) =>
      ropes.forEach((rope, i) => {
        const t = played(i)
        transformTo(rope, `rotate(${(-(t > 0 ? angleAt(t) : 0)).toFixed(1)} 0 0)`)
        fadeTo(bells[i], ramp(t, 0.8, 1))
      })
  },
}
