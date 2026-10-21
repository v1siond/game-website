import type { ProfessionOption } from '@/components/cv/ProfessionSwitch'
import { HeroCharacter } from './character'
import { PIXEL } from './palette'
import world from './world.module.css'

// The profession switch as the party menu: one window per profession, him dressed for it above its
// name. The picked one carries the gold cursor and a gold border; the others wait with their names at
// full contrast. ProfessionSwitch owns the order, the pick and the keyboard; each option only draws itself.

export function PartyMember({ option }: { option: ProfessionOption }) {
  const { id: profession, label, selected, optionProps } = option

  return (
    <button
      type="button"
      {...optionProps}
      className={`relative flex min-h-[44px] w-24 flex-col items-center px-2 pb-2 pt-3 sm:w-32 ${world.window} ${
        selected ? 'outline outline-2 outline-offset-2 outline-[color:var(--rpg-gold)]' : ''
      } focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--rpg-text)]`}
    >
      <span className={`absolute left-1.5 top-1.5 text-sm text-[color:var(--rpg-gold)] ${selected ? 'opacity-100' : 'opacity-0'}`} aria-hidden="true">
        ▶
      </span>
      <HeroCharacter profession={profession} className="h-16 w-11 sm:h-20 sm:w-14" />
      <span className={`mt-1 break-words text-center text-sm leading-tight ${PIXEL} ${selected ? 'text-[color:var(--rpg-gold)]' : 'text-[color:var(--rpg-text)]'}`} aria-hidden="true">
        {label}
      </span>
    </button>
  )
}
