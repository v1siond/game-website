'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useProfession } from '@/contexts/ProfessionContext'
import { ProfessionSwitch, type ProfessionOption } from '@/components/cv/ProfessionSwitch'
import { useCVData, useWorldView } from '@/components/cv/CVDataProvider'
import { RecruiterHero, type HeroActionSlot } from '@/components/cv/RecruiterHero'
import { ProjectList, type ProjectSlot } from '@/components/cv/ProjectList'
import { BandList, type BandSlot } from '@/components/cv/BandList'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import type { Profession } from '@/lib/cv/professions'
import type { CVData, Job } from '@/lib/cv/content'
import type { SectionsOf } from '@/lib/cv/cvView'
import { ProfessionSectionsView, type ProfessionSectionViews } from '@/components/cv/ProfessionSectionsView'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { jobYears, headingId } from '@/components/cv/sectionText'

// ============================================================================
// CRASH BANDICOOT EXACT COLOR PALETTE
// Deep research from Crash Bandicoot 1/2/3 gameplay
// ============================================================================
const COLORS = {
  // Crash Orange - The bandicoot himself
  crashOrange: '#FF6B00',
  crashOrangeBright: '#FF8C00',
  crashOrangeDark: '#E85D00',

  // Jungle Green - N. Sanity Island, jungle levels
  jungleGreen: '#228B22',
  jungleLime: '#32CD32',
  jungleDark: '#006400',

  // Tropical Teal - Water, streams, tropical accents
  tropicalTeal: '#008B8B',
  tropicalCyan: '#00CED1',
  tropicalTurquoise: '#40E0D0',

  // Beach Sand - N. Sanity Beach, sandy paths
  beachSand: '#F4A460',
  beachTan: '#DEB887',
  beachBrown: '#D2691E',

  // Ocean Blue - Jet-ski levels, beach water
  oceanBlue: '#1E90FF',
  oceanSky: '#00BFFF',
  oceanRoyal: '#4169E1',

  // TNT Red - Explosive crates
  tntRed: '#FF0000',
  tntDark: '#CC0000',

  // Wumpa Fruit Orange - The iconic collectible
  wumpaOrange: '#FF6600',
  wumpaGold: '#FF9900',

  // Aku Aku Mask Yellow/Gold - The protective spirit
  maskYellow: '#FFD700',
  maskGold: '#FFC125',

  // Crate Wood - All wooden crate varieties
  crateWood: '#8B4513',
  crateSienna: '#A0522D',
  cratePeru: '#CD853F',

  // Cortex Purple - Dr. Neo Cortex, lab levels
  cortexPurple: '#6B238E',
  cortexOrchid: '#9932CC',

  // Nitro Green - Instant explosion crates
  nitroGreen: '#00CC00',
  nitroBright: '#44FF44',

  // Gem colors - Collectible gems
  gemClear: '#E0E0E0',
  gemRed: '#FF3366',
  gemBlue: '#00CCFF',
  gemGreen: '#00FF99',
  gemYellow: '#FFFF00',
  gemPurple: '#CC44FF',

  // Time Trial - Clock and relic colors
  timeGold: '#FFD700',
  timeSapphire: '#0066FF',
  timePlatinum: '#E5E4E2',

  // Warp Room - Portal swirls
  warpPurple: '#8B00FF',
  warpBlue: '#00BFFF',
  warpPink: '#FF69B4',
}

// ============================================================================
// WUMPA FRUIT - The iconic apple-mango hybrid collectible
// ============================================================================
function WumpaFruit({ size = 24, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="Wumpa fruit"
    >
      {/* Main fruit body - apple-mango hybrid shape */}
      <ellipse cx="16" cy="18" rx="12" ry="11" fill={COLORS.wumpaOrange} />
      {/* Inner gradient simulation */}
      <ellipse cx="16" cy="18" rx="10" ry="9" fill={COLORS.wumpaGold} opacity="0.4" />
      {/* Highlight - top left shine */}
      <ellipse cx="11" cy="13" rx="4" ry="3" fill="#FFCC66" opacity="0.7" />
      {/* Stem */}
      <rect x="14" y="5" width="4" height="5" fill={COLORS.crateWood} rx="1" />
      {/* Left leaf */}
      <path d="M14 7 Q8 4 10 0 Q14 3 16 6 Z" fill={COLORS.jungleGreen} />
      {/* Right leaf */}
      <path d="M18 7 Q24 4 22 0 Q18 3 16 6 Z" fill={COLORS.jungleLime} />
      {/* Bottom shadow */}
      <ellipse cx="16" cy="28" rx="8" ry="2" fill="rgba(0,0,0,0.2)" />
    </svg>
  )
}

// ============================================================================
// GEM ICON - Collectible gems (clear, red, blue, green, yellow, purple)
// ============================================================================
function GemIcon({
  size = 24,
  color = 'clear',
  className = ''
}: {
  size?: number
  color?: 'clear' | 'red' | 'blue' | 'green' | 'yellow' | 'purple'
  className?: string
}) {
  const gemColors = {
    clear: { main: COLORS.gemClear, dark: '#B0B0B0', light: '#FFFFFF' },
    red: { main: COLORS.gemRed, dark: '#CC1144', light: '#FF6699' },
    blue: { main: COLORS.gemBlue, dark: '#0099CC', light: '#66DDFF' },
    green: { main: COLORS.gemGreen, dark: '#00CC77', light: '#66FFBB' },
    yellow: { main: COLORS.gemYellow, dark: '#CCCC00', light: '#FFFF66' },
    purple: { main: COLORS.gemPurple, dark: '#9933CC', light: '#DD77FF' },
  }
  const c = gemColors[color]

  return (
    <svg
      viewBox="0 0 24 28"
      width={size}
      height={size * 1.17}
      className={className}
      role="img"
      aria-label={`${color} gem`}
    >
      {/* Diamond shape - top half */}
      <path d="M12 2 L22 12 L12 15 L2 12 Z" fill={c.main} />
      {/* Diamond shape - bottom half */}
      <path d="M12 15 L22 12 L12 26 L2 12 Z" fill={c.dark} />
      {/* Left facet */}
      <path d="M12 2 L2 12 L12 15 Z" fill={c.light} opacity="0.4" />
      {/* Top shine */}
      <path d="M8 8 L12 4 L14 8 L12 10 Z" fill="white" opacity="0.6" />
      {/* Outer glow */}
      <ellipse cx="12" cy="14" rx="14" ry="16" fill={`url(#gemGlow-${color})`} opacity="0.3" />
      <defs>
        <radialGradient id={`gemGlow-${color}`}>
          <stop offset="0%" stopColor={c.main} />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
    </svg>
  )
}

// ============================================================================
// CRYSTAL - Power crystals (Crash 2/3 collectible)
// ============================================================================
function Crystal({ size = 24, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 36"
      width={size}
      height={size * 1.5}
      className={className}
      role="img"
      aria-label="Power crystal"
    >
      {/* Main crystal body */}
      <path d="M12 2 L20 10 L20 28 L12 34 L4 28 L4 10 Z" fill={COLORS.cortexPurple} />
      {/* Right facet - darker */}
      <path d="M12 2 L20 10 L20 28 L12 34 Z" fill={COLORS.cortexOrchid} opacity="0.7" />
      {/* Left facet - lighter */}
      <path d="M12 2 L4 10 L4 28 L12 34 Z" fill={COLORS.cortexPurple} />
      {/* Center line */}
      <path d="M12 2 L12 34" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
      {/* Top shine */}
      <path d="M8 10 L12 5 L14 10 L12 14 Z" fill="white" opacity="0.5" />
      {/* Glow effect */}
      <ellipse cx="12" cy="18" rx="14" ry="20" fill="url(#crystalGlow)" opacity="0.4" />
      <defs>
        <radialGradient id="crystalGlow">
          <stop offset="0%" stopColor={COLORS.cortexOrchid} />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
    </svg>
  )
}

