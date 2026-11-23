import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, translateTo } from '../../shared/stageNodes'
import { NOIR } from '../palette'
import type { Place } from '../place'
import { FLOOR, Sleuth, placeSleuth } from '../street'
import { drum, noirJoints, setNoirPose } from '../pose'
import { Shadow } from '../shadow'

// Bands: the club in the palace. He has slipped onto the empty drummer's stool behind the kit and plays as
// if he belonged there; for each band a guard walks the floor in front of the stage, past him without a
// look, the other way each time, and the stage light comes up on him a little more with each one.

const SEAT_X = 900
// The guard walks between these x, the first time right to left.
const WALK_FROM = 1380
const WALK_TO = 420

function Kit() {
  return (
    <>
      <rect x={SEAT_X - 200} y={FLOOR - 16} width={400} height={16} fill={NOIR.coal} stroke={NOIR.smoke} strokeWidth="4" />
      <circle cx={SEAT_X} cy={FLOOR - 62} r={46} fill={NOIR.red} stroke={NOIR.ink} strokeWidth="6" />
      <circle cx={SEAT_X} cy={FLOOR - 62} r={30} fill={NOIR.paper} stroke={NOIR.ink} strokeWidth="4" />
      <path d={`M${SEAT_X + 120} ${FLOOR - 40} V${FLOOR - 260} M${SEAT_X + 70} ${FLOOR - 270} H${SEAT_X + 180}`} stroke={NOIR.paperDim} strokeWidth="6" />
      <ellipse cx={SEAT_X + 125} cy={FLOOR - 270} rx={60} ry={8} fill={NOIR.paperDim} />
      <path d={`M${SEAT_X - 130} ${FLOOR - 40} V${FLOOR - 170}`} stroke={NOIR.paperDim} strokeWidth="6" />
      <ellipse cx={SEAT_X - 130} cy={FLOOR - 172} rx={48} ry={12} fill={NOIR.ash} stroke={NOIR.ink} strokeWidth="4" />
    </>
  )
}

function Spotlight() {
  return (
    <g data-fx="spot" opacity="0">
      <polygon points={`${SEAT_X - 40},0 ${SEAT_X + 40},0 ${SEAT_X + 240},${FLOOR} ${SEAT_X - 240},${FLOOR}`} fill={NOIR.paper} opacity="0.22" />
      <ellipse cx={SEAT_X} cy={FLOOR} rx={240} ry={20} fill={NOIR.paper} opacity="0.3" />
    </g>
  )
}

/** Where the guard is on his round `t` of the way through band `at`'s walk. */
const guardX = (at: number, t: number): number => {
  const [from, to] = at % 2 === 0 ? [WALK_FROM, WALK_TO] : [WALK_TO, WALK_FROM]
  return from + (to - from) * t
}

export const bands: Place = {
  light: NOIR.paper,
  floor: ({ profession }) => (
    <>
      <Spotlight />
      <Sleuth x={SEAT_X} profession={profession} />
      <Kit />
      <g data-fx="patrol" transform={`translate(${WALK_FROM} ${FLOOR + 60})`}>
        <g data-fx="patrol-face">
          <Shadow name="guard" />
        </g>
      </g>
    </>
  ),
  bind: (stage, { count }) => {
    const root = fx(stage, 'detective')
    const joints = root ? noirJoints(root) : null
    const spot = fx(stage, 'spot')
    const patrol = fx(stage, 'patrol')
    const face = fx(stage, 'patrol-face')
    placeSleuth(root, SEAT_X)
    return (_progress, reached) => {
      const at = Math.min(count - 1, Math.max(0, Math.floor(reached)))
      const walked = ramp(reached - at, 0, 1) + (reached >= count ? 1 : 0)
      translateTo(patrol, guardX(at, Math.min(1, walked)), FLOOR + 60)
      face?.setAttribute('transform', `scale(${at % 2 === 0 ? -1 : 1} 1)`)
      fadeTo(spot, Math.min(1, reached / Math.max(1, count)))
      if (joints) setNoirPose(joints, drum(ramp(reached, 0, 0.3), reached * 8))
    }
  },
}
