import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx } from '../../shared/stageNodes'
import { DECO_COLORS as C } from '../palette'
import { still, stopsChamber } from '../chamber'
import { Arc, Raider, foeOf } from '../foes'
import { drum } from '../pose'

// Bands: theatre row. For each band he plays a roll on the snare at his waist under a dark marquee while a
// raider comes at him; the roll charges the stick, the spark leaps off it into the raider, who goes down,
// and the marquee's bulbs and its neon frame come on.

const MARQUEE = 160
const FOE = 320

const BULBS = Array.from({ length: 9 }, (_, i) => -96 + i * 24)

function Marquee() {
  return (
    <>
      <path d="M-70 0 V-200 M70 0 V-200" stroke={C.brassDark} strokeWidth="8" />
      <path d="M-110 -200 H110 V-340 L80 -380 H-80 L-110 -340 Z" fill={C.theatreBox} stroke={C.brassMid} strokeWidth="4" />
      <rect x={-84} y={-330} width={168} height={100} fill={C.abyss} stroke={C.brassDark} strokeWidth="2" />
      {BULBS.map((x) => (
        <circle key={x} cx={x} cy={-212} r={5} fill={C.brassShadow} />
      ))}
    </>
  )
}

function Lit() {
  return (
    <>
      <circle cx={0} cy={-280} r={170} fill={C.neonPink} opacity="0.14" />
      <rect x={-84} y={-330} width={168} height={100} fill="none" stroke={C.neonPink} strokeWidth="6" />
      {BULBS.map((x) => (
        <circle key={x} cx={x} cy={-212} r={6} fill={C.goldBright} />
      ))}
      <path d="M-56 -296 H56 M-40 -266 H40" stroke={C.goldBrightText} strokeWidth="9" />
    </>
  )
}

export const bands = stopsChamber({
  light: C.neonPink,
  back: (i) => (
    <>
      <g transform={`translate(${MARQUEE} 0)`}>
        <Marquee />
        <g data-fx={`lit-${i}`} opacity="0">
          <Lit />
        </g>
      </g>
      <g transform={`translate(${FOE} 0)`}>
        <Raider name={`raider-${i}`} />
      </g>
      <Arc name={`raider-${i}`} x={FOE} />
    </>
  ),
  // The sticks keep time with the scroll: four beats a card.
  move: (_profession, t) => still(drum(Math.min(1, t * 3), t * 4)),
  reply: (stage, { count }) => {
    const foes = Array.from({ length: count }, (_, i) => foeOf(stage, `raider-${i}`))
    const lits = Array.from({ length: count }, (_, i) => fx(stage, `lit-${i}`))
    return (played) =>
      foes.forEach((foe, i) => {
        const t = played(i)
        foe(t, [0.5, 0.65], [0.62, 0.8])
        fadeTo(lits[i], ramp(t, 0.8, 0.9))
      })
  },
})
