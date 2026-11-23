import { litOf } from '@/lib/scroll/propRow'
import { fadeTo } from '../../shared/stageNodes'
import { PropRow, propNodes } from '../../shared/propRow'
import { CEL } from '../palette'
import { Walker, walkerOf, type Place } from '../place'
import { FLOOR, HOURS } from '../desert'
import { hack } from '../pose'

// Tech in the town's afternoon: a relay pylon stands for each group of tools; as each is read he works it
// from his wrist computer and its beacon lights in the hologram blue, its rings going out over the sand.

function Pylon() {
  return (
    <>
      <path d="M-40 0 L-8 -260 L8 -260 L40 0 Z" fill={CEL.steelDark} />
      <path d="M-30 -60 L30 -60 M-22 -130 L22 -130 M-14 -200 L14 -200" stroke={CEL.ink} strokeWidth="5" />
      <rect x={-18} y={-290} width={36} height={30} fill={CEL.steel} />
    </>
  )
}

function Beacon() {
  return (
    <>
      <rect x={-18} y={-290} width={36} height={30} fill={CEL.holo} />
      <ellipse cx={0} cy={-275} rx={60} ry={20} fill="none" stroke={CEL.holo} strokeWidth="5" data-bare />
      <ellipse cx={0} cy={-275} rx={100} ry={34} fill="none" stroke={CEL.holo} strokeWidth="4" opacity="0.6" data-bare />
    </>
  )
}

export const tech: Place = {
  hour: HOURS.town,
  floor: ({ xs, profession }) => (
    <>
      <PropRow xs={xs} floor={FLOOR} art={() => <Pylon />} light={() => <Beacon />} />
      <Walker xs={xs} profession={profession} />
    </>
  ),
  bind: (stage, input) => {
    const walker = walkerOf(stage, input, hack)
    const props = propNodes(stage, input.xs.length)
    return (_progress, reached) => {
      walker(reached)
      props.forEach(({ lit }, i) => fadeTo(lit, litOf(reached, i)))
    }
  },
}
