import { mix } from '@/lib/motion/rigPose'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, transformTo } from '../../shared/stageNodes'
import { Flyer } from '../cast/foes'
import { Dig, Hologram, Relic } from '../cast/props'
import { LANDS } from '../desert'
import { Hits, Tag, hitsWriter, type Hit } from '../hud'
import { Burst } from '../ink'
import { CEL } from '../palette'
import { stopsPlace } from '../place'
import { LOOK_UP, PUSH, rest, shoot, stride } from '../pose'

// Projects, the dig and the vault (research notes, the story 9 and 10, the enemies, [13] [1]): at the dig in
// the hills at dusk the cliff flyers dive at him out of the sky, their tags over them, and he shoots them out
// of the air, a number off each. Under the awning he sets the relic on the work table, and it throws its
// hologram up: a door in a cliff that opens once every two hundred years, and the key's three empty slots.

const DIG = 220
const TABLE = { x: DIG, y: -100 }
const WALK = 90
const RELIC = { held: { x: WALK + 60, y: -220 }, set: { x: TABLE.x, y: TABLE.y - 40 } }
// Each flyer's dive, from the upper right toward him, and the t it is shot at.
const FLYERS = [
  { from: { x: 700, y: -760 }, to: { x: 300, y: -430 }, start: 0.04, shot: 0.16 },
  { from: { x: 820, y: -640 }, to: { x: 380, y: -360 }, start: 0.1, shot: 0.24 },
  { from: { x: 760, y: -820 }, to: { x: 260, y: -520 }, start: 0.16, shot: 0.32 },
]

const HITS: readonly Hit[] = FLYERS.map(({ from, to, shot }, i) => {
  const k = 0.85
  return { x: from.x + (to.x - from.x) * k, y: from.y + (to.y - from.y) * k - 40, value: ['29', '33', '96'][i], at: shot, crit: i === 2 }
})

export const projects = stopsPlace({
  land: LANDS.dig,
  script: [1700, 1300, 1700],
  ends: [0.36, 0.6, 1],
  back: () => (
    <>
      <g transform={`translate(${DIG} 0)`}>
        <Dig />
      </g>
      <g data-fx="holo" opacity="0" transform={`translate(${TABLE.x} ${TABLE.y}) scale(1 0)`}>
        <Hologram />
      </g>
      {FLYERS.map(({ from }, i) => (
        <g key={from.x} data-fx={`flyer-${i}`} opacity="0" transform={`translate(${from.x} ${from.y})`}>
          <Flyer />
          <Tag name={`flyer-${i}-tag`} label="FLYER" level={11} y={-60} />
          <g data-fx={`flyer-${i}-pop`} opacity="0">
            <Burst x={0} y={0} r={60} fill={CEL.sun} />
          </g>
        </g>
      ))}
    </>
  ),
  front: () => (
    <>
      <g data-fx="relic" opacity="0">
        <Relic />
      </g>
      <Hits name="hit" hits={HITS} />
    </>
  ),
  move: (profession, t) => {
    if (t < 0.36) return { pose: shoot(ramp(t, 0, 0.36), 0.35, 0.92, 38), ahead: 0, lift: 0 }
    if (t < 0.62) {
      const walk = ramp(t, 0.36, 0.46)
      if (walk < 1) return { pose: stride(profession, 3 * walk), ahead: WALK * walk, lift: 0 }
      return { pose: mix(rest(profession), PUSH, Math.sin(Math.PI * ramp(t, 0.46, 0.58))), ahead: WALK, lift: 0 }
    }
    return { pose: mix(rest(profession), LOOK_UP, ramp(t, 0.66, 0.74)), ahead: WALK - 40 * ramp(t, 0.62, 0.7), lift: 0 }
  },
  reply: (stage) => {
    const flyers = FLYERS.map((_, i) => fx(stage, `flyer-${i}`))
    const pops = FLYERS.map((_, i) => fx(stage, `flyer-${i}-pop`))
    const hits = hitsWriter(stage, 'hit', HITS)
    const relic = fx(stage, 'relic')
    const holo = fx(stage, 'holo')
    return (t) => {
      FLYERS.forEach(({ from, to, start, shot }, i) => {
        const dive = Math.min(0.85, ramp(t, start, shot)) / 0.85
        const x = from.x + (to.x - from.x) * 0.85 * dive
        const y = from.y + (to.y - from.y) * 0.85 * dive
        const fall = ramp(t, shot, shot + 0.06)
        transformTo(flyers[i], `translate(${x.toFixed(1)} ${(y + 200 * fall * fall).toFixed(1)}) rotate(${(160 * fall).toFixed(1)})`)
        fadeTo(flyers[i], ramp(t, start, start + 0.02) * (1 - ramp(t, shot + 0.03, shot + 0.06)))
        fadeTo(pops[i], Math.sin(Math.PI * ramp(t, shot, shot + 0.04)))
      })
      hits(t)
      // the relic out of his pack into his hands, then down on the table
      const set = ramp(t, 0.48, 0.56)
      transformTo(relic, `translate(${(RELIC.held.x + (RELIC.set.x - RELIC.held.x) * set).toFixed(1)} ${(RELIC.held.y + (RELIC.set.y - RELIC.held.y) * set).toFixed(1)}) scale(0.8)`)
      fadeTo(relic, ramp(t, 0.44, 0.48))
      // its hologram rises out of it over the table
      const rise = ramp(t, 0.62, 0.8)
      transformTo(holo, `translate(${TABLE.x} ${TABLE.y}) scale(1 ${rise.toFixed(3)})`)
      fadeTo(holo, ramp(t, 0.62, 0.66))
    }
  },
})
