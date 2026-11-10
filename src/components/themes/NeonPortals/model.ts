import {
  BoxGeometry,
  CircleGeometry,
  ConeGeometry,
  CylinderGeometry,
  Group,
  IcosahedronGeometry,
  Mesh,
  MeshBasicMaterial,
  SphereGeometry,
  type BufferGeometry,
} from 'three'
import type { Profession } from '@/lib/cv/professions'
import { part, type Place } from './batch'
import type { Vec3 } from './lens'
import { MODEL } from './palette'
import { JOINTS, type Joint, type Pose } from './pose'

// Him as the parody hero, built from low poly primitives and flat shaded (no model file): the source hero's
// silhouette (research 2026-10-21-warped-v2, design sheet: a big head about 40 percent of his height, long
// pointed ears out to the sides and up, long thin arms with big gloved hands, short bowed legs, huge sneakers,
// rolled jeans) with his own face from HERO_IDENTITY: the muzzle in his skin, his full dark beard over jaw and
// chin cut by the grin, his short dark hair as the tuft, his black oval eyes under thick brows.
//
// The rig is nested joint groups (pose.ts names them); applyPose turns them. He stands with his feet on y 0,
// facing +z, about 2.1 units tall; his left side is +x. Per profession one thing changes: the musician holds
// two drum sticks, the fighter wears Muay Thai shorts with a gold band, hand wraps and bare feet.

export interface Rig {
  root: Group
  /** The node that lifts, squashes and turns the whole figure; the blob shadow stays on the floor. */
  body: Group
  joints: Record<Joint, Group>
}

const HIP_Y = 0.72

const joint = (at: Vec3): Group => {
  const group = new Group()
  group.position.set(...at)
  return group
}

const put = (into: Group, geometry: BufferGeometry, colour: string, place: Place = {}): void => {
  into.add(part(geometry, colour, place))
}

const cylinder = (top: number, bottom: number, height: number, sides = 7) => new CylinderGeometry(top, bottom, height, sides)
const box = (x: number, y: number, z: number) => new BoxGeometry(x, y, z)

interface Outfit {
  hips: string
  thigh: string
  shin: string
  hand: string
  feet: (knee: Group) => void
  extra: (rig: Rig) => void
}

const sneaker = (knee: Group): void => {
  put(knee, cylinder(0.095, 0.095, 0.06, 7), MODEL.cuff, { at: [0, -0.2, 0] })
  put(knee, cylinder(0.05, 0.05, 0.08, 6), MODEL.fur, { at: [0, -0.26, 0] })
  put(knee, box(0.2, 0.15, 0.36), MODEL.shoe, { at: [0, -0.31, 0.07] })
  put(knee, box(0.22, 0.05, 0.38), MODEL.sole, { at: [0, -0.39, 0.07] })
  put(knee, box(0.21, 0.06, 0.05), MODEL.sole, { at: [0, -0.33, 0.25] })
}

const bareFoot = (knee: Group): void => {
  put(knee, cylinder(0.075, 0.07, 0.12, 6), MODEL.fur, { at: [0, -0.28, 0] })
  put(knee, box(0.15, 0.09, 0.28), MODEL.fur, { at: [0, -0.37, 0.06] })
}

const sticks = (rig: Rig): void => {
  ;(['elbowL', 'elbowR'] as const).forEach((name) => {
    put(rig.joints[name], cylinder(0.02, 0.02, 0.6, 5), MODEL.stick, { at: [0, -0.36, 0.22], turn: [1.15, 0, 0] })
  })
}

const goldBand = (rig: Rig): void => {
  put(rig.joints.hips, box(0.46, 0.06, 0.33), MODEL.band, { at: [0, 0.11, 0] })
}

const OUTFITS: Record<Profession, Outfit> = {
  engineer: { hips: MODEL.jeans, thigh: MODEL.jeans, shin: MODEL.jeans, hand: MODEL.glove, feet: sneaker, extra: () => undefined },
  drummer: { hips: MODEL.jeans, thigh: MODEL.jeans, shin: MODEL.jeans, hand: MODEL.glove, feet: sneaker, extra: sticks },
  fighter: { hips: MODEL.shorts, thigh: MODEL.shorts, shin: MODEL.fur, hand: MODEL.wrap, feet: bareFoot, extra: goldBand },
}

