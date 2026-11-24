import { mix } from '@/lib/motion/rigPose'
import type { Profession } from '@/lib/cv/professions'
import { ramp } from '@/lib/scroll/stage'
import { setRigPose } from '../../shared/rig'
import { fadeTo, fx, translateTo } from '../../shared/stageNodes'
import { FLOOR, W } from '../forest'
import { SHADE } from '../palette'
import { START, type Scene } from '../place'
import { LYING, RISING, SITTING_UP, rest, shadeJoints } from '../pose'

// The hero: the tall grass at the forest's edge, where he wakes, the way the game opens. His figure stands
// in the hero itself, with the outfit plate, and the scene's writer poses it there too: as the page starts
// to scroll he lies in the grass, his eyes open and blink, he sits up, gets his feet under him and stands,
// while the fog lying on the grass lifts and drifts off and the first light comes up through the trees.
// Scrolling back lays him down again; reduced motion shows him standing, awake.

// Blades of grass along the floor, each its x and height.
const GRASS = Array.from({ length: 64 }, (_, i) => [i * 25 + ((i * 37) % 13), 30 + ((i * 53) % 46)] as const)

/** The grass, black against the light. */
function Grass() {
  return <path d={GRASS.map(([x, h]) => `M${x - 5} ${FLOOR} L${x} ${FLOOR - h} L${x + 5} ${FLOOR}`).join(' ')} fill={SHADE.black} />
}

/** His pose waking at t: lying, sitting up, rising to his feet, standing in his kit. */
function wakeAt(profession: Profession, t: number) {
  if (t < 0.55) return mix(LYING, SITTING_UP, ramp(t, 0.3, 0.55))
  if (t < 0.78) return mix(SITTING_UP, RISING, ramp(t, 0.55, 0.78))
  return mix(RISING, rest(profession), ramp(t, 0.78, 1))
}

/** His eyes over the wake: shut, open, a blink, open. */
const eyesAt = (t: number): number => ramp(t, 0.08, 0.12) - ramp(t, 0.16, 0.18) + ramp(t, 0.2, 0.23)

export const hero: Scene = {
  script: [2600],
  floor: () => (
    <>
      <g data-fx="mist">
        <rect x={0} y={FLOOR - 120} width={W} height={130} fill={SHADE.glow} opacity={0.22} />
        <rect x={0} y={FLOOR - 60} width={W} height={70} fill={SHADE.glow} opacity={0.25} />
      </g>
      <Grass />
      <circle data-fx="dawn" cx={1200} cy={FLOOR - 260} r={240} fill={SHADE.glow} opacity="0" />
    </>
  ),
  bind: (stage, { profession }) => {
    const mist = fx(stage, 'mist')
    const dawn = fx(stage, 'dawn')
    // his figure in the hero, next to the outfit plate, outside the stage
    const figure = document.querySelector('[data-scene="hero"] [data-worlds-figure]')
    const joints = figure ? shadeJoints(figure) : null
    const eyes = figure ? fx(figure, 'eyes') : null
    return (_progress, _reached, play = START) => {
      const t = play.t
      translateTo(mist, 260 * t, -60 * t)
      fadeTo(mist, 1 - ramp(t, 0.4, 1))
      fadeTo(dawn, 0.12 * ramp(t, 0.5, 1))
      if (joints) setRigPose(joints, wakeAt(profession, t))
      fadeTo(eyes, eyesAt(t))
    }
  },
}
