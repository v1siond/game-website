
// His joints and every move he makes, as plain data, so the figure, its test and the scenes all read one
// source. He is drawn in three quarter profile facing right: the near arm (the sword hand) in front of the
// chest, the far arm (the shield) behind it, both swinging forward and back in the picture plane. Every limb
// is drawn hanging straight down and the pose turns it round its joint, in degrees, clockwise on screen
// (y grows down):
// - shoulder and hip: negative swings the limb forward (towards +x), -180 is straight up;
// - elbow: the forearm turns relative to the upper arm and folds only forward, so it stays in [-160, 0];
// - knee: the shin turns relative to the thigh and folds only back, so it stays in [0, 155];
// - chest: leans forward when positive; head: tips the chin down when positive.
// The figure's feet stay on the floor on their own (planted), unless a key lifts him with `y`, or the move
// hangs him from his hands (a climb), where the hips stay put and the legs swing free. The scenes pose him
// at a point of a move (poseAt), read off the scroll.

export type Joint =
  | 'chest'
  | 'head'
  | 'armFar'
  | 'foreFar'
  | 'armNear'
  | 'foreNear'
  | 'thighFar'
  | 'shinFar'
  | 'thighNear'
  | 'shinNear'

export const JOINTS: readonly Joint[] = ['chest', 'head', 'armFar', 'foreFar', 'armNear', 'foreNear', 'thighFar', 'shinFar', 'thighNear', 'shinNear']

/** Each joint's pivot in the 160 by 210 viewBox, on the drawing at rest. */
export const PIVOT: Record<Joint, readonly [number, number]> = {
  chest: [88, 116],
  head: [93, 56],
  armFar: [84, 68],
  foreFar: [84, 98],
  armNear: [98, 70],
  foreNear: [98, 102],
  thighFar: [80, 124],
  shinFar: [80, 158],
  thighNear: [92, 124],
  shinNear: [92, 158],
}

/** The anatomical range of each joint, the test's and the reader's guarantee that no limb bends backwards. */
export const RANGE: Record<Joint, readonly [number, number]> = {
  chest: [-25, 35],
  head: [-30, 25],
  armFar: [-215, 75],
  armNear: [-215, 75],
  foreFar: [-160, 0],
  foreNear: [-160, 0],
  thighFar: [-115, 60],
  thighNear: [-115, 60],
  shinFar: [0, 155],
  shinNear: [0, 155],
}

const THIGH_LENGTH = 34
const SHIN_LENGTH = 34
const ANKLE_REST_Y = PIVOT.shinNear[1] + SHIN_LENGTH

export type Angles = Record<Joint, number>

/** A pose: the angles, plus a lift (negative y is up) and a step forward. */
export interface Pose extends Angles {
  x: number
  y: number
}

export type Move = 'walk' | 'combo' | 'launch' | 'slam' | 'parry' | 'dodge' | 'bash' | 'raise' | 'finisher' | 'heave' | 'hurl' | 'climb'

/** A key: when it falls in the move (0 to 1) and the joints it changes; the others hold from the key before. */
export interface Key {
  at: number
  pose: Partial<Pose>
}

interface MoveSpec {
  keys: (rest: Pose) => Key[]
  // hung from the hands: the planted drop is cancelled, so tucking the knees lifts the feet, not the hips
  hang?: boolean
}

const LEGS_SET = { thighNear: -16, shinNear: 8, thighFar: 14, shinFar: 10 }

const ZERO: Pose = { chest: 0, head: 0, armFar: 0, foreFar: 0, armNear: 0, foreNear: 0, thighFar: 0, shinFar: 0, thighNear: 0, shinNear: 0, x: 0, y: 0 }

// How he stands: the sword held low and forward with the elbow bent, the shield on the far arm before the
// chest, the knees a little bent.
export const REST: Pose = { ...ZERO, ...LEGS_SET, chest: 6, head: -4, armNear: -25, foreNear: -55, armFar: -30, foreFar: -70 }

const back = (rest: Pose): Key => ({ at: 1, pose: rest })

// Hanging on the chain: the near hand straight up on the hold over his head, the far hand on the hold at
// his chest, the chest in to the wall, the knees bent up under him.
const CLIMB_HANG: Partial<Pose> = {
  chest: 10,
  head: -18,
  armNear: -168,
  foreNear: -10,
  armFar: -95,
  foreFar: -70,
  thighNear: -45,
  shinNear: 70,
  thighFar: -20,
  shinFar: 55,
  x: 0,
  y: 0,
}

