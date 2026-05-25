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
import { COMPANIES } from '@/data/companies'
import { BANDS } from '@/data/bands'
import { EXPERIENCE_DATA, filterExperienceByProfession } from '@/data/experience'
import { useInViewTrigger, useSmoothScroll } from '@/hooks/useScrollAnimation'

// Knight Alexander - Hollow Knight inspired character
function KnightCharacter({
  size = 60,
  direction = 'right',
  className = ''
}: {
  size?: number
  direction?: 'left' | 'right'
  className?: string
}) {
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => setFrame(f => (f + 1) % 2), 180)
    return () => clearInterval(interval)
  }, [])

  const sprite = direction === 'right'
    ? (frame === 0 ? '/assets/sprites/run_right.png' : '/assets/sprites/run_right_1.png')
    : (frame === 0 ? '/assets/sprites/run_left.png' : '/assets/sprites/run_left_1.png')

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size * 1.2 }}>
      <Image
        src={sprite}
        alt="Knight"
        fill
        className="object-contain"
        style={{
          filter: 'brightness(0.9) contrast(1.2) hue-rotate(180deg)',
        }}
      />
      {/* Nail/sword effect */}
      <div
        className="absolute top-1/3"
        style={{
          [direction === 'right' ? 'right' : 'left']: '-12px',
          width: '20px',
          height: '4px',
          background: 'linear-gradient(90deg, #fff, #41c8e8)',
          boxShadow: '0 0 10px #41c8e8',
          transform: `rotate(${direction === 'right' ? '-30deg' : '30deg'})`,
        }}
      />
    </div>
  )
}

// Profession-specific floating ornaments
function ProfessionOrnaments({ profession }: { profession: 'engineer' | 'drummer' | 'fighter' }) {
  const ornamentsByProfession = {
    engineer: [
      { icon: '⌨️', size: 24, x: 5, y: 15 },
      { icon: '💻', size: 28, x: 92, y: 25 },
      { icon: '🔧', size: 22, x: 8, y: 70 },
      { icon: '⚙️', size: 26, x: 88, y: 80 },
      { icon: '📡', size: 24, x: 15, y: 45 },
      { icon: '🖥️', size: 26, x: 85, y: 55 },
    ],
    drummer: [
      { icon: '🥁', size: 30, x: 5, y: 20 },
      { icon: '🎹', size: 28, x: 90, y: 30 },
      { icon: '🎵', size: 22, x: 10, y: 60 },
      { icon: '🎶', size: 24, x: 88, y: 70 },
      { icon: '🎤', size: 26, x: 6, y: 85 },
      { icon: '🥁', size: 28, x: 92, y: 15 },
    ],
    fighter: [
      { icon: '🥋', size: 28, x: 5, y: 20 },
      { icon: '👊', size: 26, x: 92, y: 25 },
      { icon: '🔥', size: 24, x: 8, y: 65 },
      { icon: '⚡', size: 22, x: 90, y: 75 },
      { icon: '🏆', size: 26, x: 6, y: 45 },
      { icon: '💪', size: 24, x: 88, y: 50 },
    ],
  }

  const ornaments = ornamentsByProfession[profession]

  return (
    <div className="fixed inset-0 pointer-events-none z-[4] overflow-hidden">
      {ornaments.map((o, i) => (
        <div
          key={i}
          className="absolute animate-ornament-float"
          style={{
            left: `${o.x}%`,
            top: `${o.y}%`,
            fontSize: o.size,
            filter: 'drop-shadow(0 0 8px #41c8e8)',
            opacity: 0.6,
            animation: `ornamentFloat ${15 + i * 2}s ease-in-out infinite`,
            animationDelay: `${-i * 2}s`,
          }}
        >
          {o.icon}
        </div>
      ))}
    </div>
  )
}

