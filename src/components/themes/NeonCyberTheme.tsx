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

// Intense glitch text effect with RGB split
function GlitchText({ text, className = '', intensity = 'normal' }: { text: string; className?: string; intensity?: 'normal' | 'high' }) {
  const [glitching, setGlitching] = useState(false)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const probability = intensity === 'high' ? 0.9 : 0.95
    const interval = setInterval(() => {
      if (Math.random() > probability) {
        setGlitching(true)
        setOffset({ x: Math.random() * 6 - 3, y: Math.random() * 4 - 2 })
        setTimeout(() => setGlitching(false), 80 + Math.random() * 100)
      }
    }, 80)
    return () => clearInterval(interval)
  }, [intensity])

  return (
    <span className={`relative inline-block ${className}`}>
      <span className="relative z-10">{text}</span>
      {glitching && (
        <>
          <span
            className="absolute top-0 left-0 text-cyan-400 z-0 mix-blend-screen"
            style={{
              clipPath: 'inset(0 0 60% 0)',
              transform: `translate(${-offset.x}px, ${offset.y}px)`,
            }}
          >
            {text}
          </span>
          <span
            className="absolute top-0 left-0 text-pink-500 z-0 mix-blend-screen"
            style={{
              clipPath: 'inset(40% 0 0 0)',
              transform: `translate(${offset.x}px, ${-offset.y}px)`,
            }}
          >
            {text}
          </span>
          <span
            className="absolute top-0 left-0 text-yellow-400 z-0 mix-blend-screen opacity-50"
            style={{
              clipPath: 'inset(20% 0 40% 0)',
              transform: `translate(${offset.x * 0.5}px, 0)`,
            }}
          >
            {text}
          </span>
        </>
      )}
    </span>
  )
}

// Flickering neon sign with Japanese text
function NeonSign({ text, subtext, color = '#ff00ff' }: { text: string; subtext?: string; color?: string }) {
  const [flicker, setFlicker] = useState(1)

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.95) {
        setFlicker(0.3 + Math.random() * 0.4)
        setTimeout(() => setFlicker(1), 50 + Math.random() * 100)
      }
    }, 100)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className="text-center py-2"
      style={{
        opacity: flicker,
        textShadow: `0 0 10px ${color}, 0 0 20px ${color}, 0 0 40px ${color}, 0 0 80px ${color}`,
        color: color,
      }}
    >
      <span className="text-2xl font-bold tracking-wider">{text}</span>
      {subtext && (
        <span className="block text-xs mt-1 opacity-70">{subtext}</span>
      )}
    </div>
  )
}

// Terminal line with typing effect
function TerminalLine({ prefix, text, delay = 0 }: { prefix: string; text: string; delay?: number }) {
  const [displayed, setDisplayed] = useState('')
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const startTimeout = setTimeout(() => setStarted(true), delay)
    return () => clearTimeout(startTimeout)
  }, [delay])

  useEffect(() => {
    if (!started) return
    let i = 0
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1))
        i++
      } else {
        clearInterval(interval)
      }
    }, 15)
    return () => clearInterval(interval)
  }, [text, started])

  return (
    <div className="font-mono text-sm">
      <span className="text-pink-500">{prefix}</span>
      <span className="text-cyan-400">{displayed}</span>
      {started && displayed.length < text.length && (
        <span className="animate-pulse text-cyan-400">_</span>
      )}
    </div>
  )
}

// HUD Scanner corners
function ScannerCorners({ children, color = '#00ffff' }: { children: React.ReactNode; color?: string }) {
  return (
    <div className="relative">
      {/* Scanner corners */}
      <div className="absolute -top-1 -left-1 w-6 h-6">
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <path d="M0,12 L0,2 Q0,0 2,0 L12,0" fill="none" stroke={color} strokeWidth="2" />
        </svg>
      </div>
      <div className="absolute -top-1 -right-1 w-6 h-6">
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <path d="M24,12 L24,2 Q24,0 22,0 L12,0" fill="none" stroke={color} strokeWidth="2" />
        </svg>
      </div>
      <div className="absolute -bottom-1 -left-1 w-6 h-6">
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <path d="M0,12 L0,22 Q0,24 2,24 L12,24" fill="none" stroke={color} strokeWidth="2" />
        </svg>
      </div>
      <div className="absolute -bottom-1 -right-1 w-6 h-6">
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <path d="M24,12 L24,22 Q24,24 22,24 L12,24" fill="none" stroke={color} strokeWidth="2" />
        </svg>
      </div>
      {children}
    </div>
  )
}

