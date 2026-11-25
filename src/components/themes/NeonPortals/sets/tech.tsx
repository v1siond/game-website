import { mix } from '@/lib/motion/rigPose'
import { ramp } from '@/lib/scroll/stage'
import { bell, fadeTo, lerp, transformTo } from '../../shared/stageNodes'
import { sideOn } from '../motion'
import { AIR, READY } from '../sidePose'
import { INK } from './cast'
import { Crate, Glow, Guardian, guardOf, Hero, heroOf, part, placeTo, Puffs, puffsTo, type SetPiece } from './kit'

// Tech Stack, under the sea (research notes, the underwater levels: a mini sub with torpedoes breaks the
// coral that hides the crates, past sharks on fixed lines, mines that lean toward him and turbines that pull
// him in [9] [19]): a deep sea base of tanks and pipes, red coral on the sea floor, a turbine turning in
// the way. 1 dive: he drops into a little round sub. 2 fire: a torpedo cracks the red coral and the crates
// it hid float out, one per stack category. 3 slip: he waits for the turbine to pause and slips through.
// The end frame: the sub through the turbine, the opened coral behind with its crates.

const SUB_START = { x: 150, y: 250 }
const SUB_FIRE = { x: 190, y: 262 }
const SUB_END = { x: 505, y: 232 }
const CORAL = { x: 290, y: 400 }
const TURBINE = { x: 482, y: 318, r: 100 }
// The gap the sub slips through: straight above the hub once the blades rest on the diagonals.
const GAP_Y = TURBINE.y - TURBINE.r * 0.72
const MAX_CRATES = 6

/** The sub's centre at `u`: drifting where he dropped in, nosing to fire, up into the gap and through. */
function subAt(u: number): { x: number; y: number; tilt: number } {
  const bob = 3 * Math.sin(u * 5)
  if (u < 1.05) return { x: SUB_START.x, y: SUB_START.y + bob, tilt: 0 }
  if (u < 2.25) {
    const t = ramp(u, 1.05, 1.2)
    return { x: lerp(SUB_START.x, SUB_FIRE.x, t), y: lerp(SUB_START.y, SUB_FIRE.y, t) + bob, tilt: 6 * t * (1 - ramp(u, 1.9, 2.2)) }
  }
  const go = ramp(u, 2.32, 2.85)
  const x = lerp(SUB_FIRE.x, SUB_END.x, go)
  const lift = Math.sin(Math.PI * Math.min(1, go * 1.4)) * (SUB_FIRE.y - GAP_Y)
  return { x, y: lerp(SUB_FIRE.y, SUB_END.y, go) - lift * (1 - go * 0.4), tilt: -8 * bell(go, 0, 0.7) }
}

/** The turbine's turn in degrees: fast, easing to rest on the diagonals, held, and on again once he is through. */
function turbineAt(u: number): number {
  const rest = 45 + 360 * 5
  if (u < 2.32) return rest * (1 - (1 - ramp(u, 0, 2.32)) ** 2)
  if (u < 2.8) return rest
  return rest + 900 * ramp(u, 2.8, 3) ** 2
}

/** Where each freed crate floats to, in a row over the coral. */
const crateSpot = (i: number, n: number): { x: number; y: number } => ({ x: CORAL.x - ((n - 1) / 2) * 36 + i * 36, y: CORAL.y - 96 - (i % 2) * 20 })

function Sub() {
  return (
    <g>
      <path d="M-70 4 L-92 -14 L-92 22 Z" fill="#ffb02e" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      <g data-np="prop">
        <ellipse cx={-96} cy={4} rx={5} ry={20} fill="#8a8a9a" stroke={INK} strokeWidth={3} />
      </g>
      <ellipse cx={0} cy={8} rx={72} ry={44} fill="#ffcf3a" stroke={INK} strokeWidth={5} />
      <path d="M-60 26 Q0 50 60 26" fill="none" stroke="#e09a1a" strokeWidth={6} />
      <circle cx={42} cy={14} r={12} fill="#5cd8ff" stroke={INK} strokeWidth={4} />
      <rect x={62} y={10} width={22} height={12} rx={4} fill="#8a8a9a" stroke={INK} strokeWidth={3} />
    </g>
  )
}

