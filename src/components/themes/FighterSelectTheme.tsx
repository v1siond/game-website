'use client'

import { useEffect, useState, useRef } from 'react'
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

// Neon electric border with animated glow
function NeonFrame({
  children,
  color = '#00ffff',
  className = '',
}: {
  children: React.ReactNode
  color?: string
  className?: string
}) {
  const { theme } = useTheme()
  const [glowIntensity, setGlowIntensity] = useState(1)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const interval = setInterval(() => {
      setGlowIntensity(0.7 + Math.random() * 0.6)
    }, 100)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className={`relative ${className}`}
      style={{
        border: `3px solid ${color}`,
        boxShadow: `
          0 0 ${5 * glowIntensity}px ${color},
          0 0 ${10 * glowIntensity}px ${color},
          0 0 ${20 * glowIntensity}px ${color}40,
          inset 0 0 ${15 * glowIntensity}px ${color}20
        `,
        background: `linear-gradient(135deg, ${theme.colors.background}, #0a0a1a)`,
      }}
    >
      {/* Corner accents */}
      {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((pos, i) => (
        <div
          key={i}
          className={`absolute w-4 h-4 ${pos}`}
          style={{
            borderTop: i < 2 ? `2px solid ${color}` : 'none',
            borderBottom: i >= 2 ? `2px solid ${color}` : 'none',
            borderLeft: i % 2 === 0 ? `2px solid ${color}` : 'none',
            borderRight: i % 2 === 1 ? `2px solid ${color}` : 'none',
            boxShadow: `0 0 8px ${color}`,
          }}
        />
      ))}
      {children}
    </div>
  )
}

// Arcade cabinet frame with bolts and CRT styling
function ArcadeFrame({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme()

  return (
    <div className="relative" role="region" aria-label="Arcade cabinet frame">
      {/* Outer frame */}
      <div
        className="absolute inset-0 -m-3"
        style={{
          border: `6px solid ${theme.colors.border}`,
          background: `linear-gradient(135deg, #1a1a2e, #0f0f1a, #1a1a2e)`,
          boxShadow: `
            inset 0 0 30px rgba(0,0,0,0.8),
            0 0 20px rgba(0,0,0,0.5),
            inset 2px 2px 0 rgba(255,255,255,0.05)
          `,
        }}
      />
      {/* Corner bolts with metallic effect */}
      {['-top-2 -left-2', '-top-2 -right-2', '-bottom-2 -left-2', '-bottom-2 -right-2'].map(
        (pos, i) => (
          <div
            key={i}
            className={`absolute w-6 h-6 z-10 ${pos}`}
            aria-hidden="true"
            style={{
              background: `radial-gradient(circle at 30% 30%, #6a6a7a, #3a3a4a, #2a2a3a)`,
              border: `2px solid ${theme.colors.border}`,
              borderRadius: '50%',
              boxShadow: `
                inset 0 1px 3px rgba(255,255,255,0.3),
                inset 0 -2px 4px rgba(0,0,0,0.5),
                0 2px 4px rgba(0,0,0,0.3)
              `,
            }}
          >
            {/* Bolt slot */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-0.5"
              style={{ background: '#1a1a1a' }}
            />
          </div>
        )
      )}
      <div className="relative z-5">{children}</div>
    </div>
  )
}

// VS badge with dramatic flames and lightning
function VSBadge({ large = false }: { large?: boolean }) {
  const [flash, setFlash] = useState(false)
  const [flames, setFlames] = useState<Array<{ id: number; x: number; delay: number }>>([])
  const [lightning, setLightning] = useState(false)
  const prefersReducedMotion = useRef(false)

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion.current) return

    // Flash effect
    const flashInterval = setInterval(() => {
      setFlash(true)
      setTimeout(() => setFlash(false), 100)
    }, 2000)

    // Lightning effect
    const lightningInterval = setInterval(() => {
      setLightning(true)
      setTimeout(() => setLightning(false), 150)
    }, 3000)

    // Generate flame particles
    setFlames(
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: (i - 6) * 8,
        delay: i * 0.08,
      }))
    )

    return () => {
      clearInterval(flashInterval)
      clearInterval(lightningInterval)
    }
  }, [])

  return (
    <div className="relative" role="img" aria-label="VS versus badge">
      {/* Lightning bolts */}
      {lightning && !prefersReducedMotion.current && (
        <>
          <div
            className="absolute -left-8 top-1/2 -translate-y-1/2 text-3xl"
            style={{ color: '#ffff00', textShadow: '0 0 20px #ffff00' }}
          >
            ⚡
          </div>
          <div
            className="absolute -right-8 top-1/2 -translate-y-1/2 text-3xl"
            style={{ color: '#ffff00', textShadow: '0 0 20px #ffff00' }}
          >
            ⚡
          </div>
        </>
      )}

      {/* Flame particles */}
      {flames.map((flame) => (
        <div
          key={flame.id}
          className="absolute animate-flame"
          aria-hidden="true"
          style={{
            left: `calc(50% + ${flame.x}px)`,
            bottom: '-10px',
            width: '8px',
            height: '24px',
            background: `linear-gradient(to top, #ff2200, #ff6600, #ffaa00, transparent)`,
            borderRadius: '50%',
            animationDelay: `${flame.delay}s`,
            filter: 'blur(2px)',
          }}
        />
      ))}

      {/* VS Text */}
      <div
        className={`relative transition-all duration-100 ${flash ? 'scale-125' : 'scale-100'}`}
        style={{
          fontSize: large ? '5rem' : '3rem',
          fontWeight: 'bold',
          color: '#ffd700',
          textShadow: `
            0 0 10px #ffd700,
            0 0 20px #ff6600,
            0 0 40px #ff4400,
            0 0 60px #ff2200,
            3px 3px 0 #000,
            -3px -3px 0 #000,
            3px -3px 0 #000,
            -3px 3px 0 #000
          `,
          WebkitTextStroke: '2px #000',
          letterSpacing: '0.1em',
        }}
      >
        VS
      </div>
    </div>
  )
}

