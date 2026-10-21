import type { Profession } from '@/lib/cv/professions'

// His bandicoot's skeleton and every pose as keyframes (the time travel platformer's hero, Warped, named
// in code only). One data source drives both the page (bandicoot.tsx plays the frames with the Web
// Animations API) and the still pictures (a frame drawn as SVG transform attributes), so a pose looks the
// same animated and stopped.
//
// He stands in a 3/4 view facing the viewer's right, the way the game's renders show him: hunched, knees
// always bent, the head pushed forward, long loose arms. Angles are degrees, clockwise on screen (SVG y
// runs down), each joint relative to its parent, every limb drawn hanging straight down at 0:
//   knee   shin turns clockwise from the thigh (positive) so the foot swings back behind the knee
//   elbow  forearm turns counterclockwise from the upper arm (zero or negative) so the hand comes forward
// The feet stay flat unless a frame says otherwise, and a grounded pose is moved up or down so the lower
// foot stays on the floor while the knees bend. The whole figure squashes and stretches from the feet.

export type Joint =
  | 'torso'
  | 'head'
  | 'armNear'
  | 'foreNear'
  | 'armFar'
  | 'foreFar'
  | 'legNear'
  | 'shinNear'
  | 'footNear'
  | 'legFar'
  | 'shinFar'
  | 'footFar'

export const JOINTS: readonly Joint[] = ['torso', 'head', 'armNear', 'foreNear', 'armFar', 'foreFar', 'legNear', 'shinNear', 'footNear', 'legFar', 'shinFar', 'footFar']

/** Each joint's pivot in the sprite's viewBox units (80 by 124, feet on y 110). */
export const PIVOT: Record<Joint | 'whole' | 'turn', readonly [number, number]> = {
  whole: [40, 110],
  turn: [40, 52],
  torso: [40, 72],
  head: [42, 48],
  armNear: [45, 52],
  foreNear: [45, 63],
  armFar: [37, 51],
  foreFar: [37, 62],
  legNear: [44, 72],
  shinNear: [44, 86],
  footNear: [44, 99],
  legFar: [36, 72],
  shinFar: [36, 86],
  footFar: [36, 99],
}

const THIGH = 14
const SHIN = 13

/** A frame: the whole figure's move (x, y, tilt, squash sx and sy, fade) and any joint angles. */
export type Frame = Partial<Record<Joint, number>> & {
  x?: number
  y?: number
  tilt?: number
  sx?: number
  sy?: number
  fade?: number
}

/** The props a pose shows over him. */
export type Gear = 'tornado' | 'scuba' | 'halo' | 'prop'

export interface Pose {
  frames: readonly Frame[]
  ms: number
  loop: boolean
  /** Feet kept on the floor while the knees bend; off in the air, seated or swimming. */
  grounded: boolean
  easing: string
  gear?: Gear
}

export type BandicootPose = 'idle' | 'guard' | 'run' | 'spin' | 'slide' | 'jump' | 'slam' | 'dance' | 'act' | 'warp' | 'ride' | 'swim' | 'angel' | 'still'

// The rest stance: crouched a little, leaning in, arms hanging loose and a touch forward.
const REST: Required<Pick<Frame, Joint>> = {
  torso: 8,
  head: -4,
  armNear: -8,
  foreNear: -26,
  armFar: 10,
  foreFar: -18,
  legNear: -20,
  shinNear: 32,
  footNear: 0,
  legFar: -8,
  shinFar: 22,
  footFar: 0,
}

const SPRING = 'cubic-bezier(0.34, 1.56, 0.64, 1)'
const EASE = 'ease-in-out'

