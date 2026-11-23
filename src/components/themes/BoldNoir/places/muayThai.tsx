import { battlePlace } from '../battle'
import { NOIR } from '../palette'
import { FLOOR } from '../street'

// Muay Thai: a fight in the back alley ring, its ropes across the battle frame. A thug per achievement:
// struck at its weak point with the jab and the knee, down, the extra turn taken; the last falls to the
// gang's finisher and he holds the victory with his glove raised (battle.tsx).

const ROPES = [FLOOR - 120, FLOOR - 200, FLOOR - 280]

const Ring = (
  <>
    {ROPES.map((y) => (
      <path key={y} d={`M-200 ${y} H1800`} stroke={NOIR.paper} strokeWidth="6" opacity="0.5" />
    ))}
    <rect x={120} y={FLOOR - 320} width={26} height={320} fill={NOIR.ink} />
    <rect x={1460} y={FLOOR - 320} width={26} height={320} fill={NOIR.ink} />
  </>
)

export const muayThai = battlePlace(NOIR.red, Ring)
