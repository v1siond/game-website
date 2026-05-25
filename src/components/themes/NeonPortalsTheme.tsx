'use client'

import { useEffect, useState } from 'react'
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

// Portal game colors - authentic Aperture Science palette
const PORTAL_ORANGE = '#FF6B00'
const PORTAL_BLUE = '#00A0FF'
const APERTURE_WHITE = '#f5f5f5'
const APERTURE_GREY = '#d4d4d4'
const PANEL_DARK = '#1a1a1e'
const WARNING_YELLOW = '#ffc107'
const CAUTION_BLACK = '#1a1a1a'

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
// APERTURE SCIENCE VISUAL COMPONENTS - CSS/SVG ONLY
// ============================================================================

// Aperture Science logo - authentic iris design
function ApertureLogoSVG({
  size = 60,
  color = APERTURE_WHITE,
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
      {/* Iris blades - 9 segments like the real logo */}
      {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((angle, i) => (
        <path
          key={i}
          d="M50,50 L50,8 Q58,8 65,15 L50,50"
          fill={color}
          opacity={0.85}
          transform={`rotate(${angle} 50 50)`}
        />
      ))}
      {/* Center circle */}
      <circle cx="50" cy="50" r="12" fill="none" stroke={color} strokeWidth="2" />
    </svg>
  )
}

// Companion Cube decorative element - pure SVG
function CompanionCube({
  size = 40,
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
      {/* Outer cube */}
      <rect x="10" y="10" width="80" height="80" fill={APERTURE_GREY} stroke="#999" strokeWidth="2" rx="4" />
      {/* Inner square */}
      <rect x="25" y="25" width="50" height="50" fill="#ccc" stroke="#aaa" strokeWidth="2" rx="2" />
      {/* Heart */}
      <path
        d="M50,40 C45,32 35,32 35,42 C35,52 50,60 50,60 C50,60 65,52 65,42 C65,32 55,32 50,40"
        fill="#ff69b4"
        stroke="#cc5599"
        strokeWidth="2"
      />
      {/* Corner circles */}
      {[
        { cx: 20, cy: 20 },
        { cx: 80, cy: 20 },
        { cx: 20, cy: 80 },
        { cx: 80, cy: 80 },
      ].map((pos, i) => (
        <circle key={i} cx={pos.cx} cy={pos.cy} r="6" fill="#aaa" stroke="#888" strokeWidth="1" />
      ))}
    </svg>
  )
}

// Turret silhouette - authentic Portal turret shape
function TurretSilhouette({
  size = 80,
  active = false,
  side = 'left',
}: {
  size?: number
  active?: boolean
  side?: 'left' | 'right'
}) {
  const transform = side === 'right' ? 'scaleX(-1)' : ''

  return (
    <svg
      width={size * 0.5}
      height={size}
      viewBox="0 0 50 100"
      style={{ transform }}
      role="img"
      aria-label={`Aperture Science Sentry Turret${active ? ' - Active' : ''}`}
    >
      <title>Aperture Science Sentry Turret</title>
      {/* Tripod legs */}
      <line x1="15" y1="85" x2="8" y2="100" stroke={APERTURE_WHITE} strokeWidth="3" strokeLinecap="round" />
      <line x1="35" y1="85" x2="42" y2="100" stroke={APERTURE_WHITE} strokeWidth="3" strokeLinecap="round" />
      <line x1="25" y1="85" x2="25" y2="100" stroke={APERTURE_WHITE} strokeWidth="3" strokeLinecap="round" />

      {/* Main body */}
      <ellipse cx="25" cy="55" rx="16" ry="32" fill={APERTURE_WHITE} stroke={APERTURE_GREY} strokeWidth="2" />

      {/* Aperture logo marking */}
      <circle cx="25" cy="65" r="5" fill="none" stroke="#ccc" strokeWidth="1" />

      {/* Eye housing */}
      <ellipse cx="25" cy="35" rx="8" ry="6" fill={PANEL_DARK} />

      {/* Eye - red when active */}
      <circle
        cx="25"
        cy="35"
        r="3"
        fill={active ? '#ff0000' : '#550000'}
        className={active ? 'turret-eye-active' : ''}
      />

      {/* Targeting laser when active */}
      {active && (
        <line
          x1="25"
          y1="35"
          x2={side === 'left' ? '150' : '-100'}
          y2="35"
          stroke="#ff0000"
          strokeWidth="1"
          strokeDasharray="4,4"
          className="laser-beam"
          opacity="0.6"
        />
      )}
    </svg>
  )
}

// Warning sign component
function WarningSign({
  text = 'CAUTION',
  subtext,
}: {
  text?: string
  subtext?: string
}) {
  return (
    <div
      className="warning-sign"
      role="img"
      aria-label={`Warning: ${text}${subtext ? ` - ${subtext}` : ''}`}
    >
      <div
        className="flex items-center gap-2 px-3 py-1"
        style={{
          background: `repeating-linear-gradient(45deg, ${WARNING_YELLOW}, ${WARNING_YELLOW} 10px, ${CAUTION_BLACK} 10px, ${CAUTION_BLACK} 20px)`,
        }}
      >
        <span className="bg-black px-2 py-0.5 text-yellow-400 text-xs font-bold tracking-wider">
          {text}
        </span>
        {subtext && (
          <span className="bg-black px-2 py-0.5 text-white text-sm">
            {subtext}
          </span>
        )}
      </div>
    </div>
  )
}

