import { litOf } from '@/lib/scroll/propRow'
import { fadeTo } from '../../shared/stageNodes'
import { PropRow, propNodes } from '../../shared/propRow'
import { NOIR } from '../palette'
import { Walker, walkerOf, type Place } from '../place'
import { FLOOR } from '../street'
import { badge } from '../pose'

// Projects: the gallery after hours. A display case stands on its plinth for each project; as each is
// read he holds his badge up to it, and the case lights from above on the piece inside, its star glinting
// red.

function Case() {
  return (
    <>
      <rect x={-54} y={-120} width={108} height={120} fill={NOIR.ink} stroke={NOIR.smoke} strokeWidth="4" />
      <rect x={-48} y={-250} width={96} height={130} fill="none" stroke={NOIR.paperDim} strokeWidth="4" />
      <path d="M-36 -236 L-14 -170" stroke={NOIR.paper} strokeWidth="3" opacity="0.5" />
      <path d="M0 -200 L10 -172 L-10 -172 Z" fill={NOIR.ash} />
    </>
  )
}

function Lit() {
  return (
    <>
      <polygon points="-20,-480 20,-480 60,-250 -60,-250" fill={NOIR.paper} opacity="0.22" />
      <rect x={-48} y={-250} width={96} height={130} fill={NOIR.paper} opacity="0.18" />
      <path d="M0 -222 L7 -204 L26 -204 L11 -192 L17 -174 L0 -185 L-17 -174 L-11 -192 L-26 -204 L-7 -204 Z" fill={NOIR.red} stroke={NOIR.paper} strokeWidth="2" />
    </>
  )
}

export const projects: Place = {
  light: NOIR.paperDim,
  floor: ({ xs, profession }) => (
    <>
      <PropRow xs={xs} floor={FLOOR} art={() => <Case />} light={() => <Lit />} />
      <Walker xs={xs} profession={profession} />
    </>
  ),
  bind: (stage, input) => {
    const walker = walkerOf(stage, input, badge)
    const props = propNodes(stage, input.xs.length)
    return (_progress, reached) => {
      walker(reached)
      props.forEach(({ lit }, i) => fadeTo(lit, litOf(reached, i)))
    }
  },
}
