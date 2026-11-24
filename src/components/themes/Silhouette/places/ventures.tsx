import { hop } from '@/lib/motion/arc'
import { mix } from '@/lib/motion/rigPose'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx } from '../../shared/stageNodes'
import { Canvas } from '../forest'
import { SHADE, type Light } from '../palette'
import { AT, type Place } from '../place'
import { CLIMB, CROUCH, TUCK, rest } from '../pose'

// Ventures over the roofs at the edge of the machine city: a gap opens in the roof and a higher roof stands
// past it with a dark sign. He leaps the gap and catches the higher roof's edge; then he climbs up and
// crouches on the ledge as the sign's tubes light.

const GAP = { from: -20, to: 90 }
const ROOF = { h: 130, w: 240 }
const SIGN = ROOF.h + 260

function City({ light }: { light: Light }) {
  return (
    <Canvas>
      <path
        fill={light.far}
        opacity={0.85}
        d="M0 880 V560 H140 V470 H260 V600 H380 V380 H420 V300 H450 V380 H520 V640 H700 V520 H860 V880 Z M1000 880 V600 H1120 V420 H1160 V340 H1190 V420 H1260 V540 H1400 V460 H1600 V880 Z"
      />
    </Canvas>
  )
}

function Tubes({ color }: { color: string }) {
  return <path d={`M${GAP.to + 40} ${-SIGN + 30} H${GAP.to + 200} M${GAP.to + 40} ${-SIGN + 60} H${GAP.to + 160} M${GAP.to + 40} ${-SIGN + 90} H${GAP.to + 180}`} stroke={color} strokeWidth={8} />
}

export const ventures: Place = {
  script: [1800, 1600],
  ends: [0.5, 1],
  far: ({ light }) => <City light={light} />,
  obstacle: ({ light }) => (
    <>
      <rect x={GAP.from} y={-2} width={GAP.to - GAP.from} height={700} fill={light.mid} />
      <rect x={GAP.to} y={-ROOF.h} width={ROOF.w} height={ROOF.h} fill={SHADE.black} />
      <rect x={GAP.to + 110} y={-SIGN + 120} width={14} height={SIGN - ROOF.h - 120} fill={SHADE.black} />
      <rect x={GAP.to + 20} y={-SIGN} width={200} height={120} fill={SHADE.black} />
      <Tubes color={SHADE.fog} />
      <g data-fx="sign" opacity="0">
        <rect x={GAP.to} y={-SIGN - 20} width={240} height={160} fill={light.rim} opacity={0.18} />
        <Tubes color={light.rim} />
      </g>
    </>
  ),
  move: (profession, t) => {
    const leap = ramp(t, 0, 0.5)
    const up = ramp(t, 0.5, 1)
    const pose = t < 0.5 ? mix(rest(profession), TUCK, ramp(t, 0, 0.2)) : mix(mix(TUCK, CLIMB, ramp(t, 0.5, 0.6)), CROUCH, ramp(t, 0.85, 1))
    return { pose, ahead: (AT + GAP.to - 20) * leap + 50 * up, lift: hop(leap, 90) * (1 - up) + ROOF.h * ramp(up, 0, 0.7), over: 0 }
  },
  reply: (stage) => {
    const sign = fx(stage, 'sign')
    return (t) => fadeTo(sign, ramp(t, 0.85, 1))
  },
}
