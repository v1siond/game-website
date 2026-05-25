'use client'

import { useEffect, useState } from 'react'
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

// Deep sea diver - pure SVG Bioshock diving suit style (no image imports)
function DiverSilhouette({
  size = 60,
  className = '',
}: {
  size?: number
  className?: string
}) {
  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size * 1.2 }}
      role="img"
      aria-label="Rapture citizen in diving suit"
    >
      <svg
        viewBox="0 0 40 60"
        className="w-full h-full"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="diver-helmet-glow" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#f0c850" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="diver-body-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#d4af37" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#8b7320" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        {/* Diving helmet */}
        <ellipse cx="20" cy="14" rx="10" ry="12" fill="url(#diver-body-gradient)" />
        {/* Helmet porthole */}
        <circle cx="20" cy="12" r="5" fill="url(#diver-helmet-glow)" />
        <circle cx="20" cy="12" r="4" fill="#0a1520" opacity="0.5" />
        <circle cx="20" cy="12" r="5" fill="none" stroke="#d4af37" strokeWidth="0.8" opacity="0.8" />
        {/* Helmet rivets */}
        <circle cx="12" cy="14" r="1" fill="#d4af37" opacity="0.6" />
        <circle cx="28" cy="14" r="1" fill="#d4af37" opacity="0.6" />
        {/* Body/suit */}
        <path
          d="M12 24 Q8 35 10 50 L14 58 L26 58 L30 50 Q32 35 28 24 Q24 22 20 22 Q16 22 12 24"
          fill="url(#diver-body-gradient)"
        />
        {/* Arms */}
        <path d="M12 28 L6 38 L8 40 L14 32" fill="#d4af37" opacity="0.3" />
        <path d="M28 28 L34 38 L32 40 L26 32" fill="#d4af37" opacity="0.3" />
        {/* Tank */}
        <ellipse cx="20" cy="35" rx="3" ry="8" fill="#d4af37" opacity="0.2" />
      </svg>
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