// Cyber panel with neon border and holographic effect
function CyberPanel({ title, children, accentColor = '#ff00ff', holographic = false }: {
  title: string
  children: React.ReactNode
  accentColor?: string
  holographic?: boolean
}) {
  return (
    <div className="relative group">
      {/* Glow effect */}
      <div
        className="absolute -inset-0.5 opacity-40 blur-sm group-hover:opacity-60 transition-opacity"
        style={{ background: `linear-gradient(45deg, ${accentColor}, #00ffff)` }}
      />

      {/* Circuit pattern border */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(90deg, ${accentColor} 1px, transparent 1px),
            linear-gradient(${accentColor} 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
        }}
      />

      {/* Panel */}
      <div
        className={`relative p-4 ${holographic ? 'backdrop-blur-sm' : ''}`}
        style={{
          background: holographic
            ? `linear-gradient(135deg, rgba(10, 5, 18, 0.85), rgba(20, 10, 30, 0.75))`
            : 'rgba(10, 5, 18, 0.95)',
          border: `1px solid ${accentColor}`,
          boxShadow: `inset 0 0 30px rgba(0,0,0,0.5), 0 0 20px ${accentColor}30`,
        }}
      >
        {/* Corner accents with circuit lines */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2" style={{ borderColor: '#00ffff' }} />
        <div className="absolute top-2 left-8 w-4 h-px" style={{ background: '#00ffff' }} />
        <div className="absolute top-8 left-2 w-px h-4" style={{ background: '#00ffff' }} />

        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2" style={{ borderColor: '#00ffff' }} />
        <div className="absolute top-2 right-8 w-4 h-px" style={{ background: '#00ffff' }} />
        <div className="absolute top-8 right-2 w-px h-4" style={{ background: '#00ffff' }} />

        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2" style={{ borderColor: accentColor }} />
        <div className="absolute bottom-2 left-8 w-4 h-px" style={{ background: accentColor }} />
        <div className="absolute bottom-8 left-2 w-px h-4" style={{ background: accentColor }} />

        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2" style={{ borderColor: accentColor }} />
        <div className="absolute bottom-2 right-8 w-4 h-px" style={{ background: accentColor }} />
        <div className="absolute bottom-8 right-2 w-px h-4" style={{ background: accentColor }} />

        {/* Title with data overlay style */}
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: accentColor, boxShadow: `0 0 10px ${accentColor}` }} />
            <div className="w-1 h-1 rounded-full opacity-60" style={{ background: accentColor }} />
            <div className="w-1 h-1 rounded-full opacity-30" style={{ background: accentColor }} />
          </div>
          <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: accentColor }}>
            {'//'} {title}
          </span>
          <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${accentColor}40, transparent)` }} />
        </div>

        {children}
      </div>
    </div>
  )
}

// Matrix-like data stream background
function DataStream() {
  const [chars, setChars] = useState<Array<{ id: number; x: number; char: string; speed: number; opacity: number }>>([])

  useEffect(() => {
    const characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'.split('')
    const newChars = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      char: characters[Math.floor(Math.random() * characters.length)],
      speed: Math.random() * 15 + 8,
      opacity: Math.random() * 0.4 + 0.1,
    }))
    setChars(newChars)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {chars.map((c) => (
        <div
          key={c.id}
          className="absolute text-cyan-400 text-xs animate-fall font-mono"
          style={{
            left: `${c.x}%`,
            opacity: c.opacity,
            animationDuration: `${c.speed}s`,
            animationDelay: `${-c.speed * Math.random()}s`,
            textShadow: '0 0 5px #00ffff',
          }}
        >
          {c.char}
        </div>
      ))}
    </div>
  )
}

// Night City skyline silhouette
function NightCitySkyline() {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-64 pointer-events-none z-[2] opacity-30">
      <svg viewBox="0 0 1200 200" className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="skylineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0a0512" stopOpacity="0" />
            <stop offset="100%" stopColor="#ff00ff" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="buildingGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1a0a2a" />
            <stop offset="100%" stopColor="#0a0512" />
          </linearGradient>
        </defs>
        {/* Buildings silhouette */}
        <path
          d="M0,200 L0,150 L30,150 L30,120 L50,120 L50,100 L70,100 L70,80 L90,80 L90,100 L110,100 L110,60 L130,60 L130,40 L150,40 L150,60 L170,60 L170,90 L190,90 L190,70 L210,70 L210,50 L230,50 L230,30 L250,30 L250,50 L270,50 L270,80 L290,80 L290,100 L310,100 L310,70 L330,70 L330,40 L350,40 L350,20 L370,20 L370,40 L390,40 L390,60 L410,60 L410,90 L430,90 L430,110 L450,110 L450,80 L470,80 L470,50 L490,50 L490,70 L510,70 L510,100 L530,100 L530,120 L550,120 L550,90 L570,90 L570,60 L590,60 L590,30 L610,30 L610,50 L630,50 L630,80 L650,80 L650,100 L670,100 L670,70 L690,70 L690,40 L710,40 L710,60 L730,60 L730,90 L750,90 L750,110 L770,110 L770,80 L790,80 L790,50 L810,50 L810,70 L830,70 L830,100 L850,100 L850,60 L870,60 L870,30 L890,30 L890,50 L910,50 L910,80 L930,80 L930,100 L950,100 L950,70 L970,70 L970,40 L990,40 L990,60 L1010,60 L1010,90 L1030,90 L1030,110 L1050,110 L1050,80 L1070,80 L1070,120 L1090,120 L1090,140 L1110,140 L1110,160 L1130,160 L1130,180 L1150,180 L1150,200 L1200,200 Z"
          fill="url(#buildingGrad)"
        />
        {/* Neon glow at base */}
        <rect x="0" y="190" width="1200" height="10" fill="url(#skylineGrad)" />
      </svg>
      {/* Scattered neon lights on buildings */}
      <div className="absolute inset-0">
        {Array.from({ length: 30 }, (_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full animate-pulse"
            style={{
              left: `${5 + Math.random() * 90}%`,
              bottom: `${20 + Math.random() * 60}%`,
              background: ['#ff00ff', '#00ffff', '#ffff00', '#ff0066'][Math.floor(Math.random() * 4)],
              boxShadow: `0 0 5px currentColor`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

// Cyberware icon
function CyberwareIcon({ type }: { type: 'eye' | 'arm' | 'chip' | 'jack' }) {
  const icons = {
    eye: '⦿',
    arm: '⟨⟩',
    chip: '◈',
    jack: '⌬',
  }
  return (
    <span className="text-cyan-400 text-xs" style={{ textShadow: '0 0 5px #00ffff' }}>
      {icons[type]}
    </span>
  )
}

// Tech skill chip with cyber styling
function SkillChip({ name, level }: { name: string; level: number }) {
  const colors = ['#ff00ff', '#00ffff', '#ffff00', '#ff0066', '#00ff66']
  const color = colors[level % colors.length]

  return (
    <div
      className="px-3 py-1 text-[10px] relative overflow-hidden group cursor-pointer transition-all hover:scale-105"
      style={{
        background: `${color}15`,
        border: `1px solid ${color}60`,
        color: color,
        clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)',
      }}
    >
      {/* Scan line effect */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}40, transparent)`,
          animation: 'scan 0.8s ease-in-out infinite',
        }}
      />
      <span className="relative z-10 font-mono">{name}</span>
    </div>
  )
}

