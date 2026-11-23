import { litOf } from '@/lib/scroll/propRow'
import { fadeTo } from '../../shared/stageNodes'
import { PropRow, propNodes } from '../../shared/propRow'
import { Burst } from '../ink'
import { CEL } from '../palette'
import { Walker, walkerOf, type Place } from '../place'
import { FLOOR, HOURS } from '../desert'
import { point } from '../pose'

// Ventures at dusk: a maker's plate stands riveted to its post for each venture; as each is read he points
// it out and a starburst of its colour splats behind it.

const TONES = [CEL.orange, CEL.sun, CEL.holo]

function Plate() {
  return (
    <>
      <rect x={-8} y={-170} width={16} height={170} fill={CEL.steelDark} />
      <path d="M-56 -270 L0 -296 L56 -270 L56 -196 L0 -168 L-56 -196 Z" fill={CEL.steel} />
      <circle cx={-40} cy={-262} r={6} fill={CEL.steelDark} />
      <circle cx={40} cy={-262} r={6} fill={CEL.steelDark} />
    </>
  )
}

export const ventures: Place = {
  hour: HOURS.dusk,
  floor: ({ xs, profession }) => (
    <>
      <PropRow
        xs={xs}
        floor={FLOOR}
        art={() => <Plate />}
        light={(i) => (
          <>
            <Burst x={0} y={-232} r={100} fill={TONES[i % TONES.length]} />
            <path d="M-56 -270 L0 -296 L56 -270 L56 -196 L0 -168 L-56 -196 Z" fill={TONES[i % TONES.length]} />
          </>
        )}
      />
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