// ============================================================================
// AKU AKU MASK - The iconic tiki mask with feathers
// ============================================================================
function AkuAkuMask({
  size = 60,
  className = '',
  animated = true
}: {
  size?: number
  className?: string
  animated?: boolean
}) {
  const reducedMotion = useReducedMotion()
  const shouldAnimate = animated && !reducedMotion

  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size * 1.5 }}
      role="img"
      aria-label="Aku Aku tiki mask - protective spirit from Crash Bandicoot"
    >
      <svg viewBox="0 0 50 75" width={size} height={size * 1.5}>
        {/* Feathers on top - 5 colorful feathers */}
        <ellipse cx="10" cy="8" rx="4" ry="12" fill={COLORS.tntRed} transform="rotate(-35 10 8)" />
        <ellipse cx="17" cy="5" rx="3" ry="10" fill={COLORS.jungleLime} transform="rotate(-15 17 5)" />
        <ellipse cx="25" cy="3" rx="4" ry="14" fill={COLORS.maskYellow} />
        <ellipse cx="33" cy="5" rx="3" ry="10" fill={COLORS.oceanBlue} transform="rotate(15 33 5)" />
        <ellipse cx="40" cy="8" rx="4" ry="12" fill={COLORS.cortexPurple} transform="rotate(35 40 8)" />

        {/* Feather details - stripes */}
        <line x1="25" y1="3" x2="25" y2="15" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" />
        <line x1="10" y1="5" x2="10" y2="18" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" transform="rotate(-35 10 8)" />
        <line x1="40" y1="5" x2="40" y2="18" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" transform="rotate(35 40 8)" />

        {/* Main mask face - carved wood shape */}
        <path
          d="M10 20 Q5 30 7 50 Q10 65 25 70 Q40 65 43 50 Q45 30 40 20 Q35 12 25 12 Q15 12 10 20 Z"
          fill={COLORS.crateWood}
        />

        {/* Wood grain texture */}
        <path d="M15 25 Q20 28 20 45" stroke={COLORS.crateSienna} strokeWidth="0.8" fill="none" opacity="0.4" />
        <path d="M35 25 Q30 28 30 45" stroke={COLORS.crateSienna} strokeWidth="0.8" fill="none" opacity="0.4" />
        <path d="M25 20 Q25 35 25 55" stroke={COLORS.crateSienna} strokeWidth="0.5" fill="none" opacity="0.3" />

        {/* Eye sockets - glowing yellow/gold */}
        <ellipse cx="17" cy="32" rx="6" ry="7" fill={COLORS.maskYellow} />
        <ellipse cx="33" cy="32" rx="6" ry="7" fill={COLORS.maskYellow} />

        {/* Inner eye glow */}
        <ellipse cx="17" cy="32" rx="4" ry="5" fill={COLORS.maskGold} />
        <ellipse cx="33" cy="32" rx="4" ry="5" fill={COLORS.maskGold} />

        {/* Pupils - white with black centers */}
        <circle cx="17" cy="32" r="3" fill="white" />
        <circle cx="33" cy="32" r="3" fill="white" />
        <circle cx="17" cy="32" r="1.5" fill="black" />
        <circle cx="33" cy="32" r="1.5" fill="black" />

        {/* Tribal eyebrow markings */}
        <path d="M10 25 Q14 20 20 25" stroke={COLORS.maskYellow} strokeWidth="2" fill="none" />
        <path d="M30 25 Q36 20 40 25" stroke={COLORS.maskYellow} strokeWidth="2" fill="none" />

        {/* Nose - triangular carved shape */}
        <path d="M22 38 L25 50 L28 38 Z" fill="#5C3D1A" />
        <path d="M25 38 L25 48" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5" />

        {/* Mouth - tribal zigzag pattern with teeth */}
        <path
          d="M14 54 Q17 52 20 54 Q23 52 25 54 Q27 52 30 54 Q33 52 36 54 Q34 60 25 62 Q16 60 14 54 Z"
          fill={COLORS.tntRed}
        />

        {/* Teeth - rectangular blocks */}
        <rect x="16" y="54" width="3" height="4" fill="white" rx="0.5" />
        <rect x="21" y="54" width="3" height="4" fill="white" rx="0.5" />
        <rect x="26" y="54" width="3" height="4" fill="white" rx="0.5" />
        <rect x="31" y="54" width="3" height="4" fill="white" rx="0.5" />

        {/* Tribal side decorations - bone/tusk shapes */}
        <ellipse cx="5" cy="40" rx="3" ry="8" fill={COLORS.beachTan} />
        <ellipse cx="45" cy="40" rx="3" ry="8" fill={COLORS.beachTan} />

        {/* Side tribal markings */}
        <path d="M7 45 L5 50 L7 55" stroke={COLORS.maskYellow} strokeWidth="2" fill="none" />
        <path d="M43 45 L45 50 L43 55" stroke={COLORS.maskYellow} strokeWidth="2" fill="none" />

        {/* Chin marking */}
        <path d="M20 65 Q25 68 30 65" stroke={COLORS.maskYellow} strokeWidth="1.5" fill="none" />
      </svg>

      {/* Mystical glow effect */}
      {shouldAnimate && (
        <div
          className="absolute inset-0 animate-aku-glow"
          style={{
            background: `radial-gradient(circle at 50% 45%, ${COLORS.maskYellow}50 0%, transparent 60%)`,
            filter: 'blur(6px)',
          }}
          aria-hidden="true"
        />
      )}
    </div>
  )
}

// ============================================================================
// CRASH SILHOUETTE - Spiky hair, jeans character outline
// ============================================================================
function CrashSilhouette({ size = 60, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 40 60"
      width={size}
      height={size * 1.5}
      className={className}
      role="img"
      aria-label="Crash Bandicoot silhouette"
    >
      {/* Spiky mohawk hair */}
      <path d="M15 8 L17 0 L20 6 L23 0 L25 8" fill={COLORS.crashOrange} />

      {/* Head */}
      <ellipse cx="20" cy="14" rx="10" ry="9" fill={COLORS.crashOrange} />

      {/* Ears */}
      <ellipse cx="8" cy="10" rx="4" ry="5" fill={COLORS.crashOrange} />
      <ellipse cx="32" cy="10" rx="4" ry="5" fill={COLORS.crashOrange} />
      <ellipse cx="8" cy="10" rx="2" ry="3" fill={COLORS.beachTan} />
      <ellipse cx="32" cy="10" rx="2" ry="3" fill={COLORS.beachTan} />

      {/* Face - snout area */}
      <ellipse cx="20" cy="18" rx="6" ry="4" fill={COLORS.beachTan} />

      {/* Eyes */}
      <ellipse cx="15" cy="13" rx="3" ry="4" fill="white" />
      <ellipse cx="25" cy="13" rx="3" ry="4" fill="white" />
      <circle cx="15" cy="13" r="2" fill={COLORS.jungleDark} />
      <circle cx="25" cy="13" r="2" fill={COLORS.jungleDark} />

      {/* Nose */}
      <ellipse cx="20" cy="16" rx="2" ry="1.5" fill="#333" />

      {/* Big grin */}
      <path d="M14 19 Q20 24 26 19" stroke="#333" strokeWidth="1" fill="none" />

      {/* Body - blue jeans style */}
      <rect x="12" y="23" width="16" height="20" fill={COLORS.oceanRoyal} rx="3" />

      {/* Belt */}
      <rect x="12" y="25" width="16" height="3" fill={COLORS.crateWood} />

      {/* Arms */}
      <ellipse cx="8" cy="32" rx="4" ry="6" fill={COLORS.crashOrange} />
      <ellipse cx="32" cy="32" rx="4" ry="6" fill={COLORS.crashOrange} />

      {/* Gloves */}
      <ellipse cx="8" cy="38" rx="4" ry="3" fill={COLORS.tntRed} />
      <ellipse cx="32" cy="38" rx="4" ry="3" fill={COLORS.tntRed} />

      {/* Legs */}
      <rect x="13" y="43" width="6" height="12" fill={COLORS.oceanRoyal} />
      <rect x="21" y="43" width="6" height="12" fill={COLORS.oceanRoyal} />

      {/* Shoes */}
      <ellipse cx="16" cy="57" rx="5" ry="3" fill={COLORS.tntRed} />
      <ellipse cx="24" cy="57" rx="5" ry="3" fill={COLORS.tntRed} />
    </svg>
  )
}

