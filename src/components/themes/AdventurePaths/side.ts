import { HERO_IDENTITY } from '@/lib/cv/heroIdentity'
import type { Profession } from '@/lib/cv/professions'
import { FOE_INK, HERO_INK, SPRITE_INK, TRAIL } from './palette'

// The side view cast of the levels, drawn as pixel rows (one letter a pixel, '.' clear) like the top view
// map walker in sprite.ts. Him in the 16 bit side view, 16 by 26, facing right: his short dark hair, his
// full dark beard, his skin and eyes (HERO_IDENTITY) and his own clothes per profession, a shirt over
// trousers and brown shoes; the Martial Artist bare chested in shorts and gold gloves with the mongkhon.
// Frames from the genre's own set: stand, the two run frames, the knee up jump, the stomp (feet together,
// arms up), the kick, the hang from a rope, the cheer, the crate held over his head and the throw. The
// foe: his own critter, a round shelled beetle on six legs (two step frames, squashed flat, and tipped on
// its back).
//
// Hero keys: K outline, M the mongkhon cord, S skin, s nose shade, H hair, B beard, E eyes, T shirt,
// A hands, P trousers, Q their lower legs, F shoes.

export const HERO = { width: 16, height: 26 } as const

const HEAD_TOP = 2
const TORSO_TOP = 13
const LEGS_TOP = 19

const FACE = [
  '..KHHSSSSESSK...',
  '..KHHSSSSESSSK..',
  '..KHSSSSSSSsssK.',
  '..KHBSSBBBBBBK..',
  '...KBBBBBBBBBK..',
  '....KBBBBBBBK...',
]

const HAIR_TOP = ['.....KKKKKK.....', '...KKHHHHHHKK...']

const HEADS = {
  hair: [...HAIR_TOP, '..KHHHHHHHHHHK..', '..KHHHHHHHHHHHK.', '..KHHHHHHSSSSK..', ...FACE],
  // the mongkhon tied round his head, its tail flying behind
  hairRing: [...HAIR_TOP, '.KKMMMMMMMMMMK..', 'KMKHHHHHHHHHHHK.', '..KHHHHHHSSSSK..', ...FACE],
} as const

export type HeroHeadgear = keyof typeof HEADS

const TORSOS = {
  stand: [
    '....KTTTTTTK....',
    '...KTTTTTTTTK...',
    '...KTTKTTKTTK...',
    '...KTTKTTKTTK...',
    '...KTTKAAKTTK...',
    '....KTTKKTTTK...',
  ],
  // the near arm swung back, hand behind him
  armBack: [
    '....KTTTTTTK....',
    '..KKTTTTTTTTK...',
    '.KTTKTTTTTTTK...',
    'KAAKTTTTTTTK....',
    'KAAKTTTTTTTK....',
    '.KK.KTTTTTTK....',
  ],
  // the near arm swung forward, hand in front
  armFront: [
    '....KTTTTTTK....',
    '...KTTTTTTTTKK..',
    '...KTTTTTTKTTK..',
    '...KTTTTTTKKAAK.',
    '...KTTTTTTTKAAK.',
    '....KTTTTTTKKK..',
  ],
  // the near arm up past his head (the fist is in the overlay), the far hand out behind
  fistUp: [
    '....KTTTTTTKTK..',
    '...KTTTTTTTTK...',
    '...KTTTTTTTTK...',
    '.KAKTTTTTTTTK...',
    '..KKTTTTTTTK....',
    '....KTTTTTTK....',
  ],
  // both arms flung up and out as he drops on a foe
  armsUp: [
    'KAK.KTTTTTTK.KAK',
    '.KTKTTTTTTTTKTK.',
    '..KKTTTTTTTTKK..',
    '....KTTTTTTTK...',
    '....KTTTTTTTK...',
    '....KTTTTTTTK...',
  ],
  // both hands up on the rope in front of him (the hands are in the overlay)
  hold: [
    '....KTTTTTTTKK..',
    '...KTTTTTTTTK...',
    '...KTTTTTTTTK...',
    '...KTTTTTTTTK...',
    '....KTTTTTTTK...',
    '....KTTTTTTK....',
  ],
} as const

