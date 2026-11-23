import { litOf } from '@/lib/scroll/propRow'
import { fadeTo, fx, transformTo } from '../../shared/stageNodes'
import { PropRow, propNodes } from '../../shared/propRow'
import { Canvas, FLOOR, gearPath } from '../forest'
import { SHADE, type Light } from '../palette'
import { Walker, walkerOf, type Place } from '../place'
import { pull } from '../pose'

// Projects on the sawmill floor: the mill's wheel stands in the fog behind, and a saw blade stands on its
// post over a log with its lever beside it for each project; as each is read he throws the lever, the
// blade turns a quarter and its edge catches the light.

const BLADE_Y = -180
const BLADE_R = 56
// A thrown blade turns this far.
const TURN = 90

const BLADE = gearPath(0, BLADE_Y, BLADE_R, 18)

function MillWheel({ light }: { light: Light }) {
  return (
    <Canvas>
      <g fill={light.far} opacity={0.85}>
        <path d={gearPath(1320, 360, 220, 20)} fillRule="evenodd" />
        <rect x={180} y={260} width={220} height={620} />
        <path d="M160 260 L290 160 L420 260 Z" />
      </g>
    </Canvas>
  )
}

function Saw() {
  return (
    <>
      <rect x={-6} y={BLADE_Y} width={12} height={-BLADE_Y} fill={SHADE.black} />
      <rect x={-70} y={-50} width={140} height={50} rx={25} fill={SHADE.black} />
      <line x1={-70} y1={0} x2={-90} y2={-100} stroke={SHADE.black} strokeWidth={8} />
      <circle cx={-90} cy={-104} r={12} fill={SHADE.black} />
    </>
  )
}

function Edge({ light }: { light: Light }) {
  return (
    <>
      <circle cx={0} cy={BLADE_Y} r={BLADE_R + 40} fill={light.rim} opacity={0.18} />
      <path d={BLADE} fill="none" stroke={light.rim} strokeWidth={4} />
    </>
  )
}

const turned = (t: number): string => `rotate(${(TURN * t).toFixed(1)} 0 ${BLADE_Y})`

export const projects: Place = {
  far: ({ light }) => <MillWheel light={light} />,
  floor: ({ xs, profession, light }) => (
    <>
      <PropRow
        xs={xs}
        floor={FLOOR}
        art={(i) => (
          <>
            <Saw />
            <path data-fx={`blade-${i}`} d={BLADE} fill={SHADE.black} fillRule="evenodd" />
          </>
        )}
        light={() => <Edge light={light} />}
      />
      <Walker xs={xs} profession={profession} />
    </>
  ),
  bind: (stage, input) => {
    const walker = walkerOf(stage, input, pull)
    const props = propNodes(stage, input.xs.length)
    const blades = input.xs.map((_, i) => fx(stage, `blade-${i}`))
    return (_progress, reached) => {
      walker(reached)
      props.forEach(({ lit }, i) => {
        const thrown = litOf(reached, i)
        fadeTo(lit, thrown)
        transformTo(lit, turned(thrown))
        transformTo(blades[i], turned(thrown))
      })
    }
  },
}
