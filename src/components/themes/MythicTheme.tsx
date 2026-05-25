'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useTheme } from '@/themes/ThemeContext'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import { useProfession } from '@/contexts/ProfessionContext'
import { ABOUT_DATA, PROFESSIONAL_SUMMARY } from '@/data/about'
import { PROJECTS_DATA } from '@/data/projects'
import { getSkillsByProfession } from '@/data/skills'
import { CURRENT_ROLES } from '@/data/roles'
import { COMPANIES } from '@/data/companies'
import { BANDS } from '@/data/bands'
import { EXPERIENCE_DATA, filterExperienceByProfession } from '@/data/experience'
import { TECH_STACK } from '@/data/techStack'

// =============================================================================
// ACCESSIBILITY HELPERS
// =============================================================================
function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return prefersReducedMotion
}

// =============================================================================
// HADES COLOR PALETTE
// True to the game: deep crimsons, Styx emerald-greens, golden filigree,
// purple underworld glow, warm ember oranges
// =============================================================================
const HADES_COLORS = {
  // Core background - the House of Hades stone
  stoneDeep: '#0d0608',
  stoneMid: '#1a0d10',
  stoneLight: '#2a1518',

  // Blood/Zagreus reds
  bloodDeep: '#6b0f1a',
  bloodMid: '#9b1b2d',
  bloodBright: '#dc2f44',
  bloodGlow: '#ff4060',

  // Styx river greens (the actual in-game color!)
  styxDeep: '#0a2a20',
  styxMid: '#0f4a38',
  styxBright: '#1a8060',
  styxGlow: '#20b080',

  // Golden filigree (boon frames, currency)
  goldDeep: '#8b6914',
  goldMid: '#d4af37',
  goldBright: '#f0d060',
  goldGlow: '#ffe888',

  // God colors (authentic to game)
  athenaGreen: '#3dd68c',
  apolloOrange: '#ff9500',
  aresRed: '#ff3344',
  zeusBlue: '#4488ff',
  poseidonCyan: '#00c8ff',
  dionysusViolet: '#bb44ff',
  demeterIce: '#88ddff',
  artemisGreen: '#44ff88',
  aphroditePink: '#ff66aa',
  hermesOrange: '#ffaa00',
  chaosVoid: '#8844cc',
  hadesGold: '#d4af37',

  // UI elements
  textPrimary: '#f0e0d8',
  textSecondary: '#a08880',
  textMuted: '#705850',

  // Ember/fire
  emberOrange: '#ff6633',
  emberYellow: '#ffaa44',
  ashGray: '#3a2a25',
}

// =============================================================================
// SVG PATTERNS - Stone textures, Greek patterns
// =============================================================================
function HadesPatternDefs() {
  return (
    <svg className="absolute w-0 h-0" aria-hidden="true">
      <defs>
        {/* Greek meander/key pattern */}
        <pattern id="greekMeander" patternUnits="userSpaceOnUse" width="32" height="16">
          <path
            d="M0 8 L8 8 L8 0 L24 0 L24 8 L16 8 L16 16 L32 16 M0 16 L0 8"
            fill="none"
            stroke={HADES_COLORS.goldMid}
            strokeWidth="1.5"
            opacity="0.6"
          />
        </pattern>

        {/* Stone crack texture */}
        <pattern id="stoneCracks" patternUnits="userSpaceOnUse" width="100" height="100">
          <path
            d="M10 5 Q20 15 15 30 M50 0 L55 25 Q60 40 50 50 M80 10 Q75 30 85 45 M30 60 L40 75 Q35 90 45 100 M70 55 Q80 70 75 85"
            fill="none"
            stroke={HADES_COLORS.bloodDeep}
            strokeWidth="0.5"
            opacity="0.3"
          />
        </pattern>

        {/* Gold filigree scrollwork */}
        <pattern id="goldFiligree" patternUnits="userSpaceOnUse" width="60" height="30">
          <path
            d="M0 15 Q15 5 30 15 Q45 25 60 15"
            fill="none"
            stroke={HADES_COLORS.goldDeep}
            strokeWidth="1"
            opacity="0.4"
          />
          <circle cx="30" cy="15" r="3" fill={HADES_COLORS.goldMid} opacity="0.5" />
        </pattern>

        {/* Radial gold gradient for boons */}
        <radialGradient id="boonGlow" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor={HADES_COLORS.goldGlow} stopOpacity="0.4" />
          <stop offset="50%" stopColor={HADES_COLORS.goldMid} stopOpacity="0.2" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>

        {/* Blood pool gradient */}
        <radialGradient id="bloodPool" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={HADES_COLORS.bloodBright} stopOpacity="0.6" />
          <stop offset="70%" stopColor={HADES_COLORS.bloodDeep} stopOpacity="0.3" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>

        {/* Styx water gradient */}
        <linearGradient id="styxGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="30%" stopColor={HADES_COLORS.styxDeep} />
          <stop offset="70%" stopColor={HADES_COLORS.styxMid} />
          <stop offset="100%" stopColor={HADES_COLORS.styxBright} />
        </linearGradient>

        {/* Column gold gradient */}
        <linearGradient id="columnGold" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={HADES_COLORS.goldBright} />
          <stop offset="50%" stopColor={HADES_COLORS.goldMid} />
          <stop offset="100%" stopColor={HADES_COLORS.goldDeep} />
        </linearGradient>
      </defs>
    </svg>
  )
}

// =============================================================================
// GREEK MEANDER BORDER
// =============================================================================
function MeanderBorder({ className = '' }: { className?: string }) {
  return (
    <div
      className={`h-4 w-full ${className}`}
      style={{
        background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='16'%3E%3Cpath d='M0 8 L8 8 L8 0 L24 0 L24 8 L16 8 L16 16 L32 16' fill='none' stroke='%23d4af37' stroke-width='1.5' opacity='0.7'/%3E%3C/svg%3E")`,
        filter: `drop-shadow(0 0 4px ${HADES_COLORS.goldMid}40)`,
      }}
      role="presentation"
      aria-hidden="true"
    />
  )
}

