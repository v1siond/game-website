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

// Pac-Man colors
const PACMAN_YELLOW = '#ffff00'
const GHOST_RED = '#ff0000'    // Blinky
const GHOST_PINK = '#ffb8ff'   // Pinky
const GHOST_CYAN = '#00ffff'   // Inky
const GHOST_ORANGE = '#ffb852' // Clyde
const MAZE_BLUE = '#2121ff'
const DOT_WHITE = '#ffb897'
const POWER_PELLET = '#ffb897'
const BG_BLACK = '#000000'

// Pac-Man Alexander - chomping animation
function PacManAlexander({
  size = 50,
  direction = 'right',
}: {
  size?: number
  direction?: 'left' | 'right'
}) {
  const [frame, setFrame] = useState(0)
  const [mouthOpen, setMouthOpen] = useState(true)

  useEffect(() => {
    const moveInterval = setInterval(() => setFrame(f => (f + 1) % 2), 150)
    const chompInterval = setInterval(() => setMouthOpen(m => !m), 100)
    return () => {
      clearInterval(moveInterval)
      clearInterval(chompInterval)
    }
  }, [])

  const sprite = direction === 'right'
    ? (frame === 0 ? '/assets/sprites/run_right.png' : '/assets/sprites/run_right_1.png')
    : (frame === 0 ? '/assets/sprites/run_left.png' : '/assets/sprites/run_left_1.png')

  return (
    <div className="relative" style={{ width: size, height: size * 1.2 }}>
      <Image
        src={sprite}
        alt="Pac-Alexander"
        fill
        className="object-contain"
        style={{
          filter: 'brightness(1.3) contrast(1.2) saturate(2) hue-rotate(40deg)',
        }}
      />
      {/* Chomping mouth indicator */}
      <div
        className="absolute -right-2 top-1/4 w-3 h-3 rounded-full transition-transform"
        style={{
          background: PACMAN_YELLOW,
          transform: mouthOpen ? 'scale(1)' : 'scale(0.3)',
          boxShadow: `0 0 8px ${PACMAN_YELLOW}`,
        }}
      />
    </div>
  )
}

// Ghost SVG component
function Ghost({ color, size = 30, scared = false }: { color: string; size?: number; scared?: boolean }) {
  const displayColor = scared ? '#2121ff' : color
  return (
    <svg width={size} height={size} viewBox="0 0 14 16">
      <path
        d="M7,0 C3.1,0 0,3.1 0,7 L0,14 L2,12 L4,14 L6,12 L8,14 L10,12 L12,14 L14,12 L14,7 C14,3.1 10.9,0 7,0 Z"
        fill={displayColor}
      />
      <circle cx="4" cy="6" r="2" fill={scared ? '#fff' : '#fff'} />
      <circle cx="10" cy="6" r="2" fill={scared ? '#fff' : '#fff'} />
      <circle cx="5" cy="6" r="1" fill={scared ? '#fff' : '#000'} />
      <circle cx="11" cy="6" r="1" fill={scared ? '#fff' : '#000'} />
      {scared && (
        <path d="M3,10 L5,9 L7,10 L9,9 L11,10" stroke="#fff" strokeWidth="0.5" fill="none" />
      )}
    </svg>
  )
}

