import { mix } from '@/lib/motion/rigPose'
import type { Profession } from '@/lib/cv/professions'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, lerp } from '../../shared/stageNodes'
import { FIGURE_H, hangingPath } from '../forest'
import { SHADE, type Light } from '../palette'
import { arc, runFrame, type Frame, type Place } from '../place'
import { CROUCH, TUCK, rest } from '../pose'
import { Spider, bindSpider, type Point } from '../spider'

// Work, what hunts in the trees: the giant spider (research notes L45 to L47, [2]). Its legs come first, long
// and jointed, hooking down one after another out of the black canopy at the top right of the frame, much
// taller than he is (the C59 frames, f0300), while its body stays a dark mass up in the canopy with only its
// pale eyes showing. One front leg hunts: it hangs over his head, follows him and stabs straight down where he
// stands. The first time he walks under it, it stabs and the frame cuts to black: he is back a few steps
// earlier, the game's trial and death (L124 to L126, [1]), with nothing shown but the cut. The second time the
// body comes lower to watch him as he stands at the open trap on the path and the leg follows his head; it
// stabs, he leaps back, and the trap's jaws snap on the leg: its tip tears off in the jaws, the threat turned on
// itself (L133, [2]), and the spider draws its legs up and pulls back into the dark of the canopy.

const TRAP = 300
const DEATH_AT = 250
const CHECKPOINT = 110
const CLEAR = 220
const SCALE = 0.8
// His head's height, and the hunting leg's point hovering over it.
const HEAD = -FIGURE_H
const HOVER = HEAD - 90
// The body: up in the canopy, lowered to watch him, drawn back up.
const HIDDEN = { x: 330, y: -620 }
const WATCH = { x: 300, y: -440 }
// How much of the hunting leg's shin the trap tears off.
const TORN = 70

// The moss and roots hanging out of the canopy's underside, uneven along it.
const CLUMPS = [
  { x: -260, s: 0.31, w: 260, d: 90 },
  { x: 60, s: 0.77, w: 300, d: 120 },
  { x: 520, s: 0.52, w: 240, d: 80 },
  { x: 900, s: 0.13, w: 320, d: 130 },
]

// The leg's two stabs on the move's t: down, held, pulled up.
const STAB_1 = { down: 0.22, up: 0.27 }
const STAB_2 = { down: 0.78, snap: 0.8 }

// Where the legs that stand plant their feet, in the LEGS order of spider.tsx (the near legs, then the far):
// the two front legs (0 and 4) do not stand, the hunter and the one held up behind it.
const PLANTED: readonly Point[] = [
  { x: 0, y: 0 },
  { x: 150, y: 0 },
  { x: 470, y: 0 },
  { x: 610, y: 0 },
  { x: 0, y: 0 },
  { x: 200, y: 0 },
  { x: 540, y: 0 },
  { x: 670, y: 0 },
]
// When each standing leg hooks down out of the canopy, the far right ones first.
const ARRIVES = [0, 0.1, 0.06, 0.02, 0, 0.08, 0.04, 0.01]

function move(profession: Profession, t: number): Frame {
  if (t < 0.33) {
    if (t < STAB_1.down) return runFrame(profession, 0, DEATH_AT, ramp(t, 0, 0.2))
    return { pose: rest(profession), ahead: CHECKPOINT, lift: 0, over: 0 }
  }
  if (t < 0.66) {
    const walk = ramp(t, 0.36, 0.56)
    if (walk < 1) return runFrame(profession, CHECKPOINT, TRAP, walk)
    return { pose: rest(profession), ahead: TRAP, lift: 0, over: 0 }
  }
  const leap = ramp(t, 0.74, 0.86)
  if (leap === 0) return { pose: mix(rest(profession), CROUCH, ramp(t, 0.66, 0.74)), ahead: TRAP, lift: 0, over: 0 }
  if (leap < 1) return { pose: mix(TUCK, CROUCH, ramp(leap, 0.7, 1)), ahead: lerp(TRAP, CLEAR, leap), lift: arc(leap, 40), over: 0 }
  return { pose: CROUCH, ahead: CLEAR, lift: 0, over: 0 }
}

const toward = (from: Point, to: Point, u: number): Point => ({ x: lerp(from.x, to.x, u), y: lerp(from.y, to.y, u) })

/** The hunting leg's point at t: lowered over his head, following him, the two stabs, caught, torn, drawn up. */
function hunterAt(t: number, his: number): Point {
  const up = { x: 420, y: -560 }
  const over = { x: his + 14 * Math.sin(t * 40), y: HOVER + 10 * Math.sin(t * 23) }
  if (t < 0.24) {
    const hang = toward(up, over, ramp(t, 0.08, 0.16))
    return toward(hang, { x: DEATH_AT, y: 0 }, ramp(t, STAB_1.down - 0.02, STAB_1.down))
  }
  if (t < STAB_2.snap) return toward(toward(up, over, ramp(t, 0.27, 0.38)), { x: TRAP, y: 0 }, ramp(t, STAB_2.down - 0.02, STAB_2.down))
  // caught in the jaws a moment, then torn free and drawn up short into the dark
  return toward({ x: TRAP, y: -4 }, { x: 380, y: -330 }, ramp(t, 0.84, 0.97))
}