// Role badge with cyber styling
function RoleBadge({ title, company, type }: { title: string; company: string; type: 'employment' | 'leadership' }) {
  const color = type === 'leadership' ? '#ff00ff' : '#00ffff'

  return (
    <div
      className="px-4 py-2 text-center transition-all hover:scale-105"
      style={{
        background: `linear-gradient(135deg, ${color}15, transparent)`,
        border: `1px solid ${color}50`,
        clipPath: 'polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)',
      }}
    >
      <div className="text-[10px] tracking-wider" style={{ color: color }}>
        {type === 'leadership' ? '// LEADERSHIP' : '// EMPLOYMENT'}
      </div>
      <div className="text-sm font-bold" style={{ color: '#ffffff' }}>{title}</div>
      <div className="text-xs" style={{ color: color }}>{company}</div>
    </div>
  )
}

// Company card - Night City megacorp style
function CompanyCard({ company }: { company: typeof COMPANIES[0] }) {
  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block relative group"
    >
      <div
        className="p-4 transition-all group-hover:scale-[1.02]"
        style={{
          background: 'linear-gradient(135deg, rgba(255,0,255,0.1), rgba(0,255,255,0.05))',
          border: '1px solid #ff00ff50',
          clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))',
        }}
      >
        {/* Corner cut decorations */}
        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-cyan-400/50"
          style={{ transform: 'translate(0, 0) rotate(0deg)' }} />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-pink-500/50" />

        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">{company.icon}</span>
          <div>
            <h4 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
              {company.name}
            </h4>
            <p className="text-[10px] text-pink-500">{company.tagline}</p>
          </div>
        </div>
        <p className="text-xs text-white/70 mb-3">{company.description}</p>
        <div className="flex flex-wrap gap-1">
          {company.services.slice(0, 3).map((service) => (
            <span
              key={service}
              className="text-[8px] px-2 py-0.5 bg-cyan-400/10 border border-cyan-400/30 text-cyan-400"
            >
              {service}
            </span>
          ))}
        </div>

        {/* External link indicator */}
        <div className="absolute top-2 right-6 text-[10px] text-cyan-400/50 group-hover:text-cyan-400 transition-colors">
          [LINK]
        </div>
      </div>
    </a>
  )
}

