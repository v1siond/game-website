import { litOf } from '@/lib/scroll/propRow'
import { fadeTo, fx, transformTo } from '../../shared/stageNodes'
import { PropRow, propNodes } from '../../shared/propRow'
import { FLOOR } from '../forest'
import { SHADE, type Light } from '../palette'
import { Walker, walkerOf, type Place } from '../place'
import { kick } from '../pose'

// Muay Thai in the forest ring: a heavy bag hangs from a bough for each achievement; as each is read he
// kicks it out of his guard and the bag swings away on its chain, light catching its edge.

const HOOK = -520
// A kicked bag swings away from him this far.
const SWING = 16

function Bough() {
  return <path d={`M-120 ${HOOK - 30} Q0 ${HOOK - 50} 120 ${HOOK - 20}`} fill="none" stroke={SHADE.black} strokeWidth={22} strokeLinecap="round" />
}

function Bag() {
  return (
    <>
      <line x1={0} y1={HOOK - 30} x2={0} y2={HOOK + 60} stroke={SHADE.black} strokeWidth={5} />
      <path d={`M-44 ${HOOK + 70} Q0 ${HOOK + 56} 44 ${HOOK + 70} L44 ${HOOK + 330} Q0 ${HOOK + 346} -44 ${HOOK + 330} Z`} fill={SHADE.black} />
    </>
  )
}

function Edge({ light }: { light: Light }) {
  return <path d={`M44 ${HOOK + 70} L44 ${HOOK + 330} Q20 ${HOOK + 342} 0 ${HOOK + 344}`} fill="none" stroke={light.rim} strokeWidth={6} />
}

const swung = (t: number): string => `rotate(${(-SWING * t).toFixed(1)} 0 ${HOOK - 30})`

export const muayThai: Place = {
  floor: ({ xs, profession, light }) => (
    <>
      <PropRow
        xs={xs}
        floor={FLOOR}
        art={(i) => (
          <>
            <Bough />
            <g data-fx={`bag-${i}`}>
              <Bag />
            </g>
          </>
        )}
        light={() => <Edge light={light} />}
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
        fadeTo(lit, hit)
        transformTo(lit, swung(hit))
        transformTo(bags[i], swung(hit))
      })
    }
  },
}
