import Link from 'next/link'
import type { HeroActionSlot } from '@/components/cv/RecruiterHero'
import { useLabels } from '@/components/cv/CVDataProvider'
import look from './jungle.module.css'

// The jungle's buttons, in the hero and again on the contact sign: email is the sun gold primary, the
// rest are wooden. Each is 44px tall at least and has the world's gold focus ring.

const BUTTON = `inline-flex min-h-[44px] items-center justify-center rounded-xl px-5 py-2.5 text-base ${look.button} ${look.focus}`

export const GOLD_BUTTON = `${BUTTON} ${look.buttonGold}`
export const WOOD_BUTTON = `${BUTTON} ${look.buttonWood}`

const HERO_ACTION_LOOK: Record<HeroActionSlot['id'], string> = {
  email: GOLD_BUTTON,
  linkedin: WOOD_BUTTON,
}

export function JungleAction({ action }: { action: HeroActionSlot }) {
  return (
    <a {...action.linkProps} className={HERO_ACTION_LOOK[action.id]}>
      {action.label}
    </a>
  )
}

export function JungleCVLink() {
  const { actions } = useLabels()
  return (
    <Link href="/cv" className={WOOD_BUTTON}>
      {actions.cv}
    </Link>
  )
}

export function JunglePortfolioLink() {
  const { actions } = useLabels()
  return (
    <Link href="/personal-projects/game-engine" className={WOOD_BUTTON}>
      {actions.portfolio}
    </Link>
  )
}
