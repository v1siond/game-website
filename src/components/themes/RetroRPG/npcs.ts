import { RPG } from './palette'

// The cast he meets on the walk, as pixel rows read through a colour key (pixelRuns draws one rect per
// run). Foes are flat white line art over a black fill, the way the genre's battle screens draw them. All
// are this world's own drawings: a small frog-like monster, the hooded speaker's one colour portrait in
// the job boxes, a training dummy and a bell flower. '.' is transparent.

export interface PixelSprite {
  rows: readonly string[]
  colours: Readonly<Record<string, string>>
}

const LINE_ART = { W: RPG.border, k: RPG.void }

/** The small monster of the hero and the About scene: a small round monster with two eye bumps and stubby feet, 16 by 12. */
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

/** A bell flower: a cyan bloom of five petals on a thin stem, 7 by 11. */
export const FLOWER: PixelSprite = {
  rows: ['..c.c..', '.cCcCc.', 'cCCwCCc', '.cCCCc.', '..cCc..', '...s...', '...s...', '..ss...', '...s...', '...ss..', '...s...'],
  colours: { c: RPG.sky, C: RPG.glow, w: RPG.border, s: RPG.pineLit },
}

export const CAST: readonly PixelSprite[] = [MONSTER, DUMMY, PORTRAIT_SHUT, PORTRAIT_OPEN, FLOWER]
