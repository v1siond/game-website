'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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

// Rubber Hose Alexander sprite - 1930s cartoon style
function CartoonSprite({
  size = 50,
  direction = 'right',
  className = ''
}: {
  size?: number
  direction?: 'left' | 'right'
  className?: string
}) {
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => setFrame(f => (f + 1) % 2), 120)
    return () => clearInterval(interval)
  }, [])

  const sprite = direction === 'right'
    ? (frame === 0 ? '/assets/sprites/run_right.png' : '/assets/sprites/run_right_1.png')
    : (frame === 0 ? '/assets/sprites/run_left.png' : '/assets/sprites/run_left_1.png')

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size * 1.2 }}>
      <Image
        src={sprite}
        alt="Cartoon Star"
        fill
        className="object-contain"
        style={{ filter: 'brightness(1.1) contrast(1.5) sepia(0.8) saturate(0.3)' }}
      />
      {/* Pie eyes effect */}
      <div
        className="absolute -top-1 left-1/2 -translate-x-1/2 flex gap-2"
        style={{ animation: 'wiggle 0.8s ease-in-out infinite' }}
      >
        <div className="w-3 h-3 rounded-full" style={{ background: '#2a2015' }} />
        <div className="w-3 h-3 rounded-full" style={{ background: '#2a2015' }} />
      </div>
      {/* Musical notes floating up */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-lg animate-float-up">
        ♪
      </div>
    </div>
  )
}

// Vintage cartoon profession ornaments
function VintageOrnaments({ profession }: { profession: 'engineer' | 'drummer' | 'fighter' }) {
  const ornamentsByProfession = {
    engineer: [
      { icon: '⚙', x: 4, y: 22, size: 32 },
      { icon: '💡', x: 92, y: 26, size: 28 },
      { icon: '🔧', x: 5, y: 70, size: 26 },
      { icon: '⚡', x: 91, y: 74, size: 30 },
    ],
    drummer: [
      { icon: '♪', x: 4, y: 24, size: 34 },
      { icon: '♫', x: 93, y: 22, size: 32 },
      { icon: '🎹', x: 5, y: 72, size: 28 },
      { icon: '🎵', x: 91, y: 76, size: 30 },
    ],
    fighter: [
      { icon: '💪', x: 4, y: 22, size: 30 },
      { icon: '⭐', x: 92, y: 26, size: 32 },
      { icon: '🥊', x: 5, y: 74, size: 28 },
      { icon: '✨', x: 91, y: 70, size: 30 },
    ],
  }

  const items = ornamentsByProfession[profession]

  return (
    <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden">
      {items.map((item, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            fontSize: item.size,
            opacity: 0.35,
            filter: 'sepia(0.8) contrast(1.2)',
            animation: `bob ${2 + i * 0.5}s ease-in-out infinite, wiggle ${3 + i * 0.3}s ease-in-out infinite`,
            animationDelay: `${-i * 0.5}s`,
          }}
        >
          {item.icon}
        </div>
      ))}
    </div>
  )
}

