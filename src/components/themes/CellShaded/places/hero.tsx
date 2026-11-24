import { ramp } from '@/lib/scroll/stage'
import { fx, transformTo } from '../../shared/stageNodes'
import { CEL } from '../palette'
import { START, moveAt, type Place } from '../place'
import { Canvas, Commando, FLOOR, HOURS, placeCommando } from '../desert'
import { celJoints, deploy, setCelPose } from '../pose'

// The hero: noon on the mesa top. First the speed rays of the comic's freeze frame turn behind him and he
// deploys his gear: the engineer's turret comes down before him as he raises his wrist computer, the others
// throw a fist up to the sun. Then he works the computer and the turret fires.

const RAYS = { x: 1180, y: 560, r: 900 }
/** Where he stands on the rock: right of the hero text on a wide screen, the middle of a phone's view. */
const heroX = (phone: boolean): number => (phone ? 760 : 1180)
// The rays turn this far over the first action.
const TURN = 24

const RAY_PATHS = Array.from({ length: 18 }, (_, i) => {
  const from = (i * 2 * Math.PI) / 18
  const to = from + Math.PI / 30
  const point = (angle: number) => `${(RAYS.x + Math.cos(angle) * RAYS.r).toFixed(0)},${(RAYS.y + Math.sin(angle) * RAYS.r).toFixed(0)}`
  return `M${RAYS.x},${RAYS.y} L${point(from)} L${point(to)} Z`
})

// The deploy's first action ends here on its t, the turret firing in the second.
const ENDS = [0.55, 1]

const raysAt = (t: number): string => `rotate(${(TURN * ramp(t, 0, 0.55)).toFixed(1)} ${RAYS.x} ${RAYS.y})`

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

/** The rock he stands on, a low mesa top in the sand round `x`. */
function Rock({ x }: { x: number }) {
  return (
    <Canvas>
      <path d={`M${x - 180} ${FLOOR + 20} L${x - 150} ${FLOOR} L${x + 150} ${FLOOR} L${x + 180} ${FLOOR + 20} Z`} fill={CEL.mesa} />
    </Canvas>
  )
}

export const hero: Place = {
  hour: HOURS.noon,
  script: [1600, 1800],
  back: () => <Rays />,
  set: ({ phone }) => <Rock x={heroX(phone)} />,
  floor: ({ profession, phone }) => <Commando x={heroX(phone)} profession={profession} />,
  bind: (stage, { profession, phone }) => {
    const rays = fx(stage, 'rays')
    const root = fx(stage, 'commando')
    const joints = root ? celJoints(root) : null
    placeCommando(root, heroX(phone))
    return (_progress, _reached, play = START) => {
      const t = moveAt(ENDS, play)
      transformTo(rays, raysAt(t))
      if (joints) setCelPose(joints, deploy(profession, t))
    }
  },
}
