'use client'

import { memo } from 'react'
import { DARK_FANTASY } from './palette'

/**
 * ALEXANDER AS A MASKED CAVERN KNIGHT
 * =====================================
 * Based on reference image - 3/4 view facing RIGHT
 *
 * KEY DESIGN ELEMENTS (from reference):
 * - HORNS curve UPWARD like crescents (not outward like devil horns)
 * - Large rounded head/mask (egg-shaped, top-heavy)
 * - TWO void black eyes (large ovals)
 * - Small cloak/body below head
 * - Default orientation faces RIGHT (mirror for left)
 *
 * ALEXANDER ADAPTATION:
 * - Beard extends from bottom of mask
 *
 * Drawn as an SVG element, so a scene places him inside its own picture. His blade ([data-blade]) turns on
 * the pommel and its soul light ([data-blade-glow]) brightens: the scene writes both from the scroll
 * (slashAngle), so his slashes play forwards and back with it.
 */

// The knight's drawing in viewBox units: its width and height, his size being these times his scale, and
// the line his soles and his ground shadow sit on, KNIGHT_SOLE_Y below the drawing's top.
export const KNIGHT_VIEW_WIDTH = 60
export const KNIGHT_VIEW_HEIGHT = 80
export const KNIGHT_SOLE_Y = 79
// The small ground shadow drawn over his legs sits this far above the sole line the contact shadows sit on.
const KNIGHT_INNER_SHADOW_RISE = 3

// The blade at rest, held to the side; it turns on the pommel.
const BLADE_REST_DEG = 25

/** The blade's transform at `angle` degrees, turned on the pommel. */
export const bladeTurn = (angle: number): string => `rotate(${angle.toFixed(1)} 52 55)`

// A slash: the blade swings up and over to BLADE_STRIKE_DEG by RAISE_END, holds to STRIKE_END and comes back
// to rest by the slash's end.
const BLADE_STRIKE_DEG = -60
const RAISE_END = 0.3
const STRIKE_END = 0.5

/** The blade's angle at `phase` of a slash, 0 to 1: rest, the swing up, the hold, back to rest. */
export function slashAngle(phase: number): number {
  if (phase <= 0 || phase >= 1) return BLADE_REST_DEG
  if (phase < RAISE_END) return BLADE_REST_DEG + (BLADE_STRIKE_DEG - BLADE_REST_DEG) * (phase / RAISE_END)
  if (phase < STRIKE_END) return BLADE_STRIKE_DEG
  return BLADE_STRIKE_DEG + (BLADE_REST_DEG - BLADE_STRIKE_DEG) * ((phase - STRIKE_END) / (1 - STRIKE_END))
}

/** How bright the blade's soul light is at `phase` of a slash: lit from the swing to the hold's end. */
export const slashGlow = (phase: number): number => (phase > 0.2 && phase < 0.6 ? 0.5 : 0)

