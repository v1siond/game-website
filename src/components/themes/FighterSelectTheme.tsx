'use client'

import Link from 'next/link'
import { useProfession } from '@/contexts/ProfessionContext'
import { ProfessionSwitch, type ProfessionOption } from '@/components/cv/ProfessionSwitch'
import { useCVData, useWorldView } from '@/components/cv/CVDataProvider'
import { RecruiterHero, type HeroActionSlot } from '@/components/cv/RecruiterHero'
import { ProjectList, type ProjectSlot } from '@/components/cv/ProjectList'
import { BandList, type BandSlot } from '@/components/cv/BandList'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import type { Profession } from '@/lib/cv/professions'
import type { CVData, Job } from '@/lib/cv/content'
import type { ProfessionSections } from '@/lib/cv/cvView'
import { useReducedMotion } from '@/hooks/useReducedMotion'

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
// One option of the shared profession switch. The picked fighter is player one.
// =============================================================================
const FIGHTER_ICONS: Record<Profession, string> = {
  drummer: '🥁',
  engineer: '💻',
  fighter: '🥊',
}

// The outer portraits lean towards the centre slot, like the two sides of a versus screen.
const FIGHTER_SIDES: Record<Profession, 'left' | 'right'> = {
  drummer: 'left',
  engineer: 'left',
  fighter: 'right',
}

