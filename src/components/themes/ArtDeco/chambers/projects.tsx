import { ramp } from '@/lib/scroll/stage'
import { drop, hop } from '@/lib/motion/arc'
import { fadeTo, fx, transformTo } from '../../shared/stageNodes'
import { DECO_COLORS as C } from '../palette'
import { fightChamber, share } from '../chamber'
import { Canvas, FLOOR } from '../city'
import { Raider, foeOf } from '../foes'
import { hang, landed } from '../pose'

// Projects: the pipe works under the research lab, a freight rail running overhead, the way the game's
// sky rails carry its hero over a fight. A raider guards a valve; he leaps up onto the rail's hook, rides it
// in, and drops on the raider with the wrench; the pipe glows teal past the valve, the flow reaches the
// lab's shutter and it rolls up on the lit lab.

const FOE = 330
// The rail runs this high: his hands on the hook put his soles this far up.
const RAIL = -560
const ON_RAIL = 240
// He rides in to here, just short of the raider.
const RIDE = FOE - 120
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

function Valve() {
  return (
    <g transform={`translate(${FOE + 120} 0)`}>
      <rect x={-10} y={-STEM} width={20} height={STEM} fill={C.steelShade} />
      <circle cx={0} cy={-170} r={40} fill="none" stroke={C.blood} strokeWidth="9" />
      <path d="M-40 -170 H40 M0 -210 V-130" stroke={C.blood} strokeWidth="6" />
      <circle cx={0} cy={-170} r={9} fill={C.gold} />
    </g>
  )
}

function Flowing() {
  return (
    <g transform={`translate(${FOE + 120} 0)`}>
      <circle cx={0} cy={-170} r={80} fill={C.tealLight} opacity="0.18" />
      <rect x={-5} y={-STEM} width={10} height={STEM} fill={C.tealLight} opacity="0.8" />
    </g>
  )
}

export const projects = fightChamber({
  light: C.tealLight,
  script: [1200, 1300, 1500],
  set: () => <Lab />,
  back: () => (
    <>
      <path d={`M-260 ${RAIL} H${FOE + 260}`} stroke={C.brassDark} strokeWidth="12" />
      <Valve />
      <g data-fx="flowing" opacity="0">
        <Flowing />
      </g>
      <g transform={`translate(${FOE} 0)`}>
        <Raider name="raider" />
      </g>
    </>
  ),
  bind: (stage, { profession }) => {
    const foe = foeOf(stage, 'raider')
    const flowing = fx(stage, 'flowing')
    const shutter = fx(stage, 'shutter')
    const flow = fx(stage, 'flow')
    return (play) => {
      const up = share(play, 0)
      const ride = share(play, 1)
      const fall = share(play, 2)
      foe(fall, null, [0.3, 0.6])
      fadeTo(flowing, ramp(fall, 0.55, 0.8))
      const open = ramp(fall, 0.7, 1)
      fadeTo(flow, open)
      transformTo(shutter, `translate(0 ${(-open * SHUTTER.height).toFixed(1)})`)
      const dropped = ramp(fall, 0, 0.35)
      const lift = fall > 0 ? ON_RAIL - drop(dropped, ON_RAIL) : ON_RAIL * up + hop(up, 60)
      const pose = fall > 0 ? landed(profession, ramp(fall, 0, 0.6)) : hang(profession, ramp(up, 0, 0.6))
      return { pose, ahead: RIDE * ride, lift }
    }
  },
})
