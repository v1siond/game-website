import { fadeTo, fx, transformTo } from '../../shared/stageNodes'
import { DECO_COLORS as C } from '../palette'
import { PropRow, Walker, litOf, propNodes, walkerOf, type Chamber } from '../chamber'
import { Canvas, FLOOR } from '../city'
import { grip } from '../pose'

// Projects: the pipe works under the research lab. The lab's shutter is down and a pipe runs along the wall
// over a valve wheel for each project; as each project is read he walks up to its wheel and hacks it round
// with both hands, and the pipe glows teal past it. When the last project is read the flow reaches the
// shutter and it rolls up on the lit lab.

// A turned wheel has gone this far round.
const TURN = 180
const SHUTTER = { x: 1200, width: 320, top: 260, height: 360 }

/** The lab's shutter on the back wall over its lit window, and the pipe the flow runs along. */
function Lab() {
  return (
    <Canvas>
      <rect x={SHUTTER.x} y={SHUTTER.top} width={SHUTTER.width} height={SHUTTER.height} fill={C.machineGlass} stroke={C.gold} strokeWidth="5" />
      <path d={`M${SHUTTER.x + 40} ${SHUTTER.top + SHUTTER.height} V${SHUTTER.top + 140} H${SHUTTER.x + 280} V${SHUTTER.top + SHUTTER.height}`} fill="none" stroke={C.tealLight} strokeWidth="4" opacity="0.7" />
      <clipPath id="deco-lab-window">
        <rect x={SHUTTER.x} y={SHUTTER.top} width={SHUTTER.width} height={SHUTTER.height} />
      </clipPath>
      <g clipPath="url(#deco-lab-window)">
        <g data-fx="shutter">
          {Array.from({ length: 12 }, (_, i) => (
            <rect key={i} x={SHUTTER.x} y={SHUTTER.top + i * 30} width={SHUTTER.width} height={28} fill={C.brassShadow} stroke={C.brassLine} strokeWidth="2" />
          ))}
        </g>
      </g>
      <path d={`M120 ${FLOOR - 320} H${SHUTTER.x}`} stroke={C.steelShade} strokeWidth="22" />
      <path data-fx="flow" d={`M120 ${FLOOR - 320} H${SHUTTER.x}`} stroke={C.tealLight} strokeWidth="10" opacity="0" />
    </Canvas>
  )
}

// The stem runs up to the flow pipe at FLOOR - 320 whatever the row's size.
const STEM = 320

function Valve({ size }: { size: number }) {
  return (
    <>
      <rect x={-10} y={-STEM / size} width={20} height={STEM / size} fill={C.steelShade} />
      <g data-wheel="">
        <circle cx={0} cy={-170} r={40} fill="none" stroke={C.blood} strokeWidth="9" />
        <path d="M-40 -170 H40 M0 -210 V-130" stroke={C.blood} strokeWidth="6" />
        <circle cx={0} cy={-170} r={9} fill={C.gold} />
      </g>
    </>
  )
}

function Flowing({ size }: { size: number }) {
  return (
    <>
      <circle cx={0} cy={-170} r={80} fill={C.tealLight} opacity="0.18" />
      <rect x={-5} y={-STEM / size} width={10} height={STEM / size} fill={C.tealLight} opacity="0.8" />
    </>
  )
}

export const projects: Chamber = {
  light: C.tealLight,
  set: () => <Lab />,
  floor: ({ xs, profession }) => (
    <>
      <PropRow
        xs={xs}
        art={(_i, size) => <Valve size={size} />}
        light={(_i, size) => <Flowing size={size} />}
      />
      <Walker xs={xs} profession={profession} />
    </>
  ),
  bind: (stage, input) => {
    const count = input.xs.length
    const walker = walkerOf(stage, input, (profession, t) => grip(profession, t, t))
    const props = propNodes(stage, count)
    const wheels = props.map(({ move }) => move?.querySelector('[data-wheel]') ?? null)
    const shutter = fx(stage, 'shutter')
    const flow = fx(stage, 'flow')
    return (_progress, reached) => {
      walker(reached)
      props.forEach(({ lit }, i) => {
        const turned = litOf(reached, i)
        fadeTo(lit, turned)
        transformTo(wheels[i], `rotate(${(turned * TURN).toFixed(1)} 0 -170)`)
      })
      const open = count > 0 ? litOf(reached, count - 1) : 0
      fadeTo(flow, open)
      transformTo(shutter, `translate(0 ${(-open * SHUTTER.height).toFixed(1)})`)
    }
  },
}
