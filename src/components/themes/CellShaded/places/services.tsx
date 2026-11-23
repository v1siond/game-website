import { litOf } from '@/lib/scroll/propRow'
import { fadeTo } from '../../shared/stageNodes'
import { PropRow, propNodes } from '../../shared/propRow'
import { Burst } from '../ink'
import { CEL } from '../palette'
import { Walker, walkerOf, type Place } from '../place'
import { FLOOR, HOURS } from '../desert'
import { kick } from '../pose'

// Services in the town's afternoon: a supply crate stands in the sand for each service; as each is read
// he kicks it and its lid bursts open in an orange starburst.

function Crate() {
  return (
    <>
      <rect x={-60} y={-110} width={120} height={110} fill={CEL.plank} />
      <path d="M-60 -110 L60 0 M60 -110 L-60 0" stroke={CEL.plankShade} strokeWidth="6" />
      <rect x={-66} y={-124} width={132} height={18} fill={CEL.plankShade} />
    </>
  )
}

function Open() {
  return (
    <>
      <Burst x={0} y={-150} r={70} fill={CEL.orange} />
      <rect x={-66} y={-170} width={132} height={18} fill={CEL.plankShade} transform="rotate(-24 -66 -160)" />
    </>
  )
}

export const services: Place = {
  hour: HOURS.town,
  floor: ({ xs, profession }) => (
    <>
      <PropRow xs={xs} floor={FLOOR} art={() => <Crate />} light={() => <Open />} />
      <Walker xs={xs} profession={profession} />
    </>
  ),
  bind: (stage, input) => {
    const walker = walkerOf(stage, input, kick)
    const props = propNodes(stage, input.xs.length)
    return (_progress, reached) => {
      walker(reached)
      props.forEach(({ lit }, i) => fadeTo(lit, litOf(reached, i)))
    }
  },
}
