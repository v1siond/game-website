'use client'

import { useReducedMotion } from '@/hooks/useReducedMotion'
import { COLORS, metallicTexture } from './palette'

// =============================================================================
// INSERT COIN FOOTER
// =============================================================================
export function InsertCoinFooter() {
  const reducedMotion = useReducedMotion()

  return (
    <footer className="relative z-20 py-12 text-center">
      <p
        className="text-sm tracking-[0.4em] uppercase"
        style={{
          fontFamily: '"Impact", "Arial Black", sans-serif',
          color: COLORS.chromeDark,
        }}
      >
        PRESS START TO CONTINUE
      </p>

      <p
        className="text-sm mt-4 tracking-[0.3em]"
        style={{
          color: COLORS.specialBlue,
          textShadow: `0 0 10px ${COLORS.specialBlue}`,
        }}
      >
        MMXXVI ALEXANDER PULIDO
      </p>

      {/* Insert coin slot */}
      <div
        className="mt-6 inline-flex items-center gap-4 px-8 py-4"
        aria-hidden="true"
        style={{
          background: metallicTexture,
          border: `3px solid ${COLORS.chromeDark}`,
          borderRadius: '4px',
          boxShadow: 'inset 0 3px 8px rgba(0,0,0,0.7), 0 4px 12px rgba(0,0,0,0.4)',
        }}
      >
        {/* Worn coin slot */}
        <div
          className="w-16 h-3"
          style={{
            background: `linear-gradient(180deg, ${COLORS.arcadeBlack}, #050505)`,
            border: `2px solid ${COLORS.chromeDarker}`,
            borderRadius: '4px',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.9)',
          }}
        />
        <span
          className="text-sm tracking-[0.3em] uppercase"
          style={{
            fontFamily: '"Impact", "Arial Black", sans-serif',
            color: COLORS.chromeDark,
          }}
        >
          INSERT COIN
        </span>
        <span
          className={`text-2xl ${!reducedMotion ? 'animate-blink' : ''}`}
          style={{
            color: COLORS.gold,
            textShadow: `0 0 15px ${COLORS.gold}`,
          }}
        >
          ●
        </span>
      </div>
    </footer>
  )
}
