import { mix } from '@/lib/motion/rigPose'
import type { Profession } from '@/lib/cv/professions'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, lerp, transformTo } from '../../shared/stageNodes'
import { FIGURE_H, Hut } from '../forest'
import { SHADE, type Light } from '../palette'
import { runFrame, type Frame, type Place } from '../place'
import { REACH, march, rest } from '../pose'

// Projects, the light and pulled away: the forest's last stretch, the lit window close now just across a
// ravine. A small pale glow drops onto his head and his steps go where it wants, away from the window (research
// notes L66 to L68, [2] [11] [1]); this is the game's false ending, the one he searches for seen and out of
// reach (L69 to L71, [1] [18] [19]). He is marched back the way he came; the lamp's light swings him round;
// he steps under the low overhang, reaches up, and the dark shapes hanging from it close on the glow and
// take it. Across the ravine the window has gone dark.

const LAMP = 30
const RAVINE = [240, 300] as const
const HUT = 335
const EDGE = 220
const UP_AT = 110
const OVERHANG = FIGURE_H + 60

function move(profession: Profession, t: number): Frame {
  if (t < 0.36) {
    const walk = ramp(t, 0, 0.12)
    if (walk < 1) return runFrame(profession, 0, EDGE, walk)
    if (t < 0.16) return { pose: rest(profession), ahead: EDGE, lift: 0, over: 0 }
    const u = ramp(t, 0.16, 0.36)
    return { pose: u < 1 ? march(lerp(EDGE, LAMP, u) / 26) : rest(profession), ahead: lerp(EDGE, LAMP, u), lift: 0, over: 0, back: true }
  }
  if (t < 0.6) {
    const turn = ramp(t, 0.4, 0.46)
    if (turn < 1) return { pose: rest(profession), ahead: LAMP, lift: 0, over: 0, back: turn < 0.5 }
    return runFrame(profession, LAMP, UP_AT, ramp(t, 0.46, 0.6))
  }
  const reach = ramp(t, 0.66, 0.76) - ramp(t, 0.9, 0.96)
  return { pose: mix(rest(profession), REACH, reach), ahead: UP_AT, lift: 0, over: 0 }
}

/** The glow's place at t: dropping onto his head, riding it, taken up into the overhang. */
function glowAt(t: number, frame: Frame): { x: number; y: number } {
  const head = { x: frame.ahead, y: -frame.lift - FIGURE_H - 4 }
  const drop = ramp(t, 0.12, 0.16)
  if (t < 0.16) return { x: EDGE, y: lerp(-700, head.y, drop) }
  return { x: head.x, y: lerp(head.y, -OVERHANG + 10, ramp(t, 0.84, 0.9)) }
}

export const projects: Place = {
  region: 'forest',
  length: EDGE,
  script: [1700, 1500, 1700],
  ends: [0.36, 0.6, 1],
  gaps: [RAVINE],
  obstacle: ({ light }: { light: Light }) => (
    <>
      {/* the lamp on its post, its cone of light on the ground */}
      <path d={`M${LAMP - 70} 0 L${LAMP - 8} -150 H${LAMP + 8} L${LAMP + 70} 0 Z`} fill={SHADE.glow} opacity={0.16} />
      <path d={`M${LAMP - 3} 0 V-160 H${LAMP + 16} V-152 H${LAMP + 3} V0 Z`} fill={SHADE.black} />
      <circle cx={LAMP + 12} cy={-148} r={5} fill={SHADE.glow} />
      {/* the low overhang with its dark hanging shapes */}
      <path d={`M${UP_AT - 90} -900 V${-OVERHANG - 20} Q${UP_AT} ${-OVERHANG + 20} ${UP_AT + 80} ${-OVERHANG - 30} V-900 Z`} fill={SHADE.black} />
      <g data-fx="hangers" fill={SHADE.black}>
        {[-30, -6, 18, 40].map((dx, i) => (
          <path key={dx} d={`M${UP_AT + dx - 6} ${-OVERHANG - 6} Q${UP_AT + dx} ${-OVERHANG + 30 + (i % 2) * 14} ${UP_AT + dx + 6} ${-OVERHANG - 6} Z`} />
        ))}
      </g>
      <rect x={RAVINE[0]} y={0} width={RAVINE[1] - RAVINE[0]} height={400} fill={light.mid} opacity={0.5} />
      <g transform={`translate(${HUT} 0)`}>
        <Hut name="near-hut" w={50} />
      </g>
      <circle data-fx="glow" r={6} fill={SHADE.glow} opacity="0" />
    </>
  ),
  move,
  reply: (stage, { profession }) => {
    const glow = fx(stage, 'glow')
    const hangers = fx(stage, 'hangers')
    const window = fx(stage, 'near-hut-window')
    return (t) => {
      const { x, y } = glowAt(t, move(profession, t))
      transformTo(glow, `translate(${x.toFixed(1)} ${y.toFixed(1)})`)
      fadeTo(glow, ramp(t, 0.1, 0.12) * (1 - ramp(t, 0.88, 0.9)))
      // the hanging shapes reach down onto the glow and draw back up with it
      transformTo(hangers, `translate(0 ${(24 * (ramp(t, 0.78, 0.84) - ramp(t, 0.86, 0.9))).toFixed(1)})`)
      // across the ravine the window goes dark
      fadeTo(window, 1 - ramp(t, 0.9, 0.98))
    }
  },
}
