import type { Profession } from '@/lib/cv/professions'

// His fighter's frames as joint tables (our own arcade karate fighter: white gi, deep teal headband, bare feet).
// Every frame is a skeleton in one 160 x 170 cell facing right; a planted foot has its ankle at y 160 and
// its toe at y 163, over the shadow at CELL.ground (166). The renderer in fighter.tsx dresses the same
// skeleton in each profession's costume, so a move is drawn once.
// Four frames per move, the way the arcade sprite plays them: the stance is the classic four frame bounce
// played there and back, the specials are wind up, release, follow through and recover.

export type Pt = readonly [number, number]
export type HandShape = 'fist' | 'palm'

export interface ArmPose {
  s: Pt
  e: Pt
  h: Pt
  hand: HandShape
  // Where a drumstick held in this hand points; without it the stick follows the forearm.
  tip?: Pt
}

export interface LegPose {
  k: Pt
  a: Pt
  toe: Pt
}

export type Fx =
  | { kind: 'charge'; at: Pt; r: number }
  | { kind: 'flame'; from: Pt; to: Pt }
  | { kind: 'spark'; at: Pt; r: number }
  | { kind: 'spin'; phase: number }
  | { kind: 'kit'; swing: number }
  | { kind: 'guard'; at: Pt }
  | { kind: 'stars'; at: Pt; phase: number }

export interface Frame {
  head: Pt
  tilt?: number
  neck: Pt
  hip: Pt
  back: ArmPose
  front: ArmPose
  backLeg: LegPose
  frontLeg: LegPose
  // The headband tails' wave phase (0 to 3); streamed tails fly level, as in the win pose.
  wind: number
  stream?: boolean
  // The far leg is drawn over the body when it kicks across it.
  kickFront?: boolean
  fx?: Fx[]
}

export const FIGHTER_POSES = [
  'stance', 'walk', 'walkBack', 'fireball', 'uppercut', 'spinKick', 'win', 'punch', 'hurt', 'down', 'act',
  'guard', 'strong', 'roundhouse', 'throw', 'knee', 'jump', 'juggle', 'dizzy', 'bow', 'crouch', 'sweep', 'climb',
] as const

export type FighterPose = (typeof FIGHTER_POSES)[number]

export const CELL = { width: 160, height: 170, ground: 166 } as const

const at = (p: Pt, dx: number, dy: number): Pt => [p[0] + dx, p[1] + dy]

const shiftArm = (arm: ArmPose, dx: number, dy: number): ArmPose => ({
  ...arm,
  s: at(arm.s, dx, dy),
  e: at(arm.e, dx, dy),
  h: at(arm.h, dx, dy),
  tip: arm.tip && at(arm.tip, dx, dy),
})

// Moves the body over planted feet: the knees take half the move and bend out as he sinks.
function shift(frame: Frame, dx: number, dy: number): Frame {
  return {
    ...frame,
    head: at(frame.head, dx, dy),
    neck: at(frame.neck, dx, dy),
    hip: at(frame.hip, dx, dy),
    back: shiftArm(frame.back, dx, dy),
    front: shiftArm(frame.front, dx, dy),
    backLeg: {
      ...frame.backLeg,
      k: at(frame.backLeg.k, dx / 2 - dy * 0.4, dy / 2),
    },
    frontLeg: {
      ...frame.frontLeg,
      k: at(frame.frontLeg.k, dx / 2 + dy * 0.4, dy / 2),
    },
  }
}

const STANCE: Frame = {
  head: [66, 46],
  neck: [63, 57],
  hip: [58, 102],
  back: { s: [56, 64], e: [62, 84], h: [73, 75], hand: 'fist' },
  front: { s: [69, 63], e: [84, 76], h: [92, 62], hand: 'fist' },
  backLeg: { k: [44, 132], a: [32, 160], toe: [41, 163] },
  frontLeg: { k: [80, 130], a: [88, 160], toe: [98, 163] },
  wind: 0,
}

const STANCE_FRAMES = [0, 1, 2, 3].map((d) => ({
  ...shift(STANCE, 0, d),
  wind: d,
}))

