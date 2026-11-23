import { hop } from '@/lib/motion/arc'
import { mix } from '@/lib/motion/rigPose'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, transformTo } from '../../shared/stageNodes'
import { NOIR } from '../palette'
import type { Place } from '../place'
import { Canvas, FLOOR, Sleuth, placeSleuth } from '../street'
import { LEAP, dash, lay, noirJoints, setNoirPose } from '../pose'

// Contact: the office at dawn, the job done. As the contact rises he lays the calling card on the desk, its
// red star flaring behind it, dashes for the tall window and leaps through it, the glass bursting round
// him; he is held in the air outside the frame of the glass, the card left lit on the desk.

const START_X = 760
const DESK_X = 960
const WINDOW_X = 1250
const DASH_TO = 1120
const HEIGHT = 200
const DONE_BY = 0.55
// One step of his dash carries him this far.
const STEP = 80

function Office() {
  return (
    <Canvas>
      <rect x={WINDOW_X - 120} y={300} width={240} height={480} fill={NOIR.redDeep} stroke={NOIR.paper} strokeWidth="10" />
      <path d={`M${WINDOW_X} 300 V780 M${WINDOW_X - 120} 540 H${WINDOW_X + 120}`} stroke={NOIR.paper} strokeWidth="6" />
      <g data-fx="pane">
        <rect x={WINDOW_X - 114} y={306} width={228} height={468} fill={NOIR.paper} opacity="0.18" />
      </g>
    </Canvas>
  )
}

// The card on the desk with its red star behind it, and the bursting glass.
function Desk() {
  return (
    <>
      <rect x={DESK_X - 110} y={FLOOR - 120} width={220} height={16} fill={NOIR.ink} stroke={NOIR.smoke} strokeWidth="3" />
      <path d={`M${DESK_X - 96} ${FLOOR - 104} V${FLOOR} M${DESK_X + 96} ${FLOOR - 104} V${FLOOR}`} stroke={NOIR.ink} strokeWidth="12" />
      <g data-fx="card" opacity="0">
        <path d={`M${DESK_X} ${FLOOR - 300} L${DESK_X + 30} ${FLOOR - 190} L${DESK_X + 130} ${FLOOR - 200} L${DESK_X + 50} ${FLOOR - 140} L${DESK_X + 100} ${FLOOR - 60} L${DESK_X} ${FLOOR - 120} L${DESK_X - 100} ${FLOOR - 60} L${DESK_X - 50} ${FLOOR - 140} L${DESK_X - 130} ${FLOOR - 200} L${DESK_X - 30} ${FLOOR - 190} Z`} fill={NOIR.red} opacity="0.8" />
        <polygon points={`${DESK_X - 50},${FLOOR - 122} ${DESK_X + 40},${FLOOR - 130} ${DESK_X + 50},${FLOOR - 118} ${DESK_X - 40},${FLOOR - 112}`} fill={NOIR.paper} stroke={NOIR.ink} strokeWidth="3" />
      </g>
    </>
  )
}

const SHARDS = [
  [-60, -40, 26],
  [40, -90, 34],
  [90, 30, 22],
  [-20, 70, 30],
  [120, -150, 20],
  [-110, 120, 24],
] as const

function Glass() {
  return (
    <g data-fx="glass" opacity="0" transform={`translate(${WINDOW_X} 540)`}>
      {SHARDS.map(([x, y, size]) => (
        <polygon key={`${x}-${y}`} data-shard="" points={`${x - size},${y} ${x + size * 0.4},${y - size} ${x + size},${y + size * 0.6}`} fill={NOIR.paper} stroke={NOIR.ink} strokeWidth="3" />
      ))}
    </g>
  )
}

export const contact: Place = {
  light: NOIR.red,
  set: () => <Office />,
  floor: ({ profession }) => (
    <>
      <Desk />
      <Sleuth x={START_X} profession={profession} />
      <Glass />
    </>
  ),
  bind: (stage) => {
    const card = fx(stage, 'card')
    const glass = fx(stage, 'glass')
    const pane = fx(stage, 'pane')
    const root = fx(stage, 'detective')
    const joints = root ? noirJoints(root) : null
    placeSleuth(root, START_X)
    return (progress) => {
      const t = ramp(progress, 0.05, DONE_BY)
      const laid = ramp(t, 0, 0.3)
      const run = ramp(t, 0.3, 0.6)
      const leap = ramp(t, 0.6, 1)
      const x = START_X + (DASH_TO - START_X) * run + (WINDOW_X + 40 - DASH_TO) * leap
      fadeTo(card, ramp(laid, 0.5, 0.9))
      const burst = ramp(leap, 0.4, 1)
      fadeTo(glass, burst > 0 ? 1 : 0)
      transformTo(glass, `translate(${WINDOW_X} 540) scale(${(1 + 1.6 * burst).toFixed(3)})`)
      fadeTo(pane, 1 - ramp(leap, 0.4, 0.5))
      placeSleuth(root, x, hop(leap / 2, HEIGHT))
      if (!joints) return
      const pose = leap > 0 ? mix(dash(x / STEP), LEAP, ramp(leap, 0, 0.3)) : run > 0 ? dash(x / STEP) : lay(laid)
      setNoirPose(joints, pose)
    }
  },
}
