import { litOf } from '@/lib/scroll/propRow'
import { fadeTo } from '../../shared/stageNodes'
import { PropRow, propNodes } from '../../shared/propRow'
import { NOIR } from '../palette'
import { Walker, walkerOf, type Place } from '../place'
import { FLOOR } from '../street'
import { stamp } from '../pose'

// Services: the case room. A case folder lies open on its desk for each service; as each is read he
// raises the stamp and brings it down, and the folder takes the red closed mark.

function Desk() {
  return (
    <>
      <rect x={-80} y={-110} width={160} height={14} fill={NOIR.ink} />
      <path d="M-70 -96 V0 M70 -96 V0" stroke={NOIR.ink} strokeWidth="10" />
      <polygon points="-62,-110 62,-110 52,-132 -52,-132" fill={NOIR.paperDim} stroke={NOIR.ink} strokeWidth="2" />
      <path d="M-40 -122 H30 M-40 -116 H10" stroke={NOIR.ash} strokeWidth="2" />
    </>
  )
}

function Closed() {
  return (
    <>
      <polygon points="-34,-140 34,-148 38,-110 -30,-104" fill="none" stroke={NOIR.red} strokeWidth="6" />
      <path d="M-18 -124 L-4 -112 L22 -138" fill="none" stroke={NOIR.red} strokeWidth="7" />
    </>
  )
}

export const services: Place = {
  light: NOIR.red,
  floor: ({ xs, profession }) => (
    <>
      <PropRow xs={xs} floor={FLOOR} art={() => <Desk />} light={() => <Closed />} />
      <Walker xs={xs} profession={profession} />
    </>
  ),
  bind: (stage, input) => {
    const walker = walkerOf(stage, input, stamp)
    const props = propNodes(stage, input.xs.length)
    return (_progress, reached) => {
      walker(reached)
      props.forEach(({ lit }, i) => fadeTo(lit, litOf(reached, i)))
    }
  },
}
