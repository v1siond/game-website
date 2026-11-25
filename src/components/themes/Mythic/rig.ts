
// His joints and every move he makes, as plain data, so the figure, its test and the scenes all read one
// source. He is drawn in three quarter profile facing right: the near arm (a blade in each hand) in front
// of the chest, the far arm behind it, both swinging forward and back in the picture plane. Every limb
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
  | 'roll'
  | 'swing'
  | 'thrust'
  | 'leap'
  | 'haul'
  | 'horn'
  | 'climb'
  | 'crank'
  | 'open'
  | 'guard'
  | 'draw'
  | 'wrench'
  | 'shoulder'
  | 'clinch'
  | 'knee'
  | 'tear'
  | 'glide'
  | 'raise'

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

// The lunge the blades are thrown from: the near leg forward and bent, the far leg long behind.
const LUNGE: Partial<Pose> = { thighNear: -40, shinNear: 30, thighFar: 24, shinFar: 8 }

// Down low: the knees deep, the chest over them.
const LOW: Partial<Pose> = { chest: 30, head: 8, thighNear: -70, shinNear: 95, thighFar: -12, shinFar: 80 }

// The crank's two ends: the weight driven into the bar, then the bar pushed out at arm's length.
const CRANK_IN: Partial<Pose> = { armNear: -80, foreNear: -30, armFar: -75, foreFar: -35, chest: 30, thighNear: -50, shinNear: 40, thighFar: 30, shinFar: 10 }
const CRANK_OUT: Partial<Pose> = { armNear: -100, foreNear: -4, armFar: -95, foreFar: -8, chest: 34, thighNear: -30, shinNear: 20, thighFar: 40, shinFar: 6 }

// A hand over hand climb: one hand high on the chain, the other a reach lower, the legs gripping in turn.
const CLIMB_A: Partial<Pose> = { armNear: -175, foreNear: -10, armFar: -140, foreFar: -40, chest: -4, head: -10, thighNear: -50, shinNear: 60, thighFar: 0, shinFar: 30 }
const CLIMB_B: Partial<Pose> = { armNear: -140, foreNear: -40, armFar: -175, foreFar: -10, thighNear: 0, shinNear: 30, thighFar: -50, shinFar: 60 }

const ZERO: Pose = { chest: 0, head: 0, armFar: 0, foreFar: 0, armNear: 0, foreNear: 0, thighFar: 0, shinFar: 0, thighNear: 0, shinNear: 0, x: 0, y: 0 }

// How he stands: a blade in each hand held low and forward, the elbows bent, the knees a little bent.
export const REST: Pose = { ...ZERO, ...LEGS_SET, chest: 6, head: -4, armNear: -25, foreNear: -55, armFar: -30, foreFar: -70 }

/** The legs sat astride the winged horse; a scene lays them over any move of the arms. */
export const ASTRIDE: Partial<Pose> = { thighNear: -80, shinNear: 80, thighFar: -75, shinFar: 75 }

const back = (rest: Pose): Key => ({ at: 1, pose: rest })

/** Holds `pose` from `at` to the end. */
const hold = (at: number, pose: Partial<Pose>): Key[] => [
  { at, pose },
  { at: 1, pose },
]

