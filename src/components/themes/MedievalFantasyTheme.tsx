'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { useTheme } from '@/themes/ThemeContext'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import { useProfession } from '@/contexts/ProfessionContext'
import { ABOUT_DATA, PROFESSIONAL_SUMMARY } from '@/data/about'
import { PROJECTS_DATA, filterProjectsByProfession, getFeaturedProjects } from '@/data/projects'
import { getSkillsByProfession, getEngineerSkills } from '@/data/skills'
import { CURRENT_ROLES } from '@/data/roles'
import { COMPANIES } from '@/data/companies'
import { BANDS } from '@/data/bands'
import { EXPERIENCE_DATA, filterExperienceByProfession } from '@/data/experience'
import { getAchievementsByProfession, WORK_EXPERIENCE } from '@/data/achievements'

// ============================================================================
// WARCRAFT 1-3 RTS COLOR PALETTE
// Authentic WC3 UI colors from the game interface
// ============================================================================

const WC3 = {
  // Alliance / Human
  allianceBlue: '#0066CC',
  allianceBlueDark: '#0044AA',
  allianceBlueBright: '#3399FF',

  // Horde / Orc
  hordeRed: '#CC0000',
  hordeRedDark: '#990000',
  hordeRedBright: '#FF3333',

  // Gold Trim (WC3 signature UI element)
  goldBright: '#FFD700',
  goldMid: '#B8860B',
  goldDark: '#8B6914',
  goldDeep: '#6B5210',

  // Stone/Metal Panels
  stoneLight: '#555555',
  stoneMid: '#444444',
  stoneDark: '#333333',
  stoneDeep: '#222222',

  // Parchment (scroll/text backgrounds)
  parchmentLight: '#D4C4A8',
  parchmentMid: '#C4B498',
  parchmentDark: '#A89878',

  // Wood/Brown (for frames)
  woodLight: '#8B4513',
  woodDark: '#654321',
  woodDeep: '#4A3219',

  // Nature Green (gold counter, health)
  natureGreen: '#228B22',
  natureDark: '#006400',
  healthGreen: '#00FF00',

  // Night Elf
  elfPurple: '#9932CC',
  elfPurpleDark: '#7722AA',
  elfSilver: '#C0C0C0',

  // Undead
  undeadGreen: '#00FF66',
  undeadBone: '#D2B48C',

  // UI Specifics
  panelBg: '#1A1612',
  panelBgLight: '#2A2318',
  panelBorder: '#6B5A3C',
  manaBlue: '#0044FF',

  // Text
  textGold: '#FFD700',
  textWhite: '#FFFFFF',
  textSilver: '#C0C0C0',
  textGray: '#AAAAAA',
}

// ============================================================================
// RESOURCE ICONS (Gold, Lumber, Food - WC3 Top Bar)
// ============================================================================

function GoldIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden="true" role="img">
      <title>Gold</title>
      {/* Stack of gold coins */}
      <ellipse cx="8" cy="13" rx="6" ry="2" fill={WC3.goldDark} />
      <ellipse cx="8" cy="12" rx="6" ry="2" fill={WC3.goldBright} />
      <ellipse cx="8" cy="10" rx="5" ry="1.5" fill={WC3.goldDark} />
      <ellipse cx="8" cy="9" rx="5" ry="1.5" fill={WC3.goldBright} />
      <ellipse cx="8" cy="7" rx="4" ry="1.2" fill={WC3.goldDark} />
      <ellipse cx="8" cy="6" rx="4" ry="1.2" fill={WC3.goldBright} />
    </svg>
  )
}

function LumberIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden="true" role="img">
      <title>Lumber</title>
      {/* Log pile */}
      <rect x="2" y="10" width="12" height="4" rx="2" fill={WC3.woodDark} />
      <rect x="3" y="10" width="10" height="1" fill={WC3.woodLight} opacity="0.6" />
      <rect x="3" y="6" width="10" height="4" rx="2" fill={WC3.woodLight} />
      <rect x="4" y="6" width="8" height="1" fill={WC3.parchmentDark} opacity="0.5" />
      <rect x="5" y="3" width="6" height="3" rx="1.5" fill={WC3.woodDark} />
      <rect x="6" y="3" width="4" height="1" fill={WC3.woodLight} opacity="0.4" />
    </svg>
  )
}

function FoodIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden="true" role="img">
      <title>Food</title>
      {/* Wheat sheaf */}
      <ellipse cx="8" cy="14" rx="5" ry="1.5" fill={WC3.woodDark} />
      <path d="M8,3 L8,14" stroke={WC3.goldMid} strokeWidth="1" />
      <path d="M5,4 L5,13" stroke={WC3.goldMid} strokeWidth="1" />
      <path d="M11,4 L11,13" stroke={WC3.goldMid} strokeWidth="1" />
      <ellipse cx="8" cy="3" rx="1.5" ry="2.5" fill={WC3.goldBright} />
      <ellipse cx="5" cy="4" rx="1" ry="2" fill={WC3.goldBright} />
      <ellipse cx="11" cy="4" rx="1" ry="2" fill={WC3.goldBright} />
    </svg>
  )
}

// ============================================================================
// FACTION CRESTS (Human Lion, Orc Axe, Night Elf)
// ============================================================================

function AllianceCrest({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-label="Alliance Crest" role="img">
      <title>Human Alliance</title>
      {/* Shield shape */}
      <path
        d="M32,4 L58,16 L58,40 Q58,56 32,62 Q6,56 6,40 L6,16 Z"
        fill={WC3.allianceBlue}
        stroke={WC3.goldBright}
        strokeWidth="3"
      />
      {/* Inner border */}
      <path
        d="M32,10 L52,20 L52,38 Q52,50 32,56 Q12,50 12,38 L12,20 Z"
        fill="none"
        stroke={WC3.goldMid}
        strokeWidth="1.5"
        opacity="0.7"
      />
      {/* Stylized Lion */}
      <g fill={WC3.goldBright}>
        {/* Mane rays */}
        <path d="M32,16 L26,10 L24,18 L18,14 L22,22 L16,20 L22,26 L14,28 L22,30 Z" />
        <path d="M32,16 L38,10 L40,18 L46,14 L42,22 L48,20 L42,26 L50,28 L42,30 Z" />
        {/* Face */}
        <ellipse cx="32" cy="32" rx="10" ry="12" />
        {/* Crown */}
        <path d="M24,16 L26,8 L29,14 L32,6 L35,14 L38,8 L40,16 Z" />
      </g>
      {/* Eyes */}
      <circle cx="28" cy="30" r="2" fill={WC3.allianceBlue} />
      <circle cx="36" cy="30" r="2" fill={WC3.allianceBlue} />
      {/* Nose */}
      <ellipse cx="32" cy="36" rx="3" ry="2" fill={WC3.goldDark} />
    </svg>
  )
}

function HordeCrest({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-label="Horde Crest" role="img">
      <title>Orc Horde</title>
      {/* Angular shield */}
      <path
        d="M32,4 L56,18 L56,44 L32,62 L8,44 L8,18 Z"
        fill="#0A0505"
        stroke={WC3.hordeRed}
        strokeWidth="3"
      />
      {/* Inner border */}
      <path
        d="M32,12 L48,22 L48,40 L32,54 L16,40 L16,22 Z"
        fill="none"
        stroke={WC3.hordeRedDark}
        strokeWidth="1.5"
        opacity="0.6"
      />
      {/* War emblem - crossed axes */}
      <g stroke={WC3.hordeRed} strokeWidth="2" fill="none">
        <path d="M20,20 L44,44" />
        <path d="M44,20 L20,44" />
      </g>
      {/* Axe heads */}
      <path d="M18,18 L20,14 L24,18 L20,22 Z" fill={WC3.hordeRed} />
      <path d="M44,18 L48,14 L46,18 L48,22 Z" fill={WC3.hordeRed} />
      <path d="M18,44 L14,42 L18,46 L22,44 Z" fill={WC3.hordeRed} />
      <path d="M44,44 L48,46 L46,44 L48,42 Z" fill={WC3.hordeRed} />
      {/* Central skull */}
      <ellipse cx="32" cy="32" rx="8" ry="10" fill={WC3.undeadBone} />
      <circle cx="29" cy="30" r="2" fill="#0A0505" />
      <circle cx="35" cy="30" r="2" fill="#0A0505" />
      <path d="M32,34 L30,38 L34,38 Z" fill="#0A0505" />
      <rect x="28" y="40" width="8" height="3" fill={WC3.undeadBone} rx="1" />
    </svg>
  )
}

