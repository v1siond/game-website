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
import { useSmoothScroll, useInViewTrigger } from '@/hooks/useScrollAnimation'

// Alexander as test subject - actual sprite with Aperture styling
function TestSubjectAlexander({
  size = 50,
  facing = 'right',
}: {
  size?: number
  facing?: 'left' | 'right'
}) {
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => setFrame(f => (f + 1) % 2), 150)
    return () => clearInterval(interval)
  }, [])

  const sprite = facing === 'right'
    ? (frame === 0 ? '/assets/sprites/run_right.png' : '/assets/sprites/run_right_1.png')
    : (frame === 0 ? '/assets/sprites/run_left.png' : '/assets/sprites/run_left_1.png')

  return (
    <div
      className="relative"
      style={{ width: size, height: size * 1.2 }}
    >
      <Image
        src={sprite}
        alt="Test Subject"
        fill
        className="object-contain"
        style={{
          filter: 'brightness(1.1) contrast(1.2) drop-shadow(0 0 8px rgba(0,191,255,0.5))',
        }}
      />
      {/* Portal gun glow effect */}
      <div
        className="absolute top-1/2 -translate-y-1/2"
        style={{
          [facing === 'right' ? 'right' : 'left']: '-8px',
          width: '12px',
          height: '12px',
          background: `radial-gradient(circle, ${PORTAL_BLUE} 0%, transparent 70%)`,
          filter: 'blur(2px)',
        }}
      />
    </div>
  )
}

// Portal colors
const PORTAL_ORANGE = '#ff8c00'
const PORTAL_BLUE = '#00bfff'
const APERTURE_WHITE = '#f0f0f0'
const PANEL_DARK = '#1a1a2e'

// ============================================================================
// SIMPLIFIED SCROLL COMPONENTS WITH SMOOTH CSS TRANSITIONS
// ============================================================================

// Generic human silhouette - test subject running
function TestSubjectSilhouette({
  size = 60,
  facing = 'right',
}: {
  size?: number
  facing?: 'left' | 'right'
}) {
  const transform = facing === 'left' ? 'scale(-1, 1)' : ''

  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 60 72">
      <g transform={transform}>
        {/* Head */}
        <ellipse cx="30" cy="12" rx="8" ry="10" fill="#222" />
        {/* Body */}
        <path d="M30,22 L30,45" stroke="#222" strokeWidth="8" strokeLinecap="round" />
        {/* Arms - running motion */}
        <path d="M30,28 L18,38" stroke="#222" strokeWidth="5" strokeLinecap="round" />
        <path d="M30,28 L45,22" stroke="#222" strokeWidth="5" strokeLinecap="round" />
        {/* Legs - running stride */}
        <path d="M30,45 L18,60" stroke="#222" strokeWidth="5" strokeLinecap="round" />
        <path d="M30,45 L45,55" stroke="#222" strokeWidth="5" strokeLinecap="round" />
        {/* Boots */}
        <ellipse cx="18" cy="62" rx="4" ry="3" fill="#333" />
        <ellipse cx="45" cy="57" rx="4" ry="3" fill="#333" />
      </g>
    </svg>
  )
}

