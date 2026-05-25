'use client'

import { useEffect, useState, useRef, useMemo, memo, lazy, Suspense } from 'react'
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
import { useInViewTrigger } from '@/hooks/useScrollAnimation'
import { SkipLink } from '@/components/themes/shared/AccessibilityStyles'

// Hollow Knight color palette - based on City of Tears zone
const HK = {
  // Core colors
  void: '#000000',
  deepBlue: '#1d2e65',       // City of Tears primary
  midBlue: '#4d6f94',        // City of Tears secondary
  paleBlue: '#abc2c5',       // City of Tears highlights
  darkPurple: '#362e42',     // City of Tears shadows
  purple: '#330055',         // Main HK purple

  // Character colors
  bone: '#F7F7F7',           // Knight mask white
  silver: '#C0C0C0',         // UI elements
  lavender: '#B7A9D9',       // Soft accents

  // Accent colors
  soul: '#6DCCF4',           // Soul cyan glow
  soulDark: '#4E9FD1',       // Darker soul
  infection: '#FF8C00',      // Orange infection

  // Greenpath accents (for variety)
  leafGreen: '#4E7E3B',
  mossGreen: '#2F5D34',
}

// SVG Hollow Knight - accurate to game: egg-shaped face, curved horns, triangular void eyes
// Decorative only - aria-hidden
const TheKnight = memo(function TheKnight({ size = 60 }: { size?: number }) {
  return (
    <svg width={size} height={size * 1.5} viewBox="0 0 60 90" className="transition-all duration-300" aria-hidden="true" role="presentation">
      {/* Cloak/body - dark flowing shape */}
      <path
        d="M30,55 Q15,58 12,75 Q15,85 30,88 Q45,85 48,75 Q45,58 30,55"
        fill="#1a1a1a"
      />
      {/* Cloak inner fold */}
      <path
        d="M30,60 Q22,65 20,78 Q25,82 30,82 Q35,82 40,78 Q38,65 30,60"
        fill="#0a0a0a"
      />

      {/* Left horn - smooth outward curve then sharp point */}
      <path
        d="M20,35 Q12,28 8,12 Q14,18 18,30 Q19,34 20,35"
        fill={HK.bone}
        stroke={HK.bone}
        strokeWidth="1"
        strokeLinejoin="round"
      />
      {/* Right horn - mirror */}
      <path
        d="M40,35 Q48,28 52,12 Q46,18 42,30 Q41,34 40,35"
        fill={HK.bone}
        stroke={HK.bone}
        strokeWidth="1"
        strokeLinejoin="round"
      />

      {/* Face - egg shape, wider at top */}
      <ellipse cx="30" cy="42" rx="14" ry="17" fill={HK.bone} />

      {/* Eyes - void black, elongated triangular, angled inward */}
      <path d="M22,38 Q20,42 22,48 Q24,48 26,44 Q25,40 22,38" fill={HK.void} />
      <path d="M38,38 Q40,42 38,48 Q36,48 34,44 Q35,40 38,38" fill={HK.void} />
    </svg>
  )
})

// Soul vessel UI - mask-like with eye holes (accurate to in-game UI)
// Decorative only
const SoulVessel = memo(function SoulVessel({ filled = 100 }: { filled?: number }) {
  return (
    <svg width="36" height="44" viewBox="0 0 36 44" className="drop-shadow-lg" aria-hidden="true" role="presentation">
      {/* Vessel outline - mask shape */}
      <path
        d="M18,2 Q4,8 4,22 Q4,38 18,42 Q32,38 32,22 Q32,8 18,2"
        fill={HK.void}
        stroke={HK.bone}
        strokeWidth="2"
      />
      {/* Soul fill - rises from bottom */}
      <defs>
        <clipPath id="vesselClip">
          <path d="M18,4 Q6,9 6,22 Q6,36 18,40 Q30,36 30,22 Q30,9 18,4" />
        </clipPath>
      </defs>
      <rect
        x="6"
        y={40 - (filled * 0.36)}
        width="24"
        height={filled * 0.36}
        fill={HK.soul}
        clipPath="url(#vesselClip)"
        opacity="0.9"
      />
      {/* Eye holes - void black */}
      <ellipse cx="12" cy="18" rx="3" ry="5" fill={HK.void} />
      <ellipse cx="24" cy="18" rx="3" ry="5" fill={HK.void} />
      {/* Soul glow when full */}
      {filled > 80 && (
        <path
          d="M18,4 Q6,9 6,22 Q6,36 18,40 Q30,36 30,22 Q30,9 18,4"
          fill="none"
          stroke={HK.soul}
          strokeWidth="1"
          opacity="0.6"
          style={{ filter: `drop-shadow(0 0 6px ${HK.soul})` }}
        />
      )}
    </svg>
  )
})

// Rain effect - City of Tears' most iconic visual element
// Optimized: Reduced DOM elements, use CSS transforms only, memoized
const CityRain = memo(function CityRain() {
  // Reduced from 80 to 40 drops for better performance
  const drops = useMemo(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      height: Math.random() * 20 + 10,
      opacity: Math.random() * 0.3 + 0.1,
      speed: Math.random() * 1.5 + 0.8,
      delay: Math.random() * -3,
    })),
    []
  )

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[4] overflow-hidden contain-strict"
      aria-hidden="true"
      role="presentation"
    >
      {drops.map((d) => (
        <div
          key={d.id}
          className="absolute w-px will-animate"
          style={{
            left: `${d.x}%`,
            top: '-30px',
            height: d.height,
            background: `linear-gradient(180deg, transparent, ${HK.paleBlue}${Math.round(d.opacity * 255).toString(16).padStart(2, '0')})`,
            animation: `rain ${d.speed}s linear infinite`,
            animationDelay: `${d.delay}s`,
            willChange: 'transform',
          }}
        />
      ))}
    </div>
  )
})

