import { mix as mixRig } from '@/lib/motion/rigPose'
import { AIR, BOUNCE, READY, REST, type SidePose } from './sidePose'
import { smooth } from './world'
import { bell, lerp } from '../shared/stageNodes'

// His moves as numbers, for the runner (runner.tsx): the back view's pose, his side on pose (sidePose.ts) and
// which way the side view faces. The tunnel between eras shows him from behind, running into the screen;
// each era's set piece (sets/) builds its own moves from the same pieces. Nothing here keeps time: every
// value is a function of the camera's depth or a scene's playhead.

export const POSE_KEYS = ['jump', 'lean', 'spin', 'liftL', 'bendL', 'rotL', 'liftR', 'bendR', 'rotR', 'aL', 'sL', 'fL', 'aR', 'sR', 'fR', 'sticks', 'wave', 'look', 'board', 'boulder'] as const

/** The back view's numbers. `look` is how far he has turned from the back view to show himself side on
 *  (0 from behind, 1 side on, runner.tsx turns him); `board` shows the hover board under his feet,
 *  `boulder` how close the rolling boulder behind him has come (0 to 1). */
export type Pose = Record<(typeof POSE_KEYS)[number], number>

export const IDLE: Pose = { jump: 0, lean: 0, spin: 1, liftL: 0, bendL: 1, rotL: 3, liftR: 0, bendR: 1, rotR: -3, aL: 10, sL: 1, fL: 0, aR: -10, sR: 1, fR: 0, sticks: 0, wave: 0, look: 1, board: 0, boulder: 0 }

export const mixPose = (a: Pose, b: Pose, t: number): Pose => Object.fromEntries(POSE_KEYS.map((key) => [key, lerp(a[key], b[key], t)])) as Pose

/** The runner whole: the back view's pose, his side on pose (sidePose.ts) and which way the side view faces,
 *  its sign the way (1 right, -1 left) and its size how square to the screen he stands (1 profile, under 1 a
 *  three quarter turn toward the camera). */
export interface Move {
  pose: Pose
  side: SidePose
  facing: number
}

/** Turned three quarters toward the camera, as he stands in the hub and runs at the viewer. */
export const THREE_QUARTER = 0.8

export const fromBehind = (pose: Pose): Move => ({ pose: { ...pose, look: 0 }, side: REST, facing: 1 })

export const sideOn = (side: SidePose, facing: number, jump = 0): Move => ({ pose: { ...IDLE, jump, look: 1 }, side, facing })

/** The back view run at `phase` (a whole stride per 2π): the lifted leg shortens toward the camera, the
 *  opposite arm swings forward. */
export function runPose(phase: number): Pose {
  const left = Math.max(0, Math.sin(phase))
  const right = Math.max(0, Math.sin(phase + Math.PI))
  return {
    ...IDLE,
    jump: -10 * Math.abs(Math.sin(phase)),
    lean: 2 * Math.sin(phase),
    liftL: 36 * left,
    bendL: 1 - 0.5 * left,
    liftR: 36 * right,
    bendR: 1 - 0.5 * right,
    aL: 14,
    sL: 1 - 0.3 * right,
    fL: -55 * right,
    aR: -14,
    sR: 1 - 0.3 * left,
    fR: 55 * left,
    wave: phase,
    look: 0,
  }
}

/** From behind, seated on a ride: knees up, both gloves forward on the bars. */
export const RIDE: Pose = { ...IDLE, jump: -6, liftL: 30, bendL: 0.6, rotL: 14, liftR: 30, bendR: 0.6, rotR: -14, aL: 34, sL: 0.75, fL: -40, aR: -34, sR: 0.75, fR: 40, look: 0 }

/** From behind, the knees tucked under him in the air, the arms thrown up. */
export const tucked = (height: number): Pose => ({ ...IDLE, jump: -height, liftL: 40, bendL: 0.5, liftR: 40, bendR: 0.5, aL: 150, fL: 30, aR: -150, fR: -30, look: 0 })

/** From behind, both gloves held high over his head: the trophy, the cheer. */
export const CHEER: Pose = { ...IDLE, aL: 160, sL: 1, fL: -20, aR: -160, sR: 1, fR: 20, look: 0 }

/** One hop side on, `t` of the way: squashed, stretched up through the air, squashed again as he lands. */
export const hopSide = (t: number): SidePose => mixRig(BOUNCE, AIR, bell(t, 0, 1))

/** In the hub he stands turned three quarters to the camera, then turns and breaks into a run into the
 *  screen as the camera dives through the ring. */
export function hubRunner(camZ: number): Move {
  return { pose: mixPose({ ...IDLE, look: 1 }, runPose(camZ / 46), smooth(120, 520, camZ)), side: READY, facing: -THREE_QUARTER }
}

/** Between eras, in the machine's passage: the run into the screen, from behind. */
export const transitRunner = (camZ: number): Move => fromBehind(runPose(camZ / 46))
