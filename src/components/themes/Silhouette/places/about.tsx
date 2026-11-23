import { mix } from '@/lib/motion/rigPose'
import { ramp } from '@/lib/scroll/stage'
import { fx, translateTo } from '../../shared/stageNodes'
import { Canvas } from '../forest'
import { SHADE } from '../palette'
import { still, type Place } from '../place'
import { DUCK, rest } from '../pose'

// About in the spider's thicket: its body hangs in the dark boughs, and for each line of the record one of
// its legs stabs down at the path ahead of him. He drops flat and the leg spears into the ground just over
// his back, held there.

const TIP = -190
// How far above its strike a leg waits in the dark.
const RAISED = 760

function Leg() {
  return <path d={`M-120 ${TIP - 900} L-40 ${TIP - 420} L0 ${TIP}`} fill="none" stroke={SHADE.black} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
}

/** The spider's body in the boughs over the path. */
function Body() {
  return (
    <Canvas>
      <ellipse cx={1250} cy={40} rx={260} ry={150} fill={SHADE.black} />
      <path d="M1040 60 L860 300 L820 520 M1460 60 L1560 300" fill="none" stroke={SHADE.black} strokeWidth={14} strokeLinecap="round" />
    </Canvas>
  )
}

export const about: Place = {
  mid: () => <Body />,
  obstacle: (i) => (
    <g data-fx={`leg-${i}`} transform={`translate(0 ${-RAISED})`}>
      <Leg />
    </g>
  ),
  move: (profession, t) => still(mix(rest(profession), DUCK, ramp(t, 0, 0.35))),
  reply: (stage, { count }) => {
    const legs = Array.from({ length: count }, (_, i) => fx(stage, `leg-${i}`))
    return (played) => legs.forEach((leg, i) => translateTo(leg, 0, -RAISED * (1 - ramp(played(i), 0.25, 0.5))))
  },
}
