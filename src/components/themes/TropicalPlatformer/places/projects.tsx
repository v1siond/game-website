import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, lerp, r1, transformTo } from '../../shared/stageNodes'
import { CROUCH, LIFT, REACH, STAND, blend, ease, flight, still, stride, type Frame } from '../moves'
import type { SceneDef } from '../place'
import { COLORS as C } from '../palette'
import { COVER } from './kit'

// Projects: the mushroom forest (research/2026-11-25-deep-dk64 §4: the giant mushroom, the clock that turns day
// to night, the seed planted by the stump that grows into a beanstalk). By day he walks to the soft ground by
// the giant mushroom and plants a seed; the clock on its tower spins its hands round to night, the moon comes
// up, and the beanstalk shoots up under him and carries him high over the mushroom caps, where he stands on
// its top leaf in the night sky.

const SEED = 110
const TOP = 420
const MUSHROOM = { x: 330, top: -300, half: 120 }
const CLOCK = { x: 500, y: -330 }
const GROW = { from: 0.4, to: 0.9 }
const NIGHT = { from: 0.34, to: 0.6 }

/** How high the stalk has grown at t, 0 to 1. */
const grownAt = (t: number): number => ease(ramp(t, GROW.from, GROW.to))

const move = (t: number): Frame => {
  if (t < 0.18) return still(stride(4 * ramp(t, 0.02, 0.18)), lerp(0, SEED - 50, ramp(t, 0.02, 0.18)))
  if (t < 0.32) return still(blend(STAND, CROUCH, t, 0.18, 0.24), SEED - 50)
  if (t < 0.4) {
    const [ahead, lift] = flight(ramp(t, 0.32, 0.4), [SEED - 50, 0], [SEED, 24], 60)
    return { pose: blend(CROUCH, STAND, t, 0.32, 0.38), ahead, lift }
  }
  // riding the stalk up, crouched on its leaf, then standing tall on the top
  const lift = 24 + (TOP - 24) * grownAt(t)
  if (t < 0.9) return still(blend(STAND, CROUCH, t, 0.4, 0.46), SEED, lift)
  return still(t < 0.95 ? blend(CROUCH, REACH, t, 0.9, 0.95) : blend(REACH, LIFT, t, 0.95, 1), SEED, lift)
}

/** The beanstalk at full height from its foot on 0 0, the leaf he rides on its top at 0 -TOP; the place grows
 *  it by scaling it up from the ground. */
function Beanstalk() {
  return (
    <g>
      <path d={`M-10 0 Q-40 ${-TOP * 0.3} 10 ${-TOP * 0.55} Q40 ${-TOP * 0.8} 0 ${-TOP}`} fill="none" stroke="#2f7a2a" strokeWidth={26} strokeLinecap="round" />
      <path d={`M-10 0 Q-40 ${-TOP * 0.3} 10 ${-TOP * 0.55} Q40 ${-TOP * 0.8} 0 ${-TOP}`} fill="none" stroke="#7cc243" strokeWidth={8} strokeLinecap="round" opacity={0.7} />
      {[0.25, 0.5, 0.75].map((k, i) => (
        <path key={k} d={`M0 ${-TOP * k} q${i % 2 ? 70 : -70} -30 ${i % 2 ? 110 : -110} 10 q${i % 2 ? -50 : 50} 10 ${i % 2 ? -110 : 110} -10 Z`} fill="#4aa83a" stroke={C.shadow} strokeWidth={2} />
      ))}
      <path d={`M-70 ${-TOP + 6} Q0 ${-TOP - 26} 70 ${-TOP + 6} Q0 ${-TOP + 22} -70 ${-TOP + 6} Z`} fill="#5fb83a" stroke={C.shadow} strokeWidth={3} />
    </g>
  )
}

/** The giant mushroom: a pale stem, a red cap with white spots. */
const Mushroom = () => (
  <g>
    <path d={`M-30 0 Q-40 ${MUSHROOM.top * 0.5} -24 ${MUSHROOM.top + 30} H24 Q40 ${MUSHROOM.top * 0.5} 30 0 Z`} fill="#efe2c6" stroke={C.shadow} strokeWidth={3} />
    <path d={`M${-MUSHROOM.half} ${MUSHROOM.top + 40} Q${-MUSHROOM.half + 10} ${MUSHROOM.top - 90} 0 ${MUSHROOM.top - 100} Q${MUSHROOM.half - 10} ${MUSHROOM.top - 90} ${MUSHROOM.half} ${MUSHROOM.top + 40} Z`} fill="url(#tp-cap)" stroke={C.shadow} strokeWidth={4} />
    {[
      [-60, -40, 16],
      [10, -70, 20],
      [70, -30, 14],
    ].map(([x, y, r]) => (
      <circle key={x} cx={x} cy={MUSHROOM.top + y} r={r} fill="#fff6ea" stroke={C.shadow} strokeWidth={2} />
    ))}
  </g>
)