function SentinelCrest({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-label="Sentinel Crest" role="img">
      <title>Night Elf Sentinels</title>
      {/* Curved elven shield */}
      <path
        d="M32,4 Q60,16 58,38 Q54,58 32,62 Q10,58 6,38 Q4,16 32,4 Z"
        fill={WC3.elfPurpleDark}
        stroke={WC3.elfSilver}
        strokeWidth="3"
      />
      {/* Moon crescent */}
      <circle cx="32" cy="24" r="12" fill={WC3.elfSilver} />
      <circle cx="38" cy="22" r="10" fill={WC3.elfPurpleDark} />
      {/* Owl eyes */}
      <ellipse cx="24" cy="46" rx="6" ry="7" fill={WC3.elfSilver} />
      <ellipse cx="40" cy="46" rx="6" ry="7" fill={WC3.elfSilver} />
      <ellipse cx="24" cy="46" rx="3" ry="4" fill="#00FF7F" />
      <ellipse cx="40" cy="46" rx="3" ry="4" fill="#00FF7F" />
      <circle cx="24" cy="46" r="1.5" fill={WC3.elfPurpleDark} />
      <circle cx="40" cy="46" r="1.5" fill={WC3.elfPurpleDark} />
      {/* Beak */}
      <path d="M32,52 L30,56 L32,58 L34,56 Z" fill={WC3.elfSilver} />
    </svg>
  )
}

// ============================================================================
// WC3 WORKER UNITS (Peasant, Peon, Wisp)
// ============================================================================

function PeasantUnit({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      {/* Body */}
      <ellipse cx="16" cy="24" rx="6" ry="7" fill={WC3.allianceBlue} />
      {/* Head */}
      <circle cx="16" cy="12" r="5" fill="#FFDAB9" />
      {/* Hat */}
      <path d="M10,10 L16,4 L22,10" fill={WC3.goldBright} stroke={WC3.goldDark} strokeWidth="1" />
      {/* Pickaxe */}
      <line x1="22" y1="14" x2="28" y2="8" stroke={WC3.woodLight} strokeWidth="2" />
      <path d="M26,6 L30,8 L28,10" fill={WC3.stoneMid} stroke={WC3.stoneLight} strokeWidth="1" />
    </svg>
  )
}

function PeonUnit({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      {/* Hunched body */}
      <ellipse cx="16" cy="24" rx="7" ry="6" fill={WC3.woodLight} />
      {/* Green skin */}
      <circle cx="16" cy="12" r="6" fill="#4A7023" />
      {/* Tusks */}
      <path d="M12,14 L9,19" stroke="#FFFFF0" strokeWidth="2" strokeLinecap="round" />
      <path d="M20,14 L23,19" stroke="#FFFFF0" strokeWidth="2" strokeLinecap="round" />
      {/* Eyes */}
      <circle cx="13" cy="11" r="1.5" fill={WC3.hordeRed} />
      <circle cx="19" cy="11" r="1.5" fill={WC3.hordeRed} />
    </svg>
  )
}

function WispUnit({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      {/* Glow layers */}
      <circle cx="16" cy="14" r="10" fill={WC3.elfSilver} opacity="0.2" />
      <circle cx="16" cy="14" r="7" fill={WC3.elfSilver} opacity="0.4" />
      <circle cx="16" cy="14" r="4" fill={WC3.elfSilver} opacity="0.8" />
      <circle cx="16" cy="14" r="2" fill="#FFFFFF" />
      {/* Trails */}
      <path d="M16,22 Q12,26 9,30" stroke={WC3.elfSilver} strokeWidth="2" fill="none" opacity="0.4" />
      <path d="M16,22 Q20,26 23,30" stroke={WC3.elfSilver} strokeWidth="2" fill="none" opacity="0.4" />
      <path d="M16,22 L16,30" stroke={WC3.elfSilver} strokeWidth="2" opacity="0.4" />
    </svg>
  )
}

// ============================================================================
// WC3 BUILDINGS (Town Hall, Burrow, Ancient)
// ============================================================================

function HumanTownHall({ size = 56 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      {/* Base */}
      <rect x="6" y="28" width="36" height="16" fill={WC3.stoneMid} stroke={WC3.goldMid} strokeWidth="2" />
      {/* Roof */}
      <path d="M4,28 L24,8 L44,28 Z" fill={WC3.allianceBlue} stroke={WC3.goldBright} strokeWidth="2" />
      {/* Tower left */}
      <rect x="8" y="18" width="8" height="26" fill={WC3.stoneLight} stroke={WC3.goldMid} strokeWidth="1" />
      <path d="M8,18 L12,10 L16,18 Z" fill={WC3.allianceBlue} />
      {/* Tower right */}
      <rect x="32" y="18" width="8" height="26" fill={WC3.stoneLight} stroke={WC3.goldMid} strokeWidth="1" />
      <path d="M32,18 L36,10 L40,18 Z" fill={WC3.allianceBlue} />
      {/* Door */}
      <rect x="18" y="32" width="12" height="12" fill={WC3.woodDark} />
      <path d="M18,32 L24,26 L30,32 Z" fill={WC3.woodDark} />
      {/* Windows */}
      <rect x="10" y="22" width="4" height="4" fill={WC3.goldBright} opacity="0.6" />
      <rect x="34" y="22" width="4" height="4" fill={WC3.goldBright} opacity="0.6" />
    </svg>
  )
}

function OrcBurrow({ size = 56 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      {/* Base mound */}
      <ellipse cx="24" cy="40" rx="20" ry="8" fill={WC3.woodDark} />
      {/* Hut */}
      <path d="M6,34 Q24,4 42,34" fill={WC3.woodLight} stroke={WC3.hordeRed} strokeWidth="2" />
      {/* Spikes */}
      <path d="M10,28 L8,14" stroke="#FFFFF0" strokeWidth="3" strokeLinecap="round" />
      <path d="M24,12 L24,2" stroke="#FFFFF0" strokeWidth="3" strokeLinecap="round" />
      <path d="M38,28 L40,14" stroke="#FFFFF0" strokeWidth="3" strokeLinecap="round" />
      {/* Entrance */}
      <ellipse cx="24" cy="38" rx="7" ry="5" fill="#0A0505" />
      {/* Skull decoration */}
      <circle cx="24" cy="30" r="4" fill={WC3.undeadBone} />
      <circle cx="22" cy="29" r="1" fill="#0A0505" />
      <circle cx="26" cy="29" r="1" fill="#0A0505" />
    </svg>
  )
}

function ElfAncient({ size = 56 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      {/* Tree trunk */}
      <path d="M18,46 Q16,32 14,22 Q24,18 34,22 Q32,32 30,46 Z" fill={WC3.woodLight} />
      {/* Foliage layers */}
      <ellipse cx="24" cy="18" rx="18" ry="14" fill={WC3.elfPurpleDark} opacity="0.9" />
      <ellipse cx="18" cy="14" rx="12" ry="10" fill={WC3.elfPurple} opacity="0.7" />
      <ellipse cx="30" cy="16" rx="12" ry="10" fill={WC3.elfPurple} opacity="0.7" />
      {/* Face in bark */}
      <ellipse cx="21" cy="30" rx="2.5" ry="3.5" fill={WC3.elfSilver} />
      <ellipse cx="27" cy="30" rx="2.5" ry="3.5" fill={WC3.elfSilver} />
      <circle cx="21" cy="30" r="1" fill={WC3.elfPurpleDark} />
      <circle cx="27" cy="30" r="1" fill={WC3.elfPurpleDark} />
      {/* Moonwell glow */}
      <ellipse cx="24" cy="44" rx="8" ry="3" fill={WC3.elfSilver} opacity="0.3" />
    </svg>
  )
}

