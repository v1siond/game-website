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
// GOD OF WAR COLOR PALETTE
// Authentic Norse style: frost blues, fire oranges, gold, stone grey
// =============================================================================
const GOW = {
  // FROST BLUE - Leviathan Axe (primary accent)
  frostBright: '#00CCFF',
  frostMid: '#66DDFF',
  frostDark: '#003366',
  frostDeep: '#001A33',
  frostGlow: '#00CCFF80',

  // FIRE ORANGE/RED - Blades of Chaos
  fireOrange: '#FF6600',
  fireBright: '#FF4400',
  fireYellow: '#FFAA00',
  fireDark: '#CC3300',
  fireGlow: '#FF440080',

  // GOLD - Divine elements, Norse ornaments
  goldBright: '#FFD700',
  goldMid: '#D4AF37',
  goldDark: '#8B6914',
  goldGlow: '#FFD70060',

  // STONE GREY - Nordic carved stone
  stoneDark: '#1A1A1A',
  stoneMid: '#333333',
  stoneLight: '#4A4A4A',
  stoneAccent: '#666666',

  // BLOOD RED - Kratos's tattoo, rage
  bloodDark: '#660000',
  bloodMid: '#8B0000',
  bloodBright: '#AA0000',
  kratosTattoo: '#CC2222',

  // SNOW WHITE - Fimbulwinter
  snowWhite: '#F0F8FF',
  snowMid: '#E8E8E8',
  snowDark: '#C8C8C8',

  // BIFROST - Realm travel rainbow
  bifrostPurple: '#9933FF',
  bifrostGreen: '#33FF99',
  bifrostYellow: '#FFFF33',
  bifrostOrange: '#FF9933',

  // BACKGROUNDS
  bgDarkest: '#0D0D0D',
  bgDark: '#1A1A1A',

  // TEXT - WCAG AA compliant on dark backgrounds
  textPrimary: '#F0F8FF',    // Snow white - 15.5:1 on #1A1A1A
  textSecondary: '#B8C4CE',  // Muted blue-grey - 8.7:1 on #1A1A1A
  textMuted: '#8899AA',      // Dimmed - 5.2:1 on #1A1A1A
}

