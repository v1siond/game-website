'use client'

import { useEffect, useState, useRef, useMemo, memo } from 'react'
import Link from 'next/link'
import { useTheme } from '@/themes/ThemeContext'
import { useProfession } from '@/contexts/ProfessionContext'
import { ABOUT_DATA, PROFESSIONAL_SUMMARY } from '@/data/about'
import { PROJECTS_DATA } from '@/data/projects'
import { getSkillsByProfession, getEngineerSkills } from '@/data/skills'
import { COMPANIES } from '@/data/companies'
import { BANDS } from '@/data/bands'
import { EXPERIENCE_DATA, filterExperienceByProfession } from '@/data/experience'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { SkipLink } from '@/components/themes/shared/AccessibilityStyles'
import { CursorTrail, ParallaxLayers } from './DarkFantasy/InteractiveElements'
import { KnightSlashReveal } from './DarkFantasy/KnightCharacter'
import { BugPullReveal } from './DarkFantasy/BugCreature'
import { BattleReveal } from './DarkFantasy/BattleReveal'
import WorldsGrid from '@/components/worlds/WorldsGrid'

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
 * SECTION TRIGGER WRAPPER
 * =======================
 * Uses IntersectionObserver to detect when sections enter viewport.
 * NO hardcoded percentages - triggers based on ACTUAL element position.
 *
 * Pattern: IntersectionObserver (browser-native, performant)
 * Why chosen: Automatically handles content size changes, responsive,
 * works correctly regardless of font size or content length.
 */
const FadeInSection = memo(function FadeInSection({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const { ref, triggered } = useSectionTrigger({
    threshold: 0.1,
    rootMargin: '0px 0px -5% 0px',
  })

  return (
    <div
      ref={ref}
      /* relative z-20: the transform below creates a stacking context, which would
         otherwise trap the inner section's z-20 as a LOCAL value and let the fixed
         z-[1..6] background layers (windows/fog) paint over the content. An explicit
         positive z-index on this wrapper keeps the whole faded block above them. */
      className={`relative z-20 ${className}`}
      style={{
        opacity: triggered ? 1 : 0,
        transform: triggered ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.5s ease-out ${delay}ms, transform 0.5s ease-out ${delay}ms`,
      }}
    >
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

// Hollow Knight boss-arena depth — a gothic STAGE: a distant back wall with small,
// receded lancet windows, a FLOOR in front (cornice + perspective lines + soft stage
// light) so there's a clear floor/wall read, framed by interior columns and hanging
// soul-lamps, distant towers beyond, fog and drifting soul motes. Profession floor props
// layer on top. Static SVG + CSS motes only (no scroll work).
const HollowDepths = memo(function HollowDepths() {
  const motes = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        left: (i * 47 + 5) % 100,
        top: (i * 23 + 7) % 70,
        size: 2 + (i % 3),
        dur: 9 + ((i * 5) % 11),
        delay: i % 7,
        gold: i % 5 === 0,
      })),
    []
  )

  // small, distant pointed-arch (lancet) window set into the back wall
  const lancet = (x: number, baseY: number, w: number, h: number, k: string, op: number) => {
    const hw = w / 2,
      l = x - hw,
      r = x + hw,
      apexY = baseY - h,
      springY = baseY - h + Math.min(w * 0.8, h * 0.5)
    const d = `M${l},${baseY} L${l},${springY} Q${l},${apexY} ${x},${apexY} Q${r},${apexY} ${r},${springY} L${r},${baseY} Z`
    return (
      <g key={k}>
        <path d={d} fill={DF.ethereal} opacity={op * 0.45} />
        <path d={d} fill="none" stroke={DF.stoneGrey} strokeWidth="2.5" opacity={op * 1.8} />
        <line x1={x} y1={baseY} x2={x} y2={apexY} stroke={DF.stoneGrey} strokeWidth="1.5" opacity={op * 1.4} />
      </g>
    )
  }

  const tower = (x: number, baseY: number, w: number, topY: number, k: string, op: number) => {
    const hw = w / 2,
      roofH = w * 1.9
    return (
      <g key={k} fill={DF.voidDeep} opacity={op}>
        <rect x={x - hw} y={topY} width={w} height={baseY - topY} />
        <polygon points={`${x - hw},${topY} ${x},${topY - roofH} ${x + hw},${topY}`} />
      </g>
    )
  }

  const lamp = (x: number, y: number, k: string) => (
    <g key={k}>
      <line x1={x} y1={y - 80} x2={x} y2={y + 70} stroke={DF.stoneGrey} strokeWidth="3" opacity="0.4" />
      <path d={`M${x - 14},${y} Q${x},${y - 20} ${x + 14},${y} Q${x},${y + 7} ${x - 14},${y} Z`} fill={DF.voidDeep} stroke={DF.stoneGrey} strokeWidth="2" opacity="0.6" />
      <circle cx={x} cy={y} r="24" fill={DF.ethereal} opacity="0.07" />
      <circle cx={x} cy={y} r="7" fill={DF.etherealDark} opacity="0.5" />
    </g>
  )

  const column = (x: number, k: string) => (
    <g key={k}>
      <rect x={x - 52} y={0} width="104" height="1080" fill={DF.void} opacity="0.82" />
      <rect x={x - 66} y={112} width="132" height="36" rx="6" fill={DF.void} opacity="0.85" />
      <rect x={x - 66} y={540} width="132" height="26" rx="4" fill={DF.void} opacity="0.85" />
      {[250, 400].map((y, j) => (
        <path key={j} d={`M${x - 52},${y} Q${x},${y + 18} ${x + 52},${y}`} fill="none" stroke={DF.stoneDark} strokeWidth="3" opacity="0.8" />
      ))}
    </g>
  )

  const HORIZON = 560

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden" aria-hidden="true" role="presentation">
      {/* upper nave light, soft floor "stage" light, and a dark vignette */}
      <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 60% 40% at 50% 22%, ${DF.ethereal}0e, transparent 60%)` }} />
      <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 55% 32% at 50% 84%, ${DF.ethereal}0c, transparent 62%)` }} />
      <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 120% 90% at 50% 50%, transparent 55%, ${DF.void} 100%)` }} />

      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
        {/* distant towers beyond the wall (faint, high) */}
        {tower(360, 200, 34, -50, 't1', 0.28)}
        {tower(960, 165, 54, -120, 't2', 0.32)}
        {tower(1560, 200, 34, -50, 't3', 0.28)}

        {/* BACK WALL */}
        <rect x="0" y="0" width="1920" height={HORIZON} fill={DF.void} opacity="0.55" />
        {Array.from({ length: 13 }, (_, i) => (
          <rect key={`pil${i}`} x={70 + i * 145} y={0} width="14" height={HORIZON} fill={DF.voidDeep} opacity="0.4" />
        ))}
        {/* small, distant lancet windows, high on the wall */}
        {Array.from({ length: 12 }, (_, i) => lancet(150 + i * 145, 430, 96, 250, `w${i}`, 0.1))}

        {/* CORNICE — wall/floor boundary (contrast) */}
        <rect x="0" y={HORIZON - 5} width="1920" height="9" fill={DF.stoneGrey} opacity="0.2" />
        <rect x="0" y={HORIZON + 4} width="1920" height="22" fill={DF.void} opacity="0.4" />

                {/* FLOOR — flat 2D side-view plane + foreground balustrade ledge (no perspective) */}
        <rect x="0" y={HORIZON} width="1920" height={1080 - HORIZON} fill={DF.voidDeep} opacity="0.3" />
        <rect x="0" y="1004" width="1920" height="14" fill={DF.void} opacity="0.92" />
        <rect x="0" y="1056" width="1920" height="24" fill={DF.void} opacity="0.96" />
        {Array.from({ length: 28 }, (_, i) => {
          const bx = 34 + i * 69
          return (
            <g key={`bal${i}`} fill={DF.void} opacity="0.9">
              <rect x={bx - 7} y="1018" width="14" height="40" rx="3" />
              <ellipse cx={bx} cy="1018" rx="13" ry="7" />
              <ellipse cx={bx} cy="1056" rx="13" ry="7" />
            </g>
          )
        })}

        {/* interior side columns */}
        {column(48, 'cL')}
        {column(1872, 'cR')}

        {/* hanging soul-lamps along the wall */}
        {lamp(300, 250, 'l1')}
        {lamp(620, 210, 'l2')}
        {lamp(1300, 210, 'l3')}
        {lamp(1620, 250, 'l4')}
      </svg>

      {motes.map((m, i) => (
        <span
          key={i}
          className="hk-mote"
          style={{
            left: `${m.left}%`,
            top: `${m.top}%`,
            width: m.size,
            height: m.size,
            background: `radial-gradient(circle, ${m.gold ? DF.spiritGold : DF.etherealDark}, transparent 70%)`,
            animationDuration: `${m.dur}s`,
            animationDelay: `${m.delay}s`,
          }}
        />
      ))}
    </div>
  )
})

