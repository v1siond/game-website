import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, transformTo } from '../../shared/stageNodes'
import { Diggs } from '../cast/foes'
import { Chest, MineHead, RedEdges, Relic, Throne } from '../cast/props'
import { LANDS } from '../desert'
import { Callout, Hits, Tag, TitleCard, cardWriter, drainWriter, hitsWriter, popWriter, type Hit } from '../hud'
import { Burst } from '../ink'
import { CEL } from '../palette'
import { stopsPlace } from '../place'
import { down, fireUp, pry, secondWind, shoot, stride } from '../pose'

// Services, the mine boss and the second wind (research notes, the story 7, the bosses 3, the mechanics, [11]
// [1]; footage 126 and the burst b1 to b4): before the mine's head frame BIG DIGGS steps up and the frame
// freezes on his card; his hammer comes down and lays him on the ground. DOWN, NOT OUT: the frame's edges go
// red and from his knee he empties the rifle up into the hulk, a number off every hit, until he goes over, and
// the kill brings him back up: BACK UP! By the empty throne he prys the boss's chest open and a strange relic
// floats up into his hands, alien and unreadable.

const MINE = 300
const BOSS = { from: 400, at: 290 }
const CHEST = 400
const THRONE = 520
const CARD = { x: 270, y: -580 }
const KNOCKED = -40
const AT_CHEST = CHEST - 120
const RELIC = { from: { x: CHEST, y: -130 }, to: { x: AT_CHEST + 40, y: -300 } }
// The callouts, over the space between him and the boss.
const DOWN = { x: 200, y: -470 }
const UP = { x: 80, y: -420 }

const HITS: readonly Hit[] = [
  { x: BOSS.at - 30, y: -300, value: '64', at: 0.4 },
  { x: BOSS.at + 30, y: -240, value: '71', at: 0.46 },
  { x: BOSS.at - 10, y: -360, value: '233', at: 0.52, crit: true },
]

export const services = stopsPlace({
  land: LANDS.mine,
  script: [1700, 1800, 1500],
  ends: [0.32, 0.68, 1],
  back: () => (
    <>
      <g transform={`translate(${MINE} 0) scale(0.8)`}>
        <MineHead />
      </g>
      <g transform={`translate(${THRONE} 0)`}>
        <Throne />
      </g>
      <g transform={`translate(${CHEST} 0)`}>
        <Chest name="chest" color={CEL.epic} />
      </g>
      <g data-fx="boss" transform={`translate(${BOSS.from} 0)`}>
        <Diggs />
        <Tag name="boss-tag" label="BIG DIGGS" level={17} y={-440} />
      </g>
      <g data-fx="smack" opacity="0">
        <Burst x={30} y={-200} r={80} fill={CEL.crit} />
      </g>
      <g data-fx="wind" opacity="0">
        <Burst x={KNOCKED} y={-150} r={140} fill={CEL.sun} />
      </g>
      <g data-fx="relic" opacity="0">
        <Relic />
      </g>
    </>
  ),
  front: () => (
    <>
      <RedEdges />
      <Hits name="hit" hits={HITS} />
      <Callout name="down" x={DOWN.x} y={DOWN.y} text="DOWN, NOT OUT!" fill={CEL.crit} size={62} />
      <Callout name="up" x={UP.x} y={UP.y} text="BACK UP!" fill={CEL.sun} size={70} />
      <TitleCard name="card" x={CARD.x} y={CARD.y} title="BIG DIGGS" joke="HITS ROCKS FOR FUN. YOU'RE SOFTER." />
    </>
  ),
  move: (profession, t) => {
    if (t < 0.32) {
      const knocked = ramp(t, 0.25, 0.29)
      if (knocked === 0) return { pose: shoot(ramp(t, 0, 0.2), 2, 2), ahead: 0, lift: 0 }
      return { pose: down(profession, knocked), ahead: KNOCKED * knocked, lift: 0 }
    }
    if (t < 0.68) {
      const fired = ramp(t, 0.34, 0.56)
      return { pose: fired < 1 ? fireUp(fired) : secondWind(ramp(t, 0.58, 0.64)), ahead: KNOCKED, lift: 0 }
    }
    const walk = ramp(t, 0.68, 0.8)
    const ahead = KNOCKED + (AT_CHEST - KNOCKED) * walk
    return { pose: walk < 1 ? stride(profession, 5 * walk) : pry(ramp(t, 0.8, 1)), ahead, lift: 0 }
  },
  reply: (stage) => {
    const card = cardWriter(stage, 'card', CARD.x, CARD.y, 0.05, 0.17)
    const hammer = fx(stage, 'hammer')
    const boss = fx(stage, 'boss')
    const drain = drainWriter(stage, 'boss-tag', 0.38, 0.54)
    const smack = fx(stage, 'smack')
    const edges = fx(stage, 'red-edges')
    const hits = hitsWriter(stage, 'hit', HITS)
    const downCall = popWriter(stage, 'down', DOWN.x, DOWN.y, 0.33, 0.55)
    const upCall = popWriter(stage, 'up', UP.x, UP.y, 0.58, 0.68)
    const wind = fx(stage, 'wind')
    const lid = fx(stage, 'chest-lid')
    const light = fx(stage, 'chest-light')
    const relic = fx(stage, 'relic')
    return (t) => {
      card(t)
      // he steps up, winds the hammer back and brings it down
      const step = ramp(t, 0, 0.05)
      const over = ramp(t, 0.54, 0.6)
      transformTo(boss, `translate(${(BOSS.from + (BOSS.at - BOSS.from) * step + 50 * over).toFixed(1)} 0) rotate(${(75 * over).toFixed(1)})`)
      fadeTo(boss, 1 - ramp(t, 0.62, 0.66))
      const swing = 14 * ramp(t, 0.18, 0.22) - 164 * ramp(t, 0.22, 0.26)
      transformTo(hammer, `rotate(${swing.toFixed(1)} -40 -270)`)
      fadeTo(smack, Math.sin(Math.PI * ramp(t, 0.25, 0.31)))
      fadeTo(edges, 0.85 * ramp(t, 0.27, 0.31) * (1 - ramp(t, 0.58, 0.62)))
      drain(t)
      hits(t)
      downCall(t)
      upCall(t)
      fadeTo(wind, Math.sin(Math.PI * ramp(t, 0.57, 0.66)))
      // the chest by the throne, and the relic up into his hands
      transformTo(lid, `rotate(${(110 * ramp(t, 0.84, 0.88)).toFixed(1)} 70 -104)`)
      fadeTo(light, ramp(t, 0.85, 0.9))
      const rise = ramp(t, 0.88, 1)
      transformTo(relic, `translate(${(RELIC.from.x + (RELIC.to.x - RELIC.from.x) * rise).toFixed(1)} ${(RELIC.from.y + (RELIC.to.y - RELIC.from.y) * rise).toFixed(1)})`)
      fadeTo(relic, ramp(t, 0.86, 0.9))
    }
  },
})