// Section wrapper - content immediately visible, no hiding animations
function RaptureSection({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`relative ${className}`}>
      {children}
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

// Art Deco corner filigree SVG pattern
function DecoCornerFiligree({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) {
  const transforms = {
    tl: '',
    tr: 'scale(-1, 1)',
    bl: 'scale(1, -1)',
    br: 'scale(-1, -1)',
  }
  const positions = {
    tl: '-top-2 -left-2',
    tr: '-top-2 -right-2',
    bl: '-bottom-2 -left-2',
    br: '-bottom-2 -right-2',
  }

  return (
    <svg
      className={`absolute ${positions[position]} w-16 h-16`}
      viewBox="0 0 64 64"
      aria-hidden="true"
      style={{ transform: transforms[position] }}
    >
      <defs>
        <linearGradient id={`corner-gradient-${position}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f0c850" />
          <stop offset="50%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#8b7320" />
        </linearGradient>
      </defs>
      {/* Main corner bracket */}
      <path
        d="M4,60 L4,4 L60,4"
        fill="none"
        stroke={`url(#corner-gradient-${position})`}
        strokeWidth="2.5"
      />
      {/* Inner decorative lines */}
      <path
        d="M10,52 L10,10 L52,10"
        fill="none"
        stroke="#d4af37"
        strokeWidth="1"
        opacity="0.6"
      />
      {/* Art deco fan motif */}
      <path
        d="M4,4 L18,18 M4,4 L20,12 M4,4 L12,20"
        stroke="#d4af37"
        strokeWidth="0.8"
        opacity="0.5"
        fill="none"
      />
      {/* Diamond accent */}
      <path
        d="M4,4 L8,0 L12,4 L8,8 Z"
        fill="#d4af37"
        opacity="0.8"
      />
      {/* Sunburst rays from corner */}
      <path
        d="M4,4 L24,4 M4,4 L4,24 M4,4 L20,20"
        stroke="#d4af37"
        strokeWidth="0.5"
        opacity="0.3"
      />
      {/* Small circles - rivet aesthetic */}
      <circle cx="16" cy="4" r="2" fill="#d4af37" opacity="0.6" />
      <circle cx="4" cy="16" r="2" fill="#d4af37" opacity="0.6" />
      <circle cx="12" cy="12" r="1.5" fill="#f0c850" opacity="0.5" />
    </svg>
  )
}

// Decorative gold frame - Deep Rapture underwater style with textures
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
      {/* Brass filigree corners */}
      <DecoCornerFiligree position="tl" />
      <DecoCornerFiligree position="tr" />
      <DecoCornerFiligree position="bl" />
      <DecoCornerFiligree position="br" />

      {/* Main frame with deep underwater textures */}
      <div
        className="relative p-6 overflow-hidden"
        style={{
          background: `
            linear-gradient(180deg, rgba(21, 32, 48, 0.97), rgba(10, 21, 32, 0.99)),
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 10px,
              rgba(212, 175, 55, 0.02) 10px,
              rgba(212, 175, 55, 0.02) 20px
            )
          `,
          border: '2px solid #d4af37',
          boxShadow: `
            inset 0 0 60px rgba(10, 21, 32, 0.8),
            inset 0 0 20px rgba(65, 200, 232, 0.05),
            0 0 20px rgba(212, 175, 55, 0.15)
          `,
        }}
      >
        {/* Water caustic overlay - subtle light refraction effect */}
        <div
          className={`absolute inset-0 pointer-events-none ${reducedMotion ? '' : 'animate-card-caustics'}`}
          aria-hidden="true"
          style={{
            background: `
              radial-gradient(ellipse 80% 60% at 20% 30%, rgba(65, 200, 232, 0.06) 0%, transparent 50%),
              radial-gradient(ellipse 60% 80% at 80% 70%, rgba(212, 175, 55, 0.05) 0%, transparent 50%),
              radial-gradient(ellipse 100% 50% at 50% 100%, rgba(65, 200, 232, 0.04) 0%, transparent 40%)
            `,
            mixBlendMode: 'screen',
          }}
        />

        {/* Art deco geometric pattern overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          aria-hidden="true"
        >
          <svg className="w-full h-full" preserveAspectRatio="none">
            <defs>
              <pattern id="card-deco-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                {/* Diamond grid */}
                <path d="M30 0 L60 30 L30 60 L0 30 Z" fill="none" stroke="#d4af37" strokeWidth="0.5" />
                {/* Center circle */}
                <circle cx="30" cy="30" r="8" fill="none" stroke="#d4af37" strokeWidth="0.3" />
                {/* Cross accent */}
                <path d="M30 15 L30 22 M30 38 L30 45 M15 30 L22 30 M38 30 L45 30" stroke="#d4af37" strokeWidth="0.3" />
                {/* Corner fans */}
                <path d="M0 0 L10 5 M0 0 L5 10" stroke="#d4af37" strokeWidth="0.3" />
                <path d="M60 0 L50 5 M60 0 L55 10" stroke="#d4af37" strokeWidth="0.3" />
                <path d="M0 60 L10 55 M0 60 L5 50" stroke="#d4af37" strokeWidth="0.3" />
                <path d="M60 60 L50 55 M60 60 L55 50" stroke="#d4af37" strokeWidth="0.3" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#card-deco-pattern)" />
          </svg>
        </div>

        {/* Bubble particles scattered in card */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {[
            { x: 8, y: 15, size: 3 },
            { x: 92, y: 25, size: 2 },
            { x: 5, y: 75, size: 4 },
            { x: 88, y: 85, size: 2.5 },
            { x: 15, y: 45, size: 2 },
            { x: 95, y: 55, size: 3 },
          ].map((bubble, i) => (
            <div
              key={i}
              className={`absolute rounded-full ${reducedMotion ? '' : 'animate-bubble-gentle'}`}
              style={{
                left: `${bubble.x}%`,
                top: `${bubble.y}%`,
                width: bubble.size,
                height: bubble.size,
                background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4), rgba(65,200,232,0.15))',
                border: '0.5px solid rgba(255,255,255,0.2)',
                animationDelay: `${i * 0.8}s`,
              }}
            />
          ))}
        </div>

        {/* Pressure crack effects - subtle stress lines */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.06]"
          aria-hidden="true"
          preserveAspectRatio="none"
        >
          <path
            d="M0,20 Q10,22 20,18 T40,25"
            fill="none"
            stroke="#65c8e8"
            strokeWidth="0.5"
          />
          <path
            d="M80%,90% Q85%,85% 95%,88%"
            fill="none"
            stroke="#65c8e8"
            strokeWidth="0.5"
          />
        </svg>

        {/* Inner gold border glow */}
        <div
          className="absolute inset-[2px] pointer-events-none"
          style={{
            border: '1px solid rgba(212, 175, 55, 0.2)',
            boxShadow: 'inset 0 0 15px rgba(212, 175, 55, 0.08)',
          }}
          aria-hidden="true"
        />

        {/* Title with enhanced neon styling */}
        {title && (
          <div className="relative z-10 text-center mb-4 pb-3" style={{ borderBottom: '1px solid rgba(212, 175, 55, 0.3)' }}>
            <div className="relative inline-block">
              {/* Art deco line accents */}
              <span className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 w-8 h-px mr-3" style={{ background: 'linear-gradient(90deg, transparent, #d4af37)' }} aria-hidden="true" />
              <NeonSign
                text={title}
                className="text-sm tracking-[0.3em]"
                reducedMotion={reducedMotion}
              />
              <span className="absolute right-0 top-1/2 translate-x-full -translate-y-1/2 w-8 h-px ml-3" style={{ background: 'linear-gradient(90deg, #d4af37, transparent)' }} aria-hidden="true" />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
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

// Skill display with achievements (no proficiency bars) - Rapture texture
function SkillAchievementCard({
  skillName,
  profession,
  reducedMotion = false,
}: {
  skillName: string
  profession: 'drummer' | 'fighter'
  reducedMotion?: boolean
}) {
  const achievements = SKILL_ACHIEVEMENTS[profession]?.[skillName] || []

  return (
    <div
      className="relative p-3 mb-2 overflow-hidden group"
      style={{
        background: `
          linear-gradient(180deg, rgba(21, 32, 48, 0.9), rgba(10, 21, 32, 0.95)),
          repeating-linear-gradient(
            30deg,
            transparent,
            transparent 6px,
            rgba(212, 175, 55, 0.01) 6px,
            rgba(212, 175, 55, 0.01) 12px
          )
        `,
        border: '1px solid rgba(212, 175, 55, 0.3)',
        boxShadow: 'inset 0 0 20px rgba(10, 21, 32, 0.4)',
      }}
    >
      {/* Subtle caustic shimmer */}
      <div
        className={`absolute inset-0 pointer-events-none ${reducedMotion ? 'opacity-[0.03]' : 'animate-card-caustics opacity-[0.06]'}`}
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 20% 30%, rgba(65, 200, 232, 0.15) 0%, transparent 50%)',
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10">
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

      {/* Hover brass gleam */}
      {!reducedMotion && (
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          style={{ boxShadow: 'inset 0 0 25px rgba(212, 175, 55, 0.12)' }}
          aria-hidden="true"
        />
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

// Experience card with deep Rapture underwater textures
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
      className="relative p-4 group overflow-hidden"
      style={{
        background: `
          linear-gradient(180deg, rgba(21, 32, 48, 0.95), rgba(10, 21, 32, 0.98)),
          repeating-linear-gradient(
            60deg,
            transparent,
            transparent 12px,
            rgba(212, 175, 55, 0.012) 12px,
            rgba(212, 175, 55, 0.012) 24px
          )
        `,
        border: '1px solid #d4af3760',
        boxShadow: 'inset 0 0 40px rgba(10, 21, 32, 0.6)',
      }}
      aria-label={`${entry.title} at ${entry.organization}`}
    >
      {/* Water caustic effect */}
      <div
        className={`absolute inset-0 pointer-events-none ${reducedMotion ? 'opacity-5' : 'animate-card-caustics opacity-8'}`}
        style={{
          background: `
            radial-gradient(ellipse 60% 40% at 10% 20%, rgba(65, 200, 232, 0.12) 0%, transparent 50%),
            radial-gradient(ellipse 50% 60% at 90% 80%, rgba(212, 175, 55, 0.08) 0%, transparent 50%)
          `,
        }}
        aria-hidden="true"
      />

      {/* Art deco header line with diamond accents */}
      <div className="absolute top-0 left-0 right-0 flex items-center" aria-hidden="true">
        <svg className="w-4 h-4" viewBox="0 0 16 16">
          <path d="M0,8 L8,0 L8,8 L0,8" fill="#d4af37" opacity="0.3" />
        </svg>
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, #d4af37, rgba(212, 175, 55, 0.2), #d4af37)' }} />
        <svg className="w-4 h-4" viewBox="0 0 16 16">
          <path d="M16,8 L8,0 L8,8 L16,8" fill="#d4af37" opacity="0.3" />
        </svg>
      </div>

      {/* Bubble particle */}
      <div
        className={`absolute top-3 right-4 w-2 h-2 rounded-full ${reducedMotion ? '' : 'animate-bubble-gentle'}`}
        style={{ background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.35), rgba(65,200,232,0.12))' }}
        aria-hidden="true"
      />

      <div className="relative z-10 pt-2">
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
              background: 'rgba(212, 175, 55, 0.15)',
              border: '1px solid rgba(212, 175, 55, 0.4)',
              color: '#d4af37',
              boxShadow: '0 0 8px rgba(212, 175, 55, 0.1)',
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
                background: 'rgba(212, 175, 55, 0.1)',
                border: '1px solid rgba(212, 175, 55, 0.25)',
                color: '#a09080',
              }}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Hover glow - underwater brass gleam */}
      {!reducedMotion && (
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          style={{
            boxShadow: 'inset 0 0 50px rgba(212, 175, 55, 0.15)',
            background: 'linear-gradient(180deg, rgba(65, 200, 232, 0.03) 0%, transparent 30%, rgba(212, 175, 55, 0.05) 100%)',
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
  reducedMotion = false,
}: {
  categories: ReturnType<typeof getSkillsByProfession>
  profession: 'drummer' | 'fighter'
  reducedMotion?: boolean
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
                reducedMotion={reducedMotion}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// Project display as vintage Rapture poster - immediately visible, no hiding
function VaultPoster({
  project,
  reducedMotion = false,
}: {
  project: typeof PROJECTS_DATA[0]
  reducedMotion?: boolean
}) {
  return (
    <article
      className="relative p-4 group cursor-pointer overflow-hidden"
      style={{
        background: `
          linear-gradient(180deg, rgba(21, 32, 48, 0.95), rgba(10, 21, 32, 0.98)),
          repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 8px,
            rgba(212, 175, 55, 0.015) 8px,
            rgba(212, 175, 55, 0.015) 16px
          )
        `,
        border: '1px solid #d4af3760',
        boxShadow: 'inset 0 0 30px rgba(10, 21, 32, 0.5)',
      }}
      aria-label={`Project: ${project.name}`}
    >
      {/* Water caustic shimmer */}
      <div
        className={`absolute inset-0 pointer-events-none ${reducedMotion ? 'opacity-5' : 'animate-card-caustics opacity-10'}`}
        style={{
          background: `
            radial-gradient(ellipse 50% 40% at 30% 20%, rgba(65, 200, 232, 0.2) 0%, transparent 50%),
            radial-gradient(ellipse 40% 50% at 70% 80%, rgba(212, 175, 55, 0.15) 0%, transparent 50%)
          `,
        }}
        aria-hidden="true"
      />

      {/* Top decorative line with art deco ends */}
      <div className="absolute top-0 left-0 right-0 flex items-center" aria-hidden="true">
        <div className="w-3 h-3 border-l border-t" style={{ borderColor: '#d4af37' }} />
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, #d4af37, rgba(212, 175, 55, 0.3), #d4af37)' }} />
        <div className="w-3 h-3 border-r border-t" style={{ borderColor: '#d4af37' }} />
      </div>

      {/* Small bubble accents */}
      <div className="absolute top-2 right-3 w-1.5 h-1.5 rounded-full" style={{ background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), rgba(65,200,232,0.1))' }} aria-hidden="true" />
      <div className="absolute bottom-4 left-2 w-2 h-2 rounded-full" style={{ background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2), rgba(65,200,232,0.08))' }} aria-hidden="true" />

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-2 pt-2">
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
      </div>

      {/* Hover glow - brass gleam */}
      {!reducedMotion && (
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          style={{
            boxShadow: 'inset 0 0 40px rgba(212, 175, 55, 0.25)',
            background: 'linear-gradient(180deg, rgba(212, 175, 55, 0.05) 0%, transparent 50%)',
          }}
          aria-hidden="true"
        />
      )}
    </article>
  )
}

// Company card with deep Rapture underwater texture
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
      className="relative block p-4 group overflow-hidden"
      style={{
        background: `
          linear-gradient(180deg, rgba(21, 32, 48, 0.95), rgba(10, 21, 32, 0.98)),
          repeating-linear-gradient(
            -30deg,
            transparent,
            transparent 8px,
            rgba(212, 175, 55, 0.012) 8px,
            rgba(212, 175, 55, 0.012) 16px
          )
        `,
        border: '1px solid rgba(212, 175, 55, 0.4)',
        boxShadow: 'inset 0 0 25px rgba(10, 21, 32, 0.5)',
      }}
      aria-label={`${company.name}: ${company.tagline}`}
    >
      {/* Water caustic shimmer */}
      <div
        className={`absolute inset-0 pointer-events-none ${reducedMotion ? 'opacity-[0.04]' : 'animate-card-caustics opacity-[0.08]'}`}
        style={{
          background: `
            radial-gradient(ellipse 50% 40% at 80% 20%, rgba(65, 200, 232, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse 40% 50% at 20% 80%, rgba(212, 175, 55, 0.1) 0%, transparent 50%)
          `,
        }}
        aria-hidden="true"
      />

      {/* Bubble accent */}
      <div
        className={`absolute top-2 right-2 w-1.5 h-1.5 rounded-full ${reducedMotion ? '' : 'animate-bubble-gentle'}`}
        style={{ background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), rgba(65,200,232,0.1))' }}
        aria-hidden="true"
      />

      <div className="relative z-10">
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
      </div>

      {/* Hover brass gleam */}
      {!reducedMotion && (
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          style={{
            boxShadow: 'inset 0 0 35px rgba(212, 175, 55, 0.2)',
            background: 'linear-gradient(180deg, rgba(212, 175, 55, 0.04) 0%, transparent 40%)',
          }}
          aria-hidden="true"
        />
      )}
    </a>
  )
}

// Band card with deep Rapture underwater texture - jazz clubs aesthetic
function BandCard({
  band,
  reducedMotion = false,
}: {
  band: typeof BANDS[0]
  reducedMotion?: boolean
}) {
  const content = (
    <div
      className="relative p-4 group overflow-hidden"
      style={{
        background: `
          linear-gradient(180deg, rgba(21, 32, 48, 0.95), rgba(10, 21, 32, 0.98)),
          repeating-linear-gradient(
            45deg,
            transparent,
            transparent 8px,
            rgba(212, 175, 55, 0.012) 8px,
            rgba(212, 175, 55, 0.012) 16px
          )
        `,
        border: '1px solid rgba(212, 175, 55, 0.4)',
        boxShadow: 'inset 0 0 25px rgba(10, 21, 32, 0.5)',
      }}
    >
      {/* Water caustic shimmer */}
      <div
        className={`absolute inset-0 pointer-events-none ${reducedMotion ? 'opacity-[0.04]' : 'animate-card-caustics opacity-[0.08]'}`}
        style={{
          background: `
            radial-gradient(ellipse 50% 40% at 70% 30%, rgba(65, 200, 232, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse 40% 50% at 30% 70%, rgba(212, 175, 55, 0.1) 0%, transparent 50%)
          `,
        }}
        aria-hidden="true"
      />

      {/* Bubble accent */}
      <div
        className={`absolute top-3 right-3 w-2 h-2 rounded-full ${reducedMotion ? '' : 'animate-bubble-gentle'}`}
        style={{ background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), rgba(65,200,232,0.1))' }}
        aria-hidden="true"
      />

      <div className="relative z-10">
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

      {/* Hover brass gleam */}
      {!reducedMotion && (
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          style={{
            boxShadow: 'inset 0 0 35px rgba(212, 175, 55, 0.2)',
            background: 'linear-gradient(180deg, rgba(212, 175, 55, 0.04) 0%, transparent 40%)',
          }}
          aria-hidden="true"
        />
      )}
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
      <header className="relative z-30 p-6" role="banner">
        <div className="max-w-6xl mx-auto flex justify-between items-start">
          <div className="flex items-center gap-4">
            {/* Art deco sunburst - lighthouse motif */}
            <div className="relative w-16 h-16 pointer-events-none flex-shrink-0" aria-hidden="true">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute top-1/2 left-1/2 w-0.5 h-8"
                  style={{
                    background: 'linear-gradient(to top, #d4af37, transparent)',
                    transform: `translate(-50%, -100%) rotate(${i * 45}deg)`,
                    transformOrigin: 'bottom center',
                    opacity: 0.4,
                  }}
                />
              ))}
              <DiverSilhouette size={40} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div>
              <h1
                className="text-3xl tracking-[0.15em]"
                style={{
                  color: '#d4af37',
                  textShadow: '0 0 40px rgba(212, 175, 55, 0.5)',
                }}
              >
                <NeonSign text="ALEXANDER PULIDO" reducedMotion={reducedMotion} />
              </h1>
              <p className="text-sm tracking-wider mt-1" style={{ color: '#e8e0d0' }}>
                {PROFESSIONAL_SUMMARY.headline}
              </p>
              <p className="text-xs tracking-wider mt-1 italic" style={{ color: '#d4af37' }}>
                {PROFESSIONAL_SUMMARY.tagline}
              </p>
            </div>
          </div>

          <nav className="flex gap-3 items-center" aria-label="Main navigation">
            <Link
              href="/cv"
              className={`px-4 py-2 text-sm tracking-wider ${reducedMotion ? '' : 'transition-all hover:scale-105'}`}
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
              className={`px-4 py-2 text-sm tracking-wider ${reducedMotion ? '' : 'transition-all hover:scale-105'}`}
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
        </div>
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
          {/* Bio - immediately visible */}
          <RaptureSection>
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
          </RaptureSection>

          {/* Work Experience - immediately visible */}
          {experience.length > 0 && (
            <RaptureSection className="mt-12">
              <GoldFrame title="WORK EXPERIENCE" reducedMotion={reducedMotion} ariaLabel="Work experience">
                <div className="space-y-4">
                  {experience.map((entry) => (
                    <ExperienceCard key={entry.id} entry={entry} reducedMotion={reducedMotion} />
                  ))}
                </div>
              </GoldFrame>
            </RaptureSection>
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
                  reducedMotion={reducedMotion}
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
                {projects.slice(0, 4).map((project) => (
                  <VaultPoster
                    key={project.id}
                    project={project}
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

        @keyframes bubble-small {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.5; }
          50% { transform: translateY(-8px) scale(0.8); opacity: 0.3; }
        }
        .animate-bubble-small {
          animation: bubble-small 1.5s ease-in-out infinite;
        }

        /* Card caustic light effect - subtle water refraction inside cards */
        @keyframes card-caustics {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.08;
          }
          25% {
            transform: translate(2%, -1%) scale(1.02);
            opacity: 0.12;
          }
          50% {
            transform: translate(-1%, 2%) scale(0.98);
            opacity: 0.06;
          }
          75% {
            transform: translate(1%, 1%) scale(1.01);
            opacity: 0.1;
          }
        }
        .animate-card-caustics {
          animation: card-caustics 12s ease-in-out infinite;
        }

        /* Gentle bubble float for card bubble particles */
        @keyframes bubble-gentle {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.4;
          }
          33% {
            transform: translateY(-3px) translateX(1px);
            opacity: 0.5;
          }
          66% {
            transform: translateY(-1px) translateX(-1px);
            opacity: 0.35;
          }
        }
        .animate-bubble-gentle {
          animation: bubble-gentle 6s ease-in-out infinite;
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