// Soul particles - sparse floating cyan orbs
// Optimized: Memoized, reduced DOM, CSS-only transforms
const SoulParticles = memo(function SoulParticles() {
  // Reduced from 12 to 8 particles for performance
  const particles = useMemo(() =>
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      opacity: Math.random() * 0.3 + 0.1,
      speed: Math.random() * 30 + 20,
      delay: Math.random() * -25,
    })),
    []
  )

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[5] overflow-hidden contain-strict"
      aria-hidden="true"
      role="presentation"
    >
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full will-animate"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: HK.soul,
            opacity: p.opacity,
            boxShadow: `0 0 ${p.size * 3}px ${HK.soul}`,
            animation: `soulFloat ${p.speed}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
            willChange: 'transform, opacity',
          }}
        />
      ))}
    </div>
  )
})

// City of Tears chandelier - Art Nouveau styled with organic curves
// Memoized decorative component
const CityOfTearsChandelier = memo(function CityOfTearsChandelier() {
  return (
    <svg
      className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[600px] h-48 opacity-70"
      viewBox="0 0 500 160"
      aria-hidden="true"
      role="presentation"
    >
      {/* Central chain with decorative links */}
      <path d="M250,0 L250,20" stroke={HK.silver} strokeWidth="2" />
      <circle cx="250" cy="25" r="5" fill="none" stroke={HK.silver} strokeWidth="1.5" />
      <path d="M250,30 L250,40" stroke={HK.silver} strokeWidth="2" />

      {/* Central ornate piece - Art Nouveau style */}
      <path
        d="M250,40 Q230,50 220,45 Q200,55 190,50 Q180,60 160,55
           M250,40 Q270,50 280,45 Q300,55 310,50 Q320,60 340,55"
        fill="none"
        stroke={HK.silver}
        strokeWidth="1.5"
      />

      {/* Swooping arms with organic curves */}
      <path
        d="M160,55 Q140,70 120,65 Q100,80 80,75"
        fill="none"
        stroke={HK.silver}
        strokeWidth="1"
        opacity="0.8"
      />
      <path
        d="M340,55 Q360,70 380,65 Q400,80 420,75"
        fill="none"
        stroke={HK.silver}
        strokeWidth="1"
        opacity="0.8"
      />

      {/* Hanging chains with tear drops */}
      {[80, 120, 160, 200, 250, 300, 340, 380, 420].map((x, i) => {
        const yOffset = Math.abs(x - 250) * 0.15
        const chainLen = 40 + Math.abs(x - 250) * 0.1
        return (
          <g key={i}>
            {/* Chain */}
            <path
              d={`M${x},${55 + yOffset} L${x},${55 + yOffset + chainLen}`}
              stroke={HK.silver}
              strokeWidth="1"
              strokeDasharray="3 2"
              opacity="0.6"
            />
            {/* Glowing orb */}
            <circle
              cx={x}
              cy={60 + yOffset + chainLen}
              r={x === 250 ? 10 : 7}
              fill={HK.bone}
              opacity="0.95"
            />
            {/* Orb glow */}
            <circle
              cx={x}
              cy={60 + yOffset + chainLen}
              r={x === 250 ? 18 : 12}
              fill={HK.bone}
              opacity="0.15"
            />
          </g>
        )
      })}

      {/* Decorative curls between arms */}
      <path
        d="M180,60 Q175,75 185,80 Q175,85 180,95"
        fill="none"
        stroke={HK.silver}
        strokeWidth="1"
        opacity="0.5"
      />
      <path
        d="M320,60 Q325,75 315,80 Q325,85 320,95"
        fill="none"
        stroke={HK.silver}
        strokeWidth="1"
        opacity="0.5"
      />
    </svg>
  )
})

// Ornate ironwork railing - Art Nouveau silhouette style
// Memoized decorative component
const SpikyRailing = memo(function SpikyRailing() {
  return (
    <svg
      className="fixed bottom-0 left-0 w-full h-32 opacity-50 pointer-events-none z-[6]"
      viewBox="0 0 1000 100"
      preserveAspectRatio="none"
      aria-hidden="true"
      role="presentation"
    >
      {/* Base bar with slight curve */}
      <path
        d="M0,85 Q250,80 500,85 Q750,90 1000,85 L1000,100 L0,100 Z"
        fill={HK.void}
      />

      {/* Repeating ornate finials - alternating heights */}
      {Array.from({ length: 25 }, (_, i) => {
        const x = i * 40 + 20
        const isMain = i % 2 === 0
        const height = isMain ? 55 : 35
        return (
          <g key={i}>
            {/* Main spike with curved sides */}
            <path
              d={`M${x},85
                 Q${x - 4},${85 - height * 0.3} ${x - 2},${85 - height * 0.6}
                 Q${x},${85 - height} ${x},${85 - height}
                 Q${x},${85 - height} ${x + 2},${85 - height * 0.6}
                 Q${x + 4},${85 - height * 0.3} ${x},85`}
              fill={HK.void}
            />
            {/* Decorative curls on main spikes */}
            {isMain && (
              <>
                <path
                  d={`M${x - 3},${85 - height * 0.4} Q${x - 12},${85 - height * 0.5} ${x - 8},${85 - height * 0.2}`}
                  fill="none"
                  stroke={HK.void}
                  strokeWidth="3"
                />
                <path
                  d={`M${x + 3},${85 - height * 0.4} Q${x + 12},${85 - height * 0.5} ${x + 8},${85 - height * 0.2}`}
                  fill="none"
                  stroke={HK.void}
                  strokeWidth="3"
                />
              </>
            )}
          </g>
        )
      })}

      {/* Connecting curves between spikes */}
      {Array.from({ length: 24 }, (_, i) => {
        const x1 = i * 40 + 20
        const x2 = (i + 1) * 40 + 20
        return (
          <path
            key={`curve-${i}`}
            d={`M${x1},70 Q${(x1 + x2) / 2},78 ${x2},70`}
            fill="none"
            stroke={HK.void}
            strokeWidth="2"
          />
        )
      })}
    </svg>
  )
})

// Tall ornate window - Art Nouveau arch with soft light
// Memoized decorative component
const OrnateWindow = memo(function OrnateWindow({ side }: { side: 'left' | 'right' }) {
  const xPos = side === 'left' ? '5%' : '95%'
  const transform = side === 'left' ? 'translateX(0)' : 'translateX(-100%)'

  return (
    <div
      className="absolute top-[10%] h-[60%] w-24 opacity-40"
      style={{ left: xPos, transform }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 80 200" className="w-full h-full" preserveAspectRatio="none" role="presentation">
        {/* Window frame - Art Nouveau arch */}
        <path
          d="M10,200 L10,60 Q10,10 40,10 Q70,10 70,60 L70,200"
          fill="none"
          stroke={HK.silver}
          strokeWidth="3"
        />
        {/* Inner arch */}
        <path
          d="M15,195 L15,62 Q15,18 40,18 Q65,18 65,62 L65,195"
          fill={HK.paleBlue}
          opacity="0.1"
        />
        {/* Decorative mullions */}
        <line x1="40" y1="18" x2="40" y2="195" stroke={HK.silver} strokeWidth="1" opacity="0.5" />
        <path d="M15,100 Q40,90 65,100" fill="none" stroke={HK.silver} strokeWidth="1" opacity="0.4" />
        <path d="M15,140 Q40,130 65,140" fill="none" stroke={HK.silver} strokeWidth="1" opacity="0.4" />
        {/* Art nouveau ornament at top */}
        <path
          d="M30,30 Q35,25 40,30 Q45,25 50,30"
          fill="none"
          stroke={HK.silver}
          strokeWidth="1"
          opacity="0.6"
        />
      </svg>
      {/* Light glow from window */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at ${side === 'left' ? '80%' : '20%'} 30%, ${HK.paleBlue}30, transparent 70%)`,
          filter: 'blur(20px)',
        }}
      />
    </div>
  )
})

