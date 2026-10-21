'use client'

import { useEffect, useState } from 'react'
import { PORTAL } from './palette'
import { usePrefersReducedMotion } from './motion'

// ============================================================================
// APERTURE SCIENCE LOGO - 9-blade iris
// ============================================================================

export function ApertureLogo({
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

export function CautionStripe({ height = 6 }: { height?: number }) {
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

export function TestChamberBackground() {
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

export function ArtSectionPortals() {
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

export function ArtSectionCubeAndTurrets() {
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

export function ArtSectionTestChamber() {
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
          &ldquo;We do what we must because we can&rdquo;
        </div>
      </div>

      <CautionStripe />
    </section>
  )
}
