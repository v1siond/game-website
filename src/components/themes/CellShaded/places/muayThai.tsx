import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, transformTo, translateTo } from '../../shared/stageNodes'
import { Bandit, flung } from '../bandit'
import { HOURS } from '../desert'
import { Burst } from '../ink'
import { CEL } from '../palette'
import { still, stopsPlace } from '../place'
import { comeback, kick } from '../pose'

// Muay Thai at dusk: for each achievement a bandit comes at him on the run. He kicks it out of his guard
// and it is flung back onto the sand. On the last card the bandit lands its blow first: he goes down on
// one knee with the edges of the frame in red, then comes back with a rising uppercut from the knee that
// throws the bandit high, and he stands in a big sun starburst.

const BANDIT = 210
// The last bandit lunges this far in to land its blow.
const LUNGE = 70

export const muayThai = stopsPlace({
  hour: HOURS.dusk,
  back: (i, { count }) => (
    <>
      {i === count - 1 && (
        <g data-fx="rally" opacity="0">
          <Burst x={0} y={-160} r={260} fill={CEL.sun} />
          <Burst x={0} y={-160} r={150} fill={CEL.orange} />
        </g>
      )}
      <g data-fx={`at-${i}`} transform={`translate(${BANDIT} 0)`}>
        <Bandit name={`bandit-${i}`} />
      </g>
    </>
  ),
  front: (i, { count }) => (i === count - 1 ? <rect data-fx="hurt" x={-1400} y={-1100} width={2800} height={1300} fill="none" stroke={CEL.crit} strokeWidth="160" opacity="0" data-bare /> : null),
  move: (profession, t, at, count) => still(at === count - 1 ? comeback(profession, t) : kick(profession, t)),
  reply: (stage, { count }) => {
    const spots = Array.from({ length: count }, (_, i) => fx(stage, `at-${i}`))
    const bandits = Array.from({ length: count }, (_, i) => fx(stage, `bandit-${i}`))
    const rally = fx(stage, 'rally')
    const hurt = fx(stage, 'hurt')
    const last = count - 1
    return (played) =>
      bandits.forEach((bandit, i) => {
        const t = played(i)
        if (i < last) {
          transformTo(bandit, flung(ramp(t, 0.55, 0.85), 260, 140))
          return
        }
        translateTo(spots[i], BANDIT - LUNGE * (ramp(t, 0, 0.15) - ramp(t, 0.15, 0.3)), 0)
        fadeTo(hurt, 0.55 * ramp(t, 0.12, 0.2) * (1 - ramp(t, 0.45, 0.6)))
        transformTo(bandit, flung(ramp(t, 0.5, 0.85), 300, 320))
        fadeTo(rally, ramp(t, 0.6, 0.7))
      })
  },
})