// Combined atmosphere layer - NO chandelier here (it's in header now)
const DarkFantasyAtmosphere = memo(function DarkFantasyAtmosphere() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[3] contain-strict" aria-hidden="true" role="presentation">
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

/**
 * PROFESSION-SPECIFIC BACKGROUND ORNAMENTS
 * =========================================
 * HK-style parallax depth layers with silhouette ornaments.
 *
 * Pattern: CSS transform-based parallax (GPU-accelerated)
 * Why chosen: Parallax creates depth without expensive blur filters.
 * Each layer moves at different speeds on scroll for depth illusion.
 *
 * Layers (HK-style):
 * - Far background (slowest, smallest, most faded) - 0.2x scroll speed
 * - Mid background (medium) - 0.5x scroll speed
 * - Near background (fastest, larger, less faded) - 0.8x scroll speed
 *
 * Replication steps for other themes:
 * 1. Create 3-5 parallax layers with decreasing opacity for depth
 * 2. Use transform: translateY with scroll-based multipliers
 * 3. Match ornament shapes to the profession/game aesthetic
 * 4. Far = small + faded, Near = larger + slightly more visible
 */

// Engineering ornaments - City of Tears style (geometric, architectural)
const EngineerOrnaments = memo(function EngineerOrnaments({ scrollY }: { scrollY: number }) {
  // Pulley rotation: left gears rotate clockwise, right gears counter-clockwise
  const getRotation = (x: number, speed: number = 0.08) => {
    const isLeftSide = x < 960
    return isLeftSide ? scrollY * speed : -scrollY * speed
  }

  return (
    <>
      {/* FAR LAYER - tiny gears, distant structures */}
      <svg
        className="fixed inset-0 w-full h-full pointer-events-none"
        style={{
          transform: `translateY(${scrollY * 0.15}px) translateZ(0)`,
          opacity: 0.12,
        }}
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        {/* Distant gear silhouettes */}
        {[
          { x: 150, y: 200, r: 30 },
          { x: 1750, y: 300, r: 25 },
          { x: 200, y: 600, r: 35 },
          { x: 1680, y: 700, r: 28 },
          { x: 100, y: 900, r: 32 },
          { x: 1800, y: 850, r: 22 },
        ].map((g, i) => (
          <g key={i} transform={`translate(${g.x}, ${g.y}) rotate(${getRotation(g.x, 0.05)})`}>
            <circle r={g.r} fill="none" stroke={DF.brass} strokeWidth="2" opacity="0.6" />
            <circle r={g.r * 0.4} fill={DF.brass} opacity="0.3" />
            {/* Gear teeth suggestion */}
            {Array.from({ length: 8 }, (_, j) => {
              const angle = (j * 360) / 8
              const rad = (angle * Math.PI) / 180
              return (
                <line
                  key={j}
                  x1={Math.cos(rad) * g.r * 0.85}
                  y1={Math.sin(rad) * g.r * 0.85}
                  x2={Math.cos(rad) * g.r * 1.15}
                  y2={Math.sin(rad) * g.r * 1.15}
                  stroke={DF.brass}
                  strokeWidth="2"
                />
              )
            })}
          </g>
        ))}
        {/* Distant vertical pipes */}
        <line x1="80" y1="0" x2="80" y2="1080" stroke={DF.copper} strokeWidth="3" opacity="0.4" />
        <line x1="1840" y1="0" x2="1840" y2="1080" stroke={DF.copper} strokeWidth="3" opacity="0.4" />
      </svg>

      {/* MID LAYER - medium gears, cable connections */}
      <svg
        className="fixed inset-0 w-full h-full pointer-events-none"
        style={{
          transform: `translateY(${scrollY * 0.35}px) translateZ(0)`,
          opacity: 0.18,
        }}
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        {/* Medium gears with more detail */}
        {[
          { x: 50, y: 400, r: 55 },
          { x: 1870, y: 500, r: 50 },
          { x: 120, y: 800, r: 45 },
          { x: 1800, y: 200, r: 48 },
        ].map((g, i) => (
          <g key={i} transform={`translate(${g.x}, ${g.y}) rotate(${getRotation(g.x, 0.08)})`}>
            <circle r={g.r} fill="none" stroke={DF.brass} strokeWidth="3" />
            <circle r={g.r * 0.6} fill="none" stroke={DF.copper} strokeWidth="2" />
            <circle r={g.r * 0.25} fill={DF.brass} opacity="0.5" />
            {/* Spokes */}
            {Array.from({ length: 4 }, (_, j) => {
              const angle = j * 90
              const rad = (angle * Math.PI) / 180
              return (
                <line
                  key={j}
                  x1={0}
                  y1={0}
                  x2={Math.cos(rad) * g.r * 0.9}
                  y2={Math.sin(rad) * g.r * 0.9}
                  stroke={DF.copper}
                  strokeWidth="2"
                  opacity="0.7"
                />
              )
            })}
          </g>
        ))}
        {/* Connecting cables */}
        <path
          d="M50,400 Q200,350 120,800"
          fill="none"
          stroke={DF.copper}
          strokeWidth="2"
          strokeDasharray="8 4"
          opacity="0.5"
        />
        <path
          d="M1870,500 Q1700,400 1800,200"
          fill="none"
          stroke={DF.copper}
          strokeWidth="2"
          strokeDasharray="8 4"
          opacity="0.5"
        />
        {/* Horizontal structural beams */}
        <rect x="0" y="150" width="250" height="4" fill={DF.stoneGrey} opacity="0.4" />
        <rect x="1670" y="180" width="250" height="4" fill={DF.stoneGrey} opacity="0.4" />
        <rect x="0" y="650" width="180" height="4" fill={DF.stoneGrey} opacity="0.4" />
        <rect x="1740" y="620" width="180" height="4" fill={DF.stoneGrey} opacity="0.4" />
      </svg>

      {/* NEAR LAYER - large gears, terminal glows */}
      <svg
        className="fixed inset-0 w-full h-full pointer-events-none"
        style={{
          transform: `translateY(${scrollY * 0.6}px) translateZ(0)`,
          opacity: 0.22,
        }}
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        {/* Large foreground gears - partially visible at edges, rotate like pulleys */}
        <g transform={`translate(-60, 550) rotate(${getRotation(-60, 0.12)})`}>
          <circle r="120" fill="none" stroke={DF.brass} strokeWidth="5" />
          <circle r="80" fill="none" stroke={DF.copper} strokeWidth="3" />
          <circle r="30" fill={DF.brass} opacity="0.4" />
          {Array.from({ length: 12 }, (_, j) => {
            const angle = (j * 360) / 12
            const rad = (angle * Math.PI) / 180
            return (
              <line
                key={j}
                x1={Math.cos(rad) * 100}
                y1={Math.sin(rad) * 100}
                x2={Math.cos(rad) * 135}
                y2={Math.sin(rad) * 135}
                stroke={DF.brass}
                strokeWidth="4"
              />
            )
          })}
        </g>
        <g transform={`translate(1980, 650) rotate(${getRotation(1980, 0.12)})`}>
          <circle r="100" fill="none" stroke={DF.brass} strokeWidth="5" />
          <circle r="65" fill="none" stroke={DF.copper} strokeWidth="3" />
          <circle r="25" fill={DF.brass} opacity="0.4" />
          {Array.from({ length: 10 }, (_, j) => {
            const angle = (j * 360) / 10
            const rad = (angle * Math.PI) / 180
            return (
              <line
                key={j}
                x1={Math.cos(rad) * 80}
                y1={Math.sin(rad) * 80}
                x2={Math.cos(rad) * 115}
                y2={Math.sin(rad) * 115}
                stroke={DF.brass}
                strokeWidth="3"
              />
            )
          })}
        </g>
        {/* Terminal glow points */}
        <circle cx="30" cy="300" r="8" fill={DF.ethereal} opacity="0.6" />
        <circle cx="30" cy="300" r="20" fill={DF.ethereal} opacity="0.2" />
        <circle cx="1890" cy="400" r="8" fill={DF.ethereal} opacity="0.6" />
        <circle cx="1890" cy="400" r="20" fill={DF.ethereal} opacity="0.2" />
        {/* Circuit path suggestions */}
        <path
          d="M0,300 L30,300 L30,350 L80,350"
          fill="none"
          stroke={DF.ethereal}
          strokeWidth="2"
          opacity="0.4"
        />
        <path
          d="M1920,400 L1890,400 L1890,450 L1840,450"
          fill="none"
          stroke={DF.ethereal}
          strokeWidth="2"
          opacity="0.4"
        />
      </svg>
    </>
  )
})

// Drummer "concert stage" — a Hollow Knight gothic chamber ensemble: drum kit, keyboard,
// trumpets, guitar, cello + violin, set BACK (smaller, high near the windows) in the side
// negative spaces so they read as distant stage-dressing and never touch the content.
// Solid dark shells, tarnished brass, ornate detail, gradient shading. Drummer only.
const MusicianOrnaments = memo(function MusicianOrnaments({ scrollY }: { scrollY: number }) {
  void scrollY
  const SHELL = DF.voidDeep
  const SHELL_D = DF.void
  const RIM = DF.brass
  const RIM_H = DF.spiritGold
  const RIM_S = DF.copper
  const HW = DF.stoneGrey
  const GLOW = DF.ethereal

  const drum = (cx: number, cy: number, rx: number, ry: number, k: string, glow = false) => (
    <g key={k}>
      <ellipse cx={cx} cy={cy} rx={rx * 1.05} ry={ry * 1.05} fill={SHELL_D} />
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="url(#hkHead)" stroke={RIM} strokeWidth="4" />
      <ellipse cx={cx} cy={cy} rx={rx * 0.92} ry={ry * 0.92} fill="none" stroke={RIM_H} strokeWidth="1.5" opacity="0.4" />
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2 - Math.PI / 2
        const lx = cx + Math.cos(a) * rx
        const ly = cy + Math.sin(a) * ry
        return (
          <g key={i} transform={`translate(${lx},${ly}) rotate(${(a * 180) / Math.PI + 90})`}>
            <path d="M0,-8 Q4.5,-2 0,7 Q-4.5,-2 0,-8 Z" fill={RIM} stroke={RIM_S} strokeWidth="0.6" />
          </g>
        )
      })}
      {glow && (
        <>
          <circle cx={cx} cy={cy} r={rx * 0.34} fill={GLOW} opacity="0.14" />
          <path d={`M${cx},${cy - 30} L${cx - 8},${cy} L${cx},${cy + 30} L${cx + 8},${cy} Z`} fill={RIM_H} opacity="0.4" />
          <circle cx={cx} cy={cy} r="9" fill={DF.etherealDark} opacity="0.5" />
        </>
      )}
    </g>
  )

  const cymbal = (x: number, baseY: number, topY: number, rx: number, tilt: number, k: string) => (
    <g key={k}>
      <line x1={x} y1={topY} x2={x} y2={baseY} stroke={HW} strokeWidth="4" opacity="0.7" />
      <line x1={x} y1={baseY} x2={x - 26} y2={baseY + 46} stroke={HW} strokeWidth="3" opacity="0.6" />
      <line x1={x} y1={baseY} x2={x + 26} y2={baseY + 46} stroke={HW} strokeWidth="3" opacity="0.6" />
      <g transform={`translate(${x},${topY}) rotate(${tilt})`}>
        <ellipse rx={rx} ry={rx * 0.15} fill="url(#hkBrass)" stroke={RIM_S} strokeWidth="1.5" />
        <ellipse rx={rx} ry={rx * 0.15} fill="none" stroke={RIM_H} strokeWidth="1" opacity="0.55" />
        <ellipse rx={rx * 0.2} ry={rx * 0.05} fill={RIM_S} />
      </g>
    </g>
  )

  const floorTom = (cx: number, topY: number, w: number, h: number, k: string) => (
    <g key={k}>
      <line x1={cx - w / 2 + 8} y1={topY + h - 10} x2={cx - w / 2 - 16} y2={topY + h + 70} stroke={HW} strokeWidth="3" opacity="0.6" />
      <line x1={cx + w / 2 - 8} y1={topY + h - 10} x2={cx + w / 2 + 16} y2={topY + h + 70} stroke={HW} strokeWidth="3" opacity="0.6" />
      <path d={`M${cx - w / 2},${topY} L${cx - w / 2},${topY + h} Q${cx - w / 2},${topY + h + 14} ${cx},${topY + h + 14} Q${cx + w / 2},${topY + h + 14} ${cx + w / 2},${topY + h} L${cx + w / 2},${topY} Z`} fill="url(#hkShellV)" stroke={SHELL_D} strokeWidth="2" />
      <ellipse cx={cx} cy={topY} rx={w / 2} ry={w * 0.17} fill="url(#hkHead)" stroke={RIM} strokeWidth="3" />
      {[0.18, 0.5, 0.82].map((f, i) => (
        <g key={i}>
          <path d={`M${cx - w / 2 - 2},${topY + h * f} q-7,5 0,16 q7,-5 0,-16 Z`} fill={RIM} stroke={RIM_S} strokeWidth="0.5" />
          <path d={`M${cx + w / 2 + 2},${topY + h * f} q7,5 0,16 q-7,-5 0,-16 Z`} fill={RIM} stroke={RIM_S} strokeWidth="0.5" />
        </g>
      ))}
    </g>
  )

  const keyboard = (tx: number, ty: number, s: number, k: string) => (
    <g key={k} transform={`translate(${tx},${ty}) scale(${s})`} opacity="0.9">
      <path d="M-120,0 L-44,-150 M-44,0 L-120,-150" stroke={HW} strokeWidth="11" opacity="0.7" />
      <path d="M120,0 L44,-150 M44,0 L120,-150" stroke={HW} strokeWidth="11" opacity="0.7" />
      <rect x="-150" y="-196" width="300" height="56" rx="8" fill="url(#hkShellV)" stroke={RIM} strokeWidth="3" />
      <rect x="-140" y="-192" width="280" height="9" fill={RIM} opacity="0.7" />
      {Array.from({ length: 17 }, (_, i) => (
        <rect key={i} x={-138 + i * 16.2} y="-182" width="13" height="30" fill={DF.bone} opacity="0.45" />
      ))}
      {Array.from({ length: 16 }, (_, i) => (i % 7 === 2 || i % 7 === 6 ? null : <rect key={`b${i}`} x={-130 + i * 16.2} y="-182" width="7" height="18" fill={SHELL_D} />))}
      <rect x="-150" y="-270" width="300" height="74" rx="6" fill="url(#hkShellV)" stroke={RIM} strokeWidth="2" opacity="0.9" />
      <circle cx="0" cy="-288" r="5" fill={RIM_H} opacity="0.5" />
    </g>
  )

  const trumpets = (tx: number, ty: number, s: number, k: string) => (
    <g key={k} transform={`translate(${tx},${ty}) scale(${s})`} opacity="0.92">
      <line x1="0" y1="0" x2="-26" y2="4" stroke={HW} strokeWidth="4" opacity="0.6" />
      <line x1="0" y1="0" x2="26" y2="4" stroke={HW} strokeWidth="4" opacity="0.6" />
      <line x1="0" y1="0" x2="0" y2="-118" stroke={HW} strokeWidth="6" opacity="0.65" />
      {[{ y: -116, r: -18 }, { y: -150, r: -26 }].map((t, i) => (
        <g key={i} transform={`translate(0,${t.y}) rotate(${t.r})`}>
          <rect x="6" y="-6" width="118" height="12" rx="6" fill="url(#hkBrass)" stroke={RIM_S} strokeWidth="1" />
          <path d="M124,-26 Q160,0 124,26 Q138,0 124,-26 Z" fill="url(#hkBrass)" stroke={RIM_S} strokeWidth="1.5" />
          <rect x="46" y="-12" width="34" height="20" rx="3" fill={RIM} stroke={RIM_S} strokeWidth="1" />
          {[52, 62, 72].map((vx) => <line key={vx} x1={vx} y1="-12" x2={vx} y2="-22" stroke={RIM} strokeWidth="3" />)}
          <circle cx="2" cy="0" r="7" fill={RIM} />
        </g>
      ))}
    </g>
  )

  // clean electric-guitar silhouette on a stand
  const guitar = (tx: number, ty: number, s: number, rot: number, k: string) => (
    <g key={k} transform={`translate(${tx},${ty}) rotate(${rot}) scale(${s})`} opacity="0.9">
      <line x1="-30" y1="6" x2="0" y2="-26" stroke={HW} strokeWidth="6" opacity="0.6" />
      <line x1="30" y1="6" x2="0" y2="-26" stroke={HW} strokeWidth="6" opacity="0.6" />
      <path d="M-6,0 C-46,2 -58,-44 -40,-72 C-26,-92 -2,-86 6,-70 C16,-90 44,-86 52,-58 C58,-36 40,-6 6,-6 Z" fill="url(#hkShellV)" stroke={RIM} strokeWidth="3" />
      <circle cx="6" cy="-48" r="14" fill={SHELL_D} stroke={RIM} strokeWidth="2" />
      <rect x="-3" y="-300" width="20" height="232" fill="url(#hkShellV)" stroke={RIM} strokeWidth="2" />
      {Array.from({ length: 6 }, (_, i) => (
        <line key={i} x1="-3" y1={-110 - i * 30} x2="17" y2={-110 - i * 30} stroke={RIM} strokeWidth="1" opacity="0.4" />
      ))}
      <path d="M-3,-300 L17,-300 L22,-346 L-8,-346 Z" fill="url(#hkShellV)" stroke={RIM} strokeWidth="2" />
      {[-308, -322, -336].map((py) => <circle key={py} cx="-6" cy={py} r="3" fill={RIM} />)}
    </g>
  )

  // violin / cello body (figure-8) + fingerboard + scroll; cello stands on an endpin
  const strings = (tx: number, ty: number, s: number, k: string, pin: boolean) => (
    <g key={k} transform={`translate(${tx},${ty}) scale(${s})`} opacity="0.9">
      {pin && <line x1="0" y1="0" x2="0" y2="26" stroke={HW} strokeWidth="4" opacity="0.6" />}
      <path d="M0,-8 C-56,-18 -60,-86 -34,-104 C-50,-114 -50,-150 -22,-160 C-40,-176 -36,-210 0,-218 C36,-210 40,-176 22,-160 C50,-150 50,-114 34,-104 C60,-86 56,-18 0,-8 Z" fill="url(#hkShellV)" stroke={RIM} strokeWidth="3" />
      <path d="M-15,-66 q-7,16 0,34" fill="none" stroke={SHELL_D} strokeWidth="3" />
      <path d="M15,-66 q7,16 0,34" fill="none" stroke={SHELL_D} strokeWidth="3" />
      <rect x="-7" y="-94" width="14" height="14" rx="2" fill={RIM} opacity="0.7" />
      <rect x="-7" y="-218" width="14" height="118" fill={SHELL_D} stroke={RIM} strokeWidth="1.5" />
      <path d="M-7,-336 q-9,-4 -3,-16 q9,2 10,16 Z" fill="url(#hkShellV)" stroke={RIM} strokeWidth="1.5" />
      <circle cx="-3" cy="-330" r="8" fill="none" stroke={RIM} strokeWidth="2" />
    </g>
  )

  // gothic harp — triangular frame (foot + front pillar + curved neck) with fanned strings
  const harp = (tx: number, ty: number, s: number, k: string) => (
    <g key={k} transform={`translate(${tx},${ty}) scale(${s})`} opacity="0.9">
      <path d="M-8,0 L86,0 L74,20 L4,20 Z" fill="url(#hkShellV)" stroke={RIM} strokeWidth="2.5" />
      <path d="M58,8 L40,-300 L62,-300 L80,8 Z" fill="url(#hkShellV)" stroke={RIM} strokeWidth="3" />
      <circle cx="51" cy="-300" r="11" fill={RIM} stroke={RIM_S} strokeWidth="1.5" />
      <path d="M46,-300 Q-70,-322 -84,-150 Q-90,-40 -6,16" fill="none" stroke="url(#hkBrass)" strokeWidth="12" />
      <path d="M46,-300 Q-70,-322 -84,-150 Q-90,-40 -6,16" fill="none" stroke={RIM_H} strokeWidth="2" opacity="0.5" />
      {Array.from({ length: 12 }, (_, i) => {
        const t = i / 11
        const topX = 40 + (-78 - 40) * t
        const topY = -298 + (-120 - -298) * t
        const botX = 56 + (-2 - 56) * t
        return <line key={i} x1={topX} y1={topY} x2={botX} y2="14" stroke={RIM_H} strokeWidth="1" opacity="0.3" />
      })}
    </g>
  )

  // tubular bells / chimes — a cathedral-appropriate hanging brass rack
  const chimes = (tx: number, ty: number, s: number, k: string) => (
    <g key={k} transform={`translate(${tx},${ty}) scale(${s})`} opacity="0.9">
      <line x1="-104" y1="14" x2="-104" y2="-300" stroke={HW} strokeWidth="6" opacity="0.6" />
      <line x1="104" y1="14" x2="104" y2="-300" stroke={HW} strokeWidth="6" opacity="0.6" />
      <line x1="-120" y1="14" x2="120" y2="14" stroke={HW} strokeWidth="6" opacity="0.6" />
      <rect x="-112" y="-314" width="224" height="16" rx="7" fill="url(#hkShellV)" stroke={RIM} strokeWidth="2.5" />
      {Array.from({ length: 7 }, (_, i) => {
        const x = -84 + i * 28
        const len = 150 + i * 20
        return (
          <g key={i}>
            <rect x={x - 6} y="-292" width="12" height={len} rx="6" fill="url(#hkBrass)" stroke={RIM_S} strokeWidth="0.8" />
            <rect x={x - 6} y="-292" width="4" height={len} fill={RIM_H} opacity="0.4" />
            <ellipse cx={x} cy={-292 + len} rx="6" ry="3" fill={RIM_S} />
          </g>
        )
      })}
    </g>
  )

  // idle: a small cluster of drifting music notes rising from an instrument
  const GLYPHS = ['♪', '♫', '♩', '♬']
  const noteCluster = (x: number, y: number, seed: number, k: string) => (
    <g key={k} aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <text
          key={i}
          x={x + (i - 1) * 18}
          y={y}
          className="hk-note"
          style={{ animationDelay: `${((seed + i * 1.3) % 3.4).toFixed(2)}s` }}
          fill={i % 2 === 0 ? GLOW : RIM_H}
          fontSize="30"
          opacity="0"
        >
          {GLYPHS[(seed + i) % 4]}
        </text>
      ))}
    </g>
  )

  // idle: drum kit gives a small struck-note burst (no rings — those read as blue circles)
  const drumFx = (x: number, y: number, k: string) => (
    <g key={k} aria-hidden="true">
      <text x={x} y={y - 34} className="hk-thump" style={{ animationDelay: '0.5s' }} fill={RIM_H} fontSize="26" textAnchor="middle" opacity="0">✺</text>
    </g>
  )

  return (
    <svg
      className="ornament-layer fixed inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.82 }}
      viewBox="0 0 1920 1080"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="hkHead" cx="42%" cy="38%" r="70%">
          <stop offset="0%" stopColor={DF.voidPurple} />
          <stop offset="70%" stopColor={SHELL} />
          <stop offset="100%" stopColor={SHELL_D} />
        </radialGradient>
        <linearGradient id="hkShellV" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={SHELL_D} />
          <stop offset="45%" stopColor={DF.voidPurple} />
          <stop offset="100%" stopColor={SHELL_D} />
        </linearGradient>
        <linearGradient id="hkBrass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={RIM_S} />
          <stop offset="45%" stopColor={RIM_H} />
          <stop offset="100%" stopColor={RIM_S} />
        </linearGradient>
      </defs>

      {/* harp set far BACK and small, floated up near the gothic windows (a distant
          back-row instrument, like the violin) — sits just above the drum kit */}
      {harp(1660, 560, 0.38, 'harp')}

      {/* === DRUM KIT — right gutter, set back (small + high) === */}
      <g transform="translate(1372, 392) scale(0.3)">
        <circle cx="960" cy="640" r="210" fill={GLOW} opacity="0.05" />
        {cymbal(675, 1004, 596, 112, -13, 'crash')}
        {cymbal(1230, 1004, 648, 120, 11, 'ride')}
        <line x1="545" y1="1004" x2="545" y2="762" stroke={HW} strokeWidth="4" opacity="0.7" />
        <ellipse cx="545" cy="752" rx="66" ry="11" fill="url(#hkBrass)" stroke={RIM_S} strokeWidth="1.5" />
        <ellipse cx="545" cy="770" rx="66" ry="11" fill="url(#hkBrass)" stroke={RIM_S} strokeWidth="1.5" />
        {floorTom(1238, 846, 148, 162, 'ft')}
        <line x1="960" y1="788" x2="960" y2="688" stroke={HW} strokeWidth="5" opacity="0.6" />
        <g transform="rotate(-12 882 704)">{drum(882, 704, 86, 70, 'tomL')}</g>
        <g transform="rotate(12 1042 704)">{drum(1042, 704, 86, 70, 'tomR')}</g>
        <line x1="742" y1="1004" x2="742" y2="838" stroke={HW} strokeWidth="3" opacity="0.65" />
        {drum(742, 828, 78, 30, 'snare')}
        {drum(960, 862, 168, 168, 'bass', true)}
      </g>

      {/* === stage-LEFT cluster (nudged toward centre): cello, keyboard, guitar === */}
      {strings(250, 712, 0.54, 'cello', true)}
      {keyboard(395, 700, 0.42, 'kb')}
      {guitar(525, 712, 0.34, -9, 'gtr')}

      {/* === stage-RIGHT cluster: trumpets + violin moved to the LEFT of the drum; chimes far right === */}
      {trumpets(1432, 712, 0.42, 'tp')}
      {strings(1520, 600, 0.33, 'violin', false)}
      {chimes(1810, 555, 0.4, 'chimes')}

      {/* === idle: drifting notes from melodic instruments + drum burst === */}
      {noteCluster(1675, 425, 0, 'n-harp')}
      {noteCluster(265, 565, 1, 'n-cello')}
      {noteCluster(410, 560, 2, 'n-kb')}
      {noteCluster(1450, 615, 3, 'n-tp')}
      {noteCluster(1530, 505, 4, 'n-vl')}
      {noteCluster(1820, 425, 5, 'n-chimes')}
      {drumFx(1655, 565, 'fx-drum')}
    </svg>
  )
})

