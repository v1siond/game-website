import type { ReactNode } from 'react'
import { ramp } from '@/lib/scroll/stage'
import { bell, fadeTo, lerp, transformTo } from '../../shared/stageNodes'
import { fromBehind, mixPose, RIDE, sideOn, YAW } from '../motion'
import { AIR, READY } from '../sidePose'
import { INK } from './cast'
import { along, Guardian, guardOf, Hero, heroOf, Hourglass, part, placeTo, Puffs, puffsTo, type SetPiece } from './kit'

// Services, the race (research notes, the road levels: a motorbike race where only first place earns the
// crystal, with green boost plates, rival riders and police cars to swerve round [15] [21] [29]; the camera
// rides behind the vehicle [1]): a desert highway at neon dusk. 1 kick-start: he hops onto the bike from
// its side (his side to us) and, seated, turns to ride it into the screen (his back), and it roars off. 2 boost: he rides over a green plate and shoots forward past the rival riders. 3 overtake: he
// swerves round the police car and takes the lead under the finish arch. The end frame: him first over the
// line, the core floating up from the arch.

const ROAD = { vx: 320, vy: 236, near: 452 }
const BIKE_X = 320
const SEAT = 20
// How far down the road he has gone: idling, off, the boost's surge, on to the line.
const travelAt = (u: number): number => 300 * ramp(u, 0.6, 1) ** 2 + 900 * ramp(u, 1, 2) + 700 * ramp(u, 2, 2.9)
// How far the rivals have gone: off with him, then steady while the boost carries him past.
const rivalTravelAt = (u: number): number => 300 * ramp(u, 0.4, 1) + 500 * ramp(u, 1, 2.9)
const DASHES = 9
const SPAN = 900
const BOOST_Z = 620
const COP_Z = 1500
const ARCH_Z = 1900
const RIVALS = [
  { z: 260, x: -150, colour: '#3ad0ff' },
  { z: 420, x: 150, colour: '#b6ff5c' },
]

/** Wrapped distance ahead once he has gone `travel`. */
const ahead = (z: number, travel: number): number => ((((z - travel) % SPAN) + SPAN) % SPAN) - 60

/** The bike from behind: the rear wheel, the fender with its tail light, the seat and the exhaust. */
function BikeRear({ colour = '#ff3d7f', lamp = '#ff2a2a' }: { colour?: string; lamp?: string }) {
  return (
    <g>
      <path d="M-34 -64 Q0 -80 34 -64 L28 -30 H-28 Z" fill={colour} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      <rect x={-17} y={-44} width={34} height={46} rx={12} fill="#1a1420" stroke={INK} strokeWidth={4} />
      <rect x={-26} y={-58} width={52} height={14} rx={5} fill="#2a2a3a" stroke={INK} strokeWidth={3} />
      <rect x={-12} y={-56} width={24} height={9} rx={3} fill={lamp} />
      <path d="M-30 -26 h-14 M30 -26 h14" stroke="#c0c8d8" strokeWidth={8} strokeLinecap="round" />
      <path d="M-50 -92 h-14 M50 -92 h14" stroke={INK} strokeWidth={6} strokeLinecap="round" />
    </g>
  )
}

/** A rival rider from behind: the bike and a helmeted rider leant over the bars. */
function Rival({ colour }: { colour: string }) {
  return (
    <g>
      <BikeRear colour={colour} />
      <path d="M-30 -60 Q-34 -110 0 -118 Q34 -110 30 -60 Z" fill="#2a2a3a" stroke={INK} strokeWidth={4} />
      <circle cy={-130} r={22} fill={colour} stroke={INK} strokeWidth={4} />
      <path d="M-18 -134 H18" stroke={INK} strokeWidth={6} />
    </g>
  )
}

