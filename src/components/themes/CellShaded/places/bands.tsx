import { litOf } from '@/lib/scroll/propRow'
import { fadeTo } from '../../shared/stageNodes'
import { PropRow, propNodes } from '../../shared/propRow'
import { Burst } from '../ink'
import { CEL } from '../palette'
import { Walker, walkerOf, type Place } from '../place'
import { FLOOR, HOURS } from '../desert'
import { drum } from '../pose'

// Bands at dusk: a speaker stack stands in the sand for each band; as each is read he plays the drum and
// the stack blasts a magenta starburst over its cones.

function Stack() {
  return (
    <>
      <rect x={-56} y={-220} width={112} height={220} fill={CEL.inkSoft} />
      <circle cx={0} cy={-160} r={34} fill={CEL.steelDark} />
      <circle cx={0} cy={-60} r={40} fill={CEL.steelDark} />
      <circle cx={0} cy={-160} r={12} fill={CEL.ink} />
      <circle cx={0} cy={-60} r={14} fill={CEL.ink} />
    </>
  )
}

export const bands: Place = {
  hour: HOURS.dusk,
  floor: ({ xs, profession }) => (
    <>
      <PropRow xs={xs} floor={FLOOR} art={() => <Stack />} light={() => <Burst x={0} y={-250} r={80} fill={CEL.magenta} />} />
      <Walker xs={xs} profession={profession} />
    </>
  ),
  bind: (stage, input) => {
    // The sticks keep time with the scroll: four beats a card.
    const walker = walkerOf(stage, input, (_profession, t, at) => drum(t, (at + t) * 4))
    const props = propNodes(stage, input.xs.length)
    return (_progress, reached) => {
      walker(reached)
      props.forEach(({ lit }, i) => fadeTo(lit, litOf(reached, i)))
    }
  },
}