// Muay Thai ornaments - cleared; pending a proper redesign (see project memory)
const FighterOrnaments = memo(function FighterOrnaments({ scrollY }: { scrollY: number }) {
  void scrollY
  return null
})

// Container component that selects ornaments based on profession
const ProfessionOrnaments = memo(function ProfessionOrnaments({ profession }: { profession: 'engineer' | 'drummer' | 'fighter' }) {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-[0] overflow-hidden" aria-hidden="true">
      {/* z-[0]: sits BELOW the z-[1] HollowDepths columns so instruments read as set
          BEHIND the architecture (was z-[2], which painted them in front of the columns). */}
      {profession === 'engineer' && <EngineerOrnaments scrollY={scrollY} />}
      {profession === 'drummer' && <MusicianOrnaments scrollY={scrollY} />}
      {profession === 'fighter' && <FighterOrnaments scrollY={scrollY} />}
    </div>
  )
})

/**
 * ENERGY FLOW ANIMATION
 * =====================
 * Pattern: setTimeout-phase with CSS transforms
 * Why chosen: User interaction (click) triggers a short animation sequence.
 *             JS coordinates timing, CSS handles GPU-accelerated visuals.
 *
 * Phases: idle -> flowing -> arrived -> idle
 * Timing: { flowing: 0ms (start), arrived: 350ms, idle: 500ms }
 *
 * How it works:
 * - Tracks previous profession via useRef
 * - On profession change, calculates path from old to new node
 * - Spawns energy particles that travel along the connection path
 * - Uses CSS keyframes with transform/opacity (GPU-accelerated)
 * - Particles fade out as destination node "lights up"
 *
 * Replication steps for other themes:
 * 1. Create component that tracks previous selection with useRef
 * 2. Define node positions and path connections
 * 3. Calculate animation direction based on from/to indices
 * 4. Use CSS @keyframes with transform: translate3d for movement
 * 5. Sync destination glow with particle arrival time
 */

