'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { useTheme } from '@/themes/ThemeContext'
import { useProfession } from '@/contexts/ProfessionContext'
import { ABOUT_DATA, PROFESSIONAL_SUMMARY } from '@/data/about'
import { PROJECTS_DATA } from '@/data/projects'
import { getSkillsByProfession, getEngineerSkills } from '@/data/skills'
import { CURRENT_ROLES } from '@/data/roles'
import { COMPANIES } from '@/data/companies'
import { BANDS } from '@/data/bands'
import { EXPERIENCE_DATA, filterExperienceByProfession } from '@/data/experience'

// =============================================================================
// CHRONO TRIGGER EXACT COLOR PALETTE
// =============================================================================
const CT_COLORS = {
  // Time Portal Colors
  portalBlue: '#3366FF',
  portalBlueBright: '#6699FF',
  portalPurple: '#9933CC',
  portalMagenta: '#CC66FF',

  // Era Colors
  medievalGreen: '#339933',
  medievalGreenLight: '#66CC66',
  futureChrome: '#99CCCC',
  futureChromeLight: '#CCFFFF',
  prehistoricOrange: '#FF6633',
  prehistoricOrangeLight: '#FF9966',

  // Dark Blue Backgrounds
  voidDark: '#000033',
  voidMid: '#000066',
  voidLight: '#000099',

  // UI Colors
  white: '#FFFFFF',
  gold: '#FFD700',
  silver: '#C0C0C0',
  red: '#FF3333',
  lavosRed: '#CC0033',
  lavosPurple: '#660066',

  // ATB Gauge Colors
  atbGreen: '#00FF66',
  atbYellow: '#FFFF00',
  atbOrange: '#FF9900',

  // Character Colors
  cronoOrange: '#FF6600',
  marleBlue: '#66CCFF',
  frogGreen: '#33CC33',
  lucca: '#9966CC',
  robo: '#CCCC99',
  ayla: '#FFCC66',
  magus: '#6633CC',
}

// =============================================================================
// ACCESSIBILITY HOOKS
// =============================================================================
function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return prefersReducedMotion
}

// =============================================================================
// PIXEL ART SVG COMPONENTS - CHRONO TRIGGER STYLE
// =============================================================================