const WALK_FRAMES: Frame[] = [
  STANCE,
  {
    ...shift(STANCE, 2, -1),
    frontLeg: { k: [85, 126], a: [95, 154], toe: [104, 157] },
    wind: 1,
  },
  {
    ...shift(STANCE, 3, 1),
    backLeg: { k: [50, 128], a: [42, 155], toe: [51, 158] },
    frontLeg: { k: [83, 131], a: [92, 160], toe: [101, 163] },
    wind: 2,
  },
  { ...shift(STANCE, 1, 0), wind: 3 },
]

// The ki blast: both palms cupped at the back hip gathering light, then thrust out at chest height.
const FIREBALL_CHARGE: Frame = {
  head: [58, 52],
  tilt: 4,
  neck: [57, 62],
  hip: [56, 105],
  back: { s: [50, 69], e: [42, 88], h: [44, 100], hand: 'palm' },
  front: { s: [62, 68], e: [56, 88], h: [50, 99], hand: 'palm' },
  backLeg: { k: [42, 134], a: [30, 160], toe: [39, 163] },
  frontLeg: { k: [78, 132], a: [88, 160], toe: [98, 163] },
  wind: 0,
  fx: [{ kind: 'charge', at: [47, 100], r: 4 }],
}

const FIREBALL_THRUST: Frame = {
  head: [76, 52],
  tilt: -2,
  neck: [72, 61],
  hip: [62, 105],
  back: { s: [65, 67], e: [84, 73], h: [103, 74], hand: 'palm' },
  front: { s: [76, 66], e: [94, 70], h: [110, 71], hand: 'palm' },
  backLeg: { k: [44, 136], a: [24, 160], toe: [32, 164] },
  frontLeg: { k: [88, 128], a: [96, 160], toe: [106, 163] },
  wind: 2,
  fx: [{ kind: 'spark', at: [116, 72], r: 9 }],
}

const FIREBALL_FRAMES: Frame[] = [
  FIREBALL_CHARGE,
  {
    ...shift(FIREBALL_CHARGE, -1, 1),
    wind: 1,
    fx: [{ kind: 'charge', at: [46, 101], r: 7 }],
  },
  FIREBALL_THRUST,
  { ...shift(FIREBALL_THRUST, -2, 1), wind: 3, fx: [] },
]

// The rising uppercut: a low crouch, then the lead fist drives up past the face and he leaves the ground.
const UPPERCUT_FRAMES: Frame[] = [
  {
    head: [70, 62],
    tilt: 8,
    neck: [66, 72],
    hip: [58, 112],
    back: { s: [60, 79], e: [68, 96], h: [78, 90], hand: 'fist' },
    front: { s: [72, 78], e: [80, 96], h: [86, 108], hand: 'fist' },
    backLeg: { k: [42, 138], a: [30, 160], toe: [39, 163] },
    frontLeg: { k: [84, 136], a: [90, 160], toe: [100, 163] },
    wind: 0,
  },
  {
    head: [74, 32],
    tilt: -6,
    neck: [71, 43],
    hip: [64, 86],
    back: { s: [64, 50], e: [58, 66], h: [66, 74], hand: 'fist' },
    front: { s: [76, 49], e: [88, 40], h: [90, 21], hand: 'fist' },
    backLeg: { k: [60, 116], a: [54, 144], toe: [62, 148] },
    frontLeg: { k: [82, 100], a: [78, 124], toe: [87, 127] },
    wind: 1,
    fx: [{ kind: 'flame', from: [88, 108], to: [90, 16] }],
  },
  {
    head: [72, 18],
    tilt: -10,
    neck: [69, 29],
    hip: [64, 72],
    back: { s: [62, 36], e: [55, 52], h: [62, 60], hand: 'fist' },
    front: { s: [75, 35], e: [80, 16], h: [82, -3], hand: 'fist' },
    backLeg: { k: [58, 100], a: [50, 124], toe: [58, 128] },
    frontLeg: { k: [80, 86], a: [74, 108], toe: [83, 111] },
    wind: 2,
    fx: [
      { kind: 'flame', from: [86, 90], to: [83, -8] },
      { kind: 'spark', at: [82, -6], r: 8 },
    ],
  },
  {
    ...shift(STANCE, 0, 3),
    front: { s: [69, 66], e: [80, 54], h: [84, 40], hand: 'fist' },
    wind: 3,
  },
]

// The spinning kick: off the ground, one leg straight out, the body turning through four views.
const SPIN_BODY = {
  head: [62, 30],
  neck: [60, 41],
  hip: [58, 86],
  back: { s: [54, 48], e: [46, 62], h: [54, 70], hand: 'fist' },
  front: { s: [66, 47], e: [74, 60], h: [66, 69], hand: 'fist' },
} as const satisfies Partial<Frame>

