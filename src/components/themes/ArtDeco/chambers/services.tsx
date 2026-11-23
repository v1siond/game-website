import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, transformTo } from '../../shared/stageNodes'
import { DECO_COLORS as C } from '../palette'
import { still, stopsChamber } from '../chamber'
import { Raider, foeOf } from '../foes'
import { fling } from '../pose'

// Services: the levitation hall. For each service a sealed crate of the city stands between him and a
// raider; he raises the charged hand and the crate lifts off the floor in its blue light, hangs, and is
// flung at the raider, who goes down with the crate fallen beside him.

const CRATE = 150
const FOE = 380
// The crate lifts this high before it is flung, and lands here.
const LIFTED = -170
const LANDS = FOE - 110

function Crate() {
  return (
    <>
      <rect x={-62} y={-120} width={124} height={120} fill={C.bronzePanel} stroke={C.brassMid} strokeWidth="4" />
      <path d="M-62 -120 L62 0 M62 -120 L-62 0" stroke={C.brassDark} strokeWidth="3" />
      <path d="M0 -92 L22 -60 L0 -28 L-22 -60 Z" fill={C.gold} stroke={C.brassDark} strokeWidth="2" />
      <path d="M-62 -60 H62" stroke={C.brassMid} strokeWidth="3" />
    </>
  )
}

export const services = stopsChamber({
  light: C.bolt,
  back: (i) => (
    <>
      <g transform={`translate(${FOE} 0)`}>
        <Raider name={`raider-${i}`} />
      </g>
      <ellipse data-fx={`glow-${i}`} cx={CRATE} cy={LIFTED - 60} rx={110} ry={110} fill={C.bolt} opacity="0" />
      <g data-fx={`crate-${i}`} transform={`translate(${CRATE} 0)`}>
        <Crate />
      </g>
    </>
  ),
  move: (profession, t) => still(fling(profession, t)),
  reply: (stage, { count }) => {
    const crates = Array.from({ length: count }, (_, i) => fx(stage, `crate-${i}`))
    const glows = Array.from({ length: count }, (_, i) => fx(stage, `glow-${i}`))
    const foes = Array.from({ length: count }, (_, i) => foeOf(stage, `raider-${i}`))
    return (played) =>
      crates.forEach((crate, i) => {
        const t = played(i)
        const up = ramp(t, 0.15, 0.45)
        const flown = ramp(t, 0.58, 0.72)
        const x = CRATE + (LANDS - CRATE) * flown
        const y = LIFTED * up * (1 - flown) - 60 * Math.sin(Math.PI * flown)
        transformTo(crate, `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(200 * flown).toFixed(1)} 0 -60)`)
        fadeTo(glows[i], 0.2 * up * (1 - flown))
        foes[i](t, null, [0.7, 0.85])
      })
  },
})
