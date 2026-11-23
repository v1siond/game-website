import { litOf } from '@/lib/scroll/propRow'
import { fadeTo } from '../../shared/stageNodes'
import { PropRow, propNodes } from '../../shared/propRow'
import { FLOOR } from '../forest'
import { SHADE, type Light } from '../palette'
import { Walker, walkerOf, type Place } from '../place'
import { jump } from '../pose'

// Services on the trap line: a bear trap lies open on the path for each service; as each is read he hops
// at its edge and its jaws snap shut under him, a spark of light where they meet.

/** The trap open, its jaws laid flat with their teeth up. */
function Open() {
  return (
    <>
      <rect x={-80} y={-10} width={160} height={10} fill={SHADE.black} />
      <path d="M-80 -10 L-70 -34 L-60 -10 L-50 -34 L-40 -10 L-30 -34 L-20 -10 M20 -10 L30 -34 L40 -10 L50 -34 L60 -10 L70 -34 L80 -10" fill={SHADE.black} />
    </>
  )
}

/** The trap shut, its jaws up and locked in a ring. */
function Shut() {
  return (
    <>
      <rect x={-80} y={-10} width={160} height={10} fill={SHADE.black} />
      <path d="M-34 -10 Q-40 -90 0 -100 Q40 -90 34 -10 Z" fill={SHADE.black} />
      <path d="M-26 -50 L-14 -60 L-6 -48 L6 -60 L14 -48 L26 -60" stroke={SHADE.fog} strokeWidth={4} fill="none" />
    </>
  )
}

function Spark({ light }: { light: Light }) {
  return (
    <>
      <Shut />
      <circle cx={0} cy={-104} r={36} fill={light.rim} opacity={0.35} />
      <path d="M0 -130 L6 -110 L26 -104 L6 -98 L0 -78 L-6 -98 L-26 -104 L-6 -110 Z" fill={light.rim} />
    </>
  )
}

export const services: Place = {
  floor: ({ xs, profession, light }) => (
    <>
      <PropRow xs={xs} floor={FLOOR} art={() => <Open />} light={() => <Spark light={light} />} />
      <Walker xs={xs} profession={profession} />
    </>
  ),
  bind: (stage, input) => {
    const walker = walkerOf(stage, input, jump)
    const props = propNodes(stage, input.xs.length)
    return (_progress, reached) => {
      walker(reached)
      props.forEach(({ move, lit }, i) => {
        const shut = litOf(reached, i)
        fadeTo(lit, shut)
        fadeTo(move, 1 - shut)
      })
    }
  },
}
