'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useTheme } from '@/themes/ThemeContext'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import { useProfession } from '@/contexts/ProfessionContext'
import { ABOUT_DATA, PROFESSIONAL_SUMMARY } from '@/data/about'
import { PROJECTS_DATA } from '@/data/projects'
import { getSkillsByProfession, getEngineerSkills } from '@/data/skills'
import { CURRENT_ROLES } from '@/data/roles'
import { EXPERIENCE_DATA, filterExperienceByProfession } from '@/data/experience'
import { COMPANIES } from '@/data/companies'
import { BANDS } from '@/data/bands'

// ============================================================================
// FALLOUT COLOR PALETTE - Deep research into Fallout aesthetics
// ============================================================================

// Pip-Boy / Terminal Green (iconic Fallout 3/4/NV green)
const PIPBOY_GREEN = '#14ff00'
const PIPBOY_GREEN_DIM = '#0a8800'
const PIPBOY_GREEN_GLOW = '#14ff0040'
const PIPBOY_DARK = '#001a00'

// Vault-Tec Corporate Colors (blue/yellow from Vault Boy, marketing materials)
const VAULT_BLUE = '#1a3c6e'
const VAULT_BLUE_LIGHT = '#2e5c9e'
const VAULT_YELLOW = '#ffd700'
const VAULT_YELLOW_DIM = '#b8960a'

// Nuka-Cola (the iconic wasteland soda)
const NUKA_RED = '#c41e3a'
const NUKA_GLOW = '#ff4d6a'

// Wasteland Tones (post-apocalyptic earth, rust, decay)
const WASTELAND_BROWN = '#3d2914'
const WASTELAND_TAN = '#8b7355'
const RUST_ORANGE = '#b7410e'
const RUST_DARK = '#5c2006'
const IRRADIATED_AMBER = '#ffbf00'

// Backgrounds
const TERMINAL_BG = '#0a0a08'
const VAULT_BG = '#1a1a16'
const PANEL_BG = '#141410'

// Text
const TERMINAL_TEXT = '#14ff00'
const FADED_TEXT = '#666655'

// ============================================================================
// CSS TEXTURE GENERATORS (Pure CSS, no images)
// ============================================================================

// Rusted metal texture - weathered wasteland panels
const rustedMetalTexture = `
  linear-gradient(135deg, ${RUST_DARK}40 0%, transparent 50%),
  linear-gradient(225deg, ${WASTELAND_BROWN}30 0%, transparent 50%),
  repeating-linear-gradient(
    90deg,
    ${RUST_ORANGE}08 0px,
    ${RUST_ORANGE}08 2px,
    transparent 2px,
    transparent 4px
  ),
  repeating-linear-gradient(
    0deg,
    ${RUST_DARK}10 0px,
    ${RUST_DARK}10 1px,
    transparent 1px,
    transparent 3px
  ),
  radial-gradient(ellipse at 20% 30%, ${RUST_ORANGE}15 0%, transparent 50%),
  radial-gradient(ellipse at 80% 70%, ${WASTELAND_BROWN}20 0%, transparent 40%)
`

// Pip-Boy terminal screen effect - CRT phosphor glow
const pipBoyScreenTexture = `
  repeating-linear-gradient(
    0deg,
    ${PIPBOY_GREEN}03 0px,
    ${PIPBOY_GREEN}03 1px,
    transparent 1px,
    transparent 2px
  ),
  repeating-linear-gradient(
    90deg,
    ${PIPBOY_GREEN}02 0px,
    ${PIPBOY_GREEN}02 1px,
    transparent 1px,
    transparent 3px
  ),
  radial-gradient(ellipse at 50% 0%, ${PIPBOY_GREEN}15 0%, transparent 50%),
  radial-gradient(ellipse at 50% 100%, ${PIPBOY_DARK} 0%, transparent 30%),
  linear-gradient(180deg, ${PIPBOY_DARK}80 0%, ${TERMINAL_BG} 10%, ${TERMINAL_BG} 90%, ${PIPBOY_DARK}80 100%)
`

// Worn paper/document texture - wasteland files and records
const wornPaperTexture = `
  repeating-linear-gradient(
    45deg,
    ${WASTELAND_TAN}05 0px,
    ${WASTELAND_TAN}05 1px,
    transparent 1px,
    transparent 6px
  ),
  repeating-linear-gradient(
    -45deg,
    ${WASTELAND_BROWN}08 0px,
    ${WASTELAND_BROWN}08 1px,
    transparent 1px,
    transparent 8px
  ),
  linear-gradient(180deg, ${WASTELAND_TAN}15 0%, ${WASTELAND_BROWN}10 100%)
`

// Radiation warning pattern - hazard stripes
const radiationWarningPattern = `
  repeating-linear-gradient(
    45deg,
    ${VAULT_YELLOW}20 0px,
    ${VAULT_YELLOW}20 10px,
    ${TERMINAL_BG} 10px,
    ${TERMINAL_BG} 20px
  )
`

// ============================================================================
// RADIATION / NUCLEAR ICONS (SVG - no image imports)
// ============================================================================

