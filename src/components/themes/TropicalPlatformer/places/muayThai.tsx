import { hop } from '@/lib/motion/arc'
import { ramp } from '@/lib/scroll/stage'
import { bell, fadeTo, fx, lerp, r1, transformTo } from '../../shared/stageNodes'
import { CROUCH, GUARD, KNEE, STAND, TEEP, blend, ease, flight, still, type Frame } from '../moves'
import type { PartnerFrame } from '../partner'
import type { SceneDef } from '../place'
import { Cannonball, Captain, CaptainHat } from '../cast'
import { COVER, Flash, hopOf } from './kit'

// Muay Thai: the boss on the deck of his ship at sunset, with its false ending and the fighter's own finish.
// Cannonballs roll at the pair from the rigging and they jump them; the captain throws his hat, which flies
// over them, and while he is open a teep knocks him flat; the curtain drops as if it were over, then the
// captain jumps back up, the curtain flies up, and a flying knee puts him down for good. The captain lies
// flat on the deck, his hat beside him.

const CAPTAIN = 300
const HEAD = -236
const START = -55
// Where the partner cheers at the end, behind him and clear of the record cards.
const CHEER = 130
const STEP_IN = 120
const KNEE_TO = 180
// The cannonballs: where each starts, the move's t it sets off at, and how fast it rolls (place units a move).
const BALLS = [
  { from: 700, at: 0.02 },
  { from: 700, at: 0.12 },
] as const
const ROLL = 5000
const BALL_LIFT = 15
// The hat's throw: off his head out over the pair, then back over them and down onto the deck by his feet.
const HAT_OUT = { x: -120, y: -300 }
const HAT_DOWN = { x: 280, y: -10 }

/** The hat at `t`: on his head, out over the pair, back and down on the deck. */
const hatAt = (t: number): string => {
  if (t < 0.32) return `translate(${CAPTAIN} ${HEAD})`
  const out = ramp(t, 0.32, 0.5)
  const back = ramp(t, 0.5, 0.62)
  const [x, y] =
    t < 0.5
      ? [lerp(CAPTAIN, HAT_OUT.x, ease(out)), lerp(HEAD, HAT_OUT.y, out) - 80 * Math.sin(Math.PI * out)]
      : [lerp(HAT_OUT.x, HAT_DOWN.x, back), lerp(HAT_OUT.y, HAT_DOWN.y, back * back) - 120 * Math.sin(Math.PI * back)]
  return `translate(${r1(x)} ${r1(y)}) rotate(${r1(720 * ramp(t, 0.32, 0.62))})`
}

const ballAt = (i: number, t: number): number => BALLS[i].from - ROLL * Math.max(0, t - BALLS[i].at)

/** When ball `i` passes x: the moment to be in the air over it. */
const passes = (i: number, x: number): number => BALLS[i].at + (BALLS[i].from - x) / ROLL

const jumpOver = (t: number, at: number, ahead: number): Frame | null => {
  const a = at - 0.04
  const b = at + 0.04
  if (t < a || t >= b) return null
  return { pose: blend(CROUCH, GUARD, t, a, b), ahead, lift: hop(ramp(t, a, b), 120) }
}

const move = (t: number): Frame => {
  if (t < 0.3) return jumpOver(t, passes(0, 0), 0) ?? jumpOver(t, passes(1, 0), 0) ?? still(blend(STAND, GUARD, t, 0, 0.08))
  if (t < 0.48) return still(GUARD)
  if (t < 0.54) return still(GUARD, STEP_IN * ease(ramp(t, 0.48, 0.54)))
  if (t < 0.62) return still(blend(GUARD, TEEP, t, 0.54, 0.57), STEP_IN)
  if (t < 0.8) return still(blend(TEEP, GUARD, t, 0.62, 0.68), STEP_IN)
  if (t < 0.9) {
    const [ahead, lift] = flight(ramp(t, 0.8, 0.9), [STEP_IN, 0], [KNEE_TO, 0], 120)
    return { pose: blend(GUARD, KNEE, t, 0.8, 0.84), ahead, lift }
  }
  return still(blend(KNEE, GUARD, t, 0.9, 0.96), KNEE_TO)
}

