'use client'

import { useEffect, useState, useRef, useMemo, memo } from 'react'
import Link from 'next/link'
import { useTheme } from '@/themes/ThemeContext'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import { useProfession } from '@/contexts/ProfessionContext'
import { ABOUT_DATA, PROFESSIONAL_SUMMARY } from '@/data/about'
import { PROJECTS_DATA } from '@/data/projects'
import { getSkillsByProfession, getEngineerSkills } from '@/data/skills'
import { COMPANIES } from '@/data/companies'
import { BANDS } from '@/data/bands'
import { EXPERIENCE_DATA, filterExperienceByProfession } from '@/data/experience'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { SkipLink } from '@/components/themes/shared/AccessibilityStyles'

// =============================================================================
// GOD OF WAR 3 COLOR PALETTE
// Extracted from actual GOW3 menu: pure blacks, crimson blood, bronze gold
// =============================================================================
const GOW = {
  // Backgrounds - pure black, no purple tint (unlike Dark Fantasy)
  void: '#000000',
  voidDeep: '#0a0808',
  voidWarm: '#0f0c0a',        // Slight warm brown undertone

  // Blood - deep crimson/maroon, not bright red
  blood: '#6b1010',            // Main blood color
  bloodBright: '#8b1a1a',      // Highlights
  bloodDark: '#3d0808',        // Shadows
  bloodGlow: '#a02020',        // For glow effects

  // Gold - warm bronze/copper, metallic feel
  gold: '#c9a227',             // Primary gold (from GOW logo)
  goldBright: '#e8c040',       // Highlights
  goldDark: '#8a6c14',         // Shadows
  bronze: '#a67c30',           // More coppery variant

  // Ash grey - Kratos's skin, stone, mountains
  ash: '#5a5856',
  ashLight: '#7a7876',
  ashDark: '#3a3836',
  ashWarm: '#4a4644',          // Warm grey

  // Storm - brown/grey clouds, warm tones
  stormBrown: '#2a2420',       // Dark storm clouds
  stormGrey: '#3a3430',        // Mid clouds
  stormLight: '#4a4440',       // Lighter clouds

  // Lightning - pale yellow/white, not blue
  lightning: '#ffffd0',
  lightningCore: '#ffffff',

  // Fire/Chaos - orange flames from Blades
  fire: '#e05000',
  fireBright: '#ff7020',
  fireGlow: '#ff9040',

  // UI text
  bone: '#e8e0d0',             // Warm cream, not pure white
  boneLight: '#f5efe5',
  silver: '#908880',           // Warm grey
}

// =============================================================================
// PARALLAX LAYERS - Profession-specific background ornaments
// 3 layers: Far (0.15x), Mid (0.35x), Near (0.6x) scroll speed
// =============================================================================
const ParallaxLayers = memo(function ParallaxLayers({ profession }: { profession: 'engineer' | 'drummer' | 'fighter' }) {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Profession-specific ornament sets
  const ornaments = {
    engineer: {
      far: [
        { x: 5, y: 20, element: <GearSVG size={40} />, },
        { x: 92, y: 35, element: <GearSVG size={35} />, },
        { x: 8, y: 60, element: <CircuitSVG size={50} />, },
        { x: 88, y: 75, element: <GearSVG size={45} />, },
      ],
      mid: [
        { x: 3, y: 40, element: <GearSVG size={55} />, },
        { x: 95, y: 55, element: <CircuitSVG size={60} />, },
        { x: 6, y: 85, element: <GearSVG size={50} />, },
      ],
      near: [
        { x: 2, y: 30, element: <GearSVG size={70} />, },
        { x: 96, y: 65, element: <CircuitSVG size={80} />, },
      ],
    },
    drummer: {
      far: [
        { x: 5, y: 25, element: <DrumSVG size={40} />, },
        { x: 90, y: 40, element: <WaveSVG size={50} />, },
        { x: 8, y: 65, element: <DrumSVG size={35} />, },
        { x: 88, y: 80, element: <WaveSVG size={45} />, },
      ],
      mid: [
        { x: 4, y: 45, element: <WaveSVG size={60} />, },
        { x: 94, y: 60, element: <DrumSVG size={55} />, },
        { x: 6, y: 90, element: <WaveSVG size={50} />, },
      ],
      near: [
        { x: 2, y: 35, element: <DrumSVG size={75} />, },
        { x: 95, y: 70, element: <WaveSVG size={80} />, },
      ],
    },
    fighter: {
      far: [
        { x: 6, y: 20, element: <SwordSVG size={45} />, },
        { x: 91, y: 35, element: <ShieldSVG size={40} />, },
        { x: 7, y: 60, element: <SwordSVG size={35} />, },
        { x: 89, y: 80, element: <ShieldSVG size={50} />, },
      ],
      mid: [
        { x: 4, y: 40, element: <ShieldSVG size={55} />, },
        { x: 94, y: 55, element: <SwordSVG size={60} />, },
        { x: 5, y: 85, element: <ShieldSVG size={50} />, },
      ],
      near: [
        { x: 2, y: 30, element: <SwordSVG size={70} />, },
        { x: 96, y: 65, element: <ShieldSVG size={80} />, },
      ],
    },
  }

  const layers = ornaments[profession]

  return (
    <div className="fixed inset-0 pointer-events-none z-[3] overflow-hidden" aria-hidden="true">
      {/* Far layer - 0.15x speed */}
      {layers.far.map((item, i) => (
        <div
          key={`far-${i}`}
          className="absolute"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            transform: `translateY(${scrollY * 0.15}px)`,
            opacity: 0.35,
          }}
        >
          {item.element}
        </div>
      ))}

      {/* Mid layer - 0.35x speed */}
      {layers.mid.map((item, i) => (
        <div
          key={`mid-${i}`}
          className="absolute"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            transform: `translateY(${scrollY * 0.35}px)`,
            opacity: 0.45,
          }}
        >
          {item.element}
        </div>
      ))}

      {/* Near layer - 0.6x speed, most visible */}
      {layers.near.map((item, i) => (
        <div
          key={`near-${i}`}
          className="absolute"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            transform: `translateY(${scrollY * 0.6}px)`,
            opacity: 0.55,
          }}
        >
          {item.element}
        </div>
      ))}
    </div>
  )
})

// Ornament SVGs for parallax layers
const GearSVG = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill={GOW.gold} opacity="0.6">
    <path d="M20,8 L22,4 L18,4 Z M20,32 L22,36 L18,36 Z M8,20 L4,22 L4,18 Z M32,20 L36,22 L36,18 Z" />
    <circle cx="20" cy="20" r="8" fill="none" stroke={GOW.gold} strokeWidth="2" />
    <circle cx="20" cy="20" r="4" fill={GOW.gold} />
  </svg>
)

const CircuitSVG = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 50 50" fill="none" stroke={GOW.gold} strokeWidth="1.5" opacity="0.5">
    <path d="M10,25 L20,25 L25,15 L30,35 L35,25 L45,25" />
    <circle cx="10" cy="25" r="3" fill={GOW.gold} />
    <circle cx="45" cy="25" r="3" fill={GOW.gold} />
  </svg>
)

const DrumSVG = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill={GOW.fire} opacity="0.6">
    <ellipse cx="20" cy="30" rx="15" ry="6" fill="none" stroke={GOW.fire} strokeWidth="2" />
    <path d="M5,15 L5,30 M35,15 L35,30" stroke={GOW.fire} strokeWidth="2" />
    <ellipse cx="20" cy="15" rx="15" ry="6" fill={GOW.fire} opacity="0.3" />
    <line x1="10" y1="8" x2="20" y2="15" stroke={GOW.fireGlow} strokeWidth="2" />
    <line x1="30" y1="8" x2="20" y2="15" stroke={GOW.fireGlow} strokeWidth="2" />
  </svg>
)

