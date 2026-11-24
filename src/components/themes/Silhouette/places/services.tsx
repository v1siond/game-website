import { hop } from '@/lib/motion/arc'
import { mix } from '@/lib/motion/rigPose'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx } from '../../shared/stageNodes'
import { SHADE, type Light } from '../palette'
import { AT, type Place } from '../place'
import { CROUCH, TUCK, rest } from '../pose'

// Services on the trap line: a bear trap lies open in the path. He leaps it and the jaws snap shut under
// him; then he lands past it, crouched, and rises.

const HEIGHT = 170
// Where he lands past the trap, from his place.
const LANDED = 2 * AT + 110

function Open() {
  return (
    <>
      <rect x={-80} y={-10} width={160} height={10} fill={SHADE.black} />
      <path d="M-80 -10 L-70 -34 L-60 -10 L-50 -34 L-40 -10 L-30 -34 L-20 -10 M20 -10 L30 -34 L40 -10 L50 -34 L60 -10 L70 -34 L80 -10" fill={SHADE.black} />
    </>
  )
}

function Shut({ light }: { light: Light }) {
  return (
    <>
      <rect x={-80} y={-10} width={160} height={10} fill={SHADE.black} />
      <path d="M-34 -10 Q-40 -90 0 -100 Q40 -90 34 -10 Z" fill={SHADE.black} />
      <circle cx={0} cy={-104} r={36} fill={light.rim} opacity={0.35} />
      <path d="M0 -130 L6 -110 L26 -104 L6 -98 L0 -78 L-6 -98 L-26 -104 L-6 -110 Z" fill={light.rim} />
    </>
  )
}

export const services: Place = {
  script: [1600, 1400],
  ends: [0.55, 1],
  obstacle: ({ light }) => (
    <>
      <g data-fx="open">
        <Open />
      </g>
      <g data-fx="shut" opacity="0">
        <Shut light={light} />
      </g>
    </>
  ),
  // the leap over the trap and down past it, then the landing crouch and up again
  move: (profession, t) => {
    const leap = ramp(t, 0.05, 0.62)
    const pose = t < 0.55 ? mix(rest(profession), TUCK, ramp(t, 0.05, 0.25)) : mix(mix(TUCK, CROUCH, ramp(t, 0.55, 0.66)), rest(profession), ramp(t, 0.75, 1))
    return { pose, ahead: LANDED * leap, lift: hop(leap, HEIGHT), over: 0 }
  },
  reply: (stage) => {
    const open = fx(stage, 'open')
    const shut = fx(stage, 'shut')
    return (t) => {
      const snapped = ramp(t, 0.3, 0.4)
      fadeTo(open, 1 - snapped)
      fadeTo(shut, snapped)
    }
  },
}
