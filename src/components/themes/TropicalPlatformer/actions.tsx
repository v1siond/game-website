import Link from 'next/link'
import type { HeroActionSlot } from '@/components/cv/RecruiterHero'
import { useLabels } from '@/components/cv/CVDataProvider'
import { Crate, Gem } from './icons'
import world from './world.module.css'

// Tropical Platformer's chunky buttons, in the hero and again in the contact section: email is the ripe
// fruit primary action, LinkedIn and the CV the wooden crates, NEBULITH the gem.

const BUTTON = `inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md border-4 px-5 py-3 font-black tracking-widest transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[var(--tp-sun)] ${world.display} ${world.outlined}`

export const FRUIT_BUTTON = `${BUTTON} text-white border-[var(--tp-sun)] ${world.buttonFruit}`
export const CRATE_BUTTON = `${BUTTON} text-white border-[var(--tp-wood-light)] ${world.buttonWood}`
export const GEM_BUTTON = `${BUTTON} border-[var(--tp-gem-blue)] text-[var(--tp-gem-blue)] ${world.buttonGem}`

const HERO_ACTION_LOOK: Record<HeroActionSlot['id'], string> = {
  email: FRUIT_BUTTON,
  linkedin: CRATE_BUTTON,
}

export function HeroAction({ action }: { action: HeroActionSlot }) {
  return (
    <a {...action.linkProps} className={HERO_ACTION_LOOK[action.id]}>
      {action.id === 'email' ? <Gem size={20} color="yellow" /> : <Crate size={20} />}
      {action.label}
    </a>
  )
}

export function CVLink() {
  const { actions } = useLabels()
  return (
    <Link href="/cv" className={CRATE_BUTTON}>
      <Crate size={20} />
      {actions.cv}
    </Link>
  )
}

export function NebulithLink() {
  const { actions } = useLabels()
  return (
    <Link href="/personal-projects/game-engine" className={GEM_BUTTON} aria-label={actions.viewEngine}>
      <Gem size={22} color="blue" />
      {actions.engine.toUpperCase()}
    </Link>
  )
}
