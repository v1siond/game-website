import { mix } from '@/lib/motion/rigPose'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, transformTo } from '../../shared/stageNodes'
import { PINS, Satellite, VaultDoor, WorldMap } from '../cast/props'
import { Robot } from '../cast/road'
import { LANDS } from '../desert'
import { Waveform, voiceWriter } from '../hud'
import { stopsPlace } from '../place'
import { LOOK_UP, MAP, rest } from '../pose'

// Contact, the voice's source, at night (research notes, the story 18 and 19, the sequel's last line of
// the story, [1] [2]): the vault's door stands sealed in its cliff behind him. The voice crackles once more and
// he looks up: a satellite's light crosses the stars, and the waveform at his ear pulses in time with it. Our
// little robot rolls up out of the dark and bumps his leg. He opens a map before him, and point after point of
// new vaults lights across it in orange, the rarest colour: the next job, which the contact card offers.

const DOOR = { x: 430, scale: 0.55 }
const ROBOT = { from: 560, at: 340 }
const SKY = { from: { x: 540, y: -720 }, to: { x: 60, y: -640 } }
const EAR = { x: 70, y: -310 }
const MAP_AT = { x: 175, y: -210 }

export const contact = stopsPlace({
  land: LANDS.night,
  // on a phone the contact card covers the ground line, so the stop stands low, in the band under it
  phoneDrop: 560,
  script: [1700, 1300, 1700],
  ends: [0.36, 0.62, 1],
  back: () => (
    <>
      <g transform={`translate(${DOOR.x} 0) scale(${DOOR.scale})`}>
        <VaultDoor />
      </g>
      <g data-fx="satellite" opacity="0">
        <Satellite />
      </g>
      <g data-fx="robot" transform={`translate(${ROBOT.from} 0) scale(0.85)`}>
        <Robot name="robot" />
      </g>
    </>
  ),
  front: () => (
    <>
      <g data-fx="voice" opacity="0" transform={`translate(${EAR.x} ${EAR.y})`}>
        <Waveform name="voice" />
      </g>
      <g transform={`translate(${MAP_AT.x} ${MAP_AT.y})`}>
        <g data-fx="map-wrap" opacity="0">
          <WorldMap />
        </g>
      </g>
    </>
  ),
  move: (profession, t) => {
    if (t < 0.36) return { pose: mix(rest(profession), LOOK_UP, ramp(t, 0.04, 0.14)), ahead: 0, lift: 0 }
    if (t < 0.62) return { pose: mix(LOOK_UP, rest(profession), ramp(t, 0.36, 0.44)), ahead: -14 * Math.sin(Math.PI * ramp(t, 0.52, 0.6)), lift: 0 }
    return { pose: mix(rest(profession), MAP, ramp(t, 0.62, 0.7)), ahead: 0, lift: 0 }
  },
  reply: (stage) => {
    const satellite = fx(stage, 'satellite')
    const voice = voiceWriter(stage, 'voice')
    const robot = fx(stage, 'robot')
    const wrap = fx(stage, 'map-wrap')
    const map = fx(stage, 'map')
    const pins = PINS.map((_, i) => fx(stage, `pin-${i}`))
    return (t) => {
      const cross = ramp(t, 0.06, 0.34)
      transformTo(satellite, `translate(${(SKY.from.x + (SKY.to.x - SKY.from.x) * cross).toFixed(1)} ${(SKY.from.y + (SKY.to.y - SKY.from.y) * cross).toFixed(1)})`)
      fadeTo(satellite, cross > 0 ? 1 : 0)
      // the voice pulses in time with the satellite's light while it crosses
      voice(t, ramp(t, 0.04, 0.08) * (1 - ramp(t, 0.36, 0.42)))
      const roll = ramp(t, 0.38, 0.52)
      const bump = Math.sin(Math.PI * ramp(t, 0.52, 0.6))
      transformTo(robot, `translate(${(ROBOT.from + (ROBOT.at - ROBOT.from) * roll - 20 * bump).toFixed(1)} ${(-12 * bump).toFixed(1)}) scale(0.85)`)
      fadeTo(wrap, ramp(t, 0.64, 0.68))
      transformTo(map, `scale(${ramp(t, 0.64, 0.76).toFixed(3)} 1)`)
      pins.forEach((pin, i) => fadeTo(pin, ramp(t, 0.78 + 0.03 * i, 0.8 + 0.03 * i)))
    }
  },
})
