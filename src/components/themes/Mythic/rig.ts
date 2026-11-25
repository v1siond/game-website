
// His joints and every move he makes, as plain data, so the figure, its test and the scenes all read one
// source. He is drawn in three quarter profile facing right: the near arm (the axe hand) in front of the
// chest, the far arm behind it, both swinging forward and back in the picture plane. Every limb
// is drawn hanging straight down and the pose turns it round its joint, in degrees, clockwise on screen
// (y grows down):
// - shoulder and hip: negative swings the limb forward (towards +x), -180 is straight up;
// - elbow: the forearm turns relative to the upper arm and folds only forward, so it stays in [-160, 0];
// - knee: the shin turns relative to the thigh and folds only back, so it stays in [0, 155];
// - chest: leans forward when positive; head: tips the chin down when positive.
// The figure's feet stay on the floor on their own (planted), unless a key lifts him with `y`. The scenes pose him
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

export type Move =
  | 'walk'
  | 'torch'
  | 'gather'
  | 'give'
  | 'reel'
  | 'shove'
  | 'throw'
  | 'catch'
  | 'stoop'
  | 'row'
  | 'raise'
  | 'see'
  | 'haul'
  | 'chop'
  | 'heave'
  | 'drum'
  | 'clinch'
  | 'knee'
  | 'elbow'
  | 'kneel'

/** A key: when it falls in the move (0 to 1) and the joints it changes; the others hold from the key before. */
export interface Key {
  at: number
  pose: Partial<Pose>
}

interface MoveSpec {
  keys: (rest: Pose) => Key[]
}

const LEGS_SET = { thighNear: -16, shinNear: 8, thighFar: 14, shinFar: 10 }

// The clinch: both hands round the head before him, the chest in.
const CLINCH: Partial<Pose> = { armNear: -120, foreNear: -70, armFar: -115, foreFar: -75, chest: 14, head: 6, thighNear: -24, shinNear: 16, thighFar: 14, shinFar: 10 }

const ZERO: Pose = { chest: 0, head: 0, armFar: 0, foreFar: 0, armNear: 0, foreNear: 0, thighFar: 0, shinFar: 0, thighNear: 0, shinNear: 0, x: 0, y: 0 }

// How he stands: the axe held low and forward with the elbow bent, the far hand loose before the
// chest, the knees a little bent.
export const REST: Pose = { ...ZERO, ...LEGS_SET, chest: 6, head: -4, armNear: -25, foreNear: -55, armFar: -30, foreFar: -70 }

const back = (rest: Pose): Key => ({ at: 1, pose: rest })

