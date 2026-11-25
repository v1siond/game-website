import { ramp } from '@/lib/scroll/stage'
import { bell, fadeTo, fx, lerp, r1, transformTo } from '../../shared/stageNodes'
import { CutOut, Snapper } from '../crocs'
import { CROUCH, STAND, TUCK, TUCK_MIDDLE, blend, ease, flight, still, type Frame } from '../moves'
import type { SceneDef } from '../place'
import { Barrel } from '../props'
import { COVER, Flash } from './kit'

// Ventures: the haunted castle's boss (research/2026-11-25-deep-dk64 §3: the cardboard likeness of the king
// on the rampart in the constant storm, worked by two soldiers, hit by an ape fired from a barrel cannon as it
// passes). On the rampart in the rain he climbs into the barrel cannon as the king's cardboard likeness rolls
// in on its stand, pushed by two snappers; the cannon fires him through it, he lands beyond, it falls in two,
// the snappers run, and the key lies on the stones. He stands on the rampart in the rain, the broken likeness
// and the key beside him.

const CANNON = { x: 70, y: -70, angle: -12 }
const START = -60
const CUT = { from: 760, to: 300 }
const PUSHERS = [130, 200] as const
const LAND = 470
const KEY = CUT.to + 110
const FIRE = 0.42
const HIT = 0.5
const RAIN = 34

// Where he sits inside the cannon: the middle of his tucked body at its middle.
const IN_CANNON: [number, number] = [CANNON.x - 10, -CANNON.y - TUCK_MIDDLE]

const cutAt = (t: number): number => lerp(CUT.from, CUT.to, ease(ramp(t, 0.04, 0.34)))

const move = (t: number): Frame => {
  if (t < 0.06) return still(blend(STAND, CROUCH, t, 0, 0.06), START)
  if (t < 0.22) {
    const [ahead, lift] = flight(ramp(t, 0.06, 0.22), [START, 0], IN_CANNON, 90)
    return { pose: blend(CROUCH, TUCK, t, 0.06, 0.14), ahead, lift, opacity: 1 - ramp(t, 0.19, 0.22) }
  }
  if (t < FIRE) return { pose: TUCK, ahead: IN_CANNON[0], lift: IN_CANNON[1], opacity: 0 }
  if (t < 0.7) {
    const [ahead, lift] = flight(ramp(t, FIRE, 0.7), IN_CANNON, [LAND, 0], 120)
    return { pose: blend(TUCK, CROUCH, t, 0.62, 0.7), ahead, lift, spin: 540 * ease(ramp(t, FIRE, 0.64)) }
  }
  return still(blend(CROUCH, STAND, t, 0.7, 0.8), LAND)
}

/** A key on the stones, gold, lying on its side. */
const Key = () => (
  <g transform="rotate(-80)">
    <circle cx={0} cy={-30} r={16} fill="none" stroke="url(#tp-gold)" strokeWidth={8} />
    <rect x={-4} y={-16} width={8} height={48} fill="url(#tp-gold)" stroke="#140b0a" strokeWidth={2} />
    <path d="M4 22 H16 M4 30 H13" stroke="#d89a1a" strokeWidth={6} />
  </g>
)

export const ventures: SceneDef = {
  zone: 'castle',
  kit: 'engineer',
  script: [1700, 1300, 1700],
  ends: [0.34, 0.6, 1],
  span: [-110, 560],
  back: () => (
    <g>
      {PUSHERS.map((dx, i) => (
        <g key={dx} data-fx={`pusher-${i}`} transform={`translate(${CUT.from + dx} 0)`}>
          <Snapper />
        </g>
      ))}
      <g data-fx="cut" transform={`translate(${CUT.from} 0)`}>
        <CutOut />
      </g>
      <Flash name="cut-hit" x={CUT.to} y={-200} size={140} />
    </g>
  ),
  // The key where it fell, the cannon in front of him as he climbs in, the rain and the lightning over all.
  front: () => (
    <g>
      <g data-fx="key" opacity="0" transform={`translate(${KEY} -16)`}>
        <Key />
      </g>
      <Flash name="key-glint" x={KEY} y={-30} size={50} />
      <g data-fx="cannon" transform={`translate(${CANNON.x} ${CANNON.y}) rotate(${CANNON.angle})`}>
        <Barrel blast />
        <Flash name="cannon-burst" x={70} y={0} size={70} />
      </g>
      <g data-fx="rain" opacity="0.7">
        {Array.from({ length: RAIN }, (_, i) => (
          <path key={i} d={`M${((i * 113) % 1500) - 700} ${((i * 197) % 900) - 760} l-14 56`} stroke="#b8a8ff" strokeWidth={3} strokeLinecap="round" />
        ))}
      </g>
      <rect data-fx="lightning" {...COVER} fill="#e8e0ff" opacity="0" />
    </g>
  ),
  move: (_kit, t) => move(t),
  reply: (stage) => {
    const cut = fx(stage, 'cut')
    const left = fx(stage, 'cut-left')
    const right = fx(stage, 'cut-right')
    const pushers = PUSHERS.map((_, i) => fx(stage, `pusher-${i}`))
    const cannon = fx(stage, 'cannon')
    const burst = fx(stage, 'cannon-burst')
    const hit = fx(stage, 'cut-hit')
    const key = fx(stage, 'key')
    const glint = fx(stage, 'key-glint')
    const rain = fx(stage, 'rain')
    const lightning = fx(stage, 'lightning')
    return (t) => {
      const x = cutAt(t)
      transformTo(cut, `translate(${r1(x)} 0)`)
      // the board breaks where he went through: the two halves lean apart about their feet and sag
      const fall = ease(ramp(t, HIT, HIT + 0.16))
      transformTo(left, `translate(${r1(-30 * fall)} 0) rotate(${r1(-28 * fall)} -46 -40)`)
      transformTo(right, `translate(${r1(30 * fall)} 0) rotate(${r1(34 * fall)} -46 -40)`)
      // the snappers push it in, then run off the rampart
      const run = ramp(t, HIT + 0.04, 0.9)
      pushers.forEach((pusher, i) => {
        transformTo(pusher, `translate(${r1(x + PUSHERS[i] + 600 * run * run)} ${r1(-6 * Math.abs(Math.sin(t * 50 + i)))}) scale(${run > 0 ? -1 : 1} 1)`)
        fadeTo(pusher, 1 - ramp(run, 0.6, 1))
      })
      // the cannon bucks as he climbs in and fires
      const fired = bell(t, FIRE - 0.02, FIRE + 0.08)
      transformTo(cannon, `translate(${r1(CANNON.x - 10 * fired)} ${r1(CANNON.y + 6 * bell(t, 0.2, 0.26))}) rotate(${CANNON.angle})`)
      fadeTo(burst, fired)
      fadeTo(hit, bell(t, HIT - 0.04, HIT + 0.08))
      fadeTo(key, ramp(t, 0.66, 0.72))
      fadeTo(glint, bell(t, 0.7, 0.86) + 0.6 * bell(t, 0.9, 1.02))
      transformTo(rain, `translate(${r1(-((t * 700) % 56) * 0.25)} ${r1((t * 2800) % 160)})`)
      fadeTo(lightning, 0.55 * bell(t, 0.08, 0.13) + 0.65 * bell(t, HIT - 0.02, HIT + 0.04))
    }
  },
}
