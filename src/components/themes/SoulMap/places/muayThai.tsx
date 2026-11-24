import { ramp } from '@/lib/scroll/stage'
import { fx, transformTo } from '../../shared/stageNodes'
import { SHIELD_SHOULDER, ShieldKnight, turnOf } from '../foes'
import type { Frame, Place } from '../place'
import { RIPOSTE, blend, guard, kick, walk } from '../pose'

// Muay Thai in the training yard of the keep: a shield knight stands behind its tall shield. His front
// kick drives into the shield and throws it wide, the knight rocked back; then he steps into the opening
// and strikes, and the knight reels back, sagging under its shield. He holds in the strike.

const KNIGHT_AT = 165
const STEP_IN = 20
const STEP = 50

function move(profession: Parameters<typeof guard>[0], t: number): Frame {
  const kit = guard(profession)
  if (t < 0.5) {
    const kicked = kick(profession, ramp(t, 0.02, 0.36))
    return { pose: blend(kicked, kit, ramp(t, 0.38, 0.5)), ahead: 0, lift: 0, roll: 0 }
  }
  const along = ramp(t, 0.5, 0.64)
  const stride = along > 0 && along < 1 ? walk(profession, (STEP_IN * along) / STEP) : kit
  return { pose: blend(stride, RIPOSTE, ramp(t, 0.62, 0.74)), ahead: STEP_IN * along, lift: 0, roll: 0 }
}

export const muayThai: Place = {
  script: [2000, 1800],
  ends: [0.5, 1],
  ahead: () => (
    <g transform={`translate(${KNIGHT_AT} 0)`}>
      <ShieldKnight id="warden" />
    </g>
  ),
  move,
  reply: (stage) => {
    const warden = fx(stage, 'warden')
    const shield = fx(stage, 'warden-shield')
    return (t) => {
      const thrown = ramp(t, 0.18, 0.3)
      const fallen = ramp(t, 0.74, 0.9)
      transformTo(shield, `rotate(${(42 * thrown - 12 * fallen).toFixed(1)} ${SHIELD_SHOULDER[0]} ${SHIELD_SHOULDER[1]})`)
      transformTo(warden, turnOf(10 * thrown - 4 * fallen, [22, 0], 16 * thrown + 74 * fallen, 30 * fallen))
    }
  },
}
