import { litOf } from '@/lib/scroll/propRow'
import { fadeTo } from '../../shared/stageNodes'
import { PropRow, propNodes } from '../../shared/propRow'
import { CEL } from '../palette'
import { Walker, walkerOf, type Place } from '../place'
import { FLOOR, HOURS } from '../desert'
import { point } from '../pose'
import { Burst } from '../ink'

// About at noon: a signpost stands in the sand for each line of the record; as each is read he points it
// out and a sun starburst sticker slaps onto its board.

function Signpost() {
  return (
    <>
      <rect x={-8} y={-200} width={16} height={200} fill={CEL.plank} />
      <path d="M-70 -250 L60 -250 L80 -215 L60 -180 L-70 -180 Z" fill={CEL.notice} />
      <path d="M-50 -228 H40 M-50 -205 H20" stroke={CEL.ink} strokeWidth="5" />
    </>
  )
}

export const about: Place = {
  hour: HOURS.noon,
  floor: ({ xs, profession }) => (
    <>
      <PropRow xs={xs} floor={FLOOR} art={() => <Signpost />} light={() => <Burst x={50} y={-245} r={34} fill={CEL.sun} />} />
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
