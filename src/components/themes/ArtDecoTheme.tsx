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

// Deep sea diver Alexander - Bioshock style
function DiverCharacter({
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
    const interval = setInterval(() => setFrame(f => (f + 1) % 2), 200)
    return () => clearInterval(interval)
  }, [])

  const sprite = direction === 'right'
    ? (frame === 0 ? '/assets/sprites/run_right.png' : '/assets/sprites/run_right_1.png')
    : (frame === 0 ? '/assets/sprites/run_left.png' : '/assets/sprites/run_left_1.png')

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size * 1.2 }}>
      <Image
        src={sprite}
        alt="Rapture Citizen"
        fill
        className="object-contain"
        style={{ filter: 'brightness(0.85) contrast(1.2) sepia(0.3) hue-rotate(-20deg)' }}
      />
      {/* Diving suit helmet glow */}
      <div
        className="absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(212,175,55,0.4) 0%, transparent 70%)',
          filter: 'blur(3px)',
        }}
      />
      {/* Underwater bubbles from suit */}
      <div
        className="absolute -top-4 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full animate-bubble-small"
        style={{
          background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6), rgba(200,220,240,0.2))',
        }}
      />
    </div>
  )
}

// Rapture profession ornaments - Art Deco style
function RaptureOrnaments({ profession }: { profession: 'engineer' | 'drummer' | 'fighter' }) {
  const ornamentsByProfession = {
    engineer: [
      { icon: '⚙️', x: 4, y: 20, size: 28 },
      { icon: '💡', x: 92, y: 25, size: 26 },
      { icon: '🔬', x: 5, y: 68, size: 24 },
      { icon: '💻', x: 90, y: 72, size: 26 },
    ],
    drummer: [
      { icon: '🎺', x: 4, y: 22, size: 28 },
      { icon: '🎹', x: 91, y: 26, size: 28 },
      { icon: '🎵', x: 5, y: 70, size: 24 },
      { icon: '🎷', x: 90, y: 74, size: 26 },
    ],
    fighter: [
      { icon: '🔧', x: 5, y: 24, size: 26 },
      { icon: '⚡', x: 90, y: 22, size: 28 },
      { icon: '💪', x: 4, y: 70, size: 26 },
      { icon: '🎯', x: 91, y: 72, size: 24 },
    ],
  }

  const items = ornamentsByProfession[profession]

  return (
    <div className="fixed inset-0 pointer-events-none z-[4] overflow-hidden">
      {items.map((item, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            fontSize: item.size,
            opacity: 0.25,
            filter: 'drop-shadow(0 0 10px #d4af37) sepia(0.5)',
            animation: `raptureFloat ${16 + i * 3}s ease-in-out infinite`,
            animationDelay: `${-i * 2.5}s`,
          }}
        >
          {item.icon}
        </div>
      ))}
    </div>
  )
}

