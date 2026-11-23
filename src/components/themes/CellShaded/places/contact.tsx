import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx } from '../../shared/stageNodes'
import { CEL } from '../palette'
import type { Place } from '../place'
import { Canvas, Commando, FLOOR, HOURS, placeCommando } from '../desert'
import { build, celJoints, setCelPose } from '../pose'

// Contact at night: the station's pad glows in the desert dark and, as the contact rises, it builds him up
// on it in its hologram light, standing whole by the time the scroll nears the end.

const PAD_X = 1180
const BUILT_BY = 0.55

/** The station: its frame over the pad, and the pad's rings that light as it builds him. */
function Station() {
  return (
    <Canvas>
      <path d={`M${PAD_X - 150} ${FLOOR} V${FLOOR - 420} L${PAD_X - 110} ${FLOOR - 460} H${PAD_X + 110} L${PAD_X + 150} ${FLOOR - 420} V${FLOOR}`} fill="none" stroke={CEL.steelDark} strokeWidth="18" />
      <rect x={PAD_X - 40} y={FLOOR - 452} width={80} height={16} fill={CEL.holo} />
      <ellipse cx={PAD_X} cy={FLOOR} rx={150} ry={22} fill={CEL.steelDark} />
      <g data-fx="rings" opacity="0">
        <path d={`M${PAD_X - 110} ${FLOOR - 400} L${PAD_X + 110} ${FLOOR - 400} L${PAD_X + 140} ${FLOOR} L${PAD_X - 140} ${FLOOR} Z`} fill={CEL.holo} opacity="0.25" data-bare />
        <ellipse cx={PAD_X} cy={FLOOR} rx={130} ry={18} fill="none" stroke={CEL.holo} strokeWidth="6" data-bare />
        <ellipse cx={PAD_X} cy={FLOOR - 140} rx={100} ry={14} fill="none" stroke={CEL.holo} strokeWidth="5" data-bare />
      </g>
    </Canvas>
  )
}

export const contact: Place = {
  hour: HOURS.night,
  set: () => <Station />,
  floor: ({ profession }) => <Commando x={PAD_X} profession={profession} />,
  bind: (stage, { profession }) => {
    const rings = fx(stage, 'rings')
    const root = fx(stage, 'commando')
    const joints = root ? celJoints(root) : null
    placeCommando(root, PAD_X)
    return (progress) => {
      const t = ramp(progress, 0.05, BUILT_BY)
      fadeTo(rings, Math.min(ramp(t, 0, 0.2), 1 - 0.6 * ramp(t, 0.7, 1)))
      if (joints) setCelPose(joints, build(profession, t))
    }
  },
}
