'use client'

import { useEffect, useState, useRef, useMemo } from 'react'
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

// ============================================================================
// WORLD OF WARCRAFT COLOR PALETTE
// Based on WoW's painted/stylized 3D aesthetic
// ============================================================================

const WOW = {
  // Alliance colors
  allianceGold: '#c9a227',
  allianceBlue: '#1a3a6e',
  allianceLightBlue: '#4488cc',
  stormwindStone: '#3d3d4a',

  // Horde colors (for accents)
  hordeRed: '#8c1616',
  hordeBlack: '#1a1010',
  orgrimmarBrown: '#5a3d2a',

  // Item rarity colors (iconic!)
  poorGray: '#9d9d9d',
  commonWhite: '#ffffff',
  uncommonGreen: '#1eff00',
  rareBlue: '#0070dd',
  epicPurple: '#a335ee',
  legendaryOrange: '#ff8000',
  artifactGold: '#e6cc80',

  // UI colors
  questYellow: '#ffff00',
  manaBlue: '#4169e1',
  healthGreen: '#00ff00',
  rageRed: '#ff0000',
  energyYellow: '#ffff00',
  runicBlue: '#00d1ff',

  // Character class colors
  warrior: '#c79c6e',
  paladin: '#f58cba',
  hunter: '#abd473',
  rogue: '#fff569',
  priest: '#ffffff',
  shaman: '#0070de',
  mage: '#69ccf0',
  warlock: '#9482c9',
  druid: '#ff7d0a',
  deathKnight: '#c41f3b',

  // Texture colors
  parchment: '#d4c4a8',
  parchmentDark: '#a89878',
  leather: '#6b4423',
  leatherLight: '#8b5a2b',
  metal: '#8b8b8b',
  goldTrim: '#ffd700',
  bronzeTrim: '#cd7f32',

  // Backgrounds
  darkBg: '#0a0808',
  panelBg: '#1a1612',
  panelBorder: '#3d3428',
}

// ============================================================================
// ALLIANCE LION CREST SVG
// ============================================================================

function AllianceCrest({ size = 80 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      aria-label="Alliance Crest"
      role="img"
    >
      {/* Shield background */}
      <path
        d="M50,5 L90,25 L90,60 Q90,85 50,95 Q10,85 10,60 L10,25 Z"
        fill={WOW.allianceBlue}
        stroke={WOW.allianceGold}
        strokeWidth="3"
      />
      {/* Inner shield */}
      <path
        d="M50,12 L82,28 L82,58 Q82,78 50,88 Q18,78 18,58 L18,28 Z"
        fill={`${WOW.allianceLightBlue}40`}
        stroke={WOW.allianceGold}
        strokeWidth="1"
      />
      {/* Lion silhouette - simplified heraldic style */}
      <g fill={WOW.allianceGold}>
        {/* Lion body */}
        <ellipse cx="50" cy="55" rx="18" ry="15" />
        {/* Lion head */}
        <circle cx="50" cy="38" r="12" />
        {/* Mane */}
        <path d="M38,30 Q32,35 35,45 Q38,42 40,40" />
        <path d="M62,30 Q68,35 65,45 Q62,42 60,40" />
        <path d="M42,28 Q38,25 40,35 Q43,33 44,32" />
        <path d="M58,28 Q62,25 60,35 Q57,33 56,32" />
        {/* Crown */}
        <path d="M40,25 L42,20 L46,24 L50,18 L54,24 L58,20 L60,25 L50,28 Z" />
        {/* Eyes - void */}
        <circle cx="45" cy="36" r="2" fill={WOW.allianceBlue} />
        <circle cx="55" cy="36" r="2" fill={WOW.allianceBlue} />
        {/* Front legs */}
        <rect x="38" y="62" width="6" height="14" rx="2" />
        <rect x="56" y="62" width="6" height="14" rx="2" />
        {/* Tail */}
        <path d="M68,52 Q78,48 75,58 Q72,55 70,54" />
      </g>
    </svg>
  )
}

// ============================================================================
// HORDE SYMBOL SVG
// ============================================================================

function HordeSymbol({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      aria-label="Horde Symbol"
      role="img"
    >
      {/* Horde emblem - angular, brutal */}
      <path
        d="M50,5 L65,25 L85,30 L75,50 L85,70 L65,75 L50,95 L35,75 L15,70 L25,50 L15,30 L35,25 Z"
        fill={WOW.hordeRed}
        stroke={WOW.hordeBlack}
        strokeWidth="3"
      />
      {/* Inner detail */}
      <path
        d="M50,20 L60,35 L75,38 L68,50 L75,62 L60,65 L50,80 L40,65 L25,62 L32,50 L25,38 L40,35 Z"
        fill={`${WOW.hordeRed}80`}
        stroke={WOW.allianceGold}
        strokeWidth="1"
      />
      {/* Central eye/skull motif */}
      <circle cx="50" cy="50" r="10" fill={WOW.hordeBlack} stroke={WOW.allianceGold} strokeWidth="1" />
      <circle cx="46" cy="48" r="2" fill={WOW.hordeRed} />
      <circle cx="54" cy="48" r="2" fill={WOW.hordeRed} />
      <path d="M45,54 Q50,58 55,54" stroke={WOW.hordeRed} strokeWidth="2" fill="none" />
    </svg>
  )
}

