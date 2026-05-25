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

// Arcade cabinet frame border
function ArcadeFrame({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme()

  return (
    <div className="relative">
      {/* Outer frame */}
      <div
        className="absolute inset-0 -m-2"
        style={{
          border: `4px solid ${theme.colors.border}`,
          background: `linear-gradient(135deg, #1a1a2e, #0f0f1a)`,
          boxShadow: `inset 0 0 30px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.5)`,
        }}
      />
      {/* Corner bolts */}
      {['-top-1 -left-1', '-top-1 -right-1', '-bottom-1 -left-1', '-bottom-1 -right-1'].map((pos, i) => (
        <div
          key={i}
          className={`absolute w-4 h-4 z-10 ${pos}`}
          style={{
            background: `radial-gradient(circle at 30% 30%, #4a4a5a, #2a2a3a)`,
            border: `2px solid ${theme.colors.border}`,
            borderRadius: '50%',
            boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.2)',
          }}
        />
      ))}
      <div className="relative z-5">{children}</div>
    </div>
  )
}

// VS badge with flames effect
function VSBadge({ large = false }: { large?: boolean }) {
  const [flash, setFlash] = useState(false)
  const [flames, setFlames] = useState<Array<{ id: number; x: number; delay: number }>>([])

  useEffect(() => {
    // Flash effect
    const interval = setInterval(() => {
      setFlash(true)
      setTimeout(() => setFlash(false), 100)
    }, 2000)

    // Generate flame particles
    setFlames(
      Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: (i - 4) * 10,
        delay: i * 0.1,
      }))
    )

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative">
      {/* Flame particles */}
      {flames.map((flame) => (
        <div
          key={flame.id}
          className="absolute animate-flame"
          style={{
            left: `calc(50% + ${flame.x}px)`,
            bottom: '0',
            width: '6px',
            height: '20px',
            background: `linear-gradient(to top, #ff4400, #ffaa00, transparent)`,
            borderRadius: '50%',
            animationDelay: `${flame.delay}s`,
            filter: 'blur(2px)',
          }}
        />
      ))}
      <div
        className={`relative transition-all duration-100 ${flash ? 'scale-125' : 'scale-100'}`}
        style={{
          fontSize: large ? '4rem' : '2.5rem',
          fontWeight: 'bold',
          color: '#ffd700',
          textShadow: `
            0 0 10px #ffd700,
            0 0 20px #ff6600,
            0 0 40px #ff4400,
            2px 2px 0 #000,
            -2px -2px 0 #000,
            2px -2px 0 #000,
            -2px 2px 0 #000
          `,
          WebkitTextStroke: '1px #000',
        }}
      >
        VS
      </div>
    </div>
  )
}

// Health bar style indicator
function HealthBar({
  label,
  value,
  maxValue = 100,
  color,
  reverse = false,
}: {
  label: string
  value: number
  maxValue?: number
  color: string
  reverse?: boolean
}) {
  const percentage = Math.min((value / maxValue) * 100, 100)

  return (
    <div className={`flex items-center gap-2 ${reverse ? 'flex-row-reverse' : ''}`}>
      <span
        className="text-[10px] font-bold tracking-wider w-16"
        style={{ color, textAlign: reverse ? 'right' : 'left' }}
      >
        {label}
      </span>
      <div
        className="flex-1 h-4 relative"
        style={{
          background: 'linear-gradient(180deg, #1a1a2e, #0a0a1a)',
          border: '2px solid #333',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)',
        }}
      >
        <div
          className="absolute top-0 bottom-0 transition-all duration-500"
          style={{
            left: reverse ? 'auto' : 0,
            right: reverse ? 0 : 'auto',
            width: `${percentage}%`,
            background: `linear-gradient(180deg, ${color}, ${color}88)`,
            boxShadow: `0 0 10px ${color}60`,
          }}
        />
        {/* Segment lines */}
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0 w-px"
            style={{
              left: `${(i + 1) * 10}%`,
              background: 'rgba(0,0,0,0.3)',
            }}
          />
        ))}
      </div>
    </div>
  )
}