const TUCKED: LegPose = { k: [56, 110], a: [49, 126], toe: [57, 130] }

const SPIN_KICK_FRAMES: Frame[] = [
  {
    ...SPIN_BODY,
    backLeg: TUCKED,
    frontLeg: { k: [82, 86], a: [106, 84], toe: [112, 78] },
    wind: 0,
    fx: [{ kind: 'spin', phase: 0 }],
  },
  {
    ...SPIN_BODY,
    backLeg: TUCKED,
    frontLeg: { k: [68, 98], a: [72, 106], toe: [80, 108] },
    wind: 1,
    fx: [{ kind: 'spin', phase: 1 }],
  },
  {
    ...SPIN_BODY,
    backLeg: { k: [34, 86], a: [10, 84], toe: [4, 78] },
    frontLeg: { k: [62, 110], a: [56, 126], toe: [64, 130] },
    wind: 2,
    fx: [{ kind: 'spin', phase: 2 }],
  },
  {
    ...SPIN_BODY,
    backLeg: { k: [50, 98], a: [46, 106], toe: [54, 109] },
    frontLeg: { k: [62, 110], a: [56, 126], toe: [64, 130] },
    wind: 3,
    fx: [{ kind: 'spin', phase: 3 }],
  },
]

// The win pose: upright, one fist at the hip and one raised, the headband tails streaming in the wind.
const WIN: Frame = {
  head: [62, 40],
  neck: [60, 51],
  hip: [58, 98],
  back: { s: [53, 58], e: [47, 78], h: [54, 93], hand: 'fist' },
  front: { s: [66, 57], e: [79, 46], h: [80, 27], hand: 'fist' },
  backLeg: { k: [52, 130], a: [47, 160], toe: [56, 163] },
  frontLeg: { k: [68, 130], a: [72, 160], toe: [81, 163] },
  wind: 0,
  stream: true,
}

const WIN_FRAMES = [0, 1, 1, 0].map((d, wind) => ({
  ...shift(WIN, 0, d),
  wind,
}))

// The Musician: the same stance behind a snare and a crash, the sticks falling in turn like a rapid
// hand flurry, the fourth frame a crash.
const DRUM_BODY = {
  head: [62, 48],
  neck: [60, 59],
  hip: [55, 104],
  backLeg: STANCE.backLeg,
  frontLeg: { k: [78, 132], a: [84, 160], toe: [94, 163] },
} as const satisfies Partial<Frame>

const SNARE_HIT: ArmPose = {
  s: [54, 66],
  e: [66, 86],
  h: [82, 94],
  hand: 'fist',
  tip: [103, 106],
}
const STICK_UP: ArmPose = {
  s: [67, 65],
  e: [80, 62],
  h: [86, 50],
  hand: 'fist',
  tip: [80, 30],
}

const DRUM_FRAMES: Frame[] = [
  {
    ...DRUM_BODY,
    back: SNARE_HIT,
    front: STICK_UP,
    wind: 0,
    fx: [
      { kind: 'kit', swing: 0 },
      { kind: 'spark', at: [103, 106], r: 5 },
    ],
  },
  {
    ...DRUM_BODY,
    back: {
      s: [54, 66],
      e: [62, 76],
      h: [72, 64],
      hand: 'fist',
      tip: [64, 44],
    },
    front: {
      s: [67, 65],
      e: [82, 80],
      h: [92, 94],
      hand: 'fist',
      tip: [108, 107],
    },
    wind: 1,
    fx: [
      { kind: 'kit', swing: 0 },
      { kind: 'spark', at: [108, 107], r: 5 },
    ],
  },
  {
    ...DRUM_BODY,
    back: SNARE_HIT,
    front: STICK_UP,
    wind: 2,
    fx: [
      { kind: 'kit', swing: 0 },
      { kind: 'spark', at: [103, 106], r: 5 },
    ],
  },
  {
    ...DRUM_BODY,
    back: SNARE_HIT,
    front: {
      s: [67, 65],
      e: [86, 66],
      h: [98, 62],
      hand: 'fist',
      tip: [118, 68],
    },
    wind: 3,
    fx: [
      { kind: 'kit', swing: 1 },
      { kind: 'spark', at: [118, 68], r: 7 },
    ],
  },
]