// ============================================================================
// WC3 UI COMPONENTS
// ============================================================================

interface ResourceBarProps {
  icon: React.ReactNode
  value: number
  maxValue?: number
  label: string
}

function ResourceCounter({ icon, value, maxValue, label }: ResourceBarProps) {
  return (
    <div
      className="flex items-center gap-1.5 px-3 py-1.5"
      style={{
        background: `linear-gradient(180deg, ${WC3.panelBgLight} 0%, ${WC3.panelBg} 100%)`,
        border: `2px solid ${WC3.goldDark}`,
        boxShadow: `inset 0 1px 0 rgba(255,215,0,0.2), 0 2px 4px rgba(0,0,0,0.5)`,
      }}
      role="status"
      aria-label={`${label}: ${value}${maxValue ? ` of ${maxValue}` : ''}`}
    >
      {icon}
      <span
        className="text-sm font-bold tabular-nums"
        style={{
          color: WC3.goldBright,
          textShadow: '0 1px 2px #000',
          fontFamily: '"Palatino Linotype", Palatino, Georgia, serif',
        }}
      >
        {maxValue ? `${value}/${maxValue}` : value.toLocaleString()}
      </span>
    </div>
  )
}

interface UnitPortraitProps {
  children: React.ReactNode
  selected?: boolean
  size?: number
}

function UnitPortrait({ children, selected = false, size = 64 }: UnitPortraitProps) {
  return (
    <div
      className="relative"
      style={{ width: size, height: size }}
      role="img"
      aria-label="Unit portrait"
    >
      {/* Gold beveled frame */}
      <div
        className="absolute inset-0 p-[3px]"
        style={{
          background: `linear-gradient(135deg, ${WC3.goldBright} 0%, ${WC3.goldDark} 50%, ${WC3.goldBright} 100%)`,
        }}
      >
        <div
          className="w-full h-full flex items-center justify-center"
          style={{
            background: WC3.panelBg,
            border: selected ? `2px solid ${WC3.healthGreen}` : `2px solid ${WC3.stoneDark}`,
            boxShadow: selected
              ? `0 0 12px ${WC3.healthGreen}80, inset 0 0 8px ${WC3.healthGreen}40`
              : 'inset 0 2px 4px rgba(0,0,0,0.8)',
          }}
        >
          {children}
        </div>
      </div>
      {/* Corner gems */}
      {[
        { pos: 'top-0 left-0', grad: '70% 70%' },
        { pos: 'top-0 right-0', grad: '30% 70%' },
        { pos: 'bottom-0 left-0', grad: '70% 30%' },
        { pos: 'bottom-0 right-0', grad: '30% 30%' },
      ].map((corner, i) => (
        <div
          key={i}
          className={`absolute w-2.5 h-2.5 ${corner.pos}`}
          style={{
            background: `radial-gradient(circle at ${corner.grad}, ${WC3.goldBright}, ${WC3.goldDark})`,
          }}
        />
      ))}
    </div>
  )
}

interface SegmentedBarProps {
  label: string
  current: number
  max: number
  type: 'health' | 'mana' | 'exp'
}

function SegmentedBar({ label, current, max, type }: SegmentedBarProps) {
  const percent = Math.min(100, (current / max) * 100)
  const segments = 10

  const colors = {
    health: percent > 50 ? WC3.healthGreen : percent > 25 ? '#FFFF00' : WC3.hordeRed,
    mana: WC3.manaBlue,
    exp: WC3.elfPurple,
  }

  return (
    <div
      className="flex items-center gap-2"
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={`${label}: ${current} of ${max}`}
    >
      <span
        className="text-xs font-bold w-10 text-right uppercase tracking-wide"
        style={{ color: WC3.textSilver }}
      >
        {label}
      </span>
      <div
        className="flex-1 h-4 flex gap-px overflow-hidden relative"
        style={{
          background: '#0A0A0A',
          border: `2px solid ${WC3.goldDark}`,
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.8)',
        }}
      >
        {[...Array(segments)].map((_, i) => {
          const segmentPercent = ((i + 1) / segments) * 100
          const isFilled = percent >= segmentPercent - (100 / segments / 2)
          return (
            <div
              key={i}
              className="flex-1 transition-colors"
              style={{
                background: isFilled ? colors[type] : 'transparent',
                boxShadow: isFilled ? 'inset 0 1px 0 rgba(255,255,255,0.3)' : 'none',
              }}
            />
          )
        })}
        <span
          className="absolute inset-0 flex items-center justify-center text-[11px] font-bold"
          style={{
            color: WC3.textWhite,
            textShadow: '0 1px 2px #000, 0 0 4px #000',
          }}
        >
          {current}/{max}
        </span>
      </div>
    </div>
  )
}

interface WC3PanelProps {
  title: string
  children: React.ReactNode
  faction?: 'alliance' | 'horde' | 'sentinel'
  className?: string
  id?: string
}

function WC3Panel({ title, children, faction = 'alliance', className = '', id }: WC3PanelProps) {
  const factionColors = {
    alliance: { primary: WC3.allianceBlue, accent: WC3.goldBright, border: WC3.goldMid },
    horde: { primary: WC3.hordeRed, accent: WC3.hordeRed, border: WC3.hordeRedDark },
    sentinel: { primary: WC3.elfPurple, accent: WC3.elfSilver, border: WC3.elfSilver },
  }
  const colors = factionColors[faction]

  return (
    <section
      id={id}
      className={`relative ${className}`}
      style={{
        background: `linear-gradient(180deg, ${WC3.panelBgLight} 0%, ${WC3.panelBg} 100%)`,
        border: `3px solid ${colors.border}`,
        boxShadow: `
          inset 0 0 40px ${colors.primary}10,
          0 4px 20px rgba(0,0,0,0.6),
          0 0 0 1px ${WC3.stoneDark}
        `,
      }}
      aria-labelledby={id ? `${id}-title` : undefined}
    >
      {/* Corner rivets */}
      {['top-2 left-2', 'top-2 right-2', 'bottom-2 left-2', 'bottom-2 right-2'].map((pos, i) => (
        <div
          key={i}
          className={`absolute w-4 h-4 rounded-full ${pos}`}
          style={{
            background: `radial-gradient(circle at 30% 30%, ${colors.accent}, ${WC3.goldDark})`,
            boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.3), 0 2px 4px rgba(0,0,0,0.5)',
          }}
          aria-hidden="true"
        />
      ))}

      {/* Title banner */}
      <div
        className="relative mx-6 -mt-4 px-8 py-2"
        style={{
          background: `linear-gradient(180deg, ${WC3.panelBgLight} 0%, ${WC3.panelBg} 100%)`,
          border: `2px solid ${colors.accent}`,
          boxShadow: `0 0 15px ${colors.primary}30, 0 4px 8px rgba(0,0,0,0.4)`,
        }}
      >
        <h2
          id={id ? `${id}-title` : undefined}
          className="text-base md:text-lg tracking-[0.2em] uppercase font-bold text-center"
          style={{
            color: colors.accent,
            textShadow: `0 0 10px ${colors.primary}60, 0 2px 0 #000`,
            fontFamily: '"Palatino Linotype", Palatino, Georgia, serif',
          }}
        >
          {title}
        </h2>
      </div>

      <div className="pt-6 pb-8 px-6 md:px-8">{children}</div>
    </section>
  )
}

