import { litOf } from '@/lib/scroll/propRow'
import { fadeTo, translateTo } from '../../shared/stageNodes'
import { PropRow, propNodes } from '../../shared/propRow'
import { NOIR } from '../palette'
import { Walker, walkerOf, type Place } from '../place'
import { FLOOR } from '../street'
import { pull } from '../pose'

// Work: the records room. A filing cabinet stands for each job; as each is read he takes its top drawer
// and pulls it out toward him, the red tab of the file standing up out of it.

// A pulled drawer comes out this far.
const OUT = 46

function Cabinet() {
  return (
    <>
      <rect x={-56} y={-230} width={112} height={230} fill={NOIR.ink} stroke={NOIR.smoke} strokeWidth="4" />
      {[-224, -150, -76].map((y) => (
        <g key={y}>
          <rect x={-48} y={y} width={96} height={66} fill={NOIR.coal} />
          <rect x={-18} y={y + 12} width={36} height={14} fill={NOIR.paperDim} />
          <rect x={-12} y={y + 38} width={24} height={6} fill={NOIR.ash} />
        </g>
      ))}
    </>
  )
}

function Drawer() {
  return (
    <>
      <rect x={-48} y={-224} width={96} height={66} fill={NOIR.smoke} stroke={NOIR.paper} strokeWidth="3" />
      <rect x={-40} y={-254} width={34} height={30} fill={NOIR.red} />
      <rect x={-2} y={-246} width={40} height={22} fill={NOIR.paper} />
      <rect x={-18} y={-212} width={36} height={14} fill={NOIR.paper} />
    </>
  )
}

export const work: Place = {
  light: NOIR.paperDim,
  floor: ({ xs, profession }) => (
    <>
      <PropRow xs={xs} floor={FLOOR} art={() => <Cabinet />} light={() => <Drawer />} />
      <Walker xs={xs} profession={profession} />
    </>
  ),
  bind: (stage, input) => {
    const walker = walkerOf(stage, input, pull)
    const props = propNodes(stage, input.xs.length)
    return (_progress, reached) => {
      walker(reached)
      props.forEach(({ lit }, i) => {
        const out = litOf(reached, i)
        fadeTo(lit, out)
        translateTo(lit, -OUT * out, 0)
      })
    }
  },
}
