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
import { useInViewTrigger } from '@/hooks/useScrollAnimation'

// Phantom Thief Alexander - stylish masked figure
function PhantomThiefCharacter({
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
    const interval = setInterval(() => setFrame(f => (f + 1) % 2), 140)
    return () => clearInterval(interval)
  }, [])

  const sprite = direction === 'right'
    ? (frame === 0 ? '/assets/sprites/run_right.png' : '/assets/sprites/run_right_1.png')
    : (frame === 0 ? '/assets/sprites/run_left.png' : '/assets/sprites/run_left_1.png')

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size * 1.2 }}>
      <Image
        src={sprite}
        alt="Phantom Thief"
        fill
        className="object-contain"
        style={{ filter: 'contrast(1.3) brightness(1.1)' }}
      />
      {/* Mask effect on face */}
      <div
        className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[60%] h-[20%]"
        style={{
          background: 'linear-gradient(90deg, transparent, #ff0033, transparent)',
          clipPath: 'polygon(20% 0%, 80% 0%, 100% 50%, 80% 100%, 20% 100%, 0% 50%)',
          opacity: 0.8,
        }}
      />
      {/* Stylish trail */}
      <div
        className="absolute top-0 left-0 w-full h-full"
        style={{
          background: direction === 'right'
            ? 'linear-gradient(90deg, rgba(255,0,51,0.4), transparent 30%)'
            : 'linear-gradient(270deg, rgba(255,0,51,0.4), transparent 30%)',
        }}
      />
    </div>
  )
}

// Profession-specific ornaments in Persona 5 bold style
function StylishOrnaments({ profession }: { profession: 'engineer' | 'drummer' | 'fighter' }) {
  const ornamentsByProfession = {
    engineer: [
      { text: 'CODE', x: 3, y: 15, rotation: -15, size: 32 },
      { text: '{ }', x: 90, y: 20, rotation: 12, size: 40 },
      { text: '<>', x: 5, y: 75, rotation: 8, size: 36 },
      { text: '//', x: 88, y: 80, rotation: -10, size: 34 },
      { text: '01', x: 8, y: 45, rotation: -5, size: 28 },
    ],
    drummer: [
      { text: '♪', x: 5, y: 18, rotation: -12, size: 44 },
      { text: '🥁', x: 92, y: 25, rotation: 15, size: 38 },
      { text: '🎹', x: 4, y: 70, rotation: 8, size: 36 },
      { text: '♫', x: 90, y: 75, rotation: -8, size: 40 },
      { text: 'BEAT', x: 6, y: 45, rotation: -5, size: 26 },
    ],
    fighter: [
      { text: '拳', x: 5, y: 20, rotation: -10, size: 40 },
      { text: '👊', x: 90, y: 25, rotation: 12, size: 38 },
      { text: '⚔️', x: 4, y: 72, rotation: 8, size: 36 },
      { text: 'KO', x: 88, y: 78, rotation: -15, size: 32 },
      { text: '💥', x: 8, y: 48, rotation: 5, size: 34 },
    ],
  }

  const items = ornamentsByProfession[profession]

  return (
    <div className="fixed inset-0 pointer-events-none z-[3] overflow-hidden">
      {items.map((item, i) => (
        <div
          key={i}
          className="absolute font-black tracking-tighter animate-stylish-float"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            fontSize: item.size,
            transform: `rotate(${item.rotation}deg)`,
            color: '#ff0033',
            textShadow: '3px 3px 0 #000, -1px -1px 0 #000',
            opacity: 0.25,
            animation: `stylishFloat ${8 + i * 2}s ease-in-out infinite`,
            animationDelay: `${-i * 1.5}s`,
          }}
        >
          {item.text}
        </div>
      ))}
    </div>
  )
}