/** The clock on its wooden tower, its two hands (`hand-hour`, `hand-minute`) turning about its middle. */
const ClockTower = () => (
  <g>
    <rect x={-46} y={CLOCK.y} width={92} height={-CLOCK.y} fill="url(#tp-wood)" stroke={C.shadow} strokeWidth={3} />
    <path d={`M-62 ${CLOCK.y - 40} L0 ${CLOCK.y - 120} L62 ${CLOCK.y - 40} Z`} fill="#3f8a2c" stroke={C.shadow} strokeWidth={3} />
    <g transform={`translate(0 ${CLOCK.y})`}>
      <circle r={56} fill="#fff6e0" stroke={C.shadow} strokeWidth={5} />
      {Array.from({ length: 12 }, (_, k) => (
        <rect key={k} x={-2} y={-50} width={4} height={10} fill={C.shadow} transform={`rotate(${k * 30})`} />
      ))}
      <path data-fx="hand-hour" d="M0 6 V-28" stroke={C.shadow} strokeWidth={7} strokeLinecap="round" />
      <path data-fx="hand-minute" d="M0 6 V-44" stroke="#b8221a" strokeWidth={4} strokeLinecap="round" />
      <circle r={6} fill={C.shadow} />
    </g>
  </g>
)

export const projects: SceneDef = {
  zone: 'fungi',
  kit: 'engineer',
  script: [1500, 1800, 1600],
  ends: [0.32, 0.66, 1],
  span: [-60, 560],
  back: () => (
    <g>
      <g transform={`translate(${CLOCK.x} 0)`}>
        <ClockTower />
      </g>
      <g transform={`translate(${MUSHROOM.x} 0)`}>
        <Mushroom />
      </g>
      <ellipse cx={SEED} cy={0} rx={50} ry={10} fill="#4a2f18" />
      <g data-fx="seed" opacity="0" transform={`translate(${SEED} -6)`}>
        <ellipse rx={8} ry={6} fill="#c8a040" stroke={C.shadow} strokeWidth={2} />
      </g>
      <g data-fx="stalk" transform={`translate(${SEED} 0) scale(1 0)`}>
        <Beanstalk />
      </g>
    </g>
  ),
  // Night over the forest, and the moon coming up in it.
  front: () => (
    <g>
      <rect data-fx="night" {...COVER} fill="#0a1448" opacity="0" />
      <g data-fx="moon" opacity="0" transform="translate(420 -420)">
        <circle r={56} fill={C.moon} />
        <circle cx={-16} cy={-10} r={10} fill="#e6dcb0" />
        {[
          [-260, -120],
          [-120, -220],
          [-360, 40],
          [100, 120],
        ].map(([x, y]) => (
          <circle key={`${x}${y}`} cx={x} cy={y} r={4} fill="#fffbe8" />
        ))}
      </g>
    </g>
  ),
  move: (_kit, t) => move(t),
  reply: (stage) => {
    const seed = fx(stage, 'seed')
    const stalk = fx(stage, 'stalk')
    const night = fx(stage, 'night')
    const moon = fx(stage, 'moon')
    const hour = fx(stage, 'hand-hour')
    const minute = fx(stage, 'hand-minute')
    return (t) => {
      fadeTo(seed, ramp(t, 0.22, 0.26) * (1 - ramp(t, GROW.from, GROW.from + 0.04)))
      transformTo(stalk, `translate(${SEED} 0) scale(${(0.6 + 0.4 * grownAt(t)).toFixed(3)} ${grownAt(t).toFixed(3)})`)
      // the clock spins round from noon to midnight and night falls with it
      const turn = ease(ramp(t, NIGHT.from, NIGHT.to))
      transformTo(minute, `rotate(${r1(360 * 6 * turn)})`)
      transformTo(hour, `rotate(${r1(180 * turn)})`)
      fadeTo(night, 0.5 * turn)
      transformTo(moon, `translate(420 ${r1(lerp(-300, -470, turn))})`)
      fadeTo(moon, turn)
    }
  },
}
