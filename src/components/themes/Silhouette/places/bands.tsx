import { hop } from '@/lib/motion/arc'
import { mix } from '@/lib/motion/rigPose'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx } from '../../shared/stageNodes'
import { Canvas } from '../forest'
import { SHADE, type Light } from '../palette'
import { AT, type Place } from '../place'
import { CROUCH, TUCK, drum, rest } from '../pose'

// Bands on the live floor: the floor is a run of electrified plates and an oil drum stands on one, the only
// safe footing. He leaps up onto the drum as the plate he left sparks; then he plays a roll on it with his
// sticks, and holds on it with the sticks down.

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
  script: [1600, 1800],
  ends: [0.5, 1],
  far: ({ light }) => <Pylons light={light} />,
  obstacle: ({ light }) => (
    <>
      <rect x={-300} y={-12} width={380} height={12} fill={SHADE.black} />
      <rect x={-54} y={-DRUM} width={108} height={DRUM} rx={8} fill={SHADE.black} />
      <path d={`M-54 ${-DRUM + 30} H54 M-54 ${-DRUM + 90} H54`} stroke={SHADE.fog} strokeWidth={5} />
      <g data-fx="spark" opacity="0">
        <rect x={-300} y={-18} width={230} height={22} fill={light.rim} opacity={0.35} />
        <path d="M-280 -12 L-266 -44 L-256 -20 L-242 -52 M-150 -12 L-138 -40 L-128 -18 L-114 -48" stroke={light.rim} strokeWidth={5} fill="none" />
      </g>
    </>
  ),
  move: (profession, t) => {
    const leap = ramp(t, 0, 0.5)
    const landed = ramp(t, 0.5, 1)
    const roll = profession === 'drummer' ? drum(Math.min(1, landed * 4), landed * 8) : mix(CROUCH, rest(profession), landed)
    const pose = t < 0.5 ? mix(rest(profession), TUCK, Math.sin(Math.PI * leap)) : roll
    return { pose, ahead: AT * leap, lift: DRUM * leap + hop(leap, 120), over: 0 }
  },
  reply: (stage) => {
    const spark = fx(stage, 'spark')
    return (t) => fadeTo(spark, ramp(t, 0.4, 0.5))
  },
}