// ============================================================================
// TNT CRATE - Red explosive with countdown
// ============================================================================
function TNTCrate({
  size = 40,
  className = '',
  countdown = false
}: {
  size?: number
  className?: string
  countdown?: boolean
}) {
  const reducedMotion = useReducedMotion()
  const [count, setCount] = useState(3)

  useEffect(() => {
    if (!countdown || reducedMotion) return
    const interval = setInterval(() => {
      setCount(c => c <= 1 ? 3 : c - 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [countdown, reducedMotion])

  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label="TNT crate - explosive box"
    >
      <svg viewBox="0 0 40 40" width={size} height={size}>
        {/* Main crate body - red */}
        <rect x="2" y="2" width="36" height="36" fill={COLORS.tntRed} stroke={COLORS.tntDark} strokeWidth="2" rx="2" />

        {/* Wood plank texture lines */}
        <line x1="2" y1="14" x2="38" y2="14" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
        <line x1="2" y1="26" x2="38" y2="26" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
        <line x1="14" y1="2" x2="14" y2="38" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
        <line x1="26" y1="2" x2="26" y2="38" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />

        {/* Corner metal brackets */}
        <path d="M2 8 L8 8 L8 2" stroke={COLORS.crateWood} strokeWidth="3" fill="none" />
        <path d="M38 8 L32 8 L32 2" stroke={COLORS.crateWood} strokeWidth="3" fill="none" />
        <path d="M2 32 L8 32 L8 38" stroke={COLORS.crateWood} strokeWidth="3" fill="none" />
        <path d="M38 32 L32 32 L32 38" stroke={COLORS.crateWood} strokeWidth="3" fill="none" />

        {/* TNT Text - bold impact style */}
        <text
          x="20" y="24"
          textAnchor="middle"
          fill="white"
          fontWeight="900"
          fontSize="11"
          fontFamily="Impact, Arial Black, sans-serif"
          style={{ textShadow: '1px 1px 0 #000' }}
        >
          TNT
        </text>

        {/* Countdown number */}
        {countdown && (
          <text
            x="20" y="35"
            textAnchor="middle"
            fill={COLORS.maskYellow}
            fontWeight="bold"
            fontSize="8"
            fontFamily="monospace"
          >
            {count}
          </text>
        )}
      </svg>

      {/* Danger pulse glow */}
      {!reducedMotion && (
        <div
          className="absolute inset-0 animate-tnt-pulse"
          style={{
            background: `radial-gradient(circle, ${COLORS.tntRed}40 0%, transparent 70%)`,
          }}
          aria-hidden="true"
        />
      )}
    </div>
  )
}

// ============================================================================
// NITRO CRATE - Green instant explosion
// ============================================================================
function NitroCrate({ size = 40, className = '' }: { size?: number; className?: string }) {
  const reducedMotion = useReducedMotion()

  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label="Nitro crate - instant explosion"
    >
      <svg viewBox="0 0 40 40" width={size} height={size}>
        {/* Main crate body - green */}
        <rect x="2" y="2" width="36" height="36" fill={COLORS.nitroGreen} stroke={COLORS.nitroBright} strokeWidth="2" rx="2" />

        {/* Warning stripes - yellow */}
        <rect x="2" y="10" width="36" height="4" fill={COLORS.maskYellow} />
        <rect x="2" y="26" width="36" height="4" fill={COLORS.maskYellow} />

        {/* Exclamation mark */}
        <rect x="17" y="15" width="6" height="8" fill={COLORS.maskYellow} rx="1" />
        <circle cx="20" cy="28" r="3" fill={COLORS.maskYellow} />

        {/* Corner brackets */}
        <path d="M2 8 L8 8 L8 2" stroke={COLORS.maskYellow} strokeWidth="2" fill="none" />
        <path d="M38 8 L32 8 L32 2" stroke={COLORS.maskYellow} strokeWidth="2" fill="none" />
        <path d="M2 32 L8 32 L8 38" stroke={COLORS.maskYellow} strokeWidth="2" fill="none" />
        <path d="M38 32 L32 32 L32 38" stroke={COLORS.maskYellow} strokeWidth="2" fill="none" />
      </svg>

      {/* Toxic glow */}
      {!reducedMotion && (
        <div
          className="absolute inset-0 animate-nitro-glow"
          style={{
            background: `radial-gradient(circle, ${COLORS.nitroBright}30 0%, transparent 60%)`,
          }}
          aria-hidden="true"
        />
      )}
    </div>
  )
}

// ============================================================================
// WOODEN CRATE - Basic/Bouncy/Checkpoint variants
// ============================================================================
function WoodenCrate({
  size = 40,
  className = '',
  variant = 'basic'
}: {
  size?: number
  className?: string
  variant?: 'basic' | 'bouncy' | 'checkpoint' | 'questionmark'
}) {
  const variants = {
    basic: { fill: COLORS.crateWood, stroke: COLORS.cratePeru, icon: null, iconColor: null },
    bouncy: { fill: COLORS.jungleGreen, stroke: COLORS.jungleLime, icon: 'arrow', iconColor: 'white' },
    checkpoint: { fill: COLORS.crateWood, stroke: COLORS.maskYellow, icon: 'C', iconColor: COLORS.maskYellow },
    questionmark: { fill: COLORS.crateWood, stroke: COLORS.cratePeru, icon: '?', iconColor: COLORS.maskYellow },
  }
  const v = variants[variant]

  return (
    <svg
      viewBox="0 0 40 40"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={`${variant} crate`}
    >
      {/* Main crate body */}
      <rect x="2" y="2" width="36" height="36" fill={v.fill} stroke={v.stroke} strokeWidth="2" rx="2" />

      {/* Wood plank pattern - horizontal */}
      <line x1="2" y1="14" x2="38" y2="14" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
      <line x1="2" y1="26" x2="38" y2="26" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />

      {/* Wood plank pattern - vertical on top/bottom sections */}
      <line x1="14" y1="2" x2="14" y2="14" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
      <line x1="26" y1="2" x2="26" y2="14" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
      <line x1="14" y1="26" x2="14" y2="38" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
      <line x1="26" y1="26" x2="26" y2="38" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />

      {/* Metal corner brackets */}
      <rect x="3" y="3" width="5" height="5" fill="#666" rx="1" />
      <rect x="32" y="3" width="5" height="5" fill="#666" rx="1" />
      <rect x="3" y="32" width="5" height="5" fill="#666" rx="1" />
      <rect x="32" y="32" width="5" height="5" fill="#666" rx="1" />

      {/* Variant icons */}
      {v.icon === 'arrow' && (
        <path d="M20 10 L28 20 L23 20 L23 30 L17 30 L17 20 L12 20 Z" fill={v.iconColor} />
      )}
      {v.icon === 'C' && (
        <text x="20" y="27" textAnchor="middle" fill={v.iconColor} fontWeight="bold" fontSize="18" fontFamily="Impact, sans-serif">C</text>
      )}
      {v.icon === '?' && (
        <text x="20" y="28" textAnchor="middle" fill={v.iconColor} fontWeight="bold" fontSize="20" fontFamily="Impact, sans-serif">?</text>
      )}
    </svg>
  )
}

// ============================================================================
// TIKI TOTEM - Decorative jungle totem pole
// ============================================================================
function TikiTotem({ size = 40, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 30 60"
      width={size}
      height={size * 2}
      className={className}
      role="img"
      aria-label="Tiki totem"
    >
      {/* Totem base */}
      <rect x="8" y="50" width="14" height="10" fill={COLORS.crateWood} />

      {/* Main totem body */}
      <rect x="5" y="10" width="20" height="40" fill={COLORS.crateWood} rx="2" />

      {/* Top cap */}
      <rect x="3" y="5" width="24" height="8" fill={COLORS.crateSienna} rx="2" />

      {/* Face 1 - top angry face */}
      <ellipse cx="11" cy="18" rx="3" ry="4" fill={COLORS.maskYellow} />
      <ellipse cx="19" cy="18" rx="3" ry="4" fill={COLORS.maskYellow} />
      <circle cx="11" cy="18" r="1.5" fill="black" />
      <circle cx="19" cy="18" r="1.5" fill="black" />
      <path d="M9 14 L14 16" stroke={COLORS.tntRed} strokeWidth="2" />
      <path d="M21 14 L16 16" stroke={COLORS.tntRed} strokeWidth="2" />
      <path d="M10 24 Q15 28 20 24" stroke={COLORS.tntRed} strokeWidth="2" fill="none" />

      {/* Divider */}
      <rect x="5" y="28" width="20" height="3" fill={COLORS.jungleGreen} />

      {/* Face 2 - bottom happy face */}
      <ellipse cx="11" cy="38" rx="3" ry="4" fill={COLORS.maskYellow} />
      <ellipse cx="19" cy="38" rx="3" ry="4" fill={COLORS.maskYellow} />
      <circle cx="11" cy="38" r="1.5" fill="black" />
      <circle cx="19" cy="38" r="1.5" fill="black" />
      <path d="M10 42 Q15 46 20 42" stroke={COLORS.tntRed} strokeWidth="2" fill="none" />
    </svg>
  )
}

// ============================================================================
// TIME TRIAL CLOCK - Floating time icon
// ============================================================================
function TimeTrialClock({ size = 32, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="Time trial clock"
    >
      {/* Clock face */}
      <circle cx="16" cy="16" r="14" fill={COLORS.timeGold} stroke={COLORS.crashOrangeDark} strokeWidth="2" />
      <circle cx="16" cy="16" r="11" fill="white" />

      {/* Clock markings */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
        <line
          key={angle}
          x1={16 + 9 * Math.cos((angle - 90) * Math.PI / 180)}
          y1={16 + 9 * Math.sin((angle - 90) * Math.PI / 180)}
          x2={16 + 11 * Math.cos((angle - 90) * Math.PI / 180)}
          y2={16 + 11 * Math.sin((angle - 90) * Math.PI / 180)}
          stroke="#333"
          strokeWidth={angle % 90 === 0 ? "2" : "1"}
        />
      ))}

      {/* Clock hands */}
      <line x1="16" y1="16" x2="16" y2="7" stroke="#333" strokeWidth="2" strokeLinecap="round" />
      <line x1="16" y1="16" x2="22" y2="16" stroke={COLORS.tntRed} strokeWidth="1.5" strokeLinecap="round" />

      {/* Center dot */}
      <circle cx="16" cy="16" r="2" fill="#333" />
    </svg>
  )
}

// ============================================================================
// WARP PORTAL - Swirling vortex effect
// ============================================================================
function WarpPortal({
  size = 100,
  className = '',
  reducedMotion = false
}: {
  size?: number
  className?: string
  reducedMotion?: boolean
}) {
  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label="Warp portal"
    >
      <svg viewBox="0 0 100 100" width={size} height={size}>
        {/* Outer glow ring */}
        <circle
          cx="50" cy="50" r="48"
          fill="none"
          stroke={COLORS.warpPurple}
          strokeWidth="4"
          opacity="0.5"
        />

        {/* Swirl rings - animated */}
        <circle
          cx="50" cy="50" r="40"
          fill="none"
          stroke={COLORS.warpBlue}
          strokeWidth="6"
          strokeDasharray="25 10"
          className={reducedMotion ? '' : 'animate-warp-spin'}
        />
        <circle
          cx="50" cy="50" r="30"
          fill="none"
          stroke={COLORS.warpPink}
          strokeWidth="5"
          strokeDasharray="20 8"
          className={reducedMotion ? '' : 'animate-warp-spin-reverse'}
        />
        <circle
          cx="50" cy="50" r="20"
          fill="none"
          stroke={COLORS.warpPurple}
          strokeWidth="4"
          strokeDasharray="15 6"
          className={reducedMotion ? '' : 'animate-warp-spin'}
        />

        {/* Center vortex */}
        <circle cx="50" cy="50" r="12" fill={COLORS.warpPurple} opacity="0.8" />
        <circle cx="50" cy="50" r="8" fill={COLORS.warpBlue} opacity="0.9" />
        <circle cx="50" cy="50" r="4" fill="white" />

        {/* Sparkle effects */}
        <circle cx="30" cy="25" r="2" fill="white" opacity="0.8" />
        <circle cx="70" cy="30" r="1.5" fill="white" opacity="0.7" />
        <circle cx="25" cy="60" r="1" fill="white" opacity="0.6" />
        <circle cx="75" cy="70" r="2" fill="white" opacity="0.8" />
      </svg>

      {/* Portal glow */}
      {!reducedMotion && (
        <div
          className="absolute inset-0 animate-portal-pulse"
          style={{
            background: `radial-gradient(circle, ${COLORS.warpPurple}40 0%, transparent 70%)`,
            filter: 'blur(8px)',
          }}
          aria-hidden="true"
        />
      )}
    </div>
  )
}

