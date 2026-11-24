import { mix } from '@/lib/motion/rigPose'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, lerp, translateTo } from '../../shared/stageNodes'
import { SHADE, type Light } from '../palette'
import { AT, type Frame, type Place } from '../place'
import { CROUCH, DIVE, rest } from '../pose'

// Projects in the press corridor: a hydraulic crusher pounds the floor ahead of him on its beat. It slams
// down once as he waits, crouched and timing it; as it lifts again he dives under it and rolls clear on the
// far side, and it slams down behind him.

const PRESS = { from: -10, to: 200, h: 120 }
const TOP = -560
// How high the press head's foot hangs at t: down once in the first action, up as he goes, down behind him.
function footAt(t: number): number {
  const slam1 = ramp(t, 0.12, 0.2) - ramp(t, 0.3, 0.46)
  const slam2 = ramp(t, 0.74, 0.8)
  return lerp(TOP + PRESS.h, 0, Math.max(slam1, slam2)) - PRESS.h
}
const PAST = AT + PRESS.to + 90

function move(profession: Parameters<typeof rest>[0], t: number): Frame {
  if (t < 0.5) return { pose: mix(rest(profession), CROUCH, ramp(t, 0.02, 0.12)), ahead: 0, lift: 0, over: 0 }
  const dive = ramp(t, 0.5, 0.72)
  const pose = t < 0.72 ? mix(CROUCH, DIVE, ramp(t, 0.5, 0.56)) : mix(DIVE, CROUCH, ramp(t, 0.72, 0.84))
  return { pose, ahead: lerp(0, PAST, dive), lift: 0, over: 0 }
}

function PressFrame({ light }: { light: Light }) {
  return (
    <>
      <rect x={PRESS.from - 40} y={TOP - 400} width={30} height={400 - TOP} fill={SHADE.black} />
      <rect x={PRESS.to + 10} y={TOP - 400} width={30} height={400 - TOP} fill={SHADE.black} />
      <rect x={PRESS.from - 60} y={TOP - 40} width={PRESS.to - PRESS.from + 120} height={40} fill={SHADE.black} />
      <path d={`M${PRESS.from} 0 H${PRESS.to}`} stroke={light.rim} strokeOpacity={0.35} strokeWidth={4} />
    </>
  )
}

export const projects: Place = {
  script: [2000, 2000],
  ends: [0.5, 1],
  obstacle: ({ light }) => (
    <>
      <PressFrame light={light} />
      <g data-fx="press" transform={`translate(0 ${TOP})`}>
        <rect x={PRESS.from + 70} y={-600} width={PRESS.to - PRESS.from - 140} height={600} fill={SHADE.black} />
        <rect x={PRESS.from} y={0} width={PRESS.to - PRESS.from} height={PRESS.h} fill={SHADE.black} />
      </g>
      <g data-fx="dust" opacity="0">
        <ellipse cx={PRESS.from - 40} cy={-14} rx={50} ry={14} fill={light.rim} opacity={0.25} />
        <ellipse cx={PRESS.to + 40} cy={-14} rx={50} ry={14} fill={light.rim} opacity={0.25} />
      </g>
    </>
  ),
  move,
  reply: (stage) => {
    const press = fx(stage, 'press')
    const dust = fx(stage, 'dust')
    return (t) => {
      translateTo(press, 0, footAt(t))
      const struck = Math.max(ramp(t, 0.19, 0.2) - ramp(t, 0.24, 0.32), ramp(t, 0.79, 0.8) - ramp(t, 0.86, 0.96))
      fadeTo(dust, struck)
    }
  },
}
