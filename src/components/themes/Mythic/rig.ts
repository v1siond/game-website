import type { Profession } from '@/lib/cv/professions'

// His joints and every move he makes, as plain data, so the sprite, its test and the pose renders all
// read one source. He is drawn in three quarter profile facing right (the sheet in
// src/assets/sprites/kratos_spritesheet.png): the near arm in front of the chest, the far arm behind it,
// both swinging forward and back in the picture plane. Every limb is drawn hanging straight down and the
// pose turns it round its joint, in degrees, clockwise on screen (y grows down):
// - shoulder and hip: negative swings the limb forward (towards +x), -180 is straight up;
// - elbow: the forearm turns relative to the upper arm and folds only forward, so it stays in [-160, 0];
// - knee: the shin turns relative to the thigh and folds only back, so it stays in [0, 155];
// - chest: leans forward when positive; head: tips the chin down when positive.
// The figure's feet stay on the floor on their own (planted), unless a key lifts him with `y`.

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

export type Move = 'idle' | 'walk' | 'combo' | 'roar' | 'haul' | 'finish' | 'heave' | 'hurl' | 'push' | 'drum' | 'knee' | 'elbow' | 'kick'

/** A key: when it falls in the move (0 to 1) and the joints it changes; the others hold from the key before. */
export interface Key {
  at: number
  pose: Partial<Pose>
}

interface MoveSpec {
  ms: number
  loop: boolean
  keys: (rest: Pose) => Key[]
}

const LEGS_SET = { thighNear: -16, shinNear: 8, thighFar: 14, shinFar: 10 }

const ZERO: Pose = { chest: 0, head: 0, armFar: 0, foreFar: 0, armNear: 0, foreNear: 0, thighFar: 0, shinFar: 0, thighNear: 0, shinNear: 0, x: 0, y: 0 }

// How each kit stands: the blades held low and forward with the elbows bent (the axe and blade frames
// in the references), the hilts resting on the drum skin, the Muay Thai guard with the fists at the chin.
export const REST: Record<Profession, Pose> = {
  engineer: { ...ZERO, ...LEGS_SET, chest: 6, head: -4, armNear: -25, foreNear: -55, armFar: 15, foreFar: -50 },
  drummer: { ...ZERO, ...LEGS_SET, chest: 4, head: 2, armNear: -15, foreNear: -30, armFar: -10, foreFar: -35 },
  fighter: { ...ZERO, thighNear: -18, shinNear: 12, thighFar: 18, shinFar: 12, chest: 4, head: 4, armNear: -40, foreNear: -125, armFar: -28, foreFar: -130 },
}

const back = (rest: Pose): Key => ({ at: 1, pose: rest })

