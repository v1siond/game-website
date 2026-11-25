import { ramp } from '@/lib/scroll/stage'
import { bell, fadeTo, fx, lerp, r1, transformTo } from '../../shared/stageNodes'
import { CROUCH, STAND, SWIM, blend, ease, stroke, type Frame } from '../moves'
import type { PartnerFrame } from '../partner'
import type { SceneDef } from '../place'
import { COLORS as C } from '../palette'
import { Flash } from './kit'

// Projects: under the freezing lake, the calm of the water and the fear of the chase. The pair dive through a
// hole in the ice, swim the winding passage with the giant eel close behind, our own, and slip into an alcove
// in the rock; the eel stops short of it and curls up to rest. The pair end in the alcove, the eel asleep in
// the passage.

type Point = readonly [number, number]

// The ice over the lake and the hole in it.
const ICE = -540
const HOLE = { from: 10, to: 130 }
// Their dive down through the hole, then the winding passage to the alcove (each [ahead, lift] of his soles).
const DIVE: readonly Point[] = [
  [70, 820],
  [70, 380],
]
const PASSAGE: readonly Point[] = [
  [70, 380],
  [160, 290],
  [280, 300],
  [380, 360],
  [460, 220],
  [490, 40],
]
const ALCOVE = 490
const PARTNER_ALCOVE = 420
// The eel comes in from the left of the passage after them and stops short of the alcove, where it coils.
const EEL: readonly Point[] = [
  [-620, 330],
  [-300, 300],
  [0, 360],
  [150, 300],
  [260, 320],
]
const COIL = { x: 230, y: -330 }
const SEGMENTS = 16
const SEGMENT_STEP = 0.035

/** A point `u` of the way along a smooth path through `points` (Catmull Rom, each stretch an equal share). */
const pathAt = (points: readonly Point[], u: number): [number, number] => {
  const n = points.length - 1
  const at = Math.max(0, Math.min(1, u)) * n
  const i = Math.min(n - 1, Math.floor(at))
  const s = at - i
  const p = (k: number): Point => points[Math.max(0, Math.min(n, k))]
  const [p0, p1, p2, p3] = [p(i - 1), p(i), p(i + 1), p(i + 2)]
  const c = (a: number, b: number, d: number, e: number): number =>
    0.5 * (2 * b + (-a + d) * s + (2 * a - 5 * b + 4 * d - e) * s * s + (-a + 3 * b - 3 * d + e) * s * s * s)
  return [c(p0[0], p1[0], p2[0], p3[0]), c(p0[1], p1[1], p2[1], p3[1])]
}

/** Which way the path heads at `u`, in degrees on the screen (0 to the right, 90 straight down). */
const headingAt = (points: readonly Point[], u: number): number => {
  const [x0, y0] = pathAt(points, u - 0.01)
  const [x1, y1] = pathAt(points, u + 0.01)
  return (Math.atan2(-(y1 - y0), x1 - x0) * 180) / Math.PI
}

const move = (t: number): Frame => {
  if (t < 0.26) {
    const u = ease(ramp(t, 0.02, 0.26))
    const [ahead, lift] = pathAt(DIVE, u)
    return { pose: SWIM, ahead, lift, spin: lerp(90, headingAt(PASSAGE, 0), ramp(t, 0.18, 0.26)), opacity: ramp(t, 0.02, 0.06) }
  }
  if (t < 0.72) {
    const u = ramp(t, 0.26, 0.72)
    const [ahead, lift] = pathAt(PASSAGE, u)
    return { pose: stroke(8 * u), ahead, lift, spin: headingAt(PASSAGE, u) * (1 - ramp(t, 0.66, 0.72)) }
  }
  const settle = ease(ramp(t, 0.72, 0.84))
  return { pose: t < 0.84 ? blend(SWIM, CROUCH, t, 0.72, 0.84) : blend(CROUCH, STAND, t, 0.84, 1), ahead: ALCOVE, lift: lerp(40, 0, settle) }
}

