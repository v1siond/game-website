import { ramp } from '@/lib/scroll/stage'
import { bell, fadeTo, lerp, r1, transformTo } from '../../shared/stageNodes'
import { sideOn, YAW } from '../motion'
import { READY } from '../sidePose'
import { INK } from './cast'
import { Guardian, guardOf, Hero, heroOf, part, placeTo, Puffs, puffsTo, type SetPiece } from './kit'

// Bands, the fourth room's sky (research notes, the plane levels: a biplane brings the blimps down one by one, enemy planes
// coming at it from the front [24] [31] [1]): an old country of patchwork fields under a sky of clouds, our
// own era with no markings. 1 take off: he climbs into the biplane on the strip and lifts off. 2 fire: he
// shoots the blimps down one by one on a drum fill, the bursts coming closer and closer together. 3 loop: he
// loops through the smoke as the last one falls. The end frame: the empty sky, his plane levelling out.

const STRIP = { x: 70, y: 384 }
const CRUISE = { x: 200, y: 214 }
const LOOP = { x: 330, y: 170, r: 78 }
const BLIMPS = [
  { x: 470, y: 96, s: 0.8 },
  { x: 560, y: 220, s: 0.95 },
  { x: 440, y: 300, s: 0.7 },
] as const
// The fill: a burst per stroke, closer and closer together, the last stroke of each blimp bringing it down.
const STROKES = [1.08, 1.22, 1.34, 1.44, 1.53, 1.61, 1.68, 1.74, 1.8] as const
const DOWN = [STROKES[2], STROKES[5], STROKES[8]] as const
const BURST = 0.06

/** The plane's centre and pitch at `u`: the roll down the strip and the climb, the cruise, the loop. */
function planeAt(u: number): { x: number; y: number; pitch: number } {
  if (u < 1) {
    const roll = ramp(u, 0.1, 0.45)
    const climb = ramp(u, 0.4, 1)
    return { x: lerp(STRIP.x, CRUISE.x, Math.max(roll * 0.4, climb)), y: lerp(STRIP.y, CRUISE.y, climb ** 1.3), pitch: -18 * bell(climb, 0, 1) }
  }
  if (u < 2.05) return { x: CRUISE.x, y: CRUISE.y + 6 * Math.sin(u * 7), pitch: 0 }
  const across = ramp(u, 2.05, 2.25)
  if (across < 1) return { x: lerp(CRUISE.x, LOOP.x, across), y: lerp(CRUISE.y, LOOP.y + LOOP.r, across), pitch: 0 }
  const turn = ramp(u, 2.25, 2.85) * 2 * Math.PI
  if (turn < 2 * Math.PI) return { x: LOOP.x + LOOP.r * Math.sin(turn), y: LOOP.y + LOOP.r * Math.cos(turn), pitch: (-turn * 180) / Math.PI }
  return { x: LOOP.x + 40 * ramp(u, 2.85, 3), y: LOOP.y + LOOP.r - 6 * bell(u, 2.85, 3), pitch: 0 }
}

/** Which blimp a stroke fires at. */
const targetOf = (stroke: number): number => (stroke < 3 ? 0 : stroke < 6 ? 1 : 2)

function Biplane() {
  return (
    <g>
      <path d="M-78 -8 L-96 -34 L-84 -34 L-64 -14 Z" fill="#c83a2a" stroke={INK} strokeWidth={3.5} strokeLinejoin="round" />
      <rect x={-96} y={-6} width={30} height={8} rx={3} fill="#a82a1a" stroke={INK} strokeWidth={3} />
      <path d="M-80 -10 Q-40 -26 40 -18 Q66 -14 70 0 Q66 14 40 16 Q-40 20 -80 4 Z" fill="#e04a32" stroke={INK} strokeWidth={4} />
      <path d="M-72 -12 Q-56 -28 -36 -16" fill="#3a2a2a" stroke={INK} strokeWidth={3} />
      <rect x={-34} y={-46} width={84} height={10} rx={4} fill="#f0d08a" stroke={INK} strokeWidth={3.5} />
      <rect x={-30} y={18} width={80} height={10} rx={4} fill="#f0d08a" stroke={INK} strokeWidth={3.5} />
      <path d="M-20 -36 L-16 18 M36 -36 L38 18" stroke={INK} strokeWidth={4} />
      <path d="M0 28 L-6 44 M24 28 L30 44" stroke={INK} strokeWidth={4} />
      <circle cx={-6} cy={48} r={7} fill="#2a2a2a" />
      <circle cx={30} cy={48} r={7} fill="#2a2a2a" />
      <rect x={68} y={-6} width={10} height={12} rx={3} fill="#5a5a5a" stroke={INK} strokeWidth={3} />
      <g data-np="propeller">
        <ellipse cx={80} cy={0} rx={4} ry={34} fill="#c8c8c8" opacity={0.55} stroke={INK} strokeWidth={2} />
      </g>
    </g>
  )
}

function Blimp() {
  return (
    <g>
      <ellipse rx={90} ry={34} fill="#9aa08a" stroke={INK} strokeWidth={4} />
      <path d="M-70 -10 Q0 -30 70 -10" fill="none" stroke="#b8bca8" strokeWidth={6} />
      <path d="M-82 -6 L-112 -34 L-106 0 L-112 34 L-82 6 Z" fill="#7a806a" stroke={INK} strokeWidth={3.5} strokeLinejoin="round" />
      <rect x={-22} y={32} width={44} height={16} rx={5} fill="#5a4a3a" stroke={INK} strokeWidth={3} />
      <path d="M-14 32 L-20 22 M14 32 L20 22" stroke={INK} strokeWidth={2.5} />
    </g>
  )
}

