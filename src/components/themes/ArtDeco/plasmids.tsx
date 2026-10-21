import type { ProfessionOption } from '@/components/cv/ProfessionSwitch'
import type { Profession } from '@/lib/cv/professions'
import { RAPTURE_COLORS } from './palette'

// ============================================================================
// PLASMID BUTTON - Profession switcher (Bioshock plasmid vending style)
// ============================================================================

// The plasmid glyph each profession's bottle carries, drawn in the bottle's ink colour.
export const PLASMID_ICONS: Record<Profession, (ink: string) => React.ReactNode> = {
  drummer: (ink) => (
    <svg viewBox="0 0 40 40" className="w-10 h-10 sm:w-12 sm:h-12 mx-auto">
      <circle cx="20" cy="20" r="10" fill="none" stroke={ink} strokeWidth="2" />
      <circle cx="20" cy="20" r="5" fill={ink} />
      <path d="M8 20 Q3 20 3 15 M32 20 Q37 20 37 15" fill="none" stroke={ink} strokeWidth="2" />
    </svg>
  ),
  engineer: (ink) => (
    <svg viewBox="0 0 40 40" className="w-10 h-10 sm:w-12 sm:h-12 mx-auto">
      <path d="M20 5 L25 18 L32 18 L18 35 L22 22 L15 22 Z" fill={ink} stroke={ink} strokeWidth="1" />
    </svg>
  ),
  fighter: (ink) => (
    <svg viewBox="0 0 40 40" className="w-10 h-10 sm:w-12 sm:h-12 mx-auto">
      <path d="M10 30 L20 10 L30 30" fill="none" stroke={ink} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M13 25 L27 25" stroke={ink} strokeWidth="2" />
      <circle cx="20" cy="8" r="3" fill={ink} />
    </svg>
  ),
}

export function PlasmidButton({ id, label, selected, optionProps, reducedMotion }: ProfessionOption & { reducedMotion: boolean }) {
  const ink = selected ? RAPTURE_COLORS.deepSea : RAPTURE_COLORS.gold

  return (
    <button
      type="button"
      {...optionProps}
      className={`relative group ${reducedMotion ? '' : 'transition-all duration-300'} ${
        selected ? 'scale-105 sm:scale-110' : 'opacity-80 hover:opacity-100 hover:scale-105'
      }`}
    >
      {/* Plasmid Bottle Shape */}
      <div
        className="relative px-3 py-4 sm:p-6 text-center"
        style={{
          background: selected
            ? `linear-gradient(180deg, ${RAPTURE_COLORS.goldBright}, ${RAPTURE_COLORS.gold}, ${RAPTURE_COLORS.brassDark})`
            : `linear-gradient(180deg, ${RAPTURE_COLORS.deepSeaMid}, ${RAPTURE_COLORS.deepSea})`,
          border: `3px solid ${selected ? RAPTURE_COLORS.goldBright : RAPTURE_COLORS.gold}80`,
          borderRadius: '8px 8px 20px 20px',
          boxShadow: selected
            ? `0 0 40px ${RAPTURE_COLORS.gold}60, inset 0 0 20px ${RAPTURE_COLORS.goldBright}40`
            : `0 0 15px ${RAPTURE_COLORS.gold}20`,
          clipPath: 'polygon(10% 0, 90% 0, 100% 15%, 100% 100%, 0 100%, 0 15%)',
        }}
      >
        <div className="mb-3" aria-hidden="true">
          {PLASMID_ICONS[id](ink)}
        </div>

        <div
          className="text-sm font-bold tracking-wider uppercase"
          style={{
            color: ink,
            fontFamily: '"Playfair Display", serif',
            textShadow: selected ? 'none' : `0 0 10px ${RAPTURE_COLORS.gold}60`,
          }}
        >
          {label}
        </div>

        {selected && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at center, ${RAPTURE_COLORS.goldBright}20 0%, transparent 70%)`,
            }}
            aria-hidden="true"
          />
        )}
      </div>

      {/* Selection indicator */}
      {selected && (
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2" aria-hidden="true">
          <svg width="30" height="15" viewBox="0 0 30 15">
            <path d="M0 0 L15 15 L30 0" fill={RAPTURE_COLORS.gold} />
          </svg>
        </div>
      )}
    </button>
  )
}
