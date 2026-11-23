import { pixelRuns, type Run } from '@/lib/pixelRuns'
import { HERO_IDENTITY } from '@/lib/cv/heroIdentity'
import type { Profession } from '@/lib/cv/professions'
import { HERO_INK, SPRITE_INK, TRAIL } from './palette'

// Him as the map walker on the 16 bit overworld map: his short dark hair and full dark beard, his skin
// and eyes (HERO_IDENTITY) and his own clothes per profession, a shirt over trousers and brown shoes.
// 20 by 23 pixels, a head as big as the body, a black outline round every shape, two step frames for the
// map walk, two for his profession's action and the one fist victory pose on a cleared tile. The pixels
// are data: each part is rows of one letter a pixel, read through the outfit's colour key, and drawn as
// one rect per run of the same colour (spriteRuns).
//
// Keys: K outline, S skin, s skin shade (the nose), H hair, B beard, E eyes, T shirt, A hands, P trousers,
// p their shade, F shoes, M the mongkhon cord, D and d the field slate, L drumsticks.

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

export type Headgear = 'hair' | 'hairRing'

const HEADS: Record<Headgear, string[]> = {
  hair: ['.....KKKKKK.....', '...KKHHHHHHKK...', '..KHHHHHHHHHHK..', '..KHHHHHHHHHHK..', '..KHHHHHHHHHHK..', ...FACE],
  // the mongkhon tied round his head, its tail standing up behind
  hairRing: ['.....KKKKKK.MK..', '...KKHHHHHHKKMK.', '..KHHHHHHHHHHK..', '..KMMMMMMMMMMK..', '..KHHHHHHHHHHK..', ...FACE],
}

const SHOULDERS = '....KKTTTTTTTTKK....'
const CHEST = '...KTTTTTTTTTTTTK...'
const BELLY = '...KTTTTTTTTTTTTK...'
const HANDS = '...KAKTTTTTTTTKAK...'
const WAIST = '....KKTTTTTTTTKK....'

/** The torso frames, rows 13 to 17. */
export type TorsoFrame = 'idle' | 'walkA' | 'walkB' | 'actA' | 'actB' | 'cheer'

const BASE_TORSO: Record<Exclude<TorsoFrame, 'actA' | 'actB'>, string[]> = {
  idle: [SHOULDERS, CHEST, BELLY, HANDS, WAIST],
  // arms swing opposite to the legs: one hand forward, the other behind him
  walkA: [SHOULDERS, CHEST, BELLY, '..KAKTTTTTTTTKK.....', WAIST],
  walkB: [SHOULDERS, CHEST, BELLY, '.....KKTTTTTTTTKAK..', WAIST],
  // the victory pose on a cleared tile: one fist up
  cheer: ['....KKTTTTTTTTKKA...', '...KTTTTTTTTTTKT....', '...KTTTTTTTTTTTK....', '...KAKTTTTTTTTK.....', WAIST],
}

// One action per profession, two frames each.
const ACTIONS: Record<Profession, Record<'actA' | 'actB', string[]>> = {
  // System Engineer types on a field slate held in front of him; its screen flickers
  engineer: {
    actA: [SHOULDERS, CHEST, BELLY, '...KKADDDDDDDDAKK...', '....KKDddDDddDKK....'],
    actB: [SHOULDERS, CHEST, BELLY, '...KKDADDDDDDADKK...', '....KKddDDDDddKK....'],
  },
  // Musician: sticks raised over his shoulders, then down on the beat
  drummer: {
    actA: ['.L..KKTTTTTTTTKK..L.', '..LKTTTTTTTTTTTTKL..', '...ATTTTTTTTTTTTA...', '...KTKTTTTTTTTKTK...', WAIST],
    actB: [SHOULDERS, CHEST, BELLY, HANDS, '.LL.KKTTTTTTTTKK.LL.'],
  },
  // Martial Artist: gloves up in guard, then the right hand jabs out
  fighter: {
    actA: ['...AAKTTTTTTTTKAA...', '...AATTTTTTTTTTAA...', BELLY, '...KTKTTTTTTTTKTK...', WAIST],
    actB: ['...AAKTTTTTTTTKK....', '...AATTTTTTTTTTTTAA.', BELLY, '...KTKTTTTTTTTKTK...', WAIST],
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

/** The rows of a part as runs, each row centred in the sprite's width and placed from `top`. */
export const spriteRuns = (rows: readonly string[], top: number): Run[] =>
  rows.flatMap((row, index) => pixelRuns([row], top + index, (SPRITE.width - row.length) / 2))

const BODY = {
  K: SPRITE_INK.OUTLINE,
  S: HERO_IDENTITY.skin,
  s: HERO_IDENTITY.skinShade,
  H: HERO_IDENTITY.hair,
  B: HERO_IDENTITY.beard,
  E: HERO_IDENTITY.eyes,
  A: HERO_IDENTITY.skin,
  F: SPRITE_INK.SHOE,
}

export interface Outfit {
  headgear: Headgear
  colours: Record<string, string>
}

/** His own clothes per profession, with each profession's own kit. */
export const OUTFITS: Record<Profession, Outfit> = {
  // the teal shirt and jeans, and the teal field slate he types on
  engineer: { headgear: 'hair', colours: { ...BODY, T: HERO_INK.ENGINEER_SHIRT, P: HERO_INK.JEANS, p: HERO_INK.JEANS_DARK, D: TRAIL.RUNE, d: TRAIL.TEAL } },
  // the black tee and black jeans, and the lantern gold drumsticks
  drummer: { headgear: 'hair', colours: { ...BODY, T: HERO_INK.DRUMMER_SHIRT, P: HERO_INK.BLACK_JEANS, p: HERO_INK.BLACK_JEANS_DARK, L: TRAIL.LANTERN } },
  // bare chested in red shorts, gold gloves for the ring and the mongkhon round his head
  fighter: { headgear: 'hairRing', colours: { ...BODY, T: HERO_IDENTITY.skin, P: HERO_INK.SHORTS, p: HERO_INK.SHORTS_DARK, A: TRAIL.GOLD, M: TRAIL.PAGE } },
}
