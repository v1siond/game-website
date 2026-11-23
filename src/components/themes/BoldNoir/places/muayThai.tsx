import { litOf } from '@/lib/scroll/propRow'
import { fadeTo, fx, transformTo } from '../../shared/stageNodes'
import { PropRow, propNodes } from '../../shared/propRow'
import { NOIR } from '../palette'
import { Walker, walkerOf, type Place } from '../place'
import { FLOOR } from '../street'
import { jab } from '../pose'

// Muay Thai: the back alley gym. A heavy bag hangs from its gallows for each achievement; as each is read
// he jabs it out of his guard, the bag swings back on its chain and a red hit star bursts on it.

const HOOK = -470
// A hit bag swings back this far, away from him.
const SWING = 14

function Gallows() {
  return (
    <>
      <path d={`M60 0 V${HOOK - 20} H-10`} fill="none" stroke={NOIR.ink} strokeWidth="12" />
      <path d={`M40 0 H80`} stroke={NOIR.ink} strokeWidth="10" />
    </>
  )
}

function Bag() {
  return (
    <>
      <path d={`M0 ${HOOK - 20} V${HOOK + 140}`} stroke={NOIR.ash} strokeWidth="5" />
      <rect x={-40} y={HOOK + 140} width={80} height={230} rx={16} fill={NOIR.red} stroke={NOIR.ink} strokeWidth="5" />
      <path d={`M-40 ${HOOK + 190} H40 M-40 ${HOOK + 320} H40`} stroke={NOIR.ink} strokeWidth="6" />
    </>
  )
}

function Hit() {
  return <path d={`M-30 ${HOOK + 220} l16 26 l28 -12 l-8 30 l30 10 l-30 10 l8 30 l-28 -12 l-16 26 l-12 -28 l-30 8 l16 -26 l-22 -20 l30 -2 Z`} fill={NOIR.paper} stroke={NOIR.ink} strokeWidth="3" />
}

export const muayThai: Place = {
  light: NOIR.red,
  floor: ({ xs, profession }) => (
    <>
      <PropRow
        xs={xs}
        floor={FLOOR}
        art={(i) => (
          <>
            <Gallows />
            <g data-fx={`bag-${i}`}>
              <Bag />
            </g>
          </>
        )}
        light={() => <Hit />}
      />
      <Walker xs={xs} profession={profession} />
    </>
  ),
  bind: (stage, input) => {
    const walker = walkerOf(stage, input, jab)
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