// Character portrait with VS screen style
function CharacterPortrait({
  icon,
  name,
  subtitle,
  stats,
  winRecord,
  isSelected,
  onClick,
  side,
}: {
  icon: string
  name: string
  subtitle: string
  stats: { label: string; value: number }[]
  winRecord: { wins: number; losses: number }
  isSelected: boolean
  onClick: () => void
  side: 'left' | 'right'
}) {
  const { theme } = useTheme()

  return (
    <button
      onClick={onClick}
      className={`relative p-4 transition-all duration-300 ${
        isSelected ? 'scale-105 z-10' : 'opacity-70 hover:opacity-100'
      }`}
      style={{
        background: isSelected
          ? `linear-gradient(${side === 'left' ? '135deg' : '-135deg'}, ${theme.colors.accent}40, transparent)`
          : theme.colors.surface,
        border: `3px solid ${isSelected ? theme.colors.accent : theme.colors.border}`,
        clipPath:
          side === 'left'
            ? 'polygon(0 0, 100% 0, 95% 100%, 0 100%)'
            : 'polygon(5% 0, 100% 0, 100% 100%, 0 100%)',
        boxShadow: isSelected ? `0 0 30px ${theme.colors.accent}40` : 'none',
      }}
    >
      {/* Character icon */}
      <div className="text-6xl mb-4">{icon}</div>

      {/* Name plate */}
      <div
        className="py-2 -mx-4 px-4"
        style={{
          background: isSelected
            ? `linear-gradient(90deg, ${theme.colors.accent}, ${theme.colors.accent}cc)`
            : theme.colors.border,
          color: isSelected ? '#000' : theme.colors.text,
        }}
      >
        <div className="text-sm font-bold tracking-wider">{name}</div>
        <div className="text-[10px] opacity-70">{subtitle}</div>
      </div>

      {/* Win/Loss record */}
      <div
        className="mt-2 py-1 text-center"
        style={{ background: 'rgba(0,0,0,0.3)' }}
      >
        <span className="text-[10px] font-bold" style={{ color: '#4ade80' }}>
          W:{winRecord.wins}
        </span>
        <span className="text-[10px] mx-2" style={{ color: theme.colors.textMuted }}>
          /
        </span>
        <span className="text-[10px] font-bold" style={{ color: '#f87171' }}>
          L:{winRecord.losses}
        </span>
      </div>

      {/* Stats bars */}
      <div className="mt-4 space-y-2">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center gap-2">
            <span className="text-[8px] w-12" style={{ color: theme.colors.textMuted }}>
              {stat.label}
            </span>
            <div className="flex-1 h-2 bg-black/50 flex">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 mx-px transition-all"
                  style={{
                    background:
                      i < stat.value ? theme.colors.accent : theme.colors.border,
                    boxShadow: i < stat.value ? `0 0 4px ${theme.colors.accent}` : 'none',
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <div
          className="absolute -top-2 left-1/2 -translate-x-1/2 text-2xl animate-bounce"
          style={{ color: theme.colors.accent, filter: `drop-shadow(0 0 5px ${theme.colors.accent})` }}
        >
          ▼
        </div>
      )}
    </button>
  )
}

// Role/Rank display
function RoleRank({ role }: { role: typeof CURRENT_ROLES[0] }) {
  const { theme } = useTheme()
  const isLeadership = role.type === 'leadership'

  return (
    <div
      className="relative px-4 py-2 text-center"
      style={{
        background: `linear-gradient(180deg, ${isLeadership ? '#ffd70030' : theme.colors.surface}, transparent)`,
        border: `2px solid ${isLeadership ? '#ffd700' : theme.colors.border}`,
        clipPath: 'polygon(10% 0, 90% 0, 100% 50%, 90% 100%, 10% 100%, 0 50%)',
      }}
    >
      {isLeadership && (
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 text-xs" style={{ color: '#ffd700' }}>
          ★
        </div>
      )}
      <div
        className="text-[10px] tracking-widest"
        style={{ color: isLeadership ? '#ffd700' : theme.colors.accent }}
      >
        {role.title.toUpperCase()}
      </div>
      <div className="text-xs font-bold" style={{ color: theme.colors.text }}>
        {role.company}
      </div>
    </div>
  )
}

