'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import { useProfession } from '@/contexts/ProfessionContext'
import { ABOUT_DATA, PROFESSIONAL_SUMMARY } from '@/data/about'
import { PROJECTS_DATA } from '@/data/projects'
import { getSkillsByProfession, getEngineerSkills } from '@/data/skills'
import { CURRENT_ROLES } from '@/data/roles'
import { COMPANIES } from '@/data/companies'
import { BANDS } from '@/data/bands'
import { EXPERIENCE_DATA, filterExperienceByProfession } from '@/data/experience'

// Color palette - Dark Souls authentic
const COLORS = {
  bonfire: '#ff6a00',
  ember: '#ff8c42',
  ash: '#3a3633',
  stone: '#252321',
  fog: '#8a9ba8',
  soul: '#00ccff',
  blood: '#8b0000',
  darksign: '#ff4400',
  gold: '#c9a227',
  humanity: '#1a1a1a',
}

// Undead Warrior Alexander - Pure CSS/SVG Dark Souls style
function UndeadWarrior({
  size = 60,
  direction = 'right',
  className = ''
}: {
  size?: number
  direction?: 'left' | 'right'
  className?: string
}) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  const flipStyle = direction === 'left' ? { transform: 'scaleX(-1)' } : {}

  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size * 1.2, ...flipStyle }}
      role="img"
      aria-label="Undead Warrior character"
    >
      <svg viewBox="0 0 40 48" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size * 1.2}>
        {/* Helmet */}
        <ellipse cx="20" cy="8" rx="6" ry="7" fill="#3a3633"/>
        <path d="M14 5 L20 2 L26 5 L26 10 L14 10 Z" fill="#4a4643"/>
        <rect x="17" y="9" width="6" height="2" fill="#1a1a1a" rx="1"/>
        {/* Visor slit */}
        <rect x="16" y="6" width="8" height="1" fill="#0a0a0a"/>
        {/* Body armor */}
        <path d="M14 14 L26 14 L28 32 L12 32 Z" fill="#2a2623"/>
        <path d="M16 16 L24 16 L25 28 L15 28 Z" fill="#3a3633"/>
        {/* Chainmail texture */}
        <line x1="16" y1="18" x2="24" y2="18" stroke="#4a4643" strokeWidth="0.5"/>
        <line x1="16" y1="21" x2="24" y2="21" stroke="#4a4643" strokeWidth="0.5"/>
        <line x1="16" y1="24" x2="24" y2="24" stroke="#4a4643" strokeWidth="0.5"/>
        {/* Sword on back */}
        <rect x="10" y="10" width="2" height="24" fill="#666" transform="rotate(-15 10 10)"/>
        <rect x="8" y="10" width="6" height="2" fill="#555" transform="rotate(-15 10 10)"/>
        {/* Arms */}
        <path d="M12 16 L6 24 L8 26 L14 18 Z" fill="#2a2623"/>
        <path d="M28 16 L34 24 L32 26 L26 18 Z" fill="#2a2623"/>
        {/* Shield arm */}
        <ellipse cx="6" cy="25" rx="4" ry="5" fill="#3a3633" stroke="#4a4643" strokeWidth="1"/>
        {/* Legs */}
        <path d="M14 30 L12 46 L16 46 L18 34 Z" fill="#2a2623"/>
        <path d="M26 30 L28 46 L24 46 L22 34 Z" fill="#2a2623"/>
        {/* Boots */}
        <ellipse cx="14" cy="46" rx="3" ry="2" fill="#1a1a1a"/>
        <ellipse cx="26" cy="46" rx="3" ry="2" fill="#1a1a1a"/>
        {/* Ember glow */}
        <circle cx="20" cy="24" r="8" fill={`url(#emberGlow-${direction})`} opacity="0.3"/>
        <defs>
          <radialGradient id={`emberGlow-${direction}`}>
            <stop offset="0%" stopColor={COLORS.bonfire}/>
            <stop offset="100%" stopColor="transparent"/>
          </radialGradient>
        </defs>
      </svg>
      {!prefersReducedMotion && (
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle, ${COLORS.bonfire}20 0%, transparent 60%)`,
          }}
          aria-hidden="true"
        />
      )}
    </div>
  )
}

// Praise the Sun gesture silhouette
function PraiseTheSun({ size = 80, className = '' }: { size?: number; className?: string }) {
  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label="Praise the Sun gesture - iconic Dark Souls pose"
    >
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Sun rays */}
        <g className="animate-sun-pulse" style={{ transformOrigin: '50px 25px' }}>
          {[...Array(8)].map((_, i) => (
            <line
              key={i}
              x1="50"
              y1="25"
              x2={50 + Math.cos((i * Math.PI) / 4) * 18}
              y2={25 + Math.sin((i * Math.PI) / 4) * 18}
              stroke={COLORS.gold}
              strokeWidth="2"
              opacity="0.6"
            />
          ))}
          <circle cx="50" cy="25" r="10" fill={COLORS.gold} opacity="0.8" />
        </g>
        {/* Knight silhouette - arms raised */}
        <g fill={COLORS.ash}>
          {/* Head */}
          <ellipse cx="50" cy="45" rx="6" ry="7" />
          {/* Body */}
          <path d="M42 52 L50 75 L58 52 Z" />
          {/* Left arm raised */}
          <path d="M43 55 L28 35 L32 33 L45 50 Z" />
          {/* Right arm raised */}
          <path d="M57 55 L72 35 L68 33 L55 50 Z" />
          {/* Legs */}
          <path d="M46 72 L44 95 L48 95 L50 78 L52 95 L56 95 L54 72 Z" />
        </g>
      </svg>
      {/* Glow effect */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle at 50% 25%, ${COLORS.gold}40 0%, transparent 50%)`,
        }}
        aria-hidden="true"
      />
    </div>
  )
}

// Knight silhouette - hollowed form
function HollowKnight({ variant = 'standing', className = '' }: { variant?: 'standing' | 'kneeling' | 'combat'; className?: string }) {
  const paths = {
    standing: 'M50 15 L47 20 L53 20 Z M45 22 L50 45 L55 22 Z M43 25 L35 35 L37 36 L44 28 Z M57 25 L65 35 L63 36 L56 28 Z M46 42 L44 70 L48 70 L50 50 L52 70 L56 70 L54 42 Z',
    kneeling: 'M50 25 L47 30 L53 30 Z M45 32 L50 50 L55 32 Z M43 35 L30 40 L32 42 L44 38 Z M50 48 L45 65 L50 60 L55 65 L50 48 Z M42 60 L38 70 L50 70 L45 60 Z M58 60 L62 70 L50 70 L55 60 Z',
    combat: 'M50 15 L47 20 L53 20 Z M45 22 L50 40 L55 22 Z M43 25 L25 20 L26 23 L42 28 Z M57 25 L75 35 L73 38 L56 30 Z M46 38 L44 65 L48 65 L50 45 L52 65 L56 65 L54 38 Z',
  }

  return (
    <div
      className={`opacity-20 ${className}`}
      role="img"
      aria-label={`Hollow knight silhouette in ${variant} pose`}
    >
      <svg viewBox="0 0 100 80" fill={COLORS.ash} width="60" height="48">
        <path d={paths[variant]} />
      </svg>
    </div>
  )
}

// Gothic stone texture overlay
function StoneTexture() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[1] opacity-[0.03]"
      aria-hidden="true"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
      }}
    />
  )
}

