import { drop } from '@/lib/motion/arc'
import { mix } from '@/lib/motion/rigPose'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, transformTo } from '../../shared/stageNodes'
import { Canvas, FIGURE_H, FLOOR, W } from '../forest'
import { SHADE, type Light } from '../palette'
import { AT, type Place } from '../place'
import { CROUCH, kick, rest } from '../pose'

// Muay Thai in the gravity room: a machine room with a ceiling, a heavy bag hanging from it. Gravity flips:
// he falls up to the ceiling and lands on it upside down in a crouch; he kicks the bag hanging before him,
// which swings away; then gravity flips back and he drops to the floor and lands in his guard.

// Low enough that a phone's view, its top at y 134 under the page's bar, shows the ceiling and him on it.
const CEILING = 330
// Standing on the ceiling upside down, his soles are on it: the lift that puts the top of his box there.
const UP = FLOOR - CEILING - FIGURE_H
const BAG = 260
// He stands back from the bag's spot so it hangs a kick's reach ahead of him, never over him.
const BACK = -0.6 * AT
// A kicked bag swings away from him this far.
const SWING = 18

/** The room's ceiling and its girders over the path. */
function Ceiling({ light }: { light: Light }) {
  return (
    <Canvas>
      <rect width={W} height={CEILING} fill={SHADE.black} />
      <path d={`M0 ${CEILING} H${W}`} stroke={light.rim} strokeOpacity={0.3} strokeWidth={3} />
    </Canvas>
  )
}

const swung = (t: number): string => `rotate(${(SWING * t).toFixed(1)} 0 ${CEILING - FLOOR})`

export const muayThai: Place = {
  script: [1600, 1600, 1600],
  ends: [0.33, 0.66, 1],
  mid: ({ light }) => <Ceiling light={light} />,
  obstacle: ({ light }) => (
    <g data-fx="bag" transform={swung(0)}>
      <line x1={0} y1={CEILING - FLOOR} x2={0} y2={CEILING - FLOOR + 60} stroke={SHADE.black} strokeWidth={5} />
      <path d={`M-44 ${CEILING - FLOOR + 60} H44 L44 ${CEILING - FLOOR + BAG} Q0 ${CEILING - FLOOR + BAG + 16} -44 ${CEILING - FLOOR + BAG} Z`} fill={SHADE.black} />
      <g data-fx="edge" opacity="0">
        <path d={`M44 ${CEILING - FLOOR + 60} V${CEILING - FLOOR + BAG}`} stroke={light.rim} strokeWidth={6} />
      </g>
    </g>
  ),
  move: (profession, t) => {
    if (t < 0.33) return { pose: CROUCH, ahead: BACK, lift: drop(ramp(t, 0, 0.3), UP), over: ramp(t, 0, 0.25) }
    if (t < 0.66) {
      const struck = kick(profession, ramp(t, 0.36, 0.56))
      return { pose: t < 0.56 ? mix(CROUCH, struck, ramp(t, 0.33, 0.38)) : mix(struck, CROUCH, ramp(t, 0.58, 0.66)), ahead: BACK, lift: UP, over: 1 }
    }
    const fall = ramp(t, 0.66, 0.9)
    return { pose: mix(CROUCH, rest(profession), ramp(t, 0.88, 1)), ahead: BACK, lift: UP - drop(fall, UP), over: 1 - ramp(t, 0.66, 0.8) }
  },
  reply: (stage) => {
    const bag = fx(stage, 'bag')
    const edge = fx(stage, 'edge')
    return (t) => {
      const hit = ramp(t, 0.5, 0.6)
      transformTo(bag, swung(hit * (1 - 0.7 * ramp(t, 0.66, 1))))
      fadeTo(edge, hit)
    }
  },
}
