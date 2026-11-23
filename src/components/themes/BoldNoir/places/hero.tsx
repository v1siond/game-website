import { ramp } from '@/lib/scroll/stage'
import { fx, transformTo } from '../../shared/stageNodes'
import { NOIR } from '../palette'
import type { Place } from '../place'
import { Canvas, Sleuth, placeSleuth } from '../street'
import { noirJoints, setNoirPose, tip } from '../pose'

// The hero: the rooftop over the city at night. Behind him the red star burst of the calling card turns
// as the page starts to scroll, the water tower and the chimney stand on the roof beside him, and he
// tips his hat to the street below once the burst comes to rest.

const BURST = { x: 1000, y: 470, r: 620 }
const RAYS = 18
const HERO_X = 1000
// The burst turns this far over the hero's scroll and rests by this share of it.
const TURN = 30
const RESTED_BY = 0.6

const rayPoint = (angle: number) => `${(BURST.x + Math.cos(angle) * BURST.r).toFixed(0)},${(BURST.y + Math.sin(angle) * BURST.r).toFixed(0)}`

const RAY_POINTS = Array.from({ length: RAYS }, (_, i) => `${BURST.x},${BURST.y} ${rayPoint((i / RAYS) * Math.PI * 2)} ${rayPoint(((i + 0.5) / RAYS) * Math.PI * 2)}`)

const burstAt = (progress: number): string => `rotate(${(TURN * ramp(progress, 0, RESTED_BY)).toFixed(1)} ${BURST.x} ${BURST.y})`

/** The calling card's star burst behind him, and the roof's water tower and chimney. */
function Roof() {
  return (
    <Canvas>
      <g data-fx="burst" transform={burstAt(0)} opacity="0.55">
        {RAY_POINTS.map((points, i) => (
          <polygon key={i} points={points} fill={i % 2 ? NOIR.ink : NOIR.red} />
        ))}
      </g>
      <g>
        <rect x={1260} y={430} width={170} height={190} fill={NOIR.ink} />
        <polygon points="1250,430 1345,370 1440,430" fill={NOIR.ink} />
        <path d="M1270 620 L1250 880 M1420 620 L1440 880 M1260 740 H1430" stroke={NOIR.ink} strokeWidth="10" />
        <path d="M1260 470 H1430 M1260 520 H1430 M1260 570 H1430" stroke={NOIR.smoke} strokeWidth="3" />
      </g>
      <rect x={560} y={600} width={70} height={280} fill={NOIR.ink} />
      <rect x={548} y={590} width={94} height={22} fill={NOIR.smoke} />
    </Canvas>
  )
}

export const hero: Place = {
  light: NOIR.red,
  set: () => <Roof />,
  floor: ({ profession }) => <Sleuth x={HERO_X} profession={profession} />,
  bind: (stage, { profession }) => {
    const burst = fx(stage, 'burst')
    const root = fx(stage, 'detective')
    const joints = root ? noirJoints(root) : null
    placeSleuth(root, HERO_X)
    return (progress) => {
      transformTo(burst, burstAt(progress))
      if (joints) setNoirPose(joints, tip(profession, ramp(progress, RESTED_BY - 0.2, RESTED_BY + 0.2)))
    }
  },
}
