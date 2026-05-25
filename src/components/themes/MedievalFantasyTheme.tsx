'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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

// Warcraft colors - Alliance style
const ALLIANCE_GOLD = '#ffd100'
const ALLIANCE_BLUE = '#0066cc'
const PARCHMENT = '#e8dcc4'
const PARCHMENT_DARK = '#c4b8a0'
const STONE_BORDER = '#6b5a4a'
const MANA_BLUE = '#4488ff'
const METAL_GOLD = '#c9a227'

// Warcraft-styled Alexander as champion unit
function ChampionAlexander({
  size = 60,
  direction = 'right',
}: {
  size?: number
  direction?: 'left' | 'right'
}) {
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => setFrame(f => (f + 1) % 2), 200)
    return () => clearInterval(interval)
  }, [])

  const sprite = direction === 'right'
    ? (frame === 0 ? '/assets/sprites/run_right.png' : '/assets/sprites/run_right_1.png')
    : (frame === 0 ? '/assets/sprites/run_left.png' : '/assets/sprites/run_left_1.png')

  return (
    <div className="relative" style={{ width: size, height: size * 1.2 }}>
      <Image
        src={sprite}
        alt="Champion"
        fill
        className="object-contain"
        style={{
          filter: 'brightness(1.1) contrast(1.15) sepia(0.2) hue-rotate(-5deg)',
        }}
      />
      {/* Shield glow effect */}
      <div
        className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-2 rounded-full"
        style={{
          background: `radial-gradient(ellipse, ${ALLIANCE_BLUE}60 0%, transparent 70%)`,
          filter: 'blur(2px)',
        }}
      />
    </div>
  )
}

