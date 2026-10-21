import type { CSSProperties } from 'react'

// Mythic's palette, every colour of the world once: a sunlit Aegean noon over marble temples, the
// terracotta and black of figure painted pottery, the gold of laurel and bronze, the brazier's flame and
// the wine dark dusk the amphitheatre plays under. The SVG art reads MYTH; MYTH_VARS puts the same
// values on the world's root as --myth-* variables, which world.module.css, scenes.module.css and the
// Tailwind arbitrary values (bg-[var(--myth-marble)]) read, so no colour is written twice.

export const MYTH = {
  // The sky and the sea, high noon down to the deep water
  skyHigh: '#5fa8d8',
  sky: '#a6d4ef',
  sun: '#fff1c2',
  cloud: '#fbf8f1',
  island: '#7f9bb3',
  sea: '#1f5f9a',
  seaDeep: '#0b2f55',
  // The amphitheatre's dusk and its stars
  dusk: '#13213f',
  duskLow: '#3a2a4a',
  star: '#fff6d8',

  // Stone: the marble, its shade, the weathered limestone
  marble: '#f4eee2',
  marbleShade: '#d9cfbd',
  stone: '#a99d88',
  sand: '#e6cf9a',

  // Pottery: the black of the figures and the fired clay
  ink: '#1c1712',
  inkSoft: '#4a3f33',
  terracotta: '#c8642f',
  terracottaDeep: '#a8461f',

  // Bronze and laurel
  gold: '#d9a63a',
  goldDeep: '#9a6b1c',
  olive: '#6d7a3a',

  // The brazier
  flame: '#ff9a3c',
  flameCore: '#ffd36b',

  // The deep blue a line of text is set in on marble
  aegean: '#0f3d66',
} as const

export const MYTH_VARS = {
  '--myth-sky-high': MYTH.skyHigh,
  '--myth-sky': MYTH.sky,
  '--myth-sea': MYTH.sea,
  '--myth-sea-deep': MYTH.seaDeep,
  '--myth-marble': MYTH.marble,
  '--myth-marble-shade': MYTH.marbleShade,
  '--myth-stone': MYTH.stone,
  '--myth-sand': MYTH.sand,
  '--myth-ink': MYTH.ink,
  '--myth-ink-soft': MYTH.inkSoft,
  '--myth-terracotta': MYTH.terracotta,
  '--myth-terracotta-deep': MYTH.terracottaDeep,
  '--myth-gold': MYTH.gold,
  '--myth-aegean': MYTH.aegean,
} as CSSProperties
