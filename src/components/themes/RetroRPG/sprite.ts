import { HERO_IDENTITY } from '@/lib/cv/heroIdentity'
import type { Profession } from '@/lib/cv/professions'
import { RPG } from './palette'

// Him as the room walker of the 16 bit role playing game (a head as wide as the body is tall, one dark
// outline the colour of the hair, flat fills, no shading): his own face, short dark hair, the full dark
// beard and two dot eyes, in his own clothes per profession, a shirt over trousers and dark shoes; the
// Martial Artist bare chested in red shorts with gold wraps, his mongkhon (the corded Muay Thai headband,
// its tail up behind) and white prajioud on the arms. 20 by 30 pixels: a 15 row head over a 10 row torso
// and 5 rows of legs.
//
// Four facings (down, up, right, left as the mirror of right), each with two step frames; one action of
// two frames per profession, facing down: the System Engineer types on a pocket terminal whose screen
// scrolls, the Musician raises his sticks over a snare and brings them down on it, the Martial Artist
// stands in guard, then throws the knee. And the genre's moves, facing right: the strike, the kneel, the
// push, the cast, the side knee and the kick.
//
// The pixels are data: rows of one letter a pixel read through the outfit's colour key and drawn as one
// rect per run of one colour (pixelRuns). Keys: K outline, H hair, B beard, S skin, s skin shade (ears,
// nose), E eyes, J shirt, P trousers or shorts, Q the lower legs, F shoes, Y waistband, R wraps, W white
// cord and bands, T terminal case, G and g its screen, L sticks, D and d the snare and its rim.

export const SPRITE = { width: 20, height: 30 } as const

export const PART_TOP = { head: 0, torso: 15, legs: 25 } as const

export type Facing = 'down' | 'up' | 'right' | 'left'
export type Step = 'stand' | 'stepA' | 'stepB'
type Head = 'down' | 'up' | 'right' | 'ring'

// ---- the head, 15 rows ----

const CROWN = ['.....KKKKKKKKKK.....', '....KHHHHHHHHHHK....', '...KHHHHHHHHHHHHK...', '..KHHHHHHHHHHHHHHK..']

const FACE_DOWN = [
  '..KHHHSHHHHHHSHHHK..',
  '..KHSSSSSSSSSSSSHK..',
  '..KSSSSSSSSSSSSSSK..',
  '.KsSSSESSSSSSESSSsK.',
  '.KsSSSSSSSSSSSSSSsK.',
  '.KBSSSSSSssSSSSSSBK.',
  '.KBBSSBBBBBBBBSSBBK.',
  '.KBBBBBBSssSBBBBBBK.',
  '..KBBBBBBBBBBBBBBK..',
  '...KBBBBBBBBBBBBK...',
  '.....KKBBBBBBKK.....',
]

const HEADS: Record<Head, string[]> = {
  down: [...CROWN, ...FACE_DOWN],
  up: [
    ...CROWN,
    '..KHHHHHHHHHHHHHHK..',
    '..KHHHHHHHHHHHHHHK..',
    '..KHHHHHHHHHHHHHHK..',
    '.KsHHHHHHHHHHHHHHsK.',
    '.KsHHHHHHHHHHHHHHsK.',
    '.KBHHHHHHHHHHHHHHBK.',
    '.KBBHHHHHHHHHHHHBBK.',
    '..KBBHHHHHHHHHHBBK..',
    '...KBBSSSSSSSSBBK...',
    '....KKBSSSSSSBKK....',
    '......KKSSSSKK......',
  ],
  // profile, facing right: the hair falls behind, the nose and the beard lead
  right: [
    ...CROWN,
    '..KHHHHHHHHHHHHSHK..',
    '..KHHHHHHHSSSSSSSK..',
    '..KHHHHHSSSSSSSSSK..',
    '..KHHHHsSSSSSESSSK..',
    '..KHHHHsSSSSSSSSSSK.',
    '..KHHHHSSSSSSSSSssK.',
    '..KHHHHBBBBBBBBBBBK.',
    '..KHHHBBBBBBBBBBBBK.',
    '...KHHBBBBBBBBBBBK..',
    '....KKBBBBBBBBBBK...',
    '......KKBBBBBBKK....',
  ],
  // facing down with the mongkhon tied round the brow, its tail standing up behind
  ring: [
    '.....KKKKKKKKKK..WK.',
    '....KHHHHHHHHHHKWK..',
    '...KHHHHHHHHHHHHWK..',
    '..KWWWWWWWWWWWWWWK..',
    ...FACE_DOWN,
  ],
}

