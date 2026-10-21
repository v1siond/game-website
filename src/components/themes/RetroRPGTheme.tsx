'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useProfession } from '@/contexts/ProfessionContext'
import { ProfessionSwitch } from '@/components/cv/ProfessionSwitch'
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
import { jobYears } from '@/components/cv/sectionText'

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
function LavosEye({ size = 80, animate = true }: { size?: number; animate?: boolean }) {
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

// =============================================================================
// CONTENT CARDS
// =============================================================================

// Experience Card. Dates are date only strings (UTC midnight), so the year is read in UTC.
function ExperienceCard({ entry }: { entry: Job }) {
  const { start: startDisplay, end: endDisplay } = jobYears(entry, 'Present')

  return (
    <article
      className="p-4 transition-all hover:bg-white/5"
      style={{
        border: `2px solid ${CT_COLORS.portalBlue}40`,
        background: `linear-gradient(180deg, ${CT_COLORS.voidMid}40 0%, ${CT_COLORS.voidDark} 100%)`,
      }}
      aria-label={`${entry.title} at ${entry.company}, ${startDisplay} to ${endDisplay}`}
    >
      <div className="flex justify-between items-start gap-3 mb-3 flex-wrap">
        <div>
          <h3 className="text-sm tracking-wide flex items-center gap-2" style={{ color: CT_COLORS.white }}>
            <span style={{ color: CT_COLORS.medievalGreen }} aria-hidden="true">▸</span>
            {entry.title}
          </h3>
          <p className="text-sm mt-1" style={{ color: CT_COLORS.gold }}>
            @ {entry.company}
          </p>
        </div>
        <span className="text-sm tabular-nums tracking-wider px-2 py-1"
          style={{
            color: CT_COLORS.futureChrome,
            background: CT_COLORS.voidDark,
            border: `1px solid ${CT_COLORS.futureChrome}40`,
          }}>
          {startDisplay} - {endDisplay}
        </span>
      </div>
      {entry.description && (
        <p className="text-sm mb-3 leading-relaxed" style={{ color: CT_COLORS.silver }}>
          {entry.description}
        </p>
      )}
      {entry.highlights.length > 0 && (
        <ul className="space-y-2" aria-label="Key achievements">
          {entry.highlights.map((highlight) => (
            <li key={highlight} className="text-sm flex items-start gap-2" style={{ color: CT_COLORS.atbGreen }}>
              <span style={{ color: CT_COLORS.portalMagenta }} aria-hidden="true">◇</span>
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      )}
      {entry.skills.length > 0 && (
        <ul className="flex flex-wrap gap-1 mt-3" aria-label="Skills used">
          {entry.skills.slice(0, 5).map((skill) => (
            <li
              key={skill}
              className="text-sm px-2 py-1"
              style={{
                color: CT_COLORS.portalBlueBright,
                border: `1px solid ${CT_COLORS.portalBlue}40`,
              }}
            >
              {skill}
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

// Project Card: his role, the result line and the links that open the project, each a menu command
function ProjectCard({ project, years, links }: ProjectSlot) {
  return (
    <article
      className="h-full p-4"
      style={{
        border: `2px solid ${CT_COLORS.white}`,
        background: CT_COLORS.voidDark,
      }}
    >
      <div className="flex justify-between items-start gap-2 mb-2">
        <h3 className="text-sm flex items-center gap-2 tracking-wide" style={{ color: CT_COLORS.white }}>
          <span style={{ color: CT_COLORS.cronoOrange }} aria-hidden="true">◈</span>
          {project.name}
        </h3>
        {years && (
          <span className="text-sm whitespace-nowrap" style={{ color: CT_COLORS.futureChrome }}>
            {years}
          </span>
        )}
      </div>
      <p className="text-sm mb-2" style={{ color: CT_COLORS.gold }}>
        {project.role}
      </p>
      <p className="text-sm mb-2" style={{ color: CT_COLORS.silver }}>
        {project.tagline}
      </p>
      {project.impact && (
        <p className="text-sm flex items-start gap-2 mb-3" style={{ color: CT_COLORS.atbGreen }}>
          <span style={{ color: CT_COLORS.gold }} aria-hidden="true">★</span>
          {project.impact}
        </p>
      )}
      {project.techStack.length > 0 && (
        <ul className="flex flex-wrap gap-1" aria-label="Technologies used">
          {project.techStack.slice(0, 4).map((tech) => (
            <li
              key={tech}
              className="text-sm px-2 py-1"
              style={{
                border: `1px solid ${CT_COLORS.portalBlue}60`,
                color: CT_COLORS.portalBlueBright,
              }}
            >
              {tech}
            </li>
          ))}
        </ul>
      )}
      {links.length > 0 ? (
        <div className="flex flex-wrap gap-2 mt-3">
          {links.map(({ kind, label, linkProps }) => (
            <a
              key={kind}
              {...linkProps}
              className="inline-flex items-center min-h-[44px] px-3 text-sm tracking-wide transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2"
              style={{ border: `2px solid ${CT_COLORS.portalBlue}`, color: CT_COLORS.portalBlueBright }}
            >
              <span className="mr-2" aria-hidden="true">▶</span>
              {label}
            </a>
          ))}
        </div>
      ) : (
        <p className="text-sm mt-3" style={{ color: CT_COLORS.silver }}>No public link</p>
      )}
    </article>
  )
}

// Company Card (Ventures)
function CompanyCard({ company }: { company: CVData['companies'][number] }) {
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
      aria-label={`${company.name}: ${company.tagline} (opens in a new tab)`}
    >
      <div className="flex items-start gap-3 mb-2">
        <span className="text-xl" aria-hidden="true">{company.icon}</span>
        <div>
          <h3 className="text-sm tracking-wide" style={{ color: CT_COLORS.white }}>
            {company.name}
          </h3>
          <p className="text-sm mt-1" style={{ color: CT_COLORS.gold }}>
            {company.tagline}
          </p>
        </div>
      </div>
      <p className="text-sm mb-3" style={{ color: CT_COLORS.silver }}>
        <span aria-hidden="true">◇ </span>
        {company.description}
      </p>
      <div className="flex flex-wrap gap-1">
        {company.services.slice(0, 2).map((service) => (
          <span
            key={service}
            className="text-sm px-2 py-1"
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
function BandCard({ band, years, linkProps }: BandSlot) {
  const content = (
    <article
      className="h-full p-4 transition-all"
      style={{
        border: `2px solid ${CT_COLORS.portalPurple}`,
        background: `linear-gradient(180deg, ${CT_COLORS.lavosPurple}20 0%, ${CT_COLORS.voidDark} 100%)`,
      }}
    >
      <h3 className="text-sm tracking-wide flex items-center gap-2" style={{ color: CT_COLORS.white }}>
        <span style={{ color: CT_COLORS.portalMagenta }} aria-hidden="true">♫</span>
        {band.name}
      </h3>
      <p className="text-sm mt-2" style={{ color: CT_COLORS.portalMagenta }}>
        {band.role}
        {years && <span aria-hidden="true"> | </span>}
        {years && <span>{years}</span>}
      </p>
      {band.release && (
        <p className="text-sm mt-2" style={{ color: CT_COLORS.silver }}>
          Released <cite>&ldquo;{band.release}&rdquo;</cite>
        </p>
      )}
    </article>
  )

  if (!linkProps) return content
  return (
    <a {...linkProps}
      className="block h-full hover:scale-[1.02] transition-transform focus:outline-none focus:ring-2"
      style={{ '--tw-ring-color': CT_COLORS.portalPurple } as React.CSSProperties}>
      {content}
    </a>
  )
}

// Tech Inventory (Engineer tech stack)
function TechInventory({ categories }: { categories: CVData['techStack'] }) {
  return (
    <div className="space-y-6">
      {categories.map((category) => (
        <div key={category.id}>
          <h3 className="text-sm mb-3 flex items-center gap-2 tracking-widest" style={{ color: CT_COLORS.futureChrome }}>
            <span aria-hidden="true">{category.icon}</span>
            {category.name.toUpperCase()}
          </h3>
          <ul className="flex flex-wrap gap-2" aria-label={`${category.name} technologies`}>
            {category.items.map((tech) => (
              <li
                key={tech}
                className="text-sm px-3 py-2 flex items-center gap-2 transition-colors hover:bg-white/10"
                style={{
                  border: `1px solid ${CT_COLORS.portalBlue}60`,
                  color: CT_COLORS.white,
                }}
              >
                <span style={{ color: CT_COLORS.atbGreen, fontSize: '6px' }} aria-hidden="true">●</span>
                {tech}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

// The command colour each profession's party menu option carries.
const PROFESSION_COLORS: Record<Profession, string> = {
  drummer: CT_COLORS.portalPurple,
  engineer: CT_COLORS.portalBlue,
  fighter: CT_COLORS.prehistoricOrange,
}

// Email is the lit primary command, LinkedIn the outlined one.
const HERO_ACTION_LOOK: Record<HeroActionSlot['id'], React.CSSProperties> = {
  email: {
    background: `linear-gradient(180deg, ${CT_COLORS.portalBlue}, ${CT_COLORS.portalPurple})`,
    border: `3px solid ${CT_COLORS.white}`,
    color: CT_COLORS.white,
  },
  linkedin: {
    border: `3px solid ${CT_COLORS.portalBlue}`,
    color: CT_COLORS.portalBlueBright,
    background: CT_COLORS.voidDark,
  },
}

const COMMAND_BUTTON =
  'inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2 text-sm tracking-widest transition-all hover:scale-105 focus:outline-none focus:ring-2'

function HeroAction({ action }: { action: HeroActionSlot }) {
  return (
    <a {...action.linkProps} className={COMMAND_BUTTON} style={HERO_ACTION_LOOK[action.id]}>
      <span aria-hidden="true">◈</span>
      {action.label}
    </a>
  )
}

function CVLink() {
  return (
    <Link
      href="/cv"
      className={COMMAND_BUTTON}
      style={{ border: `3px solid ${CT_COLORS.gold}`, color: CT_COLORS.gold, background: CT_COLORS.voidDark }}
    >
      <span aria-hidden="true">◈</span>
      CV
    </Link>
  )
}

function EngineerSections({ sections }: { sections: SectionsOf<'engineer'> }) {
  const { professionalSummary } = useCVData()

  return (
    <>
      <BattleFrame title="ABOUT" era="present">
        <div className="p-4" style={{
          border: `2px solid ${CT_COLORS.portalBlue}30`,
          background: `linear-gradient(90deg, ${CT_COLORS.voidDark} 0%, transparent 100%)`,
        }}>
          <p className="text-sm leading-relaxed tracking-wide" style={{ color: CT_COLORS.white }}>
            {professionalSummary.bio}
          </p>
        </div>
      </BattleFrame>

      {/* ART SECTION 1: Character Party */}
      <CharacterParty />

      {sections.jobs.length > 0 && (
        <BattleFrame title="WORK EXPERIENCE" era="medieval">
          <div className="space-y-4">
            {sections.jobs.map((entry) => (
              <ExperienceCard key={entry.id} entry={entry} />
            ))}
          </div>
        </BattleFrame>
      )}

      {/* ART SECTION 2: Time Portal Gateway */}
      <TimePortalGateway />

      <BattleFrame title="TECH STACK" era="future">
        <TechInventory categories={sections.techStack} />
      </BattleFrame>

      <BattleFrame title="PROJECTS" era="present">
        <ProjectList
          projects={sections.projects}
          className="grid md:grid-cols-2 gap-4"
          renderProject={(slot) => <ProjectCard {...slot} />}
        />
      </BattleFrame>

      {/* ART SECTION 3: Lavos Dramatic */}
      <LavosDramaticSection />

      <BattleFrame title="VENTURES" era="future">
        <div className="grid md:grid-cols-3 gap-4">
          {sections.companies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      </BattleFrame>
    </>
  )
}

function MusicianSections({ sections }: { sections: SectionsOf<'drummer'> }) {
  const { musician, bands } = sections

  return (
    <>
      <CharacterParty />
      <BattleFrame title="BANDS" era="medieval">
        <p className="text-sm mb-4" style={{ color: CT_COLORS.white }}>
          Drums since {musician.since}, {musician.yearsPlaying} years
        </p>
        <BandList
          bands={bands}
          className="grid md:grid-cols-2 gap-4"
          renderBand={(slot) => <BandCard {...slot} />}
        />
        <p className="text-sm mt-4" style={{ color: CT_COLORS.silver }}>
          <span style={{ color: CT_COLORS.portalMagenta }} aria-hidden="true">◇ </span>
          {musician.line}
        </p>
      </BattleFrame>
    </>
  )
}

function MartialArtistSections({ sections }: { sections: SectionsOf<'fighter'> }) {
  const { martialArts } = sections

  return (
    <>
      <CharacterParty />
      <BattleFrame title="MUAY THAI" era="prehistoric">
        <h3 className="text-sm tracking-wide mb-4" style={{ color: CT_COLORS.prehistoricOrangeLight }}>
          {martialArts.primary.title}
        </h3>
        <MuayThaiRecord
          martialArts={martialArts}
          classNames={{
            facts: 'grid sm:grid-cols-2 gap-3 mb-4',
            fact: 'p-3 border-2 border-white/20',
            term: 'text-sm tracking-widest text-[#FFD700]',
            value: 'text-sm text-white mt-2 leading-relaxed',
            achievements: 'space-y-2',
            achievement: 'text-sm text-[#00FF66] flex items-start gap-2',
          }}
          renderAchievement={(achievement) => (
            <>
              <span className="text-[#FFD700]" aria-hidden="true">★</span>
              <span>{achievement}</span>
            </>
          )}
        />
      </BattleFrame>
    </>
  )
}

const SECTION_VIEWS: ProfessionSectionViews = {
  engineer: EngineerSections,
  drummer: MusicianSections,
  fighter: MartialArtistSections,
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function RetroRPGTheme() {
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

      {/* ========== HEADER: the recruiter first screen ========== */}
      <header className="relative z-30 px-4 py-5 sm:p-6 border-b-4" style={{ borderColor: CT_COLORS.white }} role="banner">
        <RecruiterHero
          render={({ name, headline, tagline, line, actions }) => (
            <div className="max-w-5xl mx-auto flex justify-between items-start flex-wrap gap-4">
              <div className="flex items-start gap-4">
                <div className="hidden sm:block shrink-0">
                  <TimePortal size={48} animate={!reducedMotion} />
                </div>
                <div>
                  <h1 className="text-lg tracking-[0.2em] uppercase" style={{ color: CT_COLORS.white }}>
                    {name}
                  </h1>
                  <p className="text-sm leading-relaxed mt-2" style={{ color: CT_COLORS.gold }}>
                    {headline}
                  </p>
                  <p className="text-sm leading-relaxed mt-2 italic" style={{ color: CT_COLORS.portalBlueBright }}>
                    <span aria-hidden="true">◇ </span>
                    <span>{tagline}</span>
                  </p>
                  <p className="text-sm leading-relaxed mt-2" style={{ color: CT_COLORS.futureChromeLight }}>
                    {line}
                  </p>
                </div>
              </div>

              <nav className="flex gap-3 items-center flex-wrap" aria-label="Contact and CV">
                {actions.map((action) => (
                  <HeroAction key={action.id} action={action} />
                ))}
                <CVLink />
                <Link
                  href="/personal-projects/game-engine"
                  className={COMMAND_BUTTON}
                  style={{ border: `3px solid ${CT_COLORS.portalBlue}`, color: CT_COLORS.portalBlueBright, background: CT_COLORS.voidDark }}
                  aria-label="Play game engine demo"
                >
                  GAME
                </Link>
              </nav>
            </div>
          )}
        />
      </header>

      {/* Profession Selector (Party Menu) */}
      <div className="relative z-20 px-4 sm:px-6 py-6 border-b-2" style={{ borderColor: CT_COLORS.white + '30' }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-sm mb-4 text-center tracking-widest" style={{ color: CT_COLORS.gold }}>
            ◈ Select your path through time ◈
          </p>
          <ProfessionSwitch
            className="flex flex-wrap justify-center gap-4"
            label="Profession selection"
            renderOption={({ id, label, selected, optionProps }) => {
              const color = PROFESSION_COLORS[id]
              return (
                <button
                  type="button"
                  {...optionProps}
                  className="relative min-h-[44px] px-6 py-3 text-sm tracking-[0.15em] font-bold transition-all flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-offset-2"
                  style={{
                    background: selected
                      ? `linear-gradient(180deg, ${color} 0%, ${color}AA 100%)`
                      : CT_COLORS.voidDark,
                    border: `3px solid ${color}`,
                    color: CT_COLORS.white,
                    boxShadow: selected ? `0 0 20px ${color}80, inset 0 0 10px ${CT_COLORS.white}40` : 'none',
                  }}
                >
                  {selected && <span style={{ fontSize: '8px' }} aria-hidden="true">▶</span>}
                  {label.toUpperCase()}
                </button>
              )
            }}
          />
        </div>
      </div>

      {/* ========== MAIN CONTENT: the picked profession's sections, and only those ========== */}
      <main id="main-content" className="relative z-20 px-4 sm:px-6 py-8" role="main">
        <div className="max-w-5xl mx-auto" role="region" aria-label={`${active} profession details`}>
          <ProfessionSectionsView views={SECTION_VIEWS} sections={view.sections} />

          {/* POSTS Section */}
          <BattleFrame title="POSTS" era="end-of-time">
            <div className="text-center py-8">
              <p className="text-sm" style={{ color: CT_COLORS.silver }}>
                Writings and thoughts coming soon...
              </p>
              <div className="flex justify-center mt-6 gap-4 flex-wrap">
                <EraBadge era="present" year="TECH" />
                <EraBadge era="medieval" year="MUSIC" />
                <EraBadge era="prehistoric" year="FIGHTING" />
              </div>
            </div>
          </BattleFrame>
        </div>
      </main>

      {/* ========== CONTACT CTA ========== */}
      <section className="relative z-20 py-16 px-4 sm:px-6" aria-labelledby="rpg-contact-heading">
        <RecruiterHero
          render={({ line, actions }) => (
            <div className="max-w-2xl mx-auto text-center">
              <div className="mb-8">
                <h2 id="rpg-contact-heading" className="text-xl tracking-[0.2em] mb-3" style={{ color: CT_COLORS.gold }}>
                  CONTINUE?
                </h2>
                <p className="text-sm tracking-wide leading-relaxed" style={{ color: CT_COLORS.silver }}>
                  {line}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {actions.map((action) => (
                  <HeroAction key={action.id} action={action} />
                ))}
                <CVLink />
              </div>
            </div>
          )}
        />
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
