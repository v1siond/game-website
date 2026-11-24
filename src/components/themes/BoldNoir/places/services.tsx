import { ramp } from '@/lib/scroll/stage'
import { actionLengths, elapsedOf } from '@/lib/scroll/player'
import { fadeTo, fx, r1, transformTo } from '../../shared/stageNodes'
import { NOIR } from '../palette'
import { share, stepPlace, type Frame } from '../case'
import { SEDAN, Sedan } from '../sedan'
import { DRIVE } from '../pose'

// Services: the drive. He is at the wheel of his car side on, the roof light turning red, and the street
// runs past behind him, the lamps and the palms going by as the car gathers speed; then it brakes hard, the
// nose dips and it rocks back, stopped at the kerb. The game's drive with the siren, then the stop.

const SCRIPT = [2200, 1400]
// He sits this far right of his place, so the car clears the text column.
const AHEAD = 160
const CAR_X = AHEAD - SEDAN.driver
// The street goes by at this speed at full pace (canvas units per ms), after this run up.
const PACE = 0.9
const RUN_UP_MS = 600
// The lamps and palms that go by stand this far apart.
const GAP = 380
const PASSING = Array.from({ length: 9 }, (_, i) => -1100 + i * GAP)

/** How far the street has gone by `ms` into the drive: a run up to full pace, the pace held, then braked to
 *  a stop over the second action. */
function travelled(ms: number): number {
  const [drive, brake] = actionLengths(SCRIPT)
  if (ms <= RUN_UP_MS) return (PACE * ms * ms) / (2 * RUN_UP_MS)
  const cruising = (PACE * RUN_UP_MS) / 2 + PACE * (Math.min(ms, drive) - RUN_UP_MS)
  if (ms <= drive) return cruising
  const braking = Math.min(ms - drive, brake)
  return cruising + PACE * (braking - (braking * braking) / (2 * brake))
}

function Passing() {
  return (
    <g data-fx="passing">
      {PASSING.map((x, i) =>
        i % 2 === 0 ? (
          <g key={x}>
            <rect x={x - 6} y={-420} width={12} height={420} fill={NOIR.ink} />
            <path d={`M${x} -410 H${x + 46}`} stroke={NOIR.ink} strokeWidth="10" />
            <polygon points={`${x + 26},-410 ${x + 66},-410 ${x + 58},-386 ${x + 34},-386`} fill={NOIR.paperDim} />
          </g>
        ) : (
          <path key={x} d={`M${x - 8} 0 Q${x + 10} -260 ${x + 20} -480 L${x + 30} -480 Q${x + 22} -260 ${x + 8} 0 Z`} fill={NOIR.ink} />
        ),
      )}
    </g>
  )
}

export const services = stepPlace({
  light: NOIR.red,
  script: SCRIPT,
  back: () => <Passing />,
  front: () => (
    <g data-fx="drive-car" transform={`translate(${CAR_X} 0)`}>
      <Sedan name="drive" />
    </g>
  ),
  bind: (stage) => {
    const passing = fx(stage, 'passing')
    const car = fx(stage, 'drive-car')
    const beacon = fx(stage, 'drive-beacon')
    const beam = fx(stage, 'drive-beam')
    return (play): Frame => {
      const ms = elapsedOf(SCRIPT, play)
      const braked = share(play, 1)
      transformTo(passing, `translate(${r1(-(travelled(ms) % (GAP * 2)))} 0)`)
      // the road's bounce while it runs, the nose dipping at the stop and rocking back
      const bounce = 2.5 * Math.sin(ms / 70) * ramp(share(play, 0), 0, 0.3) * (1 - braked)
      const pitch = 3 * Math.sin(Math.PI * ramp(braked, 0.55, 1))
      transformTo(car, `translate(${CAR_X} ${r1(bounce)}) rotate(${pitch.toFixed(2)} ${SEDAN.frontWheel} 0)`)
      // the roof light turns: lit and dark by turns while the car runs, lit when it stops
      fadeTo(beacon, play.done ? 1 : Math.floor(ms / 220) % 2 === 0 ? 1 : 0.15)
      fadeTo(beam, ramp(share(play, 0), 0, 0.2))
      return { pose: { ...DRIVE, lean: DRIVE.lean + 2 * pitch }, ahead: AHEAD + (pitch * (SEDAN.frontWheel - SEDAN.driver) * Math.PI) / 180, lift: -bounce }
    }
  },
})