// Knight slash reveal for sections
function KnightRevealSection({
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
      setTimeout(() => setPhase('revealed'), 600)
    }
  }, [hasEntered, phase])

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {/* Knight slash animation */}
      {phase === 'slash' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div
            className="absolute w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
            style={{
              animation: 'slashReveal 0.5s ease-out forwards',
              boxShadow: '0 0 20px #41c8e8, 0 0 40px #41c8e8',
            }}
          />
          <KnightCharacter size={50} direction="right" className="animate-knight-dash" />
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

// Floating particle component
function FloatingParticles() {
  const [particles, setParticles] = useState<Array<{
    id: number
    x: number
    y: number
    size: number
    opacity: number
    speed: number
  }>>([])

  useEffect(() => {
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      opacity: Math.random() * 0.5 + 0.2,
      speed: Math.random() * 20 + 10,
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full animate-float"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: '#41c8e8',
            opacity: p.opacity,
            boxShadow: `0 0 ${p.size * 2}px #41c8e8`,
            animation: `float ${p.speed}s ease-in-out infinite`,
            animationDelay: `${-p.speed * Math.random()}s`,
          }}
        />
      ))}
    </div>
  )
}

// Map node for profession selection
function MapNode({
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
      <div
        className={`absolute inset-0 rounded-full blur-xl transition-all duration-500 ${
          isActive ? 'opacity-60 scale-150' : 'opacity-0 scale-100 group-hover:opacity-40 group-hover:scale-125'
        }`}
        style={{ backgroundColor: color }}
      />
      <div
        className={`relative w-20 h-20 rounded-full flex flex-col items-center justify-center transition-all duration-300 ${
          isActive ? 'scale-110' : 'group-hover:scale-105'
        }`}
        style={{
          background: `radial-gradient(circle at 30% 30%, ${color}40, #0f0a1a)`,
          border: `2px solid ${isActive ? color : '#2a2540'}`,
          boxShadow: isActive ? `0 0 30px ${color}60, inset 0 0 20px ${color}30` : `0 0 10px rgba(0,0,0,0.5)`,
        }}
      >
        <span className="text-2xl mb-1">{icon}</span>
        <span className="text-[8px] tracking-wider uppercase" style={{ color: isActive ? color : '#6b7a94' }}>
          {label}
        </span>
      </div>
    </button>
  )
}

// Ornate section frame
function OrnateFrame({ children, title }: { children: React.ReactNode; title: string }) {
  const { theme } = useTheme()

  return (
    <div className="relative">
      {/* Corner ornaments */}
      {['-top-3 -left-3', '-top-3 -right-3 rotate-90', '-bottom-3 -left-3 -rotate-90', '-bottom-3 -right-3 rotate-180'].map((pos, i) => (
        <div key={i} className={`absolute w-8 h-8 ${pos}`}>
          <svg viewBox="0 0 32 32" className="w-full h-full">
            <path d="M0,16 Q0,0 16,0 L16,4 Q4,4 4,16 Z" fill={theme.colors.accent} opacity="0.6" />
            <circle cx="8" cy="8" r="2" fill={theme.colors.accent} />
          </svg>
        </div>
      ))}

      {/* Title */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, transparent, ${theme.colors.border})` }} />
        <h2 className="text-sm tracking-[0.3em] uppercase" style={{ color: theme.colors.accent }}>{title}</h2>
        <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${theme.colors.border}, transparent)` }} />
      </div>

      <div
        className="p-6 relative"
        style={{
          background: `linear-gradient(180deg, ${theme.colors.surface}ee, ${theme.colors.background}dd)`,
          border: `1px solid ${theme.colors.border}`,
        }}
      >
        {children}
      </div>
    </div>
  )
}

