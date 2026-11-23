import { drop } from '@/lib/motion/arc'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, transformTo } from '../../shared/stageNodes'
import { Drone, Shot } from '../bandit'
import { FIGURE_H, HOURS } from '../desert'
import { CEL } from '../palette'
import { still, stopsPlace } from '../place'
import { deploy } from '../pose'

// Tech in the town's afternoon: for each group of tools a relay pylon comes to him on the run, a scout
// drone hovering over it. He deploys his turret beside him and works it from his wrist computer until it
// fires; the drone is shot out of the air in a crit starburst and drops to the sand, and the pylon's beacon
// lights in the hologram blue.

const PYLON = 330
const DRONE = { x: 330, y: -400 }
// The turret's muzzle, at (206, 140) in the sprite's 120 by 200 units, from his place.
const SCALE = FIGURE_H / 200
const TURRET = { x: (206 - 60) * SCALE, y: -(196 - 140) * SCALE }

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
  back: (i) => (
    <>
      <Pylon />
      <g data-fx={`beacon-${i}`} opacity="0">
        <Beacon />
      </g>
      <g data-fx={`drone-${i}`} transform={`translate(${DRONE.x} ${DRONE.y})`}>
        <Drone name={`drone-body-${i}`} />
      </g>
      <Shot name={`shot-${i}`} from={TURRET} to={{ x: DRONE.x, y: DRONE.y - 30 }} />
    </>
  ),
  move: (profession, t) => still(deploy(profession, t)),
  reply: (stage, { count }) => {
    const drones = Array.from({ length: count }, (_, i) => fx(stage, `drone-${i}`))
    const bodies = Array.from({ length: count }, (_, i) => fx(stage, `drone-body-${i}`))
    const tracers = Array.from({ length: count }, (_, i) => fx(stage, `shot-${i}-tracer`))
    const crits = Array.from({ length: count }, (_, i) => fx(stage, `shot-${i}-crit`))
    const beacons = Array.from({ length: count }, (_, i) => fx(stage, `beacon-${i}`))
    return (played) =>
      drones.forEach((drone, i) => {
        const t = played(i)
        fadeTo(tracers[i], t > 0.6 && t < 0.75 ? 0.9 : 0)
        fadeTo(crits[i], ramp(t, 0.65, 0.72))
        const fall = ramp(t, 0.72, 0.95)
        transformTo(drone, `translate(${DRONE.x} ${(DRONE.y + drop(fall, -DRONE.y)).toFixed(1)})`)
        transformTo(bodies[i], `rotate(${(70 * fall).toFixed(1)})`)
        fadeTo(beacons[i], ramp(t, 0.85, 0.95))
      })
  },
})
