import { drop } from '@/lib/motion/arc'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, transformTo } from '../../shared/stageNodes'
import { Drone, Shot } from '../bandit'
import { FIGURE_H, HOURS } from '../desert'
import { CEL } from '../palette'
import { still, stopsPlace } from '../place'
import { deploy } from '../pose'

// Tech in the town's afternoon: a relay pylon before him, a scout drone hovering over it. First he works his
// wrist computer and his turret deploys before him; then it fires, the drone is shot out of the air in a crit
// starburst and drops to the sand, and the pylon's beacon lights in the hologram blue.

const PYLON = 360
const DRONE = { x: 360, y: -400 }
// The turret's muzzle, at (204, 138) in the sprite's 120 by 200 units, from his place.
const SCALE = FIGURE_H / 200
const TURRET = { x: (204 - 60) * SCALE, y: -(196 - 138) * SCALE }

function Pylon() {
  return (
    <g transform={`translate(${PYLON} 0)`}>
      <path d="M-40 0 L-8 -260 L8 -260 L40 0 Z" fill={CEL.steelDark} />
      <path d="M-30 -60 L30 -60 M-22 -130 L22 -130 M-14 -200 L14 -200" stroke={CEL.ink} strokeWidth="5" />
      <rect x={-18} y={-290} width={36} height={30} fill={CEL.steel} />
    </g>
  )
}

function Beacon() {
  return (
    <g transform={`translate(${PYLON} 0)`}>
      <rect x={-18} y={-290} width={36} height={30} fill={CEL.holo} />
      <ellipse cx={0} cy={-275} rx={60} ry={20} fill="none" stroke={CEL.holo} strokeWidth="5" data-bare />
      <ellipse cx={0} cy={-275} rx={100} ry={34} fill="none" stroke={CEL.holo} strokeWidth="4" opacity="0.6" data-bare />
    </g>
  )
}

export const tech = stopsPlace({
  hour: HOURS.town,
  script: [1800, 2000],
  ends: [0.5, 1],
  back: () => (
    <>
      <Pylon />
      <g data-fx="beacon" opacity="0">
        <Beacon />
      </g>
      <g data-fx="drone" transform={`translate(${DRONE.x} ${DRONE.y})`}>
        <Drone name="drone-body" />
      </g>
      <Shot name="shot" from={TURRET} to={{ x: DRONE.x, y: DRONE.y - 30 }} />
    </>
  ),
  move: (profession, t) => still(deploy(profession, t)),
  reply: (stage) => {
    const drone = fx(stage, 'drone')
    const body = fx(stage, 'drone-body')
    const tracer = fx(stage, 'shot-tracer')
    const crit = fx(stage, 'shot-crit')
    const beacon = fx(stage, 'beacon')
    return (t) => {
      fadeTo(tracer, t > 0.6 && t < 0.75 ? 0.9 : 0)
      fadeTo(crit, ramp(t, 0.65, 0.72))
      const fall = ramp(t, 0.72, 0.95)
      transformTo(drone, `translate(${(DRONE.x + 90 * fall).toFixed(1)} ${(DRONE.y + drop(fall, -DRONE.y)).toFixed(1)})`)
      transformTo(body, `rotate(${(70 * fall).toFixed(1)})`)
      fadeTo(beacon, ramp(t, 0.85, 0.95))
    }
  },
})
