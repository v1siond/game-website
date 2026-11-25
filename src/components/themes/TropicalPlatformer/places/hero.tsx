import { ramp } from '@/lib/scroll/stage'
import { bell, fadeTo, fx, lerp, r1, transformTo } from '../../shared/stageNodes'
import { Carrier, Mango, Treehouse } from '../cast'
import { CROUCH, FISTS, REACH, RIDE, STAMP_UP, STAND, TUCK, blend, ease, flight, still, type Frame } from '../moves'
import type { SceneDef } from '../place'
import { COVER, Dust, hopOf } from './kit'

// The hero: the theft on a stormy night, then the morning. He sleeps sitting on the edge of his treehouse
// porch, dim under the storm, while two of the captain's beetles carry the last crates of the store out of the
// cave under it and off in the rain, a lightning flash showing them, and drop mangoes on the way; the storm
// clears into morning, he wakes, drops from the porch to the empty cave, stamps once and stands there with
// his fists down. He is in view from the first frame, as the world's figure. On a page with no About his
// partner bursts out of the door after him. The treehouse stands right of the hero card on a wide screen.

// His treehouse round his spot: the door on the porch, the cave under it from x 110 to 250 (cast.tsx).
const DOOR = { x: 133, lift: 350 }
const LAND = 100
const PARTNER_LAND = 10
// The two carriers from the cave mouth out past the right edge of the view, and the mangoes they drop.
const CARRIERS = [190, 250] as const
const AWAY = 620
const DROPPED = [300, 370, 450] as const
const RAIN = 26

const STORM = '#0a1430'

// Asleep on the porch's edge: seated, his legs over the edge, his head dropped and his arms slack. Seated, his
// hips are 33 above his soles, so this lift sits him on the porch.
const ASLEEP = { ...RIDE, lean: 22, armRight: 8, foreRight: -24, armLeft: 14, foreLeft: -20 }
const SEATED = DOOR.lift - 33

const move = (t: number): Frame => {
  if (t < 0.38) return still(ASLEEP, DOOR.x, SEATED)
  if (t < 0.47) return still(blend(ASLEEP, CROUCH, t, 0.38, 0.45), DOOR.x, SEATED)
  if (t < 0.62) {
    const [ahead, lift] = flight(ramp(t, 0.47, 0.62), [DOOR.x, SEATED], [LAND, 0], 70)
    return { pose: t < 0.58 ? blend(CROUCH, REACH, t, 0.47, 0.52) : blend(REACH, TUCK, t, 0.58, 0.62), ahead, lift }
  }
  if (t < 0.7) return still(blend(CROUCH, STAND, t, 0.62, 0.7), LAND)
  if (t < 0.8) return still(blend(STAND, STAMP_UP, t, 0.72, 0.8), LAND)
  if (t < 0.86) return still(blend(STAMP_UP, FISTS, t, 0.8, 0.84), LAND)
  return still(FISTS, LAND)
}

export const hero: SceneDef = {
  zone: 'jungle',
  kit: null,
  script: [1800, 1500, 1400],
  ends: [0.36, 0.7, 1],
  shift: { wide: 300, phone: 50 },
  back: () => (
    <g>
      <Treehouse />
      {DROPPED.map((x, i) => (
        <g key={x} data-fx={`dropped-${i}`} opacity="0" transform={`translate(${x} -14) rotate(${i * 50 - 40})`}>
          <Mango size={0.8} />
        </g>
      ))}
      {CARRIERS.map((x, i) => (
        <g key={x} data-fx={`carrier-${i}`} transform={`translate(${x} 0)`}>
          <Carrier />
        </g>
      ))}
      <Dust name="hero-dust" x={LAND + 30} size={90} />
    </g>
  ),
  // The storm's dark and its rain lie over the whole place and over him, the lightning over them.
  front: () => (
    <g>
      <rect data-fx="storm" {...COVER} fill={STORM} opacity="0.72" />
      <g data-fx="rain" opacity="0.8">
        {Array.from({ length: RAIN }, (_, i) => (
          <path key={i} d={`M${(i * 97) % 1300 - 500} ${((i * 211) % 900) - 800} l-18 60`} stroke="#9fb8e8" strokeWidth={3} strokeLinecap="round" />
        ))}
      </g>
      <rect data-fx="lightning" {...COVER} fill="#e8f0ff" opacity="0" />
    </g>
  ),
  move: (_kit, t) => move(t),
  partner: (t, { partnerJoins }) => {
    if (!partnerJoins || t < 0.62) return null
    if (t < 0.66) return { ahead: DOOR.x, lift: DOOR.lift, opacity: ramp(t, 0.62, 0.65) }
    if (t < 0.8) return hopOf(t, 0.66, 0.8, DOOR.x, PARTNER_LAND, 60, DOOR.lift, 0)
    return { ahead: PARTNER_LAND, arms: 0.3 * ease(ramp(t, 0.84, 0.92)) }
  },
  reply: (stage, { partnerJoins }) => {
    const storm = fx(stage, 'storm')
    const rain = fx(stage, 'rain')
    const lightning = fx(stage, 'lightning')
    const door = fx(stage, 'door')
    const dust = fx(stage, 'hero-dust')
    const carriers = CARRIERS.map((_, i) => fx(stage, `carrier-${i}`))
    const dropped = DROPPED.map((_, i) => fx(stage, `dropped-${i}`))
    return (t) => {
      // the storm, its rain falling with the playhead, clears into morning as the second action starts
      const clear = ease(ramp(t, 0.36, 0.5))
      fadeTo(storm, 0.72 * (1 - clear))
      fadeTo(rain, 0.8 * (1 - clear))
      transformTo(rain, `translate(${r1(-((t * 900) % 60) * 0.3)} ${r1((t * 3000) % 180)})`)
      fadeTo(lightning, 0.7 * bell(t, 0.04, 0.1) + 0.5 * bell(t, 0.2, 0.25))
      // the carriers walk off with the crates, each dropping a mango as it passes
      const walked = ease(ramp(t, 0, 0.34))
      carriers.forEach((carrier, i) => {
        const x = lerp(CARRIERS[i], AWAY + 80 * i, walked)
        transformTo(carrier, `translate(${r1(x)} ${r1(-4 * Math.abs(Math.sin(t * 60 + i)))})`)
      })
      dropped.forEach((mango, i) => fadeTo(mango, ramp(lerp(CARRIERS[0], AWAY, walked), DROPPED[i] - 10, DROPPED[i] + 10)))
      // the door bursts open on its hinge as the partner comes out
      const open = partnerJoins ? ease(ramp(t, 0.58, 0.62)) : 0
      transformTo(door, `translate(${r1(100 * open * 1.9)} 0) scale(${(1 - 1.9 * open).toFixed(3)} 1)`)
      // the stamp raises a puff of dust
      fadeTo(dust, bell(t, 0.62, 0.68) * 0.8 + bell(t, 0.8, 0.94))
    }
  },
}