/**
 * ELECTRICITY THROUGH WIRE ANIMATION
 * ===================================
 * Energy flows along the actual wire paths between profession nodes.
 * The path goes: Engineer (25%,50%) ↔ Drummer (50%,30%) ↔ Fighter (75%,50%)
 *
 * When switching between non-adjacent nodes (Engineer↔Fighter),
 * energy travels THROUGH the middle node (Drummer).
 */

// Calculate the wire path segments between two professions
function getWirePath(from: string, to: string): Array<{ x: number; y: number }> {
  const positions: Record<string, { x: number; y: number }> = {
    engineer: { x: 25, y: 50 },
    drummer: { x: 50, y: 30 },
    fighter: { x: 75, y: 50 },
  }

  // Direct adjacent paths
  if ((from === 'engineer' && to === 'drummer') || (from === 'drummer' && to === 'engineer')) {
    return [positions[from], positions[to]]
  }
  if ((from === 'drummer' && to === 'fighter') || (from === 'fighter' && to === 'drummer')) {
    return [positions[from], positions[to]]
  }
  // Non-adjacent: go through drummer
  if (from === 'engineer' && to === 'fighter') {
    return [positions.engineer, positions.drummer, positions.fighter]
  }
  if (from === 'fighter' && to === 'engineer') {
    return [positions.fighter, positions.drummer, positions.engineer]
  }
  return [positions[from], positions[to]]
}

