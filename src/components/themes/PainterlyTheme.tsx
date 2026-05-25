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
import { TECH_STACK } from '@/data/techStack'
import { useInViewTrigger } from '@/hooks/useScrollAnimation'

// =============================================================================
// OKAMI COLOR PALETTE - Traditional Japanese ink painting
// =============================================================================
const COLORS = {
  cream: '#f5f0e1',       // Rice paper background
  darkCream: '#e8dcc8',   // Aged paper
  ink: '#1a1a1a',         // Sumi black ink
  inkWash: '#3a3a3a',     // Diluted ink
  red: '#c41e3a',         // Vermillion red (like red sun)
  darkRed: '#8b0000',     // Deep red
  gold: '#c9a227',        // Gold accents
  sakura: '#ffb7c5',      // Cherry blossom pink
  sakuraDark: '#d4768b',  // Deeper sakura
  wave: '#264653',        // Ocean wave blue
  celestial: '#7eb8da',   // Celestial brush trail
}

// =============================================================================
// ACCESSIBILITY HELPERS
// =============================================================================
function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return prefersReducedMotion
}

// =============================================================================
// RICE PAPER TEXTURE BACKGROUND
// =============================================================================
function RicePaperBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[1]"
      role="presentation"
      aria-hidden="true"
    >
      {/* Base paper color */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, ${COLORS.cream} 0%, ${COLORS.darkCream} 100%)`,
        }}
      />
      {/* Paper texture noise */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.15]">
        <defs>
          <filter id="paperNoise">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" result="noise" />
            <feDiffuseLighting in="noise" lightingColor={COLORS.cream} surfaceScale="1.5">
              <feDistantLight azimuth="45" elevation="60" />
            </feDiffuseLighting>
          </filter>
        </defs>
        <rect width="100%" height="100%" filter="url(#paperNoise)" />
      </svg>
      {/* Scroll edge shadows */}
      <div
        className="absolute inset-0"
        style={{
          boxShadow: 'inset 0 0 100px rgba(0,0,0,0.15)',
        }}
      />
    </div>
  )
}

// =============================================================================
// RED SUN (Japanese flag style, like Okami)
// =============================================================================
function RedSun({ reducedMotion = false }: { reducedMotion?: boolean }) {
  return (
    <div
      className="fixed top-[-5%] right-[-5%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] pointer-events-none z-[2]"
      role="presentation"
      aria-hidden="true"
    >
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <defs>
          <radialGradient id="sunGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={COLORS.red} />
            <stop offset="70%" stopColor={COLORS.red} stopOpacity="0.9" />
            <stop offset="100%" stopColor={COLORS.darkRed} stopOpacity="0.3" />
          </radialGradient>
          {!reducedMotion && (
            <filter id="sunGlow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          )}
        </defs>
        <circle
          cx="100"
          cy="100"
          r="80"
          fill="url(#sunGradient)"
          filter={reducedMotion ? undefined : "url(#sunGlow)"}
          opacity="0.85"
        />
        {/* Sun rays - subtle ink strokes radiating out */}
        {!reducedMotion && [...Array(12)].map((_, i) => (
          <line
            key={i}
            x1="100"
            y1="100"
            x2={100 + Math.cos((i * 30 * Math.PI) / 180) * 95}
            y2={100 + Math.sin((i * 30 * Math.PI) / 180) * 95}
            stroke={COLORS.red}
            strokeWidth="1"
            strokeOpacity="0.3"
            strokeDasharray="5,10"
          >
            <animate
              attributeName="stroke-opacity"
              values="0.2;0.4;0.2"
              dur={`${3 + i * 0.2}s`}
              repeatCount="indefinite"
            />
          </line>
        ))}
      </svg>
    </div>
  )
}

// =============================================================================
// CHERRY BLOSSOM PETALS (Floating particles)
// =============================================================================
function CherryBlossomPetals({ reducedMotion = false }: { reducedMotion?: boolean }) {
  const [petals, setPetals] = useState<Array<{ id: number; x: number; delay: number; duration: number; size: number; rotation: number }>>([])

  useEffect(() => {
    if (reducedMotion) return
    setPetals(
      Array.from({ length: 25 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 10,
        duration: 15 + Math.random() * 10,
        size: 8 + Math.random() * 12,
        rotation: Math.random() * 360,
      }))
    )
  }, [reducedMotion])

  if (reducedMotion) return null

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[3] overflow-hidden"
      role="presentation"
      aria-hidden="true"
    >
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="absolute animate-petal-fall"
          style={{
            left: `${petal.x}%`,
            top: '-5%',
            width: petal.size,
            height: petal.size * 0.7,
            background: `radial-gradient(ellipse at 30% 30%, ${COLORS.sakura}, ${COLORS.sakuraDark})`,
            borderRadius: '50% 0 50% 0',
            transform: `rotate(${petal.rotation}deg)`,
            boxShadow: `0 2px 4px rgba(0,0,0,0.1)`,
            animationDelay: `${petal.delay}s`,
            animationDuration: `${petal.duration}s`,
          }}
        />
      ))}
    </div>
  )
}

// =============================================================================
// CELESTIAL BRUSH TRAIL (Okami's divine brush strokes)
// =============================================================================
function CelestialBrushTrail({ reducedMotion = false }: { reducedMotion?: boolean }) {
  if (reducedMotion) return null

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[2] overflow-hidden"
      role="presentation"
      aria-hidden="true"
    >
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="none">
        <defs>
          <linearGradient id="brushGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={COLORS.celestial} stopOpacity="0" />
            <stop offset="50%" stopColor={COLORS.celestial} stopOpacity="0.6" />
            <stop offset="100%" stopColor={COLORS.celestial} stopOpacity="0" />
          </linearGradient>
          <filter id="brushBlur">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>
        {/* Flowing brush strokes */}
        <path
          d="M-100,200 Q200,100 400,300 T800,200 T1100,350"
          fill="none"
          stroke="url(#brushGradient)"
          strokeWidth="8"
          strokeLinecap="round"
          filter="url(#brushBlur)"
          opacity="0.4"
        >
          <animate
            attributeName="d"
            values="M-100,200 Q200,100 400,300 T800,200 T1100,350;M-100,250 Q200,180 400,250 T800,300 T1100,280;M-100,200 Q200,100 400,300 T800,200 T1100,350"
            dur="20s"
            repeatCount="indefinite"
          />
        </path>
        <path
          d="M-100,600 Q300,500 500,650 T900,550 T1100,700"
          fill="none"
          stroke="url(#brushGradient)"
          strokeWidth="6"
          strokeLinecap="round"
          filter="url(#brushBlur)"
          opacity="0.3"
        >
          <animate
            attributeName="d"
            values="M-100,600 Q300,500 500,650 T900,550 T1100,700;M-100,550 Q300,600 500,550 T900,650 T1100,600;M-100,600 Q300,500 500,650 T900,550 T1100,700"
            dur="25s"
            repeatCount="indefinite"
          />
        </path>
      </svg>
    </div>
  )
}

// =============================================================================
// AMATERASU WOLF SILHOUETTE (Okami's main character)
// =============================================================================
function AmaterasuSilhouette({ position = 'bottom-left' }: { position?: 'bottom-left' | 'bottom-right' }) {
  const isLeft = position === 'bottom-left'

  return (
    <div
      className={`fixed ${isLeft ? 'bottom-8 left-8' : 'bottom-8 right-8'} pointer-events-none z-[4] opacity-15`}
      role="presentation"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 150 100"
        className={`w-32 h-20 ${isLeft ? '' : 'scale-x-[-1]'}`}
        fill={COLORS.ink}
      >
        {/* Wolf body silhouette - Amaterasu style */}
        <path d="M20,70 Q30,50 45,55 L55,45 Q60,35 70,40 L85,35 Q95,30 100,35 L110,30 Q120,25 125,30 L130,40 Q135,50 130,60 L125,70 Q120,80 110,80 L40,80 Q25,80 20,70 Z" />
        {/* Head */}
        <circle cx="125" cy="45" r="12" />
        {/* Ears */}
        <path d="M118,35 L115,22 L122,30 Z" />
        <path d="M132,35 L135,22 L128,30 Z" />
        {/* Tail with divine swirl */}
        <path d="M20,60 Q5,40 15,25 Q20,20 25,25 Q30,35 20,50" fill="none" stroke={COLORS.ink} strokeWidth="4" />
        {/* Divine markings on body (red swirls) */}
        <path d="M60,55 Q70,50 75,60 Q80,70 70,65" fill="none" stroke={COLORS.red} strokeWidth="2" opacity="0.5" />
        <path d="M90,50 Q95,45 100,50" fill="none" stroke={COLORS.red} strokeWidth="2" opacity="0.5" />
      </svg>
    </div>
  )
}

// =============================================================================
// WAVE PATTERN (Great Wave of Kanagawa inspired)
// =============================================================================
function WavePattern({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 30"
      className={`w-full h-8 ${className}`}
      preserveAspectRatio="none"
      role="presentation"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={COLORS.wave} stopOpacity="0.3" />
          <stop offset="50%" stopColor={COLORS.wave} stopOpacity="0.6" />
          <stop offset="100%" stopColor={COLORS.wave} stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <path
        d="M0,15 Q25,5 50,15 T100,15 T150,15 T200,15"
        fill="none"
        stroke="url(#waveGrad)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M0,22 Q25,12 50,22 T100,22 T150,22 T200,22"
        fill="none"
        stroke="url(#waveGrad)"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  )
}

// =============================================================================
// INK BRUSH STROKE DIVIDER
// =============================================================================
function InkBrushDivider({ withCircle = false }: { withCircle?: boolean }) {
  return (
    <div
      className="flex items-center justify-center my-8"
      role="separator"
      aria-hidden="true"
    >
      <svg viewBox="0 0 400 40" className="w-full max-w-xl h-10">
        <defs>
          <filter id="brushTexture">
            <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
          </filter>
        </defs>
        {/* Left brush stroke */}
        <path
          d="M10,20 Q50,15 100,20 T180,20"
          fill="none"
          stroke={COLORS.ink}
          strokeWidth="3"
          strokeLinecap="round"
          filter="url(#brushTexture)"
          opacity="0.7"
        />
        {/* Center element */}
        {withCircle ? (
          <circle cx="200" cy="20" r="8" fill={COLORS.red} opacity="0.8" />
        ) : (
          <text x="200" y="25" textAnchor="middle" fill={COLORS.ink} fontSize="16" fontFamily="serif" opacity="0.6">
            -
          </text>
        )}
        {/* Right brush stroke */}
        <path
          d="M220,20 Q260,15 300,20 T390,20"
          fill="none"
          stroke={COLORS.ink}
          strokeWidth="3"
          strokeLinecap="round"
          filter="url(#brushTexture)"
          opacity="0.7"
        />
      </svg>
    </div>
  )
}

// =============================================================================
// SCROLL SECTION WRAPPER
// =============================================================================
function ScrollSection({
  children,
  className = '',
  title,
  titleIcon,
}: {
  children: React.ReactNode
  className?: string
  title?: string
  titleIcon?: React.ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isVisible = useInViewTrigger(ref, { threshold: 0.1 })

  return (
    <section
      ref={ref}
      className={`relative p-6 mb-8 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
      style={{
        background: `linear-gradient(180deg, ${COLORS.cream}f0, ${COLORS.darkCream}e0)`,
        border: `1px solid ${COLORS.ink}20`,
        borderRadius: '4px',
        boxShadow: `
          inset 0 1px 0 rgba(255,255,255,0.5),
          0 4px 20px rgba(0,0,0,0.1)
        `,
      }}
      aria-label={title}
    >
      {/* Scroll edge decoration */}
      <div
        className="absolute top-0 left-0 right-0 h-2"
        style={{
          background: `linear-gradient(90deg, transparent, ${COLORS.ink}10, transparent)`,
        }}
      />

      {title && (
        <h2
          className="text-xl mb-6 flex items-center gap-3"
          style={{
            color: COLORS.ink,
            fontFamily: '"Noto Serif JP", serif',
          }}
        >
          {titleIcon}
          <span>{title}</span>
          <div className="flex-1 h-px ml-4" style={{ background: `linear-gradient(90deg, ${COLORS.ink}40, transparent)` }} />
        </h2>
      )}

      {children}
    </section>
  )
}

