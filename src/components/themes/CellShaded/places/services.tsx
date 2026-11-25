import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, transformTo } from '../../shared/stageNodes'
import { Crate, MineBoss, RedEdges, Relic, Throne } from '../cast'
import { HOURS } from '../desert'
import { Burst } from '../ink'
import { CEL } from '../palette'
import { stopsPlace } from '../place'
import { down, fireUp, pry, secondWind, stride } from '../pose'

// Services, the mine boss and the second wind (notes L47 to L48, L106 to L107, L139, [1] [11]): in the mine
// hall the hulk's sledge catches him and he drops; the edges of the frame go red as he crawls back. On his
// knee he empties the rifle up into the boss, who goes over, and the kill lifts him back to his feet in a
// burst: the second wind. By the empty throne he prys the boss's chest open, and a strange glowing relic
// floats up into his hands, alien and unreadable (L31, [3]).

const BOSS = 250
const THRONE = 440
const CHEST = 330
const CRAWL = -50
const RELIC = { from: { x: CHEST, y: -120 }, to: { x: CHEST - 60, y: -290 } }

export const services = stopsPlace({
  hour: HOURS.town,
  script: [1500, 1700, 1700],
  ends: [0.3, 0.64, 1],
  back: () => (
    <>
      <g transform={`translate(${THRONE} 0)`}>
        <Throne />
      </g>
      <g transform={`translate(${CHEST} 0)`}>
        <Crate name="chest" />
      </g>
      <g data-fx="boss" transform={`translate(${BOSS} 0)`}>
        <MineBoss />
      </g>
      <g data-fx="hit" opacity="0">
        <Burst x={60} y={-220} r={70} fill={CEL.crit} />
      </g>
      <g data-fx="wind" opacity="0">
        <Burst x={0} y={-150} r={130} fill={CEL.sun} />
      </g>
      <g data-fx="relic" opacity="0">
        <Relic />
      </g>
    </>
  ),
  front: () => <RedEdges />,
  move: (profession, t) => {
    if (t < 0.3) {
      const knocked = ramp(t, 0.16, 0.22)
      return { pose: down(profession, knocked), ahead: CRAWL * ramp(t, 0.2, 0.3), lift: 0 }
    }
    if (t < 0.64) {
      const fired = ramp(t, 0.3, 0.52)
      return { pose: fired < 1 ? fireUp(fired) : secondWind(ramp(t, 0.54, 0.62)), ahead: CRAWL, lift: 0 }
    }
    const walk = ramp(t, 0.64, 0.8)
    const ahead = CRAWL + (CHEST - 120 - CRAWL) * walk
    return { pose: walk < 1 ? stride(profession, 5 * walk) : pry(ramp(t, 0.8, 1)), ahead, lift: 0 }
  },
  reply: (stage) => {
    const sledge = fx(stage, 'sledge')
    const boss = fx(stage, 'boss')
    const hit = fx(stage, 'hit')
    const edges = fx(stage, 'red-edges')
    const wind = fx(stage, 'wind')
    const lid = fx(stage, 'chest-lid')
    const relic = fx(stage, 'relic')
    return (t) => {
      const swing = ramp(t, 0.04, 0.14) - ramp(t, 0.14, 0.2) * 1.6
      transformTo(sledge, `rotate(${(40 * swing).toFixed(1)} -40 -260)`)
      fadeTo(hit, Math.sin(Math.PI * ramp(t, 0.15, 0.24)))
      fadeTo(edges, 0.85 * ramp(t, 0.2, 0.28) * (1 - ramp(t, 0.54, 0.6)))
      const over = ramp(t, 0.48, 0.56)
      transformTo(boss, `translate(${(BOSS + 60 * over).toFixed(1)} 0) rotate(${(78 * over).toFixed(1)})`)
      fadeTo(boss, 1 - ramp(t, 0.6, 0.66))
      transformTo(wind, `translate(${CRAWL} 0)`)
      fadeTo(wind, Math.sin(Math.PI * ramp(t, 0.52, 0.64)))
      transformTo(lid, `rotate(${(-110 * ramp(t, 0.84, 0.9)).toFixed(1)} -70 -100)`)
      const rise = ramp(t, 0.88, 1)
      transformTo(relic, `translate(${(RELIC.from.x + (RELIC.to.x - RELIC.from.x) * rise).toFixed(1)} ${(RELIC.from.y + (RELIC.to.y - RELIC.from.y) * rise).toFixed(1)})`)
      fadeTo(relic, ramp(t, 0.86, 0.9))
    }
  },
})
