import type { ProfessionOption } from '@/components/cv/ProfessionSwitch'
import type { Profession } from '@/lib/cv/professions'
import { PlayerIndicator } from './badges'
import { COLORS, metallicTexture } from './palette'

// =============================================================================
// CHARACTER PORTRAIT - NEON FRAME, DRAMATIC SELECTION
// One option of the shared profession switch. The picked fighter is player one.
// =============================================================================
const FIGHTER_ICONS: Record<Profession, string> = {
  drummer: '🥁',
  engineer: '💻',
  fighter: '🥊',
}

// The outer portraits lean towards the centre slot, like the two sides of a versus screen.
const FIGHTER_SIDES: Record<Profession, 'left' | 'right'> = {
  drummer: 'left',
  engineer: 'left',
  fighter: 'right',
}

export function CharacterPortrait({ id, label, selected, optionProps }: ProfessionOption) {
  const playerColor = selected ? COLORS.p1Blue : COLORS.p2Red
  const side = FIGHTER_SIDES[id]
  const clipPath =
    side === 'left' ? 'polygon(0 0, 100% 0, 92% 100%, 0 100%)' : 'polygon(8% 0, 100% 0, 100% 100%, 0 100%)'

  return (
    <button
      type="button"
      {...optionProps}
      className={`relative px-3 pt-6 pb-4 sm:p-6 w-full sm:w-auto sm:min-w-[200px] focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 transition-all duration-150 ${
        selected ? 'scale-105 z-10' : 'opacity-70 hover:opacity-100'
      }`}
      style={{
        background: selected
          ? `linear-gradient(${side === 'left' ? '135deg' : '-135deg'}, ${playerColor}60, ${COLORS.arcadeBlack}80)`
          : metallicTexture,
        border: `4px solid ${selected ? playerColor : COLORS.chromeDark}`,
        clipPath,
        boxShadow: selected
          ? `
            0 0 40px ${playerColor}99,
            0 0 80px ${playerColor}40,
            inset 0 0 30px ${playerColor}30
          `
          : `
            inset 0 2px 4px rgba(255,255,255,0.1),
            inset 0 -2px 4px rgba(0,0,0,0.5),
            0 4px 12px rgba(0,0,0,0.4)
          `,
      }}
    >
      {/* Player indicator when selected */}
      {selected && (
        <span aria-hidden="true">
          <PlayerIndicator player={1} side={side} />
        </span>
      )}

      {/* Animated neon border when selected */}
      {selected && (
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            border: `2px solid ${playerColor}`,
            clipPath,
            boxShadow: `inset 0 0 20px ${playerColor}80`,
          }}
        />
      )}

      {/* Character icon with glow */}
      <div
        className="text-5xl sm:text-8xl mb-4"
        aria-hidden="true"
        style={{
          filter: selected ? `drop-shadow(0 0 30px ${playerColor})` : 'none',
        }}
      >
        {FIGHTER_ICONS[id]}
      </div>

      {/* Name plate - hexagonal arcade style */}
      <div
        className="py-2 -mx-3 px-3 sm:-mx-6 sm:px-6"
        style={{
          background: selected
            ? `linear-gradient(90deg, ${playerColor}, ${playerColor}dd)`
            : `linear-gradient(90deg, ${COLORS.chromeDark}80, ${COLORS.chrome}99)`,
          clipPath: 'polygon(5% 0, 95% 0, 100% 50%, 95% 100%, 5% 100%, 0 50%)',
        }}
      >
        <div
          className="text-sm font-black tracking-[0.15em] sm:tracking-[0.2em] uppercase"
          style={{
            fontFamily: '"Impact", "Arial Black", sans-serif',
            color: selected ? '#000' : '#FFF',
            textShadow: selected ? 'none' : '0 2px 4px rgba(0,0,0,0.5)',
          }}
        >
          {label}
        </div>
      </div>

      {/* Selection arrow when selected */}
      {selected && (
        <div
          className="absolute -top-4 left-1/2 -translate-x-1/2 text-3xl"
          aria-hidden="true"
          style={{
            color: playerColor,
            filter: `drop-shadow(0 0 10px ${playerColor})`,
          }}
        >
          ▼
        </div>
      )}
    </button>
  )
}