function CharacterPortrait({ id, label, selected, optionProps }: ProfessionOption) {
  const playerColor = selected ? COLORS.p1Blue : COLORS.p2Red
  const side = FIGHTER_SIDES[id]
  const clipPath =
    side === 'left' ? 'polygon(0 0, 100% 0, 92% 100%, 0 100%)' : 'polygon(8% 0, 100% 0, 100% 100%, 0 100%)'

  return (
    <button
      type="button"
      {...optionProps}
      className={`relative px-3 pt-6 pb-4 sm:p-6 w-full sm:w-auto sm:min-w-[200px] focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 transition-all duration-150 ${
        selected ? 'scale-105 z-10' : 'opacity-70 hover:opacity-100'
      }`}
      style={{
        background: selected
          ? `linear-gradient(${side === 'left' ? '135deg' : '-135deg'}, ${playerColor}60, ${COLORS.arcadeBlack}80)`
          : metallicTexture,
        border: `4px solid ${selected ? playerColor : COLORS.chromeDark}`,
        clipPath,
        boxShadow: selected
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
      }}
    >
      {/* Player indicator when selected */}
      {selected && (
        <span aria-hidden="true">
          <PlayerIndicator player={1} side={side} />
        </span>
      )}

      {/* Animated neon border when selected */}
      {selected && (
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            border: `2px solid ${playerColor}`,
            clipPath,
            boxShadow: `inset 0 0 20px ${playerColor}80`,
          }}
        />
      )}

      {/* Character icon with glow */}
      <div
        className="text-5xl sm:text-8xl mb-4"
        aria-hidden="true"
        style={{
          filter: selected ? `drop-shadow(0 0 30px ${playerColor})` : 'none',
        }}
      >
        {FIGHTER_ICONS[id]}
      </div>

      {/* Name plate - hexagonal arcade style */}
      <div
        className="py-2 -mx-3 px-3 sm:-mx-6 sm:px-6"
        style={{
          background: selected
            ? `linear-gradient(90deg, ${playerColor}, ${playerColor}dd)`
            : `linear-gradient(90deg, ${COLORS.chromeDark}80, ${COLORS.chrome}99)`,
          clipPath: 'polygon(5% 0, 95% 0, 100% 50%, 95% 100%, 5% 100%, 0 50%)',
        }}
      >
        <div
          className="text-sm font-black tracking-[0.15em] sm:tracking-[0.2em] uppercase"
          style={{
            fontFamily: '"Impact", "Arial Black", sans-serif',
            color: selected ? '#000' : '#FFF',
            textShadow: selected ? 'none' : '0 2px 4px rgba(0,0,0,0.5)',
          }}
        >
          {label}
        </div>
      </div>

      {/* Selection arrow when selected */}
      {selected && (
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
// TEAM CARD (VENTURES/COMPANIES)
// =============================================================================
function TeamCard({ company }: { company: CVData['companies'][number] }) {
  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${company.name}: ${company.tagline} (opens in a new tab)`}
      className="block h-full focus:outline-none focus-visible:ring-4 transition-transform hover:scale-[1.02]"
    >
      <div
        className="relative p-5 h-full"
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
            <h3
              className="text-base font-black tracking-wide uppercase"
              style={{
                fontFamily: '"Impact", "Arial Black", sans-serif',
                color: '#FFF',
                textShadow: `0 0 10px ${COLORS.specialBlue}60`,
              }}
            >
              {company.name}
            </h3>
            <p className="text-sm tracking-wider" style={{ color: COLORS.specialBlue }}>
              {company.tagline}
            </p>
          </div>
        </div>

        <p className="text-sm mt-4 leading-relaxed relative" style={{ color: COLORS.chrome }}>
          {company.description}
        </p>
      </div>
    </a>
  )
}

// =============================================================================
// BAND CARD - his role, the years and the release
// =============================================================================
function BandCard({ band, years, linkProps }: BandSlot) {
  const bandColor = COLORS.neonPink

  const content = (
    <article
      className="relative p-5 h-full"
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

      <h3
        className="text-base font-black tracking-wide uppercase relative"
        style={{
          fontFamily: '"Impact", "Arial Black", sans-serif',
          color: '#FFF',
          textShadow: `0 0 10px ${bandColor}60`,
        }}
      >
        {band.name}
      </h3>

      <p className="text-sm mt-2 relative" style={{ color: bandColor }}>
        {band.role}
        {years && <span aria-hidden="true"> {'//'} </span>}
        {years && <span>{years}</span>}
      </p>

      {band.release && (
        <p className="text-sm mt-3 leading-relaxed relative" style={{ color: COLORS.chrome }}>
          Released <cite>&ldquo;{band.release}&rdquo;</cite>
        </p>
      )}
    </article>
  )

  if (!linkProps) return content
  return (
    <a
      {...linkProps}
      className="block h-full focus:outline-none focus-visible:ring-4 transition-transform hover:scale-[1.02]"
    >
      {content}
    </a>
  )
}

// =============================================================================
// EXPERIENCE CARD - FIGHT RECORD STYLE. Dates are date only strings (UTC midnight), so the year is read in UTC.
// =============================================================================
function ExperienceCard({ entry }: { entry: Job }) {
  const endDisplay = entry.endDate ? entry.endDate.getUTCFullYear() : 'NOW'
  const startDisplay = entry.startDate.getUTCFullYear()
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
        <div className="flex justify-between items-start gap-3 mb-4 relative flex-wrap">
          <div>
            <h3
              className="text-base font-black uppercase"
              style={{
                fontFamily: '"Impact", "Arial Black", sans-serif',
                color: '#FFF',
              }}
            >
              {entry.title}
            </h3>
            <p className="text-sm tracking-wider" style={{ color }}>
              {entry.company}
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
        {entry.description && (
          <p className="text-sm mb-4 leading-relaxed relative" style={{ color: COLORS.chrome }}>
            {entry.description}
          </p>
        )}

        {/* Highlights with HIT markers */}
        {entry.highlights.length > 0 && (
          <ul className="space-y-2 mb-4 relative" aria-label="Key achievements">
            {entry.highlights.map((highlight) => (
              <li key={highlight} className="text-sm flex items-start gap-3" style={{ color: '#FFF' }}>
                <span aria-hidden="true">
                  <ArcadeText text="HIT" type="combo" size="sm" />
                </span>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Skills/tech tags */}
        {entry.skills.length > 0 && (
          <ul className="flex flex-wrap gap-2 relative" aria-label="Skills used">
            {entry.skills.slice(0, 5).map((skill) => (
              <li
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
              </li>
            ))}
          </ul>
        )}
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
// PROJECT CARD - CHAMPIONSHIP VICTORY STYLE: his role, the result line and the links
// =============================================================================
function FightCard({ project, years, links }: ProjectSlot) {
  const isHighlight = project.highlight
  const color = isHighlight ? COLORS.gold : COLORS.specialBlue

  return (
    <article
      className="relative h-full"
      style={{
        background: metallicTexture,
        border: `3px solid ${color}`,
        clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%)',
        boxShadow: isHighlight
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
        <div className="flex justify-between items-start gap-2 mb-2 relative">
          <h3
            className="text-base font-black tracking-wide uppercase"
            style={{
              fontFamily: '"Impact", "Arial Black", sans-serif',
              color: isHighlight ? COLORS.gold : '#FFF',
              textShadow: isHighlight ? `0 0 12px ${COLORS.gold}` : 'none',
            }}
          >
            {project.name}
          </h3>
          {years && (
            <span className="text-sm font-black tracking-wider whitespace-nowrap" style={{ color }}>
              {years}
            </span>
          )}
        </div>

        <p className="text-sm font-bold mb-2 relative" style={{ color: '#FFF' }}>
          {project.role}
        </p>

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
            <span aria-hidden="true">
              <ArcadeText text="K.O." type="ko" size="sm" />
            </span>
            <span style={{ color }}>{project.impact}</span>
          </div>
        )}

        {/* Tech stack */}
        {project.techStack.length > 0 && (
          <ul className="flex flex-wrap gap-2 relative" aria-label="Technologies used">
            {project.techStack.slice(0, 5).map((tech) => (
              <li
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
              </li>
            ))}
          </ul>
        )}

        {/* Links */}
        {links.length > 0 ? (
          <div className="flex flex-wrap gap-3 mt-4 relative">
            {links.map(({ kind, label, linkProps }) => (
              <a
                key={kind}
                {...linkProps}
                className="inline-flex items-center min-h-[44px] text-sm px-4 font-black tracking-wider uppercase focus:outline-none focus-visible:ring-2 transition-transform hover:scale-105"
                style={{
                  background: color,
                  color: '#000',
                  borderRadius: '2px',
                  boxShadow: `0 0 12px ${color}80`,
                }}
              >
                {label}
              </a>
            ))}
          </div>
        ) : (
          <p className="text-sm mt-4 relative" style={{ color: COLORS.chrome }}>No public link</p>
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
// RECRUITER ACTIONS - arcade buttons
// =============================================================================
const ARCADE_BUTTON =
  'inline-flex items-center justify-center min-h-[44px] px-6 py-3 text-sm tracking-[0.2em] font-black uppercase transition-all hover:scale-105 focus:outline-none focus-visible:ring-4'

// Email is the gold primary action, LinkedIn and the CV the outlined ones.
const HERO_ACTION_LOOK: Record<HeroActionSlot['id'], React.CSSProperties> = {
  email: {
    fontFamily: '"Impact", "Arial Black", sans-serif',
    background: `linear-gradient(180deg, ${COLORS.gold}, ${COLORS.orange})`,
    color: COLORS.arcadeBlack,
    border: `2px solid ${COLORS.gold}`,
    boxShadow: `0 0 15px ${COLORS.gold}40`,
  },
  linkedin: {
    fontFamily: '"Impact", "Arial Black", sans-serif',
    background: 'transparent',
    border: `2px solid ${COLORS.specialBlue}`,
    color: COLORS.specialBlue,
    boxShadow: `0 0 10px ${COLORS.specialBlue}30`,
  },
}

function HeroAction({ action }: { action: HeroActionSlot }) {
  return (
    <a {...action.linkProps} className={ARCADE_BUTTON} style={HERO_ACTION_LOOK[action.id]}>
      {action.label}
    </a>
  )
}

function CVLink() {
  return (
    <Link href="/cv" className={ARCADE_BUTTON} style={HERO_ACTION_LOOK.linkedin}>
      CV
    </Link>
  )
}

type SectionsOf<Id extends Profession> = Extract<ProfessionSections, { profession: Id }>

function EngineerSections({ sections }: { sections: SectionsOf<'engineer'> }) {
  const { professionalSummary } = useCVData()

  return (
    <>
      <ArcadeSectionCard color={COLORS.specialBlue} title="About" titleIcon="►" id="about-heading">
        <p className="text-base leading-relaxed" style={{ color: COLORS.chrome, fontFamily: 'system-ui, sans-serif' }}>
          {professionalSummary.bio}
        </p>
      </ArcadeSectionCard>

      {/* ART SECTION 1: VS Badge separator (after About) */}
      <ArtSeparator type="versus" />

      {sections.jobs.length > 0 && (
        <ArcadeSectionCard color={COLORS.p1Blue} title="Work Experience" titleIcon="▶▶" id="experience-heading">
          <div className="grid md:grid-cols-2 gap-6">
            {sections.jobs.map((entry) => (
              <ExperienceCard key={entry.id} entry={entry} />
            ))}
          </div>
        </ArcadeSectionCard>
      )}

      {/* ART SECTION 2: Lightning separator (after Experience) */}
      <ArtSeparator type="lightning" />

      <ArcadeSectionCard color={COLORS.specialBlue} title="Tech Stack" titleIcon="▶▶▶" id="tech-stack-heading">
        <div className="space-y-8">
          {sections.techStack.map((category) => (
            <div key={category.id}>
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
              <ul
                className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2"
                aria-label={`${category.name} technologies`}
              >
                {category.items.map((tech) => (
                  <li
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
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </ArcadeSectionCard>

      <ArcadeSectionCard color={COLORS.gold} title="Projects" titleIcon="★" id="projects-heading">
        <ProjectList
          projects={sections.projects}
          className="grid md:grid-cols-2 gap-6"
          renderProject={(slot) => <FightCard {...slot} />}
        />
      </ArcadeSectionCard>

      {/* ART SECTION 3: Flames separator (after Projects) */}
      <ArtSeparator type="flames" />

      <ArcadeSectionCard color={COLORS.specialBlue} title="Ventures" titleIcon="▶▶▶▶" id="ventures-heading">
        <div className="grid md:grid-cols-3 gap-6">
          {sections.companies.map((company) => (
            <TeamCard key={company.id} company={company} />
          ))}
        </div>
      </ArcadeSectionCard>
    </>
  )
}

function MusicianSections({ sections }: { sections: SectionsOf<'drummer'> }) {
  const { musician, bands } = sections

  return (
    <>
      <ArtSeparator type="lightning" />
      <ArcadeSectionCard color={COLORS.neonPink} title="Bands" titleIcon="♪♪♪" id="bands-heading">
        <p className="text-base mb-6" style={{ color: COLORS.chrome, fontFamily: 'system-ui, sans-serif' }}>
          Drums since {musician.since}, {musician.yearsPlaying} years
        </p>
        <BandList bands={bands} className="grid md:grid-cols-3 gap-6" renderBand={(slot) => <BandCard {...slot} />} />
        <p className="text-sm mt-6 italic" style={{ color: COLORS.neonPinkLight }}>
          {musician.line}
        </p>
      </ArcadeSectionCard>
    </>
  )
}

function MartialArtistSections({ sections }: { sections: SectionsOf<'fighter'> }) {
  const { martialArts } = sections

  return (
    <>
      <ArtSeparator type="flames" />
      <ArcadeSectionCard color={COLORS.orange} title="Muay Thai" titleIcon="▶▶▶" id="muay-thai-heading">
        <h3
          className="text-xl mb-6 tracking-[0.15em] uppercase"
          style={{
            fontFamily: '"Impact", "Arial Black", sans-serif',
            color: COLORS.gold,
            textShadow: `0 0 12px ${COLORS.gold}60`,
          }}
        >
          {martialArts.primary.title}
        </h3>
        <MuayThaiRecord
          martialArts={martialArts}
          classNames={{
            facts: 'grid sm:grid-cols-2 gap-4 mb-6',
            fact: 'px-4 py-3 border-l-4 border-[#FF6600] bg-[#FF6600]/10',
            term: 'text-sm tracking-[0.2em] uppercase font-black text-[#FFD700]',
            value: 'text-sm mt-1 text-white',
            achievements: 'space-y-2',
            achievement: 'text-sm flex items-start gap-3 text-white',
          }}
          renderAchievement={(achievement) => (
            <>
              <span aria-hidden="true">
                <ArcadeText text="HIT" type="combo" size="sm" />
              </span>
              <span>{achievement}</span>
            </>
          )}
        />
      </ArcadeSectionCard>
    </>
  )
}

function ProfessionDetails({ sections }: { sections: ProfessionSections }) {
  if (sections.profession === 'drummer') return <MusicianSections sections={sections} />
  if (sections.profession === 'fighter') return <MartialArtistSections sections={sections} />
  return <EngineerSections sections={sections} />
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function FighterSelectTheme() {
  const { active, config } = useProfession()
  const view = useWorldView()

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
        {/* HEADER - the recruiter first screen */}
        {/* ================================================================= */}
        <header className="relative py-6 px-4 sm:py-8 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <ArcadeSectionCard color={COLORS.p1Blue}>
              <RecruiterHero
                render={({ name, headline, tagline, line, actions }) => (
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
                        {name}
                      </h1>

                      <p
                        className="text-base md:text-lg mt-4 tracking-wide max-w-2xl"
                        style={{ color: COLORS.chrome, fontFamily: 'system-ui, sans-serif' }}
                      >
                        {headline}
                      </p>
                      <p className="text-sm md:text-base mt-2 italic tracking-wider" style={{ color: COLORS.specialBlue }}>
                        {tagline}
                      </p>
                      <p className="text-sm mt-2 tracking-wide" style={{ color: COLORS.chrome, fontFamily: 'system-ui, sans-serif' }}>
                        {line}
                      </p>
                    </div>

                    <nav className="flex gap-3 sm:gap-4 items-center flex-wrap shrink-0" aria-label="Contact and CV">
                      {actions.map((action) => (
                        <HeroAction key={action.id} action={action} />
                      ))}
                      <CVLink />
                      <Link
                        href="/personal-projects/game-engine"
                        className={ARCADE_BUTTON}
                        style={{
                          background: `linear-gradient(90deg, ${COLORS.healthGreen}, ${COLORS.healthGreenDark})`,
                          color: '#000',
                          borderRadius: '4px',
                          clipPath: 'polygon(0 0, 100% 0, 90% 100%, 0 100%)',
                          boxShadow: `0 0 20px ${COLORS.healthGreen}60`,
                        }}
                        aria-label="Play the game engine demo"
                      >
                        PLAY
                      </Link>
                    </nav>
                  </div>
                )}
              />
            </ArcadeSectionCard>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* ================================================================= */}
          {/* CHARACTER SELECT - the shared profession switch, System Engineer in the centre and picked */}
          {/* ================================================================= */}
          <ArcadeSectionCard color={COLORS.specialBlue} title="Select your fighter" titleIcon="►" id="select-heading">
            <ProfessionSwitch
              className="grid grid-cols-3 gap-2 pt-8 mb-8 md:flex md:items-center md:justify-center md:gap-0"
              label="Profession"
              renderOption={(option) => (
                <>
                  {option.id !== 'drummer' && (
                    <div className="mx-2 lg:mx-6 hidden md:block" aria-hidden="true">
                      <VSBadge />
                    </div>
                  )}
                  <CharacterPortrait {...option} />
                </>
              )}
            />

            {/* Ready banner */}
            <FightBanner text={`${config.title.toUpperCase()} - READY!`} ready />
          </ArcadeSectionCard>

          <div role="region" aria-label={`${active} profession details`}>
            <ProfessionDetails sections={view.sections} />
          </div>
        </main>

        {/* ================================================================= */}
        {/* CONTACT CTA */}
        {/* ================================================================= */}
        <section className="relative z-20 py-12 px-4 sm:px-6" aria-label="Contact">
          <RecruiterHero
            render={({ line, actions }) => (
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
                  <p className="text-sm" style={{ color: COLORS.chrome }}>
                    {line}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {actions.map((action) => (
                    <HeroAction key={action.id} action={action} />
                  ))}
                  <CVLink />
                </div>
              </div>
            )}
          />
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
