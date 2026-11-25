import { hop } from '@/lib/motion/arc'
import { ramp } from '@/lib/scroll/stage'
import { bell, fadeTo, fx, lerp, r1, transformTo } from '../../shared/stageNodes'
import { MangoCrate } from '../cast'
import { GentleGiant, GiantCage } from '../crocs'
import { CROUCH, KEY, LIFT, RIDE, STAND, blend, ease, flight, still, type Frame } from '../moves'
import type { PartnerFrame } from '../partner'
import type { SceneDef } from '../place'
import { COLORS as C, TROOP_ORDER } from '../palette'
import { FriendFigure, armTurn, heightOf, type FriendApe } from '../troop'
import { Flash } from './kit'

// Contact: the ending (research/2026-11-25-deep-dk64 §1: the last key opens the friendly giant's cage, he jumps
// for joy, and in the longer ending the apes ride him home across the water). At sunset on the sandbar he
// turns the key in the gentle giant's cage and the five padlocks drop one by one; the door swings open and the
// giant wades out and jumps for joy, the troop cheering on the sand. Then they climb onto his back, the store's
// crates with them, and he swims for the isle on the horizon. The troop rides the gentle giant across the
// water home, the golden mangoes back.

const CAGE = 230
const LOCK_AT = 0.06
const LOCK_STEP = 0.05
const OPEN = { from: 0.32, to: 0.4 }
const JOY = { from: 0.4, to: 0.5 }
// The giant: in the cage, then out on the water and swimming for the isle.
const GIANT = { caged: CAGE, out: CAGE + 30, home: CAGE + 80, size: 0.85 }
const SWIM = { from: 0.66, to: 1 }
// Where each rider sits on the giant's back, from the giant's middle, and when each hops on.
const SEATS: Record<'him' | 'lemur' | FriendApe, number> = { him: 50, lemur: -20, orangutan: -80, tamarin: 120, silverback: -150 }
const BOARD: Record<'him' | 'lemur' | FriendApe, readonly [number, number]> = {
  him: [0.52, 0.62],
  lemur: [0.5, 0.58],
  orangutan: [0.54, 0.64],
  tamarin: [0.56, 0.64],
  silverback: [0.58, 0.66],
}
// The giant's back above the water, where the riders' feet go, at his size.
const BACK = 100
// On the sandbar before the cage: him at the lock, the troop waiting behind him.
const LOCK = 70
const SHORE: Record<'lemur' | FriendApe, number> = { lemur: -30, tamarin: -70, orangutan: -130, silverback: -190 }
const FRIENDS: readonly FriendApe[] = ['orangutan', 'tamarin', 'silverback']
// The friends are drawn this share of their size, so the giant under them stays the biggest thing in view.
const RIDER: Record<FriendApe, number> = { orangutan: 0.75, tamarin: 0.85, silverback: 0.68 }
const ISLE = 520
const SEATED = 33
// Riding, his near arm waved high at the isle ahead.
const WAVING = { ...RIDE, armRight: -160, foreRight: -10 }

const giantAt = (t: number): number => {
  const out = ease(ramp(t, OPEN.to, JOY.from))
  return lerp(lerp(GIANT.caged, GIANT.out, out), GIANT.home, ease(ramp(t, SWIM.from, SWIM.to)))
}

/** A rider's [x, lift] at t: on the sand at `from`, hopping on, then riding at his seat. */
const riderAt = (who: keyof typeof SEATS, from: number, t: number): [number, number] => {
  const [a, b] = BOARD[who]
  if (t < a) return [from, 0]
  if (t < b) return flight(ramp(t, a, b), [from, 0], [giantAt(b) + SEATS[who], BACK], 90)
  return [giantAt(t) + SEATS[who], BACK + 4 * Math.sin(t * 20 + SEATS[who])]
}

const move = (t: number): Frame => {
  if (t < 0.08) return still(blend(STAND, KEY, t, 0, 0.06), LOCK)
  if (t < 0.32) return still(KEY, LOCK)
  if (t < 0.5) return still(blend(KEY, LIFT, t, 0.34, 0.42), LOCK)
  // seated on the giant's back his hips are on it, 33 above his soles
  const [ahead, lift] = riderAt('him', LOCK, t)
  const [a, b] = BOARD.him
  const seated = lift - SEATED * ramp(t, b - 0.02, b)
  if (t < b) return { pose: blend(CROUCH, RIDE, t, a, b), ahead, lift: seated }
  return still(t < 0.9 ? RIDE : blend(RIDE, WAVING, t, 0.9, 0.97), ahead, seated)
}

const partner = (t: number): PartnerFrame => {
  const [ahead, lift] = riderAt('lemur', SHORE.lemur, t)
  return { ahead, lift, air: t > BOARD.lemur[0] && t < BOARD.lemur[1] ? 1 : 0, arms: 0.8 * bell(t, JOY.from, JOY.to + 0.06) + 0.6 * bell(t, 0.86, 1.1) }
}

