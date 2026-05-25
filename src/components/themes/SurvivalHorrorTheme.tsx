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

// Survivor character (Alexander) with flashlight
function SurvivorSprite({
  direction = 'right',
  size = 60,
  className = ''
}: {
  direction?: 'left' | 'right'
  size?: number
  className?: string
}) {
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => setFrame(f => (f + 1) % 2), 150)
    return () => clearInterval(interval)
  }, [])

  const sprite = direction === 'right'
    ? (frame === 0 ? '/assets/sprites/run_right.png' : '/assets/sprites/run_right_1.png')
    : (frame === 0 ? '/assets/sprites/run_left.png' : '/assets/sprites/run_left_1.png')

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size * 1.2 }}>
      <Image
        src={sprite}
        alt="Survivor"
        fill
        className="object-contain"
        style={{ filter: 'contrast(1.1) brightness(0.85)' }}
      />
      {/* Flashlight beam */}
      <div
        className={`absolute top-1/3 ${direction === 'right' ? '-right-12' : '-left-12'} w-16 h-8`}
        style={{
          background: `linear-gradient(${direction === 'right' ? '90deg' : '270deg'}, rgba(255,240,180,0.6) 0%, transparent 100%)`,
          filter: 'blur(4px)',
          transform: `rotate(${direction === 'right' ? '-5deg' : '5deg'})`,
        }}
      />
    </div>
  )
}

// Zombie chasing the survivor
function ZombieChaser({
  direction = 'right',
  size = 70,
  className = ''
}: {
  direction?: 'left' | 'right'
  size?: number
  className?: string
}) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size * 1.3 }}>
      <svg viewBox="0 0 60 80" className="w-full h-full">
        {/* Zombie body - shambling pose */}
        <ellipse cx="30" cy="15" rx="12" ry="14" fill="#3d5c3a" /> {/* Head */}
        <ellipse cx="30" cy="14" rx="11" ry="13" fill="#4a6b47" /> {/* Face */}
        {/* Sunken eyes */}
        <ellipse cx="25" cy="12" rx="3" ry="4" fill="#1a1a1a" />
        <ellipse cx="35" cy="12" rx="3" ry="4" fill="#1a1a1a" />
        <circle cx="25" cy="12" r="1.5" fill="#8b0000" />
        <circle cx="35" cy="12" r="1.5" fill="#8b0000" />
        {/* Torn mouth */}
        <path d="M22,20 Q30,25 38,20" stroke="#2a0000" strokeWidth="2" fill="none" />
        {/* Body */}
        <path d="M20,28 L18,55 L25,55 L28,35 L32,35 L35,55 L42,55 L40,28 Z" fill="#4a4a4a" />
        {/* Reaching arms */}
        <path
          d={direction === 'right'
            ? "M18,32 Q5,35 2,45 Q0,50 5,52"
            : "M42,32 Q55,35 58,45 Q60,50 55,52"
          }
          stroke="#4a6b47" strokeWidth="6" fill="none" strokeLinecap="round"
          className="animate-zombie-reach"
        />
        <path
          d={direction === 'right'
            ? "M20,38 Q8,42 6,50"
            : "M40,38 Q52,42 54,50"
          }
          stroke="#3d5c3a" strokeWidth="5" fill="none" strokeLinecap="round"
          className="animate-zombie-reach-delayed"
        />
        {/* Legs shambling */}
        <path d="M22,55 L20,75" stroke="#3d4d3a" strokeWidth="6" strokeLinecap="round" />
        <path d="M38,55 L42,72" stroke="#3d4d3a" strokeWidth="6" strokeLinecap="round" />
        {/* Blood/wounds */}
        <circle cx="28" cy="40" r="3" fill="#5c1a1a" opacity="0.7" />
        <path d="M15,45 L12,52" stroke="#5c1a1a" strokeWidth="2" />
      </svg>
    </div>
  )
}

