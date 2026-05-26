'use client'

import { useRef, useEffect, useState } from 'react'
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
// EXACT COLOR PALETTE - STREET FIGHTER / MORTAL KOMBAT / TEKKEN INSPIRED
// =============================================================================
const COLORS = {
  // Player 1 Blue
  p1Blue: '#0066FF',
  p1BlueDark: '#0044CC',
  p1BlueDarker: '#003399',
  // Player 2 Red
  p2Red: '#FF0033',
  p2RedDark: '#CC0022',
  p2RedDarker: '#990011',
  // Electric Yellow
  electricYellow: '#FFFF00',
  gold: '#FFD700',
  orange: '#FFA500',
  // Neon Pink
  neonPink: '#FF00FF',
  neonPinkLight: '#FF66FF',
  // Arcade Black
  arcadeBlack: '#0A0A0A',
  arcadeGray: '#1A1A1A',
  // Chrome/Metal
  chrome: '#C0C0C0',
  chromeDark: '#A0A0A0',
  chromeDarker: '#808080',
  // Health Green
  healthGreen: '#00FF00',
  healthGreenDark: '#00CC00',
  // Special Move Blue
  specialBlue: '#00FFFF',
  specialBlueDark: '#00CCCC',
}

// =============================================================================
// CSS TEXTURES & EFFECTS
// =============================================================================

// Metallic arcade cabinet texture with brushed metal effect
const metallicTexture = `
  linear-gradient(135deg, #2a2a3a 0%, #1a1a2a 25%, #3a3a4a 50%, #1a1a2a 75%, #2a2a3a 100%),
  repeating-linear-gradient(90deg, transparent 0px, transparent 4px, rgba(255,255,255,0.02) 4px, rgba(255,255,255,0.02) 5px),
  repeating-linear-gradient(0deg, transparent 0px, transparent 4px, rgba(0,0,0,0.1) 4px, rgba(0,0,0,0.1) 5px)
`

// CRT scanline overlay - authentic arcade monitor effect
const crtScanlines = `
  repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px),
  repeating-linear-gradient(90deg, rgba(255,0,0,0.015) 0px, rgba(255,0,0,0.015) 1px, transparent 1px, transparent 3px)
`

// Screen vignette - darkened edges like CRT monitors
const screenVignette = `radial-gradient(ellipse at center, transparent 0%, transparent 40%, rgba(0,0,0,0.6) 100%)`

// RGB screen glow bleeding at edges
const screenGlow = `
  radial-gradient(ellipse at 20% 30%, rgba(255,0,100,0.08) 0%, transparent 40%),
  radial-gradient(ellipse at 80% 70%, rgba(0,100,255,0.08) 0%, transparent 40%),
  radial-gradient(ellipse at 50% 50%, rgba(0,255,255,0.03) 0%, transparent 60%)
`

// Lightning bolt background pattern
const lightningPattern = `
  radial-gradient(ellipse at 50% 0%, ${COLORS.electricYellow}10 0%, transparent 50%),
  radial-gradient(ellipse at 50% 100%, ${COLORS.orange}10 0%, transparent 50%)
`

// =============================================================================
// HOOK: REDUCED MOTION DETECTION
// =============================================================================
function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return reducedMotion
}

// =============================================================================
// ARCADE CABINET FRAME SVG - WORN METAL WITH BOLTS
// =============================================================================
function ArcadeCabinetFrame({ children, color = COLORS.specialBlue }: { children: React.ReactNode; color?: string }) {
  return (
    <div
      className="relative"
      style={{
        background: metallicTexture,
        border: `4px solid ${color}`,
        borderRadius: '4px',
        boxShadow: `
          0 0 20px ${color}60,
          0 0 40px ${color}30,
          inset 0 0 40px rgba(0,0,0,0.7),
          inset 2px 2px 0 rgba(255,255,255,0.05),
          inset -2px -2px 0 rgba(0,0,0,0.4)
        `,
      }}
    >
      {/* Corner bolts/rivets */}
      {[
        { top: '8px', left: '8px' },
        { top: '8px', right: '8px' },
        { bottom: '8px', left: '8px' },
        { bottom: '8px', right: '8px' },
      ].map((pos, i) => (
        <div
          key={i}
          className="absolute w-5 h-5 z-20"
          aria-hidden="true"
          style={{
            ...pos,
            background: `radial-gradient(circle at 30% 30%, ${COLORS.chrome}, ${COLORS.chromeDark}, ${COLORS.chromeDarker})`,
            border: `2px solid ${COLORS.arcadeGray}`,
            borderRadius: '50%',
            boxShadow: `
              inset 0 2px 3px rgba(255,255,255,0.5),
              inset 0 -2px 3px rgba(0,0,0,0.7),
              0 2px 4px rgba(0,0,0,0.5)
            `,
          }}
        >
          {/* Phillips head screw */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ width: '10px', height: '2px', background: COLORS.arcadeGray }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ width: '2px', height: '10px', background: COLORS.arcadeGray }}
          />
        </div>
      ))}

      {/* Worn scratches on metal - subtle */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        aria-hidden="true"
        style={{
          background: `
            repeating-linear-gradient(45deg, transparent 0px, transparent 20px, rgba(255,255,255,0.03) 20px, rgba(255,255,255,0.03) 21px),
            repeating-linear-gradient(-45deg, transparent 0px, transparent 30px, rgba(0,0,0,0.05) 30px, rgba(0,0,0,0.05) 31px)
          `,
        }}
      />

      {children}
    </div>
  )
}