export const MOVES: Record<Move, MoveSpec> = {
  // the stride: each leg reaches forward straight and swings back bent, the axe arm counter swinging
  walk: {
    keys: (r) => [
      { at: 0, pose: { thighNear: -24, shinNear: 6, thighFar: 22, shinFar: 16, armNear: r.armNear + 16 } },
      { at: 0.25, pose: { thighNear: 0, shinNear: 6, thighFar: 2, shinFar: 55 } },
      { at: 0.5, pose: { thighNear: 22, shinNear: 16, thighFar: -24, shinFar: 6, armNear: r.armNear - 16 } },
      { at: 0.75, pose: { thighNear: 2, shinNear: 55, thighFar: 0, shinFar: 6 } },
      { at: 1, pose: { thighNear: -24, shinNear: 6, thighFar: 22, shinFar: 16, armNear: r.armNear + 16 } },
    ],
  },
  // the torch set to the pyre: he leans in, the near arm down and forward to the wood, and holds it there
  torch: {
    keys: () => [
      { at: 0, pose: {} },
      { at: 0.5, pose: { armNear: -60, foreNear: -20, chest: 16, head: 6, thighNear: -30, shinNear: 30 } },
      { at: 1, pose: { armNear: -60, foreNear: -20, chest: 16, head: 6, thighNear: -30, shinNear: 30 } },
    ],
  },
  // the gathering: down on his heels by the cold pyre, the near hand sweeps the ash in to the far hand
  gather: {
    keys: () => [
      { at: 0, pose: {} },
      { at: 0.35, pose: { chest: 30, head: 10, thighNear: -75, shinNear: 95, thighFar: -20, shinFar: 90, armNear: -20, foreNear: -40, armFar: -10, foreFar: -50 } },
      { at: 0.7, pose: { armNear: 10, foreNear: -20 } },
      { at: 1, pose: { armNear: -30, foreNear: -70 } },
    ],
  },
  // the handing over: the near arm held out at the chest, the pouch in the hand, the head bowed to her
  give: {
    keys: () => [
      { at: 0, pose: {} },
      { at: 0.5, pose: { armNear: -80, foreNear: -30, chest: 8, head: 8 } },
      { at: 1, pose: { armNear: -80, foreNear: -30, chest: 8, head: 8 } },
    ],
  },
  // struck: the chest and the head thrown back, the arms loose, a step back, then he gathers himself
  reel: {
    keys: () => [
      { at: 0, pose: {} },
      { at: 0.3, pose: { chest: -20, head: -24, armNear: 20, foreNear: -60, armFar: 30, foreFar: -40, x: -30 } },
      { at: 1, pose: { chest: -6, head: -8, armNear: -25, foreNear: -55, armFar: -30, foreFar: -70, x: -20 } },
    ],
  },
  // the shove: both hands drawn in to the chest, then driven forward with the weight behind them, held
  shove: {
    keys: () => [
      { at: 0, pose: {} },
      { at: 0.35, pose: { armNear: -30, foreNear: -110, armFar: -30, foreFar: -110, chest: -4, x: -10 } },
      { at: 0.6, pose: { armNear: -88, foreNear: -6, armFar: -84, foreFar: -8, chest: 24, thighNear: -40, shinNear: 30, thighFar: 24, shinFar: 6, x: 30 } },
      { at: 1, pose: { armNear: -88, foreNear: -6, armFar: -84, foreFar: -8, chest: 24, thighNear: -40, shinNear: 30, thighFar: 24, shinFar: 6, x: 30 } },
    ],
  },
  // the axe throw: wound back over the near shoulder, then whipped forward and let go at arm's length, the
  // weight on the near leg, the arm held out after it
  throw: {
    keys: () => [
      { at: 0, pose: {} },
      { at: 0.45, pose: { armNear: -200, foreNear: -70, chest: -10, head: -6, thighNear: -20, shinNear: 10 } },
      { at: 0.65, pose: { armNear: -80, foreNear: -8, chest: 18, thighNear: -36, shinNear: 26, thighFar: 20, shinFar: 8 } },
      { at: 1, pose: { armNear: -80, foreNear: -8, chest: 18, thighNear: -36, shinNear: 26, thighFar: 20, shinFar: 8 } },
    ],
  },
  // the recall: the near hand held out open for the axe, the jolt as it lands in the palm, back to his guard
  catch: {
    keys: (r) => [
      { at: 0, pose: { armNear: -80, foreNear: -8, chest: 18, thighNear: -36, shinNear: 26, thighFar: 20, shinFar: 8 } },
      { at: 0.4, pose: { armNear: -95, foreNear: -12, chest: -2, head: -6, thighNear: -20, shinNear: 12, thighFar: 16, shinFar: 8 } },
      { at: 0.75, pose: { armNear: -70, foreNear: -40, chest: -10, head: -10, x: -8 } },
      back(r),
    ],
  },
  // the stoop: bent low at the waist and the knees to pass under the raised gate, held while he goes
  stoop: {
    keys: () => [
      { at: 0, pose: {} },
      { at: 0.5, pose: { chest: 34, head: 12, thighNear: -60, shinNear: 80, thighFar: -5, shinFar: 70 } },
      { at: 1, pose: { chest: 34, head: 12, thighNear: -60, shinNear: 80, thighFar: -5, shinFar: 70 } },
    ],
  },
  // a stroke of the oars sat in the boat: the arms reach forward with the chest, then pull back to the chest
  // as he leans back, and reach again
  row: {
    keys: () => [
      { at: 0, pose: { thighNear: -85, shinNear: 85, thighFar: -80, shinFar: 80, chest: 20, armNear: -80, foreNear: -20, armFar: -75, foreFar: -20 } },
      { at: 0.5, pose: { chest: -12, armNear: -25, foreNear: -110, armFar: -20, foreFar: -110 } },
      { at: 1, pose: { chest: 20, armNear: -80, foreNear: -20, armFar: -75, foreFar: -20 } },
    ],
  },
  // the heft: the new edge lifted straight over his head and held there while he looks it over
  raise: {
    keys: () => [
      { at: 0, pose: {} },
      { at: 0.4, pose: { armNear: -195, foreNear: -8, armFar: -40, foreFar: -60, chest: -8, head: -14 } },
      { at: 1, pose: { armNear: -195, foreNear: -8, armFar: -40, foreFar: -60, chest: -8, head: -14 } },
    ],
  },
  // the vision: he stands in the light, the head up to the walls, the arms fallen at his sides
  see: {
    keys: () => [
      { at: 0, pose: {} },
      { at: 1, pose: { head: -20, chest: -8, armNear: 10, foreNear: -10, armFar: 20, foreFar: -10 } },
    ],
  },
  // the haul: hand over hand down the chain over his head, the chest working with each pull
  haul: {
    keys: () => [
      { at: 0, pose: { armNear: -170, foreNear: -10, armFar: -150, foreFar: -30, chest: -6, head: -14 } },
      { at: 0.5, pose: { armNear: -60, foreNear: -80, armFar: -170, foreFar: -10, chest: 12 } },
      { at: 1, pose: { armNear: -170, foreNear: -10, armFar: -150, foreFar: -30, chest: -6 } },
    ],
  },
  // the chop: the axe up over the near shoulder, then down through the rope with the weight behind it
  chop: {
    keys: () => [
      { at: 0, pose: {} },
      { at: 0.4, pose: { armNear: -205, foreNear: -50, chest: -10 } },
      { at: 0.65, pose: { armNear: -50, foreNear: -6, chest: 26, thighNear: -40, shinNear: 40 } },
      { at: 1, pose: { armNear: -50, foreNear: -6, chest: 26, thighNear: -40, shinNear: 40 } },
    ],
  },
  // the lift: he crouches with his hands under the hearth stone and heaves it up over his head
  heave: {
    keys: () => [
      { at: 0, pose: {} },
      { at: 0.35, pose: { chest: 26, head: 6, armNear: -45, foreNear: -25, armFar: -40, foreFar: -25, thighNear: -60, shinNear: 85, thighFar: -10, shinFar: 75 } },
      { at: 1, pose: { chest: -6, head: -8, armNear: -170, foreNear: -15, armFar: -165, foreFar: -15, thighNear: -14, shinNear: 6, thighFar: 12, shinFar: 8 } },
    ],
  },
  // the rowers' time on the drum: the mallets come down one after the other, twice each
  drum: {
    keys: () => [
      { at: 0, pose: { armNear: -150, foreNear: -60, armFar: -40, foreFar: -90, chest: 4 } },
      { at: 0.25, pose: { armNear: -50, foreNear: -60, armFar: -150, foreFar: -60 } },
      { at: 0.5, pose: { armNear: -150, foreNear: -60, armFar: -40, foreFar: -90 } },
      { at: 0.75, pose: { armNear: -50, foreNear: -60, armFar: -150, foreFar: -60 } },
      { at: 1, pose: { armNear: -150, foreNear: -60, armFar: -40, foreFar: -90 } },
    ],
  },
  // the clinch: both hands up round the head before him, the chest in, the near leg set
  clinch: {
    keys: () => [
      { at: 0, pose: {} },
      { at: 1, pose: CLINCH },
    ],
  },
  // the knee: from the clinch the near knee driven up into him and set down again
  knee: {
    keys: () => [
      { at: 0, pose: CLINCH },
      { at: 0.45, pose: { thighNear: -100, shinNear: 120, chest: -4 } },
      { at: 1, pose: CLINCH },
    ],
  },
  // the falling elbow: the near elbow up high, then down with the whole body behind it, held low
  elbow: {
    keys: () => [
      { at: 0, pose: CLINCH },
      { at: 0.4, pose: { armNear: -190, foreNear: -150, chest: -12, head: -10 } },
      { at: 0.7, pose: { armNear: -70, foreNear: -150, chest: 34, head: 10, thighNear: -80, shinNear: 90, thighFar: 20, shinFar: 110 } },
      { at: 1, pose: { armNear: -70, foreNear: -150, chest: 34, head: 10, thighNear: -80, shinNear: 90, thighFar: 20, shinFar: 110 } },
    ],
  },
  // down on one knee, the far shin flat on the ground, the head bowed
  kneel: {
    keys: () => [
      { at: 0, pose: {} },
      { at: 1, pose: { thighNear: -90, shinNear: 90, thighFar: 10, shinFar: 100, chest: 10, head: 6, armNear: -30, foreNear: -40 } },
    ],
  },
}

/** A move's keys, each one a whole pose (a key carries the joints it leaves alone from the key before). */
export function resolveKeys(move: Move): { at: number; pose: Pose }[] {
  const { keys } = MOVES[move]
  let carried = REST
  return keys(REST).map(({ at, pose }) => {
    carried = { ...carried, ...pose }
    return { at, pose: carried }
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