export const MOVES: Record<Move, MoveSpec> = {
  // the stride: each leg reaches forward straight and swings back bent, the near arm counter swinging
  walk: {
    keys: (r) => [
      { at: 0, pose: { thighNear: -24, shinNear: 6, thighFar: 22, shinFar: 16, armNear: r.armNear + 16 } },
      { at: 0.25, pose: { thighNear: 0, shinNear: 6, thighFar: 2, shinFar: 55 } },
      { at: 0.5, pose: { thighNear: 22, shinNear: 16, thighFar: -24, shinFar: 6, armNear: r.armNear - 16 } },
      { at: 0.75, pose: { thighNear: 2, shinNear: 55, thighFar: 0, shinFar: 6 } },
      { at: 1, pose: { thighNear: -24, shinNear: 6, thighFar: 22, shinFar: 16, armNear: r.armNear + 16 } },
    ],
  },
  // the dodge roll: tucked tight, the blades in to the chest, then up again in his stance (the scene turns him
  // over as he goes)
  roll: {
    keys: (r) => [
      { at: 0, pose: {} },
      { at: 0.25, pose: { chest: 34, head: 20, thighNear: -110, shinNear: 140, thighFar: -100, shinFar: 140, armNear: -70, foreNear: -120, armFar: -60, foreFar: -120 } },
      { at: 0.75, pose: { chest: 34, head: 20, thighNear: -110, shinNear: 140, thighFar: -100, shinFar: 140, armNear: -70, foreNear: -120, armFar: -60, foreFar: -120 } },
      back(r),
    ],
  },
  // the blades thrown out on their chains: wound up over the near shoulder and back, then whipped forward from
  // the lunge with both arms long, held while the arcs of fire run out
  swing: {
    keys: () => [
      { at: 0, pose: {} },
      { at: 0.35, pose: { armNear: -205, foreNear: -40, armFar: 50, foreFar: -30, chest: -14, head: -8, thighNear: -20, shinNear: 10 } },
      { at: 0.6, pose: { armNear: -75, foreNear: -4, armFar: -110, foreFar: -6, chest: 22, head: 4, ...LUNGE } },
      { at: 1, pose: { armNear: -75, foreNear: -4, armFar: -110, foreFar: -6, chest: 22, head: 4, ...LUNGE } },
    ],
  },
  // driving a thing down with both hands: both arms high over the head, then down with the whole body behind
  thrust: {
    keys: () => [
      { at: 0, pose: {} },
      { at: 0.4, pose: { armNear: -195, foreNear: -20, armFar: -185, foreFar: -24, chest: -12, head: -12, thighNear: -14, shinNear: 6 } },
      ...hold(0.7, { armNear: -40, foreNear: -10, armFar: -45, foreFar: -12, chest: 34, head: 10, thighNear: -70, shinNear: 80, thighFar: 10, shinFar: 60 }),
    ],
  },
  // the jump: down into the knees with the arms back, then up and out, the arms reaching forward and up
  leap: {
    keys: () => [
      { at: 0, pose: {} },
      { at: 0.3, pose: { chest: 22, armNear: 30, foreNear: -20, armFar: 40, foreFar: -20, thighNear: -60, shinNear: 90, thighFar: -10, shinFar: 80 } },
      ...hold(0.6, { chest: -6, head: -8, armNear: -150, foreNear: -10, armFar: -140, foreFar: -12, thighNear: -40, shinNear: 60, thighFar: 20, shinFar: 70 }),
    ],
  },
  // hauling a weight up from below him: bent over it with both hands down, then back on his heels pulling it in
  haul: {
    keys: () => [
      { at: 0, pose: { armNear: -60, foreNear: -10, armFar: -55, foreFar: -12, ...LOW } },
      { at: 0.5, pose: { armNear: -20, foreNear: -120, armFar: -15, foreFar: -120, chest: -14, head: -8, thighNear: -30, shinNear: 20, thighFar: 20, shinFar: 10, x: -14 } },
      { at: 1, pose: { armNear: -40, foreNear: -100, armFar: -35, foreFar: -100, chest: -6, head: -4, thighNear: -20, shinNear: 12, thighFar: 16, shinFar: 10, x: -10 } },
    ],
  },
  // the horn set to the mouth with the near hand, the head back, the far hand loose
  horn: {
    keys: () => [
      { at: 0, pose: {} },
      ...hold(0.35, { armNear: -110, foreNear: -135, armFar: -30, foreFar: -60, head: -16, chest: -10 }),
    ],
  },
  // up the chain hand over hand
  climb: {
    keys: () => [
      { at: 0, pose: CLIMB_A },
      { at: 0.5, pose: CLIMB_B },
      { at: 1, pose: CLIMB_A },
    ],
  },
  // one push of the great lever: the weight in, the bar out, the weight in again
  crank: {
    keys: () => [
      { at: 0, pose: CRANK_IN },
      { at: 0.5, pose: CRANK_OUT },
      { at: 1, pose: CRANK_IN },
    ],
  },
  // the lid lifted: crouched with both hands under it, then up and over the head, the face turned up
  open: {
    keys: () => [
      { at: 0, pose: {} },
      { at: 0.4, pose: { armNear: -50, foreNear: -10, armFar: -45, foreFar: -12, ...LOW } },
      ...hold(0.8, { armNear: -190, foreNear: -10, armFar: -165, foreFar: -10, chest: -12, head: -16, thighNear: -10, shinNear: 5, thighFar: 10, shinFar: 5 }),
    ],
  },
  // the great sword held across high against a blow, the jolt as it lands, held braced
  guard: {
    keys: () => [
      { at: 0, pose: {} },
      { at: 0.35, pose: { armNear: -140, foreNear: -60, armFar: -120, foreFar: -70, chest: 10, head: 4, ...LUNGE } },
      { at: 0.55, pose: { chest: -12, head: -10, x: -24 } },
      { at: 1, pose: { chest: 8, head: 2, x: -16 } },
    ],
  },
  // the blade drawn up out of the stone: bent over the hilt, then up straight with both hands over the head
  draw: {
    keys: () => [
      { at: 0, pose: {} },
      { at: 0.3, pose: { armNear: -60, foreNear: -20, armFar: -55, foreFar: -22, ...LOW } },
      ...hold(0.75, { armNear: -200, foreNear: -6, armFar: -195, foreFar: -8, chest: -10, head: -16, thighNear: -14, shinNear: 6, thighFar: 14, shinFar: 8 }),
    ],
  },
  // a grip torn back: both hands forward on the thing, then thrown back on his heels with it
  wrench: {
    keys: () => [
      { at: 0, pose: {} },
      { at: 0.35, pose: { armNear: -100, foreNear: -10, armFar: -95, foreFar: -12, chest: 22, ...LUNGE } },
      ...hold(0.7, { armNear: -30, foreNear: -125, armFar: -25, foreFar: -120, chest: -18, head: -10, thighNear: -10, shinNear: 10, thighFar: 40, shinFar: 30, x: -24 }),
    ],
  },
  // a weight laid on the near shoulder, the hand up by the ear, standing tall
  shoulder: {
    keys: () => [
      { at: 0, pose: {} },
      ...hold(0.6, { armNear: -150, foreNear: -150, armFar: -30, foreFar: -70, chest: -4, head: -6 }),
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
  // the wings torn off: from the clinch both arms flung wide, the near forward and up, the far back
  tear: {
    keys: () => [
      { at: 0, pose: CLINCH },
      { at: 0.3, pose: { armNear: -100, foreNear: -20, armFar: -95, foreFar: -24, chest: 20 } },
      ...hold(0.65, { armNear: -160, foreNear: -10, armFar: 70, foreFar: -10, chest: -16, head: -12, thighNear: -20, shinNear: 30, thighFar: 30, shinFar: 50 }),
    ],
  },
  // gliding: both hands up on the wings' bones over him, the legs trailing
  glide: {
    keys: () => [
      { at: 0, pose: {} },
      ...hold(0.5, { armNear: -170, foreNear: -10, armFar: -165, foreFar: -12, chest: 12, head: -10, thighNear: 20, shinNear: 40, thighFar: 30, shinFar: 60 }),
    ],
  },
  // both blades raised over his head to call the mountain
  raise: {
    keys: () => [
      { at: 0, pose: {} },
      ...hold(0.5, { armNear: -185, foreNear: -15, armFar: -170, foreFar: -25, chest: -8, head: -12, ...LUNGE }),
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
