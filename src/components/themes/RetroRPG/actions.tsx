import type { AnchorHTMLAttributes, ReactNode } from 'react'
import type { HeroActionSlot } from '@/components/cv/RecruiterHero'
import { ContactLink, useSiteLinks } from '@/components/cv/SiteLinks'
import { MONO, PIXEL } from './palette'
import { PixelIcon, type IconId } from './icons'
import { Cursor } from './cursor'
import world from './world.module.css'

// Retro RPG's two kinds of button, both from the genre's command windows:
// - a command: a word in its own white framed cell of the command window, with its pixel icon in the slot
//   on the left; under the pointer, the keyboard or when picked it turns yellow and the cursor arrow takes
//   the slot;
// - an option: a line inside a window, the way a submenu lists its choices in two columns, where the
//   cursor arrow steps in beside the one under the pointer or the keyboard and the line turns yellow.

const LIT = 'hover:border-[color:var(--rpg-gold)] hover:text-[color:var(--rpg-gold)] focus-visible:border-[color:var(--rpg-gold)] focus-visible:text-[color:var(--rpg-gold)] aria-checked:border-[color:var(--rpg-gold)] aria-checked:text-[color:var(--rpg-gold)]'

export const COMMAND = `group inline-flex min-h-[44px] items-center gap-2 border-[3px] border-[color:var(--rpg-border)] bg-[color:var(--rpg-void)] px-3 py-2 text-sm uppercase tracking-[0.15em] text-[color:var(--rpg-text)] ${LIT} ${PIXEL} ${world.pick}`

/** The slot left of a command: its icon (or an empty square), swapped for the cursor arrow when lit. */
export function Slot({ icon }: { icon?: IconId }) {
  return (
    <span className="relative h-4 w-4 shrink-0" aria-hidden="true">
      {icon ? <PixelIcon id={icon} className={`absolute inset-0 h-4 w-4 ${world.icon}`} /> : <span className={`absolute inset-0.5 border-2 border-current ${world.icon}`} />}
      <Cursor className={`absolute inset-y-0 left-1 h-4 w-2.5 ${world.cursor}`} />
    </span>
  )
}

interface CommandProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode
  icon?: IconId
}

export function Command({ children, icon, ...linkProps }: CommandProps) {
  return (
    <a {...linkProps} className={COMMAND}>
      <Slot icon={icon} />
      {children}
    </a>
  )
}

const OPTION = `group flex min-h-[44px] items-center gap-3 text-sm text-[color:var(--rpg-text)] hover:text-[color:var(--rpg-gold)] focus-visible:text-[color:var(--rpg-gold)] sm:text-base ${MONO} ${world.pick}`

function OptionMark() {
  return (
    <span className="relative h-3.5 w-4 shrink-0" aria-hidden="true">
      <span className={`absolute left-1 top-1 h-1.5 w-1.5 bg-current ${world.icon}`} />
      <Cursor className={`absolute inset-y-0 left-1 h-3.5 w-2 ${world.cursor}`} />
    </span>
  )
}

// An option's line: the bullet (the cursor arrow when lit) and the slot's label.
const optionLine = (label: string) => (
  <>
    <OptionMark />
    {label}
  </>
)

/** The hero's and the contact box's choices: email, LinkedIn, the full CV and the engine, two columns. */
export function ActionOptions({ actions, className = '' }: { actions: HeroActionSlot[]; className?: string }) {
  const { cv, engine } = useSiteLinks('engineShort')

  return (
    <ul className={`grid grid-cols-1 gap-x-8 sm:grid-cols-2 ${className}`}>
      {[...actions, cv, engine].map((slot) => (
        <li key={slot.id}>
          <ContactLink slot={slot} className={OPTION}>
            {optionLine}
          </ContactLink>
        </li>
      ))}
    </ul>
  )
}
