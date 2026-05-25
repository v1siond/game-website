'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useTheme } from '@/themes/ThemeContext'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import { useProfession } from '@/contexts/ProfessionContext'
import { ABOUT_DATA, PROFESSIONAL_SUMMARY } from '@/data/about'
import { PROJECTS_DATA } from '@/data/projects'
import { getSkillsByProfession } from '@/data/skills'
import { CURRENT_ROLES } from '@/data/roles'
import { COMPANIES } from '@/data/companies'
import { BANDS } from '@/data/bands'
import { EXPERIENCE_DATA, filterExperienceByProfession } from '@/data/experience'
import { TECH_STACK } from '@/data/techStack'
import { getAchievementsByProfession } from '@/data/achievements'

// =============================================================================
// ACCESSIBILITY - Reduced Motion Detection
// =============================================================================
function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return prefersReducedMotion
}

// =============================================================================
// AUTHENTIC HADES COLOR PALETTE
// Based on actual gameplay: River Styx GREEN, stone grey floors, orange fire
// =============================================================================
const HADES = {
  // STYX GREEN - THE DOMINANT COLOR (glowing river pools)
  styxBright: '#00ff66',
  styxMid: '#33cc66',
  styxDark: '#006633',
  styxDeep: '#003319',
  styxGlow: '#00ff6680',

  // STONE GREY - Floor tiles, walls
  stoneDark: '#1a1a1e',
  stoneMid: '#2a2a30',
  stoneLight: '#3d3d45',
  stoneFloor: '#252528',
  groutLine: '#1a1a1c',

  // FIRE/EMBER - Orange and yellow
  fireOrange: '#ff6600',
  fireYellow: '#ffaa00',
  fireRed: '#ff3300',
  emberGlow: '#ff660080',

  // BLOOD - Dark, not bright
  bloodDark: '#330000',
  bloodMid: '#660000',
  bloodBright: '#990000',
  bloodSplatter: '#440000',

  // GOLD TRIM - Greek patterns, ornaments
  goldBright: '#d4af37',
  goldMid: '#b8860b',
  goldDark: '#8b6914',

  // PURPLE/MAGENTA - Magic effects
  magicPurple: '#9933ff',
  magicMagenta: '#cc66ff',
  chaosPurple: '#6622aa',

  // ZAGREUS RED - Accent, cape color
  zagRed: '#cc2244',
  zagRedBright: '#ff3355',

  // TEXT
  textPrimary: '#e8e0d8',
  textSecondary: '#a0988a',
  textMuted: '#605850',
}

// =============================================================================
// SVG PATTERNS - Stone texture, Greek meander, cracks
// =============================================================================
function HadesPatterns() {
  return (
    <svg className="absolute w-0 h-0" aria-hidden="true">
      <defs>
        {/* Stone floor tile pattern */}
        <pattern id="stoneFloor" patternUnits="userSpaceOnUse" width="80" height="80">
          <rect width="80" height="80" fill={HADES.stoneMid} />
          <rect x="0" y="0" width="38" height="38" fill={HADES.stoneFloor} />
          <rect x="42" y="0" width="38" height="38" fill={HADES.stoneLight} />
          <rect x="0" y="42" width="38" height="38" fill={HADES.stoneLight} />
          <rect x="42" y="42" width="38" height="38" fill={HADES.stoneFloor} />
          {/* Grout lines */}
          <line x1="0" y1="40" x2="80" y2="40" stroke={HADES.groutLine} strokeWidth="4" />
          <line x1="40" y1="0" x2="40" y2="80" stroke={HADES.groutLine} strokeWidth="4" />
          {/* Cracks */}
          <path
            d="M10 5 Q15 15 12 25 M55 60 L58 70 Q60 75 55 80"
            fill="none"
            stroke={HADES.stoneDark}
            strokeWidth="0.5"
            opacity="0.6"
          />
        </pattern>

        {/* Greek meander/key pattern - horizontal */}
        <pattern id="meanderH" patternUnits="userSpaceOnUse" width="40" height="20">
          <path
            d="M0 10 L10 10 L10 0 L30 0 L30 10 L20 10 L20 20 L40 20"
            fill="none"
            stroke={HADES.goldBright}
            strokeWidth="2"
          />
        </pattern>

        {/* Styx water gradient */}
        <radialGradient id="styxPool" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={HADES.styxBright} stopOpacity="0.8" />
          <stop offset="40%" stopColor={HADES.styxMid} stopOpacity="0.5" />
          <stop offset="70%" stopColor={HADES.styxDark} stopOpacity="0.3" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>

        {/* Fire gradient */}
        <linearGradient id="fireGrad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor={HADES.fireRed} />
          <stop offset="40%" stopColor={HADES.fireOrange} />
          <stop offset="100%" stopColor={HADES.fireYellow} />
        </linearGradient>

        {/* Blood splatter gradient */}
        <radialGradient id="bloodSplat" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={HADES.bloodMid} stopOpacity="0.6" />
          <stop offset="100%" stopColor={HADES.bloodDark} stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  )
}

// =============================================================================
// GREEK MEANDER BORDER - Authentic pattern
// =============================================================================
function GreekMeander({ className = '' }: { className?: string }) {
  return (
    <div
      className={`w-full h-5 ${className}`}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='20'%3E%3Cpath d='M0 10 L10 10 L10 0 L30 0 L30 10 L20 10 L20 20 L40 20' fill='none' stroke='%23d4af37' stroke-width='2'/%3E%3C/svg%3E")`,
        filter: `drop-shadow(0 0 4px ${HADES.goldBright}60)`,
      }}
      role="presentation"
      aria-hidden="true"
    />
  )
}

