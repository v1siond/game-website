'use client'

import { useEffect, useState } from 'react'
import { RAPTURE_COLORS } from './palette'

// The fixed backdrop of Rapture behind every section: shared SVG gradients, the silhouettes, bubbles,
// caustics, light rays, the lighthouse and the deco pattern.

// ============================================================================
// SVG DEFINITIONS COMPONENT - Shared gradients and patterns
// ============================================================================
export function RaptureSVGDefs() {
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
export function BigDaddySilhouette({ reducedMotion = false }: { reducedMotion?: boolean }) {
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
export function LittleSisterSilhouette({ reducedMotion = false }: { reducedMotion?: boolean }) {
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
export function SplicerMasks({ reducedMotion = false }: { reducedMotion?: boolean }) {
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
export function UnderwaterBubbles({ reducedMotion = false }: { reducedMotion?: boolean }) {
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
export function WaterCaustics({ reducedMotion = false }: { reducedMotion?: boolean }) {
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
export function UnderwaterRays({ reducedMotion = false }: { reducedMotion?: boolean }) {
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
export function LighthouseBeacon({ reducedMotion = false }: { reducedMotion?: boolean }) {
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
export function DecoPatternBackground() {
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