// ============================================================================
// QUEST MARKER SVG
// ============================================================================

function QuestMarker({
  type = 'available',
  size = 24
}: {
  type?: 'available' | 'progress' | 'complete'
  size?: number
}) {
  const colors = {
    available: WOW.questYellow, // Yellow ! for available
    progress: WOW.commonWhite, // White ? for in progress
    complete: WOW.questYellow, // Yellow ? for complete
  }
  const symbol = type === 'available' ? '!' : '?'

  return (
    <svg
      width={size}
      height={size * 1.5}
      viewBox="0 0 24 36"
      aria-label={`Quest ${type}`}
      role="img"
    >
      {/* Glowing background */}
      <defs>
        <filter id={`questGlow-${type}`}>
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <ellipse
        cx="12"
        cy="32"
        rx="8"
        ry="3"
        fill={`${colors[type]}40`}
        filter={`url(#questGlow-${type})`}
      />
      <text
        x="12"
        y="24"
        textAnchor="middle"
        fontSize="28"
        fontWeight="bold"
        fill={colors[type]}
        stroke={WOW.hordeBlack}
        strokeWidth="1"
        filter={`url(#questGlow-${type})`}
        style={{ fontFamily: 'serif' }}
      >
        {symbol}
      </text>
    </svg>
  )
}

// ============================================================================
// ABILITY ICON FRAME (like talent/spell icons)
// ============================================================================

function AbilityIcon({
  children,
  rarity = 'common',
  active = false,
  size = 48
}: {
  children: React.ReactNode
  rarity?: 'poor' | 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  active?: boolean
  size?: number
}) {
  const borderColors = {
    poor: WOW.poorGray,
    common: WOW.commonWhite,
    uncommon: WOW.uncommonGreen,
    rare: WOW.rareBlue,
    epic: WOW.epicPurple,
    legendary: WOW.legendaryOrange,
  }

  return (
    <div
      className="relative flex items-center justify-center transition-transform hover:scale-110"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${WOW.panelBg}, ${WOW.darkBg})`,
        border: `2px solid ${borderColors[rarity]}`,
        boxShadow: active
          ? `0 0 10px ${borderColors[rarity]}, inset 0 0 8px ${borderColors[rarity]}40`
          : `inset 0 2px 4px rgba(0,0,0,0.5)`,
      }}
      role="img"
    >
      {/* Corner accents */}
      <div
        className="absolute top-0 left-0 w-2 h-2"
        style={{ borderTop: `2px solid ${WOW.allianceGold}`, borderLeft: `2px solid ${WOW.allianceGold}` }}
      />
      <div
        className="absolute top-0 right-0 w-2 h-2"
        style={{ borderTop: `2px solid ${WOW.allianceGold}`, borderRight: `2px solid ${WOW.allianceGold}` }}
      />
      <div
        className="absolute bottom-0 left-0 w-2 h-2"
        style={{ borderBottom: `2px solid ${WOW.allianceGold}`, borderLeft: `2px solid ${WOW.allianceGold}` }}
      />
      <div
        className="absolute bottom-0 right-0 w-2 h-2"
        style={{ borderBottom: `2px solid ${WOW.allianceGold}`, borderRight: `2px solid ${WOW.allianceGold}` }}
      />
      {children}
    </div>
  )
}

// ============================================================================
// GOLD COIN SVG
// ============================================================================

function GoldCoin({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      aria-label="Gold coin"
      role="img"
    >
      <defs>
        <linearGradient id="coinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={WOW.goldTrim} />
          <stop offset="50%" stopColor={WOW.allianceGold} />
          <stop offset="100%" stopColor={WOW.bronzeTrim} />
        </linearGradient>
      </defs>
      <circle cx="10" cy="10" r="9" fill="url(#coinGradient)" stroke={WOW.bronzeTrim} strokeWidth="1" />
      <circle cx="10" cy="10" r="6" fill="none" stroke={WOW.bronzeTrim} strokeWidth="0.5" />
      <text x="10" y="14" textAnchor="middle" fontSize="10" fill={WOW.bronzeTrim} fontWeight="bold">G</text>
    </svg>
  )
}

// ============================================================================
// DUNGEON PORTAL EFFECT
// ============================================================================

function PortalEffect() {
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden opacity-30"
      aria-hidden="true"
    >
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] rounded-full"
        style={{
          background: `radial-gradient(ellipse, ${WOW.manaBlue}20 0%, transparent 40%)`,
          animation: 'portalPulse 4s ease-in-out infinite',
        }}
      />
      <style jsx>{`
        @keyframes portalPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
          50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}

