import { mix } from '@/lib/motion/rigPose'
import { ramp } from '@/lib/scroll/stage'
import { setRigPose } from '../../shared/rig'
import { fx, lerp, transformTo } from '../../shared/stageNodes'
import { Canvas, FLOOR, Figure, placeFigure } from '../forest'
import { SHADE } from '../palette'
import type { Place } from '../place'
import { hang, shadeJoints, walk } from '../pose'

// The hero: the edge of the forest at dawn, a rope hanging out of the boughs ahead of him. He stands in
// the grass as the page opens; as it starts to scroll he walks to the rope and takes it, hanging his
// weight off it as the forest sinks.

const HERO_X = 1080
const ROPE_X = 1290
const ROPE_END = FLOOR - 300
// The share of the hero's scroll he walks over, then the share he takes the rope over.
const WALK = [0.08, 0.38] as const
const GRAB = [0.38, 0.6] as const
const STEP = 46

const ropeAt = (sway: number): string => `rotate(${sway.toFixed(2)} ${ROPE_X} 0)`

/** The rope out of the boughs, its knot at the end, and the grass mound he wakes on. */
function Rope() {
  return (
    <Canvas>
      <path d={`M${HERO_X - 160} ${FLOOR + 4} Q${HERO_X - 140} ${FLOOR - 36} ${HERO_X - 40} ${FLOOR - 40} H${HERO_X + 80} Q${HERO_X + 120} ${FLOOR - 30} ${HERO_X + 130} ${FLOOR + 4} Z`} fill={SHADE.black} />
      <g data-fx="rope" transform={ropeAt(0)}>
        <line x1={ROPE_X} y1={0} x2={ROPE_X} y2={ROPE_END} stroke={SHADE.black} strokeWidth={7} />
        <circle cx={ROPE_X} cy={ROPE_END + 6} r={10} fill={SHADE.black} />
      </g>
    </Canvas>
  )
}

export const hero: Place = {
  mid: () => <Rope />,
  floor: ({ profession }) => <Figure x={HERO_X} profession={profession} />,
  bind: (stage, { profession }) => {
    const rope = fx(stage, 'rope')
    const root = fx(stage, 'figure')
    const joints = root ? shadeJoints(root) : null
    return (progress) => {
      const along = ramp(progress, ...WALK)
      const x = lerp(HERO_X, ROPE_X - 30, along)
      const held = ramp(progress, ...GRAB)
      placeFigure(root, x)
      transformTo(rope, ropeAt(3 * held * Math.sin(held * Math.PI)))
      if (!joints) return
      const moving = along > 0 && along < 1 ? 1 : 0
      setRigPose(joints, mix(hang(profession, held), walk(profession, (x - HERO_X) / STEP), moving))
    }
  },
}
