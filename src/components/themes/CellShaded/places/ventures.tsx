import { mix } from '@/lib/motion/rigPose'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, transformTo } from '../../shared/stageNodes'
import { Flyer, HIVE_EYES, Hive, Tommy } from '../cast/foes'
import { KeySlots } from '../cast/props'
import { LANDS } from '../desert'
import { Hits, Scope, TitleCard, cardWriter, hitsWriter, popWriter, scopeWriter, type Hit } from '../hud'
import { Burst } from '../ink'
import { CEL } from '../palette'
import { stopsPlace } from '../place'
import { LOOK_UP, rest, shoot, snipe } from '../pose'

// Ventures, the key's pieces (research notes, the story 12 to 14, the bosses 4 and 5, [14] [15]): on the scrap
// coast TOWER TOMMY sits behind his heavy gun on the hill, and the frame freezes on his card. His rocket bursts
// short of him; down on one knee, the scope's red skull on him, one shot, and he slumps over his gun. Then the
// brood hive heaves up out of the ground and spits its flyers at him; he shoots them and its white eyes, the
// last a critical, and it sinks. The key comes up over him: two pieces click into it, and the third slot stays
// dark, a question in it.

const HILL = { x: 420, scale: 0.75 }
// Tommy's gun's muzzle and his head on the hill.
const MUZZLE = { x: HILL.x + HILL.scale * -150, y: HILL.scale * -190 }
const HEAD = { x: HILL.x + HILL.scale * 54, y: HILL.scale * -304 }
const HIVE = { x: 230, scale: 0.7 }
const CARD = { x: 270, y: -580 }
const KEY = { x: 150, y: -480 }
const ROCKET = { burst: { x: 90, y: -40 } }
const BROOD = [
  { from: { x: HIVE.x - 20, y: -150 }, to: { x: 120, y: -250 }, start: 0.46, shot: 0.52 },
  { from: { x: HIVE.x + 30, y: -170 }, to: { x: 150, y: -320 }, start: 0.5, shot: 0.56 },
]
const EYES_SHOT = [0.6, 0.64, 0.68]

const HITS: readonly Hit[] = [
  { x: HEAD.x - 30, y: HEAD.y - 50, value: '318', at: 0.34, crit: true },
  ...BROOD.map(({ to }, i) => ({ x: to.x + 20, y: to.y - 30, value: ['44', '47'][i], at: BROOD[i].shot })),
  ...HIVE_EYES.map(([x, y], i) => ({ x: HIVE.x + HIVE.scale * x, y: HIVE.scale * y - 40, value: ['88', '91', '276'][i], at: EYES_SHOT[i], crit: i === 2 })),
]