const WaveSVG = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 50 30" fill="none" stroke={GOW.fire} strokeWidth="2" opacity="0.5">
    <path d="M5,15 Q12,5 20,15 Q28,25 35,15 Q42,5 50,15" />
    <path d="M5,20 Q12,10 20,20 Q28,30 35,20 Q42,10 50,20" opacity="0.5" />
  </svg>
)

const SwordSVG = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 20 50" fill={GOW.blood} opacity="0.6">
    <path d="M10,0 L12,35 L10,38 L8,35 Z" fill={GOW.ashLight} />
    <rect x="6" y="35" width="8" height="4" fill={GOW.gold} />
    <rect x="8" y="39" width="4" height="8" fill={GOW.goldDark} />
  </svg>
)

const ShieldSVG = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 40 50" fill={GOW.blood} opacity="0.5">
    <path d="M20,5 L35,12 L35,30 L20,45 L5,30 L5,12 Z" fill={GOW.ashDark} stroke={GOW.gold} strokeWidth="2" />
    <path d="M20,12 L28,16 L28,28 L20,38 L12,28 L12,16 Z" fill={GOW.blood} opacity="0.5" />
  </svg>
)

// =============================================================================
// FADE IN SECTION (IntersectionObserver based)
// =============================================================================
const FadeInSection = memo(function FadeInSection({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const { ref, triggered } = useSectionTrigger({
    threshold: 0.05,
    rootMargin: '100px 0px 0px 0px',
  })

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: triggered ? 1 : 0,
        transform: triggered ? 'translateY(0)' : 'translateY(30px)',
        transition: `opacity 0.6s ease-out ${delay}ms, transform 0.6s ease-out ${delay}ms`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  )
})

// =============================================================================
// GOW3 BLOOD BANNER - The iconic dripping blood frame from GOW3 menu
// =============================================================================
const BloodBanner = memo(function BloodBanner() {
  return (
    <div className="fixed top-0 left-0 right-0 h-24 z-[45] pointer-events-none" aria-hidden="true">
      <svg className="w-full h-full" viewBox="0 0 1920 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="bloodBannerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={GOW.bloodBright} stopOpacity="0.9" />
            <stop offset="40%" stopColor={GOW.blood} stopOpacity="0.8" />
            <stop offset="100%" stopColor={GOW.bloodDark} stopOpacity="0.3" />
          </linearGradient>
          <filter id="bloodDrip">
            <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" />
          </filter>
        </defs>
        {/* Main blood splash shape - jagged, dripping */}
        <path
          d="M0,0 L0,35
             Q50,40 80,55 Q100,70 120,45 Q150,60 180,50
             Q220,75 260,40 Q300,55 340,35 Q380,60 420,45
             Q480,70 540,35 Q600,50 660,40 Q720,65 780,35
             Q840,55 900,45 Q960,70 1020,40 Q1080,55 1140,35
             Q1200,60 1260,45 Q1320,70 1380,40 Q1440,55 1500,35
             Q1560,65 1620,45 Q1680,60 1740,40 Q1800,55 1860,50
             Q1890,65 1920,40 L1920,0 Z"
          fill="url(#bloodBannerGrad)"
        />
        {/* Blood drips */}
        {[120, 340, 560, 780, 1000, 1220, 1440, 1660, 1800].map((x, i) => (
          <path
            key={i}
            d={`M${x},${45 + (i % 3) * 10} Q${x - 3},${60 + (i % 4) * 15} ${x},${75 + (i % 3) * 20} Q${x + 3},${60 + (i % 4) * 15} ${x},${45 + (i % 3) * 10}`}
            fill={GOW.blood}
            opacity={0.6 + (i % 3) * 0.1}
          />
        ))}
      </svg>
    </div>
  )
})

// =============================================================================
// STORMY CLOUDS WITH LIGHTNING - Parallax background
// =============================================================================
const StormyClouds = memo(function StormyClouds() {
  const [lightning, setLightning] = useState(false)
  const [lightningPos, setLightningPos] = useState({ x: 50, y: 30 })

  useEffect(() => {
    const flashLightning = () => {
      setLightningPos({ x: 20 + Math.random() * 60, y: 10 + Math.random() * 30 })
      setLightning(true)
      setTimeout(() => setLightning(false), 150)
      setTimeout(() => {
        setLightning(true)
        setTimeout(() => setLightning(false), 100)
      }, 200)
    }

    const interval = setInterval(flashLightning, 4000 + Math.random() * 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden" aria-hidden="true">
      {/* Cloud layers */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 20% 20%, ${GOW.stormGrey}40 0%, transparent 50%),
            radial-gradient(ellipse 100% 60% at 70% 15%, ${GOW.stormBrown}50 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 50% 30%, ${GOW.stormGrey}30 0%, transparent 50%),
            radial-gradient(ellipse 90% 50% at 85% 25%, ${GOW.stormBrown}40 0%, transparent 55%)
          `,
        }}
      />

      {/* Lightning flash */}
      {lightning && (
        <>
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse at ${lightningPos.x}% ${lightningPos.y}%, ${GOW.lightning}30 0%, transparent 40%)`,
            }}
          />
          <svg
            className="absolute w-32 h-64"
            style={{ left: `${lightningPos.x}%`, top: `${lightningPos.y - 5}%` }}
            viewBox="0 0 100 200"
          >
            <path
              d="M50,0 L45,50 L60,45 L40,120 L55,115 L30,200"
              fill="none"
              stroke={GOW.lightning}
              strokeWidth="3"
              opacity="0.8"
            />
            <path
              d="M50,0 L45,50 L60,45 L40,120 L55,115 L30,200"
              fill="none"
              stroke="white"
              strokeWidth="1"
              opacity="0.9"
            />
          </svg>
        </>
      )}

      {/* Distant mountains silhouette */}
      <svg
        className="absolute bottom-0 left-0 right-0 h-48 opacity-30"
        viewBox="0 0 1920 200"
        preserveAspectRatio="none"
      >
        <path
          d="M0,200 L0,150 L200,80 L400,120 L600,60 L800,100 L1000,40 L1200,90 L1400,50 L1600,110 L1800,70 L1920,130 L1920,200 Z"
          fill={GOW.ashDark}
        />
      </svg>
    </div>
  )
})

// =============================================================================
// GREEK MEANDER PATTERN - Classic Greek key border
// =============================================================================
const GreekMeander = memo(function GreekMeander({ color = GOW.gold, opacity = 0.3 }: { color?: string; opacity?: number }) {
  return (
    <svg className="w-full h-4" viewBox="0 0 400 16" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <pattern id="meander" patternUnits="userSpaceOnUse" width="32" height="16">
          <path
            d="M0,8 L4,8 L4,4 L8,4 L8,12 L12,12 L12,0 L16,0 L16,16 L20,16 L20,4 L24,4 L24,12 L28,12 L28,8 L32,8"
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            opacity={opacity}
          />
        </pattern>
      </defs>
      <rect width="400" height="16" fill="url(#meander)" />
    </svg>
  )
})