// City of Tears architecture - combined elements
// Memoized decorative component
const CityArchitecture = memo(function CityArchitecture() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[3] contain-strict" aria-hidden="true" role="presentation">
      <CityOfTearsChandelier />
      <OrnateWindow side="left" />
      <OrnateWindow side="right" />
      <SpikyRailing />

      {/* Central atmospheric glow - soft and diffused */}
      <div
        className="absolute top-[15%] left-1/2 w-[800px] h-[500px]"
        style={{
          background: `radial-gradient(ellipse at center top, ${HK.paleBlue}25 0%, ${HK.midBlue}10 40%, transparent 70%)`,
          filter: 'blur(60px)',
          transform: 'translateX(-50%) translateZ(0)',
        }}
      />
      {/* Bottom fog */}
      <div
        className="absolute bottom-0 left-0 right-0 h-48"
        style={{
          background: `linear-gradient(180deg, transparent, ${HK.deepBlue}40, ${HK.darkPurple}60)`,
        }}
      />
    </div>
  )
})

// Nail slash reveal for sections - Hollow Knight's nail attack
function NailSlashReveal({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const hasEntered = useInViewTrigger(ref, { threshold: 0.15 })
  const [phase, setPhase] = useState<'hidden' | 'slash' | 'revealed'>('hidden')

  useEffect(() => {
    if (hasEntered && phase === 'hidden') {
      setPhase('slash')
      setTimeout(() => setPhase('revealed'), 500)
    }
  }, [hasEntered, phase])

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {/* Nail slash animation - horizontal soul-colored line */}
      {phase === 'slash' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div
            className="absolute h-0.5"
            style={{
              width: '100%',
              background: `linear-gradient(90deg, transparent, ${HK.soul}, transparent)`,
              boxShadow: `0 0 20px ${HK.soul}, 0 0 40px ${HK.soulDark}`,
              animation: 'slashReveal 0.4s ease-out forwards',
            }}
          />
          {/* Small mask icon during slash */}
          <div style={{ animation: 'knightDash 0.4s ease-out forwards' }}>
            <TheKnight size={30} />
          </div>
        </div>
      )}

      <div
        style={{
          opacity: phase === 'revealed' ? 1 : 0,
          transform: phase === 'revealed' ? 'translateY(0)' : 'translateY(15px)',
          transition: 'all 0.4s ease-out',
        }}
      >
        {children}
      </div>
    </div>
  )
}

// Bench-style waypoint for profession selection (Hollow Knight benches)
// Optimized: Memoized, proper accessibility
const BenchWaypoint = memo(function BenchWaypoint({
  icon,
  label,
  color,
  isActive,
  onClick,
  position,
}: {
  icon: string
  label: string
  color: string
  isActive: boolean
  onClick: () => void
  position: { x: number; y: number }
}) {
  return (
    <button
      onClick={onClick}
      className="absolute transform -translate-x-1/2 -translate-y-1/2 group min-w-[80px] min-h-[80px]"
      style={{ left: `${position.x}%`, top: `${position.y}%` }}
      aria-pressed={isActive}
      aria-label={`Select ${label} profession${isActive ? ' (currently selected)' : ''}`}
      role="tab"
      tabIndex={isActive ? 0 : -1}
    >
      {/* Soul glow when active */}
      <div
        className={`absolute inset-0 rounded-full transition-all duration-500 ${
          isActive ? 'opacity-50 scale-150' : 'opacity-0 scale-100 group-hover:opacity-30 group-hover:scale-125'
        }`}
        style={{
          backgroundColor: color,
          filter: 'blur(16px)',
          willChange: 'transform, opacity',
        }}
        aria-hidden="true"
      />
      {/* Organic/hand-drawn style circle */}
      <div
        className={`relative w-20 h-20 flex flex-col items-center justify-center transition-all duration-300 ${
          isActive ? 'scale-110' : 'group-hover:scale-105'
        }`}
        style={{
          background: `radial-gradient(circle at 30% 30%, ${color}30, ${HK.void})`,
          border: `2px solid ${isActive ? color : HK.darkPurple}`,
          borderRadius: '60% 40% 55% 45% / 45% 55% 40% 60%',
          boxShadow: isActive
            ? `0 0 30px ${color}50, inset 0 0 20px ${color}20`
            : `inset 0 0 15px rgba(0,0,0,0.5)`,
          willChange: 'transform',
        }}
      >
        <span className="text-xl mb-1" style={{ color: isActive ? color : HK.silver }} aria-hidden="true">{icon}</span>
        <span
          className="text-sm tracking-[0.2em] uppercase"
          style={{
            color: isActive ? color : HK.silver,
            fontFamily: '"Cinzel", "Garamond", serif',
          }}
        >
          {label}
        </span>
      </div>
    </button>
  )
})