function buildLeg(side: 1 | -1, outfit: Outfit): { thigh: Group; knee: Group } {
  const thigh = joint([0.12 * side, -0.04, 0])
  put(thigh, cylinder(0.095, 0.08, 0.3), outfit.thigh, { at: [0, -0.15, 0] })
  const knee = joint([0, -0.29, 0])
  put(knee, cylinder(0.075, 0.07, 0.2), outfit.shin, { at: [0, -0.1, 0] })
  outfit.feet(knee)
  thigh.add(knee)
  return { thigh, knee }
}

function buildArm(side: 1 | -1, outfit: Outfit): { shoulder: Group; elbow: Group } {
  const shoulder = joint([0.21 * side, 0.42, 0])
  put(shoulder, new SphereGeometry(0.075, 6, 4), MODEL.fur)
  put(shoulder, cylinder(0.065, 0.055, 0.3), MODEL.fur, { at: [0, -0.15, 0] })
  const elbow = joint([0, -0.3, 0])
  put(elbow, cylinder(0.055, 0.05, 0.26), MODEL.fur, { at: [0, -0.13, 0] })
  put(elbow, box(0.14, 0.15, 0.11), outfit.hand, { at: [0, -0.32, 0] })
  ;[-0.048, -0.016, 0.016, 0.048].forEach((x) => put(elbow, box(0.03, 0.11, 0.035), MODEL.fur, { at: [x, -0.44, 0.01] }))
  put(elbow, box(0.035, 0.09, 0.035), MODEL.fur, { at: [-0.04 * side, -0.33, 0.07], turn: [0.6, 0, 0] })
  shoulder.add(elbow)
  return { shoulder, elbow }
}

function buildHead(): Group {
  const head = joint([0, 0.56, 0])
  // the head is about 40 percent of his height, the source hero's proportion
  head.scale.setScalar(1.2)
  put(head, new IcosahedronGeometry(0.4, 1), MODEL.fur, { at: [0, 0.36, 0], size: [1, 0.92, 0.95] })
  // his short dark hair: a cap over the crown and the spiky tuft on top
  put(head, new IcosahedronGeometry(0.41, 1), MODEL.hair, { at: [0, 0.6, -0.03], size: [0.98, 0.42, 0.96] })
  ;[
    [-0.1, 0.78, 0.02, 0.45],
    [0, 0.83, 0, 0],
    [0.1, 0.78, 0.02, -0.45],
  ].forEach(([x, y, z, lean]) => put(head, new ConeGeometry(0.08, 0.24, 4), MODEL.hair, { at: [x, y, z], turn: [-0.2, 0, lean] }))
  // the long muzzle in his skin, the big black nose at its tip
  put(head, cylinder(0.12, 0.21, 0.46, 7), MODEL.muzzle, { at: [0, 0.26, 0.4], turn: [Math.PI / 2, 0, 0] })
  put(head, new IcosahedronGeometry(0.1, 0), MODEL.nose, { at: [0, 0.32, 0.65], size: [1.25, 0.9, 1] })
  // his full dark beard over the jaw, the cheeks and under the muzzle, cut by the wide toothy grin
  put(head, new SphereGeometry(0.34, 8, 6), MODEL.beard, { at: [0, 0.11, 0.2], size: [1.16, 0.55, 1.08] })
  put(head, box(0.36, 0.1, 0.05), MODEL.mouth, { at: [0, 0.17, 0.52] })
  put(head, box(0.32, 0.055, 0.06), MODEL.teeth, { at: [0, 0.18, 0.54] })
  // big close set eyes with his black oval pupils, thick brows angled down to the middle
  ;([1, -1] as const).forEach((side) => {
    put(head, new SphereGeometry(0.12, 8, 6), MODEL.eyeWhite, { at: [0.12 * side, 0.48, 0.3], size: [0.8, 1.15, 0.6] })
    put(head, new SphereGeometry(0.055, 6, 5), MODEL.pupil, { at: [0.115 * side, 0.47, 0.365], size: [0.8, 1.25, 0.5] })
    put(head, box(0.17, 0.05, 0.05), MODEL.hair, { at: [0.13 * side, 0.63, 0.33], turn: [0, 0, 0.32 * side] })
    // the ears, long and pointed, out to the side and up
    const tilt = -(Math.PI / 2 - 0.5) * side
    put(head, new ConeGeometry(0.13, 0.52, 4), MODEL.fur, { at: [0.42 * side, 0.6, -0.05], turn: [0, 0, tilt] })
    put(head, new ConeGeometry(0.07, 0.36, 4), MODEL.earInner, { at: [0.4 * side, 0.6, -0.01], turn: [0, 0, tilt] })
  })
  return head
}