// "The cake is a lie" graffiti SVG
function CakeIsALieGraffiti({ className = '' }: { className?: string }) {
  return (
    <div
      className={`graffiti-text ${className}`}
      role="img"
      aria-label="The cake is a lie - graffiti"
      style={{
        fontFamily: 'monospace',
        fontSize: '10px',
        color: '#8b4513',
        textShadow: '1px 1px 0 #5a2d0a',
        letterSpacing: '-0.5px',
        transform: 'rotate(-2deg)',
        opacity: 0.6,
      }}
    >
      the cake is a lie
    </div>
  )
}

// Test chamber panel grid background - clean white panels with scuffs
function TestChamberPanels() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0"
      role="presentation"
      aria-hidden="true"
    >
      {/* Base gradient - cold chamber feel */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, ${PANEL_DARK} 0%, #0d0d12 50%, ${PANEL_DARK} 100%)`,
        }}
      />

      {/* Main panel grid - white aperture panels */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(${APERTURE_WHITE} 2px, transparent 2px),
            linear-gradient(90deg, ${APERTURE_WHITE} 2px, transparent 2px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Panel seams - larger grid */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `
            linear-gradient(${APERTURE_WHITE} 3px, transparent 3px),
            linear-gradient(90deg, ${APERTURE_WHITE} 3px, transparent 3px)
          `,
          backgroundSize: '240px 240px',
        }}
      />

      {/* Scuff marks / dirty panel overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(139, 69, 19, 0.3) 0%, transparent 15%),
            radial-gradient(circle at 70% 60%, rgba(100, 100, 100, 0.2) 0%, transparent 20%),
            radial-gradient(circle at 40% 80%, rgba(139, 69, 19, 0.25) 0%, transparent 10%),
            radial-gradient(circle at 85% 15%, rgba(80, 80, 80, 0.3) 0%, transparent 12%)
          `,
        }}
      />

      {/* Orange portal ambient glow - left side */}
      <div
        className="absolute"
        style={{
          left: 0,
          top: '30%',
          width: '200px',
          height: '40%',
          background: `radial-gradient(ellipse at left, ${PORTAL_ORANGE}15 0%, transparent 70%)`,
        }}
      />

      {/* Blue portal ambient glow - right side */}
      <div
        className="absolute"
        style={{
          right: 0,
          top: '30%',
          width: '200px',
          height: '40%',
          background: `radial-gradient(ellipse at right, ${PORTAL_BLUE}15 0%, transparent 70%)`,
        }}
      />
    </div>
  )
}

// Portal SVG with authentic oval shape and glow
function PortalSVG({
  color,
  size = 100,
}: {
  color: 'orange' | 'blue'
  size?: number
}) {
  const primaryColor = color === 'orange' ? PORTAL_ORANGE : PORTAL_BLUE
  const prefersReducedMotion = usePrefersReducedMotion()

  return (
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
        <filter id={`portal-glow-filter-${color}`} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id={`portal-void-${color}`} cx="50%" cy="50%">
          <stop offset="0%" stopColor="#050508" />
          <stop offset="80%" stopColor="#000000" />
        </radialGradient>
        <linearGradient id={`portal-rim-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primaryColor} stopOpacity="1" />
          <stop offset="30%" stopColor={primaryColor} stopOpacity="0.7" />
          <stop offset="70%" stopColor={primaryColor} stopOpacity="0.7" />
          <stop offset="100%" stopColor={primaryColor} stopOpacity="1" />
        </linearGradient>
      </defs>

      {/* Outer glow ring */}
      <ellipse
        cx="35" cy="50" rx="34" ry="49"
        fill="none"
        stroke={primaryColor}
        strokeWidth="12"
        opacity="0.3"
        filter={`url(#portal-glow-filter-${color})`}
        className="portal-outer-glow"
      />

      {/* Main portal rim */}
      <ellipse
        cx="35" cy="50" rx="28" ry="42"
        fill="none"
        stroke={`url(#portal-rim-${color})`}
        strokeWidth="6"
      />

      {/* Inner glow ring */}
      <ellipse
        cx="35" cy="50" rx="24" ry="38"
        fill="none"
        stroke={primaryColor}
        strokeWidth="2"
        opacity="0.8"
        className="portal-inner-ring"
      />

      {/* Portal void - the dark interior */}
      <ellipse
        cx="35" cy="50" rx="21" ry="35"
        fill={`url(#portal-void-${color})`}
      />

      {/* Inner highlight */}
      <ellipse
        cx="35" cy="50" rx="18" ry="30"
        fill="none"
        stroke={primaryColor}
        strokeWidth="1"
        opacity="0.4"
      />
    </svg>
  )
}

// Ambient particles - portal energy wisps (non-blocking, decorative only)
function AmbientParticles() {
  const [particles, setParticles] = useState<Array<{
    id: number
    x: number
    y: number
    size: number
    delay: number
    isOrange: boolean
  }>>([])
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion) {
      setParticles([])
      return
    }
    setParticles(
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 4,
        isOrange: Math.random() > 0.5,
      }))
    )
  }, [prefersReducedMotion])

  if (prefersReducedMotion) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[1]" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full portal-particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.isOrange ? PORTAL_ORANGE : PORTAL_BLUE,
            boxShadow: `0 0 ${p.size * 4}px ${p.isOrange ? PORTAL_ORANGE : PORTAL_BLUE}`,
            animationDelay: `${p.delay}s`,
            opacity: 0.5,
          }}
        />
      ))}
    </div>
  )
}

