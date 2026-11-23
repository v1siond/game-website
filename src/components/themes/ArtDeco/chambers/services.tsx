import { litOf } from '@/lib/scroll/propRow'
import { fadeTo, transformTo } from '../../shared/stageNodes'
import { DECO_COLORS as C } from '../palette'
import { PropRow, propNodes } from '../../shared/propRow'
import { Walker, walkerOf, type Chamber } from '../chamber'
import { FLOOR } from '../city'
import { lift } from '../pose'

// Services: the telekinesis hall. A sealed crate of the city stands on the floor for each service; as each
// service is read he walks up to its crate and raises the charged hand, and the crate lifts off the floor
// in the blue of the telekinesis and hangs there, lit, over its own shadow.

// A lifted crate hangs this far up.
const LIFT = 150

function Crate() {
  return (
    <>
      <rect x={-62} y={-120} width={124} height={120} fill={C.bronzePanel} stroke={C.brassMid} strokeWidth="4" />
      <path d="M-62 -120 L62 0 M62 -120 L-62 0" stroke={C.brassDark} strokeWidth="3" />
      <path d="M0 -92 L22 -60 L0 -28 L-22 -60 Z" fill={C.gold} stroke={C.brassDark} strokeWidth="2" />
      <path d="M-62 -60 H62" stroke={C.brassMid} strokeWidth="3" />
    </>
  )
}

function Telekinesis() {
  return (
    <>
      <ellipse cx={0} cy={-4} rx={70} ry={10} fill={C.abyss} opacity="0.6" />
      <circle cx={0} cy={-60 - LIFT} r={110} fill={C.bolt} opacity="0.16" />
      <path d="M-70 -40 Q-90 -110 -70 -170 M70 -40 Q90 -110 70 -170" fill="none" stroke={C.bolt} strokeWidth="3" strokeDasharray="6 10" opacity="0.8" />
    </>
  )
}

export const services: Chamber = {
  light: C.bolt,
  floor: ({ xs, profession }) => (
    <>
      <PropRow xs={xs} floor={FLOOR} art={() => <Crate />} light={() => <Telekinesis />} />
      <Walker xs={xs} profession={profession} />
    </>
  ),
  bind: (stage, input) => {
    const walker = walkerOf(stage, input, lift)
    const props = propNodes(stage, input.xs.length)
    return (_progress, reached) => {
      walker(reached)
      props.forEach(({ move, lit }, i) => {
        const lifted = litOf(reached, i)
        fadeTo(lit, lifted)
        transformTo(move, `translate(0 ${(-lifted * LIFT).toFixed(1)})`)
      })
    }
  },
}