// Section that reveals with zombie chase animation
function ZombieChaseSection({
  children,
  direction = 'left',
  className = '',
}: {
  children: React.ReactNode
  direction?: 'left' | 'right'
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const hasEntered = useInViewTrigger(ref, { threshold: 0.15 })
  const [phase, setPhase] = useState<'hidden' | 'chasing' | 'revealed'>('hidden')

  useEffect(() => {
    if (hasEntered && phase === 'hidden') {
      setPhase('chasing')
      setTimeout(() => setPhase('revealed'), 1200)
    }
  }, [hasEntered, phase])

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {/* Chase animation layer */}
      {phase === 'chasing' && (
        <div
          className="absolute inset-0 z-50 pointer-events-none"
          style={{ overflow: 'hidden' }}
        >
          {/* Survivor running */}
          <div
            className={`absolute top-1/2 -translate-y-1/2`}
            style={{
              animation: direction === 'left'
                ? 'survivor-run-left 1.2s ease-out forwards'
                : 'survivor-run-right 1.2s ease-out forwards',
            }}
          >
            <SurvivorSprite direction={direction === 'left' ? 'right' : 'left'} size={50} />
          </div>
          {/* Zombie chasing */}
          <div
            className={`absolute top-1/2 -translate-y-1/2`}
            style={{
              animation: direction === 'left'
                ? 'zombie-chase-left 1.2s ease-out forwards'
                : 'zombie-chase-right 1.2s ease-out forwards',
            }}
          >
            <ZombieChaser direction={direction === 'left' ? 'right' : 'left'} size={55} />
          </div>
        </div>
      )}

      {/* Content */}
      <div
        style={{
          opacity: phase === 'revealed' ? 1 : 0,
          transform: phase === 'revealed' ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.5s ease-out',
        }}
      >
        {children}
      </div>
    </div>
  )
}

// Dark overlay for content readability
function ContentOverlay({
  children,
  className = '',
  opacity = 0.75
}: {
  children: React.ReactNode
  className?: string
  opacity?: number
}) {
  return (
    <div className={`relative ${className}`}>
      <div
        className="absolute inset-0 -z-10 rounded-lg"
        style={{
          background: `rgba(10, 5, 5, ${opacity})`,
          backdropFilter: 'blur(2px)',
        }}
      />
      {children}
    </div>
  )
}

// Blood splatter SVG component
function BloodSplatter({ position, size = 100, rotation = 0 }: { position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right', size?: number, rotation?: number }) {
  const positionClasses = {
    'top-left': 'top-0 left-0',
    'top-right': 'top-0 right-0',
    'bottom-left': 'bottom-0 left-0',
    'bottom-right': 'bottom-0 right-0',
  }

  return (
    <div
      className={`fixed ${positionClasses[position]} pointer-events-none z-[4] opacity-60`}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <svg width={size} height={size} viewBox="0 0 100 100">
        <defs>
          <linearGradient id={`bloodGrad-${position}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b0000" />
            <stop offset="50%" stopColor="#600000" />
            <stop offset="100%" stopColor="#400000" />
          </linearGradient>
        </defs>
        {/* Main splatter */}
        <path
          d="M20,5 Q25,20 15,35 Q5,50 20,60 Q10,75 25,85 L30,95 Q35,80 45,90 Q55,85 60,75 Q75,80 70,60 Q85,55 75,40 Q90,30 70,20 Q80,10 60,15 Q50,5 35,15 Z"
          fill={`url(#bloodGrad-${position})`}
        />
        {/* Drips */}
        <path d="M25,85 Q27,92 25,100" stroke="#600000" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M45,90 Q46,96 44,100" stroke="#700000" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M15,60 Q12,70 15,80" stroke="#500000" strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* Smaller splatters */}
        <circle cx="10" cy="30" r="5" fill="#700000" />
        <circle cx="85" cy="25" r="4" fill="#600000" />
        <ellipse cx="75" cy="70" rx="6" ry="4" fill="#550000" />
      </svg>
    </div>
  )
}

// Zombie silhouette component
function ZombieSilhouettes() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[2] overflow-hidden">
      {/* Left zombie */}
      <div className="absolute -left-10 bottom-0 opacity-[0.15] animate-zombie-sway">
        <svg width="150" height="300" viewBox="0 0 150 300">
          <path
            d="M75,20 Q90,25 85,45 Q95,50 90,70 L95,90 Q100,95 95,110 L100,140 Q95,160 100,180 L90,220 Q95,250 85,280 L80,300 M75,20 Q60,25 65,45 Q55,50 60,70 L55,90 Q50,95 55,110 L50,140 Q55,160 50,180 L60,220 Q55,250 65,280 L70,300 M75,45 L75,180"
            fill="none"
            stroke="#1a0a0a"
            strokeWidth="30"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Head */}
          <ellipse cx="75" cy="30" rx="25" ry="30" fill="#1a0a0a" />
          {/* Arms reaching */}
          <path d="M50,110 Q20,100 10,130 Q5,150 20,155" fill="none" stroke="#1a0a0a" strokeWidth="15" strokeLinecap="round" />
          <path d="M100,110 Q130,100 140,130 Q145,150 130,155" fill="none" stroke="#1a0a0a" strokeWidth="15" strokeLinecap="round" />
        </svg>
      </div>
      {/* Right zombie */}
      <div className="absolute -right-10 bottom-0 opacity-[0.12] animate-zombie-sway-delayed">
        <svg width="150" height="280" viewBox="0 0 150 280" style={{ transform: 'scaleX(-1)' }}>
          <path
            d="M75,20 Q90,25 85,45 Q95,50 90,70 L95,90 Q100,95 95,110 L100,140 Q95,160 100,180 L90,220 Q95,250 85,270 M75,20 Q60,25 65,45 Q55,50 60,70 L55,90 Q50,95 55,110 L50,140 Q55,160 50,180 L60,220 Q55,250 65,270"
            fill="none"
            stroke="#1a0a0a"
            strokeWidth="28"
            strokeLinecap="round"
          />
          <ellipse cx="75" cy="28" rx="23" ry="28" fill="#1a0a0a" />
          <path d="M50,110 Q20,120 15,150" fill="none" stroke="#1a0a0a" strokeWidth="14" strokeLinecap="round" />
        </svg>
      </div>
      {/* Background lurker */}
      <div className="absolute left-1/3 bottom-0 opacity-[0.08]">
        <svg width="100" height="200" viewBox="0 0 100 200">
          <ellipse cx="50" cy="20" rx="18" ry="22" fill="#0a0505" />
          <path d="M50,42 L50,150" stroke="#0a0505" strokeWidth="25" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  )
}

