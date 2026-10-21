import type { ReactNode } from 'react'
import { PORTAL } from './palette'

// The warp rooms' level pad (Warped, named in code only), drawn as the game shows it: a glossy royal
// blue dome, lit from the top left, sitting in a grey ring set into the floor, its number in white
// italic serif on top. The hub's three profession buttons, the job levels' number and the exit pad at
// the level end are all this pad. Its gradient (npw-pad) lives in PickupDefs on the world's root.
// viewBox 0 0 120 44: the ring spans y 16 to 41, the dome's top y 10 to 30.

interface LevelPadProps {
  /** The number (or nothing) painted on the dome. */
  label?: ReactNode
  /** Stood on: a gold rim on the dome and a cyan glow in the ring. */
  lit?: boolean
  /** The class on the dome group, for a press or a glow played by the caller's CSS. */
  topClassName?: string
  className?: string
}

export function LevelPad({ label, lit = false, topClassName = '', className }: LevelPadProps) {
  return (
    <svg viewBox="0 0 120 44" className={className} aria-hidden="true" focusable="false">
      <ellipse cx="60" cy="30" rx="58" ry="13" fill={PORTAL.VOID} />
      <ellipse cx="60" cy="28" rx="55" ry="11.5" fill={PORTAL.PAD_RING} />
      <ellipse cx="60" cy="28" rx="50" ry="9" fill="none" stroke={lit ? PORTAL.TEAL : PORTAL.METAL_DARK} strokeWidth={lit ? 3 : 1.5} />
      <g className={topClassName}>
        <ellipse cx="60" cy="24" rx="44" ry="10.5" fill={PORTAL.PAD_DARK} stroke={PORTAL.VOID} strokeWidth="2" />
        <ellipse cx="60" cy="20" rx="44" ry="10" fill="url(#npw-pad)" stroke={lit ? PORTAL.GOLD : PORTAL.VOID} strokeWidth={lit ? 3 : 2} />
        <ellipse cx="47" cy="16" rx="17" ry="3.2" fill={PORTAL.WHITE} opacity="0.55" />
        {label !== undefined && (
          <text x="60" y="26" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontSize="17" fontStyle="italic" fontWeight="900" fill={PORTAL.WHITE} stroke={PORTAL.VOID} strokeWidth="1" paintOrder="stroke">
            {label}
          </text>
        )}
      </g>
    </svg>
  )
}
