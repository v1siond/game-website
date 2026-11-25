import { ramp } from '@/lib/scroll/stage'
import { bell, fadeTo, lerp } from '../../shared/stageNodes'
import { CHEER, fromBehind, IDLE, mixPose, runPose, sideOn } from '../motion'
import { spin, spinTurns } from '../sidePose'
import { INK } from './cast'
import { along, Crate, Glow, Guardian, guardOf, Hero, heroOf, part, placeTo, Planks, throwPlanks, type HeroAt, type SetPiece } from './kit'
import { ROAD, streamVillage, Village } from './village'

// Ventures, the time trial (research notes: a floating stopwatch starts the clock, crates numbered 1, 2 and 3
// freeze it for that many seconds, and the time earns a relic tier [1] [43]): the village road of the first
// era again, a clock running in the sky. 1 start: he touches the stopwatch and the clock starts. 2 smash: he
// spins through the three numbered crates, the clock freezing 1, 2 and 3 seconds. 3 finish: he crosses the
// line and a trophy lights in the tier his time earned, gold. The end frame: him holding the trophy up, the
// frozen clock above.

const X = ROAD.vx
const FEET = ROAD.near
const WATCH_Z = 150
const CRATES = [330, 500, 670] as const
const LINE_Z = 900
// How far he has run: to the stopwatch, through the crates, over the line.
const travelAt = (u: number): number => WATCH_Z * ramp(u, 0, 0.6) + (CRATES[2] - WATCH_Z + 20) * ramp(u, 1, 2) + (LINE_Z - CRATES[2] - 20) * ramp(u, 2, 2.55)
// Where each crate meets him, in u.
const SMASH = [1.25, 1.55, 1.85] as const
// The clock's seconds at `u`: still until the watch is touched, then running, held as each crate freezes it.
const RUN_RATE = 9
const FREEZE = 0.16
const clockAt = (u: number): number => {
  const running = Math.max(0, Math.min(u, 2.55) - 0.6)
  const frozen = SMASH.reduce((sum, at, i) => sum + Math.max(0, Math.min(u, at + FREEZE * (i + 1)) - at), 0)
  return 7.2 + RUN_RATE * (running - frozen)
}
const frozenAt = (u: number): boolean => SMASH.some((at, i) => u >= at && u < at + FREEZE * (i + 1))