function RadiationSymbol({
  size = 24,
  color = PIPBOY_GREEN,
  className = '',
  ariaLabel = 'Radiation symbol'
}: {
  size?: number
  color?: string
  className?: string
  ariaLabel?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      aria-label={ariaLabel}
      role="img"
    >
      <circle cx="50" cy="50" r="12" fill={color} />
      <path
        d="M50 10 A40 40 0 0 1 84.6 30 L60 45 A10 10 0 0 0 50 38 Z"
        fill={color}
      />
      <path
        d="M84.6 70 A40 40 0 0 1 15.4 70 L40 55 A10 10 0 0 0 60 55 Z"
        fill={color}
      />
      <path
        d="M15.4 30 A40 40 0 0 1 50 10 L50 38 A10 10 0 0 0 40 45 Z"
        fill={color}
      />
    </svg>
  )
}

function AtomSymbol({
  size = 24,
  color = PIPBOY_GREEN,
  ariaLabel = 'Atom symbol'
}: {
  size?: number
  color?: string
  ariaLabel?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      aria-label={ariaLabel}
      role="img"
    >
      <circle cx="50" cy="50" r="8" fill={color} />
      <ellipse cx="50" cy="50" rx="40" ry="15" fill="none" stroke={color} strokeWidth="2" />
      <ellipse cx="50" cy="50" rx="40" ry="15" fill="none" stroke={color} strokeWidth="2" transform="rotate(60 50 50)" />
      <ellipse cx="50" cy="50" rx="40" ry="15" fill="none" stroke={color} strokeWidth="2" transform="rotate(120 50 50)" />
    </svg>
  )
}

function BottleCapIcon({
  size = 24,
  color = VAULT_YELLOW,
  ariaLabel = 'Bottle cap currency'
}: {
  size?: number
  color?: string
  ariaLabel?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      aria-label={ariaLabel}
      role="img"
    >
      <circle cx="50" cy="50" r="45" fill={color} />
      <circle cx="50" cy="50" r="35" fill="none" stroke={WASTELAND_BROWN} strokeWidth="3" />
      {/* Crimped edges */}
      {[...Array(16)].map((_, i) => (
        <circle
          key={i}
          cx={50 + 42 * Math.cos((i * 22.5 * Math.PI) / 180)}
          cy={50 + 42 * Math.sin((i * 22.5 * Math.PI) / 180)}
          r="4"
          fill={WASTELAND_BROWN}
        />
      ))}
      <text x="50" y="58" textAnchor="middle" fill={NUKA_RED} fontSize="20" fontWeight="bold">N</text>
    </svg>
  )
}

// Vault Boy silhouette (iconic thumbs-up pose)
function VaultBoyIcon({
  size = 24,
  color = VAULT_YELLOW,
  ariaLabel = 'Vault Boy'
}: {
  size?: number
  color?: string
  ariaLabel?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      aria-label={ariaLabel}
      role="img"
    >
      {/* Head */}
      <circle cx="50" cy="25" r="18" fill={color} />
      {/* Body */}
      <ellipse cx="50" cy="55" rx="15" ry="20" fill={color} />
      {/* Thumbs up arm */}
      <path d="M65 50 Q80 40 75 25 Q72 20 68 22 Q70 30 60 45" fill={color} />
      {/* Other arm */}
      <path d="M35 50 Q25 55 20 65" stroke={color} strokeWidth="6" fill="none" strokeLinecap="round" />
      {/* Legs */}
      <path d="M42 72 L38 95" stroke={color} strokeWidth="8" strokeLinecap="round" />
      <path d="M58 72 L62 95" stroke={color} strokeWidth="8" strokeLinecap="round" />
    </svg>
  )
}

// ============================================================================
// TERMINAL SCANLINE EFFECT (CRT authenticity)
// ============================================================================

function TerminalScanlines({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[100]"
      style={{
        background: reducedMotion
          ? 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)'
          : 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)',
        opacity: reducedMotion ? 0.2 : 0.4,
      }}
      aria-hidden="true"
    />
  )
}

// ============================================================================
// VAULT-TEC PANEL FRAMES (Different texture variants)
// ============================================================================

