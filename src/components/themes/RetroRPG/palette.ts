import type { Profession } from '@/lib/cv/professions'

// =============================================================================
// CHRONO TRIGGER EXACT COLOR PALETTE
// =============================================================================
export const CT_COLORS = {
  // Time Portal Colors
  portalBlue: '#3366FF',
  portalBlueBright: '#6699FF',
  portalPurple: '#9933CC',
  portalMagenta: '#CC66FF',

  // Era Colors
  medievalGreen: '#339933',
  medievalGreenLight: '#66CC66',
  futureChrome: '#99CCCC',
  futureChromeLight: '#CCFFFF',
  prehistoricOrange: '#FF6633',
  prehistoricOrangeLight: '#FF9966',

  // Dark Blue Backgrounds
  voidDark: '#000033',
  voidMid: '#000066',
  voidLight: '#000099',

  // UI Colors
  white: '#FFFFFF',
  gold: '#FFD700',
  silver: '#C0C0C0',
  red: '#FF3333',
  lavosRed: '#CC0033',
  lavosPurple: '#660066',

  // ATB Gauge Colors
  atbGreen: '#00FF66',
  atbYellow: '#FFFF00',
  atbOrange: '#FF9900',

  // Character Colors
  cronoOrange: '#FF6600',
  marleBlue: '#66CCFF',
  frogGreen: '#33CC33',
  lucca: '#9966CC',
  robo: '#CCCC99',
  ayla: '#FFCC66',
  magus: '#6633CC',
}

// The command colour each profession's party menu option carries.
export const PROFESSION_COLORS: Record<Profession, string> = {
  drummer: CT_COLORS.portalPurple,
  engineer: CT_COLORS.portalBlue,
  fighter: CT_COLORS.prehistoricOrange,
}