// =============================================================================
// BLOOD SPLASH DECORATION (smaller accents)
// =============================================================================
const BloodSplash = memo(function BloodSplash({ side }: { side: 'left' | 'right' }) {
  return (
    <svg
      className={`absolute top-24 ${side === 'left' ? 'left-0' : 'right-0'} w-32 h-24 opacity-30`}
      viewBox="0 0 200 120"
      aria-hidden="true"
      style={{ transform: side === 'right' ? 'scaleX(-1)' : undefined }}
    >
      <defs>
        <linearGradient id={`bloodGrad-${side}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={GOW.bloodBright} stopOpacity="0.8" />
          <stop offset="50%" stopColor={GOW.blood} stopOpacity="0.6" />
          <stop offset="100%" stopColor={GOW.bloodDark} stopOpacity="0.3" />
        </linearGradient>
      </defs>
      {/* Dripping blood effect */}
      <path
        d="M0,0 L80,0 Q90,20 70,40 Q60,60 75,80 L60,120 Q40,100 50,70 Q55,40 30,30 L0,40 Z"
        fill={`url(#bloodGrad-${side})`}
      />
      <path
        d="M40,0 L60,0 Q50,30 55,50 L45,80 Q35,60 40,40 Q45,20 40,0 Z"
        fill={GOW.blood}
        opacity="0.5"
      />
    </svg>
  )
})

// =============================================================================
// STORM RAIN EFFECT
// =============================================================================
const StormRain = memo(function StormRain() {
  const drops = useMemo(() =>
    Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      height: Math.random() * 30 + 15,
      opacity: Math.random() * 0.2 + 0.1,
      speed: Math.random() * 0.8 + 0.5,
      delay: Math.random() * -2,
    })),
    []
  )

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[4] overflow-hidden"
      style={{ contain: 'strict' }}
      aria-hidden="true"
    >
      {drops.map((d) => (
        <div
          key={d.id}
          className="absolute w-px"
          style={{
            left: `${d.x}%`,
            top: '-40px',
            height: d.height,
            background: `linear-gradient(180deg, transparent, ${GOW.ashLight}${Math.round(d.opacity * 255).toString(16).padStart(2, '0')})`,
            animation: `stormRain ${d.speed}s linear infinite`,
            animationDelay: `${d.delay}s`,
          }}
        />
      ))}
    </div>
  )
})

// =============================================================================
// EMBER PARTICLES (from Blades of Chaos)
// =============================================================================
const EmberParticles = memo(function EmberParticles() {
  const embers = useMemo(() =>
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: 80 + Math.random() * 20,
      size: Math.random() * 4 + 2,
      speed: Math.random() * 15 + 10,
      delay: Math.random() * -10,
      color: i % 2 === 0 ? GOW.fire : GOW.fireBright,
    })),
    []
  )

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[5] overflow-hidden"
      style={{ contain: 'strict' }}
      aria-hidden="true"
    >
      {embers.map((e) => (
        <div
          key={e.id}
          className="absolute rounded-full"
          style={{
            left: `${e.x}%`,
            bottom: `${100 - e.y}%`,
            width: e.size,
            height: e.size,
            background: `radial-gradient(circle, ${e.color} 30%, ${e.color}60 60%, transparent 80%)`,
            animation: `emberRise ${e.speed}s ease-out infinite`,
            animationDelay: `${e.delay}s`,
          }}
        />
      ))}
    </div>
  )
})

// =============================================================================
// GOW3 SPARTAN FRAME FLOURISH - More aggressive Greek styling
// =============================================================================
const SpartanFlourish = memo(function SpartanFlourish({
  position,
  width = 200,
}: {
  position: 'top' | 'bottom'
  width?: number
}) {
  const isTop = position === 'top'
  const transform = isTop ? '' : 'scale(1, -1)'

  return (
    <svg
      className="absolute left-1/2 -translate-x-1/2"
      style={{
        [isTop ? 'top' : 'bottom']: '-14px',
        width: width,
        height: 28,
      }}
      viewBox="0 0 200 28"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      <g transform={transform} style={{ transformOrigin: 'center' }}>
        {/* Central Omega symbol (Kratos's mark) */}
        <path
          d="M100,4 C92,4 86,10 86,18 L90,18 C90,12 94,8 100,8 C106,8 110,12 110,18 L114,18 C114,10 108,4 100,4"
          fill={GOW.gold}
          opacity="0.8"
        />
        {/* Blood drip from omega */}
        <path
          d="M100,18 Q99,22 100,26 Q101,22 100,18"
          fill={GOW.blood}
          opacity="0.6"
        />

        {/* Left spear/blade shapes */}
        <path
          d="M82,14 L70,10 L68,14 L70,18 L82,14"
          fill={GOW.gold}
          opacity="0.5"
        />
        <path
          d="M65,14 L40,8 L38,14 L40,20 L65,14"
          fill={GOW.gold}
          opacity="0.4"
        />
        <line x1="38" y1="14" x2="10" y2="14" stroke={GOW.gold} strokeWidth="1" opacity="0.3" />

        {/* Right spear/blade shapes (mirrored) */}
        <path
          d="M118,14 L130,10 L132,14 L130,18 L118,14"
          fill={GOW.gold}
          opacity="0.5"
        />
        <path
          d="M135,14 L160,8 L162,14 L160,20 L135,14"
          fill={GOW.gold}
          opacity="0.4"
        />
        <line x1="162" y1="14" x2="190" y2="14" stroke={GOW.gold} strokeWidth="1" opacity="0.3" />

        {/* Blood accents */}
        <circle cx="55" cy="14" r="2" fill={GOW.blood} opacity="0.5" />
        <circle cx="145" cy="14" r="2" fill={GOW.blood} opacity="0.5" />
      </g>
    </svg>
  )
})

// =============================================================================
// SPARTAN FRAME - GOW3 styled content frame
// =============================================================================
const SpartanFrame = memo(function SpartanFrame({
  children,
  title,
  headingLevel = 'h2',
}: {
  children: React.ReactNode
  title: string
  headingLevel?: 'h2' | 'h3'
}) {
  const HeadingTag = headingLevel
  const headingId = `section-${title.toLowerCase().replace(/\s+/g, '-')}`

  return (
    <div className="relative pt-4 pb-4" role="region" aria-labelledby={headingId}>
      {/* Greek meander border top */}
      <GreekMeander color={GOW.gold} opacity={0.2} />

      <div
        className="relative"
        style={{
          background: `linear-gradient(180deg,
            rgba(10, 10, 12, 0.96) 0%,
            rgba(15, 12, 18, 0.92) 50%,
            rgba(10, 10, 12, 0.96) 100%
          )`,
          borderLeft: `2px solid ${GOW.bloodDark}50`,
          borderRight: `2px solid ${GOW.bloodDark}50`,
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          boxShadow: `
            inset 0 0 80px rgba(0, 0, 0, 0.6),
            inset 0 1px 0 ${GOW.gold}08,
            0 8px 32px rgba(0, 0, 0, 0.5)
          `,
        }}
      >
        <div className="pt-6 pb-4 px-6 text-center">
          <HeadingTag
            id={headingId}
            className="text-sm tracking-[0.35em] uppercase inline-block"
            style={{
              color: GOW.goldBright,
              fontWeight: 600,
              letterSpacing: '0.3em',
              textShadow: `0 0 30px ${GOW.gold}50, 0 0 60px ${GOW.gold}20, 0 2px 4px rgba(0, 0, 0, 0.8)`,
            }}
          >
            {title}
          </HeadingTag>
          {/* Blood line under title */}
          <div
            className="mt-3 mx-auto"
            style={{
              width: '60px',
              height: '2px',
              background: `linear-gradient(90deg, transparent, ${GOW.blood}, transparent)`,
              boxShadow: `0 0 10px ${GOW.blood}60`,
            }}
          />
        </div>

        <div className="px-6 pb-6">
          {children}
        </div>
      </div>

      {/* Greek meander border bottom */}
      <GreekMeander color={GOW.gold} opacity={0.2} />
    </div>
  )
})

