import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx } from '../../shared/stageNodes'
import { DECO_COLORS as C } from '../palette'
import { share, type Chamber } from '../chamber'
import { Canvas, FLOOR, Survivor, placeSurvivor } from '../city'
import { decoJoints, lift, revive, setDecoPose } from '../pose'

// Contact: the revival chamber at the bottom of the city, where the survivor always comes back. Its glass
// lights teal and he is put back together inside it from the feet up; then its light fades and he stands
// ready, the charged hand raised and crackling.

const TUBE = { width: 260, top: 330 }
// The tube stands right of the text column, in the middle of a phone's view.
const tubeX = (phone: boolean): number => (phone ? 800 : 1200)
// How far up he raises the charged hand once he is whole.
const READY = 0.4

/** The chamber's glass tube with its gold crown and base, its light off until he is revived. */
function Tube({ x }: { x: number }) {
  const left = x - TUBE.width / 2
  return (
    <Canvas>
      <g data-fx="revival" opacity="0">
        <rect x={left} y={TUBE.top} width={TUBE.width} height={FLOOR - TUBE.top} fill={C.revival} opacity="0.22" />
        <circle cx={x} cy={FLOOR - 200} r={260} fill={C.revival} opacity="0.12" />
      </g>
      <rect x={left} y={TUBE.top} width={TUBE.width} height={FLOOR - TUBE.top} rx={40} fill="none" stroke={C.brassMid} strokeWidth="8" />
      <path d={`M${left + 40} ${TUBE.top + 30} V${FLOOR - 40}`} stroke={C.cream} strokeWidth="6" opacity="0.25" />
      <path d={`M${left - 30} ${TUBE.top} L${x} ${TUBE.top - 110} L${left + TUBE.width + 30} ${TUBE.top} Z`} fill={C.brassMid} stroke={C.gold} strokeWidth="4" />
      <circle cx={x} cy={TUBE.top - 34} r={18} fill={C.revival} />
      <rect x={left - 30} y={FLOOR - 24} width={TUBE.width + 60} height={24} fill={C.brassDark} stroke={C.gold} strokeWidth="3" />
    </Canvas>
  )
}

export const contact: Chamber = {
  light: C.revival,
  script: [2200, 1400],
  set: ({ phone }) => <Tube x={tubeX(phone)} />,
  floor: ({ profession, phone }) => <Survivor x={tubeX(phone)} profession={profession} />,
  bind: (stage, { profession, phone }) => {
    const glow = fx(stage, 'revival')
    const root = fx(stage, 'survivor')
    const joints = root ? decoJoints(root) : null
    placeSurvivor(root, tubeX(phone))
    return (play) => {
      // the knitting is the first three quarters of the revival, the light's fade its last quarter
      const knit = 0.75 * share(play, 0)
      const ready = share(play, 1)
      fadeTo(glow, ramp(knit, 0, 0.25) * (1 - ready))
      const revived = revive(profession, knit + 0.25 * ready)
      if (joints) setDecoPose(joints, ready > 0 ? { ...lift(profession, READY * ready), chamber: revived.chamber } : revived)
    }
  },
}
