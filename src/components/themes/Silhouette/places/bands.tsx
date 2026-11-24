import { hop } from '@/lib/motion/arc'
import { mix } from '@/lib/motion/rigPose'
import { ramp } from '@/lib/scroll/stage'
import { fx, lerp, transformTo } from '../../shared/stageNodes'
import { FIGURE_H, gearPath } from '../forest'
import { SHADE, type Light } from '../palette'
import { AT, type Frame, type Place } from '../place'
import { CLIMB, CROUCH, HANG, rest, walk } from '../pose'

// Bands in the gear hall: a great gear turns slowly beside him, a gantry high on its far side. He jumps
// and takes hold of a tooth on its rising side; the gear carries him up and over its top, where he climbs
// onto it and steps off onto the gantry.

const GEAR = { x: 230, y: -150, r: 180 }
const GANTRY = { x: GEAR.x + 120, h: GEAR.r - GEAR.y }
// Where he takes hold, in degrees round the gear (180 its near side, 270 its top), and where he lets go.
const TAKE = 212
const TOP = 270
const STEP = 55
const rad = (deg: number): number => (deg * Math.PI) / 180

/** A point on the gear's rim at `deg`, from the obstacle's foot. */
const rimAt = (deg: number): { x: number; y: number } => ({ x: GEAR.x + GEAR.r * Math.cos(rad(deg)), y: GEAR.y + GEAR.r * Math.sin(rad(deg)) })

/** How far round the gear has carried his hold at t. */
const heldAt = (t: number): number => lerp(TAKE, TOP, ramp(t, 0.4, 0.72))

function move(profession: Parameters<typeof rest>[0], t: number): Frame {
  const take = rimAt(TAKE)
  const takeAhead = AT + take.x
  const takeLift = -take.y - FIGURE_H * 0.95
  if (t < 0.4) {
    const along = ramp(t, 0.05, 0.28)
    const jump = ramp(t, 0.28, 0.4)
    const pose = jump > 0 ? mix(rest(profession), HANG, jump) : along > 0 && along < 1 ? walk(profession, (takeAhead * along) / STEP) : rest(profession)
    return { pose, ahead: (takeAhead - 20) * along + 20 * jump, lift: (takeLift + hop(jump, 20)) * jump, over: 0 }
  }
  if (t < 0.72) {
    const held = rimAt(heldAt(t))
    return { pose: HANG, ahead: AT + held.x, lift: -held.y - FIGURE_H * 0.95, over: 0 }
  }
  const top = rimAt(TOP)
  const over = ramp(t, 0.72, 0.84)
  const off = ramp(t, 0.86, 1)
  const pose = t < 0.84 ? mix(HANG, CLIMB, over) : mix(CLIMB, CROUCH, ramp(t, 0.84, 0.92))
  return { pose, ahead: AT + top.x + (GANTRY.x + 70 - top.x) * off, lift: lerp(-top.y - FIGURE_H * 0.95, GANTRY.h, over) + hop(off, 24), over: 0 }
}

export const bands: Place = {
  script: [1800, 1600, 1400],
  ends: [0.4, 0.72, 1],
  obstacle: ({ light }: { light: Light }) => (
    <>
      <rect x={GANTRY.x} y={-GANTRY.h} width={700} height={14} fill={SHADE.black} />
      <path d={`M${GANTRY.x + 40} ${-GANTRY.h} V0 M${GANTRY.x + 300} ${-GANTRY.h} V0`} stroke={SHADE.black} strokeWidth={12} />
      <rect x={GEAR.x - 14} y={GEAR.y} width={28} height={-GEAR.y} fill={SHADE.black} />
      <g data-fx="gear">
        <path d={gearPath(GEAR.x, GEAR.y, GEAR.r - 14, 18)} fill={SHADE.black} fillRule="evenodd" />
        <circle cx={GEAR.x} cy={GEAR.y} r={GEAR.r * 0.32} fill="none" stroke={light.mid} strokeWidth={4} />
      </g>
    </>
  ),
  move,
  reply: (stage) => {
    const gear = fx(stage, 'gear')
    return (t) => transformTo(gear, `rotate(${(heldAt(t) - TAKE + 30 * ramp(t, 0, 0.4) + 30 * ramp(t, 0.72, 1)).toFixed(1)} ${GEAR.x} ${GEAR.y})`)
  },
}
