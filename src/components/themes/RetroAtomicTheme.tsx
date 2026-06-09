'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useTheme } from '@/themes/ThemeContext'
import { useProfession } from '@/contexts/ProfessionContext'
import { ABOUT_DATA, PROFESSIONAL_SUMMARY } from '@/data/about'
import { PROJECTS_DATA } from '@/data/projects'
import { getEngineerSkills, getSkillsByProfession } from '@/data/skills'
import { CURRENT_ROLES } from '@/data/roles'
import { EXPERIENCE_DATA, filterExperienceByProfession } from '@/data/experience'
import { COMPANIES } from '@/data/companies'
import { BANDS } from '@/data/bands'
import WorldsGrid from '@/components/worlds/WorldsGrid'

// ============================================================================
// FALLOUT COLOR PALETTE - Authentic from Fallout 3/4/New Vegas
// ============================================================================

// PIP-BOY GREEN - The iconic terminal green
const PIPBOY_GREEN = '#14FF00'
const PIPBOY_GREEN_DIM = '#10CC00'
const PIPBOY_GREEN_DARK = '#0D9900'
const PIPBOY_GREEN_GLOW = 'rgba(20, 255, 0, 0.4)'
const PIPBOY_SCREEN_BG = '#001a00'

// VAULT-TEC CORPORATE
const VAULT_BLUE = '#0066CC'
const VAULT_BLUE_DARK = '#004499'
const VAULT_YELLOW = '#FFD700'
const VAULT_YELLOW_DIM = '#FFCC00'

// NUKA-COLA
const NUKA_RED = '#CC0000'
const NUKA_RED_DARK = '#990000'
const NUKA_GLOW = 'rgba(204, 0, 0, 0.5)'

// WASTELAND
const WASTELAND_BROWN = '#8B7355'
const WASTELAND_BROWN_MED = '#6B5344'
const WASTELAND_BROWN_DARK = '#4A3728'
const RUST_ORANGE = '#B7410E'
const RUST_DARK = '#8B3A0E'

// RADIATION / HAZARD
const IRRADIATED_GREEN = '#00FF00'
const IRRADIATED_GLOW = '#33FF33'
const TERMINAL_AMBER = '#FF9900'

// BACKGROUNDS
const TERMINAL_BG = '#0a0a08'
const PANEL_BG = '#0d0d0a'
const VAULT_BG = '#1a1a16'

// TEXT
const TERMINAL_TEXT = PIPBOY_GREEN
const FADED_TEXT = '#666655'

// ============================================================================
// CRT SCANLINE EFFECT
// ============================================================================

const crtScanlinesBg = `
  repeating-linear-gradient(
    0deg,
    transparent,
    transparent 1px,
    rgba(0, 0, 0, 0.15) 1px,
    rgba(0, 0, 0, 0.15) 2px
  )
`

// ============================================================================
// WASTELAND TEXTURES (Pure CSS)
// ============================================================================

const rustTexture = `
  linear-gradient(135deg, ${RUST_DARK}40 0%, transparent 50%),
  linear-gradient(225deg, ${WASTELAND_BROWN_DARK}30 0%, transparent 50%),
  repeating-linear-gradient(90deg, ${RUST_ORANGE}08 0px 2px, transparent 2px 4px),
  repeating-linear-gradient(0deg, ${RUST_DARK}10 0px 1px, transparent 1px 3px)
`

const pipboyScreenBg = `
  repeating-linear-gradient(0deg, ${PIPBOY_GREEN}03 0px 1px, transparent 1px 2px),
  repeating-linear-gradient(90deg, ${PIPBOY_GREEN}02 0px 1px, transparent 1px 3px),
  radial-gradient(ellipse at 50% 0%, ${PIPBOY_GREEN}12 0%, transparent 50%),
  radial-gradient(ellipse at 50% 100%, ${PIPBOY_SCREEN_BG} 0%, transparent 30%),
  linear-gradient(180deg, ${PIPBOY_SCREEN_BG}80 0%, ${TERMINAL_BG} 10%, ${TERMINAL_BG} 90%, ${PIPBOY_SCREEN_BG}80 100%)
`

const wornPaperBg = `
  repeating-linear-gradient(45deg, ${WASTELAND_BROWN}08 0px 1px, transparent 1px 6px),
  repeating-linear-gradient(-45deg, ${WASTELAND_BROWN_DARK}10 0px 1px, transparent 1px 8px),
  linear-gradient(180deg, ${WASTELAND_BROWN}12 0%, ${WASTELAND_BROWN_DARK}08 100%)
`

const hazardStripes = `
  repeating-linear-gradient(
    45deg,
    ${VAULT_YELLOW}20 0px 10px,
    ${TERMINAL_BG} 10px 20px
  )
`

// ============================================================================
// SVG ICONS - All Fallout-authentic
// ============================================================================

function RadiationSymbol({
  size = 24,
  color = VAULT_YELLOW,
  className = ''
}: {
  size?: number
  color?: string
  className?: string
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-hidden="true">
      <circle cx="50" cy="50" r="12" fill={color} />
      <path d="M50 10 A40 40 0 0 1 84.6 30 L60 45 A10 10 0 0 0 50 38 Z" fill={color} />
      <path d="M84.6 70 A40 40 0 0 1 15.4 70 L40 55 A10 10 0 0 0 60 55 Z" fill={color} />
      <path d="M15.4 30 A40 40 0 0 1 50 10 L50 38 A10 10 0 0 0 40 45 Z" fill={color} />
    </svg>
  )
}