// Tech stack tag cloud (for engineer)
function TechCloud({ categories }: { categories: ReturnType<typeof getEngineerSkills> }) {
  const { theme } = useTheme()

  return (
    <div className="space-y-6">
      {categories.slice(0, 5).map((category) => (
        <div key={category.name}>
          <h3 className="text-xs tracking-wider mb-3 flex items-center gap-2" style={{ color: theme.colors.textMuted }}>
            <span>{category.icon}</span>
            {category.name.toUpperCase()}
          </h3>
          <div className="flex flex-wrap gap-2">
            {category.items.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 text-xs transition-all hover:scale-105 cursor-default"
                style={{
                  background: `${theme.colors.accent}15`,
                  border: `1px solid ${theme.colors.accent}40`,
                  color: theme.colors.text,
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

// Skills list (for drummer/fighter)
function SkillsList({ categories }: { categories: ReturnType<typeof getSkillsByProfession> }) {
  const { theme } = useTheme()

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {categories.map((category) => (
        <div key={category.name}>
          <h3 className="text-xs tracking-wider mb-3 flex items-center gap-2" style={{ color: theme.colors.textMuted }}>
            <span>{category.icon}</span>
            {category.name.toUpperCase()}
          </h3>
          <ul className="space-y-2">
            {category.skills.map((skill) => (
              <li key={skill.name} className="text-sm flex items-center gap-2" style={{ color: theme.colors.text }}>
                <span style={{ color: theme.colors.accent }}>◇</span>
                {skill.name}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

// Project card with impact
function ProjectCard({ project }: { project: typeof PROJECTS_DATA[0] }) {
  const { theme } = useTheme()

  return (
    <div
      className="p-4 transition-all hover:scale-[1.02] cursor-pointer group"
      style={{
        background: `linear-gradient(135deg, ${theme.colors.surface}, ${theme.colors.background})`,
        border: `1px solid ${project.featured ? theme.colors.accent : theme.colors.border}`,
        boxShadow: project.featured ? `0 0 20px ${theme.colors.accent}20` : 'none',
      }}
    >
      {project.featured && (
        <span className="text-[8px] tracking-wider" style={{ color: theme.colors.accent }}>★ FEATURED</span>
      )}
      <h4 className="text-sm mt-1 group-hover:text-cyan-400 transition-colors" style={{ color: theme.colors.text }}>
        {project.name}
      </h4>
      <p className="text-xs mt-2" style={{ color: theme.colors.textMuted }}>{project.tagline}</p>
      {project.impact && (
        <p className="text-xs mt-2 italic" style={{ color: theme.colors.accent }}>→ {project.impact}</p>
      )}
      <div className="flex flex-wrap gap-1 mt-3">
        {project.techStack.slice(0, 4).map((tech) => (
          <span key={tech} className="text-[8px] px-1 py-0.5" style={{ background: `${theme.colors.accent}10`, color: theme.colors.textMuted }}>
            {tech}
          </span>
        ))}
      </div>
    </div>
  )
}

// Company promotion card
function CompanyCard({ company }: { company: typeof COMPANIES[0] }) {
  const { theme } = useTheme()

  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 transition-all hover:scale-[1.02] group"
      style={{
        background: `linear-gradient(135deg, ${theme.colors.surface}, ${theme.colors.background})`,
        border: `1px solid ${theme.colors.border}`,
      }}
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{company.icon}</span>
        <div>
          <h4 className="text-sm group-hover:text-cyan-400 transition-colors" style={{ color: theme.colors.text }}>
            {company.name}
          </h4>
          <p className="text-[10px]" style={{ color: theme.colors.accent }}>{company.tagline}</p>
        </div>
      </div>
      <p className="text-xs" style={{ color: theme.colors.textMuted }}>{company.description}</p>
    </a>
  )
}

// Band card
function BandCard({ band }: { band: typeof BANDS[0] }) {
  const { theme } = useTheme()

  const content = (
    <div
      className="p-4 transition-all hover:scale-[1.02] group"
      style={{
        background: `linear-gradient(135deg, ${theme.colors.surface}, ${theme.colors.background})`,
        border: `1px solid ${theme.colors.border}`,
      }}
    >
      <h4 className="text-sm group-hover:text-cyan-400 transition-colors" style={{ color: theme.colors.text }}>
        {band.name}
      </h4>
      <p className="text-[10px] mt-1" style={{ color: theme.colors.accent }}>{band.genre} • {band.role}</p>
      <p className="text-xs mt-2" style={{ color: theme.colors.textMuted }}>{band.description}</p>
      {!band.url && <p className="text-[10px] mt-2 italic" style={{ color: theme.colors.textMuted }}>Website coming soon</p>}
    </div>
  )

  if (band.url) {
    return <a href={band.url} target="_blank" rel="noopener noreferrer" className="block">{content}</a>
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
      className="p-4"
      style={{
        background: `linear-gradient(135deg, ${theme.colors.surface}, ${theme.colors.background})`,
        border: `1px solid ${theme.colors.border}`,
      }}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="text-sm font-medium" style={{ color: theme.colors.text }}>{entry.title}</h4>
          <p className="text-xs" style={{ color: theme.colors.accent }}>{entry.organization}</p>
        </div>
        <span className="text-[10px]" style={{ color: theme.colors.textMuted }}>
          {startDisplay} - {endDisplay}
        </span>
      </div>
      <p className="text-xs mb-2" style={{ color: theme.colors.textMuted }}>{entry.description}</p>
      {entry.highlights && entry.highlights.length > 0 && (
        <ul className="space-y-1">
          {entry.highlights.map((highlight, i) => (
            <li key={i} className="text-xs flex items-start gap-2" style={{ color: theme.colors.text }}>
              <span style={{ color: theme.colors.accent }}>•</span>
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
    { id: 'engineer', icon: '⚙', label: 'Engineer', color: '#41c8e8', position: { x: 25, y: 50 } },
    { id: 'drummer', icon: '♪', label: 'Musician', color: '#9966cc', position: { x: 50, y: 30 } },
    { id: 'fighter', icon: '⚔', label: 'Fighter', color: '#ff6b6b', position: { x: 75, y: 50 } },
  ]

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: theme.colors.backgroundGradient, fontFamily: 'Georgia, serif' }}>
      {/* Background layers */}
      <div className="fixed inset-0 z-0" style={{ background: `radial-gradient(ellipse at 20% 80%, #1a0a2a 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, #0a1a2a 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, #150f25 0%, #0f0a1a 100%)` }} />
      <FloatingParticles />
      <ProfessionOrnaments profession={active} />
      <div className="fixed inset-0 pointer-events-none z-[8]" style={{ background: 'radial-gradient(circle at 50% 50%, transparent 20%, rgba(0,0,0,0.7) 100%)' }} />

      {/* Header */}
      <header className="relative z-30 p-6">
        <div className="max-w-6xl mx-auto flex justify-between items-start">
          <div className="animate-fade-in-down">
            <h1 className="text-3xl tracking-[0.4em] font-light" style={{ color: theme.colors.accent, textShadow: `0 0 40px ${theme.colors.accent}60` }}>
              ALEXANDER PULIDO
            </h1>
            <p className="text-sm tracking-wider mt-2" style={{ color: theme.colors.text }}>
              {PROFESSIONAL_SUMMARY.headline}
            </p>
            <p className="text-xs tracking-wider mt-1 italic" style={{ color: theme.colors.accent }}>
              {PROFESSIONAL_SUMMARY.tagline}
            </p>
          </div>

          <div className="flex gap-4 items-center">
            <Link href="/cv" className="px-4 py-2 text-xs tracking-wider transition-all hover:scale-105" style={{ border: `1px solid ${theme.colors.border}`, color: theme.colors.textMuted, background: `${theme.colors.surface}80` }}>
              ◈ CV
            </Link>
            <Link href="/personal-projects/game-engine" className="px-4 py-2 text-xs tracking-wider transition-all hover:scale-105" style={{ border: `1px solid ${theme.colors.accent}`, color: theme.colors.accent, background: `${theme.colors.accent}15` }}>
              ◈ NEBULITH
            </Link>
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      {/* Current Roles */}
      <section className="relative z-20 py-6 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-6">
            {CURRENT_ROLES.map((role) => (
              <div key={role.id} className="text-center">
                <p className="text-xs tracking-wider" style={{ color: theme.colors.accent }}>{role.title}</p>
                <p className="text-sm" style={{ color: theme.colors.text }}>{role.company}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Profession Map */}
      <section className="relative z-20 py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="relative h-48 rounded-lg overflow-hidden" style={{ background: `linear-gradient(180deg, transparent, ${theme.colors.surface}40)`, border: `1px solid ${theme.colors.border}40` }}>
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={theme.colors.accent} stopOpacity="0" />
                  <stop offset="50%" stopColor={theme.colors.accent} stopOpacity="0.3" />
                  <stop offset="100%" stopColor={theme.colors.accent} stopOpacity="0" />
                </linearGradient>
              </defs>
              <line x1="25%" y1="50%" x2="50%" y2="30%" stroke="url(#lineGrad)" strokeWidth="1" />
              <line x1="50%" y1="30%" x2="75%" y2="50%" stroke="url(#lineGrad)" strokeWidth="1" />
            </svg>
            {professionNodes.map((node) => (
              <MapNode key={node.id} {...node} isActive={active === node.id} onClick={() => setActive(node.id as 'engineer' | 'drummer' | 'fighter')} />
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="relative z-20 py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <OrnateFrame title="About">
            <p className="text-sm leading-relaxed mb-4" style={{ color: theme.colors.text }}>{aboutData.bio}</p>
            <div className="flex flex-wrap gap-3">
              {aboutData.quickFacts.map((fact, i) => (
                <span key={i} className="px-3 py-1 text-xs" style={{ background: `${theme.colors.accent}15`, border: `1px solid ${theme.colors.accent}40`, color: theme.colors.accent }}>
                  ◇ {fact}
                </span>
              ))}
            </div>
          </OrnateFrame>
        </div>
      </section>

      {/* Work Experience */}
      {experience.length > 0 && (
        <section className="relative z-20 py-8 px-6">
          <div className="max-w-4xl mx-auto">
            <OrnateFrame title="Work Experience">
              <div className="space-y-4">
                {experience.map((entry) => (
                  <ExperienceCard key={entry.id} entry={entry} />
                ))}
              </div>
            </OrnateFrame>
          </div>
        </section>
      )}

      {/* Tech Stack / Skills */}
      <section className="relative z-20 py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <OrnateFrame title={active === 'engineer' ? 'Tech Stack' : 'Skills'}>
            {active === 'engineer' ? (
              <TechCloud categories={engineerTech} />
            ) : (
              <SkillsList categories={otherSkills} />
            )}
          </OrnateFrame>
        </div>
      </section>

      {/* Projects */}
      <section className="relative z-20 py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <OrnateFrame title="Featured Work">
            <div className="grid md:grid-cols-2 gap-4">
              {projects.filter(p => p.featured).slice(0, 6).map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </OrnateFrame>
        </div>
      </section>

      {/* Companies (Engineer) / Bands (Drummer) */}
      {active === 'engineer' && (
        <section className="relative z-20 py-8 px-6">
          <div className="max-w-4xl mx-auto">
            <OrnateFrame title="Ventures">
              <div className="grid md:grid-cols-3 gap-4">
                {COMPANIES.map((company) => (
                  <CompanyCard key={company.id} company={company} />
                ))}
              </div>
            </OrnateFrame>
          </div>
        </section>
      )}

      {active === 'drummer' && (
        <section className="relative z-20 py-8 px-6">
          <div className="max-w-4xl mx-auto">
            <OrnateFrame title="Bands">
              <div className="grid md:grid-cols-3 gap-4">
                {BANDS.map((band) => (
                  <BandCard key={band.id} band={band} />
                ))}
              </div>
            </OrnateFrame>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="relative z-20 py-12 px-6 text-center">
        <div className="inline-flex items-center gap-4" style={{ color: theme.colors.textMuted }}>
          <div className="w-12 h-px" style={{ background: theme.colors.border }} />
          <span className="text-xs tracking-widest">MMXXVI</span>
          <div className="w-12 h-px" style={{ background: theme.colors.border }} />
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
