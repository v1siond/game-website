import { litOf } from '@/lib/scroll/propRow'
import { fadeTo } from '../../shared/stageNodes'
import { PropRow, propNodes } from '../../shared/propRow'
import { NOIR } from '../palette'
import { Walker, walkerOf, type Place } from '../place'
import { FLOOR } from '../street'
import { point } from '../pose'

// Ventures: main street. A shop sign stands on its post for each venture; as each is read he points it
// out, and its tube lights red with the glow on the pavement under it.

function Sign() {
  return (
    <>
      <rect x={-6} y={-200} width={12} height={200} fill={NOIR.ink} />
      <polygon points="-70,-300 76,-292 70,-200 -66,-206" fill={NOIR.coal} stroke={NOIR.paperDim} strokeWidth="4" />
      <path d="M-44 -264 H40 M-44 -238 H20" stroke={NOIR.ash} strokeWidth="8" />
    </>
  )
}

function Neon() {
  return (
    <>
      <ellipse cx={0} cy={-4} rx={110} ry={14} fill={NOIR.red} opacity="0.35" />
      <circle cx={0} cy={-250} r={130} fill={NOIR.red} opacity="0.14" />
      <polygon points="-58,-288 64,-281 59,-212 -55,-217" fill="none" stroke={NOIR.red} strokeWidth="6" />
      <path d="M-44 -264 H40 M-44 -238 H20" stroke={NOIR.red} strokeWidth="8" />
    </>
  )
}

export const ventures: Place = {
  light: NOIR.red,
  floor: ({ xs, profession }) => (
    <>
      <PropRow xs={xs} floor={FLOOR} art={() => <Sign />} light={() => <Neon />} />
      <Walker xs={xs} profession={profession} />
    </>
  ),
  bind: (stage, input) => {
    const walker = walkerOf(stage, input, point)
    const props = propNodes(stage, input.xs.length)
    return (_progress, reached) => {
      walker(reached)
      props.forEach(({ lit }, i) => fadeTo(lit, litOf(reached, i)))
    }
  },
}
