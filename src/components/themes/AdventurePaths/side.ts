import { HERO_IDENTITY } from '@/components/cv/heroIdentity'
import type { Profession } from '@/lib/cv/professions'
import { TRAIL } from './palette'

// The side view cast of the levels, drawn as pixel rows (one letter a pixel, '.' clear) like the top view
// map walker in sprite.ts. Him: a parody of the plumber hero in the 16 bit side view, 16 by 26, facing
// right: the red cap with its long brim, red shirt under blue overalls with a gold button, white gloves,
// brown shoes, and his full dark beard where the moustache would be (skin, hair, beard and eyes from
// HERO_IDENTITY). Frames from the game's own set: stand, the two run frames, the fist up jump, the stomp
// (feet together, arms up), the kick, the grab on the flagpole, and the cheer. The foes: the round
// walking mushroom (two step frames and squashed flat), the turtle (two step frames and its empty shell)
// and the biting plant (mouth open and shut).
//
// Hero keys: K outline, C cap, c brim, M the mongkhon cord, Y button, S skin, s nose shade, H hair, B beard,
// E eyes, T shirt, P overalls, G gloves, F shoes.

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

const CAP_DOME = ['.....KKKKKK.....', '...KKCCCCCCKK...']

const HEADS = {
  cap: [...CAP_DOME, '..KCCCCCCCCCCK..', '..KCCCCCCCYYCK..', '..KHcccccccccccK', ...FACE],
  // the mongkhon tied round the cap, its tail flying behind
  capRing: [...CAP_DOME, '.KKMMMMMMMMMMK..', 'KMKCCCCCCCYYCK..', '..KHcccccccccccK', ...FACE],
} as const

export type HeroHeadgear = keyof typeof HEADS

const TORSOS = {
  stand: [
    '....KTTTTTTK....',
    '...KTTTTTTTTK...',
    '...KPPKTTKPPK...',
    '...KPPKTTKYPK...',
    '...KPPKGGKPPK...',
    '....KPPKKPPPK...',
  ],
  // the near arm swung back, glove behind him
  armBack: [
    '....KTTTTTTK....',
    '..KKTTTTTTTTK...',
    '.KTTKPPPPPPPK...',
    'KGGKPPPPYPPK....',
    'KGGKPPPPPPPK....',
    '.KK.KPPPPPPK....',
  ],
  // the near arm swung forward, glove in front
  armFront: [
    '....KTTTTTTK....',
    '...KTTTTTTTTKK..',
    '...KPPPPPPKTTK..',
    '...KPPPPYPKKGGK.',
    '...KPPPPPPPKGGK.',
    '....KPPPPPPKKK..',
  ],
  // the near arm up past his cap (the fist is in the overlay), the far glove out behind
  fistUp: [
    '....KTTTTTTKTK..',
    '...KTTTTTTTTK...',
    '...KPPPPPYPPK...',
    '.KGKPPPPPPPPK...',
    '..KKPPPPPPPK....',
    '....KPPPPPPK....',
  ],
  // both arms flung up and out as he drops on a foe
  armsUp: [
    'KGK.KTTTTTTK.KGK',
    '.KTKTTTTTTTTKTK.',
    '..KKPPPPPYPPKK..',
    '....KPPPPPPPK...',
    '....KPPPPPPPK...',
    '....KPPPPPPPK...',
  ],
  // both hands up on the pole in front of him (the gloves are in the overlay)
  hold: [
    '....KTTTTTTTKK..',
    '...KTTTTTTTTK...',
    '...KPPPPPPYPK...',
    '...KPPPPPPPPK...',
    '....KPPPPPPPK...',
    '....KPPPPPPK....',
  ],
} as const

const HIPS = '....KPPPPPPPK...'

