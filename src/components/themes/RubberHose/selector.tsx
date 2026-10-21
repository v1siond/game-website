import type { ProfessionOption } from '@/components/cv/ProfessionSwitch'
import { HeroCharacter } from './cup'
import world from './world.module.css'

// One option of the shared profession switch, a round vintage badge like a cartoon's cast card: him in
// that profession's costume inside the dashed inner ring, the name on an ink ribbon below. The picked
// badge turns red and bounces on the beat.

const LOOK = {
  on: { badge: `${world.badgeOn} ${world.beatBounce}`, button: 'scale-110' },
  off: { badge: '', button: 'hover:scale-105' },
}

export function CartoonCharacter({ id, label, selected, optionProps }: ProfessionOption) {
  const look = LOOK[selected ? 'on' : 'off']

  return (
    <button type="button" {...optionProps} className={`relative pb-8 transition-transform sm:pb-6 motion-reduce:transition-none ${look.button}`}>
      <span className={`relative mx-auto flex h-20 w-20 items-center justify-center overflow-hidden rounded-full sm:h-28 sm:w-28 md:h-32 md:w-32 ${world.badge} ${look.badge}`}>
        <span className={`absolute inset-2 rounded-full ${world.badgeRing}`} aria-hidden="true" />
        <HeroCharacter profession={id} pose={selected ? 'shoot' : 'idle'} className="relative mt-3 h-16 w-11 sm:mt-4 sm:h-24 sm:w-16 md:h-28 md:w-[4.75rem]" />
      </span>
      <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-[calc(100%+0.5rem)] -rotate-3 px-1 py-1 text-center text-sm uppercase leading-tight [overflow-wrap:anywhere] sm:leading-[inherit] sm:w-auto sm:whitespace-nowrap sm:px-3 ${world.badgeName} ${world.lettering}`}>
        {label}
      </span>
    </button>
  )
}
