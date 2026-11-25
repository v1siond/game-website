import { mix } from '@/lib/motion/rigPose'
import type { Profession } from '@/lib/cv/professions'
import { ramp } from '@/lib/scroll/stage'
import { fx, lerp, transformTo } from '../../shared/stageNodes'
import { FIGURE_H, gearPath } from '../forest'
import { SHADE, type Light } from '../palette'
import { runFrame, type Frame, type Place } from '../place'
import { STRIKE, TUCK, rest } from '../pose'

// Beat 9, the gravity room: a low room with a switch on a post, and a saw blade running along a rail in the
// floor toward him. He strikes the switch and falls up to the ceiling as gravity turns over; he runs right
// along the ceiling, upside down, as the saw runs by under him; gravity turns back and he lands in his guard
// past it, and walks on.

const SWITCH = 80
const CEILING = 300
// Upside down on the ceiling: his soles on it, his head toward the floor.
const ON_CEILING = CEILING - FIGURE_H
const BACK = 440
const SAW = { r: 34, from: 760, to: 200 }

function move(profession: Profession, t: number, length: number): Frame {
  if (t < 0.3) {
    const walk = ramp(t, 0, 0.12)
    if (walk < 1) return runFrame(profession, 0, SWITCH - 20, walk)
    const strike = ramp(t, 0.12, 0.18)
    const fall = ramp(t, 0.2, 0.3)
    return { pose: fall > 0 ? TUCK : mix(rest(profession), STRIKE, strike), ahead: SWITCH - 20, lift: ON_CEILING * fall * fall, over: fall }
  }
  if (t < 0.68) return { ...runFrame(profession, SWITCH - 20, BACK, ramp(t, 0.3, 0.66)), lift: ON_CEILING, over: 1 }
  const back = ramp(t, 0.68, 0.78)
  if (back < 1) return { pose: TUCK, ahead: lerp(BACK, BACK + 40, back), lift: ON_CEILING * (1 - back * back), over: 1 - back }
  return runFrame(profession, BACK + 40, length, ramp(t, 0.8, 1))
}

export const muayThai: Place = {
  region: 'machine',
  length: 540,
  script: [1400, 1800, 1400],
  ends: [0.3, 0.68, 1],
  obstacle: ({ light }: { light: Light }) => (
    <>
      {/* the room's ceiling, the rail in the floor and its lamp */}
      <rect x={-500} y={-CEILING - 600} width={1500} height={600} fill={SHADE.black} />
      <rect x={-500} y={-4} width={1500} height={4} fill={light.rim} opacity={0.2} />
      <g data-fx="room-light">
        <path d={`M${SWITCH + 200} ${-CEILING} l-60 ${CEILING - 10} h120 Z`} fill={SHADE.glow} opacity={0.12} />
      </g>
      {/* the gravity switch on its post, an arrow plate over it */}
      <rect x={SWITCH - 3} y={-80} width={6} height={80} fill={SHADE.black} />
      <rect x={SWITCH - 12} y={-104} width={24} height={26} fill={SHADE.black} />
      <path data-fx="arrow" d={`M${SWITCH} -100 l-7 10 h4 v8 h6 v-8 h4 Z`} fill={light.rim} />
      <g data-fx="saw">
        <path d={gearPath(0, -SAW.r, SAW.r, 18)} fill={SHADE.black} fillRule="evenodd" />
      </g>
    </>
  ),
  move,
  reply: (stage) => {
    const saw = fx(stage, 'saw')
    const arrow = fx(stage, 'arrow')
    return (t) => {
      const x = lerp(SAW.from, SAW.to, ramp(t, 0.25, 0.75))
      transformTo(saw, `translate(${x.toFixed(1)} 0) rotate(${(-x * 1.7).toFixed(1)} 0 ${-SAW.r})`)
      // the arrow turns over with gravity, and back
      transformTo(arrow, `rotate(${(180 * (ramp(t, 0.18, 0.22) - ramp(t, 0.66, 0.7))).toFixed(1)} ${SWITCH} -91)`)
    }
  },
}
