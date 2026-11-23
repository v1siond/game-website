import { litOf } from '@/lib/scroll/propRow'
import { fadeTo, fx, transformTo } from '../../shared/stageNodes'
import { PropRow, propNodes } from '../../shared/propRow'
import { Burst } from '../ink'
import { CEL } from '../palette'
import { Walker, walkerOf, type Place } from '../place'
import { FLOOR, HOURS } from '../desert'
import { kick } from '../pose'

// Muay Thai at dusk: a heavy bag hangs from its frame for each achievement; as each is read he kicks it out
// of his guard, the bag swings away on its chain and a sun starburst lands on it.

const HOOK = -440
// A kicked bag swings away from him this far.
const SWING = 16

function Frame() {
  return <path d={`M70 0 V${HOOK - 20} H-10`} fill="none" stroke={CEL.steelDark} strokeWidth="12" />
}

function Bag() {
  return (
    <>
      <path d={`M0 ${HOOK - 20} V${HOOK + 60}`} stroke={CEL.steel} strokeWidth="5" />
      <path d={`M-40 ${HOOK + 70} Q0 ${HOOK + 58} 40 ${HOOK + 70} L40 ${HOOK + 300} Q0 ${HOOK + 314} -40 ${HOOK + 300} Z`} fill={CEL.red} />
      <path d={`M-40 ${HOOK + 120} H40 M-40 ${HOOK + 250} H40`} stroke={CEL.ink} strokeWidth="5" />
    </>
  )
}

export const muayThai: Place = {
  hour: HOURS.dusk,
  floor: ({ xs, profession }) => (
    <>
      <PropRow
        xs={xs}
        floor={FLOOR}
        art={(i) => (
          <>
            <Frame />
            <g data-fx={`bag-${i}`}>
              <Bag />
            </g>
          </>
        )}
        light={() => <Burst x={-20} y={HOOK + 190} r={44} fill={CEL.sun} />}
      />
      <Walker xs={xs} profession={profession} />
    </>
  ),
  bind: (stage, input) => {
    const walker = walkerOf(stage, input, kick)
    const props = propNodes(stage, input.xs.length)
    const bags = input.xs.map((_, i) => fx(stage, `bag-${i}`))
    return (_progress, reached) => {
      walker(reached)
      props.forEach(({ lit }, i) => {
        const hit = litOf(reached, i)
        const swing = `rotate(${(-SWING * hit).toFixed(1)} 0 ${HOOK - 20})`
        fadeTo(lit, hit)
        transformTo(lit, swing)
        transformTo(bags[i], swing)
      })
    }
  },
}
