import { hop } from '@/lib/motion/arc'
import { ramp } from '@/lib/scroll/stage'
import { bell, fadeTo, fx, lerp, r1, transformTo } from '../../shared/stageNodes'
import { Snapper } from '../crocs'
import { LIFT, REACH, SLAM, STAND, blend, roll, still, type Frame } from '../moves'
import type { PartnerFrame } from '../partner'
import type { SceneDef } from '../place'
import { COLORS as C, TROOP, TROOP_ORDER, type Ape } from '../palette'
import { FriendFigure, HandDrum, Pad, Seed, armTurn, type FriendApe } from '../troop'
import { Flash } from './kit'

// Work: the desert temple of five doors, each shut to all but one ape, a snapper's hourglass running on top
// (research/2026-11-25-deep-dk64 §4: the Five Doored Temple and its timer; §2: some doors open only to one
// ape's instrument or weapon). He plays his hand drum on his gold pad and the gold door grinds up; the lemur
// shoots the red sign with his seed pistols and the red door goes up; then he slams the floor, the last three
// doors burst open and the orangutan, the tamarin and the silverback step out of them, and the snapper drops
// his hourglass. The troop of five stands before the open temple.

// The five doors along the temple's face, one per ape in the troop's order, their tops 220 up.
const DOOR_X = [140, 225, 310, 395, 480] as const
const DOOR = { width: 74, height: 220 }
const SIGN_Y = -258
const FACE = { from: 92, to: 528, top: -330 }
const DRUM = 60
const LEMUR = -80
// How far each door has risen at t: his on his drum, the lemur's on the seed, the three on his slam.
const OPENS: readonly (readonly [number, number])[] = [
  [0.22, 0.32],
  [0.52, 0.6],
  [0.8, 0.86],
  [0.81, 0.87],
  [0.82, 0.88],
]
const SEED = { from: 0.42, to: 0.5 }
const FRIENDS: readonly FriendApe[] = ['orangutan', 'tamarin', 'silverback']
// The doorways the slabs rise out of sight in; one temple per page.
const DOORWAYS = 'tp-temple-doorways'
// The silverback is the tallest; each friend stands in his doorway at this share of his size.
const IN_DOOR: Record<FriendApe, number> = { orangutan: 0.92, tamarin: 1, silverback: 0.86 }

const move = (t: number): Frame => {
  if (t < 0.34) return still(blend(STAND, roll(10 * ramp(t, 0.02, 0.32)), t, 0, 0.04))
  if (t < 0.72) return still(blend(roll(0), STAND, t, 0.34, 0.42))
  if (t < 0.78) return still(blend(STAND, REACH, t, 0.72, 0.78), 0, hop(ramp(t, 0.72, 0.8), 40))
  if (t < 0.8) return still(blend(REACH, SLAM, t, 0.78, 0.8), 0, hop(ramp(t, 0.72, 0.8), 40))
  if (t < 0.9) return still(SLAM)
  return still(blend(SLAM, LIFT, t, 0.9, 0.98))
}

const partner = (t: number): PartnerFrame => ({ ahead: LEMUR, arms: Math.max(0.55 * bell(t, 0.38, 0.52), 0.8 * bell(t, 0.9, 1.1)) })

/** The seed from the lemur's raised paws to the red sign. */
const seedAt = (t: number): [number, number] => {
  const u = ramp(t, SEED.from, SEED.to)
  return [lerp(LEMUR + 20, DOOR_X[1], u), lerp(-110, SIGN_Y, u) - hop(u, 60)]
}

/** A door's stone slab in its doorway, its sill on 0 0. */
const Slab = () => (
  <g>
    <rect x={-DOOR.width / 2} y={-DOOR.height} width={DOOR.width} height={DOOR.height} fill="url(#tp-stone)" stroke={C.shadow} strokeWidth={3} />
    <path d={`M${-DOOR.width / 2 + 10} ${-DOOR.height + 40} H${DOOR.width / 2 - 10} M${-DOOR.width / 2 + 10} -60 H${DOOR.width / 2 - 10}`} stroke="#6a2e14" strokeWidth={4} />
  </g>
)

/** The sign over a door: a round plaque in the ape's colour with a ring cut in it. */
const Sign = ({ ape }: { ape: Ape }) => (
  <g>
    <circle r={26} fill={TROOP[ape]} stroke={C.shadow} strokeWidth={3} />
    <circle r={12} fill="none" stroke={C.shadow} strokeWidth={4} opacity={0.6} />
  </g>
)

