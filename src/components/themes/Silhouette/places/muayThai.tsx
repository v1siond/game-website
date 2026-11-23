import { drop } from '@/lib/motion/arc'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, transformTo } from '../../shared/stageNodes'
import { Canvas, FIGURE_H, FLOOR, W } from '../forest'
import { SHADE, type Light } from '../palette'
import { AT, type Place } from '../place'
import { CROUCH, kick } from '../pose'

// Muay Thai in the gravity room: a machine room with a ceiling, and for each achievement a heavy bag hangs
// from the ceiling ahead of him. Gravity flips: he falls up to the ceiling, lands on it upside down in a
// crouch and kicks the bag hanging beside him, which swings away; the frame holds him on the ceiling at the
// end of the kick. The next beat flips him back down as the floor runs on.

const CEILING = 170
// Standing on the ceiling upside down, his soles are on it: the lift that puts the top of his box there.
const UP = FLOOR - CEILING - FIGURE_H
const BAG = 330
// A kicked bag swings away from him this far.
const SWING = 18
// Turned over on the ceiling he faces back the way he came, so the bag hangs behind his place on the floor.
const BAG_X = -2 * AT

/** The room's ceiling and its girders over the path. */
function Ceiling({ light }: { light: Light }) {
  return (
    <Canvas>
      <rect width={W} height={CEILING} fill={SHADE.black} />
      <path d={`M0 ${CEILING} H${W}`} stroke={light.rim} strokeOpacity={0.3} strokeWidth={3} />
    </Canvas>
  )
}

const swung = (t: number): string => `translate(${BAG_X} 0) rotate(${(SWING * t).toFixed(1)} 0 ${CEILING - FLOOR})`

export const muayThai: Place = {
  mid: ({ light }) => <Ceiling light={light} />,
  obstacle: (i, { light }) => (
    <g data-fx={`bag-${i}`} transform={swung(0)}>
      <line x1={0} y1={CEILING - FLOOR} x2={0} y2={CEILING - FLOOR + 60} stroke={SHADE.black} strokeWidth={5} />
      <path d={`M-44 ${CEILING - FLOOR + 60} H44 L44 ${CEILING - FLOOR + BAG} Q0 ${CEILING - FLOOR + BAG + 16} -44 ${CEILING - FLOOR + BAG} Z`} fill={SHADE.black} />
      <g data-fx={`edge-${i}`} opacity="0">
        <path d={`M44 ${CEILING - FLOOR + 60} V${CEILING - FLOOR + BAG}`} stroke={light.rim} strokeWidth={6} />
      </g>
    </g>
  ),
  move: (profession, t) => {
    const fall = ramp(t, 0, 0.35)
    const pose = t < 0.45 ? CROUCH : kick(profession, ramp(t, 0.45, 1))
    return { pose, ahead: 0, lift: drop(fall, UP), over: ramp(t, 0, 0.3) }
  },
  reply: (stage, { count }) => {
    const bags = Array.from({ length: count }, (_, i) => fx(stage, `bag-${i}`))
    const edges = Array.from({ length: count }, (_, i) => fx(stage, `edge-${i}`))
    return (played) =>
      bags.forEach((bag, i) => {
        const hit = ramp(played(i), 0.75, 0.9)
        transformTo(bag, swung(hit))
        fadeTo(edges[i], hit)
      })
  },
}
