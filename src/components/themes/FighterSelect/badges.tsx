'use client'

import { useReducedMotion } from '@/hooks/useReducedMotion'
import { COLORS, lightningPattern } from './palette'

// =============================================================================
// VS SCREEN - DRAMATIC LIGHTNING WITH SVG
// =============================================================================
export function VSBadge({ large = false }: { large?: boolean }) {
  const reducedMotion = useReducedMotion()
  const size = large ? 140 : 100

  return (
    <div
      className="relative flex items-center justify-center"
      role="img"
      aria-label="VS versus badge"
      style={{ width: size, height: size }}
    >
      {/* Lightning bolts SVG */}
      <svg
        className="absolute inset-0"
        viewBox="0 0 100 100"
        aria-hidden="true"
        style={{
          filter: `drop-shadow(0 0 10px ${COLORS.electricYellow}) drop-shadow(0 0 20px ${COLORS.orange})`,
        }}
      >
        {/* Left lightning bolt */}
        <path
          d="M20 5 L35 30 L25 30 L40 55 L28 55 L50 95 L38 50 L48 50 L35 28 L43 28 L20 5"
          fill={COLORS.electricYellow}
          opacity="0.95"
        />
        {/* Right lightning bolt */}
        <path
          d="M80 5 L65 30 L75 30 L60 55 L72 55 L50 95 L62 50 L52 50 L65 28 L57 28 L80 5"
          fill={COLORS.electricYellow}
          opacity="0.95"
        />
        {/* Lightning highlights */}
        <path
          d="M23 8 L36 30 L27 30 L38 50"
          fill="none"
          stroke="white"
          strokeWidth="2"
          opacity="0.6"
        />
        <path
          d="M77 8 L64 30 L73 30 L62 50"
          fill="none"
          stroke="white"
          strokeWidth="2"
          opacity="0.6"
        />
      </svg>

      {/* Flame burst at bottom */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2"
        aria-hidden="true"
        style={{
          width: large ? 120 : 80,
          height: large ? 40 : 25,
          background: `
            radial-gradient(ellipse at 50% 100%, ${COLORS.p2Red} 0%, ${COLORS.orange} 50%, ${COLORS.electricYellow} 80%, transparent 100%)
          `,
          filter: 'blur(4px)',
        }}
      />

      {/* VS Text - explosive styling */}
      <div
        className={`relative z-10 ${!reducedMotion ? 'animate-vs-pulse' : ''}`}
        style={{
          fontSize: large ? '3.5rem' : '2.5rem',
          fontWeight: 900,
          fontFamily: '"Impact", "Arial Black", sans-serif',
          color: COLORS.gold,
          textShadow: `
            0 0 10px ${COLORS.gold},
            0 0 20px ${COLORS.orange},
            0 0 40px ${COLORS.p2Red},
            4px 4px 0 ${COLORS.arcadeBlack},
            -2px -2px 0 ${COLORS.arcadeBlack},
            2px -2px 0 ${COLORS.arcadeBlack},
            -2px 2px 0 ${COLORS.arcadeBlack}
          `,
          WebkitTextStroke: `2px ${COLORS.arcadeBlack}`,
          letterSpacing: '0.15em',
        }}
      >
        VS
      </div>
    </div>
  )
}

// =============================================================================
// DRAMATIC TEXT STYLES - FIGHT! / K.O. / PERFECT / ROUND
// =============================================================================
export function ArcadeText({
  text,
  type = 'fight',
  size = 'md',
}: {
  text: string
  type?: 'fight' | 'ko' | 'perfect' | 'ready' | 'round' | 'combo'
  size?: 'sm' | 'md' | 'lg' | 'xl'
}) {
  const colorMap = {
    fight: { primary: COLORS.p2Red, secondary: COLORS.orange, tertiary: COLORS.electricYellow },
    ko: { primary: COLORS.gold, secondary: COLORS.orange, tertiary: COLORS.p2Red },
    perfect: { primary: COLORS.specialBlue, secondary: COLORS.p1Blue, tertiary: COLORS.neonPink },
    ready: { primary: COLORS.healthGreen, secondary: COLORS.healthGreenDark, tertiary: COLORS.specialBlue },
    round: { primary: '#FFFFFF', secondary: COLORS.chrome, tertiary: COLORS.chromeDark },
    combo: { primary: COLORS.neonPink, secondary: COLORS.neonPinkLight, tertiary: COLORS.p2Red },
  }

  const sizeMap = {
    sm: '0.875rem',
    md: '1.5rem',
    lg: '2.5rem',
    xl: '4rem',
  }

  const colors = colorMap[type]

  return (
    <span
      className="font-black tracking-[0.25em] uppercase"
      style={{
        fontSize: sizeMap[size],
        fontFamily: '"Impact", "Arial Black", sans-serif',
        color: colors.primary,
        textShadow: `
          0 0 10px ${colors.primary},
          0 0 20px ${colors.secondary},
          0 0 30px ${colors.tertiary}60,
          3px 3px 0 ${COLORS.arcadeBlack},
          -1px -1px 0 ${COLORS.arcadeBlack},
          1px -1px 0 ${COLORS.arcadeBlack},
          -1px 1px 0 ${COLORS.arcadeBlack}
        `,
        WebkitTextStroke: size === 'xl' || size === 'lg' ? `2px ${COLORS.arcadeBlack}` : `1px ${COLORS.arcadeBlack}`,
      }}
    >
      {text}
    </span>
  )
}


// =============================================================================
// PLAYER INDICATOR (P1/P2 TAG)
// =============================================================================
export function PlayerIndicator({ player, side }: { player: 1 | 2; side: 'left' | 'right' }) {
  const color = player === 1 ? COLORS.p1Blue : COLORS.p2Red

  return (
    <div
      className={`absolute -top-10 ${side === 'left' ? 'left-4' : 'right-4'} px-4 py-1.5`}
      aria-label={`Player ${player}`}
      style={{
        background: `linear-gradient(180deg, ${color}, ${color}dd)`,
        border: `3px solid ${COLORS.arcadeBlack}`,
        borderRadius: '2px',
        boxShadow: `0 0 15px ${color}80, 0 4px 8px rgba(0,0,0,0.5)`,
        clipPath: 'polygon(10% 0, 90% 0, 100% 100%, 0 100%)',
      }}
    >
      <span
        className="text-sm font-black tracking-widest"
        style={{
          fontFamily: '"Impact", "Arial Black", sans-serif',
          color: '#FFF',
          textShadow: '0 2px 4px rgba(0,0,0,0.5)',
        }}
      >
        {player}P
      </span>
    </div>
  )
}

// =============================================================================
// FIGHT! ANNOUNCEMENT BANNER
// =============================================================================
export function FightBanner({ text, ready = false }: { text: string; ready?: boolean }) {
  const reducedMotion = useReducedMotion()

  return (
    <div
      className="text-center py-6 relative overflow-hidden"
      role="status"
      aria-live="polite"
      style={{
        background: lightningPattern,
      }}
    >
      {/* Electric sparks */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: `
            radial-gradient(circle at 20% 50%, ${COLORS.electricYellow}20 0%, transparent 20%),
            radial-gradient(circle at 80% 50%, ${COLORS.electricYellow}20 0%, transparent 20%)
          `,
        }}
      />

      <div className={`inline-block ${!reducedMotion && ready ? 'animate-ready-pulse' : ''}`}>
        <ArcadeText text={text} type={ready ? 'ready' : 'fight'} size="xl" />
      </div>
    </div>
  )
}
