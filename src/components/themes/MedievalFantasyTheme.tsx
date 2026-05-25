'use client'

import { useEffect, useState, useMemo } from 'react'
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
// Based on classic RTS UI: gold borders, stone panels, beveled edges
// ============================================================================

const WC3 = {
  // Human Alliance (WC2/WC3)
  humanBlue: '#0042FF',
  humanGold: '#FFD700',
  humanSilver: '#C0C0C0',
  humanBrown: '#5C4033',

  // Orc Horde (WC2/WC3)
  orcRed: '#FF0000',
  orcBrown: '#8B4513',
  orcBlack: '#1A0A0A',
  orcOrange: '#FF6600',

  // Night Elf (WC3)
  elfPurple: '#800080',
  elfSilver: '#C0C0C0',
  elfMoonlight: '#B8A9D4',
  elfGreen: '#00FF7F',

  // Undead (WC3)
  undeadGreen: '#00FF00',
  undeadBlack: '#0A0A0A',
  undeadPurple: '#4B0082',
  undeadBone: '#D4C4A8',

  // RTS UI Colors
  panelGold: '#C9A227',
  panelBronze: '#CD7F32',
  panelDark: '#1A1612',
  panelStone: '#3D3428',
  panelBorder: '#6B5A3C',

  // Resource colors
  goldYellow: '#FFD700',
  lumberGreen: '#228B22',
  foodOrange: '#FF8C00',
  supplyBlue: '#4169E1',

  // Health/Mana bars (classic RTS style)
  healthGreen: '#00FF00',
  healthYellow: '#FFFF00',
  healthRed: '#FF0000',
  manaBlue: '#0000FF',

  // Text colors
  textGold: '#FFD700',
  textWhite: '#FFFFFF',
  textGray: '#AAAAAA',
  textGreen: '#00FF00',
  textRed: '#FF0000',

  // Terrain textures
  grassGreen: '#2D5016',
  dirtBrown: '#4A3728',
  stoneGray: '#4A4A4A',
  waterBlue: '#1E3A5F',

  // Fog of war
  fogBlack: '#000000',
  fogGray: '#1A1A1A',
}

// ============================================================================
// WC3 STYLE GOLD RESOURCE ICON (inline SVG)
// ============================================================================

function GoldIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      aria-label="Gold"
      role="img"
    >
      {/* Gold coin stack */}
      <ellipse cx="8" cy="12" rx="6" ry="2" fill={WC3.panelBronze} />
      <ellipse cx="8" cy="11" rx="6" ry="2" fill={WC3.goldYellow} />
      <ellipse cx="8" cy="9" rx="5" ry="1.5" fill={WC3.panelBronze} />
      <ellipse cx="8" cy="8" rx="5" ry="1.5" fill={WC3.goldYellow} />
      <ellipse cx="8" cy="6" rx="4" ry="1" fill={WC3.panelBronze} />
      <ellipse cx="8" cy="5" rx="4" ry="1" fill={WC3.goldYellow} />
    </svg>
  )
}

// ============================================================================
// WC3 STYLE LUMBER RESOURCE ICON
// ============================================================================

function LumberIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      aria-label="Lumber"
      role="img"
    >
      {/* Log stack */}
      <rect x="2" y="10" width="12" height="4" rx="2" fill="#5C4033" />
      <rect x="3" y="10" width="10" height="1" fill="#8B6914" />
      <rect x="3" y="6" width="10" height="4" rx="2" fill="#6B4423" />
      <rect x="4" y="6" width="8" height="1" fill="#A0724A" />
      <rect x="5" y="3" width="6" height="3" rx="1.5" fill="#7B5433" />
      <rect x="6" y="3" width="4" height="1" fill="#B08050" />
    </svg>
  )
}

// ============================================================================
// WC3 STYLE FOOD/SUPPLY ICON
// ============================================================================

function FoodIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      aria-label="Food Supply"
      role="img"
    >
      {/* Wheat/grain bundle */}
      <ellipse cx="8" cy="13" rx="5" ry="2" fill={WC3.dirtBrown} />
      <path d="M8,2 L8,13" stroke="#D4A017" strokeWidth="1" />
      <path d="M5,3 L5,12" stroke="#D4A017" strokeWidth="1" />
      <path d="M11,3 L11,12" stroke="#D4A017" strokeWidth="1" />
      <ellipse cx="8" cy="2" rx="1.5" ry="2" fill={WC3.goldYellow} />
      <ellipse cx="5" cy="3" rx="1" ry="1.5" fill={WC3.goldYellow} />
      <ellipse cx="11" cy="3" rx="1" ry="1.5" fill={WC3.goldYellow} />
    </svg>
  )
}

// ============================================================================
// WARCRAFT 3 FACTION ICON (Human Lion / Orc Crest / Night Elf / Undead)
// ============================================================================