export const MOVES: Record<Move, MoveSpec> = {
  // the stride: each leg reaches forward straight and swings back bent, the sword arm counter swinging
  walk: {
    keys: (r) => [
      { at: 0, pose: { thighNear: -24, shinNear: 6, thighFar: 22, shinFar: 16, armNear: r.armNear + 16 } },
      { at: 0.25, pose: { thighNear: 0, shinNear: 6, thighFar: 2, shinFar: 55 } },
      { at: 0.5, pose: { thighNear: 22, shinNear: 16, thighFar: -24, shinFar: 6, armNear: r.armNear - 16 } },
      { at: 0.75, pose: { thighNear: 2, shinNear: 55, thighFar: 0, shinFar: 6 } },
      { at: 1, pose: { thighNear: -24, shinNear: 6, thighFar: 22, shinFar: 16, armNear: r.armNear + 16 } },
    ],
  },
  // the string: a cut over the head and down, the shield driven in, then the sword over the head again and
  // the last cut down with the weight behind it
  combo: {
    keys: (r) => [
      { at: 0, pose: {} },
      { at: 0.14, pose: { armNear: -200, foreNear: -35, chest: -6 } },
      { at: 0.3, pose: { armNear: -55, foreNear: -6, chest: 14, thighNear: -30, shinNear: 22 } },
      { at: 0.46, pose: { armFar: -90, foreFar: -20, chest: 18, armNear: 10, foreNear: -60 } },
      { at: 0.62, pose: { armNear: -205, foreNear: -25, armFar: -30, foreFar: -70, chest: -10 } },
      { at: 0.8, pose: { armNear: -40, foreNear: -6, chest: 26, thighNear: -60, shinNear: 60, thighFar: 20, shinFar: 60 } },
      back(r),
    ],
  },
  // the launcher: low with the sword back, then the cut from the floor to over his head, and up after it
  launch: {
    keys: () => [
      { at: 0, pose: {} },
      { at: 0.3, pose: { armNear: 40, foreNear: -20, chest: 22, thighNear: -55, shinNear: 75, thighFar: -5, shinFar: 60 } },
      { at: 0.55, pose: { armNear: -190, foreNear: -10, chest: -12, head: -14, thighNear: -10, shinNear: 4, thighFar: 10, shinFar: 6 } },
      { at: 1, pose: { armNear: -150, foreNear: -30, chest: -4, thighNear: -40, shinNear: 70, thighFar: 10, shinFar: 90, y: -60 } },
    ],
  },
  // the slam: in the air with the sword over his head, then down on one knee, the sword driven into the floor
  slam: {
    keys: () => [
      { at: 0, pose: { armNear: -195, foreNear: -20, armFar: -60, foreFar: -60, chest: -8, thighNear: -60, shinNear: 80, thighFar: -20, shinFar: 90, y: -60 } },
      { at: 0.55, pose: { armNear: -40, foreNear: -6, chest: 28, thighNear: -80, shinNear: 80, thighFar: 25, shinFar: 110, y: 0 } },
      { at: 1, pose: { armNear: -40, foreNear: -6, chest: 28, thighNear: -80, shinNear: 80, thighFar: 25, shinFar: 110, y: 0 } },
    ],
  },
  // the parry: the shield thrust out before him, braced, then back to his guard
  parry: {
    keys: (r) => [
      { at: 0, pose: {} },
      { at: 0.3, pose: { armFar: -95, foreFar: -45, chest: -6, thighNear: -28, shinNear: 18, thighFar: 22, shinFar: 6 } },
      { at: 0.7, pose: { armFar: -95, foreFar: -45, chest: -6, thighNear: -28, shinNear: 18, thighFar: 22, shinFar: 6 } },
      back(r),
    ],
  },
  // the dodge: down and back out of the blow, then up and in with the counter cut
  dodge: {
    keys: (r) => [
      { at: 0, pose: {} },
      { at: 0.35, pose: { chest: 32, head: 10, thighNear: -70, shinNear: 100, thighFar: -10, shinFar: 90, armNear: 20, foreNear: -60, x: -40 } },
      { at: 0.65, pose: { chest: 18, armNear: -70, foreNear: -4, thighNear: -40, shinNear: 30, thighFar: 20, shinFar: 10, x: 10 } },
      back(r),
    ],
  },
  // the shield bash: the shield driven forward and up from the hip while he hangs on with the sword hand
  bash: {
    keys: (r) => [
      { at: 0, pose: {} },
      { at: 0.4, pose: { armFar: -120, foreFar: -20, chest: -10, head: -10 } },
      back(r),
    ],
  },
  // the gift: the sword raised straight over his head and held there while the light comes down into it
  raise: {
    keys: () => [
      { at: 0, pose: {} },
      { at: 0.4, pose: { armNear: -195, foreNear: -8, armFar: -40, foreFar: -60, chest: -8, head: -14 } },
      { at: 1, pose: { armNear: -195, foreNear: -8, armFar: -40, foreFar: -60, chest: -8, head: -14 } },
    ],
  },
  // the finisher: the long wind up over the back, then one strike down to the floor, held
  finisher: {
    keys: () => [
      { at: 0, pose: {} },
      { at: 0.4, pose: { armNear: -210, foreNear: -60, armFar: 20, foreFar: -50, chest: -14, head: -10, thighNear: -30, shinNear: 30 } },
      { at: 0.6, pose: { armNear: -40, foreNear: -4, armFar: 30, foreFar: -40, chest: 30, thighNear: -75, shinNear: 70, thighFar: 25, shinFar: 100 } },
      { at: 1, pose: { armNear: -40, foreNear: -4, armFar: 30, foreFar: -40, chest: 30, thighNear: -75, shinNear: 70, thighFar: 25, shinFar: 100 } },
    ],
  },
  // the grab: he crouches with his hands under the foe and heaves it up over his head
  heave: {
    keys: () => [
      { at: 0, pose: {} },
      { at: 0.35, pose: { chest: 26, head: 6, armNear: -45, foreNear: -25, armFar: -40, foreFar: -25, thighNear: -60, shinNear: 85, thighFar: -10, shinFar: 75 } },
      { at: 1, pose: { chest: -6, head: -8, armNear: -170, foreNear: -15, armFar: -165, foreFar: -15, thighNear: -14, shinNear: 6, thighFar: 12, shinFar: 8 } },
    ],
  },
  // the throw: from over his head, the arms come down and forward and let go, the weight on the near leg
  hurl: {
    keys: (r) => [
      { at: 0, pose: { chest: -6, head: -8, armNear: -170, foreNear: -15, armFar: -165, foreFar: -15, thighNear: -14, shinNear: 6, thighFar: 12, shinFar: 8 } },
      { at: 0.4, pose: { armNear: -70, foreNear: -6, armFar: -60, foreFar: -10, chest: 20, thighNear: -30, shinNear: 20 } },
      back(r),
    ],
  },
  // one reach up the chain: the near hand high on the hold above, the far hand at the chest; he pulls on
  // the near arm and the far hand reaches past it, then the knees come up and he hangs as he started, one
  // hold higher (the scene lifts him by the hold's height over the move)
  climb: {
    hang: true,
    keys: () => [
      { at: 0, pose: { ...CLIMB_HANG } },
      { at: 0.4, pose: { chest: 14, head: -12, armNear: -110, foreNear: -95, armFar: -168, foreFar: -12, thighNear: -30, shinNear: 50, thighFar: -10, shinFar: 30 } },
      { at: 0.7, pose: { chest: 8, armNear: -150, foreNear: -40, armFar: -120, foreFar: -60, thighNear: -70, shinNear: 95, thighFar: -40, shinFar: 80 } },
      { at: 1, pose: { ...CLIMB_HANG } },
    ],
  },
}