// Cracked glass overlay
function CrackedGlassOverlay() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[9] opacity-30">
      <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 1000">
        {/* Main crack from top right */}
        <path
          d="M950,50 L850,150 L900,200 L800,300 L850,350 L750,450 L800,500 L700,600 L750,650 L650,750"
          stroke="#ffffff"
          strokeWidth="0.5"
          fill="none"
          opacity="0.4"
        />
        {/* Branch cracks */}
        <path d="M850,150 L920,180 L880,220" stroke="#ffffff" strokeWidth="0.3" fill="none" opacity="0.3" />
        <path d="M800,300 L730,280 L760,350" stroke="#ffffff" strokeWidth="0.3" fill="none" opacity="0.3" />
        <path d="M750,450 L680,420 L720,380" stroke="#ffffff" strokeWidth="0.3" fill="none" opacity="0.3" />
        <path d="M700,600 L780,580 L740,630" stroke="#ffffff" strokeWidth="0.3" fill="none" opacity="0.3" />
        {/* Bottom left cracks */}
        <path
          d="M50,900 L150,850 L100,780 L200,720 L150,650 L250,580"
          stroke="#ffffff"
          strokeWidth="0.5"
          fill="none"
          opacity="0.35"
        />
        <path d="M150,850 L80,810 L130,770" stroke="#ffffff" strokeWidth="0.3" fill="none" opacity="0.25" />
        <path d="M200,720 L270,750 L230,690" stroke="#ffffff" strokeWidth="0.3" fill="none" opacity="0.25" />
        {/* Spider web crack center */}
        <circle cx="300" cy="200" r="2" fill="#ffffff" opacity="0.5" />
        <path d="M300,200 L280,150 M300,200 L350,180 M300,200 L320,250 M300,200 L250,220 M300,200 L290,270" stroke="#ffffff" strokeWidth="0.4" fill="none" opacity="0.35" />
      </svg>
    </div>
  )
}

// Creeping shadows at screen edges
function CreepingShadows() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[5]">
      {/* Left shadow tendrils */}
      <div className="absolute left-0 top-0 h-full w-32 animate-shadow-creep-left">
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 1000">
          <defs>
            <linearGradient id="shadowGradLeft" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#000000" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0,0 Q30,100 20,200 Q40,300 15,400 Q35,500 10,600 Q30,700 25,800 Q45,900 20,1000 L0,1000 Z"
            fill="url(#shadowGradLeft)"
          />
        </svg>
      </div>
      {/* Right shadow tendrils */}
      <div className="absolute right-0 top-0 h-full w-32 animate-shadow-creep-right">
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 1000">
          <defs>
            <linearGradient id="shadowGradRight" x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#000000" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M100,0 Q70,100 80,200 Q60,300 85,400 Q65,500 90,600 Q70,700 75,800 Q55,900 80,1000 L100,1000 Z"
            fill="url(#shadowGradRight)"
          />
        </svg>
      </div>
    </div>
  )
}

// Heartbeat pulse vignette
function HeartbeatPulse() {
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(true)
      setTimeout(() => setPulse(false), 200)
      setTimeout(() => {
        setPulse(true)
        setTimeout(() => setPulse(false), 200)
      }, 300)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[6] transition-opacity duration-200"
      style={{
        background: 'radial-gradient(circle at 50% 50%, transparent 30%, rgba(139, 0, 0, 0.3) 100%)',
        opacity: pulse ? 0.6 : 0.2,
      }}
    />
  )
}