function RustedMetalPanel({
  children,
  title,
  ariaLabel,
}: {
  children: React.ReactNode
  title: string
  ariaLabel?: string
}) {
  return (
    <section
      className="relative"
      aria-label={ariaLabel || title}
    >
      {/* Rusted metal background */}
      <div
        className="absolute inset-0"
        style={{
          background: rustedMetalTexture,
          backgroundColor: PANEL_BG,
        }}
        aria-hidden="true"
      />

      {/* Border with rust effect */}
      <div
        className="absolute inset-0"
        style={{
          border: `3px solid ${RUST_ORANGE}`,
          boxShadow: `
            inset 0 0 20px ${RUST_DARK}50,
            0 0 10px ${RUST_ORANGE}20
          `,
        }}
        aria-hidden="true"
      />

      {/* Corner rivets/bolts */}
      {['-top-1.5 -left-1.5', '-top-1.5 -right-1.5', '-bottom-1.5 -left-1.5', '-bottom-1.5 -right-1.5'].map((pos, i) => (
        <div
          key={i}
          className={`absolute w-4 h-4 rounded-full ${pos}`}
          style={{
            background: `radial-gradient(circle at 30% 30%, ${VAULT_YELLOW_DIM}, ${RUST_DARK})`,
            border: `2px solid ${RUST_DARK}`,
            boxShadow: `inset 0 0 2px ${VAULT_YELLOW}40`,
          }}
          aria-hidden="true"
        />
      ))}

      {/* Title bar with hazard stripe */}
      <div
        className="absolute -top-4 left-6 px-4 py-1 flex items-center gap-2"
        style={{
          background: radiationWarningPattern,
          backgroundColor: TERMINAL_BG,
          border: `2px solid ${RUST_ORANGE}`,
        }}
      >
        <RadiationSymbol size={14} color={VAULT_YELLOW} ariaLabel="" />
        <h2
          className="text-xs tracking-[0.25em] uppercase font-bold"
          style={{
            color: VAULT_YELLOW,
            textShadow: `0 0 8px ${VAULT_YELLOW}80`,
            fontFamily: 'monospace',
          }}
        >
          {title}
        </h2>
      </div>

      <div className="relative pt-8 pb-6 px-6">
        {children}
      </div>
    </section>
  )
}

function PipBoyTerminalPanel({
  children,
  title,
  ariaLabel,
}: {
  children: React.ReactNode
  title: string
  ariaLabel?: string
}) {
  return (
    <section
      className="relative"
      aria-label={ariaLabel || title}
    >
      {/* Pip-Boy screen effect background */}
      <div
        className="absolute inset-0"
        style={{
          background: pipBoyScreenTexture,
          backgroundColor: TERMINAL_BG,
        }}
        aria-hidden="true"
      />

      {/* Terminal border with glow */}
      <div
        className="absolute inset-0"
        style={{
          border: `2px solid ${PIPBOY_GREEN}`,
          boxShadow: `
            inset 0 0 30px ${PIPBOY_GREEN}15,
            0 0 15px ${PIPBOY_GREEN}30,
            inset 0 0 60px ${PIPBOY_DARK}
          `,
        }}
        aria-hidden="true"
      />

      {/* Corner indicators (like Pip-Boy UI elements) */}
      {['top-1 left-1', 'top-1 right-1', 'bottom-1 left-1', 'bottom-1 right-1'].map((pos, i) => (
        <div
          key={i}
          className={`absolute w-2 h-2 ${pos}`}
          style={{
            background: PIPBOY_GREEN,
            boxShadow: `0 0 6px ${PIPBOY_GREEN}`,
          }}
          aria-hidden="true"
        />
      ))}

      {/* Title bar */}
      <div
        className="absolute -top-3 left-6 px-4 py-0.5 flex items-center gap-2"
        style={{ background: TERMINAL_BG }}
      >
        <span style={{ color: PIPBOY_GREEN_DIM }}>&gt;&gt;</span>
        <h2
          className="text-xs tracking-[0.25em] uppercase font-bold"
          style={{
            color: PIPBOY_GREEN,
            textShadow: `0 0 10px ${PIPBOY_GREEN}80`,
            fontFamily: 'monospace',
          }}
        >
          {title}
        </h2>
        <span style={{ color: PIPBOY_GREEN_DIM }}>&lt;&lt;</span>
      </div>

      <div className="relative pt-6 pb-4 px-4">
        {children}
      </div>
    </section>
  )
}

function WornDocumentPanel({
  children,
  title,
  ariaLabel,
}: {
  children: React.ReactNode
  title: string
  ariaLabel?: string
}) {
  return (
    <section
      className="relative"
      aria-label={ariaLabel || title}
    >
      {/* Worn paper texture */}
      <div
        className="absolute inset-0"
        style={{
          background: wornPaperTexture,
          backgroundColor: VAULT_BG,
        }}
        aria-hidden="true"
      />

      {/* Border like aged document */}
      <div
        className="absolute inset-0"
        style={{
          border: `2px solid ${VAULT_BLUE}`,
          boxShadow: `
            inset 0 0 20px ${WASTELAND_BROWN}30,
            0 0 8px ${VAULT_BLUE}20
          `,
        }}
        aria-hidden="true"
      />

      {/* Vault-Tec style header stripe */}
      <div
        className="absolute top-0 left-0 right-0 h-8 flex items-center justify-center gap-3"
        style={{
          background: `linear-gradient(90deg, ${VAULT_BLUE}, ${VAULT_BLUE_LIGHT}, ${VAULT_BLUE})`,
          borderBottom: `2px solid ${VAULT_YELLOW}`,
        }}
      >
        <VaultBoyIcon size={18} color={VAULT_YELLOW} ariaLabel="" />
        <h2
          className="text-xs tracking-[0.3em] uppercase font-bold"
          style={{
            color: VAULT_YELLOW,
            textShadow: `0 0 6px ${VAULT_YELLOW}60`,
            fontFamily: 'monospace',
          }}
        >
          {title}
        </h2>
        <VaultBoyIcon size={18} color={VAULT_YELLOW} ariaLabel="" />
      </div>

      <div className="relative pt-12 pb-6 px-6">
        {children}
      </div>
    </section>
  )
}

