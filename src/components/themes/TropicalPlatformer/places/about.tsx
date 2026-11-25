import { hop } from '@/lib/motion/arc'
import { ramp } from '@/lib/scroll/stage'
import { bell, fadeTo, fx, lerp, r1, transformTo } from '../../shared/stageNodes'
import { CROUCH, KNOCKED, LIFT, STAND, THROW, blend, ease, heldIn, still, type Frame } from '../moves'
import type { PartnerFrame } from '../partner'
import type { SceneDef } from '../place'
import { Barrel, Beetle } from '../props'
import { Flash, hopOf } from './kit'

// About: the partner freed, and the pair the game is built on (one leads, the other follows; when the leader
// is hit the other springs ahead). He lifts the barrel on the path over his head and throws it; it bursts on
// the ground and the lemur tumbles out and jumps onto his back. Then a beetle of the crew walks into him, he
// is knocked back a step, and the partner springs off his back and comes down on the beetle, which goes flat,
// and lands ahead of him to lead.

const BARREL = { x: 100, y: -48 }
const BURST = 300
// The partner rides on his back, a little behind his middle.
const ON_BACK = { gap: 34, lift: 120 }
const BEETLE_FROM = 560
const BEETLE_AT = 110
const KNOCKED_TO = -50
const LEAD = 250

const move = (t: number): Frame => {
  if (t < 0.08) return still(blend(STAND, CROUCH, t, 0, 0.08))
  if (t < 0.2) return still(blend(CROUCH, LIFT, t, 0.08, 0.18))
  if (t < 0.3) return still(blend(LIFT, THROW, t, 0.2, 0.26))
  if (t < 0.6) return still(blend(THROW, STAND, t, 0.3, 0.4))
  if (t < 0.72) {
    const u = ease(ramp(t, 0.6, 0.72))
    return { pose: blend(STAND, KNOCKED, t, 0.6, 0.64), ahead: lerp(0, KNOCKED_TO, u), lift: hop(u, 30) }
  }
  return still(blend(KNOCKED, STAND, t, 0.72, 0.84), KNOCKED_TO)
}

/** The barrel's middle: on the path, over his head in his hands, then thrown to where it bursts. */
const barrelAt = (t: number): [number, number] => {
  if (t < 0.08) return [BARREL.x, BARREL.y]
  const [hx, hy] = heldIn(move(Math.min(t, 0.2)))
  const held: [number, number] = [hx, hy - 40]
  if (t < 0.2) return [lerp(BARREL.x, held[0], ease(ramp(t, 0.08, 0.18))), lerp(BARREL.y, held[1], ease(ramp(t, 0.08, 0.18)))]
  const u = ramp(t, 0.2, 0.3)
  return [lerp(held[0], BURST, u), lerp(held[1], -48, u * u) - hop(u, 80)]
}

const partner = (t: number): PartnerFrame | null => {
  if (t < 0.3) return null
  if (t < 0.36) return { ...hopOf(t, 0.3, 0.36, BURST, BURST - 30, 60), spin: -360 * ramp(t, 0.3, 0.36), opacity: ramp(t, 0.3, 0.31) }
  const back = move(t)
  if (t < 0.46) return hopOf(t, 0.38, 0.46, BURST - 30, back.ahead - ON_BACK.gap, 90, 0, ON_BACK.lift)
  if (t < 0.64) return { ahead: back.ahead - ON_BACK.gap, lift: ON_BACK.lift, air: 0.7, arms: 0.2 }
  // off his back as he is hit, over him and down on the beetle, then ahead to lead
  if (t < 0.78) return hopOf(t, 0.64, 0.78, -ON_BACK.gap, BEETLE_AT, 170, ON_BACK.lift, 40)
  if (t < 0.9) return hopOf(t, 0.8, 0.9, BEETLE_AT, LEAD, 60, 40, 0)
  return { ahead: LEAD, arms: 0.6 * bell(t, 0.9, 1) }
}

export const about: SceneDef = {
  zone: 'jungle',
  kit: null,
  script: [1700, 1700],
  shift: { wide: 60, phone: 0 },
  ends: [0.5, 1],
  back: () => (
    <g>
      <g data-fx="beetle" transform={`translate(${BEETLE_FROM} 0)`}>
        <Beetle />
      </g>
      <Flash name="barrel-burst" x={BURST} y={-48} size={90} />
      <Flash name="stomp" x={BEETLE_AT} y={-30} size={60} />
    </g>
  ),
  // The barrel is in his hands in front of him.
  front: () => (
    <g data-fx="barrel" transform={`translate(${BARREL.x} ${BARREL.y})`}>
      <Barrel mouth={false} />
    </g>
  ),
  move: (_kit, t) => move(t),
  partner: (t) => partner(t),
  reply: (stage) => {
    const barrel = fx(stage, 'barrel')
    const burst = fx(stage, 'barrel-burst')
    const beetle = fx(stage, 'beetle')
    const stomp = fx(stage, 'stomp')
    return (t) => {
      const [x, y] = barrelAt(t)
      transformTo(barrel, `translate(${r1(x)} ${r1(y)}) rotate(${r1(200 * ease(ramp(t, 0.2, 0.3)))})`)
      fadeTo(barrel, 1 - ramp(t, 0.29, 0.31))
      fadeTo(burst, bell(t, 0.28, 0.4))
      // the beetle walks in at him and bumps him, and goes flat under the partner's landing
      const walked = lerp(BEETLE_FROM, BEETLE_AT, ease(ramp(t, 0.5, 0.62)))
      const flat = ease(ramp(t, 0.76, 0.8))
      transformTo(beetle, `translate(${r1(walked)} 0) scale(${(1 + 0.3 * flat).toFixed(3)} ${(1 - 0.65 * flat).toFixed(3)})`)
      fadeTo(stomp, bell(t, 0.75, 0.86))
    }
  },
}
