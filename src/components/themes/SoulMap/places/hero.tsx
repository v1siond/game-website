import { fx } from '../../shared/stageNodes'
import { Bonfire, lightFire } from '../fire'
import { START, type Scene } from '../place'
import { FLOOR } from '../ruins'

// The hero: the ruined shrine at dusk (his figure stands in the hero itself, with the outfit plate), and
// in its broken doorway the rest point, a sword standing in a heap of ash and bones with an ember low in
// it. As the page starts to scroll the embers catch and the fire climbs the blade, the first light of the
// way through the ruins.

const FIRE_X = 1240

/** The shrine's broken doorway, the fire standing in it. */
function Shrine() {
  return (
    <g transform={`translate(${FIRE_X} ${FLOOR})`}>
      <path d="M-230 0 V-470 Q0 -650 230 -470 V0 H170 V-430 Q0 -570 -170 -430 V0 Z" fill="var(--soul-rock)" />
      <path d="M-230 -470 Q0 -650 230 -470 L210 -456 Q0 -620 -210 -456 Z" fill="var(--soul-ridge)" opacity={0.5} />
      <Bonfire name="fire" />
    </g>
  )
}

export const hero: Scene = {
  script: [1600],
  floor: () => <Shrine />,
  bind: (stage) => {
    const fire = fx(stage, 'fire')
    return (_progress, _reached, play = START) => lightFire(fire, play.t)
  },
}