// Single energy particle that travels along a path
const WireEnergyParticle = memo(function WireEnergyParticle({
  pathPoints,
  delay,
  duration,
  color,
  size,
}: {
  pathPoints: Array<{ x: number; y: number }>
  delay: number
  duration: number
  color: string
  size: number
}) {
  // Generate CSS animation that follows the path waypoints
  const keyframeId = `wirePath-${delay}-${Date.now()}`
  const keyframes = pathPoints.map((point, i) => {
    const progress = (i / (pathPoints.length - 1)) * 100
    return `${progress}% { left: ${point.x}%; top: ${point.y}%; }`
  }).join('\n')

  return (
    <>
      <style>{`
        @keyframes ${keyframeId} {
          ${keyframes}
        }
      `}</style>
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          left: `${pathPoints[0].x}%`,
          top: `${pathPoints[0].y}%`,
          width: 8 * size,
          height: 8 * size,
          background: `radial-gradient(circle, ${color} 30%, ${color}80 60%, transparent 100%)`,
          boxShadow: `0 0 12px ${color}, 0 0 24px ${color}60`,
          transform: 'translate(-50%, -50%)',
          animation: `${keyframeId} ${duration}ms ease-in-out ${delay}ms forwards`,
          opacity: 0,
          animationFillMode: 'forwards',
        }}
        aria-hidden="true"
      />
    </>
  )
})

