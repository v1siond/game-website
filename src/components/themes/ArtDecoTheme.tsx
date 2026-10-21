'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useProfession } from '@/contexts/ProfessionContext'
import { ProfessionSwitch, type ProfessionOption } from '@/components/cv/ProfessionSwitch'
import { useCVData, useWorldView } from '@/components/cv/CVDataProvider'
import { RecruiterHero, type HeroActionSlot } from '@/components/cv/RecruiterHero'
import { ProjectList, type ProjectSlot } from '@/components/cv/ProjectList'
import { BandList, type BandSlot } from '@/components/cv/BandList'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import type { Profession } from '@/lib/cv/professions'
import type { CVData, Job } from '@/lib/cv/content'
import type { ProfessionSections } from '@/lib/cv/cvView'

// ============================================================================
// BIOSHOCK RAPTURE COLOR PALETTE
// ============================================================================
const RAPTURE_COLORS = {
  // Deep Sea Blues
  deepSea: '#0A2540',
  deepSeaMid: '#0D3050',
  deepSeaDark: '#102030',
  abyss: '#05101a',

  // Teal/Cyan Water
  tealDark: '#006666',
  tealMid: '#008888',
  tealLight: '#00AAAA',
  waterGlow: '#41c8e8',

  // Brass/Gold (Art Deco)
  brassDark: '#8B7320',
  brassMid: '#B8860B',
  gold: '#D4AF37',
  goldBright: '#F0C850',
  goldPure: '#FFD700',

  // Bronze
  bronzeDark: '#8B4513',
  bronze: '#CD7F32',

  // Neon Signs
  neonPink: '#FF0066',
  neonGreen: '#00FF00',
  neonYellow: '#FFFF00',

  // Blood Red (Splicer/ADAM)
  bloodDark: '#660000',
  blood: '#8B0000',
  adamRed: '#ff6b6b',

  // Cream/Ivory (Art Deco accents) - WCAG AA compliant on deep sea backgrounds
  ivory: '#FFFFF0',
  cream: '#FAF0E6',
  parchment: '#e8e0d0',    // contrast ~16:1 on deepSea - passes AA
  warmWhite: '#d0c8b8',    // improved from #c0b0a0 for better contrast (~12:1)
}

// ============================================================================
// HOOKS
// ============================================================================
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


// ============================================================================
// SVG DEFINITIONS COMPONENT - Shared gradients and patterns
// ============================================================================
function RaptureSVGDefs() {
  return (
    <svg className="absolute w-0 h-0" aria-hidden="true">
      <defs>
        {/* Brass/Gold Gradient */}
        <linearGradient id="brass-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={RAPTURE_COLORS.goldBright} />
          <stop offset="50%" stopColor={RAPTURE_COLORS.gold} />
          <stop offset="100%" stopColor={RAPTURE_COLORS.brassDark} />
        </linearGradient>

        {/* Bronze Gradient */}
        <linearGradient id="bronze-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={RAPTURE_COLORS.bronze} />
          <stop offset="100%" stopColor={RAPTURE_COLORS.bronzeDark} />
        </linearGradient>

        {/* Deep Sea Gradient */}
        <linearGradient id="deepsea-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={RAPTURE_COLORS.deepSeaMid} />
          <stop offset="100%" stopColor={RAPTURE_COLORS.abyss} />
        </linearGradient>

        {/* Porthole Glow */}
        <radialGradient id="porthole-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={RAPTURE_COLORS.goldBright} stopOpacity="0.8" />
          <stop offset="60%" stopColor={RAPTURE_COLORS.gold} stopOpacity="0.3" />
          <stop offset="100%" stopColor={RAPTURE_COLORS.gold} stopOpacity="0" />
        </radialGradient>

        {/* ADAM Glow */}
        <radialGradient id="adam-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={RAPTURE_COLORS.adamRed} stopOpacity="0.8" />
          <stop offset="100%" stopColor={RAPTURE_COLORS.bloodDark} stopOpacity="0" />
        </radialGradient>

        {/* Neon Pink Glow */}
        <radialGradient id="neon-pink-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={RAPTURE_COLORS.neonPink} stopOpacity="0.6" />
          <stop offset="100%" stopColor={RAPTURE_COLORS.neonPink} stopOpacity="0" />
        </radialGradient>

        {/* Water Caustic Pattern */}
        <pattern id="caustic-pattern" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
          <ellipse cx="50" cy="50" rx="40" ry="25" fill={RAPTURE_COLORS.waterGlow} opacity="0.03" />
          <ellipse cx="150" cy="100" rx="30" ry="20" fill={RAPTURE_COLORS.tealLight} opacity="0.02" />
          <ellipse cx="100" cy="170" rx="50" ry="30" fill={RAPTURE_COLORS.waterGlow} opacity="0.025" />
        </pattern>

        {/* Art Deco Diamond Pattern */}
        <pattern id="deco-diamonds" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
          <path d="M40 0 L80 40 L40 80 L0 40 Z" fill="none" stroke={RAPTURE_COLORS.gold} strokeWidth="0.5" opacity="0.1" />
          <circle cx="40" cy="40" r="12" fill="none" stroke={RAPTURE_COLORS.gold} strokeWidth="0.3" opacity="0.08" />
          <path d="M40 20 L40 28 M40 52 L40 60 M20 40 L28 40 M52 40 L60 40" stroke={RAPTURE_COLORS.gold} strokeWidth="0.3" opacity="0.06" />
        </pattern>

        {/* Art Deco Sunburst Pattern */}
        <pattern id="deco-sunburst" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
          <circle cx="60" cy="60" r="20" fill="none" stroke={RAPTURE_COLORS.gold} strokeWidth="0.3" opacity="0.05" />
          <circle cx="60" cy="60" r="35" fill="none" stroke={RAPTURE_COLORS.gold} strokeWidth="0.2" opacity="0.04" />
          {[0, 30, 60, 90, 120, 150].map((angle) => (
            <line
              key={angle}
              x1="60"
              y1="60"
              x2={60 + Math.cos(angle * Math.PI / 180) * 55}
              y2={60 + Math.sin(angle * Math.PI / 180) * 55}
              stroke={RAPTURE_COLORS.gold}
              strokeWidth="0.2"
              opacity="0.04"
            />
          ))}
        </pattern>

        {/* Pressure Crack Pattern */}
        <pattern id="pressure-cracks" x="0" y="0" width="300" height="300" patternUnits="userSpaceOnUse">
          <path d="M0,50 Q30,45 50,55 T100,48" fill="none" stroke={RAPTURE_COLORS.waterGlow} strokeWidth="0.3" opacity="0.06" />
          <path d="M200,100 Q220,105 250,95 T290,102" fill="none" stroke={RAPTURE_COLORS.tealLight} strokeWidth="0.2" opacity="0.05" />
          <path d="M50,250 Q80,248 110,255" fill="none" stroke={RAPTURE_COLORS.waterGlow} strokeWidth="0.3" opacity="0.04" />
        </pattern>

        {/* Rivet Pattern for frames */}
        <pattern id="rivet-border" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
          <circle cx="15" cy="15" r="2" fill={RAPTURE_COLORS.gold} opacity="0.4" />
        </pattern>
      </defs>
    </svg>
  )
}