// Bathysphere reveal section
function BathysphereRevealSection({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const hasEntered = useInViewTrigger(ref, { threshold: 0.15 })
  const [phase, setPhase] = useState<'hidden' | 'descending' | 'revealed'>('hidden')

  useEffect(() => {
    if (hasEntered && phase === 'hidden') {
      setPhase('descending')
      setTimeout(() => setPhase('revealed'), 800)
    }
  }, [hasEntered, phase])

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {/* Bathysphere descent animation */}
      {phase === 'descending' && (
        <div className="absolute inset-0 z-50 pointer-events-none">
          {/* Diver swimming across */}
          <div
            className="absolute top-1/2 -translate-y-1/2"
            style={{ animation: 'bathyDescent 0.8s ease-out forwards' }}
          >
            <DiverCharacter size={40} direction="right" />
          </div>
          {/* Bubble trail */}
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${10 + i * 8}%`,
                top: `${45 + (i % 3) * 5}%`,
                width: 4 + Math.random() * 4,
                height: 4 + Math.random() * 4,
                background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.5), rgba(200,220,240,0.2))',
                animation: `bubbleTrail 0.6s ease-out forwards`,
                animationDelay: `${i * 0.08}s`,
              }}
            />
          ))}
          {/* Gold flash */}
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(212,175,55,0.15) 0%, transparent 50%)',
              animation: 'goldFlash 0.4s ease-out',
            }}
          />
        </div>
      )}

      <div
        style={{
          opacity: phase === 'revealed' ? 1 : 0,
          transform: phase === 'revealed' ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.6s ease-out',
        }}
      >
        {children}
      </div>
    </div>
  )
}

// Art deco geometric pattern background
function DecoPattern() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[1] opacity-[0.05]">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="deco-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <path
              d="M50 0 L100 50 L50 100 L0 50 Z"
              fill="none"
              stroke="#d4af37"
              strokeWidth="0.5"
            />
            <circle cx="50" cy="50" r="20" fill="none" stroke="#d4af37" strokeWidth="0.5" />
            <path d="M50 0 L50 30 M50 70 L50 100 M0 50 L30 50 M70 50 L100 50" stroke="#d4af37" strokeWidth="0.3" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#deco-pattern)" />
      </svg>
    </div>
  )
}

// Underwater light rays effect
function UnderwaterRays() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[2] overflow-hidden">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="absolute top-0 animate-light-ray"
          style={{
            left: `${10 + i * 20}%`,
            width: '150px',
            height: '100%',
            background: 'linear-gradient(180deg, rgba(212, 175, 55, 0.1), transparent 70%)',
            transform: `rotate(${-15 + i * 5}deg)`,
            transformOrigin: 'top center',
            animationDelay: `${i * 0.5}s`,
          }}
        />
      ))}
    </div>
  )
}

// Rising underwater bubbles
function UnderwaterBubbles() {
  const [bubbles, setBubbles] = useState<Array<{
    id: number
    x: number
    size: number
    duration: number
    delay: number
    wobble: number
  }>>([])

  useEffect(() => {
    const newBubbles = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 8 + 3,
      duration: Math.random() * 8 + 10,
      delay: Math.random() * 15,
      wobble: Math.random() * 30 + 10,
    }))
    setBubbles(newBubbles)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-[3] overflow-hidden">
      {bubbles.map((b) => (
        <div
          key={b.id}
          className="absolute rounded-full animate-bubble-rise"
          style={{
            left: `${b.x}%`,
            bottom: '-20px',
            width: b.size,
            height: b.size,
            background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4), rgba(212,175,55,0.1))',
            border: '1px solid rgba(255,255,255,0.2)',
            animationDuration: `${b.duration}s`,
            animationDelay: `${b.delay}s`,
            ['--wobble' as string]: `${b.wobble}px`,
          }}
        />
      ))}
    </div>
  )
}

// Water caustics effect
function WaterCaustics() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[4] overflow-hidden opacity-20">
      <div className="absolute inset-0 animate-caustics-1" style={{
        background: `
          radial-gradient(ellipse at 20% 30%, rgba(212,175,55,0.3) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 70%, rgba(65,200,232,0.2) 0%, transparent 40%),
          radial-gradient(ellipse at 50% 50%, rgba(212,175,55,0.15) 0%, transparent 60%)
        `,
      }} />
      <div className="absolute inset-0 animate-caustics-2" style={{
        background: `
          radial-gradient(ellipse at 70% 20%, rgba(65,200,232,0.25) 0%, transparent 45%),
          radial-gradient(ellipse at 30% 80%, rgba(212,175,55,0.2) 0%, transparent 50%)
        `,
      }} />
    </div>
  )
}

// Big Daddy silhouette
function BigDaddySilhouette() {
  return (
    <div className="fixed bottom-0 right-0 pointer-events-none z-[6] opacity-10">
      <svg width="300" height="400" viewBox="0 0 300 400" className="transform translate-x-1/4 translate-y-1/4">
        <defs>
          <linearGradient id="bigdaddy-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#d4af37" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#d4af37" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        {/* Diving helmet */}
        <ellipse cx="150" cy="80" rx="60" ry="70" fill="url(#bigdaddy-gradient)" />
        {/* Helmet porthole */}
        <circle cx="150" cy="75" r="30" fill="none" stroke="#d4af37" strokeWidth="3" opacity="0.5" />
        <circle cx="150" cy="75" r="25" fill="#0a1520" opacity="0.5" />
        {/* Helmet rivets */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <circle
            key={angle}
            cx={150 + Math.cos(angle * Math.PI / 180) * 50}
            cy={80 + Math.sin(angle * Math.PI / 180) * 55}
            r="4"
            fill="#d4af37"
            opacity="0.4"
          />
        ))}
        {/* Body/suit */}
        <path
          d="M90 140 Q60 200 70 300 L100 380 L200 380 L230 300 Q240 200 210 140 Q180 120 150 120 Q120 120 90 140"
          fill="url(#bigdaddy-gradient)"
        />
        {/* Drill arm */}
        <path
          d="M230 180 L280 220 L300 210 L290 200 L280 205 L240 170"
          fill="#d4af37"
          opacity="0.3"
        />
        {/* Tank on back */}
        <ellipse cx="150" cy="200" rx="20" ry="50" fill="#d4af37" opacity="0.2" />
      </svg>
    </div>
  )
}

// Little Sister silhouette
function LittleSisterSilhouette() {
  return (
    <div className="fixed bottom-0 left-0 pointer-events-none z-[6] opacity-10 transform -translate-x-1/4">
      <svg width="150" height="250" viewBox="0 0 150 250">
        <defs>
          <linearGradient id="sister-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#d4af37" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#d4af37" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        {/* Head */}
        <circle cx="75" cy="40" r="25" fill="url(#sister-gradient)" />
        {/* Hair buns */}
        <circle cx="55" cy="25" r="12" fill="#d4af37" opacity="0.3" />
        <circle cx="95" cy="25" r="12" fill="#d4af37" opacity="0.3" />
        {/* Eyes - glowing */}
        <circle cx="68" cy="38" r="5" fill="#f0c850" opacity="0.6" className="animate-pulse" />
        <circle cx="82" cy="38" r="5" fill="#f0c850" opacity="0.6" className="animate-pulse" />
        {/* Dress */}
        <path
          d="M55 60 Q45 100 50 150 L30 230 L50 235 L65 170 L75 230 L85 170 L100 235 L120 230 L100 150 Q105 100 95 60 Z"
          fill="url(#sister-gradient)"
        />
        {/* ADAM syringe */}
        <line x1="105" y1="100" x2="140" y2="60" stroke="#d4af37" strokeWidth="4" opacity="0.4" />
        <circle cx="140" cy="55" r="8" fill="#ff6b6b" opacity="0.4" />
        <line x1="140" y1="47" x2="140" y2="35" stroke="#d4af37" strokeWidth="2" opacity="0.4" />
      </svg>
    </div>
  )
}

// Splicer masks floating
function SplicerMasks() {
  const masks = [
    { x: 5, y: 15, rotation: -15, scale: 0.6 },
    { x: 92, y: 25, rotation: 20, scale: 0.5 },
    { x: 8, y: 70, rotation: -10, scale: 0.4 },
    { x: 88, y: 80, rotation: 15, scale: 0.5 },
  ]

  return (
    <div className="fixed inset-0 pointer-events-none z-[5]">
      {masks.map((mask, i) => (
        <div
          key={i}
          className="absolute animate-float-slow"
          style={{
            left: `${mask.x}%`,
            top: `${mask.y}%`,
            transform: `rotate(${mask.rotation}deg) scale(${mask.scale})`,
            animationDelay: `${i * 2}s`,
          }}
        >
          <svg width="80" height="100" viewBox="0 0 80 100" opacity="0.08">
            {/* Masquerade mask shape */}
            <path
              d="M40 20 Q10 30 5 50 Q10 70 40 80 Q70 70 75 50 Q70 30 40 20"
              fill="none"
              stroke="#d4af37"
              strokeWidth="2"
            />
            {/* Eye holes */}
            <ellipse cx="25" cy="45" rx="10" ry="8" fill="none" stroke="#d4af37" strokeWidth="1.5" />
            <ellipse cx="55" cy="45" rx="10" ry="8" fill="none" stroke="#d4af37" strokeWidth="1.5" />
            {/* Decorative elements */}
            <path d="M40 30 L40 15 L35 5 M40 15 L45 5" stroke="#d4af37" strokeWidth="1" fill="none" />
            <path d="M5 50 L-5 48 M75 50 L85 48" stroke="#d4af37" strokeWidth="1" />
          </svg>
        </div>
      ))}
    </div>
  )
}

// Flickering neon sign
function NeonSign({ text, className = '' }: { text: string; className?: string }) {
  const [flicker, setFlicker] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.85) {
        setFlicker(true)
        setTimeout(() => setFlicker(false), 100)
        if (Math.random() > 0.7) {
          setTimeout(() => {
            setFlicker(true)
            setTimeout(() => setFlicker(false), 50)
          }, 150)
        }
      }
    }, 500)
    return () => clearInterval(interval)
  }, [])

  return (
    <span
      className={`relative ${className}`}
      style={{
        color: flicker ? '#8b732080' : '#d4af37',
        textShadow: flicker
          ? 'none'
          : '0 0 10px #d4af37, 0 0 20px #d4af37, 0 0 40px #d4af3780, 0 0 60px #d4af3740',
        transition: 'all 0.05s',
      }}
    >
      {text}
    </span>
  )
}

// Decorative gold frame
function GoldFrame({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <div className="relative">
      {/* Corner ornaments */}
      <svg className="absolute -top-4 -left-4 w-12 h-12" viewBox="0 0 48 48">
        <path d="M4,44 L4,4 L44,4" fill="none" stroke="#d4af37" strokeWidth="2" />
        <path d="M8,36 L8,8 L36,8" fill="none" stroke="#d4af37" strokeWidth="1" />
        <circle cx="4" cy="4" r="3" fill="#d4af37" />
        <path d="M12,4 L4,12" stroke="#d4af37" strokeWidth="1" />
      </svg>
      <svg className="absolute -top-4 -right-4 w-12 h-12 scale-x-[-1]" viewBox="0 0 48 48">
        <path d="M4,44 L4,4 L44,4" fill="none" stroke="#d4af37" strokeWidth="2" />
        <path d="M8,36 L8,8 L36,8" fill="none" stroke="#d4af37" strokeWidth="1" />
        <circle cx="4" cy="4" r="3" fill="#d4af37" />
        <path d="M12,4 L4,12" stroke="#d4af37" strokeWidth="1" />
      </svg>
      <svg className="absolute -bottom-4 -left-4 w-12 h-12 scale-y-[-1]" viewBox="0 0 48 48">
        <path d="M4,44 L4,4 L44,4" fill="none" stroke="#d4af37" strokeWidth="2" />
        <path d="M8,36 L8,8 L36,8" fill="none" stroke="#d4af37" strokeWidth="1" />
        <circle cx="4" cy="4" r="3" fill="#d4af37" />
        <path d="M12,4 L4,12" stroke="#d4af37" strokeWidth="1" />
      </svg>
      <svg className="absolute -bottom-4 -right-4 w-12 h-12 scale-[-1]" viewBox="0 0 48 48">
        <path d="M4,44 L4,4 L44,4" fill="none" stroke="#d4af37" strokeWidth="2" />
        <path d="M8,36 L8,8 L36,8" fill="none" stroke="#d4af37" strokeWidth="1" />
        <circle cx="4" cy="4" r="3" fill="#d4af37" />
        <path d="M12,4 L4,12" stroke="#d4af37" strokeWidth="1" />
      </svg>

      {/* Main frame */}
      <div
        className="p-6"
        style={{
          background: 'linear-gradient(180deg, rgba(21, 32, 48, 0.95), rgba(10, 21, 32, 0.98))',
          border: '2px solid #d4af37',
        }}
      >
        {title && (
          <div className="text-center mb-4 pb-3 border-b" style={{ borderColor: '#d4af3740' }}>
            <NeonSign
              text={title}
              className="text-sm tracking-[0.3em]"
            />
          </div>
        )}
        {children}
      </div>
    </div>
  )
}

// Plasmid-style profession button
function PlasmidButton({
  profession,
  isActive,
  onClick,
}: {
  profession: 'engineer' | 'drummer' | 'fighter'
  isActive: boolean
  onClick: () => void
}) {
  const icons = { engineer: '++', drummer: '~~', fighter: '><' }
  const names = { engineer: 'ELECTRO BOLT', drummer: 'SONIC BOOM', fighter: 'SPORTBOOST' }
  const descs = { engineer: 'System Engineering', drummer: 'Musical Mastery', fighter: 'Combat Arts' }

  return (
    <button
      onClick={onClick}
      className={`relative group transition-all duration-300 ${
        isActive ? 'scale-105' : 'opacity-70 hover:opacity-100'
      }`}
    >
      <div
        className="p-6 text-center"
        style={{
          background: isActive
            ? 'linear-gradient(180deg, #d4af37, #8b7320)'
            : 'linear-gradient(180deg, #152535, #0a1520)',
          border: `3px solid ${isActive ? '#f0c850' : '#d4af3760'}`,
          boxShadow: isActive ? '0 0 30px rgba(212, 175, 55, 0.5)' : 'none',
        }}
      >
        {/* Icon */}
        <div
          className="text-4xl mb-3 font-mono"
          style={{
            color: isActive ? '#0a1520' : '#d4af37',
            filter: isActive ? 'drop-shadow(0 0 10px #0a1520)' : 'drop-shadow(0 0 10px #d4af37)',
          }}
        >
          {icons[profession]}
        </div>

        {/* Name */}
        <div
          className="text-sm font-bold tracking-wider"
          style={{
            color: isActive ? '#0a1520' : '#d4af37',
            fontFamily: '"Playfair Display", serif',
          }}
        >
          {names[profession]}
        </div>

        {/* Description */}
        <div
          className="text-[10px] mt-1"
          style={{ color: isActive ? '#0a1520' : '#a09080' }}
        >
          {descs[profession]}
        </div>
      </div>

      {/* Selection indicator */}
      {isActive && (
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
          <div
            className="w-0 h-0 border-l-8 border-r-8 border-t-8"
            style={{
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              borderTopColor: '#d4af37',
            }}
          />
        </div>
      )}
    </button>
  )
}

// Skill gauge with art deco styling
function DecoGauge({ name, value, max = 5 }: { name: string; value: number; max?: number }) {
  return (
    <div className="flex items-center gap-4 py-2">
      <span className="text-xs w-28 truncate" style={{ color: '#e8e0d0' }}>
        {name}
      </span>
      <div className="flex-1 flex items-center gap-1">
        {Array.from({ length: max }).map((_, i) => (
          <div
            key={i}
            className="flex-1 h-3 relative"
            style={{
              background: i < value ? '#d4af37' : '#2a3a50',
              clipPath: 'polygon(20% 0, 100% 0, 80% 100%, 0 100%)',
            }}
          >
            {i < value && (
              <div
                className="absolute inset-0 animate-pulse"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// Experience card with art deco styling
function ExperienceCard({ entry }: { entry: typeof EXPERIENCE_DATA[0] }) {
  const endDisplay = entry.endDate ? new Date(entry.endDate).getFullYear() : 'Present'
  const startDisplay = new Date(entry.startDate).getFullYear()

  return (
    <div
      className="relative p-4 transition-all group"
      style={{
        background: 'linear-gradient(180deg, rgba(21, 32, 48, 0.9), rgba(10, 21, 32, 0.95))',
        border: '1px solid #d4af3760',
      }}
    >
      {/* Top decorative line */}
      <div
        className="absolute top-0 left-4 right-4 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, #d4af37, transparent)' }}
      />

      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="text-sm" style={{ color: '#d4af37', fontFamily: '"Playfair Display", serif' }}>
            {entry.title}
          </h4>
          <p className="text-xs mt-1" style={{ color: '#e8e0d0' }}>{entry.organization}</p>
        </div>
        <span
          className="text-[10px] px-2 py-0.5"
          style={{
            background: '#d4af3720',
            border: '1px solid #d4af3740',
            color: '#d4af37',
          }}
        >
          {startDisplay} - {endDisplay}
        </span>
      </div>

      <p className="text-xs mb-3" style={{ color: '#a09080' }}>{entry.description}</p>

      {entry.highlights && entry.highlights.length > 0 && (
        <ul className="space-y-1 mb-3">
          {entry.highlights.map((highlight, i) => (
            <li key={i} className="text-xs flex items-start gap-2" style={{ color: '#e8e0d0' }}>
              <span style={{ color: '#d4af37' }}>{'>>'}</span>
              {highlight}
            </li>
          ))}
        </ul>
      )}

      <div className="flex gap-2 flex-wrap">
        {entry.skills.slice(0, 4).map((skill) => (
          <span
            key={skill}
            className="text-[8px] px-2 py-0.5"
            style={{
              background: '#d4af3715',
              border: '1px solid #d4af3730',
              color: '#a09080',
            }}
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 30px rgba(212, 175, 55, 0.1)',
        }}
      />
    </div>
  )
}

// Tech cloud for engineer (comprehensive tech stack)
function TechCloud({ categories }: { categories: ReturnType<typeof getEngineerSkills> }) {
  return (
    <div className="space-y-4">
      {categories.map((category) => (
        <div key={category.name}>
          <h3
            className="text-xs tracking-widest mb-2 flex items-center gap-2"
            style={{ color: '#d4af37' }}
          >
            <span>{category.icon}</span>
            {category.name.toUpperCase()}
          </h3>
          <div className="flex flex-wrap gap-2">
            {category.items.map((tech) => (
              <span
                key={tech}
                className="text-[10px] px-2 py-1 transition-all hover:scale-105"
                style={{
                  background: '#d4af3715',
                  border: '1px solid #d4af3740',
                  color: '#e8e0d0',
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

// Project display as vintage poster
function VaultPoster({ project, index }: { project: typeof PROJECTS_DATA[0]; index: number }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 200 + index * 100)
    return () => clearTimeout(timeout)
  }, [index])

  return (
    <div
      className={`relative p-4 transition-all duration-500 group cursor-pointer ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{
        background: 'linear-gradient(180deg, rgba(21, 32, 48, 0.9), rgba(10, 21, 32, 0.95))',
        border: '1px solid #d4af3760',
      }}
    >
      {/* Top decorative line */}
      <div
        className="absolute top-0 left-4 right-4 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, #d4af37, transparent)' }}
      />

      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm" style={{ color: '#d4af37', fontFamily: '"Playfair Display", serif' }}>
          {project.name}
        </h3>
        {project.featured && (
          <span className="text-[8px] px-2 py-0.5" style={{ background: '#d4af37', color: '#0a1520' }}>
            * FEATURED
          </span>
        )}
      </div>
      <p className="text-[10px] mb-3" style={{ color: '#a09080' }}>
        {project.tagline}
      </p>
      <div className="flex gap-2 flex-wrap">
        {project.techStack.slice(0, 3).map((tech) => (
          <span
            key={tech}
            className="text-[8px] px-2 py-0.5"
            style={{
              background: '#d4af3720',
              border: '1px solid #d4af3740',
              color: '#d4af37',
            }}
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 30px rgba(212, 175, 55, 0.2)',
        }}
      />
    </div>
  )
}

// Company card with art deco styling
function CompanyCard({ company }: { company: typeof COMPANIES[0] }) {
  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 transition-all hover:scale-[1.02] group"
      style={{
        background: 'linear-gradient(180deg, rgba(21, 32, 48, 0.9), rgba(10, 21, 32, 0.95))',
        border: '1px solid #d4af3760',
      }}
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{company.icon}</span>
        <div>
          <h4 className="text-sm group-hover:text-amber-300 transition-colors" style={{ color: '#d4af37' }}>
            {company.name}
          </h4>
          <p className="text-[10px]" style={{ color: '#a09080' }}>{company.tagline}</p>
        </div>
      </div>
      <p className="text-xs" style={{ color: '#e8e0d0' }}>{company.description}</p>
    </a>
  )
}

// Band card with art deco styling
function BandCard({ band }: { band: typeof BANDS[0] }) {
  const content = (
    <div
      className="p-4 transition-all hover:scale-[1.02] group"
      style={{
        background: 'linear-gradient(180deg, rgba(21, 32, 48, 0.9), rgba(10, 21, 32, 0.95))',
        border: '1px solid #d4af3760',
      }}
    >
      <h4 className="text-sm group-hover:text-amber-300 transition-colors" style={{ color: '#d4af37' }}>
        {band.name}
      </h4>
      <p className="text-[10px] mt-1" style={{ color: '#a09080' }}>{band.genre} - {band.role}</p>
      <p className="text-xs mt-2" style={{ color: '#e8e0d0' }}>{band.description}</p>
      {!band.url && <p className="text-[10px] mt-2 italic" style={{ color: '#a09080' }}>Website coming soon</p>}
    </div>
  )

  if (band.url) {
    return <a href={band.url} target="_blank" rel="noopener noreferrer" className="block">{content}</a>
  }
  return content
}

export default function ArtDecoTheme() {
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
        background: 'linear-gradient(180deg, #152535, #0a1520, #05101a)',
        fontFamily: '"Playfair Display", "Georgia", serif',
      }}
    >
      {/* Background effects */}
      <DecoPattern />
      <UnderwaterRays />
      <UnderwaterBubbles />
      <WaterCaustics />
      <SplicerMasks />
      <BigDaddySilhouette />
      <LittleSisterSilhouette />

      {/* Profession ornaments */}
      <RaptureOrnaments profession={active} />

      {/* Vignette */}
      <div
        className="fixed inset-0 pointer-events-none z-[7]"
        style={{
          background: 'radial-gradient(circle at 50% 30%, transparent 30%, rgba(5, 16, 26, 0.8) 100%)',
        }}
      />

      {/* Header */}
      <header className="relative z-30 p-8 text-center">
        {/* Art deco sunburst */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 pointer-events-none">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute bottom-0 left-1/2 w-0.5 h-32"
              style={{
                background: 'linear-gradient(to top, #d4af37, transparent)',
                transform: `translateX(-50%) rotate(${-55 + i * 10}deg)`,
                transformOrigin: 'bottom center',
                opacity: 0.3,
              }}
            />
          ))}
        </div>

        <h1
          className="text-4xl tracking-[0.2em] relative z-10"
          style={{
            color: '#d4af37',
            textShadow: '0 0 40px rgba(212, 175, 55, 0.5)',
          }}
        >
          <NeonSign text="ALEXANDER PULIDO" />
        </h1>
        <p className="text-sm tracking-wider mt-2" style={{ color: '#e8e0d0' }}>
          {PROFESSIONAL_SUMMARY.headline}
        </p>
        <p className="text-xs tracking-wider mt-1 italic" style={{ color: '#d4af37' }}>
          {PROFESSIONAL_SUMMARY.tagline}
        </p>

        <div className="flex justify-center gap-4 mt-6">
          <Link
            href="/cv"
            className="px-6 py-2 text-sm tracking-wider transition-all hover:scale-105"
            style={{
              background: 'transparent',
              border: '2px solid #d4af37',
              color: '#d4af37',
            }}
          >
            DOSSIER
          </Link>
          <Link
            href="/personal-projects/game-engine"
            className="px-6 py-2 text-sm tracking-wider transition-all hover:scale-105"
            style={{
              background: '#d4af37',
              color: '#0a1520',
            }}
          >
            ENTER RAPTURE
          </Link>
          <ThemeSwitcher />
        </div>
      </header>

      {/* Current Roles */}
      <section className="relative z-20 py-6 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap justify-center gap-8">
            {CURRENT_ROLES.map((role) => (
              <div
                key={role.id}
                className="text-center px-6 py-3"
                style={{
                  background: 'rgba(21, 32, 48, 0.6)',
                  border: '1px solid #d4af3740',
                }}
              >
                <p className="text-xs tracking-wider" style={{ color: '#d4af37' }}>{role.title}</p>
                <p className="text-sm" style={{ color: '#e8e0d0' }}>{role.company}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plasmid selection */}
      <section className="relative z-20 py-8">
        <div className="flex justify-center gap-6">
          {(['engineer', 'drummer', 'fighter'] as const).map((prof) => (
            <PlasmidButton
              key={prof}
              profession={prof}
              isActive={active === prof}
              onClick={() => setActive(prof)}
            />
          ))}
        </div>
      </section>

      {/* Main content */}
      <main className="relative z-20 px-8 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Bio */}
          <BathysphereRevealSection>
          <section className="mb-12">
            <GoldFrame title="ABOUT">
              <p className="text-sm leading-relaxed text-center" style={{ color: '#e8e0d0' }}>
                {aboutData.bio}
              </p>
              <div className="flex justify-center gap-3 mt-4 flex-wrap">
                {aboutData.quickFacts.map((fact, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-3 py-1"
                    style={{
                      background: '#d4af3710',
                      border: '1px solid #d4af3740',
                      color: '#d4af37',
                    }}
                  >
                    {'>>'} {fact}
                  </span>
                ))}
              </div>
            </GoldFrame>
          </section>
          </BathysphereRevealSection>

          {/* Work Experience */}
          {experience.length > 0 && (
            <BathysphereRevealSection>
              <section className="mb-12">
                <GoldFrame title="WORK EXPERIENCE">
                  <div className="space-y-4">
                    {experience.map((entry) => (
                      <ExperienceCard key={entry.id} entry={entry} />
                    ))}
                  </div>
                </GoldFrame>
              </section>
            </BathysphereRevealSection>
          )}

          {/* Grid layout */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Skills / Tech Stack */}
            <GoldFrame title={active === 'engineer' ? 'TECH STACK' : 'SKILLS'}>
              {active === 'engineer' ? (
                <TechCloud categories={engineerTech} />
              ) : (
                otherSkills.map((category) => (
                  <div key={category.name} className="mb-4 last:mb-0">
                    <h3
                      className="text-xs tracking-widest mb-2"
                      style={{ color: '#d4af37' }}
                    >
                      {'>>>'} {category.name.toUpperCase()}
                    </h3>
                    {category.skills.map((skill) => (
                      <DecoGauge key={skill.name} name={skill.name} value={skill.proficiency} />
                    ))}
                  </div>
                ))
              )}
            </GoldFrame>

            {/* Projects */}
            <div>
              <div className="text-center mb-4">
                <NeonSign
                  text="FEATURED WORK"
                  className="text-sm tracking-[0.3em]"
                />
                <div
                  className="w-32 h-px mx-auto mt-2"
                  style={{ background: 'linear-gradient(90deg, transparent, #d4af37, transparent)' }}
                />
              </div>
              <div className="space-y-3">
                {projects.slice(0, 4).map((project, i) => (
                  <VaultPoster key={project.id} project={project} index={i} />
                ))}
              </div>
            </div>
          </div>

          {/* Companies (Engineer) / Bands (Drummer) */}
          {active === 'engineer' && (
            <section className="mt-12">
              <GoldFrame title="VENTURES">
                <div className="grid md:grid-cols-3 gap-4">
                  {COMPANIES.map((company) => (
                    <CompanyCard key={company.id} company={company} />
                  ))}
                </div>
              </GoldFrame>
            </section>
          )}

          {active === 'drummer' && (
            <section className="mt-12">
              <GoldFrame title="BANDS">
                <div className="grid md:grid-cols-3 gap-4">
                  {BANDS.map((band) => (
                    <BandCard key={band.id} band={band} />
                  ))}
                </div>
              </GoldFrame>
            </section>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 py-8 text-center">
        <div
          className="inline-block px-8 py-2"
          style={{ border: '1px solid #d4af3740' }}
        >
          <p className="text-xs tracking-[0.3em]" style={{ color: '#d4af37' }}>
            NO GODS OR KINGS - ONLY MAN - MCMXXVI
          </p>
        </div>
      </footer>

      {/* Animations */}
      <style jsx global>{`
        @keyframes light-ray {
          0%, 100% { opacity: 0.05; }
          50% { opacity: 0.15; }
        }
        .animate-light-ray {
          animation: light-ray 4s ease-in-out infinite;
        }

        @keyframes bubble-rise {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 0.7;
          }
          90% {
            opacity: 0.5;
          }
          100% {
            transform: translateY(-100vh) translateX(var(--wobble, 20px));
            opacity: 0;
          }
        }
        .animate-bubble-rise {
          animation: bubble-rise linear infinite;
        }

        @keyframes caustics-1 {
          0%, 100% {
            transform: scale(1) translate(0, 0);
            opacity: 0.2;
          }
          33% {
            transform: scale(1.1) translate(5%, -3%);
            opacity: 0.3;
          }
          66% {
            transform: scale(0.95) translate(-3%, 2%);
            opacity: 0.15;
          }
        }
        .animate-caustics-1 {
          animation: caustics-1 15s ease-in-out infinite;
        }

        @keyframes caustics-2 {
          0%, 100% {
            transform: scale(1) translate(0, 0);
            opacity: 0.15;
          }
          50% {
            transform: scale(1.15) translate(-5%, 5%);
            opacity: 0.25;
          }
        }
        .animate-caustics-2 {
          animation: caustics-2 12s ease-in-out infinite;
          animation-delay: -6s;
        }

        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0) rotate(var(--rotation, 0deg));
          }
          50% {
            transform: translateY(-15px) rotate(calc(var(--rotation, 0deg) + 5deg));
          }
        }
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }

        @keyframes raptureFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.25; }
          25% { transform: translateY(-10px) rotate(3deg); opacity: 0.35; }
          50% { transform: translateY(-4px) rotate(-2deg); opacity: 0.2; }
          75% { transform: translateY(-12px) rotate(2deg); opacity: 0.3; }
        }

        @keyframes bathyDescent {
          0% { left: -50px; transform: translateY(-10px); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { left: 110%; transform: translateY(10px); opacity: 0; }
        }

        @keyframes bubbleTrail {
          0% { transform: translateY(0) scale(1); opacity: 0.6; }
          100% { transform: translateY(-30px) scale(0.3); opacity: 0; }
        }

        @keyframes goldFlash {
          0%, 100% { opacity: 0; }
          30% { opacity: 0.3; }
        }

        @keyframes bubble-small {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.5; }
          50% { transform: translateY(-8px) scale(0.8); opacity: 0.3; }
        }
        .animate-bubble-small {
          animation: bubble-small 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
