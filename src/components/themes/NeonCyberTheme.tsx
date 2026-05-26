'use client'

import { useEffect, useState, useRef, useCallback, useMemo } from 'react'
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

// Hook to detect prefers-reduced-motion
function useReducedMotion() {
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

// Intense glitch text effect with RGB split - Cyberpunk 2077 style chromatic aberration
function GlitchText({
  text,
  className = '',
  intensity = 'normal'
}: {
  text: string
  className?: string
  intensity?: 'normal' | 'high'
}) {
  const [glitching, setGlitching] = useState(false)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion) return

    const probability = intensity === 'high' ? 0.9 : 0.95
    const interval = setInterval(() => {
      if (Math.random() > probability) {
        setGlitching(true)
        setOffset({ x: Math.random() * 6 - 3, y: Math.random() * 4 - 2 })
        setTimeout(() => setGlitching(false), 80 + Math.random() * 100)
      }
    }, 80)
    return () => clearInterval(interval)
  }, [intensity, reducedMotion])

  return (
    <span className={`relative inline-block ${className}`} aria-label={text}>
      <span className="relative z-10">{text}</span>
      {glitching && !reducedMotion && (
        <>
          <span
            className="absolute top-0 left-0 text-cyan-400 z-0 mix-blend-screen"
            style={{
              clipPath: 'inset(0 0 60% 0)',
              transform: `translate(${-offset.x}px, ${offset.y}px)`,
            }}
            aria-hidden="true"
          >
            {text}
          </span>
          <span
            className="absolute top-0 left-0 text-pink-500 z-0 mix-blend-screen"
            style={{
              clipPath: 'inset(40% 0 0 0)',
              transform: `translate(${offset.x}px, ${-offset.y}px)`,
            }}
            aria-hidden="true"
          >
            {text}
          </span>
          <span
            className="absolute top-0 left-0 text-yellow-400 z-0 mix-blend-screen opacity-50"
            style={{
              clipPath: 'inset(20% 0 40% 0)',
              transform: `translate(${offset.x * 0.5}px, 0)`,
            }}
            aria-hidden="true"
          >
            {text}
          </span>
        </>
      )}
    </span>
  )
}

// Flickering neon sign with Japanese text - Night City storefront style
function NeonSign({
  text,
  subtext,
  color = '#ff00ff'
}: {
  text: string
  subtext?: string
  color?: string
}) {
  const [flicker, setFlicker] = useState(1)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion) return

    const interval = setInterval(() => {
      if (Math.random() > 0.95) {
        setFlicker(0.3 + Math.random() * 0.4)
        setTimeout(() => setFlicker(1), 50 + Math.random() * 100)
      }
    }, 100)
    return () => clearInterval(interval)
  }, [reducedMotion])

  return (
    <div
      className="text-center py-2"
      style={{
        opacity: reducedMotion ? 1 : flicker,
        textShadow: `0 0 10px ${color}, 0 0 20px ${color}, 0 0 40px ${color}, 0 0 80px ${color}`,
        color: color,
      }}
      role="presentation"
      aria-label={`Neon sign: ${text}${subtext ? ` - ${subtext}` : ''}`}
    >
      <span className="text-2xl font-bold tracking-wider">{text}</span>
      {subtext && (
        <span className="block text-xs mt-1 opacity-70">{subtext}</span>
      )}
    </div>
  )
}

// Terminal line with typing effect - V's quickhack interface style
function TerminalLine({
  prefix,
  text,
  delay = 0
}: {
  prefix: string
  text: string
  delay?: number
}) {
  const [displayed, setDisplayed] = useState('')
  const [started, setStarted] = useState(false)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion) {
      setDisplayed(text)
      setStarted(true)
      return
    }

    const startTimeout = setTimeout(() => setStarted(true), delay)
    return () => clearTimeout(startTimeout)
  }, [delay, reducedMotion, text])

  useEffect(() => {
    if (!started || reducedMotion) return
    let i = 0
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1))
        i++
      } else {
        clearInterval(interval)
      }
    }, 15)
    return () => clearInterval(interval)
  }, [text, started, reducedMotion])

  return (
    <div className="font-mono text-sm" role="log" aria-live="polite">
      <span className="text-pink-500">{prefix}</span>
      <span className="text-cyan-400">{reducedMotion ? text : displayed}</span>
      {started && displayed.length < text.length && !reducedMotion && (
        <span className="animate-pulse text-cyan-400" aria-hidden="true">_</span>
      )}
    </div>
  )
}

// HUD Scanner corners - Kiroshi optics style targeting reticle
function ScannerCorners({
  children,
  color = '#00ffff'
}: {
  children: React.ReactNode
  color?: string
}) {
  return (
    <div className="relative" role="presentation">
      {/* Scanner corners */}
      <div className="absolute -top-1 -left-1 w-6 h-6" aria-hidden="true">
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <path d="M0,12 L0,2 Q0,0 2,0 L12,0" fill="none" stroke={color} strokeWidth="2" />
        </svg>
      </div>
      <div className="absolute -top-1 -right-1 w-6 h-6" aria-hidden="true">
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <path d="M24,12 L24,2 Q24,0 22,0 L12,0" fill="none" stroke={color} strokeWidth="2" />
        </svg>
      </div>
      <div className="absolute -bottom-1 -left-1 w-6 h-6" aria-hidden="true">
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <path d="M0,12 L0,22 Q0,24 2,24 L12,24" fill="none" stroke={color} strokeWidth="2" />
        </svg>
      </div>
      <div className="absolute -bottom-1 -right-1 w-6 h-6" aria-hidden="true">
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <path d="M24,12 L24,22 Q24,24 22,24 L12,24" fill="none" stroke={color} strokeWidth="2" />
        </svg>
      </div>
      {children}
    </div>
  )
}

// Rain effect overlay - Night City constant rain
function RainOverlay() {
  const reducedMotion = useReducedMotion()
  const [drops, setDrops] = useState<Array<{ id: number; x: number; delay: number; duration: number; opacity: number }>>([])

  useEffect(() => {
    if (reducedMotion) return

    const newDrops = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 0.5 + Math.random() * 0.5,
      opacity: 0.1 + Math.random() * 0.3,
    }))
    setDrops(newDrops)
  }, [reducedMotion])

  if (reducedMotion) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[3] overflow-hidden" aria-hidden="true">
      {drops.map((drop) => (
        <div
          key={drop.id}
          className="absolute w-px bg-gradient-to-b from-cyan-400/40 to-transparent animate-rain"
          style={{
            left: `${drop.x}%`,
            height: '15vh',
            animationDelay: `${drop.delay}s`,
            animationDuration: `${drop.duration}s`,
            opacity: drop.opacity,
          }}
        />
      ))}
    </div>
  )
}

