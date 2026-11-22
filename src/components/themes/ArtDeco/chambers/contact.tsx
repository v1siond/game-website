import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx } from '../../shared/stageNodes'
import { DECO_COLORS as C } from '../palette'
import type { Chamber } from '../chamber'
import { Canvas, FLOOR, Survivor, placeSurvivor } from '../city'
import { decoJoints, revive, setDecoPose } from '../pose'

// Contact: the revival chamber at the bottom of the city, where the survivor always comes back. As the
// contact rises its glass lights teal and he is put back together inside it from the feet up, standing
// ready when the scroll reaches the end.

const TUBE = { x: 1200, width: 260, top: 330 }
const REVIVED_BY = 0.55

/** The chamber's glass tube with its gold crown and base, its light off until he is revived. */
function Tube() {
  const left = TUBE.x - TUBE.width / 2
  return (
    <Canvas>
      <g data-fx="vita" opacity="0">
        <rect x={left} y={TUBE.top} width={TUBE.width} height={FLOOR - TUBE.top} fill={C.vita} opacity="0.22" />
        <circle cx={TUBE.x} cy={FLOOR - 200} r={260} fill={C.vita} opacity="0.12" />
      </g>
      <rect x={left} y={TUBE.top} width={TUBE.width} height={FLOOR - TUBE.top} rx={40} fill="none" stroke={C.brassMid} strokeWidth="8" />
      <path d={`M${left + 40} ${TUBE.top + 30} V${FLOOR - 40}`} stroke={C.cream} strokeWidth="6" opacity="0.25" />
      <path d={`M${left - 30} ${TUBE.top} L${TUBE.x} ${TUBE.top - 110} L${left + TUBE.width + 30} ${TUBE.top} Z`} fill={C.brassMid} stroke={C.gold} strokeWidth="4" />
      <circle cx={TUBE.x} cy={TUBE.top - 34} r={18} fill={C.vita} />
      <rect x={left - 30} y={FLOOR - 24} width={TUBE.width + 60} height={24} fill={C.brassDark} stroke={C.gold} strokeWidth="3" />
    </Canvas>
  )
}

export const contact: Chamber = {
  light: C.vita,
  set: () => <Tube />,
  floor: ({ profession }) => <Survivor x={TUBE.x} profession={profession} />,
  bind: (stage, { profession }) => {
    const vita = fx(stage, 'vita')
    const root = fx(stage, 'survivor')
    const joints = root ? decoJoints(root) : null
    placeSurvivor(root, TUBE.x)
    return (progress) => {
      const t = ramp(progress, 0.05, REVIVED_BY)
      fadeTo(vita, t)
      if (joints) setDecoPose(joints, revive(profession, t))
    }
  },
}