// Static portal scene - decorative portals on sides (NO scroll-tracking test subject)
function PortalDecoration() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-10 overflow-hidden"
      role="presentation"
      aria-hidden="true"
    >
      {/* Orange portal - LEFT side */}
      <div
        className="absolute"
        style={{
          left: '3%',
          top: '45%',
          transform: 'translateY(-50%)',
        }}
      >
        <PortalSVG color="orange" size={100} />
      </div>

      {/* Blue portal - RIGHT side */}
      <div
        className="absolute"
        style={{
          right: '3%',
          top: '45%',
          transform: 'translateY(-50%)',
        }}
      >
        <PortalSVG color="blue" size={100} />
      </div>

      {/* Companion cubes as decoration */}
      <div className="absolute bottom-20 left-[15%] opacity-20">
        <CompanionCube size={30} />
      </div>
      <div className="absolute bottom-32 right-[20%] opacity-15">
        <CompanionCube size={25} />
      </div>

      {/* Graffiti decorations */}
      <div className="absolute bottom-40 left-[8%]">
        <CakeIsALieGraffiti />
      </div>
      <div className="absolute top-[60%] right-[12%]">
        <CakeIsALieGraffiti className="rotate-3" />
      </div>
    </div>
  )
}

// Robot sentry turrets - decorative
function RobotSentry({ side }: { side: 'left' | 'right' }) {
  const { scrollProgress } = useSmoothScroll(0.1)
  const prefersReducedMotion = usePrefersReducedMotion()

  const rotation = prefersReducedMotion ? 0 : scrollProgress * 60 - 30
  const active = scrollProgress > 0.1 && scrollProgress < 0.9

  return (
    <div
      className={`fixed ${side === 'left' ? 'left-3' : 'right-3'} bottom-16 z-20`}
      style={{
        transform: side === 'right' ? 'scaleX(-1)' : 'none',
      }}
      role="img"
      aria-label="Aperture Science Sentry Turret"
    >
      <div
        className={prefersReducedMotion ? '' : 'transition-transform duration-300 ease-out'}
        style={{
          transformOrigin: 'center 70%',
          transform: `rotate(${rotation * 0.3}deg)`,
        }}
      >
        <TurretSilhouette size={80} active={active} side={side} />
      </div>
      {active && (
        <div
          className="absolute -top-6 left-1/2 -translate-x-1/2 text-sm whitespace-nowrap glados-text"
          style={{ color: '#ff3333' }}
          aria-hidden="true"
        >
          TARGET ACQUIRED
        </div>
      )}
    </div>
  )
}

// ============================================================================
// CV CONTENT COMPONENTS - PORTAL STYLED TEST CHAMBER CARDS
// ============================================================================