// =============================================================================
// CRT SCREEN EFFECT WRAPPER
// =============================================================================
function CRTScreen({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      {/* Screen glow */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        aria-hidden="true"
        style={{ background: screenGlow }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>

      {/* CRT scanlines overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-30"
        aria-hidden="true"
        style={{ background: crtScanlines, opacity: 0.4 }}
      />

      {/* Screen curvature vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-20"
        aria-hidden="true"
        style={{ background: screenVignette }}
      />
    </div>
  )
}

// =============================================================================
// SECTION CARD - ARCADE PANEL WITH NEON BORDER
// =============================================================================
function ArcadeSectionCard({
  children,
  color = COLORS.specialBlue,
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
  return (
    <section
      aria-labelledby={id}
      className="relative mb-10"
    >
      <ArcadeCabinetFrame color={color}>
        {/* CRT effect inside */}
        <CRTScreen>
          {/* Title bar with arcade button */}
          {title && (
            <div
              id={id}
              className="relative px-8 py-4 flex items-center gap-4"
              style={{
                background: `linear-gradient(180deg, ${color}40, ${color}15, transparent)`,
                borderBottom: `3px solid ${color}80`,
              }}
            >
              {/* Arcade button decoration */}
              <div
                className="w-10 h-10 flex items-center justify-center shrink-0"
                aria-hidden="true"
                style={{
                  background: `radial-gradient(circle at 40% 35%, ${color}, ${color}99, ${color}66)`,
                  border: `4px solid ${COLORS.arcadeGray}`,
                  borderRadius: '50%',
                  boxShadow: `
                    inset 0 3px 6px rgba(255,255,255,0.5),
                    inset 0 -3px 6px rgba(0,0,0,0.5),
                    0 0 15px ${color}80,
                    0 4px 8px rgba(0,0,0,0.5)
                  `,
                }}
              >
                <span
                  className="text-lg font-bold"
                  style={{
                    color: COLORS.arcadeBlack,
                    textShadow: `0 1px 0 rgba(255,255,255,0.4)`,
                  }}
                >
                  {titleIcon}
                </span>
              </div>

              <h2
                className="text-2xl tracking-[0.2em] font-black uppercase"
                style={{
                  color,
                  textShadow: `
                    0 0 10px ${color},
                    0 0 20px ${color}80,
                    0 0 30px ${color}40,
                    3px 3px 0 ${COLORS.arcadeBlack},
                    -1px -1px 0 ${COLORS.arcadeBlack}
                  `,
                  fontFamily: '"Impact", "Arial Black", sans-serif',
                }}
              >
                {title}
              </h2>
            </div>
          )}

          <div className="relative p-8">{children}</div>
        </CRTScreen>
      </ArcadeCabinetFrame>
    </section>
  )
}

// =============================================================================
// VS SCREEN - DRAMATIC LIGHTNING WITH SVG
// =============================================================================
function VSBadge({ large = false }: { large?: boolean }) {
  const reducedMotion = useReducedMotion()
  const size = large ? 140 : 100

  return (
    <div
      className="relative flex items-center justify-center"
      role="img"
      aria-label="VS versus badge"
      style={{ width: size, height: size }}
    >
      {/* Lightning bolts SVG */}
      <svg
        className="absolute inset-0"
        viewBox="0 0 100 100"
        aria-hidden="true"
        style={{
          filter: `drop-shadow(0 0 10px ${COLORS.electricYellow}) drop-shadow(0 0 20px ${COLORS.orange})`,
        }}
      >
        {/* Left lightning bolt */}
        <path
          d="M20 5 L35 30 L25 30 L40 55 L28 55 L50 95 L38 50 L48 50 L35 28 L43 28 L20 5"
          fill={COLORS.electricYellow}
          opacity="0.95"
        />
        {/* Right lightning bolt */}
        <path
          d="M80 5 L65 30 L75 30 L60 55 L72 55 L50 95 L62 50 L52 50 L65 28 L57 28 L80 5"
          fill={COLORS.electricYellow}
          opacity="0.95"
        />
        {/* Lightning highlights */}
        <path
          d="M23 8 L36 30 L27 30 L38 50"
          fill="none"
          stroke="white"
          strokeWidth="2"
          opacity="0.6"
        />
        <path
          d="M77 8 L64 30 L73 30 L62 50"
          fill="none"
          stroke="white"
          strokeWidth="2"
          opacity="0.6"
        />
      </svg>

      {/* Flame burst at bottom */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2"
        aria-hidden="true"
        style={{
          width: large ? 120 : 80,
          height: large ? 40 : 25,
          background: `
            radial-gradient(ellipse at 50% 100%, ${COLORS.p2Red} 0%, ${COLORS.orange} 50%, ${COLORS.electricYellow} 80%, transparent 100%)
          `,
          filter: 'blur(4px)',
        }}
      />

      {/* VS Text - explosive styling */}
      <div
        className={`relative z-10 ${!reducedMotion ? 'animate-vs-pulse' : ''}`}
        style={{
          fontSize: large ? '3.5rem' : '2.5rem',
          fontWeight: 900,
          fontFamily: '"Impact", "Arial Black", sans-serif',
          color: COLORS.gold,
          textShadow: `
            0 0 10px ${COLORS.gold},
            0 0 20px ${COLORS.orange},
            0 0 40px ${COLORS.p2Red},
            4px 4px 0 ${COLORS.arcadeBlack},
            -2px -2px 0 ${COLORS.arcadeBlack},
            2px -2px 0 ${COLORS.arcadeBlack},
            -2px 2px 0 ${COLORS.arcadeBlack}
          `,
          WebkitTextStroke: `2px ${COLORS.arcadeBlack}`,
          letterSpacing: '0.15em',
        }}
      >
        VS
      </div>
    </div>
  )
}

// =============================================================================
// DRAMATIC TEXT STYLES - FIGHT! / K.O. / PERFECT / ROUND
// =============================================================================
function ArcadeText({
  text,
  type = 'fight',
  size = 'md',
}: {
  text: string
  type?: 'fight' | 'ko' | 'perfect' | 'ready' | 'round' | 'combo'
  size?: 'sm' | 'md' | 'lg' | 'xl'
}) {
  const colorMap = {
    fight: { primary: COLORS.p2Red, secondary: COLORS.orange, tertiary: COLORS.electricYellow },
    ko: { primary: COLORS.gold, secondary: COLORS.orange, tertiary: COLORS.p2Red },
    perfect: { primary: COLORS.specialBlue, secondary: COLORS.p1Blue, tertiary: COLORS.neonPink },
    ready: { primary: COLORS.healthGreen, secondary: COLORS.healthGreenDark, tertiary: COLORS.specialBlue },
    round: { primary: '#FFFFFF', secondary: COLORS.chrome, tertiary: COLORS.chromeDark },
    combo: { primary: COLORS.neonPink, secondary: COLORS.neonPinkLight, tertiary: COLORS.p2Red },
  }

  const sizeMap = {
    sm: '0.875rem',
    md: '1.5rem',
    lg: '2.5rem',
    xl: '4rem',
  }

  const colors = colorMap[type]

  return (
    <span
      className="font-black tracking-[0.25em] uppercase"
      style={{
        fontSize: sizeMap[size],
        fontFamily: '"Impact", "Arial Black", sans-serif',
        color: colors.primary,
        textShadow: `
          0 0 10px ${colors.primary},
          0 0 20px ${colors.secondary},
          0 0 30px ${colors.tertiary}60,
          3px 3px 0 ${COLORS.arcadeBlack},
          -1px -1px 0 ${COLORS.arcadeBlack},
          1px -1px 0 ${COLORS.arcadeBlack},
          -1px 1px 0 ${COLORS.arcadeBlack}
        `,
        WebkitTextStroke: size === 'xl' || size === 'lg' ? `2px ${COLORS.arcadeBlack}` : `1px ${COLORS.arcadeBlack}`,
      }}
    >
      {text}
    </span>
  )
}

// =============================================================================
// HEALTH BAR - SEGMENTED WITH GLOW
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

  // Determine color based on percentage
  const fillColor = percentage > 60 ? color : percentage > 30 ? COLORS.electricYellow : COLORS.p2Red

  return (
    <div
      className={`flex items-center gap-4 ${reverse ? 'flex-row-reverse' : ''}`}
      role="meter"
      aria-labelledby={id}
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={maxValue}
    >
      <span
        id={id}
        className="text-sm font-black tracking-wider w-28 uppercase"
        style={{
          fontFamily: '"Impact", "Arial Black", sans-serif',
          color,
          textAlign: reverse ? 'right' : 'left',
          textShadow: `0 0 8px ${color}80`,
        }}
      >
        {label}
      </span>

      <div
        className="flex-1 h-8 relative"
        style={{
          background: `linear-gradient(180deg, ${COLORS.arcadeBlack}, ${COLORS.arcadeGray}, ${COLORS.arcadeBlack})`,
          border: `3px solid ${color}80`,
          borderRadius: '2px',
          boxShadow: `inset 0 3px 10px rgba(0,0,0,0.9), 0 0 8px ${color}40`,
        }}
      >
        {/* Health fill - immediate, no animation */}
        <div
          className="absolute top-0 bottom-0"
          style={{
            left: reverse ? 'auto' : 0,
            right: reverse ? 0 : 'auto',
            width: `${percentage}%`,
            background: `linear-gradient(180deg, ${fillColor}, ${fillColor}cc, ${fillColor}88)`,
            boxShadow: `0 0 20px ${fillColor}99, inset 0 2px 0 rgba(255,255,255,0.5)`,
          }}
        />

        {/* Segment dividers - 10 segments */}
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0 w-0.5"
            aria-hidden="true"
            style={{
              left: `${(i + 1) * 10}%`,
              background: 'rgba(0,0,0,0.6)',
            }}
          />
        ))}

        {/* Top shine highlight */}
        <div
          className="absolute inset-x-0 top-0 h-1/3 opacity-40"
          aria-hidden="true"
          style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.5), transparent)' }}
        />
      </div>

      <span
        className="text-sm font-black w-14 tabular-nums"
        style={{
          fontFamily: '"Impact", "Arial Black", sans-serif',
          color: fillColor,
          textShadow: `0 0 8px ${fillColor}`,
        }}
      >
        {value}%
      </span>
    </div>
  )
}