const HIPS = '....KPPPPPPPK...'

const LEGS = {
  stand: [
    HIPS,
    '....KPPPKPPPK...',
    '....KPPK.KPPK...',
    '....KQQK.KQQK...',
    '....KFFK.KFFFK..',
    '...KFFFK.KFFFFK.',
    '...KKKKK.KKKKKK.',
  ],
  // the long stride: near leg reaching forward, far leg pushing off behind
  stride: [
    HIPS,
    '...KPPPKKPPPPK..',
    '..KPPK....KPPPK.',
    '.KQQK......KQQK.',
    'KFFK.......KFFFK',
    '.KK........KKKKK',
    '................',
  ],
  // the passing step: the far foot tucked up behind, the near leg under him
  passing: [
    HIPS,
    '....KPPPPPPK....',
    '....KPPKKPPK....',
    '...KFFK.KQQK....',
    '...KKK..KQQK....',
    '........KFFFK...',
    '........KKKKK...',
  ],
  // the jump: near knee driven up in front, far leg hanging
  knee: [
    HIPS,
    '....KPPPPPPPPKK.',
    '....KPPKKKPPFFK.',
    '...KQQK..KKFFFK.',
    '...KQQK...KKKK..',
    '..KFFFK.........',
    '..KKKKK.........',
  ],
  // feet together, toes down, for the stomp
  together: [
    HIPS,
    '....KPPPKPPPK...',
    '.....KPPKPPK....',
    '.....KQQKQQK....',
    '.....KFFKFFFK...',
    '.....KFFKFFFK...',
    '.....KKKKKKKK...',
  ],
  // the kick: the near leg straight out in front, sole forward
  kick: [
    '....KPPPPPPPKK..',
    '....KPPPPPPPPPK.',
    '....KPPKKKKPFFFK',
    '....KQQK...KKKKK',
    '....KQQK........',
    '...KFFFK........',
    '...KKKKK........',
  ],
  // knees drawn up and feet hooked round the rope
  hook: [
    HIPS,
    '....KPPPPPPK....',
    '.....KPPPPPK....',
    '.....KQQKQQK....',
    '.....KQQKFFFK...',
    '.....KFFKKKKK...',
    '.....KKKK.......',
  ],
} as const

// Parts drawn over the head: the raised fist, and the two hands on the rope.
const OVERLAYS = {
  fist: ['............KKK.', '...........KAAAK', '...........KAAAK', '............KTK.', '............KTK.', '............KTK.'],
  grip: ['...........KAAK.', '...........KAAK.', '..........KTKK..', '..........KTK...', '...........KAAK.', '...........KAAK.', '..........KTK...'],
} as const

export type HeroPose = 'stand' | 'runA' | 'runB' | 'jump' | 'stomp' | 'kick' | 'grab' | 'cheer' | 'carry' | 'throw'

interface PoseParts {
  torso: keyof typeof TORSOS
  legs: keyof typeof LEGS
  overlay?: keyof typeof OVERLAYS
}

const POSES: Record<HeroPose, PoseParts> = {
  stand: { torso: 'stand', legs: 'stand' },
  // arms swing opposite to the legs
  runA: { torso: 'armBack', legs: 'stride' },
  runB: { torso: 'armFront', legs: 'passing' },
  jump: { torso: 'fistUp', legs: 'knee', overlay: 'fist' },
  stomp: { torso: 'armsUp', legs: 'together' },
  kick: { torso: 'armBack', legs: 'kick' },
  grab: { torso: 'hold', legs: 'hook', overlay: 'grip' },
  cheer: { torso: 'fistUp', legs: 'stand', overlay: 'fist' },
  // the crate held up over his head in both hands, then flung forward off the stride
  carry: { torso: 'hold', legs: 'stand', overlay: 'grip' },
  throw: { torso: 'armFront', legs: 'stride' },
}

export const HERO_POSES = Object.keys(POSES) as HeroPose[]

/** What his sprite shows on screen: a still pose, or the two frame run. */
export type HeroFrame = Exclude<HeroPose, 'runA' | 'runB'> | 'run'

