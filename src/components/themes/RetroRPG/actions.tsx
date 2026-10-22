import type { AnchorHTMLAttributes, ReactNode } from 'react'
import Link from 'next/link'
import type { HeroActionSlot } from '@/components/cv/RecruiterHero'
import { useLabels } from '@/components/cv/CVDataProvider'
import { MONO, PIXEL } from './palette'
import { PixelIcon, type IconId } from './icons'
import { Soul } from './soul'
import world from './world.module.css'
import { ENGINE_LINK } from '@/lib/engineLink'

// Retro RPG's two kinds of button, both from the encounter screen:
// - a command: the orange bordered button of the command row, with its pixel icon in the slot on the
//   left; under the pointer, the keyboard or when picked it turns yellow and the red heart takes the slot;
// - an option: a line inside a box, the way a submenu lists its choices in two columns, where the heart
//   steps in beside the one under the pointer or the keyboard and the line turns yellow.

export const FOCUS = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--rpg-text)]'

const LIT = 'hover:border-[color:var(--rpg-gold)] hover:text-[color:var(--rpg-gold)] focus-visible:border-[color:var(--rpg-gold)] focus-visible:text-[color:var(--rpg-gold)] aria-checked:border-[color:var(--rpg-gold)] aria-checked:text-[color:var(--rpg-gold)]'

export const COMMAND = `group inline-flex min-h-[44px] items-center gap-2 border-[3px] border-[color:var(--rpg-orange)] bg-[color:var(--rpg-void)] px-3 py-2 text-sm uppercase tracking-[0.15em] text-[color:var(--rpg-orange)] ${LIT} ${PIXEL} ${world.pick} ${FOCUS}`

/** The slot left of a command: its icon (or an empty square), swapped for the heart when lit. */
export function Slot({ icon }: { icon?: IconId }) {
  return (
    <span className="relative h-4 w-4 shrink-0" aria-hidden="true">
      {icon ? <PixelIcon id={icon} className={`absolute inset-0 h-4 w-4 ${world.icon}`} /> : <span className={`absolute inset-0.5 border-2 border-current ${world.icon}`} />}
      <Soul className={`absolute inset-x-0 top-0.5 h-3.5 w-4 ${world.cursor}`} />
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

const OPTION = `group flex min-h-[44px] items-center gap-3 text-sm text-[color:var(--rpg-text)] hover:text-[color:var(--rpg-gold)] focus-visible:text-[color:var(--rpg-gold)] sm:text-base ${MONO} ${world.pick} ${FOCUS}`

function OptionMark() {
  return (
    <span className="relative h-3.5 w-4 shrink-0" aria-hidden="true">
      <span className={`absolute inset-0 text-center leading-none ${world.icon}`}>*</span>
      <Soul className={`absolute inset-0 h-3.5 w-4 ${world.cursor}`} />
    </span>
  )
}

export function Option({ children, ...linkProps }: AnchorHTMLAttributes<HTMLAnchorElement> & { children: ReactNode }) {
  return (
    <a {...linkProps} className={OPTION}>
      <OptionMark />
      {children}
    </a>
  )
}

function PageOption({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className={OPTION}>
      <OptionMark />
      {label}
    </Link>
  )
}

/** The hero's and the contact box's choices: email, LinkedIn, the full CV and the engine, two columns. */
export function ActionOptions({ actions, className = '' }: { actions: HeroActionSlot[]; className?: string }) {
  const labels = useLabels().actions

  return (
    <ul className={`grid grid-cols-1 gap-x-8 sm:grid-cols-2 ${className}`}>
      {actions.map((action) => (
        <li key={action.id}>
          <Option {...action.linkProps}>{action.label}</Option>
        </li>
      ))}
      <li>
        <PageOption href="/cv" label={labels.cv} />
      </li>
      <li>
        <PageOption {...ENGINE_LINK} label={labels.engineShort} />
      </li>
    </ul>
  )
}