// Holographic shimmer effect - like holo-ads in Night City
function HolographicShimmer({
  children,
  intensity = 'normal'
}: {
  children: React.ReactNode
  intensity?: 'low' | 'normal' | 'high'
}) {
  const reducedMotion = useReducedMotion()
  const opacityMap = { low: 0.05, normal: 0.1, high: 0.15 }

  return (
    <div className="relative">
      {children}
      {!reducedMotion && (
        <div
          className="absolute inset-0 pointer-events-none animate-holo-shimmer"
          style={{
            background: `linear-gradient(
              45deg,
              transparent 30%,
              rgba(0, 255, 255, ${opacityMap[intensity]}) 45%,
              rgba(255, 0, 255, ${opacityMap[intensity]}) 55%,
              transparent 70%
            )`,
            backgroundSize: '200% 200%',
          }}
          aria-hidden="true"
        />
      )}
    </div>
  )
}

// Circuit board pattern background - tech infrastructure visual
function CircuitPattern({ color = '#ff00ff' }: { color?: string }) {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-10 pointer-events-none"
      aria-hidden="true"
    >
      <defs>
        <pattern id="circuit" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
          <path
            d="M0,25 L15,25 L20,20 L30,20 L30,10 M25,0 L25,10 M50,25 L35,25 L35,35 L25,35 L25,50"
            fill="none"
            stroke={color}
            strokeWidth="0.5"
          />
          <circle cx="20" cy="20" r="2" fill={color} />
          <circle cx="30" cy="10" r="2" fill={color} />
          <circle cx="35" cy="35" r="2" fill={color} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#circuit)" />
    </svg>
  )
}