/** His isle on the horizon: a hump of sand and two palms, black against the sunset. */
const Isle = () => (
  <g fill={C.shadow}>
    <path d="M-120 0 Q-60 -40 0 -44 Q70 -40 130 0 Z" />
    <path d="M-20 -40 Q-24 -110 -10 -150 M30 -40 Q40 -96 60 -130" stroke={C.shadow} strokeWidth={6} fill="none" />
    <path d="M-10 -150 q-40 -10 -60 14 M-10 -150 q40 -14 56 10 M60 -130 q-30 -16 -54 4 M60 -130 q34 -8 48 16" stroke={C.shadow} strokeWidth={8} fill="none" strokeLinecap="round" />
  </g>
)

export const contact: SceneDef = {
  zone: 'sea',
  kit: null,
  script: [1900, 2100],
  ends: [0.5, 1],
  span: [-240, 570],
  back: () => (
    <g>
      <g transform={`translate(${ISLE} -240) scale(0.7)`}>
        <Isle />
      </g>
      {/* the sandbar he stands on, the cage at its end */}
      <path d="M-380 6 Q-300 -24 -60 -26 Q240 -30 380 6 Z" fill="#e8b874" stroke={C.shadow} strokeWidth={3} />
      <g data-fx="giant" transform={`translate(${GIANT.caged} 0) scale(${GIANT.size})`}>
        <GentleGiant />
        <g transform="translate(-200 -100) scale(0.6)">
          <MangoCrate />
        </g>
        <g transform="translate(130 -96) scale(0.6)">
          <MangoCrate />
        </g>
      </g>
      <g data-fx="cage" transform={`translate(${CAGE} 0)`}>
        <GiantCage />
      </g>
      <Flash name="unlocked" x={CAGE} y={-140} size={120} />
    </g>
  ),
  // The friends, on the sand and then on the giant's back, in front of him; the water over his underside.
  front: () => (
    <g>
      {FRIENDS.map((ape) => (
        <g key={ape} data-fx={`rider-${ape}`} transform={`translate(${SHORE[ape]} 0) scale(${RIDER[ape]})`}>
          <FriendFigure ape={ape} />
        </g>
      ))}
      <rect data-fx="water" x={-2400} y={-2} width={4800} height={600} fill="#6a2a44" opacity="0" />
    </g>
  ),
  move: (_kit, t) => move(t),
  partner: (t) => partner(t),
  reply: (stage) => {
    const locks = TROOP_ORDER.map((_, i) => fx(stage, `lock-${i}`))
    const door = fx(stage, 'cage-door')
    const cage = fx(stage, 'cage')
    const giant = fx(stage, 'giant')
    const unlocked = fx(stage, 'unlocked')
    const water = fx(stage, 'water')
    const riders = FRIENDS.map((ape) => fx(stage, `rider-${ape}`))
    const arms = FRIENDS.map((ape) => fx(stage, `${ape}-arm`))
    return (t) => {
      // the padlocks drop one by one as he turns the key, and the door swings open on its hinge
      locks.forEach((lock, i) => {
        const fall = ramp(t, LOCK_AT + i * LOCK_STEP, LOCK_AT + i * LOCK_STEP + 0.06)
        transformTo(lock, `translate(${-100 + i * 50} ${r1(-132 + 140 * fall * fall)}) rotate(${r1(90 * fall)})`)
        fadeTo(lock, 1 - ramp(fall, 0.8, 1))
      })
      const open = ease(ramp(t, OPEN.from, OPEN.to))
      transformTo(door, `translate(-150 0) scale(${(1 - 0.85 * open).toFixed(3)} 1) translate(150 0)`)
      fadeTo(unlocked, bell(t, OPEN.from - 0.04, OPEN.to + 0.04))
      fadeTo(cage, 1 - ramp(t, SWIM.from, SWIM.from + 0.12))
      // the giant wades out, jumps for joy, and swims for the isle with the troop on his back
      const x = giantAt(t)
      const joy = hop(ramp(t, JOY.from, JOY.to), 60)
      transformTo(giant, `translate(${r1(x)} ${r1(-joy + 3 * Math.sin(t * 20) * ramp(t, SWIM.from, 1))}) scale(${GIANT.size})`)
      fadeTo(water, 0.6 * ramp(t, SWIM.from - 0.06, SWIM.from + 0.06))
      FRIENDS.forEach((ape, i) => {
        const [rx, lift] = riderAt(ape, SHORE[ape], t)
        const k = RIDER[ape]
        // seated on the giant's back, a rider sinks into it by a quarter of his height
        const sit = heightOf(ape) * k * 0.25 * ramp(t, BOARD[ape][1] - 0.02, BOARD[ape][1])
        transformTo(riders[i], `translate(${r1(rx)} ${r1(-lift + sit)}) scale(${k})`)
        transformTo(arms[i], armTurn(165 * bell(t, JOY.from, JOY.to + 0.08) + 165 * bell(t, 0.84 + i * 0.03, 1.1)))
      })
    }
  },
}