// ============================================================================
// PARCHMENT CARD (Quest Log style)
// ============================================================================

function ParchmentCard({
  children,
  title,
  questType = 'normal',
  className = ''
}: {
  children: React.ReactNode
  title: string
  questType?: 'normal' | 'elite' | 'legendary'
  className?: string
}) {
  const borderColor = {
    normal: WOW.panelBorder,
    elite: WOW.epicPurple,
    legendary: WOW.legendaryOrange,
  }

  return (
    <section
      className={`relative ${className}`}
      style={{
        background: `linear-gradient(180deg, ${WOW.panelBg} 0%, #0f0c0a 100%)`,
        border: `3px solid ${borderColor[questType]}`,
        boxShadow: `
          inset 0 0 60px rgba(0,0,0,0.6),
          0 8px 32px rgba(0,0,0,0.5)
        `,
      }}
      aria-labelledby={`section-${title.toLowerCase().replace(/\s/g, '-')}`}
    >
      {/* Metal rivets in corners */}
      {['top-2 left-2', 'top-2 right-2', 'bottom-2 left-2', 'bottom-2 right-2'].map((pos, i) => (
        <div
          key={i}
          className={`absolute w-4 h-4 rounded-full ${pos}`}
          style={{
            background: `radial-gradient(circle at 30% 30%, ${WOW.goldTrim}, ${WOW.bronzeTrim})`,
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -1px 0 rgba(0,0,0,0.4)',
          }}
          aria-hidden="true"
        />
      ))}

      {/* Leather hinge on left */}
      <div
        className="absolute left-0 top-1/4 w-3 h-20"
        style={{
          background: `linear-gradient(90deg, ${WOW.leather}, ${WOW.leatherLight})`,
          borderRadius: '0 4px 4px 0',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute left-0 top-2/3 w-3 h-20"
        style={{
          background: `linear-gradient(90deg, ${WOW.leather}, ${WOW.leatherLight})`,
          borderRadius: '0 4px 4px 0',
        }}
        aria-hidden="true"
      />

      {/* Title banner */}
      <div
        className="absolute -top-4 left-1/2 -translate-x-1/2 px-8 py-2"
        style={{
          background: `linear-gradient(180deg, #2a2015 0%, #1a1510 100%)`,
          border: `2px solid ${WOW.allianceGold}`,
          boxShadow: `0 0 15px ${WOW.allianceGold}30`,
        }}
      >
        <h2
          id={`section-${title.toLowerCase().replace(/\s/g, '-')}`}
          className="text-sm tracking-[0.2em] uppercase font-bold whitespace-nowrap"
          style={{
            color: WOW.allianceGold,
            textShadow: `0 0 10px ${WOW.allianceGold}60`,
            fontFamily: '"Palatino Linotype", "Book Antiqua", Palatino, serif',
          }}
        >
          {questType === 'elite' && <span className="mr-2" aria-label="Elite">[+]</span>}
          {questType === 'legendary' && <span className="mr-2" aria-label="Legendary">[!!!]</span>}
          {title}
        </h2>
      </div>

      {/* Parchment texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at 20% 30%, ${WOW.parchment} 0%, transparent 50%),
            radial-gradient(ellipse at 80% 70%, ${WOW.parchment} 0%, transparent 50%)
          `,
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 pt-8 pb-6 px-8">
        {children}
      </div>
    </section>
  )
}

// ============================================================================
// STONE TABLET CARD
// ============================================================================

function StoneTablet({
  children,
  title,
  className = ''
}: {
  children: React.ReactNode
  title: string
  className?: string
}) {
  return (
    <section
      className={`relative ${className}`}
      style={{
        background: `linear-gradient(180deg, ${WOW.stormwindStone} 0%, #2a2a35 100%)`,
        border: `4px solid ${WOW.metal}`,
        borderRadius: '4px',
        boxShadow: `
          inset 0 2px 0 rgba(255,255,255,0.1),
          inset 0 -4px 8px rgba(0,0,0,0.4),
          0 8px 24px rgba(0,0,0,0.5)
        `,
      }}
      aria-labelledby={`tablet-${title.toLowerCase().replace(/\s/g, '-')}`}
    >
      {/* Carved title */}
      <div
        className="absolute -top-3 left-1/2 -translate-x-1/2"
        style={{
          background: WOW.stormwindStone,
          padding: '4px 24px',
          border: `2px solid ${WOW.metal}`,
        }}
      >
        <h3
          id={`tablet-${title.toLowerCase().replace(/\s/g, '-')}`}
          className="text-xs tracking-wider uppercase font-bold"
          style={{
            color: WOW.parchment,
            textShadow: '0 2px 4px rgba(0,0,0,0.5)',
          }}
        >
          {title}
        </h3>
      </div>

      {/* Stone crack details */}
      <svg
        className="absolute inset-0 w-full h-full opacity-10 pointer-events-none"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M10,0 L15,30 L5,60" stroke={WOW.darkBg} strokeWidth="1" fill="none" />
        <path d="M90%,100% L85%,70% L95%,40%" stroke={WOW.darkBg} strokeWidth="1" fill="none" />
      </svg>

      <div className="relative z-10 pt-6 pb-4 px-6">
        {children}
      </div>
    </section>
  )
}

// ============================================================================
// WOW-STYLE RESOURCE BAR (Health/Mana/Experience)
// ============================================================================

function ResourceBar({
  label,
  current,
  max,
  type = 'health',
  showText = true
}: {
  label: string
  current: number
  max: number
  type?: 'health' | 'mana' | 'experience' | 'rage' | 'energy'
  showText?: boolean
}) {
  const percent = Math.min(100, (current / max) * 100)

  const colors = {
    health: { bar: WOW.healthGreen, glow: WOW.healthGreen },
    mana: { bar: WOW.manaBlue, glow: WOW.manaBlue },
    experience: { bar: WOW.epicPurple, glow: WOW.epicPurple },
    rage: { bar: WOW.rageRed, glow: WOW.rageRed },
    energy: { bar: WOW.energyYellow, glow: WOW.energyYellow },
  }

  return (
    <div className="flex items-center gap-3" role="progressbar" aria-valuenow={current} aria-valuemin={0} aria-valuemax={max} aria-label={label}>
      <span
        className="text-[10px] uppercase tracking-wider w-12 text-right font-bold"
        style={{ color: WOW.parchmentDark }}
      >
        {label}
      </span>
      <div
        className="flex-1 h-5 relative overflow-hidden"
        style={{
          background: `linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%)`,
          border: `2px solid ${WOW.panelBorder}`,
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)',
        }}
      >
        {/* Bar fill */}
        <div
          className="absolute inset-0 transition-all duration-500"
          style={{
            width: `${percent}%`,
            background: `linear-gradient(180deg, ${colors[type].bar}cc 0%, ${colors[type].bar}99 50%, ${colors[type].bar}cc 100%)`,
            boxShadow: `0 0 8px ${colors[type].glow}60`,
          }}
        />
        {/* Tick marks */}
        <div className="absolute inset-0 flex justify-between px-px opacity-30">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="w-px h-full bg-black" />
          ))}
        </div>
        {/* Text overlay */}
        {showText && (
          <span
            className="absolute inset-0 flex items-center justify-center text-[10px] font-bold"
            style={{
              color: WOW.commonWhite,
              textShadow: '0 1px 2px rgba(0,0,0,0.8), 0 0 4px rgba(0,0,0,0.5)'
            }}
          >
            {current} / {max}
          </span>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// CLASS/PROFESSION SELECTOR (like character creation)
// ============================================================================

function ClassSelector({
  active,
  onSelect,
}: {
  active: 'engineer' | 'drummer' | 'fighter'
  onSelect: (p: 'engineer' | 'drummer' | 'fighter') => void
}) {
  const classes = [
    {
      id: 'engineer',
      name: 'Archmage',
      desc: 'Master of Systems',
      classColor: WOW.mage,
      icon: (
        <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
          <circle cx="16" cy="16" r="12" fill={WOW.mage} opacity="0.3" />
          <path d="M16,4 L18,14 L28,16 L18,18 L16,28 L14,18 L4,16 L14,14 Z" fill={WOW.mage} />
          <circle cx="16" cy="16" r="4" fill={WOW.commonWhite} />
        </svg>
      )
    },
    {
      id: 'drummer',
      name: 'Bard',
      desc: 'Keeper of Rhythm',
      classColor: WOW.shaman,
      icon: (
        <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
          <ellipse cx="16" cy="20" rx="10" ry="8" fill={WOW.shaman} opacity="0.3" />
          <ellipse cx="16" cy="18" rx="8" ry="6" fill={WOW.leather} stroke={WOW.shaman} strokeWidth="2" />
          <line x1="16" y1="4" x2="16" y2="12" stroke={WOW.shaman} strokeWidth="2" />
          <circle cx="16" cy="4" r="2" fill={WOW.shaman} />
        </svg>
      )
    },
    {
      id: 'fighter',
      name: 'Warrior',
      desc: 'Battle-Forged',
      classColor: WOW.warrior,
      icon: (
        <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
          <path d="M16,2 L20,12 L16,10 L12,12 Z" fill={WOW.warrior} />
          <path d="M8,14 L16,30 L24,14 L16,18 Z" fill={WOW.warrior} opacity="0.8" />
          <rect x="14" y="8" width="4" height="16" fill={WOW.metal} />
          <rect x="10" y="12" width="12" height="3" fill={WOW.warrior} />
        </svg>
      )
    },
  ] as const

  return (
    <nav
      className="flex justify-center gap-4 md:gap-8 py-6"
      role="tablist"
      aria-label="Profession selection"
    >
      {classes.map((cls) => (
        <button
          key={cls.id}
          onClick={() => onSelect(cls.id)}
          role="tab"
          aria-selected={active === cls.id}
          aria-controls={`panel-${cls.id}`}
          className="relative group focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          style={{
            ['--ring-color' as string]: cls.classColor,
          }}
        >
          <div
            className={`w-24 md:w-32 h-32 md:h-40 flex flex-col items-center justify-center gap-2 transition-all duration-300 ${
              active === cls.id ? 'scale-105' : 'hover:scale-102 opacity-70 hover:opacity-100'
            }`}
            style={{
              background: active === cls.id
                ? `linear-gradient(180deg, ${cls.classColor}30 0%, ${WOW.darkBg} 100%)`
                : `linear-gradient(180deg, ${WOW.panelBg} 0%, ${WOW.darkBg} 100%)`,
              border: `3px solid ${active === cls.id ? cls.classColor : WOW.panelBorder}`,
              boxShadow: active === cls.id
                ? `0 0 30px ${cls.classColor}40, inset 0 0 20px ${cls.classColor}20`
                : '0 4px 12px rgba(0,0,0,0.4)',
            }}
          >
            {/* Class icon */}
            <div className="relative">
              {cls.icon}
              {active === cls.id && (
                <div
                  className="absolute inset-0 animate-pulse"
                  style={{ filter: `drop-shadow(0 0 8px ${cls.classColor})` }}
                >
                  {cls.icon}
                </div>
              )}
            </div>

            {/* Class name */}
            <span
              className="text-sm font-bold tracking-wider"
              style={{
                color: active === cls.id ? cls.classColor : WOW.parchmentDark,
                textShadow: active === cls.id ? `0 0 10px ${cls.classColor}80` : 'none',
              }}
            >
              {cls.name}
            </span>

            {/* Description */}
            <span
              className="text-[10px] opacity-70"
              style={{ color: WOW.parchment }}
            >
              {cls.desc}
            </span>
          </div>

          {/* Selection indicator */}
          {active === cls.id && (
            <div
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45"
              style={{ background: cls.classColor }}
              aria-hidden="true"
            />
          )}
        </button>
      ))}
    </nav>
  )
}