export const MOVES: Record<Move, MoveSpec> = {
  // the breath: the chest rises, the arms settle out and back in
  idle: {
    ms: 2600,
    loop: true,
    keys: (r) => [
      { at: 0, pose: {} },
      { at: 0.5, pose: { chest: r.chest - 2, head: r.head - 2, armNear: r.armNear - 4, armFar: r.armFar + 3 } },
      back(r),
    ],
  },
  // the stride: each leg reaches forward straight and swings back bent, the arms counter swing
  walk: {
    ms: 900,
    loop: true,
    keys: (r) => [
      { at: 0, pose: { thighNear: -24, shinNear: 6, thighFar: 22, shinFar: 16, armNear: r.armNear + 16, armFar: r.armFar - 16 } },
      { at: 0.25, pose: { thighNear: 0, shinNear: 6, thighFar: 2, shinFar: 55 } },
      { at: 0.5, pose: { thighNear: 22, shinNear: 16, thighFar: -24, shinFar: 6, armNear: r.armNear - 16, armFar: r.armFar + 16 } },
      { at: 0.75, pose: { thighNear: 2, shinNear: 55, thighFar: 0, shinFar: 6 } },
      { at: 1, pose: { thighNear: -24, shinNear: 6, thighFar: 22, shinFar: 16, armNear: r.armNear + 16, armFar: r.armFar - 16 } },
    ],
  },
  // the blade combo: the near blade over the head and down, the far one, then both overhead in a leap and the slam
  combo: {
    ms: 1900,
    loop: false,
    keys: (r) => [
      { at: 0, pose: {} },
      { at: 0.1, pose: { armNear: -200, foreNear: -35, armFar: 30, foreFar: -45, chest: -6 } },
      { at: 0.22, pose: { armNear: -55, foreNear: -6, chest: 14, thighNear: -30, shinNear: 22 } },
      { at: 0.34, pose: { armFar: -200, foreFar: -35, armNear: 20, foreNear: -60, chest: 0 } },
      { at: 0.46, pose: { armFar: -60, foreFar: -6, chest: 16 } },
      { at: 0.6, pose: { armNear: -195, foreNear: -25, armFar: -185, foreFar: -25, chest: -10, thighNear: -40, shinNear: 60, thighFar: 20, shinFar: 70, y: -18 } },
      { at: 0.72, pose: { armNear: -35, foreNear: -6, armFar: -30, foreFar: -6, chest: 26, thighNear: -70, shinNear: 70, thighFar: 20, shinFar: 100, y: 0 } },
      { at: 0.88, pose: {} },
      back(r),
    ],
  },
  // the rage: he gathers low, then throws the chest back and roars with the arms flexed and the fists clenched
  roar: {
    ms: 1500,
    loop: false,
    keys: (r) => [
      { at: 0, pose: {} },
      { at: 0.18, pose: { chest: 16, head: 10, armNear: 25, foreNear: -45, armFar: 30, foreFar: -45, thighNear: -30, shinNear: 40, thighFar: 22, shinFar: 40 } },
      { at: 0.36, pose: { chest: -12, head: -20, armNear: 28, foreNear: -100, armFar: 32, foreFar: -100, thighNear: -22, shinNear: 14, thighFar: 22, shinFar: 14 } },
      { at: 0.8, pose: {} },
      back(r),
    ],
  },
  // the chains: both arms wind back, fling forward straight, hold, then he hauls them in leaning back
  haul: {
    ms: 2000,
    loop: false,
    keys: (r) => [
      { at: 0, pose: {} },
      { at: 0.14, pose: { armNear: 50, foreNear: -30, armFar: 45, foreFar: -30, chest: -8 } },
      { at: 0.28, pose: { armNear: -95, foreNear: -2, armFar: -85, foreFar: -4, chest: 14, thighNear: -28, shinNear: 18 } },
      { at: 0.5, pose: {} },
      { at: 0.6, pose: { armNear: -80, foreNear: -12, armFar: -72, foreFar: -14 } },
      { at: 0.82, pose: { armNear: 20, foreNear: -110, armFar: 25, foreFar: -115, chest: -14, thighNear: -12, shinNear: 6, thighFar: 28, shinFar: 8 } },
      back(r),
    ],
  },
  // the finisher: he grabs the foe, lifts it overhead and slams it into the floor
  finish: {
    ms: 1700,
    loop: false,
    keys: (r) => [
      { at: 0, pose: {} },
      { at: 0.18, pose: { armNear: -85, foreNear: -15, armFar: -72, foreFar: -30, chest: 16, thighNear: -30, shinNear: 26 } },
      { at: 0.4, pose: { armNear: -175, foreNear: -20, armFar: -170, foreFar: -25, chest: -10, thighNear: -16, shinNear: 8 } },
      { at: 0.58, pose: { armNear: -40, foreNear: -10, armFar: -35, foreFar: -10, chest: 28, thighNear: -70, shinNear: 70, thighFar: 20, shinFar: 100 } },
      { at: 0.85, pose: {} },
      back(r),
    ],
  },
  // the chest: he crouches with his hands under the lid and heaves it up over his head
  heave: {
    ms: 1800,
    loop: false,
    keys: (r) => [
      { at: 0, pose: {} },
      { at: 0.22, pose: { chest: 26, head: 6, armNear: -45, foreNear: -25, armFar: -40, foreFar: -25, thighNear: -60, shinNear: 85, thighFar: -10, shinFar: 75 } },
      { at: 0.38, pose: {} },
      { at: 0.58, pose: { chest: -6, head: -8, armNear: -170, foreNear: -15, armFar: -165, foreFar: -15, thighNear: -14, shinNear: 6, thighFar: 12, shinFar: 8 } },
      { at: 0.84, pose: {} },
      back(r),
    ],
  },
  // the axe: wound back over the shoulder, thrown overhand, then the open hand out and the catch on its return
  hurl: {
    ms: 2600,
    loop: false,
    keys: (r) => [
      { at: 0, pose: {} },
      { at: 0.12, pose: { armNear: -200, foreNear: -75, armFar: -60, foreFar: -40, chest: -10 } },
      { at: 0.24, pose: { armNear: -60, foreNear: -6, armFar: 20, foreFar: -40, chest: 18, thighNear: -28, shinNear: 18 } },
      { at: 0.42, pose: {} },
      { at: 0.6, pose: { armNear: -100, foreNear: -10, armFar: 10, foreFar: -50, chest: 0, thighNear: -16, shinNear: 8 } },
      { at: 0.76, pose: { armNear: -120, foreNear: -65, chest: -4 } },
      { at: 0.9, pose: {} },
      back(r),
    ],
  },
  // the gate: both palms on the doors, then the long push leaning in, the far leg driving
  push: {
    ms: 2400,
    loop: false,
    keys: (r) => [
      { at: 0, pose: {} },
      { at: 0.16, pose: { armNear: -80, foreNear: -55, armFar: -75, foreFar: -60, chest: 20, thighNear: -30, shinNear: 30, thighFar: 30, shinFar: 6 } },
      { at: 0.5, pose: { armNear: -90, foreNear: -12, armFar: -86, foreFar: -14, chest: 28, thighFar: 40, shinFar: 4, x: 8 } },
      { at: 0.8, pose: { x: 14 } },
      { at: 1, pose: { ...r, x: 14 } },
    ],
  },
  // two drum hits, the near hilt then the far one, the forearms folding forward over the skin
  drum: {
    ms: 1300,
    loop: false,
    keys: (r) => [
      { at: 0, pose: {} },
      { at: 0.16, pose: { armNear: -90, foreNear: -70, chest: -2 } },
      { at: 0.3, pose: { armNear: -30, foreNear: -10, armFar: -90, foreFar: -70, chest: 8 } },
      { at: 0.5, pose: { armNear: -90, foreNear: -70, armFar: -30, foreFar: -10, chest: 8 } },
      { at: 0.7, pose: { armNear: -30, foreNear: -10, armFar: -10, foreFar: -35, chest: 8 } },
      back(r),
    ],
  },
  // the knee: both hands clinch the head down, the near knee drives up
  knee: {
    ms: 800,
    loop: false,
    keys: (r) => [
      { at: 0, pose: {} },
      { at: 0.3, pose: { armNear: -75, foreNear: -60, armFar: -70, foreFar: -65, chest: 10 } },
      { at: 0.5, pose: { thighNear: -105, shinNear: 115, chest: -4 } },
      { at: 0.72, pose: {} },
      back(r),
    ],
  },
  // the elbow: the upper arm comes up level, the forearm folded tight, the point leads
  elbow: {
    ms: 750,
    loop: false,
    keys: (r) => [
      { at: 0, pose: {} },
      { at: 0.25, pose: { armNear: 10, foreNear: -140, chest: -8 } },
      { at: 0.5, pose: { armNear: -100, foreNear: -150, chest: 18, thighNear: -26, shinNear: 22 } },
      { at: 0.7, pose: {} },
      back(r),
    ],
  },
  // the kick: chambered, then the near leg straight out at the waist, the body leaning away
  kick: {
    ms: 900,
    loop: false,
    keys: (r) => [
      { at: 0, pose: {} },
      { at: 0.25, pose: { thighNear: -80, shinNear: 90, armNear: 20, foreNear: -100, chest: -4 } },
      { at: 0.5, pose: { thighNear: -95, shinNear: 5, chest: -18, armNear: 40, foreNear: -60, armFar: -40, foreFar: -120 } },
      { at: 0.72, pose: { thighNear: -70, shinNear: 80 } },
      back(r),
    ],
  },
}

/** A move's keys for a kit, each one a whole pose (a key carries the joints it leaves alone from the key before). */
export function resolveKeys(move: Move, profession: Profession): { at: number; pose: Pose }[] {
  const rest = REST[profession]
  let carried = rest
  return MOVES[move].keys(rest).map(({ at, pose }) => {
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

/** The SVG transform that sets one joint in a pose, as an attribute (the drawing's own coordinates). */
export function jointTransform(joint: Joint, angle: number): string {
  const [x, y] = PIVOT[joint]
  return `rotate(${angle} ${x} ${y})`
}

/** The SVG transform that lifts and steps the whole figure, keeping the feet planted. */
export function bodyTransform(pose: Pose): string {
  return `translate(${pose.x} ${plantedDrop(pose) + pose.y})`
}

/** The same transforms as CSS, for the Web Animations keyframes (the joints use transform-box: view-box). */
export const jointCss = (joint: Joint, angle: number) => ({ transform: `rotate(${angle}deg)`, transformOrigin: `${PIVOT[joint][0]}px ${PIVOT[joint][1]}px` })
export const bodyCss = (pose: Pose) => ({ transform: `translate(${pose.x}px, ${plantedDrop(pose) + pose.y}px)` })
