import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, transformTo } from '../../shared/stageNodes'
import { NOIR } from '../palette'
import { roomPlace, still } from '../place'
import { cover } from '../pose'

// Ventures: main street. For each venture a parked car comes to him on the dash; he drops low behind it
// with a hand on its roof, a searchlight from above sweeps the street over him and finds nothing, and once
// it has passed the shop sign beyond lights red.

// The shop sign stands this far right of him; the searchlight hangs this high and swings this far.
const SIGN = 300
const SOURCE = -1000
const SWING = 24

function Car() {
  return (
    <>
      <path d="M-170 -20 L-170 -80 L-110 -86 L-70 -140 L80 -140 L120 -86 L170 -76 L170 -20 Z" fill={NOIR.coal} stroke={NOIR.paperDim} strokeWidth="4" />
      <path d="M-60 -128 L-90 -88 L0 -88 L0 -128 Z M14 -128 L14 -88 L100 -88 L72 -128 Z" fill={NOIR.smoke} />
      <circle cx={-100} cy={-20} r={30} fill={NOIR.ink} stroke={NOIR.ash} strokeWidth="5" />
      <circle cx={100} cy={-20} r={30} fill={NOIR.ink} stroke={NOIR.ash} strokeWidth="5" />
    </>
  )
}

function Sign() {
  return (
    <g transform={`translate(${SIGN} 0)`}>
      <rect x={-6} y={-200} width={12} height={200} fill={NOIR.ink} />
      <polygon points="-70,-300 76,-292 70,-200 -66,-206" fill={NOIR.coal} stroke={NOIR.paperDim} strokeWidth="4" />
      <path d="M-44 -264 H40 M-44 -238 H20" stroke={NOIR.ash} strokeWidth="8" />
    </g>
  )
}

function Neon() {
  return (
    <g transform={`translate(${SIGN} 0)`}>
      <ellipse cx={0} cy={-4} rx={110} ry={14} fill={NOIR.red} opacity="0.35" />
      <circle cx={0} cy={-250} r={130} fill={NOIR.red} opacity="0.14" />
      <polygon points="-58,-288 64,-281 59,-212 -55,-217" fill="none" stroke={NOIR.red} strokeWidth="6" />
      <path d="M-44 -264 H40 M-44 -238 H20" stroke={NOIR.red} strokeWidth="8" />
    </g>
  )
}

function Searchlight() {
  return <polygon points={`-20,${SOURCE} 20,${SOURCE} 200,0 -200,0`} fill={NOIR.paper} opacity="0.2" />
}

export const ventures = roomPlace({
  light: NOIR.red,
  back: (i) => (
    <>
      <Sign />
      <g data-fx={`neon-${i}`} opacity="0">
        <Neon />
      </g>
      <g data-fx={`search-${i}`} opacity="0">
        <Searchlight />
      </g>
    </>
  ),
  front: () => <Car />,
  move: (_profession, t) => still(cover(t)),
  reply: (stage, { count }) => {
    const lights = Array.from({ length: count }, (_, i) => fx(stage, `search-${i}`))
    const signs = Array.from({ length: count }, (_, i) => fx(stage, `neon-${i}`))
    return (played) =>
      lights.forEach((light, i) => {
        const t = played(i)
        const sweep = ramp(t, 0.3, 0.85)
        transformTo(light, `rotate(${(SWING - 2 * SWING * sweep).toFixed(1)} 0 ${SOURCE})`)
        fadeTo(light, Math.sin(Math.PI * sweep))
        fadeTo(signs[i], ramp(t, 0.8, 1))
      })
  },
})