// ---- the torso, 10 rows (neck to the top of the trousers) ----

const NECK = '......KKSSSSKK......'
const COLLAR = '....KKKJJJJJJKKK....'
const SHOULDERS = '...KJKJJJJJJJJKJK...'
const KNIT = '..KJJKJJJJJJJJKJJK..'
const HANDS = '..KSSKJJJJJJJJKSSK..'
const HEM = '..KKKKJJJJJJJJKKKK..'
const TROUSERS = '.....KPPPPPPPPK.....'
const SPLIT = '.....KPPPKKPPPK.....'

const FRONT_TORSO = [NECK, COLLAR, SHOULDERS, KNIT, KNIT, KNIT, HANDS, HEM, TROUSERS, SPLIT]

const SIDE_TORSO = [
  NECK,
  '.....KKJJJJJJKK.....',
  '.....KJJJJJJJJK.....',
  '.....KJJJJJJJJK.....',
  '.....KJJJJJJJJK.....',
  '.....KJJJJJJJJK.....',
  '.....KJJJSSJJJK.....',
  '.....KKKKKKKKKK.....',
  '......KPPPPPPK......',
  '......KPPPPPPK......',
]

// ---- the legs, 5 rows ----

const FRONT_LEGS: Record<Step, string[]> = {
  stand: ['....KQQQK..KQQQK....', '....KQQQK..KQQQK....', '....KFFFK..KFFFK....', '...KFFFFK..KFFFFK...', '...KKKKKK..KKKKKK...'],
  stepA: ['....KQQQK..KQQQK....', '....KQQQK..KFFFK....', '....KFFFK.KFFFFK....', '...KFFFFK.KKKKKK....', '...KKKKKK...........'],
  stepB: ['....KQQQK..KQQQK....', '....KFFFK..KQQQK....', '....KFFFFK.KFFFK....', '....KKKKKK.KFFFFK...', '...........KKKKKK...'],
}

const SIDE_LEGS: Record<Step, string[]> = {
  stand: ['.......KQQQQK.......', '.......KQQQQK.......', '.......KFFFFK.......', '.......KFFFFFK......', '.......KKKKKKK......'],
  stepA: ['......KQQKKQQK......', '.....KQQK..KQQK.....', '....KFFK....KFFK....', '....KFFFK...KFFFK...', '....KKKKK...KKKKK...'],
  stepB: ['.......KQQQQK.......', '.......KQQQQK.......', '.......KFFFFK.......', '.......KFFFFFK......', '.......KKKKKKK......'],
}

export interface Pose {
  head: readonly string[]
  torso: readonly string[]
  legs: readonly string[]
}

// ---- the genre's moves, facing right ----

const SIDE_TOP = [NECK, '.....KKJJJJJJKK.....']
const SIDE_BELT = ['.....KKKKKKKKKK.....', '......KPPPPPPK......', '......KPPPPPPK......']

const MOVE_TORSO = {
  // the near arm straight out at the shoulder, the fist leading
  strike: [...SIDE_TOP, '.....KJJJJJJJJKKKKK.', '.....KJJJJJJJJJJJSSK', '.....KJJJJJJJJKKKKK.', '.....KJJJJJJJJK.....', '.....KJJJJJJJJK.....', ...SIDE_BELT],
  // both hands flat on what he leans into
  push: [...SIDE_TOP, '.....KJJJJJJJJKKKK..', '.....KJJJJJJJJJJSSK.', '.....KJJJJJJJJKKKKK.', '.....KJJJJJJJJJJSSK.', '.....KJJJJJJJJKKKK..', ...SIDE_BELT],
  // the near hand raised up and forward over his head
  cast: [
    '......KKSSSSKK.KSSK.',
    '.....KKJJJJJJKKKJJK.',
    '.....KJJJJJJJJJJJK..',
    '.....KJJJJJJJJKKK...',
    '.....KJJJJJJJJK.....',
    '.....KJJJJJJJJK.....',
    '.....KJJJJJJJJK.....',
    ...SIDE_BELT,
  ],
  // bent low, the near hand reaching forward
  kneel: [
    ...SIDE_TOP,
    '.....KJJJJJJJJK.....',
    '.....KJJJJJJJJK.....',
    '.....KJJJJJJJJKKK...',
    '.....KJJJJJJJJJJSK..',
    '.....KJJJJJJJJKKK...',
    '.....KKKKKKKKKK.....',
    '......KPPPPPPPPPK...',
    '......KPPPPPPPPPK...',
  ],
} as const

