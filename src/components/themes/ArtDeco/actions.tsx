import Link from 'next/link'
import type { HeroActionSlot } from '@/components/cv/RecruiterHero'
import { useLabels } from '@/components/cv/CVDataProvider'

// The world's buttons: email is the gold primary action, everything else the gold outline.

const DECO_BUTTON =
  'inline-flex min-h-[44px] items-center justify-center px-5 py-2.5 text-sm uppercase tracking-wider motion-safe:transition-transform motion-safe:hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F0C850]'

export const GOLD_OUTLINE = `${DECO_BUTTON} border-2 border-[#D4AF37] text-[#D4AF37]`
const GOLD_FILL = `${DECO_BUTTON} border-2 border-[#F0C850] bg-[#D4AF37] text-[#0A2540]`

const HERO_ACTION_LOOK: Record<HeroActionSlot['id'], string> = {
  email: GOLD_FILL,
  linkedin: GOLD_OUTLINE,
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
    <Link href="/cv" className={GOLD_OUTLINE}>
      {actions.cv}
    </Link>
  )
}

export function PortfolioLink() {
  const { actions } = useLabels()
  return (
    <Link href="/personal-projects/game-engine" className={GOLD_OUTLINE}>
      {actions.portfolio}
    </Link>
  )
}
