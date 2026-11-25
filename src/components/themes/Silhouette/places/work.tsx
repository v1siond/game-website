import { mix } from '@/lib/motion/rigPose'
import type { Profession } from '@/lib/cv/professions'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, lerp } from '../../shared/stageNodes'
import { SHADE } from '../palette'
import { arc, runFrame, type Frame, type Place } from '../place'
import { CLIMB, CROUCH, HANG, TUCK } from '../pose'

// Beat 3, deeper in the forest: two bear traps lie open on the path, and past them a high bank of earth. He
// runs and hops the first trap, which snaps shut under him, and hops the second; he jumps at the bank, hangs
// from its edge and hauls himself up; he runs over its top and drops down the far side, and runs on.

const TRAPS = [260, 350] as const
const BANK = { from: 450, to: 540, h: 76 }
const HANG_AT = BANK.from - 12

/** A hop over the trap at `x`, `u` of the way. */
const hopOver = (x: number, u: number): Frame => ({ pose: TUCK, ahead: lerp(x - 40, x + 40, u), lift: arc(u, 40), over: 0 })

function move(profession: Profession, t: number, length: number): Frame {
  if (t < 0.4) {
    const u = ramp(t, 0, 0.4)
    const [first, second] = TRAPS
    if (u < 0.3) return runFrame(profession, 0, first - 40, ramp(u, 0, 0.3))
    if (u < 0.45) return hopOver(first, ramp(u, 0.3, 0.45))
    if (u < 0.6) return runFrame(profession, first + 40, second - 40, ramp(u, 0.45, 0.6))
    if (u < 0.75) return hopOver(second, ramp(u, 0.6, 0.75))
    return runFrame(profession, second + 40, HANG_AT - 30, ramp(u, 0.75, 1))
  }
  if (t < 0.7) {
    const jump = ramp(t, 0.4, 0.5)
    const pull = ramp(t, 0.55, 0.7)
    if (pull === 0) return { pose: HANG, ahead: lerp(HANG_AT - 30, HANG_AT, jump), lift: (BANK.h - 70) * jump + arc(jump, 30), over: 0 }
    return { pose: mix(CLIMB, CROUCH, ramp(pull, 0.6, 1)), ahead: lerp(HANG_AT, BANK.from + 30, pull), lift: lerp(BANK.h - 70, BANK.h, ramp(pull, 0, 0.6)), over: 0 }
  }
  const over = ramp(t, 0.7, 0.82)
  if (over < 1) return { ...runFrame(profession, BANK.from + 30, BANK.to - 10, over), lift: BANK.h }
  const drop = ramp(t, 0.82, 0.88)
  if (drop < 1) return { pose: mix(TUCK, CROUCH, drop), ahead: lerp(BANK.to - 10, BANK.to + 40, drop), lift: arc(drop, 14, -BANK.h) + BANK.h, over: 0 }
  return runFrame(profession, BANK.to + 40, length, ramp(t, 0.88, 1))
}

/** A bear trap, open (data-fx trap-<i>-open) or sprung shut (trap-<i>-shut). */
function Trap({ x, index }: { x: number; index: number }) {
  return (
    <g transform={`translate(${x} 0)`} fill={SHADE.black}>
      <rect x={-18} y={-4} width={36} height={4} />
      <path data-fx={`trap-${index}-open`} d="M-18 -4 Q-27 -21 -11 -25 L-8 -21 Q-18 -18 -14 -4 Z M18 -4 Q27 -21 11 -25 L8 -21 Q18 -18 14 -4 Z" />
      <path data-fx={`trap-${index}-shut`} d="M-10 -4 Q-11 -25 0 -28 Q11 -25 10 -4 Z" opacity="0" />
    </g>
  )
}

export const work: Place = {
  region: 'forest',
  length: 620,
  script: [1700, 1500, 1300],
  ends: [0.4, 0.7, 1],
  obstacle: () => (
    <>
      {TRAPS.map((x, index) => (
        <Trap key={x} x={x} index={index} />
      ))}
      <path d={`M${BANK.from} 4 V${-BANK.h + 8} Q${BANK.from + 6} ${-BANK.h} ${BANK.from + 20} ${-BANK.h} H${BANK.to - 16} Q${BANK.to} ${-BANK.h + 4} ${BANK.to + 6} 4 Z`} fill={SHADE.black} />
      <path d={`M${BANK.from + 40} ${-BANK.h} l-4 -18 l8 0 Z M${BANK.from + 70} ${-BANK.h} l-3 -12 l6 0 Z`} fill={SHADE.black} />
    </>
  ),
  move,
  reply: (stage) => {
    const open = fx(stage, 'trap-0-open')
    const shut = fx(stage, 'trap-0-shut')
    // the first trap snaps shut as he clears it
    return (t) => {
      const sprung = ramp(t, 0.15, 0.17)
      fadeTo(open, 1 - sprung)
      fadeTo(shut, sprung)
    }
  },
}