/** The knight, feet at his drawing's sole line; `x` and `y` place his box's top left in the parent SVG. */
export const KnightCharacter = memo(function KnightCharacter({ scale = 1, x = 0, y = 0 }: { scale?: number; x?: number; y?: number }) {
  return (
    <svg
      x={x}
      y={y}
      width={KNIGHT_VIEW_WIDTH * scale}
      height={KNIGHT_VIEW_HEIGHT * scale}
      viewBox={`0 0 ${KNIGHT_VIEW_WIDTH} ${KNIGHT_VIEW_HEIGHT}`}
      overflow="visible"
      className="[filter:drop-shadow(0_4px_3px_rgba(0,0,0,0.45))_drop-shadow(0_0_5px_color-mix(in_srgb,var(--df-soul-blue)_13%,transparent))]"
    >
      {/* Ground contact shadow, two soft stacked ellipses (replaces the old glow-only shadow) */}
      <ellipse cx="30" cy={KNIGHT_SOLE_Y} rx="21" ry="4.5" fill={DARK_FANTASY.black} opacity="0.22" />
      <ellipse cx="30" cy={KNIGHT_SOLE_Y} rx="14" ry="3" fill={DARK_FANTASY.black} opacity="0.4" />
      {/* === KNIGHT - 3/4 VIEW FACING RIGHT === */}

      {/* CLOAK/BODY - small, below head */}
      <g>
        <path
          d="M18,48
             C14,52 12,60 14,70
             L18,74
             L42,74
             L46,70
             C48,60 46,52 42,48
             Z"
          fill={DARK_FANTASY.cloak}
          stroke={DARK_FANTASY.black}
          strokeWidth="1.5"
        />
        {/* Cloak detail - center fold */}
        <path
          d="M30,50 L30,72"
          stroke={DARK_FANTASY.cloakDark}
          strokeWidth="2"
          opacity="0.5"
        />
        {/* Cloak side folds */}
        <path
          d="M22,52 C20,58 20,66 22,72"
          stroke={DARK_FANTASY.cloakDark}
          strokeWidth="1"
          fill="none"
          opacity="0.3"
        />
        <path
          d="M38,52 C40,58 40,66 38,72"
          stroke={DARK_FANTASY.cloakDark}
          strokeWidth="1"
          fill="none"
          opacity="0.3"
        />
      </g>

      {/* MASK/HEAD - large rounded egg shape */}
      <ellipse
        cx="30"
        cy="28"
        rx="20"
        ry="22"
        fill={DARK_FANTASY.white}
        stroke={DARK_FANTASY.black}
        strokeWidth="1.5"
      />

      {/* LEFT HORN - curves UPWARD (crescent pointing up-left) */}
      <path
        d="M14,14
           C10,8 8,2 10,-6
           C14,-4 16,2 18,10
           C16,12 14,14 14,14
           Z"
        fill={DARK_FANTASY.white}
        stroke={DARK_FANTASY.black}
        strokeWidth="1"
      />

      {/* RIGHT HORN - curves UPWARD (crescent pointing up-right) */}
      <path
        d="M46,14
           C50,8 52,2 50,-6
           C46,-4 44,2 42,10
           C44,12 46,14 46,14
           Z"
        fill={DARK_FANTASY.white}
        stroke={DARK_FANTASY.black}
        strokeWidth="1"
      />

      {/* LEFT EYE - large void oval */}
      <ellipse
        cx="22"
        cy="28"
        rx="6"
        ry="9"
        fill={DARK_FANTASY.black}
      />

      {/* RIGHT EYE - large void oval */}
      <ellipse
        cx="38"
        cy="28"
        rx="6"
        ry="9"
        fill={DARK_FANTASY.black}
      />

      {/* BEARD - Alexander's signature */}
      <path
        d="M20,42
           C18,44 16,48 18,54
           C20,58 26,62 30,62
           C34,62 40,58 42,54
           C44,48 42,44 40,42
           C36,44 34,46 30,46
           C26,46 24,44 20,42
           Z"
        fill={DARK_FANTASY.beard}
        stroke={DARK_FANTASY.beardDark}
        strokeWidth="0.5"
      />
      {/* Beard texture lines */}
      <path
        d="M24,48 C24,52 26,56 28,58"
        stroke={DARK_FANTASY.beardDark}
        strokeWidth="0.5"
        fill="none"
        opacity="0.5"
      />
      <path
        d="M36,48 C36,52 34,56 32,58"
        stroke={DARK_FANTASY.beardDark}
        strokeWidth="0.5"
        fill="none"
        opacity="0.5"
      />
      <path
        d="M30,46 L30,60"
        stroke={DARK_FANTASY.beardDark}
        strokeWidth="0.5"
        opacity="0.4"
      />

      {/* BLADE - held to the side */}
      <g data-blade="" transform={bladeTurn(BLADE_REST_DEG)}>
        {/* Handle */}
        <rect x="49" y="53" width="6" height="10" rx="1" fill={DARK_FANTASY.cloakDark} stroke={DARK_FANTASY.black} strokeWidth="0.5" />
        {/* Blade */}
        <path
          d="M52,53 L48,35 L52,15 L56,35 L52,53"
          fill={DARK_FANTASY.blade}
          stroke={DARK_FANTASY.silver}
          strokeWidth="0.5"
        />
        {/* Highlight */}
        <line x1="52" y1="50" x2="52" y2="18" stroke={DARK_FANTASY.white} strokeWidth="0.5" opacity="0.5" />
        {/* The soul light on the blade at the height of a slash; the scene writes its opacity */}
        <path data-blade-glow="" d="M52,53 L48,35 L52,15 L56,35 L52,53" fill={DARK_FANTASY.soulBlue} opacity="0" />
      </g>

      {/* Ground shadow */}
      <ellipse cx="30" cy={KNIGHT_SOLE_Y - KNIGHT_INNER_SHADOW_RISE} rx="14" ry="2" fill={DARK_FANTASY.black} opacity="0.3" />
    </svg>
  )
})
