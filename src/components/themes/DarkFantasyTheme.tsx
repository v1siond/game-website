'use client'

import { useEffect, useState, useRef, useMemo, memo } from 'react'
import Link from 'next/link'
import { ProfessionSwitch, type ProfessionOption } from '@/components/cv/ProfessionSwitch'
import { useCVData, useWorldView } from '@/components/cv/CVDataProvider'
import { RecruiterHero, type HeroActionSlot } from '@/components/cv/RecruiterHero'
import { ProjectList, type ProjectSlot } from '@/components/cv/ProjectList'
import { BandList, type BandSlot } from '@/components/cv/BandList'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import type { Profession } from '@/lib/cv/professions'
import type { CVData, Job } from '@/lib/cv/content'
import type { ProfessionSections } from '@/lib/cv/cvView'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { SkipLink } from '@/components/themes/shared/AccessibilityStyles'
import { ProfessionStage } from '@/components/themes/shared/professionStage'
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

// Hollow Knight boss-arena depth, a gothic STAGE: a distant back wall with small,
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

        {/* CORNICE, wall/floor boundary (contrast) */}
        <rect x="0" y={HORIZON - 5} width="1920" height="9" fill={DF.stoneGrey} opacity="0.2" />
        <rect x="0" y={HORIZON + 4} width="1920" height="22" fill={DF.void} opacity="0.4" />

                {/* FLOOR, flat 2D side-view plane + foreground balustrade ledge (no perspective) */}
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
 * The path goes: Musician (25%,55%) ↔ System Engineer (50%,30%) ↔ Martial Artist (75%,55%),
 * the order the shared ProfessionSwitch lays the nodes out, with the engineer as the raised hub.
 *
 * When switching between the two outer nodes (Musician↔Martial Artist),
 * energy travels THROUGH the hub node (System Engineer).
 */

const WAYSTATION_POSITIONS: Record<Profession, { x: number; y: number }> = {
  drummer: { x: 25, y: 55 },
  engineer: { x: 50, y: 30 },
  fighter: { x: 75, y: 55 },
}