interface CommandButtonProps {
  children: React.ReactNode
  hotkey?: string
  active?: boolean
  size?: number
  onClick?: () => void
  ariaLabel?: string
}

function CommandButton({ children, hotkey, active = false, size = 44, onClick, ariaLabel }: CommandButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      aria-pressed={active}
      className="relative group focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-transform hover:scale-105 active:scale-95"
      style={{
        width: size,
        height: size,
      }}
    >
      <div
        className="absolute inset-0 p-[2px]"
        style={{
          background: active
            ? `linear-gradient(135deg, ${WC3.goldBright} 0%, ${WC3.goldMid} 100%)`
            : `linear-gradient(135deg, ${WC3.stoneMid} 0%, ${WC3.stoneDark} 100%)`,
        }}
      >
        <div
          className="w-full h-full flex items-center justify-center transition-all"
          style={{
            background: active
              ? `linear-gradient(180deg, ${WC3.panelBgLight} 0%, ${WC3.panelBg} 100%)`
              : `linear-gradient(180deg, ${WC3.stoneDark} 0%, #0A0A0A 100%)`,
            boxShadow: active ? `inset 0 0 8px ${WC3.goldBright}40` : 'inset 0 2px 4px rgba(0,0,0,0.6)',
          }}
        >
          {children}
        </div>
      </div>
      {hotkey && (
        <div
          className="absolute -bottom-1 -right-1 w-4 h-4 flex items-center justify-center text-[9px] font-bold rounded-sm"
          style={{
            background: WC3.panelBg,
            border: `1px solid ${WC3.goldDark}`,
            color: WC3.textGold,
          }}
          aria-hidden="true"
        >
          {hotkey}
        </div>
      )}
    </button>
  )
}

// ============================================================================
// ART SECTION COMPONENTS (Between CV sections)
// ============================================================================

function FactionCrestsArt() {
  return (
    <div
      className="py-10 md:py-12"
      style={{
        background: `linear-gradient(90deg, transparent 0%, ${WC3.panelBg}90 15%, ${WC3.panelBg}90 85%, transparent 100%)`,
        borderTop: `1px solid ${WC3.goldDark}`,
        borderBottom: `1px solid ${WC3.goldDark}`,
      }}
      role="img"
      aria-label="Faction crests display"
    >
      <div className="max-w-4xl mx-auto flex justify-center items-center gap-8 md:gap-20 flex-wrap">
        <div className="text-center">
          <AllianceCrest size={90} />
          <p className="mt-3 text-sm uppercase tracking-widest font-bold" style={{ color: WC3.goldBright }}>
            Alliance
          </p>
          <p className="text-xs" style={{ color: WC3.allianceBlue }}>For Lordaeron!</p>
        </div>
        <div className="text-center">
          <HordeCrest size={90} />
          <p className="mt-3 text-sm uppercase tracking-widest font-bold" style={{ color: WC3.hordeRed }}>
            Horde
          </p>
          <p className="text-xs" style={{ color: WC3.hordeRedDark }}>Lok&apos;tar Ogar!</p>
        </div>
        <div className="text-center">
          <SentinelCrest size={90} />
          <p className="mt-3 text-sm uppercase tracking-widest font-bold" style={{ color: WC3.elfSilver }}>
            Sentinels
          </p>
          <p className="text-xs" style={{ color: WC3.elfPurple }}>Elune-Adore</p>
        </div>
      </div>
    </div>
  )
}

function WorkerUnitsArt() {
  return (
    <div
      className="py-10 md:py-12"
      style={{
        background: `linear-gradient(90deg, transparent 0%, ${WC3.panelBg}80 20%, ${WC3.panelBg}80 80%, transparent 100%)`,
        borderTop: `1px solid ${WC3.goldDark}`,
        borderBottom: `1px solid ${WC3.goldDark}`,
      }}
      role="img"
      aria-label="Worker units display"
    >
      <div className="max-w-3xl mx-auto flex justify-center items-end gap-10 md:gap-16 flex-wrap">
        <div className="text-center">
          <div className="flex justify-center">
            <PeasantUnit size={56} />
          </div>
          <p className="mt-2 text-xs uppercase tracking-wider font-bold" style={{ color: WC3.goldBright }}>
            Peasant
          </p>
          <p className="text-[10px]" style={{ color: WC3.textGray }}>Ready to work</p>
        </div>
        <div className="text-center">
          <div className="flex justify-center">
            <PeonUnit size={56} />
          </div>
          <p className="mt-2 text-xs uppercase tracking-wider font-bold" style={{ color: WC3.hordeRed }}>
            Peon
          </p>
          <p className="text-[10px]" style={{ color: WC3.textGray }}>Work work</p>
        </div>
        <div className="text-center">
          <div className="flex justify-center">
            <WispUnit size={56} />
          </div>
          <p className="mt-2 text-xs uppercase tracking-wider font-bold" style={{ color: WC3.elfSilver }}>
            Wisp
          </p>
          <p className="text-[10px]" style={{ color: WC3.textGray }}>For the trees</p>
        </div>
      </div>
    </div>
  )
}