// ============================================================================
// BIG DADDY SILHOUETTE - Iconic Rapture protector
// ============================================================================
function BigDaddySilhouette({ reducedMotion = false }: { reducedMotion?: boolean }) {
  return (
    <div
      className="fixed bottom-0 right-0 pointer-events-none z-[6]"
      style={{ opacity: 0.08 }}
      aria-hidden="true"
    >
      <svg
        width="350"
        height="450"
        viewBox="0 0 350 450"
        className="transform translate-x-1/4 translate-y-1/6"
      >
        {/* Diving Helmet - Spherical with porthole */}
        <ellipse cx="175" cy="90" rx="70" ry="80" fill="url(#brass-gradient)" opacity="0.6" />

        {/* Helmet Porthole Ring */}
        <circle cx="175" cy="85" r="38" fill="none" stroke={RAPTURE_COLORS.gold} strokeWidth="6" opacity="0.7" />
        <circle cx="175" cy="85" r="35" fill={RAPTURE_COLORS.deepSea} opacity="0.8" />
        <circle cx="175" cy="85" r="32" fill="url(#porthole-glow)" />

        {/* Porthole Glint */}
        <ellipse cx="165" cy="75" rx="8" ry="5" fill={RAPTURE_COLORS.goldBright} opacity="0.3" />

        {/* Helmet Rivets - Circular arrangement */}
        {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((angle) => (
          <circle
            key={angle}
            cx={175 + Math.cos(angle * Math.PI / 180) * 58}
            cy={90 + Math.sin(angle * Math.PI / 180) * 65}
            r="4"
            fill={RAPTURE_COLORS.gold}
            opacity="0.5"
          />
        ))}

        {/* Helmet Air Tubes */}
        <path d="M120 60 Q100 40 80 50 Q60 60 55 80" stroke={RAPTURE_COLORS.bronze} strokeWidth="8" fill="none" opacity="0.4" />
        <path d="M230 60 Q250 40 270 50 Q290 60 295 80" stroke={RAPTURE_COLORS.bronze} strokeWidth="8" fill="none" opacity="0.4" />

        {/* Body/Diving Suit */}
        <path
          d="M100 160 Q65 220 75 340 L115 430 L235 430 L275 340 Q285 220 250 160 Q210 135 175 135 Q140 135 100 160"
          fill="url(#brass-gradient)"
          opacity="0.5"
        />

        {/* Suit Plate Lines */}
        <path d="M120 200 L120 350" stroke={RAPTURE_COLORS.brassDark} strokeWidth="2" opacity="0.3" />
        <path d="M230 200 L230 350" stroke={RAPTURE_COLORS.brassDark} strokeWidth="2" opacity="0.3" />
        <path d="M100 250 L250 250" stroke={RAPTURE_COLORS.brassDark} strokeWidth="1" opacity="0.2" />
        <path d="M100 320 L250 320" stroke={RAPTURE_COLORS.brassDark} strokeWidth="1" opacity="0.2" />

        {/* Left Arm */}
        <path
          d="M100 180 L60 240 L50 260 L70 280 L90 250 L100 220"
          fill={RAPTURE_COLORS.bronze}
          opacity="0.4"
        />

        {/* DRILL ARM - Right side */}
        <g className={reducedMotion ? '' : 'animate-drill-idle'}>
          {/* Arm base */}
          <path
            d="M250 180 L290 230 L320 240"
            stroke={RAPTURE_COLORS.bronze}
            strokeWidth="20"
            fill="none"
            opacity="0.5"
            strokeLinecap="round"
          />
          {/* Drill body */}
          <ellipse cx="335" cy="245" rx="20" ry="12" fill={RAPTURE_COLORS.bronze} opacity="0.6" />
          {/* Drill point */}
          <polygon points="355,245 395,245 375,280" fill={RAPTURE_COLORS.gold} opacity="0.5" />
          {/* Drill spiral grooves */}
          <path d="M358 242 L375 260 M362 248 L378 265 M366 252 L380 268" stroke={RAPTURE_COLORS.brassDark} strokeWidth="1.5" opacity="0.3" />
        </g>

        {/* Tank on Back */}
        <ellipse cx="175" cy="230" rx="25" ry="60" fill={RAPTURE_COLORS.bronze} opacity="0.3" />
        <ellipse cx="175" cy="230" rx="20" ry="55" fill="none" stroke={RAPTURE_COLORS.gold} strokeWidth="1" opacity="0.3" />

        {/* Chest Light/Gauge */}
        <circle cx="175" cy="200" r="15" fill={RAPTURE_COLORS.deepSea} opacity="0.8" />
        <circle cx="175" cy="200" r="12" fill="url(#porthole-glow)" opacity="0.6" />
        <circle cx="175" cy="200" r="15" fill="none" stroke={RAPTURE_COLORS.gold} strokeWidth="2" opacity="0.5" />
      </svg>
    </div>
  )
}

// ============================================================================
// LITTLE SISTER SILHOUETTE - ADAM Harvester
// ============================================================================
function LittleSisterSilhouette({ reducedMotion = false }: { reducedMotion?: boolean }) {
  return (
    <div
      className="fixed bottom-0 left-0 pointer-events-none z-[6] transform -translate-x-1/4"
      style={{ opacity: 0.07 }}
      aria-hidden="true"
    >
      <svg width="180" height="300" viewBox="0 0 180 300">
        {/* Head */}
        <circle cx="90" cy="50" r="30" fill={RAPTURE_COLORS.gold} opacity="0.4" />

        {/* Hair Buns - Iconic Little Sister style */}
        <circle cx="65" cy="30" r="15" fill={RAPTURE_COLORS.bronzeDark} opacity="0.5" />
        <circle cx="115" cy="30" r="15" fill={RAPTURE_COLORS.bronzeDark} opacity="0.5" />

        {/* Glowing Eyes - ADAM infused */}
        <circle
          cx="80"
          cy="48"
          r="6"
          fill={RAPTURE_COLORS.goldBright}
          opacity="0.8"
          className={reducedMotion ? '' : 'animate-pulse'}
        />
        <circle
          cx="100"
          cy="48"
          r="6"
          fill={RAPTURE_COLORS.goldBright}
          opacity="0.8"
          className={reducedMotion ? '' : 'animate-pulse'}
        />

        {/* Simple Dress */}
        <path
          d="M65 75 Q50 120 55 180 L35 280 L55 285 L75 200 L90 280 L105 200 L125 285 L145 280 L125 180 Q130 120 115 75 Z"
          fill={RAPTURE_COLORS.gold}
          opacity="0.35"
        />

        {/* Dress Pattern - Simple lines */}
        <path d="M70 100 L110 100" stroke={RAPTURE_COLORS.brassDark} strokeWidth="1" opacity="0.2" />
        <path d="M65 140 L115 140" stroke={RAPTURE_COLORS.brassDark} strokeWidth="1" opacity="0.2" />

        {/* ADAM Syringe */}
        <g transform="translate(125, 90) rotate(25)">
          {/* Syringe Body */}
          <rect x="0" y="-5" width="50" height="10" fill={RAPTURE_COLORS.bronze} opacity="0.5" />
          {/* Needle */}
          <line x1="50" y1="0" x2="70" y2="0" stroke={RAPTURE_COLORS.gold} strokeWidth="2" opacity="0.4" />
          {/* ADAM Container - Glowing Red */}
          <circle cx="20" cy="0" r="12" fill="url(#adam-glow)" />
          <circle cx="20" cy="0" r="8" fill={RAPTURE_COLORS.adamRed} opacity="0.6" />
          {/* Plunger */}
          <rect x="-15" y="-3" width="15" height="6" fill={RAPTURE_COLORS.gold} opacity="0.3" />
        </g>
      </svg>
    </div>
  )
}

// ============================================================================
// SPLICER MASKS - Rapture's Masquerade
// ============================================================================
function SplicerMasks({ reducedMotion = false }: { reducedMotion?: boolean }) {
  const masks = [
    { x: 3, y: 12, rotation: -20, scale: 0.7, type: 'butterfly' },
    { x: 94, y: 18, rotation: 15, scale: 0.55, type: 'cat' },
    { x: 5, y: 75, rotation: -8, scale: 0.5, type: 'rabbit' },
    { x: 92, y: 82, rotation: 12, scale: 0.6, type: 'bird' },
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
            animationDelay: `${i * 2.5}s`,
            animationDuration: `${10 + i * 2}s`,
          }}
        >
          <svg width="100" height="80" viewBox="0 0 100 80" opacity="0.1">
            {/* Base Masquerade Mask Shape */}
            <path
              d="M50 15 Q15 25 5 45 Q15 65 50 70 Q85 65 95 45 Q85 25 50 15"
              fill="none"
              stroke={RAPTURE_COLORS.gold}
              strokeWidth="2"
            />

            {/* Eye Holes with Art Deco Styling */}
            <ellipse cx="30" cy="40" rx="12" ry="10" fill="none" stroke={RAPTURE_COLORS.gold} strokeWidth="1.5" />
            <ellipse cx="70" cy="40" rx="12" ry="10" fill="none" stroke={RAPTURE_COLORS.gold} strokeWidth="1.5" />

            {/* Decorative Eyebrow Arches */}
            <path d="M20 30 Q30 22 42 30" fill="none" stroke={RAPTURE_COLORS.gold} strokeWidth="1" opacity="0.7" />
            <path d="M58 30 Q70 22 80 30" fill="none" stroke={RAPTURE_COLORS.gold} strokeWidth="1" opacity="0.7" />

            {/* Art Deco Top Feathers/Ornaments */}
            <path d="M50 15 L50 0 L45 -5 M50 0 L55 -5" stroke={RAPTURE_COLORS.gold} strokeWidth="1" fill="none" />
            <path d="M35 20 L28 5 L25 0" stroke={RAPTURE_COLORS.gold} strokeWidth="0.8" fill="none" />
            <path d="M65 20 L72 5 L75 0" stroke={RAPTURE_COLORS.gold} strokeWidth="0.8" fill="none" />

            {/* Side Decorations */}
            <circle cx="5" cy="45" r="3" fill={RAPTURE_COLORS.gold} opacity="0.5" />
            <circle cx="95" cy="45" r="3" fill={RAPTURE_COLORS.gold} opacity="0.5" />

            {/* Nose Bridge Art Deco Detail */}
            <path d="M50 35 L50 50" stroke={RAPTURE_COLORS.gold} strokeWidth="0.5" opacity="0.5" />
            <path d="M45 45 L50 50 L55 45" fill="none" stroke={RAPTURE_COLORS.gold} strokeWidth="0.5" opacity="0.5" />
          </svg>
        </div>
      ))}
    </div>
  )
}

