import { hop } from '@/lib/motion/arc'
import { mix } from '@/lib/motion/rigPose'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx } from '../../shared/stageNodes'
import { SHADE, type Light } from '../palette'
import { AT, type Place } from '../place'
import { TUCK, rest } from '../pose'

// Services on the trap line: a bear trap lies open in the path for each service. He leaps it, and as he
// clears it the jaws snap shut under him; the frame holds him at the top of the leap over the shut trap.

const HEIGHT = 150

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
  obstacle: (i, { light }) => (
    <>
      <g data-fx={`open-${i}`}>
        <Open />
      </g>
      <g data-fx={`shut-${i}`} opacity="0">
        <Shut light={light} />
      </g>
    </>
  ),
  // the leap's first half, from take off to the top over the trap, held there
  move: (profession, t) => ({ pose: mix(rest(profession), TUCK, ramp(t, 0.1, 0.6)), ahead: AT * t, lift: hop(t / 2, HEIGHT), over: 0 }),
  reply: (stage, { count }) => {
    const open = Array.from({ length: count }, (_, i) => fx(stage, `open-${i}`))
    const shut = Array.from({ length: count }, (_, i) => fx(stage, `shut-${i}`))
    return (played) =>
      open.forEach((trap, i) => {
        const snapped = ramp(played(i), 0.6, 0.75)
        fadeTo(trap, 1 - snapped)
        fadeTo(shut[i], snapped)
      })
  },
}
