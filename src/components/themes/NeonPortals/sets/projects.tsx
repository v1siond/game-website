import { mix } from '@/lib/motion/rigPose'
import { ramp } from '@/lib/scroll/stage'
import { bell, fadeTo, lerp, transformTo } from '../../shared/stageNodes'
import { sideOn } from '../motion'
import { AIR, land, LANDED, READY, run as sideRun, SLAM, spin, type SidePose } from '../sidePose'
import { INK, PortalRing } from './cast'
import { Glow, Guardian, guardOf, Hero, heroOf, part, placeTo, Puffs, puffsTo, shoulder, type HeroAt, type SetPiece } from './kit'

// Projects, the boss behind the chamber's last portal (research notes: five portals done, the boss portal
// opens; three hits; the power he gives [1] [3] [44]): a stone arena in the round, the chamber's portals
// glowing on its rim, and a hulking guard of our own with a war hammer who leaps round the arena and slams
// it down, open when it sticks in the floor. 1 dodge: he jumps clear of the guard's leap. 2 spin: the
// hammer sticks in the floor and he spins into the guard, three times. 3 slam: the guard drops a glowing
// token; he takes it and lands his first body slam, cracking the floor. The end frame: the guard sitting
// dazed, the floor cracked, him in the dust.

const FLOOR = 400
const GUARD_FROM = 500
const GUARD_LAND = 400
const GUARD_SIT = 505
const START = 220
const DODGE = 120
const CLOSE = 300
const SLAM_AT = 290
const TOKEN = { x: 360, y: FLOOR - 8 }

/** The guard's place and lean at `u`: the crouch and leap, the tug at his stuck hammer, the hits, the sit. */
function guardAt(u: number): { x: number; y: number; lean: number; sit: number } {
  const leap = ramp(u, 0.2, 0.6)
  if (u < 1) return { x: lerp(GUARD_FROM, GUARD_LAND, leap), y: FLOOR - 170 * Math.sin(Math.PI * leap) + 12 * bell(u, 0, 0.2), lean: -10 * bell(u, 0.05, 0.25), sit: 0 }
  if (u < 2) {
    const hits = bell(u, 1.3, 1.45) + bell(u, 1.55, 1.7) + bell(u, 1.8, 1.95)
    return { x: GUARD_LAND + 10 * hits, y: FLOOR, lean: 14 * hits + 6 * Math.sin(u * 30) * ramp(u, 1.15, 1.25), sit: 0 }
  }
  const back = ramp(u, 2, 2.3)
  return { x: lerp(GUARD_LAND, GUARD_SIT, back), y: FLOOR, lean: 10 * (1 - back), sit: back }
}

/** The hammer's turn at his grip: raised for the leap, swung down into the floor and stuck there, let fall as he sits. */
const hammerAt = (u: number): number => (u < 1 ? 40 * bell(u, 0, 0.6) : u < 2 ? lerp(40, -125, ramp(u, 1, 1.15)) : lerp(-125, -150, ramp(u, 2, 2.3)))

/** His frame at `u`. */
function heroAt(u: number): HeroAt {
  if (u < 1) {
    const jump = ramp(u, 0.32, 0.62)
    if (jump <= 0) return { x: START, y: FLOOR, move: sideOn(READY, 1) }
    if (jump < 1) return { x: lerp(START, DODGE, jump), y: FLOOR - 120 * Math.sin(Math.PI * jump), move: sideOn(AIR, 1) }
    return { x: DODGE, y: FLOOR, move: sideOn(land(ramp(u, 0.62, 0.95), READY), 1) }
  }
  if (u < 2) {
    const dash = ramp(u, 1.1, 1.3)
    if (dash < 1) return { x: lerp(DODGE, CLOSE, dash), y: FLOOR, move: sideOn(sideRun(u * 6), 1) }
    // three spins, one per hit
    const t = (u - 1.3) / 0.7
    const k = Math.min(2, Math.floor(t * 3))
    const local = ramp(t * 3 - k, 0, 1)
    return { x: CLOSE + 8 * Math.sin(Math.PI * local), y: FLOOR, move: sideOn(spin(local), Math.cos(4 * Math.PI * local), -10 * Math.sin(Math.PI * local)) }
  }
  // the token, the leap and the slam into the floor, the dust
  if (u < 2.5) {
    const walk = ramp(u, 2.25, 2.45)
    return { x: lerp(CLOSE, TOKEN.x - 30, walk), y: FLOOR, move: sideOn(walk > 0 && walk < 1 ? sideRun(u * 6) : READY, 1) }
  }
  const up = ramp(u, 2.5, 2.74)
  const down = ramp(u, 2.74, 2.84)
  if (down <= 0) return { x: lerp(TOKEN.x - 30, SLAM_AT, up), y: FLOOR - 200 * Math.sin((Math.PI / 2) * up), move: sideOn(mix(AIR, SLAM, ramp(up, 0.5, 1)), 1) }
  if (down < 1) return { x: SLAM_AT, y: FLOOR - 200 * (1 - down), move: sideOn(SLAM, 1) }
  const settle: SidePose = mix({ ...SLAM, stretch: -0.2 }, LANDED, ramp(u, 2.86, 3))
  return { x: SLAM_AT, y: FLOOR, move: sideOn({ ...settle, dust: 1 }, 1) }
}