// ============================================================================
// UNDERWATER BUBBLES - Rising from the deep
// ============================================================================
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
    const count = reducedMotion ? 10 : 30
    const newBubbles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 10 + 4,
      duration: Math.random() * 10 + 12,
      delay: Math.random() * 20,
      wobble: Math.random() * 40 + 15,
    }))
    setBubbles(newBubbles)
  }, [reducedMotion])

  if (reducedMotion) {
    return (
      <div className="fixed inset-0 pointer-events-none z-[3] overflow-hidden" aria-hidden="true">
        {bubbles.map((b) => (
          <div
            key={b.id}
            className="absolute rounded-full"
            style={{
              left: `${b.x}%`,
              top: `${15 + (b.id * 8) % 70}%`,
              width: b.size,
              height: b.size,
              background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.35), ${RAPTURE_COLORS.waterGlow}20)`,
              border: `1px solid rgba(255,255,255,0.15)`,
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
            bottom: '-30px',
            width: b.size,
            height: b.size,
            background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.5), ${RAPTURE_COLORS.waterGlow}15)`,
            border: `1px solid rgba(255,255,255,0.25)`,
            animationDuration: `${b.duration}s`,
            animationDelay: `${b.delay}s`,
            ['--wobble' as string]: `${b.wobble}px`,
          }}
        />
      ))}
    </div>
  )
}

// ============================================================================
// WATER CAUSTICS - Light refracting through Rapture's dome
// ============================================================================
function WaterCaustics({ reducedMotion = false }: { reducedMotion?: boolean }) {
  return (
    <div className="fixed inset-0 pointer-events-none z-[2] overflow-hidden" aria-hidden="true">
      {/* Primary caustic layer */}
      <div
        className={reducedMotion ? '' : 'animate-caustics-1'}
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.15,
          background: `
            radial-gradient(ellipse 40% 30% at 15% 20%, ${RAPTURE_COLORS.waterGlow}40 0%, transparent 60%),
            radial-gradient(ellipse 35% 25% at 85% 75%, ${RAPTURE_COLORS.tealLight}30 0%, transparent 50%),
            radial-gradient(ellipse 50% 40% at 50% 50%, ${RAPTURE_COLORS.gold}15 0%, transparent 70%)
          `,
        }}
      />
      {/* Secondary caustic layer - offset timing */}
      <div
        className={reducedMotion ? '' : 'animate-caustics-2'}
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.12,
          background: `
            radial-gradient(ellipse 30% 40% at 75% 25%, ${RAPTURE_COLORS.waterGlow}35 0%, transparent 55%),
            radial-gradient(ellipse 45% 35% at 25% 80%, ${RAPTURE_COLORS.tealMid}25 0%, transparent 60%)
          `,
        }}
      />
    </div>
  )
}

// ============================================================================
// UNDERWATER LIGHT RAYS - Volumetric lighting through glass
// ============================================================================
function UnderwaterRays({ reducedMotion = false }: { reducedMotion?: boolean }) {
  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden" aria-hidden="true">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className={reducedMotion ? '' : 'animate-light-ray'}
          style={{
            position: 'absolute',
            top: 0,
            left: `${5 + i * 18}%`,
            width: '180px',
            height: '100%',
            background: `linear-gradient(180deg, ${RAPTURE_COLORS.gold}15, transparent 65%)`,
            transform: `rotate(${-20 + i * 7}deg)`,
            transformOrigin: 'top center',
            animationDelay: `${i * 0.8}s`,
            animationDuration: `${5 + i * 0.5}s`,
            opacity: reducedMotion ? 0.06 : undefined,
          }}
        />
      ))}
    </div>
  )
}

// ============================================================================
// LIGHTHOUSE BEACON - Distant Rapture landmark
// ============================================================================
function LighthouseBeacon({ reducedMotion = false }: { reducedMotion?: boolean }) {
  return (
    <div
      className="fixed top-8 left-1/2 transform -translate-x-1/2 pointer-events-none z-[4]"
      style={{ opacity: 0.15 }}
      aria-hidden="true"
    >
      <svg width="60" height="100" viewBox="0 0 60 100">
        {/* Lighthouse Tower */}
        <path d="M20 100 L15 50 L45 50 L40 100" fill={RAPTURE_COLORS.gold} opacity="0.5" />

        {/* Tower Stripes */}
        <path d="M17 70 L43 70" stroke={RAPTURE_COLORS.bronzeDark} strokeWidth="2" opacity="0.3" />
        <path d="M16 85 L44 85" stroke={RAPTURE_COLORS.bronzeDark} strokeWidth="2" opacity="0.3" />

        {/* Lighthouse Top/Lantern */}
        <rect x="12" y="35" width="36" height="15" fill={RAPTURE_COLORS.gold} opacity="0.6" />
        <path d="M10 35 L30 20 L50 35" fill={RAPTURE_COLORS.gold} opacity="0.5" />

        {/* Beacon Light */}
        <circle
          cx="30"
          cy="42"
          r="8"
          fill={RAPTURE_COLORS.goldBright}
          opacity={reducedMotion ? 0.8 : 1}
          className={reducedMotion ? '' : 'animate-beacon-pulse'}
        />

        {/* Light Rays */}
        <g className={reducedMotion ? '' : 'animate-beacon-rotate'} style={{ transformOrigin: '30px 42px' }}>
          <line x1="30" y1="34" x2="30" y2="15" stroke={RAPTURE_COLORS.goldBright} strokeWidth="2" opacity="0.5" />
          <line x1="38" y1="35" x2="55" y2="25" stroke={RAPTURE_COLORS.goldBright} strokeWidth="1.5" opacity="0.4" />
          <line x1="22" y1="35" x2="5" y2="25" stroke={RAPTURE_COLORS.goldBright} strokeWidth="1.5" opacity="0.4" />
        </g>

        {/* Beacon Glow */}
        <circle cx="30" cy="42" r="15" fill="url(#porthole-glow)" opacity="0.5" />
      </svg>
    </div>
  )
}

// ============================================================================
// ART DECO GEOMETRIC BACKGROUND PATTERN
// ============================================================================
function DecoPatternBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[0]" aria-hidden="true">
      <svg className="w-full h-full" preserveAspectRatio="none">
        <rect width="100%" height="100%" fill="url(#deco-diamonds)" />
        <rect width="100%" height="100%" fill="url(#deco-sunburst)" />
        <rect width="100%" height="100%" fill="url(#pressure-cracks)" />
      </svg>
    </div>
  )
}

// ============================================================================
// FLICKERING NEON SIGN - Rapture's failing infrastructure
// ============================================================================
function NeonSign({
  text,
  color = 'gold',
  className = '',
  reducedMotion = false,
}: {
  text: string
  color?: 'gold' | 'pink' | 'green' | 'yellow'
  className?: string
  reducedMotion?: boolean
}) {
  const [flicker, setFlicker] = useState(false)
  const [doubleFlicker, setDoubleFlicker] = useState(false)

  const colors = {
    gold: { on: RAPTURE_COLORS.gold, dim: RAPTURE_COLORS.brassDark },
    pink: { on: RAPTURE_COLORS.neonPink, dim: '#660033' },
    green: { on: RAPTURE_COLORS.neonGreen, dim: '#006600' },
    yellow: { on: RAPTURE_COLORS.neonYellow, dim: '#666600' },
  }

  useEffect(() => {
    if (reducedMotion) return
    const interval = setInterval(() => {
      if (Math.random() > 0.88) {
        setFlicker(true)
        setTimeout(() => setFlicker(false), 80)
        if (Math.random() > 0.6) {
          setTimeout(() => {
            setDoubleFlicker(true)
            setTimeout(() => setDoubleFlicker(false), 50)
          }, 120)
        }
      }
    }, 400)
    return () => clearInterval(interval)
  }, [reducedMotion])

  const isOff = flicker || doubleFlicker
  const currentColor = colors[color]

  return (
    <span
      className={`relative ${className}`}
      style={{
        color: isOff ? currentColor.dim : currentColor.on,
        textShadow: isOff
          ? 'none'
          : `0 0 5px ${currentColor.on}, 0 0 15px ${currentColor.on}, 0 0 30px ${currentColor.on}80, 0 0 50px ${currentColor.on}50`,
        transition: reducedMotion ? 'none' : 'all 0.05s',
        fontFamily: '"Playfair Display", Georgia, serif',
        letterSpacing: '0.15em',
      }}
    >
      {text}
    </span>
  )
}