// =============================================================================
// ROLE CARDS (Current Roles)
// =============================================================================
function RoleCard({ role }: { role: typeof CURRENT_ROLES[0] }) {
  return (
    <div
      className="p-4 transition-all hover:scale-[1.02]"
      style={{
        background: `linear-gradient(135deg, ${COLORS.cream}, ${COLORS.darkCream})`,
        border: `1px solid ${COLORS.ink}20`,
        borderLeft: `3px solid ${COLORS.red}`,
      }}
    >
      <div className="flex justify-between items-start">
        <div>
          <h4
            className="text-sm font-semibold"
            style={{ color: COLORS.ink }}
          >
            {role.title}
          </h4>
          <p
            className="text-xs"
            style={{ color: COLORS.red }}
          >
            {role.company}
          </p>
        </div>
        <span
          className="text-[10px] px-2 py-0.5"
          style={{
            background: `${COLORS.red}15`,
            border: `1px solid ${COLORS.red}30`,
            color: COLORS.red,
          }}
        >
          {role.type === 'leadership' ? 'Leadership' : 'Current'}
        </span>
      </div>
      <p className="text-xs mt-2" style={{ color: COLORS.inkWash }}>
        {role.description}
      </p>
    </div>
  )
}

// =============================================================================
// COMPANY CARD (For engineer mode)
// =============================================================================
function CompanyCard({ company }: { company: typeof COMPANIES[0] }) {
  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 transition-all hover:scale-[1.02] group"
      style={{
        background: `linear-gradient(135deg, ${COLORS.cream}, ${COLORS.darkCream})`,
        border: `1px solid ${COLORS.ink}20`,
      }}
      aria-label={`Visit ${company.name} website`}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">{company.icon}</span>
        <div className="flex-1">
          <h4
            className="text-sm font-semibold group-hover:underline"
            style={{ color: COLORS.ink }}
          >
            {company.name}
          </h4>
          <p className="text-xs" style={{ color: COLORS.red }}>
            {company.tagline}
          </p>
          <p className="text-xs mt-1" style={{ color: COLORS.inkWash }}>
            {company.description}
          </p>
        </div>
      </div>
    </a>
  )
}