// ============================================================================
// TECH STACK AS TALENT TREE
// ============================================================================

function TalentTree({ categories }: { categories: ReturnType<typeof getEngineerSkills> }) {
  const rarityByIndex = ['legendary', 'epic', 'rare', 'uncommon', 'common'] as const

  return (
    <div className="space-y-8">
      {categories.slice(0, 6).map((category, catIndex) => (
        <div key={category.name}>
          {/* Category header like talent tree tier */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xl">{category.icon}</span>
            <h3
              className="text-sm tracking-wider uppercase font-bold"
              style={{
                color: WOW.allianceGold,
                textShadow: `0 0 8px ${WOW.allianceGold}40`,
              }}
            >
              {category.name}
            </h3>
            <div
              className="flex-1 h-px"
              style={{ background: `linear-gradient(90deg, ${WOW.allianceGold}60, transparent)` }}
              aria-hidden="true"
            />
          </div>

          {/* Skills as ability icons */}
          <div className="flex flex-wrap gap-3">
            {category.items.map((tech, techIndex) => {
              const rarity = rarityByIndex[Math.min(catIndex, rarityByIndex.length - 1)]
              return (
                <div
                  key={tech}
                  className="group relative"
                >
                  <div
                    className="px-3 py-2 text-xs font-bold transition-all cursor-default hover:scale-105"
                    style={{
                      background: `linear-gradient(180deg, ${WOW.panelBg} 0%, ${WOW.darkBg} 100%)`,
                      border: `2px solid ${WOW[`${rarity}${rarity === 'common' ? 'White' : rarity === 'uncommon' ? 'Green' : rarity === 'rare' ? 'Blue' : rarity === 'epic' ? 'Purple' : 'Orange'}`] || WOW.panelBorder}`,
                      color: WOW.parchment,
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)',
                    }}
                  >
                    {tech}
                  </div>
                  {/* Tooltip on hover */}
                  <div
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap"
                    style={{
                      background: WOW.darkBg,
                      border: `1px solid ${WOW.allianceGold}`,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.8)',
                    }}
                    role="tooltip"
                  >
                    <span className="text-[10px]" style={{ color: WOW.parchment }}>
                      Proficiency: <span style={{ color: WOW.uncommonGreen }}>Mastered</span>
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

// ============================================================================
// SKILLS LIST (for drummer/fighter)
// ============================================================================

function SkillsList({ categories }: { categories: ReturnType<typeof getSkillsByProfession> }) {
  return (
    <div className="grid md:grid-cols-3 gap-8">
      {categories.map((category) => (
        <div key={category.name}>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">{category.icon}</span>
            <h3
              className="text-sm tracking-wider uppercase font-bold"
              style={{ color: WOW.allianceGold }}
            >
              {category.name}
            </h3>
          </div>
          <ul className="space-y-2" role="list">
            {category.skills.map((skill) => (
              <li
                key={skill.name}
                className="flex items-center gap-2 text-sm"
                style={{ color: WOW.parchment }}
              >
                <QuestMarker type="complete" size={12} />
                <span>{skill.name}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

// ============================================================================
// EXPERIENCE CARD (Quest completed style)
// ============================================================================

function ExperienceCard({ entry }: { entry: typeof EXPERIENCE_DATA[0] }) {
  const endDisplay = entry.endDate ? new Date(entry.endDate).getFullYear() : 'Present'
  const startDisplay = new Date(entry.startDate).getFullYear()
  const isCurrentRole = !entry.endDate

  return (
    <article
      className="p-4 transition-all hover:scale-[1.01]"
      style={{
        background: `linear-gradient(135deg, ${WOW.panelBg} 0%, ${WOW.darkBg} 100%)`,
        border: `2px solid ${isCurrentRole ? WOW.epicPurple : WOW.panelBorder}`,
        boxShadow: isCurrentRole ? `0 0 15px ${WOW.epicPurple}30` : 'none',
      }}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-start gap-2">
          <QuestMarker type={isCurrentRole ? 'progress' : 'complete'} size={16} />
          <div>
            <h4 className="text-sm font-bold" style={{ color: WOW.parchment }}>
              {entry.title}
            </h4>
            <p className="text-xs" style={{ color: WOW.allianceGold }}>
              {entry.organization}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <GoldCoin size={14} />
          <span className="text-[10px]" style={{ color: WOW.parchmentDark }}>
            {startDisplay} - {endDisplay}
          </span>
        </div>
      </div>

      <p className="text-xs mb-3 pl-6" style={{ color: WOW.parchmentDark }}>
        {entry.description}
      </p>

      {entry.highlights && entry.highlights.length > 0 && (
        <ul className="space-y-1 pl-6" role="list">
          {entry.highlights.map((highlight, i) => (
            <li
              key={i}
              className="text-xs flex items-start gap-2"
              style={{ color: WOW.parchment }}
            >
              <span style={{ color: WOW.uncommonGreen }} aria-hidden="true">+</span>
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

// ============================================================================
// PROJECT CARD (Raid/Dungeon style)
// ============================================================================

function ProjectCard({ project }: { project: typeof PROJECTS_DATA[0] }) {
  const difficulty = project.featured ? 'legendary' : 'rare'

  return (
    <article
      className="p-4 transition-all hover:scale-[1.02] cursor-pointer group"
      style={{
        background: `linear-gradient(135deg, ${WOW.panelBg} 0%, ${WOW.darkBg} 100%)`,
        border: `2px solid ${project.featured ? WOW.legendaryOrange : WOW.rareBlue}`,
        boxShadow: project.featured ? `0 0 20px ${WOW.legendaryOrange}30` : '0 4px 12px rgba(0,0,0,0.4)',
      }}
    >
      {project.featured && (
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] tracking-wider font-bold" style={{ color: WOW.legendaryOrange }}>
            LEGENDARY
          </span>
          <div className="flex gap-1" aria-hidden="true">
            {[...Array(3)].map((_, i) => <GoldCoin key={i} size={10} />)}
          </div>
        </div>
      )}

      <h4
        className="text-sm font-bold mb-1 group-hover:text-yellow-300 transition-colors"
        style={{ color: project.featured ? WOW.legendaryOrange : WOW.rareBlue }}
      >
        {project.name}
      </h4>

      <p className="text-xs mb-3" style={{ color: WOW.parchmentDark }}>
        {project.tagline}
      </p>

      {project.impact && (
        <p className="text-xs mb-3 italic" style={{ color: WOW.uncommonGreen }}>
          <span aria-hidden="true">+</span> {project.impact}
        </p>
      )}

      <div className="flex flex-wrap gap-1">
        {project.techStack.slice(0, 4).map((tech, i) => (
          <span
            key={tech}
            className="text-[9px] px-2 py-0.5 font-bold"
            style={{
              background: `${WOW.manaBlue}30`,
              border: `1px solid ${WOW.manaBlue}60`,
              color: WOW.runicBlue,
            }}
          >
            {tech}
          </span>
        ))}
      </div>
    </article>
  )
}

// ============================================================================
// COMPANY CARD (Faction Outpost style)
// ============================================================================

function CompanyCard({ company }: { company: typeof COMPANIES[0] }) {
  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 transition-all hover:scale-[1.02] group"
      style={{
        background: `linear-gradient(135deg, ${WOW.panelBg} 0%, ${WOW.darkBg} 100%)`,
        border: `2px solid ${WOW.panelBorder}`,
      }}
      aria-label={`${company.name} - ${company.tagline}`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-10 h-10 flex items-center justify-center text-xl"
          style={{
            background: `linear-gradient(135deg, ${WOW.allianceBlue}60, ${WOW.darkBg})`,
            border: `2px solid ${WOW.allianceGold}`,
          }}
        >
          {company.icon}
        </div>
        <div>
          <h4
            className="text-sm font-bold group-hover:text-yellow-300 transition-colors"
            style={{ color: WOW.parchment }}
          >
            {company.name}
          </h4>
          <p className="text-[10px]" style={{ color: WOW.allianceGold }}>
            {company.tagline}
          </p>
        </div>
      </div>
      <p className="text-xs" style={{ color: WOW.parchmentDark }}>
        {company.description}
      </p>
    </a>
  )
}

// ============================================================================
// BAND CARD (Guild style)
// ============================================================================

function BandCard({ band }: { band: typeof BANDS[0] }) {
  const content = (
    <article
      className="p-4 transition-all hover:scale-[1.02] group"
      style={{
        background: `linear-gradient(135deg, ${WOW.panelBg} 0%, ${WOW.darkBg} 100%)`,
        border: `2px solid ${WOW.panelBorder}`,
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <HordeSymbol size={24} />
        <div>
          <h4
            className="text-sm font-bold group-hover:text-yellow-300 transition-colors"
            style={{ color: WOW.parchment }}
          >
            {band.name}
          </h4>
          <p className="text-[10px]" style={{ color: WOW.allianceGold }}>
            {band.genre} | {band.role}
          </p>
        </div>
      </div>
      <p className="text-xs" style={{ color: WOW.parchmentDark }}>
        {band.description}
      </p>
      {band.active && (
        <div className="mt-2 flex items-center gap-1">
          <div
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: WOW.healthGreen, boxShadow: `0 0 6px ${WOW.healthGreen}` }}
            aria-hidden="true"
          />
          <span className="text-[10px]" style={{ color: WOW.healthGreen }}>Active</span>
        </div>
      )}
    </article>
  )

  if (band.url) {
    return (
      <a href={band.url} target="_blank" rel="noopener noreferrer" className="block" aria-label={`${band.name} - ${band.genre}`}>
        {content}
      </a>
    )
  }
  return content
}

// ============================================================================
// FLOATING PARTICLES (Arcane magic style)
// ============================================================================

function ArcaneParticles() {
  const particles = useMemo(() =>
    Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      opacity: Math.random() * 0.4 + 0.1,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * -20,
    })),
  [])

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[2] overflow-hidden"
      aria-hidden="true"
    >
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: WOW.manaBlue,
            opacity: p.opacity,
            boxShadow: `0 0 ${p.size * 2}px ${WOW.manaBlue}`,
            animation: `arcaneFloat ${p.duration}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes arcaneFloat {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-30px) translateX(10px); }
          50% { transform: translateY(-10px) translateX(-10px); }
          75% { transform: translateY(-40px) translateX(5px); }
        }
      `}</style>
    </div>
  )
}

// ============================================================================
// MAIN THEME COMPONENT
// ============================================================================

export default function MedievalFantasyTheme() {
  useTheme()
  const { active, setActive } = useProfession()
  const [mounted, setMounted] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  const aboutData = ABOUT_DATA[active]
  const engineerTech = getEngineerSkills()
  const otherSkills = getSkillsByProfession(active)
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

  if (!mounted) return null

  return (
    <div
      className="min-h-screen relative overflow-x-hidden"
      style={{
        background: `linear-gradient(180deg, ${WOW.darkBg} 0%, #0d0a08 50%, ${WOW.darkBg} 100%)`,
        fontFamily: '"Palatino Linotype", "Book Antiqua", Palatino, serif',
      }}
    >
      {/* Arcane floating particles */}
      {!prefersReducedMotion && <ArcaneParticles />}

      {/* Portal effect background */}
      {!prefersReducedMotion && <PortalEffect />}

      {/* Top Alliance banner */}
      <div
        className="fixed top-0 left-0 right-0 h-1 z-50"
        style={{
          background: `linear-gradient(90deg, transparent, ${WOW.allianceGold}, transparent)`,
        }}
        aria-hidden="true"
      />

      {/* Header */}
      <header className="relative z-40 p-4 md:p-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-4">
          {/* Left: Name and info */}
          <div className="flex items-start gap-4">
            <AllianceCrest size={60} />
            <div>
              <h1
                className="text-2xl md:text-4xl font-bold tracking-wide"
                style={{
                  color: WOW.allianceGold,
                  textShadow: `2px 2px 0 ${WOW.darkBg}, 0 0 20px ${WOW.allianceGold}50`,
                }}
              >
                ALEXANDER PULIDO
              </h1>
              <p className="text-sm md:text-lg mt-1" style={{ color: WOW.parchment }}>
                {PROFESSIONAL_SUMMARY.headline}
              </p>
              <p className="text-xs md:text-sm mt-1 italic" style={{ color: WOW.allianceGold }}>
                {PROFESSIONAL_SUMMARY.tagline}
              </p>

              {/* Resource bars */}
              <div className="mt-4 space-y-1 w-48 md:w-64">
                <ResourceBar label="EXP" current={85} max={100} type="experience" />
                <ResourceBar label="MANA" current={100} max={100} type="mana" />
              </div>
            </div>
          </div>

          {/* Right: Navigation */}
          <div className="flex flex-wrap gap-2 md:gap-4 items-center">
            <Link
              href="/cv"
              className="px-3 md:px-4 py-2 text-xs md:text-sm font-bold tracking-wider transition-all hover:scale-105 focus:outline-none focus-visible:ring-2"
              style={{
                background: `linear-gradient(180deg, ${WOW.panelBg} 0%, ${WOW.darkBg} 100%)`,
                border: `2px solid ${WOW.allianceGold}`,
                color: WOW.allianceGold,
                boxShadow: `0 4px 0 ${WOW.darkBg}`,
              }}
            >
              SCROLL
            </Link>
            <Link
              href="/personal-projects/game-engine"
              className="px-3 md:px-4 py-2 text-xs md:text-sm font-bold tracking-wider transition-all hover:scale-105 focus:outline-none focus-visible:ring-2"
              style={{
                background: `linear-gradient(180deg, ${WOW.allianceBlue}60 0%, ${WOW.darkBg} 100%)`,
                border: `2px solid ${WOW.manaBlue}`,
                color: WOW.runicBlue,
                boxShadow: `0 4px 0 ${WOW.darkBg}`,
              }}
            >
              NEBULITH
            </Link>
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      {/* Current Roles */}
      <section className="relative z-30 py-4 px-4 md:px-6" aria-labelledby="current-roles-heading">
        <h2 id="current-roles-heading" className="sr-only">Current Roles</h2>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            {CURRENT_ROLES.map((role) => (
              <div key={role.id} className="text-center flex items-center gap-2">
                <QuestMarker type="progress" size={16} />
                <div>
                  <p className="text-xs md:text-sm font-bold" style={{ color: WOW.allianceGold }}>
                    {role.title}
                  </p>
                  <p className="text-sm md:text-lg" style={{ color: WOW.parchment }}>
                    {role.company}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Class/Profession Selection */}
      <section className="relative z-30 py-4" aria-label="Select profession">
        <ClassSelector active={active} onSelect={setActive} />
      </section>

      {/* Main Content */}
      <main className="relative z-20 py-8 px-4 md:px-6 space-y-12">
        <div className="max-w-4xl mx-auto space-y-12">

          {/* About Section */}
          <ParchmentCard title="About" questType="normal">
            <p className="text-sm leading-relaxed mb-4" style={{ color: WOW.parchment }}>
              {aboutData.bio}
            </p>
            <div className="flex flex-wrap gap-2">
              {aboutData.quickFacts.map((fact, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-xs font-bold"
                  style={{
                    background: `${WOW.allianceGold}15`,
                    border: `1px solid ${WOW.allianceGold}60`,
                    color: WOW.allianceGold,
                  }}
                >
                  {fact}
                </span>
              ))}
            </div>
          </ParchmentCard>

          {/* Work Experience */}
          {experience.length > 0 && (
            <ParchmentCard title="Campaigns" questType="elite">
              <div className="space-y-4">
                {experience.map((entry) => (
                  <ExperienceCard key={entry.id} entry={entry} />
                ))}
              </div>
            </ParchmentCard>
          )}

          {/* Tech Stack / Skills */}
          <ParchmentCard
            title={active === 'engineer' ? 'Spellbook' : 'Abilities'}
            questType={active === 'engineer' ? 'legendary' : 'normal'}
          >
            {active === 'engineer' ? (
              <TalentTree categories={engineerTech} />
            ) : (
              <SkillsList categories={otherSkills} />
            )}
          </ParchmentCard>

          {/* Projects */}
          <ParchmentCard title="Dungeons Conquered" questType="elite">
            <div className="grid md:grid-cols-2 gap-4">
              {projects.filter(p => p.featured).slice(0, 6).map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </ParchmentCard>

          {/* Companies (Engineer) / Bands (Drummer) */}
          {active === 'engineer' && (
            <ParchmentCard title="Allied Outposts">
              <div className="grid md:grid-cols-3 gap-4">
                {COMPANIES.map((company) => (
                  <CompanyCard key={company.id} company={company} />
                ))}
              </div>
            </ParchmentCard>
          )}

          {active === 'drummer' && (
            <ParchmentCard title="Guilds">
              <div className="grid md:grid-cols-3 gap-4">
                {BANDS.map((band) => (
                  <BandCard key={band.id} band={band} />
                ))}
              </div>
            </ParchmentCard>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 py-12 text-center">
        <div className="flex justify-center mb-4">
          <AllianceCrest size={50} />
        </div>
        <p className="text-sm font-bold" style={{ color: WOW.allianceGold }}>
          FOR THE ALLIANCE
        </p>
        <p className="text-xs mt-2" style={{ color: WOW.parchmentDark }}>
          Stormwind, Azeroth
        </p>
        <div className="flex justify-center gap-6 mt-6">
          <AllianceCrest size={24} />
          <HordeSymbol size={24} />
          <AllianceCrest size={24} />
        </div>
      </footer>

      {/* Reduced motion styles */}
      <style jsx global>{`
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  )
}
