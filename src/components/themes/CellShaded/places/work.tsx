import { litOf } from '@/lib/scroll/propRow'
import { fadeTo } from '../../shared/stageNodes'
import { PropRow, propNodes } from '../../shared/propRow'
import { CEL } from '../palette'
import { Walker, walkerOf, type Place } from '../place'
import { FLOOR, HOURS } from '../desert'
import { pound } from '../pose'

// Work in the town's afternoon: a bounty notice stands pinned to its board for each job; as each is read
// he brings both fists down on the board and the notice takes the red done stamp.

function Notice() {
  return (
    <>
      <path d="M-50 0 V-160 M50 0 V-160" stroke={CEL.plankShade} strokeWidth="12" />
      <rect x={-72} y={-290} width={144} height={140} fill={CEL.plank} />
      <rect x={-50} y={-276} width={100} height={112} fill={CEL.notice} />
      <circle cx={0} cy={-276} r={8} fill={CEL.red} />
      <path d="M-34 -250 H34 M-34 -230 H20 M-34 -210 H28" stroke={CEL.ink} strokeWidth="5" />
    </>
  )
}

function Done() {
  return (
    <>
      <rect x={-40} y={-232} width={80} height={52} fill="none" stroke={CEL.flavour} strokeWidth="6" transform="rotate(-10 0 -206)" data-bare />
      <path d="M-22 -208 L-6 -192 L24 -224" fill="none" stroke={CEL.flavour} strokeWidth="9" strokeLinecap="round" data-bare />
    </>
  )
}

export const work: Place = {
  hour: HOURS.town,
  floor: ({ xs, profession }) => (
    <>
      <PropRow xs={xs} floor={FLOOR} art={() => <Notice />} light={() => <Done />} />
      <Walker xs={xs} profession={profession} />
    </>
  ),
  bind: (stage, input) => {
    const walker = walkerOf(stage, input, pound)
    const props = propNodes(stage, input.xs.length)
    return (_progress, reached) => {
      walker(reached)
      props.forEach(({ lit }, i) => fadeTo(lit, litOf(reached, i)))
    }
  },
}
