import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx } from '../../shared/stageNodes'
import { Bandit, Shot, muzzleFromStop, shotOf } from '../bandit'
import { HOURS } from '../desert'
import { CEL } from '../palette'
import { stopsPlace } from '../place'
import { slide } from '../pose'

// Work in the town's afternoon: a sandbag barricade before him, the bounty notice on its board beyond it
// with the wanted raider beside it. First he slides in behind the barricade; then he comes up on one knee
// with the rifle over it and fires, the raider goes over and the notice takes the done stamp.

const BANDIT = 400
const NOTICE = 250
// The slide carries him this far ahead, and his muzzle over the bags sits this much lower than standing.
const SLID = 50
const KNEELING = 40

function Notice() {
  return (
    <g transform={`translate(${NOTICE} 0)`}>
      <path d="M-50 0 V-160 M50 0 V-160" stroke={CEL.plankShade} strokeWidth="12" />
      <rect x={-72} y={-290} width={144} height={140} fill={CEL.plank} />
      <rect x={-50} y={-276} width={100} height={112} fill={CEL.notice} />
      <circle cx={0} cy={-276} r={8} fill={CEL.red} />
      <path d="M-34 -250 H34 M-34 -230 H20 M-34 -210 H28" stroke={CEL.ink} strokeWidth="5" />
    </g>
  )
}

function Done() {
  return (
    <g transform={`translate(${NOTICE} 0)`}>
      <rect x={-40} y={-232} width={80} height={52} fill="none" stroke={CEL.flavour} strokeWidth="6" transform="rotate(-10 0 -206)" data-bare />
      <path d="M-22 -208 L-6 -192 L24 -224" fill="none" stroke={CEL.flavour} strokeWidth="9" strokeLinecap="round" data-bare />
    </g>
  )
}

function Sandbags() {
  return (
    <g transform="translate(150 0)">
      {[
        [-60, -36],
        [0, -36],
        [60, -36],
        [-30, -84],
        [30, -84],
      ].map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x - 32} y={y} width={64} height={44} rx={18} fill={CEL.dune} />
      ))}
    </g>
  )
}

const muzzle = muzzleFromStop(-KNEELING)

export const work = stopsPlace({
  hour: HOURS.town,
  script: [1600, 2200],
  ends: [0.4, 1],
  back: () => (
    <>
      <Notice />
      <g data-fx="done" opacity="0">
        <Done />
      </g>
      <g transform={`translate(${BANDIT} 0)`}>
        <Bandit name="bandit" />
      </g>
    </>
  ),
  front: () => (
    <>
      <Sandbags />
      <Shot name="shot" from={{ x: muzzle.x + SLID, y: muzzle.y }} to={{ x: BANDIT, y: -230 }} />
    </>
  ),
  move: (_profession, t) => ({ pose: slide(t), ahead: SLID * ramp(t, 0, 0.4), lift: 0 }),
  reply: (stage) => {
    const shot = shotOf(stage, 'shot', 'bandit')
    const done = fx(stage, 'done')
    return (t) => {
      shot(t, [0.5, 0.8])
      fadeTo(done, ramp(t, 0.85, 0.95))
    }
  },
})