// Calculate the wire path segments between two professions
function getWirePath(from: Profession, to: Profession): Array<{ x: number; y: number }> {
  const throughHub = from !== 'engineer' && to !== 'engineer'
  return throughHub
    ? [WAYSTATION_POSITIONS[from], WAYSTATION_POSITIONS.engineer, WAYSTATION_POSITIONS[to]]
    : [WAYSTATION_POSITIONS[from], WAYSTATION_POSITIONS[to]]
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
}: {
  fromProfession: Profession | null
  toProfession: Profession
  isAnimating: boolean
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
  option,
  isReceivingEnergy,
}: {
  option: ProfessionOption
  isReceivingEnergy?: boolean
}) {
  const { id, label, selected: isActive, optionProps } = option
  const { icon, sublabel, color } = WAYSTATIONS[id]
  const position = WAYSTATION_POSITIONS[id]

  return (
    <button
      type="button"
      {...optionProps}
      className="absolute transform -translate-x-1/2 -translate-y-1/2 group min-w-[70px] md:min-w-[100px] min-h-[70px] md:min-h-[100px] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        ['--tw-ring-color' as string]: color,
        ['--tw-ring-offset-color' as string]: DF.void,
      }}
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
        className={`df-card bg-df-panel relative w-24 h-20 md:w-32 md:h-28 px-1 flex flex-col items-center justify-center transition-all duration-300 ${
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
          className="text-sm tracking-[0.05em] md:tracking-[0.1em] uppercase font-medium text-center leading-tight"
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

const WAYSTATIONS: Record<Profession, { icon: React.ReactNode; sublabel: string; color: string }> = {
  drummer: { icon: <WaveIcon />, sublabel: 'Drums', color: DF.lavender },
  engineer: { icon: <GearIcon />, sublabel: 'Software', color: DF.ethereal },
  fighter: { icon: <DiamondIcon />, sublabel: 'Muay Thai', color: DF.spiritGold },
}

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

const DF_FONT = '"Comic Sans MS", "Comic Sans", cursive'

// Tech stack display
const TechCloud = memo(function TechCloud({ categories }: { categories: CVData['techStack'] }) {
  return (
    <div className="space-y-6">
      {categories.map((category) => (
        <div key={category.id}>
          <h3
            className="text-sm tracking-[0.15em] mb-3 flex items-center gap-2 uppercase"
            style={{ color: DF.silver, fontFamily: DF_FONT }}
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

// Project card - his role, the years, the result and the links
const ProjectCard = memo(function ProjectCard({ slot: { project, years, links } }: { slot: ProjectSlot }) {
  return (
    <article
      className="h-full p-4 transition-transform hover:scale-[1.02] group"
      style={{
        background: `linear-gradient(135deg, ${DF.void}, ${DF.voidPurple})`,
        border: `1px solid ${project.featured ? DF.spiritGold : DF.stoneDark}`,
        borderRadius: '4px',
      }}
    >
      {project.featured && (
        <span className="text-sm tracking-[0.15em] uppercase" style={{ color: DF.spiritGold }}>
          <span aria-hidden="true">* </span>Featured
        </span>
      )}
      <h3 className="text-lg mt-1 transition-colors" style={{ color: DF.bone }}>
        {project.name}
      </h3>
      <p className="text-sm mt-1" style={{ color: DF.ethereal }}>
        {project.role}
        {years && <span aria-hidden="true"> | </span>}
        {years}
      </p>
      <p className="text-sm mt-2" style={{ color: DF.silver }}>{project.tagline}</p>
      {project.impact && (
        <p className="text-sm mt-2 italic" style={{ color: DF.bone }}>
          <span aria-hidden="true">- </span>
          <span className="sr-only">Impact: </span>{project.impact}
        </p>
      )}
      <div className="flex flex-wrap gap-1 mt-3" aria-label="Technologies used">
        {project.techStack.map((tech) => (
          <span key={tech} className="text-sm px-1 py-0.5" style={{ background: `${DF.ethereal}12`, color: DF.silver }}>
            {tech}
          </span>
        ))}
      </div>
      {links.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {links.map(({ kind, label, linkProps }) => (
            <a
              key={kind}
              {...linkProps}
              className="inline-flex items-center min-h-[44px] px-3 text-sm tracking-[0.1em] uppercase transition-all hover:scale-105 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8c841] border border-[#41c8e8] text-[#41c8e8] bg-[#41c8e8]/10"
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </article>
  )
})

// Company card
const CompanyCard = memo(function CompanyCard({ company }: { company: CVData['companies'][number] }) {
  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 transition-transform hover:scale-[1.02] group min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8c841] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f0a1a]"
      style={{
        background: `linear-gradient(135deg, ${DF.void}, ${DF.voidPurple})`,
        border: `1px solid ${DF.stoneDark}`,
        borderRadius: '4px',
      }}
      aria-label={`${company.name}, ${company.tagline} (opens in a new tab)`}
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl" aria-hidden="true">{company.icon}</span>
        <div>
          <h3 className="text-lg transition-colors" style={{ color: DF.bone }}>
            {company.name}
          </h3>
          <p className="text-sm" style={{ color: DF.spiritGold }}>{company.tagline}</p>
        </div>
      </div>
      <p className="text-sm" style={{ color: DF.silver }}>{company.description}</p>
    </a>
  )
})

// Band card
const BandCard = memo(function BandCard({ band, years, linkProps }: BandSlot) {
  const content = (
    <article
      className="h-full p-4 transition-transform hover:scale-[1.02] group"
      style={{
        background: `linear-gradient(135deg, ${DF.void}, ${DF.voidDeep})`,
        border: `1px solid ${DF.lavender}60`,
        borderRadius: '4px',
      }}
    >
      <h3 className="text-lg transition-colors" style={{ color: DF.bone }}>
        {band.name}
      </h3>
      <p className="text-sm mt-1" style={{ color: DF.lavender }}>
        {band.role}
        {years && <span aria-hidden="true"> | </span>}
        {years}
      </p>
      {band.release && (
        <p className="text-sm mt-2" style={{ color: DF.silver }}>
          Released <cite>&ldquo;{band.release}&rdquo;</cite>
        </p>
      )}
    </article>
  )

  if (!linkProps) return content
  return (
    <a
      {...linkProps}
      className="block h-full min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b7a9d9] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f0a1a]"
    >
      {content}
    </a>
  )
})

// Work experience card. Dates are date only strings (UTC midnight), so the year is read in UTC: a
// January start keeps its own year west of UTC.
const ExperienceCard = memo(function ExperienceCard({ entry, isLast }: { entry: Job; isLast?: boolean }) {
  const endDisplay = entry.endDate ? entry.endDate.getUTCFullYear() : 'Present'
  const startDisplay = entry.startDate.getUTCFullYear()

  return (
    <article className="py-4">
      <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
        <div>
          <h3 className="text-lg font-medium" style={{ color: DF.bone }}>{entry.title}</h3>
          <p className="text-sm" style={{ color: DF.ethereal }}>{entry.company}</p>
        </div>
        <span
          className="text-sm"
          style={{ color: DF.spiritGold }}
        >
          <time>{startDisplay}</time> - <time>{endDisplay}</time>
        </span>
      </div>
      {entry.description && <p className="text-sm mb-2" style={{ color: DF.silver }}>{entry.description}</p>}
      {entry.highlights.length > 0 && (
        <ul className="space-y-1" aria-label="Key achievements">
          {entry.highlights.map((highlight) => (
            <li key={highlight} className="text-sm flex items-start gap-2" style={{ color: DF.bone }}>
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

// Profession sections. Each animated section gets its own trigger based on ACTUAL element position.
const SECTION_TRIGGER = { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }

const DF_BUTTON =
  'inline-flex items-center justify-center px-6 py-3 text-sm tracking-[0.15em] uppercase transition-all hover:scale-105 min-h-[44px] rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8c841] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f0a1a]'

// Email is the brass action, LinkedIn the outlined one.
const HERO_ACTION_LOOK: Record<HeroActionSlot['id'], string> = {
  email: 'bg-[#b08d57] text-[#0f0a1a]',
  linkedin: 'bg-transparent border-2 border-[#b08d57] text-[#b08d57]',
}

function HeroActions({ actions }: { actions: HeroActionSlot[] }) {
  return (
    <>
      {actions.map((action) => (
        <a key={action.id} {...action.linkProps} className={`${DF_BUTTON} ${HERO_ACTION_LOOK[action.id]}`}>
          {action.label}
        </a>
      ))}
    </>
  )
}

function FramedSection({ title, delay, children }: { title: string; delay?: number; children: React.ReactNode }) {
  return (
    <FadeInSection delay={delay}>
      <section className="relative z-20 py-6 md:py-8 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <VoidFrame title={title}>{children}</VoidFrame>
        </div>
      </section>
    </FadeInSection>
  )
}

// Knight Slash Reveal: the knight cuts in and the frame slides from the right.
function SlashRevealSection({ title, children }: { title: string; children: React.ReactNode }) {
  const trigger = useSectionTrigger(SECTION_TRIGGER)

  return (
    <div ref={trigger.ref}>
      <KnightSlashReveal triggered={trigger.triggered}>
        <section className="relative z-20 py-8 px-6">
          <div className="max-w-4xl mx-auto">
            <VoidFrame title={title}>{children}</VoidFrame>
          </div>
        </section>
      </KnightSlashReveal>
    </div>
  )
}

type SectionsOf<Id extends Profession> = Extract<ProfessionSections, { profession: Id }>

function EngineerSections({ sections }: { sections: SectionsOf<'engineer'> }) {
  const { professionalSummary } = useCVData()
  const projectsTrigger = useSectionTrigger(SECTION_TRIGGER)
  const { jobs, techStack, projects, companies } = sections

  return (
    <>
      <FramedSection title="About" delay={100}>
        <p className="leading-relaxed" style={{ color: DF.bone }}>{professionalSummary.bio}</p>
      </FramedSection>

      {/* Art Section 1 - Spirits and Gears */}
      <FadeInSection delay={150}>
        <ArtSectionSpirits />
      </FadeInSection>

      {/* Work Experience - Knight Slash Reveal (content slides from right) */}
      {jobs.length > 0 && (
        <SlashRevealSection title="Work Experience">
          <div>
            {jobs.map((entry, index) => (
              <ExperienceCard key={entry.id} entry={entry} isLast={index === jobs.length - 1} />
            ))}
          </div>
        </SlashRevealSection>
      )}

      {/* Art Section 2 - Lanterns */}
      <FadeInSection>
        <ArtSectionLanterns />
      </FadeInSection>

      <FramedSection title="Tech Stack">
        <TechCloud categories={techStack} />
      </FramedSection>

      {/* Projects - Bug Pull Reveal */}
      <div ref={projectsTrigger.ref}>
        <BugPullReveal triggered={projectsTrigger.triggered}>
          <section className="relative z-20 py-6 md:py-8 px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <VoidFrame title="Projects">
                <ProjectList
                  projects={projects}
                  className="grid md:grid-cols-2 gap-3 md:gap-4"
                  renderProject={(slot) => <ProjectCard slot={slot} />}
                />
              </VoidFrame>
            </div>
          </section>
        </BugPullReveal>
      </div>

      {/* Art Section 3 - Crystals */}
      <FadeInSection>
        <ArtSectionCrystals />
      </FadeInSection>

      <FramedSection title="Ventures">
        <div className="grid md:grid-cols-3 gap-3 md:gap-4">
          {companies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      </FramedSection>
    </>
  )
}

function MusicianSections({ sections }: { sections: SectionsOf<'drummer'> }) {
  const { musician, bands } = sections

  return (
    <>
      <FadeInSection delay={150}>
        <ArtSectionSpirits />
      </FadeInSection>

      <SlashRevealSection title="Bands">
        <p className="text-sm mb-4 text-center" style={{ color: DF.bone }}>
          Drums since {musician.since}, {musician.yearsPlaying} years
        </p>
        <BandList bands={bands} className="grid md:grid-cols-3 gap-3 md:gap-4" renderBand={(slot) => <BandCard {...slot} />} />
        <p className="text-sm mt-4 italic text-center" style={{ color: DF.lavender }}>{musician.line}</p>
      </SlashRevealSection>

      <FadeInSection>
        <ArtSectionLanterns />
      </FadeInSection>
    </>
  )
}

function MartialArtistSections({ sections }: { sections: SectionsOf<'fighter'> }) {
  const { martialArts } = sections

  return (
    <>
      <FadeInSection delay={150}>
        <ArtSectionSpirits />
      </FadeInSection>

      <SlashRevealSection title="Muay Thai">
        <h3 className="text-lg font-medium mb-4" style={{ color: DF.bone }}>{martialArts.primary.title}</h3>
        <MuayThaiRecord
          martialArts={martialArts}
          classNames={{
            facts: 'grid sm:grid-cols-2 gap-3 mb-4',
            fact: 'p-3 rounded bg-gradient-to-br from-[#0f0a1a] to-[#150f25] border border-[#333333]',
            term: 'text-sm tracking-[0.15em] uppercase text-[#e8c841]',
            value: 'text-sm mt-1 text-[#e8e4dc]',
            achievements: 'space-y-1',
            achievement: 'text-sm flex items-start gap-2 text-[#e8e4dc]',
          }}
          renderAchievement={(achievement) => (
            <>
              <span className="text-[#e8c841]" aria-hidden="true">*</span>
              {achievement}
            </>
          )}
        />
      </SlashRevealSection>

      <FadeInSection>
        <ArtSectionCrystals />
      </FadeInSection>
    </>
  )
}

function ProfessionSectionsView({ sections }: { sections: ProfessionSections }) {
  if (sections.profession === 'drummer') return <MusicianSections sections={sections} />
  if (sections.profession === 'fighter') return <MartialArtistSections sections={sections} />
  return <EngineerSections sections={sections} />
}


export default function DarkFantasyTheme() {
  const view = useWorldView()
  const active = view.profession
  const [mounted, setMounted] = useState(false)

  // Track previous profession for energy flow animation
  const previousProfession = useRef<Profession>(active)
  const [isEnergyFlowing, setIsEnergyFlowing] = useState(false)
  const [animatingFrom, setAnimatingFrom] = useState<Profession | null>(null)

  // On a profession change, run the energy along the wire from the old node to the new one
  useEffect(() => {
    const from = previousProfession.current
    previousProfession.current = active
    if (from === active) return

    setAnimatingFrom(from)
    setIsEnergyFlowing(true)

    // Clear animation state after animation completes
    const timer = setTimeout(() => {
      setIsEnergyFlowing(false)
      setAnimatingFrom(null)
    }, 500)
    return () => clearTimeout(timer)
  }, [active])

  // fire the final battle just slightly before it's centered (small positive bottom margin), // a touch later than the previous +18% which kicked off before you'd even seen the section
  const contactTrigger = useSectionTrigger({ threshold: 0.1, rootMargin: '0px 0px 5% 0px' })

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
      <ProfessionStage profession={active} p={DF} />

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
        aria-label="Primary navigation"
      >
        <div className="max-w-6xl mx-auto flex justify-between items-center gap-2 md:gap-4">
          {/* Name - compact on mobile */}
          <Link href="/" className="flex items-center gap-2 md:gap-3 group">
            <div aria-hidden="true" className="hidden sm:block">
              <SpiritWisp size={32} color={DF.spiritGold} />
            </div>
            <span
              className="text-sm md:text-lg tracking-[0.15em] md:tracking-[0.2em] font-normal uppercase whitespace-nowrap"
              style={{
                color: DF.bone,
                textShadow: `0 0 20px ${DF.ethereal}30`,
              }}
            >
              {view.hero.name}
            </span>
          </Link>

          {/* Nav Links */}
          <div className="flex gap-2 md:gap-3 items-center">
            <Link
              href="/cv"
              className="px-2 md:px-3 py-1.5 md:py-2 min-h-[44px] text-sm tracking-[0.1em] uppercase transition-all hover:scale-105 flex items-center rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8c841] border border-[#333333] text-[#a0a0a0] bg-[#0f0a1a]/80"
            >
              CV
            </Link>
            <Link
              href="/personal-projects/game-engine"
              className="px-2 md:px-3 py-1.5 md:py-2 min-h-[44px] text-sm tracking-[0.1em] uppercase transition-all hover:scale-105 flex items-center rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8c841] border border-[#41c8e8] text-[#41c8e8] bg-[#41c8e8]/10"
            >
              <span className="hidden sm:inline">Nebulith</span>
              <span className="sm:hidden">Game</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - below fixed nav, the recruiter first screen */}
      <header className="relative z-20 pt-20 md:pt-24 pb-6 px-4 md:px-6">
        <RecruiterHero
          render={({ name, headline, tagline, line, actions }) => (
            <div className="max-w-4xl mx-auto text-center">
              <h1
                className="text-2xl md:text-4xl tracking-[0.15em] uppercase mb-3"
                style={{ color: DF.bone, textShadow: `0 0 20px ${DF.ethereal}30` }}
              >
                {name}
              </h1>
              <p className="text-sm md:text-lg tracking-wider mb-2" style={{ color: DF.silver }}>
                {headline}
              </p>
              <p
                className="text-sm tracking-wider italic"
                style={{ color: DF.spiritGold, textShadow: `0 0 10px ${DF.spiritGold}40` }}
              >
                {tagline}
              </p>
              <p className="text-sm mt-2" style={{ color: DF.bone }}>{line}</p>
              <div className="flex flex-wrap gap-3 justify-center mt-4">
                <HeroActions actions={actions} />
              </div>
            </div>
          )}
        />
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
                borderRadius: '4px',
              }}
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
                <line x1="25%" y1="55%" x2="50%" y2="30%" stroke="url(#pathGrad)" strokeWidth="1" strokeDasharray="6 4" />
                <line x1="50%" y1="30%" x2="75%" y2="55%" stroke="url(#pathGrad)" strokeWidth="1" strokeDasharray="6 4" />
                {/* Gear decorations at intersections */}
                <circle cx="37.5%" cy="42.5%" r="3" fill={DF.copper} opacity="0.3" />
                <circle cx="62.5%" cy="42.5%" r="3" fill={DF.copper} opacity="0.3" />
              </svg>

              {/* Energy flow animation between nodes */}
              <EnergyFlowAnimation
                fromProfession={animatingFrom}
                toProfession={active}
                isAnimating={isEnergyFlowing}
              />

              <ProfessionSwitch
                className="absolute inset-0"
                label="Profession selector"
                renderOption={(option) => (
                  <WaystationNode option={option} isReceivingEnergy={isEnergyFlowing && option.selected} />
                )}
              />
            </div>
          </div>
        </section>
      </FadeInSection>

      <ProfessionSectionsView sections={view.sections} />

      </main>

      {/* Contact CTA - Battle Reveal (knight kills bug, content drops from top) */}
      <div ref={contactTrigger.ref}>
        <BattleReveal triggered={contactTrigger.triggered}>
        <section className="relative z-20 py-16 px-6" aria-label="Contact">
          <RecruiterHero
            render={({ line, actions }) => (
              <div className="max-w-2xl mx-auto text-center">
                <div className="mb-8">
                  <h2 className="text-xl tracking-[0.15em] mb-3" style={{ color: DF.brass, fontFamily: DF_FONT }}>
                    Get In Touch
                  </h2>
                  <p className="text-sm" style={{ color: DF.silver }}>{line}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <HeroActions actions={actions} />
                  <Link href="/cv" className={`${DF_BUTTON} bg-transparent border-2 border-[#b08d57] text-[#b08d57]`}>
                    Download CV
                  </Link>
                </div>
              </div>
            )}
          />
        </section>
        </BattleReveal>
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
          <span className="text-sm tracking-[0.2em]" style={{ fontFamily: DF_FONT }}>
            <span className="sr-only">Copyright </span>© {new Date().getFullYear()} {view.hero.name}
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
