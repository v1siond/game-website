import { HERO_IDENTITY } from '@/components/cv/heroIdentity'
import type { Profession } from '@/lib/cv/professions'
import { TRAIL } from './palette'

// Him as the map walker, a parody of the plumber hero on the 16 bit overworld map: a red cap with its
// brim, a red shirt under blue overalls with two gold buttons, white gloves and brown shoes, and his full
// dark beard where the hero's moustache would be. 20 by 23 pixels, a head as big as the body, a black
// outline round every shape, two step frames for the map walk, two for his profession's action and the
// one fist victory pose on a cleared tile. The pixels are data: each part is rows of one letter a pixel,
// read through the outfit's colour key, and drawn as one rect per run of the same colour (spriteRuns).
//
// Keys: K outline, S skin, s skin shade (the nose), H hair, B beard, E eyes, C and c the cap and its brim,
// Y buttons, T shirt, P overalls, p their shade, G gloves, F shoes, M the mongkhon cord, D and d the field
// slate, L drumsticks.

export const SPRITE = { width: 20, height: 23 } as const

const TORSO_TOP = 13
const LEGS_TOP = 18

const FACE = [
  '..KHHSSSSSSHHK..',
  '..KHSSESSESSHK..',
  '..KHSSESSESSHK..',
  '..KSSSSssSSSSK..',
  '..KBBBssssBBBK..',
  '..KBBBBBBBBBBK..',
  '...KBBBBBBBBK...',
  '....KKKKKKKK....',
]

export type Headgear = 'cap' | 'capRing'

const HEADS: Record<Headgear, string[]> = {
  cap: [
    '.....KKKKKK.....',
    '...KKCCCCCCKK...',
    '..KCCCCYYCCCCK..',
    '..KCCCCCCCCCCK..',
    '.KccccccccccccK.',
    ...FACE,
  ],
  // the mongkhon tied over the cap, its tail standing up behind
  capRing: [
    '.....KKKKKK.MK..',
    '...KKCCCCCCKKMK.',
    '..KCCCCYYCCCCK..',
    '..KMMMMMMMMMMK..',
    '.KccccccccccccK.',
    ...FACE,
  ],
}

const SHOULDERS = '....KKTPTTTTPTKK....'
const CHEST = '...KTTTPYTTYPTTTK...'
const BELLY = '...KTTPPPPPPPPTTK...'
const HANDS = '...KGKPPPPPPPPKGK...'
const WAIST = '....KKPPPPPPPPKK....'

/** The torso frames, rows 13 to 17. */
export type TorsoFrame = 'idle' | 'walkA' | 'walkB' | 'actA' | 'actB' | 'cheer'

const BASE_TORSO: Record<Exclude<TorsoFrame, 'actA' | 'actB'>, string[]> = {
  idle: [SHOULDERS, CHEST, BELLY, HANDS, WAIST],
  // arms swing opposite to the legs: one glove forward, the other behind him
  walkA: [SHOULDERS, CHEST, BELLY, '..KGKPPPPPPPPKK.....', WAIST],
  walkB: [SHOULDERS, CHEST, BELLY, '.....KKPPPPPPPPKGK..', WAIST],
  // the victory pose on a cleared tile: one fist up
  cheer: ['....KKTPTTTTPTKKG...', '...KTTTPYTTYPTKT....', '...KTTPPPPPPPPTK....', '...KGKPPPPPPPPK.....', WAIST],
}