// =============================================================================
// SKULL DECORATION - Underworld style
// =============================================================================
function Skull({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 28"
      width={size}
      height={size * 1.17}
      className={className}
      style={{ filter: `drop-shadow(0 0 3px ${HADES.styxGlow})` }}
      aria-hidden="true"
    >
      {/* Skull outline */}
      <ellipse cx="12" cy="10" rx="10" ry="9" fill={HADES.stoneLight} stroke={HADES.goldDark} strokeWidth="0.5" />
      {/* Eye sockets */}
      <ellipse cx="8" cy="9" rx="3" ry="3.5" fill={HADES.stoneDark} />
      <ellipse cx="16" cy="9" rx="3" ry="3.5" fill={HADES.stoneDark} />
      {/* Glowing eyes */}
      <ellipse cx="8" cy="9" rx="1.2" ry="1.5" fill={HADES.styxBright} opacity="0.9" />
      <ellipse cx="16" cy="9" rx="1.2" ry="1.5" fill={HADES.styxBright} opacity="0.9" />
      {/* Nose */}
      <path d="M12 12 L10.5 15 L13.5 15 Z" fill={HADES.stoneDark} />
      {/* Teeth */}
      <rect x="8" y="17" width="8" height="3" fill={HADES.stoneLight} rx="0.5" />
      <line x1="9.5" y1="17" x2="9.5" y2="20" stroke={HADES.stoneDark} strokeWidth="0.4" />
      <line x1="11" y1="17" x2="11" y2="20" stroke={HADES.stoneDark} strokeWidth="0.4" />
      <line x1="12.5" y1="17" x2="12.5" y2="20" stroke={HADES.stoneDark} strokeWidth="0.4" />
      <line x1="14" y1="17" x2="14" y2="20" stroke={HADES.stoneDark} strokeWidth="0.4" />
      {/* Jaw */}
      <path d="M6 17 Q12 24 18 17" fill="none" stroke={HADES.stoneLight} strokeWidth="1.5" />
    </svg>
  )
}

// =============================================================================
// GREEK URN - Decorative element
// =============================================================================
function GreekUrn({ size = 30 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 24 36"
      width={size * 0.67}
      height={size}
      aria-hidden="true"
    >
      {/* Urn body */}
      <ellipse cx="12" cy="26" rx="8" ry="4" fill={HADES.goldDark} />
      <path
        d="M4 26 Q4 14 8 10 L8 8 Q4 8 4 6 L4 4 L20 4 L20 6 Q20 8 16 8 L16 10 Q20 14 20 26 Z"
        fill={HADES.goldMid}
        stroke={HADES.goldBright}
        strokeWidth="0.5"
      />
      {/* Handles */}
      <path d="M4 18 Q0 18 0 14 Q0 10 4 10" fill="none" stroke={HADES.goldMid} strokeWidth="1.5" />
      <path d="M20 18 Q24 18 24 14 Q24 10 20 10" fill="none" stroke={HADES.goldMid} strokeWidth="1.5" />
      {/* Greek pattern on urn */}
      <rect x="6" y="16" width="12" height="4" fill="none" stroke={HADES.goldBright} strokeWidth="0.5" />
      <path d="M7 18 L9 18 L9 17 L11 17 L11 18 L13 18 L13 19 L11 19 L11 20 L9 20 L9 19 L7 19 Z" fill={HADES.goldBright} opacity="0.6" />
    </svg>
  )
}