function blobShadow(): Mesh {
  const shadow = new Mesh(new CircleGeometry(0.48, 12), new MeshBasicMaterial({ color: MODEL.shadow, transparent: true, opacity: 0.3, depthWrite: false }))
  shadow.rotation.x = -Math.PI / 2
  shadow.position.y = 0.01
  return shadow
}

export function buildHero(profession: Profession): Rig {
  const outfit = OUTFITS[profession]
  const root = new Group()
  const body = new Group()
  const hips = joint([0, HIP_Y, 0])
  put(hips, box(0.42, 0.22, 0.3), outfit.hips, { at: [0, 0.03, 0] })

  const legL = buildLeg(1, outfit)
  const legR = buildLeg(-1, outfit)

  const spine = joint([0, 0.1, 0])
  put(spine, cylinder(0.17, 0.26, 0.44), MODEL.fur, { at: [0, 0.22, 0] })
  put(spine, new SphereGeometry(0.15, 6, 5), MODEL.chest, { at: [0, 0.2, 0.17], size: [1, 1.35, 0.5] })
  put(spine, cylinder(0.08, 0.09, 0.14, 6), MODEL.fur, { at: [0, 0.52, 0] })
  const armL = buildArm(1, outfit)
  const armR = buildArm(-1, outfit)
  const head = buildHead()
  spine.add(armL.shoulder, armR.shoulder, head)

  hips.add(legL.thigh, legR.thigh, spine)
  body.add(hips)
  root.add(blobShadow(), body)

  const rig: Rig = {
    root,
    body,
    joints: {
      hips,
      spine,
      head,
      shoulderL: armL.shoulder,
      shoulderR: armR.shoulder,
      elbowL: armL.elbow,
      elbowR: armR.elbow,
      thighL: legL.thigh,
      thighR: legR.thigh,
      kneeL: legL.knee,
      kneeR: legR.knee,
    },
  }
  outfit.extra(rig)
  return rig
}

// How each joint's [forward, turn, out] lands on its group's x, y and z rotation. A hanging limb (an arm, a
// thigh, a forearm) swings to his front on a negative x turn; a knee bends back, the spine and the head lean
// forward and the hips pitch on a positive one; out spreads his left limbs to +x and his right ones to -x.
type Signs = readonly [number, number, number]
const HANGING_LEFT: Signs = [-1, 1, 1]
const HANGING_RIGHT: Signs = [-1, 1, -1]
const UPRIGHT: Signs = [1, 1, 1]

const SIGNS: Record<Joint, Signs> = {
  hips: UPRIGHT,
  spine: UPRIGHT,
  head: UPRIGHT,
  shoulderL: HANGING_LEFT,
  shoulderR: HANGING_RIGHT,
  elbowL: HANGING_LEFT,
  elbowR: HANGING_RIGHT,
  thighL: HANGING_LEFT,
  thighR: HANGING_RIGHT,
  kneeL: UPRIGHT,
  kneeR: UPRIGHT,
}

export function applyPose(rig: Rig, pose: Pose): void {
  JOINTS.forEach((name) => {
    const [forward, turn, out] = pose.joints[name]
    const [sx, sy, sz] = SIGNS[name]
    rig.joints[name].rotation.set(forward * sx, turn * sy, out * sz)
  })
  rig.body.position.y = pose.lift
  rig.body.scale.y = pose.squash
  rig.body.rotation.y = pose.turn
}
