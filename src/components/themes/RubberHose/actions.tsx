import Link from 'next/link'
import type { HeroActionSlot } from '@/components/cv/RecruiterHero'
import world from './world.module.css'

// The world's actions, in the hero and again in the contact scene: email, LinkedIn, the CV, and the
// link out to Nebulith, each an ink framed poster button that tips as the pointer lands on it.

const CARTOON_BUTTON = `inline-flex min-h-[44px] items-center justify-center px-4 py-2 text-sm uppercase tracking-wider transition-transform hover:scale-105 motion-reduce:transition-none motion-reduce:hover:transform-none ${world.button} ${world.lettering}`

// Email and Nebulith are the red actions, LinkedIn and the CV the ink ones.
const LOOK = {
  red: `${CARTOON_BUTTON} hover:rotate-1 ${world.buttonRed}`,
  ink: `${CARTOON_BUTTON} hover:-rotate-1 ${world.buttonInk}`,
}

const HERO_ACTION_LOOK: Record<HeroActionSlot['id'], string> = {
  email: LOOK.red,
  linkedin: LOOK.ink,
}

export function HeroAction({ action }: { action: HeroActionSlot }) {
  return (
    <a {...action.linkProps} className={HERO_ACTION_LOOK[action.id]}>
      {action.label}
    </a>
  )
}

export function CVLink() {
  return (
    <Link href="/cv" className={LOOK.ink}>
      CV
    </Link>
  )
}

export function EngineLink() {
  return (
    <Link href="/personal-projects/game-engine" className={LOOK.red}>
      Nebulith
    </Link>
  )
}