// FIGHT! banner with dramatic animation
function FightBanner({ text = 'FIGHT!' }: { text?: string }) {
  const [visible, setVisible] = useState(false)
  const [scale, setScale] = useState(0)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const showTimer = setTimeout(() => {
      setVisible(true)
      if (!prefersReducedMotion) {
        // Dramatic entrance
        let currentScale = 3
        const scaleInterval = setInterval(() => {
          currentScale -= 0.1
          if (currentScale <= 1) {
            setScale(1)
            clearInterval(scaleInterval)
          } else {
            setScale(currentScale)
          }
        }, 20)
      } else {
        setScale(1)
      }
    }, 300)

    return () => clearTimeout(showTimer)
  }, [])

  if (!visible) return null

  return (
    <div
      className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
      role="status"
      aria-live="polite"
    >
      <div
        className="transition-transform duration-100"
        style={{
          transform: `scale(${scale})`,
          fontSize: '8rem',
          fontWeight: 'bold',
          color: '#ff0000',
          textShadow: `
            0 0 20px #ff0000,
            0 0 40px #ff6600,
            0 0 60px #ffaa00,
            4px 4px 0 #000,
            -4px -4px 0 #000
          `,
          WebkitTextStroke: '3px #000',
          letterSpacing: '0.2em',
        }}
      >
        {text}
      </div>
    </div>
  )
}

// Health bar style indicator with animated fill
function HealthBar({
  label,
  value,
  maxValue = 100,
  color,
  reverse = false,
}: {
  label: string
  value: number
  maxValue?: number
  color: string
  reverse?: boolean
}) {
  const percentage = Math.min((value / maxValue) * 100, 100)
  const id = `health-bar-${label.toLowerCase().replace(/\s/g, '-')}`

  return (
    <div
      className={`flex items-center gap-3 ${reverse ? 'flex-row-reverse' : ''}`}
      role="meter"
      aria-labelledby={id}
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={maxValue}
    >
      <span
        id={id}
        className="text-xs font-bold tracking-wider w-20 uppercase"
        style={{ color, textAlign: reverse ? 'right' : 'left' }}
      >
        {label}
      </span>
      <div
        className="flex-1 h-5 relative"
        style={{
          background: 'linear-gradient(180deg, #0a0a1a, #1a1a2e, #0a0a1a)',
          border: `2px solid ${color}40`,
          boxShadow: `inset 0 2px 6px rgba(0,0,0,0.7), 0 0 5px ${color}30`,
        }}
      >
        {/* Animated fill */}
        <div
          className="absolute top-0 bottom-0 transition-all duration-700 ease-out"
          style={{
            left: reverse ? 'auto' : 0,
            right: reverse ? 0 : 'auto',
            width: `${percentage}%`,
            background: `linear-gradient(180deg, ${color}, ${color}cc, ${color}88)`,
            boxShadow: `0 0 15px ${color}80, inset 0 1px 0 rgba(255,255,255,0.3)`,
          }}
        />
        {/* Segment lines */}
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0 w-px"
            aria-hidden="true"
            style={{
              left: `${(i + 1) * 10}%`,
              background: 'rgba(0,0,0,0.4)',
            }}
          />
        ))}
        {/* Shine effect */}
        <div
          className="absolute inset-0 opacity-30"
          aria-hidden="true"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.3), transparent 50%)',
          }}
        />
      </div>
    </div>
  )
}

// Round indicators (like Street Fighter round wins)
function RoundIndicators({
  wins,
  maxWins = 2,
  side,
}: {
  wins: number
  maxWins?: number
  side: 'left' | 'right'
}) {
  return (
    <div
      className={`flex gap-2 ${side === 'right' ? 'justify-end' : ''}`}
      role="status"
      aria-label={`${wins} rounds won`}
    >
      {Array.from({ length: maxWins }).map((_, i) => (
        <div
          key={i}
          className="w-4 h-4 rounded-full transition-all duration-300"
          aria-hidden="true"
          style={{
            background: i < wins ? '#ffd700' : '#333',
            boxShadow: i < wins ? '0 0 10px #ffd700, 0 0 20px #ff6600' : 'none',
            border: '2px solid #555',
          }}
        />
      ))}
    </div>
  )
}