// Splash reveal section (ink splat animation)
function SplashRevealSection({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const hasEntered = useInViewTrigger(ref, { threshold: 0.15 })
  const [phase, setPhase] = useState<'hidden' | 'splashing' | 'revealed'>('hidden')

  useEffect(() => {
    if (hasEntered && phase === 'hidden') {
      setPhase('splashing')
      setTimeout(() => setPhase('revealed'), 500)
    }
  }, [hasEntered, phase])

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {/* Ink splash animation */}
      {phase === 'splashing' && (
        <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center">
          {/* Ink splats */}
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${30 + i * 8}%`,
                top: `${40 + (i % 3) * 10}%`,
                width: 20 + i * 5,
                height: 20 + i * 5,
                background: '#2a2015',
                animation: `ink-splash 0.4s ease-out forwards`,
                animationDelay: `${i * 0.05}s`,
              }}
            />
          ))}
          {/* Star burst */}
          <div
            className="absolute text-4xl"
            style={{ animation: 'pop-in 0.4s ease-out forwards' }}
          >
            ✦
          </div>
        </div>
      )}

      <div
        style={{
          opacity: phase === 'revealed' ? 1 : 0,
          transform: phase === 'revealed' ? 'scale(1)' : 'scale(0.9)',
          transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {children}
      </div>
    </div>
  )
}

// Film reel border with animated sprocket holes
function FilmReelBorder() {
  return (
    <>
      {/* Left film strip */}
      <div className="fixed left-0 top-0 bottom-0 w-12 z-[4] pointer-events-none" style={{ background: '#1a1510' }}>
        <div className="absolute inset-0 flex flex-col justify-start animate-sprocket-scroll">
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 h-8 flex items-center justify-center">
              <div className="w-6 h-4 rounded-sm" style={{ background: '#0a0805', border: '1px solid #2a2015' }} />
            </div>
          ))}
        </div>
      </div>
      {/* Right film strip */}
      <div className="fixed right-0 top-0 bottom-0 w-12 z-[4] pointer-events-none" style={{ background: '#1a1510' }}>
        <div className="absolute inset-0 flex flex-col justify-start animate-sprocket-scroll-reverse">
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 h-8 flex items-center justify-center">
              <div className="w-6 h-4 rounded-sm" style={{ background: '#0a0805', border: '1px solid #2a2015' }} />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

// Enhanced film grain and scratches effect
function FilmEffects() {
  const [scratches, setScratches] = useState<Array<{ id: number; x: number; height: number; opacity: number }>>([])

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.5) {
        const newScratches = Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => ({
          id: Date.now() + Math.random(),
          x: Math.random() * 100,
          height: 20 + Math.random() * 80,
          opacity: 0.1 + Math.random() * 0.3,
        }))
        setScratches(newScratches)
        setTimeout(() => setScratches([]), 80)
      }
    }, 150)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {/* Heavy film grain */}
      <div
        className="fixed inset-0 pointer-events-none z-[8] opacity-[0.2] animate-grain-fast"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
      {/* Sepia vignette */}
      <div
        className="fixed inset-0 pointer-events-none z-[7]"
        style={{
          background: 'radial-gradient(circle at 50% 50%, transparent 30%, rgba(42, 32, 21, 0.7) 100%)',
        }}
      />
      {/* Film scratches */}
      {scratches.map((scratch) => (
        <div
          key={scratch.id}
          className="fixed top-0 pointer-events-none z-[9]"
          style={{
            left: `${scratch.x}%`,
            width: '2px',
            height: `${scratch.height}%`,
            background: `rgba(255, 255, 255, ${scratch.opacity})`,
            filter: 'blur(0.5px)',
          }}
        />
      ))}
      {/* Dust particles */}
      <div className="fixed inset-0 pointer-events-none z-[8] animate-dust">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${10 + i * 12}%`,
              top: `${Math.random() * 100}%`,
              width: '3px',
              height: '3px',
              background: 'rgba(255, 255, 255, 0.15)',
            }}
          />
        ))}
      </div>
      {/* Flicker overlay */}
      <div className="fixed inset-0 pointer-events-none z-[6] animate-flicker-1930" style={{ background: 'rgba(0,0,0,0.05)' }} />
    </>
  )
}

// Floating music notes
function FloatingMusicNotes() {
  const [notes, setNotes] = useState<Array<{ id: number; x: number; y: number; type: string; delay: number }>>([])

  useEffect(() => {
    const noteTypes = ['\u{266A}', '\u{266B}', '\u{266C}', '\u{2669}'] // eighth, beamed, beamed 16th, quarter
    const newNotes = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: 10 + Math.random() * 80,
      y: 100 + Math.random() * 20,
      type: noteTypes[Math.floor(Math.random() * noteTypes.length)],
      delay: Math.random() * 8,
    }))
    setNotes(newNotes)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-[3] overflow-hidden">
      {notes.map((note) => (
        <div
          key={note.id}
          className="absolute text-2xl animate-float-up"
          style={{
            left: `${note.x}%`,
            bottom: `-${note.y}px`,
            color: '#2a2015',
            opacity: 0.3,
            animationDelay: `${note.delay}s`,
            animationDuration: `${12 + Math.random() * 6}s`,
            textShadow: '1px 1px 0 #8b7a60',
          }}
        >
          {note.type}
        </div>
      ))}
    </div>
  )
}

// Pie-eye blinking cartoon face decoration
function PieEyeFace({ position, size = 60 }: { position: { x: number; y: number }; size?: number }) {
  const [isBlinking, setIsBlinking] = useState(false)

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setIsBlinking(true)
        setTimeout(() => setIsBlinking(false), 150)
      }
    }, 2000)
    return () => clearInterval(blinkInterval)
  }, [])

  return (
    <div
      className="absolute pointer-events-none animate-bob"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        width: size,
        height: size,
      }}
    >
      <svg viewBox="0 0 60 60" className="w-full h-full">
        {/* Face circle */}
        <circle cx="30" cy="30" r="28" fill="#f5e6c8" stroke="#2a2015" strokeWidth="3" />
        {/* Pie eyes */}
        <ellipse cx="20" cy="25" rx="8" ry={isBlinking ? 1 : 10} fill="#2a2015" className="transition-all duration-75" />
        <ellipse cx="40" cy="25" rx="8" ry={isBlinking ? 1 : 10} fill="#2a2015" className="transition-all duration-75" />
        {/* Pie slices in eyes */}
        {!isBlinking && (
          <>
            <path d="M20,15 L20,25 L12,25 Z" fill="#f5e6c8" />
            <path d="M40,15 L40,25 L32,25 Z" fill="#f5e6c8" />
          </>
        )}
        {/* Smile */}
        <path d="M15,40 Q30,50 45,40" fill="none" stroke="#2a2015" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </div>
  )
}