// Portal SVG with continuous CSS animation for glow/pulse
function PortalSVG({
  color,
  size = 100,
}: {
  color: 'orange' | 'blue'
  size?: number
}) {
  const primaryColor = color === 'orange' ? PORTAL_ORANGE : PORTAL_BLUE
  const animationClass = color === 'orange' ? 'animate-portal-glow-orange' : 'animate-portal-glow-blue'

  return (
    <svg
      width={size * 0.7}
      height={size}
      viewBox="0 0 70 100"
      className={animationClass}
    >
      <defs>
        <filter id={`portal-glow-${color}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id={`portal-void-${color}`} cx="50%" cy="50%">
          <stop offset="0%" stopColor="#0a0a15" />
          <stop offset="100%" stopColor="#000" />
        </radialGradient>
        <linearGradient id={`portal-rim-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primaryColor} stopOpacity="1" />
          <stop offset="50%" stopColor={primaryColor} stopOpacity="0.6" />
          <stop offset="100%" stopColor={primaryColor} stopOpacity="1" />
        </linearGradient>
      </defs>

      {/* Outer glow - animated via CSS */}
      <ellipse
        cx="35" cy="50" rx="32" ry="48"
        fill="none"
        stroke={primaryColor}
        strokeWidth="8"
        className="portal-outer-glow"
        filter={`url(#portal-glow-${color})`}
      />

      {/* Portal rim */}
      <ellipse
        cx="35" cy="50" rx="28" ry="42"
        fill="none"
        stroke={`url(#portal-rim-${color})`}
        strokeWidth="6"
      />

      {/* Inner void */}
      <ellipse
        cx="35" cy="50" rx="22" ry="36"
        fill={`url(#portal-void-${color})`}
      />

      {/* Inner glow ring - animated via CSS */}
      <ellipse
        cx="35" cy="50" rx="24" ry="38"
        fill="none"
        stroke={primaryColor}
        strokeWidth="2"
        className="portal-inner-ring"
      />
    </svg>
  )
}

// Simplified scroll scene - test subject moves with smooth CSS transitions
function ScrollPortalScene() {
  const { smoothScrollY, scrollProgress } = useSmoothScroll(0.12)

  // Test subject position: moves from left to right as you scroll
  // Uses CSS transition for smoothness, scroll only sets the target position
  const subjectX = 10 + scrollProgress * 80 // 10% to 90% of screen

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {/* Orange portal - LEFT side - continuous glow animation */}
      <div
        className="absolute"
        style={{
          left: '8%',
          top: '45%',
          transform: 'translateY(-50%)',
        }}
      >
        <PortalSVG color="orange" size={120} />
      </div>

      {/* Blue portal - RIGHT side - continuous glow animation */}
      <div
        className="absolute"
        style={{
          right: '8%',
          top: '45%',
          transform: 'translateY(-50%)',
        }}
      >
        <PortalSVG color="blue" size={120} />
      </div>

      {/* Alexander as test subject - smooth CSS transition for movement */}
      <div
        className="absolute transition-all duration-300 ease-out"
        style={{
          left: `${subjectX}%`,
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <TestSubjectAlexander size={50} facing="right" />
      </div>
    </div>
  )
}

// PortalReveal - One-time trigger when scrolling DOWN into view
// Shows content immediately on first section, scroll-reveals for subsequent sections
function PortalReveal({
  children,
  portalSide = 'left',
  delay = 0,
  initialVisible = false
}: {
  children: React.ReactNode
  portalSide?: 'left' | 'right'
  delay?: number
  initialVisible?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const hasTriggered = useInViewTrigger(ref, { threshold: 0.1, rootMargin: '-50px' })
  const [isVisible, setIsVisible] = useState(initialVisible)

  useEffect(() => {
    if (hasTriggered || initialVisible) {
      const timer = setTimeout(() => setIsVisible(true), delay)
      return () => clearTimeout(timer)
    }
  }, [hasTriggered, delay, initialVisible])

  const portalColor = portalSide === 'left' ? 'orange' : 'blue'

  return (
    <div ref={ref} className="relative">
      {/* Mini portal indicator - fades out when content emerges */}
      <div
        className={`absolute top-1/2 -translate-y-1/2 transition-all duration-500 ${
          isVisible ? 'opacity-0 scale-50' : 'opacity-60 scale-100'
        }`}
        style={{
          [portalSide]: '-60px',
        }}
      >
        <PortalSVG color={portalColor} size={60} />
      </div>

      {/* Content - emerges with CSS transition */}
      <div
        className={`transition-all duration-700 ease-out ${
          isVisible
            ? 'opacity-100 translate-x-0'
            : `opacity-0 ${portalSide === 'left' ? '-translate-x-20' : 'translate-x-20'}`
        }`}
      >
        {children}
      </div>
    </div>
  )
}

// Robot sentry with smooth scroll tracking (CSS transition, not direct binding)
function RobotSentry({ side }: { side: 'left' | 'right' }) {
  const { scrollProgress } = useSmoothScroll(0.1)

  // Rotation: maps scroll to -30 to 30 degrees
  // CSS transition handles the smoothness
  const rotation = scrollProgress * 60 - 30

  return (
    <div
      className={`fixed ${side === 'left' ? 'left-4' : 'right-4'} bottom-20 z-20`}
      style={{
        transform: side === 'right' ? 'scaleX(-1)' : 'none',
      }}
    >
      <svg width="50" height="100" viewBox="0 0 50 100">
        {/* Legs */}
        <line x1="15" y1="85" x2="10" y2="100" stroke="#fff" strokeWidth="3" />
        <line x1="35" y1="85" x2="40" y2="100" stroke="#fff" strokeWidth="3" />
        <line x1="25" y1="85" x2="25" y2="100" stroke="#fff" strokeWidth="3" />

        {/* Body */}
        <ellipse cx="25" cy="60" rx="18" ry="28" fill="#f0f0f0" stroke="#ddd" strokeWidth="2" />

        {/* Head/Eye section - smooth rotation via CSS transition */}
        <g
          className="transition-transform duration-300 ease-out"
          style={{
            transformOrigin: '25px 45px',
            transform: `rotate(${rotation}deg)`,
          }}
        >
          {/* Eye housing */}
          <ellipse cx="25" cy="40" rx="10" ry="8" fill="#333" />
          {/* Eye - continuous pulse via CSS animation */}
          <circle cx="25" cy="40" r="4" fill="#ff0000" className="animate-sentry-eye" />
          {/* Laser beam - continuous animation */}
          <line
            x1="25" y1="40"
            x2={side === 'left' ? '200' : '-150'}
            y2={40 + rotation * 2}
            stroke="#ff0000"
            strokeWidth="1"
            className="animate-laser-pulse"
            strokeDasharray="5,5"
          />
        </g>

        {/* Logo on body */}
        <circle cx="25" cy="65" r="6" fill="none" stroke="#999" strokeWidth="1" />
      </svg>
    </div>
  )
}

// Ambient particles - continuous CSS animations only
function AmbientParticles() {
  const [particles, setParticles] = useState<Array<{
    id: number
    x: number
    y: number
    size: number
    delay: number
    isOrange: boolean
  }>>([])

  useEffect(() => {
    setParticles(
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 3,
        isOrange: Math.random() > 0.5,
      }))
    )
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-[1]">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full animate-portal-float"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.isOrange ? PORTAL_ORANGE : PORTAL_BLUE,
            boxShadow: `0 0 ${p.size * 3}px ${p.isOrange ? PORTAL_ORANGE : PORTAL_BLUE}`,
            animationDelay: `${p.delay}s`,
            opacity: 0.6,
          }}
        />
      ))}
    </div>
  )
}