const MOVE_LEGS = {
  // one knee down, the other foot planted ahead
  kneel: ['......KQQKKKKQQK....', '......KQQK..KQQK....', '......KQQK..KQQK....', '.....KFFFK..KQQK....', '.....KKKKK..KKKK....'],
  // the near knee driven up and forward
  knee: ['......KQQQQQQQQK....', '......KQQKKKQQQK....', '......KQQK.KFFFK....', '......KQQK..KKK.....', '.....KFFFK..........'],
  // the near leg straight out at hip height
  kick: ['......KQQQQQQQQQQQK.', '......KQQQQKKKKKFFK.', '......KQQK.....KKK..', '......KQQK..........', '.....KFFFK..........'],
} as const

/** His frames for the genre's moves, all facing right. */
export type MoveFrame = 'standR' | 'strike' | 'kneel' | 'push' | 'cast' | 'knee' | 'kick'

/** A move frame: the profile head over the move's torso and legs. */
export function movePose(move: MoveFrame): Pose {
  const head = HEADS.right
  const parts: Record<MoveFrame, Omit<Pose, 'head'>> = {
    standR: { torso: SIDE_TORSO, legs: SIDE_LEGS.stand },
    strike: { torso: MOVE_TORSO.strike, legs: SIDE_LEGS.stepA },
    kneel: { torso: MOVE_TORSO.kneel, legs: MOVE_LEGS.kneel },
    push: { torso: MOVE_TORSO.push, legs: SIDE_LEGS.stepA },
    cast: { torso: MOVE_TORSO.cast, legs: SIDE_LEGS.stand },
    knee: { torso: SIDE_TORSO, legs: MOVE_LEGS.knee },
    kick: { torso: SIDE_TORSO, legs: MOVE_LEGS.kick },
  }
  return { head, ...parts[move] }
}

export const MOVE_FRAMES = ['standR', 'strike', 'kneel', 'push', 'cast', 'knee', 'kick'] as const satisfies readonly MoveFrame[]

// ---- the profession actions, two frames each, facing down ----

export type ActFrame = 'actA' | 'actB'


const GUARD_TORSO = [
  NECK,
  '...KRRKJJJJJJKRRK...',
  '...KRRKJJJJJJKRRK...',
  '..KWJKJJJJJJJJKJWK..',
  KNIT,
  '..KKKKJJJJJJJJKKKK..',
  '.....KJJJJJJJJK.....',
  '.....KYYYYYYYYK.....',
  TROUSERS,
  SPLIT,
]