function Arena() {
  const rim = [-260, -150, 90, 200, 310]
  return (
    <>
      <path d="M-1500 330 V120 Q320 40 2100 120 V330 Z" fill="#6a5a4a" />
      {[150, 200, 250, 300].map((y) => (
        <path key={y} d={`M-1500 ${y} Q320 ${y - 70} 2100 ${y}`} fill="none" stroke="#4a3e32" strokeWidth={6} />
      ))}
      {rim.map((x, i) => (
        <g key={x} transform={`translate(${x + 30} ${86 - (i === 2 ? 0 : 6)})`}>
          <PortalRing r={22} color="#43f5e4" />
        </g>
      ))}
      <g transform="translate(320 70)">
        <PortalRing r={42} color="#ffd166" />
      </g>
      <path d="M-1500 330 Q320 300 2100 330 V2000 H-1500 Z" fill="#c8a46a" />
      <ellipse cx={320} cy={410} rx={340} ry={70} fill="#d8b47a" />
      <ellipse cx={320} cy={410} rx={340} ry={70} fill="none" stroke="#a8844a" strokeWidth={5} />
    </>
  )
}

function HammerGuard() {
  return (
    <g>
      <g data-np="brute-legs">
        <rect x={-46} y={-80} width={34} height={80} rx={10} fill="#5a3a5a" stroke={INK} strokeWidth={4} />
        <rect x={6} y={-80} width={34} height={80} rx={10} fill="#4a2e4a" stroke={INK} strokeWidth={4} />
        <path d="M-52 -4 h46 M0 -4 h46" stroke={INK} strokeWidth={10} strokeLinecap="round" />
      </g>
      <g data-np="brute-body">
        <path d="M-70 -80 Q-84 -190 -10 -206 Q66 -200 64 -80 Z" fill="#8a4a3a" stroke={INK} strokeWidth={5} />
        <rect x={-66} y={-100} width={130} height={20} fill="#3a2a1a" stroke={INK} strokeWidth={4} />
        <rect x={-14} y={-102} width={24} height={24} fill="#ffd166" stroke={INK} strokeWidth={3} />
        <path d="M-50 -190 Q-60 -250 -10 -256 Q34 -250 30 -196 Z" fill="#8a8a9a" stroke={INK} strokeWidth={5} />
        <path d="M-60 -214 L-80 -240 L-54 -228 M24 -214 L40 -244 L18 -230" fill="#e8e0c8" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
        <rect x={-52} y={-226} width={42} height={10} fill={INK} />
        <circle cx={-40} cy={-221} r={4} fill="#ff4a3d" />
        <path d="M-58 -150 Q-90 -110 -96 -86" stroke="#8a4a3a" strokeWidth={26} strokeLinecap="round" fill="none" />
        <g data-np="hammer">
          <rect x={-8} y={-190} width={16} height={150} rx={6} fill="#6a4a2a" stroke={INK} strokeWidth={4} />
          <rect x={-46} y={-230} width={92} height={56} rx={10} fill="#7a8a9a" stroke={INK} strokeWidth={5} />
          <path d="M-46 -214 H46" stroke="#4a5a6a" strokeWidth={5} />
        </g>
        <g data-np="stars" opacity={0}>
          {[0, 1, 2].map((i) => (
            <path key={i} d="M0 -9 L3 -3 L9 -3 L4 1 L6 8 L0 4 L-6 8 L-4 1 L-9 -3 L-3 -3 Z" fill="#ffd34d" stroke={INK} strokeWidth={2} transform={`translate(${-20 + 30 * Math.cos((i * 2 * Math.PI) / 3)} ${-280 + 10 * Math.sin((i * 2 * Math.PI) / 3)})`} />
          ))}
        </g>
      </g>
    </g>
  )
}

