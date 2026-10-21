import type { CSSProperties } from 'react'

// Soul Map's palette, every colour of the world once: the deep blue caverns of a map exploration game,
// the cyan glow of the paths between its rooms, the warm lantern of a rest point, and the three zone
// accents. The SVG art reads SOUL; SOUL_VARS sets the same values as --soul-* custom properties on the
// world's root, so the class strings (bg-[var(--soul-deep)]) and world.module.css paint them too.

export const SOUL = {
  // The cavern, darkest to nearest rock
  abyss: '#060a18',
  deep: '#0b1430',
  cavern: '#13204a',
  rock: '#1d2d5e',
  rockLight: '#2d4380',
  ridge: '#3d5aa3',
  ink: '#03050d',

  // Light in the dark: the mist, the path glow, the map's own blue, the rest point's lantern
  mist: '#9fb3e6',
  glow: '#7fdcff',
  glowDeep: '#3a9fd6',
  accent: '#5588ff',
  lantern: '#ffcf7a',
  lanternDeep: '#e89a3c',

  // The zone accents: the hub's moss, the echo hall's rose, the arena's ember
  moss: '#6fd3a8',
  rose: '#e58bb5',
  ember: '#ff8f6b',

  // Lettering
  text: '#e2eaff',
  textSoft: '#b2c1ea',
} as const

export type SoulColor = keyof typeof SOUL

const kebab = (name: string) => name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)

export const SOUL_VARS = Object.fromEntries(
  Object.entries(SOUL).map(([name, value]) => [`--soul-${kebab(name)}`, value]),
) as CSSProperties