// ALL OUT ATTACK reveal section
function AllOutAttackSection({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const hasEntered = useInViewTrigger(ref, { threshold: 0.15 })
  const [phase, setPhase] = useState<'hidden' | 'attack' | 'revealed'>('hidden')

  useEffect(() => {
    if (hasEntered && phase === 'hidden') {
      setPhase('attack')
      setTimeout(() => setPhase('revealed'), 800)
    }
  }, [hasEntered, phase])

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {/* ALL OUT ATTACK animation */}
      {phase === 'attack' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 animate-attack-flash">
          <div className="relative">
            <PhantomThiefCharacter size={80} className="absolute left-1/2 -translate-x-1/2 -top-20" />
            <div
              className="text-5xl font-black tracking-tighter text-center"
              style={{
                color: '#ff0033',
                textShadow: '4px 4px 0 #000, -2px -2px 0 #fff',
                transform: 'skewX(-10deg)',
              }}
            >
              REVEAL!
            </div>
          </div>
        </div>
      )}

      <div
        className="transition-all duration-500"
        style={{
          opacity: phase === 'revealed' ? 1 : 0,
          transform: phase === 'revealed' ? 'skewX(0deg) translateX(0)' : 'skewX(-20deg) translateX(-30px)',
        }}
      >
        {children}
      </div>
    </div>
  )
}

// Phantom thief mask SVG - floating decoration
function PhantomMask({ style }: { style: React.CSSProperties }) {
  return (
    <svg
      viewBox="0 0 100 50"
      className="absolute pointer-events-none opacity-20"
      style={{ width: '120px', ...style }}
    >
      <path
        d="M10,25 Q15,10 30,15 L50,10 L70,15 Q85,10 90,25 Q85,35 70,30 L50,35 L30,30 Q15,35 10,25 Z"
        fill="none"
        stroke="#ff0033"
        strokeWidth="2"
      />
      <ellipse cx="30" cy="22" rx="12" ry="8" fill="#ff0033" opacity="0.3" />
      <ellipse cx="70" cy="22" rx="12" ry="8" fill="#ff0033" opacity="0.3" />
    </svg>
  )
}