// ============================================================================
// JUNGLE VINE - Side decoration
// ============================================================================
function JungleVine({ side = 'left', className = '' }: { side?: 'left' | 'right'; className?: string }) {
  return (
    <div
      className={`absolute top-0 ${side === 'left' ? 'left-0' : 'right-0'} w-20 h-full pointer-events-none ${className}`}
      style={{
        background: side === 'left'
          ? `linear-gradient(90deg, ${COLORS.jungleDark}60 0%, transparent 100%)`
          : `linear-gradient(-90deg, ${COLORS.jungleDark}60 0%, transparent 100%)`,
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 80 500"
        width={80}
        height="100%"
        preserveAspectRatio="none"
        className={side === 'right' ? 'scale-x-[-1]' : ''}
      >
        {/* Main vine curves */}
        <path
          d="M40 0 Q10 60 30 120 Q50 180 20 240 Q-10 300 30 360 Q70 420 30 500"
          stroke={COLORS.jungleGreen}
          strokeWidth="6"
          fill="none"
        />
        <path
          d="M50 0 Q20 80 40 140 Q60 200 30 260 Q0 320 40 380 Q80 440 40 500"
          stroke={COLORS.jungleLime}
          strokeWidth="4"
          fill="none"
        />

        {/* Leaves along the vine */}
        {[80, 180, 280, 380, 480].map((y) => (
          <g key={y}>
            <ellipse cx="30" cy={y} rx="18" ry="8" fill={COLORS.jungleLime} transform={`rotate(-30 30 ${y})`} />
            <ellipse cx="40" cy={y + 30} rx="15" ry="7" fill={COLORS.jungleGreen} transform={`rotate(25 40 ${y + 30})`} />
            {/* Leaf vein */}
            <line
              x1="18" y1={y}
              x2="42" y2={y}
              stroke={COLORS.jungleDark}
              strokeWidth="1"
              opacity="0.4"
              transform={`rotate(-30 30 ${y})`}
            />
          </g>
        ))}

        {/* Small wumpa fruits on vine */}
        <circle cx="35" cy="150" r="8" fill={COLORS.wumpaOrange} />
        <circle cx="25" cy="350" r="8" fill={COLORS.wumpaOrange} />
      </svg>
    </div>
  )
}

// ============================================================================
// OCEAN WAVES - Bottom decoration
// ============================================================================
function OceanWaves({ className = '' }: { className?: string }) {
  const reducedMotion = useReducedMotion()

  return (
    <div
      className={`absolute bottom-0 left-0 right-0 h-40 pointer-events-none overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* Deep water gradient */}
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(180deg, transparent 0%, ${COLORS.oceanRoyal}80 50%, ${COLORS.oceanBlue} 100%)` }}
      />

      {/* Wave layers */}
      <svg viewBox="0 0 1440 150" preserveAspectRatio="none" className="absolute bottom-0 w-full h-28">
        {/* Back wave */}
        <path
          d="M0 80 Q180 30 360 80 T720 80 T1080 80 T1440 80 L1440 150 L0 150 Z"
          fill={COLORS.oceanRoyal}
          className={reducedMotion ? '' : 'animate-wave-slow'}
        />
        {/* Middle wave */}
        <path
          d="M0 100 Q180 60 360 100 T720 100 T1080 100 T1440 100 L1440 150 L0 150 Z"
          fill={COLORS.oceanBlue}
          className={reducedMotion ? '' : 'animate-wave-medium'}
        />
        {/* Front wave */}
        <path
          d="M0 115 Q180 85 360 115 T720 115 T1080 115 T1440 115 L1440 150 L0 150 Z"
          fill={COLORS.oceanSky}
          className={reducedMotion ? '' : 'animate-wave-fast'}
        />

        {/* Foam patches */}
        <ellipse cx="120" cy="118" rx="40" ry="6" fill="white" opacity="0.7" />
        <ellipse cx="500" cy="115" rx="35" ry="5" fill="white" opacity="0.6" />
        <ellipse cx="900" cy="120" rx="45" ry="6" fill="white" opacity="0.7" />
        <ellipse cx="1300" cy="116" rx="38" ry="5" fill="white" opacity="0.6" />
      </svg>

      {/* Beach sand strip */}
      <div
        className="absolute bottom-0 left-0 right-0 h-5"
        style={{ background: `linear-gradient(180deg, ${COLORS.beachSand} 0%, ${COLORS.beachBrown} 100%)` }}
      />
    </div>
  )
}

// ============================================================================
// FLOATING JUNGLE ELEMENTS
// ============================================================================
function JungleFloaters({
  profession,
  reducedMotion = false
}: {
  profession: 'engineer' | 'drummer' | 'fighter'
  reducedMotion?: boolean
}) {
  const floatersByProfession = {
    engineer: [
      { type: 'wumpa', x: 5, y: 12 },
      { type: 'gem', x: 92, y: 22, color: 'blue' as const },
      { type: 'crate', x: 7, y: 55 },
      { type: 'gem', x: 88, y: 70, color: 'green' as const },
      { type: 'crystal', x: 10, y: 85 },
    ],
    drummer: [
      { type: 'wumpa', x: 6, y: 18 },
      { type: 'gem', x: 90, y: 28, color: 'purple' as const },
      { type: 'wumpa', x: 8, y: 50 },
      { type: 'crate', x: 88, y: 65 },
      { type: 'gem', x: 5, y: 78, color: 'yellow' as const },
    ],
    fighter: [
      { type: 'gem', x: 6, y: 15, color: 'red' as const },
      { type: 'wumpa', x: 91, y: 25 },
      { type: 'crate', x: 7, y: 48 },
      { type: 'wumpa', x: 89, y: 62 },
      { type: 'crystal', x: 8, y: 80 },
    ],
  }

  const floaters = floatersByProfession[profession]

  return (
    <div className="fixed inset-0 pointer-events-none z-[4] overflow-hidden" aria-hidden="true">
      {floaters.map((f, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${f.x}%`,
            top: `${f.y}%`,
            opacity: 0.6,
            animation: reducedMotion ? 'none' : `jungleFloat ${10 + i * 3}s ease-in-out infinite`,
            animationDelay: `${-i * 2}s`,
          }}
        >
          {f.type === 'wumpa' && <WumpaFruit size={32} />}
          {f.type === 'gem' && <GemIcon size={26} color={f.color || 'clear'} />}
          {f.type === 'crate' && <WoodenCrate size={30} />}
          {f.type === 'crystal' && <Crystal size={28} />}
        </div>
      ))}
    </div>
  )
}

// ============================================================================
// ART SECTION 1: JUNGLE SCENE (After About)
// Aku Aku mask, vines, wumpa fruits
// ============================================================================
function JungleSceneArt({ reducedMotion = false }: { reducedMotion?: boolean }) {
  return (
    <div className="relative z-10 py-12 overflow-hidden" aria-hidden="true">
      <div className="max-w-5xl mx-auto px-4">
        <svg viewBox="0 0 1000 150" className="w-full h-36" preserveAspectRatio="xMidYMid meet">
          {/* Ground/jungle floor */}
          <rect x="0" y="120" width="1000" height="30" fill={COLORS.jungleDark} />
          <rect x="0" y="115" width="1000" height="10" fill={COLORS.jungleGreen} opacity="0.7" />

          {/* Grass tufts */}
          {[50, 150, 300, 450, 600, 750, 900].map((x, i) => (
            <g key={i}>
              <path d={`M${x} 115 Q${x-8} 95 ${x-5} 80`} stroke={COLORS.jungleLime} strokeWidth="3" fill="none" />
              <path d={`M${x} 115 Q${x+5} 90 ${x+8} 75`} stroke={COLORS.jungleGreen} strokeWidth="3" fill="none" />
              <path d={`M${x} 115 Q${x+12} 100 ${x+15} 85`} stroke={COLORS.jungleLime} strokeWidth="2" fill="none" />
            </g>
          ))}

          {/* Vine hanging from top-left */}
          <path d="M0 0 Q50 40 30 80 Q10 120 40 150" stroke={COLORS.jungleGreen} strokeWidth="5" fill="none" />
          <ellipse cx="35" cy="60" rx="15" ry="7" fill={COLORS.jungleLime} transform="rotate(-20 35 60)" />
          <ellipse cx="25" cy="100" rx="12" ry="6" fill={COLORS.jungleGreen} transform="rotate(15 25 100)" />

          {/* Vine hanging from top-right */}
          <path d="M1000 0 Q950 50 970 90 Q990 130 960 150" stroke={COLORS.jungleGreen} strokeWidth="5" fill="none" />
          <ellipse cx="965" cy="70" rx="15" ry="7" fill={COLORS.jungleLime} transform="rotate(20 965 70)" />
          <ellipse cx="975" cy="110" rx="12" ry="6" fill={COLORS.jungleGreen} transform="rotate(-15 975 110)" />

          {/* Left tiki totem */}
          <g transform="translate(80, 40)">
            <rect x="0" y="50" width="30" height="30" fill={COLORS.crateWood} />
            <rect x="-5" y="5" width="40" height="50" fill={COLORS.crateSienna} rx="3" />
            <rect x="-8" y="0" width="46" height="10" fill={COLORS.crateWood} rx="2" />
            <ellipse cx="10" cy="25" rx="5" ry="6" fill={COLORS.maskYellow} />
            <ellipse cx="20" cy="25" rx="5" ry="6" fill={COLORS.maskYellow} />
            <circle cx="10" cy="25" r="2" fill="black" />
            <circle cx="20" cy="25" r="2" fill="black" />
            <path d="M8 40 Q15 45 22 40" stroke={COLORS.tntRed} strokeWidth="2.5" fill="none" />
          </g>

          {/* Center - Large Aku Aku mask floating */}
          <g transform="translate(500, 10)" className={reducedMotion ? '' : 'animate-aku-float'}>
            {/* Feathers */}
            <ellipse cx="-20" cy="15" rx="8" ry="20" fill={COLORS.tntRed} transform="rotate(-30 -20 15)" />
            <ellipse cx="-5" cy="8" rx="6" ry="16" fill={COLORS.jungleLime} transform="rotate(-10 -5 8)" />
            <ellipse cx="0" cy="5" rx="7" ry="22" fill={COLORS.maskYellow} />
            <ellipse cx="5" cy="8" rx="6" ry="16" fill={COLORS.oceanBlue} transform="rotate(10 5 8)" />
            <ellipse cx="20" cy="15" rx="8" ry="20" fill={COLORS.cortexPurple} transform="rotate(30 20 15)" />

            {/* Mask face */}
            <path d="M-25 30 Q-35 50 -30 80 Q-25 100 0 105 Q25 100 30 80 Q35 50 25 30 Q15 20 0 20 Q-15 20 -25 30 Z" fill={COLORS.crateWood} />
            <ellipse cx="-10" cy="50" rx="8" ry="10" fill={COLORS.maskYellow} />
            <ellipse cx="10" cy="50" rx="8" ry="10" fill={COLORS.maskYellow} />
            <circle cx="-10" cy="50" r="4" fill="white" />
            <circle cx="10" cy="50" r="4" fill="white" />
            <circle cx="-10" cy="50" r="2" fill="black" />
            <circle cx="10" cy="50" r="2" fill="black" />
            <path d="M-5 65 L0 78 L5 65 Z" fill="#5C3D1A" />
            <path d="M-12 85 Q-5 82 0 85 Q5 82 12 85 Q8 95 0 98 Q-8 95 -12 85 Z" fill={COLORS.tntRed} />
          </g>

          {/* Wumpa fruits floating */}
          <g className={reducedMotion ? '' : 'animate-wumpa-bob'}>
            <ellipse cx="250" cy="50" rx="18" ry="16" fill={COLORS.wumpaOrange} />
            <ellipse cx="245" cy="44" rx="6" ry="4" fill={COLORS.wumpaGold} opacity="0.6" />
            <path d="M250 34 Q256 28 262 32 Q256 26 250 30 Z" fill={COLORS.jungleGreen} />
          </g>

          <g className={reducedMotion ? '' : 'animate-wumpa-bob-delayed'}>
            <ellipse cx="750" cy="45" rx="18" ry="16" fill={COLORS.wumpaOrange} />
            <ellipse cx="745" cy="39" rx="6" ry="4" fill={COLORS.wumpaGold} opacity="0.6" />
            <path d="M750 29 Q756 23 762 27 Q756 21 750 25 Z" fill={COLORS.jungleGreen} />
          </g>

          {/* Right tiki totem */}
          <g transform="translate(890, 50)">
            <rect x="0" y="40" width="25" height="30" fill={COLORS.crateWood} />
            <rect x="-3" y="5" width="32" height="40" fill={COLORS.crateSienna} rx="3" />
            <rect x="-6" y="0" width="38" height="8" fill={COLORS.crateWood} rx="2" />
            <ellipse cx="8" cy="20" rx="4" ry="5" fill={COLORS.maskYellow} />
            <ellipse cx="18" cy="20" rx="4" ry="5" fill={COLORS.maskYellow} />
            <circle cx="8" cy="20" r="2" fill="black" />
            <circle cx="18" cy="20" r="2" fill="black" />
            <path d="M6 32 Q13 36 20 32" stroke={COLORS.tntRed} strokeWidth="2" fill="none" />
          </g>

          {/* Gems scattered */}
          <g className={reducedMotion ? '' : 'animate-gem-sparkle'}>
            <path d="M180 90 L190 100 L180 115 L170 100 Z" fill={COLORS.gemBlue} />
            <path d="M178 95 L180 92 L182 95 L180 98 Z" fill="white" opacity="0.7" />
          </g>

          <g className={reducedMotion ? '' : 'animate-gem-sparkle-delayed'}>
            <path d="M820 95 L830 105 L820 120 L810 105 Z" fill={COLORS.gemGreen} />
            <path d="M818 100 L820 97 L822 100 L820 103 Z" fill="white" opacity="0.7" />
          </g>
        </svg>
      </div>
    </div>
  )
}

// ============================================================================
// ART SECTION 2: CRATE STACK (After Experience)
// Various crate types with gems
// ============================================================================
function CrateStackArt({ reducedMotion = false }: { reducedMotion?: boolean }) {
  return (
    <div className="relative z-10 py-10 overflow-hidden" aria-hidden="true">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-center items-end gap-3 flex-wrap">
          {/* Left stack */}
          <div className="flex flex-col items-center gap-1">
            <WoodenCrate size={40} variant="basic" />
            <WoodenCrate size={40} variant="questionmark" />
            <WoodenCrate size={40} variant="basic" />
          </div>

          {/* Wumpa cluster */}
          <div className="flex flex-col items-center gap-2 mb-6">
            <WumpaFruit size={36} />
            <div className="flex gap-1">
              <WumpaFruit size={28} />
              <WumpaFruit size={28} />
            </div>
          </div>

          {/* Center stack with TNT */}
          <div className="flex flex-col items-center gap-1 relative">
            <div className={reducedMotion ? '' : 'animate-bounce-slow'}>
              <GemIcon size={30} color="red" />
            </div>
            <WoodenCrate size={45} variant="bouncy" />
            <TNTCrate size={50} countdown={!reducedMotion} />
            <WoodenCrate size={50} variant="basic" />
          </div>

          {/* Crystal and gem cluster */}
          <div className="flex flex-col items-center gap-2 mb-4">
            <Crystal size={40} />
            <div className="flex gap-2">
              <GemIcon size={22} color="blue" />
              <GemIcon size={22} color="purple" />
            </div>
          </div>

          {/* Nitro stack */}
          <div className="flex flex-col items-center gap-1">
            <NitroCrate size={40} />
            <WoodenCrate size={40} variant="checkpoint" />
            <WoodenCrate size={40} variant="basic" />
          </div>

          {/* Time trial clock */}
          <div className="flex flex-col items-center gap-2 mb-8">
            <TimeTrialClock size={38} />
            <GemIcon size={24} color="yellow" />
          </div>
        </div>

        {/* Decorative divider */}
        <div className="mt-6 flex justify-center items-center gap-4">
          <div
            className="h-1 w-24"
            style={{ background: `linear-gradient(90deg, transparent, ${COLORS.maskYellow}, transparent)` }}
          />
          <WumpaFruit size={24} />
          <div className="h-1 w-32" style={{ background: COLORS.maskYellow }} />
          <WumpaFruit size={24} />
          <div
            className="h-1 w-24"
            style={{ background: `linear-gradient(90deg, transparent, ${COLORS.maskYellow}, transparent)` }}
          />
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// ART SECTION 3: WARP PORTAL (After Projects)
// Swirling vortex, crystals
// ============================================================================
function WarpPortalArt({ reducedMotion = false }: { reducedMotion?: boolean }) {
  return (
    <div className="relative z-10 py-12 overflow-hidden" aria-hidden="true">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-center items-center gap-8">
          {/* Left crystals */}
          <div className="flex flex-col gap-4 items-center">
            <Crystal size={35} />
            <GemIcon size={26} color="blue" />
            <Crystal size={30} />
          </div>

          {/* Left gem column */}
          <div className="flex flex-col gap-3">
            <GemIcon size={22} color="red" />
            <GemIcon size={22} color="green" />
            <GemIcon size={22} color="yellow" />
          </div>

          {/* Center warp portal */}
          <div className="relative">
            <WarpPortal size={140} reducedMotion={reducedMotion} />

            {/* Crash silhouette in portal */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-70">
              <CrashSilhouette size={35} />
            </div>
          </div>

          {/* Right gem column */}
          <div className="flex flex-col gap-3">
            <GemIcon size={22} color="purple" />
            <GemIcon size={22} color="clear" />
            <GemIcon size={22} color="blue" />
          </div>

          {/* Right crystals */}
          <div className="flex flex-col gap-4 items-center">
            <Crystal size={30} />
            <GemIcon size={26} color="purple" />
            <Crystal size={35} />
          </div>
        </div>

        {/* Portal platform */}
        <div className="flex justify-center mt-4">
          <svg viewBox="0 0 200 30" width={200} height={30}>
            <ellipse cx="100" cy="15" rx="95" ry="12" fill={COLORS.cortexPurple} opacity="0.6" />
            <ellipse cx="100" cy="15" rx="80" ry="8" fill={COLORS.warpPurple} opacity="0.4" />
          </svg>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// SECTION CARD - Wooden crate panel style with plank texture
// ============================================================================
function CratePanel({
  children,
  title,
  titleIcon,
  variant = 'wood',
  className = '',
}: {
  children: React.ReactNode
  title: string
  titleIcon?: React.ReactNode
  variant?: 'wood' | 'tnt' | 'checkpoint' | 'temple' | 'nitro'
  className?: string
}) {
  const variants = {
    wood: {
      bg: `linear-gradient(145deg, ${COLORS.crateWood}ee, ${COLORS.crateSienna}dd)`,
      border: COLORS.cratePeru,
      titleBg: COLORS.crateWood,
      accent: COLORS.maskYellow,
    },
    tnt: {
      bg: `linear-gradient(145deg, ${COLORS.tntRed}dd, ${COLORS.tntDark}ee)`,
      border: COLORS.tntRed,
      titleBg: COLORS.tntDark,
      accent: COLORS.maskYellow,
    },
    checkpoint: {
      bg: `linear-gradient(145deg, ${COLORS.oceanBlue}30, ${COLORS.oceanRoyal}50)`,
      border: COLORS.oceanSky,
      titleBg: COLORS.oceanRoyal,
      accent: COLORS.oceanSky,
    },
    temple: {
      bg: `linear-gradient(145deg, ${COLORS.beachBrown}cc, ${COLORS.crateWood}dd)`,
      border: COLORS.maskGold,
      titleBg: COLORS.beachBrown,
      accent: COLORS.maskYellow,
    },
    nitro: {
      bg: `linear-gradient(145deg, ${COLORS.nitroGreen}30, ${COLORS.jungleDark}60)`,
      border: COLORS.nitroBright,
      titleBg: COLORS.jungleDark,
      accent: COLORS.nitroBright,
    },
  }
  const v = variants[variant]

  return (
    <section
      className={`relative ${className}`}
      aria-labelledby={headingId('section', title)}
    >
      {/* Tiki corner decorations */}
      <div
        className="absolute -top-3 -left-3 w-10 h-10"
        style={{
          borderLeft: `4px solid ${v.accent}`,
          borderTop: `4px solid ${v.accent}`,
          borderRadius: '4px 0 0 0',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute -top-3 -right-3 w-10 h-10"
        style={{
          borderRight: `4px solid ${v.accent}`,
          borderTop: `4px solid ${v.accent}`,
          borderRadius: '0 4px 0 0',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-3 -left-3 w-10 h-10"
        style={{
          borderLeft: `4px solid ${v.accent}`,
          borderBottom: `4px solid ${v.accent}`,
          borderRadius: '0 0 0 4px',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-3 -right-3 w-10 h-10"
        style={{
          borderRight: `4px solid ${v.accent}`,
          borderBottom: `4px solid ${v.accent}`,
          borderRadius: '0 0 4px 0',
        }}
        aria-hidden="true"
      />

      <div
        className="relative rounded-lg overflow-hidden"
        style={{
          background: v.bg,
          border: `4px solid ${v.border}`,
          boxShadow: `0 8px 32px rgba(0,0,0,0.4), inset 0 2px 0 rgba(255,255,255,0.15)`,
        }}
      >
        {/* Wood plank texture overlay */}
        {(variant === 'wood' || variant === 'temple') && (
          <div
            className="absolute inset-0 pointer-events-none opacity-15"
            style={{
              backgroundImage: `
                repeating-linear-gradient(90deg, transparent, transparent 60px, ${COLORS.beachBrown}40 60px, ${COLORS.beachBrown}40 62px),
                repeating-linear-gradient(0deg, transparent, transparent 40px, ${COLORS.beachBrown}30 40px, ${COLORS.beachBrown}30 41px)
              `,
            }}
            aria-hidden="true"
          />
        )}

        {/* Title bar with jungle leaf border feel */}
        <div
          className="px-6 py-4 flex items-center gap-4"
          style={{
            background: `linear-gradient(180deg, ${v.titleBg}, ${v.titleBg}cc)`,
            borderBottom: `3px solid ${v.border}`,
          }}
        >
          {titleIcon}
          <h2
            id={headingId('section', title)}
            className="text-xl font-black tracking-wider uppercase"
            style={{
              color: '#fff',
              textShadow: '3px 3px 0 rgba(0,0,0,0.6)',
              fontFamily: 'Impact, Arial Black, sans-serif',
              letterSpacing: '0.1em',
            }}
          >
            {title}
          </h2>
        </div>

        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </section>
  )
}


// ============================================================================
// TECH CRATES - Engineer tech stack as crate chips
// ============================================================================
function TechCrates({ categories }: { categories: CVData['techStack'] }) {
  return (
    <div className="space-y-6">
      {categories.map((category) => (
        <div key={category.id}>
          <h3
            className="text-sm tracking-widest mb-3 font-black uppercase flex items-center gap-2"
            style={{ color: COLORS.maskYellow, fontFamily: 'Impact, Arial Black, sans-serif' }}
          >
            <WumpaFruit size={18} />
            {category.name}
          </h3>
          <ul className="flex flex-wrap gap-2" aria-label={`${category.name} technologies`}>
            {category.items.map((tech) => (
              <li
                key={tech}
                className="px-3 py-2 text-sm font-bold transition-transform hover:scale-105 cursor-default"
                style={{
                  background: `linear-gradient(180deg, ${COLORS.crateWood}, ${COLORS.beachBrown})`,
                  border: `2px solid ${COLORS.cratePeru}`,
                  color: '#fff',
                  boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.2), 0 3px 6px rgba(0,0,0,0.3)',
                  textShadow: '1px 1px 0 rgba(0,0,0,0.5)',
                  borderRadius: '4px',
                }}
              >
                {tech}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

// ============================================================================
// EXPERIENCE CARD. Dates are date only strings (UTC midnight), so the year is read in UTC.
// ============================================================================
function ExperienceCard({ entry }: { entry: Job }) {
  const { start: startDisplay, end: endDisplay } = jobYears(entry, 'Present')

  return (
    <article
      className="p-4 rounded-lg transition-transform hover:scale-[1.01]"
      style={{
        background: `linear-gradient(135deg, ${COLORS.crateWood}e6, ${COLORS.jungleDark}cc)`,
        border: `2px solid ${COLORS.maskYellow}80`,
      }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-3">
        <div>
          <h3 className="text-lg font-bold" style={{ color: '#fff' }}>{entry.title}</h3>
          <p className="text-sm font-semibold" style={{ color: COLORS.maskYellow }}>{entry.company}</p>
        </div>
        <span
          className="text-sm px-3 py-1 rounded font-bold"
          style={{ background: '#0a1f5c', color: COLORS.oceanSky, whiteSpace: 'nowrap' }}
        >
          {startDisplay} - {endDisplay}
        </span>
      </div>
      {entry.description && (
        <p className="text-sm mb-3" style={{ color: COLORS.beachTan }}>{entry.description}</p>
      )}
      {entry.highlights.length > 0 && (
        <ul className="space-y-2" aria-label="Key achievements">
          {entry.highlights.map((highlight) => (
            <li key={highlight} className="text-sm flex items-start gap-2" style={{ color: '#fff' }}>
              <WumpaFruit size={14} className="flex-shrink-0 mt-0.5" />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      )}
      {entry.skills.length > 0 && (
        <ul className="flex flex-wrap gap-1.5 mt-3" aria-label="Skills used">
          {entry.skills.map((skill) => (
            <li
              key={skill}
              className="text-sm px-2 py-1 rounded"
              style={{ background: COLORS.jungleDark, color: COLORS.nitroBright, border: `1px solid ${COLORS.jungleLime}80` }}
            >
              {skill}
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

// ============================================================================
// PROJECT CARD - his role, the years, the impact and the links
// ============================================================================
function ProjectCard({ project, years, links }: ProjectSlot) {
  return (
    <article
      className="h-full p-4 rounded-lg transition-all hover:scale-[1.02] group"
      style={{
        background: `linear-gradient(135deg, ${COLORS.crateWood}f0, ${COLORS.jungleDark}d9)`,
        border: `3px solid ${project.highlight ? COLORS.gemBlue : COLORS.cratePeru}`,
        boxShadow: project.highlight ? `0 0 25px ${COLORS.gemBlue}40` : 'none',
      }}
    >
      <div className="flex justify-between items-start gap-2">
        <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: '#fff' }}>
          {project.highlight && <GemIcon size={16} color="blue" />}
          {project.name}
        </h3>
        {years && (
          <span className="text-sm font-bold whitespace-nowrap" style={{ color: COLORS.oceanSky }}>
            {years}
          </span>
        )}
      </div>
      <p className="text-sm font-semibold mt-1" style={{ color: COLORS.maskYellow }}>{project.role}</p>
      <p className="text-sm mt-2" style={{ color: COLORS.beachTan }}>{project.tagline}</p>
      {project.impact && (
        <p className="text-sm mt-2 font-bold flex items-start gap-2" style={{ color: '#fff' }}>
          <WumpaFruit size={16} className="flex-shrink-0 mt-0.5" />
          {project.impact}
        </p>
      )}
      {project.techStack.length > 0 && (
        <ul className="flex flex-wrap gap-1.5 mt-3" aria-label="Technologies used">
          {project.techStack.map((tech) => (
            <li
              key={tech}
              className="text-sm px-2 py-1 rounded"
              style={{ background: COLORS.jungleDark, color: COLORS.nitroBright, border: `1px solid ${COLORS.jungleLime}80` }}
            >
              {tech}
            </li>
          ))}
        </ul>
      )}
      {links.length > 0 ? (
        <div className="flex flex-wrap gap-3 mt-4">
          {links.map(({ kind, label, linkProps }) => (
            <a
              key={kind}
              {...linkProps}
              className="inline-flex items-center min-h-[44px] px-4 text-sm font-black tracking-widest transition-all hover:scale-105"
              style={{
                background: `linear-gradient(180deg, ${COLORS.crashOrangeDark}, #a33f00)`,
                border: `3px solid ${COLORS.maskYellow}`,
                color: '#fff',
                textShadow: '1px 1px 0 rgba(0,0,0,0.6)',
                fontFamily: 'Impact, sans-serif',
                borderRadius: '6px',
              }}
            >
              {label}
            </a>
          ))}
        </div>
      ) : (
        <p className="text-sm mt-4 italic" style={{ color: COLORS.beachTan }}>No public link</p>
      )}
    </article>
  )
}

