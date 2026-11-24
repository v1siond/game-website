import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, translateTo } from '../../shared/stageNodes'
import { Bonfire } from '../fire'
import { SOUL } from '../palette'
import { HOLD_X, still, type Frame, type Place } from '../place'
import { DRINK, SIT, blend, guard } from '../pose'
import { FLOOR, handOnCanvas } from '../ruins'

// About at the rest point: the fire burns in its heap of ash before him. He lowers himself and sits by it;
// then he takes the flask from his belt and drinks, its warm light running through him, and lowers it,
// sitting on in the firelight.

const FIRE_AT = 200

/** His pose at t: sitting down over the first action, the flask up to his mouth and down again over the
 *  second. */
function poseAt(profession: Parameters<typeof guard>[0], t: number) {
  if (t < 0.45) return blend(guard(profession), SIT, ramp(t, 0.05, 0.45))
  const up = ramp(t, 0.5, 0.68) - ramp(t, 0.86, 1)
  return blend(SIT, DRINK, up)
}

const move = (profession: Parameters<typeof guard>[0], t: number): Frame => still(poseAt(profession, t))

/** The flask, drawn round its neck: a squat bottle with the warm drink glowing in it. */
function Flask() {
  return (
    <g data-fx="flask" opacity="0">
      <circle cx={0} cy={18} r={34} fill={SOUL.ember} opacity={0.25} />
      <path d="M-5 0 H5 V8 Q16 12 16 24 Q16 36 0 36 Q-16 36 -16 24 Q-16 12 -5 8 Z" fill={SOUL.steelDark} />
      <path d="M-11 20 Q0 16 11 20 Q12 32 0 32 Q-12 32 -11 20 Z" fill={SOUL.flame} />
    </g>
  )
}

export const about: Place = {
  script: [1800, 2200],
  ends: [0.45, 1],
  ahead: () => (
    <g transform={`translate(${FIRE_AT} 0)`}>
      <Bonfire name="rest" lit />
    </g>
  ),
  over: () => (
    <>
      <Flask />
      <defs>
        <radialGradient id="soul-warmth">
          <stop offset="0" stopColor={SOUL.flame} stopOpacity="1" />
          <stop offset="1" stopColor={SOUL.flame} stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse data-fx="warmth" cx={10} cy={-120} rx={110} ry={150} fill="url(#soul-warmth)" opacity="0" />
    </>
  ),
  move,
  reply: (stage, { profession }) => {
    const flask = fx(stage, 'flask')
    const warmth = fx(stage, 'warmth')
    return (t) => {
      const [x, y] = handOnCanvas('near', poseAt(profession, t), HOLD_X)
      translateTo(flask, x - HOLD_X, y - FLOOR)
      fadeTo(flask, ramp(t, 0.46, 0.52))
      fadeTo(warmth, 0.5 * (ramp(t, 0.66, 0.78) - 0.6 * ramp(t, 0.9, 1)))
    }
  },
}