const partner = (t: number): PartnerFrame => {
  if (t < 0.3) {
    const u = ease(ramp(t, 0.06, 0.3))
    const [ahead, lift] = pathAt(DIVE, u)
    return { ahead, lift: lift + 40, swim: 1, spin: lerp(10, 0, ramp(t, 0.24, 0.3)), opacity: ramp(t, 0.06, 0.1) }
  }
  if (t < 0.74) {
    const u = 0.92 * ramp(t, 0.3, 0.74)
    const [ahead, lift] = pathAt(PASSAGE, u)
    return { ahead, lift: lift + 40, swim: 1, phase: 10 * u, spin: headingAt(PASSAGE, u) }
  }
  const [x, y] = pathAt(PASSAGE, 0.92)
  const settle = ease(ramp(t, 0.74, 0.86))
  return { ahead: lerp(x, PARTNER_ALCOVE, settle), lift: lerp(y + 40, 0, settle), swim: 1 - settle }
}

/** The eel's head along its way `t` of the move: in after them, then stopped short of the alcove. */
const eelAt = (t: number): number => 0.25 + 0.75 * ease(ramp(t, 0.2, 0.74))

/** Where the eel's segment `i` lies: along its way behind the head, or wound into its coil to sleep. */
const segmentAt = (i: number, t: number): [number, number] => {
  const [x, lift] = pathAt(EEL, eelAt(t) - i * SEGMENT_STEP)
  const angle = i * 0.62
  const radius = 26 + i * 5.5
  const coiled: [number, number] = [COIL.x + radius * Math.cos(angle), COIL.y + radius * Math.sin(angle) * 0.7]
  const curl = ease(ramp(t, 0.74, 0.94))
  return [lerp(x, coiled[0], curl), lerp(-lift, coiled[1], curl)]
}

/** The eel's head at `t`: at the front of its body, pointing the way it goes. */
const headAt = (t: number): string => {
  const [hx, hy] = segmentAt(0, t)
  const [nx, ny] = segmentAt(1, t)
  return `translate(${r1(hx)} ${r1(hy)}) rotate(${r1((Math.atan2(hy - ny, hx - nx) * 180) / Math.PI)})`
}

const EEL_SKIN = { back: '#1f5a4a', belly: '#9fd8b8', fin: '#2f8a6a' }

/** The giant eel, our own: a long ribbon of segments, a fin along its back, a big head with a pale eye. */
function Eel() {
  return (
    <g>
      {Array.from({ length: SEGMENTS }, (_, k) => {
        const i = SEGMENTS - 1 - k
        const r = 30 - i * 1.3
        const [x, y] = segmentAt(i + 1, 0)
        return (
          <g key={i} data-fx={`eel-${i}`} transform={`translate(${r1(x)} ${r1(y)})`}>
            <circle r={r} fill={EEL_SKIN.back} stroke={C.shadow} strokeWidth={3} />
            <ellipse cy={r * 0.4} rx={r * 0.8} ry={r * 0.4} fill={EEL_SKIN.belly} opacity={0.7} />
            <path d={`M${-r * 0.6} ${-r} L0 ${-r - 12} L${r * 0.6} ${-r}`} fill={EEL_SKIN.fin} stroke={C.shadow} strokeWidth={2} />
          </g>
        )
      })}
      <g data-fx="eel-head" transform={headAt(0)}>
        <path d="M-20 -30 Q40 -40 70 -6 Q60 18 20 26 Q-20 30 -24 0 Z" fill={EEL_SKIN.back} stroke={C.shadow} strokeWidth={3} strokeLinejoin="round" />
        <path d="M20 8 L66 -2 L24 18 Z" fill="#fff6d8" stroke={C.shadow} strokeWidth={2} />
        <circle cx={34} cy={-14} r={9} fill="#fff6d8" stroke={C.shadow} strokeWidth={2} />
        <circle cx={37} cy={-14} r={4} fill={C.shadow} />
        <path data-fx="eel-lid" d="M24 -14 Q34 -26 44 -14 Z" fill={EEL_SKIN.back} opacity="0" />
      </g>
    </g>
  )
}

