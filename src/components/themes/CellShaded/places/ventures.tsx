import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx } from '../../shared/stageNodes'
import { Shot, muzzleFromStop } from '../bandit'
import { HOURS } from '../desert'
import { Burst } from '../ink'
import { CEL } from '../palette'
import { stopsPlace } from '../place'
import { mantle } from '../pose'

// Ventures at dusk: a rock ledge before him, a maker's plate on its post on the far rocks. First he climbs
// the ledge, hands on its edge and a knee up; then he stands on top, aims off it and fires, and a starburst
// in the plate's colour splats behind it.
// The ledge he climbs stands this high; the plate is this far off on the far rocks.
const LEDGE = 130
const PLATE = { x: 420, y: -420 }

function Ledge() {
  return <path d={`M-120 0 L-110 ${-LEDGE} L110 ${-LEDGE - 10} L130 0 Z`} fill={CEL.mesa} />
}

function Plate() {
  return (
    <g transform={`translate(${PLATE.x} 0)`}>
      <path d="M-110 0 L-90 -150 L90 -170 L120 0 Z" fill={CEL.mesaShade} />
      <rect x={-8} y={-310} width={16} height={150} fill={CEL.steelDark} />
      <path d="M-56 -410 L0 -436 L56 -410 L56 -336 L0 -308 L-56 -336 Z" fill={CEL.steel} />
    </g>
  )
}

const muzzle = muzzleFromStop(LEDGE)

export const ventures = stopsPlace({
  hour: HOURS.dusk,
  script: [2000, 1800],
  ends: [0.45, 1],
  back: () => (
    <>
      <Plate />
      <g data-fx="splat" opacity="0" transform={`translate(${PLATE.x} 0)`}>
        <Burst x={0} y={-372} r={100} fill={CEL.orange} />
        <path d="M-56 -410 L0 -436 L56 -410 L56 -336 L0 -308 L-56 -336 Z" fill={CEL.orange} />
      </g>
      <Ledge />
      <Shot name="shot" from={muzzle} to={{ x: PLATE.x - 50, y: PLATE.y + 50 }} />
    </>
  ),
  move: (_profession, t) => ({ pose: mantle(t), ahead: 0, lift: LEDGE * ramp(t, 0.15, 0.4) }),
  reply: (stage) => {
    const tracer = fx(stage, 'shot-tracer')
    const crit = fx(stage, 'shot-crit')
    const splat = fx(stage, 'splat')
    return (t) => {
      fadeTo(tracer, t > 0.55 && t < 0.85 ? 0.9 : 0)
      fadeTo(crit, ramp(t, 0.6, 0.66) * (1 - ramp(t, 0.85, 0.95)))
      fadeTo(splat, ramp(t, 0.8, 0.9))
    }
  },
})
