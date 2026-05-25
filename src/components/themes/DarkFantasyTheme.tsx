'use client'

import { useEffect, useState, useRef } from 'react'
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
import { useInViewTrigger } from '@/hooks/useScrollAnimation'

// Hollow Knight color palette - based on City of Tears zone
const HK = {
  // Core colors
  void: '#000000',
  deepBlue: '#1d2e65',       // City of Tears primary
  midBlue: '#4d6f94',        // City of Tears secondary
  paleBlue: '#abc2c5',       // City of Tears highlights
  darkPurple: '#362e42',     // City of Tears shadows
  purple: '#330055',         // Main HK purple

  // Character colors
  bone: '#F7F7F7',           // Knight mask white
  silver: '#C0C0C0',         // UI elements
  lavender: '#B7A9D9',       // Soft accents

  // Accent colors
  soul: '#6DCCF4',           // Soul cyan glow
  soulDark: '#4E9FD1',       // Darker soul
  infection: '#FF8C00',      // Orange infection

  // Greenpath accents (for variety)
  leafGreen: '#4E7E3B',
  mossGreen: '#2F5D34',
}

// SVG Hollow Knight - simple oval face with curved horns (accurate to game)
function TheKnight({ size = 60 }: { size?: number }) {
  return (
    <svg width={size} height={size * 1.4} viewBox="0 0 40 56" className="transition-all duration-300">
      {/* Cloak/body - dark grey */}
      <ellipse cx="20" cy="48" rx="12" ry="10" fill="#2a2a2a" />
      <rect x="12" y="38" width="16" height="12" fill="#2a2a2a" />

      {/* Left horn - curved upward */}
      <path
        d="M12,22 Q8,14 6,4 Q10,8 14,16 Q12,20 12,22"
        fill={HK.bone}
        stroke={HK.bone}
        strokeWidth="0.5"
      />
      {/* Right horn - curved upward */}
      <path
        d="M28,22 Q32,14 34,4 Q30,8 26,16 Q28,20 28,22"
        fill={HK.bone}
        stroke={HK.bone}
        strokeWidth="0.5"
      />

      {/* Face - simple oval */}
      <ellipse cx="20" cy="28" rx="12" ry="14" fill={HK.bone} />

      {/* Eyes - void black ovals, angled slightly */}
      <ellipse cx="15" cy="26" rx="3" ry="5" fill={HK.void} />
      <ellipse cx="25" cy="26" rx="3" ry="5" fill={HK.void} />
    </svg>
  )
}

// Soul orb UI element (top-left in game)
function SoulOrb({ filled = 100 }: { filled?: number }) {
  return (
    <div
      className="relative w-8 h-8 rounded-full"
      style={{
        background: `conic-gradient(${HK.bone} ${filled}%, ${HK.void} ${filled}%)`,
        border: `2px solid ${HK.bone}`,
        boxShadow: filled > 50 ? `0 0 10px ${HK.soul}` : 'none',
      }}
    />
  )
}