// Wire glow effect that shows the path lighting up
const WireGlow = memo(function WireGlow({
  pathPoints,
  duration,
  color,
}: {
  pathPoints: Array<{ x: number; y: number }>
  duration: number
  color: string
}) {
  // Create SVG path for the glow effect
  const pathD = pathPoints.map((p, i) =>
    `${i === 0 ? 'M' : 'L'}${p.x} ${p.y}`
  ).join(' ')

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <filter id="wireGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="0.8"
        filter="url(#wireGlow)"
        style={{
          strokeDasharray: '100',
          strokeDashoffset: '100',
          animation: `wireStroke ${duration}ms ease-out forwards`,
        }}
      />
    </svg>
  )
})

// Energy flow container that manages the animation state
const EnergyFlowAnimation = memo(function EnergyFlowAnimation({
  fromProfession,
  toProfession,
  isAnimating,
  nodes,
}: {
  fromProfession: string | null
  toProfession: string
  isAnimating: boolean
  nodes: Array<{ id: string; position: { x: number; y: number }; color: string }>
}) {
  if (!isAnimating || !fromProfession || fromProfession === toProfession) {
    return null
  }

  const pathPoints = getWirePath(fromProfession, toProfession)
  const totalDuration = pathPoints.length > 2 ? 450 : 300

  // Create multiple particles with staggered timing for a "stream" effect
  const particles = [
    { delay: 0, size: 1 },
    { delay: 30, size: 0.85 },
    { delay: 60, size: 0.7 },
    { delay: 90, size: 0.9 },
    { delay: 120, size: 0.75 },
  ]

  const energyColor = '#50e0ff' // Ethereal HK blue

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Wire glow effect */}
      <WireGlow pathPoints={pathPoints} duration={totalDuration} color={energyColor} />

      {/* Energy particles following the wire */}
      {particles.map((p, i) => (
        <WireEnergyParticle
          key={i}
          pathPoints={pathPoints}
          delay={p.delay}
          duration={totalDuration}
          color={energyColor}
          size={p.size}
        />
      ))}
    </div>
  )
})

// Waystation node for profession selection (generic rest point, not HK bench)
const WaystationNode = memo(function WaystationNode({
  icon,
  label,
  sublabel,
  color,
  isActive,
  isReceivingEnergy,
  onClick,
  position,
}: {
  icon: React.ReactNode
  label: string
  sublabel: string
  color: string
  isActive: boolean
  isReceivingEnergy?: boolean
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
      {/* Energy arrival burst - shows when this node receives energy */}
      {isReceivingEnergy && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse, #50e0ff60 0%, #50e0ff30 40%, transparent 70%)`,
            animation: 'energyArrival 400ms ease-out forwards',
          }}
          aria-hidden="true"
        />
      )}
      {/* Active glow - rectangular to match VoidFrame */}
      <div
        className={`absolute inset-0 transition-all duration-500 ${
          isActive ? 'opacity-50 scale-110' : 'opacity-0 scale-100 group-hover:opacity-30 group-hover:scale-105'
        }`}
        style={{
          background: `radial-gradient(ellipse, ${color}60 0%, ${color}30 40%, transparent 70%)`,
        }}
        aria-hidden="true"
      />
      {/* Main container - VoidFrame style with decorative elements */}
      <div
        className={`df-card bg-df-panel relative w-20 h-20 md:w-28 md:h-28 flex flex-col items-center justify-center transition-all duration-300 ${
          isActive ? 'df-card--active scale-110' : 'group-hover:scale-105'
        }`}
        style={{
          ['--df-accent' as string]: isActive ? color : undefined,
          animation: isReceivingEnergy ? 'nodeArrival 400ms ease-out' : undefined,
        }}
      >
        {/* Top flourish - mini version */}
        <svg
          className="absolute -top-2 left-1/2 -translate-x-1/2"
          width="50"
          height="8"
          viewBox="0 0 50 8"
          aria-hidden="true"
        >
          <path
            d="M25,4 L27,2 L25,0 L23,2 Z"
            fill={isActive ? color : DF.bone}
            opacity={isActive ? 0.8 : 0.4}
          />
          <path
            d="M23,4 Q15,3 5,5"
            fill="none"
            stroke={isActive ? color : DF.bone}
            strokeWidth="0.5"
            opacity={isActive ? 0.6 : 0.3}
          />
          <path
            d="M27,4 Q35,3 45,5"
            fill="none"
            stroke={isActive ? color : DF.bone}
            strokeWidth="0.5"
            opacity={isActive ? 0.6 : 0.3}
          />
        </svg>

        {/* Abstract icon */}
        <div className="mb-0.5 md:mb-1 scale-75 md:scale-100" style={{ color: isActive ? color : DF.silver }}>
          {icon}
        </div>
        <span
          className="text-sm tracking-[0.1em] md:tracking-[0.15em] uppercase font-medium"
          style={{
            color: isActive ? color : DF.silver,
            fontFamily: '"Comic Sans MS", "Comic Sans", cursive',
          }}
        >
          {label}
        </span>
        <span
          className="text-sm tracking-wider opacity-70 text-center leading-tight hidden md:block"
          style={{
            color: isActive ? color : DF.silver,
            fontFamily: '"Comic Sans MS", "Comic Sans", cursive',
          }}
        >
          {sublabel}
        </span>

        {/* Bottom flourish - mini version */}
        <svg
          className="absolute -bottom-2 left-1/2 -translate-x-1/2"
          width="40"
          height="6"
          viewBox="0 0 40 6"
          aria-hidden="true"
        >
          <path
            d="M20,2 L22,4 L20,6 L18,4 Z"
            fill={isActive ? color : DF.bone}
            opacity={isActive ? 0.6 : 0.3}
          />
          <path
            d="M18,4 Q10,4 2,3"
            fill="none"
            stroke={isActive ? color : DF.bone}
            strokeWidth="0.5"
            opacity={isActive ? 0.4 : 0.2}
          />
          <path
            d="M22,4 Q30,4 38,3"
            fill="none"
            stroke={isActive ? color : DF.bone}
            strokeWidth="0.5"
            opacity={isActive ? 0.4 : 0.2}
          />
        </svg>
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

/**
 * Hollow Knight-style Decorative Flourish
 * =======================================
 * Elegant curved vine-like pattern used at top/bottom of dialogue boxes.
 * Inspired by Hollow Knight's UI - organic, gothic curves with small embellishments.
 *
 * Pattern: CSS-only (SVG paths)
 * Why chosen: Static decorative element, no animation needed. SVG paths give us
 * precise control over the organic curved shapes that define HK's aesthetic.
 */
