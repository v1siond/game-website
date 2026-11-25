import { mix } from '@/lib/motion/rigPose'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, transformTo } from '../../shared/stageNodes'
import { Barrel, BountyBoard, Dust, RaiderCar, Robot, TownGate, Waveform } from '../cast'
import { HOURS } from '../desert'
import { stopsPlace } from '../place'
import { DUCK, LISTEN, rest, stride } from '../pose'

// About, at the town's gate in the afternoon (notes L37 to L39, [1] [5]): the robot fiddles with the gate
// while two raider cars tear past along the road, and he drops behind a barrel as their dust hits him. Then a
// crackle: he touches his ear and the voice comes, a waveform pulsing by his head, the mystery the page
// carries to Contact. The gate grinds open and he walks into the plaza, where the bounty board waits.

const GATE = 330
const BOARD = 470
const BARREL = 96
const CARS = [
  { from: -900, to: 1500, at: [0.04, 0.2] },
  { from: -1100, to: 1500, at: [0.12, 0.3] },
] as const
const WALKS = 250
// The waveform hangs by his ear.
const EAR = { x: 70, y: -300 }

const bars = [0.6, 1, 0.8, 1, 0.5]

export const about = stopsPlace({
  hour: HOURS.town,
  script: [1600, 1400, 1800],
  ends: [0.34, 0.62, 1],
  back: () => (
    <>
      <g transform={`translate(${BOARD} 0)`}>
        <BountyBoard />
      </g>
      <g transform={`translate(${GATE} 0)`}>
        <TownGate />
      </g>
      <g transform={`translate(${GATE - 170} 0) scale(0.8)`}>
        <Robot name="robot" />
      </g>
      {CARS.map((_, i) => (
        <g key={i} data-fx={`car-${i}`} transform={`translate(${CARS[i].from} 40)`}>
          <RaiderCar />
        </g>
      ))}
      <g data-fx="dust" opacity="0">
        <Dust />
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
    </>
  ),
  move: (profession, t) => {
    if (t < 0.34) return { pose: mix(rest(profession), DUCK, Math.sin(Math.PI * ramp(t, 0.02, 0.33))), ahead: 0, lift: 0 }
    if (t < 0.62) return { pose: mix(rest(profession), LISTEN, ramp(t, 0.38, 0.46) * (1 - ramp(t, 0.58, 0.62))), ahead: 0, lift: 0 }
    const go = ramp(t, 0.72, 1)
    return { pose: go > 0 && go < 1 ? stride(profession, 5 * go) : rest(profession), ahead: WALKS * go, lift: 0 }
  },
  reply: (stage) => {
    const cars = CARS.map((_, i) => fx(stage, `car-${i}`))
    const dust = fx(stage, 'dust')
    const voice = fx(stage, 'voice')
    const waves = bars.map((_, i) => fx(stage, `voice-${i}`))
    const gateL = fx(stage, 'gate-l')
    const gateR = fx(stage, 'gate-r')
    const arm = fx(stage, 'robot-arm')
    return (t) => {
      CARS.forEach(({ from, to, at }, i) => {
        const go = ramp(t, at[0], at[1])
        transformTo(cars[i], `translate(${(from + (to - from) * go).toFixed(1)} 40)`)
      })
      fadeTo(dust, Math.sin(Math.PI * ramp(t, 0.1, 0.36)))
      transformTo(dust, `translate(${(60 + 120 * ramp(t, 0.1, 0.36)).toFixed(1)} -120) scale(${(1.4 + ramp(t, 0.1, 0.36)).toFixed(3)})`)
      // the voice: a crackle, then the bars pulse while he listens, and fade as he walks in
      const on = ramp(t, 0.4, 0.45) * (1 - 0.7 * ramp(t, 0.7, 0.9))
      fadeTo(voice, on)
      waves.forEach((bar, i) => transformTo(bar, `scale(1 ${(0.2 + 0.8 * bars[i] * Math.abs(Math.sin(t * 70 + i))).toFixed(3)})`))
      const open = ramp(t, 0.62, 0.78)
      transformTo(gateL, `translate(${(-140 * open).toFixed(1)} 0)`)
      transformTo(gateR, `translate(${(140 * open).toFixed(1)} 0)`)
      transformTo(arm, `rotate(${(30 * Math.sin(t * 50) * (1 - ramp(t, 0.6, 0.62))).toFixed(1)} -30 -80)`)
    }
  },
})
