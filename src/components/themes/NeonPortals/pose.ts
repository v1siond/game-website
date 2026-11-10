// His moves as data: a pose is the angle of each joint of his rig plus how high, how squashed and how far
// turned the whole figure is; a clip is a few key poses over a time. poseAt reads a clip at a time and eases
// between its keys. The 3D model (model.ts) applies a pose to its joint groups, so a clip looks the same in the
// hero, in every level and in the still drawn without WebGL.
//
// Every joint is [forward, turn, out] in radians, in his own frame (he faces his front):
//   forward  a limb swings up in front of him (an arm raised ahead, a knee lifted); for the spine and the
//            head it is a lean or a nod forward; for a knee or an elbow it is the bend
//   turn     a twist about the bone
//   out      a limb spreads away from his body sideways
// The source game's hero stands hunched with his knees always bent and his long arms loose (research
// 2026-10-21-warped-v2, design sheet), so the rest pose is bent, never straight.

export const JOINTS = ['hips', 'spine', 'head', 'shoulderL', 'shoulderR', 'elbowL', 'elbowR', 'thighL', 'thighR', 'kneeL', 'kneeR'] as const

export type Joint = (typeof JOINTS)[number]
type Angles = readonly [number, number, number]

export interface Pose {
  joints: Record<Joint, Angles>
  /** The whole figure raised (a jump) or lowered (a crouch), in model units; he is about 2.2 tall. */
  lift: number
  /** The whole figure's height scale from the feet, under 1 squashed, over 1 stretched. */
  squash: number
  /** The whole figure turned about its upright axis (the tornado spin). */
  turn: number
}

interface PosePatch {
  joints?: Partial<Record<Joint, Angles>>
  lift?: number
  squash?: number
  turn?: number
}

interface Key {
  /** Where the key sits in the clip, 0 to 1. */
  at: number
  pose: PosePatch
}

interface Clip {
  seconds: number
  loop: boolean
  keys: readonly Key[]
}

export const REST: Pose = {
  joints: {
    hips: [0, 0, 0],
    spine: [0.18, 0, 0],
    head: [-0.08, 0, 0],
    shoulderL: [0.1, 0, 0.14],
    shoulderR: [0.1, 0, 0.14],
    elbowL: [0.3, 0, 0],
    elbowR: [0.3, 0, 0],
    thighL: [0.18, 0, 0.08],
    thighR: [0.18, 0, 0.08],
    kneeL: [0.34, 0, 0],
    kneeR: [0.34, 0, 0],
  },
  lift: 0,
  squash: 1,
  turn: 0,
}

const TURN = Math.PI * 2

// A run step lifts one knee to the hip while the other leg stays under him: the stepping leg shortens, the
// opposite arm swings forward, and neither thigh goes behind the hip, so the legs never pass each other.
const LEFT_STEP: PosePatch = {
  joints: {
    spine: [0.36, 0, 0],
    thighL: [1.05, 0, 0.06],
    kneeL: [1.5, 0, 0],
    thighR: [0.06, 0, 0.06],
    kneeR: [0.2, 0, 0],
    shoulderR: [0.9, 0, 0.12],
    elbowR: [1.3, 0, 0],
    shoulderL: [-0.45, 0, 0.12],
    elbowL: [0.9, 0, 0],
  },
  lift: 0.07,
}

const RIGHT_STEP: PosePatch = {
  joints: {
    spine: [0.36, 0, 0],
    thighR: [1.05, 0, 0.06],
    kneeR: [1.5, 0, 0],
    thighL: [0.06, 0, 0.06],
    kneeL: [0.2, 0, 0],
    shoulderL: [0.9, 0, 0.12],
    elbowL: [1.3, 0, 0],
    shoulderR: [-0.45, 0, 0.12],
    elbowR: [0.9, 0, 0],
  },
  lift: 0.07,
}

const PASSING: PosePatch = {
  joints: {
    spine: [0.36, 0, 0],
    thighL: [0.35, 0, 0.06],
    kneeL: [0.7, 0, 0],
    thighR: [0.35, 0, 0.06],
    kneeR: [0.7, 0, 0],
    shoulderL: [0.2, 0, 0.12],
    shoulderR: [0.2, 0, 0.12],
    elbowL: [1.1, 0, 0],
    elbowR: [1.1, 0, 0],
  },
  lift: 0,
}

const SWIM_BODY = { hips: [1.42, 0, 0], head: [-1.1, 0, 0], shoulderL: [2.7, 0, 0.35], shoulderR: [2.7, 0, 0.35], elbowL: [0.2, 0, 0], elbowR: [0.2, 0, 0] } as const

