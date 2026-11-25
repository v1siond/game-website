import { hop } from '@/lib/motion/arc'
import { ramp } from '@/lib/scroll/stage'
import { bell, fadeTo, fx, lerp, r1, transformTo } from '../../shared/stageNodes'
import { CROUCH, RIDE, STAND, TUCK, blend, ease, flight, still } from '../moves'
import type { PartnerFrame } from '../partner'
import type { SceneDef } from '../place'
import { COLORS as C } from '../palette'
import { Beetle, Boar, Crate, PLANKS, PlankWall, boardAt, plankAt } from '../props'
import { Flash } from './kit'

// Services: the buddy, a change of body. In the temple valley he rolls into the crate and it breaks apart, the
// boar steps out and snorts; he jumps onto its back, the partner up behind him; it charges, bowls two beetles
// of the crew over and smashes through the plank wall into the hidden room. The boar stands in the broken
// wall, the hidden room's light behind.

const CRATE_X = 170
const ROLLED = 95
// The saddle is 100 up on the boar; seated, his hips are 33 above his soles, so this lift seats him.
const SADDLE = 100
const SEAT = 33
const CHARGE_TO = 440
const WALL_X = 480
const BEETLES = [340, 410] as const
const START = -70
// The partner rides on the boar's rump behind him.
const RUMP = { x: -50, lift: 88 }

const boarAt = (t: number): number => lerp(CRATE_X, CHARGE_TO, ease(ramp(t, 0.6, 0.94)))
const charging = (t: number): number => bell(t, 0.6, 0.94)

// The boar's snout is this far ahead of its middle: where it meets a beetle, and how far on the beetle flies.
const SNOUT = 125
const BOWLED = 120

/** A stone column of the temple ruins, broken off at `height`, its foot at x. */
function Column({ x, height }: { x: number; height: number }) {
  return (
    <g transform={`translate(${x} 0)`}>
      <rect x={-26} y={-height} width={52} height={height} fill={C.stone} stroke={C.shadow} strokeWidth={3} />
      <path d={`M-26 ${-height} L-10 ${-height - 18} L6 ${-height - 6} L26 ${-height - 20} V${-height} Z`} fill={C.stone} stroke={C.shadow} strokeWidth={3} strokeLinejoin="round" />
      <path d={`M-12 ${-height + 6} V-4 M10 ${-height + 6} V-4`} stroke={C.stoneDark} strokeWidth={4} />
      <rect x={-34} y={-14} width={68} height={14} fill={C.stoneDark} stroke={C.shadow} strokeWidth={3} />
    </g>
  )
}

