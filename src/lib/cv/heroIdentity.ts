// What makes every world's character HIM, from his sprite (src/assets/sprites/stop_front.png): brown skin,
// short dark hair, the full dark beard, black oval eyes, a broad build. Only these traits are shared; each
// world draws its own character in its game's sprite language (style, size, proportions, outline, frames)
// and maps these colours into its own palette (a pixel world quantises them, a silhouette world drops them).

export const HERO_IDENTITY = {
  skin: '#b5703f',
  skinShade: '#8a4f2b',
  hair: '#241a24',
  beard: '#241a24',
  eyes: '#120c12',
} as const

export type HeroIdentity = typeof HERO_IDENTITY
