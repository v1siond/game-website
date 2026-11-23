import { litOf } from '@/lib/scroll/propRow'
import { fadeTo, fx, translateTo } from '../../shared/stageNodes'
import { PropRow, propNodes } from '../../shared/propRow'
import { Canvas, FLOOR, gearPath } from '../forest'
import { SHADE, type Light } from '../palette'
import { Walker, walkerOf, type Place } from '../place'
import { push } from '../pose'

// Tech in the flooded hold of the machine hall: gears stand still in the fog behind, and a crate floats
// at the water's edge for each group of the stack; as each is read he puts his shoulder to it, it slides
// on and a lamp on it lights.

// A crate he pushes slides on this far.
const SLIDE = 40

function Gears({ light }: { light: Light }) {
  return (
    <Canvas>
      <g fill={light.far} fillRule="evenodd" opacity={0.85}>
        <path d={gearPath(1250, 330, 170, 16)} />
        <path d={gearPath(1460, 520, 90, 11)} />
        <path d={gearPath(360, 420, 120, 13)} />
      </g>
    </Canvas>
  )
}

function Crate() {
  return (
    <>
      <rect x={-70} y={-140} width={140} height={140} fill={SHADE.black} />
      <path d="M-70 -140 L70 0 M70 -140 L-70 0" stroke={SHADE.fog} strokeWidth={4} />
    </>
  )
}

function Lamp({ light }: { light: Light }) {
  return (
    <>
      <circle cx={40} cy={-150} r={60} fill={light.rim} opacity={0.25} />
      <rect x={30} y={-166} width={20} height={16} fill={light.rim} />
    </>
  )
}

export const tech: Place = {
  far: ({ light }) => <Gears light={light} />,
  floor: ({ xs, profession, light }) => (
    <>
      <rect x={0} y={FLOOR - 6} width={1600} height={10} fill={light.rim} opacity={0.2} />
      <PropRow
        xs={xs}
        floor={FLOOR}
        art={(i) => (
          <g data-fx={`crate-${i}`}>
            <Crate />
          </g>
        )}
        light={() => <Lamp light={light} />}
      />
      <Walker xs={xs} profession={profession} />
    </>
  ),
  bind: (stage, input) => {
    const walker = walkerOf(stage, input, push)
    const props = propNodes(stage, input.xs.length)
    const crates = input.xs.map((_, i) => fx(stage, `crate-${i}`))
    return (_progress, reached) => {
      walker(reached)
      props.forEach(({ lit }, i) => {
        const pushed = litOf(reached, i)
        fadeTo(lit, pushed)
        translateTo(lit, SLIDE * pushed, 0)
        translateTo(crates[i], SLIDE * pushed, 0)
      })
    }
  },
}