// The Martial Artist: his Muay Thai rear roundhouse from a high guard, the shin turning over at head height.
const KICK_FRAMES: Frame[] = [
  {
    head: [62, 42],
    neck: [60, 53],
    hip: [58, 100],
    back: { s: [54, 60], e: [61, 77], h: [66, 54], hand: 'fist' },
    front: { s: [66, 59], e: [79, 70], h: [80, 50], hand: 'fist' },
    backLeg: { k: [50, 131], a: [44, 160], toe: [53, 163] },
    frontLeg: { k: [70, 130], a: [76, 160], toe: [85, 163] },
    wind: 0,
  },
  {
    head: [58, 42],
    neck: [57, 53],
    hip: [60, 99],
    back: { s: [52, 60], e: [44, 76], h: [38, 90], hand: 'fist' },
    front: { s: [64, 59], e: [75, 68], h: [73, 49], hand: 'fist' },
    backLeg: { k: [82, 98], a: [72, 122], toe: [80, 126] },
    frontLeg: { k: [66, 130], a: [68, 160], toe: [60, 163] },
    wind: 1,
    kickFront: true,
  },
  {
    head: [46, 52],
    tilt: -14,
    neck: [50, 61],
    hip: [62, 101],
    back: { s: [46, 68], e: [36, 82], h: [27, 93], hand: 'fist' },
    front: { s: [56, 66], e: [66, 74], h: [61, 57], hand: 'fist' },
    backLeg: { k: [92, 84], a: [121, 67], toe: [129, 62] },
    frontLeg: { k: [66, 132], a: [66, 160], toe: [57, 163] },
    wind: 2,
    kickFront: true,
    fx: [{ kind: 'spark', at: [130, 62], r: 11 }],
  },
  {
    head: [58, 42],
    neck: [57, 53],
    hip: [60, 99],
    back: { s: [52, 60], e: [46, 76], h: [44, 88], hand: 'fist' },
    front: { s: [64, 59], e: [75, 68], h: [73, 49], hand: 'fist' },
    backLeg: { k: [76, 108], a: [64, 130], toe: [72, 134] },
    frontLeg: { k: [66, 130], a: [68, 160], toe: [60, 163] },
    wind: 3,
    kickFront: true,
  },
]

// The straight punch: the lead fist chambers at the chest, then drives out level with the shoulder as
// the body leans in behind it, the rear fist kept up as a guard.
const PUNCH_OUT: Frame = {
  head: [74, 47],
  neck: [69, 58],
  hip: [61, 102],
  back: { s: [60, 65], e: [65, 84], h: [77, 73], hand: 'fist' },
  front: { s: [74, 64], e: [96, 64], h: [118, 63], hand: 'fist' },
  backLeg: { k: [44, 132], a: [30, 160], toe: [39, 163] },
  frontLeg: { k: [86, 130], a: [94, 160], toe: [104, 163] },
  wind: 2,
  fx: [{ kind: 'spark', at: [125, 63], r: 8 }],
}

const PUNCH_FRAMES: Frame[] = [
  {
    ...shift(STANCE, 2, 1),
    front: { s: [71, 64], e: [79, 79], h: [88, 70], hand: 'fist' },
    wind: 1,
  },
  PUNCH_OUT,
  { ...PUNCH_OUT, wind: 3, fx: [] },
  {
    ...shift(STANCE, 1, 0),
    front: { s: [70, 63], e: [88, 70], h: [100, 62], hand: 'fist' },
    wind: 0,
  },
]

// Taking a hit to the face: the head snaps back, the chest caves and the arms fly loose, then he
// gathers himself back into his stance.
const HURT_SNAP: Frame = {
  head: [50, 52],
  tilt: -16,
  neck: [53, 62],
  hip: [60, 104],
  back: { s: [48, 69], e: [36, 80], h: [26, 74], hand: 'palm' },
  front: { s: [60, 68], e: [70, 84], h: [82, 90], hand: 'palm' },
  backLeg: { k: [44, 134], a: [30, 160], toe: [39, 163] },
  frontLeg: { k: [80, 132], a: [90, 160], toe: [100, 163] },
  wind: 1,
  fx: [{ kind: 'spark', at: [64, 48], r: 10 }],
}

