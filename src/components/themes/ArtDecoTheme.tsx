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

// Hook for respecting reduced motion preferences
function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return reducedMotion
}

// Achievement data for skills (no proficiency bars - show impact)
const SKILL_ACHIEVEMENTS: Record<string, Record<string, string[]>> = {
  drummer: {
    'Rock/Metal': ['Toured 30+ cities nationally', 'Studio albums with 3 metal bands'],
    'Progressive': ['Complex time signatures (7/8, 11/8)', 'Dream Theater-inspired fills'],
    'Latin/Salsa': ['Traditional Cuban rhythms mastery', 'Latin jazz ensemble work'],
    'Jazz Fusion': ['Improvisation across 4 octave range', 'Session work with fusion artists'],
    'Funk/Soul': ['Pocket grooves, ghost notes specialist', 'James Brown tribute performances'],
    'Double Bass': ['200+ BPM sustained patterns', 'Heel-toe technique mastery'],
    'Polyrhythms': ['4 over 3, 5 over 4 independence', 'West African rhythm integration'],
    'Odd Time Signatures': ['Tool/Meshuggah-style grooves', 'Seamless time transitions'],
    'Ghost Notes': ['Dynamic control, felt not heard', 'Signature snare patterns'],
    'Linear Drumming': ['Hands-feet independence', 'Modern gospel chops'],
    'Studio Recording': ['Multi-track session experience', 'Pro Tools, Logic certified'],
    'Live Touring': ['Festival stages, club circuits', 'In-ear monitoring expertise'],
    'Session Work': ['Quick learning, chart reading', 'Diverse genre adaptability'],
    'Music Production': ['Drum programming, mixing', 'Home studio production'],
  },
  fighter: {
    'Muay Thai (3 years)': ['Traditional clinch techniques', 'Elbow/knee combinations'],
    'Brazilian Jiu-Jitsu (2 years)': ['Blue belt competitor', 'Triangle choke specialist'],
    'MMA (1 year)': ['Integrated striking/grappling', 'Cage control fundamentals'],
    'Wrestling': ['Double/single leg takedowns', 'Mat return techniques'],
    'Striking': ['Boxing combos, head movement', 'Distance management'],
    'Clinch Work': ['Thai plum control', 'Dirty boxing integration'],
    'Ground Game': ['Guard passing, sweeps', 'Position before submission'],
    'Submissions': ['Triangle, armbar, RNC', '15+ competition submissions'],
    'Fundamentals Instruction': ['20+ students to competition', '3 classes weekly'],
    'Competition Prep': ['Fight camp programming', 'Weight cut protocols'],
    'Self Defense': ['Real-world scenario training', 'De-escalation techniques'],
    'Private Coaching': ['Personalized curricula', 'Video analysis sessions'],
  },
}

// Deep sea diver Alexander - Bioshock style
function DiverCharacter({
  size = 60,
  direction = 'right',
  className = '',
  reducedMotion = false,
}: {
  size?: number
  direction?: 'left' | 'right'
  className?: string
  reducedMotion?: boolean
}) {
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    if (reducedMotion) return
    const interval = setInterval(() => setFrame(f => (f + 1) % 2), 200)
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
      aria-label="Rapture citizen in diving suit"
    >
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
        aria-hidden="true"
      />
      {/* Underwater bubbles from suit */}
      {!reducedMotion && (
        <div
          className="absolute -top-4 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full animate-bubble-small"
          style={{
            background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6), rgba(200,220,240,0.2))',
          }}
          aria-hidden="true"
        />
      )}
    </div>
  )
}

