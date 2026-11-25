import { mix } from '@/lib/motion/rigPose'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, transformTo } from '../../shared/stageNodes'
import { Bus, BusStop, Robot, WelcomeSign } from '../cast/road'
import { LANDS } from '../desert'
import { stopsPlace } from '../place'
import { SQUINT, rest, stride } from '../pose'

// The hero, off the bus in the badlands (research notes, the story 1 and 2, [1] [5]): the rusted bus brakes at
// the lone stop and he steps down from its door with nothing but what he wears; it pulls off in its dust. He
// shades his eyes and looks up the road past the town's welcome sign. Our little robot rolls up out of the
// haze, waves its arm, turns and rolls off toward town, and he goes after it. The hero keeps its own place
// under its intro card, and he shows only where neither the card nor his portrait is: on a wide screen the
// card stands over his place at the top, so he comes in once it has scrolled up past him; on a phone his
// portrait fills the first screen over the stop and the card scrolls up over his place after it, so there
// the stop plays without him.

const STOP = -190
const SIGN = 380
const ROBOT = { from: 640, stops: 250, goes: 420 }
const FOLLOWS = 190

export const hero = stopsPlace({
  land: LANDS.badlands,
  hold: (phone) => ({ x: phone ? 640 : 1000, dir: 1 }),
  shown: (progress, phone) => (phone ? 0 : ramp(progress, 0.28, 0.4)),
  script: [1700, 1300, 1800],
  ends: [0.34, 0.6, 1],
  back: () => (
    <>
      <g transform={`translate(${STOP} 0)`}>
        <BusStop />
      </g>
      <g transform={`translate(${SIGN} 0) scale(0.85)`}>
        <WelcomeSign />
      </g>
      <g data-fx="bus">
        <Bus />
      </g>
      <g data-fx="dust" opacity="0">
        {[
          [-50, 0, 44],
          [0, -26, 54],
          [56, -4, 40],
          [10, 18, 36],
        ].map(([x, y, r]) => (
          <circle key={`${x}${y}`} cx={x} cy={y} r={r} fill={LANDS.badlands.rise} />
        ))}
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
      fadeTo(bus, 1 - ramp(t, 0.32, 0.34))
      fadeTo(dust, Math.sin(Math.PI * ramp(t, 0.2, 0.42)))
      transformTo(dust, `translate(${(-200 + 160 * ramp(t, 0.2, 0.42)).toFixed(1)} -40) scale(${(1 + ramp(t, 0.2, 0.42)).toFixed(3)})`)
      const x = t < 0.84 ? ROBOT.from + (ROBOT.stops - ROBOT.from) * ramp(t, 0.6, 0.7) : ROBOT.stops + (ROBOT.goes - ROBOT.stops) * ramp(t, 0.84, 1)
      const rolling = (t > 0.6 && t < 0.7) || t > 0.84 ? 1 : 0
      transformTo(robot, `translate(${x.toFixed(1)} ${(-5 * Math.abs(Math.sin(t * 70)) * rolling).toFixed(1)}) scale(${t > 0.84 ? -1 : 1} 1)`)
      transformTo(arm, `rotate(${(55 * Math.sin(Math.PI * 4 * ramp(t, 0.7, 0.82))).toFixed(1)} -34 -84)`)
    }
  },
})
