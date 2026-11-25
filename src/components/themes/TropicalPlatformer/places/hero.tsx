import { ramp } from '@/lib/scroll/stage'
import { bell, fadeTo, fx, lerp, r1, transformTo } from '../../shared/stageNodes'
import { Carrier, Mango, Treehouse } from '../cast'
import { Fortress } from '../crocs'
import { CROUCH, FISTS, REACH, RIDE, SLAM, STAND, TUCK, blend, ease, flight, still, type Frame } from '../moves'
import type { SceneDef } from '../place'
import { COVER, Dust } from './kit'

// The hero: the invasion and the theft on his isle (research/2026-11-25-deep-dk64 §1: the crocodile fortress
// moored off the isle, the hoard carried off while the hero sleeps, the slam he learns first). He sleeps
// sitting on the edge of his treehouse porch, dim under the storm, while two snappers carry the last crates of
// golden mangoes out of the cave under it and off to the shore, a lightning flash showing them and the king's
// fortress moored on the sea, its eyes lit red; the storm clears into morning, he wakes, drops from the porch
// to the empty cave and slams the ground, a ring running out from his fists, and stands there with his fists
// down, the fortress across the water. He is in view from the first frame, as the world's figure. The
// treehouse stands right of the hero card on a wide screen, the fortress left of it.

// His treehouse round his spot: the door on the porch, the cave under it from x 110 to 250 (cast.tsx).
const DOOR = { x: 133, lift: 350 }
const LAND = 100
// The two carriers from the cave mouth off to the shore on the left, and the mangoes they drop on the way.
const CARRIERS = [190, 260] as const
const AWAY = -560
const DROPPED = [40, -60, -170] as const
const RAIN = 26
// The fortress on the horizon (the sea line is 260 above the ground), left of the hero card on a wide screen
// and in the free left of a phone's view: [x, y, size].
const FORTRESS = { wide: [-930, -262, 0.6], phone: [-50, -262, 0.42] } as const

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
  // the slam: up on his toes with his fists high, then both fists into the ground
  if (t < 0.78) return still(blend(STAND, REACH, t, 0.72, 0.78), LAND, 30 * ramp(t, 0.72, 0.78))
  if (t < 0.82) return still(blend(REACH, SLAM, t, 0.78, 0.81), LAND, 30 * (1 - ramp(t, 0.78, 0.81)))
  if (t < 0.9) return still(SLAM, LAND)
  return still(blend(SLAM, FISTS, t, 0.9, 0.97), LAND)
}

export const hero: SceneDef = {
  zone: 'isle',
  kit: null,
  script: [1800, 1500, 1400],
  ends: [0.36, 0.7, 1],
  span: [-200, 360],
  spot: { wide: 1120, phone: 630 },
  back: ({ phone }) => {
    const [x, y, size] = FORTRESS[phone ? 'phone' : 'wide']
    return (
      <g>
        <g transform={`translate(${x} ${y}) scale(${size})`}>
          <Fortress />
        </g>
        <Treehouse />
        {DROPPED.map((at, i) => (
          <g key={at} data-fx={`dropped-${i}`} opacity="0" transform={`translate(${at} -14) rotate(${i * 50 - 40})`}>
            <Mango size={0.8} />
          </g>
        ))}
        {CARRIERS.map((at, i) => (
          <g key={at} data-fx={`carrier-${i}`} transform={`translate(${at} 0)`}>
            <Carrier />
          </g>
        ))}
        <ellipse data-fx="slam-ring" cx={LAND + 30} cy={0} rx={60} ry={12} fill="none" stroke="#fff4c2" strokeWidth={8} vectorEffect="non-scaling-stroke" opacity="0" />
        <Dust name="hero-dust" x={LAND + 30} size={90} />
      </g>
    )
  },
  // The storm's dark and its rain lie over the whole place and over him, the lightning over them.
  front: () => (
    <g>
      <rect data-fx="storm" {...COVER} fill={STORM} opacity="0.72" />
      <g data-fx="rain" opacity="0.8">
        {Array.from({ length: RAIN }, (_, i) => (
          <path key={i} d={`M${((i * 97) % 1300) - 700} ${((i * 211) % 900) - 800} l-18 60`} stroke="#9fb8e8" strokeWidth={3} strokeLinecap="round" />
        ))}
      </g>
      <rect data-fx="lightning" {...COVER} fill="#e8f0ff" opacity="0" />
    </g>
  ),
  move: (_kit, t) => move(t),
  reply: (stage) => {
    const storm = fx(stage, 'storm')
    const rain = fx(stage, 'rain')
    const lightning = fx(stage, 'lightning')
    const dust = fx(stage, 'hero-dust')
    const ring = fx(stage, 'slam-ring')
    const smoke = fx(stage, 'fortress-smoke')
    const carriers = CARRIERS.map((_, i) => fx(stage, `carrier-${i}`))
    const dropped = DROPPED.map((_, i) => fx(stage, `dropped-${i}`))
    return (t) => {
      // the storm, its rain falling with the playhead, clears into morning as the second action starts
      const clear = ease(ramp(t, 0.36, 0.5))
      fadeTo(storm, 0.72 * (1 - clear))
      fadeTo(rain, 0.8 * (1 - clear))
      transformTo(rain, `translate(${r1(-((t * 900) % 60) * 0.3)} ${r1((t * 3000) % 180)})`)
      fadeTo(lightning, 0.7 * bell(t, 0.04, 0.1) + 0.5 * bell(t, 0.2, 0.25))
      transformTo(smoke, `translate(${r1(30 * t)} ${r1(-40 * t)})`)
      // the carriers walk off to the shore with the crates, each dropping a mango as it passes
      const walked = ease(ramp(t, 0, 0.34))
      carriers.forEach((carrier, i) => {
        const x = lerp(CARRIERS[i], AWAY - 80 * i, walked)
        transformTo(carrier, `translate(${r1(x)} ${r1(-4 * Math.abs(Math.sin(t * 60 + i)))})`)
        fadeTo(carrier, 1 - ramp(t, 0.32, 0.36))
      })
      dropped.forEach((mango, i) => fadeTo(mango, ramp(-lerp(CARRIERS[0], AWAY, walked), -DROPPED[i] - 10, -DROPPED[i] + 10)))
      // the slam rings out round his fists and raises the dust
      const out = ramp(t, 0.8, 0.95)
      transformTo(ring, `translate(${r1(LAND + 30)} 0) scale(${(1 + 4 * out).toFixed(3)}) translate(${-(LAND + 30)} 0)`)
      fadeTo(ring, bell(t, 0.79, 0.96))
      fadeTo(dust, bell(t, 0.62, 0.68) * 0.8 + bell(t, 0.8, 0.94))
    }
  },
}
