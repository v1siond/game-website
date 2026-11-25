import { mix } from '@/lib/motion/rigPose'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, transformTo } from '../../shared/stageNodes'
import { flung } from '../bandit'
import { Baron, Raider } from '../cast/foes'
import { Barrel } from '../cast/road'
import { Chest, Lift, SaltDeck } from '../cast/props'
import { LANDS } from '../desert'
import { Callout, Hits, Tag, TitleCard, cardWriter, hitsWriter, popWriter, type Hit } from '../hud'
import { CEL } from '../palette'
import { stopsPlace } from '../place'
import { drum, rest } from '../pose'

// Bands, the drummer's stretch: the camp on the salt flats (research notes, the story 14, the bosses 6, [16]
// [1]): the lift's cage carries him up the stilts to the camp's deck, and there BARON SALTWELL stands by his
// chest and the frame freezes on his card. The baron's raiders come at him across the deck; he drums two oil
// barrels with his sticks and every second stroke sends a ring of shock down the deck that throws a raider off
// it, a number off each. The baron bolts, the last ring knocks the chest's lid open, and the chest is empty:
// the last piece was a lie.

const HIGH = 230
const DECK = -HIGH - 22
const DRUMS = [70, 130]
const RAIDERS = [
  { from: 600, at: 240, hit: 0.69 },
  { from: 680, at: 330, hit: 0.77 },
  { from: 760, at: 420, hit: 0.85 },
]
const BARON = 500
const CHEST = 300
const CARD = { x: 270, y: -700 }
const EMPTY = { x: CHEST, y: DECK - 260 }

/** How high the lift has carried him at `t`, slow off the ground, up to the deck's top. */
const rideAt = (t: number): number => -DECK * ramp(t, 0.04, 0.26) ** 1.4

const HITS: readonly Hit[] = RAIDERS.map(({ at, hit }, i) => ({ x: at, y: DECK - 230, value: ['57', '61', '144'][i], at: hit, crit: i === 2 }))

export const bands = stopsPlace({
  land: LANDS.salt,
  phoneDrop: 140,
  script: [1500, 1600, 1900],
  ends: [0.3, 0.62, 1],
  back: () => (
    <>
      <SaltDeck high={HIGH} />
      <g transform={`translate(${CHEST} ${DECK})`}>
        <Chest name="chest" color={CEL.legendary} />
      </g>
      <g data-fx="baron" transform={`translate(${BARON} ${DECK})`}>
        <Baron />
        <Tag name="baron-tag" label="BARON" level={30} y={-300} />
      </g>
      {RAIDERS.map(({ from }, i) => (
        <g key={from} data-fx={`raider-${i}`} opacity="0" transform={`translate(${from} ${DECK})`}>
          <Raider />
          <Tag name={`raider-${i}-tag`} label="RAIDER" level={28} y={-230} />
        </g>
      ))}
      <g data-fx="cage">
        <Lift />
      </g>
      {DRUMS.map((x, i) => (
        <g key={x} data-fx={`drum-${i}`} transform={`translate(${x} ${DECK}) scale(0.62)`}>
          <Barrel />
        </g>
      ))}
      <g data-fx="ring" opacity="0">
        <ellipse cx={0} cy={0} rx={60} ry={18} fill="none" stroke={CEL.holo} strokeWidth="10" data-bare />
        <ellipse cx={0} cy={0} rx={60} ry={18} fill="none" stroke={CEL.white} strokeWidth="4" data-bare />
      </g>
      <g data-fx="moth" opacity="0">
        <path d="M0 0 L-14 -12 L-4 0 L-14 12 Z M0 0 L14 -12 L4 0 L14 12 Z" fill={CEL.paperShade} />
      </g>
    </>
  ),
  front: () => (
    <>
      <Hits name="hit" hits={HITS} />
      <Callout name="empty" x={EMPTY.x} y={EMPTY.y} text="EMPTY?!" fill={CEL.sun} size={64} />
      <TitleCard name="card" x={CARD.x} y={CARD.y} title="BARON SALTWELL" joke="OWNS THE FLATS. AND THE SALT." />
    </>
  ),
  move: (profession, t) => {
    const lift = rideAt(t)
    if (t < 0.62) return { pose: rest(profession), ahead: 0, lift }
    return { pose: t < 0.9 ? drum(ramp(t, 0.62, 0.9), 6) : mix(drum(1, 6), rest(profession), ramp(t, 0.9, 0.96)), ahead: 0, lift }
  },
  reply: (stage) => {
    const cage = fx(stage, 'cage')
    const card = cardWriter(stage, 'card', CARD.x, CARD.y, 0.3, 0.42)
    const raiders = RAIDERS.map((_, i) => fx(stage, `raider-${i}`))
    const baron = fx(stage, 'baron')
    const ring = fx(stage, 'ring')
    const drums = DRUMS.map((_, i) => fx(stage, `drum-${i}`))
    const hits = hitsWriter(stage, 'hit', HITS)
    const lid = fx(stage, 'chest-lid')
    const moth = fx(stage, 'moth')
    const empty = popWriter(stage, 'empty', EMPTY.x, EMPTY.y, 0.92)
    return (t) => {
      transformTo(cage, `translate(0 ${(-rideAt(t)).toFixed(1)})`)
      card(t)
      RAIDERS.forEach(({ from, at, hit }, i) => {
        const come = ramp(t, 0.44 + 0.03 * i, 0.6)
        const thrown = ramp(t, hit, hit + 0.08)
        transformTo(raiders[i], `translate(${(from + (at - from) * come).toFixed(1)} ${DECK}) ${thrown > 0 ? flung(thrown, 360, 160) : ''}`)
        fadeTo(raiders[i], ramp(t, 0.44, 0.47) * (1 - ramp(t, hit + 0.05, hit + 0.08)))
      })
      // each shock ring rolls down the deck from the drums on the beat
      const beat = RAIDERS.findIndex(({ hit }) => t >= hit - 0.06 && t < hit + 0.02)
      const roll = beat < 0 ? 0 : ramp(t, RAIDERS[beat].hit - 0.06, RAIDERS[beat].hit + 0.02)
      transformTo(ring, `translate(${(100 + (RAIDERS[Math.max(beat, 0)].at - 100) * roll).toFixed(1)} ${DECK}) scale(${(1 + roll).toFixed(3)})`)
      fadeTo(ring, beat < 0 ? 0 : Math.sin(Math.PI * roll))
      drums.forEach((node, i) => transformTo(node, `translate(${DRUMS[i]} ${DECK}) scale(0.62 ${(0.62 - 0.04 * Math.abs(Math.sin(Math.PI * 6 * ramp(t, 0.62, 0.9) + i))).toFixed(3)})`))
      hits(t)
      // the baron bolts off the far end of the deck
      const bolt = ramp(t, 0.86, 0.92)
      transformTo(baron, `translate(${(BARON + 300 * bolt).toFixed(1)} ${DECK})`)
      fadeTo(baron, 1 - ramp(t, 0.89, 0.92))
      // the last ring knocks the lid open: nothing in it but a moth
      transformTo(lid, `rotate(${(110 * ramp(t, 0.86, 0.9)).toFixed(1)} 70 -104)`)
      const flutter = ramp(t, 0.9, 1)
      transformTo(moth, `translate(${(CHEST + 40 * flutter).toFixed(1)} ${(DECK - 110 - 160 * flutter).toFixed(1)}) scale(1 ${(0.4 + 0.6 * Math.abs(Math.sin(40 * flutter))).toFixed(3)})`)
      fadeTo(moth, ramp(t, 0.9, 0.92))
      empty(t)
    }
  },
})
