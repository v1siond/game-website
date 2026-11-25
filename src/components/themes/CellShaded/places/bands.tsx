import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, transformTo } from '../../shared/stageNodes'
import { Cage, Crate, Dust, RaiderCar, Raider, Runner, SaltCamp, Waveform } from '../cast'
import { HOURS } from '../desert'
import { flung } from '../bandit'
import { CEL } from '../palette'
import { stopsPlace } from '../place'
import { DRIVE, kick, rest } from '../pose'

// Bands, the drummer's stretch on the salt flats (notes L58 to L59, L112 to L114, L163, [1] [16]): he drives
// through the patrol cars and they flip into the salt. The elevator cage lifts him into the camp on its
// stilts, and wave on wave of guards comes over the wall on the beat, a drum line he kicks back in time.
// Then he kicks the chest open: it is empty, and only static crackles at his ear.

const CAMP = { x: 40, high: 300 }
const CAGE = 0
const CHEST = 300
const PATROL = 300
// He drives in from the left, sat at the wheel.
const DRIVES = { from: -420, seat: 60 }
const WAVES = [0, 1, 2]
const WALL = CAMP.x + 380

export const bands = stopsPlace({
  hour: HOURS.dusk,
  // a step right of the usual place on a wide screen, so the cage rides up clear of the cards
  at: (phone) => (phone ? 600 : 920),
  // on a phone the cage ride ends high on the stilts, so the stop stands low enough to keep him, the cage and
  // the camp whole under the header
  phoneDrop: 300,
  script: [1500, 1300, 2000],
  ends: [0.28, 0.5, 1],
  back: () => (
    <>
      <rect x={-1200} y={-6} width={2600} height={40} fill={CEL.paper} data-bare />
      <g data-fx="camp" opacity="0" transform={`translate(${CAMP.x} 0)`}>
        <SaltCamp high={CAMP.high} />
      </g>
      <g data-fx="chest" opacity="0" transform={`translate(${CHEST} ${-CAMP.high - 20})`}>
        <Crate name="chest" />
      </g>
      {WAVES.map((i) => (
        <g key={i} data-fx={`guard-${i}`} opacity="0">
          <Raider />
        </g>
      ))}
      <g data-fx="patrol" transform={`translate(${PATROL} 0) scale(-1 1)`}>
        <RaiderCar />
      </g>
      <g data-fx="ride" transform={`translate(${DRIVES.from} 0)`}>
        <Runner />
      </g>
      <g data-fx="dust" opacity="0">
        <Dust />
      </g>
      <g transform={`translate(${CAGE} 0)`}>
        <g data-fx="cage-wrap" opacity="0">
          <Cage />
        </g>
      </g>
      <g data-fx="static" opacity="0" transform={`translate(60 ${-CAMP.high - 300})`}>
        <Waveform name="static" />
      </g>
    </>
  ),
  move: (profession, t) => {
    if (t < 0.28) {
      const drive = ramp(t, 0, 0.24)
      return { pose: DRIVE, ahead: DRIVES.from + 20 + (20 - DRIVES.from) * drive, lift: DRIVES.seat }
    }
    if (t < 0.5) {
      const out = ramp(t, 0.28, 0.34)
      const up = ramp(t, 0.36, 0.5)
      return { pose: out < 1 ? DRIVE : rest(profession), ahead: 20 - 20 * out, lift: DRIVES.seat * (1 - out) + CAMP.high * up }
    }
    // three waves on the beat, each kicked back, then the chest kicked open
    const beat = WAVES.findIndex((i) => t < 0.66 + 0.12 * i)
    const kickAt = beat === -1 ? 0.88 : 0.54 + 0.12 * beat
    const pose = kick(profession, Math.sin(Math.PI * ramp(t, kickAt, kickAt + 0.08)))
    const ahead = t < 0.84 ? 120 : 120 + 60 * ramp(t, 0.84, 0.88)
    return { pose, ahead, lift: CAMP.high + 20 }
  },
  reply: (stage) => {
    const patrol = fx(stage, 'patrol')
    const ride = fx(stage, 'ride')
    const dust = fx(stage, 'dust')
    const camp = fx(stage, 'camp')
    const cage = fx(stage, 'cage')
    const wrap = fx(stage, 'cage-wrap')
    const chest = fx(stage, 'chest')
    const lid = fx(stage, 'chest-lid')
    const guards = WAVES.map((i) => fx(stage, `guard-${i}`))
    const noise = fx(stage, 'static')
    const bars = [0, 1, 2, 3, 4].map((i) => fx(stage, `static-${i}`))
    return (t) => {
      const drive = ramp(t, 0, 0.24)
      transformTo(ride, `translate(${(DRIVES.from + (0 - DRIVES.from) * drive).toFixed(1)} 0)`)
      fadeTo(ride, 1 - ramp(t, 0.34, 0.38))
      transformTo(patrol, `translate(${PATROL} 0) ${flung(ramp(t, 0.16, 0.3), 500, 220)} scale(-1 1)`)
      fadeTo(patrol, 1 - ramp(t, 0.26, 0.3))
      fadeTo(dust, Math.sin(Math.PI * ramp(t, 0.14, 0.3)))
      transformTo(dust, `translate(${PATROL - 40} -60) scale(1.6)`)
      fadeTo(camp, ramp(t, 0.26, 0.32))
      fadeTo(wrap, ramp(t, 0.3, 0.34))
      transformTo(cage, `translate(0 ${(-(CAMP.high + 20) * ramp(t, 0.36, 0.5)).toFixed(1)})`)
      fadeTo(chest, ramp(t, 0.44, 0.5))
      WAVES.forEach((i) => {
        const over = ramp(t, 0.5 + 0.12 * i, 0.56 + 0.12 * i)
        const back = ramp(t, 0.58 + 0.12 * i, 0.64 + 0.12 * i)
        transformTo(guards[i], `translate(${(WALL - 160 * over).toFixed(1)} ${(-CAMP.high - 20 - 40 * (1 - over)).toFixed(1)}) ${flung(back, 360, 160)}`)
        fadeTo(guards[i], over > 0 && back < 1 ? 1 : 0)
      })
      transformTo(lid, `rotate(${(-120 * ramp(t, 0.9, 0.94)).toFixed(1)} -70 -100)`)
      fadeTo(noise, ramp(t, 0.94, 0.98))
      bars.forEach((bar, i) => transformTo(bar, `scale(1 ${(0.2 + 0.8 * Math.abs(Math.sin(t * 160 + 2 * i))).toFixed(3)})`))
    }
  },
})
