'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import { useProfession } from '@/contexts/ProfessionContext'
import { ABOUT_DATA, PROFESSIONAL_SUMMARY } from '@/data/about'
import { PROJECTS_DATA } from '@/data/projects'
import { getSkillsByProfession, getEngineerSkills } from '@/data/skills'
import { CURRENT_ROLES } from '@/data/roles'
import { COMPANIES } from '@/data/companies'
import { BANDS } from '@/data/bands'
import { EXPERIENCE_DATA, filterExperienceByProfession } from '@/data/experience'

// Crash Bandicoot authentic color palette - N. Sanity Island / Temple levels
const COLORS = {
  // Core Crash colors
  wumpaOrange: '#ff6a00',
  wumpaBright: '#ffa500',
  jungleGreen: '#1a5c1a',
  jungleDark: '#0d3d0d',
  palmGreen: '#2d8c2d',

  // Beach / N. Sanity Island
  sandLight: '#f4d89a',
  sandDark: '#c9a654',
  oceanBlue: '#0077be',
  oceanDeep: '#004d80',
  skyBlue: '#87ceeb',

  // Crates
  crateWood: '#8b5a2b',
  crateDark: '#5c3d1a',
  crateHighlight: '#b87333',
  tntRed: '#cc0000',
  tntBright: '#ff2222',
  nitroGreen: '#00cc00',
  nitroBright: '#44ff44',
  checkpointYellow: '#ffdd00',
  bounceCrate: '#22aa22',

  // Crystals & Gems
  crystalBlue: '#00ccff',
  crystalPurple: '#cc44ff',
  gemRed: '#ff3366',
  gemGreen: '#00ff99',
  gemYellow: '#ffff00',

  // Aku Aku / Uka Uka
  akuGold: '#daa520',
  akuWood: '#8b4513',
  ukaDark: '#2a2a2a',
  ukaBlue: '#4444ff',

  // Temple / Ruins
  templeStone: '#6b5b4f',
  templeDark: '#3d3330',
  mossGreen: '#4a7c4a',
  torchFire: '#ff5500',

  // Cortex Lab
  cortexPurple: '#663399',
  cortexMetal: '#4a4a5a',
  labGreen: '#66ff66',
}

// Achievement data for skills (no proficiency bars - show impact instead)
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

// Hook for reduced motion preference
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

// Wumpa Fruit - Pure SVG
function WumpaFruit({ size = 24, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="Wumpa fruit"
    >
      {/* Main fruit body */}
      <ellipse cx="12" cy="14" rx="9" ry="8" fill={COLORS.wumpaOrange} />
      {/* Highlight */}
      <ellipse cx="9" cy="11" rx="3" ry="2" fill={COLORS.wumpaBright} opacity="0.6" />
      {/* Leaf stem */}
      <path d="M12 6 Q14 4 16 5 Q14 3 12 4 Z" fill={COLORS.palmGreen} />
      <path d="M12 6 Q10 4 8 5 Q10 3 12 4 Z" fill={COLORS.jungleGreen} />
      {/* Bottom shadow */}
      <ellipse cx="12" cy="18" rx="6" ry="2" fill="rgba(0,0,0,0.2)" />
    </svg>
  )
}

// Crystal collectible - Pure SVG
function Crystal({ size = 24, color = COLORS.crystalBlue, className = '' }: { size?: number; color?: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 32"
      width={size}
      height={size * 1.33}
      className={className}
      role="img"
      aria-label="Crystal collectible"
    >
      {/* Crystal facets */}
      <path d="M12 2 L20 12 L12 30 L4 12 Z" fill={color} />
      <path d="M12 2 L20 12 L12 14 Z" fill={`${color}cc`} />
      <path d="M12 2 L4 12 L12 14 Z" fill={`${color}88`} />
      <path d="M12 14 L20 12 L12 30 Z" fill={`${color}aa`} />
      {/* Shine effect */}
      <path d="M8 10 L10 8 L10 12 Z" fill="rgba(255,255,255,0.6)" />
      {/* Glow */}
      <ellipse cx="12" cy="16" rx="12" ry="16" fill={`url(#crystalGlow-${color.replace('#', '')})`} opacity="0.3" />
      <defs>
        <radialGradient id={`crystalGlow-${color.replace('#', '')}`}>
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
    </svg>
  )
}

