import { mix } from '@/lib/motion/rigPose'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, transformTo } from '../../shared/stageNodes'
import { Brood, CliffDoor, Gunner, Hive, KeySlots, Soldiers } from '../cast'
import { HOURS } from '../desert'
import { Burst } from '../ink'
import { CEL } from '../palette'
import { stopsPlace } from '../place'
import { LOOK_UP, ROLL, rest, shoot, snipe } from '../pose'

// Ventures, two pieces and the door (notes L55 to L64, L108 to L111, [1] [14] [15] [16]): one long shot and
// the gunner behind the heavy gun on the hilltop slumps; a piece clicks into the key. On the rubbish coast the
// hive throws its brood at him, he rolls under it and bursts its pale eyes; the second piece clicks in. The
// third slot stays empty, and yet far off the great door in the cliff grinds open, armoured soldiers already
// at its foot: someone else got there first.

const HILL = { x: 400, y: 0 }
const HIVE = 360
const DOOR = 340
const KEY = { x: 200, y: -560 }
const ROLLS = 60
const BROOD = [0, 1]

export const ventures = stopsPlace({
  hour: HOURS.dusk,
  script: [1500, 1800, 1700],
  ends: [0.3, 0.66, 1],
  back: () => (
    <>
      <g data-fx="cliff" opacity="0" transform={`translate(${DOOR} 0) scale(0.7)`}>
        <CliffDoor />
        <g transform="translate(0 0) scale(0.8)">
          <Soldiers />
        </g>
      </g>
      <g data-fx="hill" transform={`translate(${HILL.x} ${HILL.y})`}>
        <Gunner />
      </g>
      <g data-fx="hive" opacity="0" transform={`translate(${HIVE} 0)`}>
        <Hive />
      </g>
      {BROOD.map((i) => (
        <g key={i} data-fx={`brood-${i}`} opacity="0">
          <Brood />
        </g>
      ))}
      <g data-fx="snipe" opacity="0">
        <path d={`M150 -230 L${HILL.x + 50} -270`} stroke={CEL.sun} strokeWidth="5" data-bare />
        <Burst x={HILL.x + 50} y={-270} r={36} fill={CEL.crit} />
      </g>
      <g transform={`translate(${KEY.x} ${KEY.y})`}>
        <KeySlots name="piece" color={CEL.epic} />
      </g>
    </>
  ),
  move: (profession, t) => {
    if (t < 0.3) return { pose: snipe(ramp(t, 0, 0.3), 0.5), ahead: 0, lift: 0 }
    if (t < 0.66) {
      const roll = ramp(t, 0.42, 0.52)
      if (roll > 0 && roll < 1) return { pose: ROLL, ahead: ROLLS * roll, lift: 0 }
      return { pose: roll === 1 ? shoot(ramp(t, 0.52, 0.66), 0.2, 0.8) : rest(profession), ahead: ROLLS * roll, lift: 0 }
    }
    return { pose: mix(shoot(1), LOOK_UP, ramp(t, 0.68, 0.76)), ahead: ROLLS, lift: 0 }
  },
  reply: (stage) => {
    const snipeShot = fx(stage, 'snipe')
    const gunner = fx(stage, 'gunner')
    const hill = fx(stage, 'hill')
    const hive = fx(stage, 'hive')
    const eyes = [0, 1, 2].map((i) => fx(stage, `eye-${i}`))
    const brood = BROOD.map((i) => fx(stage, `brood-${i}`))
    const pieces = [0, 1, 2].map((i) => fx(stage, `piece-${i}`))
    const cliff = fx(stage, 'cliff')
    const doorL = fx(stage, 'door-l')
    const doorR = fx(stage, 'door-r')
    const light = fx(stage, 'door-light')
    return (t) => {
      fadeTo(snipeShot, ramp(t, 0.14, 0.15) * (1 - ramp(t, 0.18, 0.22)))
      transformTo(gunner, `rotate(${(60 * ramp(t, 0.16, 0.22)).toFixed(1)} 30 -40)`)
      fadeTo(pieces[0], ramp(t, 0.24, 0.28))
      // the hill gives way to the hive on the coast
      fadeTo(hill, 1 - ramp(t, 0.3, 0.34))
      fadeTo(hive, ramp(t, 0.32, 0.36) * (1 - ramp(t, 0.66, 0.7)))
      BROOD.forEach((i) => {
        const flight = ramp(t, 0.36 + 0.04 * i, 0.5 + 0.04 * i)
        const x = HIVE - 80 + (-200 - HIVE + 80) * flight
        const y = -220 - 200 * 4 * flight * (1 - flight) + 120 * flight
        transformTo(brood[i], `translate(${x.toFixed(1)} ${y.toFixed(1)})`)
        fadeTo(brood[i], flight > 0 && flight < 1 ? 1 : 0)
      })
      eyes.forEach((eye, i) => fadeTo(eye, 1 - ramp(t, 0.56 + 0.03 * i, 0.58 + 0.03 * i)))
      fadeTo(pieces[1], ramp(t, 0.62, 0.66))
      // the third slot stays empty while far off the door grinds open
      fadeTo(cliff, ramp(t, 0.68, 0.74))
      const open = ramp(t, 0.78, 0.96)
      transformTo(doorL, `translate(${(-90 * open).toFixed(1)} 0)`)
      transformTo(doorR, `translate(${(90 * open).toFixed(1)} 0)`)
      fadeTo(light, open)
    }
  },
})
