'use client'

import { useEffect, useState, useRef, useMemo } from 'react'
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

// ============================================================================
// CUPHEAD COLOR PALETTE - Authentic 1930s Fleischer/Disney style
// ============================================================================
const CUPHEAD_COLORS = {
  // Warm paper backgrounds (watercolor texture feel)
  paperCream: '#f7ead0',
  paperSepia: '#e8d4b0',
  paperWarm: '#f5e6c8',
  paperDark: '#d4c4a0',

  // Ink and line colors
  inkBlack: '#2a2015',
  inkBrown: '#3a2a1a',
  inkSoft: '#4a3a25',

  // Accent colors (like Cuphead's red/blue characters)
  accentRed: '#c41e3a',
  accentRedDark: '#8b0000',
  accentBlue: '#2b4570',
  accentGold: '#c9a227',
  accentOrange: '#d4652f',

  // Shadow and highlight
  shadowBrown: '#8a7a60',
  shadowDark: '#5a4a35',
  highlightCream: '#fff8e7',
}

// ============================================================================
// HOOK: Prefers Reduced Motion
// ============================================================================
function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return prefersReducedMotion
}

// ============================================================================
// COMPONENT: Cartoon Sprite with rubber hose animation
// ============================================================================
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
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (reducedMotion) return
    const interval = setInterval(() => setFrame(f => (f + 1) % 2), 120)
    return () => clearInterval(interval)
  }, [reducedMotion])

  const sprite = direction === 'right'
    ? (frame === 0 ? '/assets/sprites/run_right.png' : '/assets/sprites/run_right_1.png')
    : (frame === 0 ? '/assets/sprites/run_left.png' : '/assets/sprites/run_left_1.png')

  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size * 1.2 }}
      role="img"
      aria-label="Animated cartoon character in 1930s rubber hose style"
    >
      <Image
        src={sprite}
        alt="Cartoon character"
        fill
        className="object-contain"
        style={{ filter: 'brightness(1.1) contrast(1.5) sepia(0.8) saturate(0.3)' }}
      />
      {/* Pie eyes effect - classic 1930s look */}
      <div
        className={`absolute -top-1 left-1/2 -translate-x-1/2 flex gap-2 ${reducedMotion ? '' : 'cuphead-wiggle'}`}
        aria-hidden="true"
      >
        <div className="w-3 h-3 rounded-full" style={{ background: CUPHEAD_COLORS.inkBlack }} />
        <div className="w-3 h-3 rounded-full" style={{ background: CUPHEAD_COLORS.inkBlack }} />
      </div>
      {/* Musical notes floating up */}
      {!reducedMotion && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-lg cuphead-float-up" aria-hidden="true">
          ♪
        </div>
      )}
    </div>
  )
}

// ============================================================================
// COMPONENT: Vintage Ornaments (profession-specific decorations)
// ============================================================================
function VintageOrnaments({ profession }: { profession: 'engineer' | 'drummer' | 'fighter' }) {
  const reducedMotion = usePrefersReducedMotion()

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
    <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden" aria-hidden="true">
      {items.map((item, i) => (
        <div
          key={i}
          className={`absolute ${reducedMotion ? '' : 'cuphead-bob'}`}
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            fontSize: item.size,
            opacity: 0.35,
            filter: 'sepia(0.8) contrast(1.2)',
            animationDelay: reducedMotion ? '0s' : `${-i * 0.5}s`,
          }}
        >
          {item.icon}
        </div>
      ))}
    </div>
  )
}

// ============================================================================
// COMPONENT: Splash Reveal Section (ink splat animation on scroll)
// ============================================================================
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
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (hasEntered && phase === 'hidden') {
      if (reducedMotion) {
        setPhase('revealed')
      } else {
        setPhase('splashing')
        setTimeout(() => setPhase('revealed'), 500)
      }
    }
  }, [hasEntered, phase, reducedMotion])

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {/* Ink splash animation */}
      {phase === 'splashing' && !reducedMotion && (
        <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center" aria-hidden="true">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full cuphead-ink-splash"
              style={{
                left: `${30 + i * 8}%`,
                top: `${40 + (i % 3) * 10}%`,
                width: 20 + i * 5,
                height: 20 + i * 5,
                background: CUPHEAD_COLORS.inkBlack,
                animationDelay: `${i * 0.05}s`,
              }}
            />
          ))}
          <div className="absolute text-4xl cuphead-pop-in" style={{ color: CUPHEAD_COLORS.accentGold }}>
            ✦
          </div>
        </div>
      )}

      <div
        style={{
          opacity: phase === 'revealed' ? 1 : 0,
          transform: phase === 'revealed' ? 'scale(1)' : 'scale(0.9)',
          transition: reducedMotion ? 'none' : 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {children}
      </div>
    </div>
  )
}

// ============================================================================
// COMPONENT: Film Reel Border with animated sprocket holes
// ============================================================================
function FilmReelBorder() {
  const reducedMotion = usePrefersReducedMotion()

  return (
    <>
      {/* Left film strip */}
      <div
        className="fixed left-0 top-0 bottom-0 w-12 z-[4] pointer-events-none"
        style={{ background: '#1a1510' }}
        role="presentation"
        aria-hidden="true"
      >
        <div className={`absolute inset-0 flex flex-col justify-start ${reducedMotion ? '' : 'cuphead-sprocket-scroll'}`}>
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 h-8 flex items-center justify-center">
              <div
                className="w-6 h-4 rounded-sm"
                style={{ background: '#0a0805', border: `1px solid ${CUPHEAD_COLORS.inkBlack}` }}
              />
            </div>
          ))}
        </div>
      </div>
      {/* Right film strip */}
      <div
        className="fixed right-0 top-0 bottom-0 w-12 z-[4] pointer-events-none"
        style={{ background: '#1a1510' }}
        role="presentation"
        aria-hidden="true"
      >
        <div className={`absolute inset-0 flex flex-col justify-start ${reducedMotion ? '' : 'cuphead-sprocket-scroll-reverse'}`}>
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 h-8 flex items-center justify-center">
              <div
                className="w-6 h-4 rounded-sm"
                style={{ background: '#0a0805', border: `1px solid ${CUPHEAD_COLORS.inkBlack}` }}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

