import { ramp } from '@/lib/scroll/stage'
import { setRigPose } from '../../shared/rig'
import { fadeTo, fx } from '../../shared/stageNodes'
import { Canvas, FLOOR, Figure } from '../forest'
import { SHADE, type Light } from '../palette'
import type { Place } from '../place'
import { reach, shadeJoints } from '../pose'

// Contact in the clearing at the forest's end: an old lamp post stands at the edge of the path with a bear
// trap set before it. As the contact rises he reaches up to the lamp and it lights the clearing, the last
// light of the walk.

const LAMP_X = 1240
const HERO_X = LAMP_X - 110
const LAMP_Y = FLOOR - 420
const LIT_BY = [0.1, 0.5] as const

function Lamp({ light }: { light: Light }) {
  return (
    <Canvas>
      <rect x={LAMP_X - 8} y={LAMP_Y} width={16} height={FLOOR - LAMP_Y} fill={SHADE.black} />
      <path d={`M${LAMP_X - 34} ${LAMP_Y} H${LAMP_X + 34} L${LAMP_X + 24} ${LAMP_Y - 60} H${LAMP_X - 24} Z`} fill={SHADE.black} />
      <path d={`M${LAMP_X + 60} ${FLOOR} H${LAMP_X + 220} M${LAMP_X + 70} ${FLOOR} L${LAMP_X + 80} ${FLOOR - 24} L${LAMP_X + 90} ${FLOOR} L${LAMP_X + 100} ${FLOOR - 24} L${LAMP_X + 110} ${FLOOR} M${LAMP_X + 170} ${FLOOR} L${LAMP_X + 180} ${FLOOR - 24} L${LAMP_X + 190} ${FLOOR} L${LAMP_X + 200} ${FLOOR - 24} L${LAMP_X + 210} ${FLOOR}`} stroke={SHADE.black} strokeWidth={8} fill="none" />
      <g data-fx="lamp" opacity="0">
        <circle cx={LAMP_X} cy={LAMP_Y - 30} r={260} fill={light.rim} opacity={0.18} />
        <path d={`M${LAMP_X - 22} ${LAMP_Y - 6} H${LAMP_X + 22} L${LAMP_X + 16} ${LAMP_Y - 52} H${LAMP_X - 16} Z`} fill={light.rim} />
      </g>
    </Canvas>
  )
}

export const contact: Place = {
  mid: ({ light }) => <Lamp light={light} />,
  floor: ({ profession }) => <Figure x={HERO_X} profession={profession} />,
  bind: (stage, { profession }) => {
    const lamp = fx(stage, 'lamp')
    const root = fx(stage, 'figure')
    const joints = root ? shadeJoints(root) : null
    return (progress) => {
      const t = ramp(progress, ...LIT_BY)
      fadeTo(lamp, ramp(t, 0.6, 1))
      if (joints) setRigPose(joints, reach(profession, Math.min(ramp(t, 0, 0.6), 1 - 0.5 * ramp(t, 0.8, 1))))
    }
  },
}
