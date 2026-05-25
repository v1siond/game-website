'use client'

import { useEffect, useState, useRef, useMemo } from 'react'
import Link from 'next/link'
import { useTheme } from '@/themes/ThemeContext'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import { useProfession } from '@/contexts/ProfessionContext'
import { ABOUT_DATA, PROFESSIONAL_SUMMARY } from '@/data/about'
import { PROJECTS_DATA } from '@/data/projects'
import { getSkillsByProfession, getEngineerSkills } from '@/data/skills'
import { CURRENT_ROLES } from '@/data/roles'
import { COMPANIES } from '@/data/companies'
import { BANDS } from '@/data/bands'
import { EXPERIENCE_DATA, filterExperienceByProfession } from '@/data/experience'
import { useSmoothScroll } from '@/hooks/useScrollAnimation'

// ============================================================================
// EXACT PORTAL COLOR PALETTE
// ============================================================================
const PORTAL = {
  // Orange Portal
  ORANGE_PRIMARY: '#FF6B00',
  ORANGE_MID: '#FF8C00',
  ORANGE_DARK: '#CC5500',
  // Blue Portal
  BLUE_PRIMARY: '#00AAFF',
  BLUE_MID: '#0088CC',
  BLUE_DARK: '#0066AA',
  // Test Chamber Whites
  PANEL_WHITE: '#F5F5F5',
  PANEL_LIGHT: '#E8E8E8',
  PANEL_PURE: '#FFFFFF',
  // Dirty/Scuffed Panels
  DIRTY_LIGHT: '#A0A090',
  DIRTY_MID: '#808070',
  DIRTY_DARK: '#606050',
  // Caution Stripes
  CAUTION_YELLOW: '#FFD100',
  CAUTION_YELLOW_ALT: '#FFCC00',
  CAUTION_BLACK: '#1A1A1A',
  // GLaDOS Pink
  GLADOS_PINK: '#FF69B4',
  GLADOS_PINK_DARK: '#FF1493',
  // Background
  VOID_BLACK: '#050508',
  CHAMBER_DARK: '#0a0a0e',
}

// ============================================================================
// CUSTOM HOOKS
// ============================================================================

function usePrefersReducedMotion() {
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

// ============================================================================
// APERTURE SCIENCE CORE VISUAL ELEMENTS - CSS/SVG ONLY
// ============================================================================

// Authentic Aperture Science iris aperture logo
function ApertureLogoSVG({
  size = 60,
  color = PORTAL.PANEL_WHITE,
  className = '',
  ariaLabel = 'Aperture Science Logo'
}: {
  size?: number
  color?: string
  className?: string
  ariaLabel?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`aperture-logo ${className}`}
      role="img"
      aria-label={ariaLabel}
    >
      <title>{ariaLabel}</title>
      {/* Iris blades - authentic 9-blade aperture */}
      {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((angle, i) => (
        <path
          key={i}
          d="M50,50 L50,12 Q55,10 62,14 L55,50 Z"
          fill={color}
          opacity={0.9}
          transform={`rotate(${angle} 50 50)`}
        />
      ))}
      {/* Center ring */}
      <circle cx="50" cy="50" r="14" fill="none" stroke={color} strokeWidth="2.5" opacity="0.8" />
      <circle cx="50" cy="50" r="8" fill={PORTAL.VOID_BLACK} />
    </svg>
  )
}

// Weighted Companion Cube - authentic with metal frame and pink heart
function CompanionCube({
  size = 80,
  glowing = false,
}: {
  size?: number
  glowing?: boolean
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={glowing ? 'companion-cube-glow' : ''}
      role="img"
      aria-label="Weighted Companion Cube"
    >
      <title>Weighted Companion Cube</title>
      <defs>
        <linearGradient id="cube-metal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#CCCCCC" />
          <stop offset="50%" stopColor="#999999" />
          <stop offset="100%" stopColor="#666666" />
        </linearGradient>
        <filter id="cube-shadow">
          <feDropShadow dx="2" dy="2" stdDeviation="2" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Outer cube frame */}
      <rect x="5" y="5" width="90" height="90" fill="url(#cube-metal)" rx="4" filter="url(#cube-shadow)" />
      <rect x="5" y="5" width="90" height="90" fill="none" stroke="#888" strokeWidth="3" rx="4" />

      {/* Corner rivets */}
      {[
        { cx: 15, cy: 15 }, { cx: 85, cy: 15 },
        { cx: 15, cy: 85 }, { cx: 85, cy: 85 },
      ].map((pos, i) => (
        <g key={i}>
          <circle cx={pos.cx} cy={pos.cy} r="8" fill="#777" stroke="#555" strokeWidth="1" />
          <circle cx={pos.cx - 1} cy={pos.cy - 1} r="4" fill="#999" opacity="0.6" />
        </g>
      ))}

      {/* Inner recessed panel */}
      <rect x="22" y="22" width="56" height="56" fill="#888" stroke="#666" strokeWidth="2" rx="2" />
      <rect x="28" y="28" width="44" height="44" fill="#AAA" stroke="#888" strokeWidth="1" rx="1" />

      {/* Pink heart - GLaDOS aesthetic */}
      <path
        d="M50,38 C44,28 30,28 30,42 C30,56 50,68 50,68 C50,68 70,56 70,42 C70,28 56,28 50,38"
        fill={PORTAL.GLADOS_PINK}
        stroke={PORTAL.GLADOS_PINK_DARK}
        strokeWidth="2"
      />

      {/* Heart highlight */}
      <ellipse cx="40" cy="42" rx="5" ry="3" fill="rgba(255,255,255,0.3)" transform="rotate(-20 40 42)" />
    </svg>
  )
}

// Aperture Science Sentry Turret - authentic design
function SentryTurret({
  size = 120,
  active = false,
  side = 'left',
}: {
  size?: number
  active?: boolean
  side?: 'left' | 'right'
}) {
  const mirrorTransform = side === 'right' ? 'scaleX(-1)' : ''

  return (
    <svg
      width={size * 0.5}
      height={size}
      viewBox="0 0 60 120"
      style={{ transform: mirrorTransform }}
      role="img"
      aria-label={`Aperture Science Sentry Turret${active ? ' - Active' : ''}`}
    >
      <title>Aperture Science Sentry Turret</title>
      <defs>
        <linearGradient id="turret-body" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#E8E8E8" />
          <stop offset="50%" stopColor="#F5F5F5" />
          <stop offset="100%" stopColor="#D0D0D0" />
        </linearGradient>
        <radialGradient id="turret-eye-glow" cx="50%" cy="50%">
          <stop offset="0%" stopColor={active ? '#FF0000' : '#550000'} />
          <stop offset="100%" stopColor={active ? '#880000' : '#220000'} />
        </radialGradient>
      </defs>

      {/* Tripod legs */}
      <line x1="20" y1="95" x2="8" y2="118" stroke="#E0E0E0" strokeWidth="4" strokeLinecap="round" />
      <line x1="40" y1="95" x2="52" y2="118" stroke="#E0E0E0" strokeWidth="4" strokeLinecap="round" />
      <line x1="30" y1="95" x2="30" y2="118" stroke="#E0E0E0" strokeWidth="4" strokeLinecap="round" />

      {/* Main body - oval shape */}
      <ellipse cx="30" cy="60" rx="20" ry="38" fill="url(#turret-body)" stroke="#BBB" strokeWidth="2" />

      {/* Side panels */}
      <ellipse cx="30" cy="60" rx="16" ry="30" fill="none" stroke="#DDD" strokeWidth="1" />

      {/* Gun panels (wings) */}
      <rect x="8" y="45" width="8" height="30" fill="#E0E0E0" stroke="#AAA" strokeWidth="1" rx="2" />
      <rect x="44" y="45" width="8" height="30" fill="#E0E0E0" stroke="#AAA" strokeWidth="1" rx="2" />

      {/* Gun barrels */}
      <rect x="4" y="55" width="4" height="10" fill="#888" rx="1" />
      <rect x="52" y="55" width="4" height="10" fill="#888" rx="1" />

      {/* Eye housing */}
      <ellipse cx="30" cy="40" rx="12" ry="10" fill={PORTAL.CAUTION_BLACK} />

      {/* Red eye */}
      <ellipse
        cx="30"
        cy="40"
        rx="5"
        ry="4"
        fill="url(#turret-eye-glow)"
        className={active ? 'turret-eye-active' : ''}
      />

      {/* Eye reflection */}
      <circle cx="28" cy="38" r="1.5" fill="rgba(255,255,255,0.4)" />

      {/* Aperture logo on body */}
      <g transform="translate(30,72) scale(0.15)">
        <circle cx="0" cy="0" r="25" fill="none" stroke="#CCC" strokeWidth="2" />
      </g>

      {/* Targeting laser when active */}
      {active && (
        <>
          <line
            x1="30"
            y1="40"
            x2={side === 'left' ? '200' : '-140'}
            y2="40"
            stroke="#FF0000"
            strokeWidth="1.5"
            className="laser-beam"
            opacity="0.8"
          />
          <circle cx="30" cy="40" r="8" fill="none" stroke="#FF0000" strokeWidth="1" opacity="0.4" />
        </>
      )}
    </svg>
  )
}

