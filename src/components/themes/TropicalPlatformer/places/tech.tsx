import { ramp } from '@/lib/scroll/stage'
import { bell, fadeTo, fx, lerp, r1, transformTo } from '../../shared/stageNodes'
import { mix } from '@/lib/motion/rigPose'
import { CROUCH, DUCK, REACH, RIDE, blend, ease, flight, still } from '../moves'
import type { PartnerFrame } from '../partner'
import type { SceneDef } from '../place'
import { COLORS as C } from '../palette'
import { Beetle, Cart, Pit, Rails } from '../props'

// Tech Stack: the mine cart, a speed he cannot change and only a jump to answer with. The cart runs down the
// rails with the pair hunched in it; a beetle of the crew rides a cart the other way on the upper rail and
// they duck as it passes overhead; the rail ends in a broken stub over a pit, they jump out over it and land
// in the next cart, which rolls on. The pair end in the second cart, the broken rail behind.

const RAIL_END = 200
const RAIL_ON = 320
const ONE = { from: -20, to: RAIL_END - 50 }
const TWO = { from: RAIL_ON + 60, to: 440 }
// His soles in a cart: on its floor; the partner sits behind him in the same cart.
const IN_CART = 22
// He sits a little behind the cart's middle so his knees stay inside its rim, the partner behind him.
const IN_SEAT = -10
const PARTNER_GAP = 30
// The upper rail, on its hangers, and the oncoming cart on it.
const UPPER = -270
const ONCOMING = { from: 760, to: -420 }

const cartOne = (t: number): number => lerp(ONE.from, ONE.to, ease(ramp(t, 0, 0.64)))
const cartTwo = (t: number): number => lerp(TWO.from, TWO.to, ease(ramp(t, 0.84, 1)))
// How low the pair hunch as the oncoming cart passes over them.
const duck = (t: number): number => ramp(t, 0.34, 0.4) * (1 - ramp(t, 0.56, 0.62))

const HUNCHED = mix(RIDE, DUCK, 0.4)

export const tech: SceneDef = {
  zone: 'mine',
  kit: 'engineer',
  script: [1500, 1500, 1800],
  shift: { wide: -80, phone: -60 },
  ends: [0.33, 0.64, 1],
  back: () => (
    <g>
      <Pit from={RAIL_END} to={RAIL_ON} />
      <Rails from={-300} to={RAIL_END} />
      <path d={`M${RAIL_END - 4} 0 L${RAIL_END + 26} 30`} stroke={C.stoneDark} strokeWidth={6} />
      <Rails from={RAIL_ON} to={900} />
      {/* the upper rail hung from the tunnel frames */}
      {[-260, 60, 380, 700].map((x) => (
        <path key={x} d={`M${x} -900 V${UPPER}`} stroke={C.barkDark} strokeWidth={8} />
      ))}
      <g transform={`translate(0 ${UPPER})`}>
        <Rails from={-500} to={900} />
      </g>
      <g data-fx="oncoming" transform={`translate(${ONCOMING.from} ${UPPER})`}>
        <g transform="translate(0 -46)">
          <Beetle />
        </g>
        <Cart />
      </g>
    </g>
  ),
  // They sit in the carts, so the carts are drawn over their legs.
  front: () => (
    <g>
      <g data-fx="cart-one" transform={`translate(${ONE.from} 0)`}>
        <Cart />
      </g>
      <g data-fx="cart-two" transform={`translate(${TWO.from} 0)`}>
        <Cart />
      </g>
    </g>
  ),
  move: (_kit, t) => {
    if (t < 0.66) return still(blend(HUNCHED, DUCK, duck(t), 0, 1), cartOne(t) + IN_SEAT, IN_CART)
    if (t < 0.84) {
      const [ahead, lift] = flight(ramp(t, 0.66, 0.84), [ONE.to + IN_SEAT, IN_CART], [TWO.from + IN_SEAT, IN_CART], 170)
      return { pose: t < 0.74 ? blend(HUNCHED, REACH, t, 0.66, 0.7) : blend(REACH, CROUCH, t, 0.78, 0.84), ahead, lift }
    }
    return still(blend(CROUCH, HUNCHED, t, 0.84, 0.92), cartTwo(t) + IN_SEAT, IN_CART)
  },
  partner: (t): PartnerFrame => {
    if (t < 0.68) return { ahead: cartOne(t) + IN_SEAT - PARTNER_GAP, lift: IN_CART - 26 * duck(t), air: 0.6 }
    if (t < 0.86) {
      const [ahead, lift] = flight(ramp(t, 0.68, 0.86), [ONE.to + IN_SEAT - PARTNER_GAP, IN_CART], [TWO.from + IN_SEAT - PARTNER_GAP, IN_CART], 150)
      return { ahead, lift, air: 1 }
    }
    return { ahead: cartTwo(t) + IN_SEAT - PARTNER_GAP, lift: IN_CART, air: 0.6, arms: 0.6 * bell(t, 0.9, 1) }
  },
  reply: (stage) => {
    const one = fx(stage, 'cart-one')
    const two = fx(stage, 'cart-two')
    const oncoming = fx(stage, 'oncoming')
    return (t) => {
      // the first cart runs to the broken end, then tips over the edge and drops into the pit
      const tip = ramp(t, 0.66, 0.9)
      transformTo(one, `translate(${r1(cartOne(t) + 90 * tip)} ${r1(300 * tip * tip)}) rotate(${r1(70 * tip)})`)
      fadeTo(one, 1 - ramp(t, 0.84, 0.9))
      transformTo(two, `translate(${r1(cartTwo(t))} 0)`)
      // the beetle's cart comes the other way on the upper rail, over their heads
      const x = lerp(ONCOMING.from, ONCOMING.to, ramp(t, 0.3, 0.64))
      transformTo(oncoming, `translate(${r1(x)} ${UPPER - 3 * Math.abs(Math.sin(t * 90))})`)
    }
  },
}