// Aperture Science test chamber card - clean white panels with portal glow edges
function TestChamberSection({
  children,
  title,
  icon,
  warning,
  variant = 'clean',
  glowColor = 'blue',
}: {
  children: React.ReactNode
  title: string
  icon?: React.ReactNode
  warning?: string
  variant?: 'clean' | 'scuffed' | 'overgrown'
  glowColor?: 'blue' | 'orange' | 'both'
}) {
  const glowStyle = {
    blue: `0 0 30px ${PORTAL_BLUE}20, inset 0 0 60px ${PORTAL_BLUE}05`,
    orange: `0 0 30px ${PORTAL_ORANGE}20, inset 0 0 60px ${PORTAL_ORANGE}05`,
    both: `0 0 20px ${PORTAL_BLUE}15, 0 0 20px ${PORTAL_ORANGE}15, inset 0 0 40px ${PORTAL_BLUE}03, inset 0 0 40px ${PORTAL_ORANGE}03`,
  }

  const borderColor = glowColor === 'orange' ? PORTAL_ORANGE : glowColor === 'both' ? PORTAL_BLUE : PORTAL_BLUE

  return (
    <section
      className="relative chamber-section"
      aria-labelledby={`section-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      {/* Caution stripe borders - top and bottom */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{
          background: `repeating-linear-gradient(90deg, ${WARNING_YELLOW}, ${WARNING_YELLOW} 8px, ${CAUTION_BLACK} 8px, ${CAUTION_BLACK} 16px)`,
        }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-1"
        style={{
          background: `repeating-linear-gradient(90deg, ${CAUTION_BLACK}, ${CAUTION_BLACK} 8px, ${WARNING_YELLOW} 8px, ${WARNING_YELLOW} 16px)`,
        }}
        aria-hidden="true"
      />

      {/* Portal glow edges - left (orange) and right (blue) */}
      <div
        className="absolute top-0 bottom-0 left-0 w-1"
        style={{
          background: `linear-gradient(180deg, ${PORTAL_ORANGE}60, ${PORTAL_ORANGE}30, ${PORTAL_ORANGE}60)`,
          boxShadow: `0 0 15px ${PORTAL_ORANGE}40`,
        }}
        aria-hidden="true"
      />
      <div
        className="absolute top-0 bottom-0 right-0 w-1"
        style={{
          background: `linear-gradient(180deg, ${PORTAL_BLUE}60, ${PORTAL_BLUE}30, ${PORTAL_BLUE}60)`,
          boxShadow: `0 0 15px ${PORTAL_BLUE}40`,
        }}
        aria-hidden="true"
      />

      {/* Section header */}
      <div className="flex items-center gap-4 mb-6 pt-4 px-6">
        <div
          className="flex-1 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${PORTAL_ORANGE}50)` }}
          aria-hidden="true"
        />
        <div className="flex items-center gap-3">
          {icon || <ApertureLogoSVG size={18} color={PORTAL_BLUE} />}
          <h2
            id={`section-${title.toLowerCase().replace(/\s+/g, '-')}`}
            className="text-sm tracking-[0.25em] uppercase font-medium glados-text"
            style={{ color: PORTAL_BLUE }}
          >
            {title}
          </h2>
        </div>
        <div
          className="flex-1 h-px"
          style={{ background: `linear-gradient(90deg, ${PORTAL_BLUE}50, transparent)` }}
          aria-hidden="true"
        />
      </div>

      {/* Optional warning */}
      {warning && (
        <div className="mb-4 flex justify-center px-6">
          <WarningSign text="NOTICE" subtext={warning} />
        </div>
      )}

      {/* Content panel - white panel grid texture */}
      <div
        className="p-6 relative"
        style={{
          background: `
            linear-gradient(180deg, ${PANEL_DARK}f8, #0c0c10f8),
            repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(255,255,255,0.02) 39px, rgba(255,255,255,0.02) 40px),
            repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(255,255,255,0.02) 39px, rgba(255,255,255,0.02) 40px)
          `,
          boxShadow: glowStyle[glowColor],
        }}
      >
        {/* Scuff overlay for 'scuffed' variant */}
        {variant === 'scuffed' && (
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage: `
                radial-gradient(circle at 15% 20%, rgba(139, 69, 19, 0.5) 0%, transparent 10%),
                radial-gradient(circle at 80% 70%, rgba(100, 100, 100, 0.4) 0%, transparent 15%),
                radial-gradient(circle at 50% 90%, rgba(139, 69, 19, 0.3) 0%, transparent 8%)
              `,
            }}
            aria-hidden="true"
          />
        )}

        {/* Overgrown overlay for 'overgrown' variant */}
        {variant === 'overgrown' && (
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.04]"
            style={{
              backgroundImage: `
                radial-gradient(circle at 10% 80%, rgba(34, 139, 34, 0.4) 0%, transparent 20%),
                radial-gradient(circle at 90% 20%, rgba(34, 139, 34, 0.3) 0%, transparent 15%),
                radial-gradient(circle at 30% 50%, rgba(107, 142, 35, 0.2) 0%, transparent 10%)
              `,
            }}
            aria-hidden="true"
          />
        )}

        {children}
      </div>
    </section>
  )
}

// GLaDOS-style text formatting
function GladosText({
  children,
  variant = 'normal',
}: {
  children: React.ReactNode
  variant?: 'normal' | 'emphasis' | 'warning' | 'success'
}) {
  const colors = {
    normal: APERTURE_WHITE,
    emphasis: PORTAL_BLUE,
    warning: PORTAL_ORANGE,
    success: '#00ff88',
  }

  return (
    <span
      className="glados-text"
      style={{ color: colors[variant] }}
    >
      {children}
    </span>
  )
}

