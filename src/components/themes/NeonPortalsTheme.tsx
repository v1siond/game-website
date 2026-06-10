'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { useTheme } from '@/themes/ThemeContext'
import { useProfession } from '@/contexts/ProfessionContext'
import { ABOUT_DATA, PROFESSIONAL_SUMMARY } from '@/data/about'
import { CURRENT_ROLES } from '@/data/roles'
import { EXPERIENCE_DATA, filterExperienceByProfession } from '@/data/experience'
import { getSkillsByProfession, getEngineerSkills } from '@/data/skills'
import { PROJECTS_DATA } from '@/data/projects'
import { COMPANIES } from '@/data/companies'
import { BANDS } from '@/data/bands'

// ============================================================================
// PORTAL COLOR PALETTE - Authentic Game Colors
// ============================================================================
const PORTAL = {
  // Portal Colors
  ORANGE: '#FF6B00',
  ORANGE_GLOW: '#FF8C00',
  BLUE: '#0077FF',
  BLUE_GLOW: '#00AAFF',

  // Test Chamber Panels
  PANEL_WHITE: '#F0F0EC',
  PANEL_CLEAN: '#E5E5E0',
  PANEL_DIRTY: '#C8C8B8',
  PANEL_SCUFFED: '#9A9A88',

  // Metal/Industrial
  METAL_LIGHT: '#AAAAAA',
  METAL_MID: '#777777',
  METAL_DARK: '#444444',

  // Caution
  CAUTION_YELLOW: '#FFD100',
  CAUTION_BLACK: '#1A1A1A',

  // Companion Cube
  CUBE_GREY: '#888888',
  CUBE_PINK: '#FF69B4',

  // Backgrounds
  VOID: '#050508',
  CHAMBER_BG: '#0A0A0C',
}

// ============================================================================
// PERFORMANCE & ACCESSIBILITY HOOKS
// ============================================================================

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

// ============================================================================
// APERTURE SCIENCE LOGO - 9-blade iris
// ============================================================================

function ApertureLogo({
  size = 60,
  color = PORTAL.PANEL_WHITE,
  className = '',
  spinning = false,
}: {
  size?: number
  color?: string
  className?: string
  spinning?: boolean
}) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const shouldSpin = spinning && !prefersReducedMotion

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`${className} ${shouldSpin ? 'aperture-spin' : ''}`}
      role="img"
      aria-label="Aperture Science Logo"
      style={{ willChange: shouldSpin ? 'transform' : 'auto' }}
    >
      <title>Aperture Science Logo</title>
      {/* 9-blade aperture iris */}
      {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((angle, i) => (
        <path
          key={i}
          d="M50,50 L50,14 Q54,12 60,15 L54,50 Z"
          fill={color}
          opacity={0.85}
          transform={`rotate(${angle} 50 50)`}
        />
      ))}
      {/* Center ring */}
      <circle cx="50" cy="50" r="12" fill="none" stroke={color} strokeWidth="2" opacity="0.7" />
      <circle cx="50" cy="50" r="6" fill={PORTAL.VOID} />
    </svg>
  )
}

// ============================================================================
// PORTAL OVAL - The iconic elliptical portal
// ============================================================================

function PortalOval({
  color,
  size = 120,
  className = '',
}: {
  color: 'orange' | 'blue'
  size?: number
  className?: string
}) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const primary = color === 'orange' ? PORTAL.ORANGE : PORTAL.BLUE
  const glow = color === 'orange' ? PORTAL.ORANGE_GLOW : PORTAL.BLUE_GLOW
  const id = `portal-${color}-${Math.random().toString(36).slice(2, 7)}`

  return (
    <div
      className={`relative ${className}`}
      style={{
        width: size * 0.6,
        height: size,
        willChange: prefersReducedMotion ? 'auto' : 'filter',
      }}
    >
      <svg
        width={size * 0.6}
        height={size}
        viewBox="0 0 60 100"
        className={prefersReducedMotion ? '' : `portal-glow-${color}`}
        role="img"
        aria-label={`${color === 'orange' ? 'Orange' : 'Blue'} Portal`}
      >
        <defs>
          <filter id={`${id}-blur`} x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
          </filter>
          <radialGradient id={`${id}-void`} cx="50%" cy="50%">
            <stop offset="0%" stopColor={PORTAL.VOID} />
            <stop offset="80%" stopColor="#000" />
            <stop offset="100%" stopColor={primary} stopOpacity="0.1" />
          </radialGradient>
        </defs>

        {/* Outer glow */}
        <ellipse
          cx="30" cy="50" rx="28" ry="48"
          fill="none"
          stroke={glow}
          strokeWidth="8"
          opacity="0.2"
          filter={`url(#${id}-blur)`}
        />

        {/* Main rim */}
        <ellipse
          cx="30" cy="50" rx="24" ry="44"
          fill="none"
          stroke={primary}
          strokeWidth="5"
          className={prefersReducedMotion ? '' : 'portal-rim-pulse'}
        />

        {/* Inner bright edge */}
        <ellipse
          cx="30" cy="50" rx="20" ry="38"
          fill="none"
          stroke={glow}
          strokeWidth="2"
        />

        {/* Void center */}
        <ellipse
          cx="30" cy="50" rx="17" ry="34"
          fill={`url(#${id}-void)`}
        />

        {/* Inner highlight */}
        <ellipse
          cx="30" cy="50" rx="14" ry="28"
          fill={PORTAL.VOID}
          opacity="0.9"
        />
      </svg>

      {/* Portal glow effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, ${primary}20 0%, transparent 70%)`,
          filter: 'blur(10px)',
        }}
        aria-hidden="true"
      />
    </div>
  )
}

// ============================================================================
// COMPANION CUBE - Grey with pink heart
// ============================================================================

function CompanionCube({ size = 80 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label="Weighted Companion Cube"
      className="companion-cube"
    >
      <title>Weighted Companion Cube</title>
      <defs>
        <linearGradient id="cube-face" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#B0B0B0" />
          <stop offset="50%" stopColor="#888888" />
          <stop offset="100%" stopColor="#606060" />
        </linearGradient>
      </defs>

      {/* Main cube body */}
      <rect x="8" y="8" width="84" height="84" fill="url(#cube-face)" rx="4" />
      <rect x="8" y="8" width="84" height="84" fill="none" stroke="#666" strokeWidth="3" rx="4" />

      {/* Corner circles */}
      {[
        { cx: 18, cy: 18 }, { cx: 82, cy: 18 },
        { cx: 18, cy: 82 }, { cx: 82, cy: 82 },
      ].map((pos, i) => (
        <g key={i}>
          <circle cx={pos.cx} cy={pos.cy} r="7" fill="#777" stroke="#555" strokeWidth="1.5" />
          <circle cx={pos.cx - 2} cy={pos.cy - 2} r="2" fill="#999" opacity="0.5" />
        </g>
      ))}

      {/* Inner recessed panel */}
      <rect x="24" y="24" width="52" height="52" fill="#808080" stroke="#666" strokeWidth="2" rx="2" />
      <rect x="30" y="30" width="40" height="40" fill="#9A9A9A" rx="1" />

      {/* Pink heart */}
      <path
        d="M50,40 C45,32 33,32 33,44 C33,56 50,66 50,66 C50,66 67,56 67,44 C67,32 55,32 50,40"
        fill={PORTAL.CUBE_PINK}
        stroke="#CC5599"
        strokeWidth="2"
      />

      {/* Heart highlight */}
      <ellipse cx="42" cy="44" rx="4" ry="3" fill="rgba(255,255,255,0.25)" transform="rotate(-20 42 44)" />
    </svg>
  )
}

