import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx } from '../../shared/stageNodes'
import { CEL } from '../palette'
import { START, moveAt, type Place } from '../place'
import { Canvas, Commando, FLOOR, HOURS, placeCommando } from '../desert'
import { build, celJoints, setCelPose } from '../pose'

// Contact at night: the respawn station in the desert dark. First its pad lights; then it builds him up on
// it in its hologram light, from his feet, until he stands whole.

/** Where the station stands: right of the contact text on a wide screen, the middle of a phone's view. */
const padX = (phone: boolean): number => (phone ? 760 : 1180)
// The pad lights over the first action; the build fills the second.
const ENDS = [0.2, 1]

/** The station round `x`: its frame over the pad, and the pad's rings that light as it builds him. */
function Station({ x }: { x: number }) {
  return (
    <Canvas>
      <path d={`M${x - 150} ${FLOOR} V${FLOOR - 420} L${x - 110} ${FLOOR - 460} H${x + 110} L${x + 150} ${FLOOR - 420} V${FLOOR}`} fill="none" stroke={CEL.steelDark} strokeWidth="18" />
      <rect x={x - 40} y={FLOOR - 452} width={80} height={16} fill={CEL.holo} />
      <ellipse cx={x} cy={FLOOR} rx={150} ry={22} fill={CEL.steelDark} />
      <g data-fx="rings" opacity="0">
        <path d={`M${x - 110} ${FLOOR - 400} L${x + 110} ${FLOOR - 400} L${x + 140} ${FLOOR} L${x - 140} ${FLOOR} Z`} fill={CEL.holo} opacity="0.25" data-bare />
        <ellipse cx={x} cy={FLOOR} rx={130} ry={18} fill="none" stroke={CEL.holo} strokeWidth="6" data-bare />
        <ellipse cx={x} cy={FLOOR - 140} rx={100} ry={14} fill="none" stroke={CEL.holo} strokeWidth="5" data-bare />
      </g>
    </Canvas>
  )
}

export const contact: Place = {
  hour: HOURS.night,
  script: [1400, 2200],
  set: ({ phone }) => <Station x={padX(phone)} />,
  floor: ({ profession, phone }) => <Commando x={padX(phone)} profession={profession} />,
  bind: (stage, { profession, phone }) => {
    const rings = fx(stage, 'rings')
    const root = fx(stage, 'commando')
    const joints = root ? celJoints(root) : null
    placeCommando(root, padX(phone))
    return (_progress, _reached, play = START) => {
      const t = moveAt(ENDS, play)
      fadeTo(rings, Math.min(ramp(t, 0, 0.2), 1 - 0.6 * ramp(t, 0.85, 1)))
      if (joints) setCelPose(joints, build(profession, ramp(t, 0.2, 1)))
    }
  },
}