export interface SpritePart {
  rows: readonly string[]
  top: number
}

/** The parts of a pose in drawing order, each with the row it starts on. */
export function heroParts(pose: HeroPose, headgear: HeroHeadgear): SpritePart[] {
  const { torso, legs, overlay } = POSES[pose]
  const parts: SpritePart[] = [
    { rows: LEGS[legs], top: LEGS_TOP },
    { rows: TORSOS[torso], top: TORSO_TOP },
    { rows: HEADS[headgear], top: HEAD_TOP },
  ]
  return overlay ? [...parts, { rows: OVERLAYS[overlay], top: 0 }] : parts
}

/** Where his eye is, for the blink. */
export const HERO_EYE = { x: 9, y: HEAD_TOP + 5, height: 2 } as const

const BODY = {
  K: SPRITE_INK.OUTLINE,
  M: TRAIL.PAGE,
  S: HERO_IDENTITY.skin,
  s: HERO_IDENTITY.skinShade,
  H: HERO_IDENTITY.hair,
  B: HERO_IDENTITY.beard,
  E: HERO_IDENTITY.eyes,
  A: HERO_IDENTITY.skin,
  F: SPRITE_INK.SHOE,
}

export interface HeroOutfit {
  headgear: HeroHeadgear
  colours: Record<string, string>
}

/** His own clothes per profession: the System Engineer's teal shirt and jeans, the Musician's black tee and
 *  black jeans, the Martial Artist bare chested in red shorts (bare shins) with gold gloves and the mongkhon. */
export const HERO_OUTFITS: Record<Profession, HeroOutfit> = {
  engineer: { headgear: 'hair', colours: { ...BODY, T: HERO_INK.ENGINEER_SHIRT, P: HERO_INK.JEANS, Q: HERO_INK.JEANS } },
  drummer: { headgear: 'hair', colours: { ...BODY, T: HERO_INK.DRUMMER_SHIRT, P: HERO_INK.BLACK_JEANS, Q: HERO_INK.BLACK_JEANS } },
  fighter: {
    headgear: 'hairRing',
    colours: { ...BODY, T: HERO_IDENTITY.skin, A: HERO_INK.FIGHT_GLOVE, P: HERO_INK.SHORTS, Q: HERO_IDENTITY.skin },
  },
}

// The foe, his own critter. Keys: K outline, N shell, n its shine, O underside, W eye white, E pupil, F legs.

export const FOE = { width: 12, height: 16 } as const

const SHELL = ['...KKKKK....', '..KNNKNNK...', '.KNnNKNnNKK.', 'KNNNNKNNNKWK', 'KNNNNKNNNKEK', 'KOOOOOOOOOKK', '.KKKKKKKKKK.']

const STEP_A = ['.KFK.KFK.KFK', 'KFK.KFK.KFK.']
const STEP_B = ['KFK.KFK.KFK.', '.KFK.KFK.KFK']

const blank = (count: number) => Array.from({ length: count }, () => '............')

const FOE_FRAMES = {
  critterA: [...blank(7), ...SHELL, ...STEP_A],
  critterB: [...blank(7), ...SHELL, ...STEP_B],
  critterFlat: [...blank(12), '.KKKKKKKKKK.', 'KNNNNKNNNKWK', 'KOOOOOOOOOEK', '.KKKKKKKKKK.'],
  // knocked over: on its back, legs in the air
  critterTipped: [...blank(7), ...STEP_B, ...[...SHELL].reverse()],
} as const

export type FoeFrame = keyof typeof FOE_FRAMES

export const FOE_FRAME_NAMES = Object.keys(FOE_FRAMES) as FoeFrame[]

export const foeRows = (frame: FoeFrame): readonly string[] => FOE_FRAMES[frame]

const CRITTER = { K: SPRITE_INK.OUTLINE, N: FOE_INK.SHELL, n: FOE_INK.SHINE, O: FOE_INK.UNDERSIDE, W: FOE_INK.WHITE, E: SPRITE_INK.OUTLINE, F: FOE_INK.LEGS }

/** The critter's colours, the same in every frame. */
export const FOE_COLOURS: Record<string, string> = CRITTER
