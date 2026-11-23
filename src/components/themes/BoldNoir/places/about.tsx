import { litOf } from '@/lib/scroll/propRow'
import { fadeTo } from '../../shared/stageNodes'
import { PropRow, propNodes } from '../../shared/propRow'
import { NOIR } from '../palette'
import { Walker, walkerOf, type Place } from '../place'
import { FLOOR } from '../street'
import { note } from '../pose'

// About: the evidence board. A photograph stands pinned on its easel for each line of the record; as each
// is read he works it in his notebook (or points it out), and a red clue mark is stamped over the
// photograph with the red string run from its pin.

function Easel() {
  return (
    <>
      <path d="M-50 0 L-20 -200 M50 0 L20 -200 M0 -60 V0" stroke={NOIR.ink} strokeWidth="8" />
      <rect x={-64} y={-260} width={128} height={110} fill={NOIR.paper} stroke={NOIR.ink} strokeWidth="4" />
      <rect x={-50} y={-246} width={100} height={70} fill={NOIR.smoke} />
      <circle cx={0} cy={-216} r={16} fill={NOIR.ink} />
      <path d="M-26 -176 Q0 -210 26 -176 Z" fill={NOIR.ink} />
      <circle cx={0} cy={-262} r={7} fill={NOIR.red} />
    </>
  )
}

function Clue() {
  return (
    <>
      <path d="M0 -262 L80 -320 L160 -262" fill="none" stroke={NOIR.red} strokeWidth="4" />
      <path d="M26 -236 L36 -212 L60 -220 L44 -200 L60 -180 L36 -188 L26 -164 L16 -188 L-8 -180 L8 -200 L-8 -220 L16 -212 Z" fill={NOIR.red} stroke={NOIR.paper} strokeWidth="3" />
    </>
  )
}

export const about: Place = {
  light: NOIR.paper,
  floor: ({ xs, profession }) => (
    <>
      <PropRow xs={xs} floor={FLOOR} art={() => <Easel />} light={() => <Clue />} />
      <Walker xs={xs} profession={profession} />
    </>
  ),
  bind: (stage, input) => {
    const walker = walkerOf(stage, input, note)
    const props = propNodes(stage, input.xs.length)
    return (_progress, reached) => {
      walker(reached)
      props.forEach(({ lit }, i) => fadeTo(lit, litOf(reached, i)))
    }
  },
}
