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

// ============================================================================
// WARCRAFT RTS COLOR PALETTE (Warcraft 1, 2, 3 - NOT World of Warcraft!)
// ============================================================================

const WC3 = {
  // Human Alliance
  humanBlue: '#0042FF',
  humanGold: '#FFD700',
  humanGoldDark: '#DAA520',
  humanSilver: '#C0C0C0',

  // Orc Horde
  orcRed: '#FF0000',
  orcRedDark: '#CC0000',
  orcBrown: '#8B4513',
  orcBrownDark: '#654321',

  // Night Elf
  elfPurple: '#800080',
  elfPurpleLight: '#9932CC',
  elfSilver: '#C0C0C0',
  elfSilverDark: '#A8A8A8',

  // Undead Scourge
  undeadGreen: '#00FF00',
  undeadGreenDark: '#00CC00',
  undeadBone: '#D2B48C',
  undeadBoneDark: '#C4A76C',

  // UI Gold (WC3 interface)
  uiGold: '#FFD700',
  uiGoldDark: '#B8860B',
  lumber: '#8B4513',
  stone: '#696969',
  stoneDark: '#808080',

  // Panel colors
  panelDark: '#1A1612',
  panelMid: '#2A2318',
  panelBorder: '#6B5A3C',
  panelGold: '#C9A227',

  // Health/Mana (classic segmented bars)
  healthGreen: '#00FF00',
  healthYellow: '#FFFF00',
  healthRed: '#FF0000',
  manaBlue: '#0000FF',

  // Text
  textGold: '#FFD700',
  textWhite: '#FFFFFF',
  textGray: '#AAAAAA',
}

// ============================================================================
// RESOURCE ICONS (Gold, Lumber, Food - WC3 Top Bar Style)
// ============================================================================

function GoldIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" aria-label="Gold">
      <ellipse cx="8" cy="12" rx="6" ry="2" fill={WC3.uiGoldDark} />
      <ellipse cx="8" cy="11" rx="6" ry="2" fill={WC3.uiGold} />
      <ellipse cx="8" cy="9" rx="5" ry="1.5" fill={WC3.uiGoldDark} />
      <ellipse cx="8" cy="8" rx="5" ry="1.5" fill={WC3.uiGold} />
      <ellipse cx="8" cy="6" rx="4" ry="1" fill={WC3.uiGoldDark} />
      <ellipse cx="8" cy="5" rx="4" ry="1" fill={WC3.uiGold} />
    </svg>
  )
}

function LumberIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" aria-label="Lumber">
      <rect x="2" y="10" width="12" height="4" rx="2" fill="#5C4033" />
      <rect x="3" y="10" width="10" height="1" fill="#8B6914" />
      <rect x="3" y="6" width="10" height="4" rx="2" fill="#6B4423" />
      <rect x="4" y="6" width="8" height="1" fill="#A0724A" />
      <rect x="5" y="3" width="6" height="3" rx="1.5" fill="#7B5433" />
      <rect x="6" y="3" width="4" height="1" fill="#B08050" />
    </svg>
  )
}

function FoodIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" aria-label="Food">
      <ellipse cx="8" cy="13" rx="5" ry="2" fill="#4A3728" />
      <path d="M8,2 L8,13" stroke="#D4A017" strokeWidth="1" />
      <path d="M5,3 L5,12" stroke="#D4A017" strokeWidth="1" />
      <path d="M11,3 L11,12" stroke="#D4A017" strokeWidth="1" />
      <ellipse cx="8" cy="2" rx="1.5" ry="2" fill={WC3.uiGold} />
      <ellipse cx="5" cy="3" rx="1" ry="1.5" fill={WC3.uiGold} />
      <ellipse cx="11" cy="3" rx="1" ry="1.5" fill={WC3.uiGold} />
    </svg>
  )
}

// ============================================================================
// FACTION CRESTS (Human Lion, Orc Wolf/Skull, Night Elf Owl/Moon, Undead Skull)
// ============================================================================

function HumanCrest({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-label="Human Alliance">
      {/* Shield */}
      <path
        d="M32,4 L58,16 L58,38 Q58,54 32,60 Q6,54 6,38 L6,16 Z"
        fill={WC3.humanBlue}
        stroke={WC3.humanGold}
        strokeWidth="3"
      />
      {/* Inner border */}
      <path
        d="M32,10 L52,20 L52,36 Q52,48 32,54 Q12,48 12,36 L12,20 Z"
        fill="none"
        stroke={WC3.humanGoldDark}
        strokeWidth="1"
        opacity="0.6"
      />
      {/* Stylized Lion Head */}
      <g fill={WC3.humanGold}>
        {/* Mane */}
        <path d="M32,16 L26,12 L24,18 L20,14 L22,22 L18,20 L22,26 L16,26 L22,30 Z" />
        <path d="M32,16 L38,12 L40,18 L44,14 L42,22 L46,20 L42,26 L48,26 L42,30 Z" />
        {/* Face */}
        <ellipse cx="32" cy="30" rx="10" ry="12" />
        {/* Eyes */}
        <circle cx="28" cy="28" r="2" fill={WC3.humanBlue} />
        <circle cx="36" cy="28" r="2" fill={WC3.humanBlue} />
        {/* Nose */}
        <ellipse cx="32" cy="34" rx="3" ry="2" fill={WC3.humanGoldDark} />
        {/* Crown */}
        <path d="M24,14 L26,8 L29,12 L32,6 L35,12 L38,8 L40,14 Z" />
      </g>
    </svg>
  )
}