// Character portrait with VS screen style - enhanced with more arcade aesthetics
function CharacterPortrait({
  icon,
  name,
  subtitle,
  achievements,
  winRecord,
  isSelected,
  onClick,
  side,
}: {
  icon: string
  name: string
  subtitle: string
  achievements: string[]
  winRecord: { wins: number; losses: number }
  isSelected: boolean
  onClick: () => void
  side: 'left' | 'right'
}) {
  const { theme } = useTheme()
  const [hover, setHover] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-pressed={isSelected}
      aria-label={`Select ${name} - ${subtitle}`}
      className={`relative p-5 transition-all duration-300 focus:outline-none focus-visible:ring-4 ${
        isSelected ? 'scale-105 z-10' : 'opacity-70 hover:opacity-100'
      }`}
      style={{
        background: isSelected
          ? `linear-gradient(${side === 'left' ? '135deg' : '-135deg'}, ${theme.colors.accent}50, #0a0a2040)`
          : `linear-gradient(180deg, ${theme.colors.surface}, #0a0a1a)`,
        border: `4px solid ${isSelected ? theme.colors.accent : theme.colors.border}`,
        clipPath:
          side === 'left'
            ? 'polygon(0 0, 100% 0, 92% 100%, 0 100%)'
            : 'polygon(8% 0, 100% 0, 100% 100%, 0 100%)',
        boxShadow: isSelected
          ? `
            0 0 30px ${theme.colors.accent}60,
            0 0 60px ${theme.colors.accent}30,
            inset 0 0 20px ${theme.colors.accent}20
          `
          : hover
          ? `0 0 15px ${theme.colors.accent}40`
          : 'none',
        minWidth: '180px',
      }}
    >
      {/* Electric border effect when selected */}
      {isSelected && (
        <div
          className="absolute inset-0 animate-pulse pointer-events-none"
          aria-hidden="true"
          style={{
            border: `2px solid ${theme.colors.accent}`,
            clipPath:
              side === 'left'
                ? 'polygon(0 0, 100% 0, 92% 100%, 0 100%)'
                : 'polygon(8% 0, 100% 0, 100% 100%, 0 100%)',
          }}
        />
      )}

      {/* Character icon with glow */}
      <div
        className="text-7xl mb-4 transition-transform duration-200"
        style={{
          filter: isSelected ? `drop-shadow(0 0 20px ${theme.colors.accent})` : 'none',
          transform: hover ? 'scale(1.1)' : 'scale(1)',
        }}
      >
        {icon}
      </div>

      {/* Name plate - arcade style */}
      <div
        className="py-2 -mx-5 px-5"
        style={{
          background: isSelected
            ? `linear-gradient(90deg, ${theme.colors.accent}, ${theme.colors.accent}dd)`
            : `linear-gradient(90deg, ${theme.colors.border}80, ${theme.colors.border})`,
          color: isSelected ? '#000' : theme.colors.text,
          clipPath: 'polygon(5% 0, 95% 0, 100% 50%, 95% 100%, 5% 100%, 0 50%)',
        }}
      >
        <div className="text-sm font-bold tracking-widest">{name}</div>
        <div className="text-[10px] opacity-80">{subtitle}</div>
      </div>

      {/* Win/Loss record - KO style */}
      <div
        className="mt-3 py-2 text-center"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.5), transparent)',
        }}
      >
        <span
          className="text-xs font-bold tracking-wider"
          style={{ color: '#4ade80', textShadow: '0 0 5px #4ade80' }}
        >
          W:{winRecord.wins}
        </span>
        <span className="text-xs mx-3" style={{ color: '#ffd700 ' }}>
          KO
        </span>
        <span
          className="text-xs font-bold tracking-wider"
          style={{ color: '#f87171', textShadow: '0 0 5px #f87171' }}
        >
          L:{winRecord.losses}
        </span>
      </div>

      {/* Achievements - NO BARS, show actual impact */}
      <div className="mt-4 space-y-1">
        {achievements.slice(0, 3).map((achievement, i) => (
          <div
            key={i}
            className="text-[9px] px-2 py-1 text-left"
            style={{
              background: `${theme.colors.accent}15`,
              borderLeft: `2px solid ${theme.colors.accent}`,
              color: theme.colors.textMuted,
            }}
          >
            {achievement}
          </div>
        ))}
      </div>

      {/* Selection indicator - arrow */}
      {isSelected && (
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 text-3xl animate-bounce"
          aria-hidden="true"
          style={{
            color: theme.colors.accent,
            filter: `drop-shadow(0 0 10px ${theme.colors.accent})`,
          }}
        >
          ▼
        </div>
      )}

      {/* Round win indicators */}
      <div className="mt-3">
        <RoundIndicators wins={Math.min(winRecord.wins, 2)} maxWins={2} side={side} />
      </div>
    </button>
  )
}

// Role/Rank display with championship belt style
function RoleRank({ role }: { role: (typeof CURRENT_ROLES)[0] }) {
  const { theme } = useTheme()
  const isLeadership = role.type === 'leadership'

  return (
    <div
      className="relative px-5 py-3 text-center transition-all duration-200 hover:scale-105"
      role="listitem"
      style={{
        background: isLeadership
          ? `linear-gradient(180deg, #ffd70040, #ffd70010, transparent)`
          : `linear-gradient(180deg, ${theme.colors.surface}, transparent)`,
        border: `3px solid ${isLeadership ? '#ffd700' : theme.colors.border}`,
        clipPath: 'polygon(15% 0, 85% 0, 100% 50%, 85% 100%, 15% 100%, 0 50%)',
        boxShadow: isLeadership ? '0 0 20px #ffd70040' : 'none',
      }}
    >
      {/* Championship star */}
      {isLeadership && (
        <div
          className="absolute -top-2 left-1/2 -translate-x-1/2 text-lg"
          aria-hidden="true"
          style={{ color: '#ffd700', textShadow: '0 0 10px #ffd700' }}
        >
          ★
        </div>
      )}
      <div
        className="text-[10px] tracking-[0.2em]"
        style={{ color: isLeadership ? '#ffd700' : theme.colors.accent }}
      >
        {role.title.toUpperCase()}
      </div>
      <div
        className="text-sm font-bold mt-1"
        style={{ color: theme.colors.text, textShadow: '0 0 5px rgba(0,0,0,0.5)' }}
      >
        {role.company}
      </div>
    </div>
  )
}

