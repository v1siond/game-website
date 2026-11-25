import { mix } from '@/lib/motion/rigPose'
import { hop } from '@/lib/motion/arc'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, transformTo } from '../../shared/stageNodes'
import { Hunger, SPOTS } from '../cast/foes'
import { Laser, Pillar, VaultDoor } from '../cast/props'
import { LANDS } from '../desert'
import { Hits, TitleCard, cardWriter, hitsWriter, type Hit } from '../hud'
import { Burst } from '../ink'
import { CEL } from '../palette'
import { stopsPlace } from '../place'
import { DUCK, crouch, flyingKnee, kick, rest, stride } from '../pose'

// Muay Thai, the fighter's stretch: the monster at the vault (research notes, the story 17 and 18, the bosses
// 7, [18] [1]; footage 257 to 268): in the snow before the vault's open door THE OLD HUNGER heaves up and the
// frame freezes on its card. Its laser sweeps the court and he drops behind a broken pillar as it scorches the
// stone. He darts out and kicks the purple weak points of its tentacle, a number off each, until it falls.
// The laser stops, the eye opens, and his flying knee lands in it, a critical; he hops back off it in guard as
// it sinks, and the vault's door slams shut behind it.

const PILLAR = 100
// He darts out past the pillar to kick the tentacle, clear of the pillar.
const THING = { x: 520, scale: 0.75 }
const DOOR = { x: 520, scale: 0.9 }
const DARTS = 220
// How far ahead of the dart the flying knee carries him, into the eye.
const LEAP = 220
const CARD = { x: 270, y: -600 }
// The eye's laser root, relative to his place.
const EYE = { x: THING.x, y: THING.scale * -440 }
const KNEE_AT = 0.86

const HITS: readonly Hit[] = [
  ...SPOTS.map(([x, y], i) => ({ x: THING.x + THING.scale * x + 30, y: THING.scale * y - 30, value: ['412', '398', '405'][i], at: 0.46 + 0.07 * i })),
  { x: EYE.x - 60, y: EYE.y - 40, value: '4096', at: KNEE_AT, crit: true },
]