// =============================================================================
// PROFESSION ICONS
// =============================================================================
const GearIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12,8 L14,4 L10,4 Z M12,16 L14,20 L10,20 Z M8,12 L4,14 L4,10 Z M16,12 L20,14 L20,10 Z" />
    <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
  </svg>
)

const WaveIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M4,12 Q7,8 10,12 Q13,16 16,12 Q19,8 22,12" strokeLinecap="round" />
    <path d="M4,16 Q7,12 10,16 Q13,20 16,16 Q19,12 22,16" strokeLinecap="round" opacity="0.5" />
  </svg>
)

const DiamondIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12,2 L22,12 L12,22 L2,12 Z" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M12,6 L18,12 L12,18 L6,12 Z" opacity="0.3" />
    <circle cx="12" cy="12" r="2" />
  </svg>
)

// =============================================================================
// WAYSTATION NODE (Profession selector)
// =============================================================================
const WaystationNode = memo(function WaystationNode({
  icon,
  label,
  sublabel,
  color,
  isActive,
  onClick,
  position,
}: {
  icon: React.ReactNode
  label: string
  sublabel: string
  color: string
  isActive: boolean
  onClick: () => void
  position: { x: number; y: number }
}) {
  return (
    <button
      onClick={onClick}
      className="absolute transform -translate-x-1/2 -translate-y-1/2 group min-w-[70px] md:min-w-[100px] min-h-[70px] md:min-h-[100px] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        ['--tw-ring-color' as string]: color,
        ['--tw-ring-offset-color' as string]: GOW.void,
      }}
      aria-pressed={isActive}
      aria-label={`Select ${label} - ${sublabel} profession${isActive ? ' (currently selected)' : ''}`}
      role="tab"
      tabIndex={isActive ? 0 : -1}
    >
      <div
        className={`absolute inset-0 transition-all duration-500 ${
          isActive ? 'opacity-50 scale-110' : 'opacity-0 scale-100 group-hover:opacity-30 group-hover:scale-105'
        }`}
        style={{
          background: `radial-gradient(ellipse, ${color}60 0%, ${color}30 40%, transparent 70%)`,
        }}
        aria-hidden="true"
      />
      <div
        className={`relative w-20 h-20 md:w-28 md:h-28 flex flex-col items-center justify-center transition-all duration-300 ${
          isActive ? 'scale-110' : 'group-hover:scale-105'
        }`}
        style={{
          background: `linear-gradient(180deg,
            rgba(10, 10, 12, 0.92) 0%,
            rgba(15, 13, 20, 0.88) 50%,
            rgba(10, 10, 12, 0.92) 100%
          )`,
          border: `1px solid ${isActive ? color : GOW.gold}30`,
          borderRadius: '2px',
          backdropFilter: 'blur(4px)',
          boxShadow: isActive
            ? `inset 0 0 20px rgba(0, 0, 0, 0.4), 0 0 15px ${color}40`
            : `inset 0 0 20px rgba(0, 0, 0, 0.4), 0 2px 10px rgba(0, 0, 0, 0.3)`,
        }}
      >
        <div className="mb-0.5 md:mb-1 scale-75 md:scale-100" style={{ color: isActive ? color : GOW.silver }}>
          {icon}
        </div>
        <span
          className="text-sm tracking-[0.1em] md:tracking-[0.15em] uppercase font-medium"
          style={{ color: isActive ? color : GOW.silver }}
        >
          {label}
        </span>
        <span
          className="text-sm tracking-wider opacity-70 text-center leading-tight hidden md:block"
          style={{ color: isActive ? color : GOW.silver }}
        >
          {sublabel}
        </span>
      </div>
    </button>
  )
})

