import { mix } from '@/lib/motion/rigPose'
import type { Profession } from '@/lib/cv/professions'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, translateTo } from '../../shared/stageNodes'
import { FLOOR, Hut } from '../forest'
import { SHADE, type Light } from '../palette'
import { runFrame, type Frame, type Place } from '../place'
import { LOOK, LYING, RISING, SITTING_UP, rest } from '../pose'

// The hero, the forest's edge at first light, where the game opens and the search begins: he lies in the
// grass with only his eyes lit, nothing moving for a beat; his eyes open and he gets up, one knee then
// standing; he walks a few steps out of the grass and stops, looking at the one lit window far off on a hill,
// which brightens as he looks. Scrolling back lays him down again; reduced motion shows him standing at the
// hold, looking at the window.

const MIST_W = 900
// The hill and the window far off in the fog, right of where the camera holds him.
const HILL = { x: 1380, top: 540, w: 360 }

/** His frame waking: still, then sitting up and standing, then the few steps and the look. */
function move(profession: Profession, t: number, length: number): Frame {
  if (t < 0.6) {
    const up = t < 0.45 ? mix(LYING, SITTING_UP, ramp(t, 0.3, 0.45)) : mix(SITTING_UP, RISING, ramp(t, 0.45, 0.53))
    const pose = t < 0.53 ? up : mix(RISING, rest(profession), ramp(t, 0.53, 0.6))
    // lying, his body laid along the ground: lowered so his back rests on it
    return { pose, ahead: 0, lift: -4 * (1 - ramp(t, 0.3, 0.45)), over: 0 }
  }
  const look = ramp(t, 0.86, 0.94)
  if (look > 0) return { pose: mix(rest(profession), LOOK, look), ahead: length, lift: 0, over: 0 }
  return runFrame(profession, 0, length, ramp(t, 0.62, 0.86))
}

/** His eyes over the wake: shut through the still beat, open, a blink, open. */
const eyesAt = (t: number): number => ramp(t, 0.14, 0.18) - ramp(t, 0.22, 0.24) + ramp(t, 0.26, 0.29)

export const hero: Place = {
  region: 'forest',
  length: 260,
  script: [1500, 1300, 1700],
  ends: [0.3, 0.6, 1],
  obstacle: () => (
    <g data-fx="mist" fill={SHADE.glow}>
      <rect x={-MIST_W / 2} y={-46} width={MIST_W} height={50} opacity={0.2} rx={25} />
      <rect x={-MIST_W / 3} y={-22} width={(MIST_W * 2) / 3} height={26} opacity={0.25} rx={13} />
    </g>
  ),
  distant: ({ light }: { light: Light }) => (
    <g>
      <path d={`M${HILL.x - HILL.w} ${FLOOR - 20} Q${HILL.x - 40} ${HILL.top - 30} ${HILL.x + HILL.w} ${FLOOR - 20} Z`} fill={light.mid} opacity={0.8} />
      <g transform={`translate(${HILL.x} ${HILL.top + 14})`}>
        <Hut name="far-hut" w={48} fill={light.mid} />
      </g>
      <circle data-fx="far-glow" cx={HILL.x + 10} cy={HILL.top - 30} r={34} fill={SHADE.sun} opacity={0.15} />
    </g>
  ),
  move,
  reply: (stage) => {
    const mist = fx(stage, 'mist')
    const eyes = fx(stage, 'eyes')
    const glow = fx(stage, 'far-glow')
    return (t) => {
      translateTo(mist, 220 * ramp(t, 0.3, 1), -30 * ramp(t, 0.3, 1))
      fadeTo(mist, 1 - ramp(t, 0.4, 0.9))
      fadeTo(eyes, eyesAt(t))
      fadeTo(glow, 0.15 + 0.55 * ramp(t, 0.86, 1))
    }
  },
}