export const ventures = stopsPlace({
  land: LANDS.coast,
  script: [1900, 1700, 1300],
  ends: [0.4, 0.74, 1],
  back: () => (
    <>
      <g transform={`translate(${HILL.x} 0) scale(${HILL.scale})`}>
        <Tommy />
      </g>
      <g data-fx="hive" opacity="0" transform={`translate(${HIVE.x} 0) scale(${HIVE.scale} 0)`}>
        <Hive />
      </g>
      {BROOD.map(({ from }, i) => (
        <g key={from.x} data-fx={`brood-${i}`} opacity="0" transform={`translate(${from.x} ${from.y})`}>
          <g transform="scale(0.6)">
            <Flyer />
          </g>
        </g>
      ))}
      <g data-fx="rocket" opacity="0">
        <rect x={-30} y={-8} width={60} height={16} rx={8} fill={CEL.steelLight} />
        <path d="M30 -8 L60 0 L30 8 Z" fill={CEL.orange} />
      </g>
      <g data-fx="boom" opacity="0">
        <Burst x={ROCKET.burst.x} y={ROCKET.burst.y} r={90} fill={CEL.orange} />
        <Burst x={ROCKET.burst.x} y={ROCKET.burst.y} r={50} fill={CEL.sun} />
      </g>
    </>
  ),
  front: () => (
    <>
      <g data-fx="key" opacity="0" transform={`translate(${KEY.x} ${KEY.y})`}>
        <KeySlots name="piece" color={CEL.eldritch} />
      </g>
      <Scope name="scope" x={HEAD.x} y={HEAD.y} />
      <Hits name="hit" hits={HITS} />
      <TitleCard name="card" x={CARD.x} y={CARD.y} title="TOWER TOMMY" joke="HASN'T LEFT THAT CHAIR SINCE MONDAY." />
    </>
  ),
  move: (profession, t) => {
    if (t < 0.18) return { pose: rest(profession), ahead: 0, lift: 0 }
    if (t < 0.4) return { pose: snipe(ramp(t, 0.18, 0.4), 0.73), ahead: 0, lift: 0 }
    if (t < 0.74) return { pose: shoot(ramp(t, 0.4, 0.72), 0.35, 0.9, 10), ahead: 0, lift: 0 }
    return { pose: mix(shoot(1, 2, 2, 10), LOOK_UP, ramp(t, 0.74, 0.8)), ahead: 0, lift: 0 }
  },
  reply: (stage) => {
    const card = cardWriter(stage, 'card', CARD.x, CARD.y, 0.02, 0.13)
    const rocket = fx(stage, 'rocket')
    const boom = fx(stage, 'boom')
    const scope = scopeWriter(stage, 'scope', HEAD.x, HEAD.y, [0.24, 0.34, 0.38])
    const tommy = fx(stage, 'tommy')
    const hive = fx(stage, 'hive')
    const brood = BROOD.map((_, i) => fx(stage, `brood-${i}`))
    const eyes = HIVE_EYES.map((_, i) => fx(stage, `eye-${i}`))
    const hits = hitsWriter(stage, 'hit', HITS)
    const key = popWriter(stage, 'key', KEY.x, KEY.y, 0.76)
    const pieces = [0, 1].map((i) => fx(stage, `piece-${i}`))
    const missing = fx(stage, 'piece-missing')
    return (t) => {
      card(t)
      // the rocket off his gun, bursting short of him
      const flight = ramp(t, 0.14, 0.21)
      transformTo(rocket, `translate(${(MUZZLE.x + (ROCKET.burst.x - MUZZLE.x) * flight).toFixed(1)} ${(MUZZLE.y + (ROCKET.burst.y - MUZZLE.y) * flight).toFixed(1)}) rotate(${(180 + 22 * flight).toFixed(1)})`)
      fadeTo(rocket, flight > 0 && flight < 1 ? 1 : 0)
      fadeTo(boom, Math.sin(Math.PI * ramp(t, 0.21, 0.28)))
      scope(t)
      transformTo(tommy, `rotate(${(-38 * ramp(t, 0.34, 0.38)).toFixed(1)} 30 -40)`)
      // the hive heaves up, spits its brood, loses its eyes and sinks
      const up = ramp(t, 0.4, 0.46) * (1 - ramp(t, 0.69, 0.74))
      transformTo(hive, `translate(${HIVE.x} 0) scale(${HIVE.scale} ${(HIVE.scale * up).toFixed(3)})`)
      fadeTo(hive, ramp(t, 0.4, 0.42) * (1 - ramp(t, 0.72, 0.74)))
      BROOD.forEach(({ from, to, start, shot }, i) => {
        const go = ramp(t, start, shot)
        const fall = ramp(t, shot, shot + 0.04)
        transformTo(brood[i], `translate(${(from.x + (to.x - from.x) * go).toFixed(1)} ${(from.y + (to.y - from.y) * go + 120 * fall).toFixed(1)}) rotate(${(140 * fall).toFixed(1)})`)
        fadeTo(brood[i], ramp(t, start, start + 0.01) * (1 - ramp(t, shot + 0.01, shot + 0.04)))
      })
      eyes.forEach((eye, i) => fadeTo(eye, 1 - ramp(t, EYES_SHOT[i], EYES_SHOT[i] + 0.02)))
      hits(t)
      // the key, two pieces in, the third slot dark
      key(t)
      pieces.forEach((piece, i) => fadeTo(piece, ramp(t, 0.82 + 0.07 * i, 0.84 + 0.07 * i)))
      fadeTo(missing, ramp(t, 0.94, 0.98))
    }
  },
})