// Aku Aku Tiki Mask - Pure SVG (iconic Crash protector)
function AkuAkuMask({ size = 60, className = '', animated = true }: { size?: number; className?: string; animated?: boolean }) {
  const reducedMotion = useReducedMotion()

  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size * 1.5 }}
      role="img"
      aria-label="Aku Aku tiki mask - protective spirit from Crash Bandicoot"
    >
      <svg viewBox="0 0 40 60" width={size} height={size * 1.5}>
        {/* Feathers on top */}
        <ellipse cx="12" cy="4" rx="3" ry="6" fill={COLORS.tntRed} transform="rotate(-30 12 4)" />
        <ellipse cx="20" cy="2" rx="3" ry="7" fill={COLORS.jungleGreen} />
        <ellipse cx="28" cy="4" rx="3" ry="6" fill={COLORS.wumpaOrange} transform="rotate(30 28 4)" />
        <ellipse cx="16" cy="3" rx="2" ry="5" fill={COLORS.checkpointYellow} transform="rotate(-15 16 3)" />
        <ellipse cx="24" cy="3" rx="2" ry="5" fill={COLORS.crystalBlue} transform="rotate(15 24 3)" />

        {/* Main mask face */}
        <path d="M8 15 Q5 25 6 40 Q8 52 20 55 Q32 52 34 40 Q35 25 32 15 Q28 8 20 8 Q12 8 8 15 Z" fill={COLORS.akuWood} />

        {/* Face details - wood grain */}
        <path d="M10 20 Q15 22 15 35" stroke={COLORS.crateDark} strokeWidth="0.5" fill="none" opacity="0.3" />
        <path d="M30 20 Q25 22 25 35" stroke={COLORS.crateDark} strokeWidth="0.5" fill="none" opacity="0.3" />

        {/* Eye sockets */}
        <ellipse cx="14" cy="25" rx="4" ry="5" fill={COLORS.akuGold} />
        <ellipse cx="26" cy="25" rx="4" ry="5" fill={COLORS.akuGold} />

        {/* Pupils - glowing */}
        <circle cx="14" cy="25" r="2" fill="#fff" />
        <circle cx="26" cy="25" r="2" fill="#fff" />
        <circle cx="14" cy="25" r="1" fill="#000" />
        <circle cx="26" cy="25" r="1" fill="#000" />

        {/* Nose */}
        <path d="M18 30 L20 38 L22 30 Z" fill={COLORS.crateDark} />

        {/* Mouth - tribal pattern */}
        <path d="M12 42 Q14 40 16 42 Q18 40 20 42 Q22 40 24 42 Q26 40 28 42 Q26 46 20 48 Q14 46 12 42 Z" fill={COLORS.tntRed} />

        {/* Teeth */}
        <rect x="14" y="42" width="2" height="3" fill="#fff" rx="0.5" />
        <rect x="18" y="42" width="2" height="3" fill="#fff" rx="0.5" />
        <rect x="22" y="42" width="2" height="3" fill="#fff" rx="0.5" />
        <rect x="26" y="42" width="2" height="3" fill="#fff" rx="0.5" />

        {/* Tribal markings */}
        <path d="M8 35 L6 38 L8 41" stroke={COLORS.akuGold} strokeWidth="1.5" fill="none" />
        <path d="M32 35 L34 38 L32 41" stroke={COLORS.akuGold} strokeWidth="1.5" fill="none" />

        {/* Side bones/decorations */}
        <ellipse cx="5" cy="30" rx="2" ry="4" fill={COLORS.sandLight} />
        <ellipse cx="35" cy="30" rx="2" ry="4" fill={COLORS.sandLight} />
      </svg>

      {/* Mystical glow */}
      {animated && !reducedMotion && (
        <div
          className="absolute inset-0 animate-aku-glow"
          style={{
            background: `radial-gradient(circle at 50% 40%, ${COLORS.akuGold}40 0%, transparent 60%)`,
            filter: 'blur(4px)',
          }}
          aria-hidden="true"
        />
      )}
    </div>
  )
}

