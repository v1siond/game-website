import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, translateTo } from '../../shared/stageNodes'
import { NOIR } from '../palette'
import { roomPlace, still } from '../place'
import { pick } from '../pose'

// Work: the records room. For each job a filing cabinet comes to him on the dash from the last one; he
// drops to his knees at its lock and picks it, and the top drawer slides out at him with the red tab of
// the file standing up out of it.

// The cabinet stands this far right of him, and a picked drawer comes out this far.
const AT = 150
const OUT = 46

function Cabinet() {
  return (
    <g transform={`translate(${AT} 0)`}>
      <rect x={-56} y={-230} width={112} height={230} fill={NOIR.ink} stroke={NOIR.smoke} strokeWidth="4" />
      {[-224, -150, -76].map((y) => (
        <g key={y}>
          <rect x={-48} y={y} width={96} height={66} fill={NOIR.coal} />
          <rect x={-18} y={y + 12} width={36} height={14} fill={NOIR.paperDim} />
          <rect x={-12} y={y + 38} width={24} height={6} fill={NOIR.ash} />
        </g>
      ))}
      <circle cx={-40} cy={-120} r={7} fill={NOIR.paperDim} />
    </g>
  )
}

function Drawer() {
  return (
    <>
      <rect x={-48} y={-224} width={96} height={66} fill={NOIR.smoke} stroke={NOIR.paper} strokeWidth="3" />
      <rect x={-40} y={-254} width={34} height={30} fill={NOIR.red} />
      <rect x={-2} y={-246} width={40} height={22} fill={NOIR.paper} />
      <rect x={-18} y={-212} width={36} height={14} fill={NOIR.paper} />
    </>
  )
}

export const work = roomPlace({
  light: NOIR.paperDim,
  back: (i) => (
    <>
      <Cabinet />
      <g transform={`translate(${AT} 0)`}>
        <g data-fx={`drawer-${i}`} opacity="0">
          <Drawer />
        </g>
      </g>
    </>
  ),
  move: (_profession, t) => still(pick(t)),
  reply: (stage, { count }) => {
    const drawers = Array.from({ length: count }, (_, i) => fx(stage, `drawer-${i}`))
    return (played) =>
      drawers.forEach((drawer, i) => {
        const out = ramp(played(i), 0.82, 1)
        fadeTo(drawer, out)
        translateTo(drawer, -OUT * out, 0)
      })
  },
})