function Base() {
  return (
    <>
      {[60, 200, 340, 480].map((x, i) => (
        <path key={x} d={`M${x} -400 L${x - 40 + i * 10} 400`} stroke="#6ad0ff" strokeWidth={46} opacity={0.06} />
      ))}
      <rect x={-1500} y={160} width={3600} height={40} fill="#0c3050" />
      {[30, 150, 610].map((x) => (
        <g key={x} transform={`translate(${x} 330)`}>
          <rect x={-40} y={-150} width={80} height={150} rx={30} fill="#164a6a" stroke="#0a2a40" strokeWidth={4} />
          <circle cy={-100} r={16} fill="#5cf2ff" opacity={0.5} stroke="#0a2a40" strokeWidth={4} />
          <circle cy={-50} r={16} fill="#5cf2ff" opacity={0.5} stroke="#0a2a40" strokeWidth={4} />
        </g>
      ))}
      <path d="M-1500 290 H2100" stroke="#1d5a7a" strokeWidth={14} />
      <path d="M-1500 400 Q0 388 320 400 T2100 398 V2000 H-1500 Z" fill="#1b4a5a" />
      <path d="M-1500 404 Q0 394 320 404 T2100 402" fill="none" stroke="#3a7a8a" strokeWidth={4} />
      {/* a sea plant or two on the floor */}
      <path d="M90 400 Q80 340 100 300 M110 400 Q120 350 104 320 M560 400 Q550 360 572 330" fill="none" stroke="#2fb88a" strokeWidth={7} strokeLinecap="round" />
    </>
  )
}

function Shark() {
  return (
    <g>
      <path d="M-60 0 Q-10 -26 50 -6 L70 -2 L50 6 Q-10 22 -60 0 Z" fill="#8a9aaa" stroke={INK} strokeWidth={3.5} strokeLinejoin="round" />
      <path d="M-4 -16 L10 -38 L18 -12 Z M-60 0 L-82 -18 L-76 0 L-82 16 Z" fill="#6a7a8a" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
      <circle cx={40} cy={-6} r={3} fill={INK} />
      <path d="M44 4 L60 2" stroke={INK} strokeWidth={2.5} />
    </g>
  )
}

function Mine() {
  return (
    <g>
      <path d="M0 0 V-90" stroke="#3a4a5a" strokeWidth={4} strokeDasharray="8 5" />
      <g transform="translate(0 -110)">
        {[0, 45, 90, 135].map((a) => (
          <path key={a} d="M-30 0 H30" stroke={INK} strokeWidth={6} transform={`rotate(${a})`} strokeLinecap="round" />
        ))}
        <circle r={22} fill="#4a3a4a" stroke={INK} strokeWidth={4} />
        <circle cx={-7} cy={-7} r={5} fill="#ff4a3d" />
      </g>
    </g>
  )
}

