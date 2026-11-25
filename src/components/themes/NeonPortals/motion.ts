import { bell, lerp } from '../shared/stageNodes'
import { READY, REST, spin, type SidePose } from './sidePose'
import { smooth } from './world'

// His moves as numbers, for the runner (runner.tsx): the front and back body's pose, his side on pose
// (sidePose.ts) and his yaw, the way he faces. The way he moves on the screen picks the view: running into
// the screen shows his back, running at the camera his front, across the screen his side, and a spin turns
// him round in depth through all of them. The tunnel between eras shows him from behind; each era's set piece
// (sets/) builds its own moves from the same pieces. Nothing here keeps time: every value is a function of
// the camera's depth or a scene's playhead.

export const POSE_KEYS = ['jump', 'lean', 'spin', 'liftL', 'bendL', 'rotL', 'liftR', 'bendR', 'rotR', 'aL', 'sL', 'fL', 'aR', 'sR', 'fR', 'sticks', 'wave', 'board', 'boulder'] as const

/** The front and back body's numbers, the same for both: a run seen from behind and from the front lifts the
 *  same knees and swings the same arms. `board` shows the hover board under his feet, `boulder` how close the
 *  rolling boulder behind him has come (0 to 1). */
export type Pose = Record<(typeof POSE_KEYS)[number], number>

export const IDLE: Pose = { jump: 0, lean: 0, spin: 1, liftL: 0, bendL: 1, rotL: 3, liftR: 0, bendR: 1, rotR: -3, aL: 10, sL: 1, fL: 0, aR: -10, sR: 1, fR: 0, sticks: 0, wave: 0, board: 0, boulder: 0 }

export const mixPose = (a: Pose, b: Pose, t: number): Pose => Object.fromEntries(POSE_KEYS.map((key) => [key, lerp(a[key], b[key], t)])) as Pose

/** The way he faces, in degrees: from behind (into the screen), side on facing right, his front (at the
 *  camera), side on facing left. Any multiple of a whole turn faces the same way. */
export const YAW = { back: 0, right: 90, front: 180, left: -90 } as const

/** The runner whole: the front and back body's pose, his side on pose and his yaw. */
export interface Move {
  pose: Pose
  side: SidePose
  yaw: number
}

export const fromBehind = (pose: Pose): Move => ({ pose, side: REST, yaw: YAW.back })

export const fromFront = (pose: Pose, yaw: number = YAW.front): Move => ({ pose, side: REST, yaw })

/** Side on, `yaw` YAW.right or YAW.left (or a little toward the camera from either), `jump` lifting him. */
export const sideOn = (side: SidePose, yaw: number, jump = 0): Move => ({ pose: { ...IDLE, jump }, side, yaw })

/** The run at `phase` (a whole stride per 2π), front or back: the lifted leg shortens toward the camera,
 *  the opposite arm swings forward. */
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
  }
}

/** Seated on a ride: knees up, both gloves forward on the bars. */
export const RIDE: Pose = { ...IDLE, jump: -6, liftL: 30, bendL: 0.6, rotL: 14, liftR: 30, bendR: 0.6, rotR: -14, aL: 34, sL: 0.75, fL: -40, aR: -34, sR: 0.75, fR: 40 }

/** The knees tucked under him in the air, the arms thrown up. */
export const tucked = (height: number): Pose => ({ ...IDLE, jump: -height, liftL: 40, bendL: 0.5, liftR: 40, bendR: 0.5, aL: 150, fL: 30, aR: -150, fR: -30 })

/** Both gloves held high over his head: the trophy, the cheer. */
export const CHEER: Pose = { ...IDLE, aL: 160, sL: 1, fL: -20, aR: -160, sR: 1, fR: 20 }

/** The ready stance: knees bent (the shins shortened, the body let down onto them), the gloves up. */
export const GUARD: Pose = { ...IDLE, jump: 10, bendL: 0.82, bendR: 0.82, rotL: 8, rotR: -8, aL: 28, fL: -115, aR: -28, fR: 115 }

/** The arms flung out level, for the spin. */
const FLUNG: Pose = { ...IDLE, aL: 92, fL: -6, aR: -92, fR: 6 }

/**
 * The tornado spin, `t` of the way: `turns` whole turns round in depth from `yaw` (back, side, front, side, and
 * on), the arms flung out and the whirl round him, rising `rise` at the middle. It ends facing the way it began.
 */
export function spinning(t: number, turns: number, yaw: number, rise = 0, from: SidePose = READY): Move {
  const out = bell(t, 0, 1)
  return { pose: { ...mixPose(IDLE, FLUNG, out), jump: -rise * out }, side: spin(t, from), yaw: yaw + 360 * turns * smooth(0, 1, t) }
}

/** The victory dance from the front at `phase`: the gloves waving over his head in turn, the hips and knees
 *  swinging with them. */
export function danceFront(phase: number): Pose {
  const swing = Math.sin(Math.PI * phase)
  return {
    ...IDLE,
    jump: -8 * Math.abs(swing),
    lean: 7 * swing,
    aL: 140 + 25 * swing,
    fL: -30,
    aR: -140 + 25 * swing,
    fR: 30,
    liftL: 22 * Math.max(0, swing),
    bendL: 1 - 0.35 * Math.max(0, swing),
    liftR: 22 * Math.max(0, -swing),
    bendR: 1 - 0.35 * Math.max(0, -swing),
  }
}

/** In the hub he stands facing the camera, then turns round (front, side, back) and breaks into a run into
 *  the screen as the camera dives through the ring. */
export function hubRunner(camZ: number): Move {
  const go = smooth(120, 520, camZ)
  return { pose: mixPose(IDLE, runPose(camZ / 46), go), side: READY, yaw: lerp(YAW.front - 20, YAW.back, go) }
}

/** Between eras, in the machine's passage: the run into the screen, from behind. */
export const transitRunner = (camZ: number): Move => fromBehind(runPose(camZ / 46))