// =============================================================================
// ORNATE FRAME - Hades boon card style
// =============================================================================
function OrnateFrame({
  children,
  color = HADES_COLORS.goldMid,
  className = '',
  glowColor,
}: {
  children: React.ReactNode
  color?: string
  className?: string
  glowColor?: string
}) {
  const glow = glowColor || color
  return (
    <div
      className={`relative ${className}`}
      style={{
        background: `linear-gradient(135deg, ${HADES_COLORS.stoneLight}, ${HADES_COLORS.stoneMid})`,
        border: `2px solid ${color}`,
        boxShadow: `
          inset 0 0 30px ${HADES_COLORS.stoneDeep},
          0 0 15px ${glow}30,
          0 0 30px ${glow}15
        `,
      }}
    >
      {/* Corner ornaments */}
      <svg className="absolute -top-1 -left-1 w-6 h-6" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M0 24 L0 8 Q0 0 8 0 L24 0" fill="none" stroke={color} strokeWidth="2" />
        <circle cx="4" cy="4" r="2" fill={color} />
      </svg>
      <svg className="absolute -top-1 -right-1 w-6 h-6" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M24 24 L24 8 Q24 0 16 0 L0 0" fill="none" stroke={color} strokeWidth="2" />
        <circle cx="20" cy="4" r="2" fill={color} />
      </svg>
      <svg className="absolute -bottom-1 -left-1 w-6 h-6" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M0 0 L0 16 Q0 24 8 24 L24 24" fill="none" stroke={color} strokeWidth="2" />
        <circle cx="4" cy="20" r="2" fill={color} />
      </svg>
      <svg className="absolute -bottom-1 -right-1 w-6 h-6" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M24 0 L24 16 Q24 24 16 24 L0 24" fill="none" stroke={color} strokeWidth="2" />
        <circle cx="20" cy="20" r="2" fill={color} />
      </svg>
      {children}
    </div>
  )
}

// =============================================================================
// LAUREL WREATH - Purely SVG
// =============================================================================
function LaurelWreath({ width = 180 }: { width?: number }) {
  return (
    <svg
      viewBox="0 0 180 50"
      className="mx-auto"
      style={{
        width,
        filter: `drop-shadow(0 0 8px ${HADES_COLORS.goldMid}60)`
      }}
      aria-hidden="true"
    >
      {/* Left branch */}
      <g fill={HADES_COLORS.goldMid}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <ellipse
            key={`l-${i}`}
            cx={20 + i * 12}
            cy={25 + Math.sin(i * 0.8) * 8}
            rx="10"
            ry="5"
            transform={`rotate(${-45 + i * 8}, ${20 + i * 12}, ${25 + Math.sin(i * 0.8) * 8})`}
          />
        ))}
        <path
          d="M15 30 Q50 15 90 25"
          fill="none"
          stroke={HADES_COLORS.goldDeep}
          strokeWidth="2"
        />
      </g>
      {/* Right branch */}
      <g fill={HADES_COLORS.goldMid}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <ellipse
            key={`r-${i}`}
            cx={160 - i * 12}
            cy={25 + Math.sin(i * 0.8) * 8}
            rx="10"
            ry="5"
            transform={`rotate(${45 - i * 8}, ${160 - i * 12}, ${25 + Math.sin(i * 0.8) * 8})`}
          />
        ))}
        <path
          d="M165 30 Q130 15 90 25"
          fill="none"
          stroke={HADES_COLORS.goldDeep}
          strokeWidth="2"
        />
      </g>
    </svg>
  )
}

// =============================================================================
// SKULL DECORATION - Underworld style
// =============================================================================
function SkullIcon({ size = 24, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 30 36"
      width={size}
      height={size * 1.2}
      className={className}
      style={{ filter: `drop-shadow(0 0 4px ${HADES_COLORS.bloodGlow}40)` }}
      aria-hidden="true"
    >
      {/* Skull shape */}
      <ellipse cx="15" cy="13" rx="12" ry="10" fill={HADES_COLORS.textPrimary} />
      <ellipse cx="15" cy="16" rx="9" ry="6" fill="#c8b8a8" />
      {/* Eye sockets */}
      <ellipse cx="10" cy="12" rx="3.5" ry="4" fill={HADES_COLORS.stoneDeep} />
      <ellipse cx="20" cy="12" rx="3.5" ry="4" fill={HADES_COLORS.stoneDeep} />
      {/* Glowing eyes */}
      <ellipse cx="10" cy="12" rx="1.5" ry="2" fill={HADES_COLORS.bloodBright} opacity="0.9" />
      <ellipse cx="20" cy="12" rx="1.5" ry="2" fill={HADES_COLORS.bloodBright} opacity="0.9" />
      {/* Nose */}
      <path d="M15 15 L13.5 19 L16.5 19 Z" fill={HADES_COLORS.stoneDeep} />
      {/* Teeth */}
      <rect x="10" y="22" width="10" height="4" fill={HADES_COLORS.textPrimary} rx="1" />
      <line x1="12" y1="22" x2="12" y2="26" stroke={HADES_COLORS.stoneDeep} strokeWidth="0.5" />
      <line x1="14" y1="22" x2="14" y2="26" stroke={HADES_COLORS.stoneDeep} strokeWidth="0.5" />
      <line x1="16" y1="22" x2="16" y2="26" stroke={HADES_COLORS.stoneDeep} strokeWidth="0.5" />
      <line x1="18" y1="22" x2="18" y2="26" stroke={HADES_COLORS.stoneDeep} strokeWidth="0.5" />
      {/* Jaw */}
      <path d="M8 20 Q15 30 22 20" fill="none" stroke="#c8b8a8" strokeWidth="2" />
    </svg>
  )
}

// =============================================================================
// BONE DIVIDER
// =============================================================================
function BoneDivider({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 16"
      className={`h-4 ${className}`}
      style={{ filter: `drop-shadow(0 0 2px ${HADES_COLORS.textMuted}40)` }}
      aria-hidden="true"
    >
      <ellipse cx="8" cy="4" rx="5" ry="3" fill="#d8ccc0" />
      <ellipse cx="8" cy="12" rx="5" ry="3" fill="#d8ccc0" />
      <rect x="6" y="4" width="108" height="8" fill="#c8b8a8" rx="3" />
      <ellipse cx="112" cy="4" rx="5" ry="3" fill="#d8ccc0" />
      <ellipse cx="112" cy="12" rx="5" ry="3" fill="#d8ccc0" />
    </svg>
  )
}

// =============================================================================
// SPEAR DIVIDER
// =============================================================================
function SpearDivider() {
  return (
    <div className="flex items-center justify-center my-6" aria-hidden="true">
      <div
        className="flex-1 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${HADES_COLORS.goldMid}, transparent)` }}
      />
      <svg viewBox="0 0 80 16" className="w-16 h-4 mx-3">
        <polygon points="0,8 12,4 12,12" fill={HADES_COLORS.goldMid} />
        <rect x="12" y="6" width="56" height="4" fill={HADES_COLORS.goldDeep} />
        <polygon points="68,8 80,4 80,12" fill={HADES_COLORS.goldMid} />
      </svg>
      <div
        className="flex-1 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${HADES_COLORS.goldMid}, transparent)` }}
      />
    </div>
  )
}

