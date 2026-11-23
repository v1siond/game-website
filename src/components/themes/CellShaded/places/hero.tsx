import { ramp } from '@/lib/scroll/stage'
import { fx, transformTo } from '../../shared/stageNodes'
import { CEL } from '../palette'
import type { Place } from '../place'
import { Canvas, Commando, FLOOR, HOURS, placeCommando } from '../desert'
import { celJoints, deploy, setCelPose } from '../pose'

// The hero: noon on the mesa top. Behind him the speed rays of the comic's freeze frame turn as the page
// starts to scroll; once they rest he deploys his gear: the engineer drops his turret beside him and
// works it from the wrist computer until it fires, the others throw a fist up to the sun.

const RAYS = { x: 1180, y: 560, r: 900 }
const HERO_X = 1180
// The rays turn this far over the hero's scroll and rest by this share of it.
const TURN = 24
const RESTED_BY = 0.5

const RAY_PATHS = Array.from({ length: 18 }, (_, i) => {
  const from = (i * 2 * Math.PI) / 18
  const to = from + Math.PI / 30
  const point = (angle: number) => `${(RAYS.x + Math.cos(angle) * RAYS.r).toFixed(0)},${(RAYS.y + Math.sin(angle) * RAYS.r).toFixed(0)}`
  return `M${RAYS.x},${RAYS.y} L${point(from)} L${point(to)} Z`
})

const raysAt = (progress: number): string => `rotate(${(TURN * ramp(progress, 0, RESTED_BY)).toFixed(1)} ${RAYS.x} ${RAYS.y})`

/** The freeze frame's speed rays in the sky behind him. */
function Rays() {
  return (
    <Canvas>
      <g data-fx="rays" transform={raysAt(0)} opacity="0.35">
        {RAY_PATHS.map((d) => (
          <path key={d} d={d} fill={CEL.sun} data-bare />
        ))}
      </g>
    </Canvas>
  )
}

/** The rock he stands on, a low mesa top in the sand. */
function Rock() {
  return (
    <Canvas>
      <path d={`M1000 ${FLOOR + 20} L1030 ${FLOOR} L1330 ${FLOOR} L1360 ${FLOOR + 20} Z`} fill={CEL.mesa} />
    </Canvas>
  )
}

export const hero: Place = {
  hour: HOURS.noon,
  back: () => <Rays />,
  set: () => <Rock />,
  floor: ({ profession }) => <Commando x={HERO_X} profession={profession} />,
  bind: (stage, { profession }) => {
    const rays = fx(stage, 'rays')
    const root = fx(stage, 'commando')
    const joints = root ? celJoints(root) : null
    placeCommando(root, HERO_X)
    return (progress) => {
      transformTo(rays, raysAt(progress))
      if (joints) setCelPose(joints, deploy(profession, ramp(progress, RESTED_BY - 0.2, RESTED_BY + 0.25)))
    }
  },
}
