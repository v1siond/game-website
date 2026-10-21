'use client'

import { useEffect, useState, type CSSProperties } from 'react'
import { useReducedMotion } from './motion'

// The fixed backdrop loops run all the time, so they are kept few: with the hero's status dot, the
// selector's scan line and the two glitch names they hold 14 animated elements, which leaves the
// scroll scenes room under the world's limit of 30 in view.
const RAIN_DROPS = 6
const STREAM_GLYPHS = 4

// Rain effect overlay - Night City constant rain
export function RainOverlay() {
  const reducedMotion = useReducedMotion()
  const [drops, setDrops] = useState<Array<{ id: number; x: number; delay: number; duration: number; opacity: number }>>([])

  useEffect(() => {
    if (reducedMotion) return

    const newDrops = Array.from({ length: RAIN_DROPS }, (_, i) => ({
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
    const newChars = Array.from({ length: STREAM_GLYPHS }, (_, i) => ({
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
          className="absolute text-cyan-400 text-sm animate-fall font-mono"
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

const LIGHT_COLORS = ['bg-[#ff00ff]', 'bg-[#00ffff]', 'bg-[#ffff00]', 'bg-[#ff0066]', 'bg-[#00ff66]']

// Spread by the golden ratio so the lights scatter evenly and land in the same places every render.
const SKYLINE_LIGHTS = Array.from({ length: 16 }, (_, i) => ({
  left: Math.round(5 + ((i * 61.8) % 90)),
  bottom: Math.round(20 + ((i * 38.2) % 60)),
  color: LIGHT_COLORS[i % LIGHT_COLORS.length],
}))

// Night City skyline silhouette - iconic megabuildings
export function NightCitySkyline() {

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
      {/* Neon lights on the buildings: fixed places and colours, lit, not animated */}
      <div className="absolute inset-0">
        {SKYLINE_LIGHTS.map(({ left, bottom, color }) => (
          <span key={`${left}-${bottom}`} className={`absolute w-1 h-1 rounded-full ${color} left-[var(--x)] bottom-[var(--y)]`} style={{ '--x': `${left}%`, '--y': `${bottom}%` } as CSSProperties} />
        ))}
      </div>
      {/* Holo-ad projections */}
      <div className="absolute left-1/4 bottom-1/3 w-16 h-24 bg-gradient-to-t from-pink-500/20 to-transparent" />
      <div className="absolute right-1/3 bottom-1/4 w-12 h-20 bg-gradient-to-t from-cyan-400/20 to-transparent" />
    </div>
  )
}
