import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, transformTo } from '../../shared/stageNodes'
import { DEMON_SHOULDER, Demon, turnOf } from '../foes'
import { SOUL } from '../palette'
import type { Frame, Place } from '../place'
import { TUCKED, blend, blow, guard } from '../pose'

// Projects in the demon's arena: a great demon stands over him with its stone hammer. It heaves the hammer
// up and brings it down where he stood, and he rolls through under it, the stone cracking the floor behind
// him; then he strikes its leg with a heavy blow and the demon reels. He holds in guard under it.

const DEMON_AT = 330
const ROLLED = 190
// The hammer's turn from where it is drawn (landed): hanging back by its side, then heaved overhead.
const HANGING = -28
const OVERHEAD = 135

function move(profession: Parameters<typeof guard>[0], t: number): Frame {
  const kit = guard(profession)
  if (t < 0.5) {
    const rolling = ramp(t, 0.3, 0.48)
    const tuck = Math.min(1, 4 * rolling * (1 - rolling) * 1.6)
    return { pose: blend(kit, TUCKED, tuck), ahead: ROLLED * rolling, lift: 0, roll: 360 * rolling }
  }
  return { pose: blow(profession, ramp(t, 0.52, 0.9)), ahead: ROLLED, lift: 0, roll: 0 }
}

/** The hammer's turn at t: heaved up, held, slammed down, then dragged back as the demon reels. */
function hammerAt(t: number): number {
  if (t < 0.3) return HANGING + (OVERHEAD - HANGING) * ramp(t, 0.04, 0.26)
  if (t < 0.7) return OVERHEAD - OVERHEAD * ramp(t, 0.3, 0.38)
  return -40 * ramp(t, 0.72, 0.88)
}

/** The floor cracked where the hammer fell, and its dust. */
function Impact() {
  return (
    <g data-fx="impact" opacity="0">
      <ellipse cx={0} cy={-30} rx={150} ry={50} fill={SOUL.ash} opacity={0.5} />
      <path d="M-60 0 L-20 -8 L10 4 L50 -6 M-10 0 L-30 18" stroke={SOUL.ink} strokeWidth={4} fill="none" />
    </g>
  )
}

export const projects: Place = {
  travel: ROLLED,
  script: [2400, 1800],
  ends: [0.5, 1],
  ahead: () => (
    <>
      <Impact />
      <g transform={`translate(${DEMON_AT} 0)`}>
        <Demon id="demon" />
      </g>
    </>
  ),
  move,
  reply: (stage) => {
    const demon = fx(stage, 'demon')
    const arm = fx(stage, 'demon-arm')
    const impact = fx(stage, 'impact')
    return (t) => {
      const reel = ramp(t, 0.7, 0.86)
      transformTo(arm, `rotate(${hammerAt(t).toFixed(1)} ${DEMON_SHOULDER[0]} ${DEMON_SHOULDER[1]})`)
      transformTo(demon, turnOf(7 * reel, [120, 0], 20 * reel, 0))
      fadeTo(impact, ramp(t, 0.37, 0.4) * (1 - 0.6 * ramp(t, 0.45, 0.7)))
    }
  },
}
