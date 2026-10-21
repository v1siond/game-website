import type { ProfessionOption } from '@/components/cv/ProfessionSwitch'
import type { Profession } from '@/lib/cv/professions'
import { RE } from './palette'

// Inventory slot component - sepia item box style. ProfessionSwitch owns the order (Musician, System
// Engineer, Martial Artist), the pick and the keyboard; the slot only draws itself.
type Rarity = 'common' | 'rare' | 'legendary'

const INVENTORY_ITEMS: Record<Profession, { icon: string; sublabel: string; rarity: Rarity }> = {
  drummer: { icon: '*', sublabel: 'SCORE', rarity: 'rare' },
  engineer: { icon: '>', sublabel: 'JOURNAL', rarity: 'legendary' },
  fighter: { icon: '+', sublabel: 'MANUAL', rarity: 'rare' },
}

const RARITY_COLOR: Record<Rarity, string> = {
  common: RE.midBrown,
  rare: RE.warmGlow,
  legendary: RE.candlelight,
}

export function InventorySlot({ option }: { option: ProfessionOption }) {
  const { id, label, selected: isSelected, optionProps } = option
  const { icon, sublabel, rarity } = INVENTORY_ITEMS[id]
  const rarityColor = RARITY_COLOR[rarity]

  return (
    <button
      type="button"
      {...optionProps}
      className="relative aspect-square transition-all duration-200 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8a860]"
      style={{
        background: `linear-gradient(135deg, ${RE.sepia}, ${RE.darkSepia})`,
        border: `2px solid ${isSelected ? RE.candlelight : rarityColor}`,
        boxShadow: isSelected ? `0 0 20px ${RE.warmGlow}40, inset 0 0 30px ${RE.void}80` : `inset 0 0 30px ${RE.void}60`,
      }}
    >
      {/* Corner notches - item box style */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2" style={{ borderColor: rarityColor }} aria-hidden="true" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2" style={{ borderColor: rarityColor }} aria-hidden="true" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2" style={{ borderColor: rarityColor }} aria-hidden="true" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2" style={{ borderColor: rarityColor }} aria-hidden="true" />

      {/* Content */}
      <div className="absolute inset-2 flex flex-col items-center justify-center" aria-hidden="true">
        <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">{icon}</span>
        <span className="text-sm tracking-wider text-center uppercase leading-tight" style={{ color: RE.cream }}>
          {label}
        </span>
        <span className="text-sm mt-1 hidden sm:block" style={{ color: RE.warmGlow }}>
          {sublabel}
        </span>
      </div>

      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2" aria-hidden="true">
          <span style={{ color: RE.candlelight }}>▼</span>
        </div>
      )}
    </button>
  )
}
