import type { ProfessionOption } from '@/components/cv/ProfessionSwitch'
import { HeroCharacter } from './character'

// The profession switch's options: him, dressed for each profession, standing in the dark. The picked
// one steps forward into a pool of fog light; the others wait as dim shapes, their names still at full
// contrast. ProfessionSwitch owns the order (Musician, System Engineer, Martial Artist), the pick and
// the keyboard; each option only draws itself.

export function ProfessionFigure({ option }: { option: ProfessionOption }) {
  const { id: profession, label, selected, optionProps } = option

  return (
    <button
      type="button"
      {...optionProps}
      className="group relative flex flex-col items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--sh-glow)]"
    >
      <span
        className={`absolute bottom-6 left-1/2 h-10 w-24 -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,var(--sh-fog),transparent)] transition-opacity duration-300 motion-reduce:transition-none ${
          selected ? 'opacity-100' : 'opacity-0'
        }`}
        aria-hidden="true"
      />
      <span
        className={`relative transition-[transform,opacity] duration-300 motion-reduce:transition-none ${
          selected ? 'scale-110 opacity-100' : 'opacity-40 group-hover:opacity-70'
        }`}
      >
        <HeroCharacter profession={profession} className="h-24 w-16" />
      </span>
      <span
        className={`mt-1.5 text-sm lowercase tracking-[0.2em] ${selected ? 'text-[color:var(--sh-heading)]' : 'text-[color:var(--sh-dim)]'}`}
        aria-hidden="true"
      >
        {label}
      </span>
    </button>
  )
}
