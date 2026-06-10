'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { useTheme } from '@/themes/ThemeContext'
import { useProfession } from '@/contexts/ProfessionContext'
import { ABOUT_DATA, PROFESSIONAL_SUMMARY } from '@/data/about'
import { PROJECTS_DATA } from '@/data/projects'
import { getSkillsByProfession, getEngineerSkills } from '@/data/skills'
import { CURRENT_ROLES } from '@/data/roles'
import { COMPANIES } from '@/data/companies'
import { BANDS } from '@/data/bands'
import { EXPERIENCE_DATA, filterExperienceByProfession } from '@/data/experience'
import { useInViewTrigger } from '@/hooks/useScrollAnimation'

// Resident Evil actual game palette - from gameplay screenshots
// RE1 Remake mansion, RE4 village, RE7 Baker house
const RE = {
  // Blacks and deep shadows
  void: '#0f0a08',
  shadow: '#1a1410',

  // Sepia browns (dominant)
  darkSepia: '#2a2018',
  sepia: '#3d3020',
  midBrown: '#5c4a38',

  // Olive/muddy greens
  olive: '#4a4a30',
  deadGreen: '#3a4030',

  // Rust/burgundy accents - HORROR colors
  rust: '#6b4030',
  burgundy: '#4a2020',
  blood: '#6b1010',
  bloodDark: '#3a0808',

  // Warm highlights (candlelight/fireplace)
  warmGlow: '#c49050',
  candlelight: '#e8a860',
  cream: '#d8c8a8',
  ivory: '#f0e8d8',

  // Fog/mist
  fog: '#a8a090',
  mistDark: '#706860',
}

// CSS texture patterns for horror feel
const TEXTURES = {
  // Scratched/clawed surface
  scratches: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 20 L25 35 M15 40 L30 60 M5 70 L20 85 M60 10 L75 25 M70 50 L85 70 M55 80 L70 95' stroke='%23000' stroke-width='0.5' opacity='0.1'/%3E%3C/svg%3E")`,
  // Decayed/worn paper
  wornPaper: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
  // Blood stain texture
  bloodStain: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='30' cy='30' r='15' fill='%236b1010' opacity='0.05'/%3E%3Ccircle cx='45' cy='20' r='8' fill='%233a0808' opacity='0.03'/%3E%3C/svg%3E")`,
}

// SVG Survivor silhouette with flashlight
function SurvivorSprite({
  direction = 'right',
  size = 60,
}: {
  direction?: 'left' | 'right'
  size?: number
}) {
  return (
    <div className="relative" style={{ width: size, height: size * 1.4 }}>
      <svg
        viewBox="0 0 50 70"
        className="w-full h-full"
        style={{ transform: direction === 'left' ? 'scaleX(-1)' : 'none' }}
      >
        {/* Head */}
        <ellipse cx="25" cy="10" rx="7" ry="8" fill={RE.shadow} />
        {/* Body */}
        <path d="M20,18 L18,45 L22,45 L25,25 L28,45 L32,45 L30,18 Z" fill={RE.shadow} />
        {/* Arms - one forward holding gun/flashlight */}
        <path d="M30,22 L45,28" stroke={RE.shadow} strokeWidth="4" strokeLinecap="round" />
        <path d="M18,22 L12,35" stroke={RE.shadow} strokeWidth="4" strokeLinecap="round" />
        {/* Legs running */}
        <path d="M22,45 L18,65" stroke={RE.shadow} strokeWidth="5" strokeLinecap="round" />
        <path d="M28,45 L35,60" stroke={RE.shadow} strokeWidth="5" strokeLinecap="round" />
      </svg>
      {/* Flashlight beam */}
      <div
        className="absolute top-1/4"
        style={{
          [direction === 'right' ? 'right' : 'left']: '-30px',
          width: '50px',
          height: '20px',
          background: `linear-gradient(${direction === 'right' ? '90deg' : '270deg'}, rgba(255,220,150,0.5) 0%, transparent 100%)`,
          filter: 'blur(8px)',
          transform: `rotate(${direction === 'right' ? '5deg' : '-5deg'})`,
        }}
      />
    </div>
  )
}

