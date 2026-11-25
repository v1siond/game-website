import { mix } from '@/lib/motion/rigPose'
import type { Profession } from '@/lib/cv/professions'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, lerp } from '../../shared/stageNodes'
import { SHADE, type Light } from '../palette'
import { arc, runFrame, type Frame, type Place } from '../place'
import { CLIMB, SIT, rest } from '../pose'

// Beat 10, out of the machines into the quiet light past the trees, the end of the run: the machines' last
// wall with a dark door in it behind him, a fallen trunk across the way, and the light coming up ahead. He
// steps out of the door and runs on; he climbs over the trunk; he walks into the light and sits down in the
// grass facing it.

const DOOR = { from: -90, to: -30, h: 150 }
const LOG = { from: 230, to: 300, h: 40 }
const SAT_AT = 0.86

function move(profession: Profession, t: number, length: number): Frame {
  if (t < 0.3) return runFrame(profession, 0, LOG.from - 30, ramp(t, 0, 0.3))
  if (t < 0.6) {
    const up = ramp(t, 0.32, 0.46)
    const over = ramp(t, 0.46, 0.58)
    return { pose: mix(CLIMB, rest(profession), over), ahead: lerp(LOG.from - 30, LOG.from + 20, up) + (LOG.to + 30 - (LOG.from + 20)) * over, lift: LOG.h * up * (1 - over) + arc(over, 16, 0), over: 0 }
  }
  const sit = ramp(t, SAT_AT, 1)
  if (sit > 0) return { pose: mix(rest(profession), SIT, sit), ahead: length, lift: 0, over: 0 }
  return runFrame(profession, LOG.to + 30, length, ramp(t, 0.6, SAT_AT))
}

export const contact: Place = {
  region: 'clearing',
  length: 560,
  script: [1300, 1400, 1700],
  ends: [0.3, 0.6, 1],
  obstacle: ({ light }: { light: Light }) => (
    <>
      <defs>
        <radialGradient id="sh-clearing-light">
          <stop offset="0" stopColor={SHADE.glow} stopOpacity="0.9" />
          <stop offset="1" stopColor={SHADE.glow} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle data-fx="light" cx={760} cy={-260} r={460} fill="url(#sh-clearing-light)" opacity="0" />
      {/* the last wall of the machines and its door, dark, behind him */}
      <rect x={DOOR.from - 600} y={-DOOR.h - 400} width={600 + DOOR.to - DOOR.from + 40} height={DOOR.h + 404} fill={SHADE.black} />
      <rect x={DOOR.from} y={-DOOR.h} width={DOOR.to - DOOR.from} height={DOOR.h} fill={light.far} opacity={0.25} />
      <path d={`M${LOG.from} 0 V${-LOG.h + 10} Q${LOG.from} ${-LOG.h} ${LOG.from + 12} ${-LOG.h} H${LOG.to} Q${LOG.to + 14} ${-LOG.h / 2} ${LOG.to} 0 Z`} fill={SHADE.black} />
      <path d={`M${LOG.from + 20} ${-LOG.h} l-12 -24 M${LOG.from + 50} ${-LOG.h} l10 -18`} stroke={SHADE.black} strokeWidth={4} />
    </>
  ),
  move,
  reply: (stage) => {
    const glow = fx(stage, 'light')
    return (t) => fadeTo(glow, 0.7 * ramp(t, 0.4, 0.95))
  },
}
