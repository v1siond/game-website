import { mix } from '@/lib/motion/rigPose'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, transformTo } from '../../shared/stageNodes'
import { Boulder, Flyer, Hologram, Relic, Tent } from '../cast'
import { HOURS } from '../desert'
import { flung } from '../bandit'
import { stopsPlace } from '../place'
import { LOOK_UP, PUSH, rest, stride, swat } from '../pose'

// Projects, the dig and the door (notes L50 to L53, L125, [1] [13]): at a dig among shiny boulders a flock
// dives out of the dusk sky at him, and he knocks them away with the rifle butt as he runs for the tent. In
// the quiet of the tent he lays the relic on the work table, and it throws a hologram over it: a door cut in a
// cliff, a count of two hundred, and the three empty slots of a key. No one tells it; the relic does.

const TENT = 300
const TABLE = { x: TENT, y: -100 }
const RUNS = 70
const STANDS = TENT - 150
// The flock: where each starts in the sky, and when it dives and is knocked away.
const FLOCK = [
  { from: { x: 520, y: -560 }, at: 0.06 },
  { from: { x: 600, y: -480 }, at: 0.14 },
  { from: { x: 460, y: -620 }, at: 0.22 },
]

export const projects = stopsPlace({
  hour: HOURS.dusk,
  script: [1700, 1300, 1800],
  ends: [0.36, 0.62, 1],
  back: () => (
    <>
      <g transform="translate(-120 0)">
        <Boulder r={70} />
      </g>
      <g transform="translate(470 0)">
        <Boulder r={90} />
      </g>
      <g transform={`translate(${TENT} 0)`}>
        <Tent />
      </g>
      <g data-fx="holo" opacity="0" transform={`translate(${TABLE.x} ${TABLE.y}) scale(0)`}>
        <Hologram />
      </g>
      <g data-fx="relic" opacity="0" transform={`translate(${TABLE.x} ${TABLE.y - 30})`}>
        <g transform="scale(0.6)">
          <Relic />
        </g>
      </g>
      {FLOCK.map(({ from }, i) => (
        <g key={i} data-fx={`flyer-${i}`} transform={`translate(${from.x} ${from.y})`}>
          <Flyer />
        </g>
      ))}
    </>
  ),
  move: (profession, t) => {
    if (t < 0.36) {
      const swing = FLOCK.findIndex(({ at }) => t < at + 0.1)
      const at = FLOCK[swing === -1 ? FLOCK.length - 1 : swing].at
      return { pose: swat(ramp(t, at + 0.02, at + 0.1)), ahead: RUNS * ramp(t, 0, 0.34), lift: 0 }
    }
    if (t < 0.62) {
      const walk = ramp(t, 0.36, 0.5)
      return { pose: walk < 1 ? stride(profession, 3 * walk) : mix(rest(profession), PUSH, ramp(t, 0.52, 0.58)), ahead: RUNS + (STANDS - RUNS) * walk, lift: 0 }
    }
    return { pose: mix(PUSH, LOOK_UP, ramp(t, 0.66, 0.8)), ahead: STANDS - 30 * ramp(t, 0.66, 0.8), lift: 0 }
  },
  reply: (stage) => {
    const flyers = FLOCK.map((_, i) => fx(stage, `flyer-${i}`))
    const relic = fx(stage, 'relic')
    const holo = fx(stage, 'holo')
    return (t) => {
      FLOCK.forEach(({ from, at }, i) => {
        const dive = ramp(t, at - 0.06, at + 0.06)
        const knocked = ramp(t, at + 0.06, at + 0.2)
        const x = from.x + (RUNS * 0.5 + 60 - from.x) * dive
        const y = from.y + (-260 - from.y) * dive
        transformTo(flyers[i], `translate(${x.toFixed(1)} ${y.toFixed(1)}) ${flung(knocked, 420, 260)}`)
        fadeTo(flyers[i], 1 - ramp(t, at + 0.16, at + 0.22))
      })
      fadeTo(relic, ramp(t, 0.56, 0.6))
      const thrown = ramp(t, 0.66, 0.84)
      transformTo(holo, `translate(${TABLE.x} ${TABLE.y}) scale(${thrown.toFixed(3)})`)
      fadeTo(holo, thrown)
    }
  },
})