// Rapture profession ornaments - Art Deco style (ASCII-based for art deco feel)
function RaptureOrnaments({
  profession,
  reducedMotion = false,
}: {
  profession: 'engineer' | 'drummer' | 'fighter'
  reducedMotion?: boolean
}) {
  // Using ASCII/geometric symbols for art deco authenticity
  const ornamentsByProfession = {
    engineer: [
      { icon: '[++]', x: 4, y: 20, label: 'Code symbol' },
      { icon: '</>',  x: 92, y: 25, label: 'Tag symbol' },
      { icon: '{ }',  x: 5, y: 68, label: 'Braces' },
      { icon: '::',   x: 90, y: 72, label: 'Scope' },
    ],
    drummer: [
      { icon: '||o||', x: 4, y: 22, label: 'Drum' },
      { icon: '~~~',   x: 91, y: 26, label: 'Sound wave' },
      { icon: '/|\\',  x: 5, y: 70, label: 'Cymbal' },
      { icon: '(( ))', x: 90, y: 74, label: 'Rhythm' },
    ],
    fighter: [
      { icon: '><',   x: 5, y: 24, label: 'Combat' },
      { icon: '/|\\', x: 90, y: 22, label: 'Stance' },
      { icon: '[ ]',  x: 4, y: 70, label: 'Guard' },
      { icon: '=>',   x: 91, y: 72, label: 'Strike' },
    ],
  }

  const items = ornamentsByProfession[profession]

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[4] overflow-hidden"
      aria-hidden="true"
    >
      {items.map((item, i) => (
        <div
          key={i}
          className="absolute font-mono text-lg font-bold"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            color: '#d4af37',
            opacity: 0.2,
            textShadow: '0 0 10px #d4af37',
            animation: reducedMotion ? 'none' : `raptureFloat ${16 + i * 3}s ease-in-out infinite`,
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
  reducedMotion = false,
}: {
  children: React.ReactNode
  className?: string
  reducedMotion?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const hasEntered = useInViewTrigger(ref, { threshold: 0.15 })
  const [phase, setPhase] = useState<'hidden' | 'descending' | 'revealed'>('hidden')

  useEffect(() => {
    if (hasEntered && phase === 'hidden') {
      if (reducedMotion) {
        // Skip animation for reduced motion
        setPhase('revealed')
      } else {
        setPhase('descending')
        setTimeout(() => setPhase('revealed'), 800)
      }
    }
  }, [hasEntered, phase, reducedMotion])

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {/* Bathysphere descent animation */}
      {phase === 'descending' && !reducedMotion && (
        <div className="absolute inset-0 z-50 pointer-events-none" aria-hidden="true">
          {/* Diver swimming across */}
          <div
            className="absolute top-1/2 -translate-y-1/2"
            style={{ animation: 'bathyDescent 0.8s ease-out forwards' }}
          >
            <DiverCharacter size={40} direction="right" reducedMotion={reducedMotion} />
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
          transition: reducedMotion ? 'none' : 'all 0.6s ease-out',
        }}
      >
        {children}
      </div>
    </div>
  )
}

// Art deco geometric pattern background - enhanced Rapture style
function DecoPattern() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[1] opacity-[0.05]" aria-hidden="true">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" role="presentation">
        <defs>
          <pattern id="deco-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            {/* Main diamond */}
            <path
              d="M50 0 L100 50 L50 100 L0 50 Z"
              fill="none"
              stroke="#d4af37"
              strokeWidth="0.5"
            />
            {/* Inner circle */}
            <circle cx="50" cy="50" r="20" fill="none" stroke="#d4af37" strokeWidth="0.5" />
            {/* Cross lines */}
            <path d="M50 0 L50 30 M50 70 L50 100 M0 50 L30 50 M70 50 L100 50" stroke="#d4af37" strokeWidth="0.3" />
            {/* Art deco fan motifs */}
            <path d="M50 50 L40 30 M50 50 L50 30 M50 50 L60 30" stroke="#d4af37" strokeWidth="0.2" opacity="0.5" />
            {/* Corner accents */}
            <circle cx="0" cy="0" r="8" fill="none" stroke="#d4af37" strokeWidth="0.3" />
            <circle cx="100" cy="0" r="8" fill="none" stroke="#d4af37" strokeWidth="0.3" />
            <circle cx="0" cy="100" r="8" fill="none" stroke="#d4af37" strokeWidth="0.3" />
            <circle cx="100" cy="100" r="8" fill="none" stroke="#d4af37" strokeWidth="0.3" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#deco-pattern)" />
      </svg>
    </div>
  )
}

// Underwater light rays effect - simulating light through Rapture's glass
function UnderwaterRays({ reducedMotion = false }: { reducedMotion?: boolean }) {
  return (
    <div className="fixed inset-0 pointer-events-none z-[2] overflow-hidden" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className={reducedMotion ? '' : 'animate-light-ray'}
          style={{
            position: 'absolute',
            top: 0,
            left: `${10 + i * 20}%`,
            width: '150px',
            height: '100%',
            background: 'linear-gradient(180deg, rgba(212, 175, 55, 0.1), transparent 70%)',
            transform: `rotate(${-15 + i * 5}deg)`,
            transformOrigin: 'top center',
            animationDelay: reducedMotion ? undefined : `${i * 0.5}s`,
            opacity: reducedMotion ? 0.08 : undefined,
          }}
        />
      ))}
    </div>
  )
}

