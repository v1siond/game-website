import Link from 'next/link'
import type { HeroActionSlot } from '@/components/cv/RecruiterHero'
import world from './world.module.css'

// The world's actions, in the hero and again in the contact section: email, LinkedIn, the CV.

export const TERMINAL_BUTTON =
  'inline-flex items-center justify-center min-h-[44px] border-2 px-4 py-2 text-sm font-bold tracking-wider uppercase font-mono transition-all hover:scale-105 focus:outline-none focus-visible:ring-2'

// Email is the solid phosphor green primary action, LinkedIn and the CV the outlined yellow ones; the
// outlined green one is the link out to Nebulith.
export const BUTTON_LOOK = {
  solid: `border-[#14FF00] bg-[#14FF00] text-[#0a0a08] ${world.buttonLit}`,
  yellow: 'border-[#FFD700] bg-[#0a0a08] text-[#FFD700]',
  green: 'border-[#14FF00] bg-[#0a0a08] text-[#14FF00]',
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
