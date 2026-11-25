import { mix } from '@/lib/motion/rigPose'
import { ramp } from '@/lib/scroll/stage'
import { bell, fadeTo, lerp, transformTo } from '../../shared/stageNodes'
import { sideOn } from '../motion'
import { AIR, land, READY, run as sideRun, spin, type SidePose } from '../sidePose'
import { Clockmaker, Spirit, Storm } from './cast'
import { Glow, Guardian, guardOf, Hero, heroOf, part, placeTo, shoulder, type HeroAt, type SetPiece } from './kit'

// Muay Thai, the last villain (Crash 3 notes, the final boss: the villain flanked by two clashing spirits whose
// beams cross over the floor, the hero spinning him into the central pit three times [7], the tornado spin
// [5]): the machine's core, a pit in the middle of a round floor. The clockmaker stands by it between the
// living storm and the firefly spirit, their beams crossing low over the floor. 1 leap: he double jumps the
// crossing beams. 2 tornado: he spins into a whirl and drives the clockmaker to the pit's edge. 3 knee: a
// flying knee, his own fighter's finish, knocks him into the pit. The end frame: the clockmaker falling into
// the pit, him landing in his fighter stance.

const FLOOR = 400
const PIT = { x: 230, y: 408, rx: 82, ry: 20 }
const CLOCK_FROM = 350
const CLOCK_EDGE = 318
const START = 580
const AFTER_LEAPS = 470
const WHIRL_TO = 400
const LAND_AT = 360
// Where the two beams meet over the floor: sweeping from the pit out toward him and back.
const meetAt = (u: number): number => 400 + 120 * Math.sin(u * 4.2)

/** The flying knee: up off the back leg, the near knee driven up and forward, the gloves on the head. */
const KNEE: SidePose = { ...READY, lean: -12, thighRight: -100, shinRight: 115, thighLeft: 20, shinLeft: 30, armRight: -110, foreRight: -70, armLeft: -95, foreLeft: -80, stretch: 0.06 }

/** His frame at `u`; he faces left, toward the pit. */
function heroAt(u: number): HeroAt {
  if (u < 1) {
    const x = lerp(START, AFTER_LEAPS, ramp(u, 0, 1))
    const hops = 90 * bell(u, 0.2, 0.5) + 120 * bell(u, 0.55, 0.9)
    return { x, y: FLOOR - hops, move: sideOn(hops > 8 ? AIR : sideRun(u * 6), -1) }
  }
  if (u < 2) {
    const t = ramp(u, 1.05, 1.95)
    return { x: lerp(AFTER_LEAPS, WHIRL_TO, t), y: FLOOR, move: sideOn({ ...spin(t), whirl: bell(t, 0, 1) }, -Math.cos(6 * Math.PI * t), -8 * bell(t, 0, 1)) }
  }
  const fly = ramp(u, 2.1, 2.45)
  if (u < 2.1) return { x: WHIRL_TO, y: FLOOR, move: sideOn(mix(READY, { ...READY, rise: 12, stretch: -0.12 }, ramp(u, 2, 2.1)), -1) }
  if (fly < 1) return { x: lerp(WHIRL_TO, LAND_AT, fly), y: FLOOR - 110 * Math.sin(Math.PI * Math.min(1, fly * 0.8 + 0.1)), move: sideOn(mix(AIR, KNEE, ramp(fly, 0, 0.5)), -1) }
  const down = ramp(u, 2.45, 2.62)
  return { x: LAND_AT, y: FLOOR - 40 * (1 - down), move: sideOn(down < 1 ? KNEE : land(ramp(u, 2.62, 3), READY), -1) }
}

/** The clockmaker at `u`: holding his place, driven to the edge, knocked over the pit and down into it. */
function clockAt(u: number): { x: number; y: number; s: number; turn: number; opacity: number } {
  if (u < 2.45) return { x: lerp(CLOCK_FROM, CLOCK_EDGE, ramp(u, 1.3, 1.95)), y: FLOOR, s: 1, turn: -8 * bell(u, 1.6, 2.1) + 6 * Math.sin(u * 20) * ramp(u, 1.95, 2.1), opacity: 1 }
  const out = ramp(u, 2.45, 2.7)
  const sink = ramp(u, 2.7, 3)
  // he goes in head first: at the end only his boots and coat tails stick up out of the pit's mouth
  return { x: lerp(CLOCK_EDGE, PIT.x, out), y: FLOOR - 60 * Math.sin(Math.PI * out) + 116 * sink, s: 1 - 0.2 * sink, turn: -140 * out - 40 * sink, opacity: 1 }
}

