import { mix } from '@/lib/motion/rigPose'
import type { Profession } from '@/lib/cv/professions'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, lerp, transformTo } from '../../shared/stageNodes'
import { FIGURE_H } from '../forest'
import { SHADE, type Light } from '../palette'
import { arc, outline, type Frame, type Place } from '../place'
import { BOUND, CROUCH, TUCK, rest } from '../pose'
import { MOUTH, Spider, bindSpider, toWorld, walkingFeet, type Point } from '../spider'

// Tech Stack, caught and away: the spider gets its revenge (research notes L48 to L50, [2] [1]). It stands
// over him on the hilltop, smaller in the frame now and with the points gone from two of its legs, and lets
// down a grey wrapping on a thread of silk that binds him; he wriggles free enough to hop in short bursts to a
// boulder at the hill's lip, lands on it as it rolls and keeps his footing on it down the slope, the spider
// running down behind him, its legs working, near enough to reach. At the foot he is thrown off, rolling, and
// the wrapping tears away; the spider stops short on the slope behind him and rears up, its front legs raised.

// The hill: flat on top, then a slope down to the floor.
const HILL = { h: 120, lip: 200, foot: 540 }
const BOULDER = { r: 38, at: 230 }
const THROWN = 640
const HOPS = [40, 100, 160] as const
const SCALE = 0.5
// The spider's body stands this high over the ground under it; its feet `SPREAD` apart, a step `STRIDE` long.
const STANCE = 160
const SPREAD = 100
const STRIDE = 70
// Where the spider stands over him, how far behind him it runs, and where it stops on the slope.
const OVER = -110
const BEHIND = 140
const STOPS = 490
// The two legs whose points the trap took.
const LOST = [0, 60, 0, 0, 0, 0, 50, 0]

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

/** The spider's body along the ground at t: over him while it wraps him, creeping after his hops, running
 *  down behind the boulder, stopping short on the slope. */
function spiderAt(t: number): number {
  const creep = lerp(OVER, 30, ramp(t, 0.12, 0.34))
  const chase = Math.max(creep, boulderAt(Math.min(t, 0.68)) - BEHIND)
  return lerp(chase, STOPS, ramp(t, 0.68, 0.86))
}

/** The spider's frame at t, facing right after him: walking on the hill's ground, rearing up once it stops. */
function spiderFrame(t: number) {
  const x = spiderAt(t)
  const rear = ramp(t, 0.84, 0.96)
  const y = -groundAt(x) - STANCE - 30 * rear - 80 * (1 - ramp(t, 0.1, 0.3))
  const feet = walkingFeet(x, STRIDE, -SPREAD, groundAt)
  // its two front legs held up over him as it lets the wrapping down, and again as it rears
  const raised = Math.max(1 - ramp(t, 0.1, 0.18), rear)
  const front = (i: number, reach: number): Point => {
    const up = { x: x + reach, y: y - 40 + 20 * Math.sin(t * 30 + i) }
    return { x: lerp(feet[i].x, up.x, raised), y: lerp(feet[i].y, up.y, raised) }
  }
  return { x, y, facing: -1 as const, tilt: -14 * rear, feet: feet.map((foot, i) => (i === 0 ? front(0, 150) : i === 4 ? front(4, 120) : foot)), lost: LOST, eyes: 0.9 }
}

export const tech: Place = {
  // from lg held a little further right, so the spider's legs reaching back over him stay clear of the cards
  splitHold: { right: 1190 },
  region: 'forest',
  length: THROWN,
  script: [1600, 1700, 1500],
  ends: [0.34, 0.68, 1],
  phoneTop: 600,
  obstacle: ({ light }: { light: Light }) => (
    <>
      <path d={`M-900 4 V${-HILL.h} H${HILL.lip} L${HILL.foot} 4 Z`} fill={SHADE.black} />
      <path data-fx="silk" stroke={light.far} strokeWidth={2} strokeOpacity={0.9} fill="none" />
      <Spider name="spider" rim={light.rim} />
      <g data-fx="boulder">
        <circle r={BOULDER.r} fill={SHADE.black} />
        <path d={`M${-BOULDER.r * 0.5} ${-BOULDER.r * 0.4} q10 -8 22 -4`} stroke={light.rim} strokeOpacity={0.3} strokeWidth={2} fill="none" />
      </g>
      {/* the wrapping: bound round him, then two torn halves on the ground */}
      <g data-fx="wrap" opacity="0">
        <ellipse cx={0} cy={-FIGURE_H * 0.42} rx={14} ry={FIGURE_H * 0.4} fill={light.far} />
        <path d={`M-13 ${-FIGURE_H * 0.7} q13 7 26 0 M-13 ${-FIGURE_H * 0.5} q13 7 26 0 M-13 ${-FIGURE_H * 0.3} q13 7 26 0 M-13 ${-FIGURE_H * 0.12} q13 6 26 0`} stroke={SHADE.black} strokeOpacity={0.45} strokeWidth={1.5} fill="none" />
      </g>
      <g data-fx="torn" opacity="0" fill={light.far}>
        <path d={`M${THROWN - 40} 0 q8 -14 22 -8 q6 4 2 8 Z M${THROWN + 26} 0 q6 -12 18 -6 q4 3 0 6 Z`} />
      </g>
    </>
  ),
  move,
  reply: (stage, { profession }) => {
    const spider = bindSpider(stage, 'spider', SCALE)
    const boulder = fx(stage, 'boulder')
    const wrap = fx(stage, 'wrap')
    const torn = fx(stage, 'torn')
    const silk = fx(stage, 'silk')
    return (t) => {
      const x = boulderAt(t)
      transformTo(boulder, `translate(${x.toFixed(1)} ${(-groundAt(x) - BOULDER.r).toFixed(1)}) rotate(${((x - BOULDER.at) * 1.5).toFixed(1)})`)
      const pose = spiderFrame(t)
      spider(pose)
      // the wrapping comes down the silk from its fangs over him, rides on him, and tears off as he tumbles
      const frame = move(profession, t, THROWN)
      const drop = ramp(t, 0, 0.08)
      const mouth = toWorld(pose, MOUTH, SCALE)
      const wrapTop = -frame.lift - FIGURE_H * 0.82
      const hangs = lerp(mouth.y, wrapTop, drop)
      transformTo(wrap, `translate(${frame.ahead.toFixed(1)} ${(hangs - wrapTop - frame.lift).toFixed(1)})`)
      const tear = ramp(t, 0.82, 0.86)
      fadeTo(wrap, ramp(t, 0, 0.02) * (1 - tear))
      fadeTo(torn, tear)
      // the thread runs from its fangs to the wrapping until he hops free of it
      const thread = 1 - ramp(t, 0.12, 0.16)
      outline(silk, thread > 0 ? `M${mouth.x.toFixed(1)} ${mouth.y.toFixed(1)} L${lerp(mouth.x, frame.ahead, thread).toFixed(1)} ${lerp(mouth.y, hangs, thread).toFixed(1)}` : '')
    }
  },
}
