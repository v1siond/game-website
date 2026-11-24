import { mix } from '@/lib/motion/rigPose'
import { ramp } from '@/lib/scroll/stage'
import { setRigPose } from '../../shared/rig'
import { fadeTo, fx, lerp, transformTo } from '../../shared/stageNodes'
import { Canvas, FLOOR, Figure, figureAt } from '../forest'
import { SHADE, type Light } from '../palette'
import { START, moveAt, type Scene } from '../place'
import { pull, run, shadeJoints } from '../pose'

// Contact in the clearing at the forest's end: an old lamp post with its lever at the edge of the path. He
// runs out of the trees to it; then he throws the lever and the lamp lights the clearing, the last light of
// the walk, and he holds with the lever thrown under the lit lamp.

const LAMP_X = 1240
const FROM_X = 700
const TO_X = LAMP_X - 110
const LAMP_Y = FLOOR - 420
const STEP = 70

function Lamp({ light }: { light: Light }) {
  return (
    <Canvas>
      <rect x={LAMP_X - 8} y={LAMP_Y} width={16} height={FLOOR - LAMP_Y} fill={SHADE.black} />
      <path d={`M${LAMP_X - 34} ${LAMP_Y} H${LAMP_X + 34} L${LAMP_X + 24} ${LAMP_Y - 60} H${LAMP_X - 24} Z`} fill={SHADE.black} />
      <rect x={LAMP_X - 40} y={FLOOR - 90} width={24} height={30} fill={SHADE.black} />
      <g data-fx="lamp" opacity="0">
        <circle cx={LAMP_X} cy={LAMP_Y - 30} r={260} fill={light.rim} opacity={0.18} />
        <path d={`M${LAMP_X - 22} ${LAMP_Y - 6} H${LAMP_X + 22} L${LAMP_X + 16} ${LAMP_Y - 52} H${LAMP_X - 16} Z`} fill={light.rim} />
      </g>
    </Canvas>
  )
}

// He runs out over the first action and throws the lever over the second.
const ENDS = [0.55, 1]

export const contact: Scene = {
  script: [1600, 1400],
  mid: ({ light }) => <Lamp light={light} />,
  floor: ({ profession }) => <Figure x={FROM_X} profession={profession} />,
  bind: (stage, { profession }) => {
    const lamp = fx(stage, 'lamp')
    const root = fx(stage, 'figure')
    const joints = root ? shadeJoints(root) : null
    return (_progress, _reached, play = START) => {
      const t = moveAt(ENDS, play)
      const along = ramp(t, 0, 0.55)
      const x = lerp(FROM_X, TO_X, along)
      const thrown = ramp(t, 0.58, 0.85)
      transformTo(root, figureAt(x))
      fadeTo(lamp, ramp(t, 0.8, 0.92))
      if (joints) setRigPose(joints, thrown > 0 ? pull(profession, thrown) : mix(pull(profession, 0), run(profession, (x - FROM_X) / STEP), along > 0 && along < 1 ? 1 : 0))
    }
  },
}