// Ink ribbon decoration
function InkRibbon({ className = '' }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <svg width="40" height="24" viewBox="0 0 40 24">
        <defs>
          <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2a2a4a" />
            <stop offset="50%" stopColor="#1a1a3a" />
            <stop offset="100%" stopColor="#0a0a2a" />
          </linearGradient>
        </defs>
        {/* Ribbon body */}
        <rect x="5" y="4" width="30" height="16" rx="2" fill="url(#ribbonGrad)" />
        {/* Ribbon holes */}
        <circle cx="12" cy="12" r="3" fill="#050510" />
        <circle cx="28" cy="12" r="3" fill="#050510" />
        {/* Tape line */}
        <rect x="10" y="8" width="20" height="1" fill="#3a3a5a" opacity="0.5" />
        <rect x="10" y="15" width="20" height="1" fill="#3a3a5a" opacity="0.5" />
      </svg>
    </div>
  )
}

// Herb icon decoration
function HerbIcon({ color = 'green', className = '' }: { color?: 'green' | 'red' | 'blue', className?: string }) {
  const colors = {
    green: { leaf: '#2d5a27', highlight: '#4a8a42' },
    red: { leaf: '#8b2020', highlight: '#c44040' },
    blue: { leaf: '#1a4a7a', highlight: '#3070a0' },
  }

  return (
    <div className={`relative ${className}`}>
      <svg width="28" height="36" viewBox="0 0 28 36">
        {/* Pot */}
        <path d="M8,30 L8,26 Q8,24 10,24 L18,24 Q20,24 20,26 L20,30 Q20,34 14,34 Q8,34 8,30 Z" fill="#6b4423" />
        <rect x="6" y="22" width="16" height="3" rx="1" fill="#8b5a2b" />
        {/* Leaves */}
        <path d="M14,22 Q8,18 6,10 Q8,8 14,12 Q14,8 14,4 Q14,8 14,12 Q20,8 22,10 Q20,18 14,22 Z" fill={colors[color].leaf} />
        <path d="M14,20 Q10,16 9,11 Q11,10 14,13" fill={colors[color].highlight} opacity="0.6" />
        <path d="M14,20 Q18,16 19,11 Q17,10 14,13" fill={colors[color].highlight} opacity="0.4" />
        {/* Center vein */}
        <path d="M14,20 L14,6" stroke={colors[color].highlight} strokeWidth="0.5" opacity="0.5" />
      </svg>
    </div>
  )
}

// Typewriter text effect
function TypewriterText({ text, speed = 50 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState('')
  const [cursor, setCursor] = useState(true)

  useEffect(() => {
    setDisplayed('')
    let i = 0
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1))
        i++
      } else {
        clearInterval(interval)
      }
    }, speed)
    return () => clearInterval(interval)
  }, [text, speed])

  useEffect(() => {
    const cursorInterval = setInterval(() => setCursor(c => !c), 500)
    return () => clearInterval(cursorInterval)
  }, [])

  return (
    <span>
      {displayed}
      <span className={cursor ? 'opacity-100' : 'opacity-0'}>|</span>
    </span>
  )
}

// Flickering light effect
function FlickeringLight() {
  const [opacity, setOpacity] = useState(0.3)

  useEffect(() => {
    const flicker = () => {
      const rand = Math.random()
      if (rand > 0.95) {
        setOpacity(0.1)
        setTimeout(() => setOpacity(0.3), 50)
      } else if (rand > 0.9) {
        setOpacity(0.4)
        setTimeout(() => setOpacity(0.3), 100)
      }
    }
    const interval = setInterval(flicker, 100)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[3]"
      style={{
        background: `radial-gradient(circle at 50% 30%, rgba(255, 200, 100, ${opacity}), transparent 60%)`,
      }}
    />
  )
}

// Inventory slot component
function InventorySlot({
  icon,
  label,
  sublabel,
  isSelected,
  onClick,
  rarity = 'common',
}: {
  icon: string
  label: string
  sublabel: string
  isSelected: boolean
  onClick: () => void
  rarity?: 'common' | 'rare' | 'legendary'
}) {
  const { theme } = useTheme()
  const rarityColors = {
    common: theme.colors.border,
    rare: '#4488ff',
    legendary: '#ffaa00',
  }

  return (
    <button
      onClick={onClick}
      className="relative aspect-square transition-all duration-200 group"
      style={{
        background: `linear-gradient(135deg, ${theme.colors.surface}, ${theme.colors.background})`,
        border: `2px solid ${isSelected ? theme.colors.accent : rarityColors[rarity]}`,
        boxShadow: isSelected ? `0 0 20px ${theme.colors.accent}40, inset 0 0 30px rgba(0,0,0,0.5)` : 'inset 0 0 30px rgba(0,0,0,0.5)',
      }}
    >
      {/* Corner notches */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2" style={{ borderColor: rarityColors[rarity] }} />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2" style={{ borderColor: rarityColors[rarity] }} />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2" style={{ borderColor: rarityColors[rarity] }} />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2" style={{ borderColor: rarityColors[rarity] }} />

      {/* Content */}
      <div className="absolute inset-2 flex flex-col items-center justify-center">
        <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">{icon}</span>
        <span className="text-[10px] tracking-wider text-center" style={{ color: theme.colors.text }}>
          {label}
        </span>
        <span className="text-[8px] mt-1" style={{ color: theme.colors.textMuted }}>
          {sublabel}
        </span>
      </div>

      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
          <span style={{ color: theme.colors.accent }}>V</span>
        </div>
      )}
    </button>
  )
}

