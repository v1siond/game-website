import { mix } from '@/lib/motion/rigPose'
import type { Profession } from '@/lib/cv/professions'
import { ramp } from '@/lib/scroll/stage'
import { lerp } from '../../shared/stageNodes'
import { SHADE } from '../palette'
import { arc, runFrame, type Frame, type Place } from '../place'
import { CROUCH, TUCK, rest } from '../pose'

// Beat 2, into the trees: the ground breaks off at a gap with spikes at the bottom of the drop. He runs at
// it, jumps it in one short low arc with his knees tucked, lands crouched on the far side and runs on.

const GAP = [250, 400] as const
const TAKE_OFF = GAP[0] - 20
const LAND = GAP[1] + 40
const PIT = 260

function move(profession: Profession, t: number, length: number): Frame {
  if (t < 0.35) return runFrame(profession, 0, TAKE_OFF, ramp(t, 0, 0.35))
  if (t < 0.6) {
    const u = ramp(t, 0.35, 0.6)
    return { pose: mix(TUCK, CROUCH, ramp(u, 0.7, 1)), ahead: lerp(TAKE_OFF, LAND, u), lift: arc(u, 70), over: 0 }
  }
  if (t < 0.68) return { pose: mix(CROUCH, rest(profession), ramp(t, 0.6, 0.68)), ahead: LAND, lift: 0, over: 0 }
  return runFrame(profession, LAND, length, ramp(t, 0.68, 1))
}

/** The spikes at the bottom of the drop, black against the fog below the ground. */
const SPIKES = Array.from({ length: 9 }, (_, i) => GAP[0] + 10 + i * 16)
  .map((x, i) => `M${x - 6} ${PIT} L${x} ${PIT - 34 - (i % 3) * 10} L${x + 6} ${PIT} Z`)
  .join(' ')

export const about: Place = {
  region: 'forest',
  length: 480,
  script: [1300, 1400, 1300],
  ends: [0.35, 0.68, 1],
  gaps: [GAP],
  obstacle: () => (
    <g fill={SHADE.black}>
      <rect x={GAP[0] - 4} y={PIT} width={GAP[1] - GAP[0] + 8} height={400} />
      <path d={SPIKES} />
      {/* the gap's broken lips, roots hanging into it */}
      <path d={`M${GAP[0]} 0 L${GAP[0] + 14} 30 L${GAP[0] + 4} 60 L${GAP[0]} 120 Z M${GAP[1]} 0 L${GAP[1] - 10} 40 L${GAP[1]} 90 Z`} />
    </g>
  ),
  move,
}
