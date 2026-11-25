import { hop } from '@/lib/motion/arc'
import { ramp } from '@/lib/scroll/stage'
import { bell, fadeTo, fx, lerp, r1, transformTo } from '../../shared/stageNodes'
import { CrocKing } from '../crocs'
import { CROUCH, GUARD, KNEE, STAND, TEEP, blend, ease, flight, still, type Frame } from '../moves'
import type { PartnerFrame } from '../partner'
import type { SceneDef } from '../place'
import { COLORS as C, TROOP, TROOP_ORDER } from '../palette'
import { FriendFigure, Seed, armTurn } from '../troop'
import { Flash } from './kit'

// Muay Thai: the five round boxing final against the crocodile king (research/2026-11-25-deep-dk64 §1: the
// ring under the lights, the king twice the ape's size, five rounds one per ape: the ground pound's shockwave,
// the ring light shot down onto his head, the slip, the last round). A lamp on the corner post lights in each
// ape's colour as his round is won. The king pounds the mat and the shockwave runs at him, and he jumps it;
// the lemur at the ropes shoots the ring light down onto the king's head (rounds one and two). The orangutan
// throws a mango skin onto the mat, the king charges, slips on it, and a teep knocks him back (three and
// four). Round five is the fighter's own: a flying knee, and the king falls flat on the starred mat.

const KING = { x: 260, size: 0.78 }
const LIGHT = { x: KING.x - 16, from: -620 }
const LEMUR = -150
const ORANGUTAN = 500
const POST = -100
// When each round is won: its lamp lights.
const ROUNDS = [0.2, 0.3, 0.52, 0.62, 0.92] as const
// The ground pound: he jumps and lands, and the wave runs out along the mat at him.
const POUND = { up: 0.04, land: 0.1 }
const WAVE = { from: 0.1, to: 0.26 }
const SEED = { from: 0.18, to: 0.22 }
const SKIN = { from: 0.34, to: 0.42, at: 170 }
const CHARGE = { from: 0.42, to: 0.5 }
const STEP_IN = 70
const KNEE_TO = 150

/** Where the wave is along the mat at t. */
const waveAt = (t: number): number => lerp(KING.x - 120, -200, ramp(t, WAVE.from, WAVE.to))
const JUMP_AT = WAVE.from + ((KING.x - 120) / (KING.x + 80)) * (WAVE.to - WAVE.from)

const move = (t: number): Frame => {
  if (t < 0.3) {
    if (t >= JUMP_AT - 0.03 && t < JUMP_AT + 0.03) return { pose: blend(CROUCH, GUARD, t, JUMP_AT - 0.03, JUMP_AT + 0.03), ahead: 0, lift: hop(ramp(t, JUMP_AT - 0.03, JUMP_AT + 0.03), 110) }
    return still(blend(STAND, GUARD, t, 0, 0.06))
  }
  if (t < 0.5) return still(GUARD)
  if (t < 0.54) return still(GUARD, STEP_IN * ease(ramp(t, 0.5, 0.54)))
  if (t < 0.6) return still(blend(GUARD, TEEP, t, 0.54, 0.57), STEP_IN)
  if (t < 0.8) return still(blend(TEEP, GUARD, t, 0.6, 0.66), STEP_IN)
  if (t < 0.9) {
    const [ahead, lift] = flight(ramp(t, 0.8, 0.9), [STEP_IN, 0], [KNEE_TO, 0], 120)
    return { pose: blend(GUARD, KNEE, t, 0.8, 0.84), ahead, lift }
  }
  return still(blend(KNEE, GUARD, t, 0.9, 0.96), KNEE_TO)
}

const partner = (t: number): PartnerFrame => ({ ahead: LEMUR, lift: 0, arms: Math.max(0.6 * bell(t, 0.14, 0.24), 0.9 * bell(t, 0.92, 1.1)) })