// Cyber panel with neon border and holographic effect - Arasaka/Militech corporate UI
function CyberPanel({
  title,
  children,
  accentColor = '#ff00ff',
  holographic = false,
  megacorpStyle = false
}: {
  title: string
  children: React.ReactNode
  accentColor?: string
  holographic?: boolean
  megacorpStyle?: boolean
}) {
  const reducedMotion = useReducedMotion()

  return (
    <section
      className="relative group"
      aria-labelledby={`panel-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      {/* Glow effect */}
      {!reducedMotion && (
        <div
          className="absolute -inset-0.5 opacity-40 blur-sm group-hover:opacity-60 transition-opacity"
          style={{ background: `linear-gradient(45deg, ${accentColor}, #00ffff)` }}
          aria-hidden="true"
        />
      )}

      {/* Circuit pattern border */}
      {megacorpStyle && <CircuitPattern color={accentColor} />}

      {/* Panel */}
      <div
        className={`relative p-4 ${holographic ? 'backdrop-blur-sm' : ''}`}
        style={{
          background: holographic
            ? `linear-gradient(135deg, rgba(10, 5, 18, 0.85), rgba(20, 10, 30, 0.75))`
            : 'rgba(10, 5, 18, 0.95)',
          border: `1px solid ${accentColor}`,
          boxShadow: `inset 0 0 30px rgba(0,0,0,0.5), 0 0 20px ${accentColor}30`,
        }}
      >
        {/* Corner accents with circuit lines */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2" style={{ borderColor: '#00ffff' }} aria-hidden="true" />
        <div className="absolute top-2 left-8 w-4 h-px" style={{ background: '#00ffff' }} aria-hidden="true" />
        <div className="absolute top-8 left-2 w-px h-4" style={{ background: '#00ffff' }} aria-hidden="true" />

        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2" style={{ borderColor: '#00ffff' }} aria-hidden="true" />
        <div className="absolute top-2 right-8 w-4 h-px" style={{ background: '#00ffff' }} aria-hidden="true" />
        <div className="absolute top-8 right-2 w-px h-4" style={{ background: '#00ffff' }} aria-hidden="true" />

        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2" style={{ borderColor: accentColor }} aria-hidden="true" />
        <div className="absolute bottom-2 left-8 w-4 h-px" style={{ background: accentColor }} aria-hidden="true" />
        <div className="absolute bottom-8 left-2 w-px h-4" style={{ background: accentColor }} aria-hidden="true" />

        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2" style={{ borderColor: accentColor }} aria-hidden="true" />
        <div className="absolute bottom-2 right-8 w-4 h-px" style={{ background: accentColor }} aria-hidden="true" />
        <div className="absolute bottom-8 right-2 w-px h-4" style={{ background: accentColor }} aria-hidden="true" />

        {/* Title with data overlay style */}
        <header className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10">
          <div className="flex items-center gap-1" aria-hidden="true">
            <div
              className={`w-2 h-2 rounded-full ${reducedMotion ? '' : 'animate-pulse'}`}
              style={{ background: accentColor, boxShadow: `0 0 10px ${accentColor}` }}
            />
            <div className="w-1 h-1 rounded-full opacity-60" style={{ background: accentColor }} />
            <div className="w-1 h-1 rounded-full opacity-30" style={{ background: accentColor }} />
          </div>
          <h2
            id={`panel-${title.toLowerCase().replace(/\s+/g, '-')}`}
            className="text-sm tracking-[0.3em] uppercase"
            style={{ color: accentColor }}
          >
            {'//'} {title}
          </h2>
          <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${accentColor}40, transparent)` }} aria-hidden="true" />
        </header>

        {children}
      </div>
    </section>
  )
}

// Matrix-like data stream background with Japanese katakana - Net architecture visualization
function DataStream() {
  const reducedMotion = useReducedMotion()
  const [chars, setChars] = useState<Array<{ id: number; x: number; char: string; speed: number; opacity: number }>>([])

  useEffect(() => {
    if (reducedMotion) return

    const characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'.split('')
    const newChars = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      char: characters[Math.floor(Math.random() * characters.length)],
      speed: Math.random() * 15 + 8,
      opacity: Math.random() * 0.4 + 0.1,
    }))
    setChars(newChars)
  }, [reducedMotion])

  if (reducedMotion) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden" aria-hidden="true">
      {chars.map((c) => (
        <div
          key={c.id}
          className="absolute text-cyan-400 text-xs animate-fall font-mono"
          style={{
            left: `${c.x}%`,
            opacity: c.opacity,
            animationDuration: `${c.speed}s`,
            animationDelay: `${-c.speed * Math.random()}s`,
            textShadow: '0 0 5px #00ffff',
          }}
        >
          {c.char}
        </div>
      ))}
    </div>
  )
}

// Night City skyline silhouette - iconic megabuildings
function NightCitySkyline() {
  const reducedMotion = useReducedMotion()

  return (
    <div className="fixed bottom-0 left-0 right-0 h-64 pointer-events-none z-[2] opacity-30" aria-hidden="true">
      <svg viewBox="0 0 1200 200" className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="skylineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0a0512" stopOpacity="0" />
            <stop offset="100%" stopColor="#ff00ff" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="buildingGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1a0a2a" />
            <stop offset="100%" stopColor="#0a0512" />
          </linearGradient>
          {/* Arasaka Tower style gradient */}
          <linearGradient id="arasakaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ff0066" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#1a0a2a" />
            <stop offset="100%" stopColor="#0a0512" />
          </linearGradient>
        </defs>
        {/* Buildings silhouette with Arasaka Tower centerpiece */}
        <path
          d="M0,200 L0,150 L30,150 L30,120 L50,120 L50,100 L70,100 L70,80 L90,80 L90,100 L110,100 L110,60 L130,60 L130,40 L150,40 L150,60 L170,60 L170,90 L190,90 L190,70 L210,70 L210,50 L230,50 L230,30 L250,30 L250,50 L270,50 L270,80 L290,80 L290,100 L310,100 L310,70 L330,70 L330,40 L350,40 L350,20 L370,20 L370,40 L390,40 L390,60 L410,60 L410,90 L430,90 L430,110 L450,110 L450,80 L470,80 L470,50 L490,50 L490,70 L510,70 L510,100 L530,100 L530,120 L550,120 L550,90 L570,90 L570,60 L590,60 L590,30 L610,30 L610,50 L630,50 L630,80 L650,80 L650,100 L670,100 L670,70 L690,70 L690,40 L710,40 L710,60 L730,60 L730,90 L750,90 L750,110 L770,110 L770,80 L790,80 L790,50 L810,50 L810,70 L830,70 L830,100 L850,100 L850,60 L870,60 L870,30 L890,30 L890,50 L910,50 L910,80 L930,80 L930,100 L950,100 L950,70 L970,70 L970,40 L990,40 L990,60 L1010,60 L1010,90 L1030,90 L1030,110 L1050,110 L1050,80 L1070,80 L1070,120 L1090,120 L1090,140 L1110,140 L1110,160 L1130,160 L1130,180 L1150,180 L1150,200 L1200,200 Z"
          fill="url(#buildingGrad)"
        />
        {/* Central Arasaka-style tower */}
        <path
          d="M580,200 L580,15 L590,10 L600,5 L610,10 L620,15 L620,200 Z"
          fill="url(#arasakaGrad)"
        />
        {/* Neon glow at base */}
        <rect x="0" y="190" width="1200" height="10" fill="url(#skylineGrad)" />
      </svg>
      {/* Scattered neon lights on buildings */}
      <div className="absolute inset-0">
        {!reducedMotion && Array.from({ length: 40 }, (_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full animate-pulse"
            style={{
              left: `${5 + Math.random() * 90}%`,
              bottom: `${20 + Math.random() * 60}%`,
              background: ['#ff00ff', '#00ffff', '#ffff00', '#ff0066', '#00ff66'][Math.floor(Math.random() * 5)],
              boxShadow: `0 0 5px currentColor`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
      {/* Holo-ad projections */}
      <div className="absolute left-1/4 bottom-1/3 w-16 h-24 bg-gradient-to-t from-pink-500/20 to-transparent blur-sm" />
      <div className="absolute right-1/3 bottom-1/4 w-12 h-20 bg-gradient-to-t from-cyan-400/20 to-transparent blur-sm" />
    </div>
  )
}

// Art Section - Cyberpunk 2077 themed visual break with neon signs, circuits, and glitch effects
function CyberArtSection({ variant = 'neon' }: { variant?: 'neon' | 'circuit' | 'skyline' }) {
  const reducedMotion = useReducedMotion()
  const [glitchOffset, setGlitchOffset] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (reducedMotion) return
    const interval = setInterval(() => {
      if (Math.random() > 0.92) {
        setGlitchOffset({ x: Math.random() * 4 - 2, y: Math.random() * 2 - 1 })
        setTimeout(() => setGlitchOffset({ x: 0, y: 0 }), 80)
      }
    }, 100)
    return () => clearInterval(interval)
  }, [reducedMotion])

  if (variant === 'neon') {
    // Neon signs and holo-ads style break
    return (
      <div className="relative py-12 overflow-hidden" aria-hidden="true">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-500/5 to-transparent" />

        {/* Central neon bar */}
        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="flex items-center justify-center gap-4">
            {/* Left decorative circuit lines */}
            <div className="flex-1 h-px relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-cyan-400/60" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-cyan-400 rounded-full" style={{ boxShadow: '0 0 10px #00ffff, 0 0 20px #00ffff' }} />
              <div className="absolute right-8 top-1/2 -translate-y-1/2 w-1 h-1 bg-cyan-400/50 rounded-full" />
              <div className="absolute right-12 top-0 w-px h-4 bg-cyan-400/30" />
            </div>

            {/* Central neon sign */}
            <div
              className="relative px-8 py-3"
              style={{
                transform: !reducedMotion ? `translate(${glitchOffset.x}px, ${glitchOffset.y}px)` : 'none',
              }}
            >
              {/* Glitch layers */}
              {!reducedMotion && glitchOffset.x !== 0 && (
                <>
                  <div
                    className="absolute inset-0 text-center"
                    style={{
                      color: '#ff0066',
                      transform: 'translate(-2px, 0)',
                      opacity: 0.7,
                    }}
                  >
                    <span className="text-2xl font-bold tracking-[0.5em] font-mono">NIGHT_CITY</span>
                  </div>
                  <div
                    className="absolute inset-0 text-center"
                    style={{
                      color: '#00ffff',
                      transform: 'translate(2px, 0)',
                      opacity: 0.7,
                    }}
                  >
                    <span className="text-2xl font-bold tracking-[0.5em] font-mono">NIGHT_CITY</span>
                  </div>
                </>
              )}
              <div
                className="text-2xl font-bold tracking-[0.5em] font-mono relative z-10"
                style={{
                  color: '#ff00ff',
                  textShadow: '0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 40px #ff00ff',
                }}
              >
                NIGHT_CITY
              </div>
              <div className="text-center text-xs text-cyan-400/70 mt-1 tracking-[0.3em] font-mono">
                // SECTOR_WATSON //
              </div>
            </div>

            {/* Right decorative circuit lines */}
            <div className="flex-1 h-px relative">
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-pink-500/60" />
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-pink-500 rounded-full" style={{ boxShadow: '0 0 10px #ff00ff, 0 0 20px #ff00ff' }} />
              <div className="absolute left-8 top-1/2 -translate-y-1/2 w-1 h-1 bg-pink-500/50 rounded-full" />
              <div className="absolute left-12 top-0 w-px h-4 bg-pink-500/30" />
            </div>
          </div>

          {/* Japanese characters floating */}
          <div className="absolute top-2 left-1/4 text-cyan-400/20 text-sm font-mono">ネオン</div>
          <div className="absolute bottom-2 right-1/4 text-pink-500/20 text-sm font-mono">サイバー</div>
        </div>

        {/* Bottom accent line */}
        <div className="max-w-4xl mx-auto mt-6 px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-pink-500/30 via-cyan-400/30 to-transparent" />
        </div>
      </div>
    )
  }

  if (variant === 'circuit') {
    // Circuit board and data stream style break
    return (
      <div className="relative py-16 overflow-hidden" aria-hidden="true">
        {/* Circuit pattern background */}
        <svg className="absolute inset-0 w-full h-full opacity-20" preserveAspectRatio="none">
          <defs>
            <pattern id="artCircuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path
                d="M0,50 L30,50 L35,45 L65,45 L70,50 L100,50 M50,0 L50,20 L45,25 L45,75 L50,80 L50,100"
                fill="none"
                stroke="#00ffff"
                strokeWidth="0.5"
              />
              <circle cx="35" cy="45" r="3" fill="#ff00ff" />
              <circle cx="65" cy="45" r="3" fill="#00ffff" />
              <circle cx="50" cy="25" r="2" fill="#ffff00" />
              <circle cx="50" cy="75" r="2" fill="#ff0066" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#artCircuit)" />
        </svg>

        {/* Central data stream visualization */}
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="flex items-center justify-center gap-6">
            {/* Left data nodes */}
            <div className="flex items-center gap-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 border ${!reducedMotion ? 'animate-pulse' : ''}`}
                  style={{
                    borderColor: ['#ff00ff', '#00ffff', '#ffff00', '#ff0066', '#00ff66'][i],
                    background: `${['#ff00ff', '#00ffff', '#ffff00', '#ff0066', '#00ff66'][i]}30`,
                    animationDelay: `${i * 0.2}s`,
                    clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                  }}
                />
              ))}
            </div>

            {/* Central processing indicator */}
            <div className="px-6 py-2 border border-cyan-400/50 bg-black/60 relative">
              <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-pink-500" />
              <div className="absolute -top-1 -right-1 w-2 h-2 border-t border-r border-pink-500" />
              <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b border-l border-cyan-400" />
              <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-cyan-400" />
              <div className="text-xs font-mono text-cyan-400 tracking-wider">
                &lt;DATA_STREAM_ACTIVE/&gt;
              </div>
              <div className="text-[10px] font-mono text-pink-500/70 text-center mt-1">
                BANDWIDTH: UNLIMITED
              </div>
            </div>

            {/* Right data nodes */}
            <div className="flex items-center gap-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 border ${!reducedMotion ? 'animate-pulse' : ''}`}
                  style={{
                    borderColor: ['#00ff66', '#ff0066', '#ffff00', '#00ffff', '#ff00ff'][i],
                    background: `${['#00ff66', '#ff0066', '#ffff00', '#00ffff', '#ff00ff'][i]}30`,
                    animationDelay: `${i * 0.2}s`,
                    clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Scanning lines */}
          <div className="flex justify-center mt-4 gap-1">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-gradient-to-t from-cyan-400/60 to-transparent"
                style={{
                  height: `${10 + Math.sin(i * 0.5) * 8}px`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Skyline variant - Night City silhouette with neon lights
  return (
    <div className="relative py-10 overflow-hidden" aria-hidden="true">
      {/* Mini skyline */}
      <div className="max-w-4xl mx-auto px-6 relative">
        <svg viewBox="0 0 800 80" className="w-full h-20" preserveAspectRatio="none">
          <defs>
            <linearGradient id="artSkylineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1a0a2a" />
              <stop offset="100%" stopColor="#0a0512" />
            </linearGradient>
            <linearGradient id="artGlowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ff00ff" stopOpacity="0.5" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
          {/* Simplified skyline */}
          <path
            d="M0,80 L0,60 L40,60 L40,40 L60,40 L60,50 L100,50 L100,30 L120,30 L120,20 L140,20 L140,30 L160,30 L160,45 L200,45 L200,35 L240,35 L240,25 L260,25 L260,15 L280,15 L280,25 L300,25 L300,40 L340,40 L340,50 L380,50 L380,30 L400,30 L400,10 L420,10 L420,30 L440,30 L440,50 L480,50 L480,35 L520,35 L520,25 L540,25 L540,35 L560,35 L560,50 L600,50 L600,40 L640,40 L640,30 L660,30 L660,20 L680,20 L680,40 L720,40 L720,55 L760,55 L760,65 L800,65 L800,80 Z"
            fill="url(#artSkylineGrad)"
          />
          {/* Glow at base */}
          <rect x="0" y="75" width="800" height="5" fill="url(#artGlowGrad)" />
        </svg>

        {/* Floating neon elements */}
        <div className="absolute top-0 left-1/4 w-8 h-1 bg-pink-500/40" style={{ boxShadow: '0 0 10px #ff00ff' }} />
        <div className="absolute top-4 left-1/3 w-4 h-1 bg-cyan-400/40" style={{ boxShadow: '0 0 10px #00ffff' }} />
        <div className="absolute top-2 right-1/4 w-6 h-1 bg-yellow-400/40" style={{ boxShadow: '0 0 10px #ffff00' }} />
        <div className="absolute top-6 right-1/3 w-3 h-1 bg-pink-500/40" style={{ boxShadow: '0 0 10px #ff00ff' }} />

        {/* Central text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-xs font-mono text-white/30 tracking-[1em]">
            / / / / /
          </div>
        </div>
      </div>

      {/* Bottom decorative line */}
      <div className="max-w-6xl mx-auto px-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-pink-500/20 to-transparent" />
          <div className="text-[8px] font-mono text-cyan-400/30">ARASAKA_WATERFRONT</div>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />
        </div>
      </div>
    </div>
  )
}

// Cyberware icon - implant status indicators
function CyberwareIcon({ type }: { type: 'eye' | 'arm' | 'chip' | 'jack' }) {
  const icons = {
    eye: '⦿', // Kiroshi optics
    arm: '⟨⟩', // Gorilla arms
    chip: '◈', // Neural chip
    jack: '⌬', // Neural port
  }
  return (
    <span
      className="text-cyan-400 text-xs"
      style={{ textShadow: '0 0 5px #00ffff' }}
      role="img"
      aria-label={`${type} cyberware`}
    >
      {icons[type]}
    </span>
  )
}

// Tech skill chip with cyber styling - replaces proficiency bars with achievement style
function SkillChip({
  name,
  achievement
}: {
  name: string
  achievement?: string
}) {
  const colors = ['#ff00ff', '#00ffff', '#ffff00', '#ff0066', '#00ff66']
  const color = colors[name.length % colors.length]
  const reducedMotion = useReducedMotion()

  return (
    <div
      className="px-3 py-2 text-sm relative overflow-hidden group cursor-default transition-all hover:scale-105"
      style={{
        background: `${color}15`,
        border: `1px solid ${color}60`,
        color: color,
        clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)',
      }}
      role="listitem"
      aria-label={achievement ? `${name}: ${achievement}` : name}
    >
      {/* Scan line effect */}
      {!reducedMotion && (
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{
            background: `linear-gradient(90deg, transparent, ${color}40, transparent)`,
            animation: 'scan 0.8s ease-in-out infinite',
          }}
          aria-hidden="true"
        />
      )}
      <div className="relative z-10">
        <span className="font-mono font-bold">{name}</span>
        {achievement && (
          <span className="block text-sm text-white/60 mt-0.5 italic">{achievement}</span>
        )}
      </div>
    </div>
  )
}