// ============================================================================
// VENTURE CARD
// ============================================================================
function VentureCard({ company }: { company: CVData['companies'][number] }) {
  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full p-4 rounded-lg transition-all hover:scale-[1.02] group"
      style={{
        background: `linear-gradient(135deg, ${COLORS.crateWood}f0, ${COLORS.jungleDark}d9)`,
        border: `2px solid ${COLORS.cratePeru}`,
      }}
      aria-label={`${company.name}: ${company.tagline} (opens in a new tab)`}
    >
      <div className="flex items-center gap-3 mb-2">
        <WoodenCrate size={36} variant="checkpoint" />
        <div>
          <h3 className="text-base font-bold" style={{ color: '#fff' }}>
            {company.name}
          </h3>
          <p className="text-sm font-semibold" style={{ color: COLORS.maskYellow }}>{company.tagline}</p>
        </div>
      </div>
      <p className="text-sm" style={{ color: COLORS.beachTan }}>{company.description}</p>
    </a>
  )
}

// ============================================================================
// BAND CARD - his role, the years and the release
// ============================================================================
function BandCard({ band, years, linkProps }: BandSlot) {
  const content = (
    <article
      className="h-full p-4 rounded-lg transition-all hover:scale-[1.02] group"
      style={{
        background: `linear-gradient(135deg, ${COLORS.cortexPurple}, ${COLORS.crateWood}e6)`,
        border: `2px solid ${COLORS.gemPurple}`,
      }}
    >
      <h3 className="text-base font-bold" style={{ color: '#fff' }}>
        {band.name}
      </h3>
      <p className="text-sm mt-1 font-semibold" style={{ color: COLORS.maskYellow }}>
        {band.role}
        {years && <span aria-hidden="true"> | </span>}
        {years && <span>{years}</span>}
      </p>
      {band.release && (
        <p className="text-sm mt-2" style={{ color: COLORS.beachTan }}>
          Released <cite>&ldquo;{band.release}&rdquo;</cite>
        </p>
      )}
    </article>
  )

  return linkProps ? (
    <a {...linkProps} className="block h-full">
      {content}
    </a>
  ) : (
    content
  )
}

