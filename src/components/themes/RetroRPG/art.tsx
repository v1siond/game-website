'use client'

import { useReducedMotion } from '@/hooks/useReducedMotion'
import { CT_COLORS } from './palette'

// =============================================================================
// PIXEL ART SVG COMPONENTS - CHRONO TRIGGER STYLE
// =============================================================================

// Time Portal Swirl Effect
export function TimePortal({
  size = 120,
  animate = true,
  className = '',
}: {
  size?: number
  animate?: boolean
  className?: string
}) {
  const reducedMotion = useReducedMotion()
  const shouldAnimate = animate && !reducedMotion

  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label="Time portal"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        className={shouldAnimate ? 'animate-portal-spin' : ''}
        style={{ imageRendering: 'pixelated' as const }}
      >
        {/* Outer ring */}
        <circle cx="60" cy="60" r="55" fill="none" stroke={CT_COLORS.portalPurple} strokeWidth="4" opacity="0.8" />
        <circle cx="60" cy="60" r="50" fill="none" stroke={CT_COLORS.portalBlue} strokeWidth="3" opacity="0.9" />

        {/* Swirling energy rings */}
        <ellipse cx="60" cy="60" rx="40" ry="20" fill="none" stroke={CT_COLORS.portalBlueBright} strokeWidth="2"
          className={shouldAnimate ? 'animate-portal-ring-1' : ''} opacity="0.7" />
        <ellipse cx="60" cy="60" rx="30" ry="35" fill="none" stroke={CT_COLORS.portalMagenta} strokeWidth="2"
          className={shouldAnimate ? 'animate-portal-ring-2' : ''} opacity="0.6" />
        <ellipse cx="60" cy="60" rx="25" ry="15" fill="none" stroke={CT_COLORS.futureChromeLight} strokeWidth="2"
          className={shouldAnimate ? 'animate-portal-ring-3' : ''} opacity="0.5" />

        {/* Center glow */}
        <circle cx="60" cy="60" r="15" fill={CT_COLORS.portalBlue} opacity="0.4" />
        <circle cx="60" cy="60" r="8" fill={CT_COLORS.white} opacity="0.8" />

        {/* Sparkle particles */}
        <circle cx="30" cy="40" r="2" fill={CT_COLORS.white} className={shouldAnimate ? 'animate-sparkle-1' : ''} />
        <circle cx="90" cy="50" r="2" fill={CT_COLORS.white} className={shouldAnimate ? 'animate-sparkle-2' : ''} />
        <circle cx="50" cy="90" r="2" fill={CT_COLORS.white} className={shouldAnimate ? 'animate-sparkle-3' : ''} />
        <circle cx="75" cy="25" r="1.5" fill={CT_COLORS.portalMagenta} className={shouldAnimate ? 'animate-sparkle-4' : ''} />
      </svg>
    </div>
  )
}

// Crono Silhouette (spiky hair protagonist)
export function CronoPixelArt({ size = 64 }: { size?: number }) {
  return (
    <div
      style={{ imageRendering: 'pixelated' as const }}
      role="img"
      aria-label="Crono character silhouette"
    >
      <svg width={size} height={size * 1.5} viewBox="0 0 32 48">
        {/* Spiky hair */}
        <rect x="8" y="0" width="4" height="6" fill={CT_COLORS.cronoOrange} />
        <rect x="12" y="2" width="3" height="8" fill={CT_COLORS.cronoOrange} />
        <rect x="15" y="0" width="4" height="7" fill={CT_COLORS.cronoOrange} />
        <rect x="19" y="3" width="3" height="6" fill={CT_COLORS.cronoOrange} />
        <rect x="22" y="5" width="3" height="4" fill={CT_COLORS.cronoOrange} />
        {/* Head */}
        <rect x="10" y="8" width="14" height="10" fill={CT_COLORS.cronoOrange} />
        {/* Eyes */}
        <rect x="12" y="12" width="3" height="2" fill={CT_COLORS.voidDark} />
        <rect x="18" y="12" width="3" height="2" fill={CT_COLORS.voidDark} />
        {/* Headband */}
        <rect x="9" y="10" width="16" height="2" fill={CT_COLORS.white} />
        {/* Body / Tunic */}
        <rect x="10" y="18" width="14" height="14" fill={CT_COLORS.white} />
        {/* Belt */}
        <rect x="10" y="28" width="14" height="2" fill={CT_COLORS.gold} />
        {/* Pants */}
        <rect x="10" y="30" width="6" height="10" fill={CT_COLORS.portalBlue} />
        <rect x="18" y="30" width="6" height="10" fill={CT_COLORS.portalBlue} />
        {/* Boots */}
        <rect x="9" y="40" width="7" height="6" fill={CT_COLORS.prehistoricOrange} />
        <rect x="17" y="40" width="7" height="6" fill={CT_COLORS.prehistoricOrange} />
        {/* Katana */}
        <rect x="24" y="16" width="2" height="20" fill={CT_COLORS.silver} />
        <rect x="24" y="14" width="2" height="3" fill={CT_COLORS.gold} />
      </svg>
    </div>
  )
}

