'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
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
import { useInViewTrigger } from '@/hooks/useScrollAnimation'

// ============================================================================
// FALLOUT COLOR PALETTE
// ============================================================================

// Pip-Boy / Terminal Green
const PIPBOY_GREEN = '#14ff00'
const PIPBOY_GREEN_DIM = '#0a8800'
const PIPBOY_GREEN_GLOW = '#14ff0040'

// Vault-Tec Colors
const VAULT_BLUE = '#1a3c6e'
const VAULT_YELLOW = '#ffd700'
const VAULT_YELLOW_DIM = '#b8960a'

// Nuka-Cola
const NUKA_RED = '#c41e3a'
const NUKA_GLOW = '#ff4d6a'

// Wasteland Tones
const WASTELAND_BROWN = '#3d2914'
const WASTELAND_ORANGE = '#8b4513'
const RUST_ORANGE = '#b7410e'
const IRRADIATED_AMBER = '#ffbf00'

// Backgrounds
const TERMINAL_BG = '#0a0a08'
const VAULT_BG = '#1a1a16'
const PANEL_BG = '#141410'

// Text
const TERMINAL_TEXT = '#14ff00'
const AMBER_TEXT = '#ffbf00'
const FADED_TEXT = '#666655'

// ============================================================================
// RADIATION / NUCLEAR ICONS (SVG)
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

// ============================================================================
// TERMINAL SCANLINE EFFECT
// ============================================================================

function TerminalScanlines({ reducedMotion }: { reducedMotion: boolean }) {
  if (reducedMotion) return null

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[100]"
      style={{
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)',
        opacity: 0.4,
      }}
      aria-hidden="true"
    />
  )
}

// ============================================================================
// PIP-BOY STYLE STAT DISPLAY (S.P.E.C.I.A.L. inspired)
// ============================================================================

function StatBar({
  label,
  value,
  maxValue = 10,
  color = PIPBOY_GREEN
}: {
  label: string
  value: number
  maxValue?: number
  color?: string
}) {
  const filledBars = Math.min(value, maxValue)

  return (
    <div className="flex items-center gap-3" role="meter" aria-label={`${label}: ${value} out of ${maxValue}`}>
      <span
        className="text-xs font-bold w-24 tracking-wider uppercase"
        style={{ color }}
      >
        {label}
      </span>
      <div className="flex gap-1">
        {[...Array(maxValue)].map((_, i) => (
          <div
            key={i}
            className="w-4 h-3"
            style={{
              background: i < filledBars ? color : `${color}30`,
              boxShadow: i < filledBars ? `0 0 4px ${color}` : 'none',
            }}
          />
        ))}
      </div>
      <span className="text-xs font-mono" style={{ color }}>{value}</span>
    </div>
  )
}

// ============================================================================
// VAULT-TEC PANEL FRAME
// ============================================================================

function VaultPanel({
  children,
  title,
  variant = 'terminal',
  ariaLabel,
}: {
  children: React.ReactNode
  title: string
  variant?: 'terminal' | 'vault' | 'warning'
  ariaLabel?: string
}) {
  const colors = {
    terminal: { border: PIPBOY_GREEN, title: PIPBOY_GREEN, bg: TERMINAL_BG },
    vault: { border: VAULT_BLUE, title: VAULT_YELLOW, bg: VAULT_BG },
    warning: { border: RUST_ORANGE, title: NUKA_RED, bg: PANEL_BG },
  }
  const c = colors[variant]

  return (
    <section
      className="relative"
      aria-label={ariaLabel || title}
    >
      {/* Main border */}
      <div
        className="absolute inset-0"
        style={{
          border: `2px solid ${c.border}`,
          boxShadow: `0 0 10px ${c.border}30, inset 0 0 20px ${c.border}10`,
        }}
      />

      {/* Corner bolts/rivets */}
      {['-top-1 -left-1', '-top-1 -right-1', '-bottom-1 -left-1', '-bottom-1 -right-1'].map((pos, i) => (
        <div
          key={i}
          className={`absolute w-3 h-3 rounded-full ${pos}`}
          style={{
            background: `radial-gradient(circle at 30% 30%, ${VAULT_YELLOW}, ${WASTELAND_BROWN})`,
            border: `1px solid ${WASTELAND_BROWN}`,
          }}
          aria-hidden="true"
        />
      ))}

      {/* Title bar */}
      <div
        className="absolute -top-3 left-6 px-4 py-0.5 flex items-center gap-2"
        style={{ background: c.bg }}
      >
        <RadiationSymbol size={14} color={c.title} ariaLabel="" />
        <h2
          className="text-xs tracking-[0.25em] uppercase font-bold"
          style={{
            color: c.title,
            textShadow: `0 0 8px ${c.title}80`,
            fontFamily: 'monospace',
          }}
        >
          {title}
        </h2>
      </div>

      <div className="pt-6 pb-4 px-4" style={{ background: c.bg }}>
        {children}
      </div>
    </section>
  )
}