// Floating ghosts and dots
function MazeElements({ profession }: { profession: 'engineer' | 'drummer' | 'fighter' }) {
  const ghostColors = [GHOST_RED, GHOST_PINK, GHOST_CYAN, GHOST_ORANGE]

  const professionIcons = {
    engineer: ['💻', '⚙️', '🔧', '📡'],
    drummer: ['🥁', '🎵', '🎤', '🎶'],
    fighter: ['🥊', '💪', '⚔️', '🔥'],
  }

  const icons = professionIcons[profession]

  return (
    <div className="fixed inset-0 pointer-events-none z-[4] overflow-hidden">
      {/* Corner ghosts */}
      {ghostColors.map((color, i) => (
        <div
          key={`ghost-${i}`}
          className="absolute"
          style={{
            left: i < 2 ? `${3 + i * 4}%` : 'auto',
            right: i >= 2 ? `${3 + (i - 2) * 4}%` : 'auto',
            top: i % 2 === 0 ? '15%' : '75%',
            animation: `ghostFloat ${8 + i * 2}s ease-in-out infinite`,
            animationDelay: `${-i * 1.5}s`,
          }}
        >
          <Ghost color={color} size={35} />
        </div>
      ))}

      {/* Profession icons as power pellets */}
      {icons.map((icon, i) => (
        <div
          key={`icon-${i}`}
          className="absolute text-2xl"
          style={{
            left: i % 2 === 0 ? `${8 + i * 5}%` : 'auto',
            right: i % 2 === 1 ? `${8 + i * 5}%` : 'auto',
            top: `${40 + (i % 3) * 15}%`,
            filter: `drop-shadow(0 0 8px ${PACMAN_YELLOW})`,
            opacity: 0.6,
            animation: `pelletPulse ${3 + i}s ease-in-out infinite`,
          }}
        >
          {icon}
        </div>
      ))}

      <style jsx>{`
        @keyframes ghostFloat {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-10px) translateX(5px); }
          50% { transform: translateY(0) translateX(10px); }
          75% { transform: translateY(10px) translateX(5px); }
        }
        @keyframes pelletPulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.2); opacity: 1; }
        }
      `}</style>
    </div>
  )
}

// Waka-waka reveal animation
function WakaReveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const hasTriggered = useInViewTrigger(ref, { threshold: 0.15 })
  const [phase, setPhase] = useState<'hidden' | 'chomp' | 'revealed'>('hidden')

  useEffect(() => {
    if (hasTriggered && phase === 'hidden') {
      const timer = setTimeout(() => {
        setPhase('chomp')
        setTimeout(() => setPhase('revealed'), 400)
      }, delay)
      return () => clearTimeout(timer)
    }
  }, [hasTriggered, phase, delay])

  return (
    <div ref={ref} className="relative overflow-hidden">
      {phase === 'chomp' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="flex items-center gap-2" style={{ animation: 'wakaRun 0.4s ease-out forwards' }}>
            <div
              className="w-10 h-10 rounded-full"
              style={{
                background: PACMAN_YELLOW,
                clipPath: 'polygon(100% 50%, 50% 100%, 50% 0%)',
                animation: 'chomp 0.1s ease-in-out infinite',
                boxShadow: `0 0 20px ${PACMAN_YELLOW}`,
              }}
            />
            {/* Dots being eaten */}
            <div className="flex gap-3">
              {[0, 1, 2, 3].map(i => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: DOT_WHITE,
                    animation: `dotEat 0.4s ease-out ${i * 0.08}s forwards`,
                  }}
                />
              ))}
            </div>
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
      <style jsx>{`
        @keyframes wakaRun {
          0% { transform: translateX(-100px); }
          100% { transform: translateX(100%); }
        }
        @keyframes chomp {
          0%, 100% { clip-path: polygon(100% 35%, 50% 50%, 100% 65%, 100% 100%, 0% 100%, 0% 0%, 100% 0%); }
          50% { clip-path: polygon(100% 50%, 50% 50%, 100% 50%, 100% 100%, 0% 100%, 0% 0%, 100% 0%); }
        }
        @keyframes dotEat {
          0% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(0); }
        }
      `}</style>
    </div>
  )
}

// Maze-bordered frame
function MazeFrame({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="relative">
      {/* Maze-style border */}
      <div
        className="absolute inset-0 rounded-lg"
        style={{
          border: `4px solid ${MAZE_BLUE}`,
          boxShadow: `0 0 20px ${MAZE_BLUE}40, inset 0 0 20px ${MAZE_BLUE}20`,
        }}
      />

      {/* Corner dots */}
      {['-top-2 -left-2', '-top-2 -right-2', '-bottom-2 -left-2', '-bottom-2 -right-2'].map((pos, i) => (
        <div
          key={i}
          className={`absolute w-4 h-4 rounded-full ${pos}`}
          style={{
            background: POWER_PELLET,
            boxShadow: `0 0 10px ${POWER_PELLET}`,
            animation: 'pelletPulse 2s ease-in-out infinite',
            animationDelay: `${i * 0.3}s`,
          }}
        />
      ))}

      {/* Title */}
      <div
        className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1"
        style={{ background: BG_BLACK }}
      >
        <h2
          className="text-sm tracking-[0.3em] uppercase font-bold"
          style={{
            color: PACMAN_YELLOW,
            textShadow: `0 0 10px ${PACMAN_YELLOW}`,
          }}
        >
          {title}
        </h2>
      </div>

      <div className="pt-6 pb-4 px-6">
        {children}
      </div>

      <style jsx>{`
        @keyframes pelletPulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.3); opacity: 1; }
        }
      `}</style>
    </div>
  )
}

