import { mix } from '@/lib/motion/rigPose'
import type { Profession } from '@/lib/cv/professions'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, lerp, transformTo } from '../../shared/stageNodes'
import { SHADE } from '../palette'
import { runFrame, type Frame, type Place } from '../place'
import { DUCK, rest } from '../pose'

// Services, the ambush turned back: on the hostiles' ground a burning wheel is rolled down at him by hands
// never seen (research notes L53, [2] [5]), and from the dark across the way darts fly at him; he leads them back
// under two crushers built into the path, where they die in their own traps (L61 to L65, [2] [9] [1]). They
// flee when seen (L110), so only their wheel, their darts and the traps show. He drops flat in a hollow as
// the wheel bounds over him; he runs back the way he came under the open crushers, darts striking at his
// heels; he stops past the second and stands still, and behind him both crushers slam shut on the dark.

const CRUSHERS = [400, 450] as const
const HOLLOW = [500, 560] as const
const DUCK_AT = 530
const STOP = 340
const DIP = 14
const OPEN = -220
// Where each dart strikes the ground at his heels as he runs back, and when.
const DARTS = [
  { x: 520, at: 0.44 },
  { x: 470, at: 0.52 },
  { x: 425, at: 0.6 },
] as const
const SLAM = 0.8

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
  return { pose: rest(profession), ahead: STOP, lift: 0, over: 0, back: true }
}

/** The wheel's centre at t: bounding in from the right, over him in the hollow, and away left. */
function wheelAt(t: number): { x: number; y: number; on: number } {
  const u = ramp(t, 0.16, 0.34)
  const x = lerp(1000, -300, u)
  const bounce = Math.abs(Math.sin(u * Math.PI * 3))
  return { x, y: -34 - 150 * bounce, on: u > 0 && u < 1 ? 1 : 0 }
}

export const services: Place = {
  region: 'forest',
  length: STOP,
  script: [1600, 1700, 1500],
  ends: [0.34, 0.7, 1],
  gaps: [HOLLOW],
  obstacle: () => (
    <>
      <rect x={HOLLOW[0]} y={DIP} width={HOLLOW[1] - HOLLOW[0]} height={400} fill={SHADE.black} />
      {CRUSHERS.map((x, i) => (
        <g key={x}>
          {/* the crusher's frame from the dark above, and its block hung open over the path */}
          <path d={`M${x - 26} -900 V${OPEN - 30} M${x + 26} -900 V${OPEN - 30}`} stroke={SHADE.black} strokeWidth={5} />
          <g data-fx={`crusher-${i}`}>
            <rect x={x - 22} y={-900} width={44} height={900 + OPEN} fill={SHADE.black} />
            <path d={`M${x - 22} ${OPEN} l6 10 l6 -10 l6 10 l6 -10 l6 10 l6 -10 l6 10 Z`} fill={SHADE.black} />
          </g>
        </g>
      ))}
      <g data-fx="wheel" opacity="0">
        <circle r={34} fill="none" stroke={SHADE.black} strokeWidth={10} />
        <circle r={40} fill="none" stroke={SHADE.ember} strokeOpacity={0.55} strokeWidth={6} />
        <path d="M-30 -14 q8 -24 0 -38 M12 -30 q14 -18 6 -34" stroke={SHADE.ember} strokeOpacity={0.6} strokeWidth={4} fill="none" />
      </g>
      {DARTS.map(({ x }, i) => (
        <path key={x} data-fx={`dart-${i}`} d={`M${x} 0 l18 -26 l2 2 l-18 26 Z`} fill={SHADE.black} opacity="0" />
      ))}
    </>
  ),
  move,
  reply: (stage) => {
    const crushers = CRUSHERS.map((_, i) => fx(stage, `crusher-${i}`))
    const wheel = fx(stage, 'wheel')
    const darts = DARTS.map((_, i) => fx(stage, `dart-${i}`))
    return (t) => {
      const { x, y, on } = wheelAt(t)
      transformTo(wheel, `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(-x * 0.9).toFixed(1)})`)
      fadeTo(wheel, on)
      DARTS.forEach(({ at }, i) => {
        const fly = ramp(t, at - 0.04, at)
        transformTo(darts[i], `translate(${(200 * (1 - fly)).toFixed(1)} ${(-120 * (1 - fly)).toFixed(1)})`)
        fadeTo(darts[i], ramp(t, at - 0.04, at - 0.035))
      })
      // both crushers slam shut on the dark behind him, one after the other
      crushers.forEach((node, i) => transformTo(node, `translate(0 ${(-OPEN * ramp(t, SLAM + i * 0.03, SLAM + i * 0.03 + 0.025)).toFixed(1)})`))
    }
  },
}