// Aperture Science logo
function ApertureLogoSVG({ size = 60, color = APERTURE_WHITE }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="animate-spin-very-slow">
      {[0, 60, 120, 180, 240, 300].map((angle, i) => (
        <path
          key={i}
          d="M50,50 L50,10 Q65,10 75,25 Z"
          fill={color}
          opacity={0.8}
          transform={`rotate(${angle} 50 50)`}
        />
      ))}
      <circle cx="50" cy="50" r="15" fill="none" stroke={color} strokeWidth="2" />
    </svg>
  )
}

// Test chamber panel grid background
function TestChamberPanels() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 opacity-10">
      <div
        className="w-full h-full"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  )
}

// Portal Ring component for profession selection
function PortalRing({
  profession,
  isActive,
  onClick,
  position,
}: {
  profession: 'engineer' | 'drummer' | 'fighter'
  isActive: boolean
  onClick: () => void
  position: { x: number; y: number }
}) {
  const colors = {
    engineer: { primary: PORTAL_BLUE, secondary: '#0099cc' },
    drummer: { primary: PORTAL_ORANGE, secondary: '#cc6600' },
    fighter: { primary: '#00ff88', secondary: '#00cc66' },
  }
  const icons = { engineer: '#', drummer: '~', fighter: '+' }
  const labels = { engineer: 'ENGINEER', drummer: 'MUSICIAN', fighter: 'FIGHTER' }

  const color = colors[profession]

  return (
    <button
      onClick={onClick}
      className={`absolute transition-all duration-500 ${
        isActive ? 'scale-110 z-20' : 'scale-100 hover:scale-105'
      }`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: `translate(-50%, -50%) ${isActive ? 'scale(1.1)' : ''}`,
      }}
    >
      {/* Outer portal glow - continuous animation */}
      <div
        className="absolute rounded-full animate-portal-pulse"
        style={{
          width: '140px',
          height: '200px',
          background: `radial-gradient(ellipse, ${color.primary}40, transparent 70%)`,
          opacity: isActive ? 0.8 : 0.3,
          filter: 'blur(10px)',
          margin: '-50px -20px',
        }}
      />

      {/* Portal ring */}
      <div
        className="relative flex items-center justify-center"
        style={{
          width: '100px',
          height: '140px',
          background: `radial-gradient(ellipse at 50% 50%, ${color.primary}20, transparent 70%)`,
          border: `4px solid ${color.primary}`,
          borderRadius: '50%',
          boxShadow: `
            0 0 30px ${color.primary}80,
            0 0 60px ${color.primary}40,
            inset 0 0 40px ${color.primary}30
          `,
        }}
      >
        {/* Inner swirl - continuous animation */}
        <div
          className="absolute inset-4 rounded-full animate-spin-slow opacity-50"
          style={{
            background: `conic-gradient(from 0deg, transparent, ${color.primary}, transparent, ${color.secondary}, transparent)`,
          }}
        />

        {/* Portal interior */}
        <div
          className="absolute rounded-full"
          style={{
            width: '60px',
            height: '90px',
            background: `radial-gradient(ellipse, #0a0a15, #000)`,
          }}
        />

        {/* Icon */}
        <span
          className="relative z-10 text-3xl font-mono"
          style={{ color: color.primary, textShadow: `0 0 20px ${color.primary}` }}
        >
          {icons[profession]}
        </span>
      </div>

      {/* Label */}
      <div
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
        style={{ color: color.primary, textShadow: `0 0 10px ${color.primary}` }}
      >
        <span className="text-xs tracking-widest font-bold">{labels[profession]}</span>
      </div>

      {/* Selection indicator */}
      {isActive && (
        <div
          className="absolute -bottom-14 left-1/2 -translate-x-1/2 text-xl animate-bounce"
          style={{ color: color.primary }}
        >
          ^
        </div>
      )}
    </button>
  )
}

