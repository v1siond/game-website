'use client'

import { memo, useId } from 'react'
import { DARK_FANTASY } from './palette'

// The relics of the old kingdom the knight frees and lights: the spirit wisp, the brass gear, the floating
// lantern and the soul crystal. Each is an SVG element; `x` and `y` place it inside a scene's picture, and
// alone (the nav's wisp) it is a small picture of its own.

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

// Mechanical gear
export const MechanicalGear = memo(function MechanicalGear({ size = 50, x, y }: { size?: number } & Place) {
  const teeth = 12
  // Each gear owns its brass gradient id (useId), the same reason as the wisp's.
  const brassId = `${useId()}brass`
  return (
    <svg x={x} y={y} width={size} height={size} viewBox="0 0 50 50" aria-hidden="true" role="presentation">
      <defs>
        <linearGradient id={brassId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={DARK_FANTASY.brass} />
          <stop offset="100%" stopColor={DARK_FANTASY.copper} />
        </linearGradient>
      </defs>
      {/* Gear teeth */}
      {Array.from({ length: teeth }, (_, i) => {
        const angle = (i * 360) / teeth
        const rad = (angle * Math.PI) / 180
        const innerR = 16
        const outerR = 22
        const toothWidth = 0.15
        const x1 = 25 + Math.cos(rad - toothWidth) * innerR
        const y1 = 25 + Math.sin(rad - toothWidth) * innerR
        const x2 = 25 + Math.cos(rad - toothWidth * 0.5) * outerR
        const y2 = 25 + Math.sin(rad - toothWidth * 0.5) * outerR
        const x3 = 25 + Math.cos(rad + toothWidth * 0.5) * outerR
        const y3 = 25 + Math.sin(rad + toothWidth * 0.5) * outerR
        const x4 = 25 + Math.cos(rad + toothWidth) * innerR
        const y4 = 25 + Math.sin(rad + toothWidth) * innerR
        return (
          <path
            key={i}
            d={`M${x1},${y1} L${x2},${y2} L${x3},${y3} L${x4},${y4}`}
            fill={`url(#${brassId})`}
          />
        )
      })}
      {/* Inner ring */}
      <circle cx="25" cy="25" r="16" fill="none" stroke={`url(#${brassId})`} strokeWidth="3" />
      {/* Center hole */}
      <circle cx="25" cy="25" r="6" fill={DARK_FANTASY.voidDeep} stroke={DARK_FANTASY.brass} strokeWidth="1" />
      {/* Decorative spokes */}
      <path d="M25,10 L25,19 M25,31 L25,40 M10,25 L19,25 M31,25 L40,25" stroke={DARK_FANTASY.copper} strokeWidth="2" opacity="0.5" />
    </svg>
  )
})

// Floating lantern (generic dark fantasy element)
export const FloatingLantern = memo(function FloatingLantern({ size = 30, x, y }: { size?: number } & Place) {
  return (
    <svg x={x} y={y} width={size} height={size * 1.4} viewBox="0 0 30 42" aria-hidden="true" role="presentation">
      {/* Lantern frame - gothic style */}
      <path
        d="M10,12 L10,32 Q10,38 15,38 Q20,38 20,32 L20,12"
        fill="none"
        stroke={DARK_FANTASY.copper}
        strokeWidth="1.5"
      />
      {/* Top cap */}
      <path d="M8,12 L22,12 L20,8 Q15,6 10,8 Z" fill={DARK_FANTASY.brass} />
      {/* Hook */}
      <path d="M15,8 L15,2 Q15,0 17,0 Q19,0 19,2" fill="none" stroke={DARK_FANTASY.copper} strokeWidth="1" />
      {/* Glass panels */}
      <rect x="11" y="14" width="8" height="16" fill={DARK_FANTASY.spiritGold} opacity="0.3" />
      {/* Inner flame glow */}
      <ellipse cx="15" cy="22" rx="3" ry="5" fill={DARK_FANTASY.spiritGold} opacity="0.8" />
      <ellipse cx="15" cy="22" rx="5" ry="8" fill={DARK_FANTASY.spiritGold} opacity="0.3" />
    </svg>
  )
})


/** The soul crystal cluster, centred on its base: the tall main crystal in the soul light, its two gold side
 *  crystals and two small moss accents, as in the cavern's crystal formations. */
export const SoulCrystal = memo(function SoulCrystal({ light = DARK_FANTASY.ethereal }: { light?: string }) {
  return (
    <g transform="translate(0 -40)">
      {/* Main crystal */}
      <path d="M0,-50 L12,-20 L8,40 L-8,40 L-12,-20 Z" fill={light} opacity="0.6" />
      <path d="M0,-50 L12,-20 L0,0 L-12,-20 Z" fill={light} opacity="0.8" />
      {/* Side crystals */}
      <path d="M-30,-30 L-22,-10 L-26,25 L-34,25 L-38,-10 Z" fill={DARK_FANTASY.spiritGold} opacity="0.5" transform="rotate(-15)" />
      <path d="M30,-30 L38,-10 L34,25 L26,25 L22,-10 Z" fill={DARK_FANTASY.spiritGold} opacity="0.5" transform="rotate(15)" />
      {/* Small accent crystals */}
      <path d="M-50,-10 L-45,5 L-55,5 Z" fill={DARK_FANTASY.forestGreen} opacity="0.4" transform="rotate(-25)" />
      <path d="M50,-10 L55,5 L45,5 Z" fill={DARK_FANTASY.forestGreen} opacity="0.4" transform="rotate(25)" />
    </g>
  )
})
