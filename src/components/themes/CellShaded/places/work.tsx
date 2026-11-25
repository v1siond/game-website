import { mix } from '@/lib/motion/rigPose'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, transformTo } from '../../shared/stageNodes'
import { BanditBoss, Beast, Crate, Detonator, LootGun, RockPile } from '../cast'
import { HOURS } from '../desert'
import { Burst } from '../ink'
import { CEL } from '../palette'
import { stopsPlace } from '../place'
import { CATCH, press, shoot } from '../pose'

// Work, the first boss in the gully (notes L43 to L44, L103, L135 to L136, [1] [3] [8]): a rock pile blocks
// it; he leans on the detonator's plunger and the pile goes up in a comic starburst. Out of the smoke his
// beasts charge in a line with the boss behind them, and he guns them down one after another, then the boss.
// The boss's crate pops open and a gun flies out in green light, the first colour above white, and he
// catches it.

const PILE = 300
const DETONATOR = 70
const BEASTS = [250, 340, 430]
const BOSS = 460
const CRATE = 380
// The gun's flight from the crate to his hands.
const GUN = { from: { x: CRATE, y: -120 }, to: { x: 70, y: -200 }, height: 160 }

export const work = stopsPlace({
  hour: HOURS.town,
  // a step right of the usual place, so the boss's beasts and his gun stay clear of the cards and the edge
  at: (phone) => (phone ? 650 : 900),
  script: [1500, 2000, 1400],
  ends: [0.3, 0.72, 1],
  back: () => (
    <>
      <g data-fx="boss" transform={`translate(${BOSS} 0)`} opacity="0">
        <BanditBoss />
      </g>
      <g transform={`translate(${CRATE} 0)`}>
        <Crate name="crate" />
      </g>
      {BEASTS.map((x, i) => (
        <g key={x} data-fx={`beast-${i}`} opacity="0" transform={`translate(${x} 0)`}>
          <Beast />
        </g>
      ))}
      <g data-fx="pile" transform={`translate(${PILE} 0)`}>
        <RockPile />
      </g>
      <g data-fx="blast" opacity="0">
        <Burst x={PILE} y={-110} r={150} fill={CEL.orange} />
        <Burst x={PILE + 20} y={-120} r={80} fill={CEL.sun} />
      </g>
      <g data-fx="gun" opacity="0">
        <LootGun color={CEL.uncommon} />
      </g>
    </>
  ),
  front: () => (
    <g transform={`translate(${DETONATOR} 0)`}>
      <Detonator />
    </g>
  ),
  move: (profession, t) => {
    if (t < 0.3) return { pose: press(ramp(t, 0, 0.26)), ahead: 0, lift: 0 }
    if (t < 0.72) return { pose: shoot(ramp(t, 0.3, 0.72), 0.3, 0.9), ahead: 0, lift: 0 }
    return { pose: mix(shoot(1), CATCH, ramp(t, 0.82, 0.9)), ahead: 0, lift: 0 }
  },
  reply: (stage) => {
    const plunger = fx(stage, 'plunger')
    const pile = fx(stage, 'pile')
    const blast = fx(stage, 'blast')
    const beasts = BEASTS.map((_, i) => fx(stage, `beast-${i}`))
    const boss = fx(stage, 'boss')
    const lid = fx(stage, 'crate-lid')
    const gun = fx(stage, 'gun')
    return (t) => {
      transformTo(plunger, `translate(0 ${(50 * ramp(t, 0.14, 0.2)).toFixed(1)})`)
      const blown = ramp(t, 0.2, 0.24)
      fadeTo(pile, 1 - blown)
      fadeTo(blast, Math.sin(Math.PI * ramp(t, 0.2, 0.36)))
      // the charge out of the smoke, each beast down in turn; the boss last
      BEASTS.forEach((x, i) => {
        const charge = ramp(t, 0.3, 0.42 + 0.08 * i)
        const fall = ramp(t, 0.42 + 0.08 * i, 0.46 + 0.08 * i)
        transformTo(beasts[i], `translate(${(x + 200 - 200 * charge - 40 * i * charge).toFixed(1)} 0) rotate(${(80 * fall).toFixed(1)})`)
        fadeTo(beasts[i], blown * (1 - ramp(t, 0.76, 0.8)))
      })
      const bossDown = ramp(t, 0.66, 0.72)
      transformTo(boss, `translate(${BOSS} 0) rotate(${(80 * bossDown).toFixed(1)})`)
      fadeTo(boss, blown * (1 - ramp(t, 0.76, 0.8)))
      // the crate pops and the gun flies to his hands in its green light
      transformTo(lid, `rotate(${(-110 * ramp(t, 0.74, 0.8)).toFixed(1)} -70 -100)`)
      const flight = ramp(t, 0.78, 0.9)
      const x = GUN.from.x + (GUN.to.x - GUN.from.x) * flight
      const y = GUN.from.y + (GUN.to.y - GUN.from.y) * flight - 4 * GUN.height * flight * (1 - flight)
      transformTo(gun, `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(360 * flight).toFixed(1)})`)
      fadeTo(gun, ramp(t, 0.76, 0.8))
    }
  },
})