// ============================================================================
// COMPONENT: Film Effects (grain, scratches, vignette, flicker)
// ============================================================================
function FilmEffects() {
  const [scratches, setScratches] = useState<Array<{ id: number; x: number; height: number; opacity: number }>>([])
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (reducedMotion) return

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
  }, [reducedMotion])

  return (
    <div aria-hidden="true">
      {/* Heavy film grain - authentic vintage look */}
      <div
        className={`fixed inset-0 pointer-events-none z-[8] opacity-[0.15] ${reducedMotion ? '' : 'cuphead-grain'}`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Watercolor paper texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-[6] opacity-[0.08]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='5'/%3E%3CfeDiffuseLighting in='noise' lighting-color='white' surfaceScale='2'%3E%3CfeDistantLight azimuth='45' elevation='60'/%3E%3C/feDiffuseLighting%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Sepia vignette - darker edges like old film */}
      <div
        className="fixed inset-0 pointer-events-none z-[7]"
        style={{
          background: `radial-gradient(circle at 50% 50%, transparent 20%, rgba(42, 32, 21, 0.5) 80%, rgba(42, 32, 21, 0.8) 100%)`,
        }}
      />

      {/* Film scratches */}
      {!reducedMotion && scratches.map((scratch) => (
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

      {/* Dust particles floating */}
      {!reducedMotion && (
        <div className="fixed inset-0 pointer-events-none z-[8] cuphead-dust">
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
      )}

      {/* Frame flicker - subtle brightness variation */}
      {!reducedMotion && (
        <div
          className="fixed inset-0 pointer-events-none z-[6] cuphead-flicker"
          style={{ background: 'rgba(0,0,0,0.05)' }}
        />
      )}
    </div>
  )
}

// ============================================================================
// COMPONENT: Floating Music Notes (jazz age decoration)
// ============================================================================
function FloatingMusicNotes() {
  const reducedMotion = usePrefersReducedMotion()

  const notes = useMemo(() => {
    const noteTypes = ['\u{266A}', '\u{266B}', '\u{266C}', '\u{2669}']
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: 10 + Math.random() * 80,
      y: 100 + Math.random() * 20,
      type: noteTypes[Math.floor(Math.random() * noteTypes.length)],
      delay: Math.random() * 8,
      duration: 12 + Math.random() * 6,
    }))
  }, [])

  if (reducedMotion) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[3] overflow-hidden" aria-hidden="true">
      {notes.map((note) => (
        <div
          key={note.id}
          className="absolute text-2xl cuphead-float-up"
          style={{
            left: `${note.x}%`,
            bottom: `-${note.y}px`,
            color: CUPHEAD_COLORS.inkBlack,
            opacity: 0.3,
            animationDelay: `${note.delay}s`,
            animationDuration: `${note.duration}s`,
            textShadow: `1px 1px 0 ${CUPHEAD_COLORS.shadowBrown}`,
          }}
        >
          {note.type}
        </div>
      ))}
    </div>
  )
}

// ============================================================================
// COMPONENT: Pie-Eye Blinking Face (classic 1930s cartoon character)
// ============================================================================
function PieEyeFace({ position, size = 60 }: { position: { x: number; y: number }; size?: number }) {
  const [isBlinking, setIsBlinking] = useState(false)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (reducedMotion) return

    const blinkInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setIsBlinking(true)
        setTimeout(() => setIsBlinking(false), 150)
      }
    }, 2000)
    return () => clearInterval(blinkInterval)
  }, [reducedMotion])

  return (
    <div
      className={`absolute pointer-events-none ${reducedMotion ? '' : 'cuphead-bob'}`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        width: size,
        height: size,
      }}
      role="img"
      aria-label="Decorative cartoon face with pie-cut eyes"
    >
      <svg viewBox="0 0 60 60" className="w-full h-full">
        {/* Face circle with hand-drawn wobble effect */}
        <circle
          cx="30"
          cy="30"
          r="28"
          fill={CUPHEAD_COLORS.paperCream}
          stroke={CUPHEAD_COLORS.inkBlack}
          strokeWidth="3"
          className={reducedMotion ? '' : 'cuphead-wobble-path'}
        />
        {/* Pie eyes - the signature 1930s look */}
        <ellipse
          cx="20"
          cy="25"
          rx="8"
          ry={isBlinking ? 1 : 10}
          fill={CUPHEAD_COLORS.inkBlack}
          className="transition-all duration-75"
        />
        <ellipse
          cx="40"
          cy="25"
          rx="8"
          ry={isBlinking ? 1 : 10}
          fill={CUPHEAD_COLORS.inkBlack}
          className="transition-all duration-75"
        />
        {/* Pie slices in eyes (the "pie-cut" look) */}
        {!isBlinking && (
          <>
            <path d="M20,15 L20,25 L12,25 Z" fill={CUPHEAD_COLORS.paperCream} />
            <path d="M40,15 L40,25 L32,25 Z" fill={CUPHEAD_COLORS.paperCream} />
          </>
        )}
        {/* Cheerful smile */}
        <path
          d="M15,40 Q30,50 45,40"
          fill="none"
          stroke={CUPHEAD_COLORS.inkBlack}
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Rosy cheeks (subtle) */}
        <circle cx="12" cy="35" r="4" fill={CUPHEAD_COLORS.accentRed} opacity="0.2" />
        <circle cx="48" cy="35" r="4" fill={CUPHEAD_COLORS.accentRed} opacity="0.2" />
      </svg>
    </div>
  )
}

// ============================================================================
// COMPONENT: Bouncing Ball with squash and stretch
// ============================================================================
function BouncingBall({ initialX, delay }: { initialX: number; delay: number }) {
  const reducedMotion = usePrefersReducedMotion()

  if (reducedMotion) return null

  return (
    <div
      className="absolute bottom-0 w-8 h-8 cuphead-bounce-squash pointer-events-none z-[2]"
      style={{
        left: `${initialX}%`,
        animationDelay: `${delay}s`,
      }}
      aria-hidden="true"
    >
      <div
        className="w-full h-full rounded-full"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${CUPHEAD_COLORS.inkSoft}, ${CUPHEAD_COLORS.inkBlack})`,
          boxShadow: `2px 2px 0 #1a1510`,
        }}
      />
    </div>
  )
}

