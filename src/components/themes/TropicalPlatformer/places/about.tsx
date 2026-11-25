import { ramp } from '@/lib/scroll/stage'
import { bell, fadeTo, fx, lerp, r1, transformTo } from '../../shared/stageNodes'
import { LIFT, STAND, THROW, blend, flight, heldIn, still, type Frame } from '../moves'
import type { PartnerFrame } from '../partner'
import type { SceneDef } from '../place'
import { COLORS as C, TROOP } from '../palette'
import { ColourMango, Coconut } from '../troop'
import { Flash, hopOf } from './kit'

// About: the jungle, and the first friend freed (research/2026-11-25-deep-dk64 §1: the small quick ape caged
// in the mountain, freed by three switches over the cave mouths). The lemur is behind bars in the middle of
// three cave mouths in the hillside, a switch over each. He hurls a coconut at each switch in turn and each
// lights gold; the bars rise and the lemur springs out and lands beside him. The pair stand side by side, the
// cage open, the three switches lit, the red mangoes the lemur gathers on the path.

const CAVES = [200, 330, 460] as const
const CAGE = CAVES[1]
const SWITCH_Y = -250
// Each throw: the stretch of the move it takes, from his wind up to the coconut striking its switch.
const THROWS = [
  [0.02, 0.16],
  [0.17, 0.31],
  [0.32, 0.46],
] as const
// How far through a throw the coconut leaves his hand.
const RELEASE = 0.4
const BESIDE = 120
const RED_MANGOES = [70, 175, 250] as const

const move = (t: number): Frame => {
  for (const [a, b] of THROWS) {
    if (t >= a && t < b) {
      const u = ramp(t, a, b)
      return still(u < RELEASE ? blend(STAND, LIFT, u, 0, RELEASE) : blend(LIFT, THROW, u, RELEASE, RELEASE + 0.2))
    }
  }
  if (t < 0.8) return still(blend(THROW, STAND, t, 0.46, 0.56))
  return still(blend(STAND, LIFT, t, 0.84, 0.94))
}

/** Where coconut `i` is at `t`: in his hand, then flying to its switch. */
const coconutAt = (i: number, t: number): [number, number] => {
  const [a, b] = THROWS[i]
  const from = heldIn(move(a + (b - a) * RELEASE))
  // y runs down here, so the arc rises by a negative height
  return flight(ramp(t, a + (b - a) * RELEASE, b), from, [CAVES[i], SWITCH_Y], -80)
}

const partner = (t: number): PartnerFrame => {
  if (t < 0.6) return { ahead: CAGE, arms: 0.4 * bell(t, 0.1, 0.5) }
  if (t < 0.8) return hopOf(t, 0.6, 0.8, CAGE, BESIDE, 140)
  return { ahead: BESIDE, arms: 0.8 * bell(t, 0.82, 1.1) }
}

/** A cave mouth in the hillside, 110 wide and 150 high, its sill on 0 0. */
const CaveMouth = ({ x }: { x: number }) => <path d={`M${x - 55} 0 V-90 Q${x - 55} -150 ${x} -150 Q${x + 55} -150 ${x + 55} -90 V0 Z`} fill={C.shadow} stroke="#0a1a0c" strokeWidth={4} />

export const about: SceneDef = {
  zone: 'jungle',
  kit: null,
  script: [2000, 1700],
  ends: [0.5, 1],
  span: [-50, 540],
  back: () => (
    <g>
      {/* the hillside, its three cave mouths, a switch over each */}
      <path d="M110 0 Q100 -300 220 -380 Q330 -440 450 -380 Q560 -310 550 0 Z" fill="url(#tp-croc)" stroke={C.shadow} strokeWidth={4} />
      <path d="M130 -60 Q150 -280 260 -350 M400 -380 Q520 -300 530 -80" fill="none" stroke="#3a6a2a" strokeWidth={10} strokeLinecap="round" opacity={0.6} />
      {CAVES.map((x) => (
        <CaveMouth key={x} x={x} />
      ))}
      {CAVES.map((x, i) => (
        <g key={x} transform={`translate(${x} ${SWITCH_Y})`}>
          <circle r={30} fill="url(#tp-iron)" stroke={C.shadow} strokeWidth={3} />
          <g data-fx={`switch-${i}`} opacity="0">
            <circle r={24} fill="url(#tp-gold)" />
          </g>
          <circle r={11} fill="none" stroke={C.shadow} strokeWidth={4} />
          <Flash name={`hit-${i}`} x={0} y={0} size={60} />
        </g>
      ))}
      {RED_MANGOES.map((x) => (
        <g key={x} transform={`translate(${x} -14)`}>
          <ColourMango ape="lemur" size={0.6} />
        </g>
      ))}
    </g>
  ),
  // The bars in front of the lemur in the cage, rising into the rock; the coconuts in flight.
  front: () => (
    <g>
      <g data-fx="bars">
        {[-36, -12, 12, 36].map((dx) => (
          <rect key={dx} x={CAGE + dx - 5} y={-146} width={10} height={146} fill="url(#tp-iron)" stroke={C.shadow} strokeWidth={2} />
        ))}
        <rect x={CAGE - 52} y={-80} width={104} height={10} fill="url(#tp-iron)" stroke={C.shadow} strokeWidth={2} />
        <rect x={CAGE - 14} y={-90} width={28} height={30} rx={4} fill={TROOP.lemur} stroke={C.shadow} strokeWidth={2} />
      </g>
      {THROWS.map((_, i) => (
        <g key={i} data-fx={`coconut-${i}`} opacity="0">
          <Coconut />
        </g>
      ))}
    </g>
  ),
  move: (_kit, t) => move(t),
  partner: (t) => partner(t),
  reply: (stage) => {
    const coconuts = THROWS.map((_, i) => fx(stage, `coconut-${i}`))
    const switches = THROWS.map((_, i) => fx(stage, `switch-${i}`))
    const hits = THROWS.map((_, i) => fx(stage, `hit-${i}`))
    const bars = fx(stage, 'bars')
    return (t) => {
      THROWS.forEach(([a, b], i) => {
        const [x, y] = coconutAt(i, t)
        transformTo(coconuts[i], `translate(${r1(x)} ${r1(y)}) rotate(${r1(540 * ramp(t, a, b))})`)
        fadeTo(coconuts[i], t >= a + (b - a) * RELEASE && t < b ? 1 : 0)
        fadeTo(switches[i], ramp(t, b - 0.01, b + 0.02))
        fadeTo(hits[i], bell(t, b - 0.02, b + 0.08))
      })
      // the bars rise into the rock once all three are lit
      const up = ramp(t, 0.5, 0.62)
      transformTo(bars, `translate(0 ${r1(lerp(0, -150, up))})`)
      fadeTo(bars, 1 - ramp(t, 0.56, 0.64))
    }
  },
}