const LEGS = {
  stand: [
    HIPS,
    '....KPPPKPPPK...',
    '....KPPK.KPPK...',
    '....KPPK.KPPK...',
    '....KFFK.KFFFK..',
    '...KFFFK.KFFFFK.',
    '...KKKKK.KKKKKK.',
  ],
  // the long stride: near leg reaching forward, far leg pushing off behind
  stride: [
    HIPS,
    '...KPPPKKPPPPK..',
    '..KPPK....KPPPK.',
    '.KPPK......KPPK.',
    'KFFK.......KFFFK',
    '.KK........KKKKK',
    '................',
  ],
  // the passing step: the far foot tucked up behind, the near leg under him
  passing: [
    HIPS,
    '....KPPPPPPK....',
    '....KPPKKPPK....',
    '...KFFK.KPPK....',
    '...KKK..KPPK....',
    '........KFFFK...',
    '........KKKKK...',
  ],
  // the jump: near knee driven up in front, far leg hanging
  knee: [
    HIPS,
    '....KPPPPPPPPKK.',
    '....KPPKKKPPFFK.',
    '...KPPK..KKFFFK.',
    '...KPPK...KKKK..',
    '..KFFFK.........',
    '..KKKKK.........',
  ],
  // feet together, toes down, for the stomp
  together: [
    HIPS,
    '....KPPPKPPPK...',
    '.....KPPKPPK....',
    '.....KPPKPPK....',
    '.....KFFKFFFK...',
    '.....KFFKFFFK...',
    '.....KKKKKKKK...',
  ],
  // the kick: the near leg straight out in front, sole forward
  kick: [
    '....KPPPPPPPKK..',
    '....KPPPPPPPPPK.',
    '....KPPKKKKPFFFK',
    '....KPPK...KKKKK',
    '....KPPK........',
    '...KFFFK........',
    '...KKKKK........',
  ],
  // knees drawn up and feet hooked on the pole
  hook: [
    HIPS,
    '....KPPPPPPK....',
    '.....KPPPPPK....',
    '.....KPPKPPK....',
    '.....KPPKFFFK...',
    '.....KFFKKKKK...',
    '.....KKKK.......',
  ],
} as const

// Parts drawn over the head: the raised fist, and the two hands on the pole.
const OVERLAYS = {
  fist: ['............KKK.', '...........KGGGK', '...........KGGGK', '............KTK.', '............KTK.', '............KTK.'],
  grip: ['...........KGGK.', '...........KGGK.', '..........KTKK..', '..........KTK...', '...........KGGK.', '...........KGGK.', '..........KTK...'],
} as const

export type HeroPose = 'stand' | 'runA' | 'runB' | 'jump' | 'stomp' | 'kick' | 'grab' | 'cheer'

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

const OUTLINE = '#160e08'

const COSTUME = {
  K: OUTLINE,
  C: '#d8281c',
  c: '#8e1a10',
  T: '#d8281c',
  M: TRAIL.PAGE,
  Y: '#f8d038',
  S: HERO_IDENTITY.skin,
  s: HERO_IDENTITY.skinShade,
  H: HERO_IDENTITY.hair,
  B: HERO_IDENTITY.beard,
  E: HERO_IDENTITY.eyes,
  P: '#2a58c8',
  G: '#fbf8ee',
  F: '#6b3a1c',
}

export interface HeroOutfit {
  headgear: HeroHeadgear
  colours: Record<string, string>
}

/** The same cap and overalls for every profession; the Martial Artist wears gold gloves and the mongkhon. */
export const HERO_OUTFITS: Record<Profession, HeroOutfit> = {
  engineer: { headgear: 'cap', colours: COSTUME },
  drummer: { headgear: 'cap', colours: COSTUME },
  fighter: { headgear: 'capRing', colours: { ...COSTUME, G: '#f0b030' } },
}

// The foes. Keys: K outline, N body, O underside, W white, E pupil, F feet, L shell, l shell shade,
// Y skin, R shoes, D mouth, V stem and leaves, v leaf shade.

export const FOE = { width: 12, height: 16 } as const

const MUSHROOM_HEAD = [
  '....KKKK....',
  '..KKNNNNKK..',
  '.KNNNNNNNNK.',
  'KNWWNNNNWWNK',
  'KNWEKNNKEWNK',
  'KNWEKNNKEWNK',
  'KNNNNNNNNNNK',
  '.KNNOOOONNK.',
  '..KOOOOOOK..',
]

