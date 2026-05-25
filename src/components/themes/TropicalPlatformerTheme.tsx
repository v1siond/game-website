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

// Crash Bandicoot colors
const WUMPA_ORANGE = '#ff6b00'
const JUNGLE_GREEN = '#2d5a27'
const CRYSTAL_BLUE = '#00d4ff'
const TNT_RED = '#ff2222'
const CRATE_BROWN = '#8b5a2b'
const RIFT_PURPLE = '#9933ff'

// Crash-styled Alexander sprite
function CrashAlexander({
  size = 60,
  direction = 'right',
  spinning = false,
}: {
  size?: number
  direction?: 'left' | 'right'
  spinning?: boolean
}) {
  const [frame, setFrame] = useState(0)
  const [spinAngle, setSpinAngle] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => setFrame(f => (f + 1) % 2), 120)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (spinning) {
      const spin = setInterval(() => setSpinAngle(a => (a + 45) % 360), 50)
      return () => clearInterval(spin)
    }
  }, [spinning])

  const sprite = direction === 'right'
    ? (frame === 0 ? '/assets/sprites/run_right.png' : '/assets/sprites/run_right_1.png')
    : (frame === 0 ? '/assets/sprites/run_left.png' : '/assets/sprites/run_left_1.png')

  return (
    <div
      className="relative"
      style={{
        width: size,
        height: size * 1.2,
        transform: spinning ? `rotate(${spinAngle}deg)` : undefined,
        transition: spinning ? 'none' : 'transform 0.1s',
      }}
    >
      <Image
        src={sprite}
        alt="Crash Alexander"
        fill
        className="object-contain"
        style={{
          filter: 'brightness(1.1) contrast(1.1) saturate(1.3) hue-rotate(-15deg)',
        }}
      />
    </div>
  )
}