const HURT_FRAMES: Frame[] = [
  HURT_SNAP,
  {
    ...shift(HURT_SNAP, -4, 2),
    tilt: -20,
    back: { s: [44, 71], e: [32, 82], h: [22, 78], hand: 'palm' },
    front: { s: [56, 70], e: [64, 88], h: [76, 96], hand: 'palm' },
    wind: 2,
    fx: [],
  },
  { ...shift(STANCE, -4, 3), tilt: -8, wind: 3 },
  { ...shift(STANCE, -2, 1), wind: 0 },
]

// The knockdown: thrown back off his feet, falling on his back, then flat on the floor, face up, the
// last frame held as he lies there.
const FLOORED: Frame = {
  head: [26, 151],
  tilt: -84,
  neck: [37, 152],
  hip: [82, 154],
  back: { s: [42, 150], e: [30, 142], h: [18, 140], hand: 'palm' },
  front: { s: [48, 153], e: [60, 160], h: [72, 158], hand: 'palm' },
  backLeg: { k: [106, 150], a: [130, 158], toe: [134, 151] },
  frontLeg: { k: [104, 157], a: [129, 162], toe: [134, 156] },
  wind: 3,
  stream: true,
}

// Knocked off his feet into the air, the body thrown back and the limbs loose: the knockdown's fall and,
// held up by each hit, the juggle.
const AIRBORNE: Frame = {
  head: [38, 86],
  tilt: -52,
  neck: [45, 94],
  hip: [74, 126],
  back: { s: [44, 99], e: [30, 92], h: [18, 98], hand: 'palm' },
  front: { s: [52, 98], e: [52, 114], h: [62, 122], hand: 'palm' },
  backLeg: { k: [94, 132], a: [114, 150], toe: [121, 145] },
  frontLeg: { k: [90, 142], a: [106, 160], toe: [114, 160] },
  wind: 1,
  stream: true,
}

const DOWN_FRAMES: Frame[] = [
  { ...HURT_SNAP, wind: 0, fx: [{ kind: 'spark', at: [64, 48], r: 12 }] },
  AIRBORNE,
  { ...FLOORED, head: [26, 147], neck: [37, 149], hip: [82, 150], wind: 2 },
  FLOORED,
]

// The standing guard: both forearms up in front of the face, leaning back from the blow; it takes the hit
// with a guard spark and slides back on its feet, then settles.
const GUARD: Frame = {
  head: [60, 50],
  tilt: 4,
  neck: [58, 60],
  hip: [54, 104],
  back: { s: [54, 67], e: [70, 74], h: [76, 52], hand: 'fist' },
  front: { s: [66, 66], e: [82, 72], h: [84, 50], hand: 'fist' },
  backLeg: { k: [40, 134], a: [28, 160], toe: [37, 163] },
  frontLeg: { k: [76, 132], a: [86, 160], toe: [96, 163] },
  wind: 0,
}

const GUARD_FRAMES: Frame[] = [
  GUARD,
  { ...shift(GUARD, -6, 1), wind: 1, fx: [{ kind: 'guard', at: [92, 54] }] },
  { ...shift(GUARD, -8, 1), wind: 2, fx: [{ kind: 'guard', at: [90, 55] }] },
  { ...shift(GUARD, -4, 0), wind: 3 },
]

// The strong punch: the rear fist drives straight out at chest height, the lead fist tucked to the chin.
const STRONG_OUT: Frame = {
  head: [78, 48],
  tilt: -4,
  neck: [72, 59],
  hip: [62, 103],
  back: { s: [66, 64], e: [92, 62], h: [120, 61], hand: 'fist' },
  front: { s: [76, 65], e: [80, 80], h: [90, 68], hand: 'fist' },
  backLeg: { k: [46, 134], a: [28, 160], toe: [36, 164] },
  frontLeg: { k: [88, 130], a: [96, 160], toe: [106, 163] },
  wind: 2,
  fx: [{ kind: 'spark', at: [127, 61], r: 10 }],
}

const STRONG_FRAMES: Frame[] = [
  { ...shift(STANCE, 1, 1), back: { s: [57, 65], e: [58, 83], h: [67, 74], hand: 'fist' }, wind: 1 },
  STRONG_OUT,
  { ...STRONG_OUT, wind: 3, fx: [] },
  { ...shift(STANCE, 1, 0), wind: 0 },
]