// =============================================================================
// GREEK COLUMN - Side decoration
// =============================================================================
function GreekColumn({ side }: { side: 'left' | 'right' }) {
  return (
    <div
      className={`fixed top-0 bottom-0 w-12 md:w-16 pointer-events-none z-10 hidden lg:block ${
        side === 'left' ? 'left-0' : 'right-0'
      }`}
      aria-hidden="true"
    >
      {/* Column shaft */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(90deg,
            ${side === 'left' ? HADES.stoneLight : HADES.stoneMid},
            ${HADES.stoneMid},
            ${side === 'left' ? HADES.stoneMid : HADES.stoneLight}
          )`,
        }}
      >
        {/* Flutes (vertical grooves) */}
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="absolute top-24 bottom-32 w-1"
            style={{
              left: `${20 + i * 20}%`,
              background: `linear-gradient(90deg, ${HADES.stoneDark}40, transparent, ${HADES.stoneDark}40)`,
            }}
          />
        ))}

        {/* Cracks */}
        <svg className="absolute inset-0 w-full h-full opacity-30">
          <path
            d="M8 100 Q12 150 6 200 M10 400 L14 450 Q10 480 15 520"
            fill="none"
            stroke={HADES.stoneDark}
            strokeWidth="0.5"
          />
        </svg>
      </div>

      {/* Capital (top) */}
      <div
        className="absolute top-0 left-0 right-0 h-20"
        style={{
          background: `linear-gradient(180deg, ${HADES.goldMid}, ${HADES.goldDark}, ${HADES.stoneLight})`,
        }}
      >
        <GreekMeander className="absolute top-2 left-0 right-0" />
        <div className="absolute top-8 left-1/2 -translate-x-1/2">
          <Skull size={16} />
        </div>
      </div>

      {/* Base */}
      <div
        className="absolute bottom-24 left-0 right-0 h-8"
        style={{
          background: `linear-gradient(180deg, ${HADES.stoneLight}, ${HADES.goldDark}, ${HADES.goldMid})`,
        }}
      />
    </div>
  )
}

// =============================================================================
// FLOATING EMBERS - Orange/yellow fire particles
// =============================================================================
function FloatingEmbers({ reducedMotion }: { reducedMotion: boolean }) {
  if (reducedMotion) return null

  const embers = [
    { left: '8%', delay: '0s', duration: '7s', size: 4 },
    { left: '18%', delay: '1.2s', duration: '6s', size: 3 },
    { left: '28%', delay: '0.5s', duration: '8s', size: 5 },
    { left: '42%', delay: '2s', duration: '6.5s', size: 3 },
    { left: '55%', delay: '0.8s', duration: '7.5s', size: 4 },
    { left: '68%', delay: '1.5s', duration: '6s', size: 3 },
    { left: '78%', delay: '2.5s', duration: '8s', size: 5 },
    { left: '88%', delay: '0.3s', duration: '7s', size: 4 },
    { left: '95%', delay: '1.8s', duration: '6.5s', size: 3 },
  ]

  return (
    <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden" aria-hidden="true">
      {embers.map((ember, i) => (
        <div
          key={i}
          className="absolute bottom-24 rounded-full animate-ember-rise"
          style={{
            left: ember.left,
            width: ember.size,
            height: ember.size,
            background: i % 2 === 0 ? HADES.fireOrange : HADES.fireYellow,
            boxShadow: `0 0 ${ember.size * 3}px ${i % 2 === 0 ? HADES.fireOrange : HADES.fireYellow}`,
            animationDelay: ember.delay,
            animationDuration: ember.duration,
          }}
        />
      ))}
    </div>
  )
}

// =============================================================================
// STYX RIVER POOLS - Green glowing edges
// =============================================================================
function StyxPools() {
  return (
    <>
      {/* Bottom Styx river */}
      <div
        className="fixed bottom-0 left-0 right-0 h-24 pointer-events-none z-[4]"
        aria-hidden="true"
      >
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg,
              transparent 0%,
              ${HADES.styxDeep}40 30%,
              ${HADES.styxDark}80 60%,
              ${HADES.styxMid} 100%
            )`,
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-8 animate-styx-glow"
          style={{
            background: HADES.styxBright,
            filter: 'blur(12px)',
            opacity: 0.6,
          }}
        />
        {/* Ripples */}
        <div
          className="absolute bottom-6 left-0 right-0 h-px animate-styx-ripple"
          style={{
            background: `linear-gradient(90deg, transparent, ${HADES.styxBright}, transparent)`,
          }}
        />
      </div>

      {/* Side pools - left */}
      <div
        className="fixed left-12 md:left-16 top-1/3 w-16 h-32 pointer-events-none z-[3] hidden lg:block"
        aria-hidden="true"
      >
        <div
          className="absolute inset-0 rounded-full animate-pool-pulse"
          style={{
            background: `radial-gradient(ellipse at center, ${HADES.styxBright}40, ${HADES.styxDark}20, transparent)`,
            filter: 'blur(8px)',
          }}
        />
      </div>

      {/* Side pools - right */}
      <div
        className="fixed right-12 md:right-16 top-2/3 w-16 h-32 pointer-events-none z-[3] hidden lg:block"
        aria-hidden="true"
      >
        <div
          className="absolute inset-0 rounded-full animate-pool-pulse"
          style={{
            background: `radial-gradient(ellipse at center, ${HADES.styxBright}40, ${HADES.styxDark}20, transparent)`,
            filter: 'blur(8px)',
            animationDelay: '1.5s',
          }}
        />
      </div>
    </>
  )
}

// =============================================================================
// BLOOD SPLATTERS - Dark, decorative
// =============================================================================
function BloodSplatters() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[2]" aria-hidden="true">
      {/* Top left splatter */}
      <svg className="absolute top-20 left-20 w-32 h-32 opacity-40">
        <ellipse cx="40" cy="60" rx="35" ry="20" fill={HADES.bloodDark} />
        <circle cx="20" cy="40" r="12" fill={HADES.bloodMid} />
        <circle cx="70" cy="50" r="8" fill={HADES.bloodSplatter} />
        <path d="M40 80 L35 100 M50 75 L55 95 M30 70 L20 85" fill="none" stroke={HADES.bloodDark} strokeWidth="2" />
      </svg>

      {/* Top right splatter */}
      <svg className="absolute top-40 right-32 w-24 h-24 opacity-30">
        <circle cx="50" cy="40" r="20" fill={HADES.bloodDark} />
        <circle cx="35" cy="55" r="10" fill={HADES.bloodMid} />
        <path d="M50 60 L45 80 M60 55 L70 75" fill="none" stroke={HADES.bloodDark} strokeWidth="2" />
      </svg>

      {/* Bottom splatter */}
      <svg className="absolute bottom-32 left-1/3 w-40 h-20 opacity-35 hidden md:block">
        <ellipse cx="80" cy="10" rx="70" ry="8" fill={HADES.bloodDark} />
        <circle cx="30" cy="15" r="6" fill={HADES.bloodMid} />
        <circle cx="120" cy="12" r="5" fill={HADES.bloodSplatter} />
      </svg>
    </div>
  )
}

// =============================================================================
// VIGNETTE - Dark edges
// =============================================================================
function Vignette() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[6]"
      style={{
        background: `
          radial-gradient(ellipse at 50% 50%, transparent 40%, ${HADES.stoneDark}90 100%),
          radial-gradient(ellipse at 50% 0%, ${HADES.bloodDark}30 0%, transparent 50%),
          radial-gradient(ellipse at 50% 100%, ${HADES.styxDeep}50 0%, transparent 40%)
        `,
      }}
      aria-hidden="true"
    />
  )
}

