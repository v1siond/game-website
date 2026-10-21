import { RPG } from './palette'

// The cast he meets in the overworld rooms, as pixel rows read through a colour key (pixelRuns draws one
// rect per run). Battle foes are flat white line art over a black fill, the way the game draws every foe;
// overworld characters are flat colours with one dark outline, at the kid's scale. All are this world's
// own drawings: a small frog-like monster, a hooded dog sentry and its one colour dialogue portrait, a
// round eared shopkeeper, a training dummy and an echo flower. '.' is transparent.

export interface PixelSprite {
  rows: readonly string[]
  colours: Readonly<Record<string, string>>
}

const LINE_ART = { W: RPG.border, k: RPG.void }

/** The About encounter's foe: a small round monster with two eye bumps and stubby feet, 16 by 12. */
export const MONSTER: PixelSprite = {
  rows: [
    '...WWW....WWW...',
    '..WkkkW..WkkkW..',
    '..WkWkWWWWkWkW..',
    '.WkkkkkkkkkkkkW.',
    '.WkkkkkkkkkkkkW.',
    'WkkkWkkkkkkWkkkW',
    'WkkkkWWWWWWkkkkW',
    'WkkkkkkkkkkkkkkW',
    '.WkkkkkkkkkkkkW.',
    '..WWkWWWWWWkWW..',
    '..WkkW....WkkW..',
    '..WWWW....WWWW..',
  ],
  colours: LINE_ART,
}

/** The training dummy he spars with: a round head over a cross bar on a post, 12 by 16. */
export const DUMMY: PixelSprite = {
  rows: [
    '....WWWW....',
    '...WkkkkW...',
    '...WkkkkW...',
    '....WWWW....',
    '.....WW.....',
    'WWWWWWWWWWWW',
    'WkkkkkkkkkkW',
    'WWWWkkkkWWWW',
    '...WkkkkW...',
    '...WkkkkW...',
    '...WkkkkW...',
    '...WWWWWW...',
    '.....WW.....',
    '.....WW.....',
    '.....WW.....',
    '...WWWWWW...',
  ],
  colours: LINE_ART,
}

/** The dog sentry's head and paws over its booth counter, hood up, eyes as slits, 12 by 10. */
export const SENTRY: PixelSprite = {
  rows: [
    '..KK....KK..',
    '.KhhK..KhhK.',
    '.KhphKKhphK.',
    'KhwwwwwwwwhK',
    'KhwKKwwKKwhK',
    'KhwwwwwwwwhK',
    'KhwwwKKwwwhK',
    'KhpwwwwwwphK',
    '.KhhwwwwhhK.',
    '.KwwKKKKwwK.',
  ],
  colours: { K: RPG.spriteLine, h: RPG.dogHood, p: RPG.dogPink, w: RPG.border },
}

// The sentry's dialogue portrait, one colour line art like every portrait in the game's boxes, 16 by 14.
// Two mouth frames: shut, then open, flapping while its line types.
const PORTRAIT_HEAD = [
  '..WW........WW..',
  '.W..W......W..W.',
  '.W...W....W...W.',
  '.W....WWWW....W.',
  'W..............W',
  'W..WWW....WWW..W',
  'W..............W',
  'W......WW......W',
  'W.....WWWW.....W',
]

export const PORTRAIT_SHUT: PixelSprite = {
  rows: [...PORTRAIT_HEAD, '.W.....WW.....W.', '.W....WWWW....W.', '..W..........W..', '...WW......WW...', '.....WWWWWW.....'],
  colours: LINE_ART,
}

export const PORTRAIT_OPEN: PixelSprite = {
  rows: [...PORTRAIT_HEAD, '.W.....WW.....W.', '.W....W..W....W.', '..W...WWWW...W..', '...WW......WW...', '.....WWWWWW.....'],
  colours: LINE_ART,
}

/** The shopkeeper behind the counter: a round white face with tall ears, grey hair, a striped top, 16 by 13. */
export const KEEPER: PixelSprite = {
  rows: [
    '..K..........K..',
    '.KwK........KwK.',
    '.KwwKKKKKKKKwwK.',
    'KgwwwwwwwwwwwwgK',
    'KgwwKwwwwwwKwwgK',
    'KgwwwwwwwwwwwwgK',
    'KgwwwwwKKwwwwwgK',
    'Kgwwwwwppwwwwwg.',
    '.KgKKKKKKKKKKgK.',
    '..KybybybybybyK.',
    '..KbybybybybybK.',
    '..KybybybybybyK.',
    '..KKKKKKKKKKKKK.',
  ],
  colours: { K: RPG.spriteLine, w: RPG.border, g: RPG.borderShade, p: RPG.dogPink, y: RPG.gold, b: RPG.sweater },
}

/** The waving paw the keeper raises in two frames. */
export const KEEPER_PAW: PixelSprite = { rows: ['.KK.', 'KwwK', 'KwwK', '.KK.'], colours: KEEPER.colours }

/** An echo flower: a cyan bloom of five petals on a thin stem, 7 by 11. */
export const FLOWER: PixelSprite = {
  rows: ['..c.c..', '.cCcCc.', 'cCCwCCc', '.cCCCc.', '..cCc..', '...s...', '...s...', '..ss...', '...s...', '...ss..', '...s...'],
  colours: { c: RPG.sky, C: RPG.glow, w: RPG.border, s: RPG.pineLit },
}

export const CAST: readonly PixelSprite[] = [MONSTER, DUMMY, SENTRY, PORTRAIT_SHUT, PORTRAIT_OPEN, KEEPER, KEEPER_PAW, FLOWER]