// Time Portal Swirl Effect
function TimePortal({
  size = 120,
  animate = true,
  className = '',
}: {
  size?: number
  animate?: boolean
  className?: string
}) {
  const reducedMotion = usePrefersReducedMotion()
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
function CronoPixelArt({ size = 64 }: { size?: number }) {
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
function MarlePixelArt({ size = 64 }: { size?: number }) {
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
function FrogPixelArt({ size = 64 }: { size?: number }) {
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
function EpochPixelArt({ size = 100 }: { size?: number }) {
  const reducedMotion = usePrefersReducedMotion()

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
function LavosEye({ size = 80, animate = true }: { size?: number; animate?: boolean }) {
  const reducedMotion = usePrefersReducedMotion()
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
function EraBadge({
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

// ATB Gauge (Active Time Battle)
function ATBGauge({
  value = 100,
  label,
  showLabel = true,
}: {
  value?: number
  label?: string
  showLabel?: boolean
}) {
  const getColor = () => {
    if (value >= 80) return CT_COLORS.atbGreen
    if (value >= 50) return CT_COLORS.atbYellow
    return CT_COLORS.atbOrange
  }

  return (
    <div className="flex items-center gap-2">
      {showLabel && label && (
        <span className="text-[9px] text-white/80 w-16 truncate">{label}</span>
      )}
      <div
        className="flex-1 h-3 relative overflow-hidden"
        style={{
          background: CT_COLORS.voidDark,
          border: `1px solid ${CT_COLORS.silver}`,
        }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || 'ATB gauge'}
      >
        <div
          className="h-full transition-all duration-300"
          style={{
            width: `${value}%`,
            background: `linear-gradient(90deg, ${getColor()}, ${getColor()}88)`,
            boxShadow: `0 0 8px ${getColor()}`,
          }}
        />
        {/* Pixel grid overlay */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: 'repeating-linear-gradient(90deg, transparent 0px, transparent 3px, rgba(0,0,0,0.3) 3px, rgba(0,0,0,0.3) 4px)',
          }}
          aria-hidden="true"
        />
      </div>
    </div>
  )
}

// =============================================================================
// ART SECTIONS - CHRONO TRIGGER THEMED
// =============================================================================

// Character Party Display
function CharacterParty() {
  return (
    <div className="py-10 border-t-4 border-b-4 my-8" style={{ borderColor: CT_COLORS.portalBlue + '40' }}>
      <p className="text-center text-xs mb-8 tracking-widest" style={{ color: CT_COLORS.portalMagenta }}>
        ◈ The party gathers through time... ◈
      </p>
      <div className="flex justify-center items-end gap-12 flex-wrap">
        <div className="text-center">
          <CronoPixelArt size={48} />
          <p className="text-[10px] mt-3 tracking-wider" style={{ color: CT_COLORS.cronoOrange }}>CRONO</p>
          <p className="text-[8px] mt-1" style={{ color: CT_COLORS.silver }}>Leader</p>
        </div>
        <div className="text-center">
          <MarlePixelArt size={48} />
          <p className="text-[10px] mt-3 tracking-wider" style={{ color: CT_COLORS.marleBlue }}>MARLE</p>
          <p className="text-[8px] mt-1" style={{ color: CT_COLORS.silver }}>Princess</p>
        </div>
        <div className="text-center">
          <FrogPixelArt size={48} />
          <p className="text-[10px] mt-3 tracking-wider" style={{ color: CT_COLORS.frogGreen }}>FROG</p>
          <p className="text-[8px] mt-1" style={{ color: CT_COLORS.silver }}>Knight</p>
        </div>
      </div>
      <div className="flex justify-center mt-8">
        <EpochPixelArt size={120} />
      </div>
      <p className="text-center text-[9px] mt-4 tracking-wider" style={{ color: CT_COLORS.futureChrome }}>
        EPOCH - Wings of Time
      </p>
    </div>
  )
}

// Time Portal Gateway Section
function TimePortalGateway() {
  return (
    <div className="py-12 border-t-4 border-b-4 my-8 relative overflow-hidden"
      style={{ borderColor: CT_COLORS.portalPurple + '40' }}>
      {/* Background time distortion */}
      <div className="absolute inset-0 opacity-10"
        style={{
          background: `radial-gradient(ellipse at center, ${CT_COLORS.portalBlue} 0%, transparent 70%)`,
        }}
        aria-hidden="true"
      />

      <p className="text-center text-xs mb-8 tracking-widest relative z-10" style={{ color: CT_COLORS.portalBlueBright }}>
        ◈ A Gate to another era opens... ◈
      </p>

      <div className="flex justify-center items-center gap-8 flex-wrap relative z-10">
        <TimePortal size={100} />
        <div className="text-center max-w-xs">
          <p className="text-sm mb-4" style={{ color: CT_COLORS.white }}>
            The flow of time is not constant...
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <EraBadge era="prehistoric" />
            <EraBadge era="medieval" />
            <EraBadge era="present" />
            <EraBadge era="future" />
          </div>
        </div>
        <TimePortal size={100} />
      </div>
    </div>
  )
}

// Lavos Dramatic Section
function LavosDramaticSection() {
  return (
    <div className="py-10 border-t-4 border-b-4 my-8 relative"
      style={{
        borderColor: CT_COLORS.lavosRed + '60',
        background: `linear-gradient(180deg, ${CT_COLORS.voidDark} 0%, ${CT_COLORS.lavosPurple}20 50%, ${CT_COLORS.voidDark} 100%)`,
      }}>
      <p className="text-center text-xs mb-6 tracking-widest" style={{ color: CT_COLORS.lavosRed }}>
        ◈ The Day of Lavos approaches... ◈
      </p>
      <div className="flex justify-center items-center gap-8">
        <LavosEye size={60} />
        <div className="text-center">
          <p className="text-sm tracking-widest animate-lavos-text" style={{ color: CT_COLORS.red }}>
            1999 AD
          </p>
          <p className="text-[10px] mt-2" style={{ color: CT_COLORS.silver }}>
            &ldquo;But...the future refused to change.&rdquo;
          </p>
        </div>
        <LavosEye size={60} />
      </div>
    </div>
  )
}

// =============================================================================
// UI COMPONENTS
// =============================================================================

// Battle Menu Frame (CT signature UI)
function BattleFrame({
  children,
  title,
  era = 'present',
}: {
  children: React.ReactNode
  title?: string
  era?: 'prehistoric' | 'medieval' | 'present' | 'future' | 'end-of-time'
}) {
  const eraColors = {
    prehistoric: CT_COLORS.prehistoricOrange,
    medieval: CT_COLORS.medievalGreen,
    present: CT_COLORS.portalBlue,
    future: CT_COLORS.futureChrome,
    'end-of-time': CT_COLORS.portalPurple,
  }

  const accentColor = eraColors[era]

  return (
    <section
      className="relative mb-8"
      style={{
        border: `3px solid ${CT_COLORS.white}`,
        background: `linear-gradient(180deg, ${CT_COLORS.voidDark} 0%, ${CT_COLORS.voidMid} 100%)`,
        boxShadow: `0 0 20px ${accentColor}40, inset 0 0 40px ${CT_COLORS.voidDark}`,
        imageRendering: 'pixelated' as const,
      }}
      role="region"
      aria-label={title || 'Content section'}
    >
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-4 h-4" style={{ background: accentColor }} aria-hidden="true" />
      <div className="absolute top-0 right-0 w-4 h-4" style={{ background: accentColor }} aria-hidden="true" />
      <div className="absolute bottom-0 left-0 w-4 h-4" style={{ background: accentColor }} aria-hidden="true" />
      <div className="absolute bottom-0 right-0 w-4 h-4" style={{ background: accentColor }} aria-hidden="true" />

      {/* Side bars */}
      <div className="absolute top-4 bottom-4 left-0 w-1" style={{ background: accentColor + '60' }} aria-hidden="true" />
      <div className="absolute top-4 bottom-4 right-0 w-1" style={{ background: accentColor + '60' }} aria-hidden="true" />

      {title && (
        <div
          className="px-5 py-3 border-b-2 flex items-center gap-3"
          style={{ borderColor: CT_COLORS.white + '40' }}
        >
          <span style={{ color: accentColor }}>◈</span>
          <h2 className="text-xs tracking-[0.2em]" style={{ color: CT_COLORS.white }}>
            {title}
          </h2>
          <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${accentColor}60, transparent)` }} />
        </div>
      )}

      <div className="p-5">{children}</div>
    </section>
  )
}

// Menu Command Button (FIGHT/TECH/ITEM style)
function MenuCommandButton({
  label,
  isSelected,
  onClick,
  color,
}: {
  label: string
  isSelected: boolean
  onClick: () => void
  color: string
}) {
  return (
    <button
      onClick={onClick}
      className="relative px-6 py-3 text-xs tracking-[0.15em] font-bold transition-all flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-offset-2"
      style={{
        background: isSelected
          ? `linear-gradient(180deg, ${color} 0%, ${color}AA 100%)`
          : CT_COLORS.voidDark,
        border: `3px solid ${color}`,
        color: isSelected ? CT_COLORS.voidDark : color,
        boxShadow: isSelected ? `0 0 20px ${color}80, inset 0 0 10px ${CT_COLORS.white}40` : 'none',
        imageRendering: 'pixelated' as const,
      }}
      aria-pressed={isSelected}
    >
      {isSelected && (
        <span style={{ fontSize: '8px' }}>▶</span>
      )}
      {label}
    </button>
  )
}

// =============================================================================
// CONTENT CARDS
// =============================================================================

// Role Card
function RoleCard({ role }: { role: (typeof CURRENT_ROLES)[0] }) {
  return (
    <div
      className="flex items-start gap-3 p-4 transition-all hover:bg-white/5"
      style={{
        border: `2px solid ${CT_COLORS.gold}50`,
        background: `linear-gradient(90deg, ${CT_COLORS.voidDark} 0%, transparent 100%)`,
      }}
      role="listitem"
    >
      <span style={{ color: CT_COLORS.gold, fontSize: '10px' }}>◈</span>
      <div className="flex-1">
        <p className="text-xs tracking-wide" style={{ color: CT_COLORS.white }}>
          {role.title} @ <span style={{ color: CT_COLORS.marleBlue }}>{role.company}</span>
        </p>
        <p className="text-[10px] mt-2 leading-relaxed" style={{ color: CT_COLORS.silver }}>
          {role.description}
        </p>
      </div>
      {role.type === 'leadership' && (
        <EraBadge era="future" year="CTO" />
      )}
    </div>
  )
}

// Experience Card
function ExperienceCard({ entry }: { entry: (typeof EXPERIENCE_DATA)[0] }) {
  const endDisplay = entry.endDate ? new Date(entry.endDate).getFullYear() : 'Present'
  const startDisplay = new Date(entry.startDate).getFullYear()

  return (
    <article
      className="p-4 transition-all hover:bg-white/5"
      style={{
        border: `2px solid ${CT_COLORS.portalBlue}40`,
        background: `linear-gradient(180deg, ${CT_COLORS.voidMid}40 0%, ${CT_COLORS.voidDark} 100%)`,
      }}
      aria-label={`${entry.title} at ${entry.organization}`}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="text-xs tracking-wide flex items-center gap-2" style={{ color: CT_COLORS.white }}>
            <span style={{ color: CT_COLORS.medievalGreen }}>▸</span>
            {entry.title}
          </h4>
          <p className="text-sm mt-1" style={{ color: CT_COLORS.gold }}>
            @ {entry.organization}
          </p>
        </div>
        <span className="text-[10px] tabular-nums tracking-wider px-2 py-1"
          style={{
            color: CT_COLORS.futureChrome,
            background: CT_COLORS.voidDark,
            border: `1px solid ${CT_COLORS.futureChrome}40`,
          }}>
          {startDisplay} - {endDisplay}
        </span>
      </div>
      <p className="text-[10px] mb-3 leading-relaxed" style={{ color: CT_COLORS.silver }}>
        {entry.description}
      </p>
      {entry.highlights && entry.highlights.length > 0 && (
        <ul className="space-y-2" aria-label="Key achievements">
          {entry.highlights.map((highlight, i) => (
            <li key={i} className="text-[10px] flex items-start gap-2" style={{ color: CT_COLORS.atbGreen }}>
              <span style={{ color: CT_COLORS.portalMagenta }}>◇</span>
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      )}
      {entry.skills && entry.skills.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {entry.skills.slice(0, 5).map((skill) => (
            <span
              key={skill}
              className="text-[8px] px-2 py-1"
              style={{
                color: CT_COLORS.portalBlueBright,
                border: `1px solid ${CT_COLORS.portalBlue}40`,
              }}
            >
              {skill}
            </span>
          ))}
        </div>
      )}
    </article>
  )
}

// Project Card
function ProjectCard({ project }: { project: (typeof PROJECTS_DATA)[0] }) {
  const linkHref = project.links?.demo || project.links?.site || '#'
  const isExternal = linkHref.startsWith('http')

  const content = (
    <article
      className="p-4 transition-all group"
      style={{
        border: `2px solid ${CT_COLORS.white}`,
        background: CT_COLORS.voidDark,
      }}
      aria-label={`${project.name}: ${project.tagline}`}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs flex items-center gap-2 tracking-wide group-hover:text-white"
          style={{ color: CT_COLORS.white }}>
          <span style={{ color: CT_COLORS.cronoOrange }}>◈</span>
          {project.name}
        </span>
        {project.featured && (
          <span className="text-[8px] px-2 py-1" style={{ background: CT_COLORS.gold, color: CT_COLORS.voidDark }}>
            FEATURED
          </span>
        )}
      </div>
      <p className="text-[11px] mb-2" style={{ color: CT_COLORS.silver }}>
        {project.tagline}
      </p>
      {project.impact && (
        <p className="text-[10px] flex items-start gap-2 mb-3" style={{ color: CT_COLORS.atbGreen }}>
          <span style={{ color: CT_COLORS.gold }}>★</span>
          {project.impact}
        </p>
      )}
      <div className="flex flex-wrap gap-1">
        {project.techStack.slice(0, 4).map((tech) => (
          <span
            key={tech}
            className="text-[8px] px-2 py-1"
            style={{
              border: `1px solid ${CT_COLORS.portalBlue}60`,
              color: CT_COLORS.portalBlueBright,
            }}
          >
            {tech}
          </span>
        ))}
      </div>
    </article>
  )

  const linkClass = "block hover:scale-[1.02] transition-transform focus:outline-none focus:ring-2 focus:ring-offset-2"

  if (isExternal) {
    return (
      <a href={linkHref} target="_blank" rel="noopener noreferrer" className={linkClass}
        style={{ '--tw-ring-color': CT_COLORS.portalBlue } as React.CSSProperties}>
        {content}
      </a>
    )
  }
  return (
    <Link href={linkHref} className={linkClass}>
      {content}
    </Link>
  )
}

// Company Card (Ventures)
function CompanyCard({ company }: { company: (typeof COMPANIES)[0] }) {
  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 transition-all group hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2"
      style={{
        border: `2px solid ${CT_COLORS.futureChrome}`,
        background: `linear-gradient(180deg, ${CT_COLORS.voidMid} 0%, ${CT_COLORS.voidDark} 100%)`,
        '--tw-ring-color': CT_COLORS.futureChrome,
      } as React.CSSProperties}
      aria-label={`${company.name}: ${company.tagline}`}
    >
      <div className="flex items-start gap-3 mb-2">
        <span className="text-xl" aria-hidden="true">{company.icon}</span>
        <div>
          <h4 className="text-xs tracking-wide" style={{ color: CT_COLORS.white }}>
            {company.name}
          </h4>
          <p className="text-[11px] mt-1" style={{ color: CT_COLORS.gold }}>
            {company.tagline}
          </p>
        </div>
      </div>
      <p className="text-[10px] mb-3" style={{ color: CT_COLORS.silver }}>
        ◇ {company.description}
      </p>
      <div className="flex flex-wrap gap-1">
        {company.services.slice(0, 2).map((service) => (
          <span
            key={service}
            className="text-[8px] px-2 py-1"
            style={{
              border: `1px solid ${CT_COLORS.futureChrome}50`,
              color: CT_COLORS.futureChrome,
            }}
          >
            {service}
          </span>
        ))}
      </div>
    </a>
  )
}

// Band Card
function BandCard({ band }: { band: (typeof BANDS)[0] }) {
  const content = (
    <article
      className="p-4 transition-all"
      style={{
        border: `2px solid ${CT_COLORS.portalPurple}`,
        background: `linear-gradient(180deg, ${CT_COLORS.lavosPurple}20 0%, ${CT_COLORS.voidDark} 100%)`,
      }}
      aria-label={`${band.name}: ${band.genre}`}
    >
      <h4 className="text-xs tracking-wide flex items-center gap-2" style={{ color: CT_COLORS.white }}>
        <span style={{ color: CT_COLORS.portalMagenta }}>♫</span>
        {band.name}
      </h4>
      <p className="text-[11px] mt-2" style={{ color: CT_COLORS.portalMagenta }}>
        {band.genre} | {band.role}
      </p>
      <p className="text-[10px] mt-2" style={{ color: CT_COLORS.silver }}>
        {band.description}
      </p>
      {!band.url && (
        <p className="text-[10px] mt-3 italic" style={{ color: CT_COLORS.gold }}>
          ◇ Website coming soon...
        </p>
      )}
    </article>
  )

  if (band.url) {
    return (
      <a href={band.url} target="_blank" rel="noopener noreferrer"
        className="block hover:scale-[1.02] transition-transform focus:outline-none focus:ring-2"
        style={{ '--tw-ring-color': CT_COLORS.portalPurple } as React.CSSProperties}>
        {content}
      </a>
    )
  }
  return content
}

// Tech Inventory (Engineer Skills)
function TechInventory({ categories }: { categories: ReturnType<typeof getEngineerSkills> }) {
  return (
    <div className="space-y-6" role="list" aria-label="Tech stack">
      {categories.map((category) => (
        <div key={category.name} role="listitem">
          <p className="text-xs mb-3 flex items-center gap-2 tracking-widest" style={{ color: CT_COLORS.futureChrome }}>
            <span>{category.icon}</span>
            {category.name.toUpperCase()}
          </p>
          <div className="flex flex-wrap gap-2">
            {category.items.map((tech) => (
              <span
                key={tech}
                className="text-[10px] px-3 py-2 flex items-center gap-2 transition-colors hover:bg-white/10"
                style={{
                  border: `1px solid ${CT_COLORS.portalBlue}60`,
                  color: CT_COLORS.white,
                }}
              >
                <span style={{ color: CT_COLORS.atbGreen, fontSize: '6px' }}>●</span>
                {tech}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// Skills Display (Drummer/Fighter)
function SkillsDisplay({ categories }: { categories: ReturnType<typeof getSkillsByProfession> }) {
  return (
    <div className="grid md:grid-cols-3 gap-6" role="list" aria-label="Skills">
      {categories.map((category) => (
        <div key={category.name} role="listitem">
          <p className="text-xs mb-3 flex items-center gap-2 tracking-widest" style={{ color: CT_COLORS.medievalGreen }}>
            <span>{category.icon}</span>
            {category.name.toUpperCase()}
          </p>
          <ul className="space-y-2">
            {category.skills.map((skill) => (
              <li
                key={skill.name}
                className="text-[10px] flex items-center gap-2"
                style={{ color: CT_COLORS.white }}
              >
                <span style={{ color: CT_COLORS.portalMagenta, fontSize: '6px' }}>◆</span>
                {skill.name}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function RetroRPGTheme() {
  const { theme } = useTheme()
  const { active, setActive, config } = useProfession()
  const [mounted, setMounted] = useState(false)
  const reducedMotion = usePrefersReducedMotion()

  const aboutData = ABOUT_DATA[active]
  const engineerTech = useMemo(() => getEngineerSkills(), [])
  const otherSkills = useMemo(() => getSkillsByProfession(active), [active])
  const projects = useMemo(
    () => PROJECTS_DATA.filter((p) => p.professions.includes(active) || p.featured),
    [active]
  )
  const experience = useMemo(
    () => filterExperienceByProfession(EXPERIENCE_DATA, active),
    [active]
  )

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const professionOptions = [
    { id: 'engineer' as const, label: 'ENGINEER', color: CT_COLORS.portalBlue },
    { id: 'drummer' as const, label: 'MUSICIAN', color: CT_COLORS.portalPurple },
    { id: 'fighter' as const, label: 'FIGHTER', color: CT_COLORS.prehistoricOrange },
  ]

  return (
    <div
      className="min-h-screen relative text-white"
      style={{
        background: `linear-gradient(180deg, ${CT_COLORS.voidDark} 0%, ${CT_COLORS.voidMid} 50%, ${CT_COLORS.voidDark} 100%)`,
        fontFamily: '"Press Start 2P", "Courier New", monospace',
        imageRendering: 'pixelated' as const,
      }}
    >
      {/* Skip to main content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2"
        style={{ background: CT_COLORS.gold, color: CT_COLORS.voidDark }}
      >
        Skip to main content
      </a>

      {/* CRT Scanlines */}
      <div
        className="fixed inset-0 pointer-events-none z-10 opacity-[0.05]"
        style={{
          background:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.5) 2px, rgba(0,0,0,0.5) 4px)',
        }}
        aria-hidden="true"
      />

      {/* Ambient Time Portal Effects */}
      <div className="fixed top-20 left-8 opacity-10 hidden xl:block" aria-hidden="true">
        <TimePortal size={80} animate={!reducedMotion} />
      </div>
      <div className="fixed bottom-20 right-8 opacity-10 hidden xl:block" aria-hidden="true">
        <TimePortal size={80} animate={!reducedMotion} />
      </div>

      {/* Character silhouettes at edges */}
      <div className="fixed top-32 right-4 opacity-15 hidden xl:block" aria-hidden="true">
        <CronoPixelArt size={32} />
      </div>
      <div className="fixed bottom-32 left-4 opacity-15 hidden xl:block" aria-hidden="true">
        <FrogPixelArt size={32} />
      </div>

      {/* ========== HEADER ========== */}
      <header className="relative z-30 p-6 border-b-4" style={{ borderColor: CT_COLORS.white }} role="banner">
        <div className="max-w-5xl mx-auto flex justify-between items-start flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <TimePortal size={48} animate={!reducedMotion} />
            <div>
              <h1 className="text-lg tracking-[0.2em]" style={{ color: CT_COLORS.white }}>
                ALEXANDER PULIDO
              </h1>
              <p className="text-[11px] tracking-wide mt-1" style={{ color: CT_COLORS.gold }}>
                {PROFESSIONAL_SUMMARY.headline}
              </p>
              <p className="text-[10px] mt-2 italic" style={{ color: CT_COLORS.portalBlueBright }}>
                ◇ {PROFESSIONAL_SUMMARY.tagline}
              </p>
            </div>
          </div>

          <nav className="flex gap-3 items-center flex-wrap" aria-label="Main navigation">
            <Link
              href="/cv"
              className="px-4 py-2 text-[10px] tracking-widest flex items-center gap-2 transition-all hover:scale-105 focus:outline-none focus:ring-2"
              style={{
                border: `3px solid ${CT_COLORS.gold}`,
                color: CT_COLORS.gold,
                background: CT_COLORS.voidDark,
              }}
              aria-label="View CV - Save point"
            >
              <span>◈</span>
              SAVE
            </Link>
            <Link
              href="/personal-projects/game-engine"
              className="px-4 py-2 text-[10px] tracking-widest transition-all hover:scale-105 focus:outline-none focus:ring-2"
              style={{
                border: `3px solid ${CT_COLORS.portalBlue}`,
                color: CT_COLORS.portalBlue,
                background: CT_COLORS.voidDark,
              }}
              aria-label="Play game engine demo"
            >
              GAME
            </Link>
          </nav>
        </div>
      </header>

      {/* Profession Selector (Party Menu) */}
      <div className="relative z-20 px-6 py-6 border-b-2" style={{ borderColor: CT_COLORS.white + '30' }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-xs mb-4 text-center tracking-widest" style={{ color: CT_COLORS.gold }}>
            ◈ Select your path through time ◈
          </p>
          <div
            className="flex flex-wrap justify-center gap-4"
            role="radiogroup"
            aria-label="Profession selection"
          >
            {professionOptions.map((opt) => (
              <MenuCommandButton
                key={opt.id}
                label={opt.label}
                isSelected={active === opt.id}
                onClick={() => setActive(opt.id)}
                color={opt.color}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ========== MAIN CONTENT ========== */}
      <main id="main-content" className="relative z-20 px-6 py-8" role="main">
        <div className="max-w-5xl mx-auto">

          {/* ABOUT Section */}
          <BattleFrame title="ABOUT" era="present">
            <div className="mb-4 p-4" style={{
              border: `2px solid ${CT_COLORS.portalBlue}30`,
              background: `linear-gradient(90deg, ${CT_COLORS.voidDark} 0%, transparent 100%)`,
            }}>
              <p className="text-[11px] leading-relaxed tracking-wide" style={{ color: CT_COLORS.white }}>
                {aboutData.bio}
              </p>
            </div>
            <div className="flex flex-wrap gap-2" role="list" aria-label="Quick facts">
              {aboutData.quickFacts.map((fact, i) => (
                <span
                  key={i}
                  className="text-[10px] px-3 py-2 flex items-center gap-2"
                  style={{
                    border: `1px solid ${CT_COLORS.portalPurple}50`,
                    color: CT_COLORS.portalMagenta,
                  }}
                  role="listitem"
                >
                  <span style={{ color: CT_COLORS.gold, fontSize: '6px' }}>◆</span>
                  {fact}
                </span>
              ))}
            </div>
          </BattleFrame>

          {/* ART SECTION 1: Character Party */}
          <CharacterParty />

          {/* EXPERIENCE Section */}
          {experience.length > 0 && (
            <BattleFrame title="WORK EXPERIENCE" era="medieval">
              <div className="space-y-4">
                {experience.map((entry) => (
                  <ExperienceCard key={entry.id} entry={entry} />
                ))}
              </div>
            </BattleFrame>
          )}

          {/* ART SECTION 2: Time Portal Gateway */}
          <TimePortalGateway />

          {/* SKILLS Section */}
          <BattleFrame title={active === 'engineer' ? 'TECH STACK' : 'SKILLS'} era="future">
            {active === 'engineer' ? (
              <TechInventory categories={engineerTech} />
            ) : (
              <SkillsDisplay categories={otherSkills} />
            )}
          </BattleFrame>

          {/* PROJECTS Section */}
          <BattleFrame title="FEATURED WORK" era="present">
            <div className="grid md:grid-cols-2 gap-4">
              {projects.filter((p) => p.featured).map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
            {projects.filter((p) => !p.featured).length > 0 && (
              <details className="mt-6">
                <summary
                  className="text-[10px] cursor-pointer tracking-widest transition-colors hover:opacity-80 focus:outline-none focus:ring-2"
                  style={{ color: CT_COLORS.gold }}
                >
                  ◇ View more projects...
                </summary>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  {projects.filter((p) => !p.featured).map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </details>
            )}
          </BattleFrame>

          {/* ART SECTION 3: Lavos Dramatic */}
          <LavosDramaticSection />

          {/* VENTURES Section (engineer only) */}
          {active === 'engineer' && (
            <BattleFrame title="VENTURES" era="future">
              <div className="grid md:grid-cols-3 gap-4">
                {COMPANIES.map((company) => (
                  <CompanyCard key={company.id} company={company} />
                ))}
              </div>
            </BattleFrame>
          )}

          {/* BANDS Section (drummer only) */}
          {active === 'drummer' && (
            <BattleFrame title="BANDS" era="medieval">
              <div className="grid md:grid-cols-3 gap-4">
                {BANDS.map((band) => (
                  <BandCard key={band.id} band={band} />
                ))}
              </div>
            </BattleFrame>
          )}

          {/* POSTS Section */}
          <BattleFrame title="POSTS" era="end-of-time">
            <div className="text-center py-8">
              <p className="text-[11px]" style={{ color: CT_COLORS.silver }}>
                Writings and thoughts coming soon...
              </p>
              <p className="text-[10px] mt-3 italic" style={{ color: CT_COLORS.portalMagenta }}>
                ◇ Check back for updates on development, music, and martial arts
              </p>
              <div className="flex justify-center mt-6 gap-4">
                <EraBadge era="present" year="TECH" />
                <EraBadge era="medieval" year="MUSIC" />
                <EraBadge era="prehistoric" year="FIGHTING" />
              </div>
            </div>
          </BattleFrame>

          {/* CURRENT ROLES Section */}
          <BattleFrame title="EQUIPPED ROLES" era="present">
            <div className="space-y-3" role="list">
              {CURRENT_ROLES.map((role) => (
                <RoleCard key={role.id} role={role} />
              ))}
            </div>
          </BattleFrame>

        </div>
      </main>

      {/* ========== CONTACT CTA ========== */}
      <section className="relative z-20 py-16 px-6" aria-label="Contact">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <h2 className="text-xl tracking-[0.2em] mb-3" style={{ color: CT_COLORS.gold }}>
              READY TO WORK TOGETHER?
            </h2>
            <p className="text-[11px] tracking-wide" style={{ color: CT_COLORS.silver }}>
              10+ years delivering production systems. Let&apos;s build something.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:alexanderpulido81@gmail.com"
              className="px-6 py-3 text-[10px] tracking-widest flex items-center justify-center gap-2 transition-all hover:scale-105 focus:outline-none focus:ring-2"
              style={{
                background: `linear-gradient(180deg, ${CT_COLORS.portalBlue}, ${CT_COLORS.portalPurple})`,
                border: `3px solid ${CT_COLORS.white}`,
                color: CT_COLORS.white,
                boxShadow: `0 0 20px ${CT_COLORS.portalBlue}60`,
              }}
            >
              <span>◈</span>
              GET IN TOUCH
            </a>
            <Link
              href="/cv"
              className="px-6 py-3 text-[10px] tracking-widest flex items-center justify-center gap-2 transition-all hover:scale-105 focus:outline-none focus:ring-2"
              style={{
                border: `3px solid ${CT_COLORS.gold}`,
                color: CT_COLORS.gold,
                background: CT_COLORS.voidDark,
              }}
            >
              <span>◈</span>
              DOWNLOAD CV
            </Link>
          </div>
        </div>
      </section>

      

      {/* ========== FOOTER ========== */}
      <footer className="relative z-20 py-12 px-6 border-t-4 text-center" style={{ borderColor: CT_COLORS.white }} role="contentinfo">
        <div className="flex items-center justify-center gap-4 mb-4">
          <TimePortal size={32} animate={!reducedMotion} />
          <span className="text-xs tracking-[0.2em]" style={{ color: CT_COLORS.gold }}>
            SAVE YOUR PROGRESS
          </span>
          <TimePortal size={32} animate={!reducedMotion} />
        </div>
        <p className="text-[10px] tracking-widest" style={{ color: CT_COLORS.silver }}>
          ◈ The future is not yet written... ◈
        </p>
        <p className="text-[9px] mt-4" style={{ color: CT_COLORS.portalPurple }}>
          &ldquo;But...the future refused to change.&rdquo;
        </p>
      </footer>

      {/* ========== CSS ANIMATIONS ========== */}
      <style jsx global>{`
        /* Portal spin animation */
        @keyframes portal-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Portal ring animations */
        @keyframes portal-ring-1 {
          0%, 100% { transform: rotate(0deg) scale(1); opacity: 0.7; }
          50% { transform: rotate(180deg) scale(1.1); opacity: 0.5; }
        }
        @keyframes portal-ring-2 {
          0%, 100% { transform: rotate(0deg) scale(1); opacity: 0.6; }
          50% { transform: rotate(-180deg) scale(0.9); opacity: 0.4; }
        }
        @keyframes portal-ring-3 {
          0%, 100% { transform: rotate(0deg) scale(1); opacity: 0.5; }
          50% { transform: rotate(90deg) scale(1.2); opacity: 0.3; }
        }

        /* Sparkle animations */
        @keyframes sparkle-1 {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(0.5); }
        }
        @keyframes sparkle-2 {
          0%, 100% { opacity: 0.3; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1); }
        }
        @keyframes sparkle-3 {
          0%, 100% { opacity: 0.8; transform: scale(0.8); }
          50% { opacity: 0.2; transform: scale(0.4); }
        }
        @keyframes sparkle-4 {
          0%, 100% { opacity: 0.5; transform: scale(0.7); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        /* Engine pulse */
        @keyframes engine-pulse {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        /* Lavos pulse */
        @keyframes lavos-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.8); }
        }

        /* Lavos text glow */
        @keyframes lavos-text {
          0%, 100% {
            text-shadow: 0 0 8px ${CT_COLORS.lavosRed}, 0 0 16px ${CT_COLORS.lavosPurple};
          }
          50% {
            text-shadow: 0 0 16px ${CT_COLORS.lavosRed}, 0 0 32px ${CT_COLORS.lavosPurple}, 0 0 48px ${CT_COLORS.red};
          }
        }

        .animate-portal-spin { animation: portal-spin 20s linear infinite; }
        .animate-portal-ring-1 { animation: portal-ring-1 4s ease-in-out infinite; }
        .animate-portal-ring-2 { animation: portal-ring-2 5s ease-in-out infinite; }
        .animate-portal-ring-3 { animation: portal-ring-3 3s ease-in-out infinite; }
        .animate-sparkle-1 { animation: sparkle-1 2s ease-in-out infinite; }
        .animate-sparkle-2 { animation: sparkle-2 2.5s ease-in-out infinite; }
        .animate-sparkle-3 { animation: sparkle-3 1.8s ease-in-out infinite; }
        .animate-sparkle-4 { animation: sparkle-4 2.2s ease-in-out infinite; }
        .animate-engine-pulse { animation: engine-pulse 1.5s ease-in-out infinite; }
        .animate-lavos-pulse { animation: lavos-pulse 2s ease-in-out infinite; }
        .animate-lavos-text { animation: lavos-text 3s ease-in-out infinite; }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .animate-portal-spin,
          .animate-portal-ring-1,
          .animate-portal-ring-2,
          .animate-portal-ring-3,
          .animate-sparkle-1,
          .animate-sparkle-2,
          .animate-sparkle-3,
          .animate-sparkle-4,
          .animate-engine-pulse,
          .animate-lavos-pulse,
          .animate-lavos-text {
            animation: none !important;
          }
        }

        /* Focus visible styles for accessibility */
        :focus-visible {
          outline: 2px solid ${CT_COLORS.gold};
          outline-offset: 2px;
        }
      `}</style>
    </div>
  )
}