// Floating icons based on profession - Warcraft unit icons style
function WarBanners({ profession }: { profession: 'engineer' | 'drummer' | 'fighter' }) {
  const iconsByProfession = {
    engineer: [
      { emoji: '⚔️', x: 4, y: 12, size: 26 },
      { emoji: '🛡️', x: 94, y: 20, size: 28 },
      { emoji: '💻', x: 6, y: 65, size: 24 },
      { emoji: '⚙️', x: 92, y: 75, size: 26 },
      { emoji: '🏰', x: 12, y: 40, size: 28 },
      { emoji: '📜', x: 88, y: 48, size: 24 },
    ],
    drummer: [
      { emoji: '🥁', x: 4, y: 18, size: 30 },
      { emoji: '⚔️', x: 94, y: 28, size: 26 },
      { emoji: '🎵', x: 8, y: 58, size: 24 },
      { emoji: '🛡️', x: 90, y: 68, size: 28 },
      { emoji: '🎤', x: 5, y: 82, size: 26 },
      { emoji: '🏰', x: 93, y: 12, size: 28 },
    ],
    fighter: [
      { emoji: '⚔️', x: 4, y: 16, size: 30 },
      { emoji: '🛡️', x: 94, y: 22, size: 28 },
      { emoji: '🥊', x: 6, y: 62, size: 26 },
      { emoji: '💪', x: 92, y: 72, size: 24 },
      { emoji: '🔥', x: 8, y: 42, size: 26 },
      { emoji: '🏆', x: 90, y: 88, size: 28 },
    ],
  }

  const icons = iconsByProfession[profession]

  return (
    <div className="fixed inset-0 pointer-events-none z-[4] overflow-hidden">
      {icons.map((icon, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${icon.x}%`,
            top: `${icon.y}%`,
            fontSize: icon.size,
            filter: `drop-shadow(0 0 8px ${ALLIANCE_GOLD}60)`,
            opacity: 0.5,
            animation: `bannerWave ${10 + i * 1.5}s ease-in-out infinite`,
            animationDelay: `${-i * 1.2}s`,
          }}
        >
          {icon.emoji}
        </div>
      ))}
      <style jsx>{`
        @keyframes bannerWave {
          0%, 100% { transform: translateY(0) rotate(-3deg); }
          50% { transform: translateY(-8px) rotate(3deg); }
        }
      `}</style>
    </div>
  )
}

// Scroll reveal with sword slash animation
function BattleReveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const hasTriggered = useInViewTrigger(ref, { threshold: 0.15 })
  const [phase, setPhase] = useState<'hidden' | 'clash' | 'revealed'>('hidden')

  useEffect(() => {
    if (hasTriggered && phase === 'hidden') {
      const timer = setTimeout(() => {
        setPhase('clash')
        setTimeout(() => setPhase('revealed'), 500)
      }, delay)
      return () => clearTimeout(timer)
    }
  }, [hasTriggered, phase, delay])

  return (
    <div ref={ref} className="relative overflow-hidden">
      {phase === 'clash' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div
            className="absolute w-full h-1"
            style={{
              background: `linear-gradient(90deg, transparent, ${ALLIANCE_GOLD}, transparent)`,
              animation: 'swordSlash 0.4s ease-out forwards',
              boxShadow: `0 0 20px ${ALLIANCE_GOLD}`,
            }}
          />
          <div className="absolute text-5xl" style={{ animation: 'swordIcon 0.4s ease-out forwards' }}>⚔️</div>
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
      <style jsx>{`
        @keyframes swordSlash {
          0% { transform: scaleX(0) rotate(-5deg); opacity: 0; }
          50% { transform: scaleX(1.2) rotate(0deg); opacity: 1; }
          100% { transform: scaleX(0) rotate(5deg); opacity: 0; }
        }
        @keyframes swordIcon {
          0% { transform: scale(0) rotate(-180deg); opacity: 0; }
          50% { transform: scale(1.5) rotate(0deg); opacity: 1; }
          100% { transform: scale(0) rotate(180deg); opacity: 0; }
        }
      `}</style>
    </div>
  )
}

// Warcraft-style stone/metal framed panel
function StoneFrame({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="relative">
      {/* Corner ornaments - metal rivets style */}
      {['-top-2 -left-2', '-top-2 -right-2', '-bottom-2 -left-2', '-bottom-2 -right-2'].map((pos, i) => (
        <div
          key={i}
          className={`absolute w-6 h-6 ${pos} z-10`}
          style={{
            background: `radial-gradient(circle at 30% 30%, ${ALLIANCE_GOLD}, ${METAL_GOLD})`,
            borderRadius: '50%',
            boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.3), inset 0 -2px 0 rgba(0,0,0,0.4)',
          }}
        />
      ))}

      {/* Title banner */}
      <div
        className="absolute -top-5 left-1/2 -translate-x-1/2 px-8 py-2 z-10"
        style={{
          background: `linear-gradient(180deg, #2a2520, #1a1510)`,
          border: `3px solid ${ALLIANCE_GOLD}`,
          boxShadow: `0 0 15px ${ALLIANCE_GOLD}30, inset 0 1px 0 rgba(255,255,255,0.1)`,
        }}
      >
        <h2
          className="text-sm tracking-[0.25em] uppercase font-bold"
          style={{
            color: ALLIANCE_GOLD,
            textShadow: `0 0 10px ${ALLIANCE_GOLD}60`,
          }}
        >
          {title}
        </h2>
      </div>

      <div
        className="pt-10 pb-6 px-6"
        style={{
          background: `linear-gradient(180deg, #252015 0%, #1a1510 100%)`,
          border: `4px solid ${STONE_BORDER}`,
          boxShadow: `inset 0 0 30px rgba(0,0,0,0.5), 0 0 20px rgba(0,0,0,0.3)`,
        }}
      >
        {/* Parchment inner texture */}
        <div
          className="absolute inset-4 pointer-events-none opacity-5"
          style={{
            background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23${PARCHMENT.slice(1)}' width='100' height='100'/%3E%3C/svg%3E")`,
          }}
        />
        {children}
      </div>
    </div>
  )
}

// Resource bar component (like health/mana bars)
function ResourceBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const percent = (value / max) * 100
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs w-16 text-right" style={{ color: PARCHMENT_DARK }}>{label}</span>
      <div
        className="flex-1 h-4 relative overflow-hidden"
        style={{
          background: '#1a1510',
          border: `2px solid ${STONE_BORDER}`,
        }}
      >
        <div
          className="h-full transition-all duration-500"
          style={{
            width: `${percent}%`,
            background: `linear-gradient(180deg, ${color}, ${color}99)`,
            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.3)`,
          }}
        />
        <span
          className="absolute inset-0 flex items-center justify-center text-[10px] font-bold"
          style={{ color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
        >
          {value}/{max}
        </span>
      </div>
    </div>
  )
}

// Tech stack as unit abilities
function TechAbilities({ categories }: { categories: ReturnType<typeof getEngineerSkills> }) {
  return (
    <div className="space-y-6">
      {categories.slice(0, 5).map((category) => (
        <div key={category.name}>
          <h3 className="text-xs tracking-wider mb-3 flex items-center gap-2 font-bold" style={{ color: ALLIANCE_GOLD }}>
            <span>{category.icon}</span>
            {category.name.toUpperCase()}
          </h3>
          <div className="flex flex-wrap gap-2">
            {category.items.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1.5 text-xs transition-all hover:scale-105 cursor-default font-bold"
                style={{
                  background: `linear-gradient(180deg, ${ALLIANCE_BLUE}40, ${ALLIANCE_BLUE}20)`,
                  border: `2px solid ${ALLIANCE_GOLD}80`,
                  color: PARCHMENT,
                  boxShadow: `inset 0 1px 0 rgba(255,255,255,0.1), 0 2px 4px rgba(0,0,0,0.3)`,
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

// Skills list for drummer/fighter
function SkillsList({ categories }: { categories: ReturnType<typeof getSkillsByProfession> }) {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {categories.map((category) => (
        <div key={category.name}>
          <h3 className="text-xs tracking-wider mb-3 flex items-center gap-2 font-bold" style={{ color: ALLIANCE_GOLD }}>
            <span>{category.icon}</span>
            {category.name.toUpperCase()}
          </h3>
          <ul className="space-y-2">
            {category.skills.map((skill) => (
              <li key={skill.name} className="text-sm flex items-center gap-2" style={{ color: PARCHMENT }}>
                <span style={{ color: ALLIANCE_GOLD }}>⚔</span>
                {skill.name}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

// Work Experience card
function ExperienceCard({ entry }: { entry: typeof EXPERIENCE_DATA[0] }) {
  const endDisplay = entry.endDate ? new Date(entry.endDate).getFullYear() : 'Present'
  const startDisplay = new Date(entry.startDate).getFullYear()

  return (
    <div
      className="p-4"
      style={{
        background: `linear-gradient(135deg, #252015, #1a1510)`,
        border: `2px solid ${STONE_BORDER}`,
      }}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="text-sm font-bold" style={{ color: PARCHMENT }}>{entry.title}</h4>
          <p className="text-xs" style={{ color: ALLIANCE_GOLD }}>{entry.organization}</p>
        </div>
        <span className="text-[10px]" style={{ color: PARCHMENT_DARK }}>
          {startDisplay} - {endDisplay}
        </span>
      </div>
      <p className="text-xs mb-2" style={{ color: PARCHMENT_DARK }}>{entry.description}</p>
      {entry.highlights && entry.highlights.length > 0 && (
        <ul className="space-y-1">
          {entry.highlights.map((highlight, i) => (
            <li key={i} className="text-xs flex items-start gap-2" style={{ color: PARCHMENT }}>
              <span style={{ color: ALLIANCE_GOLD }}>•</span>
              {highlight}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// Project card as mission briefing
function MissionCard({ project }: { project: typeof PROJECTS_DATA[0] }) {
  return (
    <div
      className="p-4 transition-all hover:scale-[1.02] cursor-pointer group"
      style={{
        background: `linear-gradient(135deg, #252015, #1a1510)`,
        border: `2px solid ${project.featured ? ALLIANCE_GOLD : STONE_BORDER}`,
        boxShadow: project.featured ? `0 0 20px ${ALLIANCE_GOLD}30` : '0 4px 8px rgba(0,0,0,0.3)',
      }}
    >
      {project.featured && (
        <span className="text-[10px] tracking-wider font-bold" style={{ color: ALLIANCE_GOLD }}>⭐ LEGENDARY</span>
      )}
      <h4 className="text-sm mt-1 font-bold group-hover:text-yellow-300 transition-colors" style={{ color: PARCHMENT }}>
        {project.name}
      </h4>
      <p className="text-xs mt-2" style={{ color: PARCHMENT_DARK }}>{project.tagline}</p>
      {project.impact && (
        <p className="text-xs mt-2 italic font-bold" style={{ color: ALLIANCE_GOLD }}>⚔ {project.impact}</p>
      )}
      <div className="flex flex-wrap gap-1 mt-3">
        {project.techStack.slice(0, 4).map((tech) => (
          <span key={tech} className="text-[8px] px-1.5 py-0.5 font-bold" style={{ background: `${ALLIANCE_BLUE}40`, color: MANA_BLUE }}>
            {tech}
          </span>
        ))}
      </div>
    </div>
  )
}

// Company card
function OutpostCard({ company }: { company: typeof COMPANIES[0] }) {
  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 transition-all hover:scale-[1.02] group"
      style={{
        background: `linear-gradient(135deg, #252015, #1a1510)`,
        border: `2px solid ${STONE_BORDER}`,
      }}
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{company.icon}</span>
        <div>
          <h4 className="text-sm font-bold group-hover:text-yellow-300 transition-colors" style={{ color: PARCHMENT }}>
            {company.name}
          </h4>
          <p className="text-[10px]" style={{ color: ALLIANCE_GOLD }}>{company.tagline}</p>
        </div>
      </div>
      <p className="text-xs" style={{ color: PARCHMENT_DARK }}>{company.description}</p>
    </a>
  )
}

// Band card
function GuildCard({ band }: { band: typeof BANDS[0] }) {
  const content = (
    <div
      className="p-4 transition-all hover:scale-[1.02] group"
      style={{
        background: `linear-gradient(135deg, #252015, #1a1510)`,
        border: `2px solid ${STONE_BORDER}`,
      }}
    >
      <h4 className="text-sm font-bold group-hover:text-yellow-300 transition-colors" style={{ color: PARCHMENT }}>
        {band.name}
      </h4>
      <p className="text-[10px] mt-1" style={{ color: ALLIANCE_GOLD }}>{band.genre} • {band.role}</p>
      <p className="text-xs mt-2" style={{ color: PARCHMENT_DARK }}>{band.description}</p>
    </div>
  )

  if (band.url) {
    return <a href={band.url} target="_blank" rel="noopener noreferrer" className="block">{content}</a>
  }
  return content
}

// Profession selector as unit selection
function UnitSelector({
  active,
  onSelect,
}: {
  active: 'engineer' | 'drummer' | 'fighter'
  onSelect: (p: 'engineer' | 'drummer' | 'fighter') => void
}) {
  const units = [
    { id: 'engineer', icon: '⚙️', label: 'Architect', desc: 'Builder of systems' },
    { id: 'drummer', icon: '🥁', label: 'Bard', desc: 'Master of rhythm' },
    { id: 'fighter', icon: '⚔️', label: 'Champion', desc: 'Martial warrior' },
  ] as const

  return (
    <div className="flex justify-center gap-6 py-8">
      {units.map((unit) => (
        <button
          key={unit.id}
          onClick={() => onSelect(unit.id)}
          className="relative group"
        >
          <div
            className={`w-28 h-32 flex flex-col items-center justify-center transition-all duration-300 ${
              active === unit.id ? 'scale-105' : 'hover:scale-102'
            }`}
            style={{
              background: active === unit.id
                ? `linear-gradient(180deg, ${ALLIANCE_BLUE}40, #1a1510)`
                : 'linear-gradient(180deg, #252015, #1a1510)',
              border: `3px solid ${active === unit.id ? ALLIANCE_GOLD : STONE_BORDER}`,
              boxShadow: active === unit.id
                ? `0 0 25px ${ALLIANCE_GOLD}40, inset 0 0 15px ${ALLIANCE_BLUE}20`
                : '0 4px 8px rgba(0,0,0,0.3)',
            }}
          >
            <span className="text-4xl mb-2">{unit.icon}</span>
            <span
              className="text-sm font-bold tracking-wide"
              style={{ color: active === unit.id ? ALLIANCE_GOLD : PARCHMENT_DARK }}
            >
              {unit.label}
            </span>
            <span className="text-[9px] mt-1" style={{ color: PARCHMENT_DARK }}>
              {unit.desc}
            </span>
          </div>
          {active === unit.id && (
            <div
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45"
              style={{ background: ALLIANCE_GOLD }}
            />
          )}
        </button>
      ))}
    </div>
  )
}

export default function MedievalFantasyTheme() {
  useTheme() // Theme context for consistency
  const { active, setActive } = useProfession()
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

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: `linear-gradient(180deg, #0a0805 0%, #151210 50%, #0a0805 100%)`,
        fontFamily: '"Palatino Linotype", "Book Antiqua", Palatino, serif',
      }}
    >
      {/* Stone texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 20%, ${STONE_BORDER}40, transparent 30%), radial-gradient(circle at 80% 80%, ${STONE_BORDER}40, transparent 30%)`,
        }}
      />

      {/* Floating profession icons */}
      <WarBanners profession={active} />

      {/* Top banner */}
      <div
        className="fixed top-0 left-0 right-0 h-2 z-30"
        style={{
          background: `linear-gradient(90deg, transparent, ${ALLIANCE_GOLD}, transparent)`,
        }}
      />

      {/* Champion unit running */}
      <div className="fixed top-16 z-[6] pointer-events-none" style={{ animation: 'marchAcross 25s linear infinite' }}>
        <ChampionAlexander size={45} direction="right" />
      </div>
      <style jsx global>{`
        @keyframes marchAcross {
          0% { left: -80px; }
          100% { left: calc(100% + 80px); }
        }
      `}</style>

      {/* Header */}
      <header className="relative z-30 p-6">
        <div className="max-w-6xl mx-auto flex justify-between items-start">
          <div>
            <h1
              className="text-4xl font-bold tracking-wide"
              style={{
                color: ALLIANCE_GOLD,
                textShadow: `2px 2px 0 #000, 0 0 20px ${ALLIANCE_GOLD}60`,
              }}
            >
              ALEXANDER PULIDO
            </h1>
            <p className="text-lg mt-2" style={{ color: PARCHMENT }}>
              {PROFESSIONAL_SUMMARY.headline}
            </p>
            <p className="text-sm mt-1 italic" style={{ color: ALLIANCE_GOLD }}>
              {PROFESSIONAL_SUMMARY.tagline}
            </p>

            {/* Resource bars */}
            <div className="mt-4 space-y-1 w-64">
              <ResourceBar label="EXP" value={85} max={100} color={ALLIANCE_GOLD} />
              <ResourceBar label="MANA" value={100} max={100} color={MANA_BLUE} />
            </div>
          </div>

          <div className="flex gap-4 items-center">
            <Link
              href="/cv"
              className="px-4 py-2 text-sm font-bold tracking-wider transition-all hover:scale-105"
              style={{
                background: `linear-gradient(180deg, #2a2015, #1a1510)`,
                border: `3px solid ${ALLIANCE_GOLD}`,
                color: ALLIANCE_GOLD,
                boxShadow: '0 4px 0 #0a0505',
              }}
            >
              📜 SCROLL
            </Link>
            <Link
              href="/personal-projects/game-engine"
              className="px-4 py-2 text-sm font-bold tracking-wider transition-all hover:scale-105"
              style={{
                background: `linear-gradient(180deg, ${ALLIANCE_BLUE}40, #1a1510)`,
                border: `3px solid ${ALLIANCE_BLUE}`,
                color: MANA_BLUE,
                boxShadow: '0 4px 0 #0a0505',
              }}
            >
              ⚔️ NEBULITH
            </Link>
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      {/* Current Roles - as titles */}
      <section className="relative z-20 py-4 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-8">
            {CURRENT_ROLES.map((role) => (
              <div key={role.id} className="text-center">
                <p className="text-sm font-bold" style={{ color: ALLIANCE_GOLD }}>{role.title}</p>
                <p className="text-lg" style={{ color: PARCHMENT }}>{role.company}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Unit Selection */}
      <section className="relative z-20 py-4">
        <UnitSelector active={active} onSelect={setActive} />
      </section>

      {/* About */}
      <section className="relative z-20 py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <BattleReveal>
            <StoneFrame title="About">
              <p className="text-sm leading-relaxed mb-4" style={{ color: PARCHMENT }}>
                {aboutData.bio}
              </p>
              <div className="flex flex-wrap gap-3">
                {aboutData.quickFacts.map((fact, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-xs font-bold"
                    style={{
                      background: `${ALLIANCE_GOLD}20`,
                      border: `2px solid ${ALLIANCE_GOLD}80`,
                      color: ALLIANCE_GOLD,
                    }}
                  >
                    {fact}
                  </span>
                ))}
              </div>
            </StoneFrame>
          </BattleReveal>
        </div>
      </section>

      {/* Work Experience */}
      {experience.length > 0 && (
        <section className="relative z-20 py-8 px-6">
          <div className="max-w-4xl mx-auto">
            <BattleReveal delay={100}>
              <StoneFrame title="Work Experience">
                <div className="space-y-4">
                  {experience.map((entry) => (
                    <ExperienceCard key={entry.id} entry={entry} />
                  ))}
                </div>
              </StoneFrame>
            </BattleReveal>
          </div>
        </section>
      )}

      {/* Tech Stack / Skills */}
      <section className="relative z-20 py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <BattleReveal delay={100}>
            <StoneFrame title={active === 'engineer' ? 'Tech Stack' : 'Skills'}>
              {active === 'engineer' ? (
                <TechAbilities categories={engineerTech} />
              ) : (
                <SkillsList categories={otherSkills} />
              )}
            </StoneFrame>
          </BattleReveal>
        </div>
      </section>

      {/* Projects */}
      <section className="relative z-20 py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <BattleReveal delay={100}>
            <StoneFrame title="Projects">
              <div className="grid md:grid-cols-2 gap-4">
                {projects.filter(p => p.featured).slice(0, 6).map((project) => (
                  <MissionCard key={project.id} project={project} />
                ))}
              </div>
            </StoneFrame>
          </BattleReveal>
        </div>
      </section>

      {/* Companies (Engineer) / Bands (Drummer) */}
      {active === 'engineer' && (
        <section className="relative z-20 py-8 px-6">
          <div className="max-w-4xl mx-auto">
            <BattleReveal delay={100}>
              <StoneFrame title="Companies">
                <div className="grid md:grid-cols-3 gap-4">
                  {COMPANIES.map((company) => (
                    <OutpostCard key={company.id} company={company} />
                  ))}
                </div>
              </StoneFrame>
            </BattleReveal>
          </div>
        </section>
      )}

      {active === 'drummer' && (
        <section className="relative z-20 py-8 px-6">
          <div className="max-w-4xl mx-auto">
            <BattleReveal delay={100}>
              <StoneFrame title="Bands">
                <div className="grid md:grid-cols-3 gap-4">
                  {BANDS.map((band) => (
                    <GuildCard key={band.id} band={band} />
                  ))}
                </div>
              </StoneFrame>
            </BattleReveal>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="relative z-20 py-12 text-center">
        <div className="text-4xl mb-4">🏰</div>
        <p className="text-sm font-bold" style={{ color: ALLIANCE_GOLD }}>
          FOR THE ALLIANCE
        </p>
        <p className="text-xs mt-2" style={{ color: PARCHMENT_DARK }}>
          Stormwind, Azeroth
        </p>
        <div className="flex justify-center gap-8 mt-6 text-3xl">
          <span>⚔️</span>
          <span>🛡️</span>
          <span>🏰</span>
        </div>
      </footer>
    </div>
  )
}