/** The spider's body at t: up in the canopy, lowered to watch him, drawn back up once the trap has it. */
function bodyAt(t: number): Point {
  const watch = toward(HIDDEN, WATCH, ramp(t, 0.36, 0.56))
  return toward(watch, { x: HIDDEN.x, y: HIDDEN.y + 120 }, ramp(t, 0.82, 0.98))
}

/** Every foot at t: each standing leg hooked down to its place and later drawn up under the body. */
function feetAt(t: number, his: number, body: Point): Point[] {
  const drawnUp = ramp(t, 0.84, 1)
  return PLANTED.map((foot, i) => {
    if (i === 0) return hunterAt(t, his)
    // the far front leg held up, curled, behind the hunter
    if (i === 4) return { x: body.x - 150 + 20 * Math.sin(t * 17), y: body.y + 190 + 30 * drawnUp }
    const hooked = toward({ x: foot.x + 40, y: -560 }, foot, ramp(t, ARRIVES[i], ARRIVES[i] + 0.08))
    return toward(hooked, { x: body.x + (foot.x - 300) * 0.5, y: body.y + 240 - (i % 4) * 22 }, drawnUp)
  })
}

export const work: Place = {
  // from lg held further left, so the spider's far legs planted ahead of him stay clear of the cards
  splitHold: { left: 350 },
  region: 'forest',
  length: TRAP,
  script: [1700, 1600, 1500],
  ends: [0.33, 0.66, 1],
  phoneTop: 640,
  obstacle: ({ light }: { light: Light }) => (
    <>
      {/* the canopy pressing down from the top, roots hanging out of it, the body's dark to hide in */}
      <path d="M-700 -1300 H1300 V-560 Q1120 -500 960 -540 Q760 -580 560 -520 Q360 -470 200 -540 Q40 -600 -120 -520 Q-300 -460 -460 -520 Q-600 -560 -700 -520 Z" fill={SHADE.black} />
      <g transform="translate(0 -545)" fill={SHADE.black}>
        {CLUMPS.map(({ x, s, w, d }) => (
          <path key={x} d={hangingPath(x, s, w, d)} />
        ))}
      </g>
      <Spider name="spider" rim={light.rim} />
      <g transform={`translate(${TRAP} 0)`} fill={SHADE.black}>
        <rect x={-24} y={-5} width={48} height={5} />
        <path data-fx="jaws-open" d="M-24 -5 Q-36 -26 -14 -32 L-11 -27 Q-24 -24 -19 -5 Z M24 -5 Q36 -26 14 -32 L11 -27 Q24 -24 19 -5 Z" />
        <g data-fx="jaws-shut" opacity="0">
          <path d="M-16 -5 Q-18 -26 -6 -31 L-4 -25 L-2 -32 L0 -25 L2 -32 L4 -25 L6 -31 Q18 -26 16 -5 Z" />
          {/* the leg's torn tip caught in the jaws */}
          <path d={`M-3 -34 L3 -34 L1 -${TORN * SCALE + 30} L0 -${TORN * SCALE + 38} L-1 -${TORN * SCALE + 30} Z`} />
        </g>
      </g>
      {/* the cut to black of the death */}
      <rect data-fx="cut" x={-2000} y={-1600} width={5000} height={3000} fill={SHADE.black} opacity="0" />
    </>
  ),
  move,
  reply: (stage, { profession }) => {
    const spider = bindSpider(stage, 'spider', SCALE)
    const open = fx(stage, 'jaws-open')
    const shut = fx(stage, 'jaws-shut')
    const cut = fx(stage, 'cut')
    return (t) => {
      const his = move(profession, t).ahead
      const body = bodyAt(t)
      const snap = ramp(t, STAB_2.snap - 0.01, STAB_2.snap)
      spider({
        ...body,
        tilt: -8 * ramp(t, 0.36, 0.56) + 10 * ramp(t, 0.8, 0.86),
        feet: feetAt(t, his, body),
        lost: [TORN * ramp(t, 0.83, 0.84), 0, 0, 0, 0, 0, 0, 0],
        eyes: 0.35 + 0.6 * ramp(t, 0.36, 0.5) - 0.5 * ramp(t, 0.86, 1),
      })
      fadeTo(open, 1 - snap)
      fadeTo(shut, snap)
      // the death: a hard cut to black, then the checkpoint fades back in
      fadeTo(cut, ramp(t, STAB_1.down, STAB_1.down + 0.005) * (1 - ramp(t, 0.25, 0.31)))
    }
  },
}