// Marle Silhouette (princess with ponytail)
export function MarlePixelArt({ size = 64 }: { size?: number }) {
  return (
    <div
      style={{ imageRendering: 'pixelated' as const }}
      role="img"
      aria-label="Marle character silhouette"
    >
      <svg width={size} height={size * 1.5} viewBox="0 0 32 48">
        {/* Ponytail */}
        <rect x="20" y="4" width="6" height="16" fill={CT_COLORS.gold} />
        <rect x="24" y="8" width="4" height="10" fill={CT_COLORS.gold} />
        {/* Hair front */}
        <rect x="10" y="2" width="12" height="10" fill={CT_COLORS.gold} />
        <rect x="8" y="6" width="4" height="6" fill={CT_COLORS.gold} />
        {/* Head */}
        <rect x="10" y="8" width="12" height="10" fill="#FFDDCC" />
        {/* Eyes */}
        <rect x="12" y="12" width="2" height="2" fill={CT_COLORS.marleBlue} />
        <rect x="18" y="12" width="2" height="2" fill={CT_COLORS.marleBlue} />
        {/* Dress top */}
        <rect x="8" y="18" width="16" height="8" fill={CT_COLORS.white} />
        {/* Dress bottom */}
        <rect x="6" y="26" width="20" height="14" fill={CT_COLORS.white} />
        {/* Blue trim */}
        <rect x="6" y="38" width="20" height="2" fill={CT_COLORS.marleBlue} />
        {/* Pendant */}
        <rect x="14" y="20" width="4" height="4" fill={CT_COLORS.marleBlue} />
        {/* Boots */}
        <rect x="10" y="40" width="5" height="6" fill={CT_COLORS.marleBlue} />
        <rect x="17" y="40" width="5" height="6" fill={CT_COLORS.marleBlue} />
      </svg>
    </div>
  )
}

// Frog Silhouette (Glenn the knight)
export function FrogPixelArt({ size = 64 }: { size?: number }) {
  return (
    <div
      style={{ imageRendering: 'pixelated' as const }}
      role="img"
      aria-label="Frog character silhouette"
    >
      <svg width={size} height={size * 1.4} viewBox="0 0 32 44">
        {/* Head (rounded frog shape) */}
        <rect x="6" y="0" width="20" height="14" fill={CT_COLORS.frogGreen} />
        <rect x="4" y="4" width="4" height="8" fill={CT_COLORS.frogGreen} />
        <rect x="24" y="4" width="4" height="8" fill={CT_COLORS.frogGreen} />
        {/* Eyes (bulging) */}
        <rect x="8" y="4" width="5" height="5" fill={CT_COLORS.gold} />
        <rect x="19" y="4" width="5" height="5" fill={CT_COLORS.gold} />
        <rect x="10" y="6" width="2" height="2" fill={CT_COLORS.voidDark} />
        <rect x="21" y="6" width="2" height="2" fill={CT_COLORS.voidDark} />
        {/* Cape */}
        <rect x="2" y="14" width="4" height="20" fill={CT_COLORS.medievalGreen} />
        <rect x="26" y="14" width="4" height="20" fill={CT_COLORS.medievalGreen} />
        {/* Armor body */}
        <rect x="6" y="14" width="20" height="16" fill={CT_COLORS.silver} />
        {/* Gold trim on armor */}
        <rect x="12" y="16" width="8" height="2" fill={CT_COLORS.gold} />
        <rect x="14" y="18" width="4" height="8" fill={CT_COLORS.gold} />
        {/* Legs */}
        <rect x="8" y="30" width="7" height="10" fill={CT_COLORS.medievalGreen} />
        <rect x="17" y="30" width="7" height="10" fill={CT_COLORS.medievalGreen} />
        {/* Masamune sword */}
        <rect x="0" y="10" width="2" height="24" fill={CT_COLORS.silver} />
        <rect x="0" y="8" width="2" height="3" fill={CT_COLORS.gold} />
        <rect x="0" y="6" width="2" height="2" fill={CT_COLORS.portalPurple} />
      </svg>
    </div>
  )
}

