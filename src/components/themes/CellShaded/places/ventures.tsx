import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx } from '../../shared/stageNodes'
import { Shot, muzzleFromStop } from '../bandit'
import { HOURS } from '../desert'
import { Burst } from '../ink'
import { CEL } from '../palette'
import { stopsPlace } from '../place'
import { mantle } from '../pose'

// Ventures at dusk: for each venture a rock ledge comes to him on the run, the venture's maker's plate on
// its post on the far rocks. He climbs the ledge, hands on its edge and a knee up, stands on top, aims off
// it and fires, and a starburst of the plate's colour splats behind it.

const TONES = [CEL.orange, CEL.sun, CEL.holo]
// The ledge he climbs stands this high; the plate is this far off on the far rocks.
const LEDGE = 130
const PLATE = { x: 470, y: -420 }

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
  back: (i) => (
    <>
      <Plate />
      <g data-fx={`splat-${i}`} opacity="0" transform={`translate(${PLATE.x} 0)`}>
        <Burst x={0} y={-372} r={100} fill={TONES[i % TONES.length]} />
        <path d="M-56 -410 L0 -436 L56 -410 L56 -336 L0 -308 L-56 -336 Z" fill={TONES[i % TONES.length]} />
      </g>
      <Ledge />
      <Shot name={`shot-${i}`} from={muzzle} to={{ x: PLATE.x - 50, y: PLATE.y + 50 }} />
    </>
  ),
  move: (_profession, t) => ({ pose: mantle(t), ahead: 0, lift: LEDGE * ramp(t, 0.15, 0.4) }),
  reply: (stage, { count }) => {
    const tracers = Array.from({ length: count }, (_, i) => fx(stage, `shot-${i}-tracer`))
    const crits = Array.from({ length: count }, (_, i) => fx(stage, `shot-${i}-crit`))
    const splats = Array.from({ length: count }, (_, i) => fx(stage, `splat-${i}`))
    return (played) =>
      splats.forEach((splat, i) => {
        const t = played(i)
        fadeTo(tracers[i], t > 0.55 && t < 0.85 ? 0.9 : 0)
        fadeTo(crits[i], ramp(t, 0.6, 0.66) * (1 - ramp(t, 0.85, 0.95)))
        fadeTo(splat, ramp(t, 0.8, 0.9))
      })
  },
})