// ============================================================================
// WASTELAND BACKGROUND ELEMENTS
// ============================================================================

function WastelandBackground({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Gradient wasteland sky */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg,
            ${TERMINAL_BG} 0%,
            ${WASTELAND_BROWN}15 40%,
            ${RUST_ORANGE}10 70%,
            ${TERMINAL_BG} 100%)`,
        }}
      />

      {/* Static radiation symbols (no animation if reduced motion) */}
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${15 + i * 18}%`,
            top: `${20 + (i % 3) * 25}%`,
            opacity: 0.06,
            transform: reducedMotion ? 'none' : undefined,
          }}
        >
          <RadiationSymbol size={50 + i * 8} color={PIPBOY_GREEN} ariaLabel="" />
        </div>
      ))}

      {/* Atom decorations */}
      {[...Array(3)].map((_, i) => (
        <div
          key={`atom-${i}`}
          className="absolute"
          style={{
            right: `${10 + i * 15}%`,
            bottom: `${15 + i * 18}%`,
            opacity: 0.05,
          }}
        >
          <AtomSymbol size={70} color={IRRADIATED_AMBER} ariaLabel="" />
        </div>
      ))}

      {/* Subtle vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, transparent 40%, ${TERMINAL_BG}80 100%)`,
        }}
      />
    </div>
  )
}

// ============================================================================
// PROFESSION SELECTOR (Vault-Tec S.P.E.C.I.A.L. style)
// ============================================================================

function ProfessionSelector({
  active,
  onSelect,
}: {
  active: 'engineer' | 'drummer' | 'fighter'
  onSelect: (p: 'engineer' | 'drummer' | 'fighter') => void
}) {
  const professions = [
    { id: 'engineer', label: 'ENGINEER', stat: 'INT', desc: 'Technical Specialist' },
    { id: 'drummer', label: 'MUSICIAN', stat: 'AGL', desc: 'Rhythm Division' },
    { id: 'fighter', label: 'FIGHTER', stat: 'STR', desc: 'Combat Training' },
  ] as const

  return (
    <div
      className="flex justify-center gap-4 py-6"
      role="tablist"
      aria-label="Select profession to view"
    >
      {professions.map((prof) => {
        const isActive = active === prof.id
        return (
          <button
            key={prof.id}
            onClick={() => onSelect(prof.id)}
            role="tab"
            aria-selected={isActive}
            aria-controls={`${prof.id}-content`}
            className="relative px-6 py-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{
              background: isActive ? PIPBOY_GREEN : 'transparent',
              border: `2px solid ${isActive ? PIPBOY_GREEN : PIPBOY_GREEN_DIM}`,
              color: isActive ? TERMINAL_BG : PIPBOY_GREEN,
              boxShadow: isActive ? `0 0 20px ${PIPBOY_GREEN_GLOW}, inset 0 0 10px ${PIPBOY_DARK}` : 'none',
              fontFamily: 'monospace',
            }}
          >
            <span className="text-xs tracking-wider font-bold block">
              {isActive && '> '}{prof.label}
            </span>
            <span
              className="block text-[10px] mt-1"
              style={{
                color: isActive ? TERMINAL_BG : PIPBOY_GREEN_DIM,
                opacity: 0.9,
              }}
            >
              [{prof.stat}] {prof.desc}
            </span>
          </button>
        )
      })}
    </div>
  )
}

// ============================================================================
// ACHIEVEMENTS DISPLAY (Replaces 1-10 stat bars)
// ============================================================================

function AchievementsDisplay({ profession }: { profession: 'engineer' | 'drummer' | 'fighter' }) {
  const achievements = {
    engineer: [
      { icon: '>', label: '10+ Years Full-Stack Development', category: 'EXPERIENCE' },
      { icon: '>', label: 'Elixir/Phoenix, Vue/Quasar Expert', category: 'TECH' },
      { icon: '>', label: 'Kubernetes Infrastructure Lead', category: 'DEVOPS' },
      { icon: '>', label: 'Multiple Production Systems Architected', category: 'IMPACT' },
      { icon: '>', label: 'Team Lead & Technical Mentor', category: 'LEADERSHIP' },
      { icon: '>', label: 'Real-time WebSocket Systems', category: 'SPECIALTY' },
    ],
    drummer: [
      { icon: '>', label: 'Professional Metal Drummer', category: 'ROLE' },
      { icon: '>', label: 'Multiple Band Projects', category: 'EXPERIENCE' },
      { icon: '>', label: 'Studio Recording Sessions', category: 'ACHIEVEMENT' },
      { icon: '>', label: 'Live Performance Expert', category: 'SKILL' },
      { icon: '>', label: 'Technical Death Metal Specialist', category: 'GENRE' },
      { icon: '>', label: 'Blast Beats & Complex Patterns', category: 'TECHNIQUE' },
    ],
    fighter: [
      { icon: '>', label: 'Martial Arts Training', category: 'DISCIPLINE' },
      { icon: '>', label: 'Competition Experience', category: 'ACHIEVEMENT' },
      { icon: '>', label: 'Physical Conditioning Focus', category: 'TRAINING' },
      { icon: '>', label: 'Mental Discipline & Focus', category: 'MINDSET' },
      { icon: '>', label: 'Strategic Combat Thinking', category: 'SKILL' },
      { icon: '>', label: 'Continuous Improvement', category: 'PHILOSOPHY' },
    ],
  }

  return (
    <div className="grid md:grid-cols-2 gap-3 font-mono">
      {achievements[profession].map((achievement, i) => (
        <div
          key={i}
          className="flex items-center gap-3 p-2"
          style={{
            background: `${PIPBOY_GREEN}08`,
            border: `1px solid ${PIPBOY_GREEN}30`,
          }}
        >
          <span
            className="text-xs px-2 py-0.5"
            style={{
              background: TERMINAL_BG,
              border: `1px solid ${VAULT_YELLOW}50`,
              color: VAULT_YELLOW,
            }}
          >
            {achievement.category}
          </span>
          <span className="text-sm" style={{ color: PIPBOY_GREEN }}>
            {achievement.icon} {achievement.label}
          </span>
        </div>
      ))}
    </div>
  )
}

// ============================================================================
// BOTTLE CAP COUNTER (Score/Currency display)
// ============================================================================

function BottleCapCounter({ count, label }: { count: number; label: string }) {
  return (
    <div
      className="flex items-center gap-2"
      aria-label={`${label}: ${count} bottle caps`}
    >
      <BottleCapIcon size={20} />
      <span
        className="font-mono text-sm font-bold tracking-wider"
        style={{ color: VAULT_YELLOW, textShadow: `0 0 4px ${VAULT_YELLOW}50` }}
      >
        {count.toLocaleString()}
      </span>
      <span className="text-[10px] uppercase" style={{ color: FADED_TEXT }}>
        {label}
      </span>
    </div>
  )
}

// ============================================================================
// TECH STACK / SKILLS DISPLAY (Terminal style, achievements not bars)
// ============================================================================

function TechTerminal({ categories }: { categories: ReturnType<typeof getEngineerSkills> }) {
  return (
    <div className="space-y-6 font-mono">
      {categories.slice(0, 6).map((category, catIdx) => (
        <div key={category.name}>
          <h3
            className="text-xs tracking-wider mb-3 flex items-center gap-2"
            style={{ color: PIPBOY_GREEN }}
          >
            <span style={{ color: VAULT_YELLOW }}>[{String(catIdx + 1).padStart(2, '0')}]</span>
            <span>{category.icon}</span>
            {category.name.toUpperCase()}
          </h3>
          <div className="flex flex-wrap gap-2">
            {category.items.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 text-xs font-bold cursor-default"
                style={{
                  background: TERMINAL_BG,
                  border: `1px solid ${PIPBOY_GREEN}`,
                  color: PIPBOY_GREEN,
                  textShadow: `0 0 4px ${PIPBOY_GREEN}50`,
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

// Skills for drummer/fighter - list format, no proficiency bars
function SkillsTerminal({ categories }: { categories: ReturnType<typeof getSkillsByProfession> }) {
  return (
    <div className="grid md:grid-cols-3 gap-6 font-mono">
      {categories.map((category, catIdx) => (
        <div key={category.name}>
          <h3
            className="text-xs tracking-wider mb-3 flex items-center gap-2"
            style={{ color: PIPBOY_GREEN }}
          >
            <span style={{ color: VAULT_YELLOW }}>[{String(catIdx + 1).padStart(2, '0')}]</span>
            <span>{category.icon}</span>
            {category.name.toUpperCase()}
          </h3>
          <ul className="space-y-2">
            {category.skills.map((skill) => (
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

// ============================================================================
// EXPERIENCE CARD (Terminal log style with worn paper texture)
// ============================================================================

function ExperienceTerminal({ entry }: { entry: typeof EXPERIENCE_DATA[0] }) {
  const endDisplay = entry.endDate ? new Date(entry.endDate).getFullYear() : 'ACTIVE'
  const startDisplay = new Date(entry.startDate).getFullYear()

  return (
    <article
      className="relative p-4 font-mono"
      style={{
        background: wornPaperTexture,
        backgroundColor: TERMINAL_BG,
        border: `1px solid ${PIPBOY_GREEN}40`,
        boxShadow: `inset 0 0 20px ${PIPBOY_GREEN}08`,
      }}
    >
      {/* Classification stamp effect */}
      <div
        className="absolute top-2 right-2 text-[8px] px-2 py-0.5 rotate-[-5deg]"
        style={{
          border: `1px solid ${entry.endDate ? FADED_TEXT : PIPBOY_GREEN}`,
          color: entry.endDate ? FADED_TEXT : PIPBOY_GREEN,
        }}
      >
        {entry.endDate ? 'ARCHIVED' : 'ACTIVE DUTY'}
      </div>

      <div className="flex justify-between items-start mb-2 pr-20">
        <div>
          <h4
            className="text-sm font-bold uppercase tracking-wide"
            style={{ color: PIPBOY_GREEN, textShadow: `0 0 6px ${PIPBOY_GREEN}50` }}
          >
            {entry.title}
          </h4>
          <p className="text-xs mt-1" style={{ color: VAULT_YELLOW }}>{entry.organization}</p>
        </div>
        <span
          className="text-[10px] px-2 py-1"
          style={{
            background: `${VAULT_BLUE}30`,
            border: `1px solid ${VAULT_BLUE}`,
            color: VAULT_YELLOW,
          }}
        >
          {startDisplay} - {endDisplay}
        </span>
      </div>

      <p className="text-xs mb-3" style={{ color: FADED_TEXT }}>{entry.description}</p>

      {entry.highlights && entry.highlights.length > 0 && (
        <ul className="space-y-1 border-t pt-2" style={{ borderColor: `${PIPBOY_GREEN}30` }}>
          {entry.highlights.map((highlight, i) => (
            <li
              key={i}
              className="text-xs flex items-start gap-2"
              style={{ color: TERMINAL_TEXT }}
            >
              <span style={{ color: IRRADIATED_AMBER }}>+</span>
              {highlight}
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

// ============================================================================
// PROJECT CARD (Vault-Tec dossier style)
// ============================================================================

function ProjectDossier({ project }: { project: typeof PROJECTS_DATA[0] }) {
  return (
    <article
      className="relative p-4 cursor-pointer group font-mono"
      style={{
        background: project.featured ? rustedMetalTexture : pipBoyScreenTexture,
        backgroundColor: project.featured ? `${VAULT_BLUE}15` : TERMINAL_BG,
        border: `2px solid ${project.featured ? VAULT_YELLOW : PIPBOY_GREEN}50`,
        boxShadow: project.featured ? `0 0 15px ${VAULT_YELLOW}15` : 'none',
      }}
    >
      {project.featured && (
        <div
          className="absolute -top-2 -right-2 flex items-center gap-1 px-2 py-0.5"
          style={{
            background: radiationWarningPattern,
            backgroundColor: TERMINAL_BG,
            border: `1px solid ${VAULT_YELLOW}`,
          }}
        >
          <BottleCapIcon size={12} />
          <span
            className="text-[9px] tracking-wider font-bold"
            style={{ color: VAULT_YELLOW }}
          >
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
            background: `${IRRADIATED_AMBER}10`,
            border: `1px solid ${IRRADIATED_AMBER}40`,
            color: IRRADIATED_AMBER,
          }}
        >
          <RadiationSymbol size={12} color={IRRADIATED_AMBER} ariaLabel="" />
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

// ============================================================================
// COMPANY CARD
// ============================================================================

function CompanyTerminal({ company }: { company: typeof COMPANIES[0] }) {
  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 group font-mono focus:outline-none focus-visible:ring-2"
      style={{
        background: pipBoyScreenTexture,
        backgroundColor: TERMINAL_BG,
        border: `1px solid ${VAULT_BLUE}`,
        boxShadow: `inset 0 0 15px ${VAULT_BLUE}10`,
      }}
      aria-label={`${company.name}: ${company.tagline}. Opens in new tab.`}
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{company.icon}</span>
        <div>
          <h4
            className="text-sm font-bold uppercase tracking-wide"
            style={{ color: PIPBOY_GREEN }}
          >
            {company.name}
          </h4>
          <p className="text-[10px]" style={{ color: VAULT_YELLOW }}>{company.tagline}</p>
        </div>
      </div>
      <p className="text-xs" style={{ color: FADED_TEXT }}>{company.description}</p>
      <div className="mt-2 text-[10px]" style={{ color: PIPBOY_GREEN_DIM }}>
        [ACCESS TERMINAL &gt;]
      </div>
    </a>
  )
}

// ============================================================================
// BAND CARD
// ============================================================================

function BandTerminal({ band }: { band: typeof BANDS[0] }) {
  const content = (
    <article
      className="p-4 group font-mono"
      style={{
        background: rustedMetalTexture,
        backgroundColor: TERMINAL_BG,
        border: `1px solid ${NUKA_RED}50`,
        boxShadow: `inset 0 0 15px ${NUKA_RED}08`,
      }}
    >
      <h4
        className="text-sm font-bold uppercase tracking-wide"
        style={{ color: NUKA_GLOW }}
      >
        {band.name}
      </h4>
      <p className="text-[10px] mt-1" style={{ color: VAULT_YELLOW }}>
        {band.genre} // {band.role}
      </p>
      <p className="text-xs mt-2" style={{ color: FADED_TEXT }}>{band.description}</p>
      {band.active && (
        <div
          className="mt-2 text-[10px] flex items-center gap-1"
          style={{ color: PIPBOY_GREEN }}
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: PIPBOY_GREEN, boxShadow: `0 0 4px ${PIPBOY_GREEN}` }}
          />
          ACTIVE BROADCAST
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
        aria-label={`${band.name}: ${band.genre}. Opens in new tab.`}
      >
        {content}
      </a>
    )
  }
  return content
}

// ============================================================================
// CURRENT ROLES DISPLAY
// ============================================================================

function RolesDisplay() {
  return (
    <div className="flex flex-wrap justify-center gap-6">
      {CURRENT_ROLES.map((role) => (
        <div
          key={role.id}
          className="text-center px-4 py-2"
          style={{
            border: `1px solid ${role.type === 'leadership' ? VAULT_YELLOW : PIPBOY_GREEN}40`,
            background: role.type === 'leadership'
              ? `linear-gradient(180deg, ${VAULT_YELLOW}10 0%, transparent 100%)`
              : `${PIPBOY_GREEN}08`,
          }}
        >
          <p
            className="text-xs font-bold font-mono tracking-wider"
            style={{
              color: role.type === 'leadership' ? VAULT_YELLOW : PIPBOY_GREEN,
            }}
          >
            {role.title}
          </p>
          <p
            className="text-sm mt-0.5"
            style={{ color: TERMINAL_TEXT }}
          >
            {role.company}
          </p>
        </div>
      ))}
    </div>
  )
}

// ============================================================================
// MAIN THEME COMPONENT
// ============================================================================

export default function RetroAtomicTheme() {
  useTheme()
  const { active, setActive } = useProfession()
  const [mounted, setMounted] = useState(false)
  const [capsCollected, setCapsCollected] = useState(2077) // Fallout reference year
  const [reducedMotion, setReducedMotion] = useState(false)

  const aboutData = ABOUT_DATA[active]
  const engineerTech = getEngineerSkills()
  const otherSkills = getSkillsByProfession(active)
  const projects = PROJECTS_DATA.filter(p => p.professions.includes(active) || p.featured)
  const experience = filterExperienceByProfession(EXPERIENCE_DATA, active)

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: TERMINAL_BG,
        fontFamily: 'monospace',
      }}
    >
      {/* Scanlines */}
      <TerminalScanlines reducedMotion={reducedMotion} />

      {/* Wasteland background */}
      <WastelandBackground reducedMotion={reducedMotion} />

      {/* ============================================================ */}
      {/* HEADER */}
      {/* ============================================================ */}
      <header
        className="relative z-30 p-6"
        role="banner"
      >
        <div className="max-w-6xl mx-auto">
          {/* Top bar */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
            <div>
              {/* Vault-Tec style header */}
              <div
                className="flex items-center gap-3 mb-2"
                style={{ borderBottom: `2px solid ${VAULT_YELLOW}`, paddingBottom: '8px' }}
              >
                <RadiationSymbol size={32} color={VAULT_YELLOW} ariaLabel="Vault-Tec emblem" />
                <div>
                  <h1
                    className="text-2xl md:text-3xl font-bold tracking-wider uppercase"
                    style={{
                      color: PIPBOY_GREEN,
                      textShadow: `0 0 20px ${PIPBOY_GREEN}80, 0 0 40px ${PIPBOY_GREEN}40`,
                    }}
                  >
                    ALEXANDER PULIDO
                  </h1>
                  <p
                    className="text-xs tracking-widest"
                    style={{ color: VAULT_YELLOW }}
                  >
                    VAULT-TEC PERSONNEL FILE // CLEARANCE: ALPHA
                  </p>
                </div>
              </div>

              {/* Professional summary */}
              <p
                className="text-sm mt-3 max-w-xl"
                style={{ color: TERMINAL_TEXT }}
              >
                {PROFESSIONAL_SUMMARY.headline}
              </p>
              <p
                className="text-xs mt-1 italic"
                style={{ color: IRRADIATED_AMBER }}
              >
                &quot;{PROFESSIONAL_SUMMARY.tagline}&quot;
              </p>
            </div>

            <div className="flex flex-col items-end gap-3">
              <BottleCapCounter count={capsCollected} label="CAPS" />

              <div className="flex gap-3 items-center flex-wrap justify-end">
                <Link
                  href="/cv"
                  className="px-4 py-2 text-xs font-bold tracking-wider focus:outline-none focus-visible:ring-2"
                  style={{
                    background: TERMINAL_BG,
                    border: `2px solid ${VAULT_BLUE}`,
                    color: VAULT_YELLOW,
                  }}
                  aria-label="View full CV"
                >
                  [F] FULL CV
                </Link>
                <Link
                  href="/personal-projects/game-engine"
                  className="px-4 py-2 text-xs font-bold tracking-wider focus:outline-none focus-visible:ring-2"
                  style={{
                    background: TERMINAL_BG,
                    border: `2px solid ${PIPBOY_GREEN}`,
                    color: PIPBOY_GREEN,
                  }}
                  aria-label="Launch Nebulith game engine"
                >
                  [N] NEBULITH
                </Link>
                <ThemeSwitcher />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ============================================================ */}
      {/* CURRENT ROLES */}
      {/* ============================================================ */}
      <section
        className="relative z-20 py-4 px-6"
        aria-label="Current professional roles"
      >
        <div className="max-w-6xl mx-auto">
          <RolesDisplay />
        </div>
      </section>

      {/* ============================================================ */}
      {/* PROFESSION SELECTOR */}
      {/* ============================================================ */}
      <section className="relative z-20 py-2">
        <ProfessionSelector active={active} onSelect={setActive} />
      </section>

      {/* ============================================================ */}
      {/* ACHIEVEMENTS (Replaces S.P.E.C.I.A.L. stat bars) */}
      {/* ============================================================ */}
      <section
        className="relative z-20 py-6 px-6"
        aria-label="Professional achievements"
      >
        <div className="max-w-4xl mx-auto">
          <PipBoyTerminalPanel title="Achievements Unlocked" ariaLabel="Key achievements and credentials">
            <AchievementsDisplay profession={active} />
          </PipBoyTerminalPanel>
        </div>
      </section>

      {/* ============================================================ */}
      {/* ABOUT */}
      {/* ============================================================ */}
      <section
        className="relative z-20 py-6 px-6"
        aria-label="About section"
      >
        <div className="max-w-4xl mx-auto">
          <WornDocumentPanel title="Personnel Dossier" ariaLabel="Personal background and information">
            <p
              className="text-sm leading-relaxed mb-4"
              style={{ color: TERMINAL_TEXT }}
            >
              {aboutData.bio}
            </p>
            <div className="flex flex-wrap gap-3">
              {aboutData.quickFacts.map((fact, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-xs font-bold"
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

      {/* ============================================================ */}
      {/* WORK EXPERIENCE */}
      {/* ============================================================ */}
      {experience.length > 0 && (
        <section
          className="relative z-20 py-6 px-6"
          aria-label="Work experience"
        >
          <div className="max-w-4xl mx-auto">
            <RustedMetalPanel title="Mission Log" ariaLabel="Professional work history">
              <div className="space-y-4">
                {experience.map((entry) => (
                  <ExperienceTerminal key={entry.id} entry={entry} />
                ))}
              </div>
            </RustedMetalPanel>
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* TECH STACK / SKILLS */}
      {/* ============================================================ */}
      <section
        className="relative z-20 py-6 px-6"
        aria-label={active === 'engineer' ? 'Technical skills' : 'Skills and abilities'}
      >
        <div className="max-w-4xl mx-auto">
          <PipBoyTerminalPanel
            title={active === 'engineer' ? 'Tech Arsenal' : 'Skill Perks'}
            ariaLabel={active === 'engineer' ? 'Technical skills and technologies' : 'Professional skills'}
          >
            {active === 'engineer' ? (
              <TechTerminal categories={engineerTech} />
            ) : (
              <SkillsTerminal categories={otherSkills} />
            )}
          </PipBoyTerminalPanel>
        </div>
      </section>

      {/* ============================================================ */}
      {/* PROJECTS */}
      {/* ============================================================ */}
      <section
        className="relative z-20 py-6 px-6"
        aria-label="Featured projects"
      >
        <div className="max-w-4xl mx-auto">
          <RustedMetalPanel title="Quest Log" ariaLabel="Portfolio of projects">
            <div className="grid md:grid-cols-2 gap-4">
              {projects.filter(p => p.featured).slice(0, 6).map((project) => (
                <ProjectDossier key={project.id} project={project} />
              ))}
            </div>
          </RustedMetalPanel>
        </div>
      </section>

      {/* ============================================================ */}
      {/* COMPANIES (Engineer) / BANDS (Drummer) */}
      {/* ============================================================ */}
      {active === 'engineer' && (
        <section
          className="relative z-20 py-6 px-6"
          aria-label="Companies and ventures"
        >
          <div className="max-w-4xl mx-auto">
            <WornDocumentPanel title="Affiliated Factions" ariaLabel="Companies and organizations">
              <div className="grid md:grid-cols-3 gap-4">
                {COMPANIES.map((company) => (
                  <CompanyTerminal key={company.id} company={company} />
                ))}
              </div>
            </WornDocumentPanel>
          </div>
        </section>
      )}

      {active === 'drummer' && (
        <section
          className="relative z-20 py-6 px-6"
          aria-label="Musical projects and bands"
        >
          <div className="max-w-4xl mx-auto">
            <RustedMetalPanel title="Radio Stations" ariaLabel="Musical bands and projects">
              <div className="grid md:grid-cols-3 gap-4">
                {BANDS.map((band) => (
                  <BandTerminal key={band.id} band={band} />
                ))}
              </div>
            </RustedMetalPanel>
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* FOOTER */}
      {/* ============================================================ */}
      <footer
        className="relative z-20 py-12 text-center"
        role="contentinfo"
      >
        <div className="flex justify-center gap-4 mb-4">
          <AtomSymbol size={40} color={PIPBOY_GREEN} />
        </div>
        <p
          className="text-sm font-bold tracking-widest uppercase"
          style={{ color: VAULT_YELLOW }}
        >
          VAULT-TEC INDUSTRIES
        </p>
        <p
          className="text-xs mt-2"
          style={{ color: FADED_TEXT }}
        >
          &quot;Prepare for the Future&quot;
        </p>
        <div className="flex justify-center gap-2 mt-4">
          {[...Array(7)].map((_, i) => (
            <RadiationSymbol key={i} size={12} color={PIPBOY_GREEN_DIM} ariaLabel="" />
          ))}
        </div>
        <p
          className="text-[10px] mt-4"
          style={{ color: `${FADED_TEXT}80` }}
        >
          [TERMINAL v2.0.77 // ALL SYSTEMS NOMINAL // {new Date().getFullYear()}]
        </p>
      </footer>
    </div>
  )
}
