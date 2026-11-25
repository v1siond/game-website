import { mix } from '@/lib/motion/rigPose'
import type { Profession } from '@/lib/cv/professions'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, lerp, transformTo } from '../../shared/stageNodes'
import { SHADE, type Light } from '../palette'
import { gearPath } from '../forest'
import { arc, runFrame, type Frame, type Place } from '../place'
import { CROUCH, TUCK, rest } from '../pose'

// Bands, the drummer's middle section, the foundry's beat: a machine hall where presses pound in a steady
// beat and a great gear turns at the far end under a gantry (research notes L75 to L79, [2]; the foundry
// "sounds almost like a continuous explosion", L169 to L170, [12]). He stands still at the first press and
// nods with its beat, once, twice; on the off beat he runs under the presses as they rise; he jumps onto a
// tooth of the gear, which carries him up and over to the gantry, the presses still beating below.

const PRESSES = [150, 230] as const
const WAIT = 90
const PRESS = { w: 70, up: -190 }
const GEAR = { x: 510, y: 40, r: 140 }
const BOARD = 205
const OFF = 290
const LOOK_AHEAD = 70
const GANTRY = { from: 650, to: 800, h: 170 }

/** How far down the presses are at t, 0 up to 1 slammed: four beats over the count, then held up for the
 *  run under them, then beating on. */
function pressAt(t: number): number {
  const beat = (u: number) => Math.max(0, Math.sin(u * Math.PI * 2)) ** 3
  if (t < 0.32) return beat(ramp(t, 0, 0.32) * 2)
  if (t < 0.5) return 0
  return beat(ramp(t, 0.5, 1) * 3)
}

/** A point on the gear's rim at `deg`, as his feet stand on it. */
const rimAt = (deg: number) => {
  const a = (deg * Math.PI) / 180
  const r = GEAR.r * 1.16
  return { x: GEAR.x + r * Math.cos(a), lift: -(GEAR.y + r * Math.sin(a)) }
}

const turnAt = (t: number): number => (OFF - BOARD) * ramp(t, 0.6, 0.86) + 30 * ramp(t, 0, 0.6) + 20 * ramp(t, 0.86, 1)

function move(profession: Profession, t: number): Frame {
  if (t < 0.32) {
    const walk = ramp(t, 0, 0.06)
    if (walk < 1) return runFrame(profession, 0, WAIT, walk)
    // the nod: his weight dips with each of the press's beats
    return { pose: { ...rest(profession), lean: rest(profession).lean + 8 * pressAt(t) }, ahead: WAIT, lift: 0, over: 0 }
  }
  const board = rimAt(BOARD + 30)
  if (t < 0.5) return runFrame(profession, WAIT, board.x - 90, ramp(t, 0.32, 0.5))
  if (t < 0.6) {
    const u = ramp(t, 0.5, 0.6)
    return { pose: mix(TUCK, CROUCH, ramp(u, 0.7, 1)), ahead: lerp(board.x - 90, board.x, u), lift: arc(u, 40, board.lift), over: 0 }
  }
  if (t < 0.86) {
    const on = rimAt(BOARD + 30 + (OFF - BOARD) * ramp(t, 0.6, 0.86))
    return { pose: CROUCH, ahead: on.x, lift: on.lift, over: 0 }
  }
  const off = rimAt(OFF + 30)
  const jump = ramp(t, 0.86, 0.94)
  if (jump < 1) return { pose: mix(TUCK, CROUCH, ramp(jump, 0.7, 1)), ahead: lerp(off.x, GANTRY.from + 40, jump), lift: off.lift + arc(jump, 30, GANTRY.h - off.lift), over: 0 }
  return { pose: mix(CROUCH, rest(profession), ramp(t, 0.94, 1)), ahead: GANTRY.from + 40, lift: GANTRY.h, over: 0 }
}

