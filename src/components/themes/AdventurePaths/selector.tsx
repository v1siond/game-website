import type { ProfessionOption } from '@/components/cv/ProfessionSwitch'
import type { Profession } from '@/lib/cv/professions'
import { MARIO_COLORS } from './palette'
import { Coin, FireFlower, Starman, SuperMushroom } from './icons'

// =============================================================================
// UI COMPONENTS
// =============================================================================

// The power-up each profession's block holds.
const PROFESSION_POWER_UPS: Record<Profession, React.ReactNode> = {
  drummer: <Starman size={50} />,
  engineer: <FireFlower size={50} />,
  fighter: <SuperMushroom size={50} />,
}

const PROFESSION_GLOW: Record<Profession, string> = {
  drummer: MARIO_COLORS.coinGold,
  engineer: MARIO_COLORS.questionOrange,
  fighter: MARIO_COLORS.marioRed,
}

// Profession option styled as a power-up block, drawn for the shared ProfessionSwitch
export function ProfessionPowerUp({ id, label, selected, optionProps }: ProfessionOption) {
  return (
    <button
      type="button"
      {...optionProps}
      className={`relative flex flex-col items-center transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-yellow-400 cursor-pointer ${
        selected ? 'scale-110' : 'hover:scale-105 opacity-80 hover:opacity-100'
      }`}
    >
      {/* Power-up block */}
      <div
        className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center relative"
        style={{
          background: selected
            ? `linear-gradient(180deg, ${MARIO_COLORS.questionYellow}, ${MARIO_COLORS.questionDark})`
            : `linear-gradient(180deg, ${MARIO_COLORS.brickRed}, ${MARIO_COLORS.brickDark})`,
          border: `4px solid ${selected ? MARIO_COLORS.groundBrown : MARIO_COLORS.groundDarkest}`,
          borderRadius: '4px',
          boxShadow: selected
            ? `0 4px 0 ${MARIO_COLORS.groundDarkest}, 0 0 20px ${PROFESSION_GLOW[id]}60`
            : `0 4px 0 ${MARIO_COLORS.groundDarkest}`,
        }}
        aria-hidden="true"
      >
        {PROFESSION_POWER_UPS[id]}
        {selected && (
          <div className="absolute -top-2 -right-2">
            <Coin size={20} />
          </div>
        )}
      </div>

      {/* Label */}
      <div
        className="mt-3 px-2 sm:px-3 py-1 text-sm font-bold tracking-wider text-center"
        style={{
          background: selected
            ? `linear-gradient(180deg, ${MARIO_COLORS.marioRed}, ${MARIO_COLORS.marioDarkRed})`
            : `linear-gradient(180deg, ${MARIO_COLORS.castleGrey}, ${MARIO_COLORS.castleDark})`,
          color: '#FFF',
          border: `2px solid ${selected ? MARIO_COLORS.questionYellow : MARIO_COLORS.flagGrey}`,
          borderRadius: '2px',
          textShadow: '1px 1px 0 #000',
        }}
      >
        {label}
      </div>
    </button>
  )
}