function Country() {
  const fields = ['#8ac85a', '#d8c86a', '#6aaa4a', '#c8b05a', '#7aba5a', '#b8c86a']
  return (
    <>
      {[
        [-180, 40, 1.4],
        [160, -40, 1],
        [430, 30, 1.2],
        [620, -60, 0.9],
      ].map(([x, y, s]) => (
        <g key={x} transform={`translate(${x} ${y}) scale(${s})`} opacity={0.92}>
          <ellipse cx={0} cy={0} rx={70} ry={26} fill="#fff" />
          <ellipse cx={-36} cy={-12} rx={40} ry={26} fill="#fff" />
          <ellipse cx={30} cy={-16} rx={46} ry={30} fill="#fff" />
        </g>
      ))}
      <path d="M-1500 392 Q320 370 2100 392 V2000 H-1500 Z" fill="#7aba5a" />
      {fields.map((fill, i) => (
        <path key={fill} d={`M${-900 + i * 360} 400 L${-700 + i * 360} 400 L${-560 + i * 420} 2000 L${-960 + i * 420} 2000 Z`} fill={fill} opacity={0.85} />
      ))}
      <path d="M-1500 430 Q320 420 2100 432 M-1500 480 Q320 468 2100 482" stroke="#5a8a3a" strokeWidth={4} fill="none" />
      <rect x={-1500} y={STRIP.y + 4} width={1860} height={14} fill="#8a8a7a" />
      <path d="M260 388 V340 L290 348 L260 356" fill="#ff8a3d" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
    </>
  )
}

export const bands: SetPiece = {
  script: [1300, 2000, 1500],
  focus: 380,
  sky: ['#7ec4ee', '#f8e4b4'],
  art: () => (
    <>
      <Country />
      {BLIMPS.map((_, i) => (
        <g key={i} data-np={`blimp-${i}`}>
          <Blimp />
        </g>
      ))}
      {BLIMPS.map((_, i) => (
        <Puffs key={i} name={`smoke-${i}`} color="#5a5a5a" n={5} />
      ))}
      <g data-np="tracer" opacity={0}>
        <path d="M0 0 H22 M34 0 H56 M68 0 H90" stroke="#ffe14d" strokeWidth={5} strokeLinecap="round" />
      </g>
      <g data-np="plane">
        <g transform="scale(1.3)">
          <g transform="translate(-6 8)">
            <Hero />
            <Guardian />
          </g>
          <Biplane />
        </g>
      </g>
    </>
  ),
  bind: (root) => {
    const pose = heroOf(root)
    const guard = guardOf(root)
    const plane = part(root, 'plane')
    const propeller = part(root, 'propeller')
    const tracer = part(root, 'tracer')
    const blimps = BLIMPS.map((_, i) => part(root, `blimp-${i}`))
    return (u) => {
      const at = planeAt(u)
      transformTo(plane, `translate(${r1(at.x)} ${r1(at.y)}) rotate(${r1(at.pitch)})`)
      transformTo(propeller, `translate(80 0) scale(1 ${Math.cos(u * 60).toFixed(2)}) translate(-80 0)`)
      // him in the cockpit: climbing in on the strip, then at the stick, leant into the climb
      const climbIn = ramp(u, 0, 0.12)
      pose({ x: -50, y: lerp(30, 4, climbIn), s: 0.55, move: sideOn({ ...READY, armRight: -70, foreRight: -40, armLeft: -60, foreLeft: -50, head: -6 * bell(u, 0.4, 1) }, YAW.right) })
      guard(-104, -92, u)

      // the blimps drift, and each falls on its last stroke of the fill, smoking, gone
      BLIMPS.forEach((blimp, i) => {
        const down = ramp(u, DOWN[i], DOWN[i] + 0.45)
        const drift = 10 * Math.sin(u * 2 + i)
        placeTo(blimps[i], blimp.x + drift + 30 * down, blimp.y + 260 * down * down, blimp.s * (1 - 0.3 * down), 30 * down)
        fadeTo(blimps[i], 1 - ramp(down, 0.6, 1))
        puffsTo(root, `smoke-${i}`, blimp.x + drift + 30 * down, blimp.y + 260 * down * down, down >= 1 ? 0 : ramp(u, DOWN[i], DOWN[i] + 0.6), 50, 5)
      })

      // the burst of the stroke playing, from the plane's nose toward its blimp
      const stroke = STROKES.findIndex((at0) => u >= at0 && u < at0 + BURST)
      fadeTo(tracer, stroke < 0 ? 0 : 1)
      if (stroke >= 0) {
        const target = BLIMPS[targetOf(stroke)]
        const t = (u - STROKES[stroke]) / BURST
        const nose = { x: at.x + 112, y: at.y }
        const angle = (Math.atan2(target.y - nose.y, target.x - nose.x) * 180) / Math.PI
        transformTo(tracer, `translate(${r1(lerp(nose.x, target.x - 90, t))} ${r1(lerp(nose.y, target.y, t))}) rotate(${r1(angle)})`)
      }
    }
  },
}
