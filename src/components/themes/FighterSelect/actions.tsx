import Link from 'next/link'
import type { HeroActionSlot } from '@/components/cv/RecruiterHero'
import look from './world.module.css'

// The world's buttons, cut like the command buttons of a select screen: email is the gold primary
// action, LinkedIn, the CV and the portfolio the outlined player one blue.

const ARCADE_BUTTON = `inline-flex min-h-[44px] items-center justify-center px-6 py-3 text-sm uppercase motion-safe:transition-transform motion-safe:hover:scale-105 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--fs-gold)] ${look.display}`

const GOLD_FILL = `${ARCADE_BUTTON} border-2 border-[color:var(--fs-gold)] bg-[color:var(--fs-gold)] text-[color:var(--fs-ink)]`
export const BLUE_OUTLINE = `${ARCADE_BUTTON} border-2 border-[color:var(--fs-p1-light)] text-[color:var(--fs-p1-light)]`

const HERO_ACTION_LOOK: Record<HeroActionSlot['id'], string> = {
  email: GOLD_FILL,
  linkedin: BLUE_OUTLINE,
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
    <Link href="/cv" className={BLUE_OUTLINE}>
      CV
    </Link>
  )
}

export function PortfolioLink() {
  return (
    <Link href="/personal-projects/game-engine" className={BLUE_OUTLINE}>
      Portfolio
    </Link>
  )
}