// Floating phantom masks
function FloatingMasks() {
  const [masks, setMasks] = useState<Array<{
    id: number
    x: number
    y: number
    rotation: number
    scale: number
    delay: number
  }>>([])

  useEffect(() => {
    const newMasks = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      rotation: Math.random() * 40 - 20,
      scale: 0.5 + Math.random() * 0.5,
      delay: Math.random() * 5,
    }))
    setMasks(newMasks)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-[2] overflow-hidden">
      {masks.map((m) => (
        <PhantomMask
          key={m.id}
          style={{
            left: `${m.x}%`,
            top: `${m.y}%`,
            transform: `rotate(${m.rotation}deg) scale(${m.scale})`,
            animation: `float-mask 10s ease-in-out infinite`,
            animationDelay: `${m.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

// Card suit symbols scattered background
function CardSuits() {
  const suits = ['♠', '♥', '♦', '♣']
  const [scattered, setScattered] = useState<Array<{
    id: number
    suit: string
    x: number
    y: number
    rotation: number
    opacity: number
  }>>([])

  useEffect(() => {
    const newScattered = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      suit: suits[i % 4],
      x: Math.random() * 100,
      y: Math.random() * 100,
      rotation: Math.random() * 360,
      opacity: 0.05 + Math.random() * 0.1,
    }))
    setScattered(newScattered)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {scattered.map((s) => (
        <span
          key={s.id}
          className="absolute text-4xl select-none"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            transform: `rotate(${s.rotation}deg)`,
            opacity: s.opacity,
            color: s.suit === '♥' || s.suit === '♦' ? '#ff0033' : '#333',
          }}
        >
          {s.suit}
        </span>
      ))}
    </div>
  )
}

// Chain link decoration
function ChainLink({ broken = false }: { broken?: boolean }) {
  return (
    <svg viewBox="0 0 40 20" className="w-10 h-5">
      <ellipse
        cx="10"
        cy="10"
        rx="8"
        ry="6"
        fill="none"
        stroke={broken ? '#ff0033' : '#333'}
        strokeWidth="2"
        className={broken ? 'animate-pulse' : ''}
      />
      {!broken && (
        <ellipse
          cx="30"
          cy="10"
          rx="8"
          ry="6"
          fill="none"
          stroke="#333"
          strokeWidth="2"
        />
      )}
      {broken && (
        <>
          <line x1="18" y1="5" x2="25" y2="3" stroke="#ff0033" strokeWidth="2" />
          <line x1="18" y1="15" x2="25" y2="17" stroke="#ff0033" strokeWidth="2" />
        </>
      )}
    </svg>
  )
}

// Breaking chains animation
function BreakingChains() {
  return (
    <div className="fixed bottom-0 left-0 right-0 pointer-events-none z-[3] overflow-hidden flex justify-center gap-2 opacity-30">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-center" style={{ animationDelay: `${i * 0.1}s` }}>
          <ChainLink broken={i === 3 || i === 4} />
        </div>
      ))}
    </div>
  )
}

// Red paint stroke background
function PaintStroke({ position }: { position: 'top' | 'bottom' | 'left' | 'right' }) {
  const positions = {
    top: 'top-0 left-0 right-0 h-32',
    bottom: 'bottom-0 left-0 right-0 h-32',
    left: 'left-0 top-0 bottom-0 w-32',
    right: 'right-0 top-0 bottom-0 w-32',
  }

  const gradients = {
    top: 'linear-gradient(180deg, rgba(255,0,51,0.15), transparent)',
    bottom: 'linear-gradient(0deg, rgba(255,0,51,0.15), transparent)',
    left: 'linear-gradient(90deg, rgba(255,0,51,0.15), transparent)',
    right: 'linear-gradient(270deg, rgba(255,0,51,0.15), transparent)',
  }

  return (
    <div
      className={`fixed pointer-events-none z-[4] ${positions[position]}`}
      style={{
        background: gradients[position],
        maskImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
      }}
    />
  )
}

// Halftone overlay for comic book effect
function HalftoneOverlay() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[5] opacity-[0.03]"
      style={{
        backgroundImage: `radial-gradient(circle, #ff0033 1px, transparent 1px)`,
        backgroundSize: '8px 8px',
      }}
    />
  )
}

// Animated diagonal lines background
function DiagonalLines() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden opacity-10">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 bg-red-600 animate-slide-diagonal"
          style={{
            height: '200%',
            left: `${i * 5}%`,
            top: '-50%',
            transform: 'rotate(45deg)',
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  )
}

// Persona-style skewed panel
function SkewedPanel({
  children,
  color = '#ff0033',
  direction = 'right',
  delay = 0,
}: {
  children: React.ReactNode
  color?: string
  direction?: 'left' | 'right'
  delay?: number
}) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(timeout)
  }, [delay])

  return (
    <div
      className={`relative transition-all duration-500 ${
        visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
      }`}
      style={{
        transform: `skewX(${direction === 'right' ? '-3' : '3'}deg) ${visible ? '' : 'translateX(50px)'}`,
      }}
    >
      {/* Red accent bar */}
      <div
        className="absolute top-0 left-0 w-2 h-full"
        style={{ background: color }}
      />
      {/* Content */}
      <div
        className="pl-6 pr-4 py-4"
        style={{
          background: 'linear-gradient(90deg, rgba(26, 10, 10, 0.95), rgba(10, 10, 10, 0.8))',
          borderLeft: `4px solid ${color}`,
        }}
      >
        <div style={{ transform: `skewX(${direction === 'right' ? '3' : '-3'}deg)` }}>
          {children}
        </div>
      </div>
    </div>
  )
}

// ALL OUT ATTACK splash for featured items
function AllOutAttackSplash({ children, featured = false }: { children: React.ReactNode; featured?: boolean }) {
  if (!featured) return <>{children}</>

  return (
    <div className="relative group">
      {/* Splash background */}
      <div
        className="absolute -inset-2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, rgba(255,0,51,0.4) 0%, transparent 70%)`,
          filter: 'blur(10px)',
        }}
      />
      {/* Speed lines */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent"
            style={{
              top: `${10 + i * 12}%`,
              left: '-20%',
              right: '-20%',
              transform: `rotate(${-5 + Math.random() * 10}deg)`,
            }}
          />
        ))}
      </div>
      {children}
    </div>
  )
}

