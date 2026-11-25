import { mix } from '@/lib/motion/rigPose'
import type { Profession } from '@/lib/cv/professions'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, lerp, transformTo } from '../../shared/stageNodes'
import { FIGURE_H } from '../forest'
import { SHADE } from '../palette'
import { arc, runFrame, type Frame, type Place } from '../place'
import { CROUCH, TUCK, rest } from '../pose'

// Work, what hunts in the trees: under a black canopy a long straight point lowers out of the dark, follows
// his head and stabs straight down where he stands (Limbo notes L45 to L47, [2]); an open iron trap lies on
// the path. The first time he walks under it, it stabs and the frame cuts to black: he is back a few steps
// earlier, the game's trial and death (L124 to L126, [1]), with nothing shown but the cut. The second time
// he stands still at the open trap while the point tracks him; it stabs, he leaps back, and the jaws snap
// on its tip, which tears off as the point pulls up into the dark: the threat turned on itself (L133, [2]).

const TRAP = 300
const DEATH_AT = 250
const CHECKPOINT = 110
const CLEAR = 220
// The point's tip: hovering over his head, and stabbed down to the ground.
const HOVER = -FIGURE_H - 70
const DOWN = -2
const TOP = -900

// The point's two stabs on the move's t: down, held, pulled up.
const STAB_1 = { down: 0.22, up: 0.27 }
const STAB_2 = { down: 0.78, snap: 0.8 }

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

/** Where the point's tip is at t: lowering out of the canopy, tracking him, the two stabs, then gone. */
function pointAt(t: number): { x: number; y: number } {
  if (t < 0.3) {
    const lower = ramp(t, 0.04, 0.16)
    const x = lerp(0, DEATH_AT, ramp(t, 0, 0.2))
    const stab = ramp(t, STAB_1.down - 0.02, STAB_1.down) - ramp(t, STAB_1.up, 0.3)
    return { x: x + 20 * (1 - ramp(t, 0, 0.2)), y: lerp(lerp(TOP, HOVER, lower), DOWN, stab) }
  }
  if (t < STAB_2.snap) {
    const lower = ramp(t, 0.36, 0.5)
    const follow = lerp(CHECKPOINT, TRAP, ramp(t, 0.36, 0.56))
    const sway = 14 * Math.sin(ramp(t, 0.56, 0.76) * Math.PI * 2)
    const stab = ramp(t, STAB_2.down - 0.02, STAB_2.down)
    return { x: follow + sway, y: lerp(lerp(TOP, HOVER, lower), DOWN, stab) }
  }
  return { x: TRAP, y: lerp(DOWN, TOP, ramp(t, STAB_2.snap + 0.02, 0.96)) }
}

export const work: Place = {
  region: 'forest',
  length: TRAP,
  script: [1700, 1600, 1500],
  ends: [0.33, 0.66, 1],
  obstacle: () => (
    <>
      {/* the canopy: a black mass across the top of the frame the point comes out of */}
      <path d={`M-700 -1200 H1300 V-560 Q900 -470 500 -540 Q120 -600 -300 -500 Q-520 -470 -700 -520 Z`} fill={SHADE.black} />
      <g data-fx="point">
        <path d={`M-5 -900 H5 L1 -10 L0 0 L-1 -10 Z`} fill={SHADE.black} />
      </g>
      <g transform={`translate(${TRAP} 0)`} fill={SHADE.black}>
        <rect x={-20} y={-4} width={40} height={4} />
        <path data-fx="jaws-open" d="M-20 -4 Q-30 -22 -12 -27 L-9 -23 Q-20 -20 -16 -4 Z M20 -4 Q30 -22 12 -27 L9 -23 Q20 -20 16 -4 Z" />
        <g data-fx="jaws-shut" opacity="0">
          <path d="M-11 -4 Q-12 -27 0 -30 Q12 -27 11 -4 Z" />
          {/* the broken tip caught in the jaws */}
          <path d="M-2 -30 L2 -30 L0.6 -52 L0 -60 L-0.6 -52 Z" />
        </g>
      </g>
      {/* the cut to black of the death */}
      <rect data-fx="cut" x={-2000} y={-1600} width={5000} height={3000} fill={SHADE.black} opacity="0" />
    </>
  ),
  move,
  reply: (stage) => {
    const point = fx(stage, 'point')
    const open = fx(stage, 'jaws-open')
    const shut = fx(stage, 'jaws-shut')
    const cut = fx(stage, 'cut')
    return (t) => {
      const { x, y } = pointAt(t)
      transformTo(point, `translate(${x.toFixed(1)} ${(y + 900).toFixed(1)})`)
      const snap = ramp(t, STAB_2.snap - 0.01, STAB_2.snap)
      fadeTo(open, 1 - snap)
      fadeTo(shut, snap)
      // the death: a hard cut to black, then the checkpoint fades back in
      fadeTo(cut, ramp(t, STAB_1.down, STAB_1.down + 0.005) * (1 - ramp(t, 0.25, 0.31)))
    }
  },
}
