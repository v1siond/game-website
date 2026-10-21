import { HERO_IDENTITY } from '@/components/cv/heroIdentity'
import type { Profession } from '@/lib/cv/professions'
import { RPG } from './palette'

// Him as the room walker, a parody of the striped sweater kid of the lo-fi pixel RPG (its overworld sprite
// is 19 by 29 pixels, a head as wide as the body is tall, one dark outline the colour of the hair, flat
// fills, no shading): a blue sweater with two magenta stripes across the chest, brown shorts, bare shins
// and dark shoes, with his own face, short dark hair, the full dark beard and two dot eyes. 20 by 30
// pixels: a 15 row head over a 10 row torso and 5 rows of legs.
//
// Four facings (down, up, right, left as the mirror of right), each with two step frames; one action of
// two frames per profession, facing down: the System Engineer types on a pocket terminal whose screen
// scrolls, the Musician raises his sticks over a snare and brings them down on it, the Martial Artist
// stands in guard with red gloves, his own mongkhon (the corded Muay Thai headband, its tail up behind)
// and white prajioud on the arms, then throws the knee. The red heart (his soul) can show over his chest.
//
// The pixels are data: rows of one letter a pixel read through the outfit's colour key and drawn as one
// rect per run of one colour (pixelRuns). Keys: K outline, H hair, B beard, S skin, s skin shade (ears,
// nose), E eyes, J sweater, M stripe, P shorts, F shoes, Y waistband, R gloves, W white cord and bands,
// T terminal case, G and g its screen, L sticks, D and d the snare and its rim, h the heart.

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

// ---- the torso, 10 rows (neck to shorts) ----

const NECK = '......KKSSSSKK......'
const COLLAR = '....KKKJJJJJJKKK....'
const SHOULDERS = '...KJKJJJJJJJJKJK...'
const STRIPE = '..KJJKMMMMMMMMKJJK..'
const KNIT = '..KJJKJJJJJJJJKJJK..'
const HANDS = '..KSSKJJJJJJJJKSSK..'
const HEM = '..KKKKJJJJJJJJKKKK..'
const SHORTS = '.....KPPPPPPPPK.....'
const SPLIT = '.....KPPPKKPPPK.....'

const FRONT_TORSO = [NECK, COLLAR, SHOULDERS, STRIPE, KNIT, STRIPE, HANDS, HEM, SHORTS, SPLIT]

const SIDE_TORSO = [
  NECK,
  '.....KKJJJJJJKK.....',
  '.....KJJJJJJJJK.....',
  '.....KMMMJJMMMK.....',
  '.....KJJJJJJJJK.....',
  '.....KMMMJJMMMK.....',
  '.....KJJJSSJJJK.....',
  '.....KKKKKKKKKK.....',
  '......KPPPPPPK......',
  '......KPPPPPPK......',
]

// ---- the legs, 5 rows ----

const FRONT_LEGS: Record<Step, string[]> = {
  stand: ['....KSSSK..KSSSK....', '....KSSSK..KSSSK....', '....KFFFK..KFFFK....', '...KFFFFK..KFFFFK...', '...KKKKKK..KKKKKK...'],
  stepA: ['....KSSSK..KSSSK....', '....KSSSK..KFFFK....', '....KFFFK.KFFFFK....', '...KFFFFK.KKKKKK....', '...KKKKKK...........'],
  stepB: ['....KSSSK..KSSSK....', '....KFFFK..KSSSK....', '....KFFFFK.KFFFK....', '....KKKKKK.KFFFFK...', '...........KKKKKK...'],
}

const SIDE_LEGS: Record<Step, string[]> = {
  stand: ['.......KSSSSK.......', '.......KSSSSK.......', '.......KFFFFK.......', '.......KFFFFFK......', '.......KKKKKKK......'],
  stepA: ['......KSSKKSSK......', '.....KSSK..KSSK.....', '....KFFK....KFFK....', '....KFFFK...KFFFK...', '....KKKKK...KKKKK...'],
  stepB: ['.......KSSSSK.......', '.......KSSSSK.......', '.......KFFFFK.......', '.......KFFFFFK......', '.......KKKKKKK......'],
}

// ---- the profession actions, two frames each, facing down ----

export type ActFrame = 'actA' | 'actB'

export interface Pose {
  head: string[]
  torso: string[]
  legs: string[]
}

