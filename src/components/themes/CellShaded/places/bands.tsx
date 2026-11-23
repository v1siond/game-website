import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, transformTo } from '../../shared/stageNodes'
import { Bandit, flung } from '../bandit'
import { HOURS } from '../desert'
import { Burst } from '../ink'
import { CEL } from '../palette'
import { still, stopsPlace } from '../place'
import { drum } from '../pose'

// Bands at dusk: for each band a speaker stack comes to him on the run, a bandit walking up beyond it. He
// plays the drum, the stack blasts a magenta starburst, the sound goes out in rings and the bandit is
// thrown off his feet and lands flat on his back.

const STACK = 190
const BANDIT = 400

function Stack() {
  return (
    <g transform={`translate(${STACK} 0)`}>
      <rect x={-56} y={-220} width={112} height={220} fill={CEL.inkSoft} />
      <circle cx={0} cy={-160} r={34} fill={CEL.steelDark} />
      <circle cx={0} cy={-60} r={40} fill={CEL.steelDark} />
      <circle cx={0} cy={-160} r={12} fill={CEL.ink} />
      <circle cx={0} cy={-60} r={14} fill={CEL.ink} />
    </g>
  )
}

const RINGS = [70, 130, 190]

export const bands = stopsPlace({
  hour: HOURS.dusk,
  back: (i) => (
    <>
      <Stack />
      <g data-fx={`blast-${i}`} opacity="0">
        <Burst x={STACK} y={-250} r={80} fill={CEL.magenta} />
        {RINGS.map((r) => (
          <path key={r} d={`M${STACK + 60 + r} -220 Q${STACK + 100 + r} -120 ${STACK + 60 + r} -20`} fill="none" stroke={CEL.magenta} strokeWidth="8" data-bare />
        ))}
      </g>
      <g data-fx={`thrown-${i}`} transform={`translate(${BANDIT} 0)`}>
        <Bandit name={`bandit-${i}`} />
      </g>
    </>
  ),
  // The sticks keep time with the scroll: four beats a card.
  move: (_profession, t, at) => still(drum(Math.min(1, t * 3), (at + t) * 4)),
  reply: (stage, { count }) => {
    const blasts = Array.from({ length: count }, (_, i) => fx(stage, `blast-${i}`))
    const thrown = Array.from({ length: count }, (_, i) => fx(stage, `bandit-${i}`))
    return (played) =>
      blasts.forEach((blast, i) => {
        const t = played(i)
        fadeTo(blast, ramp(t, 0.45, 0.55))
        transformTo(thrown[i], flung(ramp(t, 0.5, 0.85), 200, 160))
      })
  },
})
