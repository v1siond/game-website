import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx } from '../../shared/stageNodes'
import { NOIR } from '../palette'
import type { Place } from '../place'
import { Canvas, Sleuth, placeSleuth } from '../street'
import { badge, noirJoints, setNoirPose } from '../pose'

// Contact: the calling card. A big paper card is pinned to the wall at the end of the street; as the
// contact rises he holds his badge up to it and the red star burst flares behind the card.

const CARD = { x: 1200, y: 330, width: 300, height: 190 }
const SLEUTH_X = 980
const SHOWN_BY = 0.55

function CallingCard() {
  const { x, y, width, height } = CARD
  return (
    <Canvas>
      <g data-fx="flare" opacity="0">
        <circle cx={x} cy={y + height / 2} r={280} fill={NOIR.red} opacity="0.3" />
        <path d={`M${x} ${y - 140} L${x + 40} ${y + 30} L${x + 220} ${y + 10} L${x + 70} ${y + 110} L${x + 170} ${y + 290} L${x} ${y + 170} L${x - 170} ${y + 290} L${x - 70} ${y + 110} L${x - 220} ${y + 10} L${x - 40} ${y + 30} Z`} fill={NOIR.red} />
      </g>
      <g transform={`rotate(-5 ${x} ${y + height / 2})`}>
        <rect x={x - width / 2 + 14} y={y + 14} width={width} height={height} fill={NOIR.red} />
        <rect x={x - width / 2} y={y} width={width} height={height} fill={NOIR.paper} stroke={NOIR.ink} strokeWidth="5" />
        <path d={`M${x - 100} ${y + 60} H${x + 100} M${x - 100} ${y + 100} H${x + 60} M${x - 100} ${y + 140} H${x + 80}`} stroke={NOIR.ink} strokeWidth="12" />
        <circle cx={x} cy={y + 4} r={10} fill={NOIR.red} stroke={NOIR.ink} strokeWidth="3" />
      </g>
    </Canvas>
  )
}

export const contact: Place = {
  light: NOIR.red,
  set: () => <CallingCard />,
  floor: ({ profession }) => <Sleuth x={SLEUTH_X} profession={profession} />,
  bind: (stage, { profession }) => {
    const flare = fx(stage, 'flare')
    const root = fx(stage, 'detective')
    const joints = root ? noirJoints(root) : null
    placeSleuth(root, SLEUTH_X)
    return (progress) => {
      const t = ramp(progress, 0.05, SHOWN_BY)
      fadeTo(flare, ramp(t, 0.6, 1))
      if (joints) setNoirPose(joints, badge(profession, t))
    }
  },
}