// Epoch Time Machine
export function EpochPixelArt({ size = 100 }: { size?: number }) {
  const reducedMotion = useReducedMotion()

  return (
    <div
      style={{ imageRendering: 'pixelated' as const }}
      role="img"
      aria-label="Epoch time machine"
    >
      <svg width={size} height={size * 0.5} viewBox="0 0 100 50">
        {/* Main body */}
        <ellipse cx="50" cy="30" rx="45" ry="15" fill={CT_COLORS.futureChrome} />
        <ellipse cx="50" cy="28" rx="40" ry="12" fill={CT_COLORS.futureChromeLight} />
        {/* Cockpit dome */}
        <ellipse cx="50" cy="22" rx="20" ry="15" fill={CT_COLORS.portalBlue} opacity="0.5" />
        <ellipse cx="50" cy="20" rx="15" ry="10" fill={CT_COLORS.portalBlueBright} opacity="0.4" />
        {/* Wings */}
        <polygon points="5,35 25,25 25,35" fill={CT_COLORS.silver} />
        <polygon points="95,35 75,25 75,35" fill={CT_COLORS.silver} />
        {/* Engine glow */}
        <ellipse cx="15" cy="35" rx="8" ry="4" fill={CT_COLORS.portalMagenta}
          className={!reducedMotion ? 'animate-engine-pulse' : ''} opacity="0.7" />
        <ellipse cx="85" cy="35" rx="8" ry="4" fill={CT_COLORS.portalMagenta}
          className={!reducedMotion ? 'animate-engine-pulse' : ''} opacity="0.7" />
        {/* Lights */}
        <rect x="30" y="32" width="3" height="3" fill={CT_COLORS.atbGreen} />
        <rect x="67" y="32" width="3" height="3" fill={CT_COLORS.atbGreen} />
      </svg>
    </div>
  )
}

// Lavos (Final Boss Motif) - For dramatic elements
export function LavosEye({ size = 80, animate = true }: { size?: number; animate?: boolean }) {
  const reducedMotion = useReducedMotion()
  const shouldAnimate = animate && !reducedMotion

  return (
    <div
      style={{ imageRendering: 'pixelated' as const }}
      role="img"
      aria-label="Lavos eye decoration"
    >
      <svg width={size} height={size} viewBox="0 0 80 80">
        {/* Outer shell spikes */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
          const radian = (angle * Math.PI) / 180
          const x1 = 40 + Math.cos(radian) * 30
          const y1 = 40 + Math.sin(radian) * 30
          const x2 = 40 + Math.cos(radian) * 38
          const y2 = 40 + Math.sin(radian) * 38
          return (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={CT_COLORS.lavosPurple} strokeWidth="3" opacity="0.8" />
          )
        })}
        {/* Core eye */}
        <circle cx="40" cy="40" r="25" fill={CT_COLORS.lavosPurple} />
        <circle cx="40" cy="40" r="20" fill={CT_COLORS.lavosRed} />
        <circle cx="40" cy="40" r="12" fill={CT_COLORS.voidDark} />
        <circle cx="40" cy="40" r="6" fill={CT_COLORS.lavosRed}
          className={shouldAnimate ? 'animate-lavos-pulse' : ''} />
        {/* Inner glow */}
        <circle cx="36" cy="36" r="3" fill={CT_COLORS.white} opacity="0.5" />
      </svg>
    </div>
  )
}

// Era Indicator Badge
export function EraBadge({
  era,
  year
}: {
  era: 'prehistoric' | 'medieval' | 'present' | 'future' | 'end-of-time'
  year?: string
}) {
  const eraConfig = {
    prehistoric: { bg: CT_COLORS.prehistoricOrange, text: '65,000,000 BC' },
    medieval: { bg: CT_COLORS.medievalGreen, text: '600 AD' },
    present: { bg: CT_COLORS.portalBlue, text: '1000 AD' },
    future: { bg: CT_COLORS.futureChrome, text: '2300 AD' },
    'end-of-time': { bg: CT_COLORS.portalPurple, text: 'End of Time' },
  }

  const config = eraConfig[era]

  return (
    <span
      className="inline-flex items-center gap-2 px-3 py-1 text-[10px] tracking-widest"
      style={{
        background: config.bg,
        color: era === 'future' ? CT_COLORS.voidDark : CT_COLORS.white,
        border: `2px solid ${CT_COLORS.white}`,
      }}
      role="img"
      aria-label={`Era: ${year || config.text}`}
    >
      <span style={{ fontSize: '8px' }}>◈</span>
      {year || config.text}
    </span>
  )
}