// Role badge with cyber styling - active contracts display
function RoleBadge({
  title,
  company,
  type
}: {
  title: string
  company: string
  type: 'employment' | 'leadership'
}) {
  const color = type === 'leadership' ? '#ff00ff' : '#00ffff'
  const reducedMotion = useReducedMotion()

  return (
    <article
      className={`px-4 py-2 text-center transition-all hover:scale-105 ${!reducedMotion ? 'hover:shadow-lg' : ''}`}
      style={{
        background: `linear-gradient(135deg, ${color}15, transparent)`,
        border: `1px solid ${color}50`,
        clipPath: 'polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)',
        boxShadow: !reducedMotion ? `0 0 20px ${color}20` : undefined,
      }}
      aria-label={`${type === 'leadership' ? 'Leadership' : 'Employment'}: ${title} at ${company}`}
    >
      <div className="text-sm tracking-wider" style={{ color: color }}>
        {type === 'leadership' ? '// LEADERSHIP' : '// EMPLOYMENT'}
      </div>
      <div className="text-sm font-bold text-white">{title}</div>
      <div className="text-xs" style={{ color: color }}>{company}</div>
    </article>
  )
}

// Company card - Night City megacorp style (Arasaka, Militech, Kang Tao)
function CompanyCard({ company }: { company: typeof COMPANIES[0] }) {
  const reducedMotion = useReducedMotion()

  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block relative group"
      aria-label={`${company.name}: ${company.tagline}. ${company.description}`}
    >
      <div
        className={`p-4 transition-all ${!reducedMotion ? 'group-hover:scale-[1.02]' : ''}`}
        style={{
          background: 'linear-gradient(135deg, rgba(255,0,255,0.1), rgba(0,255,255,0.05))',
          border: '1px solid #ff00ff50',
          clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))',
        }}
      >
        {/* Corner cut decorations - megacorp badge style */}
        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-cyan-400/50" aria-hidden="true" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-pink-500/50" aria-hidden="true" />

        {/* Megacorp logo area */}
        <div className="absolute top-1 right-5 text-[6px] text-cyan-400/30 font-mono" aria-hidden="true">
          CORP_ID:{company.id.toUpperCase().slice(0, 4)}
        </div>

        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl" role="img" aria-hidden="true">{company.icon}</span>
          <div>
            <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
              {company.name}
            </h3>
            <p className="text-sm text-pink-500">{company.tagline}</p>
          </div>
        </div>
        <p className="text-xs text-white/70 mb-3">{company.description}</p>
        <div className="flex flex-wrap gap-1">
          {company.services.slice(0, 3).map((service) => (
            <span
              key={service}
              className="text-sm px-2 py-0.5 bg-cyan-400/10 border border-cyan-400/30 text-cyan-400"
            >
              {service}
            </span>
          ))}
        </div>

        {/* External link indicator */}
        <div
          className="absolute top-2 right-6 text-sm text-cyan-400/50 group-hover:text-cyan-400 transition-colors"
          aria-hidden="true"
        >
          [LINK]
        </div>
      </div>
    </a>
  )
}