export const bands: Place = {
  region: 'machine',
  length: GANTRY.from + 40,
  script: [1600, 1300, 1800],
  ends: [0.32, 0.5, 1],
  // the camera looks ahead to the presses while he counts and runs under them
  lead: (t) => LOOK_AHEAD * (ramp(t, 0, 0.1) - ramp(t, 0.5, 0.6)),
  obstacle: ({ light }: { light: Light }) => (
    <>
      <defs>
        <linearGradient id="foundry-lamp" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={SHADE.glow} stopOpacity="0.5" />
          <stop offset="1" stopColor={SHADE.glow} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* a lamp hung high over the presses, its cone of light falling through the dust */}
      <path d={`M${PRESSES[0] + 20} -330 L${PRESSES[0] - 120} 0 H${PRESSES[1] + 120} L${PRESSES[0] + 60} -330 Z`} fill="url(#foundry-lamp)" />
      <path d={`M${PRESSES[0] + 40} -900 V-345 M${PRESSES[0] + 18} -330 Q${PRESSES[0] + 40} -360 ${PRESSES[0] + 62} -330 Z`} stroke={SHADE.black} strokeWidth={4} fill={SHADE.black} />
      {PRESSES.map((x, i) => (
        <g key={x}>
          <path d={`M${x - PRESS.w / 2 - 10} -900 V0 M${x + PRESS.w / 2 + 10} -900 V0`} stroke={SHADE.black} strokeWidth={8} />
          <g data-fx={`press-${i}`}>
            <rect x={x - PRESS.w / 2} y={-900} width={PRESS.w} height={900 + PRESS.up} fill={SHADE.black} />
            <path d={`M${x - PRESS.w / 2} ${PRESS.up} h${PRESS.w} v18 h-${PRESS.w} Z`} fill={SHADE.black} />
            <path d={`M${x - PRESS.w / 2 + 6} ${PRESS.up - 60} h${PRESS.w - 12}`} stroke={light.rim} strokeOpacity={0.3} strokeWidth={3} />
          </g>
          {/* the dust thrown out under the press as it lands */}
          <g data-fx={`dust-${i}`} opacity="0" fill={light.far}>
            <ellipse cx={x - 50} cy={-14} rx={30} ry={12} />
            <ellipse cx={x + 50} cy={-12} rx={26} ry={10} />
          </g>
        </g>
      ))}
      <path data-fx="gear" d={gearPath(GEAR.x, GEAR.y, GEAR.r, 16)} fill={SHADE.black} fillRule="evenodd" />
      <circle cx={GEAR.x} cy={GEAR.y} r={GEAR.r * 0.32} fill={light.far} opacity={0.4} />
      <path d={`M${GEAR.x - GEAR.r * 1.05} ${GEAR.y - GEAR.r * 0.4} A${GEAR.r * 1.12} ${GEAR.r * 1.12} 0 0 1 ${GEAR.x + GEAR.r * 0.4} ${GEAR.y - GEAR.r * 1.05}`} stroke={light.rim} strokeOpacity={0.35} strokeWidth={3} fill="none" />
      <rect x={GANTRY.from} y={-GANTRY.h} width={GANTRY.to - GANTRY.from} height={GANTRY.h + 4} fill={SHADE.black} />
      <path d={`M${GANTRY.from + 20} ${-GANTRY.h} V${-GANTRY.h - 40} M${GANTRY.from + 20} ${-GANTRY.h - 40} h40`} stroke={SHADE.black} strokeWidth={6} />
    </>
  ),
  move,
  reply: (stage) => {
    const gear = fx(stage, 'gear')
    const presses = PRESSES.map((_, i) => fx(stage, `press-${i}`))
    const dusts = PRESSES.map((_, i) => fx(stage, `dust-${i}`))
    return (t) => {
      transformTo(gear, `rotate(${turnAt(t).toFixed(1)} ${GEAR.x} ${GEAR.y})`)
      presses.forEach((node, i) => {
        const down = pressAt(Math.max(0, t - 0.04 * i))
        transformTo(node, `translate(0 ${(-PRESS.up * down).toFixed(1)})`)
        // a puff of dust at each landing, spreading as the press lifts off it
        fadeTo(dusts[i], 0.6 * ramp(down, 0.85, 1))
      })
    }
  },
}
