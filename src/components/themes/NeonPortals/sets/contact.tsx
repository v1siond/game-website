import { ramp } from '@/lib/scroll/stage'
import { bell, fadeTo, lerp, transformTo } from '../../shared/stageNodes'
import { sideOn, THREE_QUARTER } from '../motion'
import { dance, READY, run as sideRun } from '../sidePose'
import { INK, PortalRing } from './cast'
import { Glow, Guardian, guardOf, Hero, heroOf, part, placeTo, Puffs, puffsTo, shoulder, type HeroAt, type SetPiece } from './kit'

// Contact, the ending (research notes: with every core back the machine implodes and traps the villains,
// shrunk to infants, in a prison outside of time; the hub's save screen [1] [45]; his victory dance, C44 r4):
// the machine's hub, its ring of portals going dark one by one, and the save monitor glowing. 1 escape: the
// passage collapses behind him and he outruns it into the hub. 2 dance: at the save monitor he does his
// victory dance as the screen saves his run, while the villains, babies now in a floating bubble, bicker and
// drift away. The end frame: him mid dance at the save monitor, the bubble drifting off.

const FLOOR = 400
const MOUTH = { x: 40, y: FLOOR }
const START = 60
const STOP = 300
const MONITOR = { x: 450, y: FLOOR }
const PORTALS = [
  [120, 120],
  [220, 70],
  [330, 52],
  [440, 70],
  [540, 120],
] as const
const BUBBLE_FROM = { x: 70, y: 260 }
const BUBBLE_TO = { x: 560, y: 70 }

/** His frame at `u`. */
function heroAt(u: number): HeroAt {
  if (u < 1) {
    const go = ramp(u, 0.05, 0.85)
    return { x: lerp(START, STOP, go), y: FLOOR, move: sideOn(go < 1 ? sideRun(u * 7) : READY, 1) }
  }
  const t = ramp(u, 1.05, 2)
  // four swings of the dance, ending on a swing's height; he turns three quarters to the camera to dance
  return { x: STOP, y: FLOOR, move: sideOn(dance(4 * t + 0.5 * ramp(u, 1.05, 1.2)), lerp(1, -THREE_QUARTER, ramp(u, 1.05, 1.2)), -10 * Math.abs(Math.sin(Math.PI * 4 * t))) }
}

function Hub() {
  return (
    <>
      <path d="M-1500 -400 H2100 V330 H-1500 Z" fill="#0d0828" />
      <path d="M-1500 330 Q320 -60 2100 330" fill="#140c36" />
      {PORTALS.map(([x, y], i) => (
        <g key={x} transform={`translate(${x} ${y})`}>
          <PortalRing r={34} color={i % 2 ? '#b88cff' : '#5cf2ff'} name={`portal-${i}`} />
        </g>
      ))}
      <ellipse cx={320} cy={410} rx={420} ry={80} fill="#1e1450" />
      <ellipse cx={320} cy={410} rx={300} ry={54} fill="none" stroke="#5cf2ff" strokeWidth={4} opacity={0.6} />
      <path d="M-1500 470 Q320 500 2100 470 V2000 H-1500 Z" fill="#120a30" />
      {/* the passage's mouth at the left, which caves in behind him */}
      <g transform={`translate(${MOUTH.x} ${MOUTH.y})`}>
        <path d="M-120 0 V-170 Q-120 -250 -30 -250 Q60 -250 60 -170 V0 Z" fill="#05020f" />
        <g data-np="mouth-light">
          <path d="M-120 0 V-170 Q-120 -250 -30 -250 Q60 -250 60 -170 V0" fill="none" stroke="#5cf2ff" strokeWidth={8} />
        </g>
        <g data-np="cave" opacity={0}>
          <Glow r={120} y={-120} x={-30} color="#e8fbff" />
        </g>
        {[0, 1, 2, 3].map((i) => (
          <path key={i} data-np={`rock-${i}`} d="M-16 -10 L10 -18 L18 4 L-4 14 Z" fill="#3a2a5a" stroke={INK} strokeWidth={3} opacity={0} />
        ))}
      </g>
    </>
  )
}

function Monitor() {
  return (
    <g>
      <rect x={-14} y={-90} width={28} height={90} fill="#2a2250" stroke={INK} strokeWidth={4} />
      <rect x={-50} y={-6} width={100} height={10} rx={4} fill="#2a2250" stroke={INK} strokeWidth={3} />
      <Glow r={110} y={-150} color="#5cf2ff" strength={0.7} />
      <rect x={-80} y={-210} width={160} height={124} rx={16} fill="#1a1440" stroke="#5cf2ff" strokeWidth={6} />
      <rect x={-64} y={-194} width={128} height={92} rx={8} fill="#0a2a3a" />
      <rect x={-48} y={-140} width={96} height={16} rx={4} fill="none" stroke="#5cf2ff" strokeWidth={3} />
      <rect data-np="bar" x={-45} y={-137} width={90} height={10} rx={2} fill="#5cf2ff" />
      <g data-np="tick" opacity={0}>
        <path d="M-14 -170 L-4 -160 L16 -182" fill="none" stroke="#b6ff5c" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </g>
  )
}

/** The villains as babies in their bubble: the clockmaker with his white tuft and goggles on his brow, and
 *  the storm as a little cloud with a dummy; `data-np` baby-a and baby-b jostle. */