// ============================================================================
// ART DECO SUNBURST DIVIDER - Section separator
// ============================================================================
function ArtDecoSunburst({ className = '' }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center py-8 ${className}`} aria-hidden="true">
      <svg width="400" height="80" viewBox="0 0 400 80" className="max-w-full">
        {/* Center Circle */}
        <circle cx="200" cy="40" r="15" fill="none" stroke={RAPTURE_COLORS.gold} strokeWidth="2" />
        <circle cx="200" cy="40" r="10" fill={RAPTURE_COLORS.gold} opacity="0.3" />
        <circle cx="200" cy="40" r="5" fill={RAPTURE_COLORS.goldBright} opacity="0.6" />

        {/* Sunburst Rays */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 - 90) * Math.PI / 180
          const innerR = 20
          const outerR = 40 + (i % 2) * 15
          return (
            <line
              key={i}
              x1={200 + Math.cos(angle) * innerR}
              y1={40 + Math.sin(angle) * innerR}
              x2={200 + Math.cos(angle) * outerR}
              y2={40 + Math.sin(angle) * outerR}
              stroke={RAPTURE_COLORS.gold}
              strokeWidth={i % 2 === 0 ? 2 : 1}
              opacity={i % 2 === 0 ? 0.8 : 0.5}
            />
          )
        })}

        {/* Horizontal Lines extending outward */}
        <line x1="0" y1="40" x2="140" y2="40" stroke={RAPTURE_COLORS.gold} strokeWidth="1" opacity="0.5" />
        <line x1="260" y1="40" x2="400" y2="40" stroke={RAPTURE_COLORS.gold} strokeWidth="1" opacity="0.5" />

        {/* Art Deco Fan Ends */}
        <path d="M0 40 L15 30 M0 40 L15 50" stroke={RAPTURE_COLORS.gold} strokeWidth="1" opacity="0.4" />
        <path d="M400 40 L385 30 M400 40 L385 50" stroke={RAPTURE_COLORS.gold} strokeWidth="1" opacity="0.4" />

        {/* Diamond Accents */}
        <path d="M80 40 L90 35 L100 40 L90 45 Z" fill={RAPTURE_COLORS.gold} opacity="0.4" />
        <path d="M300 40 L310 35 L320 40 L310 45 Z" fill={RAPTURE_COLORS.gold} opacity="0.4" />
      </svg>
    </div>
  )
}

// ============================================================================
// ART DECO CHEVRON DIVIDER - Alternative section separator
// ============================================================================
function ArtDecoChevron({ className = '' }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center py-6 ${className}`} aria-hidden="true">
      <svg width="500" height="60" viewBox="0 0 500 60" className="max-w-full">
        {/* Center Chevron Stack */}
        <path d="M230 30 L250 10 L270 30" fill="none" stroke={RAPTURE_COLORS.gold} strokeWidth="2" />
        <path d="M220 40 L250 15 L280 40" fill="none" stroke={RAPTURE_COLORS.gold} strokeWidth="1.5" opacity="0.7" />
        <path d="M210 50 L250 20 L290 50" fill="none" stroke={RAPTURE_COLORS.gold} strokeWidth="1" opacity="0.5" />

        {/* Side Lines */}
        <line x1="0" y1="30" x2="200" y2="30" stroke={RAPTURE_COLORS.gold} strokeWidth="1" opacity="0.4" />
        <line x1="300" y1="30" x2="500" y2="30" stroke={RAPTURE_COLORS.gold} strokeWidth="1" opacity="0.4" />

        {/* Decorative Diamonds */}
        <path d="M50 30 L55 25 L60 30 L55 35 Z" fill={RAPTURE_COLORS.gold} opacity="0.5" />
        <path d="M440 30 L445 25 L450 30 L445 35 Z" fill={RAPTURE_COLORS.gold} opacity="0.5" />

        {/* Small Circles */}
        <circle cx="100" cy="30" r="3" fill={RAPTURE_COLORS.gold} opacity="0.4" />
        <circle cx="150" cy="30" r="2" fill={RAPTURE_COLORS.gold} opacity="0.3" />
        <circle cx="350" cy="30" r="2" fill={RAPTURE_COLORS.gold} opacity="0.3" />
        <circle cx="400" cy="30" r="3" fill={RAPTURE_COLORS.gold} opacity="0.4" />
      </svg>
    </div>
  )
}

