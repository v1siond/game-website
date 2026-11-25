import { mix } from '@/lib/motion/rigPose'
import type { Profession } from '@/lib/cv/professions'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, lerp, transformTo } from '../../shared/stageNodes'
import { SHADE, type Light } from '../palette'
import { arc, runFrame, type Frame, type Place } from '../place'
import { CROUCH, STRIKE, TUCK, rest } from '../pose'

// Ventures, the sign that kills: on the crumbling city's roofs a great sign stands on its scaffold along his
// way, five tall panels of bulbs with no letters on them, and the lit panel kills whatever stands in front of
// it, its glare and its arcs falling on the roof below; the light walks along the sign toward him (research
// notes L72 to L74, [2] [1]). He crouches low in front of a dark panel as the light comes to one panel away
// and goes back; he steps to the cable hanging from the sign's frame and yanks it, and the sign dies panel by
// panel; he runs on to the roof's edge and drops onto the glass dome below, and the glass gives under him.

const PANEL = { from: 40, w: 78, count: 5, low: -24, high: -210 }
const BULBS = { cols: 3, rows: 5 }
const WAIT_ON = 1
const CABLE = PANEL.from + PANEL.w * 2 + 6
const EDGE = PANEL.from + PANEL.w * PANEL.count + 40
const DOME = { x: EDGE + 130, r: 130, top: 60 }
const FALL = 230
const LOOK_ALONG = 130

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

/** One panel of bulbs: dead grey bulbs on a dark face, so he reads black in front of it. */
function Panel({ i, light }: { i: number; light: Light }) {
  const x = PANEL.from + PANEL.w * i
  const h = PANEL.low - PANEL.high
  const gapX = (PANEL.w - 16) / BULBS.cols
  const gapY = (h - 16) / BULBS.rows
  const bulbs = Array.from({ length: BULBS.cols * BULBS.rows }, (_, k) => ({ cx: x + 8 + gapX * ((k % BULBS.cols) + 0.5), cy: PANEL.high + 8 + gapY * (Math.floor(k / BULBS.cols) + 0.5) }))
  return (
    <g>
      <rect x={x + 3} y={PANEL.high} width={PANEL.w - 6} height={h} fill={light.mid} />
      <g fill={light.far} opacity={0.6}>
        {bulbs.map(({ cx, cy }) => (
          <circle key={`${cx} ${cy}`} cx={cx} cy={cy} r={6} />
        ))}
      </g>
      <g data-fx={`panel-${i}`} opacity="0">
        <rect x={x - 30} y={PANEL.high - 40} width={PANEL.w + 60} height={h + 70} fill="url(#sign-glare)" />
        <path d={`M${x + 6} ${PANEL.low} L${x - 30} 0 H${x + PANEL.w + 30} L${x + PANEL.w - 6} ${PANEL.low} Z`} fill={SHADE.glow} opacity={0.45} />
        <g fill={SHADE.glow}>
          {bulbs.map(({ cx, cy }) => (
            <circle key={`${cx} ${cy}`} cx={cx} cy={cy} r={7.5} />
          ))}
        </g>
        {/* the arcs crackling from the panel down onto the roof */}
        <path d={`M${x + 18} ${PANEL.low} l-10 8 l12 4 l-14 12 M${x + PANEL.w - 18} ${PANEL.low} l8 8 l-12 5 l10 11`} stroke={SHADE.glow} strokeWidth={2.5} fill="none" />
      </g>
    </g>
  )
}

export const ventures: Place = {
  region: 'city',
  length: DOME.x,
  script: [1600, 1500, 1500],
  ends: [0.34, 0.66, 1],
  gaps: [[EDGE, EDGE + 500]],
  // the camera looks along the sign while the light walks it and he cuts it, so on a phone it is whole in frame
  lead: (t) => LOOK_ALONG * (ramp(t, 0.02, 0.1) - ramp(t, 0.66, 0.8)),
  phoneTop: 600,
  obstacle: ({ light }: { light: Light }) => (
    <>
      <defs>
        <radialGradient id="sign-glare">
          <stop offset="0" stopColor={SHADE.glow} stopOpacity="0.85" />
          <stop offset="1" stopColor={SHADE.glow} stopOpacity="0" />
        </radialGradient>
      </defs>
      <g data-fx="sign">
        {/* the scaffold the sign stands on, its frame and the struts behind */}
        <path
          d={`M${PANEL.from - 10} ${PANEL.high - 18} H${PANEL.from + PANEL.w * PANEL.count + 10} M${PANEL.from - 10} ${PANEL.low + 6} H${PANEL.from + PANEL.w * PANEL.count + 10} ${Array.from({ length: PANEL.count + 1 }, (_, i) => `M${PANEL.from + PANEL.w * i} ${PANEL.high - 30} V0`).join(' ')}`}
          stroke={SHADE.black}
          strokeWidth={6}
        />
        <path d={`M${PANEL.from + 20} ${PANEL.high - 30} L${PANEL.from + 60} ${PANEL.high - 110} M${PANEL.from + PANEL.w * 4} ${PANEL.high - 30} L${PANEL.from + PANEL.w * 4 - 40} ${PANEL.high - 120}`} stroke={SHADE.black} strokeWidth={4} />
        {Array.from({ length: PANEL.count }, (_, i) => (
          <Panel key={i} i={i} light={light} />
        ))}
      </g>
      {/* the cable hanging from the sign's frame */}
      <g data-fx="cable">
        <path d={`M${CABLE} ${PANEL.high - 18} Q${CABLE - 8} -120 ${CABLE} -78 l-7 12 h14 Z`} stroke={SHADE.black} strokeWidth={4} fill={SHADE.black} />
      </g>
      {/* the roof's edge and the glass dome below it, its ribs catching the light */}
      <rect x={EDGE - 6} y={-6} width={12} height={70} fill={SHADE.black} />
      <g data-fx="dome" stroke={light.rim} strokeOpacity={0.55} strokeWidth={2.5} fill="none">
        <path d={`M${DOME.x - DOME.r} ${DOME.top + DOME.r} A${DOME.r} ${DOME.r} 0 0 1 ${DOME.x + DOME.r} ${DOME.top + DOME.r}`} fill={light.far} fillOpacity={0.25} />
        <path d={`M${DOME.x} ${DOME.top} V${DOME.top + DOME.r} M${DOME.x - DOME.r * 0.7} ${DOME.top + DOME.r * 0.3} Q${DOME.x - DOME.r * 0.3} ${DOME.top + DOME.r * 0.6} ${DOME.x - DOME.r * 0.4} ${DOME.top + DOME.r} M${DOME.x + DOME.r * 0.7} ${DOME.top + DOME.r * 0.3} Q${DOME.x + DOME.r * 0.3} ${DOME.top + DOME.r * 0.6} ${DOME.x + DOME.r * 0.4} ${DOME.top + DOME.r}`} />
      </g>
      <rect x={DOME.x - DOME.r - 30} y={DOME.top + DOME.r} width={DOME.r * 2 + 60} height={1000} fill={SHADE.black} />
      <g data-fx="glass" opacity="0" fill={light.rim} fillOpacity={0.7}>
        {[-60, -30, 0, 26, 52, 78].map((dx, i) => (
          <path key={dx} d={`M${DOME.x + dx} ${DOME.top + 10 + (i % 3) * 18} l12 -16 l7 18 Z`} />
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
      transformTo(glass, `translate(0 ${(90 * burst).toFixed(1)})`)
    }
  },
}
