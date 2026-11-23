import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, translateTo } from '../../shared/stageNodes'
import { DECO_COLORS as C } from '../palette'
import { still, stopsChamber } from '../chamber'
import { Arc, Raider, foeOf } from '../foes'
import { zap } from '../pose'

// About: the power station, dark when he arrives. For each highlight a raider rushes him out of the dark
// past a fuse box; he throws the charged hand's bolt into it, the raider shakes and goes rigid in the arc,
// and the overcharge lights the box's dials and the lamp over it, so the room fills with light as the
// section is read.

const BOX = 150
const FOE = 300
// The raider rushes in from this far.
const FROM = 520

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

export const about = stopsChamber({
  light: C.goldBright,
  back: (i) => (
    <>
      <g transform={`translate(${BOX} 0)`}>
        <FuseBox />
        <g data-fx={`power-${i}`} opacity="0">
          <Power />
        </g>
      </g>
      <g data-fx={`rush-${i}`} transform={`translate(${FROM} 0)`}>
        <Raider name={`raider-${i}`} />
      </g>
      <Arc name={`raider-${i}`} x={FOE} />
    </>
  ),
  move: (profession, t) => still(zap(profession, ramp(t, 0.25, 0.45))),
  reply: (stage, { count }) => {
    const rushes = Array.from({ length: count }, (_, i) => fx(stage, `rush-${i}`))
    const foes = Array.from({ length: count }, (_, i) => foeOf(stage, `raider-${i}`))
    const powers = Array.from({ length: count }, (_, i) => fx(stage, `power-${i}`))
    return (played) =>
      foes.forEach((foe, i) => {
        const t = played(i)
        translateTo(rushes[i], FROM + (FOE - FROM) * ramp(t, 0, 0.35), 0)
        foe(t, [0.42, 0.7], null)
        fadeTo(powers[i], ramp(t, 0.7, 0.85))
      })
  },
})