// Hollow Knight panel frame - Art Nouveau organic curves
// Optimized: Memoized, reduced SVG complexity
const VoidFrame = memo(function VoidFrame({
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
    <div className="relative" role="region" aria-labelledby={headingId}>
      {/* Art Nouveau corner ornaments - flowing organic shapes */}
      <svg className="absolute -top-3 -left-3 w-10 h-10" viewBox="0 0 40 40" aria-hidden="true">
        <path
          d="M5,35 Q5,5 35,5"
          fill="none"
          stroke={HK.silver}
          strokeWidth="1.5"
          opacity="0.6"
        />
        <circle cx="8" cy="8" r="3" fill={HK.soul} opacity="0.4" />
        <path d="M12,20 Q8,15 15,12" fill="none" stroke={HK.silver} strokeWidth="1" opacity="0.4" />
      </svg>
      <svg className="absolute -top-3 -right-3 w-10 h-10" viewBox="0 0 40 40" aria-hidden="true">
        <path
          d="M35,35 Q35,5 5,5"
          fill="none"
          stroke={HK.silver}
          strokeWidth="1.5"
          opacity="0.6"
        />
        <circle cx="32" cy="8" r="3" fill={HK.soul} opacity="0.4" />
        <path d="M28,20 Q32,15 25,12" fill="none" stroke={HK.silver} strokeWidth="1" opacity="0.4" />
      </svg>
      <svg className="absolute -bottom-3 -left-3 w-10 h-10" viewBox="0 0 40 40" aria-hidden="true">
        <path
          d="M5,5 Q5,35 35,35"
          fill="none"
          stroke={HK.silver}
          strokeWidth="1.5"
          opacity="0.6"
        />
        <circle cx="8" cy="32" r="3" fill={HK.soul} opacity="0.4" />
      </svg>
      <svg className="absolute -bottom-3 -right-3 w-10 h-10" viewBox="0 0 40 40" aria-hidden="true">
        <path
          d="M35,5 Q35,35 5,35"
          fill="none"
          stroke={HK.silver}
          strokeWidth="1.5"
          opacity="0.6"
        />
        <circle cx="32" cy="32" r="3" fill={HK.soul} opacity="0.4" />
      </svg>

      {/* Title with organic dividers */}
      <div className="flex items-center gap-4 mb-6">
        <svg className="flex-1 h-3" viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden="true">
          <path
            d="M0,6 Q50,2 100,6 Q150,10 200,6"
            fill="none"
            stroke={HK.darkPurple}
            strokeWidth="1"
          />
        </svg>
        <HeadingTag
          id={headingId}
          className="text-base tracking-[0.25em] uppercase px-2"
          style={{
            color: HK.bone,
            fontFamily: '"Cinzel", "Garamond", serif',
            textShadow: `0 0 15px ${HK.soulDark}`,
          }}
        >
          {title}
        </HeadingTag>
        <svg className="flex-1 h-3" viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden="true">
          <path
            d="M0,6 Q50,10 100,6 Q150,2 200,6"
            fill="none"
            stroke={HK.darkPurple}
            strokeWidth="1"
          />
        </svg>
      </div>

      <div
        className="p-6 relative"
        style={{
          background: `linear-gradient(180deg, ${HK.void}f0, ${HK.darkPurple}30)`,
          border: `1px solid ${HK.darkPurple}60`,
          borderRadius: '2px',
          boxShadow: `inset 0 0 40px rgba(0,0,0,0.5)`,
        }}
      >
        {children}
      </div>
    </div>
  )
})

