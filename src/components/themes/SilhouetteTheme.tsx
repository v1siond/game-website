'use client'

import React from 'react'
import Link from 'next/link'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import { useProfession } from '@/contexts/ProfessionContext'
import { ABOUT_DATA, PROFESSIONAL_SUMMARY } from '@/data/about'
import { PROJECTS_DATA } from '@/data/projects'
import { getEngineerSkills } from '@/data/skills'
import { getAchievementsByProfession, WORK_EXPERIENCE, type AchievementCategory } from '@/data/achievements'
import { CURRENT_ROLES } from '@/data/roles'
import { COMPANIES } from '@/data/companies'
import { BANDS } from '@/data/bands'
import { EXPERIENCE_DATA, filterExperienceByProfession } from '@/data/experience'

// =============================================================================
// LIMBO AESTHETIC - Pure black/white/grey, heavy film grain, stark silhouettes
// NO animations that hide content - everything immediately visible
// =============================================================================

// Limbo-style atmospheric fog - purely decorative, does not hide content
function LimboAtmosphere() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[2] overflow-hidden" aria-hidden="true">
      {/* Heavy film grain overlay - characteristic Limbo texture */}
      <div
        className="absolute inset-0 opacity-25 grain mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='6' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
      {/* Secondary grain layer */}
      <div
        className="absolute inset-0 opacity-15 grain-secondary mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise2'%3E%3CfeTurbulence type='turbulence' baseFrequency='1.2' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise2)'/%3E%3C/svg%3E")`,
        }}
      />
      {/* Fog layer - slow drift */}
      <div
        className="absolute inset-0 fog-drift"
        style={{
          background: `linear-gradient(90deg, transparent 0%, rgba(180,180,180,0.12) 30%, rgba(200,200,200,0.15) 50%, rgba(180,180,180,0.12) 70%, transparent 100%)`,
        }}
      />
      {/* Heavy vignette - Limbo's dark edges */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, transparent 25%, rgba(0,0,0,0.3) 65%, rgba(0,0,0,0.65) 100%)',
        }}
      />
      {/* Top/bottom noir gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0.35) 0%, transparent 12%, transparent 88%, rgba(0,0,0,0.45) 100%)',
        }}
      />
    </div>
  )
}

// Spider web decoration - iconic Limbo motif
function SpiderWebDecoration({ position, size = 180 }: {
  position: 'top-left' | 'top-right'
  size?: number
}) {
  const isRight = position === 'top-right'
  return (
    <div
      className={`fixed top-0 ${isRight ? 'right-0 scale-x-[-1]' : 'left-0'} pointer-events-none z-[3] opacity-20`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <g stroke="#000" strokeWidth="1" fill="none">
          <line x1="0" y1="0" x2="200" y2="200" />
          <line x1="0" y1="0" x2="200" y2="100" />
          <line x1="0" y1="0" x2="200" y2="50" />
          <line x1="0" y1="0" x2="100" y2="200" />
          <line x1="0" y1="0" x2="50" y2="200" />
          <line x1="0" y1="0" x2="150" y2="200" />
        </g>
        <g stroke="#000" strokeWidth="0.5" fill="none">
          <path d="M20,20 Q50,10 80,20 Q90,50 80,80 Q50,90 20,80 Q10,50 20,20" />
          <path d="M40,40 Q80,25 120,40 Q135,80 120,120 Q80,135 40,120 Q25,80 40,40" />
          <path d="M60,60 Q110,40 160,60 Q180,110 160,160 Q110,180 60,160 Q40,110 60,60" />
        </g>
        <g fill="#fff" opacity="0.5">
          <circle cx="30" cy="30" r="1" />
          <circle cx="60" cy="25" r="0.7" />
          <circle cx="90" cy="45" r="1" />
        </g>
      </svg>
    </div>
  )
}

// Gnarled branches/tendrils in corners
function CornerTendrils() {
  return (
    <>
      <div className="fixed top-0 left-0 w-56 h-56 pointer-events-none z-[3] opacity-40" aria-hidden="true">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <path d="M0,0 Q35,90 15,170 M0,20 Q55,100 35,180 M20,0 Q70,65 60,150" stroke="#000" strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M25,70 Q40,80 32,100 M50,55 Q70,68 62,88" stroke="#000" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      </div>
      <div className="fixed top-0 right-0 w-56 h-56 pointer-events-none z-[3] opacity-40 scale-x-[-1]" aria-hidden="true">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <path d="M0,0 Q35,90 15,170 M0,20 Q55,100 35,180" stroke="#000" strokeWidth="5" fill="none" strokeLinecap="round" />
        </svg>
      </div>
    </>
  )
}

// Industrial gears - Limbo machinery
function IndustrialMachinery() {
  return (
    <div className="fixed bottom-0 right-0 pointer-events-none z-[3] opacity-15" aria-hidden="true">
      <div className="relative w-52 h-40">
        <svg viewBox="0 0 200 150" className="w-full h-full">
          {/* Large gear */}
          <g className="slow-rotate" style={{ transformOrigin: '160px 110px' }}>
            <circle cx="160" cy="110" r="28" fill="none" stroke="#000" strokeWidth="4" />
            <circle cx="160" cy="110" r="8" fill="#000" />
            {[...Array(14)].map((_, i) => {
              const angle = (i * 360 / 14) * Math.PI / 180
              return (
                <line
                  key={i}
                  x1={160 + 26 * Math.cos(angle)}
                  y1={110 + 26 * Math.sin(angle)}
                  x2={160 + 38 * Math.cos(angle)}
                  y2={110 + 38 * Math.sin(angle)}
                  stroke="#000"
                  strokeWidth="5"
                />
              )
            })}
          </g>
          {/* Small gear */}
          <g className="slow-rotate-reverse" style={{ transformOrigin: '110px 90px' }}>
            <circle cx="110" cy="90" r="18" fill="none" stroke="#000" strokeWidth="3" />
            <circle cx="110" cy="90" r="5" fill="#000" />
            {[...Array(10)].map((_, i) => {
              const angle = (i * 36) * Math.PI / 180
              return (
                <line
                  key={i}
                  x1={110 + 16 * Math.cos(angle)}
                  y1={90 + 16 * Math.sin(angle)}
                  x2={110 + 24 * Math.cos(angle)}
                  y2={90 + 24 * Math.sin(angle)}
                  stroke="#000"
                  strokeWidth="4"
                />
              )
            })}
          </g>
          {/* Pipes */}
          <rect x="170" y="0" width="6" height="150" fill="#000" />
          <rect x="140" y="70" width="40" height="5" fill="#000" />
        </svg>
      </div>
    </div>
  )
}

// Watching eyes in darkness - eerie ambient element
function WatchingEyes() {
  const positions = [
    { x: 10, y: 20 }, { x: 88, y: 16 }, { x: 7, y: 52 },
    { x: 91, y: 45 }, { x: 14, y: 75 }, { x: 86, y: 70 },
  ]
  return (
    <div className="fixed inset-0 pointer-events-none z-[3]" aria-hidden="true">
      {positions.map((pos, i) => (
        <div
          key={i}
          className="absolute eyes-fade"
          style={{
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            animationDelay: `${i * 1.2}s`,
          }}
        >
          <div className="flex gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-white" style={{ boxShadow: '0 0 6px #fff, 0 0 12px rgba(255,255,255,0.4)' }} />
            <div className="w-1.5 h-1.5 rounded-full bg-white" style={{ boxShadow: '0 0 6px #fff, 0 0 12px rgba(255,255,255,0.4)' }} />
          </div>
        </div>
      ))}
    </div>
  )
}

// Limbo boy silhouette - decorative, bottom of screen
function BoySilhouette() {
  return (
    <div className="fixed bottom-24 left-[10%] w-10 h-16 pointer-events-none z-[4] opacity-25 boy-walk" aria-hidden="true">
      <svg viewBox="0 0 40 70" className="w-full h-full">
        <ellipse cx="20" cy="10" rx="8" ry="9" fill="#000" />
        <ellipse cx="17" cy="9" rx="1.5" ry="1" fill="#fff" />
        <ellipse cx="23" cy="9" rx="1.5" ry="1" fill="#fff" />
        <path d="M20,19 L20,38 M20,24 L12,32 M20,24 L28,30 M20,38 L14,56 M20,38 L26,54" stroke="#000" strokeWidth="4" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  )
}

// Giant spider silhouette - decorative
function SpiderSilhouette() {
  return (
    <div className="fixed bottom-32 right-[8%] w-28 h-20 pointer-events-none z-[3] opacity-15 spider-idle" aria-hidden="true">
      <svg viewBox="0 0 160 120" className="w-full h-full">
        <ellipse cx="80" cy="60" rx="28" ry="18" fill="#000" />
        <ellipse cx="80" cy="44" rx="15" ry="11" fill="#000" />
        {/* Eyes */}
        <circle cx="73" cy="40" r="2.5" fill="#fff" opacity="0.7" />
        <circle cx="87" cy="40" r="2.5" fill="#fff" opacity="0.7" />
        <circle cx="80" cy="37" r="1.5" fill="#fff" opacity="0.5" />
        {/* Legs */}
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <path d={`M52,${48 + i * 8} Q${28 - i * 4},${40 + i * 12} ${10 - i * 2},${80 + i * 10}`} stroke="#000" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d={`M108,${48 + i * 8} Q${132 + i * 4},${40 + i * 12} ${150 + i * 2},${80 + i * 10}`} stroke="#000" strokeWidth="4" fill="none" strokeLinecap="round" />
          </g>
        ))}
      </svg>
    </div>
  )
}

// =============================================================================
// LIMBO-STYLE SECTION CARDS - Heavy film grain, torn edges, industrial rust
// =============================================================================

// Base card with Limbo textures
function LimboCard({ children, className = '', ariaLabel }: {
  children: React.ReactNode
  className?: string
  ariaLabel?: string
}) {
  return (
    <div
      className={`relative ${className}`}
      role={ariaLabel ? 'region' : undefined}
      aria-label={ariaLabel}
      style={{
        background: 'linear-gradient(135deg, #1a1a1a 0%, #222 50%, #1a1a1a 100%)',
        borderLeft: '4px solid #000',
        boxShadow: '6px 6px 0 rgba(0,0,0,0.6), inset 0 0 30px rgba(0,0,0,0.3)',
      }}
    >
      {/* Film grain overlay on card */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 128 128' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />
      {/* Torn paper edge effect - top */}
      <div
        className="absolute top-0 left-0 right-0 h-1 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, #333 10%, transparent 15%, #2a2a2a 25%, transparent 30%, #333 40%, transparent 50%, #2a2a2a 60%, transparent 70%, #333 80%, transparent 90%)',
        }}
        aria-hidden="true"
      />
      {/* Industrial rust texture - corners */}
      <div
        className="absolute top-0 right-0 w-12 h-12 pointer-events-none opacity-30"
        style={{
          background: 'radial-gradient(circle at 100% 0%, #4a4a4a 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 w-16 h-16 pointer-events-none opacity-20"
        style={{
          background: 'radial-gradient(circle at 0% 100%, #3a3a3a 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />
      {/* Corner brackets */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white/15" aria-hidden="true" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white/15" aria-hidden="true" />
      {/* Content */}
      <div className="relative z-10 p-5">
        {children}
      </div>
    </div>
  )
}

// Stark item card for projects, companies, bands
function LimboItemCard({ children, href, className = '' }: {
  children: React.ReactNode
  href?: string
  className?: string
}) {
  const cardStyle = {
    background: 'linear-gradient(145deg, #1c1c1c 0%, #252525 100%)',
    border: '2px solid #000',
    boxShadow: '4px 4px 0 #000, inset 0 0 20px rgba(0,0,0,0.4)',
  }

  const content = (
    <div className="relative" style={cardStyle}>
      {/* Film grain */}
      <div
        className="absolute inset-0 pointer-events-none opacity-15 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />
      {/* Torn edge top */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, #333, transparent 20%, #444 40%, transparent 60%, #333 80%, transparent)',
        }}
        aria-hidden="true"
      />
      <div className={`relative z-10 p-4 ${className}`}>
        {children}
      </div>
    </div>
  )

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block transition-transform hover:translate-x-0.5 hover:translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white group"
      >
        {content}
      </a>
    )
  }
  return content
}

// =============================================================================
// CV CONTENT COMPONENTS - All content immediately visible, no hiding animations
// =============================================================================

// Profession selector silhouettes
function SilhouetteFigure({
  profession,
  isActive,
  onClick,
}: {
  profession: 'engineer' | 'drummer' | 'fighter'
  isActive: boolean
  onClick: () => void
}) {
  const labels = {
    engineer: 'the architect',
    drummer: 'the artist',
    fighter: 'the warrior',
  }

  return (
    <button
      onClick={onClick}
      aria-label={`Select ${profession} profession`}
      aria-pressed={isActive}
      className={`relative transition-all duration-300 group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${
        isActive ? 'scale-110' : 'opacity-30 hover:opacity-50'
      }`}
    >
      <div className="relative w-16 h-24">
        <svg viewBox="0 0 60 80" className="w-full h-full" aria-hidden="true">
          {profession === 'engineer' && (
            <>
              <ellipse cx="30" cy="12" rx="10" ry="11" fill="#000" />
              <ellipse cx="27" cy="11" rx="1.5" ry="1" fill="#fff" />
              <ellipse cx="33" cy="11" rx="1.5" ry="1" fill="#fff" />
              <rect x="15" y="23" width="30" height="35" fill="#000" rx="3" />
              <rect x="10" y="58" width="10" height="20" fill="#000" />
              <rect x="40" y="58" width="10" height="20" fill="#000" />
              <rect x="20" y="28" width="20" height="12" fill={isActive ? '#444' : '#222'} rx="1" />
              <rect x="18" y="40" width="24" height="3" fill={isActive ? '#333' : '#111'} />
            </>
          )}
          {profession === 'drummer' && (
            <>
              <ellipse cx="30" cy="12" rx="10" ry="11" fill="#000" />
              <ellipse cx="27" cy="11" rx="1.5" ry="1" fill="#fff" />
              <ellipse cx="33" cy="11" rx="1.5" ry="1" fill="#fff" />
              <path d="M20,23 L40,23 L38,50 L22,50 Z" fill="#000" />
              <rect x="12" y="50" width="8" height="20" fill="#000" />
              <rect x="40" y="50" width="8" height="20" fill="#000" />
              <line x1="8" y1="18" x2="2" y2="38" stroke="#000" strokeWidth="3" strokeLinecap="round" />
              <line x1="52" y1="18" x2="58" y2="38" stroke="#000" strokeWidth="3" strokeLinecap="round" />
            </>
          )}
          {profession === 'fighter' && (
            <>
              <ellipse cx="30" cy="12" rx="10" ry="11" fill="#000" />
              <ellipse cx="27" cy="11" rx="1.5" ry="1" fill="#fff" />
              <ellipse cx="33" cy="11" rx="1.5" ry="1" fill="#fff" />
              <path d="M18,23 L42,23 L40,50 L20,50 Z" fill="#000" />
              <rect x="14" y="50" width="10" height="22" fill="#000" />
              <rect x="36" y="50" width="10" height="22" fill="#000" />
              <path d="M4,28 L18,24 L20,34 L6,36 Z" fill="#000" />
              <path d="M56,28 L42,24 L40,34 L54,36 Z" fill="#000" />
            </>
          )}
        </svg>
      </div>

      {isActive && (
        <div
          className="absolute inset-0 -z-10 blur-xl"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.25), transparent 50%)' }}
          aria-hidden="true"
        />
      )}

      <span className="block mt-1.5 text-xs tracking-[0.25em] uppercase" style={{ color: isActive ? '#d0d0d0' : '#555' }}>
        {labels[profession]}
      </span>
    </button>
  )
}

// Tech tag - monochrome
function TechTag({ name }: { name: string }) {
  return (
    <span
      className="inline-block px-2 py-1 text-xs tracking-wider uppercase transition-colors hover:bg-white hover:text-black"
      style={{ background: 'transparent', border: '1px solid #666', color: '#b0b0b0' }}
    >
      {name}
    </span>
  )
}

// Tech cloud for engineer - NO skill bars, just categories
function TechCloud({ categories }: { categories: ReturnType<typeof getEngineerSkills> }) {
  return (
    <div className="space-y-4" role="list" aria-label="Technical skills by category">
      {categories.map((category) => (
        <div key={category.name} role="listitem">
          <h4 className="text-xs tracking-[0.25em] uppercase mb-2 flex items-center gap-2" style={{ color: '#777' }}>
            <span className="text-sm grayscale">{category.icon}</span>
            {category.name}
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {category.items.map((tech) => (
              <TechTag key={tech} name={tech} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// Achievements list for drummer/fighter - NO meaningless bars
function AchievementsList({ categories }: { categories: AchievementCategory[] }) {
  return (
    <div className="grid md:grid-cols-3 gap-5" role="list" aria-label="Achievements by category">
      {categories.map((category) => (
        <div key={category.name} role="listitem">
          <h4 className="text-xs tracking-[0.25em] uppercase mb-3 flex items-center gap-2" style={{ color: '#777' }}>
            <span className="text-sm grayscale">{category.icon}</span>
            {category.name}
          </h4>
          <ul className="space-y-2">
            {category.achievements.map((achievement) => (
              <li key={achievement.title} style={{ color: '#b0b0b0' }}>
                <div className="flex items-baseline gap-2">
                  <span style={{ color: '#555' }} aria-hidden="true">-</span>
                  {achievement.link ? (
                    <a
                      href={achievement.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-white focus-visible:outline focus-visible:outline-1 focus-visible:outline-white"
                    >
                      {achievement.title}
                    </a>
                  ) : (
                    <span>{achievement.title}</span>
                  )}
                  {achievement.metric && (
                    <span className="text-xs" style={{ color: '#666' }}>{achievement.metric}</span>
                  )}
                </div>
                {achievement.description && (
                  <p className="text-xs ml-3 mt-0.5" style={{ color: '#666' }}>{achievement.description}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

// Section header with divider
function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="flex-1 h-px bg-white/15" aria-hidden="true" />
      <h2 className="text-xs tracking-[0.4em] uppercase" style={{ color: '#888' }}>{title}</h2>
      <div className="flex-1 h-px bg-white/15" aria-hidden="true" />
    </div>
  )
}

// Experience card
function ExperienceCard({ entry }: { entry: typeof EXPERIENCE_DATA[0] }) {
  const startYear = new Date(entry.startDate).getFullYear()
  const endYear = entry.endDate ? new Date(entry.endDate).getFullYear() : 'Present'

  return (
    <article className="p-4" style={{
      background: 'rgba(25,25,25,0.9)',
      borderLeft: '3px solid #000',
      boxShadow: '4px 4px 0 rgba(0,0,0,0.5)',
    }}>
      <div className="flex justify-between items-start mb-1">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: '#c0c0c0' }}>{entry.title}</h4>
          <p className="text-xs tracking-wider mt-0.5" style={{ color: '#888' }}>{entry.organization}</p>
        </div>
        <span className="text-xs tracking-wider uppercase" style={{ color: '#666' }}>{startYear} - {endYear}</span>
      </div>
      <p className="text-sm leading-relaxed mt-2" style={{ color: '#999' }}>{entry.description}</p>
      {entry.highlights && entry.highlights.length > 0 && (
        <ul className="mt-2 space-y-0.5">
          {entry.highlights.map((highlight, i) => (
            <li key={i} className="text-xs flex items-start gap-1.5" style={{ color: '#a0a0a0' }}>
              <span style={{ color: '#555' }} aria-hidden="true">-</span>
              {highlight}
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

// Project card
function ProjectCard({ project }: { project: typeof PROJECTS_DATA[0] }) {
  return (
    <LimboItemCard>
      {project.featured && (
        <span className="text-xs tracking-[0.15em] uppercase" style={{ color: '#555' }}>[ featured ]</span>
      )}
      <h4 className="text-xs font-bold mt-0.5 uppercase tracking-wider" style={{ color: '#c0c0c0' }}>{project.name}</h4>
      <p className="text-xs mt-0.5" style={{ color: '#777' }}>{project.tagline}</p>
      {project.impact && (
        <p className="text-xs mt-1.5 italic" style={{ color: '#999' }}>{'-> '}{project.impact}</p>
      )}
      <div className="flex gap-1.5 flex-wrap mt-2">
        {project.techStack.slice(0, 4).map((tech) => (
          <span key={tech} className="text-xs px-1.5 py-0.5 uppercase tracking-wider" style={{ background: '#000', color: '#999' }}>
            {tech}
          </span>
        ))}
      </div>
    </LimboItemCard>
  )
}

// Company card
function CompanyCard({ company }: { company: typeof COMPANIES[0] }) {
  return (
    <LimboItemCard href={company.url}>
      <div className="flex items-start gap-2 mb-1">
        <span className="text-base grayscale contrast-200">{company.icon}</span>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider group-hover:underline" style={{ color: '#c0c0c0' }}>{company.name}</h4>
          <p className="text-xs tracking-wider" style={{ color: '#777' }}>{company.tagline}</p>
        </div>
      </div>
      <p className="text-sm leading-relaxed" style={{ color: '#999' }}>{company.description}</p>
    </LimboItemCard>
  )
}

// Band card
function BandCard({ band }: { band: typeof BANDS[0] }) {
  return (
    <LimboItemCard href={band.url || undefined}>
      <h4 className="text-xs font-bold uppercase tracking-wider group-hover:underline" style={{ color: '#c0c0c0' }}>{band.name}</h4>
      <p className="text-xs tracking-wider mt-0.5" style={{ color: '#777' }}>{band.genre} | {band.role}</p>
      <p className="text-sm leading-relaxed mt-1.5" style={{ color: '#999' }}>{band.description}</p>
      {!band.url && (
        <p className="text-xs mt-1.5 uppercase tracking-wider" style={{ color: '#444' }}>[ website coming ]</p>
      )}
    </LimboItemCard>
  )
}

// Work experience card (from achievements data)
function WorkCard({ work }: { work: typeof WORK_EXPERIENCE[0] }) {
  return (
    <article className="p-4" style={{
      background: 'rgba(25,25,25,0.9)',
      borderLeft: '3px solid #000',
      boxShadow: '4px 4px 0 rgba(0,0,0,0.5)',
    }}>
      <div className="flex justify-between items-start mb-1">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: '#c0c0c0' }}>{work.title}</h4>
          <p className="text-xs tracking-wider mt-0.5" style={{ color: '#888' }}>{work.company}</p>
        </div>
        <span className="text-xs tracking-wider uppercase" style={{ color: work.current ? '#888' : '#555' }}>{work.period}</span>
      </div>
      <ul className="mt-2 space-y-1">
        {work.highlights.map((highlight, i) => (
          <li key={i} className="text-xs flex items-start gap-1.5" style={{ color: '#a0a0a0' }}>
            <span style={{ color: '#555' }} aria-hidden="true">-</span>
            {highlight}
          </li>
        ))}
      </ul>
      {work.technologies && (
        <div className="flex gap-1.5 flex-wrap mt-2">
          {work.technologies.map((tech) => (
            <span key={tech} className="text-xs px-1 py-0.5 uppercase" style={{ border: '1px solid #444', color: '#777' }}>
              {tech}
            </span>
          ))}
        </div>
      )}
    </article>
  )
}

// =============================================================================
// MAIN THEME COMPONENT
// =============================================================================

export default function SilhouetteTheme() {
  const { active, setActive, config } = useProfession()

  const aboutData = ABOUT_DATA[active]
  const engineerSkills = getEngineerSkills()
  const achievements = getAchievementsByProfession(active)
  const projects = PROJECTS_DATA.filter(p => p.professions.includes(active) || p.featured)
  const experience = filterExperienceByProfession(EXPERIENCE_DATA, active)

  return (
    <div
      className="min-h-screen relative"
      style={{
        background: 'linear-gradient(180deg, #a0a0a0 0%, #808080 25%, #686868 55%, #505050 100%)',
        fontFamily: '"Courier New", Consolas, monospace',
        overflowX: 'hidden',
      }}
    >
      {/* Limbo atmospheric effects - decorative only */}
      <LimboAtmosphere />
      <SpiderWebDecoration position="top-left" size={160} />
      <SpiderWebDecoration position="top-right" size={140} />
      <CornerTendrils />
      <IndustrialMachinery />
      <WatchingEyes />
      <BoySilhouette />
      <SpiderSilhouette />

      {/* Header - immediately visible */}
      <header className="relative z-30 p-6" role="banner">
        <div className="max-w-3xl mx-auto flex justify-between items-start">
          <div>
            <h1 className="text-2xl tracking-[0.5em] font-normal" style={{ color: '#1a1a1a' }}>
              ALEXANDER PULIDO
            </h1>
            <p className="text-xs tracking-[0.2em] mt-2" style={{ color: '#333' }}>
              {PROFESSIONAL_SUMMARY.headline}
            </p>
            <p className="text-xs tracking-wider mt-1 italic" style={{ color: '#555' }}>
              {PROFESSIONAL_SUMMARY.tagline}
            </p>
          </div>

          <nav className="flex gap-3 items-center" aria-label="Main navigation">
            <Link
              href="/cv"
              className="limbo-btn px-3 py-1.5 text-xs tracking-[0.2em] uppercase transition-colors hover:bg-black hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
              style={{ background: 'transparent', border: '2px solid #000', color: '#1a1a1a' }}
            >
              resume
            </Link>
            <Link
              href="/personal-projects/game-engine"
              className="limbo-btn px-3 py-1.5 text-xs tracking-[0.2em] uppercase transition-colors hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              style={{ background: '#000', color: '#ccc' }}
            >
              enter
            </Link>
            <ThemeSwitcher />
          </nav>
        </div>
      </header>

      {/* Current Roles - immediately visible */}
      <section className="relative z-20 py-4 px-6" aria-label="Current professional roles">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-wrap justify-center gap-6">
            {CURRENT_ROLES.map((role) => (
              <div key={role.id} className="text-center">
                <p className="text-xs tracking-[0.3em] uppercase" style={{ color: '#1a1a1a' }}>{role.title}</p>
                <p className="text-xs mt-0.5" style={{ color: '#555' }}>{role.company}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Profession Selection - immediately visible */}
      <section className="relative z-20 py-8" aria-label="Select profession view">
        <div className="flex justify-center gap-14">
          {(['engineer', 'drummer', 'fighter'] as const).map((prof) => (
            <SilhouetteFigure key={prof} profession={prof} isActive={active === prof} onClick={() => setActive(prof)} />
          ))}
        </div>
        <p className="text-center mt-3 text-xs tracking-[0.3em] uppercase" style={{ color: '#555' }}>
          {config.title.toLowerCase()}
        </p>
      </section>

      {/* Main content - ALL IMMEDIATELY VISIBLE */}
      <main className="relative z-20 px-6 py-8" role="main">
        <div className="max-w-2xl mx-auto space-y-8">

          {/* About Section */}
          <section aria-label="About">
            <SectionHeader title="about" />
            <LimboCard ariaLabel="Biography">
              <p className="text-sm leading-relaxed" style={{ color: '#b0b0b0' }}>{aboutData.bio}</p>
              <div className="flex flex-wrap gap-3 mt-4">
                {aboutData.quickFacts.map((fact, i) => (
                  <span key={i} className="text-xs tracking-wider uppercase" style={{ color: '#888' }}>- {fact}</span>
                ))}
              </div>
            </LimboCard>
          </section>

          {/* Work Experience - Full detailed work history */}
          <section aria-label="Work experience">
            <SectionHeader title="work experience" />
            <div className="space-y-3">
              {WORK_EXPERIENCE.map((work) => (
                <WorkCard key={work.company} work={work} />
              ))}
            </div>
          </section>

          {/* Professional Experience by profession */}
          {experience.length > 0 && (
            <section aria-label="Professional timeline">
              <SectionHeader title="timeline" />
              <div className="space-y-3">
                {experience.map((entry) => (
                  <ExperienceCard key={entry.id} entry={entry} />
                ))}
              </div>
            </section>
          )}

          {/* Tech Stack / Skills */}
          <section aria-label={active === 'engineer' ? 'Technical skills' : 'Skills and achievements'}>
            <SectionHeader title={active === 'engineer' ? 'tech stack' : 'skills'} />
            <LimboCard>
              {active === 'engineer' ? (
                <TechCloud categories={engineerSkills} />
              ) : (
                <AchievementsList categories={achievements} />
              )}
            </LimboCard>
          </section>

          {/* Projects */}
          <section aria-label="Featured projects">
            <SectionHeader title="featured work" />
            <div className="grid md:grid-cols-2 gap-4">
              {projects.slice(0, 6).map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </section>

          {/* Companies (Engineer mode) */}
          {active === 'engineer' && (
            <section aria-label="Companies">
              <SectionHeader title="companies" />
              <div className="grid md:grid-cols-3 gap-3">
                {COMPANIES.map((company) => (
                  <CompanyCard key={company.id} company={company} />
                ))}
              </div>
            </section>
          )}

          {/* Bands (Drummer mode) */}
          {active === 'drummer' && (
            <section aria-label="Musical projects">
              <SectionHeader title="bands" />
              <div className="grid md:grid-cols-3 gap-3">
                {BANDS.map((band) => (
                  <BandCard key={band.id} band={band} />
                ))}
              </div>
            </section>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 py-10 text-center" role="contentinfo">
        <div className="flex items-center justify-center gap-3" aria-hidden="true">
          <div className="w-6 h-px bg-black/30" />
          <p className="text-xs tracking-[0.5em]" style={{ color: '#666' }}>. . .</p>
          <div className="w-6 h-px bg-black/30" />
        </div>
      </footer>

      {/* =================================================================
          LIMBO-STYLE CSS - Pure black/white/grey, film grain, fog
          Reduced motion support for accessibility
          ================================================================= */}
      <style jsx global>{`
        /* FOG DRIFT - subtle atmospheric movement */
        @keyframes fog-drift {
          0% { transform: translateX(-20%); }
          100% { transform: translateX(20%); }
        }
        .fog-drift {
          animation: fog-drift 50s ease-in-out infinite alternate;
        }

        /* FILM GRAIN - Heavy Limbo texture */
        @keyframes grain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-1%, -1%); }
          20% { transform: translate(0.5%, 1%); }
          30% { transform: translate(-0.5%, -0.5%); }
          40% { transform: translate(1%, -1%); }
          50% { transform: translate(-1%, 0.5%); }
          60% { transform: translate(0.5%, -0.5%); }
          70% { transform: translate(-0.5%, 1%); }
          80% { transform: translate(1%, 0.5%); }
          90% { transform: translate(-1%, -0.5%); }
        }
        @keyframes grain-secondary {
          0%, 100% { transform: translate(0, 0) scale(1.05); }
          50% { transform: translate(-0.5%, 0.5%) scale(1.05); }
        }
        .grain {
          animation: grain 0.4s steps(10) infinite;
        }
        .grain-secondary {
          animation: grain-secondary 0.6s steps(6) infinite;
        }

        /* EYES - Eerie watching presence */
        @keyframes eyes-fade {
          0%, 100% { opacity: 0; }
          20%, 80% { opacity: 0.5; }
          50% { opacity: 0.3; }
        }
        .eyes-fade {
          animation: eyes-fade 8s ease-in-out infinite;
        }

        /* MACHINERY - Slow rotating gears */
        @keyframes slow-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes slow-rotate-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .slow-rotate {
          animation: slow-rotate 40s linear infinite;
        }
        .slow-rotate-reverse {
          animation: slow-rotate-reverse 30s linear infinite;
        }

        /* BOY SILHOUETTE - Wandering */
        @keyframes boy-walk {
          0%, 100% { transform: translateX(0) scaleX(1); }
          49% { transform: translateX(20px) scaleX(1); }
          50% { transform: translateX(20px) scaleX(-1); }
          99% { transform: translateX(0) scaleX(-1); }
        }
        .boy-walk {
          animation: boy-walk 16s ease-in-out infinite;
        }

        /* SPIDER - Subtle idle */
        @keyframes spider-idle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .spider-idle {
          animation: spider-idle 3s ease-in-out infinite;
        }

        /* BUTTON EFFECTS - Noir shadow style */
        .limbo-btn {
          position: relative;
          overflow: visible;
        }
        .limbo-btn::after {
          content: '';
          position: absolute;
          top: 3px;
          left: 3px;
          width: 100%;
          height: 100%;
          background: #000;
          z-index: -1;
          transition: top 0.15s ease, left 0.15s ease;
        }
        .limbo-btn:hover::after {
          top: 5px;
          left: 5px;
        }
        .limbo-btn:hover {
          transform: translate(-1px, -1px);
        }
        .limbo-btn:active::after {
          top: 1px;
          left: 1px;
        }
        .limbo-btn:active {
          transform: translate(1px, 1px);
        }

        /* ACCESSIBILITY - Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .fog-drift,
          .grain,
          .grain-secondary,
          .eyes-fade,
          .slow-rotate,
          .slow-rotate-reverse,
          .boy-walk,
          .spider-idle,
          .limbo-btn {
            animation: none !important;
          }
          .limbo-btn::after {
            transition: none;
          }
          .eyes-fade {
            opacity: 0.4;
          }
        }
      `}</style>
    </div>
  )
}