// =============================================================================
// SVG PATTERNS - Norse runes, knot patterns, frost/fire
// =============================================================================
function NorsePatterns() {
  return (
    <svg className="absolute w-0 h-0" aria-hidden="true">
      <defs>
        {/* Norse knot pattern */}
        <pattern id="norseKnot" patternUnits="userSpaceOnUse" width="60" height="60">
          <rect width="60" height="60" fill="transparent" />
          <path
            d="M10 10 Q30 0 50 10 Q60 30 50 50 Q30 60 10 50 Q0 30 10 10"
            fill="none"
            stroke={GOW.goldDark}
            strokeWidth="1"
            opacity="0.15"
          />
          <circle cx="30" cy="30" r="8" fill="none" stroke={GOW.goldDark} strokeWidth="0.5" opacity="0.1" />
        </pattern>

        {/* Frost gradient */}
        <linearGradient id="frostGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={GOW.frostBright} stopOpacity="0.8" />
          <stop offset="50%" stopColor={GOW.frostMid} stopOpacity="0.5" />
          <stop offset="100%" stopColor={GOW.frostDark} stopOpacity="0.3" />
        </linearGradient>

        {/* Fire gradient */}
        <linearGradient id="fireGrad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor={GOW.fireDark} />
          <stop offset="40%" stopColor={GOW.fireOrange} />
          <stop offset="100%" stopColor={GOW.fireYellow} />
        </linearGradient>

        {/* Bifrost gradient */}
        <linearGradient id="bifrostGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={GOW.frostBright} />
          <stop offset="25%" stopColor={GOW.bifrostGreen} />
          <stop offset="50%" stopColor={GOW.bifrostYellow} />
          <stop offset="75%" stopColor={GOW.bifrostOrange} />
          <stop offset="100%" stopColor={GOW.bifrostPurple} />
        </linearGradient>

        {/* Stone texture */}
        <filter id="stoneTexture">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
          <feDiffuseLighting in="noise" lightingColor={GOW.stoneLight} surfaceScale="1.5">
            <feDistantLight azimuth="45" elevation="60" />
          </feDiffuseLighting>
        </filter>

        {/* Glow filter */}
        <filter id="frostGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="fireGlowFilter" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  )
}

// =============================================================================
// NORSE RUNE BORDER - Elder Futhark inspired
// =============================================================================
function RuneBorder({ className = '', color = GOW.goldMid }: { className?: string; color?: string }) {
  // Simplified Elder Futhark-inspired rune shapes
  const runes = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ', 'ᛈ', 'ᛇ', 'ᛉ', 'ᛋ']

  return (
    <div
      className={`w-full h-6 flex items-center justify-center gap-3 overflow-hidden ${className}`}
      style={{ filter: `drop-shadow(0 0 4px ${color}40)` }}
      role="presentation"
      aria-hidden="true"
    >
      <div className="w-12 h-px" style={{ background: `linear-gradient(90deg, transparent, ${color})` }} />
      {runes.slice(0, 8).map((rune, i) => (
        <span
          key={i}
          className="text-xs opacity-60"
          style={{ color, fontFamily: 'serif' }}
        >
          {rune}
        </span>
      ))}
      <div className="w-12 h-px" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
    </div>
  )
}

// =============================================================================
// LEVIATHAN AXE - Frost decoration
// =============================================================================
function LeviathanAxe({ size = 40, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 48"
      width={size * 0.5}
      height={size}
      className={className}
      style={{ filter: `drop-shadow(0 0 8px ${GOW.frostGlow})` }}
      aria-hidden="true"
    >
      {/* Axe head */}
      <path
        d="M4 8 L12 4 L20 8 L20 16 L16 20 L12 18 L8 20 L4 16 Z"
        fill={GOW.stoneLight}
        stroke={GOW.frostBright}
        strokeWidth="1"
      />
      {/* Frost glow on blade */}
      <path
        d="M6 10 L12 6 L18 10 L18 14 L14 17 L12 16 L10 17 L6 14 Z"
        fill={GOW.frostBright}
        opacity="0.4"
      />
      {/* Handle */}
      <rect x="10" y="18" width="4" height="26" fill={GOW.goldDark} />
      <rect x="11" y="20" width="2" height="22" fill={GOW.goldMid} />
      {/* Rune inscriptions on blade */}
      <text x="12" y="12" textAnchor="middle" fill={GOW.frostBright} fontSize="4" fontFamily="serif">ᚠ</text>
      {/* Pommel */}
      <ellipse cx="12" cy="45" rx="3" ry="2" fill={GOW.goldMid} />
    </svg>
  )
}

// =============================================================================
// BLADES OF CHAOS - Fire decoration
// =============================================================================
function BladesOfChaos({ size = 32, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 48 24"
      width={size * 1.5}
      height={size * 0.75}
      className={className}
      style={{ filter: `drop-shadow(0 0 6px ${GOW.fireGlow})` }}
      aria-hidden="true"
    >
      {/* Left blade */}
      <path
        d="M4 12 L16 6 L20 12 L16 18 Z"
        fill={GOW.stoneLight}
        stroke={GOW.fireOrange}
        strokeWidth="0.5"
      />
      <path d="M6 12 L14 8 L17 12 L14 16 Z" fill={GOW.fireOrange} opacity="0.5" />

      {/* Right blade */}
      <path
        d="M44 12 L32 6 L28 12 L32 18 Z"
        fill={GOW.stoneLight}
        stroke={GOW.fireOrange}
        strokeWidth="0.5"
      />
      <path d="M42 12 L34 8 L31 12 L34 16 Z" fill={GOW.fireOrange} opacity="0.5" />

      {/* Chains */}
      <path
        d="M20 12 Q24 10 28 12"
        fill="none"
        stroke={GOW.goldDark}
        strokeWidth="1.5"
        strokeDasharray="2 1"
      />
      <path
        d="M20 12 Q24 14 28 12"
        fill="none"
        stroke={GOW.goldDark}
        strokeWidth="1.5"
        strokeDasharray="2 1"
      />
    </svg>
  )
}

// =============================================================================
// WORLD SERPENT - Jormungandr motif
// =============================================================================
function WorldSerpent({ size = 60, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 100 40"
      width={size * 2.5}
      height={size}
      className={className}
      aria-hidden="true"
    >
      {/* Serpent body - coiled */}
      <path
        d="M10 20 Q20 5 35 15 Q50 25 65 15 Q80 5 90 20"
        fill="none"
        stroke={GOW.frostMid}
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.6"
      />
      {/* Scales pattern */}
      <path
        d="M15 18 Q25 8 35 15 M40 18 Q50 28 60 18 M70 15 Q80 8 88 18"
        fill="none"
        stroke={GOW.frostBright}
        strokeWidth="1"
        opacity="0.4"
      />
      {/* Head */}
      <circle cx="10" cy="20" r="5" fill={GOW.frostMid} />
      <circle cx="8" cy="18" r="1.5" fill={GOW.frostBright} />
      {/* Tail */}
      <path d="M90 20 L98 18 L98 22 Z" fill={GOW.frostMid} />
    </svg>
  )
}

// =============================================================================
// KRATOS SILHOUETTE - Header decoration
// =============================================================================
function KratosSilhouette({ size = 48 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 32 40"
      width={size * 0.8}
      height={size}
      aria-hidden="true"
    >
      {/* Bald head */}
      <ellipse cx="16" cy="10" rx="8" ry="9" fill={GOW.stoneLight} />
      {/* Red tattoo stripe */}
      <path
        d="M8 6 Q10 10 8 16"
        fill="none"
        stroke={GOW.kratosTattoo}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Beard */}
      <path
        d="M10 14 Q16 22 22 14"
        fill={GOW.stoneMid}
      />
      {/* Eyes (fierce) */}
      <ellipse cx="12" cy="9" rx="1.5" ry="1" fill={GOW.snowWhite} />
      <ellipse cx="20" cy="9" rx="1.5" ry="1" fill={GOW.snowWhite} />
      {/* Shoulders */}
      <path
        d="M8 18 L4 28 L16 26 L28 28 L24 18"
        fill={GOW.stoneLight}
      />
      {/* Red war paint on shoulder */}
      <path
        d="M6 20 L8 28"
        fill="none"
        stroke={GOW.kratosTattoo}
        strokeWidth="1.5"
      />
    </svg>
  )
}