const GUARD_TORSO = [
  NECK,
  '...KRRKJJJJJJKRRK...',
  '...KRRKJJJJJJKRRK...',
  '..KWJKMMMMMMMMKJWK..',
  KNIT,
  '..KKKKMMMMMMMMKKKK..',
  '.....KJJJJJJJJK.....',
  '.....KYYYYYYYYK.....',
  SHORTS,
  SPLIT,
]

const ACTIONS: Record<Profession, Record<ActFrame, Pose>> = {
  // the pocket terminal held at the chest, its screen scrolling as he types
  engineer: {
    actA: {
      head: HEADS.down,
      torso: [NECK, COLLAR, SHOULDERS, STRIPE, '..KTTTTTTTTTTTTTTK..', '..KTGGgGGGgGgGGgTK..', '..KTgGGgGgGGGgGgTK..', '..KSSTTTTTTTTTTSSK..', SHORTS, SPLIT],
      legs: FRONT_LEGS.stand,
    },
    actB: {
      head: HEADS.down,
      torso: [NECK, COLLAR, SHOULDERS, STRIPE, '..KTTTTTTTTTTTTTTK..', '..KTgGGgGgGGGgGgTK..', '..KTGgGGGgGGgGGGTK..', '..KTSSTTTTTTTTSSTK..', SHORTS, SPLIT],
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
        '...KKMMMMMMMMMMKK...',
        '....KJJJJJJJJJJK....',
        '....KMMMMMMMMMMK....',
        '....KJJJJJJJJJJK....',
        '..KddddddddddddddK..',
        '..KDDDDDDDDDDDDDDK..',
        '..KKdDDDDDDDDDDdKK..',
      ],
      legs: FRONT_LEGS.stand,
    },
    actB: {
      head: HEADS.down,
      torso: [NECK, COLLAR, SHOULDERS, STRIPE, KNIT, STRIPE, HANDS, '..KdLddddddddddLdK..', '..KDDDDDDDDDDDDDDK..', '..KKdDDDDDDDDDDdKK..'],
      legs: FRONT_LEGS.stand,
    },
  },
  // the guard, then the knee
  fighter: {
    actA: { head: HEADS.ring, torso: GUARD_TORSO, legs: FRONT_LEGS.stand },
    actB: {
      head: HEADS.ring,
      torso: GUARD_TORSO,
      legs: ['....KSSSK.KSSSSK....', '....KSSSK.KSSSSK....', '....KSSSK..KFFK.....', '...KFFFFK...........', '...KKKKKK...........'],
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

/** The heart over his chest, 6 by 4 pixels, its top left corner. */
export const HEART = { x: 7, y: 18, rows: ['hh..hh', 'hhhhhh', '.hhhh.', '..hh..'] } as const

export interface Run {
  x: number
  y: number
  width: number
  key: string
}

/** The rows as runs of one colour key placed from `top`; transparent pixels ('.') make no run. */
export function pixelRuns(rows: readonly string[], top: number, left = 0): Run[] {
  return rows.flatMap((row, index) => {
    const runs: Run[] = []
    let start = 0
    for (let x = 1; x <= row.length; x += 1) {
      if (row[x] === row[start]) continue
      if (row[start] !== '.') runs.push({ x: left + start, y: top + index, width: x - start, key: row[start] })
      start = x
    }
    return runs
  })
}

// His traits quantised for the pixel world: the hair and beard lifted to the dark brown the room's
// outline reads in, so his head keeps its shape on the black battle screen.
const SWEATER = {
  K: RPG.spriteLine,
  H: RPG.spriteHair,
  B: RPG.spriteHair,
  S: HERO_IDENTITY.skin,
  s: HERO_IDENTITY.skinShade,
  E: HERO_IDENTITY.eyes,
  J: RPG.sweater,
  M: RPG.sweaterStripe,
  P: RPG.spriteShorts,
  F: RPG.spriteLine,
  h: RPG.soul,
}

/** The colour key per profession: the same sweater, each profession's own kit. */
export const COLOURS: Record<Profession, Record<string, string>> = {
  engineer: { ...SWEATER, T: RPG.borderShade, G: RPG.green, g: RPG.haze },
  drummer: { ...SWEATER, L: RPG.stickWood, D: RPG.snare, d: RPG.border },
  // red Muay Thai shorts with the gold waistband, bare feet, red gloves, the white cord and bands
  fighter: { ...SWEATER, P: RPG.soul, F: HERO_IDENTITY.skin, Y: RPG.gold, R: RPG.hpBack, W: RPG.border },
}
