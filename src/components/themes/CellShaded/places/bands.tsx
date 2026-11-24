import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, transformTo } from '../../shared/stageNodes'
import { Bandit, flung } from '../bandit'
import { HOURS } from '../desert'
import { Burst } from '../ink'
import { CEL } from '../palette'
import { still, stopsPlace } from '../place'
import { drum } from '../pose'

// Bands at dusk: a speaker stack before him, a raider walking up beyond it. First he plays the snare in
// front of him and the stack blasts a magenta starburst; then the sound goes out in rings and the raider is
// thrown off his feet and lands flat on his back.

const STACK = 210
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

// The snare on its stand before him, under his sticks' tips.
function Snare() {
  return (
    <g transform="translate(48 0)">
      <path d="M0 0 L0 -96 M-30 0 L0 -60 L30 0" stroke={CEL.steelDark} strokeWidth="6" />
      <rect x={-46} y={-130} width={92} height={36} fill={CEL.red} />
      <ellipse cx={0} cy={-130} rx={46} ry={10} fill={CEL.paper} />
    </g>
  )
}

export const bands = stopsPlace({
  hour: HOURS.dusk,
  script: [1800, 1800],
  ends: [0.5, 1],
  back: () => (
    <>
      <Stack />
      <g data-fx="blast" opacity="0">
        <Burst x={STACK} y={-250} r={80} fill={CEL.magenta} />
        {RINGS.map((r) => (
          <path key={r} d={`M${STACK + 60 + r} -220 Q${STACK + 100 + r} -120 ${STACK + 60 + r} -20`} fill="none" stroke={CEL.magenta} strokeWidth="8" data-bare />
        ))}
      </g>
      <g transform={`translate(${BANDIT} 0)`}>
        <Bandit name="bandit" />
      </g>
    </>
  ),
  front: () => <Snare />,
  // The sticks keep a steady eight beats over the scene.
  move: (_profession, t) => still(drum(Math.min(1, t * 3), t * 8)),
  reply: (stage) => {
    const blast = fx(stage, 'blast')
    const bandit = fx(stage, 'bandit')
    return (t) => {
      fadeTo(blast, ramp(t, 0.4, 0.5))
      transformTo(bandit, flung(ramp(t, 0.55, 0.9), 200, 160))
    }
  },
})
