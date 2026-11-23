import { litOf } from '@/lib/scroll/propRow'
import { fadeTo } from '../../shared/stageNodes'
import { PropRow, propNodes } from '../../shared/propRow'
import { Canvas, FLOOR } from '../forest'
import { SHADE, type Light } from '../palette'
import { Walker, walkerOf, type Place } from '../place'
import { pull } from '../pose'

// Ventures at the edge of the machine city: its roofs and chimneys stand in the fog behind, and a dark
// sign stands on a pole for each venture with its switch at the foot; as each is read he throws the switch
// and the sign's tubes light.

const SIGN = -520

function City({ light }: { light: Light }) {
  return (
    <Canvas>
      <path
        fill={light.far}
        opacity={0.85}
        d="M0 880 V560 H140 V470 H260 V600 H380 V380 H420 V300 H450 V380 H520 V640 H700 V520 H860 V880 Z M1000 880 V600 H1120 V420 H1160 V340 H1190 V420 H1260 V540 H1400 V460 H1600 V880 Z"
      />
    </Canvas>
  )
}

function Sign() {
  return (
    <>
      <rect x={-8} y={SIGN} width={16} height={-SIGN} fill={SHADE.black} />
      <rect x={-110} y={SIGN - 120} width={220} height={120} fill={SHADE.black} />
      <path d={`M-80 ${SIGN - 90} H80 M-80 ${SIGN - 60} H40 M-80 ${SIGN - 30} H60`} stroke={SHADE.fog} strokeWidth={8} />
      <rect x={-50} y={-70} width={30} height={70} fill={SHADE.black} />
    </>
  )
}

function Tubes({ light }: { light: Light }) {
  return (
    <>
      <rect x={-130} y={SIGN - 140} width={260} height={160} fill={light.rim} opacity={0.18} />
      <path d={`M-80 ${SIGN - 90} H80 M-80 ${SIGN - 60} H40 M-80 ${SIGN - 30} H60`} stroke={light.rim} strokeWidth={8} />
    </>
  )
}

export const ventures: Place = {
  far: ({ light }) => <City light={light} />,
  floor: ({ xs, profession, light }) => (
    <>
      <PropRow xs={xs} floor={FLOOR} art={() => <Sign />} light={() => <Tubes light={light} />} />
      <Walker xs={xs} profession={profession} />
    </>
  ),
  bind: (stage, input) => {
    const walker = walkerOf(stage, input, pull)
    const props = propNodes(stage, input.xs.length)
    return (_progress, reached) => {
      walker(reached)
      props.forEach(({ lit }, i) => fadeTo(lit, litOf(reached, i)))
    }
  },
}
