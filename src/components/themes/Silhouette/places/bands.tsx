import { mix } from '@/lib/motion/rigPose'
import type { Profession } from '@/lib/cv/professions'
import { ramp } from '@/lib/scroll/stage'
import { fx, lerp, transformTo } from '../../shared/stageNodes'
import { SHADE, type Light } from '../palette'
import { gearPath } from '../forest'
import { arc, runFrame, type Frame, type Place } from '../place'
import { CROUCH, TUCK } from '../pose'

// Beat 8, the gear hall: a great gear turns half sunk in the floor before a wall of machinery. He jumps onto
// a tooth on its rising side; it carries him up and over its top; he jumps off onto the wall's top, runs
// along it and drops down the far side.

const GEAR = { x: 330, y: 40, r: 150 }
// Where on the gear's rim he rides, in degrees, y down: 200 a little below its left side, 270 its top.
const BOARD = 205
const OFF = 290
const WALL = { from: 470, to: 580, h: 170 }

/** A point on the gear's rim at `deg`, as his feet stand on it. */
const rimAt = (deg: number) => {
  const a = (deg * Math.PI) / 180
  const r = GEAR.r * 1.16
  return { x: GEAR.x + r * Math.cos(a), lift: -(GEAR.y + r * Math.sin(a)) }
}

/** How far the gear has turned at t, in degrees: it carries him from where he boards to where he jumps. */
const turnAt = (t: number): number => (OFF - BOARD) * ramp(t, 0.3, 0.7) + 20 * ramp(t, 0, 0.3) + 20 * ramp(t, 0.7, 1)

function move(profession: Profession, t: number, length: number): Frame {
  const board = rimAt(BOARD + 20)
  if (t < 0.3) {
    const run = ramp(t, 0, 0.16)
    if (run < 1) return runFrame(profession, 0, board.x - 90, run)
    const u = ramp(t, 0.16, 0.3)
    return { pose: mix(TUCK, CROUCH, ramp(u, 0.7, 1)), ahead: lerp(board.x - 90, board.x, u), lift: arc(u, 40, board.lift), over: 0 }
  }
  if (t < 0.7) {
    const on = rimAt(BOARD + 20 + (OFF - BOARD) * ramp(t, 0.3, 0.7))
    return { pose: CROUCH, ahead: on.x, lift: on.lift, over: 0 }
  }
  const off = rimAt(OFF + 20)
  const jump = ramp(t, 0.7, 0.8)
  if (jump < 1) return { pose: mix(TUCK, CROUCH, ramp(jump, 0.7, 1)), ahead: lerp(off.x, WALL.from + 24, jump), lift: off.lift + arc(jump, 30, WALL.h - off.lift), over: 0 }
  const across = ramp(t, 0.8, 0.88)
  if (across < 1) return { ...runFrame(profession, WALL.from + 24, WALL.to - 10, across), lift: WALL.h }
  const drop = ramp(t, 0.88, 0.94)
  if (drop < 1) return { pose: mix(TUCK, CROUCH, drop), ahead: lerp(WALL.to - 10, WALL.to + 50, drop), lift: WALL.h + arc(drop, 10, -WALL.h), over: 0 }
  return runFrame(profession, WALL.to + 50, length, ramp(t, 0.94, 1))
}

export const bands: Place = {
  region: 'machine',
  length: 660,
  script: [1500, 1800, 1500],
  ends: [0.3, 0.7, 1],
  obstacle: ({ light }: { light: Light }) => (
    <>
      <g data-fx="gear">
        <path d={gearPath(GEAR.x, GEAR.y, GEAR.r, 16)} fill={SHADE.black} fillRule="evenodd" />
      </g>
      <circle cx={GEAR.x} cy={GEAR.y} r={GEAR.r * 0.32} fill={light.far} opacity={0.4} />
      <rect x={WALL.from} y={-WALL.h} width={WALL.to - WALL.from} height={WALL.h + 4} fill={SHADE.black} />
      <path d={`M${WALL.from + 20} ${-WALL.h} V${-WALL.h - 40} M${WALL.from + 20} ${-WALL.h - 40} h40`} stroke={SHADE.black} strokeWidth={6} />
    </>
  ),
  move,
  reply: (stage) => {
    const gear = fx(stage, 'gear')
    return (t) => transformTo(gear, `rotate(${turnAt(t).toFixed(1)} ${GEAR.x} ${GEAR.y})`)
  },
}