// =============================================================================
// COMBO COUNTER - HIT NUMBERS
// =============================================================================
function ComboCounter({ hits, label }: { hits: number; label: string }) {
  return (
    <div
      className="inline-flex items-center gap-3 px-4 py-2"
      role="status"
      aria-label={`${hits} ${label}`}
      style={{
        background: `linear-gradient(180deg, rgba(0,0,0,0.9), rgba(0,0,0,0.7))`,
        border: `3px solid ${COLORS.neonPink}`,
        borderRadius: '4px',
        boxShadow: `0 0 15px ${COLORS.neonPink}60, inset 0 0 20px rgba(0,0,0,0.5)`,
      }}
    >
      <span
        className="text-4xl font-black tabular-nums"
        style={{
          fontFamily: '"Impact", "Arial Black", sans-serif',
          color: COLORS.gold,
          textShadow: `0 0 10px ${COLORS.gold}, 0 0 20px ${COLORS.orange}`,
        }}
      >
        {hits}
      </span>
      <div className="flex flex-col">
        <span
          className="text-xs tracking-[0.3em] uppercase"
          style={{ color: COLORS.neonPink }}
        >
          {label}
        </span>
        <ArcadeText text="HITS!" type="combo" size="sm" />
      </div>
    </div>
  )
}

// =============================================================================
// SPECIAL MOVE INPUT DISPLAY - ARCADE JOYSTICK NOTATION
// =============================================================================
function SpecialMoveInput({ name, input }: { name: string; input: string }) {
  // Parse input notation
  const renderInput = (notation: string) => {
    const parts = notation.split(/([↓↑←→]|[PKL])/g).filter(Boolean)

    return parts.map((char, i) => {
      const isDirection = ['↓', '↑', '←', '→'].includes(char)
      const isButton = ['P', 'K', 'L'].includes(char)

      if (isDirection) {
        return (
          <span
            key={i}
            className="inline-flex items-center justify-center w-7 h-7 text-sm font-bold"
            style={{
              background: `radial-gradient(circle at 40% 35%, ${COLORS.arcadeGray}, ${COLORS.arcadeBlack})`,
              border: `2px solid ${COLORS.chromeDark}`,
              borderRadius: '50%',
              boxShadow: 'inset 0 2px 3px rgba(255,255,255,0.2), 0 2px 4px rgba(0,0,0,0.5)',
              color: COLORS.electricYellow,
            }}
          >
            {char}
          </span>
        )
      }

      if (isButton) {
        const buttonColor = char === 'P' ? COLORS.p1Blue : char === 'K' ? COLORS.p2Red : COLORS.healthGreen
        return (
          <span
            key={i}
            className="inline-flex items-center justify-center w-7 h-7 text-sm font-black"
            style={{
              background: `radial-gradient(circle at 40% 35%, ${buttonColor}, ${buttonColor}cc)`,
              border: `2px solid ${COLORS.arcadeGray}`,
              borderRadius: '50%',
              boxShadow: `inset 0 2px 3px rgba(255,255,255,0.4), 0 0 8px ${buttonColor}60`,
              color: '#FFF',
              textShadow: '0 1px 2px rgba(0,0,0,0.5)',
            }}
          >
            {char}
          </span>
        )
      }

      return (
        <span key={i} className="text-xs" style={{ color: COLORS.chrome }}>
          {char}
        </span>
      )
    })
  }

  return (
    <div
      className="flex items-center justify-between px-4 py-3 group"
      style={{
        background: `linear-gradient(90deg, ${COLORS.arcadeGray}cc, ${COLORS.arcadeGray}60)`,
        borderLeft: `4px solid ${COLORS.specialBlue}`,
        borderBottom: `1px solid ${COLORS.arcadeGray}`,
      }}
    >
      <span
        className="text-sm font-medium"
        style={{ color: COLORS.chrome }}
      >
        {name}
      </span>
      <div className="flex gap-1 items-center">{renderInput(input)}</div>
    </div>
  )
}

// =============================================================================
// ROUND INDICATORS - WIN DOTS
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
          className="w-5 h-5 rounded-full"
          aria-hidden="true"
          style={{
            background: i < wins
              ? `radial-gradient(circle at 40% 35%, ${COLORS.gold}, ${COLORS.orange})`
              : COLORS.arcadeGray,
            boxShadow: i < wins
              ? `0 0 12px ${COLORS.gold}, 0 0 24px ${COLORS.orange}60`
              : 'inset 0 2px 4px rgba(0,0,0,0.5)',
            border: `2px solid ${COLORS.chromeDark}`,
          }}
        />
      ))}
    </div>
  )
}

// =============================================================================
// PLAYER INDICATOR (P1/P2 TAG)
// =============================================================================
function PlayerIndicator({ player, side }: { player: 1 | 2; side: 'left' | 'right' }) {
  const color = player === 1 ? COLORS.p1Blue : COLORS.p2Red

  return (
    <div
      className={`absolute -top-10 ${side === 'left' ? 'left-4' : 'right-4'} px-4 py-1.5`}
      aria-label={`Player ${player}`}
      style={{
        background: `linear-gradient(180deg, ${color}, ${color}dd)`,
        border: `3px solid ${COLORS.arcadeBlack}`,
        borderRadius: '2px',
        boxShadow: `0 0 15px ${color}80, 0 4px 8px rgba(0,0,0,0.5)`,
        clipPath: 'polygon(10% 0, 90% 0, 100% 100%, 0 100%)',
      }}
    >
      <span
        className="text-sm font-black tracking-widest"
        style={{
          fontFamily: '"Impact", "Arial Black", sans-serif',
          color: '#FFF',
          textShadow: '0 2px 4px rgba(0,0,0,0.5)',
        }}
      >
        {player}P
      </span>
    </div>
  )
}