const ACT: Record<Profession, Pose> = {
  // typing on the laptop held in front, head down, forearms tapping in turn
  engineer: {
    ms: 520,
    loop: true,
    grounded: true,
    easing: EASE,
    gear: 'prop',
    frames: [
      { torso: 14, head: 12, armNear: -40, foreNear: -62, armFar: -36, foreFar: -78 },
      { torso: 14, head: 14, armNear: -40, foreNear: -78, armFar: -36, foreFar: -62, sy: 0.98 },
      { torso: 14, head: 12, armNear: -40, foreNear: -62, armFar: -36, foreFar: -78 },
    ],
  },
  // drumming on two crates, sticks up and down in turn, the head nodding on the beat
  drummer: {
    ms: 420,
    loop: true,
    grounded: true,
    easing: EASE,
    gear: 'prop',
    frames: [
      { torso: 16, head: 8, armNear: -70, foreNear: -90, armFar: -20, foreFar: -30, sy: 1.02 },
      { torso: 18, head: 16, armNear: -20, foreNear: -30, armFar: -70, foreFar: -90, sy: 0.96 },
      { torso: 16, head: 8, armNear: -70, foreNear: -90, armFar: -20, foreFar: -30, sy: 1.02 },
    ],
  },
  // the spinning roundhouse: chamber the near knee, whip the shin out high, land back in guard
  fighter: {
    ms: 900,
    loop: false,
    grounded: true,
    easing: SPRING,
    frames: [
      { armNear: -60, foreNear: -110, armFar: -40, foreFar: -115 },
      { tilt: -8, legNear: -85, shinNear: 100, armNear: -50, foreNear: -110, armFar: -30, foreFar: -110, sx: -1 },
      { tilt: -14, legNear: -105, shinNear: 6, legFar: 0, shinFar: 8, armNear: 30, foreNear: -60, armFar: -70, foreFar: -100 },
      { tilt: -6, legNear: -60, shinNear: 70, armNear: -50, foreNear: -110, armFar: -40, foreFar: -110 },
      { armNear: -60, foreNear: -110, armFar: -40, foreFar: -115 },
    ],
  },
}