// Stone Section Card - ancient castle/bonfire aesthetic with textures
function StoneSectionCard({
  children,
  className = '',
  glowColor = COLORS.bonfire,
  ariaLabelledby,
}: {
  children: React.ReactNode
  className?: string
  glowColor?: string
  ariaLabelledby?: string
}) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return (
    <section
      className={`relative overflow-hidden ${className}`}
      style={{
        background: `
          linear-gradient(180deg, #15120fee 0%, #0c0a08ee 100%)
        `,
        border: `1px solid ${COLORS.ash}`,
        boxShadow: `
          inset 0 0 40px rgba(0,0,0,0.6),
          inset 0 1px 0 rgba(60,55,50,0.3),
          0 4px 20px rgba(0,0,0,0.4)
        `,
      }}
      aria-labelledby={ariaLabelledby}
    >
      {/* Stone/brick texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.08]"
        aria-hidden="true"
        style={{
          backgroundImage: `
            linear-gradient(90deg, transparent 0%, transparent 48%, rgba(40,35,30,0.5) 50%, transparent 52%, transparent 100%),
            linear-gradient(0deg, transparent 0%, transparent 48%, rgba(40,35,30,0.3) 50%, transparent 52%, transparent 100%)
          `,
          backgroundSize: '60px 40px',
        }}
      />

      {/* Cracked stone SVG pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        aria-hidden="true"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0 L25 30 L15 50 L30 100' stroke='%23555' stroke-width='0.5' fill='none'/%3E%3Cpath d='M60 0 L55 40 L70 70 L50 100' stroke='%23444' stroke-width='0.5' fill='none'/%3E%3Cpath d='M0 30 L40 35 L100 25' stroke='%23555' stroke-width='0.5' fill='none'/%3E%3Cpath d='M0 70 L30 75 L60 65 L100 80' stroke='%23444' stroke-width='0.5' fill='none'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
      />

      {/* Bonfire warm glow on edges */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          boxShadow: `
            inset 0 -2px 30px ${glowColor}15,
            inset -2px 0 20px ${glowColor}08,
            inset 2px 0 20px ${glowColor}08
          `,
        }}
      />

      {/* Ember/ash particle overlay */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-0.5 rounded-full animate-section-ember"
              style={{
                left: `${15 + Math.random() * 70}%`,
                bottom: '10%',
                background: i % 2 === 0 ? COLORS.ember : COLORS.gold,
                animationDelay: `${i * 0.8}s`,
                opacity: 0.6,
              }}
            />
          ))}
        </div>
      )}

      {/* Fog gate transparency at top */}
      <div
        className="absolute top-0 left-0 right-0 h-8 pointer-events-none"
        aria-hidden="true"
        style={{
          background: `linear-gradient(to bottom, ${COLORS.fog}08, transparent)`,
        }}
      />

      {/* Gothic corner ornaments - cathedral style */}
      {['top-0 left-0', 'top-0 right-0 scale-x-[-1]', 'bottom-0 left-0 scale-y-[-1]', 'bottom-0 right-0 scale-[-1]'].map((pos, i) => (
        <div key={i} className={`absolute ${pos} w-8 h-8 pointer-events-none`} aria-hidden="true">
          <svg viewBox="0 0 32 32" fill="none">
            {/* Gothic arch corner */}
            <path d="M0 0 L32 0 L32 4 L4 4 L4 32 L0 32 Z" fill={COLORS.ash} opacity="0.6"/>
            <path d="M0 0 L16 0 L16 2 L2 2 L2 16 L0 16 Z" fill={glowColor} opacity="0.2"/>
            {/* Decorative flourish */}
            <circle cx="8" cy="8" r="2" fill={COLORS.ash} opacity="0.4"/>
          </svg>
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 p-6">
        {children}
      </div>
    </section>
  )
}

// Profession-specific ember ornaments
function EmberOrnaments({ profession }: { profession: 'engineer' | 'drummer' | 'fighter' }) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  const ornamentsByProfession = {
    engineer: [
      { icon: '⚙️', x: 5, y: 20, size: 28 },
      { icon: '💻', x: 92, y: 30, size: 26 },
      { icon: '🔧', x: 6, y: 70, size: 24 },
      { icon: '📟', x: 90, y: 75, size: 26 },
    ],
    drummer: [
      { icon: '🥁', x: 4, y: 25, size: 30 },
      { icon: '🎹', x: 90, y: 20, size: 28 },
      { icon: '🎵', x: 6, y: 65, size: 24 },
      { icon: '🎶', x: 92, y: 70, size: 26 },
    ],
    fighter: [
      { icon: '⚔️', x: 5, y: 22, size: 28 },
      { icon: '🛡️', x: 90, y: 28, size: 26 },
      { icon: '👊', x: 6, y: 68, size: 26 },
      { icon: '🔥', x: 92, y: 72, size: 28 },
    ],
  }

  const items = ornamentsByProfession[profession]

  if (prefersReducedMotion) {
    return (
      <div className="fixed inset-0 pointer-events-none z-[4] overflow-hidden" aria-hidden="true">
        {items.map((item, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              fontSize: item.size,
              opacity: 0.3,
              filter: `drop-shadow(0 0 8px ${COLORS.bonfire}99)`,
            }}
          >
            {item.icon}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-[4] overflow-hidden" aria-hidden="true">
      {items.map((item, i) => (
        <div
          key={i}
          className="absolute animate-ember-float"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            fontSize: item.size,
            opacity: 0.4,
            filter: `drop-shadow(0 0 8px ${COLORS.bonfire}99)`,
            animation: `emberFloat ${12 + i * 3}s ease-in-out infinite`,
            animationDelay: `${-i * 2}s`,
          }}
        >
          {item.icon}
        </div>
      ))}
    </div>
  )
}

// Souls counter - floating soul particles
function SoulsCounter({ count }: { count: number }) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return (
    <div
      className="fixed top-6 right-24 z-40 flex items-center gap-2"
      role="status"
      aria-label={`Souls: ${count.toLocaleString()}`}
    >
      <div className="relative">
        <div
          className={`w-6 h-6 rounded-full ${!prefersReducedMotion ? 'animate-pulse' : ''}`}
          style={{
            background: `radial-gradient(circle at 30% 30%, ${COLORS.soul}, #00aacc 50%, #006688)`,
            boxShadow: `0 0 15px ${COLORS.soul}, 0 0 30px #00aacc40`,
          }}
          aria-hidden="true"
        />
        {!prefersReducedMotion && [...Array(4)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-cyan-400 animate-soul-float"
            style={{
              left: '50%',
              top: '50%',
              animationDelay: `${i * 0.3}s`,
            }}
            aria-hidden="true"
          />
        ))}
      </div>
      <span
        className="text-sm font-bold tracking-wider"
        style={{ color: COLORS.soul, textShadow: `0 0 10px ${COLORS.soul}` }}
      >
        {count.toLocaleString()}
      </span>
    </div>
  )
}

