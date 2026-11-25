import { mix } from '@/lib/motion/rigPose'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, transformTo } from '../../shared/stageNodes'
import { CliffDoor, Laser, Pillar, VaultThing } from '../cast'
import { HOURS } from '../desert'
import { Burst } from '../ink'
import { CEL } from '../palette'
import { stopsPlace } from '../place'
import { DUCK, crouch, kick, rest, stride, uppercut } from '../pose'

// Muay Thai, the fighter's stretch: the thing from the vault (notes L64, L115 to L119, [1] [18]). In the stone
// court before the open door the great one eyed thing rises; its laser sweeps the court and he drops behind a
// pillar as it scorches the stone. He darts out and smashes the glowing weak points of a tentacle with knees
// and kicks until it falls. The laser stops, the eye opens, and he springs up and drives the blow home; the
// thing sinks back and the door slams shut behind it.

const PILLAR = 110
const THING = 470
const DOOR = 470
const DARTS = 230
// The eye's laser root on the canvas, relative to his place.
const EYE = { x: THING, y: -440 }

export const muayThai = stopsPlace({
  hour: HOURS.dusk,
  // the vault thing is wider than any other stop's art: on a phone he stands further left and the court is
  // drawn smaller, so he and the thing are whole
  at: (phone) => (phone ? 540 : 780),
  phoneZoom: 0.62,
  script: [1500, 1900, 1700],
  ends: [0.3, 0.66, 1],
  back: () => (
    <>
      <g data-fx="door" transform={`translate(${DOOR} 0) scale(0.9)`}>
        <CliffDoor />
      </g>
      <defs>
        <clipPath id="cel-court">
          <rect x={-1200} y={-1400} width={2800} height={1400} />
        </clipPath>
      </defs>
      <g clipPath="url(#cel-court)">
        <g data-fx="thing" transform={`translate(${THING} 0)`}>
          <VaultThing />
        </g>
      </g>
      <g data-fx="laser" opacity="0" transform={`translate(${EYE.x} ${EYE.y})`}>
        <Laser />
      </g>
      <g data-fx="hit" opacity="0">
        <Burst x={THING} y={-440} r={90} fill={CEL.sun} />
      </g>
      <g data-fx="smash" opacity="0">
        <Burst x={THING - 300} y={-150} r={50} fill={CEL.uncommon} />
      </g>
    </>
  ),
  front: () => (
    <g transform={`translate(${PILLAR} 0)`}>
      <Pillar />
    </g>
  ),
  move: (profession, t) => {
    if (t < 0.3) return { pose: mix(rest(profession), DUCK, ramp(t, 0.06, 0.14)), ahead: -40 * ramp(t, 0.02, 0.12), lift: 0 }
    if (t < 0.66) {
      const dart = ramp(t, 0.3, 0.4)
      if (dart < 1) return { pose: stride(profession, 4 * dart), ahead: -40 + (DARTS + 40) * dart, lift: 0 }
      // three blows on the weak points, then he steps back as it falls
      const blow = Math.floor(ramp(t, 0.4, 0.62) * 3)
      const inBlow = (ramp(t, 0.4, 0.62) * 3) % 1
      return { pose: blow < 3 ? kick(profession, Math.sin(Math.PI * inBlow)) : rest(profession), ahead: DARTS, lift: 0 }
    }
    const spring = ramp(t, 0.74, 0.86)
    const lift = 260 * Math.sin(Math.PI * spring)
    if (spring === 0) return { pose: crouch(profession, ramp(t, 0.66, 0.74)), ahead: DARTS, lift: 0 }
    return { pose: spring < 1 ? uppercut(profession, ramp(spring, 0, 0.5)) : rest(profession), ahead: DARTS + 40 * spring, lift }
  },
  reply: (stage) => {
    const laser = fx(stage, 'laser')
    const tentacle = fx(stage, 'tentacle')
    const spots = [0, 1, 2].map((i) => fx(stage, `spot-${i}`))
    const smash = fx(stage, 'smash')
    const lid = fx(stage, 'lid')
    const hit = fx(stage, 'hit')
    const thing = fx(stage, 'thing')
    const doorL = fx(stage, 'door-l')
    const doorR = fx(stage, 'door-r')
    const light = fx(stage, 'door-light')
    return (t) => {
      // the laser sweeps down across the court and over the pillar
      const sweep = ramp(t, 0.08, 0.28)
      transformTo(laser, `translate(${EYE.x} ${EYE.y}) rotate(${(-26 + 34 * sweep).toFixed(1)})`)
      fadeTo(laser, sweep > 0 && sweep < 1 ? 1 : 0)
      spots.forEach((spot, i) => fadeTo(spot, 1 - ramp(t, 0.44 + 0.07 * i, 0.46 + 0.07 * i)))
      fadeTo(smash, Math.abs(Math.sin(Math.PI * 3 * ramp(t, 0.4, 0.62))))
      const fall = ramp(t, 0.6, 0.66)
      transformTo(tentacle, `translate(${(-40 * fall).toFixed(1)} ${(30 * fall).toFixed(1)}) rotate(${(-30 * fall).toFixed(1)} -280 0)`)
      // the eye opens when the laser stops, takes the blow, and the thing sinks back
      transformTo(lid, `scale(1 ${(1 - ramp(t, 0.66, 0.72) + ramp(t, 0.84, 0.88)).toFixed(3)})`)
      fadeTo(hit, Math.sin(Math.PI * ramp(t, 0.8, 0.9)))
      transformTo(thing, `translate(${THING} ${(380 * ramp(t, 0.86, 0.98)).toFixed(1)})`)
      // sunk under the court, it is gone from the end frame
      fadeTo(thing, 1 - ramp(t, 0.97, 1))
      // the door stands open behind it, and slams shut as it goes
      const shut = ramp(t, 0.9, 0.98)
      transformTo(doorL, `translate(${(-90 * (1 - shut)).toFixed(1)} 0)`)
      transformTo(doorR, `translate(${(90 * (1 - shut)).toFixed(1)} 0)`)
      fadeTo(light, 1 - shut)
    }
  },
})
