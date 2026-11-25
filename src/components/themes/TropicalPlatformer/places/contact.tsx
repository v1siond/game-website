import { ramp } from '@/lib/scroll/stage'
import { bell, fadeTo, fx, lerp, r1, transformTo } from '../../shared/stageNodes'
import { mix } from '@/lib/motion/rigPose'
import { CROUCH, HUG, LIFT, REACH, STAND, blend, ease, flight, still, stride, type Frame } from '../moves'
import type { PartnerFrame } from '../partner'
import type { SceneDef } from '../place'
import { Elder, Mango, SaveBarrel, SaveHut, Store, Treehouse } from '../cast'
import { Flash, hopOf } from './kit'

// Contact: home, and the run saved. At sunset a giant mango falls from the sky and he catches it in both
// arms, lifts it over his head and tosses it back onto the store, and the cave under the treehouse behind
// him is full again; his old relative waves from the porch. He walks to the save barrel by the friend's hut,
// climbs in and the lid shuts on him with a click; the partner hops up onto the lid. The save barrel stands
// by the hut, the full store behind.

// The treehouse stands behind him to the left, its cave from x -90 to 50.
const HOUSE = -200
const STORE_CRATES = 3
const CATCH = 60
const BARREL = 300
const HUT = 470
const MANGO_FROM = -900
const HELD = { x: CATCH + 40, y: -150 }
const OVERHEAD = { x: CATCH, y: -300 }
const IN_STORE = { x: -30, y: -70 }
const WALK_TO = 225
// Climbing in: up over the rim, then down inside it out of sight.
const RIM = 150
const PARTNER_START = -50
const ON_LID = { x: BARREL, lift: 150 }

const move = (t: number): Frame => {
  if (t < 0.24) return still(blend(STAND, REACH, t, 0.1, 0.22), CATCH)
  if (t < 0.36) return still(mix(blend(REACH, HUG, t, 0.24, 0.29), CROUCH, 0.4 * bell(t, 0.26, 0.36)), CATCH)
  if (t < 0.5) return still(t < 0.44 ? blend(HUG, LIFT, t, 0.36, 0.42) : blend(LIFT, STAND, t, 0.44, 0.5), CATCH)
  if (t < 0.52) return still(STAND, CATCH)
  if (t < 0.72) return still(stride(6 * ramp(t, 0.52, 0.72)), lerp(CATCH, WALK_TO, ramp(t, 0.52, 0.72)))
  if (t < 0.82) {
    const [ahead, lift] = flight(ramp(t, 0.72, 0.82), [WALK_TO, 0], [BARREL, RIM], 60)
    return { pose: blend(CROUCH, REACH, t, 0.72, 0.76), ahead, lift }
  }
  if (t < 0.89) return { pose: blend(REACH, CROUCH, t, 0.82, 0.86), ahead: BARREL, lift: lerp(RIM, -70, ease(ramp(t, 0.82, 0.89))) }
  return { pose: CROUCH, ahead: BARREL, lift: -70, opacity: 0 }
}

/** The giant mango: falls into his arms, is lifted over his head and tossed back onto the store. */
const mangoAt = (t: number): [number, number] => {
  if (t < 0.26) return [HELD.x, lerp(MANGO_FROM, HELD.y, ease(ramp(t, 0.06, 0.26)) ** 2)]
  if (t < 0.36) return [HELD.x, HELD.y + 24 * bell(t, 0.26, 0.36)]
  if (t < 0.43) return [lerp(HELD.x, OVERHEAD.x, ease(ramp(t, 0.36, 0.42))), lerp(HELD.y, OVERHEAD.y, ease(ramp(t, 0.36, 0.42)))]
  const toss = ramp(t, 0.43, 0.5)
  return [lerp(OVERHEAD.x, IN_STORE.x, toss), lerp(OVERHEAD.y, IN_STORE.y, toss * toss) - 60 * Math.sin(Math.PI * toss)]
}

const partner = (t: number): PartnerFrame => {
  if (t < 0.56) return { ahead: PARTNER_START, arms: 0.8 * bell(t, 0.28, 0.46) }
  if (t < 0.8) return { ahead: lerp(PARTNER_START, WALK_TO - 50, ramp(t, 0.56, 0.8)), phase: 10 * ramp(t, 0.56, 0.8) }
  if (t < 0.9) return { ahead: WALK_TO - 50 }
  if (t < 0.97) return hopOf(t, 0.9, 0.97, WALK_TO - 50, ON_LID.x, 80, 0, ON_LID.lift)
  return { ahead: ON_LID.x, lift: ON_LID.lift, arms: 0.7 * ramp(t, 0.97, 1) }
}

export const contact: SceneDef = {
  zone: 'sunset',
  kit: null,
  script: [1700, 1700],
  shift: { wide: -90, phone: 0 },
  phoneSize: 0.85,
  ends: [0.5, 1],
  back: () => (
    <g>
      <g transform={`translate(${HOUSE} 0)`}>
        <Treehouse>
          <Store count={STORE_CRATES} />
        </Treehouse>
        <g transform="translate(150 -350)">
          <Elder />
        </g>
      </g>
      <g transform={`translate(${HUT} 0) scale(0.8)`}>
        <SaveHut />
      </g>
      <Flash name="catch" x={HELD.x} y={HELD.y} size={80} />
      <Flash name="stored" x={IN_STORE.x} y={IN_STORE.y} size={90} />
    </g>
  ),
  // The mango is in his arms in front of him; the barrel is drawn over him as he climbs down into it.
  front: () => (
    <g>
      <g data-fx="giant-mango" transform={`translate(${HELD.x} ${MANGO_FROM})`}>
        <Mango size={2.6} />
      </g>
      <g data-fx="save" transform={`translate(${BARREL} 0)`}>
        <SaveBarrel />
      </g>
      <Flash name="click" x={BARREL} y={-150} size={60} />
    </g>
  ),
  move: (_kit, t) => move(t),
  partner: (t) => partner(t),
  reply: (stage) => {
    const mango = fx(stage, 'giant-mango')
    const caught = fx(stage, 'catch')
    const stored = fx(stage, 'stored')
    const crates = Array.from({ length: STORE_CRATES }, (_, i) => fx(stage, `store-${i}`))
    const arm = fx(stage, 'elder-arm')
    const lid = fx(stage, 'save-lid')
    const click = fx(stage, 'click')
    return (t) => {
      const [x, y] = mangoAt(t)
      transformTo(mango, `translate(${r1(x)} ${r1(y)}) rotate(${r1(-30 + 30 * ramp(t, 0.06, 0.26) - 200 * ramp(t, 0.43, 0.5))})`)
      fadeTo(mango, 1 - ramp(t, 0.48, 0.5))
      fadeTo(caught, bell(t, 0.24, 0.34))
      fadeTo(stored, bell(t, 0.47, 0.56))
      // the store fills crate by crate as the mango lands on it
      crates.forEach((crate, i) => fadeTo(crate, ramp(t, 0.46 + i * 0.015, 0.48 + i * 0.015)))
      transformTo(arm, `rotate(${r1(-40 * Math.abs(Math.sin(Math.PI * 6 * ramp(t, 0.36, 0.7))))} 10 -50)`)
      // the lid lifts off as he climbs, and shuts on him with a click
      const open = ramp(t, 0.72, 0.78) * (1 - ramp(t, 0.88, 0.91))
      transformTo(lid, `translate(${r1(-50 * open)} ${r1(-30 * open)}) rotate(${r1(-70 * open)} -48 -140)`)
      fadeTo(click, bell(t, 0.9, 0.97))
    }
  },
}
