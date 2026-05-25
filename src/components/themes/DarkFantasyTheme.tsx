'use client'

import { useEffect, useState, useRef, useMemo, memo } from 'react'
import Link from 'next/link'
import { useTheme } from '@/themes/ThemeContext'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import { useProfession } from '@/contexts/ProfessionContext'
import { ABOUT_DATA, PROFESSIONAL_SUMMARY } from '@/data/about'
import { PROJECTS_DATA } from '@/data/projects'
import { getSkillsByProfession, getEngineerSkills } from '@/data/skills'
import { COMPANIES } from '@/data/companies'
import { BANDS } from '@/data/bands'
import { EXPERIENCE_DATA, filterExperienceByProfession } from '@/data/experience'
import { useInViewTrigger } from '@/hooks/useScrollAnimation'
import { useScrollTriggers, TriggerState, getDefaultTriggerStyles } from '@/hooks/useScrollTriggers'
import { SkipLink } from '@/components/themes/shared/AccessibilityStyles'
import { CursorTrail, ParallaxLayers } from './DarkFantasy/InteractiveElements'
import { KnightSlashReveal } from './DarkFantasy/KnightCharacter'
import { BugPullReveal } from './DarkFantasy/BugCreature'
import { BattleReveal } from './DarkFantasy/BattleReveal'

// Blended Dark Fantasy Metroidvania palette
// Hollow Knight ethereal blues + Iconoclast brass/copper + Ori spirit gold + Salt & Sanctuary stone
const DF = {
  // Deep void backgrounds (HK + S&S)
  void: '#0f0a1a',
  voidDeep: '#1a1025',
  voidPurple: '#150f25',

  // Ethereal cyan/teal (HK soul)
  ethereal: '#41c8e8',
  etherealDark: '#5ecfef',

  // Spirit/soul gold (Ori)
  spiritGold: '#e8c841',
  spiritGoldDark: '#d4af37',

  // Mechanical brass/copper (Iconoclast)
  brass: '#b08d57',
  copper: '#8b6914',

  // Organic green (Ori forests)
  forestGreen: '#4a8f4a',
  mossGreen: '#2d5a2d',

  // Stone grey (Salt & Sanctuary)
  stoneGrey: '#4a4a4a',
  stoneDark: '#333333',

  // UI elements
  bone: '#e8e4dc',
  silver: '#a0a0a0',
  lavender: '#b7a9d9',
}

/**
 * TRIGGER CONFIGURATION
 * ====================
 * Each trigger defines when content ANIMATIONS start.
 * Position is a percentage of total page height (0-100).
 *
 * Content starts HIDDEN in animation components - triggers control
 * when content animates INTO view.
 *
 * viewportTriggerOffset 0.35 means triggers fire when:
 *   scrollY + (viewport * 0.35) >= triggerY
 * This ensures animations play when section is ~35% up from bottom.
 */
const TRIGGER_CONFIG = [
  { id: 'profession-selector', position: 5 },
  { id: 'about', position: 10 },
  { id: 'art-spirits', position: 18 },
  { id: 'experience', position: 25 },       // KnightSlashReveal: Alex enters, slashes content into view
  { id: 'art-lanterns', position: 30 },
  { id: 'tech-stack', position: 35 },       // Simple fade (TriggerSection)
  { id: 'projects', position: 60 },         // BugAttackReveal: 40% from bottom
  { id: 'art-crystals', position: 68 },
  { id: 'ventures', position: 75 },
  { id: 'posts', position: 85 },
  { id: 'contact', position: 98 },          // BattleReveal: at footer
]

/**
 * TRIGGER SECTION WRAPPER
 * ======================
 * Wraps content and controls visibility based on scroll triggers.
 * Uses GPU-accelerated properties only (transform, opacity).
 *
 * Props:
 * - id: Must match a trigger ID from TRIGGER_CONFIG
 * - states: Trigger states map from useScrollTriggers
 * - children: Content to show/hide
 * - preRender: If false, content is not in DOM until triggered
 */
const TriggerSection = memo(function TriggerSection({
  id,
  states,
  children,
  preRender = true,
  className = '',
}: {
  id: string
  states: Map<string, TriggerState>
  children: React.ReactNode
  preRender?: boolean
  className?: string
}) {
  const state = states.get(id)
  const triggered = state?.triggered ?? false

  // Don't render if not pre-rendering and not triggered
  if (!preRender && !triggered) {
    return null
  }

  const styles = getDefaultTriggerStyles(state)

  return (
    <div className={className} style={styles}>
      {children}
    </div>
  )
})

// Abstract spirit wisp - optimized: no SVG filter
const SpiritWisp = memo(function SpiritWisp({ size = 40, color = DF.ethereal }: { size?: number; color?: string }) {
  const gradId = `wispGlow-${color?.replace('#', '')}`
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" role="presentation">
      <defs>
        <radialGradient id={gradId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.9" />
          <stop offset="30%" stopColor={color} stopOpacity="0.6" />
          <stop offset="60%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Outer ethereal haze - multiple circles instead of filter */}
      <circle cx="20" cy="20" r="18" fill={`url(#${gradId})`} />
      <circle cx="20" cy="20" r="12" fill={color} opacity="0.15" />
      {/* Inner core */}
      <ellipse cx="20" cy="20" rx="6" ry="8" fill={color} opacity="0.8" />
      {/* Trailing wisps */}
      <path
        d="M16,26 Q12,32 10,36 M20,28 Q20,34 18,38 M24,26 Q28,32 30,36"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.4"
      />
    </svg>
  )
})

// Mechanical gear (Iconoclast-inspired)
const MechanicalGear = memo(function MechanicalGear({ size = 50 }: { size?: number }) {
  const teeth = 12
  return (
    <svg width={size} height={size} viewBox="0 0 50 50" aria-hidden="true" role="presentation">
      <defs>
        <linearGradient id="brassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={DF.brass} />
          <stop offset="100%" stopColor={DF.copper} />
        </linearGradient>
      </defs>
      {/* Gear teeth */}
      {Array.from({ length: teeth }, (_, i) => {
        const angle = (i * 360) / teeth
        const rad = (angle * Math.PI) / 180
        const innerR = 16
        const outerR = 22
        const toothWidth = 0.15
        const x1 = 25 + Math.cos(rad - toothWidth) * innerR
        const y1 = 25 + Math.sin(rad - toothWidth) * innerR
        const x2 = 25 + Math.cos(rad - toothWidth * 0.5) * outerR
        const y2 = 25 + Math.sin(rad - toothWidth * 0.5) * outerR
        const x3 = 25 + Math.cos(rad + toothWidth * 0.5) * outerR
        const y3 = 25 + Math.sin(rad + toothWidth * 0.5) * outerR
        const x4 = 25 + Math.cos(rad + toothWidth) * innerR
        const y4 = 25 + Math.sin(rad + toothWidth) * innerR
        return (
          <path
            key={i}
            d={`M${x1},${y1} L${x2},${y2} L${x3},${y3} L${x4},${y4}`}
            fill="url(#brassGrad)"
          />
        )
      })}
      {/* Inner ring */}
      <circle cx="25" cy="25" r="16" fill="none" stroke="url(#brassGrad)" strokeWidth="3" />
      {/* Center hole */}
      <circle cx="25" cy="25" r="6" fill={DF.voidDeep} stroke={DF.brass} strokeWidth="1" />
      {/* Decorative spokes */}
      <path d="M25,10 L25,19 M25,31 L25,40 M10,25 L19,25 M31,25 L40,25" stroke={DF.copper} strokeWidth="2" opacity="0.5" />
    </svg>
  )
})