// Soul particles - floating cyan orbs with glow
function SoulParticles() {
  const [particles] = useState(() =>
    Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 3,
      opacity: Math.random() * 0.4 + 0.2,
      speed: Math.random() * 25 + 15,
      delay: Math.random() * -20,
    }))
  )

  return (
    <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: `radial-gradient(circle, ${HK.soul}, ${HK.soulDark})`,
            opacity: p.opacity,
            boxShadow: `0 0 ${p.size * 2}px ${HK.soul}, 0 0 ${p.size * 4}px ${HK.soulDark}`,
            animation: `float ${p.speed}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

// City of Tears architectural elements - pillars and ironwork at edges
function CityArchitecture() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[3]">
      {/* Left pillar */}
      <svg className="absolute left-0 top-0 h-full w-20 opacity-30" viewBox="0 0 60 800" preserveAspectRatio="none">
        {/* Gothic pillar shape */}
        <rect x="5" y="0" width="20" height="800" fill={HK.darkPurple} />
        <rect x="0" y="0" width="30" height="40" fill={HK.darkPurple} />
        {/* Ornate curves */}
        <path d="M25,40 Q40,60 25,100 Q45,140 25,180" stroke={HK.midBlue} strokeWidth="2" fill="none" opacity="0.5" />
        <path d="M25,200 Q40,240 25,280 Q45,320 25,360" stroke={HK.midBlue} strokeWidth="2" fill="none" opacity="0.5" />
      </svg>
      {/* Right pillar */}
      <svg className="absolute right-0 top-0 h-full w-20 opacity-30" viewBox="0 0 60 800" preserveAspectRatio="none">
        <rect x="35" y="0" width="20" height="800" fill={HK.darkPurple} />
        <rect x="30" y="0" width="30" height="40" fill={HK.darkPurple} />
        <path d="M35,40 Q20,60 35,100 Q15,140 35,180" stroke={HK.midBlue} strokeWidth="2" fill="none" opacity="0.5" />
        <path d="M35,200 Q20,240 35,280 Q15,320 35,360" stroke={HK.midBlue} strokeWidth="2" fill="none" opacity="0.5" />
      </svg>
      {/* Top chandelier hint */}
      <svg className="absolute top-0 left-1/2 transform -translate-x-1/2 w-64 h-32 opacity-20" viewBox="0 0 200 80">
        {/* Chandelier chain */}
        <line x1="100" y1="0" x2="100" y2="20" stroke={HK.silver} strokeWidth="2" />
        {/* Chandelier body */}
        <ellipse cx="100" cy="30" rx="40" ry="10" fill="none" stroke={HK.silver} strokeWidth="1" />
        {/* Hanging ornaments */}
        <circle cx="70" cy="45" r="4" fill={HK.paleBlue} opacity="0.6" />
        <circle cx="100" cy="50" r="5" fill={HK.paleBlue} opacity="0.8" />
        <circle cx="130" cy="45" r="4" fill={HK.paleBlue} opacity="0.6" />
        {/* Glowing orbs */}
        <circle cx="60" cy="55" r="3" fill={HK.bone} />
        <circle cx="80" cy="60" r="3" fill={HK.bone} />
        <circle cx="100" cy="65" r="4" fill={HK.bone} />
        <circle cx="120" cy="60" r="3" fill={HK.bone} />
        <circle cx="140" cy="55" r="3" fill={HK.bone} />
      </svg>
    </div>
  )
}

// Nail slash reveal for sections - Hollow Knight's nail attack
function NailSlashReveal({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const hasEntered = useInViewTrigger(ref, { threshold: 0.15 })
  const [phase, setPhase] = useState<'hidden' | 'slash' | 'revealed'>('hidden')

  useEffect(() => {
    if (hasEntered && phase === 'hidden') {
      setPhase('slash')
      setTimeout(() => setPhase('revealed'), 500)
    }
  }, [hasEntered, phase])

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {/* Nail slash animation - horizontal soul-colored line */}
      {phase === 'slash' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div
            className="absolute h-0.5"
            style={{
              width: '100%',
              background: `linear-gradient(90deg, transparent, ${HK.soul}, transparent)`,
              boxShadow: `0 0 20px ${HK.soul}, 0 0 40px ${HK.soulDark}`,
              animation: 'slashReveal 0.4s ease-out forwards',
            }}
          />
          {/* Small mask icon during slash */}
          <div style={{ animation: 'knightDash 0.4s ease-out forwards' }}>
            <TheKnight size={30} />
          </div>
        </div>
      )}

      <div
        style={{
          opacity: phase === 'revealed' ? 1 : 0,
          transform: phase === 'revealed' ? 'translateY(0)' : 'translateY(15px)',
          transition: 'all 0.4s ease-out',
        }}
      >
        {children}
      </div>
    </div>
  )
}

// Bench-style waypoint for profession selection (Hollow Knight benches)
function BenchWaypoint({
  icon,
  label,
  color,
  isActive,
  onClick,
  position,
}: {
  icon: string
  label: string
  color: string
  isActive: boolean
  onClick: () => void
  position: { x: number; y: number }
}) {
  return (
    <button
      onClick={onClick}
      className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
      style={{ left: `${position.x}%`, top: `${position.y}%` }}
    >
      {/* Soul glow when active */}
      <div
        className={`absolute inset-0 rounded-full blur-xl transition-all duration-500 ${
          isActive ? 'opacity-50 scale-150' : 'opacity-0 scale-100 group-hover:opacity-30 group-hover:scale-125'
        }`}
        style={{ backgroundColor: color }}
      />
      {/* Organic/hand-drawn style circle */}
      <div
        className={`relative w-20 h-20 flex flex-col items-center justify-center transition-all duration-300 ${
          isActive ? 'scale-110' : 'group-hover:scale-105'
        }`}
        style={{
          background: `radial-gradient(circle at 30% 30%, ${color}30, ${HK.void})`,
          border: `2px solid ${isActive ? color : HK.darkPurple}`,
          borderRadius: '60% 40% 55% 45% / 45% 55% 40% 60%',
          boxShadow: isActive
            ? `0 0 30px ${color}50, inset 0 0 20px ${color}20`
            : `inset 0 0 15px rgba(0,0,0,0.5)`,
        }}
      >
        <span className="text-xl mb-1" style={{ color: isActive ? color : HK.silver }}>{icon}</span>
        <span
          className="text-[8px] tracking-[0.2em] uppercase"
          style={{
            color: isActive ? color : HK.silver,
            fontFamily: '"Cinzel", "Garamond", serif',
          }}
        >
          {label}
        </span>
      </div>
    </button>
  )
}

// Hollow Knight panel frame - organic hand-drawn feel
function VoidFrame({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="relative">
      {/* Corner thorns/shell ornaments */}
      {[
        { pos: '-top-2 -left-2', rot: '0' },
        { pos: '-top-2 -right-2', rot: '90' },
        { pos: '-bottom-2 -left-2', rot: '-90' },
        { pos: '-bottom-2 -right-2', rot: '180' },
      ].map((corner, i) => (
        <div
          key={i}
          className={`absolute w-6 h-6 ${corner.pos}`}
          style={{ transform: `rotate(${corner.rot}deg)` }}
        >
          <svg viewBox="0 0 24 24" className="w-full h-full">
            <path
              d="M2,12 Q2,2 12,2 L10,6 Q6,6 6,12 Z"
              fill={HK.soul}
              opacity="0.5"
            />
            <circle cx="4" cy="4" r="2" fill={HK.soul} opacity="0.7" />
          </svg>
        </div>
      ))}

      {/* Title with soul dividers */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, transparent, ${HK.darkPurple})` }} />
        <h2
          className="text-sm tracking-[0.25em] uppercase"
          style={{
            color: HK.soul,
            fontFamily: '"Cinzel", "Garamond", serif',
            textShadow: `0 0 20px ${HK.soulDark}`,
          }}
        >
          {title}
        </h2>
        <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${HK.darkPurple}, transparent)` }} />
      </div>

      <div
        className="p-6 relative"
        style={{
          background: `linear-gradient(180deg, ${HK.void}ee, ${HK.darkPurple}40)`,
          border: `1px solid ${HK.darkPurple}`,
          borderRadius: '4px 8px 4px 8px',
          boxShadow: `inset 0 0 30px rgba(0,0,0,0.4)`,
        }}
      >
        {children}
      </div>
    </div>
  )
}

// Tech stack - soul-infused abilities
function TechCloud({ categories }: { categories: ReturnType<typeof getEngineerSkills> }) {
  return (
    <div className="space-y-6">
      {categories.slice(0, 5).map((category) => (
        <div key={category.name}>
          <h3
            className="text-xs tracking-[0.15em] mb-3 flex items-center gap-2 uppercase"
            style={{ color: HK.silver, fontFamily: '"Cinzel", serif' }}
          >
            <span>{category.icon}</span>
            {category.name}
          </h3>
          <div className="flex flex-wrap gap-2">
            {category.items.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 text-xs transition-all hover:scale-105 cursor-default"
                style={{
                  background: `${HK.soul}15`,
                  border: `1px solid ${HK.soul}40`,
                  color: HK.bone,
                  borderRadius: '2px 4px 2px 4px',
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

// Skills list - charm abilities style
function SkillsList({ categories }: { categories: ReturnType<typeof getSkillsByProfession> }) {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {categories.map((category) => (
        <div key={category.name}>
          <h3
            className="text-xs tracking-[0.15em] mb-3 flex items-center gap-2 uppercase"
            style={{ color: HK.silver, fontFamily: '"Cinzel", serif' }}
          >
            <span>{category.icon}</span>
            {category.name}
          </h3>
          <ul className="space-y-2">
            {category.skills.map((skill) => (
              <li key={skill.name} className="text-sm flex items-center gap-2" style={{ color: HK.bone }}>
                <span style={{ color: HK.soul }}>◇</span>
                {skill.name}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

// Project card - artifact/relic style
function ProjectCard({ project }: { project: typeof PROJECTS_DATA[0] }) {
  return (
    <div
      className="p-4 transition-all hover:scale-[1.02] cursor-pointer group"
      style={{
        background: `linear-gradient(135deg, ${HK.void}, ${HK.darkPurple}40)`,
        border: `1px solid ${project.featured ? HK.soul : HK.darkPurple}`,
        borderRadius: '2px 6px 2px 6px',
        boxShadow: project.featured ? `0 0 20px ${HK.soul}30` : 'none',
      }}
    >
      {project.featured && (
        <span className="text-[8px] tracking-[0.15em] uppercase" style={{ color: HK.soul }}>◇ Featured</span>
      )}
      <h4 className="text-sm mt-1 transition-colors" style={{ color: HK.bone }}>
        {project.name}
      </h4>
      <p className="text-xs mt-2" style={{ color: HK.silver }}>{project.tagline}</p>
      {project.impact && (
        <p className="text-xs mt-2 italic" style={{ color: HK.soul }}>→ {project.impact}</p>
      )}
      <div className="flex flex-wrap gap-1 mt-3">
        {project.techStack.slice(0, 4).map((tech) => (
          <span key={tech} className="text-[8px] px-1 py-0.5" style={{ background: `${HK.soul}15`, color: HK.silver }}>
            {tech}
          </span>
        ))}
      </div>
    </div>
  )
}

// Company card - guild/ally style
function CompanyCard({ company }: { company: typeof COMPANIES[0] }) {
  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 transition-all hover:scale-[1.02] group"
      style={{
        background: `linear-gradient(135deg, ${HK.void}, ${HK.darkPurple}40)`,
        border: `1px solid ${HK.darkPurple}`,
        borderRadius: '2px 6px 2px 6px',
      }}
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{company.icon}</span>
        <div>
          <h4 className="text-sm transition-colors" style={{ color: HK.bone }}>
            {company.name}
          </h4>
          <p className="text-[10px]" style={{ color: HK.soul }}>{company.tagline}</p>
        </div>
      </div>
      <p className="text-xs" style={{ color: HK.silver }}>{company.description}</p>
    </a>
  )
}

// Band card - dream realm style
function BandCard({ band }: { band: typeof BANDS[0] }) {
  const content = (
    <div
      className="p-4 transition-all hover:scale-[1.02] group"
      style={{
        background: `linear-gradient(135deg, ${HK.void}, ${HK.lavender}30)`,
        border: `1px solid ${HK.lavender}`,
        borderRadius: '2px 6px 2px 6px',
      }}
    >
      <h4 className="text-sm transition-colors" style={{ color: HK.bone }}>
        {band.name}
      </h4>
      <p className="text-[10px] mt-1" style={{ color: HK.soul }}>{band.genre} • {band.role}</p>
      <p className="text-xs mt-2" style={{ color: HK.silver }}>{band.description}</p>
      {!band.url && <p className="text-[10px] mt-2 italic" style={{ color: HK.silver }}>Website coming soon</p>}
    </div>
  )

  if (band.url) {
    return <a href={band.url} target="_blank" rel="noopener noreferrer" className="block">{content}</a>
  }
  return content
}

// Work experience card - memory/journal style
function ExperienceCard({ entry }: { entry: typeof EXPERIENCE_DATA[0] }) {
  const endDisplay = entry.endDate ? new Date(entry.endDate).getFullYear() : 'Present'
  const startDisplay = new Date(entry.startDate).getFullYear()

  return (
    <div
      className="p-4"
      style={{
        background: `linear-gradient(135deg, ${HK.void}, ${HK.darkPurple}30)`,
        border: `1px solid ${HK.darkPurple}`,
        borderRadius: '2px 6px 2px 6px',
      }}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="text-sm font-medium" style={{ color: HK.bone }}>{entry.title}</h4>
          <p className="text-xs" style={{ color: HK.soul }}>{entry.organization}</p>
        </div>
        <span
          className="text-[10px] px-2 py-0.5"
          style={{
            color: HK.soul,
            background: `${HK.soul}15`,
            border: `1px solid ${HK.soul}30`,
            borderRadius: '2px',
          }}
        >
          {startDisplay} - {endDisplay}
        </span>
      </div>
      <p className="text-xs mb-2" style={{ color: HK.silver }}>{entry.description}</p>
      {entry.highlights && entry.highlights.length > 0 && (
        <ul className="space-y-1">
          {entry.highlights.map((highlight, i) => (
            <li key={i} className="text-xs flex items-start gap-2" style={{ color: HK.bone }}>
              <span style={{ color: HK.soul }}>◇</span>
              {highlight}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function DarkFantasyTheme() {
  const { theme } = useTheme()
  const { active, setActive, config } = useProfession()
  const [mounted, setMounted] = useState(false)

  const aboutData = ABOUT_DATA[active]
  const engineerTech = getEngineerSkills()
  const otherSkills = getSkillsByProfession(active)
  const projects = PROJECTS_DATA.filter(p => p.professions.includes(active) || p.featured)
  const experience = filterExperienceByProfession(EXPERIENCE_DATA, active)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const professionNodes = [
    { id: 'engineer', icon: '⚙', label: 'Engineer', color: HK.soul, position: { x: 25, y: 50 } },
    { id: 'drummer', icon: '♪', label: 'Musician', color: HK.lavender, position: { x: 50, y: 30 } },
    { id: 'fighter', icon: '⚔', label: 'Fighter', color: HK.infection, position: { x: 75, y: 50 } },
  ]

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: `linear-gradient(180deg, ${HK.void}, ${HK.deepBlue}, ${HK.darkPurple})`,
        fontFamily: '"Cinzel", "Garamond", serif',
      }}
    >
      {/* City of Tears atmosphere - deep blue with rain-like particles */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse at 30% 20%, ${HK.midBlue}40 0%, transparent 40%),
            radial-gradient(ellipse at 70% 70%, ${HK.deepBlue}60 0%, transparent 50%),
            radial-gradient(ellipse at 50% 100%, ${HK.paleBlue}20 0%, transparent 40%),
            linear-gradient(180deg, ${HK.void} 0%, ${HK.deepBlue} 50%, ${HK.darkPurple} 100%)
          `,
        }}
      />
      <CityArchitecture />
      <SoulParticles />
      {/* Heavy vignette - City of Tears has strong depth */}
      <div
        className="fixed inset-0 pointer-events-none z-[8]"
        style={{
          boxShadow: `inset 0 0 200px 80px ${HK.void}`,
          background: 'radial-gradient(ellipse at 50% 30%, transparent 20%, rgba(0,0,0,0.6) 100%)',
        }}
      />

      {/* Header with Hollow Knight mask */}
      <header className="relative z-30 p-6">
        <div className="max-w-6xl mx-auto flex justify-between items-start">
          <div className="flex items-center gap-6 animate-fade-in-down">
            <TheKnight size={60} />
            <div>
              <h1
                className="text-3xl tracking-[0.3em] font-normal uppercase"
                style={{
                  color: HK.bone,
                  textShadow: `0 0 30px ${HK.soul}50`,
                }}
              >
                Alexander Pulido
              </h1>
              <p className="text-sm tracking-wider mt-2" style={{ color: HK.silver }}>
                {PROFESSIONAL_SUMMARY.headline}
              </p>
              <p
                className="text-xs tracking-wider mt-1 italic"
                style={{ color: HK.soul, textShadow: `0 0 10px ${HK.soulDark}` }}
              >
                {PROFESSIONAL_SUMMARY.tagline}
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-center">
            <Link
              href="/cv"
              className="px-4 py-2 text-xs tracking-[0.15em] uppercase transition-all hover:scale-105"
              style={{
                border: `1px solid ${HK.darkPurple}`,
                color: HK.silver,
                background: `${HK.void}cc`,
                borderRadius: '2px 4px 2px 4px',
              }}
            >
              ◇ CV
            </Link>
            <Link
              href="/personal-projects/game-engine"
              className="px-4 py-2 text-xs tracking-[0.15em] uppercase transition-all hover:scale-105"
              style={{
                border: `1px solid ${HK.soul}`,
                color: HK.soul,
                background: `${HK.soulDark}20`,
                borderRadius: '2px 4px 2px 4px',
                boxShadow: `0 0 15px ${HK.soulDark}30`,
              }}
            >
              ◇ Nebulith
            </Link>
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      {/* Current Roles - styled as soul vessels */}
      <section className="relative z-20 py-6 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-8">
            {CURRENT_ROLES.map((role) => (
              <div
                key={role.id}
                className="text-center px-4 py-2"
                style={{
                  background: `${HK.void}80`,
                  border: `1px solid ${HK.darkPurple}`,
                  borderRadius: '4px 8px 4px 8px',
                }}
              >
                <p className="text-xs tracking-[0.15em] uppercase" style={{ color: HK.soul }}>{role.title}</p>
                <p className="text-sm" style={{ color: HK.bone }}>{role.company}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Profession Map - Hollow Knight style bench waypoints */}
      <section className="relative z-20 py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div
            className="relative h-48 overflow-hidden"
            style={{
              background: `linear-gradient(180deg, transparent, ${HK.darkPurple}30)`,
              border: `1px solid ${HK.darkPurple}40`,
              borderRadius: '4px',
            }}
          >
            {/* Connection paths */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="soulLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={HK.soul} stopOpacity="0" />
                  <stop offset="50%" stopColor={HK.soul} stopOpacity="0.4" />
                  <stop offset="100%" stopColor={HK.soul} stopOpacity="0" />
                </linearGradient>
              </defs>
              <line x1="25%" y1="50%" x2="50%" y2="30%" stroke="url(#soulLineGrad)" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="50%" y1="30%" x2="75%" y2="50%" stroke="url(#soulLineGrad)" strokeWidth="1" strokeDasharray="4 4" />
            </svg>
            {professionNodes.map((node) => (
              <BenchWaypoint
                key={node.id}
                {...node}
                isActive={active === node.id}
                onClick={() => setActive(node.id as 'engineer' | 'drummer' | 'fighter')}
              />
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="relative z-20 py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <VoidFrame title="About">
            <p className="text-sm leading-relaxed mb-4" style={{ color: HK.bone }}>{aboutData.bio}</p>
            <div className="flex flex-wrap gap-3">
              {aboutData.quickFacts.map((fact, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-xs"
                  style={{
                    background: `${HK.soul}15`,
                    border: `1px solid ${HK.soul}40`,
                    color: HK.soul,
                    borderRadius: '2px 4px 2px 4px',
                  }}
                >
                  ◇ {fact}
                </span>
              ))}
            </div>
          </VoidFrame>
        </div>
      </section>

      {/* Work Experience */}
      {experience.length > 0 && (
        <section className="relative z-20 py-8 px-6">
          <div className="max-w-4xl mx-auto">
            <VoidFrame title="Work Experience">
              <div className="space-y-4">
                {experience.map((entry) => (
                  <ExperienceCard key={entry.id} entry={entry} />
                ))}
              </div>
            </VoidFrame>
          </div>
        </section>
      )}

      {/* Tech Stack / Skills */}
      <section className="relative z-20 py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <VoidFrame title={active === 'engineer' ? 'Tech Stack' : 'Skills'}>
            {active === 'engineer' ? (
              <TechCloud categories={engineerTech} />
            ) : (
              <SkillsList categories={otherSkills} />
            )}
          </VoidFrame>
        </div>
      </section>

      {/* Projects */}
      <section className="relative z-20 py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <VoidFrame title="Featured Work">
            <div className="grid md:grid-cols-2 gap-4">
              {projects.filter(p => p.featured).slice(0, 6).map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </VoidFrame>
        </div>
      </section>

      {/* Companies (Engineer) / Bands (Drummer) */}
      {active === 'engineer' && (
        <section className="relative z-20 py-8 px-6">
          <div className="max-w-4xl mx-auto">
            <VoidFrame title="Ventures">
              <div className="grid md:grid-cols-3 gap-4">
                {COMPANIES.map((company) => (
                  <CompanyCard key={company.id} company={company} />
                ))}
              </div>
            </VoidFrame>
          </div>
        </section>
      )}

      {active === 'drummer' && (
        <section className="relative z-20 py-8 px-6">
          <div className="max-w-4xl mx-auto">
            <VoidFrame title="Bands">
              <div className="grid md:grid-cols-3 gap-4">
                {BANDS.map((band) => (
                  <BandCard key={band.id} band={band} />
                ))}
              </div>
            </VoidFrame>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="relative z-20 py-12 px-6 text-center">
        <div className="inline-flex items-center gap-4" style={{ color: HK.silver }}>
          <div className="w-12 h-px" style={{ background: HK.darkPurple }} />
          <span className="text-xs tracking-[0.2em]" style={{ fontFamily: '"Cinzel", serif' }}>MMXXVI</span>
          <div className="w-12 h-px" style={{ background: HK.darkPurple }} />
        </div>
      </footer>

      {/* Animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-20px) translateX(5px); }
          50% { transform: translateY(-10px) translateX(-5px); }
          75% { transform: translateY(-30px) translateX(3px); }
        }
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float { animation: float 20s ease-in-out infinite; }
        .animate-fade-in-down { animation: fade-in-down 0.8s ease-out; }
        @keyframes ornamentFloat {
          0%, 100% { transform: translateY(0) translateX(0) rotate(0deg); }
          25% { transform: translateY(-15px) translateX(8px) rotate(5deg); }
          50% { transform: translateY(-8px) translateX(-5px) rotate(-3deg); }
          75% { transform: translateY(-20px) translateX(3px) rotate(3deg); }
        }
        @keyframes slashReveal {
          0% { transform: scaleX(0); opacity: 0; }
          50% { transform: scaleX(1); opacity: 1; }
          100% { transform: scaleX(0); opacity: 0; }
        }
        @keyframes knight-dash {
          0% { transform: translateX(-100px); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateX(calc(100vw + 100px)); opacity: 0; }
        }
        .animate-knight-dash { animation: knight-dash 0.6s ease-out forwards; }
      `}</style>
    </div>
  )
}