function HumanCrest({ size = 48 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      aria-label="Human Alliance Crest"
      role="img"
    >
      {/* Shield background */}
      <path
        d="M24,2 L44,12 L44,28 Q44,42 24,46 Q4,42 4,28 L4,12 Z"
        fill={WC3.humanBlue}
        stroke={WC3.humanGold}
        strokeWidth="2"
      />
      {/* Inner shield detail */}
      <path
        d="M24,6 L40,14 L40,27 Q40,38 24,42 Q8,38 8,27 L8,14 Z"
        fill="none"
        stroke={WC3.humanGold}
        strokeWidth="1"
        opacity="0.5"
      />
      {/* Simplified lion silhouette */}
      <g fill={WC3.humanGold}>
        {/* Body */}
        <ellipse cx="24" cy="28" rx="10" ry="8" />
        {/* Head */}
        <circle cx="24" cy="18" r="6" />
        {/* Mane spikes */}
        <path d="M18,14 L16,10 L20,13 Z" />
        <path d="M30,14 L32,10 L28,13 Z" />
        <path d="M24,12 L24,8 L26,11 Z" />
        <path d="M24,12 L24,8 L22,11 Z" />
        {/* Crown */}
        <path d="M20,12 L21,8 L24,10 L27,8 L28,12 Z" />
      </g>
    </svg>
  )
}

function OrcCrest({ size = 48 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      aria-label="Orc Horde Crest"
      role="img"
    >
      {/* Angular horde shield */}
      <path
        d="M24,2 L42,14 L42,32 L24,46 L6,32 L6,14 Z"
        fill={WC3.orcBlack}
        stroke={WC3.orcRed}
        strokeWidth="2"
      />
      {/* Inner detail */}
      <path
        d="M24,8 L36,16 L36,30 L24,40 L12,30 L12,16 Z"
        fill="none"
        stroke={WC3.orcRed}
        strokeWidth="1"
        opacity="0.5"
      />
      {/* Stylized orc skull/emblem */}
      <g fill={WC3.orcRed}>
        {/* Central diamond */}
        <path d="M24,14 L32,24 L24,34 L16,24 Z" />
        {/* Tusks */}
        <path d="M18,20 L14,26 L18,24 Z" />
        <path d="M30,20 L34,26 L30,24 Z" />
        {/* Eye holes */}
        <circle cx="20" cy="22" r="2" fill={WC3.orcBlack} />
        <circle cx="28" cy="22" r="2" fill={WC3.orcBlack} />
      </g>
    </svg>
  )
}

function NightElfCrest({ size = 48 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      aria-label="Night Elf Crest"
      role="img"
    >
      {/* Curved elven shield */}
      <path
        d="M24,2 Q44,10 44,26 Q44,42 24,46 Q4,42 4,26 Q4,10 24,2 Z"
        fill={WC3.elfPurple}
        stroke={WC3.elfSilver}
        strokeWidth="2"
      />
      {/* Moon crescent */}
      <g fill={WC3.elfSilver}>
        <circle cx="24" cy="20" r="10" />
        <circle cx="28" cy="18" r="8" fill={WC3.elfPurple} />
      </g>
      {/* Owl eyes below moon */}
      <g fill={WC3.elfGreen}>
        <ellipse cx="18" cy="34" rx="3" ry="4" />
        <ellipse cx="30" cy="34" rx="3" ry="4" />
        <circle cx="18" cy="34" r="1" fill={WC3.elfPurple} />
        <circle cx="30" cy="34" r="1" fill={WC3.elfPurple} />
      </g>
    </svg>
  )
}

function UndeadCrest({ size = 48 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      aria-label="Undead Scourge Crest"
      role="img"
    >
      {/* Jagged undead shield */}
      <path
        d="M24,2 L38,8 L44,24 L38,40 L24,46 L10,40 L4,24 L10,8 Z"
        fill={WC3.undeadBlack}
        stroke={WC3.undeadGreen}
        strokeWidth="2"
      />
      {/* Skull */}
      <g fill={WC3.undeadBone}>
        <ellipse cx="24" cy="22" rx="10" ry="12" />
        {/* Eye sockets */}
        <ellipse cx="20" cy="20" rx="3" ry="4" fill={WC3.undeadGreen} />
        <ellipse cx="28" cy="20" rx="3" ry="4" fill={WC3.undeadGreen} />
        {/* Nose */}
        <path d="M24,24 L22,28 L26,28 Z" fill={WC3.undeadBlack} />
        {/* Teeth */}
        <rect x="18" y="30" width="12" height="4" fill={WC3.undeadBone} />
        <line x1="20" y1="30" x2="20" y2="34" stroke={WC3.undeadBlack} strokeWidth="1" />
        <line x1="22" y1="30" x2="22" y2="34" stroke={WC3.undeadBlack} strokeWidth="1" />
        <line x1="24" y1="30" x2="24" y2="34" stroke={WC3.undeadBlack} strokeWidth="1" />
        <line x1="26" y1="30" x2="26" y2="34" stroke={WC3.undeadBlack} strokeWidth="1" />
        <line x1="28" y1="30" x2="28" y2="34" stroke={WC3.undeadBlack} strokeWidth="1" />
      </g>
    </svg>
  )
}

// ============================================================================
// WC3 STYLE RESOURCE COUNTER (Gold: 1500 | Lumber: 800 | Food: 45/100)
// ============================================================================