const Z_BUBBLES = [0, 1, 2] as const

export const projects: SceneDef = {
  zone: 'lake',
  kit: 'engineer',
  script: [1300, 2000, 1500],
  shift: { wide: -120, phone: -80 },
  ends: [0.26, 0.72, 1],
  back: () => (
    <g>
      {/* the ice overhead, the hole in it, and the day beyond */}
      <rect x={HOLE.from} y={-1300} width={HOLE.to - HOLE.from} height={1300 + ICE - 30} fill="#bfe6ff" />
      <rect x={-1400} y={-1300} width={1400 + HOLE.from} height={1300 + ICE} fill="#d8f0ff" stroke="#7fb8d8" strokeWidth={4} />
      <rect x={HOLE.to} y={-1300} width={1400} height={1300 + ICE} fill="#d8f0ff" stroke="#7fb8d8" strokeWidth={4} />
      <path d={`M-1400 ${ICE} H${HOLE.from} M${HOLE.to} ${ICE} H1300`} stroke="#ffffff" strokeWidth={6} opacity={0.7} />
      <Flash name="splash" x={70} y={ICE} size={90} />
      {/* the rocks of the passage and the alcove in the rock at its end */}
      <path d="M-1400 -420 Q-300 -470 -160 -430 Q40 -380 120 -470 Q240 -500 360 -460 V-540 H-1400 Z" fill={C.waterDeep} stroke={C.shadow} strokeWidth={3} />
      <path d="M-1400 0 V-160 Q-200 -120 40 -170 Q140 -200 200 -150 Q260 -80 340 -130 Q380 -160 390 0 Z" fill={C.waterDeep} stroke={C.shadow} strokeWidth={3} />
      <path d="M380 0 V-280 Q400 -440 560 -440 H1300 V0 H600 Q600 -200 490 -210 Q400 -200 400 0 Z" fill="#0e3a52" stroke={C.shadow} strokeWidth={3} />
      <path d="M408 0 Q406 -196 490 -204 Q594 -196 594 0 Z" fill="#0a2a3a" />
      <g data-fx="eel">
        <Eel />
      </g>
      {Z_BUBBLES.map((i) => (
        <circle key={i} data-fx={`sleep-${i}`} opacity="0" cx={COIL.x + 60 + i * 16} cy={COIL.y - 70 - i * 34} r={6 + i * 3} fill="none" stroke="#e6f8ff" strokeWidth={3} />
      ))}
    </g>
  ),
  move: (_kit, t) => move(t),
  partner: (t) => partner(t),
  reply: (stage) => {
    const segments = Array.from({ length: SEGMENTS }, (_, i) => fx(stage, `eel-${i}`))
    const head = fx(stage, 'eel-head')
    const lid = fx(stage, 'eel-lid')
    const splash = fx(stage, 'splash')
    const bubbles = Z_BUBBLES.map((i) => fx(stage, `sleep-${i}`))
    return (t) => {
      fadeTo(splash, bell(t, 0.08, 0.2) + 0.6 * bell(t, 0.12, 0.24))
      segments.forEach((segment, i) => {
        const [x, y] = segmentAt(i + 1, t)
        transformTo(segment, `translate(${r1(x)} ${r1(y)})`)
      })
      // the head points the way it goes, and once coiled it shuts its eye
      transformTo(head, headAt(t))
      fadeTo(lid, ramp(t, 0.9, 0.96))
      bubbles.forEach((bubble, i) => fadeTo(bubble, ramp(t, 0.9 + i * 0.03, 0.94 + i * 0.03)))
    }
  },
}