/** Where the king is at t: x, how high (his pound's jump), how far over on his back (0 to 1). */
const kingAt = (t: number): { x: number; lift: number; over: number } => {
  const charged = ease(ramp(t, CHARGE.from, CHARGE.to))
  const slipped = ease(ramp(t, 0.5, 0.56)) * (1 - ease(ramp(t, 0.66, 0.74)))
  const knocked = ease(ramp(t, 0.88, 0.96))
  // flat on his back he lies to the right of his feet, so they come back toward the post as he goes over
  const x = KING.x - 90 * charged + 40 * slipped + 30 * knocked
  return { x, lift: hop(ramp(t, POUND.up, POUND.land), 90), over: 0.55 * slipped + knocked }
}

// The top of the king's head in his drawing (crocs.tsx), where the light lands and stays.
const CROWN_TOP = { x: -20, y: -420 }

/** The ring light over the king: hanging, then shot down onto his head, where it sits as he goes over. */
const lightAt = (t: number, king: { x: number; lift: number; over: number }): [number, number] => {
  const turn = (84 * king.over * Math.PI) / 180
  const hx = CROWN_TOP.x * KING.size
  const hy = CROWN_TOP.y * KING.size
  const onHead: [number, number] = [king.x + hx * Math.cos(turn) - hy * Math.sin(turn), -king.lift - 40 * king.over + hx * Math.sin(turn) + hy * Math.cos(turn)]
  const fall = ramp(t, SEED.to, SEED.to + 0.06)
  if (fall < 1) return [lerp(LIGHT.x, onHead[0], fall), lerp(LIGHT.from, onHead[1], fall * fall)]
  return onHead
}

/** The ring light: a steel can with its lamp down. */
const RingLight = () => (
  <g>
    <path d="M-30 -40 H30 L40 0 H-40 Z" fill="url(#tp-iron)" stroke={C.shadow} strokeWidth={3} />
    <ellipse cx={0} cy={0} rx={40} ry={8} fill="#fffbe8" stroke={C.shadow} strokeWidth={2} />
  </g>
)

/** The mango skin on the mat. */
const Skin = () => (
  <g>
    <path d="M-30 0 Q-20 -14 0 -10 Q20 -14 30 0 Q14 -4 0 2 Q-14 -4 -30 0 Z" fill={TROOP.orangutan} stroke={C.shadow} strokeWidth={2} />
    <path d="M-20 -6 Q0 -16 20 -6" fill="none" stroke="#fffbe8" strokeWidth={3} opacity={0.6} />
  </g>
)

