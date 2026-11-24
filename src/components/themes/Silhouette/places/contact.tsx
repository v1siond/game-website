import { hop } from '@/lib/motion/arc'
import { mix } from '@/lib/motion/rigPose'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, lerp } from '../../shared/stageNodes'
import { SHADE, type Light } from '../palette'
import { AT, type Frame, type Place } from '../place'
import { CLIMB, SIT, rest, walk } from '../pose'

// Contact in the quiet clearing past the last trees: a fallen trunk lies across the way out of the dark.
// He climbs over it; then he walks out into the clearing as the light comes up, and sits down in the grass
// facing it, the end of the way.

const LOG = { from: -30, to: 110, h: 70 }
const OVER = AT + LOG.to + 50
const SAT = OVER + 130
const STEP = 55

function move(profession: Parameters<typeof rest>[0], t: number): Frame {
  if (t < 0.5) {
    const up = ramp(t, 0.12, 0.3)
    const across = ramp(t, 0.3, 0.48)
    const ahead = lerp(0, AT + LOG.from - 10, ramp(t, 0, 0.12)) + (AT + LOG.from + 40 - (AT + LOG.from - 10)) * up + (OVER - (AT + LOG.from + 40)) * across
    const lift = LOG.h * up * (1 - across) + hop(across, 30)
    const pose = t < 0.12 ? walk(profession, ahead / STEP) : mix(CLIMB, rest(profession), across)
    return { pose, ahead, lift, over: 0 }
  }
  const along = ramp(t, 0.5, 0.78)
  const sit = ramp(t, 0.8, 0.95)
  return { pose: sit > 0 ? mix(rest(profession), SIT, sit) : along > 0 && along < 1 ? walk(profession, (OVER + (SAT - OVER) * along) / STEP) : rest(profession), ahead: OVER + (SAT - OVER) * along, lift: 0, over: 0 }
}

export const contact: Place = {
  script: [1800, 2200],
  ends: [0.5, 1],
  obstacle: ({ light }: { light: Light }) => (
    <>
      <defs>
        <radialGradient id="sh-clearing-light">
          <stop offset="0" stopColor={light.rim} stopOpacity="1" />
          <stop offset="1" stopColor={light.rim} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle data-fx="light" cx={520} cy={-300} r={420} fill="url(#sh-clearing-light)" opacity="0" />
      <path d={`M${LOG.from} 0 V${-LOG.h + 10} Q${LOG.from} ${-LOG.h} ${LOG.from + 14} ${-LOG.h} H${LOG.to} Q${LOG.to + 20} ${-LOG.h / 2} ${LOG.to} 0 Z`} fill={SHADE.black} />
      <path d={`M${LOG.from + 30} ${-LOG.h} L${LOG.from + 10} ${-LOG.h - 40} M${LOG.from + 80} ${-LOG.h} L${LOG.from + 100} ${-LOG.h - 30}`} stroke={SHADE.black} strokeWidth={6} />
    </>
  ),
  move,
  reply: (stage) => {
    const glow = fx(stage, 'light')
    return (t) => fadeTo(glow, 0.6 * ramp(t, 0.5, 0.9))
  },
}