function ResourceCounter({
  icon,
  value,
  label,
  maxValue,
}: {
  icon: React.ReactNode
  value: number
  label: string
  maxValue?: number
}) {
  return (
    <div
      className="flex items-center gap-1 px-2 py-1"
      style={{
        background: 'linear-gradient(180deg, #2A2318 0%, #1A1612 100%)',
        border: `1px solid ${WC3.panelBorder}`,
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.3)',
      }}
      role="status"
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

// ============================================================================
// WC3 STYLE HEALTH/MANA BAR (thick, segmented, classic RTS look)
// ============================================================================

function UnitBar({
  label,
  current,
  max,
  type = 'health',
}: {
  label: string
  current: number
  max: number
  type?: 'health' | 'mana' | 'experience'
}) {
  const percent = Math.min(100, (current / max) * 100)
  const segments = 10

  const colors = {
    health: percent > 50 ? WC3.healthGreen : percent > 25 ? WC3.healthYellow : WC3.healthRed,
    mana: WC3.manaBlue,
    experience: WC3.elfPurple,
  }

  return (
    <div
      className="flex items-center gap-2"
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label}
    >
      <span
        className="text-sm uppercase tracking-wider font-bold w-8 text-right"
        style={{ color: WC3.textGray }}
      >
        {label}
      </span>
      <div
        className="flex-1 h-4 relative flex gap-px overflow-hidden"
        style={{
          background: '#0A0A0A',
          border: `2px solid ${WC3.panelBorder}`,
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.8)',
        }}
      >
        {/* Segmented bar fill */}
        {[...Array(segments)].map((_, i) => {
          const segmentPercent = ((i + 1) / segments) * 100
          const isFilled = percent >= segmentPercent - (100 / segments / 2)
          return (
            <div
              key={i}
              className="flex-1"
              style={{
                background: isFilled ? colors[type] : 'transparent',
                boxShadow: isFilled ? `inset 0 1px 0 rgba(255,255,255,0.3)` : 'none',
              }}
            />
          )
        })}
        {/* Text overlay */}
        <span
          className="absolute inset-0 flex items-center justify-center text-sm font-bold"
          style={{ color: WC3.textWhite, textShadow: '0 1px 2px #000, 0 0 4px #000' }}
        >
          {current} / {max}
        </span>
      </div>
    </div>
  )
}