// ============================================================================
// WARP ZONE - one profession portal of the shared switch
// ============================================================================
const WARP_ZONES: Record<Profession, { color: string; gem: 'blue' | 'purple' | 'red' }> = {
  engineer: { color: COLORS.gemBlue, gem: 'blue' },
  drummer: { color: COLORS.gemPurple, gem: 'purple' },
  fighter: { color: COLORS.gemRed, gem: 'red' },
}

function WarpZone({ id, label, selected, optionProps, reducedMotion }: ProfessionOption & { reducedMotion: boolean }) {
  const zone = WARP_ZONES[id]

  return (
    <button
      type="button"
      {...optionProps}
      className="relative group focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 rounded-xl"
    >
      {/* Glow effect */}
      <div
        className={`absolute inset-0 rounded-xl blur-2xl transition-all duration-300 ${
          selected ? 'opacity-70 scale-150' : 'opacity-0 group-hover:opacity-40'
        }`}
        style={{ background: zone.color }}
        aria-hidden="true"
      />

      {/* Warp portal button */}
      <div
        className={`relative w-24 h-28 sm:w-32 sm:h-32 rounded-xl flex flex-col items-center justify-center px-1 transition-all duration-300 ${
          selected ? 'scale-110' : 'group-hover:scale-105'
        }`}
        style={{
          background: `linear-gradient(135deg, ${zone.color}40, ${COLORS.crateWood})`,
          border: `4px solid ${selected ? zone.color : COLORS.cratePeru}`,
          boxShadow: selected
            ? `0 0 40px ${zone.color}70, inset 0 0 25px ${zone.color}40`
            : '0 6px 16px rgba(0,0,0,0.5)',
        }}
      >
        <GemIcon size={40} color={zone.gem} />
        <span
          className="text-sm tracking-wide uppercase mt-2 font-black text-center leading-tight"
          style={{
            color: selected ? '#fff' : COLORS.beachSand,
            fontFamily: 'Impact, Arial Black, sans-serif',
            textShadow: '1px 1px 0 #000',
          }}
        >
          {label}
        </span>
      </div>

      {/* Aku Aku appearing when picked */}
      {selected && !reducedMotion && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 animate-aku-bounce" aria-hidden="true">
          <AkuAkuMask size={35} animated={false} />
        </div>
      )}
    </button>
  )
}