// =============================================================================
// SECTION CARD - Stone tablet with Greek meander border, Styx glow
// =============================================================================
function StoneTablet({
  children,
  accentColor = HADES.goldBright,
  className = '',
  ariaLabel,
}: {
  children: React.ReactNode
  accentColor?: string
  className?: string
  ariaLabel?: string
}) {
  return (
    <section
      className={`relative p-6 ${className}`}
      style={{
        background: `
          linear-gradient(135deg, ${HADES.stoneLight} 0%, ${HADES.stoneMid} 50%, ${HADES.stoneFloor} 100%)
        `,
        boxShadow: `
          inset 0 2px 0 ${HADES.stoneLight},
          inset 0 -2px 0 ${HADES.stoneDark},
          0 0 30px ${HADES.styxDark}60,
          0 8px 20px ${HADES.stoneDark}80
        `,
      }}
      role="region"
      aria-label={ariaLabel}
    >
      {/* Greek meander border - all sides */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          border: `3px solid ${HADES.goldMid}`,
          boxShadow: `inset 0 0 0 6px ${HADES.stoneMid}, inset 0 0 0 8px ${HADES.goldDark}40`,
        }}
      >
        {/* Top meander */}
        <div
          className="absolute -top-px left-4 right-4 h-3"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='12'%3E%3Cpath d='M0 6 L6 6 L6 0 L18 0 L18 6 L12 6 L12 12 L24 12' fill='none' stroke='%23d4af37' stroke-width='1.5'/%3E%3C/svg%3E")`,
          }}
        />
        {/* Bottom meander */}
        <div
          className="absolute -bottom-px left-4 right-4 h-3"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='12'%3E%3Cpath d='M0 6 L6 6 L6 0 L18 0 L18 6 L12 6 L12 12 L24 12' fill='none' stroke='%23d4af37' stroke-width='1.5'/%3E%3C/svg%3E")`,
            transform: 'rotate(180deg)',
          }}
        />
      </div>

      {/* Corner skull ornaments */}
      <div className="absolute -top-1 -left-1">
        <Skull size={18} />
      </div>
      <div className="absolute -top-1 -right-1">
        <Skull size={18} />
      </div>
      <div className="absolute -bottom-1 -left-1">
        <Skull size={18} />
      </div>
      <div className="absolute -bottom-1 -right-1">
        <Skull size={18} />
      </div>

      {/* Styx glow underneath */}
      <div
        className="absolute -bottom-2 left-8 right-8 h-2 rounded-full"
        style={{
          background: HADES.styxMid,
          filter: 'blur(6px)',
          opacity: 0.5,
        }}
        aria-hidden="true"
      />

      {/* Stone texture cracks */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" aria-hidden="true">
        <path
          d="M20 10 Q30 30 25 50 M80 5 L85 35 Q82 50 90 70 M150 20 Q145 45 155 65"
          fill="none"
          stroke={HADES.stoneDark}
          strokeWidth="0.5"
        />
      </svg>

      <div className="relative z-10">{children}</div>
    </section>
  )
}

// =============================================================================
// SECTION TITLE - Gold with hexagon icon
// =============================================================================
function SectionTitle({
  children,
  color = HADES.goldBright,
}: {
  children: React.ReactNode
  color?: string
}) {
  return (
    <h2
      className="text-lg mb-4 flex items-center gap-3"
      style={{
        color,
        textShadow: `0 0 12px ${color}50`,
        fontFamily: '"Cinzel", Georgia, serif',
      }}
    >
      <svg viewBox="0 0 20 24" className="w-4 h-5" aria-hidden="true">
        <polygon points="10,0 20,6 20,18 10,24 0,18 0,6" fill={color} opacity="0.9" />
        <polygon points="10,4 16,8 16,16 10,20 4,16 4,8" fill={HADES.stoneDark} />
      </svg>
      <span className="tracking-widest uppercase text-sm">{children}</span>
      <div
        className="flex-1 h-px ml-2"
        style={{ background: `linear-gradient(90deg, ${color}80, transparent)` }}
        aria-hidden="true"
      />
    </h2>
  )
}

// =============================================================================
// BOON SELECTOR - Hexagonal god selection cards
// =============================================================================
function BoonSelector({
  profession,
  isActive,
  onClick,
}: {
  profession: 'engineer' | 'drummer' | 'fighter'
  isActive: boolean
  onClick: () => void
}) {
  const gods = {
    engineer: {
      name: 'ATHENA',
      color: HADES.styxBright,
      title: 'Wisdom & Strategy',
      iconPath: 'M10 4 L10 2 L8 2 L7 4 L8 7 L7 10 L9 10 L9 16 L11 16 L11 10 L13 10 L12 7 L13 4 L12 2 L10 2',
    },
    drummer: {
      name: 'APOLLO',
      color: HADES.fireOrange,
      title: 'Music & Light',
      iconPath: 'M10 3 L6 8 Q5 12 10 16 Q15 12 14 8 Z M8 9 L8 14 M10 9 L10 15 M12 9 L12 14',
    },
    fighter: {
      name: 'ARES',
      color: HADES.zagRedBright,
      title: 'War & Valor',
      iconPath: 'M10 2 L5 7 L5 12 L10 10 L15 12 L15 7 Z M10 11 L10 18 M7 14 L13 14',
    },
  }
  const god = gods[profession]

  return (
    <button
      onClick={onClick}
      className={`relative transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
        isActive ? 'scale-110 z-10' : 'opacity-60 hover:opacity-90 hover:scale-105'
      }`}
      style={{ focusVisibleRingColor: god.color }}
      aria-pressed={isActive}
      aria-label={`Select ${god.name} - ${god.title}`}
    >
      <svg viewBox="0 0 80 100" className="w-20 h-24 md:w-24 md:h-28">
        {/* Hexagon background */}
        <path
          d="M40 5 L75 22 L75 68 L40 95 L5 68 L5 22 Z"
          fill={isActive ? `${god.color}25` : HADES.stoneMid}
          stroke={isActive ? god.color : HADES.goldDark}
          strokeWidth={isActive ? 3 : 2}
          style={{
            filter: isActive ? `drop-shadow(0 0 15px ${god.color}80)` : 'none',
          }}
        />

        {/* Inner hexagon */}
        <path
          d="M40 12 L68 26 L68 64 L40 88 L12 64 L12 26 Z"
          fill="none"
          stroke={isActive ? god.color : HADES.goldDark}
          strokeWidth="1"
          opacity="0.4"
        />

        {/* God icon */}
        <g transform="translate(30, 20)">
          <path d={god.iconPath} fill={isActive ? god.color : HADES.textSecondary} />
        </g>

        {/* God name */}
        <text
          x="40"
          y="72"
          textAnchor="middle"
          fill={isActive ? god.color : HADES.textSecondary}
          fontSize="8"
          fontWeight="bold"
          style={{ fontFamily: '"Cinzel", serif' }}
        >
          {god.name}
        </text>

        {/* Title */}
        <text x="40" y="82" textAnchor="middle" fill={HADES.textMuted} fontSize="5">
          {god.title}
        </text>
      </svg>

      {/* Active glow ring */}
      {isActive && (
        <div
          className="absolute inset-0 rounded-full animate-boon-pulse pointer-events-none"
          style={{
            border: `2px solid ${god.color}`,
            filter: `blur(2px)`,
            opacity: 0.5,
          }}
        />
      )}
    </button>
  )
}

