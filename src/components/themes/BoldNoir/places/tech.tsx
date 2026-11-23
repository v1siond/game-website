import { litOf } from '@/lib/scroll/propRow'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, transformTo } from '../../shared/stageNodes'
import { PropRow, propNodes } from '../../shared/propRow'
import { NOIR } from '../palette'
import { Walker, walkerOf, type Place } from '../place'
import { FLOOR } from '../street'
import { crack } from '../pose'

// Tech: the vault. A safe stands for each group of tools; as each is read he works its dial, the dial
// turns under his hand, and the safe's door swings open on its paper lit inside.

const DIAL = { y: -110, r: 26 }
// A cracked safe's dial has turned this far.
const TURNED = 270

function Safe() {
  return (
    <>
      <rect x={-70} y={-190} width={140} height={180} fill={NOIR.ink} stroke={NOIR.ash} strokeWidth="5" />
      <rect x={-60} y={-10} width={24} height={10} fill={NOIR.ink} />
      <rect x={36} y={-10} width={24} height={10} fill={NOIR.ink} />
      <rect x={-56} y={-176} width={112} height={152} fill="none" stroke={NOIR.smoke} strokeWidth="3" />
    </>
  )
}

function Dial() {
  return (
    <>
      <circle cx={0} cy={DIAL.y} r={DIAL.r} fill={NOIR.paperDim} stroke={NOIR.ink} strokeWidth="3" />
      <path d={`M0 ${DIAL.y - DIAL.r} V${DIAL.y - DIAL.r + 10}`} stroke={NOIR.red} strokeWidth="4" />
      <circle cx={0} cy={DIAL.y} r={6} fill={NOIR.ink} />
    </>
  )
}

function Open() {
  return (
    <>
      <rect x={-56} y={-176} width={112} height={152} fill={NOIR.paper} />
      <rect x={-40} y={-150} width={80} height={30} fill={NOIR.red} />
      <rect x={-40} y={-104} width={80} height={60} fill={NOIR.smoke} />
      <polygon points="-56,-176 -110,-196 -110,-4 -56,-24" fill={NOIR.coal} stroke={NOIR.ash} strokeWidth="4" />
    </>
  )
}

export const tech: Place = {
  light: NOIR.paper,
  floor: ({ xs, profession }) => (
    <>
      <PropRow
        xs={xs}
        floor={FLOOR}
        art={(i) => (
          <>
            <Safe />
            <g data-fx={`dial-${i}`}>
              <Dial />
            </g>
          </>
        )}
        light={() => <Open />}
      />
      <Walker xs={xs} profession={profession} />
    </>
  ),
  bind: (stage, input) => {
    const walker = walkerOf(stage, input, crack)
    const props = propNodes(stage, input.xs.length)
    const dials = input.xs.map((_, i) => fx(stage, `dial-${i}`))
    return (_progress, reached) => {
      walker(reached)
      props.forEach(({ lit }, i) => {
        fadeTo(lit, litOf(reached, i))
        transformTo(dials[i], `rotate(${(TURNED * ramp(reached - i, 0, 0.5)).toFixed(1)} 0 ${DIAL.y})`)
      })
    }
  },
}