export const muayThai = stopsPlace({
  land: LANDS.vault,
  // the monster is wider than any other stop's art: on a phone the court is drawn smaller, so it is whole
  phoneZoom: 0.62,
  script: [1700, 1800, 1500],
  ends: [0.34, 0.7, 1],
  back: () => (
    <>
      <g data-fx="door" transform={`translate(${DOOR.x} 0) scale(${DOOR.scale})`}>
        <VaultDoor />
      </g>
      <defs>
        <clipPath id="cel-court">
          <rect x={-1200} y={-1400} width={2800} height={1400} />
        </clipPath>
      </defs>
      <g clipPath="url(#cel-court)">
        <g data-fx="thing" transform={`translate(${THING.x} 380) scale(${THING.scale})`}>
          <Hunger />
        </g>
      </g>
      <g data-fx="laser" opacity="0" transform={`translate(${EYE.x} ${EYE.y})`}>
        <Laser />
      </g>
      <g data-fx="smash" opacity="0">
        <Burst x={0} y={0} r={50} fill={CEL.eldritch} />
      </g>
      <g data-fx="hit-eye" opacity="0">
        <Burst x={EYE.x} y={EYE.y} r={100} fill={CEL.sun} />
      </g>
    </>
  ),
  front: () => (
    <>
      <g transform={`translate(${PILLAR} 0)`}>
        <Pillar />
      </g>
      <Hits name="hit" hits={HITS} />
      <TitleCard name="card" x={CARD.x} y={CARD.y} title="THE OLD HUNGER" joke="OPENS EVERY 200 YEARS. LIKE YOUR GYM CARD." />
    </>
  ),
  move: (profession, t) => {
    if (t < 0.34) return { pose: mix(rest(profession), DUCK, ramp(t, 0.2, 0.25)), ahead: -40 * ramp(t, 0.2, 0.25), lift: 0 }
    if (t < 0.7) {
      const dart = ramp(t, 0.34, 0.42)
      if (dart < 1) return { pose: stride(profession, 4 * dart), ahead: -40 + (DARTS + 40) * dart, lift: 0 }
      // a kick on each weak point, then he steps back as the tentacle falls
      const blows = ramp(t, 0.42, 0.63) * 3
      return { pose: blows < 3 ? kick(profession, Math.sin(Math.PI * (blows % 1))) : rest(profession), ahead: DARTS, lift: 0 }
    }
    const spring = ramp(t, 0.78, 0.9)
    if (spring === 0) return { pose: crouch(profession, ramp(t, 0.72, 0.78)), ahead: DARTS, lift: 0 }
    if (spring < 1) return { pose: flyingKnee(profession, ramp(spring, 0, 0.45)), ahead: DARTS + LEAP * spring, lift: 200 * Math.sin(Math.PI * spring) }
    // he hops back off it to where he darted, in guard, as it sinks
    const back = ramp(t, 0.9, 0.98)
    return { pose: rest(profession), ahead: DARTS + LEAP * (1 - back), lift: hop(back, 50) }
  },
  reply: (stage) => {
    const card = cardWriter(stage, 'card', CARD.x, CARD.y, 0.09, 0.2)
    const thing = fx(stage, 'thing')
    const laser = fx(stage, 'laser')
    const tentacle = fx(stage, 'tentacle')
    const spots = SPOTS.map((_, i) => fx(stage, `spot-${i}`))
    const smash = fx(stage, 'smash')
    const lid = fx(stage, 'lid')
    const eyeHit = fx(stage, 'hit-eye')
    const hits = hitsWriter(stage, 'hit', HITS)
    const doorL = fx(stage, 'door-l')
    const doorR = fx(stage, 'door-r')
    const light = fx(stage, 'door-light')
    return (t) => {
      card(t)
      // it heaves up out of the court, and sinks back under it at the end
      const rise = 1 - ramp(t, 0, 0.08)
      const sink = ramp(t, 0.88, 0.98)
      transformTo(thing, `translate(${THING.x} ${(380 * (rise + sink)).toFixed(1)}) scale(${THING.scale})`)
      fadeTo(thing, 1 - ramp(t, 0.97, 1))
      // the laser sweeps down across the court and over the pillar
      const sweep = ramp(t, 0.22, 0.32)
      transformTo(laser, `translate(${EYE.x} ${EYE.y}) rotate(${(-26 + 34 * sweep).toFixed(1)})`)
      fadeTo(laser, sweep > 0 && sweep < 1 ? 1 : 0)
      // a kick on each weak point: it bursts and goes out
      spots.forEach((spot, i) => fadeTo(spot, 1 - ramp(t, 0.46 + 0.07 * i, 0.48 + 0.07 * i)))
      const blow = Math.min(2, Math.floor(ramp(t, 0.42, 0.63) * 3))
      transformTo(smash, `translate(${(THING.x + THING.scale * SPOTS[blow][0]).toFixed(1)} ${(THING.scale * SPOTS[blow][1]).toFixed(1)})`)
      fadeTo(smash, t > 0.42 && t < 0.63 ? Math.abs(Math.sin(Math.PI * 3 * ramp(t, 0.42, 0.63))) : 0)
      const fall = ramp(t, 0.63, 0.69)
      transformTo(tentacle, `translate(${(-40 * fall).toFixed(1)} ${(40 * fall).toFixed(1)}) rotate(${(-30 * fall).toFixed(1)} -280 0)`)
      // the eye opens when the laser stops, takes the knee, and shuts as it sinks
      transformTo(lid, `scale(1 ${(1 - ramp(t, 0.7, 0.76) + ramp(t, 0.88, 0.92)).toFixed(3)})`)
      fadeTo(eyeHit, Math.sin(Math.PI * ramp(t, KNEE_AT - 0.02, KNEE_AT + 0.06)))
      hits(t)
      // the door stands open behind it, and slams shut as it goes
      const shut = ramp(t, 0.9, 0.98)
      transformTo(doorL, `translate(${(-100 * (1 - shut)).toFixed(1)} 0)`)
      transformTo(doorR, `translate(${(100 * (1 - shut)).toFixed(1)} 0)`)
      fadeTo(light, 1 - shut)
    }
  },
})