export const services: SceneDef = {
  zone: 'dusk',
  kit: 'engineer',
  script: [1500, 1000, 1900],
  shift: { wide: -110, phone: -80 },
  ends: [0.4, 0.58, 1],
  back: () => (
    <g>
      <Column x={-90} height={300} />
      <Column x={560} height={420} />
      {/* the hidden room behind the wall, dark until the wall breaks and its light comes out */}
      <path data-fx="room" d={`M${WALL_X - 40} 0 V-220 Q${WALL_X + 20} -290 ${WALL_X + 80} -220 V0 Z`} fill={C.shadow} stroke={C.stoneDark} strokeWidth={6} />
      <g data-fx="room-light" opacity="0">
        <path d={`M${WALL_X - 34} 0 V-216 Q${WALL_X + 20} -282 ${WALL_X + 74} -216 V0 Z`} fill={C.sunGold} opacity={0.75} />
        <Flash name="room-glow" x={WALL_X + 20} y={-120} size={100} />
      </g>
      <g data-fx="wall" transform={`translate(${WALL_X} 0)`}>
        <PlankWall />
      </g>
      {BEETLES.map((x, i) => (
        <g key={x} data-fx={`beetle-${i}`} transform={`translate(${x} 0)`}>
          <Beetle />
        </g>
      ))}
      <g data-fx="boar" opacity="0" transform={`translate(${CRATE_X} 0)`}>
        <Boar />
      </g>
      <g data-fx="snort" opacity="0" transform={`translate(${CRATE_X + 110} -40)`}>
        <ellipse rx={18} ry={9} fill="#f4f1ea" />
        <ellipse cx={20} cy={-6} rx={12} ry={7} fill="#f4f1ea" />
      </g>
      <g data-fx="crate" transform={`translate(${CRATE_X} 0)`}>
        <Crate />
      </g>
    </g>
  ),
  move: (_kit, t) => {
    if (t < 0.06) return still(blend(STAND, CROUCH, t, 0, 0.06))
    if (t < 0.3) return { pose: TUCK, ahead: ROLLED * ease(ramp(t, 0.06, 0.3)), spin: 720 * ease(ramp(t, 0.06, 0.3)) }
    if (t < 0.42) return still(blend(TUCK, STAND, t, 0.3, 0.38), ROLLED)
    if (t < 0.56) {
      const [ahead, lift] = flight(ramp(t, 0.42, 0.56), [ROLLED, 0], [CRATE_X - 10, SADDLE - SEAT], 80)
      return { pose: blend(CROUCH, RIDE, t, 0.42, 0.54), ahead, lift }
    }
    return { pose: { ...RIDE, lean: -10 * charging(t) }, ahead: boarAt(t) - 10, lift: SADDLE - SEAT - 6 * Math.abs(Math.sin(t * 40)) * charging(t) }
  },
  partner: (t): PartnerFrame => {
    if (t < 0.3) return { ahead: START + 60 * ease(ramp(t, 0.06, 0.3)), phase: 6 * ramp(t, 0.06, 0.3) }
    if (t < 0.44) return { ahead: START + 60 }
    if (t < 0.58) {
      const [ahead, lift] = flight(ramp(t, 0.44, 0.58), [START + 60, 0], [CRATE_X + RUMP.x, RUMP.lift], 110)
      return { ahead, lift, air: 1 }
    }
    return { ahead: boarAt(t) + RUMP.x, lift: RUMP.lift - 6 * Math.abs(Math.sin(t * 40 + 1)) * charging(t), air: 0.7, arms: 0.5 * ramp(t, 0.94, 1) }
  },
  reply: (stage) => {
    const crate = fx(stage, 'crate')
    const boards = [0, 1, 2, 3].map((i) => fx(stage, `crate-board-${i}`))
    const boar = fx(stage, 'boar')
    const snort = fx(stage, 'snort')
    const wall = fx(stage, 'wall')
    const planks = Array.from({ length: PLANKS }, (_, i) => fx(stage, `plank-${i}`))
    const beetles = BEETLES.map((_, i) => fx(stage, `beetle-${i}`))
    const light = fx(stage, 'room-light')
    const glow = fx(stage, 'room-glow')
    return (t) => {
      // the crate's boards fly apart and the boar steps out and snorts
      const burst = ramp(t, 0.3, 0.4)
      boards.forEach((board, i) => transformTo(board, boardAt(i, burst)))
      fadeTo(crate, 1 - ramp(t, 0.36, 0.42))
      fadeTo(boar, ramp(t, 0.3, 0.36))
      transformTo(boar, `translate(${r1(boarAt(t))} 0)`)
      fadeTo(snort, bell(t, 0.36, 0.44))
      // the charge bowls each beetle over as it reaches it, and smashes the wall
      beetles.forEach((beetle, i) => {
        const u = ramp(boarAt(t), BEETLES[i] - SNOUT, BEETLES[i] - SNOUT + BOWLED)
        transformTo(beetle, `translate(${r1(BEETLES[i] + 260 * u)} ${r1(-hop(u, 220))}) rotate(${r1(300 * u)} 0 -24)`)
        fadeTo(beetle, 1 - ramp(u, 0.8, 1))
      })
      const smash = ramp(t, 0.82, 1)
      planks.forEach((plank, i) => transformTo(plank, plankAt(i, smash)))
      fadeTo(wall, 1 - ramp(t, 0.94, 1))
      fadeTo(light, ramp(t, 0.84, 0.96))
      fadeTo(glow, 0.8 * ramp(t, 0.86, 1))
    }
  },
}