// ============================================================================
// HERO ACTIONS - crate buttons for Email, LinkedIn and the CV
// ============================================================================
const CRATE_BUTTON =
  'inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-3 font-black tracking-widest transition-all hover:scale-105'

// Email is the orange primary action, LinkedIn and the CV the wooden crates.
const HERO_ACTION_LOOK: Record<HeroActionSlot['id'], React.CSSProperties> = {
  email: {
    background: `linear-gradient(180deg, ${COLORS.crashOrangeDark}, #a33f00)`,
    border: `4px solid ${COLORS.maskYellow}`,
    color: '#fff',
    boxShadow: '0 5px 0 #663000, inset 0 2px 0 rgba(255,255,255,0.2)',
    textShadow: '2px 2px 0 rgba(0,0,0,0.6)',
    fontFamily: 'Impact, sans-serif',
    borderRadius: '6px',
  },
  linkedin: {
    background: `linear-gradient(180deg, ${COLORS.crateWood}, #5c2d0c)`,
    border: `4px solid ${COLORS.cratePeru}`,
    color: '#fff',
    boxShadow: '0 5px 0 #3a2010, inset 0 2px 0 rgba(255,255,255,0.2)',
    textShadow: '2px 2px 0 rgba(0,0,0,0.6)',
    fontFamily: 'Impact, sans-serif',
    borderRadius: '6px',
  },
}

function HeroAction({ action }: { action: HeroActionSlot }) {
  return (
    <a {...action.linkProps} className={CRATE_BUTTON} style={HERO_ACTION_LOOK[action.id]}>
      {action.id === 'email' ? <GemIcon size={20} color="yellow" /> : <WoodenCrate size={20} />}
      {action.label}
    </a>
  )
}

function CVLink() {
  return (
    <Link href="/cv" className={CRATE_BUTTON} style={HERO_ACTION_LOOK.linkedin}>
      <WoodenCrate size={20} />
      CV
    </Link>
  )
}

// ============================================================================
// PROFESSION SECTIONS - what each profession shows, from the content files
// ============================================================================

function EngineerSections({ sections, reducedMotion }: { sections: SectionsOf<'engineer'>; reducedMotion: boolean }) {
  const { professionalSummary } = useCVData()

  return (
    <>
      <div className="relative z-20 py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <CratePanel title="About" titleIcon={<AkuAkuMask size={35} animated={!reducedMotion} />} variant="checkpoint">
            <p className="text-base leading-relaxed" style={{ color: '#fff' }}>
              {professionalSummary.bio}
            </p>
          </CratePanel>
        </div>
      </div>

      {/* ART SECTION 1: JUNGLE SCENE (After About) */}
      <JungleSceneArt reducedMotion={reducedMotion} />

      {sections.jobs.length > 0 && (
        <div className="relative z-20 py-8 px-6">
          <div className="max-w-4xl mx-auto">
            <CratePanel title="Work Experience" titleIcon={<WoodenCrate size={28} variant="checkpoint" />} variant="temple">
              <div className="space-y-4">
                {sections.jobs.map((entry) => (
                  <ExperienceCard key={entry.id} entry={entry} />
                ))}
              </div>
            </CratePanel>
          </div>
        </div>
      )}

      {/* ART SECTION 2: CRATE STACK (After Experience) */}
      <CrateStackArt reducedMotion={reducedMotion} />

      <div className="relative z-20 py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <CratePanel title="Tech Stack" titleIcon={<WoodenCrate size={28} />} variant="wood">
            <TechCrates categories={sections.techStack} />
          </CratePanel>
        </div>
      </div>

      <div className="relative z-20 py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <CratePanel title="Projects" titleIcon={<TNTCrate size={32} />} variant="tnt">
            <ProjectList
              projects={sections.projects}
              className="grid md:grid-cols-2 gap-4"
              renderProject={(slot) => <ProjectCard {...slot} />}
            />
          </CratePanel>
        </div>
      </div>

      {/* ART SECTION 3: WARP PORTAL (After Projects) */}
      <WarpPortalArt reducedMotion={reducedMotion} />

      {sections.companies.length > 0 && (
        <div className="relative z-20 py-8 px-6">
          <div className="max-w-4xl mx-auto">
            <CratePanel title="Ventures" titleIcon={<Crystal size={28} />} variant="checkpoint">
              <div className="grid md:grid-cols-3 gap-4">
                {sections.companies.map((company) => (
                  <VentureCard key={company.id} company={company} />
                ))}
              </div>
            </CratePanel>
          </div>
        </div>
      )}
    </>
  )
}

function MusicianSections({ sections, reducedMotion }: { sections: SectionsOf<'drummer'>; reducedMotion: boolean }) {
  const { musician, bands } = sections

  return (
    <>
      <JungleSceneArt reducedMotion={reducedMotion} />
      <div className="relative z-20 py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <CratePanel title="Bands" titleIcon={<GemIcon size={26} color="purple" />} variant="nitro">
            <p className="text-base mb-6" style={{ color: '#fff' }}>
              Drums since {musician.since}, {musician.yearsPlaying} years
            </p>
            <BandList bands={bands} className="grid md:grid-cols-3 gap-4" renderBand={(slot) => <BandCard {...slot} />} />
            <p className="text-sm mt-6 italic" style={{ color: COLORS.nitroBright }}>
              {musician.line}
            </p>
          </CratePanel>
        </div>
      </div>
      <CrateStackArt reducedMotion={reducedMotion} />
    </>
  )
}

function MartialArtistSections({ sections, reducedMotion }: { sections: SectionsOf<'fighter'>; reducedMotion: boolean }) {
  const { martialArts } = sections

  return (
    <>
      <CrateStackArt reducedMotion={reducedMotion} />
      <div className="relative z-20 py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <CratePanel title="Muay Thai" titleIcon={<TNTCrate size={32} />} variant="tnt">
            <h3
              className="text-xl font-black mb-6"
              style={{ color: '#fff', fontFamily: 'Impact, Arial Black, sans-serif', textShadow: '2px 2px 0 #000' }}
            >
              {martialArts.primary.title}
            </h3>
            <MuayThaiRecord
              martialArts={martialArts}
              classNames={{
                facts: 'grid sm:grid-cols-2 gap-4 mb-6',
                fact: 'p-3 rounded-lg border-2 border-[#FFD700] bg-[#5c1a00]',
                term: 'text-sm tracking-widest uppercase font-black text-[#FFD700]',
                value: 'text-sm mt-1 text-white',
                achievements: 'space-y-2',
                achievement: 'text-sm flex items-start gap-2 text-white',
              }}
              renderAchievement={(achievement) => (
                <>
                  <WumpaFruit size={14} className="flex-shrink-0 mt-0.5" />
                  <span>{achievement}</span>
                </>
              )}
            />
          </CratePanel>
        </div>
      </div>
      <WarpPortalArt reducedMotion={reducedMotion} />
    </>
  )
}

const SECTION_VIEWS: ProfessionSectionViews<{ reducedMotion: boolean }> = {
  engineer: EngineerSections,
  drummer: MusicianSections,
  fighter: MartialArtistSections,
}

// ============================================================================
// LIFE COUNTER - Crash face with lives
// ============================================================================
function LifeCounter({ lives = 99, className = '' }: { lives?: number; className?: string }) {
  return (
    <div
      className={`flex items-center gap-2 ${className}`}
      role="img"
      aria-label={`${lives} lives`}
    >
      <CrashSilhouette size={22} />
      <span
        className="font-black text-xl"
        style={{
          color: COLORS.maskYellow,
          textShadow: '2px 2px 0 #000',
          fontFamily: 'Impact, Arial Black, sans-serif',
        }}
      >
        x {lives}
      </span>
    </div>
  )
}

