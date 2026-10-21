'use client'

import { useReducedMotion } from '@/hooks/useReducedMotion'
import { COLORS } from './palette'
import { SwordMarker } from './art'

// Stone Section Card - ancient castle/bonfire aesthetic with textures
export function StoneSectionCard({
  children,
  className = '',
  glowColor = COLORS.bonfire,
  ariaLabelledby,
}: {
  children: React.ReactNode
  className?: string
  glowColor?: string
  ariaLabelledby?: string
}) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section
      className={`relative overflow-hidden ${className}`}
      style={{
        background: `
          linear-gradient(180deg, #15120fee 0%, #0c0a08ee 100%)
        `,
        border: `1px solid ${COLORS.ash}`,
        boxShadow: `
          inset 0 0 40px rgba(0,0,0,0.6),
          inset 0 1px 0 rgba(60,55,50,0.3),
          0 4px 20px rgba(0,0,0,0.4)
        `,
      }}
      aria-labelledby={ariaLabelledby}
    >
      {/* Stone/brick texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.08]"
        aria-hidden="true"
        style={{
          backgroundImage: `
            linear-gradient(90deg, transparent 0%, transparent 48%, rgba(40,35,30,0.5) 50%, transparent 52%, transparent 100%),
            linear-gradient(0deg, transparent 0%, transparent 48%, rgba(40,35,30,0.3) 50%, transparent 52%, transparent 100%)
          `,
          backgroundSize: '60px 40px',
        }}
      />

      {/* Cracked stone SVG pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        aria-hidden="true"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0 L25 30 L15 50 L30 100' stroke='%23555' stroke-width='0.5' fill='none'/%3E%3Cpath d='M60 0 L55 40 L70 70 L50 100' stroke='%23444' stroke-width='0.5' fill='none'/%3E%3Cpath d='M0 30 L40 35 L100 25' stroke='%23555' stroke-width='0.5' fill='none'/%3E%3Cpath d='M0 70 L30 75 L60 65 L100 80' stroke='%23444' stroke-width='0.5' fill='none'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
      />

      {/* Bonfire warm glow on edges */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          boxShadow: `
            inset 0 -2px 30px ${glowColor}15,
            inset -2px 0 20px ${glowColor}08,
            inset 2px 0 20px ${glowColor}08
          `,
        }}
      />

      {/* Ember/ash particle overlay */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-0.5 rounded-full animate-section-ember"
              style={{
                left: `${15 + Math.random() * 70}%`,
                bottom: '10%',
                background: i % 2 === 0 ? COLORS.ember : COLORS.gold,
                animationDelay: `${i * 0.8}s`,
                opacity: 0.6,
              }}
            />
          ))}
        </div>
      )}

      {/* Fog gate transparency at top */}
      <div
        className="absolute top-0 left-0 right-0 h-8 pointer-events-none"
        aria-hidden="true"
        style={{
          background: `linear-gradient(to bottom, ${COLORS.fog}08, transparent)`,
        }}
      />

      {/* Gothic corner ornaments - cathedral style */}
      {['top-0 left-0', 'top-0 right-0 scale-x-[-1]', 'bottom-0 left-0 scale-y-[-1]', 'bottom-0 right-0 scale-[-1]'].map((pos, i) => (
        <div key={i} className={`absolute ${pos} w-8 h-8 pointer-events-none`} aria-hidden="true">
          <svg viewBox="0 0 32 32" fill="none">
            {/* Gothic arch corner */}
            <path d="M0 0 L32 0 L32 4 L4 4 L4 32 L0 32 Z" fill={COLORS.ash} opacity="0.6"/>
            <path d="M0 0 L16 0 L16 2 L2 2 L2 16 L0 16 Z" fill={glowColor} opacity="0.2"/>
            {/* Decorative flourish */}
            <circle cx="8" cy="8" r="2" fill={COLORS.ash} opacity="0.4"/>
          </svg>
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 p-6">
        {children}
      </div>
    </section>
  )
}

export function SectionHeading({ id, color = COLORS.bonfire, children }: { id: string; color?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <SwordMarker />
      <h2 id={id} className="text-sm tracking-[0.3em] uppercase" style={{ color }}>
        {children}
      </h2>
    </div>
  )
}