function Core() {
  return (
    <>
      <path d="M-1500 -400 H2100 V330 H-1500 Z" fill="#1a0a30" />
      {[-60, 60, 200, 440, 580, 700].map((x) => (
        <rect key={x} x={x - 16} y={-400} width={32} height={720} fill="#2a1446" stroke="#3a1e5e" strokeWidth={4} />
      ))}
      <g transform="translate(320 60)">
        <Glow r={140} color="#ff6bf2" strength={0.6} />
        <circle r={58} fill="none" stroke="#ff6bf2" strokeWidth={8} />
        <circle r={36} fill="#3a1450" stroke="#ffd34d" strokeWidth={5} />
        <path d="M0 0 V-26 M0 0 L18 10" stroke="#ffd34d" strokeWidth={5} strokeLinecap="round" />
      </g>
      <ellipse cx={320} cy={410} rx={420} ry={90} fill="#3a2a5a" />
      <ellipse cx={320} cy={410} rx={420} ry={90} fill="none" stroke="#ff6bf2" strokeWidth={5} opacity={0.7} />
      <path d="M-1500 470 Q320 520 2100 470 V2000 H-1500 Z" fill="#24163a" />
      <ellipse cx={PIT.x} cy={PIT.y} rx={PIT.rx + 10} ry={PIT.ry + 6} fill="#5a3a7a" />
      <ellipse cx={PIT.x} cy={PIT.y} rx={PIT.rx} ry={PIT.ry} fill="#06020e" />
    </>
  )
}

export const muayThai: SetPiece = {
  script: [1400, 1800, 1600],
  sky: ['#120624', '#2a0c3a'],
  art: () => (
    <>
      <Core />
      <g transform="translate(110 150) scale(0.7)">
        <Storm />
      </g>
      <g transform="translate(560 96) scale(0.55)">
        <Spirit />
      </g>
      <g data-np="beams">
        <path data-np="beam-a" fill="none" stroke="#b18cff" strokeWidth={10} strokeLinecap="round" />
        <path data-np="beam-b" fill="none" stroke="#ffe14d" strokeWidth={10} strokeLinecap="round" />
        <g data-np="clash">
          <Glow r={46} color="#ffffff" />
        </g>
      </g>
      {/* he can only fall into the pit: below the floor's line he shows inside the pit's mouth alone */}
      <clipPath id="np-pit">
        <path d={`M-1500 -1500 H2100 V${PIT.y} H-1500 Z`} />
        <ellipse cx={PIT.x} cy={PIT.y} rx={PIT.rx} ry={PIT.ry} />
      </clipPath>
      <g clipPath="url(#np-pit)">
        <g data-np="clock">
          <Clockmaker />
        </g>
      </g>
      <g data-np="impact" opacity={0}>
        <Glow r={60} color="#ffd34d" />
        <path d="M-30 -30 L30 30 M30 -30 L-30 30 M0 -40 V40 M-40 0 H40" stroke="#fff6c8" strokeWidth={6} strokeLinecap="round" />
      </g>
      <Hero />
      <Guardian />
    </>
  ),
  bind: (root) => {
    const pose = heroOf(root)
    const guard = guardOf(root)
    const clock = part(root, 'clock')
    const arm = part(root, 'clock-arm')
    const beams = part(root, 'beams')
    const beamA = part(root, 'beam-a')
    const beamB = part(root, 'beam-b')
    const clash = part(root, 'clash')
    const impact = part(root, 'impact')
    return (u) => {
      // the spirits' beams meet low over the floor, sweeping; they fade once he has the clockmaker
      const meet = meetAt(u)
      const low = FLOOR - 40
      beamA?.setAttribute('d', `M140 160 Q${(meet - 120).toFixed(0)} ${low - 60} ${meet.toFixed(0)} ${low}`)
      beamB?.setAttribute('d', `M545 110 Q${(meet + 90).toFixed(0)} ${low - 90} ${meet.toFixed(0)} ${low}`)
      placeTo(clash, meet, low, 0.8 + 0.3 * Math.sin(u * 30))
      fadeTo(beams, 1 - ramp(u, 1.9, 2.2))

      const c = clockAt(u)
      transformTo(clock, `translate(${c.x.toFixed(1)} ${c.y.toFixed(1)}) rotate(${c.turn.toFixed(1)} 0 -90) scale(${c.s.toFixed(3)})`)
      fadeTo(clock, c.opacity)
      transformTo(arm, `rotate(${(-30 * bell(u, 0.2, 1) - 50 * bell(u, 1.3, 2)).toFixed(1)} 12 -128)`)
      fadeTo(impact, bell(u, 2.38, 2.6))
      placeTo(impact, CLOCK_EDGE + 10, FLOOR - 120)

      const at = heroAt(u)
      pose(at)
      const [gx, gy] = shoulder(at.x, at.y, at.s, -1)
      guard(gx, gy, u)
    }
  },
}