// Tech stack display
function TechPellets({ categories }: { categories: ReturnType<typeof getEngineerSkills> }) {
  return (
    <div className="space-y-6">
      {categories.slice(0, 5).map((category) => (
        <div key={category.name}>
          <h3 className="text-xs tracking-wider mb-3 flex items-center gap-2" style={{ color: GHOST_CYAN }}>
            <span>{category.icon}</span>
            {category.name.toUpperCase()}
          </h3>
          <div className="flex flex-wrap gap-2">
            {category.items.map((tech, i) => (
              <span
                key={tech}
                className="px-3 py-1 text-xs font-bold transition-all hover:scale-110 cursor-default"
                style={{
                  background: BG_BLACK,
                  border: `2px solid ${[GHOST_RED, GHOST_PINK, GHOST_CYAN, GHOST_ORANGE][i % 4]}`,
                  color: [GHOST_RED, GHOST_PINK, GHOST_CYAN, GHOST_ORANGE][i % 4],
                  borderRadius: '4px',
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
      {categories.map((category, catIdx) => (
        <div key={category.name}>
          <h3 className="text-xs tracking-wider mb-3 flex items-center gap-2" style={{ color: GHOST_CYAN }}>
            <span>{category.icon}</span>
            {category.name.toUpperCase()}
          </h3>
          <ul className="space-y-2">
            {category.skills.map((skill, i) => (
              <li key={skill.name} className="text-sm flex items-center gap-2" style={{ color: DOT_WHITE }}>
                <Ghost color={[GHOST_RED, GHOST_PINK, GHOST_CYAN, GHOST_ORANGE][(catIdx + i) % 4]} size={16} />
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
      className="p-4 rounded-lg"
      style={{
        background: BG_BLACK,
        border: `2px solid ${MAZE_BLUE}`,
      }}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="text-sm font-bold" style={{ color: DOT_WHITE }}>{entry.title}</h4>
          <p className="text-xs" style={{ color: PACMAN_YELLOW }}>{entry.organization}</p>
        </div>
        <span className="text-[10px]" style={{ color: '#888' }}>
          {startDisplay} - {endDisplay}
        </span>
      </div>
      <p className="text-xs mb-2" style={{ color: '#888' }}>{entry.description}</p>
      {entry.highlights && entry.highlights.length > 0 && (
        <ul className="space-y-1">
          {entry.highlights.map((highlight, i) => (
            <li key={i} className="text-xs flex items-start gap-2" style={{ color: DOT_WHITE }}>
              <span style={{ color: PACMAN_YELLOW }}>•</span>
              {highlight}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// Project card
function ProjectPellet({ project }: { project: typeof PROJECTS_DATA[0] }) {
  const ghostColor = [GHOST_RED, GHOST_PINK, GHOST_CYAN, GHOST_ORANGE][Math.floor(Math.random() * 4)]

  return (
    <div
      className="p-4 transition-all hover:scale-[1.02] cursor-pointer group rounded-lg"
      style={{
        background: BG_BLACK,
        border: `2px solid ${project.featured ? PACMAN_YELLOW : MAZE_BLUE}`,
        boxShadow: project.featured ? `0 0 15px ${PACMAN_YELLOW}40` : 'none',
      }}
    >
      {project.featured && (
        <span className="text-[10px] tracking-wider font-bold flex items-center gap-1" style={{ color: PACMAN_YELLOW }}>
          <span className="w-3 h-3 rounded-full inline-block" style={{ background: POWER_PELLET }} />
          POWER PELLET
        </span>
      )}
      <h4 className="text-sm mt-1 font-bold group-hover:text-yellow-300 transition-colors" style={{ color: DOT_WHITE }}>
        {project.name}
      </h4>
      <p className="text-xs mt-2" style={{ color: '#888' }}>{project.tagline}</p>
      {project.impact && (
        <p className="text-xs mt-2 font-bold" style={{ color: PACMAN_YELLOW }}>
          🟡 {project.impact}
        </p>
      )}
      <div className="flex flex-wrap gap-1 mt-3">
        {project.techStack.slice(0, 4).map((tech, i) => (
          <span
            key={tech}
            className="text-[8px] px-1.5 py-0.5 font-bold rounded"
            style={{
              background: `${[GHOST_RED, GHOST_PINK, GHOST_CYAN, GHOST_ORANGE][i % 4]}30`,
              color: [GHOST_RED, GHOST_PINK, GHOST_CYAN, GHOST_ORANGE][i % 4],
            }}
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  )
}

// Company card
function CompanyPellet({ company }: { company: typeof COMPANIES[0] }) {
  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 transition-all hover:scale-[1.02] group rounded-lg"
      style={{
        background: BG_BLACK,
        border: `2px solid ${MAZE_BLUE}`,
      }}
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{company.icon}</span>
        <div>
          <h4 className="text-sm font-bold group-hover:text-yellow-300 transition-colors" style={{ color: DOT_WHITE }}>
            {company.name}
          </h4>
          <p className="text-[10px]" style={{ color: PACMAN_YELLOW }}>{company.tagline}</p>
        </div>
      </div>
      <p className="text-xs" style={{ color: '#888' }}>{company.description}</p>
    </a>
  )
}

// Band card
function BandPellet({ band }: { band: typeof BANDS[0] }) {
  const content = (
    <div
      className="p-4 transition-all hover:scale-[1.02] group rounded-lg"
      style={{
        background: BG_BLACK,
        border: `2px solid ${MAZE_BLUE}`,
      }}
    >
      <h4 className="text-sm font-bold group-hover:text-yellow-300 transition-colors" style={{ color: DOT_WHITE }}>
        {band.name}
      </h4>
      <p className="text-[10px] mt-1" style={{ color: PACMAN_YELLOW }}>{band.genre} • {band.role}</p>
      <p className="text-xs mt-2" style={{ color: '#888' }}>{band.description}</p>
    </div>
  )

  if (band.url) {
    return <a href={band.url} target="_blank" rel="noopener noreferrer" className="block">{content}</a>
  }
  return content
}

// Profession selector - ghost style
function GhostSelector({
  active,
  onSelect,
}: {
  active: 'engineer' | 'drummer' | 'fighter'
  onSelect: (p: 'engineer' | 'drummer' | 'fighter') => void
}) {
  const ghosts = [
    { id: 'engineer', color: GHOST_CYAN, label: 'Inky', desc: 'Engineer' },
    { id: 'drummer', color: GHOST_PINK, label: 'Pinky', desc: 'Musician' },
    { id: 'fighter', color: GHOST_RED, label: 'Blinky', desc: 'Fighter' },
  ] as const

  return (
    <div className="flex justify-center gap-10 py-8">
      {ghosts.map((ghost) => (
        <button
          key={ghost.id}
          onClick={() => onSelect(ghost.id)}
          className="relative group flex flex-col items-center"
        >
          <div
            className={`transition-all duration-300 ${
              active === ghost.id ? 'scale-125' : 'hover:scale-110'
            }`}
            style={{
              filter: active === ghost.id ? `drop-shadow(0 0 15px ${ghost.color})` : 'none',
            }}
          >
            <Ghost color={ghost.color} size={60} scared={active !== ghost.id} />
          </div>
          <span
            className="text-sm font-bold mt-2 tracking-wider"
            style={{ color: active === ghost.id ? ghost.color : '#444' }}
          >
            {ghost.label}
          </span>
          <span className="text-[10px]" style={{ color: active === ghost.id ? DOT_WHITE : '#333' }}>
            {ghost.desc}
          </span>
        </button>
      ))}
    </div>
  )
}

// Score display
function ScoreDisplay({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs" style={{ color: '#888' }}>HIGH SCORE</span>
      <span
        className="text-lg font-bold tracking-wider"
        style={{
          color: DOT_WHITE,
          fontFamily: 'monospace',
        }}
      >
        {score.toString().padStart(6, '0')}
      </span>
    </div>
  )
}

export default function RetroAtomicTheme() {
  useTheme()
  const { active, setActive } = useProfession()
  const [mounted, setMounted] = useState(false)
  const [score, setScore] = useState(0)

  const aboutData = ABOUT_DATA[active]
  const engineerTech = getEngineerSkills()
  const otherSkills = getSkillsByProfession(active)
  const projects = PROJECTS_DATA.filter(p => p.professions.includes(active) || p.featured)
  const experience = filterExperienceByProfession(EXPERIENCE_DATA, active)

  useEffect(() => {
    setMounted(true)
    // Increment score for fun
    const interval = setInterval(() => setScore(s => s + 10), 1000)
    return () => clearInterval(interval)
  }, [])

  if (!mounted) return null

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: BG_BLACK,
        fontFamily: '"Press Start 2P", "Courier New", monospace',
      }}
    >
      {/* Dot pattern background */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `radial-gradient(${DOT_WHITE}10 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
        }}
      />

      {/* Floating ghosts and elements */}
      <MazeElements profession={active} />

      {/* Running Pac-Alexander */}
      <div
        className="fixed top-20 z-[6] pointer-events-none"
        style={{ animation: 'pacRun 15s linear infinite' }}
      >
        <PacManAlexander size={40} direction="right" />
      </div>
      <style jsx global>{`
        @keyframes pacRun {
          0% { left: -60px; }
          100% { left: calc(100% + 60px); }
        }
      `}</style>

      {/* Header */}
      <header className="relative z-30 p-6">
        <div className="max-w-6xl mx-auto flex justify-between items-start">
          <div>
            <h1
              className="text-3xl font-bold tracking-wide"
              style={{
                color: PACMAN_YELLOW,
                textShadow: `0 0 20px ${PACMAN_YELLOW}80`,
              }}
            >
              ALEXANDER PULIDO
            </h1>
            <p className="text-sm mt-2" style={{ color: DOT_WHITE }}>
              {PROFESSIONAL_SUMMARY.headline}
            </p>
            <p className="text-xs mt-1" style={{ color: GHOST_CYAN }}>
              {PROFESSIONAL_SUMMARY.tagline}
            </p>
          </div>

          <div className="flex flex-col items-end gap-4">
            <ScoreDisplay score={score} />
            <div className="flex gap-4 items-center">
              <Link
                href="/cv"
                className="px-4 py-2 text-xs font-bold tracking-wider transition-all hover:scale-105 rounded"
                style={{
                  background: BG_BLACK,
                  border: `2px solid ${MAZE_BLUE}`,
                  color: MAZE_BLUE,
                }}
              >
                1UP CV
              </Link>
              <Link
                href="/personal-projects/game-engine"
                className="px-4 py-2 text-xs font-bold tracking-wider transition-all hover:scale-105 rounded"
                style={{
                  background: BG_BLACK,
                  border: `2px solid ${PACMAN_YELLOW}`,
                  color: PACMAN_YELLOW,
                }}
              >
                NEBULITH
              </Link>
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </header>

      {/* Current Roles */}
      <section className="relative z-20 py-4 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-8">
            {CURRENT_ROLES.map((role, i) => (
              <div key={role.id} className="text-center">
                <Ghost color={[GHOST_RED, GHOST_PINK, GHOST_CYAN][i % 3]} size={24} />
                <p className="text-xs font-bold mt-1" style={{ color: [GHOST_RED, GHOST_PINK, GHOST_CYAN][i % 3] }}>
                  {role.title}
                </p>
                <p className="text-sm" style={{ color: DOT_WHITE }}>{role.company}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ghost Profession Selector */}
      <section className="relative z-20 py-4">
        <GhostSelector active={active} onSelect={setActive} />
      </section>

      {/* About */}
      <section className="relative z-20 py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <WakaReveal>
            <MazeFrame title="About">
              <p className="text-sm leading-relaxed mb-4" style={{ color: DOT_WHITE }}>
                {aboutData.bio}
              </p>
              <div className="flex flex-wrap gap-3">
                {aboutData.quickFacts.map((fact, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-xs font-bold rounded"
                    style={{
                      background: `${[GHOST_RED, GHOST_PINK, GHOST_CYAN, GHOST_ORANGE][i % 4]}20`,
                      border: `1px solid ${[GHOST_RED, GHOST_PINK, GHOST_CYAN, GHOST_ORANGE][i % 4]}`,
                      color: [GHOST_RED, GHOST_PINK, GHOST_CYAN, GHOST_ORANGE][i % 4],
                    }}
                  >
                    {fact}
                  </span>
                ))}
              </div>
            </MazeFrame>
          </WakaReveal>
        </div>
      </section>

      {/* Work Experience */}
      {experience.length > 0 && (
        <section className="relative z-20 py-8 px-6">
          <div className="max-w-4xl mx-auto">
            <WakaReveal delay={100}>
              <MazeFrame title="Work Experience">
                <div className="space-y-4">
                  {experience.map((entry) => (
                    <ExperienceCard key={entry.id} entry={entry} />
                  ))}
                </div>
              </MazeFrame>
            </WakaReveal>
          </div>
        </section>
      )}

      {/* Tech Stack / Skills */}
      <section className="relative z-20 py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <WakaReveal delay={100}>
            <MazeFrame title={active === 'engineer' ? 'Tech Stack' : 'Skills'}>
              {active === 'engineer' ? (
                <TechPellets categories={engineerTech} />
              ) : (
                <SkillsList categories={otherSkills} />
              )}
            </MazeFrame>
          </WakaReveal>
        </div>
      </section>

      {/* Projects */}
      <section className="relative z-20 py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <WakaReveal delay={100}>
            <MazeFrame title="Projects">
              <div className="grid md:grid-cols-2 gap-4">
                {projects.filter(p => p.featured).slice(0, 6).map((project) => (
                  <ProjectPellet key={project.id} project={project} />
                ))}
              </div>
            </MazeFrame>
          </WakaReveal>
        </div>
      </section>

      {/* Companies (Engineer) / Bands (Drummer) */}
      {active === 'engineer' && (
        <section className="relative z-20 py-8 px-6">
          <div className="max-w-4xl mx-auto">
            <WakaReveal delay={100}>
              <MazeFrame title="Companies">
                <div className="grid md:grid-cols-3 gap-4">
                  {COMPANIES.map((company) => (
                    <CompanyPellet key={company.id} company={company} />
                  ))}
                </div>
              </MazeFrame>
            </WakaReveal>
          </div>
        </section>
      )}

      {active === 'drummer' && (
        <section className="relative z-20 py-8 px-6">
          <div className="max-w-4xl mx-auto">
            <WakaReveal delay={100}>
              <MazeFrame title="Bands">
                <div className="grid md:grid-cols-3 gap-4">
                  {BANDS.map((band) => (
                    <BandPellet key={band.id} band={band} />
                  ))}
                </div>
              </MazeFrame>
            </WakaReveal>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="relative z-20 py-12 text-center">
        <div className="flex justify-center gap-4 mb-4">
          <Ghost color={GHOST_RED} size={30} />
          <Ghost color={GHOST_PINK} size={30} />
          <Ghost color={GHOST_CYAN} size={30} />
          <Ghost color={GHOST_ORANGE} size={30} />
        </div>
        <p className="text-sm font-bold" style={{ color: PACMAN_YELLOW }}>
          READY!
        </p>
        <p className="text-xs mt-2" style={{ color: '#444' }}>
          INSERT COIN TO CONTINUE
        </p>
        <div className="flex justify-center gap-3 mt-4">
          {[0, 1, 2, 3, 4].map(i => (
            <div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{ background: DOT_WHITE, opacity: 0.6 }}
            />
          ))}
        </div>
      </footer>
    </div>
  )
}