function OrcCrest({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-label="Orc Horde">
      {/* Angular Horde Shield */}
      <path
        d="M32,4 L56,18 L56,42 L32,60 L8,42 L8,18 Z"
        fill="#0A0505"
        stroke={WC3.orcRed}
        strokeWidth="3"
      />
      {/* Inner angular border */}
      <path
        d="M32,12 L48,22 L48,38 L32,52 L16,38 L16,22 Z"
        fill="none"
        stroke={WC3.orcRedDark}
        strokeWidth="1"
        opacity="0.6"
      />
      {/* Stylized Orc Skull/Wolf */}
      <g fill={WC3.orcRed}>
        {/* Central emblem - war banner style */}
        <path d="M32,18 L42,32 L32,46 L22,32 Z" />
        {/* Tusks */}
        <path d="M22,26 L16,34 L22,32 Z" />
        <path d="M42,26 L48,34 L42,32 Z" />
        {/* Eye sockets */}
        <circle cx="27" cy="28" r="3" fill="#0A0505" />
        <circle cx="37" cy="28" r="3" fill="#0A0505" />
        {/* Inner eye glow */}
        <circle cx="27" cy="28" r="1.5" fill={WC3.orcRedDark} />
        <circle cx="37" cy="28" r="1.5" fill={WC3.orcRedDark} />
        {/* Teeth */}
        <rect x="28" y="38" width="8" height="4" fill={WC3.orcRed} />
        <line x1="30" y1="38" x2="30" y2="42" stroke="#0A0505" strokeWidth="1" />
        <line x1="32" y1="38" x2="32" y2="42" stroke="#0A0505" strokeWidth="1" />
        <line x1="34" y1="38" x2="34" y2="42" stroke="#0A0505" strokeWidth="1" />
      </g>
    </svg>
  )
}

function NightElfCrest({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-label="Night Elf Sentinels">
      {/* Curved Elven Shield */}
      <path
        d="M32,4 Q58,14 58,34 Q58,54 32,60 Q6,54 6,34 Q6,14 32,4 Z"
        fill={WC3.elfPurple}
        stroke={WC3.elfSilver}
        strokeWidth="3"
      />
      {/* Moon Crescent */}
      <g fill={WC3.elfSilver}>
        <circle cx="32" cy="24" r="12" />
        <circle cx="38" cy="22" r="10" fill={WC3.elfPurple} />
      </g>
      {/* Owl Eyes */}
      <g>
        <ellipse cx="24" cy="44" rx="5" ry="6" fill={WC3.elfSilver} />
        <ellipse cx="40" cy="44" rx="5" ry="6" fill={WC3.elfSilver} />
        <ellipse cx="24" cy="44" rx="3" ry="4" fill="#00FF7F" />
        <ellipse cx="40" cy="44" rx="3" ry="4" fill="#00FF7F" />
        <circle cx="24" cy="44" r="1.5" fill={WC3.elfPurple} />
        <circle cx="40" cy="44" r="1.5" fill={WC3.elfPurple} />
      </g>
      {/* Beak */}
      <path d="M32,48 L30,52 L32,54 L34,52 Z" fill={WC3.elfSilverDark} />
    </svg>
  )
}

function UndeadCrest({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-label="Undead Scourge">
      {/* Jagged Shield */}
      <path
        d="M32,4 L50,10 L58,28 L52,46 L32,60 L12,46 L6,28 L14,10 Z"
        fill="#0A0A0A"
        stroke={WC3.undeadGreen}
        strokeWidth="3"
      />
      {/* Skull */}
      <g fill={WC3.undeadBone}>
        <ellipse cx="32" cy="28" rx="14" ry="16" />
        {/* Eye sockets */}
        <ellipse cx="26" cy="26" rx="4" ry="5" fill={WC3.undeadGreen} />
        <ellipse cx="38" cy="26" rx="4" ry="5" fill={WC3.undeadGreen} />
        {/* Nose hole */}
        <path d="M32,32 L30,38 L34,38 Z" fill="#0A0A0A" />
        {/* Jaw/Teeth */}
        <rect x="22" y="40" width="20" height="6" rx="1" />
        <line x1="25" y1="40" x2="25" y2="46" stroke="#0A0A0A" strokeWidth="1" />
        <line x1="28" y1="40" x2="28" y2="46" stroke="#0A0A0A" strokeWidth="1" />
        <line x1="31" y1="40" x2="31" y2="46" stroke="#0A0A0A" strokeWidth="1" />
        <line x1="34" y1="40" x2="34" y2="46" stroke="#0A0A0A" strokeWidth="1" />
        <line x1="37" y1="40" x2="37" y2="46" stroke="#0A0A0A" strokeWidth="1" />
        <line x1="40" y1="40" x2="40" y2="46" stroke="#0A0A0A" strokeWidth="1" />
      </g>
    </svg>
  )
}

// ============================================================================
// WC3 UNIT SILHOUETTES (Peasant, Peon, Wisp, Acolyte)
// ============================================================================

function PeasantUnit({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-label="Peasant">
      {/* Body */}
      <ellipse cx="16" cy="22" rx="6" ry="8" fill={WC3.humanBlue} />
      {/* Head */}
      <circle cx="16" cy="10" r="5" fill="#FFDAB9" />
      {/* Hat */}
      <path d="M11,8 L16,3 L21,8 Z" fill={WC3.humanGold} />
      {/* Pick/tool */}
      <path d="M22,14 L28,8" stroke="#8B4513" strokeWidth="2" />
      <path d="M26,6 L28,8 L30,6" stroke="#808080" strokeWidth="2" fill="none" />
    </svg>
  )
}

function PeonUnit({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-label="Peon">
      {/* Hunched body */}
      <ellipse cx="16" cy="24" rx="7" ry="6" fill={WC3.orcBrown} />
      {/* Head */}
      <circle cx="16" cy="12" r="6" fill="#4A7023" />
      {/* Tusks */}
      <path d="M12,14 L10,18" stroke="#FFFFF0" strokeWidth="2" />
      <path d="M20,14 L22,18" stroke="#FFFFF0" strokeWidth="2" />
      {/* Eyes */}
      <circle cx="14" cy="11" r="1" fill={WC3.orcRed} />
      <circle cx="18" cy="11" r="1" fill={WC3.orcRed} />
    </svg>
  )
}

function WispUnit({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-label="Wisp">
      {/* Glowing core */}
      <circle cx="16" cy="16" r="8" fill={WC3.elfSilver} opacity="0.3" />
      <circle cx="16" cy="16" r="5" fill={WC3.elfSilver} opacity="0.6" />
      <circle cx="16" cy="16" r="3" fill="#FFFFFF" />
      {/* Trailing wisps */}
      <path d="M16,24 Q12,28 10,30" stroke={WC3.elfSilver} strokeWidth="2" fill="none" opacity="0.5" />
      <path d="M16,24 Q20,28 22,30" stroke={WC3.elfSilver} strokeWidth="2" fill="none" opacity="0.5" />
      <path d="M16,24 L16,30" stroke={WC3.elfSilver} strokeWidth="2" opacity="0.5" />
    </svg>
  )
}

