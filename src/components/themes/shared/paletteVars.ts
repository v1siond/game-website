import type { CSSProperties } from 'react'

// A world's palette as the CSS variables its root sets once, so its classes read the colours by name
// (bg-[color:var(--ap-night)]) and the palette stays their one source.

// A key's CSS name: camelCase and UPPER_SNAKE both become kebab case (leafDark and LEAF_DARK are leaf-dark).
const kebab = (key: string): string =>
  /[a-z]/.test(key) ? key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`) : key.toLowerCase().replace(/_/g, '-')

/** Every colour as --<prefix>-<key in kebab case>: paletteVars('tp', { leafDark }) sets --tp-leaf-dark. */
export const paletteVars = (prefix: string, palette: Readonly<Record<string, string>>): CSSProperties =>
  Object.fromEntries(Object.entries(palette).map(([key, value]) => [`--${prefix}-${kebab(key)}`, value])) as CSSProperties