// Aperture Science panel frame
function ApertureFrame({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="relative">
      {/* Corner brackets */}
      {[
        'top-0 left-0 border-t-2 border-l-2',
        'top-0 right-0 border-t-2 border-r-2',
        'bottom-0 left-0 border-b-2 border-l-2',
        'bottom-0 right-0 border-b-2 border-r-2'
      ].map((pos, i) => (
        <div
          key={i}
          className={`absolute w-6 h-6 ${pos}`}
          style={{ borderColor: PORTAL_BLUE }}
        />
      ))}

      {/* Title with logo */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, transparent, ${PORTAL_BLUE}40)` }} />
        <div className="flex items-center gap-2">
          <ApertureLogoSVG size={20} color={PORTAL_BLUE} />
          <h2 className="text-sm tracking-[0.3em] uppercase" style={{ color: PORTAL_BLUE }}>
            {title}
          </h2>
        </div>
        <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${PORTAL_BLUE}40, transparent)` }} />
      </div>

      <div
        className="p-6 relative"
        style={{
          background: `linear-gradient(180deg, ${PANEL_DARK}ee, #0d0d1a)`,
          border: `1px solid ${PORTAL_BLUE}30`,
        }}
      >
        {children}
      </div>
    </div>
  )
}

// Tech stack display
function TechTerminal({ categories }: { categories: ReturnType<typeof getEngineerSkills> }) {
  return (
    <div className="space-y-6">
      {categories.slice(0, 6).map((category, catIndex) => (
        <div key={category.name}>
          <h3
            className="text-xs tracking-wider mb-3 flex items-center gap-2"
            style={{ color: catIndex % 2 === 0 ? PORTAL_BLUE : PORTAL_ORANGE }}
          >
            <span>{category.icon}</span>
            {category.name.toUpperCase()}
          </h3>
          <div className="flex flex-wrap gap-2">
            {category.items.map((tech, i) => (
              <span
                key={tech}
                className="px-3 py-1 text-xs transition-all hover:scale-105 cursor-default"
                style={{
                  background: `${i % 2 === 0 ? PORTAL_BLUE : PORTAL_ORANGE}15`,
                  border: `1px solid ${i % 2 === 0 ? PORTAL_BLUE : PORTAL_ORANGE}40`,
                  color: APERTURE_WHITE,
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

// Skills panel for drummer/fighter
function SkillsPanel({ categories }: { categories: ReturnType<typeof getSkillsByProfession> }) {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {categories.map((category, catIndex) => (
        <div key={category.name}>
          <h3
            className="text-xs tracking-wider mb-3 flex items-center gap-2"
            style={{ color: catIndex % 2 === 0 ? PORTAL_BLUE : PORTAL_ORANGE }}
          >
            <span>{category.icon}</span>
            {category.name.toUpperCase()}
          </h3>
          <ul className="space-y-2">
            {category.skills.map((skill, i) => (
              <li
                key={skill.name}
                className="text-sm flex items-center gap-2"
                style={{ color: APERTURE_WHITE }}
              >
                <span style={{ color: i % 2 === 0 ? PORTAL_BLUE : PORTAL_ORANGE }}>*</span>
                {skill.name}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

// Project card
function TestChamberCard({ project, index }: { project: typeof PROJECTS_DATA[0]; index: number }) {
  const [hovered, setHovered] = useState(false)
  const isOrange = index % 2 === 0
  const color = isOrange ? PORTAL_ORANGE : PORTAL_BLUE

  return (
    <div
      className="relative p-4 cursor-pointer transition-all duration-300 group"
      style={{
        background: `linear-gradient(180deg, ${PANEL_DARK}, #0d0d1a)`,
        border: `2px solid ${hovered ? color : '#333'}`,
        boxShadow: hovered ? `0 0 30px ${color}40, inset 0 0 30px ${color}10` : 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Chamber number */}
      <div
        className="absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
        style={{
          background: color,
          color: '#000',
          boxShadow: `0 0 15px ${color}80`,
        }}
      >
        {String(index + 1).padStart(2, '0')}
      </div>

      {project.featured && (
        <span className="text-[8px] tracking-wider" style={{ color: '#ffdd00' }}>
          * FEATURED
        </span>
      )}

      <h3 className="text-sm font-bold mt-1" style={{ color }}>
        {project.name}
      </h3>
      <p className="text-[10px] mb-2 mt-1" style={{ color: '#888' }}>
        {project.tagline}
      </p>
      {project.impact && (
        <p className="text-[10px] italic mb-2" style={{ color: PORTAL_BLUE }}>
          - {project.impact}
        </p>
      )}
      <div className="flex gap-1 flex-wrap">
        {project.techStack.slice(0, 3).map((tech, i) => (
          <span
            key={tech}
            className="text-[8px] px-2 py-0.5"
            style={{
              background: `${i % 2 === 0 ? PORTAL_BLUE : PORTAL_ORANGE}20`,
              color: i % 2 === 0 ? PORTAL_BLUE : PORTAL_ORANGE,
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
function VentureCard({ company }: { company: typeof COMPANIES[0] }) {
  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 transition-all hover:scale-[1.02] group"
      style={{
        background: `linear-gradient(180deg, ${PANEL_DARK}, #0d0d1a)`,
        border: `1px solid ${PORTAL_BLUE}30`,
      }}
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{company.icon}</span>
        <div>
          <h4 className="text-sm group-hover:text-cyan-400 transition-colors" style={{ color: APERTURE_WHITE }}>
            {company.name}
          </h4>
          <p className="text-[10px]" style={{ color: PORTAL_ORANGE }}>{company.tagline}</p>
        </div>
      </div>
      <p className="text-xs" style={{ color: '#888' }}>{company.description}</p>
      <div className="flex flex-wrap gap-1 mt-2">
        {company.services.slice(0, 3).map((service, i) => (
          <span
            key={service}
            className="text-[8px] px-2 py-0.5"
            style={{
              background: `${PORTAL_BLUE}15`,
              color: PORTAL_BLUE,
            }}
          >
            {service}
          </span>
        ))}
      </div>
    </a>
  )
}

// Experience card - styled to match Aperture theme
function ExperienceCard({ entry, index }: { entry: typeof EXPERIENCE_DATA[0]; index: number }) {
  const isOrange = index % 2 === 0
  const color = isOrange ? PORTAL_ORANGE : PORTAL_BLUE
  const endDisplay = entry.endDate ? new Date(entry.endDate).getFullYear() : 'Present'
  const startDisplay = new Date(entry.startDate).getFullYear()

  return (
    <div
      className="p-4"
      style={{
        background: `linear-gradient(180deg, ${PANEL_DARK}, #0d0d1a)`,
        border: `1px solid ${color}30`,
      }}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="text-sm font-medium" style={{ color: APERTURE_WHITE }}>
            {entry.title}
          </h4>
          <p className="text-xs" style={{ color }}>
            {entry.organization}
          </p>
        </div>
        <span className="text-[10px]" style={{ color: '#888' }}>
          {startDisplay} - {endDisplay}
        </span>
      </div>
      <p className="text-xs mb-2" style={{ color: '#888' }}>
        {entry.description}
      </p>
      {entry.highlights && entry.highlights.length > 0 && (
        <ul className="space-y-1">
          {entry.highlights.map((highlight, i) => (
            <li key={i} className="text-xs flex items-start gap-2" style={{ color: APERTURE_WHITE }}>
              <span style={{ color }}>*</span>
              {highlight}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// Band card
function MusicChamberCard({ band }: { band: typeof BANDS[0] }) {
  const content = (
    <div
      className="p-4 transition-all hover:scale-[1.02] group"
      style={{
        background: `linear-gradient(180deg, ${PANEL_DARK}, #0d0d1a)`,
        border: `1px solid ${PORTAL_ORANGE}30`,
      }}
    >
      <h4 className="text-sm group-hover:text-orange-400 transition-colors" style={{ color: APERTURE_WHITE }}>
        {band.name}
      </h4>
      <p className="text-[10px] mt-1" style={{ color: PORTAL_ORANGE }}>
        {band.genre} | {band.role}
      </p>
      <p className="text-xs mt-2" style={{ color: '#888' }}>{band.description}</p>
      {!band.url && (
        <p className="text-[10px] mt-2 italic" style={{ color: '#666' }}>
          [WEBSITE UNDER CONSTRUCTION]
        </p>
      )}
    </div>
  )

  if (band.url) {
    return <a href={band.url} target="_blank" rel="noopener noreferrer" className="block">{content}</a>
  }
  return content
}

export default function NeonPortalsTheme() {
  const { theme } = useTheme()
  const { active, setActive, config } = useProfession()
  const [mounted, setMounted] = useState(false)

  const aboutData = ABOUT_DATA[active]
  const engineerTech = getEngineerSkills()
  const otherSkills = getSkillsByProfession(active)
  const projects = PROJECTS_DATA.filter(p => p.professions.includes(active) || p.featured)
  const experience = filterExperienceByProfession(EXPERIENCE_DATA, active)

  const portalPositions = {
    engineer: { x: 25, y: 45 },
    drummer: { x: 50, y: 35 },
    fighter: { x: 75, y: 45 },
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: `linear-gradient(180deg, #0a0a15, #121225, #0a0a15)`,
        fontFamily: '"Segoe UI", Arial, sans-serif',
      }}
    >
      {/* Background elements */}
      <TestChamberPanels />
      <AmbientParticles />

      {/* Simplified scroll scene - portals pulse continuously, test subject moves smoothly */}
      <ScrollPortalScene />

      {/* Robot sentries - track scroll with smooth CSS transitions */}
      <RobotSentry side="left" />
      <RobotSentry side="right" />

      {/* Header */}
      <header className="relative z-30 p-6">
        <div className="max-w-6xl mx-auto flex justify-between items-start">
          <div className="flex items-center gap-6">
            <ApertureLogoSVG size={50} color={APERTURE_WHITE} />
            <div>
              <h1
                className="text-3xl tracking-wider font-light"
                style={{
                  color: APERTURE_WHITE,
                  textShadow: `0 0 20px ${PORTAL_BLUE}60`,
                }}
              >
                ALEXANDER PULIDO
              </h1>
              <p className="text-sm mt-1" style={{ color: PORTAL_BLUE }}>
                {PROFESSIONAL_SUMMARY.headline}
              </p>
              <p className="text-xs mt-1 italic" style={{ color: PORTAL_ORANGE }}>
                {PROFESSIONAL_SUMMARY.tagline}
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-center">
            <Link
              href="/cv"
              className="px-4 py-2 text-sm tracking-wider transition-all hover:scale-105"
              style={{
                background: `${PORTAL_BLUE}20`,
                border: `2px solid ${PORTAL_BLUE}`,
                color: PORTAL_BLUE,
                boxShadow: `0 0 15px ${PORTAL_BLUE}30`,
              }}
            >
              * CV
            </Link>
            <Link
              href="/personal-projects/game-engine"
              className="px-4 py-2 text-sm tracking-wider transition-all hover:scale-105"
              style={{
                background: PORTAL_ORANGE,
                color: '#000',
                boxShadow: `0 0 20px ${PORTAL_ORANGE}60`,
              }}
            >
              * PLAY
            </Link>
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      {/* Current Roles */}
      <section className="relative z-20 py-4 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-8">
            {CURRENT_ROLES.map((role, i) => (
              <div
                key={role.id}
                className="text-center px-6 py-2"
                style={{
                  borderLeft: i > 0 ? `1px solid ${PORTAL_BLUE}30` : 'none',
                }}
              >
                <p className="text-xs tracking-wider" style={{ color: i % 2 === 0 ? PORTAL_BLUE : PORTAL_ORANGE }}>
                  {role.title}
                </p>
                <p className="text-sm mt-1" style={{ color: APERTURE_WHITE }}>{role.company}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portal selection area */}
      <section className="relative z-20 h-[320px]">
        <div className="relative max-w-4xl mx-auto h-full">
          {(['engineer', 'drummer', 'fighter'] as const).map((prof) => (
            <PortalRing
              key={prof}
              profession={prof}
              isActive={active === prof}
              onClick={() => setActive(prof)}
              position={portalPositions[prof]}
            />
          ))}
        </div>
      </section>

      {/* Main content - sections emerge from portals (one-time trigger) */}
      <main className="relative z-20 px-6 py-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* About - visible immediately, no scroll needed */}
          <PortalReveal portalSide="left" delay={0} initialVisible={true}>
            <ApertureFrame title="About">
              <p className="text-sm leading-relaxed mb-4" style={{ color: APERTURE_WHITE }}>
                {aboutData.bio}
              </p>
              <div className="flex flex-wrap gap-2">
                {aboutData.quickFacts.map((fact, i) => (
                  <span
                    key={i}
                    className="text-xs px-3 py-1"
                    style={{
                      background: `${i % 2 === 0 ? PORTAL_BLUE : PORTAL_ORANGE}15`,
                      border: `1px solid ${i % 2 === 0 ? PORTAL_BLUE : PORTAL_ORANGE}`,
                      color: i % 2 === 0 ? PORTAL_BLUE : PORTAL_ORANGE,
                    }}
                  >
                    * {fact}
                  </span>
                ))}
              </div>
            </ApertureFrame>
          </PortalReveal>

          {/* Work Experience - emerges from right portal */}
          {experience.length > 0 && (
            <PortalReveal portalSide="right" delay={100}>
              <ApertureFrame title="Work Experience">
                <div className="space-y-4">
                  {experience.map((entry, i) => (
                    <ExperienceCard key={entry.id} entry={entry} index={i} />
                  ))}
                </div>
              </ApertureFrame>
            </PortalReveal>
          )}

          {/* Tech Stack / Skills - emerges from left portal */}
          <PortalReveal portalSide="left" delay={100}>
            <ApertureFrame title={active === 'engineer' ? 'Tech Stack' : 'Skills'}>
              {active === 'engineer' ? (
                <TechTerminal categories={engineerTech} />
              ) : (
                <SkillsPanel categories={otherSkills} />
              )}
            </ApertureFrame>
          </PortalReveal>

          {/* Projects - emerges from right portal */}
          <PortalReveal portalSide="right" delay={100}>
            <ApertureFrame title="Projects">
              <div className="grid md:grid-cols-2 gap-4">
                {projects.filter(p => p.featured).slice(0, 6).map((project, i) => (
                  <TestChamberCard key={project.id} project={project} index={i} />
                ))}
              </div>
            </ApertureFrame>
          </PortalReveal>

          {/* Companies (Engineer) / Bands (Drummer) - emerges from left portal */}
          {active === 'engineer' && (
            <PortalReveal portalSide="left" delay={100}>
              <ApertureFrame title="Companies">
                <div className="grid md:grid-cols-3 gap-4">
                  {COMPANIES.map((company) => (
                    <VentureCard key={company.id} company={company} />
                  ))}
                </div>
              </ApertureFrame>
            </PortalReveal>
          )}

          {active === 'drummer' && (
            <PortalReveal portalSide="left" delay={100}>
              <ApertureFrame title="Bands">
                <div className="grid md:grid-cols-3 gap-4">
                  {BANDS.map((band) => (
                    <MusicChamberCard key={band.id} band={band} />
                  ))}
                </div>
              </ApertureFrame>
            </PortalReveal>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 py-8 text-center">
        <div className="flex items-center justify-center gap-4">
          <ApertureLogoSVG size={24} color="#444" />
          <p className="text-xs tracking-widest" style={{ color: '#444' }}>
            TEST FACILITY | MMXXVI
          </p>
        </div>
      </footer>

      {/* CSS Animations - continuous loops for portal effects */}
      <style jsx global>{`
        /* Portal glow - continuous pulse animation */
        @keyframes portal-glow-pulse {
          0%, 100% {
            opacity: 0.3;
            filter: brightness(1);
          }
          50% {
            opacity: 0.6;
            filter: brightness(1.3);
          }
        }

        .animate-portal-glow-orange,
        .animate-portal-glow-blue {
          animation: portal-glow-pulse 2s ease-in-out infinite;
        }

        .animate-portal-glow-orange .portal-outer-glow {
          animation: portal-glow-pulse 2s ease-in-out infinite;
        }

        .animate-portal-glow-blue .portal-outer-glow {
          animation: portal-glow-pulse 2.5s ease-in-out infinite;
        }

        .portal-inner-ring {
          animation: portal-glow-pulse 1.5s ease-in-out infinite;
        }

        /* Ambient particle float */
        @keyframes portal-float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.6; }
          50% { transform: translateY(-15px) translateX(5px); opacity: 0.3; }
        }

        /* Portal ring pulse for profession selector */
        @keyframes portal-pulse {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.1); opacity: 0.6; }
        }

        /* Slow spin for decorative elements */
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes spin-very-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Sentry eye pulse */
        @keyframes sentry-eye-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        /* Laser beam pulse */
        @keyframes laser-pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }

        .animate-portal-float {
          animation: portal-float 4s ease-in-out infinite;
        }
        .animate-portal-pulse {
          animation: portal-pulse 3s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        .animate-spin-very-slow {
          animation: spin-very-slow 20s linear infinite;
        }
        .animate-sentry-eye {
          animation: sentry-eye-pulse 0.5s ease-in-out infinite;
        }
        .animate-laser-pulse {
          animation: laser-pulse 0.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
