import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx } from '../../shared/stageNodes'
import { SOUL } from '../palette'
import type { Frame, Place } from '../place'
import { FEEL, blend, guard, walk } from '../pose'

// Services at the fog gate: a stone arch closed by a wall of pale fog, what waits beyond it unseen. He
// walks into it slowly, his hand held out ahead of him; then the fog thins round him and he stands inside
// the gate, guard up, ready for what is there.

const GATE = { from: 110, to: 340, top: -460 }
const INSIDE = 225
const STEP = 48

function move(profession: Parameters<typeof guard>[0], t: number): Frame {
  const along = ramp(t, 0.06, 0.58)
  const reach = 0.7 * (ramp(t, 0, 0.12) - ramp(t, 0.66, 0.85))
  const legs = along > 0 && along < 1 ? walk(profession, (INSIDE * along) / STEP) : guard(profession)
  return { pose: blend(legs, FEEL, reach), ahead: INSIDE * along, lift: 0, roll: 0 }
}

/** The arch: two pillars and the broken curve between them. */
function Arch() {
  const { from, to, top } = GATE
  return (
    <path
      d={`M${from - 50} 0 V${top + 80} Q${(from + to) / 2} ${top - 80} ${to + 50} ${top + 80} V0 H${to} V${top + 100} Q${(from + to) / 2} ${top - 20} ${from} ${top + 100} V0 Z`}
      fill={SOUL.rock}
    />
  )
}

/** The fog that fills the arch, drawn over him: pale layers drifting across it. */
function FogWall() {
  const { from, to, top } = GATE
  return (
    <g data-fx="fogwall" opacity="0.85">
      <defs>
        <linearGradient id="soul-fogwall" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={SOUL.mist} stopOpacity="0.4" />
          <stop offset="0.5" stopColor={SOUL.mist} stopOpacity="0.85" />
          <stop offset="1" stopColor={SOUL.mist} stopOpacity="0.5" />
        </linearGradient>
      </defs>
      <path d={`M${from} 0 V${top + 100} Q${(from + to) / 2} ${top - 20} ${to} ${top + 100} V0 Z`} fill="url(#soul-fogwall)" />
      <path d={`M${from} -120 Q${from + 60} -190 ${from + 120} -140 T${to} -170 V-60 Q${from + 120} -20 ${from} -70 Z`} fill={SOUL.mist} opacity={0.35} />
      <path d={`M${from} -300 Q${from + 80} -360 ${from + 150} -310 T${to} -330 V-250 Q${from + 100} -220 ${from} -260 Z`} fill={SOUL.mist} opacity={0.3} />
    </g>
  )
}

export const services: Place = {
  travel: INSIDE,
  script: [2400, 1600],
  ends: [0.6, 1],
  ahead: () => <Arch />,
  over: () => <FogWall />,
  move,
  reply: (stage) => {
    const fog = fx(stage, 'fogwall')
    return (t) => fadeTo(fog, 0.85 - 0.6 * ramp(t, 0.62, 0.9))
  },
}
