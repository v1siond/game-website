'use client'

import { useRef } from 'react'
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

// =============================================================================
// CSS-ONLY SVG PATTERNS & TEXTURES
// =============================================================================

// Metallic arcade cabinet texture - brushed metal with rivets
const metallicTexture = `
  linear-gradient(135deg, #2a2a3a 0%, #1a1a2a 25%, #3a3a4a 50%, #1a1a2a 75%, #2a2a3a 100%),
  repeating-linear-gradient(90deg, transparent 0px, transparent 4px, rgba(255,255,255,0.02) 4px, rgba(255,255,255,0.02) 5px),
  repeating-linear-gradient(0deg, transparent 0px, transparent 4px, rgba(0,0,0,0.1) 4px, rgba(0,0,0,0.1) 5px)
`

// CRT scanline overlay
const crtScanlines = `
  repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,0,0,0.2) 2px, rgba(0,0,0,0.2) 4px),
  repeating-linear-gradient(90deg, rgba(255,0,0,0.02) 0px, rgba(255,0,0,0.02) 1px, transparent 1px, transparent 3px)
`

// Screen vignette
const screenVignette = `radial-gradient(ellipse at center, transparent 0%, transparent 50%, rgba(0,0,0,0.5) 100%)`

// Screen glow (subtle RGB shift at edges)
const screenGlow = `
  radial-gradient(ellipse at 20% 30%, rgba(255,0,100,0.05) 0%, transparent 40%),
  radial-gradient(ellipse at 80% 70%, rgba(0,100,255,0.05) 0%, transparent 40%)
`

// =============================================================================
// SECTION CARD - ARCADE CABINET PANEL STYLE
// =============================================================================
function ArcadeSectionCard({
  children,
  color = '#00ffff',
  title,
  titleIcon,
  id,
}: {
  children: React.ReactNode
  color?: string
  title?: string
  titleIcon?: string
  id?: string
}) {
  const { theme } = useTheme()

  return (
    <section
      aria-labelledby={id}
      className="relative mb-8"
      style={{
        // Base metallic cabinet texture
        background: metallicTexture,
        // Neon glow border
        border: `3px solid ${color}`,
        boxShadow: `
          0 0 8px ${color},
          0 0 16px ${color}40,
          inset 0 0 30px rgba(0,0,0,0.6),
          inset 2px 2px 0 rgba(255,255,255,0.05),
          inset -2px -2px 0 rgba(0,0,0,0.3)
        `,
      }}
    >
      {/* CRT scanline overlay on section */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{ background: crtScanlines, opacity: 0.3 }}
      />

      {/* Corner bolts/rivets */}
      {[
        { pos: 'top-2 left-2' },
        { pos: 'top-2 right-2' },
        { pos: 'bottom-2 left-2' },
        { pos: 'bottom-2 right-2' },
      ].map((corner, i) => (
        <div
          key={i}
          className={`absolute w-4 h-4 z-10 ${corner.pos}`}
          aria-hidden="true"
          style={{
            background: `radial-gradient(circle at 30% 30%, #7a7a8a, #4a4a5a, #2a2a3a)`,
            border: '1px solid #1a1a2a',
            borderRadius: '50%',
            boxShadow: `
              inset 0 1px 2px rgba(255,255,255,0.4),
              inset 0 -1px 2px rgba(0,0,0,0.6),
              0 1px 3px rgba(0,0,0,0.4)
            `,
          }}
        >
          {/* Phillips head screw pattern */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              width: '8px',
              height: '1px',
              background: '#1a1a1a',
            }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              width: '1px',
              height: '8px',
              background: '#1a1a1a',
            }}
          />
        </div>
      ))}

      {/* Title bar with arcade button styling */}
      {title && (
        <div
          id={id}
          className="relative px-6 py-3 flex items-center gap-3"
          style={{
            background: `linear-gradient(180deg, ${color}30, ${color}10, transparent)`,
            borderBottom: `2px solid ${color}60`,
          }}
        >
          {/* Arcade button decoration */}
          <div
            className="w-8 h-8 flex items-center justify-center shrink-0"
            aria-hidden="true"
            style={{
              background: `radial-gradient(circle at 40% 35%, ${color}, ${color}80, ${color}50)`,
              border: `3px solid #1a1a2a`,
              borderRadius: '50%',
              boxShadow: `
                inset 0 2px 4px rgba(255,255,255,0.4),
                inset 0 -2px 4px rgba(0,0,0,0.4),
                0 0 10px ${color}60,
                0 3px 6px rgba(0,0,0,0.4)
              `,
            }}
          >
            <span className="text-sm" style={{ filter: `drop-shadow(0 0 4px ${color})` }}>
              {titleIcon}
            </span>
          </div>
          <h2
            className="text-xl tracking-[0.15em] font-bold"
            style={{
              color,
              textShadow: `0 0 10px ${color}, 0 0 20px ${color}60, 2px 2px 0 #000`,
            }}
          >
            {title}
          </h2>
        </div>
      )}

      <div className="relative p-6">{children}</div>
    </section>
  )
}