// Bouncing ball with squash and stretch
function BouncingBall({ initialX, delay }: { initialX: number; delay: number }) {
  return (
    <div
      className="absolute bottom-0 w-8 h-8 animate-bounce-squash pointer-events-none z-[2]"
      style={{
        left: `${initialX}%`,
        animationDelay: `${delay}s`,
      }}
    >
      <div
        className="w-full h-full rounded-full"
        style={{
          background: 'radial-gradient(circle at 30% 30%, #4a3a25, #2a2015)',
          boxShadow: '2px 2px 0 #1a1510',
        }}
      />
    </div>
  )
}

// Rubber hose arm decoration
function RubberHoseArm({ side, y }: { side: 'left' | 'right'; y: number }) {
  return (
    <div
      className={`fixed ${side === 'left' ? 'left-16' : 'right-16'} pointer-events-none z-[2] animate-wave-arm`}
      style={{ top: `${y}%` }}
    >
      <svg width="80" height="120" viewBox="0 0 80 120" className={side === 'right' ? 'scale-x-[-1]' : ''}>
        {/* Upper arm */}
        <path
          d="M10,0 Q30,20 20,40 Q10,60 25,80"
          fill="none"
          stroke="#2a2015"
          strokeWidth="16"
          strokeLinecap="round"
        />
        {/* Glove */}
        <circle cx="25" cy="90" r="20" fill="#f5e6c8" stroke="#2a2015" strokeWidth="3" />
        {/* Fingers */}
        <ellipse cx="15" cy="105" rx="6" ry="10" fill="#f5e6c8" stroke="#2a2015" strokeWidth="2" />
        <ellipse cx="30" cy="108" rx="6" ry="10" fill="#f5e6c8" stroke="#2a2015" strokeWidth="2" />
        <ellipse cx="42" cy="100" rx="6" ry="10" fill="#f5e6c8" stroke="#2a2015" strokeWidth="2" />
      </svg>
    </div>
  )
}

// Ink splash effect on hover
function InkSplash({ x, y }: { x: number; y: number }) {
  return (
    <div
      className="fixed pointer-events-none z-[50] animate-ink-splash"
      style={{ left: x - 40, top: y - 40 }}
    >
      <svg width="80" height="80" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r="5" fill="#2a2015" />
        <ellipse cx="25" cy="30" rx="8" ry="5" fill="#2a2015" />
        <ellipse cx="55" cy="35" rx="6" ry="4" fill="#2a2015" />
        <ellipse cx="35" cy="55" rx="7" ry="5" fill="#2a2015" />
        <ellipse cx="50" cy="50" rx="5" ry="3" fill="#2a2015" />
        <circle cx="20" cy="45" r="3" fill="#2a2015" />
        <circle cx="60" cy="25" r="4" fill="#2a2015" />
      </svg>
    </div>
  )
}

// Bouncy cartoon text
function CartoonTitle({ text, subtitle }: { text: string; subtitle?: string }) {
  return (
    <div className="text-center">
      <div className="flex justify-center gap-1 flex-wrap">
        {text.split('').map((char, i) => (
          <span
            key={i}
            className="inline-block animate-bounce-letter"
            style={{
              animationDelay: `${i * 0.05}s`,
              fontFamily: '"Abril Fatface", "Georgia", serif',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              color: '#2a2015',
              textShadow: '4px 4px 0 #8b7a60, 6px 6px 0 #5a4a35',
            }}
          >
            {char === ' ' ? ' ' : char}
          </span>
        ))}
      </div>
      {subtitle && (
        <p className="mt-4 text-sm tracking-[0.2em]" style={{ color: '#5a4a35', fontFamily: 'serif' }}>
          {subtitle}
        </p>
      )}
    </div>
  )
}