// Floating wumpa fruits, TNT crates, crystals
function JungleFloaters({ profession }: { profession: 'engineer' | 'drummer' | 'fighter' }) {
  const floatersByProfession = {
    engineer: [
      { emoji: '🍊', x: 5, y: 15, size: 28 },
      { emoji: '💎', x: 92, y: 25, size: 24 },
      { emoji: '🔧', x: 8, y: 70, size: 22 },
      { emoji: '💻', x: 88, y: 80, size: 26 },
      { emoji: '🍊', x: 15, y: 45, size: 26 },
      { emoji: '📦', x: 85, y: 55, size: 24 },
    ],
    drummer: [
      { emoji: '🥁', x: 5, y: 20, size: 30 },
      { emoji: '🍊', x: 90, y: 30, size: 26 },
      { emoji: '🎵', x: 10, y: 60, size: 22 },
      { emoji: '💎', x: 88, y: 70, size: 24 },
      { emoji: '🍊', x: 6, y: 85, size: 28 },
      { emoji: '🎤', x: 92, y: 15, size: 26 },
    ],
    fighter: [
      { emoji: '🥊', x: 5, y: 20, size: 28 },
      { emoji: '🍊', x: 92, y: 25, size: 26 },
      { emoji: '💪', x: 8, y: 65, size: 24 },
      { emoji: '💎', x: 90, y: 75, size: 22 },
      { emoji: '🔥', x: 6, y: 45, size: 26 },
      { emoji: '🍊', x: 88, y: 50, size: 28 },
    ],
  }

  const floaters = floatersByProfession[profession]

  return (
    <div className="fixed inset-0 pointer-events-none z-[4] overflow-hidden">
      {floaters.map((f, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${f.x}%`,
            top: `${f.y}%`,
            fontSize: f.size,
            filter: 'drop-shadow(0 0 8px rgba(255,107,0,0.5))',
            opacity: 0.7,
            animation: `wumpaFloat ${12 + i * 2}s ease-in-out infinite`,
            animationDelay: `${-i * 1.5}s`,
          }}
        >
          {f.emoji}
        </div>
      ))}
      <style jsx>{`
        @keyframes wumpaFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-15px) rotate(10deg); }
          50% { transform: translateY(-5px) rotate(-5deg); }
          75% { transform: translateY(-20px) rotate(15deg); }
        }
      `}</style>
    </div>
  )
}

// Aku Aku mask that appears on scroll
function AkuAkuReveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const hasTriggered = useInViewTrigger(ref, { threshold: 0.15 })
  const [phase, setPhase] = useState<'hidden' | 'mask' | 'revealed'>('hidden')

  useEffect(() => {
    if (hasTriggered && phase === 'hidden') {
      const timer = setTimeout(() => {
        setPhase('mask')
        setTimeout(() => setPhase('revealed'), 600)
      }, delay)
      return () => clearTimeout(timer)
    }
  }, [hasTriggered, phase, delay])

  return (
    <div ref={ref} className="relative overflow-hidden">
      {phase === 'mask' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div
            className="text-6xl animate-pulse"
            style={{
              animation: 'akuAkuAppear 0.6s ease-out forwards',
              filter: 'drop-shadow(0 0 20px #ff6b00)',
            }}
          >
            🎭
          </div>
        </div>
      )}
      <div
        style={{
          opacity: phase === 'revealed' ? 1 : 0,
          transform: phase === 'revealed' ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
          transition: 'all 0.5s ease-out',
        }}
      >
        {children}
      </div>
      <style jsx>{`
        @keyframes akuAkuAppear {
          0% { transform: scale(0) rotate(-180deg); opacity: 0; }
          50% { transform: scale(1.3) rotate(0deg); opacity: 1; }
          100% { transform: scale(0) rotate(180deg); opacity: 0; }
        }
      `}</style>
    </div>
  )
}

// Crate-styled section frame
function CrateFrame({ children, title, variant = 'normal' }: {
  children: React.ReactNode
  title: string
  variant?: 'normal' | 'tnt' | 'checkpoint'
}) {
  const colors = {
    normal: { border: CRATE_BROWN, bg: '#4a3520', icon: '📦' },
    tnt: { border: TNT_RED, bg: '#3a1010', icon: '💣' },
    checkpoint: { border: CRYSTAL_BLUE, bg: '#102535', icon: '💎' },
  }
  const c = colors[variant]

  return (
    <div className="relative">
      <div
        className="absolute -top-6 left-1/2 -translate-x-1/2 px-6 py-2 flex items-center gap-2"
        style={{
          background: c.bg,
          border: `3px solid ${c.border}`,
          boxShadow: `0 0 15px ${c.border}40, inset 0 -2px 0 rgba(0,0,0,0.3)`,
        }}
      >
        <span className="text-xl">{c.icon}</span>
        <span className="text-sm font-bold tracking-wider uppercase" style={{ color: '#fff' }}>
          {title}
        </span>
      </div>
      <div
        className="pt-8 pb-6 px-6"
        style={{
          background: `linear-gradient(180deg, ${c.bg}ee, #1a1510dd)`,
          border: `3px solid ${c.border}`,
          boxShadow: `0 0 30px ${c.border}20, inset 0 0 50px rgba(0,0,0,0.3)`,
        }}
      >
        {children}
      </div>
    </div>
  )
}