const ARMS_OUT = { shoulderL: [0.15, 0, 1.45], shoulderR: [0.15, 0, 1.45], elbowL: [0.05, 0, 0], elbowR: [0.05, 0, 0] } as const

const DRUM_UP = { shoulderL: [1.9, 0, 0.2], shoulderR: [1.9, 0, 0.2], elbowL: [1.8, 0, 0], elbowR: [1.8, 0, 0] } as const
const DRUM_HIT = { shoulderL: [0.8, 0, 0.2], shoulderR: [0.8, 0, 0.2], elbowL: [0.8, 0, 0], elbowR: [0.8, 0, 0] } as const

export const CLIPS = {
  /** Standing still: the rest pose, for the stills drawn under reduced motion. */
  stand: { seconds: 1, loop: false, keys: [{ at: 0, pose: {} }] },
  /** Breathing on the spot, the ambient loop while he waits. */
  idle: {
    seconds: 2.4,
    loop: true,
    keys: [
      { at: 0, pose: {} },
      { at: 0.5, pose: { joints: { spine: [0.26, 0, 0], head: [-0.02, 0, 0], shoulderL: [0.04, 0, 0.2], shoulderR: [0.04, 0, 0.2] }, lift: -0.025 } },
      { at: 1, pose: {} },
    ],
  },
  /** One stride of the run into the screen; the level plays it by distance, not by time. */
  run: {
    seconds: 0.6,
    loop: true,
    keys: [
      { at: 0, pose: LEFT_STEP },
      { at: 0.25, pose: PASSING },
      { at: 0.5, pose: RIGHT_STEP },
      { at: 0.75, pose: PASSING },
      { at: 1, pose: LEFT_STEP },
    ],
  },
  /** Under water: flat out, arms ahead, the knees kicking in turn. */
  swim: {
    seconds: 1,
    loop: true,
    keys: [
      { at: 0, pose: { joints: { ...SWIM_BODY, thighL: [0.5, 0, 0.1], kneeL: [0.9, 0, 0], thighR: [0.05, 0, 0.1], kneeR: [0.1, 0, 0] } } },
      { at: 0.5, pose: { joints: { ...SWIM_BODY, thighL: [0.05, 0, 0.1], kneeL: [0.1, 0, 0], thighR: [0.5, 0, 0.1], kneeR: [0.9, 0, 0] } } },
      { at: 1, pose: { joints: { ...SWIM_BODY, thighL: [0.5, 0, 0.1], kneeL: [0.9, 0, 0], thighR: [0.05, 0, 0.1], kneeR: [0.1, 0, 0] } } },
    ],
  },
  /** The tornado spin: arms straight out, three turns. */
  spin: {
    seconds: 0.8,
    loop: false,
    keys: [
      { at: 0, pose: {} },
      { at: 0.15, pose: { joints: ARMS_OUT, turn: TURN * 0.4, lift: 0.12 } },
      { at: 0.85, pose: { joints: ARMS_OUT, turn: TURN * 2.6, lift: 0.12 } },
      { at: 1, pose: { turn: TURN * 3 } },
    ],
  },
  /** A hop from pad to pad: crouch, up with the knees tucked, down. */
  hop: {
    seconds: 0.6,
    loop: false,
    keys: [
      { at: 0, pose: { joints: { thighL: [0.6, 0, 0.08], thighR: [0.6, 0, 0.08], kneeL: [1, 0, 0], kneeR: [1, 0, 0] }, lift: -0.1, squash: 0.9 } },
      { at: 0.45, pose: { joints: { thighL: [0.7, 0, 0.1], thighR: [0.7, 0, 0.1], kneeL: [1.2, 0, 0], kneeR: [1.2, 0, 0], shoulderL: [2.4, 0, 0.3], shoulderR: [2.4, 0, 0.3] }, lift: 0.9, squash: 1.08 } },
      { at: 0.85, pose: { lift: 0.05 } },
      { at: 1, pose: {} },
    ],
  },
  /** He forms in the beam spinning and drops onto the pad. */
  form: {
    seconds: 0.5,
    loop: false,
    keys: [
      { at: 0, pose: { joints: ARMS_OUT, lift: 1.4, squash: 1.3 } },
      { at: 1, pose: { turn: TURN * 2, lift: 0, squash: 1 } },
    ],
  },
  /** The squash as he lands. */
  land: {
    seconds: 0.25,
    loop: false,
    keys: [
      { at: 0, pose: { joints: { thighL: [0.6, 0, 0.1], thighR: [0.6, 0, 0.1], kneeL: [1, 0, 0], kneeR: [1, 0, 0] }, lift: -0.12, squash: 0.82 } },
      { at: 1, pose: {} },
    ],
  },
  /** Ta da: both arms flung up and out, a little bounce. */
  tada: {
    seconds: 1.2,
    loop: false,
    keys: [
      { at: 0, pose: {} },
      { at: 0.25, pose: { joints: { shoulderL: [0.5, 0, 2.2], shoulderR: [0.5, 0, 2.2], elbowL: [0.1, 0, 0], elbowR: [0.1, 0, 0], head: [-0.3, 0, 0], kneeL: [0.6, 0, 0], kneeR: [0.6, 0, 0] }, lift: 0.22 } },
      { at: 0.75, pose: { joints: { shoulderL: [0.5, 0, 2.2], shoulderR: [0.5, 0, 2.2], elbowL: [0.1, 0, 0], elbowR: [0.1, 0, 0], head: [-0.3, 0, 0] } } },
      { at: 1, pose: {} },
    ],
  },
  /** Two beats on the drum crates. */
  drum: {
    seconds: 1,
    loop: false,
    keys: [
      { at: 0, pose: {} },
      { at: 0.2, pose: { joints: DRUM_UP } },
      { at: 0.35, pose: { joints: DRUM_HIT, lift: -0.04 } },
      { at: 0.55, pose: { joints: DRUM_UP } },
      { at: 0.7, pose: { joints: DRUM_HIT, lift: -0.04 } },
      { at: 1, pose: {} },
    ],
  },
  /** The roundhouse kick: chamber the right knee, turn, snap the shin out, back down. */
  kick: {
    seconds: 0.7,
    loop: false,
    keys: [
      { at: 0, pose: {} },
      { at: 0.3, pose: { joints: { thighR: [0.7, 0, 1.2], kneeR: [1.7, 0, 0], spine: [0, 0, 0], shoulderL: [0.9, 0, 0.3], elbowL: [1.6, 0, 0], shoulderR: [0.9, 0, 0.3], elbowR: [1.6, 0, 0] }, turn: -0.5 } },
      { at: 0.55, pose: { joints: { thighR: [0.8, 0, 1.4], kneeR: [0.1, 0, 0], spine: [-0.1, 0, 0], shoulderL: [0.9, 0, 0.3], elbowL: [1.6, 0, 0] }, turn: 0.6 } },
      { at: 1, pose: {} },
    ],
  },
} satisfies Record<string, Clip>