function BuildingsArt() {
  return (
    <div
      className="py-10 md:py-12"
      style={{
        background: `linear-gradient(90deg, transparent 0%, ${WC3.panelBg}85 20%, ${WC3.panelBg}85 80%, transparent 100%)`,
        borderTop: `1px solid ${WC3.goldDark}`,
        borderBottom: `1px solid ${WC3.goldDark}`,
      }}
      role="img"
      aria-label="Buildings display"
    >
      <div className="max-w-4xl mx-auto flex justify-center items-end gap-8 md:gap-16 flex-wrap">
        <div className="text-center">
          <div className="flex justify-center">
            <HumanTownHall size={72} />
          </div>
          <p className="mt-2 text-xs uppercase tracking-wider font-bold" style={{ color: WC3.goldBright }}>
            Town Hall
          </p>
        </div>
        <div className="text-center">
          <div className="flex justify-center">
            <OrcBurrow size={72} />
          </div>
          <p className="mt-2 text-xs uppercase tracking-wider font-bold" style={{ color: WC3.hordeRed }}>
            Burrow
          </p>
        </div>
        <div className="text-center">
          <div className="flex justify-center">
            <ElfAncient size={72} />
          </div>
          <p className="mt-2 text-xs uppercase tracking-wider font-bold" style={{ color: WC3.elfSilver }}>
            Ancient
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// CV CONTENT CARDS
// ============================================================================

interface ExperienceCardProps {
  entry: typeof EXPERIENCE_DATA[0]
}

function ExperienceCard({ entry }: ExperienceCardProps) {
  const endDisplay = entry.endDate ? new Date(entry.endDate).getFullYear() : 'Present'
  const startDisplay = new Date(entry.startDate).getFullYear()
  const isCurrentRole = !entry.endDate

  return (
    <article
      className="p-5 transition-all duration-200 hover:brightness-110 focus-within:brightness-110"
      style={{
        background: `linear-gradient(135deg, ${WC3.panelBg} 0%, #0A0808 100%)`,
        border: `2px solid ${isCurrentRole ? WC3.healthGreen : WC3.panelBorder}`,
        boxShadow: isCurrentRole ? `0 0 16px ${WC3.healthGreen}20` : 'none',
      }}
    >
      <div className="flex justify-between items-start mb-3 gap-3">
        <div className="flex items-start gap-4">
          <UnitPortrait size={40} selected={isCurrentRole}>
            <span className="text-lg font-bold" style={{ color: WC3.textGold }}>
              {entry.title.charAt(0)}
            </span>
          </UnitPortrait>
          <div>
            <h3
              className="text-base font-bold"
              style={{ color: WC3.textWhite }}
            >
              {entry.title}
            </h3>
            <p className="text-sm" style={{ color: WC3.textGold }}>{entry.organization}</p>
          </div>
        </div>
        <div
          className="flex items-center gap-2 shrink-0 px-2 py-1"
          style={{
            background: `${WC3.goldDark}20`,
            border: `1px solid ${WC3.goldDark}40`,
          }}
        >
          <GoldIcon size={14} />
          <span className="text-xs font-bold tabular-nums" style={{ color: WC3.textSilver }}>
            {startDisplay} - {endDisplay}
          </span>
        </div>
      </div>

      <p className="text-sm mb-3 ml-14" style={{ color: WC3.textGray }}>
        {entry.description}
      </p>

      {entry.highlights && entry.highlights.length > 0 && (
        <ul className="space-y-2 ml-14">
          {entry.highlights.map((h, i) => (
            <li key={i} className="text-sm flex items-start gap-2">
              <span
                className="mt-0.5 font-bold"
                style={{ color: WC3.healthGreen }}
                aria-hidden="true"
              >
                +
              </span>
              <span style={{ color: WC3.textWhite }}>{h}</span>
            </li>
          ))}
        </ul>
      )}

      {entry.skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3 ml-14">
          {entry.skills.slice(0, 5).map((skill) => (
            <span
              key={skill}
              className="text-[10px] px-2 py-0.5 font-bold uppercase tracking-wide"
              style={{
                background: `${WC3.allianceBlue}20`,
                border: `1px solid ${WC3.allianceBlue}40`,
                color: WC3.allianceBlueBright,
              }}
            >
              {skill}
            </span>
          ))}
        </div>
      )}
    </article>
  )
}

interface ProjectCardProps {
  project: typeof PROJECTS_DATA[0]
}

function ProjectCard({ project }: ProjectCardProps) {
  const isLegendary = project.featured

  return (
    <article
      className="p-5 transition-all duration-200 hover:brightness-110 focus-within:brightness-110"
      style={{
        background: `linear-gradient(135deg, ${WC3.panelBg} 0%, #0A0808 100%)`,
        border: `2px solid ${isLegendary ? WC3.goldBright : WC3.panelBorder}`,
        boxShadow: isLegendary ? `0 0 20px ${WC3.goldBright}15` : 'none',
      }}
    >
      {isLegendary && (
        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-2.5 h-2.5 rounded-full animate-pulse"
            style={{
              background: WC3.goldBright,
              boxShadow: `0 0 8px ${WC3.goldBright}`,
            }}
          />
          <span
            className="text-xs tracking-widest font-bold uppercase"
            style={{ color: WC3.goldBright }}
          >
            Legendary
          </span>
        </div>
      )}

      <h3
        className="text-base font-bold mb-2"
        style={{ color: isLegendary ? WC3.goldBright : WC3.allianceBlueBright }}
      >
        {project.name}
      </h3>

      <p className="text-sm mb-2" style={{ color: WC3.textGold }}>{project.tagline}</p>
      <p className="text-sm mb-3" style={{ color: WC3.textGray }}>{project.description}</p>

      {project.impact && (
        <p className="text-sm mb-3 flex items-start gap-2">
          <span className="font-bold" style={{ color: WC3.healthGreen }}>+</span>
          <span style={{ color: WC3.healthGreen }}>{project.impact}</span>
        </p>
      )}

      <div className="flex flex-wrap gap-1.5">
        {project.techStack.slice(0, 5).map((tech) => (
          <span
            key={tech}
            className="text-[10px] px-2 py-0.5 font-bold uppercase tracking-wide"
            style={{
              background: `${WC3.allianceBlue}20`,
              border: `1px solid ${WC3.allianceBlue}40`,
              color: WC3.textSilver,
            }}
          >
            {tech}
          </span>
        ))}
      </div>

      {project.links && (project.links.site || project.links.demo) && (
        <div className="mt-4">
          <a
            href={project.links.site || project.links.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-bold transition-all hover:brightness-125 focus:outline-none focus-visible:ring-2 px-3 py-1.5"
            style={{
              color: WC3.goldBright,
              background: `${WC3.goldDark}20`,
              border: `1px solid ${WC3.goldDark}`,
            }}
          >
            View Quest
            <span aria-hidden="true">-&gt;</span>
          </a>
        </div>
      )}
    </article>
  )
}

interface CompanyCardProps {
  company: typeof COMPANIES[0]
}

function CompanyCard({ company }: CompanyCardProps) {
  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-5 transition-all duration-200 hover:brightness-110 focus:outline-none focus-visible:ring-2"
      style={{
        background: `linear-gradient(135deg, ${WC3.panelBg} 0%, #0A0808 100%)`,
        border: `2px solid ${WC3.panelBorder}`,
      }}
    >
      <div className="flex items-center gap-3 mb-3">
        <UnitPortrait size={44}>
          <span className="text-xl" role="img" aria-label={company.name}>
            {company.icon}
          </span>
        </UnitPortrait>
        <div>
          <h3 className="text-base font-bold" style={{ color: WC3.textWhite }}>{company.name}</h3>
          <p className="text-sm" style={{ color: WC3.textGold }}>{company.tagline}</p>
        </div>
      </div>
      <p className="text-sm" style={{ color: WC3.textGray }}>{company.description}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {company.services.slice(0, 3).map((service) => (
          <span
            key={service}
            className="text-[10px] px-2 py-0.5 font-bold"
            style={{
              background: `${WC3.healthGreen}15`,
              border: `1px solid ${WC3.healthGreen}30`,
              color: WC3.healthGreen,
            }}
          >
            {service}
          </span>
        ))}
      </div>
    </a>
  )
}

interface BandCardProps {
  band: typeof BANDS[0]
}

function BandCard({ band }: BandCardProps) {
  const content = (
    <article
      className="p-5 transition-all duration-200 hover:brightness-110"
      style={{
        background: `linear-gradient(135deg, ${WC3.panelBg} 0%, #0A0808 100%)`,
        border: `2px solid ${band.active ? WC3.elfPurple : WC3.panelBorder}`,
        boxShadow: band.active ? `0 0 12px ${WC3.elfPurple}20` : 'none',
      }}
    >
      <div className="flex items-center gap-3 mb-3">
        <UnitPortrait size={36}>
          <WispUnit size={28} />
        </UnitPortrait>
        <div>
          <h3 className="text-base font-bold" style={{ color: WC3.textWhite }}>{band.name}</h3>
          <p className="text-sm" style={{ color: WC3.textGold }}>{band.genre} | {band.role}</p>
        </div>
      </div>
      <p className="text-sm" style={{ color: WC3.textGray }}>{band.description}</p>
      {band.active && (
        <div className="mt-3 flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: WC3.healthGreen, boxShadow: `0 0 6px ${WC3.healthGreen}` }}
          />
          <span className="text-xs font-bold" style={{ color: WC3.healthGreen }}>Active</span>
        </div>
      )}
    </article>
  )

  if (band.url) {
    return (
      <a
        href={band.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block focus:outline-none focus-visible:ring-2"
      >
        {content}
      </a>
    )
  }
  return content
}

// ============================================================================
// SKILLS DISPLAY COMPONENTS
// ============================================================================

interface TechGridProps {
  categories: ReturnType<typeof getEngineerSkills>
}

function TechGrid({ categories }: TechGridProps) {
  return (
    <div className="space-y-8">
      {categories.map((category) => (
        <div key={category.name}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xl" role="img" aria-label={category.name}>{category.icon}</span>
            <h3
              className="text-sm tracking-widest uppercase font-bold"
              style={{
                color: WC3.textGold,
                fontFamily: '"Palatino Linotype", Palatino, Georgia, serif',
              }}
            >
              {category.name}
            </h3>
            <div
              className="flex-1 h-px"
              style={{ background: `linear-gradient(90deg, ${WC3.goldDark}, transparent)` }}
              aria-hidden="true"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {category.items.map((tech) => (
              <CommandButton key={tech} active={true} size={42} ariaLabel={tech}>
                <span
                  className="text-[9px] font-bold text-center leading-tight px-0.5 uppercase"
                  style={{ color: WC3.textWhite }}
                >
                  {tech.substring(0, 4)}
                </span>
              </CommandButton>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
            {category.items.map((tech) => (
              <span
                key={tech}
                className="text-xs"
                style={{ color: WC3.textSilver }}
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

interface SkillsGridProps {
  categories: ReturnType<typeof getSkillsByProfession>
}

function SkillsGrid({ categories }: SkillsGridProps) {
  return (
    <div className="grid md:grid-cols-3 gap-8">
      {categories.map((category) => (
        <div key={category.name}>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl" role="img" aria-label={category.name}>{category.icon}</span>
            <h3
              className="text-sm tracking-widest uppercase font-bold"
              style={{ color: WC3.textGold }}
            >
              {category.name}
            </h3>
          </div>
          <ul className="space-y-3">
            {category.skills.map((skill) => (
              <li
                key={skill.name}
                className="flex items-center gap-3 text-sm"
                style={{ color: WC3.textWhite }}
              >
                <div
                  className="w-2.5 h-2.5 rotate-45 shrink-0"
                  style={{ background: WC3.healthGreen }}
                  aria-hidden="true"
                />
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
// FACTION SELECTOR (Race Selection Screen)
// ============================================================================

interface FactionSelectorProps {
  active: 'engineer' | 'drummer' | 'fighter'
  onSelect: (profession: 'engineer' | 'drummer' | 'fighter') => void
}

function FactionSelector({ active, onSelect }: FactionSelectorProps) {
  const factions = [
    {
      id: 'engineer' as const,
      name: 'System Engineer',
      desc: 'Senior Staff • CTO',
      icon: <AllianceCrest size={52} />,
      color: WC3.allianceBlue,
      accent: WC3.goldBright,
    },
    {
      id: 'drummer' as const,
      name: 'Musician',
      desc: 'Professional Drummer',
      icon: <SentinelCrest size={52} />,
      color: WC3.elfPurple,
      accent: WC3.elfSilver,
    },
    {
      id: 'fighter' as const,
      name: 'Martial Artist',
      desc: 'BJJ Instructor',
      icon: <HordeCrest size={52} />,
      color: WC3.hordeRed,
      accent: WC3.hordeRed,
    },
  ]

  return (
    <nav
      className="flex justify-center gap-4 md:gap-8 py-6 flex-wrap"
      role="tablist"
      aria-label="Profession selection"
    >
      {factions.map((faction) => (
        <button
          key={faction.id}
          onClick={() => onSelect(faction.id)}
          role="tab"
          aria-selected={active === faction.id}
          aria-controls={`${faction.id}-content`}
          className="relative group focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-transform hover:scale-105 active:scale-95"
        >
          <div
            className="w-32 md:w-40 h-40 md:h-48 flex flex-col items-center justify-center gap-3 p-4 transition-all duration-200"
            style={{
              background: active === faction.id
                ? `linear-gradient(180deg, ${faction.color}30 0%, ${WC3.panelBg} 100%)`
                : `linear-gradient(180deg, ${WC3.panelBgLight} 0%, ${WC3.panelBg} 100%)`,
              border: `3px solid ${active === faction.id ? faction.accent : WC3.panelBorder}`,
              boxShadow: active === faction.id
                ? `0 0 25px ${faction.color}40, inset 0 0 20px ${faction.color}15`
                : 'inset 0 2px 4px rgba(0,0,0,0.5)',
            }}
          >
            <div className="relative">
              {faction.icon}
              {active === faction.id && (
                <div
                  className="absolute inset-0 animate-pulse pointer-events-none"
                  style={{ filter: `drop-shadow(0 0 8px ${faction.accent})` }}
                  aria-hidden="true"
                >
                  {faction.icon}
                </div>
              )}
            </div>
            <span
              className="text-[11px] md:text-xs font-bold tracking-wider text-center leading-tight uppercase"
              style={{
                color: active === faction.id ? faction.accent : WC3.textGray,
                textShadow: active === faction.id ? `0 0 10px ${faction.color}` : 'none',
                fontFamily: '"Palatino Linotype", Palatino, Georgia, serif',
              }}
            >
              {faction.name}
            </span>
            <span
              className="text-[10px]"
              style={{ color: WC3.textGray }}
            >
              {faction.desc}
            </span>
          </div>

          {/* Selection indicator */}
          {active === faction.id && (
            <div
              className="absolute -bottom-2 left-1/2 -translate-x-1/2"
              style={{
                width: 0,
                height: 0,
                borderLeft: '10px solid transparent',
                borderRight: '10px solid transparent',
                borderTop: `10px solid ${faction.accent}`,
              }}
              aria-hidden="true"
            />
          )}
        </button>
      ))}
    </nav>
  )
}

// ============================================================================
// MINIMAP COMPONENT (Footer)
// ============================================================================

interface MinimapProps {
  children: React.ReactNode
}

function Minimap({ children }: MinimapProps) {
  return (
    <div className="relative" aria-label="Minimap navigation">
      {/* Gold frame */}
      <div
        className="p-1"
        style={{
          background: `linear-gradient(135deg, ${WC3.goldBright} 0%, ${WC3.goldDark} 50%, ${WC3.goldBright} 100%)`,
        }}
      >
        <div
          className="p-1"
          style={{
            background: WC3.panelBg,
            border: `1px solid ${WC3.panelBorder}`,
          }}
        >
          {children}
        </div>
      </div>
      {/* Corner gems */}
      {['-top-1.5 -left-1.5', '-top-1.5 -right-1.5', '-bottom-1.5 -left-1.5', '-bottom-1.5 -right-1.5'].map((pos, i) => (
        <div
          key={i}
          className={`absolute w-4 h-4 ${pos}`}
          style={{
            background: `radial-gradient(circle, ${WC3.goldBright} 0%, ${WC3.goldDark} 70%, ${WC3.goldDeep} 100%)`,
            borderRadius: '2px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
          }}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}

// ============================================================================
// TERRAIN GRID BACKGROUND
// ============================================================================

function TerrainGrid() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        backgroundImage: `
          linear-gradient(${WC3.natureDark}08 1px, transparent 1px),
          linear-gradient(90deg, ${WC3.natureDark}08 1px, transparent 1px)
        `,
        backgroundSize: '48px 48px',
      }}
      aria-hidden="true"
    />
  )
}

// ============================================================================
// COMMAND PANEL (Bottom UI - WC3 Style)
// ============================================================================

function CommandPanel() {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 hidden md:block"
      style={{
        background: `linear-gradient(180deg, ${WC3.panelBgLight} 0%, ${WC3.panelBg} 100%)`,
        borderTop: `3px solid ${WC3.goldMid}`,
        boxShadow: '0 -4px 16px rgba(0,0,0,0.6)',
      }}
      role="complementary"
      aria-label="Command panel"
    >
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between gap-6">
        {/* Left: Mini portrait */}
        <div className="flex items-center gap-4">
          <UnitPortrait size={56} selected>
            <AllianceCrest size={44} />
          </UnitPortrait>
          <div>
            <SegmentedBar label="EXP" current={85} max={100} type="exp" />
          </div>
        </div>

        {/* Center: Command buttons grid */}
        <div className="flex gap-1.5">
          <CommandButton hotkey="A" active ariaLabel="Attack">
            <span className="text-xs font-bold" style={{ color: WC3.textGold }}>A</span>
          </CommandButton>
          <CommandButton hotkey="S" ariaLabel="Stop">
            <span className="text-xs font-bold" style={{ color: WC3.textGray }}>S</span>
          </CommandButton>
          <CommandButton hotkey="M" ariaLabel="Move">
            <span className="text-xs font-bold" style={{ color: WC3.textGray }}>M</span>
          </CommandButton>
          <CommandButton hotkey="H" ariaLabel="Hold">
            <span className="text-xs font-bold" style={{ color: WC3.textGray }}>H</span>
          </CommandButton>
        </div>

        {/* Right: Minimap */}
        <Minimap>
          <div
            className="w-28 h-20 flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${WC3.natureDark}30 0%, ${WC3.woodDark}30 50%, ${WC3.allianceBlue}20 100%)`,
            }}
          >
            <div className="flex gap-2">
              <AllianceCrest size={20} />
              <HordeCrest size={20} />
              <SentinelCrest size={20} />
            </div>
          </div>
        </Minimap>
      </div>
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
  const mainRef = useRef<HTMLDivElement>(null)

  // Data
  const aboutData = ABOUT_DATA[active]
  const engineerTech = getEngineerSkills()
  const otherSkills = getSkillsByProfession(active)
  const projects = active === 'engineer'
    ? PROJECTS_DATA.filter(p => p.professions.includes('engineer') || p.featured)
    : filterProjectsByProfession(PROJECTS_DATA, active)
  const experience = filterExperienceByProfession(EXPERIENCE_DATA, active)
  const workExperience = WORK_EXPERIENCE

  // Faction mapping
  const factionMap = {
    engineer: 'alliance' as const,
    drummer: 'sentinel' as const,
    fighter: 'horde' as const,
  }
  const currentFaction = factionMap[active]

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: WC3.panelBg }}
      >
        <div className="text-center">
          <AllianceCrest size={80} />
          <p className="mt-4 text-sm animate-pulse" style={{ color: WC3.textGold }}>
            Loading Azeroth...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen relative overflow-x-hidden pb-20 md:pb-24"
      style={{
        background: `linear-gradient(180deg, #0A0808 0%, #0F0C0A 50%, #0A0808 100%)`,
        fontFamily: '"Palatino Linotype", Palatino, Georgia, "Times New Roman", serif',
      }}
    >
      <TerrainGrid />

      {/* ====== TOP RESOURCE BAR ====== */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex justify-center items-center gap-3 md:gap-6 py-2 px-4"
        style={{
          background: `linear-gradient(180deg, ${WC3.panelBgLight} 0%, ${WC3.panelBg} 100%)`,
          borderBottom: `3px solid ${WC3.goldMid}`,
          boxShadow: '0 4px 12px rgba(0,0,0,0.6)',
        }}
        role="banner"
      >
        <ResourceCounter icon={<GoldIcon size={18} />} value={15000} label="Experience Years" />
        <ResourceCounter icon={<LumberIcon size={18} />} value={85} maxValue={100} label="Skill Level" />
        <ResourceCounter icon={<FoodIcon size={18} />} value={100} maxValue={100} label="Energy" />
      </header>

      {/* ====== HERO HEADER ====== */}
      <section className="relative z-40 pt-20 md:pt-24 px-4 md:px-8" aria-label="Hero section">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-6 lg:gap-8">
            {/* Portrait + Name */}
            <div className="flex items-start gap-5">
              <UnitPortrait size={88} selected>
                {active === 'engineer' && <AllianceCrest size={68} />}
                {active === 'drummer' && <SentinelCrest size={68} />}
                {active === 'fighter' && <HordeCrest size={68} />}
              </UnitPortrait>
              <div>
                <h1
                  className="text-2xl md:text-4xl font-bold tracking-wide uppercase"
                  style={{
                    color: WC3.textGold,
                    textShadow: '2px 2px 0 #000, 0 0 15px rgba(255,215,0,0.4)',
                  }}
                >
                  Alexander Pulido
                </h1>
                <p
                  className="text-base md:text-lg mt-1"
                  style={{ color: WC3.textWhite }}
                >
                  {PROFESSIONAL_SUMMARY.headline}
                </p>
                <p
                  className="text-sm md:text-base mt-1 italic"
                  style={{ color: WC3.textGold }}
                >
                  {PROFESSIONAL_SUMMARY.tagline}
                </p>

                {/* Stats bars */}
                <div className="mt-5 space-y-2 w-64 md:w-80">
                  <SegmentedBar label="EXP" current={10} max={10} type="exp" />
                  <SegmentedBar label="MANA" current={100} max={100} type="mana" />
                </div>
              </div>
            </div>

            {/* Nav buttons */}
            <div className="flex flex-wrap gap-3 items-center">
              <Link
                href="/cv"
                className="px-5 py-2.5 text-sm font-bold tracking-wider uppercase transition-all hover:brightness-125 focus:outline-none focus-visible:ring-2"
                style={{
                  background: `linear-gradient(180deg, ${WC3.panelBgLight} 0%, ${WC3.panelBg} 100%)`,
                  border: `2px solid ${WC3.goldBright}`,
                  color: WC3.textGold,
                  boxShadow: `inset 0 1px 0 rgba(255,215,0,0.3), 0 3px 0 ${WC3.goldDark}`,
                }}
              >
                Scroll
              </Link>
              <Link
                href="/personal-projects/game-engine"
                className="px-5 py-2.5 text-sm font-bold tracking-wider uppercase transition-all hover:brightness-125 focus:outline-none focus-visible:ring-2"
                style={{
                  background: `linear-gradient(180deg, ${WC3.allianceBlue}30 0%, ${WC3.allianceBlueDark}50 100%)`,
                  border: `2px solid ${WC3.allianceBlue}`,
                  color: WC3.allianceBlueBright,
                  boxShadow: `inset 0 1px 0 rgba(0,102,204,0.3), 0 3px 0 ${WC3.allianceBlueDark}`,
                }}
              >
                Nebulith
              </Link>
              <ThemeSwitcher />
            </div>
          </div>

          {/* Current Roles */}
          <div className="mt-8 flex flex-wrap justify-center gap-6 md:gap-12">
            {CURRENT_ROLES.map((role) => (
              <div key={role.id} className="flex items-center gap-3">
                <div
                  className="w-2.5 h-2.5 rounded-full animate-pulse"
                  style={{ background: WC3.healthGreen, boxShadow: `0 0 8px ${WC3.healthGreen}` }}
                  aria-hidden="true"
                />
                <div className="text-center">
                  <p className="text-sm font-bold" style={{ color: WC3.textGold }}>{role.title}</p>
                  <p className="text-base" style={{ color: WC3.textWhite }}>{role.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== FACTION SELECTOR ====== */}
      <section className="relative z-30 py-6" aria-label="Profession selector">
        <FactionSelector active={active} onSelect={setActive} />
      </section>

      {/* ====== MAIN CONTENT ====== */}
      <main ref={mainRef} className="relative z-20 space-y-0" id={`${active}-content`}>

        {/* ABOUT SECTION */}
        <section className="py-10 px-4 md:px-8" aria-label="About">
          <div className="max-w-4xl mx-auto">
            <WC3Panel title="Unit Information" faction={currentFaction} id="about">
              <p
                className="text-base leading-relaxed mb-5"
                style={{
                  color: WC3.textWhite,
                  background: `${WC3.parchmentDark}10`,
                  padding: '1rem',
                  border: `1px solid ${WC3.parchmentDark}30`,
                }}
              >
                {aboutData.bio}
              </p>
              <div className="flex flex-wrap gap-2">
                {aboutData.quickFacts.map((fact, i) => (
                  <span
                    key={i}
                    className="px-4 py-1.5 text-sm font-bold"
                    style={{
                      background: `${WC3.goldBright}10`,
                      border: `1px solid ${WC3.goldMid}50`,
                      color: WC3.textGold,
                    }}
                  >
                    {fact}
                  </span>
                ))}
              </div>
            </WC3Panel>
          </div>
        </section>

        {/* ART SECTION: FACTION CRESTS */}
        <FactionCrestsArt />

        {/* EXPERIENCE SECTION */}
        {(active === 'engineer' ? workExperience.length > 0 : experience.length > 0) && (
          <section className="py-10 px-4 md:px-8" aria-label="Experience">
            <div className="max-w-4xl mx-auto">
              <WC3Panel title="Campaign History" faction={currentFaction} id="experience">
                <div className="space-y-5">
                  {active === 'engineer' ? (
                    workExperience.map((job) => (
                      <article
                        key={job.company}
                        className="p-5"
                        style={{
                          background: `linear-gradient(135deg, ${WC3.panelBg} 0%, #0A0808 100%)`,
                          border: `2px solid ${job.current ? WC3.healthGreen : WC3.panelBorder}`,
                          boxShadow: job.current ? `0 0 16px ${WC3.healthGreen}20` : 'none',
                        }}
                      >
                        <div className="flex justify-between items-start mb-3 gap-3">
                          <div className="flex items-start gap-4">
                            <UnitPortrait size={40} selected={job.current}>
                              <span className="text-lg font-bold" style={{ color: WC3.textGold }}>
                                {job.title.charAt(0)}
                              </span>
                            </UnitPortrait>
                            <div>
                              <h3 className="text-base font-bold" style={{ color: WC3.textWhite }}>
                                {job.title}
                              </h3>
                              <p className="text-sm" style={{ color: WC3.textGold }}>{job.company}</p>
                            </div>
                          </div>
                          <div
                            className="flex items-center gap-2 shrink-0 px-2 py-1"
                            style={{
                              background: `${WC3.goldDark}20`,
                              border: `1px solid ${WC3.goldDark}40`,
                            }}
                          >
                            <GoldIcon size={14} />
                            <span className="text-xs font-bold" style={{ color: WC3.textSilver }}>
                              {job.period}
                            </span>
                          </div>
                        </div>
                        <ul className="space-y-2 ml-14">
                          {job.highlights.map((h, i) => (
                            <li key={i} className="text-sm flex items-start gap-2">
                              <span className="font-bold" style={{ color: WC3.healthGreen }}>+</span>
                              <span style={{ color: WC3.textWhite }}>{h}</span>
                            </li>
                          ))}
                        </ul>
                        {job.technologies && (
                          <div className="flex flex-wrap gap-1.5 mt-3 ml-14">
                            {job.technologies.map((tech) => (
                              <span
                                key={tech}
                                className="text-[10px] px-2 py-0.5 font-bold uppercase tracking-wide"
                                style={{
                                  background: `${WC3.allianceBlue}20`,
                                  border: `1px solid ${WC3.allianceBlue}40`,
                                  color: WC3.allianceBlueBright,
                                }}
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </article>
                    ))
                  ) : (
                    experience.map((entry) => (
                      <ExperienceCard key={entry.id} entry={entry} />
                    ))
                  )}
                </div>
              </WC3Panel>
            </div>
          </section>
        )}

        {/* ART SECTION: WORKER UNITS */}
        <WorkerUnitsArt />

        {/* SKILLS SECTION */}
        <section className="py-10 px-4 md:px-8" aria-label="Skills">
          <div className="max-w-4xl mx-auto">
            <WC3Panel
              title={active === 'engineer' ? 'Spell Book' : 'Abilities'}
              faction={currentFaction}
              id="skills"
            >
              {active === 'engineer' ? (
                <TechGrid categories={engineerTech} />
              ) : (
                <SkillsGrid categories={otherSkills} />
              )}
            </WC3Panel>
          </div>
        </section>

        {/* PROJECTS SECTION */}
        <section className="py-10 px-4 md:px-8" aria-label="Projects">
          <div className="max-w-4xl mx-auto">
            <WC3Panel title="Completed Quests" faction={currentFaction} id="projects">
              <div className="grid md:grid-cols-2 gap-5">
                {(active === 'engineer' ? getFeaturedProjects(projects) : projects).slice(0, 6).map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </WC3Panel>
          </div>
        </section>

        {/* ART SECTION: BUILDINGS */}
        <BuildingsArt />

        {/* VENTURES SECTION (Companies for Engineer, Bands for Drummer) */}
        {active === 'engineer' && (
          <section className="py-10 px-4 md:px-8" aria-label="Companies">
            <div className="max-w-4xl mx-auto">
              <WC3Panel title="Allied Outposts" faction="alliance" id="ventures">
                <div className="grid md:grid-cols-3 gap-5">
                  {COMPANIES.map((company) => (
                    <CompanyCard key={company.id} company={company} />
                  ))}
                </div>
              </WC3Panel>
            </div>
          </section>
        )}

        {active === 'drummer' && (
          <section className="py-10 px-4 md:px-8" aria-label="Bands">
            <div className="max-w-4xl mx-auto">
              <WC3Panel title="Warbands" faction="sentinel" id="ventures">
                <div className="grid md:grid-cols-3 gap-5">
                  {BANDS.map((band) => (
                    <BandCard key={band.id} band={band} />
                  ))}
                </div>
              </WC3Panel>
            </div>
          </section>
        )}

        {/* POSTS SECTION (Placeholder) */}
        <section className="py-10 px-4 md:px-8" aria-label="Posts">
          <div className="max-w-4xl mx-auto">
            <WC3Panel title="War Chronicles" faction={currentFaction} id="posts">
              <div
                className="text-center py-12 px-4"
                style={{
                  background: `${WC3.parchmentDark}08`,
                  border: `1px dashed ${WC3.panelBorder}`,
                }}
              >
                <div className="flex justify-center mb-4">
                  {active === 'engineer' && <AllianceCrest size={48} />}
                  {active === 'drummer' && <SentinelCrest size={48} />}
                  {active === 'fighter' && <HordeCrest size={48} />}
                </div>
                <p className="text-base italic" style={{ color: WC3.textGray }}>
                  Chronicles coming soon...
                </p>
                <p className="text-sm mt-2" style={{ color: WC3.panelBorder }}>
                  Battle reports and strategic insights await
                </p>
              </div>
            </WC3Panel>
          </div>
        </section>

      </main>

      {/* ====== FOOTER MINIMAP ====== */}
      <footer className="relative z-20 py-12 px-4" role="contentinfo">
        <div className="max-w-sm mx-auto">
          <Minimap>
            <div
              className="w-full h-36 flex flex-col items-center justify-center gap-3"
              style={{
                background: `linear-gradient(135deg, ${WC3.natureDark}25 0%, ${WC3.woodDark}25 50%, ${WC3.allianceBlue}15 100%)`,
              }}
            >
              <div className="flex justify-center gap-5">
                <AllianceCrest size={28} />
                <HordeCrest size={28} />
                <SentinelCrest size={28} />
              </div>
              <p
                className="text-base font-bold uppercase tracking-wider"
                style={{ color: WC3.textGold }}
              >
                Azeroth
              </p>
              <p className="text-xs" style={{ color: WC3.textGray }}>
                Warcraft III: Reign of Chaos
              </p>
            </div>
          </Minimap>
        </div>
        <p
          className="text-center text-xs mt-6"
          style={{ color: WC3.textGray }}
        >
          Built with the spirit of classic RTS games (1994-2003)
        </p>
      </footer>

      {/* ====== COMMAND PANEL (Desktop) ====== */}
      <CommandPanel />

      {/* ====== ACCESSIBILITY: Reduced Motion ====== */}
      <style jsx global>{`
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* Focus visible styles */
        :focus-visible {
          outline: 2px solid ${WC3.goldBright};
          outline-offset: 2px;
        }

        /* Skip link */
        .skip-link {
          position: absolute;
          top: -40px;
          left: 0;
          background: ${WC3.panelBg};
          color: ${WC3.textGold};
          padding: 8px;
          z-index: 100;
        }

        .skip-link:focus {
          top: 0;
        }
      `}</style>
    </div>
  )
}
