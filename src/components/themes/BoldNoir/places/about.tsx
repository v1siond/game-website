import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, translateTo } from '../../shared/stageNodes'
import { NOIR } from '../palette'
import { roomPlace, still } from '../place'
import { hug } from '../pose'

// About: the building's offices. For each line of the record a doorway comes to him on the dash, he flattens
// his back into it with the brim down, and a guard's torch beam sweeps past him from the right without
// finding him; as it passes, the pinned clue on the evidence board beside the door catches its light.

// The torch beam starts this far right of him and has passed this far left by the end of the beat.
const BEAM_FROM = 700
const BEAM_TO = -900

function Doorway() {
  return (
    <>
      <rect x={-96} y={-350} width={192} height={350} fill={NOIR.paper} />
      <rect x={-80} y={-336} width={160} height={336} fill={NOIR.ink} />
      <rect x={-80} y={-336} width={160} height={14} fill={NOIR.smoke} />
    </>
  )
}

// The evidence board right of the door: a photograph pinned with the red string to its pin.
function Board() {
  return (
    <g transform="translate(250 -300)">
      <rect x={-70} y={-60} width={140} height={120} fill={NOIR.smoke} stroke={NOIR.ink} strokeWidth="5" />
      <rect x={-40} y={-40} width={80} height={60} fill={NOIR.paperDim} />
      <circle cx={0} cy={-22} r={12} fill={NOIR.ink} />
      <path d="M-20 14 Q0 -12 20 14 Z" fill={NOIR.ink} />
    </g>
  )
}

function Clue() {
  return (
    <g transform="translate(250 -300)">
      <circle r={110} fill={NOIR.paper} opacity="0.2" />
      <path d="M-56 -50 L0 -86 L56 -50" fill="none" stroke={NOIR.red} strokeWidth="4" />
      <path d="M26 -10 L36 14 L60 6 L44 26 L60 46 L36 38 L26 62 L16 38 L-8 46 L8 26 L-8 6 L16 14 Z" fill={NOIR.red} stroke={NOIR.paper} strokeWidth="3" />
    </g>
  )
}

function Beam() {
  return <polygon points="0,-250 900,-420 900,-40" fill={NOIR.paper} opacity="0.22" />
}

export const about = roomPlace({
  light: NOIR.paper,
  back: (i) => (
    <>
      <Doorway />
      <Board />
      <g data-fx={`clue-${i}`} opacity="0">
        <Clue />
      </g>
    </>
  ),
  front: (i) => (
    <g data-fx={`beam-${i}`} transform={`translate(${BEAM_FROM} 0)`} opacity="0">
      <Beam />
    </g>
  ),
  move: (_profession, t) => still(hug(t)),
  reply: (stage, { count }) => {
    const beams = Array.from({ length: count }, (_, i) => fx(stage, `beam-${i}`))
    const clues = Array.from({ length: count }, (_, i) => fx(stage, `clue-${i}`))
    return (played) =>
      beams.forEach((beam, i) => {
        const t = played(i)
        const sweep = ramp(t, 0.3, 1)
        translateTo(beam, BEAM_FROM + (BEAM_TO - BEAM_FROM) * sweep, 0)
        fadeTo(beam, Math.sin(Math.PI * Math.min(1, sweep * 1.6 + 0.2)) * (t > 0.3 ? 1 : 0))
        fadeTo(clues[i], ramp(t, 0.35, 0.55))
      })
  },
})
