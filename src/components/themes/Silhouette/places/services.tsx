import { mix } from '@/lib/motion/rigPose'
import type { Profession } from '@/lib/cv/professions'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, lerp, transformTo } from '../../shared/stageNodes'
import { Boy, BOY_STAND, bindBoy, boyRun, type BoyFrame, type Weapon } from '../children'
import { SHADE, type Light } from '../palette'
import { runFrame, type Frame, type Place } from '../place'
import { DUCK, rest } from '../pose'
import type { Side } from '../forest'

// Services, the ambush turned back: the hostile boys' ground (research notes L51 to L65, [2] [5] [9] [1]).
// Three boys of our own stand on a rise ahead of him, one with a spear, two with blowpipes raised. The one
// with the spear rolls a burning wheel down at him; he drops flat in a hollow and it bounds over him. Then the
// blowpipes come up and darts strike the ground at his heels as he runs back the way he came, under the two
// crushers built into the path, and the boys jump down and run after him; he stops past the second crusher
// and turns, and both crushers slam shut on them: they are gone under the slam, nothing shown, killed by
// their own trap (L63 to L65), and the darts stop. The camera looks ahead past him while the boys are on
// their rise, so on a phone too the wheel, the boys and he share the frame.

const STOP = 300
const CRUSHERS = [370, 465] as const
const HOLLOW = [530, 590] as const
const DUCK_AT = 560
const DIP = 14
const OPEN = -240
const BLOCK = 33
const RIDGE = { from: 630, h: 50 }
// How far the camera looks past him at t on each side: on the right the whole way ahead while the wheel and
// the boys come; on the left as far while the wheel comes, then less, since he already holds near the edge
// and the boys chase him toward it.
const LOOK_AHEAD: Record<Side, (t: number) => number> = {
  right: (t) => 280 * (ramp(t, 0.04, 0.14) - ramp(t, 0.6, 0.8)),
  left: (t) => 280 * ramp(t, 0.04, 0.14) - 130 * ramp(t, 0.34, 0.6) - 150 * ramp(t, 0.6, 0.8),
}

interface Hunter {
  weapon: Weapon
  /** Where he stands on the rise, and where the crusher takes him. */
  at: number
  ends: number
  /** When he jumps down and runs. */
  runs: number
}

const BOYS: readonly Hunter[] = [
  { weapon: 'spear', at: 665, ends: CRUSHERS[0] + 4, runs: 0.4 },
  { weapon: 'pipe', at: 708, ends: CRUSHERS[1] - 8, runs: 0.5 },
  { weapon: 'pipe', at: 750, ends: CRUSHERS[1] + 14, runs: 0.54 },
]
const ARRIVE = 0.8
const SLAM = [0.8, 0.82] as const
// Each dart: which blowpipe shoots it, when, and where it strikes the ground at his heels.
const DARTS = [
  { boy: 1, at: 0.48, x: 520 },
  { boy: 2, at: 0.52, x: 455 },
  { boy: 1, at: 0.58, x: 395 },
] as const
const PIPE_TIP = { x: -72, y: -94 }

function move(profession: Profession, t: number): Frame {
  if (t < 0.34) {
    const run = ramp(t, 0, 0.18)
    if (run < 1) return runFrame(profession, 0, DUCK_AT, run)
    return { pose: mix(rest(profession), DUCK, ramp(t, 0.18, 0.22)), ahead: DUCK_AT, lift: -DIP * ramp(t, 0.18, 0.22), over: 0 }
  }
  const up = ramp(t, 0.34, 0.4)
  if (up < 1) return { pose: mix(DUCK, rest(profession), up), ahead: DUCK_AT, lift: -DIP * (1 - up), over: 0, back: up > 0.5 }
  const back = ramp(t, 0.4, 0.7)
  if (back < 1) return { ...runFrame(profession, DUCK_AT, STOP, back), back: true }
  // he stops and turns to face what he led back
  return { pose: rest(profession), ahead: STOP, lift: 0, over: 0, back: t < 0.86 }
}

