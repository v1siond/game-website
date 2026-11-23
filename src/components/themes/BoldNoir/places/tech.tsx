import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, transformTo } from '../../shared/stageNodes'
import { NOIR } from '../palette'
import { roomPlace, still } from '../place'
import { crack } from '../pose'

// Tech: the vault. For each group of tools a safe comes to him on the dash; he kneels at it and works the
// dial back and forth under his hand until it gives, and the door swings open on the paper lit inside.

// The safe stands this far right of him; a cracked dial has turned this far.
const AT = 150
const DIAL = { y: -110, r: 26 }
const TURNED = 270

function Safe() {
  return (
    <>
      <rect x={-70} y={-190} width={140} height={180} fill={NOIR.ink} stroke={NOIR.ash} strokeWidth="5" />
      <rect x={-60} y={-10} width={24} height={10} fill={NOIR.ink} />
      <rect x={36} y={-10} width={24} height={10} fill={NOIR.ink} />
      <rect x={-56} y={-176} width={112} height={152} fill="none" stroke={NOIR.smoke} strokeWidth="3" />
    </>
  )
}

function Dial() {
  return (
    <>
      <circle cx={0} cy={DIAL.y} r={DIAL.r} fill={NOIR.paperDim} stroke={NOIR.ink} strokeWidth="3" />
      <path d={`M0 ${DIAL.y - DIAL.r} V${DIAL.y - DIAL.r + 10}`} stroke={NOIR.red} strokeWidth="4" />
      <circle cx={0} cy={DIAL.y} r={6} fill={NOIR.ink} />
    </>
  )
}

function Open() {
  return (
    <>
      <rect x={-56} y={-176} width={112} height={152} fill={NOIR.paper} />
      <rect x={-40} y={-150} width={80} height={30} fill={NOIR.red} />
      <rect x={-40} y={-104} width={80} height={60} fill={NOIR.smoke} />
      <polygon points="56,-176 110,-196 110,-4 56,-24" fill={NOIR.coal} stroke={NOIR.ash} strokeWidth="4" />
    </>
  )
}

export const tech = roomPlace({
  light: NOIR.paper,
  back: (i) => (
    <g transform={`translate(${AT} 0)`}>
      <Safe />
      <g data-fx={`dial-${i}`}>
        <Dial />
      </g>
      <g data-fx={`open-${i}`} opacity="0">
        <Open />
      </g>
    </g>
  ),
  move: (_profession, t) => still(crack(t)),
  reply: (stage, { count }) => {
    const dials = Array.from({ length: count }, (_, i) => fx(stage, `dial-${i}`))
    const doors = Array.from({ length: count }, (_, i) => fx(stage, `open-${i}`))
    return (played) =>
      dials.forEach((dial, i) => {
        const t = played(i)
        transformTo(dial, `rotate(${(TURNED * Math.sin(Math.PI * ramp(t, 0.3, 0.85))).toFixed(1)} 0 ${DIAL.y})`)
        fadeTo(doors[i], ramp(t, 0.85, 1))
      })
  },
})
