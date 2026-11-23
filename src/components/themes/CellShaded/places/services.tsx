import { hop } from '@/lib/motion/arc'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, transformTo } from '../../shared/stageNodes'
import { HOURS } from '../desert'
import { Burst } from '../ink'
import { CEL } from '../palette'
import { stopsPlace } from '../place'
import { slam } from '../pose'

// Services in the town's afternoon: for each service a stack of supply crates comes to him on the run. He
// leaps, tucks with both fists over his head and slams down beside it on two fists; the shock ring goes
// out over the sand and the crates burst open in orange starbursts.

const CRATES = 230
// The leap clears this high and lands him this far ahead.
const HEIGHT = 220
const LANDS = 60

function Crate({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-60} y={-110} width={120} height={110} fill={CEL.plank} />
      <path d="M-60 -110 L60 0 M60 -110 L-60 0" stroke={CEL.plankShade} strokeWidth="6" />
      <rect x={-66} y={-124} width={132} height={18} fill={CEL.plankShade} />
    </g>
  )
}

export const services = stopsPlace({
  hour: HOURS.town,
  back: (i) => (
    <>
      <Crate x={CRATES} y={0} />
      <Crate x={CRATES + 130} y={0} />
      <Crate x={CRATES + 65} y={-124} />
      <g data-fx={`burst-${i}`} opacity="0">
        <Burst x={CRATES + 20} y={-150} r={80} fill={CEL.orange} />
        <Burst x={CRATES + 130} y={-200} r={60} fill={CEL.sun} />
      </g>
      <ellipse data-fx={`ring-${i}`} cx={LANDS} cy={0} rx={60} ry={14} fill="none" stroke={CEL.sun} strokeWidth="8" opacity="0" data-bare />
    </>
  ),
  move: (_profession, t) => {
    const air = ramp(t, 0.2, 0.62)
    return { pose: slam(t), ahead: LANDS * air, lift: hop(air, HEIGHT) }
  },
  reply: (stage, { count }) => {
    const bursts = Array.from({ length: count }, (_, i) => fx(stage, `burst-${i}`))
    const rings = Array.from({ length: count }, (_, i) => fx(stage, `ring-${i}`))
    return (played) =>
      bursts.forEach((burst, i) => {
        const t = played(i)
        const shock = ramp(t, 0.62, 0.85)
        fadeTo(rings[i], shock > 0 ? 1 - 0.6 * shock : 0)
        transformTo(rings[i], `translate(${LANDS} 0) scale(${(1 + 3 * shock).toFixed(3)} ${(1 + 2 * shock).toFixed(3)}) translate(${-LANDS} 0)`)
        fadeTo(burst, ramp(t, 0.66, 0.76))
      })
  },
})