// =============================================================================
// NORDIC PILLAR - Side decorations
// =============================================================================
function NordicPillar({ side }: { side: 'left' | 'right' }) {
  return (
    <div
      className={`fixed top-0 bottom-0 w-10 md:w-14 pointer-events-none z-10 hidden lg:block ${
        side === 'left' ? 'left-0' : 'right-0'
      }`}
      aria-hidden="true"
    >
      {/* Stone pillar */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(90deg,
            ${side === 'left' ? GOW.stoneMid : GOW.stoneDark},
            ${GOW.stoneDark},
            ${side === 'left' ? GOW.stoneDark : GOW.stoneMid}
          )`,
        }}
      >
        {/* Carved runes running down */}
        <div className="absolute top-20 bottom-32 left-1/2 -translate-x-1/2 w-px flex flex-col items-center gap-8">
          {['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ'].map((rune, i) => (
            <span
              key={i}
              className="text-sm opacity-30"
              style={{ color: GOW.goldMid, textShadow: `0 0 4px ${GOW.goldGlow}` }}
            >
              {rune}
            </span>
          ))}
        </div>
      </div>

      {/* Top ornament - knot pattern */}
      <div
        className="absolute top-0 left-0 right-0 h-16"
        style={{
          background: `linear-gradient(180deg, ${GOW.goldDark}, ${GOW.stoneDark})`,
        }}
      >
        <svg className="w-full h-full" viewBox="0 0 20 30" preserveAspectRatio="none">
          <path
            d="M0 0 L10 8 L20 0 L20 20 Q10 30 0 20 Z"
            fill={GOW.goldDark}
            opacity="0.8"
          />
          <path
            d="M5 5 L10 10 L15 5"
            fill="none"
            stroke={GOW.goldBright}
            strokeWidth="0.5"
          />
        </svg>
      </div>

      {/* Frost glow effect */}
      <div
        className="absolute top-1/4 left-0 right-0 h-32 animate-pillar-frost"
        style={{
          background: `radial-gradient(ellipse at center, ${GOW.frostBright}15, transparent)`,
        }}
      />

      {/* Fire glow effect */}
      <div
        className="absolute top-2/3 left-0 right-0 h-32 animate-pillar-fire"
        style={{
          background: `radial-gradient(ellipse at center, ${GOW.fireOrange}15, transparent)`,
        }}
      />
    </div>
  )
}

// =============================================================================
// FROST PARTICLES - Leviathan Axe effect
// =============================================================================
function FrostParticles({ reducedMotion }: { reducedMotion: boolean }) {
  if (reducedMotion) return null

  const particles = [
    { left: '5%', delay: '0s', duration: '8s', size: 3 },
    { left: '15%', delay: '1s', duration: '7s', size: 4 },
    { left: '25%', delay: '2s', duration: '9s', size: 3 },
    { left: '35%', delay: '0.5s', duration: '8s', size: 5 },
    { left: '45%', delay: '1.5s', duration: '7s', size: 3 },
    { left: '55%', delay: '2.5s', duration: '9s', size: 4 },
    { left: '65%', delay: '0.8s', duration: '8s', size: 3 },
    { left: '75%', delay: '1.8s', duration: '7s', size: 5 },
    { left: '85%', delay: '0.3s', duration: '9s', size: 4 },
    { left: '95%', delay: '2.2s', duration: '8s', size: 3 },
  ]

  return (
    <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden" aria-hidden="true">
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute top-0 rounded-full animate-frost-fall"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            background: GOW.frostBright,
            boxShadow: `0 0 ${p.size * 2}px ${GOW.frostBright}`,
            animationDelay: p.delay,
            animationDuration: p.duration,
            opacity: 0.6,
          }}
        />
      ))}
    </div>
  )
}

// =============================================================================
// FIRE EMBERS - Blades of Chaos effect (bottom)
// =============================================================================
function FireEmbers({ reducedMotion }: { reducedMotion: boolean }) {
  if (reducedMotion) return null

  const embers = [
    { left: '10%', delay: '0s', duration: '6s', size: 4 },
    { left: '20%', delay: '1.2s', duration: '5s', size: 3 },
    { left: '30%', delay: '0.5s', duration: '7s', size: 5 },
    { left: '50%', delay: '2s', duration: '5.5s', size: 3 },
    { left: '60%', delay: '0.8s', duration: '6.5s', size: 4 },
    { left: '70%', delay: '1.5s', duration: '5s', size: 3 },
    { left: '80%', delay: '2.5s', duration: '7s', size: 5 },
    { left: '90%', delay: '0.3s', duration: '6s', size: 4 },
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
            background: i % 2 === 0 ? GOW.fireOrange : GOW.fireYellow,
            boxShadow: `0 0 ${ember.size * 3}px ${i % 2 === 0 ? GOW.fireOrange : GOW.fireYellow}`,
            animationDelay: ember.delay,
            animationDuration: ember.duration,
          }}
        />
      ))}
    </div>
  )
}

// =============================================================================
// BIFROST EDGE - Rainbow realm travel effect
// =============================================================================
function BifrostEdge() {
  return (
    <>
      {/* Bottom bifrost glow */}
      <div
        className="fixed bottom-0 left-0 right-0 h-20 pointer-events-none z-[4]"
        aria-hidden="true"
      >
        <div
          className="absolute inset-0 animate-bifrost-pulse"
          style={{
            background: `linear-gradient(180deg,
              transparent 0%,
              ${GOW.bgDark}80 40%,
              ${GOW.frostDark}60 70%,
              ${GOW.frostMid}40 100%
            )`,
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-2"
          style={{
            background: `linear-gradient(90deg,
              ${GOW.frostBright},
              ${GOW.bifrostGreen},
              ${GOW.bifrostYellow},
              ${GOW.bifrostOrange},
              ${GOW.bifrostPurple},
              ${GOW.frostBright}
            )`,
            filter: 'blur(4px)',
            opacity: 0.6,
          }}
        />
      </div>
    </>
  )
}

// =============================================================================
// VIGNETTE - Dark edges with frost/fire hints
// =============================================================================
function Vignette() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[6]"
      style={{
        background: `
          radial-gradient(ellipse at 50% 50%, transparent 40%, ${GOW.bgDarkest}95 100%),
          radial-gradient(ellipse at 0% 50%, ${GOW.frostDark}20 0%, transparent 30%),
          radial-gradient(ellipse at 100% 50%, ${GOW.fireDark}20 0%, transparent 30%)
        `,
      }}
      aria-hidden="true"
    />
  )
}

// =============================================================================
// STONE TABLET - Section card with Norse styling
// =============================================================================
function StoneTablet({
  children,
  accentColor = GOW.goldMid,
  variant = 'default',
  className = '',
  ariaLabel,
}: {
  children: React.ReactNode
  accentColor?: string
  variant?: 'default' | 'frost' | 'fire'
  className?: string
  ariaLabel?: string
}) {
  const borderColor = variant === 'frost' ? GOW.frostBright : variant === 'fire' ? GOW.fireOrange : GOW.goldMid
  const glowColor = variant === 'frost' ? GOW.frostGlow : variant === 'fire' ? GOW.fireGlow : GOW.goldGlow

  return (
    <section
      className={`relative p-6 ${className}`}
      style={{
        background: `linear-gradient(135deg, ${GOW.stoneMid} 0%, ${GOW.stoneDark} 50%, ${GOW.bgDark} 100%)`,
        boxShadow: `
          inset 0 1px 0 ${GOW.stoneLight}40,
          inset 0 -1px 0 ${GOW.bgDarkest},
          0 0 30px ${glowColor},
          0 8px 20px ${GOW.bgDarkest}80
        `,
        border: `2px solid ${borderColor}30`,
      }}
      role="region"
      aria-label={ariaLabel}
    >
      {/* Corner ornaments - Nordic knot */}
      {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((pos, i) => (
        <div
          key={i}
          className={`absolute ${pos} w-6 h-6`}
          style={{
            borderTop: pos.includes('top') ? `2px solid ${borderColor}` : 'none',
            borderBottom: pos.includes('bottom') ? `2px solid ${borderColor}` : 'none',
            borderLeft: pos.includes('left') ? `2px solid ${borderColor}` : 'none',
            borderRight: pos.includes('right') ? `2px solid ${borderColor}` : 'none',
          }}
        />
      ))}

      {/* Rune inscriptions at top */}
      <RuneBorder color={borderColor} className="absolute -top-3 left-8 right-8" />

      {/* Subtle glow underneath */}
      <div
        className="absolute -bottom-1 left-12 right-12 h-1 rounded-full"
        style={{
          background: borderColor,
          filter: 'blur(6px)',
          opacity: 0.4,
        }}
        aria-hidden="true"
      />

      <div className="relative z-10">{children}</div>
    </section>
  )
}

// =============================================================================
// SECTION TITLE - Gold with axe/blade icon
// =============================================================================
function SectionTitle({
  children,
  color = GOW.goldBright,
  icon = 'axe',
}: {
  children: React.ReactNode
  color?: string
  icon?: 'axe' | 'blade' | 'rune'
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
      {icon === 'axe' && (
        <svg viewBox="0 0 16 20" className="w-4 h-5" aria-hidden="true">
          <path d="M4 4 L8 2 L12 4 L12 8 L10 10 L8 9 L6 10 L4 8 Z" fill={GOW.frostBright} />
          <rect x="7" y="9" width="2" height="10" fill={GOW.goldDark} />
        </svg>
      )}
      {icon === 'blade' && (
        <svg viewBox="0 0 20 16" className="w-5 h-4" aria-hidden="true">
          <path d="M2 8 L10 4 L18 8 L10 12 Z" fill={GOW.fireOrange} />
        </svg>
      )}
      {icon === 'rune' && (
        <span className="text-base" style={{ color, fontFamily: 'serif' }}>ᚱ</span>
      )}
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
// REALM SELECTOR - Profession selection (Bifrost style)
// =============================================================================
function RealmSelector({
  profession,
  isActive,
  onClick,
}: {
  profession: 'engineer' | 'drummer' | 'fighter'
  isActive: boolean
  onClick: () => void
}) {
  const realms = {
    engineer: {
      name: 'SYSTEM ENGINEER',
      color: GOW.frostBright,
      title: 'Senior Staff • CTO',
      icon: 'ᛗ', // Mannaz rune
    },
    drummer: {
      name: 'MUSICIAN',
      color: GOW.fireOrange,
      title: 'Professional Drummer',
      icon: 'ᛉ', // Algiz rune
    },
    fighter: {
      name: 'MARTIAL ARTIST',
      color: GOW.bloodBright,
      title: 'BJJ Instructor',
      icon: 'ᛏ', // Tiwaz rune
    },
  }
  const realm = realms[profession]

  return (
    <button
      onClick={onClick}
      className={`relative transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
        isActive ? 'scale-110 z-10' : 'opacity-60 hover:opacity-90 hover:scale-105'
      }`}
      style={{ '--ring-color': realm.color } as React.CSSProperties}
      aria-pressed={isActive}
      aria-label={`Select ${realm.name} - ${realm.title}`}
    >
      <div
        className="relative w-20 h-24 md:w-24 md:h-28 flex flex-col items-center justify-center"
        style={{
          background: isActive
            ? `linear-gradient(180deg, ${realm.color}20, ${GOW.bgDark})`
            : `linear-gradient(180deg, ${GOW.stoneMid}, ${GOW.stoneDark})`,
          border: `2px solid ${isActive ? realm.color : GOW.stoneLight}`,
          boxShadow: isActive ? `0 0 20px ${realm.color}60, inset 0 0 20px ${realm.color}20` : 'none',
          clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
        }}
      >
        {/* Rune icon */}
        <span
          className="text-2xl md:text-3xl mb-1"
          style={{
            color: isActive ? realm.color : GOW.textSecondary,
            textShadow: isActive ? `0 0 10px ${realm.color}` : 'none',
            fontFamily: 'serif',
          }}
        >
          {realm.icon}
        </span>

        {/* Realm name */}
        <span
          className="text-xs font-bold tracking-wider"
          style={{ color: isActive ? realm.color : GOW.textSecondary }}
        >
          {realm.name}
        </span>

        {/* Title */}
        <span
          className="text-xs opacity-70 mt-0.5"
          style={{ color: GOW.textMuted, fontSize: '0.6rem' }}
        >
          {realm.title}
        </span>
      </div>

      {/* Active glow ring */}
      {isActive && (
        <div
          className="absolute inset-0 animate-realm-pulse pointer-events-none"
          style={{
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            border: `2px solid ${realm.color}`,
            filter: 'blur(2px)',
          }}
        />
      )}
    </button>
  )
}

// =============================================================================
// TECH STACK DISPLAY - Rune-tagged skills
// =============================================================================
function TechStackDisplay({ color }: { color: string }) {
  return (
    <div className="space-y-4" role="list" aria-label="Technology expertise">
      {TECH_STACK.map((category) => (
        <div key={category.name}>
          <h3
            className="text-xs tracking-widest mb-2 pb-1 border-b flex items-center gap-2 uppercase"
            style={{
              color: GOW.goldBright,
              borderColor: `${GOW.goldBright}30`,
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
                  background: `${color}12`,
                  border: `1px solid ${color}35`,
                  color: GOW.textPrimary,
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
// ACHIEVEMENT DISPLAY - For drummer/fighter
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
              color: GOW.goldBright,
              borderColor: `${GOW.goldBright}30`,
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
                <span className="text-sm mt-0.5" style={{ color }} aria-hidden="true">ᚱ</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-medium" style={{ color: GOW.textPrimary }}>
                      {achievement.title}
                    </span>
                    {achievement.metric && (
                      <span className="text-xs" style={{ color }}>
                        {achievement.metric}
                      </span>
                    )}
                  </div>
                  {achievement.description && (
                    <p className="text-xs mt-0.5" style={{ color: GOW.textSecondary }}>
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
    <StoneTablet accentColor={color} variant="frost" ariaLabel="Current professional roles" className="mb-6">
      <SectionTitle icon="axe">Current Positions</SectionTitle>

      <div className="grid gap-3">
        {CURRENT_ROLES.map((role) => (
          <div
            key={role.id}
            className="p-3 transition-all hover:translate-x-1"
            style={{
              background: `linear-gradient(90deg, ${GOW.stoneMid}60, transparent)`,
              borderLeft: `3px solid ${role.type === 'leadership' ? GOW.goldBright : color}`,
            }}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-bold" style={{ color: GOW.textPrimary }}>
                  {role.title}
                </h3>
                <p
                  className="text-xs"
                  style={{ color: role.type === 'leadership' ? GOW.goldBright : color }}
                >
                  {role.company}
                </p>
              </div>
              {role.type === 'leadership' && (
                <span
                  className="text-xs px-2 py-0.5 tracking-wider uppercase"
                  style={{
                    background: `${GOW.goldBright}15`,
                    border: `1px solid ${GOW.goldBright}40`,
                    color: GOW.goldBright,
                  }}
                >
                  Leadership
                </span>
              )}
            </div>
            <p className="text-xs mt-1" style={{ color: GOW.textSecondary }}>
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
    <StoneTablet accentColor={GOW.bifrostPurple} ariaLabel="Companies and ventures" className="mb-6">
      <SectionTitle color={GOW.bifrostPurple} icon="rune">Ventures & Companies</SectionTitle>

      <div className="grid gap-3">
        {COMPANIES.map((company) => (
          <a
            key={company.id}
            href={company.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 transition-all group hover:translate-x-1"
            style={{
              background: `linear-gradient(135deg, ${GOW.stoneMid}60, transparent)`,
              border: `1px solid ${GOW.bifrostPurple}30`,
            }}
            aria-label={`${company.name} - ${company.tagline}`}
          >
            <div className="flex justify-between items-start mb-1">
              <div className="flex items-center gap-2">
                <span className="text-base">{company.icon}</span>
                <div>
                  <h3 className="text-sm font-bold" style={{ color: GOW.textPrimary }}>
                    {company.name}
                  </h3>
                  <p className="text-xs" style={{ color: GOW.bifrostPurple }}>
                    {company.tagline}
                  </p>
                </div>
              </div>
              <svg
                viewBox="0 0 16 16"
                className="w-3 h-3 opacity-40 group-hover:opacity-100 transition-opacity"
                aria-hidden="true"
              >
                <path d="M4 12L12 4M12 4H6M12 4v6" fill="none" stroke={GOW.bifrostPurple} strokeWidth="2" />
              </svg>
            </div>
            <p className="text-xs mb-2" style={{ color: GOW.textSecondary }}>
              {company.description}
            </p>
            <div className="flex flex-wrap gap-1">
              {company.services.map((service) => (
                <span
                  key={service}
                  className="text-xs px-1.5 py-0.5"
                  style={{
                    background: `${GOW.bifrostPurple}10`,
                    border: `1px solid ${GOW.bifrostPurple}25`,
                    color: GOW.textSecondary,
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
// BANDS SECTION - Musical projects (Fire themed)
// =============================================================================
function BandsSection() {
  return (
    <StoneTablet accentColor={GOW.fireOrange} variant="fire" ariaLabel="Musical projects and bands" className="mb-6">
      <SectionTitle color={GOW.fireOrange} icon="blade">Musical Projects</SectionTitle>

      <div className="grid gap-3">
        {BANDS.map((band) => (
          <div
            key={band.id}
            className="p-3 transition-all hover:translate-x-1"
            style={{
              background: `linear-gradient(135deg, ${GOW.stoneMid}60, transparent)`,
              border: `1px solid ${GOW.fireOrange}30`,
            }}
          >
            <div className="flex justify-between items-start mb-1">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold" style={{ color: GOW.textPrimary }}>
                    {band.name}
                  </h3>
                  {band.active && (
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{
                        background: GOW.fireYellow,
                        boxShadow: `0 0 6px ${GOW.fireYellow}`,
                      }}
                      aria-label="Currently active"
                    />
                  )}
                </div>
                <p className="text-xs" style={{ color: GOW.fireOrange }}>
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
                    <path d="M4 12L12 4M12 4H6M12 4v6" fill="none" stroke={GOW.fireOrange} strokeWidth="2" />
                  </svg>
                </a>
              )}
            </div>
            <p className="text-xs" style={{ color: GOW.textSecondary }}>
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
function ExperienceCard({ entry, color }: { entry: typeof EXPERIENCE_DATA[0]; color: string }) {
  const endDisplay = entry.endDate ? new Date(entry.endDate).getFullYear() : 'Present'
  const startDisplay = new Date(entry.startDate).getFullYear()

  return (
    <div
      className="relative p-3"
      style={{
        background: `linear-gradient(135deg, ${GOW.stoneMid}50, transparent)`,
        borderLeft: `3px solid ${color}`,
      }}
    >
      <div className="flex justify-between items-start mb-1">
        <div>
          <h4 className="text-sm font-bold" style={{ color: GOW.textPrimary }}>
            {entry.title}
          </h4>
          <p className="text-xs" style={{ color }}>
            {entry.organization}
          </p>
        </div>
        <span
          className="text-xs px-2 py-0.5"
          style={{
            background: `${color}20`,
            border: `1px solid ${color}40`,
            color,
          }}
        >
          {startDisplay} - {endDisplay}
        </span>
      </div>

      <p className="text-xs mb-1" style={{ color: GOW.textSecondary }}>
        {entry.description}
      </p>

      {entry.highlights && entry.highlights.length > 0 && (
        <ul className="space-y-0.5 mt-2">
          {entry.highlights.map((highlight, i) => (
            <li key={i} className="text-xs flex items-start gap-1.5" style={{ color: GOW.textPrimary }}>
              <span style={{ color }} aria-hidden="true">ᚱ</span>
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
function ProjectCard({ project, color }: { project: typeof PROJECTS_DATA[0]; color: string }) {
  return (
    <div
      className="relative p-3 transition-all hover:translate-y-[-2px] group"
      style={{
        background: `linear-gradient(135deg, ${GOW.stoneMid}, ${GOW.stoneDark})`,
        border: `2px solid ${color}40`,
      }}
    >
      <div className="flex justify-between items-start mb-1">
        <h3 className="text-sm font-bold" style={{ color }}>
          {project.name}
        </h3>
        {project.featured && (
          <svg viewBox="0 0 16 20" className="w-3 h-4" aria-label="Featured project">
            <path d="M8 2 L14 6 L14 14 L8 18 L2 14 L2 6 Z" fill={GOW.goldBright} />
            <text x="8" y="12" textAnchor="middle" fill={GOW.bgDark} fontSize="6" fontFamily="serif">ᚠ</text>
          </svg>
        )}
      </div>

      <p className="text-xs mb-1" style={{ color: GOW.textSecondary }}>
        {project.tagline}
      </p>

      {project.impact && (
        <p className="text-xs mb-2 italic" style={{ color: GOW.frostMid }}>
          {project.impact}
        </p>
      )}

      <div className="flex gap-1 flex-wrap">
        {project.techStack.slice(0, 4).map((tech) => (
          <span
            key={tech}
            className="text-xs px-1.5 py-0.5"
            style={{
              background: `${color}15`,
              border: `1px solid ${color}30`,
              color,
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
          boxShadow: `inset 0 0 15px ${color}20, 0 0 10px ${color}15`,
        }}
        aria-hidden="true"
      />
    </div>
  )
}

// =============================================================================
// ART BREAK - Decorative divider with World Serpent
// =============================================================================
function ArtBreak({ variant = 'serpent' }: { variant?: 'serpent' | 'weapons' | 'bifrost' }) {
  return (
    <div className="flex items-center justify-center gap-4 my-8 py-4" aria-hidden="true">
      {variant === 'serpent' && (
        <>
          <LeviathanAxe size={32} />
          <WorldSerpent size={40} />
          <BladesOfChaos size={28} />
        </>
      )}
      {variant === 'weapons' && (
        <>
          <LeviathanAxe size={36} />
          <div className="flex items-center gap-2">
            <div className="w-16 h-px" style={{ background: `linear-gradient(90deg, transparent, ${GOW.goldBright})` }} />
            <span className="text-lg" style={{ color: GOW.goldBright, fontFamily: 'serif' }}>ᚠ</span>
            <div className="w-16 h-px" style={{ background: `linear-gradient(90deg, ${GOW.goldBright}, transparent)` }} />
          </div>
          <BladesOfChaos size={36} />
        </>
      )}
      {variant === 'bifrost' && (
        <div
          className="w-full max-w-md h-1 rounded-full"
          style={{
            background: `linear-gradient(90deg,
              transparent,
              ${GOW.frostBright},
              ${GOW.bifrostGreen},
              ${GOW.bifrostYellow},
              ${GOW.bifrostOrange},
              ${GOW.bifrostPurple},
              transparent
            )`,
            filter: 'blur(1px)',
          }}
        />
      )}
    </div>
  )
}

// =============================================================================
// POSTS SECTION - Blog/content placeholder
// =============================================================================
function PostsSection() {
  const posts = [
    {
      id: 'building-with-elixir',
      title: 'Building Enterprise Systems with Elixir',
      excerpt: 'Lessons learned from scaling Phoenix applications to handle millions of transactions.',
      date: '2026-04',
    },
    {
      id: 'kubernetes-patterns',
      title: 'Kubernetes Patterns for Production',
      excerpt: 'Real-world deployment strategies and GitOps workflows.',
      date: '2026-03',
    },
  ]

  return (
    <StoneTablet accentColor={GOW.frostMid} variant="frost" ariaLabel="Recent posts" className="mb-6">
      <SectionTitle color={GOW.frostMid} icon="rune">Wisdom Shared</SectionTitle>

      <div className="grid gap-3">
        {posts.map((post) => (
          <div
            key={post.id}
            className="p-3 transition-all hover:translate-x-1"
            style={{
              background: `linear-gradient(90deg, ${GOW.stoneMid}40, transparent)`,
              borderLeft: `2px solid ${GOW.frostMid}`,
            }}
          >
            <h4 className="text-sm font-medium mb-1" style={{ color: GOW.textPrimary }}>
              {post.title}
            </h4>
            <p className="text-xs mb-1" style={{ color: GOW.textSecondary }}>
              {post.excerpt}
            </p>
            <span className="text-xs" style={{ color: GOW.textMuted }}>
              {post.date}
            </span>
          </div>
        ))}
      </div>
    </StoneTablet>
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

  const realmColors = {
    engineer: GOW.frostBright,
    drummer: GOW.fireOrange,
    fighter: GOW.bloodBright,
  }

  const currentColor = realmColors[active]

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: `
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Crect width='60' height='60' fill='%231A1A1A'/%3E%3Cpath d='M10 10 Q30 0 50 10 Q60 30 50 50 Q30 60 10 50 Q0 30 10 10' fill='none' stroke='%23333' stroke-width='0.5' opacity='0.3'/%3E%3C/svg%3E"),
          linear-gradient(180deg, ${GOW.bgDarkest} 0%, ${GOW.bgDark} 50%, ${GOW.stoneDark} 100%)
        `,
        fontFamily: '"Cinzel", Georgia, serif',
      }}
      role="main"
      aria-label="Alexander Pulido - Portfolio"
    >
      <NorsePatterns />

      {/* Background effects */}
      <FrostParticles reducedMotion={reducedMotion} />
      <FireEmbers reducedMotion={reducedMotion} />
      <BifrostEdge />
      <Vignette />

      {/* Nordic pillars */}
      <NordicPillar side="left" />
      <NordicPillar side="right" />

      {/* ========== HEADER ========== */}
      <header className="relative z-30 p-4 md:p-6 lg:px-20" role="banner">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              {/* Kratos silhouette */}
              <KratosSilhouette size={48} />
              <div>
                <h1
                  className="text-xl md:text-2xl tracking-[0.12em] uppercase"
                  style={{
                    color: GOW.goldBright,
                    textShadow: `0 0 20px ${GOW.goldGlow}, 0 2px 4px ${GOW.bgDarkest}`,
                  }}
                >
                  Alexander Pulido
                </h1>
                <p className="text-xs tracking-widest uppercase" style={{ color: GOW.textPrimary }}>
                  {active === 'engineer' ? PROFESSIONAL_SUMMARY.headline : config.title}
                </p>
                <p className="text-xs tracking-wider italic mt-0.5" style={{ color: currentColor }}>
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
                  border: `2px solid ${GOW.goldBright}`,
                  color: GOW.goldBright,
                }}
              >
                <span className="relative z-10">Codex</span>
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: `${GOW.goldBright}15` }}
                />
              </Link>
              <Link
                href="/personal-projects/game-engine"
                className="px-3 py-1.5 text-xs tracking-wider uppercase transition-all hover:scale-105 relative overflow-hidden group"
                style={{
                  background: `linear-gradient(180deg, ${GOW.frostBright}, ${GOW.frostDark})`,
                  color: GOW.bgDark,
                  boxShadow: `0 0 10px ${GOW.frostGlow}`,
                }}
              >
                <span className="relative z-10 font-bold">Enter Midgard</span>
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: `linear-gradient(180deg, ${GOW.frostMid}, ${GOW.frostBright})` }}
                />
              </Link>
              <ThemeSwitcher />
            </nav>
          </div>
        </div>
      </header>

      {/* ========== REALM SELECTION ========== */}
      <section className="relative z-20 py-4" role="region" aria-label="Select profession">
        <div className="text-center mb-3">
          <span className="text-xs tracking-[0.25em] uppercase" style={{ color: GOW.goldBright }}>
            Choose Your Realm
          </span>
        </div>
        <div className="flex justify-center gap-4 md:gap-6" role="radiogroup" aria-label="Profession selection">
          {(['engineer', 'drummer', 'fighter'] as const).map((prof) => (
            <RealmSelector key={prof} profession={prof} isActive={active === prof} onClick={() => setActive(prof)} />
          ))}
        </div>
      </section>

      {/* ========== MAIN CONTENT ========== */}
      <main className="relative z-20 px-4 md:px-6 lg:px-20 py-6 pb-32">
        <div className="max-w-4xl mx-auto">
          {/* ===== ABOUT SECTION ===== */}
          <StoneTablet accentColor={currentColor} ariaLabel="About section" className="mb-6">
            <RuneBorder color={currentColor} className="mb-4 max-w-xs mx-auto" />

            <SectionTitle color={currentColor}>The Warrior Speaks</SectionTitle>

            <p
              className="text-sm leading-relaxed italic max-w-2xl mx-auto text-center mb-4"
              style={{ color: GOW.textPrimary }}
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
                      background: `${GOW.frostBright}12`,
                      border: `1px solid ${GOW.frostBright}35`,
                      color: GOW.frostBright,
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
                    background: `${currentColor}15`,
                    border: `1px solid ${currentColor}40`,
                    color: currentColor,
                  }}
                >
                  {fact}
                </span>
              ))}
            </div>

            <RuneBorder color={currentColor} className="mt-4 max-w-xs mx-auto" />
          </StoneTablet>

          {/* ===== ART BREAK 1 ===== */}
          <ArtBreak variant="serpent" />

          {/* ===== EXPERIENCE ===== */}
          {experience.length > 0 && (
            <StoneTablet accentColor={GOW.goldBright} ariaLabel="Work experience" className="mb-6">
              <SectionTitle>Trials Completed</SectionTitle>

              <div className="space-y-3">
                {experience.map((entry) => (
                  <ExperienceCard key={entry.id} entry={entry} color={currentColor} />
                ))}
              </div>
            </StoneTablet>
          )}

          {/* ===== ART BREAK 2 ===== */}
          <ArtBreak variant="weapons" />

          {/* ===== GRID: SKILLS + PROJECTS ===== */}
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            {/* Tech Stack / Skills */}
            <StoneTablet
              accentColor={currentColor}
              variant={active === 'engineer' ? 'frost' : active === 'drummer' ? 'fire' : 'default'}
              ariaLabel={active === 'engineer' ? 'Technology stack' : 'Skills and expertise'}
            >
              <SectionTitle color={currentColor} icon={active === 'engineer' ? 'axe' : 'blade'}>
                {active === 'engineer' ? 'Arsenal' : 'Mastery'}
              </SectionTitle>

              {active === 'engineer' ? (
                <TechStackDisplay color={currentColor} />
              ) : (
                <AchievementDisplay profession={active} color={currentColor} />
              )}
            </StoneTablet>

            {/* Projects */}
            <div>
              <SectionTitle color={GOW.goldBright}>Legendary Deeds</SectionTitle>

              <div className="space-y-3">
                {projects.slice(0, 4).map((project) => (
                  <ProjectCard key={project.id} project={project} color={currentColor} />
                ))}
              </div>
            </div>
          </div>

          {/* ===== ART BREAK 3 ===== */}
          <ArtBreak variant="bifrost" />

          {/* ===== VENTURES / BANDS (profession-specific) ===== */}
          {active === 'engineer' && (
            <>
              <CurrentRolesSection color={currentColor} />
              <CompaniesSection />
            </>
          )}

          {active === 'drummer' && <BandsSection />}

          {/* ===== POSTS SECTION ===== */}
          <PostsSection />
        </div>
      </main>

      {/* ========== CONTACT CTA ========== */}
      <section className="relative z-20 py-16 px-4 md:px-6 lg:px-20" aria-label="Contact">
        <div className="max-w-2xl mx-auto">
          <StoneTablet accentColor={GOW.goldBright} ariaLabel="Contact section">
            <div className="text-center py-4">
              <RuneBorder color={GOW.goldBright} className="mb-4 max-w-xs mx-auto" />
              <h2
                className="text-lg tracking-[0.15em] mb-3 uppercase"
                style={{
                  color: GOW.goldBright,
                  textShadow: `0 0 12px ${GOW.goldGlow}`,
                  fontFamily: '"Cinzel", Georgia, serif',
                }}
              >
                Ready to Work Together?
              </h2>
              <p className="text-sm mb-6" style={{ color: GOW.textSecondary }}>
                10+ years delivering production systems. Let&apos;s build something.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:alexanderpulido81@gmail.com"
                  className="px-6 py-3 text-xs tracking-wider uppercase transition-all hover:scale-105 relative overflow-hidden group"
                  style={{
                    background: `linear-gradient(180deg, ${GOW.frostBright}, ${GOW.frostDark})`,
                    color: GOW.bgDark,
                    boxShadow: `0 0 10px ${GOW.frostGlow}`,
                  }}
                >
                  <span className="relative z-10 font-bold">Get In Touch</span>
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: `linear-gradient(180deg, ${GOW.frostMid}, ${GOW.frostBright})` }}
                  />
                </a>
                <Link
                  href="/cv"
                  className="px-6 py-3 text-xs tracking-wider uppercase transition-all hover:scale-105 relative group"
                  style={{
                    background: 'transparent',
                    border: `2px solid ${GOW.goldBright}`,
                    color: GOW.goldBright,
                  }}
                >
                  <span className="relative z-10">View Codex</span>
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: `${GOW.goldBright}15` }}
                  />
                </Link>
              </div>
              <RuneBorder color={GOW.goldBright} className="mt-6 max-w-xs mx-auto" />
            </div>
          </StoneTablet>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="relative z-20 py-6 text-center pb-28" role="contentinfo">
        <RuneBorder color={GOW.goldMid} className="max-w-xs mx-auto mb-3" />

        <p
          className="text-xs tracking-widest flex items-center justify-center gap-3"
          style={{ color: GOW.textSecondary }}
        >
          <span style={{ color: GOW.frostBright }} aria-hidden="true">ᚠ</span>
          The Journey Continues
          <span style={{ color: GOW.fireOrange }} aria-hidden="true">ᚱ</span>
          <span aria-label="Year 2026">MMXXVI</span>
          <span style={{ color: GOW.goldBright }} aria-hidden="true">ᚦ</span>
        </p>

        <RuneBorder color={GOW.goldMid} className="max-w-xs mx-auto mt-3" />
      </footer>

      {/* ========== CSS ANIMATIONS ========== */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&display=swap');

        @keyframes frost-fall {
          0% {
            opacity: 0;
            transform: translateY(-10px) scale(0.5);
          }
          10% {
            opacity: 0.8;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            opacity: 0;
            transform: translateY(100vh) scale(0.2);
          }
        }
        .animate-frost-fall {
          animation: frost-fall linear infinite;
        }

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

        @keyframes bifrost-pulse {
          0%, 100% {
            opacity: 0.8;
          }
          50% {
            opacity: 1;
          }
        }
        .animate-bifrost-pulse {
          animation: bifrost-pulse 4s ease-in-out infinite;
        }

        @keyframes pillar-frost {
          0%, 100% {
            opacity: 0.3;
            transform: translateY(0);
          }
          50% {
            opacity: 0.6;
            transform: translateY(-10px);
          }
        }
        .animate-pillar-frost {
          animation: pillar-frost 6s ease-in-out infinite;
        }

        @keyframes pillar-fire {
          0%, 100% {
            opacity: 0.3;
            transform: translateY(0);
          }
          50% {
            opacity: 0.5;
            transform: translateY(10px);
          }
        }
        .animate-pillar-fire {
          animation: pillar-fire 5s ease-in-out infinite;
        }

        @keyframes realm-pulse {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.02);
          }
        }
        .animate-realm-pulse {
          animation: realm-pulse 2s ease-in-out infinite;
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* Focus styles for accessibility */
        *:focus-visible {
          outline: 2px solid ${GOW.frostBright};
          outline-offset: 2px;
        }

        button:focus-visible,
        a:focus-visible {
          outline: 2px solid ${GOW.goldBright};
          outline-offset: 2px;
        }
      `}</style>
    </div>
  )
}