// ============================================================================
// SENTRY TURRET
// ============================================================================

function SentryTurret({
  size = 100,
  active = false,
  facing = 'right',
}: {
  size?: number
  active?: boolean
  facing?: 'left' | 'right'
}) {
  const flip = facing === 'left' ? -1 : 1

  return (
    <svg
      width={size * 0.5}
      height={size}
      viewBox="0 0 50 100"
      style={{ transform: `scaleX(${flip})` }}
      role="img"
      aria-label={`Sentry Turret${active ? ' - Active' : ''}`}
    >
      <defs>
        <linearGradient id="turret-body-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#E0E0E0" />
          <stop offset="50%" stopColor="#F5F5F5" />
          <stop offset="100%" stopColor="#CCCCCC" />
        </linearGradient>
      </defs>

      {/* Tripod legs */}
      <line x1="18" y1="78" x2="8" y2="98" stroke="#DDD" strokeWidth="3" strokeLinecap="round" />
      <line x1="32" y1="78" x2="42" y2="98" stroke="#DDD" strokeWidth="3" strokeLinecap="round" />
      <line x1="25" y1="78" x2="25" y2="98" stroke="#DDD" strokeWidth="3" strokeLinecap="round" />

      {/* Main body - egg shape */}
      <ellipse cx="25" cy="50" rx="16" ry="32" fill="url(#turret-body-grad)" stroke="#BBB" strokeWidth="1.5" />

      {/* Wing panels */}
      <rect x="6" y="38" width="6" height="24" fill="#E8E8E8" stroke="#AAA" strokeWidth="1" rx="2" />
      <rect x="38" y="38" width="6" height="24" fill="#E8E8E8" stroke="#AAA" strokeWidth="1" rx="2" />

      {/* Gun barrels */}
      <rect x="3" y="46" width="3" height="8" fill="#777" rx="1" />
      <rect x="44" y="46" width="3" height="8" fill="#777" rx="1" />

      {/* Eye socket */}
      <ellipse cx="25" cy="35" rx="10" ry="8" fill={PORTAL.CAUTION_BLACK} />

      {/* Red eye */}
      <ellipse
        cx="25"
        cy="35"
        rx="4"
        ry="3"
        fill={active ? '#FF0000' : '#550000'}
        className={active ? 'turret-eye-active' : ''}
      />

      {/* Eye highlight */}
      <circle cx="23" cy="33" r="1" fill="rgba(255,255,255,0.3)" />

      {/* Laser beam when active */}
      {active && (
        <line
          x1="25"
          y1="35"
          x2={facing === 'right' ? '150' : '-100'}
          y2="35"
          stroke="#FF0000"
          strokeWidth="1.5"
          opacity="0.6"
          className="laser-beam"
        />
      )}
    </svg>
  )
}

// ============================================================================
// CAUTION STRIPE BAR
// ============================================================================

function CautionStripe({ height = 6 }: { height?: number }) {
  return (
    <div
      className="w-full"
      style={{
        height,
        background: `repeating-linear-gradient(
          -45deg,
          ${PORTAL.CAUTION_YELLOW},
          ${PORTAL.CAUTION_YELLOW} 8px,
          ${PORTAL.CAUTION_BLACK} 8px,
          ${PORTAL.CAUTION_BLACK} 16px
        )`,
      }}
      role="presentation"
      aria-hidden="true"
    />
  )
}

// ============================================================================
// "THE CAKE IS A LIE" GRAFFITI
// ============================================================================

function CakeIsALie({ variant = 'normal' }: { variant?: 'normal' | 'frantic' | 'faded' }) {
  const styles = {
    normal: { color: '#8B4513', opacity: 0.6, transform: 'rotate(-2deg)' },
    frantic: { color: '#AA3322', opacity: 0.8, transform: 'rotate(-6deg) skewX(-3deg)' },
    faded: { color: '#666655', opacity: 0.35, transform: 'rotate(1deg)' },
  }

  return (
    <div
      className="select-none pointer-events-none"
      style={{
        fontFamily: '"Courier New", monospace',
        fontSize: variant === 'frantic' ? '13px' : '10px',
        fontWeight: variant === 'frantic' ? 'bold' : 'normal',
        letterSpacing: '-0.5px',
        whiteSpace: 'nowrap',
        textShadow: '1px 1px 0 rgba(0,0,0,0.3)',
        ...styles[variant],
      }}
      role="img"
      aria-label="The cake is a lie - graffiti"
    >
      the cake is a lie
    </div>
  )
}

// ============================================================================
// TEST CHAMBER BACKGROUND
// ============================================================================

function TestChamberBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
      {/* Base void */}
      <div className="absolute inset-0" style={{ background: PORTAL.CHAMBER_BG }} />

      {/* Large panel grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(${PORTAL.PANEL_DIRTY}08 1px, transparent 1px),
            linear-gradient(90deg, ${PORTAL.PANEL_DIRTY}08 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
        }}
      />

      {/* Small panel seams */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(${PORTAL.PANEL_WHITE}04 1px, transparent 1px),
            linear-gradient(90deg, ${PORTAL.PANEL_WHITE}04 1px, transparent 1px)
          `,
          backgroundSize: '25px 25px',
        }}
      />

      {/* Scuff marks */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at 12% 20%, ${PORTAL.PANEL_SCUFFED}12 0%, transparent 8%),
            radial-gradient(ellipse at 78% 35%, ${PORTAL.PANEL_SCUFFED}10 0%, transparent 10%),
            radial-gradient(ellipse at 25% 65%, ${PORTAL.PANEL_SCUFFED}08 0%, transparent 6%),
            radial-gradient(ellipse at 85% 80%, ${PORTAL.PANEL_SCUFFED}10 0%, transparent 8%)
          `,
        }}
      />

      {/* Orange portal ambient - left edge */}
      <div
        className="absolute left-0 top-1/4 w-48 h-1/2"
        style={{
          background: `radial-gradient(ellipse at left center, ${PORTAL.ORANGE}08 0%, transparent 70%)`,
        }}
      />

      {/* Blue portal ambient - right edge */}
      <div
        className="absolute right-0 top-1/4 w-48 h-1/2"
        style={{
          background: `radial-gradient(ellipse at right center, ${PORTAL.BLUE}08 0%, transparent 70%)`,
        }}
      />
    </div>
  )
}

// ============================================================================
// ART SECTION 1: PORTAL PAIR
// ============================================================================

function ArtSectionPortals() {
  return (
    <section className="relative py-12 overflow-hidden" aria-label="Decorative portal art">
      <CautionStripe />

      <div className="relative max-w-5xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center">
          {/* Orange portal */}
          <div className="relative">
            <PortalOval color="orange" size={160} />
            {/* Energy trail */}
            <div
              className="absolute top-1/2 -right-6 w-16 h-1 -translate-y-1/2"
              style={{
                background: `linear-gradient(90deg, ${PORTAL.ORANGE}, transparent)`,
                filter: 'blur(3px)',
                opacity: 0.5,
              }}
              aria-hidden="true"
            />
          </div>

          {/* Center - Aperture logo */}
          <div className="flex flex-col items-center gap-3">
            <ApertureLogo size={70} color={PORTAL.PANEL_DIRTY} spinning />
            <div
              className="text-[10px] tracking-[0.25em] uppercase"
              style={{ color: PORTAL.PANEL_SCUFFED }}
            >
              Test Chamber Active
            </div>
          </div>

          {/* Blue portal */}
          <div className="relative">
            <PortalOval color="blue" size={160} />
            {/* Energy trail */}
            <div
              className="absolute top-1/2 -left-6 w-16 h-1 -translate-y-1/2"
              style={{
                background: `linear-gradient(-90deg, ${PORTAL.BLUE}, transparent)`,
                filter: 'blur(3px)',
                opacity: 0.5,
              }}
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Floor line */}
        <div className="mt-6 h-px relative" style={{ background: `${PORTAL.METAL_MID}30` }}>
          <div
            className="absolute left-0 w-24 h-full"
            style={{ background: `linear-gradient(90deg, ${PORTAL.ORANGE}25, transparent)` }}
          />
          <div
            className="absolute right-0 w-24 h-full"
            style={{ background: `linear-gradient(-90deg, ${PORTAL.BLUE}25, transparent)` }}
          />
        </div>
      </div>

      <CautionStripe />
    </section>
  )
}

// ============================================================================
// ART SECTION 2: CUBE & TURRETS
// ============================================================================

function ArtSectionCubeAndTurrets() {
  const [turretsActive, setTurretsActive] = useState(false)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion) return
    const interval = setInterval(() => setTurretsActive(prev => !prev), 3500)
    return () => clearInterval(interval)
  }, [prefersReducedMotion])

  return (
    <section className="relative py-12 overflow-hidden" aria-label="Decorative cube and turret art">
      <CautionStripe />

      <div className="relative max-w-4xl mx-auto px-6 py-10">
        <div className="flex justify-between items-end">
          {/* Left turret */}
          <div className="relative">
            <SentryTurret size={110} active={turretsActive} facing="right" />
            {turretsActive && (
              <div
                className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] tracking-wider"
                style={{ color: '#FF3333' }}
              >
                TARGET ACQUIRED
              </div>
            )}
          </div>

          {/* Companion cube on pedestal */}
          <div className="flex flex-col items-center">
            <CompanionCube size={90} />
            <div
              className="w-28 h-3 mt-1"
              style={{
                background: `linear-gradient(180deg, ${PORTAL.METAL_LIGHT}, ${PORTAL.METAL_MID})`,
                borderRadius: '2px 2px 0 0',
              }}
            />
            <div
              className="text-[9px] mt-3 tracking-[0.15em]"
              style={{ color: PORTAL.CUBE_PINK }}
            >
              WEIGHTED COMPANION CUBE
            </div>
          </div>

          {/* Right turret */}
          <div className="relative">
            <SentryTurret size={110} active={turretsActive} facing="left" />
            {turretsActive && (
              <div
                className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] tracking-wider"
                style={{ color: '#FF3333' }}
              >
                I SEE YOU
              </div>
            )}
          </div>
        </div>

        {/* Graffiti */}
        <div className="absolute bottom-16 left-6">
          <CakeIsALie variant="frantic" />
        </div>
        <div className="absolute top-12 right-10">
          <CakeIsALie variant="faded" />
        </div>
      </div>

      <CautionStripe />
    </section>
  )
}

// ============================================================================
// ART SECTION 3: OVERGROWN TEST CHAMBER PANELS
// ============================================================================

