import { litOf } from '@/lib/scroll/propRow'
import { fadeTo, fx, transformTo } from '../../shared/stageNodes'
import { PropRow, propNodes } from '../../shared/propRow'
import { Canvas, FLOOR, gearPath } from '../forest'
import { SHADE, type Light } from '../palette'
import { Walker, walkerOf, type Place } from '../place'
import { pull } from '../pose'

// Projects on the sawmill floor: the mill's wheel stands in the fog behind, and a saw stands over a log
// with its lever beside it for each project; as each is read he throws the lever, the blade turns a
// quarter and its edge catches the light.

const BLADE_Y = -230
const BLADE_R = 90
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
      <path d={`M-90 0 V${BLADE_Y - 120} H90 V0`} fill="none" stroke={SHADE.black} strokeWidth={10} />
      <rect x={-110} y={-60} width={220} height={60} rx={30} fill={SHADE.black} />
      <line x1={-110} y1={0} x2={-136} y2={-110} stroke={SHADE.black} strokeWidth={8} />
      <circle cx={-136} cy={-114} r={12} fill={SHADE.black} />
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