// ============================================================================
// ART DECO FAN DIVIDER - Third section separator style
// ============================================================================
function ArtDecoFan({ className = '' }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center py-8 ${className}`} aria-hidden="true">
      <svg width="300" height="80" viewBox="0 0 300 80" className="max-w-full">
        {/* Central Fan */}
        <path d="M150 70 L150 40" stroke={RAPTURE_COLORS.gold} strokeWidth="2" />
        <path d="M150 70 L130 30" stroke={RAPTURE_COLORS.gold} strokeWidth="1.5" opacity="0.8" />
        <path d="M150 70 L170 30" stroke={RAPTURE_COLORS.gold} strokeWidth="1.5" opacity="0.8" />
        <path d="M150 70 L110 40" stroke={RAPTURE_COLORS.gold} strokeWidth="1" opacity="0.6" />
        <path d="M150 70 L190 40" stroke={RAPTURE_COLORS.gold} strokeWidth="1" opacity="0.6" />
        <path d="M150 70 L95 55" stroke={RAPTURE_COLORS.gold} strokeWidth="0.8" opacity="0.4" />
        <path d="M150 70 L205 55" stroke={RAPTURE_COLORS.gold} strokeWidth="0.8" opacity="0.4" />

        {/* Fan Arc */}
        <path d="M95 55 Q150 20 205 55" fill="none" stroke={RAPTURE_COLORS.gold} strokeWidth="1.5" />

        {/* Base */}
        <circle cx="150" cy="70" r="8" fill="none" stroke={RAPTURE_COLORS.gold} strokeWidth="2" />
        <circle cx="150" cy="70" r="4" fill={RAPTURE_COLORS.gold} opacity="0.5" />

        {/* Side Lines */}
        <line x1="0" y1="70" x2="130" y2="70" stroke={RAPTURE_COLORS.gold} strokeWidth="1" opacity="0.4" />
        <line x1="170" y1="70" x2="300" y2="70" stroke={RAPTURE_COLORS.gold} strokeWidth="1" opacity="0.4" />

        {/* End Accents */}
        <circle cx="20" cy="70" r="3" fill={RAPTURE_COLORS.gold} opacity="0.4" />
        <circle cx="280" cy="70" r="3" fill={RAPTURE_COLORS.gold} opacity="0.4" />
      </svg>
    </div>
  )
}

// ============================================================================
// BRASS FRAME CORNER FILIGREE
// ============================================================================
function BrassCornerFiligree({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) {
  const transforms = {
    tl: '',
    tr: 'scale(-1, 1)',
    bl: 'scale(1, -1)',
    br: 'scale(-1, -1)',
  }
  const positions = {
    tl: '-top-1 -left-1',
    tr: '-top-1 -right-1',
    bl: '-bottom-1 -left-1',
    br: '-bottom-1 -right-1',
  }

  return (
    <svg
      className={`absolute ${positions[position]} w-20 h-20 pointer-events-none`}
      viewBox="0 0 80 80"
      aria-hidden="true"
      style={{ transform: transforms[position] }}
    >
      {/* Main L-bracket */}
      <path
        d="M5,75 L5,5 L75,5"
        fill="none"
        stroke="url(#brass-gradient)"
        strokeWidth="3"
      />

      {/* Inner decorative line */}
      <path
        d="M12,68 L12,12 L68,12"
        fill="none"
        stroke={RAPTURE_COLORS.gold}
        strokeWidth="1"
        opacity="0.5"
      />

      {/* Art Deco Fan Motif at corner */}
      <path d="M5,5 L25,25" stroke={RAPTURE_COLORS.gold} strokeWidth="1" opacity="0.6" />
      <path d="M5,5 L30,15" stroke={RAPTURE_COLORS.gold} strokeWidth="0.8" opacity="0.5" />
      <path d="M5,5 L15,30" stroke={RAPTURE_COLORS.gold} strokeWidth="0.8" opacity="0.5" />

      {/* Corner Diamond */}
      <path d="M5,5 L12,-2 L19,5 L12,12 Z" fill={RAPTURE_COLORS.gold} opacity="0.7" />

      {/* Rivets */}
      <circle cx="20" cy="5" r="2.5" fill={RAPTURE_COLORS.gold} opacity="0.6" />
      <circle cx="5" cy="20" r="2.5" fill={RAPTURE_COLORS.gold} opacity="0.6" />
      <circle cx="40" cy="5" r="2" fill={RAPTURE_COLORS.gold} opacity="0.4" />
      <circle cx="5" cy="40" r="2" fill={RAPTURE_COLORS.gold} opacity="0.4" />
      <circle cx="60" cy="5" r="1.5" fill={RAPTURE_COLORS.gold} opacity="0.3" />
      <circle cx="5" cy="60" r="1.5" fill={RAPTURE_COLORS.gold} opacity="0.3" />

      {/* Small accent circle */}
      <circle cx="15" cy="15" r="2" fill={RAPTURE_COLORS.goldBright} opacity="0.4" />
    </svg>
  )
}

// ============================================================================
// GOLD FRAME WITH RAPTURE STYLING - Section container
// ============================================================================
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
      <BrassCornerFiligree position="tl" />
      <BrassCornerFiligree position="tr" />
      <BrassCornerFiligree position="bl" />
      <BrassCornerFiligree position="br" />

      {/* Main frame */}
      <div
        className="relative p-8 overflow-hidden"
        style={{
          background: `
            linear-gradient(180deg, ${RAPTURE_COLORS.deepSeaMid}f8, ${RAPTURE_COLORS.abyss}fc),
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 15px,
              ${RAPTURE_COLORS.gold}05 15px,
              ${RAPTURE_COLORS.gold}05 30px
            )
          `,
          border: `3px solid ${RAPTURE_COLORS.gold}`,
          boxShadow: `
            inset 0 0 80px ${RAPTURE_COLORS.abyss}cc,
            inset 0 0 30px ${RAPTURE_COLORS.waterGlow}08,
            0 0 30px ${RAPTURE_COLORS.gold}20,
            0 0 60px ${RAPTURE_COLORS.gold}10
          `,
        }}
      >
        {/* Water caustic overlay inside card */}
        <div
          className={`absolute inset-0 pointer-events-none ${reducedMotion ? '' : 'animate-card-caustics'}`}
          aria-hidden="true"
          style={{
            background: `
              radial-gradient(ellipse 60% 40% at 15% 25%, ${RAPTURE_COLORS.waterGlow}08 0%, transparent 50%),
              radial-gradient(ellipse 50% 60% at 85% 75%, ${RAPTURE_COLORS.gold}06 0%, transparent 50%),
              radial-gradient(ellipse 80% 40% at 50% 100%, ${RAPTURE_COLORS.waterGlow}05 0%, transparent 40%)
            `,
            mixBlendMode: 'screen',
          }}
        />

        {/* Art deco pattern overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" aria-hidden="true">
          <svg className="w-full h-full" preserveAspectRatio="none">
            <rect width="100%" height="100%" fill="url(#deco-diamonds)" />
          </svg>
        </div>

        {/* Bubble particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {[
            { x: 5, y: 10, size: 4 },
            { x: 95, y: 20, size: 3 },
            { x: 3, y: 80, size: 5 },
            { x: 92, y: 85, size: 3.5 },
            { x: 12, y: 50, size: 2.5 },
            { x: 88, y: 45, size: 3 },
            { x: 50, y: 8, size: 2 },
          ].map((bubble, i) => (
            <div
              key={i}
              className={`absolute rounded-full ${reducedMotion ? '' : 'animate-bubble-gentle'}`}
              style={{
                left: `${bubble.x}%`,
                top: `${bubble.y}%`,
                width: bubble.size,
                height: bubble.size,
                background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.5), ${RAPTURE_COLORS.waterGlow}20)`,
                border: '0.5px solid rgba(255,255,255,0.25)',
                animationDelay: `${i * 1.2}s`,
              }}
            />
          ))}
        </div>

        {/* Pressure crack texture */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
          <rect width="100%" height="100%" fill="url(#pressure-cracks)" opacity="0.5" />
        </svg>

        {/* Inner gold border glow */}
        <div
          className="absolute inset-[3px] pointer-events-none"
          style={{
            border: `1px solid ${RAPTURE_COLORS.gold}30`,
            boxShadow: `inset 0 0 20px ${RAPTURE_COLORS.gold}10`,
          }}
          aria-hidden="true"
        />

        {/* Title with art deco styling */}
        {title && (
          <div className="relative z-10 text-center mb-6 pb-4" style={{ borderBottom: `1px solid ${RAPTURE_COLORS.gold}40` }}>
            <div className="relative inline-block">
              {/* Art deco line accents */}
              <span
                className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 w-12 h-px mr-4"
                style={{ background: `linear-gradient(90deg, transparent, ${RAPTURE_COLORS.gold})` }}
                aria-hidden="true"
              />
              <NeonSign
                text={title}
                className="text-lg tracking-[0.4em]"
                reducedMotion={reducedMotion}
              />
              <span
                className="absolute right-0 top-1/2 translate-x-full -translate-y-1/2 w-12 h-px ml-4"
                style={{ background: `linear-gradient(90deg, ${RAPTURE_COLORS.gold}, transparent)` }}
                aria-hidden="true"
              />
            </div>
            {/* Small decorative element under title */}
            <div className="flex justify-center mt-2" aria-hidden="true">
              <svg width="60" height="15" viewBox="0 0 60 15">
                <path d="M0 7.5 L20 7.5 L25 2 L30 7.5 L35 2 L40 7.5 L60 7.5" fill="none" stroke={RAPTURE_COLORS.gold} strokeWidth="1" opacity="0.5" />
              </svg>
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

// ============================================================================
// PLASMID BUTTON - Profession switcher (Bioshock plasmid vending style)
// ============================================================================

// The plasmid glyph each profession's bottle carries, drawn in the bottle's ink colour.
const PLASMID_ICONS: Record<Profession, (ink: string) => React.ReactNode> = {
  drummer: (ink) => (
    <svg viewBox="0 0 40 40" className="w-10 h-10 sm:w-12 sm:h-12 mx-auto">
      <circle cx="20" cy="20" r="10" fill="none" stroke={ink} strokeWidth="2" />
      <circle cx="20" cy="20" r="5" fill={ink} />
      <path d="M8 20 Q3 20 3 15 M32 20 Q37 20 37 15" fill="none" stroke={ink} strokeWidth="2" />
    </svg>
  ),
  engineer: (ink) => (
    <svg viewBox="0 0 40 40" className="w-10 h-10 sm:w-12 sm:h-12 mx-auto">
      <path d="M20 5 L25 18 L32 18 L18 35 L22 22 L15 22 Z" fill={ink} stroke={ink} strokeWidth="1" />
    </svg>
  ),
  fighter: (ink) => (
    <svg viewBox="0 0 40 40" className="w-10 h-10 sm:w-12 sm:h-12 mx-auto">
      <path d="M10 30 L20 10 L30 30" fill="none" stroke={ink} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M13 25 L27 25" stroke={ink} strokeWidth="2" />
      <circle cx="20" cy="8" r="3" fill={ink} />
    </svg>
  ),
}

function PlasmidButton({ id, label, selected, optionProps, reducedMotion }: ProfessionOption & { reducedMotion: boolean }) {
  const ink = selected ? RAPTURE_COLORS.deepSea : RAPTURE_COLORS.gold

  return (
    <button
      type="button"
      {...optionProps}
      className={`relative group ${reducedMotion ? '' : 'transition-all duration-300'} ${
        selected ? 'scale-105 sm:scale-110' : 'opacity-80 hover:opacity-100 hover:scale-105'
      }`}
    >
      {/* Plasmid Bottle Shape */}
      <div
        className="relative px-3 py-4 sm:p-6 text-center"
        style={{
          background: selected
            ? `linear-gradient(180deg, ${RAPTURE_COLORS.goldBright}, ${RAPTURE_COLORS.gold}, ${RAPTURE_COLORS.brassDark})`
            : `linear-gradient(180deg, ${RAPTURE_COLORS.deepSeaMid}, ${RAPTURE_COLORS.deepSea})`,
          border: `3px solid ${selected ? RAPTURE_COLORS.goldBright : RAPTURE_COLORS.gold}80`,
          borderRadius: '8px 8px 20px 20px',
          boxShadow: selected
            ? `0 0 40px ${RAPTURE_COLORS.gold}60, inset 0 0 20px ${RAPTURE_COLORS.goldBright}40`
            : `0 0 15px ${RAPTURE_COLORS.gold}20`,
          clipPath: 'polygon(10% 0, 90% 0, 100% 15%, 100% 100%, 0 100%, 0 15%)',
        }}
      >
        <div className="mb-3" aria-hidden="true">
          {PLASMID_ICONS[id](ink)}
        </div>

        <div
          className="text-sm font-bold tracking-wider uppercase"
          style={{
            color: ink,
            fontFamily: '"Playfair Display", serif',
            textShadow: selected ? 'none' : `0 0 10px ${RAPTURE_COLORS.gold}60`,
          }}
        >
          {label}
        </div>

        {selected && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at center, ${RAPTURE_COLORS.goldBright}20 0%, transparent 70%)`,
            }}
            aria-hidden="true"
          />
        )}
      </div>

      {/* Selection indicator */}
      {selected && (
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2" aria-hidden="true">
          <svg width="30" height="15" viewBox="0 0 30 15">
            <path d="M0 0 L15 15 L30 0" fill={RAPTURE_COLORS.gold} />
          </svg>
        </div>
      )}
    </button>
  )
}

// The brass card every list entry sits on: caustic shimmer, deco top line and hover gleam.
function BrassCard({
  children,
  reducedMotion,
  className = '',
}: {
  children: React.ReactNode
  reducedMotion: boolean
  className?: string
}) {
  return (
    <article
      className={`relative h-full p-5 group overflow-hidden ${className}`}
      style={{
        background: `
          linear-gradient(180deg, ${RAPTURE_COLORS.deepSeaMid}f5, ${RAPTURE_COLORS.abyss}fa),
          repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 10px,
            ${RAPTURE_COLORS.gold}02 10px,
            ${RAPTURE_COLORS.gold}02 20px
          )
        `,
        border: `1px solid ${RAPTURE_COLORS.gold}60`,
        boxShadow: `inset 0 0 40px ${RAPTURE_COLORS.abyss}70`,
      }}
    >
      <div
        className={`absolute inset-0 pointer-events-none ${reducedMotion ? 'opacity-[0.06]' : 'animate-card-caustics opacity-[0.12]'}`}
        style={{
          background: `
            radial-gradient(ellipse 45% 35% at 25% 20%, ${RAPTURE_COLORS.waterGlow}25 0%, transparent 50%),
            radial-gradient(ellipse 35% 45% at 75% 80%, ${RAPTURE_COLORS.gold}18 0%, transparent 50%)
          `,
        }}
        aria-hidden="true"
      />

      <div className="absolute top-0 left-0 right-0 flex items-center" aria-hidden="true">
        <div className="w-4 h-4 border-l-2 border-t-2" style={{ borderColor: RAPTURE_COLORS.gold }} />
        <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${RAPTURE_COLORS.gold}, ${RAPTURE_COLORS.gold}40, ${RAPTURE_COLORS.gold})` }} />
        <div className="w-4 h-4 border-r-2 border-t-2" style={{ borderColor: RAPTURE_COLORS.gold }} />
      </div>

      <div className="relative z-10 pt-3">{children}</div>

      {!reducedMotion && (
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          style={{
            boxShadow: `inset 0 0 50px ${RAPTURE_COLORS.gold}30`,
            background: `linear-gradient(180deg, ${RAPTURE_COLORS.gold}08 0%, transparent 50%)`,
          }}
          aria-hidden="true"
        />
      )}
    </article>
  )
}