// Persona-style character portrait
function CharacterCard({
  profession,
  isActive,
  onClick,
}: {
  profession: 'engineer' | 'drummer' | 'fighter'
  isActive: boolean
  onClick: () => void
}) {
  const icons = { engineer: '💻', drummer: '🥁', fighter: '🥋' }
  const titles = { engineer: 'THE ENGINEER', drummer: 'THE MUSICIAN', fighter: 'THE FIGHTER' }
  const arcanas = { engineer: 'XII - THE HANGED MAN', drummer: 'V - THE HIEROPHANT', fighter: 'XI - STRENGTH' }

  return (
    <button
      onClick={onClick}
      className={`relative group transition-all duration-300 ${
        isActive ? 'scale-105 z-10' : 'opacity-60 hover:opacity-100'
      }`}
      style={{
        transform: `skewX(-5deg) ${isActive ? 'scale(1.05)' : ''}`,
      }}
    >
      {/* Card background */}
      <div
        className="p-6 relative overflow-hidden"
        style={{
          background: isActive
            ? 'linear-gradient(135deg, #ff0033, #990022)'
            : 'linear-gradient(135deg, #1a0a0a, #0a0a0a)',
          border: `3px solid ${isActive ? '#ff0033' : '#333'}`,
        }}
      >
        {/* Diagonal stripes */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 20px)',
          }}
        />

        {/* Content - counter-skew */}
        <div className="relative z-10" style={{ transform: 'skewX(5deg)' }}>
          <span className="text-5xl block mb-3">{icons[profession]}</span>
          <span
            className="text-lg font-black tracking-wider block"
            style={{ color: isActive ? '#000' : '#fff' }}
          >
            {titles[profession]}
          </span>
          <span
            className="text-[10px] tracking-widest block mt-1"
            style={{ color: isActive ? '#330011' : '#ff0033' }}
          >
            {arcanas[profession]}
          </span>
        </div>

        {/* Selection indicator */}
        {isActive && (
          <div className="absolute -right-2 top-1/2 -translate-y-1/2">
            <span className="text-2xl animate-pulse">◀</span>
          </div>
        )}
      </div>
    </button>
  )
}

// Role card with stylish display
function RoleCard({ role }: { role: typeof CURRENT_ROLES[0] }) {
  return (
    <div
      className="px-4 py-2 relative overflow-hidden group"
      style={{
        background: 'linear-gradient(90deg, rgba(255,0,51,0.1), transparent)',
        borderLeft: '3px solid #ff0033',
        transform: 'skewX(-3deg)',
      }}
    >
      <div style={{ transform: 'skewX(3deg)' }}>
        <span className="text-xs tracking-wider" style={{ color: '#ff0033' }}>
          {role.title}
        </span>
        <span className="text-sm font-bold block" style={{ color: '#fff' }}>
          {role.company}
        </span>
      </div>
    </div>
  )
}