// TNT Crate - Pure CSS/SVG
function TNTCrate({ size = 40, className = '', countdown = false }: { size?: number; className?: string; countdown?: boolean }) {
  const reducedMotion = useReducedMotion()
  const [count, setCount] = useState(3)

  useEffect(() => {
    if (!countdown || reducedMotion) return
    const interval = setInterval(() => {
      setCount(c => c <= 1 ? 3 : c - 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [countdown, reducedMotion])

  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label="TNT crate - explosive box from Crash Bandicoot"
    >
      <svg viewBox="0 0 40 40" width={size} height={size}>
        {/* Main crate body */}
        <rect x="2" y="2" width="36" height="36" fill={COLORS.tntRed} stroke={COLORS.tntBright} strokeWidth="2" rx="2" />

        {/* Wood grain texture */}
        <line x1="5" y1="2" x2="5" y2="38" stroke={COLORS.crateWood} strokeWidth="1" opacity="0.3" />
        <line x1="20" y1="2" x2="20" y2="38" stroke={COLORS.crateWood} strokeWidth="1" opacity="0.3" />
        <line x1="35" y1="2" x2="35" y2="38" stroke={COLORS.crateWood} strokeWidth="1" opacity="0.3" />

        {/* Corner brackets */}
        <path d="M2 8 L8 8 L8 2" stroke={COLORS.crateWood} strokeWidth="2" fill="none" />
        <path d="M38 8 L32 8 L32 2" stroke={COLORS.crateWood} strokeWidth="2" fill="none" />
        <path d="M2 32 L8 32 L8 38" stroke={COLORS.crateWood} strokeWidth="2" fill="none" />
        <path d="M38 32 L32 32 L32 38" stroke={COLORS.crateWood} strokeWidth="2" fill="none" />

        {/* TNT Text */}
        <text x="20" y="24" textAnchor="middle" fill="#fff" fontWeight="bold" fontSize="10" fontFamily="Impact, sans-serif">
          TNT
        </text>

        {/* Countdown number if active */}
        {countdown && (
          <text x="20" y="34" textAnchor="middle" fill={COLORS.checkpointYellow} fontWeight="bold" fontSize="8" fontFamily="monospace">
            {count}
          </text>
        )}
      </svg>

      {/* Danger glow */}
      {!reducedMotion && (
        <div
          className="absolute inset-0 animate-tnt-pulse"
          style={{
            background: `radial-gradient(circle, ${COLORS.tntBright}30 0%, transparent 70%)`,
          }}
          aria-hidden="true"
        />
      )}
    </div>
  )
}

// Nitro Crate - Pure CSS/SVG
function NitroCrate({ size = 40, className = '' }: { size?: number; className?: string }) {
  const reducedMotion = useReducedMotion()

  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label="Nitro crate - instant explosion from Crash Bandicoot"
    >
      <svg viewBox="0 0 40 40" width={size} height={size}>
        {/* Main crate body */}
        <rect x="2" y="2" width="36" height="36" fill={COLORS.nitroGreen} stroke={COLORS.nitroBright} strokeWidth="2" rx="2" />

        {/* Warning stripes */}
        <line x1="2" y1="12" x2="38" y2="12" stroke={COLORS.checkpointYellow} strokeWidth="2" />
        <line x1="2" y1="28" x2="38" y2="28" stroke={COLORS.checkpointYellow} strokeWidth="2" />

        {/* Exclamation mark */}
        <rect x="17" y="15" width="6" height="10" fill={COLORS.checkpointYellow} rx="1" />
        <circle cx="20" cy="30" r="3" fill={COLORS.checkpointYellow} />
      </svg>

      {/* Toxic glow */}
      {!reducedMotion && (
        <div
          className="absolute inset-0 animate-nitro-glow"
          style={{
            background: `radial-gradient(circle, ${COLORS.nitroBright}25 0%, transparent 60%)`,
          }}
          aria-hidden="true"
        />
      )}
    </div>
  )
}

// Wooden Crate (basic) - Pure SVG
function WoodenCrate({ size = 40, className = '', variant = 'normal' }: { size?: number; className?: string; variant?: 'normal' | 'bounce' | 'checkpoint' }) {
  const colors = {
    normal: { fill: COLORS.crateWood, stroke: COLORS.crateHighlight, icon: null },
    bounce: { fill: COLORS.bounceCrate, stroke: COLORS.palmGreen, icon: 'arrow' },
    checkpoint: { fill: COLORS.crateWood, stroke: COLORS.checkpointYellow, icon: 'C' },
  }
  const c = colors[variant]

  return (
    <svg
      viewBox="0 0 40 40"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={`${variant} crate`}
    >
      {/* Main crate body */}
      <rect x="2" y="2" width="36" height="36" fill={c.fill} stroke={c.stroke} strokeWidth="2" rx="2" />

      {/* Wood plank lines */}
      <line x1="2" y1="14" x2="38" y2="14" stroke={COLORS.crateDark} strokeWidth="1" />
      <line x1="2" y1="26" x2="38" y2="26" stroke={COLORS.crateDark} strokeWidth="1" />
      <line x1="14" y1="2" x2="14" y2="14" stroke={COLORS.crateDark} strokeWidth="1" />
      <line x1="26" y1="2" x2="26" y2="14" stroke={COLORS.crateDark} strokeWidth="1" />
      <line x1="14" y1="26" x2="14" y2="38" stroke={COLORS.crateDark} strokeWidth="1" />
      <line x1="26" y1="26" x2="26" y2="38" stroke={COLORS.crateDark} strokeWidth="1" />

      {/* Metal corner brackets */}
      <rect x="3" y="3" width="4" height="4" fill={COLORS.cortexMetal} />
      <rect x="33" y="3" width="4" height="4" fill={COLORS.cortexMetal} />
      <rect x="3" y="33" width="4" height="4" fill={COLORS.cortexMetal} />
      <rect x="33" y="33" width="4" height="4" fill={COLORS.cortexMetal} />

      {/* Variant icons */}
      {c.icon === 'arrow' && (
        <path d="M20 10 L28 20 L23 20 L23 30 L17 30 L17 20 L12 20 Z" fill="#fff" />
      )}
      {c.icon === 'C' && (
        <text x="20" y="26" textAnchor="middle" fill={COLORS.checkpointYellow} fontWeight="bold" fontSize="16">C</text>
      )}
    </svg>
  )
}

// Life counter with Crash face
function LifeCounter({ lives = 4, className = '' }: { lives?: number; className?: string }) {
  return (
    <div
      className={`flex items-center gap-2 ${className}`}
      role="img"
      aria-label={`${lives} lives remaining`}
    >
      {/* Crash face silhouette */}
      <svg viewBox="0 0 24 28" width={20} height={23}>
        {/* Orange face */}
        <ellipse cx="12" cy="14" rx="10" ry="12" fill={COLORS.wumpaOrange} />
        {/* Ears */}
        <ellipse cx="4" cy="8" rx="3" ry="4" fill={COLORS.wumpaOrange} />
        <ellipse cx="20" cy="8" rx="3" ry="4" fill={COLORS.wumpaOrange} />
        {/* Inner ear */}
        <ellipse cx="4" cy="8" rx="1.5" ry="2" fill={COLORS.sandLight} />
        <ellipse cx="20" cy="8" rx="1.5" ry="2" fill={COLORS.sandLight} />
        {/* Snout */}
        <ellipse cx="12" cy="18" rx="6" ry="5" fill={COLORS.sandLight} />
        {/* Nose */}
        <ellipse cx="12" cy="16" rx="2" ry="1.5" fill="#333" />
        {/* Eyes */}
        <ellipse cx="8" cy="12" rx="2.5" ry="3" fill="#fff" />
        <ellipse cx="16" cy="12" rx="2.5" ry="3" fill="#fff" />
        <circle cx="8" cy="12" r="1.5" fill="#000" />
        <circle cx="16" cy="12" r="1.5" fill="#000" />
        {/* Eyebrows */}
        <path d="M5 8 Q8 6 10 8" stroke="#4a2500" strokeWidth="1.5" fill="none" />
        <path d="M14 8 Q16 6 19 8" stroke="#4a2500" strokeWidth="1.5" fill="none" />
        {/* Smile */}
        <path d="M8 20 Q12 24 16 20" stroke="#333" strokeWidth="1" fill="none" />
      </svg>

      <span
        className="font-bold text-lg"
        style={{ color: COLORS.checkpointYellow, textShadow: '1px 1px 0 #000' }}
      >
        x {lives}
      </span>
    </div>
  )
}

// Jungle vine decoration - Pure CSS
function JungleVine({ side = 'left', className = '' }: { side?: 'left' | 'right'; className?: string }) {
  const reducedMotion = useReducedMotion()

  return (
    <div
      className={`absolute top-0 ${side === 'left' ? 'left-0' : 'right-0'} w-16 h-full pointer-events-none ${className}`}
      style={{
        background: side === 'left'
          ? `linear-gradient(90deg, ${COLORS.jungleDark}40 0%, transparent 100%)`
          : `linear-gradient(-90deg, ${COLORS.jungleDark}40 0%, transparent 100%)`,
      }}
      aria-hidden="true"
    >
      {/* Vine curves */}
      <svg
        viewBox="0 0 60 400"
        width={60}
        height="100%"
        preserveAspectRatio="none"
        className={side === 'right' ? 'scale-x-[-1]' : ''}
      >
        <path
          d="M30 0 Q10 50 25 100 Q40 150 20 200 Q0 250 25 300 Q50 350 20 400"
          stroke={COLORS.jungleGreen}
          strokeWidth="4"
          fill="none"
        />
        <path
          d="M35 0 Q15 60 30 110 Q45 160 25 210 Q5 260 30 310 Q55 360 25 400"
          stroke={COLORS.palmGreen}
          strokeWidth="3"
          fill="none"
        />
        {/* Leaves along the vine */}
        {[50, 150, 250, 350].map((y) => (
          <g key={y}>
            <ellipse cx="25" cy={y} rx="12" ry="6" fill={COLORS.palmGreen} transform={`rotate(-30 25 ${y})`} />
            <ellipse cx="30" cy={y + 20} rx="10" ry="5" fill={COLORS.jungleGreen} transform={`rotate(20 30 ${y + 20})`} />
          </g>
        ))}
      </svg>
    </div>
  )
}

// Ocean waves at bottom
function OceanWaves({ className = '' }: { className?: string }) {
  const reducedMotion = useReducedMotion()

  return (
    <div
      className={`absolute bottom-0 left-0 right-0 h-32 pointer-events-none overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* Deep water */}
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(180deg, transparent 0%, ${COLORS.oceanDeep} 100%)` }}
      />

      {/* Wave layers */}
      <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute bottom-0 w-full h-20">
        {/* Back wave */}
        <path
          d="M0 60 Q150 20 300 60 T600 60 T900 60 T1200 60 L1200 120 L0 120 Z"
          fill={COLORS.oceanDeep}
          className={reducedMotion ? '' : 'animate-wave-back'}
        />
        {/* Front wave */}
        <path
          d="M0 80 Q150 40 300 80 T600 80 T900 80 T1200 80 L1200 120 L0 120 Z"
          fill={COLORS.oceanBlue}
          className={reducedMotion ? '' : 'animate-wave-front'}
        />
        {/* Foam */}
        <ellipse cx="100" cy="85" rx="30" ry="5" fill="#fff" opacity="0.6" />
        <ellipse cx="400" cy="82" rx="25" ry="4" fill="#fff" opacity="0.5" />
        <ellipse cx="700" cy="88" rx="35" ry="5" fill="#fff" opacity="0.6" />
        <ellipse cx="1000" cy="84" rx="28" ry="4" fill="#fff" opacity="0.5" />
      </svg>

      {/* Beach sand line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-4"
        style={{ background: `linear-gradient(180deg, ${COLORS.sandLight} 0%, ${COLORS.sandDark} 100%)` }}
      />
    </div>
  )
}

// Floating jungle decorations
function JungleFloaters({ profession, reducedMotion = false }: { profession: 'engineer' | 'drummer' | 'fighter'; reducedMotion?: boolean }) {
  const floatersByProfession = {
    engineer: [
      { type: 'wumpa', x: 5, y: 15 },
      { type: 'crystal', x: 92, y: 25 },
      { type: 'crate', x: 8, y: 70 },
      { type: 'crystal', x: 88, y: 80 },
      { type: 'wumpa', x: 15, y: 45 },
    ],
    drummer: [
      { type: 'wumpa', x: 5, y: 20 },
      { type: 'crystal', x: 90, y: 30 },
      { type: 'wumpa', x: 10, y: 60 },
      { type: 'crate', x: 88, y: 70 },
      { type: 'crystal', x: 6, y: 85 },
    ],
    fighter: [
      { type: 'crystal', x: 5, y: 20 },
      { type: 'wumpa', x: 92, y: 25 },
      { type: 'crate', x: 8, y: 65 },
      { type: 'wumpa', x: 90, y: 75 },
      { type: 'crystal', x: 6, y: 45 },
    ],
  }

  const floaters = floatersByProfession[profession]

  return (
    <div className="fixed inset-0 pointer-events-none z-[4] overflow-hidden" aria-hidden="true">
      {floaters.map((f, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${f.x}%`,
            top: `${f.y}%`,
            opacity: 0.5,
            animation: reducedMotion ? 'none' : `jungleFloat ${12 + i * 2}s ease-in-out infinite`,
            animationDelay: `${-i * 1.5}s`,
          }}
        >
          {f.type === 'wumpa' && <WumpaFruit size={28} />}
          {f.type === 'crystal' && <Crystal size={22} />}
          {f.type === 'crate' && <WoodenCrate size={26} />}
        </div>
      ))}
    </div>
  )
}

// Section wrapper with wooden crate styling
function CrateSection({
  children,
  title,
  titleIcon,
  variant = 'normal',
  className = '',
}: {
  children: React.ReactNode
  title: string
  titleIcon?: React.ReactNode
  variant?: 'normal' | 'tnt' | 'checkpoint' | 'temple'
  className?: string
}) {
  const styles = {
    normal: {
      bg: `linear-gradient(135deg, ${COLORS.crateWood}dd, ${COLORS.crateDark}ee)`,
      border: COLORS.crateHighlight,
      titleBg: COLORS.crateWood,
    },
    tnt: {
      bg: `linear-gradient(135deg, ${COLORS.tntRed}cc, #440000ee)`,
      border: COLORS.tntBright,
      titleBg: COLORS.tntRed,
    },
    checkpoint: {
      bg: `linear-gradient(135deg, ${COLORS.crystalBlue}20, ${COLORS.oceanDeep}40)`,
      border: COLORS.crystalBlue,
      titleBg: COLORS.oceanDeep,
    },
    temple: {
      bg: `linear-gradient(135deg, ${COLORS.templeStone}dd, ${COLORS.templeDark}ee)`,
      border: COLORS.akuGold,
      titleBg: COLORS.templeDark,
    },
  }

  const s = styles[variant]

  return (
    <section className={`relative ${className}`} aria-labelledby={`section-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      {/* Corner decorations */}
      <div className="absolute -top-2 -left-2 w-8 h-8" style={{ borderLeft: `3px solid ${s.border}`, borderTop: `3px solid ${s.border}` }} aria-hidden="true" />
      <div className="absolute -top-2 -right-2 w-8 h-8" style={{ borderRight: `3px solid ${s.border}`, borderTop: `3px solid ${s.border}` }} aria-hidden="true" />
      <div className="absolute -bottom-2 -left-2 w-8 h-8" style={{ borderLeft: `3px solid ${s.border}`, borderBottom: `3px solid ${s.border}` }} aria-hidden="true" />
      <div className="absolute -bottom-2 -right-2 w-8 h-8" style={{ borderRight: `3px solid ${s.border}`, borderBottom: `3px solid ${s.border}` }} aria-hidden="true" />

      <div
        className="relative rounded-lg overflow-hidden"
        style={{
          background: s.bg,
          border: `3px solid ${s.border}`,
          boxShadow: `0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)`,
        }}
      >
        {/* Wood grain texture overlay */}
        {variant === 'normal' && (
          <div
            className="absolute inset-0 pointer-events-none opacity-10"
            style={{
              backgroundImage: `repeating-linear-gradient(
                90deg,
                transparent,
                transparent 20px,
                ${COLORS.crateDark} 20px,
                ${COLORS.crateDark} 21px
              )`,
            }}
            aria-hidden="true"
          />
        )}

        {/* Temple stone texture */}
        {variant === 'temple' && (
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: `repeating-linear-gradient(
                0deg,
                transparent,
                transparent 30px,
                ${COLORS.mossGreen} 30px,
                ${COLORS.mossGreen} 32px
              ), repeating-linear-gradient(
                90deg,
                transparent,
                transparent 40px,
                ${COLORS.templeDark} 40px,
                ${COLORS.templeDark} 42px
              )`,
            }}
            aria-hidden="true"
          />
        )}

        {/* Title bar */}
        <div
          className="px-6 py-3 flex items-center gap-3"
          style={{
            background: `linear-gradient(180deg, ${s.titleBg}, ${s.titleBg}cc)`,
            borderBottom: `2px solid ${s.border}`,
          }}
        >
          {titleIcon}
          <h2
            id={`section-${title.toLowerCase().replace(/\s+/g, '-')}`}
            className="text-lg font-bold tracking-wide uppercase"
            style={{ color: '#fff', textShadow: '2px 2px 0 rgba(0,0,0,0.5)' }}
          >
            {title}
          </h2>
        </div>

        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </section>
  )
}

