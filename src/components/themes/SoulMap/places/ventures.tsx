import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, transformTo } from '../../shared/stageNodes'
import { SOUL } from '../palette'
import type { Frame, Place } from '../place'
import { PUSH, blend, guard, walk } from '../pose'

// Ventures at the castle wall: a great wooden door, banded in iron, shut on the way ahead. He sets both
// hands on it and throws his weight against it, and it gives; then it swings wide on its own weight and
// the light beyond falls through on him. He stands in it, the way open.

const DOOR = { from: 125, to: 335, top: -430 }
const PUSHED = 50
const STEP = 50

function move(profession: Parameters<typeof guard>[0], t: number): Frame {
  const kit = guard(profession)
  const set = ramp(t, 0, 0.2)
  const along = ramp(t, 0.2, 0.55)
  const upright = ramp(t, 0.65, 0.85)
  const legs = along > 0 && along < 1 ? blend(PUSH, walk(profession, (PUSHED * along) / STEP), 0.4) : PUSH
  return { pose: blend(blend(kit, legs, set), kit, upright), ahead: PUSHED * along, lift: 0, roll: 0 }
}

/** How open the leaf is at t: a crack while he pushes, then wide. */
const openAt = (t: number): number => 0.25 * ramp(t, 0.2, 0.55) + 0.65 * ramp(t, 0.58, 0.85)

function Wall() {
  const { from, to, top } = DOOR
  return (
    <>
      <path d={`M${from - 60} 0 V-1000 H900 V0 H${to} V${top + 60} Q${(from + to) / 2} ${top - 40} ${from} ${top + 60} V0 Z`} fill={SOUL.rock} />
      <path d={`M${from - 60} -600 H900 M${to + 120} -300 H900 M${to} -150 H${to + 200}`} stroke={SOUL.slab} strokeWidth={6} />
      <g data-fx="beyond" opacity="0">
        <path d={`M${from} 0 V${top + 60} Q${(from + to) / 2} ${top - 40} ${to} ${top + 60} V0 Z`} fill={SOUL.lantern} />
      </g>
    </>
  )
}

/** The door's leaf, hung on its far edge. */
function Leaf() {
  const { from, to, top } = DOOR
  return (
    <g data-fx="leaf">
      <path d={`M${from} 0 V${top + 60} Q${(from + to) / 2} ${top - 40} ${to} ${top + 60} V0 Z`} fill={SOUL.wood} />
      <path d={`M${from + 52} 0 V${top + 10} M${from + 105} 0 V${top - 6} M${from + 158} 0 V${top + 10}`} stroke={SOUL.woodDark} strokeWidth={5} />
      <path d={`M${from} -90 H${to} M${from} -300 H${to}`} stroke={SOUL.iron} strokeWidth={14} />
      <circle cx={from + 26} cy={-200} r={10} fill={SOUL.iron} />
    </g>
  )
}

/** The light through the open door, falling back over him. */
function Light() {
  return (
    <path data-fx="shaft" d={`M${DOOR.from} ${DOOR.top + 40} L${DOOR.to} 0 H-120 Z`} fill={SOUL.lantern} opacity="0" />
  )
}

export const ventures: Place = {
  script: [2000, 1800],
  ends: [0.55, 1],
  ahead: () => (
    <>
      <Wall />
      <Leaf />
    </>
  ),
  over: () => <Light />,
  move,
  reply: (stage) => {
    const leaf = fx(stage, 'leaf')
    const beyond = fx(stage, 'beyond')
    const shaft = fx(stage, 'shaft')
    return (t) => {
      const open = openAt(t)
      transformTo(leaf, `translate(${DOOR.to} 0) scale(${(1 - open).toFixed(3)} 1) translate(${-DOOR.to} 0)`)
      fadeTo(beyond, Math.min(1, open * 2))
      fadeTo(shaft, 0.22 * ramp(t, 0.6, 0.85))
    }
  },
}