// The clinch knee: both hands high on the partner's neck, the rear knee driven up into his body.
const CLINCH_BACK: ArmPose = { s: [60, 62], e: [82, 58], h: [100, 50], hand: 'palm' }
const CLINCH_FRONT: ArmPose = { s: [72, 61], e: [92, 62], h: [106, 52], hand: 'palm' }
const PLANTED: LegPose = { k: [74, 130], a: [76, 160], toe: [86, 163] }

const KNEE_FRAMES: Frame[] = [
  { head: [72, 46], neck: [68, 57], hip: [60, 102], back: CLINCH_BACK, front: CLINCH_FRONT, backLeg: STANCE.backLeg, frontLeg: { k: [82, 130], a: [90, 160], toe: [100, 163] }, wind: 0 },
  { head: [74, 48], tilt: 6, neck: [70, 59], hip: [64, 102], back: CLINCH_BACK, front: CLINCH_FRONT, backLeg: { k: [84, 108], a: [64, 128], toe: [70, 134] }, frontLeg: PLANTED, wind: 1, kickFront: true },
  {
    head: [76, 50],
    tilt: 10,
    neck: [72, 61],
    hip: [66, 102],
    back: CLINCH_BACK,
    front: CLINCH_FRONT,
    backLeg: { k: [104, 90], a: [84, 114], toe: [90, 120] },
    frontLeg: PLANTED,
    wind: 2,
    kickFront: true,
    fx: [{ kind: 'spark', at: [108, 86], r: 10 }],
  },
  { head: [72, 46], neck: [68, 57], hip: [62, 102], back: CLINCH_BACK, front: CLINCH_FRONT, backLeg: { k: [70, 128], a: [56, 156], toe: [64, 160] }, frontLeg: { k: [80, 130], a: [88, 160], toe: [98, 163] }, wind: 3 },
]

// The throw: both hands reach and grab, pull him in, heave him up and over, then lean in after him.
const THROW_FRAMES: Frame[] = [
  {
    head: [74, 48],
    neck: [70, 58],
    hip: [60, 103],
    back: { s: [64, 64], e: [88, 68], h: [108, 70], hand: 'palm' },
    front: { s: [74, 64], e: [96, 66], h: [114, 66], hand: 'palm' },
    backLeg: STANCE.backLeg,
    frontLeg: { k: [86, 130], a: [94, 160], toe: [104, 163] },
    wind: 0,
  },
  {
    head: [64, 50],
    tilt: 6,
    neck: [62, 60],
    hip: [58, 104],
    back: { s: [56, 66], e: [72, 74], h: [90, 66], hand: 'fist' },
    front: { s: [68, 65], e: [84, 70], h: [98, 62], hand: 'fist' },
    backLeg: { k: [44, 134], a: [30, 160], toe: [39, 163] },
    frontLeg: { k: [80, 132], a: [88, 160], toe: [98, 163] },
    wind: 1,
  },
  {
    head: [56, 44],
    tilt: -14,
    neck: [57, 55],
    hip: [60, 102],
    back: { s: [52, 62], e: [60, 40], h: [76, 24], hand: 'fist' },
    front: { s: [64, 61], e: [78, 40], h: [92, 26], hand: 'fist' },
    backLeg: { k: [48, 132], a: [38, 160], toe: [47, 163] },
    frontLeg: { k: [78, 130], a: [86, 160], toe: [96, 163] },
    wind: 2,
  },
  {
    head: [80, 52],
    tilt: 12,
    neck: [75, 62],
    hip: [62, 104],
    back: { s: [68, 68], e: [86, 84], h: [104, 92], hand: 'palm' },
    front: { s: [78, 68], e: [96, 82], h: [112, 90], hand: 'palm' },
    backLeg: { k: [44, 134], a: [28, 160], toe: [36, 164] },
    frontLeg: { k: [88, 132], a: [96, 160], toe: [106, 163] },
    wind: 3,
  },
]

