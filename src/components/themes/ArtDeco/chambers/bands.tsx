import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx } from '../../shared/stageNodes'
import { DECO_COLORS as C } from '../palette'
import { elapsedOf, type SceneScript } from '@/lib/scroll/player'
import { fightChamber, share, still } from '../chamber'
import { Arc, Raider, foeOf } from '../foes'
import { drum } from '../pose'

// Bands: theatre row. He plays a roll on the snare at his waist under a dark marquee, a raider before him,
// and the roll charges the sticks; then the spark leaps off them into the raider, who goes down, and the
// marquee's bulbs and its neon frame come on.

const BANDS_SCRIPT: SceneScript = [1800, 1400]
// One stroke of the roll, in ms.
const BEAT_MS = 110

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

export const bands = fightChamber({
  light: C.neonPink,
  script: BANDS_SCRIPT,
  back: () => (
    <>
      <g transform={`translate(${MARQUEE} 0)`}>
        <Marquee />
        <g data-fx="lit" opacity="0">
          <Lit />
        </g>
      </g>
      <g transform={`translate(${FOE} 0)`}>
        <Raider name="raider" />
      </g>
      <Arc name="raider" x={FOE} />
    </>
  ),
  bind: (stage) => {
    const foe = foeOf(stage, 'raider')
    const lit = fx(stage, 'lit')
    return (play) => {
      const rolled = share(play, 0)
      const sparked = share(play, 1)
      foe(sparked, [0.1, 0.4], [0.35, 0.7])
      fadeTo(lit, ramp(sparked, 0.7, 0.9))
      // the sticks keep one tempo on the clock, whatever the easing; the roll swells, then dies away
      const beats = elapsedOf(BANDS_SCRIPT, play) / BEAT_MS
      return still(drum(ramp(rolled, 0, 0.3) * (1 - ramp(sparked, 0.4, 1)), beats))
    }
  },
})