/** The wheel's centre at t: rolled off the rise by the spear boy, bounding over him in the hollow, away left. */
function wheelAt(t: number): { x: number; y: number; on: number } {
  // down off the rise and over him as he lies in the hollow, then away left out of the frame
  const x = t < 0.26 ? lerp(BOYS[0].at - 40, DUCK_AT, ramp(t, 0.14, 0.26)) : lerp(DUCK_AT, -200, ramp(t, 0.26, 0.38))
  const off = x > RIDGE.from ? RIDGE.h : 0
  const bounce = x > RIDGE.from ? 0 : Math.abs(Math.sin(ramp(x, RIDGE.from, -200) * Math.PI * 4)) * 120 + 50 * Math.max(0, 1 - Math.abs(x - DUCK_AT) / 80)
  return { x, y: -36 - off - bounce, on: t > 0.12 && t < 0.38 ? 1 : 0 }
}

/** A blowpipe boy's raised aim: both hands up at the pipe at his mouth. */
const AIM: Omit<BoyFrame, 'x' | 'y' | 'facing' | 'shown'> = { ...BOY_STAND, armF: -125, foreF: -45, armB: -105, foreB: -60 }
/** The spear boy's shove of the wheel, both arms out low ahead of him. */
const SHOVE: Omit<BoyFrame, 'x' | 'y' | 'facing' | 'shown'> = { ...BOY_STAND, lean: 16, armF: -70, foreF: -10, armB: -60, foreB: -15, legB: 20 }

/** A boy's frame at t: on the rise, shoving or aiming, then down off it and running at him until the slam. */
function boyAt(boy: Hunter, index: number, t: number): BoyFrame {
  const run = ramp(t, boy.runs, ARRIVE)
  const x = lerp(boy.at, boy.ends, run)
  const y = -(x > RIDGE.from ? RIDGE.h : RIDGE.h * (1 - ramp(x, RIDGE.from - 30, RIDGE.from)))
  const gone = 1 - ramp(t, SLAM[index === 0 ? 0 : 1] + 0.02, SLAM[index === 0 ? 0 : 1] + 0.03)
  const still = boy.weapon === 'spear' ? mix2(BOY_STAND, SHOVE, ramp(t, 0.06, 0.12) - ramp(t, 0.18, 0.26)) : mix2(BOY_STAND, AIM, ramp(t, 0.36, 0.42))
  const pose = run > 0 && run < 1 ? runPose(boy, x) : still
  return { ...pose, x, y, facing: -1, shown: gone }
}

const mix2 = <T extends Record<string, number>>(a: T, b: T, u: number): T => Object.fromEntries(Object.keys(a).map((key) => [key, lerp(a[key], b[key], u)])) as T

/** A boy running: the spear held level at him, a blowpipe kept up at the mouth. */
const runPose = (boy: Hunter, x: number) => {
  const stride = boyRun(-x / 46)
  return boy.weapon === 'spear' ? { ...stride, armF: -55, foreF: -35 } : { ...stride, armF: -125, foreF: -45, armB: -105, foreB: -60 }
}

