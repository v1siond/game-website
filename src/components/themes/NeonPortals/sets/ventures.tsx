import { ramp } from '@/lib/scroll/stage'
import { bell, fadeTo, lerp, r1, transformTo } from '../../shared/stageNodes'
import { sideOn, spinning, YAW, type Move } from '../motion'
import { AIR, land, READY, run as sideRun } from '../sidePose'
import { seeded } from '../world'
import { Bob, INK, PendulumMan } from './cast'
import { Glow, Guardian, guardOf, Hero, heroOf, Hourglass, part, placeTo, shoulder, type SetPiece } from './kit'

// Ventures, the third room's boss (research notes: the time traveller stands on platforms that rise and fall
// at random, fires a guided missile and red beams to double jump; when he tires the path appears and the
// hero spins him; three hits win the tornado spin, which also glides [5]; footage f43): the top of a clock
// tower over a drop in the dark, the pendulum man of our own on the far ledge, stone platforms floating
// between. Side on, the fight going across the drop. 1 the platforms rise and fall; the pendulum man swings
// his staff and its weight flies at him; he double jumps it, the double jump he won from the furnace brute.
// 2 the platforms line up into a path; he runs across and spins into the pendulum man, a turn round in
// depth, and the pendulum man drops his staff and falls to his knees. 3 a core rises out of him; he takes it,
// the tornado spin, and spins up and glides back over the drop as the platforms fall away. The end frame:
// him landed on the near ledge facing the pendulum man, who kneels on the far ledge, his staff dropped.

const LEDGE = { near: 170, far: 470, y: 400, farY: 380 }
const PLATFORMS = [218, 302, 386] as const
const PLATFORM_W = 72
const MAN = { x: 525, y: LEDGE.farY }
const START = 130
const STOP = 436
// Where the weight leaves his hand, and where it passes under him.
const HAND = { x: MAN.x - 30, y: MAN.y - 60 }
const UNDER = { x: START - 20, y: LEDGE.y - 30 }

const stars = (() => {
  const rand = seeded(23)
  return Array.from({ length: 30 }, () => ({ x: -400 + rand() * 1400, y: -380 + rand() * 520, r: 1 + rand() * 2, o: 0.3 + rand() * 0.6 }))
})()

/** A platform's top at `u`: bobbing out of step, lined up into the path, falling away once he is back. */
function platformY(i: number, u: number): number {
  const bob = 46 * Math.sin(u * 3.2 + i * 2.1) * (1 - ramp(u, 1, 1.15))
  return LEDGE.y + bob + 340 * ramp(u, 2.4, 2.85) ** 2
}

/** His place at `u`: the double jump over the weight, the run across the path, the spin, the glide back. */
function heroAt(u: number): { x: number; y: number; move: Move } {
  if (u < 1) {
    const hops = 90 * bell(u, 0.38, 0.58) + 130 * bell(u, 0.56, 0.8)
    return { x: START, y: LEDGE.y - hops, move: sideOn(hops > 6 ? AIR : READY, YAW.right) }
  }
  if (u < 1.6) {
    const go = ramp(u, 1.15, 1.6)
    return { x: lerp(START, STOP, go), y: LEDGE.y, move: sideOn(go > 0 && go < 1 ? sideRun(u * 7) : READY, YAW.right) }
  }
  if (u < 2.45) {
    if (u < 1.85) return { x: STOP, y: LEDGE.y, move: spinning(ramp(u, 1.6, 1.85), 1, YAW.right, 10) }
    return { x: STOP, y: LEDGE.y, move: sideOn(READY, YAW.right) }
  }
  const glide = ramp(u, 2.45, 2.92)
  if (glide < 1) return { x: lerp(STOP, START, glide), y: LEDGE.y - 150 * Math.sin(Math.PI * glide), move: spinning(glide, 3, YAW.right, 0, AIR) }
  return { x: START, y: LEDGE.y, move: sideOn(land(ramp(u, 2.92, 3), READY), YAW.right) }
}

/** The weight's flight: out of his hand low across the drop, under his feet, and back up to the staff. */
function bobAt(u: number): { x: number; y: number; shown: number } {
  const out = ramp(u, 0.3, 0.68)
  const back = ramp(u, 0.68, 0.95)
  if (back <= 0) return { x: lerp(HAND.x, UNDER.x, out), y: lerp(HAND.y, UNDER.y, out) - 40 * Math.sin(Math.PI * out), shown: out > 0 ? 1 : 0 }
  return { x: lerp(UNDER.x, HAND.x, back), y: lerp(UNDER.y, HAND.y, back) - 120 * Math.sin(Math.PI * back), shown: back < 1 ? 1 : 0 }
}

