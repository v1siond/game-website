import { hop } from '@/lib/motion/arc'
import { mix } from '@/lib/motion/rigPose'
import { ramp } from '@/lib/scroll/stage'
import { fx, lerp, transformTo, translateTo } from '../../shared/stageNodes'
import { Canvas, gearPath } from '../forest'
import { SHADE, type Light } from '../palette'
import { AT, type Frame, type Place } from '../place'
import { CLIMB, CROUCH, TURN, rest } from '../pose'

// Tech in the flooded hold of the machine hall: a tank sunk in the floor with a crate floating low in its
// water, a valve wheel at its edge and a high ledge past it. He turns the wheel and the water rises, lifting
// the crate up to the floor; then he hops onto the floating crate and climbs from it up onto the ledge.

const TANK = { from: 10, to: 330 }
const CRATE = { x: 70, w: 120, h: 80 }
const LEDGE = { x: 330, h: 210 }
// The water's surface, from the floor: low in the tank, then up to just under the floor.
const LOW = 260
const HIGH = -16
const WHEEL = { x: -40, y: -150, r: 34 }
// Where he stands on the crate and on the ledge, from his place.
const ON_CRATE = AT + CRATE.x + CRATE.w / 2 - 20
const ON_LEDGE = AT + LEDGE.x + 70
const CRATE_TOP = CRATE.h - 30 - HIGH

const surfaceAt = (t: number): number => lerp(LOW, HIGH, ramp(t, 0.08, 0.45))

function move(profession: Parameters<typeof rest>[0], t: number): Frame {
  if (t < 0.5) {
    // both hands on the wheel, turning it over
    const turning = Math.sin(ramp(t, 0.08, 0.45) * Math.PI * 4)
    return { pose: mix(rest(profession), { ...TURN, foreRight: TURN.foreRight + 30 * turning }, ramp(t, 0, 0.08)), ahead: 0, lift: 0, over: 0 }
  }
  const onto = ramp(t, 0.5, 0.66)
  if (t < 0.7) return { pose: mix(rest(profession), CROUCH, onto), ahead: ON_CRATE * onto, lift: CRATE_TOP * onto + hop(onto, 50), over: 0 }
  const up = ramp(t, 0.72, 0.92)
  return { pose: t < 0.92 ? mix(CROUCH, CLIMB, ramp(t, 0.7, 0.78)) : mix(CLIMB, CROUCH, ramp(t, 0.92, 1)), ahead: lerp(ON_CRATE, ON_LEDGE, up), lift: lerp(CRATE_TOP, LEDGE.h, up) + hop(up, 30), over: 0 }
}

function Gears({ light }: { light: Light }) {
  return (
    <Canvas>
      <g fill={light.far} fillRule="evenodd" opacity={0.85}>
        <path d={gearPath(1250, 330, 170, 16)} />
        <path d={gearPath(360, 420, 120, 13)} />
      </g>
    </Canvas>
  )
}

export const tech: Place = {
  script: [2200, 2000],
  ends: [0.5, 1],
  far: ({ light }) => <Gears light={light} />,
  obstacle: ({ light }) => (
    <>
      <rect x={TANK.from} y={-2} width={TANK.to - TANK.from} height={700} fill={light.mid} />
      <rect data-fx="water" x={TANK.from} y={0} width={TANK.to - TANK.from} height={700} fill={light.far} transform={`translate(0 ${LOW})`} />
      <g data-fx="crate" transform={`translate(0 ${LOW})`}>
        <rect x={CRATE.x} y={30 - CRATE.h} width={CRATE.w} height={CRATE.h} fill={SHADE.black} />
        <path d={`M${CRATE.x} ${30 - CRATE.h} L${CRATE.x + CRATE.w} 30 M${CRATE.x + CRATE.w} ${30 - CRATE.h} L${CRATE.x} 30`} stroke={SHADE.fog} strokeWidth={4} />
      </g>
      <rect x={LEDGE.x} y={-LEDGE.h} width={600} height={LEDGE.h + 2} fill={SHADE.black} />
      <path d={`M${LEDGE.x} ${-LEDGE.h} H${LEDGE.x + 600}`} stroke={light.rim} strokeOpacity={0.3} strokeWidth={3} />
      <rect x={WHEEL.x - 5} y={WHEEL.y} width={10} height={-WHEEL.y} fill={SHADE.black} />
      <g data-fx="wheel">
        <circle cx={WHEEL.x} cy={WHEEL.y} r={WHEEL.r} fill="none" stroke={SHADE.black} strokeWidth={8} />
        <path d={`M${WHEEL.x - WHEEL.r} ${WHEEL.y} H${WHEEL.x + WHEEL.r} M${WHEEL.x} ${WHEEL.y - WHEEL.r} V${WHEEL.y + WHEEL.r}`} stroke={SHADE.black} strokeWidth={6} />
      </g>
    </>
  ),
  move,
  reply: (stage) => {
    const water = fx(stage, 'water')
    const crate = fx(stage, 'crate')
    const wheel = fx(stage, 'wheel')
    return (t) => {
      const surface = surfaceAt(t)
      translateTo(water, 0, surface)
      translateTo(crate, 0, surface)
      transformTo(wheel, `rotate(${(540 * ramp(t, 0.08, 0.45)).toFixed(1)} ${WHEEL.x} ${WHEEL.y})`)
    }
  },
}
