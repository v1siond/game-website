import { litOf } from '@/lib/scroll/propRow'
import { fadeTo } from '../../shared/stageNodes'
import { PropRow, propNodes } from '../../shared/propRow'
import { CEL } from '../palette'
import { Walker, walkerOf, type Place } from '../place'
import { FLOOR, HOURS } from '../desert'
import { deploy } from '../pose'

// Projects at dusk: a loot chest lies in the sand for each project; as each is read he deploys his gear
// at it and the chest opens with a column of its rarity's light standing up out of it (the rarity from
// the project's own facts, loot.ts).

function Chest() {
  return (
    <>
      <rect x={-62} y={-80} width={124} height={80} fill={CEL.steelDark} />
      <path d="M-62 -80 Q0 -126 62 -80 Z" fill={CEL.steel} />
      <rect x={-12} y={-92} width={24} height={26} fill={CEL.sun} />
    </>
  )
}

function Beam({ tone }: { tone: string }) {
  return (
    <>
      <path d="M-40 -90 L-26 -560 L26 -560 L40 -90 Z" fill={tone} opacity="0.55" data-bare />
      <path d="M-62 -80 Q0 -126 62 -80 Z" fill={tone} />
    </>
  )
}

export const projects: Place = {
  hour: HOURS.dusk,
  floor: ({ xs, tones, profession }) => (
    <>
      <PropRow xs={xs} floor={FLOOR} art={() => <Chest />} light={(i) => <Beam tone={tones[i] ?? CEL.common} />} />
      <Walker xs={xs} profession={profession} />
    </>
  ),
  bind: (stage, input) => {
    const walker = walkerOf(stage, input, deploy)
    const props = propNodes(stage, input.xs.length)
    return (_progress, reached) => {
      walker(reached)
      props.forEach(({ lit }, i) => fadeTo(lit, litOf(reached, i)))
    }
  },
}