// ============================================================================
// MAIN THEME COMPONENT
// ============================================================================
export default function TropicalPlatformerTheme() {
  const { active } = useProfession()
  const view = useWorldView()
  const [mounted, setMounted] = useState(false)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: `linear-gradient(180deg,
          ${COLORS.tropicalCyan} 0%,
          ${COLORS.jungleGreen} 15%,
          ${COLORS.jungleDark} 40%,
          ${COLORS.beachBrown} 70%,
          ${COLORS.oceanRoyal} 100%
        )`,
      }}
    >
      {/* Global CSS Animations */}
      <style jsx global>{`
        @keyframes jungleFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-15px) rotate(5deg); }
          50% { transform: translateY(-5px) rotate(-3deg); }
          75% { transform: translateY(-20px) rotate(8deg); }
        }

        @keyframes aku-glow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }

        @keyframes aku-bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-10px); }
        }

        @keyframes aku-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        @keyframes tnt-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }

        @keyframes nitro-glow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }

        @keyframes wave-slow {
          0% { transform: translateX(0); }
          100% { transform: translateX(-360px); }
        }

        @keyframes wave-medium {
          0% { transform: translateX(0); }
          100% { transform: translateX(-360px); }
        }

        @keyframes wave-fast {
          0% { transform: translateX(0); }
          100% { transform: translateX(-360px); }
        }

        @keyframes wumpa-bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        @keyframes gem-sparkle {
          0%, 100% { opacity: 0.9; filter: brightness(1); }
          50% { opacity: 1; filter: brightness(1.4); }
        }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }

        @keyframes warp-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes warp-spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }

        @keyframes portal-pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }

        .animate-aku-glow { animation: aku-glow 2s ease-in-out infinite; }
        .animate-aku-bounce { animation: aku-bounce 1s ease-in-out infinite; }
        .animate-aku-float { animation: aku-float 3s ease-in-out infinite; }
        .animate-tnt-pulse { animation: tnt-pulse 1s ease-in-out infinite; }
        .animate-nitro-glow { animation: nitro-glow 1.5s ease-in-out infinite; }
        .animate-wave-slow { animation: wave-slow 12s linear infinite; }
        .animate-wave-medium { animation: wave-medium 8s linear infinite; }
        .animate-wave-fast { animation: wave-fast 6s linear infinite; }
        .animate-wumpa-bob { animation: wumpa-bob 2s ease-in-out infinite; }
        .animate-wumpa-bob-delayed { animation: wumpa-bob 2s ease-in-out infinite; animation-delay: 0.7s; }
        .animate-gem-sparkle { animation: gem-sparkle 2.5s ease-in-out infinite; }
        .animate-gem-sparkle-delayed { animation: gem-sparkle 2.5s ease-in-out infinite; animation-delay: 1s; }
        .animate-bounce-slow { animation: bounce-slow 1.5s ease-in-out infinite; }
        .animate-warp-spin { animation: warp-spin 8s linear infinite; transform-origin: center; }
        .animate-warp-spin-reverse { animation: warp-spin-reverse 6s linear infinite; transform-origin: center; }
        .animate-portal-pulse { animation: portal-pulse 2s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .animate-aku-glow,
          .animate-aku-bounce,
          .animate-aku-float,
          .animate-tnt-pulse,
          .animate-nitro-glow,
          .animate-wave-slow,
          .animate-wave-medium,
          .animate-wave-fast,
          .animate-wumpa-bob,
          .animate-wumpa-bob-delayed,
          .animate-gem-sparkle,
          .animate-gem-sparkle-delayed,
          .animate-bounce-slow,
          .animate-warp-spin,
          .animate-warp-spin-reverse,
          .animate-portal-pulse {
            animation: none !important;
          }
        }
      `}</style>

      {/* Jungle canopy at top */}
      <div
        className="fixed top-0 left-0 right-0 h-36 z-[2] pointer-events-none"
        style={{
          background: `linear-gradient(180deg, ${COLORS.jungleDark}ee 0%, ${COLORS.jungleGreen}90 50%, transparent 100%)`,
        }}
        aria-hidden="true"
      >
        <svg viewBox="0 0 100 25" preserveAspectRatio="none" className="absolute bottom-0 w-full h-16 opacity-70">
          <path d="M0 25 Q8 8 16 25 Q24 12 32 25 Q40 5 48 25 Q56 15 64 25 Q72 8 80 25 Q88 12 96 25 L100 25" fill={COLORS.jungleDark} />
        </svg>
      </div>

      {/* Side jungle vines */}
      <JungleVine side="left" />
      <JungleVine side="right" />

      {/* Floating decorations */}
      <JungleFloaters profession={active} reducedMotion={reducedMotion} />

      {/* Ocean waves at bottom */}
      <OceanWaves />

      {/* ================================================================ */}
      {/* HEADER - the recruiter first screen */}
      {/* ================================================================ */}
      <header className="relative z-30 pt-8 pb-4 px-6">
        <RecruiterHero
          render={({ name, headline, tagline, line, actions }) => (
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
                <div>
                  <LifeCounter lives={99} className="mb-3" />

                  <h1
                    className="text-4xl md:text-6xl font-black tracking-wider uppercase"
                    style={{
                      color: COLORS.crashOrange,
                      fontFamily: 'Impact, Arial Black, sans-serif',
                      textShadow: `
                        4px 4px 0 ${COLORS.jungleDark},
                        -2px -2px 0 #000,
                        2px -2px 0 #000,
                        -2px 2px 0 #000,
                        0 0 40px ${COLORS.crashOrange}70
                      `,
                      letterSpacing: '0.05em',
                    }}
                  >
                    {name}
                  </h1>

                  <p
                    className="text-xl md:text-2xl font-bold mt-3"
                    style={{
                      color: '#fff',
                      textShadow: '3px 3px 0 rgba(0,0,0,0.8)',
                      fontFamily: 'Impact, Arial Black, sans-serif',
                    }}
                  >
                    {headline}
                  </p>

                  <p
                    className="text-base md:text-lg mt-2 italic"
                    style={{ color: COLORS.tropicalCyan, textShadow: '2px 2px 0 rgba(0,0,0,0.6)' }}
                  >
                    {tagline}
                  </p>

                  <p className="text-base mt-2" style={{ color: '#fff', textShadow: '2px 2px 0 rgba(0,0,0,0.8)' }}>
                    {line}
                  </p>
                </div>

                <nav className="flex gap-3 items-center flex-wrap" aria-label="Contact and CV">
                  {actions.map((action) => (
                    <HeroAction key={action.id} action={action} />
                  ))}
                  <CVLink />

                  {/* Nebulith Button - Crystal style */}
                  <Link
                    href="/personal-projects/game-engine"
                    className={CRATE_BUTTON}
                    style={{
                      background: `linear-gradient(180deg, #0a1f5c, ${COLORS.crateWood})`,
                      border: `4px solid ${COLORS.gemBlue}`,
                      color: COLORS.gemBlue,
                      boxShadow: '0 5px 0 #001a33, inset 0 2px 0 rgba(255,255,255,0.15)',
                      fontFamily: 'Impact, sans-serif',
                      borderRadius: '6px',
                    }}
                    aria-label="View Nebulith game engine project"
                  >
                    <GemIcon size={22} color="blue" />
                    NEBULITH
                  </Link>
                </nav>
              </div>
            </div>
          )}
        />
      </header>

      {/* Warp Zone Profession Selector, System Engineer in the centre */}
      <section className="relative z-20 py-4" aria-label="Profession selection">
        <ProfessionSwitch
          className="flex justify-center gap-4 sm:gap-8 py-10"
          label="Profession"
          renderOption={(option) => <WarpZone {...option} reducedMotion={reducedMotion} />}
        />
      </section>

      <main className="relative z-20">
        <div role="region" aria-label={`${active} profession details`}>
          <ProfessionSectionsView views={SECTION_VIEWS} sections={view.sections} reducedMotion={reducedMotion} />
        </div>
      </main>

      {/* ================================================================ */}
      {/* CONTACT CTA */}
      {/* ================================================================ */}
      <div className="relative z-20 py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <CratePanel title="Ready to Work Together?" titleIcon={<WumpaFruit size={28} />} variant="checkpoint">
            <RecruiterHero
              render={({ line, actions }) => (
                <div className="text-center">
                  <p className="text-lg mb-6" style={{ color: '#fff' }}>
                    {line}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {actions.map((action) => (
                      <HeroAction key={action.id} action={action} />
                    ))}
                    <CVLink />
                  </div>
                </div>
              )}
            />
          </CratePanel>
        </div>
      </div>

      {/* ================================================================ */}
      {/* FOOTER */}
      {/* ================================================================ */}
      <footer className="relative z-20 py-20 text-center">
        <div className="flex justify-center gap-6 mb-6">
          <WumpaFruit size={48} />
          <Crystal size={44} />
          <TNTCrate size={44} />
          <GemIcon size={40} color="blue" />
        </div>

        <AkuAkuMask size={60} className="mx-auto mb-6" animated={!reducedMotion} />

        <p
          className="text-lg font-bold"
          style={{
            color: COLORS.beachSand,
            fontFamily: 'Impact, sans-serif',
            textShadow: '2px 2px 0 rgba(0,0,0,0.5)',
          }}
        >
          N. Sanity Beach, Wumpa Islands
        </p>

        <div className="flex justify-center gap-8 mt-8">
          <WoodenCrate size={36} />
          <NitroCrate size={36} />
          <WoodenCrate size={36} variant="bouncy" />
          <WoodenCrate size={36} variant="checkpoint" />
        </div>

        {/* Tiki totems at bottom */}
        <div className="flex justify-center gap-16 mt-8 opacity-60">
          <TikiTotem size={30} />
          <TikiTotem size={35} />
          <TikiTotem size={30} />
        </div>
      </footer>
    </div>
  )
}
