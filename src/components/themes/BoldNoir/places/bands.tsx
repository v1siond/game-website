import { litOf } from '@/lib/scroll/propRow'
import { fadeTo } from '../../shared/stageNodes'
import { PropRow, propNodes } from '../../shared/propRow'
import { NOIR } from '../palette'
import { Walker, walkerOf, type Place } from '../place'
import { FLOOR } from '../street'
import { drum } from '../pose'

// Bands: the jazz club. A spotlight stands on its stand for each band; as each is read he plays the snare
// under it, and its beam comes on over him with a red star at its foot.

function Spot() {
  return (
    <>
      <path d="M-40 0 L0 -150 L40 0 M0 -150 V-190" stroke={NOIR.ink} strokeWidth="8" />
      <polygon points="-30,-230 34,-214 26,-180 -38,-196" fill={NOIR.smoke} stroke={NOIR.ink} strokeWidth="4" />
      <circle cx={-34} cy={-213} r={14} fill={NOIR.paperDim} />
    </>
  )
}

function Beam() {
  return (
    <>
      <polygon points="-34,-226 -34,-200 -230,0 -100,0" fill={NOIR.paper} opacity="0.2" />
      <ellipse cx={-165} cy={-4} rx={90} ry={12} fill={NOIR.paper} opacity="0.25" />
      <path d="M-165 -40 L-158 -20 L-138 -22 L-154 -8 L-146 12 L-165 0 L-184 12 L-176 -8 L-192 -22 L-172 -20 Z" fill={NOIR.red} />
      <circle cx={-34} cy={-213} r={14} fill={NOIR.paper} />
    </>
  )
}

export const bands: Place = {
  light: NOIR.paper,
  floor: ({ xs, profession }) => (
    <>
      <PropRow xs={xs} floor={FLOOR} art={() => <Spot />} light={() => <Beam />} />
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
