import { ramp } from '@/lib/scroll/stage'
import { bell, fadeTo, fx, lerp, r1, transformTo } from '../../shared/stageNodes'
import { LIFT, RIDE, blend, ease, still, type Frame } from '../moves'
import type { SceneDef } from '../place'
import { COLORS as C } from '../palette'
import { Flash } from './kit'

// Services: the sunken galleon's cove and its boss (research/2026-11-25-deep-dk64 §3: the giant puffer fish in
// a dark pool, beaten by steering a boat through five stars in time, each round raising the poles that shock
// it). In the dark cove, the wreck far off, the puffer, our own, fills the pool. He steers his half barrel boat
// across the water through the first gold star, then the second and the third, and as each lights a pole rises
// out of the water round the puffer; the poles spark, it swells, flashes and goes flat on the water. The puffer
// floats flat, the three stars lit, his boat beyond it.

const FROM = -20
const TO = 470
const STARS = [60, 250, 440] as const
const STAR_LIFT = 74
const PUFFER = { x: 250, y: -150 }
const POLES = [110, 180, 320, 390] as const
const SAIL = { from: 0.04, to: 0.68 }
const SHOCK = { from: 0.7, to: 0.86 }

/** Where the boat is at t: across the water, easing in and out. */
const boatAt = (t: number): number => lerp(FROM, TO, ease(ramp(t, SAIL.from, SAIL.to)))

/** When the boat's middle passes star i. */
const passes = (i: number): number => {
  const u = (STARS[i] - FROM) / (TO - FROM)
  // the inverse of the smooth step over the sail's stretch, near enough by bisection
  let lo = 0
  let hi = 1
  for (let k = 0; k < 20; k++) {
    const mid = (lo + hi) / 2
    if (ease(mid) < u) lo = mid
    else hi = mid
  }
  return lerp(SAIL.from, SAIL.to, lo)
}

const PASSES = STARS.map((_, i) => passes(i))

// Seated in the boat: his soles on its floor, a little under the water line.
const SEAT = 4

const move = (t: number): Frame => {
  if (t < 0.9) return still({ ...RIDE, lean: 8 + 6 * Math.sin(t * 30) }, boatAt(t), SEAT + 4 * Math.sin(t * 24))
  return still(blend(RIDE, LIFT, t, 0.9, 0.98), boatAt(t), SEAT)
}

/** A gold star ring standing on the water, its middle on 0 0. */
const StarRing = () => {
  const points = Array.from({ length: 10 }, (_, k) => {
    const r = k % 2 ? 24 : 48
    const a = (Math.PI * k) / 5 - Math.PI / 2
    return `${r1(r * Math.cos(a))} ${r1(r * Math.sin(a))}`
  }).join(' L')
  return <path d={`M${points} Z`} fill="none" stroke="url(#tp-gold)" strokeWidth={9} strokeLinejoin="round" />
}

/** The giant puffer, our own, its middle on 0 0, 280 across: a round spiked body, a little mouth and fins. */
function Puffer() {
  const spikes = Array.from({ length: 18 }, (_, k) => {
    const a = (Math.PI * 2 * k) / 18
    return <path key={k} d={`M${r1(120 * Math.cos(a - 0.12))} ${r1(120 * Math.sin(a - 0.12))} L${r1(160 * Math.cos(a))} ${r1(160 * Math.sin(a))} L${r1(120 * Math.cos(a + 0.12))} ${r1(120 * Math.sin(a + 0.12))} Z`} fill="#c8a040" stroke={C.shadow} strokeWidth={2} />
  })
  return (
    <g>
      {spikes}
      <circle r={128} fill="#e8c860" stroke={C.shadow} strokeWidth={4} />
      <ellipse cx={20} cy={50} rx={96} ry={60} fill="#fff2c8" />
      {[-60, -20, 30, 70].map((x, i) => (
        <circle key={x} cx={x} cy={-60 + (i % 2) * 30} r={14} fill="#8a6a20" opacity={0.5} />
      ))}
      <circle cx={-64} cy={-20} r={24} fill="#ffffff" stroke={C.shadow} strokeWidth={3} />
      <circle data-fx="puffer-pupil" cx={-72} cy={-18} r={10} fill={C.shadow} />
      <ellipse cx={-118} cy={24} rx={14} ry={10} fill="#d84a3a" stroke={C.shadow} strokeWidth={3} />
      <path d="M100 -10 Q160 -50 170 10 Q150 40 100 20 Z" fill="#d8a840" stroke={C.shadow} strokeWidth={3} />
    </g>
  )
}