// Zombie silhouette chasing
function ZombieChaser({
  direction = 'right',
  size = 70,
}: {
  direction?: 'left' | 'right'
  size?: number
}) {
  return (
    <div className="relative" style={{ width: size, height: size * 1.3 }}>
      <svg
        viewBox="0 0 60 80"
        className="w-full h-full"
        style={{ transform: direction === 'left' ? 'scaleX(-1)' : 'none' }}
      >
        {/* Zombie shambling silhouette */}
        <ellipse cx="30" cy="12" rx="10" ry="12" fill={RE.shadow} />
        {/* Hunched body */}
        <path d="M22,22 L18,55 L26,55 L28,35 L32,35 L34,55 L42,55 L38,22 Z" fill={RE.shadow} />
        {/* Reaching arms - outstretched */}
        <path d="M22,28 Q5,32 0,45" stroke={RE.shadow} strokeWidth="6" strokeLinecap="round" fill="none" />
        <path d="M24,35 Q10,40 5,50" stroke={RE.shadow} strokeWidth="5" strokeLinecap="round" fill="none" />
        {/* Shambling legs */}
        <path d="M24,55 L20,75" stroke={RE.shadow} strokeWidth="6" strokeLinecap="round" />
        <path d="M36,55 L42,72" stroke={RE.shadow} strokeWidth="6" strokeLinecap="round" />
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
            className="absolute top-1/2 left-0"
            style={{
              animation: direction === 'left'
                ? 'survivor-run-left 1.2s ease-out forwards'
                : 'survivor-run-right 1.2s ease-out forwards',
              willChange: 'transform',
            }}
          >
            <SurvivorSprite direction={direction === 'left' ? 'right' : 'left'} size={50} />
          </div>
          {/* Zombie chasing */}
          <div
            className="absolute top-1/2 left-0"
            style={{
              animation: direction === 'left'
                ? 'zombie-chase-left 1.2s ease-out forwards'
                : 'zombie-chase-right 1.2s ease-out forwards',
              willChange: 'transform',
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

// Blood splatter SVG component - sepia-toned for RE
function BloodSplatter({ position, size = 100, rotation = 0 }: { position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right', size?: number, rotation?: number }) {
  const positionClasses = {
    'top-left': 'top-0 left-0',
    'top-right': 'top-0 right-0',
    'bottom-left': 'bottom-0 left-0',
    'bottom-right': 'bottom-0 right-0',
  }

  return (
    <div
      className={`fixed ${positionClasses[position]} pointer-events-none z-[4] opacity-40`}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <svg width={size} height={size} viewBox="0 0 100 100">
        <defs>
          <linearGradient id={`bloodGrad-${position}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={RE.burgundy} />
            <stop offset="50%" stopColor={RE.rust} />
            <stop offset="100%" stopColor={RE.darkSepia} />
          </linearGradient>
        </defs>
        {/* Main splatter */}
        <path
          d="M20,5 Q25,20 15,35 Q5,50 20,60 Q10,75 25,85 L30,95 Q35,80 45,90 Q55,85 60,75 Q75,80 70,60 Q85,55 75,40 Q90,30 70,20 Q80,10 60,15 Q50,5 35,15 Z"
          fill={`url(#bloodGrad-${position})`}
        />
        {/* Drips */}
        <path d="M25,85 Q27,92 25,100" stroke={RE.rust} strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M45,90 Q46,96 44,100" stroke={RE.burgundy} strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M15,60 Q12,70 15,80" stroke={RE.rust} strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* Smaller splatters */}
        <circle cx="10" cy="30" r="5" fill={RE.burgundy} opacity="0.8" />
        <circle cx="85" cy="25" r="4" fill={RE.rust} />
        <ellipse cx="75" cy="70" rx="6" ry="4" fill={RE.rust} opacity="0.7" />
      </svg>
    </div>
  )
}

// Zombie silhouette component - lurking in shadows
function ZombieSilhouettes() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[2] overflow-hidden">
      {/* Left zombie */}
      <div className="absolute -left-10 bottom-0 opacity-[0.12] animate-zombie-sway">
        <svg width="150" height="300" viewBox="0 0 150 300">
          <ellipse cx="75" cy="30" rx="25" ry="30" fill={RE.shadow} />
          <path
            d="M75,60 L75,180 M60,180 L55,280 M90,180 L95,270"
            stroke={RE.shadow}
            strokeWidth="30"
            strokeLinecap="round"
          />
          <path d="M50,100 Q20,90 10,130 Q5,150 20,160" fill="none" stroke={RE.shadow} strokeWidth="15" strokeLinecap="round" />
          <path d="M100,100 Q130,90 140,130 Q145,150 130,160" fill="none" stroke={RE.shadow} strokeWidth="15" strokeLinecap="round" />
        </svg>
      </div>
      {/* Right zombie */}
      <div className="absolute -right-10 bottom-0 opacity-[0.10] animate-zombie-sway-delayed">
        <svg width="150" height="280" viewBox="0 0 150 280" style={{ transform: 'scaleX(-1)' }}>
          <ellipse cx="75" cy="28" rx="23" ry="28" fill={RE.shadow} />
          <path d="M75,56 L75,180 M60,180 L55,270 M90,180 L92,265" stroke={RE.shadow} strokeWidth="28" strokeLinecap="round" />
          <path d="M50,100 Q20,110 15,145" fill="none" stroke={RE.shadow} strokeWidth="14" strokeLinecap="round" />
        </svg>
      </div>
      {/* Background lurker - further back */}
      <div className="absolute left-1/3 bottom-0 opacity-[0.06]">
        <svg width="100" height="200" viewBox="0 0 100 200">
          <ellipse cx="50" cy="20" rx="18" ry="22" fill={RE.void} />
          <path d="M50,42 L50,150" stroke={RE.void} strokeWidth="25" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  )
}

// Classic typewriter save point - iconic RE element
function TypewriterSavePoint() {
  return (
    <svg width="120" height="80" viewBox="0 0 120 80" className="opacity-70">
      {/* Desk/table surface */}
      <rect x="10" y="55" width="100" height="8" rx="2" fill={RE.sepia} />
      <rect x="5" y="63" width="110" height="4" fill={RE.midBrown} />
      {/* Typewriter body */}
      <rect x="25" y="25" width="70" height="30" rx="3" fill={RE.darkSepia} />
      <rect x="28" y="28" width="64" height="24" rx="2" fill={RE.shadow} />
      {/* Paper */}
      <rect x="35" y="15" width="50" height="18" fill={RE.ivory} />
      <rect x="38" y="18" width="44" height="1" fill={RE.sepia} opacity="0.4" />
      <rect x="38" y="22" width="40" height="1" fill={RE.sepia} opacity="0.4" />
      <rect x="38" y="26" width="35" height="1" fill={RE.sepia} opacity="0.4" />
      {/* Platen/roller */}
      <rect x="30" y="12" width="60" height="5" rx="2" fill={RE.midBrown} />
      {/* Keys suggestion */}
      <rect x="32" y="42" width="56" height="8" rx="1" fill={RE.void} />
      {/* Carriage return lever */}
      <path d="M90,20 L100,15 L102,18 L92,23" fill={RE.midBrown} />
    </svg>
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

// Sepia vignette with subtle pulse
function SepiaVignette() {
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(true)
      setTimeout(() => setPulse(false), 200)
      setTimeout(() => {
        setPulse(true)
        setTimeout(() => setPulse(false), 200)
      }, 300)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[6] transition-opacity duration-300"
      style={{
        background: `radial-gradient(ellipse at 50% 50%, transparent 20%, ${RE.darkSepia}90 70%, ${RE.void} 100%)`,
        opacity: pulse ? 0.95 : 0.85,
      }}
    />
  )
}

// Ink ribbon decoration - classic RE save item
function InkRibbon({ className = '' }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <svg width="40" height="24" viewBox="0 0 40 24">
        <defs>
          <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={RE.darkSepia} />
            <stop offset="50%" stopColor={RE.shadow} />
            <stop offset="100%" stopColor={RE.void} />
          </linearGradient>
        </defs>
        {/* Ribbon cartridge */}
        <rect x="5" y="4" width="30" height="16" rx="2" fill="url(#ribbonGrad)" />
        {/* Spool holes */}
        <circle cx="12" cy="12" r="4" fill={RE.void} />
        <circle cx="28" cy="12" r="4" fill={RE.void} />
        {/* Ribbon visible through center */}
        <rect x="16" y="10" width="8" height="4" fill={RE.shadow} />
        {/* Metallic rim */}
        <circle cx="12" cy="12" r="2.5" fill="none" stroke={RE.warmGlow} strokeWidth="0.5" opacity="0.5" />
        <circle cx="28" cy="12" r="2.5" fill="none" stroke={RE.warmGlow} strokeWidth="0.5" opacity="0.5" />
      </svg>
    </div>
  )
}

// Dripping blood effect - slow animated drip
function BloodDrip({ side, delay = 0 }: { side: 'left' | 'right', delay?: number }) {
  return (
    <div
      className={`fixed top-0 ${side === 'left' ? 'left-8' : 'right-12'} pointer-events-none z-[8]`}
      style={{ animationDelay: `${delay}s` }}
    >
      <svg width="12" height="120" viewBox="0 0 12 120" className="animate-blood-drip">
        {/* Blood pool at top */}
        <ellipse cx="6" cy="5" rx="6" ry="5" fill={RE.blood} opacity="0.7" />
        {/* Drip stream */}
        <path
          d="M6,10 Q4,30 6,50 Q8,70 5,90 Q6,105 6,115"
          stroke={RE.blood}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          opacity="0.6"
        />
        {/* Drip drop at end */}
        <ellipse cx="6" cy="118" rx="4" ry="3" fill={RE.bloodDark} opacity="0.5" />
      </svg>
    </div>
  )
}

// Biohazard symbol - Umbrella Corp style
function BiohazardSymbol({ className = '' }: { className?: string }) {
  return (
    <div className={`opacity-15 pointer-events-none ${className}`}>
      <svg width="80" height="80" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r="38" fill="none" stroke={RE.rust} strokeWidth="2" />
        {/* Biohazard trefoil */}
        <g fill={RE.rust}>
          <circle cx="40" cy="25" r="8" />
          <circle cx="27" cy="48" r="8" />
          <circle cx="53" cy="48" r="8" />
          {/* Connecting arcs */}
          <path d="M40,33 Q33,40 30,48" strokeWidth="4" fill="none" stroke={RE.rust} />
          <path d="M40,33 Q47,40 50,48" strokeWidth="4" fill="none" stroke={RE.rust} />
          <path d="M30,48 Q40,55 50,48" strokeWidth="4" fill="none" stroke={RE.rust} />
        </g>
        {/* Center ring */}
        <circle cx="40" cy="40" r="6" fill="none" stroke={RE.rust} strokeWidth="2" />
      </svg>
    </div>
  )
}

// Caution/Danger tape - diagonal stripes
function DangerTape({ position }: { position: 'top' | 'bottom' }) {
  return (
    <div
      className={`fixed ${position === 'top' ? 'top-24' : 'bottom-20'} left-0 right-0 h-6 pointer-events-none z-[8] opacity-30 overflow-hidden`}
      style={{ transform: `rotate(${position === 'top' ? '-2deg' : '1deg'})` }}
    >
      <div
        className="w-[200%] h-full"
        style={{
          background: `repeating-linear-gradient(
            -45deg,
            ${RE.candlelight},
            ${RE.candlelight} 20px,
            ${RE.void} 20px,
            ${RE.void} 40px
          )`,
        }}
      />
    </div>
  )
}

// Warning sign - Umbrella style
function WarningSign() {
  return (
    <div className="fixed bottom-32 left-4 opacity-40 pointer-events-none z-[11]">
      <svg width="60" height="70" viewBox="0 0 60 70">
        {/* Sign post */}
        <rect x="28" y="35" width="4" height="35" fill={RE.midBrown} />
        {/* Sign board */}
        <rect x="5" y="5" width="50" height="30" rx="2" fill={RE.candlelight} />
        <rect x="7" y="7" width="46" height="26" rx="1" fill={RE.void} />
        {/* Skull icon */}
        <circle cx="30" cy="15" r="6" fill={RE.cream} />
        <rect x="26" cy="21" width="8" height="8" fill={RE.cream} />
        {/* Crossbones */}
        <path d="M20,28 L40,18 M20,18 L40,28" stroke={RE.cream} strokeWidth="3" strokeLinecap="round" />
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

// Art Section Divider - Zombie Silhouette Scene
function ArtSectionZombies() {
  return (
    <div className="relative py-12 my-8 overflow-hidden" style={{ borderTop: `1px solid ${RE.midBrown}40`, borderBottom: `1px solid ${RE.midBrown}40` }}>
      {/* Blood drip decorations along top */}
      <div className="absolute top-0 left-0 right-0 flex justify-around">
        {[20, 35, 55, 70, 85].map((pos, i) => (
          <svg key={i} width="8" height="40" viewBox="0 0 8 40" style={{ marginLeft: `${pos}%`, opacity: 0.4 + (i * 0.1) }}>
            <path d={`M4,0 Q2,${10 + i * 3} 4,${20 + i * 5} Q6,${30 + i * 3} 4,40`} stroke={RE.blood} strokeWidth="3" fill="none" strokeLinecap="round" />
            <ellipse cx="4" cy="38" rx="3" ry="2" fill={RE.bloodDark} />
          </svg>
        ))}
      </div>

      {/* Zombie silhouettes walking across */}
      <div className="flex justify-center items-end gap-16 opacity-40">
        {/* Left zombie - arms reaching */}
        <svg width="80" height="120" viewBox="0 0 80 120">
          <ellipse cx="40" cy="15" rx="12" ry="15" fill={RE.shadow} />
          <path d="M32,28 L28,80 L36,80 L38,50 L42,50 L44,80 L52,80 L48,28 Z" fill={RE.shadow} />
          <path d="M32,35 Q10,40 5,55" stroke={RE.shadow} strokeWidth="8" strokeLinecap="round" fill="none" />
          <path d="M34,45 Q15,50 10,60" stroke={RE.shadow} strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M34,80 L28,110" stroke={RE.shadow} strokeWidth="10" strokeLinecap="round" />
          <path d="M46,80 L55,105" stroke={RE.shadow} strokeWidth="10" strokeLinecap="round" />
        </svg>

        {/* Center typewriter */}
        <div className="relative">
          <TypewriterSavePoint />
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-sm tracking-widest" style={{ color: RE.warmGlow }}>
            * * *
          </div>
        </div>

        {/* Right zombie - shambling */}
        <svg width="80" height="120" viewBox="0 0 80 120" style={{ transform: 'scaleX(-1)' }}>
          <ellipse cx="40" cy="18" rx="13" ry="16" fill={RE.shadow} />
          <path d="M30,32 L25,85 L35,85 L38,55 L42,55 L45,85 L55,85 L50,32 Z" fill={RE.shadow} />
          <path d="M30,40 Q5,45 0,70" stroke={RE.shadow} strokeWidth="9" strokeLinecap="round" fill="none" />
          <path d="M32,82 L22,115" stroke={RE.shadow} strokeWidth="11" strokeLinecap="round" />
          <path d="M48,82 L58,110" stroke={RE.shadow} strokeWidth="11" strokeLinecap="round" />
        </svg>
      </div>

      {/* Scattered herbs */}
      <div className="absolute bottom-2 left-8 opacity-50">
        <HerbIcon color="green" />
      </div>
      <div className="absolute bottom-4 right-12 opacity-40">
        <HerbIcon color="red" />
      </div>
      <div className="absolute bottom-2 left-1/4 opacity-35">
        <HerbIcon color="blue" />
      </div>
    </div>
  )
}

// Art Section Divider - Blood Splatter and Typewriter
function ArtSectionTypewriter() {
  return (
    <div className="relative py-10 my-8" style={{ borderTop: `1px solid ${RE.midBrown}40`, borderBottom: `1px solid ${RE.midBrown}40` }}>
      {/* Blood splatter background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <svg className="w-full h-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 400 100">
          <defs>
            <linearGradient id="artBloodGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={RE.burgundy} />
              <stop offset="100%" stopColor={RE.bloodDark} />
            </linearGradient>
          </defs>
          {/* Large splatter left */}
          <path d="M30,20 Q40,35 25,50 Q15,65 35,75 L45,85 Q55,70 65,80 Q80,75 75,55 Q95,50 80,35 Q90,20 70,25 Q60,10 45,20 Z" fill="url(#artBloodGrad)" />
          {/* Drips */}
          <path d="M35,75 Q33,85 36,95" stroke={RE.blood} strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M55,80 Q54,88 56,95" stroke={RE.bloodDark} strokeWidth="1.5" fill="none" strokeLinecap="round" />
          {/* Right splatter */}
          <path d="M320,15 Q335,25 325,45 Q340,55 330,70 L340,80 Q360,75 355,50 Q375,45 360,30 Q365,15 345,20 Z" fill="url(#artBloodGrad)" />
        </svg>
      </div>

      {/* Center content - typewriter with ink ribbons */}
      <div className="flex justify-center items-center gap-8">
        <InkRibbon />
        <div className="flex flex-col items-center">
          <TypewriterSavePoint />
          <p className="mt-2 text-sm tracking-[0.5em] uppercase" style={{ color: RE.fog }}>
            SAVE YOUR PROGRESS
          </p>
        </div>
        <InkRibbon />
      </div>

      {/* Biohazard symbols in corners */}
      <div className="absolute top-2 left-4 opacity-15">
        <svg width="30" height="30" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="38" fill="none" stroke={RE.rust} strokeWidth="2" />
          <g fill={RE.rust}>
            <circle cx="40" cy="25" r="8" />
            <circle cx="27" cy="48" r="8" />
            <circle cx="53" cy="48" r="8" />
          </g>
        </svg>
      </div>
      <div className="absolute top-2 right-4 opacity-15">
        <svg width="30" height="30" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="38" fill="none" stroke={RE.rust} strokeWidth="2" />
          <g fill={RE.rust}>
            <circle cx="40" cy="25" r="8" />
            <circle cx="27" cy="48" r="8" />
            <circle cx="53" cy="48" r="8" />
          </g>
        </svg>
      </div>
    </div>
  )
}

// Art Section Divider - Herb Garden Scene
function ArtSectionHerbs() {
  return (
    <div className="relative py-10 my-8" style={{ borderTop: `1px solid ${RE.midBrown}40`, borderBottom: `1px solid ${RE.midBrown}40` }}>
      {/* Fog effect */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent, ${RE.fog}40, transparent)`,
          filter: 'blur(20px)',
        }}
      />

      {/* Herb collection display */}
      <div className="flex justify-center items-end gap-6">
        {/* Green herb x3 */}
        <div className="flex gap-1">
          <HerbIcon color="green" />
          <HerbIcon color="green" />
          <HerbIcon color="green" />
        </div>

        {/* Divider */}
        <div className="h-12 w-px" style={{ background: `linear-gradient(180deg, transparent, ${RE.midBrown}, transparent)` }} />

        {/* Mixed herbs */}
        <div className="flex gap-2 items-end">
          <HerbIcon color="green" />
          <HerbIcon color="red" />
        </div>

        {/* Center typewriter icon */}
        <div className="px-4">
          <svg width="60" height="40" viewBox="0 0 120 80" className="opacity-50">
            <rect x="25" y="25" width="70" height="30" rx="3" fill={RE.darkSepia} />
            <rect x="35" y="15" width="50" height="18" fill={RE.ivory} />
            <rect x="30" y="12" width="60" height="5" rx="2" fill={RE.midBrown} />
          </svg>
        </div>

        {/* Divider */}
        <div className="h-12 w-px" style={{ background: `linear-gradient(180deg, transparent, ${RE.midBrown}, transparent)` }} />

        {/* Blue + green mix */}
        <div className="flex gap-2 items-end">
          <HerbIcon color="blue" />
          <HerbIcon color="green" />
        </div>

        {/* Divider */}
        <div className="h-12 w-px" style={{ background: `linear-gradient(180deg, transparent, ${RE.midBrown}, transparent)` }} />

        {/* Red herb solo */}
        <div className="flex gap-1">
          <HerbIcon color="red" />
          <HerbIcon color="red" />
        </div>
      </div>

      {/* Bottom text */}
      <div className="text-center mt-4">
        <p className="text-sm tracking-[0.3em]" style={{ color: RE.warmGlow }}>
          - - - ITEM BOX - - -
        </p>
      </div>

      {/* Blood drip accents */}
      <div className="absolute bottom-0 left-1/4">
        <svg width="4" height="20" viewBox="0 0 4 20" style={{ opacity: 0.3 }}>
          <path d="M2,0 Q1,10 2,20" stroke={RE.blood} strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      </div>
      <div className="absolute bottom-0 right-1/3">
        <svg width="4" height="25" viewBox="0 0 4 25" style={{ opacity: 0.25 }}>
          <path d="M2,0 Q3,12 2,25" stroke={RE.bloodDark} strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      </div>
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

// Warm isolated light source - like fireplace or oil lamp in RE
function WarmLightSource() {
  const [flicker, setFlicker] = useState(1)

  useEffect(() => {
    const interval = setInterval(() => {
      setFlicker(0.85 + Math.random() * 0.3)
    }, 100)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-[3]">
      {/* Main warm glow - upper area like RE rooms */}
      <div
        style={{
          position: 'absolute',
          top: '5%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80%',
          height: '40%',
          background: `radial-gradient(ellipse at 50% 30%, ${RE.candlelight}${Math.round(flicker * 25).toString(16).padStart(2, '0')} 0%, ${RE.warmGlow}15 30%, transparent 70%)`,
          filter: 'blur(40px)',
        }}
      />
      {/* Secondary glow spots - like scattered candles */}
      <div
        style={{
          position: 'absolute',
          top: '60%',
          left: '20%',
          width: '200px',
          height: '200px',
          background: `radial-gradient(circle, ${RE.warmGlow}${Math.round(flicker * 20).toString(16).padStart(2, '0')}, transparent 70%)`,
          filter: 'blur(30px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '40%',
          right: '15%',
          width: '150px',
          height: '150px',
          background: `radial-gradient(circle, ${RE.candlelight}${Math.round(flicker * 15).toString(16).padStart(2, '0')}, transparent 70%)`,
          filter: 'blur(25px)',
        }}
      />
    </div>
  )
}

// Oil lamp wall sconce - Victorian style
function WallSconce({ side }: { side: 'left' | 'right' }) {
  return (
    <div
      className={`fixed top-1/4 ${side === 'left' ? 'left-4' : 'right-4'} opacity-50 z-[11]`}
    >
      <svg width="36" height="70" viewBox="0 0 36 70">
        {/* Wall mount bracket */}
        <path d="M18,0 L18,15 Q10,20 12,30" stroke={RE.midBrown} strokeWidth="4" fill="none" />
        {/* Lamp body */}
        <ellipse cx="12" cy="35" rx="8" ry="5" fill={RE.sepia} />
        <rect x="6" y="35" width="12" height="15" fill={RE.midBrown} />
        <ellipse cx="12" cy="50" rx="8" ry="4" fill={RE.darkSepia} />
        {/* Glass chimney */}
        <path d="M8,30 Q6,20 10,15 L14,15 Q18,20 16,30" fill={RE.cream} opacity="0.3" />
        {/* Flame */}
        <ellipse cx="12" cy="22" rx="3" ry="6" fill={RE.candlelight} opacity="0.9" />
        <ellipse cx="12" cy="20" rx="1.5" ry="4" fill={RE.ivory} opacity="0.8" />
      </svg>
      {/* Warm glow */}
      <div
        className="absolute top-2 left-0 w-12 h-16"
        style={{
          background: `radial-gradient(circle, ${RE.candlelight}50, transparent 70%)`,
          filter: 'blur(8px)',
        }}
      />
    </div>
  )
}

// Victorian damask wallpaper pattern - subtle repeating SVG
function VictorianWallpaper() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[1] opacity-[0.08]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 Q40 15 30 25 Q20 15 30 5 M30 35 Q40 45 30 55 Q20 45 30 35 M5 30 Q15 20 25 30 Q15 40 5 30 M35 30 Q45 20 55 30 Q45 40 35 30' stroke='%23${RE.midBrown.slice(1)}' stroke-width='1' fill='none' opacity='0.5'/%3E%3Ccircle cx='30' cy='30' r='3' fill='%23${RE.midBrown.slice(1)}' opacity='0.3'/%3E%3C/svg%3E")`,
        backgroundSize: '60px 60px',
      }}
    />
  )
}

// Fog/mist layers - drifting across screen
function FogAtmosphere() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[2] overflow-hidden">
      {/* Top fog layer */}
      <div
        className="absolute top-0 left-0 right-0 h-1/3"
        style={{
          background: `linear-gradient(180deg, ${RE.fog}30 0%, transparent 100%)`,
        }}
      />
      {/* Bottom fog layer */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1/4"
        style={{
          background: `linear-gradient(0deg, ${RE.mistDark}40 0%, transparent 100%)`,
        }}
      />
      {/* Drifting fog patches */}
      <div
        className="absolute top-1/4 left-0 w-full h-32 opacity-20 animate-fog-drift"
        style={{
          background: `linear-gradient(90deg, transparent, ${RE.fog}60, transparent)`,
          filter: 'blur(30px)',
        }}
      />
      <div
        className="absolute top-1/2 left-0 w-full h-24 opacity-15 animate-fog-drift-slow"
        style={{
          background: `linear-gradient(90deg, transparent, ${RE.fog}40, transparent)`,
          filter: 'blur(40px)',
        }}
      />
    </div>
  )
}

// Mansion door frame - ornate Victorian style
function MansionDoorFrame() {
  return (
    <div className="fixed inset-x-0 top-0 h-6 pointer-events-none z-[2] opacity-40">
      <svg viewBox="0 0 1000 24" className="w-full h-full" preserveAspectRatio="none">
        {/* Crown molding */}
        <rect x="0" y="0" width="1000" height="10" fill={RE.darkSepia} />
        <rect x="0" y="10" width="1000" height="6" fill={RE.sepia} />
        {/* Decorative dentil molding */}
        {Array.from({ length: 50 }, (_, i) => (
          <rect key={i} x={i * 20 + 5} y="16" width="8" height="6" fill={RE.midBrown} />
        ))}
      </svg>
    </div>
  )
}

// Inventory slot component - sepia item box style
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
  const rarityColor = {
    common: RE.midBrown,
    rare: RE.warmGlow,
    legendary: RE.candlelight,
  }

  return (
    <button
      onClick={onClick}
      aria-label={`Select ${label} profession ${isSelected ? '(currently selected)' : ''}`}
      aria-pressed={isSelected}
      className="relative aspect-square transition-all duration-200 group"
      style={{
        background: `linear-gradient(135deg, ${RE.sepia}, ${RE.darkSepia})`,
        border: `2px solid ${isSelected ? RE.candlelight : rarityColor[rarity]}`,
        boxShadow: isSelected ? `0 0 20px ${RE.warmGlow}40, inset 0 0 30px ${RE.void}80` : `inset 0 0 30px ${RE.void}60`,
      }}
    >
      {/* Corner notches - item box style */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2" style={{ borderColor: rarityColor[rarity] }} />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2" style={{ borderColor: rarityColor[rarity] }} />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2" style={{ borderColor: rarityColor[rarity] }} />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2" style={{ borderColor: rarityColor[rarity] }} />

      {/* Content */}
      <div className="absolute inset-2 flex flex-col items-center justify-center">
        <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">{icon}</span>
        <span className="text-sm tracking-wider text-center uppercase" style={{ color: RE.cream }}>
          {label}
        </span>
        <span className="text-sm mt-1" style={{ color: RE.warmGlow }}>
          {sublabel}
        </span>
      </div>

      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
          <span style={{ color: RE.candlelight }}>▼</span>
        </div>
      )}
    </button>
  )
}

// Document/File component - worn paper file style
function DocumentItem({ title, content, isOpen, onToggle }: {
  title: string
  content: string
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div
      className="transition-all cursor-pointer"
      style={{ background: RE.sepia, border: `1px solid ${RE.midBrown}` }}
      onClick={onToggle}
    >
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{ borderBottom: isOpen ? `1px solid ${RE.midBrown}` : 'none' }}
      >
        <span className="text-sm flex items-center gap-2" style={{ color: RE.cream }}>
          <span style={{ color: RE.warmGlow }}>[FILE]</span>
          {title}
        </span>
        <span style={{ color: RE.candlelight }}>{isOpen ? '▼' : '▶'}</span>
      </div>
      {isOpen && (
        <div className="px-4 py-3" style={{ background: `${RE.darkSepia}cc` }}>
          <p className="text-xs leading-relaxed" style={{ color: RE.fog }}>
            {content}
          </p>
        </div>
      )}
    </div>
  )
}

