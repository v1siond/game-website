import { mix } from '@/lib/motion/rigPose'
import type { Profession } from '@/lib/cv/professions'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, lerp, transformTo } from '../../shared/stageNodes'
import { SHADE, type Light } from '../palette'
import { arc, runFrame, type Frame, type Place } from '../place'
import { CROUCH, STRIKE, TUCK, rest } from '../pose'

// Ventures, the sign that kills: on the crumbling city's roofs a great sign of plain panels, no letters, lies
// along his way, and the lit panel kills whatever stands on it; the light walks along the sign toward him
// (Limbo notes L72 to L74, [2] [1]). He crouches low on a dark panel as the light passes one panel away; he
// yanks the cable hanging over the sign and it dies panel by panel; he runs over the dead sign and drops
// onto the glass dome below the roof's edge, and the glass gives under him.

const PANEL = { from: 60, w: 64, count: 5, h: 6 }
const WAIT_ON = 1
const CABLE = PANEL.from + PANEL.w * 2 + 10
const EDGE = PANEL.from + PANEL.w * PANEL.count + 40
const DOME = { x: EDGE + 120, r: 110, top: 70 }
const FALL = 230

/** The middle of panel `i`. */
const panelX = (i: number): number => PANEL.from + PANEL.w * (i + 0.5)

/** Which panel the light is on at t, as a float: walking in from the far end, one short of him, back. */
const litAt = (t: number): number => {
  const u = ramp(t, 0.04, 0.32)
  return PANEL.count - 1 - (PANEL.count - 2 - WAIT_ON) * Math.sin(u * Math.PI)
}

function move(profession: Profession, t: number, length: number): Frame {
  if (t < 0.34) {
    const walk = ramp(t, 0, 0.08)
    if (walk < 1) return runFrame(profession, 0, panelX(WAIT_ON), walk)
    return { pose: mix(rest(profession), CROUCH, ramp(t, 0.08, 0.12) - ramp(t, 0.3, 0.34)), ahead: panelX(WAIT_ON), lift: 0, over: 0 }
  }
  if (t < 0.66) {
    const step = ramp(t, 0.34, 0.42)
    if (step < 1) return runFrame(profession, panelX(WAIT_ON), CABLE - 18, step)
    const pull = ramp(t, 0.44, 0.5) - ramp(t, 0.54, 0.62)
    return { pose: mix(rest(profession), STRIKE, pull), ahead: CABLE - 18, lift: 0, over: 0 }
  }
  const run = ramp(t, 0.66, 0.8)
  if (run < 1) return runFrame(profession, CABLE - 18, EDGE, run)
  const fall = ramp(t, 0.8, 1)
  return { pose: mix(TUCK, CROUCH, ramp(fall, 0.6, 1)), ahead: lerp(EDGE, length, fall), lift: arc(fall, 20, -FALL), over: 0 }
}

export const ventures: Place = {
  region: 'city',
  length: DOME.x,
  script: [1600, 1500, 1500],
  ends: [0.34, 0.66, 1],
  gaps: [[EDGE, EDGE + 500]],
  obstacle: ({ light }: { light: Light }) => (
    <>
      {Array.from({ length: PANEL.count }, (_, i) => (
        <g key={i}>
          <rect x={PANEL.from + PANEL.w * i + 2} y={-PANEL.h} width={PANEL.w - 4} height={PANEL.h} fill={SHADE.black} stroke={SHADE.edge} strokeWidth={1.5} />
          <g data-fx={`panel-${i}`} opacity="0">
            <rect x={PANEL.from + PANEL.w * i + 4} y={-PANEL.h + 2} width={PANEL.w - 8} height={PANEL.h - 4} fill={SHADE.glow} />
            <rect x={PANEL.from + PANEL.w * i - 6} y={-PANEL.h - 40} width={PANEL.w + 12} height={44} fill={SHADE.glow} opacity={0.18} />
          </g>
        </g>
      ))}
      {/* the cable hanging from a pole over the sign */}
      <path d={`M${CABLE + 40} 0 V-300 H${CABLE}`} stroke={SHADE.black} strokeWidth={6} fill="none" />
      <g data-fx="cable">
        <path d={`M${CABLE} -300 V-80 l-6 10 h12 Z`} stroke={SHADE.black} strokeWidth={3} fill={SHADE.black} />
      </g>
      {/* the roof's edge and the glass dome below it */}
      <rect x={EDGE - 6} y={-4} width={10} height={60} fill={SHADE.black} />
      <path d={`M${DOME.x - DOME.r} ${DOME.top + DOME.r} A${DOME.r} ${DOME.r} 0 0 1 ${DOME.x + DOME.r} ${DOME.top + DOME.r}`} fill={light.far} fillOpacity={0.2} stroke={light.rim} strokeOpacity={0.5} strokeWidth={2} />
      <rect x={DOME.x - DOME.r - 30} y={DOME.top + DOME.r} width={DOME.r * 2 + 60} height={400} fill={SHADE.black} />
      <g data-fx="glass" opacity="0" fill={light.rim} fillOpacity={0.6}>
        {[-50, -20, 12, 40, 66].map((dx, i) => (
          <path key={dx} d={`M${DOME.x + dx} ${DOME.top + 10 + (i % 3) * 18} l10 -14 l6 16 Z`} />
        ))}
      </g>
    </>
  ),
  move,
  reply: (stage) => {
    const panels = Array.from({ length: PANEL.count }, (_, i) => fx(stage, `panel-${i}`))
    const cable = fx(stage, 'cable')
    const glass = fx(stage, 'glass')
    return (t) => {
      const lit = litAt(t)
      // after the yank the sign dies panel by panel from the far end
      const dead = ramp(t, 0.5, 0.62) * PANEL.count
      panels.forEach((node, i) => fadeTo(node, (Math.abs(i - lit) < 0.5 ? 1 : 0) * (i >= PANEL.count - dead ? 0 : 1)))
      transformTo(cable, `translate(0 ${(26 * (ramp(t, 0.46, 0.5) - ramp(t, 0.56, 0.62))).toFixed(1)})`)
      // the glass bursts as he goes through the dome, its shards falling with him
      const burst = ramp(t, 0.86, 1)
      fadeTo(glass, burst > 0 ? 1 : 0)
      transformTo(glass, `translate(0 ${(140 * burst).toFixed(1)})`)
    }
  },
}