export const work: SceneDef = {
  zone: 'desert',
  kit: null,
  script: [1800, 1500, 1600],
  ends: [0.34, 0.66, 1],
  span: [-100, 575],
  back: () => (
    <g>
      {/* the temple's face, stepped at the top, the dark doorways and the friends waiting inside them */}
      <path d={`M${FACE.from} 0 V${FACE.top + 50} H${FACE.from + 30} V${FACE.top} H${FACE.to - 30} V${FACE.top + 50} H${FACE.to} V0 Z`} fill="url(#tp-stone)" stroke={C.shadow} strokeWidth={4} />
      <path d={`M${FACE.from} -270 H${FACE.to} M${FACE.from} -40 H${FACE.to}`} stroke="#6a2e14" strokeWidth={5} />
      {DOOR_X.map((x) => (
        <rect key={x} x={x - DOOR.width / 2} y={-DOOR.height} width={DOOR.width} height={DOOR.height} fill={C.shadow} />
      ))}
      {FRIENDS.map((ape, i) => (
        <g key={ape} data-fx={`friend-${ape}`} transform={`translate(${DOOR_X[i + 2] - 6} 0) scale(${IN_DOOR[ape]})`}>
          <FriendFigure ape={ape} />
        </g>
      ))}
      <defs>
        <clipPath id={DOORWAYS}>
          {DOOR_X.map((x) => (
            <rect key={x} x={x - DOOR.width / 2 - 4} y={-DOOR.height - 2} width={DOOR.width + 8} height={DOOR.height + 4} />
          ))}
        </clipPath>
      </defs>
      <g clipPath={`url(#${DOORWAYS})`}>
        {DOOR_X.map((x, i) => (
          <g key={x} data-fx={`door-${i}`} transform={`translate(${x} 0)`}>
            <Slab />
          </g>
        ))}
      </g>
      {/* the face over the doors, which the slabs rise behind */}
      <path d={`M${FACE.from} ${-DOOR.height} V${FACE.top + 50} H${FACE.from + 30} V${FACE.top} H${FACE.to - 30} V${FACE.top + 50} H${FACE.to} V${-DOOR.height} Z`} fill="url(#tp-stone)" stroke={C.shadow} strokeWidth={4} />
      <path d={`M${FACE.from} -270 H${FACE.to}`} stroke="#6a2e14" strokeWidth={5} />
      {TROOP_ORDER.map((ape, i) => (
        <g key={ape} transform={`translate(${DOOR_X[i]} ${SIGN_Y})`}>
          <Sign ape={ape} />
          <Flash name={`sign-${i}`} x={0} y={0} size={56} />
        </g>
      ))}
      {/* the snapper keeping time on the top step with his hourglass */}
      <g data-fx="timer" transform={`translate(${DOOR_X[2] + 40} ${FACE.top})`}>
        <Snapper />
      </g>
      <g data-fx="hourglass" transform={`translate(${DOOR_X[2] - 20} ${FACE.top - 80})`}>
        <path d="M-18 -30 H18 L2 0 L18 30 H-18 L-2 0 Z" fill="#fff0c8" stroke={C.shadow} strokeWidth={3} strokeLinejoin="round" />
        <path d="M-12 24 H12 L0 8 Z" fill="#e0a040" />
        <path d="M-22 -32 H22 M-22 32 H22" stroke="url(#tp-wood)" strokeWidth={6} />
      </g>
      <g transform={`translate(${DRUM - 30} 4)`}>
        <Pad ape="him" width={150} />
      </g>
      <g transform={`translate(${LEMUR} 4)`}>
        <Pad ape="lemur" width={90} />
      </g>
      <ellipse data-fx="slam-ring" cx={30} cy={0} rx={60} ry={12} fill="none" stroke="#fff4c2" strokeWidth={8} vectorEffect="non-scaling-stroke" opacity="0" />
    </g>
  ),
  // His hand drum before him, and the lemur's seed in flight.
  front: () => (
    <g>
      <g data-fx="drum" transform={`translate(${DRUM} 0)`}>
        <HandDrum />
      </g>
      <g data-fx="seed" opacity="0">
        <Seed />
      </g>
    </g>
  ),
  move: (_kit, t) => move(t),
  partner: (t) => partner(t),
  reply: (stage) => {
    const doors = DOOR_X.map((_, i) => fx(stage, `door-${i}`))
    const signs = DOOR_X.map((_, i) => fx(stage, `sign-${i}`))
    const seed = fx(stage, 'seed')
    const drum = fx(stage, 'drum')
    const ring = fx(stage, 'slam-ring')
    const timer = fx(stage, 'timer')
    const glass = fx(stage, 'hourglass')
    const friends = FRIENDS.map((ape) => fx(stage, `${ape}-arm`))
    return (t) => {
      OPENS.forEach(([a, b], i) => {
        const up = ramp(t, a, b)
        transformTo(doors[i], `translate(${DOOR_X[i]} ${r1(-(DOOR.height + 4) * up)})`)
        fadeTo(signs[i], bell(t, a - 0.04, b))
      })
      const [x, y] = seedAt(t)
      transformTo(seed, `translate(${r1(x)} ${r1(y)})`)
      fadeTo(seed, t > SEED.from && t < SEED.to ? 1 : 0)
      // the drum is set down out of his way before the slam
      fadeTo(drum, 1 - ramp(t, 0.66, 0.72))
      const out = ramp(t, 0.8, 0.94)
      transformTo(ring, `translate(30 0) scale(${(1 + 5 * out).toFixed(3)} ${(1 + 3 * out).toFixed(3)}) translate(-30 0)`)
      fadeTo(ring, bell(t, 0.79, 0.95))
      // the friends wave their long arms as their doors open
      friends.forEach((arm, i) => transformTo(arm, armTurn(165 * bell(t, 0.86 + i * 0.02, 1.1))))
      // the hourglass falls from the top step and the snapper ducks away
      const fall = ramp(t, 0.82, 0.92)
      transformTo(glass, `translate(${r1(DOOR_X[2] - 20 - 60 * fall)} ${r1(FACE.top - 80 + 330 * fall * fall)}) rotate(${r1(-200 * fall)})`)
      fadeTo(glass, 1 - ramp(t, 0.9, 0.93))
      transformTo(timer, `translate(${r1(DOOR_X[2] + 40 + 70 * ramp(t, 0.84, 0.94))} ${FACE.top})`)
      fadeTo(timer, 1 - ramp(t, 0.88, 0.95))
    }
  },
}