function ArtSectionTestChamber() {
  return (
    <section className="relative py-12 overflow-hidden" aria-label="Decorative test chamber art">
      <CautionStripe />

      <div className="relative max-w-5xl mx-auto px-6 py-8">
        {/* Panel grid with wear */}
        <div className="relative h-40 overflow-hidden rounded-sm">
          {/* Clean panel texture */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                linear-gradient(${PORTAL.PANEL_DIRTY}10, ${PORTAL.PANEL_CLEAN}06),
                repeating-linear-gradient(0deg, transparent, transparent 29px, ${PORTAL.PANEL_WHITE}08 29px, ${PORTAL.PANEL_WHITE}08 30px),
                repeating-linear-gradient(90deg, transparent, transparent 29px, ${PORTAL.PANEL_WHITE}08 29px, ${PORTAL.PANEL_WHITE}08 30px)
              `,
            }}
          />

          {/* Dirt/scuff */}
          <div
            className="absolute left-0 bottom-0 w-1/3 h-2/3"
            style={{ background: `linear-gradient(45deg, ${PORTAL.PANEL_SCUFFED}25, transparent)` }}
          />
          <div
            className="absolute right-1/4 top-0 w-1/4 h-1/2"
            style={{ background: `radial-gradient(ellipse at center, ${PORTAL.PANEL_SCUFFED}18, transparent)` }}
          />

          {/* Overgrowth hint */}
          <div
            className="absolute left-4 bottom-0 w-24 h-16"
            style={{
              background: `linear-gradient(0deg, #228B2230, transparent)`,
              maskImage: 'linear-gradient(0deg, black 20%, transparent)',
              WebkitMaskImage: 'linear-gradient(0deg, black 20%, transparent)',
            }}
          />

          {/* Vine SVG */}
          <svg className="absolute left-10 bottom-0 w-16 h-24 opacity-25" aria-hidden="true">
            <path
              d="M8,60 Q12,45 8,30 Q6,20 12,10 M8,35 Q15,32 18,36"
              stroke="#2D5A2D"
              strokeWidth="2"
              fill="none"
            />
          </svg>

          {/* Portal glow edges */}
          <div
            className="absolute left-0 top-0 bottom-0 w-1"
            style={{
              background: `linear-gradient(180deg, ${PORTAL.ORANGE}50, ${PORTAL.ORANGE}25, ${PORTAL.ORANGE}50)`,
              boxShadow: `0 0 15px ${PORTAL.ORANGE}30`,
            }}
          />
          <div
            className="absolute right-0 top-0 bottom-0 w-1"
            style={{
              background: `linear-gradient(180deg, ${PORTAL.BLUE}50, ${PORTAL.BLUE}25, ${PORTAL.BLUE}50)`,
              boxShadow: `0 0 15px ${PORTAL.BLUE}30`,
            }}
          />

          {/* Aperture watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.02]">
            <ApertureLogo size={160} color={PORTAL.PANEL_WHITE} />
          </div>

          {/* Graffiti */}
          <div className="absolute bottom-3 right-6">
            <CakeIsALie variant="normal" />
          </div>
        </div>

        {/* GLaDOS quote */}
        <div
          className="text-center mt-6 text-xs tracking-wider italic"
          style={{ color: PORTAL.PANEL_SCUFFED }}
        >
          "We do what we must because we can"
        </div>
      </div>

      <CautionStripe />
    </section>
  )
}

// ============================================================================
// SECTION WRAPPER - Test Chamber Panel Style
// ============================================================================

function TestChamberSection({
  children,
  title,
  notice,
  id,
}: {
  children: React.ReactNode
  title: string
  notice?: string
  id: string
}) {
  return (
    <section
      className="relative"
      aria-labelledby={`section-${id}`}
    >
      {/* Top caution stripe */}
      <div
        className="h-1.5"
        style={{
          background: `repeating-linear-gradient(
            90deg,
            ${PORTAL.CAUTION_YELLOW},
            ${PORTAL.CAUTION_YELLOW} 10px,
            ${PORTAL.CAUTION_BLACK} 10px,
            ${PORTAL.CAUTION_BLACK} 20px
          )`,
        }}
        aria-hidden="true"
      />

      {/* Portal glow edges */}
      <div
        className="absolute top-1.5 bottom-1.5 left-0 w-0.5 z-10"
        style={{
          background: `linear-gradient(180deg, ${PORTAL.ORANGE}60, ${PORTAL.ORANGE}30, ${PORTAL.ORANGE}60)`,
          boxShadow: `0 0 12px ${PORTAL.ORANGE}40`,
        }}
        aria-hidden="true"
      />
      <div
        className="absolute top-1.5 bottom-1.5 right-0 w-0.5 z-10"
        style={{
          background: `linear-gradient(180deg, ${PORTAL.BLUE}60, ${PORTAL.BLUE}30, ${PORTAL.BLUE}60)`,
          boxShadow: `0 0 12px ${PORTAL.BLUE}40`,
        }}
        aria-hidden="true"
      />

      {/* Content area */}
      <div
        className="relative px-5 py-5"
        style={{
          background: `
            linear-gradient(180deg, ${PORTAL.CHAMBER_BG}f8, ${PORTAL.VOID}fc),
            repeating-linear-gradient(0deg, transparent, transparent 24px, ${PORTAL.PANEL_WHITE}03 24px, ${PORTAL.PANEL_WHITE}03 25px),
            repeating-linear-gradient(90deg, transparent, transparent 24px, ${PORTAL.PANEL_WHITE}03 24px, ${PORTAL.PANEL_WHITE}03 25px)
          `,
        }}
      >
        {/* Corner screws */}
        {['top-2 left-2', 'top-2 right-2', 'bottom-2 left-2', 'bottom-2 right-2'].map((pos, i) => (
          <div
            key={i}
            className={`absolute ${pos} w-2 h-2 rounded-full`}
            style={{
              background: `radial-gradient(circle at 35% 35%, ${PORTAL.METAL_LIGHT}, ${PORTAL.METAL_MID})`,
              boxShadow: 'inset 1px 1px 1px rgba(0,0,0,0.25)',
            }}
            aria-hidden="true"
          />
        ))}

        {/* Section header */}
        <div className="flex items-center gap-3 mb-5">
          <div
            className="flex-1 h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${PORTAL.ORANGE}35)` }}
            aria-hidden="true"
          />
          <div className="flex items-center gap-2">
            <ApertureLogo size={16} color={PORTAL.BLUE} />
            <h2
              id={`section-${id}`}
              className="text-xs tracking-[0.2em] uppercase font-medium"
              style={{ color: PORTAL.BLUE }}
            >
              {title}
            </h2>
          </div>
          <div
            className="flex-1 h-px"
            style={{ background: `linear-gradient(90deg, ${PORTAL.BLUE}35, transparent)` }}
            aria-hidden="true"
          />
        </div>

        {/* Optional notice */}
        {notice && (
          <div className="mb-4 flex justify-center">
            <div
              className="inline-flex items-center gap-2 px-3 py-1"
              style={{
                background: `repeating-linear-gradient(
                  -45deg,
                  ${PORTAL.CAUTION_YELLOW}15,
                  ${PORTAL.CAUTION_YELLOW}15 6px,
                  transparent 6px,
                  transparent 12px
                )`,
                border: `1px solid ${PORTAL.CAUTION_YELLOW}40`,
              }}
            >
              <span className="text-[9px] font-bold tracking-wider" style={{ color: PORTAL.CAUTION_YELLOW }}>
                NOTICE:
              </span>
              <span className="text-[9px]" style={{ color: PORTAL.PANEL_WHITE }}>
                {notice}
              </span>
            </div>
          </div>
        )}

        {children}
      </div>

      {/* Bottom caution stripe */}
      <div
        className="h-1.5"
        style={{
          background: `repeating-linear-gradient(
            90deg,
            ${PORTAL.CAUTION_BLACK},
            ${PORTAL.CAUTION_BLACK} 10px,
            ${PORTAL.CAUTION_YELLOW} 10px,
            ${PORTAL.CAUTION_YELLOW} 20px
          )`,
        }}
        aria-hidden="true"
      />
    </section>
  )
}