// One action per profession, two frames each.
const ACTIONS: Record<Profession, Record<'actA' | 'actB', string[]>> = {
  // System Engineer types on a field slate held in front of him; its screen flickers
  engineer: {
    actA: [SHOULDERS, CHEST, BELLY, '...KKGDDDDDDDDGKK...', '....KKDddDDddDKK....'],
    actB: [SHOULDERS, CHEST, BELLY, '...KKDGDDDDDDGDKK...', '....KKddDDDDddKK....'],
  },
  // Musician: sticks raised over his shoulders, then down on the beat
  drummer: {
    actA: ['.L..KKTPTTTTPTKK..L.', '..LKTTTPYTTYPTTTKL..', '...GTTPPPPPPPPTTG...', '...KTKPPPPPPPPKTK...', WAIST],
    actB: [SHOULDERS, CHEST, BELLY, HANDS, '.LL.KKPPPPPPPPKK.LL.'],
  },
  // Martial Artist: gloves up in guard, then the right hand jabs out
  fighter: {
    actA: ['...GGKTPTTTTPTKGG...', '...GGTTPYTTYPTTGG...', BELLY, '...KTKPPPPPPPPKTK...', WAIST],
    actB: ['...GGKTPTTTTPTKK....', '...GGTTPYTTYPTTTTGG.', BELLY, '...KTKPPPPPPPPKTK...', WAIST],
  },
}

/** The leg frames, rows 18 to 22. */
export type LegFrame = 'stand' | 'walkA' | 'walkB'

const HIPS = '.....KPPPPPPPPK.....'
const THIGHS = '.....KPPpKKpPPK.....'

const LEGS: Record<LegFrame, string[]> = {
  stand: [HIPS, THIGHS, '.....KPPK..KPPK.....', '....KFFFK..KFFFK....', '....KKKKK..KKKKK....'],
  walkA: [HIPS, THIGHS, '....KPPK...KPK......', '...KFFFK....KFFK....', '...KKKK.....KKKK....'],
  walkB: [HIPS, THIGHS, '......KPK...KPPK....', '....KFFK....KFFFK...', '....KKKK.....KKKKK..'],
}

export const torsoRows = (profession: Profession, frame: TorsoFrame): string[] =>
  frame === 'actA' || frame === 'actB' ? ACTIONS[profession][frame] : BASE_TORSO[frame]

export const legRows = (frame: LegFrame): string[] => LEGS[frame]

export const headRows = (headgear: Headgear): string[] => HEADS[headgear]

export const PART_TOP = { head: 0, torso: TORSO_TOP, legs: LEGS_TOP } as const

/** Where his eyes are, for the blink: the top row of each tall eye. */
export const EYES: ReadonlyArray<readonly [number, number]> = [
  [8, 6],
  [11, 6],
]

export interface Run {
  x: number
  y: number
  width: number
  key: string
}

/**
 * The rows of a part as runs of one colour key, each row centred in the sprite's width and placed from
 * `top`. Transparent pixels ('.') make no run.
 */
export function spriteRuns(rows: readonly string[], top: number): Run[] {
  return rows.flatMap((row, index) => {
    const left = (SPRITE.width - row.length) / 2
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

const OUTLINE = '#160e08'
const CAP_RED = '#c8301f'
const BRIM_RED = '#86200f'
const OVERALL_SHADE = '#1f3f78'
const GLOVE_WHITE = '#fbf8ee'
const SHOE_BROWN = '#6b3a1c'

const COSTUME = {
  K: OUTLINE,
  S: HERO_IDENTITY.skin,
  s: HERO_IDENTITY.skinShade,
  H: HERO_IDENTITY.hair,
  B: HERO_IDENTITY.beard,
  E: HERO_IDENTITY.eyes,
  C: CAP_RED,
  c: BRIM_RED,
  Y: TRAIL.GOLD,
  T: CAP_RED,
  P: TRAIL.BLUE,
  p: OVERALL_SHADE,
  G: GLOVE_WHITE,
  F: SHOE_BROWN,
}

export interface Outfit {
  headgear: Headgear
  colours: Record<string, string>
}

/** The costume per profession: the same cap and overalls, with each profession's own kit. */
export const OUTFITS: Record<Profession, Outfit> = {
  // the teal field slate he types on
  engineer: { headgear: 'cap', colours: { ...COSTUME, D: TRAIL.RUNE, d: TRAIL.TEAL } },
  // the lantern gold drumsticks
  drummer: { headgear: 'cap', colours: { ...COSTUME, L: TRAIL.LANTERN } },
  // gold gloves for the ring and the mongkhon over the cap
  fighter: { headgear: 'capRing', colours: { ...COSTUME, G: TRAIL.GOLD, M: TRAIL.PAGE } },
}