// =============================================================================
// TECH STACK DISPLAY - Boon style tags, NO skill bars
// =============================================================================
function TechStackDisplay({ color }: { color: string }) {
  return (
    <div className="space-y-4" role="list" aria-label="Technology expertise">
      {TECH_STACK.map((category) => (
        <div key={category.name}>
          <h3
            className="text-xs tracking-widest mb-2 pb-1 border-b flex items-center gap-2 uppercase"
            style={{
              color: HADES.goldBright,
              borderColor: `${HADES.goldBright}30`,
              fontFamily: '"Cinzel", serif',
            }}
          >
            <span>{category.icon}</span>
            {category.name}
          </h3>
          <div className="flex flex-wrap gap-1.5" role="list">
            {category.items.map((tech) => (
              <span
                key={tech}
                className="text-xs px-2 py-1 transition-all hover:scale-105"
                style={{
                  background: `${color}15`,
                  border: `1px solid ${color}40`,
                  color: HADES.textPrimary,
                  clipPath: 'polygon(4px 0%, 100% 0%, calc(100% - 4px) 100%, 0% 100%)',
                }}
                role="listitem"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// =============================================================================
// ACHIEVEMENT DISPLAY - For drummer/fighter, shows REAL achievements
// =============================================================================
function AchievementDisplay({
  profession,
  color,
}: {
  profession: 'drummer' | 'fighter'
  color: string
}) {
  const achievements = getAchievementsByProfession(profession)

  return (
    <div className="space-y-4" role="list" aria-label="Achievements and expertise">
      {achievements.map((category) => (
        <div key={category.name}>
          <h3
            className="text-xs tracking-widest mb-2 pb-1 border-b flex items-center gap-2 uppercase"
            style={{
              color: HADES.goldBright,
              borderColor: `${HADES.goldBright}30`,
              fontFamily: '"Cinzel", serif',
            }}
          >
            <span>{category.icon}</span>
            {category.name}
          </h3>
          <div className="space-y-1.5" role="list">
            {category.achievements.map((achievement, i) => (
              <div
                key={i}
                className="flex items-start gap-2 py-1 px-2 hover:bg-white/5 transition-colors rounded"
                role="listitem"
              >
                <svg viewBox="0 0 12 14" className="w-2.5 h-3 flex-shrink-0 mt-0.5" aria-hidden="true">
                  <polygon points="6,0 12,4 12,10 6,14 0,10 0,4" fill={color} />
                </svg>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-medium" style={{ color: HADES.textPrimary }}>
                      {achievement.title}
                    </span>
                    {achievement.metric && (
                      <span className="text-xs" style={{ color }}>
                        {achievement.metric}
                      </span>
                    )}
                  </div>
                  {achievement.description && (
                    <p className="text-xs mt-0.5" style={{ color: HADES.textSecondary }}>
                      {achievement.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// =============================================================================
// CURRENT ROLES SECTION
// =============================================================================
function CurrentRolesSection({ color }: { color: string }) {
  return (
    <StoneTablet accentColor={color} ariaLabel="Current professional roles" className="mb-6">
      <SectionTitle>Current Positions</SectionTitle>

      <div className="grid gap-3">
        {CURRENT_ROLES.map((role) => (
          <div
            key={role.id}
            className="p-3 transition-all hover:translate-x-1"
            style={{
              background: `linear-gradient(90deg, ${HADES.stoneLight}60, transparent)`,
              borderLeft: `3px solid ${role.type === 'leadership' ? HADES.goldBright : color}`,
            }}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-bold" style={{ color: HADES.textPrimary }}>
                  {role.title}
                </h3>
                <p
                  className="text-xs"
                  style={{ color: role.type === 'leadership' ? HADES.goldBright : color }}
                >
                  {role.company}
                </p>
              </div>
              {role.type === 'leadership' && (
                <span
                  className="text-xs px-2 py-0.5 tracking-wider uppercase"
                  style={{
                    background: `${HADES.goldBright}15`,
                    border: `1px solid ${HADES.goldBright}40`,
                    color: HADES.goldBright,
                  }}
                >
                  Leadership
                </span>
              )}
            </div>
            <p className="text-xs mt-1" style={{ color: HADES.textSecondary }}>
              {role.description}
            </p>
          </div>
        ))}
      </div>
    </StoneTablet>
  )
}

// =============================================================================
// COMPANIES SECTION
// =============================================================================
function CompaniesSection() {
  return (
    <StoneTablet accentColor={HADES.magicPurple} ariaLabel="Companies and ventures" className="mb-6">
      <SectionTitle color={HADES.magicPurple}>Ventures & Companies</SectionTitle>

      <div className="grid gap-3">
        {COMPANIES.map((company) => (
          <a
            key={company.id}
            href={company.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 transition-all group hover:translate-x-1"
            style={{
              background: `linear-gradient(135deg, ${HADES.stoneLight}60, transparent)`,
              border: `1px solid ${HADES.magicPurple}30`,
            }}
            aria-label={`${company.name} - ${company.tagline}`}
          >
            <div className="flex justify-between items-start mb-1">
              <div className="flex items-center gap-2">
                <span className="text-base">{company.icon}</span>
                <div>
                  <h3 className="text-sm font-bold" style={{ color: HADES.textPrimary }}>
                    {company.name}
                  </h3>
                  <p className="text-xs" style={{ color: HADES.magicPurple }}>
                    {company.tagline}
                  </p>
                </div>
              </div>
              <svg
                viewBox="0 0 16 16"
                className="w-3 h-3 opacity-40 group-hover:opacity-100 transition-opacity"
                aria-hidden="true"
              >
                <path d="M4 12L12 4M12 4H6M12 4v6" fill="none" stroke={HADES.magicPurple} strokeWidth="2" />
              </svg>
            </div>
            <p className="text-xs mb-2" style={{ color: HADES.textSecondary }}>
              {company.description}
            </p>
            <div className="flex flex-wrap gap-1">
              {company.services.map((service) => (
                <span
                  key={service}
                  className="text-xs px-1.5 py-0.5"
                  style={{
                    background: `${HADES.magicPurple}10`,
                    border: `1px solid ${HADES.magicPurple}25`,
                    color: HADES.textSecondary,
                  }}
                >
                  {service}
                </span>
              ))}
            </div>
          </a>
        ))}
      </div>
    </StoneTablet>
  )
}

// =============================================================================
// BANDS SECTION - Musical projects
// =============================================================================
function BandsSection() {
  return (
    <StoneTablet accentColor={HADES.fireOrange} ariaLabel="Musical projects and bands" className="mb-6">
      <SectionTitle color={HADES.fireOrange}>Musical Projects</SectionTitle>

      <div className="grid gap-3">
        {BANDS.map((band) => (
          <div
            key={band.id}
            className="p-3 transition-all hover:translate-x-1"
            style={{
              background: `linear-gradient(135deg, ${HADES.stoneLight}60, transparent)`,
              border: `1px solid ${HADES.fireOrange}30`,
            }}
          >
            <div className="flex justify-between items-start mb-1">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold" style={{ color: HADES.textPrimary }}>
                    {band.name}
                  </h3>
                  {band.active && (
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{
                        background: HADES.styxBright,
                        boxShadow: `0 0 6px ${HADES.styxBright}`,
                      }}
                      aria-label="Currently active"
                    />
                  )}
                </div>
                <p className="text-xs" style={{ color: HADES.fireOrange }}>
                  {band.genre} - {band.role}
                </p>
              </div>
              {band.url && (
                <a
                  href={band.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-40 hover:opacity-100 transition-opacity"
                  aria-label={`Visit ${band.name} website`}
                >
                  <svg viewBox="0 0 16 16" className="w-3 h-3">
                    <path d="M4 12L12 4M12 4H6M12 4v6" fill="none" stroke={HADES.fireOrange} strokeWidth="2" />
                  </svg>
                </a>
              )}
            </div>
            <p className="text-xs" style={{ color: HADES.textSecondary }}>
              {band.description}
            </p>
          </div>
        ))}
      </div>
    </StoneTablet>
  )
}

// =============================================================================
// EXPERIENCE CARD
// =============================================================================
function ExperienceCard({ entry }: { entry: typeof EXPERIENCE_DATA[0] }) {
  const endDisplay = entry.endDate ? new Date(entry.endDate).getFullYear() : 'Present'
  const startDisplay = new Date(entry.startDate).getFullYear()

  return (
    <div
      className="relative p-3"
      style={{
        background: `linear-gradient(135deg, ${HADES.stoneLight}50, transparent)`,
        borderLeft: `3px solid ${HADES.goldBright}`,
      }}
    >
      <div className="flex justify-between items-start mb-1">
        <div>
          <h4 className="text-sm font-bold" style={{ color: HADES.textPrimary }}>
            {entry.title}
          </h4>
          <p className="text-xs" style={{ color: HADES.goldBright }}>
            {entry.organization}
          </p>
        </div>
        <span
          className="text-xs px-2 py-0.5"
          style={{
            background: `${HADES.zagRed}20`,
            border: `1px solid ${HADES.zagRed}40`,
            color: HADES.zagRedBright,
          }}
        >
          {startDisplay} - {endDisplay}
        </span>
      </div>

      <p className="text-xs mb-1" style={{ color: HADES.textSecondary }}>
        {entry.description}
      </p>

      {entry.highlights && entry.highlights.length > 0 && (
        <ul className="space-y-0.5 mt-2">
          {entry.highlights.map((highlight, i) => (
            <li key={i} className="text-xs flex items-start gap-1.5" style={{ color: HADES.textPrimary }}>
              <span style={{ color: HADES.goldBright }} aria-hidden="true">
                &#9670;
              </span>
              {highlight}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// =============================================================================
// PROJECT CARD
// =============================================================================
function ProjectCard({ project }: { project: typeof PROJECTS_DATA[0] }) {
  return (
    <div
      className="relative p-3 transition-all hover:translate-y-[-2px] group"
      style={{
        background: `linear-gradient(135deg, ${HADES.stoneLight}, ${HADES.stoneMid})`,
        border: `2px solid ${HADES.zagRed}50`,
      }}
    >
      <div className="flex justify-between items-start mb-1">
        <h3 className="text-sm font-bold" style={{ color: HADES.zagRedBright }}>
          {project.name}
        </h3>
        {project.featured && (
          <svg viewBox="0 0 16 20" className="w-3 h-4" aria-label="Featured project">
            <polygon points="8,0 16,5 16,15 8,20 0,15 0,5" fill={HADES.goldBright} />
          </svg>
        )}
      </div>

      <p className="text-xs mb-1" style={{ color: HADES.textSecondary }}>
        {project.tagline}
      </p>

      {project.impact && (
        <p className="text-xs mb-2 italic" style={{ color: HADES.styxMid }}>
          {project.impact}
        </p>
      )}

      <div className="flex gap-1 flex-wrap">
        {project.techStack.slice(0, 4).map((tech) => (
          <span
            key={tech}
            className="text-xs px-1.5 py-0.5"
            style={{
              background: `${HADES.zagRed}15`,
              border: `1px solid ${HADES.zagRed}30`,
              color: HADES.zagRedBright,
            }}
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{
          boxShadow: `inset 0 0 15px ${HADES.zagRed}20, 0 0 10px ${HADES.zagRed}15`,
        }}
        aria-hidden="true"
      />
    </div>
  )
}

// =============================================================================
// ART BREAK - Decorative divider with urns
// =============================================================================
function ArtBreak() {
  return (
    <div className="flex items-center justify-center gap-4 my-6" aria-hidden="true">
      <GreekUrn size={28} />
      <div className="flex items-center gap-2">
        <div className="w-16 h-px" style={{ background: `linear-gradient(90deg, transparent, ${HADES.goldBright})` }} />
        <Skull size={16} />
        <div className="w-16 h-px" style={{ background: `linear-gradient(90deg, ${HADES.goldBright}, transparent)` }} />
      </div>
      <GreekUrn size={28} />
    </div>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function MythicTheme() {
  const { theme } = useTheme()
  const { active, setActive, config } = useProfession()
  const [mounted, setMounted] = useState(false)
  const reducedMotion = usePrefersReducedMotion()

  const aboutData = ABOUT_DATA[active]
  const skills = getSkillsByProfession(active)
  const projects = PROJECTS_DATA.filter((p) => p.professions.includes(active) || p.featured)
  const experience = filterExperienceByProfession(EXPERIENCE_DATA, active)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const godColors = {
    engineer: HADES.styxBright,
    drummer: HADES.fireOrange,
    fighter: HADES.zagRedBright,
  }

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='%232a2a30'/%3E%3Crect x='0' y='0' width='38' height='38' fill='%23252528'/%3E%3Crect x='42' y='0' width='38' height='38' fill='%233d3d45'/%3E%3Crect x='0' y='42' width='38' height='38' fill='%233d3d45'/%3E%3Crect x='42' y='42' width='38' height='38' fill='%23252528'/%3E%3Cline x1='0' y1='40' x2='80' y2='40' stroke='%231a1a1c' stroke-width='4'/%3E%3Cline x1='40' y1='0' x2='40' y2='80' stroke='%231a1a1c' stroke-width='4'/%3E%3C/svg%3E")`,
        fontFamily: '"Cinzel", Georgia, serif',
      }}
      role="main"
      aria-label="Alexander Pulido - Portfolio"
    >
      <HadesPatterns />

      {/* Background effects */}
      <BloodSplatters />
      <StyxPools />
      <FloatingEmbers reducedMotion={reducedMotion} />
      <Vignette />

      {/* Greek columns */}
      <GreekColumn side="left" />
      <GreekColumn side="right" />

      {/* ========== HEADER ========== */}
      <header className="relative z-30 p-4 md:p-6 lg:px-20" role="banner">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              {/* Skull logo */}
              <Skull size={36} />
              <div>
                <h1
                  className="text-xl md:text-2xl tracking-[0.15em] uppercase"
                  style={{
                    color: HADES.goldBright,
                    textShadow: `0 0 20px ${HADES.goldBright}40, 0 2px 4px ${HADES.stoneDark}`,
                  }}
                >
                  Alexander Pulido
                </h1>
                <p className="text-xs tracking-widest uppercase" style={{ color: HADES.textPrimary }}>
                  {active === 'engineer' ? PROFESSIONAL_SUMMARY.headline : config.title}
                </p>
                <p className="text-xs tracking-wider italic mt-0.5" style={{ color: godColors[active] }}>
                  {active === 'engineer' ? PROFESSIONAL_SUMMARY.tagline : aboutData.headline}
                </p>
              </div>
            </div>

            <nav className="flex gap-2 items-center flex-wrap" aria-label="Main navigation">
              <Link
                href="/cv"
                className="px-3 py-1.5 text-xs tracking-wider uppercase transition-all hover:scale-105 relative group"
                style={{
                  background: 'transparent',
                  border: `2px solid ${HADES.goldBright}`,
                  color: HADES.goldBright,
                }}
              >
                <span className="relative z-10">Codex</span>
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: `${HADES.goldBright}15` }}
                />
              </Link>
              <Link
                href="/personal-projects/game-engine"
                className="px-3 py-1.5 text-xs tracking-wider uppercase transition-all hover:scale-105 relative overflow-hidden group"
                style={{
                  background: `linear-gradient(180deg, ${HADES.zagRedBright}, ${HADES.zagRed})`,
                  color: HADES.textPrimary,
                  boxShadow: `0 0 10px ${HADES.zagRed}60`,
                }}
              >
                <span className="relative z-10">Enter Tartarus</span>
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: `linear-gradient(180deg, ${HADES.fireOrange}, ${HADES.zagRedBright})` }}
                />
              </Link>
              <ThemeSwitcher />
            </nav>
          </div>
        </div>
      </header>

      {/* ========== BOON SELECTION ========== */}
      <section className="relative z-20 py-4" role="region" aria-label="Select profession">
        <div className="text-center mb-3">
          <span className="text-xs tracking-[0.25em] uppercase" style={{ color: HADES.goldBright }}>
            Choose Your Patron
          </span>
        </div>
        <div className="flex justify-center gap-4 md:gap-6" role="radiogroup" aria-label="Profession selection">
          {(['engineer', 'drummer', 'fighter'] as const).map((prof) => (
            <BoonSelector key={prof} profession={prof} isActive={active === prof} onClick={() => setActive(prof)} />
          ))}
        </div>
      </section>

      {/* ========== MAIN CONTENT ========== */}
      <main className="relative z-20 px-4 md:px-6 lg:px-20 py-6 pb-32">
        <div className="max-w-4xl mx-auto">
          {/* ===== ABOUT SECTION ===== */}
          <StoneTablet accentColor={godColors[active]} ariaLabel="About section" className="mb-6">
            <GreekMeander className="mb-4 max-w-xs mx-auto" />

            <SectionTitle>The Prince Speaks</SectionTitle>

            <p
              className="text-sm leading-relaxed italic max-w-2xl mx-auto text-center mb-4"
              style={{ color: HADES.textPrimary }}
            >
              &ldquo;{active === 'engineer' ? PROFESSIONAL_SUMMARY.bio : aboutData.bio}&rdquo;
            </p>

            {active === 'engineer' && PROFESSIONAL_SUMMARY.highlights && (
              <div className="flex justify-center gap-2 mt-3 flex-wrap">
                {PROFESSIONAL_SUMMARY.highlights.map((highlight, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-0.5"
                    style={{
                      background: `${HADES.styxBright}12`,
                      border: `1px solid ${HADES.styxBright}35`,
                      color: HADES.styxBright,
                    }}
                  >
                    {highlight}
                  </span>
                ))}
              </div>
            )}

            <div className="flex justify-center gap-2 mt-3 flex-wrap">
              {aboutData.quickFacts.map((fact, i) => (
                <span
                  key={i}
                  className="text-xs px-3 py-0.5"
                  style={{
                    background: `${HADES.zagRed}15`,
                    border: `1px solid ${HADES.zagRed}50`,
                    color: HADES.zagRedBright,
                  }}
                >
                  {fact}
                </span>
              ))}
            </div>

            <GreekMeander className="mt-4 max-w-xs mx-auto" />
          </StoneTablet>

          <ArtBreak />

          {/* ===== CURRENT ROLES (Engineer) ===== */}
          {active === 'engineer' && <CurrentRolesSection color={godColors[active]} />}

          {/* ===== COMPANIES (Engineer) ===== */}
          {active === 'engineer' && <CompaniesSection />}

          {/* ===== BANDS (Drummer) ===== */}
          {active === 'drummer' && <BandsSection />}

          <ArtBreak />

          {/* ===== EXPERIENCE ===== */}
          {experience.length > 0 && (
            <StoneTablet accentColor={HADES.goldBright} ariaLabel="Work experience" className="mb-6">
              <GreekMeander className="mb-4" />

              <SectionTitle>Trials Completed</SectionTitle>

              <div className="space-y-3">
                {experience.map((entry) => (
                  <ExperienceCard key={entry.id} entry={entry} />
                ))}
              </div>
            </StoneTablet>
          )}

          <ArtBreak />

          {/* ===== GRID: SKILLS + PROJECTS ===== */}
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            {/* Tech Stack / Skills */}
            <StoneTablet
              accentColor={godColors[active]}
              ariaLabel={active === 'engineer' ? 'Technology stack' : 'Skills and expertise'}
            >
              <SectionTitle color={godColors[active]}>
                {active === 'engineer' ? 'Arsenal' : 'Mastery'}
              </SectionTitle>

              {active === 'engineer' ? (
                <TechStackDisplay color={godColors[active]} />
              ) : (
                <AchievementDisplay profession={active} color={godColors[active]} />
              )}
            </StoneTablet>

            {/* Projects */}
            <div>
              <SectionTitle color={HADES.zagRedBright}>Legendary Deeds</SectionTitle>

              <div className="space-y-3">
                {projects.slice(0, 4).map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ========== FOOTER ========== */}
      <footer className="relative z-20 py-6 text-center pb-28" role="contentinfo">
        <GreekMeander className="max-w-xs mx-auto mb-3" />

        <p
          className="text-xs tracking-widest flex items-center justify-center gap-3"
          style={{ color: HADES.textSecondary }}
        >
          <span style={{ color: HADES.goldBright }} aria-hidden="true">
            &#9670;
          </span>
          Death Is Not The End
          <span style={{ color: HADES.goldBright }} aria-hidden="true">
            &#9670;
          </span>
          <span aria-label="Year 2026">MMXXVI</span>
          <span style={{ color: HADES.goldBright }} aria-hidden="true">
            &#9670;
          </span>
        </p>

        <GreekMeander className="max-w-xs mx-auto mt-3" />
      </footer>

      {/* ========== CSS ANIMATIONS ========== */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&display=swap');

        @keyframes ember-rise {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-100vh) scale(0.2);
          }
        }
        .animate-ember-rise {
          animation: ember-rise linear infinite;
        }

        @keyframes styx-glow {
          0%,
          100% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.8;
          }
        }
        .animate-styx-glow {
          animation: styx-glow 3s ease-in-out infinite;
        }

        @keyframes styx-ripple {
          0%,
          100% {
            opacity: 0.3;
            transform: scaleX(0.8);
          }
          50% {
            opacity: 0.7;
            transform: scaleX(1.2);
          }
        }
        .animate-styx-ripple {
          animation: styx-ripple 4s ease-in-out infinite;
        }

        @keyframes pool-pulse {
          0%,
          100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.1);
          }
        }
        .animate-pool-pulse {
          animation: pool-pulse 5s ease-in-out infinite;
        }

        @keyframes boon-pulse {
          0%,
          100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.05);
          }
        }
        .animate-boon-pulse {
          animation: boon-pulse 2s ease-in-out infinite;
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  )
}