/** The clock's readout: minutes, seconds and hundredths. */
const readout = (seconds: number): string => {
  const whole = Math.floor(seconds)
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}.${String(Math.floor((seconds - whole) * 100)).padStart(2, '0')}`
}

/** His frame at `u`, the stride at `phase`. */
function heroAt(u: number, phase: number): HeroAt {
  if (u < 1) return { x: X, y: FEET, move: fromBehind(mixPose(runPose(phase), { ...IDLE, aR: -150, fR: -10, look: 0 }, bell(u, 0.5, 0.8))) }
  if (u < 2) {
    const hit = SMASH.findIndex((at) => u >= at - 0.1 && u < at + 0.12)
    if (hit < 0) return { x: X, y: FEET, move: fromBehind(runPose(phase)) }
    const t = ramp(u, SMASH[hit] - 0.1, SMASH[hit] + 0.12)
    return { x: X, y: FEET, move: sideOn(spin(t), Math.cos(2 * Math.PI * spinTurns(t)), -10 * bell(t, 0, 1)) }
  }
  if (u < 2.55) return { x: X, y: FEET, move: fromBehind(runPose(phase)) }
  return { x: X, y: FEET, move: fromBehind(mixPose(IDLE, CHEER, ramp(u, 2.6, 2.85))) }
}

function Stopwatch() {
  return (
    <g>
      <Glow r={50} color="#6cf0ff" />
      <rect x={-6} y={-46} width={12} height={10} rx={3} fill="#c0c8d0" stroke={INK} strokeWidth={3} />
      <circle r={34} fill="#e8f4ff" stroke={INK} strokeWidth={5} />
      <circle r={26} fill="none" stroke="#6cf0ff" strokeWidth={4} />
      <path d="M0 0 V-20 M0 0 L12 8" stroke={INK} strokeWidth={4} strokeLinecap="round" />
    </g>
  )
}

function Trophy() {
  return (
    <g>
      <Glow r={70} color="#ffd34d" y={-50} />
      <path d="M-30 -100 H30 Q30 -40 0 -36 Q-30 -40 -30 -100 Z" fill="#ffc83a" stroke={INK} strokeWidth={4} />
      <path d="M-30 -90 Q-52 -86 -44 -64 Q-38 -54 -24 -56 M30 -90 Q52 -86 44 -64 Q38 -54 24 -56" fill="none" stroke={INK} strokeWidth={5} />
      <rect x={-6} y={-38} width={12} height={20} fill="#e0a82a" stroke={INK} strokeWidth={3} />
      <rect x={-24} y={-20} width={48} height={18} rx={4} fill="#7a4cff" stroke={INK} strokeWidth={4} />
      <path d="M0 -84 L4 -74 L14 -74 L6 -68 L9 -58 L0 -64 L-9 -58 L-6 -68 L-14 -74 L-4 -74 Z" fill="#fff6c8" />
    </g>
  )
}

export const ventures: SetPiece = {
  script: [1200, 2000, 1500],
  sky: ['#78c8f0', '#ffe8c0'],
  art: () => (
    <>
      <Village />
      <g transform="translate(320 40)">
        <rect x={-132} y={-44} width={264} height={88} rx={16} fill="#120b26" stroke="#6cf0ff" strokeWidth={6} />
        <text data-np="clock" x={0} y={20} textAnchor="middle" fontSize={56} fontWeight={700} fontFamily="ui-monospace, monospace" fill="#6cf0ff">
          {readout(7.2)}
        </text>
      </g>
      <g data-np="line">
        <rect x={-320} y={-12} width={640} height={16} fill="#f4f4f4" stroke={INK} strokeWidth={3} />
        <rect x={-320} y={-12} width={640} height={8} fill="#1a1a22" opacity={0.6} />
      </g>
      {CRATES.map((_, i) => (
        <g key={i} data-np={`crate-${i}`}>
          <Crate w={70} mark={i + 1} />
        </g>
      ))}
      {CRATES.map((_, i) => (
        <Planks key={i} name={`plank-${i}`} w={70} />
      ))}
      <g data-np="watch">
        <Stopwatch />
      </g>
      <Hero />
      <g data-np="trophy" opacity={0}>
        <Trophy />
      </g>
      <Guardian />
    </>
  ),
  bind: (root) => {
    const pose = heroOf(root)
    const guard = guardOf(root)
    const clock = part(root, 'clock')
    const watch = part(root, 'watch')
    const line = part(root, 'line')
    const trophy = part(root, 'trophy')
    const crates = CRATES.map((_, i) => part(root, `crate-${i}`))
    let shown = ''
    return (u) => {
      const travel = travelAt(u)
      streamVillage(root, travel)

      // the clock, still, running, ice blue while a crate holds it, gold once over the line
      const text = readout(clockAt(u))
      if (clock && text !== shown) {
        shown = text
        clock.textContent = text
      }
      clock?.setAttribute('fill', u >= 2.55 ? '#ffd34d' : frozenAt(u) ? '#e8fbff' : '#6cf0ff')

      // 1 the stopwatch floats in the road and goes off as he touches it
      const w = along(WATCH_Z - travel, 40, ROAD)
      placeTo(watch, w.x, w.y - 120 * w.s + 6 * Math.sin(u * 6), w.s)
      fadeTo(watch, 1 - ramp(u, 0.6, 0.75))

      // 2 the crates come to him and break one by one
      CRATES.forEach((z, i) => {
        const c = along(z - travel, 0, ROAD)
        const broken = ramp(u, SMASH[i], SMASH[i] + 0.3)
        placeTo(crates[i], c.x, c.y, c.s)
        fadeTo(crates[i], u < SMASH[i] ? 1 : 0)
        throwPlanks(root, `plank-${i}`, c.x, c.y - 30 * c.s, broken, c.s)
      })

      // 3 the line, and the trophy rising into his raised gloves
      const l = along(LINE_Z - travel, 0, ROAD)
      placeTo(line, l.x, l.y, l.s)
      fadeTo(line, LINE_Z - travel > -50 ? 1 : 0)
      const at = heroAt(u, travel / 26)
      pose(at)
      const lift = ramp(u, 2.6, 2.85)
      fadeTo(trophy, ramp(u, 2.55, 2.65))
      placeTo(trophy, X, lerp(FEET - 60, FEET - 250, lift), 1.1)
      guard(X - 70, FEET - 186, u)
    }
  },
}