export const muayThai: SceneDef = {
  zone: 'ring',
  kit: 'fighter',
  script: [1700, 1700, 1600],
  ends: [0.32, 0.68, 1],
  span: [-190, 560],
  size: 0.86,
  back: () => (
    <g>
      {/* the corner post and its five lamps, one per round */}
      <g transform={`translate(${POST} 0)`}>
        <rect x={-12} y={-300} width={24} height={300} fill="url(#tp-iron)" stroke={C.shadow} strokeWidth={3} />
        {TROOP_ORDER.map((ape, i) => (
          <g key={ape} transform={`translate(0 ${-270 + i * 46})`}>
            <circle r={16} fill="#2a2e3a" stroke={C.shadow} strokeWidth={2} />
            <circle data-fx={`lamp-${i}`} r={13} fill={TROOP[ape]} opacity="0" />
          </g>
        ))}
      </g>
      {/* the orangutan at the far ropes, who throws the skin */}
      <g transform={`translate(${ORANGUTAN} -40) scale(0.8)`}>
        <FriendFigure ape="orangutan" />
      </g>
      <ellipse data-fx="wave" cx={0} cy={0} rx={70} ry={14} fill="none" stroke="#fffbe8" strokeWidth={10} opacity="0" />
      <g data-fx="skin" opacity="0">
        <Skin />
      </g>
      <g data-fx="king" transform={`translate(${KING.x} 0) scale(${KING.size})`}>
        <CrocKing boxer />
      </g>
      <g data-fx="light" transform={`translate(${LIGHT.x} ${LIGHT.from})`}>
        <path d="M0 -40 V-600" stroke="#2a2e3a" strokeWidth={4} data-fx="light-cord" />
        <RingLight />
      </g>
      <Flash name="teep-hit" x={KING.x - 120} y={-150} size={70} />
      <Flash name="knee-hit" x={KING.x - 110} y={-220} size={100} />
    </g>
  ),
  // The ropes on the near side of the ring, low in front, and the lemur's seed in flight.
  front: () => (
    <g>
      <g data-fx="seed" opacity="0">
        <Seed />
      </g>
      {[-40, -80].map((y, i) => (
        <path key={y} d={`M-2400 ${y + 120} H2400`} stroke={['#d8282a', '#ffffff'][i]} strokeWidth={8} opacity={0.5} />
      ))}
    </g>
  ),
  move: (_kit, t) => move(t),
  partner: (t) => partner(t),
  reply: (stage) => {
    const king = fx(stage, 'king')
    const kingArm = fx(stage, 'king-arm')
    const lamps = ROUNDS.map((_, i) => fx(stage, `lamp-${i}`))
    const wave = fx(stage, 'wave')
    const light = fx(stage, 'light')
    const cord = fx(stage, 'light-cord')
    const seed = fx(stage, 'seed')
    const skin = fx(stage, 'skin')
    const throwArm = fx(stage, 'orangutan-arm')
    const teep = fx(stage, 'teep-hit')
    const knee = fx(stage, 'knee-hit')
    return (t) => {
      const at = kingAt(t)
      transformTo(king, `translate(${r1(at.x)} ${r1(-at.lift - 40 * at.over)}) rotate(${r1(84 * at.over)}) scale(${KING.size})`)
      transformTo(kingArm, `rotate(${r1(-40 * bell(t, 0.42, 0.5) + 20 * bell(t, 0.0, 0.1))} -40 -250)`)
      ROUNDS.forEach((round, i) => fadeTo(lamps[i], ramp(t, round, round + 0.03)))
      // the pound's wave runs along the mat at him
      const x = waveAt(t)
      transformTo(wave, `translate(${r1(x)} 0) scale(${(1 + 0.6 * ramp(t, WAVE.from, WAVE.to)).toFixed(3)} 1)`)
      fadeTo(wave, bell(t, WAVE.from, WAVE.to))
      // the seed from the lemur's paws to the light's cord, and the light drops onto the king's head
      const u = ramp(t, SEED.from, SEED.to)
      transformTo(seed, `translate(${r1(lerp(LEMUR + 20, LIGHT.x, u))} ${r1(lerp(-100, -560, u))})`)
      fadeTo(seed, t > SEED.from && t < SEED.to ? 1 : 0)
      const [lx, ly] = lightAt(t, at)
      transformTo(light, `translate(${r1(lx)} ${r1(ly)}) rotate(${r1(30 * at.over)})`)
      fadeTo(cord, 1 - ramp(t, SEED.to - 0.01, SEED.to))
      // the orangutan throws the skin, which lands on the mat in the king's way
      transformTo(throwArm, armTurn(-120 * bell(t, SKIN.from - 0.04, SKIN.from + 0.04)))
      const s = ramp(t, SKIN.from, SKIN.to)
      transformTo(skin, `translate(${r1(lerp(ORANGUTAN - 40, SKIN.at, s))} ${r1(-hop(s, 200) - 120 * (1 - s) * (s < 1 ? 1 : 0))}) rotate(${r1(360 * s)})`)
      fadeTo(skin, ramp(t, SKIN.from, SKIN.from + 0.01))
      fadeTo(teep, bell(t, 0.55, 0.61))
      fadeTo(knee, bell(t, 0.86, 0.94))
    }
  },
}