// Portal Ring - profession selection (VISIBLE IMMEDIATELY)
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
    engineer: { primary: PORTAL_BLUE, secondary: '#0077cc' },
    drummer: { primary: PORTAL_ORANGE, secondary: '#cc5500' },
    fighter: { primary: '#00ff88', secondary: '#00cc66' },
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
      {/* Outer portal glow */}
      <div
        className={`absolute rounded-full ${prefersReducedMotion ? '' : 'portal-pulse'}`}
        style={{
          width: '150px',
          height: '210px',
          background: `radial-gradient(ellipse, ${color.primary}30, transparent 70%)`,
          opacity: isActive ? 0.9 : 0.4,
          filter: 'blur(12px)',
          margin: '-55px -25px',
        }}
        aria-hidden="true"
      />

      {/* Portal ring */}
      <div
        className="relative flex items-center justify-center"
        style={{
          width: '100px',
          height: '140px',
          background: `radial-gradient(ellipse at 50% 50%, ${color.primary}15, transparent 70%)`,
          border: `4px solid ${color.primary}`,
          borderRadius: '50%',
          boxShadow: `
            0 0 35px ${color.primary}60,
            0 0 70px ${color.primary}30,
            inset 0 0 50px ${color.primary}20
          `,
        }}
      >
        {/* Inner swirl */}
        <div
          className={`absolute inset-4 rounded-full ${prefersReducedMotion ? '' : 'spin-slow'} opacity-40`}
          style={{
            background: `conic-gradient(from 0deg, transparent, ${color.primary}, transparent, ${color.secondary}, transparent)`,
          }}
          aria-hidden="true"
        />

        {/* Portal void */}
        <div
          className="absolute rounded-full"
          style={{
            width: '65px',
            height: '95px',
            background: `radial-gradient(ellipse, #080810, #000)`,
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

// Tech stack display - NO 1-5 BARS, show achievements/impact
function TechTerminal({ categories }: { categories: ReturnType<typeof getEngineerSkills> }) {
  return (
    <div className="space-y-8" role="list" aria-label="Technical Skills">
      {categories.slice(0, 6).map((category, catIndex) => (
        <div key={category.name} role="listitem">
          <h3
            className="text-xs tracking-[0.15em] mb-4 flex items-center gap-3 uppercase"
            style={{ color: catIndex % 2 === 0 ? PORTAL_BLUE : PORTAL_ORANGE }}
          >
            <span className="text-sm">{category.icon}</span>
            <span className="glados-text">{category.name}</span>
            <span
              className="flex-1 h-px ml-2"
              style={{ background: `linear-gradient(90deg, ${catIndex % 2 === 0 ? PORTAL_BLUE : PORTAL_ORANGE}30, transparent)` }}
              aria-hidden="true"
            />
          </h3>
          <div className="flex flex-wrap gap-2" role="list">
            {category.items.map((tech, i) => (
              <span
                key={tech}
                className="px-3 py-1.5 text-xs transition-all hover:scale-105 cursor-default"
                style={{
                  background: `${i % 2 === 0 ? PORTAL_BLUE : PORTAL_ORANGE}12`,
                  border: `1px solid ${i % 2 === 0 ? PORTAL_BLUE : PORTAL_ORANGE}35`,
                  color: APERTURE_WHITE,
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

// Skills panel for drummer/fighter - NO PROFICIENCY BARS
function SkillsPanel({ categories }: { categories: ReturnType<typeof getSkillsByProfession> }) {
  return (
    <div className="grid md:grid-cols-3 gap-8" role="list" aria-label="Skills">
      {categories.map((category, catIndex) => (
        <div key={category.name} role="listitem">
          <h3
            className="text-xs tracking-[0.15em] mb-4 flex items-center gap-2 uppercase glados-text"
            style={{ color: catIndex % 2 === 0 ? PORTAL_BLUE : PORTAL_ORANGE }}
          >
            <span>{category.icon}</span>
            {category.name}
          </h3>
          <ul className="space-y-3" role="list">
            {category.skills.map((skill, i) => (
              <li
                key={skill.name}
                className="text-sm flex items-center gap-3"
                style={{ color: APERTURE_WHITE }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: i % 2 === 0 ? PORTAL_BLUE : PORTAL_ORANGE,
                    boxShadow: `0 0 8px ${i % 2 === 0 ? PORTAL_BLUE : PORTAL_ORANGE}`,
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

// Project card - test chamber style with portal glow
function TestChamberCard({ project, index }: { project: typeof PROJECTS_DATA[0]; index: number }) {
  const [hovered, setHovered] = useState(false)
  const isOrange = index % 2 === 0
  const color = isOrange ? PORTAL_ORANGE : PORTAL_BLUE

  return (
    <article
      className="relative p-5 cursor-pointer transition-all duration-300 group"
      style={{
        background: `
          linear-gradient(180deg, ${PANEL_DARK}, #0a0a0e),
          repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(255,255,255,0.015) 19px, rgba(255,255,255,0.015) 20px),
          repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(255,255,255,0.015) 19px, rgba(255,255,255,0.015) 20px)
        `,
        border: `2px solid ${hovered ? color : '#2a2a30'}`,
        boxShadow: hovered ? `0 0 40px ${color}30, inset 0 0 40px ${color}08` : 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-labelledby={`project-${project.id}`}
    >
      {/* Portal glow edge on hover */}
      {hovered && (
        <>
          <div
            className="absolute top-0 bottom-0 left-0 w-0.5"
            style={{ background: PORTAL_ORANGE, boxShadow: `0 0 10px ${PORTAL_ORANGE}` }}
            aria-hidden="true"
          />
          <div
            className="absolute top-0 bottom-0 right-0 w-0.5"
            style={{ background: PORTAL_BLUE, boxShadow: `0 0 10px ${PORTAL_BLUE}` }}
            aria-hidden="true"
          />
        </>
      )}

      {/* Chamber number badge */}
      <div
        className="absolute -top-3 -right-3 w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold"
        style={{
          background: color,
          color: '#000',
          boxShadow: `0 0 20px ${color}70`,
        }}
        aria-hidden="true"
      >
        {String(index + 1).padStart(2, '0')}
      </div>

      {project.featured && (
        <span
          className="text-[9px] tracking-[0.15em] uppercase"
          style={{ color: WARNING_YELLOW }}
        >
          * FEATURED TEST
        </span>
      )}

      <h3
        id={`project-${project.id}`}
        className="text-sm font-semibold mt-1 glados-text"
        style={{ color }}
      >
        {project.name}
      </h3>
      <p className="text-[11px] mb-2 mt-1" style={{ color: '#999' }}>
        {project.tagline}
      </p>

      {/* Impact statement - key metric */}
      {project.impact && (
        <p
          className="text-[11px] italic mb-3 px-2 py-1"
          style={{
            color: PORTAL_BLUE,
            background: `${PORTAL_BLUE}10`,
            borderLeft: `2px solid ${PORTAL_BLUE}`,
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
              background: `${i % 2 === 0 ? PORTAL_BLUE : PORTAL_ORANGE}15`,
              color: i % 2 === 0 ? PORTAL_BLUE : PORTAL_ORANGE,
            }}
          >
            {tech}
          </span>
        ))}
      </div>
    </article>
  )
}

// Company card
function VentureCard({ company }: { company: typeof COMPANIES[0] }) {
  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-5 transition-all hover:scale-[1.02] group"
      style={{
        background: `linear-gradient(180deg, ${PANEL_DARK}, #0a0a0e)`,
        border: `1px solid ${PORTAL_BLUE}30`,
      }}
      aria-label={`${company.name} - ${company.tagline}`}
    >
      <div className="flex items-center gap-4 mb-3">
        <span className="text-2xl" aria-hidden="true">{company.icon}</span>
        <div>
          <h4 className="text-sm group-hover:text-cyan-400 transition-colors glados-text" style={{ color: APERTURE_WHITE }}>
            {company.name}
          </h4>
          <p className="text-[11px]" style={{ color: PORTAL_ORANGE }}>{company.tagline}</p>
        </div>
      </div>
      <p className="text-xs mb-3" style={{ color: '#888' }}>{company.description}</p>
      <div className="flex flex-wrap gap-1.5">
        {company.services.slice(0, 4).map((service, i) => (
          <span
            key={service}
            className="text-[9px] px-2 py-0.5"
            style={{
              background: `${PORTAL_BLUE}15`,
              color: PORTAL_BLUE,
            }}
          >
            {service}
          </span>
        ))}
      </div>
    </a>
  )
}

// Experience card - FULLY VISIBLE
function ExperienceCard({ entry, index }: { entry: typeof EXPERIENCE_DATA[0]; index: number }) {
  const isOrange = index % 2 === 0
  const color = isOrange ? PORTAL_ORANGE : PORTAL_BLUE
  const endDisplay = entry.endDate ? new Date(entry.endDate).getFullYear() : 'PRESENT'
  const startDisplay = new Date(entry.startDate).getFullYear()

  return (
    <article
      className="p-5"
      style={{
        background: `linear-gradient(180deg, ${PANEL_DARK}, #0a0a0e)`,
        border: `1px solid ${color}25`,
      }}
      aria-labelledby={`exp-${entry.id}`}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4
            id={`exp-${entry.id}`}
            className="text-sm font-medium glados-text"
            style={{ color: APERTURE_WHITE }}
          >
            {entry.title}
          </h4>
          <p className="text-xs mt-0.5" style={{ color }}>
            {entry.organization}
          </p>
        </div>
        <span
          className="text-sm tracking-wider px-2 py-1"
          style={{
            background: `${color}15`,
            color,
          }}
        >
          {startDisplay} - {endDisplay}
        </span>
      </div>
      <p className="text-xs mb-3" style={{ color: '#999' }}>
        {entry.description}
      </p>
      {entry.highlights && entry.highlights.length > 0 && (
        <ul className="space-y-2" role="list">
          {entry.highlights.map((highlight, i) => (
            <li
              key={i}
              className="text-xs flex items-start gap-3"
              style={{ color: APERTURE_WHITE }}
            >
              <span
                className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{
                  background: i % 2 === 0 ? PORTAL_BLUE : PORTAL_ORANGE,
                  boxShadow: `0 0 6px ${i % 2 === 0 ? PORTAL_BLUE : PORTAL_ORANGE}`,
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

// Band card - FULLY VISIBLE
function MusicChamberCard({ band }: { band: typeof BANDS[0] }) {
  const content = (
    <article
      className="p-5 transition-all hover:scale-[1.02] group"
      style={{
        background: `linear-gradient(180deg, ${PANEL_DARK}, #0a0a0e)`,
        border: `1px solid ${PORTAL_ORANGE}30`,
      }}
      aria-labelledby={`band-${band.id}`}
    >
      <h4
        id={`band-${band.id}`}
        className="text-sm group-hover:text-orange-400 transition-colors glados-text"
        style={{ color: APERTURE_WHITE }}
      >
        {band.name}
      </h4>
      <p className="text-[11px] mt-1" style={{ color: PORTAL_ORANGE }}>
        {band.genre} | {band.role}
      </p>
      <p className="text-xs mt-2" style={{ color: '#888' }}>{band.description}</p>
      {!band.url && (
        <p className="text-sm mt-2 italic" style={{ color: '#666' }}>
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
// MAIN THEME COMPONENT - ALL CONTENT IMMEDIATELY VISIBLE
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
        background: `linear-gradient(180deg, #08080c, #0d0d12, #08080c)`,
        fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif',
      }}
    >
      {/* Skip link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-black"
      >
        Skip to main content
      </a>

      {/* Background elements */}
      <TestChamberPanels />
      <AmbientParticles />

      {/* Static portal decoration */}
      <PortalDecoration />

      {/* Robot sentries */}
      <RobotSentry side="left" />
      <RobotSentry side="right" />

      {/* Header - IMMEDIATELY VISIBLE */}
      <header className="relative z-30 p-6" role="banner">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="flex items-center gap-6">
            <ApertureLogoSVG size={55} color={APERTURE_WHITE} className={prefersReducedMotion ? '' : 'spin-very-slow'} />
            <div>
              <h1
                className="text-2xl md:text-3xl tracking-wide font-light glados-text"
                style={{
                  color: APERTURE_WHITE,
                  textShadow: `0 0 30px ${PORTAL_BLUE}40`,
                }}
              >
                ALEXANDER PULIDO
              </h1>
              <p className="text-sm mt-1" style={{ color: PORTAL_BLUE }}>
                {PROFESSIONAL_SUMMARY.headline}
              </p>
              <p className="text-xs mt-1 italic" style={{ color: PORTAL_ORANGE }}>
                {PROFESSIONAL_SUMMARY.tagline}
              </p>
            </div>
          </div>

          <nav className="flex gap-3 items-center" aria-label="Main navigation">
            <Link
              href="/cv"
              className="px-4 py-2 text-sm tracking-wider transition-all hover:scale-105"
              style={{
                background: `${PORTAL_BLUE}15`,
                border: `2px solid ${PORTAL_BLUE}`,
                color: PORTAL_BLUE,
                boxShadow: `0 0 20px ${PORTAL_BLUE}25`,
              }}
              aria-label="View CV"
            >
              VIEW CV
            </Link>
            <Link
              href="/personal-projects/game-engine"
              className="px-4 py-2 text-sm tracking-wider transition-all hover:scale-105"
              style={{
                background: PORTAL_ORANGE,
                color: '#000',
                boxShadow: `0 0 25px ${PORTAL_ORANGE}50`,
              }}
              aria-label="Play Game Engine Demo"
            >
              PLAY DEMO
            </Link>
            <ThemeSwitcher />
          </nav>
        </div>
      </header>

      {/* Current Roles - IMMEDIATELY VISIBLE */}
      <section className="relative z-20 py-4 px-6" aria-label="Current roles">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            {CURRENT_ROLES.map((role, i) => (
              <div
                key={role.id}
                className="text-center px-4 md:px-6 py-2"
                style={{
                  borderLeft: i > 0 ? `1px solid ${PORTAL_BLUE}25` : 'none',
                }}
              >
                <p
                  className="text-xs tracking-wider glados-text"
                  style={{ color: i % 2 === 0 ? PORTAL_BLUE : PORTAL_ORANGE }}
                >
                  {role.title}
                </p>
                <p className="text-sm mt-1" style={{ color: APERTURE_WHITE }}>{role.company}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portal selection area - IMMEDIATELY VISIBLE */}
      <section
        className="relative z-20 h-[340px]"
        aria-label="Select profession"
      >
        <div className="relative max-w-4xl mx-auto h-full">
          {/* Caution stripe decoration */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32" aria-hidden="true">
            <WarningSign text="SELECT" subtext="TESTING PROTOCOL" />
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

          {/* Companion cube decoration */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-20" aria-hidden="true">
            <CompanionCube size={35} glowing />
          </div>
        </div>
      </section>

      {/* Main content - ALL IMMEDIATELY VISIBLE */}
      <main id="main-content" className="relative z-20 px-6 py-8">
        <div className="max-w-5xl mx-auto space-y-10">
          {/* About - VISIBLE */}
          <TestChamberSection title="Test Subject Profile" warning="CLEARANCE LEVEL: AUTHORIZED" variant="clean" glowColor="both">
            <p className="text-sm leading-relaxed mb-5 glados-text" style={{ color: APERTURE_WHITE }}>
              {aboutData.bio}
            </p>
            <div className="flex flex-wrap gap-2" role="list" aria-label="Quick facts">
              {aboutData.quickFacts.map((fact, i) => (
                <span
                  key={i}
                  className="text-xs px-3 py-1.5"
                  style={{
                    background: `${i % 2 === 0 ? PORTAL_BLUE : PORTAL_ORANGE}12`,
                    border: `1px solid ${i % 2 === 0 ? PORTAL_BLUE : PORTAL_ORANGE}`,
                    color: i % 2 === 0 ? PORTAL_BLUE : PORTAL_ORANGE,
                  }}
                  role="listitem"
                >
                  {fact}
                </span>
              ))}
            </div>
          </TestChamberSection>

          {/* Work Experience - VISIBLE */}
          {experience.length > 0 && (
            <TestChamberSection title="Testing History" variant="scuffed" glowColor="orange">
              <div className="space-y-4">
                {experience.map((entry, i) => (
                  <ExperienceCard key={entry.id} entry={entry} index={i} />
                ))}
              </div>
            </TestChamberSection>
          )}

          {/* Tech Stack / Skills - VISIBLE */}
          <TestChamberSection
            title={active === 'engineer' ? 'Equipment Specifications' : 'Subject Capabilities'}
            variant="clean"
            glowColor="blue"
          >
            {active === 'engineer' ? (
              <TechTerminal categories={engineerTech} />
            ) : (
              <SkillsPanel categories={otherSkills} />
            )}
          </TestChamberSection>

          {/* Projects - VISIBLE */}
          <TestChamberSection title="Test Chambers" warning="RESULTS VERIFIED" variant="scuffed" glowColor="both">
            <div className="grid md:grid-cols-2 gap-5">
              {projects.filter(p => p.featured).slice(0, 6).map((project, i) => (
                <TestChamberCard key={project.id} project={project} index={i} />
              ))}
            </div>
          </TestChamberSection>

          {/* Companies (Engineer) - VISIBLE */}
          {active === 'engineer' && (
            <TestChamberSection title="Enrichment Ventures" variant="overgrown" glowColor="blue">
              <div className="grid md:grid-cols-3 gap-5">
                {COMPANIES.map((company) => (
                  <VentureCard key={company.id} company={company} />
                ))}
              </div>
            </TestChamberSection>
          )}

          {/* Bands (Drummer) - VISIBLE */}
          {active === 'drummer' && (
            <TestChamberSection title="Audio Test Subjects" variant="overgrown" glowColor="orange">
              <div className="grid md:grid-cols-3 gap-5">
                {BANDS.map((band) => (
                  <MusicChamberCard key={band.id} band={band} />
                ))}
              </div>
            </TestChamberSection>
          )}
        </div>
      </main>

      {/* Footer - VISIBLE */}
      <footer className="relative z-20 py-10 text-center" role="contentinfo">
        <div className="flex items-center justify-center gap-5">
          <ApertureLogoSVG size={28} color="#444" />
          <div>
            <p className="text-xs tracking-[0.3em]" style={{ color: '#444' }}>
              APERTURE SCIENCE ENRICHMENT CENTER
            </p>
            <p className="text-sm tracking-wider mt-1" style={{ color: '#333' }}>
              "WE DO WHAT WE MUST BECAUSE WE CAN"
            </p>
          </div>
        </div>
        <p className="text-[9px] mt-4" style={{ color: '#333' }}>
          TEST CHAMBER MMXXVI | ALL RIGHTS RESERVED
        </p>
      </footer>

      {/* CSS Animations with reduced motion support */}
      <style jsx global>{`
        /* Reduced motion: disable all animations */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* GLaDOS-style text */
        .glados-text {
          font-weight: 400;
          letter-spacing: 0.02em;
        }

        /* Chamber section styling */
        .chamber-section {
          position: relative;
        }

        /* Portal glow animations */
        @keyframes portal-glow-pulse {
          0%, 100% {
            opacity: 0.4;
            filter: brightness(1);
          }
          50% {
            opacity: 0.7;
            filter: brightness(1.2);
          }
        }

        .portal-glow-orange,
        .portal-glow-blue {
          animation: portal-glow-pulse 2.5s ease-in-out infinite;
        }

        .portal-glow-orange .portal-outer-glow {
          animation: portal-glow-pulse 2s ease-in-out infinite;
        }

        .portal-glow-blue .portal-outer-glow {
          animation: portal-glow-pulse 2.8s ease-in-out infinite;
        }

        .portal-inner-ring {
          animation: portal-glow-pulse 1.8s ease-in-out infinite;
        }

        /* Ambient particle float */
        @keyframes portal-float {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.5;
          }
          50% {
            transform: translateY(-20px) translateX(8px);
            opacity: 0.2;
          }
        }

        .portal-particle {
          animation: portal-float 5s ease-in-out infinite;
        }

        /* Portal ring pulse */
        @keyframes portal-pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.4;
          }
          50% {
            transform: scale(1.08);
            opacity: 0.7;
          }
        }

        .portal-pulse {
          animation: portal-pulse 3.5s ease-in-out infinite;
        }

        /* Slow spin for decorative elements */
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes spin-very-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .spin-slow {
          animation: spin-slow 10s linear infinite;
        }

        .spin-very-slow {
          animation: spin-very-slow 25s linear infinite;
        }

        .aperture-logo.spin-very-slow {
          animation: spin-very-slow 25s linear infinite;
        }

        /* Turret eye pulse */
        @keyframes turret-eye-pulse {
          0%, 100% {
            opacity: 1;
            filter: brightness(1.5);
          }
          50% {
            opacity: 0.6;
            filter: brightness(1);
          }
        }

        .turret-eye-active {
          animation: turret-eye-pulse 0.4s ease-in-out infinite;
        }

        /* Laser beam */
        @keyframes laser-flicker {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.3; }
        }

        .laser-beam {
          animation: laser-flicker 0.3s ease-in-out infinite;
        }

        /* Companion cube glow */
        @keyframes cube-glow {
          0%, 100% {
            filter: drop-shadow(0 0 8px rgba(255, 105, 180, 0.5));
          }
          50% {
            filter: drop-shadow(0 0 15px rgba(255, 105, 180, 0.8));
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