// Cartoon character card with rubberhose style
function CartoonCharacter({
  profession,
  isActive,
  onClick,
}: {
  profession: 'engineer' | 'drummer' | 'fighter'
  isActive: boolean
  onClick: () => void
}) {
  const icons = { engineer: '⚙', drummer: '♫', fighter: '⚔' }
  const names = { engineer: 'THE ENGINEER', drummer: 'THE DRUMMER', fighter: 'THE FIGHTER' }

  return (
    <button
      onClick={onClick}
      className={`relative transition-all group ${
        isActive ? 'scale-110' : 'hover:scale-105'
      }`}
    >
      {/* Circular frame like old cartoon */}
      <div
        className={`w-28 h-28 md:w-32 md:h-32 rounded-full flex items-center justify-center relative ${
          isActive ? 'animate-bounce-slow' : ''
        }`}
        style={{
          background: isActive ? '#8b0000' : '#f5e6c8',
          border: `6px solid #2a2015`,
          boxShadow: isActive ? '0 8px 0 #5a0000, 0 10px 20px rgba(0,0,0,0.3)' : '0 4px 0 #8a7a60',
        }}
      >
        {/* Inner ring decoration */}
        <div
          className="absolute inset-2 rounded-full"
          style={{ border: '2px dashed #2a201540' }}
        />
        <span
          className="text-4xl md:text-5xl group-hover:animate-wiggle"
          style={{ color: isActive ? '#f5e6c8' : '#2a2015' }}
        >
          {icons[profession]}
        </span>
      </div>

      {/* Name banner */}
      <div
        className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 whitespace-nowrap"
        style={{
          background: '#2a2015',
          color: '#f5e6c8',
          fontFamily: '"Abril Fatface", serif',
          fontSize: '0.65rem',
          letterSpacing: '0.1em',
          transform: 'translateX(-50%) rotate(-3deg)',
        }}
      >
        {names[profession]}
      </div>
    </button>
  )
}

// Decorative banner with curls
function DecorativeBanner({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative inline-block">
      {/* Left curl */}
      <svg className="absolute -left-10 top-1/2 -translate-y-1/2 w-10 h-20" viewBox="0 0 40 80">
        <path
          d="M38,40 Q0,40 15,15 Q25,0 30,8 Q35,16 28,20 Q20,25 15,18"
          fill="none"
          stroke="#2a2015"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <circle cx="15" cy="18" r="3" fill="#8b0000" />
      </svg>
      <div
        className="px-8 py-3 relative"
        style={{
          background: '#8b0000',
          border: '4px solid #2a2015',
          color: '#f5e6c8',
          fontFamily: '"Abril Fatface", serif',
          boxShadow: '4px 4px 0 #5a0000',
        }}
      >
        {children}
      </div>
      {/* Right curl */}
      <svg className="absolute -right-10 top-1/2 -translate-y-1/2 w-10 h-20 scale-x-[-1]" viewBox="0 0 40 80">
        <path
          d="M38,40 Q0,40 15,15 Q25,0 30,8 Q35,16 28,20 Q20,25 15,18"
          fill="none"
          stroke="#2a2015"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <circle cx="15" cy="18" r="3" fill="#8b0000" />
      </svg>
    </div>
  )
}

