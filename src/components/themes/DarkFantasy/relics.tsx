'use client'

import { memo, useId } from 'react'
import { DARK_FANTASY } from './palette'

// The spirit wisp, the soul that flows into the knight as he heals (scenes.tsx). An SVG element; `x` and `y`
// place it inside a scene's picture, and alone (the nav's wisp) it is a small picture of its own.

/** Where a relic's box sits in the SVG that holds it; left out, at the parent's origin. */
interface Place {
  x?: number
  y?: number
}

// Abstract spirit wisp - optimized: no SVG filter. Each wisp owns its gradient id, so the nav's wisp, hidden
// below sm, never holds the gradient another wisp's url(#id) resolves to.
export const SpiritWisp = memo(function SpiritWisp({ size = 40, color = DARK_FANTASY.ethereal, x, y }: { size?: number; color?: string } & Place) {
  const gradId = `${useId()}wisp`
  return (
    <svg x={x} y={y} width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" role="presentation">
      <defs>
        <radialGradient id={gradId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.9" />
          <stop offset="30%" stopColor={color} stopOpacity="0.6" />
          <stop offset="60%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Outer ethereal haze - multiple circles instead of filter */}
      <circle cx="20" cy="20" r="18" fill={`url(#${gradId})`} />
      <circle cx="20" cy="20" r="12" fill={color} opacity="0.15" />
      {/* Inner core */}
      <ellipse cx="20" cy="20" rx="6" ry="8" fill={color} opacity="0.8" />
      {/* Trailing wisps */}
      <path
        d="M16,26 Q12,32 10,36 M20,28 Q20,34 18,38 M24,26 Q28,32 30,36"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.4"
      />
    </svg>
  )
})
