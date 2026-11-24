import { ramp } from '@/lib/scroll/stage'
import { fx, transformTo } from '../../shared/stageNodes'
import { HOLLOW_SHOULDER, Hollow, turnOf } from '../foes'
import type { Frame, Place } from '../place'
import { PARRY, RIPOSTE, blend, guard, walk } from '../pose'

// Tech Stack in the courtyard: a hollow soldier comes at him, sword raised. As it swings his shield arm
// turns the blow aside and it staggers back to one knee; then he steps in for the riposte, drives his
// blade into it, and it falls. He holds the lunge.

const HOLLOW_AT = 230
const STEP_IN = 70
const STEP = 50

function move(profession: Parameters<typeof guard>[0], t: number): Frame {
  const kit = guard(profession)
  if (t < 0.5) {
    const parried = ramp(t, 0.26, 0.32) - 0.5 * ramp(t, 0.38, 0.5)
    return { pose: blend(kit, PARRY, parried), ahead: 0, lift: 0, roll: 0 }
  }
  const along = ramp(t, 0.5, 0.66)
  const lunge = ramp(t, 0.64, 0.76)
  const from = blend(kit, PARRY, 0.5)
  const stride = along > 0 && along < 1 ? walk(profession, (STEP_IN * along) / STEP) : from
  return { pose: blend(stride, RIPOSTE, lunge), ahead: STEP_IN * along, lift: 0, roll: 0 }
}

/** The hollow's sword arm at t: raised over its head, swung down at him, knocked back high by the parry,
 *  then hanging as it kneels. */
function armAt(t: number): number {
  if (t < 0.22) return 140 * ramp(t, 0.04, 0.22)
  if (t < 0.29) return 140 - 150 * ramp(t, 0.22, 0.29)
  if (t < 0.4) return -10 + 190 * ramp(t, 0.29, 0.36)
  return 180 - 170 * ramp(t, 0.4, 0.5)
}

export const tech: Place = {
  script: [2200, 1800],
  ends: [0.5, 1],
  ahead: () => (
    <g transform={`translate(${HOLLOW_AT} 0)`}>
      <Hollow id="soldier" />
    </g>
  ),
  move,
  reply: (stage) => {
    const soldier = fx(stage, 'soldier')
    const arm = fx(stage, 'soldier-arm')
    return (t) => {
      const staggered = ramp(t, 0.3, 0.4)
      const knelt = ramp(t, 0.4, 0.5)
      const fallen = ramp(t, 0.76, 0.92)
      transformTo(arm, `rotate(${armAt(t).toFixed(1)} ${HOLLOW_SHOULDER[0]} ${HOLLOW_SHOULDER[1]})`)
      transformTo(soldier, turnOf(12 * staggered - 22 * knelt + 80 * fallen, [24, 0], 30 * staggered, 54 * knelt - 20 * fallen))
    }
  },
}
