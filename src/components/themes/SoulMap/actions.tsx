import Link from 'next/link'
import type { HeroActionSlot } from '@/components/cv/RecruiterHero'
import { useLabels } from '@/components/cv/CVDataProvider'
import world from './world.module.css'

// The world's actions, in the hero and again in the contact section: email, LinkedIn, the CV, and the
// link out to Nebulith. Email carries the rest point's warm lantern light; the rest are carved stone.

const BUTTON = `inline-flex min-h-[44px] items-center justify-center px-5 py-2 text-sm uppercase transition-colors motion-reduce:transition-none ${world.lettering}`

const HERO_ACTION_LOOK: Record<HeroActionSlot['id'], string> = {
  email: world.lanternLit,
  linkedin: world.stone,
}

export function HeroAction({ action }: { action: HeroActionSlot }) {
  return (
    <a {...action.linkProps} className={`${BUTTON} ${HERO_ACTION_LOOK[action.id]}`}>
      {action.label}
    </a>
  )
}

export function CVLink() {
  const { actions } = useLabels()

  return (
    <Link href="/cv" className={`${BUTTON} ${world.stone}`}>
      {actions.cv}
    </Link>
  )
}

export function EngineLink() {
  const { actions } = useLabels()

  return (
    <Link href="/personal-projects/game-engine" className={`${BUTTON} ${world.stone}`}>
      {actions.engine}
    </Link>
  )
}
