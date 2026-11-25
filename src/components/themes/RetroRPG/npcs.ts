import { RPG } from './palette'

// The cast he meets, as pixel rows read through a colour key (pixelRuns draws one rect per run), in flat
// colour fills with a dark outline like his own sprite. All are this world's own drawings, none the game's:
// the grinning lantern, the caretaker in her robe, the scarf guard, the owl sentry, the armoured hunter, the
// weaver, the jukebox showman, the old champion and the kid he was, and a villager's portrait for the job
// boxes. Each is drawn facing him. '.' is transparent.

export interface PixelSprite {
  rows: readonly string[]
  colours: Readonly<Record<string, string>>
}

const LINE = RPG.spriteLine
const SKIN = '#d8a070'

/** The grinning paper lantern that offers him its glowing beads, 12 by 14. */
export const LANTERN: PixelSprite = {
  rows: [
    '....KKKK....',
    '...KHHHHK...',
    '..KLLLLLLK..',
    '.KLLLLLLLLK.',
    '.KLKKLLKKLK.',
    '.KLLLLLLLLK.',
    '.KLKLLLLKLK.',
    '.KLLKKKKLLK.',
    '.KLLLLLLLLK.',
    '..KLLLLLLK..',
    '...KHHHHK...',
    '....KKKK....',
    '.....KK.....',
    '.....K......',
  ],
  colours: { K: LINE, H: RPG.lanternRim, L: RPG.lantern },
}

/** The caretaker in her long robe, a lamp in her near hand, 14 by 29. */
export const CARETAKER: PixelSprite = {
  rows: [
    '.....KKKK.....',
    '....KHHHHK....',
    '...KHHHHHHK...',
    '...KHSSSSHK...',
    '...KSESSESK...',
    '...KSSSSSSK...',
    '....KSSSSK....',
    '.....KSSK.....',
    '....KRRRRK....',
    '...KRRRRRRK...',
    '..KRRRRRRRRK..',
    '.KRRRWRRWRRRK.',
    '.KRRRRWWRRRRK.',
    'KSKRRRRRRRRKSK',
    'KSKRRRRRRRRKLK',
    '.KKRRRRRRRRKLK',
    '..KRRRRRRRRKK.',
    '..KRRRRRRRRK..',
    '..KRRRRRRRRK..',
    '.KRRRRRRRRRRK.',
    '.KRRRRRRRRRRK.',
    '.KRRRRRRRRRRK.',
    '.KRRRRRRRRRRK.',
    'KRRRRRRRRRRRRK',
    'KRRRRRRRRRRRRK',
    'KRRRRRRRRRRRRK',
    'KRRRRRRRRRRRRK',
    'KWWWWWWWWWWWWK',
    'KKKKKKKKKKKKKK',
  ],
  colours: { K: LINE, H: '#e8e0d0', S: SKIN, E: LINE, R: RPG.robe, W: RPG.robeTrim, L: RPG.lantern },
}

/** The lanky guard in his homemade helmet and huge scarf, 12 by 26. */
export const SCARF_GUARD: PixelSprite = {
  rows: [
    '...KKKKKK...',
    '..KMMMMMMK..',
    '.KMMYMMYMMK.',
    '..KSSSSSSK..',
    '..KSESSESK..',
    '..KSSSSSSK..',
    '..KSKKKKSK..',
    '...KSSSSK...',
    'KKKFFFFFFKKK',
    'KFFFFFFFFFFK',
    '..KFFFFFFKFK',
    '..KBBBBBBKFK',
    '.KBBBBBBBBKF',
    'KSKBBBBBBKSK',
    'KSKBBBBBBKSK',
    '.K.KBBBBK.K.',
    '...KBBBBK...',
    '...KPPPPK...',
    '...KPKKPK...',
    '...KPK.KPK..',
    '...KPK.KPK..',
    '...KPK.KPK..',
    '...KPK.KPK..',
    '...KPK.KPK..',
    '..KBBK.KBBK.',
    '..KKKK.KKKK.',
  ],
  colours: { K: LINE, M: RPG.helmet, Y: RPG.gold, S: '#f0e8d8', E: LINE, F: RPG.scarf, B: RPG.guardSuit, P: RPG.guardSuit },
}