// ============================================================================
// COMPONENT: Rubber Hose Arm decoration
// ============================================================================
function RubberHoseArm({ side, y }: { side: 'left' | 'right'; y: number }) {
  const reducedMotion = usePrefersReducedMotion()

  if (reducedMotion) return null

  return (
    <div
      className={`fixed ${side === 'left' ? 'left-16' : 'right-16'} pointer-events-none z-[2] cuphead-wave-arm`}
      style={{ top: `${y}%` }}
      aria-hidden="true"
    >
      <svg width="80" height="120" viewBox="0 0 80 120" className={side === 'right' ? 'scale-x-[-1]' : ''}>
        {/* Upper arm - rubber hose style (no joints, smooth curves) */}
        <path
          d="M10,0 Q30,20 20,40 Q10,60 25,80"
          fill="none"
          stroke={CUPHEAD_COLORS.inkBlack}
          strokeWidth="16"
          strokeLinecap="round"
        />
        {/* White glove - signature 1930s cartoon */}
        <circle cx="25" cy="90" r="20" fill={CUPHEAD_COLORS.paperCream} stroke={CUPHEAD_COLORS.inkBlack} strokeWidth="3" />
        {/* Glove fingers */}
        <ellipse cx="15" cy="105" rx="6" ry="10" fill={CUPHEAD_COLORS.paperCream} stroke={CUPHEAD_COLORS.inkBlack} strokeWidth="2" />
        <ellipse cx="30" cy="108" rx="6" ry="10" fill={CUPHEAD_COLORS.paperCream} stroke={CUPHEAD_COLORS.inkBlack} strokeWidth="2" />
        <ellipse cx="42" cy="100" rx="6" ry="10" fill={CUPHEAD_COLORS.paperCream} stroke={CUPHEAD_COLORS.inkBlack} strokeWidth="2" />
      </svg>
    </div>
  )
}

// ============================================================================
// COMPONENT: Ink Splash effect on hover
// ============================================================================
function InkSplash({ x, y }: { x: number; y: number }) {
  return (
    <div
      className="fixed pointer-events-none z-[50] cuphead-ink-splash"
      style={{ left: x - 40, top: y - 40 }}
      aria-hidden="true"
    >
      <svg width="80" height="80" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r="5" fill={CUPHEAD_COLORS.inkBlack} />
        <ellipse cx="25" cy="30" rx="8" ry="5" fill={CUPHEAD_COLORS.inkBlack} />
        <ellipse cx="55" cy="35" rx="6" ry="4" fill={CUPHEAD_COLORS.inkBlack} />
        <ellipse cx="35" cy="55" rx="7" ry="5" fill={CUPHEAD_COLORS.inkBlack} />
        <ellipse cx="50" cy="50" rx="5" ry="3" fill={CUPHEAD_COLORS.inkBlack} />
        <circle cx="20" cy="45" r="3" fill={CUPHEAD_COLORS.inkBlack} />
        <circle cx="60" cy="25" r="4" fill={CUPHEAD_COLORS.inkBlack} />
      </svg>
    </div>
  )
}