// Portal oval with authentic glow and particle effects
function PortalOval({
  color,
  size = 150,
  particles = true,
}: {
  color: 'orange' | 'blue'
  size?: number
  particles?: boolean
}) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const colors = color === 'orange'
    ? { primary: PORTAL.ORANGE_PRIMARY, mid: PORTAL.ORANGE_MID, dark: PORTAL.ORANGE_DARK }
    : { primary: PORTAL.BLUE_PRIMARY, mid: PORTAL.BLUE_MID, dark: PORTAL.BLUE_DARK }

  // Generate particle positions
  const particleData = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => ({
      angle: (i / 12) * 360,
      delay: i * 0.2,
      distance: 0.85 + Math.random() * 0.15,
      size: 2 + Math.random() * 3,
    })), [])

  return (
    <div className="relative" style={{ width: size * 0.7, height: size }}>
      <svg
        width={size * 0.7}
        height={size}
        viewBox="0 0 70 100"
        className={prefersReducedMotion ? '' : `portal-glow-${color}`}
        role="img"
        aria-label={`${color === 'orange' ? 'Orange' : 'Blue'} Portal`}
      >
        <title>{color === 'orange' ? 'Orange' : 'Blue'} Portal</title>
        <defs>
          {/* Multi-layer glow filter */}
          <filter id={`portal-glow-filter-${color}`} x="-150%" y="-150%" width="400%" height="400%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur2" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur3" />
            <feMerge>
              <feMergeNode in="blur3" />
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Portal void gradient */}
          <radialGradient id={`portal-void-${color}`} cx="50%" cy="50%">
            <stop offset="0%" stopColor={PORTAL.VOID_BLACK} />
            <stop offset="70%" stopColor="#000000" />
            <stop offset="100%" stopColor={colors.dark} stopOpacity="0.2" />
          </radialGradient>

          {/* Rim gradient - brighter on edges */}
          <linearGradient id={`portal-rim-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.primary} />
            <stop offset="25%" stopColor={colors.mid} />
            <stop offset="50%" stopColor={colors.primary} />
            <stop offset="75%" stopColor={colors.mid} />
            <stop offset="100%" stopColor={colors.primary} />
          </linearGradient>
        </defs>

        {/* Outermost glow halo */}
        <ellipse
          cx="35" cy="50" rx="34" ry="49"
          fill="none"
          stroke={colors.primary}
          strokeWidth="16"
          opacity="0.15"
          filter={`url(#portal-glow-filter-${color})`}
        />

        {/* Middle glow ring */}
        <ellipse
          cx="35" cy="50" rx="32" ry="47"
          fill="none"
          stroke={colors.primary}
          strokeWidth="10"
          opacity="0.25"
          className="portal-ring-pulse"
        />

        {/* Main portal rim - thick glowing edge */}
        <ellipse
          cx="35" cy="50" rx="28" ry="43"
          fill="none"
          stroke={`url(#portal-rim-${color})`}
          strokeWidth="7"
          filter={`url(#portal-glow-filter-${color})`}
        />

        {/* Inner bright ring */}
        <ellipse
          cx="35" cy="50" rx="24" ry="38"
          fill="none"
          stroke={colors.primary}
          strokeWidth="2.5"
          className="portal-inner-ring"
        />

        {/* Portal void - the dark interior */}
        <ellipse
          cx="35" cy="50" rx="21" ry="35"
          fill={`url(#portal-void-${color})`}
        />

        {/* Inner edge highlight */}
        <ellipse
          cx="35" cy="50" rx="19" ry="32"
          fill="none"
          stroke={colors.primary}
          strokeWidth="1"
          opacity="0.5"
        />

        {/* Center void core */}
        <ellipse
          cx="35" cy="50" rx="15" ry="26"
          fill={PORTAL.VOID_BLACK}
          opacity="0.9"
        />
      </svg>

      {/* Particle effects around portal rim */}
      {particles && !prefersReducedMotion && (
        <div className="absolute inset-0 pointer-events-none">
          {particleData.map((p, i) => {
            const angle = (p.angle * Math.PI) / 180
            const rx = (size * 0.7 * 0.4) * p.distance
            const ry = (size * 0.5) * p.distance
            const x = 35 * (size * 0.7 / 70) + Math.cos(angle) * rx
            const y = 50 * (size / 100) + Math.sin(angle) * ry
            return (
              <div
                key={i}
                className="absolute rounded-full portal-particle"
                style={{
                  left: x,
                  top: y,
                  width: p.size,
                  height: p.size,
                  background: colors.primary,
                  boxShadow: `0 0 ${p.size * 3}px ${colors.primary}`,
                  animationDelay: `${p.delay}s`,
                }}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

// Caution stripe bar - authentic yellow/black diagonal
function CautionStripe({
  height = 8,
  className = ''
}: {
  height?: number
  className?: string
}) {
  return (
    <div
      className={`w-full ${className}`}
      style={{
        height,
        background: `repeating-linear-gradient(
          -45deg,
          ${PORTAL.CAUTION_YELLOW},
          ${PORTAL.CAUTION_YELLOW} 10px,
          ${PORTAL.CAUTION_BLACK} 10px,
          ${PORTAL.CAUTION_BLACK} 20px
        )`,
      }}
      role="presentation"
      aria-hidden="true"
    />
  )
}

// "The cake is a lie" graffiti - scrawled handwriting style
function CakeIsALieGraffiti({
  className = '',
  variant = 'normal',
}: {
  className?: string
  variant?: 'normal' | 'frantic' | 'faded'
}) {
  const styles = {
    normal: {
      color: '#8B4513',
      textShadow: '1px 1px 0 #3D1F08',
      transform: 'rotate(-3deg)',
      opacity: 0.7,
    },
    frantic: {
      color: '#AA3322',
      textShadow: '2px 2px 0 #220808, -1px 0 #440000',
      transform: 'rotate(-8deg) skewX(-5deg)',
      opacity: 0.85,
    },
    faded: {
      color: '#666655',
      textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
      transform: 'rotate(2deg)',
      opacity: 0.4,
    },
  }

  return (
    <div
      className={`graffiti-text select-none ${className}`}
      role="img"
      aria-label="The cake is a lie - graffiti"
      style={{
        fontFamily: '"Courier New", monospace',
        fontSize: variant === 'frantic' ? '14px' : '11px',
        fontWeight: variant === 'frantic' ? 'bold' : 'normal',
        letterSpacing: variant === 'frantic' ? '1px' : '-0.5px',
        whiteSpace: 'nowrap',
        ...styles[variant],
      }}
    >
      the cake is a lie
    </div>
  )
}

// Test chamber panel grid - white rectangles with seams
function TestChamberPanelBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0"
      role="presentation"
      aria-hidden="true"
    >
      {/* Deep void background */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, ${PORTAL.CHAMBER_DARK} 0%, ${PORTAL.VOID_BLACK} 100%)`,
        }}
      />

      {/* Large panel grid - main test chamber panels */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(${PORTAL.PANEL_WHITE}08 2px, transparent 2px),
            linear-gradient(90deg, ${PORTAL.PANEL_WHITE}08 2px, transparent 2px)
          `,
          backgroundSize: '120px 120px',
        }}
      />

      {/* Panel seams - medium grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(${PORTAL.PANEL_LIGHT}05 1px, transparent 1px),
            linear-gradient(90deg, ${PORTAL.PANEL_LIGHT}05 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Subtle corner rivets pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            radial-gradient(circle, ${PORTAL.PANEL_WHITE} 2px, transparent 2px)
          `,
          backgroundSize: '120px 120px',
          backgroundPosition: '0 0, 60px 60px',
        }}
      />

      {/* Scuff/dirt marks scattered */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at 15% 25%, ${PORTAL.DIRTY_DARK}15 0%, transparent 8%),
            radial-gradient(ellipse at 72% 18%, ${PORTAL.DIRTY_MID}10 0%, transparent 12%),
            radial-gradient(ellipse at 35% 68%, ${PORTAL.DIRTY_DARK}12 0%, transparent 6%),
            radial-gradient(ellipse at 88% 75%, ${PORTAL.DIRTY_LIGHT}08 0%, transparent 10%),
            radial-gradient(ellipse at 8% 82%, ${PORTAL.DIRTY_MID}10 0%, transparent 7%)
          `,
        }}
      />

      {/* Orange portal ambient glow - left */}
      <div
        className="absolute"
        style={{
          left: 0,
          top: '25%',
          width: '250px',
          height: '50%',
          background: `radial-gradient(ellipse at left center, ${PORTAL.ORANGE_PRIMARY}12 0%, transparent 70%)`,
        }}
      />

      {/* Blue portal ambient glow - right */}
      <div
        className="absolute"
        style={{
          right: 0,
          top: '25%',
          width: '250px',
          height: '50%',
          background: `radial-gradient(ellipse at right center, ${PORTAL.BLUE_PRIMARY}12 0%, transparent 70%)`,
        }}
      />
    </div>
  )
}

// ============================================================================
// ART SECTION COMPONENTS - Portal themed decorative breaks
// ============================================================================

// Art Section 1: Portal Effects - Orange and blue portals facing each other
function ArtSectionPortals() {
  return (
    <section
      className="relative py-16 overflow-hidden"
      aria-label="Decorative portal art"
    >
      {/* Caution stripe top */}
      <CautionStripe height={6} />

      <div className="relative max-w-6xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center">
          {/* Orange portal - left */}
          <div className="relative">
            <PortalOval color="orange" size={180} />
            {/* Energy wisps */}
            <div
              className="absolute -right-8 top-1/2 -translate-y-1/2 w-24 h-2 opacity-40"
              style={{
                background: `linear-gradient(90deg, ${PORTAL.ORANGE_PRIMARY}, transparent)`,
                filter: 'blur(4px)',
              }}
            />
          </div>

          {/* Center decoration - Aperture logo */}
          <div className="flex flex-col items-center gap-4">
            <ApertureLogoSVG size={80} color={PORTAL.PANEL_WHITE} className="spin-very-slow opacity-30" />
            <div
              className="text-xs tracking-[0.3em] uppercase"
              style={{ color: PORTAL.DIRTY_LIGHT }}
            >
              TEST CHAMBER ACTIVE
            </div>
          </div>

          {/* Blue portal - right */}
          <div className="relative">
            <PortalOval color="blue" size={180} />
            {/* Energy wisps */}
            <div
              className="absolute -left-8 top-1/2 -translate-y-1/2 w-24 h-2 opacity-40"
              style={{
                background: `linear-gradient(-90deg, ${PORTAL.BLUE_PRIMARY}, transparent)`,
                filter: 'blur(4px)',
              }}
            />
          </div>
        </div>

        {/* Floor line with portal glow reflections */}
        <div className="mt-8 h-px relative">
          <div className="absolute inset-0" style={{ background: PORTAL.DIRTY_MID + '40' }} />
          <div
            className="absolute left-0 w-32 h-full"
            style={{ background: `linear-gradient(90deg, ${PORTAL.ORANGE_PRIMARY}30, transparent)` }}
          />
          <div
            className="absolute right-0 w-32 h-full"
            style={{ background: `linear-gradient(-90deg, ${PORTAL.BLUE_PRIMARY}30, transparent)` }}
          />
        </div>
      </div>

      {/* Caution stripe bottom */}
      <CautionStripe height={6} />
    </section>
  )
}

// Art Section 2: Companion Cube and Turrets
function ArtSectionCubeAndTurrets() {
  const [turretsActive, setTurretsActive] = useState(false)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion) return
    const interval = setInterval(() => {
      setTurretsActive(prev => !prev)
    }, 3000)
    return () => clearInterval(interval)
  }, [prefersReducedMotion])

  return (
    <section
      className="relative py-16 overflow-hidden"
      aria-label="Decorative turret and cube art"
    >
      <CautionStripe height={6} />

      <div className="relative max-w-5xl mx-auto px-6 py-12">
        <div className="flex justify-between items-end">
          {/* Left turret */}
          <div className="relative">
            <SentryTurret size={140} active={turretsActive} side="left" />
            {turretsActive && (
              <div
                className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs tracking-wider"
                style={{ color: '#FF3333' }}
              >
                TARGET ACQUIRED
              </div>
            )}
          </div>

          {/* Center - Companion Cube on pedestal */}
          <div className="flex flex-col items-center">
            <CompanionCube size={100} glowing />
            {/* Pedestal */}
            <div
              className="w-32 h-4 mt-2"
              style={{
                background: `linear-gradient(180deg, ${PORTAL.DIRTY_LIGHT}, ${PORTAL.DIRTY_MID})`,
                borderRadius: '2px 2px 0 0',
              }}
            />
            <div
              className="text-xs mt-4 tracking-[0.2em]"
              style={{ color: PORTAL.GLADOS_PINK }}
            >
              WEIGHTED COMPANION CUBE
            </div>
          </div>

          {/* Right turret */}
          <div className="relative">
            <SentryTurret size={140} active={turretsActive} side="right" />
            {turretsActive && (
              <div
                className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs tracking-wider"
                style={{ color: '#FF3333' }}
              >
                I SEE YOU
              </div>
            )}
          </div>
        </div>

        {/* Graffiti elements */}
        <div className="absolute bottom-20 left-8">
          <CakeIsALieGraffiti variant="frantic" />
        </div>
        <div className="absolute top-16 right-12">
          <CakeIsALieGraffiti variant="faded" />
        </div>
      </div>

      <CautionStripe height={6} />
    </section>
  )
}

// Art Section 3: Test Chamber Elements - dirty/overgrown panels
function ArtSectionTestChamber() {
  return (
    <section
      className="relative py-16 overflow-hidden"
      aria-label="Decorative test chamber art"
    >
      <CautionStripe height={6} />

      <div className="relative max-w-6xl mx-auto px-6 py-12">
        {/* Panel grid with wear and overgrowth */}
        <div className="relative h-48 overflow-hidden rounded-sm">
          {/* Clean panel base */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                linear-gradient(${PORTAL.PANEL_LIGHT}15, ${PORTAL.PANEL_WHITE}08),
                repeating-linear-gradient(0deg, transparent, transparent 39px, ${PORTAL.PANEL_WHITE}10 39px, ${PORTAL.PANEL_WHITE}10 40px),
                repeating-linear-gradient(90deg, transparent, transparent 39px, ${PORTAL.PANEL_WHITE}10 39px, ${PORTAL.PANEL_WHITE}10 40px)
              `,
            }}
          />

          {/* Scuffed/dirty sections */}
          <div
            className="absolute left-0 bottom-0 w-1/3 h-2/3"
            style={{
              background: `linear-gradient(45deg, ${PORTAL.DIRTY_DARK}30, transparent)`,
            }}
          />
          <div
            className="absolute right-1/4 top-0 w-1/4 h-1/2"
            style={{
              background: `radial-gradient(ellipse at center, ${PORTAL.DIRTY_MID}25, transparent)`,
            }}
          />

          {/* Overgrown sections - green growth */}
          <div
            className="absolute left-8 bottom-0 w-32 h-24"
            style={{
              background: `linear-gradient(0deg, #228B2240, transparent)`,
              maskImage: 'linear-gradient(0deg, black 30%, transparent)',
              WebkitMaskImage: 'linear-gradient(0deg, black 30%, transparent)',
            }}
          />

          {/* Vine cracks */}
          <svg className="absolute left-16 bottom-0 w-20 h-32 opacity-30">
            <path
              d="M10,80 Q15,60 10,40 Q8,30 15,20 M10,40 Q20,35 25,40 M10,60 Q5,55 0,60"
              stroke="#2D5A2D"
              strokeWidth="2"
              fill="none"
            />
          </svg>

          <svg className="absolute right-24 bottom-0 w-16 h-24 opacity-25">
            <path
              d="M8,60 Q12,45 8,30 Q6,20 12,10 M8,30 Q15,28 18,32"
              stroke="#3D6B3D"
              strokeWidth="2"
              fill="none"
            />
          </svg>

          {/* Portal glow effects on panels */}
          <div
            className="absolute left-0 top-0 bottom-0 w-2"
            style={{
              background: `linear-gradient(180deg, ${PORTAL.ORANGE_PRIMARY}40, ${PORTAL.ORANGE_PRIMARY}20, ${PORTAL.ORANGE_PRIMARY}40)`,
              boxShadow: `0 0 20px ${PORTAL.ORANGE_PRIMARY}30`,
            }}
          />
          <div
            className="absolute right-0 top-0 bottom-0 w-2"
            style={{
              background: `linear-gradient(180deg, ${PORTAL.BLUE_PRIMARY}40, ${PORTAL.BLUE_PRIMARY}20, ${PORTAL.BLUE_PRIMARY}40)`,
              boxShadow: `0 0 20px ${PORTAL.BLUE_PRIMARY}30`,
            }}
          />

          {/* Aperture logo watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03]">
            <ApertureLogoSVG size={200} color={PORTAL.PANEL_WHITE} />
          </div>

          {/* More graffiti */}
          <div className="absolute bottom-4 right-8">
            <CakeIsALieGraffiti variant="normal" />
          </div>
        </div>

        {/* GLaDOS quote */}
        <div
          className="text-center mt-8 text-sm tracking-wider italic"
          style={{ color: PORTAL.DIRTY_LIGHT }}
        >
          "We do what we must because we can"
        </div>
      </div>

      <CautionStripe height={6} />
    </section>
  )
}

// ============================================================================
// SECTION CARD COMPONENTS - White panel texture with portal glow edges
// ============================================================================

function TestChamberSection({
  children,
  title,
  icon,
  warning,
  variant = 'clean',
}: {
  children: React.ReactNode
  title: string
  icon?: React.ReactNode
  warning?: string
  variant?: 'clean' | 'scuffed' | 'overgrown'
}) {
  return (
    <section
      className="relative"
      aria-labelledby={`section-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      {/* Caution stripe border - top */}
      <div
        className="h-2"
        style={{
          background: `repeating-linear-gradient(
            90deg,
            ${PORTAL.CAUTION_YELLOW},
            ${PORTAL.CAUTION_YELLOW} 12px,
            ${PORTAL.CAUTION_BLACK} 12px,
            ${PORTAL.CAUTION_BLACK} 24px
          )`,
        }}
        aria-hidden="true"
      />

      {/* Portal glow edges - orange left, blue right */}
      <div
        className="absolute top-2 bottom-2 left-0 w-1 z-10"
        style={{
          background: `linear-gradient(180deg, ${PORTAL.ORANGE_PRIMARY}70, ${PORTAL.ORANGE_MID}40, ${PORTAL.ORANGE_PRIMARY}70)`,
          boxShadow: `0 0 20px ${PORTAL.ORANGE_PRIMARY}50, 0 0 40px ${PORTAL.ORANGE_PRIMARY}25`,
        }}
        aria-hidden="true"
      />
      <div
        className="absolute top-2 bottom-2 right-0 w-1 z-10"
        style={{
          background: `linear-gradient(180deg, ${PORTAL.BLUE_PRIMARY}70, ${PORTAL.BLUE_MID}40, ${PORTAL.BLUE_PRIMARY}70)`,
          boxShadow: `0 0 20px ${PORTAL.BLUE_PRIMARY}50, 0 0 40px ${PORTAL.BLUE_PRIMARY}25`,
        }}
        aria-hidden="true"
      />

      {/* Main content area with panel texture */}
      <div
        className="relative px-6 py-6"
        style={{
          background: `
            linear-gradient(180deg, ${PORTAL.CHAMBER_DARK}f5, ${PORTAL.VOID_BLACK}f8),
            repeating-linear-gradient(0deg, transparent, transparent 39px, ${PORTAL.PANEL_WHITE}04 39px, ${PORTAL.PANEL_WHITE}04 40px),
            repeating-linear-gradient(90deg, transparent, transparent 39px, ${PORTAL.PANEL_WHITE}04 39px, ${PORTAL.PANEL_WHITE}04 40px)
          `,
        }}
      >
        {/* Corner screws/rivets */}
        {['top-3 left-3', 'top-3 right-3', 'bottom-3 left-3', 'bottom-3 right-3'].map((pos, i) => (
          <div
            key={i}
            className={`absolute ${pos} w-3 h-3 rounded-full`}
            style={{
              background: `radial-gradient(circle at 30% 30%, ${PORTAL.DIRTY_LIGHT}, ${PORTAL.DIRTY_MID})`,
              boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.3)',
            }}
            aria-hidden="true"
          />
        ))}

        {/* Scuffed variant overlay */}
        {variant === 'scuffed' && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `
                radial-gradient(ellipse at 20% 30%, ${PORTAL.DIRTY_DARK}15 0%, transparent 15%),
                radial-gradient(ellipse at 75% 60%, ${PORTAL.DIRTY_MID}10 0%, transparent 20%),
                radial-gradient(ellipse at 45% 85%, ${PORTAL.DIRTY_DARK}12 0%, transparent 10%)
              `,
            }}
            aria-hidden="true"
          />
        )}

        {/* Overgrown variant overlay */}
        {variant === 'overgrown' && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `
                radial-gradient(ellipse at 5% 90%, #228B2218 0%, transparent 20%),
                radial-gradient(ellipse at 95% 10%, #2D5A2D15 0%, transparent 15%),
                radial-gradient(ellipse at 30% 70%, #3D6B3D10 0%, transparent 12%)
              `,
            }}
            aria-hidden="true"
          />
        )}

        {/* Section header */}
        <div className="flex items-center gap-4 mb-6">
          <div
            className="flex-1 h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${PORTAL.ORANGE_PRIMARY}40)` }}
            aria-hidden="true"
          />
          <div className="flex items-center gap-3">
            {icon || <ApertureLogoSVG size={20} color={PORTAL.BLUE_PRIMARY} />}
            <h2
              id={`section-${title.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-sm tracking-[0.25em] uppercase font-medium"
              style={{ color: PORTAL.BLUE_PRIMARY }}
            >
              {title}
            </h2>
          </div>
          <div
            className="flex-1 h-px"
            style={{ background: `linear-gradient(90deg, ${PORTAL.BLUE_PRIMARY}40, transparent)` }}
            aria-hidden="true"
          />
        </div>

        {/* Optional warning notice */}
        {warning && (
          <div className="mb-5 flex justify-center">
            <div
              className="inline-flex items-center gap-2 px-4 py-1"
              style={{
                background: `repeating-linear-gradient(
                  -45deg,
                  ${PORTAL.CAUTION_YELLOW}20,
                  ${PORTAL.CAUTION_YELLOW}20 8px,
                  transparent 8px,
                  transparent 16px
                )`,
                border: `1px solid ${PORTAL.CAUTION_YELLOW}50`,
              }}
            >
              <span
                className="text-xs font-bold tracking-wider"
                style={{ color: PORTAL.CAUTION_YELLOW }}
              >
                NOTICE:
              </span>
              <span
                className="text-xs"
                style={{ color: PORTAL.PANEL_WHITE }}
              >
                {warning}
              </span>
            </div>
          </div>
        )}

        {children}
      </div>

      {/* Caution stripe border - bottom */}
      <div
        className="h-2"
        style={{
          background: `repeating-linear-gradient(
            90deg,
            ${PORTAL.CAUTION_BLACK},
            ${PORTAL.CAUTION_BLACK} 12px,
            ${PORTAL.CAUTION_YELLOW} 12px,
            ${PORTAL.CAUTION_YELLOW} 24px
          )`,
        }}
        aria-hidden="true"
      />
    </section>
  )
}

// ============================================================================
// CONTENT COMPONENTS
// ============================================================================

// Portal Ring - profession selection
function PortalRing({
  profession,
  isActive,
  onClick,
  position,
}: {
  profession: 'engineer' | 'drummer' | 'fighter'
  isActive: boolean
  onClick: () => void
  position: { x: number; y: number }
}) {
  const colors = {
    engineer: { primary: PORTAL.BLUE_PRIMARY, dark: PORTAL.BLUE_DARK },
    drummer: { primary: PORTAL.ORANGE_PRIMARY, dark: PORTAL.ORANGE_DARK },
    fighter: { primary: '#00FF88', dark: '#00AA55' },
  }
  const icons = { engineer: '< />', drummer: '///', fighter: '+ +' }
  const labels = { engineer: 'ENGINEER', drummer: 'MUSICIAN', fighter: 'FIGHTER' }

  const color = colors[profession]
  const prefersReducedMotion = usePrefersReducedMotion()

  return (
    <button
      onClick={onClick}
      className={`absolute ${prefersReducedMotion ? '' : 'transition-all duration-300'} ${
        isActive ? 'scale-110 z-20' : 'scale-100 hover:scale-105'
      }`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: `translate(-50%, -50%) ${isActive ? 'scale(1.1)' : ''}`,
      }}
      aria-label={`Select ${labels[profession]} profile${isActive ? ' (currently selected)' : ''}`}
      aria-pressed={isActive}
    >
      {/* Outer glow */}
      <div
        className={`absolute rounded-full ${prefersReducedMotion ? '' : 'portal-pulse'}`}
        style={{
          width: '160px',
          height: '220px',
          background: `radial-gradient(ellipse, ${color.primary}25, transparent 70%)`,
          opacity: isActive ? 1 : 0.5,
          filter: 'blur(15px)',
          margin: '-60px -30px',
        }}
        aria-hidden="true"
      />

      {/* Portal ring */}
      <div
        className="relative flex items-center justify-center"
        style={{
          width: '100px',
          height: '140px',
          background: `radial-gradient(ellipse at 50% 50%, ${color.primary}10, transparent 70%)`,
          border: `4px solid ${color.primary}`,
          borderRadius: '50%',
          boxShadow: `
            0 0 40px ${color.primary}60,
            0 0 80px ${color.primary}30,
            inset 0 0 60px ${color.primary}15
          `,
        }}
      >
        {/* Swirl effect */}
        <div
          className={`absolute inset-4 rounded-full ${prefersReducedMotion ? '' : 'spin-slow'} opacity-30`}
          style={{
            background: `conic-gradient(from 0deg, transparent, ${color.primary}, transparent, ${color.dark}, transparent)`,
          }}
          aria-hidden="true"
        />

        {/* Void center */}
        <div
          className="absolute rounded-full"
          style={{
            width: '65px',
            height: '95px',
            background: `radial-gradient(ellipse, ${PORTAL.VOID_BLACK}, #000)`,
          }}
          aria-hidden="true"
        />

        {/* Icon */}
        <span
          className="relative z-10 text-2xl font-mono tracking-tight"
          style={{ color: color.primary, textShadow: `0 0 25px ${color.primary}` }}
          aria-hidden="true"
        >
          {icons[profession]}
        </span>
      </div>

      {/* Label */}
      <div
        className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap"
        style={{ color: color.primary, textShadow: `0 0 12px ${color.primary}` }}
      >
        <span className="text-xs tracking-[0.2em] font-semibold">{labels[profession]}</span>
      </div>

      {/* Active indicator */}
      {isActive && (
        <div
          className={`absolute -bottom-16 left-1/2 -translate-x-1/2 text-xl ${prefersReducedMotion ? '' : 'animate-bounce'}`}
          style={{ color: color.primary }}
          aria-hidden="true"
        >
          ^
        </div>
      )}
    </button>
  )
}

// Tech Stack - NO proficiency bars, just tags
function TechTerminal({ categories }: { categories: ReturnType<typeof getEngineerSkills> }) {
  return (
    <div className="space-y-8" role="list" aria-label="Technical Skills">
      {categories.slice(0, 6).map((category, catIndex) => (
        <div key={category.name} role="listitem">
          <h3
            className="text-xs tracking-[0.15em] mb-4 flex items-center gap-3 uppercase"
            style={{ color: catIndex % 2 === 0 ? PORTAL.BLUE_PRIMARY : PORTAL.ORANGE_PRIMARY }}
          >
            <span className="text-sm">{category.icon}</span>
            <span>{category.name}</span>
            <span
              className="flex-1 h-px ml-2"
              style={{
                background: `linear-gradient(90deg, ${catIndex % 2 === 0 ? PORTAL.BLUE_PRIMARY : PORTAL.ORANGE_PRIMARY}40, transparent)`
              }}
              aria-hidden="true"
            />
          </h3>
          <div className="flex flex-wrap gap-2" role="list">
            {category.items.map((tech, i) => (
              <span
                key={tech}
                className="px-3 py-1.5 text-xs transition-all hover:scale-105 cursor-default"
                style={{
                  background: `${i % 2 === 0 ? PORTAL.BLUE_PRIMARY : PORTAL.ORANGE_PRIMARY}12`,
                  border: `1px solid ${i % 2 === 0 ? PORTAL.BLUE_PRIMARY : PORTAL.ORANGE_PRIMARY}40`,
                  color: PORTAL.PANEL_WHITE,
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

// Skills panel for drummer/fighter
function SkillsPanel({ categories }: { categories: ReturnType<typeof getSkillsByProfession> }) {
  return (
    <div className="grid md:grid-cols-3 gap-8" role="list" aria-label="Skills">
      {categories.map((category, catIndex) => (
        <div key={category.name} role="listitem">
          <h3
            className="text-xs tracking-[0.15em] mb-4 flex items-center gap-2 uppercase"
            style={{ color: catIndex % 2 === 0 ? PORTAL.BLUE_PRIMARY : PORTAL.ORANGE_PRIMARY }}
          >
            <span>{category.icon}</span>
            {category.name}
          </h3>
          <ul className="space-y-3" role="list">
            {category.skills.map((skill, i) => (
              <li
                key={skill.name}
                className="text-sm flex items-center gap-3"
                style={{ color: PORTAL.PANEL_WHITE }}
              >
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{
                    background: i % 2 === 0 ? PORTAL.BLUE_PRIMARY : PORTAL.ORANGE_PRIMARY,
                    boxShadow: `0 0 8px ${i % 2 === 0 ? PORTAL.BLUE_PRIMARY : PORTAL.ORANGE_PRIMARY}`,
                  }}
                  aria-hidden="true"
                />
                {skill.name}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

// Project card
function TestChamberCard({ project, index }: { project: typeof PROJECTS_DATA[0]; index: number }) {
  const [hovered, setHovered] = useState(false)
  const isOrange = index % 2 === 0
  const color = isOrange ? PORTAL.ORANGE_PRIMARY : PORTAL.BLUE_PRIMARY

  return (
    <article
      className="relative p-5 cursor-pointer transition-all duration-300 group"
      style={{
        background: `
          linear-gradient(180deg, ${PORTAL.CHAMBER_DARK}, ${PORTAL.VOID_BLACK}),
          repeating-linear-gradient(0deg, transparent, transparent 19px, ${PORTAL.PANEL_WHITE}02 19px, ${PORTAL.PANEL_WHITE}02 20px),
          repeating-linear-gradient(90deg, transparent, transparent 19px, ${PORTAL.PANEL_WHITE}02 19px, ${PORTAL.PANEL_WHITE}02 20px)
        `,
        border: `2px solid ${hovered ? color : PORTAL.DIRTY_DARK}`,
        boxShadow: hovered ? `0 0 40px ${color}30, inset 0 0 40px ${color}08` : 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-labelledby={`project-${project.id}`}
    >
      {/* Portal glow edges on hover */}
      {hovered && (
        <>
          <div
            className="absolute top-0 bottom-0 left-0 w-0.5"
            style={{ background: PORTAL.ORANGE_PRIMARY, boxShadow: `0 0 12px ${PORTAL.ORANGE_PRIMARY}` }}
            aria-hidden="true"
          />
          <div
            className="absolute top-0 bottom-0 right-0 w-0.5"
            style={{ background: PORTAL.BLUE_PRIMARY, boxShadow: `0 0 12px ${PORTAL.BLUE_PRIMARY}` }}
            aria-hidden="true"
          />
        </>
      )}

      {/* Chamber number */}
      <div
        className="absolute -top-3 -right-3 w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold"
        style={{
          background: color,
          color: PORTAL.CAUTION_BLACK,
          boxShadow: `0 0 20px ${color}70`,
        }}
        aria-hidden="true"
      >
        {String(index + 1).padStart(2, '0')}
      </div>

      {project.featured && (
        <span
          className="text-[9px] tracking-[0.15em] uppercase"
          style={{ color: PORTAL.CAUTION_YELLOW }}
        >
          * FEATURED TEST
        </span>
      )}

      <h3
        id={`project-${project.id}`}
        className="text-sm font-semibold mt-1"
        style={{ color }}
      >
        {project.name}
      </h3>
      <p className="text-[11px] mb-2 mt-1" style={{ color: PORTAL.DIRTY_LIGHT }}>
        {project.tagline}
      </p>

      {project.impact && (
        <p
          className="text-[11px] italic mb-3 px-2 py-1"
          style={{
            color: PORTAL.BLUE_PRIMARY,
            background: `${PORTAL.BLUE_PRIMARY}10`,
            borderLeft: `2px solid ${PORTAL.BLUE_PRIMARY}`,
          }}
        >
          {project.impact}
        </p>
      )}

      <div className="flex gap-1.5 flex-wrap">
        {project.techStack.slice(0, 4).map((tech, i) => (
          <span
            key={tech}
            className="text-[9px] px-2 py-0.5"
            style={{
              background: `${i % 2 === 0 ? PORTAL.BLUE_PRIMARY : PORTAL.ORANGE_PRIMARY}15`,
              color: i % 2 === 0 ? PORTAL.BLUE_PRIMARY : PORTAL.ORANGE_PRIMARY,
            }}
          >
            {tech}
          </span>
        ))}
      </div>
    </article>
  )
}

// Experience card
function ExperienceCard({ entry, index }: { entry: typeof EXPERIENCE_DATA[0]; index: number }) {
  const isOrange = index % 2 === 0
  const color = isOrange ? PORTAL.ORANGE_PRIMARY : PORTAL.BLUE_PRIMARY
  const endDisplay = entry.endDate ? new Date(entry.endDate).getFullYear() : 'PRESENT'
  const startDisplay = new Date(entry.startDate).getFullYear()

  return (
    <article
      className="p-5"
      style={{
        background: `linear-gradient(180deg, ${PORTAL.CHAMBER_DARK}, ${PORTAL.VOID_BLACK})`,
        border: `1px solid ${color}30`,
      }}
      aria-labelledby={`exp-${entry.id}`}
    >
      <div className="flex justify-between items-start mb-3 flex-wrap gap-2">
        <div>
          <h4
            id={`exp-${entry.id}`}
            className="text-sm font-medium"
            style={{ color: PORTAL.PANEL_WHITE }}
          >
            {entry.title}
          </h4>
          <p className="text-xs mt-0.5" style={{ color }}>
            {entry.organization}
          </p>
        </div>
        <span
          className="text-xs tracking-wider px-2 py-1"
          style={{
            background: `${color}15`,
            color,
          }}
        >
          {startDisplay} - {endDisplay}
        </span>
      </div>
      <p className="text-xs mb-3" style={{ color: PORTAL.DIRTY_LIGHT }}>
        {entry.description}
      </p>
      {entry.highlights && entry.highlights.length > 0 && (
        <ul className="space-y-2" role="list">
          {entry.highlights.map((highlight, i) => (
            <li
              key={i}
              className="text-xs flex items-start gap-3"
              style={{ color: PORTAL.PANEL_WHITE }}
            >
              <span
                className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{
                  background: i % 2 === 0 ? PORTAL.BLUE_PRIMARY : PORTAL.ORANGE_PRIMARY,
                  boxShadow: `0 0 6px ${i % 2 === 0 ? PORTAL.BLUE_PRIMARY : PORTAL.ORANGE_PRIMARY}`,
                }}
                aria-hidden="true"
              />
              {highlight}
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

// Venture/Company card
function VentureCard({ company }: { company: typeof COMPANIES[0] }) {
  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-5 transition-all hover:scale-[1.02] group"
      style={{
        background: `linear-gradient(180deg, ${PORTAL.CHAMBER_DARK}, ${PORTAL.VOID_BLACK})`,
        border: `1px solid ${PORTAL.BLUE_PRIMARY}30`,
      }}
      aria-label={`${company.name} - ${company.tagline}`}
    >
      <div className="flex items-center gap-4 mb-3">
        <span className="text-2xl" aria-hidden="true">{company.icon}</span>
        <div>
          <h4
            className="text-sm group-hover:text-cyan-400 transition-colors"
            style={{ color: PORTAL.PANEL_WHITE }}
          >
            {company.name}
          </h4>
          <p className="text-[11px]" style={{ color: PORTAL.ORANGE_PRIMARY }}>{company.tagline}</p>
        </div>
      </div>
      <p className="text-xs mb-3" style={{ color: PORTAL.DIRTY_LIGHT }}>{company.description}</p>
      <div className="flex flex-wrap gap-1.5">
        {company.services.slice(0, 4).map((service) => (
          <span
            key={service}
            className="text-[9px] px-2 py-0.5"
            style={{
              background: `${PORTAL.BLUE_PRIMARY}15`,
              color: PORTAL.BLUE_PRIMARY,
            }}
          >
            {service}
          </span>
        ))}
      </div>
    </a>
  )
}

// Band card
function MusicChamberCard({ band }: { band: typeof BANDS[0] }) {
  const content = (
    <article
      className="p-5 transition-all hover:scale-[1.02] group"
      style={{
        background: `linear-gradient(180deg, ${PORTAL.CHAMBER_DARK}, ${PORTAL.VOID_BLACK})`,
        border: `1px solid ${PORTAL.ORANGE_PRIMARY}30`,
      }}
      aria-labelledby={`band-${band.id}`}
    >
      <h4
        id={`band-${band.id}`}
        className="text-sm group-hover:text-orange-400 transition-colors"
        style={{ color: PORTAL.PANEL_WHITE }}
      >
        {band.name}
      </h4>
      <p className="text-[11px] mt-1" style={{ color: PORTAL.ORANGE_PRIMARY }}>
        {band.genre} | {band.role}
      </p>
      <p className="text-xs mt-2" style={{ color: PORTAL.DIRTY_LIGHT }}>{band.description}</p>
      {!band.url && (
        <p className="text-xs mt-2 italic" style={{ color: PORTAL.DIRTY_MID }}>
          [AUDIO LOGS PENDING]
        </p>
      )}
    </article>
  )

  if (band.url) {
    return (
      <a
        href={band.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
        aria-label={`${band.name} - ${band.genre}`}
      >
        {content}
      </a>
    )
  }
  return content
}

// ============================================================================
// MAIN THEME COMPONENT
// ============================================================================

export default function NeonPortalsTheme() {
  const { theme } = useTheme()
  const { active, setActive, config } = useProfession()
  const [mounted, setMounted] = useState(false)
  const prefersReducedMotion = usePrefersReducedMotion()

  const aboutData = ABOUT_DATA[active]
  const engineerTech = getEngineerSkills()
  const otherSkills = getSkillsByProfession(active)
  const projects = PROJECTS_DATA.filter(p => p.professions.includes(active) || p.featured)
  const experience = filterExperienceByProfession(EXPERIENCE_DATA, active)

  const portalPositions = {
    engineer: { x: 25, y: 45 },
    drummer: { x: 50, y: 35 },
    fighter: { x: 75, y: 45 },
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: PORTAL.VOID_BLACK,
        fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif',
      }}
    >
      {/* Skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-black"
      >
        Skip to main content
      </a>

      {/* Background */}
      <TestChamberPanelBackground />

      {/* ================================================================== */}
      {/* HEADER */}
      {/* ================================================================== */}
      <header className="relative z-30 p-6" role="banner">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="flex items-center gap-6">
            <ApertureLogoSVG
              size={55}
              color={PORTAL.PANEL_WHITE}
              className={prefersReducedMotion ? '' : 'spin-very-slow'}
            />
            <div>
              <h1
                className="text-2xl md:text-3xl tracking-wide font-light"
                style={{
                  color: PORTAL.PANEL_WHITE,
                  textShadow: `0 0 30px ${PORTAL.BLUE_PRIMARY}40`,
                }}
              >
                ALEXANDER PULIDO
              </h1>
              <p className="text-sm mt-1" style={{ color: PORTAL.BLUE_PRIMARY }}>
                {PROFESSIONAL_SUMMARY.headline}
              </p>
              <p className="text-xs mt-1 italic" style={{ color: PORTAL.ORANGE_PRIMARY }}>
                {PROFESSIONAL_SUMMARY.tagline}
              </p>
            </div>
          </div>

          <nav className="flex gap-3 items-center" aria-label="Main navigation">
            <Link
              href="/cv"
              className="px-4 py-2 text-sm tracking-wider transition-all hover:scale-105"
              style={{
                background: `${PORTAL.BLUE_PRIMARY}15`,
                border: `2px solid ${PORTAL.BLUE_PRIMARY}`,
                color: PORTAL.BLUE_PRIMARY,
                boxShadow: `0 0 20px ${PORTAL.BLUE_PRIMARY}25`,
              }}
              aria-label="View CV"
            >
              VIEW CV
            </Link>
            <Link
              href="/personal-projects/game-engine"
              className="px-4 py-2 text-sm tracking-wider transition-all hover:scale-105"
              style={{
                background: PORTAL.ORANGE_PRIMARY,
                color: PORTAL.CAUTION_BLACK,
                boxShadow: `0 0 25px ${PORTAL.ORANGE_PRIMARY}50`,
              }}
              aria-label="Play Game Engine Demo"
            >
              PLAY DEMO
            </Link>
            <ThemeSwitcher />
          </nav>
        </div>
      </header>

      {/* Current Roles */}
      <section className="relative z-20 py-4 px-6" aria-label="Current roles">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            {CURRENT_ROLES.map((role, i) => (
              <div
                key={role.id}
                className="text-center px-4 md:px-6 py-2"
                style={{
                  borderLeft: i > 0 ? `1px solid ${PORTAL.BLUE_PRIMARY}25` : 'none',
                }}
              >
                <p
                  className="text-xs tracking-wider"
                  style={{ color: i % 2 === 0 ? PORTAL.BLUE_PRIMARY : PORTAL.ORANGE_PRIMARY }}
                >
                  {role.title}
                </p>
                <p className="text-sm mt-1" style={{ color: PORTAL.PANEL_WHITE }}>{role.company}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portal selection */}
      <section className="relative z-20 h-[340px]" aria-label="Select profession">
        <div className="relative max-w-4xl mx-auto h-full">
          <div className="absolute top-0 left-1/2 -translate-x-1/2" aria-hidden="true">
            <div
              className="inline-flex items-center gap-2 px-4 py-1"
              style={{
                background: `repeating-linear-gradient(
                  -45deg,
                  ${PORTAL.CAUTION_YELLOW}30,
                  ${PORTAL.CAUTION_YELLOW}30 8px,
                  transparent 8px,
                  transparent 16px
                )`,
                border: `1px solid ${PORTAL.CAUTION_YELLOW}50`,
              }}
            >
              <span className="text-xs font-bold tracking-wider" style={{ color: PORTAL.CAUTION_YELLOW }}>
                SELECT TESTING PROTOCOL
              </span>
            </div>
          </div>

          {(['engineer', 'drummer', 'fighter'] as const).map((prof) => (
            <PortalRing
              key={prof}
              profession={prof}
              isActive={active === prof}
              onClick={() => setActive(prof)}
              position={portalPositions[prof]}
            />
          ))}

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-20" aria-hidden="true">
            <CompanionCube size={35} glowing />
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* MAIN CONTENT - NEW LAYOUT ORDER */}
      {/* ================================================================== */}
      <main id="main-content" className="relative z-20">
        <div className="max-w-5xl mx-auto px-6 space-y-0">

          {/* 1. ABOUT */}
          <TestChamberSection
            title="Test Subject Profile"
            warning="CLEARANCE LEVEL: AUTHORIZED"
            variant="clean"
          >
            <p className="text-sm leading-relaxed mb-5" style={{ color: PORTAL.PANEL_WHITE }}>
              {aboutData.bio}
            </p>
            <div className="flex flex-wrap gap-2" role="list" aria-label="Quick facts">
              {aboutData.quickFacts.map((fact, i) => (
                <span
                  key={i}
                  className="text-xs px-3 py-1.5"
                  style={{
                    background: `${i % 2 === 0 ? PORTAL.BLUE_PRIMARY : PORTAL.ORANGE_PRIMARY}12`,
                    border: `1px solid ${i % 2 === 0 ? PORTAL.BLUE_PRIMARY : PORTAL.ORANGE_PRIMARY}`,
                    color: i % 2 === 0 ? PORTAL.BLUE_PRIMARY : PORTAL.ORANGE_PRIMARY,
                  }}
                  role="listitem"
                >
                  {fact}
                </span>
              ))}
            </div>
          </TestChamberSection>

          {/* 2. ART SECTION - Portals */}
          <ArtSectionPortals />

          {/* 3. WORK EXPERIENCE */}
          {experience.length > 0 && (
            <TestChamberSection title="Testing History" variant="scuffed">
              <div className="space-y-4">
                {experience.map((entry, i) => (
                  <ExperienceCard key={entry.id} entry={entry} index={i} />
                ))}
              </div>
            </TestChamberSection>
          )}

          {/* 4. ART SECTION - Companion Cube & Turrets */}
          <ArtSectionCubeAndTurrets />

          {/* 5. TECH STACK / SKILLS */}
          <TestChamberSection
            title={active === 'engineer' ? 'Equipment Specifications' : 'Subject Capabilities'}
            variant="clean"
          >
            {active === 'engineer' ? (
              <TechTerminal categories={engineerTech} />
            ) : (
              <SkillsPanel categories={otherSkills} />
            )}
          </TestChamberSection>

          {/* 6. FEATURED WORK */}
          <TestChamberSection title="Test Chambers" warning="RESULTS VERIFIED" variant="scuffed">
            <div className="grid md:grid-cols-2 gap-5">
              {projects.filter(p => p.featured).slice(0, 6).map((project, i) => (
                <TestChamberCard key={project.id} project={project} index={i} />
              ))}
            </div>
          </TestChamberSection>

          {/* 7. ART SECTION - Test Chamber Elements */}
          <ArtSectionTestChamber />

          {/* 8. VENTURES (Engineer) */}
          {active === 'engineer' && (
            <TestChamberSection title="Enrichment Ventures" variant="overgrown">
              <div className="grid md:grid-cols-3 gap-5">
                {COMPANIES.map((company) => (
                  <VentureCard key={company.id} company={company} />
                ))}
              </div>
            </TestChamberSection>
          )}

          {/* 9. BANDS (Drummer) */}
          {active === 'drummer' && (
            <TestChamberSection title="Audio Test Subjects" variant="overgrown">
              <div className="grid md:grid-cols-3 gap-5">
                {BANDS.map((band) => (
                  <MusicChamberCard key={band.id} band={band} />
                ))}
              </div>
            </TestChamberSection>
          )}

          {/* 10. POSTS placeholder - add when data available */}
        </div>
      </main>

      {/* ================================================================== */}
      {/* FOOTER */}
      {/* ================================================================== */}
      <footer className="relative z-20 py-10 text-center mt-8" role="contentinfo">
        <CautionStripe height={4} className="mb-8" />
        <div className="flex items-center justify-center gap-5">
          <ApertureLogoSVG size={28} color={PORTAL.DIRTY_MID} />
          <div>
            <p
              className="text-xs tracking-[0.3em]"
              style={{ color: PORTAL.DIRTY_MID }}
            >
              APERTURE SCIENCE ENRICHMENT CENTER
            </p>
            <p
              className="text-sm tracking-wider mt-1 italic"
              style={{ color: PORTAL.DIRTY_DARK }}
            >
              "We do what we must because we can"
            </p>
          </div>
        </div>
        <p className="text-[9px] mt-4" style={{ color: PORTAL.DIRTY_DARK }}>
          TEST CHAMBER MMXXVI | ALL RIGHTS RESERVED
        </p>
      </footer>

      {/* ================================================================== */}
      {/* CSS ANIMATIONS */}
      {/* ================================================================== */}
      <style jsx global>{`
        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* Portal glow animations */
        @keyframes portal-glow-pulse {
          0%, 100% {
            opacity: 0.5;
            filter: brightness(1);
          }
          50% {
            opacity: 0.8;
            filter: brightness(1.3);
          }
        }

        .portal-glow-orange,
        .portal-glow-blue {
          animation: portal-glow-pulse 2.5s ease-in-out infinite;
        }

        .portal-ring-pulse {
          animation: portal-glow-pulse 2s ease-in-out infinite;
        }

        .portal-inner-ring {
          animation: portal-glow-pulse 1.8s ease-in-out infinite;
        }

        /* Portal particles */
        @keyframes portal-particle-float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.6;
          }
          50% {
            transform: translate(3px, -8px) scale(1.2);
            opacity: 0.3;
          }
        }

        .portal-particle {
          animation: portal-particle-float 2s ease-in-out infinite;
        }

        /* Portal pulse for selection */
        @keyframes portal-pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.06);
            opacity: 0.75;
          }
        }

        .portal-pulse {
          animation: portal-pulse 3s ease-in-out infinite;
        }

        /* Slow spin */
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        @keyframes spin-very-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .spin-very-slow {
          animation: spin-very-slow 25s linear infinite;
        }

        /* Turret eye */
        @keyframes turret-eye-pulse {
          0%, 100% {
            opacity: 1;
            filter: brightness(1.5) drop-shadow(0 0 8px #ff0000);
          }
          50% {
            opacity: 0.6;
            filter: brightness(1) drop-shadow(0 0 4px #ff0000);
          }
        }

        .turret-eye-active {
          animation: turret-eye-pulse 0.4s ease-in-out infinite;
        }

        /* Laser beam flicker */
        @keyframes laser-flicker {
          0%, 100% { opacity: 0.8; }
          25% { opacity: 0.5; }
          50% { opacity: 0.9; }
          75% { opacity: 0.4; }
        }

        .laser-beam {
          animation: laser-flicker 0.15s linear infinite;
        }

        /* Companion cube glow */
        @keyframes cube-glow {
          0%, 100% {
            filter: drop-shadow(0 0 10px ${PORTAL.GLADOS_PINK}60);
          }
          50% {
            filter: drop-shadow(0 0 20px ${PORTAL.GLADOS_PINK}90);
          }
        }

        .companion-cube-glow {
          animation: cube-glow 3s ease-in-out infinite;
        }

        /* Screen reader only */
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        .sr-only:focus,
        .sr-only:active {
          position: static;
          width: auto;
          height: auto;
          padding: inherit;
          margin: inherit;
          overflow: visible;
          clip: auto;
          white-space: normal;
        }
      `}</style>
    </div>
  )
}
