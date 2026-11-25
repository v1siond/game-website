import { mix } from '@/lib/motion/rigPose'
import type { Profession } from '@/lib/cv/professions'
import { ramp } from '@/lib/scroll/stage'
import { fx, lerp, transformTo } from '../../shared/stageNodes'
import { SHADE, type Light } from '../palette'
import { arc, runFrame, type Frame, type Place } from '../place'
import { CLIMB, CROUCH, HAUL, TUCK, rest } from '../pose'

// About, the forest's first puzzle: a black pool in the trees he cannot swim, a raft half hidden in the
// reeds on the water, and a steep bank on the far side (research notes L40, [2]; the game teaches pulling before
// it asks for it at the water, L130, [1]). The water does not chase; it waits. He leans back and hauls the
// raft out of the reeds to the edge; he steps on and drifts over, crouching through a wobble in the middle;
// the raft knocks the far wall and he hauls himself up onto the bank.

const WATER = [300, 620] as const
const SURFACE = 34
const RAFT = { w: 110, h: 10, reeds: 420 }
// The raft's left end against the near edge, and against the far wall.
const RAFT_IN = WATER[0]
const RAFT_FAR = WATER[1] - RAFT.w
// On the raft he stands this high: its deck under the ground's line.
const DECK = -(SURFACE - RAFT.h)
const BANK = { h: 46, from: WATER[1] }

/** Where the raft's left end is at t: in the reeds, hauled to the edge, drifted to the far wall. */
const raftAt = (t: number): number => {
  if (t < 0.3) return lerp(RAFT.reeds, RAFT_IN, ramp(t, 0.1, 0.28))
  return lerp(RAFT_IN, RAFT_FAR, ramp(t, 0.36, 0.64))
}

/** The raft's rock in the middle of the drift, in degrees. */
const wobbleAt = (t: number): number => 5 * Math.sin(ramp(t, 0.44, 0.58) * Math.PI * 3) * (1 - ramp(t, 0.54, 0.6))

function move(profession: Profession, t: number, length: number): Frame {
  const edge = WATER[0] - 14
  if (t < 0.3) {
    const walk = ramp(t, 0, 0.1)
    if (walk < 1) return runFrame(profession, 0, edge, walk)
    return { pose: mix(rest(profession), HAUL, ramp(t, 0.1, 0.14)), ahead: edge - 6 * Math.sin(ramp(t, 0.12, 0.28) * Math.PI * 3), lift: 0, over: 0 }
  }
  if (t < 0.68) {
    const on = ramp(t, 0.3, 0.36)
    const stand = RAFT.w * 0.4
    if (on < 1) return { pose: mix(TUCK, CROUCH, on), ahead: lerp(edge, RAFT_IN + stand, on), lift: arc(on, 16, DECK), over: 0 }
    const crouch = ramp(t, 0.44, 0.48) - ramp(t, 0.56, 0.6)
    return { pose: mix(rest(profession), CROUCH, crouch), ahead: raftAt(t) + stand, lift: DECK, over: 0 }
  }
  const from = RAFT_FAR + RAFT.w * 0.4
  const climb = ramp(t, 0.7, 0.92)
  if (climb < 1) return { pose: mix(CLIMB, CROUCH, ramp(climb, 0.6, 1)), ahead: lerp(from, BANK.from + 28, climb), lift: lerp(DECK, BANK.h, ramp(climb, 0, 0.7)), over: 0 }
  return { pose: mix(CROUCH, rest(profession), ramp(t, 0.92, 1)), ahead: length, lift: BANK.h, over: 0 }
}

export const about: Place = {
  region: 'forest',
  length: BANK.from + 28,
  script: [1500, 1800, 1400],
  ends: [0.3, 0.68, 1],
  gaps: [WATER],
  obstacle: ({ light }: { light: Light }) => (
    <>
      <rect x={WATER[0]} y={SURFACE} width={WATER[1] - WATER[0]} height={400} fill={light.mid} />
      <line x1={WATER[0]} y1={SURFACE} x2={WATER[1]} y2={SURFACE} stroke={light.rim} strokeOpacity={0.4} strokeWidth={2} />
      <g data-fx="raft">
        <rect y={SURFACE - RAFT.h} width={RAFT.w} height={RAFT.h + 4} fill={SHADE.black} />
        <path d={`M8 ${SURFACE - RAFT.h} v-6 M${RAFT.w - 8} ${SURFACE - RAFT.h} v-6`} stroke={SHADE.black} strokeWidth={3} />
      </g>
      {/* the reeds the raft lies in, in front of it */}
      <path
        d={Array.from({ length: 12 }, (_, i) => `M${RAFT.reeds + 10 + i * 12} ${SURFACE + 4} L${RAFT.reeds + 14 + i * 12} ${SURFACE - 40 - (i % 4) * 9} L${RAFT.reeds + 17 + i * 12} ${SURFACE + 4} Z`).join(' ')}
        fill={SHADE.black}
      />
      {/* the far bank: a steep wall up out of the water */}
      <rect x={BANK.from} y={-BANK.h} width={900} height={BANK.h + SURFACE + 400} fill={SHADE.black} />
    </>
  ),
  move,
  reply: (stage) => {
    const raft = fx(stage, 'raft')
    return (t) => transformTo(raft, `translate(${raftAt(t).toFixed(1)} 0) rotate(${wobbleAt(t).toFixed(2)} ${RAFT.w / 2} ${SURFACE})`)
  },
}