// =============================================================================
// CHARACTER PORTRAIT - NEON FRAME, DRAMATIC SELECTION
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
  const playerColor = playerNum === 1 ? COLORS.p1Blue : COLORS.p2Red

  return (
    <button
      onClick={onClick}
      aria-pressed={isSelected}
      aria-label={`Select ${name} - ${subtitle}. ${achievements.join('. ')}. Win record: ${winRecord.wins} wins, ${winRecord.losses} losses.`}
      className={`relative p-6 focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 transition-all duration-150 ${
        isSelected ? 'scale-105 z-10' : 'opacity-60 hover:opacity-100'
      }`}
      style={{
        background: isSelected
          ? `linear-gradient(${side === 'left' ? '135deg' : '-135deg'}, ${playerColor}60, ${COLORS.arcadeBlack}80)`
          : metallicTexture,
        border: `4px solid ${isSelected ? playerColor : COLORS.chromeDark}`,
        clipPath:
          side === 'left'
            ? 'polygon(0 0, 100% 0, 92% 100%, 0 100%)'
            : 'polygon(8% 0, 100% 0, 100% 100%, 0 100%)',
        boxShadow: isSelected
          ? `
            0 0 40px ${playerColor}99,
            0 0 80px ${playerColor}40,
            inset 0 0 30px ${playerColor}30
          `
          : `
            inset 0 2px 4px rgba(255,255,255,0.1),
            inset 0 -2px 4px rgba(0,0,0,0.5),
            0 4px 12px rgba(0,0,0,0.4)
          `,
        minWidth: '200px',
      }}
    >
      {/* Player indicator when selected */}
      {isSelected && <PlayerIndicator player={playerNum} side={side} />}

      {/* Animated neon border when selected */}
      {isSelected && (
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            border: `2px solid ${playerColor}`,
            clipPath:
              side === 'left'
                ? 'polygon(0 0, 100% 0, 92% 100%, 0 100%)'
                : 'polygon(8% 0, 100% 0, 100% 100%, 0 100%)',
            boxShadow: `inset 0 0 20px ${playerColor}80`,
          }}
        />
      )}

      {/* Character icon with glow */}
      <div
        className="text-8xl mb-4"
        style={{
          filter: isSelected ? `drop-shadow(0 0 30px ${playerColor})` : 'none',
        }}
      >
        {icon}
      </div>

      {/* Name plate - hexagonal arcade style */}
      <div
        className="py-2 -mx-6 px-6"
        style={{
          background: isSelected
            ? `linear-gradient(90deg, ${playerColor}, ${playerColor}dd)`
            : `linear-gradient(90deg, ${COLORS.chromeDark}80, ${COLORS.chrome}99)`,
          clipPath: 'polygon(5% 0, 95% 0, 100% 50%, 95% 100%, 5% 100%, 0 50%)',
        }}
      >
        <div
          className="text-sm font-black tracking-[0.2em] uppercase"
          style={{
            fontFamily: '"Impact", "Arial Black", sans-serif',
            color: isSelected ? '#000' : '#FFF',
            textShadow: isSelected ? 'none' : '0 2px 4px rgba(0,0,0,0.5)',
          }}
        >
          {name}
        </div>
        <div
          className="text-sm opacity-90"
          style={{ color: isSelected ? COLORS.arcadeGray : COLORS.chrome }}
        >
          {subtitle}
        </div>
      </div>

      {/* Win/Loss record with K.O. styling */}
      <div
        className="mt-4 py-2 flex items-center justify-center gap-4"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.6), transparent)',
        }}
      >
        <span
          className="text-sm font-black tracking-wider"
          style={{ color: COLORS.healthGreen, textShadow: `0 0 8px ${COLORS.healthGreen}` }}
        >
          W:{winRecord.wins}
        </span>
        <ArcadeText text="K.O." type="ko" size="sm" />
        <span
          className="text-sm font-black tracking-wider"
          style={{ color: COLORS.p2Red, textShadow: `0 0 8px ${COLORS.p2Red}` }}
        >
          L:{winRecord.losses}
        </span>
      </div>

      {/* Achievements - impact statements */}
      <div className="mt-4 space-y-1.5">
        {achievements.slice(0, 3).map((achievement, i) => (
          <div
            key={i}
            className="text-sm px-3 py-1.5 text-left"
            style={{
              background: `${playerColor}20`,
              borderLeft: `3px solid ${playerColor}`,
              color: COLORS.chrome,
            }}
          >
            {achievement}
          </div>
        ))}
      </div>

      {/* Selection arrow when selected */}
      {isSelected && (
        <div
          className="absolute -top-4 left-1/2 -translate-x-1/2 text-3xl"
          aria-hidden="true"
          style={{
            color: playerColor,
            filter: `drop-shadow(0 0 10px ${playerColor})`,
          }}
        >
          ▼
        </div>
      )}

      {/* Round win indicators */}
      <div className="mt-4">
        <RoundIndicators wins={Math.min(winRecord.wins, 2)} maxWins={2} side={side} />
      </div>
    </button>
  )
}

// =============================================================================
// FIGHT! ANNOUNCEMENT BANNER
// =============================================================================
function FightBanner({ text, ready = false }: { text: string; ready?: boolean }) {
  const reducedMotion = useReducedMotion()

  return (
    <div
      className="text-center py-6 relative overflow-hidden"
      role="status"
      aria-live="polite"
      style={{
        background: lightningPattern,
      }}
    >
      {/* Electric sparks */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: `
            radial-gradient(circle at 20% 50%, ${COLORS.electricYellow}20 0%, transparent 20%),
            radial-gradient(circle at 80% 50%, ${COLORS.electricYellow}20 0%, transparent 20%)
          `,
        }}
      />

      <div className={`inline-block ${!reducedMotion && ready ? 'animate-ready-pulse' : ''}`}>
        <ArcadeText text={text} type={ready ? 'ready' : 'fight'} size="xl" />
      </div>
    </div>
  )
}

// =============================================================================
// ROLE RANK DISPLAY - CHAMPIONSHIP BELT STYLE
// =============================================================================
function RoleRank({ role }: { role: (typeof CURRENT_ROLES)[0] }) {
  const isLeadership = role.type === 'leadership'
  const color = isLeadership ? COLORS.gold : COLORS.specialBlue

  return (
    <div
      className="relative px-6 py-4 text-center"
      role="listitem"
      style={{
        background: isLeadership
          ? `linear-gradient(180deg, ${COLORS.gold}50, ${COLORS.gold}20, transparent)`
          : metallicTexture,
        border: `3px solid ${color}`,
        clipPath: 'polygon(15% 0, 85% 0, 100% 50%, 85% 100%, 15% 100%, 0 50%)',
        boxShadow: `
          0 0 20px ${color}50,
          inset 0 2px 4px rgba(255,255,255,0.1),
          0 4px 12px rgba(0,0,0,0.4)
        `,
      }}
    >
      {/* Championship star for leadership */}
      {isLeadership && (
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 text-xl"
          aria-hidden="true"
          style={{
            color: COLORS.gold,
            textShadow: `0 0 10px ${COLORS.gold}, 0 0 20px ${COLORS.orange}`,
          }}
        >
          ★
        </div>
      )}

      <div
        className="text-sm tracking-[0.25em] uppercase font-black"
        style={{
          fontFamily: '"Impact", "Arial Black", sans-serif',
          color,
          textShadow: `0 0 8px ${color}60`,
        }}
      >
        {role.title}
      </div>
      <div
        className="text-sm font-bold mt-1"
        style={{
          color: '#FFF',
          textShadow: '0 2px 4px rgba(0,0,0,0.6)',
        }}
      >
        {role.company}
      </div>
    </div>
  )
}