// Floating lantern (generic dark fantasy element)
const FloatingLantern = memo(function FloatingLantern({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size * 1.4} viewBox="0 0 30 42" aria-hidden="true" role="presentation">
      {/* Lantern frame - gothic style */}
      <path
        d="M10,12 L10,32 Q10,38 15,38 Q20,38 20,32 L20,12"
        fill="none"
        stroke={DF.copper}
        strokeWidth="1.5"
      />
      {/* Top cap */}
      <path d="M8,12 L22,12 L20,8 Q15,6 10,8 Z" fill={DF.brass} />
      {/* Hook */}
      <path d="M15,8 L15,2 Q15,0 17,0 Q19,0 19,2" fill="none" stroke={DF.copper} strokeWidth="1" />
      {/* Glass panels */}
      <rect x="11" y="14" width="8" height="16" fill={DF.spiritGold} opacity="0.3" />
      {/* Inner flame glow */}
      <ellipse cx="15" cy="22" rx="3" ry="5" fill={DF.spiritGold} opacity="0.8" />
      <ellipse cx="15" cy="22" rx="5" ry="8" fill={DF.spiritGold} opacity="0.3" />
    </svg>
  )
})

// Ethereal rain effect - optimized with fewer elements
const EtherealRain = memo(function EtherealRain() {
  const drops = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      height: Math.random() * 20 + 10,
      opacity: Math.random() * 0.3 + 0.1,
      speed: Math.random() * 1.5 + 0.8,
      delay: Math.random() * -3,
    })),
    []
  )

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[4] overflow-hidden"
      style={{ contain: 'strict' }}
      aria-hidden="true"
      role="presentation"
    >
      {drops.map((d) => (
        <div
          key={d.id}
          className="absolute w-px"
          style={{
            left: `${d.x}%`,
            top: '-30px',
            height: d.height,
            background: `linear-gradient(180deg, transparent, ${DF.ethereal}${Math.round(d.opacity * 255).toString(16).padStart(2, '0')})`,
            animation: `etherealRain ${d.speed}s linear infinite`,
            animationDelay: `${d.delay}s`,
          }}
        />
      ))}
    </div>
  )
})

// Spirit particles - optimized: no box-shadow, fewer elements
const SpiritParticles = memo(function SpiritParticles() {
  const particles = useMemo(() =>
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 5 + 3,
      opacity: Math.random() * 0.4 + 0.2,
      speed: Math.random() * 30 + 20,
      delay: Math.random() * -25,
      color: i % 3 === 0 ? DF.spiritGold : i % 3 === 1 ? DF.ethereal : DF.forestGreen,
    })),
    []
  )

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[5] overflow-hidden"
      style={{ contain: 'strict' }}
      aria-hidden="true"
      role="presentation"
    >
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size * 2.5,
            height: p.size * 2.5,
            background: `radial-gradient(circle, ${p.color} 20%, ${p.color}40 50%, transparent 70%)`,
            animation: `spiritFloat ${p.speed}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  )
})

// Gothic chandelier with mechanical elements - compact version that doesn't overlap content
const GothicChandelier = memo(function GothicChandelier() {
  return (
    <svg
      className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[500px] h-16 opacity-50"
      viewBox="0 0 500 60"
      aria-hidden="true"
      role="presentation"
    >
      {/* Central chain with gear link */}
      <path d="M250,0 L250,10" stroke={DF.brass} strokeWidth="2" />
      <circle cx="250" cy="14" r="4" fill="none" stroke={DF.copper} strokeWidth="1" />
      <circle cx="250" cy="14" r="2" fill={DF.brass} />

      {/* Simple ornate arms */}
      <path
        d="M250,18 Q200,22 150,20 Q100,24 50,22"
        fill="none"
        stroke={DF.brass}
        strokeWidth="1"
        opacity="0.6"
      />
      <path
        d="M250,18 Q300,22 350,20 Q400,24 450,22"
        fill="none"
        stroke={DF.brass}
        strokeWidth="1"
        opacity="0.6"
      />

      {/* Subtle glow points along the arms */}
      {[100, 175, 250, 325, 400].map((x, i) => (
        <g key={i}>
          <circle cx={x} cy={22 + Math.abs(x - 250) * 0.01} r="3" fill={DF.spiritGold} opacity="0.3" />
          <circle cx={x} cy={22 + Math.abs(x - 250) * 0.01} r="6" fill={DF.spiritGold} opacity="0.1" />
        </g>
      ))}

      {/* Central larger glow */}
      <ellipse cx="250" cy="30" rx="20" ry="12" fill={DF.spiritGold} opacity="0.15" />
    </svg>
  )
})

// Stone/crystal formations (Salt and Sanctuary inspired)
const StoneFormations = memo(function StoneFormations() {
  return (
    <svg
      className="fixed bottom-0 left-0 w-full h-32 opacity-60 pointer-events-none z-[6]"
      viewBox="0 0 1000 100"
      preserveAspectRatio="none"
      aria-hidden="true"
      role="presentation"
    >
      {/* Base weathered stone */}
      <path
        d="M0,85 Q200,82 400,88 Q600,80 800,86 Q900,83 1000,85 L1000,100 L0,100 Z"
        fill={DF.stoneDark}
      />

      {/* Crystal/stone spikes - irregular, weathered */}
      {Array.from({ length: 20 }, (_, i) => {
        const x = i * 50 + 25 + (Math.random() - 0.5) * 20
        const height = 25 + Math.random() * 35
        const width = 8 + Math.random() * 8
        const lean = (Math.random() - 0.5) * 10
        const isCrystal = i % 4 === 0
        return (
          <g key={i}>
            <path
              d={`M${x},85
                 L${x + lean - width * 0.3},${85 - height * 0.7}
                 L${x + lean},${85 - height}
                 L${x + lean + width * 0.3},${85 - height * 0.7}
                 L${x},85`}
              fill={isCrystal ? DF.ethereal : DF.stoneGrey}
              opacity={isCrystal ? 0.4 : 0.8}
            />
            {isCrystal && (
              <path
                d={`M${x + lean},${85 - height} L${x + lean},${85 - height + 10}`}
                stroke={DF.ethereal}
                strokeWidth="2"
                opacity="0.6"
              />
            )}
          </g>
        )
      })}

      {/* Moss/organic growth patches */}
      {[100, 350, 650, 850].map((x, i) => (
        <ellipse
          key={i}
          cx={x}
          cy={90}
          rx={30 + Math.random() * 20}
          ry={8}
          fill={DF.mossGreen}
          opacity="0.3"
        />
      ))}
    </svg>
  )
})

// Gothic window with Ori-style light rays
const GothicWindow = memo(function GothicWindow({ side }: { side: 'left' | 'right' }) {
  const xPos = side === 'left' ? '5%' : '95%'
  const transform = side === 'left' ? 'translateX(0)' : 'translateX(-100%)'

  return (
    <div
      className="absolute top-[10%] h-[60%] w-24 opacity-40"
      style={{ left: xPos, transform }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 80 200" className="w-full h-full" preserveAspectRatio="none" role="presentation">
        {/* Gothic arch frame - weathered stone */}
        <path
          d="M10,200 L10,60 Q10,10 40,10 Q70,10 70,60 L70,200"
          fill="none"
          stroke={DF.stoneGrey}
          strokeWidth="4"
        />
        {/* Inner glow */}
        <path
          d="M15,195 L15,62 Q15,18 40,18 Q65,18 65,62 L65,195"
          fill={DF.spiritGold}
          opacity="0.08"
        />
        {/* Gothic tracery */}
        <path
          d="M40,18 L40,80 M25,50 Q40,40 55,50 M20,80 Q40,65 60,80"
          fill="none"
          stroke={DF.stoneGrey}
          strokeWidth="1.5"
          opacity="0.6"
        />
        {/* Crystal/stained glass points */}
        <circle cx="40" cy="35" r="4" fill={DF.ethereal} opacity="0.5" />
        <circle cx="30" cy="55" r="3" fill={DF.spiritGold} opacity="0.4" />
        <circle cx="50" cy="55" r="3" fill={DF.spiritGold} opacity="0.4" />
      </svg>
      {/* Light rays emanating - no blur filter for performance */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at ${side === 'left' ? '80%' : '20%'} 30%, ${DF.spiritGold}15, ${DF.spiritGold}08 40%, transparent 70%)`,
        }}
      />
    </div>
  )
})

