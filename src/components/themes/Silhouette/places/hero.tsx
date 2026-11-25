import { mix } from '@/lib/motion/rigPose'
import type { Profession } from '@/lib/cv/professions'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, translateTo } from '../../shared/stageNodes'
import { SHADE } from '../palette'
import { runFrame, type Frame, type Place } from '../place'
import { LYING, RISING, SITTING_UP, rest } from '../pose'

// Beat 1, the forest's edge at first light, where the game opens: he lies in the grass on the ground, his
// eyes open and blink, he sits up and gets to his feet, and he runs right out of the grass as the camera
// starts to follow him, while the mist lying on the grass lifts. Scrolling back lays him down again;
// reduced motion shows him standing at the hold, awake.

const MIST_W = 900

/** His frame waking: lying, sitting up, standing, then the run to the hold. */
function move(profession: Profession, t: number, length: number): Frame {
  if (t < 0.6) {
    const up = t < 0.45 ? mix(LYING, SITTING_UP, ramp(t, 0.3, 0.45)) : mix(SITTING_UP, RISING, ramp(t, 0.45, 0.53))
    const pose = t < 0.53 ? up : mix(RISING, rest(profession), ramp(t, 0.53, 0.6))
    // lying, his body laid along the ground: lowered so his back rests on it
    return { pose, ahead: 0, lift: -4 * (1 - ramp(t, 0.3, 0.45)), over: 0 }
  }
  return runFrame(profession, 0, length, ramp(t, 0.62, 1))
}

/** His eyes over the wake: shut, open, a blink, open. */
const eyesAt = (t: number): number => ramp(t, 0.08, 0.12) - ramp(t, 0.17, 0.19) + ramp(t, 0.21, 0.24)

export const hero: Place = {
  region: 'forest',
  length: 260,
  script: [1400, 1300, 1600],
  ends: [0.3, 0.6, 1],
  obstacle: () => (
    <g data-fx="mist" fill={SHADE.glow}>
      <rect x={-MIST_W / 2} y={-46} width={MIST_W} height={50} opacity={0.2} rx={25} />
      <rect x={-MIST_W / 3} y={-22} width={(MIST_W * 2) / 3} height={26} opacity={0.25} rx={13} />
    </g>
  ),
  move,
  reply: (stage) => {
    const mist = fx(stage, 'mist')
    const eyes = fx(stage, 'eyes')
    return (t) => {
      translateTo(mist, 220 * ramp(t, 0.2, 1), -30 * ramp(t, 0.2, 1))
      fadeTo(mist, 1 - ramp(t, 0.35, 0.9))
      fadeTo(eyes, eyesAt(t))
    }
  },
}