function AcolyteUnit({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-label="Acolyte">
      {/* Robed body */}
      <path d="M10,28 L16,14 L22,28 Z" fill="#1A0A2E" />
      {/* Hood */}
      <path d="M12,14 Q16,8 20,14 Q16,18 12,14 Z" fill="#1A0A2E" />
      {/* Glowing eyes */}
      <circle cx="14" cy="12" r="1" fill={WC3.undeadGreen} />
      <circle cx="18" cy="12" r="1" fill={WC3.undeadGreen} />
      {/* Staff */}
      <line x1="24" y1="6" x2="24" y2="28" stroke="#4A3728" strokeWidth="2" />
      <circle cx="24" cy="6" r="3" fill={WC3.undeadGreen} opacity="0.8" />
    </svg>
  )
}

// ============================================================================
// WC3 BUILDING SILHOUETTES (Town Hall, Barracks, Tower styles)
// ============================================================================

function HumanBarracks({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-label="Barracks">
      {/* Main building */}
      <rect x="8" y="20" width="32" height="24" fill={WC3.stone} stroke={WC3.humanGold} strokeWidth="2" />
      {/* Roof */}
      <path d="M4,20 L24,4 L44,20 Z" fill={WC3.humanBlue} stroke={WC3.humanGold} strokeWidth="2" />
      {/* Door */}
      <rect x="18" y="30" width="12" height="14" fill="#2A1810" />
      <path d="M18,30 L24,24 L30,30 Z" fill="#2A1810" />
      {/* Windows */}
      <rect x="10" y="26" width="6" height="6" fill={WC3.humanBlue} stroke={WC3.humanGold} strokeWidth="1" />
      <rect x="32" y="26" width="6" height="6" fill={WC3.humanBlue} stroke={WC3.humanGold} strokeWidth="1" />
      {/* Banner */}
      <rect x="22" y="6" width="4" height="10" fill={WC3.humanBlue} />
    </svg>
  )
}

function OrcBurrow({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-label="Burrow">
      {/* Spiked hut */}
      <ellipse cx="24" cy="36" rx="18" ry="10" fill={WC3.orcBrown} />
      <path d="M8,30 Q24,4 40,30" fill={WC3.orcBrownDark} stroke={WC3.orcRed} strokeWidth="2" />
      {/* Spikes */}
      <path d="M12,26 L10,16" stroke="#FFFFF0" strokeWidth="3" />
      <path d="M24,12 L24,2" stroke="#FFFFF0" strokeWidth="3" />
      <path d="M36,26 L38,16" stroke="#FFFFF0" strokeWidth="3" />
      {/* Entrance */}
      <ellipse cx="24" cy="36" rx="6" ry="5" fill="#0A0505" />
      {/* Skull decoration */}
      <circle cx="24" cy="30" r="3" fill={WC3.undeadBone} />
      <circle cx="23" cy="29" r="1" fill="#0A0505" />
      <circle cx="25" cy="29" r="1" fill="#0A0505" />
    </svg>
  )
}

function ElfAncient({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-label="Ancient">
      {/* Tree trunk */}
      <path d="M20,44 Q18,30 16,20 Q24,16 32,20 Q30,30 28,44 Z" fill={WC3.orcBrown} />
      {/* Foliage */}
      <ellipse cx="24" cy="16" rx="16" ry="12" fill={WC3.elfPurple} opacity="0.8" />
      <ellipse cx="20" cy="12" rx="10" ry="8" fill={WC3.elfPurpleLight} opacity="0.6" />
      <ellipse cx="28" cy="14" rx="10" ry="8" fill={WC3.elfPurpleLight} opacity="0.6" />
      {/* Face in tree */}
      <ellipse cx="22" cy="28" rx="2" ry="3" fill={WC3.elfSilver} />
      <ellipse cx="26" cy="28" rx="2" ry="3" fill={WC3.elfSilver} />
      <circle cx="22" cy="28" r="1" fill={WC3.elfPurple} />
      <circle cx="26" cy="28" r="1" fill={WC3.elfPurple} />
      {/* Moonwell glow */}
      <circle cx="24" cy="42" r="6" fill={WC3.elfSilver} opacity="0.3" />
    </svg>
  )
}

function UndeadZiggurat({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-label="Ziggurat">
      {/* Stepped pyramid */}
      <rect x="6" y="36" width="36" height="8" fill="#2A2A2A" stroke={WC3.undeadGreen} strokeWidth="1" />
      <rect x="10" y="28" width="28" height="8" fill="#1A1A1A" stroke={WC3.undeadGreen} strokeWidth="1" />
      <rect x="14" y="20" width="20" height="8" fill="#0A0A0A" stroke={WC3.undeadGreen} strokeWidth="1" />
      <rect x="18" y="12" width="12" height="8" fill="#050505" stroke={WC3.undeadGreen} strokeWidth="1" />
      {/* Glowing orb */}
      <circle cx="24" cy="8" r="4" fill={WC3.undeadGreen} />
      <circle cx="24" cy="8" r="2" fill="#FFFFFF" opacity="0.5" />
      {/* Bone decorations */}
      <line x1="8" y1="40" x2="8" y2="36" stroke={WC3.undeadBone} strokeWidth="2" />
      <line x1="40" y1="40" x2="40" y2="36" stroke={WC3.undeadBone} strokeWidth="2" />
    </svg>
  )
}

// ============================================================================
// WC3 UI COMPONENTS
// ============================================================================

function ResourceBar({
  icon,
  value,
  maxValue,
  label,
}: {
  icon: React.ReactNode
  value: number
  maxValue?: number
  label: string
}) {
  return (
    <div
      className="flex items-center gap-1 px-3 py-1"
      style={{
        background: 'linear-gradient(180deg, #2A2318 0%, #1A1612 100%)',
        border: `1px solid ${WC3.panelBorder}`,
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)',
      }}
      aria-label={`${label}: ${value}${maxValue ? ` of ${maxValue}` : ''}`}
    >
      {icon}
      <span
        className="text-xs font-bold tabular-nums"
        style={{ color: WC3.textGold, textShadow: '0 1px 0 #000' }}
      >
        {maxValue ? `${value}/${maxValue}` : value}
      </span>
    </div>
  )
}