// Animated Bonfire component - enhanced with more realistic flames
function Bonfire({ size = 'normal', label }: { size?: 'small' | 'normal' | 'large'; label?: string }) {
  const scales = { small: 0.5, normal: 1, large: 1.5 }
  const scale = scales[size]
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return (
    <div
      className="relative"
      style={{ transform: `scale(${scale})` }}
      role="img"
      aria-label={label || 'Bonfire checkpoint'}
    >
      {/* Coiled sword in ground */}
      <div
        className="absolute -top-14 left-1/2 -translate-x-1/2 w-2 h-16"
        style={{
          background: `linear-gradient(to bottom, #aaa, #666 30%, #444)`,
          boxShadow: '0 0 5px rgba(0,0,0,0.8)',
          clipPath: 'polygon(30% 0, 70% 0, 60% 100%, 40% 100%)',
        }}
        aria-hidden="true"
      >
        {/* Sword crossguard - curved like coiled sword */}
        <div
          className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-3"
          style={{
            background: `linear-gradient(to bottom, #777, #555)`,
            borderRadius: '0 0 50% 50%',
          }}
        />
        {/* Sword handle wrap */}
        <div
          className="absolute -top-4 left-1/2 -translate-x-1/2 w-2 h-5"
          style={{ background: '#442211' }}
        />
      </div>

      {/* Fire base container */}
      <div className="relative w-20 h-16">
        {/* Main flames - more organic shapes */}
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            className={prefersReducedMotion ? '' : 'animate-flame'}
            style={{
              position: 'absolute',
              bottom: '8px',
              left: `${5 + i * 12}%`,
              width: `${14 + Math.sin(i) * 6}px`,
              height: `${24 + Math.cos(i * 2) * 16}px`,
              background: `linear-gradient(to top,
                ${COLORS.darksign} 0%,
                ${COLORS.bonfire} 30%,
                ${COLORS.ember} 60%,
                ${COLORS.gold} 85%,
                transparent 100%
              )`,
              borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
              animationDelay: `${i * 0.12}s`,
              filter: 'blur(0.5px)',
              opacity: 0.95,
            }}
            aria-hidden="true"
          />
        ))}

        {/* Inner bright core */}
        <div
          className="absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-6"
          style={{
            background: `radial-gradient(ellipse at 50% 80%, ${COLORS.gold}, ${COLORS.ember} 50%, transparent 80%)`,
            filter: 'blur(2px)',
          }}
          aria-hidden="true"
        />

        {/* Rising embers */}
        {!prefersReducedMotion && [...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full animate-ember"
            style={{
              left: `${25 + Math.random() * 50}%`,
              bottom: '40%',
              background: i % 3 === 0 ? COLORS.gold : i % 2 === 0 ? COLORS.bonfire : COLORS.ember,
              animationDelay: `${i * 0.25}s`,
              boxShadow: `0 0 4px ${COLORS.bonfire}`,
            }}
            aria-hidden="true"
          />
        ))}

        {/* Ambient glow */}
        <div
          className="absolute -inset-8"
          style={{
            background: `radial-gradient(ellipse at 50% 80%, ${COLORS.bonfire}60, ${COLORS.darksign}30 40%, transparent 70%)`,
            filter: 'blur(8px)',
          }}
          aria-hidden="true"
        />
      </div>

      {/* Coal/ash base */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-5 rounded-full"
        style={{
          background: `radial-gradient(ellipse, #331100, #1a0800 60%, #0a0400)`,
          boxShadow: `inset 0 2px 8px ${COLORS.darksign}40`,
        }}
        aria-hidden="true"
      />
    </div>
  )
}

// Fog Gate - misty barrier as section divider
function FogGate() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return (
    <div
      className="relative h-20 w-full overflow-hidden my-8"
      role="separator"
      aria-label="Section divider - fog wall"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Main fog layers */}
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={prefersReducedMotion ? '' : 'animate-fog-drift'}
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(90deg,
                transparent 0%,
                rgba(138, 155, 168, ${0.08 - i * 0.015}) 15%,
                rgba(180, 195, 210, ${0.12 - i * 0.02}) 50%,
                rgba(138, 155, 168, ${0.08 - i * 0.015}) 85%,
                transparent 100%
              )`,
              animationDelay: `${i * 2.5}s`,
              animationDuration: `${10 + i * 2}s`,
            }}
            aria-hidden="true"
          />
        ))}

        {/* Fog particles */}
        {!prefersReducedMotion && [...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-fog-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${25 + Math.random() * 50}px`,
              height: `${12 + Math.random() * 25}px`,
              background: `radial-gradient(ellipse, rgba(180, 195, 210, ${0.08 + Math.random() * 0.08}), transparent)`,
              animationDelay: `${Math.random() * 6}s`,
              filter: 'blur(6px)',
            }}
            aria-hidden="true"
          />
        ))}

        {/* Interaction prompt */}
        <div className="relative z-10 text-center">
          <span
            className={`text-xs tracking-[0.3em] ${!prefersReducedMotion ? 'animate-pulse' : ''}`}
            style={{ color: `${COLORS.fog}80`, textShadow: `0 0 15px ${COLORS.fog}40` }}
          >
            TRAVERSE THE WHITE LIGHT
          </span>
        </div>
      </div>
    </div>
  )
}

// Bloodstain decoration
function Bloodstain({ className = '' }: { className?: string }) {
  return (
    <div className={`relative ${className}`} aria-hidden="true">
      <svg width="35" height="35" viewBox="0 0 35 35" className="opacity-25">
        <ellipse cx="17" cy="22" rx="14" ry="9" fill="#550000" />
        <ellipse cx="17" cy="19" rx="9" ry="6" fill={COLORS.blood} />
        <circle cx="11" cy="11" r="4" fill="#660000" />
        <circle cx="23" cy="9" r="2.5" fill="#550000" />
        <ellipse cx="8" cy="18" rx="2" ry="3" fill="#440000" />
      </svg>
    </div>
  )
}

// Estus Flask - enhanced
function EstusFlask({ charges = 5, maxCharges = 5 }: { charges?: number; maxCharges?: number }) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return (
    <div
      className="flex items-center gap-2"
      role="status"
      aria-label={`Estus Flask: ${charges} of ${maxCharges} charges`}
    >
      <div className="relative w-8 h-14">
        {/* Flask body - more rounded like actual Estus */}
        <div
          className="absolute bottom-0 w-full h-11 rounded-b-xl rounded-t-lg"
          style={{
            background: `linear-gradient(to right, #4a3520, #6b4c30, #4a3520)`,
            border: '2px solid #3a2810',
            boxShadow: 'inset 0 0 8px rgba(0,0,0,0.5)',
          }}
          aria-hidden="true"
        />
        {/* Flask neck */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-5 rounded-t-lg"
          style={{
            background: `linear-gradient(to right, #3a2810, #4a3520, #3a2810)`,
          }}
          aria-hidden="true"
        />
        {/* Cork */}
        <div
          className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-2 rounded-t"
          style={{ background: '#2a1808' }}
          aria-hidden="true"
        />
        {/* Liquid */}
        <div
          className={`absolute bottom-1 left-1 right-1 rounded-b-lg ${!prefersReducedMotion ? 'animate-liquid-glow' : ''}`}
          style={{
            height: `${(charges / maxCharges) * 75}%`,
            background: `linear-gradient(to top, ${COLORS.darksign}, ${COLORS.bonfire}, ${COLORS.ember})`,
            boxShadow: `0 0 12px ${COLORS.bonfire}, inset 0 0 12px ${COLORS.gold}80`,
          }}
          aria-hidden="true"
        />
      </div>
      <span className="text-sm font-bold" style={{ color: COLORS.bonfire }}>
        {charges}/{maxCharges}
      </span>
    </div>
  )
}