// =============================================================================
// VS BADGE - DRAMATIC LIGHTNING WITH CSS SVG
// =============================================================================
function VSBadge({ large = false }: { large?: boolean }) {
  const prefersReducedMotion = useRef(
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  return (
    <div
      className="relative flex items-center justify-center"
      role="img"
      aria-label="VS versus badge"
      style={{ width: large ? '120px' : '80px', height: large ? '100px' : '70px' }}
    >
      {/* Lightning bolts - CSS triangles forming zigzag */}
      <svg
        className="absolute inset-0"
        viewBox="0 0 80 70"
        aria-hidden="true"
        style={{
          filter: 'drop-shadow(0 0 8px #ffff00) drop-shadow(0 0 16px #ff6600)',
        }}
      >
        {/* Left lightning */}
        <path
          d="M15 10 L25 25 L18 25 L28 45 L20 45 L35 65 L25 40 L32 40 L22 22 L28 22 L15 10"
          fill="#ffff00"
          opacity="0.9"
        />
        {/* Right lightning */}
        <path
          d="M65 10 L55 25 L62 25 L52 45 L60 45 L45 65 L55 40 L48 40 L58 22 L52 22 L65 10"
          fill="#ffff00"
          opacity="0.9"
        />
      </svg>

      {/* Flame base - CSS gradient circles */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2"
        aria-hidden="true"
        style={{
          width: large ? '100px' : '70px',
          height: large ? '30px' : '20px',
          background: `
            radial-gradient(ellipse at 50% 100%, #ff2200 0%, #ff6600 40%, #ffaa00 70%, transparent 100%)
          `,
          filter: 'blur(3px)',
        }}
      />

      {/* VS Text */}
      <div
        className={`relative z-10 ${!prefersReducedMotion.current ? 'animate-vs-pulse' : ''}`}
        style={{
          fontSize: large ? '3rem' : '2rem',
          fontWeight: 'bold',
          color: '#ffd700',
          textShadow: `
            0 0 10px #ffd700,
            0 0 20px #ff6600,
            0 0 30px #ff4400,
            3px 3px 0 #000,
            -1px -1px 0 #000
          `,
          WebkitTextStroke: '1px #000',
          letterSpacing: '0.1em',
        }}
      >
        VS
      </div>
    </div>
  )
}

// =============================================================================
// FIGHT/KO/PERFECT TEXT STYLING
// =============================================================================
function ArcadeText({
  text,
  type = 'fight',
  size = 'md',
}: {
  text: string
  type?: 'fight' | 'ko' | 'perfect' | 'ready' | 'round'
  size?: 'sm' | 'md' | 'lg' | 'xl'
}) {
  const colorMap = {
    fight: { primary: '#ff0000', secondary: '#ff6600', tertiary: '#ffaa00' },
    ko: { primary: '#ffd700', secondary: '#ff6600', tertiary: '#ff2200' },
    perfect: { primary: '#00ffff', secondary: '#00aaff', tertiary: '#0066ff' },
    ready: { primary: '#4ade80', secondary: '#22c55e', tertiary: '#16a34a' },
    round: { primary: '#ffffff', secondary: '#cccccc', tertiary: '#999999' },
  }

  const sizeMap = {
    sm: '1rem',
    md: '2rem',
    lg: '3rem',
    xl: '5rem',
  }

  const colors = colorMap[type]

  return (
    <span
      className="font-bold tracking-[0.2em]"
      style={{
        fontSize: sizeMap[size],
        color: colors.primary,
        textShadow: `
          0 0 10px ${colors.primary},
          0 0 20px ${colors.secondary},
          0 0 30px ${colors.tertiary}40,
          2px 2px 0 #000,
          -1px -1px 0 #000,
          1px -1px 0 #000,
          -1px 1px 0 #000
        `,
        WebkitTextStroke: size === 'xl' ? '2px #000' : '1px #000',
      }}
    >
      {text}
    </span>
  )
}

// =============================================================================
// HEALTH BAR - IMMEDIATELY VISIBLE
// =============================================================================
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
        className="text-xs font-bold tracking-wider w-24 uppercase"
        style={{ color, textAlign: reverse ? 'right' : 'left', textShadow: `0 0 5px ${color}60` }}
      >
        {label}
      </span>
      <div
        className="flex-1 h-6 relative"
        style={{
          background: 'linear-gradient(180deg, #0a0a1a, #1a1a2e, #0a0a1a)',
          border: `2px solid ${color}60`,
          boxShadow: `inset 0 2px 8px rgba(0,0,0,0.8), 0 0 5px ${color}30`,
        }}
      >
        {/* Fill - IMMEDIATE, no animation */}
        <div
          className="absolute top-0 bottom-0"
          style={{
            left: reverse ? 'auto' : 0,
            right: reverse ? 0 : 'auto',
            width: `${percentage}%`,
            background: `linear-gradient(180deg, ${color}, ${color}cc, ${color}88)`,
            boxShadow: `0 0 15px ${color}80, inset 0 1px 0 rgba(255,255,255,0.4)`,
          }}
        />
        {/* Segment dividers */}
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0 w-px"
            aria-hidden="true"
            style={{ left: `${(i + 1) * 10}%`, background: 'rgba(0,0,0,0.5)' }}
          />
        ))}
        {/* Top shine */}
        <div
          className="absolute inset-x-0 top-0 h-1/3 opacity-30"
          aria-hidden="true"
          style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.4), transparent)' }}
        />
      </div>
      <span className="text-xs font-bold w-12 tabular-nums" style={{ color }}>
        {value}%
      </span>
    </div>
  )
}

