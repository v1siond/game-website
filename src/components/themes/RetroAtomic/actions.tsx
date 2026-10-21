import Link from 'next/link'
import type { HeroActionSlot } from '@/components/cv/RecruiterHero'
import world from './world.module.css'

// The world's actions, in the hero and again in the contact section: email, LinkedIn, the CV.

export const TERMINAL_BUTTON =
  'inline-flex items-center justify-center min-h-[44px] border-2 px-4 py-2 text-sm font-bold tracking-wider uppercase font-mono transition-all hover:scale-105 focus:outline-none focus-visible:ring-2'

// Email is the solid phosphor green primary action, LinkedIn and the CV the outlined yellow ones; the
// outlined green one is the link out to Nebulith.
export const BUTTON_LOOK = {
  solid: `border-atomic-phosphor bg-atomic-phosphor text-atomic-ink ${world.buttonLit}`,
  yellow: 'border-atomic-yellow bg-atomic-ink text-atomic-yellow',
  green: 'border-atomic-phosphor bg-atomic-ink text-atomic-phosphor',
}

const HERO_ACTION_LOOK: Record<HeroActionSlot['id'], string> = {
  email: BUTTON_LOOK.solid,
  linkedin: BUTTON_LOOK.yellow,
}

export function HeroAction({ action }: { action: HeroActionSlot }) {
  return (
    <a {...action.linkProps} className={`${TERMINAL_BUTTON} ${HERO_ACTION_LOOK[action.id]}`}>
      {action.label}
    </a>
  )
}

export function CVLink() {
  return (
    <Link href="/cv" className={`${TERMINAL_BUTTON} ${BUTTON_LOOK.yellow}`}>
      CV
    </Link>
  )
}