// Band card - Johnny Silverhand style music legacy
function BandCard({ band }: { band: typeof BANDS[0] }) {
  const reducedMotion = useReducedMotion()

  const content = (
    <article
      className={`p-4 transition-all ${!reducedMotion ? 'hover:scale-[1.02]' : ''} group`}
      style={{
        background: 'linear-gradient(135deg, rgba(153,102,204,0.1), rgba(0,255,255,0.05))',
        border: '1px solid #9966cc50',
        clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))',
      }}
      aria-label={`Band: ${band.name} - ${band.genre}, Role: ${band.role}`}
    >
      <h3 className="text-sm font-bold text-white group-hover:text-pink-400 transition-colors">
        {band.name}
      </h3>
      <p className="text-sm mt-1" style={{ color: '#9966cc' }}>
        {band.genre} | {band.role}
      </p>
      <p className="text-xs text-white/70 mt-2">{band.description}</p>
      {band.url ? (
        <div className="text-sm text-cyan-400/70 mt-2">[STREAM_LINK]</div>
      ) : (
        <div className="text-sm text-white/30 mt-2 italic">[LINK_PENDING]</div>
      )}
    </article>
  )

  if (band.url) {
    return (
      <a href={band.url} target="_blank" rel="noopener noreferrer" className="block">
        {content}
      </a>
    )
  }
  return content
}

// Work experience card - cyber dossier / personnel file style
function ExperienceCard({ entry }: { entry: typeof EXPERIENCE_DATA[0] }) {
  const endDisplay = entry.endDate ? new Date(entry.endDate).getFullYear() : 'ACTIVE'
  const startDisplay = new Date(entry.startDate).getFullYear()
  const reducedMotion = useReducedMotion()

  return (
    <article
      className={`p-4 border border-white/10 transition-all ${!reducedMotion ? 'hover:border-cyan-400/50' : ''} group`}
      style={{
        background: 'linear-gradient(135deg, rgba(0,255,255,0.05), transparent)',
        clipPath: 'polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)',
      }}
      aria-label={`${entry.title} at ${entry.organization}, ${startDisplay} to ${endDisplay}`}
    >
      {/* Dossier classification marker */}
      <div className="absolute top-1 right-2 text-[6px] text-pink-500/30 font-mono" aria-hidden="true">
        FILE_#{entry.id.slice(-4).toUpperCase()}
      </div>

      {/* Header with title and dates */}
      <header className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-sm text-cyan-400 group-hover:text-pink-400 transition-colors font-mono">
            {entry.title}
          </h3>
          <div className="text-sm text-pink-500 mt-0.5">{entry.organization}</div>
        </div>
        <span className="text-sm text-white/50 font-mono px-2 py-0.5 bg-white/5 border border-white/10">
          {startDisplay} - {endDisplay}
        </span>
      </header>

      {/* Description */}
      <p className="text-[11px] text-white/70 mb-2 font-mono">{entry.description}</p>

      {/* Highlights as impact statements */}
      {entry.highlights && entry.highlights.length > 0 && (
        <ul className="space-y-1 mb-2" aria-label="Key achievements">
          {entry.highlights.map((highlight, i) => (
            <li key={i} className="text-sm text-cyan-400 flex items-start gap-2 font-mono">
              <span className="text-pink-500" aria-hidden="true">&gt;</span>
              {highlight}
            </li>
          ))}
        </ul>
      )}

      {/* Skills tags */}
      <div className="flex flex-wrap gap-1 mt-2" role="list" aria-label="Skills used">
        {entry.skills.slice(0, 5).map((skill) => (
          <span
            key={skill}
            className="text-sm px-2 py-0.5 bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 font-mono"
            role="listitem"
          >
            {skill}
          </span>
        ))}
      </div>
    </article>
  )
}