// Tech stack - soul-infused abilities
// Optimized: Memoized
const TechCloud = memo(function TechCloud({ categories }: { categories: ReturnType<typeof getEngineerSkills> }) {
  return (
    <div className="space-y-6">
      {categories.slice(0, 5).map((category) => (
        <div key={category.name}>
          <h3
            className="text-sm tracking-[0.15em] mb-3 flex items-center gap-2 uppercase"
            style={{ color: HK.silver, fontFamily: '"Cinzel", serif' }}
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
                  background: `${HK.soul}15`,
                  border: `1px solid ${HK.soul}40`,
                  color: HK.bone,
                  borderRadius: '2px 4px 2px 4px',
                  willChange: 'transform',
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

// Skills list - charm abilities style
// Optimized: Memoized
const SkillsList = memo(function SkillsList({ categories }: { categories: ReturnType<typeof getSkillsByProfession> }) {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {categories.map((category) => (
        <div key={category.name}>
          <h3
            className="text-sm tracking-[0.15em] mb-3 flex items-center gap-2 uppercase"
            style={{ color: HK.silver, fontFamily: '"Cinzel", serif' }}
          >
            <span aria-hidden="true">{category.icon}</span>
            {category.name}
          </h3>
          <ul className="space-y-2" aria-label={`${category.name} skills`}>
            {category.skills.map((skill) => (
              <li key={skill.name} className="text-sm flex items-center gap-2" style={{ color: HK.bone }}>
                <span style={{ color: HK.soul }} aria-hidden="true">◇</span>
                {skill.name}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
})

// Project card - artifact/relic style
// Optimized: Memoized, proper heading hierarchy
const ProjectCard = memo(function ProjectCard({ project }: { project: typeof PROJECTS_DATA[0] }) {
  return (
    <article
      className="p-4 transition-transform hover:scale-[1.02] cursor-pointer group"
      style={{
        background: `linear-gradient(135deg, ${HK.void}, ${HK.darkPurple}40)`,
        border: `1px solid ${project.featured ? HK.soul : HK.darkPurple}`,
        borderRadius: '2px 6px 2px 6px',
        boxShadow: project.featured ? `0 0 20px ${HK.soul}30` : 'none',
        willChange: 'transform',
      }}
      tabIndex={0}
      role="button"
      aria-label={`View ${project.name} project details`}
    >
      {project.featured && (
        <span className="text-sm tracking-[0.15em] uppercase" style={{ color: HK.soul }}>
          <span aria-hidden="true">◇ </span>Featured
        </span>
      )}
      <h3 className="text-base mt-1 transition-colors" style={{ color: HK.bone }}>
        {project.name}
      </h3>
      <p className="text-sm mt-2" style={{ color: HK.silver }}>{project.tagline}</p>
      {project.impact && (
        <p className="text-sm mt-2 italic" style={{ color: HK.soul }}>
          <span aria-hidden="true">→ </span>
          <span className="sr-only">Impact: </span>{project.impact}
        </p>
      )}
      <div className="flex flex-wrap gap-1 mt-3" aria-label="Technologies used">
        {project.techStack.slice(0, 4).map((tech) => (
          <span key={tech} className="text-sm px-1 py-0.5" style={{ background: `${HK.soul}15`, color: HK.silver }}>
            {tech}
          </span>
        ))}
      </div>
    </article>
  )
})

// Company card - guild/ally style
// Optimized: Memoized, proper accessibility
const CompanyCard = memo(function CompanyCard({ company }: { company: typeof COMPANIES[0] }) {
  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 transition-transform hover:scale-[1.02] group min-h-[44px]"
      style={{
        background: `linear-gradient(135deg, ${HK.void}, ${HK.darkPurple}40)`,
        border: `1px solid ${HK.darkPurple}`,
        borderRadius: '2px 6px 2px 6px',
        willChange: 'transform',
      }}
      aria-label={`${company.name} - ${company.tagline}. Opens in new tab.`}
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl" aria-hidden="true">{company.icon}</span>
        <div>
          <h3 className="text-base transition-colors" style={{ color: HK.bone }}>
            {company.name}
            <span className="sr-only"> (opens in new tab)</span>
          </h3>
          <p className="text-sm" style={{ color: HK.soul }}>{company.tagline}</p>
        </div>
      </div>
      <p className="text-sm" style={{ color: HK.silver }}>{company.description}</p>
    </a>
  )
})

// Band card - dream realm style
// Optimized: Memoized, proper accessibility
const BandCard = memo(function BandCard({ band }: { band: typeof BANDS[0] }) {
  const content = (
    <article
      className="p-4 transition-transform hover:scale-[1.02] group"
      style={{
        background: `linear-gradient(135deg, ${HK.void}, ${HK.lavender}30)`,
        border: `1px solid ${HK.lavender}`,
        borderRadius: '2px 6px 2px 6px',
        willChange: 'transform',
      }}
    >
      <h3 className="text-base transition-colors" style={{ color: HK.bone }}>
        {band.name}
        {band.url && <span className="sr-only"> (opens in new tab)</span>}
      </h3>
      <p className="text-sm mt-1" style={{ color: HK.soul }}>
        {band.genre} <span aria-hidden="true">•</span> {band.role}
      </p>
      <p className="text-sm mt-2" style={{ color: HK.silver }}>{band.description}</p>
      {!band.url && <p className="text-sm mt-2 italic" style={{ color: HK.silver }}>Website coming soon</p>}
    </article>
  )

  if (band.url) {
    return (
      <a
        href={band.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block min-h-[44px]"
        aria-label={`${band.name} - ${band.genre}. Opens in new tab.`}
      >
        {content}
      </a>
    )
  }
  return content
})

// Work experience card - memory/journal style
// Optimized: Memoized, proper heading hierarchy (h3 inside h2 section)
const ExperienceCard = memo(function ExperienceCard({ entry }: { entry: typeof EXPERIENCE_DATA[0] }) {
  const endDisplay = entry.endDate ? new Date(entry.endDate).getFullYear() : 'Present'
  const startDisplay = new Date(entry.startDate).getFullYear()

  return (
    <article
      className="p-4"
      style={{
        background: `linear-gradient(135deg, ${HK.void}, ${HK.darkPurple}30)`,
        border: `1px solid ${HK.darkPurple}`,
        borderRadius: '2px 6px 2px 6px',
      }}
    >
      <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
        <div>
          <h3 className="text-base font-medium" style={{ color: HK.bone }}>{entry.title}</h3>
          <p className="text-sm" style={{ color: HK.soul }}>{entry.organization}</p>
        </div>
        <span
          className="text-sm px-2 py-0.5"
          style={{
            color: HK.soul,
            background: `${HK.soul}15`,
            border: `1px solid ${HK.soul}30`,
            borderRadius: '2px',
          }}
        >
          <time>{startDisplay}</time> - <time>{endDisplay}</time>
        </span>
      </div>
      <p className="text-sm mb-2" style={{ color: HK.silver }}>{entry.description}</p>
      {entry.highlights && entry.highlights.length > 0 && (
        <ul className="space-y-1" aria-label="Key achievements">
          {entry.highlights.map((highlight, i) => (
            <li key={i} className="text-sm flex items-start gap-2" style={{ color: HK.bone }}>
              <span style={{ color: HK.soul }} aria-hidden="true">◇</span>
              {highlight}
            </li>
          ))}
        </ul>
      )}
    </article>
  )
})

// Art Section 1 - The Knight silhouette with infection tendrils
// Memoized decorative component
const ArtSectionKnight = memo(function ArtSectionKnight() {
  return (
    <div className="relative z-20 py-16 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto relative h-48 flex items-center justify-center">
        {/* Infection tendrils spreading from center */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="xMidYMid meet">
          {/* Left infection tendril */}
          <path
            d="M400,100 Q350,90 280,85 Q200,80 120,95 Q80,100 40,90"
            fill="none"
            stroke={HK.infection}
            strokeWidth="2"
            opacity="0.3"
            className="animate-pulse"
          />
          <path
            d="M400,100 Q340,110 260,105 Q180,100 100,115"
            fill="none"
            stroke={HK.infection}
            strokeWidth="1.5"
            opacity="0.2"
          />
          {/* Right infection tendril */}
          <path
            d="M400,100 Q450,90 520,85 Q600,80 680,95 Q720,100 760,90"
            fill="none"
            stroke={HK.infection}
            strokeWidth="2"
            opacity="0.3"
            className="animate-pulse"
          />
          <path
            d="M400,100 Q460,110 540,105 Q620,100 700,115"
            fill="none"
            stroke={HK.infection}
            strokeWidth="1.5"
            opacity="0.2"
          />
          {/* Infection orbs along tendrils */}
          {[120, 220, 320, 480, 580, 680].map((x, i) => (
            <circle
              key={i}
              cx={x}
              cy={90 + Math.sin(i * 1.5) * 15}
              r={3 + Math.random() * 2}
              fill={HK.infection}
              opacity={0.2 + Math.random() * 0.2}
            />
          ))}
        </svg>

        {/* Centered Knight silhouette */}
        <div className="relative z-10">
          <TheKnight size={80} />
          {/* Soul glow behind knight */}
          <div
            className="absolute inset-0 -z-10"
            style={{
              background: `radial-gradient(circle, ${HK.soul}30 0%, transparent 70%)`,
              filter: 'blur(20px)',
              transform: 'scale(2)',
            }}
          />
        </div>

        {/* Decorative soul wisps */}
        <div
          className="absolute left-1/4 top-1/2 w-3 h-3 rounded-full"
          style={{
            background: HK.soul,
            boxShadow: `0 0 15px ${HK.soul}`,
            opacity: 0.5,
            animation: 'soulFloat 8s ease-in-out infinite',
          }}
        />
        <div
          className="absolute right-1/4 top-1/3 w-2 h-2 rounded-full"
          style={{
            background: HK.soul,
            boxShadow: `0 0 10px ${HK.soul}`,
            opacity: 0.4,
            animation: 'soulFloat 10s ease-in-out infinite 2s',
          }}
        />
      </div>

      {/* Horizontal divider lines */}
      <div className="max-w-2xl mx-auto flex items-center gap-4 mt-4">
        <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, transparent, ${HK.darkPurple}, transparent)` }} />
        <svg width="20" height="20" viewBox="0 0 20 20">
          <path d="M10,2 L18,10 L10,18 L2,10 Z" fill="none" stroke={HK.soul} strokeWidth="1" opacity="0.5" />
        </svg>
        <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, transparent, ${HK.darkPurple}, transparent)` }} />
      </div>
    </div>
  )
})

// Art Section 2 - Soul vessels and particles
// Memoized decorative component
const ArtSectionSoul = memo(function ArtSectionSoul() {
  const vessels = useMemo(() =>
    Array.from({ length: 5 }, (_, i) => ({
      id: i,
      x: 15 + i * 18,
      fill: 30 + Math.random() * 70,
      delay: i * 0.5,
    })),
    []
  )

  return (
    <div className="relative z-20 py-16 px-6 overflow-hidden" aria-hidden="true" role="presentation">
      <div className="max-w-4xl mx-auto relative h-32 flex items-center justify-center">
        {/* Soul vessels in a row */}
        <div className="flex items-end justify-center gap-8">
          {vessels.map((v) => (
            <div
              key={v.id}
              className="transform hover:scale-110 transition-transform duration-300"
              style={{
                animation: `vesselPulse 3s ease-in-out infinite`,
                animationDelay: `${v.delay}s`,
              }}
            >
              <SoulVessel filled={v.fill} />
            </div>
          ))}
        </div>

        {/* Floating soul particles */}
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + Math.sin(i * 2) * 30}%`,
              width: 4 + Math.random() * 3,
              height: 4 + Math.random() * 3,
              background: HK.soul,
              boxShadow: `0 0 ${10 + Math.random() * 10}px ${HK.soul}`,
              opacity: 0.3 + Math.random() * 0.3,
              animation: `soulFloat ${15 + Math.random() * 10}s ease-in-out infinite`,
              animationDelay: `${-Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      {/* Decorative curved lines */}
      <svg className="w-full h-8 mt-4" viewBox="0 0 800 30" preserveAspectRatio="none">
        <path
          d="M0,15 Q200,5 400,15 Q600,25 800,15"
          fill="none"
          stroke={HK.soul}
          strokeWidth="1"
          opacity="0.2"
        />
        <path
          d="M0,15 Q200,25 400,15 Q600,5 800,15"
          fill="none"
          stroke={HK.darkPurple}
          strokeWidth="1"
          opacity="0.4"
        />
      </svg>
    </div>
  )
})

// Art Section 3 - Infection spreading pattern
// Memoized decorative component
const ArtSectionInfection = memo(function ArtSectionInfection() {
  return (
    <div className="relative z-20 py-16 px-6 overflow-hidden" aria-hidden="true" role="presentation">
      <div className="max-w-6xl mx-auto relative h-40">
        <svg className="w-full h-full" viewBox="0 0 1000 160" preserveAspectRatio="xMidYMid meet">
          {/* Central infection mass */}
          <ellipse
            cx="500"
            cy="80"
            rx="30"
            ry="25"
            fill={HK.infection}
            opacity="0.3"
          />
          <ellipse
            cx="500"
            cy="80"
            rx="20"
            ry="15"
            fill={HK.infection}
            opacity="0.5"
          />
          <ellipse
            cx="500"
            cy="80"
            rx="8"
            ry="6"
            fill={HK.infection}
            opacity="0.8"
          />

          {/* Spreading veins - left */}
          <path
            d="M470,80 Q400,60 320,70 Q240,80 160,60 Q100,45 40,55"
            fill="none"
            stroke={HK.infection}
            strokeWidth="3"
            opacity="0.25"
            strokeLinecap="round"
          />
          <path
            d="M470,80 Q420,100 350,95 Q280,90 200,110 Q140,125 60,115"
            fill="none"
            stroke={HK.infection}
            strokeWidth="2"
            opacity="0.2"
            strokeLinecap="round"
          />
          <path
            d="M470,85 Q430,70 380,75 Q320,80 260,65"
            fill="none"
            stroke={HK.infection}
            strokeWidth="1.5"
            opacity="0.15"
            strokeLinecap="round"
          />

          {/* Spreading veins - right */}
          <path
            d="M530,80 Q600,60 680,70 Q760,80 840,60 Q900,45 960,55"
            fill="none"
            stroke={HK.infection}
            strokeWidth="3"
            opacity="0.25"
            strokeLinecap="round"
          />
          <path
            d="M530,80 Q580,100 650,95 Q720,90 800,110 Q860,125 940,115"
            fill="none"
            stroke={HK.infection}
            strokeWidth="2"
            opacity="0.2"
            strokeLinecap="round"
          />
          <path
            d="M530,85 Q570,70 620,75 Q680,80 740,65"
            fill="none"
            stroke={HK.infection}
            strokeWidth="1.5"
            opacity="0.15"
            strokeLinecap="round"
          />

          {/* Infection bubbles/cysts */}
          {[
            { x: 380, y: 75 }, { x: 280, y: 90 }, { x: 180, y: 65 }, { x: 100, y: 85 },
            { x: 620, y: 75 }, { x: 720, y: 90 }, { x: 820, y: 65 }, { x: 900, y: 85 },
          ].map((pos, i) => (
            <g key={i}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r={4 + Math.random() * 3}
                fill={HK.infection}
                opacity={0.2 + Math.random() * 0.15}
              />
              <circle
                cx={pos.x}
                cy={pos.y}
                r={2}
                fill={HK.infection}
                opacity={0.4}
              />
            </g>
          ))}

          {/* Decorative void eyes in infection */}
          <g opacity="0.4">
            <ellipse cx="500" cy="80" rx="5" ry="8" fill={HK.void} />
            {/* Eye shine */}
            <circle cx="502" cy="77" r="1.5" fill={HK.infection} opacity="0.8" />
          </g>
        </svg>

        {/* Glow effect behind infection */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-32"
          style={{
            background: `radial-gradient(ellipse, ${HK.infection}20 0%, transparent 70%)`,
            filter: 'blur(30px)',
          }}
        />
      </div>

      {/* Bottom divider */}
      <div className="max-w-3xl mx-auto flex items-center gap-6 mt-4">
        <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, transparent, ${HK.infection}40, transparent)` }} />
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{
                background: HK.infection,
                opacity: 0.3 + i * 0.2,
                boxShadow: `0 0 8px ${HK.infection}`,
              }}
            />
          ))}
        </div>
        <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, transparent, ${HK.infection}40, transparent)` }} />
      </div>
    </div>
  )
})

export default function DarkFantasyTheme() {
  const { theme } = useTheme()
  const { active, setActive, config } = useProfession()
  const [mounted, setMounted] = useState(false)

  // Memoize expensive data operations
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

  // Show loading skeleton instead of null
  if (!mounted) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: HK.void }}
        role="status"
        aria-label="Loading theme"
      >
        <div className="animate-pulse text-center" style={{ color: HK.bone }}>
          Loading...
        </div>
      </div>
    )
  }

  const professionNodes = [
    { id: 'engineer', icon: '⚙', label: 'Engineer', color: HK.soul, position: { x: 25, y: 50 } },
    { id: 'drummer', icon: '♪', label: 'Musician', color: HK.lavender, position: { x: 50, y: 30 } },
    { id: 'fighter', icon: '⚔', label: 'Fighter', color: HK.infection, position: { x: 75, y: 50 } },
  ]

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: `linear-gradient(180deg, ${HK.void}, ${HK.deepBlue}, ${HK.darkPurple})`,
        fontFamily: '"Cinzel", "Garamond", serif',
      }}
    >
      {/* Skip Link for accessibility */}
      <SkipLink href="#main-content" />
      {/* City of Tears atmosphere - muted blue-grey with depth */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse at 50% 10%, ${HK.midBlue}30 0%, transparent 50%),
            radial-gradient(ellipse at 20% 60%, ${HK.deepBlue}40 0%, transparent 40%),
            radial-gradient(ellipse at 80% 40%, ${HK.deepBlue}30 0%, transparent 35%),
            linear-gradient(180deg, ${HK.void} 0%, ${HK.deepBlue}90 40%, ${HK.darkPurple}80 100%)
          `,
        }}
      />
      <CityRain />
      <CityArchitecture />
      <SoulParticles />
      {/* Heavy vignette - City of Tears has strong depth, darker edges */}
      <div
        className="fixed inset-0 pointer-events-none z-[8]"
        style={{
          boxShadow: `inset 0 0 250px 100px ${HK.void}`,
          background: `
            radial-gradient(ellipse at 50% 25%, transparent 15%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.7) 100%),
            linear-gradient(180deg, transparent 60%, ${HK.void}90 100%)
          `,
        }}
      />

      {/* Header with Hollow Knight mask */}
      <header className="relative z-30 p-6" role="banner">
        <div className="max-w-6xl mx-auto flex justify-between items-start flex-wrap gap-4">
          <div className="flex items-center gap-6 animate-fade-in-down">
            <div aria-hidden="true">
              <TheKnight size={60} />
            </div>
            <div>
              <h1
                className="text-3xl tracking-[0.3em] font-normal uppercase"
                style={{
                  color: HK.bone,
                  textShadow: `0 0 30px ${HK.soul}50`,
                }}
              >
                Alexander Pulido
              </h1>
              <p className="text-base tracking-wider mt-2" style={{ color: HK.silver }}>
                {PROFESSIONAL_SUMMARY.headline}
              </p>
              <p
                className="text-sm tracking-wider mt-1 italic"
                style={{ color: HK.soul, textShadow: `0 0 10px ${HK.soulDark}` }}
              >
                {PROFESSIONAL_SUMMARY.tagline}
              </p>
            </div>
          </div>

          <nav className="flex gap-3 items-center flex-wrap" aria-label="Primary navigation">
            <Link
              href="/cv"
              className="px-4 py-2 text-sm tracking-[0.15em] uppercase transition-all hover:scale-105 min-h-[44px] flex items-center"
              style={{
                border: `1px solid ${HK.darkPurple}`,
                color: HK.silver,
                background: `${HK.void}cc`,
                borderRadius: '2px 4px 2px 4px',
              }}
            >
              <span aria-hidden="true">◇ </span>CV
            </Link>
            <Link
              href="/personal-projects/game-engine"
              className="px-4 py-2 text-sm tracking-[0.15em] uppercase transition-all hover:scale-105 min-h-[44px] flex items-center"
              style={{
                border: `1px solid ${HK.soul}`,
                color: HK.soul,
                background: `${HK.soulDark}20`,
                borderRadius: '2px 4px 2px 4px',
                boxShadow: `0 0 15px ${HK.soulDark}30`,
              }}
            >
              <span aria-hidden="true">◇ </span>Nebulith
            </Link>
            <ThemeSwitcher />
          </nav>
        </div>
      </header>

      {/* Main content starts here */}
      <main id="main-content" tabIndex={-1} className="outline-none">

      {/* Current Roles - styled as soul vessels */}
      <section className="relative z-20 py-6 px-6" aria-labelledby="current-roles-heading">
        <h2 id="current-roles-heading" className="sr-only">Current Roles</h2>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-8" role="list">
            {CURRENT_ROLES.map((role) => (
              <div
                key={role.id}
                className="text-center px-4 py-2"
                style={{
                  background: `${HK.void}80`,
                  border: `1px solid ${HK.darkPurple}`,
                  borderRadius: '4px 8px 4px 8px',
                }}
                role="listitem"
              >
                <p className="text-sm tracking-[0.15em] uppercase" style={{ color: HK.soul }}>{role.title}</p>
                <p className="text-base" style={{ color: HK.bone }}>{role.company}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Profession Map - Hollow Knight style bench waypoints */}
      <section className="relative z-20 py-8" aria-labelledby="profession-heading">
        <h2 id="profession-heading" className="sr-only">Select Your Profession</h2>
        <div className="max-w-6xl mx-auto px-6">
          <div
            className="relative h-48 overflow-hidden"
            style={{
              background: `linear-gradient(180deg, transparent, ${HK.darkPurple}30)`,
              border: `1px solid ${HK.darkPurple}40`,
              borderRadius: '4px',
            }}
            role="tablist"
            aria-label="Profession selector"
          >
            {/* Connection paths */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id="soulLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={HK.soul} stopOpacity="0" />
                  <stop offset="50%" stopColor={HK.soul} stopOpacity="0.4" />
                  <stop offset="100%" stopColor={HK.soul} stopOpacity="0" />
                </linearGradient>
              </defs>
              <line x1="25%" y1="50%" x2="50%" y2="30%" stroke="url(#soulLineGrad)" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="50%" y1="30%" x2="75%" y2="50%" stroke="url(#soulLineGrad)" strokeWidth="1" strokeDasharray="4 4" />
            </svg>
            {professionNodes.map((node) => (
              <BenchWaypoint
                key={node.id}
                {...node}
                isActive={active === node.id}
                onClick={() => setActive(node.id as 'engineer' | 'drummer' | 'fighter')}
              />
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="relative z-20 py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <VoidFrame title="About">
            <p className="text-sm leading-relaxed mb-4" style={{ color: HK.bone }}>{aboutData.bio}</p>
            <div className="flex flex-wrap gap-3">
              {aboutData.quickFacts.map((fact, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-xs"
                  style={{
                    background: `${HK.soul}15`,
                    border: `1px solid ${HK.soul}40`,
                    color: HK.soul,
                    borderRadius: '2px 4px 2px 4px',
                  }}
                >
                  ◇ {fact}
                </span>
              ))}
            </div>
          </VoidFrame>
        </div>
      </section>

      {/* Art Section 1 - Knight silhouette with infection */}
      <ArtSectionKnight />

      {/* Work Experience */}
      {experience.length > 0 && (
        <section className="relative z-20 py-8 px-6">
          <div className="max-w-4xl mx-auto">
            <VoidFrame title="Work Experience">
              <div className="space-y-4">
                {experience.map((entry) => (
                  <ExperienceCard key={entry.id} entry={entry} />
                ))}
              </div>
            </VoidFrame>
          </div>
        </section>
      )}

      {/* Art Section 2 - Soul vessels */}
      <ArtSectionSoul />

      {/* Tech Stack / Skills */}
      <section className="relative z-20 py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <VoidFrame title={active === 'engineer' ? 'Tech Stack' : 'Skills'}>
            {active === 'engineer' ? (
              <TechCloud categories={engineerTech} />
            ) : (
              <SkillsList categories={otherSkills} />
            )}
          </VoidFrame>
        </div>
      </section>

      {/* Projects */}
      <section className="relative z-20 py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <VoidFrame title="Featured Work">
            <div className="grid md:grid-cols-2 gap-4">
              {projects.filter(p => p.featured).slice(0, 6).map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </VoidFrame>
        </div>
      </section>

      {/* Art Section 3 - Infection pattern */}
      <ArtSectionInfection />

      {/* Companies (Engineer) / Bands (Drummer) - Ventures */}
      {active === 'engineer' && (
        <section className="relative z-20 py-8 px-6">
          <div className="max-w-4xl mx-auto">
            <VoidFrame title="Ventures">
              <div className="grid md:grid-cols-3 gap-4">
                {COMPANIES.map((company) => (
                  <CompanyCard key={company.id} company={company} />
                ))}
              </div>
            </VoidFrame>
          </div>
        </section>
      )}

      {active === 'drummer' && (
        <section className="relative z-20 py-8 px-6">
          <div className="max-w-4xl mx-auto">
            <VoidFrame title="Bands">
              <div className="grid md:grid-cols-3 gap-4">
                {BANDS.map((band) => (
                  <BandCard key={band.id} band={band} />
                ))}
              </div>
            </VoidFrame>
          </div>
        </section>
      )}

      {/* Posts Section */}
      <section className="relative z-20 py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <VoidFrame title="Posts">
            <div className="text-center py-8">
              <p className="text-sm" style={{ color: HK.silver }}>
                Writings and thoughts coming soon...
              </p>
              <p className="text-xs mt-2 italic" style={{ color: HK.soul }}>
                ◇ Check back for updates on development, music, and martial arts
              </p>
            </div>
          </VoidFrame>
        </div>
      </section>

      {/* End of main content */}
      </main>

      {/* Footer */}
      <footer className="relative z-20 py-12 px-6 text-center" role="contentinfo">
        <div className="inline-flex items-center gap-4" style={{ color: HK.silver }}>
          <div className="w-12 h-px" style={{ background: HK.darkPurple }} aria-hidden="true" />
          <span className="text-sm tracking-[0.2em]" style={{ fontFamily: '"Cinzel", serif' }}>
            <span className="sr-only">Copyright </span>MMXXVI
          </span>
          <div className="w-12 h-px" style={{ background: HK.darkPurple }} aria-hidden="true" />
        </div>
      </footer>

      {/* Animations - GPU accelerated using transform and opacity only */}
      <style jsx global>{`
        /* Rain animation - uses transform only */
        @keyframes rain {
          0% { transform: translateY(-30px) translateZ(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100vh) translateZ(0); opacity: 0; }
        }

        /* Soul float - uses transform only */
        @keyframes soulFloat {
          0%, 100% { transform: translate3d(0, 0, 0); opacity: 0.2; }
          25% { transform: translate3d(10px, -30px, 0); opacity: 0.4; }
          50% { transform: translate3d(-8px, -15px, 0); opacity: 0.3; }
          75% { transform: translate3d(5px, -40px, 0); opacity: 0.35; }
        }

        /* Fade in animation */
        @keyframes fade-in-down {
          from { opacity: 0; transform: translate3d(0, -20px, 0); }
          to { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.8s ease-out;
          will-change: transform, opacity;
        }

        /* Slash reveal - uses transform only */
        @keyframes slashReveal {
          0% { transform: scaleX(0) translateZ(0); opacity: 0; }
          50% { transform: scaleX(1) translateZ(0); opacity: 1; }
          100% { transform: scaleX(0) translateZ(0); opacity: 0; }
        }

        /* Knight dash - uses transform only */
        @keyframes knightDash {
          0% { transform: translateX(-100px) translateZ(0); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateX(calc(100vw + 100px)) translateZ(0); opacity: 0; }
        }

        /* Vessel pulse - uses transform and opacity only, no filter */
        @keyframes vesselPulse {
          0%, 100% { transform: scale(1) translateZ(0); opacity: 1; }
          50% { transform: scale(1.05) translateZ(0); opacity: 0.9; }
        }

        /* Accessibility: Reduce motion for users who prefer it */
        @media (prefers-reduced-motion: reduce) {
          .animate-fade-in-down,
          .will-animate {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </div>
  )
}