// ============================================================================
// TERMINAL REVEAL ANIMATION
// ============================================================================

function TerminalReveal({
  children,
  delay = 0,
  reducedMotion,
}: {
  children: React.ReactNode
  delay?: number
  reducedMotion: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const hasTriggered = useInViewTrigger(ref, { threshold: 0.15 })
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    if (hasTriggered && !revealed) {
      if (reducedMotion) {
        setRevealed(true)
      } else {
        const timer = setTimeout(() => setRevealed(true), delay)
        return () => clearTimeout(timer)
      }
    }
  }, [hasTriggered, revealed, delay, reducedMotion])

  return (
    <div ref={ref} className="relative overflow-hidden">
      <div
        style={{
          opacity: revealed ? 1 : 0,
          transform: revealed || reducedMotion ? 'translateY(0)' : 'translateY(10px)',
          transition: reducedMotion ? 'none' : 'all 0.5s ease-out',
        }}
      >
        {children}
      </div>
    </div>
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
            ${WASTELAND_BROWN}20 50%,
            ${RUST_ORANGE}15 100%)`,
        }}
      />

      {/* Floating radiation symbols */}
      {!reducedMotion && [...Array(5)].map((_, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${15 + i * 20}%`,
            top: `${20 + (i % 3) * 25}%`,
            opacity: 0.08,
            animation: `floatSlow ${15 + i * 3}s ease-in-out infinite`,
            animationDelay: `${-i * 2}s`,
          }}
        >
          <RadiationSymbol size={60 + i * 10} color={PIPBOY_GREEN} />
        </div>
      ))}

      {/* Atom decorations */}
      {!reducedMotion && [...Array(3)].map((_, i) => (
        <div
          key={`atom-${i}`}
          className="absolute"
          style={{
            right: `${10 + i * 15}%`,
            bottom: `${15 + i * 20}%`,
            opacity: 0.06,
            animation: `atomSpin ${20 + i * 5}s linear infinite`,
          }}
        >
          <AtomSymbol size={80} color={IRRADIATED_AMBER} />
        </div>
      ))}

      <style jsx>{`
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes atomSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

// ============================================================================
// PROFESSION SELECTOR (Vault-Tec style)
// ============================================================================

function ProfessionSelector({
  active,
  onSelect,
}: {
  active: 'engineer' | 'drummer' | 'fighter'
  onSelect: (p: 'engineer' | 'drummer' | 'fighter') => void
}) {
  const professions = [
    { id: 'engineer', label: 'ENGINEER', stat: 'INT', icon: '>' },
    { id: 'drummer', label: 'MUSICIAN', stat: 'AGL', icon: '>' },
    { id: 'fighter', label: 'FIGHTER', stat: 'STR', icon: '>' },
  ] as const

  return (
    <div
      className="flex justify-center gap-4 py-6"
      role="tablist"
      aria-label="Select profession"
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
            className="relative px-6 py-3 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{
              background: isActive ? PIPBOY_GREEN : 'transparent',
              border: `2px solid ${isActive ? PIPBOY_GREEN : PIPBOY_GREEN_DIM}`,
              color: isActive ? TERMINAL_BG : PIPBOY_GREEN,
              boxShadow: isActive ? `0 0 20px ${PIPBOY_GREEN_GLOW}` : 'none',
              fontFamily: 'monospace',
            }}
          >
            <span className="text-xs tracking-wider font-bold">
              {isActive && `${prof.icon} `}{prof.label}
            </span>
            <span
              className="block text-[10px] mt-1"
              style={{
                color: isActive ? TERMINAL_BG : PIPBOY_GREEN_DIM,
                opacity: 0.8,
              }}
            >
              [{prof.stat}]
            </span>
          </button>
        )
      })}
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
// TECH STACK / SKILLS DISPLAY (Terminal style, no proficiency bars)
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
            {category.items.map((tech, i) => (
              <span
                key={tech}
                className="px-3 py-1 text-xs font-bold transition-all hover:scale-105 cursor-default"
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

// Skills for drummer/fighter - with achievements instead of bars
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
// EXPERIENCE CARD (Terminal log style)
// ============================================================================

function ExperienceTerminal({ entry }: { entry: typeof EXPERIENCE_DATA[0] }) {
  const endDisplay = entry.endDate ? new Date(entry.endDate).getFullYear() : 'ACTIVE'
  const startDisplay = new Date(entry.startDate).getFullYear()

  return (
    <article
      className="p-4 font-mono"
      style={{
        background: TERMINAL_BG,
        border: `1px solid ${PIPBOY_GREEN}40`,
        boxShadow: `inset 0 0 20px ${PIPBOY_GREEN}10`,
      }}
    >
      <div className="flex justify-between items-start mb-2">
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
            background: entry.endDate ? PANEL_BG : `${PIPBOY_GREEN}20`,
            border: `1px solid ${entry.endDate ? FADED_TEXT : PIPBOY_GREEN}`,
            color: entry.endDate ? FADED_TEXT : PIPBOY_GREEN,
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
      className="p-4 transition-all hover:scale-[1.01] cursor-pointer group font-mono"
      style={{
        background: project.featured ? `${VAULT_BLUE}20` : TERMINAL_BG,
        border: `2px solid ${project.featured ? VAULT_YELLOW : PIPBOY_GREEN}50`,
        boxShadow: project.featured ? `0 0 15px ${VAULT_YELLOW}20` : 'none',
      }}
    >
      {project.featured && (
        <div
          className="flex items-center gap-2 mb-2"
          style={{ color: VAULT_YELLOW }}
        >
          <BottleCapIcon size={14} />
          <span className="text-[10px] tracking-wider font-bold">
            PRIORITY PROJECT
          </span>
        </div>
      )}

      <h4
        className="text-sm font-bold uppercase tracking-wide group-hover:text-[#1aff1a] transition-colors"
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
      className="block p-4 transition-all hover:scale-[1.02] group font-mono focus:outline-none focus:ring-2"
      style={{
        background: TERMINAL_BG,
        border: `1px solid ${VAULT_BLUE}`,
        boxShadow: `inset 0 0 15px ${VAULT_BLUE}10`,
      }}
      aria-label={`${company.name}: ${company.tagline}`}
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{company.icon}</span>
        <div>
          <h4
            className="text-sm font-bold uppercase tracking-wide group-hover:text-[#1aff1a] transition-colors"
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
      className="p-4 transition-all hover:scale-[1.02] group font-mono"
      style={{
        background: TERMINAL_BG,
        border: `1px solid ${NUKA_RED}50`,
        boxShadow: `inset 0 0 15px ${NUKA_RED}10`,
      }}
    >
      <h4
        className="text-sm font-bold uppercase tracking-wide group-hover:text-[#ff6a8a] transition-colors"
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
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: PIPBOY_GREEN }} />
          ACTIVE
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
        className="block focus:outline-none focus:ring-2"
        aria-label={`${band.name}: ${band.genre}`}
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
            background: `${role.type === 'leadership' ? VAULT_YELLOW : PIPBOY_GREEN}08`,
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
  const [capsCollected, setCapsCollected] = useState(0)
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
    // Simulate collecting bottle caps
    if (!reducedMotion) {
      const interval = setInterval(() => setCapsCollected(c => c + 1), 2000)
      return () => clearInterval(interval)
    }
  }, [reducedMotion])

  // Calculate "S.P.E.C.I.A.L." stats based on profession
  const getStats = useCallback(() => {
    const base = { STR: 5, PER: 6, END: 5, CHA: 7, INT: 8, AGL: 6, LCK: 5 }
    if (active === 'engineer') {
      return { ...base, INT: 10, PER: 8, END: 7 }
    } else if (active === 'drummer') {
      return { ...base, AGL: 10, CHA: 8, PER: 7 }
    } else {
      return { ...base, STR: 10, END: 9, AGL: 8 }
    }
  }, [active])

  if (!mounted) return null

  const stats = getStats()

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
          <div className="flex justify-between items-start mb-4">
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
                    VAULT-TEC PERSONNEL FILE
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

              <div className="flex gap-3 items-center">
                <Link
                  href="/cv"
                  className="px-4 py-2 text-xs font-bold tracking-wider transition-all hover:scale-105 focus:outline-none focus:ring-2"
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
                  className="px-4 py-2 text-xs font-bold tracking-wider transition-all hover:scale-105 focus:outline-none focus:ring-2"
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
      {/* S.P.E.C.I.A.L. STATS */}
      {/* ============================================================ */}
      <section
        className="relative z-20 py-6 px-6"
        aria-label="S.P.E.C.I.A.L. character statistics"
      >
        <div className="max-w-4xl mx-auto">
          <TerminalReveal reducedMotion={reducedMotion}>
            <VaultPanel title="S.P.E.C.I.A.L." variant="terminal">
              <div className="grid md:grid-cols-2 gap-3">
                <StatBar label="STRENGTH" value={stats.STR} />
                <StatBar label="PERCEPTION" value={stats.PER} />
                <StatBar label="ENDURANCE" value={stats.END} />
                <StatBar label="CHARISMA" value={stats.CHA} />
                <StatBar label="INTELLIGENCE" value={stats.INT} />
                <StatBar label="AGILITY" value={stats.AGL} />
                <StatBar label="LUCK" value={stats.LCK} />
              </div>
            </VaultPanel>
          </TerminalReveal>
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
          <TerminalReveal reducedMotion={reducedMotion}>
            <VaultPanel title="Personnel Dossier" variant="vault">
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
            </VaultPanel>
          </TerminalReveal>
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
            <TerminalReveal delay={100} reducedMotion={reducedMotion}>
              <VaultPanel title="Mission Log" variant="terminal">
                <div className="space-y-4">
                  {experience.map((entry) => (
                    <ExperienceTerminal key={entry.id} entry={entry} />
                  ))}
                </div>
              </VaultPanel>
            </TerminalReveal>
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
          <TerminalReveal delay={100} reducedMotion={reducedMotion}>
            <VaultPanel
              title={active === 'engineer' ? 'Tech Arsenal' : 'Skill Perks'}
              variant="terminal"
            >
              {active === 'engineer' ? (
                <TechTerminal categories={engineerTech} />
              ) : (
                <SkillsTerminal categories={otherSkills} />
              )}
            </VaultPanel>
          </TerminalReveal>
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
          <TerminalReveal delay={100} reducedMotion={reducedMotion}>
            <VaultPanel title="Quest Log" variant="warning">
              <div className="grid md:grid-cols-2 gap-4">
                {projects.filter(p => p.featured).slice(0, 6).map((project) => (
                  <ProjectDossier key={project.id} project={project} />
                ))}
              </div>
            </VaultPanel>
          </TerminalReveal>
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
            <TerminalReveal delay={100} reducedMotion={reducedMotion}>
              <VaultPanel title="Affiliated Factions" variant="vault">
                <div className="grid md:grid-cols-3 gap-4">
                  {COMPANIES.map((company) => (
                    <CompanyTerminal key={company.id} company={company} />
                  ))}
                </div>
              </VaultPanel>
            </TerminalReveal>
          </div>
        </section>
      )}

      {active === 'drummer' && (
        <section
          className="relative z-20 py-6 px-6"
          aria-label="Musical projects and bands"
        >
          <div className="max-w-4xl mx-auto">
            <TerminalReveal delay={100} reducedMotion={reducedMotion}>
              <VaultPanel title="Radio Stations" variant="warning">
                <div className="grid md:grid-cols-3 gap-4">
                  {BANDS.map((band) => (
                    <BandTerminal key={band.id} band={band} />
                  ))}
                </div>
              </VaultPanel>
            </TerminalReveal>
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
            <RadiationSymbol key={i} size={12} color={PIPBOY_GREEN_DIM} />
          ))}
        </div>
        <p
          className="text-[10px] mt-4"
          style={{ color: `${FADED_TEXT}80` }}
        >
          [TERMINAL v2.0.77 // ALL SYSTEMS NOMINAL]
        </p>
      </footer>
    </div>
  )
}
