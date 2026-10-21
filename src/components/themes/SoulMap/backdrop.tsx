'use client'

import { useReducedMotion } from '@/hooks/useReducedMotion'
import { COLORS } from './palette'

// Knight silhouette - hollowed form
export function HollowKnight({ variant = 'standing', className = '' }: { variant?: 'standing' | 'kneeling' | 'combat'; className?: string }) {
  const paths = {
    standing: 'M50 15 L47 20 L53 20 Z M45 22 L50 45 L55 22 Z M43 25 L35 35 L37 36 L44 28 Z M57 25 L65 35 L63 36 L56 28 Z M46 42 L44 70 L48 70 L50 50 L52 70 L56 70 L54 42 Z',
    kneeling: 'M50 25 L47 30 L53 30 Z M45 32 L50 50 L55 32 Z M43 35 L30 40 L32 42 L44 38 Z M50 48 L45 65 L50 60 L55 65 L50 48 Z M42 60 L38 70 L50 70 L45 60 Z M58 60 L62 70 L50 70 L55 60 Z',
    combat: 'M50 15 L47 20 L53 20 Z M45 22 L50 40 L55 22 Z M43 25 L25 20 L26 23 L42 28 Z M57 25 L75 35 L73 38 L56 30 Z M46 38 L44 65 L48 65 L50 45 L52 65 L56 65 L54 38 Z',
  }

  return (
    <div
      className={`opacity-20 ${className}`}
      role="img"
      aria-label={`Hollow knight silhouette in ${variant} pose`}
    >
      <svg viewBox="0 0 100 80" fill={COLORS.ash} width="60" height="48">
        <path d={paths[variant]} />
      </svg>
    </div>
  )
}

// Gothic stone texture overlay
export function StoneTexture() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[1] opacity-[0.03]"
      aria-hidden="true"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
      }}
    />
  )
}

// Profession-specific ember ornaments
export function EmberOrnaments({ profession }: { profession: 'engineer' | 'drummer' | 'fighter' }) {
  const prefersReducedMotion = useReducedMotion()

  const ornamentsByProfession = {
    engineer: [
      { icon: '⚙️', x: 5, y: 20, size: 28 },
      { icon: '💻', x: 92, y: 30, size: 26 },
      { icon: '🔧', x: 6, y: 70, size: 24 },
      { icon: '📟', x: 90, y: 75, size: 26 },
    ],
    drummer: [
      { icon: '🥁', x: 4, y: 25, size: 30 },
      { icon: '🎹', x: 90, y: 20, size: 28 },
      { icon: '🎵', x: 6, y: 65, size: 24 },
      { icon: '🎶', x: 92, y: 70, size: 26 },
    ],
    fighter: [
      { icon: '⚔️', x: 5, y: 22, size: 28 },
      { icon: '🛡️', x: 90, y: 28, size: 26 },
      { icon: '👊', x: 6, y: 68, size: 26 },
      { icon: '🔥', x: 92, y: 72, size: 28 },
    ],
  }

  const items = ornamentsByProfession[profession]

  if (prefersReducedMotion) {
    return (
      <div className="fixed inset-0 pointer-events-none z-[4] overflow-hidden" aria-hidden="true">
        {items.map((item, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              fontSize: item.size,
              opacity: 0.3,
              filter: `drop-shadow(0 0 8px ${COLORS.bonfire}99)`,
            }}
          >
            {item.icon}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-[4] overflow-hidden" aria-hidden="true">
      {items.map((item, i) => (
        <div
          key={i}
          className="absolute animate-ember-float"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            fontSize: item.size,
            opacity: 0.4,
            filter: `drop-shadow(0 0 8px ${COLORS.bonfire}99)`,
            animation: `emberFloat ${12 + i * 3}s ease-in-out infinite`,
            animationDelay: `${-i * 2}s`,
          }}
        >
          {item.icon}
        </div>
      ))}
    </div>
  )
}

// Souls counter - floating soul particles
export function SoulsCounter({ count }: { count: number }) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div
      className="fixed top-6 right-24 z-40 flex items-center gap-2"
      role="status"
      aria-label={`Souls: ${count.toLocaleString()}`}
    >
      <div className="relative">
        <div
          className={`w-6 h-6 rounded-full ${!prefersReducedMotion ? 'animate-pulse' : ''}`}
          style={{
            background: `radial-gradient(circle at 30% 30%, ${COLORS.soul}, #00aacc 50%, #006688)`,
            boxShadow: `0 0 15px ${COLORS.soul}, 0 0 30px #00aacc40`,
          }}
          aria-hidden="true"
        />
        {!prefersReducedMotion && [...Array(4)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-cyan-400 animate-soul-float"
            style={{
              left: '50%',
              top: '50%',
              animationDelay: `${i * 0.3}s`,
            }}
            aria-hidden="true"
          />
        ))}
      </div>
      <span
        className="text-sm font-bold tracking-wider"
        style={{ color: COLORS.soul, textShadow: `0 0 10px ${COLORS.soul}` }}
      >
        {count.toLocaleString()}
      </span>
    </div>
  )
}

// Bloodstain decoration
export function Bloodstain({ className = '' }: { className?: string }) {
  return (
    <div className={`relative ${className}`} aria-hidden="true">
      <svg width="35" height="35" viewBox="0 0 35 35" className="opacity-25">
        <ellipse cx="17" cy="22" rx="14" ry="9" fill="#550000" />
        <ellipse cx="17" cy="19" rx="9" ry="6" fill={COLORS.blood} />
        <circle cx="11" cy="11" r="4" fill="#660000" />
        <circle cx="23" cy="9" r="2.5" fill="#550000" />
        <ellipse cx="8" cy="18" rx="2" ry="3" fill="#440000" />
      </svg>
    </div>
  )
}

// Map fog/unexplored area effect - Dark Souls style
export function MapFog() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div className="fixed inset-0 pointer-events-none z-[2]" aria-hidden="true">
      {/* Dark vignette - heavier for Dark Souls feel */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 50% 50%, transparent 20%, rgba(5, 5, 8, 0.85) 100%)
          `,
        }}
      />
      {/* Ash particles */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0 opacity-15">
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-gray-500 animate-ash-fall"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 12}s`,
                animationDuration: `${12 + Math.random() * 12}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