// The jump in: a crouch, the tuck in the air, the flying kick down at him, the landing. The scene lifts the
// whole figure along a jump arc; the frames are the body's shape in the air.
const JUMP_FRAMES: Frame[] = [
  { ...shift(STANCE, 0, 8), wind: 0 },
  {
    head: [66, 40],
    neck: [63, 51],
    hip: [60, 92],
    back: { s: [56, 58], e: [50, 74], h: [60, 80], hand: 'fist' },
    front: { s: [68, 57], e: [80, 66], h: [82, 54], hand: 'fist' },
    backLeg: { k: [56, 114], a: [44, 126], toe: [50, 132] },
    frontLeg: { k: [80, 110], a: [70, 128], toe: [78, 132] },
    wind: 1,
  },
  {
    head: [60, 40],
    tilt: -8,
    neck: [58, 51],
    hip: [62, 94],
    back: { s: [54, 58], e: [44, 70], h: [50, 80], hand: 'fist' },
    front: { s: [66, 57], e: [76, 64], h: [74, 50], hand: 'fist' },
    backLeg: { k: [60, 118], a: [48, 130], toe: [54, 136] },
    frontLeg: { k: [88, 116], a: [112, 132], toe: [118, 128] },
    wind: 2,
    kickFront: true,
  },
  { ...shift(STANCE, 0, 6), wind: 3 },
]

// The juggle: kept in the air by each hit, a spark where it lands.
const JUGGLE_FRAMES: Frame[] = [
  { ...AIRBORNE, wind: 0, fx: [{ kind: 'spark', at: [56, 104], r: 12 }] },
  { ...AIRBORNE, tilt: -60, wind: 1 },
  { ...AIRBORNE, tilt: -66, wind: 2 },
  { ...AIRBORNE, tilt: -70, wind: 3 },
]

// Dizzy: slumped on his feet, the head lolling, the arms hanging, stars circling over his head.
const DIZZY: Frame = {
  head: [60, 52],
  tilt: 14,
  neck: [60, 62],
  hip: [58, 104],
  back: { s: [54, 69], e: [50, 90], h: [52, 108], hand: 'palm' },
  front: { s: [66, 68], e: [70, 90], h: [72, 108], hand: 'palm' },
  backLeg: { k: [48, 134], a: [40, 160], toe: [49, 163] },
  frontLeg: { k: [70, 134], a: [74, 160], toe: [83, 163] },
  wind: 0,
}

const DIZZY_FRAMES: Frame[] = [0, 1, 2, 3].map((phase) => ({
  ...shift(DIZZY, phase % 2 === 0 ? -2 : 2, 0),
  tilt: phase % 2 === 0 ? 10 : 18,
  wind: phase,
  fx: [{ kind: 'stars', at: [60, 26], phase }],
}))

// The bow at the end of the run: feet together, the hands at his sides, bending from the hips and back up
// a little at the bottom of it.
const UPRIGHT: Frame = {
  head: [62, 44],
  neck: [61, 56],
  hip: [58, 102],
  back: { s: [55, 64], e: [53, 84], h: [55, 102], hand: 'fist' },
  front: { s: [67, 63], e: [68, 84], h: [68, 102], hand: 'fist' },
  backLeg: { k: [54, 132], a: [52, 160], toe: [61, 163] },
  frontLeg: { k: [64, 132], a: [64, 160], toe: [73, 163] },
  wind: 0,
}

/** Him bent forward from the hips by `lean` (0 upright to 1 the deep bow). */
function bowed(lean: number, wind: number): Frame {
  const dx = 22 * lean
  const dy = 16 * lean
  return {
    ...UPRIGHT,
    head: at(UPRIGHT.head, dx, dy),
    tilt: 40 * lean,
    neck: at(UPRIGHT.neck, dx * 0.8, dy * 0.8),
    back: { ...shiftArm(UPRIGHT.back, dx * 0.6, dy * 0.6), h: at(UPRIGHT.back.h, dx * 0.4, dy * 0.2) },
    front: { ...shiftArm(UPRIGHT.front, dx * 0.6, dy * 0.6), h: at(UPRIGHT.front.h, dx * 0.4, dy * 0.2) },
    wind,
  }
}

const BOW_FRAMES: Frame[] = [bowed(0, 0), bowed(0.5, 1), bowed(1, 2), bowed(0.85, 3)]

// The duck: dropped low on bent knees under a high blow, the guard kept up by the face, bobbing a little.
const CROUCH: Frame = {
  head: [70, 84],
  tilt: 6,
  neck: [66, 94],
  hip: [54, 130],
  back: { s: [58, 100], e: [70, 112], h: [80, 92], hand: 'fist' },
  front: { s: [70, 99], e: [86, 106], h: [90, 88], hand: 'fist' },
  backLeg: { k: [36, 142], a: [30, 160], toe: [39, 163] },
  frontLeg: { k: [84, 136], a: [86, 160], toe: [96, 163] },
  wind: 0,
}

