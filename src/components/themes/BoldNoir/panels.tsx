'use client'

import { useEffect, useState } from 'react'

// Persona-style skewed panel
export function SkewedPanel({
  children,
  color = '#ff0033',
  direction = 'right',
  delay = 0,
}: {
  children: React.ReactNode
  color?: string
  direction?: 'left' | 'right'
  delay?: number
}) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(timeout)
  }, [delay])

  return (
    <div
      className={`relative transition-all duration-500 ${
        visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
      }`}
      style={{
        transform: `skewX(${direction === 'right' ? '-3' : '3'}deg) ${visible ? '' : 'translateX(50px)'}`,
      }}
    >
      {/* Red accent bar */}
      <div
        className="absolute top-0 left-0 w-2 h-full"
        style={{ background: color }}
      />
      {/* Content */}
      <div
        className="pl-6 pr-4 py-4"
        style={{
          background: 'linear-gradient(90deg, rgba(26, 10, 10, 0.95), rgba(10, 10, 10, 0.8))',
          borderLeft: `4px solid ${color}`,
        }}
      >
        <div style={{ transform: `skewX(${direction === 'right' ? '3' : '-3'}deg)` }}>
          {children}
        </div>
      </div>
    </div>
  )
}

// ALL OUT ATTACK splash for featured items
export function AllOutAttackSplash({ children, featured = false }: { children: React.ReactNode; featured?: boolean }) {
  if (!featured) return <>{children}</>

  return (
    <div className="relative group">
      {/* Splash background */}
      <div
        className="absolute -inset-2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, rgba(255,0,51,0.4) 0%, transparent 70%)`,
          filter: 'blur(10px)',
        }}
      />
      {/* Speed lines */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent"
            style={{
              top: `${10 + i * 12}%`,
              left: '-20%',
              right: '-20%',
              transform: `rotate(${-5 + Math.random() * 10}deg)`,
            }}
          />
        ))}
      </div>
      {children}
    </div>
  )
}

// Dramatic TAKE YOUR TIME - iconic Persona 5 loading screen text
export function TakeYourTime({ prefersReducedMotion = false }: { prefersReducedMotion?: boolean }) {
  const [phase, setPhase] = useState(prefersReducedMotion ? 3 : 0)

  useEffect(() => {
    if (prefersReducedMotion) return

    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1000),
      setTimeout(() => setPhase(3), 1500),
    ]
    return () => timers.forEach(clearTimeout)
  }, [prefersReducedMotion])

  return (
    <div
      className="relative h-32 flex items-center justify-center overflow-hidden"
      role="banner"
      aria-label="Take Your Time - Persona 5 style welcome message"
    >
      {/* Background splash with paint splatter effect */}
      <div
        className={`absolute inset-0 transition-all duration-500 ${phase >= 1 ? 'opacity-100' : 'opacity-0'}`}
        style={{
          background: `radial-gradient(ellipse at center, rgba(255,0,51,0.2) 0%, transparent 70%),
                       radial-gradient(circle at 20% 60%, rgba(255,0,51,0.15) 0%, transparent 30%),
                       radial-gradient(circle at 80% 40%, rgba(255,0,51,0.1) 0%, transparent 25%)`,
        }}
        aria-hidden="true"
      />

      {/* Speed lines - manga action effect */}
      {!prefersReducedMotion && (
        <div
          className={`absolute inset-0 overflow-hidden transition-opacity duration-500 ${phase >= 2 ? 'opacity-30' : 'opacity-0'}`}
          aria-hidden="true"
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute h-0.5 animate-speed-line"
              style={{
                top: `${5 + i * 8}%`,
                left: '-100%',
                right: '-100%',
                background: 'linear-gradient(90deg, transparent, #ff0033, transparent)',
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Main text - ALL CAPS bold Persona style */}
      <div
        className={`relative transition-all duration-700 ${phase >= 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-150'}`}
        style={{ transform: prefersReducedMotion ? 'none' : 'skewX(-5deg)' }}
      >
        <span
          className={`text-5xl sm:text-6xl md:text-7xl font-black tracking-widest ${prefersReducedMotion ? '' : 'animate-pulse'}`}
          style={{
            color: '#ff0033',
            textShadow: '4px 4px 0 #000, 8px 8px 0 #330011, -2px -2px 0 #ff003380',
            WebkitTextStroke: '2px #330011',
          }}
        >
          TAKE YOUR TIME
        </span>

        {/* Brush stroke underline */}
        <div
          className="absolute -bottom-2 left-1/4 right-1/4 h-1"
          style={{
            background: 'linear-gradient(90deg, transparent, #ff0033, transparent)',
          }}
          aria-hidden="true"
        />

        {/* Ink splatter accents */}
        <div
          className="absolute -top-4 -left-8 w-6 h-6 rounded-full opacity-40"
          style={{ background: '#ff0033', filter: 'blur(3px)' }}
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-4 -right-6 w-4 h-4 rounded-full opacity-30"
          style={{ background: '#ff0033', filter: 'blur(2px)' }}
          aria-hidden="true"
        />
      </div>

      {/* Card suits decoration - Persona 5 motif */}
      <span
        className={`absolute left-4 top-1/2 -translate-y-1/2 text-4xl transition-all duration-500 ${phase >= 2 ? 'opacity-30' : 'opacity-0'}`}
        style={{ color: '#ff0033' }}
        aria-hidden="true"
      >
        ♠
      </span>
      <span
        className={`absolute right-4 top-1/2 -translate-y-1/2 text-4xl transition-all duration-500 ${phase >= 2 ? 'opacity-30' : 'opacity-0'}`}
        style={{ color: '#ff0033' }}
        aria-hidden="true"
      >
        ♥
      </span>
    </div>
  )
}

export function skew(prefersReducedMotion: boolean, deg: number): string {
  return prefersReducedMotion ? 'none' : `skewX(${deg}deg)`
}

export function SectionHeading({ children, prefersReducedMotion }: { children: React.ReactNode; prefersReducedMotion: boolean }) {
  return (
    <h2
      className="mb-4 text-xl font-black"
      style={{ color: '#ff0033', transform: skew(prefersReducedMotion, -3) }}
    >
      {children}
    </h2>
  )
}