function UnitPortrait({
  children,
  selected = false,
  size = 64,
}: {
  children: React.ReactNode
  selected?: boolean
  size?: number
}) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Gold beveled frame */}
      <div
        className="absolute inset-0 p-[3px]"
        style={{
          background: `linear-gradient(135deg, ${WC3.humanGold} 0%, ${WC3.uiGoldDark} 50%, ${WC3.humanGold} 100%)`,
        }}
      >
        <div
          className="w-full h-full flex items-center justify-center"
          style={{
            background: '#0A0A0A',
            border: selected ? `2px solid ${WC3.healthGreen}` : '2px solid #1A1A1A',
            boxShadow: selected ? `0 0 8px ${WC3.healthGreen}` : 'inset 0 2px 4px rgba(0,0,0,0.8)',
          }}
        >
          {children}
        </div>
      </div>
      {/* Corner bevels */}
      {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((pos, i) => (
        <div
          key={i}
          className={`absolute w-2 h-2 ${pos}`}
          style={{
            background: `radial-gradient(circle at ${i % 2 === 0 ? '70%' : '30%'} ${i < 2 ? '70%' : '30%'}, ${WC3.humanGold}, transparent)`,
          }}
        />
      ))}
    </div>
  )
}

function HealthManaBar({
  label,
  current,
  max,
  type,
}: {
  label: string
  current: number
  max: number
  type: 'health' | 'mana' | 'exp'
}) {
  const percent = Math.min(100, (current / max) * 100)
  const segments = 10

  const colors = {
    health: percent > 50 ? WC3.healthGreen : percent > 25 ? WC3.healthYellow : WC3.healthRed,
    mana: WC3.manaBlue,
    exp: WC3.elfPurple,
  }

  return (
    <div className="flex items-center gap-2" aria-label={`${label}: ${current}/${max}`}>
      <span className="text-xs font-bold w-8 text-right" style={{ color: WC3.textGray }}>
        {label}
      </span>
      <div
        className="flex-1 h-3 flex gap-px overflow-hidden relative"
        style={{
          background: '#0A0A0A',
          border: `2px solid ${WC3.panelBorder}`,
        }}
      >
        {[...Array(segments)].map((_, i) => {
          const segmentPercent = ((i + 1) / segments) * 100
          const isFilled = percent >= segmentPercent - (100 / segments / 2)
          return (
            <div
              key={i}
              className="flex-1"
              style={{
                background: isFilled ? colors[type] : 'transparent',
                boxShadow: isFilled ? 'inset 0 1px 0 rgba(255,255,255,0.3)' : 'none',
              }}
            />
          )
        })}
        <span
          className="absolute inset-0 flex items-center justify-center text-[10px] font-bold"
          style={{ color: WC3.textWhite, textShadow: '0 1px 2px #000' }}
        >
          {current}/{max}
        </span>
      </div>
    </div>
  )
}

function WC3Panel({
  title,
  children,
  faction = 'human',
  className = '',
}: {
  title: string
  children: React.ReactNode
  faction?: 'human' | 'orc' | 'nightelf' | 'undead'
  className?: string
}) {
  const factionColors = {
    human: { primary: WC3.humanBlue, accent: WC3.humanGold },
    orc: { primary: WC3.orcRed, accent: WC3.orcRedDark },
    nightelf: { primary: WC3.elfPurple, accent: WC3.elfSilver },
    undead: { primary: WC3.undeadGreen, accent: WC3.undeadBone },
  }
  const colors = factionColors[faction]

  return (
    <section
      className={`relative ${className}`}
      style={{
        background: `linear-gradient(180deg, ${WC3.panelMid} 0%, ${WC3.panelDark} 100%)`,
        border: `3px solid ${colors.accent}`,
        boxShadow: `inset 0 0 30px ${colors.primary}15, 0 4px 16px rgba(0,0,0,0.6)`,
      }}
    >
      {/* Corner rivets */}
      {['top-1 left-1', 'top-1 right-1', 'bottom-1 left-1', 'bottom-1 right-1'].map((pos, i) => (
        <div
          key={i}
          className={`absolute w-3 h-3 rounded-full ${pos}`}
          style={{
            background: `radial-gradient(circle at 30% 30%, ${colors.accent}, ${WC3.panelBorder})`,
          }}
        />
      ))}

      {/* Title banner */}
      <div
        className="relative px-6 py-2 mx-4 -mt-3"
        style={{
          background: `linear-gradient(180deg, ${WC3.panelMid} 0%, ${WC3.panelDark} 100%)`,
          border: `2px solid ${colors.accent}`,
          boxShadow: `0 0 10px ${colors.primary}30`,
        }}
      >
        <h2
          className="text-sm tracking-[0.2em] uppercase font-bold text-center"
          style={{
            color: colors.accent,
            textShadow: `0 0 8px ${colors.primary}50`,
            fontFamily: 'Georgia, serif',
          }}
        >
          {title}
        </h2>
      </div>

      <div className="pt-4 pb-6 px-6">{children}</div>
    </section>
  )
}