// =============================================================================
// COMBO COUNTER DISPLAY
// =============================================================================
function ComboCounter({ hits, label }: { hits: number; label: string }) {
  const { theme } = useTheme()

  return (
    <div
      className="inline-flex items-center gap-2 px-3 py-1"
      role="status"
      aria-label={`${hits} ${label}`}
      style={{
        background: 'linear-gradient(180deg, rgba(0,0,0,0.8), rgba(0,0,0,0.6))',
        border: `2px solid ${theme.colors.accent}`,
        boxShadow: `0 0 10px ${theme.colors.accent}40`,
      }}
    >
      <span
        className="text-2xl font-bold tabular-nums"
        style={{
          color: '#ffd700',
          textShadow: '0 0 10px #ffd700, 0 0 20px #ff6600',
        }}
      >
        {hits}
      </span>
      <div className="flex flex-col">
        <span className="text-[8px] tracking-widest" style={{ color: theme.colors.accent }}>
          {label.toUpperCase()}
        </span>
        <span className="text-[10px] font-bold" style={{ color: '#ff6600' }}>
          COMBO!
        </span>
      </div>
    </div>
  )
}

// =============================================================================
// SPECIAL MOVE INPUT DISPLAY
// =============================================================================
function SpecialMoveInput({ name, input }: { name: string; input: string }) {
  const { theme } = useTheme()

  // Parse input notation like "↓→P" into visual buttons
  const renderInput = (notation: string) => {
    const symbols: Record<string, string> = {
      '↓': '▼',
      '↑': '▲',
      '←': '◄',
      '→': '►',
      P: 'P',
      K: 'K',
      LP: 'LP',
      HP: 'HP',
      LK: 'LK',
      HK: 'HK',
    }

    return notation.split('').map((char, i) => (
      <span
        key={i}
        className="inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold"
        style={{
          background: `radial-gradient(circle at 40% 35%, ${theme.colors.surface}, #1a1a2a)`,
          border: '2px solid #3a3a4a',
          borderRadius: '4px',
          boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.2), 0 2px 4px rgba(0,0,0,0.4)',
          color: theme.colors.text,
        }}
      >
        {symbols[char] || char}
      </span>
    ))
  }

  return (
    <div
      className="flex items-center justify-between px-3 py-2 group cursor-default"
      style={{
        background: `linear-gradient(90deg, ${theme.colors.surface}90, ${theme.colors.surface}40)`,
        borderLeft: `3px solid ${theme.colors.accent}`,
        borderBottom: `1px solid ${theme.colors.border}40`,
      }}
    >
      <span className="text-xs font-medium" style={{ color: theme.colors.text }}>
        {name}
      </span>
      <div className="flex gap-0.5">{renderInput(input)}</div>
    </div>
  )
}

// =============================================================================
// ROUND INDICATORS
// =============================================================================
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
          className="w-4 h-4 rounded-full"
          aria-hidden="true"
          style={{
            background: i < wins ? 'radial-gradient(circle at 40% 35%, #ffd700, #cc9900)' : '#2a2a3a',
            boxShadow: i < wins ? '0 0 10px #ffd700, 0 0 20px #ff660060' : 'inset 0 2px 4px rgba(0,0,0,0.4)',
            border: '2px solid #3a3a4a',
          }}
        />
      ))}
    </div>
  )
}

// =============================================================================
// PLAYER INDICATOR (P1/P2)
// =============================================================================
function PlayerIndicator({ player, side }: { player: 1 | 2; side: 'left' | 'right' }) {
  const color = player === 1 ? '#00aaff' : '#ff4444'

  return (
    <div
      className={`absolute -top-8 ${side === 'left' ? 'left-2' : 'right-2'} px-3 py-1`}
      aria-label={`Player ${player}`}
      style={{
        background: `linear-gradient(180deg, ${color}, ${color}cc)`,
        border: '2px solid #000',
        boxShadow: `0 0 10px ${color}60`,
        clipPath: 'polygon(10% 0, 90% 0, 100% 100%, 0 100%)',
      }}
    >
      <span className="text-xs font-bold tracking-widest text-black">P{player}</span>
    </div>
  )
}

