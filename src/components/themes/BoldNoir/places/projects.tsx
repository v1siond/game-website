import { hop } from '@/lib/motion/arc'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, transformTo } from '../../shared/stageNodes'
import { NOIR } from '../palette'
import { roomPlace } from '../place'
import { ambush } from '../pose'
import { Shadow } from '../shadow'

// Projects: the gallery after hours. For each project a crate comes to him on the dash, a guard beyond it
// watching a painting on the wall. He springs out from behind the crate in one leap onto the guard's back,
// the guard goes down on his face, the mask is torn off and flung high, and the painting lights.

// The guard stands this far right of him, the painting beyond; the leap clears this high and lands him on
// the fallen guard this high.
const GUARD = 230
const PAINTING = 400
const HEIGHT = 230
const ON_HIM = 60

function Painting() {
  return (
    <g transform={`translate(${PAINTING} -330)`}>
      <rect x={-80} y={-70} width={160} height={140} fill={NOIR.coal} stroke={NOIR.paperDim} strokeWidth="8" />
      <path d="M-60 50 L-20 -10 L10 20 L30 0 L60 50 Z" fill={NOIR.smoke} />
    </g>
  )
}

function Lit() {
  return (
    <g transform={`translate(${PAINTING} -330)`}>
      <polygon points="-30,-300 30,-300 120,-70 -120,-70" fill={NOIR.paper} opacity="0.2" />
      <rect x={-72} y={-62} width={144} height={124} fill={NOIR.paper} opacity="0.25" />
      <path d="M0 -40 L9 -16 L34 -16 L14 0 L22 26 L0 10 L-22 26 L-14 0 L-34 -16 L-9 -16 Z" fill={NOIR.red} stroke={NOIR.paper} strokeWidth="3" />
    </g>
  )
}

function Crate() {
  return (
    <g transform="translate(10 0)">
      <rect x={-110} y={-150} width={220} height={150} fill={NOIR.smoke} stroke={NOIR.ink} strokeWidth="6" />
      <path d="M-110 -150 L110 0 M110 -150 L-110 0" stroke={NOIR.ink} strokeWidth="6" />
    </g>
  )
}

export const projects = roomPlace({
  light: NOIR.paperDim,
  back: (i) => (
    <>
      <Painting />
      <g data-fx={`painting-${i}`} opacity="0">
        <Lit />
      </g>
      <g transform={`translate(${GUARD} 0)`}>
        <Shadow name={`guard-${i}`} />
      </g>
    </>
  ),
  front: () => <Crate />,
  move: (_profession, t) => {
    const leap = ramp(t, 0.2, 0.8)
    return { pose: ambush(t), ahead: (GUARD - 30) * leap, lift: hop(leap, HEIGHT) + ON_HIM * ramp(leap, 0.5, 1) }
  },
  reply: (stage, { count }) => {
    const guards = Array.from({ length: count }, (_, i) => fx(stage, `guard-${i}`))
    const masks = Array.from({ length: count }, (_, i) => fx(stage, `guard-${i}-mask`))
    const paintings = Array.from({ length: count }, (_, i) => fx(stage, `painting-${i}`))
    return (played) =>
      guards.forEach((guard, i) => {
        const t = played(i)
        const down = ramp(t, 0.6, 0.8)
        const flung = ramp(t, 0.62, 0.9)
        transformTo(guard, `rotate(${(80 * down).toFixed(1)})`)
        transformTo(masks[i], `translate(${(-140 * flung).toFixed(1)} ${(-220 * flung).toFixed(1)}) rotate(${(-300 * flung).toFixed(1)} 0 -250)`)
        fadeTo(paintings[i], ramp(t, 0.8, 1))
      })
  },
})