function AbilityIcon({
  children,
  hotkey,
  learned = true,
  size = 40,
}: {
  children: React.ReactNode
  hotkey?: string
  learned?: boolean
  size?: number
}) {
  return (
    <div className="relative group" style={{ width: size, height: size }}>
      <div
        className="absolute inset-0 p-[2px]"
        style={{
          background: learned
            ? `linear-gradient(135deg, ${WC3.humanGold} 0%, ${WC3.uiGoldDark} 100%)`
            : 'linear-gradient(135deg, #4A4A4A 0%, #2A2A2A 100%)',
        }}
      >
        <div
          className={`w-full h-full flex items-center justify-center transition-all ${learned ? 'group-hover:brightness-125' : ''}`}
          style={{
            background: learned ? 'linear-gradient(180deg, #2A2318 0%, #1A1612 100%)' : '#1A1A1A',
            opacity: learned ? 1 : 0.5,
          }}
        >
          {children}
        </div>
      </div>
      {hotkey && (
        <div
          className="absolute -bottom-1 -right-1 w-4 h-4 flex items-center justify-center text-[10px] font-bold"
          style={{
            background: WC3.panelDark,
            border: `1px solid ${WC3.panelBorder}`,
            color: WC3.textGold,
          }}
        >
          {hotkey}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// FACTION ART DISPLAY COMPONENTS
// ============================================================================

function FactionCrestsArt() {
  return (
    <div
      className="py-8 flex justify-center items-center gap-8 md:gap-16"
      style={{
        background: `linear-gradient(90deg, transparent 0%, ${WC3.panelDark}80 20%, ${WC3.panelDark}80 80%, transparent 100%)`,
        borderTop: `1px solid ${WC3.panelBorder}`,
        borderBottom: `1px solid ${WC3.panelBorder}`,
      }}
    >
      <div className="text-center">
        <HumanCrest size={80} />
        <p className="mt-2 text-xs uppercase tracking-wider" style={{ color: WC3.humanGold }}>Alliance</p>
      </div>
      <div className="text-center">
        <OrcCrest size={80} />
        <p className="mt-2 text-xs uppercase tracking-wider" style={{ color: WC3.orcRed }}>Horde</p>
      </div>
      <div className="text-center">
        <NightElfCrest size={80} />
        <p className="mt-2 text-xs uppercase tracking-wider" style={{ color: WC3.elfSilver }}>Sentinels</p>
      </div>
      <div className="text-center">
        <UndeadCrest size={80} />
        <p className="mt-2 text-xs uppercase tracking-wider" style={{ color: WC3.undeadGreen }}>Scourge</p>
      </div>
    </div>
  )
}

function UnitsArt() {
  return (
    <div
      className="py-8 flex justify-center items-end gap-6 md:gap-12"
      style={{
        background: `linear-gradient(90deg, transparent 0%, ${WC3.panelDark}60 30%, ${WC3.panelDark}60 70%, transparent 100%)`,
        borderTop: `1px solid ${WC3.panelBorder}`,
        borderBottom: `1px solid ${WC3.panelBorder}`,
      }}
    >
      <div className="text-center">
        <PeasantUnit size={48} />
        <p className="mt-1 text-[10px] uppercase tracking-wider" style={{ color: WC3.humanGold }}>Peasant</p>
        <p className="text-[8px]" style={{ color: WC3.textGray }}>Worker</p>
      </div>
      <div className="text-center">
        <PeonUnit size={48} />
        <p className="mt-1 text-[10px] uppercase tracking-wider" style={{ color: WC3.orcRed }}>Peon</p>
        <p className="text-[8px]" style={{ color: WC3.textGray }}>Worker</p>
      </div>
      <div className="text-center">
        <WispUnit size={48} />
        <p className="mt-1 text-[10px] uppercase tracking-wider" style={{ color: WC3.elfSilver }}>Wisp</p>
        <p className="text-[8px]" style={{ color: WC3.textGray }}>Worker</p>
      </div>
      <div className="text-center">
        <AcolyteUnit size={48} />
        <p className="mt-1 text-[10px] uppercase tracking-wider" style={{ color: WC3.undeadGreen }}>Acolyte</p>
        <p className="text-[8px]" style={{ color: WC3.textGray }}>Worker</p>
      </div>
    </div>
  )
}

function BuildingsArt() {
  return (
    <div
      className="py-8 flex justify-center items-end gap-4 md:gap-10"
      style={{
        background: `linear-gradient(90deg, transparent 0%, ${WC3.panelDark}70 25%, ${WC3.panelDark}70 75%, transparent 100%)`,
        borderTop: `1px solid ${WC3.panelBorder}`,
        borderBottom: `1px solid ${WC3.panelBorder}`,
      }}
    >
      <div className="text-center">
        <HumanBarracks size={64} />
        <p className="mt-1 text-[10px] uppercase tracking-wider" style={{ color: WC3.humanGold }}>Barracks</p>
      </div>
      <div className="text-center">
        <OrcBurrow size={64} />
        <p className="mt-1 text-[10px] uppercase tracking-wider" style={{ color: WC3.orcRed }}>Burrow</p>
      </div>
      <div className="text-center">
        <ElfAncient size={64} />
        <p className="mt-1 text-[10px] uppercase tracking-wider" style={{ color: WC3.elfSilver }}>Ancient</p>
      </div>
      <div className="text-center">
        <UndeadZiggurat size={64} />
        <p className="mt-1 text-[10px] uppercase tracking-wider" style={{ color: WC3.undeadGreen }}>Ziggurat</p>
      </div>
    </div>
  )
}

// ============================================================================
// CONTENT CARDS
// ============================================================================

function ExperienceCard({ entry }: { entry: typeof EXPERIENCE_DATA[0] }) {
  const endDisplay = entry.endDate ? new Date(entry.endDate).getFullYear() : 'Present'
  const startDisplay = new Date(entry.startDate).getFullYear()
  const isCurrentRole = !entry.endDate

  return (
    <article
      className="p-4 transition-all hover:brightness-110"
      style={{
        background: `linear-gradient(135deg, ${WC3.panelDark} 0%, #0A0808 100%)`,
        border: `2px solid ${isCurrentRole ? WC3.healthGreen : WC3.panelBorder}`,
        boxShadow: isCurrentRole ? `0 0 12px ${WC3.healthGreen}25` : 'none',
      }}
    >
      <div className="flex justify-between items-start mb-2 gap-2">
        <div className="flex items-start gap-3">
          <UnitPortrait size={36} selected={isCurrentRole}>
            <span className="text-sm font-bold" style={{ color: WC3.textGold }}>
              {entry.title.charAt(0)}
            </span>
          </UnitPortrait>
          <div>
            <h4 className="text-sm font-bold" style={{ color: WC3.textWhite }}>{entry.title}</h4>
            <p className="text-xs" style={{ color: WC3.textGold }}>{entry.organization}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <GoldIcon size={12} />
          <span className="text-xs" style={{ color: WC3.textGray }}>{startDisplay} - {endDisplay}</span>
        </div>
      </div>
      <p className="text-xs mb-2 ml-12" style={{ color: WC3.textGray }}>{entry.description}</p>
      {entry.highlights && entry.highlights.length > 0 && (
        <ul className="space-y-1 ml-12">
          {entry.highlights.map((h, i) => (
            <li key={i} className="text-xs flex items-start gap-2" style={{ color: WC3.textWhite }}>
              <span style={{ color: WC3.healthGreen }}>+</span>
              <span>{h}</span>
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

function ProjectCard({ project }: { project: typeof PROJECTS_DATA[0] }) {
  return (
    <article
      className="p-4 transition-all hover:brightness-110"
      style={{
        background: `linear-gradient(135deg, ${WC3.panelDark} 0%, #0A0808 100%)`,
        border: `2px solid ${project.featured ? WC3.uiGold : WC3.panelBorder}`,
        boxShadow: project.featured ? `0 0 15px ${WC3.uiGold}20` : 'none',
      }}
    >
      {project.featured && (
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full" style={{ background: WC3.uiGold }} />
          <span className="text-xs tracking-wider font-bold" style={{ color: WC3.uiGold }}>LEGENDARY</span>
        </div>
      )}
      <h4
        className="text-sm font-bold mb-1"
        style={{ color: project.featured ? WC3.uiGold : WC3.humanBlue }}
      >
        {project.name}
      </h4>
      <p className="text-xs mb-2" style={{ color: WC3.textGray }}>{project.tagline}</p>
      {project.impact && (
        <p className="text-xs mb-2" style={{ color: WC3.healthGreen }}>
          <span>+</span> {project.impact}
        </p>
      )}
      <div className="flex flex-wrap gap-1">
        {project.techStack.slice(0, 4).map((tech) => (
          <span
            key={tech}
            className="text-[9px] px-2 py-0.5 font-bold"
            style={{
              background: `${WC3.humanBlue}25`,
              border: `1px solid ${WC3.humanBlue}50`,
              color: WC3.textWhite,
            }}
          >
            {tech}
          </span>
        ))}
      </div>
    </article>
  )
}

function CompanyCard({ company }: { company: typeof COMPANIES[0] }) {
  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 transition-all hover:brightness-110"
      style={{
        background: `linear-gradient(135deg, ${WC3.panelDark} 0%, #0A0808 100%)`,
        border: `2px solid ${WC3.panelBorder}`,
      }}
    >
      <div className="flex items-center gap-3 mb-2">
        <UnitPortrait size={36}>
          <span className="text-lg">{company.icon}</span>
        </UnitPortrait>
        <div>
          <h4 className="text-sm font-bold" style={{ color: WC3.textWhite }}>{company.name}</h4>
          <p className="text-xs" style={{ color: WC3.textGold }}>{company.tagline}</p>
        </div>
      </div>
      <p className="text-xs" style={{ color: WC3.textGray }}>{company.description}</p>
    </a>
  )
}

function BandCard({ band }: { band: typeof BANDS[0] }) {
  const content = (
    <article
      className="p-4 transition-all hover:brightness-110"
      style={{
        background: `linear-gradient(135deg, ${WC3.panelDark} 0%, #0A0808 100%)`,
        border: `2px solid ${band.active ? WC3.elfPurple : WC3.panelBorder}`,
        boxShadow: band.active ? `0 0 10px ${WC3.elfPurple}25` : 'none',
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <NightElfCrest size={24} />
        <div>
          <h4 className="text-sm font-bold" style={{ color: WC3.textWhite }}>{band.name}</h4>
          <p className="text-xs" style={{ color: WC3.textGold }}>{band.genre} | {band.role}</p>
        </div>
      </div>
      <p className="text-xs" style={{ color: WC3.textGray }}>{band.description}</p>
      {band.active && (
        <div className="mt-2 flex items-center gap-1">
          <div
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: WC3.healthGreen }}
          />
          <span className="text-xs" style={{ color: WC3.healthGreen }}>Active</span>
        </div>
      )}
    </article>
  )

  if (band.url) {
    return (
      <a href={band.url} target="_blank" rel="noopener noreferrer" className="block">
        {content}
      </a>
    )
  }
  return content
}

// ============================================================================
// TECH STACK BUILD QUEUE
// ============================================================================

function TechBuildQueue({ categories }: { categories: ReturnType<typeof getEngineerSkills> }) {
  return (
    <div className="space-y-6">
      {categories.slice(0, 7).map((category) => (
        <div key={category.name}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">{category.icon}</span>
            <h3
              className="text-xs tracking-wider uppercase font-bold"
              style={{ color: WC3.textGold, fontFamily: 'Georgia, serif' }}
            >
              {category.name}
            </h3>
            <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${WC3.panelBorder}, transparent)` }} />
          </div>
          <div className="flex flex-wrap gap-2">
            {category.items.map((tech) => (
              <AbilityIcon key={tech} learned={true} size={36}>
                <span className="text-[10px] font-bold text-center leading-tight px-0.5" style={{ color: WC3.textWhite }}>
                  {tech.substring(0, 4).toUpperCase()}
                </span>
              </AbilityIcon>
            ))}
          </div>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
            {category.items.map((tech) => (
              <span key={tech} className="text-[10px]" style={{ color: WC3.textGray }}>{tech}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function OtherSkillsList({ categories }: { categories: ReturnType<typeof getSkillsByProfession> }) {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {categories.map((category) => (
        <div key={category.name}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">{category.icon}</span>
            <h3 className="text-xs tracking-wider uppercase font-bold" style={{ color: WC3.textGold }}>
              {category.name}
            </h3>
          </div>
          <ul className="space-y-2">
            {category.skills.map((skill) => (
              <li key={skill.name} className="flex items-center gap-2 text-xs" style={{ color: WC3.textWhite }}>
                <div className="w-2 h-2 rotate-45" style={{ background: WC3.healthGreen }} />
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
// FACTION SELECTOR (Race Selection Screen Style)
// ============================================================================

function FactionSelector({
  active,
  onSelect,
}: {
  active: 'engineer' | 'drummer' | 'fighter'
  onSelect: (p: 'engineer' | 'drummer' | 'fighter') => void
}) {
  const factions = [
    {
      id: 'engineer' as const,
      name: 'Human Alliance',
      desc: 'Arcane Architect',
      icon: <HumanCrest size={48} />,
      color: WC3.humanBlue,
      accent: WC3.humanGold,
    },
    {
      id: 'drummer' as const,
      name: 'Night Elf Sentinels',
      desc: 'Keeper of Rhythm',
      icon: <NightElfCrest size={48} />,
      color: WC3.elfPurple,
      accent: WC3.elfSilver,
    },
    {
      id: 'fighter' as const,
      name: 'Orc Horde',
      desc: 'Battle-Hardened',
      icon: <OrcCrest size={48} />,
      color: WC3.orcRed,
      accent: WC3.orcRed,
    },
  ]

  return (
    <nav className="flex justify-center gap-4 md:gap-6 py-6" role="tablist" aria-label="Profession selection">
      {factions.map((faction) => (
        <button
          key={faction.id}
          onClick={() => onSelect(faction.id)}
          role="tab"
          aria-selected={active === faction.id}
          className="relative group focus:outline-none focus-visible:ring-2 transition-transform hover:scale-105"
        >
          <div
            className="w-28 md:w-36 h-36 md:h-44 flex flex-col items-center justify-center gap-2 p-3 transition-all"
            style={{
              background: active === faction.id
                ? `linear-gradient(180deg, ${faction.color}35 0%, ${WC3.panelDark} 100%)`
                : `linear-gradient(180deg, #1A1612 0%, #0A0808 100%)`,
              border: `3px solid ${active === faction.id ? faction.accent : WC3.panelBorder}`,
              boxShadow: active === faction.id
                ? `0 0 20px ${faction.color}40, inset 0 0 15px ${faction.color}20`
                : 'inset 0 2px 4px rgba(0,0,0,0.5)',
            }}
          >
            <div className="relative">
              {faction.icon}
              {active === faction.id && (
                <div className="absolute inset-0 animate-pulse" style={{ filter: `drop-shadow(0 0 6px ${faction.accent})` }}>
                  {faction.icon}
                </div>
              )}
            </div>
            <span
              className="text-[10px] md:text-xs font-bold tracking-wider text-center leading-tight"
              style={{
                color: active === faction.id ? faction.accent : WC3.textGray,
                textShadow: active === faction.id ? `0 0 8px ${faction.color}` : 'none',
                fontFamily: 'Georgia, serif',
              }}
            >
              {faction.name}
            </span>
            <span className="text-[10px]" style={{ color: WC3.textGray }}>{faction.desc}</span>
          </div>
          {active === faction.id && (
            <div
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0"
              style={{
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderTop: `8px solid ${faction.accent}`,
              }}
            />
          )}
        </button>
      ))}
    </nav>
  )
}

// ============================================================================
// TERRAIN GRID BACKGROUND
// ============================================================================

function TerrainGrid() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
      style={{
        backgroundImage: `
          linear-gradient(#2D5016 1px, transparent 1px),
          linear-gradient(90deg, #2D5016 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
      }}
    />
  )
}

// ============================================================================
// MINIMAP FRAME (Footer)
// ============================================================================

function MinimapFrame({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="relative" aria-label={title}>
      <div
        className="p-1"
        style={{
          background: `linear-gradient(135deg, ${WC3.humanGold} 0%, ${WC3.uiGoldDark} 50%, ${WC3.humanGold} 100%)`,
        }}
      >
        <div className="p-1" style={{ background: WC3.panelDark, border: `1px solid ${WC3.panelBorder}` }}>
          {children}
        </div>
      </div>
      {/* Corner gems */}
      {['-top-1 -left-1', '-top-1 -right-1', '-bottom-1 -left-1', '-bottom-1 -right-1'].map((pos, i) => (
        <div
          key={i}
          className={`absolute w-3 h-3 ${pos}`}
          style={{
            background: `radial-gradient(circle, ${WC3.humanGold} 0%, ${WC3.uiGoldDark} 100%)`,
            borderRadius: '1px',
          }}
        />
      ))}
    </div>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function MedievalFantasyTheme() {
  useTheme()
  const { active, setActive } = useProfession()
  const [mounted, setMounted] = useState(false)

  const aboutData = ABOUT_DATA[active]
  const engineerTech = getEngineerSkills()
  const otherSkills = getSkillsByProfession(active)
  const projects = PROJECTS_DATA.filter(p => p.professions.includes(active) || p.featured)
  const experience = filterExperienceByProfession(EXPERIENCE_DATA, active)

  const factionMap = {
    engineer: 'human' as const,
    drummer: 'nightelf' as const,
    fighter: 'orc' as const,
  }
  const currentFaction = factionMap[active]

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div
      className="min-h-screen relative overflow-x-hidden"
      style={{
        background: `linear-gradient(180deg, #0A0808 0%, #0F0C0A 50%, #0A0808 100%)`,
        fontFamily: 'Georgia, "Times New Roman", serif',
      }}
    >
      <TerrainGrid />

      {/* ====== TOP RESOURCE BAR (WC3 Style) ====== */}
      <div
        className="fixed top-0 left-0 right-0 z-50 flex justify-center gap-4 py-2 px-4"
        style={{
          background: 'linear-gradient(180deg, #1A1612 0%, #0F0C0A 100%)',
          borderBottom: `2px solid ${WC3.panelBorder}`,
          boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
        }}
      >
        <ResourceBar icon={<GoldIcon size={16} />} value={15000} label="Experience" />
        <ResourceBar icon={<LumberIcon size={16} />} value={85} maxValue={100} label="Skill Level" />
        <ResourceBar icon={<FoodIcon size={16} />} value={100} maxValue={100} label="Energy" />
      </div>

      {/* ====== HEADER ====== */}
      <header className="relative z-40 pt-16 p-4 md:p-6 md:pt-16">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-4">
          {/* Portrait + Name */}
          <div className="flex items-start gap-4">
            <UnitPortrait size={80} selected={true}>
              {active === 'engineer' && <HumanCrest size={60} />}
              {active === 'drummer' && <NightElfCrest size={60} />}
              {active === 'fighter' && <OrcCrest size={60} />}
            </UnitPortrait>
            <div>
              <h1
                className="text-2xl md:text-3xl font-bold tracking-wide"
                style={{ color: WC3.textGold, textShadow: '2px 2px 0 #000, 0 0 10px rgba(255,215,0,0.3)' }}
              >
                ALEXANDER PULIDO
              </h1>
              <p className="text-sm md:text-base mt-1" style={{ color: WC3.textWhite }}>
                {PROFESSIONAL_SUMMARY.headline}
              </p>
              <p className="text-xs md:text-sm mt-1 italic" style={{ color: WC3.textGold }}>
                {PROFESSIONAL_SUMMARY.tagline}
              </p>
              <div className="mt-4 space-y-1 w-56 md:w-72">
                <HealthManaBar label="EXP" current={85} max={100} type="exp" />
                <HealthManaBar label="MANA" current={100} max={100} type="mana" />
              </div>
            </div>
          </div>

          {/* Nav buttons */}
          <div className="flex flex-wrap gap-2 md:gap-3 items-center">
            <Link
              href="/cv"
              className="px-4 py-2 text-xs md:text-sm font-bold tracking-wider transition-all hover:brightness-125"
              style={{
                background: 'linear-gradient(180deg, #2A2318 0%, #1A1612 100%)',
                border: `2px solid ${WC3.humanGold}`,
                color: WC3.textGold,
                boxShadow: `inset 0 1px 0 rgba(255,215,0,0.3), 0 2px 0 ${WC3.panelDark}`,
              }}
            >
              SCROLL
            </Link>
            <Link
              href="/personal-projects/game-engine"
              className="px-4 py-2 text-xs md:text-sm font-bold tracking-wider transition-all hover:brightness-125"
              style={{
                background: 'linear-gradient(180deg, #1A2535 0%, #0A1520 100%)',
                border: `2px solid ${WC3.humanBlue}`,
                color: WC3.humanBlue,
                boxShadow: `inset 0 1px 0 rgba(0,66,255,0.3), 0 2px 0 ${WC3.panelDark}`,
              }}
            >
              NEBULITH
            </Link>
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      {/* ====== CURRENT ROLES ====== */}
      <section className="relative z-30 py-4 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            {CURRENT_ROLES.map((role) => (
              <div key={role.id} className="text-center flex items-center gap-2">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: WC3.healthGreen }} />
                <div>
                  <p className="text-xs md:text-sm font-bold" style={{ color: WC3.textGold }}>{role.title}</p>
                  <p className="text-sm md:text-base" style={{ color: WC3.textWhite }}>{role.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== FACTION SELECTOR ====== */}
      <section className="relative z-30 py-4">
        <FactionSelector active={active} onSelect={setActive} />
      </section>

      {/* ====== MAIN CONTENT ====== */}
      <main className="relative z-20 space-y-0">

        {/* ABOUT */}
        <div className="py-8 px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <WC3Panel title="Unit Information" faction={currentFaction}>
              <p className="text-sm leading-relaxed mb-4" style={{ color: WC3.textWhite }}>
                {aboutData.bio}
              </p>
              <div className="flex flex-wrap gap-2">
                {aboutData.quickFacts.map((fact, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-xs font-bold"
                    style={{
                      background: `${WC3.humanGold}12`,
                      border: `1px solid ${WC3.humanGold}50`,
                      color: WC3.textGold,
                    }}
                  >
                    {fact}
                  </span>
                ))}
              </div>
            </WC3Panel>
          </div>
        </div>

        {/* ART: FACTION CRESTS */}
        <FactionCrestsArt />

        {/* EXPERIENCE */}
        {experience.length > 0 && (
          <div className="py-8 px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <WC3Panel title="Campaign History" faction={currentFaction}>
                <div className="space-y-4">
                  {experience.map((entry) => (
                    <ExperienceCard key={entry.id} entry={entry} />
                  ))}
                </div>
              </WC3Panel>
            </div>
          </div>
        )}

        {/* ART: UNITS */}
        <UnitsArt />

        {/* SKILLS */}
        <div className="py-8 px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <WC3Panel title={active === 'engineer' ? 'Spell Book' : 'Abilities'} faction={currentFaction}>
              {active === 'engineer' ? (
                <TechBuildQueue categories={engineerTech} />
              ) : (
                <OtherSkillsList categories={otherSkills} />
              )}
            </WC3Panel>
          </div>
        </div>

        {/* PROJECTS */}
        <div className="py-8 px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <WC3Panel title="Completed Quests" faction={currentFaction}>
              <div className="grid md:grid-cols-2 gap-4">
                {projects.filter(p => p.featured).slice(0, 6).map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </WC3Panel>
          </div>
        </div>

        {/* ART: BUILDINGS */}
        <BuildingsArt />

        {/* VENTURES (Companies for Engineer, Bands for Drummer) */}
        {active === 'engineer' && (
          <div className="py-8 px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <WC3Panel title="Allied Outposts" faction="human">
                <div className="grid md:grid-cols-3 gap-4">
                  {COMPANIES.map((company) => (
                    <CompanyCard key={company.id} company={company} />
                  ))}
                </div>
              </WC3Panel>
            </div>
          </div>
        )}

        {active === 'drummer' && (
          <div className="py-8 px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <WC3Panel title="Warbands" faction="nightelf">
                <div className="grid md:grid-cols-3 gap-4">
                  {BANDS.map((band) => (
                    <BandCard key={band.id} band={band} />
                  ))}
                </div>
              </WC3Panel>
            </div>
          </div>
        )}

        {/* POSTS PLACEHOLDER */}
        <div className="py-8 px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <WC3Panel title="War Chronicles" faction={currentFaction}>
              <div className="text-center py-8" style={{ color: WC3.textGray }}>
                <p className="text-sm italic">Chronicles coming soon...</p>
                <p className="text-xs mt-2">Battle reports and strategic insights</p>
              </div>
            </WC3Panel>
          </div>
        </div>

      </main>

      {/* ====== FOOTER MINIMAP ====== */}
      <footer className="relative z-20 py-12 px-4">
        <div className="max-w-md mx-auto">
          <MinimapFrame title="Location">
            <div
              className="w-full h-32 flex flex-col items-center justify-center gap-2"
              style={{
                background: `linear-gradient(135deg, #2D501635 0%, #4A372835 50%, #1E3A5F35 100%)`,
              }}
            >
              <div className="flex justify-center gap-4">
                <HumanCrest size={24} />
                <NightElfCrest size={24} />
                <OrcCrest size={24} />
                <UndeadCrest size={24} />
              </div>
              <p className="text-sm font-bold" style={{ color: WC3.textGold }}>AZEROTH</p>
              <p className="text-xs" style={{ color: WC3.textGray }}>Warcraft III: Reign of Chaos</p>
            </div>
          </MinimapFrame>
        </div>
        <p className="text-center text-xs mt-4" style={{ color: WC3.textGray }}>
          Built with the spirit of classic RTS games (1994-2003)
        </p>
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
