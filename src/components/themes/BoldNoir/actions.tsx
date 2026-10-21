import Link from 'next/link'
import type { HeroActionSlot } from '@/components/cv/RecruiterHero'
import { useLabels } from '@/components/cv/CVDataProvider'

// The world's actions, in the hero and again in the contact section: email, LinkedIn, the CV, and the
// link out to Nebulith.

const NOIR_BUTTON =
  'inline-flex min-h-[44px] items-center justify-center border-[3px] px-5 py-2 text-lg uppercase tracking-widest transition-transform hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:transform-none'

// Email is the red action, LinkedIn and the CV the paper outlined ones, Nebulith the solid paper one.
const LOOK = {
  red: 'border-[color:var(--noir-red)] bg-[color:var(--noir-red)] text-[color:var(--noir-ink)]',
  outline: 'border-[color:var(--noir-paper)] bg-transparent text-[color:var(--noir-paper)] hover:bg-[color:var(--noir-paper)] hover:text-[color:var(--noir-ink)]',
  paper: 'border-[color:var(--noir-paper)] bg-[color:var(--noir-paper)] text-[color:var(--noir-ink)]',
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
  const { actions } = useLabels()

  return (
    <Link href="/cv" className={`${NOIR_BUTTON} ${LOOK.outline}`}>
      {actions.cv}
    </Link>
  )
}

export function EngineLink() {
  const { actions } = useLabels()

  return (
    <Link href="/personal-projects/game-engine" className={`${NOIR_BUTTON} ${LOOK.paper}`}>
      {actions.engine}
    </Link>
  )
}