/** A move's keys, each one a whole pose (a key carries the joints it leaves alone from the key before). */
export function resolveKeys(move: Move): { at: number; pose: Pose }[] {
  const { keys, hang = false } = MOVES[move]
  let carried = REST
  return keys(REST).map(({ at, pose }) => {
    carried = { ...carried, ...pose }
    return { at, pose: hang ? hung(carried) : carried }
  })
}

const ankleY = (hipY: number, thigh: number, shin: number): number => {
  const rad = Math.PI / 180
  return hipY + THIGH_LENGTH * Math.cos(thigh * rad) + SHIN_LENGTH * Math.cos((thigh + shin) * rad)
}

/** How far down the figure moves so the lower ankle stays on the floor whatever the legs do. */
export function plantedDrop(pose: Pose): number {
  const lowest = Math.max(ankleY(PIVOT.thighNear[1], pose.thighNear, pose.shinNear), ankleY(PIVOT.thighFar[1], pose.thighFar, pose.shinFar))
  return ANKLE_REST_Y - lowest
}

/** A pose hung from the hands: its lift cancels the planted drop, so the hips hold still whatever the legs do. */
function hung(pose: Pose): Pose {
  return { ...pose, y: pose.y - plantedDrop(pose) }
}

const ease = (t: number): number => t * t * (3 - 2 * t)
const POSE_KEYS = [...JOINTS, 'x', 'y'] as const

/** His pose at `t` (0 to 1, held past either end) through a move: between the two keys around it, eased. */
export function poseAt(move: Move, t: number): Pose {
  const keys = resolveKeys(move)
  const clamped = Math.min(1, Math.max(0, t))
  const next = keys.findIndex(({ at }) => at >= clamped)
  if (next <= 0) return keys[0].pose
  const [from, to] = [keys[next - 1], keys[next]]
  const k = ease((clamped - from.at) / (to.at - from.at))
  return Object.fromEntries(POSE_KEYS.map((key) => [key, from.pose[key] + (to.pose[key] - from.pose[key]) * k])) as unknown as Pose
}

/** The SVG transform that sets one joint in a pose, as an attribute (the drawing's own coordinates). */
export function jointTransform(joint: Joint, angle: number): string {
  const [x, y] = PIVOT[joint]
  return `rotate(${angle} ${x} ${y})`
}

/** The SVG transform that lifts and steps the whole figure, keeping the feet planted. */
export function bodyTransform(pose: Pose): string {
  return `translate(${pose.x} ${plantedDrop(pose) + pose.y})`
}
