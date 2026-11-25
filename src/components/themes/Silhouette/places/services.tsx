import { mix } from '@/lib/motion/rigPose'
import type { Profession } from '@/lib/cv/professions'
import { ramp } from '@/lib/scroll/stage'
import { fx, lerp, translateTo } from '../../shared/stageNodes'
import { SHADE, type Light } from '../palette'
import { arc, runFrame, type Frame, type Place } from '../place'
import { CLIMB, CROUCH, SHOVE, TUCK } from '../pose'

// Beat 5, the decayed city at the forest's end: a wall too high to climb, a dead lamp sign on it with no
// words, and a wooden crate in the street. He leans into the crate and pushes it along to the wall; he climbs
// onto it; he jumps from it onto the wall's top, runs over and drops down the far side into the city.

const CRATE = { from: 150, size: 54 }
const WALL = { from: 380, to: 470, h: 120 }
// The crate's left side when it stands against the wall, and where he stands pushing it there.
const CRATE_TO = WALL.from - CRATE.size
const HANDS = 28

function move(profession: Profession, t: number, length: number): Frame {
  if (t < 0.4) {
    const walk = ramp(t, 0, 0.1)
    if (walk < 1) return runFrame(profession, 0, CRATE.from - HANDS, walk)
    const push = ramp(t, 0.1, 0.4)
    return { pose: SHOVE, ahead: lerp(CRATE.from, CRATE_TO, push) - HANDS, lift: 0, over: 0 }
  }
  if (t < 0.68) {
    const climb = ramp(t, 0.42, 0.66)
    return { pose: mix(CLIMB, CROUCH, ramp(climb, 0.6, 1)), ahead: lerp(CRATE_TO - HANDS, CRATE_TO + CRATE.size / 2, climb), lift: CRATE.size * ramp(climb, 0, 0.6), over: 0 }
  }
  const up = ramp(t, 0.68, 0.78)
  if (up < 1) return { pose: mix(TUCK, CROUCH, ramp(up, 0.7, 1)), ahead: lerp(CRATE_TO + CRATE.size / 2, WALL.from + 20, up), lift: CRATE.size + arc(up, 40, WALL.h - CRATE.size), over: 0 }
  const across = ramp(t, 0.78, 0.86)
  if (across < 1) return { ...runFrame(profession, WALL.from + 20, WALL.to - 10, across), lift: WALL.h }
  const drop = ramp(t, 0.86, 0.92)
  if (drop < 1) return { pose: mix(TUCK, CROUCH, drop), ahead: lerp(WALL.to - 10, WALL.to + 50, drop), lift: WALL.h + arc(drop, 12, -WALL.h), over: 0 }
  return runFrame(profession, WALL.to + 50, length, ramp(t, 0.92, 1))
}

export const services: Place = {
  region: 'city',
  length: 560,
  script: [1900, 1300, 1600],
  ends: [0.4, 0.68, 1],
  obstacle: ({ light }: { light: Light }) => (
    <>
      <g data-fx="crate" transform={`translate(${CRATE.from} 0)`}>
        <rect y={-CRATE.size} width={CRATE.size} height={CRATE.size} fill={SHADE.black} />
        <path d={`M4 ${-CRATE.size + 4} L${CRATE.size - 4} -4 M${CRATE.size - 4} ${-CRATE.size + 4} L4 -4`} stroke={light.far} strokeOpacity={0.35} strokeWidth={2} />
      </g>
      <rect x={WALL.from} y={-WALL.h} width={WALL.to - WALL.from} height={WALL.h + 4} fill={SHADE.black} />
      <path d={`M${WALL.from - 4} ${-WALL.h} H${WALL.to + 4} V${-WALL.h + 8} H${WALL.from - 4} Z`} fill={SHADE.black} />
      {/* the dead lamp sign standing on the wall: an empty frame on two legs, a bulb holder hanging off it */}
      <path d={`M${WALL.from + 14} ${-WALL.h} V${-WALL.h - 70} M${WALL.to - 14} ${-WALL.h} V${-WALL.h - 70}`} stroke={SHADE.black} strokeWidth={5} />
      <rect x={WALL.from - 10} y={-WALL.h - 150} width={WALL.to - WALL.from + 20} height={80} fill="none" stroke={SHADE.black} strokeWidth={7} />
      <path d={`M${WALL.from + 30} ${-WALL.h - 70} v18 m-5 0 h10`} stroke={SHADE.black} strokeWidth={3} />
    </>
  ),
  move,
  reply: (stage) => {
    const crate = fx(stage, 'crate')
    return (t) => translateTo(crate, lerp(CRATE.from, CRATE_TO, ramp(t, 0.1, 0.4)), 0)
  },
}