// ============================================================================
// PORTAL PROFESSION SELECTOR
// ============================================================================

function PortalSelector({
  profession,
  isActive,
  onClick,
  label,
}: {
  profession: 'engineer' | 'drummer' | 'fighter'
  isActive: boolean
  onClick: () => void
  label: string
}) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const colors = {
    engineer: { primary: PORTAL.BLUE, glow: PORTAL.BLUE_GLOW },
    drummer: { primary: PORTAL.ORANGE, glow: PORTAL.ORANGE_GLOW },
    fighter: { primary: '#00DD66', glow: '#00FF88' },
  }
  const icons = { engineer: '</>', drummer: '///', fighter: '+ +' }

  const color = colors[profession]

  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col items-center gap-2 p-4 transition-transform ${
        isActive ? 'scale-105' : 'hover:scale-102'
      }`}
      style={{ willChange: 'transform' }}
      aria-label={`Select ${label} profile${isActive ? ' (currently selected)' : ''}`}
      aria-pressed={isActive}
    >
      {/* Portal ring */}
      <div
        className={`relative flex items-center justify-center ${
          prefersReducedMotion ? '' : isActive ? 'portal-pulse' : ''
        }`}
        style={{
          width: '80px',
          height: '110px',
          border: `3px solid ${color.primary}`,
          borderRadius: '50%',
          background: `radial-gradient(ellipse at center, ${color.primary}10, transparent 70%)`,
          boxShadow: isActive
            ? `0 0 30px ${color.primary}50, 0 0 60px ${color.primary}25, inset 0 0 30px ${color.primary}10`
            : `0 0 15px ${color.primary}25`,
        }}
      >
        {/* Void center */}
        <div
          className="absolute rounded-full"
          style={{
            width: '55px',
            height: '80px',
            background: `radial-gradient(ellipse, ${PORTAL.VOID}, #000)`,
          }}
          aria-hidden="true"
        />

        {/* Icon */}
        <span
          className="relative z-10 text-lg font-mono"
          style={{ color: color.primary, textShadow: `0 0 15px ${color.primary}` }}
          aria-hidden="true"
        >
          {icons[profession]}
        </span>
      </div>

      {/* Label */}
      <span
        className="text-[10px] tracking-[0.15em] font-medium"
        style={{ color: color.primary }}
      >
        {label}
      </span>

      {/* Active indicator */}
      {isActive && (
        <div
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-sm"
          style={{ color: color.primary }}
          aria-hidden="true"
        >
          ^
        </div>
      )}
    </button>
  )
}

// ============================================================================
// TECH TERMINAL - Engineer Skills (no proficiency bars)
// ============================================================================

