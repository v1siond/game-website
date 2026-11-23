import { litOf } from '@/lib/scroll/propRow'
import { fadeTo } from '../../shared/stageNodes'
import { PropRow, propNodes } from '../../shared/propRow'
import { Canvas, FLOOR } from '../forest'
import { SHADE, type Light } from '../palette'
import { Walker, walkerOf, type Place } from '../place'
import { reach } from '../pose'

// About in the thicket: a giant spider's legs reach down out of the dark boughs behind, and a dead lantern
// hangs on a thread for each line of the record; as each is read he reaches up and it lights.

const HOOK = -400

function Lantern() {
  return (
    <>
      <line x1={0} y1={-1000} x2={0} y2={HOOK} stroke={SHADE.black} strokeWidth={3} />
      <path d={`M-22 ${HOOK} H22 L30 ${HOOK + 24} L22 ${HOOK + 80} H-22 L-30 ${HOOK + 24} Z`} fill={SHADE.black} />
    </>
  )
}

function Flame({ light }: { light: Light }) {
  return (
    <>
      <circle cx={0} cy={HOOK + 44} r={70} fill={light.rim} opacity={0.25} />
      <path d={`M-14 ${HOOK + 20} H14 L18 ${HOOK + 36} L14 ${HOOK + 66} H-14 L-18 ${HOOK + 36} Z`} fill={light.rim} />
    </>
  )
}

/** The spider's legs, bent at the knee, out of the boughs top left. */
function Spider() {
  return (
    <Canvas>
      <g fill="none" stroke={SHADE.black} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round">
        <path d="M120 -20 L360 260 L420 700" />
        <path d="M60 -20 L250 300 L250 760" />
        <path d="M200 -20 L520 200 L620 620" />
      </g>
      <ellipse cx={130} cy={20} rx={180} ry={110} fill={SHADE.black} />
    </Canvas>
  )
}

export const about: Place = {
  mid: () => <Spider />,
  floor: ({ xs, profession, light }) => (
    <>
      <PropRow xs={xs} floor={FLOOR} art={() => <Lantern />} light={() => <Flame light={light} />} />
      <Walker xs={xs} profession={profession} />
    </>
  ),
  bind: (stage, input) => {
    const walker = walkerOf(stage, input, reach)
    const props = propNodes(stage, input.xs.length)
    return (_progress, reached) => {
      walker(reached)
      props.forEach(({ lit }, i) => fadeTo(lit, litOf(reached, i)))
    }
  },
}
