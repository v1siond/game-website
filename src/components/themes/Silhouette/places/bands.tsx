import { litOf } from '@/lib/scroll/propRow'
import { fadeTo } from '../../shared/stageNodes'
import { PropRow, propNodes } from '../../shared/propRow'
import { Canvas, FLOOR } from '../forest'
import { SHADE, type Light } from '../palette'
import { Walker, walkerOf, type Place } from '../place'
import { drum } from '../pose'

// Bands on the electrified floor: pylons carry the city's power in the fog behind, and an oil drum stands
// on a live plate for each band; as each is read he plays it with his sticks and the plate under it
// sparks.

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

function Drum() {
  return (
    <>
      <rect x={-100} y={-12} width={200} height={12} fill={SHADE.black} />
      <rect x={-54} y={-150} width={108} height={138} rx={8} fill={SHADE.black} />
      <path d="M-54 -110 H54 M-54 -54 H54" stroke={SHADE.fog} strokeWidth={5} />
    </>
  )
}

function Sparks({ light }: { light: Light }) {
  return (
    <>
      <rect x={-110} y={-18} width={220} height={22} fill={light.rim} opacity={0.35} />
      <path d="M-90 -12 L-76 -44 L-66 -20 L-52 -52 M60 -12 L72 -40 L82 -18 L96 -48" stroke={light.rim} strokeWidth={5} fill="none" />
    </>
  )
}

export const bands: Place = {
  far: ({ light }) => <Pylons light={light} />,
  floor: ({ xs, profession, light }) => (
    <>
      <PropRow xs={xs} floor={FLOOR} art={() => <Drum />} light={() => <Sparks light={light} />} />
      <Walker xs={xs} profession={profession} />
    </>
  ),
  bind: (stage, input) => {
    const walker = walkerOf(stage, input, (_profession, t, at) => drum(t, (at + t) * 4))
    const props = propNodes(stage, input.xs.length)
    return (_progress, reached) => {
      walker(reached)
      props.forEach(({ lit }, i) => fadeTo(lit, litOf(reached, i)))
    }
  },
}