function TechTerminal({ categories }: { categories: ReturnType<typeof getEngineerSkills> }) {
  return (
    <div className="space-y-6" role="list" aria-label="Technical Skills">
      {categories.map((category, catIndex) => (
        <div key={category.name} role="listitem">
          <h3
            className="text-[10px] tracking-[0.12em] mb-3 flex items-center gap-2 uppercase"
            style={{ color: catIndex % 2 === 0 ? PORTAL.BLUE : PORTAL.ORANGE }}
          >
            <span className="text-sm">{category.icon}</span>
            <span>{category.name}</span>
            <span
              className="flex-1 h-px ml-1"
              style={{
                background: `linear-gradient(90deg, ${catIndex % 2 === 0 ? PORTAL.BLUE : PORTAL.ORANGE}30, transparent)`
              }}
              aria-hidden="true"
            />
          </h3>
          <div className="flex flex-wrap gap-1.5" role="list">
            {category.items.map((tech, i) => (
              <span
                key={tech}
                className="px-2 py-1 text-[10px] cursor-default transition-colors hover:brightness-110"
                style={{
                  background: `${i % 2 === 0 ? PORTAL.BLUE : PORTAL.ORANGE}10`,
                  border: `1px solid ${i % 2 === 0 ? PORTAL.BLUE : PORTAL.ORANGE}30`,
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

// ============================================================================
// SKILLS PANEL - Drummer/Fighter Skills (no proficiency bars)
// ============================================================================

function SkillsPanel({ categories }: { categories: ReturnType<typeof getSkillsByProfession> }) {
  return (
    <div className="grid md:grid-cols-3 gap-6" role="list" aria-label="Skills">
      {categories.map((category, catIndex) => (
        <div key={category.name} role="listitem">
          <h3
            className="text-[10px] tracking-[0.12em] mb-3 flex items-center gap-2 uppercase"
            style={{ color: catIndex % 2 === 0 ? PORTAL.BLUE : PORTAL.ORANGE }}
          >
            <span>{category.icon}</span>
            {category.name}
          </h3>
          <ul className="space-y-2" role="list">
            {category.skills.map((skill, i) => (
              <li
                key={skill.name}
                className="text-xs flex items-center gap-2"
                style={{ color: PORTAL.PANEL_WHITE }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{
                    background: i % 2 === 0 ? PORTAL.BLUE : PORTAL.ORANGE,
                    boxShadow: `0 0 5px ${i % 2 === 0 ? PORTAL.BLUE : PORTAL.ORANGE}`,
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

// ============================================================================
// PROJECT CARD - Test Chamber Style
// ============================================================================

function ProjectCard({ project, index }: { project: typeof PROJECTS_DATA[0]; index: number }) {
  const isOrange = index % 2 === 0
  const color = isOrange ? PORTAL.ORANGE : PORTAL.BLUE

  return (
    <article
      className="relative p-4 transition-all hover:scale-[1.01] group cursor-default"
      style={{
        background: `linear-gradient(180deg, ${PORTAL.CHAMBER_BG}, ${PORTAL.VOID})`,
        border: `1.5px solid ${PORTAL.METAL_DARK}`,
      }}
      aria-labelledby={`project-${project.id}`}
    >
      {/* Hover glow edges */}
      <div
        className="absolute top-0 bottom-0 left-0 w-px opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: PORTAL.ORANGE, boxShadow: `0 0 8px ${PORTAL.ORANGE}` }}
        aria-hidden="true"
      />
      <div
        className="absolute top-0 bottom-0 right-0 w-px opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: PORTAL.BLUE, boxShadow: `0 0 8px ${PORTAL.BLUE}` }}
        aria-hidden="true"
      />

      {/* Chamber number */}
      <div
        className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold"
        style={{
          background: color,
          color: PORTAL.CAUTION_BLACK,
          boxShadow: `0 0 12px ${color}60`,
        }}
        aria-hidden="true"
      >
        {String(index + 1).padStart(2, '0')}
      </div>

      {project.featured && (
        <span
          className="text-[8px] tracking-[0.1em] uppercase"
          style={{ color: PORTAL.CAUTION_YELLOW }}
        >
          * Featured Test
        </span>
      )}

      <h3
        id={`project-${project.id}`}
        className="text-xs font-medium mt-0.5"
        style={{ color }}
      >
        {project.name}
      </h3>
      <p className="text-[10px] mt-1 mb-1" style={{ color: PORTAL.PANEL_SCUFFED }}>
        {project.tagline}
      </p>

      {project.impact && (
        <p
          className="text-[10px] italic mb-2 px-2 py-1"
          style={{
            color: PORTAL.BLUE,
            background: `${PORTAL.BLUE}08`,
            borderLeft: `2px solid ${PORTAL.BLUE}`,
          }}
        >
          {project.impact}
        </p>
      )}

      <div className="flex gap-1 flex-wrap">
        {project.techStack.slice(0, 4).map((tech, i) => (
          <span
            key={tech}
            className="text-[8px] px-1.5 py-0.5"
            style={{
              background: `${i % 2 === 0 ? PORTAL.BLUE : PORTAL.ORANGE}12`,
              color: i % 2 === 0 ? PORTAL.BLUE : PORTAL.ORANGE,
            }}
          >
            {tech}
          </span>
        ))}
      </div>
    </article>
  )
}

// ============================================================================
// EXPERIENCE CARD
// ============================================================================

function ExperienceCard({ entry, index }: { entry: typeof EXPERIENCE_DATA[0]; index: number }) {
  const isOrange = index % 2 === 0
  const color = isOrange ? PORTAL.ORANGE : PORTAL.BLUE
  const endDisplay = entry.endDate ? new Date(entry.endDate).getFullYear() : 'PRESENT'
  const startDisplay = new Date(entry.startDate).getFullYear()

  return (
    <article
      className="p-4"
      style={{
        background: `linear-gradient(180deg, ${PORTAL.CHAMBER_BG}, ${PORTAL.VOID})`,
        border: `1px solid ${color}25`,
      }}
      aria-labelledby={`exp-${entry.id}`}
    >
      <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
        <div>
          <h4
            id={`exp-${entry.id}`}
            className="text-xs font-medium"
            style={{ color: PORTAL.PANEL_WHITE }}
          >
            {entry.title}
          </h4>
          <p className="text-[10px] mt-0.5" style={{ color }}>
            {entry.organization}
          </p>
        </div>
        <span
          className="text-[9px] tracking-wider px-1.5 py-0.5"
          style={{ background: `${color}12`, color }}
        >
          {startDisplay} - {endDisplay}
        </span>
      </div>
      <p className="text-[10px] mb-2" style={{ color: PORTAL.PANEL_SCUFFED }}>
        {entry.description}
      </p>
      {entry.highlights && entry.highlights.length > 0 && (
        <ul className="space-y-1.5" role="list">
          {entry.highlights.map((highlight, i) => (
            <li
              key={i}
              className="text-[10px] flex items-start gap-2"
              style={{ color: PORTAL.PANEL_WHITE }}
            >
              <span
                className="mt-1 w-1 h-1 rounded-full flex-shrink-0"
                style={{
                  background: i % 2 === 0 ? PORTAL.BLUE : PORTAL.ORANGE,
                  boxShadow: `0 0 4px ${i % 2 === 0 ? PORTAL.BLUE : PORTAL.ORANGE}`,
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

// ============================================================================
// VENTURE CARD
// ============================================================================

function VentureCard({ company }: { company: typeof COMPANIES[0] }) {
  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 transition-all hover:scale-[1.01] group"
      style={{
        background: `linear-gradient(180deg, ${PORTAL.CHAMBER_BG}, ${PORTAL.VOID})`,
        border: `1px solid ${PORTAL.BLUE}25`,
      }}
      aria-label={`${company.name} - ${company.tagline}`}
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="text-xl" aria-hidden="true">{company.icon}</span>
        <div>
          <h4
            className="text-xs group-hover:brightness-125 transition-all"
            style={{ color: PORTAL.PANEL_WHITE }}
          >
            {company.name}
          </h4>
          <p className="text-[9px]" style={{ color: PORTAL.ORANGE }}>{company.tagline}</p>
        </div>
      </div>
      <p className="text-[10px] mb-2" style={{ color: PORTAL.PANEL_SCUFFED }}>{company.description}</p>
      <div className="flex flex-wrap gap-1">
        {company.services.slice(0, 3).map((service) => (
          <span
            key={service}
            className="text-[8px] px-1.5 py-0.5"
            style={{ background: `${PORTAL.BLUE}12`, color: PORTAL.BLUE }}
          >
            {service}
          </span>
        ))}
      </div>
    </a>
  )
}

// ============================================================================
// BAND CARD
// ============================================================================

function BandCard({ band }: { band: typeof BANDS[0] }) {
  const content = (
    <article
      className="p-4 transition-all hover:scale-[1.01] group"
      style={{
        background: `linear-gradient(180deg, ${PORTAL.CHAMBER_BG}, ${PORTAL.VOID})`,
        border: `1px solid ${PORTAL.ORANGE}25`,
      }}
      aria-labelledby={`band-${band.id}`}
    >
      <h4
        id={`band-${band.id}`}
        className="text-xs group-hover:brightness-125 transition-all"
        style={{ color: PORTAL.PANEL_WHITE }}
      >
        {band.name}
      </h4>
      <p className="text-[9px] mt-0.5" style={{ color: PORTAL.ORANGE }}>
        {band.genre} | {band.role}
      </p>
      <p className="text-[10px] mt-1.5" style={{ color: PORTAL.PANEL_SCUFFED }}>{band.description}</p>
      {!band.url && (
        <p className="text-[9px] mt-1.5 italic" style={{ color: PORTAL.METAL_MID }}>
          [Audio logs pending]
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
  const { active, setActive } = useProfession()
  const [mounted, setMounted] = useState(false)

  const aboutData = ABOUT_DATA[active]
  const engineerTech = getEngineerSkills()
  const otherSkills = getSkillsByProfession(active)
  const projects = PROJECTS_DATA.filter(p => p.professions.includes(active) || p.featured)
  const experience = filterExperienceByProfession(EXPERIENCE_DATA, active)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div
      className="min-h-screen relative overflow-x-hidden"
      style={{
        background: PORTAL.VOID,
        fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif',
      }}
    >
      {/* Skip link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:outline-2 focus:outline-offset-2"
      >
        Skip to main content
      </a>

      {/* Background */}
      <TestChamberBackground />

      {/* ================================================================== */}
      {/* HEADER */}
      {/* ================================================================== */}
      <header className="relative z-30 p-5" role="banner">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="flex items-center gap-5">
            <ApertureLogo size={50} color={PORTAL.PANEL_WHITE} spinning />
            <div>
              <h1
                className="text-xl md:text-2xl tracking-wide font-light"
                style={{
                  color: PORTAL.PANEL_WHITE,
                  textShadow: `0 0 20px ${PORTAL.BLUE}30`,
                }}
              >
                ALEXANDER PULIDO
              </h1>
              <p className="text-xs mt-0.5" style={{ color: PORTAL.BLUE }}>
                {PROFESSIONAL_SUMMARY.headline}
              </p>
              <p className="text-[10px] mt-0.5 italic" style={{ color: PORTAL.ORANGE }}>
                {PROFESSIONAL_SUMMARY.tagline}
              </p>
            </div>
          </div>

          <nav className="flex gap-2 items-center" aria-label="Main navigation">
            <Link
              href="/cv"
              className="px-3 py-1.5 text-xs tracking-wider transition-all hover:brightness-110 focus:outline-2 focus:outline-offset-2"
              style={{
                background: `${PORTAL.BLUE}12`,
                border: `1.5px solid ${PORTAL.BLUE}`,
                color: PORTAL.BLUE,
                boxShadow: `0 0 12px ${PORTAL.BLUE}20`,
              }}
            >
              VIEW CV
            </Link>
            <Link
              href="/personal-projects/game-engine"
              className="px-3 py-1.5 text-xs tracking-wider transition-all hover:brightness-110 focus:outline-2 focus:outline-offset-2"
              style={{
                background: PORTAL.ORANGE,
                color: PORTAL.CAUTION_BLACK,
                boxShadow: `0 0 15px ${PORTAL.ORANGE}40`,
              }}
            >
              PLAY DEMO
            </Link>
          </nav>
        </div>
      </header>

      {/* Current Roles */}
      <section className="relative z-20 py-3 px-5" aria-label="Current roles">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap justify-center gap-5 md:gap-8">
            {CURRENT_ROLES.map((role, i) => (
              <div
                key={role.id}
                className="text-center px-3 md:px-5 py-1"
                style={{
                  borderLeft: i > 0 ? `1px solid ${PORTAL.BLUE}20` : 'none',
                }}
              >
                <p
                  className="text-[10px] tracking-wider"
                  style={{ color: i % 2 === 0 ? PORTAL.BLUE : PORTAL.ORANGE }}
                >
                  {role.title}
                </p>
                <p className="text-xs mt-0.5" style={{ color: PORTAL.PANEL_WHITE }}>{role.company}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portal Profession Selection */}
      <section className="relative z-20 py-8" aria-label="Select profession">
        <div className="max-w-3xl mx-auto px-5">
          {/* Selection label */}
          <div className="flex justify-center mb-6">
            <div
              className="inline-flex items-center gap-2 px-3 py-1"
              style={{
                background: `repeating-linear-gradient(
                  -45deg,
                  ${PORTAL.CAUTION_YELLOW}20,
                  ${PORTAL.CAUTION_YELLOW}20 6px,
                  transparent 6px,
                  transparent 12px
                )`,
                border: `1px solid ${PORTAL.CAUTION_YELLOW}40`,
              }}
            >
              <span className="text-[9px] font-bold tracking-wider" style={{ color: PORTAL.CAUTION_YELLOW }}>
                SELECT TESTING PROTOCOL
              </span>
            </div>
          </div>

          {/* Portals */}
          <div className="flex justify-center gap-8 md:gap-16">
            <PortalSelector
              profession="engineer"
              isActive={active === 'engineer'}
              onClick={() => setActive('engineer')}
              label="ENGINEER"
            />
            <PortalSelector
              profession="drummer"
              isActive={active === 'drummer'}
              onClick={() => setActive('drummer')}
              label="MUSICIAN"
            />
            <PortalSelector
              profession="fighter"
              isActive={active === 'fighter'}
              onClick={() => setActive('fighter')}
              label="FIGHTER"
            />
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* MAIN CONTENT - Layout: Header > About > Art > Experience > Art > Skills > Projects > Art > Ventures > Posts */}
      {/* ================================================================== */}
      <main id="main-content" className="relative z-20">
        <div className="max-w-4xl mx-auto px-5 space-y-0">

          {/* 1. ABOUT */}
          <TestChamberSection
            title="About"
            notice="CLEARANCE LEVEL: AUTHORIZED"
            id="about"
          >
            <p className="text-xs leading-relaxed mb-4" style={{ color: PORTAL.PANEL_WHITE }}>
              {aboutData.bio}
            </p>
            <div className="flex flex-wrap gap-1.5" role="list" aria-label="Quick facts">
              {aboutData.quickFacts.map((fact, i) => (
                <span
                  key={i}
                  className="text-[10px] px-2 py-1"
                  style={{
                    background: `${i % 2 === 0 ? PORTAL.BLUE : PORTAL.ORANGE}10`,
                    border: `1px solid ${i % 2 === 0 ? PORTAL.BLUE : PORTAL.ORANGE}`,
                    color: i % 2 === 0 ? PORTAL.BLUE : PORTAL.ORANGE,
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

          {/* 3. EXPERIENCE */}
          {experience.length > 0 && (
            <TestChamberSection title="Work Experience" id="experience">
              <div className="space-y-3">
                {experience.map((entry, i) => (
                  <ExperienceCard key={entry.id} entry={entry} index={i} />
                ))}
              </div>
            </TestChamberSection>
          )}

          {/* 4. ART SECTION - Cube & Turrets */}
          <ArtSectionCubeAndTurrets />

          {/* 5. SKILLS */}
          <TestChamberSection
            title={active === 'engineer' ? 'Tech Stack' : 'Skills'}
            id="skills"
          >
            {active === 'engineer' ? (
              <TechTerminal categories={engineerTech} />
            ) : (
              <SkillsPanel categories={otherSkills} />
            )}
          </TestChamberSection>

          {/* 6. PROJECTS */}
          <TestChamberSection title="Featured Work" notice="RESULTS VERIFIED" id="projects">
            <div className="grid md:grid-cols-2 gap-4">
              {projects.filter(p => p.featured).slice(0, 6).map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
              ))}
            </div>
          </TestChamberSection>

          {/* 7. ART SECTION - Test Chamber Elements */}
          <ArtSectionTestChamber />

          {/* 8. VENTURES (Engineer) */}
          {active === 'engineer' && (
            <TestChamberSection title="Ventures" id="ventures">
              <div className="grid md:grid-cols-3 gap-4">
                {COMPANIES.map((company) => (
                  <VentureCard key={company.id} company={company} />
                ))}
              </div>
            </TestChamberSection>
          )}

          {/* 9. BANDS (Drummer) */}
          {active === 'drummer' && (
            <TestChamberSection title="Bands" id="bands">
              <div className="grid md:grid-cols-3 gap-4">
                {BANDS.map((band) => (
                  <BandCard key={band.id} band={band} />
                ))}
              </div>
            </TestChamberSection>
          )}

          {/* 10. POSTS - Placeholder for future blog content */}
          {/* TODO: Add posts section when data is available */}

        </div>
      </main>

      {/* ================================================================== */}
      {/* CONTACT CTA */}
      {/* ================================================================== */}
      <section className="relative z-20 py-16 px-6" aria-label="Contact">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <h2 className="text-lg tracking-[0.2em] mb-3" style={{ color: PORTAL.METAL_LIGHT }}>
              READY FOR TESTING?
            </h2>
            <p className="text-sm" style={{ color: PORTAL.METAL_MID }}>
              10+ years delivering production systems. Let&apos;s build something.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:alexanderpulido81@gmail.com"
              className="inline-flex items-center justify-center px-6 py-3 text-sm tracking-[0.15em] uppercase transition-all hover:scale-105 min-h-[44px] focus:outline-none focus-visible:ring-2"
              style={{
                background: PORTAL.ORANGE,
                color: PORTAL.PANEL_BG,
              }}
            >
              Initiate Contact
            </a>
            <Link
              href="/cv"
              className="inline-flex items-center justify-center px-6 py-3 text-sm tracking-[0.15em] uppercase transition-all hover:scale-105 min-h-[44px] focus:outline-none focus-visible:ring-2"
              style={{
                background: 'transparent',
                border: `2px solid ${PORTAL.BLUE}`,
                color: PORTAL.BLUE,
              }}
            >
              Download CV
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* ENTER ANOTHER WORLD */}
      

      {/* ================================================================== */}
      {/* FOOTER */}
      {/* ================================================================== */}
      <footer className="relative z-20 py-8 text-center mt-6" role="contentinfo">
        <CautionStripe height={3} />
        <div className="flex items-center justify-center gap-4 mt-6">
          <ApertureLogo size={24} color={PORTAL.METAL_MID} />
          <div>
            <p
              className="text-[9px] tracking-[0.25em]"
              style={{ color: PORTAL.METAL_MID }}
            >
              © {new Date().getFullYear()} Alexander Pulido
            </p>
          </div>
        </div>
      </footer>

      {/* ================================================================== */}
      {/* CSS - Performance-optimized animations */}
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

        /* Aperture logo spin - uses transform only */
        @keyframes aperture-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .aperture-spin {
          animation: aperture-spin 20s linear infinite;
        }

        /* Portal glow pulse - uses opacity and filter only */
        @keyframes portal-glow {
          0%, 100% { opacity: 0.6; filter: brightness(1); }
          50% { opacity: 0.9; filter: brightness(1.2); }
        }

        .portal-glow-orange,
        .portal-glow-blue {
          animation: portal-glow 2.5s ease-in-out infinite;
        }

        /* Portal rim pulse */
        @keyframes portal-rim-pulse {
          0%, 100% { stroke-opacity: 0.8; }
          50% { stroke-opacity: 1; }
        }

        .portal-rim-pulse {
          animation: portal-rim-pulse 2s ease-in-out infinite;
        }

        /* Portal selector pulse - uses transform only */
        @keyframes portal-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }

        .portal-pulse {
          animation: portal-pulse 2.5s ease-in-out infinite;
        }

        /* Turret eye pulse */
        @keyframes turret-eye {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .turret-eye-active {
          animation: turret-eye 0.3s ease-in-out infinite;
        }

        /* Laser flicker */
        @keyframes laser-flicker {
          0%, 100% { opacity: 0.6; }
          25% { opacity: 0.4; }
          50% { opacity: 0.8; }
          75% { opacity: 0.3; }
        }

        .laser-beam {
          animation: laser-flicker 0.1s linear infinite;
        }

        /* Companion cube subtle glow */
        @keyframes cube-glow {
          0%, 100% { filter: drop-shadow(0 0 6px ${PORTAL.CUBE_PINK}50); }
          50% { filter: drop-shadow(0 0 12px ${PORTAL.CUBE_PINK}70); }
        }

        .companion-cube {
          animation: cube-glow 3s ease-in-out infinite;
        }

        /* Screen reader utility */
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

        /* Focus indicators for accessibility */
        a:focus-visible,
        button:focus-visible {
          outline: 2px solid ${PORTAL.BLUE};
          outline-offset: 2px;
        }
      `}</style>
    </div>
  )
}