// Tech stack display with crate-styled chips
function TechCrates({ categories }: { categories: ReturnType<typeof getEngineerSkills> }) {
  return (
    <div className="space-y-6">
      {categories.map((category) => (
        <div key={category.name}>
          <h3
            className="text-sm tracking-wider mb-3 font-bold uppercase flex items-center gap-2"
            style={{ color: COLORS.wumpaOrange }}
          >
            <WumpaFruit size={16} />
            {category.name}
          </h3>
          <div className="flex flex-wrap gap-2">
            {category.items.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1.5 text-sm font-bold transition-transform hover:scale-105 cursor-default"
                style={{
                  background: `linear-gradient(180deg, ${COLORS.crateWood}, ${COLORS.crateDark})`,
                  border: `2px solid ${COLORS.crateHighlight}`,
                  color: '#fff',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2), 0 2px 4px rgba(0,0,0,0.3)',
                  textShadow: '1px 1px 0 rgba(0,0,0,0.5)',
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

// Skills list for drummer/fighter with achievements
function SkillsList({ categories, profession }: { categories: ReturnType<typeof getSkillsByProfession>; profession: 'drummer' | 'fighter' }) {
  const achievements = SKILL_ACHIEVEMENTS[profession] || {}

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <div key={category.name}>
          <h3
            className="text-sm tracking-wider mb-3 font-bold uppercase flex items-center gap-2"
            style={{ color: COLORS.crystalBlue }}
          >
            <Crystal size={14} color={COLORS.crystalPurple} />
            {category.name}
          </h3>
          <ul className="space-y-3">
            {category.skills.map((skill) => {
              const skillAchievements = achievements[skill.name] || []
              return (
                <li
                  key={skill.name}
                  className="p-2 rounded"
                  style={{
                    background: `linear-gradient(135deg, ${COLORS.templeDark}80, transparent)`,
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <WumpaFruit size={14} />
                    <span className="text-sm font-bold" style={{ color: '#fff' }}>{skill.name}</span>
                  </div>
                  {skillAchievements.length > 0 && (
                    <ul className="ml-6 space-y-0.5">
                      {skillAchievements.map((achievement, i) => (
                        <li key={i} className="text-xs" style={{ color: COLORS.sandLight }}>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </div>
  )
}

// Work Experience card
function ExperienceCard({ entry }: { entry: typeof EXPERIENCE_DATA[0] }) {
  const endDisplay = entry.endDate ? new Date(entry.endDate).getFullYear() : 'Present'
  const startDisplay = new Date(entry.startDate).getFullYear()

  return (
    <article
      className="p-4 rounded-lg transition-transform hover:scale-[1.01]"
      style={{
        background: `linear-gradient(135deg, ${COLORS.templeDark}, ${COLORS.templeStone}30)`,
        border: `2px solid ${COLORS.akuGold}40`,
      }}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="text-base font-bold" style={{ color: '#fff' }}>{entry.title}</h4>
          <p className="text-sm" style={{ color: COLORS.wumpaOrange }}>{entry.organization}</p>
        </div>
        <span
          className="text-xs px-2 py-1 rounded"
          style={{ background: COLORS.oceanDeep, color: COLORS.crystalBlue }}
        >
          {startDisplay} - {endDisplay}
        </span>
      </div>
      <p className="text-sm mb-3" style={{ color: COLORS.sandLight }}>{entry.description}</p>
      {entry.highlights && entry.highlights.length > 0 && (
        <ul className="space-y-1">
          {entry.highlights.map((highlight, i) => (
            <li key={i} className="text-sm flex items-start gap-2" style={{ color: '#fff' }}>
              <WumpaFruit size={14} className="flex-shrink-0 mt-0.5" />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

// Project card with wumpa fruit styling
function ProjectCard({ project }: { project: typeof PROJECTS_DATA[0] }) {
  return (
    <article
      className="p-4 rounded-lg transition-all hover:scale-[1.02] group"
      style={{
        background: `linear-gradient(135deg, ${COLORS.crateDark}, ${COLORS.templeDark})`,
        border: `2px solid ${project.featured ? COLORS.crystalBlue : COLORS.crateWood}`,
        boxShadow: project.featured ? `0 0 20px ${COLORS.crystalBlue}30` : 'none',
      }}
    >
      {project.featured && (
        <div className="flex items-center gap-2 mb-2">
          <Crystal size={14} />
          <span className="text-xs tracking-wider font-bold uppercase" style={{ color: COLORS.crystalBlue }}>
            Featured
          </span>
        </div>
      )}
      <h4
        className="text-base font-bold group-hover:text-orange-400 transition-colors"
        style={{ color: '#fff' }}
      >
        {project.name}
      </h4>
      <p className="text-sm mt-2" style={{ color: COLORS.sandLight }}>{project.tagline}</p>
      {project.impact && (
        <p className="text-sm mt-2 font-bold flex items-center gap-2" style={{ color: COLORS.wumpaOrange }}>
          <WumpaFruit size={14} />
          {project.impact}
        </p>
      )}
      <div className="flex flex-wrap gap-1 mt-3">
        {project.techStack.slice(0, 4).map((tech) => (
          <span
            key={tech}
            className="text-xs px-2 py-0.5 rounded"
            style={{ background: `${COLORS.jungleGreen}80`, color: COLORS.palmGreen }}
          >
            {tech}
          </span>
        ))}
      </div>
    </article>
  )
}

// Company/Venture card
function VentureCard({ company }: { company: typeof COMPANIES[0] }) {
  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 rounded-lg transition-all hover:scale-[1.02] group"
      style={{
        background: `linear-gradient(135deg, ${COLORS.crateDark}, ${COLORS.templeDark})`,
        border: `2px solid ${COLORS.crateWood}`,
      }}
      aria-label={`Visit ${company.name} - ${company.tagline}`}
    >
      <div className="flex items-center gap-3 mb-2">
        <WoodenCrate size={32} variant="checkpoint" />
        <div>
          <h4 className="text-base font-bold group-hover:text-orange-400 transition-colors" style={{ color: '#fff' }}>
            {company.name}
          </h4>
          <p className="text-xs" style={{ color: COLORS.wumpaOrange }}>{company.tagline}</p>
        </div>
      </div>
      <p className="text-sm" style={{ color: COLORS.sandLight }}>{company.description}</p>
    </a>
  )
}

// Band card
function BandCard({ band }: { band: typeof BANDS[0] }) {
  const content = (
    <article
      className="p-4 rounded-lg transition-all hover:scale-[1.02] group"
      style={{
        background: `linear-gradient(135deg, ${COLORS.crateDark}, ${COLORS.templeDark})`,
        border: `2px solid ${COLORS.crystalPurple}40`,
      }}
    >
      <h4 className="text-base font-bold group-hover:text-orange-400 transition-colors" style={{ color: '#fff' }}>
        {band.name}
      </h4>
      <p className="text-xs mt-1" style={{ color: COLORS.crystalPurple }}>
        {band.genre} | {band.role}
      </p>
      <p className="text-sm mt-2" style={{ color: COLORS.sandLight }}>{band.description}</p>
    </article>
  )

  if (band.url) {
    return (
      <a
        href={band.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
        aria-label={`Visit ${band.name} website`}
      >
        {content}
      </a>
    )
  }
  return content
}

// Warp Zone profession selector
function WarpZoneSelector({
  active,
  onSelect,
  reducedMotion = false,
}: {
  active: 'engineer' | 'drummer' | 'fighter'
  onSelect: (p: 'engineer' | 'drummer' | 'fighter') => void
  reducedMotion?: boolean
}) {
  const zones = [
    { id: 'engineer' as const, label: 'Engineer', color: COLORS.crystalBlue },
    { id: 'drummer' as const, label: 'Musician', color: COLORS.crystalPurple },
    { id: 'fighter' as const, label: 'Fighter', color: COLORS.gemRed },
  ]

  return (
    <div className="flex justify-center gap-6 py-8" role="tablist" aria-label="Profession selector">
      {zones.map((zone) => {
        const isActive = active === zone.id
        return (
          <button
            key={zone.id}
            onClick={() => onSelect(zone.id)}
            role="tab"
            aria-selected={isActive}
            aria-controls={`${zone.id}-content`}
            className="relative group focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-lg"
            style={{ focusRing: zone.color } as React.CSSProperties}
          >
            {/* Glow effect */}
            <div
              className={`absolute inset-0 rounded-lg blur-xl transition-all duration-300 ${
                isActive ? 'opacity-60 scale-125' : 'opacity-0 group-hover:opacity-30'
              }`}
              style={{ background: zone.color }}
              aria-hidden="true"
            />

            {/* Warp portal */}
            <div
              className={`relative w-24 h-24 rounded-lg flex flex-col items-center justify-center transition-all duration-300 ${
                isActive ? 'scale-110' : 'group-hover:scale-105'
              }`}
              style={{
                background: `linear-gradient(135deg, ${zone.color}30, ${COLORS.templeDark})`,
                border: `3px solid ${isActive ? zone.color : COLORS.crateWood}`,
                boxShadow: isActive
                  ? `0 0 30px ${zone.color}60, inset 0 0 20px ${zone.color}30`
                  : '0 4px 10px rgba(0,0,0,0.5)',
              }}
            >
              <Crystal size={32} color={zone.color} />
              <span
                className="text-xs tracking-wider uppercase mt-2 font-bold"
                style={{ color: isActive ? zone.color : COLORS.sandLight }}
              >
                {zone.label}
              </span>
            </div>

            {/* Active indicator - Aku Aku appearing */}
            {isActive && !reducedMotion && (
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 animate-aku-bounce">
                <AkuAkuMask size={30} animated={false} />
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}

// Main theme component
export default function TropicalPlatformerTheme() {
  const { active, setActive } = useProfession()
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
        background: `linear-gradient(180deg,
          ${COLORS.skyBlue} 0%,
          ${COLORS.jungleDark} 20%,
          ${COLORS.templeDark} 60%,
          ${COLORS.oceanDeep} 100%
        )`,
      }}
    >
      {/* Global animations */}
      <style jsx global>{`
        @keyframes jungleFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-12px) rotate(5deg); }
          50% { transform: translateY(-4px) rotate(-3deg); }
          75% { transform: translateY(-16px) rotate(8deg); }
        }

        @keyframes aku-glow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }

        @keyframes aku-bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-8px); }
        }

        @keyframes tnt-pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }

        @keyframes nitro-glow {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.1); }
        }

        @keyframes wave-back {
          0% { transform: translateX(0); }
          100% { transform: translateX(-300px); }
        }

        @keyframes wave-front {
          0% { transform: translateX(0); }
          100% { transform: translateX(-300px); }
        }

        .animate-aku-glow {
          animation: aku-glow 2s ease-in-out infinite;
        }

        .animate-aku-bounce {
          animation: aku-bounce 1s ease-in-out infinite;
        }

        .animate-tnt-pulse {
          animation: tnt-pulse 1s ease-in-out infinite;
        }

        .animate-nitro-glow {
          animation: nitro-glow 1.5s ease-in-out infinite;
        }

        .animate-wave-back {
          animation: wave-back 8s linear infinite;
        }

        .animate-wave-front {
          animation: wave-front 6s linear infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-aku-glow,
          .animate-aku-bounce,
          .animate-tnt-pulse,
          .animate-nitro-glow,
          .animate-wave-back,
          .animate-wave-front {
            animation: none;
          }
        }
      `}</style>

      {/* Jungle canopy overlay at top */}
      <div
        className="fixed top-0 left-0 right-0 h-32 z-[2] pointer-events-none"
        style={{
          background: `linear-gradient(180deg, ${COLORS.jungleDark}dd 0%, ${COLORS.jungleGreen}80 40%, transparent 100%)`,
        }}
        aria-hidden="true"
      >
        {/* Palm frond silhouettes */}
        <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="absolute bottom-0 w-full h-12 opacity-60">
          <path d="M0 20 Q10 5 20 20 Q30 10 40 20 Q50 8 60 20 Q70 12 80 20 Q90 6 100 20" fill={COLORS.jungleDark} />
        </svg>
      </div>

      {/* Jungle vines on sides */}
      <JungleVine side="left" />
      <JungleVine side="right" />

      {/* Floating decorations */}
      <JungleFloaters profession={active} reducedMotion={reducedMotion} />

      {/* Ocean waves at bottom */}
      <OceanWaves />

      {/* Header */}
      <header className="relative z-30 p-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            {/* Life counter */}
            <LifeCounter lives={99} className="mb-2" />

            <h1
              className="text-4xl md:text-5xl font-bold tracking-wide"
              style={{
                color: COLORS.wumpaOrange,
                textShadow: `
                  3px 3px 0 ${COLORS.jungleDark},
                  -1px -1px 0 #000,
                  1px -1px 0 #000,
                  -1px 1px 0 #000,
                  0 0 30px ${COLORS.wumpaOrange}60
                `,
              }}
            >
              ALEXANDER PULIDO
            </h1>
            <p
              className="text-xl font-bold mt-2"
              style={{ color: '#fff', textShadow: '2px 2px 0 rgba(0,0,0,0.8)' }}
            >
              {PROFESSIONAL_SUMMARY.headline}
            </p>
            <p
              className="text-base mt-1 italic"
              style={{ color: COLORS.crystalBlue, textShadow: '1px 1px 0 rgba(0,0,0,0.5)' }}
            >
              {PROFESSIONAL_SUMMARY.tagline}
            </p>
          </div>

          <div className="flex gap-3 items-center flex-wrap">
            {/* Crate buttons */}
            <Link
              href="/cv"
              className="px-4 py-2 font-bold tracking-wider transition-all hover:scale-105 flex items-center gap-2"
              style={{
                background: `linear-gradient(180deg, ${COLORS.crateWood}, ${COLORS.crateDark})`,
                border: `3px solid ${COLORS.wumpaOrange}`,
                color: '#fff',
                boxShadow: '0 4px 0 #3a2010, inset 0 1px 0 rgba(255,255,255,0.2)',
                textShadow: '1px 1px 0 rgba(0,0,0,0.5)',
              }}
              aria-label="View CV"
            >
              <WoodenCrate size={20} />
              CV
            </Link>
            <Link
              href="/personal-projects/game-engine"
              className="px-4 py-2 font-bold tracking-wider transition-all hover:scale-105 flex items-center gap-2"
              style={{
                background: `linear-gradient(180deg, ${COLORS.oceanDeep}, ${COLORS.templeDark})`,
                border: `3px solid ${COLORS.crystalBlue}`,
                color: COLORS.crystalBlue,
                boxShadow: '0 4px 0 #001a33, inset 0 1px 0 rgba(255,255,255,0.1)',
              }}
              aria-label="View Nebulith game engine project"
            >
              <Crystal size={18} />
              NEBULITH
            </Link>
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      {/* Current Roles */}
      <section className="relative z-20 py-4 px-6" aria-labelledby="current-roles-heading">
        <h2 id="current-roles-heading" className="sr-only">Current Roles</h2>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-8">
            {CURRENT_ROLES.map((role) => (
              <div
                key={role.id}
                className="text-center p-3 rounded-lg"
                style={{
                  background: `linear-gradient(135deg, ${COLORS.templeStone}40, transparent)`,
                  border: `1px solid ${COLORS.akuGold}30`,
                }}
              >
                <p className="text-sm font-bold" style={{ color: COLORS.wumpaOrange }}>{role.title}</p>
                <p className="text-lg font-bold" style={{ color: '#fff' }}>{role.company}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Warp Zone Profession Selector */}
      <section className="relative z-20 py-4" aria-label="Select profession">
        <WarpZoneSelector active={active} onSelect={setActive} reducedMotion={reducedMotion} />
      </section>

      {/* About / Bio Section */}
      <section className="relative z-20 py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <CrateSection
            title="About"
            titleIcon={<AkuAkuMask size={30} animated={!reducedMotion} />}
            variant="checkpoint"
          >
            <p className="text-base leading-relaxed mb-4" style={{ color: '#fff' }}>
              {aboutData.bio}
            </p>
            <div className="flex flex-wrap gap-3">
              {aboutData.quickFacts.map((fact, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 text-sm font-bold flex items-center gap-2"
                  style={{
                    background: `${COLORS.wumpaOrange}20`,
                    border: `2px solid ${COLORS.wumpaOrange}`,
                    color: COLORS.wumpaOrange,
                  }}
                >
                  <WumpaFruit size={14} />
                  {fact}
                </span>
              ))}
            </div>
          </CrateSection>
        </div>
      </section>

      {/* Work Experience */}
      {experience.length > 0 && (
        <section className="relative z-20 py-8 px-6">
          <div className="max-w-4xl mx-auto">
            <CrateSection
              title="Work Experience"
              titleIcon={<WoodenCrate size={24} variant="checkpoint" />}
              variant="temple"
            >
              <div className="space-y-4">
                {experience.map((entry) => (
                  <ExperienceCard key={entry.id} entry={entry} />
                ))}
              </div>
            </CrateSection>
          </div>
        </section>
      )}

      {/* Tech Stack / Skills */}
      <section className="relative z-20 py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <CrateSection
            title={active === 'engineer' ? 'Tech Stack' : 'Skills'}
            titleIcon={active === 'engineer' ? <WoodenCrate size={24} /> : <Crystal size={22} color={COLORS.crystalPurple} />}
            variant="normal"
          >
            {active === 'engineer' ? (
              <TechCrates categories={engineerTech} />
            ) : (
              <SkillsList categories={otherSkills} profession={active as 'drummer' | 'fighter'} />
            )}
          </CrateSection>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="relative z-20 py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <CrateSection
            title="Featured Work"
            titleIcon={<TNTCrate size={28} />}
            variant="tnt"
          >
            <div className="grid md:grid-cols-2 gap-4">
              {projects.filter(p => p.featured).slice(0, 6).map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </CrateSection>
        </div>
      </section>

      {/* Companies (Engineer) */}
      {active === 'engineer' && (
        <section className="relative z-20 py-8 px-6">
          <div className="max-w-4xl mx-auto">
            <CrateSection
              title="Ventures"
              titleIcon={<Crystal size={22} />}
              variant="checkpoint"
            >
              <div className="grid md:grid-cols-3 gap-4">
                {COMPANIES.map((company) => (
                  <VentureCard key={company.id} company={company} />
                ))}
              </div>
            </CrateSection>
          </div>
        </section>
      )}

      {/* Bands (Drummer) */}
      {active === 'drummer' && (
        <section className="relative z-20 py-8 px-6">
          <div className="max-w-4xl mx-auto">
            <CrateSection
              title="Bands"
              titleIcon={<Crystal size={22} color={COLORS.crystalPurple} />}
              variant="checkpoint"
            >
              <div className="grid md:grid-cols-3 gap-4">
                {BANDS.map((band) => (
                  <BandCard key={band.id} band={band} />
                ))}
              </div>
            </CrateSection>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="relative z-20 py-16 text-center">
        <div className="flex justify-center gap-4 mb-4">
          <WumpaFruit size={40} />
          <Crystal size={36} />
          <TNTCrate size={36} />
        </div>
        <AkuAkuMask size={50} className="mx-auto mb-4" animated={!reducedMotion} />
        <p className="text-sm" style={{ color: COLORS.sandLight }}>
          N. Sanity Beach, Wumpa Islands
        </p>
        <div className="flex justify-center gap-6 mt-6">
          <WoodenCrate size={30} />
          <NitroCrate size={30} />
          <WoodenCrate size={30} variant="bounce" />
        </div>
      </footer>
    </div>
  )
}
