import { mix } from '@/lib/motion/rigPose'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, translateTo } from '../../shared/stageNodes'
import { Canvas, gearPath } from '../forest'
import { SHADE, type Light } from '../palette'
import { AT, type Place } from '../place'
import { CLIMB, CROUCH, PUSH, rest } from '../pose'

// Tech in the flooded hold of the machine hall: for each group of the stack a crate floats at the water's
// edge. He puts his shoulder to it and pushes it on against the wall, then climbs up onto it; the frame
// holds him crouched on top as its lamp lights.

// The crate's near face stands where his hands meet it.
const CRATE = { x: -60, w: 100, h: 110 }
// A pushed crate slides on this far.
const SLIDE = 50

function Gears({ light }: { light: Light }) {
  return (
    <Canvas>
      <g fill={light.far} fillRule="evenodd" opacity={0.85}>
        <path d={gearPath(1250, 330, 170, 16)} />
        <path d={gearPath(1460, 520, 90, 11)} />
        <path d={gearPath(360, 420, 120, 13)} />
      </g>
    </Canvas>
  )
}

export const tech: Place = {
  far: ({ light }) => <Gears light={light} />,
  obstacle: (i, { light }) => (
    <g data-fx={`crate-${i}`}>
      <rect x={CRATE.x} y={-CRATE.h} width={CRATE.w} height={CRATE.h} fill={SHADE.black} />
      <path d={`M${CRATE.x} ${-CRATE.h} L${CRATE.x + CRATE.w} 0 M${CRATE.x + CRATE.w} ${-CRATE.h} L${CRATE.x} 0`} stroke={SHADE.fog} strokeWidth={4} />
      <g data-fx={`lamp-${i}`} opacity="0">
        <circle cx={10} cy={-CRATE.h - 10} r={50} fill={light.rim} opacity={0.25} />
        <rect x={0} y={-CRATE.h - 26} width={20} height={16} fill={light.rim} />
      </g>
    </g>
  ),
  move: (profession, t) => {
    const pushed = ramp(t, 0, 0.5)
    const up = ramp(t, 0.5, 1)
    const pose = t < 0.5 ? mix(rest(profession), PUSH, ramp(t, 0, 0.15)) : mix(mix(PUSH, CLIMB, ramp(t, 0.5, 0.65)), CROUCH, ramp(t, 0.8, 1))
    return { pose, ahead: SLIDE * pushed + (AT - 20) * up, lift: CRATE.h * ramp(up, 0, 0.7), over: 0 }
  },
  reply: (stage, { count }) => {
    const crates = Array.from({ length: count }, (_, i) => fx(stage, `crate-${i}`))
    const lamps = Array.from({ length: count }, (_, i) => fx(stage, `lamp-${i}`))
    return (played) =>
      crates.forEach((crate, i) => {
        translateTo(crate, SLIDE * ramp(played(i), 0, 0.5), 0)
        fadeTo(lamps[i], ramp(played(i), 0.85, 1))
      })
  },
}
