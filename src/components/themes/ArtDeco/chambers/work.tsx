import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx } from '../../shared/stageNodes'
import { HAND } from '../city'
import { DECO_COLORS as C } from '../palette'
import { still, stopsChamber } from '../chamber'
import { Raider } from '../foes'
import { study } from '../pose'

// Work: the diary archive. For each job a raider prowls behind a brass pedestal with its owner's audio
// diary; he brings his camera up to his eye and takes the raider's picture, the flash goes off, the raider
// is outlined in gold, studied, and the recorder on the pedestal glows gold with the voice rising off it.

const PEDESTAL = 160
const FOE = 320

function Pedestal() {
  return (
    <>
      <path d="M-56 0 V-24 H-44 V-44 H-32 V-150 H32 V-44 H44 V-24 H56 V0 Z" fill={C.cabinetTop} stroke={C.brassMid} strokeWidth="3" />
      <path d="M-24 -136 V-60 M0 -136 V-60 M24 -136 V-60" stroke={C.brassDark} strokeWidth="2" />
      <rect x={-50} y={-206} width={100} height={56} rx={6} fill={C.recorderCase} stroke={C.brassMid} strokeWidth="3" />
      {[-24, 24].map((x) => (
        <g key={x}>
          <circle cx={x} cy={-180} r={17} fill={C.sepia} stroke={C.gold} strokeWidth="2" />
          <circle cx={x} cy={-180} r={5} fill={C.gold} />
        </g>
      ))}
      <path d="M-24 -163 L0 -156 L24 -163" fill="none" stroke={C.sepia} strokeWidth="2" />
    </>
  )
}

function Voice() {
  return (
    <>
      <circle cx={0} cy={-180} r={120} fill={C.gold} opacity="0.16" />
      {[-24, 24].map((x) => (
        <circle key={x} cx={x} cy={-180} r={17} fill="none" stroke={C.goldBright} strokeWidth="3" />
      ))}
      {[40, 64, 88].map((r) => (
        <path key={r} d={`M${-r * 0.7} ${-210 - r * 0.6} Q0 ${-226 - r} ${r * 0.7} ${-210 - r * 0.6}`} fill="none" stroke={C.goldBright} strokeWidth="3" opacity={1 - r / 130} />
      ))}
    </>
  )
}

// The raider's outline in gold, drawn over it once it is studied.
function Studied() {
  return <path d="M-30 0 L-24 -116 L-40 -110 L-34 -214 Q0 -228 34 -214 L40 -110 L30 0 Z M0 -276 A28 28 0 1 1 0 -220 A28 28 0 1 1 0 -276" fill="none" stroke={C.goldBright} strokeWidth="6" />
}

export const work = stopsChamber({
  light: C.gold,
  back: (i) => (
    <>
      <g transform={`translate(${PEDESTAL} 0)`}>
        <Pedestal />
        <g data-fx={`voice-${i}`} opacity="0">
          <Voice />
        </g>
      </g>
      <g transform={`translate(${FOE} 0)`}>
        <Raider name={`raider-${i}`} />
        <g data-fx={`studied-${i}`} opacity="0">
          <Studied />
        </g>
      </g>
      <circle data-fx={`flash-${i}`} cx={HAND.x - 20} cy={HAND.y - 20} r={90} fill={C.cream} opacity="0" />
    </>
  ),
  move: (profession, t) => still(study(profession, t)),
  reply: (stage, { count }) => {
    const flashes = Array.from({ length: count }, (_, i) => fx(stage, `flash-${i}`))
    const outlines = Array.from({ length: count }, (_, i) => fx(stage, `studied-${i}`))
    const voices = Array.from({ length: count }, (_, i) => fx(stage, `voice-${i}`))
    return (played) =>
      flashes.forEach((flash, i) => {
        const t = played(i)
        fadeTo(flash, 0.9 * Math.max(0, 1 - Math.abs(t - 0.45) / 0.08))
        fadeTo(outlines[i], ramp(t, 0.5, 0.6))
        fadeTo(voices[i], ramp(t, 0.7, 0.85))
      })
  },
})