// =============================================================================
// CHARACTER PORTRAIT WITH NEON FRAME
// =============================================================================
function CharacterPortrait({
  icon,
  name,
  subtitle,
  achievements,
  winRecord,
  isSelected,
  onClick,
  side,
  playerNum,
}: {
  icon: string
  name: string
  subtitle: string
  achievements: string[]
  winRecord: { wins: number; losses: number }
  isSelected: boolean
  onClick: () => void
  side: 'left' | 'right'
  playerNum: 1 | 2
}) {
  const { theme } = useTheme()

  return (
    <button
      onClick={onClick}
      aria-pressed={isSelected}
      aria-label={`Select ${name} - ${subtitle}. ${achievements.join('. ')}. Win record: ${winRecord.wins} wins, ${winRecord.losses} losses.`}
      className={`relative p-5 focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 ${
        isSelected ? 'scale-105 z-10' : 'opacity-70 hover:opacity-100'
      }`}
      style={{
        background: isSelected
          ? `linear-gradient(${side === 'left' ? '135deg' : '-135deg'}, ${theme.colors.accent}50, #0a0a2040)`
          : metallicTexture,
        border: `4px solid ${isSelected ? theme.colors.accent : theme.colors.border}`,
        clipPath:
          side === 'left'
            ? 'polygon(0 0, 100% 0, 92% 100%, 0 100%)'
            : 'polygon(8% 0, 100% 0, 100% 100%, 0 100%)',
        boxShadow: isSelected
          ? `
            0 0 30px ${theme.colors.accent}80,
            0 0 60px ${theme.colors.accent}40,
            inset 0 0 20px ${theme.colors.accent}20
          `
          : `
            inset 0 2px 4px rgba(255,255,255,0.1),
            inset 0 -2px 4px rgba(0,0,0,0.4),
            0 4px 8px rgba(0,0,0,0.3)
          `,
        minWidth: '180px',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease',
      }}
    >
      {/* Player indicator */}
      {isSelected && <PlayerIndicator player={playerNum} side={side} />}

      {/* Neon border glow when selected */}
      {isSelected && (
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            border: `2px solid ${theme.colors.accent}`,
            clipPath:
              side === 'left'
                ? 'polygon(0 0, 100% 0, 92% 100%, 0 100%)'
                : 'polygon(8% 0, 100% 0, 100% 100%, 0 100%)',
            boxShadow: `inset 0 0 15px ${theme.colors.accent}60`,
          }}
        />
      )}

      {/* Character icon with glow */}
      <div
        className="text-7xl mb-4"
        style={{
          filter: isSelected ? `drop-shadow(0 0 20px ${theme.colors.accent})` : 'none',
        }}
      >
        {icon}
      </div>

      {/* Name plate - hexagonal arcade style */}
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

      {/* Win/Loss record */}
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
        <span className="text-xs mx-3" style={{ color: '#ffd700' }}>
          <ArcadeText text="KO" type="ko" size="sm" />
        </span>
        <span
          className="text-xs font-bold tracking-wider"
          style={{ color: '#f87171', textShadow: '0 0 5px #f87171' }}
        >
          L:{winRecord.losses}
        </span>
      </div>

      {/* Achievements - impact statements */}
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

      {/* Selection arrow */}
      {isSelected && (
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 text-2xl"
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

// =============================================================================
// ROLE RANK DISPLAY
// =============================================================================
function RoleRank({ role }: { role: (typeof CURRENT_ROLES)[0] }) {
  const { theme } = useTheme()
  const isLeadership = role.type === 'leadership'

  return (
    <div
      className="relative px-5 py-3 text-center"
      role="listitem"
      style={{
        background: isLeadership
          ? `linear-gradient(180deg, #ffd70040, #ffd70010, transparent)`
          : metallicTexture,
        border: `3px solid ${isLeadership ? '#ffd700' : theme.colors.border}`,
        clipPath: 'polygon(15% 0, 85% 0, 100% 50%, 85% 100%, 15% 100%, 0 50%)',
        boxShadow: isLeadership
          ? '0 0 20px #ffd70040, inset 0 0 15px #ffd70020'
          : 'inset 0 2px 4px rgba(255,255,255,0.1), 0 4px 8px rgba(0,0,0,0.3)',
      }}
    >
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

// =============================================================================
// TEAM CARD (COMPANIES)
// =============================================================================
function TeamCard({ company }: { company: (typeof COMPANIES)[0] }) {
  const { theme } = useTheme()

  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Visit ${company.name} - ${company.tagline}`}
      className="block focus:outline-none focus-visible:ring-4"
      style={{
        background: metallicTexture,
        border: `2px solid ${theme.colors.accent}`,
        boxShadow: `0 0 10px ${theme.colors.accent}30, inset 0 0 20px rgba(0,0,0,0.4)`,
      }}
    >
      <div className="p-4 relative">
        {/* CRT scanlines */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          aria-hidden="true"
          style={{ background: crtScanlines }}
        />

        <div className="flex items-center gap-3 relative">
          <span className="text-3xl" aria-hidden="true">
            {company.icon}
          </span>
          <div>
            <h4
              className="text-sm font-bold tracking-wide"
              style={{ color: theme.colors.text, textShadow: `0 0 10px ${theme.colors.accent}40` }}
            >
              {company.name}
            </h4>
            <p className="text-[10px] tracking-wider" style={{ color: theme.colors.accent }}>
              {company.tagline}
            </p>
          </div>
        </div>
        <p className="text-[10px] mt-3 leading-relaxed relative" style={{ color: theme.colors.textMuted }}>
          {company.description}
        </p>
        <div className="flex flex-wrap gap-1 mt-3 relative">
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
      </div>
    </a>
  )
}

// =============================================================================
// BAND CARD
// =============================================================================
function BandCard({ band }: { band: (typeof BANDS)[0] }) {
  const { theme } = useTheme()
  const bandColor = '#9966cc'

  const content = (
    <div
      className="p-4 relative"
      style={{
        background: metallicTexture,
        border: `2px solid ${bandColor}`,
        boxShadow: `0 0 10px ${bandColor}30, inset 0 0 20px rgba(0,0,0,0.4)`,
      }}
    >
      {/* CRT scanlines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        aria-hidden="true"
        style={{ background: crtScanlines }}
      />

      <div className="flex justify-between items-start relative">
        <h4
          className="text-sm font-bold tracking-wide"
          style={{ color: theme.colors.text, textShadow: `0 0 10px ${bandColor}40` }}
        >
          {band.name}
        </h4>
        {band.active && (
          <span
            className="text-[8px] px-2 py-0.5 font-bold"
            style={{ background: '#4ade80', color: '#000', boxShadow: '0 0 10px #4ade80' }}
          >
            ACTIVE
          </span>
        )}
      </div>
      <p className="text-[10px] mt-1 relative" style={{ color: bandColor }}>
        {band.genre} // {band.role}
      </p>
      <p className="text-[10px] mt-2 leading-relaxed relative" style={{ color: theme.colors.textMuted }}>
        {band.description}
      </p>
      {!band.url && (
        <p className="text-[8px] mt-2 italic relative" style={{ color: theme.colors.textMuted }}>
          Website coming soon...
        </p>
      )}
    </div>
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

// =============================================================================
// EXPERIENCE CARD
// =============================================================================
function ExperienceCard({ entry }: { entry: (typeof EXPERIENCE_DATA)[0] }) {
  const { theme } = useTheme()
  const endDisplay = entry.endDate ? new Date(entry.endDate).getFullYear() : 'Present'
  const startDisplay = new Date(entry.startDate).getFullYear()
  const isActive = !entry.endDate

  return (
    <article
      className="relative"
      style={{
        background: metallicTexture,
        border: `3px solid ${isActive ? theme.colors.accent : theme.colors.border}`,
        clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)',
        boxShadow: isActive
          ? `0 0 20px ${theme.colors.accent}40, inset 0 0 20px rgba(0,0,0,0.4)`
          : 'inset 0 0 20px rgba(0,0,0,0.4)',
      }}
    >
      <div className="p-4 relative">
        {/* CRT scanlines */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          aria-hidden="true"
          style={{ background: crtScanlines }}
        />

        {/* Header */}
        <div className="flex justify-between items-start mb-3 relative">
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
              background: isActive ? 'linear-gradient(90deg, #4ade80, #22c55e)' : theme.colors.border,
              color: isActive ? '#000' : theme.colors.text,
              boxShadow: isActive ? '0 0 10px #4ade8060' : 'none',
            }}
          >
            {startDisplay} - {endDisplay}
          </span>
        </div>

        {/* Description */}
        <p className="text-[10px] mb-3 leading-relaxed relative" style={{ color: theme.colors.textMuted }}>
          {entry.description}
        </p>

        {/* Highlights */}
        {entry.highlights && entry.highlights.length > 0 && (
          <ul className="space-y-1 mb-3 relative" role="list">
            {entry.highlights.map((highlight, i) => (
              <li
                key={i}
                className="text-[10px] flex items-start gap-2"
                style={{ color: theme.colors.text }}
              >
                <ArcadeText text="KO" type="ko" size="sm" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Skills */}
        <div className="flex flex-wrap gap-1 relative">
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
          background: isActive ? `linear-gradient(135deg, ${theme.colors.accent}, #ffd700)` : theme.colors.accent,
          clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
        }}
      />
    </article>
  )
}

// =============================================================================
// PROJECT CARD (FIGHT CARD)
// =============================================================================
function FightCard({ project }: { project: (typeof PROJECTS_DATA)[0] }) {
  const { theme } = useTheme()

  return (
    <article
      className="relative"
      style={{
        background: metallicTexture,
        border: `3px solid ${project.featured ? '#ffd700' : theme.colors.border}`,
        clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)',
        boxShadow: project.featured
          ? '0 0 25px rgba(255, 215, 0, 0.4), inset 0 0 20px rgba(255, 215, 0, 0.1)'
          : 'inset 0 0 20px rgba(0,0,0,0.4)',
      }}
    >
      <div className="p-4 relative">
        {/* CRT scanlines */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          aria-hidden="true"
          style={{ background: crtScanlines }}
        />

        {/* Header */}
        <div className="flex justify-between items-start mb-3 relative">
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
              <ArcadeText text="CHAMPION" type="ko" size="sm" />
            </span>
          )}
        </div>

        {/* Tagline */}
        <p className="text-[10px] mb-2 relative" style={{ color: theme.colors.textMuted }}>
          {project.tagline}
        </p>

        {/* Impact statement */}
        {project.impact && (
          <div
            className="text-[10px] py-2 px-3 mb-3 relative"
            style={{
              background: `linear-gradient(90deg, ${theme.colors.accent}20, transparent)`,
              borderLeft: `3px solid ${theme.colors.accent}`,
              color: theme.colors.accent,
            }}
          >
            <ArcadeText text="KO:" type="ko" size="sm" /> {project.impact}
          </div>
        )}

        {/* Tech stack */}
        <div className="flex flex-wrap gap-1 relative">
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
          <div className="flex gap-2 mt-3 relative">
            {project.links.site && (
              <a
                href={project.links.site}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[9px] px-3 py-1 font-bold focus:outline-none focus-visible:ring-2"
                style={{
                  background: theme.colors.accent,
                  color: '#000',
                  boxShadow: `0 0 10px ${theme.colors.accent}60`,
                }}
                aria-label={`Visit ${project.name} website`}
              >
                VIEW
              </a>
            )}
            {project.links.demo && (
              <Link
                href={project.links.demo}
                className="text-[9px] px-3 py-1 font-bold focus:outline-none focus-visible:ring-2"
                style={{
                  background: '#4ade80',
                  color: '#000',
                  boxShadow: '0 0 10px #4ade8060',
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
    </article>
  )
}

// =============================================================================
// SKILL SECTION (NO BARS - ACHIEVEMENTS ONLY)
// =============================================================================
function SkillSection({
  category,
}: {
  category: { name: string; icon?: string; skills: { name: string; proficiency: number }[] }
}) {
  const { theme } = useTheme()

  return (
    <div className="space-y-2">
      <h4
        className="text-xs font-bold tracking-wider flex items-center gap-2"
        style={{ color: theme.colors.text, textShadow: `0 0 5px ${theme.colors.accent}40` }}
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

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function FighterSelectTheme() {
  const { theme } = useTheme()
  const { active, setActive, config } = useProfession()

  const aboutData = ABOUT_DATA[active]
  const engineerTech = getEngineerSkills()
  const otherSkills = getSkillsByProfession(active)
  const projects = PROJECTS_DATA.filter((p) => p.professions.includes(active) || p.featured)
  const experience = filterExperienceByProfession(EXPERIENCE_DATA, active)

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

  // Common move inputs for engineer
  const specialMoves = [
    { name: 'Deploy to Production', input: '↓→P' },
    { name: 'Debug Master', input: '←↓→K' },
    { name: 'Code Review', input: '↓↓P' },
    { name: 'Ship Feature', input: '→→P' },
  ]

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: `radial-gradient(ellipse at center, #1a1a3e 0%, ${theme.colors.background} 50%, #0a0a1a 100%)`,
        fontFamily: '"Impact", "Arial Black", sans-serif',
      }}
    >
      {/* Screen glow effects */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true" style={{ background: screenGlow }} />

      {/* CRT Scanlines overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-[100]"
        aria-hidden="true"
        style={{ background: crtScanlines, opacity: 0.4 }}
      />

      {/* Screen vignette */}
      <div
        className="fixed inset-0 pointer-events-none z-[99]"
        aria-hidden="true"
        style={{ background: screenVignette }}
      />

      {/* =================================================================== */}
      {/* HEADER */}
      {/* =================================================================== */}
      <header className="relative z-30 p-6">
        <div className="max-w-6xl mx-auto">
          <ArcadeSectionCard color={theme.colors.accent}>
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                {/* Title with dramatic styling */}
                <h1
                  className="text-3xl md:text-4xl tracking-widest"
                  style={{
                    color: theme.colors.accent,
                    textShadow: `
                      0 0 10px ${theme.colors.accent},
                      0 0 20px ${theme.colors.accent}60,
                      3px 3px 0 ${theme.colors.background},
                      5px 5px 0 #000
                    `,
                  }}
                >
                  SELECT YOUR FIGHTER
                </h1>

                {/* Professional summary */}
                <p
                  className="text-sm md:text-base mt-3 tracking-wide"
                  style={{ color: theme.colors.text, fontFamily: 'sans-serif' }}
                >
                  {PROFESSIONAL_SUMMARY.headline}
                </p>
                <p
                  className="text-xs md:text-sm mt-1 italic tracking-wider"
                  style={{ color: theme.colors.accent }}
                >
                  &quot;{PROFESSIONAL_SUMMARY.tagline}&quot;
                </p>

                {/* Combo counter showing years of experience */}
                <div className="mt-4">
                  <ComboCounter hits={10} label="Years Experience" />
                </div>
              </div>

              <nav className="flex gap-3 items-center shrink-0" aria-label="Main navigation">
                <Link
                  href="/cv"
                  className="px-5 py-2 text-sm tracking-widest focus:outline-none focus-visible:ring-4"
                  style={{
                    background: metallicTexture,
                    border: `3px solid ${theme.colors.border}`,
                    color: theme.colors.text,
                    clipPath: 'polygon(10% 0, 100% 0, 100% 100%, 0 100%)',
                    boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.1), 0 4px 8px rgba(0,0,0,0.3)',
                  }}
                >
                  CV
                </Link>
                <Link
                  href="/personal-projects/game-engine"
                  className="px-5 py-2 text-sm tracking-widest focus:outline-none focus-visible:ring-4"
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
          </ArcadeSectionCard>
        </div>
      </header>

      {/* =================================================================== */}
      {/* CURRENT ROLES */}
      {/* =================================================================== */}
      <section className="relative z-20 py-4 px-6" aria-label="Current professional roles">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4" role="list">
            {CURRENT_ROLES.map((role) => (
              <RoleRank key={role.id} role={role} />
            ))}
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* CHARACTER SELECT */}
      {/* =================================================================== */}
      <section className="relative z-20 py-8 px-6" aria-label="Character selection">
        <div className="max-w-6xl mx-auto">
          {/* VS Screen layout - ALL VISIBLE IMMEDIATELY */}
          <div
            className="flex items-center justify-center gap-4 md:gap-6 mb-8 flex-wrap"
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
                  playerNum={index === 0 ? 1 : 2}
                />
                {index < characters.length - 1 && (
                  <div className="mx-2 md:mx-4 hidden md:block">
                    <VSBadge />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Health bars - IMMEDIATELY VISIBLE */}
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

          {/* Ready banner - IMMEDIATELY VISIBLE */}
          <div
            className="text-center py-5 mb-8"
            role="status"
            aria-live="polite"
            style={{
              background: `linear-gradient(90deg, transparent, ${theme.colors.accent}50, transparent)`,
            }}
          >
            <ArcadeText text={`${config.title.toUpperCase()} - READY!`} type="ready" size="lg" />
          </div>

          {/* =================================================================== */}
          {/* FIGHTER PROFILE */}
          {/* =================================================================== */}
          <ArcadeSectionCard
            color={theme.colors.accent}
            title="FIGHTER PROFILE"
            titleIcon="►"
            id="profile-heading"
          >
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
          </ArcadeSectionCard>

          {/* =================================================================== */}
          {/* FIGHT RECORD (EXPERIENCE) */}
          {/* =================================================================== */}
          {experience.length > 0 && (
            <ArcadeSectionCard
              color={theme.colors.accent}
              title="FIGHT RECORD"
              titleIcon="►►"
              id="experience-heading"
            >
              <div className="grid md:grid-cols-2 gap-4">
                {experience.map((entry) => (
                  <ExperienceCard key={entry.id} entry={entry} />
                ))}
              </div>
            </ArcadeSectionCard>
          )}

          {/* =================================================================== */}
          {/* SKILLS / SPECIAL MOVES */}
          {/* =================================================================== */}
          <ArcadeSectionCard
            color={active === 'engineer' ? '#00ffff' : active === 'drummer' ? '#9966cc' : '#ff6600'}
            title={active === 'engineer' ? 'SPECIAL MOVES' : 'COMBAT SKILLS'}
            titleIcon="►►►"
            id="skills-heading"
          >
            {active === 'engineer' ? (
              <div className="space-y-6">
                {/* Special move inputs */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
                  {specialMoves.map((move) => (
                    <SpecialMoveInput key={move.name} name={move.name} input={move.input} />
                  ))}
                </div>

                {/* Tech categories */}
                {engineerTech.slice(0, 6).map((category) => (
                  <div key={category.name}>
                    <h3
                      className="text-sm mb-3 flex items-center gap-2 tracking-wider"
                      style={{ color: theme.colors.text, textShadow: `0 0 5px ${theme.colors.accent}40` }}
                    >
                      <span aria-hidden="true">{category.icon}</span>
                      {category.name.toUpperCase()}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-1">
                      {category.items.map((tech) => (
                        <div
                          key={tech}
                          className="px-2 py-1.5 text-xs"
                          style={{
                            background: `${theme.colors.surface}90`,
                            border: `1px solid ${theme.colors.border}50`,
                            color: theme.colors.text,
                          }}
                        >
                          {tech}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {otherSkills.map((category) => (
                  <SkillSection key={category.name} category={category} />
                ))}
              </div>
            )}
          </ArcadeSectionCard>

          {/* =================================================================== */}
          {/* TEAM AFFILIATIONS (COMPANIES) */}
          {/* =================================================================== */}
          {active === 'engineer' && (
            <ArcadeSectionCard color="#00ffff" title="TEAM AFFILIATIONS" titleIcon="►►►►" id="ventures-heading">
              <div className="grid md:grid-cols-3 gap-4">
                {COMPANIES.map((company) => (
                  <TeamCard key={company.id} company={company} />
                ))}
              </div>
            </ArcadeSectionCard>
          )}

          {/* =================================================================== */}
          {/* STAGE CREWS (BANDS) */}
          {/* =================================================================== */}
          {active === 'drummer' && (
            <ArcadeSectionCard color="#9966cc" title="STAGE CREWS" titleIcon="♪♪♪" id="bands-heading">
              <div className="grid md:grid-cols-3 gap-4">
                {BANDS.map((band) => (
                  <BandCard key={band.id} band={band} />
                ))}
              </div>
            </ArcadeSectionCard>
          )}

          {/* =================================================================== */}
          {/* CHAMPIONSHIP VICTORIES (PROJECTS) */}
          {/* =================================================================== */}
          <ArcadeSectionCard color="#ffd700" title="CHAMPIONSHIP VICTORIES" titleIcon="★" id="projects-heading">
            <div className="grid md:grid-cols-2 gap-4">
              {projects.slice(0, 6).map((project) => (
                <FightCard key={project.id} project={project} />
              ))}
            </div>
          </ArcadeSectionCard>
        </div>
      </section>

      {/* =================================================================== */}
      {/* FOOTER */}
      {/* =================================================================== */}
      <footer className="relative z-20 py-10 text-center">
        <p className="text-sm tracking-[0.3em]" style={{ color: theme.colors.textMuted }}>
          ▸ PRESS START TO CONTINUE ◂
        </p>
        <p
          className="text-sm mt-3 tracking-widest"
          style={{ color: theme.colors.accent, textShadow: `0 0 10px ${theme.colors.accent}` }}
        >
          MMXXVI ALEXANDER PULIDO
        </p>

        {/* Insert coin slot - worn arcade button style */}
        <div
          className="mt-5 inline-flex items-center gap-3 px-6 py-3"
          aria-hidden="true"
          style={{
            background: metallicTexture,
            border: `3px solid ${theme.colors.border}`,
            boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.6), 0 4px 8px rgba(0,0,0,0.3)',
          }}
        >
          {/* Worn coin slot */}
          <div
            className="w-12 h-2"
            style={{
              background: 'linear-gradient(180deg, #1a1a1a, #0a0a0a)',
              border: '1px solid #3a3a3a',
              borderRadius: '2px',
              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.8)',
            }}
          />
          <span className="text-[10px] tracking-widest" style={{ color: theme.colors.textMuted }}>
            INSERT COIN
          </span>
          <span
            className="text-xl animate-blink"
            style={{ color: '#ffd700', textShadow: '0 0 10px #ffd700' }}
          >
            ●
          </span>
        </div>
      </footer>

      {/* =================================================================== */}
      {/* ANIMATIONS - WITH REDUCED MOTION SUPPORT */}
      {/* =================================================================== */}
      <style jsx global>{`
        @media (prefers-reduced-motion: reduce) {
          .animate-vs-pulse,
          .animate-blink {
            animation: none !important;
          }
        }

        @keyframes vs-pulse {
          0%,
          100% {
            transform: scale(1);
            filter: brightness(1);
          }
          50% {
            transform: scale(1.05);
            filter: brightness(1.2);
          }
        }

        @keyframes blink {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.3;
          }
        }

        .animate-vs-pulse {
          animation: vs-pulse 2s ease-in-out infinite;
        }

        .animate-blink {
          animation: blink 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