// =============================================================================
// BAND CARD (For drummer mode)
// =============================================================================
function BandCard({ band }: { band: typeof BANDS[0] }) {
  const content = (
    <div
      className="p-4 transition-all hover:scale-[1.02] group"
      style={{
        background: `linear-gradient(135deg, ${COLORS.cream}, ${COLORS.darkCream})`,
        border: `1px solid ${COLORS.ink}20`,
        borderLeft: band.active ? `3px solid ${COLORS.gold}` : `3px solid ${COLORS.inkWash}`,
      }}
    >
      <div className="flex justify-between items-start">
        <div>
          <h4
            className={`text-sm font-semibold ${band.url ? 'group-hover:underline' : ''}`}
            style={{ color: COLORS.ink }}
          >
            {band.name}
          </h4>
          <p className="text-xs" style={{ color: COLORS.gold }}>
            {band.genre}
          </p>
        </div>
        {band.active && (
          <span
            className="text-[10px] px-2 py-0.5"
            style={{
              background: `${COLORS.gold}20`,
              border: `1px solid ${COLORS.gold}40`,
              color: COLORS.gold,
            }}
          >
            Active
          </span>
        )}
      </div>
      <p className="text-xs mt-2" style={{ color: COLORS.inkWash }}>
        {band.description}
      </p>
    </div>
  )

  if (band.url) {
    return (
      <a href={band.url} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${band.name} website`}>
        {content}
      </a>
    )
  }

  return content
}

// =============================================================================
// TECH STACK DISPLAY (No skill bars - just categories with items)
// =============================================================================
function TechStackDisplay() {
  const techStack = TECH_STACK

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {techStack.map((category) => (
        <div
          key={category.name}
          className="p-4"
          style={{
            background: `linear-gradient(135deg, ${COLORS.cream}f0, ${COLORS.darkCream}e0)`,
            border: `1px solid ${COLORS.ink}15`,
          }}
        >
          <h4
            className="text-xs tracking-wider mb-3 pb-2 flex items-center gap-2"
            style={{
              color: COLORS.ink,
              borderBottom: `1px solid ${COLORS.ink}20`,
            }}
          >
            <span>{category.icon}</span>
            <span style={{ fontFamily: '"Noto Serif JP", serif' }}>{category.name}</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {category.items.map((item) => (
              <span
                key={item}
                className="text-[11px] px-2 py-1"
                style={{
                  background: `${COLORS.ink}08`,
                  border: `1px solid ${COLORS.ink}15`,
                  color: COLORS.inkWash,
                }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// =============================================================================
// SKILLS DISPLAY (For drummer/fighter - achievements, not bars)
// =============================================================================
function SkillsDisplay({ profession }: { profession: 'drummer' | 'fighter' }) {
  const skills = getSkillsByProfession(profession)

  return (
    <div className="space-y-4">
      {skills.map((category) => (
        <div
          key={category.name}
          className="p-4"
          style={{
            background: `linear-gradient(135deg, ${COLORS.cream}f0, ${COLORS.darkCream}e0)`,
            border: `1px solid ${COLORS.ink}15`,
          }}
        >
          <h4
            className="text-xs tracking-wider mb-3 pb-2 flex items-center gap-2"
            style={{
              color: COLORS.ink,
              borderBottom: `1px solid ${COLORS.ink}20`,
            }}
          >
            <span>{category.icon}</span>
            <span style={{ fontFamily: '"Noto Serif JP", serif' }}>{category.name}</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {category.skills.map((skill) => (
              <span
                key={skill.name}
                className="text-[11px] px-3 py-1.5 relative"
                style={{
                  background: `linear-gradient(135deg, ${COLORS.red}10, ${COLORS.red}05)`,
                  border: `1px solid ${COLORS.red}25`,
                  color: COLORS.ink,
                }}
              >
                {skill.name}
                {/* Proficiency indicator as brush strokes instead of bars */}
                <span
                  className="absolute -bottom-0.5 left-1 right-1 flex gap-0.5"
                  aria-label={`Proficiency: ${skill.proficiency} of 5`}
                >
                  {[...Array(skill.proficiency)].map((_, i) => (
                    <span
                      key={i}
                      className="h-0.5 flex-1"
                      style={{ background: COLORS.red }}
                    />
                  ))}
                </span>
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// =============================================================================
// PROJECT CARD (With impact statements)
// =============================================================================
function ProjectCard({ project }: { project: typeof PROJECTS_DATA[0] }) {
  return (
    <div
      className="p-4 transition-all hover:scale-[1.01]"
      style={{
        background: `linear-gradient(135deg, ${COLORS.cream}, ${COLORS.darkCream})`,
        border: `1px solid ${COLORS.ink}20`,
        borderLeft: project.featured ? `3px solid ${COLORS.red}` : `3px solid ${COLORS.ink}30`,
      }}
    >
      <div className="flex justify-between items-start mb-2">
        <h4
          className="text-sm font-semibold"
          style={{ color: COLORS.ink }}
        >
          {project.name}
        </h4>
        {project.featured && (
          <span
            className="text-[10px] px-2 py-0.5"
            style={{
              background: `${COLORS.red}15`,
              color: COLORS.red,
            }}
          >
            Featured
          </span>
        )}
      </div>
      <p className="text-xs mb-2" style={{ color: COLORS.red }}>
        {project.tagline}
      </p>
      <p className="text-xs mb-3" style={{ color: COLORS.inkWash }}>
        {project.description}
      </p>
      {/* Impact statement - key achievement */}
      {project.impact && (
        <div
          className="text-xs p-2 mb-3"
          style={{
            background: `${COLORS.gold}10`,
            borderLeft: `2px solid ${COLORS.gold}`,
            color: COLORS.ink,
          }}
        >
          <strong>Impact:</strong> {project.impact}
        </div>
      )}
      <div className="flex flex-wrap gap-1">
        {project.techStack.slice(0, 5).map((tech) => (
          <span
            key={tech}
            className="text-[10px] px-2 py-0.5"
            style={{
              background: `${COLORS.ink}08`,
              color: COLORS.inkWash,
            }}
          >
            {tech}
          </span>
        ))}
      </div>
      {project.links?.site && (
        <a
          href={project.links.site}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-3 text-xs underline"
          style={{ color: COLORS.red }}
          aria-label={`Visit ${project.name} website`}
        >
          View Project
        </a>
      )}
    </div>
  )
}

// =============================================================================
// EXPERIENCE CARD
// =============================================================================
function ExperienceCard({ entry }: { entry: typeof EXPERIENCE_DATA[0] }) {
  const startDate = new Date(entry.startDate)
  const endDate = entry.endDate ? new Date(entry.endDate) : null
  const startDisplay = startDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  const endDisplay = endDate ? endDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'

  return (
    <div
      className="p-4 transition-all"
      style={{
        background: `linear-gradient(135deg, ${COLORS.cream}, ${COLORS.darkCream})`,
        border: `1px solid ${COLORS.ink}20`,
        borderLeft: `3px solid ${entry.endDate ? COLORS.ink : COLORS.red}30`,
      }}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4
            className="text-sm font-semibold"
            style={{ color: COLORS.ink }}
          >
            {entry.title}
          </h4>
          <p className="text-xs" style={{ color: COLORS.red }}>
            {entry.organization}
          </p>
        </div>
        <span
          className="text-[10px] px-2 py-0.5"
          style={{
            background: `${COLORS.ink}10`,
            color: COLORS.inkWash,
          }}
        >
          {startDisplay} - {endDisplay}
        </span>
      </div>
      <p className="text-xs mb-2" style={{ color: COLORS.inkWash }}>
        {entry.description}
      </p>
      {entry.highlights && entry.highlights.length > 0 && (
        <ul className="space-y-1 mt-2">
          {entry.highlights.map((highlight, i) => (
            <li
              key={i}
              className="text-xs flex items-start gap-2"
              style={{ color: COLORS.ink }}
            >
              <span style={{ color: COLORS.red }}>&#8226;</span>
              {highlight}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// =============================================================================
// PROFESSION SELECTOR (Brush stroke style)
// =============================================================================
function ProfessionBrushButton({
  profession,
  isActive,
  onClick,
  label,
}: {
  profession: 'engineer' | 'drummer' | 'fighter'
  isActive: boolean
  onClick: () => void
  label: string
}) {
  const icons = {
    engineer: '筆', // Brush
    drummer: '鼓', // Drum
    fighter: '武', // Martial
  }

  return (
    <button
      onClick={onClick}
      className="relative px-6 py-3 transition-all hover:scale-105"
      style={{
        background: isActive
          ? `linear-gradient(135deg, ${COLORS.red}, ${COLORS.darkRed})`
          : `linear-gradient(135deg, ${COLORS.cream}, ${COLORS.darkCream})`,
        border: `2px solid ${isActive ? COLORS.red : COLORS.ink}40`,
        color: isActive ? COLORS.cream : COLORS.ink,
        fontFamily: '"Noto Serif JP", serif',
      }}
      aria-label={`Switch to ${label} mode`}
      aria-pressed={isActive}
    >
      <span className="text-xl mr-2">{icons[profession]}</span>
      <span className="text-sm tracking-wider">{label}</span>
      {/* Brush stroke underline when active */}
      {isActive && (
        <svg
          viewBox="0 0 100 10"
          className="absolute -bottom-1 left-2 right-2 h-2"
          aria-hidden="true"
        >
          <path
            d="M5,5 Q25,2 50,5 T95,5"
            fill="none"
            stroke={COLORS.cream}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      )}
    </button>
  )
}

// =============================================================================
// OKAMI-STYLE CHARACTER (Simple divine wolf)
// =============================================================================
function OkamiCharacter({ className = '' }: { className?: string }) {
  const [frame, setFrame] = useState(0)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (reducedMotion) return
    const interval = setInterval(() => setFrame(f => (f + 1) % 2), 500)
    return () => clearInterval(interval)
  }, [reducedMotion])

  return (
    <div className={`relative ${className}`}>
      <Image
        src={frame === 0 ? '/assets/sprites/idle_right.png' : '/assets/sprites/idle_right_1.png'}
        alt="Divine spirit guide"
        width={60}
        height={72}
        className="object-contain"
        style={{
          filter: 'sepia(0.3) contrast(1.1)',
        }}
      />
      {/* Divine glow */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: `radial-gradient(ellipse, ${COLORS.celestial}30 0%, transparent 70%)`,
          filter: 'blur(8px)',
        }}
        aria-hidden="true"
      />
    </div>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function PainterlyTheme() {
  const { theme } = useTheme()
  const { active, setActive, config } = useProfession()
  const [mounted, setMounted] = useState(false)
  const reducedMotion = usePrefersReducedMotion()

  const aboutData = ABOUT_DATA[active]
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
        fontFamily: '"Noto Serif JP", "Georgia", serif',
      }}
    >
      {/* Background layers */}
      <RicePaperBackground />
      <RedSun reducedMotion={reducedMotion} />
      <CelestialBrushTrail reducedMotion={reducedMotion} />
      <CherryBlossomPetals reducedMotion={reducedMotion} />

      {/* Decorative wolf silhouettes */}
      <AmaterasuSilhouette position="bottom-left" />

      {/* Header */}
      <header
        className="relative z-30 pt-12 pb-8 text-center"
        role="banner"
      >
        <div className="max-w-4xl mx-auto px-6">
          <WavePattern className="mb-6 opacity-50" />

          <h1
            className="text-3xl md:text-4xl tracking-[0.15em] mb-2"
            style={{
              color: COLORS.ink,
              textShadow: `2px 2px 0 ${COLORS.cream}`,
              fontFamily: '"Noto Serif JP", serif',
            }}
          >
            ALEXANDER PULIDO
          </h1>

          <p
            className="text-base tracking-widest mb-1"
            style={{ color: COLORS.red }}
          >
            {PROFESSIONAL_SUMMARY.headline}
          </p>

          <p
            className="text-sm tracking-wider mb-6"
            style={{ color: COLORS.inkWash }}
          >
            {PROFESSIONAL_SUMMARY.tagline}
          </p>

          {/* Character and navigation */}
          <div className="flex justify-center items-center gap-8 mb-6">
            <Link
              href="/cv"
              className="px-5 py-2 text-sm tracking-wider transition-all hover:scale-105"
              style={{
                background: 'transparent',
                border: `2px solid ${COLORS.ink}`,
                color: COLORS.ink,
              }}
              aria-label="View full CV"
            >
              View Scroll
            </Link>

            <OkamiCharacter />

            <Link
              href="/personal-projects/game-engine"
              className="px-5 py-2 text-sm tracking-wider transition-all hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${COLORS.red}, ${COLORS.darkRed})`,
                color: COLORS.cream,
                boxShadow: `0 4px 15px ${COLORS.red}40`,
              }}
              aria-label="Enter the game engine project"
            >
              Enter Realm
            </Link>

            <ThemeSwitcher />
          </div>

          <InkBrushDivider withCircle />
        </div>
      </header>

      {/* Profession selector */}
      <section
        className="relative z-20 py-4"
        aria-label="Select profession view"
      >
        <div className="text-center mb-4">
          <span
            className="text-xs tracking-[0.3em]"
            style={{ color: COLORS.inkWash }}
          >
            CHOOSE YOUR PATH
          </span>
        </div>
        <div className="flex justify-center gap-4 flex-wrap px-4">
          <ProfessionBrushButton
            profession="engineer"
            isActive={active === 'engineer'}
            onClick={() => setActive('engineer')}
            label="Engineer"
          />
          <ProfessionBrushButton
            profession="drummer"
            isActive={active === 'drummer'}
            onClick={() => setActive('drummer')}
            label="Drummer"
          />
          <ProfessionBrushButton
            profession="fighter"
            isActive={active === 'fighter'}
            onClick={() => setActive('fighter')}
            label="Fighter"
          />
        </div>
      </section>

      {/* Main content */}
      <main className="relative z-20 px-6 py-8" role="main">
        <div className="max-w-4xl mx-auto">

          {/* About / Bio Section */}
          <ScrollSection
            title="About"
            titleIcon={
              <svg viewBox="0 0 20 20" className="w-5 h-5" aria-hidden="true">
                <circle cx="10" cy="10" r="8" fill={COLORS.red} opacity="0.8" />
              </svg>
            }
          >
            <div className="text-center max-w-2xl mx-auto">
              <p
                className="text-sm leading-relaxed italic"
                style={{ color: COLORS.ink }}
              >
                &ldquo;{aboutData.bio}&rdquo;
              </p>
              <div className="flex justify-center gap-3 mt-6 flex-wrap">
                {aboutData.quickFacts.map((fact, i) => (
                  <span
                    key={i}
                    className="text-[11px] px-4 py-1.5"
                    style={{
                      background: `${COLORS.red}10`,
                      border: `1px solid ${COLORS.red}30`,
                      color: COLORS.red,
                    }}
                  >
                    {fact}
                  </span>
                ))}
              </div>
            </div>
          </ScrollSection>

          <InkBrushDivider />

          {/* Current Roles Section */}
          <ScrollSection
            title="Current Roles"
            titleIcon={
              <svg viewBox="0 0 20 20" className="w-5 h-5" aria-hidden="true">
                <rect x="3" y="3" width="14" height="14" fill={COLORS.red} opacity="0.8" />
              </svg>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {CURRENT_ROLES.map((role) => (
                <RoleCard key={role.id} role={role} />
              ))}
            </div>
          </ScrollSection>

          <InkBrushDivider />

          {/* Tech Stack / Skills Section */}
          <ScrollSection
            title={active === 'engineer' ? 'Tech Stack' : 'Skills & Abilities'}
            titleIcon={
              <svg viewBox="0 0 20 20" className="w-5 h-5" aria-hidden="true">
                <polygon points="10,0 20,10 10,20 0,10" fill={COLORS.red} opacity="0.8" />
              </svg>
            }
          >
            {active === 'engineer' ? (
              <TechStackDisplay />
            ) : (
              <SkillsDisplay profession={active} />
            )}
          </ScrollSection>

          <InkBrushDivider />

          {/* Companies Section (Engineer mode) */}
          {active === 'engineer' && (
            <>
              <ScrollSection
                title="Companies & Ventures"
                titleIcon={
                  <svg viewBox="0 0 20 20" className="w-5 h-5" aria-hidden="true">
                    <circle cx="10" cy="10" r="8" fill={COLORS.gold} opacity="0.8" />
                  </svg>
                }
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {COMPANIES.map((company) => (
                    <CompanyCard key={company.id} company={company} />
                  ))}
                </div>
              </ScrollSection>
              <InkBrushDivider />
            </>
          )}

          {/* Bands Section (Drummer mode) */}
          {active === 'drummer' && (
            <>
              <ScrollSection
                title="Musical Projects"
                titleIcon={
                  <svg viewBox="0 0 20 20" className="w-5 h-5" aria-hidden="true">
                    <circle cx="10" cy="10" r="8" fill={COLORS.gold} opacity="0.8" />
                  </svg>
                }
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {BANDS.map((band) => (
                    <BandCard key={band.id} band={band} />
                  ))}
                </div>
              </ScrollSection>
              <InkBrushDivider />
            </>
          )}

          {/* Projects Section */}
          <ScrollSection
            title="Featured Work"
            titleIcon={
              <svg viewBox="0 0 20 20" className="w-5 h-5" aria-hidden="true">
                <rect x="3" y="3" width="14" height="14" transform="rotate(45 10 10)" fill={COLORS.red} opacity="0.8" />
              </svg>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.slice(0, 6).map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </ScrollSection>

          <InkBrushDivider />

          {/* Work Experience Section */}
          {experience.length > 0 && (
            <ScrollSection
              title="Journey"
              titleIcon={
                <svg viewBox="0 0 20 20" className="w-5 h-5" aria-hidden="true">
                  <path d="M2,10 Q10,2 18,10 Q10,18 2,10" fill={COLORS.red} opacity="0.8" />
                </svg>
              }
            >
              <div className="space-y-4">
                {experience.map((entry) => (
                  <ExperienceCard key={entry.id} entry={entry} />
                ))}
              </div>
            </ScrollSection>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer
        className="relative z-20 py-12 text-center"
        role="contentinfo"
      >
        <WavePattern className="max-w-md mx-auto mb-4" />
        <p
          className="text-xs tracking-widest flex items-center justify-center gap-4"
          style={{ color: COLORS.inkWash }}
        >
          <span style={{ color: COLORS.red }}>&#9670;</span>
          DIVINE BRUSH GUIDES THE WAY
          <span style={{ color: COLORS.red }}>&#9670;</span>
          MMXXVI
          <span style={{ color: COLORS.red }}>&#9670;</span>
        </p>
        <WavePattern className="max-w-md mx-auto mt-4 rotate-180" />
      </footer>

      {/* Animations */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;700&display=swap');

        @keyframes petal-fall {
          0% {
            transform: translateY(-10vh) rotate(0deg) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(110vh) rotate(720deg) translateX(50px);
            opacity: 0;
          }
        }
        .animate-petal-fall {
          animation: petal-fall linear infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-petal-fall {
            animation: none;
            opacity: 0.5;
            transform: translateY(50vh);
          }
        }
      `}</style>
    </div>
  )
}