const POSES: Record<Exclude<BandicootPose, 'act'>, Pose> = {
  // left alone: looks up, looks round, taps the near foot, a breath on every beat
  idle: {
    ms: 2800,
    loop: true,
    grounded: true,
    easing: EASE,
    frames: [
      {},
      { sy: 1.02, sx: 0.99, head: 10, torso: 4, foreNear: -36 },
      { head: -12, torso: 10, tilt: 1 },
      { legNear: -32, shinNear: 48, footNear: -14, head: -6, armNear: -2, foreNear: -40 },
      { sy: 0.98, sx: 1.01 },
      {},
    ],
  },
  // the fight stance: gloves up by the chin, a light bounce on the balls of the feet
  guard: {
    ms: 700,
    loop: true,
    grounded: true,
    easing: EASE,
    frames: [
      { torso: 10, head: -6, armNear: -60, foreNear: -110, armFar: -40, foreFar: -115, legNear: -24, shinNear: 38, legFar: 4, shinFar: 24 },
      { torso: 12, head: -8, armNear: -56, foreNear: -112, armFar: -36, foreFar: -116, legNear: -30, shinNear: 48, legFar: 0, shinFar: 32, sy: 0.96, sx: 1.03 },
      { torso: 10, head: -6, armNear: -60, foreNear: -110, armFar: -40, foreFar: -115, legNear: -24, shinNear: 38, legFar: 4, shinFar: 24 },
    ],
  },
  // the run: lean in, knees high, arms pumping opposite the legs, squash on each landing
  run: {
    ms: 440,
    loop: true,
    grounded: true,
    easing: 'linear',
    frames: [
      { torso: 18, head: -12, legNear: -42, shinNear: 12, legFar: 24, shinFar: 58, armNear: 34, foreNear: -40, armFar: -44, foreFar: -60, sy: 0.94, sx: 1.05 },
      { torso: 18, head: -10, legNear: -4, shinNear: 34, legFar: -56, shinFar: 96, armNear: -4, foreNear: -50, armFar: 0, foreFar: -50, y: -4, sy: 1.04, sx: 0.97 },
      { torso: 18, head: -12, legNear: 24, shinNear: 58, legFar: -42, shinFar: 12, armNear: -44, foreNear: -60, armFar: 34, foreFar: -40, sy: 0.94, sx: 1.05 },
      { torso: 18, head: -10, legNear: -56, shinNear: 96, legFar: -4, shinFar: 34, armNear: 0, foreNear: -50, armFar: -4, foreFar: -50, y: -4, sy: 1.04, sx: 0.97 },
      { torso: 18, head: -12, legNear: -42, shinNear: 12, legFar: 24, shinFar: 58, armNear: 34, foreNear: -40, armFar: -44, foreFar: -60, sy: 0.94, sx: 1.05 },
    ],
  },
  // the tornado spin: arms flung out, feet together, the body turning on its own axis in the swirl
  spin: {
    ms: 360,
    loop: true,
    grounded: true,
    easing: 'linear',
    gear: 'tornado',
    frames: [
      { sx: 1, armNear: -88, foreNear: -6, armFar: 88, foreFar: -6, legNear: -6, shinNear: 10, legFar: 4, shinFar: 8, torso: 0, head: 0 },
      { sx: 0.35, armNear: -88, foreNear: -6, armFar: 88, foreFar: -6, legNear: -6, shinNear: 10, legFar: 4, shinFar: 8, torso: 0, head: 0 },
      { sx: -1, armNear: -88, foreNear: -6, armFar: 88, foreFar: -6, legNear: -6, shinNear: 10, legFar: 4, shinFar: 8, torso: 0, head: 0 },
      { sx: -0.35, armNear: -88, foreNear: -6, armFar: 88, foreFar: -6, legNear: -6, shinNear: 10, legFar: 4, shinFar: 8, torso: 0, head: 0 },
      { sx: 1, armNear: -88, foreNear: -6, armFar: 88, foreFar: -6, legNear: -6, shinNear: 10, legFar: 4, shinFar: 8, torso: 0, head: 0 },
    ],
  },
  // the slide: drops low, the near leg shoots out in front, the far knee folds under, arms thrown back
  slide: {
    ms: 900,
    loop: false,
    grounded: true,
    easing: 'cubic-bezier(0.2, 0.8, 0.3, 1)',
    frames: [
      { torso: 18, head: -12, legNear: -40, shinNear: 20, legFar: 20, shinFar: 50, armNear: 30, foreNear: -40, armFar: -40, foreFar: -60 },
      { tilt: -16, torso: -4, head: -16, legNear: -78, shinNear: 6, legFar: -30, shinFar: 100, armNear: 50, foreNear: -20, armFar: 40, foreFar: -30, sy: 0.92, sx: 1.06 },
      { tilt: -16, torso: -4, head: -18, legNear: -78, shinNear: 6, legFar: -30, shinFar: 100, armNear: 54, foreNear: -16, armFar: 44, foreFar: -24, sy: 0.92, sx: 1.06 },
      { sy: 1.05, sx: 0.96, torso: 4 },
      {},
    ],
  },
  // the double jump: crouch, stretch up with the arms high, tuck and flip at the top, land in a squash
  jump: {
    ms: 950,
    loop: false,
    grounded: false,
    easing: 'ease-out',
    frames: [
      { sy: 0.8, sx: 1.14, legNear: -50, shinNear: 80, legFar: -40, shinFar: 76, torso: 20 },
      { y: -40, sy: 1.12, sx: 0.92, armNear: -115, foreNear: -20, armFar: 140, foreFar: -10, legNear: -10, shinNear: 20, legFar: 0, shinFar: 24 },
      { y: -64, tilt: 180, legNear: -90, shinNear: 120, legFar: -80, shinFar: 120, armNear: -40, foreNear: -90, armFar: -40, foreFar: -90, torso: 30 },
      { y: -44, tilt: 360, sy: 1.08, sx: 0.95, armNear: -100, foreNear: -20, armFar: 120, foreFar: -20 },
      { y: 0, tilt: 360, sy: 0.84, sx: 1.12, legNear: -46, shinNear: 76, legFar: -36, shinFar: 70 },
      { tilt: 360 },
    ],
  },
  // the body slam: hop up and tuck, hang for a beat, drop straight down and flatten on the floor
  slam: {
    ms: 1000,
    loop: false,
    grounded: false,
    easing: 'ease-in',
    frames: [
      { sy: 0.86, sx: 1.1, legNear: -44, shinNear: 70, legFar: -36, shinFar: 66 },
      { y: -38, legNear: -80, shinNear: 110, legFar: -76, shinFar: 112, armNear: -96, foreNear: -30, armFar: 140, foreFar: -20, torso: 4 },
      { y: -40, legNear: -82, shinNear: 112, legFar: -78, shinFar: 114, armNear: -98, foreNear: -26, armFar: 146, foreFar: -16, torso: 0 },
      { y: 0, sy: 0.66, sx: 1.34, armNear: -86, foreNear: -4, armFar: 86, foreFar: -4, legNear: -50, shinNear: 80, legFar: -40, shinFar: 76 },
      { sy: 1.05, sx: 0.97 },
      {},
    ],
  },
  // the dance, four poses off the game's dance sheet: arms flung up and knees out, a hip sway with a hand
  // on the hip, a crouch with the fists up, and the finish with a thumb up
  dance: {
    ms: 1800,
    loop: true,
    grounded: true,
    easing: SPRING,
    frames: [
      { armNear: -100, foreNear: -4, armFar: 135, foreFar: -20, legNear: -40, shinNear: 54, legFar: 12, shinFar: 40, torso: 2, sy: 1.04 },
      { tilt: 6, torso: -10, head: 10, armNear: 30, foreNear: -110, armFar: 150, foreFar: -10, legNear: -10, shinNear: 16, legFar: -26, shinFar: 36 },
      { sy: 0.9, sx: 1.06, torso: 20, head: -8, armNear: -40, foreNear: -112, armFar: -30, foreFar: -112, legNear: -46, shinNear: 70, legFar: -30, shinFar: 64 },
      { tilt: -6, torso: 4, head: 12, armNear: -80, foreNear: -50, armFar: 20, foreFar: -12, legNear: -14, shinNear: 20, legFar: -6, shinFar: 14 },
      { armNear: -100, foreNear: -4, armFar: 135, foreFar: -20, legNear: -40, shinNear: 54, legFar: 12, shinFar: 40, torso: 2, sy: 1.04 },
    ],
  },
  // the warp: he spins small into the light and is gone, then spins back out the other way
  warp: {
    ms: 1300,
    loop: false,
    grounded: true,
    easing: EASE,
    frames: [
      {},
      { tilt: 360, sx: 0.4, sy: 1.3, fade: 0.8, armNear: -115, foreNear: -10, armFar: 140, foreFar: -10 },
      { tilt: 720, sx: 0.05, sy: 0.05, fade: 0 },
      { tilt: 360, sx: 0.4, sy: 1.3, fade: 0.8, armNear: -115, foreNear: -10, armFar: 140, foreFar: -10 },
      {},
    ],
  },
  // seated on a ride (the baby T rex, the motorbike, the jet ski): thighs forward, shins down, leaning
  // over the bars with both hands on them, a bob on every bump
  ride: {
    ms: 520,
    loop: true,
    grounded: false,
    easing: EASE,
    frames: [
      { torso: 24, head: -16, legNear: -84, shinNear: 88, legFar: -78, shinFar: 92, footNear: -6, footFar: -12, armNear: -66, foreNear: -22, armFar: -60, foreFar: -26 },
      { y: -1.6, sy: 1.02, torso: 20, head: -12, legNear: -84, shinNear: 88, legFar: -78, shinFar: 92, footNear: -6, footFar: -12, armNear: -62, foreNear: -26, armFar: -56, foreFar: -30 },
      { torso: 24, head: -16, legNear: -84, shinNear: 88, legFar: -78, shinFar: 92, footNear: -6, footFar: -12, armNear: -66, foreNear: -22, armFar: -60, foreFar: -26 },
    ],
  },
  // swimming in the scuba gear: lying flat, reaching ahead, the legs flutter kicking in turn
  swim: {
    ms: 760,
    loop: true,
    grounded: false,
    easing: EASE,
    gear: 'scuba',
    frames: [
      { tilt: 76, x: -12, y: 6, torso: 0, head: -64, armNear: -158, foreNear: -8, armFar: -146, foreFar: -6, legNear: 12, shinNear: 22, legFar: -14, shinFar: 10, footNear: 30, footFar: 30 },
      { tilt: 74, x: -12, y: 4, torso: 2, head: -62, armNear: -150, foreNear: -14, armFar: -154, foreFar: -10, legNear: -14, shinNear: 10, legFar: 12, shinFar: 22, footNear: 30, footFar: 30 },
      { tilt: 76, x: -12, y: 6, torso: 0, head: -64, armNear: -158, foreNear: -8, armFar: -146, foreFar: -6, legNear: 12, shinNear: 22, legFar: -14, shinFar: 10, footNear: 30, footFar: 30 },
    ],
  },
  // the angel gag: halo and wings, arms flapping, he floats up and fades out
  angel: {
    ms: 1800,
    loop: false,
    grounded: false,
    easing: 'ease-out',
    gear: 'halo',
    frames: [
      {},
      { y: -8, armNear: -100, foreNear: -30, armFar: 100, foreFar: -30, legNear: -6, shinNear: 30, legFar: 0, shinFar: 40, head: 8 },
      { y: -26, fade: 0.8, armNear: -60, foreNear: -20, armFar: 60, foreFar: -20, legNear: -6, shinNear: 30, legFar: 0, shinFar: 40, head: 8 },
      { y: -48, fade: 0.4, armNear: -100, foreNear: -30, armFar: 100, foreFar: -30, legNear: -6, shinNear: 30, legFar: 0, shinFar: 40, head: 8 },
      { y: -70, fade: 0, armNear: -60, foreNear: -20, armFar: 60, foreFar: -20, legNear: -6, shinNear: 30, legFar: 0, shinFar: 40, head: 8 },
    ],
  },
  still: { ms: 1, loop: false, grounded: true, easing: 'linear', frames: [{}] },
}

