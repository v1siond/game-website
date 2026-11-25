import { ramp } from '@/lib/scroll/stage'
import { bell, fadeTo, fx, lerp, r1, transformTo } from '../../shared/stageNodes'
import { CROUCH, STAND, TUCK, TUCK_MIDDLE, blend, ease, flight, still, type Frame } from '../moves'
import type { SceneDef } from '../place'
import { Barrel, Burst, Deck, Pit } from '../props'

// Work: the barrel cannon canyon, where the cannon does the moving and the turn of the second is the timing.
// He hops into the first cannon over the gap, it fires him into the second as it turns to face the far side,
// and that one fires him out onto the far ledge, where he lands in a crouch, his partner shot out after him.
// Both stand on the far ledge, the cannons swinging behind.

const PIT = { from: 60, to: 360 }
const CANNON_A = { x: 130, y: -150, angle: -40 }
const CANNON_B = { x: 290, y: -300 }
// The second cannon turns from its mouth up and back to its mouth down at the far ledge.
const B_FROM = -150
const B_TO = 30
const LAND = 470
const PARTNER_LAND = 395
const START = -70

// Where he or the partner sits inside each cannon (the middle of a tucked body at its middle).
const IN_A: [number, number] = [CANNON_A.x - 10, -CANNON_A.y - TUCK_MIDDLE]
const IN_B: [number, number] = [CANNON_B.x - 10, -CANNON_B.y - TUCK_MIDDLE]

const move = (t: number): Frame => {
  if (t < 0.06) return still(blend(STAND, CROUCH, t, 0, 0.06))
  if (t < 0.26) {
    const [ahead, lift] = flight(ramp(t, 0.06, 0.26), [0, 0], IN_A, 90)
    return { pose: blend(CROUCH, TUCK, t, 0.06, 0.16), ahead, lift, opacity: 1 - ramp(t, 0.22, 0.26) }
  }
  if (t < 0.33) return { pose: TUCK, ahead: IN_A[0], lift: IN_A[1], opacity: 0 }
  if (t < 0.5) {
    const [ahead, lift] = flight(ramp(t, 0.33, 0.5), IN_A, IN_B, 60)
    return { pose: TUCK, ahead, lift, spin: 540 * ramp(t, 0.33, 0.5), opacity: 1 - ramp(t, 0.47, 0.5) }
  }
  if (t < 0.64) return { pose: TUCK, ahead: IN_B[0], lift: IN_B[1], opacity: 0 }
  if (t < 0.88) {
    const [ahead, lift] = flight(ramp(t, 0.64, 0.88), IN_B, [LAND, 0], 120)
    return { pose: blend(TUCK, CROUCH, t, 0.8, 0.88), ahead, lift, spin: 360 * ease(ramp(t, 0.64, 0.82)) }
  }
  return still(blend(CROUCH, STAND, t, 0.88, 1), LAND)
}

/** The partner goes in after him and rides in the cannon with him, then is fired out after him. */
const partner = (t: number) => {
  if (t < 0.12) return { ahead: START }
  if (t < 0.3) {
    const [ahead, lift] = flight(ramp(t, 0.12, 0.3), [START, 0], [IN_A[0], IN_A[1] + 20], 110)
    return { ahead, lift, air: 1, opacity: 1 - ramp(t, 0.27, 0.3) }
  }
  if (t < 0.74) return { ahead: IN_B[0], lift: IN_B[1], opacity: 0 }
  if (t < 0.94) {
    const [ahead, lift] = flight(ramp(t, 0.74, 0.94), [IN_B[0], IN_B[1] + 20], [PARTNER_LAND, 0], 110)
    return { ahead, lift, air: 1, spin: 360 * ease(ramp(t, 0.74, 0.9)) }
  }
  return { ahead: PARTNER_LAND, arms: 0.5 * ramp(t, 0.95, 1) }
}

export const work: SceneDef = {
  zone: 'treetop',
  kit: 'engineer',
  script: [1400, 1400, 1700],
  shift: { wide: -90, phone: -40 },
  ends: [0.3, 0.6, 1],
  back: () => (
    <g>
      <Pit from={PIT.from} to={PIT.to} />
      <Deck width={PIT.from + 30} height={220} />
      <g data-fx="work-a" transform={`translate(${CANNON_A.x} ${CANNON_A.y}) rotate(${CANNON_A.angle})`}>
        <Barrel blast />
        <g data-fx="work-burst-a" opacity="0" transform="translate(70 0)">
          <Burst size={70} />
        </g>
      </g>
      <g data-fx="work-b" transform={`translate(${CANNON_B.x} ${CANNON_B.y}) rotate(${B_FROM})`}>
        <Barrel blast />
        <g data-fx="work-burst-b" opacity="0" transform="translate(70 0)">
          <Burst size={70} />
        </g>
      </g>
    </g>
  ),
  move: (_kit, t) => move(t),
  partner: (t) => partner(t),
  reply: (stage) => {
    const a = fx(stage, 'work-a')
    const b = fx(stage, 'work-b')
    const burstA = fx(stage, 'work-burst-a')
    const burstB = fx(stage, 'work-burst-b')
    return (t) => {
      // each cannon bucks as he goes in and fires with a burst at its mouth; the second turns to aim between,
      // fires him and then the partner, and swings on after
      const inA = bell(t, 0.25, 0.32)
      const fireA = bell(t, 0.32, 0.42)
      transformTo(a, `translate(${CANNON_A.x - 8 * fireA} ${CANNON_A.y + 6 * inA}) rotate(${r1(CANNON_A.angle + 14 * Math.sin(Math.PI * 2 * ramp(t, 0.42, 1)) * (1 - ramp(t, 0.9, 1)))})`)
      fadeTo(burstA, fireA)
      const swing = 20 * Math.sin(Math.PI * 2 * ramp(t, 0.76, 1)) * (1 - ramp(t, 0.95, 1))
      const turn = lerp(B_FROM, B_TO, ease(ramp(t, 0.5, 0.62))) + swing
      const inB = bell(t, 0.49, 0.55)
      const fireB = bell(t, 0.63, 0.73) + bell(t, 0.73, 0.8)
      transformTo(b, `translate(${CANNON_B.x - 8 * fireB} ${CANNON_B.y + 6 * inB}) rotate(${r1(turn)})`)
      fadeTo(burstB, Math.min(1, fireB))
    }
  },
}