function Tower() {
  return (
    <>
      {stars.map((star) => (
        <circle key={`${star.x}${star.y}`} cx={star.x} cy={star.y} r={star.r} fill="#e8fff8" opacity={star.o} />
      ))}
      {/* far gears turning in the dark */}
      <g data-np="gear-a" transform="translate(140 120)">
        <circle r={120} fill="none" stroke="#1d4a48" strokeWidth={26} strokeDasharray="22 16" />
        <circle r={60} fill="none" stroke="#1d4a48" strokeWidth={10} />
      </g>
      <g data-np="gear-b" transform="translate(470 60)">
        <circle r={80} fill="none" stroke="#1a3e3c" strokeWidth={20} strokeDasharray="18 14" />
      </g>
      {/* the drop: a dark shaft between the ledges */}
      <rect x={LEDGE.near} y={LEDGE.y} width={LEDGE.far - LEDGE.near} height={1600} fill="#040c10" />
      {/* the near ledge and the far one, stone with a teal rim */}
      <path d={`M-1500 ${LEDGE.y} H${LEDGE.near} V2000 H-1500 Z`} fill="#3a4a52" />
      <path d={`M-1500 ${LEDGE.y} H${LEDGE.near}`} stroke="#5ff0c8" strokeWidth={5} opacity={0.7} />
      <path d={`M${LEDGE.far} ${LEDGE.farY} H2100 V2000 H${LEDGE.far} Z`} fill="#34444c" />
      <path d={`M${LEDGE.far} ${LEDGE.farY} H2100`} stroke="#5ff0c8" strokeWidth={5} opacity={0.7} />
    </>
  )
}

function Platform() {
  return (
    <g>
      <path d={`M${-PLATFORM_W / 2} 0 H${PLATFORM_W / 2} L${PLATFORM_W / 2 - 12} 34 L0 52 L${-PLATFORM_W / 2 + 12} 34 Z`} fill="#4a5a62" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      <path d={`M${-PLATFORM_W / 2} 0 H${PLATFORM_W / 2}`} stroke="#5ff0c8" strokeWidth={5} />
    </g>
  )
}

export const ventures: SetPiece = {
  script: [1500, 1800, 1700],
  sky: ['#04141a', '#0e3034'],
  focus: 290,
  art: () => (
    <>
      <Tower />
      {PLATFORMS.map((x, i) => (
        <g key={x} data-np={`platform-${i}`}>
          <Platform />
        </g>
      ))}
      <g data-np="man">
        <PendulumMan />
      </g>
      <g data-np="bob" opacity={0}>
        <Bob />
      </g>
      <g data-np="hit" opacity={0}>
        <Glow r={60} color="#fff6c8" />
      </g>
      <g data-np="core" opacity={0}>
        <Hourglass size={0.8} />
      </g>
      <Hero />
      <Guardian />
    </>
  ),
  bind: (root) => {
    const pose = heroOf(root)
    const guard = guardOf(root)
    const man = part(root, 'man')
    const body = part(root, 'pend-body')
    const staff = part(root, 'pend-staff')
    const bob = part(root, 'bob')
    const hit = part(root, 'hit')
    const core = part(root, 'core')
    const gearA = part(root, 'gear-a')
    const gearB = part(root, 'gear-b')
    const platforms = PLATFORMS.map((_, i) => part(root, `platform-${i}`))
    return (u) => {
      transformTo(gearA, `translate(140 120) rotate(${r1(u * 40)})`)
      transformTo(gearB, `translate(470 60) rotate(${r1(-u * 60)})`)
      platforms.forEach((platform, i) => {
        placeTo(platform, PLATFORMS[i], platformY(i, u))
        fadeTo(platform, 1 - ramp(u, 2.6, 2.85))
      })

      // the pendulum man: the staff swung back and flung, held, then dropped as he falls to his knees
      const reel = bell(u, 1.75, 1.95)
      const kneel = ramp(u, 1.85, 2.05)
      transformTo(man, `translate(${r1(MAN.x + 14 * reel)} ${r1(MAN.y)})`)
      transformTo(body, `translate(0 ${r1(48 * kneel)}) rotate(${r1(14 * reel + 12 * kneel)} 0 -60)`)
      const swing = -40 * bell(u, 0.05, 0.3) + 30 * bell(u, 0.25, 0.4)
      transformTo(staff, kneel > 0 ? `translate(${r1(-30 * kneel)} ${r1(30 * kneel)}) rotate(${r1(-80 * kneel)} -30 -120)` : `rotate(${r1(swing)} -30 -120)`)
      fadeTo(hit, bell(u, 1.72, 1.95))
      placeTo(hit, STOP + 40, LEDGE.y - 110)

      const w = bobAt(u)
      fadeTo(bob, w.shown)
      placeTo(bob, w.x, w.y, 1, u * 400)

      // 3 the core rises out of him and goes into him: the tornado spin
      const rise = ramp(u, 2.05, 2.25)
      const take = ramp(u, 2.25, 2.42)
      fadeTo(core, rise > 0 && take < 1 ? 1 : 0)
      placeTo(core, lerp(MAN.x - 10, STOP, take), lerp(MAN.y - 120 - 60 * rise, LEDGE.y - 110, take))

      const at = heroAt(u)
      pose(at)
      const [sx, sy] = shoulder(at.x, at.y, 1, 1)
      guard(sx, sy, u)
    }
  },
}