/** The pose's keyframes and timing; the profession picks the action. */
export const poseOf = (pose: BandicootPose, profession: Profession): Pose => (pose === 'act' ? ACT[profession] : POSES[pose])

/** A frame with every joint filled from the rest stance, the feet kept flat where the frame leaves them. */
export interface FullFrame extends Record<Joint, number> {
  x: number
  y: number
  tilt: number
  sx: number
  sy: number
  fade: number
}

const radians = (degrees: number) => (degrees * Math.PI) / 180

/** How far an ankle sits above (negative) or below the drawn ankle line, from the hip and knee angles. */
const ankleDrop = (leg: number, shin: number) => THIGH * Math.cos(radians(leg)) + SHIN * Math.cos(radians(leg + shin)) - (THIGH + SHIN)

export function resolveFrame(frame: Frame, grounded: boolean): FullFrame {
  const joints = { ...REST, ...frame }
  const footNear = frame.footNear ?? -(joints.legNear + joints.shinNear)
  const footFar = frame.footFar ?? -(joints.legFar + joints.shinFar)
  const lift = grounded ? -Math.max(ankleDrop(joints.legNear, joints.shinNear), ankleDrop(joints.legFar, joints.shinFar)) : 0

  return {
    ...joints,
    footNear,
    footFar,
    x: frame.x ?? 0,
    y: (frame.y ?? 0) + lift,
    tilt: frame.tilt ?? 0,
    sx: frame.sx ?? 1,
    sy: frame.sy ?? 1,
    fade: frame.fade ?? 1,
  }
}