// =============================================================================
// FLOATING EMBERS - CSS only, no state
// =============================================================================
function FloatingEmbers({ reducedMotion }: { reducedMotion: boolean }) {
  if (reducedMotion) return null

  // Pre-calculated ember positions for performance
  const embers = [
    { left: '5%', delay: '0s', duration: '6s', size: 3 },
    { left: '15%', delay: '1s', duration: '7s', size: 4 },
    { left: '25%', delay: '2s', duration: '5s', size: 2 },
    { left: '35%', delay: '0.5s', duration: '8s', size: 5 },
    { left: '45%', delay: '1.5s', duration: '6s', size: 3 },
    { left: '55%', delay: '2.5s', duration: '7s', size: 4 },
    { left: '65%', delay: '0.8s', duration: '5s', size: 2 },
    { left: '75%', delay: '1.8s', duration: '8s', size: 5 },
    { left: '85%', delay: '2.2s', duration: '6s', size: 3 },
    { left: '95%', delay: '0.3s', duration: '7s', size: 4 },
  ]

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden" aria-hidden="true">
      {embers.map((ember, i) => (
        <div
          key={i}
          className="absolute bottom-0 rounded-full animate-ember-float"
          style={{
            left: ember.left,
            width: ember.size,
            height: ember.size,
            background: i % 2 === 0 ? HADES_COLORS.emberOrange : HADES_COLORS.emberYellow,
            boxShadow: `0 0 ${ember.size * 2}px ${i % 2 === 0 ? HADES_COLORS.emberOrange : HADES_COLORS.emberYellow}`,
            animationDelay: ember.delay,
            animationDuration: ember.duration,
          }}
        />
      ))}
    </div>
  )
}

