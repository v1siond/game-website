import { mix } from '@/lib/motion/rigPose'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, transformTo } from '../../shared/stageNodes'
import { Bus, BusStop, Dust, Robot } from '../cast'
import { HOURS } from '../desert'
import { stopsPlace } from '../place'
import { SQUINT, rest, stride } from '../pose'

// The hero, off the bus at noon (research notes L35 to L37, [1] [5]): the bus stops at a lone stop on the
// desert road and he steps down with nothing but what he wears; it pulls away in its dust. He shades his eyes
// and looks down the empty road. Our small robot guide rolls up, waves an arm and rolls off toward town, and
// he goes after it.

const STOP = -170
const ROBOT = { from: 560, stops: 230, goes: 380 }
const FOLLOWS = 190

export const hero = stopsPlace({
  hour: HOURS.noon,
  at: (phone) => (phone ? 640 : 1000),
  script: [1700, 1300, 1800],
  ends: [0.34, 0.6, 1],
  back: () => (
    <>
      <g transform={`translate(${STOP} 0)`}>
        <BusStop />
      </g>
      <g data-fx="bus">
        <Bus />
      </g>
      <g data-fx="dust" opacity="0">
        <Dust />
      </g>
      <g data-fx="robot" transform={`translate(${ROBOT.from} 0)`}>
        <Robot name="robot" />
      </g>
    </>
  ),
  move: (profession, t) => {
    if (t < 0.34) {
      const down = ramp(t, 0.04, 0.16)
      return { pose: down > 0 && down < 1 ? stride(profession, 2 * down) : rest(profession), ahead: 30 * down - 30, lift: 34 * (1 - down) }
    }
    if (t < 0.6) return { pose: mix(rest(profession), SQUINT, ramp(t, 0.36, 0.46)), ahead: 0, lift: 0 }
    const go = ramp(t, 0.78, 1)
    return { pose: go > 0 ? stride(profession, 4 * go) : mix(SQUINT, rest(profession), ramp(t, 0.6, 0.66)), ahead: FOLLOWS * go, lift: 0 }
  },
  reply: (stage) => {
    const bus = fx(stage, 'bus')
    const dust = fx(stage, 'dust')
    const robot = fx(stage, 'robot')
    const arm = fx(stage, 'robot-arm')
    return (t) => {
      const away = ramp(t, 0.2, 0.34)
      transformTo(bus, `translate(${(1400 * away * away).toFixed(1)} 0)`)
      fadeTo(dust, Math.sin(Math.PI * ramp(t, 0.2, 0.42)))
      transformTo(dust, `translate(${(-200 + 160 * ramp(t, 0.2, 0.42)).toFixed(1)} -40) scale(${(1 + ramp(t, 0.2, 0.42)).toFixed(3)})`)
      const x = t < 0.84 ? ROBOT.from + (ROBOT.stops - ROBOT.from) * ramp(t, 0.6, 0.7) : ROBOT.stops + (ROBOT.goes - ROBOT.stops) * ramp(t, 0.84, 1)
      transformTo(robot, `translate(${x.toFixed(1)} ${(-6 * Math.abs(Math.sin(t * 60)) * (t > 0.6 ? 1 : 0)).toFixed(1)}) scale(${t > 0.84 ? -1 : 1} 1)`)
      transformTo(arm, `rotate(${(50 * Math.sin(Math.PI * 4 * ramp(t, 0.7, 0.82))).toFixed(1)} -30 -80)`)
    }
  },
})