/** The pose's frames filled in, in order. */
export const framesOf = (pose: Pose): FullFrame[] => pose.frames.map((frame) => resolveFrame(frame, pose.grounded))

const [WHOLE_X, WHOLE_Y] = PIVOT.whole
const [TURN_X, TURN_Y] = PIVOT.turn

/**
 * The whole figure's CSS transform for a frame, its pivots built in (the sprite's groups use origin 0 0):
 * moved by x and y, turned round the middle of the body (a flip spins in the air, not round the feet),
 * squashed and stretched from the feet.
 */
export const wholeCss = (f: FullFrame) =>
  `translate(${f.x + TURN_X}px, ${f.y + TURN_Y}px) rotate(${f.tilt}deg) translate(${WHOLE_X - TURN_X}px, ${WHOLE_Y - TURN_Y}px) scale(${f.sx}, ${f.sy}) translate(${-WHOLE_X}px, ${-WHOLE_Y}px)`

/** A joint's CSS transform for an angle, turning round its pivot. */
export const jointCss = (joint: Joint, angle: number) => {
  const [x, y] = PIVOT[joint]
  return `translate(${x}px, ${y}px) rotate(${angle}deg) translate(${-x}px, ${-y}px)`
}

/** The same transforms as SVG attributes, for a still frame drawn without any animation. */
export const wholeAttr = (f: FullFrame) =>
  `translate(${f.x + TURN_X} ${f.y + TURN_Y}) rotate(${f.tilt}) translate(${WHOLE_X - TURN_X} ${WHOLE_Y - TURN_Y}) scale(${f.sx} ${f.sy}) translate(${-WHOLE_X} ${-WHOLE_Y})`

export const jointAttr = (joint: Joint, angle: number) => {
  const [x, y] = PIVOT[joint]
  return `rotate(${angle} ${x} ${y})`
}
