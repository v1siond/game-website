import { litOf } from '@/lib/scroll/propRow'
import { fadeTo } from '../../shared/stageNodes'
import { DECO_COLORS as C } from '../palette'
import { PropRow, propNodes } from '../../shared/propRow'
import { Walker, walkerOf, type Chamber } from '../chamber'
import { FLOOR } from '../city'
import { zap } from '../pose'

// About: the power station, dark when he arrives. A fuse box stands on its pole for each highlight, its
// lamp out; as each highlight is read he walks up to its box and throws the charged hand's bolt into it, and
// the box's dials and the lamp over it come on and stay lit, so the room fills with light as the section
// is read.

function FuseBox() {
  return (
    <>
      <rect x={-7} y={-250} width={14} height={250} fill={C.brassDark} />
      <rect x={-48} y={-210} width={96} height={104} fill={C.cabinetTop} stroke={C.brassMid} strokeWidth="4" />
      <path d="M-48 -186 H48" stroke={C.brassDark} strokeWidth="3" />
      {[-22, 22].map((x) => (
        <circle key={x} cx={x} cy={-148} r={14} fill={C.cabinetMid} stroke={C.gold} strokeWidth="2" />
      ))}
      <circle cx={0} cy={-292} r={28} fill={C.cabinetMid} stroke={C.brassMid} strokeWidth="4" />
      <path d="M-30 -262 H30" stroke={C.brassMid} strokeWidth="5" />
    </>
  )
}

function Power() {
  return (
    <>
      <circle cx={0} cy={-292} r={110} fill={C.goldBright} opacity="0.18" />
      <circle cx={0} cy={-292} r={24} fill={C.goldBright} />
      {[-22, 22].map((x) => (
        <g key={x}>
          <circle cx={x} cy={-148} r={11} fill={C.cream} />
          <path d={`M${x} -148 L${x + 7} -155`} stroke={C.blood} strokeWidth="2.5" />
        </g>
      ))}
      <path d="M-30 -112 L-18 -90 L-26 -86 L-10 -60" fill="none" stroke={C.bolt} strokeWidth="3" strokeLinecap="round" opacity="0.8" />
    </>
  )
}

export const about: Chamber = {
  light: C.goldBright,
  floor: ({ xs, profession }) => (
    <>
      <PropRow xs={xs} floor={FLOOR} art={() => <FuseBox />} light={() => <Power />} />
      <Walker xs={xs} profession={profession} />
    </>
  ),
  bind: (stage, input) => {
    const walker = walkerOf(stage, input, zap)
    const props = propNodes(stage, input.xs.length)
    return (_progress, reached) => {
      walker(reached)
      props.forEach(({ lit }, i) => fadeTo(lit, litOf(reached, i)))
    }
  },
}