const CARD_TITLE_STYLE: React.CSSProperties = {
  color: RAPTURE_COLORS.gold,
  fontFamily: '"Playfair Display", serif',
  textShadow: `0 0 15px ${RAPTURE_COLORS.gold}30`,
}

// ============================================================================
// EXPERIENCE CARD - Work history with Rapture styling. Dates are date only strings (UTC midnight),
// so the year is read in UTC.
// ============================================================================
function ExperienceCard({ entry, reducedMotion }: { entry: Job; reducedMotion: boolean }) {
  const endDisplay = entry.endDate ? entry.endDate.getUTCFullYear() : 'Present'
  const startDisplay = entry.startDate.getUTCFullYear()

  return (
    <BrassCard reducedMotion={reducedMotion}>
      <div className="flex justify-between items-start gap-3 mb-3 flex-wrap">
        <div>
          <h3 className="text-lg" style={CARD_TITLE_STYLE}>{entry.title}</h3>
          <p className="text-sm mt-1" style={{ color: RAPTURE_COLORS.parchment }}>{entry.company}</p>
        </div>
        <span
          className="text-sm px-3 py-1"
          style={{
            background: `${RAPTURE_COLORS.gold}20`,
            border: `1px solid ${RAPTURE_COLORS.gold}50`,
            color: RAPTURE_COLORS.gold,
          }}
        >
          {startDisplay} - {endDisplay}
        </span>
      </div>

      {entry.description && <p className="text-sm mb-4" style={{ color: RAPTURE_COLORS.warmWhite }}>{entry.description}</p>}

      {entry.highlights.length > 0 && (
        <ul className="space-y-1.5 mb-4" aria-label="Key achievements">
          {entry.highlights.map((highlight) => (
            <li key={highlight} className="text-sm flex items-start gap-2" style={{ color: RAPTURE_COLORS.parchment }}>
              <span style={{ color: RAPTURE_COLORS.gold }} aria-hidden="true">{'>'}</span>
              {highlight}
            </li>
          ))}
        </ul>
      )}

      {entry.skills.length > 0 && (
        <ul className="flex gap-2 flex-wrap" aria-label="Skills used">
          {entry.skills.slice(0, 4).map((skill) => (
            <li
              key={skill}
              className="text-sm px-2 py-1"
              style={{
                background: `${RAPTURE_COLORS.gold}15`,
                border: `1px solid ${RAPTURE_COLORS.gold}30`,
                color: RAPTURE_COLORS.gold,
              }}
            >
              {skill}
            </li>
          ))}
        </ul>
      )}
    </BrassCard>
  )
}