// Band card - cyber music style
function BandCard({ band }: { band: typeof BANDS[0] }) {
  const content = (
    <div
      className="p-4 transition-all hover:scale-[1.02] group"
      style={{
        background: 'linear-gradient(135deg, rgba(153,102,204,0.1), rgba(0,255,255,0.05))',
        border: '1px solid #9966cc50',
        clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))',
      }}
    >
      <h4 className="text-sm font-bold text-white group-hover:text-pink-400 transition-colors">
        {band.name}
      </h4>
      <p className="text-[10px] mt-1" style={{ color: '#9966cc' }}>
        {band.genre} | {band.role}
      </p>
      <p className="text-xs text-white/70 mt-2">{band.description}</p>
      {band.url ? (
        <div className="text-[10px] text-cyan-400/70 mt-2">[STREAM_LINK]</div>
      ) : (
        <div className="text-[10px] text-white/30 mt-2 italic">[LINK_PENDING]</div>
      )}
    </div>
  )

  if (band.url) {
    return <a href={band.url} target="_blank" rel="noopener noreferrer" className="block">{content}</a>
  }
  return content
}

// Work experience card - cyber dossier style
function ExperienceCard({ entry }: { entry: typeof EXPERIENCE_DATA[0] }) {
  const endDisplay = entry.endDate ? new Date(entry.endDate).getFullYear() : 'ACTIVE'
  const startDisplay = new Date(entry.startDate).getFullYear()

  return (
    <div
      className="p-4 border border-white/10 transition-all hover:border-cyan-400/50 group"
      style={{
        background: 'linear-gradient(135deg, rgba(0,255,255,0.05), transparent)',
        clipPath: 'polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)',
      }}
    >
      {/* Header with title and dates */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <span className="text-sm text-cyan-400 group-hover:text-pink-400 transition-colors font-mono">
            {entry.title}
          </span>
          <div className="text-[10px] text-pink-500 mt-0.5">{entry.organization}</div>
        </div>
        <span className="text-[10px] text-white/50 font-mono px-2 py-0.5 bg-white/5 border border-white/10">
          {startDisplay} - {endDisplay}
        </span>
      </div>

      {/* Description */}
      <p className="text-[11px] text-white/70 mb-2 font-mono">{entry.description}</p>

      {/* Highlights */}
      {entry.highlights && entry.highlights.length > 0 && (
        <ul className="space-y-1 mb-2">
          {entry.highlights.map((highlight, i) => (
            <li key={i} className="text-[10px] text-cyan-400 flex items-start gap-2 font-mono">
              <span className="text-pink-500">&gt;</span>
              {highlight}
            </li>
          ))}
        </ul>
      )}

      {/* Skills tags */}
      <div className="flex flex-wrap gap-1 mt-2">
        {entry.skills.slice(0, 5).map((skill) => (
          <span
            key={skill}
            className="text-[8px] px-2 py-0.5 bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 font-mono"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  )
}

// Tech category display
function TechCategory({ category }: { category: ReturnType<typeof getEngineerSkills>[0] }) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-base">{category.icon}</span>
        <span className="text-xs text-pink-500 tracking-wider font-mono">
          {category.name.toUpperCase()}
        </span>
        <div className="flex-1 h-px bg-gradient-to-r from-pink-500/30 to-transparent" />
      </div>
      <div className="flex flex-wrap gap-2">
        {category.items.map((tech, i) => (
          <span
            key={tech}
            className="px-2 py-1 text-[10px] font-mono transition-all hover:scale-105 cursor-default"
            style={{
              background: `${['#ff00ff', '#00ffff', '#ffff00', '#00ff66', '#ff6600'][i % 5]}15`,
              border: `1px solid ${['#ff00ff', '#00ffff', '#ffff00', '#00ff66', '#ff6600'][i % 5]}40`,
              color: ['#ff00ff', '#00ffff', '#ffff00', '#00ff66', '#ff6600'][i % 5],
            }}
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function NeonCyberTheme() {
  const { theme } = useTheme()
  const { active, setActive, config } = useProfession()
  const [mounted, setMounted] = useState(false)
  const [glitchScreen, setGlitchScreen] = useState(false)
  const [screenTear, setScreenTear] = useState<number | null>(null)

  const aboutData = ABOUT_DATA[active]
  const engineerTech = getEngineerSkills()
  const otherSkills = getSkillsByProfession(active)
  const projects = PROJECTS_DATA.filter(p => p.professions.includes(active) || p.featured)
  const experience = filterExperienceByProfession(EXPERIENCE_DATA, active)

  useEffect(() => {
    setMounted(true)

    // Random screen glitch and tear effects
    const interval = setInterval(() => {
      const rand = Math.random()
      if (rand > 0.98) {
        setGlitchScreen(true)
        setTimeout(() => setGlitchScreen(false), 100 + Math.random() * 100)
      }
      if (rand > 0.97 && rand <= 0.98) {
        setScreenTear(Math.random() * 80 + 10)
        setTimeout(() => setScreenTear(null), 50)
      }
    }, 100)

    return () => clearInterval(interval)
  }, [])

  if (!mounted) return null

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0a0512 0%, #150a20 50%, #0a0512 100%)',
        fontFamily: '"Share Tech Mono", "Courier New", monospace',
        transform: glitchScreen ? `translateX(${Math.random() * 8 - 4}px)` : 'none',
      }}
    >
      {/* Screen tear effect */}
      {screenTear && (
        <div
          className="fixed left-0 right-0 h-2 z-50 pointer-events-none"
          style={{
            top: `${screenTear}%`,
            background: 'linear-gradient(90deg, #ff00ff, #00ffff)',
            mixBlendMode: 'screen',
          }}
        />
      )}

      {/* Data stream background */}
      <DataStream />

      {/* Night City skyline */}
      <NightCitySkyline />

      {/* Scanlines */}
      <div
        className="fixed inset-0 pointer-events-none z-[5]"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,255,0.02) 2px, rgba(0,255,255,0.02) 4px)',
        }}
      />

      {/* Chromatic aberration on edges */}
      <div
        className="fixed inset-0 pointer-events-none z-[6]"
        style={{
          boxShadow: 'inset 0 0 150px rgba(255,0,255,0.15), inset 0 0 300px rgba(0,255,255,0.08)',
        }}
      />

      {/* CRT vignette */}
      <div
        className="fixed inset-0 pointer-events-none z-[7]"
        style={{
          background: 'radial-gradient(circle at 50% 50%, transparent 40%, rgba(0,0,0,0.8) 100%)',
        }}
      />

      {/* Top HUD elements */}
      <div className="fixed top-4 left-4 z-40 text-[8px] text-cyan-400/50 font-mono space-y-1">
        <div>SYS_STATUS: ONLINE</div>
        <div>NET_LINK: STABLE</div>
        <div>ICE_BYPASS: ACTIVE</div>
      </div>
      <div className="fixed top-4 right-20 z-40 text-[8px] text-pink-500/50 font-mono text-right space-y-1">
        <div>LOC: NIGHT_CITY</div>
        <div>SECTOR: WATSON</div>
        <div>TIME: {new Date().toLocaleTimeString('en-US', { hour12: false })}</div>
      </div>

      {/* Header */}
      <header className="relative z-30 p-6 pt-16">
        <div className="max-w-6xl mx-auto">
          <ScannerCorners>
            <div className="p-4 bg-black/40">
              <div className="flex justify-between items-start flex-wrap gap-4">
                <div>
                  <h1 className="text-4xl tracking-[0.2em] font-bold">
                    <GlitchText text="ALEXANDER" className="text-pink-500" intensity="high" />
                    <span className="text-white mx-2">{'/'}</span>
                    <GlitchText text="PULIDO" className="text-cyan-400" intensity="high" />
                  </h1>
                  <div className="mt-3 text-sm text-white/90">
                    {PROFESSIONAL_SUMMARY.headline}
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" style={{ boxShadow: '0 0 10px #00ff00' }} />
                    <span className="text-xs text-pink-500 tracking-wider italic">
                      &quot;{PROFESSIONAL_SUMMARY.tagline}&quot;
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 items-center flex-wrap">
                  <Link
                    href="/cv"
                    className="px-4 py-2 text-xs tracking-wider border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all font-mono"
                    style={{ clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }}
                  >
                    [DOWNLOAD.exe]
                  </Link>
                  <Link
                    href="/personal-projects/game-engine"
                    className="px-4 py-2 text-xs tracking-wider bg-pink-500 text-black hover:bg-pink-400 transition-all font-mono"
                    style={{ clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }}
                  >
                    [NEBULITH.run]
                  </Link>
                  <ThemeSwitcher />
                </div>
              </div>
            </div>
          </ScannerCorners>
        </div>
      </header>

      {/* Current Roles */}
      <section className="relative z-20 py-6 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-4">
            <span className="text-[10px] tracking-[0.3em] text-cyan-400/70 font-mono">
              {'//'} ACTIVE_CONTRACTS
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {CURRENT_ROLES.map((role) => (
              <RoleBadge
                key={role.id}
                title={role.title}
                company={role.company}
                type={role.type}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Neon signs */}
      <div className="relative z-20 py-4">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-center gap-8 flex-wrap">
            <NeonSign text="NETRUNNER" subtext="CODE_MASTER" color="#00ffff" />
            <NeonSign text="CHROME" subtext="FULL_STACK" color="#ff00ff" />
            <NeonSign text="PREEM" subtext="ENGINEER" color="#ffff00" />
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="relative z-20 px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Terminal header */}
          <div className="mb-8 p-4 bg-black/80 border border-cyan-400/30">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500" style={{ boxShadow: '0 0 5px #ff0000' }} />
              <div className="w-3 h-3 rounded-full bg-yellow-500" style={{ boxShadow: '0 0 5px #ffff00' }} />
              <div className="w-3 h-3 rounded-full bg-green-500" style={{ boxShadow: '0 0 5px #00ff00' }} />
              <span className="ml-4 text-xs text-white/50 font-mono">v-term@night-city:~</span>
            </div>
            <TerminalLine prefix="$ " text="cat /netrunner/alex/profile.db" delay={0} />
            <TerminalLine prefix="> " text={PROFESSIONAL_SUMMARY.bio.slice(0, 120) + '...'} delay={800} />
            <TerminalLine prefix="$ " text={`set PROFESSION=${active.toUpperCase()}`} delay={2500} />
          </div>

          {/* Profession selector */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {(['engineer', 'drummer', 'fighter'] as const).map((prof) => (
              <button
                key={prof}
                onClick={() => setActive(prof)}
                className={`p-4 text-left transition-all relative overflow-hidden ${
                  active === prof ? 'scale-105' : 'opacity-60 hover:opacity-100'
                }`}
                style={{
                  background: active === prof
                    ? 'linear-gradient(135deg, rgba(255,0,255,0.2), rgba(0,255,255,0.1))'
                    : 'rgba(0,255,255,0.05)',
                  border: `2px solid ${active === prof ? '#ff00ff' : '#00ffff40'}`,
                  clipPath: 'polygon(15px 0, 100% 0, calc(100% - 15px) 100%, 0 100%)',
                }}
              >
                {/* Animated scan line */}
                {active === prof && (
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{
                      background: 'linear-gradient(90deg, transparent, #ff00ff, transparent)',
                      animation: 'scan 2s linear infinite',
                    }}
                  />
                )}

                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <CyberwareIcon type={prof === 'engineer' ? 'chip' : prof === 'drummer' ? 'jack' : 'arm'} />
                    <span
                      className="text-sm tracking-wider font-mono"
                      style={{ color: active === prof ? '#ff00ff' : '#00ffff' }}
                    >
                      {prof.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-[10px] text-white/50 block font-mono">
                    {prof === 'engineer' ? 'EXP: 10+ YEARS' : prof === 'drummer' ? 'EXP: 15 YEARS' : 'EXP: 6 YEARS'}
                  </span>
                  {active === prof && (
                    <span className="text-[8px] text-green-400 block mt-1 font-mono">[ACTIVE]</span>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Content grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Tech Stack / Skills panel */}
            <CyberPanel
              title={active === 'engineer' ? 'Tech Stack' : 'Skills'}
              accentColor="#00ffff"
              holographic
            >
              {active === 'engineer' ? (
                <div className="max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                  {engineerTech.map((category) => (
                    <TechCategory key={category.name} category={category} />
                  ))}
                </div>
              ) : (
                otherSkills.map((category) => (
                  <div key={category.name} className="mb-4 last:mb-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span>{category.icon}</span>
                      <h3 className="text-xs text-pink-500 font-mono tracking-wider">{category.name.toUpperCase()}:</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {category.skills.map((skill) => (
                        <SkillChip key={skill.name} name={skill.name} level={skill.proficiency} />
                      ))}
                    </div>
                  </div>
                ))
              )}
            </CyberPanel>

            {/* Projects panel */}
            <CyberPanel title="Featured Work" accentColor="#ff00ff" holographic>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                {projects.slice(0, 5).map((project) => (
                  <div
                    key={project.id}
                    className="p-3 border border-white/10 hover:border-pink-500/50 transition-colors cursor-pointer group"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,0,255,0.05), transparent)',
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-cyan-400 group-hover:text-pink-400 transition-colors font-mono">
                        {project.name}
                      </span>
                      {project.featured && (
                        <span className="text-[8px] px-2 py-0.5 bg-yellow-400 text-black font-bold">
                          PREEM
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-white/50 mt-1">{project.tagline}</p>
                    {project.impact && (
                      <p className="text-[10px] text-pink-500 mt-1 italic">&gt; {project.impact}</p>
                    )}
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {project.techStack.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="text-[8px] px-1 py-0.5 bg-white/5 text-cyan-400 font-mono"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CyberPanel>
          </div>

          {/* About section */}
          <div className="mb-8">
            <CyberPanel title="About" accentColor="#ffff00" holographic>
              <p className="text-sm text-white/80 leading-relaxed mb-4 font-mono">{aboutData.bio}</p>
              <div className="flex flex-wrap gap-2">
                {aboutData.quickFacts.map((fact, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-2 py-1 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 font-mono"
                  >
                    [{fact}]
                  </span>
                ))}
              </div>
            </CyberPanel>
          </div>

          {/* Work Experience section */}
          {experience.length > 0 && (
            <div className="mb-8">
              <CyberPanel title="Work Experience" accentColor="#00ff66" holographic>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                  {experience.map((entry) => (
                    <ExperienceCard key={entry.id} entry={entry} />
                  ))}
                </div>
              </CyberPanel>
            </div>
          )}

          {/* Companies (Engineer) */}
          {active === 'engineer' && (
            <div className="mb-8">
              <CyberPanel title="Ventures" accentColor="#ff00ff" holographic>
                <div className="grid md:grid-cols-3 gap-4">
                  {COMPANIES.map((company) => (
                    <CompanyCard key={company.id} company={company} />
                  ))}
                </div>
              </CyberPanel>
            </div>
          )}

          {/* Bands (Drummer) */}
          {active === 'drummer' && (
            <div className="mb-8">
              <CyberPanel title="Bands" accentColor="#9966cc" holographic>
                <div className="grid md:grid-cols-3 gap-4">
                  {BANDS.map((band) => (
                    <BandCard key={band.id} band={band} />
                  ))}
                </div>
              </CyberPanel>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 py-8 text-center">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
          <span className="text-xs text-cyan-400/50 tracking-[0.3em] font-mono">NIGHT_CITY // 2077</span>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-pink-500 to-transparent" />
        </div>
        <p className="text-[10px] text-white/30 tracking-widest font-mono">
          [ SYS.ONLINE ] // [ NET.STABLE ] // [ ICE.BYPASSED ] // [ CHROME.PREEM ]
        </p>
      </footer>

      {/* Animations */}
      <style jsx global>{`
        @keyframes fall {
          0% { transform: translateY(-100vh); opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        @keyframes scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-fall {
          animation: fall linear infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 255, 255, 0.1);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #ff00ff, #00ffff);
          border-radius: 2px;
        }
      `}</style>
    </div>
  )
}