// =============================================================================
// TEAM CARD (VENTURES/COMPANIES)
// =============================================================================
function TeamCard({ company }: { company: (typeof COMPANIES)[0] }) {
  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Visit ${company.name} - ${company.tagline}`}
      className="block focus:outline-none focus-visible:ring-4 transition-transform hover:scale-[1.02]"
    >
      <div
        className="relative p-5"
        style={{
          background: metallicTexture,
          border: `3px solid ${COLORS.specialBlue}`,
          borderRadius: '4px',
          boxShadow: `0 0 15px ${COLORS.specialBlue}40, inset 0 0 20px rgba(0,0,0,0.5)`,
        }}
      >
        {/* CRT scanlines */}
        <div
          className="absolute inset-0 pointer-events-none opacity-25"
          aria-hidden="true"
          style={{ background: crtScanlines }}
        />

        <div className="flex items-center gap-4 relative">
          <span className="text-4xl" aria-hidden="true">{company.icon}</span>
          <div>
            <h4
              className="text-base font-black tracking-wide uppercase"
              style={{
                fontFamily: '"Impact", "Arial Black", sans-serif',
                color: '#FFF',
                textShadow: `0 0 10px ${COLORS.specialBlue}60`,
              }}
            >
              {company.name}
            </h4>
            <p
              className="text-sm tracking-wider"
              style={{ color: COLORS.specialBlue }}
            >
              {company.tagline}
            </p>
          </div>
        </div>

        <p
          className="text-sm mt-4 leading-relaxed relative"
          style={{ color: COLORS.chrome }}
        >
          {company.description}
        </p>

        <div className="flex flex-wrap gap-2 mt-4 relative">
          {company.services.slice(0, 3).map((service) => (
            <span
              key={service}
              className="text-sm px-3 py-1"
              style={{
                background: `${COLORS.specialBlue}25`,
                border: `1px solid ${COLORS.specialBlue}50`,
                borderRadius: '2px',
                color: COLORS.specialBlue,
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
  const bandColor = COLORS.neonPink

  const content = (
    <div
      className="relative p-5"
      style={{
        background: metallicTexture,
        border: `3px solid ${bandColor}`,
        borderRadius: '4px',
        boxShadow: `0 0 15px ${bandColor}40, inset 0 0 20px rgba(0,0,0,0.5)`,
      }}
    >
      {/* CRT scanlines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        aria-hidden="true"
        style={{ background: crtScanlines }}
      />

      <div className="flex justify-between items-start relative">
        <h4
          className="text-base font-black tracking-wide uppercase"
          style={{
            fontFamily: '"Impact", "Arial Black", sans-serif',
            color: '#FFF',
            textShadow: `0 0 10px ${bandColor}60`,
          }}
        >
          {band.name}
        </h4>
        {band.active && (
          <span
            className="text-sm px-3 py-1 font-black tracking-wider"
            style={{
              background: COLORS.healthGreen,
              color: '#000',
              borderRadius: '2px',
              boxShadow: `0 0 10px ${COLORS.healthGreen}`,
            }}
          >
            LIVE
          </span>
        )}
      </div>

      <p className="text-sm mt-2 relative" style={{ color: bandColor }}>
        {band.genre} // {band.role}
      </p>

      <p className="text-sm mt-3 leading-relaxed relative" style={{ color: COLORS.chrome }}>
        {band.description}
      </p>

      {!band.url && (
        <p className="text-sm mt-3 italic relative" style={{ color: COLORS.chromeDark }}>
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
        className="block focus:outline-none focus-visible:ring-4 transition-transform hover:scale-[1.02]"
      >
        {content}
      </a>
    )
  }

  return <div role="article">{content}</div>
}

// =============================================================================
// EXPERIENCE CARD - FIGHT RECORD STYLE
// =============================================================================
function ExperienceCard({ entry }: { entry: (typeof EXPERIENCE_DATA)[0] }) {
  const endDisplay = entry.endDate ? new Date(entry.endDate).getFullYear() : 'NOW'
  const startDisplay = new Date(entry.startDate).getFullYear()
  const isActive = !entry.endDate
  const color = isActive ? COLORS.healthGreen : COLORS.specialBlue

  return (
    <article
      className="relative"
      style={{
        background: metallicTexture,
        border: `3px solid ${color}`,
        clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%)',
        boxShadow: `0 0 20px ${color}40, inset 0 0 20px rgba(0,0,0,0.5)`,
      }}
    >
      <div className="p-5 relative">
        {/* CRT scanlines */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          aria-hidden="true"
          style={{ background: crtScanlines }}
        />

        {/* Header */}
        <div className="flex justify-between items-start mb-4 relative">
          <div>
            <h4
              className="text-base font-black uppercase"
              style={{
                fontFamily: '"Impact", "Arial Black", sans-serif',
                color: '#FFF',
              }}
            >
              {entry.title}
            </h4>
            <p className="text-sm tracking-wider" style={{ color }}>
              {entry.organization}
            </p>
          </div>
          <span
            className="text-sm px-4 py-1.5 font-black tracking-wider"
            style={{
              background: isActive ? `linear-gradient(90deg, ${COLORS.healthGreen}, ${COLORS.healthGreenDark})` : COLORS.chromeDark,
              color: isActive ? '#000' : '#FFF',
              borderRadius: '2px',
              boxShadow: isActive ? `0 0 12px ${COLORS.healthGreen}80` : 'none',
            }}
          >
            {startDisplay} - {endDisplay}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm mb-4 leading-relaxed relative" style={{ color: COLORS.chrome }}>
          {entry.description}
        </p>

        {/* Highlights with K.O. markers */}
        {entry.highlights && entry.highlights.length > 0 && (
          <ul className="space-y-2 mb-4 relative" role="list">
            {entry.highlights.map((highlight, i) => (
              <li
                key={i}
                className="text-sm flex items-start gap-3"
                style={{ color: '#FFF' }}
              >
                <ArcadeText text="HIT" type="combo" size="sm" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Skills/tech tags */}
        <div className="flex flex-wrap gap-2 relative">
          {entry.skills.slice(0, 5).map((skill) => (
            <span
              key={skill}
              className="text-sm px-3 py-1"
              style={{
                background: `${color}25`,
                border: `1px solid ${color}40`,
                borderRadius: '2px',
                color,
              }}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Corner cut decoration */}
      <div
        className="absolute bottom-0 right-0 w-6 h-6"
        aria-hidden="true"
        style={{
          background: `linear-gradient(135deg, ${color}, ${COLORS.gold})`,
          clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
        }}
      />
    </article>
  )
}

// =============================================================================
// PROJECT CARD - CHAMPIONSHIP VICTORY STYLE
// =============================================================================
function FightCard({ project }: { project: (typeof PROJECTS_DATA)[0] }) {
  const isFeatured = project.featured
  const color = isFeatured ? COLORS.gold : COLORS.specialBlue

  return (
    <article
      className="relative"
      style={{
        background: metallicTexture,
        border: `3px solid ${color}`,
        clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%)',
        boxShadow: isFeatured
          ? `0 0 30px ${COLORS.gold}60, inset 0 0 25px ${COLORS.gold}15`
          : `0 0 15px ${color}30, inset 0 0 20px rgba(0,0,0,0.5)`,
      }}
    >
      <div className="p-5 relative">
        {/* CRT scanlines */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          aria-hidden="true"
          style={{ background: crtScanlines }}
        />

        {/* Header */}
        <div className="flex justify-between items-start mb-3 relative">
          <h4
            className="text-base font-black tracking-wide uppercase"
            style={{
              fontFamily: '"Impact", "Arial Black", sans-serif',
              color: isFeatured ? COLORS.gold : '#FFF',
              textShadow: isFeatured ? `0 0 12px ${COLORS.gold}` : 'none',
            }}
          >
            {project.name}
          </h4>
          {isFeatured && (
            <span
              className="px-3 py-1.5 font-black tracking-[0.2em]"
              style={{
                background: `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.orange})`,
                color: '#000',
                borderRadius: '2px',
                boxShadow: `0 0 15px ${COLORS.gold}80`,
              }}
            >
              <ArcadeText text="CHAMP" type="ko" size="sm" />
            </span>
          )}
        </div>

        {/* Tagline */}
        <p className="text-sm mb-3 relative" style={{ color: COLORS.chrome }}>
          {project.tagline}
        </p>

        {/* Impact statement with K.O. styling */}
        {project.impact && (
          <div
            className="text-sm py-2.5 px-4 mb-4 relative flex items-start gap-2"
            style={{
              background: `linear-gradient(90deg, ${color}25, transparent)`,
              borderLeft: `4px solid ${color}`,
            }}
          >
            <ArcadeText text="K.O.:" type="ko" size="sm" />
            <span style={{ color }}>{project.impact}</span>
          </div>
        )}

        {/* Tech stack */}
        <div className="flex flex-wrap gap-2 relative">
          {project.techStack.slice(0, 5).map((tech) => (
            <span
              key={tech}
              className="text-sm px-3 py-1"
              style={{
                background: `${color}20`,
                border: `1px solid ${color}35`,
                borderRadius: '2px',
                color,
              }}
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Links */}
        {project.links && (
          <div className="flex gap-3 mt-4 relative">
            {project.links.site && (
              <a
                href={project.links.site}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm px-4 py-2 font-black tracking-wider focus:outline-none focus-visible:ring-2 transition-transform hover:scale-105"
                style={{
                  background: color,
                  color: '#000',
                  borderRadius: '2px',
                  boxShadow: `0 0 12px ${color}80`,
                }}
                aria-label={`Visit ${project.name} website`}
              >
                VIEW
              </a>
            )}
            {project.links.demo && (
              <Link
                href={project.links.demo}
                className="text-sm px-4 py-2 font-black tracking-wider focus:outline-none focus-visible:ring-2 transition-transform hover:scale-105"
                style={{
                  background: COLORS.healthGreen,
                  color: '#000',
                  borderRadius: '2px',
                  boxShadow: `0 0 12px ${COLORS.healthGreen}80`,
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
        className="absolute bottom-0 right-0 w-6 h-6"
        aria-hidden="true"
        style={{
          background: color,
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
  return (
    <div className="space-y-3">
      <h4
        className="text-sm font-black tracking-[0.2em] uppercase flex items-center gap-3"
        style={{
          fontFamily: '"Impact", "Arial Black", sans-serif',
          color: '#FFF',
          textShadow: `0 0 8px ${COLORS.specialBlue}60`,
        }}
      >
        <span aria-hidden="true">{category.icon}</span>
        {category.name}
      </h4>
      <div className="space-y-2">
        {category.skills.map((skill) => (
          <div
            key={skill.name}
            className="px-3 py-2 text-sm"
            style={{
              background: `${COLORS.specialBlue}15`,
              borderLeft: `3px solid ${COLORS.specialBlue}`,
              color: COLORS.chrome,
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
// ART SEPARATOR - ARCADE DECORATIVE ELEMENT
// =============================================================================
function ArtSeparator({ type = 'lightning' }: { type?: 'lightning' | 'versus' | 'flames' }) {
  if (type === 'versus') {
    return (
      <div className="flex justify-center items-center py-8">
        <VSBadge large />
      </div>
    )
  }

  if (type === 'flames') {
    return (
      <div
        className="h-16 my-8 relative overflow-hidden"
        aria-hidden="true"
        style={{
          background: `
            linear-gradient(90deg, transparent, ${COLORS.p2Red}30, ${COLORS.orange}30, ${COLORS.electricYellow}30, ${COLORS.orange}30, ${COLORS.p2Red}30, transparent)
          `,
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: `
              repeating-linear-gradient(90deg,
                transparent 0px,
                transparent 40px,
                ${COLORS.p2Red}20 40px,
                ${COLORS.p2Red}20 42px
              )
            `,
          }}
        />
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center">
          <span
            className="text-2xl tracking-[1em]"
            style={{
              color: COLORS.electricYellow,
              textShadow: `0 0 20px ${COLORS.orange}`,
            }}
          >
            ★ ★ ★
          </span>
        </div>
      </div>
    )
  }

  // Default: lightning
  return (
    <div
      className="h-12 my-8 relative"
      aria-hidden="true"
      style={{
        background: `linear-gradient(90deg, transparent, ${COLORS.electricYellow}20, transparent)`,
      }}
    >
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1000 50"
        preserveAspectRatio="none"
      >
        <path
          d="M0 25 L200 25 L220 10 L240 40 L260 10 L280 40 L300 10 L320 40 L340 25 L500 25 L520 10 L540 40 L560 10 L580 40 L600 10 L620 40 L640 25 L800 25 L820 10 L840 40 L860 10 L880 40 L900 10 L920 40 L940 25 L1000 25"
          fill="none"
          stroke={COLORS.electricYellow}
          strokeWidth="2"
          style={{ filter: `drop-shadow(0 0 8px ${COLORS.electricYellow})` }}
        />
      </svg>
    </div>
  )
}

// =============================================================================
// INSERT COIN FOOTER
// =============================================================================
function InsertCoinFooter() {
  const reducedMotion = useReducedMotion()

  return (
    <footer className="relative z-20 py-12 text-center">
      <p
        className="text-sm tracking-[0.4em] uppercase"
        style={{
          fontFamily: '"Impact", "Arial Black", sans-serif',
          color: COLORS.chromeDark,
        }}
      >
        PRESS START TO CONTINUE
      </p>

      <p
        className="text-sm mt-4 tracking-[0.3em]"
        style={{
          color: COLORS.specialBlue,
          textShadow: `0 0 10px ${COLORS.specialBlue}`,
        }}
      >
        MMXXVI ALEXANDER PULIDO
      </p>

      {/* Insert coin slot */}
      <div
        className="mt-6 inline-flex items-center gap-4 px-8 py-4"
        aria-hidden="true"
        style={{
          background: metallicTexture,
          border: `3px solid ${COLORS.chromeDark}`,
          borderRadius: '4px',
          boxShadow: 'inset 0 3px 8px rgba(0,0,0,0.7), 0 4px 12px rgba(0,0,0,0.4)',
        }}
      >
        {/* Worn coin slot */}
        <div
          className="w-16 h-3"
          style={{
            background: `linear-gradient(180deg, ${COLORS.arcadeBlack}, #050505)`,
            border: `2px solid ${COLORS.chromeDarker}`,
            borderRadius: '4px',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.9)',
          }}
        />
        <span
          className="text-sm tracking-[0.3em] uppercase"
          style={{
            fontFamily: '"Impact", "Arial Black", sans-serif',
            color: COLORS.chromeDark,
          }}
        >
          INSERT COIN
        </span>
        <span
          className={`text-2xl ${!reducedMotion ? 'animate-blink' : ''}`}
          style={{
            color: COLORS.gold,
            textShadow: `0 0 15px ${COLORS.gold}`,
          }}
        >
          ●
        </span>
      </div>
    </footer>
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
      name: 'SYSTEM ENGINEER',
      subtitle: 'Senior Staff • CTO',
      achievements: ['10+ years experience', 'CTO x 2', 'Enterprise scale', '50k+ users migrated'],
      winRecord: { wins: 999, losses: 0 },
    },
    {
      id: 'drummer',
      icon: '🥁',
      name: 'MUSICIAN',
      subtitle: 'Professional Drummer',
      achievements: ['15 years playing', '7 years professional', '3 active bands', '30+ city tour'],
      winRecord: { wins: 15, losses: 0 },
    },
    {
      id: 'fighter',
      icon: '🥋',
      name: 'MARTIAL ARTIST',
      subtitle: 'BJJ Instructor',
      achievements: ['6 years training', 'BJJ Instructor', '20+ students', '3 disciplines'],
      winRecord: { wins: 6, losses: 0 },
    },
  ]

  // Special move inputs for engineer character
  const specialMoves = [
    { name: 'Deploy to Prod', input: '↓→P' },
    { name: 'Debug Master', input: '←↓→K' },
    { name: 'Code Review', input: '↓↓P' },
    { name: 'Ship Feature', input: '→→P' },
  ]

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: `radial-gradient(ellipse at center, #1a1a3e 0%, ${COLORS.arcadeBlack} 50%, #050510 100%)`,
        fontFamily: '"Impact", "Arial Black", sans-serif',
      }}
    >
      {/* Global CRT effects */}
      <div
        className="fixed inset-0 pointer-events-none z-[100]"
        aria-hidden="true"
        style={{ background: crtScanlines, opacity: 0.35 }}
      />
      <div
        className="fixed inset-0 pointer-events-none z-[99]"
        aria-hidden="true"
        style={{ background: screenVignette }}
      />
      <div
        className="fixed inset-0 pointer-events-none z-0"
        aria-hidden="true"
        style={{ background: screenGlow }}
      />

      <div className="relative z-10">
        {/* ================================================================= */}
        {/* HEADER */}
        {/* ================================================================= */}
        <header className="relative py-8 px-6">
          <div className="max-w-6xl mx-auto">
            <ArcadeSectionCard color={COLORS.p1Blue}>
              <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
                <div>
                  {/* Main title - dramatic arcade styling */}
                  <h1
                    className="text-3xl md:text-5xl tracking-[0.15em] uppercase leading-tight"
                    style={{
                      color: COLORS.electricYellow,
                      textShadow: `
                        0 0 10px ${COLORS.electricYellow},
                        0 0 20px ${COLORS.orange},
                        0 0 40px ${COLORS.p2Red}60,
                        4px 4px 0 ${COLORS.arcadeBlack},
                        -2px -2px 0 ${COLORS.arcadeBlack}
                      `,
                      WebkitTextStroke: `2px ${COLORS.arcadeBlack}`,
                    }}
                  >
                    SELECT YOUR FIGHTER
                  </h1>

                  {/* Professional summary */}
                  <p
                    className="text-base md:text-lg mt-4 tracking-wide max-w-2xl"
                    style={{
                      color: COLORS.chrome,
                      fontFamily: 'system-ui, sans-serif',
                    }}
                  >
                    {PROFESSIONAL_SUMMARY.headline}
                  </p>
                  <p
                    className="text-sm md:text-base mt-2 italic tracking-wider"
                    style={{ color: COLORS.specialBlue }}
                  >
                    &quot;{PROFESSIONAL_SUMMARY.tagline}&quot;
                  </p>

                  {/* Combo counter - years of experience */}
                  <div className="mt-6">
                    <ComboCounter hits={10} label="YEARS EXP" />
                  </div>
                </div>

                <nav className="flex gap-4 items-center shrink-0" aria-label="Main navigation">
                  <Link
                    href="/cv"
                    className="px-6 py-3 text-sm tracking-[0.2em] font-black uppercase focus:outline-none focus-visible:ring-4 transition-transform hover:scale-105"
                    style={{
                      background: metallicTexture,
                      border: `3px solid ${COLORS.chromeDark}`,
                      borderRadius: '4px',
                      color: COLORS.chrome,
                      clipPath: 'polygon(10% 0, 100% 0, 100% 100%, 0 100%)',
                      boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.1), 0 4px 8px rgba(0,0,0,0.4)',
                    }}
                  >
                    CV
                  </Link>
                  <Link
                    href="/personal-projects/game-engine"
                    className="px-6 py-3 text-sm tracking-[0.2em] font-black uppercase focus:outline-none focus-visible:ring-4 transition-transform hover:scale-105"
                    style={{
                      background: `linear-gradient(90deg, ${COLORS.healthGreen}, ${COLORS.healthGreenDark})`,
                      color: '#000',
                      borderRadius: '4px',
                      clipPath: 'polygon(0 0, 100% 0, 90% 100%, 0 100%)',
                      boxShadow: `0 0 20px ${COLORS.healthGreen}60`,
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

        <main className="max-w-6xl mx-auto px-6">
          {/* ================================================================= */}
          {/* ABOUT SECTION (with Character Select integrated) */}
          {/* ================================================================= */}
          <ArcadeSectionCard
            color={COLORS.specialBlue}
            title="About"
            titleIcon="►"
            id="about-heading"
          >
            {/* Current roles - championship belts */}
            <div className="flex flex-wrap justify-center gap-4 mb-8" role="list" aria-label="Current roles">
              {CURRENT_ROLES.map((role) => (
                <RoleRank key={role.id} role={role} />
              ))}
            </div>

            {/* Character portraits - profession switching */}
            <div
              className="flex items-center justify-center gap-4 lg:gap-8 mb-8 flex-wrap"
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
                    <div className="mx-2 lg:mx-6 hidden md:block">
                      <VSBadge />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Health bars */}
            <div className="max-w-3xl mx-auto mb-8 space-y-4">
              <HealthBar
                label="Experience"
                value={active === 'engineer' ? 95 : active === 'drummer' ? 80 : 60}
                color={COLORS.p1Blue}
              />
              <HealthBar
                label="Mastery"
                value={active === 'engineer' ? 90 : active === 'drummer' ? 85 : 70}
                color={COLORS.gold}
              />
              <HealthBar
                label="Power"
                value={active === 'engineer' ? 85 : active === 'drummer' ? 90 : 95}
                color={COLORS.p2Red}
              />
            </div>

            {/* Ready banner */}
            <FightBanner text={`${config.title.toUpperCase()} - READY!`} ready />

            {/* Bio and quick facts */}
            <div className="mt-8 pt-8" style={{ borderTop: `2px solid ${COLORS.specialBlue}40` }}>
              <p
                className="text-base leading-relaxed mb-6"
                style={{ color: COLORS.chrome, fontFamily: 'system-ui, sans-serif' }}
              >
                {aboutData.bio}
              </p>
              <div className="flex flex-wrap gap-3" role="list" aria-label="Quick facts">
                {aboutData.quickFacts.map((fact, i) => (
                  <span
                    key={i}
                    className="px-5 py-2 text-sm font-black tracking-wider uppercase"
                    style={{
                      background: `linear-gradient(90deg, ${COLORS.specialBlue}, ${COLORS.specialBlueDark})`,
                      color: '#000',
                      clipPath: 'polygon(8% 0, 100% 0, 92% 100%, 0 100%)',
                      boxShadow: `0 0 12px ${COLORS.specialBlue}60`,
                    }}
                  >
                    {fact}
                  </span>
                ))}
              </div>
            </div>
          </ArcadeSectionCard>

          {/* ================================================================= */}
          {/* ART SECTION 1: VS Badge separator (after About) */}
          {/* ================================================================= */}
          <ArtSeparator type="versus" />

          {/* ================================================================= */}
          {/* EXPERIENCE / FIGHT RECORD */}
          {/* ================================================================= */}
          {experience.length > 0 && (
            <ArcadeSectionCard
              color={COLORS.p1Blue}
              title="Work Experience"
              titleIcon="▶▶"
              id="experience-heading"
            >
              <div className="grid md:grid-cols-2 gap-6">
                {experience.map((entry) => (
                  <ExperienceCard key={entry.id} entry={entry} />
                ))}
              </div>
            </ArcadeSectionCard>
          )}

          {/* ================================================================= */}
          {/* ART SECTION 2: Lightning separator (after Experience) */}
          {/* ================================================================= */}
          <ArtSeparator type="lightning" />

          {/* ================================================================= */}
          {/* SKILLS / SPECIAL MOVES */}
          {/* ================================================================= */}
          <ArcadeSectionCard
            color={active === 'engineer' ? COLORS.specialBlue : active === 'drummer' ? COLORS.neonPink : COLORS.orange}
            title={active === 'engineer' ? 'Tech Stack' : 'Skills'}
            titleIcon="▶▶▶"
            id="skills-heading"
          >
            {active === 'engineer' ? (
              <div className="space-y-8">
                {/* Special move inputs */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
                  {specialMoves.map((move) => (
                    <SpecialMoveInput key={move.name} name={move.name} input={move.input} />
                  ))}
                </div>

                {/* Tech categories */}
                {engineerTech.slice(0, 6).map((category) => (
                  <div key={category.name}>
                    <h3
                      className="text-base mb-4 flex items-center gap-3 tracking-[0.2em] uppercase"
                      style={{
                        fontFamily: '"Impact", "Arial Black", sans-serif',
                        color: '#FFF',
                        textShadow: `0 0 8px ${COLORS.specialBlue}60`,
                      }}
                    >
                      <span aria-hidden="true">{category.icon}</span>
                      {category.name}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                      {category.items.map((tech) => (
                        <div
                          key={tech}
                          className="px-3 py-2 text-sm"
                          style={{
                            background: `${COLORS.arcadeGray}cc`,
                            border: `1px solid ${COLORS.chromeDarker}`,
                            borderRadius: '2px',
                            color: COLORS.chrome,
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
              <div className="grid md:grid-cols-3 gap-8">
                {otherSkills.map((category) => (
                  <SkillSection key={category.name} category={category} />
                ))}
              </div>
            )}
          </ArcadeSectionCard>

          {/* ================================================================= */}
          {/* PROJECTS / CHAMPIONSHIP VICTORIES */}
          {/* ================================================================= */}
          <ArcadeSectionCard
            color={COLORS.gold}
            title="Projects"
            titleIcon="★"
            id="projects-heading"
          >
            <div className="grid md:grid-cols-2 gap-6">
              {projects.slice(0, 6).map((project) => (
                <FightCard key={project.id} project={project} />
              ))}
            </div>
          </ArcadeSectionCard>

          {/* ================================================================= */}
          {/* ART SECTION 3: Flames separator (after Projects) */}
          {/* ================================================================= */}
          <ArtSeparator type="flames" />

          {/* ================================================================= */}
          {/* VENTURES / TEAM AFFILIATIONS */}
          {/* ================================================================= */}
          {active === 'engineer' && (
            <ArcadeSectionCard
              color={COLORS.specialBlue}
              title="Companies"
              titleIcon="▶▶▶▶"
              id="ventures-heading"
            >
              <div className="grid md:grid-cols-3 gap-6">
                {COMPANIES.map((company) => (
                  <TeamCard key={company.id} company={company} />
                ))}
              </div>
            </ArcadeSectionCard>
          )}

          {/* ================================================================= */}
          {/* BANDS / STAGE CREWS */}
          {/* ================================================================= */}
          {active === 'drummer' && (
            <ArcadeSectionCard
              color={COLORS.neonPink}
              title="Bands"
              titleIcon="♪♪♪"
              id="bands-heading"
            >
              <div className="grid md:grid-cols-3 gap-6">
                {BANDS.map((band) => (
                  <BandCard key={band.id} band={band} />
                ))}
              </div>
            </ArcadeSectionCard>
          )}
        </main>

        {/* ================================================================= */}
        {/* CONTACT CTA */}
        {/* ================================================================= */}
        <section className="relative z-20 py-12 px-6" aria-label="Contact">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-6">
              <h2
                className="text-xl tracking-[0.3em] uppercase mb-2"
                style={{
                  fontFamily: '"Impact", "Arial Black", sans-serif',
                  color: COLORS.gold,
                  textShadow: `0 0 20px ${COLORS.gold}40`,
                }}
              >
                CHALLENGER APPROACHING?
              </h2>
              <p className="text-sm" style={{ color: COLORS.chromeLight }}>
                10+ years delivering production systems. Let&apos;s build something.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:alexanderpulido81@gmail.com"
                className="inline-flex items-center justify-center px-6 py-3 text-sm tracking-[0.2em] uppercase transition-all hover:scale-105 min-h-[44px] focus:outline-none focus-visible:ring-2"
                style={{
                  fontFamily: '"Impact", "Arial Black", sans-serif',
                  background: `linear-gradient(180deg, ${COLORS.gold}, ${COLORS.goldDark})`,
                  color: COLORS.arcadeBlack,
                  border: `2px solid ${COLORS.gold}`,
                  boxShadow: `0 0 15px ${COLORS.gold}40`,
                }}
              >
                GET IN TOUCH
              </a>
              <Link
                href="/cv"
                className="inline-flex items-center justify-center px-6 py-3 text-sm tracking-[0.2em] uppercase transition-all hover:scale-105 min-h-[44px] focus:outline-none focus-visible:ring-2"
                style={{
                  fontFamily: '"Impact", "Arial Black", sans-serif',
                  background: 'transparent',
                  border: `2px solid ${COLORS.specialBlue}`,
                  color: COLORS.specialBlue,
                  boxShadow: `0 0 10px ${COLORS.specialBlue}30`,
                }}
              >
                DOWNLOAD CV
              </Link>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* FOOTER */}
        {/* ================================================================= */}
        <InsertCoinFooter />
      </div>

      {/* ================================================================= */}
      {/* CSS ANIMATIONS */}
      {/* ================================================================= */}
      <style jsx global>{`
        @media (prefers-reduced-motion: reduce) {
          .animate-vs-pulse,
          .animate-ready-pulse,
          .animate-blink {
            animation: none !important;
          }
        }

        @keyframes vs-pulse {
          0%, 100% {
            transform: scale(1);
            filter: brightness(1);
          }
          50% {
            transform: scale(1.08);
            filter: brightness(1.3);
          }
        }

        @keyframes ready-pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.03);
          }
        }

        @keyframes blink {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.2;
          }
        }

        .animate-vs-pulse {
          animation: vs-pulse 1.5s ease-in-out infinite;
        }

        .animate-ready-pulse {
          animation: ready-pulse 2s ease-in-out infinite;
        }

        .animate-blink {
          animation: blink 0.8s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