function AtomSymbol({
  size = 24,
  color = PIPBOY_GREEN
}: {
  size?: number
  color?: string
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="6" fill={color} />
      <ellipse cx="50" cy="50" rx="42" ry="14" fill="none" stroke={color} strokeWidth="2" />
      <ellipse cx="50" cy="50" rx="42" ry="14" fill="none" stroke={color} strokeWidth="2" transform="rotate(60 50 50)" />
      <ellipse cx="50" cy="50" rx="42" ry="14" fill="none" stroke={color} strokeWidth="2" transform="rotate(120 50 50)" />
      {/* Electron dots */}
      <circle cx="92" cy="50" r="4" fill={color}>
        <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx="50" cy="92" r="4" fill={color}>
        <animateTransform attributeName="transform" type="rotate" from="60 50 50" to="420 50 50" dur="5s" repeatCount="indefinite" />
      </circle>
      <circle cx="8" cy="50" r="4" fill={color}>
        <animateTransform attributeName="transform" type="rotate" from="120 50 50" to="480 50 50" dur="6s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}

function BottleCap({
  size = 24,
  count
}: {
  size?: number
  count?: number
}) {
  return (
    <div className="flex items-center gap-2">
      <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
        {/* Cap base */}
        <circle cx="50" cy="50" r="45" fill={VAULT_YELLOW_DIM} />
        <circle cx="50" cy="50" r="40" fill={VAULT_YELLOW} />
        {/* Crimped edges */}
        {[...Array(20)].map((_, i) => (
          <path
            key={i}
            d={`M${50 + 38 * Math.cos((i * 18 * Math.PI) / 180)} ${50 + 38 * Math.sin((i * 18 * Math.PI) / 180)}
                L${50 + 45 * Math.cos((i * 18 * Math.PI) / 180)} ${50 + 45 * Math.sin((i * 18 * Math.PI) / 180)}`}
            stroke={WASTELAND_BROWN_DARK}
            strokeWidth="4"
            strokeLinecap="round"
          />
        ))}
        {/* Inner ring */}
        <circle cx="50" cy="50" r="30" fill="none" stroke={WASTELAND_BROWN_MED} strokeWidth="2" />
        {/* Nuka label */}
        <text x="50" y="52" textAnchor="middle" fill={NUKA_RED} fontSize="18" fontWeight="bold" fontFamily="monospace">
          N
        </text>
        <circle cx="50" cy="60" r="3" fill={NUKA_RED} />
      </svg>
      {count !== undefined && (
        <span
          className="font-mono font-bold text-sm"
          style={{ color: VAULT_YELLOW, textShadow: `0 0 6px ${VAULT_YELLOW}60` }}
        >
          {count.toLocaleString()}
        </span>
      )}
    </div>
  )
}

function VaultBoy({
  size = 80,
  expression = 'thumbsUp'
}: {
  size?: number
  expression?: 'thumbsUp' | 'pointing' | 'welcoming'
}) {
  // Vault Boy silhouette - iconic thumbs up pose
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      {/* Head */}
      <circle cx="50" cy="22" r="16" fill={VAULT_YELLOW} />
      {/* Simple face features */}
      <circle cx="44" cy="20" r="2" fill={VAULT_BLUE} />
      <circle cx="56" cy="20" r="2" fill={VAULT_BLUE} />
      <path d="M44 28 Q50 32 56 28" fill="none" stroke={VAULT_BLUE} strokeWidth="2" strokeLinecap="round" />
      {/* Hair swoop */}
      <path d="M35 16 Q40 6 55 14" fill="none" stroke={VAULT_YELLOW_DIM} strokeWidth="3" />
      {/* Body (vault suit) */}
      <path d="M38 36 L38 60 L62 60 L62 36 Q50 32 38 36" fill={VAULT_BLUE} />
      {/* Collar */}
      <path d="M44 36 L50 42 L56 36" fill="none" stroke={VAULT_YELLOW} strokeWidth="2" />
      {expression === 'thumbsUp' && (
        <>
          {/* Right arm - thumbs up */}
          <path d="M62 40 Q75 35 72 20" fill={VAULT_YELLOW} stroke={VAULT_YELLOW} strokeWidth="8" strokeLinecap="round" />
          {/* Thumb */}
          <path d="M72 20 L68 12" stroke={VAULT_YELLOW} strokeWidth="6" strokeLinecap="round" />
          {/* Left arm down */}
          <path d="M38 40 Q28 50 25 60" fill="none" stroke={VAULT_YELLOW} strokeWidth="6" strokeLinecap="round" />
        </>
      )}
      {expression === 'pointing' && (
        <>
          {/* Right arm pointing */}
          <path d="M62 40 Q80 38 90 35" fill="none" stroke={VAULT_YELLOW} strokeWidth="6" strokeLinecap="round" />
          {/* Left arm on hip */}
          <path d="M38 40 Q30 45 35 55" fill="none" stroke={VAULT_YELLOW} strokeWidth="6" strokeLinecap="round" />
        </>
      )}
      {expression === 'welcoming' && (
        <>
          {/* Both arms up */}
          <path d="M62 38 Q75 30 80 20" fill="none" stroke={VAULT_YELLOW} strokeWidth="6" strokeLinecap="round" />
          <path d="M38 38 Q25 30 20 20" fill="none" stroke={VAULT_YELLOW} strokeWidth="6" strokeLinecap="round" />
        </>
      )}
      {/* Legs */}
      <path d="M42 60 L40 85" stroke={VAULT_BLUE} strokeWidth="8" strokeLinecap="round" />
      <path d="M58 60 L60 85" stroke={VAULT_BLUE} strokeWidth="8" strokeLinecap="round" />
      {/* Boots */}
      <ellipse cx="40" cy="90" rx="8" ry="5" fill={WASTELAND_BROWN_DARK} />
      <ellipse cx="60" cy="90" rx="8" ry="5" fill={WASTELAND_BROWN_DARK} />
    </svg>
  )
}

function VaultDoor({ size = 100 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      {/* Outer frame */}
      <circle cx="50" cy="50" r="48" fill="none" stroke={WASTELAND_BROWN_MED} strokeWidth="4" />
      {/* Door */}
      <circle cx="50" cy="50" r="42" fill={VAULT_BLUE_DARK} />
      {/* Inner details */}
      <circle cx="50" cy="50" r="35" fill="none" stroke={`${VAULT_YELLOW}40`} strokeWidth="2" />
      <circle cx="50" cy="50" r="25" fill="none" stroke={`${VAULT_YELLOW}30`} strokeWidth="1" />
      {/* Vault number */}
      <text x="50" y="45" textAnchor="middle" fill={VAULT_YELLOW} fontSize="20" fontWeight="bold" fontFamily="monospace">
        101
      </text>
      <text x="50" y="62" textAnchor="middle" fill={`${VAULT_YELLOW}80`} fontSize="8" fontFamily="monospace">
        VAULT-TEC
      </text>
      {/* Handle */}
      <circle cx="75" cy="50" r="6" fill={RUST_ORANGE} stroke={WASTELAND_BROWN_DARK} strokeWidth="2" />
      <path d="M75 44 L75 56" stroke={WASTELAND_BROWN_DARK} strokeWidth="2" />
    </svg>
  )
}

function NukaColaBottle({ size = 60 }: { size?: number }) {
  return (
    <svg width={size * 0.4} height={size} viewBox="0 0 40 100" aria-hidden="true">
      {/* Cap */}
      <rect x="14" y="0" width="12" height="8" fill={NUKA_RED} />
      <rect x="12" y="6" width="16" height="4" fill={NUKA_RED_DARK} />
      {/* Neck */}
      <path d="M15 10 L15 25 Q12 28 12 35 L12 35 L28 35 Q28 28 25 25 L25 10 Z" fill={NUKA_RED} />
      {/* Body */}
      <path d="M10 35 Q8 40 8 50 L8 85 Q8 95 20 95 Q32 95 32 85 L32 50 Q32 40 30 35 Z" fill={NUKA_RED} />
      {/* Label */}
      <rect x="10" y="45" width="20" height="25" fill="#fff" opacity="0.9" />
      <text x="20" y="55" textAnchor="middle" fill={NUKA_RED} fontSize="6" fontWeight="bold" fontFamily="serif">
        NUKA
      </text>
      <text x="20" y="63" textAnchor="middle" fill={NUKA_RED} fontSize="5" fontWeight="bold" fontFamily="serif">
        COLA
      </text>
      {/* Highlight */}
      <path d="M12 40 Q14 60 12 80" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
    </svg>
  )
}

function WastelandSilhouette() {
  return (
    <svg className="w-full h-32" viewBox="0 0 1200 150" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      {/* Sky gradient */}
      <defs>
        <linearGradient id="wastelandSky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={TERMINAL_AMBER} stopOpacity="0.1" />
          <stop offset="50%" stopColor={RUST_ORANGE} stopOpacity="0.15" />
          <stop offset="100%" stopColor={WASTELAND_BROWN_DARK} stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <rect width="1200" height="150" fill="url(#wastelandSky)" />

      {/* Distant ruins */}
      <g fill={WASTELAND_BROWN_DARK} opacity="0.4">
        <rect x="100" y="90" width="40" height="60" />
        <rect x="115" y="70" width="20" height="80" />
        <rect x="300" y="80" width="60" height="70" />
        <polygon points="320,80 330,50 340,80" />
        <rect x="500" y="100" width="30" height="50" />
        <rect x="700" y="85" width="50" height="65" />
        <rect x="715" y="60" width="25" height="90" />
        <rect x="900" y="95" width="45" height="55" />
        <rect x="1050" y="90" width="35" height="60" />
      </g>

      {/* Ground line */}
      <path
        d="M0,145 Q200,140 400,145 T800,142 T1200,145 L1200,150 L0,150 Z"
        fill={WASTELAND_BROWN_DARK}
        opacity="0.5"
      />

      {/* Radiation symbols scattered */}
      <g opacity="0.1">
        <RadiationSymbol size={20} color={IRRADIATED_GREEN} />
        <g transform="translate(600, 60)">
          <RadiationSymbol size={15} color={IRRADIATED_GREEN} />
        </g>
        <g transform="translate(1000, 70)">
          <RadiationSymbol size={18} color={IRRADIATED_GREEN} />
        </g>
      </g>
    </svg>
  )
}

// ============================================================================
// PANEL COMPONENTS - Pip-Boy Frame, Terminal, Document, Rusted
// ============================================================================

function PipBoyFrame({
  children,
  title
}: {
  children: React.ReactNode
  title: string
}) {
  return (
    <section
      className="relative rounded-lg overflow-hidden"
      aria-label={title}
    >
      {/* Screen background with CRT effect */}
      <div
        className="absolute inset-0"
        style={{
          background: pipboyScreenBg,
          backgroundColor: TERMINAL_BG,
        }}
      />

      {/* Green glow border */}
      <div
        className="absolute inset-0 rounded-lg"
        style={{
          border: `3px solid ${PIPBOY_GREEN}`,
          boxShadow: `
            0 0 20px ${PIPBOY_GREEN_GLOW},
            inset 0 0 40px ${PIPBOY_SCREEN_BG},
            inset 0 0 80px ${PIPBOY_GREEN}10
          `,
        }}
      />

      {/* Corner brackets (Pip-Boy UI style) */}
      {[
        'top-2 left-2',
        'top-2 right-2 rotate-90',
        'bottom-2 left-2 -rotate-90',
        'bottom-2 right-2 rotate-180'
      ].map((pos, i) => (
        <div
          key={i}
          className={`absolute w-4 h-4 ${pos}`}
          style={{
            borderLeft: `2px solid ${PIPBOY_GREEN}`,
            borderTop: `2px solid ${PIPBOY_GREEN}`,
          }}
        />
      ))}

      {/* Title bar */}
      <div
        className="absolute -top-px left-6 px-4 py-1 flex items-center gap-2"
        style={{ background: TERMINAL_BG }}
      >
        <span className="font-mono text-xs" style={{ color: PIPBOY_GREEN_DIM }}>&gt;&gt;</span>
        <h2
          className="font-mono text-xs font-bold uppercase tracking-[0.3em]"
          style={{
            color: PIPBOY_GREEN,
            textShadow: `0 0 10px ${PIPBOY_GREEN_GLOW}`,
          }}
        >
          {title}
        </h2>
        <span className="font-mono text-xs" style={{ color: PIPBOY_GREEN_DIM }}>&lt;&lt;</span>
      </div>

      <div className="relative pt-8 pb-6 px-6">
        {children}
      </div>
    </section>
  )
}

function VaultTecPanel({
  children,
  title
}: {
  children: React.ReactNode
  title: string
}) {
  return (
    <section
      className="relative overflow-hidden"
      aria-label={title}
    >
      {/* Vault-Tec blue background */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${VAULT_BLUE_DARK} 0%, ${VAULT_BLUE} 50%, ${VAULT_BLUE_DARK} 100%)`,
        }}
      />

      {/* Yellow border */}
      <div
        className="absolute inset-0"
        style={{
          border: `3px solid ${VAULT_YELLOW}`,
          boxShadow: `inset 0 0 30px ${VAULT_BLUE_DARK}`,
        }}
      />

      {/* Header bar */}
      <div
        className="relative flex items-center justify-center gap-4 py-3 border-b-2"
        style={{
          background: `linear-gradient(90deg, ${VAULT_YELLOW}, ${VAULT_YELLOW_DIM}, ${VAULT_YELLOW})`,
          borderColor: VAULT_BLUE_DARK,
        }}
      >
        <VaultBoy size={30} expression="thumbsUp" />
        <h2
          className="font-mono text-sm font-bold uppercase tracking-[0.4em]"
          style={{ color: VAULT_BLUE_DARK }}
        >
          {title}
        </h2>
        <VaultBoy size={30} expression="thumbsUp" />
      </div>

      <div className="relative py-6 px-6">
        {children}
      </div>
    </section>
  )
}

function RustedPanel({
  children,
  title
}: {
  children: React.ReactNode
  title: string
}) {
  return (
    <section
      className="relative overflow-hidden"
      aria-label={title}
    >
      {/* Rusted metal texture */}
      <div
        className="absolute inset-0"
        style={{
          background: rustTexture,
          backgroundColor: PANEL_BG,
        }}
      />

      {/* Rust border with bolts */}
      <div
        className="absolute inset-0"
        style={{
          border: `3px solid ${RUST_ORANGE}`,
          boxShadow: `inset 0 0 25px ${RUST_DARK}60`,
        }}
      />

      {/* Corner bolts/rivets */}
      {['top-1 left-1', 'top-1 right-1', 'bottom-1 left-1', 'bottom-1 right-1'].map((pos, i) => (
        <div
          key={i}
          className={`absolute w-4 h-4 rounded-full ${pos}`}
          style={{
            background: `radial-gradient(circle at 35% 35%, ${WASTELAND_BROWN}, ${RUST_DARK})`,
            border: `2px solid ${RUST_DARK}`,
            boxShadow: `inset 1px 1px 2px ${VAULT_YELLOW}30`,
          }}
        />
      ))}

      {/* Title with hazard stripes */}
      <div
        className="absolute -top-3 left-8 px-4 py-1 flex items-center gap-2"
        style={{
          background: hazardStripes,
          backgroundColor: TERMINAL_BG,
          border: `2px solid ${VAULT_YELLOW}`,
        }}
      >
        <RadiationSymbol size={14} color={VAULT_YELLOW} />
        <h2
          className="font-mono text-xs font-bold uppercase tracking-[0.25em]"
          style={{
            color: VAULT_YELLOW,
            textShadow: `0 0 6px ${VAULT_YELLOW}60`,
          }}
        >
          {title}
        </h2>
      </div>

      <div className="relative pt-10 pb-6 px-6">
        {children}
      </div>
    </section>
  )
}

function WornDocumentPanel({
  children,
  title
}: {
  children: React.ReactNode
  title: string
}) {
  return (
    <section
      className="relative overflow-hidden"
      aria-label={title}
    >
      {/* Worn paper texture */}
      <div
        className="absolute inset-0"
        style={{
          background: wornPaperBg,
          backgroundColor: VAULT_BG,
        }}
      />

      {/* Aged border */}
      <div
        className="absolute inset-0"
        style={{
          border: `2px solid ${WASTELAND_BROWN_MED}`,
          boxShadow: `inset 0 0 30px ${WASTELAND_BROWN_DARK}40`,
        }}
      />

      {/* Stamped header */}
      <div className="relative px-6 pt-4 pb-2 border-b" style={{ borderColor: WASTELAND_BROWN_MED }}>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono px-2 py-1" style={{
            border: `1px solid ${NUKA_RED}`,
            color: NUKA_RED,
            transform: 'rotate(-3deg)',
          }}>
            CLASSIFIED
          </span>
          <h2
            className="font-mono text-sm font-bold uppercase tracking-wider"
            style={{ color: WASTELAND_BROWN }}
          >
            {title}
          </h2>
        </div>
      </div>

      <div className="relative py-4 px-6">
        {children}
      </div>
    </section>
  )
}

// ============================================================================
// ART SEPARATORS - Vault-Tec, Wasteland, Nuka-Cola
// ============================================================================

function VaultTecArt() {
  return (
    <div className="py-12 flex flex-col items-center gap-4">
      <div className="flex items-center gap-6">
        <div style={{ transform: 'scaleX(-1)' }}>
          <VaultBoy size={60} expression="pointing" />
        </div>
        <VaultDoor size={80} />
        <VaultBoy size={60} expression="pointing" />
      </div>
      <div
        className="font-mono text-xs tracking-[0.5em] uppercase"
        style={{ color: VAULT_YELLOW }}
      >
        Vault-Tec: Prepare for the Future
      </div>
      <div className="flex items-center gap-4">
        {[...Array(5)].map((_, i) => (
          <RadiationSymbol key={i} size={16} color={VAULT_YELLOW_DIM} />
        ))}
      </div>
    </div>
  )
}

function WastelandArt() {
  return (
    <div className="py-8">
      <WastelandSilhouette />
      <div className="flex justify-center items-center gap-6 -mt-8 relative z-10">
        <AtomSymbol size={40} color={IRRADIATED_GREEN} />
        <div className="text-center">
          <p
            className="font-mono text-sm font-bold"
            style={{
              color: TERMINAL_AMBER,
              textShadow: `0 0 10px ${TERMINAL_AMBER}60`,
            }}
          >
            CAUTION: IRRADIATED ZONE
          </p>
          <p
            className="font-mono text-xs mt-1"
            style={{ color: FADED_TEXT }}
          >
            Radiation Level: Moderate
          </p>
        </div>
        <AtomSymbol size={40} color={IRRADIATED_GREEN} />
      </div>
    </div>
  )
}

function NukaColaArt() {
  return (
    <div
      className="py-10 flex flex-col items-center gap-4"
      style={{
        background: `linear-gradient(180deg, transparent, ${NUKA_RED}08, transparent)`,
      }}
    >
      <div className="flex items-center gap-8">
        <NukaColaBottle size={70} />
        <div className="text-center">
          <p
            className="font-serif text-2xl font-bold italic"
            style={{
              color: NUKA_RED,
              textShadow: `0 0 15px ${NUKA_GLOW}, 2px 2px 0 ${NUKA_RED_DARK}`,
            }}
          >
            Nuka-Cola
          </p>
          <p
            className="font-serif text-xs mt-1"
            style={{ color: VAULT_YELLOW }}
          >
            Take the taste of Nuka-Cola with you!
          </p>
        </div>
        <NukaColaBottle size={70} />
      </div>
      <div className="flex items-center gap-3">
        {[...Array(7)].map((_, i) => (
          <BottleCap key={i} size={18} />
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// SECTION COMPONENTS
// ============================================================================

function ProfessionSelector({
  active,
  onSelect,
}: {
  active: 'engineer' | 'drummer' | 'fighter'
  onSelect: (p: 'engineer' | 'drummer' | 'fighter') => void
}) {
  const professions = [
    { id: 'engineer', label: 'ENGINEER', stat: 'INT', special: 10 },
    { id: 'drummer', label: 'MUSICIAN', stat: 'AGL', special: 8 },
    { id: 'fighter', label: 'FIGHTER', stat: 'STR', special: 7 },
  ] as const

  return (
    <div className="flex justify-center gap-3 md:gap-6" role="tablist">
      {professions.map((prof) => {
        const isActive = active === prof.id
        return (
          <button
            key={prof.id}
            onClick={() => onSelect(prof.id)}
            role="tab"
            aria-selected={isActive}
            className="relative px-4 md:px-6 py-3 font-mono focus:outline-none focus-visible:ring-2 transition-all"
            style={{
              background: isActive
                ? `linear-gradient(180deg, ${PIPBOY_GREEN}20, ${PIPBOY_GREEN}05)`
                : 'transparent',
              border: `2px solid ${isActive ? PIPBOY_GREEN : PIPBOY_GREEN_DIM}`,
              boxShadow: isActive
                ? `0 0 20px ${PIPBOY_GREEN_GLOW}, inset 0 0 20px ${PIPBOY_GREEN}10`
                : 'none',
            }}
          >
            {/* S.P.E.C.I.A.L. style stat indicator */}
            <div
              className="text-xs mb-1"
              style={{ color: isActive ? VAULT_YELLOW : FADED_TEXT }}
            >
              [{prof.stat}] {prof.special}/10
            </div>
            <div
              className="text-sm font-bold tracking-wider"
              style={{
                color: isActive ? PIPBOY_GREEN : PIPBOY_GREEN_DIM,
                textShadow: isActive ? `0 0 8px ${PIPBOY_GREEN_GLOW}` : 'none',
              }}
            >
              {isActive && '> '}{prof.label}
            </div>
            {/* S.P.E.C.I.A.L. bar */}
            <div className="flex gap-0.5 mt-2 justify-center">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-3"
                  style={{
                    background: i < prof.special
                      ? (isActive ? PIPBOY_GREEN : PIPBOY_GREEN_DIM)
                      : `${FADED_TEXT}30`,
                    boxShadow: i < prof.special && isActive ? `0 0 4px ${PIPBOY_GREEN}` : 'none',
                  }}
                />
              ))}
            </div>
          </button>
        )
      })}
    </div>
  )
}

function RolesDisplay() {
  return (
    <div className="flex flex-wrap justify-center gap-4 md:gap-6">
      {CURRENT_ROLES.map((role) => (
        <div
          key={role.id}
          className="px-4 py-2 font-mono"
          style={{
            background: role.type === 'leadership'
              ? `linear-gradient(180deg, ${VAULT_YELLOW}15, transparent)`
              : `${PIPBOY_GREEN}08`,
            border: `1px solid ${role.type === 'leadership' ? VAULT_YELLOW : PIPBOY_GREEN}50`,
          }}
        >
          <p
            className="text-xs font-bold tracking-wider"
            style={{ color: role.type === 'leadership' ? VAULT_YELLOW : PIPBOY_GREEN }}
          >
            {role.title}
          </p>
          <p
            className="text-sm"
            style={{ color: TERMINAL_TEXT }}
          >
            {role.company}
          </p>
        </div>
      ))}
    </div>
  )
}

function AchievementsTerminal({ profession }: { profession: 'engineer' | 'drummer' | 'fighter' }) {
  const achievements = {
    engineer: [
      { label: '10+ Years Full-Stack Development', cat: 'EXP' },
      { label: 'Elixir/Phoenix Architecture Expert', cat: 'TECH' },
      { label: 'Kubernetes Infrastructure Lead', cat: 'OPS' },
      { label: 'Multiple Production Systems', cat: 'IMPACT' },
      { label: 'CTO of Two Startups', cat: 'LEAD' },
      { label: 'Real-time WebSocket Systems', cat: 'SPEC' },
    ],
    drummer: [
      { label: '15 Years Behind the Kit', cat: 'EXP' },
      { label: '7 Years Professional', cat: 'PRO' },
      { label: 'Multiple Studio Albums', cat: 'RECORD' },
      { label: 'Regional Touring', cat: 'LIVE' },
      { label: 'Technical Metal Specialist', cat: 'GENRE' },
      { label: '3 Active Bands', cat: 'ACTIVE' },
    ],
    fighter: [
      { label: 'Muay Thai (3 Years)', cat: 'STRIKE' },
      { label: 'Brazilian Jiu-Jitsu (2 Years)', cat: 'GROUND' },
      { label: 'MMA Combined Training', cat: 'MIXED' },
      { label: 'Currently Instructing', cat: 'TEACH' },
      { label: 'Competition Prep Coach', cat: 'COACH' },
      { label: 'Mental Discipline Focus', cat: 'MIND' },
    ],
  }

  return (
    <div className="grid md:grid-cols-2 gap-3 font-mono">
      {achievements[profession].map((ach, i) => (
        <div
          key={i}
          className="flex items-center gap-3 p-2"
          style={{
            background: `${PIPBOY_GREEN}08`,
            border: `1px solid ${PIPBOY_GREEN}30`,
          }}
        >
          <span
            className="text-xs px-2 py-0.5 shrink-0"
            style={{
              background: TERMINAL_BG,
              border: `1px solid ${VAULT_YELLOW}60`,
              color: VAULT_YELLOW,
            }}
          >
            {ach.cat}
          </span>
          <span
            className="text-sm"
            style={{ color: PIPBOY_GREEN }}
          >
            {ach.label}
          </span>
        </div>
      ))}
    </div>
  )
}

function TechStackTerminal({ categories }: { categories: ReturnType<typeof getEngineerSkills> }) {
  return (
    <div className="space-y-6 font-mono">
      {categories.slice(0, 6).map((cat, idx) => (
        <div key={cat.name}>
          <h3
            className="text-xs tracking-wider mb-3 flex items-center gap-2"
            style={{ color: PIPBOY_GREEN }}
          >
            <span style={{ color: VAULT_YELLOW }}>[{String(idx + 1).padStart(2, '0')}]</span>
            <span>{cat.icon}</span>
            {cat.name.toUpperCase()}
          </h3>
          <div className="flex flex-wrap gap-2">
            {cat.items.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 text-xs font-bold"
                style={{
                  background: TERMINAL_BG,
                  border: `1px solid ${PIPBOY_GREEN}`,
                  color: PIPBOY_GREEN,
                  textShadow: `0 0 4px ${PIPBOY_GREEN}40`,
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

function SkillsTerminal({ categories }: { categories: ReturnType<typeof getSkillsByProfession> }) {
  return (
    <div className="grid md:grid-cols-3 gap-6 font-mono">
      {categories.map((cat, idx) => (
        <div key={cat.name}>
          <h3
            className="text-xs tracking-wider mb-3 flex items-center gap-2"
            style={{ color: PIPBOY_GREEN }}
          >
            <span style={{ color: VAULT_YELLOW }}>[{String(idx + 1).padStart(2, '0')}]</span>
            <span>{cat.icon}</span>
            {cat.name.toUpperCase()}
          </h3>
          <ul className="space-y-2">
            {cat.skills.map((skill) => (
              <li
                key={skill.name}
                className="text-sm flex items-center gap-2"
                style={{ color: TERMINAL_TEXT }}
              >
                <span style={{ color: PIPBOY_GREEN_DIM }}>&gt;</span>
                {skill.name}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

function ExperienceCard({ entry }: { entry: typeof EXPERIENCE_DATA[0] }) {
  const startYear = new Date(entry.startDate).getFullYear()
  const endYear = entry.endDate ? new Date(entry.endDate).getFullYear() : 'PRESENT'
  const isActive = !entry.endDate

  return (
    <article
      className="relative p-4 font-mono"
      style={{
        background: wornPaperBg,
        backgroundColor: TERMINAL_BG,
        border: `1px solid ${isActive ? PIPBOY_GREEN : FADED_TEXT}40`,
      }}
    >
      {/* Status stamp */}
      <div
        className="absolute top-2 right-2 px-2 py-0.5 text-xs font-bold"
        style={{
          border: `1px solid ${isActive ? PIPBOY_GREEN : FADED_TEXT}`,
          color: isActive ? PIPBOY_GREEN : FADED_TEXT,
          transform: 'rotate(-3deg)',
        }}
      >
        {isActive ? 'ACTIVE DUTY' : 'ARCHIVED'}
      </div>

      <div className="pr-24 mb-2">
        <h4
          className="text-sm font-bold uppercase tracking-wide"
          style={{ color: PIPBOY_GREEN }}
        >
          {entry.title}
        </h4>
        <p className="text-xs mt-1" style={{ color: VAULT_YELLOW }}>{entry.organization}</p>
      </div>

      <div
        className="inline-block px-2 py-1 text-xs mb-3"
        style={{
          background: `${VAULT_BLUE}30`,
          border: `1px solid ${VAULT_BLUE}`,
          color: VAULT_YELLOW,
        }}
      >
        {startYear} - {endYear}
      </div>

      <p className="text-xs mb-3" style={{ color: FADED_TEXT }}>{entry.description}</p>

      {entry.highlights && entry.highlights.length > 0 && (
        <ul className="space-y-1 border-t pt-2" style={{ borderColor: `${PIPBOY_GREEN}30` }}>
          {entry.highlights.map((h, i) => (
            <li key={i} className="text-xs flex items-start gap-2" style={{ color: TERMINAL_TEXT }}>
              <span style={{ color: TERMINAL_AMBER }}>+</span>
              {h}
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

function ProjectCard({ project }: { project: typeof PROJECTS_DATA[0] }) {
  const isFeatured = project.featured

  return (
    <article
      className="relative p-4 font-mono"
      style={{
        background: isFeatured ? rustTexture : pipboyScreenBg,
        backgroundColor: isFeatured ? `${VAULT_BLUE}10` : TERMINAL_BG,
        border: `2px solid ${isFeatured ? VAULT_YELLOW : PIPBOY_GREEN}50`,
        boxShadow: isFeatured ? `0 0 15px ${VAULT_YELLOW}15` : 'none',
      }}
    >
      {isFeatured && (
        <div
          className="absolute -top-2 -right-2 flex items-center gap-1 px-2 py-0.5"
          style={{
            background: hazardStripes,
            backgroundColor: TERMINAL_BG,
            border: `1px solid ${VAULT_YELLOW}`,
          }}
        >
          <BottleCap size={14} />
          <span className="text-[9px] tracking-wider font-bold" style={{ color: VAULT_YELLOW }}>
            PRIORITY
          </span>
        </div>
      )}

      <h4
        className="text-sm font-bold uppercase tracking-wide"
        style={{ color: PIPBOY_GREEN }}
      >
        {project.name}
      </h4>
      <p className="text-xs mt-1" style={{ color: FADED_TEXT }}>{project.tagline}</p>

      {project.impact && (
        <p
          className="text-xs mt-3 p-2 flex items-start gap-2"
          style={{
            background: `${TERMINAL_AMBER}10`,
            border: `1px solid ${TERMINAL_AMBER}40`,
            color: TERMINAL_AMBER,
          }}
        >
          <RadiationSymbol size={12} color={TERMINAL_AMBER} />
          {project.impact}
        </p>
      )}

      <div className="flex flex-wrap gap-1 mt-3">
        {project.techStack.slice(0, 5).map((tech) => (
          <span
            key={tech}
            className="text-[9px] px-1.5 py-0.5 font-bold"
            style={{
              background: `${PIPBOY_GREEN}15`,
              border: `1px solid ${PIPBOY_GREEN}40`,
              color: PIPBOY_GREEN_DIM,
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
      className="block p-4 font-mono transition-all hover:scale-[1.02]"
      style={{
        background: pipboyScreenBg,
        backgroundColor: TERMINAL_BG,
        border: `1px solid ${VAULT_BLUE}`,
      }}
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{company.icon}</span>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wide" style={{ color: PIPBOY_GREEN }}>
            {company.name}
          </h4>
          <p className="text-xs" style={{ color: VAULT_YELLOW }}>{company.tagline}</p>
        </div>
      </div>
      <p className="text-xs" style={{ color: FADED_TEXT }}>{company.description}</p>
      <div className="mt-2 text-xs" style={{ color: PIPBOY_GREEN_DIM }}>
        [ACCESS TERMINAL &gt;]
      </div>
    </a>
  )
}

function BandCard({ band }: { band: typeof BANDS[0] }) {
  const content = (
    <article
      className="p-4 font-mono"
      style={{
        background: rustTexture,
        backgroundColor: TERMINAL_BG,
        border: `1px solid ${NUKA_RED}50`,
      }}
    >
      <h4 className="text-sm font-bold uppercase tracking-wide" style={{ color: NUKA_RED }}>
        {band.name}
      </h4>
      <p className="text-xs mt-1" style={{ color: VAULT_YELLOW }}>
        {band.genre} // {band.role}
      </p>
      <p className="text-xs mt-2" style={{ color: FADED_TEXT }}>{band.description}</p>
      {band.active && (
        <div className="mt-2 text-xs flex items-center gap-2" style={{ color: PIPBOY_GREEN }}>
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: PIPBOY_GREEN, boxShadow: `0 0 6px ${PIPBOY_GREEN}` }}
          />
          BROADCASTING
        </div>
      )}
    </article>
  )

  if (band.url) {
    return (
      <a href={band.url} target="_blank" rel="noopener noreferrer" className="block transition-all hover:scale-[1.02]">
        {content}
      </a>
    )
  }
  return content
}

// ============================================================================
// MAIN THEME COMPONENT
// ============================================================================

export default function RetroAtomicTheme() {
  useTheme()
  const { active, setActive } = useProfession()
  const [mounted, setMounted] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  const aboutData = ABOUT_DATA[active]
  const engineerTech = getEngineerSkills()
  const otherSkills = getSkillsByProfession(active)
  const projects = PROJECTS_DATA.filter(p => p.professions.includes(active) || p.featured)
  const experience = filterExperienceByProfession(EXPERIENCE_DATA, active)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div
      className="min-h-screen relative"
      style={{
        background: TERMINAL_BG,
        fontFamily: 'monospace',
      }}
    >
      {/* CRT Scanlines overlay */}
      {!reducedMotion && (
        <div
          className="fixed inset-0 pointer-events-none z-[100]"
          style={{
            background: crtScanlinesBg,
            opacity: 0.3,
          }}
          aria-hidden="true"
        />
      )}

      {/* Subtle radiation symbols in background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${10 + i * 16}%`,
              top: `${15 + (i % 3) * 25}%`,
              opacity: 0.04,
            }}
          >
            <RadiationSymbol size={60 + i * 10} color={PIPBOY_GREEN} />
          </div>
        ))}
      </div>

      {/* ================================================================ */}
      {/* HEADER */}
      {/* ================================================================ */}
      <header className="relative z-30 p-4 md:p-6" role="banner">
        <div className="max-w-6xl mx-auto">
          {/* Top row */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
            <div>
              {/* Vault-Tec header */}
              <div
                className="flex items-center gap-4 pb-3 mb-3"
                style={{ borderBottom: `2px solid ${VAULT_YELLOW}` }}
              >
                <RadiationSymbol size={36} color={VAULT_YELLOW} />
                <div>
                  <h1
                    className="text-xl md:text-3xl font-bold tracking-wider uppercase"
                    style={{
                      color: PIPBOY_GREEN,
                      textShadow: `0 0 20px ${PIPBOY_GREEN_GLOW}, 0 0 40px ${PIPBOY_GREEN}30`,
                    }}
                  >
                    ALEXANDER PULIDO
                  </h1>
                  <p className="text-xs tracking-widest" style={{ color: VAULT_YELLOW }}>
                    VAULT-TEC PERSONNEL FILE // CLEARANCE: ALPHA
                  </p>
                </div>
              </div>
              <p className="text-sm max-w-xl" style={{ color: TERMINAL_TEXT }}>
                {PROFESSIONAL_SUMMARY.headline}
              </p>
              <p className="text-xs mt-1 italic" style={{ color: TERMINAL_AMBER }}>
                &quot;{PROFESSIONAL_SUMMARY.tagline}&quot;
              </p>
            </div>

            <div className="flex flex-col items-end gap-3">
              <BottleCap size={24} count={2077} />
              <div className="flex gap-2 flex-wrap justify-end">
                <Link
                  href="/cv"
                  className="px-3 py-2 text-xs font-bold tracking-wider font-mono"
                  style={{
                    background: TERMINAL_BG,
                    border: `2px solid ${VAULT_BLUE}`,
                    color: VAULT_YELLOW,
                  }}
                >
                  [F] FULL CV
                </Link>
                <Link
                  href="/personal-projects/game-engine"
                  className="px-3 py-2 text-xs font-bold tracking-wider font-mono"
                  style={{
                    background: TERMINAL_BG,
                    border: `2px solid ${PIPBOY_GREEN}`,
                    color: PIPBOY_GREEN,
                  }}
                >
                  [N] NEBULITH
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ================================================================ */}
      {/* CURRENT ROLES */}
      {/* ================================================================ */}
      <section className="relative z-20 py-4 px-4 md:px-6" aria-label="Current roles">
        <div className="max-w-6xl mx-auto">
          <RolesDisplay />
        </div>
      </section>

      {/* ================================================================ */}
      {/* PROFESSION SELECTOR */}
      {/* ================================================================ */}
      <section className="relative z-20 py-4 px-4">
        <ProfessionSelector active={active} onSelect={setActive} />
      </section>

      {/* ================================================================ */}
      {/* ABOUT */}
      {/* ================================================================ */}
      <section className="relative z-20 py-6 px-4 md:px-6" aria-label="About">
        <div className="max-w-4xl mx-auto">
          <WornDocumentPanel title="About">
            <p className="text-sm leading-relaxed mb-4 font-mono" style={{ color: TERMINAL_TEXT }}>
              {aboutData.bio}
            </p>
            <div className="flex flex-wrap gap-2">
              {aboutData.quickFacts.map((fact, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-xs font-bold font-mono"
                  style={{
                    background: `${VAULT_YELLOW}15`,
                    border: `1px solid ${VAULT_YELLOW}50`,
                    color: VAULT_YELLOW,
                  }}
                >
                  {fact}
                </span>
              ))}
            </div>
          </WornDocumentPanel>
        </div>
      </section>

      {/* ================================================================ */}
      {/* ART: VAULT-TEC */}
      {/* ================================================================ */}
      <VaultTecArt />

      {/* ================================================================ */}
      {/* EXPERIENCE */}
      {/* ================================================================ */}
      {experience.length > 0 && (
        <section className="relative z-20 py-6 px-4 md:px-6" aria-label="Experience">
          <div className="max-w-4xl mx-auto">
            <RustedPanel title="Work Experience">
              <div className="space-y-4">
                {experience.map((entry) => (
                  <ExperienceCard key={entry.id} entry={entry} />
                ))}
              </div>
            </RustedPanel>
          </div>
        </section>
      )}

      {/* ================================================================ */}
      {/* ART: WASTELAND */}
      {/* ================================================================ */}
      <WastelandArt />

      {/* ================================================================ */}
      {/* SKILLS / TECH STACK */}
      {/* ================================================================ */}
      <section className="relative z-20 py-6 px-4 md:px-6" aria-label="Skills">
        <div className="max-w-4xl mx-auto">
          <PipBoyFrame title={active === 'engineer' ? 'Tech Stack' : 'Skills'}>
            {active === 'engineer' ? (
              <TechStackTerminal categories={engineerTech} />
            ) : (
              <SkillsTerminal categories={otherSkills} />
            )}
          </PipBoyFrame>
        </div>
      </section>

      {/* ================================================================ */}
      {/* PROJECTS */}
      {/* ================================================================ */}
      <section className="relative z-20 py-6 px-4 md:px-6" aria-label="Projects">
        <div className="max-w-4xl mx-auto">
          <RustedPanel title="Projects">
            <div className="grid md:grid-cols-2 gap-4">
              {projects.filter(p => p.featured).slice(0, 6).map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </RustedPanel>
        </div>
      </section>

      {/* ================================================================ */}
      {/* ART: NUKA-COLA */}
      {/* ================================================================ */}
      <NukaColaArt />

      {/* ================================================================ */}
      {/* VENTURES / COMPANIES (Engineer) */}
      {/* ================================================================ */}
      {active === 'engineer' && (
        <section className="relative z-20 py-6 px-4 md:px-6" aria-label="Ventures">
          <div className="max-w-4xl mx-auto">
            <VaultTecPanel title="Ventures">
              <div className="grid md:grid-cols-3 gap-4">
                {COMPANIES.map((company) => (
                  <CompanyCard key={company.id} company={company} />
                ))}
              </div>
            </VaultTecPanel>
          </div>
        </section>
      )}

      {/* ================================================================ */}
      {/* BANDS (Drummer) */}
      {/* ================================================================ */}
      {active === 'drummer' && (
        <section className="relative z-20 py-6 px-4 md:px-6" aria-label="Bands">
          <div className="max-w-4xl mx-auto">
            <RustedPanel title="Bands">
              <div className="grid md:grid-cols-3 gap-4">
                {BANDS.map((band) => (
                  <BandCard key={band.id} band={band} />
                ))}
              </div>
            </RustedPanel>
          </div>
        </section>
      )}

      {/* ================================================================ */}
      {/* ACHIEVEMENTS */}
      {/* ================================================================ */}
      <section className="relative z-20 py-6 px-4 md:px-6" aria-label="Achievements">
        <div className="max-w-4xl mx-auto">
          <PipBoyFrame title="Achievements">
            <AchievementsTerminal profession={active} />
          </PipBoyFrame>
        </div>
      </section>

      {/* ================================================================ */}
      {/* CONTACT CTA */}
      {/* ================================================================ */}
      <section className="relative z-20 py-12 px-4 md:px-6" aria-label="Contact">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-6">
            <h2
              className="text-lg font-bold tracking-widest uppercase font-mono mb-2"
              style={{ color: VAULT_YELLOW }}
            >
              [ INITIATE CONTACT PROTOCOL ]
            </h2>
            <p className="text-sm font-mono" style={{ color: TERMINAL_TEXT }}>
              10+ years delivering production systems. Let&apos;s build something.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:alexanderpulido81@gmail.com"
              className="inline-flex items-center justify-center px-6 py-3 text-sm tracking-widest uppercase font-mono transition-all hover:scale-105 min-h-[44px] focus:outline-none focus-visible:ring-2"
              style={{
                background: PIPBOY_GREEN,
                color: '#0a0a08',
                boxShadow: `0 0 15px ${PIPBOY_GREEN}40`,
              }}
            >
              SEND TRANSMISSION
            </a>
            <Link
              href="/cv"
              className="inline-flex items-center justify-center px-6 py-3 text-sm tracking-widest uppercase font-mono transition-all hover:scale-105 min-h-[44px] focus:outline-none focus-visible:ring-2"
              style={{
                background: 'transparent',
                border: `2px solid ${VAULT_YELLOW}`,
                color: VAULT_YELLOW,
              }}
            >
              DOWNLOAD DOSSIER
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* ENTER ANOTHER WORLD */}
      {/* ================================================================ */}
      <section className="relative z-20 py-10 md:py-14 px-4 md:px-6" aria-labelledby="worlds-heading">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2
              id="worlds-heading"
              className="font-mono text-xl md:text-2xl font-bold uppercase tracking-[0.3em] mb-3"
              style={{
                color: PIPBOY_GREEN,
                textShadow: `0 0 20px ${PIPBOY_GREEN_GLOW}, 0 0 40px ${PIPBOY_GREEN}30`,
              }}
            >
              Enter Another World
            </h2>
            <div className="inline-flex items-center gap-3 mb-3" aria-hidden="true">
              <div className="w-10 h-px" style={{ background: VAULT_YELLOW }} />
              <RadiationSymbol size={16} color={VAULT_YELLOW} />
              <div className="w-10 h-px" style={{ background: VAULT_YELLOW }} />
            </div>
            <p className="font-mono text-xs tracking-widest" style={{ color: VAULT_YELLOW }}>
              SELECT VAULT // REALITY SHIFT INITIATED
            </p>
          </div>
          <WorldsGrid />
        </div>
      </section>

      {/* ================================================================ */}
      {/* FOOTER */}
      {/* ================================================================ */}
      <footer className="relative z-20 py-12 text-center" role="contentinfo">
        <div className="flex justify-center gap-4 mb-4">
          <AtomSymbol size={40} color={PIPBOY_GREEN_DIM} />
        </div>
        <p className="text-xs font-mono" style={{ color: FADED_TEXT }}>
          © {new Date().getFullYear()} Alexander Pulido
        </p>
      </footer>
    </div>
  )
}