// Darksign - Sun eclipse symbol - enhanced
function Darksign({ size = 40 }: { size?: number }) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return (
    <div
      className="relative"
      style={{ width: size, height: size }}
      role="img"
      aria-label="Darksign - mark of the undead"
    >
      {/* Outer ring - dark flame corona */}
      <div
        className={prefersReducedMotion ? '' : 'animate-darksign-pulse'}
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: `radial-gradient(circle,
            transparent 35%,
            ${COLORS.darksign} 45%,
            ${COLORS.bonfire} 50%,
            ${COLORS.blood} 60%,
            #330000 70%,
            transparent 78%
          )`,
          boxShadow: `0 0 25px ${COLORS.darksign}50, inset 0 0 20px ${COLORS.darksign}30`,
        }}
        aria-hidden="true"
      />
      {/* Inner dark circle - the hollow sun */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '20%',
          right: '20%',
          bottom: '20%',
          borderRadius: '50%',
          background: `radial-gradient(circle at 35% 35%, #1a1a1a, ${COLORS.humanity})`,
          boxShadow: 'inset 0 0 12px rgba(0,0,0,0.9)',
        }}
        aria-hidden="true"
      />
    </div>
  )
}

// YOU DIED text effect - enhanced with authentic styling
function YouDied({ show }: { show: boolean }) {
  if (!show) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none animate-you-died"
      role="alert"
      aria-live="assertive"
    >
      <div
        className="text-6xl md:text-8xl font-serif tracking-[0.6em] uppercase"
        style={{
          color: COLORS.blood,
          textShadow: `0 0 60px #ff0000, 0 0 120px ${COLORS.blood}`,
          fontFamily: '"Cinzel", "Trajan Pro", serif',
          filter: 'blur(0.3px)',
        }}
      >
        YOU DIED
      </div>
    </div>
  )
}

// Sword stuck in ground - rest point marker
function SwordMarker() {
  return (
    <div className="relative w-6 h-16" role="img" aria-label="Bonfire sword marker">
      {/* Blade */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-10"
        style={{
          background: `linear-gradient(to bottom, #ddd, #999 20%, #777)`,
          boxShadow: '0 0 5px rgba(0,0,0,0.5)',
          clipPath: 'polygon(30% 0, 70% 0, 55% 100%, 45% 100%)',
        }}
        aria-hidden="true"
      />
      {/* Crossguard */}
      <div
        className="absolute top-8 left-1/2 -translate-x-1/2 w-6 h-1.5 rounded"
        style={{ background: `linear-gradient(to bottom, #666, ${COLORS.ash})` }}
        aria-hidden="true"
      />
      {/* Handle */}
      <div
        className="absolute top-9 left-1/2 -translate-x-1/2 w-1.5 h-4"
        style={{ background: '#3a2211' }}
        aria-hidden="true"
      />
      {/* Pommel */}
      <div
        className="absolute top-12 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full"
        style={{ background: `linear-gradient(135deg, #444, #222)` }}
        aria-hidden="true"
      />
    </div>
  )
}

// Map fog/unexplored area effect - Dark Souls style
function MapFog() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-[2]" aria-hidden="true">
      {/* Dark vignette - heavier for Dark Souls feel */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 50% 50%, transparent 20%, rgba(5, 5, 8, 0.85) 100%)
          `,
        }}
      />
      {/* Ash particles */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0 opacity-15">
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-gray-500 animate-ash-fall"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 12}s`,
                animationDuration: `${12 + Math.random() * 12}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Zone/Room node on the map - Dark Souls bonfire style
function ZoneNode({
  profession,
  isActive,
  isExplored,
  onClick,
  connections,
}: {
  profession: 'engineer' | 'drummer' | 'fighter'
  isActive: boolean
  isExplored: boolean
  onClick: () => void
  connections: Array<{ direction: 'up' | 'down' | 'left' | 'right' }>
}) {
  const zones = {
    engineer: { name: 'FIRELINK CORE', icon: null, color: COLORS.bonfire, description: 'System Architecture' },
    drummer: { name: 'DEPTHS OF RHYTHM', icon: null, color: '#9966ff', description: 'Musical Prowess' },
    fighter: { name: 'ARENA OF DUELS', icon: null, color: '#ff4444', description: 'Combat Mastery' },
  }
  const zone = zones[profession]

  return (
    <button
      onClick={onClick}
      className={`relative transition-all duration-500 ${
        isActive ? 'scale-110 z-20' : 'hover:scale-105 opacity-70 hover:opacity-100'
      }`}
      aria-label={`${zone.name} - ${zone.description}. ${isActive ? 'Currently active.' : ''} ${isExplored ? 'Explored.' : 'Unexplored.'}`}
      aria-pressed={isActive}
    >
      {/* Connection lines - ancient stone paths */}
      {connections.map((conn, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            ...(conn.direction === 'up' && { top: '-30px', left: '50%', width: '3px', height: '30px', transform: 'translateX(-50%)' }),
            ...(conn.direction === 'down' && { bottom: '-30px', left: '50%', width: '3px', height: '30px', transform: 'translateX(-50%)' }),
            ...(conn.direction === 'left' && { left: '-30px', top: '50%', width: '30px', height: '3px', transform: 'translateY(-50%)' }),
            ...(conn.direction === 'right' && { right: '-30px', top: '50%', width: '30px', height: '3px', transform: 'translateY(-50%)' }),
            background: `linear-gradient(${conn.direction === 'left' || conn.direction === 'right' ? '90deg' : '180deg'}, transparent, ${COLORS.ash}80, transparent)`,
          }}
          aria-hidden="true"
        />
      ))}

      {/* Zone container - gothic stone frame */}
      <div
        className="w-32 h-24 flex flex-col items-center justify-center relative"
        style={{
          background: isActive
            ? `radial-gradient(ellipse at 50% 80%, ${zone.color}30, ${COLORS.stone} 70%)`
            : isExplored
            ? `linear-gradient(180deg, ${COLORS.stone}, #151015)`
            : '#0a0808',
          border: `2px solid ${isActive ? zone.color : isExplored ? '#2a2025' : '#151015'}`,
          boxShadow: isActive
            ? `0 0 40px ${zone.color}30, inset 0 0 30px ${zone.color}15`
            : 'inset 0 0 20px rgba(0,0,0,0.5)',
        }}
      >
        {/* Mini bonfire when active */}
        {isActive && (
          <div className="absolute -top-8" aria-hidden="true">
            <Bonfire size="small" />
          </div>
        )}

        {/* Zone icon - sword marker when not active */}
        {!isActive && isExplored && (
          <div className="absolute -top-10 scale-50" aria-hidden="true">
            <SwordMarker />
          </div>
        )}

        <span
          className="text-[9px] tracking-[0.3em] font-bold mt-2"
          style={{ color: isActive ? zone.color : '#555045' }}
        >
          {zone.name}
        </span>
        <span
          className="text-sm tracking-wider mt-1"
          style={{ color: isActive ? '#aaa' : '#444' }}
        >
          {zone.description}
        </span>
      </div>

      {/* Rest at bonfire prompt */}
      {isActive && (
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap" aria-hidden="true">
          <span className="text-sm tracking-widest animate-pulse" style={{ color: `${COLORS.bonfire}80` }}>
            BONFIRE LIT
          </span>
        </div>
      )}
    </button>
  )
}

