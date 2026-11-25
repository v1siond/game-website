import { drop, hop } from '@/lib/motion/arc'
import { ramp } from '@/lib/scroll/stage'
import { fx, lerp, transformTo } from '../../shared/stageNodes'
import { Hollow, turnOf } from '../foes'
import { SOUL } from '../palette'
import type { Frame, Place } from '../place'
import { FALL, PLUNGED, RAISE, blend, guard, walk } from '../pose'

// Work at a broken ledge over the old road: a hollow soldier stands below, unaware. He steps to the edge
// and raises his blade point down in both hands; then he drops off the ledge onto it, the blade driven down
// as he lands, and the hollow crumples under him. He holds, crouched over it.

const LEDGE = 220
const EDGE = 40
const HOLLOW_AT = 200
// Where he steps to on the ledge, and where he lands.
const STEP_TO = 20
const LANDED = 140
const STEP = 50

function move(profession: Parameters<typeof guard>[0], t: number): Frame {
  if (t < 0.4) {
    const along = ramp(t, 0, 0.22)
    const raised = ramp(t, 0.18, 0.4)
    const stride = along > 0 && along < 1 ? walk(profession, (STEP_TO * along) / STEP) : guard(profession)
    return { pose: blend(stride, RAISE, raised), ahead: STEP_TO * along, lift: LEDGE, roll: 0 }
  }
  const leap = ramp(t, 0.4, 0.5)
  const fall = ramp(t, 0.5, 0.7)
  const lift = t < 0.5 ? LEDGE + hop(leap * 0.5, 40) : LEDGE + 40 - drop(fall, LEDGE + 40)
  const pose = t < 0.7 ? blend(RAISE, FALL, ramp(t, 0.42, 0.55)) : blend(FALL, PLUNGED, ramp(t, 0.7, 0.8))
  return { pose, ahead: lerp(STEP_TO, LANDED, ramp(t, 0.4, 0.7)), lift: Math.max(0, lift), roll: 0 }
}

/** The broken ledge he stands on, its edge crumbling over the road. */
function Ledge() {
  return (
    <>
      <path d={`M-520 0 V${-LEDGE} H${EDGE - 20} L${EDGE} ${-LEDGE + 16} L${EDGE - 6} ${-LEDGE + 60} L${EDGE + 10} ${-LEDGE + 120} L${EDGE - 4} 0 Z`} fill={SOUL.slab} />
      <path d={`M-520 ${-LEDGE} H${EDGE - 20}`} stroke={SOUL.ridge} strokeWidth={5} />
      <path d={`M-420 ${-LEDGE + 60} H-120 M-300 ${-LEDGE + 120} H${EDGE - 20} M-500 ${-LEDGE + 180} H-200`} stroke={SOUL.rock} strokeWidth={4} />
    </>
  )
}

export const work: Place = {
  travel: LANDED,
  script: [1800, 2200],
  ends: [0.4, 1],
  ahead: () => (
    <>
      <Ledge />
      <g transform={`translate(${HOLLOW_AT} 0)`}>
        <Hollow id="hollow" />
      </g>
    </>
  ),
  move,
  reply: (stage) => {
    const hollow = fx(stage, 'hollow')
    return (t) => {
      const struck = ramp(t, 0.66, 0.84)
      transformTo(hollow, turnOf(78 * struck, [24, 0], 0, 0))
    }
  },
}