// Tech stack display - sepia inventory style
function TechCloud({ categories }: { categories: ReturnType<typeof getEngineerSkills> }) {
  return (
    <div className="space-y-6">
      {categories.map((category) => (
        <div key={category.name}>
          <h3
            className="text-xs tracking-wider mb-3 flex items-center gap-2 uppercase"
            style={{ color: RE.warmGlow }}
          >
            <span className="text-sm">[{category.icon}]</span>
            {category.name}
          </h3>
          <div className="flex flex-wrap gap-2">
            {category.items.map((tech) => (
              <span
                key={tech}
                className="px-2 py-1 text-sm tracking-wider transition-all hover:scale-105 cursor-default"
                style={{ background: `${RE.midBrown}50`, border: `1px solid ${RE.midBrown}`, color: RE.cream }}
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

// Skills list for drummer/fighter modes - sepia bar style
function SkillsList({ categories }: { categories: ReturnType<typeof getSkillsByProfession> }) {
  return (
    <div className="space-y-4">
      {categories.map((category) => (
        <div key={category.name}>
          <h3
            className="text-xs tracking-wider mb-2 uppercase"
            style={{ color: RE.warmGlow }}
          >
            [{category.icon}] {category.name}
          </h3>
          <div className="space-y-2">
            {category.skills.map((skill) => (
              <div key={skill.name} className="flex items-center gap-3">
                <span className="text-xs w-32" style={{ color: RE.cream }}>
                  {skill.name}
                </span>
                <div className="flex-1 h-2" style={{ background: RE.darkSepia }}>
                  <div
                    className="h-full transition-all"
                    style={{
                      width: `${(skill.proficiency / 5) * 100}%`,
                      background: `linear-gradient(90deg, ${RE.rust}, ${RE.warmGlow})`,
                    }}
                  />
                </div>
                <span className="text-sm w-8" style={{ color: RE.candlelight }}>
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

// Company card - worn paper style
function CompanyCard({ company }: { company: typeof COMPANIES[0] }) {
  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 transition-all hover:scale-[1.02] group"
      style={{ background: `linear-gradient(135deg, ${RE.sepia}, ${RE.darkSepia})`, border: `1px solid ${RE.midBrown}` }}
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="text-xl">{company.icon}</span>
        <div>
          <h4 className="text-sm group-hover:brightness-125 transition-all" style={{ color: RE.cream }}>
            {company.name}
          </h4>
          <p className="text-sm" style={{ color: RE.warmGlow }}>{company.tagline}</p>
        </div>
      </div>
      <p className="text-xs" style={{ color: RE.fog }}>{company.description}</p>
    </a>
  )
}

// Band card - worn paper style
function BandCard({ band }: { band: typeof BANDS[0] }) {
  const content = (
    <div
      className="p-4 transition-all hover:scale-[1.02] group"
      style={{ background: `linear-gradient(135deg, ${RE.sepia}, ${RE.darkSepia})`, border: `1px solid ${RE.midBrown}` }}
    >
      <h4 className="text-sm group-hover:brightness-125 transition-all" style={{ color: RE.cream }}>
        {band.name}
      </h4>
      <p className="text-sm mt-1" style={{ color: RE.warmGlow }}>{band.genre} | {band.role}</p>
      <p className="text-xs mt-2" style={{ color: RE.fog }}>{band.description}</p>
      {!band.url && <p className="text-sm mt-2 italic" style={{ color: RE.mistDark }}>-- COMING SOON --</p>}
    </div>
  )

  if (band.url) {
    return <a href={band.url} target="_blank" rel="noopener noreferrer" className="block">{content}</a>
  }
  return content
}

// Work experience card - worn document style
function ExperienceCard({ entry }: { entry: typeof EXPERIENCE_DATA[0] }) {
  const endDisplay = entry.endDate ? new Date(entry.endDate).getFullYear() : 'Present'
  const startDisplay = new Date(entry.startDate).getFullYear()

  return (
    <div
      className="p-4"
      style={{ background: `linear-gradient(135deg, ${RE.sepia}, ${RE.darkSepia})`, border: `1px solid ${RE.midBrown}` }}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="text-sm" style={{ color: RE.cream }}>{entry.title}</h4>
          <p className="text-xs" style={{ color: RE.warmGlow }}>{entry.organization}</p>
        </div>
        <span
          className="text-sm px-2 py-1"
          style={{ color: RE.candlelight, background: `${RE.rust}30`, border: `1px solid ${RE.rust}50` }}
        >
          {startDisplay} - {endDisplay}
        </span>
      </div>
      <p className="text-xs mb-2" style={{ color: RE.fog }}>{entry.description}</p>
      {entry.highlights && entry.highlights.length > 0 && (
        <ul className="space-y-1">
          {entry.highlights.map((highlight, i) => (
            <li key={i} className="text-xs flex items-start gap-2" style={{ color: RE.cream }}>
              <span style={{ color: RE.warmGlow }}>▸</span>
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
      role="main"
      aria-label="Survival Horror themed portfolio - Resident Evil inspired"
      style={{
        background: `linear-gradient(180deg, ${RE.void} 0%, ${RE.darkSepia} 20%, ${RE.sepia} 50%, ${RE.darkSepia} 80%, ${RE.void} 100%)`,
        fontFamily: '"Times New Roman", "Georgia", serif',
      }}
    >
      {/* Victorian wallpaper pattern overlay */}
      <VictorianWallpaper />

      {/* Fog/mist atmosphere */}
      <FogAtmosphere />

      {/* Mansion door frame molding */}
      <MansionDoorFrame />

      {/* Blood splatters on corners */}
      <BloodSplatter position="top-left" size={120} rotation={0} />
      <BloodSplatter position="top-right" size={100} rotation={90} />
      <BloodSplatter position="bottom-left" size={90} rotation={-45} />
      <BloodSplatter position="bottom-right" size={110} rotation={180} />

      {/* Zombie silhouettes in background */}
      <ZombieSilhouettes />

      {/* Dripping blood effects */}
      <BloodDrip side="left" delay={0} />
      <BloodDrip side="right" delay={2} />

      {/* Biohazard symbols - Umbrella Corp feel */}
      <BiohazardSymbol className="fixed top-40 right-8" />
      <BiohazardSymbol className="fixed bottom-48 left-12" />

      {/* Danger tape strips */}
      <DangerTape position="top" />
      <DangerTape position="bottom" />

      {/* Warning sign */}
      <WarningSign />

      {/* Cracked glass overlay */}
      <CrackedGlassOverlay />

      {/* Creeping shadows at edges */}
      <CreepingShadows />

      {/* Sepia vignette with subtle pulse */}
      <SepiaVignette />

      {/* Dark vignette - heavy shadows like RE fixed camera */}
      <div
        className="fixed inset-0 pointer-events-none z-[7]"
        style={{
          background: `
            radial-gradient(ellipse at 50% 30%, transparent 10%, ${RE.shadow}80 60%, ${RE.void}f0 100%),
            linear-gradient(180deg, ${RE.void}40 0%, transparent 20%, transparent 80%, ${RE.void}60 100%)
          `,
        }}
      />

      {/* Sepia film grain */}
      <div
        className="fixed inset-0 pointer-events-none z-[10] opacity-[0.05] animate-grain mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' fill='%23${RE.sepia.slice(1)}'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Warm isolated light sources - fireplace/candle feel */}
      <WarmLightSource />

      {/* Wall sconces */}
      <WallSconce side="left" />
      <WallSconce side="right" />

      {/* Herb decorations */}
      <div className="fixed top-20 left-4 z-[11] opacity-50">
        <HerbIcon color="green" />
      </div>
      <div className="fixed top-32 left-8 z-[11] opacity-40">
        <HerbIcon color="red" />
      </div>
      <div className="fixed bottom-20 right-4 z-[11] opacity-40">
        <HerbIcon color="blue" />
      </div>
      <div className="fixed bottom-32 right-8 z-[11] opacity-30">
        <HerbIcon color="green" />
      </div>

      {/* Ink ribbon decorations */}
      <div className="fixed top-44 right-6 z-[11] opacity-40">
        <InkRibbon />
      </div>
      <div className="fixed bottom-44 left-6 z-[11] opacity-30">
        <InkRibbon />
      </div>

      {/* Header - sepia mansion style */}
      <header className="relative z-30 p-6 pt-10">
        <div className="max-w-6xl mx-auto flex justify-between items-start">
          <div>
            <h1
              className="text-2xl tracking-[0.15em] uppercase"
              style={{ color: RE.cream, textShadow: `2px 2px 4px ${RE.void}` }}
            >
              Alexander Pulido
            </h1>
            <p className="text-sm tracking-wider mt-2" style={{ color: RE.fog }}>
              {PROFESSIONAL_SUMMARY.headline}
            </p>
            <p className="text-xs tracking-wider mt-1 italic" style={{ color: RE.warmGlow }}>
              <TypewriterText text={PROFESSIONAL_SUMMARY.tagline} speed={80} />
            </p>
          </div>

          <div className="flex gap-3 items-center">
            <Link
              href="/cv"
              className="px-3 py-2 text-xs tracking-wider transition-all hover:brightness-125"
              style={{ background: RE.darkSepia, border: `1px solid ${RE.midBrown}`, color: RE.cream }}
            >
              [FILE]
            </Link>
            <Link
              href="/personal-projects/game-engine"
              className="px-3 py-2 text-xs tracking-wider transition-all hover:brightness-125"
              style={{ background: `${RE.rust}40`, border: `1px solid ${RE.rust}`, color: RE.warmGlow }}
            >
              [NEBULITH]
            </Link>
          </div>
        </div>
      </header>

      {/* Current Roles Section */}
      <section className="relative z-20 py-4 px-6" aria-labelledby="current-status-heading">
        <div className="max-w-6xl mx-auto">
          <div className="p-4" style={{ background: `${RE.darkSepia}cc`, border: `1px solid ${RE.midBrown}` }}>
            <h2 id="current-status-heading" className="text-sm tracking-[0.3em] mb-3 uppercase" style={{ color: RE.warmGlow }}>
              Current Status
            </h2>
            <div className="flex flex-wrap justify-center gap-6">
              {CURRENT_ROLES.map((role) => (
                <div key={role.id} className="text-center">
                  <p className="text-xs tracking-wider" style={{ color: RE.candlelight }}>{role.title}</p>
                  <p className="text-sm" style={{ color: RE.cream }}>{role.company}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main inventory area */}
      <main className="relative z-20 px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* 1. Inventory grid - item box style (part of header/navigation) */}
          <div
            className="p-6 mb-8"
            style={{
              background: `linear-gradient(180deg, ${RE.sepia}f0, ${RE.darkSepia}e0)`,
              border: `2px solid ${RE.midBrown}`,
              boxShadow: `inset 0 0 50px ${RE.void}80`,
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs tracking-[0.3em] uppercase" style={{ color: RE.warmGlow }}>
                Inventory
              </h2>
              <span className="text-xs" style={{ color: RE.rust }}>
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
                    background: `linear-gradient(135deg, ${RE.sepia}40, ${RE.darkSepia}40)`,
                    border: `1px dashed ${RE.midBrown}40`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* 2. About Section - worn paper style with horror textures */}
          <div
            className="p-6 mb-8 relative overflow-hidden"
            style={{
              background: `${RE.sepia}f0`,
              border: `2px solid ${RE.midBrown}`,
              backgroundImage: TEXTURES.wornPaper,
            }}
          >
            {/* Subtle blood corner stain */}
            <div
              className="absolute top-0 right-0 w-24 h-24 opacity-30 pointer-events-none"
              style={{ backgroundImage: TEXTURES.bloodStain }}
            />
            <h2 className="text-xs tracking-[0.3em] mb-4 uppercase" style={{ color: RE.warmGlow }}>
              About
            </h2>
            <p className="text-xs leading-relaxed mb-4" style={{ color: RE.cream }}>
              {aboutData.bio}
            </p>
            <div className="flex gap-2 flex-wrap">
              {aboutData.quickFacts.map((fact, i) => (
                <span
                  key={i}
                  className="text-sm px-2 py-1"
                  style={{ background: RE.darkSepia, border: `1px solid ${RE.midBrown}`, color: RE.fog }}
                >
                  ▸ {fact}
                </span>
              ))}
            </div>
          </div>

          {/* 3. ART SECTION - Zombie silhouettes with typewriter */}
          <ArtSectionZombies />

          {/* 4. Work Experience Section - scratched file folder */}
          {experience.length > 0 && (
            <div
              className="p-6 mb-8 relative overflow-hidden"
              style={{
                background: `${RE.sepia}f0`,
                border: `2px solid ${RE.midBrown}`,
                backgroundImage: `${TEXTURES.scratches}, ${TEXTURES.wornPaper}`,
              }}
            >
              {/* Folder tab */}
              <div
                className="absolute -top-2 left-6 px-4 py-1 text-sm tracking-wider uppercase"
                style={{ background: RE.midBrown, color: RE.cream, borderRadius: '4px 4px 0 0' }}
              >
                Personnel File
              </div>
              <h2 className="text-xs tracking-[0.3em] mb-4 mt-2 uppercase" style={{ color: RE.warmGlow }}>
                Work Experience
              </h2>
              <div className="space-y-4">
                {experience.map((entry) => (
                  <ExperienceCard key={entry.id} entry={entry} />
                ))}
              </div>
            </div>
          )}

          {/* 5. ART SECTION - Blood splatter with typewriter */}
          <ArtSectionTypewriter />

          {/* 6. Tech Stack / Skills Section - inventory manifest with blood stains */}
          <div
            className="p-6 mb-8 relative overflow-hidden"
            style={{
              background: `${RE.sepia}f0`,
              border: `2px solid ${RE.midBrown}`,
              backgroundImage: `${TEXTURES.bloodStain}, ${TEXTURES.wornPaper}`,
            }}
          >
            {/* Claw marks across corner */}
            <div
              className="absolute bottom-0 left-0 w-32 h-32 opacity-20 pointer-events-none"
              style={{ backgroundImage: TEXTURES.scratches, backgroundSize: '100% 100%' }}
            />
            <h2 className="text-xs tracking-[0.3em] mb-4 flex items-center gap-2 uppercase" style={{ color: RE.warmGlow }}>
              {active === 'engineer' ? 'Tech Stack' : 'Skills'}
              <span className="text-sm" style={{ color: RE.candlelight }}>
                {active === 'engineer' ? `[${engineerTech.flatMap(c => c.items).length} ITEMS]` : ''}
              </span>
            </h2>
            {active === 'engineer' ? (
              <TechCloud categories={engineerTech} />
            ) : (
              <SkillsList categories={otherSkills} />
            )}
          </div>

          {/* 7. Featured Work (Projects) - blood-stained research notes */}
          <div
            className="p-6 mb-8 relative overflow-hidden"
            style={{
              background: `${RE.sepia}f0`,
              border: `2px solid ${RE.midBrown}`,
              backgroundImage: `${TEXTURES.scratches}, ${TEXTURES.wornPaper}`,
            }}
          >
            {/* Blood fingerprint smear */}
            <div
              className="absolute top-4 right-4 w-16 h-20 opacity-25 pointer-events-none"
              style={{ backgroundImage: TEXTURES.bloodStain, backgroundSize: '100% 100%' }}
            />
            <h2 className="text-xs tracking-[0.3em] mb-4 uppercase flex items-center gap-2" style={{ color: RE.warmGlow }}>
              <span style={{ color: RE.rust }}>[CLASSIFIED]</span> Featured Work
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

          {/* 8. ART SECTION - Herb garden scene */}
          <ArtSectionHerbs />

          {/* 9. Ventures Section - Companies (Engineer mode) or Bands (Drummer mode) */}
          {active === 'engineer' && (
            <div
              className="p-6 mb-8 relative overflow-hidden"
              style={{
                background: `${RE.sepia}f0`,
                border: `2px solid ${RE.midBrown}`,
                backgroundImage: TEXTURES.wornPaper,
              }}
            >
              {/* Stamp mark */}
              <div
                className="absolute top-3 right-3 text-sm px-2 py-1 rotate-[-8deg] opacity-60"
                style={{ border: `2px solid ${RE.rust}`, color: RE.rust }}
              >
                APPROVED
              </div>
              <h2 className="text-xs tracking-[0.3em] mb-4 uppercase" style={{ color: RE.warmGlow }}>
                Ventures
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                {COMPANIES.map((company) => (
                  <CompanyCard key={company.id} company={company} />
                ))}
              </div>
            </div>
          )}

          {active === 'drummer' && (
            <div
              className="p-6 mb-8 relative overflow-hidden"
              style={{
                background: `${RE.sepia}f0`,
                border: `2px solid ${RE.midBrown}`,
                backgroundImage: `${TEXTURES.bloodStain}, ${TEXTURES.wornPaper}`,
              }}
            >
              {/* Musical note decoration */}
              <div
                className="absolute top-2 right-4 text-2xl opacity-20 pointer-events-none"
                style={{ color: RE.midBrown }}
              >
                ♪ ♫ ♩
              </div>
              <h2 className="text-xs tracking-[0.3em] mb-4 uppercase" style={{ color: RE.warmGlow }}>
                Bands
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                {BANDS.map((band) => (
                  <BandCard key={band.id} band={band} />
                ))}
              </div>
            </div>
          )}

          {/* 10. Posts Section - placeholder for future blog posts */}
          <div
            className="p-6 mb-8 relative overflow-hidden"
            style={{
              background: `${RE.sepia}f0`,
              border: `2px solid ${RE.midBrown}`,
              backgroundImage: TEXTURES.wornPaper,
            }}
          >
            {/* Worn edge effect */}
            <div
              className="absolute top-0 left-0 w-full h-2 opacity-30"
              style={{ background: `linear-gradient(90deg, ${RE.midBrown}, transparent, ${RE.midBrown})` }}
            />
            <h2 className="text-xs tracking-[0.3em] mb-4 uppercase flex items-center gap-2" style={{ color: RE.warmGlow }}>
              <span style={{ color: RE.fog }}>[LOGS]</span> Posts
            </h2>
            <div className="text-center py-8">
              <p className="text-sm italic" style={{ color: RE.mistDark }}>
                -- TRANSMISSIONS INCOMING --
              </p>
              <p className="text-xs mt-2" style={{ color: RE.fog }}>
                Signal interference detected. Stand by for incoming reports...
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Contact CTA */}
      <section className="relative z-20 py-12 px-6" aria-label="Contact">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <h2 className="text-sm tracking-[0.3em] mb-3 uppercase" style={{ color: RE.warmGlow }}>
              Ready to Work Together?
            </h2>
            <p className="text-xs" style={{ color: RE.fog }}>
              10+ years delivering production systems. Let&apos;s build something.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:alexanderpulido81@gmail.com"
              className="px-6 py-3 text-sm tracking-wider transition-all hover:brightness-125"
              style={{
                background: `${RE.rust}80`,
                border: `2px solid ${RE.warmGlow}`,
                color: RE.cream,
              }}
            >
              [CONTACT] Get In Touch
            </a>
            <Link
              href="/cv"
              className="px-6 py-3 text-sm tracking-wider transition-all hover:brightness-125"
              style={{
                background: RE.darkSepia,
                border: `2px solid ${RE.midBrown}`,
                color: RE.cream,
              }}
            >
              [FILE] Download CV
            </Link>
          </div>
        </div>
      </section>

      

      {/* Footer - save room style */}
      <footer className="relative z-20 py-12 text-center">
        <div className="flex flex-col items-center gap-4">
          <TypewriterSavePoint />
          <div className="flex items-center gap-4">
            <InkRibbon />
            <p className="text-sm tracking-widest uppercase" style={{ color: RE.warmGlow }}>
              Typewriter Save Point | 2026 | Spencer Mansion Archives
            </p>
            <InkRibbon />
          </div>
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
        @keyframes fog-drift {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes fog-drift-slow {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-fog-drift {
          animation: fog-drift 30s linear infinite;
        }
        .animate-fog-drift-slow {
          animation: fog-drift-slow 45s linear infinite;
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
        /* Zombie chase animations - using transform for GPU compositing */
        @keyframes survivor-run-left {
          0% { transform: translateX(-80px) translateY(-50%); }
          100% { transform: translateX(calc(100vw + 80px)) translateY(-50%); }
        }
        @keyframes survivor-run-right {
          0% { transform: translateX(calc(100vw + 80px)) translateY(-50%); }
          100% { transform: translateX(-80px) translateY(-50%); }
        }
        @keyframes zombie-chase-left {
          0% { transform: translateX(-150px) translateY(-50%); }
          100% { transform: translateX(calc(100vw + 30px)) translateY(-50%); }
        }
        @keyframes zombie-chase-right {
          0% { transform: translateX(calc(100vw + 30px)) translateY(-50%); }
          100% { transform: translateX(-150px) translateY(-50%); }
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
        /* Blood drip animation */
        @keyframes blood-drip {
          0% { opacity: 0.8; transform: translateY(-20px); }
          50% { opacity: 0.6; }
          100% { opacity: 0.4; transform: translateY(10px); }
        }
        .animate-blood-drip {
          animation: blood-drip 8s ease-in-out infinite;
        }
        /* Accessibility: Respect reduced motion preference */
        @media (prefers-reduced-motion: reduce) {
          .animate-grain,
          .animate-fog-drift,
          .animate-fog-drift-slow,
          .animate-zombie-sway,
          .animate-zombie-sway-delayed,
          .animate-shadow-creep-left,
          .animate-shadow-creep-right,
          .animate-blood-drip,
          .animate-zombie-reach,
          .animate-zombie-reach-delayed {
            animation: none !important;
          }
        }
        /* Focus indicators for accessibility */
        button:focus-visible,
        a:focus-visible {
          outline: 2px solid ${RE.candlelight};
          outline-offset: 2px;
        }
      `}</style>
    </div>
  )
}
