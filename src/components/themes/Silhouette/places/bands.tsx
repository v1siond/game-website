import { hop } from '@/lib/motion/arc'
import { mix } from '@/lib/motion/rigPose'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx } from '../../shared/stageNodes'
import { Canvas } from '../forest'
import { SHADE, type Light } from '../palette'
import { AT, type Place } from '../place'
import { CROUCH, TUCK, drum, rest } from '../pose'

// Bands on the live floor: the floor is a run of electrified plates, and for each band an oil drum stands
// on one, the only safe footing. He leaps up onto the drum and lands on it beating once with his sticks as
// the plate he left behind sparks; the frame holds him on the drum, sticks down.

const DRUM = 140

function Pylons({ light }: { light: Light }) {
  return (
    <Canvas>
      <g fill="none" stroke={light.far} strokeWidth={8} opacity={0.85}>
        {[260, 760, 1300].map((x) => (
          <path key={x} d={`M${x - 70} 880 L${x} 300 L${x + 70} 880 M${x - 100} 380 H${x + 100} M${x - 70} 480 H${x + 70} M${x - 44} 640 L${x + 44} 560`} />
        ))}
        <path d="M0 360 Q260 420 520 370 T1040 370 T1600 360" />
      </g>
    </Canvas>
  )
}

export const bands: Place = {
  far: ({ light }) => <Pylons light={light} />,
  obstacle: (i, { light }) => (
    <>
      <rect x={-300} y={-12} width={380} height={12} fill={SHADE.black} />
      <rect x={-54} y={-DRUM} width={108} height={DRUM} rx={8} fill={SHADE.black} />
      <path d={`M-54 ${-DRUM + 30} H54 M-54 ${-DRUM + 90} H54`} stroke={SHADE.fog} strokeWidth={5} />
      <g data-fx={`spark-${i}`} opacity="0">
        <rect x={-300} y={-18} width={230} height={22} fill={light.rim} opacity={0.35} />
        <path d="M-280 -12 L-266 -44 L-256 -20 L-242 -52 M-150 -12 L-138 -40 L-128 -18 L-114 -48" stroke={light.rim} strokeWidth={5} fill="none" />
      </g>
    </>
  ),
  move: (profession, t) => {
    const leap = ramp(t, 0, 0.55)
    const landed = ramp(t, 0.55, 1)
    const pose = t < 0.55 ? mix(rest(profession), TUCK, Math.sin(Math.PI * leap)) : profession === 'drummer' ? drum(landed, landed * 1.5) : mix(CROUCH, rest(profession), landed)
    return { pose, ahead: AT * leap, lift: DRUM * leap + hop(leap, 120), over: 0 }
  },
  reply: (stage, { count }) => {
    const sparks = Array.from({ length: count }, (_, i) => fx(stage, `spark-${i}`))
    return (played) => sparks.forEach((spark, i) => fadeTo(spark, ramp(played(i), 0.55, 0.7)))
  },
}