const TURTLE_TOP = [
  '........KKK.',
  '.......KYYYK',
  '.......KYEYK',
  '.......KYYYK',
  '...KKKKKYYK.',
  '..KLLLLlKYK.',
  '.KLLlLLLlKYK',
  '.KLlLLLlLKK.',
  'KLLLLlLLLLK.',
  'KWWWWWWWWWK.',
]

const PLANT_STEM = ['....KVVK....', '.KKKKVVKKKK.', 'KVVvVKVVvVVK', '.KKVVVVVVKK.', '....KVVK....', '....KVVK....']

const blank = (count: number) => Array.from({ length: count }, () => '............')

const FOE_FRAMES = {
  walkerA: [...blank(4), ...MUSHROOM_HEAD, '.KFFK..KFFK.', 'KFFFK..KFFFK', 'KKKK....KKKK'],
  walkerB: [...blank(4), ...MUSHROOM_HEAD, '..KFFKKFFK..', '..KFFKKFFK..', '..KKKKKKKK..'],
  walkerFlat: [...blank(12), '.KKKKKKKKKK.', 'KNNWEKKEWNNK', 'KOOOOOOOOOOK', '.KKKKKKKKKK.'],
  turtleA: [...blank(2), ...TURTLE_TOP, '.KYYKKKYYK..', '.KYYK.KYYK..', 'KRRRK.KRRRK.', 'KKKKK.KKKKK.'],
  turtleB: [...blank(2), ...TURTLE_TOP, '..KYYKYYK...', '..KYYKYYK...', '.KRRRKRRRK..', '.KKKKKKKKK..'],
  shell: [...blank(10), '..KKKKKKK...', '.KLLlLLLlK..', 'KLlLLLlLLLK.', 'KLLLLlLLLLK.', 'KWWWWWWWWWK.', '.KKKKKKKKK..'],
  plantOpen: [
    '...KKKKKK...',
    '..KNNWNNNK..',
    '.KNWWNNNWNK.',
    '.KNNNNNWWNK.',
    'KWWKKKKKKWWK',
    'KWDDDDDDDDWK',
    'KWWKKKKKKWWK',
    '.KNNNWNNNNK.',
    '..KKNNNNKK..',
    '....KVVK....',
    ...PLANT_STEM,
  ],
  plantShut: [
    ...blank(1),
    '...KKKKKK...',
    '..KNNWNNNK..',
    '.KNWWNNNWNK.',
    '.KNNNNNWWNK.',
    'KNNNNNNNNNNK',
    'KWWWWWWWWWWK',
    '.KNNNWNNNNK.',
    '..KKNNNNKK..',
    '....KVVK....',
    ...PLANT_STEM,
  ],
} as const

export type FoeFrame = keyof typeof FOE_FRAMES

export const FOE_FRAME_NAMES = Object.keys(FOE_FRAMES) as FoeFrame[]

export const foeRows = (frame: FoeFrame): readonly string[] => FOE_FRAMES[frame]

const FOE_BASE = { K: OUTLINE, W: '#ffffff', E: OUTLINE, D: '#3a0c0c' }

/** Each foe's colours: the brown mushroom, the green turtle with its yellow skin, the red spotted plant. */
export const FOE_COLOURS: Record<'walker' | 'turtle' | 'plant', Record<string, string>> = {
  walker: { ...FOE_BASE, N: '#b0401c', O: '#f09028', F: '#f8c820' },
  turtle: { ...FOE_BASE, L: '#38a838', l: '#1c6c1c', Y: '#f8c860', R: '#e04020' },
  plant: { ...FOE_BASE, N: '#d82818', V: '#38a838', v: '#1c6c1c' },
}

const FOE_KIND: Record<FoeFrame, keyof typeof FOE_COLOURS> = {
  walkerA: 'walker',
  walkerB: 'walker',
  walkerFlat: 'walker',
  turtleA: 'turtle',
  turtleB: 'turtle',
  shell: 'turtle',
  plantOpen: 'plant',
  plantShut: 'plant',
}

export const foeColours = (frame: FoeFrame) => FOE_COLOURS[FOE_KIND[frame]]