// Impact statement for skills - NO 1-5 bars, shows achievements
function SkillImpact({ name, impact, icon }: { name: string; impact: string; icon?: string }) {
  return (
    <div
      className="flex items-start gap-3 py-3 border-b"
      style={{ borderColor: '#1a1518' }}
    >
      <div
        className="w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{
          background: `${COLORS.bonfire}15`,
          border: `1px solid ${COLORS.bonfire}40`,
        }}
      >
        {icon ? (
          <span className="text-sm">{icon}</span>
        ) : (
          <Darksign size={14} />
        )}
      </div>
      <div className="flex-1">
        <span className="text-xs font-bold tracking-wide block" style={{ color: COLORS.ember }}>
          {name}
        </span>
        <span className="text-[11px] leading-relaxed block mt-1" style={{ color: '#a09080' }}>
          {impact}
        </span>
      </div>
    </div>
  )
}

// Save room style project card - Bonfire checkpoint with impact
function SaveRoomCard({ project }: { project: typeof PROJECTS_DATA[0] }) {
  return (
    <article
      className="p-4 group cursor-pointer transition-all relative overflow-hidden"
      style={{
        background: `linear-gradient(180deg, #12100f, #0a0908)`,
        border: `1px solid ${COLORS.ash}`,
      }}
      aria-labelledby={`project-${project.id}`}
    >
      {/* Ember glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background: `radial-gradient(ellipse at 50% 100%, ${COLORS.bonfire}10, transparent 70%)`,
        }}
        aria-hidden="true"
      />

      {/* Save point indicator - small ember */}
      <div className="flex items-center gap-2 mb-2 relative">
        <div
          className="w-3 h-3 rounded-full"
          style={{
            background: project.featured
              ? `radial-gradient(circle, ${COLORS.gold}, ${COLORS.bonfire})`
              : `radial-gradient(circle, #666, ${COLORS.ash})`,
            boxShadow: project.featured ? `0 0 10px ${COLORS.bonfire}60` : 'none',
          }}
          aria-hidden="true"
        />
        <h3
          id={`project-${project.id}`}
          className="text-sm tracking-wide"
          style={{ color: project.featured ? '#ffaa66' : '#8a8070' }}
        >
          {project.name}
        </h3>
      </div>
      <p className="text-sm mb-2 leading-relaxed" style={{ color: '#666050' }}>
        {project.tagline}
      </p>
      {/* Impact statement instead of just description */}
      {project.impact && (
        <p className="text-[11px] mb-3 leading-relaxed" style={{ color: '#a09080' }}>
          {project.impact}
        </p>
      )}
      <div className="flex gap-1 flex-wrap">
        {project.techStack.slice(0, 3).map((tech) => (
          <span
            key={tech}
            className="text-sm px-2 py-0.5 tracking-wide"
            style={{
              background: '#1a1815',
              color: '#887860',
              border: `1px solid ${COLORS.ash}`,
            }}
          >
            {tech}
          </span>
        ))}
      </div>
    </article>
  )
}

// Company card - Dark Souls merchant style
function CompanyCard({ company }: { company: typeof COMPANIES[0] }) {
  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 group transition-all relative overflow-hidden"
      style={{
        background: `linear-gradient(180deg, #12100f, #0a0908)`,
        border: `1px solid ${COLORS.ash}`,
      }}
      aria-label={`${company.name} - ${company.tagline}. ${company.description}`}
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${COLORS.bonfire}10, transparent 70%)`,
        }}
        aria-hidden="true"
      />

      <div className="flex items-center gap-3 mb-2 relative">
        <span className="text-2xl" aria-hidden="true">{company.icon}</span>
        <div>
          <h4 className="text-sm tracking-wide group-hover:text-orange-300 transition-colors" style={{ color: '#c0a080' }}>
            {company.name}
          </h4>
          <p className="text-sm" style={{ color: COLORS.bonfire }}>{company.tagline}</p>
        </div>
      </div>
      <p className="text-xs leading-relaxed" style={{ color: '#666050' }}>{company.description}</p>

      {/* External link indicator */}
      <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true">
        <span className="text-sm" style={{ color: `${COLORS.bonfire}60` }}>TRAVEL</span>
      </div>
    </a>
  )
}

// Band card - Dark Souls covenant style
function BandCard({ band }: { band: typeof BANDS[0] }) {
  const content = (
    <article
      className="p-4 group transition-all relative overflow-hidden"
      style={{
        background: `linear-gradient(180deg, #12100f, #0a0908)`,
        border: `1px solid ${COLORS.ash}`,
      }}
      aria-label={`${band.name} - ${band.genre}, ${band.role}. ${band.description}`}
    >
      {/* Hover glow - purple for music */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, #9966ff10, transparent 70%)`,
        }}
        aria-hidden="true"
      />

      <h4 className="text-sm tracking-wide group-hover:text-purple-300 transition-colors" style={{ color: '#b090d0' }}>
        {band.name}
      </h4>
      <p className="text-sm mt-1" style={{ color: '#9966ff' }}>{band.genre} - {band.role}</p>
      <p className="text-xs mt-2 leading-relaxed" style={{ color: '#666050' }}>{band.description}</p>
      {!band.url && (
        <p className="text-sm mt-2 italic" style={{ color: '#444' }}>Covenant forming...</p>
      )}
    </article>
  )

  if (band.url) {
    return <a href={band.url} target="_blank" rel="noopener noreferrer" className="block">{content}</a>
  }
  return content
}

