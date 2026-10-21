import type { ProfessionOption } from '@/components/cv/ProfessionSwitch'
import { COMMAND, Slot } from './actions'

// The profession switch as the encounter's command row: one orange command per profession, each with
// its pixel icon (a terminal, crossed drumsticks, a glove). The picked one is lit yellow and the red heart
// sits in its slot, as on the picked command of the game's row. ProfessionSwitch owns the order, the pick
// and the keyboard (arrows move the heart along the row); each option only draws itself.

export function CommandOption({ option }: { option: ProfessionOption }) {
  const { id, label, optionProps } = option

  return (
    <button type="button" {...optionProps} className={`${COMMAND} w-full justify-center sm:w-auto`}>
      <Slot icon={id} />
      {label}
    </button>
  )
}
