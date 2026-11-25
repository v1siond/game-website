import { mix } from '@/lib/motion/rigPose'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, transformTo } from '../../shared/stageNodes'
import { Grits, Hound } from '../cast/foes'
import { Chest, Detonator, LootGun, RockPile } from '../cast/props'
import { LANDS } from '../desert'
import { Hits, LootStats, Tag, TitleCard, cardWriter, drainWriter, hitsWriter, popWriter, type Hit } from '../hud'
import { Burst } from '../ink'
import { CEL } from '../palette'
import { stopsPlace } from '../place'
import { CATCH, press, shoot } from '../pose'

// Work, the first boss in the gully (research notes, the story 4 and 5, the bosses 1, [8]; footage 69, 81 and
// the burst b1 to b4): a rock pile blocks the gully; he leans on the detonator's plunger and it goes up in a
// starburst. His hounds charge out of the smoke with their tags over them and he guns them down, a number off
// every hit. GRITS stomps out and the frame freezes on his card; then he goes down under the rifle, the last
// hit a critical. His chest pops open in green light and a gun flies to his hands, its stat card over the
// chest: the first colour above white.

const DETONATOR = 60
const PILE = 330
const HOUNDS = [300, 400, 500]
const BOSS = { from: 660, at: 450 }
const CHEST = 320
const CARD = { x: 280, y: -580 }
const LOOT = { x: CHEST, y: -330 }
// The gun's flight from the chest to his hands.
const GUN = { from: { x: CHEST, y: -130 }, to: { x: 70, y: -200 }, height: 160 }

const HITS: readonly Hit[] = [
  { x: HOUNDS[0] - 20, y: -150, value: '38', at: 0.2 },
  { x: HOUNDS[1] - 20, y: -150, value: '41', at: 0.26 },
  { x: HOUNDS[2] - 20, y: -150, value: '36', at: 0.32 },
  { x: BOSS.at - 40, y: -300, value: '52', at: 0.58 },
  { x: BOSS.at + 20, y: -250, value: '49', at: 0.62 },
  { x: BOSS.at - 20, y: -340, value: '187', at: 0.66, crit: true },
]
const HOUND_FALLS = [0.2, 0.26, 0.32]