/** The police car from behind: black and white, its light bar on the roof. */
function PoliceCar() {
  return (
    <g>
      <rect x={-90} y={-70} width={180} height={62} rx={12} fill="#f4f4f4" stroke={INK} strokeWidth={4} />
      <path d="M-66 -70 L-50 -118 H50 L66 -70 Z" fill="#1a1a22" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      <path d="M-50 -108 H50 L60 -76 H-60 Z" fill="#4a6a8a" opacity={0.7} />
      <rect x={-90} y={-40} width={180} height={18} fill="#1a1a22" />
      <rect x={-80} y={-62} width={26} height={12} rx={3} fill="#ff3a2a" />
      <rect x={54} y={-62} width={26} height={12} rx={3} fill="#ff3a2a" />
      <rect x={-34} y={-130} width={34} height={12} rx={4} fill="#ff2a3a" />
      <rect x={0} y={-130} width={34} height={12} rx={4} fill="#2a6aff" />
      <rect x={-96} y={-10} width={36} height={14} rx={4} fill={INK} />
      <rect x={60} y={-10} width={36} height={14} rx={4} fill={INK} />
    </g>
  )
}

/** The finish arch over the road: two posts and a chequered banner, the line under it. */
function Arch() {
  const squares: ReactNode[] = []
  for (let i = 0; i < 20; i++) squares.push(<rect key={i} x={-300 + i * 30} y={i % 2 ? -340 : -325} width={30} height={15} fill="#f4f4f4" />)
  return (
    <g>
      <rect x={-300} y={-10} width={600} height={14} fill="#f4f4f4" />
      <rect x={-300} y={-10} width={600} height={7} fill="#1a1a22" opacity={0.5} />
      <rect x={-320} y={-340} width={20} height={340} fill="#ff5db8" stroke={INK} strokeWidth={4} />
      <rect x={300} y={-340} width={20} height={340} fill="#ff5db8" stroke={INK} strokeWidth={4} />
      <rect x={-300} y={-340} width={600} height={30} fill="#1a1a22" stroke={INK} strokeWidth={4} />
      {squares}
    </g>
  )
}

function Highway() {
  return (
    <>
      <g transform="translate(320 236)">
        <circle r={150} fill="#ffb03a" />
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={-160} y={-20 + i * 26} width={320} height={4 + i * 3} fill="#c8407a" />
        ))}
      </g>
      <path d="M-1500 236 L-200 236 L-140 170 L40 170 L80 236 L520 236 L560 186 L700 186 L740 236 H2100 V400 H-1500 Z" fill="#4a1a4a" />
      <path d="M-1500 236 H2100 V2000 H-1500 Z" fill="#7a3a4a" />
      <path d={`M${ROAD.vx - 16} ${ROAD.vy} L${ROAD.vx + 16} ${ROAD.vy} L1300 2000 L-660 2000 Z`} fill="#2a2030" />
      <path d={`M${ROAD.vx - 16} ${ROAD.vy} L-660 2000 M${ROAD.vx + 16} ${ROAD.vy} L1300 2000`} stroke="#ff5db8" strokeWidth={6} />
      {Array.from({ length: DASHES }, (_, i) => (
        <rect key={i} data-np={`dash-${i}`} x={-8} y={-30} width={16} height={30} fill="#ffd34d" />
      ))}
      {Array.from({ length: 6 }, (_, i) => (
        <g key={i} data-np={`post-${i}`}>
          <rect x={-6} y={-90} width={12} height={90} fill="#2a1a3a" />
          <rect x={-6} y={-90} width={12} height={26} fill={i % 2 ? '#5cf2ff' : '#ff5db8'} />
        </g>
      ))}
    </>
  )
}