export const services: Place = {
  region: 'forest',
  length: STOP,
  script: [1600, 1700, 1500],
  ends: [0.34, 0.7, 1],
  gaps: [HOLLOW],
  lead: (t, { side }) => LOOK_AHEAD[side](t),
  obstacle: ({ light }: { light: Light }) => (
    <>
      <rect x={HOLLOW[0]} y={DIP} width={HOLLOW[1] - HOLLOW[0]} height={1000} fill={SHADE.black} />
      {/* their rise, with a stake fence and a skull of a lantern on a pole */}
      <path d={`M${RIDGE.from - 30} 2 L${RIDGE.from} ${-RIDGE.h} H1500 V400 H${RIDGE.from - 30} Z`} fill={SHADE.black} />
      <path d={`M${RIDGE.from + 160} ${-RIDGE.h} v-90 M${RIDGE.from + 176} ${-RIDGE.h} v-110 M${RIDGE.from + 192} ${-RIDGE.h} v-80`} stroke={SHADE.black} strokeWidth={6} strokeLinecap="round" />
      {BOYS.map(({ weapon }, i) => (
        <Boy key={i} name={`boy-${i}`} weapon={weapon} />
      ))}
      {CRUSHERS.map((x, i) => (
        <g key={x}>
          {/* the crusher's frame from the dark above, and its block hung open over the path */}
          <path d={`M${x - BLOCK - 6} -900 V${OPEN - 40} M${x + BLOCK + 6} -900 V${OPEN - 40}`} stroke={SHADE.black} strokeWidth={7} />
          <g data-fx={`crusher-${i}`}>
            <rect x={x - BLOCK} y={-900} width={BLOCK * 2} height={900 + OPEN} fill={SHADE.black} />
            <path d={`M${x - BLOCK} ${OPEN} ${Array.from({ length: 6 }, () => `l${(BLOCK * 2) / 12} 14 l${(BLOCK * 2) / 12} -14`).join(' ')} Z`} fill={SHADE.black} />
            <rect x={x - BLOCK} y={OPEN - 70} width={BLOCK * 2} height={3} fill={light.rim} opacity={0.25} />
          </g>
        </g>
      ))}
      {/* the burning wheel: a black tyre, its treads notched, pale flames streaming up off it */}
      <g data-fx="wheel" opacity="0">
        <circle r={60} fill={`url(#wheel-glow)`} />
        <defs>
          <radialGradient id="wheel-glow">
            <stop offset="0.4" stopColor={SHADE.glow} stopOpacity="0.5" />
            <stop offset="1" stopColor={SHADE.glow} stopOpacity="0" />
          </radialGradient>
        </defs>
        <g data-fx="flames" fill={SHADE.glow}>
          <path d="M-34 -6 Q-46 -40 -30 -74 Q-26 -44 -14 -30 Q-10 -58 4 -88 Q8 -50 20 -34 Q28 -58 38 -66 Q40 -30 30 -4 Z" opacity={0.9} />
          <path d="M-20 -20 Q-24 -44 -14 -56 Q-10 -36 -2 -28 Q4 -46 12 -58 Q14 -36 18 -20 Z" fill={SHADE.black} opacity={0.35} />
        </g>
        <path d="M0 -36 A36 36 0 1 0 0.1 -36 Z M0 -18 A18 18 0 1 1 -0.1 -18 Z" fill={SHADE.black} fillRule="evenodd" />
        <g data-fx="tread" fill={SHADE.black}>
          {Array.from({ length: 12 }, (_, i) => (
            <rect key={i} x={-4} y={-41} width={8} height={7} transform={`rotate(${i * 30})`} />
          ))}
        </g>
      </g>
      {DARTS.map(({ x }, i) => (
        <g key={x} data-fx={`dart-${i}`} opacity="0">
          <path d="M0 0 L-26 -3 L-26 1 Z M-26 -5 L-34 -1 L-26 3 Z" fill={SHADE.black} />
        </g>
      ))}
    </>
  ),
  move,
  reply: (stage) => {
    const crushers = CRUSHERS.map((_, i) => fx(stage, `crusher-${i}`))
    const wheel = fx(stage, 'wheel')
    const tread = fx(stage, 'tread')
    const darts = DARTS.map((_, i) => fx(stage, `dart-${i}`))
    const boys = BOYS.map((_, i) => bindBoy(stage, `boy-${i}`))
    return (t) => {
      const { x, y, on } = wheelAt(t)
      transformTo(wheel, `translate(${x.toFixed(1)} ${y.toFixed(1)})`)
      transformTo(tread, `rotate(${(-x * 0.9).toFixed(1)})`)
      fadeTo(wheel, on)
      const frames = BOYS.map((boy, i) => boyAt(boy, i, t))
      frames.forEach((frame, i) => boys[i](frame))
      DARTS.forEach(({ boy, at, x: lands }, i) => {
        // from the pipe's tip in a flat arc to the ground at his heels, where it stays stuck
        const from = { x: frames[boy].x + PIPE_TIP.x, y: frames[boy].y + PIPE_TIP.y }
        const fly = ramp(t, at - 0.05, at)
        const dx = lerp(from.x, lands, fly)
        const dy = lerp(from.y, -4, fly * fly)
        const angle = (Math.atan2(-from.y * 2 * fly, lands - from.x) * 180) / Math.PI
        transformTo(darts[i], `translate(${dx.toFixed(1)} ${dy.toFixed(1)}) rotate(${angle.toFixed(1)})`)
        fadeTo(darts[i], ramp(t, at - 0.05, at - 0.045))
      })
      // both crushers slam shut on the boys under them, one after the other
      crushers.forEach((node, i) => transformTo(node, `translate(0 ${(-OPEN * ramp(t, SLAM[i], SLAM[i] + 0.02)).toFixed(1)})`))
    }
  },
}
