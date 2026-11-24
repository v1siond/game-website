import { mix } from '@/lib/motion/rigPose'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, focusOn, fx, transformTo, translateTo } from '../../shared/stageNodes'
import { Bandit, flung } from '../bandit'
import { FLOOR, HOURS } from '../desert'
import { Burst } from '../ink'
import { CEL } from '../palette'
import { holdX, still, stopsPlace } from '../place'
import { comeback, down, kick } from '../pose'

// Muay Thai at dusk, raiders on the sand: first a raider comes at him and he kicks it out of his guard,
// flung back onto the sand. Then the second lands its blow: he goes down on one knee with the edges of the
// frame in red. Then he comes back with a rising uppercut from the knee that throws the raider high, and he
// stands in a big sun starburst as the camera pushes in on him: the second wind.

const RAIDER = 210
// The second raider walks in from here, and lunges this far in to land its blow.
const FROM = 560
const LUNGE = 70
// The comeback pushes the camera in this far on him.
const PUSH = 0.22

/** His move over the three actions: the kick to 0.33, knocked down to 0.6, the comeback to the end. */
function move(profession: Parameters<typeof kick>[0], t: number) {
  if (t < 0.33) return kick(profession, t / 0.33)
  if (t < 0.6) return mix(kick(profession, 1), down(profession, ramp(t, 0.42, 0.52)), ramp(t, 0.33, 0.4))
  return comeback(ramp(t, 0.62, 0.78))
}

export const muayThai = stopsPlace({
  hour: HOURS.dusk,
  script: [1400, 1600, 2000],
  ends: [0.33, 0.6, 1],
  back: () => (
    <>
      <g data-fx="rally" opacity="0">
        <Burst x={0} y={-160} r={260} fill={CEL.sun} />
        <Burst x={0} y={-160} r={150} fill={CEL.orange} />
      </g>
      <g transform={`translate(${RAIDER} 0)`}>
        <Bandit name="first" />
      </g>
      <g data-fx="second-at" transform={`translate(${FROM} 0)`}>
        <Bandit name="second" />
      </g>
    </>
  ),
  front: () => <rect data-fx="hurt" x={-1400} y={-1100} width={2800} height={1600} fill="none" stroke={CEL.crit} strokeWidth="160" opacity="0" data-bare />,
  move: (profession, t) => still(move(profession, t)),
  reply: (stage, { phone }) => {
    const first = fx(stage, 'first')
    const secondAt = fx(stage, 'second-at')
    const second = fx(stage, 'second')
    const rally = fx(stage, 'rally')
    const hurt = fx(stage, 'hurt')
    const camera = fx(stage, 'camera')
    const x = holdX(phone)
    return (t) => {
      transformTo(first, flung(ramp(t, 0.18, 0.33), 260, 140))
      fadeTo(first, 1 - ramp(t, 0.36, 0.42))
      const walked = ramp(t, 0.33, 0.42)
      const lunge = ramp(t, 0.42, 0.47) - ramp(t, 0.47, 0.55)
      translateTo(secondAt, FROM + (RAIDER - FROM) * walked - LUNGE * lunge, 0)
      fadeTo(secondAt, walked > 0 ? 1 : 0)
      fadeTo(hurt, 0.55 * ramp(t, 0.45, 0.5) * (1 - ramp(t, 0.62, 0.72)))
      transformTo(second, flung(ramp(t, 0.66, 0.92), 300, 320))
      fadeTo(rally, ramp(t, 0.7, 0.8))
      transformTo(camera, focusOn(x, FLOOR - 160, 1 + PUSH * ramp(t, 0.62, 0.8)))
    }
  },
})