const ACTIONS: Record<Profession, Record<ActFrame, Pose>> = {
  // the pocket terminal held at the chest, its screen scrolling as he types
  engineer: {
    actA: {
      head: HEADS.down,
      torso: [NECK, COLLAR, SHOULDERS, KNIT, '..KTTTTTTTTTTTTTTK..', '..KTGGgGGGgGgGGgTK..', '..KTgGGgGgGGGgGgTK..', '..KSSTTTTTTTTTTSSK..', TROUSERS, SPLIT],
      legs: FRONT_LEGS.stand,
    },
    actB: {
      head: HEADS.down,
      torso: [NECK, COLLAR, SHOULDERS, KNIT, '..KTTTTTTTTTTTTTTK..', '..KTgGGgGgGGGgGgTK..', '..KTGgGGGgGGgGGGTK..', '..KTSSTTTTTTTTSSTK..', TROUSERS, SPLIT],
      legs: FRONT_LEGS.stand,
    },
  },
  // sticks up over his shoulders, then down on the snare's rim
  drummer: {
    actA: {
      head: HEADS.down,
      torso: [
        '.L....KKSSSSKK....L.',
        '..L.KKKJJJJJJKKK.L..',
        '..KSKJJJJJJJJJJKSK..',
        '...KKJJJJJJJJJJKK...',
        '....KJJJJJJJJJJK....',
        '....KJJJJJJJJJJK....',
        '....KJJJJJJJJJJK....',
        '..KddddddddddddddK..',
        '..KDDDDDDDDDDDDDDK..',
        '..KKdDDDDDDDDDDdKK..',
      ],
      legs: FRONT_LEGS.stand,
    },
    actB: {
      head: HEADS.down,
      torso: [NECK, COLLAR, SHOULDERS, KNIT, KNIT, KNIT, HANDS, '..KdLddddddddddLdK..', '..KDDDDDDDDDDDDDDK..', '..KKdDDDDDDDDDDdKK..'],
      legs: FRONT_LEGS.stand,
    },
  },
  // the guard, then the knee
  fighter: {
    actA: { head: HEADS.ring, torso: GUARD_TORSO, legs: FRONT_LEGS.stand },
    actB: {
      head: HEADS.ring,
      torso: GUARD_TORSO,
      legs: ['....KQQQK.KQQQQK....', '....KQQQK.KQQQQK....', '....KQQQK..KFFK.....', '...KFFFFK...........', '...KKKKKK...........'],
    },
  },
}

const mirror = (rows: readonly string[]): string[] => rows.map((row) => [...row].reverse().join(''))

const WALK_HEAD: Record<Facing, string[]> = {
  down: HEADS.down,
  up: HEADS.up,
  right: HEADS.right,
  left: mirror(HEADS.right),
}

const WALK_TORSO: Record<Facing, string[]> = {
  down: FRONT_TORSO,
  up: FRONT_TORSO,
  right: SIDE_TORSO,
  left: mirror(SIDE_TORSO),
}

const WALK_LEGS: Record<Facing, Record<Step, string[]>> = {
  down: FRONT_LEGS,
  up: FRONT_LEGS,
  right: SIDE_LEGS,
  left: { stand: mirror(SIDE_LEGS.stand), stepA: mirror(SIDE_LEGS.stepA), stepB: mirror(SIDE_LEGS.stepB) },
}

/** A walking or standing frame: the facing's head and torso over the step's legs. The fighter keeps his mongkhon on facing down. */
export function walkPose(profession: Profession, facing: Facing, step: Step): Pose {
  const head = facing === 'down' && profession === 'fighter' ? HEADS.ring : WALK_HEAD[facing]
  return { head, torso: WALK_TORSO[facing], legs: WALK_LEGS[facing][step] }
}

export const actionPose = (profession: Profession, frame: ActFrame): Pose => ACTIONS[profession][frame]

/** His dot eyes on the down facing head (x, y), for the blink. */
export const EYES: ReadonlyArray<readonly [number, number]> = [
  [6, 7],
  [13, 7],
]

// His traits quantised for the pixel world: the hair and beard lifted to the dark brown the outline reads
// in, so his head keeps its shape on the black window.
const BODY = {
  K: RPG.spriteLine,
  H: RPG.spriteHair,
  B: RPG.spriteHair,
  S: HERO_IDENTITY.skin,
  s: HERO_IDENTITY.skinShade,
  E: HERO_IDENTITY.eyes,
  F: RPG.spriteLine,
}

/** The colour key per profession: his own clothes and each profession's own kit. */
export const COLOURS: Record<Profession, Record<string, string>> = {
  // the teal shirt and jeans, and the pocket terminal
  engineer: { ...BODY, J: RPG.engineerShirt, P: RPG.jeans, Q: RPG.jeans, T: RPG.borderShade, G: RPG.green, g: RPG.duskHigh },
  // the black tee and black jeans, the sticks and the snare
  drummer: { ...BODY, J: RPG.drummerShirt, P: RPG.blackJeans, Q: RPG.blackJeans, L: RPG.stickWood, D: RPG.snare, d: RPG.border },
  // bare chested in red Muay Thai shorts with the gold waistband, bare feet, gold wraps, the white cord and bands
  fighter: { ...BODY, J: HERO_IDENTITY.skin, P: RPG.shorts, Q: HERO_IDENTITY.skin, F: HERO_IDENTITY.skin, Y: RPG.wraps, R: RPG.wraps, W: RPG.border },
}