// Special move / tech skill with combo notation
function SpecialMove({ name, category }: { name: string; category: string }) {
  const { theme } = useTheme()
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="relative px-2 py-1.5 cursor-default transition-all duration-200"
      style={{
        background: isHovered
          ? `linear-gradient(90deg, ${theme.colors.accent}40, ${theme.colors.accent}10)`
          : `${theme.colors.surface}90`,
        border: `1px solid ${isHovered ? theme.colors.accent : theme.colors.border}50`,
        transform: isHovered ? 'translateX(4px) scale(1.02)' : 'none',
        boxShadow: isHovered ? `0 0 10px ${theme.colors.accent}30` : 'none',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span
        className="text-xs font-medium"
        style={{ color: isHovered ? theme.colors.accent : theme.colors.text }}
      >
        {name}
      </span>
      {isHovered && (
        <span
          className="absolute right-1 text-[8px] tracking-wider animate-pulse"
          style={{ color: theme.colors.accent }}
        >
          ↓→P
        </span>
      )}
    </div>
  )
}

// Team affiliate card with arcade insert style
function TeamCard({ company }: { company: (typeof COMPANIES)[0] }) {
  const { theme } = useTheme()

  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Visit ${company.name} - ${company.tagline}`}
      className="block transition-all duration-200 hover:scale-[1.03] group focus:outline-none focus-visible:ring-4"
    >
      <NeonFrame color={theme.colors.accent} className="p-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl" aria-hidden="true">
            {company.icon}
          </span>
          <div>
            <h4
              className="text-sm font-bold tracking-wide group-hover:text-cyan-300 transition-colors"
              style={{ color: theme.colors.text }}
            >
              {company.name}
            </h4>
            <p className="text-[10px] tracking-wider" style={{ color: theme.colors.accent }}>
              {company.tagline}
            </p>
          </div>
        </div>
        <p className="text-[10px] mt-3 leading-relaxed" style={{ color: theme.colors.textMuted }}>
          {company.description}
        </p>
        {/* Services as combo moves */}
        <div className="flex flex-wrap gap-1 mt-3">
          {company.services.slice(0, 3).map((service) => (
            <span
              key={service}
              className="text-[8px] px-2 py-0.5"
              style={{
                background: `${theme.colors.accent}20`,
                border: `1px solid ${theme.colors.accent}40`,
                color: theme.colors.accent,
              }}
            >
              {service}
            </span>
          ))}
        </div>
      </NeonFrame>
    </a>
  )
}

// Band card for drummer mode - stage/venue style
function BandCard({ band }: { band: (typeof BANDS)[0] }) {
  const { theme } = useTheme()

  const content = (
    <NeonFrame color="#9966cc" className="p-4 transition-all duration-200 hover:scale-[1.03]">
      <div className="flex justify-between items-start">
        <h4
          className="text-sm font-bold tracking-wide"
          style={{ color: theme.colors.text, textShadow: '0 0 5px #9966cc50' }}
        >
          {band.name}
        </h4>
        {band.active && (
          <span
            className="text-[8px] px-2 py-0.5 font-bold animate-pulse"
            style={{ background: '#4ade80', color: '#000', boxShadow: '0 0 10px #4ade80' }}
          >
            ACTIVE
          </span>
        )}
      </div>
      <p className="text-[10px] mt-1" style={{ color: '#9966cc' }}>
        {band.genre} // {band.role}
      </p>
      <p className="text-[10px] mt-2 leading-relaxed" style={{ color: theme.colors.textMuted }}>
        {band.description}
      </p>
      {!band.url && (
        <p className="text-[8px] mt-2 italic" style={{ color: theme.colors.textMuted }}>
          Website coming soon...
        </p>
      )}
    </NeonFrame>
  )

  if (band.url) {
    return (
      <a
        href={band.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Visit ${band.name} website`}
        className="block focus:outline-none focus-visible:ring-4"
      >
        {content}
      </a>
    )
  }
  return <div role="article">{content}</div>
}

