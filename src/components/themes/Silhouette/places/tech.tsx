import { mix } from '@/lib/motion/rigPose'
import type { Profession } from '@/lib/cv/professions'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, lerp, transformTo } from '../../shared/stageNodes'
import { FIGURE_H } from '../forest'
import { SHADE, type Light } from '../palette'
import { arc, type Frame, type Place } from '../place'
import { BOUND, CROUCH, TUCK, rest } from '../pose'

// Tech Stack, caught and away: the hunter gets its revenge and a grey wrapping drops over him from above and
// binds him; he wriggles free enough to hop in short bursts to a boulder at the hill's lip, lands on it as
// it rolls, keeps his footing on it down the slope, and is thrown off at the foot, rolling, the wrapping
// torn away (research notes L48 to L50, [2] [1]). Behind him the dark between the trunks follows him down.

// The hill: flat on top, then a slope down to the floor.
const HILL = { h: 120, lip: 200, foot: 540 }
const BOULDER = { r: 38, at: 230 }
const THROWN = 640
const HOPS = [40, 100, 160] as const

/** The ground's height under x on the hill. */
const groundAt = (x: number): number => HILL.h * (1 - ramp(x, HILL.lip, HILL.foot))

/** Where the boulder's centre is along the ground at t: still at the lip, rolling to the foot and on. */
const boulderAt = (t: number): number => lerp(BOULDER.at, THROWN + 260, ramp(t, 0.36, 0.86) ** 1.6)

function move(profession: Profession, t: number, length: number): Frame {
  if (t < 0.34) {
    const u = ramp(t, 0.08, 0.34)
    const hop = Math.min(HOPS.length - 1, Math.floor(u * HOPS.length))
    const v = u * HOPS.length - hop
    const from = hop === 0 ? 0 : HOPS[hop - 1]
    return { pose: BOUND, ahead: u === 0 ? 0 : lerp(from, HOPS[hop], v), lift: HILL.h + (u === 0 ? 0 : arc(v, 14)), over: 0 }
  }
  const onto = ramp(t, 0.34, 0.4)
  const top = HILL.h + BOULDER.r * 2
  if (onto < 1) return { pose: mix(BOUND, CROUCH, onto), ahead: lerp(HOPS[2], BOULDER.at, onto), lift: arc(onto, 30, top - HILL.h) + HILL.h, over: 0 }
  if (t < 0.68) {
    const x = boulderAt(t)
    const sway = 4 * Math.sin(ramp(t, 0.4, 0.68) * Math.PI * 4)
    return { pose: { ...CROUCH, lean: CROUCH.lean + sway }, ahead: x, lift: groundAt(x) + BOULDER.r * 2, over: 0 }
  }
  const off = boulderAt(0.68)
  const tumble = ramp(t, 0.68, 0.9)
  if (tumble < 1) return { pose: TUCK, ahead: lerp(off, length, tumble), lift: lerp(groundAt(off) + BOULDER.r * 2, 0, ramp(tumble, 0, 0.5)) + arc(tumble, 20), over: 2 * tumble }
  return { pose: mix(CROUCH, rest(profession), ramp(t, 0.9, 1)), ahead: length, lift: 0, over: 0 }
}

export const tech: Place = {
  region: 'forest',
  length: THROWN,
  script: [1600, 1700, 1500],
  ends: [0.34, 0.68, 1],
  obstacle: ({ light }: { light: Light }) => (
    <>
      <path d={`M-900 4 V${-HILL.h} H${HILL.lip} L${HILL.foot} 4 Z`} fill={SHADE.black} />
      <g data-fx="boulder">
        <circle r={BOULDER.r} fill={SHADE.black} />
        <path d={`M${-BOULDER.r * 0.5} ${-BOULDER.r * 0.4} q10 -8 22 -4`} stroke={light.rim} strokeOpacity={0.3} strokeWidth={2} fill="none" />
      </g>
      {/* the wrapping: bound round him, then two torn halves on the ground */}
      <g data-fx="wrap" opacity="0">
        <ellipse cx={0} cy={-FIGURE_H * 0.42} rx={13} ry={FIGURE_H * 0.36} fill={light.far} />
        <path d={`M-12 ${-FIGURE_H * 0.6} q12 6 24 0 M-12 ${-FIGURE_H * 0.4} q12 6 24 0 M-12 ${-FIGURE_H * 0.2} q12 6 24 0`} stroke={SHADE.black} strokeOpacity={0.5} strokeWidth={1.5} fill="none" />
      </g>
      <g data-fx="torn" opacity="0" fill={light.far}>
        <path d={`M${THROWN - 40} 0 q8 -14 22 -8 q6 4 2 8 Z M${THROWN + 26} 0 q6 -12 18 -6 q4 3 0 6 Z`} />
      </g>
    </>
  ),
  move,
  reply: (stage, { profession }) => {
    const boulder = fx(stage, 'boulder')
    const wrap = fx(stage, 'wrap')
    const torn = fx(stage, 'torn')
    return (t) => {
      const x = boulderAt(t)
      transformTo(boulder, `translate(${x.toFixed(1)} ${(-groundAt(x) - BOULDER.r).toFixed(1)}) rotate(${((x - BOULDER.at) * 1.5).toFixed(1)})`)
      // the wrapping drops over him from above, rides on him, and tears off as he tumbles
      const frame = move(profession, t, THROWN)
      const drop = ramp(t, 0, 0.08)
      transformTo(wrap, `translate(${frame.ahead.toFixed(1)} ${(-frame.lift - 300 * (1 - drop)).toFixed(1)})`)
      const tear = ramp(t, 0.82, 0.86)
      fadeTo(wrap, ramp(t, 0, 0.03) * (1 - tear))
      fadeTo(torn, tear)
    }
  },
}

