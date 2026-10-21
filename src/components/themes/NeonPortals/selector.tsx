'use client'

import type { ProfessionOption } from '@/components/cv/ProfessionSwitch'
import type { Profession } from '@/lib/cv/professions'
import { PORTAL } from './palette'
import { usePrefersReducedMotion } from './motion'

// ============================================================================
// PORTAL PROFESSION SELECTOR
// ProfessionSwitch owns the order (Musician, System Engineer, Martial Artist), the pick and the
// keyboard; each portal only draws itself.
// ============================================================================

const PORTAL_COLORS: Record<Profession, { primary: string; glow: string }> = {
  engineer: { primary: PORTAL.BLUE, glow: PORTAL.BLUE_GLOW },
  drummer: { primary: PORTAL.ORANGE, glow: PORTAL.ORANGE_GLOW },
  fighter: { primary: '#00DD66', glow: '#00FF88' },
}

const PORTAL_ICONS: Record<Profession, string> = { engineer: '</>', drummer: '///', fighter: '+ +' }

export function PortalSelector({ option }: { option: ProfessionOption }) {
  const { id: profession, label, selected: isActive, optionProps } = option
  const prefersReducedMotion = usePrefersReducedMotion()
  const color = PORTAL_COLORS[profession]

  return (
    <button
      type="button"
      {...optionProps}
      className={`relative flex flex-col items-center gap-2 p-2 sm:p-4 transition-transform ${
        isActive ? 'scale-105' : 'hover:scale-102'
      }`}
      style={{ willChange: 'transform' }}
    >
      {/* Portal ring */}
      <div
        className={`relative flex items-center justify-center ${
          prefersReducedMotion ? '' : isActive ? 'portal-pulse' : ''
        }`}
        style={{
          width: '80px',
          height: '110px',
          border: `3px solid ${color.primary}`,
          borderRadius: '50%',
          background: `radial-gradient(ellipse at center, ${color.primary}10, transparent 70%)`,
          boxShadow: isActive
            ? `0 0 30px ${color.primary}50, 0 0 60px ${color.primary}25, inset 0 0 30px ${color.primary}10`
            : `0 0 15px ${color.primary}25`,
        }}
      >
        {/* Void center */}
        <div
          className="absolute rounded-full"
          style={{
            width: '55px',
            height: '80px',
            background: `radial-gradient(ellipse, ${PORTAL.VOID}, #000)`,
          }}
          aria-hidden="true"
        />

        {/* Icon */}
        <span
          className="relative z-10 text-lg font-mono"
          style={{ color: color.primary, textShadow: `0 0 15px ${color.primary}` }}
          aria-hidden="true"
        >
          {PORTAL_ICONS[profession]}
        </span>
      </div>

      {/* Label */}
      <span className="text-sm tracking-[0.1em] font-medium uppercase text-center" style={{ color: color.primary }} aria-hidden="true">
        {label}
      </span>

      {/* Active indicator */}
      {isActive && (
        <div
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-sm"
          style={{ color: color.primary }}
          aria-hidden="true"
        >
          ^
        </div>
      )}
    </button>
  )
}