// ============================================================================
// COMPONENT: Cartoon Title with bouncing letters
// ============================================================================
function CartoonTitle({ text, subtitle }: { text: string; subtitle?: string }) {
  const reducedMotion = usePrefersReducedMotion()

  return (
    <div className="text-center" role="heading" aria-level={1}>
      <div className="flex justify-center gap-1 flex-wrap">
        {text.split('').map((char, i) => (
          <span
            key={i}
            className={`inline-block ${reducedMotion ? '' : 'cuphead-bounce-letter'}`}
            style={{
              animationDelay: reducedMotion ? '0s' : `${i * 0.05}s`,
              fontFamily: '"Abril Fatface", "Georgia", serif',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              color: CUPHEAD_COLORS.inkBlack,
              textShadow: `4px 4px 0 ${CUPHEAD_COLORS.shadowBrown}, 6px 6px 0 ${CUPHEAD_COLORS.shadowDark}`,
              // Hand-drawn wobble effect
              transform: reducedMotion ? 'none' : `rotate(${(i % 2 === 0 ? -1 : 1) * (Math.random() * 2)}deg)`,
            }}
          >
            {char === ' ' ? ' ' : char}
          </span>
        ))}
      </div>
      {subtitle && (
        <p
          className="mt-4 text-sm tracking-[0.2em]"
          style={{ color: CUPHEAD_COLORS.shadowDark, fontFamily: 'serif' }}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}

// ============================================================================
// COMPONENT: Cartoon Character Selection Card
// ============================================================================
function CartoonCharacter({
  profession,
  isActive,
  onClick,
}: {
  profession: 'engineer' | 'drummer' | 'fighter'
  isActive: boolean
  onClick: () => void
}) {
  const reducedMotion = usePrefersReducedMotion()
  const icons = { engineer: '⚙', drummer: '♫', fighter: '⚔' }
  const names = { engineer: 'THE ENGINEER', drummer: 'THE DRUMMER', fighter: 'THE FIGHTER' }
  const ariaLabels = {
    engineer: 'Select Engineer profession - Software development and architecture',
    drummer: 'Select Drummer profession - Professional music and bands',
    fighter: 'Select Fighter profession - Martial arts and instruction',
  }

  return (
    <button
      onClick={onClick}
      className={`relative transition-all group ${isActive ? 'scale-110' : 'hover:scale-105'}`}
      aria-label={ariaLabels[profession]}
      aria-pressed={isActive}
    >
      {/* Circular frame like vintage cartoon character selection */}
      <div
        className={`w-28 h-28 md:w-32 md:h-32 rounded-full flex items-center justify-center relative ${
          isActive && !reducedMotion ? 'cuphead-bounce-slow' : ''
        }`}
        style={{
          background: isActive ? CUPHEAD_COLORS.accentRedDark : CUPHEAD_COLORS.paperCream,
          border: `6px solid ${CUPHEAD_COLORS.inkBlack}`,
          boxShadow: isActive
            ? `0 8px 0 #5a0000, 0 10px 20px rgba(0,0,0,0.3)`
            : `0 4px 0 ${CUPHEAD_COLORS.shadowBrown}`,
        }}
      >
        {/* Inner ring decoration - like vintage badges */}
        <div
          className="absolute inset-2 rounded-full"
          style={{ border: `2px dashed ${CUPHEAD_COLORS.inkBlack}40` }}
        />
        <span
          className={`text-4xl md:text-5xl ${!reducedMotion ? 'group-hover:cuphead-wiggle' : ''}`}
          style={{ color: isActive ? CUPHEAD_COLORS.paperCream : CUPHEAD_COLORS.inkBlack }}
        >
          {icons[profession]}
        </span>
      </div>

      {/* Name banner - vintage title card style */}
      <div
        className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 whitespace-nowrap"
        style={{
          background: CUPHEAD_COLORS.inkBlack,
          color: CUPHEAD_COLORS.paperCream,
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

// ============================================================================
// COMPONENT: Decorative Banner with vintage curls
// ============================================================================
function DecorativeBanner({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative inline-block" role="heading" aria-level={2}>
      {/* Left decorative curl */}
      <svg className="absolute -left-10 top-1/2 -translate-y-1/2 w-10 h-20" viewBox="0 0 40 80" aria-hidden="true">
        <path
          d="M38,40 Q0,40 15,15 Q25,0 30,8 Q35,16 28,20 Q20,25 15,18"
          fill="none"
          stroke={CUPHEAD_COLORS.inkBlack}
          strokeWidth="4"
          strokeLinecap="round"
        />
        <circle cx="15" cy="18" r="3" fill={CUPHEAD_COLORS.accentRedDark} />
      </svg>
      <div
        className="px-8 py-3 relative"
        style={{
          background: CUPHEAD_COLORS.accentRedDark,
          border: `4px solid ${CUPHEAD_COLORS.inkBlack}`,
          color: CUPHEAD_COLORS.paperCream,
          fontFamily: '"Abril Fatface", serif',
          boxShadow: '4px 4px 0 #5a0000',
        }}
      >
        {children}
      </div>
      {/* Right decorative curl */}
      <svg className="absolute -right-10 top-1/2 -translate-y-1/2 w-10 h-20 scale-x-[-1]" viewBox="0 0 40 80" aria-hidden="true">
        <path
          d="M38,40 Q0,40 15,15 Q25,0 30,8 Q35,16 28,20 Q20,25 15,18"
          fill="none"
          stroke={CUPHEAD_COLORS.inkBlack}
          strokeWidth="4"
          strokeLinecap="round"
        />
        <circle cx="15" cy="18" r="3" fill={CUPHEAD_COLORS.accentRedDark} />
      </svg>
    </div>
  )
}

// ============================================================================
// COMPONENT: Role Ticket (vintage admission ticket style)
// ============================================================================
function RoleTicket({ role }: { role: typeof CURRENT_ROLES[0] }) {
  const reducedMotion = usePrefersReducedMotion()

  return (
    <article
      className={`relative px-6 py-3 ${reducedMotion ? '' : 'cuphead-wiggle'}`}
      style={{
        background: CUPHEAD_COLORS.paperDark,
        border: `3px solid ${CUPHEAD_COLORS.inkBlack}`,
        borderStyle: 'dashed',
        fontFamily: 'serif',
      }}
      aria-label={`${role.title} at ${role.company}`}
    >
      {/* Ticket stub perforations */}
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-8"
        style={{ background: CUPHEAD_COLORS.paperCream, borderRight: `2px dashed ${CUPHEAD_COLORS.inkBlack}` }}
        aria-hidden="true"
      />
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-8"
        style={{ background: CUPHEAD_COLORS.paperCream, borderLeft: `2px dashed ${CUPHEAD_COLORS.inkBlack}` }}
        aria-hidden="true"
      />

      <p className="text-xs tracking-wider" style={{ color: CUPHEAD_COLORS.accentRedDark }}>{role.title}</p>
      <p className="text-sm font-bold" style={{ color: CUPHEAD_COLORS.inkBlack }}>{role.company}</p>
    </article>
  )
}

// ============================================================================
// COMPONENT: Tech Stack Cloud (NO proficiency bars - shows impact instead)
// ============================================================================
function TechBubbleCloud({ categories }: { categories: ReturnType<typeof getEngineerSkills> }) {
  const reducedMotion = usePrefersReducedMotion()

  return (
    <div className="space-y-6" role="list" aria-label="Technical skills by category">
      {categories.map((category, catIdx) => (
        <div key={category.name} role="listitem">
          <h3
            className="text-xs tracking-widest mb-3 flex items-center gap-2"
            style={{ color: CUPHEAD_COLORS.accentRedDark, fontFamily: 'serif' }}
          >
            <span className="text-lg" aria-hidden="true">{category.icon}</span>
            -- {category.name.toUpperCase()} --
          </h3>
          <div className="flex flex-wrap gap-2" role="list">
            {category.items.map((tech, i) => (
              <span
                key={tech}
                className={`px-3 py-1 text-xs transition-all hover:scale-110 cursor-default ${reducedMotion ? '' : 'cuphead-pop-in'}`}
                style={{
                  animationDelay: reducedMotion ? '0s' : `${(catIdx * 0.1) + (i * 0.03)}s`,
                  background: CUPHEAD_COLORS.inkBlack,
                  color: CUPHEAD_COLORS.paperCream,
                  borderRadius: '20px',
                  boxShadow: '2px 2px 0 #1a1510',
                  fontFamily: 'serif',
                }}
                role="listitem"
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

// ============================================================================
// COMPONENT: Skills List (NO 1-5 BARS - shows achievements/impact)
// ============================================================================
function CartoonSkillsList({ categories, profession }: { categories: ReturnType<typeof getSkillsByProfession>; profession: 'drummer' | 'fighter' }) {
  const reducedMotion = usePrefersReducedMotion()

  // Achievement statements instead of proficiency bars
  const achievementsByProfession = {
    drummer: {
      'Rock/Metal': 'Headlined 30+ city national tour',
      'Progressive': 'Complex time signatures, polyrhythmic compositions',
      'Latin/Salsa': 'Traditional Afro-Cuban rhythms',
      'Jazz Fusion': 'Session work with jazz ensembles',
      'Funk/Soul': 'Tight pocket grooves, ghost note mastery',
      'Double Bass': 'High-speed precision technique',
      'Polyrhythms': '4 over 3, 5 over 4 independence',
      'Odd Time Signatures': '7/8, 11/8, metric modulation',
      'Ghost Notes': 'Dynamics control, nuanced playing',
      'Linear Drumming': 'Non-simultaneous limb patterns',
      'Studio Recording': 'Multiple album credits',
      'Live Touring': 'National tour experience',
      'Session Work': 'Cross-genre adaptability',
      'Music Production': 'DAW proficiency, drum programming',
    },
    fighter: {
      'Muay Thai (3 years)': 'Traditional 8-limb striking',
      'Brazilian Jiu-Jitsu (2 years)': 'Ground game fundamentals + submissions',
      'MMA (1 year)': 'Integrated striking and grappling',
      'Wrestling': 'Takedown defense and control',
      'Striking': 'Boxing, kicks, elbows, knees',
      'Clinch Work': 'Thai clinch, dirty boxing',
      'Ground Game': 'Sweeps, escapes, positioning',
      'Submissions': 'Chokes, joint locks, transitions',
      'Fundamentals Instruction': 'Teaching 3 classes weekly',
      'Competition Prep': 'Trained 20+ students to competition',
      'Self Defense': 'Practical application training',
      'Private Coaching': 'Personalized skill development',
    },
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" role="list" aria-label={`${profession} skills and achievements`}>
      {categories.map((category) => (
        <div key={category.name} role="listitem">
          <h3
            className="text-xs tracking-widest mb-3 flex items-center gap-2"
            style={{ color: CUPHEAD_COLORS.accentRedDark, fontFamily: 'serif' }}
          >
            <span className="text-lg" aria-hidden="true">{category.icon}</span>
            {category.name.toUpperCase()}
          </h3>
          <ul className="space-y-3">
            {category.skills.map((skill, i) => {
              const achievement = achievementsByProfession[profession][skill.name as keyof typeof achievementsByProfession[typeof profession]] || ''
              return (
                <li
                  key={skill.name}
                  className={`${reducedMotion ? '' : 'cuphead-pop-in'}`}
                  style={{ animationDelay: reducedMotion ? '0s' : `${i * 0.1}s` }}
                >
                  <div className="flex items-start gap-2">
                    <span
                      className="flex-shrink-0 mt-0.5"
                      style={{ color: CUPHEAD_COLORS.accentGold }}
                      aria-hidden="true"
                    >
                      ★
                    </span>
                    <div>
                      <span
                        className="text-sm font-semibold block"
                        style={{ color: CUPHEAD_COLORS.inkBlack, fontFamily: 'serif' }}
                      >
                        {skill.name}
                      </span>
                      {achievement && (
                        <span
                          className="text-xs block mt-0.5 italic"
                          style={{ color: CUPHEAD_COLORS.shadowDark }}
                        >
                          {achievement}
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </div>
  )
}

// ============================================================================
// COMPONENT: Company Poster (vintage advertisement style)
// ============================================================================
function CompanyPoster({ company }: { company: typeof COMPANIES[0] }) {
  const [showSplash, setShowSplash] = useState(false)
  const [splashPos, setSplashPos] = useState({ x: 0, y: 0 })
  const reducedMotion = usePrefersReducedMotion()

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (reducedMotion) return
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
          background: CUPHEAD_COLORS.paperDark,
          border: `4px solid ${CUPHEAD_COLORS.inkBlack}`,
          boxShadow: `4px 4px 0 ${CUPHEAD_COLORS.shadowBrown}`,
        }}
        onMouseEnter={handleMouseEnter}
        aria-label={`${company.name} - ${company.tagline}. Opens in new tab.`}
      >
        {/* Corner stars - vintage poster decoration */}
        {['-top-2 -left-2', '-top-2 -right-2', '-bottom-2 -left-2', '-bottom-2 -right-2'].map((pos, i) => (
          <span
            key={i}
            className={`absolute ${pos} text-lg`}
            style={{ color: CUPHEAD_COLORS.accentRedDark }}
            aria-hidden="true"
          >
            ★
          </span>
        ))}

        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl" aria-hidden="true">{company.icon}</span>
          <div>
            <h4
              className="text-sm font-bold group-hover:text-red-800 transition-colors"
              style={{ color: CUPHEAD_COLORS.inkBlack, fontFamily: 'serif' }}
            >
              {company.name}
            </h4>
            <p className="text-[10px]" style={{ color: CUPHEAD_COLORS.accentRedDark }}>{company.tagline}</p>
          </div>
        </div>
        <p className="text-xs" style={{ color: CUPHEAD_COLORS.shadowDark, fontFamily: 'serif' }}>{company.description}</p>
      </a>
    </>
  )
}

// ============================================================================
// COMPONENT: Band Record (vinyl record label style)
// ============================================================================
function BandRecord({ band }: { band: typeof BANDS[0] }) {
  const [showSplash, setShowSplash] = useState(false)
  const [splashPos, setSplashPos] = useState({ x: 0, y: 0 })
  const reducedMotion = usePrefersReducedMotion()

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (reducedMotion) return
    setSplashPos({ x: e.clientX, y: e.clientY })
    setShowSplash(true)
    setTimeout(() => setShowSplash(false), 400)
  }

  const content = (
    <article
      className={`p-4 relative group transition-all hover:scale-[1.02] ${!reducedMotion ? 'hover:rotate-1' : ''}`}
      style={{
        background: CUPHEAD_COLORS.paperDark,
        border: `4px solid ${CUPHEAD_COLORS.inkBlack}`,
        boxShadow: `4px 4px 0 ${CUPHEAD_COLORS.shadowBrown}`,
      }}
      onMouseEnter={handleMouseEnter}
    >
      {/* Vinyl record decoration */}
      <div
        className="absolute -top-3 -right-3 w-12 h-12 rounded-full flex items-center justify-center"
        style={{ background: CUPHEAD_COLORS.inkBlack }}
        aria-hidden="true"
      >
        <div className="w-4 h-4 rounded-full" style={{ background: CUPHEAD_COLORS.accentRedDark }} />
      </div>

      <h4
        className="text-sm font-bold group-hover:text-red-800 transition-colors"
        style={{ color: CUPHEAD_COLORS.inkBlack, fontFamily: 'serif' }}
      >
        ♫ {band.name}
      </h4>
      <p className="text-[10px] mt-1" style={{ color: CUPHEAD_COLORS.accentRedDark }}>{band.genre} • {band.role}</p>
      <p className="text-xs mt-2" style={{ color: CUPHEAD_COLORS.shadowDark, fontFamily: 'serif' }}>{band.description}</p>
      {!band.url && (
        <p className="text-[10px] mt-2 italic" style={{ color: CUPHEAD_COLORS.shadowDark }}>~ Website coming soon ~</p>
      )}
    </article>
  )

  return (
    <>
      {showSplash && <InkSplash x={splashPos.x} y={splashPos.y} />}
      {band.url ? (
        <a
          href={band.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
          aria-label={`${band.name} - ${band.genre}. Opens in new tab.`}
        >
          {content}
        </a>
      ) : (
        content
      )}
    </>
  )
}

// ============================================================================
// COMPONENT: Experience Card (vintage ticket/poster style)
// ============================================================================
function ExperienceCard({ entry }: { entry: typeof EXPERIENCE_DATA[0] }) {
  const endDisplay = entry.endDate ? new Date(entry.endDate).getFullYear() : 'Present'
  const startDisplay = new Date(entry.startDate).getFullYear()

  return (
    <article
      className="p-4 relative"
      style={{
        background: CUPHEAD_COLORS.paperDark,
        border: `4px solid ${CUPHEAD_COLORS.inkBlack}`,
        boxShadow: `4px 4px 0 ${CUPHEAD_COLORS.shadowBrown}`,
      }}
      aria-label={`${entry.title} at ${entry.organization}, ${startDisplay} to ${endDisplay}`}
    >
      {/* Corner decorations - art deco style */}
      <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2" style={{ borderColor: CUPHEAD_COLORS.accentRedDark }} aria-hidden="true" />
      <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2" style={{ borderColor: CUPHEAD_COLORS.accentRedDark }} aria-hidden="true" />
      <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2" style={{ borderColor: CUPHEAD_COLORS.accentRedDark }} aria-hidden="true" />
      <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2" style={{ borderColor: CUPHEAD_COLORS.accentRedDark }} aria-hidden="true" />

      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="text-sm font-bold" style={{ color: CUPHEAD_COLORS.inkBlack, fontFamily: 'serif' }}>
            {entry.title}
          </h4>
          <p className="text-xs" style={{ color: CUPHEAD_COLORS.accentRedDark, fontFamily: 'serif' }}>
            {entry.organization}
          </p>
        </div>
        <span
          className="text-[10px] px-2 py-1"
          style={{
            background: CUPHEAD_COLORS.inkBlack,
            color: CUPHEAD_COLORS.paperCream,
            fontFamily: 'serif',
          }}
        >
          {startDisplay} - {endDisplay}
        </span>
      </div>
      <p className="text-xs mb-2" style={{ color: CUPHEAD_COLORS.shadowDark, fontFamily: 'serif' }}>
        {entry.description}
      </p>
      {entry.highlights && entry.highlights.length > 0 && (
        <ul className="space-y-1">
          {entry.highlights.map((highlight, i) => (
            <li
              key={i}
              className="text-xs flex items-start gap-2"
              style={{ color: CUPHEAD_COLORS.inkBlack, fontFamily: 'serif' }}
            >
              <span style={{ color: CUPHEAD_COLORS.accentGold }} aria-hidden="true">★</span>
              {highlight}
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

// ============================================================================
// COMPONENT: Project Poster (vintage movie/show poster style)
// ============================================================================
function VintagePoster({ project }: { project: typeof PROJECTS_DATA[0] }) {
  const reducedMotion = usePrefersReducedMotion()

  return (
    <article
      className={`p-4 relative group cursor-pointer transition-all hover:scale-[1.02] ${!reducedMotion ? 'hover:-rotate-1' : ''}`}
      style={{
        background: CUPHEAD_COLORS.paperDark,
        border: `4px solid ${CUPHEAD_COLORS.inkBlack}`,
        boxShadow: `4px 4px 0 ${CUPHEAD_COLORS.shadowBrown}`,
      }}
      aria-label={`${project.name}: ${project.tagline}${project.impact ? `. Impact: ${project.impact}` : ''}`}
    >
      {/* Corner decorations */}
      <div className="absolute top-1 left-1 w-4 h-4 border-t-2 border-l-2" style={{ borderColor: CUPHEAD_COLORS.accentRedDark }} aria-hidden="true" />
      <div className="absolute top-1 right-1 w-4 h-4 border-t-2 border-r-2" style={{ borderColor: CUPHEAD_COLORS.accentRedDark }} aria-hidden="true" />
      <div className="absolute bottom-1 left-1 w-4 h-4 border-b-2 border-l-2" style={{ borderColor: CUPHEAD_COLORS.accentRedDark }} aria-hidden="true" />
      <div className="absolute bottom-1 right-1 w-4 h-4 border-b-2 border-r-2" style={{ borderColor: CUPHEAD_COLORS.accentRedDark }} aria-hidden="true" />

      {project.featured && (
        <span
          className="text-[8px] tracking-wider"
          style={{ color: CUPHEAD_COLORS.accentGold }}
        >
          ★ FEATURED ★
        </span>
      )}
      <h3 className="text-sm font-bold mt-1" style={{ color: CUPHEAD_COLORS.accentRedDark, fontFamily: 'serif' }}>
        {project.name.toUpperCase()}
      </h3>
      <p className="text-[10px] mb-2" style={{ color: CUPHEAD_COLORS.shadowDark }}>
        {project.tagline}
      </p>
      {project.impact && (
        <p
          className="text-[10px] mb-2 italic px-2 py-1 rounded"
          style={{
            color: CUPHEAD_COLORS.inkBlack,
            background: `${CUPHEAD_COLORS.accentGold}30`,
            border: `1px solid ${CUPHEAD_COLORS.accentGold}50`,
          }}
        >
          → {project.impact}
        </p>
      )}
      <div className="flex gap-1 flex-wrap">
        {project.techStack.slice(0, 4).map((tech) => (
          <span
            key={tech}
            className="text-[8px] px-2 py-0.5 rounded-full"
            style={{
              background: CUPHEAD_COLORS.inkBlack,
              color: CUPHEAD_COLORS.paperCream,
            }}
          >
            {tech}
          </span>
        ))}
      </div>
    </article>
  )
}

// ============================================================================
// MAIN COMPONENT: RubberHoseTheme (Cuphead Gameplay Style)
// ============================================================================
export default function RubberHoseTheme() {
  const { active, setActive } = useProfession()
  const [mounted, setMounted] = useState(false)
  const reducedMotion = usePrefersReducedMotion()

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
        // Cuphead-style warm paper gradient background
        background: `linear-gradient(to bottom, ${CUPHEAD_COLORS.paperCream}, ${CUPHEAD_COLORS.paperSepia})`,
        fontFamily: '"Courier New", monospace',
      }}
      role="main"
      aria-label="Portfolio in 1930s Cuphead cartoon style"
    >
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2"
        style={{ background: CUPHEAD_COLORS.inkBlack, color: CUPHEAD_COLORS.paperCream }}
      >
        Skip to main content
      </a>

      {/* Film reel borders */}
      <FilmReelBorder />

      {/* Profession-specific ornaments */}
      <VintageOrnaments profession={active} />

      {/* Film effects (grain, scratches, vignette) */}
      <FilmEffects />

      {/* Floating music notes - jazz age atmosphere */}
      <FloatingMusicNotes />

      {/* Pie-eye face decorations */}
      <PieEyeFace position={{ x: 5, y: 20 }} size={50} />
      <PieEyeFace position={{ x: 90, y: 70 }} size={40} />

      {/* Bouncing balls - classic cartoon element */}
      <BouncingBall initialX={15} delay={0} />
      <BouncingBall initialX={45} delay={0.5} />
      <BouncingBall initialX={75} delay={1} />

      {/* Rubber hose arms waving */}
      <RubberHoseArm side="left" y={40} />
      <RubberHoseArm side="right" y={60} />

      {/* Decorative border frame - art deco style */}
      <div
        className="fixed inset-4 left-16 right-16 pointer-events-none z-[5]"
        style={{ border: `8px double ${CUPHEAD_COLORS.inkBlack}` }}
        aria-hidden="true"
      />

      {/* Main content area with padding for film strips */}
      <div className="ml-14 mr-14">
        {/* Header */}
        <header className="relative z-30 p-6">
          <div className="max-w-6xl mx-auto flex justify-between items-start">
            <div>
              <CartoonTitle
                text="ALEXANDER PULIDO"
                subtitle={PROFESSIONAL_SUMMARY.headline}
              />
              <p
                className="text-xs tracking-widest mt-2 italic"
                style={{ color: CUPHEAD_COLORS.accentRedDark, fontFamily: 'serif' }}
              >
                &quot;{PROFESSIONAL_SUMMARY.tagline}&quot;
              </p>
            </div>

            <nav className="flex gap-3 items-center flex-wrap" aria-label="Main navigation">
              <Link
                href="/cv"
                className="px-4 py-2 text-sm tracking-wider transition-all hover:scale-105 hover:rotate-1"
                style={{
                  background: CUPHEAD_COLORS.inkBlack,
                  color: CUPHEAD_COLORS.paperCream,
                  border: `3px solid ${CUPHEAD_COLORS.inkBlack}`,
                  fontFamily: 'serif',
                  boxShadow: '3px 3px 0 #1a1510',
                }}
              >
                RESUME
              </Link>
              <Link
                href="/personal-projects/game-engine"
                className="px-4 py-2 text-sm tracking-wider transition-all hover:scale-105 hover:-rotate-1"
                style={{
                  background: CUPHEAD_COLORS.accentRedDark,
                  color: CUPHEAD_COLORS.paperCream,
                  border: `3px solid ${CUPHEAD_COLORS.inkBlack}`,
                  fontFamily: 'serif',
                  boxShadow: '3px 3px 0 #5a0000',
                }}
              >
                PLAY GAME
              </Link>
              <ThemeSwitcher />
            </nav>
          </div>
        </header>

        {/* Current Roles */}
        <section className="relative z-20 py-4" aria-labelledby="roles-heading">
          <h2 id="roles-heading" className="sr-only">Current Professional Roles</h2>
          <div className="flex justify-center gap-4 flex-wrap">
            {CURRENT_ROLES.map((role, i) => (
              <div key={role.id} style={{ animationDelay: `${i * 0.1}s` }}>
                <RoleTicket role={role} />
              </div>
            ))}
          </div>
        </section>

        {/* Character/Profession selection */}
        <section className="relative z-20 py-8" aria-labelledby="profession-heading">
          <div className="text-center mb-6">
            <h2 id="profession-heading" className="text-xs tracking-widest" style={{ color: CUPHEAD_COLORS.shadowDark, fontFamily: 'serif' }}>
              ~ SELECT YOUR ADVENTURE ~
            </h2>
          </div>
          <div className="flex justify-center gap-8 md:gap-12 flex-wrap" role="radiogroup" aria-label="Select profession">
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
        <main id="main-content" className="relative z-20 px-4 md:px-8 py-8">
          <div className="max-w-4xl mx-auto">
            {/* About section */}
            <section className="text-center mb-12" aria-labelledby="about-heading">
              <DecorativeBanner>
                <span id="about-heading" className="text-lg tracking-wider">ABOUT</span>
              </DecorativeBanner>
              <p
                className="mt-8 text-sm leading-relaxed max-w-2xl mx-auto"
                style={{ color: CUPHEAD_COLORS.inkBlack, fontFamily: 'serif' }}
              >
                {aboutData.bio}
              </p>
            </section>

            {/* Quick facts as film reel frames */}
            <section className="mb-12" aria-labelledby="facts-heading">
              <h2 id="facts-heading" className="sr-only">Quick Facts</h2>
              <div className="flex justify-center gap-3 flex-wrap" role="list">
                {aboutData.quickFacts.map((fact, i) => (
                  <div
                    key={i}
                    className={`px-4 py-2 ${reducedMotion ? '' : 'cuphead-wiggle'}`}
                    style={{
                      animationDelay: reducedMotion ? '0s' : `${i * 0.2}s`,
                      background: CUPHEAD_COLORS.inkBlack,
                      color: CUPHEAD_COLORS.paperCream,
                      fontFamily: 'serif',
                      fontSize: '0.75rem',
                      transform: `rotate(${(i % 2 === 0 ? -2 : 2)}deg)`,
                      boxShadow: '2px 2px 0 #1a1510',
                    }}
                    role="listitem"
                  >
                    ✦ {fact} ✦
                  </div>
                ))}
              </div>
            </section>

            {/* Work Experience */}
            {experience.length > 0 && (
              <section className="mb-12" aria-labelledby="experience-heading">
                <div className="text-center mb-6">
                  <DecorativeBanner>
                    <span id="experience-heading" className="text-lg tracking-wider">WORK EXPERIENCE</span>
                  </DecorativeBanner>
                </div>
                <div className="space-y-4 max-w-3xl mx-auto">
                  {experience.map((entry) => (
                    <ExperienceCard key={entry.id} entry={entry} />
                  ))}
                </div>
              </section>
            )}

            {/* Tech Stack / Skills section - NO PROFICIENCY BARS */}
            <section className="mb-12" aria-labelledby="skills-heading">
              <div className="text-center mb-6">
                <DecorativeBanner>
                  <span id="skills-heading" className="text-lg tracking-wider">
                    {active === 'engineer' ? 'TECH STACK' : 'SKILLS & ACHIEVEMENTS'}
                  </span>
                </DecorativeBanner>
              </div>
              <div
                className="p-6 max-w-3xl mx-auto"
                style={{
                  background: CUPHEAD_COLORS.paperDark,
                  border: `4px solid ${CUPHEAD_COLORS.inkBlack}`,
                  boxShadow: `6px 6px 0 ${CUPHEAD_COLORS.shadowBrown}`,
                }}
              >
                {active === 'engineer' ? (
                  <TechBubbleCloud categories={engineerSkills} />
                ) : (
                  <CartoonSkillsList categories={otherSkills} profession={active as 'drummer' | 'fighter'} />
                )}
              </div>
            </section>

            {/* Projects with impact statements */}
            <section className="mb-12" aria-labelledby="projects-heading">
              <div className="text-center mb-6">
                <DecorativeBanner>
                  <span id="projects-heading" className="text-lg tracking-wider">PROJECTS</span>
                </DecorativeBanner>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {projects.filter(p => p.featured).slice(0, 6).map((project) => (
                  <VintagePoster key={project.id} project={project} />
                ))}
              </div>
            </section>

            {/* Companies (Engineer mode) */}
            {active === 'engineer' && (
              <section className="mb-12" aria-labelledby="companies-heading">
                <div className="text-center mb-6">
                  <DecorativeBanner>
                    <span id="companies-heading" className="text-lg tracking-wider">COMPANIES</span>
                  </DecorativeBanner>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  {COMPANIES.map((company) => (
                    <CompanyPoster key={company.id} company={company} />
                  ))}
                </div>
              </section>
            )}

            {/* Bands (Drummer mode) */}
            {active === 'drummer' && (
              <section className="mb-12" aria-labelledby="bands-heading">
                <div className="text-center mb-6">
                  <DecorativeBanner>
                    <span id="bands-heading" className="text-lg tracking-wider">BANDS</span>
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
            <div className="w-16 h-0.5" style={{ background: CUPHEAD_COLORS.inkBlack }} aria-hidden="true" />
            <p
              className="text-xs tracking-widest"
              style={{ color: CUPHEAD_COLORS.shadowDark, fontFamily: 'serif' }}
            >
              ✦ A PRESENTATION IN GLORIOUS SEPIA ✦ MCMXXVI
            </p>
            <div className="w-16 h-0.5" style={{ background: CUPHEAD_COLORS.inkBlack }} aria-hidden="true" />
          </div>
        </footer>
      </div>

      {/* ================================================================== */}
      {/* CUPHEAD-STYLE CSS ANIMATIONS                                      */}
      {/* ================================================================== */}
      <style jsx global>{`
        /* Film grain animation - faster for authentic look */
        @keyframes cuphead-grain {
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

        /* 1930s film flicker effect */
        @keyframes cuphead-flicker {
          0%, 100% { opacity: 0; }
          8% { opacity: 0.15; }
          9% { opacity: 0; }
          12% { opacity: 0.1; }
          13% { opacity: 0; }
          50% { opacity: 0; }
          51% { opacity: 0.08; }
          52% { opacity: 0; }
        }

        /* Sprocket hole scrolling */
        @keyframes cuphead-sprocket {
          0% { transform: translateY(0); }
          100% { transform: translateY(-256px); }
        }

        @keyframes cuphead-sprocket-reverse {
          0% { transform: translateY(-256px); }
          100% { transform: translateY(0); }
        }

        /* Floating up animation for music notes */
        @keyframes cuphead-float {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.3; }
          90% { opacity: 0.3; }
          100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }

        /* Bobbing animation - classic cartoon idle */
        @keyframes cuphead-bob {
          0%, 100% { transform: translateY(0) rotate(-5deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }

        /* Squash and stretch bounce */
        @keyframes cuphead-bounce-squash {
          0% { transform: translateY(0) scaleY(1) scaleX(1); }
          25% { transform: translateY(-100px) scaleY(1.2) scaleX(0.9); }
          50% { transform: translateY(0) scaleY(0.8) scaleX(1.2); }
          75% { transform: translateY(-50px) scaleY(1.1) scaleX(0.95); }
          100% { transform: translateY(0) scaleY(1) scaleX(1); }
        }

        /* Waving arm animation */
        @keyframes cuphead-wave {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(10deg); }
        }

        /* Ink splash burst */
        @keyframes cuphead-ink {
          0% { transform: scale(0); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.8; }
          100% { transform: scale(2); opacity: 0; }
        }

        /* Bouncing letter animation */
        @keyframes cuphead-letter-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        /* Slow bounce for active states */
        @keyframes cuphead-slow-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        /* Wiggle animation - constant slight movement */
        @keyframes cuphead-wiggle {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
        }

        /* Pop in animation for elements appearing */
        @keyframes cuphead-pop {
          0% { transform: scale(0); opacity: 0; }
          70% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }

        /* Dust particle floating */
        @keyframes cuphead-dust-float {
          0%, 100% { opacity: 0.1; transform: translateY(0); }
          50% { opacity: 0.2; transform: translateY(-20px); }
        }

        /* Hand-drawn wobble for SVG paths */
        @keyframes cuphead-wobble-path {
          0%, 100% { filter: url('#wobble'); }
        }

        /* Animation classes */
        .cuphead-grain {
          animation: cuphead-grain 0.3s steps(10) infinite;
        }

        .cuphead-flicker {
          animation: cuphead-flicker 2s ease-in-out infinite;
        }

        .cuphead-sprocket-scroll {
          animation: cuphead-sprocket 4s linear infinite;
        }

        .cuphead-sprocket-scroll-reverse {
          animation: cuphead-sprocket-reverse 4s linear infinite;
        }

        .cuphead-float-up {
          animation: cuphead-float 15s linear infinite;
        }

        .cuphead-bob {
          animation: cuphead-bob 3s ease-in-out infinite;
        }

        .cuphead-bounce-squash {
          animation: cuphead-bounce-squash 2s ease-in-out infinite;
        }

        .cuphead-wave-arm {
          animation: cuphead-wave 2s ease-in-out infinite;
        }

        .cuphead-ink-splash {
          animation: cuphead-ink 0.4s ease-out forwards;
        }

        .cuphead-bounce-letter {
          animation: cuphead-letter-bounce 0.6s ease-in-out infinite;
        }

        .cuphead-bounce-slow {
          animation: cuphead-slow-bounce 0.8s ease-in-out infinite;
        }

        .cuphead-wiggle {
          animation: cuphead-wiggle 0.5s ease-in-out infinite;
        }

        .cuphead-pop-in {
          animation: cuphead-pop 0.3s ease-out forwards;
          opacity: 0;
        }

        .cuphead-dust {
          animation: cuphead-dust-float 4s ease-in-out infinite;
        }

        /* Hover states with wiggle */
        .group-hover\\:cuphead-wiggle:hover {
          animation: cuphead-wiggle 0.3s ease-in-out infinite;
        }

        /* Respect reduced motion preference */
        @media (prefers-reduced-motion: reduce) {
          .cuphead-grain,
          .cuphead-flicker,
          .cuphead-sprocket-scroll,
          .cuphead-sprocket-scroll-reverse,
          .cuphead-float-up,
          .cuphead-bob,
          .cuphead-bounce-squash,
          .cuphead-wave-arm,
          .cuphead-ink-splash,
          .cuphead-bounce-letter,
          .cuphead-bounce-slow,
          .cuphead-wiggle,
          .cuphead-pop-in,
          .cuphead-dust {
            animation: none !important;
          }

          .cuphead-pop-in {
            opacity: 1 !important;
          }
        }

        /* Screen reader only class */
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }

        .focus\\:not-sr-only:focus {
          position: static;
          width: auto;
          height: auto;
          padding: 0;
          margin: 0;
          overflow: visible;
          clip: auto;
          white-space: normal;
        }
      `}</style>
    </div>
  )
}
