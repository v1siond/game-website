import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, transformTo } from '../../shared/stageNodes'
import { Bonfire } from '../fire'
import { SOUL } from '../palette'
import type { Frame, Place } from '../place'
import { KNEEL, LIFT, blend, guard } from '../pose'

// Contact at the last fire: it burns at the end of the way, an old iron bound chest at its foot. He kneels
// at the chest; then he lifts its lid back toward him on its near hinge and a warm light rises out of it
// onto his face. He holds, the lid
// open.

const CHEST = { from: 70, to: 210, height: 80 }
const FIRE_AT = 380

function move(profession: Parameters<typeof guard>[0], t: number): Frame {
  if (t < 0.45) return { pose: blend(guard(profession), KNEEL, ramp(t, 0.05, 0.45)), ahead: 0, lift: 0, roll: 0 }
  return { pose: blend(KNEEL, LIFT, ramp(t, 0.5, 0.8)), ahead: 0, lift: 0, roll: 0 }
}

function Chest() {
  const { from, to, height } = CHEST
  return (
    <>
      <g data-fx="glow" opacity="0">
        <defs>
          <radialGradient id="soul-chest-light">
            <stop offset="0" stopColor={SOUL.flameCore} stopOpacity="0.8" />
            <stop offset="1" stopColor={SOUL.flame} stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx={(from + to) / 2} cy={-height - 40} rx={170} ry={130} fill="url(#soul-chest-light)" />
        <rect x={from + 8} y={-height - 6} width={to - from - 16} height={10} fill={SOUL.flameCore} />
      </g>
      <rect x={from} y={-height} width={to - from} height={height} fill={SOUL.wood} />
      <path d={`M${from} ${-height / 2} H${to} M${from + 30} 0 V${-height} M${to - 30} 0 V${-height}`} stroke={SOUL.iron} strokeWidth={8} />
      <g data-fx="lid">
        <path d={`M${from - 4} ${-height} V${-height - 18} Q${(from + to) / 2} ${-height - 50} ${to + 4} ${-height - 18} V${-height} Z`} fill={SOUL.wood} />
        <path d={`M${from + 30} ${-height} V${-height - 34} M${to - 30} ${-height} V${-height - 34}`} stroke={SOUL.iron} strokeWidth={8} />
      </g>
    </>
  )
}

export const contact: Place = {
  script: [1600, 1800],
  ends: [0.45, 1],
  ahead: () => (
    <>
      <g transform={`translate(${FIRE_AT} 0)`}>
        <Bonfire name="last" lit />
      </g>
      <Chest />
    </>
  ),
  move,
  reply: (stage) => {
    const lid = fx(stage, 'lid')
    const glow = fx(stage, 'glow')
    return (t) => {
      const open = ramp(t, 0.5, 0.8)
      transformTo(lid, `rotate(${(-100 * open).toFixed(1)} ${CHEST.from - 4} ${-CHEST.height})`)
      fadeTo(glow, ramp(t, 0.55, 0.85))
    }
  },
}