export type ClipName = keyof typeof CLIPS

const smooth = (w: number): number => w * w * (3 - 2 * w)
const mix = (a: number, b: number, w: number): number => a + (b - a) * w

const fill = (patch: PosePatch): Pose => ({
  joints: { ...REST.joints, ...patch.joints },
  lift: patch.lift ?? REST.lift,
  squash: patch.squash ?? REST.squash,
  turn: patch.turn ?? REST.turn,
})

const mixAngles = (a: Angles, b: Angles, w: number): Angles => [mix(a[0], b[0], w), mix(a[1], b[1], w), mix(a[2], b[2], w)]

const mixPose = (a: Pose, b: Pose, w: number): Pose => ({
  joints: Object.fromEntries(JOINTS.map((joint) => [joint, mixAngles(a.joints[joint], b.joints[joint], w)])) as Record<Joint, Angles>,
  lift: mix(a.lift, b.lift, w),
  squash: mix(a.squash, b.squash, w),
  turn: mix(a.turn, b.turn, w),
})

/** Where in the clip a time falls, 0 to 1: a loop wraps, a one shot holds its end. */
const clipPlace = (clip: Clip, seconds: number): number => {
  if (clip.loop) return (((seconds % clip.seconds) + clip.seconds) % clip.seconds) / clip.seconds
  return Math.min(1, Math.max(0, seconds / clip.seconds))
}

export function poseAt(clip: Clip, seconds: number): Pose {
  const place = clipPlace(clip, seconds)
  const nextIndex = clip.keys.findIndex((key) => key.at > place)
  if (nextIndex === -1) return fill(clip.keys[clip.keys.length - 1].pose)
  if (nextIndex === 0) return fill(clip.keys[0].pose)
  const from = clip.keys[nextIndex - 1]
  const to = clip.keys[nextIndex]
  return mixPose(fill(from.pose), fill(to.pose), smooth((place - from.at) / (to.at - from.at)))
}
