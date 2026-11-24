import { RPG } from './palette'

// The cast he meets, as pixel rows read through a colour key (pixelRuns draws one rect per run), in flat
// colour fills with a dark outline like his own sprite. All are this world's own drawings: the keeper of the
// town shop and a villager's portrait for the job boxes. '.' is transparent.

export interface PixelSprite {
  rows: readonly string[]
  colours: Readonly<Record<string, string>>
}

// A townsperson facing him, 12 by 20: hair, face, a coat, trousers and shoes. The I pixels are the strap
// across the coat, drawn in the coat's own colour.
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

const person = (coat: string, hair: string): PixelSprite => ({
  rows: PERSON,
  colours: { K: RPG.spriteLine, H: hair, S: '#d8a070', E: RPG.spriteLine, C: coat, I: coat, P: RPG.stoneDark, F: RPG.spriteLine },
})

/** The keeper behind each venture's counter, in a gold coat. */
export const KEEPER = person(RPG.coatGold, RPG.spriteHair)

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

export const CAST: readonly PixelSprite[] = [KEEPER, PORTRAIT_SHUT, PORTRAIT_OPEN]