export const projects: SetPiece = {
  script: [1500, 2000, 1500],
  sky: ['#2a3a6a', '#c88a5a'],
  art: () => (
    <>
      <g data-np="quake">
        <Arena />
        <path data-np="cracks" d={`M${SLAM_AT} ${FLOOR + 4} l-40 10 l-30 -6 l-40 14 M${SLAM_AT} ${FLOOR + 4} l36 12 l30 -8 l46 16 M${SLAM_AT} ${FLOOR + 4} l-6 22 l10 18`} fill="none" stroke="#5a3a1a" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" opacity={0} />
      </g>
      <g data-np="brute">
        <HammerGuard />
      </g>
      <g data-np="token" opacity={0}>
        <Glow r={40} color="#ffd34d" />
        <circle r={14} fill="#fff2a8" stroke="#c88a1a" strokeWidth={4} />
        <path d="M0 -8 L2 -2 L8 -2 L3 2 L5 8 L0 4 L-5 8 L-3 2 L-8 -2 L-2 -2 Z" fill="#c88a1a" />
      </g>
      <g data-np="power" opacity={0}>
        <Glow r={120} color="#ffd34d" y={-90} />
      </g>
      <Hero />
      <Guardian />
      <Puffs name="dust" color="#e8d0a0" n={6} />
      <Puffs name="thud" color="#e8d0a0" n={4} />
    </>
  ),
  bind: (root) => {
    const pose = heroOf(root)
    const guard = guardOf(root)
    const quake = part(root, 'quake')
    const body = part(root, 'brute')
    const torso = part(root, 'brute-body')
    const legs = part(root, 'brute-legs')
    const hammer = part(root, 'hammer')
    const stars = part(root, 'stars')
    const token = part(root, 'token')
    const power = part(root, 'power')
    const cracks = part(root, 'cracks')
    return (u) => {
      const g = guardAt(u)
      // he faces left, toward him; sitting, his hips drop to the floor and his legs stick out in front
      transformTo(body, `translate(${g.x.toFixed(1)} ${g.y.toFixed(1)})`)
      transformTo(torso, `translate(0 ${(70 * g.sit).toFixed(1)}) rotate(${(g.lean + 8 * g.sit).toFixed(1)} 0 -80)`)
      transformTo(legs, `translate(0 ${(70 * g.sit).toFixed(1)}) rotate(${(80 * g.sit).toFixed(1)} -10 -80)`)
      // the hammer, turned at his grip: up for the leap, then down and stuck in the floor
      transformTo(hammer, `rotate(${hammerAt(u).toFixed(1)} -84 -96)`)
      fadeTo(stars, ramp(u, 2.25, 2.4))
      transformTo(stars, `rotate(${(u * 160).toFixed(1)} -20 -280)`)
      const slam = bell(u, 0.58, 0.75) + bell(u, 1.1, 1.22) + bell(u, 2.82, 2.98) * 1.6
      transformTo(quake, `translate(0 ${(5 * slam * Math.sin(u * 80)).toFixed(1)})`)
      puffsTo(root, 'thud', g.x, FLOOR, ramp(u, 0.58, 0.95), 90, 4)

      // the token drops from him, lies glowing, and goes into him
      const fall = ramp(u, 2.1, 2.3)
      const taken = ramp(u, 2.42, 2.5)
      fadeTo(token, fall > 0 ? 1 - taken : 0)
      placeTo(token, lerp(GUARD_SIT - 40, TOKEN.x, fall), lerp(FLOOR - 160, TOKEN.y, fall) - 40 * Math.sin(Math.PI * fall))

      const at = heroAt(u)
      pose(at)
      fadeTo(power, bell(u, 2.45, 2.8))
      placeTo(power, at.x, at.y)
      fadeTo(cracks, ramp(u, 2.82, 2.9))
      puffsTo(root, 'dust', SLAM_AT, FLOOR, ramp(u, 2.83, 3), 110, 6)
      const [gx, gy] = shoulder(at.x, at.y, at.s, 1)
      guard(gx, gy, u)
    }
  },
}