// Combined atmosphere layer - NO chandelier here (it's in header now)
const DarkFantasyAtmosphere = memo(function DarkFantasyAtmosphere() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[3] contain-strict" aria-hidden="true" role="presentation">
      <GothicWindow side="left" />
      <GothicWindow side="right" />
      <StoneFormations />

      {/* Central ethereal glow - no blur filter for performance */}
      <div
        className="absolute top-[15%] left-1/2 w-[800px] h-[500px]"
        style={{
          background: `radial-gradient(ellipse at center top, ${DF.spiritGold}10 0%, ${DF.spiritGold}05 20%, ${DF.ethereal}04 50%, transparent 80%)`,
          transform: 'translateX(-50%) translateZ(0)',
        }}
      />
      {/* Bottom mist */}
      <div
        className="absolute bottom-0 left-0 right-0 h-48"
        style={{
          background: `linear-gradient(180deg, transparent, ${DF.voidPurple}50, ${DF.void}80)`,
        }}
      />
    </div>
  )
})

// Section reveal animation - ethereal fade instead of specific character
function EtherealReveal({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const hasEntered = useInViewTrigger(ref, { threshold: 0.15 })
  const [phase, setPhase] = useState<'hidden' | 'reveal' | 'visible'>('hidden')

  useEffect(() => {
    if (hasEntered && phase === 'hidden') {
      setPhase('reveal')
      setTimeout(() => setPhase('visible'), 500)
    }
  }, [hasEntered, phase])

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {/* Ethereal light sweep */}
      {phase === 'reveal' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div
            className="absolute h-px"
            style={{
              width: '100%',
              background: `linear-gradient(90deg, transparent, ${DF.spiritGold}, ${DF.ethereal}, transparent)`,
              boxShadow: `0 0 20px ${DF.spiritGold}, 0 0 40px ${DF.ethereal}`,
              animation: 'lightSweep 0.4s ease-out forwards',
            }}
          />
        </div>
      )}

      <div
        style={{
          opacity: phase === 'visible' ? 1 : 0,
          transform: phase === 'visible' ? 'translateY(0)' : 'translateY(15px)',
          transition: 'all 0.4s ease-out',
        }}
      >
        {children}
      </div>
    </div>
  )
}

// Waystation node for profession selection (generic rest point, not HK bench)
const WaystationNode = memo(function WaystationNode({
  icon,
  label,
  sublabel,
  color,
  isActive,
  onClick,
  position,
}: {
  icon: React.ReactNode
  label: string
  sublabel: string
  color: string
  isActive: boolean
  onClick: () => void
  position: { x: number; y: number }
}) {
  return (
    <button
      onClick={onClick}
      className="absolute transform -translate-x-1/2 -translate-y-1/2 group min-w-[70px] md:min-w-[100px] min-h-[70px] md:min-h-[100px] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        ['--tw-ring-color' as string]: color,
        ['--tw-ring-offset-color' as string]: DF.void,
      }}
      aria-pressed={isActive}
      aria-label={`Select ${label} - ${sublabel} profession${isActive ? ' (currently selected)' : ''}`}
      role="tab"
      tabIndex={isActive ? 0 : -1}
    >
      {/* Active glow - optimized: reduced blur */}
      <div
        className={`absolute inset-0 rounded-full transition-all duration-500 ${
          isActive ? 'opacity-50 scale-150' : 'opacity-0 scale-100 group-hover:opacity-30 group-hover:scale-125'
        }`}
        style={{
          background: `radial-gradient(circle, ${color}60 0%, ${color}30 40%, transparent 70%)`,
        }}
        aria-hidden="true"
      />
      {/* Main container - hexagonal/crystalline shape */}
      <div
        className={`relative w-16 h-16 md:w-24 md:h-24 flex flex-col items-center justify-center transition-all duration-300 ${
          isActive ? 'scale-110' : 'group-hover:scale-105'
        }`}
        style={{
          background: `linear-gradient(135deg, ${DF.voidDeep}, ${color}15)`,
          border: `2px solid ${isActive ? color : DF.stoneDark}`,
          borderRadius: '8px',
          clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
        }}
      >
        {/* Abstract icon */}
        <div className="mb-0.5 md:mb-1 scale-75 md:scale-100" style={{ color: isActive ? color : DF.silver }}>
          {icon}
        </div>
        <span
          className="text-[10px] md:text-xs tracking-[0.1em] md:tracking-[0.15em] uppercase font-medium"
          style={{
            color: isActive ? color : DF.silver,
            fontFamily: '"Cinzel", "Garamond", serif',
          }}
        >
          {label}
        </span>
        <span
          className="text-[8px] md:text-[10px] tracking-wider opacity-70 text-center leading-tight hidden md:block"
          style={{
            color: isActive ? color : DF.silver,
            fontFamily: '"Cinzel", serif',
          }}
        >
          {sublabel}
        </span>
      </div>
    </button>
  )
})

// Abstract profession icons (not character silhouettes)
const GearIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12,8 L14,4 L10,4 Z M12,16 L14,20 L10,20 Z M8,12 L4,14 L4,10 Z M16,12 L20,14 L20,10 Z" />
    <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
  </svg>
)

const WaveIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M4,12 Q7,8 10,12 Q13,16 16,12 Q19,8 22,12" strokeLinecap="round" />
    <path d="M4,16 Q7,12 10,16 Q13,20 16,16 Q19,12 22,16" strokeLinecap="round" opacity="0.5" />
  </svg>
)

const DiamondIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12,2 L22,12 L12,22 L2,12 Z" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M12,6 L18,12 L12,18 L6,12 Z" opacity="0.3" />
    <circle cx="12" cy="12" r="2" />
  </svg>
)

