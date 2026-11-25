import { ramp } from '@/lib/scroll/stage'
import { bell, fadeTo, fx, r1, transformTo } from '../../shared/stageNodes'
import { CROUCH, REACH, STAND, blend, flight, roll, still, type Frame } from '../moves'
import type { PartnerFrame } from '../partner'
import type { SceneDef } from '../place'
import { FireDrum } from '../cast'
import { COLORS as C } from '../palette'
import { Beetle, Deck, Pit, StandingBarrel } from '../props'
import { hopOf } from './kit'

// Bands: the factory of burning oil drums whose flames die in a pattern, crossed in the moment they go out;
// here the rhythm is the puzzle and he drums it before he crosses it. Sticks in hand he drums the pattern on
// a drum lid and the three flames over the pit go out one by one in time with him, a beetle bouncing in the
// pit below; then he hops drum to drum across on the beat, the partner after him. Both stand on the far
// gantry, the drums flaring again behind.

const LID = 80
const PIT = { from: 130, to: 420 }
const DRUMS = [190, 280, 365] as const
const GANTRY = 470
const PARTNER_GANTRY = 410
const START = -70
// The beat of his roll each flame goes out on, and the stretch of the move he drums over.
const OUT_AT = [0.17, 0.29, 0.41] as const
const ROLL = { from: 0.04, to: 0.46 }
// His hops on the beat: off the ground to each drum head and on to the gantry, each [from, to, start, end].
const HOPS: ReadonlyArray<readonly [number, number, number, number]> = [
  [0, DRUMS[0], 0.52, 0.6],
  [DRUMS[0], DRUMS[1], 0.62, 0.7],
  [DRUMS[1], DRUMS[2], 0.72, 0.8],
  [DRUMS[2], GANTRY, 0.82, 0.9],
]
const LAG = 0.06

const standingAt = (t: number, hops: typeof HOPS): number => hops.reduce((at, [, to, , b]) => (b <= t ? to : at), hops[0][0])

const move = (t: number): Frame => {
  if (t < ROLL.from) return still(blend(STAND, roll(0), t, 0, ROLL.from))
  if (t < ROLL.to) return still(roll(12 * ramp(t, ROLL.from, ROLL.to)))
  for (const [from, to, a, b] of HOPS) {
    if (t >= a && t < b) {
      const [ahead, lift] = flight(ramp(t, a, b), [from, 0], [to, 0], 110)
      return { pose: blend(CROUCH, REACH, t, a, a + 0.02), ahead, lift }
    }
  }
  return still(t < 0.52 ? blend(roll(0), CROUCH, t, 0.46, 0.52) : blend(CROUCH, STAND, t, 0.9, 0.97), standingAt(t, HOPS))
}

// The partner takes the same hops a beat behind, from his own place, to his own place on the gantry.
const PARTNER_HOPS = HOPS.map(([from, to, a, b], i) => [i === 0 ? START : from, i === HOPS.length - 1 ? PARTNER_GANTRY : to, a + LAG, b + LAG] as const)

const partner = (t: number): PartnerFrame => {
  for (const [from, to, a, b] of PARTNER_HOPS) {
    if (t >= a && t < b) return hopOf(t, a, b, from, to, 100)
  }
  return { ahead: standingAt(t, PARTNER_HOPS), arms: 0.6 * bell(t, 0.94, 1.06) }
}

/** How much of flame `i` burns: out on its beat, back once both have crossed. */
const flameAt = (i: number, t: number): number => 1 - ramp(t, OUT_AT[i], OUT_AT[i] + 0.04) + ramp(t, 0.92 + i * 0.025, 0.95 + i * 0.025)

export const bands: SceneDef = {
  zone: 'factory',
  kit: 'drummer',
  script: [1900, 1800],
  shift: { wide: -90, phone: -40 },
  ends: [0.5, 1],
  back: () => (
    <g>
      <Pit from={PIT.from} to={PIT.to} />
      <g data-fx="pit-beetle" transform="translate(240 120)">
        <Beetle />
      </g>
      {DRUMS.map((x, i) => (
        <g key={x} transform={`translate(${x} 0)`}>
          <FireDrum i={i} />
        </g>
      ))}
      <g transform={`translate(${LID} 0)`}>
        <StandingBarrel />
      </g>
      <g transform={`translate(${PIT.to} 0)`}>
        <Deck width={160} height={120} />
        <path d="M0 -6 V-110 M160 -6 V-110 M0 -100 H160" stroke={C.stoneDark} strokeWidth={6} fill="none" />
      </g>
    </g>
  ),
  move: (_kit, t) => move(t),
  partner: (t) => partner(t),
  reply: (stage) => {
    const flames = DRUMS.map((_, i) => fx(stage, `flame-${i}`))
    const beetle = fx(stage, 'pit-beetle')
    return (t) => {
      flames.forEach((flame, i) => {
        const burn = flameAt(i, t)
        const flicker = 1 + 0.08 * Math.sin(t * 120 + i * 2)
        transformTo(flame, `translate(0 ${r1(-4 * (1 - burn))}) scale(${(burn * flicker).toFixed(3)} ${Math.max(0.01, burn * flicker).toFixed(3)})`)
        fadeTo(flame, burn)
      })
      transformTo(beetle, `translate(240 ${r1(120 - 50 * Math.abs(Math.sin(t * 22)))})`)
    }
  },
}
