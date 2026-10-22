import Link from 'next/link'
import type { HeroActionSlot } from '@/components/cv/RecruiterHero'
import { useLabels } from '@/components/cv/CVDataProvider'
import look from './world.module.css'
import { ENGINE_LINK } from '@/lib/engineLink'

// The world's buttons, flat arcade blocks with a hard black drop: email is the yellow primary action
// (the colour of a full life bar), LinkedIn, the CV and the portfolio player one blue on black.

const ARCADE_BUTTON = `inline-flex min-h-[44px] items-center justify-center px-6 py-3 text-base uppercase shadow-[4px_4px_0_#000] motion-safe:transition-transform motion-safe:hover:scale-105 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--fs-gold)] ${look.display}`

const GOLD_FILL = `${ARCADE_BUTTON} border-2 border-black bg-[color:var(--fs-hud-yellow)] text-[color:var(--fs-ink)]`
export const BLUE_OUTLINE = `${ARCADE_BUTTON} border-2 border-[color:var(--fs-p1-light)] bg-black text-[color:var(--fs-p1-light)]`

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
  const { actions } = useLabels()

  return (
    <Link href="/cv" className={BLUE_OUTLINE}>
      {actions.cv}
    </Link>
  )
}

export function PortfolioLink() {
  const { actions } = useLabels()

  return (
    <Link {...ENGINE_LINK} className={BLUE_OUTLINE}>
      {actions.portfolio}
    </Link>
  )
}
