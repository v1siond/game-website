import { litOf } from '@/lib/scroll/propRow'
import { fadeTo, fx, transformTo } from '../../shared/stageNodes'
import { PropRow, propNodes } from '../../shared/propRow'
import { FLOOR } from '../forest'
import { SHADE, type Light } from '../palette'
import { Walker, walkerOf, type Place } from '../place'
import { hang } from '../pose'

// Work at the chasm's edge: a rope hangs out of the dark for each job, a bell on the beam it hangs from; as
// each job is read he takes its rope and hangs his weight off it, the rope swings and its bell rings out
// in light.

const END = -330
const BEAM = -760
// A rope he hangs off swings this far.
const SWING = 5

function Rope() {
  return (
    <>
      <line x1={0} y1={BEAM} x2={0} y2={END} stroke={SHADE.black} strokeWidth={7} />
      <circle cx={0} cy={END + 6} r={10} fill={SHADE.black} />
    </>
  )
}

function Beam() {
  return (
    <>
      <rect x={-70} y={BEAM - 20} width={140} height={20} fill={SHADE.black} />
      <path d={`M-26 ${BEAM} Q-26 ${BEAM + 50} -34 ${BEAM + 60} H34 Q26 ${BEAM + 50} 26 ${BEAM} Z`} fill={SHADE.black} />
    </>
  )
}

function Ring({ light }: { light: Light }) {
  return (
    <>
      <circle cx={0} cy={BEAM + 40} r={90} fill={light.rim} opacity={0.2} />
      <path d={`M-20 ${BEAM + 10} Q-20 ${BEAM + 46} -26 ${BEAM + 54} H26 Q20 ${BEAM + 46} 20 ${BEAM + 10} Z`} fill={light.rim} />
    </>
  )
}

export const work: Place = {
  floor: ({ xs, profession, light }) => (
    <>
      <PropRow
        xs={xs}
        floor={FLOOR}
        art={(i) => (
          <>
            <Beam />
            <g data-fx={`rope-${i}`}>
              <Rope />
            </g>
          </>
        )}
        light={() => <Ring light={light} />}
      />
      <Walker xs={xs} profession={profession} />
    </>
  ),
  bind: (stage, input) => {
    const walker = walkerOf(stage, input, hang)
    const props = propNodes(stage, input.xs.length)
    const ropes = input.xs.map((_, i) => fx(stage, `rope-${i}`))
    return (_progress, reached) => {
      walker(reached)
      props.forEach(({ lit }, i) => {
        const rung = litOf(reached, i)
        fadeTo(lit, rung)
        transformTo(ropes[i], `rotate(${(-SWING * rung).toFixed(1)} 0 ${BEAM})`)
      })
    }
  },
}