const OWL_BODY = [
  '..K......K..',
  '..KK....KK..',
  '..KOKKKKOK..',
  '.KOOOOOOOOK.',
]
const OWL_FEET = [
  '.KOOOYYOOOK.',
  '.KOOOOYOOOK.',
  'KOLLOOOOLLOK',
  'KOLLLOOLLLOK',
  '.KOLLLLLLOK.',
  '..KOOOOOOK..',
  '...KYKKYK...',
  '...KKKKKK...',
]
const OWL_COLOURS = { K: LINE, O: RPG.owl, L: RPG.owlWing, W: RPG.border, E: LINE, Y: RPG.gold }

/** The owl sentry, eyes open, 12 by 14: he sees only what moves. */
export const OWL: PixelSprite = { rows: [...OWL_BODY, '.KOWWOOWWOK.', '.KOWEOOWEOK.', ...OWL_FEET], colours: OWL_COLOURS }

/** The same owl asleep, eyes shut. */
export const OWL_ASLEEP: PixelSprite = { rows: [...OWL_BODY, '.KOOOOOOOOK.', '.KOKKOOKKOK.', ...OWL_FEET], colours: OWL_COLOURS }

/** The armoured hunter, her visor lit, 14 by 23. */
export const HUNTER: PixelSprite = {
  rows: [
    '....KKKKKK....',
    '...KAAAAAAK...',
    '..KAAAAAAAAK..',
    '..KAVVVVVVAK..',
    '..KAAAAAAAAK..',
    '...KAAAAAAK...',
    '..KKAAAAAAKK..',
    '.KAAAAAAAAAAK.',
    'KAAAAAAAAAAAAK',
    'KAKAAAAAAAAKAK',
    'KAKAAAAAAAAKAK',
    'KAKAAAAAAAAKAK',
    'KKKAAAAAAAAKKK',
    '..KAAAAAAAAK..',
    '..KDDDDDDDDK..',
    '..KAAAAAAAAK..',
    '..KAAAKKAAAK..',
    '..KAAAK.KAAK..',
    '..KAAAK.KAAK..',
    '..KAAAK.KAAK..',
    '..KAAAK.KAAK..',
    '.KAAAAK.KAAAK.',
    '.KKKKKK.KKKKK.',
  ],
  colours: { K: LINE, A: RPG.armour, V: RPG.visor, D: RPG.scarf },
}

/** The weaver with her many hands, 16 by 16. */
export const WEAVER: PixelSprite = {
  rows: [
    '.....KKKKKK.....',
    '....KWWWWWWK....',
    '...KWEWEWEWWK...',
    '...KWWWWWWWWK...',
    '...KWWMMMMWWK...',
    '..KKWWWWWWWWKK..',
    'KK.KWWWWWWWWK.KK',
    '.KKKDDDDDDDDKKK.',
    'KK.KDDDDDDDDK.KK',
    '.KKKDDDDDDDDKKK.',
    'KK.KDDDDDDDDK.KK',
    '...KDDDDDDDDK...',
    '....KDDDDDDK....',
    '....KDDKKDDK....',
    '....KDK..KDK....',
    '....KKK..KKK....',
  ],
  colours: { K: LINE, W: RPG.weaver, E: RPG.border, M: LINE, D: RPG.weaverDress },
}