// Tech category display - cyberware/netrunner deck style
function TechCategory({ category }: { category: ReturnType<typeof getEngineerSkills>[0] }) {
  return (
    <div className="mb-4" role="region" aria-labelledby={`tech-cat-${category.name.toLowerCase().replace(/\s+/g, '-')}`}>
      <header className="flex items-center gap-2 mb-2">
        <span className="text-base" role="img" aria-hidden="true">{category.icon}</span>
        <h3
          id={`tech-cat-${category.name.toLowerCase().replace(/\s+/g, '-')}`}
          className="text-xs text-pink-500 tracking-wider font-mono"
        >
          {category.name.toUpperCase()}
        </h3>
        <div className="flex-1 h-px bg-gradient-to-r from-pink-500/30 to-transparent" aria-hidden="true" />
      </header>
      <div className="flex flex-wrap gap-2" role="list" aria-label={`${category.name} technologies`}>
        {category.items.map((tech, i) => (
          <span
            key={tech}
            className="px-2 py-1 text-sm font-mono transition-all hover:scale-105 cursor-default"
            style={{
              background: `${['#ff00ff', '#00ffff', '#ffff00', '#00ff66', '#ff6600'][i % 5]}15`,
              border: `1px solid ${['#ff00ff', '#00ffff', '#ffff00', '#00ff66', '#ff6600'][i % 5]}40`,
              color: ['#ff00ff', '#00ffff', '#ffff00', '#00ff66', '#ff6600'][i % 5],
            }}
            role="listitem"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  )
}

// Drummer/Fighter skills with achievements instead of proficiency bars
function SkillCategoryDisplay({ category }: { category: ReturnType<typeof getSkillsByProfession>[0] }) {
  // Map proficiency to achievement/context descriptions
  const getAchievementText = (skillName: string, proficiency: number): string | undefined => {
    // Generate contextual achievement text based on skill type
    if (proficiency >= 5) return 'Expert level'
    if (proficiency >= 4) return 'Advanced'
    if (proficiency >= 3) return 'Proficient'
    return undefined
  }

  return (
    <div className="mb-4 last:mb-0" role="region" aria-labelledby={`skill-cat-${category.name.toLowerCase().replace(/\s+/g, '-')}`}>
      <header className="flex items-center gap-2 mb-2">
        <span role="img" aria-hidden="true">{category.icon}</span>
        <h3
          id={`skill-cat-${category.name.toLowerCase().replace(/\s+/g, '-')}`}
          className="text-xs text-pink-500 font-mono tracking-wider"
        >
          {category.name.toUpperCase()}:
        </h3>
      </header>
      <div className="flex flex-wrap gap-2" role="list">
        {category.skills.map((skill) => (
          <SkillChip
            key={skill.name}
            name={skill.name}
            achievement={getAchievementText(skill.name, skill.proficiency)}
          />
        ))}
      </div>
    </div>
  )
}

// Chromatic aberration border effect
function ChromaticBorder({ children }: { children: React.ReactNode }) {
  const reducedMotion = useReducedMotion()

  return (
    <div className="relative">
      {!reducedMotion && (
        <>
          <div
            className="absolute -inset-px opacity-50 blur-[1px]"
            style={{
              background: 'linear-gradient(45deg, #ff0066, transparent, #00ffff)',
              transform: 'translate(-2px, 0)',
            }}
            aria-hidden="true"
          />
          <div
            className="absolute -inset-px opacity-50 blur-[1px]"
            style={{
              background: 'linear-gradient(45deg, #00ffff, transparent, #ff0066)',
              transform: 'translate(2px, 0)',
            }}
            aria-hidden="true"
          />
        </>
      )}
      {children}
    </div>
  )
}

export default function NeonCyberTheme() {
  const { theme } = useTheme()
  const { active, setActive, config } = useProfession()
  const [mounted, setMounted] = useState(false)
  const [glitchScreen, setGlitchScreen] = useState(false)
  const [screenTear, setScreenTear] = useState<number | null>(null)
  const reducedMotion = useReducedMotion()

  const aboutData = ABOUT_DATA[active]
  const engineerTech = getEngineerSkills()
  const otherSkills = getSkillsByProfession(active)
  const projects = PROJECTS_DATA.filter(p => p.professions.includes(active) || p.featured)
  const experience = filterExperienceByProfession(EXPERIENCE_DATA, active)

  useEffect(() => {
    setMounted(true)

    if (reducedMotion) return

    // Random screen glitch and tear effects
    const interval = setInterval(() => {
      const rand = Math.random()
      if (rand > 0.98) {
        setGlitchScreen(true)
        setTimeout(() => setGlitchScreen(false), 100 + Math.random() * 100)
      }
      if (rand > 0.97 && rand <= 0.98) {
        setScreenTear(Math.random() * 80 + 10)
        setTimeout(() => setScreenTear(null), 50)
      }
    }, 100)

    return () => clearInterval(interval)
  }, [reducedMotion])

  if (!mounted) return null

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0a0512 0%, #150a20 50%, #0a0512 100%)',
        fontFamily: '"Share Tech Mono", "Courier New", monospace',
        transform: glitchScreen && !reducedMotion ? `translateX(${Math.random() * 8 - 4}px)` : 'none',
      }}
      role="main"
      aria-label="Alexander Pulido - Cyberpunk themed portfolio"
    >
      {/* Screen tear effect */}
      {screenTear && !reducedMotion && (
        <div
          className="fixed left-0 right-0 h-2 z-50 pointer-events-none"
          style={{
            top: `${screenTear}%`,
            background: 'linear-gradient(90deg, #ff00ff, #00ffff)',
            mixBlendMode: 'screen',
          }}
          aria-hidden="true"
        />
      )}

      {/* Data stream background */}
      <DataStream />

      {/* Rain effect - Night City atmosphere */}
      <RainOverlay />

      {/* Night City skyline */}
      <NightCitySkyline />

      {/* Scanlines - CRT monitor effect */}
      <div
        className="fixed inset-0 pointer-events-none z-[5]"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,255,0.02) 2px, rgba(0,255,255,0.02) 4px)',
        }}
        aria-hidden="true"
      />

      {/* Chromatic aberration on edges */}
      <div
        className="fixed inset-0 pointer-events-none z-[6]"
        style={{
          boxShadow: 'inset 0 0 150px rgba(255,0,255,0.15), inset 0 0 300px rgba(0,255,255,0.08)',
        }}
        aria-hidden="true"
      />

      {/* CRT vignette */}
      <div
        className="fixed inset-0 pointer-events-none z-[7]"
        style={{
          background: 'radial-gradient(circle at 50% 50%, transparent 40%, rgba(0,0,0,0.8) 100%)',
        }}
        aria-hidden="true"
      />

      {/* Top HUD elements - Kiroshi optics overlay style */}
      <div
        className="fixed top-4 left-4 z-40 text-sm text-cyan-400/50 font-mono space-y-1"
        role="presentation"
        aria-hidden="true"
      >
        <div>SYS_STATUS: ONLINE</div>
        <div>NET_LINK: STABLE</div>
        <div>ICE_BYPASS: ACTIVE</div>
        <div className="mt-2 text-pink-500/50">THREAT_LVL: MINIMAL</div>
      </div>
      <div
        className="fixed top-4 right-20 z-40 text-sm text-pink-500/50 font-mono text-right space-y-1"
        role="presentation"
        aria-hidden="true"
      >
        <div>LOC: NIGHT_CITY</div>
        <div>SECTOR: WATSON</div>
        <div>TIME: {new Date().toLocaleTimeString('en-US', { hour12: false })}</div>
        <div className="mt-2 text-cyan-400/50">EDDIES: ∞</div>
      </div>

      {/* Header */}
      <header className="relative z-30 p-6 pt-16">
        <div className="max-w-6xl mx-auto">
          <ChromaticBorder>
            <ScannerCorners>
              <div className="p-4 bg-black/40">
                <div className="flex justify-between items-start flex-wrap gap-4">
                  <div>
                    <h1 className="text-4xl tracking-[0.2em] font-bold">
                      <GlitchText text="ALEXANDER" className="text-pink-500" intensity="high" />
                      <span className="text-white mx-2" aria-hidden="true">{'/'}</span>
                      <GlitchText text="PULIDO" className="text-cyan-400" intensity="high" />
                    </h1>
                    <p className="mt-3 text-sm text-white/90">
                      {PROFESSIONAL_SUMMARY.headline}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span
                        className={`w-2 h-2 rounded-full bg-green-400 ${!reducedMotion ? 'animate-pulse' : ''}`}
                        style={{ boxShadow: '0 0 10px #00ff00' }}
                        aria-label="Online status indicator"
                      />
                      <span className="text-xs text-pink-500 tracking-wider italic">
                        &quot;{PROFESSIONAL_SUMMARY.tagline}&quot;
                      </span>
                    </div>
                  </div>

                  <nav className="flex gap-3 items-center flex-wrap" aria-label="Main navigation">
                    <Link
                      href="/cv"
                      className="px-4 py-2 text-xs tracking-wider border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all font-mono"
                      style={{ clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }}
                      aria-label="Download CV"
                    >
                      [DOWNLOAD.exe]
                    </Link>
                    <Link
                      href="/personal-projects/game-engine"
                      className="px-4 py-2 text-xs tracking-wider bg-pink-500 text-black hover:bg-pink-400 transition-all font-mono"
                      style={{ clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }}
                      aria-label="View Nebulith game engine project"
                    >
                      [NEBULITH.run]
                    </Link>
                    <ThemeSwitcher />
                  </nav>
                </div>
              </div>
            </ScannerCorners>
          </ChromaticBorder>
        </div>
      </header>

      {/* Current Roles - Active contracts */}
      <section className="relative z-20 py-6 px-6" aria-labelledby="roles-heading">
        <div className="max-w-6xl mx-auto">
          <h2 id="roles-heading" className="text-center mb-4">
            <span className="text-sm tracking-[0.3em] text-cyan-400/70 font-mono">
              {'//'} ACTIVE_CONTRACTS
            </span>
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {CURRENT_ROLES.map((role) => (
              <RoleBadge
                key={role.id}
                title={role.title}
                company={role.company}
                type={role.type}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Neon signs - Night City advertising */}
      <div className="relative z-20 py-4" aria-hidden="true">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-center gap-8 flex-wrap">
            <NeonSign text="NETRUNNER" subtext="CODE_MASTER" color="#00ffff" />
            <NeonSign text="CHROME" subtext="FULL_STACK" color="#ff00ff" />
            <NeonSign text="PREEM" subtext="ENGINEER" color="#ffff00" />
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="relative z-20 px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Terminal header - V's access point */}
          <HolographicShimmer intensity="low">
            <div className="mb-8 p-4 bg-black/80 border border-cyan-400/30" role="region" aria-label="System terminal">
              <div className="flex items-center gap-2 mb-4" aria-hidden="true">
                <div className="w-3 h-3 rounded-full bg-red-500" style={{ boxShadow: '0 0 5px #ff0000' }} />
                <div className="w-3 h-3 rounded-full bg-yellow-500" style={{ boxShadow: '0 0 5px #ffff00' }} />
                <div className="w-3 h-3 rounded-full bg-green-500" style={{ boxShadow: '0 0 5px #00ff00' }} />
                <span className="ml-4 text-xs text-white/50 font-mono">v-term@night-city:~</span>
              </div>
              <TerminalLine prefix="$ " text="cat /netrunner/alex/profile.db" delay={0} />
              <TerminalLine prefix="> " text={PROFESSIONAL_SUMMARY[active].tagline} delay={800} />
              <TerminalLine prefix="$ " text={`set PROFESSION=${active.toUpperCase()}`} delay={2500} />
            </div>
          </HolographicShimmer>

          {/* Profession selector - Cyberware slot selection */}
          <div
            className="grid grid-cols-3 gap-4 mb-8"
            role="tablist"
            aria-label="Select profession view"
          >
            {(['engineer', 'drummer', 'fighter'] as const).map((prof) => (
              <button
                key={prof}
                onClick={() => setActive(prof)}
                role="tab"
                aria-selected={active === prof}
                aria-controls={`profession-panel-${prof}`}
                className={`p-4 text-left transition-all relative overflow-hidden ${
                  active === prof ? 'scale-105' : 'opacity-60 hover:opacity-100'
                }`}
                style={{
                  background: active === prof
                    ? 'linear-gradient(135deg, rgba(255,0,255,0.2), rgba(0,255,255,0.1))'
                    : 'rgba(0,255,255,0.05)',
                  border: `2px solid ${active === prof ? '#ff00ff' : '#00ffff40'}`,
                  clipPath: 'polygon(15px 0, 100% 0, calc(100% - 15px) 100%, 0 100%)',
                }}
              >
                {/* Animated scan line */}
                {active === prof && !reducedMotion && (
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{
                      background: 'linear-gradient(90deg, transparent, #ff00ff, transparent)',
                      animation: 'scan 2s linear infinite',
                    }}
                    aria-hidden="true"
                  />
                )}

                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <CyberwareIcon type={prof === 'engineer' ? 'chip' : prof === 'drummer' ? 'jack' : 'arm'} />
                    <span
                      className="text-sm tracking-wider font-mono"
                      style={{ color: active === prof ? '#ff00ff' : '#00ffff' }}
                    >
                      {prof.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-white/50 block font-mono">
                    {prof === 'engineer' ? 'EXP: 10+ YEARS' : prof === 'drummer' ? 'EXP: 15 YEARS' : 'EXP: 6 YEARS'}
                  </span>
                  {active === prof && (
                    <span className="text-sm text-green-400 block mt-1 font-mono">[ACTIVE]</span>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* About section - Personnel dossier */}
          <div className="mb-8" id={`profession-panel-${active}`} role="tabpanel" aria-label={`${active} profession details`}>
            <CyberPanel title="About" accentColor="#ffff00" holographic>
              <p className="text-sm text-white/80 leading-relaxed mb-4 font-mono">{aboutData.bio}</p>
              <div className="flex flex-wrap gap-2" role="list" aria-label="Quick facts">
                {aboutData.quickFacts.map((fact, i) => (
                  <span
                    key={i}
                    className="text-sm px-2 py-1 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 font-mono"
                    role="listitem"
                  >
                    [{fact}]
                  </span>
                ))}
              </div>
            </CyberPanel>
          </div>

          {/* ART SECTION 1 - Neon signs break */}
          <CyberArtSection variant="neon" />

          {/* Work Experience section - Completed gigs dossier */}
          {experience.length > 0 && (
            <div className="mb-8">
              <CyberPanel title="Work Experience" accentColor="#00ff66" holographic>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                  {experience.map((entry) => (
                    <ExperienceCard key={entry.id} entry={entry} />
                  ))}
                </div>
              </CyberPanel>
            </div>
          )}

          {/* ART SECTION 2 - Circuit board break */}
          <CyberArtSection variant="circuit" />

          {/* Tech Stack / Skills panel */}
          <div className="mb-8">
            <CyberPanel
              title={active === 'engineer' ? 'Tech Stack' : 'Skills'}
              accentColor="#00ffff"
              holographic
              megacorpStyle={active === 'engineer'}
            >
              {active === 'engineer' ? (
                <div className="max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                  {engineerTech.map((category) => (
                    <TechCategory key={category.name} category={category} />
                  ))}
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                  {otherSkills.map((category) => (
                    <SkillCategoryDisplay key={category.name} category={category} />
                  ))}
                </div>
              )}
            </CyberPanel>
          </div>

          {/* Featured Work (Projects) panel */}
          <div className="mb-8">
            <CyberPanel title="Featured Work" accentColor="#ff00ff" holographic>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                {projects.slice(0, 5).map((project) => (
                  <article
                    key={project.id}
                    className={`p-3 border border-white/10 ${!reducedMotion ? 'hover:border-pink-500/50' : ''} transition-colors cursor-pointer group`}
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,0,255,0.05), transparent)',
                    }}
                    aria-label={`Project: ${project.name} - ${project.tagline}`}
                  >
                    <header className="flex justify-between items-start">
                      <h3 className="text-sm text-cyan-400 group-hover:text-pink-400 transition-colors font-mono">
                        {project.name}
                      </h3>
                      {project.featured && (
                        <span className="text-sm px-2 py-0.5 bg-yellow-400 text-black font-bold">
                          PREEM
                        </span>
                      )}
                    </header>
                    <p className="text-sm text-white/50 mt-1">{project.tagline}</p>
                    {project.impact && (
                      <p className="text-sm text-pink-500 mt-1 italic">&gt; {project.impact}</p>
                    )}
                    <div className="flex gap-2 mt-2 flex-wrap" role="list" aria-label="Technologies used">
                      {project.techStack.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="text-sm px-1 py-0.5 bg-white/5 text-cyan-400 font-mono"
                          role="listitem"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </CyberPanel>
          </div>

          {/* ART SECTION 3 - Night City skyline break */}
          <CyberArtSection variant="skyline" />

          {/* Ventures section - Companies (Engineer) - Megacorp affiliations */}
          {active === 'engineer' && (
            <div className="mb-8">
              <CyberPanel title="Ventures" accentColor="#ff00ff" holographic megacorpStyle>
                <div className="grid md:grid-cols-3 gap-4">
                  {COMPANIES.map((company) => (
                    <CompanyCard key={company.id} company={company} />
                  ))}
                </div>
              </CyberPanel>
            </div>
          )}

          {/* Ventures section - Bands (Drummer) - Rockerboy legacy */}
          {active === 'drummer' && (
            <div className="mb-8">
              <CyberPanel title="Bands" accentColor="#9966cc" holographic>
                <div className="grid md:grid-cols-3 gap-4">
                  {BANDS.map((band) => (
                    <BandCard key={band.id} band={band} />
                  ))}
                </div>
              </CyberPanel>
            </div>
          )}

          {/* Posts section - placeholder for future blog/posts content */}
          <div className="mb-8">
            <CyberPanel title="Posts" accentColor="#ff6600" holographic>
              <div className="text-center py-8">
                <div className="text-6xl mb-4 text-white/20 font-mono">&#123; &#125;</div>
                <p className="text-sm text-white/50 font-mono tracking-wider">
                  // DATA_FEED_PENDING
                </p>
                <p className="text-xs text-cyan-400/50 mt-2 font-mono">
                  Neural link required for content sync
                </p>
              </div>
            </CyberPanel>
          </div>
        </div>
      </main>

      {/* Contact CTA */}
      <section className="relative z-20 py-16 px-6" aria-label="Contact">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <h2 className="text-xl tracking-wider mb-3 font-mono" style={{ color: '#00ffff' }}>
              READY_TO_JACK_IN?
            </h2>
            <p className="text-sm font-mono" style={{ color: '#ff00ff' }}>
              10+ years delivering production systems. Let&apos;s build something.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:alexanderpulido81@gmail.com"
              className="inline-flex items-center justify-center px-6 py-3 text-sm tracking-wider uppercase transition-all hover:scale-105 min-h-[44px] font-mono focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              style={{
                background: 'linear-gradient(90deg, #00ffff, #ff00ff)',
                color: '#0a0a0a',
              }}
            >
              ESTABLISH_LINK
            </a>
            <Link
              href="/cv"
              className="inline-flex items-center justify-center px-6 py-3 text-sm tracking-wider uppercase transition-all hover:scale-105 min-h-[44px] font-mono focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              style={{
                background: 'transparent',
                border: '2px solid #00ffff',
                color: '#00ffff',
              }}
            >
              DOWNLOAD_CV.exe
            </Link>
          </div>
        </div>
      </section>

      {/* Footer - System status */}
      <footer className="relative z-20 py-8 text-center" role="contentinfo">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent" aria-hidden="true" />
          <span className="text-xs text-cyan-400/50 tracking-[0.3em] font-mono">NIGHT_CITY // {new Date().getFullYear()}</span>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-pink-500 to-transparent" aria-hidden="true" />
        </div>
        <p className="text-sm text-white/30 tracking-widest font-mono">
          © {new Date().getFullYear()} Alexander Pulido
        </p>
      </footer>

      {/* Animations - includes prefers-reduced-motion support */}
      <style jsx global>{`
        @keyframes fall {
          0% { transform: translateY(-100vh); opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        @keyframes rain {
          0% { transform: translateY(-100vh); }
          100% { transform: translateY(100vh); }
        }
        @keyframes scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes holo-shimmer {
          0% { background-position: 200% 200%; }
          100% { background-position: -200% -200%; }
        }
        .animate-fall {
          animation: fall linear infinite;
        }
        .animate-rain {
          animation: rain linear infinite;
        }
        .animate-holo-shimmer {
          animation: holo-shimmer 3s ease-in-out infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 255, 255, 0.1);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #ff00ff, #00ffff);
          border-radius: 2px;
        }

        /* Respect reduced motion preferences */
        @media (prefers-reduced-motion: reduce) {
          .animate-fall,
          .animate-rain,
          .animate-pulse,
          .animate-holo-shimmer {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  )
}