const DialogueFlourish = memo(function DialogueFlourish({
  position,
  width = 200
}: {
  position: 'top' | 'bottom'
  width?: number
}) {
  const isTop = position === 'top'
  // Flip the SVG for bottom position
  const transform = isTop ? '' : 'scale(1, -1)'

  return (
    <svg
      className="absolute left-1/2 -translate-x-1/2"
      style={{
        [isTop ? 'top' : 'bottom']: '-12px',
        width: width,
        height: 24,
      }}
      viewBox="0 0 200 24"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      <g transform={transform} style={{ transformOrigin: 'center' }}>
        {/* Central diamond ornament */}
        <path
          d="M100,4 L104,10 L100,16 L96,10 Z"
          fill={DF.bone}
          opacity="0.7"
        />
        <path
          d="M100,6 L102,10 L100,14 L98,10 Z"
          fill={DF.ethereal}
          opacity="0.4"
        />

        {/* Left curved vine */}
        <path
          d="M96,10 Q80,8 65,12 Q50,16 35,10 Q25,6 15,10"
          fill="none"
          stroke={DF.bone}
          strokeWidth="1.2"
          opacity="0.5"
          strokeLinecap="round"
        />
        {/* Left inner curve */}
        <path
          d="M90,10 Q75,6 60,10 Q48,14 38,8"
          fill="none"
          stroke={DF.bone}
          strokeWidth="0.8"
          opacity="0.3"
          strokeLinecap="round"
        />
        {/* Left small curl accent */}
        <path
          d="M35,10 Q32,6 28,8 Q26,10 28,12"
          fill="none"
          stroke={DF.bone}
          strokeWidth="0.8"
          opacity="0.4"
          strokeLinecap="round"
        />

        {/* Right curved vine (mirrored) */}
        <path
          d="M104,10 Q120,8 135,12 Q150,16 165,10 Q175,6 185,10"
          fill="none"
          stroke={DF.bone}
          strokeWidth="1.2"
          opacity="0.5"
          strokeLinecap="round"
        />
        {/* Right inner curve */}
        <path
          d="M110,10 Q125,6 140,10 Q152,14 162,8"
          fill="none"
          stroke={DF.bone}
          strokeWidth="0.8"
          opacity="0.3"
          strokeLinecap="round"
        />
        {/* Right small curl accent */}
        <path
          d="M165,10 Q168,6 172,8 Q174,10 172,12"
          fill="none"
          stroke={DF.bone}
          strokeWidth="0.8"
          opacity="0.4"
          strokeLinecap="round"
        />

        {/* Small dot accents along the vines */}
        <circle cx="50" cy="14" r="1.5" fill={DF.bone} opacity="0.3" />
        <circle cx="70" cy="10" r="1" fill={DF.bone} opacity="0.4" />
        <circle cx="150" cy="14" r="1.5" fill={DF.bone} opacity="0.3" />
        <circle cx="130" cy="10" r="1" fill={DF.bone} opacity="0.4" />
      </g>
    </svg>
  )
})