/** His boat: half a barrel on the water, a little rudder, its rim at y -40. */
const Boat = () => (
  <g>
    <path d="M-80 -40 Q-84 20 -40 30 L50 30 Q84 20 80 -40 Z" fill="url(#tp-wood)" stroke={C.shadow} strokeWidth={3} strokeLinejoin="round" />
    <path d="M-82 -36 H82 M-76 0 H76" stroke="url(#tp-hoop)" strokeWidth={8} />
    <path d="M-80 -18 L-100 -6 L-96 20 L-78 14" fill="url(#tp-wood)" stroke={C.shadow} strokeWidth={2} />
  </g>
)

export const services: SceneDef = {
  zone: 'cove',
  kit: 'engineer',
  script: [1500, 1700, 1600],
  ends: [0.3, 0.68, 1],
  span: [-100, 560],
  back: () => (
    <g>
      {POLES.map((x, i) => (
        <g key={x} data-fx={`pole-${i}`} transform={`translate(${x} 200)`}>
          <rect x={-9} y={-300} width={18} height={300} fill="url(#tp-iron)" stroke={C.shadow} strokeWidth={2} />
          <circle cx={0} cy={-306} r={14} fill="#bff8ff" stroke={C.shadow} strokeWidth={3} />
        </g>
      ))}
      <g data-fx="puffer" transform={`translate(${PUFFER.x} ${PUFFER.y})`}>
        <Puffer />
      </g>
      <g data-fx="sparks" opacity="0">
        {POLES.map((x) => (
          <path key={x} d={`M${x} -300 L${(x + PUFFER.x) / 2 + 10} ${-260 + (x % 3) * 20} L${(x + PUFFER.x) / 2 - 10} -220 L${PUFFER.x + (x < PUFFER.x ? -60 : 60)} -170`} fill="none" stroke="#bff8ff" strokeWidth={6} strokeLinejoin="round" />
        ))}
      </g>
      <Flash name="zap" x={PUFFER.x} y={PUFFER.y} size={200} />
    </g>
  ),
  // The boat over his legs, the water over the boat's hull and the puffer's underside, the stars over all.
  front: () => (
    <g>
      <g data-fx="boat" transform={`translate(${FROM} 0)`}>
        <Boat />
      </g>
      <rect x={-2400} y={-6} width={4800} height={600} fill="#0c3a6c" opacity={0.72} />
      <path d="M-2400 -6 H2400" stroke="#8fd8ff" strokeWidth={4} opacity={0.6} />
      {STARS.map((x, i) => (
        <g key={x} transform={`translate(${x} ${-STAR_LIFT})`}>
          <g opacity={0.45}>
            <StarRing />
          </g>
          <g data-fx={`star-${i}`} opacity="0">
            <StarRing />
            <Flash name={`star-flash-${i}`} x={0} y={0} size={70} />
          </g>
        </g>
      ))}
    </g>
  ),
  move: (_kit, t) => move(t),
  reply: (stage) => {
    const boat = fx(stage, 'boat')
    const stars = STARS.map((_, i) => fx(stage, `star-${i}`))
    const flashes = STARS.map((_, i) => fx(stage, `star-flash-${i}`))
    const poles = POLES.map((_, i) => fx(stage, `pole-${i}`))
    const puffer = fx(stage, 'puffer')
    const sparks = fx(stage, 'sparks')
    const zap = fx(stage, 'zap')
    return (t) => {
      transformTo(boat, `translate(${r1(boatAt(t))} ${r1(4 * Math.sin(t * 24))}) rotate(${r1(3 * Math.sin(t * 30))})`)
      // each star lights as the boat passes through it, and raises a pole or two out of the water
      PASSES.forEach((at, i) => {
        fadeTo(stars[i], ramp(t, at - 0.01, at + 0.02))
        fadeTo(flashes[i], bell(t, at - 0.02, at + 0.1))
      })
      poles.forEach((pole, i) => {
        const at = PASSES[Math.min(2, i)]
        const up = ease(ramp(t, at, at + 0.08))
        transformTo(pole, `translate(${POLES[i]} ${r1(200 * (1 - up))})`)
      })
      // the shock: it swells and flashes, then lies flat on the water
      const swell = bell(t, SHOCK.from, SHOCK.to)
      const flat = ease(ramp(t, SHOCK.to - 0.04, 0.96))
      transformTo(puffer, `translate(${PUFFER.x} ${r1(PUFFER.y + 130 * flat)}) scale(${(1 + 0.2 * swell + 0.15 * flat).toFixed(3)} ${(1 + 0.2 * swell - 0.68 * flat).toFixed(3)}) rotate(${r1(8 * Math.sin(t * 200) * swell)})`)
      fadeTo(sparks, swell * (0.5 + 0.5 * Math.abs(Math.sin(t * 180))))
      fadeTo(zap, bell(t, SHOCK.from + 0.04, SHOCK.to + 0.02))
    }
  },
}
