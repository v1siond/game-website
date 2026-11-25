import { mix } from '@/lib/motion/rigPose'
import type { Profession } from '@/lib/cv/professions'
import { ramp } from '@/lib/scroll/stage'
import { fx, lerp, transformTo } from '../../shared/stageNodes'
import { SHADE, type Light } from '../palette'
import { arc, runFrame, type Frame, type Place } from '../place'
import { CROUCH, HANG, TUCK, rest } from '../pose'

// Beat 4, the lake at the forest's end: open water where the ground stops, a rope hanging from a bough over
// it. He runs and jumps for the rope and catches it; he swings out over the water and back and out again;
// he lets go at the top of the swing and lands on the far bank, and the rope swings on empty behind him.

const WATER = [330, 590] as const
const PIVOT = { x: 460, y: -360 }
const ROPE = 220
const GRAB = 0
// The rope's swing over the middle action, in degrees off straight down: out, back, out further.
const SWING = [GRAB, 34, -22, 42] as const
const LAND = 650
const SURFACE = 34

/** Where the rope's end hangs at `deg` off straight down. */
const ropeEnd = (deg: number) => {
  const a = (deg * Math.PI) / 180
  return { x: PIVOT.x + ROPE * Math.sin(a), y: PIVOT.y + ROPE * Math.cos(a) }
}

/** The swing's angle `u` of the way through the middle action: eased from one end of the swing to the next. */
function swingAt(u: number): number {
  const legs = SWING.length - 1
  const at = Math.min(legs - 1, Math.floor(u * legs))
  const v = u * legs - at
  return lerp(SWING[at], SWING[at + 1], (1 - Math.cos(Math.PI * v)) / 2)
}

/** His feet hang this far below the rope's end, his hands on it. */
const HANDS = 100

function move(profession: Profession, t: number, length: number): Frame {
  const grab = ropeEnd(GRAB)
  if (t < 0.3) {
    const run = ramp(t, 0, 0.18)
    if (run < 1) return runFrame(profession, 0, grab.x - 120, run)
    const u = ramp(t, 0.18, 0.3)
    return { pose: mix(TUCK, HANG, u), ahead: lerp(grab.x - 120, grab.x, u), lift: arc(u, 40, -(grab.y + HANDS)), over: 0 }
  }
  if (t < 0.7) {
    const end = ropeEnd(swingAt(ramp(t, 0.3, 0.7)))
    return { pose: HANG, ahead: end.x, lift: -(end.y + HANDS), over: 0 }
  }
  const off = ropeEnd(SWING[SWING.length - 1])
  const fly = ramp(t, 0.7, 0.86)
  if (fly < 1) return { pose: mix(HANG, TUCK, ramp(fly, 0, 0.4)), ahead: lerp(off.x, LAND, fly), lift: -(off.y + HANDS) * (1 - fly) + arc(fly, 50), over: 0 }
  const settle = ramp(t, 0.86, 0.9)
  if (settle < 1) return { pose: mix(CROUCH, rest(profession), settle), ahead: LAND, lift: 0, over: 0 }
  return runFrame(profession, LAND, length, ramp(t, 0.9, 1))
}

export const tech: Place = {
  region: 'forest',
  length: 700,
  script: [1500, 2000, 1400],
  ends: [0.3, 0.7, 1],
  gaps: [WATER],
  obstacle: ({ light }: { light: Light }) => (
    <>
      {/* the water: a dark grey sheet a step below the bank, a pale line on its surface */}
      <rect x={WATER[0]} y={SURFACE} width={WATER[1] - WATER[0]} height={400} fill={light.mid} />
      <line x1={WATER[0]} y1={SURFACE} x2={WATER[1]} y2={SURFACE} stroke={light.rim} strokeOpacity={0.45} strokeWidth={2} />
      <path d={`M${WATER[0] + 60} ${SURFACE + 12} h70 M${WATER[0] + 220} ${SURFACE + 20} h50 M${WATER[0] + 320} ${SURFACE + 10} h40`} stroke={light.rim} strokeOpacity={0.2} strokeWidth={2} />
      {/* the bough the rope hangs from, out of the top of the frame */}
      <path d={`M${PIVOT.x - 260} ${PIVOT.y - 300} Q${PIVOT.x - 120} ${PIVOT.y - 40} ${PIVOT.x + 60} ${PIVOT.y - 14} L${PIVOT.x + 60} ${PIVOT.y + 8} Q${PIVOT.x - 140} ${PIVOT.y - 10} ${PIVOT.x - 290} ${PIVOT.y - 260} Z`} fill={SHADE.black} />
      <g data-fx="rope">
        <line x1={PIVOT.x} y1={PIVOT.y} x2={PIVOT.x} y2={PIVOT.y + ROPE} stroke={SHADE.black} strokeWidth={4} />
      </g>
    </>
  ),
  move,
  reply: (stage) => {
    const rope = fx(stage, 'rope')
    return (t) => {
      // carried by his swing, then swinging on empty after he lets go, slower each time
      const deg = t < 0.3 ? 0 : t < 0.7 ? swingAt(ramp(t, 0.3, 0.7)) : SWING[SWING.length - 1] * Math.cos(ramp(t, 0.7, 1) * Math.PI * 1.5) * (1 - 0.6 * ramp(t, 0.7, 1))
      // SVG turns clockwise for a positive angle, which swings a hanging rope's end to the left
      transformTo(rope, `rotate(${(-deg).toFixed(1)} ${PIVOT.x} ${PIVOT.y})`)
    }
  },
}