function Bubble() {
  return (
    <g>
      <circle r={70} fill="#c9f6ff" opacity={0.18} stroke="#e8fbff" strokeWidth={4} />
      <path d="M-40 -40 Q-20 -58 6 -60" fill="none" stroke="#fff" strokeWidth={6} strokeLinecap="round" opacity={0.7} />
      <g data-np="baby-a">
        <ellipse cx={-22} cy={18} rx={20} ry={18} fill="#f4f0ff" stroke={INK} strokeWidth={3} />
        <circle cx={-22} cy={-12} r={20} fill="#f0c8a0" stroke={INK} strokeWidth={3} />
        <path d="M-36 -28 C-44 -44 -30 -46 -26 -32 C-24 -48 -10 -44 -14 -30" fill="#f4f1ea" stroke={INK} strokeWidth={2} />
        <rect x={-36} y={-26} width={28} height={8} rx={4} fill="#ffd34d" stroke={INK} strokeWidth={2} />
        <circle cx={-28} cy={-10} r={2.5} fill={INK} />
        <circle cx={-16} cy={-10} r={2.5} fill={INK} />
        <path d="M-28 0 Q-22 -4 -16 0" fill="none" stroke={INK} strokeWidth={2.5} />
      </g>
      <g data-np="baby-b">
        <path d="M6 10 C-4 6 -2 -12 10 -12 C12 -26 32 -28 36 -14 C50 -14 52 6 40 10 C40 22 12 24 6 10 Z" fill="#5a3a9a" stroke="#b18cff" strokeWidth={3} />
        <circle cx={18} cy={-4} r={3} fill="#ffe14d" />
        <circle cx={32} cy={-4} r={3} fill="#ffe14d" />
        <circle cx={25} cy={8} r={6} fill="#ff8ac8" stroke={INK} strokeWidth={2} />
      </g>
      <path data-np="squabble" d="M-6 -36 l6 -8 l4 8 l6 -8 l4 8" fill="none" stroke="#ff4a3d" strokeWidth={3} strokeLinejoin="round" />
    </g>
  )
}

export const contact: SetPiece = {
  script: [1500, 2200],
  sky: ['#05020f', '#140a30'],
  art: () => (
    <>
      <Hub />
      <g transform={`translate(${MONITOR.x} ${MONITOR.y})`}>
        <Monitor />
      </g>
      <Hero />
      <Guardian />
      <g data-np="bubble">
        <Bubble />
      </g>
      <Puffs name="dust" color="#8a7aaa" n={5} />
    </>
  ),
  bind: (root) => {
    const pose = heroOf(root)
    const guard = guardOf(root)
    const mouthLight = part(root, 'mouth-light')
    const cave = part(root, 'cave')
    const bar = part(root, 'bar')
    const tick = part(root, 'tick')
    const bubble = part(root, 'bubble')
    const babyA = part(root, 'baby-a')
    const babyB = part(root, 'baby-b')
    const squabble = part(root, 'squabble')
    const portals = PORTALS.map((_, i) => part(root, `portal-${i}`))
    const rocks = [0, 1, 2, 3].map((i) => part(root, `rock-${i}`))
    return (u) => {
      // 1 the passage caves in: its light flickers out, a flash, rocks falling into its mouth, dust after him
      fadeTo(mouthLight, u < 0.15 ? 1 : (1 - ramp(u, 0.15, 0.5)) * (0.6 + 0.4 * Math.abs(Math.sin(u * 40))))
      fadeTo(cave, bell(u, 0.1, 0.6))
      rocks.forEach((rock, i) => {
        const fall = ramp(u, 0.15 + i * 0.08, 0.45 + i * 0.08)
        fadeTo(rock, fall > 0 ? 1 : 0)
        placeTo(rock, -90 + i * 40, lerp(-250, -16 - (i % 2) * 18, fall), 1.2, 140 * fall)
      })
      puffsTo(root, 'dust', MOUTH.x + 40, FLOOR, ramp(u, 0.2, 0.8), 90)
      // the hub's portals go dark one by one, the machine winding down
      portals.forEach((portal, i) => fadeTo(portal, 1 - ramp(u, 0.2 + i * 0.12, 0.4 + i * 0.12) * 0.9))

      // 2 the screen saves his run: the bar fills and the tick lights
      transformTo(bar, `translate(-45 0) scale(${ramp(u, 1.1, 1.8).toFixed(3)} 1) translate(45 0)`)
      fadeTo(tick, ramp(u, 1.8, 1.9))

      // the babies' bubble floats out of the caved passage and away, the two of them bickering inside
      const drift = ramp(u, 0.5, 2)
      placeTo(bubble, lerp(BUBBLE_FROM.x, BUBBLE_TO.x, drift), lerp(BUBBLE_FROM.y, BUBBLE_TO.y, drift) - 20 * Math.sin(Math.PI * drift), lerp(0.6, 0.85, ramp(u, 0.5, 0.8)))
      fadeTo(bubble, ramp(u, 0.45, 0.6))
      transformTo(babyA, `rotate(${(10 * Math.sin(u * 13)).toFixed(1)} -22 10)`)
      transformTo(babyB, `rotate(${(-12 * Math.sin(u * 11 + 1)).toFixed(1)} 25 0)`)
      fadeTo(squabble, Math.abs(Math.sin(u * 9)))

      const at = heroAt(u)
      pose(at)
      const [gx, gy] = shoulder(at.x, at.y, at.s, 1)
      guard(gx, gy - 10 * bell(u, 1.1, 2), u)
    }
  },
}
