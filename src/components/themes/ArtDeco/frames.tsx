'use client'

import { useEffect, useState } from 'react'
import { RAPTURE_COLORS } from './palette'

// ============================================================================
// FLICKERING NEON SIGN - Rapture's failing infrastructure
// ============================================================================
export function NeonSign({
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
export function ArtDecoSunburst({ className = '' }: { className?: string }) {
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
export function ArtDecoChevron({ className = '' }: { className?: string }) {
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
export function ArtDecoFan({ className = '' }: { className?: string }) {
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
export function BrassCornerFiligree({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) {
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
export function GoldFrame({
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
