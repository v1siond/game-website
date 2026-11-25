import { mix } from '@/lib/motion/rigPose'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, transformTo } from '../../shared/stageNodes'
import { Barrel, BountyBoard, Robot, RunnerCar, TownGate } from '../cast/road'
import { LANDS } from '../desert'
import { Callout, Tag, Waveform, popWriter, voiceWriter } from '../hud'
import { CEL } from '../palette'
import { stopsPlace } from '../place'
import { DUCK, LISTEN, rest } from '../pose'

// About, the gate into town (research notes, the story 2 and 3, [5] [9]; footage 4, 65, 70 to 72): two raider
// runner cars tear along the road toward him, their tags over them, and he drops behind an oil barrel as their
// dust hits; they swing off into it. Our robot works the box at the gate and its sheet leaves grind apart. He
// stands up by the bounty board, a new bounty flips up on it and the voice crackles in his ear.

const BARREL = 80
const BOARD = 190
const GATE = 470
const ROBOT = 300
const CARS = [
  { from: 820, to: 200, start: 0.04, lane: -40 },
  { from: 960, to: 260, start: 0.12, lane: -10 },
]
const EAR = { x: 40, y: -370 }
const NOTICE = { x: 50, y: -250 }

export const about = stopsPlace({
  land: LANDS.badlands,
  script: [1600, 1500, 1700],
  ends: [0.34, 0.64, 1],
  back: () => (
    <>
      <g transform={`translate(${GATE} 0) scale(0.9)`}>
        <TownGate />
      </g>
      <g data-fx="robot" transform={`translate(${ROBOT} 0) scale(0.9)`}>
        <Robot name="robot" />
      </g>
      <g transform={`translate(${BOARD} 0)`}>
        <BountyBoard name="board" />
      </g>
      {CARS.map(({ from, lane }, i) => (
        <g key={from} data-fx={`car-${i}`} opacity="0" transform={`translate(${from} ${lane}) scale(0.8)`}>
          <RunnerCar />
          <Tag name={`car-${i}-tag`} label="RAIDER" level={3} y={-230} />
        </g>
      ))}
      <g data-fx="dust" opacity="0">
        {[0, 90, 180, 260].map((x, i) => (
          <circle key={x} cx={x} cy={-40 - (i % 2) * 30} r={50 + (i % 3) * 14} fill={LANDS.badlands.rise} />
        ))}
      </g>
    </>
  ),
  front: () => (
    <>
      <g transform={`translate(${BARREL} 0)`}>
        <Barrel />
      </g>
      <g data-fx="voice" opacity="0" transform={`translate(${EAR.x} ${EAR.y})`}>
        <Waveform name="voice" />
      </g>
      <Callout name="bounty" x={BOARD + 40} y={-470} text="NEW BOUNTY!" fill={CEL.sun} size={56} />
    </>
  ),
  move: (profession, t) => {
    if (t < 0.34) return { pose: mix(rest(profession), DUCK, ramp(t, 0.06, 0.12) * (1 - ramp(t, 0.28, 0.34))), ahead: -20 * ramp(t, 0.06, 0.12) * (1 - ramp(t, 0.28, 0.34)), lift: 0 }
    return { pose: mix(rest(profession), LISTEN, ramp(t, 0.86, 0.92)), ahead: 0, lift: 0 }
  },
  reply: (stage) => {
    const cars = CARS.map((_, i) => fx(stage, `car-${i}`))
    const dust = fx(stage, 'dust')
    const arm = fx(stage, 'robot-arm')
    const left = fx(stage, 'gate-l')
    const right = fx(stage, 'gate-r')
    const notice = popWriter(stage, 'board-new', NOTICE.x, NOTICE.y, 0.78)
    const bounty = popWriter(stage, 'bounty', BOARD + 40, -470, 0.8)
    const voice = voiceWriter(stage, 'voice')
    return (t) => {
      CARS.forEach(({ from, to, start, lane }, i) => {
        const run = ramp(t, start, start + 0.16)
        transformTo(cars[i], `translate(${(from + (to - from) * run).toFixed(1)} ${(lane - 30 * ramp(t, start + 0.12, start + 0.18)).toFixed(1)}) scale(0.8)`)
        fadeTo(cars[i], ramp(t, start, start + 0.02) * (1 - ramp(t, start + 0.14, start + 0.18)))
      })
      transformTo(dust, `translate(${(220 - 120 * ramp(t, 0.12, 0.34)).toFixed(1)} 0) scale(${(0.6 + 0.8 * ramp(t, 0.12, 0.34)).toFixed(3)})`)
      fadeTo(dust, Math.sin(Math.PI * ramp(t, 0.12, 0.36)))
      transformTo(arm, `rotate(${(-40 * Math.abs(Math.sin(Math.PI * 5 * ramp(t, 0.36, 0.5)))).toFixed(1)} -34 -84)`)
      const open = ramp(t, 0.46, 0.6)
      transformTo(left, `translate(${(-130 * open).toFixed(1)} 0)`)
      transformTo(right, `translate(${(130 * open).toFixed(1)} 0)`)
      notice(t)
      bounty(t)
      voice(t, ramp(t, 0.86, 0.9))
    }
  },
})
