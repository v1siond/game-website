import Link from 'next/link'
import type { HeroActionSlot } from '@/components/cv/RecruiterHero'

// The world's actions, in the hero and again in the contact section: email, LinkedIn, the CV, and the
// link out to Nebulith.

const NOIR_BUTTON =
  'inline-flex min-h-[44px] items-center justify-center border-[3px] px-5 py-2 text-lg uppercase tracking-widest transition-transform hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:transform-none'

// Email is the red action, LinkedIn and the CV the paper outlined ones, Nebulith the solid paper one.
const LOOK = {
  red: 'border-[#ff0033] bg-[#ff0033] text-[#0a0a0a]',
  outline: 'border-[#f2efe6] bg-transparent text-[#f2efe6] hover:bg-[#f2efe6] hover:text-[#0a0a0a]',
  paper: 'border-[#f2efe6] bg-[#f2efe6] text-[#0a0a0a]',
}

const HERO_ACTION_LOOK: Record<HeroActionSlot['id'], string> = {
  email: LOOK.red,
  linkedin: LOOK.outline,
}

export function HeroAction({ action }: { action: HeroActionSlot }) {
  return (
    <a {...action.linkProps} className={`${NOIR_BUTTON} ${HERO_ACTION_LOOK[action.id]}`}>
      {action.label}
    </a>
  )
}

export function CVLink() {
  return (
    <Link href="/cv" className={`${NOIR_BUTTON} ${LOOK.outline}`}>
      CV
    </Link>
  )
}

export function EngineLink() {
  return (
    <Link href="/personal-projects/game-engine" className={`${NOIR_BUTTON} ${LOOK.paper}`}>
      Nebulith
    </Link>
  )
}
