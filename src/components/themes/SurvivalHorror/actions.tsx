import Link from 'next/link'
import type { HeroActionSlot } from '@/components/cv/RecruiterHero'
import { useLabels } from '@/components/cv/CVDataProvider'
import look from './world.module.css'
import { ENGINE_LINK } from '@/lib/engineLink'

// The world's buttons, typed labels on worn plates: email is the lit rust plate, LinkedIn, the CV and the
// portfolio the plain dark ones.

const PLATE = `inline-flex min-h-[44px] items-center justify-center border-2 px-4 py-2 text-sm uppercase motion-safe:transition-colors ${look.typed} ${look.focus}`

const LIT = `${PLATE} border-[color:var(--sh-brass)] bg-[color:var(--sh-rust)] text-[color:var(--sh-ivory)] hover:bg-[color:var(--sh-wood)]`
const PLAIN = `${PLATE} border-[color:var(--sh-wood)] bg-[color:var(--sh-paper)] text-[color:var(--sh-cream)] hover:border-[color:var(--sh-brass)]`

const HERO_ACTION_LOOK: Record<HeroActionSlot['id'], string> = {
  email: LIT,
  linkedin: PLAIN,
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
    <Link href="/cv" className={PLAIN}>
      {actions.cv}
    </Link>
  )
}

export function PortfolioLink() {
  const { actions } = useLabels()

  return (
    <Link {...ENGINE_LINK} className={PLAIN}>
      {actions.portfolio}
    </Link>
  )
}

// A small typed button inside a card, the plain plate at card scale.
export const CARD_BUTTON = `inline-flex min-h-[44px] items-center gap-2 border px-3 text-sm uppercase ${look.typed} ${look.focus}`