// Work experience card with fight record style
function ExperienceCard({ entry }: { entry: (typeof EXPERIENCE_DATA)[0] }) {
  const { theme } = useTheme()
  const endDisplay = entry.endDate ? new Date(entry.endDate).getFullYear() : 'Present'
  const startDisplay = new Date(entry.startDate).getFullYear()
  const isActive = !entry.endDate

  return (
    <article
      className="relative group transition-all duration-200 hover:scale-[1.02]"
      style={{
        background: `linear-gradient(135deg, ${theme.colors.surface}, #0a0a1a)`,
        border: `3px solid ${isActive ? theme.colors.accent : theme.colors.border}`,
        clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)',
        boxShadow: isActive ? `0 0 20px ${theme.colors.accent}30` : 'none',
      }}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <h4 className="text-sm font-bold" style={{ color: theme.colors.text }}>
              {entry.title}
            </h4>
            <p className="text-[10px] tracking-wider" style={{ color: theme.colors.accent }}>
              {entry.organization}
            </p>
          </div>
          <span
            className="text-[10px] px-3 py-1 font-bold tracking-wider"
            style={{
              background: isActive
                ? `linear-gradient(90deg, #4ade80, #22c55e)`
                : theme.colors.border,
              color: isActive ? '#000' : theme.colors.text,
              boxShadow: isActive ? '0 0 10px #4ade8060' : 'none',
            }}
          >
            {startDisplay} - {endDisplay}
          </span>
        </div>

        {/* Description */}
        <p className="text-[10px] mb-3 leading-relaxed" style={{ color: theme.colors.textMuted }}>
          {entry.description}
        </p>

        {/* Highlights as KO achievements */}
        {entry.highlights && entry.highlights.length > 0 && (
          <ul className="space-y-1 mb-3" role="list">
            {entry.highlights.map((highlight, i) => (
              <li
                key={i}
                className="text-[10px] flex items-start gap-2"
                style={{ color: theme.colors.text }}
              >
                <span style={{ color: '#ffd700' }}>KO</span>
                {highlight}
              </li>
            ))}
          </ul>
        )}

        {/* Skills as special moves */}
        <div className="flex flex-wrap gap-1">
          {entry.skills.slice(0, 5).map((skill) => (
            <span
              key={skill}
              className="text-[8px] px-2 py-0.5"
              style={{
                background: `${theme.colors.accent}20`,
                border: `1px solid ${theme.colors.accent}30`,
                color: theme.colors.accent,
              }}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Corner cut decoration */}
      <div
        className="absolute bottom-0 right-0 w-5 h-5"
        aria-hidden="true"
        style={{
          background: isActive
            ? `linear-gradient(135deg, ${theme.colors.accent}, #ffd700)`
            : theme.colors.accent,
          clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
        }}
      />

      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        aria-hidden="true"
        style={{
          background: `linear-gradient(90deg, transparent, ${theme.colors.accent}15, transparent)`,
        }}
      />
    </article>
  )
}

// Fight card / project card with championship style
function FightCard({ project }: { project: (typeof PROJECTS_DATA)[0] }) {
  const { theme } = useTheme()

  return (
    <article
      className="relative group cursor-pointer transition-all duration-200 hover:scale-[1.02]"
      style={{
        background: `linear-gradient(135deg, ${theme.colors.surface}, #0a0a1a)`,
        border: `3px solid ${project.featured ? '#ffd700' : theme.colors.border}`,
        clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)',
        boxShadow: project.featured
          ? '0 0 25px rgba(255, 215, 0, 0.3), inset 0 0 15px rgba(255, 215, 0, 0.1)'
          : 'none',
      }}
    >
      <div className="p-4">
        {/* Header with championship badge */}
        <div className="flex justify-between items-start mb-3">
          <h4
            className="text-sm font-bold tracking-wide"
            style={{
              color: project.featured ? '#ffd700' : theme.colors.text,
              textShadow: project.featured ? '0 0 10px #ffd700' : 'none',
            }}
          >
            {project.name}
          </h4>
          {project.featured && (
            <span
              className="text-[8px] px-2 py-1 font-bold tracking-widest"
              style={{
                background: 'linear-gradient(90deg, #ffd700, #ffaa00)',
                color: '#000',
                boxShadow: '0 0 15px #ffd70060',
              }}
            >
              CHAMPION
            </span>
          )}
        </div>

        {/* Tagline */}
        <p className="text-[10px] mb-2" style={{ color: theme.colors.textMuted }}>
          {project.tagline}
        </p>

        {/* Impact statement - the KO */}
        {project.impact && (
          <div
            className="text-[10px] py-2 px-3 mb-3"
            style={{
              background: `linear-gradient(90deg, ${theme.colors.accent}20, transparent)`,
              borderLeft: `3px solid ${theme.colors.accent}`,
              color: theme.colors.accent,
            }}
          >
            KO: {project.impact}
          </div>
        )}

        {/* Tech stack as combo inputs */}
        <div className="flex flex-wrap gap-1">
          {project.techStack.slice(0, 5).map((tech) => (
            <span
              key={tech}
              className="text-[8px] px-2 py-0.5"
              style={{
                background: `${theme.colors.accent}15`,
                border: `1px solid ${theme.colors.accent}30`,
                color: theme.colors.accent,
              }}
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Links */}
        {project.links && (
          <div className="flex gap-2 mt-3">
            {project.links.site && (
              <a
                href={project.links.site}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[9px] px-2 py-1 hover:scale-105 transition-transform"
                style={{
                  background: theme.colors.accent,
                  color: '#000',
                  fontWeight: 'bold',
                }}
                aria-label={`Visit ${project.name} website`}
              >
                VIEW
              </a>
            )}
            {project.links.demo && (
              <Link
                href={project.links.demo}
                className="text-[9px] px-2 py-1 hover:scale-105 transition-transform"
                style={{
                  background: '#4ade80',
                  color: '#000',
                  fontWeight: 'bold',
                }}
                aria-label={`Play ${project.name} demo`}
              >
                PLAY
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Corner cut decoration */}
      <div
        className="absolute bottom-0 right-0 w-5 h-5"
        aria-hidden="true"
        style={{
          background: project.featured ? '#ffd700' : theme.colors.accent,
          clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
        }}
      />

      {/* Hover glow effect */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        aria-hidden="true"
        style={{
          background: `linear-gradient(90deg, transparent, ${project.featured ? '#ffd700' : theme.colors.accent}20, transparent)`,
        }}
      />
    </article>
  )
}

// Skills section for drummer/fighter - NO BARS, show achievements
function SkillAchievements({
  category,
}: {
  category: { name: string; icon?: string; skills: { name: string; proficiency: number }[] }
}) {
  const { theme } = useTheme()

  return (
    <div className="space-y-2">
      <h4
        className="text-xs font-bold tracking-wider flex items-center gap-2"
        style={{ color: theme.colors.text }}
      >
        <span aria-hidden="true">{category.icon}</span>
        {category.name.toUpperCase()}
      </h4>
      <div className="space-y-1">
        {category.skills.map((skill) => (
          <div
            key={skill.name}
            className="px-2 py-1 text-[10px]"
            style={{
              background: `${theme.colors.accent}10`,
              borderLeft: `2px solid ${theme.colors.accent}`,
              color: theme.colors.textMuted,
            }}
          >
            {skill.name}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function FighterSelectTheme() {
  const { theme } = useTheme()
  const { active, setActive, config } = useProfession()
  const [mounted, setMounted] = useState(false)
  const [showReady, setShowReady] = useState(false)
  const [showFight, setShowFight] = useState(false)

  const aboutData = ABOUT_DATA[active]
  const engineerTech = getEngineerSkills()
  const otherSkills = getSkillsByProfession(active)
  const projects = PROJECTS_DATA.filter((p) => p.professions.includes(active) || p.featured)
  const experience = filterExperienceByProfession(EXPERIENCE_DATA, active)

  useEffect(() => {
    setMounted(true)
    const readyTimeout = setTimeout(() => setShowReady(true), 500)
    const fightTimeout = setTimeout(() => setShowFight(true), 1000)
    return () => {
      clearTimeout(readyTimeout)
      clearTimeout(fightTimeout)
    }
  }, [])

  // Reset fight animation on character change
  useEffect(() => {
    setShowFight(false)
    const timeout = setTimeout(() => setShowFight(true), 300)
    return () => clearTimeout(timeout)
  }, [active])

  if (!mounted) return null

  const characters = [
    {
      id: 'engineer',
      icon: '💻',
      name: 'THE ENGINEER',
      subtitle: 'Code Warrior',
      achievements: ['10+ years experience', 'CTO x 2', 'Enterprise scale systems', '50k+ users migrated'],
      winRecord: { wins: 999, losses: 0 },
    },
    {
      id: 'drummer',
      icon: '🥁',
      name: 'THE MUSICIAN',
      subtitle: 'Rhythm Master',
      achievements: ['15 years playing', '7 years professional', '3 active bands', '30+ city tour'],
      winRecord: { wins: 15, losses: 0 },
    },
    {
      id: 'fighter',
      icon: '🥋',
      name: 'THE FIGHTER',
      subtitle: 'Combat Expert',
      achievements: ['6 years training', 'BJJ Instructor', '20+ students trained', '3 disciplines'],
      winRecord: { wins: 6, losses: 0 },
    },
  ]

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: `radial-gradient(ellipse at center, #1a1a3e 0%, ${theme.colors.background} 50%, #0a0a1a 100%)`,
        fontFamily: '"Impact", "Arial Black", sans-serif',
      }}
    >
      {/* Fight banner */}
      {showFight && <FightBanner text={config.title.toUpperCase()} />}

      {/* Dramatic gradient background */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        aria-hidden="true"
        style={{
          background: `
            radial-gradient(circle at 20% 30%, ${theme.colors.accent}15 0%, transparent 40%),
            radial-gradient(circle at 80% 70%, #9966cc15 0%, transparent 40%),
            radial-gradient(circle at 50% 50%, #ffd70008 0%, transparent 60%)
          `,
        }}
      />

      {/* Animated background stripes */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute h-1 animate-stripe"
            style={{
              top: `${i * 8 + 4}%`,
              left: '-100%',
              right: '-100%',
              background: `linear-gradient(90deg, transparent, ${theme.colors.accent}30, transparent)`,
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>

      {/* CRT Scanlines overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-[100]"
        aria-hidden="true"
        style={{
          background: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(0,0,0,0.15) 2px,
              rgba(0,0,0,0.15) 4px
            )
          `,
          opacity: 0.5,
        }}
      />

      {/* Screen vignette effect */}
      <div
        className="fixed inset-0 pointer-events-none z-[99]"
        aria-hidden="true"
        style={{
          background: `radial-gradient(ellipse at center, transparent 0%, transparent 60%, rgba(0,0,0,0.4) 100%)`,
        }}
      />

      {/* Header with arcade frame */}
      <header className="relative z-30 p-6">
        <div className="max-w-6xl mx-auto">
          <ArcadeFrame>
            <div className="flex justify-between items-start p-5">
              <div>
                <h1
                  className="text-4xl tracking-widest"
                  style={{
                    color: theme.colors.accent,
                    textShadow: `
                      0 0 10px ${theme.colors.accent},
                      3px 3px 0 ${theme.colors.background},
                      6px 6px 0 #000
                    `,
                  }}
                >
                  SELECT YOUR FIGHTER
                </h1>
                <p
                  className="text-base mt-3 tracking-wide"
                  style={{ color: theme.colors.text, fontFamily: 'sans-serif' }}
                >
                  {PROFESSIONAL_SUMMARY.headline}
                </p>
                <p
                  className="text-sm mt-1 italic tracking-wider"
                  style={{ color: theme.colors.accent }}
                >
                  &quot;{PROFESSIONAL_SUMMARY.tagline}&quot;
                </p>
              </div>

              <nav className="flex gap-3 items-center" aria-label="Main navigation">
                <Link
                  href="/cv"
                  className="px-5 py-2 text-sm tracking-widest transition-all hover:scale-105 focus:outline-none focus-visible:ring-4"
                  style={{
                    background: `linear-gradient(180deg, ${theme.colors.surface}, #0a0a1a)`,
                    border: `3px solid ${theme.colors.border}`,
                    color: theme.colors.text,
                    clipPath: 'polygon(10% 0, 100% 0, 100% 100%, 0 100%)',
                  }}
                >
                  CV
                </Link>
                <Link
                  href="/personal-projects/game-engine"
                  className="px-5 py-2 text-sm tracking-widest transition-all hover:scale-105 focus:outline-none focus-visible:ring-4"
                  style={{
                    background: `linear-gradient(90deg, ${theme.colors.accent}, #ffd700)`,
                    color: '#000',
                    clipPath: 'polygon(0 0, 100% 0, 90% 100%, 0 100%)',
                    boxShadow: `0 0 15px ${theme.colors.accent}60`,
                  }}
                >
                  PLAY
                </Link>
                <ThemeSwitcher />
              </nav>
            </div>
          </ArcadeFrame>
        </div>
      </header>

      {/* Current Roles - Championship Ranks */}
      <section className="relative z-20 py-4 px-6" aria-label="Current professional roles">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4" role="list">
            {CURRENT_ROLES.map((role) => (
              <RoleRank key={role.id} role={role} />
            ))}
          </div>
        </div>
      </section>

      {/* Character select area */}
      <section className="relative z-20 py-8 px-6" aria-label="Character selection">
        <div className="max-w-6xl mx-auto">
          {/* VS Screen layout */}
          <div
            className="flex items-center justify-center gap-6 mb-8 flex-wrap"
            role="group"
            aria-label="Select a character"
          >
            {characters.map((char, index) => (
              <div key={char.id} className="flex items-center">
                <CharacterPortrait
                  icon={char.icon}
                  name={char.name}
                  subtitle={char.subtitle}
                  achievements={char.achievements}
                  winRecord={char.winRecord}
                  isSelected={active === char.id}
                  onClick={() => setActive(char.id as 'engineer' | 'drummer' | 'fighter')}
                  side={index === 0 ? 'left' : index === 2 ? 'right' : 'left'}
                />
                {index < characters.length - 1 && (
                  <div className="mx-4 hidden md:block">
                    <VSBadge />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Health bars */}
          <div className="max-w-3xl mx-auto mb-8 space-y-3">
            <HealthBar
              label="Experience"
              value={active === 'engineer' ? 95 : active === 'drummer' ? 80 : 60}
              color={theme.colors.accent}
            />
            <HealthBar
              label="Mastery"
              value={active === 'engineer' ? 90 : active === 'drummer' ? 85 : 70}
              color="#ffd700"
            />
            <HealthBar
              label="Power"
              value={active === 'engineer' ? 85 : active === 'drummer' ? 90 : 95}
              color="#ff4444"
            />
          </div>

          {/* Ready banner */}
          {showReady && (
            <div
              className="text-center py-5 mb-8"
              role="status"
              aria-live="polite"
              style={{
                background: `linear-gradient(90deg, transparent, ${theme.colors.accent}50, transparent)`,
              }}
            >
              <span
                className="text-5xl font-bold tracking-[0.3em] animate-pulse"
                style={{
                  color: theme.colors.accent,
                  textShadow: `
                    0 0 20px ${theme.colors.accent},
                    0 0 40px ${theme.colors.accent},
                    0 0 60px ${theme.colors.accent}50
                  `,
                }}
              >
                {config.title.toUpperCase()} - READY!
              </span>
            </div>
          )}

          {/* Bio panel */}
          <NeonFrame color={theme.colors.accent} className="p-6 mb-8">
            <h2
              className="text-2xl mb-4 flex items-center gap-3 tracking-wider"
              style={{ color: theme.colors.accent }}
            >
              <span aria-hidden="true">►</span> FIGHTER PROFILE
            </h2>
            <p
              className="text-sm leading-relaxed mb-4"
              style={{ color: theme.colors.text, fontFamily: 'sans-serif' }}
            >
              {aboutData.bio}
            </p>
            <div className="flex flex-wrap gap-2" role="list" aria-label="Quick facts">
              {aboutData.quickFacts.map((fact, i) => (
                <span
                  key={i}
                  className="px-4 py-1.5 text-xs font-bold tracking-wider"
                  style={{
                    background: `linear-gradient(90deg, ${theme.colors.accent}, ${theme.colors.accent}cc)`,
                    color: '#000',
                    clipPath: 'polygon(8% 0, 100% 0, 92% 100%, 0 100%)',
                    boxShadow: `0 0 10px ${theme.colors.accent}40`,
                  }}
                >
                  {fact}
                </span>
              ))}
            </div>
          </NeonFrame>

          {/* Work Experience section */}
          {experience.length > 0 && (
            <section className="mb-8" aria-labelledby="experience-heading">
              <NeonFrame color={theme.colors.accent} className="p-6">
                <h2
                  id="experience-heading"
                  className="text-2xl mb-6 flex items-center gap-3 tracking-wider"
                  style={{ color: theme.colors.accent }}
                >
                  <span aria-hidden="true">►►</span> FIGHT RECORD
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {experience.map((entry) => (
                    <ExperienceCard key={entry.id} entry={entry} />
                  ))}
                </div>
              </NeonFrame>
            </section>
          )}

          {/* Skills/Tech section */}
          <section className="mb-8" aria-labelledby="skills-heading">
            <NeonFrame
              color={active === 'engineer' ? '#00ffff' : active === 'drummer' ? '#9966cc' : '#ff6600'}
              className="p-6"
            >
              <h2
                id="skills-heading"
                className="text-2xl mb-6 flex items-center gap-3 tracking-wider"
                style={{ color: theme.colors.accent }}
              >
                <span aria-hidden="true">►►►</span> {active === 'engineer' ? 'SPECIAL MOVES' : 'COMBAT SKILLS'}
              </h2>

              {active === 'engineer' ? (
                // Engineer: Show all technologies as "special moves" with combo notation
                <div className="space-y-6">
                  {engineerTech.slice(0, 6).map((category) => (
                    <div key={category.name}>
                      <h3
                        className="text-sm mb-3 flex items-center gap-2 tracking-wider"
                        style={{ color: theme.colors.text }}
                      >
                        <span aria-hidden="true">{category.icon}</span>
                        {category.name.toUpperCase()}
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-1">
                        {category.items.map((tech) => (
                          <SpecialMove key={tech} name={tech} category={category.name} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // Drummer/Fighter: Show skills as achievements - NO BARS
                <div className="grid md:grid-cols-3 gap-6">
                  {otherSkills.map((category) => (
                    <SkillAchievements key={category.name} category={category} />
                  ))}
                </div>
              )}
            </NeonFrame>
          </section>

          {/* Companies (Engineer) */}
          {active === 'engineer' && (
            <section className="mb-8" aria-labelledby="ventures-heading">
              <NeonFrame color="#00ffff" className="p-6">
                <h2
                  id="ventures-heading"
                  className="text-2xl mb-6 flex items-center gap-3 tracking-wider"
                  style={{ color: theme.colors.accent }}
                >
                  <span aria-hidden="true">►►►►</span> TEAM AFFILIATIONS
                </h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {COMPANIES.map((company) => (
                    <TeamCard key={company.id} company={company} />
                  ))}
                </div>
              </NeonFrame>
            </section>
          )}

          {/* Bands (Drummer) */}
          {active === 'drummer' && (
            <section className="mb-8" aria-labelledby="bands-heading">
              <NeonFrame color="#9966cc" className="p-6">
                <h2
                  id="bands-heading"
                  className="text-2xl mb-6 flex items-center gap-3 tracking-wider"
                  style={{ color: '#9966cc' }}
                >
                  <span aria-hidden="true">♪♪♪</span> STAGE CREWS
                </h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {BANDS.map((band) => (
                    <BandCard key={band.id} band={band} />
                  ))}
                </div>
              </NeonFrame>
            </section>
          )}

          {/* Projects / Featured Work */}
          <section aria-labelledby="projects-heading">
            <NeonFrame color="#ffd700" className="p-6">
              <h2
                id="projects-heading"
                className="text-2xl mb-6 flex items-center gap-3 tracking-wider"
                style={{ color: '#ffd700', textShadow: '0 0 10px #ffd700' }}
              >
                <span aria-hidden="true">★</span> CHAMPIONSHIP VICTORIES
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {projects.slice(0, 6).map((project) => (
                  <FightCard key={project.id} project={project} />
                ))}
              </div>
            </NeonFrame>
          </section>
        </div>
      </section>

      {/* Footer - Arcade cabinet insert coin */}
      <footer className="relative z-20 py-10 text-center">
        <p
          className="text-sm tracking-[0.3em] animate-pulse"
          style={{ color: theme.colors.textMuted }}
        >
          ▸ PRESS START TO CONTINUE ◂
        </p>
        <p
          className="text-sm mt-3 tracking-widest"
          style={{ color: theme.colors.accent, textShadow: `0 0 10px ${theme.colors.accent}` }}
        >
          MMXXVI ALEXANDER PULIDO
        </p>
        <div
          className="mt-5 inline-flex items-center gap-3 px-6 py-2"
          style={{
            background: 'linear-gradient(180deg, rgba(0,0,0,0.7), rgba(0,0,0,0.5))',
            border: `2px solid ${theme.colors.border}`,
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)',
          }}
        >
          <span className="text-[10px] tracking-widest" style={{ color: theme.colors.textMuted }}>
            INSERT COIN
          </span>
          <span
            className="animate-blink text-xl"
            aria-hidden="true"
            style={{ color: '#ffd700', textShadow: '0 0 10px #ffd700' }}
          >
            ●
          </span>
        </div>
      </footer>

      {/* Animations - with prefers-reduced-motion support */}
      <style jsx global>{`
        @media (prefers-reduced-motion: reduce) {
          .animate-stripe,
          .animate-flame,
          .animate-blink,
          .animate-bounce,
          .animate-pulse {
            animation: none !important;
          }
        }

        @keyframes stripe {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes flame {
          0%,
          100% {
            transform: translateY(0) scaleY(1);
            opacity: 0.7;
          }
          50% {
            transform: translateY(-15px) scaleY(1.3);
            opacity: 1;
          }
        }

        @keyframes blink {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }

        .animate-stripe {
          animation: stripe 4s linear infinite;
        }

        .animate-flame {
          animation: flame 0.6s ease-in-out infinite;
        }

        .animate-blink {
          animation: blink 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