// =============================================================================
// STYX RIVER - Bottom decoration with authentic green glow
// =============================================================================
function StyxRiver() {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 h-24 pointer-events-none z-[2]"
      aria-hidden="true"
    >
      {/* Base river color */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, transparent 0%, ${HADES_COLORS.styxDeep} 40%, ${HADES_COLORS.styxMid} 100%)`,
        }}
      />
      {/* Emerald glow from depths */}
      <div
        className="absolute bottom-0 left-0 right-0 h-12"
        style={{
          background: `linear-gradient(180deg, transparent, ${HADES_COLORS.styxBright}30)`,
          filter: 'blur(8px)',
        }}
      />
      {/* Ripple effect */}
      <div
        className="absolute bottom-4 left-0 right-0 h-px animate-styx-ripple"
        style={{
          background: `linear-gradient(90deg, transparent, ${HADES_COLORS.styxGlow}60, transparent)`,
        }}
      />
    </div>
  )
}

// =============================================================================
// BLOOD VIGNETTE - Edges of the screen
// =============================================================================
function BloodVignette() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[3]"
      style={{
        background: `
          radial-gradient(ellipse at 50% 0%, ${HADES_COLORS.bloodDeep}30 0%, transparent 50%),
          radial-gradient(ellipse at 0% 50%, ${HADES_COLORS.bloodDeep}20 0%, transparent 40%),
          radial-gradient(ellipse at 100% 50%, ${HADES_COLORS.bloodDeep}20 0%, transparent 40%),
          radial-gradient(ellipse at 50% 100%, ${HADES_COLORS.styxDeep}40 0%, transparent 50%)
        `,
      }}
      aria-hidden="true"
    />
  )
}

// =============================================================================
// SIDE FLAMES - Greek brazier style
// =============================================================================
function SideFlames({ side, reducedMotion }: { side: 'left' | 'right'; reducedMotion: boolean }) {
  return (
    <div
      className={`fixed top-0 bottom-0 w-16 pointer-events-none z-[4] ${
        side === 'left' ? 'left-0' : 'right-0'
      }`}
      aria-hidden="true"
    >
      {/* Column base */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, ${HADES_COLORS.stoneLight}, ${HADES_COLORS.stoneMid}, ${HADES_COLORS.stoneDeep})`,
          borderRight: side === 'left' ? `2px solid ${HADES_COLORS.goldDeep}` : 'none',
          borderLeft: side === 'right' ? `2px solid ${HADES_COLORS.goldDeep}` : 'none',
        }}
      />

      {/* Flame brazier */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2">
        {/* Brazier bowl */}
        <svg viewBox="0 0 40 30" className="w-10 h-8">
          <path
            d="M5 0 L35 0 L30 25 Q20 30 10 25 Z"
            fill={HADES_COLORS.goldDeep}
            stroke={HADES_COLORS.goldMid}
            strokeWidth="1"
          />
        </svg>

        {/* Flames */}
        {!reducedMotion && (
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-8 flex justify-center gap-0.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="animate-flame-flicker"
                style={{
                  width: 6 + i * 2,
                  height: 30 - i * 5,
                  background: `linear-gradient(to top, ${HADES_COLORS.bloodBright}, ${HADES_COLORS.emberOrange}, ${HADES_COLORS.emberYellow})`,
                  borderRadius: '50% 50% 30% 30%',
                  filter: 'blur(1px)',
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Top decoration */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2">
        <SkullIcon size={20} />
      </div>
    </div>
  )
}

// =============================================================================
// PROFESSION BOON CARD - Hexagonal Olympian style
// =============================================================================
function BoonCard({
  profession,
  isActive,
  onClick,
}: {
  profession: 'engineer' | 'drummer' | 'fighter'
  isActive: boolean
  onClick: () => void
}) {
  const gods = {
    engineer: {
      name: 'ATHENA',
      color: HADES_COLORS.athenaGreen,
      title: 'Goddess of Wisdom',
      icon: 'M20 8 L20 4 L16 4 L14 8 L16 12 L14 16 L18 16 L18 28 L22 28 L22 16 L26 16 L24 12 L26 8 L22 4 L20 4' // Helmet/owl
    },
    drummer: {
      name: 'APOLLO',
      color: HADES_COLORS.apolloOrange,
      title: 'God of Music',
      icon: 'M20 6 L14 14 Q12 20 20 26 Q28 20 26 14 Z M18 14 L18 22 M20 14 L20 24 M22 14 L22 22' // Lyre
    },
    fighter: {
      name: 'ARES',
      color: HADES_COLORS.aresRed,
      title: 'God of War',
      icon: 'M20 4 L12 12 L12 20 L20 16 L28 20 L28 12 Z M20 18 L20 32 M14 24 L26 24' // Helmet with spear
    },
  }
  const god = gods[profession]

  return (
    <button
      onClick={onClick}
      className={`relative transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
        isActive ? 'scale-110 z-10' : 'opacity-70 hover:opacity-100 hover:scale-105'
      }`}
      style={{
        focusVisibleRingColor: god.color,
      }}
      aria-pressed={isActive}
      aria-label={`Select ${god.name} - ${god.title}`}
    >
      <svg viewBox="0 0 100 120" className="w-28 h-36">
        {/* Hexagon background */}
        <path
          d="M50 5 L90 25 L90 85 L50 115 L10 85 L10 25 Z"
          fill={isActive ? `${god.color}20` : HADES_COLORS.stoneMid}
          stroke={isActive ? god.color : HADES_COLORS.goldDeep}
          strokeWidth="3"
          style={{
            filter: isActive ? `drop-shadow(0 0 15px ${god.color}60)` : 'none',
          }}
        />

        {/* Inner hexagon */}
        <path
          d="M50 15 L82 32 L82 78 L50 105 L18 78 L18 32 Z"
          fill="none"
          stroke={isActive ? god.color : HADES_COLORS.goldDeep}
          strokeWidth="1"
          opacity="0.5"
        />

        {/* God icon */}
        <g transform="translate(30, 25)">
          <path
            d={god.icon}
            fill={isActive ? god.color : HADES_COLORS.textSecondary}
            style={{
              filter: isActive ? `drop-shadow(0 0 8px ${god.color})` : 'none',
            }}
          />
        </g>

        {/* God name */}
        <text
          x="50"
          y="90"
          textAnchor="middle"
          fill={isActive ? god.color : HADES_COLORS.textSecondary}
          fontSize="10"
          fontWeight="bold"
          style={{ fontFamily: 'serif' }}
        >
          {god.name}
        </text>

        {/* Title */}
        <text
          x="50"
          y="102"
          textAnchor="middle"
          fill={HADES_COLORS.textMuted}
          fontSize="6"
        >
          {god.title}
        </text>
      </svg>

      {/* Active indicator laurel */}
      {isActive && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
          <svg viewBox="0 0 40 12" className="w-8 h-3">
            <path d="M0 10 Q10 2 20 6 Q30 2 40 10" fill="none" stroke={HADES_COLORS.goldMid} strokeWidth="1.5" />
            {[0, 1, 2, 3, 4].map(i => (
              <ellipse key={i} cx={4 + i * 8} cy={8 - Math.abs(2 - i) * 1.5} rx="3" ry="1.5" fill={HADES_COLORS.goldMid} />
            ))}
          </svg>
        </div>
      )}
    </button>
  )
}

// =============================================================================
// SECTION CARD - Stone tablet with blood pool edges
// =============================================================================
function SectionCard({
  children,
  color = HADES_COLORS.goldMid,
  className = '',
  ariaLabel,
}: {
  children: React.ReactNode
  color?: string
  className?: string
  ariaLabel?: string
}) {
  return (
    <section
      className={`relative p-6 ${className}`}
      style={{
        background: `
          linear-gradient(135deg, ${HADES_COLORS.stoneLight} 0%, ${HADES_COLORS.stoneMid} 50%, ${HADES_COLORS.stoneDeep} 100%)
        `,
        border: `2px solid ${color}60`,
        boxShadow: `
          inset 0 0 40px ${HADES_COLORS.stoneDeep},
          0 0 20px ${color}20
        `,
      }}
      role="region"
      aria-label={ariaLabel}
    >
      {/* Stone texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cpath d='M10 5 Q20 15 15 30 M50 0 L55 25 Q60 40 50 50 M80 10 Q75 30 85 45' fill='none' stroke='%236b0f1a' stroke-width='0.5' opacity='0.3'/%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />

      {/* Blood drip accents at top */}
      <div className="absolute top-0 left-8 w-1 h-4 rounded-b-full" style={{ background: `linear-gradient(180deg, ${HADES_COLORS.bloodBright}, transparent)` }} aria-hidden="true" />
      <div className="absolute top-0 left-16 w-0.5 h-3 rounded-b-full" style={{ background: `linear-gradient(180deg, ${HADES_COLORS.bloodMid}, transparent)` }} aria-hidden="true" />
      <div className="absolute top-0 right-12 w-1 h-5 rounded-b-full" style={{ background: `linear-gradient(180deg, ${HADES_COLORS.bloodBright}, transparent)` }} aria-hidden="true" />

      {/* Corner ornaments */}
      <div className="absolute top-1 left-1 w-4 h-4 border-t-2 border-l-2" style={{ borderColor: color }} aria-hidden="true" />
      <div className="absolute top-1 right-1 w-4 h-4 border-t-2 border-r-2" style={{ borderColor: color }} aria-hidden="true" />
      <div className="absolute bottom-1 left-1 w-4 h-4 border-b-2 border-l-2" style={{ borderColor: color }} aria-hidden="true" />
      <div className="absolute bottom-1 right-1 w-4 h-4 border-b-2 border-r-2" style={{ borderColor: color }} aria-hidden="true" />

      <div className="relative z-10">
        {children}
      </div>
    </section>
  )
}

// =============================================================================
// SECTION TITLE - With decorative elements
// =============================================================================
function SectionTitle({
  children,
  color = HADES_COLORS.goldMid,
  icon,
}: {
  children: React.ReactNode
  color?: string
  icon?: React.ReactNode
}) {
  return (
    <h2
      className="text-lg mb-4 flex items-center gap-3"
      style={{
        color,
        textShadow: `0 0 10px ${color}40`,
      }}
    >
      {icon || (
        <svg viewBox="0 0 20 24" className="w-5 h-6" aria-hidden="true">
          <polygon points="10,0 20,6 20,18 10,24 0,18 0,6" fill={color} opacity="0.8" />
          <polygon points="10,4 16,8 16,16 10,20 4,16 4,8" fill={HADES_COLORS.stoneDeep} />
        </svg>
      )}
      <span className="tracking-wider">{children}</span>
      <div
        className="flex-1 h-px ml-3"
        style={{ background: `linear-gradient(90deg, ${color}60, transparent)` }}
        aria-hidden="true"
      />
    </h2>
  )
}

// =============================================================================
// TECH STACK DISPLAY - Boon-style tags, NO proficiency bars
// =============================================================================
function TechStackDisplay({ color }: { color: string }) {
  return (
    <div className="space-y-4" role="list" aria-label="Technology expertise">
      {TECH_STACK.map((category) => (
        <div key={category.name} className="mb-4 last:mb-0">
          <h3
            className="text-xs tracking-widest mb-2 pb-1 border-b flex items-center gap-2"
            style={{ color: HADES_COLORS.goldMid, borderColor: `${HADES_COLORS.goldMid}30` }}
          >
            <span className="text-sm">{category.icon}</span>
            {category.name.toUpperCase()}
          </h3>
          <div className="flex flex-wrap gap-1.5" role="list">
            {category.items.map((tech) => (
              <span
                key={tech}
                className="text-[10px] px-2.5 py-1 transition-all hover:scale-105"
                style={{
                  background: `${color}15`,
                  border: `1px solid ${color}40`,
                  color: HADES_COLORS.textPrimary,
                  clipPath: 'polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)',
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

// =============================================================================
// SKILL DISPLAY - For drummer/fighter, NO 1-5 bars, show expertise
// =============================================================================
function SkillDisplay({
  skills,
  color
}: {
  skills: ReturnType<typeof getSkillsByProfession>
  color: string
}) {
  return (
    <div className="space-y-4" role="list" aria-label="Skills and expertise">
      {skills.map((category) => (
        <div key={category.name} className="mb-4 last:mb-0">
          <h3
            className="text-xs tracking-widest mb-2 pb-1 border-b flex items-center gap-2"
            style={{ color: HADES_COLORS.goldMid, borderColor: `${HADES_COLORS.goldMid}30` }}
          >
            <span className="text-sm">{category.icon}</span>
            {category.name.toUpperCase()}
          </h3>
          <div className="space-y-1" role="list">
            {category.skills.map((skill) => (
              <div
                key={skill.name}
                className="flex items-center gap-2 py-1.5 px-2 hover:bg-white/5 transition-colors rounded"
                role="listitem"
              >
                {/* Boon-style hexagon indicator */}
                <svg viewBox="0 0 16 18" className="w-3 h-3.5 flex-shrink-0" aria-hidden="true">
                  <polygon
                    points="8,1 15,5 15,13 8,17 1,13 1,5"
                    fill={color}
                    opacity="0.8"
                  />
                </svg>
                <span className="text-xs" style={{ color: HADES_COLORS.textPrimary }}>
                  {skill.name}
                </span>
                {/* Active glow dot */}
                <div
                  className="w-1.5 h-1.5 rounded-full ml-auto flex-shrink-0"
                  style={{
                    background: color,
                    boxShadow: `0 0 6px ${color}`,
                  }}
                  aria-hidden="true"
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// =============================================================================
// CURRENT ROLES - Leadership positions display
// =============================================================================
function CurrentRolesSection({ color }: { color: string }) {
  return (
    <SectionCard color={color} ariaLabel="Current professional roles" className="mb-8">
      <SectionTitle color={HADES_COLORS.goldMid}>
        Current Positions
      </SectionTitle>

      <div className="grid gap-3">
        {CURRENT_ROLES.map((role) => (
          <div
            key={role.id}
            className="p-3 transition-all hover:translate-x-1"
            style={{
              background: `linear-gradient(90deg, ${HADES_COLORS.stoneLight}80, transparent)`,
              borderLeft: `3px solid ${role.type === 'leadership' ? HADES_COLORS.goldMid : color}`,
            }}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-bold" style={{ color: HADES_COLORS.textPrimary }}>
                  {role.title}
                </h3>
                <p
                  className="text-xs"
                  style={{ color: role.type === 'leadership' ? HADES_COLORS.goldMid : color }}
                >
                  {role.company}
                </p>
              </div>
              {role.type === 'leadership' && (
                <span
                  className="text-[8px] px-2 py-0.5 tracking-wider"
                  style={{
                    background: `${HADES_COLORS.goldMid}20`,
                    border: `1px solid ${HADES_COLORS.goldMid}50`,
                    color: HADES_COLORS.goldMid,
                  }}
                >
                  LEADERSHIP
                </span>
              )}
            </div>
            <p className="text-[10px] mt-1" style={{ color: HADES_COLORS.textSecondary }}>
              {role.description}
            </p>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}

// =============================================================================
// COMPANIES SECTION - Underworld ventures
// =============================================================================
function CompaniesSection() {
  return (
    <SectionCard color={HADES_COLORS.chaosVoid} ariaLabel="Companies and ventures" className="mb-8">
      <SectionTitle color={HADES_COLORS.chaosVoid}>
        Ventures & Companies
      </SectionTitle>

      <div className="grid gap-4">
        {COMPANIES.map((company) => (
          <a
            key={company.id}
            href={company.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 transition-all group hover:translate-x-1"
            style={{
              background: `linear-gradient(135deg, ${HADES_COLORS.stoneLight}, ${HADES_COLORS.stoneMid})`,
              border: `1px solid ${HADES_COLORS.chaosVoid}40`,
            }}
            aria-label={`${company.name} - ${company.tagline}`}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{company.icon}</span>
                <div>
                  <h3 className="text-sm font-bold" style={{ color: HADES_COLORS.textPrimary }}>
                    {company.name}
                  </h3>
                  <p className="text-[10px]" style={{ color: HADES_COLORS.chaosVoid }}>
                    {company.tagline}
                  </p>
                </div>
              </div>
              <svg
                viewBox="0 0 16 16"
                className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity"
                aria-hidden="true"
              >
                <path
                  d="M4 12L12 4M12 4H6M12 4v6"
                  fill="none"
                  stroke={HADES_COLORS.chaosVoid}
                  strokeWidth="2"
                />
              </svg>
            </div>
            <p className="text-xs mb-3" style={{ color: HADES_COLORS.textSecondary }}>
              {company.description}
            </p>
            <div className="flex flex-wrap gap-1">
              {company.services.map((service) => (
                <span
                  key={service}
                  className="text-[8px] px-2 py-0.5"
                  style={{
                    background: `${HADES_COLORS.chaosVoid}15`,
                    border: `1px solid ${HADES_COLORS.chaosVoid}30`,
                    color: HADES_COLORS.textSecondary,
                  }}
                >
                  {service}
                </span>
              ))}
            </div>
          </a>
        ))}
      </div>
    </SectionCard>
  )
}

// =============================================================================
// BANDS SECTION - Apollo's musical projects
// =============================================================================
function BandsSection() {
  return (
    <SectionCard color={HADES_COLORS.apolloOrange} ariaLabel="Musical projects and bands" className="mb-8">
      <SectionTitle color={HADES_COLORS.apolloOrange}>
        Musical Projects
      </SectionTitle>

      <div className="grid gap-4">
        {BANDS.map((band) => (
          <div
            key={band.id}
            className="p-4 transition-all hover:translate-x-1"
            style={{
              background: `linear-gradient(135deg, ${HADES_COLORS.stoneLight}, ${HADES_COLORS.stoneMid})`,
              border: `1px solid ${HADES_COLORS.apolloOrange}40`,
            }}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold" style={{ color: HADES_COLORS.textPrimary }}>
                    {band.name}
                  </h3>
                  {band.active && (
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{
                        background: HADES_COLORS.athenaGreen,
                        boxShadow: `0 0 6px ${HADES_COLORS.athenaGreen}`,
                      }}
                      aria-label="Currently active"
                    />
                  )}
                </div>
                <p className="text-xs" style={{ color: HADES_COLORS.apolloOrange }}>
                  {band.genre} - {band.role}
                </p>
              </div>
              {band.url && (
                <a
                  href={band.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-50 hover:opacity-100 transition-opacity"
                  aria-label={`Visit ${band.name} website`}
                >
                  <svg viewBox="0 0 16 16" className="w-4 h-4">
                    <path
                      d="M4 12L12 4M12 4H6M12 4v6"
                      fill="none"
                      stroke={HADES_COLORS.apolloOrange}
                      strokeWidth="2"
                    />
                  </svg>
                </a>
              )}
            </div>
            <p className="text-xs" style={{ color: HADES_COLORS.textSecondary }}>
              {band.description}
            </p>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}

// =============================================================================
// EXPERIENCE CARD - Timeline entry
// =============================================================================
function ExperienceCard({ entry }: { entry: typeof EXPERIENCE_DATA[0] }) {
  const endDisplay = entry.endDate ? new Date(entry.endDate).getFullYear() : 'Present'
  const startDisplay = new Date(entry.startDate).getFullYear()

  return (
    <div
      className="relative p-4"
      style={{
        background: `linear-gradient(135deg, ${HADES_COLORS.stoneLight}80, ${HADES_COLORS.stoneMid})`,
        borderLeft: `3px solid ${HADES_COLORS.goldMid}`,
      }}
    >
      {/* Golden accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(90deg, ${HADES_COLORS.goldMid}, transparent)`,
        }}
        aria-hidden="true"
      />

      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="text-sm font-bold" style={{ color: HADES_COLORS.textPrimary }}>
            {entry.title}
          </h4>
          <p className="text-xs" style={{ color: HADES_COLORS.goldMid }}>
            {entry.organization}
          </p>
        </div>
        <span
          className="text-[10px] px-2 py-0.5"
          style={{
            background: `${HADES_COLORS.bloodMid}30`,
            border: `1px solid ${HADES_COLORS.bloodMid}50`,
            color: HADES_COLORS.bloodBright,
          }}
        >
          {startDisplay} - {endDisplay}
        </span>
      </div>

      <p className="text-xs mb-2" style={{ color: HADES_COLORS.textSecondary }}>
        {entry.description}
      </p>

      {entry.highlights && entry.highlights.length > 0 && (
        <ul className="space-y-1 mt-2">
          {entry.highlights.map((highlight, i) => (
            <li
              key={i}
              className="text-xs flex items-start gap-2"
              style={{ color: HADES_COLORS.textPrimary }}
            >
              <span style={{ color: HADES_COLORS.goldMid }} aria-hidden="true">&#9670;</span>
              {highlight}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// =============================================================================
// PROJECT CARD - Keepsake style
// =============================================================================
function ProjectCard({ project }: { project: typeof PROJECTS_DATA[0] }) {
  return (
    <div
      className="relative p-4 transition-all hover:translate-y-[-2px] group"
      style={{
        background: `linear-gradient(135deg, ${HADES_COLORS.stoneLight}, ${HADES_COLORS.stoneMid})`,
        border: `2px solid ${HADES_COLORS.bloodMid}60`,
        borderRadius: '4px',
      }}
    >
      {/* Blood drip accents */}
      <div
        className="absolute top-0 left-4 w-1 h-5 rounded-b-full"
        style={{ background: `linear-gradient(180deg, ${HADES_COLORS.bloodBright}, transparent)` }}
        aria-hidden="true"
      />
      <div
        className="absolute top-0 right-8 w-0.5 h-3 rounded-b-full"
        style={{ background: `linear-gradient(180deg, ${HADES_COLORS.bloodMid}, transparent)` }}
        aria-hidden="true"
      />

      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-bold" style={{ color: HADES_COLORS.bloodBright }}>
          {project.name}
        </h3>
        {project.featured && (
          <svg viewBox="0 0 20 24" className="w-4 h-5" aria-label="Featured project">
            <polygon points="10,0 20,6 20,18 10,24 0,18 0,6" fill={HADES_COLORS.goldMid} />
          </svg>
        )}
      </div>

      <p className="text-[10px] mb-2" style={{ color: HADES_COLORS.textSecondary }}>
        {project.tagline}
      </p>

      {project.impact && (
        <p className="text-[9px] mb-2 italic" style={{ color: HADES_COLORS.athenaGreen }}>
          {project.impact}
        </p>
      )}

      <div className="flex gap-1 flex-wrap">
        {project.techStack.slice(0, 4).map((tech) => (
          <span
            key={tech}
            className="text-[8px] px-2 py-0.5"
            style={{
              background: `${HADES_COLORS.bloodMid}20`,
              border: `1px solid ${HADES_COLORS.bloodMid}40`,
              color: HADES_COLORS.bloodBright,
            }}
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Hover glow */}
      <div
        className="absolute inset-0 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{
          boxShadow: `inset 0 0 20px ${HADES_COLORS.bloodMid}30, 0 0 15px ${HADES_COLORS.bloodMid}20`,
        }}
        aria-hidden="true"
      />
    </div>
  )
}

// =============================================================================
// CERBERUS SILHOUETTE
// =============================================================================
function Cerberus() {
  return (
    <div className="flex justify-center py-4" aria-hidden="true">
      <svg
        viewBox="0 0 180 70"
        className="w-40 h-16"
        style={{ filter: `drop-shadow(0 0 10px ${HADES_COLORS.bloodMid}60)` }}
      >
        {/* Body */}
        <ellipse cx="90" cy="55" rx="45" ry="15" fill={HADES_COLORS.stoneDeep} />

        {/* Left head */}
        <g transform="translate(45, 25)">
          <ellipse cx="0" cy="0" rx="12" ry="10" fill={HADES_COLORS.stoneDeep} />
          <ellipse cx="-4" cy="-2" rx="2" ry="2" fill={HADES_COLORS.bloodBright} />
          <path d="M-8 4 Q0 12 8 4" fill="none" stroke={HADES_COLORS.bloodMid} strokeWidth="1" />
        </g>

        {/* Center head (larger) */}
        <g transform="translate(90, 18)">
          <ellipse cx="0" cy="0" rx="15" ry="12" fill={HADES_COLORS.stoneDeep} />
          <ellipse cx="-5" cy="-3" rx="2.5" ry="2.5" fill={HADES_COLORS.bloodBright} />
          <ellipse cx="5" cy="-3" rx="2.5" ry="2.5" fill={HADES_COLORS.bloodBright} />
          <path d="M-10 6 Q0 16 10 6" fill="none" stroke={HADES_COLORS.bloodMid} strokeWidth="1.5" />
        </g>

        {/* Right head */}
        <g transform="translate(135, 25)">
          <ellipse cx="0" cy="0" rx="12" ry="10" fill={HADES_COLORS.stoneDeep} />
          <ellipse cx="4" cy="-2" rx="2" ry="2" fill={HADES_COLORS.bloodBright} />
          <path d="M-8 4 Q0 12 8 4" fill="none" stroke={HADES_COLORS.bloodMid} strokeWidth="1" />
        </g>

        {/* Legs */}
        <rect x="55" y="50" width="6" height="15" fill={HADES_COLORS.stoneDeep} rx="2" />
        <rect x="75" y="50" width="6" height="17" fill={HADES_COLORS.stoneDeep} rx="2" />
        <rect x="100" y="50" width="6" height="17" fill={HADES_COLORS.stoneDeep} rx="2" />
        <rect x="120" y="50" width="6" height="15" fill={HADES_COLORS.stoneDeep} rx="2" />
      </svg>
    </div>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function MythicTheme() {
  const { theme } = useTheme()
  const { active, setActive, config } = useProfession()
  const [mounted, setMounted] = useState(false)
  const reducedMotion = usePrefersReducedMotion()

  const aboutData = ABOUT_DATA[active]
  const skills = getSkillsByProfession(active)
  const projects = PROJECTS_DATA.filter(p => p.professions.includes(active) || p.featured)
  const experience = filterExperienceByProfession(EXPERIENCE_DATA, active)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const godColors = {
    engineer: HADES_COLORS.athenaGreen,
    drummer: HADES_COLORS.apolloOrange,
    fighter: HADES_COLORS.aresRed,
  }

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: `linear-gradient(180deg, ${HADES_COLORS.stoneLight}, ${HADES_COLORS.stoneMid}, ${HADES_COLORS.stoneDeep})`,
        fontFamily: '"Cinzel", "Georgia", serif',
      }}
      role="main"
      aria-label="Alexander Pulido - Portfolio"
    >
      <HadesPatternDefs />

      {/* Background effects */}
      <FloatingEmbers reducedMotion={reducedMotion} />
      <BloodVignette />
      <StyxRiver />

      {/* Side decorations */}
      <SideFlames side="left" reducedMotion={reducedMotion} />
      <SideFlames side="right" reducedMotion={reducedMotion} />

      {/* ========== HEADER ========== */}
      <header className="relative z-30 p-6" role="banner">
        <div className="max-w-6xl mx-auto flex justify-between items-start">
          <div className="flex items-center gap-4">
            {/* Laurel wreath icon */}
            <div className="relative flex-shrink-0">
              <LaurelWreath width={60} />
            </div>
            <div>
              <h1
                className="text-2xl md:text-3xl tracking-[0.15em]"
                style={{
                  color: HADES_COLORS.goldMid,
                  textShadow: `0 0 30px ${HADES_COLORS.goldMid}50, 0 2px 4px ${HADES_COLORS.stoneDeep}`,
                }}
              >
                ALEXANDER PULIDO
              </h1>
              <p
                className="text-sm tracking-widest mt-1"
                style={{ color: HADES_COLORS.textPrimary }}
              >
                {active === 'engineer' ? PROFESSIONAL_SUMMARY.headline.toUpperCase() : config.title.toUpperCase()}
              </p>
              <p
                className="text-xs tracking-wider italic mt-1"
                style={{ color: godColors[active] }}
              >
                {active === 'engineer' ? PROFESSIONAL_SUMMARY.tagline : aboutData.headline}
              </p>
            </div>
          </div>

          <nav className="flex gap-3 items-center" aria-label="Main navigation">
            <Link
              href="/cv"
              className="px-4 py-2 text-sm tracking-wider transition-all hover:scale-105 relative group"
              style={{
                background: 'transparent',
                border: `2px solid ${HADES_COLORS.goldMid}`,
                color: HADES_COLORS.goldMid,
              }}
            >
              <span className="relative z-10">CODEX</span>
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: `${HADES_COLORS.goldMid}20` }}
              />
            </Link>
            <Link
              href="/personal-projects/game-engine"
              className="px-4 py-2 text-sm tracking-wider transition-all hover:scale-105 relative overflow-hidden group"
              style={{
                background: `linear-gradient(180deg, ${HADES_COLORS.bloodBright}, ${HADES_COLORS.bloodDeep})`,
                color: HADES_COLORS.textPrimary,
                boxShadow: `0 0 15px ${HADES_COLORS.bloodMid}60`,
              }}
            >
              <span className="relative z-10">ENTER TARTARUS</span>
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  background: `linear-gradient(180deg, ${HADES_COLORS.bloodGlow}, ${HADES_COLORS.bloodBright})`,
                }}
              />
            </Link>
            <ThemeSwitcher />
          </nav>
        </div>
      </header>

      {/* ========== BOON SELECTION ========== */}
      <section
        className="relative z-20 py-6"
        role="region"
        aria-label="Select profession"
      >
        <div className="text-center mb-4">
          <span
            className="text-xs tracking-[0.3em]"
            style={{ color: HADES_COLORS.goldMid }}
          >
            CHOOSE YOUR PATRON
          </span>
        </div>
        <div
          className="flex justify-center gap-6 md:gap-8"
          role="radiogroup"
          aria-label="Profession selection"
        >
          {(['engineer', 'drummer', 'fighter'] as const).map((prof) => (
            <BoonCard
              key={prof}
              profession={prof}
              isActive={active === prof}
              onClick={() => setActive(prof)}
            />
          ))}
        </div>
      </section>

      {/* ========== MAIN CONTENT ========== */}
      <main className="relative z-20 px-20 py-8">
        <div className="max-w-4xl mx-auto">

          {/* ===== ABOUT SECTION ===== */}
          <SectionCard
            color={godColors[active]}
            ariaLabel="About section"
            className="mb-8"
          >
            {/* Header decorations */}
            <div className="absolute top-2 left-2">
              <SkullIcon size={24} />
            </div>
            <div className="absolute top-2 right-2">
              <SkullIcon size={24} />
            </div>

            <MeanderBorder className="mb-4 max-w-md mx-auto" />

            <SectionTitle color={HADES_COLORS.goldMid}>
              The Prince Speaks
            </SectionTitle>

            <p
              className="text-sm leading-relaxed italic max-w-2xl mx-auto text-center mb-4"
              style={{ color: HADES_COLORS.textPrimary }}
            >
              &ldquo;{active === 'engineer' ? PROFESSIONAL_SUMMARY.bio : aboutData.bio}&rdquo;
            </p>

            {/* Highlights for engineer */}
            {active === 'engineer' && PROFESSIONAL_SUMMARY.highlights && (
              <div className="flex justify-center gap-2 mt-4 flex-wrap">
                {PROFESSIONAL_SUMMARY.highlights.map((highlight, i) => (
                  <span
                    key={i}
                    className="text-[9px] px-3 py-1"
                    style={{
                      background: `${HADES_COLORS.athenaGreen}15`,
                      border: `1px solid ${HADES_COLORS.athenaGreen}40`,
                      color: HADES_COLORS.athenaGreen,
                    }}
                  >
                    {highlight}
                  </span>
                ))}
              </div>
            )}

            {/* Quick facts */}
            <div className="flex justify-center gap-3 mt-4 flex-wrap">
              {aboutData.quickFacts.map((fact, i) => (
                <span
                  key={i}
                  className="text-[10px] px-4 py-1"
                  style={{
                    background: `${HADES_COLORS.bloodMid}20`,
                    border: `1px solid ${HADES_COLORS.bloodMid}60`,
                    color: HADES_COLORS.bloodBright,
                  }}
                >
                  {fact}
                </span>
              ))}
            </div>

            <MeanderBorder className="mt-4 max-w-md mx-auto" />
          </SectionCard>

          <SpearDivider />

          {/* ===== CURRENT ROLES (Engineer only) ===== */}
          {active === 'engineer' && (
            <CurrentRolesSection color={godColors[active]} />
          )}

          {/* ===== COMPANIES (Engineer only) ===== */}
          {active === 'engineer' && <CompaniesSection />}

          {/* ===== BANDS (Drummer only) ===== */}
          {active === 'drummer' && <BandsSection />}

          {/* ===== WORK EXPERIENCE ===== */}
          {experience.length > 0 && (
            <SectionCard
              color={HADES_COLORS.goldMid}
              ariaLabel="Work experience"
              className="mb-8"
            >
              <MeanderBorder className="mb-4" />

              <SectionTitle color={HADES_COLORS.goldMid}>
                Trials Completed
              </SectionTitle>

              <div className="space-y-4">
                {experience.map((entry) => (
                  <ExperienceCard key={entry.id} entry={entry} />
                ))}
              </div>

              <div className="flex justify-center mt-4">
                <BoneDivider className="w-32" />
              </div>
            </SectionCard>
          )}

          <SpearDivider />

          {/* ===== GRID: SKILLS + PROJECTS ===== */}
          <div className="grid md:grid-cols-2 gap-8 mt-8">
            {/* Tech Stack / Skills */}
            <SectionCard
              color={godColors[active]}
              ariaLabel={active === 'engineer' ? 'Technology stack' : 'Skills and expertise'}
            >
              <BoneDivider className="absolute -top-2 left-1/2 -translate-x-1/2 w-24 opacity-50" />

              <SectionTitle color={godColors[active]}>
                {active === 'engineer' ? 'Arsenal' : 'Mastery'}
              </SectionTitle>

              {active === 'engineer' ? (
                <TechStackDisplay color={godColors[active]} />
              ) : (
                <SkillDisplay skills={skills} color={godColors[active]} />
              )}
            </SectionCard>

            {/* Projects */}
            <div>
              <SectionTitle color={HADES_COLORS.bloodBright}>
                Legendary Deeds
              </SectionTitle>

              <div className="space-y-4">
                {projects.slice(0, 4).map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ========== CERBERUS GUARDIAN ========== */}
      <div className="relative z-20 py-4">
        <Cerberus />
      </div>

      {/* ========== FOOTER ========== */}
      <footer className="relative z-20 py-8 text-center pb-32" role="contentinfo">
        <MeanderBorder className="max-w-sm mx-auto mb-4" />

        <p
          className="text-xs tracking-widest flex items-center justify-center gap-4"
          style={{ color: HADES_COLORS.textSecondary }}
        >
          <span style={{ color: HADES_COLORS.goldMid }} aria-hidden="true">&#9670;</span>
          DEATH IS NOT THE END
          <span style={{ color: HADES_COLORS.goldMid }} aria-hidden="true">&#9670;</span>
          <span aria-label="Year 2026">MMXXVI</span>
          <span style={{ color: HADES_COLORS.goldMid }} aria-hidden="true">&#9670;</span>
        </p>

        <MeanderBorder className="max-w-sm mx-auto mt-4" />
      </footer>

      {/* ========== CSS ANIMATIONS ========== */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&display=swap');

        @keyframes ember-float {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-100vh) scale(0.3);
          }
        }
        .animate-ember-float {
          animation: ember-float linear infinite;
        }

        @keyframes flame-flicker {
          0%, 100% {
            transform: scaleY(1) scaleX(1);
            opacity: 0.8;
          }
          50% {
            transform: scaleY(1.1) scaleX(0.9);
            opacity: 1;
          }
        }
        .animate-flame-flicker {
          animation: flame-flicker 0.4s ease-in-out infinite;
        }

        @keyframes styx-ripple {
          0%, 100% {
            opacity: 0.3;
            transform: scaleX(0.8);
          }
          50% {
            opacity: 0.6;
            transform: scaleX(1.2);
          }
        }
        .animate-styx-ripple {
          animation: styx-ripple 3s ease-in-out infinite;
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  )
}
