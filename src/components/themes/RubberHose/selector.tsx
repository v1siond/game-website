'use client'

import type { ProfessionOption } from '@/components/cv/ProfessionSwitch'
import type { Profession } from '@/lib/cv/professions'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { CUPHEAD_COLORS } from './palette'

// ============================================================================
// COMPONENT: Cartoon Character Selection Card, one option of the shared profession switch
// ============================================================================
const CARTOON_ICONS: Record<Profession, string> = {
  drummer: '♫',
  engineer: '⚙',
  fighter: '⚔',
}

export function CartoonCharacter({ id, label, selected, optionProps }: ProfessionOption) {
  const reducedMotion = useReducedMotion()

  return (
    <button
      type="button"
      {...optionProps}
      className={`relative pb-6 transition-all group ${selected ? 'scale-110' : 'hover:scale-105'}`}
    >
      {/* Circular frame like vintage cartoon character selection */}
      <div
        className={`w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 mx-auto rounded-full flex items-center justify-center relative ${
          selected && !reducedMotion ? 'cuphead-bounce-slow' : ''
        }`}
        style={{
          background: selected ? CUPHEAD_COLORS.accentRedDark : CUPHEAD_COLORS.paperCream,
          border: `6px solid ${CUPHEAD_COLORS.inkBlack}`,
          boxShadow: selected
            ? `0 8px 0 #5a0000, 0 10px 20px rgba(0,0,0,0.3)`
            : `0 4px 0 ${CUPHEAD_COLORS.shadowBrown}`,
        }}
      >
        {/* Inner ring decoration - like vintage badges */}
        <div
          className="absolute inset-2 rounded-full"
          style={{ border: `2px dashed ${CUPHEAD_COLORS.inkBlack}40` }}
          aria-hidden="true"
        />
        <span
          className={`text-3xl sm:text-4xl md:text-5xl ${!reducedMotion ? 'group-hover:cuphead-wiggle' : ''}`}
          style={{ color: selected ? CUPHEAD_COLORS.paperCream : CUPHEAD_COLORS.inkBlack }}
          aria-hidden="true"
        >
          {CARTOON_ICONS[id]}
        </span>
      </div>

      {/* Name banner - vintage title card style */}
      <span
        className="absolute bottom-0 left-1/2 px-2 sm:px-3 py-1 text-sm whitespace-nowrap uppercase"
        style={{
          background: CUPHEAD_COLORS.inkBlack,
          color: CUPHEAD_COLORS.paperCream,
          fontFamily: '"Abril Fatface", serif',
          letterSpacing: '0.05em',
          transform: 'translateX(-50%) rotate(-3deg)',
        }}
      >
        {label}
      </span>
    </button>
  )
}
