'use client'

import { useEffect, useState } from 'react'
import { useReducedMotion } from './motion'

// Intense glitch text effect with RGB split - Cyberpunk 2077 style chromatic aberration
export function GlitchText({
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
export function NeonSign({
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
export function TerminalLine({
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
export function ScannerCorners({
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

// Holographic shimmer effect - like holo-ads in Night City
export function HolographicShimmer({
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
export function CircuitPattern({ color = '#ff00ff' }: { color?: string }) {
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

// Cyberware icon - implant status indicators
export function CyberwareIcon({ type }: { type: 'eye' | 'arm' | 'chip' | 'jack' }) {
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

// Chromatic aberration border effect
export function ChromaticBorder({ children }: { children: React.ReactNode }) {
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