// ============================================================================
// WC3 STYLE UNIT PORTRAIT FRAME (square, beveled gold border)
// ============================================================================

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
    <div
      className="relative"
      style={{
        width: size,
        height: size,
      }}
    >
      {/* Outer beveled frame */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${WC3.humanGold} 0%, ${WC3.panelBronze} 50%, ${WC3.humanGold} 100%)`,
          padding: 3,
        }}
      >
        {/* Inner dark frame */}
        <div
          className="w-full h-full"
          style={{
            background: '#0A0A0A',
            border: selected ? `2px solid ${WC3.healthGreen}` : '2px solid #1A1A1A',
            boxShadow: selected ? `0 0 8px ${WC3.healthGreen}` : 'inset 0 2px 4px rgba(0,0,0,0.8)',
          }}
        >
          {/* Content */}
          <div className="w-full h-full flex items-center justify-center">
            {children}
          </div>
        </div>
      </div>
      {/* Corner bevels (classic WC3 look) */}
      <div
        className="absolute top-0 left-0 w-2 h-2"
        style={{
          background: `linear-gradient(135deg, ${WC3.humanGold} 0%, transparent 100%)`,
        }}
        aria-hidden="true"
      />
      <div
        className="absolute top-0 right-0 w-2 h-2"
        style={{
          background: `linear-gradient(-135deg, ${WC3.humanGold} 0%, transparent 100%)`,
        }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 w-2 h-2"
        style={{
          background: `linear-gradient(45deg, ${WC3.humanGold} 0%, transparent 100%)`,
        }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 right-0 w-2 h-2"
        style={{
          background: `linear-gradient(-45deg, ${WC3.humanGold} 0%, transparent 100%)`,
        }}
        aria-hidden="true"
      />
    </div>
  )
}

// ============================================================================
// WC3 STYLE ABILITY ICON (square, beveled, with cooldown overlay option)
// ============================================================================

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
    <div
      className="relative group"
      style={{ width: size, height: size }}
    >
      {/* Beveled border */}
      <div
        className="absolute inset-0"
        style={{
          background: learned
            ? `linear-gradient(135deg, ${WC3.humanGold} 0%, ${WC3.panelBronze} 100%)`
            : `linear-gradient(135deg, #4A4A4A 0%, #2A2A2A 100%)`,
          padding: 2,
        }}
      >
        {/* Inner content */}
        <div
          className={`w-full h-full flex items-center justify-center transition-all ${
            learned ? 'group-hover:brightness-125' : ''
          }`}
          style={{
            background: learned
              ? 'linear-gradient(180deg, #2A2318 0%, #1A1612 100%)'
              : '#1A1A1A',
            opacity: learned ? 1 : 0.5,
          }}
        >
          {children}
        </div>
      </div>
      {/* Hotkey indicator */}
      {hotkey && (
        <div
          className="absolute -bottom-1 -right-1 w-4 h-4 flex items-center justify-center text-sm font-bold"
          style={{
            background: WC3.panelDark,
            border: `1px solid ${WC3.panelBorder}`,
            color: WC3.textGold,
          }}
          aria-label={`Hotkey: ${hotkey}`}
        >
          {hotkey}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// WC3 STYLE COMMAND PANEL (like the bottom-right ability grid)
// ============================================================================

function CommandPanel({
  title,
  children,
  className = '',
}: {
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section
      className={`relative ${className}`}
      style={{
        background: 'linear-gradient(180deg, #1A1612 0%, #0F0C0A 100%)',
        border: `3px solid ${WC3.panelBorder}`,
        boxShadow: `
          inset 0 1px 0 rgba(255,215,0,0.2),
          inset 0 -1px 0 rgba(0,0,0,0.5),
          0 4px 12px rgba(0,0,0,0.5)
        `,
      }}
      aria-labelledby={`panel-${title.toLowerCase().replace(/\s/g, '-')}`}
    >
      {/* Gold corner accents */}
      {[
        'top-0 left-0 border-t-2 border-l-2',
        'top-0 right-0 border-t-2 border-r-2',
        'bottom-0 left-0 border-b-2 border-l-2',
        'bottom-0 right-0 border-b-2 border-r-2',
      ].map((pos, i) => (
        <div
          key={i}
          className={`absolute w-4 h-4 ${pos}`}
          style={{ borderColor: WC3.humanGold }}
          aria-hidden="true"
        />
      ))}

      {/* Title bar */}
      <div
        className="px-4 py-2"
        style={{
          background: 'linear-gradient(180deg, #2A2318 0%, #1A1612 100%)',
          borderBottom: `2px solid ${WC3.panelBorder}`,
        }}
      >
        <h2
          id={`panel-${title.toLowerCase().replace(/\s/g, '-')}`}
          className="text-sm tracking-wider uppercase font-bold text-center"
          style={{
            color: WC3.textGold,
            textShadow: '0 1px 2px #000',
            fontFamily: 'Georgia, "Times New Roman", serif',
          }}
        >
          {title}
        </h2>
      </div>

      {/* Content */}
      <div className="p-4">
        {children}
      </div>
    </section>
  )
}

// ============================================================================
// WC3 STYLE INFO PANEL (like unit/building info display)
// ============================================================================

function InfoPanel({
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
    orc: { primary: WC3.orcRed, accent: WC3.orcOrange },
    nightelf: { primary: WC3.elfPurple, accent: WC3.elfSilver },
    undead: { primary: WC3.undeadPurple, accent: WC3.undeadGreen },
  }

  const colors = factionColors[faction]

  return (
    <section
      className={`relative ${className}`}
      style={{
        background: `linear-gradient(180deg, ${WC3.panelDark} 0%, #0A0808 100%)`,
        border: `3px solid ${colors.accent}`,
        boxShadow: `
          inset 0 0 30px ${colors.primary}20,
          0 4px 16px rgba(0,0,0,0.6)
        `,
      }}
      aria-labelledby={`info-${title.toLowerCase().replace(/\s/g, '-')}`}
    >
      {/* Decorative rivets */}
      {['top-1 left-1', 'top-1 right-1', 'bottom-1 left-1', 'bottom-1 right-1'].map((pos, i) => (
        <div
          key={i}
          className={`absolute w-3 h-3 rounded-full ${pos}`}
          style={{
            background: `radial-gradient(circle at 30% 30%, ${colors.accent}, ${WC3.panelBronze})`,
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3)',
          }}
          aria-hidden="true"
        />
      ))}

      {/* Title banner */}
      <div
        className="relative px-4 py-2 mx-4 -mt-3"
        style={{
          background: `linear-gradient(180deg, #2A2318 0%, ${WC3.panelDark} 100%)`,
          border: `2px solid ${colors.accent}`,
          boxShadow: `0 0 10px ${colors.primary}40`,
        }}
      >
        <h2
          id={`info-${title.toLowerCase().replace(/\s/g, '-')}`}
          className="text-sm tracking-[0.15em] uppercase font-bold text-center"
          style={{
            color: colors.accent,
            textShadow: `0 0 8px ${colors.primary}60`,
            fontFamily: 'Georgia, "Times New Roman", serif',
          }}
        >
          {title}
        </h2>
      </div>

      {/* Content */}
      <div className="pt-4 pb-4 px-6">
        {children}
      </div>
    </section>
  )
}

// ============================================================================
// WC3 STYLE MINIMAP FRAME
// ============================================================================

function MinimapFrame({
  children,
  title,
}: {
  children: React.ReactNode
  title: string
}) {
  return (
    <div className="relative" aria-label={title}>
      {/* Gold frame */}
      <div
        className="p-1"
        style={{
          background: `linear-gradient(135deg, ${WC3.humanGold} 0%, ${WC3.panelBronze} 50%, ${WC3.humanGold} 100%)`,
        }}
      >
        {/* Dark inner */}
        <div
          className="p-1"
          style={{
            background: WC3.panelDark,
            border: `1px solid ${WC3.panelBorder}`,
          }}
        >
          {children}
        </div>
      </div>
      {/* Corner decorations */}
      <div
        className="absolute -top-1 -left-1 w-3 h-3"
        style={{
          background: `radial-gradient(circle, ${WC3.humanGold} 0%, ${WC3.panelBronze} 100%)`,
          borderRadius: '1px',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute -top-1 -right-1 w-3 h-3"
        style={{
          background: `radial-gradient(circle, ${WC3.humanGold} 0%, ${WC3.panelBronze} 100%)`,
          borderRadius: '1px',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-1 -left-1 w-3 h-3"
        style={{
          background: `radial-gradient(circle, ${WC3.humanGold} 0%, ${WC3.panelBronze} 100%)`,
          borderRadius: '1px',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-1 -right-1 w-3 h-3"
        style={{
          background: `radial-gradient(circle, ${WC3.humanGold} 0%, ${WC3.panelBronze} 100%)`,
          borderRadius: '1px',
        }}
        aria-hidden="true"
      />
    </div>
  )
}

// ============================================================================
// FACTION SELECTOR (like race selection in WC3)
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
      id: 'engineer',
      name: 'Human Alliance',
      desc: 'Arcane Architect',
      icon: <HumanCrest size={40} />,
      color: WC3.humanBlue,
      accent: WC3.humanGold,
    },
    {
      id: 'drummer',
      name: 'Night Elf Sentinels',
      desc: 'Keeper of Rhythm',
      icon: <NightElfCrest size={40} />,
      color: WC3.elfPurple,
      accent: WC3.elfSilver,
    },
    {
      id: 'fighter',
      name: 'Orc Horde',
      desc: 'Battle-Hardened',
      icon: <OrcCrest size={40} />,
      color: WC3.orcRed,
      accent: WC3.orcOrange,
    },
  ] as const

  return (
    <nav
      className="flex justify-center gap-4 md:gap-6 py-6"
      role="tablist"
      aria-label="Profession selection"
    >
      {factions.map((faction) => (
        <button
          key={faction.id}
          onClick={() => onSelect(faction.id)}
          role="tab"
          aria-selected={active === faction.id}
          aria-controls={`panel-${faction.id}`}
          className="relative group focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-transform hover:scale-105"
          style={{
            ['--ring-color' as string]: faction.accent,
          }}
        >
          <div
            className="w-28 md:w-36 h-32 md:h-40 flex flex-col items-center justify-center gap-2 p-3 transition-all"
            style={{
              background: active === faction.id
                ? `linear-gradient(180deg, ${faction.color}40 0%, ${WC3.panelDark} 100%)`
                : `linear-gradient(180deg, #1A1612 0%, #0A0808 100%)`,
              border: `3px solid ${active === faction.id ? faction.accent : WC3.panelBorder}`,
              boxShadow: active === faction.id
                ? `0 0 20px ${faction.color}50, inset 0 0 15px ${faction.color}30`
                : 'inset 0 2px 4px rgba(0,0,0,0.5)',
            }}
          >
            {/* Faction icon */}
            <div className="relative">
              {faction.icon}
              {active === faction.id && (
                <div
                  className="absolute inset-0 animate-pulse"
                  style={{ filter: `drop-shadow(0 0 6px ${faction.accent})` }}
                  aria-hidden="true"
                >
                  {faction.icon}
                </div>
              )}
            </div>

            {/* Faction name */}
            <span
              className="text-xs md:text-sm font-bold tracking-wider text-center leading-tight"
              style={{
                color: active === faction.id ? faction.accent : WC3.textGray,
                textShadow: active === faction.id ? `0 0 8px ${faction.color}` : 'none',
                fontFamily: 'Georgia, "Times New Roman", serif',
              }}
            >
              {faction.name}
            </span>

            {/* Description */}
            <span
              className="text-sm"
              style={{ color: WC3.textGray }}
            >
              {faction.desc}
            </span>
          </div>

          {/* Selection arrow */}
          {active === faction.id && (
            <div
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0"
              style={{
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderTop: `8px solid ${faction.accent}`,
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
// TECH STACK AS BUILD QUEUE (like building units in WC3)
// ============================================================================

function BuildQueue({ categories }: { categories: ReturnType<typeof getEngineerSkills> }) {
  return (
    <div className="space-y-6">
      {categories.slice(0, 6).map((category) => (
        <div key={category.name}>
          {/* Category header */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">{category.icon}</span>
            <h3
              className="text-sm tracking-wider uppercase font-bold"
              style={{
                color: WC3.textGold,
                textShadow: '0 1px 2px #000',
                fontFamily: 'Georgia, "Times New Roman", serif',
              }}
            >
              {category.name}
            </h3>
            <div
              className="flex-1 h-px"
              style={{
                background: `linear-gradient(90deg, ${WC3.panelBorder}, transparent)`,
              }}
              aria-hidden="true"
            />
          </div>

          {/* Tech items as ability icons */}
          <div className="flex flex-wrap gap-2">
            {category.items.map((tech) => (
              <AbilityIcon key={tech} learned={true} size={32}>
                <span
                  className="text-sm font-bold text-center leading-tight px-1"
                  style={{ color: WC3.textWhite }}
                >
                  {tech.substring(0, 3).toUpperCase()}
                </span>
              </AbilityIcon>
            ))}
          </div>

          {/* Full names list */}
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
            {category.items.map((tech) => (
              <span
                key={tech}
                className="text-xs"
                style={{ color: WC3.textGray }}
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

// ============================================================================
// SKILLS LIST (for drummer/fighter)
// ============================================================================

function SkillsList({ categories }: { categories: ReturnType<typeof getSkillsByProfession> }) {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {categories.map((category) => (
        <div key={category.name}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">{category.icon}</span>
            <h3
              className="text-sm tracking-wider uppercase font-bold"
              style={{
                color: WC3.textGold,
                fontFamily: 'Georgia, "Times New Roman", serif',
              }}
            >
              {category.name}
            </h3>
          </div>
          <ul className="space-y-2" role="list">
            {category.skills.map((skill) => (
              <li
                key={skill.name}
                className="flex items-center gap-2 text-sm"
                style={{ color: WC3.textWhite }}
              >
                <div
                  className="w-2 h-2 rotate-45"
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
// EXPERIENCE CARD (Campaign mission style)
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
        boxShadow: isCurrentRole ? `0 0 12px ${WC3.healthGreen}30` : 'none',
      }}
    >
      <div className="flex justify-between items-start mb-2 gap-2">
        <div className="flex items-start gap-2">
          <UnitPortrait size={32} selected={isCurrentRole}>
            <span className="text-xs" style={{ color: WC3.textGold }}>
              {entry.title.charAt(0)}
            </span>
          </UnitPortrait>
          <div>
            <h4 className="text-sm font-bold" style={{ color: WC3.textWhite }}>
              {entry.title}
            </h4>
            <p className="text-xs" style={{ color: WC3.textGold }}>
              {entry.organization}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <GoldIcon size={12} />
          <span className="text-sm" style={{ color: WC3.textGray }}>
            {startDisplay} - {endDisplay}
          </span>
        </div>
      </div>

      <p className="text-xs mb-3 ml-10" style={{ color: WC3.textGray }}>
        {entry.description}
      </p>

      {entry.highlights && entry.highlights.length > 0 && (
        <ul className="space-y-1 ml-10" role="list">
          {entry.highlights.map((highlight, i) => (
            <li
              key={i}
              className="text-xs flex items-start gap-2"
              style={{ color: WC3.textWhite }}
            >
              <span style={{ color: WC3.healthGreen }} aria-hidden="true">+</span>
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

// ============================================================================
// PROJECT CARD (Quest/Mission style)
// ============================================================================

function ProjectCard({ project }: { project: typeof PROJECTS_DATA[0] }) {
  return (
    <article
      className="p-4 transition-all hover:brightness-110 cursor-pointer group"
      style={{
        background: `linear-gradient(135deg, ${WC3.panelDark} 0%, #0A0808 100%)`,
        border: `2px solid ${project.featured ? WC3.goldYellow : WC3.panelBorder}`,
        boxShadow: project.featured ? `0 0 15px ${WC3.goldYellow}30` : 'none',
      }}
    >
      {project.featured && (
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: WC3.goldYellow }}
            aria-hidden="true"
          />
          <span
            className="text-sm tracking-wider font-bold"
            style={{ color: WC3.goldYellow }}
          >
            LEGENDARY QUEST
          </span>
        </div>
      )}

      <h4
        className="text-sm font-bold mb-1 group-hover:brightness-125 transition-all"
        style={{ color: project.featured ? WC3.goldYellow : WC3.humanBlue }}
      >
        {project.name}
      </h4>

      <p className="text-xs mb-3" style={{ color: WC3.textGray }}>
        {project.tagline}
      </p>

      {project.impact && (
        <p className="text-xs mb-3" style={{ color: WC3.healthGreen }}>
          <span aria-hidden="true">+</span> {project.impact}
        </p>
      )}

      <div className="flex flex-wrap gap-1">
        {project.techStack.slice(0, 4).map((tech) => (
          <span
            key={tech}
            className="text-[9px] px-2 py-0.5 font-bold"
            style={{
              background: `${WC3.humanBlue}30`,
              border: `1px solid ${WC3.humanBlue}60`,
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

// ============================================================================
// COMPANY CARD (Allied outpost style)
// ============================================================================

function CompanyCard({ company }: { company: typeof COMPANIES[0] }) {
  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 transition-all hover:brightness-110 group"
      style={{
        background: `linear-gradient(135deg, ${WC3.panelDark} 0%, #0A0808 100%)`,
        border: `2px solid ${WC3.panelBorder}`,
      }}
      aria-label={`${company.name} - ${company.tagline}`}
    >
      <div className="flex items-center gap-3 mb-3">
        <UnitPortrait size={40}>
          <span className="text-lg">{company.icon}</span>
        </UnitPortrait>
        <div>
          <h4
            className="text-sm font-bold group-hover:brightness-125 transition-colors"
            style={{ color: WC3.textWhite }}
          >
            {company.name}
          </h4>
          <p className="text-sm" style={{ color: WC3.textGold }}>
            {company.tagline}
          </p>
        </div>
      </div>
      <p className="text-xs" style={{ color: WC3.textGray }}>
        {company.description}
      </p>
    </a>
  )
}

// ============================================================================
// BAND CARD (Warband style)
// ============================================================================

function BandCard({ band }: { band: typeof BANDS[0] }) {
  const content = (
    <article
      className="p-4 transition-all hover:brightness-110 group"
      style={{
        background: `linear-gradient(135deg, ${WC3.panelDark} 0%, #0A0808 100%)`,
        border: `2px solid ${band.active ? WC3.orcRed : WC3.panelBorder}`,
        boxShadow: band.active ? `0 0 10px ${WC3.orcRed}30` : 'none',
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <OrcCrest size={24} />
        <div>
          <h4
            className="text-sm font-bold group-hover:brightness-125 transition-colors"
            style={{ color: WC3.textWhite }}
          >
            {band.name}
          </h4>
          <p className="text-sm" style={{ color: WC3.textGold }}>
            {band.genre} | {band.role}
          </p>
        </div>
      </div>
      <p className="text-xs" style={{ color: WC3.textGray }}>
        {band.description}
      </p>
      {band.active && (
        <div className="mt-2 flex items-center gap-1">
          <div
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: WC3.healthGreen, boxShadow: `0 0 6px ${WC3.healthGreen}` }}
            aria-hidden="true"
          />
          <span className="text-sm" style={{ color: WC3.healthGreen }}>Active</span>
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
// FOG OF WAR EFFECT (ambient background)
// ============================================================================

function FogOfWar() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[1] overflow-hidden"
      aria-hidden="true"
    >
      {/* Gradient fog */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 20% 20%, transparent 0%, ${WC3.fogBlack}80 70%),
            radial-gradient(ellipse at 80% 80%, transparent 0%, ${WC3.fogBlack}80 70%),
            radial-gradient(ellipse at 50% 50%, transparent 0%, ${WC3.fogBlack}40 100%)
          `,
        }}
      />
      {/* Subtle animated particles */}
      <style jsx>{`
        @keyframes fogDrift {
          0%, 100% { transform: translateX(0) translateY(0); }
          50% { transform: translateX(20px) translateY(-10px); }
        }
      `}</style>
    </div>
  )
}

// ============================================================================
// TERRAIN GRID (subtle isometric grid like WC3 terrain)
// ============================================================================

function TerrainGrid() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[0] opacity-[0.03]"
      aria-hidden="true"
      style={{
        backgroundImage: `
          linear-gradient(${WC3.grassGreen} 1px, transparent 1px),
          linear-gradient(90deg, ${WC3.grassGreen} 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
      }}
    />
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

  // Map profession to faction for styling
  const factionMap = {
    engineer: 'human' as const,
    drummer: 'nightelf' as const,
    fighter: 'orc' as const,
  }
  const currentFaction = factionMap[active]

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
        background: `linear-gradient(180deg, #0A0808 0%, #0F0C0A 50%, #0A0808 100%)`,
        fontFamily: 'Georgia, "Times New Roman", serif',
      }}
    >
      {/* Terrain grid background */}
      <TerrainGrid />

      {/* Fog of war effect */}
      {!prefersReducedMotion && <FogOfWar />}

      {/* Top resource bar (like WC3 top UI) */}
      <div
        className="fixed top-0 left-0 right-0 z-50 flex justify-center gap-4 py-2 px-4"
        style={{
          background: `linear-gradient(180deg, #1A1612 0%, #0F0C0A 100%)`,
          borderBottom: `2px solid ${WC3.panelBorder}`,
          boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
        }}
        role="status"
        aria-label="Character resources"
      >
        <ResourceCounter
          icon={<GoldIcon size={16} />}
          value={15000}
          label="Experience Points"
        />
        <ResourceCounter
          icon={<LumberIcon size={16} />}
          value={85}
          maxValue={100}
          label="Skill Level"
        />
        <ResourceCounter
          icon={<FoodIcon size={16} />}
          value={100}
          maxValue={100}
          label="Energy"
        />
      </div>

      {/* Header */}
      <header className="relative z-40 pt-16 p-4 md:p-6 md:pt-16">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-4">
          {/* Left: Portrait and Name */}
          <div className="flex items-start gap-4">
            {/* Unit portrait frame */}
            <UnitPortrait size={80} selected={true}>
              {active === 'engineer' && <HumanCrest size={60} />}
              {active === 'drummer' && <NightElfCrest size={60} />}
              {active === 'fighter' && <OrcCrest size={60} />}
            </UnitPortrait>

            <div>
              <h1
                className="text-2xl md:text-3xl font-bold tracking-wide"
                style={{
                  color: WC3.textGold,
                  textShadow: '2px 2px 0 #000, 0 0 10px rgba(255,215,0,0.3)',
                }}
              >
                ALEXANDER PULIDO
              </h1>
              <p className="text-sm md:text-base mt-1" style={{ color: WC3.textWhite }}>
                {PROFESSIONAL_SUMMARY.headline}
              </p>
              <p className="text-xs md:text-sm mt-1 italic" style={{ color: WC3.textGold }}>
                {PROFESSIONAL_SUMMARY.tagline}
              </p>

              {/* Unit bars */}
              <div className="mt-4 space-y-1 w-56 md:w-72">
                <UnitBar label="EXP" current={85} max={100} type="experience" />
                <UnitBar label="MANA" current={100} max={100} type="mana" />
              </div>
            </div>
          </div>

          {/* Right: Navigation buttons */}
          <div className="flex flex-wrap gap-2 md:gap-3 items-center">
            <Link
              href="/cv"
              className="px-4 py-2 text-xs md:text-sm font-bold tracking-wider transition-all hover:brightness-125 focus:outline-none focus-visible:ring-2"
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
              className="px-4 py-2 text-xs md:text-sm font-bold tracking-wider transition-all hover:brightness-125 focus:outline-none focus-visible:ring-2"
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

      {/* Current Roles */}
      <section className="relative z-30 py-4 px-4 md:px-6" aria-labelledby="current-roles-heading">
        <h2 id="current-roles-heading" className="sr-only">Current Roles</h2>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            {CURRENT_ROLES.map((role) => (
              <div key={role.id} className="text-center flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ background: WC3.healthGreen }}
                  aria-hidden="true"
                />
                <div>
                  <p className="text-xs md:text-sm font-bold" style={{ color: WC3.textGold }}>
                    {role.title}
                  </p>
                  <p className="text-sm md:text-base" style={{ color: WC3.textWhite }}>
                    {role.company}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Faction/Profession Selection */}
      <section className="relative z-30 py-4" aria-label="Select profession">
        <FactionSelector active={active} onSelect={setActive} />
      </section>

      {/* Main Content */}
      <main className="relative z-20 py-8 px-4 md:px-6 space-y-10">
        <div className="max-w-4xl mx-auto space-y-10">

          {/* About Section */}
          <InfoPanel title="Unit Information" faction={currentFaction}>
            <p className="text-sm leading-relaxed mb-4" style={{ color: WC3.textWhite }}>
              {aboutData.bio}
            </p>
            <div className="flex flex-wrap gap-2">
              {aboutData.quickFacts.map((fact, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-xs font-bold"
                  style={{
                    background: `${WC3.humanGold}15`,
                    border: `1px solid ${WC3.humanGold}60`,
                    color: WC3.textGold,
                  }}
                >
                  {fact}
                </span>
              ))}
            </div>
          </InfoPanel>

          {/* Work Experience */}
          {experience.length > 0 && (
            <InfoPanel title="Campaign History" faction={currentFaction}>
              <div className="space-y-4">
                {experience.map((entry) => (
                  <ExperienceCard key={entry.id} entry={entry} />
                ))}
              </div>
            </InfoPanel>
          )}

          {/* Tech Stack / Skills */}
          <CommandPanel
            title={active === 'engineer' ? 'Spell Book' : 'Abilities'}
          >
            {active === 'engineer' ? (
              <BuildQueue categories={engineerTech} />
            ) : (
              <SkillsList categories={otherSkills} />
            )}
          </CommandPanel>

          {/* Projects */}
          <InfoPanel title="Completed Quests" faction={currentFaction}>
            <div className="grid md:grid-cols-2 gap-4">
              {projects.filter(p => p.featured).slice(0, 6).map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </InfoPanel>

          {/* Companies (Engineer) / Bands (Drummer) */}
          {active === 'engineer' && (
            <InfoPanel title="Allied Outposts" faction="human">
              <div className="grid md:grid-cols-3 gap-4">
                {COMPANIES.map((company) => (
                  <CompanyCard key={company.id} company={company} />
                ))}
              </div>
            </InfoPanel>
          )}

          {active === 'drummer' && (
            <InfoPanel title="Warbands" faction="nightelf">
              <div className="grid md:grid-cols-3 gap-4">
                {BANDS.map((band) => (
                  <BandCard key={band.id} band={band} />
                ))}
              </div>
            </InfoPanel>
          )}
        </div>
      </main>

      {/* Footer styled as minimap area */}
      <footer className="relative z-20 py-12 px-4">
        <div className="max-w-md mx-auto">
          <MinimapFrame title="Location">
            <div
              className="w-full h-32 flex flex-col items-center justify-center gap-2"
              style={{
                background: `linear-gradient(135deg, ${WC3.grassGreen}40 0%, ${WC3.dirtBrown}40 50%, ${WC3.waterBlue}40 100%)`,
              }}
            >
              {/* Mini faction icons */}
              <div className="flex justify-center gap-4">
                <HumanCrest size={24} />
                <NightElfCrest size={24} />
                <OrcCrest size={24} />
                <UndeadCrest size={24} />
              </div>
              <p className="text-sm font-bold" style={{ color: WC3.textGold }}>
                AZEROTH
              </p>
              <p className="text-xs" style={{ color: WC3.textGray }}>
                Warcraft III: The Frozen Throne
              </p>
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