// Special move / tech skill
function SpecialMove({ name, category }: { name: string; category: string }) {
  const { theme } = useTheme()
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="relative px-2 py-1 cursor-default transition-all duration-200"
      style={{
        background: isHovered
          ? `linear-gradient(90deg, ${theme.colors.accent}30, transparent)`
          : `${theme.colors.surface}80`,
        border: `1px solid ${isHovered ? theme.colors.accent : theme.colors.border}40`,
        transform: isHovered ? 'translateX(4px)' : 'none',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="text-xs" style={{ color: theme.colors.text }}>
        {name}
      </span>
      {isHovered && (
        <span
          className="absolute right-2 text-[8px] tracking-wider animate-pulse"
          style={{ color: theme.colors.accent }}
        >
          ►► {category}
        </span>
      )}
    </div>
  )
}

// Team affiliate card
function TeamCard({ company }: { company: typeof COMPANIES[0] }) {
  const { theme } = useTheme()

  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-3 transition-all duration-200 hover:scale-105 group"
      style={{
        background: `linear-gradient(135deg, ${theme.colors.surface}, ${theme.colors.background})`,
        border: `2px solid ${theme.colors.border}`,
        clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)',
      }}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{company.icon}</span>
        <div>
          <h4
            className="text-sm font-bold group-hover:text-cyan-400 transition-colors"
            style={{ color: theme.colors.text }}
          >
            {company.name}
          </h4>
          <p className="text-[10px]" style={{ color: theme.colors.accent }}>
            {company.tagline}
          </p>
        </div>
      </div>
      <p className="text-[10px] mt-2" style={{ color: theme.colors.textMuted }}>
        {company.description}
      </p>
      <div
        className="absolute bottom-0 right-0 w-4 h-4"
        style={{
          background: theme.colors.accent,
          clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
        }}
      />
    </a>
  )
}