// ============================================================================
// TECH CLOUD - Engineer tech stack
// ============================================================================
function TechCloud({ categories, reducedMotion }: { categories: CVData['techStack']; reducedMotion: boolean }) {
  return (
    <div className="space-y-5">
      {categories.map((category) => (
        <div key={category.id}>
          <h3
            className="text-sm tracking-[0.2em] mb-3 flex items-center gap-2"
            style={{
              color: RAPTURE_COLORS.gold,
              textShadow: `0 0 10px ${RAPTURE_COLORS.gold}40`,
            }}
          >
            <span aria-hidden="true">{category.icon}</span>
            {category.name.toUpperCase()}
          </h3>
          <ul className="flex flex-wrap gap-2" aria-label={`${category.name} technologies`}>
            {category.items.map((tech) => (
              <li
                key={tech}
                className={`text-sm px-3 py-1.5 ${reducedMotion ? '' : 'transition-all hover:scale-105'}`}
                style={{
                  background: `${RAPTURE_COLORS.gold}18`,
                  border: `1px solid ${RAPTURE_COLORS.gold}45`,
                  color: RAPTURE_COLORS.parchment,
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

// ============================================================================
// PROJECT CARD - Vintage Rapture poster style: his role, the result line and the links
// ============================================================================
function ProjectCard({ project, years, links, reducedMotion }: ProjectSlot & { reducedMotion: boolean }) {
  return (
    <BrassCard reducedMotion={reducedMotion}>
      <div className="flex justify-between items-start gap-2 mb-2">
        <h3 className="text-lg" style={CARD_TITLE_STYLE}>{project.name}</h3>
        {years && <span className="text-sm whitespace-nowrap" style={{ color: RAPTURE_COLORS.gold }}>{years}</span>}
      </div>
      <p className="text-sm mb-2 tracking-wider" style={{ color: RAPTURE_COLORS.goldBright }}>{project.role}</p>
      <p className="text-sm mb-3" style={{ color: RAPTURE_COLORS.warmWhite }}>{project.tagline}</p>
      {project.impact && (
        <p className="text-sm mb-3 flex items-start gap-2" style={{ color: RAPTURE_COLORS.parchment }}>
          <span style={{ color: RAPTURE_COLORS.goldBright }} aria-hidden="true">{'>'}</span>
          <span className="italic">{project.impact}</span>
        </p>
      )}
      {project.techStack.length > 0 && (
        <ul className="flex gap-2 flex-wrap" aria-label="Technologies used">
          {project.techStack.slice(0, 4).map((tech) => (
            <li
              key={tech}
              className="text-sm px-2 py-1"
              style={{
                background: `${RAPTURE_COLORS.gold}25`,
                border: `1px solid ${RAPTURE_COLORS.gold}50`,
                color: RAPTURE_COLORS.gold,
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
              className={`inline-flex items-center min-h-[44px] px-4 text-sm tracking-wider ${reducedMotion ? '' : 'transition-all hover:scale-105'}`}
              style={{ border: `2px solid ${RAPTURE_COLORS.gold}`, color: RAPTURE_COLORS.gold }}
            >
              {label.toUpperCase()}
            </a>
          ))}
        </div>
      ) : (
        <p className="text-sm mt-4" style={{ color: RAPTURE_COLORS.warmWhite }}>No public link</p>
      )}
    </BrassCard>
  )
}

// ============================================================================
// COMPANY CARD - Ventures display
// ============================================================================
function CompanyCard({ company, reducedMotion }: { company: CVData['companies'][number]; reducedMotion: boolean }) {
  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${company.name}: ${company.tagline} (opens in a new tab)`}
      className="block h-full"
    >
      <BrassCard reducedMotion={reducedMotion}>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl" aria-hidden="true">{company.icon}</span>
          <div>
            <h3 className="text-base" style={CARD_TITLE_STYLE}>{company.name}</h3>
            <p className="text-sm" style={{ color: RAPTURE_COLORS.warmWhite }}>{company.tagline}</p>
          </div>
        </div>
        <p className="text-sm" style={{ color: RAPTURE_COLORS.parchment }}>{company.description}</p>
      </BrassCard>
    </a>
  )
}

// ============================================================================
// BAND CARD - Musical projects display
// ============================================================================
function BandCard({ band, years, linkProps, reducedMotion }: BandSlot & { reducedMotion: boolean }) {
  const content = (
    <BrassCard reducedMotion={reducedMotion}>
      <h3 className="text-base" style={CARD_TITLE_STYLE}>{band.name}</h3>
      <p className="text-sm mt-1" style={{ color: RAPTURE_COLORS.warmWhite }}>
        {band.role}
        {years && <span aria-hidden="true"> - </span>}
        {years && <span>{years}</span>}
      </p>
      {band.release && (
        <p className="text-sm mt-2" style={{ color: RAPTURE_COLORS.parchment }}>
          Released <cite>&ldquo;{band.release}&rdquo;</cite>
        </p>
      )}
    </BrassCard>
  )

  if (!linkProps) return content
  return (
    <a {...linkProps} className="block h-full">
      {content}
    </a>
  )
}

const DECO_BUTTON = 'inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 text-sm tracking-wider'

// Email is the gold primary action, LinkedIn the outlined one.
const HERO_ACTION_LOOK: Record<HeroActionSlot['id'], React.CSSProperties> = {
  email: {
    background: RAPTURE_COLORS.gold,
    color: RAPTURE_COLORS.deepSea,
    border: `2px solid ${RAPTURE_COLORS.goldBright}`,
  },
  linkedin: {
    background: 'transparent',
    border: `2px solid ${RAPTURE_COLORS.gold}`,
    color: RAPTURE_COLORS.gold,
  },
}

function HeroAction({ action, reducedMotion }: { action: HeroActionSlot; reducedMotion: boolean }) {
  return (
    <a
      {...action.linkProps}
      className={`${DECO_BUTTON} ${reducedMotion ? '' : 'transition-all hover:scale-105'}`}
      style={HERO_ACTION_LOOK[action.id]}
    >
      {action.label.toUpperCase()}
    </a>
  )
}

function CVLink({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <Link
      href="/cv"
      className={`${DECO_BUTTON} ${reducedMotion ? '' : 'transition-all hover:scale-105'}`}
      style={HERO_ACTION_LOOK.linkedin}
    >
      CV
    </Link>
  )
}

type SectionsOf<Id extends Profession> = Extract<ProfessionSections, { profession: Id }>

function EngineerSections({ sections, reducedMotion }: { sections: SectionsOf<'engineer'>; reducedMotion: boolean }) {
  const { professionalSummary } = useCVData()

  return (
    <>
      <GoldFrame title="ABOUT" reducedMotion={reducedMotion}>
        <p className="text-base leading-relaxed text-center" style={{ color: RAPTURE_COLORS.parchment }}>
          {professionalSummary.bio}
        </p>
      </GoldFrame>

      <ArtDecoSunburst />

      {sections.jobs.length > 0 && (
        <GoldFrame title="WORK EXPERIENCE" reducedMotion={reducedMotion}>
          <div className="space-y-5">
            {sections.jobs.map((entry) => (
              <ExperienceCard key={entry.id} entry={entry} reducedMotion={reducedMotion} />
            ))}
          </div>
        </GoldFrame>
      )}

      <ArtDecoChevron />

      <GoldFrame title="TECH STACK" reducedMotion={reducedMotion}>
        <TechCloud categories={sections.techStack} reducedMotion={reducedMotion} />
      </GoldFrame>

      <div className="pt-8">
        <GoldFrame title="PROJECTS" reducedMotion={reducedMotion}>
          <ProjectList
            projects={sections.projects}
            className="grid md:grid-cols-2 gap-5"
            renderProject={(slot) => <ProjectCard {...slot} reducedMotion={reducedMotion} />}
          />
        </GoldFrame>
      </div>

      <ArtDecoFan />

      <GoldFrame title="VENTURES" reducedMotion={reducedMotion}>
        <div className="grid md:grid-cols-3 gap-5">
          {sections.companies.map((company) => (
            <CompanyCard key={company.id} company={company} reducedMotion={reducedMotion} />
          ))}
        </div>
      </GoldFrame>
    </>
  )
}

function MusicianSections({ sections, reducedMotion }: { sections: SectionsOf<'drummer'>; reducedMotion: boolean }) {
  const { musician, bands } = sections

  return (
    <>
      <ArtDecoSunburst />
      <GoldFrame title="BANDS" reducedMotion={reducedMotion}>
        <p className="text-base text-center mb-5" style={{ color: RAPTURE_COLORS.parchment }}>
          Drums since {musician.since}, {musician.yearsPlaying} years
        </p>
        <BandList
          bands={bands}
          className="grid md:grid-cols-2 gap-5"
          renderBand={(slot) => <BandCard {...slot} reducedMotion={reducedMotion} />}
        />
        <p className="text-sm text-center mt-5 italic" style={{ color: RAPTURE_COLORS.gold }}>
          {musician.line}
        </p>
      </GoldFrame>
    </>
  )
}

function MartialArtistSections({ sections, reducedMotion }: { sections: SectionsOf<'fighter'>; reducedMotion: boolean }) {
  const { martialArts } = sections

  return (
    <>
      <ArtDecoSunburst />
      <GoldFrame title="MUAY THAI" reducedMotion={reducedMotion}>
        <h3 className="text-xl text-center mb-6" style={CARD_TITLE_STYLE}>{martialArts.primary.title}</h3>
        <MuayThaiRecord
          martialArts={martialArts}
          classNames={{
            facts: 'grid sm:grid-cols-2 gap-4 mb-6',
            fact: 'p-4 border border-[#D4AF37]/50 bg-[#0d1f2d]/80',
            term: 'text-sm tracking-[0.2em] uppercase text-[#D4AF37]',
            value: 'text-sm mt-1 text-[#F5E6C8]',
            achievements: 'space-y-2',
            achievement: 'text-sm flex items-start gap-2 text-[#F5E6C8]',
          }}
          renderAchievement={(achievement) => (
            <>
              <span className="text-[#D4AF37]" aria-hidden="true">{'>'}</span>
              <span>{achievement}</span>
            </>
          )}
        />
      </GoldFrame>
    </>
  )
}

function ProfessionDetails(props: { sections: ProfessionSections; reducedMotion: boolean }) {
  const { sections, reducedMotion } = props
  if (sections.profession === 'drummer') return <MusicianSections sections={sections} reducedMotion={reducedMotion} />
  if (sections.profession === 'fighter') return <MartialArtistSections sections={sections} reducedMotion={reducedMotion} />
  return <EngineerSections sections={sections} reducedMotion={reducedMotion} />
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function ArtDecoTheme() {
  const { active } = useProfession()
  const view = useWorldView()
  const [mounted, setMounted] = useState(false)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: `linear-gradient(180deg, ${RAPTURE_COLORS.deepSeaMid}, ${RAPTURE_COLORS.deepSea}, ${RAPTURE_COLORS.abyss})`,
        fontFamily: '"Playfair Display", Georgia, serif',
      }}
    >
      {/* SVG Definitions */}
      <RaptureSVGDefs />

      {/* Background Effects */}
      <DecoPatternBackground />
      <UnderwaterRays reducedMotion={reducedMotion} />
      <WaterCaustics reducedMotion={reducedMotion} />
      <UnderwaterBubbles reducedMotion={reducedMotion} />
      <SplicerMasks reducedMotion={reducedMotion} />
      <LighthouseBeacon reducedMotion={reducedMotion} />
      <BigDaddySilhouette reducedMotion={reducedMotion} />
      <LittleSisterSilhouette reducedMotion={reducedMotion} />

      {/* Vignette */}
      <div
        className="fixed inset-0 pointer-events-none z-[7]"
        style={{
          background: `radial-gradient(circle at 50% 25%, transparent 25%, ${RAPTURE_COLORS.abyss}90 100%)`,
        }}
        aria-hidden="true"
      />

      {/* ================================================================== */}
      {/* HEADER - the recruiter first screen */}
      {/* ================================================================== */}
      <header className="relative z-30 px-4 py-6 sm:p-6 sm:pt-20 sm:pb-10">
        <RecruiterHero
          render={({ name, headline, tagline, line, actions }) => (
            <div className="max-w-6xl mx-auto flex justify-between items-start flex-wrap gap-6">
              <div className="flex items-center gap-5">
                {/* Art Deco Sunburst Logo */}
                <div className="relative w-20 h-20 pointer-events-none flex-shrink-0 hidden sm:block" aria-hidden="true">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute top-1/2 left-1/2 w-0.5"
                      style={{
                        height: '45px',
                        background: `linear-gradient(to top, ${RAPTURE_COLORS.gold}, transparent)`,
                        transform: `translate(-50%, -100%) rotate(${i * 30}deg)`,
                        transformOrigin: 'bottom center',
                        opacity: i % 2 === 0 ? 0.5 : 0.3,
                      }}
                    />
                  ))}
                  <div
                    className="absolute top-1/2 left-1/2 w-10 h-10 rounded-full -translate-x-1/2 -translate-y-1/2"
                    style={{
                      background: `radial-gradient(circle, ${RAPTURE_COLORS.goldBright}60, ${RAPTURE_COLORS.gold}30)`,
                      border: `2px solid ${RAPTURE_COLORS.gold}`,
                    }}
                  />
                </div>
                <div>
                  <h1
                    className="text-2xl sm:text-4xl tracking-[0.2em] uppercase"
                    style={{ textShadow: `0 0 50px ${RAPTURE_COLORS.gold}70` }}
                  >
                    <NeonSign text={name} reducedMotion={reducedMotion} />
                  </h1>
                  <p className="text-base tracking-wider mt-2" style={{ color: RAPTURE_COLORS.parchment }}>
                    {headline}
                  </p>
                  <p className="text-sm tracking-wider mt-1 italic" style={{ color: RAPTURE_COLORS.gold }}>
                    {tagline}
                  </p>
                  <p className="text-sm tracking-wider mt-1" style={{ color: RAPTURE_COLORS.warmWhite }}>
                    {line}
                  </p>
                </div>
              </div>

              <nav className="flex gap-3 sm:gap-4 items-center flex-wrap" aria-label="Contact and CV">
                {actions.map((action) => (
                  <HeroAction key={action.id} action={action} reducedMotion={reducedMotion} />
                ))}
                <CVLink reducedMotion={reducedMotion} />
                <Link
                  href="/personal-projects/game-engine"
                  className={`${DECO_BUTTON} ${reducedMotion ? '' : 'transition-all hover:scale-105'}`}
                  style={HERO_ACTION_LOOK.linkedin}
                >
                  PORTFOLIO
                </Link>
              </nav>
            </div>
          )}
        />
      </header>

      {/* ================================================================== */}
      {/* PLASMID SELECTION - Profession Switcher, System Engineer in the centre */}
      {/* ================================================================== */}
      <section className="relative z-20 py-8 px-4" aria-label="Profession selection">
        <ProfessionSwitch
          className="grid grid-cols-3 gap-3 sm:flex sm:justify-center sm:gap-8"
          label="Profession"
          renderOption={(option) => <PlasmidButton {...option} reducedMotion={reducedMotion} />}
        />
      </section>

      {/* ================================================================== */}
      {/* MAIN CONTENT - the picked profession's sections, and only those */}
      {/* ================================================================== */}
      <main className="relative z-20 px-4 sm:px-8 py-10">
        <div className="max-w-5xl mx-auto space-y-0" role="region" aria-label={`${active} profession details`}>
          <ProfessionDetails sections={view.sections} reducedMotion={reducedMotion} />

          <div className="pt-8">
            <GoldFrame title="POSTS" reducedMotion={reducedMotion}>
              <div className="text-center py-8">
                <p className="text-base italic" style={{ color: RAPTURE_COLORS.warmWhite }}>
                  Coming soon... transmissions from the deep.
                </p>
              </div>
            </GoldFrame>
          </div>
        </div>
      </main>

      {/* ================================================================== */}
      {/* CONTACT CTA */}
      {/* ================================================================== */}
      <section className="relative z-20 py-16 px-4 sm:px-8" aria-label="Contact">
        <RecruiterHero
          render={({ line, actions }) => (
            <div className="max-w-2xl mx-auto text-center">
              <GoldFrame reducedMotion={reducedMotion}>
                <h2 className="mb-6">
                  <NeonSign
                    text="READY TO WORK TOGETHER?"
                    className="text-lg tracking-[0.25em]"
                    reducedMotion={reducedMotion}
                  />
                </h2>
                <p className="text-sm mb-8" style={{ color: RAPTURE_COLORS.parchment }}>
                  {line}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {actions.map((action) => (
                    <HeroAction key={action.id} action={action} reducedMotion={reducedMotion} />
                  ))}
                  <CVLink reducedMotion={reducedMotion} />
                </div>
              </GoldFrame>
            </div>
          )}
        />
      </section>

      {/* ================================================================== */}
      {/* FOOTER */}
      {/* ================================================================== */}
      <footer className="relative z-20 py-12 text-center">
        <div
          className="inline-block px-10 py-3"
          style={{ border: `1px solid ${RAPTURE_COLORS.gold}50` }}
        >
          <p className="text-sm tracking-[0.4em]" style={{ color: RAPTURE_COLORS.gold }}>
            NO GODS OR KINGS - ONLY MAN - MCMXXVI
          </p>
        </div>
        {/* Lighthouse icon */}
        <div className="mt-6 flex justify-center" aria-hidden="true">
          <svg width="50" height="80" viewBox="0 0 50 80" opacity="0.25">
            <path d="M18 80 L13 45 L37 45 L32 80" fill={RAPTURE_COLORS.gold} />
            <path d="M15 65 L35 65" stroke={RAPTURE_COLORS.bronzeDark} strokeWidth="2" />
            <rect x="10" y="25" width="30" height="20" fill={RAPTURE_COLORS.gold} />
            <path d="M8 25 L25 10 L42 25" fill={RAPTURE_COLORS.gold} />
            <circle cx="25" cy="35" r="8" fill={RAPTURE_COLORS.goldBright} opacity="0.8" />
            <path d="M25 27 L25 12 M17 30 L5 25 M33 30 L45 25" stroke={RAPTURE_COLORS.goldBright} strokeWidth="1.5" opacity="0.6" />
          </svg>
        </div>
      </footer>

      {/* ================================================================== */}
      {/* ANIMATIONS */}
      {/* ================================================================== */}
      <style jsx global>{`
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
          0%, 100% { opacity: 0.04; }
          50% { opacity: 0.12; }
        }
        .animate-light-ray {
          animation: light-ray ease-in-out infinite;
        }

        @keyframes bubble-rise {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          90% {
            opacity: 0.5;
          }
          100% {
            transform: translateY(-110vh) translateX(var(--wobble, 25px));
            opacity: 0;
          }
        }
        .animate-bubble-rise {
          animation: bubble-rise linear infinite;
        }

        @keyframes caustics-1 {
          0%, 100% {
            transform: scale(1) translate(0, 0);
            opacity: 0.15;
          }
          33% {
            transform: scale(1.08) translate(4%, -2%);
            opacity: 0.22;
          }
          66% {
            transform: scale(0.96) translate(-2%, 3%);
            opacity: 0.12;
          }
        }
        .animate-caustics-1 {
          animation: caustics-1 18s ease-in-out infinite;
        }

        @keyframes caustics-2 {
          0%, 100% {
            transform: scale(1) translate(0, 0);
            opacity: 0.12;
          }
          50% {
            transform: scale(1.12) translate(-4%, 4%);
            opacity: 0.2;
          }
        }
        .animate-caustics-2 {
          animation: caustics-2 14s ease-in-out infinite;
          animation-delay: -7s;
        }

        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0) rotate(var(--rotation, 0deg));
          }
          50% {
            transform: translateY(-20px) rotate(calc(var(--rotation, 0deg) + 5deg));
          }
        }
        .animate-float-slow {
          animation: float-slow ease-in-out infinite;
        }

        @keyframes card-caustics {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.1;
          }
          25% {
            transform: translate(3%, -2%) scale(1.03);
            opacity: 0.15;
          }
          50% {
            transform: translate(-2%, 2%) scale(0.97);
            opacity: 0.07;
          }
          75% {
            transform: translate(1%, 1%) scale(1.02);
            opacity: 0.12;
          }
        }
        .animate-card-caustics {
          animation: card-caustics 15s ease-in-out infinite;
        }

        @keyframes bubble-gentle {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.5;
          }
          33% {
            transform: translateY(-4px) translateX(2px);
            opacity: 0.6;
          }
          66% {
            transform: translateY(-2px) translateX(-1px);
            opacity: 0.4;
          }
        }
        .animate-bubble-gentle {
          animation: bubble-gentle 8s ease-in-out infinite;
        }

        @keyframes beacon-pulse {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
        }
        .animate-beacon-pulse {
          animation: beacon-pulse 2s ease-in-out infinite;
        }

        @keyframes beacon-rotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .animate-beacon-rotate {
          animation: beacon-rotate 10s linear infinite;
        }

        @keyframes drill-idle {
          0%, 100% {
            transform: translateX(0) rotate(0deg);
          }
          50% {
            transform: translateX(2px) rotate(1deg);
          }
        }
        .animate-drill-idle {
          animation: drill-idle 3s ease-in-out infinite;
        }

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