/**
 * Hollow Knight-style Dialogue Box Frame (VoidFrame)
 * ==================================================
 * Visual styling matching HK's in-game dialogue boxes:
 * - Dark semi-transparent background (deep blue/purple tones)
 * - Decorative flourishes at top and bottom borders
 * - Clean white text on dark background
 * - Slight backdrop blur for depth
 * - Gothic, elegant feel with organic curved borders
 *
 * Pattern: CSS-only styling (no JS animation for the frame itself)
 * Why chosen: Static visual element, CSS is more performant than JS.
 * The flourishes use SVG paths for precise organic curves.
 *
 * Replication steps for other themes:
 * 1. Create a DialogueFlourish component with theme-appropriate SVG patterns
 * 2. Use semi-transparent background matching theme's void/dark colors
 * 3. Add backdrop-filter blur for depth
 * 4. Position flourishes at top (-12px) and bottom (-12px)
 * 5. Use centered title with subtle underline accent
 */
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
    <div className="relative pt-4 pb-4" role="region" aria-labelledby={headingId}>
      {/* Main dialogue box container */}
      <div className="df-panel bg-df-panel relative">
        {/* Top decorative flourish - elegant vine-like pattern */}
        <DialogueFlourish position="top" width={220} />

        {/* Title header - elegant centered text like HK dialogue speaker name */}
        <div className="pt-6 pb-4 px-6 text-center">
          <HeadingTag
            id={headingId}
            className="text-sm tracking-[0.3em] uppercase inline-block"
            style={{
              color: DF.bone,
              fontFamily: '"Comic Sans MS", "Comic Sans", cursive',
              fontWeight: 400,
              letterSpacing: '0.25em',
              // Subtle text shadow for readability on dark background
              textShadow: `0 2px 8px rgba(0, 0, 0, 0.5)`,
            }}
          >
            {title}
          </HeadingTag>
          {/* Subtle underline accent below title */}
          <div
            className="mt-2 mx-auto"
            style={{
              width: '40px',
              height: '1px',
              background: `linear-gradient(90deg, transparent, ${DF.bone}40, transparent)`,
            }}
          />
        </div>

        {/* Content area - clean white text */}
        <div className="px-6 pb-6">
          {children}
        </div>

        {/* Bottom decorative flourish - slightly smaller than top */}
        <DialogueFlourish position="bottom" width={180} />
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
            style={{ color: DF.silver, fontFamily: '"Comic Sans MS", "Comic Sans", cursive' }}
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
            style={{ color: DF.silver, fontFamily: '"Comic Sans MS", "Comic Sans", cursive' }}
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
        background: `linear-gradient(135deg, ${DF.void}, ${DF.voidPurple})`,
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
      <h3 className="text-lg mt-1 transition-colors" style={{ color: DF.bone }}>
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
        background: `linear-gradient(135deg, ${DF.void}, ${DF.voidPurple})`,
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
          <h3 className="text-lg transition-colors" style={{ color: DF.bone }}>
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
        background: `linear-gradient(135deg, ${DF.void}, ${DF.voidDeep})`,
        border: `1px solid ${DF.lavender}60`,
        borderRadius: '4px',
      }}
    >
      <h3 className="text-lg transition-colors" style={{ color: DF.bone }}>
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
const ExperienceCard = memo(function ExperienceCard({ entry, isLast }: { entry: typeof EXPERIENCE_DATA[0]; isLast?: boolean }) {
  const endDisplay = entry.endDate ? new Date(entry.endDate).getFullYear() : 'Present'
  const startDisplay = new Date(entry.startDate).getFullYear()

  return (
    <article className="py-4">
      <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
        <div>
          <h3 className="text-lg font-medium" style={{ color: DF.bone }}>{entry.title}</h3>
          <p className="text-sm" style={{ color: DF.ethereal }}>{entry.organization}</p>
        </div>
        <span
          className="text-sm"
          style={{ color: DF.spiritGold }}
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
      {!isLast && (
        <div
          className="mt-4"
          style={{
            borderBottom: `1px solid ${DF.stoneDark}40`,
          }}
        />
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

  // Track previous profession for energy flow animation
  const previousProfession = useRef<string | null>(null)
  const [isEnergyFlowing, setIsEnergyFlowing] = useState(false)
  const [animatingFrom, setAnimatingFrom] = useState<string | null>(null)

  // Handle profession change with energy flow animation
  const handleProfessionChange = (newProfession: 'engineer' | 'drummer' | 'fighter') => {
    if (newProfession === active) return

    // Trigger energy flow animation
    setAnimatingFrom(active)
    setIsEnergyFlowing(true)

    // Update the profession
    setActive(newProfession)

    // Clear animation state after animation completes
    setTimeout(() => {
      setIsEnergyFlowing(false)
      setAnimatingFrom(null)
    }, 500)
  }

  // Section triggers using IntersectionObserver
  // Each animated section gets its own trigger based on ACTUAL element position
  const experienceTrigger = useSectionTrigger({ threshold: 0.15, rootMargin: '0px 0px -10% 0px' })
  const projectsTrigger = useSectionTrigger({ threshold: 0.15, rootMargin: '0px 0px -10% 0px' })
  // fire the final battle just slightly before it's centered (small positive bottom margin) —
  // a touch later than the previous +18% which kicked off before you'd even seen the section
  const contactTrigger = useSectionTrigger({ threshold: 0.1, rootMargin: '0px 0px 5% 0px' })

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
      sublabel: 'Muay Thai',
      color: DF.spiritGold,
      position: { x: 75, y: 50 }
    },
  ]

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: `linear-gradient(180deg, ${DF.void}, ${DF.voidDeep}, ${DF.voidPurple})`,
        fontFamily: '"Comic Sans MS", "Comic Sans", cursive',
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
      <HollowDepths />
      <EtherealRain />
      <DarkFantasyAtmosphere />
      <SpiritParticles />
      <ProfessionOrnaments profession={active} />

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
              className="px-2 md:px-3 py-1.5 md:py-2 text-sm tracking-[0.1em] uppercase transition-all hover:scale-105 flex items-center focus:outline-none focus-visible:ring-2"
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
              className="px-2 md:px-3 py-1.5 md:py-2 text-sm tracking-[0.1em] uppercase transition-all hover:scale-105 flex items-center focus:outline-none focus-visible:ring-2"
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
          </div>
        </div>
      </nav>

      {/* Hero Section - below fixed nav, changes with profession */}
      <header className="relative z-20 pt-20 md:pt-24 pb-6 px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm md:text-lg tracking-wider mb-2" style={{ color: DF.silver }}>
            {PROFESSIONAL_SUMMARY[active].headline}
          </p>
          <p
            className="text-sm tracking-wider italic"
            style={{ color: DF.spiritGold, textShadow: `0 0 10px ${DF.spiritGold}40` }}
          >
            {PROFESSIONAL_SUMMARY[active].tagline}
          </p>
        </div>
      </header>

      {/* Main content */}
      <main id="main-content" tabIndex={-1} className="outline-none">

      {/* Profession Selector - Waystation style */}
      <FadeInSection>
        <section className="relative z-20 py-6 md:py-8" aria-labelledby="profession-heading">
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

              {/* Energy flow animation between nodes */}
              <EnergyFlowAnimation
                fromProfession={animatingFrom}
                toProfession={active}
                isAnimating={isEnergyFlowing}
                nodes={professionNodes}
              />

              {professionNodes.map((node) => (
                <WaystationNode
                  key={node.id}
                  {...node}
                  isActive={active === node.id}
                  isReceivingEnergy={isEnergyFlowing && active === node.id}
                  onClick={() => handleProfessionChange(node.id as 'engineer' | 'drummer' | 'fighter')}
                />
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* About */}
      <FadeInSection delay={100}>
        <section className="relative z-20 py-6 md:py-8 px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <VoidFrame title="About">
              <p className="leading-relaxed mb-4" style={{ color: DF.bone }}>{aboutData.bio}</p>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {aboutData.quickFacts.map((fact, i) => (
                  <span
                    key={i}
                    className="px-2 md:px-3 py-1"
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
      </FadeInSection>

      {/* Art Section 1 - Spirits and Gears */}
      <FadeInSection delay={150}>
        <ArtSectionSpirits />
      </FadeInSection>

      {/* Work Experience - Knight Slash Reveal (content slides from right) */}
      {experience.length > 0 && (
        <div ref={experienceTrigger.ref}>
          <KnightSlashReveal triggered={experienceTrigger.triggered}>
          <section className="relative z-20 py-8 px-6">
            <div className="max-w-4xl mx-auto">
              <VoidFrame title="Work Experience">
                <div>
                  {experience.map((entry, index) => (
                    <ExperienceCard key={entry.id} entry={entry} isLast={index === experience.length - 1} />
                  ))}
                </div>
              </VoidFrame>
            </div>
          </section>
          </KnightSlashReveal>
        </div>
      )}

      {/* Art Section 2 - Lanterns */}
      <FadeInSection>
        <ArtSectionLanterns />
      </FadeInSection>

      {/* Tech Stack / Skills */}
      <FadeInSection>
        <section className="relative z-20 py-6 md:py-8 px-4 md:px-6">
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
      </FadeInSection>

      {/* Projects - Bug Pull Reveal */}
      <div ref={projectsTrigger.ref}>
        <BugPullReveal triggered={projectsTrigger.triggered}>
          <section className="relative z-20 py-6 md:py-8 px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <VoidFrame title="Featured Work">
                <div className="grid md:grid-cols-2 gap-3 md:gap-4">
                  {projects.filter(p => p.featured).slice(0, 6).map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </VoidFrame>
            </div>
          </section>
        </BugPullReveal>
      </div>

      {/* Art Section 3 - Crystals */}
      <FadeInSection>
        <ArtSectionCrystals />
      </FadeInSection>

      {/* Ventures (Companies/Bands) */}
      <FadeInSection>
        {active === 'engineer' && (
          <section className="relative z-20 py-6 md:py-8 px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <VoidFrame title="Ventures">
                <div className="grid md:grid-cols-3 gap-3 md:gap-4">
                  {COMPANIES.map((company) => (
                    <CompanyCard key={company.id} company={company} />
                  ))}
                </div>
              </VoidFrame>
            </div>
          </section>
        )}

        {active === 'drummer' && (
          <section className="relative z-20 py-6 md:py-8 px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <VoidFrame title="Bands">
                <div className="grid md:grid-cols-3 gap-3 md:gap-4">
                  {BANDS.map((band) => (
                    <BandCard key={band.id} band={band} />
                  ))}
                </div>
              </VoidFrame>
            </div>
          </section>
        )}
      </FadeInSection>

      {/* Posts */}
      <FadeInSection>
        <section className="relative z-20 py-6 md:py-8 px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <VoidFrame title="Posts">
              <div className="text-center py-6 md:py-8">
                <p style={{ color: DF.silver }}>
                  Writings and thoughts coming soon...
                </p>
                <p className="mt-2 italic" style={{ color: DF.ethereal }}>
                  * Check back for updates on development, music, and martial arts
                </p>
              </div>
            </VoidFrame>
          </div>
        </section>
      </FadeInSection>

      </main>

      {/* Contact CTA - Battle Reveal (knight kills bug, content drops from top) */}
      <div ref={contactTrigger.ref}>
        <BattleReveal triggered={contactTrigger.triggered}>
        <section className="relative z-20 py-16 px-6" aria-label="Contact">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <h2 className="text-xl tracking-[0.15em] mb-3" style={{ color: DF.brass, fontFamily: '"Comic Sans MS", "Comic Sans", cursive' }}>
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
                  fontFamily: '"Comic Sans MS", "Comic Sans", cursive',
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
                  fontFamily: '"Comic Sans MS", "Comic Sans", cursive',
                  borderRadius: '4px',
                }}
              >
                Download CV
              </Link>
            </div>
          </div>
        </section>
        </BattleReveal>

        {/* Enter Another World - portal to the other realms.
            mt pushes it well below the battle so the fixed knight/bug fully clear first. */}
        <section className="relative z-20 mt-32 md:mt-52 py-10 md:py-14 px-4 md:px-6" aria-labelledby="worlds-heading">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2
                id="worlds-heading"
                className="text-xl md:text-2xl tracking-[0.15em] mb-3"
                style={{ color: DF.brass, fontFamily: '"Comic Sans MS", "Comic Sans", cursive' }}
              >
                Enter Another World
              </h2>
              <div className="inline-flex items-center gap-3 mb-3" aria-hidden="true">
                <div className="w-10 h-px" style={{ background: DF.brass }} />
                <span style={{ color: DF.ethereal }}>✦</span>
                <div className="w-10 h-px" style={{ background: DF.brass }} />
              </div>
              <p className="text-sm" style={{ color: DF.silver }}>
                Step through to a different version of this realm
              </p>
            </div>
            <WorldsGrid />
          </div>
        </section>
      </div>

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
          <span className="text-sm tracking-[0.2em]" style={{ fontFamily: '"Comic Sans MS", "Comic Sans", cursive' }}>
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

        /* Wire stroke animation - electricity through wire */
        @keyframes wireStroke {
          0% {
            stroke-dashoffset: 100;
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            stroke-dashoffset: 0;
            opacity: 0;
          }
        }

        /* Destination node pulse when energy arrives */
        @keyframes nodeArrival {
          0% { transform: scale(1); }
          50% { transform: scale(1.15); }
          100% { transform: scale(1.1); }
        }

        /* Energy arrival burst effect */
        @keyframes energyArrival {
          0% {
            opacity: 0;
            transform: scale(0.5);
          }
          30% {
            opacity: 1;
            transform: scale(1.2);
          }
          100% {
            opacity: 0;
            transform: scale(2);
          }
        }

        /* Accessibility: Reduce motion */
        @media (prefers-reduced-motion: reduce) {
          .animate-fade-in-down,
          .will-animate {
            animation: none !important;
            transition: none !important;
          }
          /* Disable energy flow animations for reduced motion */
          [style*="energyFlow"],
          [style*="energyArrival"],
          [style*="nodeArrival"] {
            animation: none !important;
            opacity: 0 !important;
          }
        }
      `}</style>
    </div>
  )
}