export const tech: SetPiece = {
  script: [1300, 1700, 1700],
  sky: ['#0b4a7a', '#03142a'],
  art: ({ count }) => {
    const n = Math.min(MAX_CRATES, Math.max(1, count))
    return (
      <>
        <Base />
        <g data-np="shark-a">
          <Shark />
        </g>
        <g data-np="shark-b" opacity={0.7}>
          <Shark />
        </g>
        <g data-np="mine" transform="translate(400 400)">
          <Mine />
        </g>
        {Array.from({ length: n }, (_, i) => (
          <g key={i} data-np={`crate-${i}`}>
            <Crate w={34} />
          </g>
        ))}
        {/* the red coral, in pieces that fly when the torpedo hits */}
        {[-46, -14, 18, 48].map((dx, i) => (
          <g key={dx} data-np={`coral-${i}`}>
            <path d={`M${dx - 24} 0 Q${dx - 30} -70 ${dx - 6} -90 Q${dx} -60 ${dx + 6} -96 Q${dx + 28} -70 ${dx + 24} 0 Z`} fill="#e0403a" stroke="#7a1a1a" strokeWidth={4} />
          </g>
        ))}
        <g data-np="blast" opacity={0}>
          <Glow r={90} color="#fff2a8" />
        </g>
        <g data-np="torpedo" opacity={0}>
          <rect x={-18} y={-5} width={36} height={10} rx={5} fill="#d0d8e0" stroke={INK} strokeWidth={2.5} />
          <path d="M-26 0 H-18" stroke="#fff" strokeWidth={4} opacity={0.6} />
        </g>
        <g transform={`translate(${TURBINE.x} ${TURBINE.y})`}>
          <circle r={TURBINE.r + 14} fill="none" stroke="#2a5a7a" strokeWidth={10} />
          <g data-np="blades">
            {[0, 90, 180, 270].map((a) => (
              <path key={a} d={`M0 -14 Q30 -${TURBINE.r * 0.5} 10 -${TURBINE.r} Q-12 -${TURBINE.r * 0.6} -10 -14 Z`} fill="#c0ccd8" stroke={INK} strokeWidth={4} transform={`rotate(${a})`} />
            ))}
          </g>
          <circle r={20} fill="#6a7a8a" stroke={INK} strokeWidth={4} />
        </g>
        <g data-np="sub">
          <Hero />
          <g transform="scale(0.9)">
            <Sub />
          </g>
          <path d="M-40 -16 Q-40 -78 4 -78 Q46 -78 46 -16 Z" fill="#bff6ff" opacity={0.28} stroke="#e8fbff" strokeWidth={4} />
          <Guardian />
        </g>
        <Puffs name="bubbles" color="#bff6ff" n={5} />
      </>
    )
  },
  bind: (root, { count }) => {
    const n = Math.min(MAX_CRATES, Math.max(1, count))
    const pose = heroOf(root)
    const guard = guardOf(root)
    const sub = part(root, 'sub')
    const prop = part(root, 'prop')
    const blades = part(root, 'blades')
    const torpedo = part(root, 'torpedo')
    const blast = part(root, 'blast')
    const sharkA = part(root, 'shark-a')
    const sharkB = part(root, 'shark-b')
    const mine = part(root, 'mine')
    const crates = Array.from({ length: n }, (_, i) => part(root, `crate-${i}`))
    const coral = [0, 1, 2, 3].map((i) => part(root, `coral-${i}`))
    return (u) => {
      const at = subAt(u)
      transformTo(sub, `translate(${at.x.toFixed(1)} ${at.y.toFixed(1)}) rotate(${at.tilt.toFixed(1)})`)
      transformTo(prop, `translate(-96 4) scale(1 ${Math.cos(u * 30).toFixed(2)}) translate(96 -4)`)

      // 1 he drops in from above, into the dome, and settles at the controls
      const drop = ramp(u, 0, 0.7)
      const seat = { x: 4, y: 18 }
      pose({ x: seat.x, y: lerp(-420, seat.y, drop ** 1.6), s: 0.62, move: sideOn(drop < 1 ? AIR : mix(READY, { ...READY, armRight: -70, foreRight: -40, armLeft: -60, foreLeft: -50 }, ramp(u, 0.75, 1)), 1) })
      guard(-56, -96, u)
      puffsTo(root, 'bubbles', at.x, at.y - 50, ramp(u, 0.55, 1), 50)

      // 2 the torpedo runs to the coral; the coral flies apart and the crates float up out of it
      const run = ramp(u, 1.2, 1.5)
      fadeTo(torpedo, run > 0 && run < 1 ? 1 : 0)
      placeTo(torpedo, lerp(SUB_FIRE.x + 90, CORAL.x - 10, run), lerp(SUB_FIRE.y + 16, CORAL.y - 50, run), 1, 22 * run)
      fadeTo(blast, bell(u, 1.45, 1.8))
      placeTo(blast, CORAL.x, CORAL.y - 50)
      const burst = ramp(u, 1.5, 1.9)
      coral.forEach((piece, i) => {
        const side = i < 2 ? -1 : 1
        transformTo(piece, `translate(${(CORAL.x + side * 22 * burst * (1 + (i % 2))).toFixed(1)} ${(CORAL.y + 12 * burst).toFixed(1)}) rotate(${(side * 32 * burst).toFixed(1)} 0 0)`)
      })
      crates.forEach((crate, i) => {
        const spot = crateSpot(i, n)
        const rise = ramp(u, 1.55 + i * 0.05, 1.95 + i * 0.05)
        fadeTo(crate, rise > 0 ? 1 : 0)
        placeTo(crate, spot.x, lerp(CORAL.y - 20, spot.y, rise) + 3 * Math.sin(u * 6 + i), 1, 8 * Math.sin(u * 4 + i))
      })

      // 3 the turbine rests on the diagonals, he slips through the gap over its hub, and it starts again
      transformTo(blades, `rotate(${turbineAt(u).toFixed(1)})`)

      // the sharks keep their lines; the mine leans toward the sub as it passes
      transformTo(sharkA, `translate(${(700 - 190 * u).toFixed(1)} ${(96 + 6 * Math.sin(u * 3)).toFixed(1)}) scale(-1 1)`)
      placeTo(sharkB, -120 + 150 * u, 360, 0.7)
      const lean = Math.max(-24, Math.min(24, (at.x - 400) / 6))
      transformTo(mine, `translate(400 400) rotate(${lean.toFixed(1)})`)
    }
  },
}
