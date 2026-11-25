import { ramp } from '@/lib/scroll/stage'
import { bell, fadeTo, fx, lerp, r1, transformTo } from '../../shared/stageNodes'
import { LIFT, STAND, blend, roll, still, type Frame } from '../moves'
import type { PartnerFrame } from '../partner'
import type { SceneDef } from '../place'
import { COLORS as C, TROOP, TROOP_ORDER, type Ape } from '../palette'
import { StandingBarrel } from '../props'
import { FriendFigure, Gong, Guitar, Mallet, Pad, Panpipes, Tuba, armTurn, type FriendApe } from '../troop'
import { COVER } from './kit'

// Bands: the hideout in the fortress's head (research/2026-11-25-deep-dk64 §1: the ten minute clock, five
// generator rooms opened by the music pads, each ape shutting his own generator; §2: each ape's instrument plays
// on his own pad). Under the red alarm and the running clock five generators roar behind five pads. He drums on
// his barrel on the gold pad and the gold generator dies; the lemur's guitar, the orangutan's tuba, the
// tamarin's panpipes and the silverback's gong play in turn on theirs and each generator goes dark; the clock
// stops and the alarm's red goes out. The troop stands at its five pads, the generators dark, the clock still.

// Each ape's pad, along the floor in the troop's order; his drum before him on his.
const PADS: Record<Ape, number> = { him: 0, lemur: 140, orangutan: 250, tamarin: 360, silverback: 460 }
const DRUM = 62
// When each one plays, the stretch of the move, and his generator dies at its end.
const PLAYS: Record<Ape, readonly [number, number]> = {
  him: [0.02, 0.3],
  lemur: [0.34, 0.44],
  orangutan: [0.44, 0.54],
  tamarin: [0.54, 0.64],
  silverback: [0.64, 0.76],
}
const STOP = { from: 0.78, to: 0.9 }
const CLOCK = { x: 230, y: -500 }
const GENERATOR = { y: -150, height: 300 }
const FRIENDS: readonly FriendApe[] = ['orangutan', 'tamarin', 'silverback']
const GONG = PADS.silverback + 96

const move = (t: number): Frame => {
  const [a, b] = PLAYS.him
  if (t < b) return still(blend(STAND, roll(14 * ramp(t, a, b)), t, 0, 0.03))
  if (t < STOP.from) return still(blend(roll(0), STAND, t, b, b + 0.06))
  return still(blend(STAND, LIFT, t, STOP.from, STOP.to))
}

/** How hard the friend's instrument plays at t, 0 to 1. */
const playing = (ape: Ape, t: number): number => bell(t, PLAYS[ape][0], PLAYS[ape][1])

const partner = (t: number): PartnerFrame => ({ ahead: PADS.lemur, arms: 0.35 * playing('lemur', t) + 0.15 + 0.6 * bell(t, STOP.from, 1.1), phase: 0.3 * Math.sin(t * 80) * playing('lemur', t) })

/** A generator: a steel drum standing on its base with a glowing core in its ape's colour (`core-<i>`). */
const Generator = ({ ape, i }: { ape: Ape; i: number }) => (
  <g>
    <rect x={-42} y={-GENERATOR.height} width={84} height={GENERATOR.height} rx={10} fill="url(#tp-iron)" stroke={C.shadow} strokeWidth={3} />
    <rect x={-50} y={-GENERATOR.height - 14} width={100} height={18} rx={4} fill="#2a2e34" stroke={C.shadow} strokeWidth={2} />
    <rect x={-26} y={-GENERATOR.height + 40} width={52} height={GENERATOR.height - 90} rx={6} fill="#14161a" stroke={C.shadow} strokeWidth={2} />
    <g data-fx={`core-${i}`}>
      <rect x={-20} y={-GENERATOR.height + 48} width={40} height={GENERATOR.height - 106} rx={4} fill={TROOP[ape]} />
      <rect x={-10} y={-GENERATOR.height + 56} width={10} height={GENERATOR.height - 122} rx={3} fill="#ffffff" opacity={0.5} />
    </g>
  </g>
)