// Panel frame with gothic/mechanical blend
const VoidFrame = memo(function VoidFrame({
  children,
  title,
  headingLevel = 'h2',
}: {
  children: React.ReactNode
  title: string
  headingLevel?: 'h2' | 'h3'
}) {
  const HeadingTag = headingLevel
  const headingId = `section-${title.toLowerCase().replace(/\s+/g, '-')}`

  return (
    <div className="relative" role="region" aria-labelledby={headingId}>
      {/* Corner ornaments - gear/crystal hybrid */}
      <svg className="absolute -top-3 -left-3 w-10 h-10" viewBox="0 0 40 40" aria-hidden="true">
        <path d="M5,35 Q5,5 35,5" fill="none" stroke={DF.brass} strokeWidth="1.5" opacity="0.6" />
        <circle cx="8" cy="8" r="4" fill={DF.copper} opacity="0.4" />
        <circle cx="8" cy="8" r="2" fill={DF.spiritGold} opacity="0.6" />
      </svg>
      <svg className="absolute -top-3 -right-3 w-10 h-10" viewBox="0 0 40 40" aria-hidden="true">
        <path d="M35,35 Q35,5 5,5" fill="none" stroke={DF.brass} strokeWidth="1.5" opacity="0.6" />
        <circle cx="32" cy="8" r="4" fill={DF.copper} opacity="0.4" />
        <circle cx="32" cy="8" r="2" fill={DF.spiritGold} opacity="0.6" />
      </svg>
      <svg className="absolute -bottom-3 -left-3 w-10 h-10" viewBox="0 0 40 40" aria-hidden="true">
        <path d="M5,5 Q5,35 35,35" fill="none" stroke={DF.brass} strokeWidth="1.5" opacity="0.6" />
        <circle cx="8" cy="32" r="4" fill={DF.copper} opacity="0.4" />
      </svg>
      <svg className="absolute -bottom-3 -right-3 w-10 h-10" viewBox="0 0 40 40" aria-hidden="true">
        <path d="M35,5 Q35,35 5,35" fill="none" stroke={DF.brass} strokeWidth="1.5" opacity="0.6" />
        <circle cx="32" cy="32" r="4" fill={DF.copper} opacity="0.4" />
      </svg>

      {/* Title with mechanical dividers */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 flex items-center">
          <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, transparent, ${DF.brass})` }} />
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" className="mx-1">
            <circle cx="6" cy="6" r="4" fill="none" stroke={DF.copper} strokeWidth="1" />
            <circle cx="6" cy="6" r="1.5" fill={DF.spiritGold} />
          </svg>
        </div>
        <HeadingTag
          id={headingId}
          className="text-base tracking-[0.25em] uppercase px-2"
          style={{
            color: DF.bone,
            fontFamily: '"Cinzel", "Garamond", serif',
            textShadow: `0 0 15px ${DF.ethereal}40`,
          }}
        >
          {title}
        </HeadingTag>
        <div className="flex-1 flex items-center">
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" className="mx-1">
            <circle cx="6" cy="6" r="4" fill="none" stroke={DF.copper} strokeWidth="1" />
            <circle cx="6" cy="6" r="1.5" fill={DF.spiritGold} />
          </svg>
          <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, ${DF.brass}, transparent)` }} />
        </div>
      </div>

      <div
        className="p-6 relative"
        style={{
          background: `linear-gradient(180deg, ${DF.void}f0, ${DF.voidPurple}40)`,
          border: `1px solid ${DF.stoneDark}80`,
          borderRadius: '4px',
          boxShadow: `inset 0 0 40px rgba(0,0,0,0.5)`,
        }}
      >
        {children}
      </div>
    </div>
  )
})

