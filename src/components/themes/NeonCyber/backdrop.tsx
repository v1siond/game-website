'use client'

import { useEffect, useState } from 'react'
import { useReducedMotion } from './motion'

// Rain effect overlay - Night City constant rain
export function RainOverlay() {
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

// Matrix-like data stream background with Japanese katakana - Net architecture visualization
export function DataStream() {
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
export function NightCitySkyline() {
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
export function CyberArtSection({ variant = 'neon' }: { variant?: 'neon' | 'circuit' | 'skyline' }) {
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
                {'// SECTOR_WATSON //'}
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