// Band card for drummer mode
function BandCard({ band }: { band: typeof BANDS[0] }) {
  const { theme } = useTheme()

  const content = (
    <div
      className="relative p-3 transition-all duration-200 hover:scale-105 group"
      style={{
        background: `linear-gradient(135deg, ${theme.colors.surface}, ${theme.colors.background})`,
        border: `2px solid ${theme.colors.border}`,
        clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)',
      }}
    >
      <div className="flex justify-between items-start">
        <h4
          className="text-sm font-bold group-hover:text-purple-400 transition-colors"
          style={{ color: theme.colors.text }}
        >
          {band.name}
        </h4>
        {band.active && (
          <span
            className="text-[8px] px-2 py-0.5 font-bold"
            style={{ background: '#4ade80', color: '#000' }}
          >
            ACTIVE
          </span>
        )}
      </div>
      <p className="text-[10px] mt-1" style={{ color: theme.colors.accent }}>
        {band.genre} • {band.role}
      </p>
      <p className="text-[10px] mt-2" style={{ color: theme.colors.textMuted }}>
        {band.description}
      </p>
      {!band.url && (
        <p className="text-[8px] mt-2 italic" style={{ color: theme.colors.textMuted }}>
          Website coming soon
        </p>
      )}
      <div
        className="absolute bottom-0 right-0 w-4 h-4"
        style={{
          background: '#9966cc',
          clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
        }}
      />
    </div>
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

// Work experience card
function ExperienceCard({ entry }: { entry: typeof EXPERIENCE_DATA[0] }) {
  const { theme } = useTheme()
  const endDisplay = entry.endDate ? new Date(entry.endDate).getFullYear() : 'Present'
  const startDisplay = new Date(entry.startDate).getFullYear()

  return (
    <div
      className="relative p-4 group transition-all duration-200 hover:scale-[1.02]"
      style={{
        background: `linear-gradient(135deg, ${theme.colors.surface}, ${theme.colors.background})`,
        border: `2px solid ${theme.colors.border}`,
        clipPath:
          'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)',
      }}
    >
      {/* Corner cut decoration */}
      <div
        className="absolute bottom-0 right-0 w-4 h-4"
        style={{
          background: theme.colors.accent,
          clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
        }}
      />

      <div className="flex justify-between items-start mb-2">
        <div>
          <span className="text-sm font-bold" style={{ color: theme.colors.text }}>
            {entry.title}
          </span>
          <p className="text-[10px]" style={{ color: theme.colors.accent }}>
            {entry.organization}
          </p>
        </div>
        <span
          className="text-[10px] px-2 py-0.5 font-bold"
          style={{
            background: !entry.endDate ? '#4ade80' : theme.colors.border,
            color: !entry.endDate ? '#000' : theme.colors.text,
          }}
        >
          {startDisplay} - {endDisplay}
        </span>
      </div>
      <p className="text-[10px] mb-2" style={{ color: theme.colors.textMuted }}>
        {entry.description}
      </p>
      {entry.highlights && entry.highlights.length > 0 && (
        <ul className="space-y-1 mt-2">
          {entry.highlights.map((highlight, i) => (
            <li key={i} className="text-[10px] flex items-start gap-2" style={{ color: theme.colors.text }}>
              <span style={{ color: theme.colors.accent }}>►</span>
              {highlight}
            </li>
          ))}
        </ul>
      )}
      <div className="flex flex-wrap gap-1 mt-3">
        {entry.skills.slice(0, 4).map((skill) => (
          <span
            key={skill}
            className="text-[8px] px-1 py-0.5"
            style={{
              background: `${theme.colors.accent}20`,
              color: theme.colors.accent,
            }}
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Hover effect */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent, ${theme.colors.accent}20, transparent)`,
        }}
      />
    </div>
  )
}

// Fight card / project card
function FightCard({ project }: { project: typeof PROJECTS_DATA[0] }) {
  const { theme } = useTheme()

  return (
    <div
      className="relative p-4 group cursor-pointer transition-all duration-200 hover:scale-[1.02]"
      style={{
        background: `linear-gradient(135deg, ${theme.colors.surface}, ${theme.colors.background})`,
        border: `2px solid ${project.featured ? '#ffd700' : theme.colors.border}`,
        clipPath:
          'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)',
        boxShadow: project.featured ? '0 0 20px rgba(255, 215, 0, 0.2)' : 'none',
      }}
    >
      {/* Corner cut decoration */}
      <div
        className="absolute bottom-0 right-0 w-4 h-4"
        style={{
          background: project.featured ? '#ffd700' : theme.colors.accent,
          clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
        }}
      />

      <div className="flex justify-between items-start mb-2">
        <span className="text-sm" style={{ color: theme.colors.text }}>
          {project.name}
        </span>
        {project.featured && (
          <span
            className="text-[8px] px-2 py-0.5 font-bold"
            style={{ background: '#ffd700', color: '#000' }}
          >
            CHAMPION
          </span>
        )}
      </div>
      <p className="text-[10px]" style={{ color: theme.colors.textMuted }}>
        {project.tagline}
      </p>
      {project.impact && (
        <p className="text-[10px] mt-2 italic" style={{ color: theme.colors.accent }}>
          ► {project.impact}
        </p>
      )}
      <div className="flex flex-wrap gap-1 mt-3">
        {project.techStack.slice(0, 4).map((tech) => (
          <span
            key={tech}
            className="text-[8px] px-1 py-0.5"
            style={{
              background: `${theme.colors.accent}20`,
              color: theme.colors.accent,
            }}
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Hover effect */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent, ${theme.colors.accent}20, transparent)`,
        }}
      />
    </div>
  )
}

export default function FighterSelectTheme() {
  const { theme } = useTheme()
  const { active, setActive, config } = useProfession()
  const [mounted, setMounted] = useState(false)
  const [showReady, setShowReady] = useState(false)

  const aboutData = ABOUT_DATA[active]
  const engineerTech = getEngineerSkills()
  const otherSkills = getSkillsByProfession(active)
  const projects = PROJECTS_DATA.filter((p) => p.professions.includes(active) || p.featured)
  const experience = filterExperienceByProfession(EXPERIENCE_DATA, active)

  useEffect(() => {
    setMounted(true)
    // Show "READY" after selection
    const timeout = setTimeout(() => setShowReady(true), 500)
    return () => clearTimeout(timeout)
  }, [active])

  if (!mounted) return null

  const characters = [
    {
      id: 'engineer',
      icon: '💻',
      name: 'THE ENGINEER',
      subtitle: 'Code Warrior',
      stats: [
        { label: 'CODE', value: 9 },
        { label: 'INFRA', value: 8 },
        { label: 'DEBUG', value: 10 },
      ],
      winRecord: { wins: 999, losses: 0 },
    },
    {
      id: 'drummer',
      icon: '🥁',
      name: 'THE MUSICIAN',
      subtitle: 'Rhythm Master',
      stats: [
        { label: 'TEMPO', value: 10 },
        { label: 'GROOVE', value: 9 },
        { label: 'POWER', value: 8 },
      ],
      winRecord: { wins: 15, losses: 0 },
    },
    {
      id: 'fighter',
      icon: '🥋',
      name: 'THE FIGHTER',
      subtitle: 'Combat Expert',
      stats: [
        { label: 'STRIKE', value: 9 },
        { label: 'GRAPPLE', value: 8 },
        { label: 'SPIRIT', value: 10 },
      ],
      winRecord: { wins: 6, losses: 0 },
    },
  ]

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: `linear-gradient(180deg, ${theme.colors.background}, #0a1530, ${theme.colors.background})`,
        fontFamily: '"Impact", "Arial Black", sans-serif',
      }}
    >
      {/* Animated background stripes */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="absolute h-1 animate-stripe"
            style={{
              top: `${i * 10 + 5}%`,
              left: '-100%',
              right: '-100%',
              background: `linear-gradient(90deg, transparent, ${theme.colors.accent}20, transparent)`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>

      {/* Scanlines overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-[100] opacity-10"
        style={{
          background:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
        }}
      />

      {/* Header with arcade frame */}
      <header className="relative z-30 p-6">
        <div className="max-w-6xl mx-auto">
          <ArcadeFrame>
            <div className="flex justify-between items-start p-4">
              <div>
                <h1
                  className="text-3xl tracking-wider"
                  style={{
                    color: theme.colors.accent,
                    textShadow: `2px 2px 0 ${theme.colors.background}, 4px 4px 0 #000`,
                  }}
                >
                  SELECT YOUR FIGHTER
                </h1>
                <p className="text-sm mt-2" style={{ color: theme.colors.text }}>
                  {PROFESSIONAL_SUMMARY.headline}
                </p>
                <p
                  className="text-xs mt-1 italic"
                  style={{ color: theme.colors.accent }}
                >
                  {PROFESSIONAL_SUMMARY.tagline}
                </p>
              </div>

              <div className="flex gap-3 items-center">
                <Link
                  href="/cv"
                  className="px-4 py-2 text-sm tracking-wider transition-all hover:scale-105"
                  style={{
                    background: theme.colors.surface,
                    border: `3px solid ${theme.colors.border}`,
                    color: theme.colors.text,
                    clipPath: 'polygon(10% 0, 100% 0, 100% 100%, 0 100%)',
                  }}
                >
                  CV
                </Link>
                <Link
                  href="/personal-projects/game-engine"
                  className="px-4 py-2 text-sm tracking-wider transition-all hover:scale-105"
                  style={{
                    background: theme.colors.accent,
                    color: '#000',
                    clipPath: 'polygon(0 0, 100% 0, 90% 100%, 0 100%)',
                  }}
                >
                  PLAY
                </Link>
                <ThemeSwitcher />
              </div>
            </div>
          </ArcadeFrame>
        </div>
      </header>

      {/* Current Roles - Rank Display */}
      <section className="relative z-20 py-4 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4">
            {CURRENT_ROLES.map((role) => (
              <RoleRank key={role.id} role={role} />
            ))}
          </div>
        </div>
      </section>

      {/* Character select area */}
      <section className="relative z-20 py-8 px-6">
        <div className="max-w-6xl mx-auto">
          {/* VS Screen layout */}
          <div className="flex items-center justify-center gap-8 mb-8">
            {characters.map((char, index) => (
              <div key={char.id} className="flex items-center">
                <CharacterPortrait
                  icon={char.icon}
                  name={char.name}
                  subtitle={char.subtitle}
                  stats={char.stats}
                  winRecord={char.winRecord}
                  isSelected={active === char.id}
                  onClick={() => setActive(char.id as 'engineer' | 'drummer' | 'fighter')}
                  side={index === 0 ? 'left' : index === 2 ? 'right' : 'left'}
                />
                {index < characters.length - 1 && (
                  <div className="mx-4">
                    <VSBadge />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Health bars */}
          <div className="max-w-2xl mx-auto mb-8 space-y-2">
            <HealthBar
              label="EXP"
              value={active === 'engineer' ? 95 : active === 'drummer' ? 80 : 60}
              color={theme.colors.accent}
            />
            <HealthBar
              label="SKILL"
              value={active === 'engineer' ? 90 : active === 'drummer' ? 85 : 70}
              color="#ffd700"
            />
          </div>

          {/* Ready banner */}
          {showReady && (
            <div
              className="text-center py-4 mb-8"
              style={{
                background: `linear-gradient(90deg, transparent, ${theme.colors.accent}40, transparent)`,
              }}
            >
              <span
                className="text-4xl font-bold tracking-widest animate-pulse"
                style={{
                  color: theme.colors.accent,
                  textShadow: `0 0 20px ${theme.colors.accent}, 0 0 40px ${theme.colors.accent}`,
                }}
              >
                {config.title.toUpperCase()} - READY!
              </span>
            </div>
          )}

          {/* Bio panel */}
          <div
            className="p-6 mb-8"
            style={{
              background: `linear-gradient(135deg, ${theme.colors.surface}, ${theme.colors.background})`,
              border: `3px solid ${theme.colors.border}`,
              clipPath:
                'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)',
            }}
          >
            <h2
              className="text-xl mb-4 flex items-center gap-2"
              style={{ color: theme.colors.accent }}
            >
              <span>►</span> ABOUT
            </h2>
            <p
              className="text-sm leading-relaxed mb-4"
              style={{ color: theme.colors.text, fontFamily: 'sans-serif' }}
            >
              {aboutData.bio}
            </p>
            <div className="flex flex-wrap gap-2">
              {aboutData.quickFacts.map((fact, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-xs font-bold"
                  style={{
                    background: theme.colors.accent,
                    color: '#000',
                    clipPath: 'polygon(5% 0, 100% 0, 95% 100%, 0 100%)',
                  }}
                >
                  {fact}
                </span>
              ))}
            </div>
          </div>

          {/* Work Experience section */}
          {experience.length > 0 && (
            <div
              className="p-6 mb-8"
              style={{
                background: `linear-gradient(135deg, ${theme.colors.surface}, ${theme.colors.background})`,
                border: `3px solid ${theme.colors.border}`,
                clipPath:
                  'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)',
              }}
            >
              <h2
                className="text-xl mb-4 flex items-center gap-2"
                style={{ color: theme.colors.accent }}
              >
                <span>►►</span> WORK EXPERIENCE
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {experience.map((entry) => (
                  <ExperienceCard key={entry.id} entry={entry} />
                ))}
              </div>
            </div>
          )}

          {/* Skills/Tech section */}
          <div
            className="p-6 mb-8"
            style={{
              background: theme.colors.surface,
              border: `3px solid ${theme.colors.border}`,
            }}
          >
            <h2 className="text-xl mb-4 flex items-center gap-2" style={{ color: theme.colors.accent }}>
              <span>►►►</span> {active === 'engineer' ? 'TECH STACK' : 'SKILLS'}
            </h2>

            {active === 'engineer' ? (
              // Engineer: Show all 50+ technologies as "special moves"
              <div className="space-y-6">
                {engineerTech.slice(0, 6).map((category) => (
                  <div key={category.name}>
                    <h3
                      className="text-sm mb-3 flex items-center gap-2"
                      style={{ color: theme.colors.text }}
                    >
                      <span>{category.icon}</span>
                      {category.name.toUpperCase()}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-1">
                      {category.items.map((tech) => (
                        <SpecialMove key={tech} name={tech} category={category.name} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Drummer/Fighter: Show skills with proficiency bars
              <div className="grid md:grid-cols-3 gap-4">
                {otherSkills.map((category) => (
                  <div key={category.name}>
                    <h3 className="text-sm mb-2" style={{ color: theme.colors.text }}>
                      <span className="mr-2">{category.icon}</span>
                      {category.name}
                    </h3>
                    {category.skills.map((skill) => (
                      <div key={skill.name} className="flex items-center gap-2 mb-1">
                        <span
                          className="text-xs flex-1"
                          style={{ color: theme.colors.textMuted }}
                        >
                          {skill.name}
                        </span>
                        <div className="w-20 h-3 bg-black/30 flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <div
                              key={i}
                              className="flex-1 mx-px"
                              style={{
                                background:
                                  i < skill.proficiency
                                    ? theme.colors.accent
                                    : theme.colors.border,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Affiliated Teams / Companies (Engineer) */}
          {active === 'engineer' && (
            <div
              className="p-6 mb-8"
              style={{
                background: theme.colors.surface,
                border: `3px solid ${theme.colors.border}`,
              }}
            >
              <h2
                className="text-xl mb-4 flex items-center gap-2"
                style={{ color: theme.colors.accent }}
              >
                <span>►►►</span> VENTURES
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                {COMPANIES.map((company) => (
                  <TeamCard key={company.id} company={company} />
                ))}
              </div>
            </div>
          )}

          {/* Bands (Drummer) */}
          {active === 'drummer' && (
            <div
              className="p-6 mb-8"
              style={{
                background: theme.colors.surface,
                border: `3px solid ${theme.colors.border}`,
              }}
            >
              <h2
                className="text-xl mb-4 flex items-center gap-2"
                style={{ color: '#9966cc' }}
              >
                <span>♪♪♪</span> BANDS
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                {BANDS.map((band) => (
                  <BandCard key={band.id} band={band} />
                ))}
              </div>
            </div>
          )}

          {/* Projects / Featured Work */}
          <div>
            <h2 className="text-xl mb-4" style={{ color: theme.colors.accent }}>
              FEATURED WORK
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {projects.slice(0, 4).map((project) => (
                <FightCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-20 py-8 text-center">
        <p className="text-xs tracking-widest" style={{ color: theme.colors.textMuted }}>
          ▸ PRESS START TO CONTINUE ◂
        </p>
        <p className="text-xs mt-2" style={{ color: theme.colors.accent }}>
          MMXXVI ALEXANDER PULIDO
        </p>
        <div
          className="mt-4 inline-flex items-center gap-2 px-4 py-1"
          style={{ background: 'rgba(0,0,0,0.5)', border: `1px solid ${theme.colors.border}` }}
        >
          <span className="text-[8px]" style={{ color: theme.colors.textMuted }}>
            INSERT COIN
          </span>
          <span className="animate-blink text-xs" style={{ color: '#ffd700' }}>
            ●
          </span>
        </div>
      </footer>

      {/* Animations */}
      <style jsx global>{`
        @keyframes stripe {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        @keyframes flame {
          0%,
          100% {
            transform: translateY(0) scaleY(1);
            opacity: 0.8;
          }
          50% {
            transform: translateY(-10px) scaleY(1.2);
            opacity: 1;
          }
        }
        @keyframes blink {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }
        .animate-stripe {
          animation: stripe 3s linear infinite;
        }
        .animate-flame {
          animation: flame 0.5s ease-in-out infinite;
        }
        .animate-blink {
          animation: blink 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