export const work = stopsPlace({
  land: LANDS.badlands,
  script: [1800, 1800, 1400],
  ends: [0.36, 0.7, 1],
  back: () => (
    <>
      <g transform={`translate(${CHEST} 0)`}>
        <Chest name="chest" color={CEL.uncommon} />
      </g>
      <g data-fx="boss" opacity="0" transform={`translate(${BOSS.from} 0)`}>
        <Grits />
        <Tag name="boss-tag" label="GRITS" level={8} y={-380} />
      </g>
      {HOUNDS.map((x, i) => (
        <g key={x} data-fx={`hound-${i}`} opacity="0" transform={`translate(${x} 0)`}>
          <Hound />
          <Tag name={`hound-${i}-tag`} label="HOUND" level={4} y={-160} />
        </g>
      ))}
      <g data-fx="pile" transform={`translate(${PILE} 0)`}>
        <RockPile />
      </g>
      <g data-fx="blast" opacity="0">
        <Burst x={PILE} y={-110} r={160} fill={CEL.orange} />
        <Burst x={PILE + 20} y={-120} r={86} fill={CEL.sun} />
      </g>
    </>
  ),
  front: () => (
    <>
      <g transform={`translate(${DETONATOR} 0)`}>
        <Detonator />
      </g>
      <g data-fx="gun" opacity="0">
        <LootGun color={CEL.uncommon} />
      </g>
      <Hits name="hit" hits={HITS} />
      <LootStats name="loot" x={LOOT.x} y={LOOT.y} color={CEL.uncommon} title="THE DUSTY HANDSHAKE" stats={['DAMAGE 48', 'ACCURACY 87.2', 'FIRE RATE 6.4']} />
      <TitleCard name="card" x={CARD.x} y={CARD.y} title="GRITS" joke="LIVES IN A HOLE. LIKES IT THERE." />
    </>
  ),
  move: (_profession, t) => {
    if (t < 0.12) return { pose: press(ramp(t, 0, 0.11)), ahead: 0, lift: 0 }
    if (t < 0.36) return { pose: shoot(ramp(t, 0.12, 0.36), 0.3, 0.95), ahead: 0, lift: 0 }
    if (t < 0.72) return { pose: shoot(t < 0.56 ? 1 : ramp(t, 0.5, 0.7), 0.4, 0.85), ahead: 0, lift: 0 }
    return { pose: mix(shoot(1), { ...CATCH, rifle: 0 }, ramp(t, 0.82, 0.88)), ahead: 0, lift: 0 }
  },
  reply: (stage) => {
    const plunger = fx(stage, 'plunger')
    const pile = fx(stage, 'pile')
    const blast = fx(stage, 'blast')
    const hounds = HOUNDS.map((_, i) => fx(stage, `hound-${i}`))
    const drains = HOUND_FALLS.map((at, i) => drainWriter(stage, `hound-${i}-tag`, at - 0.03, at))
    const boss = fx(stage, 'boss')
    const bossDrain = drainWriter(stage, 'boss-tag', 0.57, 0.67)
    const card = cardWriter(stage, 'card', CARD.x, CARD.y, 0.42, 0.54)
    const hits = hitsWriter(stage, 'hit', HITS)
    const lid = fx(stage, 'chest-lid')
    const light = fx(stage, 'chest-light')
    const gun = fx(stage, 'gun')
    const loot = popWriter(stage, 'loot', LOOT.x, LOOT.y, 0.88)
    return (t) => {
      transformTo(plunger, `translate(0 ${(50 * ramp(t, 0.07, 0.1)).toFixed(1)})`)
      const blown = ramp(t, 0.1, 0.13)
      fadeTo(pile, 1 - blown)
      fadeTo(blast, Math.sin(Math.PI * ramp(t, 0.1, 0.22)))
      // the charge out of the smoke, each hound down in turn on its hit
      HOUNDS.forEach((x, i) => {
        const charge = ramp(t, 0.12, 0.18 + 0.03 * i)
        const fall = ramp(t, HOUND_FALLS[i], HOUND_FALLS[i] + 0.03)
        transformTo(hounds[i], `translate(${(x + 260 * (1 - charge)).toFixed(1)} 0) rotate(${(-70 * fall).toFixed(1)})`)
        fadeTo(hounds[i], blown * (1 - ramp(t, HOUND_FALLS[i] + 0.03, HOUND_FALLS[i] + 0.07)))
        drains[i](t)
      })
      // GRITS stomps out, holds for his card, takes the burst and goes over
      const stomp = ramp(t, 0.36, 0.42)
      const over = ramp(t, 0.66, 0.7)
      transformTo(boss, `translate(${(BOSS.from + (BOSS.at - BOSS.from) * stomp).toFixed(1)} ${(-12 * Math.abs(Math.sin(Math.PI * 3 * stomp))).toFixed(1)}) rotate(${(80 * over).toFixed(1)})`)
      fadeTo(boss, ramp(t, 0.36, 0.38) * (1 - ramp(t, 0.71, 0.75)))
      bossDrain(t)
      card(t)
      hits(t)
      // the chest pops and the gun flies to his hands in its green light, its card over the chest
      transformTo(lid, `rotate(${(110 * ramp(t, 0.72, 0.78)).toFixed(1)} 70 -104)`)
      fadeTo(light, ramp(t, 0.74, 0.8))
      const flight = ramp(t, 0.78, 0.88)
      const x = GUN.from.x + (GUN.to.x - GUN.from.x) * flight
      const y = GUN.from.y + (GUN.to.y - GUN.from.y) * flight - 4 * GUN.height * flight * (1 - flight)
      transformTo(gun, `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(360 * flight).toFixed(1)})`)
      fadeTo(gun, ramp(t, 0.76, 0.8))
      loot(t)
    }
  },
})