const CROUCH_FRAMES: Frame[] = [0, 1, 2, 1].map((d, wind) => ({ ...shift(CROUCH, 0, d), wind }))

// The sweep: down into the crouch, a hand to the floor, the lead leg swung out low along the floor into
// the shins, then back up into the crouch.
const SWEEP_OUT: Frame = {
  head: [44, 100],
  tilt: -18,
  neck: [48, 110],
  hip: [60, 134],
  back: { s: [44, 116], e: [34, 136], h: [30, 158], hand: 'palm' },
  front: { s: [54, 114], e: [64, 124], h: [70, 112], hand: 'fist' },
  backLeg: { k: [40, 146], a: [46, 160], toe: [55, 163] },
  frontLeg: { k: [96, 152], a: [128, 160], toe: [138, 156] },
  wind: 2,
  stream: true,
  fx: [{ kind: 'spark', at: [138, 154], r: 10 }],
}

const SWEEP_FRAMES: Frame[] = [
  { ...CROUCH, wind: 0 },
  { ...SWEEP_OUT, frontLeg: { k: [84, 150], a: [108, 162], toe: [116, 158] }, wind: 1, fx: [] },
  SWEEP_OUT,
  { ...shift(CROUCH, 0, 2), wind: 3 },
]

// The climb: hanging on the cage's mesh above the floor, hand over hand, one knee drawn up.
const CLIMB: Frame = {
  head: [66, 40],
  tilt: -6,
  neck: [63, 51],
  hip: [60, 96],
  back: { s: [56, 58], e: [56, 32], h: [62, 10], hand: 'fist' },
  front: { s: [68, 57], e: [76, 30], h: [80, 6], hand: 'fist' },
  backLeg: { k: [52, 122], a: [46, 146], toe: [55, 150] },
  frontLeg: { k: [84, 110], a: [80, 134], toe: [90, 136] },
  wind: 0,
}

const CLIMB_FRAMES: Frame[] = [
  CLIMB,
  { ...shift(CLIMB, 0, -3), back: { s: [56, 55], e: [52, 30], h: [56, 4], hand: 'fist' }, wind: 1 },
  { ...shift(CLIMB, 0, -5), backLeg: { k: [70, 112], a: [64, 136], toe: [73, 140] }, frontLeg: { k: [76, 124], a: [72, 148], toe: [81, 151] }, wind: 2 },
  { ...shift(CLIMB, 0, -2), front: { s: [68, 55], e: [80, 28], h: [86, 2], hand: 'fist' }, wind: 3 },
]

const POSE_FRAMES: Record<Exclude<FighterPose, 'act'>, Frame[]> = {
  stance: STANCE_FRAMES,
  walk: WALK_FRAMES,
  walkBack: WALK_FRAMES,
  fireball: FIREBALL_FRAMES,
  uppercut: UPPERCUT_FRAMES,
  spinKick: SPIN_KICK_FRAMES,
  win: WIN_FRAMES,
  punch: PUNCH_FRAMES,
  hurt: HURT_FRAMES,
  down: DOWN_FRAMES,
  guard: GUARD_FRAMES,
  strong: STRONG_FRAMES,
  roundhouse: KICK_FRAMES,
  throw: THROW_FRAMES,
  knee: KNEE_FRAMES,
  jump: JUMP_FRAMES,
  juggle: JUGGLE_FRAMES,
  dizzy: DIZZY_FRAMES,
  bow: BOW_FRAMES,
  crouch: CROUCH_FRAMES,
  sweep: SWEEP_FRAMES,
  climb: CLIMB_FRAMES,
}

// Each profession's action, done the way this hero would: the System Engineer throws the ki blast
// (its ball carries a terminal prompt), the Musician's flurry on the kit, the Martial Artist's roundhouse.
const ACT_FRAMES: Record<Profession, Frame[]> = {
  engineer: FIREBALL_FRAMES,
  drummer: DRUM_FRAMES,
  fighter: KICK_FRAMES,
}

export const framesFor = (pose: FighterPose, profession: Profession): Frame[] => (pose === 'act' ? ACT_FRAMES[profession] : POSE_FRAMES[pose])
