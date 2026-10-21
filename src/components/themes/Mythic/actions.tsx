import Link from 'next/link'
import type { HeroActionSlot } from '@/components/cv/RecruiterHero'
import { useLabels } from '@/components/cv/CVDataProvider'
import world from './world.module.css'

// The world's actions, in the hero and again in the contact section: email, LinkedIn, the CV, and the
// link out to Nebulith, cut as stone tablets.

const TABLET = `inline-flex min-h-[44px] items-center justify-center border-2 px-5 py-2 text-sm transition-transform hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:transform-none ${world.carved}`

// Email is the fired clay action, LinkedIn and the CV the outlined ones, Nebulith the black figure one.
const LOOK = {
  clay: 'border-[color:var(--myth-ink)] bg-[var(--myth-terracotta-deep)] text-[color:var(--myth-marble)]',
  outline: 'border-[color:var(--myth-ink)] bg-[var(--myth-marble)] text-[color:var(--myth-ink)]',
  ink: 'border-[color:var(--myth-gold)] bg-[var(--myth-ink)] text-[color:var(--myth-marble)]',
}

const HERO_ACTION_LOOK: Record<HeroActionSlot['id'], string> = {
  email: LOOK.clay,
  linkedin: LOOK.outline,
}

export function HeroAction({ action }: { action: HeroActionSlot }) {
  return (
    <a {...action.linkProps} className={`${TABLET} ${HERO_ACTION_LOOK[action.id]}`}>
      {action.label}
    </a>
  )
}

export function CVLink() {
  const { actions } = useLabels()

  return (
    <Link href="/cv" className={`${TABLET} ${LOOK.outline}`}>
      {actions.cv}
    </Link>
  )
}

export function EngineLink() {
  const { actions } = useLabels()

  return (
    <Link href="/personal-projects/game-engine" className={`${TABLET} ${LOOK.ink}`}>
      {actions.engine}
    </Link>
  )
}