// Tech stack display for engineer (ALL OUT ATTACK style)
function TechStackDisplay({ categories }: { categories: ReturnType<typeof getEngineerSkills> }) {
  return (
    <div className="space-y-6">
      {categories.map((category, catIndex) => (
        <div key={category.name} className="relative">
          {/* Category header */}
          <div
            className="flex items-center gap-3 mb-3"
            style={{ transform: 'skewX(-3deg)' }}
          >
            <span className="text-xl">{category.icon}</span>
            <h3
              className="text-sm font-black tracking-wider"
              style={{ color: '#ff0033' }}
            >
              {category.name.toUpperCase()}
            </h3>
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, #ff0033, transparent)' }} />
          </div>

          {/* Tech items */}
          <div className="flex flex-wrap gap-2">
            {category.items.map((tech, techIndex) => (
              <span
                key={tech}
                className="px-3 py-1 text-xs transition-all hover:scale-105 cursor-default"
                style={{
                  background: `rgba(255,0,51,${0.05 + (techIndex % 3) * 0.05})`,
                  border: '1px solid #ff003340',
                  color: '#fff',
                  transform: 'skewX(-3deg)',
                  animationDelay: `${catIndex * 100 + techIndex * 50}ms`,
                }}
              >
                <span style={{ display: 'inline-block', transform: 'skewX(3deg)' }}>
                  {tech}
                </span>
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// Skill burst effect (for drummer/fighter)
function SkillBurst({ name, level }: { name: string; level: number }) {
  return (
    <div
      className="relative px-4 py-2 group cursor-pointer"
      style={{
        background: 'linear-gradient(90deg, #ff003330, transparent)',
        clipPath: 'polygon(0 0, 100% 0, 95% 100%, 5% 100%)',
      }}
    >
      <div className="flex items-center gap-3">
        <span className="text-xs" style={{ color: '#ff0033' }}>
          {name}
        </span>
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 rotate-45"
              style={{
                background: i < level ? '#ff0033' : '#330011',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// Company card with Persona flair
function CompanyCard({ company }: { company: typeof COMPANIES[0] }) {
  return (
    <AllOutAttackSplash featured>
      <a
        href={company.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block relative overflow-hidden group"
        style={{
          background: 'linear-gradient(135deg, #1a0a0a, #0a0a0a)',
          border: '2px solid #330011',
          transform: 'skewX(-2deg)',
        }}
      >
        {/* Hover effect line */}
        <div
          className="absolute top-0 left-0 w-full h-1 transition-transform duration-300 origin-left scale-x-0 group-hover:scale-x-100"
          style={{ background: '#ff0033' }}
        />

        <div className="p-4" style={{ transform: 'skewX(2deg)' }}>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{company.icon}</span>
            <div>
              <h4 className="text-sm font-bold group-hover:text-red-500 transition-colors" style={{ color: '#fff' }}>
                {company.name}
              </h4>
              <p className="text-[10px]" style={{ color: '#ff0033' }}>{company.tagline}</p>
            </div>
          </div>
          <p className="text-xs" style={{ color: '#666' }}>{company.description}</p>

          {/* Services tags */}
          <div className="flex flex-wrap gap-1 mt-3">
            {company.services.slice(0, 3).map((service) => (
              <span
                key={service}
                className="text-[8px] px-2 py-0.5"
                style={{ background: '#ff003310', color: '#ff0033' }}
              >
                {service}
              </span>
            ))}
          </div>
        </div>
      </a>
    </AllOutAttackSplash>
  )
}

// Band card with musical flair
function BandCard({ band }: { band: typeof BANDS[0] }) {
  const content = (
    <div
      className="p-4 relative overflow-hidden group"
      style={{
        background: 'linear-gradient(135deg, #1a0a0a, #0a0a0a)',
        border: '2px solid #330011',
        transform: 'skewX(-2deg)',
      }}
    >
      {/* Musical note decoration */}
      <div
        className="absolute top-2 right-2 text-2xl opacity-20 group-hover:opacity-40 transition-opacity"
        style={{ color: '#ff0033' }}
      >
        ♪
      </div>

      <div style={{ transform: 'skewX(2deg)' }}>
        <h4 className="text-sm font-bold group-hover:text-red-500 transition-colors" style={{ color: '#fff' }}>
          {band.name}
        </h4>
        <p className="text-[10px] mt-1" style={{ color: '#ff0033' }}>
          {band.genre} | {band.role}
        </p>
        <p className="text-xs mt-2" style={{ color: '#666' }}>{band.description}</p>
        {!band.url && (
          <p className="text-[8px] mt-2 italic" style={{ color: '#444' }}>
            Website coming soon
          </p>
        )}
      </div>
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

// Work experience card with Persona 5 styling
function ExperienceCard({ entry }: { entry: typeof EXPERIENCE_DATA[0] }) {
  const endDisplay = entry.endDate ? new Date(entry.endDate).getFullYear() : 'Present'
  const startDisplay = new Date(entry.startDate).getFullYear()

  return (
    <div
      className="relative overflow-hidden group"
      style={{
        background: 'linear-gradient(135deg, #1a0a0a, #0a0a0a)',
        border: '2px solid #330011',
        transform: 'skewX(-2deg)',
      }}
    >
      {/* Red accent line */}
      <div
        className="absolute top-0 left-0 w-1 h-full transition-all duration-300 group-hover:w-2"
        style={{ background: '#ff0033' }}
      />

      <div className="p-4 pl-5" style={{ transform: 'skewX(2deg)' }}>
        <div className="flex justify-between items-start mb-2">
          <div>
            <h4 className="text-sm font-bold group-hover:text-red-500 transition-colors" style={{ color: '#fff' }}>
              {entry.title}
            </h4>
            <p className="text-[10px] mt-0.5" style={{ color: '#ff0033' }}>
              {entry.organization}
            </p>
          </div>
          <span
            className="text-[10px] px-2 py-1"
            style={{
              background: '#ff003315',
              border: '1px solid #ff003340',
              color: '#ff0033',
            }}
          >
            {startDisplay} - {endDisplay}
          </span>
        </div>

        <p className="text-xs mb-3" style={{ color: '#666' }}>
          {entry.description}
        </p>

        {entry.highlights && entry.highlights.length > 0 && (
          <ul className="space-y-1.5">
            {entry.highlights.map((highlight, i) => (
              <li
                key={i}
                className="text-xs flex items-start gap-2"
                style={{ color: '#ccc' }}
              >
                <span style={{ color: '#ff0033' }}>▸</span>
                {highlight}
              </li>
            ))}
          </ul>
        )}

        {/* Skills tags */}
        <div className="flex flex-wrap gap-1 mt-3">
          {entry.skills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="text-[8px] px-2 py-0.5"
              style={{ background: '#ff003320', color: '#ff0033' }}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// Project card with reveal effect
function ProjectCard({ project, index }: { project: typeof PROJECTS_DATA[0]; index: number }) {
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => setRevealed(true), 500 + index * 150)
    return () => clearTimeout(timeout)
  }, [index])

  return (
    <AllOutAttackSplash featured={project.featured}>
      <div
        className={`relative transition-all duration-500 ${
          revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
        style={{
          transform: `skewX(-2deg)`,
        }}
      >
        <div
          className="p-4 relative overflow-hidden group cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, #1a0a0a, #0a0a0a)',
            border: `2px solid ${project.featured ? '#ff0033' : '#330011'}`,
          }}
        >
          {/* Red reveal line */}
          <div
            className="absolute top-0 left-0 w-full h-1 transition-transform duration-300 group-hover:scale-x-100"
            style={{
              background: '#ff0033',
              transform: 'scaleX(0)',
              transformOrigin: 'left',
            }}
          />

          <div style={{ transform: 'skewX(2deg)' }}>
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-bold" style={{ color: '#ff0033' }}>
                {project.name}
              </span>
              {project.featured && (
                <span
                  className="text-[8px] px-2 py-1 font-bold animate-pulse"
                  style={{ background: '#ff0033', color: '#000' }}
                >
                  ALL OUT
                </span>
              )}
            </div>
            <p className="text-[10px]" style={{ color: '#666' }}>
              {project.tagline}
            </p>
            {project.impact && (
              <p className="text-[10px] mt-2 italic" style={{ color: '#ff0033' }}>
                → {project.impact}
              </p>
            )}
            <div className="flex gap-2 mt-2 flex-wrap">
              {project.techStack.slice(0, 4).map((tech) => (
                <span
                  key={tech}
                  className="text-[8px] px-2 py-0.5"
                  style={{ background: '#ff003320', color: '#ff0033' }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AllOutAttackSplash>
  )
}

// Dramatic TAKE YOUR TIME
function TakeYourTime() {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1000),
      setTimeout(() => setPhase(3), 1500),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="relative h-32 flex items-center justify-center overflow-hidden">
      {/* Background splash */}
      <div
        className={`absolute inset-0 transition-all duration-500 ${phase >= 1 ? 'opacity-100' : 'opacity-0'}`}
        style={{
          background: 'radial-gradient(ellipse at center, rgba(255,0,51,0.2) 0%, transparent 70%)',
        }}
      />

      {/* Speed lines */}
      <div className={`absolute inset-0 overflow-hidden transition-opacity duration-500 ${phase >= 2 ? 'opacity-30' : 'opacity-0'}`}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute h-0.5 animate-speed-line"
            style={{
              top: `${5 + i * 8}%`,
              left: '-100%',
              right: '-100%',
              background: 'linear-gradient(90deg, transparent, #ff0033, transparent)',
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>

      {/* Main text */}
      <div
        className={`relative transition-all duration-700 ${phase >= 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-150'}`}
        style={{ transform: 'skewX(-5deg)' }}
      >
        <span
          className="text-6xl md:text-7xl font-black tracking-widest animate-pulse"
          style={{
            color: '#ff0033',
            textShadow: '4px 4px 0 #000, 8px 8px 0 #330011, -2px -2px 0 #ff003380',
            WebkitTextStroke: '2px #330011',
          }}
        >
          TAKE YOUR TIME
        </span>

        {/* Underline accent */}
        <div
          className="absolute -bottom-2 left-1/4 right-1/4 h-1"
          style={{
            background: 'linear-gradient(90deg, transparent, #ff0033, transparent)',
          }}
        />
      </div>

      {/* Card suits decoration */}
      <span
        className={`absolute left-4 top-1/2 -translate-y-1/2 text-4xl transition-all duration-500 ${phase >= 2 ? 'opacity-30' : 'opacity-0'}`}
        style={{ color: '#ff0033' }}
      >
        ♠
      </span>
      <span
        className={`absolute right-4 top-1/2 -translate-y-1/2 text-4xl transition-all duration-500 ${phase >= 2 ? 'opacity-30' : 'opacity-0'}`}
        style={{ color: '#ff0033' }}
      >
        ♥
      </span>
    </div>
  )
}

export default function BoldNoirTheme() {
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

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: '#0a0a0a',
        fontFamily: '"Bebas Neue", "Impact", sans-serif',
      }}
    >
      {/* Background layers */}
      <DiagonalLines />
      <FloatingMasks />
      <CardSuits />
      <StylishOrnaments profession={active} />
      <HalftoneOverlay />
      <PaintStroke position="top" />
      <PaintStroke position="right" />
      <BreakingChains />

      {/* Red corner accent */}
      <div
        className="fixed top-0 right-0 w-96 h-96 pointer-events-none z-[6]"
        style={{
          background: 'linear-gradient(225deg, rgba(255, 0, 51, 0.3), transparent 60%)',
        }}
      />

      {/* Header */}
      <header className="relative z-30 p-6">
        <div className="max-w-6xl mx-auto flex justify-between items-start">
          <div style={{ transform: 'skewX(-3deg)' }}>
            <h1
              className="text-4xl font-black tracking-wider"
              style={{
                color: '#ff0033',
                textShadow: '3px 3px 0 #000, 6px 6px 0 #330011',
              }}
            >
              ALEXANDER PULIDO
            </h1>
            <p className="text-sm tracking-wider mt-2" style={{ color: '#ccc' }}>
              {PROFESSIONAL_SUMMARY.headline}
            </p>
            <p className="text-xs tracking-wider mt-1 italic" style={{ color: '#ff0033' }}>
              {PROFESSIONAL_SUMMARY.tagline}
            </p>
          </div>

          <div className="flex gap-3 items-center" style={{ transform: 'skewX(-3deg)' }}>
            <Link
              href="/cv"
              className="px-4 py-2 text-sm tracking-wider transition-all hover:scale-105 hover:bg-red-900/20"
              style={{
                background: 'transparent',
                border: '3px solid #ff0033',
                color: '#ff0033',
              }}
            >
              PROFILE
            </Link>
            <Link
              href="/personal-projects/game-engine"
              className="px-4 py-2 text-sm tracking-wider transition-all hover:scale-105"
              style={{
                background: '#ff0033',
                color: '#000',
              }}
            >
              PLAY
            </Link>
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      {/* Current Roles */}
      <section className="relative z-20 py-4 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-6">
            {CURRENT_ROLES.map((role) => (
              <RoleCard key={role.id} role={role} />
            ))}
          </div>
        </div>
      </section>

      {/* Main content */}
      <main className="relative z-20 px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Take Your Time message */}
          <TakeYourTime />

          {/* Character selection */}
          <section className="mb-12 mt-8">
            <div className="flex justify-center gap-6">
              {(['engineer', 'drummer', 'fighter'] as const).map((prof) => (
                <CharacterCard
                  key={prof}
                  profession={prof}
                  isActive={active === prof}
                  onClick={() => setActive(prof)}
                />
              ))}
            </div>
          </section>

          {/* About section */}
          <SkewedPanel color="#ff0033" direction="right" delay={200}>
            <h2 className="text-xl font-black mb-3" style={{ color: '#ff0033' }}>
              ABOUT
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: '#ccc' }}>
              {aboutData.bio}
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {aboutData.quickFacts.map((fact, i) => (
                <span
                  key={i}
                  className="text-[10px] px-3 py-1 font-bold"
                  style={{
                    background: '#ff003320',
                    border: '1px solid #ff0033',
                    color: '#ff0033',
                    transform: 'skewX(-5deg)',
                  }}
                >
                  {fact}
                </span>
              ))}
            </div>
          </SkewedPanel>

          {/* Work Experience section */}
          {experience.length > 0 && (
            <div className="mt-8">
              <SkewedPanel color="#ff0033" direction="left" delay={300}>
                <h2 className="text-xl font-black mb-4" style={{ color: '#ff0033' }}>
                  WORK EXPERIENCE
                </h2>
                <div className="space-y-4">
                  {experience.map((entry) => (
                    <ExperienceCard key={entry.id} entry={entry} />
                  ))}
                </div>
              </SkewedPanel>
            </div>
          )}

          {/* Skills / Tech Stack section */}
          <div className="mt-8">
            {active === 'engineer' ? (
              <SkewedPanel color="#ff0033" direction="left" delay={400}>
                <h2 className="text-xl font-black mb-4" style={{ color: '#ff0033' }}>
                  TECH STACK
                </h2>
                <TechStackDisplay categories={engineerTech} />
              </SkewedPanel>
            ) : (
              <SkewedPanel color="#ff0033" direction="left" delay={400}>
                <h2 className="text-xl font-black mb-4" style={{ color: '#ff0033' }}>
                  SKILLS
                </h2>
                {otherSkills.map((category) => (
                  <div key={category.name} className="mb-4 last:mb-0">
                    <h3 className="text-xs tracking-widest mb-2 flex items-center gap-2" style={{ color: '#666' }}>
                      <span>{category.icon}</span>
                      {category.name}
                    </h3>
                    <div className="space-y-1">
                      {category.skills.map((skill) => (
                        <SkillBurst key={skill.name} name={skill.name} level={skill.proficiency} />
                      ))}
                    </div>
                  </div>
                ))}
              </SkewedPanel>
            )}
          </div>

          {/* Companies (Engineer) / Bands (Drummer) */}
          {active === 'engineer' && (
            <section className="mt-8">
              <div
                className="mb-4 text-xl font-black"
                style={{
                  color: '#ff0033',
                  transform: 'skewX(-3deg)',
                }}
              >
                COMPANIES
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {COMPANIES.map((company) => (
                  <CompanyCard key={company.id} company={company} />
                ))}
              </div>
            </section>
          )}

          {active === 'drummer' && (
            <section className="mt-8">
              <div
                className="mb-4 text-xl font-black"
                style={{
                  color: '#ff0033',
                  transform: 'skewX(-3deg)',
                }}
              >
                BANDS
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {BANDS.map((band) => (
                  <BandCard key={band.id} band={band} />
                ))}
              </div>
            </section>
          )}

          {/* Projects section */}
          <section className="mt-8">
            <div
              className="mb-4 text-xl font-black"
              style={{
                color: '#ff0033',
                transform: 'skewX(-3deg)',
              }}
            >
              PROJECTS
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {projects.slice(0, 6).map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 py-8 text-center">
        <div className="flex items-center justify-center gap-4">
          <span style={{ color: '#ff0033' }}>♠</span>
          <p
            className="text-xs tracking-widest"
            style={{ color: '#333', transform: 'skewX(-3deg)' }}
          >
            THE PHANTOM THIEVES OF CODE • 2026
          </p>
          <span style={{ color: '#ff0033' }}>♥</span>
        </div>
      </footer>

      {/* Animations */}
      <style jsx global>{`
        @keyframes slide-diagonal {
          0% { transform: rotate(45deg) translateY(-100%); }
          100% { transform: rotate(45deg) translateY(100%); }
        }
        .animate-slide-diagonal {
          animation: slide-diagonal 3s linear infinite;
        }
        @keyframes float-mask {
          0%, 100% { transform: rotate(var(--rotation, 0deg)) scale(var(--scale, 1)) translateY(0); }
          50% { transform: rotate(var(--rotation, 0deg)) scale(var(--scale, 1)) translateY(-10px); }
        }
        @keyframes speed-line {
          0% { transform: translateX(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }
        .animate-speed-line {
          animation: speed-line 2s ease-in-out infinite;
        }
        @keyframes stylishFloat {
          0%, 100% { transform: rotate(var(--rotation, 0deg)) translateY(0) translateX(0); }
          25% { transform: rotate(var(--rotation, 0deg)) translateY(-12px) translateX(8px); }
          75% { transform: rotate(var(--rotation, 0deg)) translateY(-6px) translateX(-6px); }
        }
        @keyframes attack-flash {
          0% { opacity: 0; transform: scale(0.5) skewX(-30deg); }
          30% { opacity: 1; transform: scale(1.1) skewX(-5deg); }
          70% { opacity: 1; transform: scale(1) skewX(0deg); }
          100% { opacity: 0; transform: scale(1.2) skewX(10deg); }
        }
        .animate-attack-flash { animation: attack-flash 0.8s ease-out forwards; }
      `}</style>
    </div>
  )
}