export const bands: SceneDef = {
  zone: 'helm',
  kit: 'drummer',
  script: [1600, 1900, 1300],
  ends: [0.32, 0.78, 1],
  span: [-70, 640],
  size: 0.9,
  back: () => (
    <g>
      {/* the clock on the back wall, its hand running down */}
      <g transform={`translate(${CLOCK.x} ${CLOCK.y})`}>
        <circle r={80} fill="#14161a" stroke="url(#tp-iron)" strokeWidth={14} />
        {Array.from({ length: 10 }, (_, k) => (
          <rect key={k} x={-3} y={-70} width={6} height={14} fill="#ff5a3a" transform={`rotate(${k * 36})`} />
        ))}
        <path data-fx="clock-hand" d="M0 10 V-62" stroke="#ff5a3a" strokeWidth={8} strokeLinecap="round" />
        <circle r={9} fill="#ff5a3a" />
      </g>
      {TROOP_ORDER.map((ape, i) => (
        <g key={ape} transform={`translate(${PADS[ape] + (ape === 'him' ? 30 : 0)} ${GENERATOR.y})`}>
          <Generator ape={ape} i={i} />
        </g>
      ))}
      {TROOP_ORDER.map((ape) => (
        <g key={ape} transform={`translate(${PADS[ape] + (ape === 'him' ? 30 : 0)} 4)`}>
          <Pad ape={ape} width={ape === 'him' ? 150 : 100} />
        </g>
      ))}
      <g transform={`translate(${GONG} 0) scale(0.8)`}>
        <Gong />
      </g>
      {FRIENDS.map((ape) => (
        <g key={ape} transform={`translate(${PADS[ape] - 20} 0)`}>
          <FriendFigure ape={ape}>
            {ape === 'orangutan' && (
              <g transform="translate(10 -60)">
                <Tuba />
              </g>
            )}
            {ape === 'tamarin' && (
              <g transform="translate(20 -90)">
                <Panpipes />
              </g>
            )}
            {ape === 'silverback' && <Mallet />}
          </FriendFigure>
        </g>
      ))}
    </g>
  ),
  // His barrel drum before him, the lemur's guitar in his paws; the red alarm over the whole hideout until the
  // clock stops.
  front: () => (
    <g>
      <g data-fx="guitar" transform={`translate(${PADS.lemur + 20} -70)`}>
        <Guitar />
      </g>
      <g transform={`translate(${DRUM} 0)`}>
        <StandingBarrel />
      </g>
      <rect data-fx="alarm" {...COVER} fill="#ff2a1a" opacity="0.16" />
    </g>
  ),
  move: (_kit, t) => move(t),
  partner: (t) => partner(t),
  reply: (stage) => {
    const cores = TROOP_ORDER.map((_, i) => fx(stage, `core-${i}`))
    const hand = fx(stage, 'clock-hand')
    const alarm = fx(stage, 'alarm')
    const gong = fx(stage, 'gong-face')
    const guitar = fx(stage, 'guitar')
    const arms = FRIENDS.map((ape) => fx(stage, `${ape}-arm`))
    const bodies = FRIENDS.map((ape) => fx(stage, `${ape}-body`))
    return (t) => {
      // each generator dies as its ape's playing ends, flickering out
      TROOP_ORDER.forEach((ape, i) => {
        const [, end] = PLAYS[ape]
        const out = ramp(t, end - 0.03, end + 0.02)
        fadeTo(cores[i], (1 - out) * (0.85 + 0.15 * Math.sin(t * 90 + i)) + 0.1 * out)
      })
      // the clock's hand runs round until it stops
      transformTo(hand, `rotate(${r1(-360 * 3 * Math.min(t, lerp(STOP.from, STOP.to, 0.5)))})`)
      const calm = ramp(t, STOP.from, STOP.to)
      fadeTo(alarm, (1 - calm) * (0.1 + 0.1 * Math.abs(Math.sin(t * 24))))
      // the friends play in turn: the orangutan pumps his tuba, the tamarin his pipes, the silverback swings at
      // the gong and it shivers
      FRIENDS.forEach((ape, i) => {
        const p = playing(ape, t)
        const swing = ape === 'silverback' ? -70 * p * Math.abs(Math.sin(t * 60)) : -20 * p * Math.sin(t * 70)
        transformTo(arms[i], armTurn(swing + 150 * bell(t, STOP.from + i * 0.02, 1.1)))
        transformTo(bodies[i], `translate(0 ${r1(-6 * p * Math.abs(Math.sin(t * 70)))})`)
      })
      const struck = playing('silverback', t)
      transformTo(gong, `rotate(${r1(4 * struck * Math.sin(t * 120))} 0 -150)`)
      transformTo(guitar, `translate(${PADS.lemur + 20} ${r1(-70 - 4 * playing('lemur', t) * Math.sin(t * 90))})`)
    }
  },
}