/** The jukebox showman, his lights round a chrome face and a speaker each side, 14 by 17. */
export const SHOWMAN: PixelSprite = {
  rows: [
    '...KKKKKKKK...',
    '..KGGGGGGGGK..',
    '.KGRRRRRRRRGK.',
    'KGRYYYYYYYYRGK',
    'KGRYCCCCCCYRGK',
    'KGRYCEKKECYRGK',
    'KGRYCCCCCCYRGK',
    'KGRYCKMMKCYRGK',
    'KGRYYYYYYYYRGK',
    'KGGGGGGGGGGGGK',
    'KGBBBBBBBBBBGK',
    'SKBNNBBBBNNBKS',
    'SKBNNBBBBNNBKS',
    '.KBBBBBBBBBBK.',
    '.KBBBBBBBBBBK.',
    '.KGGGGGGGGGGK.',
    '..KK.KKKK.KK..',
  ],
  colours: { K: LINE, G: RPG.chrome, R: RPG.jukebox, Y: RPG.gold, C: RPG.helmet, E: RPG.sky, M: RPG.red, B: RPG.drummerShirt, N: RPG.borderShade, S: RPG.chrome },
}

/** The old champion in his heavy plate, a white beard and a red cape, 18 by 24. */
export const CHAMPION: PixelSprite = {
  rows: [
    '......KKKKKK......',
    '.....KAAAAAAK.....',
    '....KAAAAAAAAK....',
    '....KASSSSSSAK....',
    '....KSESSSSESK....',
    '....KSSSSSSSSK....',
    '....KWWWWWWWWK....',
    '.....KWWWWWWK.....',
    '...KKKAAAAAAKKK...',
    '..KAAAAAAAAAAAAK..',
    '.KAAAAAAAAAAAAAAK.',
    'KCAAAAAAAAAAAAAACK',
    'KCKAAAAAAAAAAAAKCK',
    'KCKAAAAGGGGAAAAKCK',
    'KCKAAAAAAAAAAAAKCK',
    'KCCKAAAAAAAAAAKCCK',
    'KCCKAAAAKKAAAAKCCK',
    'KCCKAAAK..KAAAKCCK',
    'KCCKAAAK..KAAAKCCK',
    '.KCKAAAK..KAAAKCK.',
    '..KKAAAK..KAAAKK..',
    '...KAAAK..KAAAK...',
    '..KAAAAK..KAAAAK..',
    '..KKKKKK..KKKKKK..',
  ],
  colours: { K: LINE, A: RPG.champion, S: SKIN, E: LINE, W: RPG.border, C: RPG.cape, G: RPG.gold },
}

/** The kid the champion was, sitting small, 10 by 14. */
export const KID: PixelSprite = {
  rows: [
    '..KKKKKK..',
    '.KHHHHHHK.',
    'KHHHHHHHHK',
    'KHSSSSSSHK',
    'KSSESSESSK',
    '.KSSSSSSK.',
    '..KKSSKK..',
    '.KTTTTTTK.',
    'KSTTTTTTSK',
    'KSTTTTTTSK',
    '.KTTTTTTK.',
    '.KPPKKPPK.',
    '.KPK..KPK.',
    '.KKK..KKK.',
  ],
  colours: { K: LINE, H: RPG.villagerHair, S: SKIN, E: LINE, T: RPG.kidShirt, P: RPG.stoneDark },
}

/** The straw training dummy against the ruins' wall, 10 by 21. */
export const DUMMY: PixelSprite = {
  rows: [
    '...KKKK...',
    '..KYYYYK..',
    '..KYYYYK..',
    '...KYYK...',
    'KKKKYYKKKK',
    'KYYYYYYYYK',
    'KKKKYYKKKK',
    '..KYYYYK..',
    '..KYYYYK..',
    '..KYYYYK..',
    '...KWWK...',
    '....WW....',
    '....WW....',
    '....WW....',
    '....WW....',
    '....WW....',
    '....WW....',
    '....WW....',
    '....WW....',
    '....WW....',
    '..KKWWKK..',
  ],
  colours: { K: LINE, Y: RPG.straw, W: RPG.woodDark },
}

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

export const CAST: readonly PixelSprite[] = [LANTERN, CARETAKER, SCARF_GUARD, OWL, OWL_ASLEEP, HUNTER, WEAVER, SHOWMAN, CHAMPION, KID, DUMMY, PORTRAIT_SHUT, PORTRAIT_OPEN]
