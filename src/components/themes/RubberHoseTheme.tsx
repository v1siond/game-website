'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useProfession } from '@/contexts/ProfessionContext'
import { ProfessionSwitch, type ProfessionOption } from '@/components/cv/ProfessionSwitch'
import { useCVData, useWorldView } from '@/components/cv/CVDataProvider'
import { RecruiterHero, type HeroActionSlot } from '@/components/cv/RecruiterHero'
import { ProjectList, type ProjectSlot } from '@/components/cv/ProjectList'
import { BandList, type BandSlot } from '@/components/cv/BandList'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import type { Profession } from '@/lib/cv/professions'
import type { CVData, Job } from '@/lib/cv/content'
import type { SectionsOf } from '@/lib/cv/cvView'
import { ProfessionSectionsView, type ProfessionSectionViews } from '@/components/cv/ProfessionSectionsView'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { jobYears } from '@/components/cv/sectionText'

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
  const reducedMotion = useReducedMotion()

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
  const reducedMotion = useReducedMotion()

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
// COMPONENT: Film Reel Border with animated sprocket holes
// ============================================================================
function FilmReelBorder() {
  const reducedMotion = useReducedMotion()

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
  const reducedMotion = useReducedMotion()

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
  const reducedMotion = useReducedMotion()

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
  const reducedMotion = useReducedMotion()

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
  const reducedMotion = useReducedMotion()

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
  const reducedMotion = useReducedMotion()

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
  const reducedMotion = useReducedMotion()

  return (
    <div className="text-center">
      <h1 className="sr-only">{text}</h1>
      <div className="flex justify-center gap-1 flex-wrap" aria-hidden="true">
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
// COMPONENT: Cartoon Character Selection Card, one option of the shared profession switch
// ============================================================================
const CARTOON_ICONS: Record<Profession, string> = {
  drummer: '♫',
  engineer: '⚙',
  fighter: '⚔',
}

function CartoonCharacter({ id, label, selected, optionProps }: ProfessionOption) {
  const reducedMotion = useReducedMotion()

  return (
    <button
      type="button"
      {...optionProps}
      className={`relative pb-6 transition-all group ${selected ? 'scale-110' : 'hover:scale-105'}`}
    >
      {/* Circular frame like vintage cartoon character selection */}
      <div
        className={`w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 mx-auto rounded-full flex items-center justify-center relative ${
          selected && !reducedMotion ? 'cuphead-bounce-slow' : ''
        }`}
        style={{
          background: selected ? CUPHEAD_COLORS.accentRedDark : CUPHEAD_COLORS.paperCream,
          border: `6px solid ${CUPHEAD_COLORS.inkBlack}`,
          boxShadow: selected
            ? `0 8px 0 #5a0000, 0 10px 20px rgba(0,0,0,0.3)`
            : `0 4px 0 ${CUPHEAD_COLORS.shadowBrown}`,
        }}
      >
        {/* Inner ring decoration - like vintage badges */}
        <div
          className="absolute inset-2 rounded-full"
          style={{ border: `2px dashed ${CUPHEAD_COLORS.inkBlack}40` }}
          aria-hidden="true"
        />
        <span
          className={`text-3xl sm:text-4xl md:text-5xl ${!reducedMotion ? 'group-hover:cuphead-wiggle' : ''}`}
          style={{ color: selected ? CUPHEAD_COLORS.paperCream : CUPHEAD_COLORS.inkBlack }}
          aria-hidden="true"
        >
          {CARTOON_ICONS[id]}
        </span>
      </div>

      {/* Name banner - vintage title card style */}
      <span
        className="absolute bottom-0 left-1/2 px-2 sm:px-3 py-1 text-sm whitespace-nowrap uppercase"
        style={{
          background: CUPHEAD_COLORS.inkBlack,
          color: CUPHEAD_COLORS.paperCream,
          fontFamily: '"Abril Fatface", serif',
          letterSpacing: '0.05em',
          transform: 'translateX(-50%) rotate(-3deg)',
        }}
      >
        {label}
      </span>
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
// COMPONENT: Tech Stack Cloud
// ============================================================================
function TechBubbleCloud({ categories }: { categories: CVData['techStack'] }) {
  const reducedMotion = useReducedMotion()

  return (
    <div className="space-y-6">
      {categories.map((category, catIdx) => (
        <div key={category.id}>
          <h3
            className="text-sm tracking-widest mb-3 flex items-center gap-2"
            style={{ color: CUPHEAD_COLORS.accentRedDark, fontFamily: 'serif' }}
          >
            <span className="text-lg" aria-hidden="true">{category.icon}</span>
            <span aria-hidden="true">--</span> {category.name.toUpperCase()} <span aria-hidden="true">--</span>
          </h3>
          <ul className="flex flex-wrap gap-2" aria-label={`${category.name} technologies`}>
            {category.items.map((tech, i) => (
              <li
                key={tech}
                className={`px-3 py-1 text-sm transition-all hover:scale-110 cursor-default ${reducedMotion ? '' : 'cuphead-pop-in'}`}
                style={{
                  animationDelay: reducedMotion ? '0s' : `${(catIdx * 0.1) + (i * 0.03)}s`,
                  background: CUPHEAD_COLORS.inkBlack,
                  color: CUPHEAD_COLORS.paperCream,
                  borderRadius: '20px',
                  boxShadow: '2px 2px 0 #1a1510',
                  fontFamily: 'serif',
                }}
              >
                {tech}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

// The ink splash a poster throws when the pointer lands on it.
function useInkSplash() {
  const [splash, setSplash] = useState<{ x: number; y: number } | null>(null)
  const reducedMotion = useReducedMotion()

  const onMouseEnter = (e: React.MouseEvent) => {
    if (reducedMotion) return
    setSplash({ x: e.clientX, y: e.clientY })
    setTimeout(() => setSplash(null), 400)
  }

  return { splash, onMouseEnter }
}

const POSTER_STYLE: React.CSSProperties = {
  background: CUPHEAD_COLORS.paperDark,
  border: `4px solid ${CUPHEAD_COLORS.inkBlack}`,
  boxShadow: `4px 4px 0 ${CUPHEAD_COLORS.shadowBrown}`,
}

// ============================================================================
// COMPONENT: Company Poster (vintage advertisement style)
// ============================================================================
function CompanyPoster({ company }: { company: CVData['companies'][number] }) {
  const { splash, onMouseEnter } = useInkSplash()

  return (
    <>
      {splash && <InkSplash x={splash.x} y={splash.y} />}
      <a
        href={company.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full p-4 relative group transition-all hover:scale-[1.02]"
        style={POSTER_STYLE}
        onMouseEnter={onMouseEnter}
        aria-label={`${company.name}: ${company.tagline} (opens in a new tab)`}
      >
        {/* Corner stars - vintage poster decoration */}
        {['-top-2 -left-2', '-top-2 -right-2', '-bottom-2 -left-2', '-bottom-2 -right-2'].map((pos) => (
          <span
            key={pos}
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
            <h3
              className="text-base font-bold group-hover:text-red-800 transition-colors"
              style={{ color: CUPHEAD_COLORS.inkBlack, fontFamily: 'serif' }}
            >
              {company.name}
            </h3>
            <p className="text-sm" style={{ color: CUPHEAD_COLORS.accentRedDark }}>{company.tagline}</p>
          </div>
        </div>
        <p className="text-sm" style={{ color: CUPHEAD_COLORS.inkBlack, fontFamily: 'serif' }}>{company.description}</p>
      </a>
    </>
  )
}

// ============================================================================
// COMPONENT: Band Record (vinyl record label style): his role, the years and the release
// ============================================================================
function BandRecord({ band, years, linkProps }: BandSlot) {
  const reducedMotion = useReducedMotion()
  const { splash, onMouseEnter } = useInkSplash()

  const content = (
    <article
      className={`h-full p-4 relative group transition-all hover:scale-[1.02] ${!reducedMotion ? 'hover:rotate-1' : ''}`}
      style={POSTER_STYLE}
      onMouseEnter={onMouseEnter}
    >
      {/* Vinyl record decoration */}
      <div
        className="absolute -top-3 -right-3 w-12 h-12 rounded-full flex items-center justify-center"
        style={{ background: CUPHEAD_COLORS.inkBlack }}
        aria-hidden="true"
      >
        <div className="w-4 h-4 rounded-full" style={{ background: CUPHEAD_COLORS.accentRedDark }} />
      </div>

      <h3
        className="text-base font-bold group-hover:text-red-800 transition-colors"
        style={{ color: CUPHEAD_COLORS.inkBlack, fontFamily: 'serif' }}
      >
        <span aria-hidden="true">♫ </span>
        {band.name}
      </h3>
      <p className="text-sm mt-1" style={{ color: CUPHEAD_COLORS.accentRedDark }}>
        {band.role}
        {years && <span aria-hidden="true"> • </span>}
        {years && <span>{years}</span>}
      </p>
      {band.release && (
        <p className="text-sm mt-2" style={{ color: CUPHEAD_COLORS.inkBlack, fontFamily: 'serif' }}>
          Released <cite>&ldquo;{band.release}&rdquo;</cite>
        </p>
      )}
    </article>
  )

  return (
    <>
      {splash && <InkSplash x={splash.x} y={splash.y} />}
      {linkProps ? (
        <a {...linkProps} className="block h-full">
          {content}
        </a>
      ) : (
        content
      )}
    </>
  )
}

// ============================================================================
// COMPONENT: Experience Card (vintage ticket/poster style). Dates are date only strings (UTC midnight),
// so the year is read in UTC.
// ============================================================================
function ExperienceCard({ entry }: { entry: Job }) {
  const { start: startDisplay, end: endDisplay } = jobYears(entry, 'Present')

  return (
    <article className="p-4 relative" style={POSTER_STYLE}>
      {/* Corner decorations - art deco style */}
      <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2" style={{ borderColor: CUPHEAD_COLORS.accentRedDark }} aria-hidden="true" />
      <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2" style={{ borderColor: CUPHEAD_COLORS.accentRedDark }} aria-hidden="true" />
      <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2" style={{ borderColor: CUPHEAD_COLORS.accentRedDark }} aria-hidden="true" />
      <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2" style={{ borderColor: CUPHEAD_COLORS.accentRedDark }} aria-hidden="true" />

      <div className="flex justify-between items-start gap-3 mb-2 flex-wrap">
        <div>
          <h3 className="text-base font-bold" style={{ color: CUPHEAD_COLORS.inkBlack, fontFamily: 'serif' }}>
            {entry.title}
          </h3>
          <p className="text-sm" style={{ color: CUPHEAD_COLORS.accentRedDark, fontFamily: 'serif' }}>
            {entry.company}
          </p>
        </div>
        <span
          className="text-sm px-2 py-1"
          style={{
            background: CUPHEAD_COLORS.inkBlack,
            color: CUPHEAD_COLORS.paperCream,
            fontFamily: 'serif',
          }}
        >
          {startDisplay} - {endDisplay}
        </span>
      </div>
      {entry.description && (
        <p className="text-sm mb-2" style={{ color: CUPHEAD_COLORS.inkBlack, fontFamily: 'serif' }}>
          {entry.description}
        </p>
      )}
      {entry.highlights.length > 0 && (
        <ul className="space-y-1" aria-label="Key achievements">
          {entry.highlights.map((highlight) => (
            <li
              key={highlight}
              className="text-sm flex items-start gap-2"
              style={{ color: CUPHEAD_COLORS.inkBlack, fontFamily: 'serif' }}
            >
              <span style={{ color: CUPHEAD_COLORS.accentRedDark }} aria-hidden="true">★</span>
              {highlight}
            </li>
          ))}
        </ul>
      )}
      {entry.skills.length > 0 && (
        <ul className="flex gap-1 flex-wrap mt-3" aria-label="Skills used">
          {entry.skills.slice(0, 4).map((skill) => (
            <li
              key={skill}
              className="text-sm px-2 py-0.5 rounded-full"
              style={{ background: CUPHEAD_COLORS.inkBlack, color: CUPHEAD_COLORS.paperCream }}
            >
              {skill}
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

// ============================================================================
// COMPONENT: Art Section - Cuphead themed decorative break
// ============================================================================
function ArtSection({ variant = 'filmReel' }: { variant?: 'filmReel' | 'musicNotes' | 'bouncingBalls' }) {
  const reducedMotion = useReducedMotion()

  if (variant === 'filmReel') {
    // Film reel with sprocket holes and vintage film elements
    return (
      <div className="relative py-12 my-8 overflow-hidden" aria-hidden="true">
        {/* Top film strip */}
        <div
          className="absolute top-0 left-0 right-0 h-8 flex items-center justify-center"
          style={{ background: '#1a1510' }}
        >
          <div className={`flex gap-4 ${reducedMotion ? '' : 'cuphead-sprocket-scroll-horizontal'}`}>
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="w-4 h-4 rounded-sm flex-shrink-0"
                style={{ background: CUPHEAD_COLORS.paperCream, border: `1px solid ${CUPHEAD_COLORS.inkBlack}` }}
              />
            ))}
          </div>
        </div>

        {/* Center content - vintage film countdown style */}
        <div className="flex justify-center items-center gap-8 py-4">
          <div className="w-16 h-px" style={{ background: CUPHEAD_COLORS.inkBlack }} />
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center relative ${reducedMotion ? '' : 'cuphead-bob'}`}
            style={{
              border: `4px solid ${CUPHEAD_COLORS.inkBlack}`,
              background: CUPHEAD_COLORS.paperDark,
            }}
          >
            {/* Pie-cut eye design inside circle */}
            <div className="flex gap-2">
              <div className="w-4 h-5 rounded-full relative" style={{ background: CUPHEAD_COLORS.inkBlack }}>
                <div className="absolute top-0 left-0 w-2 h-3" style={{ background: CUPHEAD_COLORS.paperDark }} />
              </div>
              <div className="w-4 h-5 rounded-full relative" style={{ background: CUPHEAD_COLORS.inkBlack }}>
                <div className="absolute top-0 left-0 w-2 h-3" style={{ background: CUPHEAD_COLORS.paperDark }} />
              </div>
            </div>
            {/* Countdown lines */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <div
                key={angle}
                className="absolute w-1 h-3"
                style={{
                  background: CUPHEAD_COLORS.accentRedDark,
                  transform: `rotate(${angle}deg) translateY(-32px)`,
                }}
              />
            ))}
          </div>
          <div className="w-16 h-px" style={{ background: CUPHEAD_COLORS.inkBlack }} />
        </div>

        {/* Bottom film strip */}
        <div
          className="absolute bottom-0 left-0 right-0 h-8 flex items-center justify-center"
          style={{ background: '#1a1510' }}
        >
          <div className={`flex gap-4 ${reducedMotion ? '' : 'cuphead-sprocket-scroll-horizontal-reverse'}`}>
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="w-4 h-4 rounded-sm flex-shrink-0"
                style={{ background: CUPHEAD_COLORS.paperCream, border: `1px solid ${CUPHEAD_COLORS.inkBlack}` }}
              />
            ))}
          </div>
        </div>

        {/* Film strip perforations on sides */}
        <div className="absolute left-4 top-8 bottom-8 w-2 flex flex-col justify-around">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full" style={{ background: CUPHEAD_COLORS.inkBlack, opacity: 0.3 }} />
          ))}
        </div>
        <div className="absolute right-4 top-8 bottom-8 w-2 flex flex-col justify-around">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full" style={{ background: CUPHEAD_COLORS.inkBlack, opacity: 0.3 }} />
          ))}
        </div>
      </div>
    )
  }

  if (variant === 'musicNotes') {
    // Jazz-age music notes dancing across the screen
    const notes = ['\u{266A}', '\u{266B}', '\u{266C}', '\u{2669}', '\u{266D}', '\u{266F}']
    return (
      <div className="relative py-10 my-8 overflow-hidden" aria-hidden="true">
        {/* Decorative line with curls */}
        <svg className="absolute top-1/2 left-0 right-0 h-8 -translate-y-1/2" viewBox="0 0 800 40" preserveAspectRatio="none">
          <path
            d="M0,20 Q100,0 200,20 T400,20 T600,20 T800,20"
            fill="none"
            stroke={CUPHEAD_COLORS.inkBlack}
            strokeWidth="3"
            opacity="0.4"
          />
        </svg>

        {/* Dancing music notes */}
        <div className="flex justify-around items-center px-8">
          {notes.map((note, i) => (
            <span
              key={i}
              className={`text-3xl ${reducedMotion ? '' : 'cuphead-bounce-letter'}`}
              style={{
                animationDelay: reducedMotion ? '0s' : `${i * 0.1}s`,
                color: CUPHEAD_COLORS.inkBlack,
                opacity: 0.6,
                textShadow: `2px 2px 0 ${CUPHEAD_COLORS.shadowBrown}`,
              }}
            >
              {note}
            </span>
          ))}
        </div>

        {/* Bouncing balls underneath notes */}
        <div className="flex justify-around mt-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full ${reducedMotion ? '' : 'cuphead-bounce-squash'}`}
              style={{
                animationDelay: reducedMotion ? '0s' : `${i * 0.2}s`,
                background: `radial-gradient(circle at 30% 30%, ${CUPHEAD_COLORS.inkSoft}, ${CUPHEAD_COLORS.inkBlack})`,
                boxShadow: '1px 1px 0 #1a1510',
              }}
            />
          ))}
        </div>

        {/* Stars decorating the sides */}
        <span className="absolute left-8 top-1/2 -translate-y-1/2 text-xl" style={{ color: CUPHEAD_COLORS.accentGold }}>
          ✦
        </span>
        <span className="absolute right-8 top-1/2 -translate-y-1/2 text-xl" style={{ color: CUPHEAD_COLORS.accentGold }}>
          ✦
        </span>
      </div>
    )
  }

  if (variant === 'bouncingBalls') {
    // Classic cartoon bouncing balls with pie-eyes
    return (
      <div className="relative py-10 my-8 overflow-hidden" aria-hidden="true">
        {/* Horizontal dashed line */}
        <div
          className="absolute top-1/2 left-8 right-8 h-1 -translate-y-1/2"
          style={{ borderTop: `3px dashed ${CUPHEAD_COLORS.inkBlack}`, opacity: 0.3 }}
        />

        {/* Pie-eye characters bouncing */}
        <div className="flex justify-around items-end h-24">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`relative ${reducedMotion ? '' : 'cuphead-bounce-squash'}`}
              style={{ animationDelay: reducedMotion ? '0s' : `${i * 0.3}s` }}
            >
              {/* Ball body */}
              <div
                className="w-10 h-10 rounded-full relative"
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${CUPHEAD_COLORS.paperCream}, ${CUPHEAD_COLORS.paperDark})`,
                  border: `3px solid ${CUPHEAD_COLORS.inkBlack}`,
                  boxShadow: '2px 2px 0 #1a1510',
                }}
              >
                {/* Pie-cut eyes */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 flex gap-1">
                  <div className="w-2 h-3 rounded-full relative" style={{ background: CUPHEAD_COLORS.inkBlack }}>
                    <div className="absolute top-0 left-0 w-1 h-1.5" style={{ background: CUPHEAD_COLORS.paperCream }} />
                  </div>
                  <div className="w-2 h-3 rounded-full relative" style={{ background: CUPHEAD_COLORS.inkBlack }}>
                    <div className="absolute top-0 left-0 w-1 h-1.5" style={{ background: CUPHEAD_COLORS.paperCream }} />
                  </div>
                </div>
                {/* Smile */}
                <div
                  className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-2 rounded-b-full"
                  style={{ borderBottom: `2px solid ${CUPHEAD_COLORS.inkBlack}` }}
                />
              </div>
              {/* Shadow underneath */}
              <div
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-2 rounded-full"
                style={{ background: CUPHEAD_COLORS.inkBlack, opacity: 0.2 }}
              />
            </div>
          ))}
        </div>

        {/* Vintage corner decorations */}
        <div className="absolute top-2 left-4 text-lg" style={{ color: CUPHEAD_COLORS.accentRedDark }}>❧</div>
        <div className="absolute top-2 right-4 text-lg" style={{ color: CUPHEAD_COLORS.accentRedDark, transform: 'scaleX(-1)' }}>❧</div>
        <div className="absolute bottom-2 left-4 text-lg" style={{ color: CUPHEAD_COLORS.accentRedDark, transform: 'scaleY(-1)' }}>❧</div>
        <div className="absolute bottom-2 right-4 text-lg" style={{ color: CUPHEAD_COLORS.accentRedDark, transform: 'scale(-1)' }}>❧</div>
      </div>
    )
  }

  return null
}

// ============================================================================
// COMPONENT: Project Poster (vintage movie/show poster style): his role, the result line and the links
// ============================================================================
function VintagePoster({ project, years, links }: ProjectSlot) {
  const reducedMotion = useReducedMotion()

  return (
    <article
      className={`h-full p-4 relative group transition-all hover:scale-[1.02] ${!reducedMotion ? 'hover:-rotate-1' : ''}`}
      style={POSTER_STYLE}
    >
      {/* Corner decorations */}
      <div className="absolute top-1 left-1 w-4 h-4 border-t-2 border-l-2" style={{ borderColor: CUPHEAD_COLORS.accentRedDark }} aria-hidden="true" />
      <div className="absolute top-1 right-1 w-4 h-4 border-t-2 border-r-2" style={{ borderColor: CUPHEAD_COLORS.accentRedDark }} aria-hidden="true" />
      <div className="absolute bottom-1 left-1 w-4 h-4 border-b-2 border-l-2" style={{ borderColor: CUPHEAD_COLORS.accentRedDark }} aria-hidden="true" />
      <div className="absolute bottom-1 right-1 w-4 h-4 border-b-2 border-r-2" style={{ borderColor: CUPHEAD_COLORS.accentRedDark }} aria-hidden="true" />

      <div className="flex justify-between items-start gap-2 mt-1">
        <h3 className="text-base font-bold" style={{ color: CUPHEAD_COLORS.accentRedDark, fontFamily: 'serif' }}>
          {project.name.toUpperCase()}
        </h3>
        {years && (
          <span className="text-sm whitespace-nowrap" style={{ color: CUPHEAD_COLORS.inkBlack, fontFamily: 'serif' }}>
            {years}
          </span>
        )}
      </div>
      <p className="text-sm font-bold mb-1" style={{ color: CUPHEAD_COLORS.inkBlack, fontFamily: 'serif' }}>
        {project.role}
      </p>
      <p className="text-sm mb-2" style={{ color: CUPHEAD_COLORS.inkBlack }}>
        {project.tagline}
      </p>
      {project.impact && (
        <p
          className="text-sm mb-2 italic px-2 py-1 rounded"
          style={{
            color: CUPHEAD_COLORS.inkBlack,
            background: `${CUPHEAD_COLORS.accentGold}30`,
            border: `1px solid ${CUPHEAD_COLORS.accentGold}50`,
          }}
        >
          <span aria-hidden="true">→ </span>
          {project.impact}
        </p>
      )}
      {project.techStack.length > 0 && (
        <ul className="flex gap-1 flex-wrap" aria-label="Technologies used">
          {project.techStack.slice(0, 4).map((tech) => (
            <li
              key={tech}
              className="text-sm px-2 py-0.5 rounded-full"
              style={{
                background: CUPHEAD_COLORS.inkBlack,
                color: CUPHEAD_COLORS.paperCream,
              }}
            >
              {tech}
            </li>
          ))}
        </ul>
      )}
      {links.length > 0 ? (
        <div className="flex flex-wrap gap-3 mt-4">
          {links.map(({ kind, label, linkProps }) => (
            <a
              key={kind}
              {...linkProps}
              className="inline-flex items-center min-h-[44px] px-4 text-sm tracking-wider transition-all hover:scale-105"
              style={{
                background: CUPHEAD_COLORS.accentRedDark,
                color: CUPHEAD_COLORS.paperCream,
                border: `3px solid ${CUPHEAD_COLORS.inkBlack}`,
                fontFamily: 'serif',
                boxShadow: '3px 3px 0 #5a0000',
              }}
            >
              {label}
            </a>
          ))}
        </div>
      ) : (
        <p className="text-sm mt-4 italic" style={{ color: CUPHEAD_COLORS.inkBlack, fontFamily: 'serif' }}>
          No public link
        </p>
      )}
    </article>
  )
}

const CARTOON_BUTTON =
  'inline-flex items-center justify-center min-h-[44px] px-4 py-2 text-sm tracking-wider transition-all hover:scale-105'

// Email is the red primary action, LinkedIn and the CV the ink ones.
const HERO_ACTION_LOOK: Record<HeroActionSlot['id'], React.CSSProperties> = {
  email: {
    background: CUPHEAD_COLORS.accentRedDark,
    color: CUPHEAD_COLORS.paperCream,
    border: `3px solid ${CUPHEAD_COLORS.inkBlack}`,
    fontFamily: 'serif',
    boxShadow: '3px 3px 0 #5a0000',
  },
  linkedin: {
    background: CUPHEAD_COLORS.inkBlack,
    color: CUPHEAD_COLORS.paperCream,
    border: `3px solid ${CUPHEAD_COLORS.inkBlack}`,
    fontFamily: 'serif',
    boxShadow: '3px 3px 0 #1a1510',
  },
}

function HeroAction({ action }: { action: HeroActionSlot }) {
  return (
    <a {...action.linkProps} className={`${CARTOON_BUTTON} hover:rotate-1`} style={HERO_ACTION_LOOK[action.id]}>
      {action.label}
    </a>
  )
}

function CVLink() {
  return (
    <Link href="/cv" className={`${CARTOON_BUTTON} hover:-rotate-1`} style={HERO_ACTION_LOOK.linkedin}>
      CV
    </Link>
  )
}

function SectionBanner({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-center mb-6">
      <DecorativeBanner>
        <span className="text-lg tracking-wider">{children}</span>
      </DecorativeBanner>
    </div>
  )
}

function EngineerSections({ sections }: { sections: SectionsOf<'engineer'> }) {
  const { professionalSummary } = useCVData()

  return (
    <>
      <section className="text-center mb-8" aria-label="About">
        <DecorativeBanner>
          <span className="text-lg tracking-wider">ABOUT</span>
        </DecorativeBanner>
        <p
          className="mt-8 text-base leading-relaxed max-w-2xl mx-auto"
          style={{ color: CUPHEAD_COLORS.inkBlack, fontFamily: 'serif' }}
        >
          {professionalSummary.bio}
        </p>
      </section>

      {/* ========== ART SECTION 1: Film Reel Break ========== */}
      <ArtSection variant="filmReel" />

      {sections.jobs.length > 0 && (
        <section className="mb-8" aria-label="Work experience">
          <SectionBanner>WORK EXPERIENCE</SectionBanner>
          <div className="space-y-4 max-w-3xl mx-auto">
            {sections.jobs.map((entry) => (
              <ExperienceCard key={entry.id} entry={entry} />
            ))}
          </div>
        </section>
      )}

      {/* ========== ART SECTION 2: Music Notes Break ========== */}
      <ArtSection variant="musicNotes" />

      <section className="mb-8" aria-label="Tech stack">
        <SectionBanner>TECH STACK</SectionBanner>
        <div
          className="p-6 max-w-3xl mx-auto"
          style={{ ...POSTER_STYLE, boxShadow: `6px 6px 0 ${CUPHEAD_COLORS.shadowBrown}` }}
        >
          <TechBubbleCloud categories={sections.techStack} />
        </div>
      </section>

      <section className="mb-8" aria-label="Projects">
        <SectionBanner>PROJECTS</SectionBanner>
        <ProjectList
          projects={sections.projects}
          className="grid md:grid-cols-2 gap-4"
          renderProject={(slot) => <VintagePoster {...slot} />}
        />
      </section>

      {/* ========== ART SECTION 3: Bouncing Balls Break ========== */}
      <ArtSection variant="bouncingBalls" />

      <section className="mb-8" aria-label="Ventures">
        <SectionBanner>VENTURES</SectionBanner>
        <div className="grid md:grid-cols-3 gap-4">
          {sections.companies.map((company) => (
            <CompanyPoster key={company.id} company={company} />
          ))}
        </div>
      </section>
    </>
  )
}

function MusicianSections({ sections }: { sections: SectionsOf<'drummer'> }) {
  const { musician, bands } = sections

  return (
    <>
      <ArtSection variant="musicNotes" />
      <section className="mb-8" aria-label="Bands">
        <SectionBanner>BANDS</SectionBanner>
        <p className="text-base text-center mb-6" style={{ color: CUPHEAD_COLORS.inkBlack, fontFamily: 'serif' }}>
          Drums since {musician.since}, {musician.yearsPlaying} years
        </p>
        <BandList bands={bands} className="grid md:grid-cols-3 gap-4" renderBand={(slot) => <BandRecord {...slot} />} />
        <p className="text-sm text-center mt-6 italic" style={{ color: CUPHEAD_COLORS.accentRedDark, fontFamily: 'serif' }}>
          {musician.line}
        </p>
      </section>
    </>
  )
}

function MartialArtistSections({ sections }: { sections: SectionsOf<'fighter'> }) {
  const { martialArts } = sections

  return (
    <>
      <ArtSection variant="bouncingBalls" />
      <section className="mb-8" aria-label="Muay Thai">
        <SectionBanner>MUAY THAI</SectionBanner>
        <div className="p-6 max-w-3xl mx-auto" style={{ ...POSTER_STYLE, boxShadow: `6px 6px 0 ${CUPHEAD_COLORS.shadowBrown}` }}>
          <h3
            className="text-xl text-center mb-6"
            style={{ color: CUPHEAD_COLORS.accentRedDark, fontFamily: '"Abril Fatface", serif' }}
          >
            {martialArts.primary.title}
          </h3>
          <MuayThaiRecord
            martialArts={martialArts}
            classNames={{
              facts: 'grid sm:grid-cols-2 gap-4 mb-6',
              fact: 'p-3 border-4 border-[#2a2015] bg-[#f7ead0]',
              term: 'text-sm tracking-widest uppercase text-[#8b0000] font-serif',
              value: 'text-sm mt-1 text-[#2a2015] font-serif',
              achievements: 'space-y-2',
              achievement: 'text-sm flex items-start gap-2 text-[#2a2015] font-serif',
            }}
            renderAchievement={(achievement) => (
              <>
                <span className="text-[#8b0000]" aria-hidden="true">★</span>
                <span>{achievement}</span>
              </>
            )}
          />
        </div>
      </section>
    </>
  )
}

const SECTION_VIEWS: ProfessionSectionViews = {
  engineer: EngineerSections,
  drummer: MusicianSections,
  fighter: MartialArtistSections,
}

// ============================================================================
// MAIN COMPONENT: RubberHoseTheme (Cuphead Gameplay Style)
// ============================================================================
export default function RubberHoseTheme() {
  const { active } = useProfession()
  const view = useWorldView()
  const [mounted, setMounted] = useState(false)

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
        {/* Header - the recruiter first screen */}
        <header className="relative z-30 px-2 py-6 sm:p-6">
          <RecruiterHero
            render={({ name, headline, tagline, line, actions }) => (
              <div className="max-w-6xl mx-auto flex flex-col items-center gap-6">
                <div className="text-center">
                  <CartoonTitle text={name.toUpperCase()} subtitle={headline} />
                  <p
                    className="text-sm tracking-widest mt-2 italic"
                    style={{ color: CUPHEAD_COLORS.accentRedDark, fontFamily: 'serif' }}
                  >
                    {tagline}
                  </p>
                  <p className="text-sm mt-2" style={{ color: CUPHEAD_COLORS.inkBlack, fontFamily: 'serif' }}>
                    {line}
                  </p>
                </div>

                <nav className="flex gap-3 items-center justify-center flex-wrap" aria-label="Contact and CV">
                  {actions.map((action) => (
                    <HeroAction key={action.id} action={action} />
                  ))}
                  <CVLink />
                  <Link
                    href="/personal-projects/game-engine"
                    className={`${CARTOON_BUTTON} hover:-rotate-1`}
                    style={HERO_ACTION_LOOK.email}
                  >
                    PLAY GAME
                  </Link>
                </nav>
              </div>
            )}
          />
        </header>

        {/* Character/Profession selection, System Engineer in the centre */}
        <section className="relative z-20 py-8" aria-label="Profession selection">
          <p className="text-center mb-6 text-sm tracking-widest" style={{ color: CUPHEAD_COLORS.inkBlack, fontFamily: 'serif' }} aria-hidden="true">
            ~ SELECT YOUR ADVENTURE ~
          </p>
          <ProfessionSwitch
            className="grid grid-cols-3 gap-2 sm:flex sm:justify-center sm:gap-8 md:gap-12"
            label="Profession"
            renderOption={(option) => <CartoonCharacter {...option} />}
          />
        </section>

        {/* Main content */}
        <main id="main-content" className="relative z-20 px-2 md:px-8 py-8">
          <div className="max-w-4xl mx-auto" role="region" aria-label={`${active} profession details`}>
            <ProfessionSectionsView views={SECTION_VIEWS} sections={view.sections} />
          </div>
        </main>

        {/* Contact CTA */}
        <section className="relative z-20 py-12" aria-label="Contact">
          <RecruiterHero
            render={({ line, actions }) => (
              <div className="max-w-2xl mx-auto text-center">
                <div className="mb-8">
                  <h2
                    className="text-xl tracking-[0.15em] mb-3"
                    style={{
                      color: CUPHEAD_COLORS.inkBlack,
                      fontFamily: '"Abril Fatface", serif',
                      textShadow: `2px 2px 0 ${CUPHEAD_COLORS.shadowBrown}`,
                    }}
                  >
                    Ready to Work Together?
                  </h2>
                  <p className="text-sm" style={{ color: CUPHEAD_COLORS.inkBlack, fontFamily: 'serif' }}>
                    {line}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {actions.map((action) => (
                    <HeroAction key={action.id} action={action} />
                  ))}
                  <CVLink />
                </div>
              </div>
            )}
          />
        </section>

        

        {/* Footer */}
        <footer className="relative z-20 py-8 text-center">
          <div className="flex items-center justify-center gap-4">
            <div className="w-16 h-0.5" style={{ background: CUPHEAD_COLORS.inkBlack }} aria-hidden="true" />
            <p
              className="text-sm tracking-widest"
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

        /* Sprocket hole scrolling - vertical */
        @keyframes cuphead-sprocket {
          0% { transform: translateY(0); }
          100% { transform: translateY(-256px); }
        }

        @keyframes cuphead-sprocket-reverse {
          0% { transform: translateY(-256px); }
          100% { transform: translateY(0); }
        }

        /* Sprocket hole scrolling - horizontal for art sections */
        @keyframes cuphead-sprocket-horizontal {
          0% { transform: translateX(0); }
          100% { transform: translateX(-160px); }
        }

        @keyframes cuphead-sprocket-horizontal-reverse {
          0% { transform: translateX(-160px); }
          100% { transform: translateX(0); }
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

        .cuphead-sprocket-scroll-horizontal {
          animation: cuphead-sprocket-horizontal 3s linear infinite;
        }

        .cuphead-sprocket-scroll-horizontal-reverse {
          animation: cuphead-sprocket-horizontal-reverse 3s linear infinite;
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
          .cuphead-sprocket-scroll-horizontal,
          .cuphead-sprocket-scroll-horizontal-reverse,
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