// =============================================================================
// TECH CLOUD (Engineer skills)
// =============================================================================
const TechCloud = memo(function TechCloud({ categories }: { categories: ReturnType<typeof getEngineerSkills> }) {
  return (
    <div className="space-y-6">
      {categories.slice(0, 5).map((category) => (
        <div key={category.name}>
          <h3
            className="text-sm tracking-[0.15em] mb-3 flex items-center gap-2 uppercase"
            style={{ color: GOW.silver }}
          >
            <span aria-hidden="true">{category.icon}</span>
            {category.name}
          </h3>
          <ul className="flex flex-wrap gap-2" aria-label={`${category.name} technologies`}>
            {category.items.map((tech) => (
              <li
                key={tech}
                className="px-3 py-1 text-sm transition-transform hover:scale-105 cursor-default"
                style={{
                  background: `${GOW.gold}12`,
                  border: `1px solid ${GOW.gold}30`,
                  color: GOW.bone,
                  borderRadius: '3px',
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
})

// =============================================================================
// SKILLS LIST (Drummer/Fighter)
// =============================================================================
const SkillsList = memo(function SkillsList({ categories }: { categories: ReturnType<typeof getSkillsByProfession> }) {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {categories.map((category) => (
        <div key={category.name}>
          <h3
            className="text-sm tracking-[0.15em] mb-3 flex items-center gap-2 uppercase"
            style={{ color: GOW.silver }}
          >
            <span aria-hidden="true">{category.icon}</span>
            {category.name}
          </h3>
          <ul className="space-y-2" aria-label={`${category.name} skills`}>
            {category.skills.map((skill) => (
              <li key={skill.name} className="text-sm flex items-center gap-2" style={{ color: GOW.bone }}>
                <span style={{ color: GOW.blood }} aria-hidden="true">◆</span>
                {skill.name}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
})

// =============================================================================
// PROJECT CARD
// =============================================================================
const ProjectCard = memo(function ProjectCard({ project }: { project: typeof PROJECTS_DATA[0] }) {
  return (
    <article
      className="p-4 transition-transform hover:scale-[1.02] cursor-pointer group"
      style={{
        background: `linear-gradient(135deg, ${GOW.void}, ${GOW.voidWarm}50)`,
        border: `1px solid ${GOW.stormBrown}`,
        borderRadius: '4px',
      }}
      tabIndex={0}
      role="button"
      aria-label={`View ${project.name} project details`}
    >
      <h3 className="text-lg transition-colors" style={{ color: GOW.bone }}>
        {project.name}
      </h3>
      <p className="text-sm mt-2" style={{ color: GOW.silver }}>{project.tagline}</p>
      {project.impact && (
        <p className="text-sm mt-2 italic" style={{ color: GOW.gold }}>
          <span aria-hidden="true">— </span>
          <span className="sr-only">Impact: </span>{project.impact}
        </p>
      )}
      <div className="flex flex-wrap gap-1 mt-3" aria-label="Technologies used">
        {project.techStack.slice(0, 4).map((tech) => (
          <span key={tech} className="text-sm px-1 py-0.5" style={{ background: `${GOW.gold}12`, color: GOW.silver }}>
            {tech}
          </span>
        ))}
      </div>
    </article>
  )
})

// =============================================================================
// COMPANY CARD
// =============================================================================
const CompanyCard = memo(function CompanyCard({ company }: { company: typeof COMPANIES[0] }) {
  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 transition-transform hover:scale-[1.02] group min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      style={{
        background: `linear-gradient(135deg, ${GOW.void}, ${GOW.voidWarm}40)`,
        border: `1px solid ${GOW.stormBrown}`,
        borderRadius: '4px',
        ['--tw-ring-color' as string]: GOW.gold,
        ['--tw-ring-offset-color' as string]: GOW.void,
      }}
      aria-label={`${company.name} - ${company.tagline}. Opens in new tab.`}
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl" aria-hidden="true">{company.icon}</span>
        <div>
          <h3 className="text-lg transition-colors" style={{ color: GOW.bone }}>
            {company.name}
            <span className="sr-only"> (opens in new tab)</span>
          </h3>
          <p className="text-sm" style={{ color: GOW.gold }}>{company.tagline}</p>
        </div>
      </div>
      <p className="text-sm" style={{ color: GOW.silver }}>{company.description}</p>
    </a>
  )
})

// =============================================================================
// BAND CARD
// =============================================================================
const BandCard = memo(function BandCard({ band }: { band: typeof BANDS[0] }) {
  const content = (
    <article
      className="p-4 transition-transform hover:scale-[1.02] group"
      style={{
        background: `linear-gradient(135deg, ${GOW.void}, ${GOW.fire}15)`,
        border: `1px solid ${GOW.fire}40`,
        borderRadius: '4px',
      }}
    >
      <h3 className="text-lg transition-colors" style={{ color: GOW.bone }}>
        {band.name}
        {band.url && <span className="sr-only"> (opens in new tab)</span>}
      </h3>
      <p className="text-sm mt-1" style={{ color: GOW.fire }}>
        {band.genre} <span aria-hidden="true">|</span> {band.role}
      </p>
      <p className="text-sm mt-2" style={{ color: GOW.silver }}>{band.description}</p>
      {!band.url && <p className="text-sm mt-2 italic" style={{ color: GOW.silver }}>Website coming soon</p>}
    </article>
  )

  if (band.url) {
    return (
      <a
        href={band.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        style={{
          ['--tw-ring-color' as string]: GOW.fire,
          ['--tw-ring-offset-color' as string]: GOW.void,
        }}
        aria-label={`${band.name} - ${band.genre}. Opens in new tab.`}
      >
        {content}
      </a>
    )
  }
  return content
})

// =============================================================================
// EXPERIENCE CARD
// =============================================================================
const ExperienceCard = memo(function ExperienceCard({ entry, isLast }: { entry: typeof EXPERIENCE_DATA[0]; isLast?: boolean }) {
  const endDisplay = entry.endDate ? new Date(entry.endDate).getFullYear() : 'Present'
  const startDisplay = new Date(entry.startDate).getFullYear()

  return (
    <article className="py-4">
      <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
        <div>
          <h3 className="text-lg font-medium" style={{ color: GOW.bone }}>{entry.title}</h3>
          <p className="text-sm" style={{ color: GOW.gold }}>{entry.organization}</p>
        </div>
        <span className="text-sm" style={{ color: GOW.gold }}>
          <time>{startDisplay}</time> - <time>{endDisplay}</time>
        </span>
      </div>
      <p className="text-sm mb-2" style={{ color: GOW.silver }}>{entry.description}</p>
      {entry.highlights && entry.highlights.length > 0 && (
        <ul className="space-y-1" aria-label="Key achievements">
          {entry.highlights.map((highlight, i) => (
            <li key={i} className="text-sm flex items-start gap-2" style={{ color: GOW.bone }}>
              <span style={{ color: GOW.blood }} aria-hidden="true">◆</span>
              {highlight}
            </li>
          ))}
        </ul>
      )}
      {!isLast && (
        <div
          className="mt-4"
          style={{ borderBottom: `1px solid ${GOW.stormBrown}40` }}
        />
      )}
    </article>
  )
})

// =============================================================================
// ART SECTION 1 - Blades of Chaos with Chains
// =============================================================================
const ArtSectionWeapons = memo(function ArtSectionWeapons() {
  return (
    <div className="relative z-20 py-12 px-6 overflow-hidden" aria-hidden="true" role="presentation">
      <div className="max-w-6xl mx-auto relative h-40 flex items-center justify-center">
        <svg className="w-full h-full" viewBox="0 0 800 140" preserveAspectRatio="xMidYMid meet">
          {/* Left chain */}
          <g opacity="0.6">
            {Array.from({ length: 8 }, (_, i) => (
              <ellipse
                key={`left-chain-${i}`}
                cx={80 + i * 25}
                cy={70 + Math.sin(i * 0.8) * 8}
                rx="8"
                ry="12"
                fill="none"
                stroke={GOW.goldDark}
                strokeWidth="3"
                transform={`rotate(${i * 15}, ${80 + i * 25}, ${70 + Math.sin(i * 0.8) * 8})`}
              />
            ))}
          </g>

          {/* Left Blade */}
          <g transform="translate(320, 70)">
            <path d="M-60,-8 L0,-20 L10,0 L0,20 L-60,8 Z" fill={GOW.ashLight} />
            <path d="M-55,-5 L-5,-15 L5,0 L-5,15 L-55,5 Z" fill={GOW.fire} opacity="0.5" />
            <path d="M-50,0 L-10,0" stroke={GOW.fireBright} strokeWidth="2" opacity="0.8" />
            {/* Blood drip */}
            <path d="M5,0 Q8,10 5,20 Q2,10 5,0" fill={GOW.blood} opacity="0.6" />
          </g>

          {/* Central Omega */}
          <g transform="translate(400, 70)">
            <path
              d="M0,-30 C-20,-30 -35,-10 -35,15 L-25,15 C-25,-5 -15,-20 0,-20 C15,-20 25,-5 25,15 L35,15 C35,-10 20,-30 0,-30"
              fill={GOW.gold}
              opacity="0.8"
            />
            <path d="M0,15 Q-2,25 0,35 Q2,25 0,15" fill={GOW.blood} opacity="0.7" />
          </g>

          {/* Right Blade */}
          <g transform="translate(480, 70)">
            <path d="M60,-8 L0,-20 L-10,0 L0,20 L60,8 Z" fill={GOW.ashLight} />
            <path d="M55,-5 L5,-15 L-5,0 L5,15 L55,5 Z" fill={GOW.fire} opacity="0.5" />
            <path d="M50,0 L10,0" stroke={GOW.fireBright} strokeWidth="2" opacity="0.8" />
            {/* Blood drip */}
            <path d="M-5,0 Q-8,10 -5,20 Q-2,10 -5,0" fill={GOW.blood} opacity="0.6" />
          </g>

          {/* Right chain */}
          <g opacity="0.6">
            {Array.from({ length: 8 }, (_, i) => (
              <ellipse
                key={`right-chain-${i}`}
                cx={720 - i * 25}
                cy={70 + Math.sin(i * 0.8) * 8}
                rx="8"
                ry="12"
                fill="none"
                stroke={GOW.goldDark}
                strokeWidth="3"
                transform={`rotate(${-i * 15}, ${720 - i * 25}, ${70 + Math.sin(i * 0.8) * 8})`}
              />
            ))}
          </g>
        </svg>
      </div>

      {/* Greek meander divider */}
      <div className="max-w-md mx-auto">
        <GreekMeander color={GOW.blood} opacity={0.4} />
      </div>
    </div>
  )
})

// =============================================================================
// ART SECTION 2 - Greek Pillars with Blood
// =============================================================================
const ArtSectionPillars = memo(function ArtSectionPillars() {
  return (
    <div className="relative z-20 py-12 px-6 overflow-hidden" aria-hidden="true" role="presentation">
      <div className="max-w-5xl mx-auto relative h-32 flex items-center justify-center">
        <svg className="w-full h-full" viewBox="0 0 700 120" preserveAspectRatio="xMidYMid meet">
          {/* Left pillar */}
          <g transform="translate(100, 10)">
            {/* Capital */}
            <rect x="-25" y="0" width="50" height="8" fill={GOW.ashLight} />
            <rect x="-20" y="8" width="40" height="4" fill={GOW.ash} />
            {/* Shaft with flutes */}
            <rect x="-15" y="12" width="30" height="85" fill={GOW.ash} />
            {[0, 1, 2, 3, 4].map((i) => (
              <rect key={i} x={-12 + i * 6} y="15" width="2" height="80" fill={GOW.ashDark} opacity="0.4" />
            ))}
            {/* Base */}
            <rect x="-20" y="97" width="40" height="6" fill={GOW.ashLight} />
            {/* Blood drip */}
            <path d="M5,0 Q3,25 8,50 Q4,70 6,95" fill="none" stroke={GOW.blood} strokeWidth="3" opacity="0.5" />
          </g>

          {/* Center - Spartan helmet silhouette */}
          <g transform="translate(350, 60)">
            <path
              d="M0,-45 C-30,-45 -45,-25 -45,5 L-45,35 L-35,40 L-35,15 C-35,-15 -20,-35 0,-35 C20,-35 35,-15 35,15 L35,40 L45,35 L45,5 C45,-25 30,-45 0,-45"
              fill={GOW.gold}
              opacity="0.7"
            />
            {/* Crest */}
            <path
              d="M0,-45 Q-5,-55 0,-60 Q5,-55 0,-45"
              fill={GOW.blood}
              opacity="0.8"
            />
            {/* Eye slit */}
            <rect x="-30" y="0" width="60" height="6" fill={GOW.voidDeep} opacity="0.8" />
          </g>

          {/* Right pillar */}
          <g transform="translate(600, 10)">
            {/* Capital */}
            <rect x="-25" y="0" width="50" height="8" fill={GOW.ashLight} />
            <rect x="-20" y="8" width="40" height="4" fill={GOW.ash} />
            {/* Shaft with flutes */}
            <rect x="-15" y="12" width="30" height="85" fill={GOW.ash} />
            {[0, 1, 2, 3, 4].map((i) => (
              <rect key={i} x={-12 + i * 6} y="15" width="2" height="80" fill={GOW.ashDark} opacity="0.4" />
            ))}
            {/* Base */}
            <rect x="-20" y="97" width="40" height="6" fill={GOW.ashLight} />
            {/* Blood drip */}
            <path d="M-5,0 Q-3,30 -8,60 Q-4,80 -6,95" fill="none" stroke={GOW.blood} strokeWidth="3" opacity="0.5" />
          </g>

          {/* Connecting laurel wreath hints */}
          <path d="M145,50 Q200,30 280,50" fill="none" stroke={GOW.gold} strokeWidth="1" opacity="0.3" />
          <path d="M420,50 Q500,30 555,50" fill="none" stroke={GOW.gold} strokeWidth="1" opacity="0.3" />
        </svg>
      </div>

      {/* Divider */}
      <div className="max-w-xs mx-auto flex items-center gap-3 mt-4">
        <div className="flex-1 h-px" style={{ background: GOW.gold, opacity: 0.3 }} />
        <svg width="20" height="20" viewBox="0 0 20 20">
          <path d="M10,2 L18,10 L10,18 L2,10 Z" fill={GOW.blood} opacity="0.5" />
        </svg>
        <div className="flex-1 h-px" style={{ background: GOW.gold, opacity: 0.3 }} />
      </div>
    </div>
  )
})

// =============================================================================
// ART SECTION 3 - Mount Olympus / Tartarus
// =============================================================================
const ArtSectionOlympus = memo(function ArtSectionOlympus() {
  return (
    <div className="relative z-20 py-12 px-6 overflow-hidden" aria-hidden="true" role="presentation">
      <div className="max-w-6xl mx-auto relative h-36">
        <svg className="w-full h-full" viewBox="0 0 1000 140" preserveAspectRatio="xMidYMid meet">
          {/* Tartarus flames at bottom */}
          {Array.from({ length: 15 }, (_, i) => (
            <path
              key={`flame-${i}`}
              d={`M${50 + i * 65},140 Q${45 + i * 65},${120 - (i % 3) * 10} ${55 + i * 65},${100 - (i % 4) * 8} Q${50 + i * 65},${115 - (i % 3) * 5} ${50 + i * 65},140`}
              fill={i % 2 === 0 ? GOW.fire : GOW.fireBright}
              opacity={0.3 + (i % 3) * 0.1}
            />
          ))}

          {/* Mount Olympus silhouette */}
          <path
            d="M300,140 L350,90 L400,100 L450,50 L500,30 L550,50 L600,100 L650,90 L700,140"
            fill={GOW.ashDark}
            opacity="0.7"
          />

          {/* Temple at peak */}
          <g transform="translate(500, 30)">
            {/* Roof */}
            <path d="M-30,0 L0,-20 L30,0 Z" fill={GOW.gold} opacity="0.6" />
            {/* Columns */}
            <rect x="-25" y="0" width="4" height="25" fill={GOW.ashLight} opacity="0.5" />
            <rect x="-10" y="0" width="4" height="25" fill={GOW.ashLight} opacity="0.5" />
            <rect x="6" y="0" width="4" height="25" fill={GOW.ashLight} opacity="0.5" />
            <rect x="21" y="0" width="4" height="25" fill={GOW.ashLight} opacity="0.5" />
            {/* Divine glow */}
            <ellipse cx="0" cy="10" rx="40" ry="30" fill={GOW.gold} opacity="0.15" />
          </g>

          {/* Blood rivers */}
          <path
            d="M100,140 Q200,120 300,130 Q400,110 500,125"
            fill="none"
            stroke={GOW.blood}
            strokeWidth="3"
            opacity="0.3"
          />
          <path
            d="M500,125 Q600,115 700,130 Q800,120 900,140"
            fill="none"
            stroke={GOW.blood}
            strokeWidth="3"
            opacity="0.3"
          />

          {/* Chains hanging from sky */}
          {[150, 400, 600, 850].map((x, i) => (
            <g key={`chain-${i}`} opacity="0.4">
              {Array.from({ length: 4 }, (_, j) => (
                <ellipse
                  key={j}
                  cx={x}
                  cy={j * 15}
                  rx="4"
                  ry="8"
                  fill="none"
                  stroke={GOW.goldDark}
                  strokeWidth="2"
                />
              ))}
            </g>
          ))}
        </svg>

        {/* Fire glow at bottom */}
        <div
          className="absolute left-0 right-0 bottom-0 h-16"
          style={{
            background: `linear-gradient(180deg, transparent, ${GOW.fire}15)`,
          }}
        />
      </div>

      {/* Greek meander divider */}
      <div className="max-w-sm mx-auto mt-4">
        <GreekMeander color={GOW.gold} opacity={0.25} />
      </div>
    </div>
  )
})

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function MythicTheme() {
  const { theme } = useTheme()
  const { active, setActive, config } = useProfession()
  const [mounted, setMounted] = useState(false)

  const experienceTrigger = useSectionTrigger({ threshold: 0.05, rootMargin: '100px 0px 0px 0px' })
  const projectsTrigger = useSectionTrigger({ threshold: 0.05, rootMargin: '100px 0px 0px 0px' })
  const contactTrigger = useSectionTrigger({ threshold: 0.05, rootMargin: '100px 0px 0px 0px' })

  const aboutData = useMemo(() => ABOUT_DATA[active], [active])
  const engineerTech = useMemo(() => getEngineerSkills(), [])
  const otherSkills = useMemo(() => getSkillsByProfession(active), [active])
  const projects = useMemo(
    () => PROJECTS_DATA.filter(p => p.professions.includes(active) || p.featured),
    [active]
  )
  const experience = useMemo(
    () => filterExperienceByProfession(EXPERIENCE_DATA, active),
    [active]
  )

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: GOW.void }}
        role="status"
        aria-label="Loading theme"
      >
        <div className="animate-pulse text-center" style={{ color: GOW.bone }}>
          Loading...
        </div>
      </div>
    )
  }

  const professionNodes = [
    {
      id: 'engineer',
      icon: <GearIcon />,
      label: 'System',
      sublabel: 'Engineer / CTO',
      color: GOW.gold,
      position: { x: 25, y: 50 },
    },
    {
      id: 'drummer',
      icon: <WaveIcon />,
      label: 'Musician',
      sublabel: 'Pro Drummer',
      color: GOW.fire,
      position: { x: 50, y: 30 },
    },
    {
      id: 'fighter',
      icon: <DiamondIcon />,
      label: 'Martial',
      sublabel: 'Muay Thai',
      color: GOW.bloodBright,
      position: { x: 75, y: 50 },
    },
  ]

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: `linear-gradient(180deg, ${GOW.void}, ${GOW.voidDeep}, ${GOW.voidWarm})`,
      }}
    >
      <SkipLink href="#main-content" />

      {/* GOW3 Stormy clouds with lightning */}
      <StormyClouds />

      {/* Atmospheric background */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse at 50% 0%, ${GOW.stormGrey}25 0%, transparent 50%),
            radial-gradient(ellipse at 20% 70%, ${GOW.bloodDark}20 0%, transparent 40%),
            radial-gradient(ellipse at 80% 30%, ${GOW.fire}10 0%, transparent 35%),
            linear-gradient(180deg, ${GOW.void} 0%, ${GOW.voidDeep} 40%, ${GOW.voidWarm} 100%)
          `,
        }}
      />
      <StormRain />
      <EmberParticles />

      {/* GOW3 Blood banner at top */}
      <BloodBanner />

      {/* Smaller blood splash accents */}
      <BloodSplash side="left" />
      <BloodSplash side="right" />

      {/* Parallax background ornaments per profession */}
      <ParallaxLayers profession={active} />

      {/* Vignette */}
      <div
        className="fixed inset-0 pointer-events-none z-[8]"
        style={{
          background: `
            radial-gradient(ellipse at 50% 50%, transparent 0%, transparent 30%, rgba(10,10,12,0.5) 60%, rgba(10,10,12,0.9) 100%),
            linear-gradient(180deg, transparent 60%, ${GOW.void}90 100%)
          `,
        }}
      />

      {/* Fixed Navigation Bar - Below blood banner */}
      <nav
        className="fixed top-16 md:top-14 left-0 right-0 z-[46] px-4 py-2 md:px-6 md:py-3"
        style={{
          background: `linear-gradient(180deg, ${GOW.void}f0 0%, ${GOW.void}cc 100%)`,
          backdropFilter: 'blur(8px)',
          borderBottom: `1px solid ${GOW.gold}15`,
        }}
        role="banner"
        aria-label="Primary navigation"
      >
        <div className="max-w-6xl mx-auto flex justify-between items-center gap-2 md:gap-4">
          <Link href="/" className="flex items-center gap-2 md:gap-3 group">
            {/* Small Omega symbol */}
            <svg className="w-5 h-5 md:w-6 md:h-6 hidden sm:block" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M12,4 C8,4 5,8 5,14 L8,14 C8,10 9.5,7 12,7 C14.5,7 16,10 16,14 L19,14 C19,8 16,4 12,4"
                fill={GOW.gold}
                opacity="0.8"
              />
            </svg>
            <h1
              className="text-sm md:text-lg tracking-[0.2em] md:tracking-[0.25em] font-semibold uppercase whitespace-nowrap"
              style={{
                color: GOW.goldBright,
                textShadow: `0 0 30px ${GOW.gold}40, 0 2px 4px rgba(0,0,0,0.5)`,
              }}
            >
              Alexander Pulido
            </h1>
          </Link>

          <div className="flex gap-2 md:gap-3 items-center">
            <Link
              href="/cv"
              className="px-2 md:px-3 py-1.5 md:py-2 text-sm tracking-[0.15em] uppercase transition-all hover:scale-105 flex items-center focus:outline-none focus-visible:ring-2"
              style={{
                border: `1px solid ${GOW.gold}40`,
                color: GOW.gold,
                background: `${GOW.void}ee`,
              }}
            >
              CV
            </Link>
            <Link
              href="/personal-projects/game-engine"
              className="px-2 md:px-3 py-1.5 md:py-2 text-sm tracking-[0.15em] uppercase transition-all hover:scale-105 flex items-center focus:outline-none focus-visible:ring-2"
              style={{
                border: `1px solid ${GOW.blood}`,
                color: GOW.bone,
                background: `linear-gradient(180deg, ${GOW.blood}cc, ${GOW.bloodDark})`,
                boxShadow: `0 0 15px ${GOW.blood}40`,
              }}
            >
              <span className="hidden sm:inline">Nebulith</span>
              <span className="sm:hidden">Game</span>
            </Link>
            <ThemeSwitcher />
          </div>
        </div>
      </nav>

      {/* Hero Section - Below nav and blood banner */}
      <header className="relative z-20 pt-32 md:pt-36 pb-6 px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p
            className="text-base md:text-xl tracking-wider mb-2 font-medium"
            style={{
              color: GOW.bone,
              textShadow: `0 2px 4px rgba(0,0,0,0.8)`,
            }}
          >
            {PROFESSIONAL_SUMMARY[active].headline}
          </p>
          <p
            className="text-sm md:text-base tracking-wider italic"
            style={{
              color: GOW.goldBright,
              textShadow: `0 0 20px ${GOW.gold}50, 0 2px 4px rgba(0,0,0,0.6)`,
            }}
          >
            {PROFESSIONAL_SUMMARY[active].tagline}
          </p>
        </div>
      </header>

      {/* Main content */}
      <main id="main-content" tabIndex={-1} className="outline-none">

        {/* Profession Selector */}
        <FadeInSection>
          <section className="relative z-20 py-6 md:py-8" aria-labelledby="profession-heading">
            <h2 id="profession-heading" className="sr-only">Select Your Profession</h2>
            <div className="max-w-6xl mx-auto px-4 md:px-6">
              <div
                className="relative h-40 md:h-56 overflow-hidden"
                style={{
                  background: `linear-gradient(180deg, transparent, ${GOW.voidWarm}30)`,
                  border: `1px solid ${GOW.gold}20`,
                  borderRadius: '4px',
                }}
                role="tablist"
                aria-label="Profession selector"
              >
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" aria-hidden="true">
                  <defs>
                    <linearGradient id="pathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor={GOW.gold} stopOpacity="0" />
                      <stop offset="50%" stopColor={GOW.gold} stopOpacity="0.4" />
                      <stop offset="100%" stopColor={GOW.gold} stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <line x1="25%" y1="50%" x2="50%" y2="30%" stroke="url(#pathGrad)" strokeWidth="1" strokeDasharray="6 4" />
                  <line x1="50%" y1="30%" x2="75%" y2="50%" stroke="url(#pathGrad)" strokeWidth="1" strokeDasharray="6 4" />
                </svg>

                {professionNodes.map((node) => (
                  <WaystationNode
                    key={node.id}
                    {...node}
                    isActive={active === node.id}
                    onClick={() => setActive(node.id as 'engineer' | 'drummer' | 'fighter')}
                  />
                ))}
              </div>
            </div>
          </section>
        </FadeInSection>

        {/* About */}
        <FadeInSection delay={100}>
          <section className="relative z-20 py-6 md:py-8 px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <SpartanFrame title="About">
                <p className="leading-relaxed mb-4" style={{ color: GOW.bone }}>{aboutData.bio}</p>
                <div className="flex flex-wrap gap-2 md:gap-3">
                  {aboutData.quickFacts.map((fact, i) => (
                    <span
                      key={i}
                      className="px-2 md:px-3 py-1"
                      style={{
                        background: `${GOW.gold}12`,
                        border: `1px solid ${GOW.gold}30`,
                        color: GOW.gold,
                        borderRadius: '3px',
                      }}
                    >
                      ◆ {fact}
                    </span>
                  ))}
                </div>
              </SpartanFrame>
            </div>
          </section>
        </FadeInSection>

        {/* Art Section 1 - Weapons */}
        <FadeInSection delay={150}>
          <ArtSectionWeapons />
        </FadeInSection>

        {/* Work Experience */}
        {experience.length > 0 && (
          <section
            ref={experienceTrigger.ref}
            className="relative z-20 py-8 px-6"
            style={{
              opacity: experienceTrigger.triggered ? 1 : 0,
              transform: experienceTrigger.triggered ? 'translateY(0)' : 'translateY(30px)',
              transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
              willChange: 'opacity, transform',
            }}
          >
              <div className="max-w-4xl mx-auto">
                <SpartanFrame title="Work Experience">
                  <div>
                    {experience.map((entry, index) => (
                      <ExperienceCard key={entry.id} entry={entry} isLast={index === experience.length - 1} />
                    ))}
                  </div>
                </SpartanFrame>
              </div>
            </section>
        )}

        {/* Art Section 2 - Greek Pillars */}
        <FadeInSection>
          <ArtSectionPillars />
        </FadeInSection>

        {/* Tech Stack / Skills */}
        <FadeInSection>
          <section className="relative z-20 py-6 md:py-8 px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <SpartanFrame title={active === 'engineer' ? 'Tech Stack' : 'Skills'}>
                {active === 'engineer' ? (
                  <TechCloud categories={engineerTech} />
                ) : (
                  <SkillsList categories={otherSkills} />
                )}
              </SpartanFrame>
            </div>
          </section>
        </FadeInSection>

        {/* Projects - Featured Work */}
        <section
          ref={projectsTrigger.ref}
          className="relative z-20 py-6 md:py-8 px-4 md:px-6"
          style={{
            opacity: projectsTrigger.triggered ? 1 : 0,
            transform: projectsTrigger.triggered ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
            willChange: 'opacity, transform',
          }}
        >
            <div className="max-w-4xl mx-auto">
              <SpartanFrame title="Featured Work">
                <div className="grid md:grid-cols-2 gap-3 md:gap-4">
                  {projects.filter(p => p.featured).slice(0, 6).map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </SpartanFrame>
            </div>
          </section>

        {/* Art Section 3 - Mount Olympus */}
        <FadeInSection>
          <ArtSectionOlympus />
        </FadeInSection>

        {/* Ventures (Companies/Bands) */}
        <FadeInSection>
          {active === 'engineer' && (
            <section className="relative z-20 py-6 md:py-8 px-4 md:px-6">
              <div className="max-w-4xl mx-auto">
                <SpartanFrame title="Ventures">
                  <div className="grid md:grid-cols-3 gap-3 md:gap-4">
                    {COMPANIES.map((company) => (
                      <CompanyCard key={company.id} company={company} />
                    ))}
                  </div>
                </SpartanFrame>
              </div>
            </section>
          )}

          {active === 'drummer' && (
            <section className="relative z-20 py-6 md:py-8 px-4 md:px-6">
              <div className="max-w-4xl mx-auto">
                <SpartanFrame title="Bands">
                  <div className="grid md:grid-cols-3 gap-3 md:gap-4">
                    {BANDS.map((band) => (
                      <BandCard key={band.id} band={band} />
                    ))}
                  </div>
                </SpartanFrame>
              </div>
            </section>
          )}
        </FadeInSection>

        {/* Posts */}
        <FadeInSection>
          <section className="relative z-20 py-6 md:py-8 px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <SpartanFrame title="Posts">
                <div className="text-center py-6 md:py-8">
                  <p style={{ color: GOW.silver }}>
                    Writings and thoughts coming soon...
                  </p>
                  <p className="mt-2 italic" style={{ color: GOW.gold }}>
                    ◆ Check back for updates on development, music, and martial arts
                  </p>
                </div>
              </SpartanFrame>
            </div>
          </section>
        </FadeInSection>

      </main>

      {/* Contact CTA */}
      <section
        ref={contactTrigger.ref}
        className="relative z-20 py-16 px-6"
        aria-label="Contact"
        style={{
          opacity: contactTrigger.triggered ? 1 : 0,
          transform: contactTrigger.triggered ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
          willChange: 'opacity, transform',
        }}
      >
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <h2 className="text-xl tracking-[0.15em] mb-3" style={{ color: GOW.gold }}>
                Ready to Work Together?
              </h2>
              <p className="text-sm" style={{ color: GOW.silver }}>
                10+ years delivering production systems. Let&apos;s build something.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:alexanderpulido81@gmail.com"
                className="inline-flex items-center justify-center px-6 py-3 text-sm tracking-[0.15em] uppercase transition-all hover:scale-105 min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{
                  background: GOW.gold,
                  color: GOW.void,
                  borderRadius: '4px',
                }}
              >
                Get In Touch
              </a>
              <Link
                href="/cv"
                className="inline-flex items-center justify-center px-6 py-3 text-sm tracking-[0.15em] uppercase transition-all hover:scale-105 min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{
                  background: 'transparent',
                  border: `2px solid ${GOW.gold}`,
                  color: GOW.gold,
                  borderRadius: '4px',
                }}
              >
                Download CV
              </Link>
            </div>
          </div>
        </section>

      {/* Bottom obscure overlay */}
      <div
        className="fixed bottom-0 left-0 right-0 h-48 pointer-events-none z-[7]"
        style={{
          background: `linear-gradient(180deg, transparent 0%, ${GOW.void}40 30%, ${GOW.void}90 70%, ${GOW.void} 100%)`,
        }}
        aria-hidden="true"
      />

      {/* Footer */}
      <footer className="relative z-20 py-12 px-6 text-center" role="contentinfo">
        <div className="inline-flex items-center gap-4" style={{ color: GOW.silver }}>
          <div className="w-12 h-px" style={{ background: GOW.gold }} aria-hidden="true" />
          <span className="text-sm tracking-[0.2em]">
            <span className="sr-only">Copyright </span>© {new Date().getFullYear()} Alexander Pulido
          </span>
          <div className="w-12 h-px" style={{ background: GOW.gold }} aria-hidden="true" />
        </div>
      </footer>

      {/* Animations */}
      <style jsx global>{`
        @keyframes stormRain {
          0% { transform: translateY(-40px) translateZ(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100vh) translateZ(0); opacity: 0; }
        }

        @keyframes emberRise {
          0% { transform: translateY(0) translateZ(0); opacity: 0.8; }
          100% { transform: translateY(-100vh) translateX(20px) translateZ(0); opacity: 0; }
        }

        @keyframes bloodDrip {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(1.1); }
        }

        @keyframes chainSwing {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
        }

        @keyframes fireFlicker {
          0%, 100% { opacity: 0.3; transform: scaleY(1); }
          25% { opacity: 0.5; transform: scaleY(1.1); }
          50% { opacity: 0.4; transform: scaleY(0.95); }
          75% { opacity: 0.6; transform: scaleY(1.05); }
        }

        @keyframes omegaPulse {
          0%, 100% { filter: drop-shadow(0 0 5px ${GOW.gold}40); }
          50% { filter: drop-shadow(0 0 15px ${GOW.gold}80); }
        }

        /* Scrollbar styling for GOW theme */
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: ${GOW.voidDeep};
        }
        ::-webkit-scrollbar-thumb {
          background: ${GOW.bloodDark};
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: ${GOW.blood};
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </div>
  )
}
