import type { CSSProperties } from 'react'

// React's CSSProperties has no index for `--name` keys, so the one cast lives here instead of at each caller.
/** CSS custom properties for an element's style, the one inline style the site writes. */
export const cssVars = (vars: Record<string, string | number>): CSSProperties => vars as CSSProperties