const partner = (t: number): PartnerFrame => {
  for (const i of [0, 1]) {
    const at = passes(i, START)
    if (t >= at - 0.04 && t < at + 0.04) return hopOf(t, at - 0.04, at + 0.04, START, START, 110)
  }
  // once the captain is down for good the partner hops up behind him and cheers
  if (t < 0.9) return { ahead: START }
  if (t < 0.97) return hopOf(t, 0.9, 0.97, START, CHEER, 70)
  return { ahead: CHEER, arms: 0.8 * ramp(t, 0.97, 1) }
}

/** How far the captain has fallen (0 standing, 1 flat on his back): by the teep, up again, by the knee. */
const fallen = (t: number): number => ease(ramp(t, 0.56, 0.62)) * (1 - ease(ramp(t, 0.7, 0.78))) + ease(ramp(t, 0.88, 0.95))

/** Where the captain stands: knocked back by each blow. */
const captainX = (t: number): number => CAPTAIN + 30 * ease(ramp(t, 0.56, 0.62)) * (1 - ramp(t, 0.7, 0.78)) + 40 * ease(ramp(t, 0.88, 0.95))

export const muayThai: SceneDef = {
  zone: 'deck',
  kit: 'fighter',
  script: [1500, 1600, 1900],
  shift: { wide: -120, phone: 0 },
  phoneSize: 0.85,
  ends: [0.3, 0.62, 1],
  back: () => (
    <g>
      <g data-fx="captain" transform={`translate(${CAPTAIN} 0)`}>
        <Captain />
      </g>
      {BALLS.map(({ from }, i) => (
        <g key={i} data-fx={`ball-${i}`} transform={`translate(${from} ${-BALL_LIFT})`}>
          <Cannonball />
        </g>
      ))}
      <g data-fx="hat" transform={`translate(${CAPTAIN} ${HEAD})`}>
        <CaptainHat />
      </g>
      <Flash name="teep-hit" x={CAPTAIN - 60} y={-110} size={70} />
      <Flash name="knee-hit" x={CAPTAIN - 50} y={-170} size={90} />
    </g>
  ),
  // The curtain of the false ending drops over the deck and flies up again.
  front: () => (
    <g data-fx="curtain" transform="translate(0 -900)">
      <rect x={COVER.x} y={-1300} width={COVER.width} height={1060} fill="#8a1c22" />
      {Array.from({ length: 22 }, (_, i) => (
        <path key={i} d={`M${COVER.x + i * 120} -1300 V-240`} stroke="#5a0c12" strokeWidth={10} opacity={0.6} />
      ))}
      <path d={`M${COVER.x} -240 H${COVER.x + COVER.width}`} stroke="#ffc93c" strokeWidth={14} />
    </g>
  ),
  move: (_kit, t) => move(t),
  partner: (t) => partner(t),
  reply: (stage) => {
    const captain = fx(stage, 'captain')
    const balls = BALLS.map((_, i) => fx(stage, `ball-${i}`))
    const hat = fx(stage, 'hat')
    const teep = fx(stage, 'teep-hit')
    const knee = fx(stage, 'knee-hit')
    const curtain = fx(stage, 'curtain')
    return (t) => {
      balls.forEach((ball, i) => {
        const x = ballAt(i, t)
        transformTo(ball, `translate(${r1(x)} ${-BALL_LIFT}) rotate(${r1((((BALLS[i].from - x) / BALL_LIFT) * 180) / Math.PI)})`)
      })
      // he goes over on his back about his feet, gets up, and goes over again
      const over = fallen(t)
      transformTo(captain, `translate(${r1(captainX(t))} ${r1(-60 * over)}) rotate(${r1(80 * over)})`)
      transformTo(hat, hatAt(t))
      fadeTo(teep, bell(t, 0.55, 0.62))
      fadeTo(knee, bell(t, 0.86, 0.94))
      // the curtain drops while he lies there, and flies up as he jumps back up
      const down = ease(ramp(t, 0.62, 0.68)) * (1 - ease(ramp(t, 0.72, 0.76)))
      transformTo(curtain, `translate(0 ${r1(-900 + 760 * down)})`)
    }
  },
}