// Document/File component
function DocumentItem({ title, content, isOpen, onToggle }: {
  title: string
  content: string
  isOpen: boolean
  onToggle: () => void
}) {
  const { theme } = useTheme()

  return (
    <div
      className="transition-all cursor-pointer"
      style={{
        background: theme.colors.surface,
        border: `1px solid ${theme.colors.border}`,
      }}
      onClick={onToggle}
    >
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{ borderBottom: isOpen ? `1px solid ${theme.colors.border}` : 'none' }}
      >
        <span className="text-sm flex items-center gap-2" style={{ color: theme.colors.text }}>
          <span style={{ color: theme.colors.accent }}>[FILE]</span>
          {title}
        </span>
        <span style={{ color: theme.colors.textMuted }}>{isOpen ? 'v' : '>'}</span>
      </div>
      {isOpen && (
        <div className="px-4 py-3">
          <p className="text-xs leading-relaxed" style={{ color: theme.colors.textMuted }}>
            {content}
          </p>
        </div>
      )}
    </div>
  )
}

// Tech stack display for engineer mode
function TechCloud({ categories }: { categories: ReturnType<typeof getEngineerSkills> }) {
  const { theme } = useTheme()

  return (
    <div className="space-y-6">
      {categories.map((category) => (
        <div key={category.name}>
          <h3 className="text-xs tracking-wider mb-3 flex items-center gap-2" style={{ color: theme.colors.accent }}>
            <span className="text-sm">[{category.icon}]</span>
            {category.name.toUpperCase()}
          </h3>
          <div className="flex flex-wrap gap-2">
            {category.items.map((tech) => (
              <span
                key={tech}
                className="px-2 py-1 text-[10px] tracking-wider transition-all hover:scale-105 cursor-default"
                style={{
                  background: `${theme.colors.accent}10`,
                  border: `1px solid ${theme.colors.accent}30`,
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

// Skills list for drummer/fighter modes
function SkillsList({ categories }: { categories: ReturnType<typeof getSkillsByProfession> }) {
  const { theme } = useTheme()

  return (
    <div className="space-y-4">
      {categories.map((category) => (
        <div key={category.name}>
          <h3 className="text-xs tracking-wider mb-2" style={{ color: theme.colors.accent }}>
            [{category.icon}] {category.name.toUpperCase()}
          </h3>
          <div className="space-y-2">
            {category.skills.map((skill) => (
              <div key={skill.name} className="flex items-center gap-3">
                <span className="text-xs w-32" style={{ color: theme.colors.text }}>
                  {skill.name}
                </span>
                <div className="flex-1 h-2" style={{ background: theme.colors.background }}>
                  <div
                    className="h-full transition-all"
                    style={{
                      width: `${(skill.proficiency / 5) * 100}%`,
                      background: `linear-gradient(90deg, ${theme.colors.accent}, #8b0000)`,
                    }}
                  />
                </div>
                <span className="text-[10px] w-8" style={{ color: theme.colors.textMuted }}>
                  {skill.proficiency}/5
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// Company card for engineer mode
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
        <span className="text-xl">{company.icon}</span>
        <div>
          <h4 className="text-sm group-hover:brightness-125 transition-all" style={{ color: theme.colors.text }}>
            {company.name}
          </h4>
          <p className="text-[10px]" style={{ color: theme.colors.accent }}>{company.tagline}</p>
        </div>
      </div>
      <p className="text-xs" style={{ color: theme.colors.textMuted }}>{company.description}</p>
    </a>
  )
}

// Band card for drummer mode
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
      <h4 className="text-sm group-hover:brightness-125 transition-all" style={{ color: theme.colors.text }}>
        {band.name}
      </h4>
      <p className="text-[10px] mt-1" style={{ color: theme.colors.accent }}>{band.genre} | {band.role}</p>
      <p className="text-xs mt-2" style={{ color: theme.colors.textMuted }}>{band.description}</p>
      {!band.url && <p className="text-[10px] mt-2 italic" style={{ color: theme.colors.textMuted }}>-- COMING SOON --</p>}
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
          <h4 className="text-sm" style={{ color: theme.colors.text }}>{entry.title}</h4>
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
              <span style={{ color: theme.colors.accent }}>-</span>
              {highlight}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function SurvivalHorrorTheme() {
  const { theme } = useTheme()
  const { active, setActive, config } = useProfession()
  const [mounted, setMounted] = useState(false)
  const [openDocs, setOpenDocs] = useState<Set<string>>(new Set())

  const aboutData = ABOUT_DATA[active]
  const engineerTech = getEngineerSkills()
  const otherSkills = getSkillsByProfession(active)
  const projects = PROJECTS_DATA.filter(p => p.professions.includes(active) || p.featured)
  const experience = filterExperienceByProfession(EXPERIENCE_DATA, active)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const inventoryItems = [
    { id: 'engineer', icon: '>', label: 'ENGINEER', sublabel: 'JOURNAL', rarity: 'legendary' as const },
    { id: 'drummer', icon: '*', label: 'MUSICIAN', sublabel: 'SCORE', rarity: 'rare' as const },
    { id: 'fighter', icon: '+', label: 'FIGHTER', sublabel: 'MANUAL', rarity: 'rare' as const },
  ]

  const toggleDoc = (id: string) => {
    const newOpen = new Set(openDocs)
    if (newOpen.has(id)) {
      newOpen.delete(id)
    } else {
      newOpen.add(id)
    }
    setOpenDocs(newOpen)
  }

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: theme.colors.backgroundGradient,
        fontFamily: '"Courier New", monospace',
      }}
    >
      {/* Blood splatters on corners */}
      <BloodSplatter position="top-left" size={120} rotation={0} />
      <BloodSplatter position="top-right" size={100} rotation={90} />
      <BloodSplatter position="bottom-left" size={90} rotation={-45} />
      <BloodSplatter position="bottom-right" size={110} rotation={180} />

      {/* Zombie silhouettes in background */}
      <ZombieSilhouettes />

      {/* Cracked glass overlay */}
      <CrackedGlassOverlay />

      {/* Creeping shadows at edges */}
      <CreepingShadows />

      {/* Heartbeat pulse vignette */}
      <HeartbeatPulse />

      {/* Dark vignette */}
      <div
        className="fixed inset-0 pointer-events-none z-[7]"
        style={{
          background: 'radial-gradient(circle at 50% 50%, transparent 10%, rgba(0,0,0,0.85) 100%)',
        }}
      />

      {/* Film grain */}
      <div
        className="fixed inset-0 pointer-events-none z-[10] opacity-[0.04] animate-grain"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Flickering light */}
      <FlickeringLight />

      {/* Herb decorations */}
      <div className="fixed top-20 left-4 z-[11] opacity-60">
        <HerbIcon color="green" />
      </div>
      <div className="fixed top-32 left-8 z-[11] opacity-50">
        <HerbIcon color="red" />
      </div>
      <div className="fixed bottom-20 right-4 z-[11] opacity-50">
        <HerbIcon color="blue" />
      </div>
      <div className="fixed bottom-32 right-8 z-[11] opacity-40">
        <HerbIcon color="green" />
      </div>

      {/* Ink ribbon decorations */}
      <div className="fixed top-40 right-6 z-[11] opacity-50">
        <InkRibbon />
      </div>
      <div className="fixed bottom-40 left-6 z-[11] opacity-40">
        <InkRibbon />
      </div>

      {/* Header with professional summary */}
      <header className="relative z-30 p-6">
        <div className="max-w-6xl mx-auto flex justify-between items-start">
          <div>
            <h1
              className="text-2xl tracking-[0.3em]"
              style={{
                color: theme.colors.accent,
                textShadow: '2px 2px 0 #000, 0 0 20px rgba(139, 0, 0, 0.5)',
              }}
            >
              ALEXANDER PULIDO
            </h1>
            <p
              className="text-sm tracking-wider mt-2"
              style={{ color: theme.colors.text }}
            >
              {PROFESSIONAL_SUMMARY.headline}
            </p>
            <p
              className="text-xs tracking-wider mt-1 italic"
              style={{ color: theme.colors.accent }}
            >
              <TypewriterText text={PROFESSIONAL_SUMMARY.tagline} speed={80} />
            </p>
          </div>

          <div className="flex gap-3 items-center">
            <Link
              href="/cv"
              className="px-3 py-2 text-xs tracking-wider transition-all hover:brightness-125"
              style={{
                background: theme.colors.surface,
                border: `1px solid ${theme.colors.border}`,
                color: theme.colors.textMuted,
              }}
            >
              [FILE]
            </Link>
            <Link
              href="/personal-projects/game-engine"
              className="px-3 py-2 text-xs tracking-wider transition-all hover:brightness-125"
              style={{
                background: `${theme.colors.accent}20`,
                border: `1px solid ${theme.colors.accent}`,
                color: theme.colors.accent,
              }}
            >
              [NEBULITH]
            </Link>
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      {/* Current Roles Section */}
      <section className="relative z-20 py-4 px-6">
        <div className="max-w-6xl mx-auto">
          <div
            className="p-4"
            style={{
              background: `${theme.colors.surface}99`,
              border: `1px solid ${theme.colors.border}`,
            }}
          >
            <h2 className="text-[10px] tracking-[0.3em] mb-3" style={{ color: theme.colors.textMuted }}>
              {'>'} CURRENT_STATUS
            </h2>
            <div className="flex flex-wrap justify-center gap-6">
              {CURRENT_ROLES.map((role) => (
                <div key={role.id} className="text-center">
                  <p className="text-xs tracking-wider" style={{ color: theme.colors.accent }}>{role.title}</p>
                  <p className="text-sm" style={{ color: theme.colors.text }}>{role.company}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main inventory area */}
      <main className="relative z-20 px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Inventory grid */}
          <div
            className="p-6 mb-8"
            style={{
              background: `linear-gradient(180deg, ${theme.colors.surface}ee, ${theme.colors.background}cc)`,
              border: `2px solid ${theme.colors.border}`,
              boxShadow: 'inset 0 0 50px rgba(0,0,0,0.5)',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs tracking-[0.3em]" style={{ color: theme.colors.textMuted }}>
                {'>'} INVENTORY
              </h2>
              <span className="text-xs" style={{ color: theme.colors.textMuted }}>
                {inventoryItems.length}/8 SLOTS
              </span>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {inventoryItems.map((item) => (
                <InventorySlot
                  key={item.id}
                  icon={item.icon}
                  label={item.label}
                  sublabel={item.sublabel}
                  isSelected={active === item.id}
                  onClick={() => setActive(item.id as 'engineer' | 'drummer' | 'fighter')}
                  rarity={item.rarity}
                />
              ))}
              {/* Empty slots */}
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="aspect-square"
                  style={{
                    background: `linear-gradient(135deg, ${theme.colors.surface}80, ${theme.colors.background}80)`,
                    border: `1px dashed ${theme.colors.border}40`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* About Section */}
          <div
            className="p-6 mb-8"
            style={{
              background: `${theme.colors.surface}ee`,
              border: `2px solid ${theme.colors.border}`,
            }}
          >
            <h2 className="text-xs tracking-[0.3em] mb-4" style={{ color: theme.colors.textMuted }}>
              {'>'} ABOUT
            </h2>
            <p
              className="text-xs leading-relaxed mb-4"
              style={{ color: theme.colors.text }}
            >
              {aboutData.bio}
            </p>
            <div className="flex gap-2 flex-wrap">
              {aboutData.quickFacts.map((fact, i) => (
                <span
                  key={i}
                  className="text-[10px] px-2 py-1"
                  style={{
                    background: theme.colors.background,
                    border: `1px solid ${theme.colors.border}`,
                    color: theme.colors.textMuted,
                  }}
                >
                  - {fact}
                </span>
              ))}
            </div>
          </div>

          {/* Work Experience Section */}
          {experience.length > 0 && (
            <div
              className="p-6 mb-8"
              style={{
                background: `${theme.colors.surface}ee`,
                border: `2px solid ${theme.colors.border}`,
              }}
            >
              <h2 className="text-xs tracking-[0.3em] mb-4" style={{ color: theme.colors.textMuted }}>
                {'>'} WORK EXPERIENCE
              </h2>
              <div className="space-y-4">
                {experience.map((entry) => (
                  <ExperienceCard key={entry.id} entry={entry} />
                ))}
              </div>
            </div>
          )}

          {/* Tech Stack / Skills Section - with zombie chase reveal */}
          <ZombieChaseSection direction="left" className="mb-8">
            <div
              className="p-6"
              style={{
                background: `${theme.colors.surface}ee`,
                border: `2px solid ${theme.colors.border}`,
              }}
            >
              <h2 className="text-xs tracking-[0.3em] mb-4 flex items-center gap-2" style={{ color: theme.colors.textMuted }}>
                {'>'} {active === 'engineer' ? 'TECH STACK' : 'SKILLS'}
              <span className="text-[8px]" style={{ color: theme.colors.accent }}>
                {active === 'engineer' ? `[${engineerTech.flatMap(c => c.items).length} ITEMS]` : ''}
              </span>
            </h2>
            {active === 'engineer' ? (
              <TechCloud categories={engineerTech} />
            ) : (
              <SkillsList categories={otherSkills} />
            )}
            </div>
          </ZombieChaseSection>

          {/* Files/Documents section - with zombie chase reveal */}
          <ZombieChaseSection direction="right">
          <div
            className="p-6 mb-8"
            style={{
              background: `${theme.colors.surface}ee`,
              border: `2px solid ${theme.colors.border}`,
            }}
          >
            <h2 className="text-xs tracking-[0.3em] mb-4" style={{ color: theme.colors.textMuted }}>
              {'>'} PROJECTS
            </h2>
            <div className="space-y-2">
              {projects.slice(0, 4).map((project) => (
                <DocumentItem
                  key={project.id}
                  title={project.name}
                  content={project.description}
                  isOpen={openDocs.has(project.id)}
                  onToggle={() => toggleDoc(project.id)}
                />
              ))}
            </div>
          </div>
          </ZombieChaseSection>

          {/* Companies Section (Engineer mode) */}
          {active === 'engineer' && (
            <div
              className="p-6 mb-8"
              style={{
                background: `${theme.colors.surface}ee`,
                border: `2px solid ${theme.colors.border}`,
              }}
            >
              <h2 className="text-xs tracking-[0.3em] mb-4" style={{ color: theme.colors.textMuted }}>
                {'>'} COMPANIES
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                {COMPANIES.map((company) => (
                  <CompanyCard key={company.id} company={company} />
                ))}
              </div>
            </div>
          )}

          {/* Bands Section (Drummer mode) */}
          {active === 'drummer' && (
            <div
              className="p-6 mb-8"
              style={{
                background: `${theme.colors.surface}ee`,
                border: `2px solid ${theme.colors.border}`,
              }}
            >
              <h2 className="text-xs tracking-[0.3em] mb-4" style={{ color: theme.colors.textMuted }}>
                {'>'} BANDS
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                {BANDS.map((band) => (
                  <BandCard key={band.id} band={band} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 py-8 text-center">
        <div className="flex items-center justify-center gap-4">
          <InkRibbon />
          <p className="text-[10px] tracking-widest" style={{ color: theme.colors.textMuted }}>
            [ TYPEWRITER SAVE POINT ] | [ 2026 ] | [ SPENCER MANSION ARCHIVES ]
          </p>
          <InkRibbon />
        </div>
      </footer>

      {/* Animations */}
      <style jsx global>{`
        @keyframes grain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-1%, -1%); }
          20% { transform: translate(1%, 1%); }
          30% { transform: translate(-1%, 1%); }
          40% { transform: translate(1%, -1%); }
          50% { transform: translate(-1%, 0%); }
          60% { transform: translate(1%, 0%); }
          70% { transform: translate(0%, -1%); }
          80% { transform: translate(0%, 1%); }
          90% { transform: translate(-1%, -1%); }
        }
        .animate-grain {
          animation: grain 0.5s steps(10) infinite;
        }
        @keyframes zombie-sway {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          25% { transform: translateX(5px) rotate(1deg); }
          50% { transform: translateX(-3px) rotate(-1deg); }
          75% { transform: translateX(4px) rotate(0.5deg); }
        }
        .animate-zombie-sway {
          animation: zombie-sway 8s ease-in-out infinite;
        }
        .animate-zombie-sway-delayed {
          animation: zombie-sway 10s ease-in-out infinite;
          animation-delay: -3s;
        }
        @keyframes shadow-creep-left {
          0%, 100% { transform: translateX(0); opacity: 1; }
          50% { transform: translateX(10px); opacity: 0.8; }
        }
        @keyframes shadow-creep-right {
          0%, 100% { transform: translateX(0); opacity: 1; }
          50% { transform: translateX(-10px); opacity: 0.8; }
        }
        .animate-shadow-creep-left {
          animation: shadow-creep-left 15s ease-in-out infinite;
        }
        .animate-shadow-creep-right {
          animation: shadow-creep-right 15s ease-in-out infinite;
          animation-delay: -7s;
        }
        /* Zombie chase animations */
        @keyframes survivor-run-left {
          0% { left: -80px; }
          100% { left: calc(100% + 80px); }
        }
        @keyframes survivor-run-right {
          0% { right: -80px; }
          100% { right: calc(100% + 80px); }
        }
        @keyframes zombie-chase-left {
          0% { left: -150px; }
          100% { left: calc(100% + 30px); }
        }
        @keyframes zombie-chase-right {
          0% { right: -150px; }
          100% { right: calc(100% + 30px); }
        }
        @keyframes zombie-reach {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(8deg); }
        }
        .animate-zombie-reach {
          animation: zombie-reach 0.4s ease-in-out infinite;
        }
        .animate-zombie-reach-delayed {
          animation: zombie-reach 0.5s ease-in-out infinite;
          animation-delay: 0.2s;
        }
      `}</style>
    </div>
  )
}