// Tech stack display
function TechCrates({ categories }: { categories: ReturnType<typeof getEngineerSkills> }) {
  return (
    <div className="space-y-6">
      {categories.slice(0, 5).map((category) => (
        <div key={category.name}>
          <h3 className="text-xs tracking-wider mb-3 flex items-center gap-2" style={{ color: WUMPA_ORANGE }}>
            <span>{category.icon}</span>
            {category.name.toUpperCase()}
          </h3>
          <div className="flex flex-wrap gap-2">
            {category.items.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 text-xs transition-all hover:scale-105 cursor-default font-bold"
                style={{
                  background: `linear-gradient(180deg, ${CRATE_BROWN}, #5a3a1a)`,
                  border: `2px solid ${WUMPA_ORANGE}60`,
                  color: '#fff',
                  boxShadow: 'inset 0 -2px 0 rgba(0,0,0,0.3)',
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
          <h3 className="text-xs tracking-wider mb-3 flex items-center gap-2 font-bold" style={{ color: WUMPA_ORANGE }}>
            <span>{category.icon}</span>
            {category.name.toUpperCase()}
          </h3>
          <ul className="space-y-2">
            {category.skills.map((skill) => (
              <li key={skill.name} className="text-sm flex items-center gap-2" style={{ color: '#fff' }}>
                <span style={{ color: CRYSTAL_BLUE }}>🍊</span>
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
        background: `linear-gradient(135deg, #3a2a15, #251a0a)`,
        border: `2px solid ${CRATE_BROWN}`,
      }}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="text-sm font-bold" style={{ color: '#fff' }}>{entry.title}</h4>
          <p className="text-xs" style={{ color: WUMPA_ORANGE }}>{entry.organization}</p>
        </div>
        <span className="text-[10px]" style={{ color: '#a0a0a0' }}>
          {startDisplay} - {endDisplay}
        </span>
      </div>
      <p className="text-xs mb-2" style={{ color: '#a0a0a0' }}>{entry.description}</p>
      {entry.highlights && entry.highlights.length > 0 && (
        <ul className="space-y-1">
          {entry.highlights.map((highlight, i) => (
            <li key={i} className="text-xs flex items-start gap-2" style={{ color: '#fff' }}>
              <span style={{ color: WUMPA_ORANGE }}>•</span>
              {highlight}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// Project card
function WumpaProjectCard({ project }: { project: typeof PROJECTS_DATA[0] }) {
  return (
    <div
      className="p-4 transition-all hover:scale-[1.02] cursor-pointer group"
      style={{
        background: `linear-gradient(135deg, #3a2a15, #251a0a)`,
        border: `2px solid ${project.featured ? WUMPA_ORANGE : CRATE_BROWN}`,
        boxShadow: project.featured ? `0 0 20px ${WUMPA_ORANGE}30` : 'none',
      }}
    >
      {project.featured && (
        <span className="text-[10px] tracking-wider font-bold" style={{ color: CRYSTAL_BLUE }}>💎 FEATURED</span>
      )}
      <h4 className="text-sm mt-1 font-bold group-hover:text-orange-400 transition-colors" style={{ color: '#fff' }}>
        {project.name}
      </h4>
      <p className="text-xs mt-2" style={{ color: '#a0a0a0' }}>{project.tagline}</p>
      {project.impact && (
        <p className="text-xs mt-2 italic font-bold" style={{ color: WUMPA_ORANGE }}>🍊 {project.impact}</p>
      )}
      <div className="flex flex-wrap gap-1 mt-3">
        {project.techStack.slice(0, 4).map((tech) => (
          <span key={tech} className="text-[8px] px-1.5 py-0.5 font-bold" style={{ background: `${JUNGLE_GREEN}80`, color: '#90ee90' }}>
            {tech}
          </span>
        ))}
      </div>
    </div>
  )
}

// Company card
function VentureCard({ company }: { company: typeof COMPANIES[0] }) {
  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 transition-all hover:scale-[1.02] group"
      style={{
        background: `linear-gradient(135deg, #3a2a15, #251a0a)`,
        border: `2px solid ${CRATE_BROWN}`,
      }}
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{company.icon}</span>
        <div>
          <h4 className="text-sm font-bold group-hover:text-orange-400 transition-colors" style={{ color: '#fff' }}>
            {company.name}
          </h4>
          <p className="text-[10px]" style={{ color: WUMPA_ORANGE }}>{company.tagline}</p>
        </div>
      </div>
      <p className="text-xs" style={{ color: '#a0a0a0' }}>{company.description}</p>
    </a>
  )
}

// Band card
function BandCard({ band }: { band: typeof BANDS[0] }) {
  const content = (
    <div
      className="p-4 transition-all hover:scale-[1.02] group"
      style={{
        background: `linear-gradient(135deg, #3a2a15, #251a0a)`,
        border: `2px solid ${CRATE_BROWN}`,
      }}
    >
      <h4 className="text-sm font-bold group-hover:text-orange-400 transition-colors" style={{ color: '#fff' }}>
        {band.name}
      </h4>
      <p className="text-[10px] mt-1" style={{ color: WUMPA_ORANGE }}>{band.genre} • {band.role}</p>
      <p className="text-xs mt-2" style={{ color: '#a0a0a0' }}>{band.description}</p>
    </div>
  )

  if (band.url) {
    return <a href={band.url} target="_blank" rel="noopener noreferrer" className="block">{content}</a>
  }
  return content
}

// Profession selector - warp zone style
function WarpZoneSelector({
  active,
  onSelect,
}: {
  active: 'engineer' | 'drummer' | 'fighter'
  onSelect: (p: 'engineer' | 'drummer' | 'fighter') => void
}) {
  const zones = [
    { id: 'engineer', icon: '⚙️', label: 'Engineer', color: CRYSTAL_BLUE },
    { id: 'drummer', icon: '🥁', label: 'Musician', color: RIFT_PURPLE },
    { id: 'fighter', icon: '🥊', label: 'Fighter', color: TNT_RED },
  ] as const

  return (
    <div className="flex justify-center gap-8 py-8">
      {zones.map((zone) => (
        <button
          key={zone.id}
          onClick={() => onSelect(zone.id)}
          className="relative group"
        >
          <div
            className={`absolute inset-0 rounded-full blur-xl transition-all duration-300 ${
              active === zone.id ? 'opacity-60 scale-150' : 'opacity-0 group-hover:opacity-40'
            }`}
            style={{ background: zone.color }}
          />
          <div
            className={`relative w-24 h-24 rounded-full flex flex-col items-center justify-center transition-all duration-300 ${
              active === zone.id ? 'scale-110' : 'group-hover:scale-105'
            }`}
            style={{
              background: `radial-gradient(circle at 30% 30%, ${zone.color}40, #1a1510)`,
              border: `4px solid ${active === zone.id ? zone.color : '#3a2a15'}`,
              boxShadow: active === zone.id
                ? `0 0 30px ${zone.color}60, inset 0 0 20px ${zone.color}30`
                : '0 4px 10px rgba(0,0,0,0.5)',
            }}
          >
            <span className="text-3xl">{zone.icon}</span>
            <span className="text-[10px] tracking-wider uppercase mt-1 font-bold" style={{ color: active === zone.id ? zone.color : '#6b5a4a' }}>
              {zone.label}
            </span>
          </div>
          {active === zone.id && (
            <CrashAlexander size={35} direction="right" spinning />
          )}
        </button>
      ))}
    </div>
  )
}

export default function TropicalPlatformerTheme() {
  const { theme } = useTheme()
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
        background: `linear-gradient(180deg, #1a2810 0%, #0a1505 50%, #1a1510 100%)`,
        fontFamily: '"Comic Sans MS", "Chalkboard", sans-serif',
      }}
    >
      {/* Jungle canopy top */}
      <div
        className="fixed top-0 left-0 right-0 h-24 z-[2] pointer-events-none"
        style={{
          background: `linear-gradient(180deg, ${JUNGLE_GREEN}cc 0%, transparent 100%)`,
        }}
      />

      {/* Floating decorations */}
      <JungleFloaters profession={active} />

      {/* Running Crash Alexander across top */}
      <div className="fixed top-8 left-0 z-[6] animate-run-across pointer-events-none">
        <CrashAlexander size={50} direction="right" />
      </div>
      <style jsx global>{`
        @keyframes runAcross {
          0% { transform: translateX(-100px); }
          100% { transform: translateX(calc(100vw + 100px)); }
        }
        .animate-run-across {
          animation: runAcross 20s linear infinite;
        }
      `}</style>

      {/* Header */}
      <header className="relative z-30 p-6">
        <div className="max-w-6xl mx-auto flex justify-between items-start">
          <div>
            <h1
              className="text-4xl font-bold tracking-wide"
              style={{
                color: WUMPA_ORANGE,
                textShadow: `3px 3px 0 ${JUNGLE_GREEN}, -1px -1px 0 #000, 0 0 20px ${WUMPA_ORANGE}80`,
              }}
            >
              ALEXANDER PULIDO
            </h1>
            <p className="text-lg font-bold mt-2" style={{ color: '#fff', textShadow: '2px 2px 0 #000' }}>
              {PROFESSIONAL_SUMMARY.headline}
            </p>
            <p className="text-sm mt-1 italic" style={{ color: CRYSTAL_BLUE }}>
              {PROFESSIONAL_SUMMARY.tagline}
            </p>
          </div>

          <div className="flex gap-4 items-center">
            <Link
              href="/cv"
              className="px-4 py-2 text-sm font-bold tracking-wider transition-all hover:scale-105"
              style={{
                background: `linear-gradient(180deg, ${CRATE_BROWN}, #5a3a1a)`,
                border: `3px solid ${WUMPA_ORANGE}`,
                color: '#fff',
                boxShadow: '0 4px 0 #3a2010',
              }}
            >
              📦 CV
            </Link>
            <Link
              href="/personal-projects/game-engine"
              className="px-4 py-2 text-sm font-bold tracking-wider transition-all hover:scale-105"
              style={{
                background: `linear-gradient(180deg, ${JUNGLE_GREEN}, #1a3a15)`,
                border: `3px solid ${CRYSTAL_BLUE}`,
                color: CRYSTAL_BLUE,
                boxShadow: '0 4px 0 #0a1a05',
              }}
            >
              💎 NEBULITH
            </Link>
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      {/* Current Roles */}
      <section className="relative z-20 py-4 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-8">
            {CURRENT_ROLES.map((role) => (
              <div key={role.id} className="text-center">
                <p className="text-sm font-bold" style={{ color: WUMPA_ORANGE }}>{role.title}</p>
                <p className="text-lg font-bold" style={{ color: '#fff' }}>{role.company}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Profession Warp Zones */}
      <section className="relative z-20 py-4">
        <WarpZoneSelector active={active} onSelect={setActive} />
      </section>

      {/* Bio */}
      <section className="relative z-20 py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <AkuAkuReveal>
            <CrateFrame title="About" variant="checkpoint">
              <p className="text-sm leading-relaxed mb-4" style={{ color: '#fff' }}>
                {aboutData.bio}
              </p>
              <div className="flex flex-wrap gap-3">
                {aboutData.quickFacts.map((fact, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-xs font-bold"
                    style={{
                      background: `${WUMPA_ORANGE}25`,
                      border: `2px solid ${WUMPA_ORANGE}`,
                      color: WUMPA_ORANGE,
                    }}
                  >
                    🍊 {fact}
                  </span>
                ))}
              </div>
            </CrateFrame>
          </AkuAkuReveal>
        </div>
      </section>

      {/* Work Experience */}
      {experience.length > 0 && (
        <section className="relative z-20 py-8 px-6">
          <div className="max-w-4xl mx-auto">
            <AkuAkuReveal delay={100}>
              <CrateFrame title="Work Experience" variant="normal">
                <div className="space-y-4">
                  {experience.map((entry) => (
                    <ExperienceCard key={entry.id} entry={entry} />
                  ))}
                </div>
              </CrateFrame>
            </AkuAkuReveal>
          </div>
        </section>
      )}

      {/* Tech Stack / Skills */}
      <section className="relative z-20 py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <AkuAkuReveal delay={100}>
            <CrateFrame title={active === 'engineer' ? 'Tech Stack' : 'Skills'} variant="normal">
              {active === 'engineer' ? (
                <TechCrates categories={engineerTech} />
              ) : (
                <SkillsList categories={otherSkills} />
              )}
            </CrateFrame>
          </AkuAkuReveal>
        </div>
      </section>

      {/* Projects */}
      <section className="relative z-20 py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <AkuAkuReveal delay={100}>
            <CrateFrame title="Featured Work" variant="tnt">
              <div className="grid md:grid-cols-2 gap-4">
                {projects.filter(p => p.featured).slice(0, 6).map((project) => (
                  <WumpaProjectCard key={project.id} project={project} />
                ))}
              </div>
            </CrateFrame>
          </AkuAkuReveal>
        </div>
      </section>

      {/* Companies (Engineer) / Bands (Drummer) */}
      {active === 'engineer' && (
        <section className="relative z-20 py-8 px-6">
          <div className="max-w-4xl mx-auto">
            <AkuAkuReveal delay={100}>
              <CrateFrame title="Ventures" variant="checkpoint">
                <div className="grid md:grid-cols-3 gap-4">
                  {COMPANIES.map((company) => (
                    <VentureCard key={company.id} company={company} />
                  ))}
                </div>
              </CrateFrame>
            </AkuAkuReveal>
          </div>
        </section>
      )}

      {active === 'drummer' && (
        <section className="relative z-20 py-8 px-6">
          <div className="max-w-4xl mx-auto">
            <AkuAkuReveal delay={100}>
              <CrateFrame title="Bands" variant="checkpoint">
                <div className="grid md:grid-cols-3 gap-4">
                  {BANDS.map((band) => (
                    <BandCard key={band.id} band={band} />
                  ))}
                </div>
              </CrateFrame>
            </AkuAkuReveal>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="relative z-20 py-12 text-center">
        <div className="text-4xl mb-4">🍊</div>
        <p className="text-sm" style={{ color: '#6b5a4a' }}>
          N. Sanity Beach, 2024
        </p>
        <div className="flex justify-center gap-8 mt-6 text-3xl">
          <span>📦</span>
          <span>💎</span>
          <span>💣</span>
        </div>
      </footer>
    </div>
  )
}