// Work experience card - Dark Souls item description style
function ExperienceCard({ entry }: { entry: typeof EXPERIENCE_DATA[0] }) {
  const endDisplay = entry.endDate ? new Date(entry.endDate).getFullYear() : 'Present'
  const startDisplay = new Date(entry.startDate).getFullYear()

  return (
    <article
      className="p-4 relative"
      style={{
        background: `linear-gradient(180deg, #12100f, #0a0908)`,
        border: `1px solid ${COLORS.ash}`,
      }}
      aria-label={`${entry.title} at ${entry.organization}, ${startDisplay} to ${endDisplay}`}
    >
      {/* Ember accent on left */}
      <div
        className="absolute left-0 top-4 bottom-4 w-1"
        style={{
          background: `linear-gradient(to bottom, ${COLORS.bonfire}00, ${COLORS.bonfire}, ${COLORS.bonfire}00)`,
          boxShadow: `0 0 8px ${COLORS.bonfire}40`,
        }}
        aria-hidden="true"
      />

      <div className="flex justify-between items-start mb-2 pl-3">
        <div>
          <h4 className="text-sm tracking-wide" style={{ color: '#c0a080' }}>{entry.title}</h4>
          <p className="text-xs" style={{ color: COLORS.bonfire }}>{entry.organization}</p>
        </div>
        <span className="text-sm tracking-wide" style={{ color: '#666050' }}>
          {startDisplay} - {endDisplay}
        </span>
      </div>
      <p className="text-xs mb-2 pl-3 leading-relaxed" style={{ color: '#807060' }}>{entry.description}</p>
      {entry.highlights && entry.highlights.length > 0 && (
        <ul className="pl-3 space-y-1" aria-label="Achievements">
          {entry.highlights.map((highlight, i) => (
            <li key={i} className="text-xs flex items-start gap-2" style={{ color: '#a09080' }}>
              <span style={{ color: `${COLORS.bonfire}80` }} aria-hidden="true">◆</span>
              {highlight}
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

// Tech stack for engineer - Dark Souls attribute style with impacts
function TechCloud({ categories }: { categories: ReturnType<typeof getEngineerSkills> }) {
  // Impact statements for tech categories
  const categoryImpacts: Record<string, string> = {
    'Languages': 'Primary: Elixir & TypeScript. Built enterprise systems processing millions of transactions.',
    'Backend Frameworks': 'Phoenix/Ash specialist. Architected multi-tenant SaaS platforms from scratch.',
    'Frontend Frameworks': 'Full-stack delivery from React SPAs to LiveView real-time dashboards.',
    'Databases': 'PostgreSQL performance tuning, complex migrations, data modeling at scale.',
    'Cloud & DevOps': 'Kubernetes clusters, GitOps pipelines, infrastructure as code.',
    'Integrations & APIs': 'Shopify, Stripe, Google Workspace - built production integrations used by thousands.',
    'AI & Automation': 'Claude/GPT integrations, prompt engineering for production AI features.',
  }

  return (
    <div className="space-y-6" role="list" aria-label="Technology categories">
      {categories.map((category) => (
        <div key={category.name} role="listitem">
          <div className="flex items-center gap-2 mb-2">
            <Darksign size={12} />
            <h3 className="text-xs tracking-[0.2em]" style={{ color: '#886640' }}>
              {category.name.toUpperCase()}
            </h3>
          </div>
          {/* Impact statement */}
          {categoryImpacts[category.name] && (
            <p className="text-[11px] mb-3 leading-relaxed" style={{ color: '#a09080' }}>
              {categoryImpacts[category.name]}
            </p>
          )}
          <div className="flex flex-wrap gap-2" role="list" aria-label={`${category.name} technologies`}>
            {category.items.map((tech) => (
              <span
                key={tech}
                role="listitem"
                className="px-3 py-1 text-xs transition-all hover:scale-105 cursor-default"
                style={{
                  background: '#12100f',
                  border: `1px solid ${COLORS.ash}`,
                  color: '#a09080',
                }}
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

// Skills display for drummer/fighter - with achievements, NO bars
function SkillsDisplay({ categories }: { categories: ReturnType<typeof getSkillsByProfession> }) {
  // Impact statements for skills
  const skillImpacts: Record<string, string> = {
    // Drummer
    'Rock/Metal': 'Active in 3 metal/rock bands, studio recording experience',
    'Progressive': 'Complex time signatures, dynamic arrangements with Eon',
    'Latin/Salsa': 'Trained in authentic Latin rhythms and clave patterns',
    'Jazz Fusion': 'Polyrhythmic independence, improvisational chops',
    'Funk/Soul': 'Retrogroove founding member, deep pocket grooves',
    'Double Bass': 'Clean, controlled double bass at 180+ BPM',
    'Polyrhythms': '4 over 3, 5 over 4, layered independence',
    'Odd Time Signatures': '7/8, 11/8, metric modulation proficiency',
    'Ghost Notes': 'Dynamic control and subtle ghost note phrasing',
    'Linear Drumming': 'No simultaneous hits, flowing single-surface patterns',
    'Studio Recording': '15+ years, multiple album recordings',
    'Live Touring': '7 years professional live performance',
    'Session Work': 'Hired for studio sessions across genres',
    'Music Production': 'Logic Pro, home studio setup',
    // Fighter
    'Muay Thai (3 years)': 'Clinch work, elbow/knee techniques, fight cardio',
    'Brazilian Jiu-Jitsu (2 years)': 'Guard game, submissions, positional control',
    'MMA (1 year)': 'Integrating striking with grappling transitions',
    'Wrestling': 'Takedown defense, scrambles',
    'Striking': 'Boxing fundamentals, Thai kicks, combinations',
    'Clinch Work': 'Thai clinch control, dirty boxing',
    'Ground Game': 'Top pressure, guard passing',
    'Submissions': 'Triangle, armbar, RNC, guillotine',
    'Fundamentals Instruction': 'Teaching beginners proper technique',
    'Competition Prep': 'Preparing fighters for amateur bouts',
    'Self Defense': 'Practical self-defense applications',
    'Private Coaching': 'One-on-one skill development',
  }

  return (
    <div className="space-y-6" role="list" aria-label="Skill categories">
      {categories.map((category) => (
        <div key={category.name} role="listitem">
          <div className="flex items-center gap-2 mb-3">
            {category.icon && <span className="text-lg" aria-hidden="true">{category.icon}</span>}
            <h3 className="text-sm tracking-[0.2em]" style={{ color: '#886640' }}>
              {category.name.toUpperCase()}
            </h3>
          </div>
          <div className="space-y-0" role="list" aria-label={`${category.name} skills`}>
            {category.skills.map((skill) => (
              <SkillImpact
                key={skill.name}
                name={skill.name}
                impact={skillImpacts[skill.name] || 'Developed through years of dedicated practice'}
                icon={category.icon}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// Mini-map component - Dark Souls style
function MiniMap({ active }: { active: string }) {
  const positions = {
    engineer: { x: 1, y: 1 },
    drummer: { x: 2, y: 0 },
    fighter: { x: 0, y: 2 },
  }
  const pos = positions[active as keyof typeof positions]

  return (
    <nav
      className="fixed bottom-6 right-6 p-3 z-30"
      style={{
        background: `linear-gradient(180deg, ${COLORS.stone}ee, #05050899)`,
        border: `2px solid ${COLORS.ash}`,
        boxShadow: '0 0 20px rgba(0,0,0,0.8)',
      }}
      aria-label="Navigation map"
    >
      <div className="text-sm tracking-widest mb-2 text-center" style={{ color: '#666050' }}>
        LORDRAN
      </div>
      <div className="grid grid-cols-3 gap-1" role="grid" aria-label="Area grid">
        {Array.from({ length: 9 }).map((_, i) => {
          const x = i % 3
          const y = Math.floor(i / 3)
          const isCurrent = pos.x === x && pos.y === y
          const areaNames = ['', 'Drums', '', 'Fighter', 'Hub', 'Engineer', '', '', '']
          return (
            <div
              key={i}
              role="gridcell"
              aria-label={areaNames[i] || 'Empty area'}
              aria-current={isCurrent ? 'location' : undefined}
              className="w-4 h-4 relative"
              style={{
                background: isCurrent
                  ? `radial-gradient(circle, ${COLORS.bonfire}, ${COLORS.darksign}80)`
                  : '#1a1815',
                boxShadow: isCurrent ? `0 0 10px ${COLORS.bonfire}60` : 'none',
                border: `1px solid ${COLORS.ash}`,
              }}
            >
              {isCurrent && (
                <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                  <div className="w-1 h-1 rounded-full bg-white animate-pulse" />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </nav>
  )
}

// Current roles - Dark Souls covenant ranks
function RolesDisplay() {
  return (
    <div className="flex flex-wrap justify-center gap-6" role="list" aria-label="Current positions">
      {CURRENT_ROLES.map((role) => (
        <div
          key={role.id}
          role="listitem"
          className="text-center px-4 py-2 relative"
          style={{
            background: `linear-gradient(180deg, transparent, ${COLORS.bonfire}08)`,
            borderBottom: `1px solid ${COLORS.bonfire}40`,
          }}
        >
          <p className="text-xs tracking-[0.2em]" style={{ color: COLORS.bonfire }}>{role.title}</p>
          <p className="text-sm mt-1" style={{ color: '#c0b0a0' }}>{role.company}</p>
        </div>
      ))}
    </div>
  )
}

export default function SoulMapTheme() {
  const { active, setActive } = useProfession()
  const [mounted, setMounted] = useState(false)
  const [explored, setExplored] = useState<Set<string>>(new Set(['engineer']))
  const [souls, setSouls] = useState(125890)
  const [showDeath, setShowDeath] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  const aboutData = ABOUT_DATA[active]
  const skills = getSkillsByProfession(active)
  const engineerTech = getEngineerSkills()
  const projects = PROJECTS_DATA.filter(p => p.professions.includes(active) || p.featured)
  const experience = filterExperienceByProfession(EXPERIENCE_DATA, active)

  useEffect(() => {
    setMounted(true)
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    if (prefersReducedMotion) return
    // Increment souls slowly for effect
    const interval = setInterval(() => {
      setSouls(s => s + Math.floor(Math.random() * 10))
    }, 3000)
    return () => clearInterval(interval)
  }, [prefersReducedMotion])

  const handleZoneClick = (prof: 'engineer' | 'drummer' | 'fighter') => {
    setActive(prof)
    setExplored(prev => new Set([...prev, prof]))
  }

  if (!mounted) return null

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: `linear-gradient(180deg, #0a0808, #050505)`,
        fontFamily: '"Cinzel", "Times New Roman", serif',
      }}
    >
      {/* Skip to content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2"
        style={{ background: COLORS.bonfire, color: '#000' }}
      >
        Skip to main content
      </a>

      {/* Stone texture overlay */}
      <StoneTexture />

      {/* Map effects */}
      <MapFog />

      {/* Profession ornaments */}
      <EmberOrnaments profession={active} />

      {/* Souls counter */}
      <SoulsCounter count={souls} />

      {/* YOU DIED overlay */}
      <YouDied show={showDeath} />

      {/* Scattered bloodstains */}
      <Bloodstain className="fixed top-32 left-[10%] z-[1]" />
      <Bloodstain className="fixed top-[60%] right-[15%] z-[1] rotate-45" />
      <Bloodstain className="fixed bottom-40 left-[30%] z-[1] -rotate-12" />

      {/* Hollow knight silhouettes */}
      <HollowKnight variant="standing" className="fixed top-[20%] left-[5%] z-[1]" />
      <HollowKnight variant="kneeling" className="fixed bottom-[30%] right-[8%] z-[1]" />
      <HollowKnight variant="combat" className="fixed top-[45%] right-[3%] z-[1]" />

      {/* Header with Darksign */}
      <header className="relative z-30 p-6" role="banner">
        <div className="max-w-6xl mx-auto flex justify-between items-start">
          <div className="flex items-center gap-4">
            <Darksign size={50} />
            <div>
              <h1
                className="text-3xl tracking-[0.4em]"
                style={{
                  color: '#c0a060',
                  textShadow: `0 0 30px ${COLORS.bonfire}30`,
                }}
              >
                ALEXANDER PULIDO
              </h1>
              <p className="text-sm mt-1 tracking-wider" style={{ color: '#888060' }}>
                {PROFESSIONAL_SUMMARY.headline}
              </p>
              <p className="text-xs mt-1 italic tracking-wide" style={{ color: COLORS.bonfire }}>
                {PROFESSIONAL_SUMMARY.tagline}
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-center">
            <EstusFlask charges={5} maxCharges={5} />
            <Link
              href="/cv"
              className="px-4 py-2 text-xs tracking-[0.2em] transition-all hover:bg-[#1a1815]"
              style={{
                background: COLORS.stone,
                border: `1px solid ${COLORS.bonfire}40`,
                color: COLORS.bonfire,
              }}
              aria-label="View CV - Rest at bonfire"
            >
              REST
            </Link>
            <Link
              href="/personal-projects/game-engine"
              className="px-4 py-2 text-xs tracking-[0.2em] transition-all"
              style={{
                background: `linear-gradient(180deg, ${COLORS.bonfire}, #cc6600)`,
                color: '#0a0808',
              }}
              aria-label="Explore game engine project"
            >
              EXPLORE
            </Link>
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      {/* Current Roles / Covenants */}
      <section className="relative z-20 py-6 px-6" aria-label="Current positions">
        <div className="max-w-6xl mx-auto">
          <RolesDisplay />
        </div>
      </section>

      {/* Fog Gate divider */}
      <FogGate />

      {/* Map navigation with bonfire */}
      <section className="relative z-20 py-8" aria-label="Profession selection">
        <div className="flex justify-center items-center gap-8">
          <ZoneNode
            profession="drummer"
            isActive={active === 'drummer'}
            isExplored={explored.has('drummer')}
            onClick={() => handleZoneClick('drummer')}
            connections={[{ direction: 'down' }]}
          />
        </div>
        <div className="flex justify-center items-center gap-12 mt-12">
          <ZoneNode
            profession="fighter"
            isActive={active === 'fighter'}
            isExplored={explored.has('fighter')}
            onClick={() => handleZoneClick('fighter')}
            connections={[{ direction: 'right' }]}
          />
          <div className="w-24 flex justify-center">
            <Bonfire size="normal" label="Central bonfire - hub area" />
          </div>
          <ZoneNode
            profession="engineer"
            isActive={active === 'engineer'}
            isExplored={explored.has('engineer')}
            onClick={() => handleZoneClick('engineer')}
            connections={[{ direction: 'left' }, { direction: 'up' }]}
          />
        </div>

        {/* Praise the Sun decoration */}
        <div className="flex justify-center mt-8">
          <PraiseTheSun size={60} />
        </div>
      </section>

      {/* Fog Gate divider */}
      <FogGate />

      {/* Zone info */}
      <main id="main-content" className="relative z-20 px-6 py-8" role="main">
        <div className="max-w-4xl mx-auto">
          {/* Bio panel - item description style */}
          <StoneSectionCard className="mb-8" ariaLabelledby="about-heading">
            <div className="flex items-center gap-2 mb-4">
              <SwordMarker />
              <h2 id="about-heading" className="text-sm tracking-[0.3em]" style={{ color: COLORS.bonfire }}>
                ABOUT
              </h2>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: '#a09080' }}>
              {aboutData.bio}
            </p>
            <div className="flex gap-2 mt-4 flex-wrap" role="list" aria-label="Quick facts">
              {aboutData.quickFacts.map((fact, i) => (
                <span
                  key={i}
                  role="listitem"
                  className="text-sm px-3 py-1 tracking-wide"
                  style={{
                    background: '#1a1815',
                    color: '#887860',
                    border: `1px solid ${COLORS.ash}`,
                  }}
                >
                  {fact}
                </span>
              ))}
            </div>
          </StoneSectionCard>

          {/* Work Experience Section */}
          {experience.length > 0 && (
            <StoneSectionCard className="mb-8" ariaLabelledby="experience-heading">
              <div className="flex items-center gap-2 mb-4">
                <SwordMarker />
                <h2 id="experience-heading" className="text-sm tracking-[0.3em]" style={{ color: COLORS.bonfire }}>
                  WORK EXPERIENCE
                </h2>
              </div>
              <div className="space-y-3" role="list">
                {experience.map((entry) => (
                  <ExperienceCard key={entry.id} entry={entry} />
                ))}
              </div>
            </StoneSectionCard>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {/* Abilities / Tech Stack */}
            <StoneSectionCard
              ariaLabelledby="skills-heading"
              glowColor={active === 'drummer' ? '#9966ff' : active === 'fighter' ? '#ff4444' : COLORS.bonfire}
            >
              <h2 id="skills-heading" className="text-sm tracking-[0.3em] mb-4 flex items-center gap-2" style={{ color: COLORS.bonfire }}>
                <Darksign size={16} />
                {active === 'engineer' ? 'TECH STACK' : 'SKILLS'}
              </h2>

              {active === 'engineer' ? (
                <TechCloud categories={engineerTech} />
              ) : (
                <SkillsDisplay categories={skills} />
              )}
            </StoneSectionCard>

            {/* Save rooms / Projects */}
            <section aria-labelledby="projects-heading">
              <h2 id="projects-heading" className="text-sm tracking-[0.3em] mb-4 flex items-center gap-2" style={{ color: '#88cc55' }}>
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" style={{ boxShadow: '0 0 10px #88cc55' }} aria-hidden="true" />
                PROJECTS
              </h2>
              <div className="space-y-2" role="list">
                {projects.slice(0, 4).map((project) => (
                  <SaveRoomCard key={project.id} project={project} />
                ))}
              </div>
            </section>
          </div>

          {/* Companies (Engineer) */}
          {active === 'engineer' && (
            <section className="mt-8" aria-labelledby="companies-heading">
              <FogGate />
              <h2 id="companies-heading" className="text-sm tracking-[0.3em] mb-4 text-center" style={{ color: COLORS.bonfire }}>
                COMPANIES
              </h2>
              <div className="grid md:grid-cols-3 gap-4" role="list">
                {COMPANIES.map((company) => (
                  <CompanyCard key={company.id} company={company} />
                ))}
              </div>
            </section>
          )}

          {/* Bands (Drummer) */}
          {active === 'drummer' && (
            <section className="mt-8" aria-labelledby="bands-heading">
              <FogGate />
              <h2 id="bands-heading" className="text-sm tracking-[0.3em] mb-4 text-center" style={{ color: '#9966ff' }}>
                BANDS
              </h2>
              <div className="grid md:grid-cols-3 gap-4" role="list">
                {BANDS.map((band) => (
                  <BandCard key={band.id} band={band} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Mini-map */}
      <MiniMap active={active} />

      {/* Footer */}
      <footer className="relative z-20 py-12 text-center" role="contentinfo">
        <div className="flex items-center justify-center gap-4">
          <div className="w-12 h-px" style={{ background: `linear-gradient(90deg, transparent, ${COLORS.ash})` }} aria-hidden="true" />
          <Bonfire size="small" label="Footer bonfire" />
          <div className="w-12 h-px" style={{ background: `linear-gradient(90deg, ${COLORS.ash}, transparent)` }} aria-hidden="true" />
        </div>
        <p className="text-sm tracking-[0.4em] mt-4" style={{ color: '#444030' }}>
          EXPLORATION: {Math.round((explored.size / 3) * 100)}% • MMXXVI
        </p>
      </footer>

      {/* Dark Souls animations - with prefers-reduced-motion support */}
      <style jsx global>{`
        @media (prefers-reduced-motion: no-preference) {
          @keyframes flame {
            0%, 100% { transform: scaleY(1) scaleX(1); opacity: 1; }
            50% { transform: scaleY(1.3) scaleX(0.85); opacity: 0.85; }
          }
          @keyframes ember {
            0% { transform: translateY(0) translateX(0); opacity: 1; }
            100% { transform: translateY(-50px) translateX(15px); opacity: 0; }
          }
          @keyframes soul-float {
            0% { transform: translate(-50%, -50%) translateY(0); opacity: 0; }
            20% { opacity: 1; }
            100% { transform: translate(-50%, -50%) translateY(-35px) rotate(360deg); opacity: 0; }
          }
          @keyframes fog-drift {
            0%, 100% { transform: translateX(-15%); opacity: 0.4; }
            50% { transform: translateX(15%); opacity: 0.7; }
          }
          @keyframes fog-particle {
            0%, 100% { transform: translateX(0) scale(1); opacity: 0.25; }
            50% { transform: translateX(25px) scale(1.3); opacity: 0.45; }
          }
          @keyframes ash-fall {
            0% { transform: translateY(-100vh) rotate(0deg); opacity: 0; }
            10% { opacity: 0.8; }
            90% { opacity: 0.8; }
            100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
          }
          @keyframes darksign-pulse {
            0%, 100% { transform: scale(1); filter: brightness(1); }
            50% { transform: scale(1.08); filter: brightness(1.25); }
          }
          @keyframes liquid-glow {
            0%, 100% { box-shadow: 0 0 12px ${COLORS.bonfire}, inset 0 0 12px ${COLORS.gold}80; }
            50% { box-shadow: 0 0 25px ${COLORS.ember}, inset 0 0 18px ${COLORS.gold}; }
          }
          @keyframes you-died {
            0% { opacity: 0; transform: scale(1.6); }
            20% { opacity: 1; transform: scale(1); }
            80% { opacity: 1; transform: scale(1); }
            100% { opacity: 0; transform: scale(0.85); }
          }
          @keyframes emberFloat {
            0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.4; }
            25% { transform: translateY(-10px) rotate(6deg); opacity: 0.5; }
            50% { transform: translateY(-4px) rotate(-4deg); opacity: 0.35; }
            75% { transform: translateY(-12px) rotate(4deg); opacity: 0.45; }
          }
          @keyframes sun-pulse {
            0%, 100% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.1); opacity: 1; }
          }
          @keyframes section-ember {
            0% { transform: translateY(0) translateX(0); opacity: 0.6; }
            50% { opacity: 0.8; }
            100% { transform: translateY(-60px) translateX(10px); opacity: 0; }
          }
          .animate-flame { animation: flame 0.25s ease-in-out infinite; }
          .animate-ember-float { animation: emberFloat 12s ease-in-out infinite; }
          .animate-ember { animation: ember 2.5s ease-out infinite; }
          .animate-soul-float { animation: soul-float 2.5s ease-out infinite; }
          .animate-fog-drift { animation: fog-drift 12s ease-in-out infinite; }
          .animate-fog-particle { animation: fog-particle 10s ease-in-out infinite; }
          .animate-ash-fall { animation: ash-fall 18s linear infinite; }
          .animate-darksign-pulse { animation: darksign-pulse 3.5s ease-in-out infinite; }
          .animate-liquid-glow { animation: liquid-glow 2.5s ease-in-out infinite; }
          .animate-you-died { animation: you-died 4.5s ease-in-out forwards; }
          .animate-sun-pulse { animation: sun-pulse 4s ease-in-out infinite; }
          .animate-section-ember { animation: section-ember 3s ease-out infinite; }
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-flame,
          .animate-ember-float,
          .animate-ember,
          .animate-soul-float,
          .animate-fog-drift,
          .animate-fog-particle,
          .animate-ash-fall,
          .animate-darksign-pulse,
          .animate-liquid-glow,
          .animate-you-died,
          .animate-sun-pulse,
          .animate-section-ember {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  )
}
