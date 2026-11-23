import { RPG } from './palette'

// The cast he meets on the walk, as pixel rows read through a colour key (pixelRuns draws one rect per
// run), in flat colour fills with a dark outline like his own sprite. All are this world's own drawings: a
// round horned beetle critter and the same critter in a headguard he spars with, the villagers and the
// keeper of the towns, his bandmates with their instruments, and a villager's portrait for the job boxes.
// '.' is transparent.

export interface PixelSprite {
  rows: readonly string[]
  colours: Readonly<Record<string, string>>
}

const CRITTER_COLOURS = { K: RPG.spriteLine, N: RPG.critter, n: RPG.critterShine, O: RPG.critterBelly, W: RPG.border, E: RPG.spriteLine, F: RPG.spriteLine }

const CRITTER_SHELL = [
  '.....K....K.....',
  '......K..K......',
  '....KKKKKKKK....',
  '...KNNNKKNNNK...',
  '..KNnNNKKNNnNK..',
  '.KNNNNNKKNNNNNK.',
  'KNWWNNNKKNNNWWNK',
  'KNWENNNKKNNNWENK',
  'KOOOOOOOOOOOOOOK',
  '.KKKKKKKKKKKKKK.',
]

/** His own field critter, a round shelled beetle with two short horns, facing him, 16 by 12. */
export const CRITTER: PixelSprite = {
  rows: [...CRITTER_SHELL, '..KF.KF..KF.KF..', '.KF..KF..KF..KF.'],
  colours: CRITTER_COLOURS,
}

/** The critter he spars with in the arena: the same beetle under a red headguard, 16 by 12. */
export const SPARRER: PixelSprite = {
  rows: [
    '....KKKKKKKK....',
    '...KRRRRRRRRK...',
    '...KKKKKKKKKK...',
    '...KNNNKKNNNK...',
    '..KNnNNKKNNnNK..',
    '.KNNNNNKKNNNNNK.',
    'KNWWNNNKKNNNWWNK',
    'KNWENNNKKNNNWENK',
    'KOOOOOOOOOOOOOOK',
    '.KKKKKKKKKKKKKK.',
    '..KF.KF..KF.KF..',
    '.KF..KF..KF..KF.',
  ],
  colours: { ...CRITTER_COLOURS, R: RPG.red },
}

// A townsperson facing him, 12 by 20: hair, face, a coat, trousers and shoes. The I pixels are what they
// hold across the body, an instrument for a bandmate; a villager's are the coat's own colour.
const PERSON = [
  '...KKKKKK...',
  '..KHHHHHHK..',
  '.KHHHHHHHHK.',
  '.KHSSSSSSHK.',
  '.KSSESSESSK.',
  '.KSSSSSSSSK.',
  '..KSSSSSSK..',
  '...KKKKKK...',
  '..KCCCCCCK..',
  '.KCCCCCCCCK.',
  'KSCCCCCCIICK',
  'KSCCCCCIICCK',
  '.KCCCCIICCK.',
  '.KCCCIICCCK.',
  '..KIICCCCK..',
  '..KPPPPPPK..',
  '..KPPKKPPK..',
  '..KPPK.KPPK.',
  '.KFFFK.KFFK.',
  '.KKKKK.KKKK.',
]

const person = (coat: string, hair: string, held = coat): PixelSprite => ({
  rows: PERSON,
  colours: { K: RPG.spriteLine, H: hair, S: '#d8a070', E: RPG.spriteLine, C: coat, I: held, P: RPG.stoneDark, F: RPG.spriteLine },
})

/** The villager at each job's door, in a green coat. */
export const VILLAGER = person(RPG.coatGreen, RPG.villagerHair)

/** The keeper behind each venture's counter, in a gold coat. */
export const KEEPER = person(RPG.coatGold, RPG.spriteHair)

/** His bandmates, each in their own coat with the instrument held across them. */
export const BANDMATES: readonly PixelSprite[] = [
  person(RPG.coatRed, RPG.villagerHair, RPG.wood),
  person(RPG.coatBlue, RPG.spriteHair, RPG.stickWood),
  person(RPG.coatGold, RPG.villagerHair, RPG.woodDark),
]

const PORTRAIT_HEAD = [
  '....KKKKKKKK....',
  '...KHHHHHHHHK...',
  '..KHHHHHHHHHHK..',
  '..KHSSSSSSSSHK..',
  '..KSSSSSSSSSSK..',
  '..KSSKSSSSKSSK..',
  '..KSSSSSSSSSSK..',
  '..KSSSSSsSSSSK..',
  '..KSSSSSSSSSSK..',
]

const PORTRAIT_COLOURS = { K: RPG.spriteLine, H: RPG.villagerHair, S: '#d8a070', s: '#a8703a', M: RPG.spriteLine, C: RPG.coatGreen }

/** A villager's portrait in a job box, mouth shut, 16 by 14. */
export const PORTRAIT_SHUT: PixelSprite = {
  rows: [...PORTRAIT_HEAD, '...KSSKKKKSSK...', '...KSSSSSSSSK...', '....KKSSSSKK....', '..KKCCKKKKCCKK..', '.KCCCCCCCCCCCCK.'],
  colours: PORTRAIT_COLOURS,
}

/** The same portrait, mouth open, drawn over the shut one as it talks. */
export const PORTRAIT_OPEN: PixelSprite = {
  rows: [...PORTRAIT_HEAD, '...KSSKMMKSSK...', '...KSSKMMKSSK...', '....KKSSSSKK....', '..KKCCKKKKCCKK..', '.KCCCCCCCCCCCCK.'],
  colours: PORTRAIT_COLOURS,
}

export const CAST: readonly PixelSprite[] = [CRITTER, SPARRER, VILLAGER, KEEPER, ...BANDMATES, PORTRAIT_SHUT, PORTRAIT_OPEN]
