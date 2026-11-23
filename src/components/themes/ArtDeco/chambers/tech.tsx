import { litOf } from '@/lib/scroll/propRow'
import { fadeTo, fx } from '../../shared/stageNodes'
import { DECO_COLORS as C } from '../palette'
import { PropRow, propNodes } from '../../shared/propRow'
import { Walker, walkerOf, type Chamber } from '../chamber'
import { Canvas, FLOOR } from '../city'
import { swing } from '../pose'

// Tech stack: the glass tunnel, the sea pressing on its brass ribs, and a burst pipe leaking for each
// category. As each category is read he walks up to its pipe and brings the wrench down on the joint: the
// spray stops and the joint's gauge lights, sealed.

const RIBS = [260, 520, 800, 1080, 1340]

/** The tunnel's glass vault over the hall: its brass ribs and the sea glinting on the pane. */
function Tunnel() {
  return (
    <Canvas>
      <path d={`M60 ${FLOOR} V420 Q800 -120 1540 420 V${FLOOR}`} fill={C.tunnelSea} opacity="0.35" stroke={C.brassMid} strokeWidth="10" />
      {RIBS.map((x) => (
        <path key={x} d={`M${x} ${FLOOR} V${420 - Math.max(0, 300 - Math.abs(800 - x) * 0.55)}`} stroke={C.brassDark} strokeWidth="8" />
      ))}
      <path d="M300 300 Q520 200 700 260 M960 240 Q1150 200 1300 290" fill="none" stroke={C.waterGlow} strokeWidth="4" opacity="0.4" />
    </Canvas>
  )
}

function Pipe() {
  return (
    <>
      <rect x={-18} y={-420} width={36} height={420} fill={C.steelShade} stroke={C.brassDark} strokeWidth="3" />
      <rect x={-30} y={-236} width={60} height={34} fill={C.brassMid} stroke={C.gold} strokeWidth="2" />
      <circle cx={0} cy={-290} r={20} fill={C.cabinetMid} stroke={C.gold} strokeWidth="3" />
      <path d="M0 -290 L-10 -300" stroke={C.blood} strokeWidth="3" />
    </>
  )
}

function Jet() {
  return (
    <g fill="none" stroke={C.waterGlow} strokeLinecap="round" opacity="0.8">
      <path d="M30 -220 Q90 -250 150 -170" strokeWidth="8" />
      <path d="M30 -212 Q80 -220 120 -140" strokeWidth="5" />
      <path d="M30 -226 Q110 -290 190 -230" strokeWidth="4" />
    </g>
  )
}

function Sealed() {
  return (
    <>
      <circle cx={0} cy={-290} r={60} fill={C.waterGlow} opacity="0.2" />
      <circle cx={0} cy={-290} r={16} fill={C.cream} />
      <path d="M0 -290 L10 -302" stroke={C.blood} strokeWidth="3" />
      <rect x={-30} y={-236} width={60} height={34} fill="none" stroke={C.goldBright} strokeWidth="4" />
    </>
  )
}

export const tech: Chamber = {
  light: C.waterGlow,
  set: () => <Tunnel />,
  floor: ({ xs, profession }) => (
    <>
      <PropRow
        xs={xs}
        floor={FLOOR}
        art={(i) => (
          <>
            <Pipe />
            <g data-fx={`jet-${i}`}>
              <Jet />
            </g>
          </>
        )}
        light={() => <Sealed />}
      />
      <Walker xs={xs} profession={profession} />
    </>
  ),
  bind: (stage, input) => {
    const walker = walkerOf(stage, input, swing)
    const props = propNodes(stage, input.xs.length)
    const jets = input.xs.map((_, i) => fx(stage, `jet-${i}`))
    return (_progress, reached) => {
      walker(reached)
      props.forEach(({ lit }, i) => {
        const sealed = litOf(reached, i)
        fadeTo(lit, sealed)
        fadeTo(jets[i], 1 - sealed)
      })
    }
  },
}
