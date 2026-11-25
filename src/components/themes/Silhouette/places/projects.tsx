import { mix } from '@/lib/motion/rigPose'
import type { Profession } from '@/lib/cv/professions'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, lerp } from '../../shared/stageNodes'
import { Girl, placeGirl } from '../children'
import { Hangers, Worm, bindHangers, bindWorm } from '../crawlers'
import { FIGURE_H, Hut } from '../forest'
import { SHADE, type Light } from '../palette'
import { outline, runFrame, type Frame, type Place } from '../place'
import { REACH, march, rest } from '../pose'

// Projects, the light and pulled away: the forest's last stretch, the lit window close now just across a
// ravine, and under it, for a moment, the small girl he searches for, her back to him. A glowing worm drops
// from the branch over him onto his head and his steps go where it wants, away from her (research notes L66 to
// L71, [2] [11] [1] [18] [19]); this is the game's false ending, the one he searches for seen and out of reach.
// He is marched back the way he came while across the ravine she walks off into the fog and is lost; the
// lamp's cone of light swings him round; he steps under the low overhang and reaches up, and the creatures
// hanging from it drop on their stalks, close their thin legs on the worm and take it up into the dark.
// Across the ravine the window has gone dark.

const LAMP = 30
const RAVINE = [240, 300] as const
const GIRL = 335
const HUT = 385
const EDGE = 220
const UP_AT = 110
const OVERHANG = 200
const HANGERS = { xs: [72, 98, 124, 150], top: -OVERHANG - 15 }
// Where the worm rides: on the top of his head.
const CROWN = FIGURE_H * 0.97
const BRANCH = { x: EDGE + 4, y: -300 }

function move(profession: Profession, t: number): Frame {
  if (t < 0.36) {
    const walk = ramp(t, 0, 0.12)
    if (walk < 1) return runFrame(profession, 0, EDGE, walk)
    if (t < 0.17) return { pose: rest(profession), ahead: EDGE, lift: 0, over: 0 }
    const u = ramp(t, 0.17, 0.36)
    return { pose: u < 1 ? march(lerp(EDGE, LAMP, u) / 26) : rest(profession), ahead: lerp(EDGE, LAMP, u), lift: 0, over: 0, back: true }
  }
  if (t < 0.6) {
    const turn = ramp(t, 0.4, 0.46)
    if (turn < 1) return { pose: rest(profession), ahead: LAMP, lift: 0, over: 0, back: turn < 0.5 }
    return runFrame(profession, LAMP, UP_AT, ramp(t, 0.46, 0.6))
  }
  const reach = ramp(t, 0.64, 0.72) - ramp(t, 0.9, 0.96)
  return { pose: mix(rest(profession), REACH, reach), ahead: UP_AT, lift: 0, over: 0 }
}

/** How far the creatures drop on their stalks: down onto the worm, and back up with it. */
const dropAt = (t: number): number => 70 * (ramp(t, 0.72, 0.8) - ramp(t, 0.84, 0.94))