export const services: SetPiece = {
  script: [1300, 1500, 1800],
  focus: BIKE_X,
  sky: ['#2a0a4a', '#ff8a5a'],
  art: () => (
    <>
      <Highway />
      <g data-np="arch">
        <Arch />
        <g data-np="core">
          <Hourglass size={1.4} />
        </g>
      </g>
      <g data-np="boost">
        <path d="M-80 0 L80 0 L60 -40 L-60 -40 Z" fill="#2fe07a" stroke="#0a6a3a" strokeWidth={4} />
        <path d="M-30 -8 L0 -32 L30 -8 M-30 -20 L0 -44 L30 -20" fill="none" stroke="#eaffea" strokeWidth={6} strokeLinejoin="round" />
      </g>
      <g data-np="cop">
        <PoliceCar />
      </g>
      {RIVALS.map((rival, i) => (
        <g key={rival.colour} data-np={`rival-${i}`}>
          <Rival colour={rival.colour} />
        </g>
      ))}
      <g data-np="streaks" opacity={0}>
        <path d="M-200 200 L40 300 M-200 330 L60 380 M840 200 L600 300 M840 330 L580 380" stroke="#fff" strokeWidth={5} strokeLinecap="round" opacity={0.7} />
      </g>
      <g data-np="ride">
        <Hero />
        <g transform="scale(1.3)">
          <BikeRear />
        </g>
        <Guardian />
      </g>
      <Puffs name="exhaust" color="#c8b8c8" n={4} />
    </>
  ),
  bind: (root) => {
    const pose = heroOf(root)
    const guard = guardOf(root)
    const ride = part(root, 'ride')
    const boost = part(root, 'boost')
    const cop = part(root, 'cop')
    const arch = part(root, 'arch')
    const core = part(root, 'core')
    const streaks = part(root, 'streaks')
    const rivals = RIVALS.map((_, i) => part(root, `rival-${i}`))
    return (u) => {
      const travel = travelAt(u)
      for (let i = 0; i < DASHES; i++) {
        const d = along(ahead((i * SPAN) / DASHES, travel * 1.4), 0, ROAD)
        placeTo(root.querySelector(`[data-np="dash-${i}"]`), d.x, d.y, d.s)
      }
      for (let i = 0; i < 6; i++) {
        const d = along(ahead(i * 150, travel * 1.4), i % 2 ? 420 : -420, ROAD)
        placeTo(root.querySelector(`[data-np="post-${i}"]`), d.x, d.y, d.s)
      }

      // 2 the boost plate under him, the surge and the streaks, the rivals falling behind
      const plate = along(BOOST_Z - travel, 0, ROAD)
      placeTo(boost, plate.x, plate.y, plate.s)
      fadeTo(boost, BOOST_Z - travel > -80 ? 1 : 0)
      fadeTo(streaks, bell(u, 1.35, 2.1))
      const theirs = rivalTravelAt(u)
      RIVALS.forEach((rival, i) => {
        const z = rival.z + theirs - travel
        const at = along(z, rival.x, ROAD)
        placeTo(rivals[i], at.x, at.y + 4 * Math.sin(u * 20 + i), at.s)
        fadeTo(rivals[i], Math.max(0, Math.min(1, (z + 20) / 50)))
      })

      // 3 the police car in his lane; he swerves round it, and the line under the arch
      const swerve = bell(u, 2.15, 2.65)
      const x = BIKE_X - 150 * swerve
      const c = along(COP_Z - travel, 0, ROAD)
      placeTo(cop, c.x, c.y, c.s)
      fadeTo(cop, Math.max(0, Math.min(1, (COP_Z - travel + 30) / 60)))
      const a = along(Math.max(-20, ARCH_Z - travel), 0, ROAD)
      placeTo(arch, a.x, a.y, a.s)
      transformTo(core, `translate(0 ${(-360 - 40 * ramp(u, 2.75, 3)).toFixed(1)})`)
      fadeTo(core, ramp(u, 2.75, 2.85))

      // him: beside the bike side on, the hop on across it, then seated, turned to ride it away from us
      const hop = ramp(u, 0.1, 0.45)
      const on = hop >= 1
      const seated = ramp(u, 0.45, 0.6)
      const lean = -14 * swerve + 10 * bell(u, 1.3, 1.8)
      transformTo(ride, `translate(${(on ? x : BIKE_X).toFixed(1)} ${(ROAD.near + 2 * Math.sin(u * 24) * (on ? 1 : 0)).toFixed(1)}) rotate(${lean.toFixed(1)})`)
      if (!on) {
        const fromX = -100
        pose({ x: lerp(fromX, 0, hop), y: lerp(0, -SEAT, hop) - 70 * Math.sin(Math.PI * hop), move: sideOn(hop > 0 ? AIR : READY, YAW.right) })
      } else {
        pose({ x: 0, y: -SEAT, move: { ...fromBehind(mixPose(RIDE, { ...RIDE, jump: -14 }, bell(u, 1.3, 1.6))), side: READY, yaw: lerp(YAW.right, YAW.back, seated) } })
      }
      guard(-58, -SEAT - 176, u)
      puffsTo(root, 'exhaust', x - 40, ROAD.near - 20, ramp(u, 0.45, 0.95), 40, 4)
    }
  },
}