// Tech stack display
const TechCloud = memo(function TechCloud({ categories }: { categories: ReturnType<typeof getEngineerSkills> }) {
  return (
    <div className="space-y-6">
      {categories.slice(0, 5).map((category) => (
        <div key={category.name}>
          <h3
            className="text-sm tracking-[0.15em] mb-3 flex items-center gap-2 uppercase"
            style={{ color: DF.silver, fontFamily: '"Cinzel", serif' }}
          >
            <span aria-hidden="true">{category.icon}</span>
            {category.name}
          </h3>
          <ul className="flex flex-wrap gap-2" aria-label={`${category.name} technologies`}>
            {category.items.map((tech) => (
              <li
                key={tech}
                className="px-3 py-1 text-sm transition-transform hover:scale-105 cursor-default"
                style={{
                  background: `${DF.ethereal}12`,
                  border: `1px solid ${DF.ethereal}30`,
                  color: DF.bone,
                  borderRadius: '3px',
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
})

// Skills list
const SkillsList = memo(function SkillsList({ categories }: { categories: ReturnType<typeof getSkillsByProfession> }) {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {categories.map((category) => (
        <div key={category.name}>
          <h3
            className="text-sm tracking-[0.15em] mb-3 flex items-center gap-2 uppercase"
            style={{ color: DF.silver, fontFamily: '"Cinzel", serif' }}
          >
            <span aria-hidden="true">{category.icon}</span>
            {category.name}
          </h3>
          <ul className="space-y-2" aria-label={`${category.name} skills`}>
            {category.skills.map((skill) => (
              <li key={skill.name} className="text-sm flex items-center gap-2" style={{ color: DF.bone }}>
                <span style={{ color: DF.spiritGold }} aria-hidden="true">*</span>
                {skill.name}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
})

// Project card
const ProjectCard = memo(function ProjectCard({ project }: { project: typeof PROJECTS_DATA[0] }) {
  return (
    <article
      className="p-4 transition-transform hover:scale-[1.02] cursor-pointer group"
      style={{
        background: `linear-gradient(135deg, ${DF.void}, ${DF.voidPurple}50)`,
        border: `1px solid ${project.featured ? DF.spiritGold : DF.stoneDark}`,
        borderRadius: '4px',
      }}
      tabIndex={0}
      role="button"
      aria-label={`View ${project.name} project details`}
    >
      {project.featured && (
        <span className="text-sm tracking-[0.15em] uppercase" style={{ color: DF.spiritGold }}>
          <span aria-hidden="true">* </span>Featured
        </span>
      )}
      <h3 className="text-base mt-1 transition-colors" style={{ color: DF.bone }}>
        {project.name}
      </h3>
      <p className="text-sm mt-2" style={{ color: DF.silver }}>{project.tagline}</p>
      {project.impact && (
        <p className="text-sm mt-2 italic" style={{ color: DF.ethereal }}>
          <span aria-hidden="true">- </span>
          <span className="sr-only">Impact: </span>{project.impact}
        </p>
      )}
      <div className="flex flex-wrap gap-1 mt-3" aria-label="Technologies used">
        {project.techStack.slice(0, 4).map((tech) => (
          <span key={tech} className="text-sm px-1 py-0.5" style={{ background: `${DF.ethereal}12`, color: DF.silver }}>
            {tech}
          </span>
        ))}
      </div>
    </article>
  )
})

// Company card
const CompanyCard = memo(function CompanyCard({ company }: { company: typeof COMPANIES[0] }) {
  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 transition-transform hover:scale-[1.02] group min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      style={{
        background: `linear-gradient(135deg, ${DF.void}, ${DF.voidPurple}40)`,
        border: `1px solid ${DF.stoneDark}`,
        borderRadius: '4px',
        ['--tw-ring-color' as string]: DF.spiritGold,
        ['--tw-ring-offset-color' as string]: DF.void,
      }}
      aria-label={`${company.name} - ${company.tagline}. Opens in new tab.`}
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl" aria-hidden="true">{company.icon}</span>
        <div>
          <h3 className="text-base transition-colors" style={{ color: DF.bone }}>
            {company.name}
            <span className="sr-only"> (opens in new tab)</span>
          </h3>
          <p className="text-sm" style={{ color: DF.spiritGold }}>{company.tagline}</p>
        </div>
      </div>
      <p className="text-sm" style={{ color: DF.silver }}>{company.description}</p>
    </a>
  )
})

// Band card
const BandCard = memo(function BandCard({ band }: { band: typeof BANDS[0] }) {
  const content = (
    <article
      className="p-4 transition-transform hover:scale-[1.02] group"
      style={{
        background: `linear-gradient(135deg, ${DF.void}, ${DF.lavender}20)`,
        border: `1px solid ${DF.lavender}60`,
        borderRadius: '4px',
      }}
    >
      <h3 className="text-base transition-colors" style={{ color: DF.bone }}>
        {band.name}
        {band.url && <span className="sr-only"> (opens in new tab)</span>}
      </h3>
      <p className="text-sm mt-1" style={{ color: DF.lavender }}>
        {band.genre} <span aria-hidden="true">|</span> {band.role}
      </p>
      <p className="text-sm mt-2" style={{ color: DF.silver }}>{band.description}</p>
      {!band.url && <p className="text-sm mt-2 italic" style={{ color: DF.silver }}>Website coming soon</p>}
    </article>
  )

  if (band.url) {
    return (
      <a
        href={band.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        style={{
          ['--tw-ring-color' as string]: DF.lavender,
          ['--tw-ring-offset-color' as string]: DF.void,
        }}
        aria-label={`${band.name} - ${band.genre}. Opens in new tab.`}
      >
        {content}
      </a>
    )
  }
  return content
})

// Work experience card
const ExperienceCard = memo(function ExperienceCard({ entry }: { entry: typeof EXPERIENCE_DATA[0] }) {
  const endDisplay = entry.endDate ? new Date(entry.endDate).getFullYear() : 'Present'
  const startDisplay = new Date(entry.startDate).getFullYear()

  return (
    <article
      className="p-4"
      style={{
        background: `linear-gradient(135deg, ${DF.void}, ${DF.voidPurple}30)`,
        border: `1px solid ${DF.stoneDark}`,
        borderRadius: '4px',
      }}
    >
      <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
        <div>
          <h3 className="text-base font-medium" style={{ color: DF.bone }}>{entry.title}</h3>
          <p className="text-sm" style={{ color: DF.ethereal }}>{entry.organization}</p>
        </div>
        <span
          className="text-sm px-2 py-0.5"
          style={{
            color: DF.spiritGold,
            background: `${DF.spiritGold}12`,
            border: `1px solid ${DF.spiritGold}25`,
            borderRadius: '3px',
          }}
        >
          <time>{startDisplay}</time> - <time>{endDisplay}</time>
        </span>
      </div>
      <p className="text-sm mb-2" style={{ color: DF.silver }}>{entry.description}</p>
      {entry.highlights && entry.highlights.length > 0 && (
        <ul className="space-y-1" aria-label="Key achievements">
          {entry.highlights.map((highlight, i) => (
            <li key={i} className="text-sm flex items-start gap-2" style={{ color: DF.bone }}>
              <span style={{ color: DF.spiritGold }} aria-hidden="true">*</span>
              {highlight}
            </li>
          ))}
        </ul>
      )}
    </article>
  )
})

// Art Section 1 - Spirit wisps with mechanical gears (blend of Ori + Iconoclast)
const ArtSectionSpirits = memo(function ArtSectionSpirits() {
  return (
    <div className="relative z-20 py-16 px-6 overflow-hidden" aria-hidden="true" role="presentation">
      <div className="max-w-6xl mx-auto relative h-48 flex items-center justify-center">
        {/* Connecting mechanical vines */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="xMidYMid meet">
          {/* Organic-mechanical tendrils */}
          <path
            d="M400,100 Q320,85 240,95 Q160,105 80,90"
            fill="none"
            stroke={DF.forestGreen}
            strokeWidth="2"
            opacity="0.3"
          />
          <path
            d="M400,100 Q480,85 560,95 Q640,105 720,90"
            fill="none"
            stroke={DF.forestGreen}
            strokeWidth="2"
            opacity="0.3"
          />
          {/* Brass conduits */}
          <path
            d="M400,100 Q350,110 280,105 Q200,100 120,115"
            fill="none"
            stroke={DF.brass}
            strokeWidth="1.5"
            opacity="0.25"
            strokeDasharray="8 4"
          />
          <path
            d="M400,100 Q450,110 520,105 Q600,100 680,115"
            fill="none"
            stroke={DF.brass}
            strokeWidth="1.5"
            opacity="0.25"
            strokeDasharray="8 4"
          />
          {/* Spirit orbs along paths */}
          {[120, 200, 280, 520, 600, 680].map((x, i) => (
            <g key={i}>
              <circle
                cx={x}
                cy={95 + Math.sin(i * 1.2) * 10}
                r={4 + (i % 2) * 2}
                fill={i % 2 === 0 ? DF.spiritGold : DF.ethereal}
                opacity={0.4}
              />
              <circle
                cx={x}
                cy={95 + Math.sin(i * 1.2) * 10}
                r={8 + (i % 2) * 3}
                fill={i % 2 === 0 ? DF.spiritGold : DF.ethereal}
                opacity={0.1}
              />
            </g>
          ))}
        </svg>

        {/* Central composition */}
        <div className="relative z-10 flex items-center gap-8">
          <div className="opacity-60">
            <MechanicalGear size={40} />
          </div>
          <SpiritWisp size={60} color={DF.spiritGold} />
          <div className="opacity-60">
            <MechanicalGear size={40} />
          </div>
        </div>

        {/* Floating particles - no box-shadow */}
        {[
          { x: '20%', y: '30%', color: DF.spiritGold },
          { x: '80%', y: '40%', color: DF.ethereal },
          { x: '15%', y: '70%', color: DF.forestGreen },
          { x: '85%', y: '60%', color: DF.spiritGold },
        ].map((p, i) => (
          <div
            key={i}
            className="absolute w-4 h-4 rounded-full"
            style={{
              left: p.x,
              top: p.y,
              background: `radial-gradient(circle, ${p.color} 20%, ${p.color}50 50%, transparent 70%)`,
              animation: `spiritFloat ${8 + i * 2}s ease-in-out infinite`,
              animationDelay: `${i * -2}s`,
            }}
          />
        ))}
      </div>

      {/* Divider */}
      <div className="max-w-2xl mx-auto flex items-center gap-4 mt-4">
        <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, transparent, ${DF.brass}, transparent)` }} />
        <svg width="20" height="20" viewBox="0 0 20 20">
          <path d="M10,2 L18,10 L10,18 L2,10 Z" fill="none" stroke={DF.spiritGold} strokeWidth="1" opacity="0.6" />
          <circle cx="10" cy="10" r="2" fill={DF.spiritGold} opacity="0.4" />
        </svg>
        <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, transparent, ${DF.brass}, transparent)` }} />
      </div>
    </div>
  )
})

// Art Section 2 - Floating lanterns (generic dark fantasy)
const ArtSectionLanterns = memo(function ArtSectionLanterns() {
  const lanterns = useMemo(() =>
    Array.from({ length: 7 }, (_, i) => ({
      id: i,
      x: 10 + i * 13,
      y: 30 + Math.sin(i * 0.8) * 15,
      size: 25 + (i % 3) * 5,
      delay: i * 0.4,
    })),
    []
  )

  return (
    <div className="relative z-20 py-16 px-6 overflow-hidden" aria-hidden="true" role="presentation">
      <div className="max-w-4xl mx-auto relative h-32 flex items-center justify-center">
        {/* Lanterns floating */}
        {lanterns.map((l) => (
          <div
            key={l.id}
            className="absolute transform hover:scale-110 transition-transform duration-300"
            style={{
              left: `${l.x}%`,
              top: `${l.y}%`,
              animation: `lanternFloat 4s ease-in-out infinite`,
              animationDelay: `${l.delay}s`,
            }}
          >
            <FloatingLantern size={l.size} />
          </div>
        ))}

        {/* Light rays from lanterns */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 50% 50%, ${DF.spiritGold}15 0%, transparent 60%)`,
          }}
        />
      </div>

      {/* Decorative line */}
      <svg className="w-full h-6 mt-4" viewBox="0 0 800 24" preserveAspectRatio="none">
        <path
          d="M0,12 Q200,6 400,12 Q600,18 800,12"
          fill="none"
          stroke={DF.brass}
          strokeWidth="1"
          opacity="0.3"
        />
        {[200, 400, 600].map((x, i) => (
          <circle key={i} cx={x} cy={12} r="3" fill={DF.spiritGold} opacity="0.4" />
        ))}
      </svg>
    </div>
  )
})

// Art Section 3 - Crystal/stone formation with ethereal energy
const ArtSectionCrystals = memo(function ArtSectionCrystals() {
  return (
    <div className="relative z-20 py-16 px-6 overflow-hidden" aria-hidden="true" role="presentation">
      <div className="max-w-6xl mx-auto relative h-40">
        <svg className="w-full h-full" viewBox="0 0 1000 160" preserveAspectRatio="xMidYMid meet">
          {/* Central crystal cluster */}
          <g transform="translate(500, 80)">
            {/* Main crystal */}
            <path
              d="M0,-50 L12,-20 L8,40 L-8,40 L-12,-20 Z"
              fill={DF.ethereal}
              opacity="0.6"
            />
            <path
              d="M0,-50 L12,-20 L0,0 L-12,-20 Z"
              fill={DF.ethereal}
              opacity="0.8"
            />
            {/* Side crystals */}
            <path
              d="M-30,-30 L-22,-10 L-26,25 L-34,25 L-38,-10 Z"
              fill={DF.spiritGold}
              opacity="0.5"
              transform="rotate(-15)"
            />
            <path
              d="M30,-30 L38,-10 L34,25 L26,25 L22,-10 Z"
              fill={DF.spiritGold}
              opacity="0.5"
              transform="rotate(15)"
            />
            {/* Small accent crystals */}
            <path d="M-50,-10 L-45,5 L-55,5 Z" fill={DF.forestGreen} opacity="0.4" transform="rotate(-25)" />
            <path d="M50,-10 L55,5 L45,5 Z" fill={DF.forestGreen} opacity="0.4" transform="rotate(25)" />
          </g>

          {/* Energy tendrils spreading from crystals */}
          <path
            d="M500,30 Q400,25 300,40 Q200,55 100,45"
            fill="none"
            stroke={DF.ethereal}
            strokeWidth="2"
            opacity="0.2"
          />
          <path
            d="M500,30 Q600,25 700,40 Q800,55 900,45"
            fill="none"
            stroke={DF.ethereal}
            strokeWidth="2"
            opacity="0.2"
          />
          <path
            d="M500,50 Q420,60 340,55 Q260,50 180,65"
            fill="none"
            stroke={DF.spiritGold}
            strokeWidth="1.5"
            opacity="0.15"
          />
          <path
            d="M500,50 Q580,60 660,55 Q740,50 820,65"
            fill="none"
            stroke={DF.spiritGold}
            strokeWidth="1.5"
            opacity="0.15"
          />

          {/* Energy nodes */}
          {[150, 280, 380, 620, 720, 850].map((x, i) => (
            <g key={i}>
              <circle
                cx={x}
                cy={45 + Math.sin(i * 1.5) * 12}
                r={5}
                fill={i % 2 === 0 ? DF.ethereal : DF.spiritGold}
                opacity={0.3}
              />
              <circle
                cx={x}
                cy={45 + Math.sin(i * 1.5) * 12}
                r={10}
                fill={i % 2 === 0 ? DF.ethereal : DF.spiritGold}
                opacity={0.1}
              />
            </g>
          ))}
        </svg>

        {/* Glow behind crystals - no blur filter */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-40"
          style={{
            background: `radial-gradient(ellipse, ${DF.ethereal}15 0%, ${DF.ethereal}08 30%, ${DF.spiritGold}05 60%, transparent 80%)`,
          }}
        />
      </div>

      {/* Bottom divider */}
      <div className="max-w-3xl mx-auto flex items-center gap-6 mt-4">
        <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, transparent, ${DF.ethereal}40, transparent)` }} />
        <div className="flex gap-3">
          {[DF.ethereal, DF.spiritGold, DF.ethereal].map((color, i) => (
            <div
              key={i}
              className="w-2 h-2"
              style={{
                background: color,
                opacity: 0.4 + i * 0.15,
                boxShadow: `0 0 8px ${color}`,
                clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
              }}
            />
          ))}
        </div>
        <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, transparent, ${DF.ethereal}40, transparent)` }} />
      </div>
    </div>
  )
})

export default function DarkFantasyTheme() {
  const { theme } = useTheme()
  const { active, setActive, config } = useProfession()
  const [mounted, setMounted] = useState(false)

  // Scroll trigger system - calculates trigger states based on scroll position
  const {
    states: triggerStates,
    scrollProgress,
    isTriggered,
    getProgress,
  } = useScrollTriggers({
    triggers: TRIGGER_CONFIG,
    defaultFadeDistance: 150,
    viewportTriggerOffset: 0.35,   // Trigger when section is 35% up from bottom of viewport
    persistTriggered: false,       // Allow animations to replay on re-scroll
  })

  // Memoize expensive data operations
  const aboutData = useMemo(() => ABOUT_DATA[active], [active])
  const engineerTech = useMemo(() => getEngineerSkills(), [])
  const otherSkills = useMemo(() => getSkillsByProfession(active), [active])
  const projects = useMemo(
    () => PROJECTS_DATA.filter(p => p.professions.includes(active) || p.featured),
    [active]
  )
  const experience = useMemo(
    () => filterExperienceByProfession(EXPERIENCE_DATA, active),
    [active]
  )

  useEffect(() => {
    setMounted(true)
  }, [])

  // Show loading skeleton
  if (!mounted) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: DF.void }}
        role="status"
        aria-label="Loading theme"
      >
        <div className="animate-pulse text-center" style={{ color: DF.bone }}>
          Loading...
        </div>
      </div>
    )
  }

  const professionNodes = [
    {
      id: 'engineer',
      icon: <GearIcon />,
      label: 'System',
      sublabel: 'Engineer / CTO',
      color: DF.ethereal,
      position: { x: 25, y: 50 }
    },
    {
      id: 'drummer',
      icon: <WaveIcon />,
      label: 'Musician',
      sublabel: 'Pro Drummer',
      color: DF.lavender,
      position: { x: 50, y: 30 }
    },
    {
      id: 'fighter',
      icon: <DiamondIcon />,
      label: 'Martial',
      sublabel: 'BJJ Instructor',
      color: DF.spiritGold,
      position: { x: 75, y: 50 }
    },
  ]

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: `linear-gradient(180deg, ${DF.void}, ${DF.voidDeep}, ${DF.voidPurple})`,
        fontFamily: '"Cinzel", "Garamond", serif',
      }}
    >
      {/* Skip Link for accessibility */}
      <SkipLink href="#main-content" />

      {/* Atmospheric background layers */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse at 50% 10%, ${DF.ethereal}15 0%, transparent 50%),
            radial-gradient(ellipse at 20% 60%, ${DF.voidPurple}40 0%, transparent 40%),
            radial-gradient(ellipse at 80% 40%, ${DF.spiritGold}08 0%, transparent 35%),
            linear-gradient(180deg, ${DF.void} 0%, ${DF.voidDeep} 40%, ${DF.voidPurple} 100%)
          `,
        }}
      />
      <EtherealRain />
      <DarkFantasyAtmosphere />
      <SpiritParticles />

      {/* Interactive Elements - desktop only */}
      <ParallaxLayers />
      <CursorTrail />

      {/* Vignette overlay - optimized: no box-shadow */}
      <div
        className="fixed inset-0 pointer-events-none z-[8]"
        style={{
          background: `
            radial-gradient(ellipse at 50% 50%, transparent 0%, transparent 30%, rgba(15,10,26,0.4) 60%, rgba(15,10,26,0.8) 100%),
            linear-gradient(180deg, transparent 60%, ${DF.void}90 100%)
          `,
        }}
      />

      {/* Chandelier - absolute at top, doesn't scroll */}
      <div className="absolute top-0 left-0 right-0 z-[2] pointer-events-none" aria-hidden="true">
        <GothicChandelier />
      </div>

      {/* Fixed Navigation Bar */}
      <nav
        className="fixed top-0 left-0 right-0 z-[50] px-4 py-3 md:px-6 md:py-4"
        style={{
          background: `linear-gradient(180deg, ${DF.void}f5 0%, ${DF.void}e0 70%, transparent 100%)`,
          backdropFilter: 'blur(8px)',
        }}
        role="banner"
        aria-label="Primary navigation"
      >
        <div className="max-w-6xl mx-auto flex justify-between items-center gap-2 md:gap-4">
          {/* Name - compact on mobile */}
          <Link href="/" className="flex items-center gap-2 md:gap-3 group">
            <div aria-hidden="true" className="hidden sm:block">
              <SpiritWisp size={32} color={DF.spiritGold} />
            </div>
            <h1
              className="text-sm md:text-lg tracking-[0.15em] md:tracking-[0.2em] font-normal uppercase whitespace-nowrap"
              style={{
                color: DF.bone,
                textShadow: `0 0 20px ${DF.ethereal}30`,
              }}
            >
              Alexander Pulido
            </h1>
          </Link>

          {/* Nav Links */}
          <div className="flex gap-2 md:gap-3 items-center">
            <Link
              href="/cv"
              className="px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm tracking-[0.1em] uppercase transition-all hover:scale-105 flex items-center focus:outline-none focus-visible:ring-2"
              style={{
                border: `1px solid ${DF.stoneDark}`,
                color: DF.silver,
                background: `${DF.void}cc`,
                borderRadius: '4px',
              }}
            >
              CV
            </Link>
            <Link
              href="/personal-projects/game-engine"
              className="px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm tracking-[0.1em] uppercase transition-all hover:scale-105 flex items-center focus:outline-none focus-visible:ring-2"
              style={{
                border: `1px solid ${DF.ethereal}`,
                color: DF.ethereal,
                background: `${DF.ethereal}15`,
                borderRadius: '4px',
              }}
            >
              <span className="hidden sm:inline">Nebulith</span>
              <span className="sm:hidden">Game</span>
            </Link>
            <ThemeSwitcher />
          </div>
        </div>
      </nav>

      {/* Hero Section - below fixed nav, changes with profession */}
      <header className="relative z-20 pt-20 md:pt-24 pb-6 px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm md:text-base tracking-wider mb-2" style={{ color: DF.silver }}>
            {PROFESSIONAL_SUMMARY[active].headline}
          </p>
          <p
            className="text-xs md:text-sm tracking-wider italic"
            style={{ color: DF.spiritGold, textShadow: `0 0 10px ${DF.spiritGold}40` }}
          >
            {PROFESSIONAL_SUMMARY[active].tagline}
          </p>
        </div>
      </header>

      {/* Main content */}
      <main id="main-content" tabIndex={-1} className="outline-none">

      {/* Profession Selector - Waystation style */}
      <TriggerSection id="profession-selector" states={triggerStates}>
        <section className="relative z-20 py-8" aria-labelledby="profession-heading">
          <h2 id="profession-heading" className="sr-only">Select Your Profession</h2>
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <div
              className="relative h-40 md:h-56 overflow-hidden"
              style={{
                background: `linear-gradient(180deg, transparent, ${DF.voidPurple}30)`,
                border: `1px solid ${DF.stoneDark}60`,
                borderRadius: '4px',
              }}
              role="tablist"
              aria-label="Profession selector"
            >
              {/* Connection paths */}
              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" aria-hidden="true">
                <defs>
                  <linearGradient id="pathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={DF.brass} stopOpacity="0" />
                    <stop offset="50%" stopColor={DF.brass} stopOpacity="0.4" />
                    <stop offset="100%" stopColor={DF.brass} stopOpacity="0" />
                  </linearGradient>
                </defs>
                <line x1="25%" y1="50%" x2="50%" y2="30%" stroke="url(#pathGrad)" strokeWidth="1" strokeDasharray="6 4" />
                <line x1="50%" y1="30%" x2="75%" y2="50%" stroke="url(#pathGrad)" strokeWidth="1" strokeDasharray="6 4" />
                {/* Gear decorations at intersections */}
                <circle cx="37.5%" cy="40%" r="3" fill={DF.copper} opacity="0.3" />
                <circle cx="62.5%" cy="40%" r="3" fill={DF.copper} opacity="0.3" />
              </svg>
              {professionNodes.map((node) => (
                <WaystationNode
                  key={node.id}
                  {...node}
                  isActive={active === node.id}
                  onClick={() => setActive(node.id as 'engineer' | 'drummer' | 'fighter')}
                />
              ))}
            </div>
          </div>
        </section>
      </TriggerSection>

      {/* About */}
      <TriggerSection id="about" states={triggerStates}>
        <section className="relative z-20 py-8 px-6">
          <div className="max-w-4xl mx-auto">
            <VoidFrame title="About">
              <p className="text-sm leading-relaxed mb-4" style={{ color: DF.bone }}>{aboutData.bio}</p>
              <div className="flex flex-wrap gap-3">
                {aboutData.quickFacts.map((fact, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-xs"
                    style={{
                      background: `${DF.ethereal}12`,
                      border: `1px solid ${DF.ethereal}30`,
                      color: DF.ethereal,
                      borderRadius: '3px',
                    }}
                  >
                    * {fact}
                  </span>
                ))}
              </div>
            </VoidFrame>
          </div>
        </section>
      </TriggerSection>

      {/* Art Section 1 - Spirits and Gears */}
      <TriggerSection id="art-spirits" states={triggerStates} preRender={false}>
        <ArtSectionSpirits />
      </TriggerSection>

      {/* Work Experience - Knight Slash Reveal (content slides from right) */}
      {experience.length > 0 && (
        <KnightSlashReveal triggered={isTriggered('experience')}>
          <section className="relative z-20 py-8 px-6">
            <div className="max-w-4xl mx-auto">
              <VoidFrame title="Work Experience">
                <div className="space-y-4">
                  {experience.map((entry) => (
                    <ExperienceCard key={entry.id} entry={entry} />
                  ))}
                </div>
              </VoidFrame>
            </div>
          </section>
        </KnightSlashReveal>
      )}

      {/* Art Section 2 - Lanterns */}
      <TriggerSection id="art-lanterns" states={triggerStates} preRender={false}>
        <ArtSectionLanterns />
      </TriggerSection>

      {/* Tech Stack / Skills - Simple fade trigger (no complex animation) */}
      <TriggerSection id="tech-stack" states={triggerStates}>
        <section className="relative z-20 py-8 px-6">
          <div className="max-w-4xl mx-auto">
            <VoidFrame title={active === 'engineer' ? 'Tech Stack' : 'Skills'}>
              {active === 'engineer' ? (
                <TechCloud categories={engineerTech} />
              ) : (
                <SkillsList categories={otherSkills} />
              )}
            </VoidFrame>
          </div>
        </section>
      </TriggerSection>

      {/* Projects - Bug Pull Reveal (bug runs erratically, pulls content from left) */}
      <BugPullReveal triggered={isTriggered('projects')}>
        <section className="relative z-20 py-8 px-6">
          <div className="max-w-4xl mx-auto">
            <VoidFrame title="Featured Work">
              <div className="grid md:grid-cols-2 gap-4">
                {projects.filter(p => p.featured).slice(0, 6).map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </VoidFrame>
          </div>
        </section>
      </BugPullReveal>

      {/* Art Section 3 - Crystals */}
      <TriggerSection id="art-crystals" states={triggerStates} preRender={false}>
        <ArtSectionCrystals />
      </TriggerSection>

      {/* Ventures (Companies/Bands) */}
      <TriggerSection id="ventures" states={triggerStates}>
        {active === 'engineer' && (
          <section className="relative z-20 py-8 px-6">
            <div className="max-w-4xl mx-auto">
              <VoidFrame title="Ventures">
                <div className="grid md:grid-cols-3 gap-4">
                  {COMPANIES.map((company) => (
                    <CompanyCard key={company.id} company={company} />
                  ))}
                </div>
              </VoidFrame>
            </div>
          </section>
        )}

        {active === 'drummer' && (
          <section className="relative z-20 py-8 px-6">
            <div className="max-w-4xl mx-auto">
              <VoidFrame title="Bands">
                <div className="grid md:grid-cols-3 gap-4">
                  {BANDS.map((band) => (
                    <BandCard key={band.id} band={band} />
                  ))}
                </div>
              </VoidFrame>
            </div>
          </section>
        )}
      </TriggerSection>

      {/* Posts */}
      <TriggerSection id="posts" states={triggerStates}>
        <section className="relative z-20 py-8 px-6">
          <div className="max-w-4xl mx-auto">
            <VoidFrame title="Posts">
              <div className="text-center py-8">
                <p className="text-sm" style={{ color: DF.silver }}>
                  Writings and thoughts coming soon...
                </p>
                <p className="text-xs mt-2 italic" style={{ color: DF.ethereal }}>
                  * Check back for updates on development, music, and martial arts
                </p>
              </div>
            </VoidFrame>
          </div>
        </section>
      </TriggerSection>

      </main>

      {/* Contact CTA - Battle Reveal (knight kills bug, content drops from top) */}
      <BattleReveal triggered={isTriggered('contact')}>
        <section className="relative z-20 py-16 px-6" aria-label="Contact">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <h2 className="text-xl tracking-[0.15em] mb-3" style={{ color: DF.brass, fontFamily: '"Cinzel", serif' }}>
                Ready to Work Together?
              </h2>
              <p className="text-sm" style={{ color: DF.silver }}>
                10+ years delivering production systems. Let&apos;s build something.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:alexanderpulido81@gmail.com"
                className="inline-flex items-center justify-center px-6 py-3 text-sm tracking-[0.15em] uppercase transition-all hover:scale-105 min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{
                  background: DF.brass,
                  color: DF.void,
                  fontFamily: '"Cinzel", serif',
                  borderRadius: '4px',
                }}
              >
                Get In Touch
              </a>
              <Link
                href="/cv"
                className="inline-flex items-center justify-center px-6 py-3 text-sm tracking-[0.15em] uppercase transition-all hover:scale-105 min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{
                  background: 'transparent',
                  border: `2px solid ${DF.brass}`,
                  color: DF.brass,
                  fontFamily: '"Cinzel", serif',
                  borderRadius: '4px',
                }}
              >
                Download CV
              </Link>
            </div>
          </div>
        </section>
      </BattleReveal>

      {/* Bottom obscure overlay - content fades into darkness */}
      <div
        className="fixed bottom-0 left-0 right-0 h-48 pointer-events-none z-[7]"
        style={{
          background: `linear-gradient(180deg, transparent 0%, ${DF.void}40 30%, ${DF.void}90 70%, ${DF.void} 100%)`,
        }}
        aria-hidden="true"
      />

      {/* Footer */}
      <footer className="relative z-20 py-12 px-6 text-center" role="contentinfo">
        <div className="inline-flex items-center gap-4" style={{ color: DF.silver }}>
          <div className="w-12 h-px" style={{ background: DF.brass }} aria-hidden="true" />
          <span className="text-sm tracking-[0.2em]" style={{ fontFamily: '"Cinzel", serif' }}>
            <span className="sr-only">Copyright </span>© {new Date().getFullYear()} Alexander Pulido
          </span>
          <div className="w-12 h-px" style={{ background: DF.brass }} aria-hidden="true" />
        </div>
      </footer>

      {/* Animations - GPU accelerated */}
      <style jsx global>{`
        /* Ethereal rain - transform only */
        @keyframes etherealRain {
          0% { transform: translateY(-30px) translateZ(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100vh) translateZ(0); opacity: 0; }
        }

        /* Spirit float - transform and opacity */
        @keyframes spiritFloat {
          0%, 100% { transform: translate3d(0, 0, 0); opacity: 0.3; }
          25% { transform: translate3d(8px, -25px, 0); opacity: 0.5; }
          50% { transform: translate3d(-6px, -12px, 0); opacity: 0.4; }
          75% { transform: translate3d(4px, -35px, 0); opacity: 0.45; }
        }

        /* Fade in */
        @keyframes fade-in-down {
          from { opacity: 0; transform: translate3d(0, -20px, 0); }
          to { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.8s ease-out;
          will-change: transform, opacity;
        }

        /* Light sweep reveal */
        @keyframes lightSweep {
          0% { transform: scaleX(0) translateZ(0); opacity: 0; }
          50% { transform: scaleX(1) translateZ(0); opacity: 1; }
          100% { transform: scaleX(0) translateZ(0); opacity: 0; }
        }

        /* Lantern float */
        @keyframes lanternFloat {
          0%, 100% { transform: translateY(0) translateZ(0); }
          50% { transform: translateY(-8px) translateZ(0); }
        }

        /* Spirit companion wisp trail */
        @keyframes wispTrail {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(3px); }
        }

        /* Accessibility: Reduce motion */
        @media (prefers-reduced-motion: reduce) {
          .animate-fade-in-down,
          .will-animate {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </div>
  )
}