// Current role card in vintage ticket style
function RoleTicket({ role }: { role: typeof CURRENT_ROLES[0] }) {
  return (
    <div
      className="relative px-6 py-3 animate-wiggle"
      style={{
        background: '#efe0c0',
        border: '3px solid #2a2015',
        borderStyle: 'dashed',
        fontFamily: 'serif',
      }}
    >
      {/* Ticket stub marks */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-8" style={{ background: '#f5e6c8', borderRight: '2px dashed #2a2015' }} />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-8" style={{ background: '#f5e6c8', borderLeft: '2px dashed #2a2015' }} />

      <p className="text-xs tracking-wider" style={{ color: '#8b0000' }}>{role.title}</p>
      <p className="text-sm font-bold" style={{ color: '#2a2015' }}>{role.company}</p>
    </div>
  )
}

// Tech stack in cartoon bubble style
function TechBubbleCloud({ categories }: { categories: ReturnType<typeof getEngineerSkills> }) {
  return (
    <div className="space-y-6">
      {categories.map((category, catIdx) => (
        <div key={category.name}>
          <h3
            className="text-xs tracking-widest mb-3 flex items-center gap-2"
            style={{ color: '#8b0000', fontFamily: 'serif' }}
          >
            <span className="text-lg">{category.icon}</span>
            -- {category.name.toUpperCase()} --
          </h3>
          <div className="flex flex-wrap gap-2">
            {category.items.map((tech, i) => (
              <span
                key={tech}
                className="px-3 py-1 text-xs transition-all hover:scale-110 cursor-default animate-pop-in"
                style={{
                  animationDelay: `${(catIdx * 0.1) + (i * 0.03)}s`,
                  background: '#2a2015',
                  color: '#f5e6c8',
                  borderRadius: '20px',
                  boxShadow: '2px 2px 0 #1a1510',
                  fontFamily: 'serif',
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

// Skills with cartoon meter bubbles
function CartoonSkillsList({ categories }: { categories: ReturnType<typeof getSkillsByProfession> }) {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {categories.map((category) => (
        <div key={category.name}>
          <h3
            className="text-xs tracking-widest mb-3 flex items-center gap-2"
            style={{ color: '#8b0000', fontFamily: 'serif' }}
          >
            <span className="text-lg">{category.icon}</span>
            {category.name.toUpperCase()}
          </h3>
          <ul className="space-y-2">
            {category.skills.map((skill, i) => (
              <li
                key={skill.name}
                className="flex items-center gap-2 animate-pop-in"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                  style={{
                    background: '#8b0000',
                    color: '#f5e6c8',
                    border: '2px solid #2a2015',
                    boxShadow: '2px 2px 0 #5a0000',
                  }}
                >
                  {skill.proficiency}
                </span>
                <span className="text-sm" style={{ color: '#2a2015', fontFamily: 'serif' }}>
                  {skill.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

// Company card in vintage poster style
function CompanyPoster({ company }: { company: typeof COMPANIES[0] }) {
  const [showSplash, setShowSplash] = useState(false)
  const [splashPos, setSplashPos] = useState({ x: 0, y: 0 })

  const handleMouseEnter = (e: React.MouseEvent) => {
    setSplashPos({ x: e.clientX, y: e.clientY })
    setShowSplash(true)
    setTimeout(() => setShowSplash(false), 400)
  }

  return (
    <>
      {showSplash && <InkSplash x={splashPos.x} y={splashPos.y} />}
      <a
        href={company.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block p-4 relative group transition-all hover:scale-[1.02]"
        style={{
          background: '#efe0c0',
          border: '4px solid #2a2015',
          boxShadow: '4px 4px 0 #8a7a60',
        }}
        onMouseEnter={handleMouseEnter}
      >
        {/* Corner stars */}
        {['-top-2 -left-2', '-top-2 -right-2', '-bottom-2 -left-2', '-bottom-2 -right-2'].map((pos, i) => (
          <span key={i} className={`absolute ${pos} text-lg`} style={{ color: '#8b0000' }}>★</span>
        ))}

        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{company.icon}</span>
          <div>
            <h4 className="text-sm font-bold group-hover:text-red-800 transition-colors" style={{ color: '#2a2015', fontFamily: 'serif' }}>
              {company.name}
            </h4>
            <p className="text-[10px]" style={{ color: '#8b0000' }}>{company.tagline}</p>
          </div>
        </div>
        <p className="text-xs" style={{ color: '#5a4a35', fontFamily: 'serif' }}>{company.description}</p>
      </a>
    </>
  )
}

// Band card in record label style
function BandRecord({ band }: { band: typeof BANDS[0] }) {
  const [showSplash, setShowSplash] = useState(false)
  const [splashPos, setSplashPos] = useState({ x: 0, y: 0 })

  const handleMouseEnter = (e: React.MouseEvent) => {
    setSplashPos({ x: e.clientX, y: e.clientY })
    setShowSplash(true)
    setTimeout(() => setShowSplash(false), 400)
  }

  const content = (
    <div
      className="p-4 relative group transition-all hover:scale-[1.02] hover:rotate-1"
      style={{
        background: '#efe0c0',
        border: '4px solid #2a2015',
        boxShadow: '4px 4px 0 #8a7a60',
      }}
      onMouseEnter={handleMouseEnter}
    >
      {/* Vinyl record decoration */}
      <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full flex items-center justify-center" style={{ background: '#2a2015' }}>
        <div className="w-4 h-4 rounded-full" style={{ background: '#8b0000' }} />
      </div>

      <h4 className="text-sm font-bold group-hover:text-red-800 transition-colors" style={{ color: '#2a2015', fontFamily: 'serif' }}>
        ♫ {band.name}
      </h4>
      <p className="text-[10px] mt-1" style={{ color: '#8b0000' }}>{band.genre} • {band.role}</p>
      <p className="text-xs mt-2" style={{ color: '#5a4a35', fontFamily: 'serif' }}>{band.description}</p>
      {!band.url && (
        <p className="text-[10px] mt-2 italic" style={{ color: '#5a4a35' }}>~ Website coming soon ~</p>
      )}
    </div>
  )

  return (
    <>
      {showSplash && <InkSplash x={splashPos.x} y={splashPos.y} />}
      {band.url ? (
        <a href={band.url} target="_blank" rel="noopener noreferrer" className="block">{content}</a>
      ) : (
        content
      )}
    </>
  )
}

// Experience card in vintage ticket/poster style
function ExperienceCard({ entry }: { entry: typeof EXPERIENCE_DATA[0] }) {
  const endDisplay = entry.endDate ? new Date(entry.endDate).getFullYear() : 'Present'
  const startDisplay = new Date(entry.startDate).getFullYear()

  return (
    <div
      className="p-4 relative"
      style={{
        background: '#efe0c0',
        border: '4px solid #2a2015',
        boxShadow: '4px 4px 0 #8a7a60',
      }}
    >
      {/* Corner decorations */}
      <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2" style={{ borderColor: '#8b0000' }} />
      <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2" style={{ borderColor: '#8b0000' }} />
      <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2" style={{ borderColor: '#8b0000' }} />
      <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2" style={{ borderColor: '#8b0000' }} />

      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="text-sm font-bold" style={{ color: '#2a2015', fontFamily: 'serif' }}>
            {entry.title}
          </h4>
          <p className="text-xs" style={{ color: '#8b0000', fontFamily: 'serif' }}>
            {entry.organization}
          </p>
        </div>
        <span
          className="text-[10px] px-2 py-1"
          style={{
            background: '#2a2015',
            color: '#f5e6c8',
            fontFamily: 'serif',
          }}
        >
          {startDisplay} - {endDisplay}
        </span>
      </div>
      <p className="text-xs mb-2" style={{ color: '#5a4a35', fontFamily: 'serif' }}>
        {entry.description}
      </p>
      {entry.highlights && entry.highlights.length > 0 && (
        <ul className="space-y-1">
          {entry.highlights.map((highlight, i) => (
            <li
              key={i}
              className="text-xs flex items-start gap-2"
              style={{ color: '#2a2015', fontFamily: 'serif' }}
            >
              <span style={{ color: '#8b0000' }}>★</span>
              {highlight}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// Project card in vintage poster style
function VintagePoster({ project }: { project: typeof PROJECTS_DATA[0] }) {
  return (
    <div
      className="p-4 relative group cursor-pointer transition-all hover:scale-[1.02] hover:-rotate-1"
      style={{
        background: '#efe0c0',
        border: '4px solid #2a2015',
        boxShadow: '4px 4px 0 #8a7a60',
      }}
    >
      {/* Corner decorations */}
      <div className="absolute top-1 left-1 w-4 h-4 border-t-2 border-l-2" style={{ borderColor: '#8b0000' }} />
      <div className="absolute top-1 right-1 w-4 h-4 border-t-2 border-r-2" style={{ borderColor: '#8b0000' }} />
      <div className="absolute bottom-1 left-1 w-4 h-4 border-b-2 border-l-2" style={{ borderColor: '#8b0000' }} />
      <div className="absolute bottom-1 right-1 w-4 h-4 border-b-2 border-r-2" style={{ borderColor: '#8b0000' }} />

      {project.featured && (
        <span className="text-[8px] tracking-wider" style={{ color: '#8b0000' }}>★ FEATURED ★</span>
      )}
      <h3 className="text-sm font-bold mt-1" style={{ color: '#8b0000', fontFamily: 'serif' }}>
        {project.name.toUpperCase()}
      </h3>
      <p className="text-[10px] mb-2" style={{ color: '#5a4a35' }}>
        {project.tagline}
      </p>
      {project.impact && (
        <p className="text-[10px] mb-2 italic" style={{ color: '#2a2015' }}>-&gt; {project.impact}</p>
      )}
      <div className="flex gap-1 flex-wrap">
        {project.techStack.slice(0, 4).map((tech) => (
          <span
            key={tech}
            className="text-[8px] px-2 py-0.5 rounded-full"
            style={{
              background: '#2a2015',
              color: '#f5e6c8',
            }}
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function RubberHoseTheme() {
  const { active, setActive, config } = useProfession()
  const [mounted, setMounted] = useState(false)

  const aboutData = ABOUT_DATA[active]
  const engineerSkills = getEngineerSkills()
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
        background: 'linear-gradient(to bottom, #f5e6c8, #e8d4b0)',
        fontFamily: '"Courier New", monospace',
      }}
    >
      {/* Film reel borders */}
      <FilmReelBorder />

      {/* Profession ornaments */}
      <VintageOrnaments profession={active} />

      {/* Film effects */}
      <FilmEffects />

      {/* Floating music notes */}
      <FloatingMusicNotes />

      {/* Pie-eye face decorations */}
      <PieEyeFace position={{ x: 5, y: 20 }} size={50} />
      <PieEyeFace position={{ x: 90, y: 70 }} size={40} />

      {/* Bouncing balls */}
      <BouncingBall initialX={15} delay={0} />
      <BouncingBall initialX={45} delay={0.5} />
      <BouncingBall initialX={75} delay={1} />

      {/* Rubber hose arms */}
      <RubberHoseArm side="left" y={40} />
      <RubberHoseArm side="right" y={60} />

      {/* Decorative border frame */}
      <div className="fixed inset-4 left-16 right-16 pointer-events-none z-[5]" style={{ border: '8px double #2a2015' }} />

      {/* Main content area with padding for film strips */}
      <div className="ml-14 mr-14">
        {/* Header */}
        <header className="relative z-30 p-8 text-center">
          <CartoonTitle
            text="ALEXANDER PULIDO"
            subtitle={PROFESSIONAL_SUMMARY.headline}
          />
          <p
            className="text-xs tracking-widest mt-2 italic"
            style={{ color: '#8b0000', fontFamily: 'serif' }}
          >
            &quot;{PROFESSIONAL_SUMMARY.tagline}&quot;
          </p>

          <div className="flex justify-center gap-4 mt-6 flex-wrap">
            <Link
              href="/cv"
              className="px-5 py-2 text-sm tracking-wider transition-all hover:scale-105 hover:rotate-1"
              style={{
                background: '#2a2015',
                color: '#f5e6c8',
                border: '3px solid #2a2015',
                fontFamily: 'serif',
                boxShadow: '3px 3px 0 #1a1510',
              }}
            >
              ☆ RESUME ☆
            </Link>
            <Link
              href="/personal-projects/game-engine"
              className="px-5 py-2 text-sm tracking-wider transition-all hover:scale-105 hover:-rotate-1"
              style={{
                background: '#8b0000',
                color: '#f5e6c8',
                border: '3px solid #2a2015',
                fontFamily: 'serif',
                boxShadow: '3px 3px 0 #5a0000',
              }}
            >
              ☆ PLAY GAME ☆
            </Link>
            <ThemeSwitcher />
          </div>
        </header>

        {/* Current Roles */}
        <section className="relative z-20 py-4">
          <div className="flex justify-center gap-4 flex-wrap">
            {CURRENT_ROLES.map((role, i) => (
              <div key={role.id} style={{ animationDelay: `${i * 0.1}s` }}>
                <RoleTicket role={role} />
              </div>
            ))}
          </div>
        </section>

        {/* Character selection */}
        <section className="relative z-20 py-8">
          <div className="text-center mb-6">
            <p className="text-xs tracking-widest" style={{ color: '#5a4a35', fontFamily: 'serif' }}>
              ~ SELECT YOUR ADVENTURE ~
            </p>
          </div>
          <div className="flex justify-center gap-8 md:gap-12 flex-wrap">
            {(['engineer', 'drummer', 'fighter'] as const).map((prof) => (
              <CartoonCharacter
                key={prof}
                profession={prof}
                isActive={active === prof}
                onClick={() => setActive(prof)}
              />
            ))}
          </div>
        </section>

        {/* Main content */}
        <main className="relative z-20 px-4 md:px-8 py-8">
          <div className="max-w-4xl mx-auto">
            {/* About section */}
            <section className="text-center mb-12">
              <DecorativeBanner>
                <span className="text-lg tracking-wider">ABOUT</span>
              </DecorativeBanner>
              <p
                className="mt-8 text-sm leading-relaxed max-w-2xl mx-auto"
                style={{ color: '#2a2015', fontFamily: 'serif' }}
              >
                {aboutData.bio}
              </p>
            </section>

            {/* Quick facts as film reel */}
            <section className="mb-12">
              <div className="flex justify-center gap-3 flex-wrap">
                {aboutData.quickFacts.map((fact, i) => (
                  <div
                    key={i}
                    className="px-4 py-2 animate-wiggle"
                    style={{
                      animationDelay: `${i * 0.2}s`,
                      background: '#2a2015',
                      color: '#f5e6c8',
                      fontFamily: 'serif',
                      fontSize: '0.75rem',
                      transform: `rotate(${(i % 2 === 0 ? -2 : 2)}deg)`,
                      boxShadow: '2px 2px 0 #1a1510',
                    }}
                  >
                    ✦ {fact} ✦
                  </div>
                ))}
              </div>
            </section>

            {/* Work Experience */}
            {experience.length > 0 && (
              <section className="mb-12">
                <div className="text-center mb-6">
                  <DecorativeBanner>
                    <span className="text-lg tracking-wider">WORK EXPERIENCE</span>
                  </DecorativeBanner>
                </div>
                <div className="space-y-4 max-w-3xl mx-auto">
                  {experience.map((entry) => (
                    <ExperienceCard key={entry.id} entry={entry} />
                  ))}
                </div>
              </section>
            )}

            {/* Tech Stack / Skills section */}
            <section className="mb-12">
              <div className="text-center mb-6">
                <DecorativeBanner>
                  <span className="text-lg tracking-wider">
                    {active === 'engineer' ? 'TECH STACK' : 'SKILLS'}
                  </span>
                </DecorativeBanner>
              </div>
              <div
                className="p-6 max-w-3xl mx-auto"
                style={{
                  background: '#efe0c0',
                  border: '4px solid #2a2015',
                  boxShadow: '6px 6px 0 #8a7a60',
                }}
              >
                {active === 'engineer' ? (
                  <TechBubbleCloud categories={engineerSkills} />
                ) : (
                  <CartoonSkillsList categories={otherSkills} />
                )}
              </div>
            </section>

            {/* Projects */}
            <section className="mb-12">
              <div className="text-center mb-6">
                <DecorativeBanner>
                  <span className="text-lg tracking-wider">PROJECTS</span>
                </DecorativeBanner>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {projects.filter(p => p.featured).slice(0, 6).map((project) => (
                  <VintagePoster key={project.id} project={project} />
                ))}
              </div>
            </section>

            {/* Companies (Engineer) */}
            {active === 'engineer' && (
              <section className="mb-12">
                <div className="text-center mb-6">
                  <DecorativeBanner>
                    <span className="text-lg tracking-wider">COMPANIES</span>
                  </DecorativeBanner>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  {COMPANIES.map((company) => (
                    <CompanyPoster key={company.id} company={company} />
                  ))}
                </div>
              </section>
            )}

            {/* Bands (Drummer) */}
            {active === 'drummer' && (
              <section className="mb-12">
                <div className="text-center mb-6">
                  <DecorativeBanner>
                    <span className="text-lg tracking-wider">BANDS</span>
                  </DecorativeBanner>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  {BANDS.map((band) => (
                    <BandRecord key={band.id} band={band} />
                  ))}
                </div>
              </section>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="relative z-20 py-8 text-center">
          <div className="flex items-center justify-center gap-4">
            <div className="w-16 h-0.5" style={{ background: '#2a2015' }} />
            <p
              className="text-xs tracking-widest"
              style={{ color: '#5a4a35', fontFamily: 'serif' }}
            >
              ✦ A PRESENTATION IN GLORIOUS SEPIA ✦ MCMXXVI
            </p>
            <div className="w-16 h-0.5" style={{ background: '#2a2015' }} />
          </div>
        </footer>
      </div>

      {/* Animations */}
      <style jsx global>{`
        @keyframes grain-fast {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-2%, -2%); }
          20% { transform: translate(2%, 2%); }
          30% { transform: translate(-2%, 2%); }
          40% { transform: translate(2%, -2%); }
          50% { transform: translate(-2%, 0%); }
          60% { transform: translate(2%, 0%); }
          70% { transform: translate(0%, -2%); }
          80% { transform: translate(0%, 2%); }
          90% { transform: translate(-2%, -2%); }
        }
        @keyframes flicker-1930 {
          0%, 100% { opacity: 0; }
          8% { opacity: 0.15; }
          9% { opacity: 0; }
          12% { opacity: 0.1; }
          13% { opacity: 0; }
          50% { opacity: 0; }
          51% { opacity: 0.08; }
          52% { opacity: 0; }
        }
        @keyframes sprocket-scroll {
          0% { transform: translateY(0); }
          100% { transform: translateY(-256px); }
        }
        @keyframes sprocket-scroll-reverse {
          0% { transform: translateY(-256px); }
          100% { transform: translateY(0); }
        }
        @keyframes float-up {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.3; }
          90% { opacity: 0.3; }
          100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }
        @keyframes bob {
          0%, 100% { transform: translateY(0) rotate(-5deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
        @keyframes bounce-squash {
          0% { transform: translateY(0) scaleY(1) scaleX(1); }
          25% { transform: translateY(-100px) scaleY(1.2) scaleX(0.9); }
          50% { transform: translateY(0) scaleY(0.8) scaleX(1.2); }
          75% { transform: translateY(-50px) scaleY(1.1) scaleX(0.95); }
          100% { transform: translateY(0) scaleY(1) scaleX(1); }
        }
        @keyframes wave-arm {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(10deg); }
        }
        @keyframes ink-splash {
          0% { transform: scale(0); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.8; }
          100% { transform: scale(2); opacity: 0; }
        }
        @keyframes bounce-letter {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
        }
        @keyframes pop-in {
          0% { transform: scale(0); opacity: 0; }
          70% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes dust {
          0%, 100% { opacity: 0.1; transform: translateY(0); }
          50% { opacity: 0.2; transform: translateY(-20px); }
        }
        .animate-grain-fast {
          animation: grain-fast 0.3s steps(10) infinite;
        }
        .animate-flicker-1930 {
          animation: flicker-1930 2s ease-in-out infinite;
        }
        .animate-sprocket-scroll {
          animation: sprocket-scroll 4s linear infinite;
        }
        .animate-sprocket-scroll-reverse {
          animation: sprocket-scroll-reverse 4s linear infinite;
        }
        .animate-float-up {
          animation: float-up 15s linear infinite;
        }
        .animate-bob {
          animation: bob 3s ease-in-out infinite;
        }
        .animate-bounce-squash {
          animation: bounce-squash 2s ease-in-out infinite;
        }
        .animate-wave-arm {
          animation: wave-arm 2s ease-in-out infinite;
        }
        .animate-ink-splash {
          animation: ink-splash 0.4s ease-out forwards;
        }
        .animate-bounce-letter {
          animation: bounce-letter 0.6s ease-in-out infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 0.8s ease-in-out infinite;
        }
        .animate-wiggle {
          animation: wiggle 0.5s ease-in-out infinite;
        }
        .animate-pop-in {
          animation: pop-in 0.3s ease-out forwards;
          opacity: 0;
        }
        .animate-dust {
          animation: dust 4s ease-in-out infinite;
        }
        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  )
}