export const projects: Place = {
  region: 'forest',
  length: EDGE,
  script: [1700, 1500, 1700],
  ends: [0.36, 0.6, 1],
  gaps: [RAVINE],
  phoneTop: 600,
  obstacle: ({ light }: { light: Light }) => (
    <>
      <defs>
        <linearGradient id="lamp-cone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={SHADE.glow} stopOpacity="0.55" />
          <stop offset="1" stopColor={SHADE.glow} stopOpacity="0.08" />
        </linearGradient>
      </defs>
      {/* the lamp on its post, its cone of light falling on the ground */}
      <path d={`M${LAMP - 90} 0 L${LAMP + 2} -168 H${LAMP + 22} L${LAMP + 110} 0 Z`} fill="url(#lamp-cone)" />
      <path d={`M${LAMP - 4} 0 V-200 H${LAMP + 18} V-190 H${LAMP + 4} V0 Z`} fill={SHADE.black} />
      <path d={`M${LAMP + 2} -190 H${LAMP + 22} L${LAMP + 18} -170 H${LAMP + 6} Z`} fill={SHADE.black} />
      <circle cx={LAMP + 12} cy={-168} r={6} fill={SHADE.glow} />
      {/* the low overhang the creatures hang from */}
      <path d={`M${UP_AT - 150} -1000 V${-OVERHANG - 40} Q${UP_AT - 60} ${-OVERHANG + 10} ${UP_AT + 20} ${-OVERHANG - 10} Q${UP_AT + 90} ${-OVERHANG - 30} ${UP_AT + 140} ${-OVERHANG - 90} V-1000 Z`} fill={SHADE.black} />
      <Hangers name="hangers" xs={HANGERS.xs} top={HANGERS.top} />
      {/* the tree at the ravine's edge and the branch over him the worm hangs from */}
      <path d={`M${RAVINE[0] - 26} 2 Q${RAVINE[0] - 14} -200 ${RAVINE[0] - 18} -1000 H${RAVINE[0] + 14} Q${RAVINE[0] + 4} -200 ${RAVINE[0] + 6} 2 Z M${RAVINE[0] - 12} -300 Q${BRANCH.x - 40} -330 ${BRANCH.x - 90} -360 L${BRANCH.x - 92} -352 Q${BRANCH.x - 40} -318 ${RAVINE[0] - 12} -284 Z`} fill={SHADE.black} />
      <path data-fx="worm-thread" stroke={light.far} strokeWidth={1.5} />
      <rect x={RAVINE[0]} y={0} width={RAVINE[1] - RAVINE[0]} height={1000} fill={light.mid} opacity={0.5} />
      <g transform={`translate(${HUT} 0)`}>
        <Hut name="near-hut" w={56} fill={light.mid} />
      </g>
      <Girl name="far-girl" />
      <Worm name="worm" />
    </>
  ),
  move,
  reply: (stage, { profession }) => {
    const worm = bindWorm(stage, 'worm')
    const thread = fx(stage, 'worm-thread')
    const hangers = bindHangers(stage, 'hangers', HANGERS.xs, HANGERS.top)
    const window = fx(stage, 'near-hut-window')
    const girl = fx(stage, 'far-girl')
    const girlEye = fx(stage, 'far-girl-eye')
    return (t) => {
      const frame = move(profession, t)
      // the worm hangs from the branch, drops onto his head and rides it, then goes up with the creatures
      const drop = ramp(t, 0.13, 0.17)
      const head = { x: frame.ahead + (frame.back ? -3 : 3), y: -frame.lift - CROWN }
      const taken = ramp(t, 0.84, 0.94)
      const hangsAt = BRANCH.y + 60
      const at = t < 0.17 ? { x: lerp(BRANCH.x, head.x, drop), y: lerp(hangsAt, head.y, drop * drop) } : { x: head.x, y: head.y - (70 - dropAt(t)) * taken }
      const riding = t >= 0.17 && taken === 0
      // hanging it points down its thread; on his head it lies along it, trailing behind his face
      const along = riding ? (frame.back ? 0.15 : Math.PI - 0.15) : -Math.PI / 2
      worm(at, along, t * 9, ramp(t, 0.02, 0.05) * (1 - ramp(t, 0.9, 0.95)))
      outline(thread, drop < 1 ? `M${BRANCH.x} ${BRANCH.y} L${at.x.toFixed(1)} ${(at.y - 40).toFixed(1)}` : '')
      hangers(dropAt(t), ramp(t, 0.68, 0.76), ramp(t, 0.8, 0.84), t * 3)
      // across the ravine the girl stands with her back to him, then walks on into the fog and is gone
      const away = ramp(t, 0.22, 0.4)
      placeGirl(girl, girlEye, { x: GIRL + 50 * away, turn: 0, size: 0.85, shown: ramp(t, 0.04, 0.1) * (1 - away) })
      fadeTo(window, 1 - ramp(t, 0.9, 0.98))
    }
  },
}