// Rising underwater bubbles
function UnderwaterBubbles({ reducedMotion = false }: { reducedMotion?: boolean }) {
  const [bubbles, setBubbles] = useState<Array<{
    id: number
    x: number
    size: number
    duration: number
    delay: number
    wobble: number
  }>>([])

  useEffect(() => {
    // Fewer bubbles for reduced motion
    const count = reducedMotion ? 8 : 25
    const newBubbles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 8 + 3,
      duration: Math.random() * 8 + 10,
      delay: Math.random() * 15,
      wobble: Math.random() * 30 + 10,
    }))
    setBubbles(newBubbles)
  }, [reducedMotion])

  // Static bubbles for reduced motion
  if (reducedMotion) {
    return (
      <div className="fixed inset-0 pointer-events-none z-[3] overflow-hidden" aria-hidden="true">
        {bubbles.map((b) => (
          <div
            key={b.id}
            className="absolute rounded-full"
            style={{
              left: `${b.x}%`,
              top: `${20 + (b.id * 10) % 60}%`,
              width: b.size,
              height: b.size,
              background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), rgba(212,175,55,0.08))',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-[3] overflow-hidden" aria-hidden="true">
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

// Water caustics effect - light refracting through Rapture's dome
function WaterCaustics({ reducedMotion = false }: { reducedMotion?: boolean }) {
  return (
    <div className="fixed inset-0 pointer-events-none z-[4] overflow-hidden opacity-20" aria-hidden="true">
      <div
        className={reducedMotion ? '' : 'animate-caustics-1'}
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse at 20% 30%, rgba(212,175,55,0.3) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 70%, rgba(65,200,232,0.2) 0%, transparent 40%),
            radial-gradient(ellipse at 50% 50%, rgba(212,175,55,0.15) 0%, transparent 60%)
          `,
        }}
      />
      <div
        className={reducedMotion ? '' : 'animate-caustics-2'}
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse at 70% 20%, rgba(65,200,232,0.25) 0%, transparent 45%),
            radial-gradient(ellipse at 30% 80%, rgba(212,175,55,0.2) 0%, transparent 50%)
          `,
        }}
      />
    </div>
  )
}

// Big Daddy silhouette - iconic Rapture protector
function BigDaddySilhouette() {
  return (
    <div
      className="fixed bottom-0 right-0 pointer-events-none z-[6] opacity-10"
      aria-hidden="true"
      role="presentation"
    >
      <svg
        width="300"
        height="400"
        viewBox="0 0 300 400"
        className="transform translate-x-1/4 translate-y-1/4"
        aria-label="Big Daddy silhouette"
      >
        <defs>
          <linearGradient id="bigdaddy-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#d4af37" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#d4af37" stopOpacity="0.1" />
          </linearGradient>
          {/* Porthole glow effect */}
          <radialGradient id="porthole-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f0c850" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* Diving helmet */}
        <ellipse cx="150" cy="80" rx="60" ry="70" fill="url(#bigdaddy-gradient)" />
        {/* Helmet porthole with glow */}
        <circle cx="150" cy="75" r="30" fill="none" stroke="#d4af37" strokeWidth="3" opacity="0.5" />
        <circle cx="150" cy="75" r="28" fill="url(#porthole-glow)" />
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
        {/* Drill spiral detail */}
        <path
          d="M260 205 L270 200 L265 195"
          stroke="#d4af37"
          strokeWidth="2"
          fill="none"
          opacity="0.2"
        />
        {/* Tank on back */}
        <ellipse cx="150" cy="200" rx="20" ry="50" fill="#d4af37" opacity="0.2" />
        {/* Suit pressure gauge */}
        <circle cx="180" cy="160" r="10" fill="none" stroke="#d4af37" strokeWidth="1" opacity="0.3" />
      </svg>
    </div>
  )
}

// Little Sister silhouette - ADAM harvester
function LittleSisterSilhouette({ reducedMotion = false }: { reducedMotion?: boolean }) {
  return (
    <div
      className="fixed bottom-0 left-0 pointer-events-none z-[6] opacity-10 transform -translate-x-1/4"
      aria-hidden="true"
      role="presentation"
    >
      <svg width="150" height="250" viewBox="0 0 150 250" aria-label="Little Sister silhouette">
        <defs>
          <linearGradient id="sister-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#d4af37" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#d4af37" stopOpacity="0.1" />
          </linearGradient>
          {/* ADAM glow */}
          <radialGradient id="adam-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff6b6b" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#ff6b6b" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* Head */}
        <circle cx="75" cy="40" r="25" fill="url(#sister-gradient)" />
        {/* Hair buns */}
        <circle cx="55" cy="25" r="12" fill="#d4af37" opacity="0.3" />
        <circle cx="95" cy="25" r="12" fill="#d4af37" opacity="0.3" />
        {/* Eyes - glowing yellow (ADAM-infused) */}
        <circle
          cx="68"
          cy="38"
          r="5"
          fill="#f0c850"
          opacity="0.6"
          className={reducedMotion ? '' : 'animate-pulse'}
        />
        <circle
          cx="82"
          cy="38"
          r="5"
          fill="#f0c850"
          opacity="0.6"
          className={reducedMotion ? '' : 'animate-pulse'}
        />
        {/* Dress */}
        <path
          d="M55 60 Q45 100 50 150 L30 230 L50 235 L65 170 L75 230 L85 170 L100 235 L120 230 L100 150 Q105 100 95 60 Z"
          fill="url(#sister-gradient)"
        />
        {/* ADAM syringe */}
        <line x1="105" y1="100" x2="140" y2="60" stroke="#d4af37" strokeWidth="4" opacity="0.4" />
        <circle cx="140" cy="55" r="12" fill="url(#adam-glow)" />
        <circle cx="140" cy="55" r="8" fill="#ff6b6b" opacity="0.4" />
        <line x1="140" y1="47" x2="140" y2="35" stroke="#d4af37" strokeWidth="2" opacity="0.4" />
        {/* Syringe needle */}
        <line x1="140" y1="63" x2="140" y2="75" stroke="#d4af37" strokeWidth="1" opacity="0.3" />
      </svg>
    </div>
  )
}

// Splicer masks floating - Rapture's masquerade
function SplicerMasks({ reducedMotion = false }: { reducedMotion?: boolean }) {
  const masks = [
    { x: 5, y: 15, rotation: -15, scale: 0.6 },
    { x: 92, y: 25, rotation: 20, scale: 0.5 },
    { x: 8, y: 70, rotation: -10, scale: 0.4 },
    { x: 88, y: 80, rotation: 15, scale: 0.5 },
  ]

  return (
    <div className="fixed inset-0 pointer-events-none z-[5]" aria-hidden="true">
      {masks.map((mask, i) => (
        <div
          key={i}
          className={reducedMotion ? '' : 'animate-float-slow'}
          style={{
            position: 'absolute',
            left: `${mask.x}%`,
            top: `${mask.y}%`,
            transform: `rotate(${mask.rotation}deg) scale(${mask.scale})`,
            animationDelay: reducedMotion ? undefined : `${i * 2}s`,
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
            {/* Decorative elements - art deco feathers */}
            <path d="M40 30 L40 15 L35 5 M40 15 L45 5" stroke="#d4af37" strokeWidth="1" fill="none" />
            <path d="M5 50 L-5 48 M75 50 L85 48" stroke="#d4af37" strokeWidth="1" />
            {/* Nose bridge detail */}
            <path d="M40 40 L40 55" stroke="#d4af37" strokeWidth="0.5" opacity="0.5" />
          </svg>
        </div>
      ))}
    </div>
  )
}

// Flickering neon sign - Rapture's failing infrastructure
function NeonSign({
  text,
  className = '',
  reducedMotion = false,
}: {
  text: string
  className?: string
  reducedMotion?: boolean
}) {
  const [flicker, setFlicker] = useState(false)

  useEffect(() => {
    if (reducedMotion) return
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
  }, [reducedMotion])

  return (
    <span
      className={`relative ${className}`}
      style={{
        color: flicker ? '#8b732080' : '#d4af37',
        textShadow: flicker
          ? 'none'
          : '0 0 10px #d4af37, 0 0 20px #d4af37, 0 0 40px #d4af3780, 0 0 60px #d4af3740',
        transition: reducedMotion ? 'none' : 'all 0.05s',
      }}
    >
      {text}
    </span>
  )
}

// Decorative gold frame - Art deco Rapture style
function GoldFrame({
  children,
  title,
  reducedMotion = false,
  ariaLabel,
}: {
  children: React.ReactNode
  title?: string
  reducedMotion?: boolean
  ariaLabel?: string
}) {
  return (
    <section className="relative" aria-label={ariaLabel || title}>
      {/* Corner ornaments */}
      <svg className="absolute -top-4 -left-4 w-12 h-12" viewBox="0 0 48 48" aria-hidden="true">
        <path d="M4,44 L4,4 L44,4" fill="none" stroke="#d4af37" strokeWidth="2" />
        <path d="M8,36 L8,8 L36,8" fill="none" stroke="#d4af37" strokeWidth="1" />
        <circle cx="4" cy="4" r="3" fill="#d4af37" />
        <path d="M12,4 L4,12" stroke="#d4af37" strokeWidth="1" />
      </svg>
      <svg className="absolute -top-4 -right-4 w-12 h-12 scale-x-[-1]" viewBox="0 0 48 48" aria-hidden="true">
        <path d="M4,44 L4,4 L44,4" fill="none" stroke="#d4af37" strokeWidth="2" />
        <path d="M8,36 L8,8 L36,8" fill="none" stroke="#d4af37" strokeWidth="1" />
        <circle cx="4" cy="4" r="3" fill="#d4af37" />
        <path d="M12,4 L4,12" stroke="#d4af37" strokeWidth="1" />
      </svg>
      <svg className="absolute -bottom-4 -left-4 w-12 h-12 scale-y-[-1]" viewBox="0 0 48 48" aria-hidden="true">
        <path d="M4,44 L4,4 L44,4" fill="none" stroke="#d4af37" strokeWidth="2" />
        <path d="M8,36 L8,8 L36,8" fill="none" stroke="#d4af37" strokeWidth="1" />
        <circle cx="4" cy="4" r="3" fill="#d4af37" />
        <path d="M12,4 L4,12" stroke="#d4af37" strokeWidth="1" />
      </svg>
      <svg className="absolute -bottom-4 -right-4 w-12 h-12 scale-[-1]" viewBox="0 0 48 48" aria-hidden="true">
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
              reducedMotion={reducedMotion}
            />
          </div>
        )}
        {children}
      </div>
    </section>
  )
}

// Plasmid-style profession button - Bioshock plasmid vending machine aesthetic
function PlasmidButton({
  profession,
  isActive,
  onClick,
  reducedMotion = false,
}: {
  profession: 'engineer' | 'drummer' | 'fighter'
  isActive: boolean
  onClick: () => void
  reducedMotion?: boolean
}) {
  const icons = { engineer: '[++]', drummer: '||o||', fighter: '><' }
  const names = { engineer: 'ELECTRO BOLT', drummer: 'SONIC BOOM', fighter: 'SPORTBOOST' }
  const descs = { engineer: 'System Engineering', drummer: 'Musical Mastery', fighter: 'Combat Arts' }

  return (
    <button
      onClick={onClick}
      aria-pressed={isActive}
      aria-label={`Select ${profession} profession: ${names[profession]}`}
      className={`relative group transition-all ${reducedMotion ? '' : 'duration-300'} ${
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
          aria-hidden="true"
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

      {/* Selection indicator - art deco triangle */}
      {isActive && (
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2" aria-hidden="true">
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

// Skill display with achievements (no proficiency bars)
function SkillAchievementCard({
  skillName,
  profession,
}: {
  skillName: string
  profession: 'drummer' | 'fighter'
}) {
  const achievements = SKILL_ACHIEVEMENTS[profession]?.[skillName] || []

  return (
    <div
      className="p-3 mb-2 transition-all hover:scale-[1.01]"
      style={{
        background: 'linear-gradient(180deg, rgba(21, 32, 48, 0.8), rgba(10, 21, 32, 0.9))',
        border: '1px solid #d4af3740',
      }}
    >
      <h4
        className="text-xs font-bold mb-2"
        style={{ color: '#d4af37', fontFamily: '"Playfair Display", serif' }}
      >
        {'>>'} {skillName}
      </h4>
      {achievements.length > 0 ? (
        <ul className="space-y-1">
          {achievements.map((achievement, i) => (
            <li
              key={i}
              className="text-[10px] flex items-start gap-2"
              style={{ color: '#e8e0d0' }}
            >
              <span style={{ color: '#d4af3780' }}>-</span>
              {achievement}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-[10px]" style={{ color: '#a09080' }}>
          Demonstrated proficiency
        </p>
      )}
    </div>
  )
}

// Legacy gauge for backwards compatibility (hidden, not used)
function DecoGauge({ name, value, max = 5 }: { name: string; value: number; max?: number }) {
  return (
    <div className="flex items-center gap-4 py-2" role="presentation" aria-hidden="true">
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

// Experience card with art deco styling - Rapture employment records
function ExperienceCard({
  entry,
  reducedMotion = false,
}: {
  entry: typeof EXPERIENCE_DATA[0]
  reducedMotion?: boolean
}) {
  const endDisplay = entry.endDate ? new Date(entry.endDate).getFullYear() : 'Present'
  const startDisplay = new Date(entry.startDate).getFullYear()

  return (
    <article
      className={`relative p-4 group ${reducedMotion ? '' : 'transition-all'}`}
      style={{
        background: 'linear-gradient(180deg, rgba(21, 32, 48, 0.9), rgba(10, 21, 32, 0.95))',
        border: '1px solid #d4af3760',
      }}
      aria-label={`${entry.title} at ${entry.organization}`}
    >
      {/* Top decorative line */}
      <div
        className="absolute top-0 left-4 right-4 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, #d4af37, transparent)' }}
        aria-hidden="true"
      />

      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="text-sm" style={{ color: '#d4af37', fontFamily: '"Playfair Display", serif' }}>
            {entry.title}
          </h4>
          <p className="text-xs mt-1" style={{ color: '#e8e0d0' }}>{entry.organization}</p>
        </div>
        <time
          className="text-[10px] px-2 py-0.5"
          style={{
            background: '#d4af3720',
            border: '1px solid #d4af3740',
            color: '#d4af37',
          }}
          dateTime={`${entry.startDate}/${entry.endDate || ''}`}
        >
          {startDisplay} - {endDisplay}
        </time>
      </div>

      <p className="text-xs mb-3" style={{ color: '#a09080' }}>{entry.description}</p>

      {entry.highlights && entry.highlights.length > 0 && (
        <ul className="space-y-1 mb-3" aria-label="Key achievements">
          {entry.highlights.map((highlight, i) => (
            <li key={i} className="text-xs flex items-start gap-2" style={{ color: '#e8e0d0' }}>
              <span style={{ color: '#d4af37' }} aria-hidden="true">{'>>'}</span>
              {highlight}
            </li>
          ))}
        </ul>
      )}

      <div className="flex gap-2 flex-wrap" aria-label="Skills used">
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
      {!reducedMotion && (
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          style={{
            boxShadow: 'inset 0 0 30px rgba(212, 175, 55, 0.1)',
          }}
          aria-hidden="true"
        />
      )}
    </article>
  )
}

// Tech cloud for engineer (comprehensive tech stack) - Rapture's finest engineering
function TechCloud({
  categories,
  reducedMotion = false,
}: {
  categories: ReturnType<typeof getEngineerSkills>
  reducedMotion?: boolean
}) {
  return (
    <div className="space-y-4" role="list" aria-label="Technical skills by category">
      {categories.map((category) => (
        <div key={category.name} role="listitem">
          <h3
            className="text-xs tracking-widest mb-2 flex items-center gap-2"
            style={{ color: '#d4af37' }}
          >
            <span aria-hidden="true">{category.icon}</span>
            {category.name.toUpperCase()}
          </h3>
          <div className="flex flex-wrap gap-2" role="list" aria-label={`${category.name} technologies`}>
            {category.items.map((tech) => (
              <span
                key={tech}
                role="listitem"
                className={`text-[10px] px-2 py-1 ${reducedMotion ? '' : 'transition-all hover:scale-105'}`}
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

// Skills display for drummer/fighter with achievements (no bars)
function SkillsWithAchievements({
  categories,
  profession,
}: {
  categories: ReturnType<typeof getSkillsByProfession>
  profession: 'drummer' | 'fighter'
}) {
  return (
    <div className="space-y-4" role="list" aria-label="Skills with achievements">
      {categories.map((category) => (
        <div key={category.name} role="listitem">
          <h3
            className="text-xs tracking-widest mb-3 flex items-center gap-2"
            style={{ color: '#d4af37' }}
          >
            <span aria-hidden="true">{category.icon}</span>
            {'>>>'} {category.name.toUpperCase()}
          </h3>
          <div className="space-y-2">
            {category.skills.map((skill) => (
              <SkillAchievementCard
                key={skill.name}
                skillName={skill.name}
                profession={profession}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// Project display as vintage Rapture poster
function VaultPoster({
  project,
  index,
  reducedMotion = false,
}: {
  project: typeof PROJECTS_DATA[0]
  index: number
  reducedMotion?: boolean
}) {
  const [visible, setVisible] = useState(reducedMotion)

  useEffect(() => {
    if (reducedMotion) {
      setVisible(true)
      return
    }
    const timeout = setTimeout(() => setVisible(true), 200 + index * 100)
    return () => clearTimeout(timeout)
  }, [index, reducedMotion])

  return (
    <article
      className={`relative p-4 group cursor-pointer ${
        reducedMotion
          ? ''
          : `transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`
      }`}
      style={{
        background: 'linear-gradient(180deg, rgba(21, 32, 48, 0.9), rgba(10, 21, 32, 0.95))',
        border: '1px solid #d4af3760',
      }}
      aria-label={`Project: ${project.name}`}
    >
      {/* Top decorative line */}
      <div
        className="absolute top-0 left-4 right-4 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, #d4af37, transparent)' }}
        aria-hidden="true"
      />

      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm" style={{ color: '#d4af37', fontFamily: '"Playfair Display", serif' }}>
          {project.name}
        </h3>
        {project.featured && (
          <span
            className="text-[8px] px-2 py-0.5"
            style={{ background: '#d4af37', color: '#0a1520' }}
            aria-label="Featured project"
          >
            * FEATURED
          </span>
        )}
      </div>
      <p className="text-[10px] mb-3" style={{ color: '#a09080' }}>
        {project.tagline}
      </p>
      <div className="flex gap-2 flex-wrap" aria-label="Technologies used">
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
      {!reducedMotion && (
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          style={{
            boxShadow: 'inset 0 0 30px rgba(212, 175, 55, 0.2)',
          }}
          aria-hidden="true"
        />
      )}
    </article>
  )
}

// Company card with art deco styling - Rapture's finest enterprises
function CompanyCard({
  company,
  reducedMotion = false,
}: {
  company: typeof COMPANIES[0]
  reducedMotion?: boolean
}) {
  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`block p-4 group ${reducedMotion ? '' : 'transition-all hover:scale-[1.02]'}`}
      style={{
        background: 'linear-gradient(180deg, rgba(21, 32, 48, 0.9), rgba(10, 21, 32, 0.95))',
        border: '1px solid #d4af3760',
      }}
      aria-label={`${company.name}: ${company.tagline}`}
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl" aria-hidden="true">{company.icon}</span>
        <div>
          <h4
            className={`text-sm ${reducedMotion ? '' : 'group-hover:text-amber-300 transition-colors'}`}
            style={{ color: '#d4af37' }}
          >
            {company.name}
          </h4>
          <p className="text-[10px]" style={{ color: '#a09080' }}>{company.tagline}</p>
        </div>
      </div>
      <p className="text-xs" style={{ color: '#e8e0d0' }}>{company.description}</p>
    </a>
  )
}

// Band card with art deco styling - Rapture's jazz clubs
function BandCard({
  band,
  reducedMotion = false,
}: {
  band: typeof BANDS[0]
  reducedMotion?: boolean
}) {
  const content = (
    <div
      className={`p-4 group ${reducedMotion ? '' : 'transition-all hover:scale-[1.02]'}`}
      style={{
        background: 'linear-gradient(180deg, rgba(21, 32, 48, 0.9), rgba(10, 21, 32, 0.95))',
        border: '1px solid #d4af3760',
      }}
    >
      <h4
        className={`text-sm ${reducedMotion ? '' : 'group-hover:text-amber-300 transition-colors'}`}
        style={{ color: '#d4af37' }}
      >
        {band.name}
      </h4>
      <p className="text-[10px] mt-1" style={{ color: '#a09080' }}>{band.genre} - {band.role}</p>
      <p className="text-xs mt-2" style={{ color: '#e8e0d0' }}>{band.description}</p>
      {!band.url && <p className="text-[10px] mt-2 italic" style={{ color: '#a09080' }}>Website coming soon</p>}
    </div>
  )

  if (band.url) {
    return (
      <a
        href={band.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
        aria-label={`${band.name}: ${band.genre} band`}
      >
        {content}
      </a>
    )
  }
  return <article aria-label={`${band.name}: ${band.genre} band`}>{content}</article>
}

export default function ArtDecoTheme() {
  const { theme } = useTheme()
  const { active, setActive, config } = useProfession()
  const [mounted, setMounted] = useState(false)
  const reducedMotion = useReducedMotion()

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
      role="main"
      aria-label="Alexander Pulido - Art Deco Rapture themed portfolio"
    >
      {/* Background effects */}
      <DecoPattern />
      <UnderwaterRays reducedMotion={reducedMotion} />
      <UnderwaterBubbles reducedMotion={reducedMotion} />
      <WaterCaustics reducedMotion={reducedMotion} />
      <SplicerMasks reducedMotion={reducedMotion} />
      <BigDaddySilhouette />
      <LittleSisterSilhouette reducedMotion={reducedMotion} />

      {/* Profession ornaments */}
      <RaptureOrnaments profession={active} reducedMotion={reducedMotion} />

      {/* Vignette */}
      <div
        className="fixed inset-0 pointer-events-none z-[7]"
        style={{
          background: 'radial-gradient(circle at 50% 30%, transparent 30%, rgba(5, 16, 26, 0.8) 100%)',
        }}
      />

      {/* Header */}
      <header className="relative z-30 p-8 text-center" role="banner">
        {/* Art deco sunburst - lighthouse motif */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 pointer-events-none" aria-hidden="true">
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
          <NeonSign text="ALEXANDER PULIDO" reducedMotion={reducedMotion} />
        </h1>
        <p className="text-sm tracking-wider mt-2" style={{ color: '#e8e0d0' }}>
          {PROFESSIONAL_SUMMARY.headline}
        </p>
        <p className="text-xs tracking-wider mt-1 italic" style={{ color: '#d4af37' }}>
          {PROFESSIONAL_SUMMARY.tagline}
        </p>

        <nav className="flex justify-center gap-4 mt-6" aria-label="Main navigation">
          <Link
            href="/cv"
            className={`px-6 py-2 text-sm tracking-wider ${reducedMotion ? '' : 'transition-all hover:scale-105'}`}
            style={{
              background: 'transparent',
              border: '2px solid #d4af37',
              color: '#d4af37',
            }}
            aria-label="View my dossier (CV)"
          >
            DOSSIER
          </Link>
          <Link
            href="/personal-projects/game-engine"
            className={`px-6 py-2 text-sm tracking-wider ${reducedMotion ? '' : 'transition-all hover:scale-105'}`}
            style={{
              background: '#d4af37',
              color: '#0a1520',
            }}
            aria-label="Enter Rapture - explore personal projects"
          >
            ENTER RAPTURE
          </Link>
          <ThemeSwitcher />
        </nav>
      </header>

      {/* Current Roles */}
      <section className="relative z-20 py-6 px-6" aria-label="Current positions">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap justify-center gap-8" role="list">
            {CURRENT_ROLES.map((role) => (
              <article
                key={role.id}
                role="listitem"
                className="text-center px-6 py-3"
                style={{
                  background: 'rgba(21, 32, 48, 0.6)',
                  border: '1px solid #d4af3740',
                }}
              >
                <p className="text-xs tracking-wider" style={{ color: '#d4af37' }}>{role.title}</p>
                <p className="text-sm" style={{ color: '#e8e0d0' }}>{role.company}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Plasmid selection - profession switcher */}
      <section className="relative z-20 py-8" aria-label="Select profession">
        <h2 className="sr-only">Choose your profession plasmid</h2>
        <div className="flex justify-center gap-6" role="radiogroup" aria-label="Profession selection">
          {(['engineer', 'drummer', 'fighter'] as const).map((prof) => (
            <PlasmidButton
              key={prof}
              profession={prof}
              isActive={active === prof}
              onClick={() => setActive(prof)}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>
      </section>

      {/* Main content */}
      <main className="relative z-20 px-8 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Bio */}
          <BathysphereRevealSection reducedMotion={reducedMotion}>
            <GoldFrame title="ABOUT" reducedMotion={reducedMotion} ariaLabel="About me">
              <p className="text-sm leading-relaxed text-center" style={{ color: '#e8e0d0' }}>
                {aboutData.bio}
              </p>
              <div className="flex justify-center gap-3 mt-4 flex-wrap" role="list" aria-label="Quick facts">
                {aboutData.quickFacts.map((fact, i) => (
                  <span
                    key={i}
                    role="listitem"
                    className="text-[10px] px-3 py-1"
                    style={{
                      background: '#d4af3710',
                      border: '1px solid #d4af3740',
                      color: '#d4af37',
                    }}
                  >
                    <span aria-hidden="true">{'>>'}</span> {fact}
                  </span>
                ))}
              </div>
            </GoldFrame>
          </BathysphereRevealSection>

          {/* Work Experience */}
          {experience.length > 0 && (
            <BathysphereRevealSection reducedMotion={reducedMotion} className="mt-12">
              <GoldFrame title="WORK EXPERIENCE" reducedMotion={reducedMotion} ariaLabel="Work experience">
                <div className="space-y-4">
                  {experience.map((entry) => (
                    <ExperienceCard key={entry.id} entry={entry} reducedMotion={reducedMotion} />
                  ))}
                </div>
              </GoldFrame>
            </BathysphereRevealSection>
          )}

          {/* Grid layout */}
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            {/* Skills / Tech Stack */}
            <GoldFrame
              title={active === 'engineer' ? 'TECH STACK' : 'SKILLS & ACHIEVEMENTS'}
              reducedMotion={reducedMotion}
              ariaLabel={active === 'engineer' ? 'Technical skills' : 'Skills and achievements'}
            >
              {active === 'engineer' ? (
                <TechCloud categories={engineerTech} reducedMotion={reducedMotion} />
              ) : (
                <SkillsWithAchievements
                  categories={otherSkills}
                  profession={active as 'drummer' | 'fighter'}
                />
              )}
            </GoldFrame>

            {/* Projects */}
            <div>
              <div className="text-center mb-4">
                <NeonSign
                  text="FEATURED WORK"
                  className="text-sm tracking-[0.3em]"
                  reducedMotion={reducedMotion}
                />
                <div
                  className="w-32 h-px mx-auto mt-2"
                  style={{ background: 'linear-gradient(90deg, transparent, #d4af37, transparent)' }}
                  aria-hidden="true"
                />
              </div>
              <div className="space-y-3" role="list" aria-label="Featured projects">
                {projects.slice(0, 4).map((project, i) => (
                  <VaultPoster
                    key={project.id}
                    project={project}
                    index={i}
                    reducedMotion={reducedMotion}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Companies (Engineer) */}
          {active === 'engineer' && (
            <div className="mt-12">
              <GoldFrame title="VENTURES" reducedMotion={reducedMotion} ariaLabel="Companies and ventures">
                <div className="grid md:grid-cols-3 gap-4" role="list">
                  {COMPANIES.map((company) => (
                    <div key={company.id} role="listitem">
                      <CompanyCard company={company} reducedMotion={reducedMotion} />
                    </div>
                  ))}
                </div>
              </GoldFrame>
            </div>
          )}

          {/* Bands (Drummer) */}
          {active === 'drummer' && (
            <div className="mt-12">
              <GoldFrame title="BANDS" reducedMotion={reducedMotion} ariaLabel="Musical bands">
                <div className="grid md:grid-cols-3 gap-4" role="list">
                  {BANDS.map((band) => (
                    <div key={band.id} role="listitem">
                      <BandCard band={band} reducedMotion={reducedMotion} />
                    </div>
                  ))}
                </div>
              </GoldFrame>
            </div>
          )}
        </div>
      </main>

      {/* Footer - Rapture's motto */}
      <footer className="relative z-20 py-8 text-center" role="contentinfo">
        <div
          className="inline-block px-8 py-2"
          style={{ border: '1px solid #d4af3740' }}
        >
          <p className="text-xs tracking-[0.3em]" style={{ color: '#d4af37' }}>
            NO GODS OR KINGS - ONLY MAN - MCMXXVI
          </p>
        </div>
        {/* Lighthouse beacon - subtle art deco touch */}
        <div className="mt-4 flex justify-center" aria-hidden="true">
          <svg width="40" height="60" viewBox="0 0 40 60" opacity="0.2">
            {/* Lighthouse base */}
            <path d="M15 60 L10 40 L30 40 L25 60 Z" fill="#d4af37" />
            {/* Lighthouse tower */}
            <rect x="12" y="20" width="16" height="20" fill="#d4af37" />
            {/* Lighthouse top */}
            <path d="M10 20 L20 10 L30 20 Z" fill="#d4af37" />
            {/* Light */}
            <circle cx="20" cy="15" r="3" fill="#f0c850" opacity="0.8" />
            {/* Light rays */}
            <path d="M20 12 L20 5 M14 15 L7 15 M26 15 L33 15" stroke="#f0c850" strokeWidth="1" opacity="0.5" />
          </svg>
        </div>
      </footer>

      {/* Animations */}
      <style jsx global>{`
        /* Respect user's reduced motion preferences */
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }

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
      `}</style>
    </div>
  )
}
